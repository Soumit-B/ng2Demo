var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { EmployeeSearchComponent } from '../../../../app/internal/search/iCABSBEmployeeSearch';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { CBBService } from '../../../../shared/services/cbb.service';
export var DataChangeGridComponent = (function (_super) {
    __extends(DataChangeGridComponent, _super);
    function DataChangeGridComponent(injector, cbb) {
        _super.call(this, injector);
        this.cbb = cbb;
        this.showHeader = true;
        this.pageSize = 10;
        this.curPage = 1;
        this.totalRecords = 10;
        this.pageId = '';
        this.isRequesting = false;
        this.sortType = 'Descending';
        this.function = '';
        this.PDAICABSDataChangeRowID = {};
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.messageContentError = MessageConstant.Message.SaveError;
        this.currentContractTypeURLParameter = { currentContractTypeURLParameter: 'contract', Mode: 'Release' };
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.ellipsisQueryParams = {
            inputParamsEmployeeCode: {
                parentMode: 'LookUp'
            }
        };
        this.queryParams = {
            module: 'pda',
            operation: 'Service/iCABSSeDataChangeGrid',
            method: 'contract-management/maintenance'
        };
        this.contractSearchParams = {
            'currentContractTypeURLParameter': '<contract>'
        };
        this.controls = [
            { name: 'BranchNumber', readonly: true, disabled: false, required: false },
            { name: 'BranchName', readonly: true, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: false, required: false },
            { name: 'EmployeeCode', readonly: true, disabled: false, required: false },
            { name: 'ActionedStatus', readonly: true, disabled: false, required: false },
            { name: 'ContractNumber' },
            { name: 'PremiseNumber' }
        ];
        this.pageId = PageIdentifier.ICABSSEDATACHANGEGRID;
    }
    DataChangeGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        if (this.isReturning()) {
            this.initGrid();
            this.populateUIFromFormData();
        }
        else {
            this.window_onload();
        }
        this.refresh();
    };
    DataChangeGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    DataChangeGridComponent.prototype.ngAfterViewInit = function () {
        this.setFormMode(this.c_s_MODE_UPDATE);
    };
    DataChangeGridComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    DataChangeGridComponent.prototype.window_onload = function () {
        this.initGrid();
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.setControlValue('ActionedStatus', '');
        this.lookupBranchName();
    };
    DataChangeGridComponent.prototype.lookupBranchName = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.utils.getBranchCode()
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Branch = data[0][0];
            if (Branch) {
                _this.setControlValue('BranchName', Branch.BranchName);
            }
            ;
        });
    };
    DataChangeGridComponent.prototype.initGrid = function () {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.buildGrid();
    };
    DataChangeGridComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('EmployeeCode', 'Grid', 'EmployeeCode', MntConst.eTypeCode, 6, false);
        this.riGrid.AddColumn('ChangeDate', 'Grid', 'ChangeDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ContractNumber', 'Grid', 'ContractNumber', MntConst.eTypeCode, 8);
        this.riGrid.AddColumn('PremiseNumber', 'Grid', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumn('PremiseName', 'Grid', 'PremiseName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ProductCode', 'Grid', 'ProductCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumn('Field', 'Grid', 'Field', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('OriginalValue', 'Grid', 'OriginalValue', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('UpdatedValue', 'Grid', 'UpdatedValue', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('Accept', 'Grid', 'Accept', MntConst.eTypeButton, 10);
        this.riGrid.AddColumn('Reject', 'Grid', 'Reject', MntConst.eTypeButton, 10);
        this.riGrid.AddColumn('Info', 'Grid', 'Info', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ChangeDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('EmployeeCode', true);
        this.riGrid.AddColumnOrderable('ChangeDate', true);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.Complete();
    };
    DataChangeGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var search = this.getURLSearchParamObject(), sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        search.set(this.serviceConstants.GridPageCurrent, this.curPage.toString());
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('riCacheRefresh', 'True');
        search.set('BranchNumber', this.getControlValue('BranchNumber'));
        search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        search.set('ActionedStatus', this.getControlValue('ActionedStatus'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                _this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
                _this.riGrid.Update = true;
                _this.riGrid.UpdateBody = true;
                _this.riGrid.UpdateHeader = true;
                _this.riGrid.ResetGrid();
                _this.riGrid.Execute(data);
            }
            _this.isRequesting = false;
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    DataChangeGridComponent.prototype.riGrid_AfterExecute = function () {
    };
    DataChangeGridComponent.prototype.selectedRowFocus = function (rsrcElement) {
        var oTR;
        if (rsrcElement) {
            oTR = rsrcElement.parentElement.parentElement.parentElement;
            rsrcElement.Focus();
            this.setAttribute('DataChangeRowID', rsrcElement.RowID);
            this.setAttribute('Row', oTR.sectionRowIndex);
        }
    };
    DataChangeGridComponent.prototype.riGrid_BodyOnKeyDown = function (evt) {
    };
    DataChangeGridComponent.prototype.getCurrentPage = function (data) {
        this.curPage = data.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    DataChangeGridComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    DataChangeGridComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    DataChangeGridComponent.prototype.tbodyDataChange_OnDblClick = function (ev) {
        var params = {
            CurrentContractTypeURLParameter: this.riGrid.Details.GetAttribute('PremiseName', 'AdditionalProperty'),
            ContractNumber: this.riGrid.Details.GetValue('ContractNumber'),
            PremiseNumber: this.riGrid.Details.GetValue('PremiseNumber'),
            ProductCode: this.riGrid.Details.GetValue('ProductCode'),
            FieldName: this.riGrid.Details.GetValue('Field'),
            CurrentContractType: this.riGrid.Details.GetAttribute('PremiseName', 'AdditionalProperty')
        };
        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNumber':
                this.navigate('Premise', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, params);
                break;
            case 'PremiseNumber':
                this.navigate('ServiceCover', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, params);
                break;
            case 'Field':
            case 'OriginalValue':
                this.navigate('', '/service/datachangemaintenance', params);
                break;
            case 'UpdatedValue':
                this.navigate('UpdatedValue', '/service/datachangemaintenance', params);
                break;
            case 'ProductCode':
                if (params.ProductCode) {
                    this.setAttribute('ServiceCoverRowID', this.riGrid.Details.GetAttribute('ProductCode', 'AdditionalProperty'));
                    this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, params);
                }
                break;
        }
    };
    DataChangeGridComponent.prototype.riGrid_BodyOnClick = function (ev) {
        var params = {
            CurrentContractTypeURLParameter: this.riGrid.Details.GetAttribute('ContractNumber', 'AdditionalProperty'),
            ContractNumber: this.riGrid.Details.GetValue('ContractNumber'),
            ContractHistoryRowID: this.riGrid.Details.GetAttribute('Info', 'rowID')
        };
        switch (this.riGrid.CurrentColumnName) {
            case 'Accept':
            case 'Reject':
                this.PDAICABSDataChangeRowID = this.riGrid.Details.GetAttribute('PremiseName', 'AdditionalProperty');
                this.function = this.riGrid.CurrentColumnName;
                this.selectChange();
                break;
            case 'Info':
                this.navigate('Info', 'maintenance/contractHistoryDetail', params);
                break;
        }
    };
    DataChangeGridComponent.prototype.onEmployeeCodeReceived = function (data) {
        var employeeCode = data['EmployeeCode'];
        var employeeSurname = data['EmployeeSurname'];
        this.setControlValue('EmployeeCode', employeeCode);
        this.setControlValue('EmployeeSurname', employeeSurname);
    };
    DataChangeGridComponent.prototype.onEmployeeCodeChange = function (evt) {
        var _this = this;
        var formdata = {};
        var codechangePost = this.getURLSearchParamObject();
        codechangePost.set(this.serviceConstants.Action, '6');
        formdata[this.serviceConstants.Function] = 'GetEmployeeSurname';
        formdata['EmployeeCode'] = this.getControlValue('EmployeeCode');
        this.queryParams.search = codechangePost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, codechangePost, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                _this.riGrid.RefreshRequired();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    DataChangeGridComponent.prototype.onShowchange = function (menu) {
        this.setControlValue('ActionedStatus', menu);
    };
    DataChangeGridComponent.prototype.selectChange = function () {
        var _this = this;
        var formdata = {};
        var selectchangePost = this.getURLSearchParamObject();
        selectchangePost.set(this.serviceConstants.Action, '0');
        formdata[this.serviceConstants.Function] = this.function;
        selectchangePost.set('PDAICABSDataChangeRowID', this.PDAICABSDataChangeRowID);
        this.queryParams.search = selectchangePost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, selectchangePost, formdata)
            .subscribe(function (data) {
            if (data.hasError) {
                _this.messageModal.show(data, true);
            }
            else {
                _this.refresh();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    DataChangeGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSeDataChangeGrid.html'
                },] },
    ];
    DataChangeGridComponent.ctorParameters = [
        { type: Injector, },
        { type: CBBService, },
    ];
    DataChangeGridComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'riGridPagination': [{ type: ViewChild, args: ['riGridPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return DataChangeGridComponent;
}(BaseComponent));
