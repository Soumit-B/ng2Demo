var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { MessageService } from '../../../../shared/services/message.service';
import { ErrorService } from '../../../../shared/services/error.service';
import { EmployeeSearchComponent } from './../../search/iCABSBEmployeeSearch';
import { TaxcodeSearchComponent } from './../../search/iCABSSTaxCodeSearch';
import { BranchServiceAreaSearchComponent } from './../../search/iCABSBBranchServiceAreaSearch';
import { BusinessOriginLangSearchComponent } from './../../search/iCABSBBusinessOriginLanguageSearch';
export var ProductSalesSCDetailMntComponent = (function (_super) {
    __extends(ProductSalesSCDetailMntComponent, _super);
    function ProductSalesSCDetailMntComponent(injector) {
        _super.call(this, injector);
        this.xhrParams = {
            module: 'contract-admin',
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAProductSalesSCDetailMaintenance'
        };
        this.ContractObject = { type: '', label: '' };
        this.search = new URLSearchParams();
        this.isRequesting = false;
        this.invalidParentMode = false;
        this.saveAction = 0;
        this.blnDisplayOnFetch = false;
        this.FieldHideList = '';
        this.ReqDetail = true;
        this.ServiceCover = '';
        this.InactiveEffectDate = null;
        this.InstallationDate = null;
        this.DeliveryDate = null;
        this.PurchaseOrderExpiryDate = null;
        this.DepositDate = null;
        this.dirtyFlagPrompt = false;
        this.flagOpenPage = true;
        this.promptTitle = 'Confirm';
        this.promptContent = 'Confirm Record?';
        this.menuOptions = [];
        this.svcTypesOptions = [];
        this.busOriDtlLangOptions = [];
        this.ellipsis = {
            commissionEmp: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp-ServiceCoverCommissionEmployee',
                ContractTypeCode: this.ContractObject.type,
                showAddNew: true,
                component: EmployeeSearchComponent
            },
            taxcode: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'Lookup',
                currentContractType: this.ContractObject.type,
                showAddNew: true,
                component: TaxcodeSearchComponent
            },
            installationEmp: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp-InstallationEmployee',
                ContractTypeCode: this.ContractObject.type,
                showAddNew: true,
                component: EmployeeSearchComponent
            },
            deliveryEmp: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp-DeliveryEmployee',
                ContractTypeCode: this.ContractObject.type,
                showAddNew: true,
                component: EmployeeSearchComponent
            },
            svcArea: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp-SC',
                currentContractType: this.ContractObject.type,
                showAddNew: true,
                component: BranchServiceAreaSearchComponent
            },
            businessOri: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                parentMode: 'LookUp',
                currentContractType: this.ContractObject.type,
                showAddNew: true,
                component: BusinessOriginLangSearchComponent
            }
        };
        this.uiDisplay = {
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
        this.controls = [
            { name: 'menu', readonly: false, disabled: false, required: false, value: 'Options' },
            { name: 'ContractNumber', readonly: true, disabled: true, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'ContractCommenceDate', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'Status', readonly: true, disabled: true, required: false },
            { name: 'InactiveEffectdate', readonly: false, disabled: false, required: false },
            { name: 'ProductCode', readonly: true, disabled: true, required: false },
            { name: 'Productdesc', readonly: true, disabled: true, required: false },
            { name: 'ServiceBranchNumber', readonly: true, disabled: true, required: false },
            { name: 'BranchName', readonly: true, disabled: true, required: false },
            { name: 'ServiceQuantity', readonly: false, disabled: false, required: false },
            { name: 'InstallByBranchInd', readonly: false, disabled: false, required: false },
            { name: 'InstallationValue', readonly: false, disabled: false, required: false },
            { name: 'OutstandingInstallations', readonly: false, disabled: false, required: false },
            { name: 'DeliverByBranchInd', readonly: false, disabled: false, required: false },
            { name: 'DeliveryChargeValue', readonly: false, disabled: false, required: false },
            { name: 'OutstandingDeliveries', readonly: false, disabled: false, required: false },
            { name: 'ServiceAnnualValue', readonly: false, disabled: false, required: false },
            { name: 'DiscountInclRate', readonly: false, disabled: false, required: false },
            { name: 'MonthlyUnitPrice', readonly: false, disabled: false, required: false },
            { name: 'WorkLoadIndex', readonly: false, disabled: false, required: false },
            { name: 'WorkLoadIndexTotal', readonly: false, disabled: false, required: false },
            { name: 'DeliveryPartInvoiceInd', readonly: false, disabled: false, required: false },
            { name: 'InvoiceSuspendInd', readonly: false, disabled: false, required: false },
            { name: 'InvoiceSuspendText', readonly: false, disabled: false, required: false },
            { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: false, disabled: true, required: false },
            { name: 'TaxCode', readonly: false, disabled: false, required: false },
            { name: 'TaxCodeDesc', readonly: false, disabled: true, required: false },
            { name: 'TaxExemptionNumber', readonly: false, disabled: false, required: false },
            { name: 'BusinessOriginCode', readonly: false, disabled: false, required: false },
            { name: 'BusinessOriginDesc', readonly: false, disabled: true, required: false },
            { name: 'BusinessOriginDetailCode', readonly: false, disabled: false, required: false },
            { name: 'ServiceTypeCode', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaDesc', readonly: false, disabled: true, required: false },
            { name: 'ServiceEmployeeCode', readonly: true, disabled: true, required: false },
            { name: 'ServiceEmployeeDesc', readonly: false, disabled: true, required: false },
            { name: 'InstallationEmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'InstallationEmployeeName', readonly: false, disabled: false, required: false },
            { name: 'InstallationDate', readonly: false, disabled: false, required: false },
            { name: 'DeliveryEmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'DeliveryEmployeeName', readonly: false, disabled: false, required: false },
            { name: 'DeliveryDate', readonly: false, disabled: false, required: false },
            { name: 'PurchaseOrderNo', readonly: false, disabled: false, required: false },
            { name: 'PurchaseOrderExpiryDate', readonly: false, disabled: false, required: false },
            { name: 'ZeroValueIncInvoice', readonly: false, disabled: false, required: false },
            { name: 'DepositAmount', readonly: false, disabled: false, required: false },
            { name: 'DepositDate', readonly: false, disabled: false, required: false, value: '' },
            { name: 'DepositAmountApplied', readonly: false, disabled: false, required: false },
            { name: 'DepositPostedDate', readonly: true, disabled: false, required: false },
            { name: 'ServiceSpecialInstructions', readonly: false, disabled: false, required: false },
            { name: 'FieldHideList', readonly: false, disabled: false, required: false },
            { name: 'NewPremise', readonly: true, disabled: false, required: false },
            { name: 'JobSaleDeliveredQuantity', readonly: false, disabled: false, required: false },
            { name: 'DetailRequired', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessRequestNumber', readonly: false, disabled: false, required: false },
            { name: 'CancelledInd', readonly: false, disabled: false, required: false },
            { name: 'ErrorMessageDesc', readonly: true, disabled: false, required: false },
            { name: 'ContractTypeCode', readonly: true, disabled: false, required: false },
            { name: 'EnableValueUpdate', readonly: false, disabled: false, required: false },
            { name: 'EnableQuantityUpdate', readonly: false, disabled: false, required: false },
            { name: 'DetailRequiredInd', readonly: false, disabled: false, required: false },
            { name: 'SingleUnitPriceIT', readonly: false, disabled: false, required: false },
            { name: 'RequireExemptNumberInd', readonly: false, disabled: false, required: false },
            { name: 'SCNOtdelByBrnchInvPerDelDesc', readonly: false, disabled: false, required: false },
            { name: 'LocationsEnabled', readonly: false, disabled: false, required: false },
            { name: 'ValueRequiredInd', readonly: false, disabled: false, required: false },
            { name: 'LOSName', readonly: true, disabled: false, required: false },
            { name: 'DepositCanAmend', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSAPRODUCTSALESSCDETAILMAINTENANCE;
    }
    ProductSalesSCDetailMntComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.vBusinessCode = this.utils.getBusinessCode();
        this.pageTitle = this.uiDisplay.pageHeader;
        this.initForm();
        this.window_onload();
    };
    ProductSalesSCDetailMntComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this.subFetch) {
            this.subFetch.unsubscribe();
        }
        if (this.subLookup) {
            this.subLookup.unsubscribe();
        }
        if (this.subLookup0) {
            this.subLookup0.unsubscribe();
        }
        if (this.subLookup1) {
            this.subLookup1.unsubscribe();
        }
        if (this.subLookup2) {
            this.subLookup2.unsubscribe();
        }
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        if (this.translateSub) {
            this.translateSub.unsubscribe();
        }
        if (this.subRoute) {
            this.subRoute.unsubscribe();
        }
        if (this.subProductServiceType) {
            this.subProductServiceType.unsubscribe();
        }
        if (this.subTaxExemption) {
            this.subTaxExemption.unsubscribe();
        }
        if (this.subBusOriDtls) {
            this.subBusOriDtls.unsubscribe();
        }
        if (this.subCalcVals) {
            this.subCalcVals.unsubscribe();
        }
        if (this.subGetServiceDetails) {
            this.subGetServiceDetails.unsubscribe();
        }
        if (this.subDefaultEmployeeByServiceArea) {
            this.subDefaultEmployeeByServiceArea.unsubscribe();
        }
        if (this.subDefaultDeliveryEmployee) {
            this.subDefaultDeliveryEmployee.unsubscribe();
        }
        if (this.subDefaultInstallationEmployee) {
            this.subDefaultInstallationEmployee.unsubscribe();
        }
        if (this.subWarnValue) {
            this.subWarnValue.unsubscribe();
        }
        this.riExchange.killStore();
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    ProductSalesSCDetailMntComponent.prototype.window_onload = function () {
        this.ServiceCover = '';
        this.ContractObject.type = this.riExchange.getCurrentContractType();
        this.ContractObject.label = this.riExchange.getCurrentContractTypeLabel();
        this.URLparam = this.riExchange.getParentHTMLValue('currentContractTypeURLParameter');
        var strDocTitle = '^ 1 ^ Service Cover Maintenance';
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
        var parentMode = this.riExchange.getParentMode();
        if (parentMode === 'ProductSalesDelivery' || parentMode === 'ServiceAreaDetail' || parentMode === 'ServicePlanning') {
            this.blnOrdered = true;
        }
        else {
            this.riExchange.renderParentFields(this.formData, this.uiForm, 'ProductCode');
            this.riExchange.renderParentFields(this.formData, this.uiForm, 'ProductDesc');
            if (this.riExchange.getParentAttributeValue('Ordered') === 'yes') {
                this.blnOrdered = true;
            }
            else {
                this.blnOrdered = false;
            }
        }
        this.ServiceCover = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
        this.attributes.ServiceCoverRowID = this.ServiceCover;
        this.logger.log('ContractType', this.ContractObject.type, 'ServiceCover:', this.ServiceCover, 'ProductCode:', this.formData.ProductCode);
        this.doLookupformData();
        this.buildMenuOptions();
        if (this.blnOrdered) {
            this.riExchange.enableButton(this.uiDisplay.func, 'fetch');
        }
        else {
            this.riExchange.enableButton(this.uiDisplay.func, 'add');
            this.enableSaveMode();
        }
        this.getSysCharDtetails();
        this.logger.warn(this.ContractObject, '````', this.formData, 'this.ContractObject');
    };
    ProductSalesSCDetailMntComponent.prototype.initForm = function () {
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    ProductSalesSCDetailMntComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
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
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.vBusinessCode,
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.vSCEnableLocations = record[0].Logical;
            _this.vSCNationalAccountChecked = record[1].Required;
            _this.vSCRetainServiceWeekday = record[2].Required;
            _this.vSCEnableInvoiceByDelivery = record[3].Required;
            _this.vSCDefaultInvoicePerDelivery = record[4].Required;
            _this.vSCEnableInstallsRemovals = record[5].Logical;
            _this.vSCEnableWorkLoadIndex = record[6].Required;
            _this.vSCEnableMonthlyUnitPrice = record[7].Required;
            _this.vSCEnableDiscountUnitPrice = record[8].Required;
            _this.glSCPORefsAtServiceCover = record[9].Logical;
            _this.glSCNOTDelByBrnchInvPerDel = record[10].Required;
            _this.gcSCNOTDelByBrnchInvPerDel = record[10].Required;
            _this.vSCEnableProductServiceType = record[11].Required;
            _this.vEnableDepositProcessing = record[12].Required;
            if (!_this.glSCNOTDelByBrnchInvPerDel) {
                _this.gcSCNOTDelByBrnchInvPerDel = '';
            }
            _this.ReqPremiseLoc = _this.vSCEnableLocations;
            _this.NationalAccountChecked = _this.vSCNationalAccountChecked;
            _this.ReqRetainServiceWeekday = _this.vSCRetainServiceWeekday;
            _this.ReqPartInvoicing = _this.vSCEnableInvoiceByDelivery;
            _this.DefaultInvoicePerDelivery = _this.vSCDefaultInvoicePerDelivery;
            _this.vbEnableInstallsRemovals = _this.vSCEnableInstallsRemovals;
            _this.vbEnableWorkLoadIndex = _this.vSCEnableWorkLoadIndex;
            _this.vbEnableMonthlyUnitPrice = _this.vSCEnableMonthlyUnitPrice;
            _this.vbEnableDiscountUnitPrice = _this.vSCEnableDiscountUnitPrice;
            _this.cSCNOTDelByBrnchInvPerDel = _this.gcSCNOTDelByBrnchInvPerDel;
            _this.vbEnableProductServiceType = _this.vSCEnableProductServiceType;
            _this.vbEnableDepositProcessing = _this.vEnableDepositProcessing;
            _this.uiDisplay.trWorkLoadIndex = _this.vSCEnableWorkLoadIndex;
            _this.uiDisplay.trMonthlyUnitPrice = _this.vSCEnableMonthlyUnitPrice;
            _this.uiDisplay.trDiscountUnitPrice = _this.vSCEnableDiscountUnitPrice;
            if (!_this.vbEnableInstallsRemovals) {
                _this.uiDisplay.trInstallByBranch = false;
            }
            else {
                _this.uiDisplay.trInstallByBranch = true;
            }
            if (_this.glSCPORefsAtServiceCover) {
                _this.uiDisplay.trPurchaseOrderDetails = true;
            }
            if (_this.blnOrdered && _this.vbEnableProductServiceType) {
                _this.getProductServiceType();
            }
            if (_this.vbEnableProductServiceType) {
                _this.riExchange.riInputElement.Disable(_this.uiForm, 'ServiceTypeCode');
            }
            else {
                _this.riExchange.riInputElement.Enable(_this.uiForm, 'ServiceTypeCode');
            }
            if (_this.vbEnableDepositProcessing) {
                _this.uiDisplay.tab.tab2.visible = true;
            }
            _this.uiDisplay.tab.tab3.visible = true;
            _this.doFetch();
        });
    };
    ProductSalesSCDetailMntComponent.prototype.doLookupformData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'ContractNumber': this.riExchange.GetParentHTMLInputValue(this.formData, 'ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'ContractNumber': this.riExchange.GetParentHTMLInputValue(this.formData, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.GetParentHTMLInputValue(this.formData, 'PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'ProductCode': this.riExchange.GetParentHTMLInputValue(this.formData, 'ProductCode')
                },
                'fields': ['ProductDesc', 'LocationsEnabled', 'ValueRequiredInd']
            }
        ];
        this.subLookup0 = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var contract = data[0][0];
            if (contract) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', contract.ContractName);
            }
            var premise = data[1][0];
            if (premise) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', premise.PremiseName);
            }
            var product = data[2][0];
            if (product) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Productdesc', product.ProductDesc);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LocationsEnabled', product.LocationsEnabled);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ValueRequiredInd', product.ValueRequiredInd);
            }
            if (_this.ReqPremiseLoc && _this.riExchange.riInputElement.GetValue(_this.uiForm, 'LocationsEnabled')) {
                _this.ReqPremiseLoc = false;
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.doFetch = function () {
        var _this = this;
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '0');
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        search.set('ServiceCoverROWID', this.ServiceCover);
        this.subFetch = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            for (var i in data) {
                if (i !== '') {
                    var value = data[i];
                    if (value === 'yes' || value === 'no') {
                        value = (value === 'yes') ? true : false;
                    }
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, i, value);
                }
            }
            if (data.hasOwnProperty('FieldHideList')) {
                _this.FieldHideList = data.FieldHideList;
            }
            _this.doLookupUiParams();
            _this.taxExemptionDisplay();
            _this.riMaintenance_AfterFetch();
            setTimeout(_this.enableSaveMode(), 3000);
        });
    };
    ProductSalesSCDetailMntComponent.prototype.enableSaveMode = function () {
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        if (!this.blnOrdered) {
            this.add();
            this.saveAction = 1;
        }
        else {
            this.update();
            this.saveAction = 2;
        }
        if (this.ServiceQuantity)
            this.ServiceQuantity.nativeElement.focus();
        this.riExchange.enableButton(this.uiDisplay.func, 'save');
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceQuantity', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceAnnualValue', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceSalesEmployee', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TaxCode', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BusinessOriginCode', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceTypeCode', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', true);
    };
    ProductSalesSCDetailMntComponent.prototype.doLookupUiParams = function (type) {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'BranchNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber')
                },
                'fields': ['BranchName']
            },
            {
                'table': 'BranchServiceArea',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'BranchServiceAreaCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode')
                },
                'fields': ['BranchServiceAreaDesc']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallationEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliveryEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            }
        ];
        var lookupIP2 = [
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
                    'BusinessOriginCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessOriginDesc']
            },
            {
                'table': 'BusinessOriginDetailLang',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessOriginCode', 'BusinessOriginDetailCode', 'BusinessOriginDetailDesc']
            },
            {
                'table': 'BusinessOrigin',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'BusinessOriginCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode')
                },
                'fields': ['DetailRequiredInd']
            },
            {
                'table': 'TaxCode',
                'query': {
                    'TaxCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxCode')
                },
                'fields': ['TaxCodeDesc']
            }
        ];
        this.subLookup1 = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            _this.logger.log('subLookup1', data);
            var branch = data[0][0];
            if (branch) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', branch.BranchName);
            }
            var branchSvcAreaDesc = data[1][0];
            if (branchSvcAreaDesc) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', branchSvcAreaDesc.BranchServiceAreaDesc);
            }
            else {
                if (type === 4)
                    _this.showAlert('Record Not Found');
            }
            var employee = data[2][0];
            if (employee) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EmployeeSurname', employee.EmployeeSurname);
            }
            else {
                if (type === 1)
                    _this.showAlert('Record Not Found');
            }
            var instEmployee = data[3][0];
            if (instEmployee) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InstallationEmployeeName', instEmployee.EmployeeSurname);
            }
            var deliveryEmployee = data[4][0];
            if (deliveryEmployee) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DeliveryEmployeeName', deliveryEmployee.EmployeeSurname);
            }
            var svcEmployee = data[5][0];
            if (svcEmployee) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeDesc', svcEmployee.EmployeeSurname);
            }
            else {
                if (type === 5)
                    _this.showAlert('Record Not Found');
            }
        });
        this.subLookup2 = this.LookUp.lookUpRecord(lookupIP2).subscribe(function (data) {
            _this.logger.log('subLookup2', data);
            var svcTypeDescArr = data[0];
            if (svcTypeDescArr) {
                _this.svcTypesOptions = svcTypeDescArr;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeCode', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ServiceTypeCode'));
            }
            var busOriLang = data[1][0];
            if (busOriLang) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDesc', busOriLang.BusinessOriginDesc);
            }
            var busOriDtlLangArr = data[2];
            if (busOriDtlLangArr) {
                _this.busOriDtlLangOptions = busOriDtlLangArr;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDetailCode', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'BusinessOriginDetailCode'));
            }
            var busOri = data[3][0];
            if (busOri) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DetailRequiredInd', busOri.DetailRequiredInd);
            }
            else {
                if (type === 3)
                    _this.showAlert('Record Not Found');
            }
            var tax = data[4][0];
            if (tax) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxCodeDesc', tax.TaxCodeDesc);
            }
            else {
                if (type === 2)
                    _this.showAlert('Record Not Found');
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.riMaintenance_AfterFetch = function () {
        this.uiDisplay.label.tdLineOfService = this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSName');
        this.SavedServiceQuantity = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity'), 10);
        this.SavedBranchServiceAreaCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ValueRequiredInd')) {
            this.uiDisplay.trZeroValueIncInvoice = true;
        }
        else {
            this.uiDisplay.trZeroValueIncInvoice = false;
        }
        if (this.FieldHideList.indexOf('InstallationValue') >= 0) {
            this.uiDisplay.InstallationValue = false;
            this.uiDisplay.tdInstallationValuelabel = false;
            this.uiDisplay.tdInstallByBranchInd = false;
            this.uiDisplay.tdInstallByBranchIndLabel = false;
        }
        else {
            this.uiDisplay.InstallationValue = true;
            this.uiDisplay.tdInstallationValuelabel = true;
            this.uiDisplay.tdInstallByBranchInd = true;
            this.uiDisplay.tdInstallByBranchIndLabel = true;
        }
        if (this.FieldHideList.indexOf('OutstandingInstallations') >= 0 ||
            parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'OutstandingInstallations'), 10) === 0) {
            this.uiDisplay.tdOutstandingInstallationslabel = false;
            this.uiDisplay.OutstandingInstallations = false;
        }
        else {
            this.uiDisplay.tdOutstandingInstallationslabel = true;
            this.uiDisplay.OutstandingInstallations = true;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'InactiveEffectDate') !== '') {
            this.uiDisplay.labelInactiveEffectDate = true;
            this.uiDisplay.InactiveEffectDate = true;
        }
        else {
            this.uiDisplay.labelInactiveEffectDate = false;
            this.uiDisplay.InactiveEffectDate = false;
        }
        this.blnDisplayOnFetch = true;
        this.InstallByBranchInd_onclick();
        this.blnDisplayOnFetch = false;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CancelledInd') === 'yes') {
            this.riExchange.enableButton(this.uiDisplay.func, 'Add');
        }
        else {
            this.riExchange.enableButton(this.uiDisplay.func, 'Update');
        }
        if (this.ReqPremiseLoc && this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallByBranchInd')) {
            this.blnLocationsAllowed = true;
        }
        else {
            this.blnLocationsAllowed = false;
        }
        if (this.ReqPartInvoicing) {
            this.uiDisplay.trPartInvoicing = true;
        }
        else {
            this.uiDisplay.trPartInvoicing = false;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDetailCode') !== '') {
            this.uiDisplay.trBusinessOriginDetailCode = true;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'DepositCanAmend') !== 'Y') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'DepositDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'DepositAmount');
        }
    };
    ProductSalesSCDetailMntComponent.prototype.getProductServiceType = function () {
        var _this = this;
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetProductServiceType');
        search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.subProductServiceType = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            if (data.hasOwnProperty('ServiceTypeCode')) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceTypeCode', data.ServiceTypeCode);
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.taxExemptionDisplay = function () {
        var _this = this;
        var taxCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxCode');
        if (taxCode !== null && taxCode !== '') {
            var search = new URLSearchParams();
            search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set(this.serviceConstants.Action, '6');
            search.set('Function', 'GetRequireExemptNumberInd');
            search.set('TaxCodeForExemptionInd', taxCode);
            this.subTaxExemption = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
                if (data.hasOwnProperty('RequireExemptNumberInd')) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RequireExemptNumberInd', (data.RequireExemptNumberInd === 'yes') ? true : false);
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'RequireExemptNumberInd')) {
                        _this.uiDisplay.TaxExemptionNumberLabel = true;
                        _this.uiDisplay.TaxExemptionNumber = true;
                    }
                    if (_this.uiDisplay.func.add || _this.uiDisplay.func.update) {
                        _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'TaxExemptionNumber', true);
                        if (_this.TaxExemptionNumber)
                            _this.TaxExemptionNumber.nativeElement.focus();
                    }
                }
                else {
                    _this.uiDisplay.TaxExemptionNumberLabel = false;
                    _this.uiDisplay.TaxExemptionNumber = false;
                    if (_this.uiDisplay.func.add || _this.uiDisplay.func.update) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TaxExemptionNumber', '');
                        _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'TaxExemptionNumber', false);
                    }
                }
            });
        }
        else {
            this.uiDisplay.TaxExemptionNumberLabel = false;
            this.uiDisplay.TaxExemptionNumber = false;
            if (this.uiDisplay.func.add || this.uiDisplay.func.update) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TaxExemptionNumber', '');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TaxExemptionNumber', false);
            }
        }
    };
    ProductSalesSCDetailMntComponent.prototype.buildMenuOptions = function () {
        var objPortfolioGroup = [{ value: 'TelesalesOrderLine', label: 'Telesales Order Line' }];
        var objHistoryGroup = [
            { value: 'History', label: 'Service Cover History' },
            { value: 'EventHistory', label: 'Event History' },
            { value: 'ServiceValue', label: 'Service Value' }
        ];
        var objInvoicingGroup = [
            { value: 'ProRata', label: 'Pro Rata Charge' },
            { value: 'InvoiceHistory', label: 'Invoice History' }
        ];
        var objServiceGroup = [
            { value: 'PlanVisit', label: 'Planned Visits' },
            { value: 'VisitHistory', label: 'Visit History' },
            { value: 'ServiceDetail', label: 'Service Detail' },
            { value: 'Location', label: 'Location' }
        ];
        if (this.ReqDetail) {
            objServiceGroup.splice(2, 1);
        }
        var objCustomerGroup = [
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
    };
    ProductSalesSCDetailMntComponent.prototype.menu_onchange = function (menuSelected) {
        var pageObj = {
            self: this,
            fb: this.uiForm.value
        };
        this.riExchange.initBridge(pageObj);
        if (typeof this.ServiceCover === 'undefined' || this.ServiceCover === '') {
            this.flagOpenPage = false;
        }
        var menu = this.riExchange.riInputElement.GetValue(this.uiForm, 'menu');
        if (this.flagOpenPage) {
            switch (menu) {
                case 'ContactManagement':
                    this.cmdContactManagement_onclick();
                    break;
                case 'ServiceValue':
                    this.cmdServiceValue_onclick();
                    break;
                case 'VisitHistory':
                    this.cmdVisitHistory_onclick();
                    break;
                case 'History':
                    this.cmdHistory_onclick();
                    break;
                case 'ServiceDetail':
                    this.cmdServiceDetail_onclick();
                    break;
                case 'Location':
                    this.cmdLocation_onclick();
                    break;
                case 'PlanVisit':
                    this.cmdPlanVisit_onclick();
                    break;
                case 'ProRata':
                    this.cmdProRata_onclick();
                    break;
                case 'InvoiceHistory':
                    this.cmdInvoiceHistory_onclick();
                    break;
                case 'EventHistory':
                    this.cmdEventHistory_onclick();
                    break;
                case 'CustomerInformation':
                    this.cmdCustomerInformation_onclick();
                    break;
                case 'TelesalesOrderLine':
                    this.cmdTelesalesOrderLine_onclick();
                    break;
            }
        }
        else {
            this.showAlert('Request Restricted, Return To Normal Mode First');
        }
    };
    ProductSalesSCDetailMntComponent.prototype.cmdCustomerInformation_onclick = function () {
        this.router.navigate(['grid/maintenance/contract/customerinformation'], {
            queryParams: {
                parentMode: 'ServiceCover',
                CurrentContractTypeURLParameter: this.ContractObject.type
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.cmdTelesalesOrderLine_onclick = function () {
        this.showAlert('ServiceCoverTeleSalesOrderLine.htm - Page not covered in current sprint');
    };
    ProductSalesSCDetailMntComponent.prototype.cmdContactManagement_onclick = function () {
        this.router.navigate(['/ccm/contact/search'], {
            queryParams: {
                parentMode: 'ServiceCover',
                CurrentContractTypeURLParameter: this.ContractObject.type
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.cmdHistory_onclick = function () {
        this.router.navigate(['grid/application/contract/history'], {
            queryParams: {
                parentMode: 'ServiceCover',
                CurrentContractTypeURLParameter: this.ContractObject.type,
                ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                ProductDesc: this.riExchange.riInputElement.GetValue(this.uiForm, 'Productdesc'),
                ServiceCoverRowID: this.ServiceCover
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.cmdServiceValue_onclick = function () {
        this.router.navigate(['/grid/contractmanagement/account/serviceValue'], {
            queryParams: {
                ParentMode: 'ServiceCoverAll',
                CurrentContractTypeURLParameter: this.ContractObject.type
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.cmdLocation_onclick = function () {
        if (!this.blnLocationsAllowed) {
            this.showAlert('Function Not Available');
        }
        else {
            this.router.navigate(['grid/application/premiseLocationAllocation'], {
                queryParams: {
                    parentMode: 'Premise-Allocate',
                    CurrentContractTypeURLParameter: this.formData.currentContractType,
                    'ServiceCoverRowID': this.ServiceCover,
                    'ContractTypeCode': this.pageParams.CurrentContractType,
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                }
            });
        }
    };
    ProductSalesSCDetailMntComponent.prototype.cmdVisitHistory_onclick = function () {
        this.showAlert('iCABSSeServiceVisitSearch.htm - Page not covered in current sprint');
    };
    ProductSalesSCDetailMntComponent.prototype.cmdServiceDetail_onclick = function () {
        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'DetailRequired')) {
            this.showAlert('Function Not Available');
        }
        else {
            this.showAlert('iCABSAServiceDetailSearch.htm - Page not covered in current sprint');
        }
    };
    ProductSalesSCDetailMntComponent.prototype.cmdPlanVisit_onclick = function () {
        if (this.flagOpenPage) {
            this.router.navigate(['/grid/application/contract/planVisitGridYear'], {
                queryParams: {
                    parentMode: 'ServiceCover',
                    ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                    CurrentContractTypeURLParameter: this.URLparam
                }
            });
        }
        else {
            this.showAlert('Request Restricted, Return To Normal Mode First');
        }
    };
    ProductSalesSCDetailMntComponent.prototype.cmdProRata_onclick = function () {
        if (this.flagOpenPage) {
            this.router.navigate(['grid/application/proRatacharge/summary'], {
                queryParams: {
                    parentMode: 'ServiceCover',
                    parentPage: 'iCABSAProductSalesSCDetailMaintenance',
                    currentContractType: this.ContractObject.type,
                    ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                    PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                    ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                    ProductDesc: this.riExchange.riInputElement.GetValue(this.uiForm, 'Productdesc'),
                    ServiceCoverRowID: this.ServiceCover,
                    ServiceCommenceDate: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractCommenceDate')
                }
            });
        }
        else {
            this.showAlert('Request Restricted, Return To Normal Mode First');
        }
    };
    ProductSalesSCDetailMntComponent.prototype.cmdInvoiceHistory_onclick = function () {
        this.router.navigate(['/billtocash/contract/invoice'], {
            queryParams: {
                parentMode: 'Product',
                CurrentContractTypeURLParameter: this.ContractObject.type
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.cmdEventHistory_onclick = function () {
        this.router.navigate(['grid/contactmanagement/customercontactHistorygrid'], {
            queryParams: {
                parentMode: 'ServiceCover',
                CurrentContractTypeURLParameter: this.formData.currentContractType
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.renderTab = function (tabindex) {
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
    };
    ProductSalesSCDetailMntComponent.prototype.showAlert = function (msgTxt, type) {
        var titleModal = '';
        if (typeof type === 'undefined')
            type = 0;
        switch (type) {
            default:
            case 0:
                titleModal = 'Error Message';
                break;
            case 1:
                titleModal = 'Success Message';
                break;
            case 2:
                titleModal = 'Warning Message';
                break;
        }
        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    };
    ProductSalesSCDetailMntComponent.prototype.selectedInactiveEffectDate = function (obj) {
        this.logger.log('InactiveEffectDate', obj.value);
        this.InactiveEffectDate = obj.value;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InactiveEffectDate', this.InactiveEffectDate);
    };
    ProductSalesSCDetailMntComponent.prototype.selectedInstallationDate = function (obj) {
        this.logger.log('InstallationDate', obj.value);
        this.InstallationDate = obj.value;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InstallationDate', this.InstallationDate);
    };
    ProductSalesSCDetailMntComponent.prototype.selectedDeliveryDate = function (obj) {
        this.logger.log('DeliveryDate', obj.value);
        this.DeliveryDate = obj.value;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DeliveryDate', this.DeliveryDate);
    };
    ProductSalesSCDetailMntComponent.prototype.selectedPurchaseOrderExpiryDate = function (obj) {
        this.logger.log('spanPurchaseOrderExpiryDate', obj.value);
        this.PurchaseOrderExpiryDate = obj.value;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PurchaseOrderExpiryDate', this.PurchaseOrderExpiryDate);
    };
    ProductSalesSCDetailMntComponent.prototype.selectedDepositDate = function (obj) {
        this.logger.log('DepositDate', obj.value);
        this.DepositDate = obj.value;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DepositDate', this.DepositDate);
    };
    ProductSalesSCDetailMntComponent.prototype.update = function () {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.riMaintenance_BeforeUpdate();
        this.riExchange_CBORequest();
        this.riMaintenance_BeforeUpdateMode();
    };
    ProductSalesSCDetailMntComponent.prototype.riMaintenance_BeforeUpdate = function () {
        this.renderTab(1);
    };
    ProductSalesSCDetailMntComponent.prototype.riMaintenance_BeforeUpdateMode = function () {
        this.blnQuantityChanged = false;
        this.uiDisplay.trInstallationEmployee = false;
        this.uiDisplay.trDeliveryEmployee = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'InstallationEmployeeCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryEmployeeCode');
        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'EnableValueUpdate')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceAnnualValue');
        }
        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'EnableQuantityUpdate')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceQuantity');
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'InstallationValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingDeliveries');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InstallByBranchInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'DeliverByBranchInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceSuspendInd');
        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliverByBranchInd')) {
            if (this.cSCNOTDelByBrnchInvPerDel === '') {
                this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryPartInvoiceInd');
            }
        }
        console.log('BUG---', 'BranchNumber', parseInt(this.riExchange.ClientSideValues.Fetch('BranchNumber'), 10), this.utils.getBranchCode(), 'ServiceBranchNumber', parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'), 10));
        if (parseInt(this.utils.getBranchCode(), 10) !== parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'), 10)) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceSalesEmployee');
            if (this.TaxCode)
                this.TaxCode.nativeElement.focus();
        }
        else {
            if (this.ServiceSalesEmployee)
                this.ServiceSalesEmployee.nativeElement.focus();
        }
        this.InstallByBranchInd_onclick();
        this.DeliverByBranchInd_onclick();
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EnableQuantityUpdate')) {
            if (this.ServiceQuantity)
                this.ServiceQuantity.nativeElement.focus();
        }
    };
    ProductSalesSCDetailMntComponent.prototype.riExchange_CBORequest = function () {
        var _this = this;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode') !== '') {
            var search0 = new URLSearchParams();
            search0.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
            search0.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search0.set(this.serviceConstants.Action, '6');
            var formData = {};
            formData['Function'] = 'GetBusinessOrigin';
            formData['BusinessOriginCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode');
            this.subBusOriDtls = this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search0, formData).subscribe(function (data) {
                if (data.hasOwnProperty('DetailRequiredInd')) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DetailRequiredInd', (data.DetailRequiredInd === 'yes') ? true : false);
                }
                if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'DetailRequiredInd')) {
                    _this.uiDisplay.trBusinessOriginDetailCode = true;
                    _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'BusinessOriginDetailCode', true);
                }
                else {
                    _this.uiDisplay.trBusinessOriginDetailCode = false;
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDetailCode', '');
                    _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'BusinessOriginDetailCode', false);
                }
            });
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'BranchServiceAreaCode') &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode') !== '') {
            var search = new URLSearchParams();
            search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set(this.serviceConstants.Action, '6');
            search.set('Function', 'DefaultEmployeeByServiceArea');
            search.set('ServiceBranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'));
            search.set('BranchServiceAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'));
            this.subDefaultEmployeeByServiceArea = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
                if (data.hasOwnProperty('ServiceEmployeeCode'))
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeCode', data.ServiceEmployeeCode);
                if (data.hasOwnProperty('ServiceEmployeeDesc'))
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeDesc', data.ServiceEmployeeDesc);
                if (data.hasOwnProperty('BranchServiceAreaDesc'))
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', data.BranchServiceAreaDesc);
            });
        }
        if ((this.riExchange.riInputElement.HasChanged(this.uiForm, 'BranchServiceAreaCode') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'OutstandingDeliveries')) &&
            (this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliverByBranchInd'))) {
            var OutstandingDeliveries = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'OutstandingDeliveries'), 10);
            var JobSaleDeliveredQuantity = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'JobSaleDeliveredQuantity'), 10);
            var ServiceQuantity = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity'), 10);
            if (isNaN(OutstandingDeliveries)) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'OutstandingDeliveries', '0');
            }
            if (isNaN(JobSaleDeliveredQuantity)) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'JobSaleDeliveredQuantity', '0');
            }
            if (!isNaN(ServiceQuantity) && !isNaN(OutstandingDeliveries)) {
                if (OutstandingDeliveries < ServiceQuantity) {
                    var search1 = new URLSearchParams();
                    search1.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
                    search1.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                    search1.set(this.serviceConstants.Action, '6');
                    search1.set('Function', 'DefaultDeliveryEmployee');
                    search1.set('ServiceBranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'));
                    search1.set('BranchServiceAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'));
                    this.subDefaultDeliveryEmployee = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search1).subscribe(function (data) {
                        if (data.hasOwnProperty('DeliveryEmployeeCode'))
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DeliveryEmployeeCode', data.DeliveryEmployeeCode);
                        if (data.hasOwnProperty('DeliveryEmployeeName'))
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DeliveryEmployeeName', data.DeliveryEmployeeName);
                        _this.uiDisplay.trDeliveryEmployee = true;
                        _this.riExchange.riInputElement.Enable(_this.uiForm, 'DeliveryEmployeeCode');
                    });
                }
                else {
                    this.uiDisplay.trDeliveryEmployee = false;
                    this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryEmployeeCode');
                }
            }
        }
        if ((this.riExchange.riInputElement.HasChanged(this.uiForm, 'BranchServiceAreaCode') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'OutstandingDeliveries')) &&
            (this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallByBranchInd'))) {
            var OutstandingInstallations = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'OutstandingInstallations'), 10);
            var ServiceQuantity = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity'), 10);
            if (!isNaN(OutstandingInstallations)) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'OutstandingInstallations', '0');
            }
            if (OutstandingInstallations < ServiceQuantity) {
                var search2 = new URLSearchParams();
                search2.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
                search2.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                search2.set(this.serviceConstants.Action, '6');
                search2.set('Function', 'DefaultInstallationEmployee');
                search2.set('ServiceBranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'));
                search2.set('BranchServiceAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'));
                this.subDefaultInstallationEmployee = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search2).subscribe(function (data) {
                    if (data.hasOwnProperty('InstallationEmployeeCode'))
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InstallationEmployeeCode', data.InstallationEmployeeCode);
                    if (data.hasOwnProperty('InstallationEmployeeName'))
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InstallationEmployeeName', data.InstallationEmployeeName);
                    _this.uiDisplay.trInstallationEmployee = true;
                    _this.riExchange.riInputElement.Enable(_this.uiForm, 'InstallationEmployeeCode');
                });
            }
            else {
                this.uiDisplay.trInstallationEmployee = false;
                this.riExchange.riInputElement.Disable(this.uiForm, 'InstallationEmployeeCode');
            }
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity') ||
            this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceAnnualValue')) {
            var vbQty = 1;
            var vbFreq = 1;
            var vbVal = 0;
            var MonthlyUnitPrice = 0;
            if (this.vbEnableMonthlyUnitPrice && (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAnnualValue') !== '')) {
                var ServiceQuantity = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity'), 10);
                if (ServiceQuantity !== 0 && ServiceQuantity !== null) {
                    vbQty = ServiceQuantity;
                }
                else {
                    vbQty = 1;
                    vbVal = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAnnualValue'), 10);
                    MonthlyUnitPrice = (vbVal / vbQty / vbFreq);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'MonthlyUnitPrice', MonthlyUnitPrice);
                }
            }
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'TaxCode')) {
                this.taxExemptionDisplay();
            }
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ProductCode') && this.uiDisplay.func.add && this.vbEnableProductServiceType) {
                this.getProductServiceType();
            }
        }
    };
    ProductSalesSCDetailMntComponent.prototype.add = function () {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.riMaintenance_BeforeAddMode();
    };
    ProductSalesSCDetailMntComponent.prototype.riMaintenance_BeforeAddMode = function () {
        var _this = this;
        this.SavedServiceQuantity = 0;
        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.trInstallationEmployee = false;
        this.uiDisplay.trDeliveryEmployee = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DeliverByBranchInd', true);
        this.riExchange.riInputElement.Disable(this.uiForm, 'InstallationEmployeeCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryEmployeeCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceSuspendInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceSuspendText');
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'GetServiceDetails');
        search.set('ContractTypeCode', this.ContractObject.type);
        search.set('contractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        search.set('premiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        search.set('productCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.subGetServiceDetails = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                if (data.errorMessage.trim() !== '') {
                    _this.showAlert(data.errorMessage, 2);
                }
            }
            for (var i in data) {
                if (i !== '') {
                    var value = data[i];
                    if (value === 'yes' || value === 'no') {
                        value = (value === 'yes') ? true : false;
                    }
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, i, value);
                }
            }
            if (data.hasOwnProperty('FieldHideList')) {
                _this.FieldHideList = data.FieldHideList;
            }
            _this.SavedBranchServiceAreaCode = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'BranchServiceAreaCode');
            _this.uiDisplay.label.tdLineOfService = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'LOSName');
            if (_this.FieldHideList.indexOf('InstallationValue') >= 0) {
                _this.uiDisplay.InstallationValue = false;
                _this.uiDisplay.tdInstallationValuelabel = false;
                _this.uiDisplay.tdInstallByBranchInd = false;
                _this.uiDisplay.tdInstallByBranchIndLabel = false;
            }
            else {
                _this.uiDisplay.InstallationValue = true;
                _this.uiDisplay.tdInstallationValuelabel = true;
                _this.uiDisplay.tdInstallByBranchInd = true;
                _this.uiDisplay.tdInstallByBranchIndLabel = true;
            }
            _this.InstallByBranchInd_onclick();
            if (_this.ReqPartInvoicing) {
                _this.uiDisplay.trPartInvoicing = true;
                if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'DeliverByBranchInd')) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DeliveryPartInvoiceInd', _this.DefaultInvoicePerDelivery);
                }
                if (_this.cSCNOTDelByBrnchInvPerDel === '') {
                    _this.riExchange.riInputElement.Enable(_this.uiForm, 'DeliveryPartInvoiceInd');
                }
            }
            else {
                _this.uiDisplay.trPartInvoicing = false;
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractTypeCode', _this.ContractObject.type);
            if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'ValueRequiredInd')) {
                _this.uiDisplay.trZeroValueIncInvoice = true;
            }
            else {
                _this.uiDisplay.trZeroValueIncInvoice = false;
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.save = function (flag) {
        var _this = this;
        this.logger.log('SAVE', this.saveAction, flag, this.uiForm.status);
        if (this.uiForm.status === 'VALID') {
            this.routeAwayGlobals.setSaveEnabledFlag(false);
            if (typeof flag !== 'undefined' && flag === true) {
                if (this.dirtyFlagPrompt === true) {
                    this.dirtyFlagPrompt = false;
                    this.promptModal.show();
                }
            }
            else {
                var search = new URLSearchParams();
                search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
                search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                search.set(this.serviceConstants.Action, '6');
                search.set(this.serviceConstants.Function, 'WarnValue');
                search.set('ServiceAnnualValue', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAnnualValue'));
                search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
                this.subWarnValue = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
                    _this.dirtyFlagPrompt = true;
                    if (data.hasOwnProperty('ErrorMessageDesc')) {
                        if (data.ErrorMessageDesc.trim() !== '') {
                            _this.showAlert(data.ErrorMessageDesc, 2);
                        }
                        else {
                            _this.save(true);
                        }
                    }
                });
            }
        }
    };
    ProductSalesSCDetailMntComponent.prototype.promptSave = function (event) {
        this.riMaintenance_BeforeSave();
    };
    ProductSalesSCDetailMntComponent.prototype.riMaintenance_BeforeSave = function () {
        this.ServiceAnnualValue_onchange();
    };
    ProductSalesSCDetailMntComponent.prototype.ServiceAnnualValue_onchange = function () {
        var _this = this;
        if (this.saveAction === 1) {
            this.blnDisplayOnFetch = true;
            this.InstallByBranchInd_onclick();
            this.DeliverByBranchInd_onclick();
        }
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, this.saveAction.toString());
        var formData = {};
        formData['Function'] = 'WarnValue';
        if (this.saveAction === 2) {
            formData['ServiceCoverROWID'] = this.ServiceCover;
        }
        formData['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        formData['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        formData['ProductCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        formData['ServiceBranchNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber');
        formData['ServiceQuantity'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity');
        formData['InstallByBranchInd'] = this.utils.convertCheckboxValueToRequestValue(this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallByBranchInd'));
        formData['InstallationValue'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallationValue');
        formData['DeliverByBranchInd'] = this.utils.convertCheckboxValueToRequestValue(this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliverByBranchInd'));
        formData['DeliveryPartInvoiceInd'] = this.utils.convertCheckboxValueToRequestValue(this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliveryPartInvoiceInd'));
        formData['InvoiceSuspendInd'] = this.utils.convertCheckboxValueToRequestValue(this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceSuspendInd'));
        formData['InvoiceSuspendText'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceSuspendText');
        formData['ServiceSalesEmployee'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee');
        formData['PurchaseOrderNo'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PurchaseOrderNo');
        formData['PurchaseOrderExpiryDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PurchaseOrderExpiryDate');
        formData['TaxCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxCode');
        formData['BusinessOriginCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode');
        formData['BusinessOriginDetailCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDetailCode');
        formData['ServiceTypeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode');
        formData['BranchServiceAreaCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode');
        formData['InstallationEmployeeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallationEmployeeCode');
        formData['InstallationDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallationDate');
        formData['DeliveryEmployeeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliveryEmployeeCode');
        formData['DeliveryDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliveryDate');
        formData['ServiceSpecialInstructions'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSpecialInstructions');
        formData['OutstandingInstallations'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OutstandingInstallations');
        formData['WorkLoadIndex'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'WorkLoadIndex');
        formData['TaxExemptionNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TaxExemptionNumber');
        formData['ZeroValueIncInvoice'] = this.utils.convertCheckboxValueToRequestValue(this.riExchange.riInputElement.GetValue(this.uiForm, 'ZeroValueIncInvoice'));
        formData['ContractTypeCode'] = this.ContractObject.type;
        formData['OutstandingDeliveries'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OutstandingDeliveries');
        formData['NewPremise'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'NewPremise');
        formData['DetailRequired'] = this.utils.convertCheckboxValueToRequestValue(this.riExchange.riInputElement.GetValue(this.uiForm, 'DetailRequired'));
        formData['ServiceEmployeeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceEmployeeCode');
        formData['ServiceAnnualValue'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAnnualValue');
        formData['DeliveryChargeValue'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliveryChargeValue');
        formData['ErrorMessageDesc'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ErrorMessageDesc');
        formData['SingleUnitPriceIT'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SingleUnitPriceIT');
        formData['DiscountInclRate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'DiscountInclRate');
        formData['LOSName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSName');
        formData['DepositAmount'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'DepositAmount');
        formData['DepositDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'DepositDate');
        formData['DepositAmountApplied'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'DepositAmountApplied');
        formData['DepositPostedDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'DepositPostedDate');
        formData['DepositCanAmend'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'DepositCanAmend');
        this.subWarnValue = this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).subscribe(function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                if (data.errorMessage !== '') {
                    _this.showAlert(data.errorMessage);
                }
            }
            else {
                _this.riMaintenance_AfterSave();
            }
        });
    };
    ProductSalesSCDetailMntComponent.prototype.riMaintenance_AfterSave = function () {
        var ServiceCoverRowID = '';
        var parentMode = this.riExchange.getParentMode();
        this.attributes.ServiceCoverRowID = this.ServiceCover;
        if (parentMode === 'Premise-Add') {
            this.attributes.ServiceCoverAdded = 'yes';
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'DetailRequiredInd')) {
            this.showAlert('iCABSAServiceCoverDetailMaintenance.htm - Not covered in current sprint');
        }
        else if (this.ReqPremiseLoc &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallByBranchInd') &&
            (this.blnQuantityChanged || this.uiDisplay.func.add)) {
            this.showAlert('iCABSAPremiseLocationAllocationGrid.htm - Not covered in current sprint');
        }
        else {
            this.router.navigate(['grid/contractmanagement/maintenance/productSalesSCEntryGrid']);
        }
    };
    ProductSalesSCDetailMntComponent.prototype.cancel = function () {
        this.riMaintenance_AfterAbandon();
    };
    ProductSalesSCDetailMntComponent.prototype.riMaintenance_AfterAbandon = function () {
        this.router.navigate(['grid/contractmanagement/maintenance/productSalesSCEntryGrid']);
    };
    ProductSalesSCDetailMntComponent.prototype.DeliverByBranchInd_onclick = function () {
        this.logger.log('DeliverByBranchInd_onclick:', this.riExchange.riInputElement.isDisabled(this.uiForm, 'DeliverByBranchInd'), this.blnDisplayOnFetch, this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliverByBranchInd'), this.ReqPartInvoicing, this.cSCNOTDelByBrnchInvPerDel);
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'DeliverByBranchInd') && !this.blnOrdered) {
            this.logger.log('B1');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliverByBranchInd')) {
                this.logger.log('B2');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InstallByBranchInd', false);
                this.InstallByBranchInd_onclick();
                this.uiDisplay.tdOutstandingDeliveries = false;
                this.uiDisplay.OutstandingDeliveries = false;
                if (this.ReqPartInvoicing) {
                    this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryPartInvoiceInd');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'DeliveryPartInvoiceInd', this.riExchange.riInputElement.GetValue(this.uiForm, 'DefaultInvoicePerDelivery'));
                    this.DeliveryPartInvoiceInd_OnClick();
                }
            }
            else {
                this.uiDisplay.tdOutstandingDeliveries = true;
                this.uiDisplay.OutstandingDeliveries = true;
                this.uiDisplay.trDeliveryEmployee = false;
                if (this.ReqPartInvoicing) {
                    if (this.cSCNOTDelByBrnchInvPerDel === '') {
                        this.riExchange.riInputElement.Enable(this.uiForm, 'DeliveryPartInvoiceInd');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'DeliveryPartInvoiceInd', true);
                    }
                    else {
                        this.DeliveryPartInvoiceInd_OnClick();
                    }
                }
            }
        }
    };
    ProductSalesSCDetailMntComponent.prototype.DeliveryPartInvoiceInd_OnClick = function () {
        var _this = this;
        if (this.cSCNOTDelByBrnchInvPerDel !== '') {
            if (this.uiDisplay.func.add) {
                if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliverByBranchInd')) {
                    if (this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliveryPartInvoiceInd')) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', this.cSCNOTDelByBrnchInvPerDel);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'SCNOTDelByBrnchInvPerDelDesc'));
                    }
                    else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', this.SavedBranchServiceAreaCode);
                    }
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', this.SavedBranchServiceAreaCode);
                }
                var search = new URLSearchParams();
                search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
                search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                search.set(this.serviceConstants.Action, '6');
                search.set('Function', 'DefaultEmployeeByServiceArea');
                search.set('ServiceBranchNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'));
                search.set('BranchServiceAreaCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'));
                this.subDefaultEmployeeByServiceArea = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
                    if (data.hasOwnProperty('ServiceEmployeeCode'))
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeCode', data.ServiceEmployeeCode);
                    if (data.hasOwnProperty('ServiceEmployeeDesc'))
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceEmployeeDesc', data.ServiceEmployeeDesc);
                    if (data.hasOwnProperty('BranchServiceAreaDesc'))
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchServiceAreaDesc', data.BranchServiceAreaDesc);
                });
            }
        }
    };
    ProductSalesSCDetailMntComponent.prototype.InstallByBranchInd_onclick = function () {
        this.logger.log('InstallByBranchInd_onclick:', this.riExchange.riInputElement.isDisabled(this.uiForm, 'InstallByBranchInd'), this.blnDisplayOnFetch, this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallByBranchInd'), this.FieldHideList.indexOf('OutstandingInstallations'), this.ReqPremiseLoc);
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'InstallByBranchInd') || this.blnDisplayOnFetch) {
            this.logger.log('A1');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallByBranchInd')) {
                this.logger.log('A2');
                if (this.FieldHideList.indexOf('OutstandingInstallations') >= 0) {
                    this.uiDisplay.tdOutstandingInstallationslabel = false;
                    this.uiDisplay.OutstandingInstallations = false;
                }
                else {
                    this.uiDisplay.tdOutstandingInstallationslabel = true;
                    this.uiDisplay.OutstandingInstallations = true;
                }
                this.riExchange.riInputElement.SetValue(this.uiForm, 'OutstandingInstallations', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DeliverByBranchInd', false);
                this.DeliverByBranchInd_onclick();
                if (this.ReqPremiseLoc) {
                    this.blnLocationsAllowed = true;
                }
                if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'InstallByBranchInd')) {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'OutstandingInstallations');
                }
            }
            else {
                this.uiDisplay.OutstandingInstallations = false;
                this.uiDisplay.tdOutstandingInstallationslabel = false;
                this.blnLocationsAllowed = false;
                if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'InstallByBranchInd')) {
                    this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
                }
                this.uiDisplay.trInstallationEmployee = false;
            }
        }
    };
    ProductSalesSCDetailMntComponent.prototype.ServiceQuantity_onChange = function (obj) {
        var _this = this;
        var svcQuantity = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity'), 10);
        var savedSvcQuantity = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'SavedServiceQuantity'), 10);
        if (svcQuantity === savedSvcQuantity) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingDeliveries');
            this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
        }
        else {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallByBranchInd')) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'OutstandingInstallations');
                this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingDeliveries');
            }
            else {
                this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliverByBranchInd')) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'OutstandingDeliveries');
                this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingInstallations');
            }
            else {
                this.riExchange.riInputElement.Disable(this.uiForm, 'OutstandingDeliveries');
            }
        }
        if (this.uiDisplay.func.update) {
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity')) {
                this.blnQuantityChanged = true;
            }
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceQuantity')) {
            this.logger.log('riExchange_CBORequest D1');
            var search5 = new URLSearchParams();
            search5.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
            search5.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search5.set(this.serviceConstants.Action, '6');
            search5.set('Function', 'CalculateValues');
            search5.set('ContractTypeCode', this.ContractObject.type);
            if (this.uiDisplay.func.update) {
                search5.set('ServiceCoverRowID', this.ServiceCover);
            }
            search5.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
            search5.set('ServiceQuantity', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity'));
            search5.set('ServiceAnnualValue', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAnnualValue'));
            search5.set('DeliverByBranchInd', this.utils.convertCheckboxValueToRequestValue(this.riExchange.riInputElement.GetValue(this.uiForm, 'DeliverByBranchInd')));
            search5.set('InstallByBranchInd', this.utils.convertCheckboxValueToRequestValue(this.riExchange.riInputElement.GetValue(this.uiForm, 'InstallByBranchInd')));
            search5.set('OutstandingInstallations', this.riExchange.riInputElement.GetValue(this.uiForm, 'OutstandingInstallations'));
            this.subCalcVals = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search5).subscribe(function (data) {
                _this.logger.log('riExchange_CBORequest D2');
                _this.logger.log('calculateValues:', data);
                if (data.hasOwnProperty('ServiceAnnualValue')) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceAnnualValue', data.ServiceAnnualValue);
                }
                if (data.hasOwnProperty('InstallationValue')) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InstallationValue', data.InstallationValue);
                }
                if (data.hasOwnProperty('OutstandingInstallations')) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OutstandingInstallations', data.OutstandingInstallations);
                }
                if (data.hasOwnProperty('OutstandingDeliveries')) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OutstandingDeliveries', data.OutstandingDeliveries);
                }
            });
            if (this.vbEnableWorkLoadIndex) {
                var svcQuantity_1 = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity'), 10);
                var workLoad = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'WorkLoadIndex'), 10);
                if (svcQuantity_1 !== 0) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'WorkLoadIndexTotal', (workLoad * svcQuantity_1));
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'WorkLoadIndexTotal', workLoad);
                }
            }
        }
    };
    ProductSalesSCDetailMntComponent.prototype.ProductCode_onkeydown = function (obj) { };
    ProductSalesSCDetailMntComponent.prototype.ProductCode_onChange = function (obj) {
        if (this.uiDisplay.func.add && this.vbEnableProductServiceType) {
            this.getProductServiceType();
        }
    };
    ProductSalesSCDetailMntComponent.prototype.productCodeSelection = function () {
        if (this.uiDisplay.func.add) {
            if (this.vbEnableProductServiceType) {
                this.getProductServiceType();
            }
        }
        else {
        }
    };
    ProductSalesSCDetailMntComponent.prototype.TaxCode_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.taxcodeLP.openModal();
        }
    };
    ProductSalesSCDetailMntComponent.prototype.taxcodeSelection = function (obj) {
        this.logger.log('taxcodeSelection', obj);
    };
    ProductSalesSCDetailMntComponent.prototype.ServiceSalesEmployee_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.ellipsis.commissionEmp.parentMode = 'Lookup-ServiceCoverCommissionEmployee';
            this.ellipsis.commissionEmp.ContractTypeCode = this.ContractObject.type;
            this.commissionEmp.openModal();
        }
    };
    ProductSalesSCDetailMntComponent.prototype.commissionEmpSelection = function (obj) {
        this.logger.log('commissionEmpSelection', obj);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceSalesEmployee', obj.ServiceSalesEmployee);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', obj.EmployeeSurname);
    };
    ProductSalesSCDetailMntComponent.prototype.InstallationEmployeeCode_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.ellipsis.installationEmp.parentMode = 'LookUp-InstallationEmployee';
            this.ellipsis.installationEmp.ContractTypeCode = this.ContractObject.type;
            this.installationEmp.openModal();
        }
    };
    ProductSalesSCDetailMntComponent.prototype.installationEmpSelection = function (obj) {
        this.logger.log('installationEmpSelection', obj);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InstallationEmployeeCode', obj.ServiceSalesEmployee);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InstallationEmployeeName', obj.EmployeeSurname);
    };
    ProductSalesSCDetailMntComponent.prototype.DeliveryEmployeeCode_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.ellipsis.deliveryEmp.parentMode = 'LookUp-DeliveryEmployee';
            this.ellipsis.deliveryEmp.ContractTypeCode = this.ContractObject.type;
            this.deliveryEmp.openModal();
        }
    };
    ProductSalesSCDetailMntComponent.prototype.deliveryEmpSelection = function (obj) {
        this.logger.log('deliveryEmpSelection', obj);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DeliveryEmployeeCode', obj.ServiceSalesEmployee);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DeliveryEmployeeName', obj.EmployeeSurname);
    };
    ProductSalesSCDetailMntComponent.prototype.BranchServiceAreaCode_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.ellipsis.svcArea.parentMode = 'LookUp-SC';
            this.ellipsis.svcArea.currentContractType = this.ContractObject.type;
            this.svcArea.openModal();
        }
    };
    ProductSalesSCDetailMntComponent.prototype.svcAreaSelection = function (obj) {
        this.logger.log('svcAreaSelection', obj);
    };
    ProductSalesSCDetailMntComponent.prototype.BusinessOriginCode_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.ellipsis.businessOri.parentMode = 'LookUp';
            this.ellipsis.businessOri.currentContractType = this.ContractObject.type;
            this.businessOri.openModal();
        }
    };
    ProductSalesSCDetailMntComponent.prototype.businessOriginSelection = function (obj) {
        this.logger.log('businessOriginSelection', obj);
    };
    ProductSalesSCDetailMntComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ProductSalesSCDetailMntComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAProductSalesSCDetailMaintenance.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    ProductSalesSCDetailMntComponent.ctorParameters = [
        { type: Injector, },
    ];
    ProductSalesSCDetailMntComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'TaxExemptionNumber': [{ type: ViewChild, args: ['TaxExemptionNumber',] },],
        'ServiceSalesEmployee': [{ type: ViewChild, args: ['ServiceSalesEmployee',] },],
        'TaxCode': [{ type: ViewChild, args: ['TaxCode',] },],
        'taxcodeLP': [{ type: ViewChild, args: ['taxcodeLP',] },],
        'ServiceQuantity': [{ type: ViewChild, args: ['ServiceQuantity',] },],
        'commissionEmp': [{ type: ViewChild, args: ['commissionEmp',] },],
        'installationEmp': [{ type: ViewChild, args: ['installationEmp',] },],
        'deliveryEmp': [{ type: ViewChild, args: ['deliveryEmp',] },],
        'svcArea': [{ type: ViewChild, args: ['svcArea',] },],
        'businessOri': [{ type: ViewChild, args: ['businessOri',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return ProductSalesSCDetailMntComponent;
}(BaseComponent));
