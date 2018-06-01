import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';

import { Observable } from 'rxjs/Rx';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { EmployeeSearchComponent } from '../search/iCABSBEmployeeSearch';
import { GlobalizeService } from './../../../shared/services/globalize.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { AppModuleRoutes, BillToCashModuleRoutes, CCMModuleRoutes, InternalGridSearchApplicationModuleRoutes, InternalMaintenanceServiceModuleRoutes, InternalMaintenanceSalesModuleRoutes, ContractManagementModuleRoutes, ProspectToContractModuleRoutes } from './../../base/PageRoutes';
@Component({
    templateUrl: 'iCABSCMWorkOrderMaintenance.html',
    styles: [`
      textarea {
        min-height: 240px;
      }
      `]
})
export class WorkOrderMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    private formRawClone: Object = {};
    private paramsClone: Object = {};
    private fieldVisibilityClone: Object = {};
    private fieldRequiredClone: Object = {};
    private checkRouteAway: boolean = true;
    private internalVariables: Object = {
        vBusinessCode: null,
        glProductSaleInUse: null,
        cQuoteNumberWarningMessage: null,
        cQuoteValueWarningMessage: null,
        lProductSaleInUse: null,
        lResultTabIsVisible: null,
        lEmployeeTabIsVisible: null,
        lHistoryTabIsVisible: null,
        UpdatingRecord: true,
        SCMaxQuotesNumber: null,
        SCMaxQuotesValue: null,
        cQuoteNumberWarning: null,
        cQuoteValueWarning: null,
        lRefreshWorkOrderGrid: true,
        cLastMenuOption: '',
        iResultTabNumber: 0,
        iHistoryTabNumber: 0,
        cWOStatusCodeList: null,
        cWOStatusDescList: null,
        amendQuoteText: '',
        btnAvailibility: '',
        btnAttendees: ''
    };
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('gridPagination') public gridPagination: PaginationComponent;
    @ViewChild('ProspectNumber') public prospectNumber: ElementRef;
    @ViewChild('ContactName') public contactName: ElementRef;
    @ViewChild('EstimatedContractQuotes') public estimatedContractQuotes;
    @ViewChild('riGrid') public riGrid: GridAdvancedComponent;
    @ViewChild('riTab') public riTab: ElementRef;
    public pageId: string = '';
    public promptTitle: string = '';
    public promptContent: string = '';
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showHeader: boolean = true;
    public isPaginationHidden: boolean = true;
    public requestParams: Object = {
        operation: 'ContactManagement/iCABSCMWorkOrderMaintenance',
        module: 'work-order',
        method: 'ccm/maintenance'
    };
    public queryParams: any;
    public search: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public querySysChar: URLSearchParams = new URLSearchParams();
    public controls: any = [
        { name: 'WONumber', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ContactTypeDesc', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ContactTypeDetailDesc', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'EmployeeCodeCreate', readonly: false, disabled: true, required: true, commonValidator: true },
        { name: 'EmployeeNameCreate', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'RedirectInd', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeCodeRedirect', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeNameRedirect', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'WODate', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate, commonValidator: true },
        { name: 'WOToDate', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate, commonValidator: true },
        { name: 'AllDayInd', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'WOStartTime', readonly: false, disabled: false, required: true, type: MntConst.eTypeTime, commonValidator: true },
        { name: 'WOEndTime', readonly: false, disabled: false, required: true, type: MntConst.eTypeTime, commonValidator: true },
        { name: 'AccountNumber', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AccountName', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ContractNumber', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ContractName', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'PremiseNumber', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'PremiseName', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ProductCode', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ProductDesc', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ProspectNumber', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ProspectName', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ProspectTypeDesc', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressName', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressContactName', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressLine1', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressContactPosn', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressLine2', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressLine3', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressLine4', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressContactPhone', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressLine5', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressContactMobile', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressPostcode', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'AddressContactEmail', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'WOInitialNotes', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'WOInitialEmployeeCode', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'WOInitialEmployeeName', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'WOInitialCreateDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate, commonValidator: true },
        { name: 'WOInitialCreateTime', readonly: false, disabled: true, required: false, type: MntConst.eTypeTime, commonValidator: true },
        { name: 'WOInitialDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate, commonValidator: true },
        { name: 'WOInitialStartTime', readonly: false, disabled: true, required: false, type: MntConst.eTypeTime, commonValidator: true },
        { name: 'WOInitialEndTime', readonly: false, disabled: true, required: false, type: MntConst.eTypeTime, commonValidator: true },
        { name: 'EmployeeCode01', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName01', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail01', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EmployeeCode02', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName02', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail02', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EmployeeCode03', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName03', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail03', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EmployeeCode04', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName04', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail04', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EmployeeCode05', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName05', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail05', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EmployeeCode06', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName06', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail06', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EmployeeCode07', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName07', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail07', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EmployeeCode08', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName08', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail08', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EmployeeCode09', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName09', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail09', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EmployeeCode10', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeName10', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdCheckAvail10', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'CmdClearAttend', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'ContactName', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'ContactPosition', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'ContactTelephone', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'ContactMobile', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'ContactEmail', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'WOStatusCodeSelect', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'QuotedInd', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'WOTypeCodeSelect', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'ToWOTypeCodeSelect', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'ContactMediumCodeSelect', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'AddressCodeSelect', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'WOResultNotes', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EmployeeCode', readonly: false, disabled: false, required: true, commonValidator: true },
        { name: 'EmployeeName', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'CmdReassignTo', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'ReassignEmployeeCode', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'ReassignEmployeeName', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'WOResultCreateAppt', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'WOResultDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate, commonValidator: true },
        { name: 'WOResultAllDayInd', value: false, readonly: false, disabled: false, required: false },
        { name: 'WOResultStartTime', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime, commonValidator: true },
        { name: 'WOResultEndTime', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime, commonValidator: true },
        { name: 'CmdCheckResultAvail', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true },
        { name: 'EstimatedContractQuotes', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EstimatedJobQuotes', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EstimatedProductSaleQuotes', readonly: false, disabled: false, required: false, commonValidator: true },
        { name: 'EstimatedTotalQuotes', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'EstimatedContractValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2, commonValidator: true },
        { name: 'EstimatedJobValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2, commonValidator: true },
        { name: 'EstimatedProductSaleValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2, commonValidator: true },
        { name: 'EstimatedTotalValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeDecimal2, commonValidator: true },
        { name: 'SurveyCompleteInd', readonly: false, disabled: false, required: false },
        { name: 'MenuCodeList', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'MenuDescList', readonly: false, disabled: true, required: false, commonValidator: true },
        { name: 'Menu', readonly: false, disabled: false, required: false, commonValidator: true, exclude: true }


    ];
    public pageParams: Object = {
        BusinessCode: '',
        RelatedWONumber: '',
        WOTypeCode: '',
        URL: '',
        ToWOTypeCode: '',
        WOStatusInit: '',
        WOTypeProspectRequired: '',
        WOTypeAutoClose: '',
        WOTypeAdditionalEmpl: '',
        WOTypeDefaultAllDayInd: '',
        WOTypeContactRedirect: '',
        WOTypeDefaultCode: '',
        WOStatusCode: '',
        ContactMediumCode: '',
        PassWONumber: '',
        PassCustomerContactNumber: '',
        CustomerContactNumber: '',
        ForceRefresh: '',
        WOStatusDefault: '',
        DefaultStartTime: '00:00',
        DefaultEndTime: '',
        CanAmend: '',
        CanDelete: '',
        AvailEmployeeCode: '',
        AvailEmployeeName: '',
        AvailDiaryDate: '',
        SaveProspectNumber: '',
        ContractTypeCode: '',
        DiaryDate: '',
        DiaryProspectNumber: '',
        ContactMediumDefault: '',
        ChangeEmployeeInd: '',
        DateIsMandatoryInd: '',
        AmendProspectStatusInd: '',
        AllowSurveyCompleteInd: '',
        WOStatusQuoteAccepted: '',
        WOStatusQuoteCreated: '',
        WOStatusQuoteRejected: '',
        AllowFullUpdateRights: '',
        MenuCodeList: '',
        MenuDescList: '',
        WindowClosingName: '',
        AddressCodeList: '',
        AddressDescList: '',
        AddressCodeDefault: '',
        AccountAddressName: '',
        AccountAddressLine1: '',
        AccountAddressLine2: '',
        AccountAddressLine3: '',
        AccountAddressLine4: '',
        AccountAddressLine5: '',
        AccountAddressPostcode: '',
        AccountAddressContactName: '',
        AccountAddressContactPosn: '',
        AccountAddressContactPhone: '',
        AccountAddressContactMobile: '',
        AccountAddressContactFax: '',
        AccountAddressContactEmail: '',
        PremiseAddressName: '',
        PremiseAddressLine1: '',
        PremiseAddressLine2: '',
        PremiseAddressLine3: '',
        PremiseAddressLine4: '',
        PremiseAddressLine5: '',
        PremiseAddressPostcode: '',
        PremiseAddressContactName: '',
        PremiseAddressContactPosn: '',
        PremiseAddressContactPhone: '',
        PremiseAddressContactMobile: '',
        PremiseAddressContactFax: '',
        PremiseAddressContactEmail: '',
        ProAcctAddressName: '',
        ProAcctAddressLine1: '',
        ProAcctAddressLine2: '',
        ProAcctAddressLine3: '',
        ProAcctAddressLine4: '',
        ProAcctAddressLine5: '',
        ProAcctAddressPostcode: '',
        ProAcctAddressContactName: '',
        ProAcctAddressContactPosn: '',
        ProAcctAddressContactPhone: '',
        ProAcctAddressContactMobile: '',
        ProAcctAddressContactFax: '',
        ProAcctAddressContactEmail: '',
        ProPremAddressName: '',
        ProPremAddressLine1: '',
        ProPremAddressLine2: '',
        ProPremAddressLine3: '',
        ProPremAddressLine4: '',
        ProPremAddressLine5: '',
        ProPremAddressPostcode: '',
        ProPremAddressContactName: '',
        ProPremAddressContactPosn: '',
        ProPremAddressContactPhone: '',
        ProPremAddressContactMobile: '',
        ProPremAddressContactFax: '',
        ProPremAddressContactEmail: '',
        WOStatusCodeList: '',
        WOStatusDescList: '',
        TelesalesOrderNumber: '',
        TelesalesName: '',
        TelesalesInd: ''
    };
    public fieldVisibility: Object = {
        contactTypeDesc: false,
        EmployeeRedirect: false,
        ContactTypeDetails: true,
        spanSurveyComplete: true,
        grdAddress: false,
        grdInitial: false,
        WOInitialLine1: false,
        WOInitialLine2: false,
        WOInitialLine3: false,
        WOInitialLine4: false,
        AddressLine3: false,
        grdHistory: false,
        grdAttendees: false,
        grdResult: false,
        QuotedInd: false,
        ResultEmployeeDetails: false,
        ReassignEmployee: false,
        ResultAppointmentDetails: false,
        QuoteNumberHeadings: false,
        ProductSaleHeading: false,
        QuoteNumberDetails: false,
        BtnProceedTask: true,
        ToWOTypeCodeSelect: true,
        EstimatedProductSaleQuotes: false,
        QuoteValueDetails: false,
        EstimatedProductSaleValue: false,
        errorMessageDesc: false,
        save: true,
        delete: true,
        cancel: true

    };
    public fieldRequired: Object = {
        WODate: true,
        WOToDate: true,
        WOStartTime: true,
        WOEndTime: true,
        EmployeeCodeCreate: true,
        EmployeeCode: true,
        ContactName: false,
        ContactPosition: false,
        ContactTelephone: false,
        ContactMobile: false,
        ContactEmail: false,
        EstimatedContractValue: false,
        EstimatedJobValue: false,
        EstimatedProductSaleValue: false,
        EstimatedContractQuotes: false,
        EstimatedJobQuotes: false,
        EstimatedProductSaleQuotes: false
    };
    public syschars: Object = {
        vSCMaxQuotesNumberInd: null,
        vSCMaxQuotesNumber: null,
        vSCMaxQuotesValueInd: null,
        vSCMaxQuotesValue: null
    };
    public modalConfig: Object = {
        backdrop: 'static',
        keyboard: true
    };
    public uiDisplay: Object = {
        tab: {
            tab1: { visible: false, active: true, error: false },
            tab2: { visible: false, active: false, error: false },
            tab3: { visible: false, active: false, error: false },
            tab4: { visible: false, active: false, error: false },
            tab5: { visible: false, active: false, error: false }
        }
    };
    public ellipsis: Object = {
        employeeCodeCreate: {
            inputParams: {
                parentMode: 'WorkOrderCreateEmployee',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: true,
            contentComponent: EmployeeSearchComponent
        },
        employeeCodeRedirect: {
            inputParams: {
                parentMode: 'WorkOrderRedirectEmployee',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        reassignEmployeeCode: {
            inputParams: {
                parentMode: '',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: true,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode: {
            inputParams: {
                parentMode: 'WorkOrderPrimaryEmployee',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode01: {
            inputParams: {
                parentMode: 'WorkOrderAttendee01',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode02: {
            inputParams: {
                parentMode: 'WorkOrderAttendee02',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode03: {
            inputParams: {
                parentMode: 'WorkOrderAttendee03',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode04: {
            inputParams: {
                parentMode: 'WorkOrderAttendee04',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode05: {
            inputParams: {
                parentMode: 'WorkOrderAttendee05',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode06: {
            inputParams: {
                parentMode: 'WorkOrderAttendee06',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode07: {
            inputParams: {
                parentMode: 'WorkOrderAttendee07',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode08: {
            inputParams: {
                parentMode: 'WorkOrderAttendee08',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode09: {
            inputParams: {
                parentMode: 'WorkOrderAttendee09',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        },
        employeeCode10: {
            inputParams: {
                parentMode: 'WorkOrderAttendee10',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEllipsisDisabled: false,
            contentComponent: EmployeeSearchComponent
        }
    };
    public dropdownList: Object = {
        AddressCodeSelect: [
            {
                value: '',
                desc: ''
            }
        ],
        WOTypeCodeSelect: [
            {
                value: '',
                desc: ''
            }
        ],
        WOStatusCodeSelect: [
            {
                value: '',
                desc: ''
            }
        ],
        ToWOTypeCodeSelect: [
            {
                value: '',
                desc: ''
            }
        ],
        ContactMediumCodeSelect: [
            {
                value: '',
                desc: ''
            }
        ]
    };
    public gridProperties: Object = {
        maxColumns: 8,
        itemsPerPage: 10,
        currentPage: 1,
        totalRecords: 0,
        paginationCurrentPage: 1,
        headerClicked: '',
        sortType: 'Descending',
        inputParams: {}
    };
    public mode: Object = {
        addMode: false,
        updateMode: true
    };
    public menuList: Array<Object> = [];
    constructor(injector: Injector, public globalize: GlobalizeService, private renderer: Renderer) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMWORKORDERMAINTENANCE;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Work Order Maintenance';
        this.utils.setTitle('Work Order Maintenance');
        this.internalVariables['vBusinessCode'] = this.utils.getBusinessCode();
        this.queryParams = this.riExchange.getRouterParams();
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.fetchTranslationContent();
        this.parentMode = this.riExchange.getParentMode();
        this.pageParams['AllowFullUpdateRights'] = this.riExchange.getParentHTMLValue('AllowFullUpdateRights');
        if (this.parentMode === 'DiaryDayNewAppointment' || this.parentMode === 'WorkOrderGridAdd') {
            this.internalVariables['UpdatingRecord'] = false;
        }
        if (this.parentMode === 'DiaryDayNewAppointment' || this.parentMode === 'WorkOrderGridAdd' || this.parentMode === 'CallCentreSearchAdd') {
            this.setControlValue('WOStartTime', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
        }
        this.cloneFormAndParams();
    }

    ngAfterViewInit(): void {
        if (this.isReturningFlag) {
            this.uiForm.setValue(this.formRawClone);
            this.pageParams = JSON.parse(JSON.stringify(this.paramsClone));
            this.fieldVisibility = JSON.parse(JSON.stringify(this.fieldVisibilityClone));
            this.fieldRequired = JSON.parse(JSON.stringify(this.fieldRequiredClone));
        }
        this.postInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    /**
     * This function is called when initialisation completes, it loads default data and process modes
     */
    private postInit(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.loadDefaults(true).subscribe((data) => {
            this.loadDefaultsInternal(data);
            if (this.parentMode === 'DiaryDayNewAppointment' || this.parentMode === 'WorkOrderGridAdd' || this.parentMode === 'CallCentreSearchAdd') {
                this.setMode(false, true);
                this.setButtonsVisibility(true, true, false);
                this.riMaintenanceBeforeAdd();
                this.uiForm.controls['Menu'].disable();
                this.uiForm.controls['WOTypeCodeSelect'].enable();
                this.uiForm.controls['WOStatusCodeSelect'].enable();
                this.uiForm.controls['ToWOTypeCodeSelect'].enable();
                this.checkAvailSensitive(false);
                this.uiForm.controls['CmdClearAttend'].enable();
                this.setControlValue('WODate', this.riExchange.getParentHTMLValue('PassDiaryDate'));
                this.setControlValue('WOToDate', this.riExchange.getParentHTMLValue('PassDiaryDate'));
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('EmployeeName', this.riExchange.getParentHTMLValue('PassEmployeeName'));
                this.setControlValue('EmployeeCodeCreate', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('EmployeeNameCreate', this.riExchange.getParentHTMLValue('PassEmployeeName'));
                this.setControlValue('EmployeeCodeRedirect', this.riExchange.getParentHTMLValue('PassEmployeeCode'));
                this.setControlValue('EmployeeNameRedirect', this.riExchange.getParentHTMLValue('PassEmployeeName'));
                this.setControlValue('WOResultDate', this.riExchange.getParentHTMLValue('PassDiaryDate'));
                this.setControlValue('WOResultStartTime', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                this.setControlValue('WOResultEndTime', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('DiaryProspectNumber'));
                this.pageParams['SaveProspectNumber'] = this.riExchange.getParentHTMLValue('DiaryProspectNumber');
                this.pageParams['DefaultStartTime'] = this.globalize.formatTimeToLocaleFormat(this.getControlValue('WOStartTime'));
            }
            if (this.mode['addMode']) {
                this.uiForm.controls['EmployeeCodeCreate'].enable();
                this.ellipsis['employeeCodeCreate'].isEllipsisDisabled = false;
                this.prospectNumberOnChange(true).subscribe((data) => {
                    this.prospectNumberOnChangeInternal(data);
                    this.processModes();
                }, (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
                });
            } else {
                this.uiForm.controls['EmployeeCodeCreate'].disable();
                this.ellipsis['employeeCodeCreate'].isEllipsisDisabled = true;
                this.processModes();
            }
        }, (error) => {
            this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
        });
    }
    /**
     * This function checks the parent mode and do the neccessary processing followed by other request triggers
     */
    private processModes(): void {
        this.buildTab();
        if (this.parentMode === 'DiaryDayNewAppointment') {
            this.setControlValue('WOTypeCodeSelect', this.pageParams['WOTypeDefaultCode']);
        }
        if (this.parentMode === 'DiaryDayNewAppointment' || this.parentMode === 'WorkOrderGridAdd' || this.parentMode === 'CallCentreSearchAdd') {
            this.setControlValue('WOStatusCodeSelect', this.pageParams['WOStatusDefault']);
            this.setControlValue('ContactMediumCodeSelect', this.pageParams['ContactMediumDefault']);
            this.woStatusCodeSelectOnChange();
            this.woTypeCodeSelectOnChange();
            this.setControlValue('WOStartTime', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
            this.setControlValue('WOEndTime', this.pageParams['DefaultEndTime']);
            this.pageParams['DefaultStartTime'] = this.globalize.formatTimeToLocaleFormat(this.getControlValue('WOStartTime'));
            this.pageParams['DefaultEndTime'] = this.getControlValue('WOEndTime');;
        }
        if (this.parentMode === 'CallCentreSearch' || this.parentMode === 'WorkOrderReview' || this.parentMode === 'WorkOrderReviewActions' || this.parentMode === 'TicketMaintenance' || this.parentMode === 'WorkOrderMaintenance') {
            if (this.parentMode === 'WorkOrderMaintenance' || this.parentMode === 'WorkOrderReview' || this.parentMode === 'WorkOrderReviewActions') {
                this.pageParams['PassWONumber'] = this.riExchange.getParentHTMLValue('RelatedWONumber');
            } else {
                this.pageParams['PassWONumber'] = this.riExchange.getParentHTMLValue('WONumber');
            }
            this.setControlValue('WONumber', this.pageParams['PassWONumber']);
            this.uiForm.controls['WOTypeCodeSelect'].disable();
            this.uiForm.controls['WOStatusCodeSelect'].disable();
            this.uiForm.controls['ToWOTypeCodeSelect'].disable();
            this.uiForm.controls['CmdClearAttend'].disable();
            this.checkAvailSensitive(true);
        }

        if (this.parentMode === 'ActivityReport') {
            this.pageParams['PassWONumber'] = this.riExchange.GetParentHTMLInputElementAttribute('BusinessCode', 'WorkOrderNumber') || this.riExchange.getParentHTMLValue('WorkOrderNumber');
            this.setControlValue('WONumber', this.pageParams['PassWONumber']);
            this.uiForm.controls['WOTypeCodeSelect'].disable();
            this.uiForm.controls['WOStatusCodeSelect'].disable();
            this.uiForm.controls['ToWOTypeCodeSelect'].disable();
            this.uiForm.controls['CmdClearAttend'].disable();
            this.checkAvailSensitive(true);
        }

        if (this.parentMode === 'DiaryAmendAppointment' || this.parentMode === 'WorkOrderGrid' || this.parentMode === 'PipelineGrid' || this.parentMode === 'PipelineQuoteGrid' || this.parentMode === 'PipelineQuoteGridSubmit' || this.parentMode === 'PipelineQuoteGridNoQuotes' || this.parentMode === 'QuoteStatusMaintenance' || this.parentMode === 'WorkOrderGrid') {
            this.pageParams['PassWONumber'] = this.riExchange.getParentHTMLValue('PassWONumber');
            this.setControlValue('WONumber', this.pageParams['PassWONumber']);
            this.uiForm.controls['WOTypeCodeSelect'].disable();
            this.uiForm.controls['WOStatusCodeSelect'].disable();
            this.uiForm.controls['ToWOTypeCodeSelect'].disable();
            this.checkAvailSensitive(true);
            this.uiForm.controls['CmdClearAttend'].disable();
        }

        if (this.parentMode === 'PipelineGrid' || this.parentMode === 'PipelineQuoteGrid' || this.parentMode === 'PipelineQuoteGridSubmit' || this.parentMode === 'PipelineQuoteGridNoQuotes' || this.parentMode === 'QuoteStatusMaintenance') {
            this.renderTab(2);
        }

        if (this.parentMode === 'WorkOrderReviewActions') {
            if (this.internalVariables['iHistoryTabNumber'] !== 0) {
                this.renderTab(3);
            }
        }
        this.uiForm.controls['CmdReassignTo'].disable();
        this.triggerRequests();
    }
    /**
     * Service request to get default data
     */
    private loadDefaults(returnSubscription: boolean): any {
        let formdata: Object = {
            DefaultStartTime: this.globalize.formatTimeToLocaleFormat(this.getControlValue('WOStartTime')),
            CustomerContactNumber: this.pageParams['CustomerContactNumber'],
            ProspectNumber: this.getControlValue('ProspectNumber')
        };
        if (returnSubscription) {
            return this.workOrderPost('GetDefaults', {}, formdata);
        } else {
            this.workOrderPost('GetDefaults', {}, formdata).subscribe((data) => {
                this.loadDefaultsInternal(data);
            }, (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            });
        }
    }
    /**
     * This function processes the default data recieved from connector
     * @param data
     */
    private loadDefaultsInternal(data: Object): void {
        if (data['status'] === GlobalConstant.Configuration.Failure) {
            this.modalAdvService.emitError(new ICabsModalVO(data['oResponse']));
        } else {
            if (data['hasError']) {
                this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
            } else {
                this.setControlValue('ContactTypeDesc', data['ContactTypeDesc']);
                this.setControlValue('ContactTypeDetailDesc', data['ContactTypeDetailDesc']);
                this.setControlValue('ProspectNumber', data['ProspectNumber']);
                this.pageParams['CustomerContactNumber'] = data['CustomerContactNumber'];
                this.pageParams['DefaultEndTime'] = data['DefaultEndTime'];
                this.pageParams['WOTypeProspectRequired'] = data['WOTypeProspectRequired'];
                this.pageParams['WOTypeAutoClose'] = data['WOTypeAutoClose'];
                this.pageParams['WOTypeAdditionalEmpl'] = data['WOTypeAdditionalEmpl'];
                this.pageParams['WOTypeDefaultAllDayInd'] = data['WOTypeDefaultAllDayInd'];
                this.pageParams['WOTypeContactRedirect'] = data['WOTypeContactRedirect'];
                this.pageParams['WOTypeDefaultCode'] = data['WOTypeDefaultCode'];
                this.pageParams['WOStatusDefault'] = data['WOStatusDefault'];
                this.pageParams['WOStatusQuoteAccepted'] = data['WOStatusQuoteAccepted'];
                this.pageParams['WOStatusQuoteCreated'] = data['WOStatusQuoteCreated'];
                this.pageParams['WOStatusQuoteRejected'] = data['WOStatusQuoteRejected'];
                this.pageParams['ContactMediumDefault'] = data['ContactMediumDefault'];
                this.internalVariables['cWOStatusCodeList'] = data['WOStatusCodeList'];
                this.internalVariables['cWOStatusDescList'] = data['WOStatusDescList'];
                this.populateWOStatusCodeSelect();

                let valArray, descArray, valArrayLength, woTypeCodeSelectList = [], contactMediumCodeSelectList = [];
                data['WOTypeCodeList'] = !this.utils.isFalsy(data['WOTypeCodeList']) ? data['WOTypeCodeList'] : '';
                data['WOTypeDescList'] = !this.utils.isFalsy(data['WOTypeDescList']) ? data['WOTypeDescList'] : '';
                valArray = data['WOTypeCodeList'].split(String.fromCharCode(10));
                descArray = data['WOTypeDescList'].split(String.fromCharCode(10));
                valArrayLength = valArray.length;
                for (let i = 0; i < valArrayLength; i++) {
                    woTypeCodeSelectList.push({
                        value: valArray[i],
                        desc: descArray[i]
                    });
                }
                this.dropdownList['WOTypeCodeSelect'] = woTypeCodeSelectList;
                data['ContactMediumCodeList'] = !this.utils.isFalsy(data['ContactMediumCodeList']) ? data['ContactMediumCodeList'] : '';
                data['ContactMediumDescList'] = !this.utils.isFalsy(data['ContactMediumDescList']) ? data['ContactMediumDescList'] : '';
                valArray = data['ContactMediumCodeList'].split(String.fromCharCode(10));
                descArray = data['ContactMediumDescList'].split(String.fromCharCode(10));
                valArrayLength = valArray.length;
                for (let i = 0; i < valArrayLength; i++) {
                    contactMediumCodeSelectList.push({
                        value: valArray[i],
                        desc: descArray[i]
                    });
                }
                this.dropdownList['ContactMediumCodeSelect'] = contactMediumCodeSelectList;
            }
        }
    }
    /**
     * This function fetches WONumber data, syschar, look-up and error-messages from connector and does processing on the data recieved
     */
    private triggerRequests(): void {
        let lookupdata: Array<any> = [
            {
                'table': 'ProductExpense',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractTypeCode': 'P' },
                'fields': ['ContractTypeCode']
            }
        ];
        let observableBatch: Array<any> = [];
        let observableErrorBatch: Array<any> = [];
        observableBatch.push(this.lookUpRecord(lookupdata, 1));
        observableBatch.push(this.triggerFetchSysChar());
        if (this.getControlValue('WONumber')) {
            observableBatch.push(this.workOrderGet('', { WONumber: this.getControlValue('WONumber'), action: '0' }));
        }
        observableErrorBatch.push(this.httpService.riGetErrorMessage(2822, this.utils.getCountryCode(), this.utils.getBusinessCode()));
        observableErrorBatch.push(this.httpService.riGetErrorMessage(2823, this.utils.getCountryCode(), this.utils.getBusinessCode()));
        Observable.forkJoin(
            ...observableBatch
        ).subscribe((data: any) => {
            if (data[0]['results'] && data[0]['results'].length > 0 && data[0]['results'][0].length > 0) {
                this.internalVariables['glProductSaleInUse'] = true;
            } else {
                this.internalVariables['glProductSaleInUse'] = false;
            }
            this.internalVariables['lProductSaleInUse'] = this.internalVariables['glProductSaleInUse'];
            if (this.internalVariables['lProductSaleInUse']) {
                this.fieldVisibility['ProductSaleHeading'] = true;
                this.fieldVisibility['EstimatedProductSaleQuotes'] = true;
                this.fieldVisibility['EstimatedProductSaleValue'] = true;
            }
            if (data[1].errorMessage || data[1].fullError) {
                this.modalAdvService.emitError(new ICabsModalVO(ErrorConstant.Message.SystemCharacteristicsFetchError));
            } else {
                if (data[1].records && data[1].records.length > 0) {
                    this.syschars['vSCMaxQuotesNumberInd'] = data[1].records[0].Required;
                    this.syschars['vSCMaxQuotesNumber'] = data[1].records[0].Integer;
                    this.syschars['vSCMaxQuotesValueInd'] = data[1].records[1].Required;
                    this.syschars['vSCMaxQuotesValue'] = data[1].records[1].Integer;
                }
            }
            if (this.syschars['vSCMaxQuotesNumber'] === '?' || !this.syschars['vSCMaxQuotesNumberInd']) {
                this.syschars['vSCMaxQuotesNumber'] = 0;
            }
            if (this.syschars['vSCMaxQuotesValue'] === '?' || !this.syschars['vSCMaxQuotesValueInd']) {
                this.syschars['vSCMaxQuotesValue'] = 0;
            }
            this.syschars['vSCMaxQuotesNumber'] = !this.utils.isFalsy(this.syschars['vSCMaxQuotesNumber']) ? this.syschars['vSCMaxQuotesNumber'] : '';
            this.syschars['vSCMaxQuotesValue'] = !this.utils.isFalsy(this.syschars['vSCMaxQuotesValue']) ? this.syschars['vSCMaxQuotesValue'] : '';
            this.internalVariables['SCMaxQuotesNumber'] = this.syschars['vSCMaxQuotesNumber'];
            this.internalVariables['SCMaxQuotesValue'] = this.syschars['vSCMaxQuotesValue'];
            this.populateFormAndParams(data[2]);
            if (this.mode['updateMode']) {
                this.riMaintenanceAfterFetch(true).subscribe((data) => {
                    this.riMaintenanceAfterFetchInternal(data);
                    if (this.parentMode === 'CallCentreSearch' || this.parentMode === 'WorkOrderReview' || this.parentMode === 'WorkOrderReviewActions' || this.parentMode === 'TicketMaintenance' || this.parentMode === 'WorkOrderMaintenance') {
                        this.woTypeCodeSelectOnChange();
                    }

                    if (this.parentMode === 'ActivityReport') {
                        this.woTypeCodeSelectOnChange();
                    }

                    if (this.parentMode === 'DiaryAmendAppointment' || this.parentMode === 'WorkOrderGrid' || this.parentMode === 'PipelineGrid' || this.parentMode === 'PipelineQuoteGrid' || this.parentMode === 'PipelineQuoteGridSubmit' || this.parentMode === 'PipelineQuoteGridNoQuotes' || this.parentMode === 'QuoteStatusMaintenance') {
                        this.woTypeCodeSelectOnChange();
                    }
                    if ((this.pageParams['CanAmend'] === true || (this.pageParams['CanAmend'] && this.pageParams['CanAmend'].toString().toUpperCase() === GlobalConstant.Configuration.Yes))) {
                        this.riMaintenanceBeforeUpdate();
                    }
                    if (this.parentMode === 'QuoteStatusMaintenance') {
                        this.setControlValue('WOStatusCodeSelect', this.pageParams['WOStatusQuoteRejected']);
                        this.woStatusCodeSelectOnChange();
                    }

                    if (this.parentMode === 'PipelineQuoteGrid') {
                        this.setControlValue('WOStatusCodeSelect', this.pageParams['WOStatusQuoteCreated']);
                        this.woStatusCodeSelectOnChange();
                    }

                    if (this.parentMode === 'PipelineQuoteGridSubmit') {
                        this.setControlValue('WOStatusCodeSelect', this.pageParams['WOStatusQuoteAccepted']);
                        this.woStatusCodeSelectOnChange();
                    }

                    if (this.parentMode === 'QuoteStatusMaintenance' || this.parentMode === 'PipelineQuoteGrid' || this.parentMode === 'PipelineQuoteGridSubmit' || this.parentMode === 'PipelineQuoteGridNoQuotes') {
                        this.setMode(true, false);
                        this.setButtonsVisibility(true, true, true);
                        this.uiForm.controls['WOStatusCodeSelect'].enable();
                    }
                    this.riGridWorkOrderBeforeExecute();
                    this.buildGrid();
                    this.riExchangeUpdateHTMLDocument();
                    this.formDisableBasedOnAmendRights();
                }, (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
                });
            } else {
                this.buildGrid();
                this.riExchangeUpdateHTMLDocument();
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            return;
        });

        Observable.forkJoin(
            ...observableErrorBatch
        ).subscribe((data: any) => {
            if (data[0] !== 0 && data[0] !== ErrorConstant.Message.ErrorMessageNotFound) {
                this.internalVariables['cQuoteNumberWarningMessage'] = data[0];
            }
            if (data[1] !== 0 && data[1] !== ErrorConstant.Message.ErrorMessageNotFound) {
                this.internalVariables['cQuoteValueWarningMessage'] = data[1];
            }
            this.internalVariables['cQuoteNumberWarningMessage'] = !this.utils.isFalsy(this.internalVariables['cQuoteNumberWarningMessage']) ? this.internalVariables['cQuoteNumberWarningMessage'] : '';
            this.internalVariables['cQuoteValueWarningMessage'] = !this.utils.isFalsy(this.internalVariables['cQuoteValueWarningMessage']) ? this.internalVariables['cQuoteValueWarningMessage'] : '';
            this.internalVariables['cQuoteNumberWarning'] = this.internalVariables['cQuoteNumberWarningMessage'];
            this.internalVariables['cQuoteValueWarning'] = this.internalVariables['cQuoteValueWarningMessage'];
        }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            return;
        });
    }
    /**
     * This is an API function to fetch default data
     */
    private loadData(): void {
        let workOrderQueryParams = this.getURLSearchParamObject();
        //set parameters
        workOrderQueryParams.set(this.serviceConstants.Action, '2');
        workOrderQueryParams.set('CustomerContactNumber', this.pageParams['CustomerContactNumber']);
        workOrderQueryParams.set('WONumber', this.getControlValue('WONumber'));
        workOrderQueryParams.set(this.serviceConstants.PageSize, this.gridProperties['itemsPerPage'].toString());
        workOrderQueryParams.set(this.serviceConstants.PageCurrent, this.gridProperties['paginationCurrentPage'].toString());
        workOrderQueryParams.set(this.serviceConstants.GridMode, '0');
        workOrderQueryParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        workOrderQueryParams.set('riSortOrder', this.riGrid.SortOrder);
        workOrderQueryParams.set('HeaderClickedColumn', '');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.requestParams['method'], this.requestParams['module'], this.requestParams['operation'], workOrderQueryParams)
            .subscribe(
            (data) => {
                if (data) {
                    try {
                        if (data && data['hasError']) {
                            this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                        } else {
                            this.gridProperties['pageCurrent'] = data.pageData ? data.pageData.pageNumber : 1;
                            this.gridProperties['totalRecords'] = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                            this.riGrid.UpdateBody = true;
                            this.riGrid.UpdateHeader = true;
                            this.riGrid.UpdateFooter = true;
                            this.riGrid.Execute(data);
                            if (data.pageData && (data.pageData.lastPageNumber * 10) > 0)
                                this.isPaginationHidden = false;
                            else
                                this.isPaginationHidden = true;
                        }
                    } catch (e) {
                        this.logger.log('Problem in grid load', e);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
                this.gridProperties['totalRecords'] = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
    /**
     * This function populates form data and page params with data recieved from connector
     * @param data
     */
    private populateFormAndParams(data: Object): void {
        if (data && !data['hasError']) {
            for (let i in data) {
                if (data.hasOwnProperty(i)) {
                    data[i] = !this.utils.isFalsy(data[i]) ? data[i].toString().trim() : '';
                    if (this.uiForm.controls[i] !== undefined && this.uiForm.controls[i] !== null) {
                        this.setControlValue(i, data[i].trim());
                        if (data[i].toUpperCase() === GlobalConstant.Configuration.Yes) {
                            this.setControlValue(i, true);
                        } else if (data[i].toUpperCase() === GlobalConstant.Configuration.No) {
                            this.setControlValue(i, false);
                        }
                    }
                    if (typeof this.pageParams[i] !== 'undefined') {
                        this.pageParams[i] = data[i];
                    }
                }
            }
        }
    }
    /**
     * This function sets mode of the screen based on parameters passed
     */
    private setMode(updateMode: boolean, addMode: boolean): void {
        this.mode = {
            updateMode: updateMode,
            addMode: addMode
        };
    }
    /**
     * This function sets the visibility of the action buttons based on parameters passed
     */
    private setButtonsVisibility(saveVisibility: boolean, cancelVisibility: boolean, deleteVisibility: boolean): void {
        this.fieldVisibility['save'] = saveVisibility;
        this.fieldVisibility['cancel'] = cancelVisibility;
        this.fieldVisibility['delete'] = deleteVisibility;
    }
    /**
     * This function clones initial screen data
     */
    private cloneFormAndParams(): void {
        this.formRawClone = JSON.parse(JSON.stringify(this.uiForm.getRawValue()));
        this.paramsClone = JSON.parse(JSON.stringify(this.pageParams));
        this.fieldVisibilityClone = JSON.parse(JSON.stringify(this.fieldVisibility));
        this.fieldRequiredClone = JSON.parse(JSON.stringify(this.fieldRequired));
    }
    /**
     * This function disables the form if the user cannot amend and delete the record
     */
    private formDisableBasedOnAmendRights(): void {
        if (!this.fieldVisibility['save']) {
            this.uiForm.disable();
            this.uiForm.controls['Menu'].enable();
            this.uiForm.controls['AddressCodeSelect'].enable();
            this.uiForm.controls['ContactMediumCodeSelect'].enable();
            this.uiForm.controls['CmdCheckResultAvail'].enable();
            this.checkRouteAway = false;
        } else {
            this.checkRouteAway = true;
        }
    }
    /**
     * This is an API function to fetch list of WOStatusCode
     * @param returnSubscription
     */
    private getWOStatusCodeList(returnSubscription: boolean): any {
        let formdata: Object = {
            WOTypeCode: this.getControlValue('WOTypeCodeSelect')
        };
        if (returnSubscription) {
            return this.workOrderPost('GetWOStatusCodeList', {}, formdata);
        } else {
            this.workOrderPost('GetWOStatusCodeList', {}, formdata).subscribe((data) => {
                this.getWOStatusCodeListInternal(data);
            }, (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            });
        }
    }
    /**
     * This function processes the list of WOStatusCode recieved from connector
     */
    private getWOStatusCodeListInternal(data: Object): void {
        if (data['status'] === GlobalConstant.Configuration.Failure) {
            this.modalAdvService.emitError(new ICabsModalVO(data['oResponse']));
        } else {
            if (data['hasError']) {
                this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
            } else {
                this.internalVariables['cWOStatusCodeList'] = data['WOStatusCodeList'];
                this.internalVariables['cWOStatusDescList'] = data['WOStatusDescList'];
                this.populateWOStatusCodeSelect();
            }
        }
    }
    /**
     * This function populates WOStatusCodeSelect dropdown with data
     */
    private populateWOStatusCodeSelect(): void {
        let valArray, descArray, valArrayLength, woStatusCodeSelectList = [];
        valArray = !this.utils.isFalsy(this.internalVariables['cWOStatusCodeList']) ? this.internalVariables['cWOStatusCodeList'].toString().split('^') : [];
        descArray = !this.utils.isFalsy(this.internalVariables['cWOStatusDescList']) ? this.internalVariables['cWOStatusDescList'].toString().split('^') : [];
        valArrayLength = valArray.length;
        for (let i = 0; i < valArrayLength; i++) {
            woStatusCodeSelectList.push({
                value: valArray[i],
                desc: descArray[i]
            });
        }
        this.dropdownList['WOStatusCodeSelect'] = woStatusCodeSelectList;
    }
    /**
     * This function enables/disables availability buttons based on the parameter passed
     * @param isDisabled
     */
    private checkAvailSensitive(isDisabled: boolean): void {
        if (isDisabled === true) {
            this.uiForm.controls['CmdCheckAvail01'].disable();
            this.uiForm.controls['CmdCheckAvail02'].disable();
            this.uiForm.controls['CmdCheckAvail03'].disable();
            this.uiForm.controls['CmdCheckAvail04'].disable();
            this.uiForm.controls['CmdCheckAvail05'].disable();
            this.uiForm.controls['CmdCheckAvail06'].disable();
            this.uiForm.controls['CmdCheckAvail07'].disable();
            this.uiForm.controls['CmdCheckAvail08'].disable();
            this.uiForm.controls['CmdCheckAvail09'].disable();
            this.uiForm.controls['CmdCheckAvail10'].disable();
        } else {
            this.uiForm.controls['CmdCheckAvail01'].enable();
            this.uiForm.controls['CmdCheckAvail02'].enable();
            this.uiForm.controls['CmdCheckAvail03'].enable();
            this.uiForm.controls['CmdCheckAvail04'].enable();
            this.uiForm.controls['CmdCheckAvail05'].enable();
            this.uiForm.controls['CmdCheckAvail06'].enable();
            this.uiForm.controls['CmdCheckAvail07'].enable();
            this.uiForm.controls['CmdCheckAvail08'].enable();
            this.uiForm.controls['CmdCheckAvail09'].enable();
            this.uiForm.controls['CmdCheckAvail10'].enable();
        }

    }
    /**
     * This is an API function for GET requests triggered in the screen
     * @param functionName
     * @param params
     */
    private workOrderGet(functionName: string, params: Object): Observable<any> {
        let queryWorkOrder = new URLSearchParams();
        queryWorkOrder.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryWorkOrder.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryWorkOrder.set(this.serviceConstants.Action, '6');
            queryWorkOrder.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                queryWorkOrder.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.requestParams['method'], this.requestParams['module'], this.requestParams['operation'], queryWorkOrder);
    }
    /**
     * This is an API function for POST requests triggered in the screen
     * @param functionName
     * @param params
     * @param formData
     */
    private workOrderPost(functionName: string, params: Object, formData: Object): Observable<any> {
        let queryWorkOrder = new URLSearchParams();
        queryWorkOrder.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryWorkOrder.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryWorkOrder.set(this.serviceConstants.Action, '6');
            formData['Function'] = functionName;
        }
        for (let key in params) {
            if (key) {
                queryWorkOrder.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.requestParams['method'], this.requestParams['module'], this.requestParams['operation'], queryWorkOrder, formData);
    }
    /**
     * This is an API function for Look-up requests triggered in the screen
     * @param data
     * @param maxresults
     */
    private lookUpRecord(data: Object, maxresults?: number): Observable<any> {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        } else {
            this.queryLookUp.set(this.serviceConstants.MaxResults, '100');
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }
    /**
     * This function sets the syschar parameters to be sent in the request
     */
    private sysCharParameters(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharProspectEntryMaxQuotesBeforeWarning,
            this.sysCharConstants.SystemCharProspectEntryMaxValueBeforeWarning
        ];
        return sysCharList.join(',');
    }
    /**
     *  This is a trigger function for syschars
     */
    private triggerFetchSysChar(): Observable<any> {
        return this.fetchSysChar(this.sysCharParameters());
    }
    /**
     * This is an API function for Syschar requests triggered in the screen
     * @param sysCharNumbers
     */
    private fetchSysChar(sysCharNumbers: any): Observable<any> {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }
    /**
     * This is batch request to fetch translation
     */
    private fetchTranslationContent(): void {
        this.getTranslatedValuesBatch((data: any) => {
            if (data) {
                this.internalVariables['amendQuoteText'] = data[0];
                this.internalVariables['btnAvailibility'] = data[1];
                this.internalVariables['btnAttendees'] = data[2];
            }
        },
            ['Do you want to amend the Quote Details?'], ['Availability'], ['Clear All Attendees']);
    }
    /**
     * This function sets the text of command buttons
     */
    private setBtnText(): void {
        this.setControlValue('CmdCheckAvail01', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckAvail02', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckAvail03', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckAvail04', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckAvail05', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckAvail06', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckAvail07', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckAvail08', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckAvail09', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckAvail10', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdCheckResultAvail', this.internalVariables['btnAvailibility']);
        this.setControlValue('CmdClearAttend', this.internalVariables['btnAttendees']);
    }
    /**
     * This function checks for Telesales conditions and calls a service if applicable
     */
    private riExchangeUpdateHTMLDocument(): void {
        if (this.pageParams['TelesalesInd'] === 'Y') {
            this.internalVariables['cLastMenuOption'] = this.pageParams['URL'];
            this.pageParams['WindowClosingName'] = 'Telesales';
        }
        if (this.internalVariables['cLastMenuOption'] === this.pageParams['URL']) {
            if (this.pageParams['WindowClosingName'] !== '' && this.pageParams['WindowClosingName'] !== null) {
                this.mode['updateMode'] = true;
                this.mode['addMode'] = false;
            }
        }

        if (this.pageParams['TelesalesInd'] === 'Y') {
            this.workOrderPost('CheckTelesalesOrderType', {}, {
                Action: '6',
                WONumber: this.getControlValue('WONumber')
            }).subscribe((data) => {
                if (!data['hasError']) {
                    if (this.getControlValue('WOStatusCodeSelect') !== null && this.getControlValue('WOStatusCodeSelect') !== '') {
                        this.setControlValue('WOStatusCodeSelect', data['TelesalesWOStatusCode']);
                        this.woStatusCodeSelectOnChange();
                    }
                }
                this.pageParams['WindowClosingName'] = '';
            }, (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            });
        }
    }
    /**
     * This function validates the form for required fields
     */
    private beforeSave(): boolean {
        for (let i in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(i)) {
                this.uiForm.controls[i].markAsTouched();
                if (!this.uiForm.controls[i].enabled) {
                    this.uiForm.controls[i].clearValidators();
                }
                this.uiForm.controls[i].updateValueAndValidity();
            }
        }
        this.uiForm.updateValueAndValidity();
        return this.uiForm.valid;
    }
    /**
     * This function calculates the total quotes and sets it in the input box
     */
    private calculateTotalQuotes(): void {
        let iTQuotes: number = 0;
        let iCQuotes: number = 0;
        let iJQuotes: number = 0;
        let iPQuotes: number = 0;
        let estimatedContractQuotes: any = this.getControlValue('EstimatedContractQuotes');
        let estimatedJobQuotes: any = this.getControlValue('EstimatedJobQuotes');
        let estimatedProductSaleQuotes: any = this.getControlValue('EstimatedProductSaleQuotes');
        if (estimatedContractQuotes !== null && !isNaN(estimatedContractQuotes)) {
            iCQuotes = this.globalize.parseDecimal2ToFixedFormat(estimatedContractQuotes) as number;
        }
        if (estimatedJobQuotes !== null && !isNaN(estimatedJobQuotes)) {
            iJQuotes = this.globalize.parseDecimal2ToFixedFormat(estimatedJobQuotes) as number;
        }
        if (estimatedProductSaleQuotes !== null && !isNaN(estimatedProductSaleQuotes)) {
            iPQuotes = this.globalize.parseDecimal2ToFixedFormat(estimatedProductSaleQuotes) as number;
        }
        iTQuotes = iCQuotes + iJQuotes + iPQuotes;
        this.setControlValue('EstimatedTotalQuotes', iTQuotes);
    }
    /**
     * This function calculates the total values and sets it in the input box
     */
    private calculateTotalValues(): void {
        let iTValues: number = 0;
        let iCValues: number = 0;
        let iJValues: number = 0;
        let iPValues: number = 0;
        let estimatedContractValue = this.getControlValue('EstimatedContractValue');
        let estimatedJobValue = this.getControlValue('EstimatedJobValue');
        let estimatedProductSaleValue = this.getControlValue('EstimatedProductSaleValue');
        if (estimatedContractValue !== null && !isNaN(estimatedContractValue)) {
            iCValues = this.globalize.parseCurrencyToFixedFormat(estimatedContractValue) as number;
        }
        if (estimatedJobValue !== null && !isNaN(estimatedJobValue)) {
            iJValues = this.globalize.parseCurrencyToFixedFormat(estimatedJobValue) as number;
        }
        if (estimatedProductSaleValue !== null && !isNaN(estimatedProductSaleValue)) {
            iPValues = this.globalize.parseCurrencyToFixedFormat(estimatedProductSaleValue) as number;
        }
        iTValues = iCValues + iJValues + iPValues;
        this.setControlValue('EstimatedTotalValue', iTValues);
    }
    /**
     * This function validates form fields and displays appropriate messages
     */
    private riMaintenanceBeforeConfirm(): void {
        let lConfirm;
        let estimatedContractQuotes = this.getControlValue('EstimatedContractQuotes');
        let estimatedJobQuotes = this.getControlValue('EstimatedJobQuotes');
        let estimatedProductSaleQuotes = this.getControlValue('EstimatedProductSaleQuotes');
        let estimatedContractValue = this.getControlValue('EstimatedContractValue');
        let estimatedJobValue = this.getControlValue('EstimatedJobValue');
        let estimatedProductSaleValue = this.getControlValue('EstimatedProductSaleValue');
        if (this.getControlValue('QuotedInd')) {
            if (estimatedContractValue !== null && estimatedContractValue !== 0 && (estimatedContractQuotes === '0' || estimatedContractQuotes === '')) {
                this.setControlValue('EstimatedContractQuotes', null);
            }
            if (estimatedContractQuotes !== null && estimatedContractQuotes > 0 && (estimatedContractValue === '0' || estimatedContractValue === '')) {
                this.setControlValue('EstimatedContractValue', null);
            }
            if (estimatedJobValue !== null && estimatedJobValue !== 0 && (estimatedJobQuotes === '0' || estimatedJobQuotes === '')) {
                this.setControlValue('EstimatedJobQuotes', null);
            }
            if (estimatedJobQuotes !== null && estimatedJobQuotes > 0 && (estimatedJobValue === '0' || estimatedJobValue === '')) {
                this.setControlValue('estimatedJobValue', null);
            }
            if (estimatedProductSaleValue !== null && estimatedProductSaleValue !== 0 && (estimatedProductSaleQuotes === '0' || estimatedProductSaleQuotes === '')) {
                this.setControlValue('EstimatedProductSaleQuotes', null);
            }
            if (estimatedProductSaleQuotes !== null && estimatedProductSaleQuotes > 0 && (estimatedProductSaleValue === '0' || estimatedProductSaleValue === '')) {
                this.setControlValue('EstimatedProductSaleValue', null);
            }
            this.uiForm.controls['EstimatedContractQuotes'].markAsTouched();
            this.uiForm.controls['EstimatedJobQuotes'].markAsTouched();
            this.uiForm.controls['EstimatedProductSaleQuotes'].markAsTouched();
            this.uiForm.controls['EstimatedContractValue'].markAsTouched();
            this.uiForm.controls['EstimatedJobValue'].markAsTouched();
            this.uiForm.controls['EstimatedProductSaleValue'].markAsTouched();
            this.uiForm.updateValueAndValidity();

            if (!this.uiForm.controls['EstimatedContractQuotes'].valid || !this.uiForm.controls['EstimatedJobQuotes'].valid || !this.uiForm.controls['EstimatedProductSaleQuotes'].valid || !this.uiForm.controls['EstimatedContractValue'].valid || !this.uiForm.controls['EstimatedJobValue'].valid || !this.uiForm.controls['EstimatedProductSaleValue'].valid) {
                if (!this.getControlValue('EstimatedContractValue')) {
                    this.setControlValue('EstimatedContractValue', '0');
                }
                if (!this.getControlValue('EstimatedContractQuotes')) {
                    this.setControlValue('EstimatedContractQuotes', '0');
                }
                if (!this.getControlValue('EstimatedJobValue')) {
                    this.setControlValue('EstimatedJobValue', '0');
                }
                if (!this.getControlValue('EstimatedJobQuotes')) {
                    this.setControlValue('EstimatedJobQuotes', '0');
                }
                if (!this.getControlValue('EstimatedProductSaleValue')) {
                    this.setControlValue('EstimatedProductSaleValue', '0');
                }
                if (!this.getControlValue('EstimatedProductSaleQuotes')) {
                    this.setControlValue('EstimatedProductSaleQuotes', '0');
                }

                // Tab Click grdResult
                this.renderTab(5);
                setTimeout(() => {
                    if (this.estimatedContractQuotes) {
                        let focus = new CustomEvent('focus', { bubbles: true });
                        this.renderer.invokeElementMethod(this.estimatedContractQuotes.nativeElement, 'focus', [focus]);
                    }
                }, 0);
                return;
            } else {
                lConfirm = false;
                if (this.internalVariables['SCMaxQuotesNumber'] !== 0 && this.getControlValue('EstimatedTotalQuotes') !== null) {
                    if (this.globalize.parseDecimal2ToFixedFormat(this.getControlValue('EstimatedTotalQuotes')) > this.globalize.parseDecimal2ToFixedFormat(this.internalVariables['SCMaxQuotesNumber'])) {
                        let modalVO: ICabsModalVO = new ICabsModalVO(this.internalVariables['cQuoteNumberWarning']);
                        modalVO.closeCallback = this.amendPrompt.bind(this);
                        this.modalAdvService.emitMessage(modalVO);
                        lConfirm = true;
                    }
                }

                if (this.internalVariables['SCMaxQuotesValue'] !== 0 && this.getControlValue('EstimatedTotalValue') !== null) {
                    if (this.globalize.parseDecimal2ToFixedFormat(this.getControlValue('EstimatedTotalValue')) > this.globalize.parseDecimal2ToFixedFormat(this.internalVariables['SCMaxQuotesValue'])) {
                        let modalVO: ICabsModalVO = new ICabsModalVO(this.internalVariables['cQuoteValueWarning']);
                        modalVO.closeCallback = this.amendPrompt.bind(this);
                        this.modalAdvService.emitMessage(modalVO);
                        lConfirm = true;
                    }
                }
            }
        } else {
            this.modalAdvService.emitPrompt(new ICabsModalVO(this.promptTitle, null, this.confirmCallBack.bind(this)));
        }
    }
    /**
     * This function displays amend prompt modal
     */
    private amendPrompt(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(this.internalVariables['amendQuoteText'], null, null, this.amendConfirmCallBack.bind(this)));
    }
    /**
     * This function triggers confirm modal when user confirms amendment
     * @param obj
     */
    private amendConfirmCallBack(obj: Object): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(this.promptTitle, null, this.confirmCallBack.bind(this)));
    }
    /**
     * This function enables few fields if the screen is in update mode
     */
    private riMaintenanceBeforeUpdate(): void {
        this.uiForm.controls['CmdReassignTo'].enable();
        this.uiForm.controls['WOStatusCodeSelect'].enable();
        this.uiForm.controls['ToWOTypeCodeSelect'].enable();
        this.uiForm.controls['ContactMediumCodeSelect'].enable();
        this.checkAvailSensitive(false);
        this.uiForm.controls['CmdClearAttend'].enable();
        this.woTypeCodeSelectOnChange();
        if (this.pageParams['CustomerContactNumber'] && this.pageParams['CustomerContactNumber'] !== '0') {
            this.renderTab(5);
            setTimeout(() => {
                if (this.contactName) {
                    let focus = new CustomEvent('focus', { bubbles: true });
                    this.renderer.invokeElementMethod(this.contactName.nativeElement, 'focus', [focus]);
                }
            }, 0);
        }
    }
    /**
     * This function gets called before save operation; it checks if prospect is required, if yes then it is not empty and user enters it
     */
    private riMaintenanceBeforeSave(): boolean {
        let cancelEvent: boolean = false;
        if (!this.getControlValue('WONumber')) {
            this.setControlValue('WONumber', '0');
        }
        this.pageParams['WOTypeProspectRequired'] = !this.utils.isFalsy(this.pageParams['WOTypeProspectRequired']) ? this.pageParams['WOTypeProspectRequired'] : '';
        if (this.pageParams['WOTypeProspectRequired'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0 && (this.getControlValue('ProspectNumber') && this.getControlValue('ProspectNumber') !== '0') && this.pageParams['CustomerContactNumber'] && this.pageParams['CustomerContactNumber'] === '0') {
            if (!this.uiForm.controls['PremiseNumber'].valid) {
                this.renderTab(1);
                setTimeout(() => {
                    if (this.prospectNumber) {
                        let focus = new CustomEvent('focus', { bubbles: true });
                        this.renderer.invokeElementMethod(this.prospectNumber.nativeElement, 'focus', [focus]);
                    }
                }, 0);
                cancelEvent = true;
            }
        }
        this.pageParams['WOTypeCode'] = this.getControlValue('WOTypeCodeSelect');
        this.pageParams['WOStatusCode'] = this.getControlValue('WOStatusCodeSelect');
        this.pageParams['ToWOTypeCode'] = this.getControlValue('ToWOTypeCodeSelect');
        this.pageParams['ContactMediumCode'] = this.getControlValue('ContactMediumCodeSelect');
        return cancelEvent;
    }
    /**
     * This function gets called after save operation; it navigates back to the parent screen or prospectstatuschange screen based on AmendProspectStatusInd
     */
    private riMaintenanceAfterSave(): void {
        this.uiForm.controls['CmdCheckResultAvail'].disable();
        this.uiForm.controls['CmdReassignTo'].disable();
        this.uiForm.controls['WOTypeCodeSelect'].disable();
        this.uiForm.controls['WOStatusCodeSelect'].disable();
        this.uiForm.controls['ToWOTypeCodeSelect'].disable();
        this.uiForm.controls['ContactMediumCodeSelect'].disable();
        if (this.getControlValue('AmendProspectStatusInd')) {
            this.navigate('WorkOrderMaintenance', InternalMaintenanceSalesModuleRoutes.ICABSSPROSPECTSTATUSCHANGE, {
                ForceRefresh: 'YES'
            });
        } else {
            this.location.back();
        }
    }
    /**
     * This function gets called after delete operation, it navigates back to the parent screen
     */
    private riMaintenanceAfterDelete(): void {
        this.location.back();
    }
    /**
     * This function gets called when the screen is in add mode and disables few controls
     */
    private riMaintenanceBeforeAdd(): void {
        this.uiForm.controls['CmdCheckResultAvail'].disable();
        this.uiForm.controls['CmdReassignTo'].disable();
        this.setControlValue('WOTypeCodeSelect', this.pageParams['WOTypeDefaultCode']);
        this.fieldVisibility['BtnProceedTask'] = false;
    }
    /**
     * This function gets called when WONumber data has been fetched and it does further processing based on the data recieved
     * @param returnSubscription
     */
    private riMaintenanceAfterFetch(returnSubscription: boolean): any {
        if (this.pageParams['CanAmend'] === false || (this.pageParams['CanAmend'] && this.pageParams['CanAmend'].toString().toUpperCase() === GlobalConstant.Configuration.No) || this.pageParams['URL'] === this.speedScriptConstants.WOTypeURLWOMaint) {
            this.fieldVisibility['BtnProceedTask'] = false;
        } else {
            this.fieldVisibility['BtnProceedTask'] = true;

        }
        this.buildTab();
        this.buildMenu();
        this.pageParams['SaveProspectNumber'] = this.getControlValue('ProspectNumber');
        this.pageParams['PassCustomerContactNumber'] = this.getControlValue('CustomerContactNumber');
        this.setControlValue('WOToDate', this.pageParams['WODate']);
        this.pageParams['DefaultStartTime'] = this.globalize.formatTimeToLocaleFormat(this.getControlValue('WOStartTime'));
        this.pageParams['DefaultEndTime'] = this.getControlValue('WOEndTime');
        if (this.pageParams['CanAmend'] === true || (this.pageParams['CanAmend'] && this.pageParams['CanAmend'].toString().toUpperCase() === GlobalConstant.Configuration.Yes) || (this.pageParams['AllowFullUpdateRights'] && this.pageParams['AllowFullUpdateRights'].toString().toUpperCase() === GlobalConstant.Configuration.Yes)) {
            this.setButtonsVisibility(true, true, this.fieldVisibility['delete']);
        } else {
            this.setButtonsVisibility(false, false, this.fieldVisibility['delete']);
        }

        if ((this.pageParams['CanDelete'] === true || (this.pageParams['CanDelete'] && this.pageParams['CanDelete'].toString().toUpperCase() === GlobalConstant.Configuration.Yes)) && this.parentMode !== 'ServiceVisit-WorkOrderGrid') {
            this.fieldVisibility['delete'] = true;
        } else {
            this.fieldVisibility['delete'] = false;
        }

        this.setControlValue('EmployeeCodeCreate', this.getControlValue('EmployeeCode'));
        this.setControlValue('EmployeeNameCreate', this.getControlValue('EmployeeName'));
        this.setControlValue('WOTypeCodeSelect', this.pageParams['WOTypeCode']);
        this.setControlValue('WOStatusCodeSelect', this.pageParams['WOStatusCode']);
        this.pageParams['WOStatusInit'] = this.pageParams['WOStatusCode'];
        if (returnSubscription) {
            return this.getToWOTypeCodes(true);
        } else {
            this.getToWOTypeCodes(true).subscribe((data) => {
                this.riMaintenanceAfterFetchInternal(data);
                this.formDisableBasedOnAmendRights();
            }, (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            });
        }
    }
    /**
     * This function builds dropdown from the data recieved from the connector
     * @param data
     */
    private riMaintenanceAfterFetchInternal(data: Object): void {
        let valArray, descArray, valArrayLength, woStatusCodeSelectList = [];
        this.getToWOTypeCodesInternal(data);
        this.setControlValue('ContactMediumCodeSelect', this.pageParams['ContactMediumCode']);
        this.buildAddressSelect();
        this.pageParams['WOStatusCodeList'] = !this.utils.isFalsy(this.pageParams['WOStatusCodeList']) ? this.pageParams['WOStatusCodeList'] : '';
        this.pageParams['WOStatusDescList'] = !this.utils.isFalsy(this.pageParams['WOStatusDescList']) ? this.pageParams['WOStatusDescList'] : '';
        valArray = this.pageParams['WOStatusCodeList'].split('^');
        descArray = this.pageParams['WOStatusDescList'].split('^');
        valArrayLength = valArray.length;
        for (let i = 0; i < valArrayLength; i++) {
            woStatusCodeSelectList.push({
                value: valArray[i],
                desc: descArray[i]
            });
        }
        this.dropdownList['WOStatusCodeSelect'] = woStatusCodeSelectList;
        this.setControlValue('WOStatusCodeSelect', this.pageParams['WOStatusInit']);
        this.woStatusCodeSelectOnChange();
        this.woTypeCodeSelectOnChange();
        this.allDayIndOnChange();
    }
    /**
     * This function disables few fields when user abandons update/add mode
     */
    private riMaintenanceAfterAbandon(): void {
        this.uiForm.controls['CmdReassignTo'].disable();
        this.uiForm.controls['CmdCheckResultAvail'].disable();
        this.uiForm.controls['WOTypeCodeSelect'].disable();
        this.uiForm.controls['WOStatusCodeSelect'].disable();
        this.uiForm.controls['ToWOTypeCodeSelect'].disable();
        this.uiForm.controls['ContactMediumCodeSelect'].disable();

        if (this.pageParams['CanAmend'] === false || (this.pageParams['CanAmend'] && this.pageParams['CanAmend'].toString().toUpperCase() === GlobalConstant.Configuration.No) || this.pageParams['URL'] === this.speedScriptConstants.WOTypeURLWOMaint) {
            this.fieldVisibility['BtnProceedTask'] = false;
        } else {
            this.fieldVisibility['BtnProceedTask'] = true;
        }
    }
    /**
     * This function navigates to ICABSCMDIARYDAYMAINTENANCE if user has entered employee number
     */
    private checkAvailability(checkEmployeeCode: string, checkEmployeeName: string, checkAvailDate: string, passBackDetails: boolean): void {
        let parentMode: string;
        if (checkEmployeeCode) {
            this.pageParams['AvailEmployeeCode'] = checkEmployeeCode;
            this.pageParams['AvailEmployeeName'] = checkEmployeeName;
            this.pageParams['AvailDiaryDate'] = checkAvailDate;

            if (passBackDetails) {
                parentMode = 'WorkOrderAvailability-PassBack';
            } else {
                parentMode = 'WorkOrderAvailability';
            }
            this.navigate(parentMode, AppModuleRoutes.PROSPECTTOCONTRACT + ProspectToContractModuleRoutes.ICABSCMDIARYDAYMAINTENANCE, {
                AvailEmployeeCode: this.pageParams['AvailEmployeeCode'],
                AvailEmployeeName: this.pageParams['AvailEmployeeName'],
                AvailDiaryDate: this.pageParams['AvailDiaryDate']
            });
        }
    }
    /**
     * This is an API function to fetch ToWOTypeCode data
     */
    private getToWOTypeCodes(returnSubscription: boolean): any {
        if (returnSubscription) {
            return this.workOrderPost('GetToWOType', {}, {
                Action: '6',
                WOStatusCode: this.getControlValue('WOStatusCodeSelect')
            });
        } else {
            this.workOrderPost('GetToWOType', {}, {
                Action: '6',
                WOStatusCode: this.getControlValue('WOStatusCodeSelect')
            }).subscribe((data) => {
                this.getToWOTypeCodesInternal(data);
            }, (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            });
        }
    }
    /**
     * This function processes ToWOTypeCode data recieved from connector
     */
    private getToWOTypeCodesInternal(data: Object): void {
        let iCount = 0;
        let cDefault;
        if (data['status'] === GlobalConstant.Configuration.Failure) {
            this.modalAdvService.emitError(new ICabsModalVO(data['oResponse']));
        } else {
            if (data['hasError']) {
                this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
            } else {
                this.setControlValue('ToWOTypeCodeSelect', '');
                let valArray, descArray, valArrayLength, toWOTypeCodeSelectList = [];
                valArray = data['ToWOTypeCodeList'].split(String.fromCharCode(10));
                descArray = data['ToWOTypeDescList'].split(String.fromCharCode(10));
                valArrayLength = valArray.length;
                if (valArrayLength > 0) {
                    this.fieldVisibility['ToWOTypeCodeSelect'] = true;
                    for (let i = 0; i < valArrayLength; i++) {
                        if (this.pageParams['WOStatusInit'] === this.getControlValue('WOStatusCodeSelect') && this.pageParams['ToWOTypeCode'] === valArray[i]) {
                            this.setControlValue('ToWOTypeCodeSelect', valArray[i]);
                        }
                        toWOTypeCodeSelectList.push({
                            value: valArray[i],
                            desc: descArray[i]
                        });
                        iCount++;
                        cDefault = valArray[i];
                    }
                    this.dropdownList['ToWOTypeCodeSelect'] = toWOTypeCodeSelectList;
                    if (iCount === 2) {
                        this.setControlValue('ToWOTypeCodeSelect', cDefault);
                    }
                    if (this.dropdownList['ToWOTypeCodeSelect'].length === 1 && this.dropdownList['ToWOTypeCodeSelect'][0].value === 'UNKNOWN') {
                        this.fieldVisibility['ToWOTypeCodeSelect'] = false;
                    }
                } else {
                    this.fieldVisibility['ToWOTypeCodeSelect'] = false;
                }
            }
        }
    }
    /**
     * This function builds AddressCodeSelect dropddown
     */
    private buildAddressSelect(): void {
        let valArray, descArray, valArrayLength, addressCodeSelectList = [];
        this.pageParams['AddressCodeList'] = !this.utils.isFalsy(this.pageParams['AddressCodeList']) ? this.pageParams['AddressCodeList'] : '';
        this.pageParams['AddressDescList'] = !this.utils.isFalsy(this.pageParams['AddressDescList']) ? this.pageParams['AddressDescList'] : '';
        valArray = this.pageParams['AddressCodeList'].split('^');
        descArray = this.pageParams['AddressDescList'].split('^');
        valArrayLength = valArray.length;
        for (let i = 0; i < valArrayLength; i++) {
            addressCodeSelectList.push({
                value: valArray[i],
                desc: descArray[i]
            });
        }
        this.dropdownList['AddressCodeSelect'] = addressCodeSelectList;
        if (this.pageParams['AddressCodeDefault']) {
            this.setControlValue('AddressCodeSelect', this.pageParams['AddressCodeDefault']);
            this.addressCodeSelectOnChange({});
        } else {
            this.setControlValue('AddressCodeDefault', valArray[0]);
        }
    }
    /**
     * This function builds the grid (columns and column types)
     */
    private buildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('grWONumber', 'WorkOrder', 'grWONumber', MntConst.eTypeInteger, 6, false);
        this.riGrid.AddColumnAlign('grWONumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('WOCreatedDateTime', 'WorkOrder', 'WOCreatedDateTime', MntConst.eTypeTextFree, 8, false);
        this.riGrid.AddColumnAlign('WOCreatedDateTime', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('WOTypeDesc', 'WorkOrder', 'WOTypeDesc', MntConst.eTypeTextFree, 15);

        this.riGrid.AddColumn('WODateTime', 'WorkOrder', 'WODateTime', MntConst.eTypeTextFree, 8);
        this.riGrid.AddColumnAlign('WODateTime', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('WOEmployeeName', 'WorkOrder', 'WOEmployeeName', MntConst.eTypeTextFree, 20, false);

        this.riGrid.AddColumn('WOStatusDesc', 'WorkOrder', 'WOStatusDesc', MntConst.eTypeTextFree, 15, false);

        this.riGrid.AddColumn('WOResultText', 'WorkOrder', 'WOResultText', MntConst.eTypeTextFree, 30, false);

        this.riGrid.AddColumn('WOCloseDateTime', 'WorkOrder', 'WOCloseDateTime', MntConst.eTypeTextFree, 8, false);
        this.riGrid.AddColumnAlign('WOCloseDateTime', MntConst.eAlignmentCenter);

        this.riGrid.Complete();
    }
    /**
     * This function builds the tab based on conditions
     */
    private buildTab(): void {
        let iTabNumber: number = 0;
        this.uiDisplay['tab'].tab1.visible = false;
        this.uiDisplay['tab'].tab2.visible = false;
        this.uiDisplay['tab'].tab3.visible = false;
        this.uiDisplay['tab'].tab4.visible = false;
        this.uiDisplay['tab'].tab5.visible = false;

        this.internalVariables['iResultTabNumber'] = 0;
        this.internalVariables['iHistoryTabNumber'] = 0;
        this.pageParams['WOTypeProspectRequired'] = !this.utils.isFalsy(this.pageParams['WOTypeProspectRequired']) ? this.pageParams['WOTypeProspectRequired'] : '';
        this.pageParams['WOTypeAdditionalEmpl'] = !this.utils.isFalsy(this.pageParams['WOTypeAdditionalEmpl']) ? this.pageParams['WOTypeAdditionalEmpl'] : '';
        this.pageParams['WOTypeAutoClose'] = !this.utils.isFalsy(this.pageParams['WOTypeAutoClose']) ? this.pageParams['WOTypeAutoClose'] : '';
        if (this.pageParams['WOTypeProspectRequired'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0 || (this.mode['updateMode'] === true && (this.pageParams['CanAmend'] === true || (this.pageParams['CanAmend'] && this.pageParams['CanAmend'].toString().toUpperCase() === GlobalConstant.Configuration.Yes)) && this.pageParams['CustomerContactNumber'])) {
            this.uiDisplay['tab'].tab1.visible = true;
            iTabNumber++;
        }
        this.uiDisplay['tab'].tab2.visible = true;
        iTabNumber++;
        if (this.pageParams['WOTypeProspectRequired'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0) {
            this.uiDisplay['tab'].tab3.visible = true;
            this.internalVariables['lHistoryTabIsVisible'] = true;
            iTabNumber++;
            this.internalVariables['iHistoryTabNumber'] = iTabNumber;
        } else {
            this.internalVariables['lHistoryTabIsVisible'] = false;
        }

        if (this.pageParams['WOTypeAdditionalEmpl'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0) {
            this.uiDisplay['tab'].tab4.visible = true;
            this.internalVariables['lEmployeeTabIsVisible'] = true;
            iTabNumber++;
        } else {
            this.internalVariables['lEmployeeTabIsVisible'] = false;
        }
        if (this.pageParams['WOTypeAutoClose'].indexOf(this.getControlValue('WOTypeCodeSelect')) < 0 && this.pageParams['WOTypeProspectRequired'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0) {
            this.uiDisplay['tab'].tab5.visible = true;
            this.internalVariables['lResultTabIsVisible'] = true;
            iTabNumber++;
            this.internalVariables['iResultTabNumber'] = iTabNumber;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactName', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactPosition', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactTelephone', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactMobile', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactEmail', false);
            this.fieldRequired['ContactName'] = true;
            this.fieldRequired['ContactPosition'] = true;
            this.fieldRequired['ContactTelephone'] = true;
            this.fieldRequired['ContactMobile'] = false;
            this.fieldRequired['ContactEmail'] = false;
        } else {
            this.internalVariables['lResultTabIsVisible'] = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactName', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactPosition', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactTelephone', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactMobile', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContactEmail', false);
            this.fieldRequired['ContactName'] = false;
            this.fieldRequired['ContactPosition'] = false;
            this.fieldRequired['ContactTelephone'] = false;
            this.fieldRequired['ContactMobile'] = false;
            this.fieldRequired['ContactEmail'] = false;
        }
        this.renderFirstAvailableTab();
    }
    /**
     * This function validates the active tab for form errors
     */
    private validateTabs(): void {
        if (this.uiDisplay['tab'].tab1.active) {
            this.utils.makeTabsRedById(['grdAddress']);
        } else if (this.uiDisplay['tab'].tab2.active) {
            this.utils.makeTabsRedById(['grdInitial']);
        } else if (this.uiDisplay['tab'].tab3.active) {
            this.utils.makeTabsRedById(['grdHistory']);
        } else if (this.uiDisplay['tab'].tab4.active) {
            this.utils.makeTabsRedById(['grdAttendees']);
        } else if (this.uiDisplay['tab'].tab5.active) {
            this.utils.makeTabsRedById(['grdResult']);
        }
    }
    /**
     * This function switches to the first visible tab
     */
    private renderFirstAvailableTab(): void {
        if (this.uiDisplay['tab'].tab1.visible) {
            this.renderTab(1);
        } else if (this.uiDisplay['tab'].tab2.visible) {
            this.renderTab(2);
        } else if (this.uiDisplay['tab'].tab3.visible) {
            this.renderTab(3);
        } else if (this.uiDisplay['tab'].tab4.visible) {
            this.renderTab(4);
        } else if (this.uiDisplay['tab'].tab5.visible) {
            this.renderTab(5);
        }
    }
    /**
     * This function triggers candeactive modal
     */
    public canDeactivate(): Observable<boolean> {
        if (this.checkRouteAway) {
            this.routeAwayGlobals.setSaveEnabledFlag(this.uiForm.dirty);
        }
        return this.routeAwayComponent.canDeactivate();
    }
    /**
     * This function gets called when user changes page number from pagination control; it loads the grid
     */
    public getCurrentPage(currentPage: any): void {
        this.gridProperties['paginationCurrentPage'] = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, this.gridProperties['paginationCurrentPage'].toString());
        this.riGrid.RefreshRequired();
        this.loadData();
    }
    /**
     * This function refreshes the grid
     */
    public gridRefresh(): void {
        this.riGrid.RefreshRequired();
        this.loadData();
    }
    /**
     * This function gets called when grid has been built successfully
     */
    public getGridInfo(): void {
        this.riGrid.RefreshRequired();
    }
    /**
     * This function gets called when user changes the tab; it activates the user selected tab
     */
    public renderTab(tabindex: number, isEvent?: boolean): void {
        if (isEvent) {
            this.validateTabs();
        }
        switch (tabindex) {
            case 1:
                this.uiDisplay['tab'].tab1.active = true;
                this.uiDisplay['tab'].tab2.active = false;
                this.uiDisplay['tab'].tab3.active = false;
                this.uiDisplay['tab'].tab4.active = false;
                this.uiDisplay['tab'].tab5.active = false;
                break;
            case 2:
                this.uiDisplay['tab'].tab1.active = false;
                this.uiDisplay['tab'].tab2.active = true;
                this.uiDisplay['tab'].tab3.active = false;
                this.uiDisplay['tab'].tab4.active = false;
                this.uiDisplay['tab'].tab5.active = false;
                break;
            case 3:
                this.uiDisplay['tab'].tab1.active = false;
                this.uiDisplay['tab'].tab2.active = false;
                this.uiDisplay['tab'].tab3.active = true;
                this.uiDisplay['tab'].tab4.active = false;
                this.uiDisplay['tab'].tab5.active = false;
                this.riGridWorkOrderBeforeExecute();
                this.internalVariables['lRefreshWorkOrderGrid'] = false;
                break;
            case 4:
                this.uiDisplay['tab'].tab1.active = false;
                this.uiDisplay['tab'].tab2.active = false;
                this.uiDisplay['tab'].tab3.active = false;
                this.uiDisplay['tab'].tab4.active = true;
                this.uiDisplay['tab'].tab5.active = false;
                break;
            case 5:
                this.uiDisplay['tab'].tab1.active = false;
                this.uiDisplay['tab'].tab2.active = false;
                this.uiDisplay['tab'].tab3.active = false;
                this.uiDisplay['tab'].tab4.active = false;
                this.uiDisplay['tab'].tab5.active = true;
                break;
        }
        setTimeout(() => {
            this.utils.tabFirstControlFocus();
        }, 0);
    }
    /**
     * This function is click handler for BtnProceedTask button
     */
    public btnProceedTaskOnClick(): void {
        if ((this.pageParams['CanAmend'] === true || (this.pageParams['CanAmend'] && this.pageParams['CanAmend'].toString().toUpperCase() === GlobalConstant.Configuration.Yes)) && this.pageParams['URL'] !== '' && this.pageParams['URL'] !== null && this.pageParams['URL'] !== this.speedScriptConstants.WOTypeURLWOMaint) {
            this.setControlValue('Menu', this.pageParams['URL']);
            this.menuOnChange({});
        }
    }
    /**
     * This function builds the options menu
     */
    public buildMenu(): void {
        let lOptionAdded: boolean = false;
        let menuList: Array<Object> = [
            {
                title: '', list: [{
                    value: 'options',
                    text: 'Options'
                }]
            },
            { title: 'Portfolio', list: [] },
            { title: 'Invoicing', list: [] },
            { title: 'Customer Relations', list: [] },
            { title: 'Diary', list: [] }
        ];
        if (this.pageParams['CustomerContactNumber'] && this.pageParams['CustomerContactNumber'] !== '0') {
            lOptionAdded = false;
            if (this.getControlValue('AccountNumber')) {
                lOptionAdded = true;
                menuList[1]['list'].push({
                    value: this.speedScriptConstants.WOTypeURLAccountMaint,
                    text: 'Account Maintenance'
                });
            }
            if (this.getControlValue('ContractNumber')) {
                lOptionAdded = true;
                menuList[1]['list'].push({
                    value: this.speedScriptConstants.WOTypeURLContractMaint,
                    text: 'Contract/Job Maintenance'
                });
            }
            if (this.getControlValue('PremiseNumber') && this.getControlValue('PremiseNumber') !== '0') {
                lOptionAdded = true;
                menuList[1]['list'].push({
                    value: this.speedScriptConstants.WOTypeURLPremiseMaint,
                    text: 'Premise Maintenance'
                });
            }
            if (this.pageParams['TelesalesOrderNumber'] && this.getControlValue('TelesalesOrderNumber') !== '0') {
                lOptionAdded = true;
                menuList[1]['list'].push({
                    value: this.speedScriptConstants.WOTypeURLTelesales,
                    text: 'Telesales Entry'
                });
                menuList[1]['list'].push({
                    value: this.speedScriptConstants.WOTypeURLStockGrid,
                    text: 'Telesales Stock Grid'
                });
            }
            if (this.getControlValue('ProspectNumber') && this.getControlValue('ProspectNumber') !== '0') {
                lOptionAdded = true;
                menuList[1]['list'].push({
                    value: this.speedScriptConstants.WOTypeURLProspectMaint,
                    text: 'Prospect Maintenance'
                });
            }
            if (this.getControlValue('AccountNumber')) {
                lOptionAdded = true;
                menuList[2]['list'].push({
                    value: this.speedScriptConstants.WOTypeURLInvoiceHistory,
                    text: 'Invoice History'
                });
            }
            if (lOptionAdded) {
                if (this.getControlValue('AccountNumber')) {
                    menuList[3]['list'].push({
                        value: this.speedScriptConstants.WOTypeURLCampaign,
                        text: 'Campaign/Survey Entry'
                    });
                }
                menuList[3]['list'].push({
                    value: this.speedScriptConstants.WOTypeURLContactCentreReview,
                    text: 'Contact Centre Review'
                });
                menuList[3]['list'].push({
                    value: this.speedScriptConstants.WOTypeURLContactCentreSearch,
                    text: 'Contact Centre Search'
                });
            }
        }
        menuList[4]['list'].push({
            value: this.speedScriptConstants.WOTypeURLDiary,
            text: 'Diary Month View'
        });
        menuList[4]['list'].push({
            value: this.speedScriptConstants.WOTypeURLDiaryDay,
            text: 'Diary Day View'
        });
        this.menuList = menuList.filter((value: Object, index: number) => {
            return (value['list'].length > 0);
        });
        this.setControlValue('Menu', 'options');
    }
    /**
     * This function is the change handlet for options menu
     * @param event
     */
    public menuOnChange(event: any): void {
        let mode: string;
        let param: Object = {};
        this.uiForm.controls['Menu'].markAsPristine();
        switch (this.getControlValue('Menu')) {
            case this.speedScriptConstants.WOTypeURLDiary:
                this.pageParams['DiaryProspectNumber'] = this.getControlValue('ProspectNumber');
                this.navigate('WorkOrderMaintenance', AppModuleRoutes.PROSPECTTOCONTRACT + ProspectToContractModuleRoutes.ICABSCMDIARYMAINTENANCE, {
                    DiaryProspectNumber: this.pageParams['DiaryProspectNumber']
                });
                break;
            case this.speedScriptConstants.WOTypeURLDiaryDay:
                this.pageParams['DiaryDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('WODate'));
                this.pageParams['DiaryProspectNumber'] = this.getControlValue('ProspectNumber');
                this.navigate('WorkOrderMaintenance', AppModuleRoutes.PROSPECTTOCONTRACT + ProspectToContractModuleRoutes.ICABSCMDIARYDAYMAINTENANCE, {
                    DiaryProspectNumber: this.pageParams['DiaryProspectNumber'],
                    DiaryDate: this.globalize.parseDateToFixedFormat(this.getControlValue('WODate')),
                    PassEmployeeCode: this.getControlValue('EmployeeCode'),
                    EmployeeSurname: this.getControlValue('EmployeeName')
                });
                break;
            case this.speedScriptConstants.WOTypeURLTelesales:
                this.navigate('WorkOrderMaintenance', InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY);
                break;
            case this.speedScriptConstants.WOTypeURLStockGrid:
                //ToDo: Page not developed yet
                //this.navigate('WorkOrderMaintenance', InternalGridSearchApplicationModuleRoutes.ICABSCMCUSTOMERCONTACTNOTIFICATIONSGRID);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped, null));
                break;
            case this.speedScriptConstants.WOTypeURLProspectMaint:
                if (this.mode['updateMode']) {
                    this.pageParams['DiaryProspectNumber'] = this.getControlValue('ProspectNumber');
                    this.navigate('WorkOrderMaintenance', AppModuleRoutes.PROSPECTTOCONTRACT + ProspectToContractModuleRoutes.ICABSCMPIPELINEPROSPECTMAINTENANCE, {
                        ProspectNumber: this.pageParams['DiaryProspectNumber']
                    });
                }
                break;
            case this.speedScriptConstants.WOTypeURLAccountMaint:
                if (this.mode['updateMode']) {
                    this.navigate('WorkOrderMaintenance', ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE, {
                        DiaryProspectNumber: this.pageParams['DiaryProspectNumber'],
                        AccountNumber: this.getControlValue('AccountNumber'),
                        AccountName: this.getControlValue('AccountName')
                    });
                }
                break;
            case this.speedScriptConstants.WOTypeURLInvoiceHistory:
                if (this.mode['updateMode']) {
                    this.navigate('WorkOrderMaintenance', BillToCashModuleRoutes.ICABSACONTRACTINVOICEGRID, {
                        AccountNumber: this.getControlValue('AccountNumber'),
                        AccountName: this.getControlValue('AccountName'),
                        CustomerContactNumber: this.pageParams['CustomerContactNumber']
                    });
                }
                break;
            case this.speedScriptConstants.WOTypeURLCampaign:
                if (this.mode['updateMode']) {
                    this.navigate('WorkOrderMaintenance', InternalMaintenanceServiceModuleRoutes.ICABSCMCAMPAIGNENTRY, {
                        CustomerContactNumber: this.pageParams['CustomerContactNumber'],
                        ContactName: this.getControlValue('ContactName'),
                        ContactPosition: this.getControlValue('ContactPosition'),
                        ContactTelephone: this.getControlValue('ContactTelephone'),
                        ContactMobile: this.getControlValue('ContactMobile'),
                        ContactEmail: this.getControlValue('ContactEmail')
                    });
                }
                break;
            case this.speedScriptConstants.WOTypeURLContractMaint:
                if (this.mode['updateMode']) {
                    if (this.pageParams['ContractTypeCode'] === 'J') {
                        this.navigate('WorkOrderMaintenance', ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                            ContractNumber: this.getControlValue('ContractNumber')
                        });
                    } else if (this.pageParams['ContractTypeCode'] === 'P') {
                        this.navigate('WorkOrderMaintenance', ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                            ContractNumber: this.getControlValue('ContractNumber')
                        });
                    } else {
                        this.navigate('WorkOrderMaintenance', ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                            ContractNumber: this.getControlValue('ContractNumber')
                        });
                    }
                }
                break;
            case this.speedScriptConstants.WOTypeURLPremiseMaint:
                if (this.mode['updateMode']) {
                    if (this.pageParams['ContractTypeCode'] === 'J') {
                        this.navigate('WorkOrderMaintenance', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                            contractTypeCode: 'J',
                            ContractNumber: this.getControlValue('ContractNumber'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName')
                        });
                    } else {
                        this.navigate('WorkOrderMaintenance', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                            ContractNumber: this.getControlValue('ContractNumber'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName')
                        });
                    }
                }
                break;
            case this.speedScriptConstants.WOTypeURLContactCentreSearch:
                mode = 'WorkOrderMaintenance';
                if (this.mode['updateMode']) {
                    if (this.getControlValue('ProspectNumber') && this.getControlValue('ProspectNumber') !== '0') {
                        mode = 'WorkOrderMaintenanceProspect';
                        param = {
                            ProspectNumber: this.getControlValue('ProspectNumber'),
                            CustomerContactNumber: this.pageParams['CustomerContactNumber']
                        };
                    } else if (this.getControlValue('PremiseNumber')) {
                        mode = 'WorkOrderMaintenancePremise';
                        param = {
                            ContractNumber: this.getControlValue('ContractNumber'),
                            ContractName: this.getControlValue('ContractName'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            CustomerContactNumber: this.pageParams['CustomerContactNumber']
                        };
                    } else if (this.getControlValue('ContractNumber')) {
                        mode = 'WorkOrderMaintenanceContract';
                        param = {
                            ContractNumber: this.getControlValue('ContractNumber'),
                            ContractName: this.getControlValue('ContractName'),
                            CustomerContactNumber: this.pageParams['CustomerContactNumber']
                        };
                    } else if (this.getControlValue('AccountNumber')) {
                        mode = 'WorkOrderMaintenanceAccount';
                        param = {
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName')
                        };
                    }
                    this.navigate(mode, AppModuleRoutes.CCM + CCMModuleRoutes.ICABSCMCALLCENTREGRID, param);
                }
                break;
            case this.speedScriptConstants.WOTypeURLContactCentreReview:
                mode = 'WorkOrderMaintenance';
                if (this.mode['updateMode']) {
                    if (this.getControlValue('ProspectNumber') && this.getControlValue('ProspectNumber') !== '0') {
                        mode = 'WorkOrderMaintenanceProspect';
                        param = {
                            ProspectNumber: this.getControlValue('ProspectNumber')
                        };
                    } else if (this.pageParams['CustomerContactNumber'] && this.pageParams['CustomerContactNumber'] !== '0') {
                        mode = 'WorkOrderMaintenanceCustomerContact';
                        param = {
                            CustomerContactNumber: this.pageParams['CustomerContactNumber']
                        };
                    } else if (this.getControlValue('ContractNumber')) {
                        mode = 'WorkOrderMaintenanceContract';
                        param = {
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName'),
                            ContractNumber: this.getControlValue('ContractNumber'),
                            ContractName: this.getControlValue('ContractName'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            ProductCode: this.getControlValue('ProductCode'),
                            ProductDesc: this.getControlValue('ProductDesc')
                        };
                    } else if (this.getControlValue('AccountNumber')) {
                        mode = 'WorkOrderMaintenanceAccount';
                        param = {
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName'),
                            ContractNumber: this.getControlValue('ContractNumber'),
                            ContractName: this.getControlValue('ContractName'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            ProductCode: this.getControlValue('ProductCode'),
                            ProductDesc: this.getControlValue('ProductDesc')
                        };
                    }
                    this.navigate(mode, AppModuleRoutes.CCM + CCMModuleRoutes.ICABSCMCALLCENTREREVIEWGRID, param);
                }
                break;
        }
        this.internalVariables['cLastMenuOption'] = this.getControlValue('Menu');
        this.setControlValue('Menu', 'options');
    }
    /**
     * This function gets executed when switching to the grid tab
     */
    public riGridWorkOrderBeforeExecute(): void {
        if (this.pageParams['CustomerContactNumber'] === '' || this.pageParams['CustomerContactNumber'] === null) {
            this.pageParams['CustomerContactNumber'] = '0';
        }
        if (this.getControlValue('WONumber') === '' || this.getControlValue('WONumber') === null) {
            this.setControlValue('WONumber', '0');
        }
        this.gridRefresh();
    }
    /**
     * This function gets called when user saves a workorder; this triggers the API request
     * @param instance
     */
    public confirmCallBack(instance: Object): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let formData: Object = {};
        let requestParam: Object = {};
        let controlsLength = this.controls.length;
        for (let i = 0; i < controlsLength; i++) {
            if (!this.controls[i].exclude) {
                let controlValue = this.getControlValue(this.controls[i].name);
                if (controlValue === false) {
                    formData[this.controls[i].name] = GlobalConstant.Configuration.No;
                } else if (controlValue === true) {
                    formData[this.controls[i].name] = GlobalConstant.Configuration.Yes;
                } else {
                    formData[this.controls[i].name] = this.getControlValue(this.controls[i].name);
                }
            }
        }
        formData['CustomerContactNumber'] = this.pageParams['CustomerContactNumber'];
        formData['WOStatusCode'] = this.pageParams['WOStatusCode'];
        formData['WOStatusCodeList'] = this.pageParams['WOStatusCodeList'];
        formData['WOStatusDescList'] = this.pageParams['WOStatusDescList'];
        formData['ContactMediumCode'] = this.pageParams['ContactMediumCode'];
        formData['CanAmend'] = this.pageParams['CanAmend'] ? this.pageParams['CanAmend'] : GlobalConstant.Configuration.No;
        formData['CanDelete'] = this.pageParams['CanDelete'] ? this.pageParams['CanDelete'] : GlobalConstant.Configuration.No;
        formData['ContractTypeCode'] = this.pageParams['ContractTypeCode'];
        formData['URL'] = this.pageParams['URL'];
        formData['WOTypeCode'] = this.pageParams['WOTypeCode'];
        formData['ToWOTypeCode'] = this.pageParams['ToWOTypeCode'];
        formData['TelesalesOrderNumber'] = this.pageParams['TelesalesOrderNumber'];
        formData['TelesalesName'] = this.pageParams['TelesalesName'];
        formData['TelesalesInd'] = this.pageParams['TelesalesInd'];
        formData['AddressCodeList'] = this.pageParams['AddressCodeList'];
        formData['AddressDescList'] = this.pageParams['AddressDescList'];
        formData['AddressCodeDefault'] = this.pageParams['AddressCodeDefault'];
        formData['AccountAddressName'] = this.pageParams['AccountAddressName'];
        formData['AccountAddressLine1'] = this.pageParams['AccountAddressLine1'];
        formData['AccountAddressLine2'] = this.pageParams['AccountAddressLine2'];
        formData['AccountAddressLine3'] = this.pageParams['AccountAddressLine3'];
        formData['AccountAddressLine4'] = this.pageParams['AccountAddressLine4'];
        formData['AccountAddressLine5'] = this.pageParams['AccountAddressLine5'];
        formData['AccountAddressPostcode'] = this.pageParams['AccountAddressPostcode'];
        formData['AccountAddressContactName'] = this.pageParams['AccountAddressContactName'];
        formData['AccountAddressContactPosn'] = this.pageParams['AccountAddressContactPosn'];
        formData['AccountAddressContactPhone'] = this.pageParams['AccountAddressContactPhone'];
        formData['AccountAddressContactMobile'] = this.pageParams['AccountAddressContactMobile'];
        formData['AccountAddressContactEmail'] = this.pageParams['AccountAddressContactEmail'];

        formData['PremiseAddressName'] = this.pageParams['PremiseAddressName'];
        formData['PremiseAddressLine1'] = this.pageParams['PremiseAddressLine1'];
        formData['PremiseAddressLine2'] = this.pageParams['PremiseAddressLine2'];
        formData['PremiseAddressLine3'] = this.pageParams['PremiseAddressLine3'];
        formData['PremiseAddressLine4'] = this.pageParams['PremiseAddressLine4'];
        formData['PremiseAddressLine5'] = this.pageParams['PremiseAddressLine5'];
        formData['PremiseAddressContactName'] = this.pageParams['PremiseAddressContactName'];
        formData['PremiseAddressContactName'] = this.pageParams['PremiseAddressContactName'];
        formData['PremiseAddressContactPosn'] = this.pageParams['PremiseAddressContactPosn'];
        formData['PremiseAddressContactPhone'] = this.pageParams['PremiseAddressContactPhone'];
        formData['PremiseAddressContactMobile'] = this.pageParams['PremiseAddressContactMobile'];
        formData['PremiseAddressContactEmail'] = this.pageParams['PremiseAddressContactEmail'];

        formData['ProAcctAddressName'] = this.pageParams['ProAcctAddressName'];
        formData['ProAcctAddressLine1'] = this.pageParams['ProAcctAddressLine1'];
        formData['ProAcctAddressLine2'] = this.pageParams['ProAcctAddressLine2'];
        formData['ProAcctAddressLine3'] = this.pageParams['ProAcctAddressLine3'];
        formData['ProAcctAddressLine4'] = this.pageParams['ProAcctAddressLine4'];
        formData['ProAcctAddressLine5'] = this.pageParams['ProAcctAddressLine5'];
        formData['ProAcctAddressPostcode'] = this.pageParams['ProAcctAddressPostcode'];
        formData['ProAcctAddressContactName'] = this.pageParams['ProAcctAddressContactName'];
        formData['ProAcctAddressContactPosn'] = this.pageParams['ProAcctAddressContactPosn'];
        formData['ProAcctAddressContactPhone'] = this.pageParams['ProAcctAddressContactPhone'];
        formData['ProAcctAddressContactMobile'] = this.pageParams['ProAcctAddressContactMobile'];
        formData['ProAcctAddressContactEmail'] = this.pageParams['ProAcctAddressContactEmail'];

        formData['ProPremAddressName'] = this.pageParams['ProPremAddressName'];
        formData['ProPremAddressLine1'] = this.pageParams['ProPremAddressLine1'];
        formData['ProPremAddressLine2'] = this.pageParams['ProPremAddressLine2'];
        formData['ProPremAddressLine3'] = this.pageParams['ProPremAddressLine3'];
        formData['ProPremAddressLine4'] = this.pageParams['ProPremAddressLine4'];
        formData['ProPremAddressLine5'] = this.pageParams['ProPremAddressLine5'];
        formData['ProPremAddressPostcode'] = this.pageParams['ProPremAddressPostcode'];
        formData['ProPremAddressContactName'] = this.pageParams['ProPremAddressContactName'];
        formData['ProPremAddressContactPosn'] = this.pageParams['ProPremAddressContactPosn'];
        formData['ProPremAddressContactPhone'] = this.pageParams['ProPremAddressContactPhone'];
        formData['ProPremAddressContactMobile'] = this.pageParams['ProPremAddressContactMobile'];
        formData['ProPremAddressContactEmail'] = this.pageParams['ProPremAddressContactEmail'];
        if (this.mode['addMode']) {
            requestParam = {
                action: 1
            };
        } else {
            requestParam = {
                action: 2
            };
        }
        this.workOrderPost('', requestParam, formData).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.modalAdvService.emitError(new ICabsModalVO(data['oResponse']));
            } else {
                if (data['hasError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                } else {
                    this.formPristine();
                    let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully);
                    modalVO.closeCallback = this.riMaintenanceAfterSave.bind(this);
                    this.modalAdvService.emitMessage(modalVO);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
        }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
        });
    }
    /**
     * This function is a handler for cancel operation
     */
    public cancelOnClick(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        setTimeout(() => {
            this.uiForm.setValue(this.formRawClone);
            this.pageParams = JSON.parse(JSON.stringify(this.paramsClone));
            this.fieldVisibility = JSON.parse(JSON.stringify(this.fieldVisibilityClone));
            this.fieldRequired = JSON.parse(JSON.stringify(this.fieldRequiredClone));
            this.setBtnText();
            this.postInit();
            this.formPristine();
        }, 0);
    }
    /**
     * This function is click handler for delete operation
     */
    public deleteOnClick(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteCallBack.bind(this)));
    }
    /**
     * This function is performs the delete operation
     */
    public deleteCallBack(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let formData: Object = {
            WONumber: this.getControlValue('WONumber') || ''
        };
        this.workOrderPost('', { action: 3 }, formData).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.modalAdvService.emitError(new ICabsModalVO(data['oResponse']));
            } else {
                if (data['hasError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                } else {
                    this.formPristine();
                    let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully);
                    modalVO.closeCallback = this.riMaintenanceAfterDelete.bind(this);
                    this.modalAdvService.emitMessage(modalVO);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
        }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
        });
    }
    /**
     * This function is a handler for save operation
     */
    public saveOnClick(): void {
        let result = this.beforeSave();
        if (result) {
            if (this.riMaintenanceBeforeSave()) {
                return;
            }
            this.riMaintenanceBeforeConfirm();
        }
        this.utils.makeTabsRed();
    }
    /**
     * This function gets called when keyup event is triggered on save button
     * @param event
     */
    public saveOnKeyUp(event: Object): void {
        this.validateTabs();
        this.utils.tabSwitchOnTab(event);
    }
    /**
     * This function gets triggered on grid body click
     * @param event
     */
    public gridBodyOnClick(event: Object): void {
        this.pageParams['RelatedWONumber'] = this.riGrid.Details.GetValue('grWONumber');
    }
    /**
     * This function gets triggered on grid body double click
     * @param event
     */
    public gridBodyOnDblClick(event: Object): void {
        this.gridBodyOnClick({});
        let relatedWONumber = this.riGrid.Details.GetValue('grWONumber');
        switch (this.riGrid.CurrentColumnName) {
            case 'grWONumber':
                if (this.pageParams['RelatedWONumber'] !== this.getControlValue('WONumber')) {
                    this.navigate('WorkOrderMaintenance', InternalMaintenanceServiceModuleRoutes.ICABSCMWORKORDERMAINTENANCE + '/' + relatedWONumber, {
                        parentMode: 'WorkOrderMaintenance',
                        RelatedWONumber: relatedWONumber
                    });
                }
                break;

            default:
                break;
        }
    }
    /**
     * This function is a handler for change event on AdressCodeSelect
     * @param event
     */
    public addressCodeSelectOnChange(event: Object): void {
        switch (this.getControlValue('AddressCodeSelect')) {
            case 'account':
                this.setControlValue('AddressName', this.pageParams['AccountAddressName']);
                this.setControlValue('AddressLine1', this.pageParams['AccountAddressLine1']);
                this.setControlValue('AddressLine2', this.pageParams['AccountAddressLine2']);
                this.setControlValue('AddressLine3', this.pageParams['AccountAddressLine3']);
                this.setControlValue('AddressLine4', this.pageParams['AccountAddressLine4']);
                this.setControlValue('AddressLine5', this.pageParams['AccountAddressLine5']);
                this.setControlValue('AddressPostcode', this.pageParams['AccountAddressPostcode']);
                this.setControlValue('AddressContactName', this.pageParams['AccountAddressContactName']);
                this.setControlValue('AddressContactPosn', this.pageParams['AccountAddressContactPosn']);
                this.setControlValue('AddressContactPhone', this.pageParams['AccountAddressContactPhone']);
                this.setControlValue('AddressContactMobile', this.pageParams['AccountAddressContactMobile']);
                this.setControlValue('AddressContactEmail', this.pageParams['AccountAddressContactEmail']);
                break;
            case 'premise':
                this.setControlValue('AddressName', this.pageParams['PremiseAddressName']);
                this.setControlValue('AddressLine1', this.pageParams['PremiseAddressLine1']);
                this.setControlValue('AddressLine2', this.pageParams['PremiseAddressLine2']);
                this.setControlValue('AddressLine3', this.pageParams['PremiseAddressLine3']);
                this.setControlValue('AddressLine4', this.pageParams['PremiseAddressLine4']);
                this.setControlValue('AddressLine5', this.pageParams['PremiseAddressLine5']);
                this.setControlValue('AddressPostcode', this.pageParams['PremiseAddressPostcode']);
                this.setControlValue('AddressContactName', this.pageParams['PremiseAddressContactName']);
                this.setControlValue('AddressContactPosn', this.pageParams['PremiseAddressContactPosn']);
                this.setControlValue('AddressContactPhone', this.pageParams['PremiseAddressContactPhone']);
                this.setControlValue('AddressContactMobile', this.pageParams['PremiseAddressContactMobile']);
                this.setControlValue('AddressContactEmail', this.pageParams['PremiseAddressContactEmail']);
                break;
            case 'prospectaccount':
                this.setControlValue('AddressName', this.pageParams['ProAcctAddressName']);
                this.setControlValue('AddressLine1', this.pageParams['ProAcctAddressLine1']);
                this.setControlValue('AddressLine2', this.pageParams['ProAcctAddressLine2']);
                this.setControlValue('AddressLine3', this.pageParams['ProAcctAddressLine3']);
                this.setControlValue('AddressLine4', this.pageParams['ProAcctAddressLine4']);
                this.setControlValue('AddressLine5', this.pageParams['ProAcctAddressLine5']);
                this.setControlValue('AddressPostcode', this.pageParams['ProAcctAddressPostcode']);
                this.setControlValue('AddressContactName', this.pageParams['ProAcctAddressContactName']);
                this.setControlValue('AddressContactPosn', this.pageParams['ProAcctAddressContactPosn']);
                this.setControlValue('AddressContactPhone', this.pageParams['ProAcctAddressContactPhone']);
                this.setControlValue('AddressContactMobile', this.pageParams['ProAcctAddressContactMobile']);
                this.setControlValue('AddressContactEmail', this.pageParams['ProAcctAddressContactEmail']);
                break;
            case 'prospectpremise':
                this.setControlValue('AddressName', this.pageParams['ProPremAddressName']);
                this.setControlValue('AddressLine1', this.pageParams['ProPremAddressLine1']);
                this.setControlValue('AddressLine2', this.pageParams['ProPremAddressLine2']);
                this.setControlValue('AddressLine3', this.pageParams['ProPremAddressLine3']);
                this.setControlValue('AddressLine4', this.pageParams['ProPremAddressLine4']);
                this.setControlValue('AddressLine5', this.pageParams['ProPremAddressLine5']);
                this.setControlValue('AddressPostcode', this.pageParams['ProPremAddressPostcode']);
                this.setControlValue('AddressContactName', this.pageParams['ProPremAddressContactName']);
                this.setControlValue('AddressContactPosn', this.pageParams['ProPremAddressContactPosn']);
                this.setControlValue('AddressContactPhone', this.pageParams['ProPremAddressContactPhone']);
                this.setControlValue('AddressContactMobile', this.pageParams['ProPremAddressContactMobile']);
                this.setControlValue('AddressContactEmail', this.pageParams['ProPremAddressContactEmail']);
                break;
        }
    }
    /**
     * This function is a handler for change event on ProspectNumber
     */
    public prospectNumberOnChange(returnSubscription: boolean): any {
        let formdata: Object = {};
        if (!this.utils.isFalsy(this.pageParams['CustomerContactNumber'])) {
            formdata = Object.assign(formdata, {
                CustomerContactNumber: this.pageParams['CustomerContactNumber']
            });
        }
        let prospectNumber = this.getControlValue('ProspectNumber');
        if (!this.utils.isFalsy(prospectNumber)) {
            formdata = Object.assign(formdata, {
                ProspectNumber: prospectNumber
            });
        }
        if (!this.utils.isFalsy(this.pageParams['URL'])) {
            formdata = Object.assign(formdata, {
                URL: this.pageParams['URL']
            });
        }
        let woInitialNotes = this.getControlValue('WOInitialNotes');
        if (!this.utils.isFalsy(woInitialNotes)) {
            formdata = Object.assign(formdata, {
                WOInitialNotes: woInitialNotes
            });
        }
        if (returnSubscription) {
            return this.workOrderPost('ProspectNumberChange', {}, formdata);
        } else {
            this.workOrderPost('ProspectNumberChange', {}, formdata).subscribe((data) => {
                this.prospectNumberOnChangeInternal(data);
            }, (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            });
        }
    }
    /**
     * This function processes prospectnumber change operation
     * @param data
     */
    public prospectNumberOnChangeInternal(data: Object): void {
        if (data['status'] === GlobalConstant.Configuration.Failure) {
            this.modalAdvService.emitError(new ICabsModalVO(data['oResponse']));
        } else {
            if (data['hasError']) {
                this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
            } else {
                this.populateFormAndParams(data);
                this.buildMenu();
                this.buildAddressSelect();
            }
        }
    }
    /**
     * This function is handler for woDate change event
     * @param value
     */
    public woDateOnChange(value: Object): void {
        if (value && value['value']) {
            this.setControlValue('WODate', value['value']);
            this.setControlValue('WOToDate', value['value']);
            this.uiForm.controls['WODate'].markAsDirty();
        }
    }
    /**
     * This function is handler for woToDate change event
     * @param value
     */
    public woToDateOnChange(value: Object): void {
        if (value && value['value']) {
            this.setControlValue('WOToDate', value['value']);
            this.uiForm.controls['WOToDate'].markAsDirty();
        }
        let woToDate = this.globalize.parseDateStringToDate(this.getControlValue('WOToDate'));
        let woDate = this.globalize.parseDateStringToDate(this.getControlValue('WODate'));
        if (woToDate < woDate) {
            this.setControlValue('WOToDate', this.getControlValue('WODate'));
        }
    }
    /**
     * This function is handler for woStatusCodeSelect change event
     */
    public woStatusCodeSelectOnChange(): void {
        this.pageParams['WOStatusCode'] = this.getControlValue('WOStatusCodeSelect');
        if (this.pageParams['WOStatusCode'] === 'UNKNOWN') {
            this.uiForm.controls['ContactMediumCodeSelect'].disable();
            this.fieldVisibility['spanSurveyComplete'] = false;
            this.uiForm.controls['WOResultNotes'].disable();
            this.uiForm.controls['EmployeeCode'].disable();
            this.uiForm.controls['WOResultDate'].disable();
            this.uiForm.controls['WOResultAllDayInd'].disable();
            this.uiForm.controls['WOResultStartTime'].disable();
            this.uiForm.controls['WOResultEndTime'].disable();
            this.uiForm.controls['CmdCheckResultAvail'].disable();
            this.uiForm.controls['WOResultStartTime'].disable();
            this.uiForm.controls['WOResultEndTime'].disable();
            this.uiForm.controls['CmdCheckResultAvail'].disable();
            this.fieldVisibility['ResultAppointmentDetails'] = false;
            this.fieldVisibility['QuotedInd'] = false;
            this.setControlValue('QuotedInd', false);
            this.fieldVisibility['ResultEmployeeDetails'] = false;
            this.quotedIndOnChange();
        } else {
            this.uiForm.controls['ContactMediumCodeSelect'].enable();
            this.uiForm.controls['WOResultNotes'].enable();
            this.uiForm.controls['EmployeeCode'].enable();
            this.uiForm.controls['WOResultDate'].enable();
            this.uiForm.controls['WOResultAllDayInd'].enable();
            this.uiForm.controls['WOResultStartTime'].enable();
            this.uiForm.controls['WOResultEndTime'].enable();
            this.uiForm.controls['CmdCheckResultAvail'].enable();

            let formdata: Object = {
                CustomerContactNumber: this.pageParams['CustomerContactNumber'],
                WODate: this.getControlValue('WODate'),
                WOStatusCode: this.pageParams['WOStatusCode']
            };
            this.workOrderPost('GetWOStatusDetails', {}, formdata).subscribe((data) => {
                if (data['status'] === GlobalConstant.Configuration.Failure) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['oResponse']));
                } else {
                    if (data['hasError']) {
                        this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                    } else {
                        this.pageParams['DiaryDateLabel'] = data['DiaryDateLabel'];
                        this.pageParams['ChangeEmployeeInd'] = data['ChangeEmployeeInd'];
                        this.pageParams['DefaultTimesToZeroInd'] = data['DefaultTimesToZeroInd'];
                        this.pageParams['DateIsMandatoryInd'] = data['DateIsMandatoryInd'];
                        this.pageParams['QuoteDetailsEntryInd'] = data['QuoteDetailsEntryInd'];
                        this.pageParams['AmendProspectStatusInd'] = data['AmendProspectStatusInd'];
                        this.pageParams['AllowSurveyCompleteInd'] = data['AllowSurveyCompleteInd'];

                        this.fieldVisibility['ReassignEmployee'] = false;
                        this.setControlValue('ReassignEmployeeCode', '');
                        this.setControlValue('ReassignEmployeeName', '');
                        if (data['ReassignEmployeeCode']) {
                            this.setControlValue('ReassignEmployeeCode', data['ReassignEmployeeCode']);
                            this.setControlValue('ReassignEmployeeName', data['ReassignEmployeeName']);
                            if (this.getControlValue('ReassignEmployeeCode') !== this.getControlValue('EmployeeCode')) {
                                this.fieldVisibility['ReassignEmployee'] = true;
                                this.uiForm.controls['CmdReassignTo'].enable();
                            }
                        }
                        if (data['AllowSurveyCompleteInd'] === 'Y') {
                            this.fieldVisibility['spanSurveyComplete'] = true;
                        } else {
                            this.fieldVisibility['spanSurveyComplete'] = false;
                        }

                        if (data['ChangeEmployeeInd'] === 'Y') {
                            this.fieldVisibility['ResultEmployeeDetails'] = true;
                        } else {
                            this.fieldVisibility['ResultEmployeeDetails'] = false;
                        }

                        if (data['DiaryDateLabel'] === '') {
                            this.fieldVisibility['ResultAppointmentDetails'] = false;
                            this.setControlValue('WOResultCreateAppt', false);
                        } else {
                            this.setControlValue('WOResultDate', data['WOResultDate']);
                            this.pageParams['spanWOResultDate'] = data['DiaryDateLabel'];
                            if (data['DefaultTimesToZeroInd'] === 'Y') {
                                this.setControlValue('WOResultStartTime', '00:00');
                                this.setControlValue('WOResultEndTime', '00:00');
                            } else {
                                this.setControlValue('WOResultStartTime', this.getControlValue('WOStartTime'));
                                this.setControlValue('WOResultEndTime', this.getControlValue('WOEndTime'));
                            }
                            if (data['DateIsMandatoryInd'] === 'Y') {
                                this.uiForm.controls['WOResultCreateAppt'].disable();
                            } else {
                                this.uiForm.controls['WOResultCreateAppt'].enable();
                            }
                            this.setControlValue('WOResultCreateAppt', true);
                            this.woResultCreateApptOnChange();
                            this.fieldVisibility['ResultAppointmentDetails'] = true;
                        }

                        if (data['AmendProspectStatusInd'] === 'Y') {
                            this.setControlValue('AmendProspectStatusInd', true);
                        } else {
                            this.setControlValue('AmendProspectStatusInd', false);
                        }

                        if (data['QuoteDetailsEntryInd'] === 'Y') {
                            this.fieldVisibility['QuotedInd'] = true;
                        } else {
                            this.fieldVisibility['QuotedInd'] = false;
                        }
                        this.setControlValue('QuotedInd', false);
                        this.getToWOTypeCodes(false);
                        this.quotedIndOnChange();
                        this.formDisableBasedOnAmendRights();
                    }
                }
            }, (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            });
        }
    }
    /**
     * This function is handler for woTypeCodeSelect change event
     */
    public woTypeCodeSelectOnChange(): void {
        this.pageParams['WOTypeCode'] = this.getControlValue('WOTypeCodeSelect');
        this.setControlValue('WOToDate', this.getControlValue('WODate'));
        this.pageParams['WOTypeDefaultAllDayInd'] = !this.utils.isFalsy(this.pageParams['WOTypeDefaultAllDayInd']) ? this.pageParams['WOTypeDefaultAllDayInd'] : '';
        if (!this.internalVariables['UpdatingRecord']) {
            if (this.pageParams['WOTypeDefaultAllDayInd'] && this.pageParams['WOTypeDefaultAllDayInd'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0) {
                this.setControlValue('AllDayInd', true);
            } else {
                this.setControlValue('AllDayInd', false);
            }
            this.allDayIndOnChange();
        }

        if (this.mode['addMode'] === true) {
            this.getWOStatusCodeList(true).subscribe((data) => {
                this.getWOStatusCodeListInternal(data);
                this.woTypeCodeSelectInternal();
            }, (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
            });
        } else {
            this.woTypeCodeSelectInternal();
        }
    }
    /**
     * This function processes woTypeCodeSelect change operation
     */
    public woTypeCodeSelectInternal(): void {
        this.pageParams['WOTypeAutoClose'] = !this.utils.isFalsy(this.pageParams['WOTypeAutoClose']) ? this.pageParams['WOTypeAutoClose'] : '';
        this.pageParams['WOTypeContactRedirect'] = !this.utils.isFalsy(this.pageParams['WOTypeContactRedirect']) ? this.pageParams['WOTypeContactRedirect'] : '';
        this.pageParams['WOTypeProspectRequired'] = !this.utils.isFalsy(this.pageParams['WOTypeProspectRequired']) ? this.pageParams['WOTypeProspectRequired'] : '';
        this.pageParams['WOTypeAdditionalEmpl'] = !this.utils.isFalsy(this.pageParams['WOTypeAdditionalEmpl']) ? this.pageParams['WOTypeAdditionalEmpl'] : '';
        if ((this.pageParams['WOTypeAutoClose'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0 && this.internalVariables['lResultTabIsVisible']) || (this.pageParams['WOTypeAutoClose'].indexOf(this.getControlValue('WOTypeCodeSelect')) < 0 && !this.internalVariables['lResultTabIsVisible']) || (this.pageParams['WOTypeProspectRequired'].indexOf(this.getControlValue('WOTypeCodeSelect')) < 0 && this.internalVariables['lHistoryTabIsVisible']) || (this.pageParams['WOTypeProspectRequired'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0 && !this.internalVariables['lHistoryTabIsVisible']) || (this.pageParams['WOTypeAdditionalEmpl'].indexOf(this.getControlValue('WOTypeCodeSelect')) < 0 && this.internalVariables['lEmployeeTabIsVisible']) || ((this.pageParams['WOTypeAdditionalEmpl'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0 && !this.internalVariables['lEmployeeTabIsVisible']))) {
            this.buildTab();
        }
        if ((this.pageParams['WOTypeProspectRequired'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0)) {
            this.uiForm.controls['ProspectNumber'].disable();
            this.uiForm.controls['WOToDate'].disable();
            this.setControlValue('ProspectNumber', this.pageParams['SaveProspectNumber']);
            this.fieldVisibility['ContactTypeDetails'] = true;
            this.buildTab();
            this.prospectNumberOnChange(false);
        } else {
            this.fieldVisibility['ContactTypeDetails'] = false;
            this.buildTab();
            this.uiForm.controls['ProspectNumber'].disable();
            if (this.internalVariables['UpdatingRecord']) {
                this.uiForm.controls['WOToDate'].disable();
            } else {
                this.uiForm.controls['WOToDate'].enable();
            }
            this.setControlValue('ProspectNumber', '');
            if (this.parentMode === 'DiaryDayNewAppointment' || this.parentMode === 'WorkOrderGridAdd' || this.parentMode === 'CallCentreSearchAdd') {
                this.setControlValue('WOInitialNotes', '');
            }
        }

        if ((this.pageParams['WOTypeContactRedirect'].indexOf(this.getControlValue('WOTypeCodeSelect')) >= 0)) {
            this.fieldVisibility['EmployeeRedirect'] = true;
            if (!this.internalVariables['UpdatingRecord']) {
                this.setControlValue('RedirectInd', false);
            }
        } else {
            this.fieldVisibility['EmployeeRedirect'] = false;
            this.setControlValue('RedirectInd', false);
        }
        this.reDirectIndOnChange();
    }
    /**
     * This function is handler for AllDay checkbox change event
     */
    public allDayIndOnChange(): void {
        if (this.getControlValue('AllDayInd')) {
            if (!this.internalVariables['UpdatingRecord']) {
                this.setControlValue('WOStartTime', '00:00');
                this.setControlValue('WOEndTime', '23:59');
            }
            this.uiForm.controls['WOEndTime'].disable();
        } else {
            if (!this.internalVariables['UpdatingRecord']) {
                this.setControlValue('WOStartTime', this.pageParams['DefaultStartTime']);
                this.setControlValue('WOEndTime', this.pageParams['DefaultEndTime']);
            }
            this.uiForm.controls['WOEndTime'].enable();
        }
    }
    /**
     * This function is handler for RedirectInd change event
     */
    public reDirectIndOnChange(): void {
        if (this.getControlValue('RedirectInd')) {
            this.uiForm.controls['EmployeeCodeRedirect'].enable();
            this.uiForm.controls['EmployeeNameRedirect'].enable();
        } else {
            this.uiForm.controls['EmployeeCodeRedirect'].disable();
            this.uiForm.controls['EmployeeNameRedirect'].disable();
        }
    }
    /**
     * This function is handler for cmdReassignTo click event
     */
    public cmdReassignToOnClick(): void {
        let cSaveCode: string;
        let cSaveName: string;
        cSaveCode = this.getControlValue('EmployeeCode');
        cSaveName = this.getControlValue('EmployeeName');
        this.setControlValue('EmployeeCode', this.getControlValue('ReassignEmployeeCode'));
        this.setControlValue('EmployeeName', this.getControlValue('ReassignEmployeeName'));
        this.setControlValue('ReassignEmployeeCode', cSaveCode);
        this.setControlValue('ReassignEmployeeName', cSaveName);
    }
    /**
     * This function is handler for  woStartTime change event
     */
    public woStartTimeOnChange(): void {
        let formattedTime = this.globalize.formatTimeToLocaleFormat(this.getControlValue('WOStartTime'));
        let formdata: Object = {
            WOStartTime: formattedTime ? formattedTime : this.getControlValue('WOStartTime')
        };
        this.workOrderPost('CalculateNewEndTime', {}, formdata).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.modalAdvService.emitError(new ICabsModalVO(data['oResponse']));
            } else {
                if (data['hasError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                } else {
                    this.setControlValue('WOEndTime', data['WOEndTime'] ? this.globalize.formatTimeToLocaleFormat(data['WOEndTime']) : '');
                }
            }
        }, (error) => {
            this.modalAdvService.emitError(new ICabsModalVO(error['errorMessage'] || ErrorConstant.Message.UnexpectedError));
        });
    }
    /**
     * This function is handler for cmdCheckResultAvail click event
     */
    public cmdCheckResultAvailOnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode'), this.getControlValue('EmployeeName'), this.getControlValue('WOResultDate'), true);
    }
    /**
     * This function is handler for cmdCheckAvail01 click event
     */
    public cmdCheckAvail01OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode01'), this.getControlValue('EmployeeName01'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for cmdCheckAvail02 click event
     */
    public cmdCheckAvail02OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode02'), this.getControlValue('EmployeeName02'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for cmdCheckAvail03 click event
     */
    public cmdCheckAvail03OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode03'), this.getControlValue('EmployeeName03'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for cmdCheckAvail04 click event
     */
    public cmdCheckAvail04OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode04'), this.getControlValue('EmployeeName04'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for cmdCheckAvail05 click event
     */
    public cmdCheckAvail05OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode05'), this.getControlValue('EmployeeName05'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for cmdCheckAvail06 click event
     */
    public cmdCheckAvail06OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode06'), this.getControlValue('EmployeeName06'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for cmdCheckAvail07 click event
     */
    public cmdCheckAvail07OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode07'), this.getControlValue('EmployeeName07'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for cmdCheckAvail08 click event
     */
    public cmdCheckAvail08OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode08'), this.getControlValue('EmployeeName08'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for cmdCheckAvail09 click event
     */
    public cmdCheckAvail09OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode09'), this.getControlValue('EmployeeName09'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for cmdCheckAvail10 click event
     */
    public cmdCheckAvail10OnClick(): void {
        this.checkAvailability(this.getControlValue('EmployeeCode10'), this.getControlValue('EmployeeName10'), this.getControlValue('WODate'), false);
    }
    /**
     * This function is handler for ellipsis data event for employee input boxes
     */
    public employeeOnDataRecieved(data: Object, controlName: string, controlDesc: string): void {
        if (data) {
            this.setControlValue(controlName, data['EmployeeCode']);
            this.setControlValue(controlDesc, data['EmployeeSurName']);
            this.uiForm.controls[controlName].markAsDirty();
        }
    }
    /**
     * This function is handler for employee change event
     */
    public employeeOnChange(controlName: string, controlDesc: string): void {
        if (this.uiForm.controls[controlName] && this.uiForm.controls[controlName].value) {
            let data = [{
                'table': 'Employee',
                'query': { 'EmployeeCode': this.getControlValue(controlName), BusinessCode: this.utils.getBusinessCode() },
                'fields': ['EmployeeCode', 'EmployeeSurname']
            }];
            this.lookUpRecord(data, 5).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0) {
                        if (e['results'][0].length > 0) {
                            this.setControlValue(controlDesc, e['results'][0][0]['EmployeeSurname']);
                        } else {
                            this.setControlValue(controlDesc, '');
                        }
                    }
                },
                (error) => {
                    // error statement
                }
            );
        }
    }
    /**
     * This function is handler for ellipsis data event for employeeCodeCreate
     */
    public employeeCodeCreateOnDataRecieved(data: Object): void {
        if (data) {
            this.setControlValue('EmployeeCodeCreate', data['EmployeeCode']);
            this.setControlValue('EmployeeNameCreate', data['EmployeeSurName']);
            this.uiForm.controls['EmployeeCodeCreate'].markAsDirty();
        }
    }
    /**
     * This function is handler for ellipsis data event for employeeCodeRedirect
     */
    public employeeCodeRedirectOnDataRecieved(data: Object): void {
        if (data) {
            this.setControlValue('EmployeeCodeRedirect', data['EmployeeCode']);
            this.setControlValue('EmployeeNameRedirect', data['EmployeeSurName']);
            this.uiForm.controls['EmployeeCodeRedirect'].markAsDirty();
        }
    }
    /**
     * This function is handler for ellipsis data event for reassignEmployee
     */
    public reassignEmployeeOnDataRecieved(data: Object): void {
        if (data) {
            this.setControlValue('ReassignEmployeeCode', data['EmployeeCode']);
            this.setControlValue('ReassignEmployeeName', data['EmployeeSurName']);
            this.uiForm.controls['ReassignEmployeeCode'].markAsDirty();
        }
    }
    /**
     * This function is handler for quotedInd change event
     */
    public quotedIndOnChange(): void {
        if (this.getControlValue('QuotedInd')) {
            this.fieldVisibility['QuoteNumberHeadings'] = true;
            this.fieldVisibility['QuoteNumberDetails'] = true;
            this.fieldVisibility['QuoteValueDetails'] = true;
        } else {
            this.fieldVisibility['QuoteNumberHeadings'] = false;
            this.fieldVisibility['QuoteNumberDetails'] = false;
            this.fieldVisibility['QuoteValueDetails'] = false;
        }
    }
    /**
     * This function is handler for woResultCreateAppt change event
     */
    public woResultCreateApptOnChange(): void {
        if (this.getControlValue('WOResultCreateAppt')) {
            this.uiForm.controls['WOResultAllDayInd'].enable();
            this.uiForm.controls['WOResultDate'].enable();
            this.uiForm.controls['WOResultStartTime'].enable();
            this.uiForm.controls['WOResultEndTime'].enable();
            this.uiForm.controls['CmdCheckResultAvail'].enable();
        } else {
            this.uiForm.controls['WOResultAllDayInd'].disable();
            this.uiForm.controls['WOResultDate'].disable();
            this.uiForm.controls['WOResultStartTime'].disable();
            this.uiForm.controls['WOResultEndTime'].disable();
            this.uiForm.controls['CmdCheckResultAvail'].disable();
        }
    }
    /**
     * This function is handler for cmdClearAttend click event
     */
    public cmdClearAttendOnClick(): void {
        this.setControlValue('EmployeeCode01', '');
        this.setControlValue('EmployeeName01', '');
        this.setControlValue('EmployeeCode02', '');
        this.setControlValue('EmployeeName02', '');
        this.setControlValue('EmployeeCode03', '');
        this.setControlValue('EmployeeName03', '');
        this.setControlValue('EmployeeCode04', '');
        this.setControlValue('EmployeeName04', '');
        this.setControlValue('EmployeeCode05', '');
        this.setControlValue('EmployeeName05', '');
        this.setControlValue('EmployeeCode06', '');
        this.setControlValue('EmployeeName06', '');
        this.setControlValue('EmployeeCode07', '');
        this.setControlValue('EmployeeName07', '');
        this.setControlValue('EmployeeCode08', '');
        this.setControlValue('EmployeeName08', '');
        this.setControlValue('EmployeeCode09', '');
        this.setControlValue('EmployeeName09', '');
        this.setControlValue('EmployeeCode10', '');
        this.setControlValue('EmployeeName10', '');
    }
    /**
     * This function is handler for estimatedContractQuotes change event
     */
    public estimatedContractQuotesOnChange(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedContractValue', false);
        this.fieldRequired['EstimatedContractValue'] = false;
        if (this.getControlValue('EstimatedContractQuotes') === 0 && this.getControlValue('EstimatedContractQuotes') === null) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedContractValue', true);
            this.fieldRequired['EstimatedContractValue'] = true;
        }
        this.calculateTotalQuotes();
    }
    /**
     * This function is handler for estimatedJobQuotes change event
     */
    public estimatedJobQuotesOnChange(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedJobValue', false);
        this.fieldRequired['EstimatedJobValue'] = false;
        if (this.getControlValue('EstimatedJobQuotes') === 0 && this.getControlValue('EstimatedJobQuotes') === null) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedJobValue', true);
            this.fieldRequired['EstimatedJobValue'] = true;
        }
        this.calculateTotalQuotes();
    }
    /**
     * This function is handler for estimatedProductSaleQuotes change event
     */
    public estimatedProductSaleQuotesOnChange(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedProductSaleValue', false);
        this.fieldRequired['EstimatedProductSaleValue'] = false;
        if (this.getControlValue('EstimatedProductSaleQuotes') === 0 && this.getControlValue('EstimatedProductSaleQuotes') === null) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedProductSaleValue', true);
            this.fieldRequired['EstimatedProductSaleValue'] = true;
        }
        this.calculateTotalQuotes();
    }
    /**
     * This function is handler for estimatedContractValue change event
     */
    public estimatedContractValueOnChange(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedContractQuotes', false);
        this.fieldRequired['EstimatedContractQuotes'] = false;
        if (this.getControlValue('EstimatedContractValue') === 0 && this.getControlValue('EstimatedContractValue') === null) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedContractQuotes', true);
            this.fieldRequired['EstimatedContractQuotes'] = true;
        }
        this.calculateTotalValues();
    }
    /**
     * This function is handler for estimatedJobValue change event
     */
    public estimatedJobValueOnChange(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedJobQuotes', false);
        this.fieldRequired['EstimatedJobQuotes'] = false;
        if (this.getControlValue('EstimatedJobValue') === 0 && this.getControlValue('EstimatedJobValue') === null) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedJobQuotes', true);
            this.fieldRequired['EstimatedJobQuotes'] = true;
        }
        this.calculateTotalValues();
    }
    /**
     * This function is handler for estimatedProductSaleValue change event
     */
    public estimatedProductSaleValueOnChange(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedProductSaleQuotes', false);
        this.fieldRequired['EstimatedProductSaleQuotes'] = false;
        if (this.getControlValue('EstimatedProductSaleValue') === 0 && this.getControlValue('EstimatedProductSaleValue') === null) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EstimatedProductSaleQuotes', true);
            this.fieldRequired['EstimatedProductSaleQuotes'] = true;
        }
        this.calculateTotalValues();
    }

}
