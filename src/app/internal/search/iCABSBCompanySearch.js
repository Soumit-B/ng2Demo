import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
export var BCompanySearchComponent = (function () {
    function BCompanySearchComponent(serviceConstants, _httpService, _logger) {
        this.serviceConstants = serviceConstants;
        this._httpService = _httpService;
        this._logger = _logger;
        this.receivedCompanyCode = new EventEmitter();
        this.search = new URLSearchParams();
        this.displayFields = ['CompanyCode', 'CompanyDesc'];
    }
    BCompanySearchComponent.prototype.ngOnInit = function () {
        this.getData();
    };
    BCompanySearchComponent.prototype.ngOnChanges = function (data) {
        if (data.inputParams) {
            this.getData();
        }
    };
    BCompanySearchComponent.prototype.getData = function () {
        var _this = this;
        if (!this.inputParams.countryCode || !this.inputParams.businessCode) {
            return;
        }
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        if (this.inputParams.companyCode !== undefined &&
            this.inputParams.companyCode !== null) {
            this.search.set('CompanyCode', this.inputParams.companyCode);
        }
        if (this.inputParams.companyDesc !== undefined &&
            this.inputParams.companyDesc !== null) {
            this.search.set('CompanyDesc', this.inputParams.companyDesc);
        }
        var xhrParams = {
            module: 'structure',
            method: 'it-functions/search',
            operation: 'Business/iCABSBCompanySearch',
            search: this.search
        };
        this._httpService.makeGetRequest(xhrParams.method, xhrParams.module, xhrParams.operation, xhrParams.search).subscribe(function (data) {
            _this.requestdata = data.records;
            if (_this.requestdata.length > 0 && _this.active['id'] === '' && _this.active['text'] === '') {
                _this.bcompanyDropDown.active['id'] = 1;
                _this.bcompanyDropDown.active['text'] = _this.requestdata[0] && _this.requestdata[0].CompanyDesc ? _this.requestdata[0].APICode + ' - ' + _this.requestdata[0].CompanyDesc : '';
            }
            _this.bcompanyDropDown.updateComponent(_this.requestdata);
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    BCompanySearchComponent.prototype.onBCompanySearchReceived = function (obj) {
        var companyCode = obj.value.CompanyCode;
        var companyDesc = obj.value.CompanyDesc;
        var returnObj;
        switch (this.inputParams.parentMode) {
            case 'LookUp':
                returnObj = {
                    'CompanyCode': companyCode,
                    'CompanyDesc': companyDesc
                };
                break;
            case 'LookUp-ProRata-Original':
                returnObj = {
                    'OriginalCompanyCode': companyCode,
                    'OriginalCompanyDesc': companyDesc
                };
                break;
            case 'LookUp-ProRata-Produced':
                returnObj = {
                    'ProducedCompanyCode': companyCode,
                    'ProducedCompanyDesc': companyDesc
                };
                break;
            default:
                returnObj = {
                    'companyCode': companyCode,
                    'companyDesc': companyDesc
                };
        }
        this.receivedCompanyCode.emit(returnObj);
    };
    BCompanySearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-business-company-search',
                    template: "<icabs-dropdown #bcompanyDropDown\n        [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onBCompanySearchReceived($event)\">\n    </icabs-dropdown>"
                },] },
    ];
    BCompanySearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: Logger, },
    ];
    BCompanySearchComponent.propDecorators = {
        'bcompanyDropDown': [{ type: ViewChild, args: ['bcompanyDropDown',] },],
        'inputParams': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'receivedCompanyCode': [{ type: Output },],
    };
    return BCompanySearchComponent;
}());
