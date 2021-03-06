import * as moment from 'moment';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { ReplaySubject } from 'rxjs/Rx';
import { AUPostcodeSearchComponent } from './../../internal/grid-search/iCABSAAUPostcodeSearch';
import { setTimeout } from 'timers';
import { SMSMessagesGridComponent } from './../../customer-contact-management/Communications/SMSMessages/iCABSCMSMSMessagesGrid.component';
import { PromptModalComponent } from './../../../shared/components/prompt-modal/prompt-modal';
import { Validators, FormControl } from '@angular/forms';
import { PostCodeUtils } from './../../../shared/services/postCode-utility';
import { LookUpData } from './../../../shared/services/lookup';
import { SpeedScript } from './../../../shared/services/speedscript';
import { RiTab } from './../../../shared/services/riMaintenancehelper';
import { MaritalStatusSearchComponent } from './../../internal/search/iCABSSMaritalStatusSearch.component';
import { OccupationSearchComponent } from './../../internal/search/iCABSSOccupationSearch.component';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { Subscription, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, Injector, AfterViewInit, Renderer } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams, Http } from '@angular/http';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';

@Component({
    templateUrl: 'iCABSBEmployeeMaintenance.html',
    styles: [
        `.red-bdr span {border-color: transparent !important;}
    `]

})

