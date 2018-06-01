import { InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, ElementRef, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Subscription } from 'rxjs/Subscription';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
import { ProductSearchGridComponent } from '../../internal/search/iCABSBProductSearch';
import { ContractActionTypes } from '../../actions/contract';
import { PremiseLocationSearchComponent } from '../../internal/search/iCABSAPremiseLocationSearch.component';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { BranchServiceAreaSearchComponent } from '../../internal/search/iCABSBBranchServiceAreaSearch';
import { InternalGridSearchModuleRoutes, AppModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { ComponentTypeLanguageSearchComponent } from '../../internal/search/iCABSBComponentTypeLanguageSearch.component';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GlobalizeService } from './../../../shared/services/globalize.service';
import { ProductAttributeValuesSearchComponent } from '../../internal/search/iCABSBProductAttributeValuesSearch.component';

@Component({
    templateUrl: 'iCABSAServiceCoverDisplayEntry.html'
})

export class ServiceCoverDisplayEntryComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('componentGrid') componentGrid: GridComponent;
    @ViewChild('componentGridPagination') componentGridPagination: PaginationComponent;
    @ViewChild('scheduleTypeSelectDropdown') scheduleTypeSelectDropdown: DropdownStaticComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('promptConfirmModalDelete') public promptConfirmModalDelete;
    @ViewChild('employeeSearchEllipsis') employeeSearchEllipsis: EllipsisComponent;
    @ViewChild('effectiveDateChild') effectiveDateChild: DatepickerComponent;
    @ViewChild('initialComponentsDateChild') initialComponentsDateChild: DatepickerComponent;
    @ViewChild('premisesLocationEllipsis') premisesLocationEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChildren('cddCompTypeLangSearch') cddCompTypeLangSearch: QueryList<ComponentTypeLanguageSearchComponent>;

    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverDisplayEntry',
        module: 'contract-admin',
        method: 'contract-management/grid'
    };
    public sheduleTypeDisabled: boolean = false;
    public screenNotReadyComponent = ScreenNotReadyComponent;
    public branchServiceAreaSearcComponent = BranchServiceAreaSearchComponent;
    public inputParamsbranchServiceAreaSearc: any = { 'parentMode': 'LookUp-SCDisplay' };
    public isEmployeeSearchEllipsisDisabled: boolean = false;
    public inputParamsEmployeeSearch: any = { 'parentMode': 'LookUp-ServiceCoverCommissionEmployee' };
    public inputParamsInstallationEmployeeSearch: any = { 'parentMode': 'LookUp-InstallationEmployee' };
    public employeeSearchComponent = EmployeeSearchComponent;
    public initialFormData: any = {};
    public menuOptionsGroupscd: Array<any> = [{}];
    public menuOptionsGroupsc: Array<any> = [{}];
    public pageId: string = '';
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number;
    public maxColumn: number = 11;
    public search = new URLSearchParams();
    public autoOpen: any = '';
    public autoOpenSearch: boolean = false;
    private riGrid: any = {};
    public showHeader: boolean = true;
    private addAfterInit: boolean = false;
    public setFormFlag: any = {
        rotationalRuleOnChange: false,
        getPercentageValues: false,
        scheduleIDOonChange: false,
        branchServiceAreaCodeonChange: false,
        premiseLocationNumberOnChange: false,
        exchangesStartAfterDateSelectedValue: false,
        totalDisplayValues: false,
        displayValueOnChange: false,
        createform: true
    };
    private querySysChar: URLSearchParams = new URLSearchParams();
    public currentContractType: string = '';
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public premiseLocationEllipsis: any = {
        autoOpen: false,
        showCloseButton: true,
        childConfigParams: {
            'parentMode': 'LookUp',
            'showAddNew': false
        },
        modalConfig: {
            backdrop: 'static',
            keyboard: true
        },
        contentComponent: PremiseLocationSearchComponent,
        showHeader: true,
        searchModalRoute: '',
        disabled: false
    };
    public contractSearchParams: any = {
        'parentMode': 'ContractSearch',
        'currentContractType': 'C',
        'currentContractTypeURLParameter': '<contract>',
        'showAddNew': true
    };
    public additionalDataPost: Array<any> = [];
    public promptConfirmContent: any;
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    public showCloseButton: boolean = true;
    public contractSearchComponent = ContractSearchComponent;
    private lookUpSubscription: Subscription;
    public componentRows: Array<any> = [];
    public disableButtons: any = { delete: false, update: false };
    public isDisableEffectiveDate: boolean = false;
    public productSearchComponent: any = ProductSearchGridComponent;
    public productSearchParams: Array<any> = [];
    public AttributeCodeADisable: Array<any> = [];
    public AttributeCodeBDisable: Array<any> = [];
    public alternativeProductSearchParams: Array<any> = [];
    private ComponentColumnList: Array<any> = [
        'ComponentTypeCode',
        'ComponentTypeDesc',
        'ProductComponentCode',
        'AlternateProductCode',
        'ProductComponentDesc',
        'AttributeLabelA',
        'AttributeValueA',
        'AttributeLabelB',
        'AttributeValueB',
        'ComponentQuantity',
        'ProductRange',
        'ProductRangeDesc',
        'SequenceNumber',
        'RotationalInterval',
        'RotationalRule',
        'AttributeCodeA',
        'AttributeCodeB'
    ];
    private minRows: number = 6;
    private rowCount: number = 0;
    public currDate: any = null;
    public currDate2: any = null;
    public currDate3: any = null;
    public currDate4: any = null;
    public fieldRequired: any = {
        ServiceSalesEmployee: true,
        InstallByBranchInd: false,
        WEDValue: false,
        ServiceCoverItemCommenceDate: true,
        DisplayQty: false,
        EffectiveDate: false,
        InstallationEmployeeCode: false,
        ScheduleID: false,
        ExchangesStartAfterDate: false,
        ScheduleQty: false,
        RenegOldContract: false,
        RenegOldPremise: false,
        RenegOldValue: false
    };

    public fieldHidden: any = {
        WEDValue: true,
        divComp: true,
        tdExpectedTotals: true,
        tdGridControl: true,
        EffectiveDate: true,
        tdPopulate: false,
        DisplayQty: false,
        InitialComponentsDate: true,
        MaterialsValue: false,
        LabourValue: false,
        ReplacementValue: false,
        trInstallationEmployee: true,
        trInstallations: true,
        percentDisplay: false,
        CurrentWeek: true,
        ScheduleID: true,
        ScheduleDetails: true,
        ScheduleName: true,
        ScheduleQty: true,
        ExchangesStartAfterDate: true,
        BranchServiceAreaCode: true,
        ExchangesGenUpTo: true,
        RenegOldContract: true,
        RenegOldValue: true,
        RenegOldPremise: true,
        trComponentRange: true,
        customUpdate: true,
        MaterialsCost: false,
        LabourCost: true,
        ScheduleEmployeeCode: true,
        chkRenegContract: true
    };

    public functionMode: any = {
        snapShot: false,
        add: false,
        update: false,
        delete: false,
        select: false
    };
    public checkedStatus: any = {
        ScheduleSearch: false
    };
    public componentDropdownParam: Array<any> = [];
    public productAttributeValueSearch: Array<any> = [];
    public productAttributeValueSearchB: Array<any> = [];
    public validateProperties: Array<any> = [];
    public dataTypeControls: Object = {};

    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: true },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'ExpectedTotalQty', readonly: false, disabled: false, required: false },
        { name: 'ExpectedTotalValue', readonly: false, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: true },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'TotalQty', readonly: true, disabled: false, required: false },
        { name: 'TotalValue', readonly: false, disabled: false, required: false },
        { name: 'TotalWEDValue', readonly: false, disabled: false, required: false },
        { name: 'ProductCode', readonly: false, disabled: false, required: true },
        { name: 'ProductDesc', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverItemCommenceDate', readonly: false, disabled: false, required: false },
        { name: 'EffectiveDate', readonly: false, disabled: false, required: false },
        { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: false, disabled: true, required: false },
        { name: 'SalesEmployeeText', readonly: false, disabled: false, required: false },
        { name: 'UsePercentageValuesInd', readonly: false, disabled: false, required: false },
        { name: 'DisplayQty', readonly: false, disabled: false, required: false },
        { name: 'ItemDescription', readonly: false, disabled: false, required: false },
        { name: 'InstallByBranchInd', readonly: false, disabled: false, required: false },
        { name: 'InstalledInd', readonly: false, disabled: false, required: false },
        { name: 'MaterialsCost', readonly: false, disabled: false, required: false },
        { name: 'InstallationEmployeeCode', readonly: false, disabled: false, required: false },
        { name: 'InstallationEmployeeName', readonly: false, disabled: true, required: false },
        { name: 'ReplacementIncludeInd', readonly: false, disabled: false, required: false },
        { name: 'RenegOldContract', readonly: false, disabled: false, required: false },
        { name: 'RenegOldPremise', readonly: false, disabled: false, required: false },
        { name: 'MaterialsValuePerc', readonly: false, disabled: false, required: false },
        { name: 'MaterialsValue', readonly: false, disabled: false, required: false },
        { name: 'LabourValue', readonly: false, disabled: false, required: false },
        { name: 'LabourValuePerc', readonly: false, disabled: false, required: false },
        { name: 'ReplacementValue', readonly: false, disabled: false, required: false },
        { name: 'ReplacementValuePerc', readonly: false, disabled: false, required: false },
        { name: 'WEDValue', readonly: false, disabled: false, required: false },
        { name: 'DisplayValue', readonly: false, disabled: false, required: false },
        { name: 'LabourCost', readonly: false, disabled: false, required: false },
        { name: 'InstallByBranchInd', readonly: false, disabled: false, required: false },
        { name: 'PremiseLocationNumber', readonly: false, disabled: false, required: false },
        { name: 'PremiseLocationDesc', readonly: false, disabled: false, required: false },
        { name: 'ItemText1', readonly: false, disabled: false, required: false },
        { name: 'ItemText2', readonly: false, disabled: false, required: false },
        { name: 'CurrentWeek', readonly: false, disabled: false, required: false },
        { name: 'InitialComponentsDate', readonly: false, disabled: false, required: false },
        { name: 'ScheduleID', readonly: false, disabled: false, required: false },
        { name: 'ExchangesStartAfterDate', readonly: false, disabled: false, required: false },
        { name: 'ExchangesStartAfterWk', readonly: false, disabled: false, required: false },
        { name: 'selScheduleType', readonly: false, disabled: false, required: false },
        { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false },
        { name: 'BranchServiceAreaDesc', readonly: false, disabled: false, required: false },
        { name: 'ScheduleName', readonly: false, disabled: false, required: false },
        { name: 'ScheduleEmployeeCode', readonly: false, disabled: false, required: false },
        { name: 'ScheduleEmployeeName', readonly: false, disabled: false, required: false },
        { name: 'ScheduleQty', readonly: false, disabled: false, required: false },
        { name: 'ExchangesGenUpTo', readonly: false, disabled: false, required: false },
        { name: 'ExchangesGenUpToWk', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverNumber', readonly: false, disabled: false, required: false },
        { name: 'ComponentTypeCode', readonly: false, disabled: false, required: false },
        { name: 'ComponentTypeDesc', readonly: false, disabled: false, required: false },
        { name: 'ComponentTypeDescLang', readonly: false, disabled: false, required: false },
        { name: 'SelProductCode', readonly: false, disabled: false, required: false },
        { name: 'SelProductDesc', readonly: false, disabled: false, required: false },
        { name: 'SelProductAlternateCode', readonly: false, disabled: false, required: false },
        { name: 'SelComponentTypeCode', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverItemNumber', readonly: false, disabled: false, required: false },
        { name: 'AccountNumber', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverMode', readonly: false, disabled: false, required: false },
        { name: 'ValidForDeletion', readonly: false, disabled: false, required: false },
        { name: 'ServiceBranchNumber', readonly: false, disabled: false, required: false },
        { name: 'NegBranchNumber', readonly: false, disabled: false, required: false },
        { name: 'RequiresManualVisitPlanningInd', readonly: false, disabled: false, required: false },
        { name: 'AnnualCalendarInd', readonly: false, disabled: false, required: false },
        { name: 'EmployeeLimitChildDrillOptions', readonly: false, disabled: false, required: false },
        { name: 'RemovalDate', readonly: false, disabled: false, required: false },
        { name: 'SelAttributeValue1', readonly: false, disabled: false, required: false },
        { name: 'SelAttributeValue2', readonly: false, disabled: false, required: false },
        { name: 'AttributeCode', readonly: false, disabled: false, required: false },
        { name: 'AttributeLabel', readonly: false, disabled: false, required: false },
        { name: 'SelAttributeCode', readonly: false, disabled: false, required: false },
        { name: 'SelAttributeValue', readonly: false, disabled: false, required: false },
        { name: 'AttributeValue', readonly: false, disabled: false, required: false },
        { name: 'SelProductRange', readonly: false, disabled: false, required: false },
        { name: 'SelProductRangeDesc', readonly: false, disabled: false, required: false },
        { name: 'SelComponentNumber', readonly: false, disabled: false, required: false },
        { name: 'SelProductComponentCode', readonly: false, disabled: false, required: false },
        { name: 'RangeDetailSeqNo', readonly: false, disabled: false, required: false },
        { name: 'RangeDetailInterval', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverRotation', readonly: false, disabled: false, required: false },
        { name: 'ScheduleRotation', readonly: false, disabled: false, required: false, value: false },
        { name: 'ScheduleSearch', readonly: false, disabled: false, required: false },
        { name: 'ScheduleType', readonly: false, disabled: false, required: false },
        { name: 'chkRenegContract', readonly: false, disabled: false, required: false },
        { name: 'RenegOldValue', readonly: false, disabled: false, required: false },
        { name: 'InstallationDate', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false }

    ];

    constructor(injector: Injector, private el: ElementRef, public globalize: GlobalizeService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERDISPLAYENTRY;
    }

    /**
     * Load all system characters for the page
     */
    private loadSysChars(): void {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableWED,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharDisplayLevelInstall,
            this.sysCharConstants.SystemCharEnableLocations
        ];
        this.ajaxSource.next(AjaxConstant.START);
        this.lookUpSubscription = this.fetchSysChar(sysCharList).subscribe((data) => {
            try {
                if (data.records) {
                    this.pageParams.vEnableWED = data.records[0].Required;
                    this.pageParams.vEnableInstallRemovals = data.records[1].Required;
                    this.pageParams.vEnableDisplay = data.records[2].Integer;
                    this.pageParams.vMaxComponentLines = data.records[2].Integer;
                    this.pageParams.vDefaultDisplaysInstalled = data.records[3].Required;
                    this.pageParams.vEnableLocations = data.records[4].Required;
                }
                this.setData();
            } catch (e) {
                this.logger.warn('System variable response error' + e);
            }
            this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    }
    /***
     * Method to get system characters for ProspectMaintenance
    * @params field- systemchars variables looking for  and type- L,R,I
    */
    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');

        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode());
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }
    /**
     * Look up data data from tables
     */

    public lookupData(): void {
        let lookupIP = [
            {
                'table': 'ScheduleType',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['ScheduleTypeCode', 'ScheduleTypeDesc']
            }
        ];
        this.ajaxSource.next(AjaxConstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.pageParams.sheduleTypeOptions = [];
            for (let schedule of data[0]) {
                let optionObj = { text: schedule.ScheduleTypeDesc, value: schedule.ScheduleTypeCode };
                this.pageParams.sheduleTypeOptions.push(optionObj);
            }
            this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    }
    /**
     * Method call on page load to initialize data
     */
    private initData(): void {
        this.uiForm.controls['ScheduleRotation'].setValue(false);
        this.pageParams.isDeleteDisabled = false;
        this.setFormFlag.rotationalRuleOnChange = false;
        this.setFormFlag.getPercentageValues = false;
        this.setFormFlag.scheduleIDOonChange = false;
        this.setFormFlag.branchServiceAreaCodeonChange = false;
        this.setFormFlag.premiseLocationNumberOnChange = false;
        this.setFormFlag.totalDisplayValues = false;
        this.setFormFlag.exchangesStartAfterDateSelectedValue = false;
        this.setFormFlag.displayValueOnChange = false;
        this.initialFormData = {};
        this.pageParams.vbSingleQtyComponents = [];
        this.pageParams.vbDummyProductCodes = [];
        if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
            this.pageParams.mode = 'add';
            this.pageParams.isDeleteDisabled = true;
        } else {
            this.pageParams.mode = 'update';
            this.pageParams.isDeleteDisabled = false;
        }
        this.pageParams.GridMode = '0';
        this.pageParams.vbReplacementDefaultInd = true;
        this.pageParams.vbZeroValueProductInd = false;
        this.pageParams.sheduleTypeOptions = [{}];
        this.pageParams.vbServiceVisit = false;
        this.pageParams.contractType = this.riExchange.getCurrentContractType();
        this.pageParams.contractTypelabel = this.riExchange.getCurrentContractTypeLabel();

        let strDocTitle = 'Service Cover Display Maintenance';
        strDocTitle = strDocTitle.replace('^ 1 ^', this.pageParams.contractTypelabel);
        this.pageTitle = strDocTitle;
        this.utils.setTitle(strDocTitle);
        let strInpTitle = '^ 1 ^ Number';
        this.pageParams.contractTypelabel = strInpTitle.replace('^ 1 ^', this.pageParams.contractTypelabel);
        this.currDate = null;
        this.effectiveDateChild.isEmptyRequired = true;
        this.loadSysChars();
        this.lookupData();
    }

    /**
     *  Set initial data
     */
    private setData(): void {
        this.attributes.ServiceCoverItemRowID = this.riExchange.getParentAttributeValue('ServiceCoverItemRowID');
        if (this.parentMode !== 'ScheduleSearch') {
            this.uiForm.controls['ServiceCoverNumber'].setValue(this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
            this.uiForm.controls['ServiceCoverItemNumber'].setValue(this.riExchange.getParentHTMLValue('ServiceCoverItemNumber'));
            this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
            this.uiForm.controls['ContractName'].setValue(this.riExchange.getParentHTMLValue('ContractName'));
            this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.uiForm.controls['PremiseName'].setValue(this.riExchange.getParentHTMLValue('PremiseName'));
            this.uiForm.controls['ProductCode'].setValue(this.riExchange.getParentHTMLValue('ProductCode'));
            this.uiForm.controls['ProductDesc'].setValue(this.riExchange.getParentHTMLValue('ProductDesc'));
            this.uiForm.controls['AccountNumber'].setValue(this.riExchange.getParentHTMLValue('AccountNumber'));
            this.uiForm.controls['ServiceCoverMode'].setValue(this.riExchange.getParentHTMLValue('ServiceCoverMode'));
            this.uiForm.controls['EffectiveDate'].setValue(this.riExchange.getParentHTMLValue('EffectiveDate'));
            this.currDate = this.riExchange.getParentHTMLValue('EffectiveDate');
            this.uiForm.controls['ServiceBranchNumber'].setValue(this.riExchange.getParentHTMLValue('ServiceBranchNumber'));
            this.uiForm.controls['NegBranchNumber'].setValue(this.riExchange.getParentHTMLValue('NegBranchNumber'));
            this.uiForm.controls['RequiresManualVisitPlanningInd'].setValue(this.riExchange.getParentHTMLValue('RequiresManualVisitPlanningInd'));
            this.uiForm.controls['AnnualCalendarInd'].setValue(this.riExchange.getParentHTMLValue('AnnualCalendarInd'));
            this.uiForm.controls['EmployeeLimitChildDrillOptions'].setValue(this.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions'));
            this.uiForm.controls['ExpectedTotalValue'].setValue(this.riExchange.getParentHTMLValue('ExpectedTotalValue'));
            this.uiForm.controls['ExpectedTotalQty'].setValue(this.riExchange.getParentHTMLValue('ExpectedTotalQty'));
            this.pageParams.vbServiceBranchNumber = this.uiForm.controls['ServiceBranchNumber'].value;
        }
        if (this.uiForm.controls['ServiceCoverMode'].value === 'GroupServiceVisit' || this.uiForm.controls['ServiceCoverMode'].value === 'ServiceVisit' || this.uiForm.controls['ServiceCoverMode'].value === 'DespatchGrid') {
            this.pageParams.vbServiceVisit = true;
            this.uiForm.controls['ServiceCoverMode'].setValue('Normal');
        }
        if (this.parentMode === 'ScheduleSearch') {
            this.attributes['ProductCodeServiceCoverRowID'] = this.riExchange.getParentAttributeValue('ScheduleIDServiceCoverRowID');
            this.uiForm.controls['ServiceCoverMode'].setValue('Normal');
        } else {
            this.attributes['ProductCodeServiceCoverRowID'] = this.riExchange.getParentHTMLValue('ServiceCover');
        }
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full' || this.utils.getBranchCode() === this.uiForm.controls['ServiceBranchNumber'].value || this.utils.getBranchCode() === this.uiForm.controls['NegBranchNumber'].value) {
            this.pageParams.blnAccess = true;
        } else {
            this.pageParams.blnAccess = false;
        }
        if (this.parentMode === 'DisplayUpd' || this.parentMode === 'ScheduleSearch') {
            this.functionMode.snapShot = false;
            this.functionMode.add = false;
            this.functionMode.update = true;
            this.functionMode.delete = true;
            this.functionMode.select = false;
            if (this.pageParams.vbServiceVisit === true || this.parentMode === 'ScheduleSearch') {
                this.functionMode.delete = true;
            }
        } else {
            this.functionMode.snapShot = false;
            this.functionMode.add = true;
            this.functionMode.update = false;
            this.functionMode.delete = false;
            this.functionMode.select = false;
        }

        if (this.parentMode === 'DisplayUpd' || (this.parentMode === 'Add' && this.uiForm.controls['ServiceCoverMode'].value === 'ServiceCoverAdd') || this.parentMode === 'ScheduleSearch') {
            this.uiForm.controls['InstallByBranchInd'].disable();
            this.uiForm.controls['ServiceCoverItemCommenceDate'].disable();
            this.uiForm.controls['InstalledInd'].disable();
        } else {
            this.uiForm.controls['InstallByBranchInd'].enable();
            this.uiForm.controls['ServiceCoverItemCommenceDate'].enable();
            this.uiForm.controls['InstalledInd'].enable();
        }
        if (this.pageParams.vEnableWED === true) {
            this.fieldRequired.WEDValue = true;
        }
        if (this.uiForm.controls['ServiceCoverMode'].value === 'Normal') {
            this.uiForm.controls['MaterialsValue'].disable();
            this.uiForm.controls['LabourValue'].disable();
            this.uiForm.controls['ReplacementValue'].disable();
            this.uiForm.controls['UsePercentageValuesInd'].disable();
            this.uiForm.controls['DisplayValue'].disable();
        } else {
            this.uiForm.controls['MaterialsValue'].enable();
            this.uiForm.controls['LabourValue'].enable();
            this.uiForm.controls['ReplacementValue'].enable();
            this.uiForm.controls['UsePercentageValuesInd'].enable();
            this.uiForm.controls['DisplayValue'].enable();
        }
        this.uiForm.controls['PremiseLocationDesc'].disable();
        this.uiForm.controls['ServiceCoverItemNumber'].disable();
        this.uiForm.controls['AccountNumber'].disable();
        this.uiForm.controls['ValidForDeletion'].disable();
        this.uiForm.controls['ContractName'].disable();
        this.uiForm.controls['PremiseName'].disable();
        this.uiForm.controls['ProductDesc'].disable();
        this.uiForm.controls['ExpectedTotalQty'].disable();
        this.uiForm.controls['ExpectedTotalValue'].disable();
        this.uiForm.controls['TotalQty'].disable();
        this.uiForm.controls['TotalValue'].disable();
        this.uiForm.controls['TotalWEDValue'].disable();
        this.uiForm.controls['RemovalDate'].disable();
        this.uiForm.controls['ServiceCoverRotation'].disable();
        this.uiForm.controls['MaterialsValuePerc'].disable();
        this.uiForm.controls['LabourValuePerc'].disable();
        this.uiForm.controls['ReplacementValuePerc'].disable();
        this.uiForm.controls['CurrentWeek'].disable();
        this.uiForm.controls['ExchangesGenUpTo'].disable();
        this.uiForm.controls['ExchangesGenUpToWk'].disable();
        this.uiForm.controls['ExchangesStartAfterWk'].disable();
        this.uiForm.controls['ScheduleRotation'].disable();
        this.uiForm.controls['ScheduleSearch'].disable();

        if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
            this.fieldRequired.DisplayQty = true;
        } else {
            if (this.uiForm.controls['ServiceCoverMode'].value === 'Normal') {
                this.fieldRequired.EffectiveDate = true;
                this.isDisableEffectiveDate = false;
            } else {
                this.fieldRequired.EffectiveDate = false;
                this.isDisableEffectiveDate = true;
            }
        }
        if (this.parentMode === 'ScheduleSearch') {
            this.uiForm.controls['ServiceCoverRowID'].setValue(this.riExchange.getParentAttributeValue('ScheduleIDServiceCoverRowID'));
            this.checkedStatus.ScheduleSearch = true;
        } else {
            this.uiForm.controls['ServiceCoverRowID'].setValue(this.riExchange.getParentHTMLValue('ServiceCoverROWID'));
        }
        if (this.pageParams.vEnableWED) {
            this.fieldHidden.WEDValue = false;
        }
        if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
            this.fieldHidden.divComp = false;
            this.fieldHidden.tdExpectedTotals = false;
            this.pageParams.vbReplacementDefaultInd = false;
            this.uiForm.controls['TotalQty'].setValue(this.riExchange.getParentHTMLValue('TotalQty'));
            this.uiForm.controls['TotalValue'].setValue(this.riExchange.getParentHTMLValue('TotalValue'));
            this.uiForm.controls['TotalWEDValue'].setValue(this.riExchange.getParentHTMLValue('TotalWEDValue'));
            //'Get List of dummy product codes and Single Qty Components
            let postData = {};
            postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
            postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
            postData['Function'] = 'DummyProductCodeList,SingleQtyComponents,DefaultReplacement,ZeroValueProduct';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSource.next(AjaxConstant.START);
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.DummyProductCodes) {
                            this.pageParams.vbDummyProductCodes = data.DummyProductCodes.split('|');
                        }
                        if (data.SingleQtyComponents) {
                            this.pageParams.vbSingleQtyComponents = data.SingleQtyComponents.split('|');
                        }
                        if (data.ReplacementDefaultInd && data.ReplacementDefaultInd === 'yes') {
                            this.pageParams.vbReplacementDefaultInd = true;
                        }
                        if (data.ZeroValueProductInd && data.ZeroValueProductInd === 'yes') {
                            this.pageParams.vbZeroValueProductInd = true;
                        }
                        this.riMaintenanceBeforeAdd();
                        this.setFormData();

                    } catch (error) {
                        this.logger.warn(error);
                    }
                    this.ajaxSource.next(AjaxConstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(AjaxConstant.COMPLETE);
                }
            );
        } else {
            let postData = {};
            postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
            postData['Function'] = 'ZeroValueProduct';
            postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSource.next(AjaxConstant.START);
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.ZeroValueProductInd && data.ZeroValueProductInd === 'yes') {
                            this.pageParams.vbZeroValueProductInd = true;
                        }
                        this.setFormData();

                    } catch (error) {
                        this.logger.warn(error);
                    }
                    this.ajaxSource.next(AjaxConstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(AjaxConstant.COMPLETE);
                }
            );
            this.fieldHidden.tdGridControl = false;
            this.fieldHidden.EffectiveDate = false;
            this.fieldHidden.tdPopulate = true;
            this.fieldHidden.DisplayQty = true;
            this.fieldHidden.tdExpectedTotals = true;
            this.fieldHidden.InitialComponentsDate = true;
            this.buildGridComp();

        }
        if (this.pageParams.vbZeroValueProductInd === true) {
            this.fieldHidden.MaterialsValue = true;
            this.fieldHidden.LabourValueLab = true;
            this.fieldHidden.ReplacementValue = true;
        } else {
            this.fieldHidden.MaterialsValue = false;
            this.fieldHidden.LabourValueLab = false;
            this.fieldHidden.ReplacementValue = false;
        }

        this.updatedRequired();
        if (this.pageParams.mode === 'update') {
            this.riMaintenanceBeforeFetch();
        } else {
            this.riMaintenanceBeforeAdd();
        }
        this.setFormData();
        this.buildMenuOptions();
        this.sheduleTypeDisabled = true;
        if (this.setFormFlag.createform)
            this.createComponentRows();

        if (this.addAfterInit === true) {
            this.riMaintenanceAfterNormalAfterSave();
        }
    }

    /**
     * Generate grid component here
     */
    private buildGridComp(): void {
        this.maxColumn = 11;

        /***
         * Before grid execute
         */
        if (this.uiForm.controls['RemovalDate'].value === '') {
            this.maxColumn++;
        }
        if (this.pageParams.gridUpdate === true) {
            this.componentGrid.update = true;
        }
        if (this.pageParams.vbUpdateRecord === 'Update') {
            this.search.set('AttributeValue1', this.pageParams.vbAttributeValue1);
            this.search.set('AttributeValue2', this.pageParams.vbAttributeValue2);
            this.search.set('UpdateField', this.pageParams.vbUpdateField);
        }

        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('ServiceCoverNumber', this.uiForm.controls['ServiceCoverNumber'].value);
        this.search.set('ServiceCoverItemRowID', this.attributes.ServiceCoverItemRowID);
        this.search.set('GridType', 'Component');
        this.search.set('UpdateField', 'AttributeValue1');
        this.search.set('UpdateRecord', this.pageParams.vbUpdateRecord);
        this.search.set(this.serviceConstants.GridMode, this.pageParams.GridMode);
        this.search.set(this.serviceConstants.GridHandle, '0');
        this.search.set('riCacheRefresh', 'True');
        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.queryParams.search = this.search;
        this.componentGrid.loadGridData(this.queryParams);
        if (this.pageParams.vbUpdateRecord === 'Update') {
            this.pageParams.vbUpdateRecord = '';
            this.pageParams.vbUpdateField = '';
        } else if (this.pageParams.vbUpdateRecord === 'Delete') {
            this.pageParams.vbUpdateRecord = '';
        }
    }


    /**
     * Onchange method to set schedule type
     */
    public scheduleOptionsChange(obj: any): void {
        this.uiForm.controls['selScheduleType'].setValue(obj);
    }

    /**
     * Create component minimum rows to display
     */

    private createComponentRows(): void {
        let rowObj = {}, paramObjProduct = {}, paramObjAlternativeProduct = {}, attributeCodeDisablea = {}, attributeCodeDisableb = {}, componentParam = {}, attributeAParam = {}, attributeBParam = {};
        this.componentRows = [];
        this.productSearchParams = [];
        let fieldDisable = false;
        for (let i = 1; i <= this.minRows; i++) {
            rowObj = {};
            rowObj['count'] = i;
            paramObjProduct = { 'parentMode': 'DisplayEntry', 'SelProductCode': '', 'SelComponentTypeCode': '', 'SelProductAlternateCode': '', 'ProductCode': this.uiForm.controls['ProductCode'].value };
            paramObjAlternativeProduct = { 'parentMode': 'AlternateDisplayEntry', 'SelProductCode': '', 'SelComponentTypeCode': '', 'SelProductAlternateCode': '', 'ProductCode': this.uiForm.controls['ProductCode'].value };
            componentParam = {
                compTypeLangSearch: {
                    inputParams: {
                        'ProductCode': this.uiForm.controls['ProductCode'].value
                    },
                    itemsToDisplay: ['ComponentTypeDescLang.ComponentTypeCode', 'ComponentTypeDescLang.ComponentTypeDescLang'],
                    isDisabled: false,
                    isRequired: false,
                    active: {
                        id: '',
                        text: ''
                    }
                }
            };
            attributeAParam = {
                isDisabled: false,
                isRequired: false,
                isShowCloseButton: true,
                isShowHeader: true,
                childConfigParams: {
                    parentMode: 'Attribute1',
                    AttributeCode: '',
                    AttributeLabel: ''
                },
                contentComponent: ProductAttributeValuesSearchComponent
            };
            attributeBParam = {
                isDisabled: false,
                isRequired: false,
                isShowCloseButton: true,
                isShowHeader: true,
                childConfigParams: {
                    parentMode: 'Attribute2',
                    AttributeCode: '',
                    AttributeLabel: ''
                },
                contentComponent: ProductAttributeValuesSearchComponent
            };
            this.productAttributeValueSearch.push(attributeAParam);
            this.productAttributeValueSearchB.push(attributeBParam);
            this.productSearchParams.push(paramObjProduct);
            this.alternativeProductSearchParams.push(paramObjAlternativeProduct);
            this.componentDropdownParam.push(componentParam);
            attributeCodeDisablea = { disableEllipsis: true };
            attributeCodeDisableb = { disableEllipsis: true };
            this.AttributeCodeADisable.push(attributeCodeDisablea);
            this.AttributeCodeBDisable.push(attributeCodeDisableb);
            for (let cnt = 0; cnt < this.ComponentColumnList.length; cnt++) {
                rowObj[this.ComponentColumnList[cnt]] = this.ComponentColumnList[cnt] + i;
                if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
                    if (this.ComponentColumnList[cnt] === 'ComponentTypeDesc' || this.ComponentColumnList[cnt] === 'ProductComponentDesc'
                        || this.ComponentColumnList[cnt] === 'AttributeLabelA' || this.ComponentColumnList[cnt] === 'AttributeLabelB'
                        || this.ComponentColumnList[cnt] === 'ProductRangeDesc' || this.ComponentColumnList[cnt] === 'SequenceNumber'
                        || this.ComponentColumnList[cnt] === 'RotationalInterval'
                    ) {
                        fieldDisable = true;
                    } else {
                        fieldDisable = false;
                    }
                }
                if (this.ComponentColumnList[cnt] === 'ComponentQuantity' || this.ComponentColumnList[cnt] === 'SequenceNumber') {
                    this.dataTypeControls[this.ComponentColumnList[cnt] + i] = MntConst.eTypeInteger;
                }
                this.fieldRequired[this.ComponentColumnList[cnt] + this.rowCount] = false;
                this.fieldHidden[this.ComponentColumnList[cnt] + this.rowCount] = false;
                this.controls.push({ name: this.ComponentColumnList[cnt] + i, readonly: true, disabled: fieldDisable, required: false, value: '' });
            }
            this.componentRows.push(rowObj);
            this.rowCount++;
        }
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.updatedRequired();
        this.setFormFlag.createform = false;
    }

    /**
     * Add more component row
     */
    public addComponentRow(): void {
        this.isRequesting = true;
        let rowObj = {}, currentValues = {}, index = 0, paramObjProduct = {}, paramObjAlternativeProduct = {}, attributeCodeDisablea = {}, attributeCodeDisableb = {}, componentParam = {}, attributeAParam = {}, attributeBParam = {};
        let fieldDisable = false;
        this.rowCount++;
        rowObj['count'] = this.rowCount;
        paramObjProduct = { 'parentMode': 'DisplayEntry', 'SelProductCode': '', 'SelComponentTypeCode': '', 'SelProductAlternateCode': '', 'ProductCode': this.uiForm.controls['ProductCode'].value };
        paramObjAlternativeProduct = { 'parentMode': 'AlternateDisplayEntry', 'SelProductCode': '', 'SelComponentTypeCode': '', 'SelProductAlternateCode': '', 'ProductCode': this.uiForm.controls['ProductCode'].value };
        componentParam = {
            compTypeLangSearch: {
                inputParams: {
                    'ProductCode': this.uiForm.controls['ProductCode'].value
                },
                itemsToDisplay: ['ComponentTypeDescLang.ComponentTypeCode', 'ComponentTypeDescLang.ComponentTypeDescLang'],
                isDisabled: false,
                isRequired: false,
                active: {
                    id: '',
                    text: ''
                }
            }
        };
        attributeAParam = {
            isDisabled: false,
            isRequired: false,
            isShowCloseButton: true,
            isShowHeader: true,
            childConfigParams: {
                parentMode: 'Attribute1',
                AttributeCode: '',
                AttributeLabel: ''
            },
            contentComponent: ProductAttributeValuesSearchComponent
        };
        attributeBParam = {
            isDisabled: false,
            isRequired: false,
            isShowCloseButton: true,
            isShowHeader: true,
            childConfigParams: {
                parentMode: 'Attribute2',
                AttributeCode: '',
                AttributeLabel: ''
            },
            contentComponent: ProductAttributeValuesSearchComponent
        };
        this.productAttributeValueSearch.push(attributeAParam);
        this.productAttributeValueSearchB.push(attributeBParam);
        this.productSearchParams.push(paramObjProduct);
        this.alternativeProductSearchParams.push(paramObjAlternativeProduct);
        this.componentDropdownParam.push(componentParam);
        attributeCodeDisablea = { disableEllipsis: true };
        attributeCodeDisableb = { disableEllipsis: true };
        this.AttributeCodeADisable.push(attributeCodeDisablea);
        this.AttributeCodeBDisable.push(attributeCodeDisableb);
        for (let row of this.componentRows) {
            for (let cnt = 0; cnt < this.ComponentColumnList.length; cnt++) {
                currentValues[row[this.ComponentColumnList[cnt]]] = this.uiForm.controls[row[this.ComponentColumnList[cnt]]].value;
            }
        }
        for (let cnt = 0; cnt < this.ComponentColumnList.length; cnt++) {
            rowObj[this.ComponentColumnList[cnt]] = this.ComponentColumnList[cnt] + this.rowCount;
            if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
                if (this.ComponentColumnList[cnt] === 'ComponentTypeDesc' || this.ComponentColumnList[cnt] === 'ProductComponentDesc'
                    || this.ComponentColumnList[cnt] === 'AttributeLabelA' || this.ComponentColumnList[cnt] === 'AttributeLabelB'
                    || this.ComponentColumnList[cnt] === 'ProductRangeDesc' || this.ComponentColumnList[cnt] === 'SequenceNumber'
                    || this.ComponentColumnList[cnt] === 'RotationalInterval'
                ) {
                    fieldDisable = true;
                } else {
                    fieldDisable = false;
                }
            }
            this.fieldRequired[this.ComponentColumnList[cnt] + this.rowCount] = false;
            this.fieldHidden[this.ComponentColumnList[cnt] + this.rowCount] = false;
            if (this.ComponentColumnList[cnt] === 'ComponentQuantity' || this.ComponentColumnList[cnt] === 'SequenceNumber') {
                this.dataTypeControls[this.ComponentColumnList[cnt] + this.rowCount] = MntConst.eTypeInteger;
            }
            this.controls.push({ name: this.ComponentColumnList[cnt] + this.rowCount, readonly: true, disabled: fieldDisable, required: false, value: '' });
        }
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.componentRows.push(rowObj);
        this.updatedRequired();
        for (let contrlVal in currentValues) {
            if (currentValues.hasOwnProperty(contrlVal)) {
                this.uiForm.controls[contrlVal].setValue(currentValues[contrlVal]);
            }
        }
        this.isRequesting = false;
    }
    /**
     * Product search data set to respective control
     */

    public onProductDataReceived(data: any, count: any): void {
        this.uiForm.controls['ProductComponentCode' + count].setValue(data.ProductCode);
        this.uiForm.controls['AlternateProductCode' + count].setValue(data.PrimaryAlternateCode);
        this.uiForm.controls['ProductComponentDesc' + count].setValue(data.ProductDesc);
        this.productCodeOnChange(count);
    }

    public onAlternativeProductDataReceived(data: any, count: any): void {
        this.uiForm.controls['ProductComponentCode' + count].setValue(data.ProductCode);
        this.uiForm.controls['AlternateProductCode' + count].setValue(data.PrimaryAlternateCode);
        this.uiForm.controls['ProductComponentDesc' + count].setValue(data.ProductDesc);
        this.productCodeOnChange(count);
    }

    public branchServiceAreaSearcDataReceived(data: any, count: any): void {
        this.uiForm.controls['BranchServiceAreaCode'].setValue(data.BranchServiceAreaCode);
        this.uiForm.controls['BranchServiceAreaDesc'].setValue(data.BranchServiceAreaDesc);
        this.uiForm.controls['ScheduleEmployeeCode'].setValue(data.ScheduleEmployeeCode);
        this.uiForm.controls['ScheduleEmployeeName'].setValue(data.ScheduleEmployeeName);

    }

    public setEllipsisParams(index: any): void {
        this.alternativeProductSearchParams[index - 1].SelComponentTypeCode = this.uiForm.controls['ComponentTypeCode' + index].value;
        this.productSearchParams[index - 1].SelComponentTypeCode = this.uiForm.controls['ComponentTypeCode' + index].value;
        this.alternativeProductSearchParams[index - 1].SelProductCode = this.uiForm.controls['ProductComponentCode' + index].value;
        this.productSearchParams[index - 1].SelProductCode = this.uiForm.controls['ProductComponentCode' + index].value;
        this.alternativeProductSearchParams[index - 1].SelProductAlternateCode = this.uiForm.controls['AlternateProductCode' + index].value;
        this.productSearchParams[index - 1].SelProductAlternateCode = this.uiForm.controls['AlternateProductCode' + index].value;
        this.productCodeOnChange(index);
    }

    /**
     * Product code onchange method
     */
    public productCodeOnChange(index: any): void {
        for (let vcomp of this.pageParams.vbSingleQtyComponents) {
            if (this.uiForm.controls['ComponentQuantity' + index].value.toLowerCase() === vcomp.toLowerCase()) {
                this.uiForm.controls['ComponentQuantity' + index].setValue('1');
                this.uiForm.controls['ComponentQuantity' + index].disable();
            }
        }
        if (this.uiForm.controls['ProductComponentCode' + index].value) {
            this.uiForm.controls['ProductComponentDesc' + index].disable();
            for (let pobj of this.pageParams.vbDummyProductCodes) {
                if (this.uiForm.controls['ProductComponentCode' + index].value.toLowerCase() === pobj.toLowerCase()) {
                    this.uiForm.controls['ProductComponentDesc' + index].enable();
                    this.el.nativeElement.querySelector('#ProductComponentDesc' + index).focus();
                    break;
                }
            }
        }
    }
    /**
     * Display rotational fields
     */
    public displayRotationalFields(index: any): void {
        let postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ComponentNumber'] = index;
        postData['ProductComponentCode'] = this.uiForm.controls['ProductComponentCode' + index].value;
        postData['Function'] = 'DisplayRotationalFields';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.RotationalProductInd) {
                        this.fieldRequired['ProductRange' + index] = true;
                        this.fieldHidden.trComponentRange = false;
                        this.fieldHidden.RotationalInterval1 = false;
                        this.uiForm.controls['ProductRange' + index].setValue(data.ProductRange);
                        this.uiForm.controls['ProductRangeDesc' + index].setValue(data.ProductRangeDesc);
                        this.uiForm.controls['SequenceNumber' + index].setValue(data.SequenceNumber);
                        this.uiForm.controls['RotationalRule' + index].setValue(data.RotationalRule);
                        this.uiForm.controls['RotationalInterval' + index].setValue(data.RotationalInterval);
                        if (this.uiForm.controls['RotationalRule'].value === 'C' && this.uiForm.controls['ProductRange'].value) {
                            this.uiForm.controls['ProductRangeDesc'].setValue(this.uiForm.controls['PremiseName'].value);
                        }
                    } else {
                        this.fieldRequired['ProductRange' + index] = false;
                        this.uiForm.controls['ProductRange' + index].setValue('');
                        this.uiForm.controls['ProductRangeDesc' + index].setValue('');
                        this.uiForm.controls['SequenceNumber' + index].setValue('');
                        this.uiForm.controls['RotationalRule' + index].setValue('');
                        this.uiForm.controls['RotationalInterval' + index].setValue('');
                        this.fieldHidden.trComponentRange = true;
                        this.fieldHidden.RotationalInterval1 = true;
                    }
                    this.rotationalRuleOnChange(index);
                    this.updatedRequired();
                    if (!this.setFormFlag.rotationalRuleOnChange) {
                        this.setFormData();
                        this.setFormFlag.rotationalRuleOnChange = true;
                    }
                } catch (error) {
                    this.logger.warn(error);
                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            }
        );
    }
    /**
     * Rotational Rule change method
     */
    public rotationalRuleOnChange(index: any): void {
        if (this.uiForm.controls['RotationalInterval' + index].value.toLowerCase() === 'c' || this.uiForm.controls['RotationalRule' + index].value.toLowerCase() === 's') {
            this.fieldHidden.RotationalInterval1 = false;
        } else {
            this.fieldHidden.RotationalInterval1 = true;
        }
        if (this.uiForm.controls['RotationalRule' + index].value.toLowerCase() === 'c') {
            this.fieldHidden.customUpdate = false;
        }
        let postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ComponentNumber'] = index;
        postData['ProductComponentCode'] = this.uiForm.controls['ProductComponentCode' + index].value;
        postData['Function'] = 'DefaultCustomRange';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.RotationalProductInd) {
                        this.uiForm.controls['ProductRange' + index].setValue(data.ProductRange);
                        this.uiForm.controls['ProductRangeDesc' + index].setValue(data.ProductRangeDesc);
                        this.uiForm.controls['SequenceNumber' + index].setValue(data.SequenceNumber);
                        this.uiForm.controls['RotationalInterval' + index].setValue(data.RotationalInterval);

                    } else {
                        this.uiForm.controls['ProductRange' + index].setValue('');
                        this.uiForm.controls['ProductRangeDesc' + index].setValue('');
                        this.uiForm.controls['SequenceNumber' + index].setValue('');
                        this.uiForm.controls['RotationalInterval' + index].setValue('');
                    }
                    this.uiForm.controls['ProductRange' + index].disable();

                } catch (error) {
                    this.logger.warn(error);
                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.uiForm.controls['ProductRange' + index].enable();
                this.fieldHidden.customUpdate = true;
                this.ajaxSource.next(AjaxConstant.COMPLETE);

            }
        );
    }
    public getGridInfo(info: any): void {
        this.componentGridPagination.totalItems = info.totalRows;
        if (this.pageParams.GridMode === '3')
            this.buildGridComp();
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGridComp();
    }

    public refresh(): void {
        this.currentPage = 1;
        this.buildGridComp();
    }
    public onGridRowClick(event: any): void {
        switch (event.cellIndex) {
            case '6':
                this.attributes['ServiceCoverNumberServiceCoverComponentRowID'] = event.trRowData[0].additionalData;
                this.attributes['ServiceCoverNumberRow'] = event.rowIndex;
                this.attributes['ServiceCoverNumberAttributeCode'] = event.trRowData[5].additionalData;
                this.pageParams.vbAttributeCode1 = this.attributes['ServiceCoverNumberAttributeCode'];
                this.pageParams.vbUpdateField = 'AttributeValue1';
                break;
            case '8':
                this.attributes['ServiceCoverNumberServiceCoverComponentRowID'] = event.trRowData[0].additionalData;
                this.attributes['ServiceCoverNumberRow'] = event.rowIndex;
                this.attributes['ServiceCoverNumberAttributeCode'] = event.trRowData[7].additionalData;
                this.pageParams.vbAttributeCode2 = this.attributes['ServiceCoverNumberAttributeCode'];
                this.pageParams.vbUpdateField = 'AttributeValue1';
                break;
            default:
                break;
        }
    }


    public onGridRowDblClick(event: any): void {
        let cellIndex: any, deleteComponent: boolean = false, serviceCoverComponentRowID: any;
        serviceCoverComponentRowID = event.trRowData[0].additionalData;
        cellIndex = event.cellIndex;
        if (cellIndex === 11) {
            deleteComponent = true;
        }
        if (cellIndex === 0) {
            this.pageParams.mode = 'DisplayGrid';
            this.navigate('DisplayGrid', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERCOMPONENTENTRY, { ServiceCoverNumber: this.uiForm.controls['ServiceCoverNumber'].value, ServiceCoverItemNumber: this.uiForm.controls['ServiceCoverItemNumber'].value, ServiceCoverComponentRowID: serviceCoverComponentRowID });
        } else if (deleteComponent === true) {
            let postData = {};
            postData['Function'] = 'DeleteComponent';
            postData['ServiceCoverComponentRowID'] = serviceCoverComponentRowID;
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.errorMessage) {
                            this.errorModal.show(data, true);
                        } else {
                            this.attributes['grdServiceCoverComponentServiceCoverComponentRowID'] = event.cellData.additionalData;
                            this.attributes['grdServiceCoverComponentRow'] = event.rowIndex;
                            this.attributes['ServiceCoverNumberRow'] = event.rowIndex;
                            this.attributes['ServiceCoverNumberServiceCoverComponentRowID'] = event.cellData.additionalData;
                            this.pageParams.vbUpdateRecord = 'Delete';
                            this.pageParams.gridUpdate = true;
                            this.buildGridComp();
                        }

                    } catch (error) {
                        this.logger.warn(error);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        }

    }
    /**
     * Grid cell keydown functionality
     */
    public onCellKeyDown(event: any): void {
        if (this.pageParams.GridMode !== '3' && event.cellIndex === '6') {
            this.pageParams.vbUpdateField = 'AttributeValue1';
            this.pageParams.vbAttributeValue1 = event.keyCode.target.value;
            this.attributes['ServiceCoverNumberAttributeCode'] = event.completeRowData[5].additionalData;
            this.attributes['ServiceCoverNumberAttributeLabel'] = event.completeRowData[5].text;
            //WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBProductAttributeValuesSearch.htm"
            this.pageParams.mode = 'Attribute1';
            if (this.pageParams.vbAttributeValue1 !== event.cellData.text) {
                this.pageParams.vbAttributeCode1 = this.attributes['ServiceCoverNumberAttributeCode'];
                this.pageParams.gridUpdate = true;
                this.pageParams.vbUpdateRecord = 'Update';
                this.buildGridComp();
            }
            this.pageParams.vbAttributeCode1 = '';
            this.pageParams.vbAttributeValue1 = '';
        }
        if (this.pageParams.GridMode !== '3' && event.cellIndex === '8') {
            this.pageParams.vbUpdateField = 'AttributeValue1';
            this.pageParams.vbAttributeValue2 = event.keyCode.target.value;
            this.attributes['ServiceCoverNumberAttributeCode'] = event.completeRowData[7].additionalData;
            this.attributes['ServiceCoverNumberAttributeLabel'] = event.completeRowData[7].text;
            //WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBProductAttributeValuesSearch.htm"
            this.pageParams.mode = 'Attribute2';
            if (this.pageParams.vbAttributeValue2 !== event.cellData.text) {
                this.pageParams.vbAttributeCode2 = this.attributes['ServiceCoverNumberAttributeCode'];
                this.pageParams.gridUpdate = true;
                this.pageParams.vbUpdateRecord = 'Update';
                this.buildGridComp();
            }
            this.pageParams.vbAttributeCode2 = '';
            this.pageParams.vbAttributeValue2 = '';
        }

    }
    public effectiveDateSelectedValue(value: any): void {
        this.uiForm.controls['EffectiveDate'].setValue(value.value);
        if (this.attributes.ServiceCoverItemRowID && this.isDisableEffectiveDate === false && this.fieldHidden.EffectiveDate === false) {
            let postData = {};
            postData['Function'] = 'EffectDatePopFields';
            postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
            postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
            postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
            postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
            postData['ServiceCoverItemNumber'] = this.uiForm.controls['ServiceCoverItemNumber'].value;
            postData['EffectiveDate'] = this.uiForm.controls['EffectiveDate'].value;
            postData['ServiceCoverItemRowID'] = this.attributes.ServiceCoverItemRowID;

            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.errorMessage) {
                            this.errorModal.show(data, true);
                        } else {
                            this.uiForm.controls['MaterialsValue'].setValue(data.MaterialsValue);
                            this.uiForm.controls['ReplacementValue'].setValue(data.ReplacementValue);
                            this.uiForm.controls['LabourValue'].setValue(data.LabourValue);
                            this.uiForm.controls['MaterialsCost'].setValue(data.MaterialsCost);
                            this.uiForm.controls['WEDValue'].setValue(data.WEDValue);
                            this.totalDisplayValues();

                        }

                    } catch (error) {
                        this.logger.warn(error);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        }
    }
    public installationDateSelectedValue(dt: any): void {
        this.uiForm.controls['InstallationDate'].setValue(dt.value);
    }

    public initialComponentsDateSelectedValue(dt: any): void {
        this.uiForm.controls['InitialComponentsDate'].setValue(dt.value);
    }

    public exchangesStartAfterDateSelectedValue(dt: any): void {
        this.uiForm.controls['ExchangesStartAfterDate'].setValue(dt.value);
        if (this.uiForm.controls['ExchangesStartAfterDate'].value && (this.uiForm.controls['ExchangesStartAfterDate'].valid)) {
            let postData = {};
            postData['Function'] = 'GetExchangeStartWeek';
            postData['ExchangesStartAfterDate'] = this.uiForm.controls['ExchangesStartAfterDate'].value;
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.ExchangesStartAfterWk) {
                            this.uiForm.controls['ExchangesStartAfterWk'].setValue(data.ExchangesStartAfterWk);
                            if (!this.setFormFlag.exchangesStartAfterDateSelectedValue) {
                                this.setFormData();
                                this.setFormFlag.exchangesStartAfterDateSelectedValue = true;
                            }
                        }
                    } catch (error) {
                        this.logger.warn(error);
                        this.uiForm.controls['ExchangesStartAfterWk'].setValue('');
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.uiForm.controls['ExchangesStartAfterWk'].setValue('');
                }
            );
        } else {
            this.uiForm.controls['ExchangesStartAfterWk'].setValue('');
        }
    }
    public usePercentageValuesIndOnChange(ev: any): void {
        this.uiForm.controls['UsePercentageValuesInd'].setValue(ev);
        if (this.uiForm.controls['ServiceCoverMode'].value === 'ServiceCoverAdd' && (this.pageParams.mode === 'add' || this.pageParams.mode === 'update')) {
            if (this.uiForm.controls['UsePercentageValuesInd'].value) {
                this.fieldHidden.percentDisplay = false;
                this.uiForm.controls['MaterialsValue'].disable();
                this.uiForm.controls['LabourValue'].disable();
                this.uiForm.controls['ReplacementValue'].disable();
                this.uiForm.controls['DisplayValue'].enable();
                if (this.uiForm.controls['DisplayValue'].value !== '') {
                    this.displayValueOnChange();
                }
                this.getPercentageValues();

            } else {
                this.fieldHidden.percentDisplay = true;
                this.uiForm.controls['MaterialsValue'].enable();
                this.uiForm.controls['LabourValue'].enable();
                this.uiForm.controls['ReplacementValue'].enable();
                this.uiForm.controls['DisplayValue'].disable();
            }
        }
    }

    /**
     * Display value onchange method
     */
    public displayValueOnChange(): void {
        if ((this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') || this.pageParams.mode === 'update') {
            if (this.uiForm.controls['UsePercentageValuesInd'].value && this.uiForm.controls['DisplayValue'].value !== 0) {
                let postData = {};
                postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
                postData['DisplayValue'] = this.formatDataType(this.uiForm.controls['DisplayValue'].value, this.dataTypeControls['DisplayValue']);
                postData['MaterialsValue'] = this.formatDataType(this.uiForm.controls['MaterialsValue'].value, this.dataTypeControls['DisplayValue']);
                postData['ReplacementValue'] = this.formatDataType(this.uiForm.controls['ReplacementValue'].value, this.dataTypeControls['ReplacementValue']);
                postData['LabourValue'] = this.formatDataType(this.uiForm.controls['LabourValue'].value, this.dataTypeControls['LabourValue']);
                postData['Function'] = 'CalcPercentageValues';
                this.search = new URLSearchParams();
                this.search.set(this.serviceConstants.Action, '6');
                this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                this.search.set(this.serviceConstants.CountryCode, this.countryCode());
                this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                    (data) => {
                        try {
                            if (data.LabourValue) {
                                this.uiForm.controls['LabourValue'].setValue(data.LabourValue);
                            }
                            if (data.MaterialsValue) {
                                this.uiForm.controls['MaterialsValue'].setValue(data.MaterialsValue);
                            }
                            if (data.ReplacementValue) {
                                this.uiForm.controls['ReplacementValue'].setValue(data.ReplacementValue);
                            }
                            if (!this.setFormFlag.displayValueOnChange) {
                                this.setFormData();
                                this.setFormFlag.displayValueOnChange = true;
                            }
                        } catch (error) {
                            this.logger.warn(error);
                        }
                    },
                    (error) => {
                        this.errorService.emitError(error);
                    }
                );
            }
        }

    }
    /**
     * Service call to get percentage values
     */
    private getPercentageValues(): void {
        let postData = {};
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['Function'] = 'GetPercValues';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.LabourValuePerc) {
                        this.uiForm.controls['LabourValuePerc'].setValue(data.LabourValuePerc);
                    }
                    if (data.MaterialsValuePerc) {
                        this.uiForm.controls['MaterialsValuePerc'].setValue(data.MaterialsValuePerc);
                    }
                    if (data.ReplacementValuePerc) {
                        this.uiForm.controls['ReplacementValuePerc'].setValue(data.ReplacementValuePerc);
                    }
                    if (!this.setFormFlag.getPercentageValues) {
                        this.setFormData();
                        this.setFormFlag.getPercentageValues = true;
                    }
                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    public chkRenegContractOnChange(ev: any): void {
        this.uiForm.controls['chkRenegContract'].setValue(ev);
        if (this.uiForm.controls['chkRenegContract'].value) {
            this.fieldHidden.RenegOldContract = false;
            this.fieldRequired.RenegOldContract = true;
            this.fieldRequired.RenegOldPremise = true;
            this.fieldRequired.RenegOldValue = true;
            if (this.pageParams.mode === 'update') {
                this.uiForm.controls['RenegOldPremise'].setValue('');
                this.uiForm.controls['RenegOldContract'].setValue('');
                this.uiForm.controls['RenegOldValue'].setValue('');
            }
        } else {
            this.fieldHidden.RenegOldContract = true;
            this.fieldRequired.RenegOldContract = false;
            this.fieldRequired.RenegOldPremise = false;
            this.fieldRequired.RenegOldValue = false;
        }
        this.updatedRequired();
    }
    public installedIndOnChange(ev: any): void {
        this.uiForm.controls['InstalledInd'].setValue(ev);
        if (this.pageParams.mode === 'add') {
            if (this.uiForm.controls['InstalledInd'].value === true) {
                this.fieldHidden.trInstallationEmployee = false;
                this.uiForm.controls['InstallationDate'].setValue(this.uiForm.controls['ServiceCoverItemCommenceDate'].value);
                this.fieldRequired.InstallationEmployeeCode = true;
            } else {
                this.fieldHidden.trInstallationEmployee = true;
                this.fieldRequired.InstallationEmployeeCode = false;
            }
        }
        this.updatedRequired();
    }
    public replacementIncludeIndOnChange(ev: any): void {
        this.uiForm.controls['ReplacementIncludeInd'].setValue(ev);
    }
    public installByBranchIndOnChange(ev: any): void {
        this.uiForm.controls['InstallByBranchInd'].setValue(ev);
    }

    public displayQtyOnChange(dq: any): void {
        if (typeof dq !== 'undefined' && dq === '') {
            //this.uiForm.controls['DisplayQty'].setValue('0');
        }
    }

    /**
     * Call method in add mode
     */
    private riMaintenanceBeforeAdd(): void {
        this.uiForm.controls['ItemDescription'].setValue('Display');
        this.uiForm.controls['ReplacementIncludeInd'].setValue(this.pageParams.vbReplacementDefaultInd);
        this.uiForm.controls['ServiceBranchNumber'].setValue(this.pageParams.vbServiceBranchNumber);
        this.setFormFlag.displayValueOnChange = true;
        if (this.parentMode === 'Add' && this.uiForm.controls['ServiceCoverMode'].value === 'ServiceCoverAdd') {
            this.uiForm.controls['ServiceCoverItemCommenceDate'].setValue(this.riExchange.getParentHTMLValue('ServiceCommenceDate'));
            this.el.nativeElement.querySelector('#ItemDescription').focus();
        } else {
            this.el.nativeElement.querySelector('#ServiceCoverItemCommenceDate').focus();
        }
        if (this.parentMode === 'Add' && this.uiForm.controls['ServiceCoverMode'].value === 'Normal') {
            if (this.pageParams.vEnableInstallRemovals) {
                this.fieldHidden.trInstallations = false;
                this.uiForm.controls['InstallByBranchInd'].setValue(true);
                if (this.pageParams.vDefaultDisplaysInstalled) {
                    this.uiForm.controls['InstalledInd'].setValue(true);
                }
            }
        }
        let postData = {};
        postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
        postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['Function'] = 'SalesEmployeeRotation';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.ServiceSalesEmployee) {
                        this.uiForm.controls['ServiceSalesEmployee'].setValue(data.ServiceSalesEmployee);
                    }
                    if (data.EmployeeSurname) {
                        this.uiForm.controls['EmployeeSurname'].setValue(data.EmployeeSurname);
                    }
                    if (data.ServiceCoverRotation) {
                        (data.ServiceCoverRotation === 'yes') ? this.uiForm.controls['ServiceCoverRotation'].setValue(true) : this.uiForm.controls['ServiceCoverRotation'].setValue(false);
                    }
                    if (data.UsePercentageValuesInd) {
                        (data.UsePercentageValuesInd === 'yes') ? this.uiForm.controls['UsePercentageValuesInd'].setValue(true) : this.uiForm.controls['UsePercentageValuesInd'].setValue(false);
                        this.usePercentageValuesIndOnChange(this.uiForm.controls['UsePercentageValuesInd'].value);
                    }
                    if (data.MaterialsValuePerc) {
                        this.uiForm.controls['MaterialsValuePerc'].setValue(data.MaterialsValuePerc);
                    }
                    if (data.LabourValuePerc) {
                        this.uiForm.controls['LabourValuePerc'].setValue(data.LabourValuePerc);
                    }
                    if (data.ReplacementValuePerc) {
                        this.uiForm.controls['ReplacementValuePerc'].setValue(data.ReplacementValuePerc);
                    }
                    if (data.ScheduleRotation) {
                        (data.ScheduleRotation === 'yes') ? this.uiForm.controls['ScheduleRotation'].setValue(true) : this.uiForm.controls['ScheduleRotation'].setValue(false);
                    }
                } catch (error) {
                    this.logger.warn(error);
                }
                this.usePercentageValuesIndOnChange(this.uiForm.controls['UsePercentageValuesInd'].value);
                this.displayScheduleFields();
                if (this.uiForm.controls['ScheduleRotation'].value) {
                    this.uiForm.controls['BranchServiceAreaCode'].setValue('?');
                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            }
        );
    }

    private setFormData(): void {
        for (let c in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(c)) {
                this.initialFormData[c] = this.uiForm.controls[c].value;
            }
        }
    }

    /**
     * Method to be called Before update mode
     */
    private riMaintenanceBeforeUpdate(): void {
        this.displayScheduleFields();
        if (this.uiForm.controls['ScheduleRotation'].value) {
            this.uiForm.controls['BranchServiceAreaCode'].enable();
            this.pageParams.vbOrigScheduleID = this.uiForm.controls['ScheduleID'].value;
            this.pageParams.vbOrigScheduleType = this.uiForm.controls['selScheduleType'].value;
        }
        if (this.uiForm.controls['ServiceCoverMode'].value !== 'Normal') {
            if (this.uiForm.controls['UsePercentageValuesInd'].value) {
                this.uiForm.controls['MaterialsValue'].disable();
                this.uiForm.controls['LabourValue'].disable();
                this.uiForm.controls['ReplacementValue'].disable();
            } else {
                this.uiForm.controls['DisplayValue'].disable();
            }
        }

    }

    /**
     * Before save update
     */
    private beforeSaveUpdate(formdData: any): void {
        if (this.uiForm.controls['MaterialsCost'].value === '0' || this.uiForm.controls['MaterialsCost'].value === '') {
            let postData = {};
            postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
            postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
            postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
            postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
            postData['ServiceCoverItemNumber'] = this.uiForm.controls['ServiceCoverItemNumber'].value;
            postData['Function'] = 'GetMaterialsCost';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.MaterialsCost) {
                            this.uiForm.controls['MaterialsCost'].setValue(data.MaterialsCost);
                        }
                        this.updateServiceCover(formdData);
                    } catch (error) {
                        this.logger.warn(error);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        } else {
            this.updateServiceCover(formdData);
        }
    }

    /** Method to be called before fetch  */
    private riMaintenanceBeforeFetch(): void {
        let scheduleSearch = this.uiForm.controls['ScheduleSearch'].value ? this.uiForm.controls['ScheduleSearch'].value : 'no';
        let postData = {};
        postData['ScheduleSearch'] = scheduleSearch;
        postData['ServiceCoverItemRowID'] = this.attributes.ServiceCoverItemRowID;
        postData['ServiceCoverROWID'] = this.uiForm.controls['ServiceCoverRowID'].value;
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                for (let cntrl in data) {
                    if (data.hasOwnProperty(cntrl)) {
                        if (this.uiForm.controls[cntrl]) {
                            if (cntrl === 'ReplacementIncludeInd' || cntrl === 'ServiceCoverRotation' || cntrl === 'UsePercentageValuesInd' || cntrl === 'ValidForDeletion' || cntrl === 'ScheduleRotation') {
                                this.uiForm.controls[cntrl].setValue(data[cntrl] === 'yes' ? true : false);
                            } else if (cntrl === 'EffectiveDate') {
                                let dateEarray = data[cntrl].split('/');
                                this.currDate = new Date(dateEarray[2], dateEarray[1] - 1, dateEarray[0]);
                                this.uiForm.controls[cntrl].setValue(this.globalize.parseDateStringToDate(data[cntrl]));
                            } else if (cntrl === 'ExchangesStartAfterDate') {
                                let dateEAarray = data[cntrl].split('/');
                                this.currDate2 = new Date(dateEAarray[2], dateEAarray[1] - 1, dateEAarray[0]);
                                this.uiForm.controls[cntrl].setValue(this.globalize.parseDateStringToDate(data[cntrl]));
                            } else if (cntrl === 'InitialComponentsDate') {
                                let dateEAarray = data[cntrl].split('/');
                                this.currDate4 = new Date(dateEAarray[2], dateEAarray[1] - 1, dateEAarray[0]);
                                this.uiForm.controls[cntrl].setValue(this.globalize.parseDateStringToDate(data[cntrl]));
                            } else {
                                this.uiForm.controls[cntrl].setValue(data[cntrl]);
                            }
                        }
                    }
                }
                this.getCurrentWeek();
                this.riMaintenanceAfterFetch();
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    /** Method to be called after abandon/cancel */
    private riMaintenanceAfterAbandon(): void {
        if (this.parentMode === 'DisplayUpd' || this.parentMode === 'ScheduleSearch') {
            this.getTotalValues();
        } else {
            if (this.uiForm.controls['UsePercentageValuesInd'].value) {
                this.fieldHidden.percentDisplay = false;
            } else {
                this.fieldHidden.percentDisplay = true;
            }
            if (this.uiForm.controls['ScheduleRotation'].value) {
                this.scheduleIDOonChange();
                if (this.uiForm.controls['ScheduleType'].value === 'C') {
                    this.deleteCustomSchedule();
                }
            }
        }
    }

    /**
     * Delete Custom schedule
     */
    public deleteCustomSchedule(): void {
        let postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ServiceCoverItemNumber'] = this.uiForm.controls['ServiceCoverItemNumber'].value;
        postData['Function'] = 'DeleteCustomSchedule';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    //
                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    /**
     * ScheduleID onchange method
     */
    public scheduleIDOonChange(): void {
        if (this.uiForm.controls['ScheduleID'].value) {
            let postData = {};
            postData['ScheduleID'] = 'BR';
            postData['Function'] = 'GetScheduleFields';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.selScheduleType) {
                            this.uiForm.controls['selScheduleType'].setValue(data.selScheduleType);
                        }
                        if (data.ScheduleName) {
                            this.uiForm.controls['ScheduleName'].setValue(data.ScheduleName);
                        }
                        if (this.uiForm.controls['ScheduleName'].value === 'BU' || this.uiForm.controls['ScheduleName'].value === 'BR') {
                            this.fieldRequired.ScheduleQty = true;
                        } else {
                            this.fieldRequired.ScheduleQty = false;
                        }
                        this.updatedRequired();
                        if (!this.setFormFlag.scheduleIDOonChange) {
                            this.setFormData();
                            this.setFormFlag.scheduleIDOonChange = true;
                        }
                    } catch (error) {
                        this.logger.warn(error);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.uiForm.controls['ScheduleID'].setValue('');
                    this.uiForm.controls['ScheduleName'].setValue('');
                    this.fieldRequired.ScheduleQty = false;
                }
            );
        } else {
            this.uiForm.controls['ScheduleName'].setValue('');
            this.fieldRequired.ScheduleQty = false;
        }
        this.updatedRequired();
    }

    /** Method to be called after abandon in add mode */
    private riMaintenanceAfterAbandonAdd(): void {
        let postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ServiceCoverItemNumber'] = this.uiForm.controls['ServiceCoverItemNumber'].value;
        postData['Function'] = 'DeleteCustomAddSchedule';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                this.logger.info('Done');
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    /**
     * Method to be called after fetch
     */

    public riMaintenanceAfterFetch(): void {
        if (this.uiForm.controls['RemovalDate'].value) {
            let rmdt = new Date(this.uiForm.controls['RemovalDate'].value), dt = new Date();
            if (rmdt.getTime() <= dt.getTime()) {
                this.disableButtons.update = false;
                this.disableButtons.delete = false;
            }
        }
        if (this.uiForm.controls['UsePercentageValuesInd'].value) {
            this.fieldHidden.percentDisplay = false;
            if (this.uiForm.controls['DisplayValue'].value) {
                this.displayValueOnChange();
            }
        } else {
            this.fieldHidden.percentDisplay = true;
        }
        this.displayScheduleFields();
        this.scheduleIDOonChange();
        this.branchServiceAreaCodeonChange();
        if (this.parentMode === 'ScheduleSearch') {
            this.getScheduleSearchFields();
        }
        this.riMaintenanceBeforeUpdate();
    }

    /**
     * Method to call service for schedule details
     */
    private getScheduleSearchFields(): void {
        let postData = {};
        postData['ServiceCoverItemRowID'] = this.riExchange.getParentAttributeValue('ContractNumberServiceCoverItemRowID');
        postData['Function'] = 'GetScheduleSearchFields';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.ContractName) {
                        this.uiForm.controls['ContractName'].setValue(data.ContractName);
                    }
                    if (data.PremiseName) {
                        this.uiForm.controls['PremiseName'].setValue(data.PremiseName);
                    }
                    if (data.ProductDesc) {
                        this.uiForm.controls['ProductDesc'].setValue(data.ProductDesc);
                    }
                    if (data.AccountNumber) {
                        this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
                    }
                    if (data.NegBranchNumber) {
                        this.uiForm.controls['NegBranchNumber'].setValue(data.NegBranchNumber);
                    }
                    if (data.RequiresManualVisitPlanningInd) {
                        this.uiForm.controls['RequiresManualVisitPlanningInd'].setValue(data.RequiresManualVisitPlanningInd);
                    }
                    if (data.AnnualCalendarInd) {
                        this.uiForm.controls['AnnualCalendarInd'].setValue(data.AnnualCalendarInd);
                    }
                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    /** Method to call before Save Add */
    private riMaintenanceBeforeSaveAdd(formdData: any): void {
        this.btnPopulateonclick(formdData, 'add');
    }

    /**
     * Matrialcost on change method
     */
    public materialsValueOnChange(): void {
        this.totalDisplayValues();
    }
    /**
     * LabourValue change method
     */
    public labourValueOnChange(): void {
        this.totalDisplayValues();
    }
    /**
     * Replacement value change method
     */
    public replacementValueOnChange(): void {
        this.totalDisplayValues();
    }
    /**
     * RenegOldContract onchange method
     */
    public renegOldContractOnchange(): void {
        this.utils.numberPadding(this.uiForm.controls['RenegOldContract'].value, 8);
    }
    /**
     * Get total display valuees from service call
     */
    private totalDisplayValues(): void {
        let postData = {};
        postData['MaterialsValue'] = this.formatDataType(this.uiForm.controls['MaterialsValue'].value, this.dataTypeControls['MaterialsValue']);
        postData['LabourValue'] = this.formatDataType(this.uiForm.controls['LabourValue'].value, this.dataTypeControls['LabourValue']);
        postData['ReplacementValue'] = this.formatDataType(this.uiForm.controls['ReplacementValue'].value, this.dataTypeControls['LabourValue']);
        postData['Function'] = 'TotalDisplayValues';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                if (data.DisplayValue) {
                    this.uiForm.controls['DisplayValue'].setValue(data.DisplayValue);
                }
                if (!this.setFormFlag.totalDisplayValues) {
                    this.setFormData();
                    this.setFormFlag.totalDisplayValues = true;
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    /**
     * Product range change method
     */
    public productRangeOnChange(index: any): void {
        if (this.uiForm.controls['ProductRange' + index].value) {
            let postData = {};
            postData['ProductRange'] = this.uiForm.controls['ProductRange' + index].value;
            postData['ProductComponentCode'] = this.uiForm.controls['ProductComponentCode' + index].value;
            postData['Function'] = 'GetRangeDesc';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    if (data.ProductRangeDesc) {
                        this.uiForm.controls['ProductRangeDesc' + index].setValue(data.ProductRangeDesc);
                    }
                    if (data.SequenceNumber) {
                        this.uiForm.controls['SequenceNumber' + index].setValue(data.SequenceNumber);
                    }
                    if (data.RotationalInterval) {
                        this.uiForm.controls['RotationalInterval' + index].setValue(data.RotationalInterval);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.uiForm.controls['ProductRange' + index].setValue('');
                    this.uiForm.controls['ProductRangeDesc' + index].setValue('');
                    this.uiForm.controls['SequenceNumber' + index].setValue('0');
                    this.uiForm.controls['RotationalInterval' + index].setValue('0');
                }
            );
        } else {
            this.uiForm.controls['ProductRange' + index].setValue('');
            this.uiForm.controls['ProductRangeDesc' + index].setValue('');
            this.uiForm.controls['SequenceNumber' + index].setValue('0');
            this.uiForm.controls['RotationalInterval' + index].setValue('0');
        }
    }
    /**
     * Method to call populate button click
     */

    public btnPopulateonclick(formData: any = {}, type: string = ''): void {
        let vbInclude: boolean = false;
        let postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['MaxComponentLines'] = this.pageParams.vMaxComponentLines;
        postData['MaterialsCost'] = this.formatDataType(this.uiForm.controls['MaterialsCost'].value, this.dataTypeControls['MaterialsCost']);
        for (let i = 1; i <= this.rowCount; i++) {
            if (this.uiForm.controls['ComponentTypeCode' + i].value)
                postData['ComponentTypeCode' + i] = this.uiForm.controls['ComponentTypeCode' + i].value;
            if (this.uiForm.controls['ProductComponentCode' + i].value)
                postData['ProductComponentCode' + i] = this.uiForm.controls['ProductComponentCode' + i].value;
            if (this.uiForm.controls['AlternateProductCode' + i].value)
                postData['AlternateProductCode' + i] = this.uiForm.controls['AlternateProductCode' + i].value;
            if (this.uiForm.controls['ComponentQuantity' + i].value)
                postData['ComponentQuantity' + i] = this.formatDataType(this.uiForm.controls['ComponentQuantity' + i].value, this.dataTypeControls['ComponentQuantity' + i]);
            if (this.uiForm.controls['ProductRange' + i].value)
                postData['ProductRange' + i] = this.uiForm.controls['ProductRange' + i].value;
            if (this.uiForm.controls['RotationalRule' + i].value)
                postData['RotationalRule' + i] = this.uiForm.controls['RotationalRule' + i].value;
            if (this.uiForm.controls['ProductRangeDesc' + i].value)
                postData['ProductRangeDesc' + i] = this.uiForm.controls['ProductRangeDesc' + i].value;
        }
        postData['Function'] = 'PopulateFields';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    } else {
                        for (let i = 1; i <= this.rowCount; i++) {
                            vbInclude = true;
                            this.uiForm.controls['ComponentTypeDesc' + i].setValue(data['ComponentTypeDesc' + i]);
                            this.uiForm.controls['AlternateProductCode' + i].setValue(data['AlternateProductCode' + i]);
                            this.uiForm.controls['ProductComponentCode' + i].setValue(data['ProductComponentCode' + i]);
                            this.uiForm.controls['ProductRange' + i].setValue(data['ProductRange' + i]);
                            this.uiForm.controls['ProductRangeDesc' + i].setValue(data['ProductRangeDesc' + i]);
                            this.uiForm.controls['RotationalRule' + i].setValue(data['RotationalRule' + i]);
                            if (type === 'add') {
                                formData['ComponentTypeDesc' + i] = data['ComponentTypeDesc' + i];
                                formData['AlternateProductCode' + i] = data['AlternateProductCode' + i];
                                formData['ProductComponentCode' + i] = data['ProductComponentCode' + i];
                                formData['ProductRange' + i] = data['ProductRange' + i];
                                formData['ProductRangeDesc' + i] = data['ProductRangeDesc' + i];
                                formData['RotationalRule' + i] = data['RotationalRule' + i];
                            }
                            for (let pobj of this.pageParams.vbDummyProductCodes) {
                                if (this.uiForm.controls['ProductComponentCode' + i].value) {
                                    if (this.uiForm.controls['ProductComponentCode' + i].value.toLowerCase() === pobj.toLowerCase() && this.uiForm.controls['ProductComponentDesc' + i].value && type !== 'add') {
                                        vbInclude = false;
                                        break;
                                    }
                                }
                            }
                            if (vbInclude === true) {
                                this.uiForm.controls['ProductComponentDesc' + i].setValue(data['ProductComponentDesc' + i]);
                                if (type === 'add') {
                                    formData['ProductComponentDesc' + i] = data['ProductComponentDesc' + i];
                                }
                            }
                            if (this.uiForm.controls['RotationalRule' + i].value) {
                                if (this.uiForm.controls['RotationalRule' + i].value.toLowerCase() === 'c' || this.uiForm.controls['RotationalRule' + i].value.toLowerCase() === 's') {
                                    this.fieldHidden['RotationalInterval' + i] = false;
                                } else {
                                    this.fieldHidden['RotationalInterval' + i] = true;
                                }
                            } else {
                                this.fieldHidden['RotationalInterval' + i] = true;
                            }
                            this.uiForm.controls['MaterialsCost'].setValue(data.MaterialsCost);
                        }
                        if (type === 'add') {

                            this.addServiceCover(formData);
                        }
                    }

                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }



    /**
     * Branch service area code onchange
     */
    public branchServiceAreaCodeonChange(): void {
        if (this.uiForm.controls['BranchServiceAreaCode'].value) {
            let postData = {};
            postData['BranchNumber'] = this.uiForm['ServiceBranchNumber'].value;
            postData['BranchServiceAreaCode'] = this.uiForm['BranchServiceAreaCode'].value;
            postData['Function'] = 'GetBranchServiceArea';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.BranchServiceAreaDesc) {
                            this.uiForm.controls['BranchServiceAreaDesc'].setValue(data.BranchServiceAreaDesc);
                        }
                        if (data.ScheduleEmployeeCode) {
                            this.uiForm.controls['ScheduleEmployeeCode'].setValue(data.ScheduleEmployeeCode);
                        }
                        if (data.ScheduleEmployeeName) {
                            this.uiForm.controls['ScheduleEmployeeName'].setValue(data.ScheduleEmployeeName);
                        }
                        if (!this.setFormFlag.branchServiceAreaCodeonChange) {
                            this.setFormData();
                            this.setFormFlag.branchServiceAreaCodeonChange = true;
                        }
                    } catch (error) {
                        this.logger.warn(error);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.uiForm.controls['BranchServiceAreaCode'].setValue('');
                    this.uiForm.controls['BranchServiceAreaDesc'].setValue('');
                    this.uiForm.controls['ScheduleEmployeeCode'].setValue('');
                    this.uiForm.controls['ScheduleEmployeeName'].setValue('');
                }
            );
        } else {
            this.uiForm.controls['BranchServiceAreaDesc'].setValue('');
            this.uiForm.controls['ScheduleEmployeeCode'].setValue('');
            this.uiForm.controls['ScheduleEmployeeName'].setValue('');
        }
    }

    /**
     *  Method to be called after saving service cover
     */
    private riMaintenanceAfterNormalAfterSave(): void {
        if (this.parentMode !== 'DisplayUpd' && this.parentMode !== 'ScheduleSearch') {
            this.pageParams.mode = 'add';
            setTimeout(() => {
                this.getTotalValues();
                this.addAfterInit = false;
            }, 3000);

        }
        this.pageParams.vbOrigScheduleID = '';
        this.pageParams.vbOrigScheduleType = '';
    }

    /**
     * Document unload checking display
     */
    public riExchangeQueryUnloadHTMLDocument(): void {
        if (this.parentMode === 'ServiceCoverAdd') {
            let postData = {};
            postData['ServiceCoverRowID'] = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
            postData['Function'] = 'CheckDisplayExists';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.errorMessage) {
                            this.errorModal.show(data, true);
                        }
                    } catch (error) {
                        this.logger.warn(error);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        }
    }

    /**
     * Method to call before abandon add
     */

    private riMaintenanceBeforeAbandonAdd(): void {
        let vbCustomComponents = '';
        for (let i = 1; i <= this.pageParams.vMaxComponentLines; i++) {
            if (this.uiForm.controls['RotationalRule' + i].value === 'C') {
                if (vbCustomComponents === '') {
                    vbCustomComponents += i;
                }
                else {
                    vbCustomComponents += '|' + i;
                }
            }
        }
        let postData = {};
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['SCComponentNumberList'] = vbCustomComponents;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                this.logger.info('Done');
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    /**
     * Premise location number onchange
     */

    public premiseLocationNumberOnChange(): void {
        if (this.uiForm.controls['PremiseLocationNumber'].value) {
            let postData = {};
            postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
            postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
            postData['PremiseLocationNumber'] = this.formatDataType(this.uiForm.controls['PremiseLocationNumber'].value, this.dataTypeControls['PremiseLocationNumber']);
            postData['Function'] = 'GetLocationDesc';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                (data) => {
                    try {
                        if (data.errorMessage && data.errorMessage !== '') {
                            this.errorModal.show(data, true);
                        } else {
                            this.uiForm.controls['PremiseLocationDesc'].setValue(data.PremiseLocationDesc);
                        }
                    } catch (error) {
                        this.logger.warn(error);
                    }
                    if (!this.setFormFlag.premiseLocationNumberOnChange) {
                        this.setFormData();
                        this.setFormFlag.premiseLocationNumberOnChange = true;
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.uiForm.controls['PremiseLocationNumber'].setValue('');
                    this.uiForm.controls['PremiseLocationDesc'].setValue('');
                }
            );
        } else {
            this.uiForm.controls['PremiseLocationDesc'].setValue('');
        }
    }

    /**
     * Method to calculate total
     */
    private getTotalValues(): void {
        let postData = {};
        postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
        postData['EffectiveDate'] = this.uiForm.controls['EffectiveDate'].value;
        postData['Function'] = 'GetServiceCoverTotals';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.TotalQty) {
                        this.uiForm.controls['TotalQty'].setValue(data.TotalQty);
                        this.riExchange.setParentHTMLValue('TotalQty', data.TotalQty);
                    }
                    if (data.TotalValue) {
                        this.uiForm.controls['TotalValue'].setValue(data.TotalValue);
                        this.riExchange.setParentHTMLValue('TotalValue', data.TotalValue);
                    }
                    if (data.TotalWEDValue) {
                        this.uiForm.controls['TotalWEDValue'].setValue(data.TotalWEDValue);
                        this.riExchange.setParentHTMLValue('TotalWEDValue', data.TotalWEDValue);
                    }
                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    /**
     * Display schedule fields based on conditions
     */
    private displayScheduleFields(): void {
        if (this.uiForm.controls['ScheduleRotation'].value === false) {
            this.fieldHidden.CurrentWeek = true;
            this.fieldHidden.ScheduleID = true;
            this.fieldHidden.ScheduleDetails = true;
            this.fieldHidden.ScheduleName = true;
            this.fieldHidden.ScheduleQty = true;
            this.fieldHidden.ExchangesStartAfterDate = true;
            this.fieldHidden.BranchServiceAreaCode = true;
            this.fieldHidden.ExchangesGenUpTo = true;
            this.fieldHidden.InitialComponentsDate = true;
            this.fieldRequired.ScheduleID = false;
            this.fieldRequired.ExchangesStartAfterDate = false;
            this.fieldHidden.ScheduleEmployeeName = true;
        } else {
            this.fieldHidden.CurrentWeek = false;
            this.fieldHidden.ScheduleID = false;
            this.fieldHidden.ScheduleDetails = false;
            this.fieldHidden.ScheduleName = false;
            this.fieldHidden.ScheduleQty = false;
            this.fieldHidden.ExchangesStartAfterDate = false;
            this.fieldHidden.BranchServiceAreaCode = false;
            this.fieldHidden.ExchangesGenUpTo = false;
            this.fieldRequired.ScheduleID = true;
            this.fieldRequired.ExchangesStartAfterDate = true;
            this.fieldHidden.InitialComponentsDate = false;
            this.fieldHidden.ScheduleEmployeeName = false;
        }
        this.updatedRequired();
    }
    /**
     * Method to get current week
     */
    public getCurrentWeek(): void {
        let postData = {};
        postData['Function'] = 'GetCurrentWeek';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.CurrentWeek)
                        this.uiForm.controls['CurrentWeek'].setValue(data.CurrentWeek);
                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    /**
     * cmdscheduleheader onclick method
     */
    public cmdScheduleHeaderOnClick(): void {
        if (this.pageParams.mode === 'add' || this.pageParams.mode === 'update') {
            if (this.uiForm.controls['ScheduleID'].value === '' && this.pageParams.vbOrigScheduleType !== 'C') {
                this.pageParams.queryParamMode = 'AddSchedule';
            } else {
                if (this.uiForm.controls['ScheduleID'].value === '' && this.pageParams.vbOrigScheduleType === 'C') {
                    this.uiForm.controls['ScheduleID'].setValue(this.pageParams.vbOrigScheduleID);
                    this.scheduleIDOonChange();
                }
                this.pageParams.queryParamMode = 'ViewSchedule';
            }
            ////To do
            //redirect/modal popup page
            //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBScheduleHeaderMaintenance.htm"
            this.messageModal.show({ msg: 'iCABSBScheduleHeaderMaintenance is not yet developed', title: this.pageTitle }, false);
            if (this.pageParams.queryParamMode === 'AddSchedule') {
                this.scheduleIDOonChange();
            }
        } else {
            if (this.uiForm.controls['ScheduleID'].value !== '') {
                this.pageParams.queryParamMode = 'ViewSchedule';
                this.messageModal.show({ msg: 'iCABSBScheduleHeaderMaintenance is not yet developed', title: this.pageTitle }, false);
                //To do
                //navigate window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBScheduleHeaderMaintenance.htm"
            }
        }

    }
    /**
     * cmdScheduleDetails onClick method
     */
    public cmdScheduleDetailsOnClick(): void {
        if (this.uiForm.controls['ScheduleID'].value !== '') {
            this.pageParams.queryParamMode = 'ViewScheduleDetails';
            this.messageModal.show({ msg: 'iCABSBScheduleDetailGrid is not yet developed', title: this.pageTitle }, false);
            //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBScheduleDetailGrid.htm"
        }
    }

    /**
     * Custom button click functionality
     */
    public btnCustomUpdateOnClick(index: any): void {
        this.genCheckValidProduct(index);
    }

    public genCheckValidProduct(index: any): void {
        let postData = {};
        postData['Function'] = 'CheckValidProduct';
        postData['ProductComponentCode'] = this.uiForm.controls['ProductComponentCode' + index].value;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.ErrorMessageDesc) {
                        this.messageModal.show({ msg: data.ErrorMessageDesc, title: this.pageTitle }, false);
                    } else {
                        this.uiForm.controls['SelComponentNumber'].setValue(index.toString());
                        this.uiForm.controls['SelProductComponentCode'].setValue(this.uiForm.controls['ProductComponentCode' + index].value);
                        this.uiForm.controls['SelProductRange'].setValue(this.uiForm.controls['ProductRange' + index].value);
                        this.uiForm.controls['SelProductRangeDesc'].setValue(this.uiForm.controls['ProductRangeDesc' + index].value);
                        this.uiForm.controls['RangeDetailSeqNo'].setValue(this.uiForm.controls['RangeDetailSeqNo' + index].value);
                        this.uiForm.controls['RangeDetailInterval'].setValue(this.uiForm.controls['RangeDetailInterval' + index].value);
                        // WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBRangeDetailGrid.htm"
                        //riExchange.Mode = "CustomUpdate": window.location = WindowPath
                        this.uiForm.controls['SelComponentNumber'].setValue('');
                        this.uiForm.controls['SelProductComponentCode'].setValue('');
                        this.uiForm.controls['SelProductRange'].setValue('');
                        this.uiForm.controls['SelProductRangeDesc'].setValue('');
                        this.uiForm.controls['SequenceNumber' + index].setValue(this.uiForm.controls['RangeDetailSeqNo'].value);
                        this.uiForm.controls['RangeDetailInterval'].setValue(this.uiForm.controls['RangeDetailInterval'].value);
                    }

                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    /**
     * Build menu options
     */
    private buildMenuOptions(): void {
        this.menuOptionsGroupscd = [];
        this.menuOptionsGroupsc = [];
        this.menuOptionsGroupscd.push({ text: 'Service Item Values', value: 'ServiceItemValues' });
        this.menuOptionsGroupscd.push({ text: 'Replacement History', value: 'ReplacementHistory' });

        this.menuOptionsGroupsc.push({ text: 'Planned Visits', value: 'PlannedVisits' });
        this.menuOptionsGroupsc.push({ text: 'Static Visits (SOS)', value: 'StaticVisits' });
        this.menuOptionsGroupsc.push({ text: 'Visit History', value: 'VisitHistory' });
        if (this.pageParams.vEnableLocations) {
            this.menuOptionsGroupsc.push({ text: 'Location', value: 'Location' });
        }
        this.menuOptionsGroupsc.push({ text: 'Service Cover History', value: 'ServiceCoverHistory' });
        this.menuOptionsGroupsc.push({ text: 'Service Values', value: 'ServiceValues' });
        this.menuOptionsGroupsc.push({ text: 'Pro Rata Charge', value: 'ProRata' });
        this.menuOptionsGroupsc.push({ text: 'Invoice History', value: 'InvoiceHistory' });
        this.menuOptionsGroupsc.push({ text: 'State of Service', value: 'StateOfService' });
        this.menuOptionsGroupsc.push({ text: 'Event History', value: 'EventHistory' });
        if (this.uiForm.controls['EmployeeLimitChildDrillOptions'].value !== 'Y') {
            this.menuOptionsGroupsc.push({ text: 'Contract', value: 'Contract' });
            this.menuOptionsGroupsc.push({ text: 'Premises', value: 'Premises' });
        }
        if (this.pageParams.contractType === 'C') {
            this.menuOptionsGroupsc.push({ text: 'Service Seasons', value: 'SeasonalService' });
            this.menuOptionsGroupsc.push({ text: 'Calendar', value: 'ServiceCalendar' });
            this.menuOptionsGroupsc.push({ text: 'Closed', value: 'ClosedCalendar' });
        }
        this.menuOptionsGroupsc.push({ text: 'Customer Information', value: 'CustomerInformation' });

        if (this.pageParams.contractType === 'C' || this.pageParams.contractType === 'J') {
            this.menuOptionsGroupsc.push({ text: 'Service Visit Planning', value: 'ServiceVisitPlanning' });
        }
    }

    /**
     * Serviceemployee data from ellipsis
     */
    public onAssignEmployeeDataReceived(data: any): void {
        this.uiForm.controls['ServiceSalesEmployee'].setValue(data.ServiceSalesEmployee);
        this.uiForm.controls['EmployeeSurname'].setValue(data.EmployeeSurname);
    }

    /**
     * Serviceemployee data from ellipsis
     */
    public onInstallationEmployeeCodDataReceived(data: any): void {
        this.uiForm.controls['InstallationEmployeeCode'].setValue(data.InstallationEmployeeCode);
        this.uiForm.controls['InstallationEmployeeName'].setValue(data.InstallationEmployeeName);
    }

    /**
     * Menu changes redirection
     */
    public menuonChange(menu: any): void {
        switch (menu) {
            case 'ServiceItemValues':
                this.messageModal.show({ msg: 'iCABSAServiceItemValues is not yet developed', title: this.pageTitle }, false);
                //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceItemValues.htm"
                break;
            case 'ReplacementHistory':
                this.messageModal.show({ msg: 'iCABSAServiceItemValues is not yet developed', title: this.pageTitle }, false);
                //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAReplacementHistoryGrid.htm"
                break;
            case 'PlannedVisits':
                this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR], {
                    queryParams: {
                        'parentMode': 'ServiceCover',
                        'CurrentContractTypeURLParameter': this.pageParams.contractType,
                        'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                        'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                        'ProductCode': this.uiForm.controls['ProductCode'].value,
                        'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value
                    }
                });
                break;
            case 'StaticVisits':
                this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSASTATICVISITGRIDYEAR], {
                    queryParams: {
                        'parentMode': 'ServiceCover',
                        'CurrentContractTypeURLParameter': this.pageParams.contractType,
                        'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                        'ContractName': this.uiForm.controls['ContractName'].value,
                        'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                        'PremiseName': this.uiForm.controls['PremiseName'].value,
                        'ProductCode': this.uiForm.controls['ProductCode'].value,
                        'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                        'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value
                    }
                });
                break;
            case 'VisitHistory':
                if (this.pageParams.blnAccess) {
                    // riExchange.Mode = "ServiceCover"
                    //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceVisitSummary.htm<maxwidth>" + CurrentContractTypeURLParameter
                    this.store.dispatch({
                        type: ContractActionTypes.SAVE_DATA,
                        payload: {
                            'CurrentContractTypeURLParameter': this.pageParams.contractType,
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                            'ContractName': this.uiForm.controls['ContractName'].value,
                            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                            'PremiseName': this.uiForm.controls['PremiseName'].value,
                            'ProductCode': this.uiForm.controls['ProductCode'].value,
                            'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                            'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value,
                            'currentContractType': this.pageParams.contractType
                        }
                    });
                    this.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVISITSUMMARY);
                }
                break;
            case 'Location':
                if (this.pageParams.blnAccess) {
                    this.navigate('Premise-Allocate', InternalGridSearchSalesModuleRoutes.ICABSAEMPTYPREMISELOCATIONSEARCHGRID);
                }
                break;
            case 'ServiceCoverHistory':
                if (this.pageParams.blnAccess) {
                    this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSACONTRACTHISTORYGRID], {
                        queryParams: {
                            'parentMode': 'ServiceCover',
                            'CurrentContractTypeURLParameter': this.pageParams.contractType,
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                            'ContractName': this.uiForm.controls['ContractName'].value,
                            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                            'PremiseName': this.uiForm.controls['PremiseName'].value,
                            'ProductCode': this.uiForm.controls['ProductCode'].value,
                            'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                            'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                            'ServiceCoverNumber': this.uiForm.controls['ServiceCoverNumber'].value,
                            'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value,
                            'currentContractType': this.pageParams.contractType
                        }
                    });
                }
                break;
            case 'ServiceValues':
                if (this.pageParams.blnAccess) {
                    this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID], {
                        queryParams: {
                            'parentMode': 'ServiceCoverAll',
                            'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                            'CurrentContractTypeURLParameter': this.pageParams.contractType,
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                            'ContractName': this.uiForm.controls['ContractName'].value,
                            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                            'PremiseName': this.uiForm.controls['PremiseName'].value,
                            'ProductCode': this.uiForm.controls['ProductCode'].value,
                            'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                            'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value
                        }
                    });
                }
                break;
            case 'ProRata':
                if (this.pageParams.blnAccess) {
                    this.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY, { 'CurrentContractTypeURLParameter': this.pageParams.contractType, 'currentContractType': this.pageParams.contractType });
                }
                break;
            case 'InvoiceHistory':
                if (this.pageParams.blnAccess) {
                    this.router.navigate(['/billtocash/contract/invoice'], {
                        queryParams: {
                            parentMode: 'Product',
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                            'ContractName': this.uiForm.controls['ContractName'].value,
                            'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                            'PremiseName': this.uiForm.controls['PremiseName'].value,
                            'ProductCode': this.uiForm.controls['ProductCode'].value,
                            'ProductDesc': this.uiForm.controls['ProductDesc'].value
                        }
                    });
                }
                break;
            case 'StateOfService':
                if (this.pageParams.blnAccess) {
                    this.messageModal.show({ msg: 'iCABSSeStateOfServiceNatAccountGrid is not yet developed', title: this.pageTitle }, false);
                    //riExchange.mode = "SOS"
                    //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Service/iCABSSeStateOfServiceNatAccountGrid.htm<maxwidth>"
                }
                break;
            case 'EventHistory':
                this.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSCMCUSTOMERCONTACTHISTORYGRID, { AccountNumber: this.uiForm.controls['AccountNumber'].value });

                break;
            case 'Contract':
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE],
                    {
                        queryParams: {
                            parentMode: 'ServiceCover',
                            'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                            'CurrentContractTypeURLParameter': this.pageParams.contractType,
                            'CurrentContractType': this.pageParams.contractType,
                            'ContractNumber': this.uiForm.controls['ContractNumber'].value
                        }
                    });

                break;
            case 'Premises':
                this.navigate('ServiceCover', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    CurrentContractTypeURLParameter: this.pageParams.contractType,
                    ContractNumber: this.uiForm.controls['ContractNumber'].value,
                    PremiseNumber: this.uiForm.controls['PremiseNumber'].value,
                    ProductCode: this.uiForm.controls['ProductCode'].value,
                    CurrentContractType: this.pageParams.contractType
                });

                break;
            case 'ServiceCalendar':
                if (this.uiForm.controls['RequiresManualVisitPlanningInd'].value === false) {
                    if (this.uiForm.controls['AnnualCalendarInd'].value) {
                        this.navigate('ServiceCover', 'grid/application/ServiceCoverCalendarDate',
                            {
                                'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                                'CurrentContractTypeURLParameter': this.pageParams.contractType,
                                'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                                'ContractName': this.uiForm.controls['ContractName'].value,
                                'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                                'PremiseName': this.uiForm.controls['PremiseName'].value,
                                'ProductCode': this.uiForm.controls['ProductCode'].value,
                                'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                                'SCRowID': this.uiForm.controls['ServiceCoverRowID'].value,
                                currentContractType: this.pageParams.contractType
                            });
                    }
                }
                break;
            case 'SeasonalService':
                this.router.navigate([InternalGridSearchApplicationModuleRoutes.ICABSASERVICECOVERSEASONGRID], {
                    queryParams: {
                        'parentMode': 'ServiceCover',
                        'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                        'CurrentContractTypeURLParameter': this.pageParams.contractType,
                        'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                        'ContractName': this.uiForm.controls['ContractName'].value,
                        'PremiseNumber': this.uiForm.controls['PremiseNumber'].value,
                        'PremiseName': this.uiForm.controls['PremiseName'].value,
                        'ProductCode': this.uiForm.controls['ProductCode'].value,
                        'ProductDesc': this.uiForm.controls['ProductDesc'].value,
                        'ServiceCoverRowID': this.uiForm.controls['ServiceCoverRowID'].value
                    }
                });
                break;
            case 'ClosedCalendar':
                if (this.uiForm.controls['RequiresManualVisitPlanningInd'].value === false) {
                    this.messageModal.show({ msg: 'iCABSAServiceCoverClosedDateGrid is not yet developed', title: this.pageTitle }, false);
                    // riExchange.mode = "ServiceCover"
                    //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverClosedDateGrid.htm<maxwidth>"
                }
                break;
            case 'CustomerInformation':
                this.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_2, {
                    'AccountNumber': this.uiForm.controls['AccountNumber'].value,
                    'CurrentContractTypeURLParameter': this.pageParams.contractType,
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                    'ContractName': this.uiForm.controls['ContractName'].value,
                    'currentContractType': this.pageParams.contractType
                });
                break;
            case 'ServiceVisitPlanning':
                if (this.uiForm.controls['RequiresManualVisitPlanningInd'].value) {
                    this.messageModal.show({ msg: 'iCABSAServiceVisitPlanningGrid is not yet developed', title: this.pageTitle }, false);
                    //ContractNumber.setAttribute "Mode", "Update"
                    //riExchange.Mode = "ServiceCover"
                    //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceVisitPlanningGrid.htm<maxwidth>"
                } else {
                    this.messageModal.show({ msg: MessageConstant.Message.productNotRequired, title: this.pageTitle }, false);
                }
                break;

            default:
                break;
        }
    }

    /**
     * Component type change
     */
    public componentTypeCodeOnChange(index: any): void {
        this.uiForm.controls['ComponentQuantity' + index].enable();
        if (this.uiForm.controls['ComponentTypeCode' + index].value !== '') {
            for (let vcomp of this.pageParams.vbSingleQtyComponents) {
                if (this.uiForm.controls['ComponentTypeCode' + index].value.toLowerCase() === vcomp.toLowerCase()) {
                    this.uiForm.controls['ComponentQuantity' + index].setValue('1');
                    this.uiForm.controls['ComponentQuantity' + index].disable();
                }
            }

            this.fieldRequired['ProductComponentCode' + index] = true;
            this.fieldRequired['ComponentQuantity' + index] = true;
            this.populateAttributes(index);

            this.fieldHidden.InitialComponentsDate = true;
        } else {
            this.fieldRequired['ProductComponentCode' + index] = false;
            this.fieldRequired['ComponentQuantity' + index] = false;
            this.fieldRequired['AttributeValueA' + index] = false;
            this.fieldRequired['AttributeValueB' + index] = false;
            this.uiForm.controls['ComponentTypeCode' + index].setValue('');
            this.uiForm.controls['ComponentTypeDesc' + index].setValue('');
            this.componentDropdownParam[index - 1].compTypeLangSearch.active = { id: '', text: '' };
            this.uiForm.controls['ProductComponentCode' + index].setValue('');
            this.uiForm.controls['AttributeCodeA' + index].setValue('');
            this.uiForm.controls['AttributeLabelA' + index].setValue('');
            this.uiForm.controls['AttributeValueA' + index].setValue('');
            this.uiForm.controls['AttributeCodeB' + index].setValue('');
            this.uiForm.controls['AlternateProductCode' + index].setValue('');
            this.uiForm.controls['AttributeValueB' + index].setValue('');
            this.uiForm.controls['AttributeLabelB' + index].setValue('');
            this.uiForm.controls['ProductComponentDesc' + index].setValue('');
            this.uiForm.controls['ComponentQuantity' + index].setValue('');
            this.AttributeCodeADisable[index - 1]['disableEllipsis'] = true;
            this.AttributeCodeBDisable[index - 1]['disableEllipsis'] = true;
        }
        this.updatedRequired();
    }

    /**
     * Populate attributes based on other parameters
     */
    public populateAttributes(index: any): void {
        let postData = {};
        postData['ComponentTypeCode'] = this.uiForm.controls['ComponentTypeCode' + index].value;
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['Function'] = 'PopulateAttributes';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    } else {
                        if (data.AttributeLabelA) {
                            this.uiForm.controls['AttributeLabelA' + index].setValue(data.AttributeLabelA);
                            this.productAttributeValueSearch[index - 1]['childConfigParams']['AttributeLabel'] = data.AttributeLabelA;
                        } else {
                            this.uiForm.controls['AttributeLabelA' + index].setValue('');
                            this.productAttributeValueSearch[index - 1]['childConfigParams']['AttributeLabel'] = '';
                        }
                        if (data.AttributeLabelB) {
                            this.uiForm.controls['AttributeLabelB' + index].setValue(data.AttributeLabelB);
                            this.productAttributeValueSearchB[index - 1]['childConfigParams']['AttributeLabel'] = data.AttributeLabelB;
                        } else {
                            this.uiForm.controls['AttributeLabelB' + index].setValue('');
                            this.productAttributeValueSearchB[index - 1]['childConfigParams']['AttributeLabel'] = '';
                        }
                        if (data.AttributeCodeA) {
                            this.uiForm.controls['AttributeCodeA' + index].setValue(data.AttributeCodeA);
                            this.productAttributeValueSearch[index - 1]['childConfigParams']['AttributeCode'] = data.AttributeCodeA;
                            this.AttributeCodeADisable[index - 1]['disableEllipsis'] = false;
                        } else {
                            this.AttributeCodeADisable[index - 1]['disableEllipsis'] = true;
                            this.uiForm.controls['AttributeCodeA' + index].setValue('');
                            this.productAttributeValueSearch[index - 1]['childConfigParams']['AttributeCode'] = '';
                        }
                        if (data.AttributeCodeB) {
                            this.uiForm.controls['AttributeCodeB' + index].setValue(data.AttributeCodeB);
                            this.productAttributeValueSearchB[index - 1]['childConfigParams']['AttributeCode'] = data.AttributeCodeB;
                            this.AttributeCodeBDisable[index - 1]['disableEllipsis'] = false;
                        } else {
                            this.AttributeCodeBDisable[index - 1]['disableEllipsis'] = true;
                            this.uiForm.controls['AttributeCodeB' + index].setValue('');
                            this.productAttributeValueSearchB[index - 1]['childConfigParams']['AttributeCode'] = '';
                        }
                        if (data.AttributeMandatoryA === 'yes') {
                            this.fieldRequired['AttributeValueA' + index] = true;
                        } else {
                            this.fieldRequired['AttributeValueA' + index] = false;
                        }
                        if (data.AttributeMandatoryB === 'yes') {
                            this.fieldRequired['AttributeValueB' + index] = true;
                        } else {
                            this.fieldRequired['AttributeValueB' + index] = false;
                        }
                        this.updatedRequired();
                    }
                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    /**
     * Save service cover validation and save
     */
    public saveData(): void {
        for (let c in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(c)) {
                if (typeof this.uiForm.controls[c].value === 'undefined') {
                    this.uiForm.controls[c].setValue('');
                }
                if (this.uiForm.controls[c].invalid) {
                    this.uiForm.controls[c].markAsTouched();
                    if (c === 'EffectiveDate') {
                        this.effectiveDateChild.validateDateField();
                    }
                }

            }

        }
        if (this.uiForm.valid) {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    }

    /**
     * After confirmation service call to add/update/delete
     */

    public promptConfirm(type: any): void {
        let formdData: any = {};
        switch (type) {
            case 'save':
                let formdData = {};
                if (this.pageParams.mode === 'update' && this.uiForm.controls['ServiceCoverRowID'].value !== '') {
                    for (let c in this.uiForm.controls) {
                        if (this.uiForm.controls.hasOwnProperty(c)) {
                            if (this.uiForm.controls[c].value) {
                                if (c === 'ServiceCoverRowID') {
                                    formdData['ServiceCoverROWID'] = this.uiForm.controls[c].value;
                                } else if (c === 'ReplacementIncludeInd' || c === 'ServiceCoverRotation' || c === 'UsePercentageValuesInd' || c === 'ValidForDeletion' || c === 'ScheduleRotation') {
                                    formdData[c] = (this.uiForm.controls[c].value) ? 'yes' : 'no';
                                } else if (c === 'ServiceCoverMode') {
                                    formdData['DisplayMode'] = this.uiForm.controls[c].value;
                                } else {
                                    formdData[c] = this.formatDataType(this.uiForm.controls[c].value, this.dataTypeControls[c]);
                                }

                            }
                        }
                    }
                    this.beforeSaveUpdate(formdData);
                } else {
                    for (let i = 1; i <= this.pageParams.vMaxComponentLines; i++) {
                        for (let c in this.uiForm.controls) {
                            if (this.uiForm.controls.hasOwnProperty(c)) {
                                if (this.uiForm.controls[c].value) {
                                    if (c === 'ServiceCoverRowID') {
                                        formdData['ServiceCoverROWID'] = this.uiForm.controls[c].value;
                                    } else if (c === 'ReplacementIncludeInd' || c === 'ServiceCoverRotation' || c === 'UsePercentageValuesInd' || c === 'ValidForDeletion' || c === 'ScheduleRotation') {
                                        formdData[c] = (this.uiForm.controls[c].value) ? 'yes' : 'no';
                                    } else if (c === 'ServiceCoverMode') {
                                        formdData['DisplayMode'] = this.uiForm.controls[c].value;
                                    } else {
                                        formdData[c] = this.formatDataType(this.uiForm.controls[c].value, this.dataTypeControls[c]);
                                    }

                                }
                            }
                        }
                        for (let i = 1; i <= this.rowCount; i++) {
                            for (let cnt = 0; cnt < this.ComponentColumnList.length; cnt++) {
                                formdData[this.ComponentColumnList[cnt] + i] = this.formatDataType(this.uiForm.controls[this.ComponentColumnList[cnt] + i].value, this.dataTypeControls[this.ComponentColumnList[cnt] + i]);
                            }
                        }
                    }
                    formdData['MaxComponentLines'] = 50;
                    this.riMaintenanceBeforeSaveAdd(formdData);
                }
                break;
            case 'delete':
                this.deleteServiceCover();
                break;
            default:
                break;
        }
        this.formPristine();
    }
    /**
     * Delete button click
     */

    public deleteData(obj: any): void {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModalDelete.show();
    }

    /**
     * Add service cover
     */
    private addServiceCover(frmdata: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '1');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, frmdata).subscribe(
            (e) => {

                try {
                    if (typeof e['status'] !== 'undefined' && e['status'] === 'failure') {
                        this.errorService.emitError(e.status);
                    } else {
                        if ((typeof e !== 'undefined' && e.errorMessage)) {
                            this.errorModal.show(e, true);
                        } else if (typeof e !== 'undefined' && e.Prospect !== '') {
                            this.addAfterInit = true;
                            this.resetFormdata();
                            this.uiForm.controls['DisplayQty'].setValue('');
                            this.formPristine();
                            this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                            this.addAfterInit = true;
                        }
                    }

                } catch (error) {
                    this.logger.warn(error);
                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            }
        );
    }

    /**
     * Update service Cover
     */
    public updateServiceCover(frmdata: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, frmdata).subscribe(
            (e) => {

                try {
                    if (typeof e['status'] !== 'undefined' && e['status'] === 'failure') {
                        this.errorService.emitError(e.status);
                    } else {
                        if ((typeof e !== 'undefined' && e.errorMessage)) {
                            this.errorModal.show(e, true);
                            this.errorService.emitError(e.errorMessage);
                        } else if (typeof e !== 'undefined' && e.Prospect !== '') {
                            this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                            this.formPristine();
                            this.riMaintenanceAfterNormalAfterSave();
                        }
                    }

                } catch (error) {
                    this.logger.warn(error);
                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            }
        );
    }

    /**
     * Method to Delete service cover
     */
    public deleteServiceCover(): void {
        let postData = {};
        postData['ServiceCoverRowID'] = this.uiForm.controls['ServiceCoverRowID'].value;
        postData['ServiceCoverNumber'] = this.uiForm.controls['ServiceCoverNumber'].value;
        postData['ContractNumber'] = this.uiForm.controls['ContractNumber'].value;
        postData['PremiseNumber'] = this.formatDataType(this.uiForm.controls['PremiseNumber'].value, this.dataTypeControls['PremiseNumber']);
        postData['ProductCode'] = this.uiForm.controls['ProductCode'].value;
        postData['DisplayMode'] = this.uiForm.controls['ServiceCoverMode'].value;
        postData['ServiceCoverItemRowID'] = this.attributes.ServiceCoverItemRowID;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '3');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    } else {
                        this.messageModal.show({ msg: 'Data deleted successfully', title: 'Message' }, false);
                    }

                } catch (error) {
                    this.logger.warn(error);
                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            }

        );
    }

    /**
     * Reset form data
     */
    public resetFormdata(): void {
        for (let c of this.controls) {
            this.uiForm.controls[c.name].setValue('');
        }
        let cntrl: string;
        for (let i = 1; i <= this.rowCount; i++) {
            cntrl = 'ProductComponentCode' + i;
            this.componentDropdownParam[i - 1].compTypeLangSearch.active = { id: '', text: '' };
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, cntrl, false);
            this.uiForm.controls[cntrl].updateValueAndValidity();
            this.uiForm.controls[cntrl].markAsUntouched();
            this.componentTypeCodeOnChange(i);
        }
        this.initData();
        this.uiForm.markAsUntouched();
        this.setFormFlag.rotationalRuleOnChange = false;
        this.setFormFlag.getPercentageValues = false;
        this.setFormFlag.scheduleIDOonChange = false;
        this.setFormFlag.branchServiceAreaCodeonChange = false;
        this.setFormFlag.premiseLocationNumberOnChange = false;
        this.setFormFlag.totalDisplayValues = false;
        this.setFormFlag.exchangesStartAfterDateSelectedValue = false;
        this.setFormFlag.displayValueOnChange = false;
    }

    public updatedRequired(): void {
        for (let f in this.fieldRequired) {
            if (this.fieldRequired.hasOwnProperty(f)) {
                if (this.uiForm.controls[f]) {
                    if (this.fieldRequired[f])
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, f, true);
                    else
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, f, false);
                    this.uiForm.controls[f].updateValueAndValidity();
                }
            }
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Cover Display Mainteinance';
        this.initData();
        this.setDataType();
    }

    ngOnDestroy(): void {
        this.lookUpSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        super.ngOnDestroy();
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.cbbService.disableComponent(true);
        }, 400);

        this.validateProperties = [{
            'type': MntConst.eTypeCode,
            'index': 0,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 1,
            'align': 'center'
        }, {
            'type': MntConst.eTypeCode,
            'index': 2,
            'align': 'center'
        }, {
            'type': MntConst.eTypeCode,
            'index': 3,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 4,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 5,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 6,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 7,
            'align': 'center'
        }, {
            'type': MntConst.eTypeText,
            'index': 8,
            'align': 'center'
        }, {
            'type': MntConst.eTypeDate,
            'index': 9,
            'align': 'center'
        }, {
            'type': MntConst.eTypeInteger,
            'index': 10,
            'align': 'center'
        }
        ];
    }

    public premiseLocationOnKeyDown(data: any): void {
        this.uiForm.controls['PremiseLocationNumber'].setValue(data.PremiseLocationNumber);
        this.uiForm.controls['PremiseLocationDesc'].setValue(data.PremiseLocationDesc);
    }
    /**
     * Method to call onchange ComponentTypeCode
     * @params: params: any
     * @returns: void
     */
    public onSelectCompTypeLangSearch(data: any, index: any): void {
        this.uiForm.controls['ComponentTypeCode' + index].setValue(data['ComponentTypeDescLang.ComponentTypeCode']);
        this.uiForm.controls['ComponentTypeDesc' + index].setValue(data['ComponentTypeDescLang.ComponentTypeDesc']);
        this.componentTypeCodeOnChange(index);
        this.setEllipsisParams(index);

    }
    private formatDataType(controlValue: any, controlDataType: string): any {
        let methodName: string = '';
        if (controlValue && controlDataType) {
            methodName = 'parse' + controlDataType.replace('eType', '') + 'ToFixedFormat';
            if (controlDataType === MntConst.eTypeDate)
                methodName = 'parseDateToFixedFormat';
            if (this.globalize[methodName]) {
                controlValue = this.globalize[methodName](controlValue);
            }
        }
        return controlValue;
    }
    private setDataType(): void {
        this.dataTypeControls = {
            'RenegOldValue': MntConst.eTypeCurrency,
            'RenegOldPremise': MntConst.eTypeInteger,
            'WEDValue': MntConst.eTypeDecimal1,
            'MaterialsValue': MntConst.eTypeCurrency,
            'LabourValue': MntConst.eTypeCurrency,
            'ReplacementValue': MntConst.eTypeCurrency,
            'MaterialsCost': MntConst.eTypeCurrency,
            'PremiseLocationNumber': MntConst.eTypeInteger,
            'ExpectedTotalQty': MntConst.eTypeInteger,
            'ExpectedTotalValue': MntConst.eTypeCurrency,
            'TotalQty': MntConst.eTypeInteger,
            'TotalValue': MntConst.eTypeCurrency,
            'TotalWEDValue': MntConst.eTypeDecimal1,
            'ScheduleQty': MntConst.eTypeInteger,
            'DisplayQty': MntConst.eTypeInteger,
            'PremiseNumber': MntConst.eTypeInteger,
            'DisplayValue': MntConst.eTypeCurrency,
            'MaterialsValuePerc': MntConst.eTypeDecimal2,
            'LabourValuePerc': MntConst.eTypeDecimal2,
            'ReplacementValuePerc': MntConst.eTypeDecimal2,
            'ExchangesGenUpTo': MntConst.eTypeDate,
            'ServiceCoverItemCommenceDate': MntConst.eTypeDate
        };
    }

    public onProductAttributeValueSearch(data: any, index: any): void {
        this.uiForm.controls['AttributeValueA' + index].setValue(data.SelAttributeValue1);
    }
    public onProductAttributeValueSearchB(data: any, index: any): void {
        this.uiForm.controls['AttributeValueB' + index].setValue(data.SelAttributeValue2);
    }
}
