var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from './../../../../app/base/BaseComponent';
import { PageIdentifier } from './../../../../app/base/PageIdentifier';
import { AuthService } from './../../../../shared/services/auth.service';
import { URLSearchParams } from '@angular/http';
export var AwaitingVerificationGridComponent = (function (_super) {
    __extends(AwaitingVerificationGridComponent, _super);
    function AwaitingVerificationGridComponent(injector, _authService) {
        _super.call(this, injector);
        this._authService = _authService;
        this.pageId = '';
        this.controls = [
            { name: 'ServiceBranchNumber', readonly: false, disabled: false, required: false },
            { name: 'BranchName', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false },
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false }
        ];
        this.inputParams = {
            method: 'service-planning/maintenance',
            module: 'areas',
            operation: 'Service/iCABSSeAwaitingVerificationGrid'
        };
        this.maxColumn = 14;
        this.pageCurrent = '1';
        this.pageSize = '10';
        this.currentPage = 1;
        this.pageId = PageIdentifier.ICABSSEAWAITINGVERIFICATIONGRID;
    }
    AwaitingVerificationGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageInitialization();
    };
    AwaitingVerificationGridComponent.prototype.pageInitialization = function () {
        var userCode = this._authService.getSavedUserCode(), businessCode = this.utils.getBusinessCode(), countryCode = this.utils.getCountryCode();
        this.initForm();
        this.loggedInBranch = this.utils.getBranchCode();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceBranchNumber', this.loggedInBranch);
        this.lookupBranchName(this.loggedInBranch, businessCode);
        this.loadData(this.inputParams);
    };
    AwaitingVerificationGridComponent.prototype.initForm = function () {
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    AwaitingVerificationGridComponent.prototype.lookupBranchName = function (branchNumber, businessCode) {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': businessCode,
                    'BranchNumber': branchNumber
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Branch = data[0][0];
            if (Branch) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BranchName', Branch.BranchName);
            }
        });
    };
    AwaitingVerificationGridComponent.prototype.loadData = function (params) {
        this.setFilterValues(params);
        this.inputParams.search = this.search;
        this.postCodeGrid.loadGridData(this.inputParams);
    };
    AwaitingVerificationGridComponent.prototype.setFilterValues = function (params) {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('FilterType', 'All');
        this.search.set('BranchNumber', this.loggedInBranch);
        this.search.set('ReqPremiseLoc', 'True');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '919336');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('PageSize', this.pageSize);
        this.search.set('PageCurrent', this.pageCurrent);
        this.search.set('riSortOrder', 'Descending');
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    };
    AwaitingVerificationGridComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    AwaitingVerificationGridComponent.prototype.refresh = function (event) {
        this.pageCurrent = '1';
        this.pageInitialization();
    };
    AwaitingVerificationGridComponent.prototype.getCurrentPage = function (event) {
        this.pageCurrent = event.value;
        this.updateView();
    };
    AwaitingVerificationGridComponent.prototype.updateView = function () {
        this.loadData(this.inputParams);
    };
    AwaitingVerificationGridComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    AwaitingVerificationGridComponent.prototype.onGridRowDblClick = function (event) {
        var _this = this;
        var cellInfo = 0;
        var ServiceCoverRowID = '';
        var PremiseNumber;
        var ContractNumber;
        var contractTypeCode = '';
        try {
            cellInfo = event.cellIndex;
            ServiceCoverRowID = event.trRowData[2].rowID;
            contractTypeCode = event.trRowData[0].text.split('/')[0];
            ContractNumber = event.trRowData[0].text.split('/')[1];
            PremiseNumber = event.trRowData[2].text;
        }
        catch (e) {
            this.logger.warn(e);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', ServiceCoverRowID);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', PremiseNumber);
        this.riExchange.setParentAttributeValue('ServiceCoverRowID', ServiceCoverRowID);
        this.riExchange.setParentAttributeValue('ContractNumber', ContractNumber);
        this.riExchange.setParentAttributeValue('PremiseNumber', PremiseNumber);
        this.logger.log('DATA', cellInfo, contractTypeCode, ServiceCoverRowID, event);
        switch (cellInfo) {
            case 2:
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE], {
                    queryParams: {
                        'parentMode': 'Verification',
                        'PremiseRowID': ServiceCoverRowID,
                        'ContractTypeCode': contractTypeCode
                    }
                });
                break;
            case 3:
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE], {
                    queryParams: {
                        'parentMode': 'ServiceCoverGrid',
                        'ServiceCoverROWID': event.trRowData[3].rowID,
                        'contractTypeCode': contractTypeCode
                    }
                });
                break;
            case 10:
                break;
            case 12:
                this.navigate('Verification', '/grid/application/premiseLocationAllocation', {
                    'parentMode': 'Verification',
                    'ServiceCoverRowID': ServiceCoverRowID,
                    'currentContractType': contractTypeCode,
                    'ContractNumber': ContractNumber,
                    'PremiseNumber': PremiseNumber
                });
                break;
            case 13:
                var searchPost = new URLSearchParams();
                var postParams = {};
                postParams['ServiceCoverRowID'] = event.trRowData[3].rowID;
                postParams['ReqPremiseLoc'] = 'True';
                searchPost.set(this.serviceConstants.Action, '2');
                searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, searchPost, postParams)
                    .subscribe(function (e) {
                    if (e['status'] === 'failure') {
                        _this.errorService.emitError(e['oResponse']);
                    }
                    else {
                        if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                            _this.errorService.emitError(e['oResponse']);
                        }
                        else if (e['errorMessage']) {
                            _this.errorService.emitError(e);
                        }
                        else {
                            _this.refreshGridData();
                        }
                    }
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }, function (error) {
                    _this.errorService.emitError(error);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
                break;
            default:
                break;
        }
    };
    AwaitingVerificationGridComponent.prototype.refreshGridData = function () {
        var branchNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber');
        this.loggedInBranch = branchNumber;
        this.lookupBranchName(this.loggedInBranch, this.utils.getBusinessCode());
        this.loadData(this.inputParams);
    };
    AwaitingVerificationGridComponent.prototype.getCellData = function (eventObj) {
        var ServiceCoverRowID = '';
        var PremiseNumber;
        var ContractNumber;
        try {
            ServiceCoverRowID = eventObj.trRowData[3].rowID;
            ContractNumber = eventObj.trRowData[0].text.split('/')[1];
            PremiseNumber = eventObj.trRowData[2].text;
        }
        catch (e) {
            this.logger.warn(e);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', ServiceCoverRowID);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', PremiseNumber);
        this.riExchange.setParentAttributeValue('ServiceCoverRowID', ServiceCoverRowID);
        this.riExchange.setParentAttributeValue('ContractNumber', ContractNumber);
        this.riExchange.setParentAttributeValue('PremiseNumber', PremiseNumber);
        var columnName = '';
        columnName = eventObj.columnClicked.text;
        switch (columnName) {
            case 'Located':
                this.router.navigate(['grid/application/premiseLocationAllocation'], { queryParams: { parentMode: 'Verification' } });
                break;
            default:
                break;
        }
    };
    AwaitingVerificationGridComponent.prototype.ServiceCoverFocus = function () {
        var _this = this;
        var searchPost = new URLSearchParams();
        var postParams = {};
        postParams['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID');
        postParams['ReqPremiseLoc'] = 'true';
        searchPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchPost.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, searchPost, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                }
                else {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'InvoiceNumber', e['AccountNumber']);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    AwaitingVerificationGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-awaiting-verification',
                    templateUrl: 'iCABSSeAwaitingVerificationGrid.html',
                    styles: ["\n        :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(3) {\n            width: 6%;\n        }\n        :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(4) {\n            width: 10%;\n        }\n        :host /deep/ .gridtable thead tr:nth-child(2) th:nth-child(11) {\n            width: 7%;\n        }\n        :host /deep/ .gridtable tbody tr td:nth-child(3) input,\n        :host /deep/ .gridtable tbody tr td:nth-child(4) input,\n        :host /deep/ .gridtable tbody tr td:nth-child(11) input {\n            text-align: center;\n        }\n    "]
                },] },
    ];
    AwaitingVerificationGridComponent.ctorParameters = [
        { type: Injector, },
        { type: AuthService, },
    ];
    AwaitingVerificationGridComponent.propDecorators = {
        'postCodeGrid': [{ type: ViewChild, args: ['postCodeGrid',] },],
        'postCodePagination': [{ type: ViewChild, args: ['postCodePagination',] },],
    };
    return AwaitingVerificationGridComponent;
}(BaseComponent));
