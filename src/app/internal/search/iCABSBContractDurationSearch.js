import { HttpService } from '../../../shared/services/http-service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
export var ContractDurationComponent = (function () {
    function ContractDurationComponent(serviceConstants, _httpService) {
        this.serviceConstants = serviceConstants;
        this._httpService = _httpService;
        this.method = 'contract-management/search';
        this.module = 'duration';
        this.operation = 'Business/iCABSBContractDurationSearch';
        this.search = new URLSearchParams();
        this.displayFields = ['ContractDurationCode', 'ContractDurationDesc'];
        this.receivedcontractDuration = new EventEmitter();
    }
    ContractDurationComponent.prototype.ngOnInit = function () {
        if (!this.durationData) {
            this.fetchDurationData();
        }
        else {
            this.contractDurationDropDown.updateComponent(this.durationData);
        }
    };
    ContractDurationComponent.prototype.ngOnChanges = function (data) {
        this.fetchDurationData();
    };
    ContractDurationComponent.prototype.fetchDurationData = function () {
        var _this = this;
        if (!this.inputParams.countryCode || !this.inputParams.businessCode) {
            return;
        }
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        if (this.active === null || this.active === undefined) {
            this.active = {
                id: '',
                text: ''
            };
        }
        if (this.isDisabled === null || this.isDisabled === undefined) {
            this.isDisabled = false;
        }
        if (this.isRequired === null || this.isRequired === undefined) {
            this.isRequired = false;
        }
        if (this.inputParams.businessCode !== undefined &&
            this.inputParams.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined &&
            this.inputParams.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.search.set('ValidForNewContract', this.validForNewContract ? 'Yes' : null);
        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            _this.requestdata = data.records;
            _this.contractDurationDropDown.updateComponent(_this.requestdata);
        }, function (error) {
            _this.errorMessage = error;
        });
    };
    ContractDurationComponent.prototype.onContractDurationReceived = function (obj) {
        var code = obj.value.ContractDurationCode;
        var desc = obj.value.ContractDurationDesc;
        var returnObj;
        switch (this.inputParams.parentMode) {
            case 'LookUp':
            case 'LookUp-Contract':
            case 'SOPProspectStatusChange':
                returnObj = {
                    'ContractDurationCode': code,
                    'ContractDurationDesc': desc
                };
                break;
            case 'LookUp-NewContract':
                returnObj = {
                    'NewContractDurationCode': code,
                    'ContractDurationDesc': desc
                };
                break;
            case 'LookUp-ContractMinDuration':
                returnObj = {
                    'MinimumDurationCode': code,
                    'MinimumDurationDesc': desc
                };
                break;
            case 'LookUp-SubsequentDuration':
                returnObj = {
                    'SubsequentDurationCode': code,
                    'SubsequentDurationDesc': desc
                };
                break;
            default:
                returnObj = {
                    'ContractDurationCode': code,
                    'Object': obj.value
                };
        }
        this.receivedcontractDuration.emit(returnObj);
    };
    ContractDurationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-contractduration',
                    template: "<icabs-dropdown #contractDurationDropDown\n  [itemsToDisplay]=\"displayFields\" [disabled]=\"isDisabled\" [isRequired]=\"isRequired\" [active]=\"active\" (selectedValue)=\"onContractDurationReceived($event)\">\n  </icabs-dropdown>"
                },] },
    ];
    ContractDurationComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
    ];
    ContractDurationComponent.propDecorators = {
        'contractDurationDropDown': [{ type: ViewChild, args: ['contractDurationDropDown',] },],
        'inputParams': [{ type: Input },],
        'durationData': [{ type: Input },],
        'isDisabled': [{ type: Input },],
        'active': [{ type: Input },],
        'isRequired': [{ type: Input },],
        'validForNewContract': [{ type: Input },],
        'receivedcontractDuration': [{ type: Output },],
    };
    return ContractDurationComponent;
}());
