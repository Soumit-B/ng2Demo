var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Validators } from '@angular/forms';
import { SpeedScript } from './../../../shared/services/speedscript';
import { RiTab } from './../../../shared/services/riMaintenancehelper';
import { MaritalStatusSearchComponent } from './../../internal/search/iCABSSMaritalStatusSearch.component';
import { OccupationSearchComponent } from './../../internal/search/iCABSSOccupationSearch.component';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { Component, ViewChild, Injector, Renderer } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var EmployeeMaintenanceComponent = (function (_super) {
    __extends(EmployeeMaintenanceComponent, _super);
    function EmployeeMaintenanceComponent(injector, SpeedScript, renderer) {
        _super.call(this, injector);
        this.SpeedScript = SpeedScript;
        this.renderer = renderer;
        this.pageId = '';
        this.employeeId = '';
        this.autoOpen = true;
        this.promptTitle = '';
        this.promptContent = '';
        this.promptMode = '';
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.isRequesting = false;
        this.riMaintenanceCancelEvent = false;
        this.muleConfig = {
            method: 'people/admin',
            module: 'employee',
            operation: 'Business/iCABSBEmployeeMaintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.ellipsisConfig = {
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
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            }
        };
        this.dropdownConfig = {
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
        this.datepicker = {
            DateOfBirth: {
                value: '',
                clearDate: true,
                isDisabled: false,
                isRequired: true
            },
            DateJoined: {
                value: '',
                clearDate: true,
                isDisabled: false,
                isRequired: false
            },
            FirstAidReviewDate: {
                value: '',
                clearDate: true,
                isDisabled: false,
                isRequired: false
            },
            DrivingLicenceExpiryDate: {
                value: '',
                clearDate: true,
                isDisabled: false,
                isRequired: false
            },
            DateLeft: {
                value: '',
                clearDate: true,
                isDisabled: false,
                isRequired: false
            },
            TabletReloadFromDate: {
                value: '',
                clearDate: true,
                isDisabled: false,
                isRequired: false
            }
        };
        this.translatedMessageList = {
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
            'cmdGeocode': 'GetAddress',
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
        this.virtualTableField = {};
        this.storeData = {};
        this.showAddNew = true;
        this.actionMode = 0;
        this.controls = [
            { name: 'EmployeeCode', readonly: false, disabled: false, required: true },
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
            { name: 'WorkEmail', readonly: false, disabled: false, required: false },
            { name: 'SMSMessageNumber', readonly: false, disabled: false, required: false },
            { name: 'TelephoneNumber', readonly: false, disabled: false, required: false },
            { name: 'SecondaryContactNumber', readonly: false, disabled: false, required: false },
            { name: 'LanguageCode', readonly: false, disabled: false, required: false },
            { name: 'LanguageDescription', readonly: false, disabled: true, required: false },
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
            { name: 'ClassType', readonly: false, disabled: false, required: false },
            { name: 'VehicleRegistration', readonly: false, disabled: false, required: false },
            { name: 'PetrolCardNumber', readonly: false, disabled: false, required: false },
            { name: 'DrivingLicenceNumber', readonly: false, disabled: false, required: false },
            { name: 'DrivingLicenceExpiryDate', readonly: false, disabled: false, required: false },
            { name: 'DateLeft', readonly: false, disabled: false, required: false },
            { name: 'LeavingReason', readonly: false, disabled: false, required: false },
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
        this.deleteMode = false;
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = true;
        this.normalMode = false;
        this.saveBtn = false;
        this.showControlBtn = true;
        this.ttriTimezone = [];
        this.ttLineOfService = [];
        this.fieldVisibility = {
            'trTabletReload': false,
            'OccupationCode': false,
            'cmdGetAddress1': true,
            'cmdGetAddress2': true,
            'cmdGeocode': false,
            'RoutingGeonode': false,
            'RoutingScore': false,
            'btnDefault': true,
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
            'StandardBreakTime': false
        };
        this.fieldRequired = {
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
            'GenderDesc': false
        };
        this.menuOptionList = [];
        this.tabList = {};
        this.promptConfig = {
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
        this.pageId = PageIdentifier.ICABSBEMPLOYEEMAINTENANCE;
        this.pageTitle = '';
    }
    EmployeeMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.populateUIFromFormData();
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.fetchTranslationContent();
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.loadSpeedScriptData();
        this.zone.run(function () {
            _this.tabDraw();
        });
    };
    EmployeeMaintenanceComponent.prototype.ngOnDestroy = function () {
    };
    EmployeeMaintenanceComponent.prototype.ngAfterViewInit = function () {
        if ((this.autoOpen === true) && !this.parentMode) {
            this.ellipsisConfig.employeeSearch.autoOpen = true;
            this.autoOpen = false;
        }
    };
    EmployeeMaintenanceComponent.prototype.tabDraw = function () {
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
    };
    EmployeeMaintenanceComponent.prototype.modalHiddenEmployeeSearch = function () {
    };
    EmployeeMaintenanceComponent.prototype.modalHiddenUserCode = function () {
    };
    EmployeeMaintenanceComponent.prototype.onAddMode = function () {
        this.storeData = {};
        this.focusToFirstTab();
        this.riMaintenanceCancelEvent = false;
        this.parentMode = '';
        this.showControlBtn = true;
        this.saveBtn = true;
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.actionMode = 1;
        this.showControlBtn = true;
        this.updateMode = false;
        this.addMode = true;
        this.searchMode = false;
        this.uiForm.reset();
        this.autoOpen = false;
        this.loadUIFields();
        this.processForm();
        this.setTranslatedTextForButtons();
        this.uiForm.controls['menu'].disable();
        this.formControlEmployeeCode.nativeElement.focus();
        this.ellipsisConfig.employeeSearch.disabled = true;
        this.ellipsisConfig.riMUserInformationSearch.disabled = true;
        this.riMaintenance_BeforeMode();
        this.riMaintenance_BeforeAddMode();
    };
    EmployeeMaintenanceComponent.prototype.onEmployeeSearchDataReceived = function (data, route) {
        var _this = this;
        this.storeData = {};
        this.selectedData = data;
        this.ellipsisConfig.employeeSearch.disabled = false;
        this.uiForm.controls['EmployeeCode'].setValue(data.EmployeeCode);
        var queryParams = {
            'EmployeeCode': data.EmployeeCode,
            'SCManpowerPlanning': this.pageParams.vSCManpowerPlanning || false
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('', queryParams).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (data['errorMessage']) {
                    _this.errorService.emitError({ errorMessage: data['errorMessage'] });
                }
                else {
                    if (e) {
                        _this.storeData = e;
                        _this.onUpdateMode(e);
                    }
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    EmployeeMaintenanceComponent.prototype.onUpdateMode = function (data) {
        this.actionMode = 2;
        this.updateMode = true;
        this.addMode = false;
        this.searchMode = false;
        this.showControlBtn = true;
        this.saveBtn = true;
        this.storeData = data;
        this.loadUIFields();
        this.processForm();
        this.setFormData(data);
        this.loadVirtualTableData();
        this.riMaintenance_AfterFetch();
        this.riMaintenance_BeforeMode();
        this.riExchange_CBORequest();
        this.riMaintenance_BeforeUpdateMode();
        this.uiForm.updateValueAndValidity();
        this.focusToFirstTab();
    };
    EmployeeMaintenanceComponent.prototype.onDelete = function () {
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
    };
    EmployeeMaintenanceComponent.prototype.onMaritalSearch = function (data) {
        this.uiForm.controls['MaritalStatusCode'].setValue(data.MaritalStatusCode || '');
        if (data.Object) {
            this.uiForm.controls['MaritalStatusDesc'].setValue(data.Object.MaritalStatusDesc || '');
        }
    };
    EmployeeMaintenanceComponent.prototype.onGenderCodeSearch = function (data) {
        this.uiForm.controls['GenderCode'].setValue(data.GenderCode || '');
        if (data.Object) {
            this.uiForm.controls['GenderDesc'].setValue(data.Object.GenderDesc || '');
        }
    };
    EmployeeMaintenanceComponent.prototype.onEllipsisSearchDataReceived = function (data, route, nodeName) {
        switch (nodeName) {
            case 'OccupationCode':
                this.uiForm.controls['OccupationCode'].setValue(data.OccupationCode);
                this.uiForm.controls['OccupationDesc'].setValue(data.OccupationDesc || '');
                this.uiForm.controls['Occupation'].setValue(this.uiForm.controls['OccupationDesc'].value);
                break;
            case 'SupervisorEmployeeCode':
                this.uiForm.controls['SupervisorEmployeeCode'].setValue(data.SupervisorEmployeeCode);
                this.uiForm.controls['SupervisorSurname'].setValue(data.SupervisorSurname || '');
                break;
            default:
                break;
        }
    };
    EmployeeMaintenanceComponent.prototype.onBranchSearchReceived = function (data) {
        this.uiForm.controls['BranchNumber'].setValue(data.BranchNumber || '');
        this.uiForm.controls['BranchName'].setValue(data.BranchName || '');
    };
    EmployeeMaintenanceComponent.prototype.onDateSelectedValue = function (dateObj, id) {
        if (dateObj) {
            if (id && this.uiForm.controls.hasOwnProperty(id)) {
                this.riExchange.riInputElement.SetValue(this.uiForm, id, dateObj.value ? dateObj.value : '');
            }
        }
    };
    EmployeeMaintenanceComponent.prototype.loadSpeedScriptData = function () {
        this.getSysCharDtetails();
        this.loadTempTableData();
    };
    EmployeeMaintenanceComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
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
        var sysCharIP = {
            module: this.muleConfig.module,
            operation: this.muleConfig.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.pageParams.vCountryCode,
            SysCharList: sysCharList.toString()
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.SpeedScript.sysChar(sysCharIP).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            var records = data.records;
            _this.pageParams.vSCEnableHopewiserPAF = records[0].Required ? records[0].Required : false;
            _this.pageParams.vSCEnableDatabasePAF = records[1].Required ? records[1].Required : false;
            _this.pageParams.vSCAddressLine3Required = records[2].Required ? records[2].Required : false;
            _this.pageParams.vSCAddressLine3Logical = records[2].Logical ? records[2].Required : false;
            _this.pageParams.vSCAddressLine4Required = records[3].Required ? records[3].Required : false;
            _this.pageParams.vSCAddressLine5Required = records[4].Required ? records[4].Required : false;
            _this.pageParams.vSCAddressLine5Logical = records[4].Logical ? records[4].Required : false;
            _this.pageParams.vSCPostCodeRequired = records[5].Required ? records[5].Required : false;
            _this.pageParams.vSCPostCodeMustExistInPAF = records[6].Required ? records[6].Required : false;
            _this.pageParams.vSCRunPAFSearchOn1stAddressLine = records[7].Required ? records[7].Required : false;
            _this.pageParams.vSCCapitalFirstLtr = records[8].Required ? records[8].Required : false;
            _this.pageParams.vEnableRouteOptimisation = records[9].Required ? records[9].Required : false;
            _this.pageParams.vSCEnableSOPProspects = records[10].Required ? records[10].Required : false;
            _this.pageParams.vSCManpowerPlanning = records[11].Required ? records[11].Required : false;
            _this.window_onload();
            _this.processForm();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    EmployeeMaintenanceComponent.prototype.loadTempTableData = function () {
        var _this = this;
        this.ttriTimezone = [];
        this.ttLineOfService = [];
        var gLanguageCode = this.riExchange.LanguageCode();
        var data = [
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
        this.LookUp.lookUpRecord(data, 500).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e && e.length > 0) {
                if (e && e[0].length > 0) {
                    var riTimezone = e[0];
                    var riTimezoneLang_1 = [];
                    if (e.length > 1 && e[1].length > 0) {
                        riTimezoneLang_1 = e[1];
                    }
                    riTimezone.forEach(function (item) {
                        if (item['ServerToUTCInd'] === false) {
                            var filterData = riTimezoneLang_1.find(function (langObj) { return (langObj.riTimezoneCode === item.riTimezoneCode); });
                            _this.ttriTimezone.push({
                                'riTimezoneCode': item.riTimezoneCode,
                                'riTimezoneDesc': (filterData) ? filterData.riTimezoneDesc : item.riTimezoneSystemDesc
                            });
                        }
                    });
                }
                if (e && e[2].length > 0) {
                    var lineOfService = e[2];
                    lineOfService.forEach(function (item) {
                        _this.ttLineOfService.push({
                            'LOSCode': item.LOSCode,
                            'LOSName': item.LOSName
                        });
                    });
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    EmployeeMaintenanceComponent.prototype.loadVirtualTableData = function () {
        var _this = this;
        var gLanguageCode = this.riExchange.LanguageCode();
        var data = [
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
                'table': 'SupEmployee',
                'query': { 'EmployeeCode': this.uiForm.controls['EmployeeCode'].value, 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['SupervisorSurname']
            }
        ];
        this.virtualTableField = [];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(data, 500).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e && e.length > 0) {
                _this.virtualTableField['MaritalStatusDesc'] = e[0] ? ((e[0].length >= 1) ? e[0][0].MaritalStatusDesc : '') : '';
                _this.uiForm.controls['MaritalStatusDesc'].setValue(_this.virtualTableField['MaritalStatusDesc']);
                _this.virtualTableField['GenderDesc'] = e[1] && (e[1].length >= 1) ? (e[1][0].GenderDesc || '') : '';
                _this.uiForm.controls['GenderDesc'].setValue(_this.virtualTableField['GenderDesc']);
                _this.virtualTableField['OccupationDesc'] = (e[2] && (e[2].length >= 1)) ? (e[2][0].OccupationDesc || '') : '';
                _this.uiForm.controls['OccupationDesc'].setValue(_this.virtualTableField['OccupationDesc']);
                _this.virtualTableField['BranchName'] = (e[3] && (e[3].length >= 1)) ? (e[3][0].BranchName || '') : '';
                _this.uiForm.controls['BranchName'].setValue(_this.virtualTableField['BranchName']);
                _this.zone.run(function () {
                    _this.dropdownConfig.branchSearch.selected = {
                        id: _this.uiForm.controls['BranchNumber'].value || '',
                        text: _this.uiForm.controls['BranchNumber'].value + ' - ' + _this.uiForm.controls['BranchName'].value || ''
                    };
                });
                _this.zone.run(function () {
                    _this.dropdownConfig.maritalSearch.selected = {
                        id: _this.uiForm.controls['MaritalStatusCode'].value || '',
                        text: _this.uiForm.controls['MaritalStatusCode'].value ? (_this.uiForm.controls['MaritalStatusCode'].value + ' - ' + _this.uiForm.controls['MaritalStatusDesc'].value) : ''
                    };
                });
                _this.zone.run(function () {
                    _this.dropdownConfig.genderSearch.selected = {
                        id: _this.uiForm.controls['GenderCode'].value || '',
                        text: (_this.uiForm.controls['GenderCode'].value) ? (_this.uiForm.controls['GenderCode'].value + ' - ' + _this.uiForm.controls['GenderDesc'].value || '') : ''
                    };
                });
                _this.virtualTableField['UserName'] = (e[4] && (e[4].length >= 1)) ? (e[4][0].UserName || '') : '';
                _this.uiForm.controls['UserName'].setValue(_this.virtualTableField['UserName']);
                if (_this.uiForm.controls['LanguageCode'].value) {
                    _this.virtualTableField['LanguageDescription'] = (e[5] && (e[5].length >= 1)) ? (e[5][0].LanguageDescription || '') : '';
                    _this.uiForm.controls['LanguageDescription'].setValue(_this.virtualTableField['LanguageDescription']);
                }
                _this.virtualTableField['SupervisorSurname'] = (e[6] && (e[6].length >= 1)) ? e[6][0].SupervisorSurname || '' : '';
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    EmployeeMaintenanceComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        if (this.translatedMessageList) {
            var _loop_1 = function(key) {
                if (key && this_1.translatedMessageList[key]) {
                    this_1.getTranslatedValue(this_1.translatedMessageList[key], null).subscribe(function (res) {
                        if (res) {
                            _this.translatedMessageList[key] = res;
                        }
                    });
                }
            };
            var this_1 = this;
            for (var key in this.translatedMessageList) {
                _loop_1(key);
            }
        }
    };
    EmployeeMaintenanceComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    EmployeeMaintenanceComponent.prototype.window_onload = function () {
        this.loadUIFields();
        this.setMenuOptions();
        this.loadParentModeData();
    };
    EmployeeMaintenanceComponent.prototype.loadParentModeData = function () {
        if (this.parentMode === 'ServiceVisitCalendar') {
            this.ellipsisConfig.employeeSearch.autoOpen = false;
            var empCode = this.riExchange.getParentHTMLValue('EmployeeCode');
            this.uiForm.controls['EmployeeCode'].setValue(empCode);
            var data = { EmployeeCode: this.uiForm.controls['EmployeeCode'].value };
            this.onEmployeeSearchDataReceived(data, false);
        }
        if (this.parentMode === 'TechDiary') {
            this.ellipsisConfig.employeeSearch.autoOpen = false;
            var multiEmpCode = this.riExchange.getParentHTMLValue('MultiEmployeeCode');
            this.uiForm.controls['EmployeeCode'].setValue(multiEmpCode);
            var data = { EmployeeCode: this.uiForm.controls['EmployeeCode'].value };
            this.onEmployeeSearchDataReceived(data, false);
        }
    };
    EmployeeMaintenanceComponent.prototype.loadUIFields = function () {
        if (!(this.pageParams.vSCEnableHopewiserPAF === true || this.pageParams.vSCEnableDatabasePAF === true)) {
            this.fieldVisibility.cmdGetAddress1 = false;
            this.fieldVisibility.cmdGetAddress2 = false;
        }
        if (this.pageParams.vSCManpowerPlanning === true) {
            this.showManpowerPlanningFields();
        }
        if (this.pageParams.vSCCapitalFirstLtr === true) {
            this.riMaintenance_AddTableField('EmployeeForename1', MntConst.eTypeTextFree, 'Required');
            this.riMaintenance_AddTableField('EmployeeForename2', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('EmployeeForename3', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('EmployeeSurname', MntConst.eTypeTextFree, 'Required');
        }
        else {
            this.riMaintenance_AddTableField('EmployeeForename1', MntConst.eTypeText, 'Required');
            this.riMaintenance_AddTableField('EmployeeForename2', MntConst.eTypeText, 'Optional');
            this.riMaintenance_AddTableField('EmployeeForename3', MntConst.eTypeText, 'Optional');
            this.riMaintenance_AddTableField('EmployeeSurname', MntConst.eTypeText, 'Required');
        }
        this.riMaintenance_AddTableField('MaritalStatusCode', MntConst.eTypeTextFree, 'Lookup');
        this.riMaintenance_AddTableField('GenderCode', MntConst.eTypeTextFree, 'Required');
        this.riMaintenance_AddTableField('ExternalID', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('BranchNumber', MntConst.eTypeTextFree, 'Required');
        this.riMaintenance_AddTableField('OccupationCode', MntConst.eTypeTextFree, 'Required');
        this.riMaintenance_AddTableField('RealPerson', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('Grade', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('SupervisorEmployeeCode', MntConst.eTypeTextFree, 'Lookup');
        this.riMaintenance_AddTableField('DateOfBirth', MntConst.eTypeDate, 'Required');
        this.riMaintenance_AddTableField('DateJoined', MntConst.eTypeDate, 'Required');
        this.riMaintenance_AddTableField('PreviousService', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('LeaveEntitlement', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('ContractReceived', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('CommissionValid', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('PendingDeliveryValid', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('FirstAider', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('FirstAidReviewDate', MntConst.eTypeDate, 'Optional');
        this.riMaintenance_AddTableField('EarliestStartTime', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('FixedBreakTime', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('StartWorkFromHomeInd', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('HomeGPSCoordinateX', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('HomeGPSCoordinateY', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('RoutingGeonode', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('RoutingScore', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('RoutingSource', MntConst.eTypeText, 'Optional');
        if (this.pageParams.vSCCapitalFirstLtr === true) {
            this.riMaintenance_AddTableField('EmployeeAddressLine1', MntConst.eTypeTextFree, 'Required');
            this.riMaintenance_AddTableField('EmployeeAddressLine2', MntConst.eTypeTextFree, 'Optional');
            if (this.pageParams.vSCAddressLine3Logical === true) {
                this.riMaintenance_AddTableField('EmployeeAddressLine3', MntConst.eTypeTextFree, 'Required');
            }
            else {
                this.riMaintenance_AddTableField('EmployeeAddressLine3', MntConst.eTypeTextFree, 'Optional');
            }
            this.riMaintenance_AddTableField('EmployeeAddressLine4', MntConst.eTypeTextFree, 'Required');
            if (this.pageParams.vSCAddressLine5Logical === true) {
                this.riMaintenance_AddTableField('EmployeeAddressLine5', MntConst.eTypeTextFree, 'Required');
            }
            else {
                this.riMaintenance_AddTableField('EmployeeAddressLine5', MntConst.eTypeTextFree, 'Optional');
            }
        }
        else {
            this.riMaintenance_AddTableField('EmployeeAddressLine1', MntConst.eTypeText, 'Required');
            this.riMaintenance_AddTableField('EmployeeAddressLine2', MntConst.eTypeText, 'Optional');
            if (this.pageParams.vSCAddressLine3Logical === true) {
                this.riMaintenance_AddTableField('EmployeeAddressLine3', MntConst.eTypeText, 'Required');
            }
            else {
                this.riMaintenance_AddTableField('EmployeeAddressLine3', MntConst.eTypeText, 'Optional');
            }
            this.riMaintenance_AddTableField('EmployeeAddressLine4', MntConst.eTypeText, 'Required');
            if (this.pageParams.vSCAddressLine5Logical === true) {
                this.riMaintenance_AddTableField('EmployeeAddressLine5', MntConst.eTypeText, 'Required');
            }
            else {
                this.riMaintenance_AddTableField('EmployeeAddressLine5', MntConst.eTypeText, 'Optional');
            }
        }
        this.riMaintenance_AddTableField('EmployeePostcode', MntConst.eTypeTextFree, 'Required');
        this.riMaintenance_AddTableField('HomeTelephone', MntConst.eTypeText, 'Required');
        this.riMaintenance_AddTableField('MobileTelephone', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('WorkEmail', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('HomeEmail', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('UserCode', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('SMSMessageNumber', MntConst.eTypeText, 'Optional');
        if (this.pageParams.vSCCapitalFirstLtr === true) {
            this.riMaintenance_AddTableField('NoKName', MntConst.eTypeTextFree, 'Required');
            this.riMaintenance_AddTableField('NoKAddressLine1', MntConst.eTypeTextFree, 'Required');
            this.riMaintenance_AddTableField('NoKAddressLine2', MntConst.eTypeTextFree, 'Optional');
            if (this.pageParams.vSCAddressLine3Logical === true) {
                this.riMaintenance_AddTableField('NoKAddressLine3', MntConst.eTypeTextFree, 'Required');
            }
            else {
                this.riMaintenance_AddTableField('NoKAddressLine3', MntConst.eTypeTextFree, 'Optional');
            }
            this.riMaintenance_AddTableField('NoKAddressLine4', MntConst.eTypeTextFree, 'Required');
            if (this.pageParams.vSCAddressLine5Logical === true) {
                this.riMaintenance_AddTableField('NoKAddressLine5', MntConst.eTypeTextFree, 'Required');
            }
            else {
                this.riMaintenance_AddTableField('NoKAddressLine5', MntConst.eTypeTextFree, 'Optional');
            }
        }
        else {
            this.riMaintenance_AddTableField('NoKName', MntConst.eTypeText, 'Required');
            this.riMaintenance_AddTableField('NoKAddressLine1', MntConst.eTypeText, 'Required');
            this.riMaintenance_AddTableField('NoKAddressLine2', MntConst.eTypeText, 'Optional');
            if (this.pageParams.vSCAddressLine3Logical === true) {
                this.riMaintenance_AddTableField('NoKAddressLine3', MntConst.eTypeText, 'Required');
            }
            else {
                this.riMaintenance_AddTableField('NoKAddressLine3', MntConst.eTypeText, 'Optional');
            }
            this.riMaintenance_AddTableField('NoKAddressLine4', MntConst.eTypeText, 'Required');
            if (this.pageParams.vSCAddressLine5Logical === true) {
                this.riMaintenance_AddTableField('NoKAddressLine5', MntConst.eTypeText, 'Required');
            }
            else {
                this.riMaintenance_AddTableField('NoKAddressLine5', MntConst.eTypeText, 'Optional');
            }
        }
        this.riMaintenance_AddTableField('NoKPostcode', MntConst.eTypeTextFree, 'Required');
        this.riMaintenance_AddTableField('NoKHomeTelephone', MntConst.eTypeText, 'Required');
        this.riMaintenance_AddTableField('NoKOtherTelephone', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('NoKRelationship', MntConst.eTypeText, 'Required');
        this.riMaintenance_AddTableField('ClassType', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('VehicleRegistration', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('PetrolCardNumber', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('DrivingLicenceNumber', MntConst.eTypeTextFree, 'Optional');
        this.riMaintenance_AddTableField('DrivingLicenceExpiryDate', MntConst.eTypeDate, 'Optional');
        this.riMaintenance_AddTableField('DateLeft', MntConst.eTypeDate, 'Optional');
        this.riMaintenance_AddTableField('LeavingReason', MntConst.eTypeText, 'Optional');
        this.riMaintenance_AddTableField('TelephoneNumber', MntConst.eTypeText, 'Lookup');
        this.riMaintenance_AddTableField('SecondaryContactNumber', MntConst.eTypeText, 'Lookup');
        this.riMaintenance_AddTableField('LanguageCode', MntConst.eTypeTextFree, 'Lookup');
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
            for (var i = 1; i <= 7; i++) {
                this.riMaintenance_AddTableField('WindowStart0' + i, MntConst.eTypeTextFree, 'Required');
                this.riMaintenance_AddTableField('WindowEnd0' + i, MntConst.eTypeTextFree, 'Required');
                this.riMaintenance_AddTableField('WindowDayInd0' + i, MntConst.eTypeTextFree, 'Optional');
            }
            this.riMaintenance_AddTableField('StdHoursPerDay', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('MaxOTPerDay', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('MaxHoursPerWeek', MntConst.eTypeText, 'Optional');
            this.riMaintenance_AddTableField('StandardBreakTime', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('PersonalDrivingTime', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('AvgDrivingWorkDay', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('AverageSickness', MntConst.eTypeTextFree, 'Optional');
            this.riMaintenance_AddTableField('Occupation', MntConst.eTypeText, 'Optional');
        }
        this.uiForm.controls['cmdGetAddress1'].disable();
        this.uiForm.controls['cmdGetAddress2'].disable();
        this.uiForm.controls['cmdCopyAddress'].disable();
        if (this.pageParams.vbEnableRouteOptimisation === false) {
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
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_AddTableField = function (controlName, fieldType, option) {
        switch (option) {
            case 'Required':
                if (this.uiForm.controls.hasOwnProperty(controlName)) {
                    this.uiForm.controls[controlName].setValidators(Validators.required);
                    this.uiForm.controls[controlName].updateValueAndValidity();
                    this.fieldRequired[controlName] = true;
                    if ((fieldType === MntConst.eTypeDate) && this.datepicker.hasOwnProperty(controlName)) {
                        this.datepicker[controlName].isRequired = true;
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
                }
                break;
            case 'Lookup':
                if (this.uiForm.controls.hasOwnProperty(controlName)) {
                    this.uiForm.controls[controlName].clearValidators();
                    this.uiForm.controls[controlName].updateValueAndValidity();
                    this.fieldRequired[controlName] = false;
                }
                break;
            default:
        }
    };
    EmployeeMaintenanceComponent.prototype.onKeyDown = function (event) {
        event.preventDefault();
        if (event.keyCode === 34) {
            switch (event.target.id) {
                case 'LanguageCode':
                    alert('TODO: Model/riMGLanguageSearch.htm');
                    break;
                case 'BranchNumber':
                    break;
                case 'ClassType':
                    alert('TODO: Model/iCABSBClassTypeSearch.htm');
                    break;
                case 'VehicleRegistration':
                    alert('TODO: Business/iCABSBVehicleSearch.htm');
                    break;
                case 'GenderCode':
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
                case 'UserCode':
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
    };
    EmployeeMaintenanceComponent.prototype.showManpowerPlanningFields = function () {
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
        this.fieldVisibility.Sales = true;
        this.fieldVisibility.Work = true;
        this.fieldVisibility.Start = true;
        this.fieldVisibility.End = true;
        this.fieldVisibility.Day = true;
        this.fieldVisibility.OccupationCode = true;
        this.fieldVisibility.WorkDay = true;
    };
    EmployeeMaintenanceComponent.prototype.empSLocChange = function (viSDay) {
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
    };
    EmployeeMaintenanceComponent.prototype.empELocChange = function (viEDay) {
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
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_AfterAdd_On = function () {
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
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_AfterAb_onUpdate = function () {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();
        this.disableServiceDetails();
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_AfterSave = function () {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();
        this.disableServiceDetails();
        if (this.uiForm.controls['TabletUserInd'].value === true) {
            this.showHideTabletReload(true);
        }
        this.uiForm.updateValueAndValidity();
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_AfterDelete = function () {
        this.disableServiceDetails();
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_AfterSaveAdd = function () {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();
        this.disableServiceDetails();
        if (this.uiForm.controls['TabletUserInd'].value === true) {
            this.showHideTabletReload(true);
        }
    };
    EmployeeMaintenanceComponent.prototype.pdaWorkLoading = function () {
        this.uiForm.controls['PDAWorkLoad'].setValue(this.uiForm.controls['PDAWorkLoadSel'].value);
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_BeforeFetch = function () {
        this.addPostData();
    };
    EmployeeMaintenanceComponent.prototype.addPostData = function () {
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_AfterFetch = function () {
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
        }
        else {
            this.showHideTabletReload(false);
        }
        if (this.uiForm.controls['RoutingSource'].value && (this.uiForm.controls['RoutingSource'].value.length === 0)) {
            this.uiForm.controls['SelRoutingSource'].setValue('');
        }
        else {
            this.uiForm.controls['SelRoutingSource'].setValue(this.setFieldValue(this.uiForm.controls['RoutingSource'].value));
        }
        this.uiForm.updateValueAndValidity();
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_BeforeAddMode = function () {
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
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_BeforeUpdateMode = function () {
        this.uiForm.controls['riTimezoneCodeSelect'].enable();
        this.uiForm.controls['LOSCodeSelect'].enable();
        this.enableServiceDetails();
        this.uiForm.controls['BranchNumber'].disable();
        this.uiForm.controls['Occupation'].disable();
        this.showHideTabletReload(false);
        this.realPerson_onclick();
        this.uiForm.updateValueAndValidity();
    };
    EmployeeMaintenanceComponent.prototype.disableServiceDetails = function () {
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
    };
    EmployeeMaintenanceComponent.prototype.enableServiceDetails = function () {
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
    };
    EmployeeMaintenanceComponent.prototype.showHideTabletReload = function (lShow) {
        if (lShow) {
            this.fieldVisibility.trTabletReload = true;
            var date = new Date(new Date().setDate(new Date().getDate() - 90));
            this.uiForm.controls['TabletReloadFromDate'].setValue(date);
            this.uiForm.controls['TabletReloadFromDate'].updateValueAndValidity();
            this.setRequiredStatus('TabletReloadFromDate', true);
        }
        else {
            this.uiForm.controls['TabletReloadFromDate'].setValue('');
            this.setRequiredStatus('TabletReloadFromDate', false);
            this.fieldVisibility.trTabletReload = false;
        }
    };
    EmployeeMaintenanceComponent.prototype.realPerson_onclick = function (event) {
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'RealPerson')) {
            if (this.uiForm.controls['RealPerson'].value) {
                this.setRequiredStatus('GenderCode', true);
                this.setRequiredStatus('DateofBirth', true, true);
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
            }
            else {
                this.setRequiredStatus('GenderCode', false);
                this.setRequiredStatus('DateofBirth', false, true);
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
    };
    EmployeeMaintenanceComponent.prototype.setRequiredStatus = function (controlName, value, isDate) {
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
        else {
        }
        this.uiForm.updateValueAndValidity();
    };
    EmployeeMaintenanceComponent.prototype.fetchRecordData = function (functionName, params, postdata) {
        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.set(this.serviceConstants.Action, '0');
        if (functionName !== '') {
            this.queryParams.set(this.serviceConstants.Action, '6');
        }
        for (var key in params) {
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
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_BeforeSave = function () {
        var _this = this;
        this.uiForm.controls['riTimezoneCode'].setValue(this.uiForm.controls['riTimezoneCodeSelect'].value);
        this.uiForm.controls['LOSCode'].setValue(this.uiForm.controls['LOSCodeSelect'].value);
        this.uiForm.controls['RoutingSource'].setValue(this.uiForm.controls['SelRoutingSource'].value);
        if (this.pageParams.vSCManpowerPlanning) {
            if (!this.validateWorkingHourFieldsEntry()) {
                this.errorModal.show({ msg: this.translatedMessageList['Please_Enter_Working_Hours'], title: 'Error' }, false);
                this.riMaintenanceCancelEvent = true;
                return;
            }
            if (!this.validateWorkingHourFields()) {
                this.messageModal.show({ msg: this.translatedMessageList['No_Start_Time_or_End_Time'], title: '' }, false);
                this.riMaintenanceCancelEvent = true;
                return;
            }
        }
        if (this.pageParams.vbEnableRouteOptimisation && this.uiForm.controls['SelRoutingSource'].value === '') {
            var postDataAdd = {
                'private': 'GetGeocodeAddress',
                'AddressLine1': this.uiForm.controls['EmployeeAddressLine1'].value,
                'AddressLine2': this.uiForm.controls['EmployeeAddressLine2'].value,
                'AddressLine3': this.uiForm.controls['EmployeeAddressLine3'].value,
                'AddressLine4': this.uiForm.controls['EmployeeAddressLine4'].value,
                'AddressLine5': this.uiForm.controls['EmployeeAddressLine5'].value,
                'Postcode': this.uiForm.controls['EmployeePostcode'].value,
                'GPSX': this.uiForm.controls['HomeGPSCoordinateX'].value,
                'GPSY': this.uiForm.controls['HomeGPSCoordinateY'].value
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchRecordData({}, postDataAdd).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    _this.errorService.emitError(data.oResponse);
                }
                else {
                    if (data.errorMessage) {
                        _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                    }
                    else {
                        _this.uiForm.controls['AddressError'].setValue(data['AddressError']);
                        if (_this.uiForm.controls['AddressError'].value !== 'Error') {
                            _this.uiForm.controls['RoutingGeonode'].setValue(data['Node']);
                            _this.uiForm.controls['RoutingScore'].setValue(data['Score']);
                            _this.uiForm.controls['HomeGPSCoordinateX'].setValue(data['GPSX']);
                            _this.uiForm.controls['HomeGPSCoordinateY'].setValue(data['GPSY']);
                            if (_this.uiForm.controls['RoutingScore'].value > 0) {
                                _this.uiForm.controls['SelRoutingSource'].setValue('T');
                                _this.uiForm.controls['RoutingSource'].setValue('T');
                            }
                            else {
                                _this.uiForm.controls['SelRoutingSource'].setValue('');
                                _this.uiForm.controls['RoutingSource'].setValue('');
                            }
                        }
                        else {
                            _this.messageModal.show({ msg: _this.translatedMessageList.Unable_to_Geocode_Address, title: '' }, false);
                            _this.riMaintenanceCancelEvent = true;
                        }
                    }
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        this.addPostData();
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_BeforeMode = function () {
        if (this.updateMode) {
            this.uiForm.controls['cmdGetAddress1'].enable();
            this.uiForm.controls['cmdGetAddress2'].enable();
            this.uiForm.controls['cmdCopyAddress'].enable();
            this.uiForm.controls['cmdGeocode'].enable();
            this.fieldVisibility.btnDefault = true;
        }
        if (this.addMode) {
            this.uiForm.controls['cmdGeocode'].enable();
            this.fieldVisibility.btnDefault = true;
        }
        if (this.normalMode || this.searchMode) {
            this.uiForm.controls['cmdGetAddress1'].disable();
            this.uiForm.controls['cmdGetAddress2'].disable();
            this.uiForm.controls['cmdCopyAddress'].disable();
            this.uiForm.controls['cmdGeocode'].disable();
        }
        this.uiForm.updateValueAndValidity();
    };
    EmployeeMaintenanceComponent.prototype.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
    EmployeeMaintenanceComponent.prototype.isDate = function (data) {
        try {
            return window['moment'](data, 'DD/MM/YYYY', true).isValid();
        }
        catch (e) {
            return false;
        }
    };
    EmployeeMaintenanceComponent.prototype.validateWorkingHourFields = function () {
        for (var i = 1; i <= 7; i++) {
            var obj1 = this.uiForm.controls['WindowStart0' + i].value;
            var obj2 = this.uiForm.controls['WindowEnd0' + i].value;
            if (obj1 !== '00:00' || obj2 !== '00:00') {
                return true;
            }
        }
        return false;
    };
    EmployeeMaintenanceComponent.prototype.validateWorkingHourFieldsEntry = function () {
        for (var i = 1; i <= 7; i++) {
            var obj1 = this.uiForm.controls['WindowStart0' + i].value;
            var obj2 = this.uiForm.controls['WindowEnd0' + i].value;
            if ((obj1 === '') || (obj2 === '')) {
                return false;
            }
        }
        return true;
    };
    EmployeeMaintenanceComponent.prototype.riExchange_CBORequest = function () {
        var _this = this;
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'OccupationCode') && this.uiForm.controls['OccupationCode'].value !== '') {
            if (this.pageParams.vSCManpowerPlanning) {
                this.getBranchDefault();
            }
            var postDataAdd = {};
            postDataAdd[this.serviceConstants.Action] = '6';
            postDataAdd[this.serviceConstants.Function] = 'GetOccupationWarningMessage';
            postDataAdd[this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
            postDataAdd['EmployeeCode'] = this.uiForm.controls['EmployeeCode'].value;
            postDataAdd['OccupationCode'] = this.uiForm.controls['OccupationCode'].value;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchRecordData('GetOccupationWarningMessage', {}, postDataAdd).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    _this.errorService.emitError(data.oResponse);
                }
                else {
                    if (data.errorMessage) {
                        _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                    }
                    else {
                        _this.uiForm.controls['OccWarningMessage'].setValue(data['OccWarningMessage']);
                        if (_this.uiForm.controls['OccWarningMessage'].value) {
                            _this.messageModal.show({ msg: _this.uiForm.controls['OccWarningMessage'].value, title: '' }, false);
                            _this.uiForm.controls['OccWarningMessage'].setValue('');
                        }
                    }
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'VehicleRegistration') && this.uiForm.controls['VehicleRegistration'].value !== '') {
            var postDataAdd = {};
            postDataAdd[this.serviceConstants.Action] = '6';
            postDataAdd[this.serviceConstants.Function] = 'GetVehicleRegistrationWarningMessage';
            postDataAdd['VehicleRegistration'] = this.uiForm.controls['VehicleRegistration'].value;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchRecordData('GetVehicleRegistrationWarningMessage', {}, postDataAdd).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    _this.errorService.emitError(data.oResponse);
                }
                else {
                    if (data.errorMessage) {
                        _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                    }
                    else {
                        _this.uiForm.controls['VRegWarningMessage'].setValue(data['VRegWarningMessage'] || '');
                        if (_this.uiForm.controls['VRegWarningMessage'].value) {
                            _this.messageModal.show({ msg: _this.uiForm.controls['VRegWarningMessage'].value, title: '' }, false);
                            _this.uiForm.controls['VRegWarningMessage'].setValue('');
                        }
                    }
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    EmployeeMaintenanceComponent.prototype.processTimeString = function (vbTimeField) {
        var vbTime;
        var vbDurationHours;
        var vbDurationMinutes;
        var vbTimeSec;
        var vbVisitDurationSec;
        var vbError;
        var vbMsgResult;
        var vbTimeFormat;
        var vbTimeSeparator = '';
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
                }
                else {
                    vbTimeSec = (vbDurationHours * 60 * 60) + (vbDurationMinutes * 60);
                }
            }
        }
        switch (vbTimeField) {
            case 'MaxHoursPerWeek':
                if (!vbError) {
                    this.uiForm.controls['MaxHoursPerWeek'].setValue(this.toHHMMSSTimeFormat(vbTime));
                }
                else {
                    this.uiForm.controls['MaxHoursPerWeek'].setValue('');
                }
                break;
            default:
                break;
        }
    };
    EmployeeMaintenanceComponent.prototype.buildMenu = function () {
    };
    EmployeeMaintenanceComponent.prototype.toHHMMSSTimeFormat = function (seconds) {
        var h = '';
        var m = '';
        var s = '';
        var hourSeparator = ':';
        var minuteSeparator = ':';
        var sec_num = parseInt(seconds, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        seconds = sec_num - (hours * 3600) - (minutes * 60);
        if (hours < 10) {
            h = '0' + hours;
        }
        if (minutes < 10) {
            m = '0' + minutes;
        }
        if (seconds < 10) {
            s = '0' + seconds;
        }
        var time = h + hourSeparator + m + minuteSeparator + s;
        return time;
    };
    EmployeeMaintenanceComponent.prototype.getBranchDefault = function () {
        var _this = this;
        var postDataAdd = {};
        postDataAdd[this.serviceConstants.Function] = 'GetBranchDefault';
        postDataAdd[this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
        postDataAdd['BranchNumber'] = this.utils.getBranchCode();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('GetBranchDefault', {}, postDataAdd).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                if (data.errorMessage) {
                    _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                }
                else {
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    EmployeeMaintenanceComponent.prototype.cmdGetAddress1_onclick = function (event) {
        if (this.pageParams.vSCEnableHopewiserPAF) {
            alert('TODO: Model/riMPAFSearch.htm');
        }
        if (this.pageParams.vSCEnableDatabasePAF) {
            alert('TODO: Application/iCABSAAUPostcodeSearch.htm');
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdGetAddress2_onclick = function (event) {
        if (this.pageParams.vSCEnableHopewiserPAF) {
            alert('TODO: Model/riMPAFSearch.htm');
        }
        if (this.pageParams.vSCEnableDatabasePAF) {
            alert('TODO: Application/iCABSAAUPostcodeSearch.htm');
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdGeocode_onclick = function (event) {
        alert('TODO: Application/iCABSARoutingSearch.htm');
    };
    EmployeeMaintenanceComponent.prototype.cmdReload_onclick = function (event) {
        var _this = this;
        var lGoReload;
        lGoReload = true;
        if (lGoReload && !this.isDate(this.uiForm.controls['TabletReloadFromDate'].value)) {
            lGoReload = false;
        }
        if (!lGoReload) {
        }
        if (lGoReload) {
            var postDataAdd = {};
            postDataAdd[this.serviceConstants.Action] = '6';
            postDataAdd[this.serviceConstants.Function] = 'TabletReload';
            postDataAdd['BusinessCode'] = this.utils.getBusinessCode();
            postDataAdd['EmployeeCode'] = this.uiForm.controls['EmployeeCode'].value;
            postDataAdd['TabletReloadFromDate'] = this.uiForm.controls['TabletReloadFromDate'].value;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.fetchRecordData('TabletReload', {}, postDataAdd).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    _this.errorService.emitError(data.oResponse);
                }
                else {
                    if (data.errorMessage) {
                        _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                    }
                    else {
                        _this.messageModal.show({ msg: data['InformationText'], title: '' }, false);
                    }
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdCourses_onclick = function (event) {
        if (this.recordSelected()) {
            alert('Business/iCABSBCourseSearch.htm');
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdQualifications_onclick = function (event) {
        if (this.recordSelected()) {
            alert('Business/iCABSBEmployeeQualificationGrid.htm');
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdDiary_onclick = function (event) {
        if (this.recordSelected()) {
            this.navigate('Employee', 'grid/application/DairyYearGridGridComponent');
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdAvailability_onclick = function (event) {
        if (this.recordSelected()) {
            alert('TODO: iCABSBEmployeeAvailabilityTemplate.htm');
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdLocation_onclick = function (event) {
        if (this.recordSelected()) {
            alert('TODO: iCABSBLocOverrideAvailabilityTemplate.htm');
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdAvailDayOverride_onclick = function (event) {
        if (this.recordSelected()) {
            alert('TODO:iCABSBBranchAvailabilityDetWeeks.htm');
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdNonServAppointment_onclick = function (event) {
        if (this.recordSelected()) {
            alert('TODO: Business/iCABSBLocationAvailabilityDetWeeks.htm');
        }
    };
    EmployeeMaintenanceComponent.prototype.cmdCopyAddress_onclick = function (event) {
        if (this.addMode || this.updateMode) {
            this.uiForm.controls['NoKAddressLine1'].setValue(this.uiForm.controls['EmployeeAddressLine1'].value);
            this.uiForm.controls['NoKAddressLine2'].setValue(this.uiForm.controls['EmployeeAddressLine2'].value);
            this.uiForm.controls['NoKAddressLine3'].setValue(this.uiForm.controls['EmployeeAddressLine3'].value);
            this.uiForm.controls['NoKAddressLine4'].setValue(this.uiForm.controls['EmployeeAddressLine4'].value);
            this.uiForm.controls['NoKAddressLine5'].setValue(this.uiForm.controls['EmployeeAddressLine5'].value);
            this.uiForm.controls['NoKPostcode'].setValue(this.uiForm.controls['EmployeePostcode'].value);
            this.uiForm.controls['NoKHomeTelephone'].setValue(this.uiForm.controls['HomeTelephone'].value);
            this.uiForm.updateValueAndValidity();
        }
    };
    EmployeeMaintenanceComponent.prototype.btnDefault_onclick = function (event) {
        this.promptMode = 'btnDefault_onclick';
        this.promptConfig.OKCancel.promptConfirmTitle = this.translatedMessageList.Working_Hours;
        this.promptConfig.OKCancel.promptConfirmContent = this.translatedMessageList.This_will_retrieve_the_default;
        this.promptOKCancelModal.show();
    };
    EmployeeMaintenanceComponent.prototype.btnDefaultConfirm = function (value) {
        var _this = this;
        var postDataAdd = {};
        postDataAdd[this.serviceConstants.Action] = '6';
        postDataAdd[this.serviceConstants.Function] = 'GetBusinessDefault';
        postDataAdd['BusinessCode'] = this.utils.getBusinessCode();
        postDataAdd['BranchNumber'] = this.utils.getBranchCode();
        postDataAdd['OccupationCode'] = this.uiForm.controls['OccupationCode'].value;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('GetBusinessDefault', {}, postDataAdd).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                if (data.errorMessage) {
                    _this.messageModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                }
                else {
                    _this.uiForm.controls['StdHoursPerDay'].setValue(_this.getSecondsToHms(data['StdHoursPerDay']));
                    _this.uiForm.controls['PersonalDrivingTime'].setValue(_this.getSecondsToHms(data['PersonalDrivingTime']));
                    _this.uiForm.controls['MaxOTPerDay'].setValue(_this.getSecondsToHms(data['MaxOTPerDay']));
                    _this.uiForm.controls['AvgDrivingWorkDay'].setValue(data['AvgDrivingWorkDay']);
                    _this.uiForm.controls['MaxHoursPerWeek'].setValue(_this.getSecondsToHms(data['MaxHoursPerWeek']));
                    _this.uiForm.controls['AverageSickness'].setValue(data['AverageSickness']);
                    _this.uiForm.controls['StandardBreakTime'].setValue(_this.getSecondsToHms(data['StdBreakTime']));
                    _this.uiForm.controls['WindowStart01'].setValue(_this.getSecondsToHms(data['WindowStart01']));
                    _this.uiForm.controls['WindowStart02'].setValue(_this.getSecondsToHms(data['WindowStart02']));
                    _this.uiForm.controls['WindowStart03'].setValue(_this.getSecondsToHms(data['WindowStart03']));
                    _this.uiForm.controls['WindowStart04'].setValue(_this.getSecondsToHms(data['WindowStart04']));
                    _this.uiForm.controls['WindowStart05'].setValue(_this.getSecondsToHms(data['WindowStart05']));
                    _this.uiForm.controls['WindowStart06'].setValue(_this.getSecondsToHms(data['WindowStart06']));
                    _this.uiForm.controls['WindowStart07'].setValue(_this.getSecondsToHms(data['WindowStart07']));
                    _this.uiForm.controls['WindowEnd01'].setValue(_this.getSecondsToHms(data['WindowEnd01']));
                    _this.uiForm.controls['WindowEnd02'].setValue(_this.getSecondsToHms(data['WindowEnd02']));
                    _this.uiForm.controls['WindowEnd03'].setValue(_this.getSecondsToHms(data['WindowEnd03']));
                    _this.uiForm.controls['WindowEnd04'].setValue(_this.getSecondsToHms(data['WindowEnd04']));
                    _this.uiForm.controls['WindowEnd05'].setValue(_this.getSecondsToHms(data['WindowEnd05']));
                    _this.uiForm.controls['WindowEnd06'].setValue(_this.getSecondsToHms(data['WindowEnd06']));
                    _this.uiForm.controls['WindowEnd07'].setValue(_this.getSecondsToHms(data['WindowEnd07']));
                    _this.uiForm.controls['WindowDayInd01'].setValue(data['WindowDayInd01']);
                    _this.uiForm.controls['WindowDayInd02'].setValue(data['WindowDayInd02']);
                    _this.uiForm.controls['WindowDayInd03'].setValue(data['WindowDayInd03']);
                    _this.uiForm.controls['WindowDayInd04'].setValue(data['WindowDayInd04']);
                    _this.uiForm.controls['WindowDayInd05'].setValue(data['WindowDayInd05']);
                    _this.uiForm.controls['WindowDayInd06'].setValue(data['WindowDayInd06']);
                    _this.uiForm.controls['WindowDayInd07'].setValue(data['WindowDayInd07']);
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.messageModal.show({ msg: error, title: 'Error' }, false);
        });
    };
    EmployeeMaintenanceComponent.prototype.homeGPSCoordinateX_onchange = function () {
        this.setRoutingSource();
    };
    EmployeeMaintenanceComponent.prototype.homeGPSCoordinateY_onchange = function () {
        this.setRoutingSource();
    };
    EmployeeMaintenanceComponent.prototype.routingScore_onchange = function () {
        this.setRoutingSource();
    };
    EmployeeMaintenanceComponent.prototype.setRoutingSource = function () {
        var decGPSX;
        var decGPSY;
        var intRoutingScore;
        if (!isNaN(this.uiForm.controls['HomeGPSCoordinateX'].value)) {
            decGPSX = this.uiForm.controls['HomeGPSCoordinateX'].value;
        }
        else {
            decGPSX = 0;
        }
        if (!isNaN(this.uiForm.controls['HomeGPSCoordinateY'].value)) {
            decGPSY = this.uiForm.controls['HomeGPSCoordinateY'].value;
        }
        else {
            decGPSY = 0;
        }
        if (!isNaN(this.uiForm.controls['RoutingScore'].value)) {
            intRoutingScore = this.uiForm.controls['RoutingScore'].value;
        }
        else {
            intRoutingScore = 0;
        }
        if (intRoutingScore === 0 || decGPSY === 0 || decGPSX === 0) {
            this.uiForm.controls['SelRoutingSource'].setValue('');
            this.uiForm.controls['RoutingSource'].setValue('');
        }
        else {
            this.uiForm.controls['SelRoutingSource'].setValue('M');
            this.uiForm.controls['RoutingSource'].setValue('M');
        }
    };
    EmployeeMaintenanceComponent.prototype.menu_onchange = function (value) {
        switch (value) {
            case 'Qualifications':
                this.cmdQualifications_onclick(event);
                break;
            case 'Courses':
                this.cmdCourses_onclick(event);
                break;
            case 'Diary':
                this.cmdDiary_onclick(event);
                break;
            case 'Availability':
                this.cmdAvailability_onclick(event);
                break;
            case 'AvailDayOverride':
                this.cmdAvailDayOverride_onclick(event);
                break;
            case 'Location':
                this.cmdLocation_onclick(event);
                break;
            case 'NonServAppointment':
                this.cmdNonServAppointment_onclick(event);
                break;
            default:
        }
    };
    EmployeeMaintenanceComponent.prototype.maxHoursPerWeek_OnChange = function () {
        this.processTimeString('MaxHoursPerWeek');
    };
    EmployeeMaintenanceComponent.prototype.setMenuOptions = function () {
        var _this = this;
        var vbEnableQualifications;
        var postDataAdd = {};
        postDataAdd[this.serviceConstants.Function] = 'CheckOccupation';
        postDataAdd['BusinessCode'] = this.utils.getBusinessCode();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('CheckOccupation', {}, postDataAdd).subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                if (data.errorMessage) {
                    _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                }
                else {
                    if (data['OccupationIsAllow'] === 'yes') {
                        vbEnableQualifications = true;
                    }
                    else {
                        vbEnableQualifications = false;
                    }
                    if (vbEnableQualifications) {
                        _this.menuOptionList.push({ value: 'Qualifications', text: _this.translatedMessageList['Qualifications'] });
                    }
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    EmployeeMaintenanceComponent.prototype.recordSelected = function () {
        return this.storeData ? true : false;
    };
    EmployeeMaintenanceComponent.prototype.setFormData = function (data) {
        var _this = this;
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
        this.uiForm.controls['SupervisorSurname'].setValue(this.setFieldValue(data.SupervisorSurname));
        this.uiForm.controls['MaritalStatusCode'].setValue(this.setFieldValue(data.MaritalStatusCode));
        this.uiForm.controls['MaritalStatusDesc'].setValue(this.setFieldValue(data.MaritalStatusDesc));
        this.uiForm.controls['GenderCode'].setValue(this.setFieldValue(data.GenderCode));
        this.uiForm.controls['GenderDesc'].setValue(this.setFieldValue(data.GenderDesc));
        this.zone.run(function () {
            _this.dropdownConfig.genderSearch.selected = {
                id: _this.uiForm.controls['GenderCode'].value || '',
                text: (_this.uiForm.controls['GenderCode'].value) ? (_this.uiForm.controls['GenderCode'].value + ' - ' + _this.uiForm.controls['GenderDesc'].value || '') : ''
            };
        });
        this.zone.run(function () {
            _this.dropdownConfig.branchSearch.selected = {
                id: _this.uiForm.controls['BranchNumber'].value || '',
                text: _this.uiForm.controls['BranchNumber'].value + ' - ' + _this.uiForm.controls['BranchName'].value || ''
            };
        });
        this.uiForm.controls['WorkEmail'].setValue(this.setFieldValue(data.WorkEmail));
        this.uiForm.controls['SMSMessageNumber'].setValue(this.setFieldValue(data.SMSMessageNumber));
        this.uiForm.controls['TelephoneNumber'].setValue(this.setFieldValue(data.TelephoneNumber));
        this.uiForm.controls['SecondaryContactNumber'].setValue(this.setFieldValue(data.SecondaryContactNumber));
        this.uiForm.controls['LanguageCode'].setValue(this.setFieldValue(data.LanguageCode));
        this.uiForm.controls['LanguageDescription'].setValue(this.setFieldValue(data.LanguageDescription));
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
        this.datepicker.TabletReloadFromDate.value = this.setFieldValue(data.TabletReloadFromDate);
        this.uiForm.controls['riTimezoneCodeSelect'].setValue(this.setFieldValue(data.riTimezoneCode));
        this.uiForm.controls['riTimezoneCode'].setValue(this.setFieldValue(data.riTimezoneCode));
        this.uiForm.controls['LOSCode'].setValue(this.setFieldValue(data.LOSCode));
        this.uiForm.controls['LOSCodeSelect'].setValue(this.setFieldValue(data.LOSCode));
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
        this.uiForm.controls['ClassType'].setValue(this.setFieldValue(data.ClassType));
        this.uiForm.controls['VehicleRegistration'].setValue(this.setFieldValue(data.VehicleRegistration));
        this.uiForm.controls['PetrolCardNumber'].setValue(this.setFieldValue(data.PetrolCardNumber));
        this.uiForm.controls['DrivingLicenceNumber'].setValue(this.setFieldValue(data.DrivingLicenceNumber));
        this.uiForm.controls['DrivingLicenceExpiryDate'].setValue(this.setFieldValue(data.DrivingLicenceExpiryDate));
        this.datepicker.DrivingLicenceExpiryDate.value = this.setFieldValue(data.DrivingLicenceExpiryDate);
        this.uiForm.controls['DateLeft'].setValue(this.setFieldValue(data.DateLeft));
        this.datepicker.DateLeft.value = this.setFieldValue(data.DateLeft, false, true);
        this.uiForm.controls['LeavingReason'].setValue(this.setFieldValue(data.LeavingReason));
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
        this.uiForm.controls['StandardBreakTime'].setValue(this.setFieldValue(data.StandardBreakTime));
        this.uiForm.controls['PDAWorkLoadSel'].setValue(this.setFieldValue(data.PDAWorkLoadSel));
        this.uiForm.controls['EmployeeStartLocation7Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation7Sel));
        this.uiForm.controls['EmployeeEndLocation7Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation7Sel));
        this.uiForm.controls['EmployeeStartLocation1Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation1Sel));
        this.uiForm.controls['EmployeeEndLocation1Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation1Sel));
        this.uiForm.controls['EmployeeStartLocation2Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation2Sel));
        this.uiForm.controls['EmployeeEndLocation2Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation2Sel));
        this.uiForm.controls['EmployeeStartLocation3Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation3Sel));
        this.uiForm.controls['EmployeeEndLocation3Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation3Sel));
        this.uiForm.controls['EmployeeStartLocation4Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation4Sel));
        this.uiForm.controls['EmployeeEndLocation4Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation4Sel));
        this.uiForm.controls['EmployeeStartLocation5Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation5Sel));
        this.uiForm.controls['EmployeeEndLocation5Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation5Sel));
        this.uiForm.controls['EmployeeStartLocation6Sel'].setValue(this.setFieldValue(data.EmployeeStartLocation6Sel));
        this.uiForm.controls['EmployeeEndLocation6Sel'].setValue(this.setFieldValue(data.EmployeeEndLocation6Sel));
        this.uiForm.updateValueAndValidity();
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_AfterAbandon = function () {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();
        this.disableServiceDetails();
        if (this.uiForm.controls['TabletUserInd'].value === true) {
            this.showHideTabletReload(true);
        }
        else {
            this.showHideTabletReload(false);
        }
    };
    EmployeeMaintenanceComponent.prototype.riMaintenance_AfterAbandonUpdate = function () {
        this.uiForm.controls['riTimezoneCodeSelect'].disable();
        this.uiForm.controls['LOSCodeSelect'].disable();
        this.disableServiceDetails();
    };
    EmployeeMaintenanceComponent.prototype.processForm = function () {
        var _this = this;
        this.datepicker.DateOfBirth.clearDate = true;
        this.datepicker.DateJoined.clearDate = true;
        this.datepicker.FirstAidReviewDate.clearDate = true;
        this.datepicker.TabletReloadFromDate.clearDate = true;
        this.datepicker.DrivingLicenceExpiryDate.clearDate = true;
        this.datepicker.DateLeft.clearDate = true;
        this.datepicker.DateOfBirth.value = null;
        this.datepicker.DateJoined.value = null;
        this.datepicker.FirstAidReviewDate.value = null;
        this.datepicker.TabletReloadFromDate.value = null;
        this.datepicker.DrivingLicenceExpiryDate.value = null;
        this.datepicker.DateLeft.value = null;
        if (this.updateMode && !this.searchMode && !this.addMode) {
            for (var key in this.uiForm.controls) {
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
            this.datepicker.DateOfBirth.isDisabled = false;
            this.datepicker.DateJoined.isDisabled = false;
            this.datepicker.FirstAidReviewDate.isDisabled = false;
            this.datepicker.TabletReloadFromDate.isDisabled = false;
            this.datepicker.DrivingLicenceExpiryDate.isDisabled = false;
            this.datepicker.DateLeft.isDisabled = false;
            this.ellipsisConfig.riMUserInformationSearch.disabled = true;
            this.uiForm.controls['EarliestStartTime'].setValidators(this.validateTimeHhMm);
            this.uiForm.controls['FixedBreakTime'].setValidators(this.validateTimeHhMm);
            for (var i = 1; i <= 7; i++) {
                this.uiForm.controls['WindowStart0' + i].setValidators(this.validateTimeHhMm);
                this.uiForm.controls['WindowEnd0' + i].setValidators(this.validateTimeHhMm);
            }
            this.uiForm.controls['StdHoursPerDay'].setValidators(this.validateTimeHhMm);
            this.uiForm.controls['PersonalDrivingTime'].setValidators(this.validateTimeHhMm);
            this.uiForm.controls['MaxOTPerDay'].setValidators(this.validateTimeHhMm);
        }
        if (this.searchMode && !this.updateMode && !this.addMode) {
            for (var key in this.uiForm.controls) {
                if (this.uiForm.controls[key]) {
                    this.uiForm.controls[key].disable();
                }
            }
            this.ellipsisConfig.employeeSearch.disabled = false;
            this.uiForm.controls['EmployeeCode'].disable();
            this.dropdownConfig.branchSearch.isDisabled = true;
            this.ellipsisConfig.occupationSearch.disabled = true;
            this.ellipsisConfig.supervisorEmp.disabled = true;
            this.dropdownConfig.maritalSearch.isDisabled = true;
            this.dropdownConfig.genderSearch.isDisabled = true;
            this.ellipsisConfig.riMUserInformationSearch.disabled = true;
            this.datepicker.DateOfBirth.isDisabled = true;
            this.datepicker.DateJoined.isDisabled = true;
            this.datepicker.FirstAidReviewDate.isDisabled = true;
            this.datepicker.TabletReloadFromDate.isDisabled = true;
            this.datepicker.DrivingLicenceExpiryDate.isDisabled = true;
            this.datepicker.DateLeft.isDisabled = true;
            this.ellipsisConfig.riMUserInformationSearch.disabled = true;
            this.uiForm.controls['cmdGetAddress2'].disable();
        }
        if (this.addMode && !this.updateMode && !this.searchMode) {
            for (var key in this.uiForm.controls) {
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
            this.datepicker.DateOfBirth.isDisabled = false;
            this.datepicker.DateJoined.isDisabled = false;
            this.datepicker.FirstAidReviewDate.isDisabled = false;
            this.datepicker.TabletReloadFromDate.isDisabled = false;
            this.datepicker.DrivingLicenceExpiryDate.isDisabled = false;
            this.datepicker.DateLeft.isDisabled = false;
            this.ellipsisConfig.riMUserInformationSearch.disabled = true;
            this.uiForm.controls['BranchNumber'].setValue(this.utils.getBranchCode() || '');
            this.uiForm.controls['BranchName'].setValue(this.utils.getBranchText() || '');
            this.zone.run(function () {
                _this.dropdownConfig.branchSearch.selected = {
                    id: _this.uiForm.controls['BranchNumber'].value || '',
                    text: _this.uiForm.controls['BranchName'].value || ''
                };
            });
            this.zone.run(function () {
                _this.dropdownConfig.genderSearch.selected = {
                    id: '',
                    text: ''
                };
            });
            this.zone.run(function () {
                _this.dropdownConfig.maritalSearch.selected = {
                    id: '',
                    text: ''
                };
            });
            for (var i = 1; i <= 7; i++) {
                this.uiForm.controls['WindowStart0' + i].setValidators(this.validateTimeHhMm);
                this.uiForm.controls['WindowEnd0' + i].setValidators(this.validateTimeHhMm);
            }
            this.uiForm.controls['EarliestStartTime'].setValidators(this.validateTimeHhMm);
            this.uiForm.controls['FixedBreakTime'].setValidators(this.validateTimeHhMm);
            this.uiForm.controls['StdHoursPerDay'].setValidators(this.validateTimeHhMm);
            this.uiForm.controls['PersonalDrivingTime'].setValidators(this.validateTimeHhMm);
            this.uiForm.controls['MaxOTPerDay'].setValidators(this.validateTimeHhMm);
            this.uiForm.controls['LOSCodeSelect'].setValue(this.utils.getBusinessCode() || '');
        }
        this.uiForm.controls['menu'].setValue('');
        this.uiForm.controls['OccupationDesc'].disable();
        this.uiForm.controls['SupervisorSurname'].disable();
        this.uiForm.controls['UserName'].disable();
    };
    EmployeeMaintenanceComponent.prototype.setFieldValue = function (controlObj, isCheckBox, isDate) {
        if (isCheckBox === true) {
            return (controlObj) ? ((controlObj === 'Yes' || controlObj === 'yes' || controlObj === 'Y' || controlObj === 'Y') ? true : false) : false;
        }
        if (isDate) {
            if (controlObj) {
                var tempDate = this.toDateFormat(controlObj);
                return (tempDate) ? tempDate : controlObj;
            }
            else {
                return '';
            }
        }
        return (controlObj) ? controlObj : '';
    };
    EmployeeMaintenanceComponent.prototype.getSecondsToHms = function (val) {
        return (val) ? this.utils.secondsToHms(val) : '00:00';
    };
    EmployeeMaintenanceComponent.prototype.getHmsToSeconds = function (val) {
        return (val) ? this.utils.hmsToSeconds(val) : '0';
    };
    EmployeeMaintenanceComponent.prototype.getFieldValue = function (controlObj, isCheckBox, isDate) {
        if (isCheckBox === true) {
            return (controlObj && controlObj.value) ? ((controlObj.value === true) ? 'Yes' : 'no') : 'no';
        }
        if (isDate) {
            if (controlObj && controlObj.value) {
                var tempDate = this.utils.formatDate(controlObj.value);
                return (tempDate) ? tempDate : controlObj.value;
            }
            else {
                return '';
            }
        }
        return (controlObj && controlObj.value) ? controlObj.value : '';
    };
    EmployeeMaintenanceComponent.prototype.isCheckBoxChecked = function (arg) {
        if (typeof arg === 'boolean' || (typeof arg === 'object' && typeof arg.valueOf() === 'boolean'))
            return arg;
        return (arg) ? (((arg.toLowerCase() === 'false') || (arg.toLowerCase() === 'f') || (arg.toLowerCase() === 'no')) ? false : true) : false;
    };
    EmployeeMaintenanceComponent.prototype.getFormDataForEmployeeCode = function () {
        var formdata = {};
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
        formdata['WorkEmail'] = this.getFieldValue(this.uiForm.controls['WorkEmail']);
        formdata['SMSMessageNumber'] = this.getFieldValue(this.uiForm.controls['SMSMessageNumber']);
        formdata['TelephoneNumber'] = this.getFieldValue(this.uiForm.controls['TelephoneNumber']);
        formdata['SecondaryContactNumber'] = this.getFieldValue(this.uiForm.controls['SecondaryContactNumber']);
        formdata['LanguageCode'] = this.getFieldValue(this.uiForm.controls['LanguageCode']);
        formdata['LanguageDescription'] = this.getFieldValue(this.uiForm.controls['LanguageDescription']);
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
        formdata['ClassType'] = this.getFieldValue(this.uiForm.controls['ClassType']);
        formdata['VehicleRegistration'] = this.getFieldValue(this.uiForm.controls['VehicleRegistration']);
        formdata['PetrolCardNumber'] = this.getFieldValue(this.uiForm.controls['PetrolCardNumber']);
        formdata['DrivingLicenceNumber'] = this.getFieldValue(this.uiForm.controls['DrivingLicenceNumber']);
        formdata['DrivingLicenceExpiryDate'] = this.getFieldValue(this.uiForm.controls['DrivingLicenceExpiryDate'], false, true);
        formdata['DateLeft'] = this.getFieldValue(this.uiForm.controls['DateLeft'], false, true);
        formdata['LeavingReason'] = this.getFieldValue(this.uiForm.controls['LeavingReason']);
        formdata['Occupation'] = this.getFieldValue(this.uiForm.controls['Occupation']);
        formdata['WindowStart01'] = this.getHmsToSeconds(this.uiForm.controls['WindowStart01'].value);
        formdata['WindowEnd01'] = this.getHmsToSeconds(this.uiForm.controls['WindowEnd01'].value);
        formdata['WindowDayInd01'] = this.getFieldValue(this.uiForm.controls['WindowDayInd01'], true);
        formdata['WindowStart02'] = this.getHmsToSeconds(this.uiForm.controls['WindowStart02'].value);
        formdata['WindowEnd02'] = this.getHmsToSeconds(this.uiForm.controls['WindowEnd02'].value);
        formdata['WindowDayInd02'] = this.getFieldValue(this.uiForm.controls['WindowDayInd02'], true);
        formdata['WindowStart03'] = this.getHmsToSeconds(this.uiForm.controls['WindowStart03'].value);
        formdata['WindowEnd03'] = this.getHmsToSeconds(this.uiForm.controls['WindowEnd03'].value);
        formdata['WindowDayInd03'] = this.getFieldValue(this.uiForm.controls['WindowDayInd03'], true);
        formdata['WindowStart04'] = this.getHmsToSeconds(this.uiForm.controls['WindowStart04'].value);
        formdata['WindowEnd04'] = this.getHmsToSeconds(this.uiForm.controls['WindowEnd04'].value);
        formdata['WindowDayInd04'] = this.getFieldValue(this.uiForm.controls['WindowDayInd04'], true);
        formdata['WindowStart05'] = this.getHmsToSeconds(this.uiForm.controls['WindowStart05'].value);
        formdata['WindowEnd05'] = this.getHmsToSeconds(this.uiForm.controls['WindowEnd05'].value);
        formdata['WindowDayInd05'] = this.getFieldValue(this.uiForm.controls['WindowDayInd05'], true);
        formdata['WindowStart06'] = this.getHmsToSeconds(this.uiForm.controls['WindowStart06'].value);
        formdata['WindowEnd06'] = this.getHmsToSeconds(this.uiForm.controls['WindowEnd06'].value);
        formdata['WindowDayInd06'] = this.getFieldValue(this.uiForm.controls['WindowDayInd06'], true);
        formdata['WindowStart07'] = this.getHmsToSeconds(this.uiForm.controls['WindowStart07'].value);
        formdata['WindowEnd07'] = this.getHmsToSeconds(this.uiForm.controls['WindowEnd07'].value);
        formdata['WindowDayInd07'] = this.getFieldValue(this.uiForm.controls['WindowDayInd07'], true);
        formdata['StdHoursPerDay'] = this.getHmsToSeconds(this.uiForm.controls['StdHoursPerDay'].value);
        formdata['PersonalDrivingTime'] = this.getHmsToSeconds(this.uiForm.controls['PersonalDrivingTime'].value);
        formdata['ManpowerPlanning'] = this.getFieldValue(this.uiForm.controls['ManpowerPlanning'], true);
        formdata['MaxOTPerDay'] = this.getHmsToSeconds(this.uiForm.controls['MaxOTPerDay'].value);
        formdata['AvgDrivingWorkDay'] = this.getFieldValue(this.uiForm.controls['AvgDrivingWorkDay']);
        formdata['MaxHoursPerWeek'] = this.getHmsToSeconds(this.uiForm.controls['MaxHoursPerWeek'].value);
        formdata['AverageSickness'] = this.getFieldValue(this.uiForm.controls['AverageSickness']);
        formdata['StandardBreakTime'] = this.getHmsToSeconds(this.uiForm.controls['StandardBreakTime'].value);
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
    };
    EmployeeMaintenanceComponent.prototype.promptConfirm = function (event) {
        if (!this.riMaintenanceCancelEvent) {
            if (this.updateMode && this.actionMode === 2) {
                this.riMaintenance_BeforeSave();
                if (!this.riMaintenanceCancelEvent) {
                    this.updateEmployeeData();
                }
            }
            else if (this.addMode) {
                this.riMaintenance_BeforeSave();
                if (!this.riMaintenanceCancelEvent) {
                    this.addEmployeeData();
                }
            }
            else if (this.updateMode && this.actionMode === 3) {
                if (!this.riMaintenanceCancelEvent) {
                    this.deleteEmployeeData();
                }
            }
        }
    };
    EmployeeMaintenanceComponent.prototype.promptCancel = function (event) {
    };
    EmployeeMaintenanceComponent.prototype.confirmOKCancel = function (event) {
        switch (this.promptMode) {
            case 'btnDefault_onclick':
                this.promptMode = '';
                this.btnDefaultConfirm();
                break;
            default:
                break;
        }
    };
    EmployeeMaintenanceComponent.prototype.validateForm = function () {
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.uiForm.controls[key]) {
                        this.uiForm.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.uiForm.controls) {
            if (this.uiForm.controls[i].enabled) {
                this.uiForm.controls[i].markAsTouched();
            }
            else {
                this.uiForm.controls[i].clearValidators();
            }
        }
        this.uiForm.updateValueAndValidity();
        var formValid = null;
        if (!this.uiForm.enabled) {
            formValid = true;
        }
        else {
            formValid = this.uiForm.valid;
        }
        return formValid;
    };
    EmployeeMaintenanceComponent.prototype.updateEmployeeData = function () {
        var _this = this;
        var formdata = {};
        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.set(this.serviceConstants.Action, '2');
        formdata = this.getFormDataForEmployeeCode();
        formdata['Employee'] = this.storeData ? this.storeData.Employee : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams, formdata).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else if (e['errorMessage']) {
                _this.errorModal.show({ msg: e.errorMessage, title: 'Error' }, false);
            }
            else {
                _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                _this.riMaintenance_AfterSave();
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    EmployeeMaintenanceComponent.prototype.addEmployeeData = function () {
        var _this = this;
        var formdata = {};
        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.set(this.serviceConstants.Action, '1');
        formdata = this.getFormDataForEmployeeCode();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams, formdata).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else if (e['errorMessage']) {
                _this.errorModal.show({ msg: e.errorMessage, title: 'Error' }, false);
            }
            else {
                if (e.EmployeeCode && (e.EmployeeCode !== '')) {
                    _this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                    _this.riMaintenance_AfterSave();
                    _this.riMaintenance_AfterSaveAdd();
                    _this.uiForm.controls['EmployeeCode'].setValue(e.EmployeeCode);
                    var data = { EmployeeCode: _this.uiForm.controls['EmployeeCode'].value };
                    _this.onEmployeeSearchDataReceived(data, false);
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    EmployeeMaintenanceComponent.prototype.deleteEmployeeData = function () {
        var _this = this;
        var formdata = {};
        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.set(this.serviceConstants.Action, '3');
        formdata['EmployeeCode'] = this.uiForm.controls['EmployeeCode'].value;
        formdata['Employee'] = this.storeData ? this.storeData.Employee : '';
        formdata['SCManpowerPlanning'] = this.pageParams.vSCManpowerPlanning || false;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams, formdata).subscribe(function (e) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else if (e['errorMessage']) {
                _this.errorModal.show({ msg: e.errorMessage, title: 'Error' }, false);
            }
            else {
                _this.riMaintenance_AfterDelete();
                _this.deleteMode = false;
                _this.addMode = false;
                _this.searchMode = true;
                _this.updateMode = false;
                for (var key in _this.uiForm.controls) {
                    if (_this.uiForm.controls[key]) {
                        _this.uiForm.controls[key].reset();
                    }
                }
                _this.datepicker.DateOfBirth.value = null;
                _this.datepicker.DateJoined.value = null;
                _this.datepicker.FirstAidReviewDate.value = null;
                _this.datepicker.TabletReloadFromDate.value = null;
                _this.datepicker.DrivingLicenceExpiryDate.value = null;
                _this.datepicker.DateLeft.value = null;
                _this.dropdownConfig.maritalSearch.selected = { id: '', text: '' };
                _this.dropdownConfig.genderSearch.selected = { id: '', text: '' };
                _this.setTranslatedTextForButtons();
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    EmployeeMaintenanceComponent.prototype.onSubmit = function (formdata, valid, event) {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        event.preventDefault();
        this.riMaintenanceCancelEvent = false;
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j;
                if (!this.fieldVisibility[j]) {
                    if (this.uiForm.controls[key]) {
                        this.uiForm.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.uiForm.controls) {
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
                            var obj = document.querySelector('#' + i + ' input[type=text]');
                            if (obj) {
                                if (!obj['value']) {
                                    obj.setAttribute('class', 'form-control ng-dirty ng-invalid ng-touched');
                                    this.fieldRequired[i] = true;
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        for (var i in this.uiForm.controls) {
            if (this.uiForm.controls[i] && this.uiForm.controls[i].invalid) {
                this.selectErrorTab();
            }
        }
        if (this.uiForm.valid) {
            this.promptConfig.forSave.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptModal.show();
        }
    };
    EmployeeMaintenanceComponent.prototype.onCancel = function () {
        event.preventDefault();
        this.riMaintenanceCancelEvent = false;
        this.ellipsisConfig.employeeSearch.autoOpen = false;
        this.ellipsisConfig.employeeSearch.disabled = false;
        this.saveBtn = false;
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.riMaintenance_AfterAbandon();
        if (this.addMode) {
            for (var key in this.uiForm.controls) {
                if (this.uiForm.controls[key]) {
                    this.uiForm.controls[key].reset();
                }
            }
            this.datepicker.DateOfBirth.value = '';
            this.datepicker.DateJoined.value = '';
            this.datepicker.FirstAidReviewDate.value = '';
            this.datepicker.TabletReloadFromDate.value = '';
            this.datepicker.DrivingLicenceExpiryDate.value = '';
            this.datepicker.DateLeft.value = '';
            this.ellipsisConfig.employeeSearch.autoOpen = true;
        }
        else if (this.updateMode) {
            this.riMaintenance_AfterAbandonUpdate();
            for (var key in this.uiForm.controls) {
                if (this.uiForm.controls[key]) {
                    this.uiForm.controls[key].reset();
                }
            }
            this.datepicker.DateOfBirth.value = null;
            this.datepicker.DateJoined.value = null;
            this.datepicker.FirstAidReviewDate.value = '';
            this.datepicker.TabletReloadFromDate.value = '';
            this.datepicker.DrivingLicenceExpiryDate.value = '';
            this.datepicker.DateLeft.value = '';
            this.onUpdateMode(this.storeData);
        }
        this.uiForm.controls['menu'].setValue('');
        this.setTranslatedTextForButtons();
        this.uiForm.updateValueAndValidity();
    };
    EmployeeMaintenanceComponent.prototype.setTranslatedTextForButtons = function () {
        this.uiForm.controls['cmdReload'].setValue(this.translatedMessageList['cmdReload'] || 'Reload To Tablet');
        this.uiForm.controls['cmdGetAddress1'].setValue(this.translatedMessageList['cmdGetAddress1'] || 'Get Address');
        this.uiForm.controls['cmdGeocode'].setValue(this.translatedMessageList['cmdGeocode'] || 'Get Address');
        this.uiForm.controls['cmdCopyAddress'].setValue(this.translatedMessageList['cmdCopyAddress'] || 'Same As Employee');
        this.uiForm.controls['cmdGetAddress2'].setValue(this.translatedMessageList['cmdGetAddress2'] || 'Get Address');
        this.uiForm.controls['btnDefault'].setValue(this.translatedMessageList['btnDefault'] || 'Default from Branch');
    };
    EmployeeMaintenanceComponent.prototype.getFormattedDate = function (dateValue) {
        var returnDate = '';
        if (dateValue) {
            if (window['moment'](dateValue, 'DD/MM/YYYY', true).isValid()) {
                returnDate = this.utils.convertDate(dateValue);
            }
            else {
                returnDate = dateValue;
            }
        }
        else {
            returnDate = '';
        }
        return returnDate;
    };
    EmployeeMaintenanceComponent.prototype.toDateFormat = function (date, format) {
        if (!format) {
            format = 'dd/MM/yyyy';
        }
        var normalized = date.replace(/[^a-zA-Z0-9]/g, '-');
        var normalizedFormat = format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
        var formatItems = normalizedFormat.split('-');
        var dateItems = normalized.split('-');
        var monthIndex = formatItems.indexOf('mm');
        var dayIndex = formatItems.indexOf('dd');
        var yearIndex = formatItems.indexOf('yyyy');
        var hourIndex = formatItems.indexOf('hh');
        var minutesIndex = formatItems.indexOf('ii');
        var secondsIndex = formatItems.indexOf('ss');
        var today = new Date();
        var year = yearIndex > -1 ? dateItems[yearIndex] : today.getFullYear();
        var month = monthIndex > -1 ? dateItems[monthIndex] - 1 : today.getMonth() - 1;
        var day = dayIndex > -1 ? dateItems[dayIndex] : today.getDate();
        var hour = hourIndex > -1 ? dateItems[hourIndex] : today.getHours();
        var minute = minutesIndex > -1 ? dateItems[minutesIndex] : today.getMinutes();
        var second = secondsIndex > -1 ? dateItems[secondsIndex] : today.getSeconds();
        return new Date(year, month, day, hour, minute, second);
    };
    ;
    EmployeeMaintenanceComponent.prototype.validateTimeHhMm = function (c) {
        var s = c.value;
        if (s) {
            var t = s.split(':');
            return (/^\d\d:\d\d$/.test(s) &&
                ((t[0] >= 0 && t[0] < 25) &&
                    (t[1] >= 0 && t[1] < 60) ||
                    (t[0] === 24 && t[1] === 0))) ? null : {
                validateTimeHhMm: {
                    valid: false
                }
            };
        }
        return {
            validateTimeHhMm: {
                valid: false
            }
        };
    };
    EmployeeMaintenanceComponent.prototype.validateTimeHhMmSs = function (c) {
        var s = c.value;
        if (s) {
            var t = s.split(':');
            return (/^\d\d:\d\d:\d\d$/.test(s) &&
                (t[0] >= 0 && t[0] < 25) &&
                (t[1] >= 0 && t[1] < 60) &&
                (t[2] >= 0 && t[2] < 60) &&
                (t[0] === 24 && t[1] === 0)) ? null : {
                validateTimeHhMmSs: {
                    valid: false
                }
            };
        }
        return {
            validateTimeHhMmSs: {
                valid: false
            }
        };
    };
    EmployeeMaintenanceComponent.prototype.focusToFirstTab = function (tabId) {
        if (tabId === void 0) { tabId = 'grdDetails'; }
        var element = document.querySelector('.nav-tabs li#' + tabId + ' a');
        if (element) {
            var click = new Event('click', { bubbles: true });
            this.renderer.invokeElementMethod(element, 'dispatchEvent', [click]);
        }
    };
    EmployeeMaintenanceComponent.prototype.selectErrorTab = function () {
        var i = 0;
        for (var tab in this.tabList) {
            if (tab) {
                i++;
                var element = document.querySelectorAll('div#' + this.tabList[tab]['id'] + ' input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched');
                if (element && element.length > 0) {
                    this.focusToFirstTab(this.tabList[tab]['id']);
                    break;
                }
            }
        }
    };
    EmployeeMaintenanceComponent.prototype.onSaveFocus = function (e) {
        var _this = this;
        var nextTab = 0;
        var code = (e.keyCode ? e.keyCode : e.which);
        var elemList = document.querySelectorAll('.screen-body .nav-tabs li a');
        var currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('.screen-body .nav-tabs li a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            var click_1 = new MouseEvent('click', { bubbles: true });
            nextTab = currentSelectedIndex + 1;
            setTimeout(function () {
                _this.renderer.invokeElementMethod(elemList[nextTab], 'dispatchEvent', [click_1]);
                var e1 = document.querySelector('.screen-body .tab-content .tab-pane:nth-child(' + nextTab + ') .ui-select-toggle, .screen-body .tab-content .tab-pane:nth-child(' + nextTab + ') input:not([disabled]), .screen-body .tab-content .tab-pane:nth-child(' + nextTab + ') select:not([disabled])');
                if (e1) {
                    e1['focus']();
                }
            }, 0);
        }
        return;
    };
    EmployeeMaintenanceComponent.prototype.setFocusToTabElement = function () {
        var _this = this;
        setTimeout(function () {
            var tabsUlList = document.querySelectorAll('ul.nav-tabs li');
            if (tabsUlList) {
                var tabsElemList = document.querySelectorAll('.tab-content .tab-pane');
                for (var i = 0; i < tabsElemList.length; i++) {
                    if (_this.utils.hasClass(tabsElemList[i], 'active')) {
                        var elementListQuery = '.ui-select-toggle , input:not([disabled]) , select:not([disabled]), textarea:not([disabled])';
                        var tabItemList = tabsElemList[i].querySelectorAll(elementListQuery);
                        var _loop_2 = function(l) {
                            var el = tabItemList[l];
                            if (el) {
                                if (el.getAttribute('type') && el.getAttribute('type').toLowerCase() !== 'hidden') {
                                    setTimeout(function () {
                                        el['focus']();
                                    }, 0);
                                    return "break";
                                }
                            }
                        };
                        for (var l = 0; l < tabItemList.length; l++) {
                            var state_2 = _loop_2(l);
                            if (state_2 === "break") break;
                        }
                    }
                }
            }
        }, 100);
    };
    EmployeeMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBEmployeeMaintenance.html'
                },] },
    ];
    EmployeeMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: SpeedScript, },
        { type: Renderer, },
    ];
    EmployeeMaintenanceComponent.propDecorators = {
        'formControlEmployeeCode': [{ type: ViewChild, args: ['EmployeeCode',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'promptOKCancelModal': [{ type: ViewChild, args: ['promptOKCancelModal',] },],
        'employeeSearchEllipsis': [{ type: ViewChild, args: ['employeeSearchEllipsis',] },],
        'occupationSearchEllipsis': [{ type: ViewChild, args: ['occupationSearchEllipsis',] },],
        'supervisorEmployeeEllipsis': [{ type: ViewChild, args: ['supervisorEmployeeEllipsis',] },],
    };
    return EmployeeMaintenanceComponent;
}(BaseComponent));
