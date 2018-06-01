var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var JobServiceDetailGroupMaintenanceMaintenanceComponent = (function (_super) {
    __extends(JobServiceDetailGroupMaintenanceMaintenanceComponent, _super);
    function JobServiceDetailGroupMaintenanceMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.controls = [
            { name: 'ProspectNumber' },
            { name: 'ProductCode' },
            { name: 'ProductDesc' },
            { name: 'ProductDetailCode1' },
            { name: 'ProductDetailDesc1' },
            { name: 'ProductDetailCode2' },
            { name: 'ProductDetailDesc2' },
            { name: 'ProductDetailCode3' },
            { name: 'ProductDetailDesc3' },
            { name: 'ProductDetailCode4' },
            { name: 'ProductDetailDesc4' },
            { name: 'ProductDetailCode5' },
            { name: 'ProductDetailDesc5' },
            { name: 'ProductDetailCode6' },
            { name: 'ProductDetailDesc6' },
            { name: 'ProductDetailCode7' },
            { name: 'ProductDetailDesc7' },
            { name: 'ProductDetailCode8' },
            { name: 'ProductDetailDesc8' },
            { name: 'ProductDetailCode9' },
            { name: 'ProductDetailDesc9' },
            { name: 'ProductDetailCode10' },
            { name: 'ProductDetailDesc10' }
        ];
        this.showCloseButton = true;
        this.showPromptHeader = true;
        this.pageId = '';
        this.queryParams = {
            operation: 'ContactManagement/iCABSCMNatAxJobServiceDetailGroupMaintenance',
            module: 'natax',
            method: 'prospect-to-contract/maintenance',
            ActionSave: '6',
            ActionSaveConfirm: '5',
            ActionReturnBlank: '1'
        };
        this.showHeader = true;
        this.ellipsis = {
            productCoverSearch1: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp1'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            productCoverSearch2: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp2'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            productCoverSearch3: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp3'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            productCoverSearch4: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp4'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            productCoverSearch5: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp5'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            productCoverSearch6: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp6'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            productCoverSearch7: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp7'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            productCoverSearch8: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp8'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            productCoverSearch9: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp9'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            productCoverSearch10: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp10'
                },
                contentComponent: '',
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
        this.pageId = PageIdentifier.ICABSCMNATAXJOBSERVICEDETAILGROUPMAINTENANCE;
    }
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.windowOnLoad();
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.windowOnLoad = function () {
        this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.NatAxJobServiceCoverRowID = this.riExchange.getParentHTMLValue('NatAxJobServiceCoverRowID');
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.lookUpCall = function () {
        var _this = this;
        var lookupIP = [
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
            _this.setControlValue('ProductDesc', data[0][0].ProductDesc);
        });
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.lookUpCallProductDetailCode = function (e) {
        var _this = this;
        var ProductDetailCode = 'ProductDetailCode' + e;
        var ProductDetailDesc = 'ProductDetailDesc' + e;
        var lookupIP = [
            {
                'table': 'ProductCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductDetailCode': this.getControlValue(ProductDetailCode)
                },
                'fields': ['ProductDetailDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0]) {
                _this.setControlValue('ProductDetailDesc', data[0][0].ProductDetailDesc);
            }
        });
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.productCodeChanged = function (data) {
        this.setControlValue('ProductCode', data);
        this.lookUpCall();
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.productDetailCodeChange = function (data) {
        var len = data.length;
        var val = data.substring(len, len - 1);
        this.lookUpCallProductDetailCode(val);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData1 = function (data) {
        this.setControlValue('ProductDetailCode1', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc1', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData2 = function (data) {
        this.setControlValue('ProductDetailCode2', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc2', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData3 = function (data) {
        this.setControlValue('ProductDetailCode3', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc3', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData4 = function (data) {
        this.setControlValue('ProductDetailCode4', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc4', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData5 = function (data) {
        this.setControlValue('ProductDetailCode5', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc5', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData6 = function (data) {
        this.setControlValue('ProductDetailCode6', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc6', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData7 = function (data) {
        this.setControlValue('ProductDetailCode7', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc7', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData8 = function (data) {
        this.setControlValue('ProductDetailCode8', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc8', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData9 = function (data) {
        this.setControlValue('ProductDetailCode9', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc9', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.setEllipsisReturnData10 = function (data) {
        this.setControlValue('ProductDetailCode10', data.ProductDetailCode);
        this.setControlValue('ProductDetailDesc10', data.ProductDetailDesc);
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.saveData = function () {
        var _this = this;
        var productDetailCode = this.getControlValue('ProductDetailCode1');
        if (productDetailCode !== '') {
            var searchparams = this.getURLSearchParamObject();
            searchparams.set(this.serviceConstants.Action, this.queryParams.ActionSave);
            var saveData = {};
            saveData['ProductDetailCode1'] = this.getControlValue('ProductDetailCode1');
            saveData['ProductDetailCode2'] = this.getControlValue('ProductDetailCode2');
            saveData['ProductDetailCode3'] = this.getControlValue('ProductDetailCode3');
            saveData['ProductDetailCode4'] = this.getControlValue('ProductDetailCode4');
            saveData['ProductDetailCode5'] = this.getControlValue('ProductDetailCode5');
            saveData['ProductDetailCode6'] = this.getControlValue('ProductDetailCode6');
            saveData['ProductDetailCode7'] = this.getControlValue('ProductDetailCode7');
            saveData['ProductDetailCode8'] = this.getControlValue('ProductDetailCode8');
            saveData['ProductDetailCode9'] = this.getControlValue('ProductDetailCode9');
            saveData['ProductDetailCode10'] = this.getControlValue('ProductDetailCode10');
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchparams, saveData)
                .subscribe(function (data) {
                if (data['status'] === 'failure') {
                    _this.errorService.emitError(data['oResponse']);
                }
                else {
                    if (data.errorMessage) {
                        _this.messageContent = data.errorMessage;
                        _this.messageModal.show();
                    }
                    else {
                        _this.setControlValue('ProductDetailDesc1', data.ProductDetailDesc1);
                        _this.setControlValue('ProductDetailDesc2', data.ProductDetailDesc2);
                        _this.setControlValue('ProductDetailDesc3', data.ProductDetailDesc3);
                        _this.setControlValue('ProductDetailDesc4', data.ProductDetailDesc4);
                        _this.setControlValue('ProductDetailDesc5', data.ProductDetailDesc5);
                        _this.setControlValue('ProductDetailDesc6', data.ProductDetailDesc6);
                        _this.setControlValue('ProductDetailDesc7', data.ProductDetailDesc7);
                        _this.setControlValue('ProductDetailDesc8', data.ProductDetailDesc8);
                        _this.setControlValue('ProductDetailDesc9', data.ProductDetailDesc9);
                        _this.setControlValue('ProductDetailDesc10', data.ProductDetailDesc10);
                        _this.saveConfirm();
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductDetailCode1', true);
        }
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.saveConfirm = function () {
        var _this = this;
        var searchparamssaveconfirm = this.getURLSearchParamObject();
        searchparamssaveconfirm.set(this.serviceConstants.Action, this.queryParams.ActionSaveConfirm);
        var saveConfirm = {};
        saveConfirm['ProductCode'] = this.getControlValue('ProductCode');
        saveConfirm['ProductDetailCode'] = this.getControlValue('ProductDetailCode1');
        saveConfirm['NatAxJobServiceCoverRowID'] = this.NatAxJobServiceCoverRowID;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchparamssaveconfirm, saveConfirm)
            .subscribe(function (data) {
        }, function (error) {
            _this.errorService.emitError(error);
        });
        this.promptTitle = 'Confirm Record?';
        this.promptModal.show();
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.promptSave = function () {
        var _this = this;
        var searchparams = this.getURLSearchParamObject();
        searchparams.set(this.serviceConstants.Action, this.queryParams.ActionReturnBlank);
        var saveData = {};
        saveData['ProspectNumber'] = this.getControlValue('ProspectNumber');
        saveData['ProductCode'] = this.getControlValue('ProductCode');
        saveData['ProductDetailCode1'] = this.getControlValue('ProductDetailCode1');
        saveData['ProductDetailCode2'] = this.getControlValue('ProductDetailCode2');
        saveData['ProductDetailCode3'] = this.getControlValue('ProductDetailCode3');
        saveData['ProductDetailCode4'] = this.getControlValue('ProductDetailCode4');
        saveData['ProductDetailCode5'] = this.getControlValue('ProductDetailCode5');
        saveData['ProductDetailCode6'] = this.getControlValue('ProductDetailCode6');
        saveData['ProductDetailCode7'] = this.getControlValue('ProductDetailCode7');
        saveData['ProductDetailCode8'] = this.getControlValue('ProductDetailCode8');
        saveData['ProductDetailCode9'] = this.getControlValue('ProductDetailCode9');
        saveData['ProductDetailCode10'] = this.getControlValue('ProductDetailCode10');
        saveData['NatAxJobServiceCoverRowID'] = this.NatAxJobServiceCoverRowID;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchparams, saveData)
            .subscribe(function (data) {
            if (data['status'] === 'failure') {
                _this.errorService.emitError(data['oResponse']);
            }
            else {
                if (data.errorMessage) {
                    _this.messageContent = data.errorMessage;
                    _this.messageModal.show();
                }
                else {
                    _this.messageContent = 'Data Saved Successfully';
                    _this.messageModal.show();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.prototype.cancel = function () {
        var ProductDetailCode;
        var ProductDetailDesc;
        for (var i = 1; i <= 10; i++) {
            ProductDetailCode = 'ProductDetailCode' + i;
            ProductDetailDesc = 'ProductDetailDesc' + i;
            this.setControlValue(ProductDetailCode, '');
            this.setControlValue(ProductDetailDesc, '');
        }
    };
    JobServiceDetailGroupMaintenanceMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSCMNatAxJobServiceDetailGroupMaintenance.html'
                },] },
    ];
    JobServiceDetailGroupMaintenanceMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    JobServiceDetailGroupMaintenanceMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'ProductCoverSearch1': [{ type: ViewChild, args: ['ProductCoverSearch1',] },],
        'ProductCoverSearch2': [{ type: ViewChild, args: ['ProductCoverSearch2',] },],
        'ProductCoverSearch3': [{ type: ViewChild, args: ['ProductCoverSearch3',] },],
        'ProductCoverSearch4': [{ type: ViewChild, args: ['ProductCoverSearch4',] },],
        'ProductCoverSearch5': [{ type: ViewChild, args: ['ProductCoverSearch5',] },],
        'ProductCoverSearch6': [{ type: ViewChild, args: ['ProductCoverSearch6',] },],
        'ProductCoverSearch7': [{ type: ViewChild, args: ['ProductCoverSearch7',] },],
        'ProductCoverSearch8': [{ type: ViewChild, args: ['ProductCoverSearch8',] },],
        'ProductCoverSearch9': [{ type: ViewChild, args: ['ProductCoverSearch9',] },],
        'ProductCoverSearch10': [{ type: ViewChild, args: ['ProductCoverSearch10',] },],
    };
    return JobServiceDetailGroupMaintenanceMaintenanceComponent;
}(BaseComponent));
