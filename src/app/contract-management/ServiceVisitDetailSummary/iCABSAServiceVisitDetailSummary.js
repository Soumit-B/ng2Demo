var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var ServiceVisitDetailSummaryComponent = (function (_super) {
    __extends(ServiceVisitDetailSummaryComponent, _super);
    function ServiceVisitDetailSummaryComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Application/iCABSAServiceVisitDetailSummary',
            module: 'service',
            method: 'service-delivery/maintenance'
        };
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: true },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: true },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: true, required: true },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false },
            { name: 'ServiceVisitAnnivDate', readonly: true, disabled: true, required: false },
            { name: 'ServiceDateStart', readonly: true, disabled: true, required: true },
            { name: 'ServiceDateEnd', readonly: true, disabled: true, required: true },
            { name: 'SharedVisitInd', readonly: true, disabled: true, required: false },
            { name: 'VisitTypeCode', readonly: true, disabled: true, required: false },
            { name: 'ServiceVisitRowID', readonly: true, disabled: true, required: false },
            { name: 'Menu', readonly: false, disabled: false, required: false, value: '' }
        ];
        this.ServiceDateStart = new Date();
        this.dtServiceVisitAnnivDate = new Date();
        this.dtServiceDateStart = new Date();
        this.dtServiceDateEnd = new Date();
        this.ServiceDateEnd = new Date();
        this.ServiceVisitAnnivDate = new Date();
        this.menudisplay = true;
        this.showCloseButton = true;
        this.showErrorHeader = true;
        this.showHeader = true;
        this.rowId = '';
        this.pageId = '';
        this.search = this.getURLSearchParamObject();
        this.isRequesting = false;
        this.curPage = 1;
        this.pageSize = 10;
        this.pageId = PageIdentifier.ICABSASERVICEVISITDETAILSUMMARY;
    }
    ServiceVisitDetailSummaryComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getSysCharDtetails();
    };
    ServiceVisitDetailSummaryComponent.prototype.windowOnload = function () {
        this.riGrid.PageSize = this.pageSize;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.ServiceVisitAnnivDateString = this.utils.formatDate(this.ServiceVisitAnnivDate);
        this.vbEnableDetailLocations = 'False';
        if (this.pageParams.vSCEnableDetailLocations) {
            this.vbEnableDetailLocations = 'True';
        }
        this.attributes.CurrentContractType = this.riExchange.setCurrentContractType();
        this.SetVBVariables();
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.attributes.CurrentContractType);
        if (this.parentMode === 'Summary') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', this.riExchange.getParentHTMLValue('ServiceVisitFrequency'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitAnnivDate', this.riExchange.getParentHTMLValue('ServiceVisitAnnivDate'));
            if (this.riExchange.getParentAttributeValue('ContractNumberServiceVisitRowID')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentAttributeValue('ContractNumberServiceVisitRowID'));
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentHTMLValue('ContractNumberServiceVisitRowID'));
            }
        }
        if (this.parentMode === 'ServiceVisit') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', this.riExchange.getParentHTMLValue('ServiceVisitFrequency'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitAnnivDate', this.riExchange.getParentHTMLValue('ServiceVisitAnnivDate'));
            if (this.riExchange.GetParentRowID(this.uiForm, 'ServiceVisit')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.GetParentRowID(this.uiForm, 'ServiceVisit'));
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentHTMLValue('ServiceVisit'));
            }
        }
        if (this.parentMode === 'GeneralSearchInfo') {
            this.menudisplay = false;
            if (this.riExchange.getParentAttributeValue('riGridSystemInvoiceNumber')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentAttributeValue('riGridSystemInvoiceNumber'));
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentHTMLValue('riGridSystemInvoiceNumber'));
            }
        }
        if (this.parentMode === 'VisitDetail') {
            if (this.riExchange.getParentAttributeValue('grdGroupServiceVisitSystemInvoiceNumber')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentAttributeValue('grdGroupServiceVisitSystemInvoiceNumber'));
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentHTMLValue('grdGroupServiceVisitSystemInvoiceNumber'));
            }
        }
        this.populateDescriptions();
        this.buildGrid();
        this.riGrid_BeforeExecute();
        this.blnUpdated = false;
    };
    ServiceVisitDetailSummaryComponent.prototype.SetVBVariables = function () {
        this.SCEnableVisitDurations = 'True';
        this.SCEnableVisitCostings = 'True';
    };
    ServiceVisitDetailSummaryComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableLocations];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vSCEnableDetailLocations = record[0]['Logical'];
            _this.windowOnload();
        });
    };
    ServiceVisitDetailSummaryComponent.prototype.getCurrentPage = function (currentPage) {
        if (this.riGrid.Mode === MntConst.eModeUpdate) {
            return;
        }
        else {
            this.curPage = currentPage.value;
            this.riGrid.Update = true;
            this.riGrid.UpdateHeader = true;
            this.riGrid.UpdateRow = true;
            this.riGrid.UpdateFooter = true;
            this.riGrid_BeforeExecute();
        }
    };
    ServiceVisitDetailSummaryComponent.prototype.refresh = function () {
        if (this.riGrid.Mode === MntConst.eModeUpdate) {
            return;
        }
        else {
            this.riGrid.RefreshRequired();
            this.riGrid_BeforeExecute();
        }
    };
    ServiceVisitDetailSummaryComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    ServiceVisitDetailSummaryComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ServiceVisitDetailDate', 'ServiceVisitDetail', 'ServiceVisitDetailDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ServiceVisitDetailTimeStart', 'ServiceVisitDetail', 'ServiceVisitDetailTimeStart', MntConst.eTypeTime, 5);
        this.riGrid.AddColumn('ServiceVisitDetailTimeEnd', 'ServiceVisitDetail', 'ServiceVisitDetailTimeEnd', MntConst.eTypeTime, 5);
        this.riGrid.AddColumn('ChangeProcessDate', 'ServiceVisitDetail', 'ChangeProcessDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ServicedQuantity', 'ServiceVisitDetail', 'ServicedQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumn('EmployeeCode', 'ServiceVisitDetail', 'EmployeeCode', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('ServiceVisitDetailDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceVisitDetailTimeStart', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceVisitDetailTimeEnd', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ChangeProcessDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServicedQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentLeft);
        if (this.SCEnableVisitDurations) {
            this.riGrid.AddColumn('StandardDuration', 'ServiceVisitDetail', 'StandardDuration', MntConst.eTypeTime, 5);
            this.riGrid.AddColumn('OvertimeDuration', 'ServiceVisitDetail', 'OvertimeDuration', MntConst.eTypeTime, 5);
            this.riGrid.AddColumnAlign('StandardDuration', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnAlign('OvertimeDuration', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnUpdateSupport('OvertimeDuration', true);
            this.riGrid.AddColumnUpdateSupport('ServiceVisitDetailTimeStart', true);
            this.riGrid.AddColumnUpdateSupport('ServiceVisitDetailTimeEnd', true);
        }
        if (this.SCEnableVisitCostings) {
            this.riGrid.AddColumn('ServiceVisitCost', 'ServiceVisitDetail', 'ServiceVisitCost', MntConst.eTypeCurrency, 10);
            this.riGrid.AddColumn('TotalCost', 'ServiceVisitDetail', 'TotalCost', MntConst.eTypeCurrency, 10);
            this.riGrid.AddColumnAlign('ServiceVisitCost', MntConst.eAlignmentRight);
            this.riGrid.AddColumnAlign('TotalCost', MntConst.eAlignmentRight);
        }
        this.riGrid.Complete();
    };
    ServiceVisitDetailSummaryComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('ServiceVisitRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID'));
        gridParams.set('ServiceVisitDetailRowID', this.attributes.ContractNumberServiceVisitDetailRowID);
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, '1246324');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('riSortOrder', 'Descending');
        gridParams.set('HeaderClickedColumn', '');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
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
    ServiceVisitDetailSummaryComponent.prototype.riGrid_AfterExecute = function () {
        this.riGrid.RefreshRequired();
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    };
    ServiceVisitDetailSummaryComponent.prototype.riGrid_BodyOnClick = function (event) {
        this.serviceVisitDetailFocus(event.srcElement);
    };
    ServiceVisitDetailSummaryComponent.prototype.riGrid_BodyOnDblClick = function (event) {
        switch (this.riGrid.CurrentColumnName) {
            case 'ServiceVisitDetailDate':
                this.mode = 'ViewOnly';
                break;
            default:
                this.mode = 'Update';
        }
        this.messageModal.show({ msg: 'Service/iCABSSeServiceVisitDetailMaintenance - Page not developed', title: '' }, false);
    };
    ServiceVisitDetailSummaryComponent.prototype.serviceVisitDetailFocus = function (rsrcElement) {
        var oTR = rsrcElement.parentElement.parentElement.parentElement;
        this.attributes.ContractNumberServiceVisitDetailRowID = oTR.children[0].children[0].children[0].getAttribute('rowid');
    };
    ServiceVisitDetailSummaryComponent.prototype.riGrid_BodyOnKeyDown = function (event) {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.serviceVisitDetailFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
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
                                this.serviceVisitDetailFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
        }
    };
    ServiceVisitDetailSummaryComponent.prototype.riGrid_OnBlur = function (event) {
        this.attributes.ContractNumberServiceVisitDetailRowID = this.riGrid.Details.GetAttribute('ServiceVisitDetailDate', 'rowid');
        this.updateGrid(event);
    };
    ServiceVisitDetailSummaryComponent.prototype.updateGrid = function (data) {
        var _this = this;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('ServiceVisitDetailDateRowID', this.attributes.ContractNumberServiceVisitDetailRowID);
        gridParams.set('ServiceVisitDetailDate', this.riGrid.Details.GetValue('ServiceVisitDetailDate'));
        gridParams.set('ServiceVisitDetailTimeStartRowID', this.riGrid.Details.GetAttribute('ServiceVisitDetailTimeStart', 'rowid'));
        gridParams.set('ServiceVisitDetailTimeEndRowID', this.riGrid.Details.GetAttribute('ServiceVisitDetailTimeEnd', 'rowid'));
        gridParams.set('ChangeProcessDate', this.riGrid.Details.GetValue('ChangeProcessDate'));
        gridParams.set('ServicedQuantity', this.riGrid.Details.GetValue('ServicedQuantity'));
        gridParams.set('EmployeeCode', this.riGrid.Details.GetValue('EmployeeCode'));
        gridParams.set('StandardDuration', this.riGrid.Details.GetValue('StandardDuration'));
        gridParams.set('OvertimeDurationRowID', this.riGrid.Details.GetAttribute('OvertimeDurationRowID', 'rowid'));
        gridParams.set('ServiceVisitCost', this.riGrid.Details.GetValue('ServiceVisitCost'));
        gridParams.set('TotalCost', this.riGrid.Details.GetValue('TotalCost'));
        gridParams.set('ServiceVisitRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID'));
        gridParams.set('ServiceVisitDetailRowID', this.attributes.ContractNumberServiceVisitDetailRowID);
        gridParams.set('ServiceVisitDetailTimeStart', this.utils.TimeValue(this.riGrid.Details.GetValue('ServiceVisitDetailTimeStart')).toString());
        gridParams.set('ServiceVisitDetailTimeEnd', this.utils.TimeValue(this.riGrid.Details.GetValue('ServiceVisitDetailTimeEnd')).toString());
        gridParams.set('OvertimeDuration', this.utils.TimeValue(this.riGrid.Details.GetValue('OvertimeDuration')).toString());
        gridParams.set(this.serviceConstants.GridMode, '3');
        gridParams.set(this.serviceConstants.GridHandle, '1246324');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('riSortOrder', 'Descending');
        gridParams.set('HeaderClickedColumn', '');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data['errorMessage']) {
                _this.messageModal.show({ msg: data['errorMessage'], title: '' }, false);
            }
            _this.riGrid.Mode = MntConst.eModeNormal;
        }, function (error) {
            _this.messageModal.show({ msg: error, title: '' }, false);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceVisitDetailSummaryComponent.prototype.onChangeEvent = function (event) {
        alert('iCABSSeServiceVisitDetailMaintenance.htm is not in scope of this sprint');
    };
    ServiceVisitDetailSummaryComponent.prototype.populateDescriptions = function () {
        var _this = this;
        var postParamsPopulate = {};
        var searchGetpopulate = this.getURLSearchParamObject();
        searchGetpopulate.set(this.serviceConstants.Action, '6');
        postParamsPopulate.Function = 'SetDisplayFields';
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID') !== null || this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID') !== undefined || this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID') === '') {
            postParamsPopulate.ServiceVisitRowID = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID');
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchGetpopulate, postParamsPopulate)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverNumber', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitNumber', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'VisitTypeCode', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceDateStart', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceDateEnd', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SharedVisitInd', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitAnnivDate', '');
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', e.ContractNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', e.ContractName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', e.PremiseNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', e.PremiseName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', e.ProductCode);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', e.ProductDesc);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverNumber', e.ServiceCoverNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitNumber', e.ServiceVisitNumber);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'VisitTypeCode', e.VisitTypeCode);
                if (e.ServiceDateStart) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceDateStart', e.ServiceDateStart);
                    _this.selDateServiceDateStart();
                }
                if (e.ServiceDateEnd) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceDateEnd', e.ServiceDateEnd);
                    _this.selDateServiceDateEnd();
                }
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceDateEnd', e.ServiceDateEnd);
                if (e.SharedVisitInd) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SharedVisitInd', _this.utils.convertResponseValueToCheckboxInput(e.SharedVisitInd));
                }
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', e.ServiceVisitFrequency);
                if (e.ServiceVisitAnnivDate) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitAnnivDate', e.ServiceVisitAnnivDate);
                    _this.selDateServiceVisitAnnivDate();
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceVisitDetailSummaryComponent.prototype.selDateServiceVisitAnnivDate = function () {
        this.dtServiceVisitAnnivDate = this.utils.convertDate(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitAnnivDate'));
    };
    ServiceVisitDetailSummaryComponent.prototype.selDateServiceDateStart = function () {
        this.dtServiceDateStart = this.utils.convertDate(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceDateStart'));
    };
    ServiceVisitDetailSummaryComponent.prototype.selDateServiceDateEnd = function () {
        this.dtServiceDateEnd = this.utils.convertDate(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceDateEnd'));
    };
    ServiceVisitDetailSummaryComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceVisitDetailSummaryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceVisitDetailSummary.html'
                },] },
    ];
    ServiceVisitDetailSummaryComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceVisitDetailSummaryComponent.propDecorators = {
        'servicevisitdetailGrid': [{ type: ViewChild, args: ['servicevisitdetailGrid',] },],
        'servicevisitdetailPagination': [{ type: ViewChild, args: ['servicevisitdetailPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return ServiceVisitDetailSummaryComponent;
}(BaseComponent));
