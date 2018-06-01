import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from './../../../shared/services/message.service';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Logger } from '@nsalaun/ng2-logger';
import { HttpService } from './../../../shared/services/http-service';
import { ContractActionTypes } from './../../actions/contract';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { URLSearchParams } from '@angular/http';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { Component, ViewChild, NgZone } from '@angular/core';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
export var CustomerInformationSummaryComponent = (function () {
    function CustomerInformationSummaryComponent(serviceConstants, store, _router, riExchange, zone, location, _componentInteractionService, http, logger, utils, messageService, activatedRoute) {
        var _this = this;
        this.serviceConstants = serviceConstants;
        this.store = store;
        this._router = _router;
        this.riExchange = riExchange;
        this.zone = zone;
        this.location = location;
        this._componentInteractionService = _componentInteractionService;
        this.http = http;
        this.logger = logger;
        this.utils = utils;
        this.messageService = messageService;
        this.activatedRoute = activatedRoute;
        this.method = 'contract-management/grid';
        this.module = 'customer';
        this.operation = 'Application/iCABSACustomerInformationSummary';
        this.search = new URLSearchParams();
        this.deleteParams = new URLSearchParams();
        this.dataFromParent = {
            col11: {}
        };
        this.backLinkText = '';
        this.currentPage = 1;
        this.maxColumn = 11;
        this.itemsPerPage = 10;
        this.codeData = {};
        this.showMessageHeader = true;
        this.showPromptMessageHeader = true;
        this.pageModel = {
            parentMode: 'Contract',
            GroupAccountNumber: '',
            GroupName: '',
            accountNumber: '',
            AccountName: '',
            contractNumber: '',
            contractName: '',
            hasWriteAccess: false,
            recordSelected: false,
            enableDetails: false
        };
        this.storeSubscription = store.select('contract').subscribe(function (data) {
            _this.codeData = data['code'];
            _this.storeData = data['data'];
            _this.parentData = data['params'];
        });
        this.pageModel['parentMode'] = this.parentData['parentMode'];
        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(function (param) {
            if (param['parentMode']) {
                _this.pageModel['parentMode'] = param['parentMode'];
            }
            if (param['contractNumber'] || param['ContractNumber']) {
                _this.pageModel['contractNumber'] = param['contractNumber'] || param['ContractNumber'];
            }
            if (param['contractName'] || param['ContractName']) {
                _this.pageModel['contractName'] = param['contractName'] || param['ContractName'];
            }
            if (param['accountNumber'] || param['AccountNumber']) {
                _this.pageModel['accountNumber'] = param['accountNumber'] || param['AccountNumber'];
            }
            if (param['accountName'] || param['AccountName']) {
                _this.pageModel['accountName'] = param['accountName'] || param['AccountName'];
            }
            if (param['groupAccountNumber'] || param['GroupAccountNumber']) {
                _this.pageModel['groupAccountNumber'] = param['groupAccountNumber'] || param['GroupAccountNumber'];
            }
            if (param['groupName'] || param['GroupName']) {
                _this.pageModel['groupName'] = param['groupName'] || param['GroupName'];
            }
        });
        this.inputParams = {};
        this.searchConstants = {
            action: 2,
            riGridMode: 0,
            riGridHandle: 657854,
            pageSize: 10,
            callingProg: this.pageModel['parentMode']
        };
    }
    CustomerInformationSummaryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this._componentInteractionService.emitMessage(false);
        this.codeData['business'] = this.utils.getBusinessCode();
        this.codeData['country'] = this.utils.getCountryCode();
        this.dataFromParent['col11'] = {
            colNumber: this.maxColumn,
            colFormat: GlobalConstant.Configuration.Format['Time']
        };
        if (this.storeData['ContractNumber']) {
            this.pageModel['contractNumber'] = this.storeData['ContractNumber'];
        }
        if (this.storeData['ContractName']) {
            this.pageModel['contractName'] = this.storeData['ContractName'];
        }
        if (this.storeData['AccountNumber']) {
            this.pageModel['accountNumber'] = this.storeData['AccountNumber'];
        }
        if (this.storeData['AccountName']) {
            this.pageModel['accountName'] = this.storeData['AccountName'];
        }
        if (this.storeData['GroupAccountNumber']) {
            this.pageModel['GroupAccountNumber'] = this.storeData['GroupAccountNumber'];
        }
        if (this.storeData['GroupName']) {
            this.pageModel['GroupName'] = this.storeData['GroupName'];
        }
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
            }
        });
        this.updateView();
    };
    CustomerInformationSummaryComponent.prototype.updateView = function () {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        if (this.pageModel['parentMode'] === 'Account') {
            this.searchConstants['callingProg'] = 'Account';
        }
        else if (this.pageModel['parentMode'] === 'GroupAccount') {
            this.searchConstants['callingProg'] = 'GroupAccount';
        }
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, this.searchConstants['action']);
        this.search.set(this.serviceConstants.GridHandle, this.searchConstants['riGridHandle']);
        this.search.set(this.serviceConstants.GridMode, this.searchConstants['riGridMode']);
        this.search.set(this.serviceConstants.PageSize, this.searchConstants['pageSize']);
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage);
        this.search.set('CallingProg', this.searchConstants['callingProg']);
        this.search.set('contractNumber', this.pageModel['contractNumber']);
        this.search.set('accountNumber', this.pageModel['accountNumber']);
        this.search.set('groupAccountNumber', this.pageModel['groupAccountNumber']);
        this.inputParams.search = this.search;
        this.customerInfoGrid.loadGridData(this.inputParams);
        this.checkUserWriteAccess();
    };
    CustomerInformationSummaryComponent.prototype.checkUserWriteAccess = function () {
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full') {
            this.pageModel['hasWriteAccess'] = true;
        }
    };
    CustomerInformationSummaryComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        var gridTotalItems = this.itemsPerPage;
        if (info) {
            gridTotalItems = info.totalRows;
        }
        this.gridData = info.gridData;
        this.zone.run(function () {
            _this.customerInfoPagination.totalItems = gridTotalItems;
        });
    };
    CustomerInformationSummaryComponent.prototype.getCurrentPage = function (curPage) {
        this.currentPage = curPage ? curPage.value : this.currentPage;
        this.inputParams.method = 'contract-management/grid';
        this.updateView();
    };
    CustomerInformationSummaryComponent.prototype.onGridRowClick = function (clickedRow) {
        this.store.dispatch({
            type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: {
                updateMode: false,
                addMode: false,
                searchMode: true
            }
        });
    };
    CustomerInformationSummaryComponent.prototype.onCellSelection = function (data) {
        this.selectedRowData = data.rowData;
        this.selectedCompleteRowData = data.trRowData;
        this.pageModel['enableDetails'] = true;
        this.pageModel['recordSelected'] = false;
        if (data.trRowData[5]['additionalData'] === this.pageModel['parentMode']) {
            this.pageModel['recordSelected'] = true;
        }
    };
    CustomerInformationSummaryComponent.prototype.onGridRowDblClick = function (data) {
        this.onCellSelection(data);
        if (data.cellIndex === 3) {
            this._router.navigate(['/maintenance/customerinformation'], {
                queryParams: {
                    parentMode: 'Update',
                    ContractNumber: this.pageModel['contractNumber'],
                    ContractName: this.pageModel['contractName'],
                    AccountNumber: this.pageModel['accountNumber'],
                    AccountName: this.pageModel['AccountName'],
                    CallingProg: this.pageModel['parentMode'],
                    Mode: 'Update',
                    GroupAccountNumber: data.trRowData[0].text,
                    GroupName: data.trRowData[0].additionalData,
                    InfoLevel: data.trRowData[6].additionalData,
                    CustomerInfoNumber: data.trRowData[3].text
                }
            });
        }
    };
    CustomerInformationSummaryComponent.prototype.addNewRecord = function (event) {
        this.store.dispatch({
            type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: {
                updateMode: false,
                addMode: false,
                searchMode: true
            }
        });
        this._router.navigate(['/maintenance/customerinformation'], {
            queryParams: {
                parentMode: 'New',
                ContractNumber: this.pageModel['contractNumber'],
                ContractName: this.pageModel['contractName'],
                AccountNumber: this.pageModel['accountNumber'],
                AccountName: this.pageModel['AccountName'],
                CallingProg: this.pageModel['parentMode'],
                CustomerInfoName: this.gridData.body && this.gridData.body.cells.length > 0 ? this.gridData.body.cells[2].additionalData : '',
                Mode: 'New',
                InfoLevel: ''
            }
        });
    };
    CustomerInformationSummaryComponent.prototype.addExistingRecord = function (event) {
        this.store.dispatch({
            type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: {
                updateMode: false,
                addMode: false,
                searchMode: true
            }
        });
        this._router.navigate(['maintenance/CustomerInformationAccountMaintenance'], {
            queryParams: {
                AccountNumber: this.pageModel['accountNumber'],
                AccountName: this.pageModel['accountName'],
                ContractNumber: this.pageModel['contractNumber'],
                ContractName: this.pageModel['contractName'],
                GroupAccountNumber: this.pageModel['groupAccountNumber'],
                GroupName: this.pageModel['groupName'],
                CallingProg: this.pageModel['parentMode']
            }
        });
    };
    CustomerInformationSummaryComponent.prototype.deleteRecord = function () {
        var _this = this;
        var formData = {};
        if (!this.selectedRowData) {
            return;
        }
        this.deleteParams = new URLSearchParams();
        this.deleteParams.set(this.serviceConstants.BusinessCode, this.codeData['business']);
        this.deleteParams.set(this.serviceConstants.CountryCode, this.codeData['country']);
        this.deleteParams.set('CustomerInfoNumber', this.selectedRowData['Information ID.'] || this.selectedCompleteRowData[3].text);
        this.deleteParams.set(this.serviceConstants.AccountNumber, this.storeData[this.serviceConstants.AccountNumber]);
        this.deleteParams.set(this.serviceConstants.ContractNumber, this.selectedRowData['Contract Number'] || this.selectedCompleteRowData[2].text);
        this.deleteParams.set('GroupAccountNumber', this.selectedRowData['Group Account Number'] || this.selectedCompleteRowData[0].text);
        this.deleteParams.set('Mode', 'Delete');
        this.deleteParams.set('CallingProg', this.pageModel['parentMode']);
        this.deleteParams.set(this.serviceConstants.Action, '0');
        this.http.makeGetRequest(this.method, this.module, this.operation, this.deleteParams).subscribe(function (data) {
            _this.updateView();
        }, function (error) {
            _this.messageService.emitMessage({
                msg: error.errorMessage
            });
            _this.logger.log(error);
        });
    };
    CustomerInformationSummaryComponent.prototype.viewRecordDetail = function (event) {
        this.store.dispatch({
            type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: {
                updateMode: false,
                addMode: false,
                searchMode: true
            }
        });
        this._router.navigate(['/maintenance/customerinformation'], {
            queryParams: {
                parentMode: 'Update',
                ContractNumber: this.pageModel['contractNumber'],
                ContractName: this.pageModel['contractName'],
                AccountNumber: this.pageModel['accountNumber'],
                AccountName: this.pageModel['AccountName'],
                CallingProg: this.pageModel['parentMode'],
                Mode: 'Update',
                GroupAccountNumber: this.selectedCompleteRowData[0].text,
                GroupName: this.selectedCompleteRowData[0].additionalData,
                InfoLevel: this.selectedCompleteRowData[6].additionalData,
                CustomerInfoNumber: this.selectedCompleteRowData[3].text
            }
        });
    };
    CustomerInformationSummaryComponent.prototype.refresh = function () {
        this.updateView();
    };
    CustomerInformationSummaryComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    CustomerInformationSummaryComponent.prototype.deleteRecordClick = function () {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.pageModel['enableDetails'] = false;
        this.pageModel['recordSelected'] = false;
        this.promptConfirmModal.show();
    };
    CustomerInformationSummaryComponent.prototype.promptConfirm = function () {
        this.deleteRecord();
    };
    CustomerInformationSummaryComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-customer-info',
                    templateUrl: 'iCABSACustomerInformationSummary.html'
                },] },
    ];
    CustomerInformationSummaryComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: Store, },
        { type: Router, },
        { type: RiExchange, },
        { type: NgZone, },
        { type: Location, },
        { type: ComponentInteractionService, },
        { type: HttpService, },
        { type: Logger, },
        { type: Utils, },
        { type: MessageService, },
        { type: ActivatedRoute, },
    ];
    CustomerInformationSummaryComponent.propDecorators = {
        'customerInfoGrid': [{ type: ViewChild, args: ['customerInfoGrid',] },],
        'customerInfoPagination': [{ type: ViewChild, args: ['customerInfoPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
    };
    return CustomerInformationSummaryComponent;
}());
