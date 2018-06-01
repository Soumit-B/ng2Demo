import { Utils } from './../../../shared/services/utility';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Location } from '@angular/common';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { GlobalConstant } from './../../../shared/constants/global.constant';
export var SCMProspectConvGridComponent = (function () {
    function SCMProspectConvGridComponent(activatedRoute, serviceConstants, store, router, translateService, utils, translate, location) {
        var _this = this;
        this.activatedRoute = activatedRoute;
        this.serviceConstants = serviceConstants;
        this.store = store;
        this.router = router;
        this.translateService = translateService;
        this.utils = utils;
        this.translate = translate;
        this.location = location;
        this.method = 'prospect-to-contract/maintenance';
        this.module = 'prospect';
        this.operation = 'ContactManagement/iCABSCMProspectConvGrid';
        this.search = new URLSearchParams();
        this.displayContract = true;
        this.displayProspect = true;
        this.inputParams = {
            'parentMode': '',
            'businessCode': 'K',
            'countryCode': 'UK'
        };
        this.backLinkText = '';
        this.contractNumber = '';
        this.prospectNumber = '';
        this.accountNumber = '';
        this.currentContractTypeLabel = '';
        this.labelContractNumber = 'Contract Number';
        this.labelProspectNumber = 'Prospect Number';
        this.currentContractTypeURLParameter = '<contract>';
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.page = 1;
        this.totalItems = 1;
        this.maxColumn = 7;
        this.subscription = activatedRoute.queryParams.subscribe(function (param) {
            _this.inputParams.parentMode = param['parentMode'];
            _this.currentContractTypeURLParameter = param['currentContractTypeURLParameter'];
        });
        if (this.inputParams.parentMode && this.inputParams.parentMode !== 'Prospect') {
            this.storeSubscription = store.select('contract').subscribe(function (data) {
                console.log('STORE  === ', data);
                if (data !== null && data['data'] &&
                    !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                    _this.storeData = data['data'];
                    _this.codeData = data['code'];
                }
            });
        }
        else {
            this.storeSubscription = store.select('prospect').subscribe(function (data) {
                if (data !== null && data['data'] &&
                    !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                    _this.storeData = data['data'];
                    _this.codeData = data['code'];
                }
            });
        }
    }
    SCMProspectConvGridComponent.prototype.ngOnInit = function () {
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.translateService.setUpTranslation();
        this.tableTitle = 'Prospect Conversion Grid';
        var params = this.inputParams;
        this.inputParams.businessCode = this.codeData.business;
        this.inputParams.countryCode = this.codeData.country;
        var backText = '';
        this.getTranslatedValue('Contract Maintenance', null).subscribe(function (res) {
            if (res) {
                backText = res;
            }
            else {
                backText = 'Contract Maintenance';
            }
        });
        this.initPage();
        this.loadGridData();
    };
    SCMProspectConvGridComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
        this.storeSubscription.unsubscribe();
    };
    SCMProspectConvGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
        this.currentPage = currentPage;
        this.loadGridData();
    };
    SCMProspectConvGridComponent.prototype.getGridInfo = function (info) {
        this.totalItems = info.totalRows;
        this.apiContractPagination.totalItems = info.totalRows;
    };
    SCMProspectConvGridComponent.prototype.getRefreshData = function () {
        this.currentPage = 1;
        this.page = 1;
        this.loadGridData();
    };
    SCMProspectConvGridComponent.prototype.loadGridData = function () {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        if (this.inputParams.businessCode) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('AccountNumber', this.accountNumber);
        this.search.set('ContractNumber', this.contractNumber);
        this.search.set('ProspectNumber', this.prospectNumber);
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '68368');
        this.search.set('Mode', this.inputParams.parentMode);
        this.inputParams.search = this.search;
        this.apiContractGrid.loadGridData(this.inputParams);
    };
    SCMProspectConvGridComponent.prototype.initPage = function () {
        this.setCurrentContractType();
        if (this.inputParams.parentMode !== 'Prospect') {
            this.tableTitle = this.currentContractTypeLabel + ' Prospect Conversion';
            this.labelContractNumber = this.currentContractTypeLabel + ' Number';
            this.displayProspect = false;
            this.displayContract = true;
        }
        else {
            this.tableTitle = 'Prospect Conversion';
            this.displayContract = false;
            this.displayProspect = true;
        }
        var strInpTitle;
        var strDocTitle;
        strInpTitle = '^1^ Number';
        strDocTitle = '^1^ Prospect Conversion';
        if (this.inputParams.parentMode !== 'Prospect') {
            strInpTitle = strInpTitle.replace('^1^', this.currentContractTypeLabel);
            strDocTitle = strDocTitle.replace('^1^', this.currentContractTypeLabel);
        }
        else {
            strInpTitle = strInpTitle.replace('^1^', 'Prospect');
        }
        this.labelContractNumber = strInpTitle;
        this.tableTitle = strDocTitle;
        if (this.inputParams.parentMode !== 'Prospect') {
            this.contractNumber = this.getParentHTMLInputValue('ContractNumber');
            this.contractName = this.getParentHTMLInputValue('ContractName');
        }
        else {
            this.prospectNumber = this.getParentHTMLInputValue('ProspectNumber');
        }
    };
    SCMProspectConvGridComponent.prototype.addData = function () {
        this.inputParams.parentMode = 'Add';
        alert('redirect to iCABSCMProspectConversionMaintenance');
    };
    SCMProspectConvGridComponent.prototype.gridBodyRowClick = function (event) {
        if (event.name === 'ProspectNumber') {
            this.inputParams.parentMode = 'Update';
            alert('redirect to iCABSCMProspectConversionMaintenance');
        }
    };
    SCMProspectConvGridComponent.prototype.getParentHTMLInputValue = function (key) {
        var outputvalue;
        if (key === 'ContractNumber') {
            outputvalue = this.storeData['ContractNumber'];
            this.accountNumber = this.storeData['AccountNumber'];
        }
        else if (key === 'ContractName') {
            outputvalue = this.storeData['ContractName'];
        }
        else if (key === 'ProspectNumber') {
            outputvalue = this.storeData.ProspectNumber;
        }
        return outputvalue;
    };
    SCMProspectConvGridComponent.prototype.setCurrentContractType = function () {
        this.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.utils.getCurrentContractType(this.currentContractTypeURLParameter));
    };
    SCMProspectConvGridComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    SCMProspectConvGridComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    SCMProspectConvGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-scm-prospect-contract-grid',
                    templateUrl: 'iCABSCMProspectConvGrid.html'
                },] },
    ];
    SCMProspectConvGridComponent.ctorParameters = [
        { type: ActivatedRoute, },
        { type: ServiceConstants, },
        { type: Store, },
        { type: Router, },
        { type: LocaleTranslationService, },
        { type: Utils, },
        { type: TranslateService, },
        { type: Location, },
    ];
    SCMProspectConvGridComponent.propDecorators = {
        'apiContractGrid': [{ type: ViewChild, args: ['apiProspectGrid',] },],
        'apiContractPagination': [{ type: ViewChild, args: ['apiProspectPagination',] },],
    };
    return SCMProspectConvGridComponent;
}());
