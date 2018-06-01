import { Component, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Location } from '@angular/common';
import { Logger } from '@nsalaun/ng2-logger';
import { ReplaySubject } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { LookUp } from './../../../../shared/services/lookup';
import { Utils } from '../../../../shared/services/utility';
import { LocaleTranslationService } from '../../../../shared/services/translation.service';
import { ComponentInteractionService } from '../../../../shared/services/component-interaction.service';
import { HttpService } from '../../../../shared/services/http-service';
import { RiExchange } from '../../../../shared/services/riExchange';
import { MessageService } from './../../../../shared/services/message.service';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { RouteAwayGlobals } from '../../../../shared/services/route-away-global.service';
export var InvoiceNarrativeMaintenanceComponent = (function () {
    function InvoiceNarrativeMaintenanceComponent(route, serviceConstants, translate, componentInteractionService, fb, router, utils, LookUp, logger, xhr, messageService, zone, riExchange, location, routeAwayGlobals) {
        this.route = route;
        this.serviceConstants = serviceConstants;
        this.translate = translate;
        this.componentInteractionService = componentInteractionService;
        this.fb = fb;
        this.router = router;
        this.utils = utils;
        this.LookUp = LookUp;
        this.logger = logger;
        this.xhr = xhr;
        this.messageService = messageService;
        this.zone = zone;
        this.riExchange = riExchange;
        this.location = location;
        this.routeAwayGlobals = routeAwayGlobals;
        this.mode = 'ADD';
        this.promptTitle = 'Confirm';
        this.promptContentSave = 'Confirm Record?';
        this.promptContentDelete = 'Delete Record?';
        this.invoiceNarrativeText = '';
        this.backLinkText = '';
        this.backLinkUrl = '';
        this.xhrParams = {
            module: 'contract-admin',
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAInvoiceNarrativeMaintenance'
        };
        this.uiDisplay = {
            pageHeader: 'Invoice Narrative Maintenance',
            AccountNumber: true,
            InvoiceGroupNumber: true,
            ContractNumber: true,
            PremiseNumber: true,
            oper: {
                add: false,
                update: false,
                delete: false,
                save: false,
                cancel: false
            },
            readOnly: {
                AccountNumber: true,
                AccountName: true,
                InvoiceGroupNumber: true,
                InvoiceGroupDesc: true,
                ContractNumber: true,
                ContractName: true,
                PremiseNumber: true,
                PremiseName: true
            }
        };
    }
    InvoiceNarrativeMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.componentInteractionService.emitMessage(false);
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.promptContentDelete = MessageConstant.Message.DeleteRecord;
        this.vBusinessCode = this.utils.getBusinessCode();
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
        this.riExchange.getStore('contract');
        this.uiForm = this.fb.group({
            InvoiceNarrativeText: [{ value: '' }, Validators.required]
        });
        this.initForm();
        this.translate.setUpTranslation();
        this.window_onload();
    };
    InvoiceNarrativeMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.subLookUpAccount) {
            this.subLookUpAccount.unsubscribe();
        }
        if (this.subLookUpInvoice) {
            this.subLookUpInvoice.unsubscribe();
        }
        if (this.subLookUpContract) {
            this.subLookUpContract.unsubscribe();
        }
        if (this.subLookUpPremise) {
            this.subLookUpPremise.unsubscribe();
        }
        if (this.xhrFetch) {
            this.xhrFetch.unsubscribe();
        }
        if (this.xhrPost) {
            this.xhrPost.unsubscribe();
        }
        if (this.xhrAdd) {
            this.xhrAdd.unsubscribe();
        }
        if (this.xhrUpdate) {
            this.xhrUpdate.unsubscribe();
        }
        if (this.xhrDelete) {
            this.xhrDelete.unsubscribe();
        }
        this.riExchange.killStore();
        this.routeAwayGlobals.resetRouteAwayFlags();
    };
    InvoiceNarrativeMaintenanceComponent.prototype.initForm = function () {
        var controls = [
            'AccountNumber',
            'AccountName',
            'InvoiceGroupNumber',
            'InvoiceGroupDesc',
            'ContractNumber',
            'ContractName',
            'PremiseNumber',
            'PremiseName',
            'InvoiceNarrativeText',
            'InvoiceNarrative'
        ];
        for (var i = 0; i < controls.length; i++) {
            this.riExchange.riInputElement.Add(this.uiForm, controls[i]);
        }
    };
    InvoiceNarrativeMaintenanceComponent.prototype.window_onload = function () {
        var ContractObject = { type: '', label: '' };
        ContractObject.type = this.utils.getCurrentContractType(this.routeParams.currentContractTypeURLParameter);
        ContractObject.label = this.utils.getCurrentContractLabel(ContractObject.type);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'AccountNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'AccountName'));
        this.doLookupAccount();
        var ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'InvoiceGroup':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceGroupNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupDesc', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceGroupDesc'));
                this.uiDisplay.ContractNumber = false;
                this.uiDisplay.PremiseNumber = false;
                this.doLookupInvoiceGroup();
                break;
            case 'Contract':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractName'));
                this.uiDisplay.InvoiceGroupNumber = false;
                this.uiDisplay.PremiseNumber = false;
                this.doLookupContract();
                break;
            case 'Premise':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceGroupNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupDesc', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceGroupDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseName'));
                this.doLookupInvoiceGroup();
                this.doLookupContract();
                this.doLookupPremise();
                break;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNarrativeText', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceNarrativeText'));
        this.fetchRecord();
    };
    InvoiceNarrativeMaintenanceComponent.prototype.doLookupAccount = function () {
        var _this = this;
        var lookupIP_details = [{
                'table': 'Account',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'AccountNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')
                },
                'fields': ['AccountNumber', 'AccountName']
            }];
        this.subLookUpAccount = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (data) {
            if (data.length > 0) {
                var record = data[0];
                if (record.length > 0) {
                    var resp = record[0];
                    if (resp.hasOwnProperty('AccountName')) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountName', resp['AccountName']);
                    }
                }
            }
        });
    };
    InvoiceNarrativeMaintenanceComponent.prototype.doLookupInvoiceGroup = function () {
        var _this = this;
        var lookupIP_details = [{
                'table': 'InvoiceGroup',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'AccountNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'),
                    'InvoiceGroupNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber')
                },
                'fields': ['AccountNumber', 'InvoiceGroupNumber', 'InvoiceGroupDesc']
            }];
        this.subLookUpInvoice = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (data) {
            if (data.length > 0) {
                var record = data[0];
                if (record.length > 0) {
                    var resp = record[0];
                    if (resp.hasOwnProperty('InvoiceGroupDesc')) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceGroupDesc', resp['InvoiceGroupDesc']);
                    }
                }
            }
        });
    };
    InvoiceNarrativeMaintenanceComponent.prototype.doLookupContract = function () {
        var _this = this;
        var lookupIP_details = [{
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractNumber', 'ContractName']
            }];
        this.subLookUpContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (data) {
            if (data.length > 0) {
                var record = data[0];
                if (record.length > 0) {
                    var resp = record[0];
                    if (resp.hasOwnProperty('ContractName')) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', resp['ContractName']);
                    }
                }
            }
        });
    };
    InvoiceNarrativeMaintenanceComponent.prototype.doLookupPremise = function () {
        var _this = this;
        var lookupIP_details = [{
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.vBusinessCode,
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseNumber', 'PremiseName']
            }];
        this.subLookUpPremise = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (data) {
            if (data.length > 0) {
                var record = data[0];
                if (record.length > 0) {
                    var resp = record[0];
                    if (resp.hasOwnProperty('PremiseName')) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', resp['PremiseName']);
                    }
                }
            }
        });
    };
    InvoiceNarrativeMaintenanceComponent.prototype.fetchRecord = function () {
        var _this = this;
        var xhrParams = {};
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'));
        var ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'InvoiceGroup':
                search.set('invoiceGroupNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'));
                break;
            case 'Contract':
                search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                break;
            case 'Premise':
                search.set('invoiceGroupNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'));
                search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                search.set('premiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
                break;
        }
        this.xhrFetch = this.xhr.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            if (data.RecordFound === 'yes') {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountName', data.AccountName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceNarrativeText', data.InvoiceNarrativeText);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceNarrative', data.InvoiceNarrative);
                if (data.InvoiceNarrativeText) {
                    _this.invoiceNarrativeText = data.InvoiceNarrativeText;
                    _this.mode = 'EDIT';
                    _this.uiDisplay.oper.delete = true;
                }
                else {
                    _this.mode = 'ADD';
                    _this.uiDisplay.oper.delete = false;
                }
            }
            _this.uiDisplay.oper.add = false;
            _this.uiDisplay.oper.update = false;
            _this.uiDisplay.oper.save = true;
            _this.uiDisplay.oper.cancel = true;
        });
    };
    InvoiceNarrativeMaintenanceComponent.prototype.getFormData = function () {
        var formData = {};
        formData['AccountNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber');
        formData['InvoiceNarrativeText'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNarrativeText');
        formData['ROWID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNarrative');
        var ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'InvoiceGroup':
                formData['invoiceGroupNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber');
                break;
            case 'Contract':
                formData['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                break;
            case 'Premise':
                formData['invoiceGroupNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber');
                formData['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                formData['premiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                break;
        }
        return formData;
    };
    InvoiceNarrativeMaintenanceComponent.prototype.addRecord = function () {
        this.mode = 'ADD';
        this.uiDisplay.oper.add = false;
        this.uiDisplay.oper.update = false;
        this.uiDisplay.oper.delete = false;
        this.uiDisplay.oper.save = true;
        this.uiDisplay.oper.cancel = true;
    };
    InvoiceNarrativeMaintenanceComponent.prototype.onCancel = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNarrativeText', this.invoiceNarrativeText);
    };
    InvoiceNarrativeMaintenanceComponent.prototype.onSubmit = function () {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.promptModalSave.show();
    };
    InvoiceNarrativeMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        var resp = this.doPost(this.mode);
        this.xhrUpdate = resp.subscribe(function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                _this.showAlert('Error: ' + data.errorMessage);
            }
            else {
                _this.invoiceNarrativeText = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'InvoiceNarrativeText');
                var ROWID = data.ttInvoiceNarrative;
                if (data.InvoiceNarrative)
                    ROWID = data.InvoiceNarrative;
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceNarrative', ROWID);
                _this.uiDisplay.oper.delete = true;
                _this.uiDisplay.oper.save = true;
                _this.uiDisplay.oper.cancel = true;
            }
        });
    };
    InvoiceNarrativeMaintenanceComponent.prototype.promptDelete = function (event) {
        var _this = this;
        var resp = this.doPost('DEL');
        this.xhrDelete = resp.subscribe(function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                _this.showAlert('Error: ' + data.errorMessage);
            }
            else {
                _this.invoiceNarrativeText = '';
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceNarrativeText', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceNarrative', '');
                _this.uiDisplay.oper.add = false;
                _this.uiDisplay.oper.update = false;
                _this.uiDisplay.oper.delete = false;
                _this.uiDisplay.oper.save = true;
                _this.uiDisplay.oper.cancel = true;
            }
        });
    };
    InvoiceNarrativeMaintenanceComponent.prototype.deleteRecord = function () {
        this.promptModalDelete.show();
    };
    InvoiceNarrativeMaintenanceComponent.prototype.doPost = function (mode) {
        var retObj = new ReplaySubject(1);
        var action = '0';
        switch (mode) {
            case 'ADD':
                action = '1';
                this.mode = 'EDIT';
                break;
            case 'EDIT':
                action = '2';
                break;
            case 'DEL':
                action = '3';
                this.mode = 'ADD';
                break;
        }
        var xhrParams = {};
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.Action, action);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        var formData = this.getFormData();
        this.xhrPost = this.xhr.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).subscribe(function (res) { return retObj.next(res); });
        return retObj;
    };
    InvoiceNarrativeMaintenanceComponent.prototype.showAlert = function (msgTxt) {
        this.messageModal.show({ msg: msgTxt, title: 'Message' }, false);
    };
    InvoiceNarrativeMaintenanceComponent.prototype.updateRecord = function () {
        this.mode = 'EDIT';
        this.uiDisplay.oper.add = false;
        this.uiDisplay.oper.update = false;
        this.uiDisplay.oper.delete = false;
        this.uiDisplay.oper.save = true;
        this.uiDisplay.oper.cancel = true;
    };
    InvoiceNarrativeMaintenanceComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    InvoiceNarrativeMaintenanceComponent.prototype.canDeactivate = function () {
        return this.routeAwayComponent.canDeactivate();
    };
    InvoiceNarrativeMaintenanceComponent.prototype.routeAwayUpdateSaveFlag = function () {
        var flag = this.riExchange.riInputElement.HasChanged(this.uiForm, 'InvoiceNarrativeText');
        if (flag) {
            this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
        else {
            this.routeAwayGlobals.setSaveEnabledFlag(false);
        }
    };
    InvoiceNarrativeMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAInvoiceNarrativeMaintenance.html'
                },] },
    ];
    InvoiceNarrativeMaintenanceComponent.ctorParameters = [
        { type: ActivatedRoute, },
        { type: ServiceConstants, },
        { type: LocaleTranslationService, },
        { type: ComponentInteractionService, },
        { type: FormBuilder, },
        { type: Router, },
        { type: Utils, },
        { type: LookUp, },
        { type: Logger, },
        { type: HttpService, },
        { type: MessageService, },
        { type: NgZone, },
        { type: RiExchange, },
        { type: Location, },
        { type: RouteAwayGlobals, },
    ];
    InvoiceNarrativeMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModalSave': [{ type: ViewChild, args: ['promptModalSave',] },],
        'promptModalDelete': [{ type: ViewChild, args: ['promptModalDelete',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return InvoiceNarrativeMaintenanceComponent;
}());
