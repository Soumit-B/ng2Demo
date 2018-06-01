var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
export var PremiseServiceSummaryComponent = (function (_super) {
    __extends(PremiseServiceSummaryComponent, _super);
    function PremiseServiceSummaryComponent(injector) {
        _super.call(this, injector);
        this.inputParams = {};
        this.inputParamsContractSearch = {
            'parentMode': 'LookUp',
            'currentContractType': 'P'
        };
        this.telesalesInd = '';
        this.isTeleSales = false;
        this.contractTypeCode = '';
        this.currentContractTypeLabel = '';
        this.title = '';
        this.labelContractNumber = '';
        this.CompositesInUse = false;
        this.ReqDetail = false;
        this.ServiceDetailHide = false;
        this.lAllowUserAuthView = false;
        this.lAllowUserAuthUpdate = false;
        this.uiDisplay = {
            ServiceCoverRowID: false,
            RunningReadOnly: false,
            vAllowUserAuthView: false,
            CallLogID: false,
            CurrentCallLogID: false
        };
        this.tdAddRecord = true;
        this.tdServiceDetail = false;
        this.tdAnnualValue = false;
        this.tdTelesalesOrder = false;
        this.detailInd = false;
        this.showCloseButton = true;
        this.backLinkText = 'Back';
        this.statusList = [];
        this.showHeader = true;
        this.itemsPerPage = 14;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 14;
        this.LOS = 'All';
        this.addOptions = 'Options';
        this.isRequesting = false;
        this.LOSArray = [
            {
                'LOSCode': 'All',
                'LOSName': 'All',
                'ttLineOfService': ''
            }
        ];
        this.xhrParams = {
            module: 'report',
            method: 'service-delivery/grid',
            operation: 'Application/iCABSAPremiseServiceSummary'
        };
        this.attributes = {
            'ProductCode': '',
            'ProductDesc': '',
            'ServiceCoverRowID': '',
            'RowID': ''
        };
        this.headerClicked = '';
        this.sortType = '';
        this.gridSortHeaders = [
            {
                'fieldName': 'ProductCode',
                'colName': 'Product\nCode',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ServiceCommenceDate',
                'colName': 'Commence\nDate',
                'sortType': 'ASC'
            }
        ];
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: false, disabled: false, required: false },
            { name: 'InvoiceFrequencyCode', readonly: false, disabled: false, required: false },
            { name: 'NegBranchNumber', readonly: false, disabled: false, required: false },
            { name: 'NegBranchName', readonly: false, disabled: false, required: false },
            { name: 'AccountNumber', readonly: false, disabled: false, required: false },
            { name: 'AccountName', readonly: false, disabled: false, required: false },
            { name: 'InvoiceAnnivDate', readonly: false, disabled: false, required: false },
            { name: 'ServiceBranchNumber', readonly: false, disabled: false, required: false },
            { name: 'BranchName', readonly: false, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: false, disabled: false, required: false },
            { name: 'PremiseAnnualValue', readonly: false, disabled: false, required: false },
            { name: 'TelesalesOrderNumber', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false },
            { name: 'RunningReadOnly', readonly: false, disabled: false, required: false },
            { name: 'vAllowUserAuthView', readonly: false, disabled: false, required: false },
            { name: 'CallLogID', readonly: false, disabled: false, required: false },
            { name: 'CurrentCallLogID', readonly: false, disabled: false, required: false },
            { name: 'StatusSearchType', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSARECOMMENDATIONGRID;
    }
    PremiseServiceSummaryComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.vBusinessCode = this.utils.getBusinessCode();
        this.fullAccess = this.riExchange.ClientSideValues.Fetch('FullAccess');
        this.branchNumber = this.utils.getBranchCode();
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('PremiseAnnualValue');
        this.riExchange.getParentHTMLValue('ServiceBranchNumber');
        this.riExchange.getParentHTMLValue('BranchName');
        this.riExchange.getParentHTMLValue('RunningReadOnly');
        this.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseAnnualValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceFrequencyCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceAnnivDate');
        this.riExchange.riInputElement.Disable(this.uiForm, 'NegBranchNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'NegBranchName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceBranchNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchName');
        if (!this.getControlValue('BranchName')) {
            this.doLookup();
        }
        this.getSysCharDetails();
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.statusList = [];
                _this.buildStatusOptions();
            }
        });
        this.setCurrentContractType();
        this.getLOSCode();
        this.setUpInit();
    };
    PremiseServiceSummaryComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
        if (this.translateSub) {
            this.translateSub.unsubscribe();
        }
    };
    PremiseServiceSummaryComponent.prototype.setUpInit = function () {
        this.title = 'Premise Service Summary';
        this.labelContractNumber = this.currentContractTypeLabel + ' Number';
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'RunningReadOnly') === 'yes' || this.CallLogID) {
            this.tdAddRecord = false;
        }
    };
    PremiseServiceSummaryComponent.prototype.doLookup = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': { 'BusinessCode': this.businessCode(), 'BranchNumber': this.getControlValue('ServiceBranchNumber') },
                'fields': ['BranchName']
            }];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            var branchRecords = data[0];
            if (branchRecords.length > 0) {
                _this.setControlValue('BranchName', branchRecords['0'].BranchName);
            }
        });
    };
    PremiseServiceSummaryComponent.prototype.getLOSCode = function () {
        var _this = this;
        var lookupIP = [{
                'table': 'LineOfService',
                'query': { 'ValidForBusiness': this.utils.getBusinessCode() },
                'fields': ['LOSCode', 'LOSName']
            }];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0]) {
                var temp = data[0];
                for (var i = 0; i < temp.length; i++) {
                    _this.LOSArray.push(temp[i]);
                }
            }
        });
    };
    PremiseServiceSummaryComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    };
    PremiseServiceSummaryComponent.prototype.onStatusChange = function () {
        this.premiseServiceSummaryGrid.clearGridData();
    };
    PremiseServiceSummaryComponent.prototype.onDetailIndChange = function () {
        this.premiseServiceSummaryGrid.clearGridData();
        this.detailInd = !this.detailInd;
    };
    PremiseServiceSummaryComponent.prototype.getGridInfo = function (info) {
        this.premiseServiceSummaryPagination.totalItems = info.totalRows;
    };
    PremiseServiceSummaryComponent.prototype.getRefreshData = function () {
        this.currentPage = 1;
        this.buildGrid();
    };
    PremiseServiceSummaryComponent.prototype.buildStatusOptions = function () {
        this.statusList = [
            { value: '', text: 'All' },
            { value: 'L', text: 'Current' },
            { value: 'FL', text: 'Forward Current' },
            { value: 'D', text: 'Deleted' },
            { value: 'FD', text: 'Forward Deleted' },
            { value: 'PT', text: 'Pending Deletion' },
            { value: 'T', text: 'Terminated' },
            { value: 'FT', text: 'Forward Terminated' },
            { value: 'PT', text: 'Pending Termination' },
            { value: 'C', text: 'Cancelled' }];
    };
    PremiseServiceSummaryComponent.prototype.setCurrentContractType = function () {
        this.inputParamsContractSearch.currentContractType = this.riExchange.getCurrentContractType();
        this.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    };
    PremiseServiceSummaryComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    PremiseServiceSummaryComponent.prototype.getContractDetails = function () {
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
                'query': { 'BusinessCode': this.vBusinessCode, 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') },
                'fields': ['BusinessCode', 'ContractNumber', 'AccountNumber', 'NegBranchNumber', 'InvoiceAnnivDate', 'InvoiceFrequencyCode']
            }];
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_contract).subscribe(function (data) {
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
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceFrequencyCode', InvoiceFrequencyCode);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceAnnivDate', _this.utils.formatDate(new Date(InvoiceAnnivDate)));
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NegBranchNumber', NegBranchNumber);
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
                    _this.subLookupDetails = _this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (data) {
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
                            if (_this.fullAccess === 'Restricted' && _this.branchNumber !== _this.riExchange.riInputElement.GetValue(_this.uiForm, 'NegBranchNumber')
                                && _this.branchNumber !== _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ServiceBranchNumber')) {
                                _this.tdAnnualValue = false;
                            }
                            else {
                                _this.tdAnnualValue = true;
                            }
                        }
                        else {
                            _this.showAlert('not successful!!');
                        }
                        _this.buildGrid();
                    });
                }
            }
            else {
                _this.showAlert('not successful!!');
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PremiseServiceSummaryComponent.prototype.userAuthorityLookUp = function () {
        var _this = this;
        var lookupIPUserAuth = [{
                'table': 'UserAuthority',
                'query': { 'BusinessCode': this.vBusinessCode, 'UserCode': this.utils.getUserCode() },
                'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
            },
            {
                'table': 'ProductComponent',
                'query': { 'BusinessCode': this.vBusinessCode },
                'fields': ['BusinessCode']
            }];
        this.lookupAuth = this.LookUp.lookUpRecord(lookupIPUserAuth).subscribe(function (data) {
            if (data.length > 0) {
                var userAuth = data[0];
                if (userAuth.length > 0) {
                    _this.lAllowUserAuthView = userAuth[0].AllowViewOfSensitiveInfoInd;
                    _this.lAllowUserAuthUpdate = userAuth[0].AllowUpdateOfContractInfoInd;
                }
                if (!_this.lAllowUserAuthView) {
                    _this.tdAnnualValue = false;
                }
                else {
                    _this.tdAnnualValue = true;
                }
            }
            if (data.length > 1) {
                var productComponent = data[1];
                if (productComponent.length > 0) {
                    _this.CompositesInUse = true;
                }
            }
            _this.iCABSTelesalesEntry();
        });
    };
    PremiseServiceSummaryComponent.prototype.showAlert = function (msgTxt) {
        var _this = this;
        this.translateSub = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                var translation = _this.localeTranslateService.getTranslatedValue(msgTxt, null);
                var translatedText = msgTxt;
                if (translation.value !== '') {
                    translatedText = translation.value;
                }
                _this.messageModal.show({ msg: translatedText, title: 'Error Message' }, false);
            }
        });
    };
    PremiseServiceSummaryComponent.prototype.getSysCharDetails = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var sysCharList = [this.sysCharConstants.SystemCharEnableServiceCoverDetail, this.sysCharConstants.SystemCharServiceDetailHide];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.vBusinessCode,
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            _this.ReqDetail = data.records[0].Required;
            _this.ServiceDetailHide = data.records[1].Required;
            if (_this.ReqDetail) {
                _this.tdServiceDetail = true;
                _this.detailInd = true;
            }
            else {
                _this.tdServiceDetail = false;
                _this.detailInd = false;
            }
            _this.userAuthorityLookUp();
        });
    };
    PremiseServiceSummaryComponent.prototype.iCABSTelesalesEntry = function () {
        var _this = this;
        var xhrParams = {};
        var search = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'CheckIsTelesalesPSale');
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.subXhr = this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(function (data) {
            if (data.hasOwnProperty('TelesalesInd')) {
                if (data.TelesalesInd === 'Y') {
                    _this.tdTelesalesOrder = true;
                }
                else {
                    _this.tdTelesalesOrder = false;
                }
            }
            _this.getContractDetails();
        });
    };
    PremiseServiceSummaryComponent.prototype.buildGrid = function () {
        this.premiseServiceSummaryGrid.clearGridData();
        this.setMaxColCount();
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('FullAccess', this.fullAccess);
        search.set('LoggedInBranch', this.riExchange.ClientSideValues.Fetch('BranchNumber'));
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        search.set('PortfolioStatusCode', this.getControlValue('StatusSearchType'));
        search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        search.set('DetailInd', (this.detailInd ? 'True' : 'False'));
        search.set('Level', 'Premise');
        search.set('AllowUserAuthView', (this.lAllowUserAuthView ? 'True' : 'False'));
        search.set('LOSCode', this.LOS === 'All' ? '' : this.LOS);
        search.set('TelesalesOrderNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'TelesalesOrderNumber'));
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('ServiceDetailHide', this.ServiceDetailHide ? 'True' : 'False');
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('PageSize', '13');
        search.set('PageCurrent', this.currentPage.toString());
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        search.set(this.serviceConstants.GridSortOrder, this.sortType);
        var gridIP = {
            method: this.xhrParams.method,
            operation: this.xhrParams.operation,
            module: this.xhrParams.module,
            search: search
        };
        this.premiseServiceSummaryGrid.loadGridData(gridIP);
    };
    PremiseServiceSummaryComponent.prototype.onChangeStatus = function (event) {
        this.premiseServiceSummaryGrid.clearGridData();
    };
    PremiseServiceSummaryComponent.prototype.onChangeDetailInd = function (event) {
        this.detailInd = !this.detailInd;
        this.premiseServiceSummaryGrid.clearGridData();
    };
    PremiseServiceSummaryComponent.prototype.menu_onchange = function (event) {
        if (event.target['value'] === 'AddRecord') {
            this.navigate('SearchAdd', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
        }
        this.addOptions = 'Options';
    };
    PremiseServiceSummaryComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.buildGrid();
    };
    PremiseServiceSummaryComponent.prototype.setMaxColCount = function () {
        var count = 13;
        if (this.CompositesInUse) {
            count++;
        }
        if (this.detailInd && !this.ServiceDetailHide) {
            count++;
        }
        if (this.getControlValue('StatusSearchType') === '') {
            count++;
        }
        this.maxColumn = count;
    };
    PremiseServiceSummaryComponent.prototype.onGridRowClick = function (event) {
        var obj = this.premiseServiceSummaryGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
        this.attributes.ProductCode = obj['rowID'];
        this.attributes.ProductDesc = event.rowData['Product Description'];
        this.attributes.ServiceCoverRowID = obj['additionalData'];
        this.attributes.RowID = obj['rowID'];
    };
    ;
    PremiseServiceSummaryComponent.prototype.onGridRowDBClick = function (event) {
        var obj = this.premiseServiceSummaryGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
        this.attributes.ProductCode = obj['rowID'];
        this.attributes.ProductDesc = event.rowData['Product Description'];
        this.attributes.ServiceCoverRowID = obj['additionalData'];
        this.attributes.RowID = obj['rowID'];
        var index = this.getAbsoluteGridIndex(event.cellIndex);
        if (index === 0) {
            this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
        }
        else if (index === 8) {
            this.router.navigate(['grid/contractmanagement/account/serviceValue'], {
                queryParams: {
                    parentMode: 'Premise-ServiceSummary',
                    ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                    PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                    ServiceCoverRowID: this.attributes.RowID,
                    ProductCode: this.attributes.ProductCode,
                    ProductDesc: this.attributes.ProductDesc
                }
            });
        }
        else if (index === 14 && event.cellData.text) {
            alert('Open iCABSAServiceSummaryDetail');
        }
    };
    PremiseServiceSummaryComponent.prototype.getAbsoluteGridIndex = function (index) {
        var ret = index;
        if (ret === 0) {
            return ret;
        }
        if (!this.CompositesInUse) {
            ret++;
        }
        if (!this.detailInd || this.ServiceDetailHide) {
            ret++;
        }
        if (ret > 10) {
            if (this.getControlValue('StatusSearchType') !== '') {
                ret++;
            }
        }
        return ret;
    };
    PremiseServiceSummaryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPremiseServiceSummary.html'
                },] },
    ];
    PremiseServiceSummaryComponent.ctorParameters = [
        { type: Injector, },
    ];
    PremiseServiceSummaryComponent.propDecorators = {
        'premiseServiceSummaryGrid': [{ type: ViewChild, args: ['premiseServiceSummaryGrid',] },],
        'premiseServiceSummaryPagination': [{ type: ViewChild, args: ['premiseServiceSummaryPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return PremiseServiceSummaryComponent;
}(BaseComponent));
