var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { InternalMaintenanceModuleRoutes } from './../../base/PageRoutes';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var ServiceCoverComponent = (function (_super) {
    __extends(ServiceCoverComponent, _super);
    function ServiceCoverComponent(injector) {
        _super.call(this, injector);
        this.injector = injector;
        this.queryParams = {
            operation: 'Sales/iCABSSSOServiceCoverGrid',
            module: 'advantage',
            method: 'prospect-to-contract/maintenance'
        };
        this.controls = [
            { name: 'dlContractRef', readonly: true, disabled: true, required: false },
            { name: 'dlPremiseRef', readonly: true, disabled: true, required: false },
            { name: 'menu' },
            { name: 'dlBatchRef' },
            { name: 'Misc' },
            { name: 'SubSystem' },
            { name: 'UpdateableInd' },
            { name: 'AutoCloseWindow' },
            { name: 'PNOLSetupChargeRequired' },
            { name: 'ContractTypeCode' },
            { name: 'dlPremiseROWID' }
        ];
        this.pageId = '';
        this.tdOptions = false;
        this.showMessageHeader = true;
        this.promptTitle = '';
        this.promptContent = '';
        this.showErrorHeader = true;
        this.pageSize = 10;
        this.curPage = 1;
        this.search = new URLSearchParams();
        this.pageId = PageIdentifier.ICABSSSOSERVICECOVERGRID;
    }
    ServiceCoverComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.windowOnload();
    };
    ServiceCoverComponent.prototype.windowOnload = function () {
        var _this = this;
        this.riGrid.PageSize = 10;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.setControlValue('dlBatchRef', this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.setControlValue('dlContractRef', this.riExchange.getParentHTMLValue('dlContractRef'));
        this.setControlValue('dlPremiseRef', this.riExchange.getParentAttributeValue('dlPremiseRef'));
        this.setControlValue('ContractTypeCode', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.setControlValue('SubSystem', this.riExchange.getParentHTMLValue('SubSystem'));
        var searchParams = new URLSearchParams();
        var bodyParams = {};
        bodyParams['Function'] = 'Updateable';
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set('dlBatchRef', this.getControlValue('dlBatchRef'));
        searchParams.set('dlContractRef', this.getControlValue('dlContractRef'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (data) {
            if (data.hasError) {
                _this.errorModal.show(data, true);
            }
            else {
                _this.UpdateableIndValue = data;
                _this.setControlValue('UpdateableInd', _this.UpdateableIndValue);
                if (_this.getControlValue('dlBatchRef') !== 'All' && _this.UpdateableIndValue) {
                    _this.tdOptions = false;
                }
                if (_this.getControlValue('dlPremiseROWID') !== '') {
                    _this.attributes.dlPremiseROWID = _this.riExchange.getParentHTMLValue('dlPremiseROWID');
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        this.buildGrid();
        this.riGrid_BeforeExecute();
    };
    ServiceCoverComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('PremiseNumber', 'SOServiceCover', 'PremiseNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('PremiseName', 'SOServiceCover', 'PremiseName', MntConst.eTypeTextFree, 20);
        this.riGrid.AddColumn('PremiseAddressLine1', 'SOServiceCover', 'PremiseAddressLine1', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('PremisePostCode', 'SOServiceCover', 'PremisePostCode', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('ServiceCoverNumber', 'SOServiceCover', 'ServiceCoverNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('SCContractTypeCode', 'SOServiceCover', 'SCContractTypeCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumn('dlStatusCode', 'SOServiceCover', 'dlStatusCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumn('ServiceCommenceDate', 'SOServiceCover', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ProductCode', 'SOServiceCover', 'ProductCode', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceCoverNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('SCContractTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('dlStatusCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremiseAddressLine1', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremisePostCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('PremiseNumber', true);
        this.riGrid.AddColumnOrderable('ProductCode', true);
        this.riGrid.AddColumnOrderable('PremisePostCode', true);
        this.riGrid.Complete();
    };
    ServiceCoverComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('dlBatchRef', this.getControlValue('dlBatchRef'));
        gridParams.set('dlContractRef', this.getControlValue('dlContractRef'));
        gridParams.set('dlPremiseRef', this.getControlValue('dlPremiseRef'));
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                _this.errorModal.show(data, true);
            }
            else {
                _this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 1 : 1;
                _this.riGrid.Update = true;
                _this.riGrid.UpdateBody = true;
                _this.riGrid.UpdateFooter = true;
                _this.riGrid.UpdateHeader = true;
                _this.riGrid.Execute(data);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverComponent.prototype.riGrid_BodyOnClick = function (data) {
        if (this.riGrid.CurrentColumnName === 'PremiseNumber' || this.riGrid.CurrentColumnName === 'ServiceCoverNumber') {
            this.SOServiceCoverFocus(data.srcElement);
        }
    };
    ServiceCoverComponent.prototype.SOServiceCoverFocus = function (rsrcElement) {
        var oTR = rsrcElement.parentElement.parentElement.parentElement.children[4].children[0].children[0];
        this.attributes.dlPremiseROWID = this.riGrid.Details.GetAttribute('PremiseNumber', 'rowid');
        this.attributes.dlServiceCoverRowID = this.riGrid.Details.GetAttribute('ServiceCoverNumber', 'rowid');
        this.attributes.dlServiceCoverRef = this.riGrid.Details.GetAttribute('ServiceCoverNumber', 'additionalproperty');
        this.attributes.ProductCode = this.riGrid.Details.GetValue('ProductCode');
        this.attributes.ProductDesc = this.riGrid.Details.GetAttribute('ProductCode', 'additionalproperty');
        this.attributes.ServiceCommenceDate = this.riGrid.Details.GetValue('ServiceCommenceDate');
        this.setControlValue('ContractTypeCode', this.riGrid.Details.GetValue('SCContractTypeCode'));
        oTR.focus();
        oTR.select();
    };
    ServiceCoverComponent.prototype.riGrid_BodyOnDblClick = function (data) {
        this.riGrid_BodyOnClick(data);
        switch (this.riGrid.CurrentColumnName) {
            case 'PremiseNumber':
                this.navigate('SOPremise', '/maintenance/sdlpremisemaintenance', {
                    'dlPremiseROWID': this.attributes.dlPremiseROWID,
                    'dlBatchRef': this.getControlValue('dlBatchRef'),
                    'dlContractRef': this.getControlValue('dlContractRef'),
                    'dlPremiseRef': this.getControlValue('dlPremiseRef')
                });
                break;
            case 'ServiceCoverNumber':
                this.navigate('ServiceCoverUpdate', InternalMaintenanceModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE, {
                    dlServiceCoverRowID: this.attributes.dlServiceCoverRowID,
                    ContractTypeCode: this.getControlValue('ContractTypeCode'),
                    dlPremiseRef: this.getControlValue('dlPremiseRef'),
                    SubSystem: this.getControlValue('SubSystem')
                });
                break;
            default:
                break;
        }
    };
    ServiceCoverComponent.prototype.riGrid_BodyOnKeyDown = function (event) {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.SOServiceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
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
                                this.SOServiceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
        }
    };
    ServiceCoverComponent.prototype.riExchange_UpDateHTMLDocument = function (data) {
        if (this.PNOLSetupChargeRequiredValue && this.getControlValue('ContractTypeCode') === 'C') {
            this.PNOLSetupChargeRequiredValue = false;
            var msgContent = { title: '', msg: 'This page iCABSSPNOLSetupChargeEntry.htm is not available' };
            this.messageModal.show(msgContent, false);
        }
    };
    ServiceCoverComponent.prototype.menuOnchange = function () {
        var selectedValue = this.uiForm.controls['menu'].value;
        if (selectedValue === 'AddServiceCover') {
            this.navigate('ServiceCoverUpdate', InternalMaintenanceModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE);
        }
    };
    ServiceCoverComponent.prototype.riExchange_UnLoadHTMLDocument = function (data) {
        this.riExchange_UpDateHTMLDocument(data);
    };
    ServiceCoverComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    ServiceCoverComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    ServiceCoverComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    ServiceCoverComponent.prototype.promptSave = function (event) {
    };
    ServiceCoverComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSSOServiceCoverGrid.html'
                },] },
    ];
    ServiceCoverComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverComponent.propDecorators = {
        'serviceCoverGrid': [{ type: ViewChild, args: ['serviceCoverGrid',] },],
        'serviceCoverGridPagination': [{ type: ViewChild, args: ['serviceCoverGridPagination',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return ServiceCoverComponent;
}(BaseComponent));
