var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
export var ProRataChargeStatusLanguageSearchComponent = (function (_super) {
    __extends(ProRataChargeStatusLanguageSearchComponent, _super);
    function ProRataChargeStatusLanguageSearchComponent(injector) {
        _super.call(this, injector);
        this.displayFields = ['ProRataChargeStatusLang.ProRataChargeStatusCode', 'ProRataChargeStatusLang.ProRataChargeStatusDesc'];
        this.LangSearchReceived = new EventEmitter();
        this.pageId = '';
        this.controls = [];
        this.columns = [
            { title: 'Type Code', name: 'ProRataChargeStatusCode' },
            { title: 'Description', name: 'ProRataChargeStatusDesc' }
        ];
        this.queryParams = {
            operation: 'System/iCABSSProRataChargeStatusLanguageSearch',
            module: 'charges',
            method: 'bill-to-cash/search'
        };
        this.search = new URLSearchParams();
        this.pageId = PageIdentifier.ICABSSPRORATACHARGESTATUSLANGUAGESEARCH;
    }
    ProRataChargeStatusLanguageSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getLanguageCode();
        this.doLookup();
        this.buildTable();
    };
    ProRataChargeStatusLanguageSearchComponent.prototype.getLanguageCode = function () {
    };
    ProRataChargeStatusLanguageSearchComponent.prototype.doLookup = function () {
        var _this = this;
        var lookupIPSub = [
            {
                'table': 'Language',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': [
                    'LanguageDescription'
                ]
            }
        ];
        this.lookUpRecord(lookupIPSub, 5).subscribe(function (data) {
            if (data.results && data.results.length > 0) {
                var resultLanguageDescription = data.results[0];
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ProRataChargeStatusLanguageSearchComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        if (maxresults) {
            this.search.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.search, data);
    };
    ProRataChargeStatusLanguageSearchComponent.prototype.buildTable = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        if (this.inputParams && this.inputParams['parentMode'] === 'ProRataChargeMaintenance') {
            this.search.set('UserSelectInd', 'true');
            this.search.set('ProRataChargeMaintenance', 'true');
        }
        this.queryParams.search = this.search;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search)
            .subscribe(function (data) {
            _this.proRataChargeStatusLanguageDropDown.updateComponent(data.records);
        }, function (error) {
        });
    };
    ProRataChargeStatusLanguageSearchComponent.prototype.refresh = function () {
        this.proRataChargeStatusLanguageSearchTable.loadTableData(this.queryParams);
    };
    ProRataChargeStatusLanguageSearchComponent.prototype.onLangsearchReceived = function (obj) {
        this.LangSearchReceived.emit(obj.value);
    };
    ProRataChargeStatusLanguageSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-languagesearch',
                    template: " \n        <form novalidate [formGroup]=\"this['uiForm']\">\n            <icabs-dropdown #proRataChargeStatusLanguageDropDown\n  [itemsToDisplay]='displayFields' [disabled]='isDisabled' [isRequired]='isRequired' [active]='active' (selectedValue)='onLangsearchReceived($event)'>\n  </icabs-dropdown>\n   </form>"
                },] },
    ];
    ProRataChargeStatusLanguageSearchComponent.ctorParameters = [
        { type: Injector, },
    ];
    ProRataChargeStatusLanguageSearchComponent.propDecorators = {
        'proRataChargeStatusLanguageSearchTable': [{ type: ViewChild, args: ['proRataChargeStatusLanguageSearchTable',] },],
        'proRataChargeStatusLanguageDropDown': [{ type: ViewChild, args: ['proRataChargeStatusLanguageDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'LangSearchReceived': [{ type: Output },],
    };
    return ProRataChargeStatusLanguageSearchComponent;
}(BaseComponent));
