var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageConstant } from '../../../shared/constants/message.constant';
export var TrialPeriodReleaseMaintenanceComponent = (function (_super) {
    __extends(TrialPeriodReleaseMaintenanceComponent, _super);
    function TrialPeriodReleaseMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.inputParams = {};
        this.pageTitle = '';
        this.showErrorHeader = true;
        this.showEmployeeCodeValid = true;
        this.backupData = {};
        this.showMessageHeader = true;
        this.method = 'contract-management/maintenance';
        this.module = 'contract-admin';
        this.operation = 'Application/iCABSATrialPeriodReleaseMaintenance';
        this.valueValidation = false;
        this.validateEmployee = false;
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: true },
            { name: 'ContractName', readonly: true, disabled: true, required: true },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: true },
            { name: 'PremiseName', readonly: true, disabled: true, required: true },
            { name: 'ProductCode', readonly: true, disabled: true, required: true },
            { name: 'ProductDesc', readonly: true, disabled: true, required: true },
            { name: 'AnnualValueChange', readonly: false, disabled: false, required: true },
            { name: 'ProposedAnnualValue', readonly: true, disabled: true, required: true },
            { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: true },
            { name: 'EmployeeSurname', readonly: true, disabled: true, required: true },
            { name: 'ServiceCoverNumber', readonly: true, disabled: true, required: true },
            { name: 'ServiceCover', readonly: true, disabled: true, required: true },
            { name: 'AnnualValueChangeValue' }
        ];
        this.pageId = PageIdentifier.ICABSATRIALPERIODRELEASEMAINTENANCE;
        this.pageTitle = 'Service Cover Trial Period Acceptance';
    }
    TrialPeriodReleaseMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.inputParams.method = this.method;
        this.inputParams.module = this.module;
        this.inputParams.operation = this.operation;
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ServiceCoverNumber', this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
        this.setControlValue('ServiceCover', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        this.window_onload();
        this.buildtable();
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.window_onload = function () {
        this.riMaintenance.CustomBusinessObjectSelect = false;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = false;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionDelete = false;
        this.riMaintenance.FunctionAdd = false;
        this.riMaintenance.FunctionSelect = false;
        this.riMaintenance.FunctionSearch = false;
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.buildtable = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProposedAnnualValue', 'AnnualValueChange', 'ServiceSalesEmployee']
            },
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var ServiceCover = data[0][0];
            if (ServiceCover) {
                _this.setControlValue('AnnualValueChange', ServiceCover.ProposedAnnualValue);
                _this.setControlValue('ProposedAnnualValue', ServiceCover.ProposedAnnualValue);
                _this.setControlValue('ServiceSalesEmployee', ServiceCover.ServiceSalesEmployee);
                _this.backupData.AnnualValueChange = _this.getControlValue('AnnualValueChange');
                _this.backupData.ServiceSalesEmployee = _this.getControlValue('ServiceSalesEmployee');
                _this.getEmployee();
            }
            var Contract = data[1][0];
            if (Contract) {
                _this.setControlValue('ContractName', Contract.ContractName);
            }
            var Premise = data[2][0];
            if (Premise) {
                _this.setControlValue('PremiseName', Premise.PremiseName);
            }
            var Product = data[3][0];
            if (Product) {
                _this.setControlValue('ProductDesc', Product.ProductDesc);
            }
        });
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.onEmployeeBlurClick = function (event) {
        this.setControlValue('ServiceSalesEmployee', event.target.value.toUpperCase());
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.getEmployee = function () {
        var _this = this;
        var EmployeeLookUp = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('ServiceSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(EmployeeLookUp).subscribe(function (data) {
            var Employee = data[0][0];
            if (Employee) {
                _this.setControlValue('EmployeeSurname', Employee.EmployeeSurname);
                _this.backupData.EmployeeSurname = _this.getControlValue('EmployeeSurname');
            }
        });
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.checkEmployeeCode = function () {
        var _this = this;
        var EmployeeLookUp = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('ServiceSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(EmployeeLookUp).subscribe(function (data) {
            var Employee = data[0][0];
            if (Employee) {
                if (Employee.EmployeeSurname) {
                    _this.validateEmployee = false;
                    _this.setControlValue('EmployeeSurname', Employee.EmployeeSurname);
                    _this.promptTitle = 'Confirm';
                    _this.promptContent = MessageConstant.Message.ConfirmRecord;
                    _this.promptConfirmModal.show();
                }
                else {
                    _this.validateEmployee = true;
                    _this.setControlValue('EmployeeSurname', '');
                }
            }
            else {
                _this.validateEmployee = true;
                _this.setControlValue('EmployeeSurname', '');
            }
        });
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.onSaveClick = function () {
        if (this['uiForm'].valid) {
            event.preventDefault();
            this.checkEmployeeCode();
        }
        else {
            this.riExchange.riInputElement.isError(this.uiForm, 'AnnualValueChange');
            this.riExchange.riInputElement.isError(this.uiForm, 'ServiceSalesEmployee');
        }
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.onValueBlur = function (event) {
        var value = event.target.value;
        if (!isNaN(value)) {
            if (value.includes('.')) {
                value = parseFloat(value).toFixed(2);
            }
            if (value.includes('-')) {
                this.setControlValue('AnnualValueChange', (value.replace('-', '(') + ')').trim());
            }
            else {
                this.setControlValue('AnnualValueChange', value);
            }
        }
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.onCancelClick = function () {
        this.setControlValue('AnnualValueChange', this.backupData.AnnualValueChange);
        this.setControlValue('ServiceSalesEmployee', this.backupData.ServiceSalesEmployee);
        this.setControlValue('EmployeeSurname', this.backupData.EmployeeSurname);
        this.formPristine();
        this.location.back();
    };
    TrialPeriodReleaseMaintenanceComponent.prototype.promptSave = function (data) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['ServiceCoverROWID'] = this.getControlValue('ServiceCover');
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
        formdata['ProposedAnnualValue'] = this.getControlValue('ProposedAnnualValue');
        if (this.getControlValue('AnnualValueChange').toString().includes('('))
            formdata['AnnualValueChange'] = this.getControlValue('AnnualValueChange').replace('(', '-').replace(')', '');
        else
            formdata['AnnualValueChange'] = this.getControlValue('AnnualValueChange');
        formdata['ServiceSalesEmployee'] = this.getControlValue('ServiceSalesEmployee');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
            }
            else {
                _this.formPristine();
                _this.location.back();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorModal.show({ msg: error, title: 'Error' }, false);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    TrialPeriodReleaseMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSATrialPeriodReleaseMaintenance.html',
                    styles: [
                        ".red-bdr span {border-color: transparent !important;}\n    "]
                },] },
    ];
    TrialPeriodReleaseMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    TrialPeriodReleaseMaintenanceComponent.propDecorators = {
        'promptConfirmModal': [{ type: ViewChild, args: ['promptModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return TrialPeriodReleaseMaintenanceComponent;
}(BaseComponent));
