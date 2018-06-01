var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Observable } from 'rxjs/Rx';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
export var HistoryTypeLanguageSearchComponent = (function (_super) {
    __extends(HistoryTypeLanguageSearchComponent, _super);
    function HistoryTypeLanguageSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.queryParams = {
            operation: 'System/iCABSSHistoryTypeLanguageSearch',
            module: 'history',
            method: 'contract-management/search'
        };
        this.itemsPerPage = '10';
        this.page = '1';
        this.hideInput = false;
        this.controls = [
            { name: 'LanguageCode', readonly: false, disabled: true, required: false },
            { name: 'LanguageDescription', readonly: false, disabled: true, required: false },
            { name: 'HistoryTypeDesc', readonly: false, disabled: false, required: true },
            { name: 'ContractHistoryFilterValue', readonly: false, disabled: false, required: true },
            { name: 'ContractHistoryFilterDesc', readonly: false, disabled: false, required: true },
            { name: 'AccountHistoryFilterValue', readonly: false, disabled: false, required: true },
            { name: 'AccountHistoryFilterDesc', readonly: false, disabled: false, required: true }
        ];
        this.tableheading = 'History Type Search';
        this.columns = [];
        this.pageId = PageIdentifier.ICABSSHISTORYTYPELANGUAGESEARCH;
    }
    HistoryTypeLanguageSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.setControlValue('LanguageCode', this.riExchange.LanguageCode());
        this.setControlValue('LanguageDescription', this.riExchange.getParentHTMLValue('LanguageDescription'));
        this.fetchTranslationAndBuildTable();
        this.setErrorCallback(this);
        this.doLookup();
    };
    HistoryTypeLanguageSearchComponent.prototype.buildTable = function () {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        this.queryParams.search = this.search;
        this.historyTypeLang.loadTableData(this.queryParams);
    };
    HistoryTypeLanguageSearchComponent.prototype.doLookup = function () {
        var _this = this;
        var lookupIPSub = [
            {
                'table': 'Language',
                'query': { 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['LanguageDescription']
            }];
        this.LookUp.lookUpPromise(lookupIPSub, 5).then(function (data) {
            if (data && data[0].length) {
                var resultLanguageDescription = data[0][0].LanguageDescription;
                if (resultLanguageDescription[0])
                    _this.setControlValue('LanguageDescription', resultLanguageDescription);
            }
        }).catch(function (error) {
            _this.errorService.emitError(error);
        });
    };
    HistoryTypeLanguageSearchComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };
    HistoryTypeLanguageSearchComponent.prototype.refresh = function () {
        this.historyTypeLang.loadTableData(this.queryParams);
    };
    HistoryTypeLanguageSearchComponent.prototype.tableDataLoaded = function (data) {
        var tableRecords = data.tableData['records'];
        if (tableRecords.length === 0) {
            this.tableheading = 'No record found';
        }
    };
    HistoryTypeLanguageSearchComponent.prototype.buildTableColumns = function () {
        this.columns = [];
        var res;
        res = this.uiForm.controls['LanguageCode'].value;
        if (res && res.length > 0) {
            this.columns.push({ title: 'Type Code', name: 'HistoryTypeCode' });
            this.columns.push({ title: 'Display Description', name: 'HistoryTypeDesc' });
            this.hideInput = true;
        }
        else {
            this.columns.push({ title: 'Type Code', name: 'HistoryTypeCode' });
            if (this.ellipsis.childConfigParams['parentMode'] !== 'Contract') {
                this.columns.push({ title: 'Description', name: 'HistoryTypeSystemDesc' });
            }
            else {
                this.columns.push({ title: 'Display Description', name: 'HistoryTypeDesc' });
            }
        }
        this.buildTable();
    };
    HistoryTypeLanguageSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        returnObj = event.row;
        this.ellipsis.sendDataToParent(returnObj);
    };
    HistoryTypeLanguageSearchComponent.prototype.tableRowClick = function (event) {
        var vntReturnData;
        vntReturnData = event.row;
        switch (this.parentMode) {
            case 'LookUp':
                if (vntReturnData.LanguageDescription) {
                    this.riExchange.SetParentHTMLInputValue('HistoryTypeDesc', vntReturnData.HistoryTypeSystemDesc);
                    this.setControlValue('HistoryTypeDesc', vntReturnData.HistoryTypeSystemDesc);
                }
                break;
            case 'LookUp-ContractHistory':
                if (vntReturnData.HistoryTypeDesc) {
                    this.riExchange.SetParentHTMLInputValue('ContractHistoryFilterValue', vntReturnData.HistoryTypeCode);
                    this.riExchange.SetParentHTMLInputValue('ContractHistoryFilterDesc', vntReturnData.HistoryTypeDesc);
                    this.setControlValue('ContractHistoryFilterValue', vntReturnData.HistoryTypeCode);
                    this.setControlValue('ContractHistoryFilterDesc', vntReturnData.HistoryTypeDesc);
                }
                break;
            case 'LookUp-AccountHistory':
                if (vntReturnData.ListDetails) {
                    this.riExchange.SetParentHTMLInputValue('AccountHistoryFilterValue', vntReturnData.HistoryTypeCode);
                    this.riExchange.SetParentHTMLInputValue('AccountHistoryFilterDesc', vntReturnData.HistoryTypeSystemDesc);
                    this.setControlValue('AccountHistoryFilterValue', vntReturnData.HistoryTypeCode);
                    this.setControlValue('AccountHistoryFilterDesc', vntReturnData.HistoryTypeSystemDesc);
                    this.navigate('LookUp-AccountHistory', 'application/accountHistory/detail');
                }
                break;
            default:
        }
    };
    HistoryTypeLanguageSearchComponent.prototype.fetchTranslationAndBuildTable = function () {
        var _this = this;
        Observable.forkJoin(this.getTranslatedValue('Type Code', null), this.getTranslatedValue('Description', null), this.getTranslatedValue('Display Description', null)).subscribe(function (data) {
            _this.columns = [];
            var res;
            res = _this.uiForm.controls['LanguageCode'].value;
            if (res && res.length > 0) {
                _this.columns.push({ title: data[0], name: 'HistoryTypeCode' });
                _this.columns.push({ title: data[2], name: 'HistoryTypeDesc' });
                _this.hideInput = true;
            }
            else {
                _this.columns.push({ title: data[0], name: 'HistoryTypeCode' });
                if (_this.ellipsis.childConfigParams['parentMode'] !== 'Contract') {
                    _this.columns.push({ title: data[1], name: 'HistoryTypeSystemDesc' });
                }
                else {
                    _this.columns.push({ title: data[2], name: 'HistoryTypeDesc' });
                }
            }
            _this.buildTable();
        });
    };
    HistoryTypeLanguageSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSHistoryTypeLanguageSearch.html'
                },] },
    ];
    HistoryTypeLanguageSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    HistoryTypeLanguageSearchComponent.propDecorators = {
        'historyTypeLang': [{ type: ViewChild, args: ['historyTypeLang',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return HistoryTypeLanguageSearchComponent;
}(BaseComponent));
