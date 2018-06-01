var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { InternalMaintenanceModuleRoutes } from './../../base/PageRoutes';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var ServiceCoverDetailsComponent = (function (_super) {
    __extends(ServiceCoverDetailsComponent, _super);
    function ServiceCoverDetailsComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverDetailSearch',
            module: 'contract-admin',
            method: 'contract-management/search'
        };
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: true, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'ServiceCoverRowID', readonly: true, disabled: true, required: false },
            { name: 'tdMenu', readonly: false, disabled: false, required: false, value: 'Options' }
        ];
        this.pageId = '';
        this.scEnableProductDetailQty = false;
        this.tdMenuDisplay = true;
        this.selectedValue = '';
        this.showMessageHeader = true;
        this.tableheading = 'Contract Service Detail Search';
        this.search = new URLSearchParams();
        this.itemsPerPage = '10';
        this.page = '1';
        this.totalItem = '11';
        this.rowmetadata = new Array();
        this.pageId = PageIdentifier.ICABSASERVICECOVERDETAILSEARCH;
    }
    ServiceCoverDetailsComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getSysCharDtetails();
        this.window_onload();
        this.pageParams.parentMode = this.riExchange.getParentMode();
        this.pageParams.currentContractTypeURLParameter = this.riExchange.getCurrentContractTypeLabel();
        this.pageTitle = this.pageParams.currentContractTypeURLParameter + ' ' + 'Service Detail';
    };
    ServiceCoverDetailsComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverDetailsComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharNumbers = [this.sysCharConstants.SystemCharEnableProductDetailQty];
        var sysCharIp = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.speedScript.sysChar(sysCharIp).subscribe(function (data) {
            _this.scEnableProductDetailQty = data.records[0].Required;
            _this.buildTableColumns();
        });
        if (this.pageParams.parentMode === 'CallOut') {
            this.tdMenuDisplay = false;
        }
    };
    ServiceCoverDetailsComponent.prototype.buildTableColumns = function () {
        var _this = this;
        this.columns = [];
        this.getTranslatedValue('Product Detail Code', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ProductDetailCode' });
            }
            else {
                _this.columns.push({ title: 'Product Detail Code', name: 'ProductDetailCode' });
            }
        });
        this.getTranslatedValue('Description', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ProductDetailDesc' });
            }
            else {
                _this.columns.push({ title: 'Description', name: 'ProductDetailDesc' });
            }
        });
        if (this.scEnableProductDetailQty) {
            this.getTranslatedValue('Qty', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'ServiceDetailQty' });
                }
                else {
                    _this.columns.push({ title: 'Qty', name: 'ServiceDetailQty' });
                }
            });
        }
        this.getTranslatedValue('Commence Date', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'DetailCommenceDate' });
            }
            else {
                _this.columns.push({ title: 'Commence Date', name: 'DetailCommenceDate' });
            }
        });
        this.getTranslatedValue('Delete Date', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'DetailDeleteDate' });
            }
            else {
                _this.columns.push({ title: 'Delete Date', name: 'DetailDeleteDate' });
            }
        });
        this.buildTable();
    };
    ServiceCoverDetailsComponent.prototype.buildTable = function () {
        this.search = new URLSearchParams();
        this.search.set('action', '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        this.queryParams.search = this.search;
        this.ServiceCoverDetailTable.loadTableData(this.queryParams);
    };
    ServiceCoverDetailsComponent.prototype.window_onload = function () {
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
        switch (this.pageParams.parentMode) {
            case 'Search':
            case 'SearchExt':
                this.attributes.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
                break;
            case 'CallOut':
                this.attributes.ServiceCoverRowID = this.attributes.ProductCodeServiceCoverRowID;
                break;
            default:
                this.attributes.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
                break;
        }
    };
    ServiceCoverDetailsComponent.prototype.tableRowClick = function (event) {
        this.pageParams.parentMode = this.riExchange.getParentMode();
        var returnObj = {
            'ProductDetailCode': event.row.ProductDetailCode,
            'ProductDetailDesc': event.row.ProductDetailDesc,
            'row': event.row
        };
        switch (this.pageParams.parentMode) {
            case 'ServiceCover':
                this.navigate('Search', InternalMaintenanceModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE, {
                    'CurrentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'ContractName': this.getControlValue('ContractName'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'PremiseName': this.getControlValue('PremiseName'),
                    'ProductCode': this.getControlValue('ProductCode'),
                    'ProductDesc': this.getControlValue('ProductDesc'),
                    'ServiceCoverRowID': this.getControlValue('ServiceCoverRowID')
                });
                this.riExchange.setParentHTMLValue('ProductDetailCode', returnObj.ProductDetailCode);
                this.riExchange.setParentHTMLValue('ProductDetailDesc', returnObj.ProductDetailDesc);
                this.emitSelectedData(returnObj);
                break;
            case 'LookUp':
                this.riExchange.setParentHTMLValue('ProductDetailCode', returnObj.ProductDetailCode);
                this.emitSelectedData(returnObj);
                break;
            case 'SearchExt':
                this.riExchange.setParentHTMLValue('ProductDetailCode', returnObj.ProductDetailCode);
                this.riExchange.setParentHTMLValue('ProductDetailDesc', returnObj.ProductDetailDesc);
                this.emitSelectedData(returnObj);
                break;
            default:
                this.riExchange.setParentHTMLValue('ProductDetailCode', returnObj.ProductDetailCode);
                this.emitSelectedData(returnObj);
                break;
        }
    };
    ServiceCoverDetailsComponent.prototype.menuOnchange = function (event) {
        this.selectedValue = this.getControlValue('tdMenu');
        if (this.selectedValue === 'AddDetail') {
            this.navigate('SearchAdd', InternalMaintenanceModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE, {
                'CurrentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                'ContractNumber': this.getControlValue('ContractNumber'),
                'ContractName': this.getControlValue('ContractName'),
                'PremiseNumber': this.getControlValue('PremiseNumber'),
                'PremiseName': this.getControlValue('PremiseName'),
                'ProductCode': this.getControlValue('ProductCode'),
                'ProductDesc': this.getControlValue('ProductDesc'),
                'ServiceCoverRowID': this.getControlValue('ServiceCoverRowID')
            });
        }
    };
    ServiceCoverDetailsComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    ServiceCoverDetailsComponent.prototype.refresh = function () {
        this.buildTableColumns();
        this.ServiceCoverDetailTable.clearTable();
    };
    ServiceCoverDetailsComponent.prototype.updateView = function (params) {
        this.pageParams.parentMode = params.parentMode;
        if (params.ContractNumber)
            this.setControlValue('ContractNumber', params.ContractNumber);
        if (params.ContractName)
            this.setControlValue('ContractName', params.ContractName);
        if (params.PremiseNumber)
            this.setControlValue('PremiseNumber', params.PremiseNumber);
        if (params.PremiseName)
            this.setControlValue('PremiseName', params.PremiseNumber);
        if (params.ProductCode)
            this.setControlValue('ProductCode', params.PremiseNumber);
        if (params.ProductDesc)
            this.setControlValue('ProductDesc', params.ProductDesc);
        if (params.ServiceCoverRowID)
            this.attributes.ServiceCoverRowID = params.ServiceCoverRowID;
        this.buildTableColumns();
    };
    ServiceCoverDetailsComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverDetailSearch.html'
                },] },
    ];
    ServiceCoverDetailsComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverDetailsComponent.propDecorators = {
        'ServiceCoverDetailTable': [{ type: ViewChild, args: ['ServiceCoverDetailTable',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return ServiceCoverDetailsComponent;
}(BaseComponent));
