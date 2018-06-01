import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { TranslateService } from 'ng2-translate';
import { URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'ng2-webstorage';
import { Utils } from './../../../shared/services/utility';
import { Logger } from '@nsalaun/ng2-logger';
export var PostCodeSearchComponent = (function () {
    function PostCodeSearchComponent(serviceConstants, ellipsis, _formBuilder, translate, ls, localeTranslateService, utils, logger) {
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this._formBuilder = _formBuilder;
        this.translate = translate;
        this.ls = ls;
        this.localeTranslateService = localeTranslateService;
        this.utils = utils;
        this.logger = logger;
        this.isRequesting = false;
        this.optionList = [
            { title: 'All Branches', value: 'All' },
            { title: 'Service Branch', value: 'Service' }
        ];
        this.method = 'contract-management/search';
        this.module = 'contract-admin';
        this.operation = 'Business/iCABSBPostcodeSearch';
        this.BranchNumberSearchValue = {};
        this.searchValue = {
            'ServiceBranchNumber': '',
            'Postcode': '',
            'State': '',
            'Town': ''
        };
        this.dropdown = {
            servicebranch: {
                params: {
                    'parentMode': 'ContractSearchLookUp'
                },
                active: {
                    id: '',
                    text: ''
                },
                disabled: false,
                required: true,
                isError: true
            }
        };
        this.columns = [
            { title: ' Post Code', name: 'Postcode', sort: '' },
            { title: 'Service Branch', name: 'ServiceBranchNumber' },
            { title: 'State', name: 'State' },
            { title: 'Town', name: 'Town' }
        ];
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 11;
        this.paginationStyle = { align: 'text-right' };
    }
    PostCodeSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isRequesting = true;
        this.zipForm = this._formBuilder.group({
            lstBranchSelection: [''],
            BranchNumberSearchValue: [{ value: '8' }],
            PostcodeSearchValue: [''],
            StateSearchValue: [''],
            TownSearchValue: ['']
        });
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.localeTranslateService.setUpTranslation();
    };
    PostCodeSearchComponent.prototype.ngAfterContentInit = function () {
        this.isRequesting = false;
    };
    PostCodeSearchComponent.prototype.ngOnChanges = function (data) {
        if (data.inputParams) {
            this.populateSearchFields();
        }
    };
    PostCodeSearchComponent.prototype.ngOnDestroy = function () {
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    };
    PostCodeSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    PostCodeSearchComponent.prototype.onlstBranchSelection = function (event) {
        if (event === 'Service') {
            this.BranchNumberSearchValueVisible = true;
            this.BranchNumberSearchValue.ServiceBranchNumber = this.utils.getBranchCode();
            this.dropdown.servicebranch.active = {
                id: this.utils.getBranchCode(),
                text: this.utils.getBranchText()
            };
            this.dropdown.servicebranch.active.text = this.utils.getBranchText();
        }
        else {
            this.BranchNumberSearchValueVisible = false;
            this.dropdown.servicebranch.active = {
                id: '',
                text: ''
            };
        }
    };
    PostCodeSearchComponent.prototype.servicebranchOnchange = function (obj) {
        if (obj) {
            if (obj.BranchNumber) {
                this.BranchNumberSearchValue.ServiceBranchNumber = obj.BranchNumber;
            }
            if (obj.BranchName) {
                this.BranchNumberSearchValue.ServiceBranchName = obj.BranchName;
            }
        }
    };
    PostCodeSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        switch (this.inputParams.parentMode) {
            case 'LookUp':
            case 'LookUp-Service':
            case 'Search':
                returnObj = {
                    'Postcode': event.row.Postcode,
                    'Town': (event.row.Town) ? event.row.Town : '',
                    'State': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'CTDExclusion':
                returnObj = {
                    'Postcode': event.row.Postcode,
                    'ExcludeTown': (event.row.Town) ? event.row.Town : '',
                    'ExcludeState': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'ContactCentreNewContact':
                returnObj = {
                    'CallContactPostcode': event.row.Postcode,
                    'CallAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'CallAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Premise':
                returnObj = {
                    'PremisePostcode': event.row.Postcode,
                    'PremiseAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'PremiseAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Prospect':
                returnObj = {
                    'Postcode': event.row.Postcode,
                    'AddressLine4': (event.row.Town) ? event.row.Town : '',
                    'AddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'PremiseProspect':
                returnObj = {
                    'PremisePostcode': event.row.Postcode,
                    'PremiseAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'PremiseAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'FixedPriceJob':
                returnObj = {
                    'JobPremisePostcode': event.row.Postcode,
                    'JobPremiseAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'JobPremiseAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Account':
                returnObj = {
                    'AccountPostcode': event.row.Postcode,
                    'AccountAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'AccountAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Invoice':
                returnObj = {
                    'InvoicePostcode': event.row.Postcode,
                    'InvoiceAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'InvoiceAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Statement':
                returnObj = {
                    'StatementPostcode': event.row.Postcode,
                    'StatementAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'StatementAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            case 'Contract':
                returnObj = {
                    'ContractPostcode': event.row.Postcode,
                    'ContractAddressLine4': (event.row.Town) ? event.row.Town : '',
                    'ContractAddressLine5': (event.row.State) ? event.row.State : ''
                };
                break;
            default:
                returnObj = {
                    'Postcode': event.row.Postcode,
                    'Object': event.row
                };
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    PostCodeSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.showAddNew = this.inputParams.showAddNew;
        this.populateSearchFields();
        this.loadData();
    };
    PostCodeSearchComponent.prototype.populateSearchFields = function () {
        switch (this.inputParams.parentMode) {
            case 'LookUp':
            case 'LookUp-Service':
            case 'Search':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.PostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.State);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.Town);
                break;
            case 'Prospect':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.PostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.AddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.AddressLine4);
                break;
            case 'PremiseProspect':
            case 'Premise':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.PremisePostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.PremiseAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.PremiseAddressLine4);
                break;
            case 'FixedPriceJob':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.JobPremisePostcode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.JobPremiseAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.JobPremiseAddressLine4);
                break;
            case 'Account':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.AccountPostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.AccountAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.AccountAddressLine4);
                break;
            case 'Invoice':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.InvoicePostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.InvoiceAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.InvoiceAddressLine4);
                break;
            case 'Statement':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.StatementPostcode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.StatementAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.StatementAddressLine4);
                break;
            case 'Contract':
            case 'ContactCentreNewContact':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.ContractPostcode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.ContractAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.ContractAddressLine4);
                break;
            case 'CTDExclusion':
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.Postcode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.ExcludeAddressLine5);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.ExcludeAddressLine4);
                break;
            default:
                this.zipForm.controls['PostcodeSearchValue'].setValue(this.inputParams.PostCode);
                this.zipForm.controls['StateSearchValue'].setValue(this.inputParams.State);
                this.zipForm.controls['TownSearchValue'].setValue(this.inputParams.Town);
        }
        if (this.inputParams.parentMode === 'LookUp-Service') {
            this.lstBranchSelectionValueVisible = true;
            this.BranchNumberSearchValueVisible = true;
            this.zipForm.controls['lstBranchSelection'].setValue('Service');
            this.BranchNumberSearchValue.ServiceBranchNumber = this.utils.getBranchCode();
            this.dropdown.servicebranch.active = {
                id: this.utils.getBranchCode(),
                text: this.utils.getBranchText()
            };
        }
        else {
            this.lstBranchSelectionValueVisible = false;
            this.BranchNumberSearchValueVisible = false;
        }
    };
    PostCodeSearchComponent.prototype.getFormData = function (value, valid) {
        switch (this.inputParams.parentMode) {
            case 'LookUp-Service':
                if (value.BranchNumberSearchValue)
                    this.searchValue['ServiceBranchNumber'] = value.BranchNumberSearchValue;
                else
                    this.searchValue['ServiceBranchNumber'] = '';
                break;
            default:
                if (value.PostcodeSearchValue)
                    this.searchValue['Postcode'] = value.PostcodeSearchValue;
                else
                    this.searchValue['Postcode'] = '';
                if (value.StateSearchValue)
                    this.searchValue['State'] = value.StateSearchValue;
                else
                    this.searchValue['State'] = '';
                if (value.TownSearchValue)
                    this.searchValue['Town'] = value.TownSearchValue;
                else
                    this.searchValue['Town'] = '';
        }
        this.loadData();
    };
    PostCodeSearchComponent.prototype.refresh = function () {
        this.loadData();
    };
    PostCodeSearchComponent.prototype.getSearchParams = function () {
        var sortBy = '';
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.BranchNumberSearchValueVisible) {
            this.search.set('ServiceBranchNumber', this.BranchNumberSearchValue.ServiceBranchNumber ? this.BranchNumberSearchValue.ServiceBranchNumber : this.utils.getBranchCode());
        }
        if (this.zipForm.controls['PostcodeSearchValue']) {
            this.search.set('search.op.Postcode', 'GE');
            this.search.set('Postcode', this.zipForm.controls['PostcodeSearchValue'].value);
        }
        else {
            this.search.set('Postcode', '');
        }
        if (this.zipForm.controls['StateSearchValue']) {
            this.search.set('search.op.State', 'GE');
            this.search.set('State', this.zipForm.controls['StateSearchValue'].value);
            if (!sortBy && this.zipForm.controls['StateSearchValue'].value) {
                sortBy = 'State';
            }
        }
        if (this.zipForm.controls['TownSearchValue']) {
            this.search.set('search.op.Town', 'GE');
            this.search.set('Town', this.zipForm.controls['TownSearchValue'].value);
            if (!sortBy && this.zipForm.controls['TownSearchValue'].value) {
                sortBy = 'Town';
            }
        }
        if (this.zipForm.controls['PostcodeSearchValue'].value) {
            sortBy = 'Postcode';
        }
        this.search.set('search.sortby', sortBy || 'Postcode');
    };
    PostCodeSearchComponent.prototype.loadData = function () {
        this.getSearchParams();
        this.inputParams.search = this.search;
        this.postcodeTable.loadTableData(this.inputParams);
    };
    PostCodeSearchComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        var _loop_1 = function(i) {
            this_1.localeTranslateService.getTranslatedValue(this_1.columns[i].title, null).subscribe(function (res) {
                if (res) {
                    _this.columns[i].title = res;
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.columns.length; i++) {
            _loop_1(i);
        }
    };
    PostCodeSearchComponent.prototype.onAddNew = function () {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    };
    PostCodeSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBPostcodeSearch.html'
                },] },
    ];
    PostCodeSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: FormBuilder, },
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: LocaleTranslationService, },
        { type: Utils, },
        { type: Logger, },
    ];
    PostCodeSearchComponent.propDecorators = {
        'postcodeTable': [{ type: ViewChild, args: ['postcodeTable',] },],
        'BranchNumberSearch': [{ type: ViewChild, args: ['BranchNumberSearchValue',] },],
        'showAddNew': [{ type: Input },],
    };
    return PostCodeSearchComponent;
}());
