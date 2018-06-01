import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { AccountSearchComponent } from './../search/iCABSASAccountSearch';
import { GroupAccountNumberComponent } from './../search/iCABSSGroupAccountNumberSearch';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Title } from '@angular/platform-browser';
import { PageDataService } from './../../../shared/services/page-data.service';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { AuthService } from './../../../shared/services/auth.service';
import { MessageService } from './../../../shared/services/message.service';
import { ErrorService } from './../../../shared/services/error.service';
import { HttpService } from './../../../shared/services/http-service';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GridComponent } from './../../../shared/components/grid/grid';
import { URLSearchParams, Http } from '@angular/http';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
var SCMCallCentreReviewGridComponent = (function () {
    function SCMCallCentreReviewGridComponent(httpService, serviceConstants, errorService, messageService, authService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, localeTranslateService, sysCharConstants) {
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
        this.localeTranslateService = localeTranslateService;
        this.sysCharConstants = sysCharConstants;
        this.groupAccountNumberComponent = GroupAccountNumberComponent;
        this.accountSearchComponent = AccountSearchComponent;
        this.showCloseButton = true;
        this.toDate = new Date();
        this.fromDate = new Date(new Date().setDate(new Date().getDate() - 14));
        this.inputParams = {
            'parentMode': '',
            'businessCode': '',
            'countryCode': ''
        };
        this.inputParamsGrpAccNumber = {
            'parentMode': 'LookUp',
            'Action': '2'
        };
        this.inputParamsAccountNumber = {
            'parentMode': 'ContactCentreReview',
            'accountName': 'JET'
        };
        this.inputParamsContractNumberr = {
            'parentMode': 'LookUp-All',
            'Action': '2'
        };
        this.inputParamsPremiseNumber = {
            'parentMode': 'LookUp-All',
            'Action': '2'
        };
        this.urlParams = {
            action: '0',
            operation: 'callcentreReviewGrid',
            module: 'call-centre',
            method: 'ccm/maintenance',
        };
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.page = 1;
        this.totalItems = 1;
        this.maxColumn = 12;
        this.businessList = [];
        this.contactTypeList = [];
        this.filterPassedList = [];
        this.filterDisputedList = [];
        this.ReassignList = [];
        this.DateFilterList = [];
    }
    SCMCallCentreReviewGridComponent.prototype.ngOnInit = function () {
        var params = this.inputParams;
        this.initPage();
        this.BuildGrid(params);
        this.localeTranslateService.setUpTranslation();
    };
    SCMCallCentreReviewGridComponent.prototype.ngOnDestroy = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.initPage = function () {
        var strGridData;
        var blnUpdate;
        var intMonthsAgo;
        var intMonthsAhead;
        var IntPeriodMonths;
        var cUserCode;
        var cUserName;
        var cLimitUserBranch;
        var lEnableDisputeInvoices;
        if (this.inputParams.parentMode === 'WorkOrderMaintenanceContract' ||
            this.inputParams.parentMode === 'WorkOrderMaintenanceAccount' ||
            this.inputParams.parentMode === 'WorkOrderMaintenanceProspect' ||
            this.inputParams.parentMode === 'WorkOrderMaintenanceCustomerContact') {
            this.MyFilterLevel = 'all';
        }
        if (this.inputParams.parentMode !== '') {
        }
        switch (this.inputParams.parentMode) {
            case 'Account':
            case 'Contract':
            case 'Premise':
            case 'InvoiceHistory':
                this.MyFilterLevel = 'currentactioner';
                if (this.inputParams.parentMode === 'InvoiceHistory') {
                    this.MyFilterLevel = 'all';
                    this.MyFilter = 'allopenclosed';
                }
                break;
            case 'WorkOrderMaintenanceContract':
            case 'WorkOrderMaintenanceAccount':
                break;
            case 'ServiceCover':
                this.GetServiceCoverNumber();
                this.MyFilterLevel = 'currentactioner';
                break;
            case 'PipelineProspectGrid':
            case 'ProspectGrid':
                this.MyFilterLevel = 'currentactioner';
                break;
            case 'WorkOrderMaintenanceProspect':
                break;
            case 'WorkOrderMaintenanceCustomerContact':
                break;
            default:
        }
    };
    SCMCallCentreReviewGridComponent.prototype.LoadSearchDefaults = function () {
        var _this = this;
        var strFunction;
        var strReturn;
        var Arr;
        var iLoop;
        var Elle;
        var CT;
        this.query = new URLSearchParams();
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.query.set(this.serviceConstants.Action, this.inputParams.action);
        this.query.set('Function', 'GetSearchDefaults');
        this.query.set('BranchNumber', this.GroupAccountNumber);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.onChangeMyContactType();
                    _this.onChangeMyFilter();
                    _this.onChangeMyFilterPassed();
                    _this.onChangeMyFilterLevel();
                    _this.onChangeMyFilterValue();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    SCMCallCentreReviewGridComponent.prototype.Detail = function () {
        switch (window.event.srcElement.id) {
            case 'grCallLogID':
                break;
            case 'ContactActionNumber':
            case 'ContactInfo':
                break;
            case 'Actions':
                break;
            case 'CallOuts':
                if (window.event.srcElement.getAttribute('RowID') !== '1') {
                }
        }
    };
    SCMCallCentreReviewGridComponent.prototype.BuildGrid = function (params) {
        this.query = new URLSearchParams();
        if (params) {
            this.inputParams = params;
        }
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        if (params) {
            if (params.businessCode !== undefined && params.businessCode !== null) {
                this.query.set(this.serviceConstants.BusinessCode, params.businessCode);
            }
            if (params.countryCode !== undefined && params.countryCode !== null) {
                this.query.set(this.serviceConstants.CountryCode, params.countryCode);
            }
        }
        this.query.set('RunningAs', 'Review');
        this.query.set('CallLogID', this.CallLogID);
        this.query.set('CustomerContactNumber', this.CustomerContactNumber);
        this.query.set('GroupAccountNumber', this.GroupAccountNumber);
        this.query.set('AccountNumber', this.AccountNumber);
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('PremiseNumber', this.PremiseNumber);
        this.query.set('ServiceCoverNumber', this.ServiceCoverNumber);
        this.query.set('ProductCode', this.ProductCode);
        this.query.set('Postcode', this.PostCode);
        this.query.set('ContactName', this.SearchContactName);
        this.query.set('Filter', this.MyFilter);
        this.query.set('FilterPassed', this.MyFilterPassed);
        this.query.set('FilterDisputed', this.MyFilterDisputed);
        this.query.set('FilterLevel', this.MyFilterLevel);
        this.query.set('FilterValue', this.MyFilterValue);
        this.query.set('FilterEmployeeCode', this.MyFilterEmployeeCode);
        this.query.set('FilterTeamID', this.TeamID);
        this.query.set('LanguageCode', this.LanguageCode);
        this.query.set('BranchNumber', this.BranchNumber);
        this.query.set('BranchServiceAreaCode', this.BranchServiceAreaCode);
        this.query.set('FilterBranchNumber', this.FilterBranchNumber);
        this.query.set('ProspectNumber', this.ProspectNumber);
        this.query.set('MyContactType', this.MyContactType);
        this.query.set('DateFilter', this.DateFilter);
        this.query.set('DateFrom', this.DateFrom);
        this.query.set('DateTo', this.DateTo);
        this.query.set('TicketReference', this.TicketReference);
        this.query.set('CompanyInvoiceNumber', this.CompanyInvoiceNumber);
        this.query.set('OnDisputeReference', this.OnDisputeReference);
        this.query.set('ContactTypeCodeValue1', this.ContactTypeCodeSelectValue1);
        this.query.set('ContactTypeDetailCodeValue1', this.ContactTypeDetailCodeSelectValue1);
        this.query.set('ContactStatusCodeValue1', this.ContactStatusCodeSelectValue1);
        this.query.set('ContactTypeCodeValue2', this.ContactTypeCodeSelectValue2);
        this.query.set('ContactTypeDetailCodeValue2', this.ContactTypeDetailCodeSelectValue2);
        this.query.set('ContactStatusCodeValue2', this.ContactStatusCodeSelectValue2);
        this.query.set('ContactTypeCodeValue3', this.ContactTypeCodeSelectValue3);
        this.query.set('ContactTypeDetailCodeValue3', this.ContactTypeDetailCodeSelectValue3);
        this.query.set('ContactStatusCodeValue3', this.ContactStatusCodeSelectValue3);
        this.query.set('ContactTypeCodeValue4', this.ContactTypeCodeSelectValue4);
        this.query.set('ContactTypeDetailCodeValue4', this.ContactTypeDetailCodeSelectValue4);
        this.query.set('ContactStatusCodeValue4', this.ContactStatusCodeSelectValue4);
        this.query.set('ContactTypeCodeValue5', this.ContactTypeCodeSelectValue5);
        this.query.set('ContactTypeDetailCodeValue5', this.ContactTypeDetailCodeSelectValue5);
        this.query.set('ContactStatusCodeValue5', this.ContactStatusCodeSelectValue5);
        this.query.set('ContactTypeCodeValue6', this.ContactTypeCodeSelectValue6);
        this.query.set('ContactTypeDetailCodeValue6', this.ContactTypeDetailCodeSelectValue6);
        this.query.set('ContactStatusCodeValue6', this.ContactStatusCodeSelectValue6);
        this.query.set('ContactTypeCodeValue7', this.ContactTypeCodeSelectValue7);
        this.query.set('ContactTypeDetailCodeValue7', this.ContactTypeDetailCodeSelectValue7);
        this.query.set('ContactStatusCodeValue7', this.ContactStatusCodeSelectValue7);
        this.query.set('ContactTypeCodeValue8', this.ContactTypeCodeSelectValue8);
        this.query.set('ContactTypeDetailCodeValue8', this.ContactTypeDetailCodeSelectValue8);
        this.query.set('ContactStatusCodeValue8', this.ContactStatusCodeSelectValue8);
        this.query.set('ContactTypeCodeValue9', this.ContactTypeCodeSelectValue9);
        this.query.set('ContactTypeDetailCodeValue9', this.ContactTypeDetailCodeSelectValue9);
        this.query.set('ContactStatusCodeValue9', this.ContactStatusCodeSelectValue9);
        this.query.set('ContactTypeCodeValue10', this.ContactTypeCodeSelectValue10);
        this.query.set('ContactTypeDetailCodeValue10', this.ContactTypeDetailCodeSelectValue10);
        this.query.set('ContactStatusCodeValue10', this.ContactStatusCodeSelectValue10);
        this.query.set('ReassignEmployeeCode', this.EmployeeCode);
        this.query.set('ReassignSelect', this.ReassignSelect);
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('Mode', this.inputParams.parentMode);
        this.inputParams.search = this.query;
        this.callCentreReviewGrid.loadGridData(this.inputParams);
    };
    SCMCallCentreReviewGridComponent.prototype.getSystemCharValues = function () {
        var syscharCCMCallPipelineVsProspectGrid = '';
    };
    SCMCallCentreReviewGridComponent.prototype.toDateSelectedValue = function (value) {
        if (value)
            this.toDateDisplay = value.value;
    };
    SCMCallCentreReviewGridComponent.prototype.fromDateSelectedValue = function (value) {
        if (value)
            this.fromDateDisplay = value.value;
    };
    SCMCallCentreReviewGridComponent.prototype.setGroupAccount = function (data) {
        if (data.GroupName) {
            this.GroupName = data.GroupName;
        }
        this.GroupAccountNumber = data.GroupAccountNumber;
    };
    SCMCallCentreReviewGridComponent.prototype.setAccountNumber = function (data) {
        this.AccountNumber = data.AccountNumber;
    };
    SCMCallCentreReviewGridComponent.prototype.PremiseNumberEllipsisClick = function () {
        if (this.ContractNumber.trim() !== '') {
            this.inputParamsPremiseNumber.parentMode = 'LookUp';
            this.premiseNumberEllipsis.childConfigParams = this.inputParamsPremiseNumber;
            this.premiseNumberEllipsis.contentComponent = this.groupAccountNumberComponent;
        }
        else {
            this.inputParamsPremiseNumber.parentMode = '';
            this.premiseNumberEllipsis.contentComponent = this.accountSearchComponent;
        }
    };
    SCMCallCentreReviewGridComponent.prototype.cmdComplexOnClick = function () {
        var obj = { 'parentMode': 'ContactCentreReview' };
    };
    SCMCallCentreReviewGridComponent.prototype.cmdSOPGridOnClick = function () {
        var obj = { 'parentMode': 'ContactCentreReview' };
    };
    SCMCallCentreReviewGridComponent.prototype.ProductCodeSearch = function () {
        if (this.ContractNumber.trim() === '' || this.PremiseNumber === '') {
        }
    };
    SCMCallCentreReviewGridComponent.prototype.GetBusinessSystemCharRequired = function () {
        var _this = this;
        var sysCharMethod = 'settings/data';
        var sysCharList = [this.sysCharConstants.SystemCharCCMCallPipelineVsProspectGrid];
        this.query = new URLSearchParams();
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.query.set(this.serviceConstants.Action, this.inputParams.action);
        this.query.set('systemCharNumber', JSON.stringify(sysCharList));
        this.httpService.makeGetRequest(sysCharMethod, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    SCMCallCentreReviewGridComponent.prototype.GetGroupAccountName = function () {
        var _this = this;
        this.query = new URLSearchParams();
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.query.set(this.serviceConstants.Action, this.inputParams.action);
        this.query.set('Function', 'GetGroupName');
        this.query.set('GroupAccountNumber', this.GroupAccountNumber);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.GroupName = e.GroupName;
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    SCMCallCentreReviewGridComponent.prototype.GetAccountName = function () {
        var _this = this;
        this.query = new URLSearchParams();
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.query.set(this.serviceConstants.Action, this.inputParams.action);
        this.query.set('Function', 'GetAccountNameAndGroupAccountDetails');
        this.query.set('AccountNumber', this.AccountNumber);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.GroupAccountNumber = e.GroupAccountNumber;
                    _this.GroupName = e.GroupName;
                    _this.AccountName = e.AccountName;
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    SCMCallCentreReviewGridComponent.prototype.GetContractName = function () {
        var _this = this;
        this.query = new URLSearchParams();
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.query.set(this.serviceConstants.Action, this.inputParams.action);
        this.query.set('Function', 'GetContractName');
        this.query.set('ContractNumber', this.ContractNumber);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.ContractName = e.ContractName;
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    SCMCallCentreReviewGridComponent.prototype.GetPremiseName = function () {
        var _this = this;
        this.query = new URLSearchParams();
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.query.set(this.serviceConstants.Action, this.inputParams.action);
        this.query.set('Function', 'GetPremiseName');
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('PremiseNumber', this.PremiseNumber);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.PremiseName = e.PremiseName;
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    SCMCallCentreReviewGridComponent.prototype.GetServiceCoverNumber = function () {
        if (this.attrProductCodeSCRowID !== '') {
            this.GetServiceCoverNumberFromRowID();
        }
        else {
            this.GetServiceCoverNumberFromRecord();
        }
    };
    SCMCallCentreReviewGridComponent.prototype.GetServiceCoverNumberFromRowID = function () {
        var _this = this;
        this.query = new URLSearchParams();
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.query.set(this.serviceConstants.Action, '6');
        this.query.set('Function', 'GetServiceCoverFromRowID');
        this.query.set('SCRowID', this.ContractNumber);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.ServiceCoverNumber = e.ServiceCoverNumber;
                    _this.ProductDesc = e.ProductDesc;
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    SCMCallCentreReviewGridComponent.prototype.GetServiceCoverNumberFromRecord = function () {
        var _this = this;
        this.query = new URLSearchParams();
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        if (this.inputParams.businessCode !== undefined && this.inputParams.businessCode !== null) {
            this.query.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode !== undefined && this.inputParams.countryCode !== null) {
            this.query.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.query.set(this.serviceConstants.Action, '6');
        this.query.set('Function', 'GetServiceCoverFromRecord');
        this.query.set('ContractNumber', this.ContractNumber);
        this.query.set('PremiseNumber', this.PremiseNumber);
        this.query.set('ProductCode', this.ProductCode);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.ServiceCoverNumber = e.ServiceCoverNumber;
                    switch (_this.ServiceCoverNumber) {
                        case '-1':
                            _this.GetServiceCoverNumberFromRowID();
                            break;
                        case '0':
                            break;
                        default:
                            _this.ProductDesc = e.ProductDesc;
                            _this.SetAllSCRowID(e.ServiceCoverRowID);
                    }
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    SCMCallCentreReviewGridComponent.prototype.SetAllSCRowID = function (ipRowID) {
        this.attrProductCodeSCRowID = ipRowID;
        this.attrProductCodeServiceCoverRowID = ipRowID;
        this.attrServiceCoverNumberSCRowID = ipRowID;
        this.attrServiceCoverNumberServiceCoverRowID = ipRowID;
        this.ServiceCoverRowID = ipRowID;
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeProductCode = function () {
        if (this.ProductCode === '') {
            this.ProductDesc = '';
        }
        else {
            this.GetServiceCoverNumber();
        }
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeCustomerContactNumber = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeGroupAccountNumber = function () {
        if (this.GroupAccountNumber === '') {
            this.GroupName = '';
        }
        else {
            this.GetGroupAccountName();
        }
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeAccountNumber = function () {
        if (this.AccountNumber === '') {
            this.AccountName = '';
        }
        else {
            this.GetAccountName();
        }
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeTicketReference = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeCompanyInvoiceNumber = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeOnDisputeReference = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeContractNumber = function () {
        if (this.ContractNumber === '') {
            this.ContractName = '';
        }
        else {
        }
    };
    SCMCallCentreReviewGridComponent.prototype.onChangePremiseNumber = function () {
        if (this.PremiseNumber === '') {
            this.PremiseName = '';
        }
        else {
        }
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeSearchContactName = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeProspectNumber = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangePostCode = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeMyFilterEmployeeCode = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeTeamID = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeFilterBranchNumber = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeMyFilter = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeMyFilterPassed = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeMyFilterLevel = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeMyFilterDisputed = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeMyFilterValue = function () {
        switch (this.MyFilterValue) {
            case 'me':
            case 'myemployees':
                break;
            case 'thisservbranch':
            case 'thisbranch':
                break;
            case 'thisemployee':
                break;
            case 'thisteam':
                break;
            default:
                break;
        }
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeReassignSelect = function () {
        switch (this.ReassignSelect) {
            case 'All':
            case 'AllReassigned':
                break;
            case 'ReassignedTo':
            case 'ReassignedFrom':
                break;
        }
    };
    SCMCallCentreReviewGridComponent.prototype.onChangeMyContactType = function () {
        var ValArray;
        var DescArray;
        if (this.MyContactType === 'complex') {
            this.cmdComplexOnClick();
        }
        else {
            this.ContactTypeCodeSelectValue1 = '';
            this.ContactTypeCodeSelectValue2 = '';
            this.ContactTypeCodeSelectValue3 = '';
            this.ContactTypeCodeSelectValue4 = '';
            this.ContactTypeCodeSelectValue5 = '';
            this.ContactTypeCodeSelectValue6 = '';
            this.ContactTypeCodeSelectValue7 = '';
            this.ContactTypeCodeSelectValue8 = '';
            this.ContactTypeCodeSelectValue9 = '';
            this.ContactTypeCodeSelectValue10 = '';
        }
        this.RefreshRequired();
    };
    SCMCallCentreReviewGridComponent.prototype.RefreshRequired = function () {
    };
    SCMCallCentreReviewGridComponent.prototype.onBlur = function (event) {
        var elementValue = event.target.value;
        var _paddedValue = elementValue;
        if (elementValue.length > 0) {
            if (event.target.id === 'ContractNumber') {
                if (elementValue.length < 8) {
                    _paddedValue = this.numberPadding(elementValue, 8);
                    event.target.value = _paddedValue;
                }
            }
            else if (event.target.id === 'AccountNumber') {
                if (elementValue.length < 9) {
                    _paddedValue = this.numberPadding(elementValue, 9);
                    event.target.value = _paddedValue;
                }
            }
        }
    };
    ;
    SCMCallCentreReviewGridComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    SCMCallCentreReviewGridComponent.prototype.onKey = function (event) {
        this.dynamicComponent = this.groupAccountNumberComponent;
    };
    SCMCallCentreReviewGridComponent.prototype.getGridInfo = function (e) {
        this.returnObj = e;
    };
    SCMCallCentreReviewGridComponent.prototype.getCurrentPage = function (epage) {
        this.page = epage;
    };
    return SCMCallCentreReviewGridComponent;
}());
__decorate([
    ViewChild('callCentreReviewGrid'),
    __metadata("design:type", GridComponent)
], SCMCallCentreReviewGridComponent.prototype, "callCentreReviewGrid", void 0);
__decorate([
    ViewChild('callCentreReviewPagination'),
    __metadata("design:type", PaginationComponent)
], SCMCallCentreReviewGridComponent.prototype, "callCentreReviewPagination", void 0);
__decorate([
    ViewChild('businessDropdown'),
    __metadata("design:type", DropdownStaticComponent)
], SCMCallCentreReviewGridComponent.prototype, "businessDropdown", void 0);
__decorate([
    ViewChild('MyFilterLevel'),
    __metadata("design:type", DropdownStaticComponent)
], SCMCallCentreReviewGridComponent.prototype, "MyFilterLevelDropdown", void 0);
__decorate([
    ViewChild('MyFilterValue'),
    __metadata("design:type", DropdownStaticComponent)
], SCMCallCentreReviewGridComponent.prototype, "MyFilterValueDropdown", void 0);
__decorate([
    ViewChild('GroupNameEllipsis'),
    __metadata("design:type", EllipsisComponent)
], SCMCallCentreReviewGridComponent.prototype, "groupNameEllipsis", void 0);
__decorate([
    ViewChild('PremiseNumberEllipsis'),
    __metadata("design:type", EllipsisComponent)
], SCMCallCentreReviewGridComponent.prototype, "premiseNumberEllipsis", void 0);
SCMCallCentreReviewGridComponent = __decorate([
    Component({
        selector: 'icabs-scm-call-centre-review-grid',
        templateUrl: 'iCABSCMCallCentreReviewGrid.html'
    }),
    __metadata("design:paramtypes", [HttpService,
        ServiceConstants,
        ErrorService,
        MessageService,
        AuthService,
        AjaxObservableConstant,
        Router,
        PageDataService,
        Title,
        NgZone,
        Store,
        TranslateService,
        LocalStorageService,
        Http,
        LocaleTranslationService,
        SysCharConstants])
], SCMCallCentreReviewGridComponent);
export { SCMCallCentreReviewGridComponent };
