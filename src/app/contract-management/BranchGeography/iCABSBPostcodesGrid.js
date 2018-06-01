var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
export var PostCodeGridComponent = (function (_super) {
    __extends(PostCodeGridComponent, _super);
    function PostCodeGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.inputParamsBranch = {};
        this.method = 'contract-management/maintenance';
        this.module = 'contract-admin';
        this.operation = 'Business/iCABSBPostcodesGrid';
        this.controls = [];
        this.inputParams = {};
        this.totalItems = 10;
        this.maxColumn = 6;
        this.itemsPerPage = 10;
        this.pageCurrent = 1;
        this.pageSize = 10;
        this.BranchDefaultCode = 'Yes';
        this.AllAllocationCode = 'All';
        this.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.headerClicked = '';
        this.sortType = '';
        this.gridSortHeaders = [
            {
                'fieldName': 'Postcode',
                'colName': 'Postcode',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'State',
                'colName': 'State',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'Town',
                'colName': 'Suburb',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'Allocated',
                'colName': 'Allocated',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'BranchDefault',
                'colName': 'Branch Default',
                'sortType': 'ASC'
            },
            {
                'fieldName': 'ServiceBranchName',
                'colName': 'Service Branch',
                'sortType': 'ASC'
            }
        ];
        this.pageId = PageIdentifier.ICABSBPOSTCODESGRID;
    }
    PostCodeGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.controls = [];
        this.brunchNumber = this.utils.getBranchCode();
        this.initForm();
        this.setUI();
        this.updateView();
        this.lookupBranchName();
    };
    PostCodeGridComponent.prototype.lookupBranchName = function () {
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
                _this.negBranchNumberSelected = {
                    id: _this.brunchNumber,
                    text: _this.brunchNumber + ' - ' + Branch.BranchName
                };
            }
        });
    };
    PostCodeGridComponent.prototype.setUI = function () {
        this.branchDefaultOption = [{
                'text': 'All',
                'value': 'All'
            }, {
                'text': 'Yes',
                'value': 'Yes'
            }, {
                'text': 'No',
                'value': 'No'
            }
        ];
        this.allocationOption = [{
                'text': 'All',
                'value': 'All'
            }, {
                'text': 'Yes',
                'value': 'Yes'
            }, {
                'text': 'No',
                'value': 'No'
            }
        ];
    };
    PostCodeGridComponent.prototype.selectedBranchDefault = function (CodeValue) {
        this.BranchDefaultCode = CodeValue;
    };
    PostCodeGridComponent.prototype.selectedAllAllocation = function (CodeValue) {
        this.AllAllocationCode = CodeValue;
    };
    PostCodeGridComponent.prototype.initForm = function () {
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    PostCodeGridComponent.prototype.onBranchDataReceived = function (obj) {
        this.brunchNumber = obj.BranchNumber;
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    };
    PostCodeGridComponent.prototype.getCurrentPage = function (event) {
        this.pageCurrent = event.value;
        this.updateView();
    };
    PostCodeGridComponent.prototype.updateView = function () {
        this.loadData(this.inputParams);
    };
    PostCodeGridComponent.prototype.loadData = function (params) {
        this.setFilterValues(params);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.inputParams.search = this.search;
        this.postCodeGrid.loadGridData(this.inputParams);
    };
    PostCodeGridComponent.prototype.setFilterValues = function (params) {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('BranchNumber', this.brunchNumber);
        this.search.set('SelAllocated', this.AllAllocationCode);
        this.search.set('SelBranchDefault', this.BranchDefaultCode);
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set('action', '2');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
        this.search.set('riGridMode', '0');
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    };
    PostCodeGridComponent.prototype.refresh = function (event) {
        this.pageCurrent = 1;
        this.loadData(this.inputParams);
    };
    PostCodeGridComponent.prototype.getGridInfo = function (info) {
        this.postCodePagination.totalItems = info.totalRows;
    };
    PostCodeGridComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.loadData({});
    };
    PostCodeGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBPostcodesGrid.html'
                },] },
    ];
    PostCodeGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    PostCodeGridComponent.propDecorators = {
        'postCodeGrid': [{ type: ViewChild, args: ['postCodeGrid',] },],
        'postCodePagination': [{ type: ViewChild, args: ['postCodePagination',] },],
    };
    return PostCodeGridComponent;
}(BaseComponent));
