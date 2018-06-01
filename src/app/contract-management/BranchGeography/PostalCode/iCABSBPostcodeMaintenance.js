var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PostCodeSearchComponent } from './../../../internal/search/iCABSBPostcodeSearch.component';
import { SalesAreaSearchComponent } from './../../../internal/search/iCABSBSalesAreaSearch.component';
export var PostcodeMaintenanceComponent = (function (_super) {
    __extends(PostcodeMaintenanceComponent, _super);
    function PostcodeMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.queryParams = {
            operation: 'Business/iCABSBPostcodeMaintenance',
            module: 'contract-admin',
            method: 'contract-management/admin',
            ActionSearch: '0',
            Actionupdate: '6',
            ActionEdit: '2',
            ActionDelete: '3',
            ActionInsert: '1'
        };
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.showPromptHeader = true;
        this.routePageParams = {
            'parentMode': '',
            'currentContractType': '',
            'CurrentContractTypeURLParameter': ''
        };
        this.routeParams = {};
        this.postData = {};
        this.trInformation = false;
        this.IsDeleteEnable = false;
        this.search = new URLSearchParams();
        this.controls = [
            { name: 'Postcode', readonly: true, disabled: false, required: true },
            { name: 'Town', readonly: true, disabled: true, required: false },
            { name: 'State', readonly: true, disabled: true, required: false },
            { name: 'SalesAreaCode', readonly: true, disabled: true, required: true },
            { name: 'SalesAreaDesc', readonly: true, disabled: true, required: false },
            { name: 'save', readonly: true, disabled: true, required: false },
            { name: 'cancel', readonly: true, disabled: true, required: false },
            { name: 'delete', readonly: true, disabled: false, required: false }
        ];
        this.ellipsis = {
            postCodeSearch: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                showAddNew: true,
                autoOpenSearch: false,
                setFocus: false,
                parentMode: 'LookUp-Service',
                PostCode: this.formData.Postcode,
                State: this.formData.State,
                Town: this.formData.Town,
                BranchNumber: this.utils.getBranchCode(),
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                component: PostCodeSearchComponent
            },
            salesAreaCode: {
                autoOpenSearch: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-Postcode',
                    'currentContractType': 'C',
                    'currentContractTypeURLParameter': '<contract>',
                    'showAddNew': true,
                    'SalesAreaCode': '',
                    'ServiceBranchNumber': ''
                },
                contentComponent: SalesAreaSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: true
            }
        };
        this.dropdown = {
            servicebranch: {
                params: {
                    'parentMode': 'LookUp-PostcodeServBranch'
                },
                active: {
                    id: '',
                    text: ''
                },
                disabled: true,
                required: true,
                isError: true
            },
            salesbranch: {
                params: {
                    'parentMode': 'LookUp-PostcodeSalesBranch'
                },
                active: {
                    id: '',
                    text: ''
                },
                disabled: true,
                required: true,
                isError: true
            },
            RegulatoryAuthorityNumber: {
                params: {
                    'parentMode': 'LookUp'
                },
                active: {
                    id: '',
                    text: ''
                },
                disabled: true,
                required: false,
                isError: true
            }
        };
        this.pageId = PageIdentifier.ICABSBPOSTCODEMAINTENANCE;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
    }
    PostcodeMaintenanceComponent.prototype.getURLQueryParameters = function (param) {
        this.pageParams.ParentMode = param['parentMode'];
    };
    PostcodeMaintenanceComponent.prototype.setCurrentContractType = function () {
        this.routePageParams.currentContractType =
            this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.routePageParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.routePageParams.currentContractType);
    };
    PostcodeMaintenanceComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    PostcodeMaintenanceComponent.prototype.setTimeToMinutes = function () {
        var today = new Date(), h = today.getHours(), m = today.getMinutes(), s = today.getSeconds();
        var setTime = (Number(h) * 60) + Number(m);
        return setTime.toString();
    };
    PostcodeMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.getSysCharDtetails();
        this.window_onload();
    };
    PostcodeMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PostcodeMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.PostCodeSearchEllipsis.openModal();
    };
    PostcodeMaintenanceComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableRegulatoryAuthority
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
            _this.pageParams.vEnableRegulatoryAuthority = record[0]['Required'];
            _this.pageParams.vBusinessCode = record[0]['BusinessCode'];
            _this.pageParams.vSystemCharNumber = record[0]['SystemCharNumber'];
            _this.logger.log('Syschar Data ----', record);
            if (record[0]['Required']) {
                _this.trRegulatoryAuthorityNumber = true;
            }
            else {
                _this.trRegulatoryAuthorityNumber = false;
            }
        }, function (error) {
            _this.errorService.emitError(error);
        }, function () {
            _this.logger.log('Syschar onComplete');
        });
    };
    PostcodeMaintenanceComponent.prototype.window_onload = function () {
        this.routeParams = this.riExchange.getRouterParams();
        this.pageTitle = 'Postcode Maintenance';
        this.riExchange.riInputElement.ReadOnly(this.uiForm, 'Town', true);
        this.riExchange.riInputElement.ReadOnly(this.uiForm, 'State', true);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode')) {
            this.PostCodeSearchEllipsis.openModal();
        }
    };
    PostcodeMaintenanceComponent.prototype.setEllipsisReturnData = function (data) {
        if (data.Postcode) {
            this.mode = 'UPDATE';
            this.formData.Postcode = data.Postcode;
            this.formData.State = data.State;
            this.formData.Town = data.Town;
            this.ellipsis.postCodeSearch.PostCode = this.formData.Postcode;
            this.ellipsis.postCodeSearch.State = this.formData.State;
            this.ellipsis.postCodeSearch.Town = this.formData.Town;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Postcode', this.formData.Postcode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Town', this.formData.Town);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'State', this.formData.State);
            this.riExchange.riInputElement.Disable(this.uiForm, 'Town');
            this.riExchange.riInputElement.Disable(this.uiForm, 'State');
            this.PostCodeSearchOnchange('');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Postcode', '');
        }
    };
    PostcodeMaintenanceComponent.prototype.getModalinfo = function (e) {
        this.ellipsis.postCodeSearch.autoOpenSearch = false;
        this.ellipsis.postCodeSearch.parentMode = 'LookUp-Service';
        this.ellipsis.salesAreaCode.childConfigParams.SalesAreaCode = this.formData.SalesAreaCode;
        this.ellipsis.salesAreaCode.childConfigParams.ServiceBranchNumber = this.formData.ServiceBranchNumber;
    };
    PostcodeMaintenanceComponent.prototype.PostCodeSearchOnchange = function (f) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        if (f === 'FindUniqueRecord') {
            query.set(this.serviceConstants.Action, this.queryParams.Actionupdate);
            query.set('Function', 'FindUniqueRecord');
            query.set('Postcode', this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode'));
            query.set('State', this.riExchange.riInputElement.GetValue(this.uiForm, 'State'));
            query.set('Town', this.riExchange.riInputElement.GetValue(this.uiForm, 'Town'));
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
                .subscribe(function (data) {
                if (data.status === 'failure') {
                    _this.errorService.emitError(data.info);
                }
                else {
                    if (data.UniqueRecordFound) {
                        if (_this.riExchange.riInputElement.HasChanged(_this.uiForm, 'Postcode') && (_this.setModeEnable !== 'ADD')) {
                            _this.PostCodeSearchEllipsis.openModal();
                            _this.ellipsis.postCodeSearch.PostCode = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Postcode');
                            _this.ellipsis.postCodeSearch.BranchNumber = _this.utils.getBranchCode();
                            _this.ellipsis.postCodeSearch.parentMode = 'LookUp-Service';
                        }
                        else {
                            _this.ellipsis.postCodeSearch.autoOpenSearch = false;
                        }
                    }
                    else if (data.ErrorMessageDesc) {
                        _this.messageTitle = data.ErrorMessageDesc;
                        _this.messageModal.show();
                    }
                }
            }, function (error) {
                _this.errorService.emitError('Record not found');
            });
        }
        else {
            query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
            query.set('Postcode', this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode'));
            query.set('State', this.riExchange.riInputElement.GetValue(this.uiForm, 'State'));
            query.set('Town', this.riExchange.riInputElement.GetValue(this.uiForm, 'Town'));
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query)
                .subscribe(function (data) {
                if (data.status === 'failure') {
                    _this.errorService.emitError(data.status);
                }
                else {
                    if (data.Postcode) {
                        if (data.ServiceBranchNumber) {
                            _this.formData.ServiceBranchNumber = data.ServiceBranchNumber;
                            _this.ellipsis.salesAreaCode.childConfigParams.ServiceBranchNumber = _this.formData.ServiceBranchNumber;
                        }
                        if (data.SalesAreaCode) {
                            _this.formData.SalesAreaCode = data.SalesAreaCode;
                            _this.ellipsis.salesAreaCode.childConfigParams.SalesAreaCode = _this.formData.SalesAreaCode;
                        }
                        if (data.SalesBranchNumber) {
                            _this.formData.SalesBranchNumber = data.SalesBranchNumber;
                        }
                        if (data.RegulatoryAuthorityNumber) {
                            _this.formData.RegulatoryAuthorityNumber = data.RegulatoryAuthorityNumber;
                        }
                        else {
                            _this.formData.RegulatoryAuthorityNumber = '';
                        }
                        _this.callLookupData();
                    }
                    else if (data.ErrorMessageDesc) {
                        _this.messageTitle = data.ErrorMessageDesc;
                        _this.messageModal.show();
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode')) {
            this.ellipsis.postCodeSearch.BranchNumber = this.utils.getBranchCode();
            this.ellipsis.postCodeSearch.PostCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode');
        }
    };
    PostcodeMaintenanceComponent.prototype.callLookupData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.formData.ServiceBranchNumber
                },
                'fields': ['BranchName']
            },
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.formData.SalesBranchNumber
                },
                'fields': ['BranchName']
            },
            {
                'table': 'SalesArea',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.formData.SalesBranchNumber,
                    'SalesAreaCode': this.formData.SalesAreaCode
                },
                'fields': ['SalesAreaDesc']
            },
            {
                'table': 'RegulatoryAuthority',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'RegulatoryAuthorityNumber': this.formData.RegulatoryAuthorityNumber
                },
                'fields': ['RegulatoryAuthorityName']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            _this.formData.ServiceBranchName = data[0][0] ? data[0][0].BranchName : '';
            _this.formData.SalesBranchName = data[1][0] ? data[1][0].BranchName : '';
            _this.formData.SalesAreaDesc = data[2][0] ? data[2][0].SalesAreaDesc : '';
            _this.formData.RegulatoryAuthorityName = data[3][0] ? data[3][0].RegulatoryAuthorityName : '';
            _this.setActiveParams();
        });
    };
    PostcodeMaintenanceComponent.prototype.setActiveParams = function () {
        if (this.formData.ServiceBranchName) {
            this.dropdown.servicebranch.active = {
                id: this.formData.ServiceBranchNumber,
                text: this.formData.ServiceBranchNumber + ' - ' + this.formData.ServiceBranchName
            };
            this.dropdown.servicebranch.isError = false;
        }
        if (this.formData.SalesBranchName) {
            this.dropdown.salesbranch.active = {
                id: this.formData.SalesBranchNumber,
                text: this.formData.SalesBranchNumber + ' - ' + this.formData.SalesBranchName
            };
            this.dropdown.salesbranch.isError = false;
        }
        if (this.formData.RegulatoryAuthorityName) {
            this.dropdown.RegulatoryAuthorityNumber.active = {
                id: this.formData.RegulatoryAuthorityNumber,
                text: this.formData.RegulatoryAuthorityNumber + ' - ' + this.formData.RegulatoryAuthorityName
            };
            this.dropdown.RegulatoryAuthorityNumber.isError = false;
        }
        if (this.formData.SalesAreaDesc) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaCode', this.formData.SalesAreaCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', this.formData.SalesAreaDesc);
        }
        this.btnUpdateOnClick();
    };
    PostcodeMaintenanceComponent.prototype.SalesAreaCodeOnkeydown = function (obj, call) {
        if (obj.SalesAreaCode) {
            if (obj.SalesAreaCode) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaCode', obj.SalesAreaCode);
            }
            if (obj.SalesAreaDesc) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', obj.SalesAreaDesc);
            }
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', '');
        }
    };
    PostcodeMaintenanceComponent.prototype.servicebranchOnchange = function (obj) {
        if (obj) {
            if (obj.BranchNumber) {
                this.formData.ServiceBranchNumber = obj.BranchNumber;
            }
            if (obj.BranchName) {
                this.formData.ServiceBranchName = obj.BranchName;
            }
            this.dropdown.servicebranch.isError = false;
            this.ellipsis.salesAreaCode.childConfigParams.ServiceBranchNumber = this.formData.ServiceBranchNumber;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', '');
        }
    };
    PostcodeMaintenanceComponent.prototype.salesbranchOnchange = function (obj) {
        if (obj) {
            if (obj.BranchNumber) {
                this.formData.SalesBranchNumber = obj.BranchNumber;
            }
            if (obj.BranchName) {
                this.formData.SalesBranchName = obj.BranchName;
            }
            this.dropdown.salesbranch.isError = false;
        }
    };
    PostcodeMaintenanceComponent.prototype.regulatoryAuthorityOnchange = function (obj) {
        if (obj) {
            if (obj.RegulatoryAuthorityNumber) {
                this.formData.RegulatoryAuthorityNumber = obj.RegulatoryAuthorityNumber;
            }
            if (obj.BranchName) {
                this.formData.RegulatoryAuthorityName = obj.RegulatoryAuthorityName;
            }
            this.dropdown.salesbranch.isError = false;
        }
    };
    PostcodeMaintenanceComponent.prototype.SalesAreaSearchOnchange = function () {
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'SalesAreaCode')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', '');
            this.ellipsis.salesAreaCode.childConfigParams.SalesAreaCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesAreaCode');
            this.ellipsis.salesAreaCode.childConfigParams.ServiceBranchNumber = this.formData.ServiceBranchNumber;
            this.ellipsis.salesAreaCode.childConfigParams.parentMode = 'LookUp-Postcode';
            this.premisesNumberEllipsis.openModal();
        }
        else {
            this.premisesNumberEllipsis.openModal();
        }
    };
    PostcodeMaintenanceComponent.prototype.cmdGenerateReportOnclick = function (e) {
        this.SubmitReportRequest();
    };
    PostcodeMaintenanceComponent.prototype.SubmitReportRequest = function () {
        var _this = this;
        this.setTimeToMinutes();
        var query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postData.Description = 'Postcode Detail';
        this.postData.ProgramName = 'iCABSPostcodeAssociationReport.p';
        this.postData.StartDate = this.utils.formatDate(new Date());
        this.postData.StartTime = this.setTimeToMinutes();
        this.postData.Report = 'report';
        this.postData.ParameterName = 'BusinessCode|BranchNumber|RepManDest';
        this.postData.ParameterValue = this.businessCode() + '|' + this.utils.getBranchCode() + '|' + 'batch|ReportID';
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e !== 'undefined' && e['errorMessage'])) {
                    _this.errorService.emitError(e['errorMessage']);
                }
                else {
                    _this.trInformation = true;
                    _this.URLReturn = e['fullError'];
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    PostcodeMaintenanceComponent.prototype.enableDisableFields = function () {
        if (this.setModeEnable === 'ADD') {
            this.riExchange.riInputElement.Enable(this.uiForm, 'Postcode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'Town');
            this.riExchange.riInputElement.Enable(this.uiForm, 'State');
            this.ellipsis.postCodeSearch.disabled = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'SalesAreaCode');
            this.ellipsis.salesAreaCode.disabled = false;
            this.dropdown.servicebranch.disabled = false;
            this.dropdown.salesbranch.disabled = false;
            this.dropdown.RegulatoryAuthorityNumber.disabled = false;
            this.dropdown.servicebranch.active = {
                id: '',
                text: ''
            };
            this.dropdown.salesbranch.active = {
                id: '',
                text: ''
            };
            this.dropdown.RegulatoryAuthorityNumber.active = {
                id: '',
                text: ''
            };
            this.setFormMode(this.c_s_MODE_ADD);
        }
        else if (this.setModeEnable === 'UPDATE') {
            this.riExchange.riInputElement.Enable(this.uiForm, 'SalesAreaCode');
            this.ellipsis.salesAreaCode.disabled = false;
            this.dropdown.servicebranch.disabled = false;
            this.dropdown.salesbranch.disabled = false;
            this.dropdown.RegulatoryAuthorityNumber.disabled = false;
            this.setFormMode(this.c_s_MODE_UPDATE);
        }
    };
    PostcodeMaintenanceComponent.prototype.disableEnabledFields = function () {
        this.riExchange.riInputElement.Enable(this.uiForm, 'Postcode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'Town');
        this.riExchange.riInputElement.Disable(this.uiForm, 'State');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SalesAreaCode');
        this.ellipsis.salesAreaCode.disabled = true;
        this.dropdown.servicebranch.disabled = true;
        this.dropdown.salesbranch.disabled = true;
        this.dropdown.RegulatoryAuthorityNumber.disabled = true;
        this.ellipsis.postCodeSearch.disabled = false;
        if (this.setModeEnable === 'ADD') {
            this.dropdown.servicebranch.active = {
                id: '',
                text: ''
            };
            this.dropdown.salesbranch.active = {
                id: '',
                text: ''
            };
            this.dropdown.RegulatoryAuthorityNumber.active = {
                id: '',
                text: ''
            };
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', '');
            this.setFormMode(this.c_s_MODE_ADD);
        }
        this.PostCodeSearchOnchange('');
    };
    PostcodeMaintenanceComponent.prototype.btnAddOnClick = function (add) {
        if (add) {
            this.mode = 'ADD';
            this.setModeEnable = 'ADD';
            this.IsDeleteEnable = false;
            this.uiForm.reset();
            this.formData.Postcode = '';
            this.formData.State = '';
            this.formData.Town = '';
            this.enableDisableFields();
        }
        this.riExchange.riInputElement.Enable(this.uiForm, 'save');
        this.riExchange.riInputElement.Enable(this.uiForm, 'cancel');
        this.setControlValue('save', 'Save');
        this.setControlValue('cancel', 'Cancel');
        this.setControlValue('delete', 'Delete');
    };
    PostcodeMaintenanceComponent.prototype.btnUpdateOnClick = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode')) {
            this.mode = 'UPDATE';
            this.setModeEnable = 'UPDATE';
            this.IsDeleteEnable = true;
            this.enableDisableFields();
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'Postcode', true);
        }
        this.riExchange.riInputElement.Enable(this.uiForm, 'save');
        this.riExchange.riInputElement.Enable(this.uiForm, 'cancel');
        this.riExchange.riInputElement.Enable(this.uiForm, 'delete');
    };
    PostcodeMaintenanceComponent.prototype.btnDeleteOnClick = function () {
        this.mode = 'DELETE';
        this.setModeEnable = 'DELETE';
        this.promptTitle = 'Delete Record?';
        this.promptModal.show();
    };
    PostcodeMaintenanceComponent.prototype.onSubmit = function () {
        var Postcode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'Postcode');
        var SalesAreaCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'SalesAreaCode');
        var servicebranch_hasError = this.dropdown.servicebranch.isError;
        var salesbranch_hasError = this.dropdown.salesbranch.isError;
        var RegulatoryAuthorityNumber_hasError = this.dropdown.RegulatoryAuthorityNumber.isError;
        if (servicebranch_hasError) {
            this.dropdown.servicebranch.required = true;
        }
        if (salesbranch_hasError) {
            this.dropdown.salesbranch.required = true;
        }
        if (!Postcode_hasError && !SalesAreaCode_hasError && !servicebranch_hasError) {
            this.promptTitle = 'Confirm Record?';
            this.promptModal.show();
        }
    };
    PostcodeMaintenanceComponent.prototype.onAbandon = function () {
        if (this.mode === 'ADD') {
            this.ellipsis.postCodeSearch.PostCode = '';
            this.ellipsis.postCodeSearch.State = '';
            this.ellipsis.postCodeSearch.Town = '';
            this.PostCodeSearchEllipsis.openModal();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Postcode', this.formData.Postcode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'State', this.formData.State);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Town', this.formData.Town);
            this.disableEnabledFields();
        }
        this.setFormMode(this.c_s_MODE_SELECT);
        this.riExchange.riInputElement.Disable(this.uiForm, 'save');
        this.riExchange.riInputElement.Disable(this.uiForm, 'cancel');
        this.riExchange.riInputElement.Disable(this.uiForm, 'delete');
    };
    PostcodeMaintenanceComponent.prototype.promptSave = function (event) {
        var _this = this;
        var query = this.getURLSearchParamObject();
        if (this.setModeEnable === 'ADD') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionInsert);
        }
        if (this.setModeEnable === 'UPDATE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
            this.postData.PostcodeROWID = this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode');
        }
        if (this.setModeEnable === 'DELETE') {
            query.set(this.serviceConstants.Action, this.queryParams.ActionDelete);
            this.postData = {};
            this.postData.PostcodeROWID = this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode');
        }
        this.postData.Postcode = this.riExchange.riInputElement.GetValue(this.uiForm, 'Postcode').toUpperCase();
        this.postData.Town = this.riExchange.riInputElement.GetValue(this.uiForm, 'Town').toUpperCase();
        this.postData.State = this.riExchange.riInputElement.GetValue(this.uiForm, 'State').toUpperCase();
        if (this.setModeEnable === 'ADD' || this.setModeEnable === 'UPDATE') {
            this.postData.ServiceBranchNumber = this.formData.ServiceBranchNumber;
            this.postData.SalesBranchNumber = this.formData.ServiceBranchNumber;
            this.postData.SalesAreaCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesAreaCode');
            if (this.formData.RegulatoryAuthorityNumber) {
                this.postData.RegulatoryAuthorityNumber = this.formData.RegulatoryAuthorityNumber;
            }
        }
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, query, this.postData)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if (e.errorMessage) {
                    _this.messageContent = e.errorMessage;
                    _this.messageModal.show();
                }
                else {
                    if (_this.setModeEnable === 'ADD' || _this.setModeEnable === 'UPDATE') {
                        _this.formData.Postcode = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Postcode').toUpperCase();
                        _this.formData.State = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'State').toUpperCase();
                        _this.formData.Town = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'Town').toUpperCase();
                        _this.messageContent = 'Data Saved Successfully';
                        _this.setModeEnable = '';
                    }
                    if (_this.setModeEnable === 'DELETE') {
                        _this.messageContent = 'Data Deleted Successfully';
                        _this.formData.Postcode = '';
                        _this.formData.State = '';
                        _this.formData.Town = '';
                        _this.dropdown.servicebranch.active = {
                            id: '',
                            text: ''
                        };
                        _this.dropdown.salesbranch.active = {
                            id: '',
                            text: ''
                        };
                        _this.dropdown.RegulatoryAuthorityNumber.active = {
                            id: '',
                            text: ''
                        };
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SalesAreaCode', '');
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'SalesAreaDesc', '');
                        _this.setModeEnable = 'DELETE';
                    }
                    _this.onAbandon();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    PostcodeMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBPostcodeMaintenance.html'
                },] },
    ];
    PostcodeMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    PostcodeMaintenanceComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'PostCodeSearchEllipsis': [{ type: ViewChild, args: ['PostCodeSearchEllipsis',] },],
        'premisesNumberEllipsis': [{ type: ViewChild, args: ['premisesNumberEllipsis',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
    };
    return PostcodeMaintenanceComponent;
}(BaseComponent));
