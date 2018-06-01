var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ErrorService } from '../../../shared/services/error.service';
export var MarktSelectSearchComponent = (function (_super) {
    __extends(MarktSelectSearchComponent, _super);
    function MarktSelectSearchComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.queryParams = {
            operation: 'Application/iCABSMarktSelectSearch',
            module: 'validation',
            method: 'contract-management/search'
        };
        this.msgArray = [
            'Insufficient search parameters',
            'Must be one of the following combinations:',
            '* Company Name + Postcode ',
            '* Company Name + Town ',
            '* Postcode  ',
            '* Postcode + House Number',
            '* Town + Street Name + House Number',
            '* Telephone Number',
            '* Chamber of Commerce Number',
            '* MarktSelect Key'
        ];
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.showHeader = true;
        this.showErrorHeader = true;
        this.search = new URLSearchParams();
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.maxColumn = 8;
        this.controls = [
            { name: 'cbCompanyName', readonly: false, disabled: false, required: false, value: '' },
            { name: 'CompanyName', readonly: false, disabled: false, required: false, value: '' },
            { name: 'cbPOBoxAddress', readonly: false, disabled: false, required: true, value: '' },
            { name: 'POBoxNumber', readonly: false, disabled: false, required: false, value: '' },
            { name: 'POBoxTown', readonly: false, disabled: false, required: false, value: '' },
            { name: 'POBoxPostcode', readonly: false, disabled: false, required: false, value: '' },
            { name: 'cbStreetAddress', readonly: false, disabled: false, required: false, value: '' },
            { name: 'StreetName', readonly: false, disabled: false, required: false, value: '' },
            { name: 'HouseNumber', readonly: false, disabled: false, required: false, value: '' },
            { name: 'HouseNumberExt', readonly: false, disabled: false, required: false, value: '' },
            { name: 'Town', readonly: false, disabled: false, required: false, value: '' },
            { name: 'Postcode', readonly: false, disabled: false, required: false, value: '' },
            { name: 'cbCountryCode', readonly: false, disabled: false, required: false, value: '' },
            { name: 'CountryCode', readonly: false, disabled: false, required: false, value: '' },
            { name: 'cbTelephone', readonly: false, disabled: false, required: false, value: '' },
            { name: 'Telephone', readonly: false, disabled: false, required: false, value: '' },
            { name: 'cbFax', readonly: false, disabled: false, required: false, value: '' },
            { name: 'Fax', readonly: false, disabled: false, required: false, value: '' },
            { name: 'cbMarktSelectKey', readonly: false, disabled: false, required: false, value: '' },
            { name: 'MarktSelectKey', readonly: false, disabled: false, required: false, value: '' },
            { name: 'cbCoCNumber', readonly: false, disabled: false, required: false, value: '' },
            { name: 'CoCNumber', readonly: false, disabled: false, required: false, value: '' },
            { name: 'cbBICNumber', readonly: false, disabled: false, required: false, value: '' },
            { name: 'BICNumber', readonly: false, disabled: false, required: false, value: '' }
        ];
        this.pageId = PageIdentifier.ICABSMARKTSELECTSEARCH;
    }
    MarktSelectSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'MarktSelect Search';
        this.setMessageCallback(this);
        this.setErrorCallback(this);
    };
    MarktSelectSearchComponent.prototype.initData = function (params) {
        this.utils.setTitle(this.pageTitle);
        this.pageParams.strAddressLine1 = '';
        this.pageParams.strAddressLine2 = '';
        this.pageParams.strTown = '';
        this.pageParams.strPostcode = '';
        switch (this.parentMode) {
            case 'Premise':
                if (params['PremiseAddressLine1'])
                    this.pageParams.strAddressLine1 = params['PremiseAddressLine1'];
                if (params['PremiseAddressLine2'])
                    this.pageParams.strAddressLine2 = params['PremiseAddressLine2'];
                if (params['PremiseAddressLine4'])
                    this.pageParams.strTown = params['PremiseAddressLine4'];
                if (params['PremisePostcode'])
                    this.pageParams.strPostcode = params['PremisePostcode'];
                if (params['PremiseName'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyName', params['PremiseName']);
                if (params['PremiseContactTelephone'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Telephone', params['PremiseContactTelephone']);
                if (params['PremiseContactFax'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Fax', params['PremiseContactFax']);
                if (params['PremiseReference'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CoCNumber', params['PremiseReference']);
                if (params['PremiseRegNumber'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'MarktSelectKey', params['PremiseRegNumber']);
                if (params['CustomerTypeCode'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BICNumber', params['CustomerTypeCode']);
                break;
            case 'Contract':
                if (params['ContractAddressLine1'])
                    this.pageParams.strAddressLine1 = params['ContractAddressLine1'];
                if (params['ContractAddressLine2'])
                    this.pageParams.strAddressLine2 = params['ContractAddressLine2'];
                if (params['ContractAddressLine4'])
                    this.pageParams.strTown = params['ContractAddressLine4'];
                if (params['ContractPostcode'])
                    this.pageParams.strPostcode = params['ContractPostcode'];
                if (params['ContractName'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyName', params['ContractName']);
                if (params['ContractContactTelephone'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Telephone', params['ContractContactTelephone']);
                if (params['ContractContactFax'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Fax', params['ContractContactFax']);
                if (params['CompanyRegistrationNumber'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CoCNumber', params['CompanyRegistrationNumber']);
                if (params['ExternalReference'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'MarktSelectKey', params['ExternalReference']);
                if (params['ContractReference'])
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BICNumber', params['ContractReference']);
                break;
            default:
                break;
        }
        if (params['countryCode'] !== '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CountryCode', params['countryCode']);
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CountryCode', this.utils.getCountryCode());
        }
        this.addressSplit();
    };
    MarktSelectSearchComponent.prototype.addressSplit = function () {
        var _this = this;
        if (this.pageParams.strAddressLine1 !== '' || this.pageParams.strAddressLine2 !== '') {
            var postData = {};
            postData['AddressLine1'] = this.pageParams.strAddressLine1;
            postData['AddressLine2'] = this.pageParams.strAddressLine2;
            postData['tmpTown'] = this.pageParams.strTown;
            postData['tmpPostcode'] = this.pageParams.strPostcode;
            postData['Function'] = 'AddressSplit';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'StreetName', data.StreetName);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'HouseNumber', data.HouseNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'HouseNumberExt', data.HouseNumberExt);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Town', data.Town);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Postcode', data.Postcode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'POBoxNumber', data.POBoxNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'POBoxTown', data.POBoxTown);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'POBoxPostcode', data.POBoxPostcode);
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    MarktSelectSearchComponent.prototype.buildGrid = function () {
        if (true) {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.search.set('CompanyName', this.uiForm.controls['CompanyName'].value);
            this.search.set('Function', 'Searchcompany');
            this.search.set('Town', this.uiForm.controls['Town'].value);
            this.search.set('Postcode', this.uiForm.controls['Postcode'].value);
            this.search.set('connector.CountryCode', this.uiForm.controls['CountryCode'].value);
            this.search.set('Telephone', this.uiForm.controls['Telephone'].value);
            this.search.set('CoCNumber', this.uiForm.controls['CoCNumber'].value);
            this.search.set('StreetName', this.uiForm.controls['StreetName'].value);
            this.search.set('HouseNumber', this.uiForm.controls['HouseNumber'].value);
            this.search.set('MarktSelectKey', this.uiForm.controls['MarktSelectKey'].value);
            this.search.set('LiveMarktSelect', 'True');
            this.search.set('riGridHandle', '0');
            this.search.set('riGridMode', '0');
            this.search.set('riCacheRefresh', 'True');
            this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
            this.queryParams.search = this.search;
            this.marktSearchGrid.loadGridData(this.queryParams);
        }
    };
    MarktSelectSearchComponent.prototype.getGridInfo = function (info) {
        this.marktSearchGridPagination.totalItems = info.totalRows;
    };
    MarktSelectSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    };
    MarktSelectSearchComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.buildGrid();
    };
    MarktSelectSearchComponent.prototype.onGridRowClick = function (event) {
        var _this = this;
        if (event.cellData.text === 'Get Company Info') {
            var postData = {};
            postData['MarktSelectKey'] = event.cellData.rowID;
            postData['Function'] = 'GetCompanyInfo';
            postData['LiveMarktSelect'] = 'true';
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
                try {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'CompanyName', data.CompanyName);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'StreetName', data.StreetName);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'HouseNumber', data.HouseNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'HouseNumberExt', data.HouseNumberExt);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Town', data.Town);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Postcode', data.Postcode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'POBoxNumber', data.POBoxNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'POBoxTown', data.POBoxTown);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'POBoxPostcode', data.POBoxPostcode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Telephone', data.Telephone);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'Fax', data.Fax);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'MarktSelectKey', data.MarktSelectKey);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'CoCNumber', data.CoCNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BICNumber', data.BICNumber);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NewBICNumber', data.NewBICNumber);
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'NewBICNumber') === 'yes' && _this.parentMode === 'Premise') {
                        _this.messageModal.show({ msg: MessageConstant.Message.BICNotRegistered, title: _this.pageTitle }, false);
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'CompanyName') !== '') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'cbCompanyName', true);
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'StreetName') === '' && _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Town') === '' &&
                        _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Postcode') === '' && _this.riExchange.riInputElement.GetValue(_this.uiForm, 'POBoxNumber') !== '') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'cbPOBoxAddress', true);
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'StreetName') !== '' || _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Town') !== '' ||
                        _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Postcode') !== '') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'cbStreetAddress', true);
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'CountryCode') !== '') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'cbCountrycode', true);
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'Telephone') !== '') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'cbTelephone', true);
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'Fax') !== '') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'cbFax', true);
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'MarktSelectKey') !== '') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'cbMarktSelectKey', true);
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'CoCNumber') !== '') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'cbCoCNumber', true);
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'BICNumber') !== '') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'cbBICNumber', true);
                    }
                }
                catch (error) {
                    _this.logger.warn(error);
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    MarktSelectSearchComponent.prototype.validSearchData = function () {
        var _this = this;
        var blnReturnValue = false, mssg = '', msgArr = [];
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CountryCode') === 'NL') {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'MarktSelectKey') !== '' ||
                this.riExchange.riInputElement.GetValue(this.uiForm, 'CoCNumber') !== '' ||
                this.riExchange.riInputElement.GetValue(this.uiForm, 'Telephone') !== '' ||
                this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode') !== '' || (this.riExchange.riInputElement.GetValue(this.uiForm, 'Town') !== '' && (this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyName') !== '' || (this.riExchange.riInputElement.GetValue(this.uiForm, 'StreetName') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'HouseNumber') !== '')))) {
                blnReturnValue = true;
            }
            else {
                var _loop_1 = function(m) {
                    this_1.getTranslatedValue(m, null).subscribe(function (res) {
                        _this.zone.run(function () {
                            if (res) {
                                msgArr.push(res);
                            }
                            else {
                                msgArr.push(m);
                            }
                        });
                    });
                };
                var this_1 = this;
                for (var _i = 0, _a = this.msgArray; _i < _a.length; _i++) {
                    var m = _a[_i];
                    _loop_1(m);
                }
                this.messageModal.show({ msg: msgArr, title: this.pageTitle }, false);
            }
        }
        else {
            this.getTranslatedValue(MessageConstant.Message.CountryNLNotMatch, null).subscribe(function (res) {
                _this.zone.run(function () {
                    if (res) {
                        mssg = res;
                    }
                    else {
                        mssg = MessageConstant.Message.CountryNLNotMatch;
                    }
                });
            });
            this.messageModal.show({ msg: mssg, title: this.pageTitle }, false);
        }
        return blnReturnValue;
    };
    MarktSelectSearchComponent.prototype.cmdApplyOnclick = function () {
        var _this = this;
        var postData = {};
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbPOBoxAddress')) {
            this.search.set('POBoxNumber', this.uiForm.controls['POBoxNumber'].value);
            this.search.set('POBoxTown', this.uiForm.controls['POBoxTown'].value);
            this.search.set('POBoxNumber', this.uiForm.controls['POBoxNumber'].value);
            this.search.set('POBoxPostcode', this.uiForm.controls['POBoxPostcode'].value);
        }
        else if (this.riExchange.riInputElement.GetValue(this.uiForm, 'cbStreetAddress')) {
            this.search.set('StreetName', this.uiForm.controls['StreetName'].value);
            this.search.set('HouseNumber', this.uiForm.controls['HouseNumber'].value);
            this.search.set('POBoxNumber', this.uiForm.controls['POBoxNumber'].value);
            this.search.set('HouseNumberExt', this.uiForm.controls['HouseNumberExt'].value);
        }
        postData['Function'] = 'AddressMerge';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(function (data) {
            try {
                _this.pageParams.strAddressLine1 = data.AddressLine1;
                _this.pageParams.strAddressLine2 = data.AddressLine2;
                var returnObj = {};
                if (_this.parentMode === 'Premise') {
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbCompanyName')) {
                        _this.riExchange.setParentHTMLValue('PremiseName', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CompanyName'));
                        returnObj['PremiseName'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CompanyName');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbPOBoxAddress')) {
                        _this.riExchange.setParentHTMLValue('PremiseAddressLine1', _this.pageParams.strAddressLine1);
                        _this.riExchange.setParentHTMLValue('PremiseAddressLine2', _this.pageParams.strAddressLine2);
                        _this.riExchange.setParentHTMLValue('PremiseAddressLine4', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'POBoxTown'));
                        _this.riExchange.setParentHTMLValue('PremisePostcode', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'POBoxPostcode'));
                        returnObj['PremiseAddressLine1'] = _this.pageParams.strAddressLine1;
                        returnObj['PremiseAddressLine2'] = _this.pageParams.strAddressLine2;
                        returnObj['PremiseAddressLine4'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'POBoxTown');
                        returnObj['PremisePostcode'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'POBoxPostcode');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbStreetAddress')) {
                        _this.riExchange.setParentHTMLValue('PremiseAddressLine1', _this.pageParams.strAddressLine1);
                        _this.riExchange.setParentHTMLValue('PremiseAddressLine2', _this.pageParams.strAddressLine2);
                        _this.riExchange.setParentHTMLValue('PremiseAddressLine4', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Town'));
                        _this.riExchange.setParentHTMLValue('PremisePostcode', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Postcode'));
                        returnObj['PremiseAddressLine1'] = _this.pageParams.strAddressLine1;
                        returnObj['PremiseAddressLine2'] = _this.pageParams.strAddressLine2;
                        returnObj['PremiseAddressLine4'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Town');
                        returnObj['PremisePostcode'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Postcode');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbTelephone')) {
                        _this.riExchange.setParentHTMLValue('PremiseContactTelephone', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Telephone'));
                        returnObj['PremiseContactTelephone'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Telephone');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbFax')) {
                        _this.riExchange.setParentHTMLValue('PremiseContactFax', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Fax'));
                        returnObj['PremiseContactFax'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Fax');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbCoCNumber')) {
                        _this.riExchange.setParentHTMLValue('PremiseReference', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CoCNumber'));
                        returnObj['PremiseReference'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CoCNumber');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbMarktSelectKey')) {
                        _this.riExchange.setParentHTMLValue('PremiseRegNumber', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'MarktSelectKey'));
                        returnObj['PremiseRegNumber'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'MarktSelectKey');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbBICNumber')) {
                        _this.riExchange.setParentHTMLValue('CustomerTypeCode', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'BICNumber'));
                        returnObj['CustomerTypeCode'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'BICNumber');
                    }
                }
                else if (_this.parentMode === 'Contract') {
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbCompanyName')) {
                        _this.riExchange.setParentHTMLValue('ContractName', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CompanyName'));
                        returnObj['ContractName'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CompanyName');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbPOBoxAddress')) {
                        _this.riExchange.setParentHTMLValue('ContractAddressLine1', _this.pageParams.strAddressLine1);
                        _this.riExchange.setParentHTMLValue('ContractAddressLine2', _this.pageParams.strAddressLine2);
                        _this.riExchange.setParentHTMLValue('ContractAddressLine4', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'POBoxTown'));
                        _this.riExchange.setParentHTMLValue('ContractPostcode', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'POBoxPostcode'));
                        returnObj['ContractAddressLine1'] = _this.pageParams.strAddressLine1;
                        returnObj['ContractAddressLine2'] = _this.pageParams.strAddressLine2;
                        returnObj['ContractAddressLine4'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'POBoxTown');
                        returnObj['ContractPostcode'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'POBoxPostcode');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbStreetAddress')) {
                        _this.riExchange.setParentHTMLValue('ContractAddressLine1', _this.pageParams.strAddressLine1);
                        _this.riExchange.setParentHTMLValue('ContractAddressLine2', _this.pageParams.strAddressLine2);
                        _this.riExchange.setParentHTMLValue('ContractAddressLine4', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Town'));
                        _this.riExchange.setParentHTMLValue('ContractPostcode', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Postcode'));
                        returnObj['ContractAddressLine1'] = _this.pageParams.strAddressLine1;
                        returnObj['ContractAddressLine2'] = _this.pageParams.strAddressLine2;
                        returnObj['ContractAddressLine4'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Town');
                        returnObj['ContractPostcode'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Postcode');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbTelephone')) {
                        _this.riExchange.setParentHTMLValue('ContractContactTelephone', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Telephone'));
                        returnObj['ContractContactTelephone'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Telephone');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbFax')) {
                        _this.riExchange.setParentHTMLValue('ContractContactFax', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Fax'));
                        returnObj['ContractContactFax'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Fax');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbCoCNumber')) {
                        _this.riExchange.setParentHTMLValue('CompanyRegistrationNumber', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CoCNumber'));
                        returnObj['CompanyRegistrationNumber'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CoCNumber');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbMarktSelectKey')) {
                        _this.riExchange.setParentHTMLValue('ExternalReference', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'MarktSelectKey'));
                        returnObj['ExternalReference'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'MarktSelectKey');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbBICNumber')) {
                        _this.riExchange.setParentHTMLValue('ContractReference', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'BICNumber'));
                        returnObj['ContractReference'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'BICNumber');
                    }
                    if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'cbCountryCode')) {
                        _this.riExchange.setParentHTMLValue('CountryCode', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CountryCode'));
                        returnObj['CountryCode'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'CountryCode');
                    }
                }
                _this.emitSelectedData(returnObj);
            }
            catch (error) {
                _this.logger.warn(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    MarktSelectSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    MarktSelectSearchComponent.prototype.cbPOBoxAddressOnclick = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'cbStreetAddress', !data);
    };
    MarktSelectSearchComponent.prototype.cbStreetAddressOnclick = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'cbPOBoxAddress', !data);
    };
    MarktSelectSearchComponent.prototype.onGridRowDblClick = function (event) {
        this.onGridRowClick(event);
    };
    MarktSelectSearchComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    MarktSelectSearchComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show(data, true);
    };
    MarktSelectSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
    };
    MarktSelectSearchComponent.prototype.ngAfterViewInit = function () {
    };
    MarktSelectSearchComponent.prototype.updateView = function (params) {
        if (params['parentMode'])
            this.parentMode = params['parentMode'];
        this.initData(params);
    };
    MarktSelectSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSMarktSelectSearch.html',
                    providers: [ErrorService]
                },] },
    ];
    MarktSelectSearchComponent.ctorParameters = [
        { type: Injector, },
    ];
    MarktSelectSearchComponent.propDecorators = {
        'marktSearchGrid': [{ type: ViewChild, args: ['marktSearchGrid',] },],
        'marktSearchGridPagination': [{ type: ViewChild, args: ['marktSearchGridPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return MarktSelectSearchComponent;
}(BaseComponent));
