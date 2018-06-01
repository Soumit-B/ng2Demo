import { CBBService } from './../../../shared/services/cbb.service';
import { PremiseSearchComponent } from '../search/iCABSAPremiseSearch';
import { BehaviorSubject } from 'rxjs/Rx';
import { InvoiceGroupGridComponent } from '../grid-search/iCABSAInvoiceGroupGrid';
import { Utils } from '../../../shared/services/utility';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { PageDataService } from '../../../shared/services/page-data.service';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';
import { ErrorService } from '../../../shared/services/error.service';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { HttpService } from '../../../shared/services/http-service';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { InvoiceActionTypes } from './../../actions/invoice';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { Component, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { LocalStorageService } from 'ng2-webstorage';
import { Store } from '@ngrx/store';
import { TranslateService } from 'ng2-translate';
import { Title } from '@angular/platform-browser';
import { Logger } from '@nsalaun/ng2-logger';
export var InvoiceGroupPremiseMaintenanceComponent = (function () {
    function InvoiceGroupPremiseMaintenanceComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, storeInvoiceObj, translate, ls, http, localeTranslateService, sysCharConstants, logger, utils, activatedRoute, _router, SysCharConstants, routeAwayGlobals, cbbService) {
        var _this = this;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
        this.authService = authService;
        this.ajaxconstant = ajaxconstant;
        this.router = router;
        this.pageData = pageData;
        this.titleService = titleService;
        this.zone = zone;
        this.store = store;
        this.storeInvoiceObj = storeInvoiceObj;
        this.translate = translate;
        this.ls = ls;
        this.http = http;
        this.localeTranslateService = localeTranslateService;
        this.sysCharConstants = sysCharConstants;
        this.logger = logger;
        this.utils = utils;
        this.activatedRoute = activatedRoute;
        this._router = _router;
        this.SysCharConstants = SysCharConstants;
        this.routeAwayGlobals = routeAwayGlobals;
        this.cbbService = cbbService;
        this.queryPost = new URLSearchParams();
        this.showMessageHeaderSave = true;
        this.showPromptCloseButtonSave = true;
        this.promptTitleSave = '';
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.showErrorHeader = true;
        this.promptModalConfigSave = {
            ignoreBackdropClick: true
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.isRequesting = false;
        this.showCloseButton = true;
        this.formControl = {
            AccountNumber: '',
            AccountName: '',
            InvoiceGroupNumber: '',
            InvoiceGroupDesc: '',
            InvoiceGroupROWID: '',
            chkEntireAccount: false,
            chkSeparateInvoice: false,
            ContractNumber: '',
            ContractNumber1: '',
            ContractNumber2: '',
            PremiseNumber2: '',
            ContractNumber4: '',
            ContractNumber3: '',
            PremiseNumberStart3: '',
            PremiseNumberEnd3: '',
            PremiseRangeStart1: '',
            PremiseRangeEnd1: '',
            PremiseRangeStart2: '',
            PremiseRangeEnd2: '',
            PremiseRangeStart3: '',
            PremiseRangeEnd3: '',
            PremiseRangeStart4: '',
            PremiseRangeEnd4: '',
            parentMode: ''
        };
        this.pageLabels = {
            AreMandatoryFields: 'are mandatory fields',
            AccountNumber: 'Account Number',
            InvoiceGroupNumber: 'Invoice Group Number',
            ByAccount: 'By Account',
            ByContract: 'By Contract',
            ByPremiseRangeTab: 'By Premises Range',
            MoveAllPremisesOnAccountTo: 'Move all Premises on Account To:',
            SelectedInvoiceGroup: 'Selected Invoice Group',
            SeperateInvoiceGroup: 'Separate Invoice Groups',
            AddAllPremisesFromContract: 'Add all Premises from Contract',
            AddASinglePremiseFromContract: 'Add a single Premise from Contract',
            Premise: 'Premises',
            CreateSepInvoceGroup: 'Create Sep. Invoice Group For ALL Premises on Contract',
            AddARangeOfPremiseFromContract: 'Add a range of Premises from Contract',
            FromPremise: 'From Premises',
            ToPremise: 'To Premises',
            Save: 'Save',
            Cancel: 'Cancel',
            Options: 'Options',
            Contract: 'Contract'
        };
        this.formControlEnableFlag = {
            AccountNumber: false,
            AccountName: true,
            InvoiceGroupNumber: false,
            InvoiceGroupDesc: true,
            chkEntireAccount: false,
            chkSeparateInvoice: false,
            ContractNumber: false,
            ContractNumber1: false,
            ContractNumber2: false,
            PremiseNumber2: false,
            ContractNumber4: false,
            ContractNumber3: false,
            PremiseNumberStart3: false,
            PremiseNumberEnd3: false,
            PremiseRangeStart1: false,
            PremiseRangeEnd1: false,
            PremiseRangeStart2: false,
            PremiseRangeEnd2: false,
            PremiseRangeStart3: false,
            PremiseRangeEnd3: false,
            PremiseRangeStart4: false,
            PremiseRangeEnd4: false
        };
        this.formControlErrorFlag = {
            AccountNumber: false,
            AccountName: false,
            InvoiceGroupNumber: false,
            InvoiceGroupDesc: false,
            chkEntireAccount: false,
            chkSeparateInvoice: false,
            ContractNumber: false,
            ContractNumber1: false,
            ContractNumber2: false,
            PremiseNumber2: false,
            ContractNumber4: false,
            ContractNumber3: false,
            PremiseNumberStart3: false,
            PremiseNumberEnd3: false,
            PremiseRangeStart1: false,
            PremiseRangeEnd1: false,
            PremiseRangeStart2: false,
            PremiseRangeEnd2: false,
            PremiseRangeStart3: false,
            PremiseRangeEnd3: false,
            PremiseRangeStart4: false,
            PremiseRangeEnd4: false
        };
        this.errorClass = 'has-error';
        this.menu = '';
        this.spanDisplay = {
            spanAccountNumber: true,
            spanInvoiceGroupNumber: true,
            spanchkEntireAccount: true,
            spanchkSeparateInvoice: true,
            spanContractNumber: true,
            spanContractNumber2: true,
            spanPremiseNumber2: true,
            spanContractNumber4: true,
            spanContractNumber3: true,
            spanPremiseNumberStart3: true,
            spanPremiseNumberEnd3: true,
            spanPremiseRangeStart1: true,
            spanPremiseRangeEnd1: true,
            spanPremiseRangeStart2: true,
            spanPremiseRangeEnd2: true,
            spanPremiseRangeStart3: true,
            spanPremiseRangeEnd3: true,
            spanPremiseRangeStart4: true,
            spanPremiseRangeEnd4: true
        };
        this.tabNameMap = {
            by_account: true,
            by_contract: false,
            by_premise_range: false
        };
        this.buttonDisplay = {
            bttnSave: true,
            bttnCancel: true
        };
        this.ellipseDisplay = {
            accountNumberEllipse: true,
            invoiceGroupEllipse: true
        };
        this.inputParams = {
            operation: 'Application/iCABSAInvoiceGroupPremiseMaintenance',
            method: 'contract-management/maintenance',
            module: 'contract-admin',
            action: '',
            businessCode: '',
            countryCode: ''
        };
        this.ajaxSource = new BehaviorSubject(0);
        this.showHeader = false;
        this.autoOpenConfig = {
            accountSearchComponent: false,
            invoiceGroupMaintenanceSearch: false,
            contractSearchComponent1: false,
            contractSearchComponent2: false,
            componentPremiseNumber2: false,
            contractSearchComponent4: false,
            contractSearchComponent3: false,
            componentPremiseNumberStart3: false,
            componentPremiseNumberEnd3: false,
            componentPremiseRangeStart1: false,
            componentPremiseRangeEnd1: false,
            componentPremiseRangeStart2: false,
            componentPremiseRangeEnd2: false,
            componentPremiseRangeStart3: false,
            componentPremiseRangeEnd3: false,
            componentPremiseRangeStart4: false,
            componentPremiseRangeEnd4: false
        };
        this.ellipseHiddenFlag = {
            accountSearchComponent: true,
            invoiceGroupMaintenanceSearch: true,
            contractSearchComponent1: true,
            contractSearchComponent2: true,
            componentPremiseNumber2: true,
            contractSearchComponent4: true,
            contractSearchComponent3: true,
            componentPremiseNumberStart3: true,
            componentPremiseNumberEnd3: true,
            componentPremiseRangeStart1: true,
            componentPremiseRangeEnd1: true,
            componentPremiseRangeStart2: true,
            componentPremiseRangeEnd2: true,
            componentPremiseRangeStart3: true,
            componentPremiseRangeEnd3: true,
            componentPremiseRangeStart4: true,
            componentPremiseRangeEnd4: true
        };
        this.accountSearchComponent = AccountSearchComponent;
        this.accountSearchAutoOpen = false;
        this.inputParamsAccSearch = { 'parentMode': 'InvoiceGroupMaintenanceSearch' };
        this.invoiceGroupMaintenanceSearch = InvoiceGroupGridComponent;
        this.inputInvoiceGroupMaintenanceSearch = { 'parentMode': 'InvoiceGroupMaintenanceSearch', 'AccountNumber': '', 'AccountName': '' };
        this.contractSearchComponent1 = ContractSearchComponent;
        this.inputContractSearchComponent1 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 1, 'accountNumber': '', 'accountName': '' };
        this.contractSearchComponent2 = ContractSearchComponent;
        this.inputContractSearchComponent2 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 2 };
        this.contractSearchComponent3 = ContractSearchComponent;
        this.inputContractSearchComponent3 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 3 };
        this.contractSearchComponent4 = ContractSearchComponent;
        this.inputContractSearchComponent4 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 4 };
        this.componentPremiseNumber2 = PremiseSearchComponent;
        this.inputPremiseNumber2 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 2, 'StartPremiseSet': '', 'ContractNumber': '', 'ContractName': '' };
        this.componentPremiseNumberStart3 = PremiseSearchComponent;
        this.inputPremiseNumberStart3 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 3, 'StartPremiseSet': '' };
        this.componentPremiseNumberEnd3 = PremiseSearchComponent;
        this.inputPremiseNumberEnd3 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 3, 'StartPremiseSet': true };
        this.componentPremiseRangeStart1 = PremiseSearchComponent;
        this.inputPremiseRangeStart1 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R5', 'StartPremiseSet': '' };
        this.componentPremiseRangeEnd1 = PremiseSearchComponent;
        this.inputPremiseRangeEnd1 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R5', 'StartPremiseSet': true };
        this.componentPremiseRangeStart2 = PremiseSearchComponent;
        this.inputPremiseRangeStart2 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R6', 'StartPremiseSet': '' };
        this.componentPremiseRangeEnd2 = PremiseSearchComponent;
        this.inputPremiseRangeEnd2 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R6', 'StartPremiseSet': true };
        this.componentPremiseRangeStart3 = PremiseSearchComponent;
        this.inputPremiseRangeStart3 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R7', 'StartPremiseSet': '' };
        this.componentPremiseRangeEnd3 = PremiseSearchComponent;
        this.inputPremiseRangeEnd3 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R7', 'StartPremiseSet': true };
        this.componentPremiseRangeStart4 = PremiseSearchComponent;
        this.inputPremiseRangeStart4 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R8', 'StartPremiseSet': '' };
        this.componentPremiseRangeEnd4 = PremiseSearchComponent;
        this.inputPremiseRangeEnd4 = { 'parentMode': 'InvGrpPremiseMaintenance', 'action': 'R8', 'StartPremiseSet': true };
        this.urlHeaders = { 'BusinessCode': '', 'CountryCode': '' };
        this.sysCharParams = {
            vSCEnablePayTypeAtInvGroupLevel: '',
            SCEnablePayTypeAtInvGroupLev: ''
        };
        this.storeSubscription = store.select('account').subscribe(function (data) {
            _this.storeData = data;
        });
        this.storeSubscriptionInvoice = this.storeInvoiceObj.select('invoice').subscribe(function (data) {
            _this.storeUpdateHandler(data);
        });
    }
    InvoiceGroupPremiseMaintenanceComponent.prototype.setAccountNumber = function (data) {
        this.clearFields();
        this.enableAllFields();
        this.formControl.AccountNumber = data.AccountNumber;
        this.formControl.AccountName = data.AccountName;
        this.storeInvoice = {
            AccountNumber: this.formControl.AccountNumber,
            AccountName: this.formControl.AccountName,
            AccountNumberChanged: true
        };
        this.storeInvoiceObj.dispatch({
            type: InvoiceActionTypes.SAVE_INVOICE,
            payload: this.storeInvoice
        });
        this.inputContractSearchComponent1['accountNumber'] = this.formControl.AccountNumber;
        this.inputContractSearchComponent1['accountName'] = this.formControl.AccountName;
        this.inputContractSearchComponent2['accountName'] = this.formControl.AccountName;
        this.inputContractSearchComponent2['accountNumber'] = this.formControl.AccountNumber;
        this.inputContractSearchComponent4['accountName'] = this.formControl.AccountName;
        this.inputContractSearchComponent4['accountNumber'] = this.formControl.AccountNumber;
        this.inputContractSearchComponent3['accountName'] = this.formControl.AccountName;
        this.inputContractSearchComponent3['accountNumber'] = this.formControl.AccountNumber;
        this.inputInvoiceGroupMaintenanceSearch['AccountNumber'] = this.formControl.AccountNumber;
        this.inputInvoiceGroupMaintenanceSearch['AccountName'] = this.formControl.AccountName;
        this.cbbService.disableComponent(true);
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setInvoiceGroupNumber = function (data) {
        this.clearFieldsInvoice();
        this.formControl.InvoiceGroupNumber = data.Number;
        this.formControl.InvoiceGroupDesc = data.Description;
        this.formControl.InvoiceGroupROWID = data.InvoiceGroupROWID;
        this.cbbService.disableComponent(true);
        this.afterNewPremises();
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setContract1 = function (data) {
        this.formControl.ContractNumber1 = data.ContractNumber;
        this.inputPremiseNumber2['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumber2['ContractName'] = data.ContractName;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setContract2 = function (data) {
        this.formControl.ContractNumber2 = data.ContractNumber;
        this.inputPremiseNumber2['ContractNumber'] = this.formControl.ContractNumber2;
        this.inputPremiseNumber2['ContractName'] = data.ContractName;
        this.inputPremiseNumber2['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumber2['ContractName'] = data.ContractName;
        this.componentPremiseNumber2Ref.openModal();
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setContract3 = function (data) {
        this.formControl.ContractNumber3 = data.ContractNumber;
        this.inputPremiseNumberStart3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumberStart3['ContractName'] = data.ContractName;
        this.inputPremiseNumberEnd3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumberEnd3['ContractName'] = data.ContractName;
        this.autoOpenConfig = {
            accountSearchComponent: false,
            invoiceGroupMaintenanceSearch: false,
            contractSearchComponent1: false,
            contractSearchComponent2: false,
            componentPremiseNumber2: false,
            contractSearchComponent4: false,
            contractSearchComponent3: false,
            componentPremiseNumberStart3: true,
            componentPremiseNumberEnd3: true,
            componentPremiseRangeStart1: true,
            componentPremiseRangeEnd1: true,
            componentPremiseRangeStart2: true,
            componentPremiseRangeEnd2: true,
            componentPremiseRangeStart3: true,
            componentPremiseRangeEnd3: true,
            componentPremiseRangeStart4: true,
            componentPremiseRangeEnd4: true
        };
        this.inputPremiseNumberStart3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumberStart3['ContractName'] = data.ContractName;
        this.inputPremiseNumberEnd3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseNumberEnd3['ContractName'] = data.ContractName;
        this.inputPremiseRangeStart1['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeStart1['ContractName'] = data.ContractName;
        this.inputPremiseRangeEnd1['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeEnd1['ContractName'] = data.ContractName;
        this.inputPremiseRangeStart2['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeStart2['ContractName'] = data.ContractName;
        this.inputPremiseRangeEnd2['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeEnd2['ContractName'] = data.ContractName;
        this.inputPremiseRangeStart3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeStart3['ContractName'] = data.ContractName;
        this.inputPremiseRangeEnd3['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeEnd3['ContractName'] = data.ContractName;
        this.inputPremiseRangeStart4['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeStart4['ContractName'] = data.ContractName;
        this.inputPremiseRangeEnd4['ContractNumber'] = data.ContractNumber;
        this.inputPremiseRangeEnd4['ContractName'] = data.ContractName;
        this.componentPremiseNumberStart3Ref.openModal();
        this.ContractNumber3Dependents(false);
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setContract4 = function (data) {
        this.formControl.ContractNumber4 = data.ContractNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseNumber2 = function (data) {
        this.formControl.PremiseNumber2 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseNumberStart3 = function (data) {
        this.formControl.PremiseNumberStart3 = data.PremiseNumber;
        this.componentPremiseNumberEnd3Ref.openModal();
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseNumberEnd3 = function (data) {
        this.formControl.PremiseNumberEnd3 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseRangeStart1 = function (data) {
        this.formControl.PremiseRangeStart1 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseRangeEnd1 = function (data) {
        this.formControl.PremiseRangeEnd1 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseRangeStart2 = function (data) {
        this.formControl.PremiseRangeStart2 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseRangeEnd22 = function (data) {
        this.formControl.PremiseRangeEnd2 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseRangeEnd2 = function (data) {
        this.formControl.PremiseRangeEnd2 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseRangeStart3 = function (data) {
        this.formControl.PremiseRangeStart3 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseRangeEnd3 = function (data) {
        this.formControl.PremiseRangeEnd3 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseRangeStart4 = function (data) {
        this.formControl.PremiseRangeStart4 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setPremiseRangeEnd4 = function (data) {
        this.formControl.PremiseRangeEnd4 = data.PremiseNumber;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.inputValueChange = function (inputKey) {
        var regex = /^[a-zA-Z]+$/;
        switch (inputKey) {
            case 'ContractNumber2':
                if (!this.formControl.ContractNumber2.match(regex) && this.formControl.ContractNumber2.length > 0) {
                    this.ContractNumber2Dependents(false);
                }
                this.inputPremiseNumber2['ContractNumber'] = this.formControl.ContractNumber2;
                break;
            case 'ContractNumber3':
                this.autoOpenConfig = {
                    accountSearchComponent: false,
                    invoiceGroupMaintenanceSearch: false,
                    contractSearchComponent1: false,
                    contractSearchComponent2: false,
                    componentPremiseNumber2: false,
                    contractSearchComponent4: false,
                    contractSearchComponent3: false,
                    componentPremiseNumberStart3: false,
                    componentPremiseNumberEnd3: false,
                    componentPremiseRangeStart1: false,
                    componentPremiseRangeEnd1: false,
                    componentPremiseRangeStart2: false,
                    componentPremiseRangeEnd2: false,
                    componentPremiseRangeStart3: false,
                    componentPremiseRangeEnd3: false,
                    componentPremiseRangeStart4: false,
                    componentPremiseRangeEnd4: false
                };
                if (!this.formControl.ContractNumber3.match(regex) && this.formControl.ContractNumber3.length > 0) {
                    this.ContractNumber3Dependents(false);
                }
                break;
            default:
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.ContractNumber3Dependents = function (flag) {
        this.formControlEnableFlag.PremiseNumberStart3 = flag;
        this.formControlEnableFlag.PremiseNumberEnd3 = flag;
        this.formControlEnableFlag.PremiseRangeStart1 = flag;
        this.formControlEnableFlag.PremiseRangeEnd1 = flag;
        this.formControlEnableFlag.PremiseRangeStart2 = flag;
        this.formControlEnableFlag.PremiseRangeEnd2 = flag;
        this.formControlEnableFlag.PremiseRangeStart3 = flag;
        this.formControlEnableFlag.PremiseRangeEnd3 = flag;
        this.formControlEnableFlag.PremiseRangeStart4 = flag;
        this.formControlEnableFlag.PremiseRangeEnd4 = flag;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.ContractNumber2Dependents = function (flag) {
        this.formControlEnableFlag.PremiseNumber2 = flag;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.storeUpdateHandler = function (data) {
        this.storeInvoice = {};
        if (data['code']) {
            this.storeCode = data['code'];
        }
        switch (data && data['action']) {
            case InvoiceActionTypes.SAVE_MODE:
                this.storeInvoice = data['invoice'];
                this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { 'parentMode': 'InvGrpPremiseMaintenance' } });
                break;
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.ngOnInit = function () {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        this.routeAwayGlobals.setDirtyFlag(true);
        this.localeTranslateService.setUpTranslation();
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.inputParams.countryCode = this.utils.getCountryCode();
        this.triggerFetchSysChar(false, true);
        this.getUrlParams();
        this.getDataFromStore();
        this.setUpApi();
        window.onerror = function () {
            return true;
        };
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.ngAfterViewInit = function () {
        if (this.formControl.parentMode === '')
            this.accountSearchComponentRef.openModal();
        this.accountSearchComponentRef.modalConfig = this.modalConfig;
        this.invoiceGroupMaintenanceSearchRef.modalConfig = this.modalConfig;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.ngOnDestroy = function () {
        console.log('ondestroy');
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.getDataFromStore = function () {
        if (this.storeData && (typeof this.storeData.from !== 'undefined' || typeof this.storeData.to !== 'undefined')) {
            if (typeof this.storeData.from !== 'undefined') {
                this.onDataReceived(this.storeData.from, false);
            }
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.onDataReceived = function (data, route) {
        if (data.hasOwnProperty('parentMode'))
            this.formControl.parentMode = data.parentMode;
        if (data.hasOwnProperty('AccountNumber'))
            this.formControl.AccountNumber = data.AccountNumber;
        if (data.hasOwnProperty('AccountName'))
            this.formControl.AccountName = data.AccountName;
        if (data.hasOwnProperty('InvoiceGroupNumber'))
            this.formControl.InvoiceGroupNumber = data.InvoiceGroupNumber;
        if (data.hasOwnProperty('InvoiceGroupDesc'))
            this.formControl.InvoiceGroupDesc = data.InvoiceGroupDesc;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.getUrlParams = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            if (params['parentMode'] !== undefined) {
                _this.formControl.parentMode = params['parentMode'];
            }
            if (params['AccountNumber'] !== undefined) {
                _this.formControlEnableFlag.AccountNumber = true;
                _this.formControl.AccountNumber = params['AccountNumber'];
                _this.lookupSearch('AccountNumber');
            }
            if (params['AccountName'] !== undefined) {
                _this.formControlEnableFlag.AccountName = true;
            }
            if (params['InvoiceGroupNumber'] !== undefined) {
                _this.formControlEnableFlag.InvoiceGroupNumber = true;
                _this.formControl.InvoiceGroupNumber = params['InvoiceGroupNumber'];
                _this.lookupSearch('InvoiceGroupNumber');
            }
            if (params['InvoiceGroupDesc'] !== undefined) {
                _this.formControlEnableFlag.InvoiceGroupDesc = true;
            }
        });
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.setUpApi = function () {
        if (this.formControl.parentMode === 'InvoiceGroup') {
            this.formControlEnableFlag.AccountNumber = true;
            this.formControlEnableFlag.AccountName = true;
            this.formControlEnableFlag.InvoiceGroupNumber = true;
            this.formControlEnableFlag.InvoiceGroupDesc = true;
        }
        else {
            this.formControlEnableFlag.AccountNumber = false;
            this.formControlEnableFlag.AccountName = false;
            this.formControlEnableFlag.InvoiceGroupNumber = false;
            this.formControlEnableFlag.InvoiceGroupDesc = false;
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.changeTab = function (tabname) {
        for (var key in this.tabNameMap) {
            if (this.tabNameMap.hasOwnProperty(key)) {
                this.tabNameMap[key] = false;
            }
        }
        this.tabNameMap[tabname] = true;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.resetFormData = function (tabname) {
        this.formControl.AccountNumber = '';
        this.formControl.AccountName = '';
        this.formControl.InvoiceGroupNumber = '';
        this.formControl.InvoiceGroupDesc = '';
        switch (tabname) {
            case 'by_account':
                this.formControl.chkEntireAccount = false;
                this.formControl.chkSeparateInvoice = false;
                break;
            case 'by_contract':
                this.formControl.ContractNumber1 = '';
                this.formControl.ContractNumber2 = '';
                this.formControl.PremiseNumber2 = '';
                this.formControl.ContractNumber4 = '';
                break;
            case 'by_premise_range':
                this.formControl.ContractNumber3 = '';
                this.formControl.PremiseNumberStart3 = '';
                this.formControl.PremiseNumberEnd3 = '';
                this.formControl.PremiseRangeStart1 = '';
                this.formControl.PremiseRangeEnd1 = '';
                this.formControl.PremiseRangeStart2 = '';
                this.formControl.PremiseRangeEnd2 = '';
                this.formControl.PremiseRangeStart3 = '';
                this.formControl.PremiseRangeEnd3 = '';
                this.formControl.PremiseRangeStart4 = '';
                this.formControl.PremiseRangeEnd4 = '';
                break;
            default:
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.saveOnclick = function () {
        this.routeAwayComponent.resetDirtyFlagAfterSaveUpdate();
        if (this.formControl.AccountNumber.length <= 0) {
            this.formControlErrorFlag.AccountNumber = true;
        }
        else {
            this.formControlErrorFlag.AccountNumber = false;
        }
        if (this.formControl.InvoiceGroupNumber.length <= 0) {
            this.formControlErrorFlag.InvoiceGroupNumber = true;
        }
        else {
            this.formControlErrorFlag.InvoiceGroupNumber = false;
        }
        var errorFlag = 0;
        for (var err in this.formControlErrorFlag) {
            if (err) {
                if (this.formControlErrorFlag[err] === true) {
                    errorFlag = 1;
                }
            }
        }
        this.messageModal.showHeader = true;
        this.messageModal.showCloseButton = true;
        if (errorFlag === 0) {
            if (this.sysCharParams['SCEnablePayTypeAtInvGroupLev'] === true) {
                var data = { title: '', msg: 'Moving Premises to another Invoice Group may result in a change to the Payment Method' };
                this.confirmOkModal.show(data, false);
            }
            else {
                this.cbbService.disableComponent(false);
                this.promptModalForSave.show();
            }
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.confirmOkClose = function (eventobj) {
        this.cbbService.disableComponent(false);
        this.promptModalForSave.show();
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.promptContentSaveData = function (eventObj) {
        this.messageModalClose();
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.resetForm = function () {
        this.formControl = {
            AccountNumber: '',
            AccountName: '',
            InvoiceGroupNumber: '',
            InvoiceGroupDesc: '',
            InvoiceGroupROWID: '',
            chkEntireAccount: '',
            chkSeparateInvoice: '',
            ContractNumber: '',
            ContractNumber1: '',
            ContractNumber2: '',
            PremiseNumber2: '',
            ContractNumber4: '',
            ContractNumber3: '',
            PremiseNumberStart3: '',
            PremiseNumberEnd3: '',
            PremiseRangeStart1: '',
            PremiseRangeEnd1: '',
            PremiseRangeStart2: '',
            PremiseRangeEnd2: '',
            PremiseRangeStart3: '',
            PremiseRangeEnd3: '',
            PremiseRangeStart4: '',
            PremiseRangeEnd4: ''
        };
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.messageModalClose = function () {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        var _formData = {};
        for (var key in this.formControl) {
            if (key) {
                _formData[key] = this.formControl[key];
                if ((key === 'chkSeparateInvoice') || (key === 'chkEntireAccount')) {
                    if (this.formControl[key] === true || this.formControl[key] === '') {
                        _formData[key] = 'yes';
                    }
                    else {
                        _formData[key] = 'no';
                    }
                }
            }
        }
        if (document.getElementById('chkEntireAccount').classList.contains('ng-dirty') || document.getElementById('chkSeparateInvoice').classList.contains('ng-dirty')) {
            if (this.formControlEnableFlag.chkSeparateInvoice === true) {
                _formData['chkSeparateInvoice'] = 'no';
            }
            else {
                _formData['chkSeparateInvoice'] = 'yes';
            }
            if (this.formControlEnableFlag.chkEntireAccount === true) {
                _formData['chkEntireAccount'] = 'no';
            }
            else {
                _formData['chkEntireAccount'] = 'yes';
            }
        }
        else {
            _formData['chkSeparateInvoice'] = '';
            _formData['chkEntireAccount'] = '';
        }
        _formData['action'] = '2';
        queryParams.set('action', '2');
        var _method = this.inputParams.method;
        var _module = this.inputParams.module;
        var _operation = this.inputParams.operation;
        var _search = queryParams;
        this.isRequesting = true;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(_method, _module, _operation, _search, _formData)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        });
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.cancelOnclick = function () {
        this.resetFormData('by_account');
        this.resetFormData('by_contract');
        this.resetFormData('by_premise_range');
        this.formControlEnableFlag.chkEntireAccount = false;
        this.formControlEnableFlag.chkSeparateInvoice = false;
        document.getElementById('cancelButton').blur();
        this.cbbService.disableComponent(false);
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.clickEntireAccount = function (eventObject) {
        if (eventObject.target.checked === true) {
            this.disableFields();
            this.formControlEnableFlag.chkSeparateInvoice = true;
        }
        else {
            this.enableFields();
            this.formControlEnableFlag.chkSeparateInvoice = false;
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.clickSeperateInvoice = function (eventObject) {
        if (eventObject.target.checked === true) {
            this.disableFields();
            this.formControlEnableFlag.chkEntireAccount = true;
        }
        else {
            this.enableFields();
            this.formControlEnableFlag.chkEntireAccount = false;
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.disableFields = function () {
        this.formControlEnableFlag.ContractNumber1 = true;
        this.formControlEnableFlag.ContractNumber2 = true;
        this.formControlEnableFlag.PremiseNumber2 = true;
        this.formControlEnableFlag.ContractNumber3 = true;
        this.formControlEnableFlag.PremiseNumberStart3 = true;
        this.formControlEnableFlag.PremiseNumberEnd3 = true;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.enableFields = function () {
        this.formControlEnableFlag.ContractNumber1 = false;
        this.formControlEnableFlag.ContractNumber2 = false;
        this.formControlEnableFlag.PremiseNumber2 = false;
        this.formControlEnableFlag.ContractNumber3 = false;
        this.formControlEnableFlag.PremiseNumberStart3 = false;
        this.formControlEnableFlag.PremiseNumberEnd3 = false;
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.menuOnchange = function () {
        if (this.menu === 'Premise') {
            this.cmdPremiseOnclick();
        }
        if (this.menu === 'Contract') {
            this.cmdContractOnclick();
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.cmdPremiseOnclick = function () {
        this.messageModal.show({ msg: 'The page is under construction', title: 'Message' }, false);
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.cmdContractOnclick = function () {
        this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE]);
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
            this.SysCharConstants.SystemCharEnablePayTypeAtInvoiceGroupLevel,
            this.SysCharConstants.SystemCharEnablePayTypeAtInvGroupLev
        ];
        return sysCharList.join(',');
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.onSysCharDataReceive = function (e) {
        if (e.records && e.records.length > 0) {
            this.sysCharParams['vSCEnablePayTypeAtInvGroupLevel'] = e.records[0].Required;
            this.sysCharParams['SCEnablePayTypeAtInvGroupLev'] = e.records[0].Required;
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.fetchSysChar = function (sysCharNumbers) {
        var querySysChar = new URLSearchParams();
        querySysChar.set(this.serviceConstants.Action, '0');
        querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(querySysChar);
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.triggerFetchSysChar = function (saveModeData, returnSubscription) {
        var _this = this;
        var sysCharNumbers = this.sysCharParameters();
        this.fetchSysChar(sysCharNumbers).subscribe(function (data) {
            _this.onSysCharDataReceive(data);
        });
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.lookupSearch = function (formKey) {
        var _this = this;
        var queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.MethodType, 'maintenance');
        var lookupQuery = '';
        var tempInvoiceGroupNumber = this.formControl.InvoiceGroupNumber;
        if (formKey === 'AccountNumber') {
            if (this.formControl.AccountNumber.length > 0) {
                this.formControl.AccountNumber = this.utils.fillLeadingZeros(this.formControl.AccountNumber, 9);
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                        'table': 'Account',
                        'query': { 'BuisinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.formControl.AccountNumber },
                        'fields': ['AccountName']
                    }];
            }
            else {
                this.clearFields();
            }
        }
        ;
        if (formKey === 'InvoiceGroupNumber') {
            if (this.formControl.InvoiceGroupNumber.length > 0) {
                queryParams.set(this.serviceConstants.Action, '0');
                lookupQuery = [{
                        'table': 'InvoiceGroup',
                        'query': { 'BuisinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.formControl.AccountNumber, 'InvoiceGroupNumber': this.formControl.InvoiceGroupNumber },
                        'fields': ['InvoiceGroupDesc']
                    }];
            }
            else {
                this.formControl.InvoiceGroupDesc = '';
            }
        }
        ;
        if (lookupQuery !== '' && this.formControl.parentMode === 'InvoiceGroup') {
            this.isRequesting = true;
            this.invokeLookupSearch(queryParams, lookupQuery).subscribe(function (value) {
                if (value['results']['0']['0'] !== undefined) {
                    if (formKey === 'AccountNumber') {
                        _this.clearFieldsInvoice();
                        if (value['results'][0].length > 0) {
                            _this.formControl.AccountName = value['results']['0']['0']['AccountName'];
                            _this.inputContractSearchComponent1['accountName'] = _this.formControl.AccountName;
                            _this.inputContractSearchComponent1['accountNumber'] = _this.formControl.AccountNumber;
                            _this.inputContractSearchComponent2['accountName'] = _this.formControl.AccountName;
                            _this.inputContractSearchComponent2['accountNumber'] = _this.formControl.AccountNumber;
                            _this.inputContractSearchComponent4['accountName'] = _this.formControl.AccountName;
                            _this.inputContractSearchComponent4['accountNumber'] = _this.formControl.AccountNumber;
                            _this.inputContractSearchComponent3['accountName'] = _this.formControl.AccountName;
                            _this.inputContractSearchComponent3['accountNumber'] = _this.formControl.AccountNumber;
                            _this.inputInvoiceGroupMaintenanceSearch['AccountNumber'] = _this.formControl.AccountNumber;
                            _this.inputInvoiceGroupMaintenanceSearch['AccountName'] = _this.formControl.AccountName;
                            _this.cbbService.disableComponent(true);
                        }
                        else {
                            _this.clearFields();
                        }
                    }
                    if (formKey === 'InvoiceGroupNumber') {
                        _this.clearFieldsInvoice();
                        _this.formControl.InvoiceGroupNumber = tempInvoiceGroupNumber;
                        _this.formControl.InvoiceGroupDesc = value['results']['0']['0']['InvoiceGroupDesc'];
                        _this.formControl.InvoiceGroupROWID = value['results']['0']['0']['ttInvoiceGroup'];
                        _this.cbbService.disableComponent(true);
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }
                else {
                    if (formKey === 'AccountNumber') {
                        _this.clearFields();
                    }
                    if (formKey === 'InvoiceGroupNumber') {
                        _this.formControl.InvoiceGroupDesc = '';
                        _this.formControl.InvoiceGroupNumber = '';
                    }
                }
                _this.isRequesting = false;
            }, function (error) {
                console.log('lookup search error');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isRequesting = false;
            }, function () {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isRequesting = false;
            });
        }
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.invokeLookupSearch = function (queryParams, data) {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.clearFields = function () {
        this.formControl = {
            AccountNumber: '',
            AccountName: '',
            InvoiceGroupNumber: '',
            InvoiceGroupDesc: '',
            InvoiceGroupROWID: '',
            chkEntireAccount: '',
            chkSeparateInvoice: '',
            ContractNumber: '',
            ContractNumber1: '',
            ContractNumber2: '',
            PremiseNumber2: '',
            ContractNumber4: '',
            ContractNumber3: '',
            PremiseNumberStart3: '',
            PremiseNumberEnd3: '',
            PremiseRangeStart1: '',
            PremiseRangeEnd1: '',
            PremiseRangeStart2: '',
            PremiseRangeEnd2: '',
            PremiseRangeStart3: '',
            PremiseRangeEnd3: '',
            PremiseRangeStart4: '',
            PremiseRangeEnd4: ''
        };
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.clearFieldsInvoice = function () {
        this.formControl = {
            AccountNumber: this.formControl.AccountNumber,
            AccountName: this.formControl.AccountName,
            InvoiceGroupNumber: '',
            InvoiceGroupDesc: '',
            InvoiceGroupROWID: '',
            chkEntireAccount: '',
            chkSeparateInvoice: '',
            ContractNumber: '',
            ContractNumber1: '',
            ContractNumber2: '',
            PremiseNumber2: '',
            ContractNumber4: '',
            ContractNumber3: '',
            PremiseNumberStart3: '',
            PremiseNumberEnd3: '',
            PremiseRangeStart1: '',
            PremiseRangeEnd1: '',
            PremiseRangeStart2: '',
            PremiseRangeEnd2: '',
            PremiseRangeStart3: '',
            PremiseRangeEnd3: '',
            PremiseRangeStart4: '',
            PremiseRangeEnd4: ''
        };
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.afterNewPremises = function () {
        var _this = this;
        this.zone.run(function () {
            _this.formControl = {
                AccountNumber: _this.formControl.AccountNumber,
                AccountName: _this.formControl.AccountName,
                InvoiceGroupNumber: _this.formControl.InvoiceGroupNumber,
                InvoiceGroupDesc: _this.formControl.InvoiceGroupDesc,
                InvoiceGroupROWID: _this.formControl.InvoiceGroupROWID,
                chkEntireAccount: '',
                chkSeparateInvoice: '',
                ContractNumber: '',
                ContractNumber1: '',
                ContractNumber2: '',
                PremiseNumber2: '',
                ContractNumber4: '',
                ContractNumber3: '',
                PremiseNumberStart3: '',
                PremiseNumberEnd3: '',
                PremiseRangeStart1: '',
                PremiseRangeEnd1: '',
                PremiseRangeStart2: '',
                PremiseRangeEnd2: '',
                PremiseRangeStart3: '',
                PremiseRangeEnd3: '',
                PremiseRangeStart4: '',
                PremiseRangeEnd4: ''
            };
        });
        this.enableAllFields();
    };
    InvoiceGroupPremiseMaintenanceComponent.prototype.enableAllFields = function () {
        var _this = this;
        this.zone.run(function () {
            _this.formControlEnableFlag.AccountNumber = false;
            _this.formControlEnableFlag.AccountName = false;
            _this.formControlEnableFlag.InvoiceGroupNumber = false;
            _this.formControlEnableFlag.InvoiceGroupDesc = false;
            _this.formControlEnableFlag.chkEntireAccount = false;
            _this.formControlEnableFlag.chkSeparateInvoice = false;
            _this.formControlEnableFlag.ContractNumber = false;
            _this.formControlEnableFlag.ContractNumber1 = false;
            _this.formControlEnableFlag.ContractNumber2 = false;
            _this.formControlEnableFlag.PremiseNumber2 = false;
            _this.formControlEnableFlag.ContractNumber4 = false;
            _this.formControlEnableFlag.ContractNumber3 = false;
            _this.formControlEnableFlag.PremiseNumberStart3 = false;
            _this.formControlEnableFlag.PremiseNumberEnd3 = false;
            _this.formControlEnableFlag.PremiseRangeStart1 = false;
            _this.formControlEnableFlag.PremiseRangeEnd1 = false;
            _this.formControlEnableFlag.PremiseRangeStart2 = false;
            _this.formControlEnableFlag.PremiseRangeEnd2 = false;
            _this.formControlEnableFlag.PremiseRangeStart3 = false;
            _this.formControlEnableFlag.PremiseRangeEnd3 = false;
            _this.formControlEnableFlag.PremiseRangeStart4 = false;
            _this.formControlEnableFlag.PremiseRangeEnd4 = false;
        });
    };
    InvoiceGroupPremiseMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-invoicegrouppremise',
                    templateUrl: 'iCABSAInvoiceGroupPremiseMaintenance.html'
                },] },
    ];
    InvoiceGroupPremiseMaintenanceComponent.ctorParameters = [
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: AuthService, },
        { type: AjaxObservableConstant, },
        { type: Router, },
        { type: PageDataService, },
        { type: Title, },
        { type: NgZone, },
        { type: Store, },
        { type: Store, },
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Http, },
        { type: LocaleTranslationService, },
        { type: SysCharConstants, },
        { type: Logger, },
        { type: Utils, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: SysCharConstants, },
        { type: RouteAwayGlobals, },
        { type: CBBService, },
    ];
    InvoiceGroupPremiseMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'confirmOkModal': [{ type: ViewChild, args: ['confirmOkModal',] },],
        'accountSearchComponentRef': [{ type: ViewChild, args: ['accountSearchComponentRef',] },],
        'invoiceGroupMaintenanceSearchRef': [{ type: ViewChild, args: ['invoiceGroupMaintenanceSearchRef',] },],
        'contractSearchComponent1Ref': [{ type: ViewChild, args: ['contractSearchComponent1Ref',] },],
        'contractSearchComponent11Ref': [{ type: ViewChild, args: ['contractSearchComponent11Ref',] },],
        'componentPremiseNumber2Ref': [{ type: ViewChild, args: ['componentPremiseNumber2Ref',] },],
        'contractSearchComponent4Ref': [{ type: ViewChild, args: ['contractSearchComponent4Ref',] },],
        'contractSearchComponent3Ref': [{ type: ViewChild, args: ['contractSearchComponent3Ref',] },],
        'componentPremiseNumberStart3Ref': [{ type: ViewChild, args: ['componentPremiseNumberStart3Ref',] },],
        'componentPremiseNumberEnd3Ref': [{ type: ViewChild, args: ['componentPremiseNumberEnd3Ref',] },],
        'componentPremiseRangeStart1Ref': [{ type: ViewChild, args: ['componentPremiseRangeStart1Ref',] },],
        'componentPremiseRangeEnd1Ref': [{ type: ViewChild, args: ['componentPremiseRangeEnd1Ref',] },],
        'componentPremiseRangeStart2Ref': [{ type: ViewChild, args: ['componentPremiseRangeStart2Ref',] },],
        'componentPremiseRangeEnd2Ref': [{ type: ViewChild, args: ['componentPremiseRangeEnd2Ref',] },],
        'componentPremiseRangeStart3Ref': [{ type: ViewChild, args: ['componentPremiseRangeStart3Ref',] },],
        'componentPremiseRangeEnd3Ref': [{ type: ViewChild, args: ['componentPremiseRangeEnd3Ref',] },],
        'componentPremiseRangeEnd4Ref': [{ type: ViewChild, args: ['componentPremiseRangeEnd4Ref',] },],
        'componentPremiseRangeStart4Ref': [{ type: ViewChild, args: ['componentPremiseRangeStart4Ref',] },],
        'promptModalForSave': [{ type: ViewChild, args: ['promptModalForSave',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return InvoiceGroupPremiseMaintenanceComponent;
}());
