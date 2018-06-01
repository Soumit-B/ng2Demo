var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { AccountSearchComponent } from './../search/iCABSASAccountSearch';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var ServiceCoverDetailGroupMaintenanceComponent = (function (_super) {
    __extends(ServiceCoverDetailGroupMaintenanceComponent, _super);
    function ServiceCoverDetailGroupMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.inputParams = {
            'parentMode': 'LookUp-MergeFrom',
            'methodType': 'maintenance',
            'action': '1',
            'pageTitle': 'Account Assign'
        };
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverDetailGroupMaintenance',
            module: 'contract-admin',
            method: 'contract-management/maintenance'
        };
        this.rowCount = 10;
        this.pageId = '';
        this.search = new URLSearchParams();
        this.promptTitle = 'Confirm Record?';
        this.showpromptHeader = true;
        this.rows = [
            {
                count: 1,
                ProductDetailCode: 'ProductDetailCode1',
                ProductDetailDesc: 'ProductDetailDesc1',
                DetailQty: 'DetailQty1',
                DetailCommenceDate: 'DetailCommenceDate1',
                pDate: ''
            },
            {
                count: 2,
                ProductDetailCode: 'ProductDetailCode2',
                ProductDetailDesc: 'ProductDetailDesc2',
                DetailQty: 'DetailQty2',
                DetailCommenceDate: 'DetailCommenceDate2',
                pDate: ''
            },
            {
                count: 3,
                ProductDetailCode: 'ProductDetailCode3',
                ProductDetailDesc: 'ProductDetailDesc3',
                DetailQty: 'DetailQty3',
                DetailCommenceDate: 'DetailCommenceDate3',
                pDate: ''
            },
            {
                count: 4,
                ProductDetailCode: 'ProductDetailCode4',
                ProductDetailDesc: 'ProductDetailDesc4',
                DetailQty: 'DetailQty4',
                DetailCommenceDate: 'DetailCommenceDate4',
                pDate: ''
            },
            {
                count: 5,
                ProductDetailCode: 'ProductDetailCode5',
                ProductDetailDesc: 'ProductDetailDesc5',
                DetailQty: 'DetailQty5',
                DetailCommenceDate: 'DetailCommenceDate5',
                pDate: ''
            },
            {
                count: 6,
                ProductDetailCode: 'ProductDetailCode6',
                ProductDetailDesc: 'ProductDetailDesc6',
                DetailQty: 'DetailQty6',
                DetailCommenceDate: 'DetailCommenceDate6',
                pDate: ''
            }, {
                count: 7,
                ProductDetailCode: 'ProductDetailCode7',
                ProductDetailDesc: 'ProductDetailDesc7',
                DetailQty: 'DetailQty7',
                DetailCommenceDate: 'DetailCommenceDate7',
                pDate: ''
            }, {
                count: 8,
                ProductDetailCode: 'ProductDetailCode8',
                ProductDetailDesc: 'ProductDetailDesc8',
                DetailQty: 'DetailQty8',
                DetailCommenceDate: 'DetailCommenceDate8',
                pDate: ''
            }, {
                count: 9,
                ProductDetailCode: 'ProductDetailCode9',
                ProductDetailDesc: 'ProductDetailDesc9',
                DetailQty: 'DetailQty9',
                DetailCommenceDate: 'DetailCommenceDate9',
                pDate: ''
            }, {
                count: 10,
                ProductDetailCode: 'ProductDetailCode10',
                ProductDetailDesc: 'ProductDetailDesc10',
                DetailQty: 'DetailQty10',
                DetailCommenceDate: 'DetailCommenceDate10',
                pDate: ''
            }
        ];
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: true, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailDesc', readonly: true, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: true, disabled: false, required: false },
            { name: 'MaxCount', readonly: true, disabled: false, required: false },
            { name: 'vLocationEnabled', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode1', readonly: true, disabled: false, required: true },
            { name: 'ProductDetailDesc1', readonly: true, disabled: false, required: false },
            { name: 'DetailQty1', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate1', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode2', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailDesc2', readonly: true, disabled: false, required: true },
            { name: 'DetailQty2', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate2', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode3', readonly: true, disabled: false, required: true },
            { name: 'ProductDetailDesc3', readonly: true, disabled: false, required: false },
            { name: 'DetailQty3', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate3', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode4', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailDesc4', readonly: true, disabled: false, required: false },
            { name: 'DetailQty4', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate4', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode5', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailDesc5', readonly: true, disabled: false, required: false },
            { name: 'DetailQty5', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate5', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode6', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailDesc6', readonly: true, disabled: false, required: false },
            { name: 'DetailQty6', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate6', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode7', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailDesc7', readonly: true, disabled: false, required: false },
            { name: 'DetailQty7', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate7', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode8', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailDesc8', readonly: true, disabled: false, required: false },
            { name: 'DetailQty8', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate8', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode9', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailDesc9', readonly: true, disabled: false, required: false },
            { name: 'DetailQty9', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate9', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailCode10', readonly: true, disabled: false, required: false },
            { name: 'ProductDetailDesc10', readonly: true, disabled: false, required: false },
            { name: 'DetailQty10', readonly: true, disabled: false, required: false },
            { name: 'DetailCommenceDate10', readonly: true, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERDETAILGROUPMAINTENANCE;
        this.lookupComponent = AccountSearchComponent;
    }
    ServiceCoverDetailGroupMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.setMessageCallback(this);
        this.getValuesFromLookUp();
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.handleBackNav = function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.getErrorDescription();
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: data.title }, false);
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableLocations,
            this.sysCharConstants.SystemCharEnableProductDetailQty
        ];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vSCEnableLocations = record[0].Logical;
            _this.pageParams.SCEnableDetailLocations = record[0].Logical;
            _this.pageParams.SCEnableProductDetailQty = record[1].Required;
            _this.window_onload();
        });
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.getValuesFromLookUp = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ProductCode']
            },
            {
                'table': 'ProductCover',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ProductCode']
            }
        ];
        this.pageParams.vProductCoverCount = 0;
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var ProductProductCode = data[0];
            var ProductCoverProductCode = data[1];
            _this.getSysCharDtetails();
            if (ProductProductCode && ProductCoverProductCode) {
                for (var i = 0; i < ProductProductCode.length; i++) {
                    var code = ProductProductCode[i].ProductCode;
                    for (var j = 0; j < ProductCoverProductCode.length; j++) {
                        if (code === ProductCoverProductCode[j].ProductCode) {
                            _this.pageParams.vProductCoverCount++;
                        }
                    }
                }
                _this.pageParams.vMaxCount = _this.pageParams.vProductCoverCount;
                if (_this.pageParams.vMaxCount > 50) {
                    _this.pageParams.vMaxCount = 50;
                }
            }
        });
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.getFieldValuesFromLookUp = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
                },
                'fields': ['ProductDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Contract = data[0][0];
            if (Contract) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', Contract.ContractName);
            }
            var Premise = data[1][0];
            if (Premise) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', Premise.PremiseName);
            }
            var Product = data[2][0];
            if (Product) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', Product.ProductDesc);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.window_onload = function () {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        this.pageTitle = 'Service Detail Group Maintenance';
        this.labelContractNumber = this.pageParams.currentContractTypeLabel + ' Number';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.attributes.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCover');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCover'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'MaxCount', this.pageParams.vMaxCount);
        this.getFieldValuesFromLookUp();
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.CheckLocationEnabled = function () {
        var _this = this;
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '6');
        query.set('Function', 'CheckLocationEnabled');
        query.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
            .subscribe(function (data) {
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'vLocationEnabled', data.LocationsEnabled);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.LocationsEnabled) {
                _this.navigate('ProductDetail', 'grid/application/ServiceCoverDetailLocationEntryGridComponent', {
                    'ContractNumber': _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ContractNumber'),
                    'ContractName': _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ContractName'),
                    'PremiseNumber': _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseNumber'),
                    'PremiseName': _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseName'),
                    'ProductCode': _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ProductCode'),
                    'ProductDesc': _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ProductDesc'),
                    'ServiceCoverRowID': _this.riExchange.getParentHTMLValue('ServiceCover')
                });
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError('Record not found');
        });
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.submitDetailLine = function (event) {
        event.preventDefault();
        this.promptModal.show();
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.cancelDetailLine = function (event) {
        var current = this.uiForm.value;
        for (var i = 0; i < this.rowCount; i++) {
            this.rows[i].pDate = '';
        }
        this.uiForm.reset();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', current.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', current.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', current.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', current.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', current.PremiseName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', current.ProductDesc);
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.getProductDescription = function (id) {
        var _this = this;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode' + id)) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailCode' + id, this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode' + id).toUpperCase());
            var query = this.getURLSearchParamObject();
            query.set(this.serviceConstants.Action, '6');
            var formData = {
                'ProductDetailCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode' + id)
            };
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, formData)
                .subscribe(function (data) {
                if (data.errorMessage) {
                    _this.errorService.emitError(data.errorMessage);
                    _this.messageService.emitMessage({ msg: data.errorMessage, title: 'Error' });
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDetailDesc' + id, data.ProductDetailDesc);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DetailCommenceDate' + id, _this.riExchange.getParentHTMLValue('ServiceCommenceDate'));
                    var date = _this.riExchange.getParentHTMLValue('ServiceCommenceDate');
                    if (window['moment'](date, 'DD/MM/YYYY', true).isValid()) {
                        date = _this.utils.convertDate(date);
                    }
                    else {
                        date = _this.utils.formatDate(date);
                    }
                    var pos = parseInt(id, 0) - 1;
                    _this.rows[pos].pDate = new Date(date);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.errorService.emitError('Record not found');
            });
        }
        else {
            this.riExchange.riInputElement.isError(this.uiForm, 'ProductDetailCode' + id);
        }
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.getErrorDescription = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        var formData = {
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
        };
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, formData)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                _this.errorService.emitError(data.errorMessage);
                _this.messageService.emitMessage({ msg: data.errorMessage, title: 'Error' });
            }
            else {
                if (data.StopExit === 'yes') {
                    _this.messageService.emitMessage({ msg: data.ErrorMessage, title: 'Error' });
                }
                else {
                    _this.router.navigate([_this.backLinkUrl]);
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError('Record not found');
        });
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.addDetailLine = function () {
        var count = this.rowCount + 1;
        this.controls.push({ name: 'ProductDetailCode' + count, readonly: true, disabled: false, required: false });
        this.controls.push({ name: 'ProductDetailDesc' + count, readonly: true, disabled: false, required: false });
        this.controls.push({ name: 'DetailQty' + count, readonly: true, disabled: false, required: false });
        this.controls.push({ name: 'DetailCommenceDate' + count, readonly: true, disabled: false, required: false });
        this.riExchange.renderForm(this.uiForm, this.controls);
        var rowObj = {
            count: count,
            ProductDetailCode: 'ProductDetailCode' + count,
            ProductDetailDesc: 'ProductDetailDesc' + count,
            DetailQty: 'DetailQty' + count,
            DetailCommenceDate: 'DetailCommenceDate' + count,
            pDate: ''
        };
        this.rows.push(rowObj);
        this.rowCount++;
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '1');
        var formData = this.uiForm.value;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, formData)
            .subscribe(function (data) {
            if (data.errorMessage) {
                _this.errorService.emitError(data.errorMessage);
                _this.messageService.emitMessage({ msg: data.errorMessage, title: 'Error' });
            }
            else {
                _this.CheckLocationEnabled();
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError('Record not found');
        });
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.onDataReceived = function (event, id) {
    };
    ServiceCoverDetailGroupMaintenanceComponent.prototype.dateSelectedValue = function (value, id) {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DetailCommenceDate' + id, value.value);
        }
    };
    ServiceCoverDetailGroupMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverDetailGroupMaintenance.html'
                },] },
    ];
    ServiceCoverDetailGroupMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverDetailGroupMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
    };
    return ServiceCoverDetailGroupMaintenanceComponent;
}(BaseComponent));
