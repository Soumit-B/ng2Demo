var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ActivatedRoute } from '@angular/router';
import { DlRejectionSearchComponent } from '../../../app/internal/search/iCABSBdlRejectionSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
export var QuoteStatusMaintenanceComponent = (function (_super) {
    __extends(QuoteStatusMaintenanceComponent, _super);
    function QuoteStatusMaintenanceComponent(injector, route, elem) {
        _super.call(this, injector);
        this.route = route;
        this.elem = elem;
        this.queryParams = {
            operation: 'Sales/iCABSSSOQuoteStatusMaintenance',
            module: 'advantage',
            method: 'prospect-to-contract/maintenance'
        };
        this.pageId = '';
        this.search = new URLSearchParams();
        this.confirmdata = {};
        this.showHeader = true;
        this.showCancel = true;
        this.showCloseButton = true;
        this.btnstatusdisable = false;
        this.isRejected = false;
        this.showMessageHeader = true;
        this.isRejectionReason = false;
        this.currentMode = '';
        this.isSaveCancelDisabled = false;
        this.selectedStatus = '';
        this.validStatuses = '';
        this.selectedUpdateStatus = '';
        this.controls = [
            { name: 'ProspectName', readonly: false, disabled: true, required: false },
            { name: 'ProspectNumber', readonly: false, disabled: true, required: false },
            { name: 'QuoteNumber', readonly: false, disabled: true, required: false },
            { name: 'dlContractRef', readonly: false, disabled: true, required: false },
            { name: 'dlStatusCode', readonly: false, disabled: true, required: false },
            { name: 'dlStatusDesc', readonly: false, disabled: true, required: false },
            { name: 'dlRejectionCode', readonly: false, disabled: true, required: true },
            { name: 'dlRejectionDesc', readonly: false, disabled: true, required: false },
            { name: 'LostBusinessCode', readonly: false, disabled: true, required: true },
            { name: 'LostBusinessDesc', readonly: false, disabled: true, required: false },
            { name: 'LostBusinessDetailCode', readonly: false, disabled: true, required: true },
            { name: 'LostBusinessDetailDesc', readonly: false, disabled: true, required: false },
            { name: 'SMSMessage', readonly: false, disabled: true, required: false },
            { name: 'dlHistoryNarrative', readonly: false, disabled: true, required: false },
            { name: 'SalesEmailInd', readonly: false, disabled: true, required: false },
            { name: 'ManagerEmailInd', readonly: false, disabled: true, required: false },
            { name: 'OtherEmailInd', readonly: false, disabled: true, required: false },
            { name: 'OtherEmailAddress', readonly: false, disabled: true, required: false },
            { name: 'StatusSelect', readonly: false, disabled: true, required: false },
            { name: 'ValueInd' },
            { name: 'ReasonInd' },
            { name: 'RejectionInd' },
            { name: 'LanguageCode' },
            { name: 'UpdateableInd' },
            { name: 'OpenWONumber' },
            { name: 'PassWONumber' },
            { name: 'ValidStatuses' },
            { name: 'UpdateStatusCode' }
        ];
        this.uiDisplay = {
            trProspect: true,
            trLostBusiness: false,
            trLostBusinessDetail: false,
            trRejection: false,
            tdOtherEmailAddress: false,
            trEmail: false,
            btnSaveCancel: false,
            btnStatusUpdate: true
        };
        this.updateStatusResposeValue = {
            valueInd: '',
            reasonInd: '',
            rejectionInd: ''
        };
        this.ValidStatusesIndividual = [];
        this.pageId = PageIdentifier.ICABSSSOQUOTESTATUSMAINTENANCE;
    }
    QuoteStatusMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Advantage Quote Status Maintenance';
        this.parentMode = this.riExchange.getParentMode();
        this.screenNotReadyComponent = ScreenNotReadyComponent;
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
        this.window_onload();
        this.dlRejectionSearchComponent = DlRejectionSearchComponent;
    };
    QuoteStatusMaintenanceComponent.prototype.ngAfterViewInit = function () {
    };
    QuoteStatusMaintenanceComponent.prototype.window_onload = function () {
        if (this.parentMode === 'SOQuote') {
            this.uiDisplay.trProspect = true;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectName', this.riExchange.getParentHTMLValue('ProspectName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'QuoteNumber', this.riExchange.getParentHTMLValue('QuoteNumber'));
            this.dlContractRowId = this.riExchange.getParentHTMLValue('ReportParams');
        }
        else if (this.parentMode === 'Approval' || this.parentMode === 'Signature') {
            this.uiDisplay.trProspect = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProspectName', this.riExchange.GetParentHTMLInputElementAttribute('Misc', 'ContractName'));
            this.getUrlData();
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProspectNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProspectName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'QuoteNumber');
        this.loadservice();
    };
    QuoteStatusMaintenanceComponent.prototype.getUrlData = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            _this.dlContractRowId = _this.riExchange.getParentHTMLValue('ReportParams');
            if (params.hasOwnProperty('dlContractRowID')) {
                _this.dlContractRowId = params['dlContractRowID'];
            }
            if (params.hasOwnProperty('ContractName')) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProspectName', params['ContractName']);
            }
            if (params.hasOwnProperty('ContractTypeCode')) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProspectNumber', params['ContractTypeCode']);
            }
        });
    };
    QuoteStatusMaintenanceComponent.prototype.loadservice = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set('dlContractROWID', this.dlContractRowId);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams).subscribe(function (data) {
            if (data.errorMessage) {
                _this.messageModal.show({ msg: data.errorMessage, title: 'Message' }, false);
            }
            else {
                _this.rejectionCode = data.dlRejectionCode;
                _this.updateStatusResposeValue.valueInd = data.ValueInd;
                _this.updateStatusResposeValue.reasonInd = data.ReasonInd;
                _this.updateStatusResposeValue.rejectionInd = data.RejectionInd;
                _this.ShowHideFields();
                if (data['dlStatusCode'] !== '') {
                    var obj = { target: { value: data['dlStatusCode'] } };
                    _this.StatusSelect_OnChange(obj);
                }
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LostBusinessCode', data['LostBusinessCode']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LostBusinessDetailCode', data['LostBusinessDetailCode']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OpenWONumber', data['OpenWONumber']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ReasonInd', _this.utils.convertResponseValueToCheckboxInput(data['ReasonInd']));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'RejectionInd', _this.utils.convertResponseValueToCheckboxInput(data['RejectionInd']));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SMSMessage', data['SMSMessage']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'UpdateableInd', _this.utils.convertResponseValueToCheckboxInput(data['UpdateableInd']));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ValidStatuses', data['ValidStatuses']);
                _this.validStatuses = data['ValidStatuses'];
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ValueInd', _this.utils.convertResponseValueToCheckboxInput(data['ValueInd']));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dlContractRef', data['dlContractRef']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dlHistoryNarrative', data['dlHistoryNarrative']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dlRejectionCode', data['dlRejectionCode']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dlStatusCode', data['dlStatusCode']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dlStatusDesc', data['dlStatusDesc']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SalesEmailInd', data['SalesEmailInd']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ManagerEmailInd', data['ManagerEmailInd']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OtherEmailInd', data['OtherEmailInd']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'OtherEmailAddress', data['OtherEmailAddress']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'UpdateStatusCode', data['UpdateStatusCode']);
                if (data['dlRejectionCode'] === '') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dlRejectionDesc', '');
                }
                _this.doLookupformData();
                _this.BuildStatusSelect();
                _this.riMaintenance_BeforeUpdate();
                if (data['dlStatusCode'] === 'C' || data['dlStatusCode'] === 'E' || _this.parentMode === 'Approval') {
                    _this.selectedUpdateStatus = data['dlStatusCode'];
                    _this.isRejectionReason = true;
                }
                else {
                    _this.selectedUpdateStatus = 'none';
                    _this.isRejectionReason = false;
                }
            }
            _this.riExchange_CBORequest();
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    QuoteStatusMaintenanceComponent.prototype.doLookupformData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'dlStatus',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'dlStatusCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'dlStatusCode')
                },
                'fields': ['dlStatusDesc']
            },
            {
                'table': 'dlRejection',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'dlRejectionCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode')
                },
                'fields': ['dlRejectionDesc']
            },
            {
                'table': 'LostBusinessLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'LostBusinessCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessCode')
                },
                'fields': ['LostBusinessDesc']
            },
            {
                'table': 'LostBusinessDetailLang',
                'query': {
                    'BusinessCode': this.businessCode,
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'LostBusinessDetailCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode')
                },
                'fields': ['LostBusinessDetailDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            try {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dlRejectionDesc', data[1][0]['dlRejectionDesc']);
            }
            catch (e) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'dlRejectionDesc', '');
            }
            try {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LostBusinessDesc', data[2][0]['LostBusinessDesc']);
            }
            catch (e) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LostBusinessDesc', '');
            }
            try {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LostBusinessDetailDesc', data[3][0]['LostBusinessDetailDesc']);
            }
            catch (e) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LostBusinessDetailDesc', '');
            }
        });
    };
    QuoteStatusMaintenanceComponent.prototype.BuildStatusSelect = function () {
        this.ValidStatusesArray = this.validStatuses.split('|');
        for (var i = 0; i < this.ValidStatusesArray.length; i++) {
            this.ValidStatusesIndividualArray = this.ValidStatusesArray[i].split('%');
            this.ValidStatusesIndividual[i] = [];
            this.ValidStatusesIndividual[i][0] = this.ValidStatusesIndividualArray[0];
            this.ValidStatusesIndividual[i][1] = this.ValidStatusesIndividualArray[1];
            this.ValidStatusesIndividual[i][2] = this.ValidStatusesIndividualArray[2];
            if (this.ValidStatusesIndividualArray[2].toUpperCase().trim() === 'TRUE') {
                this.selectedItem = this.ValidStatusesIndividualArray[0];
            }
            this.isRejectionReason = false;
            this.uiDisplay.trLostBusinessDetail = false;
        }
    };
    QuoteStatusMaintenanceComponent.prototype.riMaintenance_AfterFetch = function () {
    };
    QuoteStatusMaintenanceComponent.prototype.enableDisableStatusRequiredFields = function (mode) {
        this.riExchange.riInputElement[mode](this.uiForm, 'SalesEmailInd');
        this.riExchange.riInputElement[mode](this.uiForm, 'ManagerEmailInd');
        this.riExchange.riInputElement[mode](this.uiForm, 'OtherEmailInd');
        this.riExchange.riInputElement[mode](this.uiForm, 'dlHistoryNarrative');
        this.riExchange.riInputElement[mode](this.uiForm, 'StatusSelect');
        this.riExchange.riInputElement[mode](this.uiForm, 'SMSMessage');
        this.riExchange.riInputElement[mode](this.uiForm, 'dlRejectionCode');
        this.riExchange.riInputElement[mode](this.uiForm, 'LostBusinessCode');
        this.riExchange.riInputElement[mode](this.uiForm, 'LostBusinessDetailCode');
    };
    QuoteStatusMaintenanceComponent.prototype.riMaintenance_BeforeUpdate = function () {
        this.riExchange.riInputElement.Disable(this.uiForm, 'SMSMessage');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SalesEmailInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ManagerEmailInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OtherEmailInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OtherEmailAddress');
        this.uiDisplay.tdOtherEmailAddress = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'OtherEmailAddress', '');
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', false);
    };
    QuoteStatusMaintenanceComponent.prototype.riMaintenance_AfterSaveAdd = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'OpenWONumber') !== '0') {
            this.promptTitle = 'SHOW';
            this.promptConfirmContent = 'An open WorkOrder exists. Do you want to close it now?';
            this.promptConfirmModal.show();
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PassWONumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'OpenWoNumber'));
        }
    };
    QuoteStatusMaintenanceComponent.prototype.promptSave = function (event) {
        this.saveData();
    };
    QuoteStatusMaintenanceComponent.prototype.riMaintenance_AfterSave = function () {
    };
    QuoteStatusMaintenanceComponent.prototype.riMaintenance_BeforeSaveAdd = function () {
        if (this.elem.nativeElement.querySelector('#LostBusinessCode') !== null) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessCode') === '') {
                this.elem.nativeElement.querySelector('#LostBusinessCode').classList.remove('ng-valid');
                this.elem.nativeElement.querySelector('#LostBusinessCode').classList.add('ng-invalid');
                this.elem.nativeElement.querySelector('#LostBusinessCode').style.borderColor = 'red';
            }
            else {
                this.elem.nativeElement.querySelector('#LostBusinessCode').style.borderColor = '#999';
            }
        }
        if (this.elem.nativeElement.querySelector('#LostBusinessDetailCode') !== null) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode') === '') {
                this.elem.nativeElement.querySelector('#LostBusinessDetailCode').classList.remove('ng-valid');
                this.elem.nativeElement.querySelector('#LostBusinessDetailCode').classList.add('ng-invalid');
                this.elem.nativeElement.querySelector('#LostBusinessDetailCode').style.borderColor = 'red';
            }
            else {
                this.elem.nativeElement.querySelector('#LostBusinessDetailCode').style.borderColor = '#999';
            }
        }
    };
    QuoteStatusMaintenanceComponent.prototype.onCancel = function () {
        this.currentMode = '';
        this.uiDisplay.btnStatusUpdate = true;
        this.uiDisplay.btnSaveCancel = false;
        this.uiDisplay.trEmail = false;
        this.enableDisableStatusRequiredFields('Disable');
        this.loadservice();
    };
    QuoteStatusMaintenanceComponent.prototype.riMaintenance_Search = function () {
    };
    QuoteStatusMaintenanceComponent.prototype.riExchange_CBORequest = function () {
        var _this = this;
        this.rejectionCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode');
        if (this.rejectionCode !== '') {
            this.ajaxSource.next(this.ajaxconstant.START);
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            searchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
            searchParams.set(this.serviceConstants.Action, '6');
            var bodyParams = {};
            bodyParams['Function'] = 'GetSMSMessage';
            bodyParams['dlContractROWID'] = this.dlContractRowId;
            bodyParams['dlRejectionCode'] = this.rejectionCode;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (data) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SMSMessage', data['SMSMessage']);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    QuoteStatusMaintenanceComponent.prototype.ShowHideFields = function () {
        if (this.updateStatusResposeValue.reasonInd === 'yes') {
            this.uiDisplay.trLostBusiness = true;
            this.uiDisplay.trLostBusinessDetail = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', true);
        }
        else {
            this.uiDisplay.trLostBusiness = false;
            this.uiDisplay.trLostBusinessDetail = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', false);
        }
        if (this.updateStatusResposeValue.rejectionInd === 'yes') {
            this.uiDisplay.trRejection = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'dlRejectionCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', true);
        }
        else {
            this.uiDisplay.trRejection = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'dlRejectionCode', false);
        }
    };
    QuoteStatusMaintenanceComponent.prototype.OtherEmailInd_OnClick = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'OtherEmailInd')) {
            this.uiDisplay.tdOtherEmailAddress = true;
            this.riExchange.riInputElement.Enable(this.uiForm, 'OtherEmailAddress');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', true);
        }
        else {
            this.uiDisplay.tdOtherEmailAddress = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OtherEmailAddress', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', false);
        }
    };
    QuoteStatusMaintenanceComponent.prototype.StatusSelect_OnChange = function (event) {
        var _this = this;
        this.selectedStatus = event.target.value;
        if (this.selectedStatus.toUpperCase() !== 'NONE') {
            this.ajaxSource.next(this.ajaxconstant.START);
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            searchParams.set(this.serviceConstants.Action, '6');
            var bodyParams = {};
            bodyParams['Function'] = 'GetStatus';
            bodyParams['dlStatusCode'] = this.selectedStatus;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (data) {
                _this.updateStatusResposeValue.valueInd = data.ValueInd;
                _this.updateStatusResposeValue.reasonInd = data.ReasonInd;
                _this.updateStatusResposeValue.rejectionInd = data.RejectionInd;
                _this.ShowHideFields();
                try {
                    _this.elem.nativeElement.querySelector('#dlRejectionCode').focus();
                }
                catch (e) {
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        if (this.selectedStatus === 'D') {
        }
        else {
            if (this.selectedStatus !== 'none') {
            }
        }
    };
    QuoteStatusMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    QuoteStatusMaintenanceComponent.prototype.onStatus = function () {
        this.currentMode = 'STATUS';
        this.uiDisplay.trEmail = true;
        this.uiDisplay.btnStatusUpdate = false;
        this.uiDisplay.btnSaveCancel = true;
        this.riExchange.riInputElement.Enable(this.uiForm, 'SMSMessage');
        this.enableDisableStatusRequiredFields('Enable');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlHistoryNarrative', '');
    };
    QuoteStatusMaintenanceComponent.prototype.saveData = function () {
        this.isSaveCancelDisabled = true;
        if (this.currentMode === 'UPDATE') {
            this.saveUpdateData();
        }
        else if (this.currentMode === 'STATUS') {
            this.saveStatusData();
        }
    };
    QuoteStatusMaintenanceComponent.prototype.saveUpdateData = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        searchParams.set(this.serviceConstants.Action, '2');
        var bodyParams = {};
        bodyParams['dlStatusCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlStatusCode');
        bodyParams['dlRejectionCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode');
        bodyParams['dlContractRef'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContractRef');
        bodyParams['LostBusinessCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessCode');
        bodyParams['LostBusinessDetailCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode');
        bodyParams['SMSMessage'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SMSMessage');
        bodyParams['dlHistoryNarrative'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlHistoryNarrative');
        bodyParams['ValueInd'] = this.updateStatusResposeValue.valueInd;
        bodyParams['ReasonInd'] = this.updateStatusResposeValue.reasonInd;
        bodyParams['RejectionInd'] = this.updateStatusResposeValue.rejectionInd;
        bodyParams['SalesEmailInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesEmailInd');
        bodyParams['ManagerEmailInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ManagerEmailInd');
        bodyParams['OtherEmailInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OtherEmailInd');
        bodyParams['OtherEmailAddress'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OtherEmailAddress');
        bodyParams['UpdateableInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'UpdateableInd');
        bodyParams['OpenWONumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OpenWONumber');
        bodyParams['ValidStatuses'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ValidStatuses');
        bodyParams['UpdateStatusCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'UpdateStatusCode');
        bodyParams['dlContractROWID'] = this.dlContractRowId;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (e) {
            if (e.errorMessage && e.errorMessage !== '') {
                _this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.riMaintenance_AfterSaveAdd();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        this.isSaveCancelDisabled = false;
    };
    QuoteStatusMaintenanceComponent.prototype.onSaveData = function () {
        this.riMaintenance_BeforeSaveAdd();
        if (document.querySelectorAll('.ng-invalid').length < 2) {
            this.promptTitle = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    };
    QuoteStatusMaintenanceComponent.prototype.savestatusfunction = function () {
        this.riMaintenance_BeforeSaveAdd();
        this.confirmdata.msg = MessageConstant.Message.ConfirmRecord;
    };
    QuoteStatusMaintenanceComponent.prototype.onUpdate = function () {
        this.currentMode = 'UPDATE';
        this.uiDisplay.btnStatusUpdate = false;
        this.uiDisplay.btnSaveCancel = true;
        this.enableDisableUpdateRequiredFields('Enable');
    };
    QuoteStatusMaintenanceComponent.prototype.enableDisableUpdateRequiredFields = function (mode) {
        this.riExchange.riInputElement[mode](this.uiForm, 'dlHistoryNarrative');
    };
    QuoteStatusMaintenanceComponent.prototype.saveStatusData = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.selectedStatus = this.selectedItem;
        var searchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        searchParams.set(this.serviceConstants.Action, '1');
        var bodyParams = {};
        bodyParams['dlStatusCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlStatusCode');
        bodyParams['dlRejectionCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlRejectionCode');
        bodyParams['dlContractRef'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContractRef');
        bodyParams['LostBusinessCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessCode');
        bodyParams['LostBusinessDetailCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDetailCode');
        bodyParams['SMSMessage'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SMSMessage');
        bodyParams['dlHistoryNarrative'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlHistoryNarrative');
        bodyParams['ValueInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ValueInd');
        bodyParams['ReasonInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ReasonInd');
        bodyParams['RejectionInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'RejectionInd');
        bodyParams['SalesEmailInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesEmailInd');
        bodyParams['ManagerEmailInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ManagerEmailInd');
        bodyParams['OtherEmailInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OtherEmailInd');
        bodyParams['OtherEmailAddress'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OtherEmailAddress');
        bodyParams['UpdateableInd'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'UpdateableInd');
        bodyParams['OpenWONumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'OpenWONumber');
        bodyParams['ValidStatuses'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ValidStatuses');
        bodyParams['UpdateStatusCode'] = this.selectedStatus;
        bodyParams['dlContractRowID'] = this.dlContractRowId;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(function (e) {
            if (e.errorMessage && e.errorMessage !== '') {
                _this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
        this.riMaintenance_AfterSaveAdd();
        this.isSaveCancelDisabled = false;
    };
    QuoteStatusMaintenanceComponent.prototype.onRejectionReasonFromEllipsis = function (data) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlRejectionCode', data.dlRejectionCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlRejectionDesc', data.dlRejectionDesc);
        this.riExchange_CBORequest();
    };
    QuoteStatusMaintenanceComponent.prototype.checkIfValid = function (target) {
        if (target.value === '') {
            target.classList.remove('ng-valid');
            target.classList.add('ng-invalid');
        }
        else {
            target.style.borderColor = '#999';
            target.classList.add('ng-valid');
            target.classList.remove('ng-invalid');
        }
    };
    QuoteStatusMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSSOQuoteStatusMaintenance.html'
                },] },
    ];
    QuoteStatusMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: ActivatedRoute, },
        { type: ElementRef, },
    ];
    QuoteStatusMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
    };
    return QuoteStatusMaintenanceComponent;
}(BaseComponent));
