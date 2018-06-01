var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GroupAccountNumberComponent } from './../../../app/internal/search/iCABSSGroupAccountNumberSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContactActionTypes } from './../../actions/contact';
export var GroupAccountMaintenanceComponent = (function (_super) {
    __extends(GroupAccountMaintenanceComponent, _super);
    function GroupAccountMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.accountEllipsisFlag = false;
        this.controls = [
            { name: 'GroupAccountNumber', disabled: false, readonly: false },
            { name: 'GroupName', required: true },
            { name: 'GroupAgreementNumber' },
            { name: 'GroupContactName' },
            { name: 'GroupContactPosition' },
            { name: 'GroupContactDepartment' },
            { name: 'GroupContactTelephone' },
            { name: 'GroupContactMobile' },
            { name: 'GroupContactEMail' },
            { name: 'GroupContactFax' },
            { name: 'GroupAccountPhotoRequiredInd' },
            { name: 'PurchaseOrderNoRequiredInd' },
            { name: 'WindowClosingName' },
            { name: 'AgreementDateDisplay' }
        ];
        this.queryParams = {
            operation: 'System/iCABSSGroupAccountMaintenance',
            module: 'group-account',
            method: 'contract-management/maintenance'
        };
        this.showCloseButton = true;
        this.isRequesting = false;
        this.showMessageHeader = true;
        this.dateReadOnly = true;
        this.columns = new Array();
        this.itemsPerPage = '10';
        this.page = '1';
        this.showHeader = true;
        this.searchModalRoute = '';
        this.searchPageRoute = '';
        this.groupAccountNumberSearchParams = {
            'parentMode': 'Search',
            'showAddNew': true
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.autoOpenSearch = false;
        this.groupAccountSearchComponent = GroupAccountNumberComponent;
        this.pageId = PageIdentifier.ICABSSGROUPACCOUNTMAINTENANCE;
    }
    GroupAccountMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.isReturning()) {
            this.pageParams.mode = 'UPDATE/DELETE';
            this.dateReadOnly = false;
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
            this.populateUIFromFormData();
            var dateTemp = this.getControlValue('AgreementDateDisplay').split('/');
            this.AgreementDate = new Date(dateTemp[2], dateTemp[1] - 1, dateTemp[0]);
        }
        else {
            this.pageParams.mode = 'ADD NEW';
            this.window_onload();
        }
        this.getSysCharDtetails();
        this.callLookupData();
    };
    GroupAccountMaintenanceComponent.prototype.ngAfterViewInit = function () {
        if (this.isReturning()) {
            this.pageParams.mode = 'UPDATE/DELETE';
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
            this.populateUIFromFormData();
            this.onGroupAccountNumberChange({});
        }
        else {
            this.pageParams.mode = 'ADD NEW';
            this.autoOpenSearch = true;
        }
    };
    GroupAccountMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    GroupAccountMaintenanceComponent.prototype.window_onload = function () {
        this.accountEllipsisFlag = false;
        this.sensitiseContactDetails(false);
        this.getStoreSubscriptionData();
        if (this.AgreementDate) {
            this.FieldDateDisplayed = this.utils.formatDate(this.AgreementDate);
        }
        this.pageParams.mode = '';
        this.pageParams.tdAmendContact = false;
    };
    GroupAccountMaintenanceComponent.prototype.getStoreSubscriptionData = function () {
        var _this = this;
        this.storeSubscription = this.store.select('contact').subscribe(function (data) {
            switch (data['action']) {
                case ContactActionTypes.SAVE_PARAMS:
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'WindowClosingName', data.data);
                    if (_this.uiForm.controls['WindowClosingName'].value === 'AmendmentsMade') {
                        _this.refreshGroupAccountOnContactPersonMaintanenceReturn();
                    }
                    break;
            }
        });
    };
    GroupAccountMaintenanceComponent.prototype.callLookupData = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'riRegistry',
                'query': {
                    'RegSection': 'Contact Person'
                },
                'fields': ['RegSection']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0] && data[0][0].RegSection) {
                _this.pageParams.vSCMultiContactInd = true;
            }
            else {
                _this.pageParams.vSCMultiContactInd = false;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMaintenanceComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact,
            this.sysCharConstants.SystemCharUseVisitTolerances,
            this.sysCharConstants.SystemCharUseInfestationTolerances
        ];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vSCCapitalFirstLtr = record[0]['Required'];
            _this.pageParams.vSCVisitTolerances = record[1]['Required'];
            _this.pageParams.vSCInfestationTolerances = record[2]['Required'];
        });
    };
    GroupAccountMaintenanceComponent.prototype.onGroupAccountDataReceived = function (data, route) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAccountNumber', data.GroupAccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupName', data.GroupName);
        this.pageParams.GroupAccountNumber = data.GroupAccountNumber;
        if (this.uiForm.controls['GroupAccountNumber'].value && this.uiForm.controls['GroupName'].value) {
            this.pageParams.mode = 'UPDATE/DELETE';
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
            this.getDataForGroupAccountNumber(this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'));
            this.sensitiseContactDetails(true);
            this.accountEllipsisFlag = false;
            this.setFormMode(this.c_s_MODE_UPDATE);
        }
        else {
            this.pageParams.mode = 'ADD NEW';
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
            this.accountEllipsisFlag = true;
            this.setFormMode(this.c_s_MODE_ADD);
        }
    };
    GroupAccountMaintenanceComponent.prototype.getDataForGroupAccountNumber = function (grpAccNo) {
        var _this = this;
        var searchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('GroupAccountNumber', grpAccNo);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams)
            .subscribe(function (data) {
            _this.afterFetch();
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupName', data.GroupName);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupAgreementNumber', data.GroupAgreementNumber);
            if (data.GroupAgreementDate) {
                _this.AgreementDate = new Date(data.GroupAgreementDate);
                _this.setControlValue('AgreementDateDisplay', data.GroupAgreementDate);
            }
            else {
                setTimeout(function () {
                    _this.AgreementDate = null;
                }, 100);
            }
            _this.pageParams.ttGroupAccount = data.ttGroupAccount;
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactName', data.GroupContactName);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactPosition', data.GroupContactPosition);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactDepartment', data.GroupContactDepartment);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactTelephone', data.GroupContactTelephone);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactMobile', data.GroupContactMobile);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactTelephone', data.GroupContactTelephone);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactEMail', data.GroupContactEMail);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactFax', data.GroupContactFax);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupAccountPhotoRequiredInd', data.GroupAccountPhotoRequiredInd);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PurchaseOrderNoRequiredInd', data.PurchaseOrderNoRequiredInd);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.pageParams.mode = 'UPDATE/DELETE';
            _this.riExchange.riInputElement.Disable(_this.uiForm, 'GroupAccountNumber');
            _this.sensitiseContactDetails(true);
            _this.accountEllipsisFlag = false;
            _this.setFormMode(_this.c_s_MODE_UPDATE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMaintenanceComponent.prototype.toTitleCase = function (control) {
        if (control === 'GroupContactName' && !this.pageParams.vSCCapitalFirstLtr) {
            this.uiForm.controls[control].setValue(this.utils.toTitleCase(this.uiForm.controls[control].value));
        }
        else {
            this.uiForm.controls[control].setValue(this.utils.toTitleCase(this.uiForm.controls[control].value));
        }
    };
    GroupAccountMaintenanceComponent.prototype.dateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.setControlValue('AgreementDateDisplay', value.value);
            this.FieldDateDisplayed = value.value;
        }
        else {
            this.setControlValue('AgreementDateDisplay', '');
            this.FieldDateDisplayed = '';
        }
    };
    GroupAccountMaintenanceComponent.prototype.saveClicked = function () {
        if (this.uiForm.valid && this.uiForm.controls['GroupAccountNumber'].value) {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
        else if (!this.uiForm.controls['GroupAccountNumber'].value) {
            this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
        }
        if (!this.uiForm.controls['GroupName'].value || this.uiForm.controls['GroupName'].value === '') {
            this.GroupName.nativeElement.focus();
            this.savebutton.nativeElement.focus();
        }
        if (this.pageParams.mode === 'ADD NEW' && (!this.uiForm.controls['GroupContactName'].value || this.uiForm.controls['GroupContactName'].value === '')) {
            this.GroupContactName.nativeElement.focus();
            this.GroupName.nativeElement.focus();
        }
        if (this.pageParams.mode === 'ADD NEW' && (!this.uiForm.controls['GroupContactPosition'].value || this.uiForm.controls['GroupContactPosition'].value === '')) {
            this.GroupContactPosition.nativeElement.focus();
            this.GroupName.nativeElement.focus();
        }
        if (this.pageParams.mode === 'ADD NEW' && (!this.uiForm.controls['GroupContactTelephone'].value || this.uiForm.controls['GroupContactTelephone'].value === '')) {
            this.GroupContactTelephone.nativeElement.focus();
            this.GroupName.nativeElement.focus();
        }
    };
    GroupAccountMaintenanceComponent.prototype.deleteClicked = function () {
        if (this.uiForm.valid && this.uiForm.controls['GroupAccountNumber'].value) {
            this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
            this.promptConfirmModalDelete.show();
        }
        else {
            this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
        }
    };
    GroupAccountMaintenanceComponent.prototype.cancelClicked = function () {
        this.formPristine();
        this.setFormMode(this.c_s_MODE_SELECT);
        this.AgreementDate = void 0;
        this.FieldDateDisplayed = '';
        this.accountEllipsisFlag = false;
        if (this.pageParams.mode === 'UPDATE/DELETE') {
            this.getDataForGroupAccountNumber(this.pageParams.GroupAccountNumber);
        }
        else if (this.pageParams.mode === 'ADD NEW') {
            this.autoOpenSearch = true;
            this.resetForm();
        }
        else {
            return;
        }
    };
    GroupAccountMaintenanceComponent.prototype.resetForm = function () {
        this.setControlValue('AgreementDateDisplay', '');
        this.AgreementDate = null;
        this.FieldDateDisplayed = '';
        if (this.pageParams.mode === 'UPDATE/DELETE') {
            this.AgreementDate = void 0;
        }
        else {
            this.AgreementDate = null;
        }
        this.sensitiseContactDetails(false);
        this.pageParams.tdAmendContact = false;
        this.uiForm.reset();
    };
    GroupAccountMaintenanceComponent.prototype.updateGroupAccountDetails = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        var postParams = {};
        postParams.GroupAccountNumber = this.uiForm.controls['GroupAccountNumber'].value;
        postParams.GroupName = this.uiForm.controls['GroupName'].value;
        postParams.GroupAgreementNumber = this.uiForm.controls['GroupAgreementNumber'].value ? this.uiForm.controls['GroupAgreementNumber'].value : '';
        postParams.GroupAgreementDate = this.FieldDateDisplayed;
        postParams.GroupAccountPhotoRequiredInd = this.uiForm.controls['GroupAccountPhotoRequiredInd'].value;
        postParams.PurchaseOrderNoRequiredInd = this.uiForm.controls['PurchaseOrderNoRequiredInd'].value;
        postParams.GroupContactName = this.uiForm.controls['GroupContactName'].value;
        postParams.GroupContactPosition = this.uiForm.controls['GroupContactPosition'].value;
        postParams.GroupContactDepartment = this.uiForm.controls['GroupContactDepartment'].value ? this.uiForm.controls['GroupContactDepartment'].value : '';
        postParams.GroupContactTelephone = this.uiForm.controls['GroupContactTelephone'].value ? this.uiForm.controls['GroupContactTelephone'].value : '';
        postParams.GroupContactMobile = this.uiForm.controls['GroupContactMobile'].value ? this.uiForm.controls['GroupContactMobile'].value : '';
        postParams.GroupContactEMail = this.uiForm.controls['GroupContactEMail'].value ? this.uiForm.controls['GroupContactEMail'].value : '';
        postParams.GroupContactFax = this.uiForm.controls['GroupContactFax'].value ? this.uiForm.controls['GroupContactFax'].value : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.afterSave();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMaintenanceComponent.prototype.saveGroupAccountNewRecord = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '1');
        var postParams = {};
        postParams.GroupAccountNumber = this.uiForm.controls['GroupAccountNumber'].value;
        postParams.GroupName = this.uiForm.controls['GroupName'].value;
        postParams.GroupAgreementNumber = this.uiForm.controls['GroupAgreementNumber'].value ? this.uiForm.controls['GroupAgreementNumber'].value : '';
        postParams.GroupAgreementDate = this.FieldDateDisplayed;
        postParams.GroupAccountPhotoRequiredInd = this.uiForm.controls['GroupAccountPhotoRequiredInd'].value;
        postParams.PurchaseOrderNoRequiredInd = this.uiForm.controls['PurchaseOrderNoRequiredInd'].value;
        postParams.GroupContactName = this.uiForm.controls['GroupContactName'].value;
        postParams.GroupContactPosition = this.uiForm.controls['GroupContactPosition'].value;
        postParams.GroupContactDepartment = this.uiForm.controls['GroupContactDepartment'].value ? this.uiForm.controls['GroupContactDepartment'].value : '';
        postParams.GroupContactTelephone = this.uiForm.controls['GroupContactTelephone'].value ? this.uiForm.controls['GroupContactTelephone'].value : '';
        postParams.GroupContactMobile = this.uiForm.controls['GroupContactMobile'].value ? this.uiForm.controls['GroupContactMobile'].value : '';
        postParams.GroupContactEMail = this.uiForm.controls['GroupContactEMail'].value ? this.uiForm.controls['GroupContactEMail'].value : '';
        postParams.GroupContactFax = this.uiForm.controls['GroupContactFax'].value ? this.uiForm.controls['GroupContactFax'].value : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.pageParams.GroupAccountNumber = _this.uiForm.controls['GroupAccountNumber'].value;
                    _this.afterSave();
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMaintenanceComponent.prototype.deleteGroupAccount = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '3');
        var postParams = {};
        postParams.GroupAccountNumber = this.uiForm.controls['GroupAccountNumber'].value;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.pageParams.mode = 'ADD NEW';
                    setTimeout(function () {
                        _this.AgreementDate = void 0;
                    }, 100);
                    _this.resetForm();
                    _this.messageModal.show({ msg: MessageConstant.Message.RecordDeletedSuccessfully, title: 'Message' }, false);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMaintenanceComponent.prototype.addNewGroupAccountNumber = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        var postParams = {};
        postParams.Function = 'NextGroupAccount';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupAccountNumber', e.NextGroupAccountNumber);
                    _this.pageParams.mode = 'ADD NEW';
                    _this.sensitiseContactDetails(true);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMaintenanceComponent.prototype.promptConfirm = function (type) {
        this.accountEllipsisFlag = false;
        switch (this.pageParams.mode) {
            case 'UPDATE/DELETE':
                if (type === 'save') {
                    this.beforeUpdate();
                    this.updateGroupAccountDetails();
                }
                else {
                    this.deleteGroupAccount();
                }
                break;
            case 'ADD NEW':
                this.autoOpenSearch = false;
                this.pageParams.mode = 'UPDATE/DELETE';
                this.saveGroupAccountNewRecord();
                break;
            default:
        }
    };
    GroupAccountMaintenanceComponent.prototype.btnAddOnClick = function (add) {
        var _this = this;
        this.setFormMode(this.c_s_MODE_ADD);
        setTimeout(function () {
            _this.accountEllipsisFlag = true;
        }, 200);
        this.beforeAdd();
        this.addNewGroupAccountNumber();
    };
    GroupAccountMaintenanceComponent.prototype.menuOnchange = function (menu) {
        this.MenuOption = 'values';
        if (this.pageParams.mode === 'UPDATE/DELETE') {
        }
        else {
        }
        switch (menu) {
            case 'Group Account Move':
                this.navigate('GroupAccountMove', this.ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMOVE);
                break;
            case 'Group Account Details':
                this.navigate('Lookup', '/application/accountgroupsearch', {
                    parentMode: 'Lookup',
                    GroupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
                    GroupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
                });
                break;
            case 'Customer Information':
                this.cmdCustomerInfo_onclick();
                break;
            case 'contacts':
                if (this.uiForm.controls['GroupAccountNumber'].value && this.pageParams.mode !== 'ADD NEW') {
                    this.cmdContactDetails();
                }
                if (this.pageParams.mode === 'ADD NEW') {
                    this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
                }
                else if (this.pageParams.mode === '') {
                    this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
                }
                break;
            case 'VisitTolerances':
                if (this.uiForm.controls['GroupAccountNumber'].value && this.pageParams.mode !== 'ADD NEW') {
                    this.navigate('GroupAccountVisitTolerance', '/grid/application/visittolerancegrid', {
                        parentMode: 'GroupAccountVisitTolerance',
                        GroupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
                        GroupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
                    });
                }
                if (this.pageParams.mode === 'ADD NEW') {
                    this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
                }
                else if (this.pageParams.mode === '') {
                    this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
                }
                break;
            case 'InfestationTolerances':
                if (this.uiForm.controls['GroupAccountNumber'].value && this.pageParams.mode !== 'ADD NEW') {
                    this.navigate('GroupAccountInfestationTolerance', '/grid/contractmanagement/account/infestationToleranceGrid', {
                        parentMode: 'GroupAccountInfestationTolerance',
                        GroupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
                        GroupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
                    });
                }
                if (this.pageParams.mode === 'ADD NEW') {
                    this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
                }
                else if (this.pageParams.mode === '') {
                    this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
                }
                break;
            case 'GroupAccountPriceGroup':
                if (this.uiForm.controls['GroupAccountNumber'].value && this.pageParams.mode !== 'ADD NEW') {
                    this.errorModal.show({ msg: 'Page under development', title: 'Error' }, false);
                }
                if (this.pageParams.mode === 'ADD NEW') {
                    this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
                }
                else if (this.pageParams.mode === '') {
                    this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
                }
                break;
            case 'GroupAccountProductImport':
                this.errorModal.show({ msg: 'Page under development', title: 'Error' }, false);
                break;
            default:
                break;
        }
    };
    GroupAccountMaintenanceComponent.prototype.cmdCustomerInfo_onclick = function () {
        if (this.pageParams.mode !== 'ADD NEW') {
            this.navigate('GroupAccount', '/grid/maintenance/contract/customerinformation', {
                parentMode: 'GroupAccount',
                groupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
                groupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
            });
        }
        if (this.pageParams.mode === 'ADD NEW') {
            this.errorModal.show({ msg: 'Request Restricted, Return To Normal Mode First', title: 'Error' }, false);
        }
        else if (this.pageParams.mode === '') {
            this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected, title: 'Error' }, false);
        }
    };
    GroupAccountMaintenanceComponent.prototype.cmdContactDetails = function () {
        this.navigate('GroupAccount', '/application/ContactPersonMaintenance', {
            parentMode: 'GroupAccount',
            groupAccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'),
            groupName: this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName')
        });
    };
    GroupAccountMaintenanceComponent.prototype.onKeyDown = function (event) {
    };
    GroupAccountMaintenanceComponent.prototype.onGroupAccountNumberChange = function (event) {
        if (this.uiForm.controls['GroupAccountNumber'].value) {
            this.getDataForGroupAccountNumber(this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber'));
        }
    };
    GroupAccountMaintenanceComponent.prototype.btnAmendContact_OnClick = function () {
        this.cmdContactDetails();
    };
    GroupAccountMaintenanceComponent.prototype.beforeAdd = function () {
        this.resetForm();
        this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountNumber');
        this.GroupName.nativeElement.focus();
        this.pageParams.tdAmendContact = false;
        this.sensitiseContactDetails(true);
        this.GroupName.nativeElement.focus();
    };
    GroupAccountMaintenanceComponent.prototype.beforeUpdate = function () {
        if (this.pageParams.vSCMultiContactInd) {
            this.pageParams.tdAmendContact = true;
        }
    };
    GroupAccountMaintenanceComponent.prototype.afterSave = function () {
        if (this.pageParams.vSCMultiContactInd) {
            this.pageParams.tdAmendContact = true;
        }
        this.formPristine();
        this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
    };
    GroupAccountMaintenanceComponent.prototype.afterFetch = function () {
        if (this.pageParams.vSCMultiContactInd) {
            this.pageParams.tdAmendContact = true;
        }
    };
    GroupAccountMaintenanceComponent.prototype.sensitiseContactDetails = function (lSensitise) {
        if (lSensitise) {
            this.dateReadOnly = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupName');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupAgreementNumber');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AgreementDate');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactName');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactPosition');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactDepartment');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactMobile');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactEMail');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactTelephone');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupContactFax');
            this.riExchange.riInputElement.Enable(this.uiForm, 'GroupAccountPhotoRequiredInd');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PurchaseOrderNoRequiredInd');
            if (this.pageParams.mode === 'ADD NEW') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactName', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactPosition', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactTelephone', true);
            }
            else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactName', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactPosition', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactTelephone', false);
            }
        }
        else {
            this.dateReadOnly = true;
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAgreementNumber');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AgreementDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactPosition');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactDepartment');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactMobile');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactEMail');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactTelephone');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupContactFax');
            this.riExchange.riInputElement.Disable(this.uiForm, 'GroupAccountPhotoRequiredInd');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PurchaseOrderNoRequiredInd');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactName', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactEmail', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactPosition', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'GroupContactTelephone', false);
        }
    };
    GroupAccountMaintenanceComponent.prototype.refreshGroupAccountOnContactPersonMaintanenceReturn = function () {
        var _this = this;
        var postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        var postParams = {};
        postParams.GroupAccountNumber = this.uiForm.controls['GroupAccountNumber'].value;
        postParams.Function = 'GetContactPersonChanges';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(new Error(e['errorMessage']));
                }
                else {
                    if (e.ContactPersonFound === 'Y') {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactName', e.ContactPersonName);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactPosition', e.ContactPersonPosition);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactDepartment', e.ContactPersonDepartment);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactTelephone', e.ContactPersonTelephone);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactMobile', e.ContactPersonMobile);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactTelephone', e.GroupContactTelephone);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactEMail', e.ContactPersonEmail);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'GroupContactFax', e.ContactPersonFax);
                    }
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GroupAccountMaintenanceComponent.prototype.resetOnRoutCancel = function () {
        this.MenuOption = '';
    };
    GroupAccountMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSGroupAccountMaintenance.html'
                },] },
    ];
    GroupAccountMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    GroupAccountMaintenanceComponent.propDecorators = {
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'promptConfirmModalDelete': [{ type: ViewChild, args: ['promptConfirmModalDelete',] },],
        'GroupName': [{ type: ViewChild, args: ['GroupName',] },],
        'GroupContactName': [{ type: ViewChild, args: ['GroupContactName',] },],
        'GroupContactPosition': [{ type: ViewChild, args: ['GroupContactPosition',] },],
        'GroupContactTelephone': [{ type: ViewChild, args: ['GroupContactTelephone',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'savebutton': [{ type: ViewChild, args: ['savebutton',] },],
    };
    return GroupAccountMaintenanceComponent;
}(BaseComponent));
