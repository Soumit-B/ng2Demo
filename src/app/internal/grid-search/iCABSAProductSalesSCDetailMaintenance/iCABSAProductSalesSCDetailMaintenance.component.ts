import { InternalMaintenanceModuleRoutes, InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../../base/PageRoutes';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Input, NgZone, forwardRef, Inject, Renderer, ErrorHandler, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Http, URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { Subscription } from 'rxjs/Subscription';

import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { LookUp } from '../../../../shared/services/lookup';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { AjaxObservableConstant } from '../../../../shared/constants/ajax-observable.constant';
import { MessageService } from '../../../../shared/services/message.service';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ErrorService } from '../../../../shared/services/error.service';
import { HttpService } from '../../../../shared/services/http-service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { RiExchange } from '../../../../shared/services/riExchange';
import { Utils } from '../../../../shared/services/utility';
import { SpeedScript } from '../../../../shared/services/speedscript';
import { SysCharConstants } from '../../../../shared/constants/syscharservice.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

import { ContractSearchComponent } from './../../search/iCABSAContractSearch';
import { EmployeeSearchComponent } from './../../search/iCABSBEmployeeSearch';
import { TaxCodeSearchComponent } from './../../search/iCABSSTaxCodeSearch.component';
import { BranchServiceAreaSearchComponent } from './../../search/iCABSBBranchServiceAreaSearch';
import { BusinessOriginLangSearchComponent } from './../../search/iCABSBBusinessOriginLanguageSearch.component';
import { ServiceTypeSearchComponent } from './../../search/iCABSBServiceTypeSearch.component';
import { RouteAwayComponent } from './../../../../shared/components/route-away/route-away';
import { InternalGridSearchSalesModuleRoutes } from '../../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAProductSalesSCDetailMaintenance.html',
    providers: [ErrorService, MessageService]
})

export class ProductSalesSCDetailMntComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('TaxExemptionNumber') TaxExemptionNumber;
    @ViewChild('ServiceSalesEmployee') ServiceSalesEmployee;
    @ViewChild('TaxCode') TaxCode;
    @ViewChild('taxcodeLP') taxcodeLP;
    @ViewChild('ServiceQuantity') ServiceQuantity;
    @ViewChild('commissionEmp') commissionEmp;
    @ViewChild('installationEmp') installationEmp;
    @ViewChild('deliveryEmp') deliveryEmp;
    @ViewChild('svcArea') svcArea;
    @ViewChild('businessOri') businessOri;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('businessOriginDropdown') public businessOriginDropdown: BusinessOriginLangSearchComponent;
    @ViewChild('serviceTypeDropdown') public serviceTypeDropdown: ServiceTypeSearchComponent;
    public routeawaycomponent: RouteAwayComponent;

    private xhrParams = {
        module: 'contract-admin',
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAProductSalesSCDetailMaintenance'
    };

    public ContractObject = { type: '', label: '' };
    public URLparam: any;
    public uiForm: FormGroup;

    public search: URLSearchParams = new URLSearchParams();

    private subRoute: Subscription;
    private subFetch: Subscription;
    private subLookup: Subscription;
    private subLookup0: Subscription;
    private subLookup1: Subscription;
    private subLookup2: Subscription;
    private subSysChar: Subscription;
    public translateSub: Subscription;
    public subProductServiceType: Subscription;
    public subTaxExemption: Subscription;
    public subBusOriDtls: Subscription;
    public subCalcVals: Subscription;
    public subGetServiceDetails: Subscription;
    public subDefaultEmployeeByServiceArea: Subscription;
    public subDefaultDeliveryEmployee: Subscription;
    public subDefaultInstallationEmployee: Subscription;
    public subWarnValue: Subscription;

    public isRequesting: boolean = false;
    public invalidParentMode: boolean = false;
    private saveAction = 0;

    //Page Variables
    public ReqPremiseLoc;
    public NationalAccountChecked;
    public ReqRetainServiceWeekday;
    public ReqPartInvoicing;
    public DefaultInvoicePerDelivery;
    public vbEnableInstallsRemovals;
    public vbEnableWorkLoadIndex;
    public vbEnableMonthlyUnitPrice;
    public vbEnableDiscountUnitPrice;
    public cSCNOTDelByBrnchInvPerDel;
    public vbEnableProductServiceType;
    public LocationEnabled;
    public vbEnableDepositProcessing;

    public ServiceCoverAdded;
    public blnQuantityChanged;
    public blnLocationsAllowed;
    public blnDisplayOnFetch = false;
    public blnOrdered;
    public SavedServiceQuantity;
    public blnPrevInstallByBranchInd;
    public blnPrevDeliverByBranchInd;
    public SavedBranchServiceAreaCode;

    private FieldHideList: string = '';
    public ReqDetail = true;
    public ServiceCover = '';
    public InactiveEffectDate: any = null;
    public InstallationDate: any = null;
    public DeliveryDate: any = null;
    public PurchaseOrderExpiryDate: any = null;
    public DepositDate: any = '';
    private dirtyFlagPrompt = false;
    private flagOpenPage = true;
    public promptTitle: string = MessageConstant.Message.ConfirmTitle;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;

    //speedscript
    public vBusinessCode;
    public vSCEnableLocations;
    public vSCNationalAccountChecked;
    public vSCRetainServiceWeekday;
    public vSCEnableInvoiceByDelivery;
    public vSCDefaultInvoicePerDelivery;
    public vSCEnableInstallsRemovals;
    public vSCEnableWorkLoadIndex;
    public vSCEnableMonthlyUnitPrice;
    public vSCEnableDiscountUnitPrice;
    public glSCPORefsAtServiceCover;
    public glSCNOTDelByBrnchInvPerDel;
    public gcSCNOTDelByBrnchInvPerDel;
    public vSCEnableProductServiceType;
    public vEnableDepositProcessing;

    //Dropdown
    public menuOptions = [];
    public svcTypesOptions = [];
    public busOriDtlLangOptions = [];

    //Ellipsis
    public ellipsis = {
        commissionEmp: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp-ServiceCoverCommissionEmployee',
            ContractTypeCode: this.ContractObject.type,
            showAddNew: false,
            component: EmployeeSearchComponent
        },
        taxcode: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'Lookup',
            currentContractType: this.ContractObject.type,
            showAddNew: false,
            component: TaxCodeSearchComponent
        },
        installationEmp: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp-InstallationEmployee',
            ContractTypeCode: this.ContractObject.type,
            showAddNew: false,
            component: EmployeeSearchComponent
        },
        deliveryEmp: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp-DeliveryEmployee',
            ContractTypeCode: this.ContractObject.type,
            showAddNew: false,
            component: EmployeeSearchComponent
        },
        svcArea: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp-SC',
            currentContractType: this.ContractObject.type,
            ServiceBranchNumber: '',
            BranchName: '',
            showAddNew: false,
            component: BranchServiceAreaSearchComponent
        }
    };

    public dropdown: any = {
        businessOriginLang: {
            inputParams: {
                businessCode: '',
                countryCode: ''
            },
            isRequired: false,
            isDisabled: false,
            triggerValidate: false,
            active: {
                'id': '',
                'text': ''
            }
        },
        serviceTypeSearch: {
            inputParams: {
                businessCode: '',
                countryCode: '',
                params: {
                    parentMode: 'LookUp'
                }
            },
            isRequired: false,
            isDisabled: false,
            triggerValidate: false,
            arrMap: {},
            active: {
                'id': '',
                'text': ''
            }
        }
    };

    //Ui Fields
    public uiDisplay = {
        pageHeader: 'Service Cover Maintenance',
        trWorkLoadIndex: false,
        trMonthlyUnitPrice: false,
        trDiscountUnitPrice: false,
        trInstallByBranch: false,
        trPurchaseOrderDetails: false,
        TaxExemptionNumberLabel: false,
        TaxExemptionNumber: false,
        trBusinessOriginDetailCode: false,
        InstallationValue: false,
        tdInstallationValuelabel: false,
        tdOutstandingInstallationslabel: false,
        OutstandingInstallations: false,
        trZeroValueIncInvoice: false,
        tdInstallByBranchInd: false,
        tdInstallByBranchIndLabel: false,
        labelInactiveEffectDate: false,
        InactiveEffectDate: false,
        trPartInvoicing: false,
        trInstallationEmployee: false,
        trDeliveryEmployee: false,
        tdOutstandingDeliveries: true,
        OutstandingDeliveries: true,
        func: {
            snapshot: false,
            fetch: false,
            delete: false,
            select: false,
            add: false,
            update: false,
            save: false
        },
        displayMessage: true,
        label: {
            contractNo: '',
            tdLineOfService: ''
        },
        tab: {
            tab1: { visible: true, active: true },
            tab2: { visible: false, active: false },
            tab3: { visible: false, active: false }
        }
    };

    public pageId: string;
    public controls = [
        { name: 'menu', readonly: false, disabled: true, type: '', required: false, value: 'Options' },
        { name: 'ContractNumber', readonly: true, disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ContractName', readonly: true, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ContractCommenceDate', readonly: true, disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'PremiseNumber', readonly: true, disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PremiseName', readonly: true, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'Status', readonly: true, disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'InactiveEffectdate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'ProductCode', readonly: true, disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ProductDesc', readonly: true, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceBranchNumber', readonly: true, disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'BranchName', readonly: true, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceQuantity', readonly: false, disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'InstallByBranchInd', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'InstallationValue', readonly: false, disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'OutstandingInstallations', readonly: false, disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'DeliverByBranchInd', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'DeliveryChargeValue', readonly: false, disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'OutstandingDeliveries', readonly: false, disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ServiceAnnualValue', readonly: false, disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'DiscountInclRate', readonly: false, disabled: false, type: MntConst.eTypeDecimal2, required: false, value: '' },
        { name: 'MonthlyUnitPrice', readonly: false, disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'WorkLoadIndex', readonly: false, disabled: false, type: MntConst.eTypeDecimal2, required: false, value: '' },
        { name: 'WorkLoadIndexTotal', readonly: false, disabled: false, type: MntConst.eTypeDecimal2, required: false, value: '' },
        { name: 'DeliveryPartInvoiceInd', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'InvoiceSuspendInd', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'InvoiceSuspendText', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceSalesEmployee', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'EmployeeSurname', readonly: false, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'TaxCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'TaxCodeDesc', readonly: false, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'TaxExemptionNumber', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'BusinessOriginCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BusinessOriginDesc', readonly: false, disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BusinessOriginDetailCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ServiceTypeCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BranchServiceAreaCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BranchServiceAreaDesc', readonly: false, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceEmployeeCode', readonly: true, disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ServiceEmployeeDesc', readonly: false, disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'InstallationEmployeeCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'InstallationEmployeeName', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'InstallationDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'DeliveryEmployeeCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'DeliveryEmployeeName', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'DeliveryDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'PurchaseOrderNo', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'PurchaseOrderExpiryDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'ZeroValueIncInvoice', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'DepositAmount', readonly: false, disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'DepositDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'DepositAmountApplied', readonly: false, disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'DepositPostedDate', readonly: true, disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'ServiceSpecialInstructions', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'FieldHideList', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'NewPremise', readonly: true, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'JobSaleDeliveredQuantity', readonly: false, disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'DetailRequired', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'LostBusinessRequestNumber', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'CancelledInd', readonly: false, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ErrorMessageDesc', readonly: true, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ContractTypeCode', readonly: true, disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'EnableValueUpdate', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'EnableQuantityUpdate', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'DetailRequiredInd', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'SingleUnitPriceIT', readonly: false, disabled: false, type: MntConst.eTypeDecimal2, required: false, value: '' },
        { name: 'RequireExemptNumberInd', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'SCNOtdelByBrnchInvPerDelDesc', readonly: false, disabled: false, type: '', required: false, value: '' },
        { name: 'LocationsEnabled', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ValueRequiredInd', readonly: false, disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'LOSName', readonly: true, disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'DepositCanAmend', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPRODUCTSALESSCDETAILMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.vBusinessCode = this.utils.getBusinessCode();
        this.pageTitle = this.uiDisplay.pageHeader;
        this.initForm();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.subFetch) { this.subFetch.unsubscribe(); }
        if (this.subLookup) { this.subLookup.unsubscribe(); }
        if (this.subLookup0) { this.subLookup0.unsubscribe(); }
        if (this.subLookup1) { this.subLookup1.unsubscribe(); }
        if (this.subLookup2) { this.subLookup2.unsubscribe(); }
        if (this.subSysChar) { this.subSysChar.unsubscribe(); }
        if (this.translateSub) { this.translateSub.unsubscribe(); }
        if (this.subRoute) { this.subRoute.unsubscribe(); }
        if (this.subProductServiceType) { this.subProductServiceType.unsubscribe(); }
        if (this.subTaxExemption) { this.subTaxExemption.unsubscribe(); }
        if (this.subBusOriDtls) { this.subBusOriDtls.unsubscribe(); }
        if (this.subCalcVals) { this.subCalcVals.unsubscribe(); }
        if (this.subGetServiceDetails) { this.subGetServiceDetails.unsubscribe(); }
        if (this.subDefaultEmployeeByServiceArea) { this.subDefaultEmployeeByServiceArea.unsubscribe(); }
        if (this.subDefaultDeliveryEmployee) { this.subDefaultDeliveryEmployee.unsubscribe(); }
        if (this.subDefaultInstallationEmployee) { this.subDefaultInstallationEmployee.unsubscribe(); }
        if (this.subWarnValue) { this.subWarnValue.unsubscribe(); }
        this.riExchange.killStore();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    private window_onload(): void {
        this.ServiceCover = '';

        this.ContractObject.type = this.riExchange.getCurrentContractType();
        this.ContractObject.label = this.riExchange.getCurrentContractTypeLabel();
        this.URLparam = this.riExchange.getParentHTMLValue('currentContractTypeURLParameter');

        let strDocTitle = '^ 1 ^ Service Cover Maintenance';
        strDocTitle = strDocTitle.replace('^ 1 ^', this.ContractObject.label);
        this.uiDisplay.pageHeader = strDocTitle;
        this.utils.setTitle(this.uiDisplay.pageHeader);

        this.formData = this.riExchange.getParentHTMLValues();
        this.formData.ProductCode = this.riExchange.getParentAttributeValue('ProductCode');
        this.formData.ProductDesc = this.riExchange.getParentAttributeValue('ProductDesc');

        this.riExchange.renderParentFields(this.formData, this.uiForm, 'ContractNumber');
        this.riExchange.renderParentFields(this.formData, this.uiForm, 'ContractName');
        this.riExchange.renderParentFields(this.formData, this.uiForm, 'PremiseNumber');
        this.riExchange.renderParentFields(this.formData, this.uiForm, 'PremiseName');

        let parentMode = this.riExchange.getParentMode();
        if (parentMode === 'ProductSalesDelivery' || parentMode === 'ServiceAreaDetail' || parentMode === 'ServicePlanning') {
            this.blnOrdered = true;
        } else {
            this.riExchange.renderParentFields(this.formData, this.uiForm, 'ProductCode');
            this.riExchange.renderParentFields(this.formData, this.uiForm, 'ProductDesc');
            if (this.riExchange.getParentAttributeValue('Ordered') === 'yes') {
                this.blnOrdered = true;
            } else {
                this.blnOrdered = false;
            }
        }
        this.ServiceCover = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
        this.attributes.ServiceCoverRowID = this.ServiceCover;
        this.doLookupformData();
        this.buildMenuOptions();
        if (this.blnOrdered) {
            this.riExchange.enableButton(this.uiDisplay.func, 'fetch');

        } else {
            this.riExchange.enableButton(this.uiDisplay.func, 'add');
            this.enableSaveMode();
        }
        this.getSysCharDtetails();
    }

    private initForm(): void {
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    private getSysCharDtetails(): any {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableLocations,
            this.sysCharConstants.SystemCharEnableNationalAccountWarning,
            this.sysCharConstants.SystemCharEnableRetentionOfServiceWeekday,
            this.sysCharConstants.SystemCharEnableInvoiceByDelivery,
            this.sysCharConstants.SystemCharProductSalesDefaultInvoicePerDelivery,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableWorkLoadIndex,
            this.sysCharConstants.SystemCharEnableMonthlyUnitPrice,
            this.sysCharConstants.SystemCharDetermineIfProductQtyIncludedInvoice,
            this.sysCharConstants.SystemCharEnablePORefsAtServiceCoverLevel,
            this.sysCharConstants.SystemCharPSaleNotDelByBranchAndInvPerDel,
            this.sysCharConstants.SystemCharEnableProductServiceType,
            this.sysCharConstants.SystemCharEnableDepositProcessing
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.vBusinessCode,
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.logger.log('getSysCharDtetails', record);
            this.vSCEnableLocations = record[0].Logical;
            this.vSCNationalAccountChecked = record[1].Required;
            this.vSCRetainServiceWeekday = record[2].Required;
            this.vSCEnableInvoiceByDelivery = record[3].Required;
            this.vSCDefaultInvoicePerDelivery = record[4].Required;
            this.vSCEnableInstallsRemovals = record[5].Logical;
            this.vSCEnableWorkLoadIndex = record[6].Required;
            this.vSCEnableMonthlyUnitPrice = record[7].Required;
            this.vSCEnableDiscountUnitPrice = record[8].Required;
            this.glSCPORefsAtServiceCover = record[9].Logical;
            this.glSCNOTDelByBrnchInvPerDel = record[10].Required;
            this.gcSCNOTDelByBrnchInvPerDel = record[10].Required;
            this.vSCEnableProductServiceType = record[11].Required;
            this.vEnableDepositProcessing = record[12].Required;
            if (!this.glSCNOTDelByBrnchInvPerDel) { this.gcSCNOTDelByBrnchInvPerDel = ''; }

            this.ReqPremiseLoc = this.vSCEnableLocations;
            this.NationalAccountChecked = this.vSCNationalAccountChecked;
            this.ReqRetainServiceWeekday = this.vSCRetainServiceWeekday;
            this.ReqPartInvoicing = this.vSCEnableInvoiceByDelivery;
            this.DefaultInvoicePerDelivery = this.vSCDefaultInvoicePerDelivery;
            this.vbEnableInstallsRemovals = this.vSCEnableInstallsRemovals;
            this.vbEnableWorkLoadIndex = this.vSCEnableWorkLoadIndex;
            this.vbEnableMonthlyUnitPrice = this.vSCEnableMonthlyUnitPrice;
            this.vbEnableDiscountUnitPrice = this.vSCEnableDiscountUnitPrice;
            this.cSCNOTDelByBrnchInvPerDel = this.gcSCNOTDelByBrnchInvPerDel;
            this.vbEnableProductServiceType = this.vSCEnableProductServiceType;
            this.vbEnableDepositProcessing = this.vEnableDepositProcessing;

            this.uiDisplay.trWorkLoadIndex = this.vSCEnableWorkLoadIndex;
            this.uiDisplay.trMonthlyUnitPrice = this.vSCEnableMonthlyUnitPrice;
            this.uiDisplay.trDiscountUnitPrice = this.vSCEnableDiscountUnitPrice;

            if (!this.vbEnableInstallsRemovals) {
                this.uiDisplay.trInstallByBranch = false;
            } else {
                this.uiDisplay.trInstallByBranch = true;
            }

            if (this.glSCPORefsAtServiceCover) {
                this.uiDisplay.trPurchaseOrderDetails = true;
            }

            if (this.vbEnableProductServiceType) {
                this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceTypeCode');
                this.dropdown.serviceTypeSearch.isDisabled = true;
            } else {
                this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceTypeCode');
                this.dropdown.serviceTypeSearch.isDisabled = false;
            }

            //TABS
            if (this.vbEnableDepositProcessing) {
                this.uiDisplay.tab.tab2.visible = true;
            }
            this.uiDisplay.tab.tab3.visible = true;

            this.doFetch();
        });
    }

    public doLookupformData(): void {
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc', 'LocationsEnabled', 'ValueRequiredInd']
            }
        ];

        this.subLookup0 = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let contract = data[0][0];
            if (contract) {
                this.setControlValue('ContractName', contract.ContractName);
            }
            let premise = data[1][0];
            if (premise) {
                this.setControlValue('PremiseName', premise.PremiseName);
            }
            let product = data[2][0];
            if (product) {
                this.setControlValue('ProductDesc', product.ProductDesc);
                this.setControlValue('LocationsEnabled', product.LocationsEnabled);
                this.setControlValue('ValueRequiredInd', product.ValueRequiredInd);
            }

            if (this.ReqPremiseLoc && this.getControlValue('LocationsEnabled')) {
                this.ReqPremiseLoc = false;
            }

        });
    }

    private doFetch(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '0');
        search.set('ContractNumber', this.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        search.set('ProductCode', this.getControlValue('ProductCode'));
        search.set('ServiceCoverROWID', this.ServiceCover);

        this.subFetch = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                for (let i in data) {
                    if (i !== '') {
                        let value = data[i];
                        if (value === 'yes' || value === 'no') {
                            value = (value === 'yes') ? true : false;
                        }
                        this.setControlValue(i, value);
                    }
                }
                if (data.hasOwnProperty('FieldHideList')) {
                    this.FieldHideList = data.FieldHideList;
                }
                this.doLookupformData();
                this.doLookupUiParams();
                this.taxExemptionDisplay();
                this.riMaintenance_AfterFetch();

                if (this.vbEnableProductServiceType) {
                    this.getProductServiceType();
                }

                setTimeout(this.enableSaveMode(), 3000);
            });
    }

    public enableSaveMode(): void {
        this.routeAwayGlobals.setSaveEnabledFlag(true); //CR implementation
        if (!this.blnOrdered) {
            this.add();
            this.saveAction = 1;
        } else {
            this.update();
            this.saveAction = 2;
        }
        //if (this.riExchange.riInputElement.checked(this.uiForm, 'EnableQuantityUpdate')) {
        if (this.ServiceQuantity) this.ServiceQuantity.nativeElement.focus();
        //}
        this.riExchange.enableButton(this.uiDisplay.func, 'save');

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantity', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceAnnualValue', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceSalesEmployee', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TaxCode', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BusinessOriginCode', true);
        this.dropdown.businessOriginLang.isRequired = true;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceTypeCode', true);
        this.dropdown.serviceTypeSearch.isRequired = true;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', true);
    }

    //FETCH
    public doLookupUiParams(type?: any): void {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'BranchNumber': this.getControlValue('ServiceBranchNumber')
                },
                'fields': ['BranchName']
            },
            {
                'table': 'BranchServiceArea',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'BranchServiceAreaCode': this.getControlValue('BranchServiceAreaCode') //4
                },
                'fields': ['BranchServiceAreaDesc']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'EmployeeCode': this.getControlValue('ServiceSalesEmployee') //1
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'EmployeeCode': this.getControlValue('InstallationEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'EmployeeCode': this.getControlValue('DeliveryEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'EmployeeCode': this.getControlValue('ServiceEmployeeCode') //5
                },
                'fields': ['EmployeeSurname']
            }
        ];
        let lookupIP2 = [
            {
                'table': 'ServiceType',
                'query': {
                    'BusinessCode': this.vBusinessCode
                },
                'fields': ['ServiceTypeCode', 'ServiceTypeDesc']
            },
            {
                'table': 'BusinessOriginLang',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'BusinessOriginCode': this.getControlValue('BusinessOriginCode'),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessOriginDesc']
            },
            {
                'table': 'BusinessOriginDetailLang',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    //'BusinessOriginDetailCode': this.getControlValue('BusinessOriginDetailCode'),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessOriginCode', 'BusinessOriginDetailCode', 'BusinessOriginDetailDesc']
            },
            {
                'table': 'BusinessOrigin',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'BusinessOriginCode': this.getControlValue('BusinessOriginCode') //3
                },
                'fields': ['DetailRequiredInd']
            },
            {
                'table': 'TaxCode',
                'query': {
                    'TaxCode': this.getControlValue('TaxCode') //2
                },
                'fields': ['TaxCodeDesc']
            }
        ];

        this.subLookup1 = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.logger.log('subLookup1', data);
            let branch = data[0][0];
            if (branch) {
                this.setControlValue('BranchName', branch.BranchName);
            }
            let branchSvcAreaDesc = data[1][0];
            if (branchSvcAreaDesc) {
                this.setControlValue('BranchServiceAreaDesc', branchSvcAreaDesc.BranchServiceAreaDesc);
            } else { if (type === 4) this.showAlert('Record Not Found'); }
            let employee = data[2][0];
            if (employee) {
                this.setControlValue('EmployeeSurname', employee.EmployeeSurname);
            } else { if (type === 1) this.showAlert('Record Not Found'); }
            let instEmployee = data[3][0];
            if (instEmployee) {
                this.setControlValue('InstallationEmployeeName', instEmployee.EmployeeSurname);
            }
            let deliveryEmployee = data[4][0];
            if (deliveryEmployee) {
                this.setControlValue('DeliveryEmployeeName', deliveryEmployee.EmployeeSurname);
            }
            let svcEmployee = data[5][0];
            if (svcEmployee) {
                this.setControlValue('ServiceEmployeeDesc', svcEmployee.EmployeeSurname);
            } else { if (type === 5) this.showAlert('Record Not Found'); }
        });

        this.subLookup2 = this.LookUp.lookUpRecord(lookupIP2).subscribe((data) => {
            this.logger.log('subLookup2', data);
            let svcTypeDescArr = data[0];
            if (svcTypeDescArr) {
                this.svcTypesOptions = svcTypeDescArr;
                let selCode = this.getControlValue('ServiceTypeCode');
                this.setControlValue('ServiceTypeCode', selCode);
                this.dropdown.serviceTypeSearch.arrMap = {};
                for (let i = 0; i < svcTypeDescArr.length; i++) {
                    this.dropdown.serviceTypeSearch.arrMap[svcTypeDescArr[i].ServiceTypeCode] = svcTypeDescArr[i].ServiceTypeDesc;
                }
                if (selCode) {
                    this.dropdown.serviceTypeSearch.active = {
                        id: selCode,
                        text: selCode + ' - ' + this.dropdown.serviceTypeSearch.arrMap[selCode]
                    };
                }
            }
            let busOriLang = data[1][0];
            if (busOriLang) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDesc', busOriLang.BusinessOriginDesc);
                this.dropdown.businessOriginLang.active = {
                    id: this.getControlValue('BusinessOriginCode'),
                    text: this.getControlValue('BusinessOriginCode') + ' - ' + busOriLang.BusinessOriginDesc
                };
            }
            let busOriDtlLangArr = data[2];
            if (busOriDtlLangArr) {
                this.busOriDtlLangOptions = busOriDtlLangArr;
                this.setControlValue('BusinessOriginDetailCode', this.getControlValue('BusinessOriginDetailCode'));
            }
            let busOri = data[3][0];
            if (busOri) {
                this.setControlValue('DetailRequiredInd', busOri.DetailRequiredInd);
            } else { if (type === 3) this.showAlert('Record Not Found'); }
            let tax = data[4][0];
            if (tax) {
                this.setControlValue('TaxCodeDesc', tax.TaxCodeDesc);
            } else { if (type === 2) this.showAlert('Record Not Found'); }
        });
    }

    //FETCH
    private riMaintenance_AfterFetch(): void {
        this.uiDisplay.label.tdLineOfService = this.getControlValue('LOSName');
        this.SavedServiceQuantity = parseInt(this.getControlValue('ServiceQuantity'), 10);
        this.SavedBranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');

        if (this.getControlValue('ValueRequiredInd')) {
            this.uiDisplay.trZeroValueIncInvoice = true;
        } else {
            this.uiDisplay.trZeroValueIncInvoice = false;
        }

        if (this.FieldHideList.indexOf('InstallationValue') >= 0) {
            this.uiDisplay.InstallationValue = false;
            this.uiDisplay.tdInstallationValuelabel = false;
            this.uiDisplay.tdInstallByBranchInd = false;
            this.uiDisplay.tdInstallByBranchIndLabel = false;
        } else {
            this.uiDisplay.InstallationValue = true;
            this.uiDisplay.tdInstallationValuelabel = true;
            this.uiDisplay.tdInstallByBranchInd = true;
            this.uiDisplay.tdInstallByBranchIndLabel = true;
        }

        if (this.FieldHideList.indexOf('OutstandingInstallations') >= 0 ||
            parseInt(this.getControlValue('OutstandingInstallations'), 10) === 0
        ) {
            this.uiDisplay.tdOutstandingInstallationslabel = false;
            this.uiDisplay.OutstandingInstallations = false;
        } else {
            this.uiDisplay.tdOutstandingInstallationslabel = true;
            this.uiDisplay.OutstandingInstallations = true;
        }

        if (this.getControlValue('InactiveEffectDate') !== '') {
            this.uiDisplay.labelInactiveEffectDate = true;
            this.uiDisplay.InactiveEffectDate = true;
        } else {
            this.uiDisplay.labelInactiveEffectDate = false;
            this.uiDisplay.InactiveEffectDate = false;
        }

        this.blnDisplayOnFetch = true;

        this.InstallByBranchInd_onclick();

        this.blnDisplayOnFetch = false;

        if (this.getControlValue('CancelledInd') === 'yes') {
            this.riExchange.enableButton(this.uiDisplay.func, 'Add');
        } else {
            this.riExchange.enableButton(this.uiDisplay.func, 'Update');
        }

        if (this.ReqPremiseLoc && this.getControlValue('InstallByBranchInd')) {
            this.blnLocationsAllowed = true;
        } else {
            this.blnLocationsAllowed = false;
        }

        if (this.ReqPartInvoicing) {
            this.uiDisplay.trPartInvoicing = true;
        } else {
            this.uiDisplay.trPartInvoicing = false;
        }

        if (this.getControlValue('BusinessOriginDetailCode') !== '') {
            this.uiDisplay.trBusinessOriginDetailCode = true;
        }

        if (this.getControlValue('DepositCanAmend') !== 'Y') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'DepositDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'DepositAmount');
        }
    }

    private getProductServiceType(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetProductServiceType');
        search.set('ProductCode', this.getControlValue('ProductCode'));

        this.subProductServiceType = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                if (data.hasOwnProperty('ServiceTypeCode')) {
                    this.setControlValue('ServiceTypeCode', data.ServiceTypeCode);
                    this.dropdown.serviceTypeSearch.active = {
                        id: data.ServiceTypeCode,
                        text: data.ServiceTypeCode + ' - ' + this.dropdown.serviceTypeSearch.arrMap[data.ServiceTypeCode]
                    };
                }
            });
    }

    //FETCH
    private taxExemptionDisplay(): void {
        let taxCode = this.getControlValue('TaxCode');

        if (taxCode !== null && taxCode !== '') {
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set(this.serviceConstants.Action, '6');
            search.set('Function', 'GetRequireExemptNumberInd');
            search.set('TaxCodeForExemptionInd', taxCode);

            this.subTaxExemption = this.httpService.makeGetRequest(
                this.xhrParams.method,
                this.xhrParams.module,
                this.xhrParams.operation,
                search
            ).subscribe(
                (data) => {
                    if (data.hasOwnProperty('RequireExemptNumberInd')) {
                        this.setControlValue('RequireExemptNumberInd', (data.RequireExemptNumberInd === 'yes') ? true : false);
                        if (this.getControlValue('RequireExemptNumberInd')) {
                            this.uiDisplay.TaxExemptionNumberLabel = true;
                            this.uiDisplay.TaxExemptionNumber = true;
                        }
                        if (this.uiDisplay.func.add || this.uiDisplay.func.update) {
                            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TaxExemptionNumber', true);
                            if (this.TaxExemptionNumber) this.TaxExemptionNumber.nativeElement.focus();
                        }
                    } else {
                        this.uiDisplay.TaxExemptionNumberLabel = false;
                        this.uiDisplay.TaxExemptionNumber = false;

                        if (this.uiDisplay.func.add || this.uiDisplay.func.update) {
                            this.setControlValue('TaxExemptionNumber', '');
                            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TaxExemptionNumber', false);
                        }
                    }
                });
        } else {
            this.uiDisplay.TaxExemptionNumberLabel = false;
            this.uiDisplay.TaxExemptionNumber = false;

            if (this.uiDisplay.func.add || this.uiDisplay.func.update) {
                this.setControlValue('TaxExemptionNumber', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TaxExemptionNumber', false);
            }
        }
    }

    public buildMenuOptions(): void {
        // Portfolio Options
        let objPortfolioGroup = [{ value: 'TelesalesOrderLine', label: 'Telesales Order Line' }];

        // History Options
        let objHistoryGroup = [
            { value: 'History', label: 'Service Cover History' },
            { value: 'EventHistory', label: 'Event History' },
            { value: 'ServiceValue', label: 'Service Value' }
        ];

        // Invoicing Options
        let objInvoicingGroup = [
            { value: 'ProRata', label: 'Pro Rata Charge' },
            { value: 'InvoiceHistory', label: 'Invoice History' }
        ];

        // Service Options
        let objServiceGroup = [
            { value: 'PlanVisit', label: 'Planned Visits' },
            { value: 'VisitHistory', label: 'Visit History' },
            { value: 'ServiceDetail', label: 'Service Detail' },
            { value: 'Location', label: 'Location' }
        ];
        if (this.ReqDetail) { objServiceGroup.splice(2, 1); }

        // Customer Relations
        let objCustomerGroup = [
            { value: 'ContactManagement', label: 'Contact Management' },
            { value: 'CustomerInformation', label: 'Customer Information' }
        ];

        this.menuOptions = [
            { OptionGrp: 'Portfolio', Options: objPortfolioGroup },
            { OptionGrp: 'History', Options: objHistoryGroup },
            { OptionGrp: 'Invoicing', Options: objInvoicingGroup },
            { OptionGrp: 'Servicing', Options: objServiceGroup },
            { OptionGrp: 'Customer Relations', Options: objCustomerGroup }
        ];
    }
    public menu_onchange(menuSelected: any): void {
        let pageObj = {
            self: this,
            fb: this.uiForm.value
        };

        this.riExchange.initBridge(pageObj);
        if (typeof this.ServiceCover === 'undefined' || this.ServiceCover === '') {
            this.flagOpenPage = false;
        }

        let menu = this.getControlValue('menu');
        this.uiForm.controls['menu'].markAsPristine();
        if (this.flagOpenPage) {
            switch (menu) {
                case 'ContactManagement': this.cmdContactManagement_onclick(); break;
                case 'ServiceValue': this.cmdServiceValue_onclick(); break;
                case 'VisitHistory': this.cmdVisitHistory_onclick(); break;
                case 'History': this.cmdHistory_onclick(); break;
                case 'ServiceDetail': this.cmdServiceDetail_onclick(); break;
                case 'Location': this.cmdLocation_onclick(); break;
                case 'PlanVisit': this.cmdPlanVisit_onclick(); break;
                case 'ProRata': this.cmdProRata_onclick(); break;
                case 'InvoiceHistory': this.cmdInvoiceHistory_onclick(); break;
                case 'EventHistory': this.cmdEventHistory_onclick(); break;
                case 'CustomerInformation': this.cmdCustomerInformation_onclick(); break;
                case 'TelesalesOrderLine': this.cmdTelesalesOrderLine_onclick(); break;
            }
        } else {
            this.showAlert(MessageConstant.Message.RestrictedMode);
        }
    }
    private cmdCustomerInformation_onclick(): void {
        this.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1, {
            CurrentContractTypeURLParameter: this.ContractObject.type,
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName')
        });
    }

    private cmdTelesalesOrderLine_onclick(): void {
        this.navigate('ServiceCoverTeleSalesOrderLine', InternalGridSearchApplicationModuleRoutes.ICABSATELESALESORDERLINEGRID, { 'ServiceCover': this.ServiceCover });
    }

    private cmdContactManagement_onclick(): void {
        this.navigate('ServiceCover', '/ccm/contact/search', {
            CurrentContractTypeURLParameter: this.ContractObject.type,
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            PremiseName: this.getControlValue('PremiseName'),
            ProductCode: this.getControlValue('ProductCode'),
            ProductDesc: this.getControlValue('ProductDesc')
        });
    }
    private cmdHistory_onclick(): void {
        this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSACONTRACTHISTORYGRID], {
            queryParams: {
                parentMode: 'ServiceCover',
                CurrentContractTypeURLParameter: this.ContractObject.type,
                ContractNumber: this.getControlValue('ContractNumber'),
                ContractName: this.getControlValue('ContractName'),
                PremiseNumber: this.getControlValue('PremiseNumber'),
                PremiseName: this.getControlValue('PremiseName'),
                ProductCode: this.getControlValue('ProductCode'),
                ProductDesc: this.getControlValue('ProductDesc'),
                ServiceCoverRowID: this.ServiceCover
            }
        });
    }
    private cmdServiceValue_onclick(): void {
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID], {
            queryParams: {
                ParentMode: 'ServiceCoverAll',
                CurrentContractTypeURLParameter: this.ContractObject.type
            }
        });
    }
    private cmdLocation_onclick(): void {
        if (!this.blnLocationsAllowed) {
            this.showAlert('Function Not Available');
        } else {
            this.router.navigate(['/application/premiseLocationAllocation'], {
                queryParams: {
                    parentMode: 'Premise-Allocate',
                    CurrentContractTypeURLParameter: this.formData.currentContractType,
                    'ServiceCoverRowID': this.ServiceCover,
                    'ContractTypeCode': this.pageParams.CurrentContractType,
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                }
            });
        }
    }
    private cmdVisitHistory_onclick(): void {
        //TODO
        this.showAlert('iCABSSeServiceVisitSearch.htm - Page not covered in current sprint');
        // this.router.navigate(['iCABSSeServiceVisitSearch.htm'], {
        //     queryParams: {
        //         parentMode: 'ServiceCover',
        //         CurrentContractTypeURLParameter: this.formData.currentContractType
        //     }
        // });
    }
    private cmdServiceDetail_onclick(): void {
        if (!this.getControlValue('DetailRequired')) {
            this.showAlert('Function Not Available');
        } else {
            //TODO
            this.showAlert('iCABSAServiceDetailSearch.htm - Page not covered in current sprint');
            // this.router.navigate(['iCABSAServiceDetailSearch.htm'], {
            //     queryParams: {
            //         parentMode: 'ServiceCover',
            //         CurrentContractTypeURLParameter: this.formData.currentContractType
            //     }
            // });
        }
    }
    private cmdPlanVisit_onclick(): void {
        if (this.flagOpenPage) {
            this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR], {
                queryParams: {
                    parentMode: 'ServiceCover',
                    ProductCode: this.getControlValue('ProductCode'),
                    CurrentContractTypeURLParameter: this.URLparam
                }
            });
        } else {
            this.showAlert(MessageConstant.Message.RestrictedMode);
        }
    }
    private cmdProRata_onclick(): void {
        if (this.flagOpenPage) {
            this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY], {
                queryParams: {
                    parentMode: 'ServiceCover',
                    parentPage: 'iCABSAProductSalesSCDetailMaintenance',
                    currentContractType: this.ContractObject.type,
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    PremiseName: this.getControlValue('PremiseName'),
                    ProductCode: this.getControlValue('ProductCode'),
                    ProductDesc: this.getControlValue('ProductDesc'),
                    ServiceCoverRowID: this.ServiceCover,
                    ServiceCommenceDate: this.getControlValue('ContractCommenceDate')
                }
            });
        } else {
            this.showAlert(MessageConstant.Message.RestrictedMode);
        }
    }
    private cmdInvoiceHistory_onclick(): void {
        this.router.navigate(['/billtocash/contract/invoice'], {
            queryParams: {
                parentMode: 'Product',
                CurrentContractTypeURLParameter: this.ContractObject.type
            }
        });
    }
    private cmdEventHistory_onclick(): void {
        this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSCMCUSTOMERCONTACTHISTORYGRID], {
            queryParams: {
                parentMode: 'ServiceCover',
                CurrentContractTypeURLParameter: this.formData.currentContractType
            }
        });
    }

    public renderTab(tabindex: number): void {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                break;
            case 3:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = true;
                break;
        }
    }

    private flagIgnore = false;
    private callbackRef: any;
    private showAlert(msgTxt: string, type?: number, callback?: any): void {
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = MessageConstant.Message.ErrorTitle; break;
            case 1: titleModal = MessageConstant.Message.MessageTitle; break;
            case 2: titleModal = MessageConstant.Message.MessageTitle; break;
        }

        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
        if (callback) this.callbackRef = callback;
    }

    public selectedInactiveEffectDate(obj: any): void {
        this.InactiveEffectDate = obj.value;
        this.setControlValue('InactiveEffectDate', this.InactiveEffectDate);
    }

    public selectedInstallationDate(obj: any): void {
        this.InstallationDate = obj.value;
        this.setControlValue('InstallationDate', this.InstallationDate);
    }

    public selectedDeliveryDate(obj: any): void {
        this.DeliveryDate = obj.value;
        this.setControlValue('DeliveryDate', this.DeliveryDate);
    }

    public selectedPurchaseOrderExpiryDate(obj: any): void {
        this.PurchaseOrderExpiryDate = obj.value;
        this.setControlValue('PurchaseOrderExpiryDate', this.PurchaseOrderExpiryDate);
    }

    public selectedDepositDate(obj: any): void {
        this.DepositDate = obj.value;
        this.setControlValue('DepositDate', this.DepositDate);
    }

    public update(): void {
        this.logger.log('UPDATE');
        this.riExchange.riInputElement.Enable(this.uiForm, 'menu');
        this.riMaintenance_BeforeUpdate();
        this.riExchange_CBORequest();
        this.riMaintenance_BeforeUpdateMode();
    }
    //UPDATE mode
    private riMaintenance_BeforeUpdate(): void {
        this.renderTab(1);
    }
    //UPDATE mode
    private riMaintenance_BeforeUpdateMode(): void {
        this.blnQuantityChanged = false;

        this.uiDisplay.trInstallationEmployee = false;
        this.uiDisplay.trDeliveryEmployee = false;

        this.riExchange.riInputElement.Disable(this.uiForm, 'InstallationEmployeeCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryEmployeeCode');

        if (!this.getControlValue('EnableValueUpdate')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceAnnualValue');
        }

        if (!this.getControlValue('EnableQuantityUpdate')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceQuantity');
        }

        this.riExchange.riInputElement.Disable(this.uiForm, 'InstallationValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingDeliveries');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InstallByBranchInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'DeliverByBranchInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceSuspendInd');

        if (!this.getControlValue('DeliverByBranchInd')) {
            if (this.cSCNOTDelByBrnchInvPerDel === '') {
                this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryPartInvoiceInd');
            }
        }

        if (parseInt(this.utils.getBranchCode(), 10) !== parseInt(this.getControlValue('ServiceBranchNumber'), 10)) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceSalesEmployee');
            if (this.TaxCode) this.TaxCode.nativeElement.focus();
        } else {
            if (this.ServiceSalesEmployee) this.ServiceSalesEmployee.nativeElement.focus();
        }

        this.InstallByBranchInd_onclick();
        this.DeliverByBranchInd_onclick();

        if (this.getControlValue('EnableQuantityUpdate')) {
            if (this.ServiceQuantity) this.ServiceQuantity.nativeElement.focus();
        }
    }
    //UPDATE Mode
    private riExchange_CBORequest(): void {
        if (this.getControlValue('BusinessOriginCode') !== '') {
            let search0: URLSearchParams = new URLSearchParams();
            search0.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
            search0.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search0.set(this.serviceConstants.Action, '6');

            let formData = {};
            formData['Function'] = 'GetBusinessOrigin';
            formData['BusinessOriginCode'] = this.getControlValue('BusinessOriginCode');
            this.subBusOriDtls = this.httpService.makePostRequest(
                this.xhrParams.method,
                this.xhrParams.module,
                this.xhrParams.operation,
                search0,
                formData
            ).subscribe(
                (data) => {
                    if (data.hasOwnProperty('DetailRequiredInd')) {
                        this.setControlValue('DetailRequiredInd', (data.DetailRequiredInd === 'yes') ? true : false);
                    }

                    if (this.getControlValue('DetailRequiredInd')) {
                        this.uiDisplay.trBusinessOriginDetailCode = true;
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BusinessOriginDetailCode', true);
                    } else {
                        this.uiDisplay.trBusinessOriginDetailCode = false;
                        this.setControlValue('BusinessOriginDetailCode', '');
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BusinessOriginDetailCode', false);
                    }
                });
        }

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'BranchServiceAreaCode') &&
            this.getControlValue('BranchServiceAreaCode') !== '') {
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set(this.serviceConstants.Action, '6');
            search.set('Function', 'DefaultEmployeeByServiceArea');
            search.set('ServiceBranchNumber', this.getControlValue('ServiceBranchNumber'));
            search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));

            this.subDefaultEmployeeByServiceArea = this.httpService.makeGetRequest(
                this.xhrParams.method,
                this.xhrParams.module,
                this.xhrParams.operation,
                search
            ).subscribe(
                (data) => {
                    if (data.hasOwnProperty('ServiceEmployeeCode')) this.setControlValue('ServiceEmployeeCode', data.ServiceEmployeeCode);
                    if (data.hasOwnProperty('ServiceEmployeeDesc')) this.setControlValue('ServiceEmployeeDesc', data.ServiceEmployeeDesc);
                    if (data.hasOwnProperty('BranchServiceAreaDesc')) this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
                });
        }

        if ((this.riExchange.riInputElement.HasChanged(this.uiForm, 'BranchServiceAreaCode') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'OutstandingDeliveries')) &&
            (this.getControlValue('DeliverByBranchInd'))
        ) {
            let OutstandingDeliveries = parseInt(this.getControlValue('OutstandingDeliveries'), 10);
            let JobSaleDeliveredQuantity = parseInt(this.getControlValue('JobSaleDeliveredQuantity'), 10);
            let ServiceQuantity = parseInt(this.getControlValue('ServiceQuantity'), 10);

            if (isNaN(OutstandingDeliveries)) {
                this.setControlValue('OutstandingDeliveries', '0');
            }

            if (isNaN(JobSaleDeliveredQuantity)) {
                this.setControlValue('JobSaleDeliveredQuantity', '0');
            }

            if (!isNaN(ServiceQuantity) && !isNaN(OutstandingDeliveries)) {
                if (OutstandingDeliveries < ServiceQuantity) {
                    let search1: URLSearchParams = new URLSearchParams();
                    search1.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
                    search1.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                    search1.set(this.serviceConstants.Action, '6');
                    search1.set('Function', 'DefaultDeliveryEmployee');
                    search1.set('ServiceBranchNumber', this.getControlValue('ServiceBranchNumber'));
                    search1.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));

                    this.subDefaultDeliveryEmployee = this.httpService.makeGetRequest(
                        this.xhrParams.method,
                        this.xhrParams.module,
                        this.xhrParams.operation,
                        search1
                    ).subscribe(
                        (data) => {
                            if (data.hasOwnProperty('DeliveryEmployeeCode')) this.setControlValue('DeliveryEmployeeCode', data.DeliveryEmployeeCode);
                            if (data.hasOwnProperty('DeliveryEmployeeName')) this.setControlValue('DeliveryEmployeeName', data.DeliveryEmployeeName);

                            this.uiDisplay.trDeliveryEmployee = true;
                            this.riExchange.riInputElement.Enable(this.uiForm, 'DeliveryEmployeeCode');
                        });
                } else {
                    this.uiDisplay.trDeliveryEmployee = false;
                    this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryEmployeeCode');
                }
            }
        }

        if ((this.riExchange.riInputElement.HasChanged(this.uiForm, 'BranchServiceAreaCode') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'OutstandingDeliveries')) &&
            (this.getControlValue('InstallByBranchInd'))
        ) {
            let OutstandingInstallations = parseInt(this.getControlValue('OutstandingInstallations'), 10);
            let ServiceQuantity = parseInt(this.getControlValue('ServiceQuantity'), 10);

            if (!isNaN(OutstandingInstallations)) {
                this.setControlValue('OutstandingInstallations', '0');
            }

            if (OutstandingInstallations < ServiceQuantity) {
                let search2: URLSearchParams = new URLSearchParams();
                search2.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
                search2.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                search2.set(this.serviceConstants.Action, '6');
                search2.set('Function', 'DefaultInstallationEmployee');
                search2.set('ServiceBranchNumber', this.getControlValue('ServiceBranchNumber'));
                search2.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));

                this.subDefaultInstallationEmployee = this.httpService.makeGetRequest(
                    this.xhrParams.method,
                    this.xhrParams.module,
                    this.xhrParams.operation,
                    search2
                ).subscribe(
                    (data) => {
                        if (data.hasOwnProperty('InstallationEmployeeCode')) this.setControlValue('InstallationEmployeeCode', data.InstallationEmployeeCode);
                        if (data.hasOwnProperty('InstallationEmployeeName')) this.setControlValue('InstallationEmployeeName', data.InstallationEmployeeName);

                        this.uiDisplay.trInstallationEmployee = true;
                        this.riExchange.riInputElement.Enable(this.uiForm, 'InstallationEmployeeCode');
                    });
            } else {
                this.uiDisplay.trInstallationEmployee = false;
                this.riExchange.riInputElement.Disable(this.uiForm, 'InstallationEmployeeCode');
            }
        }

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceAnnualValue')) {
            let vbQty = 1;
            let vbFreq = 1;
            let vbVal = 0;
            let MonthlyUnitPrice = 0;
            if (this.vbEnableMonthlyUnitPrice && (this.getControlValue('ServiceAnnualValue') !== '')) {
                let ServiceQuantity = parseInt(this.getControlValue('ServiceQuantity'), 10);
                if (ServiceQuantity !== 0 && ServiceQuantity !== null) {
                    vbQty = ServiceQuantity;
                } else {
                    vbQty = 1;
                    vbVal = parseInt(this.getControlValue('ServiceAnnualValue'), 10);
                    MonthlyUnitPrice = (vbVal / vbQty / vbFreq);
                    this.setControlValue('MonthlyUnitPrice', MonthlyUnitPrice);
                }
            }

            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'TaxCode')) {
                this.taxExemptionDisplay();
            }

            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ProductCode') && this.uiDisplay.func.add && this.vbEnableProductServiceType) {
                this.getProductServiceType();
            }
        }
    }

    //ADD mode
    public add(): void {
        this.logger.log('ADD');
        this.riExchange.riInputElement.Disable(this.uiForm, 'menu');
        this.riMaintenance_BeforeAddMode();
    }
    //ADD mode
    private riMaintenance_BeforeAddMode(): void {
        this.SavedServiceQuantity = 0;

        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;

        this.uiDisplay.trInstallationEmployee = false;
        this.uiDisplay.trDeliveryEmployee = false;

        this.setControlValue('DeliverByBranchInd', true);

        this.riExchange.riInputElement.Disable(this.uiForm, 'InstallationEmployeeCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryEmployeeCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceSuspendInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceSuspendText');

        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetServiceDetails');
        search.set('ContractTypeCode', this.ContractObject.type);
        search.set('contractNumber', this.getControlValue('ContractNumber'));
        search.set('premiseNumber', this.getControlValue('PremiseNumber'));
        search.set('productCode', this.getControlValue('ProductCode'));

        this.subGetServiceDetails = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                if (data.hasOwnProperty('errorMessage')) {
                    if (data.errorMessage.trim() !== '') {
                        this.showAlert(data.errorMessage, 2);
                    }
                }

                for (let i in data) {
                    if (i !== '') {
                        let value = data[i];
                        if (value === 'yes' || value === 'no') {
                            value = (value === 'yes') ? true : false;
                        }
                        this.setControlValue(i, value);
                    }
                }
                if (data.hasOwnProperty('FieldHideList')) {
                    this.FieldHideList = data.FieldHideList;
                }

                this.SavedBranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
                this.uiDisplay.label.tdLineOfService = this.getControlValue('LOSName');

                if (this.FieldHideList.indexOf('InstallationValue') >= 0) {
                    this.uiDisplay.InstallationValue = false;
                    this.uiDisplay.tdInstallationValuelabel = false;
                    this.uiDisplay.tdInstallByBranchInd = false;
                    this.uiDisplay.tdInstallByBranchIndLabel = false;
                } else {
                    this.uiDisplay.InstallationValue = true;
                    this.uiDisplay.tdInstallationValuelabel = true;
                    this.uiDisplay.tdInstallByBranchInd = true;
                    this.uiDisplay.tdInstallByBranchIndLabel = true;
                }

                this.InstallByBranchInd_onclick();
                //   this.DeliverByBranchInd_onclick();

                if (this.ReqPartInvoicing) {
                    this.uiDisplay.trPartInvoicing = true;
                    if (this.getControlValue('DeliverByBranchInd')) {
                        this.setControlValue('DeliveryPartInvoiceInd', this.DefaultInvoicePerDelivery);
                    }
                    if (this.cSCNOTDelByBrnchInvPerDel === '') {
                        this.riExchange.riInputElement.Enable(this.uiForm, 'DeliveryPartInvoiceInd');
                    }
                } else {
                    this.uiDisplay.trPartInvoicing = false;
                }

                this.setControlValue('ContractTypeCode', this.ContractObject.type);

                if (this.getControlValue('ValueRequiredInd')) {
                    this.uiDisplay.trZeroValueIncInvoice = true;
                } else {
                    this.uiDisplay.trZeroValueIncInvoice = false;
                }

                this.ellipsis.svcArea.parentMode = 'LookUp-SC';
                this.ellipsis.svcArea.currentContractType = this.ContractObject.type;
                this.ellipsis.svcArea.ServiceBranchNumber = this.getControlValue('ServiceBranchNumber');
                this.ellipsis.svcArea.BranchName = this.getControlValue('BranchName');
            });
    }

    //SAVE mode
    public save(flag?: boolean): void {

        if (this.flagIgnore) {
            this.flagIgnore = false;
            if (typeof this.callbackRef === 'function') this.callbackRef();
            return;
        }

        let status = true;
        this.dropdown.businessOriginLang.triggerValidate = true;
        status = this.riExchange.validateForm(this.uiForm);
        if (this.uiForm.status === 'VALID') {
            status = true;
        } else {
            status = false;
            if (!status) {
                for (let control in this.uiForm.controls) {
                    if (this.uiForm.controls[control].invalid) {
                        if (document.getElementById(control)) {
                            setTimeout(() => { document.getElementById(control).focus(); }, 200);
                        }
                        if (control === 'ServiceTypeCode') {
                            this.dropdown.serviceTypeSearch.triggerValidate = true;
                        }
                    }
                }
            }
        }

        if (status) {
            if (typeof flag !== 'undefined' && flag === true) {
                if (this.dirtyFlagPrompt === true) {
                    this.dirtyFlagPrompt = false;
                    this.promptModal.show();
                }
            } else {
                //Show Warning if any
                let search: URLSearchParams = new URLSearchParams();
                search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
                search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                search.set(this.serviceConstants.Action, '6');

                search.set(this.serviceConstants.Function, 'WarnValue');
                search.set('ServiceAnnualValue', this.getControlValue('ServiceAnnualValue'));
                search.set('ProductCode', this.getControlValue('ProductCode'));

                this.subWarnValue = this.httpService.makeGetRequest(
                    this.xhrParams.method,
                    this.xhrParams.module,
                    this.xhrParams.operation,
                    search
                ).subscribe(
                    (data) => {
                        this.dirtyFlagPrompt = true;
                        if (data.hasOwnProperty('ErrorMessageDesc')) {
                            if (data.ErrorMessageDesc.trim() !== '') {
                                this.showAlert(data.ErrorMessageDesc, 2);
                            } else {
                                this.save(true);
                            }
                        }
                    });
            }
        }
    }

    public promptSave(event: any): void {
        this.riMaintenance_BeforeSave();
    }

    //SAVE mode
    private riMaintenance_BeforeSave(): void {
        this.ServiceAnnualValue_onchange();
    }

    //SAVE mode
    public ServiceAnnualValue_onchange(): void {
        this.isRequesting = true;
        if (this.saveAction === 1) {
            this.blnDisplayOnFetch = true;
            this.InstallByBranchInd_onclick();
            this.DeliverByBranchInd_onclick();
        }

        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, this.saveAction.toString());

        let formData = {};
        formData['Function'] = 'WarnValue';
        if (this.saveAction === 2) { formData['ServiceCoverROWID'] = this.ServiceCover; }
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formData['ProductCode'] = this.getControlValue('ProductCode');
        formData['ServiceBranchNumber'] = this.getControlValue('ServiceBranchNumber');
        formData['ServiceQuantity'] = this.getControlValue('ServiceQuantity');
        formData['InstallByBranchInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('InstallByBranchInd'));
        formData['InstallationValue'] = this.getControlValue('InstallationValue');
        formData['DeliverByBranchInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('DeliverByBranchInd'));
        formData['DeliveryPartInvoiceInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('DeliveryPartInvoiceInd'));
        formData['InvoiceSuspendInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('InvoiceSuspendInd'));
        formData['InvoiceSuspendText'] = this.getControlValue('InvoiceSuspendText');
        formData['ServiceSalesEmployee'] = this.getControlValue('ServiceSalesEmployee');
        formData['PurchaseOrderNo'] = this.getControlValue('PurchaseOrderNo');
        formData['PurchaseOrderExpiryDate'] = this.getControlValue('PurchaseOrderExpiryDate');
        formData['TaxCode'] = this.getControlValue('TaxCode');
        formData['BusinessOriginCode'] = this.getControlValue('BusinessOriginCode');
        formData['BusinessOriginDetailCode'] = this.getControlValue('BusinessOriginDetailCode');
        formData['ServiceTypeCode'] = this.getControlValue('ServiceTypeCode');
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['InstallationEmployeeCode'] = this.getControlValue('InstallationEmployeeCode');
        formData['InstallationDate'] = this.getControlValue('InstallationDate');
        formData['DeliveryEmployeeCode'] = this.getControlValue('DeliveryEmployeeCode');
        formData['DeliveryDate'] = this.getControlValue('DeliveryDate');
        formData['ServiceSpecialInstructions'] = this.getControlValue('ServiceSpecialInstructions');
        formData['OutstandingInstallations'] = this.getControlValue('OutstandingInstallations');
        formData['WorkLoadIndex'] = this.getControlValue('WorkLoadIndex');
        formData['TaxExemptionNumber'] = this.getControlValue('TaxExemptionNumber');
        formData['ZeroValueIncInvoice'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('ZeroValueIncInvoice'));
        formData['ContractTypeCode'] = this.ContractObject.type;
        formData['OutstandingDeliveries'] = this.getControlValue('OutstandingDeliveries');
        formData['NewPremise'] = this.getControlValue('NewPremise');
        formData['DetailRequired'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('DetailRequired'));
        formData['ServiceEmployeeCode'] = this.getControlValue('ServiceEmployeeCode');
        formData['ServiceAnnualValue'] = this.getControlValue('ServiceAnnualValue');
        formData['DeliveryChargeValue'] = this.getControlValue('DeliveryChargeValue');
        formData['ErrorMessageDesc'] = this.getControlValue('ErrorMessageDesc');
        formData['SingleUnitPriceIT'] = this.getControlValue('SingleUnitPriceIT');
        formData['DiscountInclRate'] = this.getControlValue('DiscountInclRate');
        formData['LOSName'] = this.getControlValue('LOSName');
        formData['DepositAmount'] = this.getControlValue('DepositAmount');
        formData['DepositDate'] = this.getControlValue('DepositDate');
        formData['DepositAmountApplied'] = this.getControlValue('DepositAmountApplied');
        formData['DepositPostedDate'] = this.getControlValue('DepositPostedDate');
        formData['DepositCanAmend'] = this.getControlValue('DepositCanAmend');

        this.subWarnValue = this.httpService.makePostRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search,
            formData
        ).subscribe(
            (data) => {
                this.isRequesting = false;
                if (data.hasError) this.showAlert(data.errorMessage);
                else {
                    for (let i in data) {
                        if (i) {
                            if (document.getElementById(i)) {
                                if (document.getElementById(i).getAttribute('type') === 'checkbox') {
                                    this.setControlValue(i, (data[i].toString().toLowerCase() === 'yes') ? true : false);
                                }
                            }
                            else {
                                if (i === 'ServiceCover') { this.ServiceCover = data[i]; }
                                this.setControlValue(i, data[i]);
                            }
                        }
                    }
                    this.flagIgnore = true;
                    this.showAlert(MessageConstant.Message.SavedSuccessfully, 1, this.riMaintenance_AfterSave);
                }
            });
    }

    //SAVE mode
    private riMaintenance_AfterSave(): void {
        let parentMode = this.riExchange.getParentMode();
        this.routeAwayGlobals.setSaveEnabledFlag(false); //CR implementation
        this.uiForm.markAsPristine();

        this.attributes.ServiceCoverRowID = this.ServiceCover;
        //Validate premises are not added without service cover
        if (parentMode === 'Premise-Add') {
            this.attributes.ServiceCoverAdded = 'yes';
        }
        if (this.getControlValue('DetailRequired')) {
            this.navigate('ServiceCover', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE, {
                'currentContractType': this.ContractObject.type,
                'ContractNumber': this.getControlValue('ContractNumber'),
                'ContractName': this.getControlValue('ContractName'),
                'PremiseNumber': this.getControlValue('PremiseNumber'),
                'PremiseName': this.getControlValue('PremiseName'),
                'ProductCode': this.getControlValue('ProductCode'),
                'ProductDesc': this.getControlValue('ProductDesc'),
                'ServiceCoverRowID': this.ServiceCover
            });
        } else if (this.ReqPremiseLoc &&
            this.getControlValue('InstallByBranchInd')
            && (this.blnQuantityChanged || this.uiDisplay.func.add)) {
            this.navigate('Premise-Allocate', '/application/premiseLocationAllocation', {
                'currentContractType': this.ContractObject.type,
                'CurrentContractTypeURLParameter': this.ContractObject.type,
                'ContractTypeCode': this.ContractObject.type,
                'ContractNumber': this.getControlValue('ContractNumber'),
                'ContractName': this.getControlValue('ContractName'),
                'PremiseNumber': this.getControlValue('PremiseNumber'),
                'PremiseName': this.getControlValue('PremiseName'),
                'ProductCode': this.getControlValue('ProductCode'),
                'ProductDesc': this.getControlValue('ProductDesc'),
                'ServiceCoverRowID': this.ServiceCover
            });
        } else {
            // this.router.navigate(['grid/contractmanagement/maintenance/productSalesSCEntryGrid']);
            this.location.back();
        }
    }

    //CANCEL mode
    public cancel(): void {
        //this.logger.log('CANCEL');
        this.riMaintenance_AfterAbandon();
    }
    //CANCEL mode
    private riMaintenance_AfterAbandon(): void {
        // this.router.navigate(['grid/contractmanagement/maintenance/productSalesSCEntryGrid']);
        this.location.back();
    }

    public DeliverByBranchInd_onclick(): void {
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'DeliverByBranchInd') && !this.blnOrdered) {
            if (this.getControlValue('DeliverByBranchInd')) {
                this.setControlValue('InstallByBranchInd', false);
                this.InstallByBranchInd_onclick();
                this.uiDisplay.tdOutstandingDeliveries = false;
                this.uiDisplay.OutstandingDeliveries = false;

                if (this.ReqPartInvoicing) {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'DeliveryPartInvoiceInd');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'DeliveryPartInvoiceInd', this.DefaultInvoicePerDelivery);
                    this.DeliveryPartInvoiceInd_OnClick();
                }
            } else {
                this.uiDisplay.tdOutstandingDeliveries = true;
                this.uiDisplay.OutstandingDeliveries = true;


                this.uiDisplay.trDeliveryEmployee = false;
                if (this.ReqPartInvoicing) {
                    if (this.cSCNOTDelByBrnchInvPerDel === '') {
                        this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryPartInvoiceInd');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'DeliveryPartInvoiceInd', false);
                    } else {
                        this.DeliveryPartInvoiceInd_OnClick();
                    }
                }
            }
        }
    }

    public DeliveryPartInvoiceInd_OnClick(): void {
        if (this.cSCNOTDelByBrnchInvPerDel !== '') {
            if (this.uiDisplay.func.add) {
                if (!this.getControlValue('DeliverByBranchInd')) {
                    if (this.getControlValue('DeliveryPartInvoiceInd')) {
                        this.setControlValue('BranchServiceAreaCode', this.cSCNOTDelByBrnchInvPerDel);
                        this.setControlValue('BranchServiceAreaDesc', this.getControlValue('SCNOTDelByBrnchInvPerDelDesc'));
                    } else {
                        this.setControlValue('BranchServiceAreaCode', this.SavedBranchServiceAreaCode);
                    }
                } else {
                    this.setControlValue('BranchServiceAreaCode', this.SavedBranchServiceAreaCode);
                }

                //Pull back the branch service area description and employee details
                let search: URLSearchParams = new URLSearchParams();
                search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
                search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                search.set(this.serviceConstants.Action, '6');
                search.set('Function', 'DefaultEmployeeByServiceArea');
                search.set('ServiceBranchNumber', this.getControlValue('ServiceBranchNumber'));
                search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));

                this.subDefaultEmployeeByServiceArea = this.httpService.makeGetRequest(
                    this.xhrParams.method,
                    this.xhrParams.module,
                    this.xhrParams.operation,
                    search
                ).subscribe(
                    (data) => {
                        if (data.hasOwnProperty('ServiceEmployeeCode')) this.setControlValue('ServiceEmployeeCode', data.ServiceEmployeeCode);
                        if (data.hasOwnProperty('ServiceEmployeeDesc')) this.setControlValue('ServiceEmployeeDesc', data.ServiceEmployeeDesc);
                        if (data.hasOwnProperty('BranchServiceAreaDesc')) this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
                    });
            }
        }
    }

    public InstallByBranchInd_onclick(): void {
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'InstallByBranchInd') || this.blnDisplayOnFetch) {
            if (this.getControlValue('InstallByBranchInd')) {
                if (this.FieldHideList.indexOf('OutstandingInstallations') >= 0) {
                    this.uiDisplay.tdOutstandingInstallationslabel = false;
                    this.uiDisplay.OutstandingInstallations = false;
                } else {
                    this.uiDisplay.tdOutstandingInstallationslabel = true;
                    this.uiDisplay.OutstandingInstallations = true;
                }
                this.setControlValue('OutstandingInstallations', this.getControlValue('ServiceQuantity'));
                this.setControlValue('DeliverByBranchInd', false);
                this.DeliverByBranchInd_onclick();
                if (this.ReqPremiseLoc) {
                    this.blnLocationsAllowed = true;
                }
                if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'InstallByBranchInd')) {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'OutstandingInstallations');
                }
            } else {
                this.uiDisplay.OutstandingInstallations = false;
                this.uiDisplay.tdOutstandingInstallationslabel = false;
                this.blnLocationsAllowed = false;
                if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'InstallByBranchInd')) {
                    this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
                }
                this.uiDisplay.trInstallationEmployee = false;
            }
        }
    }

    public ServiceQuantity_onChange(obj: any): void {
        let svcQuantity = parseInt(this.getControlValue('ServiceQuantity'), 10);
        let savedSvcQuantity = parseInt(this.getControlValue('SavedServiceQuantity'), 10);
        if (svcQuantity === savedSvcQuantity) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingDeliveries');
            this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
        } else {
            if (this.getControlValue('InstallByBranchInd')) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'OutstandingInstallations');
                this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingDeliveries');
            } else {
                this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
            }
            if (this.getControlValue('DeliverByBranchInd')) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'OutstandingDeliveries');
                this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
            } else {
                this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingDeliveries');
            }
        }

        //bug fix
        if (this.uiDisplay.func.update) {
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity')) {
                this.blnQuantityChanged = true;
            }
        }

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity')) {
            let search5: URLSearchParams = new URLSearchParams();
            search5.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
            search5.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search5.set(this.serviceConstants.Action, '6');
            search5.set('Function', 'CalculateValues');
            search5.set('ContractTypeCode', this.ContractObject.type);
            if (this.uiDisplay.func.update) { search5.set('ServiceCoverRowID', this.ServiceCover); }
            search5.set('ProductCode', this.getControlValue('ProductCode'));
            search5.set('ServiceQuantity', this.getControlValue('ServiceQuantity'));
            search5.set('ServiceAnnualValue', this.getControlValue('ServiceAnnualValue'));
            search5.set('DeliverByBranchInd', this.utils.convertCheckboxValueToRequestValue(this.getControlValue('DeliverByBranchInd')));
            search5.set('InstallByBranchInd', this.utils.convertCheckboxValueToRequestValue(this.getControlValue('InstallByBranchInd')));
            search5.set('OutstandingInstallations', this.getControlValue('OutstandingInstallations'));

            this.subCalcVals = this.httpService.makeGetRequest(
                this.xhrParams.method,
                this.xhrParams.module,
                this.xhrParams.operation,
                search5
            ).subscribe(
                (data) => {
                    if (data.hasOwnProperty('ServiceAnnualValue')) {
                        // this.setControlValue('ServiceAnnualValue', data.ServiceAnnualValue);
                        this.setControlValue('ServiceAnnualValue', this.globalize.formatCurrencyToLocaleFormat(data.ServiceAnnualValue));
                    }
                    if (data.hasOwnProperty('InstallationValue')) { this.setControlValue('InstallationValue', data.InstallationValue); }
                    if (data.hasOwnProperty('OutstandingInstallations')) { this.setControlValue('OutstandingInstallations', data.OutstandingInstallations); }
                    if (data.hasOwnProperty('OutstandingDeliveries')) { this.setControlValue('OutstandingDeliveries', data.OutstandingDeliveries); }
                });

            if (this.vbEnableWorkLoadIndex) {
                let svcQuantity = parseInt(this.getControlValue('ServiceQuantity'), 10);
                let workLoad = parseInt(this.getControlValue('WorkLoadIndex'), 10);
                if (svcQuantity !== 0) {
                    this.setControlValue('WorkLoadIndexTotal', (workLoad * svcQuantity));
                } else {
                    this.setControlValue('WorkLoadIndexTotal', workLoad);
                }
            }
        }
    }

    //Readonly
    public ProductCode_onkeydown(obj: any): void {/*if (window.event.keyCode = 34) {Call ProductCodeSelection}*/ }
    public ProductCode_onChange(obj: any): void {
        if (this.uiDisplay.func.add && this.vbEnableProductServiceType) {
            this.getProductServiceType();
        }
    }
    private productCodeSelection(): void { //Unused function
        if (this.uiDisplay.func.add) {
            if (this.vbEnableProductServiceType) { this.getProductServiceType(); }
            //TODO
            // this.router.navigate(['iCABSBProductSearch.htm'], {
            //     queryParams: {
            //         parentMode: 'ServiceCover-' + this.ContractObject.type,
            //         CurrentContractTypeURLParameter: this.formData.currentContractType
            //     }
            // });
        } else {
            //TODO
            // this.router.navigate(['iCABSAServiceCoverSearch.htm'], {
            //     queryParams: {
            //         parentMode: 'Search',
            //         CurrentContractTypeURLParameter: this.formData.currentContractType
            //     }
            // });
        }
    }

    //Ellipsis - TODO
    public TaxCode_onkeydown(obj: any): void {
        if (obj.keyCode === 34) {
            //this.showAlert('iCABSSTaxCodeSearch.htm - Not covered in current sprint');
            this.taxcodeLP.openModal();
        }
    }
    public taxcodeSelection(obj: any): void {
        this.setControlValue('TaxCode', obj.TaxCode);
        this.setControlValue('TaxCodeDesc', obj.TaxCodeDesc);
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'TaxCode');
    }

    //Ellipsis
    public ServiceSalesEmployee_onkeydown(obj: any): void {
        if (obj.keyCode === 34) {
            this.ellipsis.commissionEmp.parentMode = 'Lookup-ServiceCoverCommissionEmployee';
            this.ellipsis.commissionEmp.ContractTypeCode = this.ContractObject.type;
            this.commissionEmp.openModal();
        }
    }
    public commissionEmpSelection(obj: any): void {
        this.setControlValue('ServiceSalesEmployee', obj.ServiceSalesEmployee);
        this.setControlValue('EmployeeSurname', obj.EmployeeSurname);
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'ServiceSalesEmployee');
    }

    //Ellipsis
    public InstallationEmployeeCode_onkeydown(obj: any): void {
        if (obj.keyCode === 34) {
            this.ellipsis.installationEmp.parentMode = 'LookUp-InstallationEmployee';
            this.ellipsis.installationEmp.ContractTypeCode = this.ContractObject.type;
            this.installationEmp.openModal();
        }
    }
    public installationEmpSelection(obj: any): void {
        this.setControlValue('InstallationEmployeeCode', obj.ServiceSalesEmployee);
        this.setControlValue('InstallationEmployeeName', obj.EmployeeSurname);
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'InstallationEmployeeCode');
    }

    //Ellipsis
    public DeliveryEmployeeCode_onkeydown(obj: any): void {
        if (obj.keyCode === 34) {
            this.ellipsis.deliveryEmp.parentMode = 'LookUp-DeliveryEmployee';
            this.ellipsis.deliveryEmp.ContractTypeCode = this.ContractObject.type;
            this.deliveryEmp.openModal();
        }
    }
    public deliveryEmpSelection(obj: any): void {
        this.setControlValue('DeliveryEmployeeCode', obj.ServiceSalesEmployee);
        this.setControlValue('DeliveryEmployeeName', obj.EmployeeSurname);
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'DeliveryEmployeeCode');
    }

    //Ellipsis
    public BranchServiceAreaCode_onkeydown(obj: any): void {
        if (obj.keyCode === 34) {
            this.ellipsis.svcArea.parentMode = 'LookUp-SC';
            this.ellipsis.svcArea.currentContractType = this.ContractObject.type;
            this.ellipsis.svcArea.ServiceBranchNumber = this.getControlValue('ServiceBranchNumber');
            this.ellipsis.svcArea.BranchName = this.getControlValue('BranchName');
            this.svcArea.openModal();
        }
    }
    public svcAreaSelection(obj: any): void {
        this.setControlValue('BranchServiceAreaCode', obj.BranchServiceAreaCode);
        this.setControlValue('BranchServiceAreaDesc', obj.BranchServiceAreaDesc);
        this.setControlValue('ServiceEmployeeCode', obj.EmployeeCode);
        this.setControlValue('ServiceEmployeeDesc', obj.EmployeeSurname);
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'BranchServiceAreaCode');
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'ServiceEmployeeCode');
    }

    public businessOriginSelection(obj: any): void {
        if (obj && ['BusinessOriginLang.BusinessOriginCode']) {
            this.setControlValue('BusinessOriginCode', obj['BusinessOriginLang.BusinessOriginCode']);
            this.setControlValue('BusinessOriginDesc', obj['BusinessOriginLang.BusinessOriginDesc']);
            this.dropdown.businessOriginLang.triggerValidate = false;
            this.doLookupUiParams();
        }
        // this.riExchange_CBORequest(); // GetBusinessOrigin() -> Fetch DetailRequiredInd - this is handled in doLookupUiParams()
    }
    public serviceTypeSelection(obj: any): void {
        if (obj) {
            this.setControlValue('ServiceTypeCode', obj.ServiceTypeCode);
            this.dropdown.serviceTypeSearch.triggerValidate = false;
        }
    }

}