export class EmployeeMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('EmployeeCode') public formControlEmployeeCode;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('promptOKCancelModal') public promptOKCancelModal;
    @ViewChild('employeeSearchEllipsis') employeeSearchEllipsis: EllipsisComponent;
    @ViewChild('occupationSearchEllipsis') occupationSearchEllipsis: EllipsisComponent;
    @ViewChild('supervisorEmployeeEllipsis') supervisorEmployeeEllipsis: EllipsisComponent;
    @ViewChild('vehicleClassEllipsis') vehicleClassEllipsis: EllipsisComponent;
    @ViewChild('postcodeSearchEllipsis') postcodeSearchEllipsis: EllipsisComponent;
    @ViewChild('riPostcodeSearchEllipsis') riPostcodeSearchEllipsis: EllipsisComponent;

    public pageId: string = '';
    public employeeId: string = '';
    public autoOpen: boolean = true;
    public promptTitle: string = '';
    public promptContent: string = '';
    private lookUpSubscription: Subscription;
    private promptMode: string = '';
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public isRequesting: boolean = false;
    public riMaintenanceCancelEvent = false;
    public validateLeaveEntitlement: boolean = false;
    public validatePreviousService: boolean = false;

    public muleConfig = {
        method: 'people/admin',
        module: 'employee',
        operation: 'Business/iCABSBEmployeeMaintenance',
        contentType: 'application/x-www-form-urlencoded'
    };

    public ellipsisConfig = {
        employeeSearch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': true,
                'countryCode': '',
                'businessCode': '',
                'negativeBranchNumber': '',
                'negBranchNumber': '',
                'serviceBranchNumber': '',
                'branchNumber': '',
                'salesBranchNumber': '',
                'OccupationCode': '',
                'NewServiceBranchNumber': '',
                'NewNegBranchNumber': '',
                action: 0
            },
            modalConfig: '',
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        occupationSearch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': true,
                'countryCode': '',
                'businessCode': '',
                'negativeBranchNumber': ''
            },
            modalConfig: '',
            contentComponent: OccupationSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        maritalStatusSearch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': true,
                'countryCode': '',
                'businessCode': '',
                'negativeBranchNumber': ''
            },
            modalConfig: '',
            contentComponent: MaritalStatusSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        supervisorEmp: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-Supervisor-All',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': true,
                'countryCode': '',
                'businessCode': '',
                'negativeBranchNumber': ''
            },
            modalConfig: '',
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        userCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': '',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': true,
                'countryCode': '',
                'businessCode': '',
                'negativeBranchNumber': ''
            },
            modalConfig: '',
            contentComponent: '',
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        riMUserInformationSearch: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': '',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': true
            },
            modalConfig: '',
            contentComponent: ScreenNotReadyComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        vehicleClass: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': '',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': true
            },
            modalConfig: '',
            contentComponent: ScreenNotReadyComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        languageCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': '',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': true
            },
            modalConfig: '',
            contentComponent: ScreenNotReadyComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        },
        riPostcodeSearch: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Account',
                'currentContractType': '',
                'showAddNew': false,
                'showCountry': false,
                'showBusiness': false,
                'countryCode': this.utils.getCountryCode(),
                'businessCode': this.utils.getBusinessCode(),
                'accountNumber': '',
                'accountName': ''
            },
            component: ScreenNotReadyComponent
        },
        postcodeSearch: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Account',
                'currentContractType': '',
                'showAddNew': false,
                'showCountry': false,
                'showBusiness': false,
                'countryCode': this.utils.getCountryCode(),
                'businessCode': this.utils.getBusinessCode(),
                'accountNumber': '',
                'accountName': '',
                'Town': '',
                'State': '',
                'Postcode': ''
            },
            component: AUPostcodeSearchComponent
        }
    };

    public dropdownConfig = {
        branchSearch: {
            isDisabled: false,
            inputParams: {},
            selected: { id: '', text: '' }
        },
        maritalSearch: {
            isDisabled: false,
            inputParams: { 'parentMode': '', 'ContractTypeCode': '', 'businessCode': '', 'countryCode': '', action: 0 },
            selected: { id: '', text: '' }
        },
        genderSearch: {
            isDisabled: false,
            inputParams: { 'parentMode': '', 'ContractTypeCode': '', 'businessCode': '', 'countryCode': '', action: 0 },
            selected: { id: '', text: '' }
        }
    };

    public datepicker = {
        DateOfBirth:
        {
            value: '',
            clearDate: true,
            isDisabled: false,
            isRequired: true
        },
        DateJoined:
        {
            value: '',
            clearDate: true,
            isDisabled: false,
            isRequired: false
        },
        FirstAidReviewDate:
        {
            value: '',
            clearDate: true,
            isDisabled: false,
            isRequired: false
        },
        DrivingLicenceExpiryDate:
        {
            value: '',
            clearDate: true,
            isDisabled: false,
            isRequired: false
        },
        DateLeft:
        {
            value: '',
            clearDate: true,
            isDisabled: false,
            isRequired: false
        },
        TabletReloadFromDate:
        {
            value: '',
            clearDate: true,
            isDisabled: false,
            isRequired: false
        }

    };

    public translatedMessageList = {
        'Details': 'Details',
        'General': 'General',
        'Contact': 'Contact',
        'Address': 'Address',
        'Next_Of_Kin': 'Next Of Kin',
        'Vehicle': 'Vehicle',
        'Left': 'Left',
        'Service_Details': 'Service Details',
        'Branch': 'Branch',
        'Home': 'Home',
        'Qualifications': 'Qualifications',
        'cmdReload': 'Reload To Tablet',
        'cmdGetAddress1': 'Get Address',
        'cmdGeocode': 'Geocode',
        'cmdCopyAddress': 'Same As Employee',
        'cmdGetAddress2': 'Get Address',
        'btnDefault': 'Default from Branch',
        'Please_Enter_Working_Hours': 'Please Enter Working Hours For All Fields.',
        'No_Start_Time_or_End_Time': 'No Start Time or End Time is Entered',
        'Minutes_Entered_Cannot': 'Minutes Entered Cannot Be Greater Than 59',
        'Warning': 'Warning',
        'This_will_retrieve_the_default': 'This will retrieve the default Working Hours from Branch. Do you wish to Continue?',
        'Working_Hours': 'Working Hours',
        'Unable_to_Geocode_Address': 'Unable to Geocode Address'
    };

    public virtualTableField: any = {};
    public storeData: any = {};
    public storeVirtualData: any = {};
    public showAddNew: boolean = true;
    public actionMode: number = 0;
    public capitalizeFirstLetterField: any = {};
    public capitalizeField: any = {};
    public timeField: any = {};
    public currentTab: number = 0;
    public addModeStatusFlag: boolean = false;

    public controls = [
        { name: 'EmployeeCode', readonly: false, disabled: false, required: true },
        // tab - grddetails
        { name: 'EmployeeForename1', readonly: false, disabled: false, required: false },
        { name: 'EmployeeForename2', readonly: false, disabled: false, required: false },
        { name: 'EmployeeForename3', readonly: false, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: false, disabled: false, required: false },
        { name: 'BranchNumber', readonly: false, disabled: false, required: false },
        { name: 'BranchName', readonly: false, disabled: false, required: false },
        { name: 'OccupationCode', readonly: false, disabled: false, required: false },
        { name: 'OccupationDesc', readonly: true, disabled: true, required: false },
        { name: 'RealPerson', readonly: false, disabled: false, required: false },
        { name: 'SupervisorEmployeeCode', readonly: false, disabled: false, required: false },
        { name: 'SupervisorSurname', readonly: false, disabled: true, required: false },
        { name: 'MaritalStatusCode', readonly: false, disabled: false, required: false },
        { name: 'MaritalStatusDesc', readonly: false, disabled: false, required: false },
        { name: 'GenderCode', readonly: false, disabled: false, required: false },
        { name: 'GenderDesc', readonly: false, disabled: false, required: false },

        // tab -  grdContact
        { name: 'WorkEmail', readonly: false, disabled: false, required: false },
        { name: 'SMSMessageNumber', readonly: false, disabled: false, required: false },
        { name: 'TelephoneNumber', readonly: false, disabled: false, required: false },
        { name: 'SecondaryContactNumber', readonly: false, disabled: false, required: false },
        { name: 'LanguageCode', readonly: false, disabled: false, required: false },
        { name: 'LanguageDescription', readonly: false, disabled: true, required: false },

        // tab - grdGeneral
        { name: 'Grade', readonly: false, disabled: false, required: false },
        { name: 'UserCode', readonly: false, disabled: false, required: false },
        { name: 'UserName', readonly: false, disabled: true, required: false },
        { name: 'DateOfBirth', readonly: false, disabled: false, required: false },
        { name: 'DateJoined', readonly: false, disabled: false, required: false },
        { name: 'PreviousService', readonly: false, disabled: false, required: false },
        { name: 'LeaveEntitlement', readonly: false, disabled: false, required: false },
        { name: 'ContractReceived', readonly: false, disabled: false, required: false },
        { name: 'CommissionValid', readonly: false, disabled: false, required: false },
        { name: 'PendingDeliveryValid', readonly: false, disabled: false, required: false },
        { name: 'FirstAider', readonly: false, disabled: false, required: false },
        { name: 'FirstAidReviewDate', readonly: false, disabled: false, required: false },
        { name: 'EarliestStartTime', readonly: false, disabled: false, required: false },
        { name: 'FixedBreakTime', readonly: false, disabled: false, required: false },
        { name: 'RecordMileageInd', readonly: false, disabled: false, required: false },
        { name: 'TabletUserInd', readonly: false, disabled: false, required: false },
        { name: 'GoogleCalendarEnabled', readonly: false, disabled: false, required: false },
        { name: 'ExternalID', readonly: false, disabled: false, required: false },
        { name: 'TabletReloadFromDate', readonly: false, disabled: false, required: false },
        { name: 'riTimezoneCodeSelect', readonly: false, disabled: false, required: false },
        { name: 'LOSCodeSelect', readonly: false, disabled: false, required: false },


        { name: 'cmdReload', value: 'Reload To Tablet', readonly: false, disabled: false, required: false },
        // div - grdAddress

        { name: 'EmployeeAddressLine1', readonly: false, disabled: false, required: false },
        { name: 'EmployeeAddressLine2', readonly: false, disabled: false, required: false },
        { name: 'EmployeeAddressLine3', readonly: false, disabled: false, required: false },
        { name: 'EmployeeAddressLine4', readonly: false, disabled: false, required: false },
        { name: 'EmployeeAddressLine5', readonly: false, disabled: false, required: false },
        { name: 'EmployeePostcode', readonly: false, disabled: false, required: false },
        { name: 'StartWorkFromHomeInd', readonly: false, disabled: false, required: false },
        { name: 'HomeGPSCoordinateX', readonly: false, disabled: false, required: false },
        { name: 'HomeGPSCoordinateY', readonly: false, disabled: false, required: false },
        { name: 'RoutingGeonode', readonly: false, disabled: false, required: false },
        { name: 'RoutingScore', readonly: false, disabled: false, required: false },
        { name: 'HomeTelephone', readonly: false, disabled: false, required: false },
        { name: 'MobileTelephone', readonly: false, disabled: false, required: false },
        { name: 'HomeEmail', readonly: false, disabled: false, required: false },
        { name: 'cmdGeocode', value: 'Geocode', readonly: false, disabled: false, required: false },
        { name: 'cmdGetAddress1', value: 'Get Address', readonly: false, disabled: false, required: false },
        { name: 'SelRoutingSource', readonly: false, disabled: false, required: false },


        //div 5  grdNoKAddress
        { name: 'NoKRelationship', readonly: false, disabled: false, required: false },
        { name: 'NoKName', readonly: false, disabled: false, required: false },
        { name: 'NoKAddressLine1', readonly: false, disabled: false, required: false },
        { name: 'NoKAddressLine2', readonly: false, disabled: false, required: false },
        { name: 'NoKAddressLine3', readonly: false, disabled: false, required: false },
        { name: 'NoKAddressLine4', readonly: false, disabled: false, required: false },
        { name: 'NoKAddressLine5', readonly: false, disabled: false, required: false },
        { name: 'NoKPostcode', readonly: false, disabled: false, required: false },
        { name: 'NoKHomeTelephone', readonly: false, disabled: false, required: false },
        { name: 'NoKOtherTelephone', readonly: false, disabled: false, required: false },
        { name: 'cmdCopyAddress', value: 'Same As Employee', readonly: false, disabled: false, required: false },
        { name: 'cmdGetAddress2', value: 'Get Address', readonly: false, disabled: false, required: false },


        // div 6 grdVehicle
        { name: 'ClassType', readonly: false, disabled: false, required: false },
        { name: 'VehicleRegistration', readonly: false, disabled: false, required: false },
        { name: 'PetrolCardNumber', readonly: false, disabled: false, required: false },
        { name: 'DrivingLicenceNumber', readonly: false, disabled: false, required: false },
        { name: 'DrivingLicenceExpiryDate', readonly: false, disabled: false, required: false },

        //grdLeft
        { name: 'DateLeft', readonly: false, disabled: false, required: false },
        { name: 'LeavingReason', readonly: false, disabled: false, required: false },

        // div - grdSDetails
        { name: 'Occupation', readonly: false, disabled: false, required: false },
        { name: 'WindowStart01', readonly: false, disabled: false, required: false },
        { name: 'WindowEnd01', readonly: false, disabled: false, required: false },
        { name: 'WindowDayInd01', readonly: false, disabled: false, required: false },
        { name: 'WindowStart02', readonly: false, disabled: false, required: false },
        { name: 'WindowEnd02', readonly: false, disabled: false, required: false },
        { name: 'WindowDayInd02', readonly: false, disabled: false, required: false },
        { name: 'WindowStart03', readonly: false, disabled: false, required: false },
        { name: 'WindowEnd03', readonly: false, disabled: false, required: false },
        { name: 'WindowDayInd03', readonly: false, disabled: false, required: false },
        { name: 'WindowStart04', readonly: false, disabled: false, required: false },
        { name: 'WindowEnd04', readonly: false, disabled: false, required: false },
        { name: 'WindowDayInd04', readonly: false, disabled: false, required: false },
        { name: 'WindowStart05', readonly: false, disabled: false, required: false },
        { name: 'WindowEnd05', readonly: false, disabled: false, required: false },
        { name: 'WindowDayInd05', readonly: false, disabled: false, required: false },
        { name: 'WindowStart06', readonly: false, disabled: false, required: false },
        { name: 'WindowEnd06', readonly: false, disabled: false, required: false },
        { name: 'WindowDayInd06', readonly: false, disabled: false, required: false },
        { name: 'WindowStart07', readonly: false, disabled: false, required: false },
        { name: 'WindowEnd07', readonly: false, disabled: false, required: false },
        { name: 'WindowDayInd07', readonly: false, disabled: false, required: false },
        { name: 'StdHoursPerDay', readonly: false, disabled: false, required: false },
        { name: 'PersonalDrivingTime', readonly: false, disabled: false, required: false },
        { name: 'ManpowerPlanning', readonly: false, disabled: false, required: false },
        { name: 'MaxOTPerDay', readonly: false, disabled: false, required: false },
        { name: 'AvgDrivingWorkDay', readonly: false, disabled: false, required: false },
        { name: 'MaxHoursPerWeek', readonly: false, disabled: false, required: false },
        { name: 'AverageSickness', readonly: false, disabled: false, required: false },
        { name: 'StandardBreakTime', readonly: false, disabled: false, required: false },
        { name: 'PDAWorkLoadSel', value: 'Weekly', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation7Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation7Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation1Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation1Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation2Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation2Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation3Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation3Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation4Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation4Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation5Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation5Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation6Sel', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation6Sel', readonly: false, disabled: false, required: false },

        { name: 'btnDefault', value: 'Default from Branch', readonly: false, disabled: false, required: false },

        //  tab -hidden
        { name: 'EmployeeStartLocation1', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation2', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation3', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation4', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation5', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation6', readonly: false, disabled: false, required: false },
        { name: 'EmployeeStartLocation7', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation1', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation2', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation3', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation4', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation5', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation6', readonly: false, disabled: false, required: false },
        { name: 'EmployeeEndLocation7', readonly: false, disabled: false, required: false },
        { name: 'RoutingSource', readonly: false, disabled: false, required: false },
        { name: 'riTimezoneCode', readonly: false, disabled: false, required: false },
        { name: 'AddressError', readonly: false, disabled: false, required: false },
        { name: 'OccWarningMessage', readonly: false, disabled: false, required: false },
        { name: 'VRegWarningMessage', readonly: false, disabled: false, required: false },
        { name: 'PDAWorkLoad', readonly: false, disabled: false, required: false },
        { name: 'LOSCode', readonly: false, disabled: false, required: false },
        { name: 'OccupationIsAllow', readonly: false, disabled: false, required: false },

        { name: 'menu', value: '', readonly: false, disabled: false, required: false }

    ];


    //public translatedMessageList: any = {};

    public saveBtn: boolean = false;
    public showControlBtn: boolean = true;
    public selectedData: any;

    public queryParams: URLSearchParams;
    public tab: any;
    public riTab: any;
    public ttriTimezone: Array<any> = [];
    public ttLineOfService: Array<any> = [];
    public fieldVisibility: any = {
        'trTabletReload': false,
        'OccupationCode': false,
        'cmdGetAddress1': true,
        'cmdGetAddress2': true,
        'cmdGeocode': true,
        'RoutingGeonode': true,
        'RoutingScore': true,
        'btnDefault': false,

        'EmployeeEndLocation6Sel': false,
        'EmployeeStartLocation6Sel': false,
        'WindowStart07': false,
        'WindowEnd07': false,
        'WindowDayInd07': false,

        'StdHoursPerDay': false,
        'PersonalDrivingTime': false,

        'trWH02': false,
        'ManpowerPlanning': false,
        'MaxOTPerDay': false,
        'AvgDrivingWorkDay': false,

        'trWH03': false,
        'MaxHoursPerWeek': false,
        'AverageSickness': false,

        'trWH04': false,
        'StandardBreakTime': false,
        'tdOccupationCode': false,
        'tdSales': false
    };
    public fieldRequired: any = {
        'EmployeeCode': true,
        'EmployeeForename1': true,
        'EmployeeForename2': false,
        'EmployeeForename3': false,
        'EmployeeSurname': true,
        'BranchNumber': true,
        'BranchName': false,
        'OccupationCode': false,
        'OccupationDesc': false,
        'RealPerson': false,
        'SupervisorEmployeeCode': false,
        'SupervisorSurname': false,
        'MaritalStatusCode': false,
        'MaritalStatusDesc': false,
        'GenderCode': true,
        'GenderDesc': false,
        'DateOfBirth': true
    };
    public menuOptionList: any[] = [];

    public tabList: any = {};

    public promptConfig = {
        forSave: {
            showPromptMessageHeader: true,
            promptConfirmTitle: '',
            promptConfirmContent: MessageConstant.Message.ConfirmRecord
        },
        promptFlag: 'save',
        config: {
            ignoreBackdropClick: true
        },
        afterSave: {
            showPromptMessageHeader: true,
            promptConfirmTitle: '',
            promptConfirmContent: ''
        },
        OKCancel: {
            showPromptMessageHeader: true,
            promptConfirmTitle: '',
            promptConfirmContent: ''
        }
    };

    constructor(injector: Injector,
        public SpeedScript: SpeedScript,
        private renderer: Renderer) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBEMPLOYEEMAINTENANCE;
        this.pageTitle = '';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            let data = { EmployeeCode: this.uiForm.controls['EmployeeCode'].value };
            this.onEmployeeSearchDataReceived(data, false);
        } else {
            this.promptTitle = MessageConstant.Message.ConfirmRecord;
            this.pageParams.deleteMode = false;
            this.pageParams.updateMode = false;
            this.pageParams.addMode = false;
            this.pageParams.searchMode = true;
            this.pageParams.normalMode = false;
        }

        String.prototype['capitalizeFirstLetter'] = function (): void {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.fetchTranslationContent();

        this.loadSpeedScriptData();
        this.zone.run(() => {
            this.tabDraw();
        });
    }
    public ngOnDestroy(): void {
        //TODO:
    }

    public ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
            let data = { EmployeeCode: this.uiForm.controls['EmployeeCode'].value };
            this.onEmployeeSearchDataReceived(data, false);
        } else {
            if ((this.autoOpen === true) && !this.parentMode) {
                this.ellipsisConfig.employeeSearch.autoOpen = true;
                this.autoOpen = false;
            }
        }
    }

    public tabDraw(): any {
        this.tabList = {
            tab1: { id: 'grdDetails', name: this.translatedMessageList['Details'], visible: true, active: true },
            tab2: { id: 'grdGeneral', name: this.translatedMessageList['General'], visible: true, active: false },
            tab3: { id: 'grdContact', name: this.translatedMessageList['Contact'], visible: true, active: false },
            tab4: { id: 'grdAddress', name: this.translatedMessageList['Address'], visible: true, active: false },
            tab5: { id: 'grdNoKAddress', name: this.translatedMessageList['Next_Of_Kin'], visible: true, active: false },
            tab6: { id: 'grdVehicle', name: this.translatedMessageList['Vehicle'], visible: true, active: false },
            tab7: { id: 'grdLeft', name: this.translatedMessageList['Left'], visible: true, active: false },
            tab8: { id: 'grdSDetails', name: this.translatedMessageList['Service_Details'], visible: true, active: false }
        };

        this.riTab = new RiTab(this.tabList, this.utils);
        this.tab = this.riTab.tabObject;
    }

    /* ----- Date Formatting Method ---- */
    public convertNewDate(getDate: any): any {
        let tempDateString: any = this.globalize.parseDateToFixedFormat(getDate);
        return this.globalize.parseDateStringToDate(tempDateString);
    }

    public modalHiddenEmployeeSearch(): void {
        //TODO:
    }
    public modalHiddenUserCode(): void {
        //TODO:
    }

    public onAddMode(): void {
        this.addModeStatusFlag = true;
        this.capitalizeFirstLetterField = {};
        this.capitalizeField = {};
        this.timeField = {};
        this.storeData = {};
        this.riMaintenanceCancelEvent = false;
        this.parentMode = '';
        this.showControlBtn = true;
        this.saveBtn = true;
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.actionMode = 1;
        this.showControlBtn = true;
        this.cbbService.disableComponent(true);
        this.pageParams.updateMode = false;
        this.pageParams.addMode = true;
        this.pageParams.searchMode = false;
        this.uiForm.reset();
        this.autoOpen = false;
        this.processForm();
        this.loadUIFields();
        this.setTranslatedTextForButtons();
        this.uiForm.controls['menu'].disable();
        this.uiForm.controls['menu'].setValue('');
        this.ellipsisConfig.employeeSearch.disabled = false;
        this.ellipsisConfig.riMUserInformationSearch.disabled = false;
        this.riMaintenance_BeforeMode();
        this.riMaintenance_BeforeAddMode();
        this.focusToFirstTab();
        setTimeout(() => {
            this.clearErrorTabs();
            this.formControlEmployeeCode.nativeElement.focus();
            this.uiForm.controls['EmployeeCode'].reset();
            this.uiForm.controls['EmployeeForename1'].reset();
            this.addModeStatusFlag = false;
            this.formPristine();
        }, 200);
    }

    public onEmployeeSearchDataReceived(data: any, route: any): void {
        this.addModeStatusFlag = false;
        this.capitalizeFirstLetterField = {};
        this.capitalizeField = {};
        this.timeField = {};
        this.storeData = {};
        this.cbbService.disableComponent(true);
        this.selectedData = data;
        this.ellipsisConfig.employeeSearch.disabled = false;
        this.uiForm.controls['EmployeeCode'].setValue(data.EmployeeCode);
        let queryParams = {
            'EmployeeCode': data.EmployeeCode,
            'SCManpowerPlanning': this.pageParams.vSCManpowerPlanning || false
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('', queryParams).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e['errorMessage']) {
                        this.errorModal.show(e, true);
                    } else {
                        if (e) {
                            this.storeData = e;
                            this.onUpdateMode(e);
                        }
                    }
                }

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            }
        );
    }
    public onUpdateMode(data: any): any {
        this.actionMode = 2;
        this.pageParams.updateMode = true;
        this.pageParams.addMode = false;
        this.pageParams.searchMode = false;
        this.showControlBtn = true;
        this.saveBtn = true;
        this.storeData = data;
        this.resetUIForm();
        this.processForm();
        this.loadUIFields();
        this.setFormData(data);
        this.loadVirtualTableData();
        this.riMaintenance_AfterFetch();
        this.riMaintenance_BeforeMode();
        this.riMaintenance_BeforeUpdateMode();
        this.uiForm.updateValueAndValidity();
        this.focusToFirstTab();
        setTimeout(() => {
            this.formPristine();
            this.clearErrorTabs();
        }, 200);
    }

    public onDelete(): void {
        event.preventDefault();
        this.riMaintenanceCancelEvent = false;
        this.parentMode = '';
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.showControlBtn = true;
        this.actionMode = 3;

        this.riMaintenance_BeforeMode();

        if (this.uiForm.controls['EmployeeCode'].value) {
            this.promptConfig.forSave.promptConfirmContent = MessageConstant.Message.DeleteRecord;
            this.promptModal.show();
        }
    }

    public onMaritalSearch(data: any): void {
        this.uiForm.controls['MaritalStatusCode'].setValue(data.MaritalStatusCode || '');
        if (data.Object) {
            this.uiForm.controls['MaritalStatusDesc'].setValue(data.Object.MaritalStatusDesc || '');
        }
    }
    public onGenderCodeSearch(data: any): void {
        this.uiForm.controls['GenderCode'].setValue(data.GenderCode || '');
        if (data.Object) {
            this.uiForm.controls['GenderDesc'].setValue(data.Object.GenderDesc || '');
        }
    }


    public onEllipsisSearchDataReceived(data: any, route: any, nodeName?: any): void {
        switch (nodeName) {
            case 'OccupationCode':
                let oldValue = this.uiForm.controls['OccupationCode'].value;
                this.uiForm.controls['OccupationCode'].setValue(data.OccupationCode);
                this.uiForm.controls['OccupationDesc'].setValue(data.OccupationDesc || '');
                this.uiForm.controls['Occupation'].setValue(this.uiForm.controls['OccupationDesc'].value);

                if (oldValue !== data.OccupationCode) {
                    this.riExchange_CBORequest(true, false);
                }
                break;
            case 'SupervisorEmployeeCode':
                this.uiForm.controls['SupervisorEmployeeCode'].setValue(data.SupervisorEmployeeCode);
                this.uiForm.controls['SupervisorSurname'].setValue(data.SupervisorSurname || '');
                break;
            default:
                break;
        }
    }

    public onBranchSearchReceived(data: any): void {
        this.uiForm.controls['BranchNumber'].setValue(data.BranchNumber || '');
        this.uiForm.controls['BranchName'].setValue(data.BranchName || '');
    }

    public onDateSelectedValue(dateObj: any, id?: any): void {
        if (dateObj) {
            if (id && this.uiForm.controls.hasOwnProperty(id)) {
                this.riExchange.riInputElement.SetValue(this.uiForm, id, dateObj.value ? dateObj.value : '');
            }
        }
    }

    public loadSpeedScriptData(): any {
        this.getSysCharDtetails();
        this.loadTempTableData();
    }


    public getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact,
            this.sysCharConstants.SystemCharEnableRouteOptimisationSoftwareIntegration,
            this.sysCharConstants.SystemCharEnableSOPProspects,
            this.sysCharConstants.SystemCharManpowerPlanning
        ];
        let sysCharIP = {
            module: this.muleConfig.module,
            operation: this.muleConfig.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.pageParams.vCountryCode,
            SysCharList: sysCharList.toString()
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.SpeedScript.sysChar(sysCharIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            let records = data.records;
            this.pageParams.vSCEnableHopewiserPAF = records[0].Required ? records[0].Required : false;
            this.pageParams.vSCEnableDatabasePAF = records[1].Required ? records[1].Required : false;
            this.pageParams.vSCAddressLine3Required = records[2].Required ? records[2].Required : false;
            this.pageParams.vSCAddressLine3Logical = records[2].Logical ? records[2].Required : false;
            this.pageParams.vSCAddressLine4Required = records[3].Required ? records[3].Required : false;
            this.pageParams.vSCAddressLine5Required = records[4].Required ? records[4].Required : false;
            this.pageParams.vSCAddressLine5Logical = records[4].Logical ? records[4].Required : false;
            this.pageParams.vSCPostCodeRequired = records[5].Required ? records[5].Required : false;
            this.pageParams.vSCPostCodeMustExistInPAF = records[6].Required ? records[6].Required : false;
            this.pageParams.vSCRunPAFSearchOn1stAddressLine = records[7].Required ? records[7].Required : false;
            this.pageParams.vSCCapitalFirstLtr = records[8].Required ? records[8].Required : false;
            this.pageParams.vbEnableRouteOptimisation = records[9].Required ? records[9].Required : false;
            this.pageParams.vSCEnableSOPProspects = records[10].Required ? records[10].Required : false;
            this.pageParams.vSCManpowerPlanning = records[11].Required ? records[11].Required : false;

            this.window_onload();
            this.processForm();
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }

    public loadTempTableData(): void {
        this.ttriTimezone = [];
        this.ttLineOfService = [];
        let gLanguageCode = this.riExchange.LanguageCode();
        let data = [
            {
                'table': 'riTimezone',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BusinessCode', 'riTimezoneCode', 'riTimezoneSystemDesc', 'ServerToUTCInd']
            },
            {
                'table': 'riTimezoneLang',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': gLanguageCode },
                'fields': ['BusinessCode', 'riTimezoneCode', 'riTimezoneDesc']
            },
            {
                'table': 'LineOfService',
                'query': { 'ValidForBusiness': this.utils.getBusinessCode() },
                'fields': ['LOSCode', 'LOSName']
            }
        ];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(data, 500).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                if (e && e.length > 0) {

                    if (e && e[0].length > 0) {
                        let riTimezone: any[] = e[0];
                        let riTimezoneLang: any[] = [];
                        if (e.length > 1 && e[1].length > 0) {
                            riTimezoneLang = e[1];
                        }

                        riTimezone.forEach(item => {
                            if (item['ServerToUTCInd'] === false) {
                                let filterData = riTimezoneLang.find(langObj => (langObj.riTimezoneCode === item.riTimezoneCode));
                                this.ttriTimezone.push({
                                    'riTimezoneCode': item.riTimezoneCode,
                                    'riTimezoneDesc': (filterData) ? filterData.riTimezoneDesc : item.riTimezoneSystemDesc
                                });
                            }

                        });


                    }

                    if (e && e[2].length > 0) {
                        let lineOfService: any[] = e[2];
                        lineOfService.forEach(item => {
                            this.ttLineOfService.push({
                                'LOSCode': item.LOSCode,
                                'LOSName': item.LOSName
                            });
                        });
                    }
                }

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }

    public loadVirtualTableData(): void {

        let gLanguageCode = this.riExchange.LanguageCode();
        let data = [
            {
                'table': 'MaritalStatus',
                'query': { 'MaritalStatusCode': this.uiForm.controls['MaritalStatusCode'].value },
                'fields': ['MaritalStatusDesc']
            },
            {
                'table': 'Gender',
                'query': { 'GenderCode': this.uiForm.controls['GenderCode'].value },
                'fields': ['GenderDesc']
            },
            {
                'table': 'Occupation',
                'query': { 'OccupationCode': this.uiForm.controls['OccupationCode'].value },
                'fields': ['OccupationDesc']
            },
            {
                'table': 'Branch',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'BranchNumber': this.uiForm.controls['BranchNumber'].value },
                'fields': ['BranchName']
            },
            {
                'table': 'UserInformation',
                'query': { 'UserCode': this.uiForm.controls['UserCode'].value },
                'fields': ['UserName']
            },

            {
                'table': 'Language',
                'query': { 'LanguageCode': gLanguageCode },
                'fields': ['LanguageDescription']
            },
            {
                'table': 'Employee',
                'query': { 'EmployeeCode': this.uiForm.controls['SupervisorEmployeeCode'].value, 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['EmployeeSurname']
            }
        ];

        this.virtualTableField = [];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(data, 500).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.storeVirtualData = e;
                this.loadVirtualData(e);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            }
        );
    }

    public loadVirtualData(e: any): any {
        if (e && e.length > 0) {
            this.virtualTableField['MaritalStatusDesc'] = e[0] ? ((e[0].length >= 1) ? e[0][0].MaritalStatusDesc : '') : '';
            this.uiForm.controls['MaritalStatusDesc'].setValue(this.virtualTableField['MaritalStatusDesc']);
            this.virtualTableField['GenderDesc'] = e[1] && (e[1].length >= 1) ? (e[1][0].GenderDesc || '') : '';
            this.uiForm.controls['GenderDesc'].setValue(this.virtualTableField['GenderDesc']);
            this.virtualTableField['OccupationDesc'] = (e[2] && (e[2].length >= 1)) ? (e[2][0].OccupationDesc || '') : '';
            this.uiForm.controls['OccupationDesc'].setValue(this.virtualTableField['OccupationDesc']);
            this.virtualTableField['BranchName'] = (e[3] && (e[3].length >= 1)) ? (e[3][0].BranchName || '') : '';
            this.uiForm.controls['BranchName'].setValue(this.virtualTableField['BranchName']);
            this.zone.run(() => {
                this.dropdownConfig.branchSearch.selected = {
                    id: this.uiForm.controls['BranchNumber'].value || '',
                    text: this.uiForm.controls['BranchName'].value ? (this.uiForm.controls['BranchNumber'].value + ' - ' + this.uiForm.controls['BranchName'].value) : this.uiForm.controls['BranchNumber'].value
                };
            });

            this.zone.run(() => {
                this.dropdownConfig.maritalSearch.selected = {
                    id: this.uiForm.controls['MaritalStatusCode'].value || '',
                    text: this.uiForm.controls['MaritalStatusCode'].value ? (this.uiForm.controls['MaritalStatusCode'].value + ' - ' + this.uiForm.controls['MaritalStatusDesc'].value) : ''
                };
            });

            this.zone.run(() => {
                this.dropdownConfig.genderSearch.selected = {
                    id: this.uiForm.controls['GenderCode'].value || '',
                    text: (this.uiForm.controls['GenderCode'].value) ? (this.uiForm.controls['GenderCode'].value + ' - ' + this.uiForm.controls['GenderDesc'].value || '') : ''
                };
            });
            this.virtualTableField['UserName'] = (e[4] && (e[4].length >= 1)) ? (e[4][0].UserName || '') : '';
            this.uiForm.controls['UserName'].setValue(this.virtualTableField['UserName']);

            if (this.uiForm.controls['LanguageCode'].value) {
                this.virtualTableField['LanguageDescription'] = (e[5] && (e[5].length >= 1)) ? (e[5][0].LanguageDescription || '') : '';
                this.uiForm.controls['LanguageDescription'].setValue(this.virtualTableField['LanguageDescription']);
            }
            this.virtualTableField['SupervisorSurname'] = (e[6] && (e[6].length >= 1)) ? e[6][0].EmployeeSurname || '' : '';
            this.uiForm.controls['SupervisorSurname'].setValue(this.virtualTableField['SupervisorSurname']);

        }
    }


    public validateVirtualTableData(controlName: any): void {
        let data = [];
        let gLanguageCode = this.riExchange.LanguageCode();

        switch (controlName) {
            case 'MaritalStatusCode':
                data.push(
                    {
                        'table': 'MaritalStatus',
                        'query': { 'MaritalStatusCode': this.uiForm.controls['MaritalStatusCode'].value },
                        'fields': ['MaritalStatusCode', 'MaritalStatusDesc']
                    });
                break;
            case 'GenderCode':
                data.push({
                    'table': 'Gender',
                    'query': { 'GenderCode': this.uiForm.controls['GenderCode'].value },
                    'fields': ['GenderCode', 'GenderDesc']
                });
                break;
            case 'OccupationCode':
                data.push({
                    'table': 'Occupation',
                    'query': { 'OccupationCode': this.uiForm.controls['OccupationCode'].value },
                    'fields': ['OccupationCode', 'OccupationDesc']
                });
                break;
            case 'BusinessCode':
                data.push({
                    'table': 'Branch',
                    'query': { 'BusinessCode': this.utils.getBusinessCode(), 'BranchNumber': this.uiForm.controls['BranchNumber'].value },
                    'fields': ['BusinessCode', 'BranchName']
                });
                break;
            case 'UserCode':
                data.push({
                    'table': 'UserInformation',
                    'query': { 'UserCode': this.uiForm.controls['UserCode'].value },
                    'fields': ['UserCode', 'UserName']
                });
                break;
            case 'LanguageCode':
                data.push({
                    'table': 'Language',
                    'query': { 'LanguageCode': gLanguageCode },
                    'fields': ['LanguageCode', 'LanguageDescription']
                });
                break;
            case 'EmployeeCode':
                data.push({
                    'table': 'Employee',
                    'query': { 'EmployeeCode': this.uiForm.controls['SupervisorEmployeeCode'].value, 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['EmployeeCode', 'EmployeeSurname']
                });
                break;
        }

        if (data.length > 0) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.LookUp.lookUpRecord(data, 500).subscribe(
                (e) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (e && e.length > 0) {
                        let data = e[0] ? ((e[0].length >= 1) ? e[0][0] : '') : '';
                        if (typeof (data) === undefined || data === null || data === '') {
                            this.isError(controlName);
                            switch (controlName) {
                                case 'UserCode':
                                    this.uiForm.controls['UserName'].setValue('');
                                    break;
                            }
                        }
                        else {
                            switch (controlName) {
                                case 'UserCode':
                                    this.uiForm.controls['UserName'].setValue(e[0][0]['UserName'] ? e[0][0]['UserName'] : '');
                                    break;
                            }
                        }
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.errorService.emitError(error);
                }
            );
        }
    }

    public isError(controlName: any): any {
        if (this.uiForm.controls.hasOwnProperty(controlName)) {
            this.uiForm.controls[controlName].setErrors({ remote: true });
        }
    }


    public fetchTranslationContent(): void {
        if (this.translatedMessageList) {
            for (let key in this.translatedMessageList) {

                if (key && this.translatedMessageList[key]) {
                    this.getTranslatedValue(this.translatedMessageList[key], null).subscribe((res: string) => {
                        if (res) {
                            this.translatedMessageList[key] = res;
                        }
                    });
                }
            }
        }
        this.getTranslatedValue('Employee Maintenance', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.utils.setTitle(res);
                } else {
                    this.utils.setTitle('Employee Maintenance');
                }
            });

        });
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }

    public window_onload(): any {
        this.loadUIFields();
        this.setMenuOptions();
        this.loadParentModeData();
    }

    public loadParentModeData(): any {

        if (this.parentMode === 'ServiceVisitCalendar') {
            this.ellipsisConfig.employeeSearch.autoOpen = false;
            let empCode = this.riExchange.getParentHTMLValue('EmployeeCode');

            this.uiForm.controls['EmployeeCode'].setValue(empCode);
            let data = { EmployeeCode: this.uiForm.controls['EmployeeCode'].value };
            this.onEmployeeSearchDataReceived(data, false);
        }

        if (this.parentMode === 'TechDiary') {
            this.ellipsisConfig.employeeSearch.autoOpen = false;
            let multiEmpCode = this.riExchange.getParentHTMLValue('MultiEmployeeCode');
            this.uiForm.controls['EmployeeCode'].setValue(multiEmpCode);
            let data = { EmployeeCode: this.uiForm.controls['EmployeeCode'].value };
            this.onEmployeeSearchDataReceived(data, false);
        }
    }

    public loadUIFields(): any {
        if (!((this.pageParams.vSCEnableHopewiserPAF === true) || (this.pageParams.vSCEnableDatabasePAF === true))) {
            this.fieldVisibility.cmdGetAddress1 = false;
            this.fieldVisibility.cmdGetAddress2 = false;
        }

        if (this.pageParams.vSCManpowerPlanning === true) {
            this.showManpowerPlanningFields();
        }

        //this.iefAddCustomTabs();

        if (this.pageParams.vSCCapitalFirstLtr === true) {
            this.riMaintenance_AddTableField('EmployeeForename1', MntConst.eTypeTextFree, 'Required');
            this.riMaintenance_AddTableField('EmployeeForename2', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('EmployeeForename3', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('EmployeeSurname', MntConst.eTypeTextFree, 'Required');
            this.addValidator_CapitalizeFirstLetter('EmployeeForename1', false);
            this.addValidator_CapitalizeFirstLetter('EmployeeForename2', false);
            this.addValidator_CapitalizeFirstLetter('EmployeeForename3', false);
            this.addValidator_CapitalizeFirstLetter('EmployeeSurname', false);
        } else {
            this.riMaintenance_AddTableField('EmployeeForename1', MntConst.eTypeText, 'Required');
            this.riMaintenance_AddTableField('EmployeeForename2', MntConst.eTypeText, 'Optional');
            this.riMaintenance_AddTableField('EmployeeForename3', MntConst.eTypeText, 'Optional');
            this.riMaintenance_AddTableField('EmployeeSurname', MntConst.eTypeText, 'Required');
            this.addValidator_CapitalizeFirstLetter('EmployeeForename1');
            this.addValidator_CapitalizeFirstLetter('EmployeeForename2');
            this.addValidator_CapitalizeFirstLetter('EmployeeForename3');
            this.addValidator_CapitalizeFirstLetter('EmployeeSurname');
        }


        this.riMaintenance_AddTableField('MaritalStatusCode', MntConst.eTypeCode, 'Lookup');
        this.riMaintenance_AddTableField('GenderCode', MntConst.eTypeCode, 'Required');
        this.riMaintenance_AddTableField('ExternalID', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('BranchNumber', MntConst.eTypeTextFree, 'Required');
        this.riMaintenance_AddTableField('OccupationCode', MntConst.eTypeCode, 'Required');
        this.riMaintenance_AddTableField('RealPerson', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('Grade', MntConst.eTypeText, 'Optional');
        this.addValidator_CapitalizeFirstLetter('Grade');
        this.riMaintenance_AddTableField('SupervisorEmployeeCode', MntConst.eTypeCode, 'Lookup');

        this.riMaintenance_AddTableField('DateOfBirth', MntConst.eTypeDate, 'Required');
        this.riMaintenance_AddTableField('DateJoined', MntConst.eTypeDate, 'Required');
        this.riMaintenance_AddTableField('PreviousService', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('LeaveEntitlement', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('ContractReceived', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('CommissionValid', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('PendingDeliveryValid', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('FirstAider', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('FirstAidReviewDate', MntConst.eTypeDate, 'Optional');
        this.riMaintenance_AddTableField('EarliestStartTime', MntConst.eTypeTime, 'Optional');
        this.riMaintenance_AddTableField('FixedBreakTime', MntConst.eTypeTime, 'Optional');

        this.riMaintenance_AddTableField('StartWorkFromHomeInd', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('HomeGPSCoordinateX', MntConst.eTypeText, 'Optional');
        this.addValidator_CapitalizeFirstLetter('HomeGPSCoordinateX');
        this.riMaintenance_AddTableField('HomeGPSCoordinateY', MntConst.eTypeText, 'Optional');
        this.addValidator_CapitalizeFirstLetter('HomeGPSCoordinateY');
        this.riMaintenance_AddTableField('RoutingGeonode', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('RoutingScore', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('RoutingSource', MntConst.eTypeText, 'Optional');

        if (this.pageParams.vSCCapitalFirstLtr === true) {

            this.riMaintenance_AddTableField('EmployeeAddressLine1', MntConst.eTypeTextFree, 'Required');
            this.riMaintenance_AddTableField('EmployeeAddressLine2', MntConst.eTypeTextFree, 'Optional');

            if (this.pageParams.vSCAddressLine3Logical === true) {
                this.riMaintenance_AddTableField('EmployeeAddressLine3', MntConst.eTypeTextFree, 'Required');
            } else {
                this.riMaintenance_AddTableField('EmployeeAddressLine3', MntConst.eTypeTextFree, 'Optional');
            }

            this.riMaintenance_AddTableField('EmployeeAddressLine4', MntConst.eTypeTextFree, 'Required');

            if (this.pageParams.vSCAddressLine5Logical === true) {
                this.riMaintenance_AddTableField('EmployeeAddressLine5', MntConst.eTypeTextFree, 'Required');
            } else {
                this.riMaintenance_AddTableField('EmployeeAddressLine5', MntConst.eTypeTextFree, 'Optional');
            }

            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine1', false);
            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine2', false);
            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine3', false);
            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine4', false);
            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine5', false);
        } else {

            this.riMaintenance_AddTableField('EmployeeAddressLine1', MntConst.eTypeText, 'Required');
            this.riMaintenance_AddTableField('EmployeeAddressLine2', MntConst.eTypeText, 'Optional');

            if (this.pageParams.vSCAddressLine3Logical === true) {
                this.riMaintenance_AddTableField('EmployeeAddressLine3', MntConst.eTypeText, 'Required');
            } else {
                this.riMaintenance_AddTableField('EmployeeAddressLine3', MntConst.eTypeText, 'Optional');
            }

            this.riMaintenance_AddTableField('EmployeeAddressLine4', MntConst.eTypeText, 'Required');

            if (this.pageParams.vSCAddressLine5Logical === true) {
                this.riMaintenance_AddTableField('EmployeeAddressLine5', MntConst.eTypeText, 'Required');
            } else {
                this.riMaintenance_AddTableField('EmployeeAddressLine5', MntConst.eTypeText, 'Optional');
            }

            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine1');
            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine2');
            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine3');
            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine4');
            this.addValidator_CapitalizeFirstLetter('EmployeeAddressLine5');

        }

        this.riMaintenance_AddTableField('EmployeePostcode', MntConst.eTypeCode, 'Required');
        this.riMaintenance_AddTableField('HomeTelephone', MntConst.eTypeText, 'Required');
        this.addValidator_CapitalizeFirstLetter('HomeTelephone');
        this.riMaintenance_AddTableField('MobileTelephone', MntConst.eTypeText, 'Optional');
        this.addValidator_CapitalizeFirstLetter('MobileTelephone');
        this.riMaintenance_AddTableField('WorkEmail', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('HomeEmail', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('UserCode', MntConst.eTypeCode, 'Optional');
        this.riMaintenance_AddTableField('SMSMessageNumber', MntConst.eTypeText, 'Optional');
        this.addValidator_CapitalizeFirstLetter('SMSMessageNumber');

        if (this.pageParams.vSCCapitalFirstLtr === true) {

            this.riMaintenance_AddTableField('NoKName', MntConst.eTypeTextFree, 'Required');
            this.riMaintenance_AddTableField('NoKAddressLine1', MntConst.eTypeTextFree, 'Required');
            this.riMaintenance_AddTableField('NoKAddressLine2', MntConst.eTypeTextFree, 'Optional');

            if (this.pageParams.vSCAddressLine3Logical === true) {
                this.riMaintenance_AddTableField('NoKAddressLine3', MntConst.eTypeTextFree, 'Required');
            } else {
                this.riMaintenance_AddTableField('NoKAddressLine3', MntConst.eTypeTextFree, 'Optional');
            }

            this.riMaintenance_AddTableField('NoKAddressLine4', MntConst.eTypeTextFree, 'Required');

            if (this.pageParams.vSCAddressLine5Logical === true) {
                this.riMaintenance_AddTableField('NoKAddressLine5', MntConst.eTypeTextFree, 'Required');
            } else {
                this.riMaintenance_AddTableField('NoKAddressLine5', MntConst.eTypeTextFree, 'Optional');
            }

            this.addValidator_CapitalizeFirstLetter('NoKName', false);
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine1', false);
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine2', false);
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine3', false);
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine4', false);
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine5', false);
        } else {

            this.riMaintenance_AddTableField('NoKName', MntConst.eTypeText, 'Required');
            this.riMaintenance_AddTableField('NoKAddressLine1', MntConst.eTypeText, 'Required');
            this.riMaintenance_AddTableField('NoKAddressLine2', MntConst.eTypeText, 'Optional');

            if (this.pageParams.vSCAddressLine3Logical === true) {
                this.riMaintenance_AddTableField('NoKAddressLine3', MntConst.eTypeText, 'Required');
            } else {
                this.riMaintenance_AddTableField('NoKAddressLine3', MntConst.eTypeText, 'Optional');
            }

            this.riMaintenance_AddTableField('NoKAddressLine4', MntConst.eTypeText, 'Required');

            if (this.pageParams.vSCAddressLine5Logical === true) {
                this.riMaintenance_AddTableField('NoKAddressLine5', MntConst.eTypeText, 'Required');
            } else {
                this.riMaintenance_AddTableField('NoKAddressLine5', MntConst.eTypeText, 'Optional');
            }

            this.addValidator_CapitalizeFirstLetter('NoKName');
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine1');
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine2');
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine3');
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine4');
            this.addValidator_CapitalizeFirstLetter('NoKAddressLine5');
        }

        this.riMaintenance_AddTableField('NoKPostcode', MntConst.eTypeCode, 'Required');
        this.riMaintenance_AddTableField('NoKHomeTelephone', MntConst.eTypeText, 'Required');
        this.addValidator_CapitalizeFirstLetter('NoKHomeTelephone');
        this.riMaintenance_AddTableField('NoKOtherTelephone', MntConst.eTypeText, 'Optional');
        this.addValidator_CapitalizeFirstLetter('NoKOtherTelephone');
        this.riMaintenance_AddTableField('NoKRelationship', MntConst.eTypeText, 'Required');
        this.addValidator_CapitalizeFirstLetter('NoKRelationship');

        this.riMaintenance_AddTableField('ClassType', MntConst.eTypeText, 'Optional');
        this.addValidator_CapitalizeFirstLetter('ClassType');
        this.riMaintenance_AddTableField('VehicleRegistration', MntConst.eTypeText, 'Optional');
        this.addValidator_CapitalizeFirstLetter('VehicleRegistration');
        this.riMaintenance_AddTableField('PetrolCardNumber', MntConst.eTypeCode, 'Optional');
        this.riMaintenance_AddTableField('DrivingLicenceNumber', MntConst.eTypeCode, 'Optional');
        this.riMaintenance_AddTableField('DrivingLicenceExpiryDate', MntConst.eTypeDate, 'Optional');

        this.riMaintenance_AddTableField('DateLeft', MntConst.eTypeDate, 'Optional');
        this.riMaintenance_AddTableField('LeavingReason', MntConst.eTypeText, 'Optional');
        this.addValidator_CapitalizeFirstLetter('LeavingReason');
        this.riMaintenance_AddTableField('TelephoneNumber', MntConst.eTypeText, 'Lookup');
        this.addValidator_CapitalizeFirstLetter('TelephoneNumber');
        this.riMaintenance_AddTableField('SecondaryContactNumber', MntConst.eTypeText, 'Lookup');
        this.addValidator_CapitalizeFirstLetter('SecondaryContactNumber');
        this.riMaintenance_AddTableField('LanguageCode', MntConst.eTypeCode, 'Lookup');


        this.riMaintenance_AddTableField('EmployeeStartLocation1', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeStartLocation2', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeStartLocation3', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeStartLocation4', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeStartLocation5', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeStartLocation6', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeStartLocation7', MntConst.eTypeText, 'Optional');

        this.riMaintenance_AddTableField('EmployeeEndLocation1', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeEndLocation2', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeEndLocation3', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeEndLocation4', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeEndLocation5', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeEndLocation6', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('EmployeeEndLocation7', MntConst.eTypeText, 'Optional');

        this.riMaintenance_AddTableField('PDAWorkLoad', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('RecordMileageInd', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('TabletUserInd', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('GoogleCalendarEnabled', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('riTimezoneCode', MntConst.eTypeText, 'Optional');

        this.riMaintenance_AddTableField('LOSCode', MntConst.eTypeText, 'Optional');

        this.riMaintenance_AddTableField('ManpowerPlanning', MntConst.eTypeTextFree, 'Optional');


        if (this.pageParams.vSCManpowerPlanning === true) {
            for (let i = 1; i <= 7; i++) {
                this.riMaintenance_AddTableField('WindowStart0' + i, MntConst.eTypeTime, 'Required');
                this.riMaintenance_AddTableField('WindowEnd0' + i, MntConst.eTypeTime, 'Required');
                this.riMaintenance_AddTableField('WindowDayInd0' + i, MntConst.eTypeCheckBox, 'Optional');
            }

            this.riMaintenance_AddTableField('StdHoursPerDay', MntConst.eTypeTime, 'Optional');
            this.riMaintenance_AddTableField('MaxOTPerDay', MntConst.eTypeTime, 'Optional');
            this.riMaintenance_AddTableField('MaxHoursPerWeek', MntConst.eTypeText, 'Optional');
            this.riMaintenance_AddTableField('StandardBreakTime', MntConst.eTypeTime, 'Optional');
            this.riMaintenance_AddTableField('PersonalDrivingTime', MntConst.eTypeTime, 'Optional');
            this.riMaintenance_AddTableField('AvgDrivingWorkDay', MntConst.eTypeInteger, 'Optional');
            this.riMaintenance_AddTableField('AverageSickness', MntConst.eTypeDecimal2, 'Optional');

            this.riMaintenance_AddTableField('Occupation', MntConst.eTypeText, 'Optional');
            this.addValidator_CapitalizeFirstLetter('Occupation');
        }



        //this.iefAddCustomStarFields();
        //this.iefAddCustomVirtuals();

        this.uiForm.controls['cmdGetAddress1'].disable();
        this.uiForm.controls['cmdGetAddress2'].disable();
        this.uiForm.controls['cmdCopyAddress'].disable();

        if (!this.pageParams.vbEnableRouteOptimisation) {
            this.fieldVisibility.cmdGeocode = false;
            this.fieldVisibility.RoutingGeonode = false;
            this.fieldVisibility.RoutingScore = false;
        }

        this.uiForm.controls['cmdGeocode'].disable();
        this.uiForm.controls['SelRoutingSource'].disable();

        this.riMaintenance_AddTableField('TabletReloadFromDate', MntConst.eTypeDate, 'Optional');
        this.buildMenu();

        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();

        this.disableServiceDetails();

        this.uiForm.updateValueAndValidity();
    }

    public riMaintenance_AddTableField(controlName: any, fieldType: string, option: any): any {

        switch (option) {
            case 'Required':
                if (this.uiForm.controls.hasOwnProperty(controlName)) {
                    let validatorArr = [];
                    validatorArr.push(Validators.required);
                    this.fieldRequired[controlName] = true;
                    if ((fieldType === MntConst.eTypeDate) && this.datepicker.hasOwnProperty(controlName)) {
                        this.datepicker[controlName].isRequired = true;
                    }
                    else if (fieldType === MntConst.eTypeCode) {
                        this.addCapitalizeFieldStatus(controlName);
                    }

                    if (validatorArr.length > 0) {
                        this.uiForm.controls[controlName].setValidators(Validators.compose(validatorArr));
                        this.uiForm.controls[controlName].updateValueAndValidity();
                    }
                }
                break;
            case 'Optional':
                if (this.uiForm.controls.hasOwnProperty(controlName)) {
                    this.uiForm.controls[controlName].clearValidators();
                    this.uiForm.controls[controlName].updateValueAndValidity();
                    this.fieldRequired[controlName] = false;
                    if ((fieldType === MntConst.eTypeDate) && this.datepicker.hasOwnProperty(controlName)) {
                        this.datepicker[controlName].isRequired = false;
                    }
                    else if (fieldType === MntConst.eTypeCode) {
                        this.addCapitalizeFieldStatus(controlName);
                    }
                }
                break;
            case 'Lookup':
                if (this.uiForm.controls.hasOwnProperty(controlName)) {
                    this.uiForm.controls[controlName].clearValidators();
                    this.uiForm.controls[controlName].updateValueAndValidity();
                    this.fieldRequired[controlName] = false;
                    if (fieldType === MntConst.eTypeCode) {
                        this.addCapitalizeFieldStatus(controlName);
                    }
                }
                break;
            default:
        }
    }

    public addValidator_CapitalizeFirstLetter(controlName: any, addValidator: boolean = true): any {
        if (this.uiForm.controls.hasOwnProperty(controlName)) {
            this.capitalizeFirstLetterField[controlName] = addValidator;
        }
    }

    public addCapitalizeFieldStatus(controlName: any, status: boolean = true): any {
        if (this.uiForm.controls.hasOwnProperty(controlName)) {
            this.capitalizeField[controlName] = status;
        }
    }

    public addTimeFieldStatus(controlName: any, status: boolean = true): any {
        if (this.uiForm.controls.hasOwnProperty(controlName)) {
            this.timeField[controlName] = status;
        }
    }

    public onKeyDown(event: any): void {
        event.preventDefault();
        if (event.keyCode === 34) {

            switch (event.target.id) {
                case 'LanguageCode':
                    // riExchange.Mode = "LookUp"
                    //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Model/riMGLanguageSearch.htm<center>"
                    alert('TODO: Model/riMGLanguageSearch.htm');
                    break;
                case 'BranchNumber':
                    break;
                case 'ClassType':
                    // riExchange.Mode = "EmployeeClassMode": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBClassTypeSearch.htm"
                    alert('TODO: Model/iCABSBClassTypeSearch.htm');
                    break;
                case 'VehicleRegistration':
                    // riExchange.Mode = "LookUp": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBVehicleSearch.htm"
                    alert('TODO: Business/iCABSBVehicleSearch.htm');
                    break;
                case 'GenderCode':
                    //riExchange.Mode = "LookUp": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSGenderSearch.htm"
                    alert('TODO: System/iCABSSGenderSearch.htm');
                    break;
                case 'OccupationCode':
                    if (this.occupationSearchEllipsis && (typeof this.occupationSearchEllipsis !== 'undefined')) {
                        this.occupationSearchEllipsis.openModal();
                    }
                    break;
                case 'SupervisorEmployeeCode':
                    if (this.supervisorEmployeeEllipsis && (typeof this.supervisorEmployeeEllipsis !== 'undefined')) {
                        this.supervisorEmployeeEllipsis.openModal();
                    }
                    break;
                case 'SupervisorEmployeeCode':
                    if (this.vehicleClassEllipsis && (typeof this.vehicleClassEllipsis !== 'undefined')) {
                        this.vehicleClassEllipsis.openModal();
                    }
                    break;

                case 'UserCode':
                    //riExchange.Mode = "LookUp": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Model/riMUserInformationSearch.htm"
                    alert('TODO: Model/riMUserInformationSearch.htm');
                    break;
                case 'EmployeeCode':
                    if (this.employeeSearchEllipsis && (typeof this.employeeSearchEllipsis !== 'undefined')) {
                        this.employeeSearchEllipsis.openModal();
                    }
                    break;
                default:
                    break;

            }
        }
    }

    public showManpowerPlanningFields(): any {
        this.fieldVisibility.trWH01 = true;

        this.fieldVisibility.StdHoursPerDay = true;
        this.fieldVisibility.PersonalDrivingTime = true;

        this.fieldVisibility.trWH02 = true;
        this.fieldVisibility.ManpowerPlanning = true;
        this.fieldVisibility.MaxOTPerDay = true;
        this.fieldVisibility.AvgDrivingWorkDay = true;

        this.fieldVisibility.trWH03 = true;
        this.fieldVisibility.MaxHoursPerWeek = true;
        this.fieldVisibility.AverageSickness = true;

        this.fieldVisibility.trWH04 = true;
        this.fieldVisibility.StandardBreakTime = true;

        this.fieldVisibility.trWindow07 = true;
        this.fieldVisibility.EmployeeStartLocation6Sel = true;
        this.fieldVisibility.EmployeeEndLocation6Sel = true;
        this.fieldVisibility.WindowStart07 = true;
        this.fieldVisibility.WindowEnd07 = true;
        this.fieldVisibility.WindowDayInd07 = true;

        this.fieldVisibility.WHSunday = true;
        this.fieldVisibility.WindowStart01 = true;
        this.fieldVisibility.WindowEnd01 = true;
        this.fieldVisibility.WindowDayInd01 = true;
        this.fieldVisibility.WHMonday = true;
        this.fieldVisibility.WindowStart02 = true;
        this.fieldVisibility.WindowEnd02 = true;
        this.fieldVisibility.WindowDayInd02 = true;
        this.fieldVisibility.WHTuesday = true;
        this.fieldVisibility.WindowStart03 = true;
        this.fieldVisibility.WindowEnd03 = true;
        this.fieldVisibility.WindowDayInd03 = true;
        this.fieldVisibility.WHWednesday = true;
        this.fieldVisibility.WindowStart04 = true;
        this.fieldVisibility.WindowEnd04 = true;
        this.fieldVisibility.WindowDayInd04 = true;
        this.fieldVisibility.WHThursday = true;
        this.fieldVisibility.WindowStart05 = true;
        this.fieldVisibility.WindowEnd05 = true;
        this.fieldVisibility.WindowDayInd05 = true;
        this.fieldVisibility.WHFriday = true;
        this.fieldVisibility.WindowStart06 = true;
        this.fieldVisibility.WindowEnd06 = true;
        this.fieldVisibility.WindowDayInd06 = true;
        this.fieldVisibility.tdSales = true;
        this.fieldVisibility.Work = true;
        this.fieldVisibility.Start = true;
        this.fieldVisibility.End = true;
        this.fieldVisibility.Day = true;
        this.fieldVisibility.tdOccupationCode = true;
        this.fieldVisibility.WorkDay = true;
    }

    public empSLocChange(viSDay: any): any {

        switch (viSDay) {
            case '1':
                this.uiForm.controls['EmployeeStartLocation1'].setValue(this.uiForm.controls['EmployeeStartLocation1Sel'].value);
                break;
            case '2':
                this.uiForm.controls['EmployeeStartLocation2'].setValue(this.uiForm.controls['EmployeeStartLocation2Sel'].value);
                break;
            case '3':
                this.uiForm.controls['EmployeeStartLocation3'].setValue(this.uiForm.controls['EmployeeStartLocation3Sel'].value);
                break;
            case '4':
                this.uiForm.controls['EmployeeStartLocation4'].setValue(this.uiForm.controls['EmployeeStartLocation4Sel'].value);
                break;
            case '5':
                this.uiForm.controls['EmployeeStartLocation5'].setValue(this.uiForm.controls['EmployeeStartLocation5Sel'].value);
                break;
            case '6':
                this.uiForm.controls['EmployeeStartLocation6'].setValue(this.uiForm.controls['EmployeeStartLocation6Sel'].value);
                break;
            case '7':
                this.uiForm.controls['EmployeeStartLocation7'].setValue(this.uiForm.controls['EmployeeStartLocation7Sel'].value);
                break;
        }
        this.uiForm.updateValueAndValidity();
    }

    public empELocChange(viEDay: any): any {
        switch (viEDay) {
            case '1':
                this.uiForm.controls['EmployeeEndLocation1'].setValue(this.uiForm.controls['EmployeeEndLocation1Sel'].value);
                break;
            case '2':
                this.uiForm.controls['EmployeeEndLocation2'].setValue(this.uiForm.controls['EmployeeEndLocation2Sel'].value);
                break;
            case '3':
                this.uiForm.controls['EmployeeEndLocation3'].setValue(this.uiForm.controls['EmployeeEndLocation3Sel'].value);
                break;
            case '4':
                this.uiForm.controls['EmployeeEndLocation4'].setValue(this.uiForm.controls['EmployeeEndLocation4Sel'].value);
                break;
            case '5':
                this.uiForm.controls['EmployeeEndLocation5'].setValue(this.uiForm.controls['EmployeeEndLocation5Sel'].value);
                break;
            case '6':
                this.uiForm.controls['EmployeeEndLocation6'].setValue(this.uiForm.controls['EmployeeEndLocation6Sel'].value);
                break;
            case '7':
                this.uiForm.controls['EmployeeEndLocation7'].setValue(this.uiForm.controls['EmployeeEndLocation7Sel'].value);
                break;
        }
        this.uiForm.updateValueAndValidity();
    }

    public riMaintenance_AfterAdd_On(): any {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();

        this.disableServiceDetails();
        if (this.uiForm.controls['TabletUserInd'].value === true) {
            this.showHideTabletReload(true);
        } else {
            this.showHideTabletReload(false);
        }
        this.uiForm.updateValueAndValidity();
    }



    public riMaintenance_AfterAb_onUpdate(): any {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();
        this.disableServiceDetails();
    }

    public riMaintenance_AfterSave(): any {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();
        this.disableServiceDetails();
        if (this.uiForm.controls['TabletUserInd'].value === true) {
            this.showHideTabletReload(true);
        }
        else {
            this.showHideTabletReload(false);
        }
        this.uiForm.updateValueAndValidity();
    }

    public riMaintenance_AfterDelete(): any {
        this.disableServiceDetails();
    }

    public riMaintenance_AfterSaveAdd(): any {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();
        this.disableServiceDetails();
        if (this.uiForm.controls['TabletUserInd'].value === true) {
            this.showHideTabletReload(true);
        }
        else {
            this.showHideTabletReload(false);
        }
    }

    public pdaWorkLoading(): any {
        this.uiForm.controls['PDAWorkLoad'].setValue(this.uiForm.controls['PDAWorkLoadSel'].value);
    }


    public riMaintenance_BeforeFetch(): any {
        this.addPostData();
    }

    public addPostData(): any {
        //riMaintenance.CustomBusinessObjectAdditionalPostData = 'SCManpowerPlanning=' & GetLogicalStringValue(SCManpowerPlanning);
    }


    public riMaintenance_AfterFetch(): any {
        this.uiForm.controls['riTimezoneCodeSelect'].setValue(this.setFieldValue(this.uiForm.controls['riTimezoneCode'].value));

        this.uiForm.controls['LOSCodeSelect'].setValue(this.setFieldValue(this.uiForm.controls['LOSCode'].value));

        this.uiForm.controls['EmployeeStartLocation1Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeStartLocation1'].value));
        this.uiForm.controls['EmployeeStartLocation2Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeStartLocation2'].value));
        this.uiForm.controls['EmployeeStartLocation3Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeStartLocation3'].value));
        this.uiForm.controls['EmployeeStartLocation4Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeStartLocation4'].value));
        this.uiForm.controls['EmployeeStartLocation5Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeStartLocation5'].value));
        this.uiForm.controls['EmployeeStartLocation6Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeStartLocation6'].value));
        this.uiForm.controls['EmployeeStartLocation7Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeStartLocation7'].value));

        this.uiForm.controls['EmployeeEndLocation1Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeEndLocation1'].value));
        this.uiForm.controls['EmployeeEndLocation2Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeEndLocation2'].value));
        this.uiForm.controls['EmployeeEndLocation3Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeEndLocation3'].value));
        this.uiForm.controls['EmployeeEndLocation4Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeEndLocation4'].value));
        this.uiForm.controls['EmployeeEndLocation5Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeEndLocation5'].value));
        this.uiForm.controls['EmployeeEndLocation6Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeEndLocation6'].value));
        this.uiForm.controls['EmployeeEndLocation7Sel'].setValue(this.setFieldValue(this.uiForm.controls['EmployeeEndLocation7'].value));

        this.uiForm.controls['PDAWorkLoadSel'].setValue(this.setFieldValue(this.uiForm.controls['PDAWorkLoad'].value));

        if (this.uiForm.controls['TabletUserInd'].value === true) {
            this.showHideTabletReload(true);
        } else {
            this.showHideTabletReload(false);
        }


        if (this.uiForm.controls['RoutingSource'].value && (this.uiForm.controls['RoutingSource'].value.length === 0)) {
            this.uiForm.controls['SelRoutingSource'].setValue('');
        } else {
            this.uiForm.controls['SelRoutingSource'].setValue(this.setFieldValue(this.uiForm.controls['RoutingSource'].value));
        }

        this.uiForm.updateValueAndValidity();
    }

    public riMaintenance_BeforeAddMode(): any {
        this.uiForm.controls['riTimezoneCodeSelect'].enable();
        this.uiForm.controls['LOSCodeSelect'].enable();
        this.uiForm.controls['riTimezoneCodeSelect'].setValue('STIME');
        this.enableServiceDetails();
        this.uiForm.controls['RealPerson'].setValue(true);
        this.uiForm.controls['cmdGetAddress1'].enable();
        this.uiForm.controls['cmdGetAddress2'].enable();
        this.uiForm.controls['cmdCopyAddress'].enable();
        this.uiForm.controls['BranchNumber'].setValue(this.utils.getBranchCode());
        this.uiForm.controls['SelRoutingSource'].setValue('');
        this.showHideTabletReload(false);
    }


    public riMaintenance_BeforeUpdateMode(): any {
        this.uiForm.controls['riTimezoneCodeSelect'].enable();
        this.uiForm.controls['LOSCodeSelect'].enable();
        this.enableServiceDetails();

        //' SH 01/05/2003 - Do! allow the branch to be changed, in update mode.
        this.uiForm.controls['BranchNumber'].disable();
        this.dropdownConfig.branchSearch.isDisabled = true;
        this.uiForm.controls['Occupation'].disable();

        // change request as per new iCABS requirement
        // As requested, the behaviour should be like, in Update mode the
        // button should be displayed, and if the screen is made dirty, the button will be disabled.

        if (this.uiForm.controls['TabletUserInd'].value === true) {
            this.showHideTabletReload(true);
        }
        else {
            this.showHideTabletReload(false);
        }

        this.realPerson_onclick();
        this.uiForm.updateValueAndValidity();
    }

    public disableServiceDetails(): any {

        this.uiForm.controls['EmployeeStartLocation1Sel'].disable();
        this.uiForm.controls['EmployeeStartLocation2Sel'].disable();
        this.uiForm.controls['EmployeeStartLocation3Sel'].disable();
        this.uiForm.controls['EmployeeStartLocation4Sel'].disable();
        this.uiForm.controls['EmployeeStartLocation5Sel'].disable();
        this.uiForm.controls['EmployeeStartLocation6Sel'].disable();
        this.uiForm.controls['EmployeeStartLocation7Sel'].disable();

        this.uiForm.controls['EmployeeEndLocation1Sel'].disable();
        this.uiForm.controls['EmployeeEndLocation2Sel'].disable();
        this.uiForm.controls['EmployeeEndLocation3Sel'].disable();
        this.uiForm.controls['EmployeeEndLocation4Sel'].disable();
        this.uiForm.controls['EmployeeEndLocation5Sel'].disable();
        this.uiForm.controls['EmployeeEndLocation6Sel'].disable();
        this.uiForm.controls['EmployeeEndLocation7Sel'].disable();

        this.uiForm.controls['PDAWorkLoadSel'].disable();
    }
    public enableServiceDetails(): any {

        this.uiForm.controls['EmployeeStartLocation1Sel'].enable();
        this.uiForm.controls['EmployeeStartLocation2Sel'].enable();
        this.uiForm.controls['EmployeeStartLocation3Sel'].enable();
        this.uiForm.controls['EmployeeStartLocation4Sel'].enable();
        this.uiForm.controls['EmployeeStartLocation5Sel'].enable();
        this.uiForm.controls['EmployeeStartLocation6Sel'].enable();
        this.uiForm.controls['EmployeeStartLocation7Sel'].enable();

        this.uiForm.controls['EmployeeEndLocation1Sel'].enable();
        this.uiForm.controls['EmployeeEndLocation2Sel'].enable();
        this.uiForm.controls['EmployeeEndLocation3Sel'].enable();
        this.uiForm.controls['EmployeeEndLocation4Sel'].enable();
        this.uiForm.controls['EmployeeEndLocation5Sel'].enable();
        this.uiForm.controls['EmployeeEndLocation6Sel'].enable();
        this.uiForm.controls['EmployeeEndLocation7Sel'].enable();

        this.uiForm.controls['PDAWorkLoadSel'].enable();
    }

    public showHideTabletReload(lShow: any): any {
        if (lShow === true) {
            this.fieldVisibility.trTabletReload = true;
            let date: Date = new Date(new Date().setDate(new Date().getDate() - 90));
            let dt = this.convertNewDate(date);
            this.uiForm.controls['TabletReloadFromDate'].setValue(dt);
            this.uiForm.controls['TabletReloadFromDate'].updateValueAndValidity();
            this.setRequiredStatus('TabletReloadFromDate', true);
        } else {
            this.uiForm.controls['TabletReloadFromDate'].setValue('');
            this.setRequiredStatus('TabletReloadFromDate', false);
            this.fieldVisibility.trTabletReload = false;
        }

    }

    public realPerson_onclick(event?: any): any {

        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'RealPerson')) {

            if (this.uiForm.controls['RealPerson'].value) {

                this.setRequiredStatus('GenderCode', true);
                this.setRequiredStatus('DateOfBirth', true, true);
                this.setRequiredStatus('DateJoined', true, true);
                this.setRequiredStatus('EmployeeAddressLine1', true);

                if (this.pageParams.vSCAddressLine3Logical) {
                    this.setRequiredStatus('EmployeeAddressLine3', true);
                }

                this.setRequiredStatus('EmployeeAddressLine4', true);

                if (this.pageParams.vSCAddressLine5Logical) {
                    this.setRequiredStatus('EmployeeAddressLine5', true);
                }

                this.setRequiredStatus('EmployeePostcode', true);
                this.setRequiredStatus('HomeTelephone', true);
                this.setRequiredStatus('NoKName', true);
                this.setRequiredStatus('NoKRelationship', true);
                this.setRequiredStatus('NoKAddressLine1', true);

                if (this.pageParams.vSCAddressLine3Logical) {
                    this.setRequiredStatus('NoKAddressLine3', true);
                }

                this.setRequiredStatus('NoKAddressLine4', true);

                if (this.pageParams.vSCAddressLine5Logical) {
                    this.setRequiredStatus('NoKAddressLine5', true);
                }

                this.setRequiredStatus('NoKPostcode', true);
                this.setRequiredStatus('NoKHomeTelephone', true);

            } else {

                this.setRequiredStatus('GenderCode', false);
                this.setRequiredStatus('DateOfBirth', false, true);
                this.setRequiredStatus('DateJoined', false, true);
                this.setRequiredStatus('EmployeeAddressLine1', false);
                this.setRequiredStatus('EmployeeAddressLine3', false);
                this.setRequiredStatus('EmployeeAddressLine4', false);
                this.setRequiredStatus('EmployeeAddressLine5', false);
                this.setRequiredStatus('EmployeePostcode', false);
                this.setRequiredStatus('HomeTelephone', false);
                this.setRequiredStatus('NoKName', false);
                this.setRequiredStatus('NoKRelationship', false);
                this.setRequiredStatus('NoKAddressLine1', false);
                this.setRequiredStatus('NoKAddressLine3', false);
                this.setRequiredStatus('NoKAddressLine4', false);
                this.setRequiredStatus('NoKAddressLine5', false);
                this.setRequiredStatus('NoKPostcode', false);
                this.setRequiredStatus('NoKHomeTelephone', false);

            }

        }
        this.uiForm.updateValueAndValidity();
    }

    public setRequiredStatus(controlName: any, value: boolean, isDate?: boolean): any {

        if ((value === true) && this.uiForm.controls.hasOwnProperty(controlName)) {
            this.uiForm.controls[controlName].setValidators(Validators.required);
            this.uiForm.controls[controlName].updateValueAndValidity();
            this.fieldRequired[controlName] = true;
            if (isDate && this.datepicker.hasOwnProperty(controlName)) {
                this.datepicker[controlName].isRequired = true;
            }
        }
        else if ((value === false) && this.uiForm.controls.hasOwnProperty(controlName)) {
            this.uiForm.controls[controlName].clearValidators();
            this.uiForm.controls[controlName].updateValueAndValidity();
            this.fieldRequired[controlName] = false;
            if (isDate && this.datepicker.hasOwnProperty(controlName)) {
                this.datepicker[controlName].isRequired = false;
            }
        }
        this.uiForm.updateValueAndValidity();
    }

    public fetchRecordData(functionName: any, params: any, postdata?: any): any {

        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.set(this.serviceConstants.Action, '0');

        if (functionName !== '') {
            this.queryParams.set(this.serviceConstants.Action, '6');
        }
        for (let key in params) {
            if (key) {
                this.queryParams.set(key, params[key]);
            }
        }

        if (postdata) {
            return this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams, postdata);
        }
        else {
            return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams);
        }

    }

    public riMaintenance_BeforeSave(): Observable<any> {
        let obs: Observable<any>;
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let flag = true;
        let status = true;
        let counter = 0;

        this.uiForm.controls['riTimezoneCode'].setValue(this.uiForm.controls['riTimezoneCodeSelect'].value);
        this.uiForm.controls['LOSCode'].setValue(this.uiForm.controls['LOSCodeSelect'].value);
        this.uiForm.controls['RoutingSource'].setValue(this.uiForm.controls['SelRoutingSource'].value);

        obs = new Observable(observer => {
            if (this.pageParams.vbEnableRouteOptimisation === true && (this.uiForm.controls['SelRoutingSource'].value === '' || typeof (this.uiForm.controls['SelRoutingSource'].value) === undefined)) {
                this.getGeocodeAddress().subscribe((e) => {
                    observer.next(e);
                });
            }
            else {
                observer.next(true);
            }
        });

        if (this.pageParams.vSCManpowerPlanning) {
            if (!this.validateWorkingHourFieldsEntry()) {
                status = false;
                this.errorModal.show({ msg: this.translatedMessageList['Please_Enter_Working_Hours'], title: 'Error' }, false);
                this.riMaintenanceCancelEvent = true;
                this.messageModal.modalClose.subscribe((event) => {
                    if (counter === 0) {
                        counter++;
                        retObj.next(false);
                    }
                });
            }

            if (counter === 0 && !this.validateWorkingHourFields()) {
                let l = 0;
                status = false;
                this.messageModal.show({ msg: this.translatedMessageList['No_Start_Time_or_End_Time'], title: 'Information' }, false);
                this.messageModal.modalClose.subscribe((event) => {
                    if (l === 0) {
                        l++;
                        obs.subscribe((e1) => {
                            retObj.next(e1);
                        });
                    }
                });
            }
        }

        if (status === true) {
            obs.subscribe((e1) => {
                retObj.next(e1);
            });
        }

        return retObj;
    }

    public getGeocodeAddress(): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let postDataAdd = {
            'Function': 'GetGeocodeAddress',
            'AddressLine1': this.setFieldValue(this.uiForm.controls['EmployeeAddressLine1'].value),
            'AddressLine2': this.setFieldValue(this.uiForm.controls['EmployeeAddressLine2'].value),
            'AddressLine3': this.setFieldValue(this.uiForm.controls['EmployeeAddressLine3'].value),
            'AddressLine4': this.setFieldValue(this.uiForm.controls['EmployeeAddressLine4'].value),
            'AddressLine5': this.setFieldValue(this.uiForm.controls['EmployeeAddressLine5'].value),
            'Postcode': this.setFieldValue(this.uiForm.controls['EmployeePostcode'].value),
            'GPSX': this.setFieldValue(this.uiForm.controls['HomeGPSCoordinateX'].value),
            'GPSY': this.setFieldValue(this.uiForm.controls['HomeGPSCoordinateY'].value)
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('', {}, postDataAdd).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                    retObj.next(false);
                } else {
                    if (data['errorMessage']) {
                        this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                        retObj.next(false);
                    }
                    else {
                        this.uiForm.controls['AddressError'].setValue(data['AddressError'] ? data['AddressError'] : '');
                        if (data['AddressError'] && this.uiForm.controls['AddressError'].value !== 'Error') {
                            this.uiForm.controls['RoutingGeonode'].setValue(this.setFieldValue(data['Node']));
                            this.uiForm.controls['RoutingScore'].setValue(this.setFieldValue(data['Score']));
                            this.uiForm.controls['HomeGPSCoordinateX'].setValue(this.setFieldValue(data['GPSX']));
                            this.uiForm.controls['HomeGPSCoordinateY'].setValue(this.setFieldValue(data['GPSY']));

                            if (this.uiForm.controls['RoutingScore'].value > 0) {
                                this.uiForm.controls['SelRoutingSource'].setValue('T');
                                this.uiForm.controls['RoutingSource'].setValue('T');
                            }
                            else {
                                this.uiForm.controls['SelRoutingSource'].setValue('');
                                this.uiForm.controls['RoutingSource'].setValue('');
                            }
                            retObj.next(true);
                        } else {
                            this.messageModal.show({ msg: this.translatedMessageList.Unable_to_Geocode_Address, title: 'Information' }, false);
                            this.riMaintenanceCancelEvent = true;
                            let counter = 0;
                            this.messageModal.modalClose.subscribe((event) => {
                                if (counter === 0) {
                                    counter++;
                                    retObj.next(false);
                                }
                            });
                        }
                    }
                }

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
                retObj.next(false);
            });

        return retObj;
    }


    public riMaintenance_BeforeMode(): void {
        if (this.pageParams.updateMode) {
            this.uiForm.controls['cmdGetAddress1'].enable();
            this.uiForm.controls['cmdGetAddress2'].enable();
            this.uiForm.controls['cmdCopyAddress'].enable();
            this.uiForm.controls['cmdGeocode'].enable();
            this.fieldVisibility.btnDefault = true;
        }

        if (this.pageParams.addMode) {
            this.uiForm.controls['cmdGeocode'].enable();
            this.fieldVisibility.btnDefault = true;
        }

        if (this.pageParams.normalMode || this.pageParams.searchMode) {
            this.uiForm.controls['cmdGetAddress1'].disable();
            this.uiForm.controls['cmdGetAddress2'].disable();
            this.uiForm.controls['cmdCopyAddress'].disable();
            this.uiForm.controls['cmdGeocode'].disable();
        }
        this.uiForm.updateValueAndValidity();
    }


    private isNumber(n: any): any {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    private isDate(data: any): boolean {
        try {
            return data ? true : false;
        }
        catch (e) {
            return false;
        }
    }

    private validateWorkingHourFields(): any {
        for (let i = 1; i <= 7; i++) {
            let obj1 = this.uiForm.controls['WindowStart0' + i].value;
            let obj2 = this.uiForm.controls['WindowEnd0' + i].value;
            if (obj1 !== '00:00' || obj2 !== '00:00') {
                return true;
            }
        }

        return false;
    }

    private validateWorkingHourFieldsEntry(): any {
        for (let i = 1; i <= 7; i++) {
            let obj1 = this.uiForm.controls['WindowStart0' + i].value;
            let obj2 = this.uiForm.controls['WindowEnd0' + i].value;

            if ((obj1 === '') || (obj2 === '')) {
                return false;
            }
        }
        return true;
    }

    public riExchange_CBORequest(occupationCodeStatus: boolean = false, vehicleRegistration: boolean = false): any {

        if (occupationCodeStatus && this.uiForm.controls['OccupationCode'].value && this.uiForm.controls['OccupationCode'].value.trim() !== '') {
            if (this.pageParams.vSCManpowerPlanning) {
                this.getBranchDefault();
            }

            let postDataAdd = {};
            postDataAdd[this.serviceConstants.Action] = '6';
            postDataAdd[this.serviceConstants.Function] = 'GetOccupationWarningMessage';
            postDataAdd[this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
            postDataAdd['EmployeeCode'] = this.uiForm.controls['EmployeeCode'].value;
            postDataAdd['OccupationCode'] = this.uiForm.controls['OccupationCode'].value;

            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchRecordData('GetOccupationWarningMessage', {}, postDataAdd).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.oResponse);
                    } else {
                        if (data.errorMessage) {
                            this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                        }
                        else {
                            this.uiForm.controls['OccWarningMessage'].setValue(data['OccWarningMessage'] ? data['OccWarningMessage'] : '');
                            if (this.uiForm.controls['OccWarningMessage'].value) {
                                this.messageModal.show({ msg: this.uiForm.controls['OccWarningMessage'].value, title: '' }, false);
                                this.uiForm.controls['OccWarningMessage'].setValue('');
                            }
                        }
                    }

                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });

        }

        if (vehicleRegistration && this.uiForm.controls['VehicleRegistration'].value && this.uiForm.controls['VehicleRegistration'].value.trim() !== '') {
            let postDataAdd = {};
            postDataAdd[this.serviceConstants.Action] = '6';
            postDataAdd[this.serviceConstants.Function] = 'GetVehicleRegistrationWarningMessage';
            postDataAdd['VehicleRegistration'] = this.uiForm.controls['VehicleRegistration'].value;

            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchRecordData('GetVehicleRegistrationWarningMessage', {}, postDataAdd).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.oResponse);
                    } else {
                        if (data['errorMessage'] || data['fullError']) {
                            this.errorModal.show(data, true);
                        }
                        else {
                            this.uiForm.controls['VRegWarningMessage'].setValue(data['VRegWarningMessage'] || '');
                            if (this.uiForm.controls['VRegWarningMessage'].value) {
                                this.messageModal.show({ msg: this.uiForm.controls['VRegWarningMessage'].value, title: 'Information' }, false);
                                this.uiForm.controls['VRegWarningMessage'].setValue('');
                            }
                        }
                    }

                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }


    public processTimeString(vbTimeField: any): any {
        let vbTime: any;
        let vbDurationHours;
        let vbDurationMinutes;
        let vbTimeSec;
        let vbVisitDurationSec;
        let vbError;
        let vbMsgResult;
        let vbTimeFormat;
        let vbTimeSeparator = '';

        vbError = false;
        vbTimeSeparator = ':';
        vbTimeFormat = '##00' + vbTimeSeparator + '##';

        switch (vbTimeField) {
            case 'MaxHoursPerWeek':
                vbTime = this.uiForm.controls['MaxHoursPerWeek'].value.replace(vbTimeSeparator, '');
                break;
            default:
                break;
        }


        if (!this.isNumber(vbTime)) {
            vbError = true;
        }
        if (!vbError && (vbTime.length < 4 || vbTime.length > 7)) {
            vbError = true;
        }
        else if (!vbError) {

            if (!vbError && vbTime === '0') {
                vbError = true;
            }
            if (!vbError) {
                vbDurationHours = vbTime.substr(1, vbTime.length - 2);
                vbDurationMinutes = vbTime.substr(vbTime.length - 2);
                if (vbDurationMinutes > 59) {
                    this.messageModal.show({ msg: this.translatedMessageList['Minutes_Entered_Cannot'], title: 'Warning' }, false);
                    vbError = true;
                } else {
                    vbTimeSec = (vbDurationHours * 60 * 60) + (vbDurationMinutes * 60);
                }
            }
        }


        switch (vbTimeField) {
            case 'MaxHoursPerWeek':
                if (!vbError) {
                    let time = vbTime.substring(0, vbTime.length - 2) + ':' + vbTime.substring(vbTime.length - 2);
                    this.uiForm.controls['MaxHoursPerWeek'].setValue(time);
                }
                else {
                    this.uiForm.controls['MaxHoursPerWeek'].setValue('');
                }
                this.uiForm.controls['MaxHoursPerWeek'].updateValueAndValidity();
                break;
            default:
                break;
        }

    }

    public buildMenu(): any {
        //this.iefAddCustomOptions()
    }

    public getBranchDefault(): any {
        let postDataAdd = {};
        postDataAdd[this.serviceConstants.Function] = 'GetBranchDefault';
        postDataAdd[this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
        postDataAdd['BranchNumber'] = this.utils.getBranchCode();
        postDataAdd['OccupationCode'] = this.uiForm.controls['OccupationCode'].value;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('GetBranchDefault', {}, postDataAdd).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data['errorMessage'] || data['fullError']) {
                        this.isError('OccupationCode');
                        this.errorModal.show(data, true);
                    }
                    else {
                        if (data) {
                            this.uiForm.controls['StdHoursPerDay'].setValue(this.getSecondsToHms(data['StdHoursPerDay']));
                            this.uiForm.controls['PersonalDrivingTime'].setValue(this.getSecondsToHms(data['PersonalDrivingTime']));
                            this.uiForm.controls['MaxOTPerDay'].setValue(this.getSecondsToHms(data['MaxOTPerDay']));
                            this.uiForm.controls['AvgDrivingWorkDay'].setValue(data['AvgDrivingWorkDay']);
                            this.uiForm.controls['MaxHoursPerWeek'].setValue(data['MaxHoursPerWeek']);
                            this.uiForm.controls['AverageSickness'].setValue(data['AverageSickness']);
                            this.uiForm.controls['Occupation'].setValue(data['Occupation']);
                            this.uiForm.controls['StandardBreakTime'].setValue(this.getSecondsToHms(data['StandardBreakTime']));
                            this.uiForm.controls['WindowStart01'].setValue(this.getSecondsToHms(data['WindowStart01']));
                            this.uiForm.controls['WindowStart02'].setValue(this.getSecondsToHms(data['WindowStart02']));
                            this.uiForm.controls['WindowStart03'].setValue(this.getSecondsToHms(data['WindowStart03']));
                            this.uiForm.controls['WindowStart04'].setValue(this.getSecondsToHms(data['WindowStart04']));
                            this.uiForm.controls['WindowStart05'].setValue(this.getSecondsToHms(data['WindowStart05']));
                            this.uiForm.controls['WindowStart06'].setValue(this.getSecondsToHms(data['WindowStart06']));
                            this.uiForm.controls['WindowStart07'].setValue(this.getSecondsToHms(data['WindowStart07']));
                            this.uiForm.controls['WindowEnd01'].setValue(this.getSecondsToHms(data['WindowEnd01']));
                            this.uiForm.controls['WindowEnd02'].setValue(this.getSecondsToHms(data['WindowEnd02']));
                            this.uiForm.controls['WindowEnd03'].setValue(this.getSecondsToHms(data['WindowEnd03']));
                            this.uiForm.controls['WindowEnd04'].setValue(this.getSecondsToHms(data['WindowEnd04']));
                            this.uiForm.controls['WindowEnd05'].setValue(this.getSecondsToHms(data['WindowEnd05']));
                            this.uiForm.controls['WindowEnd06'].setValue(this.getSecondsToHms(data['WindowEnd06']));
                            this.uiForm.controls['WindowEnd07'].setValue(this.getSecondsToHms(data['WindowEnd07']));
                            this.uiForm.controls['WindowDayInd01'].setValue(this.setFieldValue(data['WindowDayInd01'], true));
                            this.uiForm.controls['WindowDayInd02'].setValue(this.setFieldValue(data['WindowDayInd02'], true));
                            this.uiForm.controls['WindowDayInd03'].setValue(this.setFieldValue(data['WindowDayInd03'], true));
                            this.uiForm.controls['WindowDayInd04'].setValue(this.setFieldValue(data['WindowDayInd04'], true));
                            this.uiForm.controls['WindowDayInd05'].setValue(this.setFieldValue(data['WindowDayInd05'], true));
                            this.uiForm.controls['WindowDayInd06'].setValue(this.setFieldValue(data['WindowDayInd06'], true));
                            this.uiForm.controls['WindowDayInd07'].setValue(this.setFieldValue(data['WindowDayInd07'], true));
                        }
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
        );
    }

    public cmdGetAddress1_onclick(event: any): any {
        event.preventDefault();
        if (this.pageParams.vSCEnableHopewiserPAF === true) {
            //riExchange.Mode = 'Employee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Model/riMPAFSearch.htm'
            //alert('TODO: Model/riMPAFSearch.htm');
            if (this.riPostcodeSearchEllipsis) {
                this.ellipsisConfig.riPostcodeSearch.childConfigParams.parentMode = 'Employee';
                this.riPostcodeSearchEllipsis.contentComponent = ScreenNotReadyComponent;
                this.riPostcodeSearchEllipsis.updateComponent();
                setTimeout(() => {
                    this.riPostcodeSearchEllipsis.openModal();
                }, 100);
            }
        }
        if (this.pageParams.vSCEnableDatabasePAF === true) {
            this.ellipsisConfig.postcodeSearch.childConfigParams['Town'] = this.getFieldValue(this.uiForm.controls['EmployeeAddressLine4']);
            this.ellipsisConfig.postcodeSearch.childConfigParams['State'] = this.getFieldValue(this.uiForm.controls['EmployeeAddressLine5']);
            this.ellipsisConfig.postcodeSearch.childConfigParams['Postcode'] = this.getFieldValue(this.uiForm.controls['EmployeePostcode']);
            if (this.postcodeSearchEllipsis) {
                this.ellipsisConfig.postcodeSearch.childConfigParams.parentMode = 'Employee';
                this.postcodeSearchEllipsis.contentComponent = AUPostcodeSearchComponent;
                this.postcodeSearchEllipsis.updateComponent();
                setTimeout(() => {
                    this.postcodeSearchEllipsis.openModal();
                }, 100);
            }
        }
    }


    public cmdGetAddress2_onclick(event: any): any {
        event.preventDefault();
        if (this.pageParams.vSCEnableHopewiserPAF === true) {
            //riExchange.Mode = 'NoK': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Model/riMPAFSearch.htm'
            //alert('TODO: Model/riMPAFSearch.htm');
            if (this.riPostcodeSearchEllipsis) {
                this.ellipsisConfig.riPostcodeSearch.childConfigParams.parentMode = 'NoK';
                this.riPostcodeSearchEllipsis.contentComponent = ScreenNotReadyComponent;
                this.riPostcodeSearchEllipsis.updateComponent();
                setTimeout(() => {
                    this.riPostcodeSearchEllipsis.openModal();
                }, 100);
            }
        }
        if (this.pageParams.vSCEnableDatabasePAF === true) {
            this.ellipsisConfig.postcodeSearch.childConfigParams['Town'] = this.getFieldValue(this.uiForm.controls['NoKAddressLine4']);
            this.ellipsisConfig.postcodeSearch.childConfigParams['State'] = this.getFieldValue(this.uiForm.controls['NoKAddressLine5']);
            this.ellipsisConfig.postcodeSearch.childConfigParams['Postcode'] = this.getFieldValue(this.uiForm.controls['NoKPostcode']);
            if (this.postcodeSearchEllipsis) {
                this.ellipsisConfig.postcodeSearch.childConfigParams.parentMode = 'NoK';
                this.postcodeSearchEllipsis.contentComponent = AUPostcodeSearchComponent;
                this.postcodeSearchEllipsis.updateComponent();
                setTimeout(() => {
                    this.postcodeSearchEllipsis.openModal();
                }, 100);
            }
        }
    }

    public cmdGeocode_onclick(event: any): any {
        event.preventDefault();
        //riExchange.Mode = 'Employee';
        //window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSARoutingSearch.htm'
        alert('TODO: Application/iCABSARoutingSearch.htm');
    }

    public cmdReload_onclick(event: any): any {
        event.preventDefault();
        this.uiForm.controls['TabletReloadFromDate'].updateValueAndValidity();
        let lGoReload;

        lGoReload = true;
        if (this.riExchange.riInputElement.isError(this.uiForm, 'TabletReloadFromDate') && !this.uiForm.controls['TabletReloadFromDate'].value) {
            lGoReload = false;
        }

        if (lGoReload && !this.isDate(this.uiForm.controls['TabletReloadFromDate'].value)) {
            lGoReload = false;
        }

        if (!lGoReload) {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'TabletReloadFromDate', true);
            this.setRequiredStatus('TabletReloadFromDate', true);
        }

        if (lGoReload) {
            let postDataAdd = {};
            postDataAdd[this.serviceConstants.Action] = '6';
            postDataAdd[this.serviceConstants.Function] = 'TabletReload';
            postDataAdd['EmployeeCode'] = this.uiForm.controls['EmployeeCode'].value;
            postDataAdd['TabletReloadFromDate'] = this.uiForm.controls['TabletReloadFromDate'].value ? this.globalize.parseDateToFixedFormat(this.uiForm.controls['TabletReloadFromDate'].value) : '';

            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchRecordData('TabletReload', {}, postDataAdd).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.oResponse);
                    } else {
                        if (data['errorMessage'] || data['fullError']) {
                            this.errorModal.show(data, true);
                        }
                        else {
                            if (data['InformationText'])
                                this.messageModal.show({ msg: data['InformationText'], title: 'Message' }, false);
                        }
                    }

                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            );
        }
    }


    public cmdCourses_onclick(event: any): any {
        event.preventDefault();
        if (this.recordSelected()) {
            //riExchange.Mode = 'Employee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBCourseSearch.htm'
            alert('Business/iCABSBCourseSearch.htm');
        }
    }


    public cmdQualifications_onclick(event: any): any {
        event.preventDefault();
        if (this.recordSelected()) {
            //riExchange.Mode = 'Employee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBEmployeeQualificationGrid.htm'
            alert('Business/iCABSBEmployeeQualificationGrid.htm');
        }
    }

    public cmdDiary_onclick(event: any): any {
        event.preventDefault();
        if (this.recordSelected()) {
            this.navigate('Employee', InternalGridSearchServiceModuleRoutes.ICABSADIARYYEARGRID);
            // riExchange.Mode = 'Employee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSADiaryYearGrid.htm<maxwidth>'
            // alert('Application/iCABSADiaryYearGrid.htm');
        }
    }

    public cmdAvailability_onclick(event: any): any {
        event.preventDefault();
        if (this.recordSelected()) {
            //riExchange.Mode = 'Employee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBEmployeeAvailabilityTemplate.htm'
            alert('TODO: iCABSBEmployeeAvailabilityTemplate.htm');
        }
    }

    public cmdLocation_onclick(event: any): any {
        if (this.recordSelected()) {
            //riExchange.Mode = 'Employee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBLocOverrideAvailabilityTemplate.htm'
            alert('TODO: iCABSBLocOverrideAvailabilityTemplate.htm');
        }
    }

    public cmdAvailDayOverride_onclick(event: any): any {
        if (this.recordSelected()) {
            //riExchange.Mode = 'Employee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBBranchAvailabilityDetWeeks.htm'
            alert('TODO:iCABSBBranchAvailabilityDetWeeks.htm');
        }
    }

    public cmdNonServAppointment_onclick(event: any): any {
        if (this.recordSelected()) {
            //riExchange.Mode = 'Employee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBLocationAvailabilityDetWeeks.htm'
            alert('TODO: Business/iCABSBLocationAvailabilityDetWeeks.htm');
        }
    }

    public cmdCopyAddress_onclick(event: any): any {

        if (this.pageParams.addMode || this.pageParams.updateMode) {

            if (this.pageParams.vSCCapitalFirstLtr === true) {
                this.uiForm.controls['NoKAddressLine1'].setValue(this.uiForm.controls['EmployeeAddressLine1'].value);
                this.uiForm.controls['NoKAddressLine2'].setValue(this.uiForm.controls['EmployeeAddressLine2'].value);
                this.uiForm.controls['NoKAddressLine3'].setValue(this.uiForm.controls['EmployeeAddressLine3'].value);
                this.uiForm.controls['NoKAddressLine4'].setValue(this.uiForm.controls['EmployeeAddressLine4'].value);
                this.uiForm.controls['NoKAddressLine5'].setValue(this.uiForm.controls['EmployeeAddressLine5'].value);
                this.uiForm.controls['NoKPostcode'].setValue(this.uiForm.controls['EmployeePostcode'].value ? this.uiForm.controls['EmployeePostcode'].value.toUpperCase() : '');
                this.uiForm.controls['NoKHomeTelephone'].setValue(this.uiForm.controls['HomeTelephone'].value);
            }
            else {
                this.uiForm.controls['NoKAddressLine1'].setValue(this.uiForm.controls['EmployeeAddressLine1'].value ? this.uiForm.controls['EmployeeAddressLine1'].value['capitalizeFirstLetter']() : '');
                this.uiForm.controls['NoKAddressLine2'].setValue(this.uiForm.controls['EmployeeAddressLine2'].value ? this.uiForm.controls['EmployeeAddressLine2'].value['capitalizeFirstLetter']() : '');
                this.uiForm.controls['NoKAddressLine3'].setValue(this.uiForm.controls['EmployeeAddressLine3'].value ? this.uiForm.controls['EmployeeAddressLine3'].value['capitalizeFirstLetter']() : '');
                this.uiForm.controls['NoKAddressLine4'].setValue(this.uiForm.controls['EmployeeAddressLine4'].value ? this.uiForm.controls['EmployeeAddressLine4'].value['capitalizeFirstLetter']() : '');
                this.uiForm.controls['NoKAddressLine5'].setValue(this.uiForm.controls['EmployeeAddressLine5'].value ? this.uiForm.controls['EmployeeAddressLine5'].value['capitalizeFirstLetter']() : '');
                this.uiForm.controls['NoKPostcode'].setValue(this.uiForm.controls['EmployeePostcode'].value ? this.uiForm.controls['EmployeePostcode'].value.toUpperCase() : '');
                this.uiForm.controls['NoKHomeTelephone'].setValue(this.uiForm.controls['HomeTelephone'].value ? this.uiForm.controls['HomeTelephone'].value['capitalizeFirstLetter']() : '');
            }
            this.uiForm.updateValueAndValidity();
        }
    }

    public btnDefault_onclick(event: any): any {
        this.promptMode = 'btnDefault_onclick';
        this.promptConfig.OKCancel.promptConfirmTitle = this.translatedMessageList.Working_Hours;
        this.promptConfig.OKCancel.promptConfirmContent = this.translatedMessageList.This_will_retrieve_the_default;
        this.promptOKCancelModal.show();
    }

    private btnDefaultConfirm(value?: any): any {
        let postDataAdd = {};
        postDataAdd[this.serviceConstants.Action] = '6';
        postDataAdd[this.serviceConstants.Function] = 'GetBusinessDefault';
        postDataAdd['BusinessCode'] = this.utils.getBusinessCode();
        postDataAdd['BranchNumber'] = this.utils.getBranchCode();
        postDataAdd['OccupationCode'] = this.uiForm.controls['OccupationCode'].value;


        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('GetBusinessDefault', {}, postDataAdd).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data['errorMessage'] || data['fullError']) {
                        this.errorModal.show(data, true);
                    }
                    else {
                        this.uiForm.controls['StdHoursPerDay'].setValue(this.getSecondsToHms(data['StdHoursPerDay']));
                        this.uiForm.controls['PersonalDrivingTime'].setValue(this.getSecondsToHms(data['PersonalDrivingTime']));
                        this.uiForm.controls['MaxOTPerDay'].setValue(this.getSecondsToHms(data['MaxOTPerDay']));
                        this.uiForm.controls['AvgDrivingWorkDay'].setValue(data['AvgDrivingWorkDay']);
                        this.uiForm.controls['MaxHoursPerWeek'].setValue(this.setFieldValue(data['MaxHoursPerWeek']));
                        this.uiForm.controls['AverageSickness'].setValue(data['AverageSickness']);
                        this.uiForm.controls['StandardBreakTime'].setValue(this.getSecondsToHms(data['StdBreakTime']));
                        this.uiForm.controls['WindowStart01'].setValue(this.getSecondsToHms(data['WindowStart01']));
                        this.uiForm.controls['WindowStart02'].setValue(this.getSecondsToHms(data['WindowStart02']));
                        this.uiForm.controls['WindowStart03'].setValue(this.getSecondsToHms(data['WindowStart03']));
                        this.uiForm.controls['WindowStart04'].setValue(this.getSecondsToHms(data['WindowStart04']));
                        this.uiForm.controls['WindowStart05'].setValue(this.getSecondsToHms(data['WindowStart05']));
                        this.uiForm.controls['WindowStart06'].setValue(this.getSecondsToHms(data['WindowStart06']));
                        this.uiForm.controls['WindowStart07'].setValue(this.getSecondsToHms(data['WindowStart07']));
                        this.uiForm.controls['WindowEnd01'].setValue(this.getSecondsToHms(data['WindowEnd01']));
                        this.uiForm.controls['WindowEnd02'].setValue(this.getSecondsToHms(data['WindowEnd02']));
                        this.uiForm.controls['WindowEnd03'].setValue(this.getSecondsToHms(data['WindowEnd03']));
                        this.uiForm.controls['WindowEnd04'].setValue(this.getSecondsToHms(data['WindowEnd04']));
                        this.uiForm.controls['WindowEnd05'].setValue(this.getSecondsToHms(data['WindowEnd05']));
                        this.uiForm.controls['WindowEnd06'].setValue(this.getSecondsToHms(data['WindowEnd06']));
                        this.uiForm.controls['WindowEnd07'].setValue(this.getSecondsToHms(data['WindowEnd07']));
                        this.uiForm.controls['WindowDayInd01'].setValue(this.setFieldValue(data['WindowDayInd01'], true));
                        this.uiForm.controls['WindowDayInd02'].setValue(this.setFieldValue(data['WindowDayInd02'], true));
                        this.uiForm.controls['WindowDayInd03'].setValue(this.setFieldValue(data['WindowDayInd03'], true));
                        this.uiForm.controls['WindowDayInd04'].setValue(this.setFieldValue(data['WindowDayInd04'], true));
                        this.uiForm.controls['WindowDayInd05'].setValue(this.setFieldValue(data['WindowDayInd05'], true));
                        this.uiForm.controls['WindowDayInd06'].setValue(this.setFieldValue(data['WindowDayInd06'], true));
                        this.uiForm.controls['WindowDayInd07'].setValue(this.setFieldValue(data['WindowDayInd07'], true));
                    }
                }

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.messageModal.show({ msg: error, title: 'Error' }, false);
            }
        );

    }

    public homeGPSCoordinateX_onchange(): any {
        this.setRoutingSource();
    }

    public homeGPSCoordinateY_onchange(): any {
        this.setRoutingSource();
    }

    public routingScore_onchange(): any {
        this.setRoutingSource();
    }

    public setRoutingSource(): any {
        let decGPSX;
        let decGPSY;
        let intRoutingScore;


        if (this.uiForm.controls['HomeGPSCoordinateX'].value && !isNaN(this.uiForm.controls['HomeGPSCoordinateX'].value)) {
            decGPSX = this.uiForm.controls['HomeGPSCoordinateX'].value;
        } else {
            decGPSX = 0;
        }

        if (this.uiForm.controls['HomeGPSCoordinateY'].value && !isNaN(this.uiForm.controls['HomeGPSCoordinateY'].value)) {
            decGPSY = this.uiForm.controls['HomeGPSCoordinateY'].value;
        } else {
            decGPSY = 0;
        }

        if (this.uiForm.controls['RoutingScore'].value && !isNaN(this.uiForm.controls['RoutingScore'].value)) {
            intRoutingScore = this.uiForm.controls['RoutingScore'].value;
        } else {
            intRoutingScore = 0;
        }

        if (intRoutingScore === 0 || decGPSY === 0 || decGPSX === 0) {
            this.uiForm.controls['SelRoutingSource'].setValue('');
            this.uiForm.controls['RoutingSource'].setValue('');
        } else {
            this.uiForm.controls['SelRoutingSource'].setValue('M');
            this.uiForm.controls['RoutingSource'].setValue('M');
        }
    }

    public menu_onchange(value: any): any {
        this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'menu');

        switch (value) {
            case 'Diary':
                this.cmdDiary_onclick(event);
                break;
        }
    }

    public maxHoursPerWeek_OnChange(): any {
        this.processTimeString('MaxHoursPerWeek');
    }

    public setMenuOptions(): any {
        let vbEnableQualifications;
        let postDataAdd = {};
        postDataAdd[this.serviceConstants.Function] = 'CheckOccupation';
        postDataAdd['BusinessCode'] = this.utils.getBusinessCode();


        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('CheckOccupation', {}, postDataAdd).subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data.errorMessage) {
                        this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                    }
                    else {
                        if (data['OccupationIsAllow'] === 'yes') {
                            vbEnableQualifications = true;
                        } else {
                            vbEnableQualifications = false;
                        }
                        if (vbEnableQualifications) {
                            this.menuOptionList.push({ value: 'Qualifications', text: this.translatedMessageList['Qualifications'] });
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });


    }

    private recordSelected(): any {
        return this.storeData ? true : false;
    }

    public setFormData(data: any): void {
        // tab - grddetails

        this.employeeId = this.setFieldValue(data.Employee);
        this.uiForm.controls['EmployeeCode'].setValue(this.setFieldValue(data.EmployeeCode));

        this.uiForm.controls['EmployeeForename1'].setValue(this.setFieldValue(data.EmployeeForename1));
        this.uiForm.controls['EmployeeForename2'].setValue(this.setFieldValue(data.EmployeeForename2));
        this.uiForm.controls['EmployeeForename3'].setValue(this.setFieldValue(data.EmployeeForename3));
        this.uiForm.controls['EmployeeSurname'].setValue(this.setFieldValue(data.EmployeeSurname));
        this.uiForm.controls['BranchNumber'].setValue(this.setFieldValue(data.BranchNumber));
        this.uiForm.controls['BranchName'].setValue(this.setFieldValue(data.BranchName));

        this.uiForm.controls['OccupationCode'].setValue(this.setFieldValue(data.OccupationCode));
        this.uiForm.controls['OccupationDesc'].setValue(this.setFieldValue(data.OccupationDesc));
        this.uiForm.controls['RealPerson'].setValue(this.setFieldValue(data.RealPerson, true));
        this.uiForm.controls['SupervisorEmployeeCode'].setValue(this.setFieldValue(data.SupervisorEmployeeCode));
        this.uiForm.controls['MaritalStatusCode'].setValue(this.setFieldValue(data.MaritalStatusCode));
        this.uiForm.controls['MaritalStatusDesc'].setValue(this.setFieldValue(data.MaritalStatusDesc));

        this.uiForm.controls['GenderCode'].setValue(this.setFieldValue(data.GenderCode));
        this.uiForm.controls['GenderDesc'].setValue(this.setFieldValue(data.GenderDesc));
        this.zone.run(() => {
            this.dropdownConfig.genderSearch.selected = {
                id: this.uiForm.controls['GenderCode'].value || '',
                text: (this.uiForm.controls['GenderCode'].value) ? (this.uiForm.controls['GenderCode'].value + ' - ' + this.uiForm.controls['GenderDesc'].value || '') : ''
            };
        });

        this.zone.run(() => {
            this.dropdownConfig.branchSearch.selected = {
                id: this.uiForm.controls['BranchNumber'].value || '',
                text: this.uiForm.controls['BranchName'].value ? (this.uiForm.controls['BranchNumber'].value + ' - ' + this.uiForm.controls['BranchName'].value) : this.uiForm.controls['BranchNumber'].value
            };
        });

        // tab - grdContact
        this.uiForm.controls['WorkEmail'].setValue(this.setFieldValue(data.WorkEmail));
        this.uiForm.controls['SMSMessageNumber'].setValue(this.setFieldValue(data.SMSMessageNumber));
        this.uiForm.controls['TelephoneNumber'].setValue(this.setFieldValue(data.TelephoneNumber));
        this.uiForm.controls['SecondaryContactNumber'].setValue(this.setFieldValue(data.SecondaryContactNumber));
        this.uiForm.controls['LanguageCode'].setValue(this.setFieldValue(data.LanguageCode));
        this.uiForm.controls['LanguageDescription'].setValue(this.setFieldValue(data.LanguageDescription));

        // tab - grdGeneral
        this.uiForm.controls['Grade'].setValue(this.setFieldValue(data.Grade));
        this.uiForm.controls['UserCode'].setValue(this.setFieldValue(data.EmployeeUserCode));
        this.uiForm.controls['UserName'].setValue(this.setFieldValue(data.UserName));
        this.uiForm.controls['DateOfBirth'].setValue(this.setFieldValue(data.DateOfBirth, false, true));
        this.datepicker.DateOfBirth.value = this.setFieldValue(data.DateOfBirth, false, true);
        this.uiForm.controls['DateJoined'].setValue(this.setFieldValue(data.DateJoined, false, true));
        this.datepicker.DateJoined.value = this.setFieldValue(data.DateJoined, false, true);
        this.uiForm.controls['PreviousService'].setValue(this.setFieldValue(data.PreviousService));
        this.uiForm.controls['LeaveEntitlement'].setValue(this.setFieldValue(data.LeaveEntitlement));
        this.uiForm.controls['ContractReceived'].setValue(this.setFieldValue(data.ContractReceived, true));
        this.uiForm.controls['CommissionValid'].setValue(this.setFieldValue(data.CommissionValid, true));
        this.uiForm.controls['PendingDeliveryValid'].setValue(this.setFieldValue(data.PendingDeliveryValid, true));
        this.uiForm.controls['FirstAider'].setValue(this.setFieldValue(data.FirstAider, true));
        this.uiForm.controls['FirstAidReviewDate'].setValue(this.setFieldValue(data.FirstAidReviewDate));
        this.datepicker.FirstAidReviewDate.value = this.setFieldValue(data.FirstAidReviewDate);
        this.uiForm.controls['EarliestStartTime'].setValue(this.getSecondsToHms(data.EarliestStartTime));
        this.uiForm.controls['FixedBreakTime'].setValue(this.getSecondsToHms(data.FixedBreakTime));
        this.uiForm.controls['RecordMileageInd'].setValue(this.setFieldValue(data.RecordMileageInd, true));
        this.uiForm.controls['TabletUserInd'].setValue(this.setFieldValue(data.TabletUserInd, true));
        this.uiForm.controls['GoogleCalendarEnabled'].setValue(this.setFieldValue(data.GoogleCalendarEnabled, true));
        this.uiForm.controls['ExternalID'].setValue(this.setFieldValue(data.ExternalID));
        this.uiForm.controls['TabletReloadFromDate'].setValue(this.setFieldValue(data.TabletReloadFromDate));
        //this.datepicker.TabletReloadFromDate.value = this.setFieldValue(data.TabletReloadFromDate);
        this.uiForm.controls['riTimezoneCodeSelect'].setValue(this.setFieldValue(data.riTimezoneCode));
        this.uiForm.controls['riTimezoneCode'].setValue(this.setFieldValue(data.riTimezoneCode));
        this.uiForm.controls['LOSCode'].setValue(this.setFieldValue(data.LOSCode));
        this.uiForm.controls['LOSCodeSelect'].setValue(this.setFieldValue(data.LOSCode));
        //console.log('LOSCodeSelect', data.LOSCode);
        // div - grdAddress

        this.uiForm.controls['EmployeeAddressLine1'].setValue(this.setFieldValue(data.EmployeeAddressLine1));
        this.uiForm.controls['EmployeeAddressLine2'].setValue(this.setFieldValue(data.EmployeeAddressLine2));
        this.uiForm.controls['EmployeeAddressLine3'].setValue(this.setFieldValue(data.EmployeeAddressLine3));
        this.uiForm.controls['EmployeeAddressLine4'].setValue(this.setFieldValue(data.EmployeeAddressLine4));
        this.uiForm.controls['EmployeeAddressLine5'].setValue(this.setFieldValue(data.EmployeeAddressLine5));
        this.uiForm.controls['EmployeePostcode'].setValue(this.setFieldValue(data.EmployeePostcode));
        this.uiForm.controls['StartWorkFromHomeInd'].setValue(this.setFieldValue(data.StartWorkFromHomeInd, true));
        this.uiForm.controls['HomeGPSCoordinateX'].setValue(this.setFieldValue(data.HomeGPSCoordinateX));
        this.uiForm.controls['HomeGPSCoordinateY'].setValue(this.setFieldValue(data.HomeGPSCoordinateY));
        this.uiForm.controls['RoutingGeonode'].setValue(this.setFieldValue(data.RoutingGeonode));
        this.uiForm.controls['RoutingScore'].setValue(this.setFieldValue(data.RoutingScore));
        this.uiForm.controls['HomeTelephone'].setValue(this.setFieldValue(data.HomeTelephone));
        this.uiForm.controls['MobileTelephone'].setValue(this.setFieldValue(data.MobileTelephone));
        this.uiForm.controls['HomeEmail'].setValue(this.setFieldValue(data.HomeEmail));
        this.uiForm.controls['SelRoutingSource'].setValue(this.setFieldValue(data.RoutingSource));
        this.uiForm.controls['RoutingSource'].setValue(this.setFieldValue(data.RoutingSource));

        //div 5  grdNoKAddress
        this.uiForm.controls['NoKRelationship'].setValue(this.setFieldValue(data.NoKRelationship));
        this.uiForm.controls['NoKName'].setValue(this.setFieldValue(data.NoKName));
        this.uiForm.controls['NoKAddressLine1'].setValue(this.setFieldValue(data.NoKAddressLine1));
        this.uiForm.controls['NoKAddressLine2'].setValue(this.setFieldValue(data.NoKAddressLine2));
        this.uiForm.controls['NoKAddressLine3'].setValue(this.setFieldValue(data.NoKAddressLine3));
        this.uiForm.controls['NoKAddressLine4'].setValue(this.setFieldValue(data.NoKAddressLine4));
        this.uiForm.controls['NoKAddressLine5'].setValue(this.setFieldValue(data.NoKAddressLine5));
        this.uiForm.controls['NoKPostcode'].setValue(this.setFieldValue(data.NoKPostcode));
        this.uiForm.controls['NoKHomeTelephone'].setValue(this.setFieldValue(data.NoKHomeTelephone));
        this.uiForm.controls['NoKOtherTelephone'].setValue(this.setFieldValue(data.NoKOtherTelephone));

        // div 6 grdVehicle
        this.uiForm.controls['ClassType'].setValue(this.setFieldValue(data.ClassType));
        this.uiForm.controls['VehicleRegistration'].setValue(this.setFieldValue(data.VehicleRegistration));
        this.uiForm.controls['PetrolCardNumber'].setValue(this.setFieldValue(data.PetrolCardNumber));
        this.uiForm.controls['DrivingLicenceNumber'].setValue(this.setFieldValue(data.DrivingLicenceNumber));
        this.uiForm.controls['DrivingLicenceExpiryDate'].setValue(this.setFieldValue(data.DrivingLicenceExpiryDate));
        this.datepicker.DrivingLicenceExpiryDate.value = this.setFieldValue(data.DrivingLicenceExpiryDate);

        //grdLeft
        this.uiForm.controls['DateLeft'].setValue(this.setFieldValue(data.DateLeft));
        this.datepicker.DateLeft.value = this.setFieldValue(data.DateLeft, false, true);
        this.uiForm.controls['LeavingReason'].setValue(this.setFieldValue(data.LeavingReason));

        // div - grdSDetails
        this.uiForm.controls['Occupation'].setValue(this.setFieldValue(data.Occupation));
        this.uiForm.controls['WindowStart01'].setValue(this.getSecondsToHms(data.WindowStart01));
        this.uiForm.controls['WindowEnd01'].setValue(this.getSecondsToHms(data.WindowEnd01));
        this.uiForm.controls['WindowDayInd01'].setValue(this.setFieldValue(data.WindowDayInd01, true));
        this.uiForm.controls['WindowStart02'].setValue(this.getSecondsToHms(data.WindowStart02));
        this.uiForm.controls['WindowEnd02'].setValue(this.getSecondsToHms(data.WindowEnd02));
        this.uiForm.controls['WindowDayInd02'].setValue(this.setFieldValue(data.WindowDayInd02, true));
        this.uiForm.controls['WindowStart03'].setValue(this.getSecondsToHms(data.WindowStart03));
        this.uiForm.controls['WindowEnd03'].setValue(this.getSecondsToHms(data.WindowEnd03));
        this.uiForm.controls['WindowDayInd03'].setValue(this.setFieldValue(data.WindowDayInd03, true));
        this.uiForm.controls['WindowStart04'].setValue(this.getSecondsToHms(data.WindowStart04));
        this.uiForm.controls['WindowEnd04'].setValue(this.getSecondsToHms(data.WindowEnd04));
        this.uiForm.controls['WindowDayInd04'].setValue(this.setFieldValue(data.WindowDayInd04, true));
        this.uiForm.controls['WindowStart05'].setValue(this.getSecondsToHms(data.WindowStart05));
        this.uiForm.controls['WindowEnd05'].setValue(this.getSecondsToHms(data.WindowEnd05));
        this.uiForm.controls['WindowDayInd05'].setValue(this.setFieldValue(data.WindowDayInd05, true));
        this.uiForm.controls['WindowStart06'].setValue(this.getSecondsToHms(data.WindowStart06));
        this.uiForm.controls['WindowEnd06'].setValue(this.getSecondsToHms(data.WindowEnd06));
        this.uiForm.controls['WindowDayInd06'].setValue(this.setFieldValue(data.WindowDayInd06, true));
        this.uiForm.controls['WindowStart07'].setValue(this.getSecondsToHms(data.WindowStart07));
        this.uiForm.controls['WindowEnd07'].setValue(this.getSecondsToHms(data.WindowEnd07));
        this.uiForm.controls['WindowDayInd07'].setValue(this.setFieldValue(data.WindowDayInd07, true));
        this.uiForm.controls['StdHoursPerDay'].setValue(this.getSecondsToHms(data.StdHoursPerDay));
        this.uiForm.controls['PersonalDrivingTime'].setValue(this.getSecondsToHms(data.PersonalDrivingTime));
        this.uiForm.controls['ManpowerPlanning'].setValue(this.setFieldValue(data.ManpowerPlanning, true));
        this.uiForm.controls['MaxOTPerDay'].setValue(this.getSecondsToHms(data.MaxOTPerDay));
        this.uiForm.controls['AvgDrivingWorkDay'].setValue(this.setFieldValue(data.AvgDrivingWorkDay));
        this.uiForm.controls['MaxHoursPerWeek'].setValue(this.setFieldValue(data.MaxHoursPerWeek));
        this.uiForm.controls['AverageSickness'].setValue(this.setFieldValue(data.AverageSickness));
        this.uiForm.controls['StandardBreakTime'].setValue(this.getSecondsToHms(data.StandardBreakTime));
        this.uiForm.controls['PDAWorkLoad'].setValue(this.setFieldValue(data.PDAWorkLoad));
        this.uiForm.controls['PDAWorkLoadSel'].setValue(this.setFieldValue(data.PDAWorkLoad));
        this.uiForm.controls['EmployeeStartLocation7'].setValue(this.setFieldValue(data.EmployeeStartLocation7));
        this.uiForm.controls['EmployeeEndLocation7'].setValue(this.setFieldValue(data.EmployeeEndLocation7));
        this.uiForm.controls['EmployeeStartLocation1'].setValue(this.setFieldValue(data.EmployeeStartLocation1));
        this.uiForm.controls['EmployeeEndLocation1'].setValue(this.setFieldValue(data.EmployeeEndLocation1));
        this.uiForm.controls['EmployeeStartLocation2'].setValue(this.setFieldValue(data.EmployeeStartLocation2));
        this.uiForm.controls['EmployeeEndLocation2'].setValue(this.setFieldValue(data.EmployeeEndLocation2));
        this.uiForm.controls['EmployeeStartLocation3'].setValue(this.setFieldValue(data.EmployeeStartLocation3));
        this.uiForm.controls['EmployeeEndLocation3'].setValue(this.setFieldValue(data.EmployeeEndLocation3));
        this.uiForm.controls['EmployeeStartLocation4'].setValue(this.setFieldValue(data.EmployeeStartLocation4));
        this.uiForm.controls['EmployeeEndLocation4'].setValue(this.setFieldValue(data.EmployeeEndLocation4));
        this.uiForm.controls['EmployeeStartLocation5'].setValue(this.setFieldValue(data.EmployeeStartLocation5));
        this.uiForm.controls['EmployeeEndLocation5'].setValue(this.setFieldValue(data.EmployeeEndLocation5));
        this.uiForm.controls['EmployeeStartLocation6'].setValue(this.setFieldValue(data.EmployeeStartLocation6));
        this.uiForm.controls['EmployeeEndLocation6'].setValue(this.setFieldValue(data.EmployeeEndLocation6));
        this.uiForm.controls['EmployeeStartLocation7'].setValue(this.setFieldValue(data.EmployeeStartLocation7));
        this.uiForm.controls['EmployeeEndLocation7'].setValue(this.setFieldValue(data.EmployeeEndLocation7));
        this.uiForm.controls['EmployeeStartLocation1Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation1));
        this.uiForm.controls['EmployeeEndLocation1Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation1));
        this.uiForm.controls['EmployeeStartLocation2Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation2));
        this.uiForm.controls['EmployeeEndLocation2Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation2));
        this.uiForm.controls['EmployeeStartLocation3Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation3));
        this.uiForm.controls['EmployeeEndLocation3Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation3));
        this.uiForm.controls['EmployeeStartLocation4Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation4));
        this.uiForm.controls['EmployeeEndLocation4Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation4));
        this.uiForm.controls['EmployeeStartLocation5Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation5));
        this.uiForm.controls['EmployeeEndLocation5Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation5));
        this.uiForm.controls['EmployeeStartLocation6Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation6));
        this.uiForm.controls['EmployeeEndLocation6Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation6));
        this.uiForm.updateValueAndValidity();
    }

    public riMaintenance_AfterAbandon(): any {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();

        this.disableServiceDetails();
        if (this.uiForm.controls['TabletUserInd'].value === true) {
            this.showHideTabletReload(true);
        }
        else {
            this.showHideTabletReload(false);
        }
    }

    public riMaintenance_AfterAbandonUpdate(): any {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();
        this.disableServiceDetails();
    }

    public processForm(): void {
        this.datepicker.DateOfBirth.clearDate = true;
        this.datepicker.DateJoined.clearDate = true;
        this.datepicker.FirstAidReviewDate.clearDate = true;
        this.datepicker.TabletReloadFromDate.clearDate = true;
        this.datepicker.DrivingLicenceExpiryDate.clearDate = true;
        this.datepicker.DateLeft.clearDate = true;

        this.datepicker.DateOfBirth.value = null;
        this.datepicker.DateJoined.value = null;
        this.datepicker.FirstAidReviewDate.value = null;
        this.uiForm.controls['TabletReloadFromDate'].setValue('');

        this.datepicker.DrivingLicenceExpiryDate.value = null;
        this.datepicker.DateLeft.value = null;

        if (this.pageParams.updateMode && !this.pageParams.searchMode && !this.pageParams.addMode) {
            for (let key in this.uiForm.controls) {
                if (this.uiForm.controls[key]) {
                    this.uiForm.controls[key].enable();
                }
            }
            this.uiForm.controls['EmployeeCode'].disable();
            this.dropdownConfig.branchSearch.isDisabled = false;
            this.ellipsisConfig.occupationSearch.disabled = false;
            this.ellipsisConfig.supervisorEmp.disabled = false;
            this.dropdownConfig.maritalSearch.isDisabled = false;
            this.dropdownConfig.genderSearch.isDisabled = false;
            this.ellipsisConfig.riMUserInformationSearch.disabled = false;
            this.ellipsisConfig.languageCode.disabled = false;
            this.ellipsisConfig.vehicleClass.disabled = false;
            this.datepicker.DateOfBirth.isDisabled = false;
            this.datepicker.DateJoined.isDisabled = false;
            this.datepicker.FirstAidReviewDate.isDisabled = false;
            this.datepicker.DrivingLicenceExpiryDate.isDisabled = false;
            this.datepicker.DateLeft.isDisabled = false;
            this.disableControl('TabletReloadFromDate', false);
        }
        if (this.pageParams.searchMode && !this.pageParams.updateMode && !this.pageParams.addMode) {
            for (let key in this.uiForm.controls) {
                if (this.uiForm.controls[key]) {
                    this.uiForm.controls[key].disable();
                }
            }

            this.ellipsisConfig.employeeSearch.disabled = false;
            this.uiForm.controls['EmployeeCode'].enable();

            this.dropdownConfig.branchSearch.isDisabled = true;
            this.ellipsisConfig.occupationSearch.disabled = true;
            this.ellipsisConfig.supervisorEmp.disabled = true;
            this.dropdownConfig.maritalSearch.isDisabled = true;
            this.dropdownConfig.genderSearch.isDisabled = true;
            this.ellipsisConfig.riMUserInformationSearch.disabled = true;
            this.ellipsisConfig.languageCode.disabled = true;
            this.ellipsisConfig.vehicleClass.disabled = true;
            this.datepicker.DateOfBirth.isDisabled = true;
            this.datepicker.DateJoined.isDisabled = true;
            this.datepicker.FirstAidReviewDate.isDisabled = true;
            this.datepicker.DrivingLicenceExpiryDate.isDisabled = true;
            this.datepicker.DateLeft.isDisabled = true;
            this.disableControl('TabletReloadFromDate', true);
            this.uiForm.controls['cmdGetAddress2'].disable();
        }
        if (this.pageParams.addMode && !this.pageParams.updateMode && !this.pageParams.searchMode) {
            for (let key in this.uiForm.controls) {
                if (this.uiForm.controls[key]) {
                    this.uiForm.controls[key].enable();
                }
            }
            this.uiForm.controls['EmployeeCode'].enable();
            this.dropdownConfig.branchSearch.isDisabled = false;
            this.ellipsisConfig.occupationSearch.disabled = false;
            this.ellipsisConfig.supervisorEmp.disabled = false;
            this.dropdownConfig.maritalSearch.isDisabled = false;
            this.dropdownConfig.genderSearch.isDisabled = false;
            this.ellipsisConfig.riMUserInformationSearch.disabled = false;
            this.ellipsisConfig.languageCode.disabled = false;
            this.ellipsisConfig.vehicleClass.disabled = false;
            this.datepicker.DateOfBirth.isDisabled = false;
            this.datepicker.DateJoined.isDisabled = false;
            this.datepicker.FirstAidReviewDate.isDisabled = false;
            this.datepicker.DrivingLicenceExpiryDate.isDisabled = false;
            this.datepicker.DateLeft.isDisabled = false;
            this.disableControl('TabletReloadFromDate', false);
            this.uiForm.controls['PDAWorkLoadSel'].setValue('Weekly');

            this.uiForm.controls['BranchNumber'].setValue(this.utils.getBranchCode() || '');
            this.uiForm.controls['BranchName'].setValue(this.utils.getBranchText() || '');

            this.zone.run(() => {
                this.dropdownConfig.branchSearch.selected = {
                    id: this.utils.getBranchCode(),
                    text: this.utils.getBranchText()
                };
            });

            this.zone.run(() => {
                this.dropdownConfig.genderSearch.selected = {
                    id: '',
                    text: ''
                };
            });
            this.zone.run(() => {
                this.dropdownConfig.maritalSearch.selected = {
                    id: '',
                    text: ''
                };
            });

            this.uiForm.controls['LOSCodeSelect'].setValue(this.utils.getBusinessCode() || '');
        }

        this.uiForm.controls['menu'].setValue('');
        this.uiForm.controls['OccupationDesc'].disable();
        this.uiForm.controls['SupervisorSurname'].disable();
        this.uiForm.controls['UserName'].disable();
        this.uiForm.controls['LanguageDescription'].disable();
        this.uiForm.updateValueAndValidity();

    }

    public setFieldValue(controlObj: any, isCheckBox?: boolean, isDate?: boolean): any {
        if (isCheckBox === true) {
            return (controlObj) ? ((controlObj === 'Yes' || controlObj === 'yes' || controlObj === 'Y') ? true : false) : false;
        }
        if (isDate) {
            if (controlObj) {
                let tempDate = this.getFormattedDate(controlObj);
                return (tempDate) ? tempDate : controlObj;
            }
            else {
                return '';
            }
        }
        return ((controlObj !== undefined) && (controlObj !== null)) ? controlObj : '';
    }

    public getSecondsToHms(val: any): any {
        return (val) ? this.utils.secondsToHms(val) : '00:00';
    }

    public getHmsToSeconds(val: any): any {
        return (val) ? this.utils.hmsToSeconds(val) : '0';
    }

    public getFieldValue(controlObj: any, isCheckBox?: boolean, isDate?: boolean): any {
        if (isCheckBox === true) {
            return (controlObj && controlObj.value) ? ((controlObj.value === true) ? 'yes' : 'no') : 'no';
        }
        if (isDate) {
            if (controlObj && controlObj.value) {
                let tempDateString = this.globalize.parseDateToFixedFormat(controlObj.value);
                return (tempDateString) ? tempDateString : controlObj.value;
            }
            else {
                return '';
            }
        }
        return (controlObj && controlObj.value) ? controlObj.value : '';
    }

    private isCheckBoxChecked(arg: any): boolean {
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;

        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;
    }

    public getFormDataForEmployeeCode(): any {
        let formdata: Object = {};
        formdata['EmployeeCode'] = this.getFieldValue(this.uiForm.controls['EmployeeCode']);
        formdata['EmployeeForename1'] = this.getFieldValue(this.uiForm.controls['EmployeeForename1']);
        formdata['EmployeeForename2'] = this.getFieldValue(this.uiForm.controls['EmployeeForename2']);
        formdata['EmployeeForename3'] = this.getFieldValue(this.uiForm.controls['EmployeeForename3']);
        formdata['EmployeeSurname'] = this.getFieldValue(this.uiForm.controls['EmployeeSurname']);
        formdata['BranchNumber'] = this.getFieldValue(this.uiForm.controls['BranchNumber']);
        formdata['BranchName'] = this.getFieldValue(this.uiForm.controls['BranchName']);
        formdata['OccupationCode'] = this.getFieldValue(this.uiForm.controls['OccupationCode']);
        formdata['OccupationDesc'] = this.getFieldValue(this.uiForm.controls['OccupationDesc']);
        formdata['RealPerson'] = this.getFieldValue(this.uiForm.controls['RealPerson'], true);
        formdata['SupervisorEmployeeCode'] = this.getFieldValue(this.uiForm.controls['SupervisorEmployeeCode']);
        formdata['SupervisorSurname'] = this.getFieldValue(this.uiForm.controls['SupervisorSurname']);
        formdata['MaritalStatusCode'] = this.getFieldValue(this.uiForm.controls['MaritalStatusCode']);
        formdata['MaritalStatusDesc'] = this.getFieldValue(this.uiForm.controls['MaritalStatusDesc']);
        formdata['GenderCode'] = this.getFieldValue(this.uiForm.controls['GenderCode']);
        formdata['GenderDesc'] = this.getFieldValue(this.uiForm.controls['GenderDesc']);

        // tab - grdContact
        formdata['WorkEmail'] = this.getFieldValue(this.uiForm.controls['WorkEmail']);
        formdata['SMSMessageNumber'] = this.getFieldValue(this.uiForm.controls['SMSMessageNumber']);
        formdata['TelephoneNumber'] = this.getFieldValue(this.uiForm.controls['TelephoneNumber']);
        formdata['SecondaryContactNumber'] = this.getFieldValue(this.uiForm.controls['SecondaryContactNumber']);
        formdata['LanguageCode'] = this.getFieldValue(this.uiForm.controls['LanguageCode']);
        formdata['LanguageDescription'] = this.getFieldValue(this.uiForm.controls['LanguageDescription']);

        // tab - grdGeneral
        formdata['Grade'] = this.getFieldValue(this.uiForm.controls['Grade']);
        formdata['EmployeeUserCode'] = this.getFieldValue(this.uiForm.controls['UserCode']);
        formdata['UserName'] = this.getFieldValue(this.uiForm.controls['UserName']);
        formdata['DateOfBirth'] = this.getFieldValue(this.uiForm.controls['DateOfBirth']);
        formdata['DateJoined'] = this.getFieldValue(this.uiForm.controls['DateJoined']);
        formdata['PreviousService'] = this.getFieldValue(this.uiForm.controls['PreviousService']);
        formdata['LeaveEntitlement'] = this.getFieldValue(this.uiForm.controls['LeaveEntitlement']);
        formdata['ContractReceived'] = this.getFieldValue(this.uiForm.controls['ContractReceived'], true);
        formdata['CommissionValid'] = this.getFieldValue(this.uiForm.controls['CommissionValid'], true);
        formdata['PendingDeliveryValid'] = this.getFieldValue(this.uiForm.controls['PendingDeliveryValid'], true);
        formdata['FirstAider'] = this.getFieldValue(this.uiForm.controls['FirstAider'], true);
        formdata['FirstAidReviewDate'] = this.getFieldValue(this.uiForm.controls['FirstAidReviewDate'], false, true);
        formdata['EarliestStartTime'] = this.getHmsToSeconds(this.uiForm.controls['EarliestStartTime'].value);
        formdata['FixedBreakTime'] = this.getHmsToSeconds(this.uiForm.controls['FixedBreakTime'].value);
        formdata['RecordMileageInd'] = this.getFieldValue(this.uiForm.controls['RecordMileageInd'], true);
        formdata['TabletUserInd'] = this.getFieldValue(this.uiForm.controls['TabletUserInd'], true);
        formdata['GoogleCalendarEnabled'] = this.getFieldValue(this.uiForm.controls['GoogleCalendarEnabled'], true);
        formdata['ExternalID'] = this.getFieldValue(this.uiForm.controls['ExternalID']);
        formdata['TabletReloadFromDate'] = this.getFieldValue(this.uiForm.controls['TabletReloadFromDate'], false, true);
        formdata['riTimezoneCode'] = this.getFieldValue(this.uiForm.controls['riTimezoneCodeSelect']);
        formdata['LOSCode'] = this.getFieldValue(this.uiForm.controls['LOSCodeSelect']);

        // div - grdAddress

        formdata['EmployeeAddressLine1'] = this.getFieldValue(this.uiForm.controls['EmployeeAddressLine1']);
        formdata['EmployeeAddressLine2'] = this.getFieldValue(this.uiForm.controls['EmployeeAddressLine2']);
        formdata['EmployeeAddressLine3'] = this.getFieldValue(this.uiForm.controls['EmployeeAddressLine3']);
        formdata['EmployeeAddressLine4'] = this.getFieldValue(this.uiForm.controls['EmployeeAddressLine4']);
        formdata['EmployeeAddressLine5'] = this.getFieldValue(this.uiForm.controls['EmployeeAddressLine5']);
        formdata['EmployeePostcode'] = this.getFieldValue(this.uiForm.controls['EmployeePostcode']);
        formdata['StartWorkFromHomeInd'] = this.getFieldValue(this.uiForm.controls['StartWorkFromHomeInd'], true);
        formdata['HomeGPSCoordinateX'] = this.getFieldValue(this.uiForm.controls['HomeGPSCoordinateX']);
        formdata['HomeGPSCoordinateY'] = this.getFieldValue(this.uiForm.controls['HomeGPSCoordinateY']);
        formdata['RoutingGeonode'] = this.getFieldValue(this.uiForm.controls['RoutingGeonode']);
        formdata['RoutingScore'] = this.getFieldValue(this.uiForm.controls['RoutingScore']);
        formdata['HomeTelephone'] = this.getFieldValue(this.uiForm.controls['HomeTelephone']);
        formdata['MobileTelephone'] = this.getFieldValue(this.uiForm.controls['MobileTelephone']);
        formdata['HomeEmail'] = this.getFieldValue(this.uiForm.controls['HomeEmail']);
        formdata['RoutingSource'] = this.getFieldValue(this.uiForm.controls['SelRoutingSource']);


        //div 5  grdNoKAddress
        formdata['NoKRelationship'] = this.getFieldValue(this.uiForm.controls['NoKRelationship']);
        formdata['NoKName'] = this.getFieldValue(this.uiForm.controls['NoKName']);
        formdata['NoKAddressLine1'] = this.getFieldValue(this.uiForm.controls['NoKAddressLine1']);
        formdata['NoKAddressLine2'] = this.getFieldValue(this.uiForm.controls['NoKAddressLine2']);
        formdata['NoKAddressLine3'] = this.getFieldValue(this.uiForm.controls['NoKAddressLine3']);
        formdata['NoKAddressLine4'] = this.getFieldValue(this.uiForm.controls['NoKAddressLine4']);
        formdata['NoKAddressLine5'] = this.getFieldValue(this.uiForm.controls['NoKAddressLine5']);
        formdata['NoKPostcode'] = this.getFieldValue(this.uiForm.controls['NoKPostcode']);
        formdata['NoKHomeTelephone'] = this.getFieldValue(this.uiForm.controls['NoKHomeTelephone']);
        formdata['NoKOtherTelephone'] = this.getFieldValue(this.uiForm.controls['NoKOtherTelephone']);

        // div 6 grdVehicle
        formdata['ClassType'] = this.getFieldValue(this.uiForm.controls['ClassType']);
        formdata['VehicleRegistration'] = this.getFieldValue(this.uiForm.controls['VehicleRegistration']);
        formdata['PetrolCardNumber'] = this.getFieldValue(this.uiForm.controls['PetrolCardNumber']);
        formdata['DrivingLicenceNumber'] = this.getFieldValue(this.uiForm.controls['DrivingLicenceNumber']);
        formdata['DrivingLicenceExpiryDate'] = this.getFieldValue(this.uiForm.controls['DrivingLicenceExpiryDate'], false, true);

        //grdLeft
        formdata['DateLeft'] = this.getFieldValue(this.uiForm.controls['DateLeft'], false, false);
        formdata['LeavingReason'] = this.getFieldValue(this.uiForm.controls['LeavingReason']);
        // div - grdSDetails
        formdata['Occupation'] = this.getFieldValue(this.uiForm.controls['Occupation']);
        formdata['WindowStart01'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowStart01'].value);
        formdata['WindowEnd01'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowEnd01'].value);
        formdata['WindowDayInd01'] = this.getFieldValue(this.uiForm.controls['WindowDayInd01'], true);
        formdata['WindowStart02'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowStart02'].value);
        formdata['WindowEnd02'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowEnd02'].value);
        formdata['WindowDayInd02'] = this.getFieldValue(this.uiForm.controls['WindowDayInd02'], true);
        formdata['WindowStart03'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowStart03'].value);
        formdata['WindowEnd03'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowEnd03'].value);
        formdata['WindowDayInd03'] = this.getFieldValue(this.uiForm.controls['WindowDayInd03'], true);
        formdata['WindowStart04'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowStart04'].value);
        formdata['WindowEnd04'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowEnd04'].value);
        formdata['WindowDayInd04'] = this.getFieldValue(this.uiForm.controls['WindowDayInd04'], true);
        formdata['WindowStart05'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowStart05'].value);
        formdata['WindowEnd05'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowEnd05'].value);
        formdata['WindowDayInd05'] = this.getFieldValue(this.uiForm.controls['WindowDayInd05'], true);
        formdata['WindowStart06'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowStart06'].value);
        formdata['WindowEnd06'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowEnd06'].value);
        formdata['WindowDayInd06'] = this.getFieldValue(this.uiForm.controls['WindowDayInd06'], true);
        formdata['WindowStart07'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowStart07'].value);
        formdata['WindowEnd07'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['WindowEnd07'].value);
        formdata['WindowDayInd07'] = this.getFieldValue(this.uiForm.controls['WindowDayInd07'], true);
        formdata['StdHoursPerDay'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['StdHoursPerDay'].value);
        formdata['PersonalDrivingTime'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['PersonalDrivingTime'].value);
        formdata['ManpowerPlanning'] = this.getFieldValue(this.uiForm.controls['ManpowerPlanning'], true);
        formdata['MaxOTPerDay'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['MaxOTPerDay'].value);
        formdata['AvgDrivingWorkDay'] = this.getFieldValue(this.uiForm.controls['AvgDrivingWorkDay']);
        formdata['MaxHoursPerWeek'] = this.getFieldValue(this.uiForm.controls['MaxHoursPerWeek'].value);
        formdata['AverageSickness'] = this.globalize.parseDecimalToFixedFormat(this.getFieldValue(this.uiForm.controls['AverageSickness']), 2);
        formdata['StandardBreakTime'] = this.globalize.parseTimeToFixedFormat(this.uiForm.controls['StandardBreakTime'].value);
        formdata['PDAWorkLoadSel'] = this.getFieldValue(this.uiForm.controls['PDAWorkLoadSel']);
        formdata['EmployeeStartLocation7'] = this.getFieldValue(this.uiForm.controls['EmployeeStartLocation7Sel']);
        formdata['EmployeeEndLocation7'] = this.getFieldValue(this.uiForm.controls['EmployeeEndLocation7Sel']);
        formdata['EmployeeStartLocation1'] = this.getFieldValue(this.uiForm.controls['EmployeeStartLocation1Sel']);
        formdata['EmployeeEndLocation1'] = this.getFieldValue(this.uiForm.controls['EmployeeEndLocation1Sel']);
        formdata['EmployeeStartLocation2'] = this.getFieldValue(this.uiForm.controls['EmployeeStartLocation2Sel']);
        formdata['EmployeeEndLocation2'] = this.getFieldValue(this.uiForm.controls['EmployeeEndLocation2Sel']);
        formdata['EmployeeStartLocation3'] = this.getFieldValue(this.uiForm.controls['EmployeeStartLocation3Sel']);
        formdata['EmployeeEndLocation3'] = this.getFieldValue(this.uiForm.controls['EmployeeEndLocation3Sel']);
        formdata['EmployeeStartLocation4'] = this.getFieldValue(this.uiForm.controls['EmployeeStartLocation4Sel']);
        formdata['EmployeeEndLocation4'] = this.getFieldValue(this.uiForm.controls['EmployeeEndLocation4Sel']);
        formdata['EmployeeStartLocation5'] = this.getFieldValue(this.uiForm.controls['EmployeeStartLocation5Sel']);
        formdata['EmployeeEndLocation5'] = this.getFieldValue(this.uiForm.controls['EmployeeEndLocation5Sel']);
        formdata['EmployeeStartLocation6'] = this.getFieldValue(this.uiForm.controls['EmployeeStartLocation6Sel']);
        formdata['EmployeeEndLocation6'] = this.getFieldValue(this.uiForm.controls['EmployeeEndLocation6Sel']);

        return formdata;
    }


    public promptConfirm(event: any): void {
        if (!this.riMaintenanceCancelEvent) {
            if (this.pageParams.updateMode && this.actionMode === 2) {
                if (!this.riMaintenanceCancelEvent) {
                    this.updateEmployeeData();
                }
            } else if (this.pageParams.addMode) {
                if (!this.riMaintenanceCancelEvent) {
                    this.addEmployeeData();
                }
            }
            else if (this.pageParams.updateMode && this.actionMode === 3) { // For delete operation
                if (!this.riMaintenanceCancelEvent) {
                    this.deleteEmployeeData();
                }
            }
        }
    }

    public promptCancel(event: any): void {
        //TODO:
    }

    public confirmOKCancel(event: any): void {

        switch (this.promptMode) {
            case 'btnDefault_onclick':
                this.promptMode = '';
                this.btnDefaultConfirm();
                break;
            default:
                break;
        }

    }


    public validateForm(): boolean {
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.uiForm.controls[key]) {
                        this.uiForm.controls[key].clearValidators();
                    }
                }
            }

        }

        for (let i in this.uiForm.controls) {
            if (this.uiForm.controls[i].enabled) {
                this.uiForm.controls[i].markAsTouched();
            } else {
                this.uiForm.controls[i].clearValidators();
            }
        }
        this.uiForm.updateValueAndValidity();

        let formValid = null;
        if (!this.uiForm.enabled) {
            formValid = true;
        } else {
            formValid = this.uiForm.valid;
        }

        return formValid;

    }


    public updateEmployeeData(): any {
        let formdata: Object = {};
        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        this.queryParams.set(this.serviceConstants.Action, '2');
        formdata = this.getFormDataForEmployeeCode();
        formdata['Employee'] = this.storeData ? this.storeData.Employee : '';
        formdata['EmployeeROWID'] = this.storeData ? this.storeData.Employee : '';
        formdata['SCManpowerPlanning'] = this.pageParams.vSCManpowerPlanning || false;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams, formdata).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                }
                else if (e['errorMessage'] || e['fullError']) {
                    this.errorModal.show(e, true);
                }
                else {
                    this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                    this.formPristine();
                    this.clearErrorTabs();
                    this.riMaintenance_AfterSave();
                    this.onEmployeeSearchDataReceived(this.storeData, false);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            }
        );

    }

    public addEmployeeData(): any {
        let formdata: Object = {};
        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        this.queryParams.set(this.serviceConstants.Action, '1');
        formdata = this.getFormDataForEmployeeCode();
        formdata['SCManpowerPlanning'] = this.pageParams.vSCManpowerPlanning || false;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams, formdata).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                }
                else if (e['errorMessage'] || e['fullError']) {
                    this.errorModal.show(e, true);
                }
                else {
                    if (e.EmployeeCode && (e.EmployeeCode !== '')) {
                        this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                        this.formPristine();
                        this.clearErrorTabs();
                        this.ellipsisConfig.employeeSearch.autoOpen = false;
                        this.riMaintenance_AfterSave();
                        this.riMaintenance_AfterSaveAdd();
                        this.uiForm.controls['EmployeeCode'].setValue(e.EmployeeCode);
                        let data = { EmployeeCode: this.uiForm.controls['EmployeeCode'].value };
                        this.onEmployeeSearchDataReceived(data, false);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            }
        );
    }

    public deleteEmployeeData(): any {
        let formdata: Object = {};
        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        this.queryParams.set(this.serviceConstants.Action, '3');
        formdata['EmployeeCode'] = this.uiForm.controls['EmployeeCode'].value;
        formdata['Employee'] = this.storeData ? this.storeData.Employee : '';
        formdata['EmployeeROWID'] = this.storeData ? this.storeData.Employee : '';
        formdata['SCManpowerPlanning'] = this.pageParams.vSCManpowerPlanning || false;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams, formdata).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                }
                else if (e['errorMessage'] || e['fullError']) {
                    this.errorModal.show(e, true);
                }
                else {
                    this.messageModal.show({ msg: MessageConstant.Message.RecordDeletedSuccessfully, title: 'Success Message' }, false);
                    this.riMaintenance_AfterDelete();
                    this.pageParams.deleteMode = false;
                    this.pageParams.addMode = false;
                    this.pageParams.searchMode = true;
                    this.pageParams.updateMode = false;

                    for (let key in this.uiForm.controls) {
                        if (this.uiForm.controls[key]) {
                            this.uiForm.controls[key].reset();
                        }
                    }

                    this.datepicker.DateOfBirth.value = null;
                    this.datepicker.DateJoined.value = null;
                    this.datepicker.FirstAidReviewDate.value = null;
                    this.datepicker.TabletReloadFromDate.value = null;
                    this.datepicker.DrivingLicenceExpiryDate.value = null;
                    this.datepicker.DateLeft.value = null;
                    this.uiForm.controls['TabletReloadFromDate'].setValue('');
                    this.dropdownConfig.maritalSearch.selected = { id: '', text: '' };
                    this.dropdownConfig.genderSearch.selected = { id: '', text: '' };
                    this.setTranslatedTextForButtons();
                    this.pageParams.searchMode = true;
                    this.processForm();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            }
        );
    }



    public onSubmit(formdata: any, valid: any, event: any): void {
        this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
        event.preventDefault();
        this.riMaintenanceCancelEvent = false;
        for (let j in this.fieldVisibility) {
            if (j) {
                let key = j;
                if (!this.fieldVisibility[j]) {
                    if (this.uiForm.controls[key]) {
                        this.uiForm.controls[key].clearValidators();
                    }
                }
            }
        }
        let validFlag = true;
        for (let i in this.uiForm.controls) {
            if (this.uiForm.controls[i]) {
                this.uiForm.controls[i].markAsTouched();
                switch (i) {
                    case 'DateOfBirth':
                    case 'DateJoined':
                    case 'FirstAidReviewDate':
                    case 'DrivingLicenceExpiryDate':
                    case 'DrivingLicenceExpiryDate':
                    case 'DateLeft':
                    case 'TabletReloadFromDate':

                        if (this.datepicker[i] && (this.datepicker[i].isRequired === true)) {
                            let obj = document.querySelector('#' + i + ' input[type=text]');
                            if (obj) {
                                if (!obj['value']) {
                                    obj.setAttribute('class', 'form-control ng-dirty ng-invalid ng-touched');
                                    this.fieldRequired[i] = true;
                                    validFlag = false;
                                }
                            }
                        }

                        break;
                    default:
                        break;
                }
            }
        }

        if (this.uiForm.invalid) {
            setTimeout(() => {
                this.selectErrorTab();
            }, 100);
        }

        setTimeout(() => {
            this.highlightErrorTab();
        }, 100);

        this.actionMode = this.pageParams.addModem ? 1 : 2;

        if (this.uiForm.valid && validFlag) {
            this.riMaintenanceCancelEvent = false;
            this.riMaintenance_BeforeSave().subscribe((e) => {
                if (e === true) {
                    this.promptConfig.forSave.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                    this.promptModal.show();
                }
            });
        }
    }

    public onCancel(): void {
        event.preventDefault();
        this.riMaintenanceCancelEvent = false;
        this.ellipsisConfig.employeeSearch.autoOpen = false;
        this.ellipsisConfig.employeeSearch.disabled = false;
        this.saveBtn = false;
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        if (this.pageParams.addMode) {
            for (let key in this.uiForm.controls) {
                if (this.uiForm.controls[key]) {
                    this.uiForm.controls[key].reset();
                }
            }
            this.employeeSearchEllipsis.openModal();//Added
            this.datepicker.DateOfBirth.value = '';
            this.datepicker.DateJoined.value = '';
            this.datepicker.FirstAidReviewDate.value = '';
            this.datepicker.TabletReloadFromDate.value = '';
            this.datepicker.DrivingLicenceExpiryDate.value = '';
            this.datepicker.DateLeft.value = '';
            this.pageParams.addMode = false;
            this.pageParams.searchMode = true;
            this.processForm();
            setTimeout(() => {
                this.clearErrorTabs();
            }, 200);

        }
        else if (this.pageParams.updateMode) {
            this.datepicker.DateOfBirth.value = null;
            this.datepicker.DateJoined.value = null;
            this.datepicker.FirstAidReviewDate.value = '';
            this.datepicker.TabletReloadFromDate.value = '';
            this.datepicker.DrivingLicenceExpiryDate.value = '';
            this.datepicker.DateLeft.value = '';
            this.saveBtn = true;
            this.pageParams.searchMode = false;
            this.pageParams.updateMode = true;
            this.pageParams.addMode = false;
            if (this.pageParams.updateMode && this.storeData) {
                this.setFormData(this.storeData);
                if (this.storeData) {
                    this.loadVirtualData(this.storeVirtualData);
                }
            }

            if (this.uiForm.controls['TabletUserInd'].value === true) {
                this.showHideTabletReload(true);
            }

        }
        this.uiForm.controls['menu'].setValue('');
        this.setTranslatedTextForButtons();
        this.uiForm.updateValueAndValidity();
    }

    public resetUIForm(): any {
        this.uiForm.reset();
        this.datepicker.DateOfBirth.value = '';
        this.datepicker.DateJoined.value = '';
        this.datepicker.FirstAidReviewDate.value = '';
        this.datepicker.TabletReloadFromDate.value = '';
        this.datepicker.DrivingLicenceExpiryDate.value = '';
        this.datepicker.DateLeft.value = '';
        this.setTranslatedTextForButtons();
    }


    public setTranslatedTextForButtons(): void {

        this.uiForm.controls['cmdReload'].setValue(this.translatedMessageList['cmdReload'] || 'Reload To Tablet');
        this.uiForm.controls['cmdGetAddress1'].setValue(this.translatedMessageList['cmdGetAddress1'] || 'Get Address');
        this.uiForm.controls['cmdGeocode'].setValue(this.translatedMessageList['cmdGeocode'] || 'Geocode');
        this.uiForm.controls['cmdCopyAddress'].setValue(this.translatedMessageList['cmdCopyAddress'] || 'Same As Employee');
        this.uiForm.controls['cmdGetAddress2'].setValue(this.translatedMessageList['cmdGetAddress2'] || 'Get Address');
        this.uiForm.controls['btnDefault'].setValue(this.translatedMessageList['btnDefault'] || 'Default from Branch');
    }

    public getFormattedDate(dateValue: any): any {
        let returnDate: any = '';
        if (dateValue) {
            dateValue = this.globalize.parseDateToFixedFormat(dateValue);
            returnDate = this.globalize.parseDateStringToDate(dateValue);
        } else {
            returnDate = '';
        }
        return returnDate;
    }

    public onBlur(event: any): void {
        if (event && event.target) {
            let elementValue = event.target.value;

            if (elementValue && this.capitalizeFirstLetterField && event.target.id && this.capitalizeFirstLetterField.hasOwnProperty(event.target.id) && !this.pageParams.vSCCapitalFirstLtr) {
                event.target.value = elementValue['capitalizeFirstLetter']();
            }

            if (elementValue && this.capitalizeField && event.target.id && this.capitalizeField.hasOwnProperty(event.target.id)) {
                event.target.value = elementValue.toUpperCase();
            }

            if (elementValue) {
                switch (event.target.id) {
                    case 'UserCode':
                        this.validateVirtualTableData(event.target.id);
                        break;
                }
            }
        }
    }

    public onChange(event: any): any {
        if (event && event.target) {
            let elementValue = event.target.value;
            if (event.target.id === 'OccupationCode') {
                this.riExchange_CBORequest(true, false);
            }
            else if (event.target.id === 'VehicleRegistration') {
                this.riExchange_CBORequest(false, true);
            }
        }
    }


    public focusToFirstTab(tabId: string = 'grdDetails'): any {
        let element = document.querySelector('.nav-tabs li#' + tabId + ' a');
        if (element) {
            let click = new CustomEvent('click', { bubbles: true });
            this.renderer.invokeElementMethod(element, 'dispatchEvent', [click]);
        }
    }

    public selectErrorTab(): void {
        let i = 0;
        let elem = document.querySelector('.nav-tabs').children;
        for (let tab in this.tabList) {
            if (tab) {
                let element = document.querySelectorAll('div#' + this.tabList[tab]['id'] + ' input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched');

                if (element && element.length > 0) {
                    this.focusToFirstTab(this.tabList[tab]['id']);
                    break;
                }
                else {
                    if (elem[i]) {
                        if (this.utils.hasClass(elem[i], 'error')) {
                            this.utils.removeClass(elem[i], 'error');
                        }
                    }
                }
                i++;
            }
        }
    }

    public highlightErrorTab(): void {
        let i = 0;
        let elem = document.querySelector('.nav-tabs').children;
        for (let tab in this.tabList) {
            if (tab) {
                let element = document.querySelectorAll('div#' + this.tabList[tab]['id'] + ' input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched');
                if (element && element.length > 0) {
                    if (elem[i]) {
                        if (!this.utils.hasClass(elem[i], 'error')) {
                            this.utils.addClass(elem[i], 'error');
                        }
                    }
                }
                else {
                    if (elem[i]) {
                        if (this.utils.hasClass(elem[i], 'error')) {
                            this.utils.removeClass(elem[i], 'error');
                        }
                    }
                }
                i++;
            }

        }
    }


    public onSaveFocus(e: any): void {
        let nextTab: number = 0;
        let code = (e.keyCode ? e.keyCode : e.which);
        let elemList = document.querySelectorAll('.screen-body .nav-tabs li a');
        let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.screen-body .nav-tabs li a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            let click = new CustomEvent('click', {});
            nextTab = currentSelectedIndex + 1;
            if (elemList[nextTab])
                elemList[nextTab]['click']();
        }
    }

    public setFocusToTabElement(): any {
        setTimeout(() => {
            let elemList = document.querySelectorAll('.screen-body .nav-tabs li a');
            let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.screen-body .nav-tabs li a.active'));
            let nextTab = currentSelectedIndex + 1;
            let tabItemList = document.querySelectorAll('.screen-body .tab-content .tab-pane:nth-child(' + nextTab + ') .ui-select-toggle, .screen-body .tab-content .tab-pane:nth-child(' + nextTab + ') input:not([disabled]), .screen-body .tab-content .tab-pane:nth-child(' + nextTab + ') select:not([disabled])');

            for (let l = 0; l < tabItemList.length; l++) {
                let el = tabItemList[l];
                if (el) {
                    if ((el.getAttribute('type') === undefined) || (el.getAttribute('type') === null) || (el.getAttribute('type') && el.getAttribute('type').toLowerCase() !== 'hidden' && el.getAttribute('type').toLowerCase() !== 'button')) {
                        setTimeout(() => {
                            el['focus']();
                        }, 90);
                        break;
                    }
                }
            }
        }, 100);
    }

    public clearErrorTabs(): void {
        let elem = document.querySelector('.nav-tabs').children;
        for (let i = 0; i < elem.length; i++) {
            if (this.utils.hasClass(elem[i], 'error')) {
                this.utils.removeClass(elem[i], 'error');
            }
        }
    }

    public TabFocus(tabIndex: number): void {
        this.currentTab = tabIndex;
        //Bug - unable to explicitly remove 'active' class as those are binded. hence below lines added
        let elem = document.querySelector('.nav-tabs').children;
        for (let i = 0; i < elem.length; i++) {
            if (this.utils.hasClass(elem[i], 'error')) {
                this.utils.removeClass(elem[i], 'active');
                this.utils.removeClass(document.querySelector('.tab-content').children[i], 'active');
            }
        }

        let i = 0;
        for (let tab in this.riTab.tab) {
            if (tab !== '') {
                i++;
                this.riTab.tab[tab].active = (i === tabIndex) ? true : false;
            }
        }

        //Failsafe
        this.utils.addClass(elem[tabIndex - 1], 'active');
        this.utils.addClass(document.querySelector('.tab-content').children[tabIndex - 1], 'active');

        setTimeout(() => { this.utils.makeTabsRed(); }, 200);
    }

    public formPristine(): void {
        if (this.uiForm)
            this.uiForm.markAsPristine();
    }
    public checkFormDirty(): boolean {
        if (this.uiForm && this.uiForm.dirty)
            return true;

        return false;
    }

    public employeeCode_onChange(): void {

        if (this.uiForm.controls['EmployeeCode'].value) {
            this.uiForm.controls['EmployeeCode'].setValue(this.uiForm.controls['EmployeeCode'].value.toUpperCase());
        }

        if (this.pageParams.searchMode && this.uiForm.controls['EmployeeCode'].value) {
            let data = { EmployeeCode: this.uiForm.controls['EmployeeCode'].value };
            this.onEmployeeSearchDataReceived(data, false);
        }
    }


    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setSaveEnabledFlag(this.checkFormDirty());
        return this.routeAwayComponent.canDeactivate();
    }
    public routeAwayUpdateSaveFlag(): void {
        this.routeAwayGlobals.setDirtyFlag(true);
    }

    public LeaveEntitlementBlur(event: any): void {
        let reg = new RegExp('^[0-9]+$');
        this.validateLeaveEntitlement = false;
        if (this.uiForm.controls['LeaveEntitlement'].value) {
            if (reg.test(event.target.value)) {
                this.validateLeaveEntitlement = false;
            } else {
                this.validateLeaveEntitlement = true;
            }
        }
    }

    public previousServiceBlur(event: any): void {
        this.validatePreviousService = false;
        let reg = new RegExp('^[0-9]+$');
        if (this.uiForm.controls['PreviousService'].value) {
            if (reg.test(event.target.value)) {
                this.validatePreviousService = false;
            } else {
                this.validatePreviousService = true;
            }
        }
    }

    public onPostcodeSearchDataReceived(data: any, route: any): void {
        let obj = this.geActiveTabInfo();
        let tabId = obj.id;
        switch (tabId) {
            case 'grdAddress':
                //TODO: as per the current logic, we are not receiving selected value into parent page
                break;
            case 'grdNoKAddress':
                //TODO: as per the current logic, we are not receiving selected value into parent page
                break;
        }
    }

    public onRiPostcodeSearchDataReceived(data: any, route: any): void {
        //TODO:
    }


    public geActiveTabInfo(): any {
        let tabInfo = {};
        let currentSelectedIndex = 0;
        let id = '';
        let liList = document.querySelectorAll('.screen-body .nav-tabs li');
        let elemList = document.querySelectorAll('.screen-body .nav-tabs li a');
        if (elemList) {
            currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.screen-body .nav-tabs li a.active'));
            let obj = liList[currentSelectedIndex];
            id = obj['id'];
        }
        return { 'index': currentSelectedIndex, 'id': id };
    }

    public tabletReloadFromDate_onChange(value: any): any {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TabletReloadFromDate', value.value);
        }
    }

}








