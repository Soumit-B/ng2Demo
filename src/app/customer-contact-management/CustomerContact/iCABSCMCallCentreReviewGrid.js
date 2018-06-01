import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { CBBService } from './../../../shared/services/cbb.service';
import { BranchSearchComponent } from './../../internal/search/iCABSBBranchSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Title } from '@angular/platform-browser';
import { PageDataService } from './../../../shared/services/page-data.service';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { MessageService } from './../../../shared/services/message.service';
import { ErrorService } from './../../../shared/services/error.service';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { URLSearchParams, Http } from '@angular/http';
import { Component, ViewChild, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LookUp } from '../../../shared/services/lookup';
import { Utils } from '../../../shared/services/utility';
import { SpeedScript } from '../../../shared/services/speedscript';
export var CentreReviewGridComponent = (function () {
    function CentreReviewGridComponent(httpService, serviceConstants, errorService, messageService, ajaxconstant, router, pageData, titleService, zone, store, translate, ls, http, localeTranslateService, sysCharConstants, activatedRoute, utils, LookUp, SpeedScript, cbbService) {
        var _this = this;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.errorService = errorService;
        this.messageService = messageService;
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
        this.activatedRoute = activatedRoute;
        this.utils = utils;
        this.LookUp = LookUp;
        this.SpeedScript = SpeedScript;
        this.cbbService = cbbService;
        this.title = 'Contact Centre - Review';
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.inputParamsEmployeeSearch = {
            'parentMode': 'MyFilter'
        };
        this.branchSearchComponent = BranchSearchComponent;
        this.inputParamsBranchSearch = {
            'parentMode': 'LookUp-CCMReview'
        };
        this.groupAccountNumberComponent = GroupAccountNumberComponent;
        this.inputParamsGrpAccNumber = {
            'parentMode': 'LookUp',
            'businessCode': this.utils.getBusinessCode(),
            'countryCode': this.utils.getCountryCode(),
            'Action': '2'
        };
        this.accountSearchComponent = AccountSearchComponent;
        this.inputParamsAccountNumber = {
            'parentMode': 'ContactCentreReview',
            'accountName': 'JET'
        };
        this.contractSearchComponent = ContractSearchComponent;
        this.inputParamsContract = {
            'parentMode': 'LookUp-All',
            'pageTitle': 'Contract Entry',
            'currentContractType': 'C',
            'showAddNew': true
        };
        this.accountPremise = PremiseSearchComponent;
        this.inputParamsAccountPremise = {
            'parentMode': 'LookUp',
            'pageTitle': 'Premise Search'
        };
        this.showCloseButton = true;
        this.businessDropdownDisabled = true;
        this.CallLogID = '';
        this.CustomerContactNumber = '';
        this.ServiceCoverNumber = '';
        this.ProductCode = '';
        this.ProductDesc = '';
        this.PostCode = '';
        this.SearchContactName = '';
        this.MyFilter = '';
        this.MyFilterPassed = '';
        this.MyFilterDisputed = '';
        this.MyFilterEmployeeCode = '';
        this.TeamID = '';
        this.LanguageCode = '';
        this.BranchNumber = '';
        this.BranchServiceAreaCode = '';
        this.FilterBranchNumber = '';
        this.ProspectNumber = '';
        this.MyContactType = '';
        this.DateFrom = '';
        this.DateTo = '';
        this.TicketReference = '';
        this.CompanyInvoiceNumber = '';
        this.OnDisputeReference = '';
        this.ContactTypeCodeSelectValue1 = '';
        this.ContactTypeDetailCodeSelectValue1 = '';
        this.ContactStatusCodeSelectValue1 = '';
        this.ContactTypeCodeSelectValue2 = '';
        this.ContactTypeDetailCodeSelectValue2 = '';
        this.ContactStatusCodeSelectValue2 = '';
        this.ContactTypeCodeSelectValue3 = '';
        this.ContactTypeDetailCodeSelectValue3 = '';
        this.ContactStatusCodeSelectValue3 = '';
        this.ContactTypeCodeSelectValue4 = '';
        this.ContactTypeDetailCodeSelectValue4 = '';
        this.ContactStatusCodeSelectValue4 = '';
        this.ContactTypeCodeSelectValue5 = '';
        this.ContactTypeDetailCodeSelectValue5 = '';
        this.ContactStatusCodeSelectValue5 = '';
        this.ContactTypeCodeSelectValue6 = '';
        this.ContactTypeDetailCodeSelectValue6 = '';
        this.ContactStatusCodeSelectValue6 = '';
        this.ContactTypeCodeSelectValue7 = '';
        this.ContactTypeDetailCodeSelectValue7 = '';
        this.ContactStatusCodeSelectValue7 = '';
        this.ContactTypeCodeSelectValue8 = '';
        this.ContactTypeDetailCodeSelectValue8 = '';
        this.ContactStatusCodeSelectValue8 = '';
        this.ContactTypeCodeSelectValue9 = '';
        this.ContactTypeDetailCodeSelectValue9 = '';
        this.ContactStatusCodeSelectValue9 = '';
        this.ContactTypeCodeSelectValue10 = '';
        this.ContactTypeDetailCodeSelectValue10 = '';
        this.ContactStatusCodeSelectValue10 = '';
        this.EmployeeCode = '';
        this.ServiceCoverRowID = '';
        this.collapsediv = true;
        this.showHeader = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.page = 1;
        this.totalItems = 1;
        this.maxColumn = 12;
        this.filterDisputedList = [];
        this.ReassignList = [];
        this.contactTypeList = [];
        this.MyfilterList = [{ text: 'All Open', value: 'allopen' }, { text: 'All Open & Closed', value: 'allopenclosed' }, { text: 'All Closed', value: 'allclosed' }, { text: 'Closed', value: 'close' }, { text: 'Open', value: 'open' }];
        this.filterPassedList1 = [{ text: 'All', value: 'all' }, { text: 'Passed', value: 'passed' }, { text: 'Not Passed', value: 'notpassed' }];
        this.filterPassedList = [{ text: 'All', value: 'all' }, { text: 'Any Action by', value: 'anyaction' }, { text: 'Current Owner is', value: 'currentowner' }, { text: 'Current Actioner is', value: 'currentactioner' }, { text: 'Created by', value: 'createdby' }];
        this.filterPassedList2 = [{ text: 'All', value: 'all' }, { text: 'Me', value: 'me' }, { text: 'My Employees', value: 'myemployees' }, { text: 'This Branch (Employee)', value: 'thisbranch' }, { text: 'This Branch (Service)', value: 'thisservbranch' }, { text: 'This Employee', value: 'thisemployee' }];
        this.ReassignSelectList = [{ text: 'All', value: 'All' }, { text: 'All Reassigned', value: 'AllReassigned' }, { text: 'Reassigned To', value: 'ReassignedTo' }, { text: 'Reassigned From', value: 'ReassignedFrom' }];
        this.myFilterDisputedList = [{ text: 'All Tickets', value: 'all' }, { text: 'With Invoices Currently On Dispute', value: 'ondispute' }, { text: 'With Invoices No Longer On Dispute', value: 'offdispute' }, { text: 'With Any Associated Invoices', value: 'onoffdispute' }];
        this.businessList = [];
        this.DateFilterList = [{ text: 'Action By Date', value: 'actionby' }, { text: 'Created Date', value: 'created' }];
        this.toDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
        this.fromDate = new Date(new Date().setMonth(new Date().getMonth() - 3));
        this.query = new URLSearchParams();
        this.inputParams = {
            'parentMode': '',
            'businessCode': this.utils.getBusinessCode(),
            'countryCode': this.utils.getCountryCode()
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
            operation: 'ContactManagement/iCABSCMCallCentreReviewGrid',
            module: 'call-centre',
            method: 'ccm/maintenance'
        };
        this.xhrParams = this.urlParams;
        this.spanSOPGridDisplay = true;
        this.myFilterDisputedEnable = false;
        this.gridHeaderClickedColumn = 'Ticket';
        this.gridSortOrder = 'Ascending';
        this.displayObj = {
            spanComplexSearch: false,
            spanStandardSearch: true
        };
        this.branchDefault = { id: '', text: '' };
        this.displayFlag = {
            'FilterBranchNumber': false,
            'MyFilterEmployeeCode': false,
            'TeamID': false,
            'EmployeeCode': false
        };
        this.errorClass = 'ng-invalid';
        this.formControlErrorFlag = {
            businessDropdown: false,
            contactTypeDropdown: false,
            MyFilter: false,
            MyFilterPassed: false,
            MyFilterDisputed: false,
            MyFilterLevel: false,
            MyFilterValue: false,
            MyFilterEmployeeCode: false,
            FilterBranchNumber: false,
            CallLogID: false,
            CustomerContactNumber: false,
            GroupAccountNumber: false,
            GroupName: false,
            SearchContactName: false,
            AccountNumber: false,
            AccountName: false,
            TicketReference: false,
            ContractName: false,
            PostCode: false,
            ProspectNumber: false,
            PremiseNumber: false,
            PremiseName: false,
            CompanyInvoiceNumber: false,
            OnDisputeReference: false,
            ProductCode: false,
            ReassignSelect: false,
            EmployeeCode: false,
            DateFilter: false,
            ProductDesc: false
        };
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            _this.storeData = data;
            _this.setFormData(_this.storeData);
        });
        this.DateFrom = this.utils.formatDate(this.fromDate);
        this.DateTo = this.utils.formatDate(this.toDate);
        this.contactTypeDropdown = 'all';
        this.MyFilter = this.MyfilterList[0].value;
        this.MyFilterPassed = this.filterPassedList1[0].value;
        this.MyFilterLevel = this.filterPassedList[3].value;
        this.MyFilterValue = this.filterPassedList2[1].value;
        this.ReassignSelect = this.ReassignSelectList[0].value;
        this.DateFilter = this.DateFilterList[0].value;
        this.vBusinessCode = this.utils.getBusinessCode();
        this.gUserCode = this.utils.getUserCode();
        this.countryCode = this.utils.getCountryCode();
        this.doLookup();
        this.getSysCharDtetails();
    }
    CentreReviewGridComponent.prototype.setEmployee = function (data) {
        this.MyFilterEmployeeCode = data.MyFilterEmployeeCode;
    };
    CentreReviewGridComponent.prototype.setEmployeeReassign = function (data) {
        this.EmployeeCode = data.MyFilterEmployeeCode;
    };
    CentreReviewGridComponent.prototype.setBranch = function (data) {
        this.FilterBranchNumber = data.BranchNumber;
    };
    CentreReviewGridComponent.prototype.onGroupAccount = function (data) {
        if (data.GroupName) {
            this.GroupAccountNumber = data.GroupAccountNumber;
            this.GroupName = data.GroupName;
        }
        else {
            this.GroupAccountNumber = data.GroupAccountNumber;
        }
    };
    CentreReviewGridComponent.prototype.setAccountNumber = function (data) {
        this.AccountNumber = data.AccountNumber;
        this.AccountName = data.AccountName;
        this.inputParamsContract.accountNumber = this.AccountNumber;
        this.inputParamsContract.accountName = this.AccountName;
        this.inputParamsAccountPremise['AccountNumber'] = this.AccountNumber;
        this.inputParamsAccountPremise['AccountName'] = this.AccountName;
    };
    CentreReviewGridComponent.prototype.onContractDataReceived = function (data) {
        this.ContractNumber = data.ContractNumber;
        this.ContractName = data.ContractName;
        this.AccountNumber = data.AccountNumber;
        this.inputParamsAccountPremise['ContractNumber'] = data.ContractNumber;
        this.inputParamsAccountPremise['ContractName'] = data.ContractName;
        this.inputParamsAccountPremise['AccountNumber'] = data.AccountNumber;
        this.GetAccountName();
    };
    CentreReviewGridComponent.prototype.onPremiseSearchDataReceived = function (data) {
        this.PremiseNumber = data.PremiseNumber;
        this.PremiseName = data.PremiseName;
    };
    CentreReviewGridComponent.prototype.onPremiseSearchDataReceivedFor = function (data) {
        this.ProductCode = data.PremiseNumber;
        this.ProductDesc = data.PremiseName;
    };
    CentreReviewGridComponent.prototype.window_onload = function () {
        this.vBusinessCode = this.utils.getBusinessCode();
    };
    CentreReviewGridComponent.prototype.myDateFormat = function (incriMonth) {
        var DateNew = new Date();
        var month = '' + (DateNew.getMonth() + (incriMonth));
        var day = '' + DateNew.getDate();
        var year = DateNew.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [month, day, year].join('/');
    };
    CentreReviewGridComponent.prototype.doLookup = function () {
        var _this = this;
        var vUserCode;
        var vUserName;
        var lookupIP = [{
                'table': 'UserAuthority',
                'query': { 'UserCode': this.gUserCode },
                'fields': ['UserCode', 'UserName', 'CurrentBusiness', 'BusinessCode', 'BusinessDesc']
            }];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var userAuthorityDataset = data[0];
            var _loop_1 = function(k) {
                var lookupIP_1 = [{
                        'table': 'Business',
                        'query': { 'BusinessCode': userAuthorityDataset[k].BusinessCode },
                        'fields': ['BusinessCode', 'BusinessDesc']
                    }];
                _this.LookUp.lookUpRecord(lookupIP_1).subscribe(function (data) {
                    var buisnessDataset = data[0];
                    if (buisnessDataset.length > 0) {
                        var lookupIP_2 = [{
                                'table': 'UserAuthorityBranch',
                                'query': { 'UserCode': userAuthorityDataset[k].UserCode, 'BusinessCode': userAuthorityDataset.BusinessCode },
                                'fields': ['BusinessCode']
                            }];
                        _this.LookUp.lookUpRecord(lookupIP_2).subscribe(function (data) {
                            var UserAuthorityBranchDataSet = data[0];
                            _this.businessList.push({ value: userAuthorityDataset[k].BusinessCode, text: buisnessDataset[0].BusinessDesc });
                            _this.businessDropdown = _this.utils.getBusinessCode();
                        });
                    }
                });
            };
            for (var k = 0; k < userAuthorityDataset.length; k++) {
                _loop_1(k);
            }
        });
        var lookupRegistryIP = [{
                'table': 'riRegistry',
                'query': { 'RegSection': 'CCM Disputed Invoices', 'RegKey': this.utils.getBusinessCode() + '_Enable CCM Dispute Processing' },
                'fields': ['RegValue']
            }];
        this.LookUp.lookUpRecord(lookupRegistryIP).subscribe(function (data) {
            var dataReturned = data[0];
            if (dataReturned.length > 0) {
                _this.myFilterDisputedEnable = dataReturned[0].RegValue === 'N' ? false : true;
            }
        });
        var lookUpUserInformation = [{
                'table': 'UserInformation',
                'query': { 'UserCode': this.utils.getUserCode() },
                'fields': ['LanguageCode']
            }];
        this.LookUp.lookUpRecord(lookUpUserInformation).subscribe(function (data) {
            var languageCode = '';
            if (data[0].length > 0) {
                languageCode = data[0][0]['LanguageCode'];
            }
            var lookupContactType = [{
                    'table': 'ContactType',
                    'query': {},
                    'fields': ['ContactTypeCode']
                }];
            _this.LookUp.lookUpRecord(lookupContactType).subscribe(function (data) {
                var contactTypDataset = data[0];
                for (var k = 0; k < contactTypDataset.length; k++) {
                    var lookupContactTypeLang = [{
                            'table': 'ContactTypeLang',
                            'query': { 'LanguageCode': languageCode, 'ContactTypeCode': contactTypDataset[k].ContactTypeCode },
                            'fields': ['ContactTypeCode', 'ContactTypeDesc']
                        }];
                    _this.LookUp.lookUpRecord(lookupContactTypeLang).subscribe(function (data) {
                        _this.contactTypeList.push({ text: data[0][0]['ContactTypeDesc'], value: data[0][0]['ContactTypeCode'] });
                    });
                }
            });
        });
    };
    CentreReviewGridComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [this.sysCharConstants.SystemCharCCMCallPipelineVsProspectGrid];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.vBusinessCode,
            countryCode: this.countryCode,
            SysCharList: sysCharList.toString()
        };
        this.SpeedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records[0];
            _this.vPipelineVSProspectGrid = record;
        });
    };
    CentreReviewGridComponent.prototype.cmdSOPGrid_OnClick = function () {
        if (this.vPipelineVSProspectGrid.length > 0) {
            alert('iCABSSPipelineGrid');
        }
        else {
            alert('iCABSSSOProspectGrid');
        }
    };
    CentreReviewGridComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
        this.getUrlParams();
        this.initPage();
        this.setSortOrder();
        this.MyFilterDisputed = 'all';
        this.getBranchDetails();
        this.BuildGrid(this.inputParams);
    };
    CentreReviewGridComponent.prototype.getBranchDetails = function () {
        var branchCode = this.utils.getBranchCode();
        this.FilterBranchNumber = branchCode;
        this.BranchNumber = branchCode;
        this.branchDefault.text = this.utils.getBranchText(branchCode);
        this.branchDefault.id = branchCode;
    };
    CentreReviewGridComponent.prototype.setSortOrder = function () {
        this.gridSortHeaders = [{
                'fieldName': 'grCallLogID',
                'colName': 'Log',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ContactActionNumber',
                'colName': 'Ticket',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ContactType',
                'colName': 'Type',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ContactName',
                'colName': 'Details',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'Actions',
                'colName': 'Act',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'CurrentActionEmployeeCode',
                'colName': 'Employee',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ActionByDateTime',
                'colName': 'Action by',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'CreatedDateTime',
                'colName': 'Created',
                'sortType': 'ASC'
            }];
    };
    CentreReviewGridComponent.prototype.getUrlParams = function () {
        var _this = this;
        this.activatedRoute.queryParams.subscribe(function (params) {
            if (params['parentMode'] !== undefined)
                _this.inputParams.parentMode = params['parentMode'];
            if (params['businessCode'] !== undefined)
                _this.inputParams.businessCode = params['businessCode'];
            if (params['countryCode'] !== undefined)
                _this.inputParams.countryCode = params['countryCode'];
        });
    };
    CentreReviewGridComponent.prototype.setFormData = function (data) {
        if (data['sentFromParent'] || this.inputParams.parentMode) {
            this.businessDropdownDisabled = false;
            switch (data['sentFromParent'].parentMode) {
                case 'Account':
                case 'Contract':
                case 'Premise':
                case 'InvoiceHistory':
                case 'WorkOrderMaintenanceContract':
                case 'WorkOrderMaintenanceAccount':
                    this.AccountNumber = data['data'].AccountNumber;
                    this.AccountName = data['data'].AccountName;
                    this.ContractNumber = data['data'].ContractNumber;
                    this.ContractName = data['data'].ContractName;
                    this.PremiseNumber = data['data'].PremiseNumber;
                    this.PremiseName = data['data'].PremiseName;
                    this.ProductCode = data['data'].ProductCode;
                    this.ProductDesc = data['data'].ProductDesc;
                    this.ServiceCoverNumber = data['data'].ServiceCoverNumber;
                    this.SetAllSCRowID(data['data'].ServiceCoverRowID);
                    if ((data['sentFromParent'].parentMode !== 'WorkOrderMaintenanceContract') || (data['sentFromParent'].parentMode !== 'WorkOrderMaintenanceAccount')) {
                        this.MyFilterLevel = 'currentactioner';
                        this.MyFilter = 'thisbranch';
                    }
                    if (data['sentFromParent'].parentMode === 'InvoiceHistory') {
                        this.MyFilterLevel = 'all';
                        this.MyFilter = 'allopenclosed';
                        this.CompanyInvoiceNumber = data['data'].ServiceCoverRowIDInvoiceNumber;
                    }
                    break;
                case 'ServiceCover':
                    this.AccountNumber = data['data'].AccountNumber;
                    this.AccountName = data['data'].AccountName;
                    this.ContractNumber = data['data'].ContractNumber;
                    this.ContractName = data['data'].ContractName;
                    this.PremiseNumber = data['data'].PremiseNumber;
                    this.PremiseName = data['data'].PremiseName;
                    this.ProductCode = data['data'].ProductCode;
                    this.ProductDesc = data['data'].ProductDesc;
                    this.ServiceCoverNumber = data['data'].ServiceCoverNumber;
                    this.SetAllSCRowID(data['data'].CurrentServiceCoverRowID);
                    this.MyFilterLevel = 'currentactioner';
                    this.MyFilter = 'thisbranch';
                    break;
                case 'PipelineProspectGrid':
                case 'ProspectGrid':
                    this.MyFilterLevel = 'currentactioner';
                    this.MyFilter = 'me';
                    this.spanSOPGridDisplay = false;
                    break;
                case 'WorkOrderMaintenanceProspect':
                    this.ProspectNumber = data['data'].ProspectNumber;
                    break;
                case 'WorkOrderMaintenanceCustomerContact':
                    this.CustomerContactNumber = data['data'].CustomerContactNumber;
                    break;
                default:
            }
        }
    };
    CentreReviewGridComponent.prototype.SetAllSCRowID = function (ipRowID) {
        this.attrServiceCoverNumberSCRowID = ipRowID;
        this.attrProductCodeServiceCoverRowID = ipRowID;
        this.ServiceCoverNumber = ipRowID;
        this.ServiceCoverRowID = ipRowID;
    };
    CentreReviewGridComponent.prototype.initPage = function () {
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
                break;
            case 'WorkOrderMaintenanceContract':
            case 'WorkOrderMaintenanceAccount':
                break;
            case 'ServiceCover':
                break;
            case 'PipelineProspectGrid':
            case 'ProspectGrid':
                break;
            case 'WorkOrderMaintenanceProspect':
                break;
            case 'WorkOrderMaintenanceCustomerContact':
                break;
            default:
        }
    };
    CentreReviewGridComponent.prototype.BuildGrid = function (params) {
        if (params) {
            this.inputParams = params;
        }
        this.inputParams.module = this.urlParams.module;
        this.inputParams.method = this.urlParams.method;
        this.inputParams.operation = this.urlParams.operation;
        this.query.set('businessCode', this.utils.getBusinessCode());
        this.query.set('countryCode', this.utils.getCountryCode());
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
        this.query.set('BranchNumber', this.utils.getBranchCode());
        this.query.set('BranchServiceAreaCode', this.BranchServiceAreaCode);
        this.query.set('FilterBranchNumber', this.FilterBranchNumber);
        this.query.set('ProspectNumber', this.ProspectNumber);
        this.query.set('MyContactType', this.contactTypeDropdown);
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
        this.query.set('riGridHandle', '1444390');
        this.query.set('action', '2');
        this.query.set(this.serviceConstants.GridHeaderClickedColumn, this.gridHeaderClickedColumn);
        this.query.set(this.serviceConstants.GridSortOrder, this.gridSortOrder);
        this.inputParams.search = this.query;
        this.callCentreReviewGrid.loadGridData(this.inputParams);
    };
    CentreReviewGridComponent.prototype.getGridInfo = function (value) {
        this.totalItems = value.totalRows;
    };
    CentreReviewGridComponent.prototype.dblClickGridRow = function (data) {
        var rowData = data.rowData;
        var columnSected = data.columnClicked.text;
        if (data.cellData.text === 'info') {
            var eventObj = void 0;
            eventObj = {
                data: {
                    rowID: ''
                }
            };
            eventObj.data.rowID = data.rowIndex;
            this.informationModal(eventObj);
        }
        else {
            switch (columnSected) {
                case 'Log':
                    if (data.cellData.text !== '' && data.cellData.text !== '0')
                        this.router.navigate(['/ccm/callcentersearch'], { queryParams: { parentMode: 'CallCentreReview' } });
                    break;
                case 'Ticket':
                    alert('Screen not available: iCABSCMCustomerContactMaintenance');
                    break;
                case 'Act':
                    alert('Screen not available: iCABSCMCustomerContactDetailGrid');
                    break;
                default:
                    if (columnSected.indexOf('O/S↵COs') > -1) {
                        if (data.cellData['rowID'] !== '1') {
                            alert('Screen not available: iCABSCMCallOutMaintenance');
                        }
                    }
                    break;
            }
        }
    };
    CentreReviewGridComponent.prototype.informationModal = function (eventObj) {
        var cellData;
        cellData = this.callCentreReviewGrid.getCellInfoForSelectedRow(eventObj.data.rowID, 2);
        var tooltipText = '<div class="raw-wrap">' + cellData.text + '</div>';
        if (cellData.toolTip) {
            tooltipText = '<div class="raw-wrap">' + cellData.text + '\n' + cellData.toolTip + '</div>';
        }
        this.showAlert(tooltipText);
    };
    CentreReviewGridComponent.prototype.getCurrentPage = function (curPage) {
        this.query.set('PageCurrent', curPage.value);
        this.inputParams.search = this.query;
        this.callCentreReviewGrid.loadGridData(this.inputParams);
    };
    CentreReviewGridComponent.prototype.toDateSelectedValue = function (value) {
        if (value)
            this.DateTo = value.value;
    };
    CentreReviewGridComponent.prototype.fromDateSelectedValue = function (value) {
        if (value) {
            this.DateFrom = value.value;
            try {
                var dateArr = value.value.split('/');
                this.toDate = new Date(parseInt(dateArr[2]), (parseInt(dateArr[1]) + 4) - 1, parseInt(dateArr[0]));
            }
            catch (errorHandler) {
                this.toDate = new Date(new Date().setMonth(new Date(Date.parse(value.value)).getMonth() + 3));
            }
        }
    };
    CentreReviewGridComponent.prototype.onSubmit = function (formdata, valid, event) {
        event.preventDefault();
    };
    CentreReviewGridComponent.prototype.onChange = function (eventobject, value) {
        var selectedValue = '';
        switch (value) {
            case 'businessDropdown':
                selectedValue = this.businessDropdown;
                break;
            case 'contactType':
                selectedValue = this.contactTypeDropdown;
                if (selectedValue === 'Multiple Search') {
                    this.displayObj = {
                        spanComplexSearch: true,
                        spanStandardSearch: false
                    };
                    this.cmdComplexOnClick();
                }
                else {
                    this.displayObj = {
                        spanComplexSearch: false,
                        spanStandardSearch: true
                    };
                }
                break;
            case 'Myfilter':
                selectedValue = this.MyFilter;
                break;
            case 'MyFilterPassed':
                selectedValue = this.MyFilterPassed;
                break;
            case 'MyFilterDisputed':
                selectedValue = this.MyFilterDisputed;
                break;
            case 'MyFilterDisputed':
                selectedValue = this.MyFilterDisputed;
                break;
            case 'MyFilterLevel':
                selectedValue = this.MyFilterLevel;
                break;
            case 'MyFilterValue':
                selectedValue = this.MyFilterValue;
                this.getBranchDetails();
                switch (selectedValue) {
                    case 'me':
                    case 'myemployees':
                        this.displayFlag['FilterBranchNumber'] = false;
                        this.displayFlag['MyFilterEmployeeCode'] = false;
                        this.displayFlag['TeamID'] = false;
                        break;
                    case 'thisservbranch':
                    case 'thisbranch':
                        this.displayFlag['FilterBranchNumber'] = true;
                        this.displayFlag['MyFilterEmployeeCode'] = false;
                        this.displayFlag['TeamID'] = false;
                        break;
                    case 'thisemployee':
                        this.displayFlag['FilterBranchNumber'] = false;
                        this.displayFlag['MyFilterEmployeeCode'] = true;
                        this.displayFlag['TeamID'] = false;
                        break;
                    case 'thisteam':
                        this.displayFlag['FilterBranchNumber'] = false;
                        this.displayFlag['MyFilterEmployeeCode'] = false;
                        this.displayFlag['TeamID'] = true;
                        break;
                    default:
                        this.displayFlag['FilterBranchNumber'] = false;
                        this.displayFlag['MyFilterEmployeeCode'] = false;
                        this.displayFlag['TeamID'] = false;
                        break;
                }
                break;
            case 'ReassignSelect':
                selectedValue = this.ReassignSelect;
                switch (selectedValue) {
                    case 'All':
                    case 'AllReassigned':
                        this.displayFlag['EmployeeCode'] = false;
                        this.EmployeeCode = '';
                        break;
                    case 'ReassignedTo':
                    case 'ReassignedFrom':
                        this.displayFlag['EmployeeCode'] = true;
                        break;
                    default:
                        break;
                }
                break;
            case 'DateFilter':
                selectedValue = this.DateFilter;
                break;
            default:
                break;
        }
    };
    CentreReviewGridComponent.prototype.getRefreshData = function () {
        this.BuildGrid(this.inputParams);
    };
    CentreReviewGridComponent.prototype.closeSection = function (newValue) {
        if (this.collapsediv === newValue) {
            this.collapsediv = false;
        }
        else {
            this.collapsediv = newValue;
        }
    };
    CentreReviewGridComponent.prototype.showAlert = function (msgTxt) {
        this.messageModal.show({ msg: msgTxt, title: 'Contact Information' }, false);
    };
    CentreReviewGridComponent.prototype.cmdComplexOnClick = function () {
        this.messageModal.show({ msg: 'Page iCABSCMCallCentreReviewGridMulti is under construction', title: 'Message' }, false);
    };
    CentreReviewGridComponent.prototype.sortGrid = function (data) {
        this.query.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.gridHeaderClickedColumn = data.fieldname;
        this.query.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        this.gridSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.BuildGrid(this.inputParams);
    };
    CentreReviewGridComponent.prototype.clearDescription = function (name) {
        var _this = this;
        switch (name) {
            case 'GroupAccountNumber':
                if (this.GroupAccountNumber.length === 0 || this.GroupAccountNumber === '')
                    this.GroupName = '';
                else
                    this.GetGroupAccountName();
                break;
            case 'AccountNumber':
                if (this.AccountNumber.length === 0 || this.AccountNumber === '') {
                    this.zone.run(function () {
                        _this.AccountNumber = '';
                        _this.AccountName = '';
                        _this.inputParamsContract = {
                            'parentMode': 'LookUp-All',
                            'pageTitle': 'Contract Entry',
                            'currentContractType': 'C',
                            'showAddNew': true,
                            'accountNumber': '',
                            'accountName': ''
                        };
                        if (_this.contractSearchEllipse && _this.contractSearchEllipse !== undefined)
                            _this.contractSearchEllipse.updateComponent();
                    });
                }
                else {
                    this.AccountNumber = this.utils.numberPadding(this.AccountNumber, 9);
                    this.GetAccountName();
                }
                break;
            case 'ContractNumber':
                if (this.ContractNumber.length === 0 || this.ContractNumber === '')
                    this.ContractName = '';
                else {
                    this.ContractNumber = this.utils.numberPadding(this.ContractNumber, 8);
                    this.GetContractName();
                }
                break;
            case 'PremiseNumber':
                if (this.PremiseNumber.length === 0 || this.PremiseNumber === '')
                    this.PremiseName = '';
                else
                    this.GetPremiseName();
                break;
            case 'ProductCode':
                if (this.ProductCode.length === 0 || this.ProductCode === '')
                    this.ProductDesc = '';
                else
                    this.GetServiceCoverNumberFromRecord();
                break;
            default:
                break;
        }
    };
    CentreReviewGridComponent.prototype.GetGroupAccountName = function () {
        var _this = this;
        var search = new URLSearchParams();
        search.set('businessCode', this.utils.getBusinessCode());
        search.set('countryCode', this.utils.getCountryCode());
        search.set('action', '0');
        search.set('Function', 'GetGroupName');
        search.set('groupAccountNumber', this.GroupAccountNumber);
        this.httpService.xhrGet(this.urlParams.method, this.urlParams.module, this.urlParams.operation, search).then(function (data) {
            if (data.hasOwnProperty('errorMessage') && data.errorMessage !== '') {
                _this.GroupAccountNumber = '';
                _this.GroupName = '';
                _this.showAlert(data.errorMessage);
                _this.formControlErrorFlag.GroupAccountNumber = true;
            }
            else {
                _this.GroupName = data.GroupName;
                _this.formControlErrorFlag.GroupAccountNumber = false;
            }
        });
    };
    CentreReviewGridComponent.prototype.GetAccountName = function () {
        var _this = this;
        var search = new URLSearchParams();
        search.set('businessCode', this.utils.getBusinessCode());
        search.set('countryCode', this.utils.getCountryCode());
        search.set('action', '0');
        search.set('Function', 'GetAccountNameAndGroupAccountDetails');
        search.set('AccountNumber', this.AccountNumber);
        this.httpService.xhrGet(this.urlParams.method, this.urlParams.module, this.urlParams.operation, search).then(function (data) {
            if (data.hasOwnProperty('errorMessage') && data.errorMessage !== '') {
                _this.AccountName = '';
                _this.GroupAccountNumber = '';
                _this.GroupName = '';
                _this.showAlert(data.errorMessage);
                _this.formControlErrorFlag.AccountNumber = true;
            }
            else {
                _this.AccountName = data.AccountName;
                _this.GroupAccountNumber = data.GroupAccountNumber;
                _this.GroupName = data.GroupName;
                _this.formControlErrorFlag.AccountNumber = false;
            }
        });
    };
    CentreReviewGridComponent.prototype.GetContractName = function () {
        var _this = this;
        var lookupIP = [{
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.ContractNumber
                },
                'fields': ['ContractNumber', 'ContractName']
            }];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            var record = data[0];
            if (record.length > 0) {
                record = record[0];
                _this.ContractName = record.ContractName;
                _this.formControlErrorFlag.ContractNumber = false;
            }
            else {
                _this.ContractNumber = '';
                _this.ContractName = '';
                _this.showAlert('Record Not Found');
                _this.formControlErrorFlag.ContractNumber = true;
            }
            ;
        });
    };
    CentreReviewGridComponent.prototype.GetPremiseName = function () {
        var _this = this;
        if (this.ContractNumber === '' || typeof this.ContractNumber === 'undefined') {
            this.showAlert('Record Not Found');
            return;
        }
        ;
        var lookupIP = [{
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.ContractNumber,
                    'PremiseNumber': this.PremiseNumber
                },
                'fields': ['PremiseNumber', 'PremiseName']
            }];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            var record = data[0];
            if (record.length > 0) {
                record = record[0];
                _this.PremiseName = record.PremiseName;
                _this.formControlErrorFlag.PremiseNumber = false;
            }
            else {
                _this.PremiseNumber = '';
                _this.PremiseName = '';
                _this.showAlert('Record Not Found');
                _this.formControlErrorFlag.PremiseNumber = true;
            }
            ;
        });
    };
    CentreReviewGridComponent.prototype.GetServiceCoverNumberFromRecord = function () {
        var _this = this;
        var search = new URLSearchParams();
        search.set('businessCode', this.utils.getBusinessCode());
        search.set('countryCode', this.utils.getCountryCode());
        search.set('action', '6');
        search.set('Function', 'GetServiceCoverFromRecord');
        search.set('ContractNumber', this.ContractNumber);
        search.set('PremiseNumber', this.PremiseNumber);
        search.set('ProductCode', this.ProductCode);
        this.httpService.xhrGet(this.urlParams.method, this.urlParams.module, this.urlParams.operation, search).then(function (data) {
            switch (data.ServiceCoverNumber) {
                case '-1':
                    _this.formControlErrorFlag.ProductCode = false;
                    _this.GetServiceCoverNumberFromRowID();
                    break;
                case '0':
                    _this.formControlErrorFlag.ProductCode = true;
                    break;
                default:
                    _this.formControlErrorFlag.ProductCode = false;
                    _this.ProductDesc = data.ProductDesc;
                    _this.SetAllSCRowID(data.ServiceCoverRowID);
            }
        });
    };
    CentreReviewGridComponent.prototype.GetServiceCoverNumberFromRowID = function () {
        var _this = this;
        var search = new URLSearchParams();
        search.set('businessCode', this.utils.getBusinessCode());
        search.set('countryCode', this.utils.getCountryCode());
        search.set('action', '6');
        search.set('Function', 'GetServiceCoverFromRowID');
        search.set('SCRowID', this.attrProductCodeSCRowID);
        this.httpService.xhrGet(this.urlParams.method, this.urlParams.module, this.urlParams.operation, search).then(function (data) {
            if (data.hasOwnProperty('errorMessage') && data.errorMessage !== '') {
                _this.showAlert(data.errorMessage);
            }
            else {
                _this.ServiceCoverNumber = data.ServiceCoverNumber;
                _this.ProductDesc = data.ProductDesc;
                _this.SetAllSCRowID(_this.attrProductCodeSCRowID);
            }
        });
    };
    CentreReviewGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSCMCallCentreReviewGrid.html',
                    styles: ["\n    :host /deep/ .gridtable tbody tr td:nth-child(1) input,\n    :host /deep/ .gridtable tbody tr td:nth-child(2) input,\n    :host /deep/ .gridtable tbody tr td:nth-child(7) input {\n        text-align: center;\n    }\n    :host /deep/ .gridtable tbody tr td:nth-child(1) div,\n    :host /deep/ .gridtable tbody tr td:nth-child(2) div,\n    :host /deep/ .gridtable tbody tr td:nth-child(7) div {\n        background: #FFF;\n    }\n    :host /deep/ .gridtable tbody tr td:nth-child(3),\n    :host /deep/ .gridtable tbody tr td:nth-child(4),\n    :host /deep/ .gridtable tbody tr td:nth-child(6),\n    :host /deep/ .gridtable tbody tr td:nth-child(8),\n    :host /deep/ .gridtable tbody tr td:nth-child(9),\n    :host /deep/ .gridtable tbody tr td:nth-child(10) {\n        text-align: left;\n    }\n  "]
                },] },
    ];
    CentreReviewGridComponent.ctorParameters = [
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: ErrorService, },
        { type: MessageService, },
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
        { type: SysCharConstants, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: LookUp, },
        { type: SpeedScript, },
        { type: CBBService, },
    ];
    CentreReviewGridComponent.propDecorators = {
        'callCentreReviewGrid': [{ type: ViewChild, args: ['callCentreReviewGrid',] },],
        'callCentreReviewPagination': [{ type: ViewChild, args: ['callCentreReviewPagination',] },],
        'groupNameEllipsis': [{ type: ViewChild, args: ['GroupNameEllipsis',] },],
        'premiseNumberEllipsis': [{ type: ViewChild, args: ['PremiseNumberEllipsis',] },],
        'employeeSearchComponentEllipse': [{ type: ViewChild, args: ['employeeSearchComponentEllipse',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'BranchNumberDropdwon': [{ type: ViewChild, args: ['BranchNumberDropdwon',] },],
        'contractSearchEllipse': [{ type: ViewChild, args: ['contractSearchEllipse',] },],
    };
    return CentreReviewGridComponent;
}());
