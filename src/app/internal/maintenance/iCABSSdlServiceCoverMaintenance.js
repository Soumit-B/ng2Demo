var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Rx';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { BusinessOriginDetailLanguageSearchComponent } from './../search/iCABSBBusinessOriginDetailLanguageSearch';
import { BranchServiceAreaSearchComponent } from './../search/iCABSBBranchServiceAreaSearch';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
export var DlServiceCoverMaintenanceComponent = (function (_super) {
    __extends(DlServiceCoverMaintenanceComponent, _super);
    function DlServiceCoverMaintenanceComponent(injector, titleService) {
        _super.call(this, injector);
        this.titleService = titleService;
        this.pageId = '';
        this.promptTitle = '';
        this.promptContent = '';
        this.showMessageHeader = true;
        this.showErrorHeader = true;
        this.showHeader = true;
        this.requestParams = {
            operation: 'Sales/iCABSSdlServiceCoverMaintenance',
            module: 'advantage',
            method: 'prospect-to-contract/maintenance'
        };
        this.search = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.querySysChar = new URLSearchParams();
        this.controls = [
            { name: 'dlPremiseRef', readonly: false, disabled: true, required: false },
            { name: 'ContractTypeCode', readonly: false, disabled: true, required: false },
            { name: 'dlStatusCode', readonly: false, disabled: true, required: false },
            { name: 'dlStatusDesc', readonly: false, disabled: true, required: false },
            { name: 'ProductCode', readonly: false, disabled: true, required: true },
            { name: 'ProductDesc', readonly: false, disabled: true, required: false },
            { name: 'ServiceVisitFrequency', readonly: false, disabled: true, required: false },
            { name: 'ServiceQuantityChange', readonly: false, disabled: true, required: false },
            { name: 'BusinessOriginCode', readonly: false, disabled: false, required: true },
            { name: 'BusinessOriginDesc', readonly: false, disabled: true, required: false },
            { name: 'BusinessOriginDetailCode', readonly: false, disabled: false, required: true },
            { name: 'BusinessOriginDetailDesc', readonly: false, disabled: true, required: false },
            { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: true },
            { name: 'EmployeeSurname', readonly: false, disabled: true, required: false },
            { name: 'ServiceTypeCode', readonly: false, disabled: false, required: true },
            { name: 'ServiceTypeDesc', readonly: false, disabled: true, required: false },
            { name: 'TaxCode', readonly: false, disabled: false, required: true },
            { name: 'ServiceBranchNumber', readonly: false, disabled: true, required: false },
            { name: 'BranchName', readonly: false, disabled: true, required: false },
            { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: true },
            { name: 'BranchServiceAreaDesc', readonly: false, disabled: true, required: false },
            { name: 'ServiceEmployeeCode', readonly: false, disabled: true, required: false },
            { name: 'ServiceEmployeeSurname', readonly: false, disabled: true, required: false },
            { name: 'WasteTransferRequired', readonly: false, disabled: true, required: false },
            { name: 'GuaranteeRequired', readonly: false, disabled: false, required: false },
            { name: 'NoGuaranteeCode', readonly: false, disabled: false, required: false },
            { name: 'NoGuaranteeDescription', readonly: false, disabled: true, required: false },
            { name: 'AgeofProperty', readonly: false, disabled: false, required: false },
            { name: 'NumberBedrooms', readonly: false, disabled: false, required: false },
            { name: 'ListedCode', readonly: false, disabled: false, required: false },
            { name: 'ListedDescription', readonly: false, disabled: false, required: false },
            { name: 'StandardTreatmentTime', readonly: false, disabled: true, required: false },
            { name: 'ChargeRateCode', readonly: false, disabled: false, required: true },
            { name: 'ChargeRateDesc', readonly: false, disabled: true, required: false },
            { name: 'StandardTimeInd', readonly: false, disabled: false, required: false },
            { name: 'AccessHireValue', readonly: false, disabled: true, required: false },
            { name: 'MaterialsValue', readonly: false, disabled: true, required: false },
            { name: 'MaterialsDesc', readonly: false, disabled: false, required: false },
            { name: 'InitialValue', readonly: false, disabled: true, required: false },
            { name: 'TotalValue', readonly: false, disabled: true, required: false },
            { name: 'CalculatedDiscount', readonly: false, disabled: true, required: false },
            { name: 'DiscountReason', readonly: false, disabled: false, required: false },
            { name: 'PrepFilter', readonly: false, disabled: false, required: false },
            { name: 'SDFilter', readonly: false, disabled: false, required: false },
            { name: 'AnnualValueChange', readonly: false, disabled: true, required: false },
            { name: 'TaxCodeDesc', readonly: false, disabled: true, required: false },
            { name: 'ServiceSpecialInstructions', readonly: false, disabled: false, required: true },
            { name: 'ViewOriginal', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth01', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm01', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh01', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm01', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth08', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm08', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh08', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm08', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth02', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm02', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh02', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm02', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth09', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm09', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh09', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm09', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth03', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm03', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh03', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm03', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth10', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm10', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh10', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm10', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth04', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm04', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh04', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm04', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth11', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm11', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh11', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm11', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth05', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm05', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh05', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm05', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth12', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm12', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh12', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm12', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth06', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm06', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh06', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm06', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth13', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm13', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh13', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm13', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth07', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm07', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh07', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm07', readonly: false, disabled: false, required: false },
            { name: 'WindowStarth14', readonly: false, disabled: false, required: false },
            { name: 'WindowStartm14', readonly: false, disabled: false, required: false },
            { name: 'WindowEndh14', readonly: false, disabled: false, required: false },
            { name: 'WindowEndm14', readonly: false, disabled: false, required: false },
            { name: 'Save', readonly: false, disabled: false, required: false },
            { name: 'Cancel', readonly: false, disabled: false, required: false }
        ];
        this.fieldVisibility = {
            dlPremiseRef: true,
            ContractTypeCode: true,
            dlStatusCode: true,
            dlStatusDesc: true,
            ProductCode: true,
            ProductDesc: true,
            ServiceVisitFrequency: true,
            ServiceQuantityChange: true,
            BusinessOriginCode: true,
            BusinessOriginDesc: true,
            BusinessOriginDetailCode: true,
            BusinessOriginDetailDesc: true,
            ServiceSalesEmployee: true,
            EmployeeSurname: true,
            ServiceTypeCode: true,
            ServiceTypeDesc: true,
            TaxCode: true,
            TaxCodeDesc: true,
            ServiceBranchNumber: true,
            BranchName: true,
            BranchServiceAreaCode: true,
            BranchServiceAreaDesc: true,
            ServiceEmployeeCode: true,
            ServiceEmployeeSurname: true,
            WasteTransferRequired: true,
            GuaranteeRequired: true,
            NoGuaranteeCode: false,
            NoGuaranteeDescription: false,
            AgeofProperty: false,
            NumberBedrooms: false,
            ListedCode: false,
            ListedDescription: false,
            StandardTreatmentTime: true,
            ChargeRateCode: true,
            ChargeRateDesc: true,
            StandardTimeInd: true,
            AccessHireValue: true,
            MaterialsValue: true,
            MaterialsDesc: true,
            InitialValue: false,
            TotalValue: true,
            AnnualValueChange: true,
            CalculatedDiscount: true,
            DiscountReason: true,
            PrepFilter: true,
            SDFilter: true,
            ServiceSpecialInstructions: true,
            grdTimeWindow: true,
            WindowStarth01: true,
            WindowStartm01: true,
            WindowEndh01: true,
            WindowEndm01: true,
            WindowStarth08: true,
            WindowStartm08: true,
            WindowEndh08: true,
            WindowEndm08: true,
            WindowStarth02: true,
            WindowStartm02: true,
            WindowEndh02: true,
            WindowEndm02: true,
            WindowStarth09: true,
            WindowStartm09: true,
            WindowEndh09: true,
            WindowEndm09: true,
            WindowStarth03: true,
            WindowStartm03: true,
            WindowEndh03: true,
            WindowEndm03: true,
            WindowStarth10: true,
            WindowStartm10: true,
            WindowEndh10: true,
            WindowEndm10: true,
            WindowStarth04: true,
            WindowStartm04: true,
            WindowEndh04: true,
            WindowEndm04: true,
            WindowStarth11: true,
            WindowStartm11: true,
            WindowEndh11: true,
            WindowEndm11: true,
            WindowStarth05: true,
            WindowStartm05: true,
            WindowEndh05: true,
            WindowEndm05: true,
            WindowStarth12: true,
            WindowStartm12: true,
            WindowEndh12: true,
            WindowEndm12: true,
            WindowStarth06: true,
            WindowStartm06: true,
            WindowEndh06: true,
            WindowEndm06: true,
            WindowStarth13: true,
            WindowStartm13: true,
            WindowEndh13: true,
            WindowEndm13: true,
            WindowStarth07: true,
            WindowStartm07: true,
            WindowEndh07: true,
            WindowEndm07: true,
            WindowStarth14: true,
            WindowStartm14: true,
            WindowEndh14: true,
            WindowEndm14: true,
            Save: true,
            Cancel: true
        };
        this.dropdownList = {
            WindowStarth01: [],
            WindowStartm01: [],
            WindowEndh01: [],
            WindowEndm01: [],
            WindowStarth08: [],
            WindowStartm08: [],
            WindowEndh08: [],
            WindowEndm08: [],
            WindowStarth02: [],
            WindowStartm02: [],
            WindowEndh02: [],
            WindowEndm02: [],
            WindowStarth09: [],
            WindowStartm09: [],
            WindowEndh09: [],
            WindowEndm09: [],
            WindowStarth03: [],
            WindowStartm03: [],
            WindowEndh03: [],
            WindowEndm03: [],
            WindowStarth10: [],
            WindowStartm10: [],
            WindowEndh10: [],
            WindowEndm10: [],
            WindowStarth04: [],
            WindowStartm04: [],
            WindowEndh04: [],
            WindowEndm04: [],
            WindowStarth11: [],
            WindowStartm11: [],
            WindowEndh11: [],
            WindowEndm11: [],
            WindowStarth05: [],
            WindowStartm05: [],
            WindowEndh05: [],
            WindowEndm05: [],
            WindowStarth12: [],
            WindowStartm12: [],
            WindowEndh12: [],
            WindowEndm12: [],
            WindowStarth06: [],
            WindowStartm06: [],
            WindowEndh06: [],
            WindowEndm06: [],
            WindowStarth13: [],
            WindowStartm13: [],
            WindowEndh13: [],
            WindowEndm13: [],
            WindowStarth07: [],
            WindowStartm07: [],
            WindowEndh07: [],
            WindowEndm07: [],
            WindowStarth14: [],
            WindowStartm14: [],
            WindowEndh14: [],
            WindowEndm14: []
        };
        this.fieldRequired = {
            ProductCode: true,
            ServiceBranchNumber: true,
            ContractTypeCode: false,
            BranchServiceAreaCode: true,
            BusinessOriginCode: true,
            BusinessOriginDetailCode: true,
            ChargeRateCode: true,
            ServiceSpecialInstructions: true,
            ServiceTypeCode: true,
            ServiceVisitFrequency: true,
            NoGuaranteeCode: true,
            DiscountReason: false,
            MaterialsValue: false,
            ServiceQuantityChange: false,
            AnnualValueChange: false,
            TaxCode: true,
            ServiceSalesEmployee: true
        };
        this.syschars = {
            vSCEnableInitialCharge: '',
            vSCEnablePreps: ''
        };
        this.otherVariables = {
            dlBatchRef: '',
            dlRecordType: 'SC',
            dlExtRef: '',
            dlServiceCoverRef: '',
            dlRejectionCode: '',
            dlRejectionDesc: '',
            dlServiceCover: '',
            CompanyCode: '',
            LanguageCode: '',
            SelectedLine: '',
            Misc: '',
            SubSystem: '',
            DetailRequired: '',
            QuantityRequired: '',
            ServiceCommenceDate: '',
            SOServiceCoverNumber: '',
            InfoMessage: '',
            UpdateableInd: '',
            UpdateableIndBoolean: '',
            PremiseIsPNOL: '',
            AutoCloseWindow: '',
            PNOLSetupChargeRequired: '',
            dlMasterExtRef: '',
            InitialdlMasterExtRef: '',
            QuoteTypeCode: '',
            DisQuoteTypeCode: '',
            BusinessOriginDetailReq: '',
            blnCalcDiscountOnly: '',
            CurrentContractType: '',
            AccessHireValueDecimal: '',
            MaterialsValueDecimal: '',
            storeInitialRefs: '',
            boolPropertyCareInd: '',
            boolUserWriteAccess: '',
            AnnualValueChangeLabel: ''
        };
        this.dateObjects = {
            PassedDate: void 0
        };
        this.dateObjectsEnabled = {
            PassedDate: true
        };
        this.dateObjectsDisplay = {
            passedDateDisplay: ''
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.uiDisplay = {
            tab: {
                tab1: { visible: true, active: true, error: false },
                tab2: { visible: false, active: false, error: false },
                tab3: { visible: true, active: false, error: false },
                tab4: { visible: false, active: false, error: false },
                tab5: { visible: false, active: false, error: false },
                tab6: { visible: true, active: false, error: false },
                tab7: { visible: true, active: false, error: false }
            }
        };
        this.ellipsis = {
            employeeSearch: {
                inputParams: {
                    parentMode: 'LookUp-ServiceCoverCommissionEmployee',
                    countryCode: '',
                    businessCode: '',
                    negativeBranchNumber: ''
                },
                isEllipsisDisabled: false,
                contentComponent: null
            },
            businessOriginCode: {
                inputParams: {
                    parentMode: 'LookUp',
                    countryCode: '',
                    businessCode: '',
                    negativeBranchNumber: ''
                },
                isEllipsisDisabled: false,
                contentComponent: null
            },
            serviceArea: {
                inputParams: {
                    parentMode: 'LookUp-SC',
                    countryCode: '',
                    businessCode: '',
                    negativeBranchNumber: '',
                    ServiceBranchNumber: '',
                    BranchName: ''
                },
                isEllipsisDisabled: false,
                contentComponent: null
            },
            businessOriginDetailCode: {
                inputParams: {
                    parentMode: 'LookUp',
                    countryCode: '',
                    businessCode: '',
                    negativeBranchNumber: ''
                },
                isEllipsisDisabled: false,
                contentComponent: null
            },
            chargeRateCode: {
                inputParams: {
                    parentMode: 'LookUp',
                    countryCode: '',
                    businessCode: '',
                    negativeBranchNumber: ''
                },
                isEllipsisDisabled: false,
                contentComponent: null
            },
            noGuaranteeCode: {
                inputParams: {
                    parentMode: 'LookUp',
                    countryCode: '',
                    businessCode: '',
                    negativeBranchNumber: ''
                },
                isEllipsisDisabled: false,
                contentComponent: null
            },
            productCode: {
                inputParams: {
                    parentMode: 'ServiceCover-' + this.otherVariables['CurrentContractType'],
                    countryCode: '',
                    businessCode: '',
                    negativeBranchNumber: ''
                },
                isEllipsisDisabled: true,
                contentComponent: null
            },
            serviceType: {
                inputParams: {
                    parentMode: 'LookUp',
                    countryCode: '',
                    businessCode: '',
                    negativeBranchNumber: ''
                },
                isEllipsisDisabled: false,
                contentComponent: null
            },
            taxCode: {
                inputParams: {
                    parentMode: 'LookUp',
                    countryCode: '',
                    businessCode: '',
                    negativeBranchNumber: ''
                },
                isEllipsisDisabled: false,
                contentComponent: null
            }
        };
        this.grid = {
            gridA: {
                maxColumns: 3,
                itemsPerPage: 10,
                currentPage: 1,
                totalRecords: 0,
                paginationCurrentPage: 1,
                headerClicked: '',
                sortType: 'Descending',
                inputParams: {}
            },
            gridB: {
                maxColumns: 5,
                itemsPerPage: 10,
                currentPage: 1,
                totalRecords: 0,
                paginationCurrentPage: 1,
                headerClicked: '',
                sortType: 'Descending',
                inputParams: {}
            }
        };
        this.showCloseButton = true;
        this.formRawClone = {};
        this.pageId = PageIdentifier.ICABSSDLSERVICECOVERMAINTENANCE;
    }
    DlServiceCoverMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Advantage Service Cover Maintenance';
        this.queryParams = this.riExchange.getRouterParams();
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.otherVariables['LanguageCode'] = this.riExchange.LanguageCode();
        this.otherVariables['CurrentContractType'] = this.riExchange.getParentHTMLValue('ContractTypeCode');
        this.otherVariables['dlPremiseRef'] = this.riExchange.getParentHTMLValue('dlPremiseRef') || this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'dlPremiseRef');
        this.otherVariables['SubSystem'] = this.riExchange.getParentHTMLValue('SubSystem') || 'SalesOrder';
        this.otherVariables['QuoteTypeCode'] = this.riExchange.getParentHTMLValue('QuoteTypeCode');
        this.otherVariables['DisQuoteTypeCode'] = this.riExchange.getParentHTMLValue('DisQuoteTypeCode');
        this.otherVariables['dlBatchRef'] = this.riExchange.getParentHTMLValue('dlBatchRef');
        this.otherVariables['dlExtRef'] = this.riExchange.getParentHTMLValue('dlExtRef');
        this.otherVariables['dlServiceCoverRef'] = this.riExchange.getParentHTMLValue('dlServiceCoverRef');
        this.otherVariables['dlRejectionCode'] = this.riExchange.getParentHTMLValue('dlRejectionCode');
        this.otherVariables['dlRejectionDesc'] = this.riExchange.getParentHTMLValue('dlRejectionDesc');
        this.otherVariables['CompanyCode'] = this.riExchange.getParentHTMLValue('CompanyCode');
        this.otherVariables['SelectedLine'] = this.riExchange.getParentHTMLValue('SelectedLine');
        this.otherVariables['Misc'] = this.riExchange.getParentHTMLValue('Misc');
        this.otherVariables['DetailRequired'] = this.riExchange.getParentHTMLValue('DetailRequired');
        this.otherVariables['QuantityRequired'] = this.riExchange.getParentHTMLValue('QuantityRequired');
        this.otherVariables['ServiceCommenceDate'] = this.riExchange.getParentHTMLValue('ServiceCommenceDate');
        this.otherVariables['SOServiceCoverNumber'] = this.riExchange.getParentHTMLValue('SOServiceCoverNumber');
        this.otherVariables['InfoMessage'] = this.riExchange.getParentHTMLValue('InfoMessage');
        this.otherVariables['UpdateableInd'] = this.riExchange.getParentHTMLValue('UpdateableInd');
        this.otherVariables['PremiseIsPNOL'] = this.riExchange.getParentHTMLValue('PremiseIsPNOL');
        this.otherVariables['AutoCloseWindow'] = this.riExchange.getParentHTMLValue('AutoCloseWindow');
        this.otherVariables['PNOLSetupChargeRequired'] = this.riExchange.getParentHTMLValue('PNOLSetupChargeRequired');
        this.otherVariables['dlMasterExtRef'] = this.riExchange.getParentHTMLValue('dlMasterExtRef');
        this.otherVariables['InitialdlMasterExtRef'] = this.riExchange.getParentHTMLValue('InitialdlMasterExtRef');
        this.otherVariables['QuoteTypeCode'] = this.riExchange.getParentHTMLValue('QuoteTypeCode');
        this.otherVariables['DisQuoteTypeCode'] = this.riExchange.getParentHTMLValue('DisQuoteTypeCode');
        this.otherVariables['BusinessOriginDetailReq'] = this.riExchange.getParentHTMLValue('BusinessOriginDetailReq');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.otherVariables['CurrentContractType']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlPremiseRef', this.otherVariables['dlPremiseRef']);
        this.ellipsis['businessOriginDetailCode']['contentComponent'] = BusinessOriginDetailLanguageSearchComponent;
        this.ellipsis['serviceArea']['contentComponent'] = BranchServiceAreaSearchComponent;
        this.ellipsis['businessOriginCode']['contentComponent'] = ScreenNotReadyComponent;
        this.ellipsis['chargeRateCode']['contentComponent'] = ScreenNotReadyComponent;
        this.ellipsis['noGuaranteeCode']['contentComponent'] = ScreenNotReadyComponent;
        this.ellipsis['serviceType']['contentComponent'] = ScreenNotReadyComponent;
        this.ellipsis['taxCode']['contentComponent'] = ScreenNotReadyComponent;
        this.ellipsis['productCode']['contentComponent'] = ProductSearchGridComponent;
        this.ellipsis['employeeSearch']['contentComponent'] = EmployeeSearchComponent;
        if (this.otherVariables['DisQuoteTypeCode'] === '') {
            this.otherVariables['DisQuoteTypeCode'] = this.otherVariables['QuoteTypeCode'];
        }
        this.fetchTranslationContent();
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        this.postInit();
    };
    DlServiceCoverMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    DlServiceCoverMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    DlServiceCoverMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.errorModal.show(data, false);
    };
    DlServiceCoverMaintenanceComponent.prototype.renderTab = function (tabindex) {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 3:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = true;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 4:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = true;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 5:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = true;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 6:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = true;
                this.uiDisplay.tab.tab7.active = false;
                break;
            case 7:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                this.uiDisplay.tab.tab5.active = false;
                this.uiDisplay.tab.tab6.active = false;
                this.uiDisplay.tab.tab7.active = true;
                break;
        }
        this.onTabSelect();
    };
    DlServiceCoverMaintenanceComponent.prototype.onTabSelect = function () {
        var tabsElemList = document.querySelectorAll('#tabCont .tab-content .tab-pane');
        for (var i = 0; i < tabsElemList.length; i++) {
            if (tabsElemList[i].querySelectorAll('input.ng-invalid.ng-touched, textarea.ng-invalid.ng-touched').length > 0) {
                var tabText = 'tab' + (i + 1);
                this.uiDisplay.tab[tabText].error = true;
            }
            else {
                var tabText = 'tab' + (i + 1);
                this.uiDisplay.tab[tabText].error = false;
            }
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.getGridInfoA = function (info) {
        var _this = this;
        this.grid.gridA.totalRecords = info.totalRows;
        setTimeout(function () {
            _this.grid.gridA.paginationCurrentPage = _this.grid.gridA.currentPage;
        }, 0);
    };
    DlServiceCoverMaintenanceComponent.prototype.getGridInfoB = function (info) {
        var _this = this;
        this.grid.gridB.totalRecords = info.totalRows;
        setTimeout(function () {
            _this.grid.gridB.paginationCurrentPage = _this.grid.gridB.currentPage;
        }, 0);
    };
    DlServiceCoverMaintenanceComponent.prototype.onGridRowDblClickA = function (data) {
        var _this = this;
        if (data.cellIndex === 2) {
            this.fetchServiceCoverPost('ToggleSelected', {
                dlBatchRef: this.otherVariables['dlBatchRef'],
                dlServiceCoverRef: this.otherVariables['dlServiceCoverRef'],
                ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                ProductDetailCode: data.trRowData[0].text
            }, {}).subscribe(function (data) {
                if (data['status'] === GlobalConstant.Configuration.Failure) {
                    _this.errorService.emitError(data['oResponse']);
                }
                else {
                    if (!data['errorMessage']) {
                        _this.loadGridViewA();
                    }
                }
            }, function (error) {
            });
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onGridRowDblClickB = function (data) {
    };
    DlServiceCoverMaintenanceComponent.prototype.onGridCellClickA = function (data) {
    };
    DlServiceCoverMaintenanceComponent.prototype.onGridCellClickB = function (data) {
    };
    DlServiceCoverMaintenanceComponent.prototype.getCurrentPageA = function (event) {
        this.grid.gridA.currentPage = event.value;
        this.refreshGridA();
    };
    DlServiceCoverMaintenanceComponent.prototype.getCurrentPageB = function (event) {
        this.grid.gridB.currentPage = event.value;
        this.refreshGridB();
    };
    DlServiceCoverMaintenanceComponent.prototype.loadGridViewA = function () {
        var search = new URLSearchParams();
        this.grid.gridA.inputParams['module'] = this.requestParams.module;
        this.grid.gridA.inputParams['method'] = this.requestParams.method;
        this.grid.gridA.inputParams['operation'] = this.requestParams.operation;
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('dlBatchRef', this.otherVariables['dlBatchRef'] ? this.otherVariables['dlBatchRef'] : '');
        search.set('dlPremiseRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlPremiseRef'));
        search.set('dlServiceCoverRef', this.otherVariables['dlServiceCoverRef']);
        search.set('SOServiceCoverNumber', this.otherVariables['SOServiceCoverNumber']);
        search.set('LanguageCode', this.otherVariables['LanguageCode']);
        search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        search.set('SDFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'SDFilter'));
        search.set('riSortOrder', this.grid.gridA.sortType);
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('HeaderClickedColumn', this.grid.gridA.headerClicked);
        search.set('PageSize', this.grid.gridA.itemsPerPage.toString());
        search.set('PageCurrent', this.grid.gridA.currentPage.toString());
        this.grid.gridA.inputParams['search'] = search;
        this.gridA.loadGridData(this.grid.gridA.inputParams);
    };
    DlServiceCoverMaintenanceComponent.prototype.loadGridViewB = function () {
        var search = new URLSearchParams();
        this.grid.gridB.inputParams['module'] = this.requestParams.module;
        this.grid.gridB.inputParams['method'] = this.requestParams.method;
        this.grid.gridB.inputParams['operation'] = this.requestParams.operation;
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode') : '');
        search.set('dlPremiseRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlPremiseRef'));
        search.set('SOServiceCoverNumber', this.otherVariables['SOServiceCoverNumber']);
        search.set('ChargeRateCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ChargeRateCode'));
        search.set('ServiceVisitFrequency', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency'));
        search.set('PrepFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'PrepFilter'));
        search.set('riSortOrder', this.grid.gridB.sortType);
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('HeaderClickedColumn', this.grid.gridB.headerClicked);
        search.set('PageSize', this.grid.gridB.itemsPerPage.toString());
        search.set('PageCurrent', this.grid.gridB.currentPage.toString());
        this.grid.gridB.inputParams['search'] = search;
        this.gridB.loadGridData(this.grid.gridB.inputParams);
    };
    DlServiceCoverMaintenanceComponent.prototype.refreshGridA = function () {
        this.loadGridViewA();
    };
    DlServiceCoverMaintenanceComponent.prototype.refreshGridB = function () {
        this.loadGridViewB();
    };
    DlServiceCoverMaintenanceComponent.prototype.sortGridA = function (data) {
        this.grid.gridA.headerClicked = data.fieldname;
        this.grid.gridA.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridViewA();
    };
    DlServiceCoverMaintenanceComponent.prototype.sortGridB = function (data) {
        this.grid.gridB.headerClicked = data.fieldname;
        this.grid.gridB.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGridViewB();
    };
    DlServiceCoverMaintenanceComponent.prototype.guaranteeToggle = function () {
        if (this.uiForm.controls['GuaranteeRequired'].value) {
            this.fieldVisibility.AgeofProperty = true;
            this.fieldVisibility.NumberBedrooms = true;
            this.fieldVisibility.ListedCode = true;
            this.fieldVisibility.NoGuaranteeCode = false;
            this.fieldRequired.NoGuaranteeCode = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NoGuaranteeCode', false);
        }
        else {
            this.fieldVisibility.AgeofProperty = false;
            this.fieldVisibility.NumberBedrooms = false;
            this.fieldVisibility.ListedCode = false;
            this.fieldVisibility.NoGuaranteeCode = true;
            this.fieldRequired.NoGuaranteeCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NoGuaranteeCode', true);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onBusinessOriginCodeFocusOut = function (event) {
        if (this.otherVariables['BusinessOriginDetailReq']) {
            setTimeout(function () {
                if (document.getElementById('BusinessOriginDetailCode'))
                    document.getElementById('BusinessOriginDetailCode').focus();
            }, 0);
        }
        else {
            setTimeout(function () {
                if (document.getElementById('ServiceSalesEmployee'))
                    document.getElementById('ServiceSalesEmployee').focus();
            }, 0);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onBusinessOriginCodeChange = function (event) {
        var _this = this;
        this.fetchServiceCoverPost('BusinessOriginHasChanged', { BusinessOriginCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode') }, {}).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (!data['errorMessage']) {
                    if (data && data['DetailRequiredInd'].toUpperCase() === 'Y') {
                        _this.setBusinessOriginDetailReq();
                    }
                    var lookupdata = [
                        {
                            'table': 'BusinessOrigin',
                            'query': { 'BusinessOriginCode': _this.riExchange.riInputElement.GetValue(_this.uiForm, 'BusinessOriginCode'), 'BusinessCode': _this.utils.getBusinessCode() },
                            'fields': ['BusinessOriginSystemDesc']
                        }
                    ];
                    _this.lookUpRecord(lookupdata, 100).subscribe(function (e) {
                        if (e['results'] && e['results'].length > 0) {
                            if (e['results'][0].length > 0) {
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDesc', e['results'][0][0].BusinessOriginSystemDesc);
                            }
                            else {
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginCode', '');
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDesc', '');
                            }
                        }
                        else {
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginCode', '');
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDesc', '');
                        }
                    }, function (error) {
                    });
                }
            }
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.onProductCodeChange = function (event) {
        var _this = this;
        if (this.otherVariables['boolPropertyCareInd'].toUpperCase() === 'Y' && this.otherVariables['boolUserWriteAccess'].toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.checkGuaranteeRequiredInd();
        }
        var data = [
            {
                'table': 'Product',
                'query': { 'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ProductDesc', 'WasteTransferRequired']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', e['results'][0][0].ProductDesc);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WasteTransferRequired', e['results'][0][0].WasteTransferRequired);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WasteTransferRequired', false);
                }
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WasteTransferRequired', false);
            }
        }, function (error) {
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.onChargeRateCodeChange = function (event) {
        var _this = this;
        var data = [
            {
                'table': 'ChargeRate',
                'query': { 'ChargeRateCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ChargeRateCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ChargeRateDesc']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ChargeRateDesc', e['results'][0][0].ChargeRateDesc);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ChargeRateDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ChargeRateCode', '');
                }
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ChargeRateDesc', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ChargeRateCode', '');
            }
        }, function (error) {
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.onTaxCodeChange = function (event) {
        var _this = this;
        var data = [
            {
                'table': 'TaxCode',
                'query': { 'TaxCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['TaxCodeDesc']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxCodeDesc', e['results'][0][0].TaxCodeDesc);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxCodeDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxCode', '');
                }
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxCodeDesc', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxCode', '');
            }
        }, function (error) {
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.onServiceTypeCodeChange = function (event) {
        var _this = this;
        var data = [
            {
                'table': 'ServiceType',
                'query': { 'ServiceTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ServiceTypeDesc']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeDesc', e['results'][0][0].ServiceTypeDesc);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeCode', '');
                }
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeDesc', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeCode', '');
            }
        }, function (error) {
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.onSalesEmployeeChange = function (event) {
        var _this = this;
        var data = [
            {
                'table': 'Employee',
                'query': { 'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', e['results'][0][0].EmployeeSurname);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeCode', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', '');
                }
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeCode', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', '');
            }
        }, function (error) {
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.onServiceBranchChange = function (event) {
        var _this = this;
        var data = [
            {
                'table': 'Branch',
                'query': { 'BranchNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchName']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', e['results'][0][0].BranchName);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchNumber', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', '');
                }
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchNumber', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', '');
            }
        }, function (error) {
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.onBranchServiceAreaCodeChange = function (event) {
        var _this = this;
        var data = [
            {
                'table': 'BranchServiceArea',
                'query': { 'BranchNumber': this.utils.getBranchCode(), 'BranchServiceAreaCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchServiceAreaDesc', 'EmployeeCode']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', e['results'][0][0].BranchServiceAreaDesc);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeCode', e['results'][0][0].EmployeeCode);
                    _this.fetchServiceEmployeeDesc();
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaCode', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeCode', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeSurname', '');
                }
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaCode', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeCode', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeSurname', '');
            }
        }, function (error) {
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.onViewOriginalChange = function (event) {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ViewOriginal')) {
            this.otherVariables['dlServiceCover'] = this.otherVariables['InitialdlMasterExtRef'];
        }
        else {
            this.otherVariables['dlServiceCover'] = this.riExchange.getParentHTMLValue('dlServiceCoverRowID') || this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'dlServiceCoverRowID');
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onGuaranteeRequiredChange = function (event) {
        this.guaranteeToggle();
    };
    DlServiceCoverMaintenanceComponent.prototype.onMaterialsValueChange = function (event) {
        this.setMaterialsDescRequired();
    };
    DlServiceCoverMaintenanceComponent.prototype.onAccessHireValueChange = function (event) {
        if (this.riExchange.riInputElement.isCorrect(this.uiForm, 'AccessHireValue')) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessHireValue') === null || this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessHireValue') === undefined) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessHireValue', '0');
            }
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onServiceAreaReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', data.BranchServiceAreaCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', data.BranchServiceAreaDesc);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onBusinessOriginDetailCodeReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDetailCode', data.BusinessOriginDetailCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDetailDesc', data.BusinessOriginDetailDesc);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onBusinessOriginCodeReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginCode', data.BusinessOriginCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDesc', data.BusinessOriginDesc);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onNoGuaranteeCodeReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NoGuaranteeCode', data.NoGuaranteeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NoGuaranteeDescription', data.NoGuaranteeDescription);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onProductCodeReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onEmployeeCodeReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceSalesEmployee', data.ServiceSalesEmployee || data.EmployeeCode || data.fullObject.EmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onServiceTypeReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeCode', data.ServiceTypeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', data.ServiceTypeDesc);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onTaxCodeReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCode', data.TaxCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxCodeDesc', data.TaxCodeDesc);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onCancel = function (event) {
        var _this = this;
        this.uiForm.setValue(this.formRawClone);
        this.fetchTranslationContent();
        this.fetchServiceCoverPost('Abandon', {}, { dlBatchRef: this.otherVariables['dlBatchRef'], dlServiceCoverRef: this.otherVariables['dlServiceCoverRef'], SubSystem: this.otherVariables['SubSystem'] || 'SalesOrder' }).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (!data['errorMessage']) {
                }
            }
        });
        this.formPristine();
    };
    DlServiceCoverMaintenanceComponent.prototype.onSave = function (event) {
        var result = this.beforeSave();
        if (result) {
            this.promptModal.show();
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onSaveKey = function (e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        var elemList = document.querySelectorAll('#tabCont .nav-tabs li:not(.hidden) a');
        var currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('#tabCont .nav-tabs li:not(.hidden) a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            elemList[currentSelectedIndex + 1]['click']();
            setTimeout(function () {
                var elem = document.querySelector('#tabCont .tab-content .tab-pane.active .ui-select-toggle, #tabCont .tab-content .tab-pane.active input:not([disabled]), #tabCont .tab-content .tab-pane.active select:not([disabled]), #tabCont .tab-content .tab-pane.active textarea:not([disabled])');
                if (elem) {
                    elem['focus']();
                }
            }, 0);
        }
        return;
    };
    DlServiceCoverMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        var obj = {};
        for (var i = 0; i < 14; i++) {
            obj['WindowStarth' + this.leftPad(i + 1)] = this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowStarth' + this.leftPad(i + 1));
            obj['WindowStartm' + this.leftPad(i + 1)] = this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowStartm' + this.leftPad(i + 1));
            obj['WindowEndh' + this.leftPad(i + 1)] = this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowEndh' + this.leftPad(i + 1));
            obj['WindowEndm' + this.leftPad(i + 1)] = this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowEndm' + this.leftPad(i + 1));
        }
        this.fetchServiceCoverPost('', { action: 2 }, Object.assign({}, obj, {
            dlServiceCoverROWID: this.otherVariables['dlServiceCover'],
            dlBatchRef: this.otherVariables['dlBatchRef'],
            dlRecordType: this.otherVariables['dlRecordType'],
            dlExtRef: this.otherVariables['dlExtRef'],
            dlMasterExtRef: this.otherVariables['dlMasterExtRef'],
            dlStatusCode: this.otherVariables['dlStatusCode'],
            dlStatusDesc: this.otherVariables['dlStatusDesc'],
            dlRejectionCode: this.otherVariables['dlRejectionCode'],
            dlRejectionDesc: this.otherVariables['dlRejectionDesc'],
            dlPremiseRef: this.otherVariables['dlPremiseRef'],
            dlServiceCoverRef: this.otherVariables['dlServiceCoverRef'],
            UpdateableInd: this.otherVariables['UpdateableInd'],
            ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            AccessHireValue: this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessHireValue'),
            BranchServiceAreaCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'),
            BusinessOriginCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'),
            BusinessOriginDetailCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDetailCode'),
            BusinessOriginDetailReq: this.otherVariables['BusinessOriginDetailReq'],
            ChargeRateCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ChargeRateCode'),
            ContractTypeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'),
            MaterialsDesc: this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsDesc'),
            MaterialsValue: this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsValue'),
            AnnualValueChange: this.riExchange.riInputElement.GetValue(this.uiForm, 'AnnualValueChange'),
            InitialValue: this.riExchange.riInputElement.GetValue(this.uiForm, 'InitialValue'),
            ServiceBranchNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'),
            ServiceCommenceDate: this.otherVariables['ServiceCommenceDate'],
            ServiceQuantityChange: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantityChange'),
            ServiceSalesEmployee: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee'),
            ServiceSpecialInstructions: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSpecialInstructions'),
            ServiceTypeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode'),
            ServiceVisitFrequency: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency'),
            SOServiceCoverNumber: this.otherVariables['SOServiceCoverNumber'],
            StandardTimeInd: this.otherVariables['StandardTimeInd'] ? 'yes' : 'no',
            StandardTreatmentTime: window['moment'].duration(this.riExchange.riInputElement.GetValue(this.uiForm, 'StandardTreatmentTime')).asSeconds(),
            TaxCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxCode'),
            TotalValue: this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalValue'),
            CalculatedDiscount: this.riExchange.riInputElement.GetValue(this.uiForm, 'CalculatedDiscount'),
            DiscountReason: this.riExchange.riInputElement.GetValue(this.uiForm, 'DiscountReason'),
            GuaranteeRequired: this.riExchange.riInputElement.GetValue(this.uiForm, 'GuaranteeRequired') ? 'yes' : 'no',
            NoGuaranteeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'NoGuaranteeCode'),
            NumberBedrooms: this.riExchange.riInputElement.GetValue(this.uiForm, 'NumberBedrooms'),
            AgeofProperty: this.riExchange.riInputElement.GetValue(this.uiForm, 'AgeofProperty'),
            ListedCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ListedCode'),
            DetailRequired: this.otherVariables['DetailRequired'],
            QuantityRequired: this.otherVariables['QuantityRequired'],
            InfoMessage: this.otherVariables['InfoMessage'],
            SubSystem: this.otherVariables['SubSystem']
        })).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data['errorMessage']) {
                    _this.errorService.emitError(data);
                }
                else {
                    _this.formRawClone = JSON.parse(JSON.stringify(_this.uiForm.getRawValue()));
                    _this.otherVariables['InfoMessage'] = data['InfoMessage'];
                }
                _this.formPristine();
                _this.afterSave();
            }
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.onPrepFilterKeyDown = function (event) {
        event = event || window.event;
        if (event.keyCode === 13) {
            this.loadGridViewB();
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onSDFilterKeyDown = function (event) {
        event = event || window.event;
        if (event.keyCode === 13) {
            this.loadGridViewA();
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.fetchDescriptions = function () {
        var _this = this;
        var data = [
            {
                'table': 'BusinessOrigin',
                'query': { 'BusinessOriginCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BusinessOriginSystemDesc']
            },
            {
                'table': 'ChargeRate',
                'query': { 'ChargeRateCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ChargeRateCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ChargeRateDesc']
            },
            {
                'table': 'TaxCode',
                'query': { 'TaxCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['TaxCodeDesc']
            },
            {
                'table': 'ServiceType',
                'query': { 'ServiceTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ServiceTypeDesc']
            },
            {
                'table': 'Employee',
                'query': { 'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Product',
                'query': { 'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ProductDesc', 'WasteTransferRequired']
            },
            {
                'table': 'Branch',
                'query': { 'BranchNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchName']
            },
            {
                'table': 'BranchServiceArea',
                'query': { 'BranchNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'), 'BranchServiceAreaCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchServiceAreaDesc', 'EmployeeCode']
            }
        ];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDesc', e['results'][0][0].BusinessOriginSystemDesc);
                }
                if (e['results'][1].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ChargeRateDesc', e['results'][1][0].ChargeRateDesc);
                }
                if (e['results'][2].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxCodeDesc', e['results'][2][0].TaxCodeDesc);
                }
                if (e['results'][3].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeDesc', e['results'][3][0].ServiceTypeDesc);
                }
                if (e['results'][4].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', e['results'][4][0].EmployeeSurname);
                }
                if (e['results'][5].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', e['results'][5][0].ProductDesc);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WasteTransferRequired', e['results'][5][0].WasteTransferRequired);
                }
                if (e['results'][6].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', e['results'][6][0].BranchName);
                }
                if (e['results'][7].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', e['results'][7][0].BranchServiceAreaDesc);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeCode', e['results'][7][0].EmployeeCode);
                    _this.fetchServiceEmployeeDesc();
                }
                _this.ellipsis['serviceArea']['inputParams']['ServiceBranchNumber'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ServiceBranchNumber');
                _this.ellipsis['serviceArea']['inputParams']['BranchName'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'BranchName');
            }
            _this.afterFetch();
        }, function (error) {
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.fetchServiceEmployeeDesc = function () {
        var _this = this;
        var data = [
            {
                'table': 'Employee',
                'query': { 'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceEmployeeCode'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeSurname', e['results'][0][0].EmployeeSurname);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeSurname', '');
                }
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeSurname', '');
            }
            _this.formRawClone = JSON.parse(JSON.stringify(_this.uiForm.getRawValue()));
        }, function (error) {
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.checkGuaranteeRequiredInd = function () {
        var _this = this;
        this.fetchServiceCoverPost('CheckGuaranteeRequiredInd', { ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') }, {}).subscribe(function (data) {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (!data['errorMessage']) {
                    if (data['GuaranteeRequiredInd'].toUpperCase() === 'Y') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GuaranteeRequired', true);
                        _this.guaranteeToggle();
                    }
                    else {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GuaranteeRequired', false);
                    }
                }
            }
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.disableTimeWindows = function () {
        for (var i = 0; i < 14; i++) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'WindowStarth' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Disable(this.uiForm, 'WindowStartm' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Disable(this.uiForm, 'WindowEndh' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Disable(this.uiForm, 'WindowEndm' + this.leftPad(i + 1));
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.enableTimeWindows = function () {
        for (var i = 0; i < 14; i++) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'WindowStarth' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Enable(this.uiForm, 'WindowStartm' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Enable(this.uiForm, 'WindowEndh' + this.leftPad(i + 1));
            this.riExchange.riInputElement.Enable(this.uiForm, 'WindowEndm' + this.leftPad(i + 1));
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.setTimeWindows = function () {
    };
    DlServiceCoverMaintenanceComponent.prototype.checkWindow = function () {
    };
    DlServiceCoverMaintenanceComponent.prototype.addHOptions = function () {
        var arr = [];
        for (var j = 0; j < 24; j++) {
            arr.push({
                text: this.leftPad(j),
                value: this.leftPad(j)
            });
        }
        for (var i = 0; i < 14; i++) {
            this.dropdownList['WindowStarth' + this.leftPad(i + 1)] = arr;
            this.dropdownList['WindowEndh' + this.leftPad(i + 1)] = arr;
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.addMOptions = function () {
        var arr = [];
        var i = 0;
        while (i < 60) {
            arr.push({
                text: this.leftPad(i),
                value: this.leftPad(i)
            });
            i = i + 15;
        }
        for (var j = 0; j < 14; j++) {
            this.dropdownList['WindowStartm' + this.leftPad(j + 1)] = arr;
            this.dropdownList['WindowEndm' + this.leftPad(j + 1)] = arr;
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.leftPad = function (n) {
        return n > 9 ? '' + n : '0' + n;
    };
    DlServiceCoverMaintenanceComponent.prototype.setDiscountReasonRequired = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DiscountReason', false);
        this.fieldRequired.DiscountReason = false;
        if (parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalValue'), 10) > parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'AnnualValueChange'), 10)) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DiscountReason', true);
            this.fieldRequired.DiscountReason = true;
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DiscountReason', false);
            this.fieldRequired.DiscountReason = false;
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.onChargeRateCodeReceived = function (obj) {
    };
    DlServiceCoverMaintenanceComponent.prototype.setMaterialsDescRequired = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MaterialsDesc', false);
        if (this.riExchange.riInputElement.isCorrect(this.uiForm, 'MaterialsValue')) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsValue') === null || this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsValue') === undefined) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'MaterialsValue', '0');
            }
            if (parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'MaterialsValue'), 10) > 0) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MaterialsDesc', true);
            }
            else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'MaterialsDesc', false);
            }
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.afterFetch = function () {
        if (!this.otherVariables['storeInitialRefs']) {
            this.otherVariables['InitialdlMasterExtRef'] = this.otherVariables['dlMasterExtRef'];
            if (this.otherVariables['InitialdlMasterExtRef'] === '') {
                this.fieldVisibility.tdViewOriginal = false;
            }
            else {
                this.fieldVisibility.tdViewOriginal = true;
            }
            this.otherVariables['storeInitialRefs'] = true;
        }
        this.setBusinessOriginDetailReq();
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AnnualValueChange', true);
        this.fieldRequired.AnnualValueChange = true;
        this.fieldVisibility.AnnualValueChange = true;
        if (this.otherVariables['QuantityRequired'] === true || this.otherVariables['QuantityRequired'].toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.fieldVisibility.ServiceQuantityChange = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantityChange', true);
            this.fieldRequired.ServiceQuantityChange = true;
        }
        else {
            this.fieldVisibility.ServiceQuantityChange = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantityChange', false);
            this.fieldRequired.ServiceQuantityChange = false;
        }
        if (this.otherVariables['DetailRequired'].toUpperCase() === GlobalConstant.Configuration.Yes || this.otherVariables['DetailRequired'].toUpperCase() === 'Y') {
            this.loadGridViewA();
        }
        if (this.syschars['vSCEnablePreps']) {
            this.loadGridViewB();
        }
        this.onBusinessOriginCodeChange({});
        this.setTimeWindows();
        this.otherVariables['blnCalcDiscountOnly'] = true;
        if (this.otherVariables['UpdateableInd'].toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.otherVariables['UpdateableIndBoolean'] = true;
        }
        else {
            this.otherVariables['UpdateableIndBoolean'] = false;
            this.uiForm.disable();
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.beforeUpdate = function () {
        this.setBusinessOriginDetailReq();
        this.riExchange.riInputElement.Disable(this.uiForm, 'ViewOriginal');
        this.otherVariables['blnCalcDiscountOnly'] = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.setTimeWindows();
        this.enableTimeWindows();
        if (this.otherVariables['QuantityRequired'] === true || this.otherVariables['QuantityRequired'].toString().toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.fieldRequired.ServiceQuantityChange = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantityChange', true);
        }
        else {
            this.fieldRequired.ServiceQuantityChange = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantityChange', false);
        }
        setTimeout(function () {
            if (document.getElementById('ServiceVisitFrequency'))
                document.getElementById('ServiceVisitFrequency').focus();
        }, 0);
    };
    DlServiceCoverMaintenanceComponent.prototype.beforeSave = function () {
        for (var i in this.uiForm.controls) {
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
    };
    DlServiceCoverMaintenanceComponent.prototype.afterSave = function () {
        this.riExchange.riInputElement.Enable(this.uiForm, 'ViewOriginal');
        if (this.otherVariables['InfoMessage']) {
            this.messageService.emitMessage({
                title: 'Message',
                msg: this.otherVariables['InfoMessage']
            });
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.setBusinessOriginDetailReq = function () {
        if (this.otherVariables['BusinessOriginDetailReq'] && this.otherVariables['BusinessOriginDetailReq'].toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.fieldVisibility.BusinessOriginDetailCode = true;
            this.fieldRequired.BusinessOriginDetailCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BusinessOriginDetailCode', true);
        }
        else {
            this.fieldVisibility.BusinessOriginDetailCode = false;
            this.fieldRequired.BusinessOriginDetailCode = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDetailCode', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BusinessOriginDetailCode', false);
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.postInit = function () {
        var _this = this;
        Observable.forkJoin(this.fetchServiceCoverPost('Request', { BranchNumber: this.utils.getBranchCode() }, {}), this.fetchServiceCoverGet('', { Mode: 'CheckBranchUserRights', action: '0' }), this.triggerFetchSysChar(), this.fetchServiceCoverPost('', { action: '0', dlServiceCoverROWID: this.riExchange.getParentHTMLValue('dlServiceCoverRowID') || this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'dlServiceCoverRowID') }, { SubSystem: this.otherVariables['SubSystem'] || 'SalesOrder' })).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data[0]['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (!data[0]['errorMessage']) {
                    _this.otherVariables['boolPropertyCareInd'] = data[0]['PropertyCareInd'];
                    if (data[0]['AllowUpdateInd'].toUpperCase() === 'N') {
                        _this.riExchange.riInputElement.Disable(_this.uiForm, 'GuaranteeRequired');
                    }
                }
            }
            if (data[1]['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data[1]['oResponse']);
            }
            else {
                if (!data[1]['errorMessage']) {
                    _this.otherVariables['boolUserWriteAccess'] = data[1]['WriteAccess'];
                    if (_this.otherVariables['boolPropertyCareInd'].toUpperCase() === 'Y' && _this.otherVariables['boolUserWriteAccess'].toUpperCase() === GlobalConstant.Configuration.Yes) {
                        _this.fieldVisibility.GuaranteeRequired = true;
                    }
                    else {
                        _this.fieldVisibility.GuaranteeRequired = false;
                    }
                }
            }
            if (data[2].errorMessage) {
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
                return false;
            }
            if (data[2].records && data[2].records.length > 0) {
                _this.syschars['vSCEnableInitialCharge'] = data[2].records[0].Required;
                _this.syschars['vSCEnablePreps'] = data[2].records[1].Required;
                if (_this.syschars['vSCEnableInitialCharge'] && _this.otherVariables['CurrentContractType'] === 'C') {
                    _this.fieldVisibility.InitialValue = true;
                }
            }
            if (data[3]['status'] === GlobalConstant.Configuration.Failure) {
                _this.errorService.emitError(data[3]['oResponse']);
            }
            else {
                if (!data[3]['errorMessage']) {
                    for (var i in data[3]) {
                        if (data[3].hasOwnProperty(i)) {
                            _this.otherVariables[i] = data[3][i];
                            if (_this.uiForm.controls[i] !== undefined && _this.uiForm.controls[i] !== null) {
                                _this.riExchange.riInputElement.SetValue(_this.uiForm, i, data[3][i].trim());
                                if (data[3][i].toUpperCase() === GlobalConstant.Configuration.Yes) {
                                    _this.riExchange.riInputElement.SetValue(_this.uiForm, i, true);
                                }
                                else if (data[3][i].toUpperCase() === GlobalConstant.Configuration.No) {
                                    _this.riExchange.riInputElement.SetValue(_this.uiForm, i, false);
                                }
                            }
                        }
                    }
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'StandardTreatmentTime', _this.utils.timeInHourMinutes(data[3]['StandardTreatmentTime']));
                }
            }
            _this.beforeUpdate();
            _this.checkGuaranteeRequiredInd();
            _this.buildTabs();
            _this.fetchDescriptions();
            _this.addHOptions();
            _this.addMOptions();
            _this.formRawClone = JSON.parse(JSON.stringify(_this.uiForm.getRawValue()));
            switch (_this.parentMode) {
                case 'ServiceCoverUpdate':
                    _this.otherVariables['dlServiceCover'] = _this.riExchange.getParentHTMLValue('dlServiceCoverRowID') || _this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'dlServiceCoverRowID');
                    _this.buildTabs();
                    _this.setDiscountReasonRequired();
                    _this.setMaterialsDescRequired();
                    break;
                default:
                    break;
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError({
                errorMessage: error['errorMessage'] || ErrorConstant.Message.UnexpectedError,
                fullError: error['fullError']
            });
            return;
        });
    };
    DlServiceCoverMaintenanceComponent.prototype.buildTabs = function () {
        this.uiDisplay.tab.tab1.visible = true;
        this.uiDisplay.tab.tab3.visible = true;
        if (this.otherVariables['DetailRequired'].toUpperCase() === GlobalConstant.Configuration.Yes || this.otherVariables['DetailRequired'].toUpperCase() === 'Y') {
            this.uiDisplay.tab.tab4.visible = true;
        }
        if (this.syschars['vSCEnablePreps']) {
            this.uiDisplay.tab.tab5.visible = true;
        }
        if (this.otherVariables['boolPropertyCareInd'].toUpperCase() === 'Y' && this.otherVariables['boolUserWriteAccess'].toUpperCase() === GlobalConstant.Configuration.Yes) {
            this.uiDisplay.tab.tab2.visible = true;
        }
        else {
            this.uiDisplay.tab.tab2.visible = false;
        }
        this.uiDisplay.tab.tab6.visible = true;
        this.uiDisplay.tab.tab7.visible = true;
    };
    DlServiceCoverMaintenanceComponent.prototype.fetchServiceCoverGet = function (functionName, params) {
        var queryServiceCover = new URLSearchParams();
        queryServiceCover.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryServiceCover.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryServiceCover.set(this.serviceConstants.Action, '6');
            queryServiceCover.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                queryServiceCover.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryServiceCover);
    };
    DlServiceCoverMaintenanceComponent.prototype.fetchServiceCoverPost = function (functionName, params, formData) {
        var queryServiceCover = new URLSearchParams();
        queryServiceCover.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryServiceCover.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryServiceCover.set(this.serviceConstants.Action, '6');
            formData['Function'] = functionName;
        }
        for (var key in params) {
            if (key) {
                queryServiceCover.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryServiceCover, formData);
    };
    DlServiceCoverMaintenanceComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableInitialCharge,
            this.sysCharConstants.SystemCharEnablePreps
        ];
        return sysCharList.join(',');
    };
    DlServiceCoverMaintenanceComponent.prototype.triggerFetchSysChar = function () {
        return this.fetchSysChar(this.sysCharParameters());
    };
    DlServiceCoverMaintenanceComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    DlServiceCoverMaintenanceComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    DlServiceCoverMaintenanceComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Advantage Service Cover Maintenance', null).subscribe(function (res) {
            if (res) {
                _this.titleService.setTitle(res);
            }
        });
        this.getTranslatedValue('Save', null).subscribe(function (res) {
            if (res) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Save', res);
            }
        });
        this.getTranslatedValue('Cancel', null).subscribe(function (res) {
            if (res) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Cancel', res);
            }
        });
        if (this.otherVariables['CurrentContractType'] === 'J') {
            this.getTranslatedValue('Agreed Value', null).subscribe(function (res) {
                if (res) {
                    _this.otherVariables['AnnualValueChangeLabel'] = res;
                }
            });
        }
        else {
            this.getTranslatedValue('Agreed Annual Value', null).subscribe(function (res) {
                if (res) {
                    _this.otherVariables['AnnualValueChangeLabel'] = res;
                }
            });
        }
    };
    DlServiceCoverMaintenanceComponent.prototype.canDeactivate = function () {
        this.routeAwayGlobals.setSaveEnabledFlag(this.uiForm.dirty);
        return this.routeAwayComponent.canDeactivate();
    };
    DlServiceCoverMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSdlServiceCoverMaintenance.html',
                    styles: ["\n\n      .screen-body {\n        min-height: 400px;\n      }\n\n  "]
                },] },
    ];
    DlServiceCoverMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: Title, },
    ];
    DlServiceCoverMaintenanceComponent.propDecorators = {
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'gridA': [{ type: ViewChild, args: ['gridA',] },],
        'gridB': [{ type: ViewChild, args: ['gridB',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return DlServiceCoverMaintenanceComponent;
}(BaseComponent));
