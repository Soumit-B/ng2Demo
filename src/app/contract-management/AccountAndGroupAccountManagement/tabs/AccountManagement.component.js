import { Utils } from './../../../../shared/services/utility';
import { AccountMaintenanceActionTypes } from './../../../actions/account-maintenance';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
import { Http, URLSearchParams } from '@angular/http';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { AuthService } from './../../../../shared/services/auth.service';
import { LocalStorageService } from 'ng2-webstorage';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@nsalaun/ng2-logger';
import { AjaxObservableConstant } from './../../../../shared/constants/ajax-observable.constant';
import { PageDataService } from './../../../../shared/services/page-data.service';
import { TranslateService } from 'ng2-translate';
import { Title } from '@angular/platform-browser';
import { MessageService } from './../../../../shared/services/message.service';
import { ErrorService } from './../../../../shared/services/error.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { HttpService } from './../../../../shared/services/http-service';
import { Component, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AccountSearchComponent } from '../../../../app/internal/search/iCABSASAccountSearch';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
export var AccountManagementComponent = (function () {
    function AccountManagementComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, translateService, fb, logger, activatedRoute, utilService) {
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
        this.translate = translate;
        this.ls = ls;
        this.http = http;
        this.translateService = translateService;
        this.fb = fb;
        this.logger = logger;
        this.activatedRoute = activatedRoute;
        this.utilService = utilService;
        this.inputParamsTierSearch = {};
        this.inputParamsEmployeeSearch = { 'parentMode': 'LookUp-AccountOwner', 'countryCode': '', 'businessCode': '', 'serviceBranchNumber': '' };
        this.inputAccountOwner = { 'parentMode': 'LookUp-AccountOwner', 'ContractTypeCode': '' };
        this.inputParams = {
            'parentMode': 'LookUp-Service',
            'businessCode': '',
            'countryCode': ''
        };
        this.isEmployeeSearchEllipsisDisabled = true;
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.zipSearchComponent = PostCodeSearchComponent;
        this.test = AccountSearchComponent;
        this.isRefreshEnable = false;
        this.selectedOwner = '';
        this.autoOpen = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalRecords = 10;
        this.maxColumn = 8;
        this.gridSortHeaders = [];
        this.isTierCodeDisabled = true;
        this.searchModalRoute = '';
        this.showHeader = true;
        this.showCloseButton = true;
        this.isCountryCodeDisabled = true;
        this.isZipCodeEllipsisDisabled = true;
        this.countrySelected = {
            id: '',
            text: ''
        };
        this.search = new URLSearchParams();
        this.queryParams = {
            method: 'contract-management/maintenance',
            module: 'account',
            operation: 'Application/iCABSAAccountMaintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.fieldDisabled = {
            'BtnSendToNAV': false,
            'cmdGetAddress': false,
            'cmdSetInvoiceGroupDefault': false,
            'cmdSetInvoiceGroupEDI': false,
            'selMandateTypeCode': false,
            'cmdGenerateNew': false,
            'cmdAddOwner': false
        };
        this.fieldVisibility = {
            'TierCode': true,
            'TierDescription': true,
            'AccountOwner': true,
            'AccountOwnerSurname': true,
            'CategoryCode': true,
            'CategoryDesc': true,
            'cmdAddOwner': true
        };
        this.fieldRequired = {
            'isAccountOwnerRequired': true,
            'isCategoryCodeRequired': true
        };
        this.virtualTableField = {
            'CrossReferenceAccountName': '',
            'BankAccountTypeDesc': '',
            'GroupName': '',
            'AccountBusinessTypeDesc': '',
            'LogoTypeDesc': '',
            'EmployeeSurname': '',
            'AccountOwnerSurname': '',
            'TierSystemDescription': '',
            'TierDescription': '',
            'CategoryDesc': '',
            'riCountryDescription': ''
        };
        this.otherParams = {
            'glAllowUserAuthUpdate': false,
            'cEmployeeLimitChildDrillOptions': ''
        };
        this.defaultCode = {
            country: '',
            business: ''
        };
        this.headerClicked = '';
        this.sortType = 'ASC';
        this.updateMode = false;
        this.addMode = false;
        this.searchMode = false;
        this.accountManagementFormGroup = this.fb.group({
            TierCode: [{ value: '', disabled: false }],
            TierDescription: [{ value: '', disabled: false }],
            AccountOwner: [{ value: '', disabled: false }, Validators.required],
            AccountOwnerSurname: [{ value: '', disabled: true }],
            CategoryCode: [{ value: '', disabled: false }, Validators.required],
            CategoryDesc: [{ value: '', disabled: true }],
            cmdAddOwner: [{ value: 'Add', disabled: false }]
        });
        this.storeSubscription = store.select('accountMaintenance').subscribe(function (data) {
            if (data && data['action']) {
                _this.storeData = data;
                switch (data['action']) {
                    case AccountMaintenanceActionTypes.SAVE_DATA:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_ACCOUNT:
                        if (data['data'] && !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                            _this.accountData = data['data'];
                            _this.setFormData(data);
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_MODE:
                        if (data['mode'] && !(Object.keys(data['mode']).length === 0 && data['mode'].constructor === Object)) {
                            _this.mode = data['mode'];
                            _this.addMode = data['mode'].addMode;
                            _this.updateMode = data['mode'].updateMode;
                            _this.searchMode = data['mode'].searchMode;
                            _this.processForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.SAVE_SYSCHAR:
                        _this.sysCharParams = data['syschars'];
                        break;
                    case AccountMaintenanceActionTypes.SAVE_PROCESSED_SYSCHAR:
                        _this.sysCharParams = data['processedSysChar'];
                        break;
                    case AccountMaintenanceActionTypes.FORM_INIT:
                        break;
                    case AccountMaintenanceActionTypes.SAVE_VIRTUAL_TABLE_DATA:
                        _this.virtualTableField = data['virtualTableData'];
                        _this.accountManagementFormGroup.controls['AccountOwnerSurname'].setValue(_this.virtualTableField.AccountOwnerSurname);
                        _this.accountManagementFormGroup.controls['TierDescription'].setValue(_this.virtualTableField.TierSystemDescription);
                        if (_this.accountManagementFormGroup.controls['TierCode'].value) {
                            var tiercode_1 = _this.accountManagementFormGroup.controls['TierCode'].value;
                            var tierdesc_1 = _this.accountManagementFormGroup.controls['TierDescription'].value;
                            _this.zone.run(function () {
                                _this.TierSearch = {
                                    id: tiercode_1,
                                    text: (tierdesc_1) ? tiercode_1 + ' - ' + tierdesc_1 : tiercode_1
                                };
                            });
                        }
                        _this.accountManagementFormGroup.controls['CategoryDesc'].setValue(_this.virtualTableField.CategoryDesc);
                        break;
                    case AccountMaintenanceActionTypes.VALIDATE_FORMS:
                        if (typeof (data['validate'].accountManagement) !== 'undefined') {
                            _this.validateForm();
                        }
                        break;
                    case AccountMaintenanceActionTypes.LOAD_FORM_GROUP:
                        break;
                    default:
                        break;
                }
            }
        });
        this.translateService.setUpTranslation();
    }
    AccountManagementComponent.prototype.ngOnInit = function () {
        String.prototype['capitalizeFirstLetter'] = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        };
        this.defaultCode.country = this.utilService.getCountryCode();
        this.defaultCode.business = this.utilService.getBusinessCode();
        this.inputParamsEmployeeSearch.serviceBranchNumber = this.utilService.getBranchCode();
        this.applyGridFilter();
        this.buildGrid();
        this.dispathFormGroup();
    };
    AccountManagementComponent.prototype.dispathFormGroup = function () {
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                accountManagement: this.accountManagementFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                accountManagement: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                accountManagement: this.fieldVisibility
            }
        });
    };
    AccountManagementComponent.prototype.applyGridFilter = function () {
        var objEmployeeCode = {
            'fieldName': 'Employee',
            'index': 0,
            'colName': 'Employee',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objEmployeeCode);
        var objSuspendInd = {
            'fieldName': 'Suspended',
            'index': 1,
            'colName': 'Suspended',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objSuspendInd);
        var objTransLevel = {
            'fieldName': 'Level',
            'index': 2,
            'colName': 'Level',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objTransLevel);
        var objTransNumber = {
            'fieldName': 'Reference',
            'index': 3,
            'colName': 'Reference',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objTransNumber);
        var objReviewDate = {
            'fieldName': 'Next',
            'index': 6,
            'colName': 'Next',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objReviewDate);
    };
    AccountManagementComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
    };
    AccountManagementComponent.prototype.setFormData = function (data) {
        var _this = this;
        if (data['data']) {
            this.accountManagementFormGroup.controls['TierCode'].setValue(data['data'].TierCode);
            this.accountManagementFormGroup.controls['AccountOwner'].setValue(data['data'].AccountOwner);
            this.accountManagementFormGroup.controls['CategoryCode'].setValue(data['data'].CategoryCode);
        }
        if (data['virtualTableData']) {
            this.accountManagementFormGroup.controls['TierDescription'].setValue(data['virtualTableData'].TierSystemDescription);
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].setValue(data['virtualTableData'].AccountOwnerSurname);
            this.accountManagementFormGroup.controls['CategoryDesc'].setValue(data['virtualTableData'].CategoryDesc);
        }
        if (this.accountManagementFormGroup.controls['TierCode'].value) {
            var tiercode_2 = this.accountManagementFormGroup.controls['TierCode'].value;
            var tierdesc_2 = this.accountManagementFormGroup.controls['TierDescription'].value;
            this.zone.run(function () {
                _this.TierSearch = {
                    id: tiercode_2,
                    text: (tierdesc_2) ? tiercode_2 + ' - ' + tierdesc_2 : tiercode_2
                };
            });
        }
        else {
            this.TierSearch = {
                id: '',
                text: ''
            };
        }
        if (this.storeData && this.storeData['data'] && this.storeData['mode'] && this.storeData['mode'].updateMode) {
            this.applyGridFilter();
            this.buildGrid();
        }
    };
    AccountManagementComponent.prototype.validateForm = function () {
        for (var j in this.fieldVisibility) {
            if (j) {
                var key = j['capitalizeFirstLetter']();
                if (!this.fieldVisibility[j]) {
                    if (this.accountManagementFormGroup.controls[key]) {
                        this.accountManagementFormGroup.controls[key].clearValidators();
                    }
                }
            }
        }
        for (var i in this.accountManagementFormGroup.controls) {
            if (this.accountManagementFormGroup.controls[i].enabled) {
                this.accountManagementFormGroup.controls[i].markAsTouched();
            }
            else {
                this.accountManagementFormGroup.controls[i].clearValidators();
            }
        }
        this.accountManagementFormGroup.updateValueAndValidity();
        var formValid = null;
        if (!this.accountManagementFormGroup.enabled) {
            formValid = true;
        }
        else {
            formValid = this.accountManagementFormGroup.valid;
        }
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_GROUP, payload: {
                accountManagement: this.accountManagementFormGroup
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_REQUIRED_FIELD, payload: {
                accountManagement: this.fieldRequired
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                accountManagement: this.fieldVisibility
            }
        });
        this.store.dispatch({
            type: AccountMaintenanceActionTypes.FORM_VALIDITY, payload: {
                accountManagement: formValid
            }
        });
    };
    AccountManagementComponent.prototype.processForm = function () {
        if (this.mode['updateMode'] && !this.mode['searchMode'] && !this.mode['addMode']) {
            this.accountManagementFormGroup.controls['TierCode'].enable();
            this.accountManagementFormGroup.controls['AccountOwner'].enable();
            this.accountManagementFormGroup.controls['CategoryCode'].enable();
            this.accountManagementFormGroup.controls['TierDescription'].enable();
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].disable();
            this.accountManagementFormGroup.controls['CategoryDesc'].disable();
            this.fieldDisabled.isCmdAddOwnerDisabled = true;
            this.accountManagementFormGroup.controls['cmdAddOwner'].disable();
            this.isRefreshEnable = true;
            this.isEmployeeSearchEllipsisDisabled = false;
            this.isTierCodeDisabled = false;
        }
        if (this.mode['searchMode'] && !this.mode['updateMode'] && !this.mode['addMode']) {
            this.accountReviewOwnerGrid.clearGridData();
            this.accountManagementFormGroup.controls['TierCode'].disable();
            this.accountManagementFormGroup.controls['AccountOwner'].disable();
            this.accountManagementFormGroup.controls['CategoryCode'].disable();
            this.accountManagementFormGroup.controls['TierDescription'].disable();
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].disable();
            this.accountManagementFormGroup.controls['CategoryDesc'].disable();
            this.isRefreshEnable = true;
            this.isEmployeeSearchEllipsisDisabled = true;
            this.isTierCodeDisabled = true;
        }
        if (this.mode['addMode'] && !this.mode['updateMode'] && !this.mode['searchMode']) {
            this.fieldDisabled.isCmdAddOwnerDisabled = false;
            this.accountManagementFormGroup.controls['TierCode'].enable();
            this.accountManagementFormGroup.controls['AccountOwner'].enable();
            this.accountManagementFormGroup.controls['CategoryCode'].enable();
            this.accountManagementFormGroup.controls['TierDescription'].enable();
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].disable();
            this.accountManagementFormGroup.controls['CategoryDesc'].disable();
            this.accountManagementFormGroup.controls['TierCode'].setValue('');
            this.accountManagementFormGroup.controls['AccountOwner'].setValue('');
            this.accountManagementFormGroup.controls['CategoryCode'].setValue('');
            this.accountManagementFormGroup.controls['TierDescription'].setValue('');
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].setValue('');
            this.accountManagementFormGroup.controls['CategoryDesc'].setValue('');
            this.accountManagementFormGroup.controls['cmdAddOwner'].enable();
            this.accountReviewOwnerGrid.clearGridData();
            this.isRefreshEnable = true;
            this.isEmployeeSearchEllipsisDisabled = false;
            this.isTierCodeDisabled = false;
        }
        if (this.mode['addMode'] || this.mode['updateMode']) {
            this.inputParams = Object.assign({}, this.inputParams, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
            this.inputParamsEmployeeSearch = Object.assign({}, this.inputParamsEmployeeSearch, {
                'countryCode': this.storeData['code'].country,
                'businessCode': this.storeData['code'].business
            });
        }
        this.accountManagementFormGroup.updateValueAndValidity();
    };
    AccountManagementComponent.prototype.modalHidden = function () {
    };
    AccountManagementComponent.prototype.onEmployeeDataReceived = function (data) {
        if (data && data.AccountOwner) {
            this.accountManagementFormGroup.controls['AccountOwner'].setValue(data.AccountOwner);
        }
        if (data && data.AccountOwnerSurname) {
            this.accountManagementFormGroup.controls['AccountOwnerSurname'].setValue(data.AccountOwnerSurname);
        }
        this.accountManagementFormGroup.updateValueAndValidity();
    };
    AccountManagementComponent.prototype.getGridInfo = function (info) {
        if (info.totalRows && this.accountReviewOwnerPagination) {
            this.accountReviewOwnerPagination.totalItems = info.totalRows;
        }
    };
    AccountManagementComponent.prototype.getCurrentPage = function (data) {
        this.currentPage = data.value;
        this.applyGridFilter();
        this.buildGrid();
    };
    AccountManagementComponent.prototype.buildGrid = function () {
        this.search = new URLSearchParams();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.search.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.search.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.search.set(this.serviceConstants.BusinessCode, this.defaultCode.business);
            this.search.set(this.serviceConstants.CountryCode, this.defaultCode.country);
        }
        if (this.storeData['formGroup'].main.controls['AccountNumber'] && this.storeData['formGroup'].main.controls['AccountNumber'].value) {
            this.search.set('AccountNumber', this.storeData['formGroup'].main.controls['AccountNumber'].value);
        }
        else {
            this.search.set('AccountNumber', '');
        }
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', '10');
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
        this.inputParams.search = this.search;
        this.accountReviewOwnerGrid.showTick = true;
        this.accountReviewOwnerGrid.loadGridData(this.inputParams);
    };
    AccountManagementComponent.prototype.onGridRowClick = function (event) {
        if (event.cellIndex === 0) {
            if (!this.addMode && this.storeData['formGroup'].main.controls['AccountNumber'].value) {
                var cellData = this.accountReviewOwnerGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
                this.selectedOwner = cellData.additionalData;
                this.callOwnerMaintenance('update');
            }
        }
    };
    AccountManagementComponent.prototype.onChangeShow = function (event) {
        this.refresh();
    };
    AccountManagementComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.headerClicked = '';
        this.buildGrid();
    };
    AccountManagementComponent.prototype.sortGrid = function (obj) {
        this.headerClicked = obj.fieldname;
        this.sortType = obj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    };
    AccountManagementComponent.prototype.onAccountOwnerDataReceived = function (data, route) {
    };
    AccountManagementComponent.prototype.onKeyDown = function (event) {
        if (event && event.target) {
            if (event.keyCode === 34) {
                if (event.target.id === 'TierCode') {
                }
                else if (event.target.id === 'AccountOwner') {
                }
                else if (event.target.id === 'CategoryCode') {
                }
            }
        }
    };
    AccountManagementComponent.prototype.onCmdAddOwnerClick = function () {
        this.callOwnerMaintenance('add');
    };
    AccountManagementComponent.prototype.callOwnerMaintenance = function (cUpdateMode) {
        var accountName = '';
        var accountNumber = '';
        if (this.storeData && this.storeData['formGroup'] && this.storeData['formGroup'].main) {
            accountNumber = this.storeData['formGroup'].main.controls['AccountNumber'].value;
            accountName = this.storeData['formGroup'].main.controls['AccountName'].value;
        }
        this.router.navigate(['/maintenance/accountowner'], {
            queryParams: {
                parentMode: cUpdateMode,
                SelectedOwner: this.selectedOwner,
                AccountNumber: accountNumber,
                AccountName: accountName
            }
        });
    };
    AccountManagementComponent.prototype.onTIERSearchReceived = function (obj) {
        if (obj && obj.TierCode) {
            var desc = (obj.hasOwnProperty('TierSystemDescription') ? obj.TierSystemDescription : obj.Object.TierSystemDescription);
            this.TierSearch = {
                id: obj.TierCode,
                text: (desc) ? obj.TierCode + ' - ' + desc : obj.TierCode
            };
            this.accountManagementFormGroup.controls['TierCode'].setValue(obj.TierCode);
            this.accountManagementFormGroup.controls['TierDescription'].setValue(desc);
            this.accountManagementFormGroup.updateValueAndValidity();
        }
    };
    AccountManagementComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-account-maintenance-account-management',
                    templateUrl: 'AccountManagement.html'
                },] },
    ];
    AccountManagementComponent.ctorParameters = [
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
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Http, },
        { type: LocaleTranslationService, },
        { type: FormBuilder, },
        { type: Logger, },
        { type: ActivatedRoute, },
        { type: Utils, },
    ];
    AccountManagementComponent.propDecorators = {
        'accountReviewOwnerGrid': [{ type: ViewChild, args: ['accountReviewOwnerGrid',] },],
        'accountReviewOwnerPagination': [{ type: ViewChild, args: ['accountReviewOwnerPagination',] },],
        'zipCodeEllipsis': [{ type: ViewChild, args: ['employeeSearchEllipsis',] },],
    };
    return AccountManagementComponent;
}());
