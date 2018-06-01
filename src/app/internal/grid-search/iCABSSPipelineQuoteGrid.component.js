var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { InternalMaintenanceModuleRoutes, InternalGridSearchModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var PipelineQuoteGridComponent = (function (_super) {
    __extends(PipelineQuoteGridComponent, _super);
    function PipelineQuoteGridComponent(injector) {
        _super.call(this, injector);
        this.promptTitle = '';
        this.promptContent = '';
        this.curPage = 1;
        this.pageSize = 10;
        this.totalRecords = 1;
        this.selectedRow = -1;
        this.displayProspectMessage = true;
        this.iOpenWONumber = '0';
        this.menuDefaultOption = {
            'value': '',
            'text': 'Options'
        };
        this.pageId = '';
        this.controls = [
            { name: 'ProspectNumber', disabled: true },
            { name: 'ProspectName', disabled: true },
            { name: 'ProspectType', disabled: true },
            { name: 'QuoteNumber', disabled: true },
            { name: 'Misc' },
            { name: 'dlBatchRef' },
            { name: 'dlContractRef' },
            { name: 'ContractTypeCode' },
            { name: 'DisQuoteTypeCode' },
            { name: 'DisContractTypeCode' },
            { name: 'QuoteTypeCode' },
            { name: 'PassQuoteTypeCode' },
            { name: 'EmployeeCode' },
            { name: 'EmployeeSurName' },
            { name: 'QuotePassWONumber' },
            { name: 'QuotePassAction' },
            { name: 'PassWONumber' },
            { name: 'PaymentInfoRequired' },
            { name: 'SubSystem' },
            { name: 'ReportParams' },
            { name: 'ForceEntryLostCodes' }
        ];
        this.headerParams = {
            method: 'prospect-to-contract/maintenance',
            module: 'advantage',
            operation: 'Sales/iCABSSPipelineQuoteGrid'
        };
        this.pageId = PageIdentifier.ICABSSPIPELINEQUOTEGRID;
    }
    PipelineQuoteGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Advantage Quotes';
        this.promptTitle = 'Message';
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.riMaintenance_AfterEvent();
        }
        else {
            this.pageParams.menuArray = [];
            this.menu.defaultOption = this.menuDefaultOption;
            this.loadSpeedScript();
        }
    };
    PipelineQuoteGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PipelineQuoteGridComponent.prototype.loadSpeedScript = function () {
        var _this = this;
        var sysCharNumbers = [
            this.sysCharConstants.SystemCharWarnWhenOpenWOOnLeaveOfSOQuoteGrid
        ];
        var sysCharIP = {
            operation: 'iCABSSPipelineQuoteGrid',
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            _this.pageParams.scWarnOpenWOrders = data['records'][0].Required;
            _this.onLoad();
        });
    };
    PipelineQuoteGridComponent.prototype.onLoad = function () {
        this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('PassProspectNumber'));
        this.setControlValue('ProspectName', this.riExchange.getParentHTMLValue('PassProspectName'));
        this.setControlValue('ProspectType', this.riExchange.getParentHTMLValue('ProspectTypeDesc') + '/' + this.riExchange.getParentHTMLValue('ProspectSourceDesc'));
        this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
        this.setControlValue('EmployeeSurName', this.riExchange.getParentHTMLValue('EmployeeSurName'));
        this.riExchange.getParentHTMLValue('SubSystem');
        this.getDefaults();
        this.setControlValue('QuotePassAction', 'UnSet');
        this.buildGrid();
        this.riGrid_BeforeExecute();
    };
    PipelineQuoteGridComponent.prototype.getDefaults = function () {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set(this.serviceConstants.Function, 'GetDefaults');
        queryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            var valArray = data.MenuOptionCodeList.split(String.fromCharCode(10), -1, 1);
            var descArray = data.MenuOptionDescList.split(String.fromCharCode(10), -1, 1);
            _this.pageParams.quoteReviewReportName = data.QuoteReviewReportName;
            _this.pageParams.customerQuoteReportName = data.CustomerQuoteReportName;
            _this.pageParams.photosRequiredInd = data.PhotosRequiredInd;
            for (var i = 0; i < valArray.length; i++) {
                _this.pageParams.menuArray.push({
                    'value': valArray[i],
                    'text': descArray[i]
                });
            }
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PipelineQuoteGridComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('QuoteNumber', 'SOQuote', 'QuoteNumber', MntConst.eTypeTextFree, 4);
        this.riGrid.AddColumn('QuotMntConst.eTypeCode', 'SOQuote', 'QuotMntConst.eTypeCode', MntConst.eTypeCode, 4);
        this.riGrid.AddColumn('InPipeline', 'SOQuote', 'InPipeline', MntConst.eTypeImage, 0, true);
        this.riGrid.AddColumn('CreatedDate', 'SOQuote', 'CreatedDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('EffectiveDate', 'SOQuote', 'EffectiveDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('StatusDesc', 'SOQuote', 'StatusDesc', MntConst.eTypeTextFree, 10);
        this.riGrid.AddColumn('NumPremises', 'SOQuote', 'NumPremises', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('NumServiceCovers', 'SOQuote', 'NumServiceCovers', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('MasterValue', 'SOQuote', 'MasterValue', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumn('Value', 'SOQuote', 'Value', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumn('Submit', 'SOQuote', 'Submit', MntConst.eTypeButton, 4);
        this.riGrid.AddColumn('Print', 'SOQuote', 'Print', MntConst.eTypeImage, 1);
        this.riGrid.AddColumn('Info', 'dlHistory', 'Info', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('QuoteNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('CreatedDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumPremises', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('NumServiceCovers', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('QuoteNumber', true);
        this.riGrid.AddColumnOrderable('QuotMntConst.eTypeCode', true);
        this.riGrid.AddColumnOrderable('CreatedDate', true);
        this.riGrid.AddColumnOrderable('EffectiveDate', true);
        this.riGrid.AddColumnAlign('EffectiveDate', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
    };
    PipelineQuoteGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridQueryParams = new URLSearchParams();
        gridQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridQueryParams.set(this.serviceConstants.Action, '2');
        gridQueryParams.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        gridQueryParams.set(this.serviceConstants.GridMode, '0');
        gridQueryParams.set(this.serviceConstants.GridCacheRefresh, 'True');
        gridQueryParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        gridQueryParams.set(this.serviceConstants.GridPageSize, '10');
        gridQueryParams.set(this.serviceConstants.GridPageCurrent, this.curPage.toString());
        gridQueryParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        gridQueryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, gridQueryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data && data.errorMessage) {
                _this.messageModal.show(data, true);
            }
            else {
                _this.curPage = 1;
                _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
                _this.riGrid.Execute(data);
            }
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PipelineQuoteGridComponent.prototype.riGrid_AfterExecute = function () {
        this.riGrid.SetDefaultFocus();
        if (!this.riGrid.Update) {
            if (this.displayProspectMessage) {
                this.displayProspectMessage = false;
            }
            if (this.riGrid.HTMLGridBody.children.length === 0) {
                this.messageModal.content = 'Please ensure that you have verified the prospect details before proceeding';
                this.messageModal.show();
            }
            this.SOQuoteFocus(this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]);
        }
    };
    PipelineQuoteGridComponent.prototype.riMaintenance_AfterEvent = function () {
        this.buildGrid();
        this.riGrid.Update = false;
        this.riGrid_BeforeExecute();
    };
    PipelineQuoteGridComponent.prototype.SOQuoteFocus = function (rsrcElement) {
        this.setAttribute('dlContractRowID', this.riGrid.Details.GetAttribute('QuoteNumber', 'RowID'));
        this.setAttribute('ContractTypeCode', this.riGrid.Details.GetAttribute('StatusDesc', 'AdditionalProperty'));
        this.setAttribute('ProspectName', this.getControlValue('ProspectName'));
        this.setAttribute('QuoteNumber', this.riGrid.Details.GetValue('QuoteNumber'));
        this.setControlValue('PassQuoteTypeCode', this.riGrid.Details.GetValue('QuoteTypeCode'));
        this.setControlValue('QuoteNumber', this.riGrid.Details.GetValue('QuoteNumber'));
        this.setControlValue('dlContractRef', this.riGrid.Details.GetAttribute('QuoteNumber', 'AdditionalProperty'));
        this.setControlValue('dlBatchRef', this.riGrid.Details.GetAttribute('NumPremises', 'AdditionalProperty'));
        this.setControlValue('PaymentInfoRequired', this.riGrid.Details.GetAttribute('NumServiceCovers', 'AdditionalProperty'));
        this.setControlValue('ContractTypeCode', this.riGrid.Details.GetAttribute('StatusDesc', 'AdditionalProperty'));
        this.setControlValue('DisContractTypeCode', this.riGrid.Details.GetAttribute('CreatedDate', 'AdditionalProperty'));
        this.setControlValue('ForceEntryLostCodes', this.riGrid.Details.GetAttribute('EffectiveDate', 'AdditionalProperty'));
        rsrcElement.focus();
    };
    PipelineQuoteGridComponent.prototype.checkForOpenWO = function (RunningFrom) {
        var _this = this;
        this.lClosingWO = false;
        this.iOpenWONumber = '0';
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set(this.serviceConstants.Function, 'CheckForOpenWO');
        queryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.iOpenWONumber = data.OpenWONumber;
            _this.iNumQuotes = data.NumQuotes;
            _this.iNumOpenQuotes = data.NumOpenQuotes;
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        this.setControlValue('PassWONumber', '0');
        if (this.iOpenWONumber !== '0') {
            this.showDialog('An open WorkOrder exists.Do you want to close it now?', function () {
                this.lClosingWO = true;
                this.setcontrolValue('PassWONumber', this.iOpenWONumber);
            });
            this.lClosingWO = true;
            this.setControlValue('PassWONumber', this.iOpenWONumber);
        }
    };
    PipelineQuoteGridComponent.prototype.riGrid_BodyOnClick = function (event) {
        this.SOQuoteFocus(event.srcElement);
        switch (this.riGrid.CurrentColumnName) {
            case 'Submit':
                var lCanSubmit_1 = true;
                if (this.pageParams.photosRequiredInd === 'Y') {
                    lCanSubmit_1 = false;
                    this.showDialog('Do you have Photographic Evidence of the problem?', function () {
                        lCanSubmit_1 = true;
                        this.onCanSubmit();
                    });
                }
                else {
                    this.onCanSubmit();
                }
                break;
            case 'Print':
                this.cmdCustomerQuote_onclick();
                break;
            case 'Info':
                if (event.srcElement.style.cursor !== '') {
                    this.messageModal.content = this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty');
                    this.messageModal.show();
                }
        }
    };
    PipelineQuoteGridComponent.prototype.riGrid_BodyOnDblClick = function (data) {
        this.riGrid.Update = false;
        var cellIndex = data.cellIndex;
        switch (this.riGrid.CurrentColumnName) {
            case 'QuoteNumber':
                if (this.getControlValue('PassQuoteTypeCode') === 'DEL' ||
                    this.getControlValue('PassQuoteTypeCode') === 'TER') {
                    this.quoteLostBusinessCodes();
                }
                else if (this.getControlValue('PassQuoteTypeCode') === 'RED' ||
                    this.getControlValue('PassQuoteTypeCode') === 'AMD') {
                    this.navigate('SOQuote', 'maintenance/sSdlContractMaintenance', {
                        'PipelineAmend': 'PipelineAmend'
                    });
                }
                else {
                    this.navigate('SOQuote', 'maintenance/sSdlContractMaintenance');
                }
                break;
            case 'InPipeline':
                this.selectQuote();
                break;
            case 'EffectiveDate':
                if (this.getControlValue('PassQuoteTypeCode') === 'NEW' ||
                    this.getControlValue('PassQuoteTypeCode') === 'AMD') {
                    this.navigate('SOQuoteEffectiveDate', 'maintenance/sSdlContractMaintenance', {
                        'EffectiveDate': 'EffectiveDate'
                    });
                }
                else {
                    this.navigate('SOQuote', 'maintenance/dlContractLostBusinessMaintenance');
                }
                break;
            case 'StatusDesc':
                this.setControlValue('ReportParams', this.attributes.dlContractRowID);
                this.navigate('SOQuote', 'maintenance/quotestatusmaintenance');
                break;
            case 'NumPremises':
                if (this.getControlValue('PassQuoteTypeCode') === 'DEL') {
                    this.navigate('QuoteDEL', 'grid/sales/PipelinePremiseGrid');
                }
                else {
                    this.navigate('Quote', 'grid/sales/PipelinePremiseGrid');
                }
                break;
            case 'NumServiceCovers':
                this.attributes.dlPremiseRef = 'All';
                this.navigate('SOQuote', 'grid/Sales/SOServiceCoverGrid');
                break;
        }
    };
    PipelineQuoteGridComponent.prototype.onCanSubmit = function () {
        var lCanSubmit = true;
        if (this.getControlValue('ForceEntryLostCodes') === 'yes') {
            this.quoteLostBusinessCodes();
        }
        else {
            lCanSubmit = true;
            if (this.getControlValue('PassQuoteTypeCode') === 'TER') {
                lCanSubmit = false;
                this.showDialog('You are about to Submit a Contract Termination. Are you sure?', function () {
                    lCanSubmit = true;
                    this.processSubmitRequest();
                });
            }
            else {
                this.navigate('SOQuote', InternalMaintenanceModuleRoutes.ICABSSSOQUOTESUBMITMAINTENANCE);
            }
        }
    };
    PipelineQuoteGridComponent.prototype.processSubmitRequest = function () {
        var _this = this;
        this.setControlValue('QuotePassAction', 'Submit');
        if (this.getControlValue('PaymentInfoRequired') === '0') {
            var queryParams = new URLSearchParams();
            queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            queryParams.set(this.serviceConstants.Action, '6');
            queryParams.set(this.serviceConstants.Function, 'Submit');
            queryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));
            queryParams.set('QuoteNumber', this.getControlValue('QuoteNumber'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(function (data) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    data.msg = data.errorMessage || data.fullError;
                    _this.messageModal.show(data, true);
                }
                else {
                    if (data.ReturnMessage) {
                        _this.messageModal.show(data, true);
                    }
                    _this.riGrid_BeforeExecute();
                }
            }, function (error) {
                _this.logger.log('Error', error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    PipelineQuoteGridComponent.prototype.quoteLostBusinessCodes = function () {
        if (this.getControlValue('PassQuoteTypeCode') === 'RED') {
        }
        else {
        }
    };
    PipelineQuoteGridComponent.prototype.riExchange_UpDateHTMLDocument = function () {
        this.riGrid.Update = false;
        this.riGrid_BeforeExecute();
    };
    PipelineQuoteGridComponent.prototype.onMenuSelect = function (type) {
        switch (type) {
            case 'NEWC':
            case 'NEWJ':
            case 'ADD':
            case 'AMD':
            case 'DEL':
            case 'RED':
            case 'TER':
                this.addQuote();
                this.setControlValue('QuotePassAction', 'New');
                break;
            case 'WorkOrders':
                break;
            case 'ApprovalGrid':
                this.navigate('PipelineQuoteGrid', 'grid/' + InternalGridSearchModuleRoutes.ICABSSDLCONTRACTAPPROVALGRID);
                break;
        }
    };
    PipelineQuoteGridComponent.prototype.menu2_onchange = function (type) {
        switch (type) {
            case 'CustomerQuote':
                this.cmdCustomerQuote_onclick();
                break;
            case 'History':
                this.navigate('SOQuote', 'grid/application/DLHistoryGridComponent');
                break;
        }
    };
    PipelineQuoteGridComponent.prototype.cmdCustomerQuote_onclick = function () {
        var _this = this;
        var printQueryParams = new URLSearchParams();
        printQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        printQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        printQueryParams.set(this.serviceConstants.Action, '6');
        printQueryParams.set('riCacheControlMaxAge', '0');
        printQueryParams.set('dlContractROWID', this.getAttribute('dlContractRowID'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, printQueryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                data.msg = data.errorMessage || data.fullError;
                _this.messageModal.show(data, true);
            }
            else {
                window.open(data.url, '_blank');
            }
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PipelineQuoteGridComponent.prototype.addQuote = function () {
        var _this = this;
        if (this.menu.value === 'NEWJ') {
            this.attributes.ContractTypeCode = 'J';
        }
        else {
            this.attributes.ContractTypeCode = 'C';
        }
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set(this.serviceConstants.Function, this.menu.value);
        queryParams.set('NegBranchNumber', this.getControlValue('ProspectNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.attributes.dlContractRowID = data.dlContractRowID;
            if (_this.menu.value === 'NEWJ' || _this.menu.value === 'NEWC') {
                _this.attributes.dlPremiseRowID = data.dlPremiseRowID;
                _this.attributes.ContractSearchPostCode = data.ContractSearchPostCode;
                _this.navigate('AddQuote', 'maintenance/sSdlContractMaintenance');
            }
            else {
                _this.riGrid_BeforeExecute();
            }
            if (_this.getControlValue('ForceEntryLostCodes') === 'yes') {
                _this.quoteLostBusinessCodes();
            }
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PipelineQuoteGridComponent.prototype.riExchange_UnLoadHTMLDocument = function () {
        if (this.pageParams.scWarnOpenWOrders) {
            this.checkForOpenWO('Exit');
            this.setControlValue('QuotePassWONumber', this.getControlValue('PassWONumber'));
        }
        if (this.iNumQuotes === 0) {
            this.setControlValue('QuotePassWONumber', 'NoQuotes');
        }
        if (this.iNumQuotes === 'UnSet' && this.iNumQuotes > 0) {
            this.setControlValue('QuotePassAction', 'New');
        }
        this.riExchange.setParentHTMLValue('QuotePassWoNumber');
        this.riExchange.setParentHTMLValue('QuotePassAction');
    };
    PipelineQuoteGridComponent.prototype.selectQuote = function () {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set(this.serviceConstants.Function, 'updateSingle');
        queryParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));
        queryParams.set('QuoteNumber', this.getControlValue('QuoteNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.buildGrid();
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PipelineQuoteGridComponent.prototype.promptSave = function (e) {
        if (this.promptCallback && typeof this.promptCallback === 'function') {
            this.promptCallback.call();
        }
    };
    PipelineQuoteGridComponent.prototype.getCurrentPage = function (data) {
        this.curPage = data.value;
        this.buildGrid();
    };
    PipelineQuoteGridComponent.prototype.promptYes = function (event) {
        if (this.promptCallback && typeof this.promptCallback === 'function') {
            this.promptCallback.call(this);
        }
    };
    PipelineQuoteGridComponent.prototype.showDialog = function (message, fncallback) {
        this.promptCallback = fncallback;
        this.promptModal.show();
    };
    PipelineQuoteGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSPipelineQuoteGrid.html'
                },] },
    ];
    PipelineQuoteGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    PipelineQuoteGridComponent.propDecorators = {
        'menu': [{ type: ViewChild, args: ['menu',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return PipelineQuoteGridComponent;
}(BaseComponent));
