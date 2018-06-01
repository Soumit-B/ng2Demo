var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var ServiceSummaryDetailComponent = (function (_super) {
    __extends(ServiceSummaryDetailComponent, _super);
    function ServiceSummaryDetailComponent(injector) {
        _super.call(this, injector);
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: true, required: false },
            { name: 'ContractName', readonly: false, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: true, required: false },
            { name: 'PremiseName', readonly: false, disabled: true, required: false },
            { name: 'ProductCode', readonly: false, disabled: true, required: false },
            { name: 'ProductDesc', readonly: false, disabled: true, required: false },
            { name: 'TrialPeriodInd', readonly: false, disabled: true, required: false },
            { name: 'ProposedAnnualValue', readonly: false, disabled: true, required: false },
            { name: 'FreeOfChargeInd', readonly: false, disabled: true, required: false },
            { name: 'SeasonalServiceInd', readonly: false, disabled: true, required: false },
            { name: 'SeasonalTemplateNumber', readonly: false, disabled: true, required: false },
            { name: 'SeasonalTemplateName', readonly: false, disabled: true, required: false },
            { name: 'AnnualCalendarInd', readonly: false, disabled: true, required: false },
            { name: 'AnnualCalendarTemplateNumber', readonly: false, disabled: true, required: false },
            { name: 'AnnualCalendarTemplateName', readonly: false, disabled: true, required: false },
            { name: 'ServiceCoverRowID', readonly: false, disabled: true, required: false },
            { name: 'ServiceCoverNumber', readonly: false, disabled: true, required: false },
            { name: 'TrialPeriodEndDate', readonly: false, disabled: true, required: false }
        ];
        this.pageId = '';
        this.pageId = PageIdentifier.ICABSASERVICESUMMARYDETAIL;
    }
    ServiceSummaryDetailComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Service Cover Detail';
        this.window_onload();
    };
    ServiceSummaryDetailComponent.prototype.window_onload = function () {
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        switch (this.parentMode) {
            case 'Contract':
            case 'Premise':
                this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
        }
        this.doLookupAllData();
    };
    ServiceSummaryDetailComponent.prototype.doLookupAllData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCoverNumber', 'TrialPeriodInd', 'TrialPeriodEndDate', 'ProposedAnnualValue',
                    'FreeOfChargeInd', 'SeasonalServiceInd', 'SeasonalTemplateNumber', 'AnnualCalendarInd', 'AnnualCalendarTemplateNumber']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                if (data[0][0]) {
                    var AnnualCalendarInd = data[0][0].AnnualCalendarInd;
                    var AnnualCalendarTemplateNumber = data[0][0].AnnualCalendarTemplateNumber;
                    var ContractNumber = data[0][0].ContractNumber;
                    var FreeOfChargeInd = data[0][0].FreeOfChargeInd;
                    var PremiseNumber = data[0][0].PremiseNumber;
                    var ProductCode = data[0][0].ProductCode;
                    var ProposedAnnualValue = data[0][0].ProposedAnnualValue;
                    var SeasonalServiceInd = data[0][0].SeasonalServiceInd;
                    var SeasonalTemplateNumber = data[0][0].SeasonalTemplateNumber;
                    var ServiceCoverNumber = data[0][0].ServiceCoverNumber;
                    var TrialPeriodEndDate = data[0][0].TrialPeriodEndDate;
                    var TrialPeriodInd = data[0][0].TrialPeriodInd;
                    var ttServiceCover = data[0][0].ttServiceCover;
                    _this.setControlValue('AnnualCalendarInd', AnnualCalendarInd);
                    _this.setControlValue('AnnualCalendarTemplateNumber', AnnualCalendarTemplateNumber);
                    _this.setControlValue('ContractNumber', ContractNumber);
                    _this.setControlValue('FreeOfChargeInd', FreeOfChargeInd);
                    _this.setControlValue('PremiseNumber', PremiseNumber);
                    _this.setControlValue('ProductCode', ProductCode);
                    _this.setControlValue('ProposedAnnualValue', ProposedAnnualValue);
                    _this.setControlValue('SeasonalServiceInd', SeasonalServiceInd);
                    _this.setControlValue('SeasonalTemplateNumber', SeasonalTemplateNumber);
                    _this.setControlValue('ServiceCoverNumber', ServiceCoverNumber);
                    _this.setControlValue('TrialPeriodEndDate', TrialPeriodEndDate);
                    _this.setControlValue('TrialPeriodInd', TrialPeriodInd);
                    if (_this.dtTrialPeriodEndDate)
                        _this.dtTrialPeriodEndDate = new Date(_this.getControlValue('TrialPeriodEndDate'));
                }
                _this.doLookupOtherData();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceSummaryDetailComponent.prototype.doLookupOtherData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc']
            },
            {
                'table': 'AnnualCalendarTemplate',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'AnnualCalendarTemplateNumber': this.getControlValue('AnnualCalendarTemplateNumber')
                },
                'fields': ['TemplateName']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data.hasError) {
                _this.errorService.emitError(data);
            }
            else {
                var Contract = data[0][0];
                if (Contract) {
                    _this.setControlValue('ContractName', Contract.ContractName);
                }
                var Premise = data[1][0];
                if (Premise) {
                    _this.setControlValue('PremiseName', Premise.PremiseName);
                }
                var Product = data[2][0];
                if (Product) {
                    _this.setControlValue('ProductDesc', Product.ProductDesc);
                }
                var AnnualCalendarTemplate = data[3][0];
                if (AnnualCalendarTemplate) {
                    _this.setControlValue('AnnualCalendarTemplateName', AnnualCalendarTemplate.TemplateName);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceSummaryDetailComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceSummaryDetail.html'
                },] },
    ];
    ServiceSummaryDetailComponent.ctorParameters = [
        { type: Injector, },
    ];
    return ServiceSummaryDetailComponent;
}(BaseComponent));
