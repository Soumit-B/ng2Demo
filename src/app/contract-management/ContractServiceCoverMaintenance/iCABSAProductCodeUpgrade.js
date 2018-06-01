var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { RouteAwayGlobals } from './../../../shared/services/route-away-global.service';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, Renderer } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var ProductCodeUpgradeComponent = (function (_super) {
    __extends(ProductCodeUpgradeComponent, _super);
    function ProductCodeUpgradeComponent(injector, routeAwayGlobals, rendrer) {
        _super.call(this, injector);
        this.routeAwayGlobals = routeAwayGlobals;
        this.rendrer = rendrer;
        this.effectiveDateWarningsShown = false;
        this.showBusinessOriginDetailCode = false;
        this.businessOriginDetailCodeRequired = false;
        this.showLeadEmployee = false;
        this.leadEmployeeRequired = false;
        this.recordFound = false;
        this.loadPreviousData = false;
        this.cNumber = '';
        this.cName = '';
        this.pNumber = '';
        this.pName = '';
        this.pCode = '';
        this.pDesc = '';
        this.ellipsisConfig = {
            contract: {
                disabled: false,
                showHeader: true,
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'Search',
                    'currentContractType': 'C',
                    'showAddNew': false
                },
                component: ContractSearchComponent
            },
            premise: {
                disabled: false,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'Search',
                    'ContractNumber': '',
                    'ContractName': '',
                    'showAddNew': false
                },
                component: PremiseSearchComponent
            },
            product: {
                disabled: false,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'Search',
                    'ContractNumber': '',
                    'PremiseNumber': '',
                    'ContractName': '',
                    'PremiseName': '',
                    'ProductCode': '',
                    'ProductDesc': ''
                },
                component: ServiceCoverSearchComponent
            },
            newProduct: {
                disabled: true,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-SalesGroup'
                },
                component: ScreenNotReadyComponent
            },
            businessOrigin: {
                disabled: true,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': false
                },
                component: ScreenNotReadyComponent
            },
            businessOriginDetail: {
                disabled: true,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'showAddNew': false
                },
                component: ScreenNotReadyComponent
            },
            leadEmployee: {
                disabled: true,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-LeadEmployee',
                    'showAddNew': false
                },
                component: EmployeeSearchComponent
            },
            lostBusiness: {
                disabled: true,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'showAddNew': false
                },
                component: ScreenNotReadyComponent
            },
            lostBusinessDetail: {
                disabled: true,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-LostBusinessDetail',
                    'showAddNew': false
                },
                component: ScreenNotReadyComponent
            },
            serviceSalesEmployee: {
                disabled: true,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-ServiceCoverCommissionEmployee',
                    'showAddNew': false
                },
                component: EmployeeSearchComponent
            }
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.headerParams = {
            method: 'contract-management/maintenance',
            module: 'contract-admin',
            operation: 'Application/iCABSAProductCodeUpgrade'
        };
        this.queryParams = new URLSearchParams();
        this.pageMode = 'N';
        this.fieldData = {};
        this.effective_date = null;
        this.effectiveDateDisabled = true;
        this.uiDisplay = {
            tab: {
                tab1: { visible: true, active: true },
                tab2: { visible: true, active: false },
                tab3: { visible: true, active: false },
                tab4: { visible: true, active: false }
            }
        };
        this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber' },
            { name: 'ContractName', disabled: true },
            { name: 'PremiseNumber', required: true },
            { name: 'PremiseName', disabled: true },
            { name: 'ProductCode', required: true },
            { name: 'ProductDesc', disabled: true },
            { name: 'PortfolioStatusDesc', disabled: true },
            { name: 'InvoiceAnnivDate', disabled: true },
            { name: 'InvoiceFrequencyCode', disabled: true },
            { name: 'InvoiceFrequencyDesc', disabled: true },
            { name: 'ServiceVisitFrequency', disabled: true },
            { name: 'ServiceVisitAnnivDate', disabled: true },
            { name: 'ServiceQuantity', disabled: true },
            { name: 'ServiceVisitFrequency', disabled: true },
            { name: 'ServiceCommenceDate', disabled: true },
            { name: 'NewProductCode', disabled: true, required: true },
            { name: 'NewProductDesc', disabled: true },
            { name: 'EffectiveDate', disabled: true },
            { name: 'ServiceAnnualValue', disabled: true },
            { name: 'PriceChangeValue', disabled: true },
            { name: 'NewAnnualValue', disabled: true },
            { name: 'BusinessOriginCode', disabled: true, required: true },
            { name: 'BusinessOriginDesc', disabled: true },
            { name: 'BusinessOriginDetailCode', disabled: true },
            { name: 'BusinessOriginDetailDesc', disabled: true },
            { name: 'LeadEmployee', disabled: true },
            { name: 'LeadEmployeeSurname', disabled: true },
            { name: 'LostBusinessCode', disabled: true, required: true },
            { name: 'LostBusinessDesc', disabled: true },
            { name: 'LostBusinessDetailCode', disabled: true, required: true },
            { name: 'LostBusinessDetailDesc', disabled: true },
            { name: 'ServiceSalesEmployee', disabled: true, required: true },
            { name: 'ServiceSalesEmployeeName', disabled: true },
            { name: 'ServiceSpecialInstructions', disabled: true },
            { name: 'ServiceCoverNumber' },
            { name: 'ProductSaleGroupCode' },
            { name: 'ErrorMessageDesc' },
            { name: 'LanguageCode', disabled: true },
            { name: 'Seasonal', disabled: true },
            { name: 'NewServiceCoverNumber' },
            { name: 'NewServiceCoverRowID' },
            { name: 'ServiceCoverWasteReq' },
            { name: 'ServiceCoverWasteCopied' },
            { name: 'DetailRequiredInd', disabled: true },
            { name: 'LeadInd', disabled: true }
        ];
        this.pageId = PageIdentifier.ICABSAPRODUCTCODEUPGRADE;
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
    }
    ProductCodeUpgradeComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    ProductCodeUpgradeComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.formChangeSubscribe = this.uiForm.statusChanges.subscribe(function (value) {
            if (_this.uiForm.dirty) {
                _this.setFormMode(_this.c_s_MODE_UPDATE);
            }
            else {
                _this.setFormMode(_this.c_s_MODE_SELECT);
            }
        });
    };
    ProductCodeUpgradeComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.formChangeSubscribe.unsubscribe();
    };
    ProductCodeUpgradeComponent.prototype.ngAfterViewInit = function () {
        if (this.formData['ContractNumber'] && this.formData['PremiseNumber'] && this.formData['ProductCode']) {
            this.populateUIFromFormData();
            this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.formData['ContractNumber'];
            this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.formData['ContractName'];
            this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.formData['ContractNumber'];
            this.ellipsisConfig.product.childConfigParams['ContractName'] = this.formData['ContractName'];
            this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.formData['PremiseNumber'];
            this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.formData['PremiseName'];
            this.recordFound = true;
            this.pageMode = 'U';
            this.loadPreviousData = true;
            this.updateFieldStatus();
        }
        else {
            this.ellipsisConfig.contract.autoOpen = true;
        }
        this.showGridSeasonal = false;
        this.pageParams.contractType = this.utils.getCurrentContractType('<contract>');
    };
    ProductCodeUpgradeComponent.prototype.onContractChange = function () {
        if (this.cNumber !== this.getControlValue('ContractNumber')) {
            this.cName = '';
            this.cNumber = '';
            if (this.getControlValue('ContractNumber') !== '') {
                var paddedValue = this.utils.numberPadding(this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 8);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', paddedValue);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = paddedValue;
                this.ellipsisConfig.product.childConfigParams['ContractNumber'] = paddedValue;
                this.ellipsisConfig.premise.childConfigParams['ContractName'] = '';
                this.ellipsisConfig.product.childConfigParams['ContractName'] = '';
                this.cNumber = paddedValue;
            }
            else {
                this.setControlValue('ContractNumber', '');
            }
            this.setControlValue('ContractName', '');
            this.resetFields('contract');
        }
    };
    ProductCodeUpgradeComponent.prototype.premiseOnChange = function () {
        if (this.pNumber !== this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) {
            this.pName = '';
            this.pNumber = '';
            if (this.getControlValue('PremiseNumber') !== '') {
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = '';
                this.ellipsisConfig.product.childConfigParams['PremiseName'] = '';
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                this.pNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
            }
            else {
                this.setControlValue('PremiseNumber', '');
            }
            this.resetFields('premise');
        }
    };
    ProductCodeUpgradeComponent.prototype.productCodeOnChange = function () {
        var _this = this;
        this.recordFound = false;
        this.pageMode = 'N';
        this.cbbService.disableComponent(true);
        var productCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        if (productCode !== '') {
            this.queryParams.set('businessCode', this.utils.getBusinessCode());
            this.queryParams.set('countryCode', this.utils.getCountryCode());
            this.queryParams.set('action', '6');
            var bodyParams = {
                'Function': 'GetServiceCoverRowID',
                'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    _this.errorModal.show(data, true);
                    return;
                }
                if (data.ServiceCoverNumber === '-1') {
                    _this.ellipsisConfig.product.childConfigParams.ContractNumber = _this.getControlValue('ContractNumber');
                    _this.ellipsisConfig.product.childConfigParams.PremiseNumber = _this.getControlValue('PremiseNumber');
                    _this.ellipsisConfig.product.childConfigParams['ProductCode'] = _this.getControlValue('ProductCode');
                    _this.productCodeSearch();
                }
                else {
                    _this.attributes.ServiceCoverRowID = data.ServiceCoverRowID;
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverNumber', data.ServiceCoverNumber);
                    _this.populateFields();
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.logger.log('Error =>', error);
                _this.errorModal.show(error.info, true);
                return;
            });
        }
    };
    ProductCodeUpgradeComponent.prototype.populateFields = function () {
        var _this = this;
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '0');
        var bodyParams = {
            'Function': 'CheckFields',
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ServiceCoverRowID': this.attributes.ServiceCoverRowID
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.recordFound = true;
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginCode', data.BusinessOriginCode);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDesc', data.BusinessOriginDesc);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NewAnnualValue', _this.utils.cCur(data.NewAnnualValue));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PortfolioStatusDesc', data.PortfolioStatusDesc);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PriceChangeValue', _this.utils.cCur(data.PriceChangeValue));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Seasonal', data.Seasonal);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceAnnualValue', _this.utils.cCur(data.ServiceAnnualValue));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCommenceDate', data.ServiceCommenceDate);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceQuantity', data.ServiceQuantity);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceSalesEmployee', data.ServiceSalesEmployee);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceSpecialInstructions', data.ServiceSpecialInstructions);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitAnnivDate', data.ServiceVisitAnnivDate);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', data.ServiceVisitFrequency);
            _this.fetchProductDetails();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error => ', error);
        });
    };
    ProductCodeUpgradeComponent.prototype.fetchProductDetails = function () {
        var _this = this;
        var lookUp = [{
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName', 'InvoiceAnnivDate', 'InvoiceFrequencyCode']
            }, {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseName']
            }, {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
                },
                'fields': ['ProductDesc', 'ProductSaleGroupCode']
            }, {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode,
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }, {
                'table': 'LostBusinessLang',
                'query': {
                    'BusinessCode': this.businessCode,
                    'LanguageCode': this.riExchange.LanguageCode,
                    'LostBusinessCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessCode')
                },
                'fields': ['LostBusinessDesc']
            }, {
                'table': 'LostBusinessDetailLang',
                'query': {
                    'BusinessCode': this.businessCode,
                    'LanguageCode': this.riExchange.LanguageCode,
                    'LostBusinessCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessCode'),
                    'LostBusinessDetailCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode')
                },
                'fields': ['LostBusinessDetailDesc']
            }];
        if (this.pageMode === 'U') {
            lookUp[2] = {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'NewProductCode')
                },
                'fields': ['ProductDesc']
            };
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(lookUp).subscribe(function (data) {
            var contractDetails = data[0][0];
            var premiseDetails = data[1][0];
            var productDetails = data[2][0];
            var employeeDetails = data[3][0];
            var lostBusinessLangDetails = data[4][0];
            var lostBusinessDetailLangDetails = data[5][0];
            var canUpdate;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (contractDetails) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', contractDetails.ContractName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceAnnivDate', _this.utils.formatDate(contractDetails.InvoiceAnnivDate));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyCode', contractDetails.InvoiceFrequencyCode);
                _this.virtualJoin();
            }
            if (premiseDetails) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', premiseDetails.PremiseName);
            }
            if (productDetails) {
                if (_this.pageMode === 'U') {
                    _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'NewProductCode', false);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NewProductDesc', productDetails.ProductDesc);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', productDetails.ProductDesc);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductSaleGroupCode', productDetails.ProductSaleGroupCode);
                }
            }
            if (employeeDetails) {
                _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'ServiceSalesEmployee', false);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceSalesEmployeeName', employeeDetails.EmployeeSurname);
            }
            if (lostBusinessLangDetails) {
                _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'LostBusinessCode', false);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LostBusinessDesc', lostBusinessLangDetails.LostBusinessDesc);
            }
            if (lostBusinessDetailLangDetails) {
                _this.riExchange.riInputElement.SetErrorStatus(_this.uiForm, 'LostBusinessDetailCode', false);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LostBusinessDetailDesc', lostBusinessDetailLangDetails.LostBusinessDetailDesc);
            }
            if (_this.pageMode !== 'U') {
                _this.riMaintenance_AfterFetch();
            }
            else {
                _this.rendrer.setElementClass(_this.newProductCode.nativeElement, 'ng-invalid', false);
                _this.rendrer.setElementClass(_this.lostBusinessCode.nativeElement, 'ng-invalid', false);
                _this.rendrer.setElementClass(_this.lostBusinessDetailCode.nativeElement, 'ng-invalid', false);
                if (!productDetails) {
                    _this.rendrer.setElementClass(_this.newProductCode.nativeElement, 'ng-invalid', true);
                }
                if (!lostBusinessLangDetails) {
                    _this.rendrer.setElementClass(_this.lostBusinessCode.nativeElement, 'ng-invalid', true);
                }
                if (!lostBusinessDetailLangDetails) {
                    _this.rendrer.setElementClass(_this.lostBusinessDetailCode.nativeElement, 'ng-invalid', true);
                }
                if (productDetails && lostBusinessLangDetails && lostBusinessDetailLangDetails) {
                    _this.promptTitle = MessageConstant.Message.ConfirmRecord;
                    _this.promptModal.show();
                }
            }
        });
    };
    ProductCodeUpgradeComponent.prototype.riMaintenance_AfterFetch = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageCode', this.utils.getDefaultLang());
        var seasonal = this.riExchange.riInputElement.GetValue(this.uiForm, 'Seasonal');
        if (seasonal === 'SEASONAL') {
            this.showGridSeasonal = true;
        }
        else {
            this.showGridSeasonal = false;
        }
        this.businessOriginCode_ondeactivate();
    };
    ProductCodeUpgradeComponent.prototype.businessOriginCode_ondeactivate = function () {
        var _this = this;
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');
        var bodyParams = {
            'BusinessOriginCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'),
            'Function': 'CheckFields'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DetailRequiredInd', data.DetailRequiredInd);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LeadInd', data.LeadInd);
            if (data.DetailRequiredInd === 'yes') {
                _this.showBusinessOriginDetailCode = true;
                _this.businessOriginDetailCodeRequired = true;
            }
            else {
                _this.showBusinessOriginDetailCode = false;
                _this.businessOriginDetailCodeRequired = false;
            }
            _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'BusinessOriginDetailCode', _this.businessOriginDetailCodeRequired);
            if (data.LeadInd === 'yes') {
                _this.showLeadEmployee = true;
                _this.leadEmployeeRequired = true;
            }
            else {
                _this.showLeadEmployee = false;
                _this.leadEmployeeRequired = false;
            }
            _this.riExchange.riInputElement.SetRequiredStatus(_this.uiForm, 'LeadEmployee', _this.leadEmployeeRequired);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDetailCode', '');
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDetailDesc', '');
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LeadEmployee', '');
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LeadEmployeeSurname', '');
            _this.riMaintenance_BeforeUpdate();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error => ', error);
        });
    };
    ProductCodeUpgradeComponent.prototype.riMaintenance_Search = function (data, type) {
        this.cbbService.disableComponent(true);
        switch (type) {
            case 'contract':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = data.ContractNumber;
                this.ellipsisConfig.premise.childConfigParams['ContractName'] = data.ContractName;
                this.ellipsisConfig.product.childConfigParams['ContractNumber'] = data.ContractNumber;
                this.ellipsisConfig.product.childConfigParams['ContractName'] = data.ContractName;
                this.cNumber = data.ContractNumber;
                this.cName = data.ContractName;
                this.resetFields(type);
                break;
            case 'premise':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = data.PremiseNumber;
                this.ellipsisConfig.product.childConfigParams['PremiseName'] = data.PremiseName;
                this.pNumber = data.PremiseNumber;
                this.pName = data.PremiseName;
                this.resetFields(type);
                break;
            case 'product':
                this.pageMode = 'N';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.row.ProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.row.ProductDesc);
                this.attributes.ServiceCoverRowID = data.row.ttServiceCover;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', data.row.ServiceCoverNumber);
                this.populateFields();
                break;
            case 'newProduct':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'NewProductCode', data.ProductCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'NewProductDesc', data.ProductDesc);
                break;
            case 'businessOrigin':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginCode', data.BusinessCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDesc', data.BusinessDesc);
                break;
            case 'businessOriginDetail':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessCode', data.BusinessCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDesc', data.BusinessDesc);
                break;
            case 'leadEmployee':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LeadEmployee', data.EmployeeCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LeadEmployeeSurname', data.EmployeeSurName);
                break;
            case 'lostBusiness':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessCode', data.BusinessCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDesc', data.BusinessDesc);
                break;
            case 'lostBusinessDetail':
                break;
            case 'serviceSalesEmployee':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceSalesEmployee', data.EmployeeCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceSalesEmployeeName', data.EmployeeSurName);
                break;
        }
    };
    ProductCodeUpgradeComponent.prototype.confirmSave = function () {
        for (var control in this.uiForm.controls) {
            if (control) {
                this.riExchange.riInputElement.isError(this.uiForm, control);
            }
        }
        if (this.uiForm.invalid)
            return;
        this.fetchProductDetails();
    };
    ProductCodeUpgradeComponent.prototype.riMaintenance_BeforeSaveUpdate = function () {
        if (!this.effectiveDateWarningsShown) {
            this.showErrorMessages();
        }
    };
    ProductCodeUpgradeComponent.prototype.riMaintenance_BeforeUpdate = function () {
        var _this = this;
        if (!this.recordFound) {
            var recordFoundError = {
                'errorMessage': 'No record Selected'
            };
            this.errorModal.show(recordFoundError, true);
            return;
        }
        this.pageMode = 'U';
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');
        var bodyParams = {
            'Function': 'DefaultEffectiveDate,WarnValueChange,ValueAtEffectiveDate',
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ServiceCoverNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.ServiceAnnualValue)
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceAnnualValue', _this.utils.cCur(data.ServiceAnnualValue));
            if (data.NewAnnualValue)
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NewAnnualValue', _this.utils.cCur(data.NewAnnualValue));
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceQuantity', data.ServiceQuantity);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', data.ServiceVisitFrequency);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ErrorMessageDesc', data.ErrorMessageDesc);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'EffectiveDate', data.EffectiveDate);
            if (data.EffectiveDate)
                _this.effective_date = _this.utils.convertDate(data.EffectiveDate);
            _this.updateFieldStatus();
            _this.showErrorMessages();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error => ', error);
        });
    };
    ProductCodeUpgradeComponent.prototype.riMaintenance_Update = function () {
        var _this = this;
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '2');
        var bodyParams = {
            'Function': 'CheckFields',
            'ServiceCoverWasteReq': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverWasteReq'),
            'ServiceCoverWasteCopied': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverWasteCopied'),
            'NewServiceCoverNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'NewServiceCoverNumber'),
            'NewServiceCoverRowID': this.riExchange.riInputElement.GetValue(this.uiForm, 'NewServiceCoverRowID'),
            'BusinessOriginDesc': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDesc'),
            'BusinessOriginDetailDesc': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDetailDesc'),
            'LeadEmployeeSurname': this.riExchange.riInputElement.GetValue(this.uiForm, 'LeadEmployeeSurname'),
            'DetailRequiredInd': this.riExchange.riInputElement.GetValue(this.uiForm, 'DetailRequiredInd'),
            'LeadInd': this.riExchange.riInputElement.GetValue(this.uiForm, 'LeadInd'),
            'ServiceCoverROWID': this.attributes.ServiceCoverRowID,
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ServiceCoverNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'),
            'ServiceVisitFrequency': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency'),
            'ServiceQuantity': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceQuantity'),
            'ServiceCommenceDate': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCommenceDate'),
            'ServiceVisitAnnivDate': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitAnnivDate'),
            'PortfolioStatusDesc': this.riExchange.riInputElement.GetValue(this.uiForm, 'PortfolioStatusDesc'),
            'NewProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'NewProductCode'),
            'EffectiveDate': this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate'),
            'ServiceAnnualValue': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceAnnualValue'),
            'PriceChangeValue': this.riExchange.riInputElement.GetValue(this.uiForm, 'PriceChangeValue'),
            'NewAnnualValue': this.riExchange.riInputElement.GetValue(this.uiForm, 'NewAnnualValue'),
            'LostBusinessCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessCode'),
            'LostBusinessDetailCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode'),
            'ServiceSpecialInstructions': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSpecialInstructions'),
            'ServiceSalesEmployee': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee'),
            'BusinessOriginCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'),
            'BusinessOriginDetailCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDetailCode'),
            'LeadEmployee': this.riExchange.riInputElement.GetValue(this.uiForm, 'LeadEmployee')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            data.errorMessage = MessageConstant.Message.SavedSuccessfully;
            _this.errorModal.showHeader = false;
            _this.errorModal.show(data, true);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error => ', error);
        });
    };
    ProductCodeUpgradeComponent.prototype.riMaintenance_AfterSave = function () {
        var serviceCoverWasteReq = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverWasteReq');
        var serviceCoverWasteCopied = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverWasteCopied');
        if (serviceCoverWasteReq === 'yes' || serviceCoverWasteCopied === 'yes') {
            this.navigate('ProductUpgrade', 'application/iCABSAServiceCoverWasteGrid');
        }
    };
    ProductCodeUpgradeComponent.prototype.riMaintenance_CancelSave = function () {
        this.pageMode = 'N';
        this.updateFieldStatus();
        this.pageMode = 'U';
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    ProductCodeUpgradeComponent.prototype.storeFields = function () {
        this.fieldData['eDate'] = this.effective_date;
        this.fieldData['EffectiveDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate');
        this.fieldData['NewProductCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'NewProductCode');
        this.fieldData['NewProductDesc'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'NewProductDesc');
        this.fieldData['PriceChangeValue'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PriceChangeValue');
        this.fieldData['NewAnnualValue'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'NewAnnualValue');
        this.fieldData['BusinessOriginCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode');
        this.fieldData['BusinessOriginDesc'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDesc');
        this.fieldData['LostBusinessCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessCode');
        this.fieldData['LostBusinessDesc'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDesc');
        this.fieldData['LostBusinessDetailCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode');
        this.fieldData['LostBusinessDetailDesc'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailDesc');
        this.fieldData['BusinessOriginDetailCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDetailCode');
        this.fieldData['BusinessOriginDetailDesc'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDetailDesc');
        this.fieldData['LeadEmployee'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LeadEmployee');
        this.fieldData['LeadEmployeeSurname'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LeadEmployeeSurname');
        this.fieldData['ServiceSalesEmployee'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployee');
        this.fieldData['ServiceSalesEmployeeName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSalesEmployeeName');
        this.fieldData['ServiceSpecialInstructions'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceSpecialInstructions');
    };
    ProductCodeUpgradeComponent.prototype.restoreFields = function () {
        this.effective_date = new Date(this.fieldData['eDate']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', this.fieldData['EffectiveDate']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NewProductCode', this.fieldData['NewProductCode']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NewProductDesc', this.fieldData['NewProductDesc']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PriceChangeValue', this.fieldData['PriceChangeValue']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NewAnnualValue', this.fieldData['NewAnnualValue']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginCode', this.fieldData['BusinessOriginCode']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDesc', this.fieldData['BusinessOriginDesc']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessCode', this.fieldData['LostBusinessCode']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDesc', this.fieldData['LostBusinessDesc']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailCode', this.fieldData['LostBusinessDetailCode']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailDesc', this.fieldData['LostBusinessDetailDesc']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDetailCode', this.fieldData['BusinessOriginDetailCode']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginDetailDesc', this.fieldData['BusinessOriginDetailDesc']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LeadEmployee', this.fieldData['LeadEmployee']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LeadEmployeeSurname', this.fieldData['LeadEmployeeSurname']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceSalesEmployee', this.fieldData['ServiceSalesEmployee']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceSalesEmployeeName', this.fieldData['ServiceSalesEmployeeName']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceSpecialInstructions', this.fieldData['ServiceSpecialInstructions']);
    };
    ProductCodeUpgradeComponent.prototype.productCodeSearch = function () {
        this.serviceCoverSearch.openModal();
    };
    ProductCodeUpgradeComponent.prototype.virtualJoin = function () {
        var _this = this;
        var lookUp = [{
                'table': 'SystemInvoiceFrequency',
                'query': {
                    'BusinessCode': this.businessCode,
                    'InvoiceFrequencyCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceFrequencyCode')
                },
                'fields': ['InvoiceFrequencyDesc']
            }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(lookUp).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            var invoiceFrequencyDetails = data[0][0];
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyDesc', invoiceFrequencyDetails.InvoiceFrequencyDesc);
        });
    };
    ProductCodeUpgradeComponent.prototype.updateFieldStatus = function () {
        if (this.recordFound) {
            this.effectiveDateDisabled = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'NewProductCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PriceChangeValue');
            this.riExchange.riInputElement.Enable(this.uiForm, 'BusinessOriginCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'LostBusinessCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'LostBusinessDetailCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'BusinessOriginDetailCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'LeadEmployee');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceSalesEmployee');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceSpecialInstructions');
            this.ellipsisConfig.leadEmployee.disabled = false;
            this.ellipsisConfig.newProduct.disabled = false;
            this.ellipsisConfig.businessOrigin.disabled = false;
            this.ellipsisConfig.serviceSalesEmployee.disabled = false;
            this.ellipsisConfig.businessOriginDetail.disabled = false;
            this.ellipsisConfig.lostBusiness.disabled = false;
            this.ellipsisConfig.lostBusinessDetail.disabled = false;
        }
        if (this.pageMode === 'U') {
            this.storeFields();
        }
        else {
            this.restoreFields();
        }
    };
    ProductCodeUpgradeComponent.prototype.effectiveDate_onChange = function (value) {
        var _this = this;
        if (this.loadPreviousData)
            return;
        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') ||
            !this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') ||
            !this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'))
            return;
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', value.value);
        }
        var functionList = 'ValueAtEffectiveDate';
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');
        var bodyParams = {
            'Function': functionList,
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ServiceCoverNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'),
            'PriceChangeValue': this.riExchange.riInputElement.GetValue(this.uiForm, 'PriceChangeValue')
        };
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate')) {
            functionList += ',WarnEffectiveDate';
            bodyParams['EffectiveDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate');
        }
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(function (data) {
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                return;
            }
            _this.showErrorMessages();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error => ', error);
        });
    };
    ProductCodeUpgradeComponent.prototype.priceChangeValue_onChange = function () {
        var newAnnualValue;
        var isNegative = false;
        var serviceAnnualValue = this.getControlValue('ServiceAnnualValue').replace(/[^0-9\.]+/g, '');
        var priceChangeValue = this.getControlValue('PriceChangeValue');
        if (isNaN(priceChangeValue)) {
            if (priceChangeValue.toString().indexOf('(') === 0 && priceChangeValue.toString().indexOf(')') === priceChangeValue.length - 1) {
                priceChangeValue = priceChangeValue.replace(/[^0-9\.]+/g, '');
                isNegative = true;
            }
            else {
                priceChangeValue = 0;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PriceChangeValue', priceChangeValue);
            }
        }
        else {
            if (priceChangeValue.toString().indexOf('-') === 0) {
                isNegative = true;
            }
            priceChangeValue = priceChangeValue.replace(/[^0-9\.]+/g, '');
        }
        if (isNegative) {
            newAnnualValue = parseFloat(serviceAnnualValue) - parseFloat(priceChangeValue);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PriceChangeValue', '(' + this.utils.cCur(priceChangeValue.toString()) + ')');
        }
        else {
            newAnnualValue = parseFloat(serviceAnnualValue) + parseFloat(priceChangeValue);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PriceChangeValue', this.utils.cCur(priceChangeValue.toString()));
        }
        if (newAnnualValue < 0) {
            newAnnualValue = newAnnualValue * -1;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NewAnnualValue', '(' + this.utils.cCur(newAnnualValue.toString()) + ')');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NewAnnualValue', this.utils.cCur(newAnnualValue.toString()));
        }
    };
    ProductCodeUpgradeComponent.prototype.businessOriginCode_OnChange = function () {
        var _this = this;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode') === '')
            return;
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');
        var bodyParams = {
            'BusinessOriginCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'),
            'Function': 'GetBusinessOrigin'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDesc', data.BusinessOriginDesc);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error => ', error);
        });
    };
    ProductCodeUpgradeComponent.prototype.businessOriginDetailCode_OnChange = function () {
        var _this = this;
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');
        var bodyParams = {
            'BusinessOriginCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'),
            'BusinessOriginDetailCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginDetailCode'),
            'Function': 'GetBusinessOriginDetail'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessOriginDesc', data.BusinessOriginDesc);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error => ', error);
        });
    };
    ProductCodeUpgradeComponent.prototype.leadEmployee_OnChange = function () {
        var _this = this;
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');
        var bodyParams = {
            'LeadEmployee': this.riExchange.riInputElement.GetValue(this.uiForm, 'LeadEmployee'),
            'Function': 'GetLeadEmployee'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                return;
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LeadEmployeeSurname', data.LeadEmployeeSurname);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.logger.log('Error => ', error);
        });
    };
    ProductCodeUpgradeComponent.prototype.showErrorMessages = function () {
        var msgArray = [];
        var errorMessageDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ErrorMessageDesc');
        if (errorMessageDesc) {
            msgArray = errorMessageDesc.split('|');
            for (var i = 0; i < msgArray.length; i++) {
                var error = {
                    'errorMessage': msgArray[i]
                };
                this.errorModal.show(error, true);
            }
        }
    };
    ProductCodeUpgradeComponent.prototype.promptSave = function (ev) {
        this.riMaintenance_Update();
    };
    ProductCodeUpgradeComponent.prototype.renderTab = function (tabindex) {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                break;
        }
    };
    ;
    ProductCodeUpgradeComponent.prototype.onOptionChange = function (selected) {
        if (selected !== '') {
            if (!this.recordFound) {
                var data = { 'errorMessage': 'No Records Selected' };
                this.errorModal.show(data, true);
                return;
            }
            if (selected === 'PlanVisit') {
                this.navigate('ServiceCover', '/grid/application/contract/planVisitGridYear', {
                    'parentMode': 'ServiceCover',
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                    'CurrentContractTypeURLParameter': '<contract>'
                });
            }
            else if (selected === 'StateOfService') {
                alert(' Open iCABSSeStateOfServiceNatAccountGrid wheh available');
            }
        }
    };
    ProductCodeUpgradeComponent.prototype.resetFields = function (fieldName) {
        this.pageMode = 'N';
        this.uiForm.reset();
        if (fieldName === 'contract') {
            this.setControlValue('ContractNumber', this.cNumber);
            this.setControlValue('ContractName', this.cName);
        }
        else if (fieldName === 'premise') {
            this.setControlValue('ContractNumber', this.cNumber);
            this.setControlValue('ContractName', this.cName);
            this.setControlValue('PremiseNumber', this.pNumber);
            this.setControlValue('PremiseName', this.pName);
        }
        this.effectiveDateDisabled = true;
        this.riExchange.riInputElement.Disable(this.uiForm, 'NewProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PriceChangeValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessOriginCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LostBusinessCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LostBusinessDetailCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessOriginDetailCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LeadEmployee');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceSalesEmployee');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceSpecialInstructions');
        this.effectiveDateWarningsShown = false;
        this.showBusinessOriginDetailCode = false;
        this.businessOriginDetailCodeRequired = false;
        this.showLeadEmployee = false;
        this.leadEmployeeRequired = false;
        this.ellipsisConfig.lostBusiness.disabled = true;
        this.ellipsisConfig.lostBusinessDetail.disabled = true;
        this.ellipsisConfig.newProduct.disabled = true;
        this.ellipsisConfig.businessOrigin.disabled = true;
        this.ellipsisConfig.leadEmployee.disabled = true;
        this.ellipsisConfig.serviceSalesEmployee.disabled = true;
        this.effective_date = null;
        this.recordFound = false;
        this.fieldData = {};
    };
    ProductCodeUpgradeComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAProductCodeUpgrade.html'
                },] },
    ];
    ProductCodeUpgradeComponent.ctorParameters = [
        { type: Injector, },
        { type: RouteAwayGlobals, },
        { type: Renderer, },
    ];
    ProductCodeUpgradeComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'serviceCoverSearch': [{ type: ViewChild, args: ['serviceCoverSearch',] },],
        'newProductCode': [{ type: ViewChild, args: ['NewProductCode',] },],
        'lostBusinessCode': [{ type: ViewChild, args: ['LostBusinessCode',] },],
        'lostBusinessDetailCode': [{ type: ViewChild, args: ['LostBusinessDetailCode',] },],
    };
    return ProductCodeUpgradeComponent;
}(BaseComponent));
