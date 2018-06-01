import { GroupAccountNumberComponent } from './../search/iCABSSGroupAccountNumberSearch';
import { AccountSearchComponent } from './../search/iCABSASAccountSearch';
import { ContractActionTypes } from './../../actions/contract';
import { URLSearchParams } from '@angular/http';
import { Location } from '@angular/common';
import { Component, ViewChild, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { Logger } from '@nsalaun/ng2-logger';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { Utils } from '../../../shared/services/utility';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { MessageService } from '../../../shared/services/message.service';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
export var InfestationToleranceGridComponent = (function () {
    function InfestationToleranceGridComponent(utils, httpService, serviceConstants, zone, global, ajaxconstant, authService, formBuilder, logger, errorService, messageService, titleService, componentInteractionService, translate, localeTranslateService, store, sysCharConstants, router, route, location) {
        this.utils = utils;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.zone = zone;
        this.global = global;
        this.ajaxconstant = ajaxconstant;
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.logger = logger;
        this.errorService = errorService;
        this.messageService = messageService;
        this.titleService = titleService;
        this.componentInteractionService = componentInteractionService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.store = store;
        this.sysCharConstants = sysCharConstants;
        this.router = router;
        this.route = route;
        this.location = location;
        this.ProductCodegetAttributeServiceCoverRowID = '';
        this.ProductCodesetAttributeServiceCoverRowID = '';
        this.CurrentServiceCoverRowIDdata = '';
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.ajaxSource = new BehaviorSubject(0);
        this.showErrorHeader = true;
        this.isRequesting = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: false
        };
        this.contractStoreData = {};
        this.search = new URLSearchParams();
        this.searchGet = new URLSearchParams();
        this.defaultOpt = {
            text: 'Options',
            value: ''
        };
        this.MenuOptionList = [
            {
                text: 'Add Infestation SLA',
                value: 'AddInfestationTolerance'
            }
        ];
        this.queryParams = {
            action: '2',
            operation: 'System/iCABSSInfestationToleranceGrid',
            module: 'service',
            method: 'service-delivery/maintenance'
        };
        this.inputParamsAccSearch = {
            'parentMode': 'LookUp'
        };
        this.inputParamsGrpAccNumber = {
            'parentMode': 'LookUp',
            'businessCode': this.utils.getBusinessCode(),
            'countryCode': this.utils.getCountryCode(),
            'Action': '2'
        };
        this.CurrentColumnName = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.contractSearchComponent = ContractSearchComponent;
        this.premiseComponent = ContractSearchComponent;
        this.productComponent = ContractSearchComponent;
        this.dynamicComponent1 = AccountSearchComponent;
        this.groupAccNum = GroupAccountNumberComponent;
        this.pageTitle = 'Infestation SLA Maintenance';
    }
    InfestationToleranceGridComponent.prototype.onContractDataReceived = function (data, route) {
        this.searchInfestFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.searchInfestFormGroup.controls['ContractName'].setValue(data.ContractName);
    };
    InfestationToleranceGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
        this.componentInteractionService.emitMessage(false);
        this.fromParent = {
            CurrentContractTypeURLParameter: this.routeParams.CurrentContractTypeURLParameter,
            GroupAccountNumber: this.routeParams.GroupAccountNumber,
            GroupName: this.routeParams.GroupName,
            AccountNumber: this.routeParams.AccountNumber,
            AccountName: this.routeParams.AccountName,
            ContractNumber: this.routeParams.ContractNumber,
            ContractName: this.routeParams.ContractName,
            PremiseNumber: this.routeParams.PremiseNumber,
            PremiseName: this.routeParams.PremiseName,
            ProductCode: this.routeParams.ProductCode,
            ProductDesc: this.routeParams.ProductDesc,
            CurrentServiceCoverRowID: this.routeParams.CurrentServiceCoverRowID,
            parentMode: this.routeParams.parentMode
        };
        this.inputParams = {
            'module': this.queryParams.module,
            'method': this.queryParams.method,
            'operation': this.queryParams.operation,
            'riGridMode': '0',
            'riCacheRefresh': 'True',
            'sortOrder': 'Descending',
            'CurrentColumnName': '',
            'FileUploaded': ''
        };
        this.inputParamsContract = {
            'parentMode': 'LookUp-All',
            'CurrentContractTypeURLParameter': this.fromParent.CurrentContractTypeURLParameter
        };
        this.inputParamsPremise = {
            'parentMode': 'LookUp',
            'CurrentContractTypeURLParameter': this.fromParent.CurrentContractTypeURLParameter
        };
        this.inputParamsProduct = {
            'parentMode': 'LookUp',
            'CurrentContractTypeURLParameter': this.fromParent.CurrentContractTypeURLParameter
        };
        this.store.dispatch({
            type: ContractActionTypes.DATA_FROM_PARENT, payload: {
                fromParent: {
                    CurrentContractTypeURLParameter: this.fromParent.CurrentContractTypeURLParameter,
                    GroupAccountNumber: this.fromParent['GroupAccountNumber'],
                    GroupName: this.fromParent['GroupName'],
                    AccountNumber: this.fromParent['AccountNumber'],
                    AccountName: this.fromParent['AccountName'],
                    ContractNumber: this.fromParent['ContractNumber'],
                    ContractName: this.fromParent['ContractName'],
                    PremiseNumber: this.fromParent['PremiseNumber'],
                    PremiseName: this.fromParent['PremiseName'],
                    ProductCode: this.fromParent['ProductCode'],
                    ProductDesc: this.fromParent['ProductDesc'],
                    CurrentServiceCoverRowID: this.fromParent['CurrentServiceCoverRowID'],
                    parentMode: this.fromParent['parentMode']
                }
            }
        });
        this.storeSubscription = this.store.select('contract').subscribe(function (data) {
            _this.contractStoreData = data;
            if (data !== null && data['fromParent'] && !(Object.keys(data['fromParent']).length === 0 && data['fromParent'].constructor === Object)) {
                _this.infestationStoreData = data['fromParent'];
                _this.createParent(data);
                _this.buildGrid();
            }
        });
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.maxColumn = 18;
        this.localeTranslateService.setUpTranslation();
        this.CurrentContractType = this.utils.getCurrentContractType(this.fromParent.CurrentContractTypeURLParameter);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType);
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data.errorMessage) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.populateDescriptions();
        this.buildGrid();
    };
    InfestationToleranceGridComponent.prototype.ngAfterViewInit = function () {
        document.querySelector('.option-dropdown icabs-dropdown-static select option:last-child').setAttribute('disabled', 'disabled');
    };
    InfestationToleranceGridComponent.prototype.ngOnDestroy = function () {
        if (this.componentInteractionSubscription)
            this.componentInteractionSubscription.unsubscribe();
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.routerSubscription)
            this.routerSubscription.unsubscribe();
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    };
    InfestationToleranceGridComponent.prototype.onBuildMenuOptionChange = function (event) {
        if (this.BuildMenuOptions.selectedItem && this.BuildMenuOptions.selectedItem === 'AddInfestationTolerance') {
            this.router.navigate(['System/iCABSSInfestationToleranceMaintenance.htm'], { queryParams: [{ riExchangeMode: 'InfestationToleranceAdd' }] });
        }
    };
    InfestationToleranceGridComponent.prototype.populateDescriptions = function () {
        var _this = this;
        this.searchGet = new URLSearchParams();
        this.searchGet.set(this.serviceConstants.Action, '0');
        this.searchGet.set(this.serviceConstants.BusinessCode, this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode());
        this.searchGet.set(this.serviceConstants.CountryCode, this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : this.utils.getCountryCode());
        this.searchGet.set('Function', 'PopulateDescriptions');
        this.searchGet.set('GroupAccountNumber', this.searchInfestFormGroup.controls['GroupAccountNumber'].value);
        this.searchGet.set('AccountNumber', this.searchInfestFormGroup.controls['AccountNumber'].value);
        this.searchGet.set('ContractNumber', this.searchInfestFormGroup.controls['ContractNumber'].value);
        this.searchGet.set('PremiseNumber', this.searchInfestFormGroup.controls['PremiseNumber'].value);
        this.searchGet.set('ServiceCoverRowID', this.searchInfestFormGroup.controls['ServiceCoverRowID'].value);
        this.searchGet.set('ProductCode', this.searchInfestFormGroup.controls['ProductCode'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchGet)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
                _this.searchInfestFormGroup.controls['ContractNumber'].setValue('');
                _this.searchInfestFormGroup.controls['PremiseNumber'].setValue('');
                _this.searchInfestFormGroup.controls['ProductCode'].setValue('');
                _this.searchInfestFormGroup.controls['ServiceCoverNumber'].setValue('');
                _this.searchInfestFormGroup.controls['AccountName'].setValue('');
                _this.searchInfestFormGroup.controls['GroupName'].setValue('');
                _this.searchInfestFormGroup.controls['GroupAccountNumber'].setValue('');
            }
            else {
                _this.searchInfestFormGroup.controls['ContractNumber'].setValue(e.ContractNumber);
                _this.searchInfestFormGroup.controls['ContractName'].setValue(e.ContractName);
                _this.searchInfestFormGroup.controls['PremiseNumber'].setValue(e.PremiseNumber);
                _this.searchInfestFormGroup.controls['PremiseName'].setValue(e.PremiseName);
                _this.searchInfestFormGroup.controls['ProductCode'].setValue(e.ProductCode);
                _this.searchInfestFormGroup.controls['ProductDesc'].setValue(e.ProductDesc);
                _this.searchInfestFormGroup.controls['AccountNumber'].setValue(e.AccountNumber);
                _this.searchInfestFormGroup.controls['AccountName'].setValue(e.AccountName);
                _this.searchInfestFormGroup.controls['GroupAccountNumber'].setValue(e.GroupAccountNumber);
                _this.searchInfestFormGroup.controls['GroupName'].setValue(e.GroupName);
                _this.searchInfestFormGroup.controls['ServiceCoverNumber'].setValue(e.ServiceCoverNumber);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        this.buildGrid();
    };
    InfestationToleranceGridComponent.prototype.createParent = function (data) {
        var _this = this;
        this.pageparentmode = data.fromParent.fromParent['parentMode'];
        this.CurrentServiceCoverRowIDdata = data.fromParent.fromParent['CurrentServiceCoverRowID'];
        switch (this.pageparentmode) {
            case 'GroupAccountInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(function (res) { _this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    GroupAccountNumber: [{ value: data.fromParent.fromParent['GroupAccountNumber'], disabled: false }],
                    GroupName: [{ value: data.fromParent.fromParent['GroupName'], disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            case 'AccountInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(function (res) { _this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    AccountNumber: [{ value: data.fromParent.fromParent['AccountNumber'], disabled: false }],
                    AccountName: [{ value: data.fromParent.fromParent['AccountName'], disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            case 'ContractInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(function (res) { _this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            case 'PremiseInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(function (res) { _this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            case 'ServiceCoverInfestationTolerance':
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(function (res) { _this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    ContractNumber: [{ value: data.fromParent.fromParent['ContractNumber'], disabled: false }],
                    ContractName: [{ value: data.fromParent.fromParent['ContractName'], disabled: true }],
                    PremiseNumber: [{ value: data.fromParent.fromParent['PremiseNumber'], disabled: false }],
                    PremiseName: [{ value: data.fromParent.fromParent['PremiseName'], disabled: true }],
                    ProductCode: [{ value: data.fromParent.fromParent['ProductCode'], disabled: false }],
                    ProductDesc: [{ value: data.fromParent.fromParent['ProductDesc'], disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
                break;
            default:
                this.searchInfestFormGroup = this.formBuilder.group({
                    BusinessCode: [{ value: this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), disabled: false }],
                    BusinessDesc: [{ value: this.utils.getBusinessDesc(this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode(), this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : '').subscribe(function (res) { _this.searchInfestFormGroup.controls['BusinessDesc'].setValue(res.BusinessDesc); }), disabled: true }],
                    ContractNumber: [{ value: '', disabled: false }],
                    ContractName: [{ value: '', disabled: true }],
                    PremiseNumber: [{ value: '', disabled: false }],
                    PremiseName: [{ value: '', disabled: true }],
                    ProductCode: [{ value: '', disabled: false }],
                    ProductDesc: [{ value: '', disabled: true }],
                    ServiceCoverRowID: [{ value: data.fromParent.fromParent['CurrentServiceCoverRowID'] }],
                    GroupAccountNumber: [{ value: '', disabled: false }],
                    GroupName: [{ value: '', disabled: true }],
                    AccountNumber: [{ value: '', disabled: false }],
                    AccountName: [{ value: '', disabled: true }],
                    ServiceCoverNumber: [{ value: '', disabled: true }]
                });
        }
    };
    InfestationToleranceGridComponent.prototype.contractNumberFormatOnChange = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    InfestationToleranceGridComponent.prototype.onBlurContract = function (event) {
        var elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            var paddedValue = this.contractNumberFormatOnChange(elementValue, 8);
            if (event.target.id === 'ContractNumber') {
                this.searchInfestFormGroup.controls['ContractNumber'].setValue(paddedValue);
            }
        }
        this.populateDescriptions();
    };
    InfestationToleranceGridComponent.prototype.onPremiseChanged = function (data, route) {
        this.searchInfestFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.searchInfestFormGroup.controls['PremiseName'].setValue(data.PremiseName);
        this.populateDescriptions();
    };
    InfestationToleranceGridComponent.prototype.onProductChanged = function (data, route) {
        this.searchInfestFormGroup.controls['ProductCode'].setValue(data.ProductCode);
        this.searchInfestFormGroup.controls['ProductDesc'].setValue(data.ProductDesc);
        this.populateDescriptions();
    };
    InfestationToleranceGridComponent.prototype.setAccountNumber = function (data) {
        if (data) {
            this.searchInfestFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
            this.searchInfestFormGroup.controls['AccountName'].setValue(data.AccountName);
            this.accnoFocus.nativeElement.focus();
        }
    };
    InfestationToleranceGridComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    InfestationToleranceGridComponent.prototype.onGroupAccount = function (data) {
        if (data.GroupName) {
            this.searchInfestFormGroup.controls['GroupAccountNumber'].setValue(data.GroupAccountNumber);
            this.searchInfestFormGroup.controls['GroupName'].setValue(data.GroupName);
        }
    };
    InfestationToleranceGridComponent.prototype.onBlurPremise = function (event) {
        this.populateDescriptions();
    };
    InfestationToleranceGridComponent.prototype.onBlurProduct = function (event) {
        this.searchInfestFormGroup.controls['ServiceCoverNumber'].setValue('');
        if ((this.searchInfestFormGroup.controls['ContractNumber'].value !== '' || this.searchInfestFormGroup.controls['ContractNumber'].value !== null || this.searchInfestFormGroup.controls['ContractNumber'].value !== undefined) && (this.searchInfestFormGroup.controls['PremiseNumber'].value !== '' || this.searchInfestFormGroup.controls['PremiseNumber'].value !== null || this.searchInfestFormGroup.controls['PremiseNumber'].value !== undefined) && (this.ProductCodegetAttributeServiceCoverRowID !== '' || this.ProductCodegetAttributeServiceCoverRowID !== null || this.ProductCodegetAttributeServiceCoverRowID !== undefined)) {
            if ((this.searchInfestFormGroup.controls['ServiceCoverNumber'].value !== '' || this.searchInfestFormGroup.controls['ServiceCoverNumber'].value !== null || this.searchInfestFormGroup.controls['ServiceCoverNumber'].value !== undefined)) {
                this.inputParamsProduct = {
                    'parentMode': 'LookUp'
                };
            }
        }
        this.searchInfestFormGroup.controls['ServiceCoverRowID'].setValue(this.ProductCodegetAttributeServiceCoverRowID);
        this.ProductCodesetAttributeServiceCoverRowID = '';
        this.populateDescriptions();
    };
    InfestationToleranceGridComponent.prototype.onBlurAccountGroup = function (event) {
        this.populateDescriptions();
    };
    InfestationToleranceGridComponent.prototype.onBlurAccount = function (event) {
        var elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 9) {
            var paddedValue = this.numberPadding(elementValue, 9);
            if (event.target.id === 'AccountNumber') {
                this.searchInfestFormGroup.controls['AccountNumber'].setValue(paddedValue);
            }
        }
        this.populateDescriptions();
    };
    InfestationToleranceGridComponent.prototype.onGridRowClick = function (data) {
        if (data.rowData['Applies To'] === data.cellData.text) {
            this.CurrentColumnName = 'TolTableType';
            this.router.navigate(['System/iCABSSInfestationToleranceMaintenance.htm'], {
                queryParams: [{ riExchangeMode: 'InfestationToleranceGrid' }]
            });
        }
    };
    InfestationToleranceGridComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    InfestationToleranceGridComponent.prototype.getCurrentPage = function (data) {
        this.gridCurPage = data.value;
        this.buildGrid();
    };
    InfestationToleranceGridComponent.prototype.sortGrid = function (data) {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.buildGrid();
    };
    InfestationToleranceGridComponent.prototype.buildGrid = function () {
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.contractStoreData['code'] && this.contractStoreData['code'].business ? this.contractStoreData['code'].business : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.contractStoreData['code'] && this.contractStoreData['code'].country ? this.contractStoreData['code'].country : this.utils.getCountryCode());
        this.search.set('Level', this.pageparentmode);
        this.search.set('GroupAccountNumber', this.searchInfestFormGroup.controls['GroupAccountNumber'].value);
        this.search.set('AccountNumber', this.searchInfestFormGroup.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.searchInfestFormGroup.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.searchInfestFormGroup.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.searchInfestFormGroup.controls['ProductCode'].value);
        this.search.set('ServiceCoverNumber', this.searchInfestFormGroup.controls['ServiceCoverNumber'].value);
        this.search.set('ServiceCoverRowID', this.CurrentServiceCoverRowIDdata);
        this.search.set('HeaderClickedColumn', this.inputParams.CurrentColumnName);
        this.search.set('riSortOrder', this.inputParams.sortOrder);
        this.search.set('riGridMode', this.inputParams.riGridMode);
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('FileUploaded', '');
        this.inputParams.FileUploaded = '';
        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.inputParams.search = this.search;
        this.infestationtoleranceGrid.loadGridData(this.inputParams);
    };
    InfestationToleranceGridComponent.prototype.refresh = function () {
        this.gridCurPage = 1;
        this.buildGrid();
        this.infestationtoleranceGrid.loadGridData(this.inputParams);
    };
    InfestationToleranceGridComponent.prototype.btnImportSLA_onclick = function () {
    };
    InfestationToleranceGridComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    InfestationToleranceGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSInfestationToleranceGrid.html',
                    providers: [ErrorService, ComponentInteractionService]
                },] },
    ];
    InfestationToleranceGridComponent.ctorParameters = [
        { type: Utils, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: NgZone, },
        { type: GlobalConstant, },
        { type: AjaxObservableConstant, },
        { type: AuthService, },
        { type: FormBuilder, },
        { type: Logger, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: Title, },
        { type: ComponentInteractionService, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: Store, },
        { type: SysCharConstants, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: Location, },
    ];
    InfestationToleranceGridComponent.propDecorators = {
        'infestationtoleranceGrid': [{ type: ViewChild, args: ['infestationtoleranceGrid',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'BuildMenuOptions': [{ type: ViewChild, args: ['BuildMenuOptions',] },],
        'infestationPagination': [{ type: ViewChild, args: ['infestationPagination',] },],
        'accnoFocus': [{ type: ViewChild, args: ['accnoFocus',] },],
    };
    return InfestationToleranceGridComponent;
}());
