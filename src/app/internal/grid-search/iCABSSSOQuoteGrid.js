var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Component, Injector, ViewChild, Renderer } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var QuoteGridComponent = (function (_super) {
    __extends(QuoteGridComponent, _super);
    function QuoteGridComponent(renderer, injector) {
        _super.call(this, injector);
        this.renderer = renderer;
        this.totalRecords = 0;
        this.totalPageCount = 0;
        this.displayProspectMessage = true;
        this.translatedMessageList = {};
        this.showMessageHeader = true;
        this.promptTitle = '';
        this.promptContent = '';
        this.showErrorHeader = true;
        this.muleConfig = {
            operation: 'Sales/iCABSSSOQuoteGrid',
            module: 'advantage',
            method: 'prospect-to-contract/maintenance'
        };
        this.pageId = '';
        this.misc = {};
        this.controls = [
            { name: 'ProspectNumber', readonly: true, disabled: false, required: false },
            { name: 'ProspectName', readonly: true, disabled: false, required: false },
            { name: 'menu', value: '', readonly: false, disabled: false, required: false },
            { name: 'dlBatchRef' },
            { name: 'dlContractRef' },
            { name: 'ContractTypeCode' },
            { name: 'PaymentInfoRequired' },
            { name: 'SubSystem' },
            { name: 'QuoteNumber' }
        ];
        this.pageId = PageIdentifier.ICABSSSOQUOTEGRID;
    }
    QuoteGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.pageSize = 10;
        this.totalPageCount = 0;
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProspectNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProspectName');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectName', this.riExchange.getParentHTMLValue('ProspectName'));
        var subSystem = this.riExchange.getParentHTMLValue('SubSystem');
        this.setControlValue('menu', '');
        this.buildGrid();
    };
    QuoteGridComponent.prototype.ngAfterViewInit = function () {
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    };
    QuoteGridComponent.prototype.setLocalizationText = function () {
        this.translatedMessageList['Please_ensure_that_you_have_verified_the_prospect_details_before_proceeding'] =
            MessageConstant.PageSpecificMessage.Please_ensure_that_you_have_verified_the_prospect_details_before_proceeding;
        this.translatedMessageList['Information'] = MessageConstant.Message.Information;
    };
    QuoteGridComponent.prototype.menu_onchange = function (val) {
        if (this.riGrid && !this.riGrid.CurrentRow) {
            if (this.riGrid.bodyArray.length > 0) {
                this.SetDefaultFocus();
                this.riGrid.Details.Focus('QuoteNumber');
                this.SOQuoteFocus();
            }
        }
        switch (val) {
            case 'AddContract':
            case 'AddJob':
                this.AddQuote();
                break;
            case 'CopyToContract':
            case 'CopyToJob':
                this.CopyQuote();
                break;
            case 'CustomerQuote':
                this.cmdCustomerQuote_onclick();
                break;
            case 'History':
                this.cmdHistory_onclick();
                break;
        }
    };
    QuoteGridComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('QuoteNumber', 'SOQuote', 'QuoteNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('ContractTypeCode', 'SOQuote', 'ContractTypeCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumn('CreatedDate', 'SOQuote', 'CreatedDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('StatusDesc', 'SOQuote', 'StatusDesc', MntConst.eTypeTextFree, 10);
        this.riGrid.AddColumn('NumPremises', 'SOQuote', 'NumPremises', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('NumServiceCovers', 'SOQuote', 'NumServiceCovers', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('Submit', 'SOQuote', 'Submit', MntConst.eTypeButton, 4);
        this.riGrid.AddColumn('Print', 'SOQuote', 'Print', MntConst.eTypeImage, 1);
        this.riGrid.AddColumn('Info', 'dlHistory', 'Info', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('QuoteNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ContractTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('CreatedDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumPremises', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumServiceCovers', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('QuoteNumber', true);
        this.riGrid.AddColumnOrderable('CreatedDate', true);
        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    };
    QuoteGridComponent.prototype.riGrid_beforeExecute = function () {
        var _this = this;
        this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        var gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();
        var gridQueryParams = new URLSearchParams();
        var strGridData = true;
        gridQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridQueryParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set('ProspectNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectNumber'));
        gridQueryParams.set('LanguageCode', this.riExchange.LanguageCode());
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridQueryParams.set('riSortOrder', sortOrder);
        gridQueryParams.set('riCacheRefresh', 'true');
        gridQueryParams.set('riGridMode', '0');
        gridQueryParams.set('riGridHandle', gridHandle);
        gridQueryParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.gridCurPage.toString());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, gridQueryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data) {
                if (data && data.errorMessage) {
                    _this.messageModal.show(data, true);
                }
                else {
                    _this.gridCurPage = data.pageData ? data.pageData.pageNumber : 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    _this.riGrid.Update = true;
                    _this.riGrid.UpdateBody = true;
                    _this.riGrid.UpdateFooter = true;
                    _this.riGrid.UpdateHeader = true;
                    _this.riGrid.Execute(data);
                }
            }
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    QuoteGridComponent.prototype.SetDefaultFocus = function () {
        var focus = new Event('focus', {});
        var obj = document.querySelector('td[name=QuoteNumber]').querySelectorAll('input[type=text]');
        if (obj && obj.length > 0) {
            this.renderer.invokeElementMethod(obj[0], 'focus', [focus]);
        }
    };
    QuoteGridComponent.prototype.SOQuoteFocus = function () {
        this.attributes.dlContractRowID = this.riGrid.Details.GetAttribute('QuoteNumber', 'RowID');
        this.attributes.ContractTypeCode = this.riGrid.Details.GetValue('ContractTypeCode');
        this.attributes.ProspectName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectName');
        this.attributes.QuoteNumber = this.riGrid.Details.GetValue('QuoteNumber');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlContractRef', this.riGrid.Details.GetAttribute('QuoteNumber', 'AdditionalProperty'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlBatchRef', this.riGrid.Details.GetAttribute('ContractTypeCode', 'AdditionalProperty'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PaymentInfoRequired', this.riGrid.Details.GetAttribute('CreatedDate', 'AdditionalProperty'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riGrid.Details.GetValue('ContractTypeCode'));
    };
    QuoteGridComponent.prototype.riGrid_AfterExecute = function () {
        if (this.displayProspectMessage === true) {
            this.displayProspectMessage = false;
            if (this.riGrid.bodyArray.length === 0) {
                this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.Please_ensure_that_you_have_verified_the_prospect_details_before_proceeding, title: MessageConstant.Message.Information }, false);
            }
        }
    };
    QuoteGridComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid_beforeExecute();
    };
    QuoteGridComponent.prototype.updateColumnData = function (ev) {
    };
    QuoteGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.gridCurPage = currentPage.value;
        this.riGrid_beforeExecute();
    };
    QuoteGridComponent.prototype.refresh = function () {
        this.gridCurPage = 1;
        this.riGrid_beforeExecute();
    };
    QuoteGridComponent.prototype.cmdPremises_onclick = function () {
        this.navigate('Quote', 'grid/application/SOPremiseGrid');
    };
    QuoteGridComponent.prototype.cmdCustomerQuote_onclick = function () {
        var _this = this;
        var strURL;
        var urlPostData = {
            'Function': 'Single',
            'dlContractRowID': this.attributes['dlContractRowID'] ? this.attributes['dlContractRowID'] : '',
            'LanguageCode': this.riExchange.LanguageCode(),
            'Mode': 'Quote'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('', urlPostData).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                if (data.errorMessage) {
                    _this.errorService.emitError(data['errorMessage']);
                }
                else {
                    if (data.url) {
                        window.open(data.url, '_blank');
                    }
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    QuoteGridComponent.prototype.cmdHistory_onclick = function () {
        this.navigate('SOQuote', 'grid/application/DLHistoryGridComponent');
    };
    QuoteGridComponent.prototype.AddQuote = function () {
        var _this = this;
        var option = this.riExchange.riInputElement.GetValue(this.uiForm, 'menu');
        if (option === 'AddContract') {
            this.attributes.ContractTypeCode = 'C';
        }
        else {
            this.attributes.ContractTypeCode = 'J';
        }
        var functionName = option;
        var postDataAdd = {
            'Function': functionName,
            'NegBranchNumber': this.utils.getBranchCode(),
            'ProspectNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectNumber')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData(functionName, {}, postDataAdd).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                if (data.errorMessage) {
                    _this.errorService.emitError(data['errorMessage']);
                }
                else {
                    if (data) {
                        _this.attributes.dlContractRowID = data['dlContractRowID'];
                        _this.attributes.dlPremiseRowID = data['dlPremiseRowID'];
                        _this.attributes.ContractSearchPostCode = data['ContractSearchPostCode'];
                        _this.navigate('AddQuote', 'maintenance/sSdlContractMaintenance', { dlContractRowID: _this.attributes.dlContractRowID });
                    }
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    QuoteGridComponent.prototype.CopyQuote = function () {
        var _this = this;
        var functionName = this.riExchange.riInputElement.GetValue(this.uiForm, 'menu');
        if (functionName === 'AddContract') {
            this.attributes.ContractTypeCode = 'C';
        }
        else {
            this.attributes.ContractTypeCode = 'J';
        }
        var postDataAdd = {
            'Function': functionName,
            'NegBranchNumber': this.utils.getBranchCode(),
            'ProspectNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectNumber'),
            'QuoteNumber': this.riGrid.Details.GetValue('QuoteNumber')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData(functionName, {}, postDataAdd).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.status === 'failure') {
                _this.errorService.emitError(data.oResponse);
            }
            else {
                if (data.errorMessage) {
                    _this.errorService.emitError(data['errorMessage']);
                }
            }
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        this.refresh();
    };
    QuoteGridComponent.prototype.riGrid_BodyOnClick = function (ev) {
        var _this = this;
        switch (this.riGrid.CurrentColumnName) {
            case 'Submit':
                this.SOQuoteFocus();
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PaymentInfoRequired') === '0') {
                    var postDataAdd = {
                        'Function': 'Submit',
                        'ProspectNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProspectNumber'),
                        'QuoteNumber': this.riGrid.Details.GetValue('QuoteNumber')
                    };
                    this.ajaxSource.next(this.ajaxconstant.START);
                    this.fetchRecordData('Submit', {}, postDataAdd).subscribe(function (data) {
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                        if (data && data.status === 'failure') {
                            _this.errorService.emitError(data.oResponse);
                        }
                        else {
                            if (data && data.errorMessage) {
                                _this.errorService.emitError(data['errorMessage']);
                            }
                            else {
                                if (data) {
                                    var msg = data['fullError'];
                                    var error = msg.split('\n');
                                    var errormsg = error[1].replace('', '');
                                    _this.errorService.emitError(errormsg);
                                }
                                _this.refresh();
                            }
                        }
                    }, function (error) {
                        _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                    });
                }
                else {
                    alert('TODO: Sales/iCABSSSOQuoteSubmitMaintenance.htm');
                }
                break;
            case 'Print':
                var strURL = void 0;
                this.SOQuoteFocus();
                if ((ev.srcElement && ev.srcElement.tagName === 'IMG') && ev.srcElement.getAttribute('src')) {
                    var ReportParams = void 0;
                    ReportParams = { riCacheControlMaxAge: 0, dlContractROWID: this.attributes['dlContractRowID'] };
                    alert('TODO: Sales/iCABSSOQuoteReviewReport.htm');
                }
                break;
            case 'Info':
                if ((ev.srcElement && ev.srcElement.tagName === 'IMG') && ev.srcElement.getAttribute('src')) {
                    if (this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty')) {
                        this.SOQuoteFocus();
                        this.messageModal.show({ msg: this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty'), title: MessageConstant.Message.Information }, false);
                    }
                }
        }
    };
    QuoteGridComponent.prototype.riGrid_BodyOnDblClick = function (ev) {
        this.SOQuoteFocus();
        switch (this.riGrid.CurrentColumnName) {
            case 'QuoteNumber':
                this.navigate('SOQuote', 'maintenance/sSdlContractMaintenance', {
                    dlContractRowID: this.attributes.dlContractRowID
                });
                break;
            case 'NumPremises':
                this.cmdPremises_onclick();
                break;
            case 'NumServiceCovers':
                this.attributes['dlPremiseRef'] = 'All';
                this.navigate('SOQuote', 'grid/Sales/SOServiceCoverGrid');
                break;
            case 'StatusDesc':
                this.navigate('SOQuote', 'maintenance/quotestatusmaintenance', { ReportParams: this.attributes.dlContractRowID });
                break;
        }
    };
    QuoteGridComponent.prototype.riGrid_BodyOnKeyDown = function (ev) {
        switch (ev.KeyCode) {
            case 38:
                if (ev.srcElement.parentElement.parentElement.previousSibling) {
                    this.SOQuoteFocus();
                }
                break;
            case 40:
            case 9:
                if (ev.srcElement.parentElement.parentElement.NextSibling) {
                    this.SOQuoteFocus();
                }
                break;
        }
    };
    QuoteGridComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        if (this.translatedMessageList) {
            var _loop_1 = function(key) {
                if (key && this_1.translatedMessageList[key]) {
                    this_1.getTranslatedValue(this_1.translatedMessageList[key], null).subscribe(function (res) {
                        if (res) {
                            _this.translatedMessageList[key] = res;
                        }
                    });
                }
            };
            var this_1 = this;
            for (var key in this.translatedMessageList) {
                _loop_1(key);
            }
        }
    };
    QuoteGridComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    QuoteGridComponent.prototype.fetchRecordData = function (functionName, params, postdata) {
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '0');
        if (functionName !== '') {
            queryParams.set(this.serviceConstants.Action, '6');
        }
        for (var key in params) {
            if (key) {
                queryParams.set(key, params[key]);
            }
        }
        if (postdata) {
            return this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryParams, postdata);
        }
        else {
            return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryParams);
        }
    };
    QuoteGridComponent.prototype.showErrorModal = function (msg) {
        this.errorModal.show({ msg: msg, title: 'Error' }, false);
    };
    QuoteGridComponent.prototype.showMessageModal = function (msg) {
        this.messageModal.show({ msg: msg, title: 'Message' }, false);
    };
    QuoteGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSSOQuoteGrid.html'
                },] },
    ];
    QuoteGridComponent.ctorParameters = [
        { type: Renderer, },
        { type: Injector, },
    ];
    QuoteGridComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'quotePagination': [{ type: ViewChild, args: ['quotePagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return QuoteGridComponent;
}(BaseComponent));
