import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { PremiseSearchComponent } from '../../search/iCABSAPremiseSearch';
import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Logger } from '@nsalaun/ng2-logger';
import { Store } from '@ngrx/store';
import { ComponentInteractionService } from '../../../../shared/services/component-interaction.service';
import { HttpService } from './../../../../shared/services/http-service';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { Utils } from '../../../../shared/services/utility';
import { LookUp } from './../../../../shared/services/lookup';
import { SysCharConstants } from './../../../../shared/constants/syscharservice.constant';
import { SpeedScript } from '../../../../shared/services/speedscript';
import { RiExchange } from '../../../../shared/services/riExchange';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { ContractManagementModuleRoutes } from '../../../base/PageRoutes';
export var ContractServiceSummaryComponent = (function () {
    function ContractServiceSummaryComponent(route, serviceConstants, router, translate, fb, utils, logger, LookUp, xhr, store, sysCharConstants, SpeedScript, riExchange, location, componentInteractionService, global) {
        var _this = this;
        this.route = route;
        this.serviceConstants = serviceConstants;
        this.router = router;
        this.translate = translate;
        this.fb = fb;
        this.utils = utils;
        this.logger = logger;
        this.LookUp = LookUp;
        this.xhr = xhr;
        this.store = store;
        this.sysCharConstants = sysCharConstants;
        this.SpeedScript = SpeedScript;
        this.riExchange = riExchange;
        this.location = location;
        this.componentInteractionService = componentInteractionService;
        this.global = global;
        this.premiseSearchComponent = PremiseSearchComponent;
        this.telesalesOrderSearchComponent = ScreenNotReadyComponent;
        this.inputParamsPremise = {};
        this.inputParamsTelesalesOrderNumber = {};
        this.currentPage = 1;
        this.maxColumn = 14;
        this.gridSortHeaders = [];
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalRecords = 0;
        this.headerClicked = '';
        this.sortType = 'ASC';
        this.backLinkText = '';
        this.backLinkUrl = '';
        this.queryLookUp = new URLSearchParams();
        this.xhrParams = {
            module: 'report',
            method: 'service-delivery/grid',
            operation: 'Application/iCABSAContractServiceSummary'
        };
        this.uiDisplay = {
            tdServiceDetail: true,
            tdAnnualValue: true,
            tdAnnualValueLab: true,
            tdTelesalesOrderLab: false,
            tdTelesalesOrder: false,
            ServiceCoverRowID: false,
            RunningReadOnly: false,
            vAllowUserAuthView: false,
            CallLogID: false,
            CurrentCallLogID: false
        };
        this.negBranch = {
            params: {
                'parentMode': 'AddContractFromAccount',
                'pageTitle': 'Contract Entry',
                'pageHeader': 'Contract Maintenance',
                'currentContractType': 'C',
                'currentContractTypeURLParameter': '<contract>',
                'showAddNew': true
            },
            active: {
                id: '',
                text: ''
            },
            brnCode: 0,
            brnName: '',
            disabled: false,
            required: true
        };
        this.StatusSearchTypeList = [];
        this.componentInteractionService.emitMessage(false);
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            if (data) {
                _this.storeData = data;
            }
        });
    }
    ContractServiceSummaryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.uiForm = this.fb.group({});
        this.initForm();
        this.riExchange.getStore('contract');
        this.translate.setUpTranslation();
        this.window_onload();
    };
    ContractServiceSummaryComponent.prototype.ngOnDestroy = function () {
        if (this.sub) {
            this.sub.unsubscribe();
        }
        if (this.subLookup) {
            this.subLookup.unsubscribe();
        }
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        if (this.subXhr) {
            this.subXhr.unsubscribe();
        }
        if (this.subLookupContract) {
            this.subLookupContract.unsubscribe();
        }
        if (this.subLookupDetails) {
            this.subLookupDetails.unsubscribe();
        }
        if (this.subXhrDesc) {
            this.subXhrDesc.unsubscribe();
        }
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
        this.riExchange.killStore();
    };
    ContractServiceSummaryComponent.prototype.initForm = function () {
        var controls = [
            'ContractNumber',
            'ContractName',
            'AccountNumber',
            'AccountName',
            'ContractAnnualValue',
            'InvoiceFrequencyCode',
            'InvoiceAnnivDate',
            'PremiseNumber',
            'PremiseName',
            'TelesalesOrderNumber',
            'StatusSearchType',
            'LOSCodeSel',
            'DetailInd',
            'menu',
            'ServiceCoverRowID',
            'RunningReadOnly',
            'vAllowUserAuthView',
            'CallLogID',
            'CurrentCallLogID'
        ];
        for (var i = 0; i < controls.length; i++) {
            this.riExchange.riInputElement.Add(this.uiForm, controls[i]);
        }
    };
    ContractServiceSummaryComponent.prototype.window_onload = function () {
        this.doLookup();
        this.getSysCharDtetails();
        var ContractObject = {
            type: this.routeParams.currentContractType,
            label: this.utils.getCurrentContractLabel(this.routeParams.currentContractType)
        };
        this.utils.setTitle(ContractObject.label + ' Contract Service Summary');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallLogID', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'CurrentCallLogID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentCallLogID', this.riExchange.GetParentHTMLInputValue(this.routeParams, 'CurrentCallLogID'));
        var ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'Inter-CompanyPortfolio':
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractAnnualValue');
                break;
            default:
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractNumber');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractName');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'ContractAnnualValue');
                this.riExchange.renderParentFields(this.routeParams, this.uiForm, 'RunningReadOnly');
        }
        this.inputParamsPremise['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.inputParamsPremise['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
        this.GetContractFields();
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractAnnualValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceFrequencyCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceAnnivDate');
        this.negBranch.disabled = true;
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'menu', 'Options');
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Restricted' &&
            parseInt(this.riExchange.ClientSideValues.Fetch('BranchNumber'), 0) !== this.negBranch.brnCode) {
            this.uiDisplay.tdAnnualValue = false;
            this.uiDisplay.tdAnnualValueLab = false;
        }
        else {
            this.uiDisplay.tdAnnualValue = true;
            this.uiDisplay.tdAnnualValueLab = true;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesOrderNumber', 0);
        this.iCABSTelesalesEntry();
        this.StatusSearchTypeList = [
            { value: '', label: 'All' },
            { value: 'L', label: 'Current' },
            { value: 'FL', label: 'Forward Current' },
            { value: 'D', label: 'Deleted' },
            { value: 'FD', label: 'Forward Deleted' },
            { value: 'PD', label: 'Pending Deletion' },
            { value: 'T', label: 'Terminated' },
            { value: 'FT', label: 'Forward Terminated' },
            { value: 'PT', label: 'Pending Termination' },
            { value: 'C', label: 'Cancelled' }
        ];
        this.uiForm.controls['StatusSearchType'].setValue(this.StatusSearchTypeList[0].value);
        this.applyGridFilter();
    };
    ContractServiceSummaryComponent.prototype.doLookup = function () {
        var _this = this;
        var lookupIP = [{
                'table': 'UserAuthority',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'UserCode': this.utils.getUserCode() },
                'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
            },
            {
                'table': 'ProductComponent',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ProductCode']
            },
            {
                'table': 'LineOfService',
                'query': { 'ValidForBusiness': this.utils.getBusinessCode() },
                'fields': ['LOSCode', 'LOSName']
            }];
        this.subLookup = this.LookUp.lookUpRecord(lookupIP, 100, this.storeData ? this.storeData['code'] : null).subscribe(function (data) {
            _this.glAllowUserAuthView = false;
            _this.glAllowUserAuthUpdate = false;
            var recordSet_UserAuthority = data[0];
            if (recordSet_UserAuthority.length > 0) {
                var record = recordSet_UserAuthority[0];
                _this.glAllowUserAuthView = record.hasOwnProperty('AllowViewOfSensitiveInfoInd') ? record['AllowViewOfSensitiveInfoInd'] : false;
                _this.glAllowUserAuthUpdate = record.hasOwnProperty('AllowUpdateOfContractInfoInd') ? record['AllowUpdateOfContractInfoInd'] : false;
            }
            _this.glCompositesInUse = false;
            var recordSet_ProductComponent = data[1];
            if (recordSet_ProductComponent.length > 0) {
                var record = recordSet_ProductComponent[0];
                _this.glCompositesInUse = record.hasOwnProperty('ProductCode') ? true : false;
            }
            _this.CompositesInUse = _this.glCompositesInUse;
            _this.LineOfService = [];
            var recordSet_LineOfService = data[2];
            if (recordSet_LineOfService.length > 0) {
                for (var j = 0; j < recordSet_LineOfService.length; j++) {
                    var record = recordSet_LineOfService[j];
                    if (record.hasOwnProperty('LOSCode')) {
                        _this.LineOfService.push({ 'LOSCode': record['LOSCode'], 'LOSName': record['LOSName'] });
                    }
                }
            }
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'vAllowUserAuthView', _this.glAllowUserAuthView);
            _this.loadGrid();
            if (_this.glAllowUserAuthView) {
                _this.uiDisplay.tdAnnualValueLab = true;
                _this.uiDisplay.tdAnnualValue = true;
            }
            else {
                _this.uiDisplay.tdAnnualValueLab = false;
                _this.uiDisplay.tdAnnualValue = false;
            }
        });
    };
    ContractServiceSummaryComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [this.sysCharConstants.SystemCharEnableServiceCoverDetail];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.SpeedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records[0];
            _this.vSCEnableServiceCoverDetail = record.Required;
            _this.ReqDetail = record.Required;
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'DetailInd', _this.ReqDetail);
            _this.uiDisplay.tdServiceDetail = _this.ReqDetail;
        });
    };
    ContractServiceSummaryComponent.prototype.iCABSTelesalesEntry = function () {
        var _this = this;
        var xhrParams = {};
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'CheckIsTelesalesPSale');
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.subXhr = this.xhr.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            if (data.hasOwnProperty('TelesalesInd')) {
                if (data.TelesalesInd === 'Y') {
                    _this.uiDisplay.tdTelesalesOrder = true;
                    _this.uiDisplay.tdTelesalesOrder = true;
                }
                else {
                    _this.uiDisplay.tdTelesalesOrder = false;
                    _this.uiDisplay.tdTelesalesOrder = false;
                }
            }
        });
    };
    ContractServiceSummaryComponent.prototype.GetContractFields = function () {
        var _this = this;
        var AccountNumber = '';
        var BusinessCode = '';
        var ContractNumber = '';
        var InvoiceAnnivDate = '';
        var InvoiceFrequencyCode = '';
        var NegBranchNumber = '';
        var AccountName = '';
        var BranchName = '';
        var lookupIP_contract = [{
                'table': 'Contract',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') },
                'fields': ['BusinessCode', 'ContractNumber', 'AccountNumber', 'NegBranchNumber', 'InvoiceAnnivDate', 'InvoiceFrequencyCode']
            }];
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_contract, 100, this.storeData ? this.storeData['code'] : null).subscribe(function (data) {
            if (data.length > 0) {
                var resp = data[0];
                if (resp.length > 0) {
                    var record = resp[0];
                    AccountNumber = record.AccountNumber;
                    BusinessCode = record.BusinessCode;
                    ContractNumber = record.ContractNumber;
                    InvoiceAnnivDate = record.InvoiceAnnivDate;
                    InvoiceFrequencyCode = record.InvoiceFrequencyCode;
                    NegBranchNumber = record.NegBranchNumber;
                    if (InvoiceAnnivDate) {
                        if (window['moment'](InvoiceAnnivDate, 'YYYY-MM-DD', true).isValid()) {
                            InvoiceAnnivDate = _this.utils.formatDate(InvoiceAnnivDate);
                        }
                    }
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyCode', InvoiceFrequencyCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceAnnivDate', InvoiceAnnivDate);
                    _this.negBranch.brnCode = parseInt(NegBranchNumber, 0);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountNumber', AccountNumber);
                    var lookupIP_details = [{
                            'table': 'Account',
                            'query': { 'AccountNumber': AccountNumber },
                            'fields': ['AccountNumber', 'AccountName']
                        },
                        {
                            'table': 'Branch',
                            'query': { 'BranchNumber': NegBranchNumber },
                            'fields': ['BranchNumber', 'BusinessCode', 'BranchName']
                        }];
                    _this.subLookupDetails = _this.LookUp.lookUpRecord(lookupIP_details, 100, _this.storeData ? _this.storeData['code'] : null).subscribe(function (data) {
                        if (data.length > 0) {
                            var AcctDtls = data[0];
                            if (AcctDtls.length > 0) {
                                var acctRecord = AcctDtls[0];
                                AccountName = acctRecord.AccountName;
                            }
                            var BranchDtls = data[1];
                            if (BranchDtls.length > 0) {
                                var brnRecord = BranchDtls[0];
                                BranchName = brnRecord.BranchName;
                            }
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NegBranchName', BranchName);
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'AccountName', AccountName);
                            _this.negBranch.brnCode = parseInt(NegBranchNumber, 0);
                            _this.negBranch.brnName = BranchName;
                            _this.negBranch.active = {
                                id: '',
                                text: _this.negBranch.brnCode + ' - ' + _this.negBranch.brnName
                            };
                        }
                    });
                }
            }
        });
    };
    ContractServiceSummaryComponent.prototype.loadGrid = function () {
        this.Grid.clearGridData();
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('FullAccess', this.riExchange.ClientSideValues.Fetch('FullAccess'));
        search.set('LoggedInBranch', this.riExchange.ClientSideValues.Fetch('BranchNumber'));
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        search.set('PortfolioStatusCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusSearchType'));
        search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        search.set('DetailInd', (this.riExchange.riInputElement.GetValue(this.uiForm, 'DetailInd') ? 'True' : 'False'));
        search.set('Level', 'Contract');
        search.set('AllowUserAuthView', (this.riExchange.riInputElement.GetValue(this.uiForm, 'vAllowUserAuthView') ? 'True' : 'False'));
        search.set('LOSCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSCodeSel'));
        search.set('TelesalesOrderNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'TelesalesOrderNumber'));
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('PageSize', this.global.AppConstants().tableConfig.itemsPerPage);
        search.set('PageCurrent', this.page.toString());
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        search.set(this.serviceConstants.GridSortOrder, this.sortType);
        this.setMaxColCount();
        var gridIP = {
            method: this.xhrParams.method,
            operation: this.xhrParams.operation,
            module: this.xhrParams.module,
            search: search
        };
        this.Grid.loadGridData(gridIP);
    };
    ContractServiceSummaryComponent.prototype.applyGridFilter = function () {
        var objProdCode = {
            'fieldName': 'ProductCode',
            'colName': 'Product\nCode',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objProdCode);
        var objCommenceDt = {
            'fieldName': 'ServiceCommenceDate',
            'colName': 'Commence\nDate',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objCommenceDt);
    };
    ContractServiceSummaryComponent.prototype.setMaxColCount = function () {
        var count = 14;
        var ParentMode = this.riExchange.ParentMode(this.routeParams);
        if (ParentMode === 'Contract' || ParentMode === 'Inter-CompanyPortfolio') {
            count++;
        }
        if (this.CompositesInUse) {
            count++;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'DetailInd')) {
            count++;
        }
        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusSearchType')) {
            count++;
        }
        this.maxColumn = count;
    };
    ContractServiceSummaryComponent.prototype.onGridRowClick = function (data) {
        var mode = '';
        mode = (data.cellIndex === 0) ? 'PremiseNumber' : mode;
        mode = (data.cellIndex === 1) ? 'ProductCode' : mode;
        mode = (data.cellIndex === 8) ? 'ServiceAnnualValue' : mode;
        mode = (data.cellIndex === 14) ? 'Information' : mode;
        this.openPage(mode, data);
    };
    ContractServiceSummaryComponent.prototype.refreshGrid = function () {
        this.currentPage = 1;
        this.headerClicked = '';
        this.loadGrid();
    };
    ContractServiceSummaryComponent.prototype.sortGrid = function (obj) {
        this.headerClicked = obj.fieldname;
        this.sortType = obj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadGrid();
    };
    ContractServiceSummaryComponent.prototype.menu_onchange = function (e) {
        var selectedVal = this.riExchange.riInputElement.GetValue(this.uiForm, 'menu');
        switch (selectedVal) {
            case 'AddRecord':
                this.cmdAddRecord_onclick(e);
                break;
        }
    };
    ContractServiceSummaryComponent.prototype.showDetails_onclick = function (e) {
        this.Grid.clearGridData();
    };
    ContractServiceSummaryComponent.prototype.cmdAddRecord_onclick = function (e) {
        var PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        if (PremiseNumber === '' || PremiseNumber === null) {
            this.PremiseNumber.nativeElement.focus();
        }
        else {
            this.openPage('ServiceCoverAdd');
        }
    };
    ContractServiceSummaryComponent.prototype.PremiseNumber_onchange = function (event) {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) {
            this.PopulateDescriptions();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
    };
    ContractServiceSummaryComponent.prototype.PopulateDescriptions = function () {
        var _this = this;
        var PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        var ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        if (PremiseNumber !== null && ContractNumber !== null) {
            var xhrParams = {};
            var search = new URLSearchParams();
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set(this.serviceConstants.Action, '0');
            search.set('PostDesc', 'Premise');
            search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
            search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
            this.subXhrDesc = this.xhr.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
                if (data.hasOwnProperty('PremiseName')) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', data['PremiseName']);
                }
                else {
                    _this.showAlert(data.errorMessage);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                }
            });
        }
        else {
            this.showAlert('Invalid PremiseNumber');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
    };
    ContractServiceSummaryComponent.prototype.onkeydown = function (event) {
        event.preventDefault();
        if (event.keyCode === 34) {
            var pageID = event.target.id;
            switch (pageID) {
                case 'PremiseNumber':
                    this.openPage('PremiseNumberLookup');
                    break;
                case 'TelesalesOrderNumber':
                    this.openPage('TelesalesOrderNumber');
                    break;
            }
        }
    };
    ContractServiceSummaryComponent.prototype.openPage = function (mode, data) {
        this.logger.log('DEBUG --- openPage', mode, data);
        switch (mode) {
            case 'PremiseNumberLookup':
                this.premiseEllipsis.openModal();
                break;
            case 'TelesalesOrderNumber':
                this.telesalesEllipsis.openModal();
                break;
            case 'ProductCode':
                this.router.navigate([ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE], {
                    queryParams: {
                        parentMode: 'Search',
                        currentContractType: this.routeParams.currentContractType,
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ServiceCoverRowID: data.cellData.additionalData
                    }
                });
                break;
            case 'ServiceCoverAdd':
                this.router.navigate([ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE], {
                    queryParams: {
                        parentMode: 'SearchAdd',
                        currentContractType: this.routeParams.currentContractType,
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                        PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                        AccountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')
                    }
                });
                break;
            case 'Information':
                this.router.navigate(['/application/serviceSummaryDetail'], {
                    queryParams: {
                        parentMode: 'Contract',
                        currentContractType: this.routeParams.currentContractType,
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName')
                    }
                });
                break;
            case 'PremiseNumber':
                this.router.navigate([ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        parentMode: 'GridSearch',
                        currentContractType: this.routeParams.currentContractType,
                        ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        PremiseNumber: data.cellData.text
                    }
                });
                break;
            case 'ServiceAnnualValue':
                this.router.navigate(['/grid/contractmanagement/account/serviceValue'], {
                    queryParams: {
                        parentMode: 'Contract-ServiceSummary',
                        currentContractType: this.routeParams.currentContractType,
                        'ContractName': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                    }
                });
                break;
        }
    };
    ContractServiceSummaryComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    ContractServiceSummaryComponent.prototype.onSubmit = function (formObj, e) {
    };
    ContractServiceSummaryComponent.prototype.onBranchDataReceived = function (obj) {
    };
    ContractServiceSummaryComponent.prototype.getGridInfo = function (info) {
        if (info.totalRows) {
            this.totalRecords = info.totalRows;
        }
    };
    ContractServiceSummaryComponent.prototype.onPremiseDataReturn = function (obj) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', obj.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', obj.PremiseName);
    };
    ContractServiceSummaryComponent.prototype.onTelesalesOrderSearchDataReturn = function (obj) {
        this.logger.log('Page not Ready yet', obj);
    };
    ContractServiceSummaryComponent.prototype.getCurrentPage = function (obj) {
        this.page = obj.value;
        this.loadGrid();
    };
    ContractServiceSummaryComponent.prototype.showAlert = function (msgTxt) {
        var _this = this;
        this.translateSub = this.translate.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                var translation = _this.translate.getTranslatedValue(msgTxt, null);
                var translatedText = msgTxt;
                if (translation.value !== '') {
                    translatedText = translation.value;
                }
                _this.messageModal.show({ msg: translatedText, title: 'Error Message' }, false);
            }
        });
    };
    ContractServiceSummaryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAContractServiceSummary.html'
                },] },
    ];
    ContractServiceSummaryComponent.ctorParameters = [
        { type: ActivatedRoute, },
        { type: ServiceConstants, },
        { type: Router, },
        { type: LocaleTranslationService, },
        { type: FormBuilder, },
        { type: Utils, },
        { type: Logger, },
        { type: LookUp, },
        { type: HttpService, },
        { type: Store, },
        { type: SysCharConstants, },
        { type: SpeedScript, },
        { type: RiExchange, },
        { type: Location, },
        { type: ComponentInteractionService, },
        { type: GlobalConstant, },
    ];
    ContractServiceSummaryComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'Grid': [{ type: ViewChild, args: ['Grid',] },],
        'GridPagination': [{ type: ViewChild, args: ['GridPagination',] },],
        'PremiseNumber': [{ type: ViewChild, args: ['PremiseNumber',] },],
        'premiseEllipsis': [{ type: ViewChild, args: ['premiseEllipsis',] },],
        'telesalesEllipsis': [{ type: ViewChild, args: ['telesalesEllipsis',] },],
    };
    return ContractServiceSummaryComponent;
}());
