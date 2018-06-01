var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { ContractSearchComponent } from '../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from '../../../internal/search/iCABSAServiceCoverSearch';
import { ErrorConstant } from './../../../../shared/constants/error.constant';
export var ServicePlanDeliveryNoteProductComponent = (function (_super) {
    __extends(ServicePlanDeliveryNoteProductComponent, _super);
    function ServicePlanDeliveryNoteProductComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: true },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: true },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false },
            { name: 'FieldDate', readonly: true, disabled: false, required: false },
            { name: 'GenerateOption', readonly: true, disabled: false, required: false },
            { name: 'ReportDestination', readonly: true, disabled: false, required: false },
            { name: 'Submit', readonly: true, disabled: false, required: false },
            { name: 'MoreThanOne', readonly: true, disabled: true, required: false },
            { name: 'ServiceCoverRowID', readonly: true, disabled: true, required: false },
            { name: 'IncludeLocations', readonly: true, disabled: false, required: false },
            { name: 'NumberOfForms', readonly: true, disabled: false, required: false }
        ];
        this.queryParams = {
            operation: 'Service/iCABSSeServicePlanDeliveryNotebyProduct',
            module: 'delivery-note',
            method: 'service-delivery/maintenance'
        };
        this.FieldDate = new Date();
        this.dateReadOnly = false;
        this.isRequesting = false;
        this.thInformationDisplayed = false;
        this.thInformation2Displayed = false;
        this.locationsAndFormsDisplay = false;
        this.ellipsis = {
            contractSearch: {
                disabled: false,
                showCloseButton: true,
                childConfigParams: {
                    parentMode: 'LookUp-All',
                    currentContractType: '',
                    currentContractTypeURLParameter: '',
                    showAddNew: false,
                    contractNumber: ''
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                showHeader: true,
                showAddNew: false,
                autoOpenSearch: false,
                setFocus: false,
                component: ContractSearchComponent
            },
            premises: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'ContractNumber': '',
                    'ContractName': '',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: PremiseSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            product: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-Freq',
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': '',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': false
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: ServiceCoverSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.pageId = PageIdentifier.ICABSSESERVICEPLANDELIVERYNOTEBYPRODUCT;
    }
    ServicePlanDeliveryNoteProductComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Generate Single Service Receipt';
        this.windowOnLoad();
    };
    ServicePlanDeliveryNoteProductComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.ellipsis.contractSearch.autoOpenSearch = true;
        }, 1000);
    };
    ServicePlanDeliveryNoteProductComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ServicePlanDeliveryNoteProductComponent.prototype.windowOnLoad = function () {
        this.getSysCharDtetails();
    };
    ServicePlanDeliveryNoteProductComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharServiceDeliveryNoteType
        ];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: '0',
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.vSCDeliveryNoteTypeRequired = record[0]['Required'];
            _this.vSCDeliveryNoteType = record[0]['Integer'];
            _this.setInitialValues();
        });
    };
    ServicePlanDeliveryNoteProductComponent.prototype.setInitialValues = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeLocations', false);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NumberOfForms', '4');
        this.FieldDateDisplayed = this.utils.formatDate(this.FieldDate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ReportDestination', 'Listing');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Listing');
        this.branchNumber = this.utils.getBranchCode();
        if (this.vSCDeliveryNoteTypeRequired) {
            switch (this.vSCDeliveryNoteType) {
                case 1:
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Receipts');
                    break;
                case 2:
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Listing');
                    break;
                case 3:
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Both');
                    this.locationsAndFormsDisplay = true;
                    break;
                default:
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GenerateOption', 'Listing');
            }
        }
    };
    ServicePlanDeliveryNoteProductComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.FieldDateDisplayed = value.value;
        }
        else {
            this.FieldDateDisplayed = '';
        }
    };
    ServicePlanDeliveryNoteProductComponent.prototype.onContractDataReceived = function (data) {
        this.contractNumberKeyUp();
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        this.ellipsis.premises.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.premises.childConfigParams.ContractName = data.ContractName;
        this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.populateDescriptions('Contract');
    };
    ServicePlanDeliveryNoteProductComponent.prototype.onPremiseDataReceived = function (obj, call) {
        this.premiseNumberKeyUp();
        if (obj.PremiseNumber) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', obj.PremiseNumber);
            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.product.childConfigParams.PremiseNumber = obj.PremiseNumber;
        }
        if (obj.PremiseName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', obj.PremiseName);
            this.ellipsis.product.childConfigParams.PremiseName = obj.PremiseName;
        }
        this.productcodeEllipsis.updateComponent();
        this.populateDescriptions('Premise');
    };
    ServicePlanDeliveryNoteProductComponent.prototype.onProductDataReceived = function (obj, call) {
        if (call) {
            if (obj.row.ProductCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', obj.row.ProductCode);
            }
            if (obj.row.ProductDesc) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', obj.row.ProductDesc);
            }
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', obj.row.ServiceCoverRowID);
            this.populateDescriptions('Product');
        }
    };
    ServicePlanDeliveryNoteProductComponent.prototype.modalHiddenForContract = function (e) {
        this.ellipsis.contractSearch.autoOpenSearch = false;
    };
    ServicePlanDeliveryNoteProductComponent.prototype.contractNumberOnChange = function (obj) {
        this.setFormMode(this.c_s_MODE_SELECT);
        if (this.uiForm.controls['ContractNumber'].value !== '') {
            this.uiForm.controls['ContractNumber'].setValue(this.utils.numberPadding(obj.value, 8));
            this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.setFormMode(this.c_s_MODE_UPDATE);
            this.populateDescriptions('Contract');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
            this.ellipsis.premises.childConfigParams.ContractNumber = '';
            this.ellipsis.premises.childConfigParams.ContractName = '';
            this.ellipsis.product.childConfigParams.ContractNumber = '';
            this.ellipsis.product.childConfigParams.PremiseNumber = '';
            this.ellipsis.product.childConfigParams.ContractName = '';
            this.ellipsis.product.childConfigParams.PremiseName = '';
        }
    };
    ServicePlanDeliveryNoteProductComponent.prototype.premiseNumberOnChange = function (obj) {
        if (this.uiForm.controls['PremiseNumber'].value !== '') {
            this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
            this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName');
            this.populateDescriptions('Premise');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
            this.ellipsis.product.childConfigParams.PremiseNumber = '';
            this.ellipsis.product.childConfigParams.PremiseName = '';
        }
    };
    ServicePlanDeliveryNoteProductComponent.prototype.productCodeOnChange = function (obj) {
        if (this.uiForm.controls['ProductCode'].value !== '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.uiForm.controls['ProductCode'].value.toUpperCase());
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', '');
            this.populateDescriptions('Product');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
        }
    };
    ServicePlanDeliveryNoteProductComponent.prototype.populateDescriptions = function (flag) {
        var _this = this;
        console.log('data', flag);
        var searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        if (this.uiForm.controls['ContractNumber'].value !== '') {
            searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        }
        if (this.uiForm.controls['PremiseNumber'].value !== '') {
            searchParams.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        }
        if (this.uiForm.controls['ProductCode'].value !== '') {
            searchParams.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        }
        searchParams.set('Mode', 'SetDisplayFields');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(function (data) {
            if (data.errorMessage) {
                _this.clearFields(flag);
                _this.errorService.emitError(new Error(ErrorConstant.Message.RecordNotFound));
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', data.ContractName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', data.PremiseName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', data.ProductDesc);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverRowID', data.ServiceCoverRowID);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', data.ServiceVisitFrequency);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'MoreThanOne', data.MoreThanOne);
                _this.ellipsis.premises.childConfigParams.ContractNumber = _this.getControlValue('ContractNumber');
                _this.ellipsis.premises.childConfigParams.ContractName = _this.getControlValue('ContractName');
                _this.ellipsis.product.childConfigParams.ContractNumber = _this.getControlValue('ContractNumber');
                _this.ellipsis.product.childConfigParams.PremiseNumber = _this.getControlValue('PremiseNumber');
                _this.ellipsis.product.childConfigParams.ContractName = _this.getControlValue('ContractName');
                _this.ellipsis.product.childConfigParams.PremiseName = _this.getControlValue('PremiseName');
                if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'ServiceVisitFrequency') === '0') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', '');
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.clearFields(flag);
            _this.errorService.emitError(new Error(ErrorConstant.Message.RecordNotFound));
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteProductComponent.prototype.clearFields = function (flag) {
        this.setFormMode(this.c_s_MODE_SELECT);
        console.log(flag);
        if (flag === 'Premise') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.ellipsis.product.childConfigParams.PremiseNumber = '';
            this.ellipsis.product.childConfigParams.PremiseName = '';
        }
        if (flag === 'Contract') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.ellipsis.premises.childConfigParams.ContractNumber = '';
            this.ellipsis.premises.childConfigParams.ContractName = '';
            this.ellipsis.product.childConfigParams.ContractNumber = '';
            this.ellipsis.product.childConfigParams.ContractName = '';
            this.ellipsis.product.childConfigParams.PremiseNumber = '';
            this.ellipsis.product.childConfigParams.PremiseName = '';
        }
        if (flag === 'Product') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'MoreThanOne', '');
        this.thInformationDisplayed = false;
        this.thInformation2Displayed = false;
    };
    ServicePlanDeliveryNoteProductComponent.prototype.contractNumberKeyUp = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ContractNumber', false);
    };
    ServicePlanDeliveryNoteProductComponent.prototype.premiseNumberKeyUp = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseNumber', false);
    };
    ServicePlanDeliveryNoteProductComponent.prototype.onSubmitClicked = function () {
        if (this.uiForm.controls['ContractNumber'].value === '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ContractNumber', true);
            this.uiForm.controls['ContractNumber'].setErrors({ required: true });
        }
        if (this.uiForm.controls['PremiseNumber'].value === '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseNumber', true);
            this.uiForm.controls['PremiseNumber'].setErrors({ required: true });
        }
        if (this.FieldDateDisplayed !== '' && (window['moment'](this.FieldDate, 'DD/MM/YYYY', true).isValid())) {
        }
        if (this.uiForm.controls['ContractNumber'].value && this.uiForm.controls['PremiseNumber'].value && this.vSCDeliveryNoteTypeRequired) {
            this.thInformationDisplayed = false;
            this.thInformation2Displayed = false;
            var generateOption = this.uiForm.controls['GenerateOption'].value;
            switch (generateOption) {
                case 'Listing':
                    this.submitReportRequestList();
                    break;
                case 'Receipts':
                    this.submitReportRequest();
                    break;
                case 'Both':
                    this.submitReportRequestList();
                    this.submitReportRequest();
                    break;
                default:
            }
        }
    };
    ServicePlanDeliveryNoteProductComponent.prototype.submitReportRequestList = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        postParams.Description = 'Single Service List';
        postParams.ProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
        postParams.StartDate = this.FieldDateDisplayed;
        var date = new Date(this.utils.convertDate(this.FieldDateDisplayed));
        postParams.StartTime = date.getHours() * 60 + date.getMinutes();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberModeContractNumberPremiseNumberProductCodeServiceCoverIncludeLocationsNumberOfFormsFieldDateRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + 'Single' + this.uiForm.controls['ContractNumber'].value + '' + this.uiForm.controls['PremiseNumber'].value + '' + this.uiForm.controls['ProductCode'].value + '' + this.uiForm.controls['ServiceCoverRowID'].value + '' + this.uiForm.controls['IncludeLocations'].value + '' + this.uiForm.controls['NumberOfForms'].value + '' + this.FieldDateDisplayed + '' + 'batch' + '|' + 'ReportID';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.thInformation = e.fullError;
                    _this.thInformationDisplayed = true;
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteProductComponent.prototype.submitReportRequest = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        postParams.Description = 'Single Service Receipt';
        postParams.ProgramName = 'iCABSServiceDeliveryNoteReportGeneration.p';
        postParams.StartDate = this.FieldDateDisplayed;
        var date = new Date(this.utils.convertDate(this.FieldDateDisplayed));
        postParams.StartTime = date.getHours() * 60 + date.getMinutes();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberModeContractNumberPremiseNumberProductCodeServiceCoverFieldDateRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + 'Single' + this.uiForm.controls['ContractNumber'].value + '' + this.uiForm.controls['PremiseNumber'].value + '' + this.uiForm.controls['ProductCode'].value + '' + this.uiForm.controls['ServiceCoverRowID'].value + '' + this.FieldDateDisplayed + '' + 'batch' + '|' + 'ReportID';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.thInformation2 = e.fullError;
                    _this.thInformation2Displayed = true;
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServicePlanDeliveryNoteProductComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeServicePlanDeliveryNotebyProduct.html'
                },] },
    ];
    ServicePlanDeliveryNoteProductComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServicePlanDeliveryNoteProductComponent.propDecorators = {
        'ContractSearchComponent': [{ type: ViewChild, args: ['ContractSearchComponent',] },],
        'premisesNumberEllipsis': [{ type: ViewChild, args: ['premisesNumberEllipsis',] },],
        'productcodeEllipsis': [{ type: ViewChild, args: ['productcodeEllipsis',] },],
    };
    return ServicePlanDeliveryNoteProductComponent;
}(BaseComponent));
