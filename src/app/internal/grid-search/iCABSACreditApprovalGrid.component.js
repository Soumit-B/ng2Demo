var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ServiceCoverSearchComponent } from './../search/iCABSAServiceCoverSearch';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from '../../../app/internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { URLSearchParams } from '@angular/http';
export var CreditApprovalGridComponent = (function (_super) {
    __extends(CreditApprovalGridComponent, _super);
    function CreditApprovalGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'ValueFrom', readonly: true, disabled: false, required: false },
            { name: 'ValueTo', readonly: true, disabled: false, required: false },
            { name: 'StaDate', readonly: true, disabled: true, required: false },
            { name: 'EndDateTo', readonly: true, disabled: true, required: false },
            { name: 'DateFrom', readonly: true, disabled: true, required: false },
            { name: 'DateTo', readonly: true, disabled: true, required: false },
            { name: 'BranchFilter', readonly: true, disabled: false, required: false },
            { name: 'ResultsFilter', readonly: true, disabled: false, required: false },
            { name: 'InvoiceCreditFilter', readonly: true, disabled: false, required: false },
            { name: 'ContractLevelInd', readonly: true, disabled: false, required: false }
        ];
        this.contractSearchComponent = ContractSearchComponent;
        this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        this.contractSearchParams = {
            'parentMode': 'ContractSearch',
            'currentContractType': 'C',
            'currentContractTypeURLParameter': '<contract>',
            'showAddNew': false,
            'ContractNumber': '',
            'ContractName': ''
        };
        this.serviceCoverSearchParams = {
            'parentMode': 'Search',
            'ContractNumber': '',
            'PremiseNumber': '',
            'showAddNew': false
        };
        this.isContractEllipsisDisabled = false;
        this.showCloseButton = true;
        this.showHeader = true;
        this.xhrParams = {
            operation: 'Application/iCABSACreditApprovalGrid',
            module: 'credit-approval',
            method: 'bill-to-cash/maintenance'
        };
        this.inputParams = {};
        this.search = new URLSearchParams();
        this.inputParamsAccountPremise = {
            'parentMode': 'LookUp',
            'pageTitle': 'Premise Search',
            'ContractNumber': ''
        };
        this.maxColumn = 16;
        this.itemsPerPage = 10;
        this.pageCurrent = 1;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.totalRecords = 1;
        this.dateObj = {
            StaDate: {
                disabled: true,
                dt: null
            },
            EndDateTo: {
                disabled: true,
                dt: null
            },
            DateFrom: {
                disabled: true,
                dt: null
            },
            DateTo: {
                disabled: true,
                dt: null
            }
        };
        this.pageId = PageIdentifier.ICABSACREDITAPPROVALGRID;
        this.setURLQueryParameters(this);
    }
    CreditApprovalGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        var translation = this.getTranslatedValue('Credit Approval').toPromise();
        translation.then(function (resp) {
            _this.utils.setTitle(resp);
        });
        this.pageTitle = 'Approve Invoice Charges/Credits';
        this.premiseSearchComponent = PremiseSearchComponent;
        this.screenNotReadyComponent = ScreenNotReadyComponent;
        this.uiElements = this.riExchange.riInputElement;
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = 10;
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.BuildGrid();
        }
        else {
            this.pageParams.tdDate = false;
            this.getSysCharAndValues();
        }
    };
    CreditApprovalGridComponent.prototype.getSysCharAndValues = function (loadgrid) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableChargeCreditApprovalAtContractLevel
        ];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.blnApprovalAtContractLevel = record[0].Required;
            _this.getValues(loadgrid);
        });
    };
    CreditApprovalGridComponent.prototype.getValues = function (loadgrid) {
        var _this = this;
        var lookupIP = [
            {
                'table': 'SystemParameter',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['SystemParameterEndOfWeekDay']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var SystemParameter = data[0];
            var vEndofWeekDay;
            if (SystemParameter && SystemParameter.SystemParameterEndOfWeekDay < 7) {
                vEndofWeekDay = SystemParameter.SystemParameterEndOfWeekDay;
            }
            else {
                vEndofWeekDay = 1;
            }
            var today = new Date();
            _this.pageParams.vbEndofWeekDate = _this.utils.addDays(today, ((7 - today.getDay()) + vEndofWeekDay - 1));
            var tempDate = _this.pageParams.vbEndofWeekDate.toString();
            if (window['moment'](tempDate, 'DD/MM/YYYY', true).isValid()) {
                tempDate = _this.utils.convertDate(tempDate);
            }
            else {
                tempDate = _this.utils.formatDate(tempDate);
            }
            _this.pageParams.vbEndofWeekDate = new Date(tempDate);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.window_onload(loadgrid);
        });
    };
    CreditApprovalGridComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    CreditApprovalGridComponent.prototype.ngAfterViewInit = function () {
        if (this.contractEllipsis && !this.isReturning()) {
        }
        if (this.isReturning()) {
            this.dateObj.DateFrom.dt = new Date(this.getControlValue('DateFrom'));
            this.dateObj.DateTo.dt = new Date(this.utils.convertDate(this.getControlValue('DateTo')));
            this.dateObj.StaDate.dt = new Date(this.getControlValue('StaDate'));
            this.dateObj.EndDateTo.dt = new Date(this.utils.convertDate(this.getControlValue('EndDateTo')));
            this.loadData();
        }
    };
    CreditApprovalGridComponent.prototype.getURLQueryParameters = function (param) {
        if (param.readonly === 'true') {
            this.pageParams.verReadOnly = true;
        }
        else {
            this.pageParams.verReadOnly = false;
        }
    };
    CreditApprovalGridComponent.prototype.window_onload = function (loadgrid) {
        var today = new Date();
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.setControlValue('BranchFilter', 'Selected');
        this.setControlValue('ResultsFilter', 'Awaiting');
        this.setControlValue('InvoiceCreditFilter', 'C');
        this.dateObj.DateFrom.dt = new Date(today.setDate(1));
        this.dateObj.DateTo.dt = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.dateObj.StaDate.dt = this.utils.removeDays(this.pageParams.vbEndofWeekDate, 6);
        this.dateObj.EndDateTo.dt = this.pageParams.vbEndofWeekDate;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', this.utils.formatDate(this.dateObj.DateFrom.dt).toString());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.utils.formatDate(this.dateObj.DateTo.dt).toString());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'StaDate', this.utils.formatDate(this.dateObj.StaDate.dt).toString());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDateTo', this.utils.formatDate(this.dateObj.EndDateTo.dt).toString());
        if (!(this.riExchange.URLParameterContains('contract') || this.riExchange.URLParameterContains('job') || this.riExchange.URLParameterContains('product'))) {
            this.pageParams.currentContractType = '';
            this.pageParams.currentContractTypeURLParameter = '';
        }
        if (this.pageParams.blnApprovalAtContractLevel) {
            this.pageParams.tdContractLevelInd = true;
            this.setControlValue('ContractLevelInd', true);
        }
        else {
            this.pageParams.tdContractLevelInd = false;
            this.setControlValue('ContractLevelInd', false);
        }
        if (!this.pageParams.verReadOnly) {
            this.GetValues();
        }
        this.BuildGrid();
        if (loadgrid) {
            this.loadData();
        }
    };
    CreditApprovalGridComponent.prototype.GetValues = function () {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSCreditApprovalGrid.p';
        this.riMaintenance.PostDataAdd('Function', 'GetValues', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('ValueTo', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('ValueFrom', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ValueFrom', data['ValueFrom']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ValueTo', data['ValueTo']);
        }, 'POST');
    };
    CreditApprovalGridComponent.prototype.loadData = function () {
        var _this = this;
        this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        this.search = this.getURLSearchParamObject();
        this.search.set('action', '2');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('ContractNumber', this.uiElements.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.uiElements.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ProductCode', this.uiElements.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('BranchFilter', this.getControlValue('BranchFilter'));
        this.search.set('ResultsFilter', this.getControlValue('ResultsFilter'));
        this.search.set('ReadOnly', this.pageParams.verReadOnly);
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('DateFrom', this.getControlValue('DateFrom'));
        this.search.set('DateTo', this.getControlValue('DateTo'));
        this.search.set('StaDate', this.uiElements.GetValue(this.uiForm, 'StaDate'));
        this.search.set('EndDateTo', this.uiElements.GetValue(this.uiForm, 'EndDateTo'));
        this.search.set('ValueFrom', this.uiElements.GetValue(this.uiForm, 'ValueFrom'));
        this.search.set('ValueTo', this.uiElements.GetValue(this.uiForm, 'ValueTo'));
        this.search.set('ContractLevelInd', this.uiElements.GetValue(this.uiForm, 'ContractLevelInd'));
        this.search.set('InvoiceCredit', this.getControlValue('InvoiceCreditFilter'));
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '5112610');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set('riSortOrder', sortOrder);
        this.inputParams.method = this.xhrParams.method;
        this.inputParams.operation = this.xhrParams.operation;
        this.inputParams.module = this.xhrParams.module;
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            if (data) {
                _this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                _this.riGrid.Update = true;
                _this.riGrid.UpdateBody = true;
                _this.riGrid.UpdateFooter = true;
                _this.riGrid.UpdateHeader = true;
                if (data && data.errorMessage) {
                    _this.messageModal1.show(data, true);
                }
                else {
                    _this.riGrid.Execute(data);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.messageModal1.show({ msg: MessageConstant.Message.GeneralError, title: 'Error' }, false);
            _this.totalRecords = 1;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    CreditApprovalGridComponent.prototype.updateRowData = function (e) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.riGrid.UpdateHeader = false;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.search.set('action', '2');
        this.search.set('ContractNumRowID', this.riGrid.Details.GetAttribute('ContractNum', 'RowID'));
        this.search.set('ContractNum', this.riGrid.Details.GetValue('ContractNum'));
        this.search.set('PremNumRowID', this.riGrid.Details.GetAttribute('PremNum', 'RowID'));
        this.search.set('PremNum', this.riGrid.Details.GetValue('PremNum'));
        this.search.set('PremName', this.riGrid.Details.GetValue('PremName'));
        this.search.set('ProdCodeRowID', this.riGrid.Details.GetAttribute('ProdCode', 'RowID'));
        this.search.set('ProdCode', this.riGrid.Details.GetValue('ProdCode'));
        this.search.set('StartDateRowID', this.riGrid.Details.GetAttribute('StartDate', 'RowID'));
        this.search.set('StartDate', this.riGrid.Details.GetValue('StartDate'));
        this.search.set('EndDate', this.riGrid.Details.GetValue('EndDate'));
        this.search.set('ServiceBranchNum', this.riGrid.Details.GetValue('ServiceBranchNum'));
        this.search.set('StatusCode', this.riGrid.Details.GetValue('StatusCode'));
        this.search.set('ServiceSalesEmp', this.riGrid.Details.GetValue('ServiceSalesEmp'));
        this.search.set('ServiceQty', this.riGrid.Details.GetValue('ServiceQty'));
        this.search.set('SalesStatsProcessDate', this.riGrid.Details.GetValue('SalesStatsProcessDate'));
        this.search.set('ProRataChargeValue', this.riGrid.Details.GetValue('ProRataChargeValue'));
        this.search.set('InvoiceCredit', this.getControlValue('InvoiceCreditFilter'));
        this.search.set('AdditionalCreditInfoRowID', this.riGrid.Details.GetAttribute('AdditionalCreditInfo', 'RowID'));
        this.search.set('AdditionalCreditInfo', this.riGrid.Details.GetValue('AdditionalCreditInfo'));
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('ProductCode', this.getControlValue('ProductCode'));
        this.search.set('BranchFilter', this.getControlValue('BranchFilter'));
        this.search.set('ResultsFilter', this.getControlValue('ResultsFilter'));
        this.search.set('ReadOnly', this.pageParams.verReadOnly);
        this.search.set('DateFrom', this.getControlValue('DateFrom'));
        this.search.set('DateTo', this.getControlValue('DateTo'));
        this.search.set('StaDate', this.getControlValue('StaDate'));
        this.search.set('EndDateTo', this.getControlValue('EndDateTo'));
        this.search.set('ValueFrom', this.getControlValue('ValueFrom'));
        this.search.set('ValueTo', this.getControlValue('ValueTo'));
        this.search.set('ContractLevelInd', this.getControlValue('ContractLevelInd'));
        this.search.set('riGridMode', '3');
        this.search.set('riGridHandle', '5112610');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set('riSortOrder', sortOrder);
        this.inputParams.method = this.xhrParams.method;
        this.inputParams.operation = this.xhrParams.operation;
        this.inputParams.module = this.xhrParams.module;
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            if (data) {
                _this.riGrid.Mode = MntConst.eModeNormal;
                _this.riGrid.Update = false;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.messageModal1.show({ msg: MessageConstant.Message.GeneralError, title: 'Error' }, false);
            _this.totalRecords = 1;
            _this.riGrid.Mode = MntConst.eModeNormal;
            _this.riGrid.Update = false;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    CreditApprovalGridComponent.prototype.riGrid_Sort = function (event) {
        this.loadData();
    };
    CreditApprovalGridComponent.prototype.ContractNumber_onchange = function () {
        if (this.getControlValue('ContractNumber')) {
            this.setControlValue('ContractNumber', this.utils.fillLeadingZeros(this.getControlValue('ContractNumber'), 8));
        }
        this.PopulateDescriptions();
    };
    CreditApprovalGridComponent.prototype.PremiseNumber_onchange = function () {
        this.PopulateDescriptions();
    };
    CreditApprovalGridComponent.prototype.ProductCode_onchange = function () {
        this.attributes.ProRataChargeRowID = '';
        this.PopulateDescriptions();
    };
    CreditApprovalGridComponent.prototype.ResultsFilter_onchange = function () {
        if (this.getControlValue('ResultsFilter') !== 'Awaiting') {
            this.pageParams.tdDate = true;
        }
        else {
            this.pageParams.tdDate = false;
        }
    };
    CreditApprovalGridComponent.prototype.PopulateDescriptions = function () {
        var blnContractNumber = false;
        var blnPremiseNumber = false;
        var blnProductCode = false;
        this.riMaintenance.BusinessObject = 'iCABSCreditApprovalGrid.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Function', 'GetDescriptions', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        if (this.getControlValue('ContractNumber')) {
            blnContractNumber = true;
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
        }
        if (this.getControlValue('PremiseNumber')) {
            blnContractNumber = true;
            blnPremiseNumber = true;
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
        }
        if (this.getControlValue('ProductCode')) {
            blnProductCode = true;
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        }
        if (blnContractNumber) {
            this.riMaintenance.PostDataAdd('ContractNumber', this.getControlValue('ContractNumber'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('ContractName', MntConst.eTypeText);
        }
        if (blnPremiseNumber) {
            this.riMaintenance.PostDataAdd('PremiseNumber', this.getControlValue('PremiseNumber'), MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('PremiseName', MntConst.eTypeText);
        }
        if (blnProductCode) {
            this.riMaintenance.PostDataAdd('ProductCode', this.getControlValue('ProductCode'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('ProductDesc', MntConst.eTypeText);
        }
        if (blnContractNumber || blnPremiseNumber || blnProductCode) {
            this.riMaintenance.Execute(this, function (data) {
                if (blnContractNumber) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data['ContractName']);
                }
                if (blnPremiseNumber) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data['PremiseName']);
                }
                if (blnProductCode) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data['ProductDesc']);
                }
                this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
                this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
                this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
                this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName');
                this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
                this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
                this.loadData();
            }, 'POST');
        }
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
        this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName');
        this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
        this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
    };
    CreditApprovalGridComponent.prototype.startDateSelectedValue = function (data) {
        if (data && data.value) {
            this.uiElements.SetValue(this.uiForm, 'StartDate', data.value);
        }
    };
    CreditApprovalGridComponent.prototype.endDateSelectedValue = function (data) {
        if (data && data.value) {
            this.uiElements.SetValue(this.uiForm, 'EndDateTo', data.value);
        }
    };
    CreditApprovalGridComponent.prototype.onContractDataReceived = function (data) {
        if (data) {
            this.uiElements.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
            this.uiElements.SetValue(this.uiForm, 'ContractName', data.ContractName);
            this.inputParamsAccountPremise.ContractNumber = data.ContractNumber;
            this.inputParamsAccountPremise.ContractName = data.ContractName;
            this.serviceCoverSearchParams.ContractNumber = data.ContractNumber;
            this.serviceCoverSearchParams.ContractName = data.ContractName;
            this.getSysCharAndValues();
        }
    };
    CreditApprovalGridComponent.prototype.onPremiseSearchDataReceived = function (data) {
        if (data) {
            this.uiElements.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
            this.uiElements.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
            this.serviceCoverSearchParams.PremiseNumber = data.PremiseNumber;
            this.serviceCoverSearchParams.PremiseName = data.PremiseName;
        }
    };
    CreditApprovalGridComponent.prototype.setProductCode = function (data) {
        if (data) {
            this.setControlValue('ProductCode', data.row.ProductCode);
            this.setControlValue('ProductDesc', data.row.ProductDesc);
        }
    };
    CreditApprovalGridComponent.prototype.getGridInfo = function (info) {
        this.creditApprovalPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    };
    CreditApprovalGridComponent.prototype.getCurrentPage = function (event) {
        if (this.pageCurrent !== event.value) {
            this.pageCurrent = event.value;
            this.loadData();
        }
    };
    CreditApprovalGridComponent.prototype.dateToSelectedValue = function (value, id) {
        if (value && value.value) {
            this.setControlValue(id, value.value);
            if (this.uiForm.controls.hasOwnProperty(id)) {
                this.uiForm.controls[id].markAsDirty();
            }
        }
    };
    CreditApprovalGridComponent.prototype.refresh = function () {
        this.pageCurrent = 1;
        this.loadData();
    };
    CreditApprovalGridComponent.prototype.BuildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ContractNum', 'ProRataCharge', 'ContractNumber', MntConst.eTypeCode, 11);
        this.riGrid.AddColumnUpdateSupport('ContractNum', false);
        this.riGrid.AddColumn('PremNum', 'ProRataCharge', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnUpdateSupport('PremNum', false);
        this.riGrid.AddColumn('PremName', 'ProRataCharge', 'PremName', MntConst.eTypeText, 20);
        this.riGrid.AddColumnUpdateSupport('PremName', false);
        this.riGrid.AddColumn('ProdCode', 'ProRataCharge', 'ProductCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('ProdCode', false);
        this.riGrid.AddColumn('StartDate', 'ProRataCharge', 'StartDate', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('StartDate', false);
        this.riGrid.AddColumn('EndDate', 'ProRataCharge', 'EndDate', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('EndDate', false);
        this.riGrid.AddColumn('ServiceBranchNum', 'ProRataCharge', 'ServiceBranchNum', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('ServiceBranchNum', false);
        this.riGrid.AddColumn('StatusCode', 'ProRataCharge', 'StatusCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('StatusCode', false);
        this.riGrid.AddColumn('ServiceSalesEmp', 'ProRataCharge', 'ServiceSalesEmp', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('ServiceSalesEmp', false);
        this.riGrid.AddColumn('ServiceQty', 'ProRataCharge', 'ServiceQty', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('ServiceQty', false);
        this.riGrid.AddColumn('SalesStatsProcessDate', 'ProRataCharge', 'SalesStatsProcessDate', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('SalesStatsProcessDate', false);
        this.riGrid.AddColumn('ProRataChargeValue', 'ProRataCharge', 'ProRataChargeValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnUpdateSupport('ProRataChargeValue', false);
        this.riGrid.AddColumn('InvoiceCredit', 'ProRataCharge', 'InvoiceCredit', MntConst.eTypeText, 10);
        this.riGrid.AddColumnUpdateSupport('ProRataChargeValue', false);
        this.riGrid.AddColumn('AdditionalCreditInfo', 'ProRataCharge', 'AdditionalCreditInfo', MntConst.eTypeTextFree, 30);
        this.riGrid.AddColumnUpdateSupport('AdditionalCreditInfo', true);
        if (!this.pageParams.verReadOnly) {
            this.riGrid.AddColumn('ApproveCredit', 'ProRataCharge', 'ApproveCredit', MntConst.eTypeImage, 1);
            this.riGrid.AddColumnUpdateSupport('ApproveCredit', false);
            this.riGrid.AddColumnAlign('ApproveCredit', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('CancelCredit', 'ProRataCharge', 'CancelCredit', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnUpdateSupport('CancelCredit', false);
        this.riGrid.AddColumnAlign('CancelCredit', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ContractNum', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremNum', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('ProdCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContractNum', true);
        this.riGrid.AddColumnOrderable('PremName', true);
        this.riGrid.AddColumnOrderable('ProdCode', true);
        if (this.getControlValue('ResultsFilter') !== 'Awaiting') {
        }
        this.riGrid.Complete();
    };
    CreditApprovalGridComponent.prototype.riGrid_BodyonDblClick = function (event) {
        this.ProRataChargeFocus(event.srcElement.parentElement);
        switch (event.srcElement.parentElement.parentElement.getAttribute('name')) {
            case 'ContractNum':
                this.navigate('ServiceVisitEntryGrid', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    parentMode: 'ServiceVisitEntryGrid',
                    ContractNumber: this.riGrid.Details.GetValue('ContractNum'),
                    currentContractType: this.riExchange.getCurrentContractType(),
                    ContractRowID: this.attributes.ContractRowID
                });
                break;
            case 'PremNum':
                this.navigate('ServiceVisitEntryGrid', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, { PremiseRowID: this.attributes.PremiseRowID });
                break;
            case 'ProdCode':
                this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
                break;
            case 'StartDate':
                var mode = '';
                if (this.pageParams.verReadOnly === true) {
                    mode = 'ProRataChargeRO';
                }
                else {
                    mode = 'ProRataCharge';
                }
                this.navigate(mode, 'application/service/invoice/ProRataChargeMaintenance', {
                    parentMode: mode,
                    currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                    CurrentContractType: this.riExchange.getCurrentContractType(),
                    ContractNumber: this.riGrid.Details.GetValue('ContractNum'),
                    ContractName: this.getControlValue('ContractName'),
                    PremiseNumber: this.riGrid.Details.GetValue('PremNum'),
                    PremiseName: this.getControlValue('PremiseName'),
                    ProductCode: this.riGrid.Details.GetValue('ProdCode'),
                    ProductDesc: this.getControlValue('ProductDesc'),
                    ProRataChargeRowID: this.attributes.ProRataChargeRowID
                });
                break;
            case 'CancelCredit':
                this.ajaxSource.next(this.ajaxconstant.START);
                this.ProRataChargeFocus(event.srcElement.parentElement);
                this.riMaintenance.clear();
                this.riMaintenance.BusinessObject = 'iCABSCreditApprovalGrid.p';
                this.riMaintenance.PostDataAdd('Function', 'CancelCredit', MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
                if (!this.riExchange.riInputElement.checked(this.uiForm, 'ContractLevelInd')) {
                    this.riMaintenance.PostDataAdd('ProRataChargeRowID', this.attributes.ProRataChargeRowID, MntConst.eTypeText);
                    this.riMaintenance.Execute(this, function (data) {
                        if (data && data.errorMessage) {
                            this.messageModal.show(data, true);
                        }
                        else {
                            this.loadData();
                        }
                    }, 'POST');
                }
                else {
                    this.pageParams.vbProRataChargeRowID = this.riGrid.Details.GetAttribute('CancelCredit', 'ROWID');
                    this.pageParams.vbProRataChargeTotal = this.riGrid.Details.GetAttribute('ContractNum', 'AdditionalProperty');
                    this.riMaintenance.PostDataAdd('ProRataChargeRowID', this.pageParams.vbProRataChargeRowID, MntConst.eTypeTextFree);
                    this.riMaintenance.PostDataAdd('ProRataChargeTotal', this.pageParams.vbProRataChargeTotal, MntConst.eTypeCurrency);
                    this.riMaintenance.PostDataAdd('ContractLevelInd', this.riExchange.riInputElement.checked(this.uiForm, 'ContractLevelInd'), MntConst.eTypeCheckBox);
                    this.riMaintenance.Execute(this, function (data) {
                        if (data && data.errorMessage) {
                            this.messageModal.show(data, true);
                        }
                        else {
                            this.loadData();
                        }
                    }, 'POST');
                }
                break;
            case 'ApproveCredit':
                this.ajaxSource.next(this.ajaxconstant.START);
                this.ProRataChargeFocus(event.srcElement.parentElement);
                this.riMaintenance.clear();
                this.riMaintenance.BusinessObject = 'iCABSCreditApprovalGrid.p';
                this.riMaintenance.PostDataAdd('Function', 'ApproveCredit', MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
                if (!this.riExchange.riInputElement.checked(this.uiForm, 'ContractLevelInd')) {
                    this.riMaintenance.PostDataAdd('ProRataChargeRowID', this.attributes.ProRataChargeRowID, MntConst.eTypeText);
                    this.riMaintenance.Execute(this, function (data) {
                        if (data && data.errorMessage) {
                            this.messageModal.show(data, true);
                        }
                        else {
                            this.loadData();
                        }
                    }, 'POST');
                }
                else {
                    this.pageParams.vbProRataChargeRowID = this.riGrid.Details.GetAttribute('ApproveCredit', 'ROWID');
                    this.pageParams.vbProRataChargeTotal = this.riGrid.Details.GetAttribute('ContractNum', 'AdditionalProperty');
                    this.riMaintenance.PostDataAdd('ProRataChargeRowID', this.pageParams.vbProRataChargeRowID, MntConst.eTypeTextFree);
                    this.riMaintenance.PostDataAdd('ProRataChargeTotal', this.pageParams.vbProRataChargeTotal, MntConst.eTypeCurrency);
                    this.riMaintenance.PostDataAdd('ContractLevelInd', this.riExchange.riInputElement.checked(this.uiForm, 'ContractLevelInd'), MntConst.eTypeCheckBox);
                    this.riMaintenance.Execute(this, function (data) {
                        if (data && data.errorMessage) {
                            this.messageModal.show(data, true);
                        }
                        else {
                            this.loadData();
                        }
                    }, 'POST');
                }
                break;
        }
    };
    CreditApprovalGridComponent.prototype.ProRataChargeFocus = function (rsrcElement) {
        var TmpContractType;
        var vRowDetail;
        var oTR = rsrcElement.parentElement.parentElement;
        rsrcElement.focus();
        vRowDetail = this.riGrid.Details.GetAttribute('SalesStatsProcessDate', 'AdditionalProperty');
        if (!vRowDetail) {
            this.setAttribute('Row', oTR.sectionRowIndex);
            this.setAttribute('ContractRowID', oTR.children[0].getAttribute('rowid'));
            this.setAttribute('PremiseRowID', oTR.children[1].children[0].getAttribute('rowid'));
            this.setAttribute('ServiceCoverRowID', oTR.children[3].children[0].getAttribute('rowid'));
            this.setAttribute('ProRataChargeRowID', oTR.children[4].children[0].getAttribute('rowid'));
        }
        else {
            this.setAttribute('Row', oTR.sectionRowIndex);
            this.setAttribute('ProRataChargeRowID', oTR.children[14].children[0].getAttribute('rowid'));
        }
        TmpContractType = this.riGrid.Details.GetAttribute('ContractNum', 'AdditionalProperty');
        switch (TmpContractType) {
            case 'C':
                this.pageParams.currentContractType = 'C';
                break;
            case 'J':
                this.pageParams.currentContractType = 'J';
                break;
            case 'P':
                this.pageParams.currentContractType = 'P';
                break;
        }
    };
    CreditApprovalGridComponent.prototype.proceedGridLoad = function () {
        this.loadData();
    };
    CreditApprovalGridComponent.prototype.proceedGridClear = function () {
        this.riGrid.ResetGrid();
    };
    CreditApprovalGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSACreditApprovalGrid.html',
                    styles: ["\n    .contractLevelInd {\n        display:none\n    }\n    "]
                },] },
    ];
    CreditApprovalGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    CreditApprovalGridComponent.propDecorators = {
        'creditApprovalGrid': [{ type: ViewChild, args: ['creditApprovalGrid',] },],
        'creditApprovalPagination': [{ type: ViewChild, args: ['creditApprovalPagination',] },],
        'contractEllipsis': [{ type: ViewChild, args: ['contractEllipsis',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'messageModal1': [{ type: ViewChild, args: ['messageModal1',] },],
    };
    return CreditApprovalGridComponent;
}(BaseComponent));
