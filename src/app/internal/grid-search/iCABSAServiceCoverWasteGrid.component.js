var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ServiceCoverWasteGridComponent = (function (_super) {
    __extends(ServiceCoverWasteGridComponent, _super);
    function ServiceCoverWasteGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: true },
            { name: 'ContractName', readonly: true, disabled: true, required: true },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: true },
            { name: 'PremiseName', readonly: true, disabled: true, required: true },
            { name: 'ProductCode', readonly: true, disabled: true, required: true },
            { name: 'ProductDesc', readonly: true, disabled: true, required: true }
        ];
        this.inputParams = {};
        this.method = 'service-delivery/maintenance';
        this.module = 'waste';
        this.operation = 'Application/iCABSAServiceCoverWasteGrid';
        this.maxColumn = 4;
        this.pageCurrent = 1;
        this.pageSize = 10;
        this.pageId = PageIdentifier.ICABSASERVICECOVERWASTEGRID;
    }
    ServiceCoverWasteGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        switch (this.parentMode) {
            case 'ProductUpgrade':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('NewProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('NewProductDesc'));
                this.ServiceCoverNumber = this.riExchange.getParentHTMLValue('NewServiceCoverNumber');
                this.ServiceCoverRowID = this.riExchange.getParentHTMLValue('NewServiceCoverRowID');
                break;
            default:
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                this.ServiceCoverNumber = this.riExchange.getParentHTMLValue('ServiceCoverNumber');
                this.ServiceCoverRowID = this.riExchange.getParentHTMLValue('CurrentServiceCoverRowID');
                break;
        }
        this.getServiceCoverNumber();
    };
    ServiceCoverWasteGridComponent.prototype.buildGrid = function (params) {
        this.setFilterValues(params);
        this.inputParams.search = this.search;
        this.serviceCoverWasteGrid.itemsPerPage = this.pageSize;
        this.serviceCoverWasteGrid.loadGridData(this.inputParams);
    };
    ServiceCoverWasteGridComponent.prototype.setFilterValues = function (params) {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ServiceCoverNumber', this.ServiceCoverNumber);
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riGridMode', '0');
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.pageCurrent.toString());
    };
    ServiceCoverWasteGridComponent.prototype.refresh = function (event) {
        this.buildGrid(this.inputParams);
    };
    ServiceCoverWasteGridComponent.prototype.getServiceCoverNumber = function () {
        if (this.ServiceCoverRowID) {
            this.getServiceCoverNumberFromRowID();
        }
    };
    ServiceCoverWasteGridComponent.prototype.getServiceCoverNumberFromRowID = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['Function'] = 'GetServiceCoverFromRowID';
        formdata['SCRowID'] = this.ServiceCoverRowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            _this.ServiceCoverNumber = data.ServiceCoverNumber;
            _this.buildGrid(_this.inputParams);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverWasteGridComponent.prototype.getGridInfo = function (info) {
        this.serviceCoverWastePagination.totalItems = info.totalRows;
    };
    ServiceCoverWasteGridComponent.prototype.getCurrentPage = function (event) {
        this.pageCurrent = event.value;
        this.buildGrid(this.inputParams);
    };
    ServiceCoverWasteGridComponent.prototype.onGridRowDblClick = function (event) {
        switch (event.cellIndex) {
            case 3:
                this.updatePrimaryServiceCoverWaste(event.cellData.additionalData);
                break;
            case 2:
                var ServiceCoverWasteRowID = event.cellData.additionalData;
                var EWCCode = event.trRowData[0].text;
                if (ServiceCoverWasteRowID !== '?') {
                    this.deleteServiceCoverWaste(ServiceCoverWasteRowID);
                }
                else {
                    this.addServiceCoverWaste(ServiceCoverWasteRowID, EWCCode);
                }
        }
    };
    ServiceCoverWasteGridComponent.prototype.deleteServiceCoverWaste = function (ServiceCoverWasteRowID) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['Function'] = 'DeleteServiceCoverWaste';
        formdata['ServiceCoverWasteRowID'] = ServiceCoverWasteRowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
            }
            else {
                _this.buildGrid(_this.inputParams);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverWasteGridComponent.prototype.addServiceCoverWaste = function (ServiceCoverWasteRowID, EWCCode) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['Function'] = 'AddServiceCoverWaste';
        formdata['BusinessCode'] = this.utils.getBusinessCode();
        formdata['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        formdata['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        formdata['ProductCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        formdata['EWCCode'] = EWCCode;
        formdata['ServiceCoverNumber'] = this.ServiceCoverNumber;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
            }
            else {
                _this.buildGrid(_this.inputParams);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverWasteGridComponent.prototype.updatePrimaryServiceCoverWaste = function (ServiceCoverWasteRowID) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['Function'] = 'UpdatePrimaryServiceCoverWaste';
        formdata['ServiceCoverWasteRowID'] = ServiceCoverWasteRowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
            }
            else {
                _this.buildGrid(_this.inputParams);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverWasteGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverWasteGrid.html'
                },] },
    ];
    ServiceCoverWasteGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverWasteGridComponent.propDecorators = {
        'serviceCoverWasteGrid': [{ type: ViewChild, args: ['serviceCoverWasteGrid',] },],
        'serviceCoverWastePagination': [{ type: ViewChild, args: ['serviceCoverWastePagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return ServiceCoverWasteGridComponent;
}(BaseComponent));
