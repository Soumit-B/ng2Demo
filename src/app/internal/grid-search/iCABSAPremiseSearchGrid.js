import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { Utils } from '../../../shared/services/utility';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var PremiseSearchGridComponent = (function () {
    function PremiseSearchGridComponent(fb, router, route, httpService, serviceConstants, zone, global, ajaxconstant, authService, _fb, errorService, messageService, titleService, componentInteractionService, translate, localeTranslateService, store, utils) {
        var _this = this;
        this.fb = fb;
        this.router = router;
        this.route = route;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.zone = zone;
        this.global = global;
        this.ajaxconstant = ajaxconstant;
        this.authService = authService;
        this._fb = _fb;
        this.errorService = errorService;
        this.messageService = messageService;
        this.titleService = titleService;
        this.componentInteractionService = componentInteractionService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.store = store;
        this.utils = utils;
        this.maxColumn = 13;
        this.currentPage = 1;
        this.query = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.inputParams = {
            'parentMode': 'Contract',
            'pageTitle': 'Premise Search',
            'pageHeader': 'Premises Filter Options',
            'showBusinessCode': false,
            'showCountryCode': false
        };
        this.queryParams = {
            action: '2',
            operation: 'Application/iCABSAPremiseSearchGrid',
            module: 'premises',
            method: 'contract-management/grid',
            contentType: 'application/x-www-form-urlencoded',
            full: 'Full',
            sortOrder: 'Descending',
            branchNumber: ''
        };
        this.ajaxSource = new BehaviorSubject(0);
        this.statusList = [];
        this.optionsList = [];
        this.status = 'All';
        this.statusObjectList = {};
        this.options = 'Options';
        this.dt = null;
        this.showCloseButton = true;
        this.showHeader = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.isRequesting = false;
        this.showStatus = true;
        this.branchList = [];
        this.branchItemsToDisplay = ['item', 'desc'];
        this.backLinkText = '';
        this.backLinkUrl = '';
        this.showMenu = true;
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            _this.storeData = data;
            _this.contractData = data['data'];
        });
        this.querySubscription = this.route.queryParams.subscribe(function (params) {
            _this.pageQueryParams = params;
            if (params['parentMode'])
                _this.inputParams.parentMode = params['parentMode'];
            if (!(_this.contractData && !(Object.keys(_this.contractData).length === 0 && _this.contractData.constructor === Object))) {
                _this.contractData = params;
                _this.storeData['code'] = {
                    country: _this.utils.getCountryCode(),
                    business: _this.utils.getBusinessCode()
                };
            }
            if (!_this.contractData['ContractTypeCode'])
                _this.contractData['ContractTypeCode'] = params['ContractTypeCode'];
        });
    }
    PremiseSearchGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.componentInteractionService.emitMessage(false);
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data['errorMessage']) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    _this.messageModal.show({ msg: 'Record Saved Successfully', title: 'Message' }, false);
                });
            }
        });
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.localeTranslateService.setUpTranslation();
        this.premiseSearchFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: true }],
            ContractName: [{ value: '', disabled: true }],
            PremiseNumber: [{ value: '', disabled: false }],
            PremisesName: [{ value: '', disabled: false }],
            AddressLine1: [{ value: '', disabled: false }],
            PostCode: [{ value: '', disabled: false }],
            ClientReference: [{ value: '', disabled: false }],
            PositionPremiseNumber: [{ value: '', disabled: false }],
            ProductCode: [{ value: '', disabled: false }],
            ProductDesc: [{ value: '', disabled: true }],
            BranchName: [{ value: '', disabled: true }],
            BranchNumber: [{ value: '', disabled: false }],
            ServiceBranch: [{ value: '', disabled: false }],
            ShowDeletedProducts: [{ value: '', disabled: false }]
        });
        if (this.storeData) {
            this.premiseSearchFormGroup.controls['ContractNumber'].setValue(this.contractData.ContractNumber);
            this.premiseSearchFormGroup.controls['ContractName'].setValue(this.contractData.ContractName);
        }
        if (this.inputParams.parentMode.trim() === 'Contract') {
            this.inputParams.pageTitle = 'Contract Premise Search';
        }
        if (this.inputParams.parentMode.trim() === 'Inter-CompanyPortfolio' || this.inputParams.parentMode.trim() === 'GroupAccountPortfolio') {
            this.contractData['DateTo'] = this.pageQueryParams['AtDate'];
        }
        else {
            if (this.pageQueryParams['RunningReadOnly'] === 'yes') {
                this.showMenu = false;
            }
        }
        switch (this.contractData.ContractTypeCode) {
            case 'C':
                this.showStatus = true;
                break;
            default:
                this.showStatus = false;
                break;
        }
        this.productComponent = AccountSearchComponent;
        this.titleService.setTitle(this.inputParams.pageTitle);
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.statusList = [
            {
                value: 'All',
                text: 'All'
            },
            {
                value: 'L',
                text: 'Current'
            },
            {
                value: 'FL',
                text: 'Forward Current'
            },
            {
                value: 'D',
                text: 'Deleted'
            },
            {
                value: 'FD',
                text: 'Forward Deleted'
            },
            {
                value: 'PD',
                text: 'Pending Deletion'
            },
            {
                value: 'T',
                text: 'Terminated'
            },
            {
                value: 'FT',
                text: 'Forward Terminated'
            },
            {
                value: 'PT',
                text: 'Pending Termination'
            },
            {
                value: 'C',
                text: 'Cancelled'
            }
        ];
        this.optionsList = [
            {
                value: 'Options',
                text: 'Options'
            },
            {
                value: 'Add Premises',
                text: 'Add Premises'
            }
        ];
    };
    PremiseSearchGridComponent.prototype.ngOnDestroy = function () {
        this.errorSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.translateSubscription.unsubscribe();
        this.titleService.setTitle('');
    };
    PremiseSearchGridComponent.prototype.fetchBranchDetails = function () {
        var _this = this;
        this.queryParams.branchNumber = this.utils.getBranchCode();
        var userCode = this.authService.getSavedUserCode();
        var data = [{
                'table': 'Branch',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BranchNumber', 'BranchName']
            },
            {
                'table': 'UserAuthorityBranch',
                'query': { 'UserCode': userCode.UserCode, 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
            }];
        this.lookUpRecord(data, 100).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    var arr = [];
                    var none = {
                        item: 'All',
                        desc: 'All'
                    };
                    arr.push(none);
                    for (var k = 0; k < e['results'][0].length; k++) {
                        var obj = {
                            item: e['results'][0][k].BranchNumber,
                            desc: e['results'][0][k].BranchName
                        };
                        arr.push(JSON.parse(JSON.stringify(obj)));
                    }
                    _this.branchList = arr;
                }
                if (e['results'][1].length > 0 && !_this.queryParams.branchNumber) {
                    for (var i = 0; i < e['results'][1].length; i++) {
                        if (e['results'][1][i].DefaultBranchInd) {
                            _this.queryParams.branchNumber = e['results'][1][i].BranchNumber;
                        }
                    }
                }
            }
            _this.fetchGridData();
        }, function (error) {
            _this.fetchGridData();
        });
    };
    PremiseSearchGridComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    PremiseSearchGridComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    PremiseSearchGridComponent.prototype.onGridRowDblClick = function (data) {
        if (data.cellIndex === 0) {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                queryParams: {
                    parentMode: 'GridSearch',
                    PremiseNumber: data.trRowData[0].text,
                    AccountNumber: this.contractData['AccountNumber'],
                    AccountName: this.contractData['AccountName'],
                    ContractNumber: this.premiseSearchFormGroup.controls['ContractNumber'].value,
                    ContractName: this.premiseSearchFormGroup.controls['ContractName'].value,
                    contractTypeCode: this.contractData['ContractTypeCode']
                }
            });
        }
    };
    PremiseSearchGridComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Premise Search', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.titleService.setTitle(res);
                }
                else {
                    _this.titleService.setTitle(_this.inputParams.pageTitle);
                }
            });
        });
        this.getTranslatedValue('Premises Filter Options', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.inputParams.pageHeader = res;
                }
            });
        });
    };
    PremiseSearchGridComponent.prototype.fetchGridData = function () {
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set(this.serviceConstants.Action, this.queryParams.action);
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('FullAccess', this.queryParams.full);
        this.query.set('riSortOrder', this.queryParams.sortOrder);
        this.query.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.query.set('ContractNumber', this.premiseSearchFormGroup.controls['ContractNumber'].value);
        this.query.set('PremiseNumber', this.premiseSearchFormGroup.controls['PositionPremiseNumber'].value);
        this.query.set('PremiseName', this.premiseSearchFormGroup.controls['PremisesName'].value);
        this.query.set('PremiseAddress', this.premiseSearchFormGroup.controls['AddressLine1'].value);
        this.query.set('PremisePostcode', this.premiseSearchFormGroup.controls['PostCode'].value);
        this.query.set('ProductCode', this.premiseSearchFormGroup.controls['ProductCode'].value);
        this.query.set('ClientReference', this.premiseSearchFormGroup.controls['ClientReference'].value);
        this.query.set('BranchNumber', this.premiseSearchFormGroup.controls['ServiceBranch'].value);
        this.query.set('LoggedInBranch', this.queryParams.branchNumber);
        this.query.set('PortfolioStatus', this.status);
        this.query.set('DateTo', this.dtDisplay);
        if (this.premiseSearchFormGroup.controls['ShowDeletedProducts'].value === '') {
            this.premiseSearchFormGroup.controls['ShowDeletedProducts'].setValue(false);
        }
        this.query.set('FilterShowDeleted', this.premiseSearchFormGroup.controls['ShowDeletedProducts'].value);
        this.queryParams.search = this.query;
        this.premiseGrid.loadGridData(this.queryParams);
    };
    PremiseSearchGridComponent.prototype.ngAfterViewInit = function () {
        this.fetchBranchDetails();
    };
    PremiseSearchGridComponent.prototype.onProductBlur = function (event) {
        var _this = this;
        if (this.premiseSearchFormGroup.controls['ProductCode'].value && this.premiseSearchFormGroup.controls['ProductCode'].value !== '') {
            var productData = [{
                    'table': 'Product',
                    'query': { 'ProductCode': this.premiseSearchFormGroup.controls['ProductCode'].value, 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['BusinessCode', 'ProductDesc']
                }];
            this.lookUpRecord(productData, 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.premiseSearchFormGroup.controls['ProductDesc'].setValue(e['results'][0][0].ProductDesc);
                }
                else {
                    _this.premiseSearchFormGroup.controls['ProductDesc'].setValue('');
                }
            }, function (error) {
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                _this.premiseSearchFormGroup.controls['ProductDesc'].setValue('');
            });
        }
        else {
            this.premiseSearchFormGroup.controls['ProductDesc'].setValue('');
        }
    };
    PremiseSearchGridComponent.prototype.gridInfo = function (value) {
        if (value && value.totalPages) {
            this.gridTotalItems = parseInt(value.totalPages, 10) * this.itemsPerPage;
        }
        else {
            this.gridTotalItems = 0;
        }
    };
    PremiseSearchGridComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.fetchGridData();
    };
    PremiseSearchGridComponent.prototype.statusChange = function (data) {
    };
    PremiseSearchGridComponent.prototype.optionsChange = function (data) {
        if (this.options === 'Add Premises') {
            this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                queryParams: {
                    parentMode: 'GridSearchAdd',
                    AccountNumber: this.contractData['AccountNumber'],
                    AccountName: this.contractData['AccountName'],
                    ContractNumber: this.premiseSearchFormGroup.controls['ContractNumber'].value,
                    ContractName: this.premiseSearchFormGroup.controls['ContractName'].value
                }
            });
        }
    };
    PremiseSearchGridComponent.prototype.onRefresh = function () {
        this.currentPage = 1;
        this.fetchGridData();
    };
    PremiseSearchGridComponent.prototype.onPremiseDataReceived = function (data, route) {
        this.premiseData = data;
        this.premiseSearchFormGroup.controls['PremisesName'].setValue(data.PremiseDesc);
    };
    PremiseSearchGridComponent.prototype.onProductDataReceived = function (data, route) {
        this.productData = data;
        this.premiseSearchFormGroup.controls['ProductCode'].setValue(data.ProductCode);
        this.premiseSearchFormGroup.controls['ProductDesc'].setValue(data.ProductDesc);
    };
    PremiseSearchGridComponent.prototype.onBranchSelected = function (event) {
        if (event.value && event.value.item && event.value.item !== 'All') {
            this.premiseSearchFormGroup.controls['ServiceBranch'].setValue(event.value.item);
        }
        else {
            this.premiseSearchFormGroup.controls['ServiceBranch'].setValue('');
        }
    };
    PremiseSearchGridComponent.prototype.isNumber = function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };
    PremiseSearchGridComponent.prototype.toUpperCase = function (event) {
        var target = event.target.getAttribute('formControlName');
        var elementValue = event.target.value;
        this.premiseSearchFormGroup.controls[target].setValue(elementValue.toUpperCase());
    };
    PremiseSearchGridComponent.prototype.dateSelectedValue = function (value) {
        if (value && value.value)
            this.dtDisplay = value.value;
    };
    PremiseSearchGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPremiseSearchGrid.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    PremiseSearchGridComponent.ctorParameters = [
        { type: FormBuilder, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: NgZone, },
        { type: GlobalConstant, },
        { type: AjaxObservableConstant, },
        { type: AuthService, },
        { type: FormBuilder, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: Title, },
        { type: ComponentInteractionService, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: Store, },
        { type: Utils, },
    ];
    PremiseSearchGridComponent.propDecorators = {
        'container': [{ type: ViewChild, args: ['topContainer',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'premiseGrid': [{ type: ViewChild, args: ['premiseGrid',] },],
    };
    return PremiseSearchGridComponent;
}());
