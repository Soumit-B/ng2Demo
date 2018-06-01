var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var CustomerInfoMaintenanceComponent = (function (_super) {
    __extends(CustomerInfoMaintenanceComponent, _super);
    function CustomerInfoMaintenanceComponent(injector, _router, el) {
        _super.call(this, injector);
        this._router = _router;
        this.el = el;
        this.pageId = '';
        this.controls = [
            { name: 'CustomerInfoNumber', readonly: true, disabled: false, required: false },
            { name: 'CustomerInfoName', readonly: true, disabled: false, required: false },
            { name: 'BranchNumber', readonly: true, disabled: false, required: false },
            { name: 'Mode', readonly: true, disabled: false, required: false },
            { name: 'CustomerPassNumber', readonly: true, disabled: false, required: false },
            { name: 'CustomerPassLevel', readonly: true, disabled: false, required: false },
            { name: 'CallingProg', readonly: true, disabled: false, required: false },
            { name: 'InfoLevel', readonly: true, disabled: false, required: false }
        ];
        this.errorNumber = true;
        this.curPage = 1;
        this.pageSize = 10;
        this.search = new URLSearchParams();
        this.queryParams = {
            operation: 'Application/iCABSACustomerInfoMaintenance',
            module: 'customer',
            method: 'contract-management/grid'
        };
        this.pageId = PageIdentifier.ICABSACUSTOMERINFOMAINTENANCE;
    }
    CustomerInfoMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        var strDocTitle = 'Customer Information Maintenance';
        this.getTranslatedValue(strDocTitle, null).subscribe(function (res) {
            if (res) {
                strDocTitle = res;
            }
            _this.utils.setTitle(strDocTitle);
        });
        this.window_onload();
    };
    CustomerInfoMaintenanceComponent.prototype.window_onload = function () {
        var businessCode = this.utils.getBusinessCode(), countryCode = this.utils.getCountryCode();
        this.riGrid.PageSize = 10;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.buildGrid();
    };
    CustomerInfoMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    CustomerInfoMaintenanceComponent.prototype.customerInfoChanged = function (obj) {
    };
    CustomerInfoMaintenanceComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    CustomerInfoMaintenanceComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ttCustomerInfoNumber', 'CustomerInformation', 'ttCustomerInfoNumber', MntConst.eTypeInteger, 9);
        this.riGrid.AddColumn('ttCustomerInfoName', 'CustomerInformation', 'ttCustomerInfoName', MntConst.eTypeText, 42);
        this.riGrid.AddColumn('ttOwningBranch', 'CustomerInformation', 'ttOwningBranch', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumn('ttGroupCount', 'CustomerInformation', 'ttGroupCount', MntConst.eTypeInteger, 9);
        this.riGrid.AddColumn('ttAccountCount', 'CustomerInformation', 'ttAccountCount', MntConst.eTypeInteger, 9);
        this.riGrid.AddColumn('ttContractCount', 'CustomerInformation', 'ttContractCount', MntConst.eTypeInteger, 9);
        this.riGrid.AddColumnAlign('ttCustomerInfoNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ttCustomerInfoName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('ttOwningBranch', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ttGroupCount', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('ttAccountCount', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ttContractCount', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnTabSupport('ttCustomerInfoNumber', true);
        this.riGrid.Complete();
    };
    CustomerInfoMaintenanceComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridParams.set('CustomerInfoNumber', this.uiForm.controls['CustomerInfoNumber'].value);
        gridParams.set('CustomerInfoName', this.uiForm.controls['CustomerInfoName'].value);
        gridParams.set('BranchNumber', this.uiForm.controls['BranchNumber'].value);
        gridParams.set(this.serviceConstants.GridHandle, '986332');
        gridParams.set(this.serviceConstants.GridCacheRefresh, 'yes');
        gridParams.set(this.serviceConstants.GridHeaderClickedColumn, '');
        gridParams.set('riSortOrder', 'Descending');
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data['errorNumber'] === 0 || data.errorMessage) {
                _this.errorNumber = false;
                return;
            }
            _this.curPage = data.pageData ? data.pageData.pageNumber : 1;
            _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
            _this.riGrid.Update = true;
            _this.riGrid.UpdateBody = true;
            _this.riGrid.UpdateHeader = true;
            _this.riGrid.Execute(data);
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    CustomerInfoMaintenanceComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    CustomerInfoMaintenanceComponent.prototype.refresh = function () {
        if (this.getControlValue('CustomerInfoNumber') || this.getControlValue('CustomerInfoNumber') !== '') {
            if (/^[0-9]+$/.test(this.getControlValue('CustomerInfoNumber'))) {
                this.errorNumber = true;
                this.riGrid.RefreshRequired();
                this.riGrid_BeforeExecute();
            }
            else {
                this.errorNumber = false;
            }
        }
        else {
            this.errorNumber = true;
            this.riGrid.RefreshRequired();
            this.riGrid_BeforeExecute();
        }
    };
    CustomerInfoMaintenanceComponent.prototype.riGrid_BodyOnClick = function (event) {
        this.CustomerInformationFocus(event.srcElement);
        this.uiForm.controls['CustomerInfoNumber'].setValue(this.riGrid.Details.GetValue('ttCustomerInfoNumber'));
        this.uiForm.controls['CustomerInfoName'].setValue(this.riGrid.Details.GetValue('ttCustomerInfoName'));
    };
    CustomerInfoMaintenanceComponent.prototype.riGrid_BodyOnDblClick = function (event) {
        switch (this.riGrid.CurrentColumnName) {
            case 'ttCustomerInfoNumber':
                this.router.navigate(['/maintenance/customerinformation'], {
                    queryParams: {
                        parentMode: 'Update',
                        Mode: 'Update',
                        CustomerInfoNumber: this.uiForm.controls['CustomerInfoNumber'].value
                    }
                });
                break;
            case 'GroupAccounts':
                break;
            case 'Accounts':
                break;
            case 'Contracts':
                this.uiForm.controls['CustomerInfoNumber'].setValue(event.trRowData[0].text);
                this.uiForm.controls['CustomerInfoName'].setValue(event.trRowData[1].text);
                break;
            default:
                break;
        }
    };
    CustomerInfoMaintenanceComponent.prototype.riGrid_BodyOnKeyDown = function (event) {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.CustomerInformationFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.CustomerInformationFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
        }
    };
    CustomerInfoMaintenanceComponent.prototype.riExchange_UpdateHTMLDocument = function () {
        if (this.uiForm.controls['Mode'].value === 'Existing') {
            this.uiForm.controls['Mode'].setValue('New');
            this.uiForm.controls['CustomerInfoNumber'].setValue(this.uiForm.controls['CustomerPassNumber'].value);
            this.uiForm.controls['InfoLevel'].setValue(this.uiForm.controls['CustomerPassLevel'].value);
            this.riGrid_BodyOnDblClick(new Event('Default'));
        }
    };
    CustomerInfoMaintenanceComponent.prototype.CustomerInformationFocus = function (rsrcElement) {
        rsrcElement.select();
        rsrcElement.focus();
    };
    CustomerInfoMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSACustomerInfoMaintenance.html'
                },] },
    ];
    CustomerInfoMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
        { type: ElementRef, },
    ];
    CustomerInfoMaintenanceComponent.propDecorators = {
        'customerInfoMaintainencePagination': [{ type: ViewChild, args: ['customerInfoMaintainencePagination',] },],
        'customerInfoMaintainenceGrid': [{ type: ViewChild, args: ['customerInfoMaintainenceGrid',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return CustomerInfoMaintenanceComponent;
}(BaseComponent));
