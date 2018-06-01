var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { InvoiceGroupSearchComponent } from './../search/iCABSAInvoiceGroupSearch.component';
import { Observable } from 'rxjs/Rx';
import { InvoiceSearchComponent } from '../../internal/search/iCABSInvoiceSearch.component';
export var InvoiceHeaderGridComponent = (function (_super) {
    __extends(InvoiceHeaderGridComponent, _super);
    function InvoiceHeaderGridComponent(injector, _router, el) {
        _super.call(this, injector);
        this._router = _router;
        this.el = el;
        this.pageId = '';
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 15;
        this.showHeader = true;
        this.promptConfirmTitle = '';
        this.search = new URLSearchParams();
        this.lstCriteriaOneOptions = [{}];
        this.lstDateOptions = [{}];
        this.lstCriteriaTwoOptions = [{}];
        this.gridSortHeaders = [];
        this.companyInputParams = {};
        this.currDate = null;
        this.currDate1 = null;
        this.currDate2 = null;
        this.searchModalRoute = '';
        this.searchPageRoute = '';
        this.showCloseButton = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.isAccountEllipsisDisabled = false;
        this.accountSearchComponent = AccountSearchComponent;
        this.queryLookUp = new URLSearchParams();
        this.headerClickedColumn = '';
        this.riSortOrder = '';
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.showMessageHeader = true;
        this.columnIndex = {
            invoiceName: 0,
            invoiceNumber: 3,
            ValueExclTax: 11,
            invoicePrint: 0
        };
        this.invoiceshowDisable = false;
        this.inputParamsAccount = {
            'parentMode': 'HistorySearch',
            'showAddNewDisplay': false
        };
        this.invoiceSearchComponentinputParams = {
            parentMode: 'InvoiceHistory',
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            companyCode: '',
            CompanyInvoiceNumber: ''
        };
        this.invoiceSearchComponent = InvoiceSearchComponent;
        this.fieldHidden = {
            tdCheckBoxes: false,
            trCopyInvoice: false,
            trInvoiceForEmail: false,
            trAccountNumber: true,
            trInvoiceGroupNumber: true,
            trExtractDate: true,
            trExtractRunNumber: true,
            trPeriodDate: true,
            trProcessedDate: true,
            trCompanyCode: false,
            trInvoiceNumber: false,
            tdLstDate: false
        };
        this.fieldDisable = {
            CompanyCode: false
        };
        this.inputParamsInvoiceGroupNumber = {
            parentMode: 'LookUp',
            isEllipsis: true
        };
        this.invoiceGroupGridComponent = InvoiceGroupSearchComponent;
        this.queryParams = {
            operation: 'Application/iCABSAInvoiceHeaderGrid',
            module: 'report',
            method: 'bill-to-cash/grid'
        };
        this.companyDefault = {
            id: '',
            text: ''
        };
        this.querySysChar = new URLSearchParams();
        this.controls = [
            { name: 'CopyInvoice', readonly: true, disabled: false, required: false },
            { name: 'EmailInvoice', readonly: true, disabled: false, required: false },
            { name: 'CompanyInvoiceNumber', readonly: true, disabled: false, required: false },
            { name: 'InvoiceName', readonly: true, disabled: true, required: false },
            { name: 'lstCriteriaOne', readonly: true, disabled: false, required: false },
            { name: 'lstDate', readonly: true, disabled: false, required: false },
            { name: 'lstCriteriaTwo', readonly: true, disabled: false, required: false },
            { name: 'CompanyCode', readonly: true, disabled: false, required: false },
            { name: 'CompanyDesc', readonly: true, disabled: false, required: false },
            { name: 'AccountNumber', readonly: true, disabled: false, required: false },
            { name: 'AccountName', readonly: true, disabled: true, required: false },
            { name: 'InvoiceNumber', readonly: true, disabled: false, required: false },
            { name: 'InvoiceGroupNumber', readonly: true, disabled: false, required: false },
            { name: 'InvoiceGroupDesc', readonly: true, disabled: true, required: false },
            { name: 'ExtractDate', readonly: true, disabled: false, required: false },
            { name: 'PeriodDate', readonly: true, disabled: false, required: false },
            { name: 'ProcessedDate', readonly: true, disabled: false, required: false },
            { name: 'SelectedInvoice', readonly: true, disabled: false, required: false },
            { name: 'ExtractRunNumberFrom', readonly: true, disabled: false, required: false },
            { name: 'ExtractRunNumberTo', readonly: true, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSAINVOICEHEADERGRID;
        this.companyInputParams[this.serviceConstants.CountryCode] = this.utils.getCountryCode();
        this.companyInputParams[this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
        this.companyInputParams['parentMode'] = 'LookUp';
    }
    InvoiceHeaderGridComponent.prototype.loadSysChars = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableCompanyCode,
            this.sysCharConstants.SystemCharEnableMultipleInvoiceLayouts,
            this.sysCharConstants.SystemCharEnableSeparateTaxAndNonTaxInvoiceLayouts,
            this.sysCharConstants.SystemCharEnableTaxBreakdownOnInvHist,
            this.sysCharConstants.SystemCharEnableRoundingValuesOnInvoiceHistory,
            this.sysCharConstants.SystemCharReproduceInvoicesForEmail
        ];
        this.lookUpSubscription = this.fetchSysChar(sysCharList).subscribe(function (data) {
            try {
                if (data.records) {
                    _this.pageParams.vSCEnableCompanyCode = data.records[0].Required;
                    _this.pageParams.vSCEnableMultipleInvoiceLayouts = data.records[1].Integer;
                    _this.pageParams.vSCNumberOfInvoiceLayouts = data.records[1].Integer;
                    _this.pageParams.vSCEnableSeparateTaxInvLayout = data.records[2].Required;
                    _this.pageParams.vSCEnableTaxBreakdownOnInvHist = data.records[3].Logical;
                    _this.pageParams.vSCEnableInvoiceCreditBreakdown = data.records[3].Logical;
                    _this.pageParams.vSCEnableRoundingOnInvHist = data.records[4].Required;
                    _this.pageParams.vReproduceInvoiceForEmail = data.records[5].Required;
                    _this.pageParams.vbNumTaxColumns = 0;
                    _this.pageParams.SCNumberOfInvoiceLayouts = ((_this.pageParams.vSCEnableMultipleInvoiceLayouts > 0 && _this.pageParams.vSCNumberOfInvoiceLayouts > 0) && _this.pageParams.vSCEnableSeparateTaxInvLayout) ? _this.pageParams.vSCNumberOfInvoiceLayouts : 0;
                    _this.lstCriteriaOneOptionsChange(_this.uiForm.controls['lstCriteriaOne'].value);
                    _this.setMaxColumn();
                    if (_this.pageParams.vSCEnableTaxBreakdownOnInvHist) {
                        var postData = {};
                        postData['Function'] = 'GetTaxFields';
                        _this.search = new URLSearchParams();
                        _this.search.set(_this.serviceConstants.Action, '6');
                        _this.search.set(_this.serviceConstants.BusinessCode, _this.utils.getBusinessCode());
                        _this.search.set(_this.serviceConstants.CountryCode, _this.countryCode());
                        _this.ajaxSubscription = _this.httpService.makePostRequest(_this.queryParams.method, _this.queryParams.module, _this.queryParams.operation, _this.search, postData).subscribe(function (data) {
                            try {
                                _this.pageParams.vbNumTaxColumns = data.NumberOfTaxColumns;
                                _this.setMaxColumn();
                            }
                            catch (error) {
                                _this.logger.warn(error);
                            }
                        }, function (error) {
                            _this.errorService.emitError(error);
                        });
                    }
                }
            }
            catch (e) {
                _this.logger.warn('System variable response error' + e);
            }
        });
    };
    InvoiceHeaderGridComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode());
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    InvoiceHeaderGridComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    InvoiceHeaderGridComponent.prototype.onAccountDataReceived = function (data) {
        this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
        this.uiForm.controls['AccountName'].setValue(data.AccountName);
        this.inputParamsInvoiceGroupNumber['AccountNumber'] = this.uiForm.controls['AccountNumber'].value;
        this.inputParamsInvoiceGroupNumber['AccountName'] = this.uiForm.controls['AccountName'].value;
        this.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
        this.invoiceGroupEllipsis.childConfigParams = this.inputParamsInvoiceGroupNumber;
        this.invoiceshowDisable = false;
    };
    InvoiceHeaderGridComponent.prototype.setLookup = function () {
        var _this = this;
        var data = [{
                'table': 'Company',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'CountryCode': this.utils.getCountryCode(), 'DefaultCompanyInd': 'True' },
                'fields': ['CompanyCode', 'CompanyDesc']
            }];
        this.lookUpSubscription = this.lookUpRecord(JSON.parse(JSON.stringify(data)), 2).subscribe(function (e) {
            try {
                if (e.results[0][0]) {
                    _this.pageParams.vDefaultCompanyCode = e.results[0][0].CompanyCode;
                    _this.pageParams.vDefaultCompanyDesc = e.results[0][0].CompanyDesc;
                    _this.lstCriteriaOneOptionsChange(_this.uiForm.controls['lstCriteriaOne'].value);
                }
            }
            catch (err) {
                _this.logger.warn(err);
            }
        });
    };
    InvoiceHeaderGridComponent.prototype.fetchInvoiceData = function () {
        var _this = this;
        var data = {}, param = {};
        this.pageParams.invoiceData = [];
        if (this.uiForm.controls['CompanyCode'].value) {
            data = [{
                    'table': 'InvoiceHeader',
                    'query': { 'BusinessCode': this.utils.getBusinessCode(), 'CompanyCode': this.uiForm.controls['CompanyCode'].value, 'CompanyInvoiceNumber': this.uiForm.controls['CompanyInvoiceNumber'].value },
                    'fields': ['InvoiceNumber']
                }];
            this.lookUpSubscription = this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                try {
                    _this.pageParams.invoiceData = [];
                    e.results[0].forEach(function (item) {
                        _this.pageParams.invoiceData.push(item);
                    });
                    if (_this.pageParams.invoiceData.length > 0) {
                        _this.uiForm.controls['InvoiceNumber'].setValue(_this.pageParams.invoiceData[0].InvoiceNumber);
                        _this.invoiceSearchComponentinputParams.CompanyInvoiceNumber = _this.uiForm.controls['CompanyInvoiceNumber'].value;
                        _this.invoiceSearchComponentinputParams.companyCode = _this.uiForm.controls['CompanyCode'].value;
                    }
                    else {
                        _this.invoiceSearchComponentinputParams.CompanyInvoiceNumber = _this.uiForm.controls['CompanyInvoiceNumber'].value;
                        _this.invoiceSearchComponentinputParams.companyCode = _this.uiForm.controls['CompanyCode'].value;
                        _this.invoiceSearchEllipsis.childConfigParams = _this.invoiceSearchComponentinputParams;
                        _this.uiForm.controls['InvoiceNumber'].setValue('');
                        _this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                    }
                    if (_this.pageParams.invoiceData.length > 1) {
                        _this.invoiceSearchEllipsis.openModal();
                    }
                    else {
                        _this.buildGrid();
                        _this.populateDescriptions();
                    }
                }
                catch (err) {
                    _this.logger.warn(err);
                }
            });
        }
        else {
            data = [{
                    'table': 'InvoiceHeader',
                    'query': { 'BusinessCode': this.utils.getBusinessCode(), 'CompanyInvoiceNumber': this.uiForm.controls['CompanyInvoiceNumber'].value },
                    'fields': ['InvoiceNumber', 'CompanyCode']
                }];
            param = [{
                    'table': 'Company',
                    'query': { 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['CompanyCode']
                }];
            var observableBatch = [this.lookUpRecord(JSON.parse(JSON.stringify(data)), 2), this.lookUpRecord(JSON.parse(JSON.stringify(param)), 1000)];
            Observable.forkJoin(observableBatch).subscribe(function (data) {
                data[0]['results'][0].forEach(function (item) {
                    for (var _i = 0, _a = data[1]['results'][0]; _i < _a.length; _i++) {
                        var c = _a[_i];
                        if (c.CompanyCode === item.CompanyCode) {
                            _this.pageParams.invoiceData.push(item);
                        }
                    }
                });
                if (_this.pageParams.invoiceData.length === 1) {
                    _this.uiForm.controls['InvoiceNumber'].setValue(_this.pageParams.invoiceData[0].InvoiceNumber);
                }
                else {
                    _this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                    _this.uiForm.controls['InvoiceNumber'].setValue('');
                }
                if (_this.pageParams.invoiceData.length > 1) {
                    _this.riExchange.setParentAttributeValue('CompanyInvoiceNumber', _this.uiForm.controls['CompanyInvoiceNumber'].value);
                    _this.riExchange.setParentAttributeValue('CompanyInvoiceNumberCompanyCode', _this.uiForm.controls['CompanyCode'].value);
                    _this._router.navigate([' application/InvoiceSearch'], { queryParams: { Mode: 'InvoiceHistory' } });
                }
                else {
                    _this.buildGrid();
                    _this.populateDescriptions();
                }
            });
        }
    };
    InvoiceHeaderGridComponent.prototype.initData = function () {
        this.createCriteriaDropDown();
        this.pageParams.vSCNumberOfInvoiceLayouts = 0;
        this.pageParams.SCNumberOfInvoiceLayouts = 0;
        this.pageParams.StrMode = '';
        this.loadSysChars();
        this.setLookup();
        this.pageTitle = 'Invoice Header Grid';
        if (this.riExchange.URLParameterContains('copy')) {
            this.pageParams.StrMode = 'Copy';
        }
    };
    InvoiceHeaderGridComponent.prototype.setMaxColumn = function () {
        this.pageParams.vbAdditionalCols = 0;
        this.maxColumn = 15;
        this.columnIndex.invoiceName = 13;
        this.columnIndex.invoicePrint = 14;
        if (this.pageParams.vSCEnableRoundingOnInvHist) {
            this.pageParams.vbAdditionalCols = 1;
            this.maxColumn++;
            this.columnIndex.invoiceName++;
            this.columnIndex.invoicePrint++;
        }
        if (this.pageParams.vSCEnableTaxBreakdownOnInvHist) {
            this.maxColumn += this.pageParams.vbNumTaxColumns;
            this.columnIndex.invoicePrint += this.pageParams.vbNumTaxColumns;
            this.columnIndex.invoiceName += this.pageParams.vbNumTaxColumns;
            if (this.pageParams.vSCEnableRoundingOnInvHist) {
                this.maxColumn++;
                this.columnIndex.invoiceName++;
                this.pageParams.vbAdditionalCols++;
                this.columnIndex.invoicePrint++;
            }
        }
        if (this.pageParams.vSCEnableInvoiceCreditBreakdown) {
            this.maxColumn += 2;
            this.pageParams.vbAdditionalCols += 2;
            this.columnIndex.invoiceName += 2;
            this.columnIndex.invoicePrint += 2;
            this.columnIndex.invoiceName += this.pageParams.vbNumTaxColumns;
            this.columnIndex.invoicePrint += this.pageParams.vbNumTaxColumns;
            this.maxColumn += this.pageParams.vbNumTaxColumns;
            this.pageParams.vbAdditionalCols += this.pageParams.vbNumTaxColumns;
            if (this.pageParams.vSCEnableRoundingOnInvHist) {
                this.maxColumn++;
                this.columnIndex.invoiceName++;
                this.columnIndex.invoicePrint++;
                this.pageParams.vbAdditionalCols++;
            }
            if (this.pageParams.SCNumberOfInvoiceLayouts > 1) {
                var layoutNumber = 0;
                while (layoutNumber < parseInt(this.pageParams.SCNumberOfInvoiceLayouts, 10)) {
                    this.maxColumn++;
                    this.columnIndex.invoicePrint++;
                }
            }
            else {
                this.maxColumn++;
                this.columnIndex.invoicePrint++;
            }
        }
        if (this.pageParams.StrMode === 'Copy' && !this.pageParams.vReproduceInvoiceForEmail) {
            this.fieldHidden.tdCheckBoxes = false;
            this.fieldHidden.trCopyInvoice = false;
            this.fieldHidden.trInvoiceForEmail = true;
            this.uiForm.controls['CopyInvoice'].setValue(false);
            this.uiForm.controls['EmailInvoice'].setValue(false);
        }
        if (this.pageParams.StrMode !== 'Copy' && this.pageParams.vReproduceInvoiceForEmail) {
            this.fieldHidden.tdCheckBoxes = false;
            this.fieldHidden.trCopyInvoice = true;
            this.fieldHidden.trInvoiceForEmail = false;
            this.uiForm.controls['CopyInvoice'].setValue(true);
            this.uiForm.controls['EmailInvoice'].setValue(false);
        }
        if (this.pageParams.StrMode !== 'Copy' && !this.pageParams.vReproduceInvoiceForEmail) {
            this.fieldHidden.tdCheckBoxes = true;
            this.fieldHidden.trCopyInvoice = true;
            this.fieldHidden.trInvoiceForEmail = true;
            this.uiForm.controls['CopyInvoice'].setValue(true);
            this.uiForm.controls['EmailInvoice'].setValue(false);
        }
    };
    InvoiceHeaderGridComponent.prototype.buildGrid = function () {
        this.setMaxColumn();
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('CriteriaOne', this.uiForm.controls['lstCriteriaOne'].value);
        this.search.set('CriteriaTwo', this.uiForm.controls['lstCriteriaTwo'].value);
        this.search.set('CriteriaDate', this.uiForm.controls['lstDate'].value);
        this.search.set('SCNumberOfInvoiceLayouts', '0');
        this.search.set('SCEnableSeparateTaxInvLayout', 'False');
        this.search.set('GridType', 'Component');
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '0');
        this.search.set('riCacheRefresh', 'True');
        if (this.uiForm.controls['lstCriteriaOne'].value === 'InvoiceNumber') {
            if (!this.uiForm.controls['InvoiceNumber'].value) {
                this.uiForm.controls['InvoiceNumber'].setValue(this.uiForm.controls['CompanyInvoiceNumber'].value);
            }
            this.search.set('InvoiceNumber', this.uiForm.controls['InvoiceNumber'].value);
        }
        if (this.uiForm.controls['lstCriteriaOne'].value === 'AccountNumber') {
            this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
        }
        if (this.uiForm.controls['lstCriteriaOne'].value === 'InvoiceGroupNumber') {
            this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
            this.search.set('InvoiceGroupNumber', this.uiForm.controls['InvoiceGroupNumber'].value);
        }
        if (this.uiForm.controls['lstCriteriaOne'].value === 'ExtractDate') {
            this.search.set('ExtractDate', this.uiForm.controls['ExtractDate'].value);
        }
        if (this.uiForm.controls['lstCriteriaOne'].value === 'ExtractRunNumber') {
            this.search.set('ExtractRunNumberFrom', this.uiForm.controls['ExtractRunNumberFrom'].value);
            this.search.set('ExtractRunNumberTo', this.uiForm.controls['ExtractRunNumberTo'].value);
        }
        if (this.uiForm.controls['lstDate'].value === 'PeriodDate') {
            this.search.set('StartDate', this.uiForm.controls['PeriodDate'].value);
        }
        if (this.uiForm.controls['lstDate'].value === 'ProcessedDate') {
            this.search.set('StartDate', this.uiForm.controls['ProcessedDate'].value);
        }
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
        this.queryParams.search = this.search;
        this.invoiceHeaderGrid.loadGridData(this.queryParams);
    };
    InvoiceHeaderGridComponent.prototype.accountChange = function () {
        if (this.uiForm.controls['AccountNumber'].value) {
            this.uiForm.controls['AccountNumber'].setValue(this.utils.numberPadding(this.uiForm.controls['AccountNumber'].value, 9));
            this.populateDescriptions();
        }
    };
    InvoiceHeaderGridComponent.prototype.invoicePrint = function (invoiceNumber, layoutNumber) {
        var _this = this;
        var strURL, strReproduceInvoiceForEmail, strCopyInvoice;
        if (this.uiForm.controls['EmailInvoice'].value) {
            strReproduceInvoiceForEmail = 'True';
        }
        else {
            strReproduceInvoiceForEmail = 'False';
        }
        if (this.uiForm.controls['CopyInvoice'].value) {
            strCopyInvoice = 'True';
        }
        else {
            strCopyInvoice = 'False';
        }
        var postData = {};
        postData['Function'] = 'Single';
        postData['InvoiceNumber'] = invoiceNumber;
        postData['LayoutNumber'] = layoutNumber;
        postData['EmailInvoice'] = strReproduceInvoiceForEmail;
        postData['Copy'] = strCopyInvoice;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                if (!data['fullError']) {
                    window.open(data.url, '_blank');
                }
                else {
                    if (data.fullError.indexOf('iCABSAInvoiceReprintMaintenance.htm') >= 0) {
                        var tempList = data.fullError.split('?');
                        if (tempList && tempList.length > 1) {
                            var params = new URLSearchParams(tempList[1]);
                            _this.router.navigate(['application/invoiceReprintMaintenance'], { queryParams: { InvoiceNumber: params.get('InvoiceNumber') } });
                        }
                    }
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    InvoiceHeaderGridComponent.prototype.companyInvoiceNumberOonChange = function (obj) {
        this.fetchInvoiceData();
    };
    InvoiceHeaderGridComponent.prototype.populateDescriptions = function () {
        var _this = this;
        var postData = {};
        postData['Function'] = 'SetDisplayFields';
        if (this.uiForm.controls['CompanyCode'].value) {
            postData['CompanyCode'] = this.uiForm.controls['CompanyCode'].value;
        }
        if (this.uiForm.controls['InvoiceNumber'].value) {
            postData['InvoiceNumber'] = this.uiForm.controls['InvoiceNumber'].value;
        }
        if (this.uiForm.controls['AccountNumber'].value) {
            postData['AccountNumber'] = this.uiForm.controls['AccountNumber'].value;
        }
        if (this.uiForm.controls['InvoiceGroupNumber'].value) {
            postData['InvoiceGroupNumber'] = this.uiForm.controls['InvoiceGroupNumber'].value;
        }
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                _this.uiForm.controls['CompanyDesc'].setValue(data.CompanyDesc);
                _this.uiForm.controls['InvoiceName'].setValue(data.InvoiceName);
                _this.uiForm.controls['AccountName'].setValue(data.AccountName);
                _this.uiForm.controls['InvoiceGroupDesc'].setValue(data.InvoiceGroupDesc);
                if (data.CompanyDesc || data.InvoiceName || data.AccountName || data.InvoiceGroupDesc) {
                    _this.buildGrid();
                }
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    InvoiceHeaderGridComponent.prototype.getGridInfo = function (info) {
        this.invoiceHeaderGridPagination.totalItems = info.totalRows;
        if (this.pageParams.GridMode === '3')
            this.buildGrid();
    };
    InvoiceHeaderGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    };
    InvoiceHeaderGridComponent.prototype.refresh = function () {
        this.buildGrid();
    };
    InvoiceHeaderGridComponent.prototype.onGridRowDblClick = function (event) {
        var objSrcName = '';
        objSrcName = event.cellIndex;
        if (objSrcName === this.columnIndex.invoiceName) {
            this.attributes['InvoiceHeaderRowID'] = event.cellData.RowID;
            this._router.navigate(['application/invoice/addressdetails'], { queryParams: { parentMode: 'InvoiceAddressDetails', InvoiceHeaderRowID: event.trRowData[3].rowID, InvoiceNumber: event.trRowData[3].additionalData } });
        }
        else if (objSrcName === this.columnIndex.invoiceNumber) {
            this.attributes['InvoiceNumber'] = event.cellData.text;
            this.attributes['SystemInvoiceNumber'] = event.cellData.additionalData;
            this.attributes['CompanyCode'] = event.trRowData[2].text;
            this.attributes['CompanyDesc'] = event.trRowData[2].additionalData;
            this.attributes['InvoiceName'] = event.trRowData[13].text;
            this.attributes['AccountNumber'] = event.trRowData[4].text;
            this.attributes['AccountName'] = event.trRowData[4].additionalData;
            this.attributes['InvoiceGroupNumber'] = event.trRowData[5].text;
            this.attributes['InvoiceGroupDesc'] = event.trRowData[5].additionalData;
            this.navigate('InvoiceGroup', this.ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID);
        }
        else if (objSrcName === this.columnIndex.ValueExclTax) {
            this.attributes['InvoiceNumber'] = event.trRowData[3].text;
            this.attributes['SystemInvoiceNumber'] = event.trRowData[3].additionalData;
            this.attributes['CompanyCode'] = event.trRowData[2].text;
            this.attributes['CompanyDesc'] = event.trRowData[2].additionalData;
            this.attributes['InvoiceName'] = event.trRowData[13].text;
            this.attributes['AccountNumber'] = event.trRowData[4].text;
            this.attributes['AccountName'] = event.trRowData[4].additionalData;
            this.attributes['InvoiceGroupNumber'] = event.trRowData[5].text;
            this.attributes['InvoiceGroupDesc'] = event.trRowData[5].additionalData;
            this.attributes['SelectedInvoiceInvoiceNumber'] = event.trRowData[3].text;
            this.attributes['SelectedInvoiceSystemInvoiceNumber'] = event.trRowData[3].additionalData;
            this.attributes['SelectedInvoiceCompanyCode'] = event.trRowData[2].text;
            this.attributes['SelectedInvoiceCompanyDesc'] = event.trRowData[2].additionalData;
            this.attributes['SelectedInvoiceInvoiceName'] = event.trRowData[13].text;
            this.attributes['SelectedInvoiceAccountNumber'] = event.trRowData[4].text;
            this.attributes['SelectedInvoiceAccountName'] = event.trRowData[4].additionalData;
            this.attributes['SelectedInvoiceInvoiceGroupNumber'] = event.trRowData[5].text;
            this.attributes['SelectedInvoiceInvoiceGroupDesc'] = event.trRowData[5].additionalData;
            this.showAlert('iCABSAContractInvoiceTurnoverGrid.htm is yet developed');
        }
        else if (objSrcName === this.columnIndex.invoicePrint) {
            var layoutNumber = 0;
            if (this.pageParams.vSCEnableSeparateTaxInvLayout) {
                layoutNumber = event.trRowData[this.columnIndex.invoicePrint].rowID;
            }
            this.invoicePrint(event.trRowData[3].rowID, layoutNumber);
        }
    };
    InvoiceHeaderGridComponent.prototype.createCriteriaDropDown = function () {
        this.lstCriteriaOneOptions = [];
        this.lstCriteriaOneOptions.push({ value: 'InvoiceNumber', text: 'Invoice / Credit Number' });
        this.lstCriteriaOneOptions.push({ value: 'AccountNumber', text: 'Account Number' });
        this.lstCriteriaOneOptions.push({ value: 'InvoiceGroupNumber', text: 'Invoice Group Number' });
        this.lstCriteriaOneOptions.push({ value: 'ExtractDate', text: 'Extract Date' });
        this.lstCriteriaOneOptions.push({ value: 'ExtractRunNumber', text: 'Run Number' });
        this.lstCriteriaOneOptions.splice(0, 1);
        this.lstCriteriaOneDropDown.defaultOption = { value: 'InvoiceNumber', text: 'Invoice / Credit Number' };
        this.lstCriteriaTwoOptions = [];
        this.lstCriteriaTwoOptions.push({ value: 'ShowAll', text: 'Show All' });
        this.lstCriteriaTwoOptions.push({ value: 'Invoices', text: 'Show Invoices Only' });
        this.lstCriteriaTwoOptions.push({ value: 'Credits', text: 'Show Credits Only' });
        this.lstCriteriaTwoOptions.splice(0, 1);
        this.lstCriteriaTwoDropDown.defaultOption = { value: 'ShowAll', text: 'Show All' };
        this.lstDateOptions = [];
        this.lstDateOptions.push({ value: 'AllDates', text: 'All Dates' });
        this.lstDateOptions.push({ value: 'PeriodDate', text: 'Period Date' });
        this.lstDateOptions.push({ value: 'ProcessedDate', text: 'Processed Date' });
        this.lstDateOptions.splice(0, 1);
        this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
    };
    InvoiceHeaderGridComponent.prototype.lstCriteriaOneOptionsChange = function (obj) {
        this.uiForm.controls['lstCriteriaOne'].setValue(obj);
        this.invoiceHeaderGrid.clearGridData();
        switch (obj) {
            case 'InvoiceNumber':
                if (this.pageParams.vSCEnableCompanyCode) {
                    this.fieldHidden.trCompanyCode = false;
                    this.uiForm.controls['CompanyCode'].setValue(this.pageParams.vDefaultCompanyCode);
                    this.uiForm.controls['CompanyDesc'].setValue(this.pageParams.vDefaultCompanyDesc);
                    if (this.pageParams.vDefaultCompanyCode)
                        this.companyDropdown.active = { id: this.pageParams.vDefaultCompanyCode, text: this.pageParams.vDefaultCompanyCode + '-' + this.pageParams.vDefaultCompanyDesc };
                }
                else {
                    this.fieldHidden.trCompanyCode = true;
                    this.uiForm.controls['CompanyCode'].setValue(this.pageParams.vDefaultCompanyCode);
                    this.uiForm.controls['CompanyDesc'].setValue(this.pageParams.vDefaultCompanyDesc);
                }
                this.fieldHidden.trInvoiceNumber = false;
                this.uiForm.controls['InvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.tdLstDate = false;
                this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
                this.fieldHidden.trPeriodDate = true;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trAccountNumber = true;
                this.uiForm.controls['AccountNumber'].setValue('');
                this.uiForm.controls['AccountName'].setValue('');
                this.fieldHidden.trInvoiceGroupNumber = true;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.fieldHidden.trExtractDate = true;
                this.currDate = null;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.fieldHidden.trExtractRunNumber = true;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                if (!this.pageParams.vSCEnableCompanyCode) {
                    this.uiForm.controls['CompanyCode'].setValue(this.pageParams.vDefaultCompanyCode);
                    this.uiForm.controls['CompanyDesc'].setValue(this.pageParams.vDefaultCompanyDesc);
                    this.fieldDisable.CompanyCode = true;
                    this.el.nativeElement.querySelector('#CompanyInvoiceNumber').focus();
                }
                else {
                    this.fieldDisable.CompanyCode = false;
                    this.fieldDisable.CompanyCode = false;
                }
                break;
            case 'AccountNumber':
                this.fieldHidden.trAccountNumber = false;
                this.uiForm.controls['AccountNumber'].setValue('');
                this.uiForm.controls['AccountName'].setValue('');
                this.fieldHidden.tdLstDate = false;
                this.lstDateDropDown.selectedItem = 'AllDates';
                this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
                this.fieldHidden.trPeriodDate = true;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trInvoiceNumber = true;
                this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.trInvoiceGroupNumber = true;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.fieldHidden.trCompanyCode = true;
                this.uiForm.controls['CompanyCode'].setValue('');
                this.companyDropdown.active['id'] = '';
                this.fieldHidden.trExtractDate = true;
                this.currDate = null;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.fieldHidden.trExtractRunNumber = true;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                break;
            case 'InvoiceGroupNumber':
                this.fieldHidden.trAccountNumber = false;
                this.fieldHidden.trInvoiceGroupNumber = false;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.uiForm.controls['AccountNumber'].setValue('');
                this.uiForm.controls['AccountName'].setValue('');
                this.fieldHidden.tdLstDate = false;
                this.fieldHidden.trPeriodDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trCompanyCode = true;
                this.uiForm.controls['CompanyCode'].setValue('');
                this.companyDropdown.active['id'] = '';
                this.fieldHidden.trInvoiceNumber = true;
                this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.trExtractDate = true;
                this.currDate = null;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.fieldHidden.trExtractRunNumber = true;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                break;
            case 'ExtractDate':
                this.fieldHidden.trExtractDate = false;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.currDate = null;
                this.fieldHidden.tdLstDate = true;
                this.lstDateDropDown.selectedItem = 'AllDates';
                this.lstDateDropDown.selectedItem = 'AllDates';
                this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
                this.uiForm.controls['lstDate'].setValue('');
                this.fieldHidden.trPeriodDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trCompanyCode = true;
                this.uiForm.controls['CompanyCode'].setValue('');
                this.companyDropdown.active['id'] = '';
                this.fieldHidden.trInvoiceNumber = true;
                this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.trExtractRunNumber = true;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                this.fieldHidden.trInvoiceGroupNumber = true;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.fieldHidden.trAccountNumber = true;
                this.uiForm.controls['AccountNumber'].setValue('');
                break;
            case 'ExtractRunNumber':
                this.fieldHidden.trExtractRunNumber = false;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                this.uiForm.controls['ExtractDate'].setValue('');
                this.currDate = null;
                this.fieldHidden.tdLstDate = true;
                this.lstDateDropDown.selectedItem = 'AllDates';
                this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
                this.uiForm.controls['lstDate'].setValue('');
                this.uiForm.controls['lstDate'].setValue('');
                this.fieldHidden.trPeriodDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trCompanyCode = true;
                this.uiForm.controls['CompanyCode'].setValue('');
                this.companyDropdown.active['id'] = '';
                this.fieldHidden.trInvoiceNumber = true;
                this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.trExtractDate = true;
                this.currDate = null;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.fieldHidden.trInvoiceGroupNumber = true;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.fieldHidden.trAccountNumber = true;
                this.uiForm.controls['AccountNumber'].setValue('');
                break;
            default:
                break;
        }
        this.lstDateDropDown.selectedItem = 'AllDates';
        if (this.parentMode === 'ExtractRunDetails') {
            this.uiForm.controls['InvoiceNumber'].setValue(this.riExchange.getParentAttributeValue('ExtractRunNumberSystemInvoiceNumber'));
            this.uiForm.controls['CompanyInvoiceNumber'].setValue(this.riExchange.getParentHTMLValue('ExtractRunNumberInvoiceNumber'));
            this.uiForm.controls['CompanyCode'].setValue(this.riExchange.getParentHTMLValue('ExtractRunNumberCompanyCode'));
            this.uiForm.controls['CompanyDesc'].setValue(this.riExchange.getParentHTMLValue('ExtractRunNumberCompanyDesc'));
        }
        this.buildGrid();
    };
    InvoiceHeaderGridComponent.prototype.lstDateOptionsChange = function (obj) {
        this.uiForm.controls['lstDate'].setValue(obj);
        switch (obj) {
            case 'AllDates':
                this.fieldHidden.trPeriodDate = true;
                this.fieldHidden.trProcessedDate = true;
                break;
            case 'PeriodDate':
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trPeriodDate = false;
                this.fieldHidden.trProcessedDate = true;
                break;
            case 'ProcessedDate':
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trPeriodDate = true;
                this.fieldHidden.trProcessedDate = false;
                break;
            default:
                break;
        }
    };
    InvoiceHeaderGridComponent.prototype.lstCriteriaTwoOptionsChange = function (obj) {
        this.uiForm.controls['lstCriteriaTwo'].setValue(obj);
    };
    InvoiceHeaderGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.initData();
    };
    InvoiceHeaderGridComponent.prototype.ngAfterViewInit = function () {
        var invoiceNumber = {
            'fieldName': 'InvoiceNumber',
            'index': 3,
            'sortType': 'ASC'
        };
        var invoiceExtractNumber = {
            'fieldName': 'InvoiceExtractNumber',
            'index': 6,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(invoiceNumber);
        this.gridSortHeaders.push(invoiceExtractNumber);
    };
    InvoiceHeaderGridComponent.prototype.onCompanyChange = function (data) {
        this.uiForm.controls['CompanyCode'].setValue(data.CompanyCode);
        if (this.uiForm.controls['CompanyCode'].value) {
            this.companyInvoiceNumberOonChange(this.uiForm.controls['CompanyInvoiceNumber'].value);
        }
    };
    InvoiceHeaderGridComponent.prototype.extraDateSelectedValue = function (data) {
        this.uiForm.controls['ExtractDate'].setValue(data.value);
        this.buildGrid();
    };
    InvoiceHeaderGridComponent.prototype.processedDateSelectedValue = function (data) {
        this.uiForm.controls['ProcessedDate'].setValue(data.value);
    };
    InvoiceHeaderGridComponent.prototype.periodDateSelectedValue = function (data) {
        this.uiForm.controls['PeriodDate'].setValue(data.value);
    };
    InvoiceHeaderGridComponent.prototype.onInvoiceGroupNumberReceived = function (data) {
        this.uiForm.controls['InvoiceGroupNumber'].setValue(data.InvoiceGroupNumber);
        this.uiForm.controls['InvoiceGroupDesc'].setValue(data.InvoiceGroupDesc);
    };
    InvoiceHeaderGridComponent.prototype.copyInvoiceOnChange = function (ev) {
        this.uiForm.controls['CopyInvoice'].setValue(ev);
    };
    InvoiceHeaderGridComponent.prototype.emailInvoiceOnChange = function (ev) {
        this.uiForm.controls['EmailInvoice'].setValue(ev);
    };
    InvoiceHeaderGridComponent.prototype.invoiceSearchComponentDataReceived = function (eventObj) {
        this.uiForm.controls['InvoiceNumber'].setValue(eventObj);
        this.populateDescriptions();
    };
    InvoiceHeaderGridComponent.prototype.sortGrid = function (data) {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    };
    InvoiceHeaderGridComponent.prototype.ngOnDestroy = function () {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.lookUpSubscription)
            this.lookUpSubscription.unsubscribe();
        _super.prototype.ngOnDestroy.call(this);
    };
    InvoiceHeaderGridComponent.prototype.showAlert = function (msgTxt) {
        this.messageModal.show({ msg: msgTxt, title: this.pageTitle }, false);
    };
    InvoiceHeaderGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceHeaderGrid.html'
                },] },
    ];
    InvoiceHeaderGridComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
        { type: ElementRef, },
    ];
    InvoiceHeaderGridComponent.propDecorators = {
        'lstCriteriaOneDropDown': [{ type: ViewChild, args: ['lstCriteriaOneDropDown',] },],
        'lstCriteriaTwoDropDown': [{ type: ViewChild, args: ['lstCriteriaTwoDropDown',] },],
        'lstDateDropDown': [{ type: ViewChild, args: ['lstDateDropDown',] },],
        'invoiceHeaderGrid': [{ type: ViewChild, args: ['invoiceHeaderGrid',] },],
        'invoiceHeaderGridPagination': [{ type: ViewChild, args: ['invoiceHeaderGridPagination',] },],
        'companyDropdown': [{ type: ViewChild, args: ['companyDropdown',] },],
        'invoiceGroupEllipsis': [{ type: ViewChild, args: ['invoiceGroupEllipsis',] },],
        'invoiceSearchEllipsis': [{ type: ViewChild, args: ['invoiceSearchEllipsis',] },],
        'extractDatePicker': [{ type: ViewChild, args: ['extractDatePicker',] },],
        'periodDatePicker': [{ type: ViewChild, args: ['periodDatePicker',] },],
        'processdatePicker': [{ type: ViewChild, args: ['processdatePicker',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return InvoiceHeaderGridComponent;
}(BaseComponent));
