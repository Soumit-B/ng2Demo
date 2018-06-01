import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { BaseComponent } from '../../../../app/base/BaseComponent';
import { InternalSearchModuleRoutes, CCMModuleRoutes } from './../../../base/PageRoutes';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ErrorConstant } from './../../../../shared/constants/error.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { DropdownStaticComponent } from './../../../../shared/components/dropdown-static/dropdownstatic';
import { ProductMaintenanceUiControls } from './iCABSBProductMaintenanceUiControls';

@Component({
    templateUrl: 'iCABSBProductMaintenance.html'
})

export class ProductMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('riGridSType') riGridSType: GridAdvancedComponent;
    @ViewChild('riGridSTypePagination') riGridSTypePagination: PaginationComponent;
    @ViewChild('productCategoryCodeDropdown') productCategoryCodeDropdown: DropdownStaticComponent;
    @ViewChild('productBusinessLineCodeDropdown') productBusinessLineCodeDropdown: DropdownStaticComponent;
    @ViewChild('productHierarchyServiceGroupCodeDropdown') productHierarchyServiceGroupCodeDropdown: DropdownStaticComponent;
    @ViewChild('productSubGroupCodeDropdown') productSubGroupCodeDropdown: DropdownStaticComponent;
    @ViewChild('productProductUsageCodeDropdown') productProductUsageCodeDropdown: DropdownStaticComponent;

    private productRowID: string;
    private vBREnableDOWSentricon: any;
    private lRefreshServiceType: boolean;
    private saveParams: Array<any>;
    private syscharQuery: URLSearchParams;
    private sysCharParams: Object = {
        vSCEnableInstallsRemovals: '', // 190
        vSCEnableWasteTransfer: '', // 180
        vSCEnableServiceCoverDetail: '', // 240
        vSCEnableEntitlement: '', // 370
        vSCEnableTransData: '', // 1610
        vSCEnableProductSOSExempt: '', // 1970
        vSCEnableTaxCodeDefaultingText: '', // 2220
        vSCMultipleTaxRates: '', // 3680
        vSCEnableServiceCoverDispLevel: '', // 3360
        vSCEnableProductServiceType: '', // 3980
        vSCEnableAPTByServiceType: '' // 4060
    };

    public gridParams: any = {
        totalRecords: 0,
        pageCurrent: 1,
        itemsPerPage: 10,
        riGridMode: 0
    };
    public pageId: string = '';
    public queryPost: URLSearchParams = this.getURLSearchParamObject();
    public isAutoOpen: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public muleConfig: any = {
        method: 'contract-management/admin',
        module: 'contract-admin',
        operation: 'Business/iCABSBProductMaintenance'
    };
    public controls: Array<any>;
    public searchConfigs: any;
    public tabActive: any = 1;
    public isProductHierarchyDropdownsDisabled: boolean;
    public isselectCompositePricingTypeDisabled: boolean;
    public optionsMenu: Array<any> = [];
    public productCategoryCodesList: Array<Object> = [{
        value: '',
        text: 'None'
    }];
    public productBusinessLineCodesList: Array<Object> = [{
        value: '',
        text: 'None'
    }];
    public productHierarchyServiceGroupCodesList: Array<Object> = [{
        value: '',
        text: 'None'
    }];
    public productSubGroupCodesList: Array<Object> = [{
        value: '',
        text: 'None'
    }];
    public productProductUsageCodesList: Array<Object> = [{
        value: '',
        text: 'None'
    }];

    public displayFields: any = {
        trInstallationRequired: false,
        trInstallationValue: false,
        trRemovalValue: false,
        trCapacityFactor: false,
        trWasteTransfer: false,
        trWasteTransferCharge: true,
        trDetailRequired: false,
        tdValidForEntitlementInd: false,
        trProductSOSExempt: false,
        trAllowMultipleTaxRates: false,
        trEnableTaxCodeDefaulting: false,
        tdGuaranteeCode: false,
        tdGuaranteeDurationMonths: false,
        trServiceTypeCode: false,
        tdCompositePricingType: false,
        tdDOWSentriconInd: false,
        multipleTaxRates: false,
        serviceTypeTab: false,
        othersTabRed: false
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBPRODUCTMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Product Maintenance';
        this.saveParams = new ProductMaintenanceUiControls().saveParams;
        this.controls = new ProductMaintenanceUiControls().controls;
        this.searchConfigs = new ProductMaintenanceUiControls().searchConfigs;
    };

    ngOnInit(): void {
        super.ngOnInit();
        if (!this.isReturning())
            this.fetchSysChar();
    };

    ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.isAutoOpen = false;
            this.populateUIFromFormData();
            this.fetchSysChar();
            this.fetchProductRelatedData();
        } else
            this.isAutoOpen = true;
    };

    ngOnDestroy(): void {
        super.ngOnDestroy();
    };

    /**
     * Method - prepareQueryDefaults
     * Prepares common query defaults
     * Takes action as argument
     * If action not passed it will be defaulted to 0
     */
    private prepareQueryDefaults(action?: string): URLSearchParams {
        let query: URLSearchParams = this.getURLSearchParamObject();

        if (!action) {
            action = '0';
        }

        query.set(this.serviceConstants.BusinessCode,
            this.utils.getBusinessCode());
        query.set(this.serviceConstants.CountryCode,
            this.utils.getCountryCode());
        query.set(this.serviceConstants.Action, action);

        return query;
    };

    /**
     * Method - createSysCharListForQuery
     * Creates A Comma Seperated List Of SysChars
     * This List Needs To Be Passed With The SysChar Query
     */
    private sysCharListForQuery(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableWasteTransfer,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableServiceCoverDetail,
            this.sysCharConstants.SystemCharEnableEntitlement,
            this.sysCharConstants.SystemCharEnableTransData,
            this.sysCharConstants.SystemCharEnableProductSOSExempt,
            this.sysCharConstants.SystemCharDefaultTaxCodeOnServiceCoverMaint,
            this.sysCharConstants.SystemCharMultipleTaxRates,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharEnableProductServiceType,
            this.sysCharConstants.SystemCharEnableAPTByServiceType
        ];
        return sysCharList.join(',');
    }

    /**
     * Method - getSysChars
     * Method To Get SysChar Values From Service
     */
    private fetchSysChar(): any {
        this.syscharQuery = new URLSearchParams();

        // Add Parameters To Query
        this.syscharQuery = this.prepareQueryDefaults();
        this.syscharQuery.set(this.serviceConstants.SystemCharNumber, this.sysCharListForQuery());

        // Make HTTP Call
        Observable.forkJoin(this.httpService.sysCharRequest(this.syscharQuery)).subscribe(
            (data) => {
                // Call Method To Update SysChars
                this.updateSysChar(data[0]);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    /**
     * Method - updateFromSysChars
     * Update View And Store From The SysChar Values
     */
    private updateSysChar(sysChars: any): void {
        let records: Object;

        // If No Record Returned; Throw Error And Break From Method
        if (!sysChars || !sysChars.records.length)
            return;

        records = sysChars.records;

        this.sysCharParams['vSCEnableInstallsRemovals'] = records[0].Required;

        this.sysCharParams['vSCEnableWasteTransfer'] = records[1].Required;
        this.sysCharParams['vSCEnableWasteTransferLogical'] = records[1].Logical;

        this.sysCharParams['vSCEnableServiceCoverDetail'] = records[2].Required;

        this.sysCharParams['vSCEnableEntitlement'] = records[3].Required;
        this.sysCharParams['vSCEnableEntitlementLogical'] = records[3].Logical;
        this.sysCharParams['vSCEnableEntitlementValue'] = records[3].Integer;

        this.sysCharParams['vSCEnableTransData'] = records[4].Required;

        this.sysCharParams['vSCEnableProductSOSExempt'] = records[5].Required;

        this.sysCharParams['vSCEnableTaxCodeDefaulting'] = false;
        this.sysCharParams['vSCEnableTaxCodeDefaultingText'] = records[6].Required;
        this.sysCharParams['vSCEnableTaxCodeDefaultingTextLogical'] = records[6].Logical;
        this.sysCharParams['vSCEnableTaxCodeDefaultingTextValue'] = records[6].Text;

        if (this.sysCharParams['vSCEnableTaxCodeDefaultingText'] && this.sysCharParams['vSCEnableTaxCodeDefaultingTextValue'].indexOf('5') > -1)
            this.sysCharParams['vSCEnableTaxCodeDefaulting'] = true;

        this.sysCharParams['vSCMultipleTaxRates'] = records[7].Required;
        this.sysCharParams['vSCMultipleTaxRatesLogical'] = records[7].Logical;

        this.sysCharParams['vSCEnableServiceCoverDispLevel'] = records[8].Required;
        this.sysCharParams['vSCEnableServiceCoverDispLevelLogical'] = records[8].Logical;
        this.sysCharParams['vSCEnableServiceCoverDispLevelValue'] = records[8].Integer;

        this.sysCharParams['vSCEnableProductServiceType'] = records[9].Required;

        this.sysCharParams['vSCEnableAPTByServiceType'] = records[10].Required;
        console.log('sysCharParams', this.sysCharParams);
        console.log('vSCEnableProductServiceType', this.sysCharParams['vSCEnableProductServiceType']);
        this.windowOnLoad();
    }

    private windowOnLoad(): void {
        this.lRefreshServiceType = true;
        this.isProductHierarchyDropdownsDisabled = true;
        this.setVariables();
        this.buildMenu();
        this.dowSentricon();
        this.findPropertyCareBranch();
        this.isselectCompositePricingTypeDisabled = true;

        switch (this.parentMode) {
            case 'CancelledVisit':
                this.setAttribute('Product', 'ProductRowID');
                break;
        };
    }

    private setVariables(): void {
        if (this.sysCharParams['vSCEnableInstallsRemovals']) {
            this.setControlValue('InstallationRequired', false);
            this.setControlValue('EngineerRequiredInd', false);
            this.displayFields.trInstallationRequired = true;
            this.displayFields.trInstallationValue = true;
            this.displayFields.trRemovalValue = true;
        }
        if (this.sysCharParams['vSCEnableTransData']) { // Descoped
            this.displayFields.trServiceType = true;
            this.displayFields.trCapacityFactor = true;
        }
        if (this.sysCharParams['vSCEnableWasteTransfer']) {
            this.setControlValue('WasteTransferRequired', false);
            this.displayFields.trWasteTransfer = true;
        } else {
            this.displayFields.trWasteTransferCharge = false;
            if (this.getControlValue('WasteTransferChargeValue') === '')
                this.setControlValue('WasteTransferChargeValue', 0.00);
        }
        if (this.sysCharParams['vSCEnableServiceCoverDetail']) {
            this.setControlValue('DetailRequired', false);
            this.displayFields.trDetailRequired = true;
        }
        if (this.sysCharParams['vSCEnableEntitlement']) {
            this.setControlValue('ValidForEntitlementInd', false);
            this.displayFields.tdValidForEntitlementInd = true;
        }
        if (this.sysCharParams['vSCEnableProductSOSExempt'])
            this.displayFields.trProductSOSExempt = true;
        if (this.sysCharParams['vSCMultipleTaxRates']) {
            this.displayFields.trAllowMultipleTaxRates = true;
        }
        console.log('Before -> ', this.sysCharParams);
        if (this.sysCharParams['vSCEnableAPTByServiceType']) {
            this.sysCharParams['vSCEnableProductServiceType'] = false;
            this.displayFields.serviceTypeTab = true;
        }
        if (this.sysCharParams['vSCEnableProductServiceType']) {
            this.sysCharParams['vSCEnableAPTByServiceType'] = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceTypeCode', true);
            this.displayFields.trServiceTypeCode = true;
        }
        console.log('After -> ', this.sysCharParams);
        if (this.sysCharParams['vSCEnableTaxCodeDefaulting'])
            this.displayFields.trEnableTaxCodeDefaulting = true;
        this.buildMenu();
    }

    // DOW Sentricon
    private dowSentricon(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.businessCode());
        search.set('RegSection', 'DOW Sentricon');
        search.set('RegKey', 'Enable DOW Sentricon');
        search.set('EffectiveDate', this.globalize.parseDateToFixedFormat(new Date()).toString());
        search.set('search.op.EffectiveDate', 'LE');
        search.set('Mode', 'DOWSentricon');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module,
            this.muleConfig.operation, search)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                else {
                    this.vBREnableDOWSentricon = data.records[0].RegValue === 'YES' ? true : false;
                    if (this.vBREnableDOWSentricon) this.displayFields.tdDOWSentriconInd = true;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.gridParams.totalRecords = 1;
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    private findPropertyCareBranch(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            BranchNumber: this.utils.getBranchCode()
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data.PropertyCareInd === 'Y') {
                        this.displayFields.tdGuaranteeCode = true;
                        this.displayFields.tdGuaranteeDurationMonths = true;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    // Unchecking all checkboxes on intial add mode
    private uncheckingAllCheckboxes(): void {
        const multipleUnChecks: Array<any> = ['ValidForNewInd', 'ValueRequiredInd', 'PassToPDAInd', 'QuantityRequired', 'DispenserInd', 'ConsumableInd', 'ThirdPartyServiceInd', 'FrequencyRequiredInd', 'InstallationRequired', 'EngineerRequiredInd', 'WasteTransferRequired', 'DetailRequired', 'ReplacementMonthRequiredInd', 'ValidForEntitlementInd', 'InvoiceSuspendInd', 'MaintenanceInd', 'EmailOrderInd', 'GuaranteeRequiredInd', 'SOSExemptInd', 'HideQuantityOnInvoice', 'RequireAnnualTimeInd', 'CustomerSpecificInd', 'CompositeProductInd', 'RetainServiceCoverInd', 'RequiresManualVisitPlanningInd', 'RequiresVisitDetailTextInd', 'InnovationMetricInd', 'WeighingRequiredInd', 'ReplacementDefaultInd', 'ReplacementInd', 'DummyProductInd', 'RoutineLabels', 'DisplayLevelInd', 'MultipleTaxRates', 'ConsolidateEqualTaxRates', 'RotationalProductInd', 'RotationByScheduleInd', 'TermiteRenewalLetterInd', 'PerimeterValueRequired', 'UsePercentageValuesInd', 'CombineInvoiceValueInd', 'TelesalesInd', 'TelesalesAllowDiscountInd', 'LocationsEnabled', 'PrepsEnabled', 'RecordInfestations', 'ZeroQuantityEnabled', 'ProductLinkingEnabled', 'termiteinspectionInd', 'NoScanRequiredInd', 'InvoiceUnitValueRequired', 'CapableOfUplift'];
        this.setMultipleControlsValues(multipleUnChecks, false);
    }

    private lookupApi(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupDetails: Array<any> = [{
            'table': 'ProductSaleGroup',
            'query': {
                'BusinessCode': this.businessCode(),
                'ProductSaleGroupCode': this.getControlValue('ProductSaleGroupCode')
            },
            'fields': ['ProductSaleGroupDesc']
        }, {
            'table': 'ProductServiceGroup',
            'query': {
                'BusinessCode': this.businessCode(),
                'ProductServiceGroupCode': this.getControlValue('ProductServiceGroupCode')
            },
            'fields': ['ProductServiceGroupDesc']
        }, {
            'table': 'LineOfService',
            'query': {
                'LOSCode': this.getControlValue('LOSCode')
            },
            'fields': ['LOSName']
        }, {
            'table': 'BudgetBillingInstalment',
            'query': {
                'BusinessCode': this.businessCode(),
                'BudgetBillingInstalmentCode': this.getControlValue('BudgetBillingInstalmentCode')
            },
            'fields': ['BudgetBillingInstalmentDesc']
        }, {
            'table': 'RangeHeader',
            'query': {
                'BusinessCode': this.businessCode(),
                'ProductRange': this.getControlValue('ProductRange')
            },
            'fields': ['Description']
        }, {
            'table': 'TaxCode',
            'query': {
                'TaxCode': this.getControlValue('TaxCode')
            },
            'fields': ['TaxCodeDesc']
        }, {
            'table': 'TaxCode',
            'query': {
                'TaxCode': this.getControlValue('TaxCodeMaterials')
            },
            'fields': ['TaxCodeDesc']
        }, {
            'table': 'TaxCode',
            'query': {
                'TaxCode': this.getControlValue('TaxCodeLabour')
            },
            'fields': ['TaxCodeDesc']
        }, {
            'table': 'TaxCode',
            'query': {
                'TaxCode': this.getControlValue('TaxCodeReplacement')
            },
            'fields': ['TaxCodeDesc']
        }, {
            'table': 'APICode',
            'query': {
                'BusinessCode': this.businessCode(),
                'APICode': this.getControlValue('APICode')
            },
            'fields': ['APICodeDesc']
        }, {
            'table': 'ServiceType',
            'query': {
                'BusinessCode': this.businessCode(),
                'ServiceTypeCode': this.getControlValue('ServiceTypeCode')
            },
            'fields': ['ServiceTypeDesc']
        }];

        this.LookUp.lookUpRecord(lookupDetails).subscribe((data) => {
            if (data.length > 0) {
                let productSaleGroupData: Array<any> = data[0];
                let productServiceGroupData: Array<any> = data[1];
                let losData: Array<any> = data[2];
                let budgetBillingInstalmentData: Array<any> = data[3];
                let rangeHeaderData: Array<any> = data[4];
                let taxCodeData: Array<any> = data[5];
                let taxCodeMaterialsData: Array<any> = data[6];
                let taxCodeLabourData: Array<any> = data[7];
                let taxCodeReplacementData: Array<any> = data[8];
                let apiCodeData: Array<any> = data[9];
                let serviceTypeCodeData: Array<any> = data[10];

                if (productSaleGroupData.length > 0) {
                    this.setControlValue('ProductSaleGroupDesc', productSaleGroupData[0].ProductSaleGroupDesc);
                }
                if (productServiceGroupData.length > 0) {
                    this.setControlValue('ProductServiceGroupDesc', productServiceGroupData[0].ProductServiceGroupDesc);
                    this.searchConfigs.productServiceGroupSearch.active = {
                        id: this.getControlValue('ProductServiceGroupCode'),
                        text: this.getControlValue('ProductServiceGroupCode') + ' - ' + this.getControlValue('ProductServiceGroupDesc')
                    };
                }
                if (losData.length > 0) {
                    this.setControlValue('LOSName', losData[0].LOSName);
                    this.searchConfigs.losSearch.active = {
                        id: this.getControlValue('LOSCode'),
                        text: this.getControlValue('LOSCode') + ' - ' + this.getControlValue('LOSName')
                    };
                }
                if (budgetBillingInstalmentData.length > 0) {
                    this.setControlValue('BudgetBillingInstalmentDesc', budgetBillingInstalmentData[0].BudgetBillingInstalmentDesc);
                }
                if (rangeHeaderData.length > 0) {
                    this.setControlValue('RangeDesc', rangeHeaderData[0].Description);
                }
                if (taxCodeData.length > 0) {
                    this.setControlValue('TaxCodeDesc', taxCodeData[0].TaxCodeDesc);
                }
                if (taxCodeMaterialsData.length > 0) {
                    this.setControlValue('TaxCodeMaterialsDesc', taxCodeMaterialsData[0].TaxCodeDesc);
                }
                if (taxCodeLabourData.length > 0) {
                    this.setControlValue('TaxCodeLabourDesc', taxCodeLabourData[0].TaxCodeDesc);
                }
                if (taxCodeReplacementData.length > 0) {
                    this.setControlValue('TaxCodeReplacementDesc', taxCodeReplacementData[0].TaxCodeDesc);
                }
                if (apiCodeData.length > 0) {
                    this.setControlValue('APICodeDesc', apiCodeData[0].APICodeDesc);
                    this.searchConfigs.apiCodeSearch.active = {
                        id: this.getControlValue('APICode'),
                        text: this.getControlValue('APICode') + ' - ' + this.getControlValue('APICodeDesc')
                    };
                }
                if (serviceTypeCodeData.length > 0) {
                    this.setControlValue('ServiceTypeDesc', serviceTypeCodeData[0].ServiceTypeDesc);
                    this.searchConfigs.serviceTypeSearch.active = {
                        id: this.getControlValue('ServiceTypeCode'),
                        text: this.getControlValue('ServiceTypeCode') + ' - ' + this.getControlValue('ServiceTypeDesc')
                    };
                }
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    };

    /**
     * Sets Required status of controls in the form base on the controls in controlListOfRequiredStatus Array
     * @method setControlRequiredStatus
     * @param controlListOfRequiredStatus - Array of controls to be set required
     * @return void
     */
    private setControlRequiredStatus(controlListOfRequiredStatus: Array<string>): void {
        for (let control in controlListOfRequiredStatus)
            if (controlListOfRequiredStatus.hasOwnProperty(control))
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, controlListOfRequiredStatus[control], true);
    };

    /**
     * Resets controls in the form based on the controls in controlsList Array
     * @method resetControls
     * @param resetControlsList - Array of controls to be reset
     * @return void
     */
    private resetControls(resetControlsList: Array<string>): void {
        for (let control in resetControlsList) {
            if (resetControlsList.hasOwnProperty(control)) {
                this.setControlValue(resetControlsList[control], '');
                this.uiForm.controls[resetControlsList[control]].markAsUntouched();
            }
        }
    }

    /**
     * Options Menu
     */
    private buildMenu(): void {
        this.optionsMenu = [{
            'value': '',
            'text': 'Options'
        }];
        if (this.sysCharParams['vSCEnableServiceCoverDetail'])
            this.optionsMenu.push({
                'value': 'ProductDetail',
                'text': 'Product Detail'
            });

        if (this.getControlValue('CompositeProductInd'))
            this.optionsMenu.push({
                'value': 'ProductComponent',
                'text': 'Product Component'
            });

        this.optionsMenu.push(
            {
                'value': 'ProductCustomerType',
                'text': 'Product/Customer Type'
            }, {
                'value': 'RegulatoryAuthority',
                'text': 'Regulatory Authority'
            }, {
                'value': 'AlternateProductCodes',
                'text': 'Alternate Product Codes'
            }, {
                'value': 'ProductBenefits',
                'text': 'Product Benefits'
            }, {
                'value': 'InstallationRequirements',
                'text': 'Installation Requirements'
            }, {
                'value': 'RecommendedProducts',
                'text': 'Recommended Products'
            });

        if (this.sysCharParams['vSCEnableServiceCoverDispLevel'])
            this.optionsMenu.push({
                'value': 'ProductBranchLevelValue',
                'text': 'Branch Level Values'
            });

        if (this.getControlValue('TelesalesInd'))
            this.optionsMenu.push({
                'value': 'TelesalesEnquiry',
                'text': 'Telesales Details'
            });
        if (this.getControlValue('TermiteRenewalLetterInd'))
            this.optionsMenu.push({
                'value': 'WarrantyLetter',
                'text': 'Warranty Renewal Letter'
            });
    }

    /**
     * Custom validator for ServiceType [P/S except]
     * @param ServiceType form field
     * @return validate object
     */
    private serviceTypeValidate(field: any): any {
        if (field.value !== 'S' && field.value !== 'P') return { 'invalidValue': true };
        return null;
    }

    // Setting Input Element properties based on Various checkboxes
    private setInputElementProperties(): void {
        const enableDisableControlList: Array<any> = ['InstallationValue', 'InstallTime', 'RemovalValue', 'RemovalTime'];
        if (this.getControlValue('InstallationRequired')) {
            this.enableDisableSelectedControls(enableDisableControlList, true);
        } else {
            this.enableDisableSelectedControls(enableDisableControlList, false);
            this.setMultipleControlsValues(enableDisableControlList, '0');
            // Verify if this is required
            /* this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InstallationValue', false);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'RemovalValue', false);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InstallTime', false);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'RemovalTime', false); */
        }
    }

    /**
     * Set save value to multiple controls
     * @method setMultipleControlsValues
     * @param controlList - Array of controls to be set
     * @param value - Value to be set in the controls
     * @return void
     */
    private setMultipleControlsValues(controlList: Array<string>, value: any): void {
        for (let control in controlList)
            if (controlList.hasOwnProperty(control))
                this.setControlValue(controlList[control], value);
    };

    /**
     * Enables/Disables controls in the form base on the controls in controlList Array
     * @method enableDisableSelectedControls
     * @param controlList - Array of controls to be enabled/disabled
     * @param enable - Boolean, True: Enable and False: Disable
     * @return void
     */
    private enableDisableSelectedControls(controlList: Array<string>, enable: boolean): void {
        for (let control in controlList)
            if (controlList.hasOwnProperty(control))
                this.disableControl(controlList[control], enable);
    };

    // Marking Controls as Touched
    private uiFormMarkAsTouched(): void {
        for (let controlName of this.saveParams) {
            if (controlName !== 'BusinessCode')
                this.uiForm.controls[controlName].markAsTouched();
        }
    }

    private getUpliftServiceCovers(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCode: this.getControlValue('ProductCode'),
            Function: 'GetUpliftServiceCovers'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    // TODO: UTC
                    let vNumServiceCovers: any = data.NumberOfUpliftSC;
                    if (vNumServiceCovers !== 0) {
                        let msgText: Array<string> = [
                            'Un-setting the Capable Of Uplift Flag will invalidate the uplift descriptions on ' + vNumServiceCovers + ' Service Covers.',
                            'These uplift descriptions will be removed. Do you wish to Continue?'
                        ];
                        let modalVO: ICabsModalVO = new ICabsModalVO(msgText, null, this.promptModalForSave.bind(this));
                        modalVO.title = 'Warning';
                        this.modalAdvService.emitPrompt(modalVO);
                    }
                    else
                        this.promptModalForSave();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private setProductHierarchy(): void {
        this.getCategoryCodes();
    }

    /**
     * Dropdown options
     * Tab: Product Hierarchy
     * Field: Category
     */
    private getCategoryCodes(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            Function: 'GetProductCategoryValues'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    let productCategoryCodes: Array<any> = data.ProductCategoryCodeList !== '' ? data.ProductCategoryCodeList.split('|') : [],
                        productCategoryDescs: Array<any> = data.ProductCategoryDescList !== '' ? data.ProductCategoryDescList.split('|') : [];
                    for (let i = 0; i < productCategoryCodes.length; i++) {
                        this.productCategoryCodeDropdown.inputData.push({
                            value: productCategoryCodes[i],
                            text: productCategoryCodes[i] + ' - ' + productCategoryDescs[i]
                        });
                    }
                    if (this.getControlValue('ProductHierarchyID')) {
                        this.productCategoryCodeDropdown.selectedItem = this.getControlValue('ProductCategoryCode');
                        this.onProductCategoryCodeSelect(this.getControlValue('ProductCategoryCode'));
                    }
                    // TODO: State retention of Category Dropdown
                    /* if (this.isReturning()) {
                        this.productCategoryCodeDropdown.selectedItem = this.getControlValue('ProductCategoryCode');
                        this.onProductCategoryCodeSelect(this.getControlValue('ProductCategoryCode'));
                    } else {
                        this.productCategoryCodeDropdown.selectedItem = 'NONE';
                        this.onProductCategoryCodeSelect('NONE');
                    } */
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    /**
     * Dropdown options
     * Tab: Product Hierarchy
     * Field: Line of Business
     */
    private getLineOfBusinessCodes(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCategoryCode: this.getControlValue('ProductCategoryCode'),
            Function: 'GetProductBusinessLineValues'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    let productBusinessLineCodes: Array<any> = data.ProductBusinessLineCodeList !== '' ? data.ProductBusinessLineCodeList.split('|') : [],
                        productBusinessLineDescs: Array<any> = data.ProductBusinessLineDescList !== '' ? data.ProductBusinessLineDescList.split('|') : [];
                    for (let i = 0; i < productBusinessLineCodes.length; i++) {
                        this.productBusinessLineCodesList.push({
                            value: productBusinessLineCodes[i],
                            text: productBusinessLineCodes[i] + ' - ' + productBusinessLineDescs[i]
                        });
                    }
                    if (this.getControlValue('ProductHierarchyID')) {
                        this.productBusinessLineCodeDropdown.selectedItem = this.getControlValue('ProductBusinessLineCode');
                        this.onProductBusinessLineCodeSelect(this.getControlValue('ProductBusinessLineCode'));
                    }
                    // TODO: State retention of Line of Business Dropdown
                    /* if (this.isReturning()) {
                        this.productBusinessLineCodeDropdown.selectedItem = this.getControlValue('ProductBusinessLineCode');
                        this.onProductBusinessLineCodeSelect(this.getControlValue('ProductBusinessLineCode'));
                    } else {
                        this.productBusinessLineCodeDropdown.selectedItem = 'NONE';
                        this.onProductBusinessLineCodeSelect('NONE');
                    } */
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    /**
     * Dropdown options
     * Tab: Product Hierarchy
     * Field: Service Group
     */
    private getServiceGroupCodes(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCategoryCode: this.getControlValue('ProductCategoryCode'),
            ProductBusinessLineCode: this.getControlValue('ProductBusinessLineCode'),
            Function: 'GetProductHierarchyServiceGroupValues'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    let productHierarchyServiceGroupCodes: Array<any> = data.ProductHierarchyServGrpCodeList !== '' ? data.ProductHierarchyServGrpCodeList.split('|') : [],
                        productHierarchyServiceGroupDescs: Array<any> = data.ProductHierarchyServGrpDescList !== '' ? data.ProductHierarchyServGrpDescList.split('|') : [];
                    for (let i = 0; i < productHierarchyServiceGroupCodes.length; i++) {
                        this.productHierarchyServiceGroupCodesList.push({
                            value: productHierarchyServiceGroupCodes[i],
                            text: productHierarchyServiceGroupCodes[i] + ' - ' + productHierarchyServiceGroupDescs[i]
                        });
                    }
                    if (this.getControlValue('ProductHierarchyID')) {
                        this.productHierarchyServiceGroupCodeDropdown.selectedItem = this.getControlValue('ProductHierarchyServiceGroupCode');
                        this.onProductHierarchyServiceGroupCodeSelect(this.getControlValue('ProductHierarchyServiceGroupCode'));
                    }
                    // TODO: State retention of Service Group Dropdown
                    /* if (this.isReturning()) {
                        this.productHierarchyServiceGroupCodeDropdown.selectedItem = this.getControlValue('ProductHierarchyServiceGroupCode');
                        this.onProductHierarchyServiceGroupCodeSelect(this.getControlValue('ProductHierarchyServiceGroupCode'));
                    } else {
                        this.productHierarchyServiceGroupCodeDropdown.selectedItem = 'NONE';
                        this.onProductHierarchyServiceGroupCodeSelect('NONE');
                    } */
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    /**
     * Dropdown options
     * Tab: Product Hierarchy
     * Field: Sub-Group
     */
    private getSubGroupCodes(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCategoryCode: this.getControlValue('ProductCategoryCode'),
            ProductBusinessLineCode: this.getControlValue('ProductBusinessLineCode'),
            ProductHierarchyServiceGroupCode: this.getControlValue('ProductHierarchyServiceGroupCode'),
            Function: 'GetProductSubGroupValues'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    let productSubGroupCodes: Array<any> = data.ProductSubGroupCodeList !== '' ? data.ProductSubGroupCodeList.split('|') : [],
                        productSubGroupCodeDescs: Array<any> = data.ProductSubGroupDescList !== '' ? data.ProductSubGroupDescList.split('|') : [];
                    for (let i = 0; i < productSubGroupCodes.length; i++) {
                        this.productSubGroupCodesList.push({
                            value: productSubGroupCodes[i],
                            text: productSubGroupCodes[i] + ' - ' + productSubGroupCodeDescs[i]
                        });
                    }
                    if (this.getControlValue('ProductHierarchyID')) {
                        this.productSubGroupCodeDropdown.selectedItem = this.getControlValue('ProductSubGroupCode');
                        this.onProductSubGroupCodeSelect(this.getControlValue('ProductSubGroupCode'));
                    }
                    // TODO: State retention of Sub-Group Dropdown
                    /* if (this.isReturning()) {
                        this.productSubGroupCodeDropdown.selectedItem = this.getControlValue('ProductSubGroupCode');
                        this.onProductSubGroupCodeSelect(this.getControlValue('ProductSubGroupCode'));
                    } else {
                        this.productSubGroupCodeDropdown.selectedItem = 'NONE';
                        this.onProductSubGroupCodeSelect('NONE');
                    } */
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    /**
     * Dropdown options
     * Tab: Product Hierarchy
     * Field: Product Usage
     */
    private getProductUsageCodes(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCategoryCode: this.getControlValue('ProductCategoryCode'),
            Function: 'GetProductProductUsageValues'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    let productProductUsageCodes: Array<any> = data.ProductProductUsageCodeList !== '' ? data.ProductProductUsageCodeList.split('|') : [],
                        productProductUsageDescs: Array<any> = data.ProductProductUsageDescList !== '' ? data.ProductProductUsageDescList.split('|') : [];
                    for (let i = 0; i < productProductUsageCodes.length; i++) {
                        this.productProductUsageCodesList.push({
                            value: productProductUsageCodes[i],
                            text: productProductUsageCodes[i] + ' - ' + productProductUsageDescs[i]
                        });
                    }
                    if (this.getControlValue('ProductHierarchyID')) {
                        this.productProductUsageCodeDropdown.selectedItem = this.getControlValue('ProductProductUsageCode');
                        this.onProductUsageCodeSelect(this.getControlValue('ProductProductUsageCode'));
                    }
                    // TODO: State retention of Product Usage Dropdown
                    /* if (this.isReturning()) {
                        this.productProductUsageCodeDropdown.selectedItem = this.getControlValue('ProductProductUsageCode');
                        this.onProductUsageCodeSelect(this.getControlValue('ProductProductUsageCode'));
                    } else {
                        this.productProductUsageCodeDropdown.selectedItem = 'NONE';
                        this.onProductUsageCodeSelect('NONE');
                    } */
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    // Service Types Grid
    private buildGrid(): void {
        this.riGridSType.PageSize = this.gridParams.itemsPerPage;
        this.riGridSType.FunctionPaging = true;
        this.riGridSType.HighlightBar = true;
        this.riGridSType.Clear();
        this.riGridSType.AddColumn('GRServiceCode', 'GRSType', 'GRServiceCode', MntConst.eTypeCode, 10, false);
        this.riGridSType.AddColumnAlign('GRServiceCode', MntConst.eAlignmentCenter);
        this.riGridSType.AddColumn('GRServiceDesc', 'GRSType', 'GRServiceDesc', MntConst.eTypeText, 40, false);
        this.riGridSType.AddColumn('GRValid', 'GRSType', 'GRValid', MntConst.eTypeImage, 1, false);

        this.riGridSType.Complete();
        this.loadGridData();
    }

    private loadGridData(rowId?: string): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        if (rowId) {
            search.set('ROWID', rowId);
            this.riGridSType.Update = true;
        }
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.businessCode());
        search.set(this.serviceConstants.CountryCode, this.countryCode());
        search.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        search.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage.toString());
        search.set(this.serviceConstants.PageCurrent, this.gridParams.pageCurrent.toString());
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGridSType.HeaderClickedColumn);
        search.set(this.serviceConstants.GridSortOrder, this.riGridSType.SortOrder);
        search.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.GridCacheRefresh, 'True');
        search.set(this.serviceConstants.ProductCode, this.getControlValue('ProductCode'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module,
            this.muleConfig.operation, search)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                else {
                    if (this.riGridSType.Update) {
                        this.riGridSType.StartRow = this.getAttribute('SelectedLine_Row');
                        this.riGridSType.StartColumn = 0;
                        this.riGridSType.RowID = this.getAttribute('SelectedLine_RowID');
                        this.riGridSType.UpdateHeader = false;
                        this.riGridSType.UpdateBody = true;
                        this.riGridSType.UpdateFooter = false;
                    } else {
                        this.gridParams.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.gridParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    }
                    this.riGridSType.Execute(data);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.gridParams.totalRecords = 1;
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    // Enable all Ellipsis buttons and dropdowns: Need to move above
    private enableSearches(enable: boolean): void {
        for (let searchItem in this.searchConfigs)
            if (this.searchConfigs.hasOwnProperty(searchItem))
                this.searchConfigs[searchItem].isDisabled = enable;
    }

    // CheckServiceCover: Maynot be used as Readonly Mode not implemented
    private checkServiceCover(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCode: this.getControlValue('ProductCode'),
            ReadOnlyMode: 'no',
            Function: 'CheckServiceCover'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('ProductInUse', data.ProductInUse);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // CheckProductServiceType
    private checkProductServiceType(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCode: this.getControlValue('ProductCode'),
            DTE: this.globalize.parseDateToFixedFormat(new Date()),
            TME: new Date().getTime(),
            Function: 'CheckProductServiceType'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('NoProductServiceType', data.NoProductServiceType === 'yes' ? true : false);
                    this.setControlValue('NoQuantityTime', data.NoQuantityTime === 'yes' ? true : false);

                    if (this.sysCharParams['vSCEnableAPTByServiceType']) {
                        if (this.getControlValue('NoProductServiceType'))
                            this.modalAdvService.emitError(new ICabsModalVO('At Least One Service Type Must Be Selected'));
                        else if (this.getControlValue('NoQuantityTime')) {
                            let msgText = 'There is no planned time and quantity for this product and selected service types.',
                                modalVO: ICabsModalVO = new ICabsModalVO(msgText, null, this.checkCapableOfUplift.bind(this), this.reverseProductServiceType.bind(this));
                            modalVO.title = 'Warning';
                            modalVO.confirmLabel = 'Ok';
                            modalVO.cancelLabel = 'Abandon';
                            this.modalAdvService.emitPrompt(modalVO);
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    // ReverseProductServiceType: In case Abandon in confirm popup is selected
    private reverseProductServiceType(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCode: this.getControlValue('ProductCode'),
            ProductServiceTypeList: this.getControlValue('ProductServiceType'),
            DTE: this.globalize.parseDateToFixedFormat(new Date()),
            TME: new Date().getTime(),
            Function: 'ReverseProductServiceType'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('ProductServiceType', data.ProductServiceType);
                    this.riGridSTypeOnRefresh();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    private checkCapableOfUplift(): void {
        if (this.getControlValue('SavedCapableOfUplift') && !this.getControlValue('CapableOfUplift'))
            this.getUpliftServiceCovers();
        else
            setTimeout(() => {
                this.promptModalForSave();
            }, 0);
    }

    private promptModalForSave(): void {
        if (this.formMode === this.c_s_MODE_ADD)
            this.lookupApi();
        let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveProduct.bind(this));
        this.modalAdvService.emitPrompt(modalVO);
    }

    // Add/Update Product Save
    private saveProduct(): void {
        if (this.uiForm.valid) {
            let formdata: Object = {};
            for (let controlValue of this.saveParams) {
                if (controlValue === 'BusinessCode') {
                    formdata[controlValue] = this.businessCode();
                    continue;
                }
                if (controlValue === 'Product') {
                    if (this.formMode === this.c_s_MODE_UPDATE)
                        formdata['ProductROWID'] = this.getControlValue(controlValue);
                    continue;
                }
                if (this.getControlValue(controlValue) === true) {
                    formdata[controlValue] = 'yes';
                    continue;
                } else if (this.getControlValue(controlValue) === false) {
                    formdata[controlValue] = 'no';
                    continue;
                } else {
                    formdata[controlValue] = this.getControlValue(controlValue) || '';
                    continue;
                }
            }

            if (this.formMode === this.c_s_MODE_ADD)
                this.queryPost.set(this.serviceConstants.Action, '1');
            else
                this.queryPost.set(this.serviceConstants.Action, '2');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError)
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    else {
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                        this.isselectCompositePricingTypeDisabled = true;
                        this.buildMenu();
                        if (this.sysCharParams['vSCEnableAPTByServiceType'])
                            this.getProductServiceType();
                        this.setControlValue('SavedCapableOfUplift', this.getControlValue('CapableOfUplift'));
                        this.setFormMode(this.c_s_MODE_UPDATE);
                        this.formPristine();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    };

    // GetProductServiceType: Need to be Private
    private getProductServiceType(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCode: this.getControlValue('ProductCode'),
            DTE: this.globalize.parseDateToFixedFormat(new Date()),
            TME: new Date().getTime(),
            Function: 'CheckProductServiceType'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('ProductServiceType', data.ProductServiceType);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    // Deleting Product
    private deleteProduct(): void {
        this.queryPost.set(this.serviceConstants.Action, '3');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ProductCode: this.getControlValue('ProductCode')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                    this.pageParams = {};
                    this.uiForm.reset();
                    this.isProductHierarchyDropdownsDisabled = true;
                    this.multipleTaxRatesOnChecked();
                    this.buildMenu();
                    this.setFormMode(this.c_s_MODE_SELECT);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    public onProductCategoryCodeSelect(data?: any): void {
        this.setControlValue('ProductCategoryCode', data);
        this.getLineOfBusinessCodes();
        this.getProductUsageCodes();
    };

    public onProductBusinessLineCodeSelect(data?: any): void {
        this.setControlValue('ProductBusinessLineCode', data);
        this.getServiceGroupCodes();
    };

    public onProductHierarchyServiceGroupCodeSelect(data?: any): void {
        this.setControlValue('ProductHierarchyServiceGroupCode', data);
        this.getServiceGroupCodes();
    };

    public onProductSubGroupCodeSelect(data?: any): void {
        this.setControlValue('ProductSubGroupCode', data);
        this.getProductUsageCodes();
    };

    public onProductUsageCodeSelect(data?: any): void {
        this.setControlValue('ProductProductUsageCode', data);
    };

    // Options Dropdown selections
    public selectedOption(optionValue: string): void {
        // TODO
        let params = {
            ProductCode: this.getControlValue('ProductCode'),
            ProductDesc: this.getControlValue('ProductDesc')
        };
        switch (optionValue) {
            case 'ProductDetail':
                // TODO: Waiting for Debasish to implement navigation for the screen
                this.navigate('Product', InternalSearchModuleRoutes.ICABSBPRODUCTCOVERSEARCH, params);
                // this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'ProductCustomerType':
                // this.navigate('ProductCustomerType', 'Business/iCABSBProductCustomerTypeGrid.htm', params);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'RegulatoryAuthority':
                // this.navigate('RegulatoryAuthority', 'Business/iCABSBProductRegulatoryAuthorityGrid.htm', params);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'ProductComponent':
                // this.navigate('ProductComponent', 'Business/iCABSBProductComponentGrid.htm', params);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'AlternateProductCodes':
                // this.navigate('AlternateProductCodes', 'Business/iCABSBAlternateProductCodes.htm', params);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'ProductBranchLevelValue':
                // this.navigate('ProductBranchLevelValue', 'Business/iCABSBProductBranchLevelValues.htm', params);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'ProductBenefits':
                // this.navigate('Product', 'Business/iCABSBProductBenefitsGrid.htm', params);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'InstallationRequirements':
                // this.navigate('Product', 'Business/iCABSBProductInstallationReqtsGrid.htm', params);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'RecommendedProducts':
                // this.navigate('Product', 'Business/iCABSBRecommendedProductsGrid.htm', params);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'WarrantyLetter':
                // this.navigate('Product', 'Business/iCABSBProductWarrantyGrid.htm', params);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                break;
            case 'TelesalesEnquiry':
                this.navigate('ProductMaintenance', CCMModuleRoutes.ICABSATELESALESORDERGRID, params);
                break;
        }
    }

    // On Click of grid row
    public riGridSTypeBodyOnClick(data: any): void {
        if (this.riGridSType.CurrentHTMLRow.children[0].children[0].children[0])
            this.selectedRowFocus(this.riGridSType.CurrentHTMLRow.children[0].children[0].children[0]);
    }

    // Selecting a row in grid
    public selectedRowFocus(rsrcElement: any): void {
        rsrcElement.select();
        rsrcElement.focus();
        this.setAttribute('Row', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
        this.setAttribute('Cell', rsrcElement.parentElement.parentElement.cellIndex);
        this.setAttribute('RowID', rsrcElement.getAttribute('rowid'));
    }

    // On Double click of grid row
    public riGridBodyOnDblClick(data: any): void {
        if (this.formMode === this['c_s_MODE_ADD'] || this.formMode === this['c_s_MODE_UPDATE']) {
            if (this.riGridSType.CurrentColumnName === 'GRValid') {
                this.riGridSType.Update = true;
                this.setAttribute('SelectedLine_Row', this.riGridSType.CurrentRow);
                this.setAttribute('SelectedLine_RowID', this.riGridSType.Details.GetAttribute('GRServiceCode', 'rowid'));
                this.loadGridData(this.riGridSType.Details.GetAttribute('GRServiceCode', 'rowid'));
            }
        }
    }

    // On grid refresh
    public riGridSTypeOnRefresh(): void {
        this.gridParams.currentPage = 1;
        this.riGridSType.RefreshRequired();
        this.loadGridData();
    };

    // To get the current page in grid
    public getCurrentPage(currentPage: any): void {
        if (this.gridParams.pageCurrent !== currentPage.value) {
            this.gridParams.pageCurrent = currentPage.value;
            this.riGridSType.RefreshRequired();
            this.loadGridData();
        }
    }

    // Tab switching logic
    public setTabActive(index: any): void {
        this.tabActive = index;
        if (index === 5) {
            if (this.sysCharParams['vSCEnableAPTByServiceType'])
                this.buildGrid();
        }
    };

    // Callback for Product Search Ellipsis
    public setProduct(data: any): void {
        if (this.formMode !== this.c_s_MODE_ADD) {
            this.setControlValue('ProductCode', data.ProductCode);
            this.setControlValue('ProductDesc', data.ProductDesc);
            this.fetchProductRelatedData();
        }
    };

    // Callback for Product Sales Group Ellipsis
    public setSalesGroupCode(data: any): void {
        this.setControlValue('ProductSaleGroupCode', data.ProductSaleGroupCode);
        this.setControlValue('ProductSaleGroupDesc', data.ProductSaleGroupDesc);
    };

    // Callback for Product Service Group Dropdown
    public setProductServiceGroup(data: any): void {
        this.setControlValue('ProductServiceGroupCode', data.ProductServiceGroupCode);
        this.setControlValue('ProductServiceGroupDesc', data.ProductServiceGroupDesc);
        this.uiForm.markAsDirty();
    }

    // Callback for LOS Search Dropdown
    public setLOSCodeDesc(data: any): void {
        this.setControlValue('LOSCode', data.LOSCode);
        this.setControlValue('LOSName', data.LOSName);
        this.uiForm.markAsDirty();
    }

    // Callback for Api Code Dropdown
    public setAPICode(data: any): void {
        this.setControlValue('APICode', data.APICode);
        this.setControlValue('APICodeDesc', data.APICodeDesc);
        this.uiForm.markAsDirty();
    }

    // Callback for Tax Code Ellipsis
    public setTaxCode(data: any): void {
        this.setControlValue('TaxCode', data.TaxCode);
        this.setControlValue('TaxCodeDesc', data.TaxCodeDesc);
    };

    // Callback for Tax Code Materials Ellipsis
    public setTaxCodeMaterials(data: any): void {
        this.setControlValue('TaxCodeMaterials', data.TaxCode);
        this.setControlValue('TaxCodeMaterialsDesc', data.TaxCodeDesc);
    };

    // Callback for Tax Code Labour Ellipsis
    public setTaxCodeLabour(data: any): void {
        this.setControlValue('TaxCodeLabour', data.TaxCode);
        this.setControlValue('TaxCodeLabourDesc', data.TaxCodeDesc);
    };

    // Callback for Tax Code Replacement Ellipsis
    public setTaxCodeReplacement(data: any): void {
        this.setControlValue('TaxCodeReplacement', data.TaxCode);
        this.setControlValue('TaxCodeReplacementDesc', data.TaxCodeDesc);
    };

    // Callback for Service Type Dropdown
    public setServiceType(data: any): void {
        this.setControlValue('ServiceTypeCode', data.ServiceTypeCode);
        this.setControlValue('ServiceTypeDesc', data.ServiceTypeDesc);
        this.uiForm.markAsDirty();
    }

    // Tabout for Tax Code Materials
    public taxCodeMaterialsTabout(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupDetails: Array<any> = [{
            'table': 'TaxCode',
            'query': {
                'TaxCode': this.getControlValue('TaxCodeMaterials')
            },
            'fields': ['TaxCodeDesc']
        }];

        this.LookUp.lookUpRecord(lookupDetails).subscribe((data) => {
            if (data.length > 0) {
                let taxCodeMaterialsData: Array<any> = data[0];

                if (taxCodeMaterialsData.length > 0) {
                    this.setControlValue('TaxCodeMaterialsDesc', taxCodeMaterialsData[0].TaxCodeDesc);
                }

            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    };

    // Tabout for Tax Code Labour
    public taxCodeLabourTabout(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupDetails: Array<any> = [{
            'table': 'TaxCode',
            'query': {
                'TaxCode': this.getControlValue('TaxCodeLabour')
            },
            'fields': ['TaxCodeDesc']
        }];

        this.LookUp.lookUpRecord(lookupDetails).subscribe((data) => {
            if (data.length > 0) {
                let taxCodeLabourData: Array<any> = data[0];

                if (taxCodeLabourData.length > 0) {
                    this.setControlValue('TaxCodeLabourDesc', taxCodeLabourData[0].TaxCodeDesc);
                }
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    // Tabout for Tax Code Replacement
    public taxCodeReplacementTabout(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupDetails: Array<any> = [{
            'table': 'TaxCode',
            'query': {
                'TaxCode': this.getControlValue('TaxCodeReplacement')
            },
            'fields': ['TaxCodeDesc']
        }];

        this.LookUp.lookUpRecord(lookupDetails).subscribe((data) => {
            if (data.length > 0) {
                let taxCodeReplacementData: Array<any> = data[0];

                if (taxCodeReplacementData.length > 0) {
                    this.setControlValue('TaxCodeReplacementDesc', taxCodeReplacementData[0].TaxCodeDesc);
                }
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    // TermiteRenewalLetterInd OnChecked
    public termiteRenewalLetterIndOnChecked(): void {
        this.buildMenu();
    }

    // InstallationRequired OnChecked
    public invoiceSuspendIndOnChecked(): void {
        if (this.getControlValue('InstallationRequired'))
            this.setControlValue('ValidForEntitlementInd', false);
        this.setInputElementProperties();
    }

    // ValidForEntitlementInd OnChecked
    public validForEntitlementIndOnChecked(): void {
        if (this.getControlValue('ValidForEntitlementInd'))
            this.setControlValue('InvoiceSuspendInd', false);
        this.setInputElementProperties();
    }

    // Installation Required OnChecked
    public installationRequiredOnChecked(): void {
        this.setInputElementProperties();
    }

    // CombineInvoiceValueInd OnChecked
    public combineInvoiceValueIndOnChecked(): void {
        if (this.getControlValue('CombineInvoiceValueInd'))
            this.riExchange.riInputElement.Enable(this.uiForm, 'CombineInvoiceValueDesc');
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'CombineInvoiceValueDesc');
            this.setControlValue('CombineInvoiceValueDesc', '');
            this.uiForm.controls['CombineInvoiceValueDesc'].markAsUntouched();
        }
    }

    // MultipleTaxRates OnChecked
    public multipleTaxRatesOnChecked(): void {
        if (this.sysCharParams['vSCMultipleTaxRates']) {
            if (this.getControlValue('MultipleTaxRates')) {
                this.displayFields.multipleTaxRates = true;
            } else {
                this.resetControls(['TaxCodeMaterials', 'TaxCodeMaterialsDesc', 'InvoiceTextMaterials', 'TaxCodeLabour', 'TaxCodeLabourDesc', 'InvoiceTextLabour', 'TaxCodeReplacement', 'TaxCodeReplacementDesc', 'InvoiceTextReplacement']);
                this.setControlValue('ConsolidateEqualTaxRates', false);
                this.displayFields.multipleTaxRates = false;
            }
        }
    }

    // CompositeProductInd OnChecked
    public compositeProductIndOnChecked(): void {
        if (this.getControlValue('CompositeProductInd'))
            this.displayFields.tdCompositePricingType = true;
        else
            this.displayFields.tdCompositePricingType = false;
    };

    // RequiresManualVisitPlanningInd OnChecked
    public requiresManualVisitPlanningIndOnChecked(): void {
        if (this.formMode !== this.c_s_MODE_SELECT)
            if (this.getControlValue('CompositeProductInd'))
                this.riExchange.riInputElement.Enable(this.uiForm, 'RequiresVisitDetailTextInd');
            else {
                this.riExchange.riInputElement.Disable(this.uiForm, 'RequiresVisitDetailTextInd');
                this.setControlValue('RequiresVisitDetailTextInd', false);
            }
    };

    // Add Mode from Product Search
    public addProduct(data: any): void {
        if (data) {
            this.uiForm.reset();
            // Resetting Grid
            this.gridParams = {
                totalRecords: 0,
                pageCurrent: 1,
                itemsPerPage: 10,
                riGridMode: 0
            };
            this.setTabActive(1);
            this.setFormMode(this.c_s_MODE_ADD);
            this.isselectCompositePricingTypeDisabled = false;
            this.uncheckingAllCheckboxes();
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductDesc', true);
            this.enableControls(['ProductSaleGroupDesc', 'ProductServiceGroupDesc', 'LOSName', 'StockItem', 'RotationByScheduleInd', 'BudgetBillingInstalmentDesc', 'RangeDesc', 'CombineInvoiceValueDesc', 'TaxCodeDesc', 'TaxCodeMaterialsDesc', 'TaxCodeLabourDesc', 'TaxCodeReplacementDesc', 'ProductChargeDesc', 'ProductPriceGroupDesc']);
            this.searchConfigs.productServiceGroupSearch.active = {
                id: '',
                text: ''
            };
            this.searchConfigs.losSearch.active = {
                id: '',
                text: ''
            };
            this.searchConfigs.apiCodeSearch.active = {
                id: '',
                text: ''
            };
            this.searchConfigs.serviceTypeSearch.active = {
                id: '',
                text: ''
            };
            this.enableSearches(false);

            const multipleChecks: Array<any> = ['ValidForNewInd', 'ValueRequiredInd', 'PassToPDAInd'];
            this.setMultipleControlsValues(multipleChecks, true);
            this.setControlValue('CombineInvoiceValueInd', false);
            this.setControlValue('InitialInvoicePeriodInYears', '0');

            this.validForEntitlementIndOnChecked();
            this.multipleTaxRatesOnChecked();
            this.combineInvoiceValueIndOnChecked();

            this.setProductHierarchy();
        }
    };

    // Fetching Product Related Data
    public fetchProductRelatedData(): void {
        if (this.formMode !== this.c_s_MODE_ADD) {
            this.formPristine();
            let queryGet: URLSearchParams = this.getURLSearchParamObject();
            queryGet.set(this.serviceConstants.Action, '0');
            queryGet.set(this.serviceConstants.BusinessCode, this.businessCode());
            queryGet.set(this.serviceConstants.ProductCode, this.getControlValue('ProductCode'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryGet)
                .subscribe(
                (data) => {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.setFormMode(this.c_s_MODE_SELECT);
                    } else {
                        this.pageParams = data;
                        for (let key in data) {
                            if (data.hasOwnProperty(key)) {
                                if (key === 'Product') {
                                    this.productRowID = data[key];
                                    continue;
                                }
                                if (data[key] === 'yes' || data[key] === 'no')
                                    this.setControlValue(key, data[key] === 'yes' ? true : false);
                                else
                                    this.setControlValue(key, data[key]);
                            }
                        }
                        this.isProductHierarchyDropdownsDisabled = false;
                        this.isselectCompositePricingTypeDisabled = false;
                        if (this.getControlValue('ValidForEntitlementInd'))
                            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'UnitDesc', true);
                        this.checkServiceCover();
                        this.disableControl('ProductCode', true);
                        this.enableControls(['ProductCode', 'ProductDesc', 'ProductSaleGroupDesc', 'ProductServiceGroupDesc', 'LOSName', 'StockItem', 'RotationByScheduleInd', 'BudgetBillingInstalmentDesc', 'RangeDesc', 'CombineInvoiceValueDesc', 'TaxCodeDesc', 'TaxCodeMaterialsDesc', 'TaxCodeLabourDesc', 'TaxCodeReplacementDesc', 'ProductChargeDesc', 'ProductPriceGroupDesc']);
                        this.enableSearches(false);
                        this.lookupApi();
                        this.compositeProductIndOnChecked();
                        this.setProductHierarchy(); // TODO: Tab issue (hidden to ngIf pending in HTML)
                        if (this.sysCharParams['vSCEnableAPTByServiceType'])
                            this.getProductServiceType();
                        this.setControlValue('SavedCapableOfUplift', this.getControlValue('CapableOfUplift'));
                        this.setFormMode(this.c_s_MODE_UPDATE);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }

    public validateBeforeSave(): void {
        this.setControlValue('CompositePricingType', this.getControlValue('SelectCompositePricingType'));
        // Check if ServiceType is S or P
        if (this.sysCharParams['vSCEnableInstallsRemovals'] && this.sysCharParams['vSCEnableTransData']) {
            if (this.getControlValue('ServiceType') !== 'P' && this.getControlValue('ServiceType') !== 'S') {
                this.modalAdvService.emitError(new ICabsModalVO(ErrorConstant.Message.ServiceTypeError));
                this.uiForm.controls['ServiceType'].setValidators([this.serviceTypeValidate]);
            }
        }
        // In case ProductServiceGroupCode invalid
        if (!this.uiForm.controls['ProductServiceGroupCode'].valid)
            this.searchConfigs.productServiceGroupSearch.isTriggerValidate = true;
        else
            this.searchConfigs.productServiceGroupSearch.isTriggerValidate = false;

        // In case LOSCode invalid
        if (!this.uiForm.controls['LOSCode'].valid)
            this.searchConfigs.losSearch.isTriggerValidate = true;
        else
            this.searchConfigs.losSearch.isTriggerValidate = false;

        // In case APICode invalid
        if (!this.uiForm.controls['APICode'].valid) {
            this.searchConfigs.apiCodeSearch.isTriggerValidate = true;
            this.displayFields.othersTabRed = true;
        }
        else {
            this.searchConfigs.apiCodeSearch.isTriggerValidate = false;
            this.displayFields.othersTabRed = false;
        }

        // In case ServiceTypeCode invalid
        if (!this.uiForm.controls['ServiceTypeCode'].valid) {
            this.searchConfigs.serviceTypeSearch.isTriggerValidate = true;
            this.displayFields.othersTabRed = true;
        }
        else {
            this.searchConfigs.serviceTypeSearch.isTriggerValidate = false;
            this.displayFields.othersTabRed = false;
        }

        if (this.uiForm.valid)
            if (this.formMode === this.c_s_MODE_UPDATE && this.sysCharParams['vSCEnableAPTByServiceType'])
                this.checkProductServiceType();
            else
                this.checkCapableOfUplift();
        else
            this.uiFormMarkAsTouched();
    }

    public promptModalForDelete(): void {
        let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteProduct.bind(this));
        this.modalAdvService.emitPrompt(modalVO);
    }

    // Cancel Operation
    public cancelProduct(): void {
        if (this.formMode !== this.c_s_MODE_SELECT)
            if (this.formMode === this.c_s_MODE_ADD) {
                this.setFormMode(this.c_s_MODE_SELECT);
                this.uiForm.reset();
            } else {
                this.setFormMode(this.c_s_MODE_UPDATE);
                for (let key in this.pageParams) {
                    if (this.pageParams.hasOwnProperty(key)) {
                        if (key === 'Product') {
                            this.productRowID = this.pageParams[key];
                            continue;
                        }
                        if (this.pageParams[key] === 'yes' || this.pageParams[key] === 'no')
                            this.setControlValue(key, this.pageParams[key] === 'yes' ? true : false);
                        else
                            this.setControlValue(key, this.pageParams[key]);
                    }
                }
            }
        this.formPristine();
    };
}
