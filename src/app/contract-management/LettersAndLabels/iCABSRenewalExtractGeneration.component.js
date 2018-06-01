var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from '../../../app/base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var RenewalExtractGenerationComponent = (function (_super) {
    __extends(RenewalExtractGenerationComponent, _super);
    function RenewalExtractGenerationComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.search = new URLSearchParams();
        this.maxColumn = 11;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 10;
        this.branchnumberDetails = {};
        this.inputParams = {};
        this.information = '';
        this.fromDateDisplay = '';
        this.toDateDisplay = '';
        this.dateObjects = {
            PremiseCommenceDateFrom: new Date(),
            PremiseCommenceDateTo: new Date()
        };
        this.pageCurrent = 1;
        this.totalRecords = 1;
        this.inputParamsBranch = {};
        this.RowID = '';
        this.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.queryParams = {
            operation: 'Sales/iCABSRenewalExtractGeneration',
            module: 'contract-admin',
            method: 'contract-management/batch'
        };
        this.controls = [
            { name: 'FromDate', readonly: false, disabled: false, required: false },
            { name: 'ToDate', readonly: false, disabled: false, required: false },
            { name: 'RepDest', readonly: false, disabled: false, required: false },
            { name: 'ReportURL', readonly: false, disabled: false, required: false },
            { name: 'SelectAllInd', required: true },
            { name: 'SubmitReport', required: true }
        ];
        this.LetterTypeDescoptions = [];
        this.rowId = '';
        this.selectsearch = new URLSearchParams();
        this.submitsearch = new URLSearchParams();
        this.trInformation = false;
        this.rowclicksearch = new URLSearchParams();
        this.pageId = PageIdentifier.ICABSRENEWALEXTRACTGENERATION;
        this.search = this.getURLSearchParamObject();
    }
    RenewalExtractGenerationComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Renewal Letter Extract';
        this.window_onload();
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    RenewalExtractGenerationComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    RenewalExtractGenerationComponent.prototype.window_onload = function () {
        var _this = this;
        this.branchNumber = this.utils.getBranchCode();
        this.lookupBranchName();
        this.search = this.getURLSearchParamObject();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set('Function', 'GetBranchName');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search).subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                _this.messageService.emitMessage(e);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', e.BranchName);
                _this.reportUrl();
                _this.setFormMode(_this.c_s_MODE_UPDATE);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        var date = new Date();
        this.firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.fromdate = this.utils.formatDate(this.firstDay);
        this.todate = this.utils.formatDate(this.lastDay);
        var getFromDate = this.fromdate;
        if (window['moment'](getFromDate, 'DD/MM/YYYY', true).isValid()) {
            getFromDate = this.utils.convertDate(getFromDate);
        }
        else {
            getFromDate = this.utils.formatDate(getFromDate);
        }
        this.dateObjects.fromDateDisplay = new Date(getFromDate);
        var getToDate = this.todate;
        if (window['moment'](getToDate, 'DD/MM/YYYY', true).isValid()) {
            getToDate = this.utils.convertDate(getToDate);
        }
        else {
            getToDate = this.utils.formatDate(getToDate);
        }
        this.dateObjects.toDateDisplay = new Date(getToDate);
        this.setControlValue('RepDest', 'direct');
        this.buildGrid();
    };
    RenewalExtractGenerationComponent.prototype.onBranchDataReceived = function (obj) {
        this.branchNumber = obj.BranchNumber;
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    };
    RenewalExtractGenerationComponent.prototype.lookupBranchName = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.branchNumber
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                var Branch = data[0][0];
                if (Branch) {
                    _this.negBranchNumberSelected = {
                        id: _this.branchNumber,
                        text: _this.branchNumber + ' - ' + Branch.BranchName
                    };
                }
                ;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    RenewalExtractGenerationComponent.prototype.reportUrl = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Lettertype',
                'query': {
                    'BusinessCode': this.businessCode
                },
                'fields': ['LetterTypeCode', 'DocumentURL', 'LetterTypeDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var reporturl;
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else if (data) {
                _this.LetterTypeDescoptions = [];
                for (var i = 0; i < data[0].length; i++) {
                    reporturl = data[0][i].LetterTypeCode;
                    if (reporturl.indexOf('R') === 0) {
                        _this.LetterTypeDescoptions.push(data[0][i]);
                    }
                }
                _this.setControlValue('ReportURL', _this.LetterTypeDescoptions[0].DocumentURL);
            }
            ;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    RenewalExtractGenerationComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value['value']) {
            this.fromDateDisplay = value['value'];
            this.uiForm.controls['FromDate'].setValue(this.fromDateDisplay);
        }
        else {
            this.fromDateDisplay = '';
            this.uiForm.controls['FromDate'].setValue('');
        }
    };
    RenewalExtractGenerationComponent.prototype.dateToSelectedValue = function (value) {
        if (value && value['value']) {
            this.toDateDisplay = value['value'];
            this.uiForm.controls['ToDate'].setValue(this.toDateDisplay);
        }
        else {
            this.toDateDisplay = '';
            this.uiForm.controls['ToDate'].setValue('');
        }
    };
    RenewalExtractGenerationComponent.prototype.buildGrid = function () {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.Clear();
        this.riGrid.AddColumn('RenewalExtractDate', 'RenewalExtract', 'RenewalExtractDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('RenewalExtractDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('RenewalExtractTime', 'RenewalExtract', 'RenewalExtractTime', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('RenewalExtractTime', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('BranchNumber', 'RenewalExtract', 'BranchNumber', MntConst.eTypeDate, 7);
        this.riGrid.AddColumn('BranchName', 'RenewalExtract', 'BranchName', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('SearchCategory', 'RenewalExtract', 'SearchCategory', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('ReportDescription', 'RenewalExtract', 'ReportDescription', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('NumberOfContracts', 'RenewalExtract', 'NumberOfContracts', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('NumberOfContracts', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ValueOfContracts', 'RenewalExtract', 'ValueOfContracts', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumnAlign('ValueOfContracts', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('NumberOfContractsSelected', 'RenewalExtract', 'NumberOfContractsSelected', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('NumberOfContractsSelected', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ValueOfContractsSelected', 'RenewalExtract', 'ValueOfContractsSelected', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumnAlign('ValueOfContractsSelected', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('HeaderSelected', 'RenewalExtract', 'HeaderSelected', MntConst.eTypeImage, 1, false, 'Click here to select');
        this.riGrid.AddColumnAlign('HeaderSelected', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('SearchCategory', true);
        this.riGrid.AddColumnOrderable('RenewalExtractDate', true);
        this.riGrid.Complete();
        this.loadData();
    };
    RenewalExtractGenerationComponent.prototype.getCurrentPage = function (event) {
        this.pageCurrent = event.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    };
    RenewalExtractGenerationComponent.prototype.loadData = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        var formdata = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.Action, '2');
        formdata['Level'] = 'ExtractHeader';
        formdata['RenewalExtractHeaderRowID'] = this.RowID;
        formdata['BranchNumber'] = this.branchNumber;
        formdata['ReportURL'] = this.getControlValue('ReportURL');
        formdata['DateFrom'] = this.getControlValue('FromDate');
        formdata['DateTo'] = this.getControlValue('ToDate');
        formdata[this.serviceConstants.GridMode] = '0';
        formdata[this.serviceConstants.GridHandle] = '7669056';
        formdata['riCacheRefresh'] = 'True';
        formdata[this.serviceConstants.PageSize] = this.itemsPerPage.toString();
        formdata[this.serviceConstants.PageCurrent] = this.currentPage.toString();
        formdata['HeaderClickedColumn'] = '';
        formdata['riSortOrder'] = 'Descending';
        this.inputParams.search = this.search;
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                try {
                    _this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    _this.riGrid.Update = true;
                    _this.riGrid.UpdateBody = true;
                    _this.riGrid.UpdateFooter = true;
                    _this.riGrid.Execute(data);
                }
                catch (e) {
                    _this.logger.log(' Problem in grid load', e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.totalRecords = 1;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    RenewalExtractGenerationComponent.prototype.riGrid_Sort = function (event) {
        this.loadData();
    };
    RenewalExtractGenerationComponent.prototype.proceedGridLoad = function () {
        this.uiForm.controls['ToDate'].setValue(new Date());
    };
    RenewalExtractGenerationComponent.prototype.menuOnchange = function (event) {
        this.SelectAllInd();
    };
    RenewalExtractGenerationComponent.prototype.ischecked = function (value) {
        if (value) {
            return 'yes';
        }
        else {
            return 'no';
        }
    };
    RenewalExtractGenerationComponent.prototype.SelectAllInd = function () {
        var _this = this;
        this.selectsearch = this.getURLSearchParamObject();
        var formdata = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.selectsearch.set(this.serviceConstants.Action, '0');
        this.selectsearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.selectsearch.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['Level'] = 'ModifyPrintSelection';
        if (this.ischecked(this.getControlValue('SelectAllInd')) === 'yes') {
            formdata['TabSelected'] = 'Select All';
        }
        else {
            formdata['TabSelected'] = 'DeSelect All';
        }
        formdata['BranchNumber'] = this.branchNumber;
        formdata['DateFrom'] = this.getControlValue('FromDate');
        formdata['DateTo'] = this.getControlValue('ToDate');
        formdata['ReportURL'] = this.getControlValue('ReportURL');
        this.inputParams.selectsearch = this.selectsearch;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.selectsearch, formdata)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                _this.riGrid.Update = true;
                _this.riGrid.UpdateHeader = true;
                _this.riGrid.UpdateRow = true;
                _this.riGrid.UpdateFooter = true;
                _this.refresh();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    RenewalExtractGenerationComponent.prototype.submitReport = function () {
        var _this = this;
        this.submitsearch = this.getURLSearchParamObject();
        var formdata = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.submitsearch.set(this.serviceConstants.Action, '0');
        this.submitsearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.submitsearch.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['TabSelected'] = 'Print Reports';
        formdata['BranchNumber'] = this.branchNumber;
        formdata['RepManDest'] = 'batch|ReportID';
        formdata['ReportURL'] = this.getControlValue('ReportURL');
        this.inputParams.search = this.submitsearch;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e.errorMessage && e.errorMessage !== '') {
                    setTimeout(function () {
                        _this.errorService.emitError(e);
                    }, 200);
                }
                else {
                    _this.messageService.emitMessage(e);
                    _this.trInformation = true;
                    _this.information = e.ReturnHTML;
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    RenewalExtractGenerationComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    };
    RenewalExtractGenerationComponent.prototype.onGridRowClick = function (ev) {
        var _this = this;
        this.RowID = this.riGrid.Details.GetAttribute('RenewalExtractDate', 'rowid');
        var formdata = {};
        this.rowclicksearch = this.getURLSearchParamObject();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.rowclicksearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.rowclicksearch.set(this.serviceConstants.CountryCode, this.countryCode());
        if (this.riGrid.CurrentColumnName === 'HeaderSelected') {
            this.rowclicksearch.set(this.serviceConstants.Action, '6');
            formdata['Function'] = 'SelectHeader';
            formdata['RenewalExtractHeaderRowID'] = this.RowID;
        }
        else {
            this.rowclicksearch.set(this.serviceConstants.Action, '0');
            formdata['Function'] = 'ReportParameters';
            formdata['RenewalExtractHeaderRowID'] = this.RowID;
            this.rowclicksearch.set('BranchNumber', this.branchNumber);
        }
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.rowclicksearch, formdata)
            .subscribe(function (e) {
            if (e.hasError) {
                _this.errorModal.show(e, true);
            }
            else {
                _this.riGrid.Update = true;
                _this.riGrid.UpdateHeader = true;
                _this.riGrid.UpdateRow = true;
                _this.riGrid.UpdateFooter = true;
                _this.refresh();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    RenewalExtractGenerationComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSRenewalExtractGeneration.html'
                },] },
    ];
    RenewalExtractGenerationComponent.ctorParameters = [
        { type: Injector, },
    ];
    RenewalExtractGenerationComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'renewalExtractGenerationPagination': [{ type: ViewChild, args: ['renewalExtractGenerationPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return RenewalExtractGenerationComponent;
}(BaseComponent));
