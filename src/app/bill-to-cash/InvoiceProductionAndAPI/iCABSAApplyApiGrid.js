var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from './../../base/PageIdentifier';
import { CBBConstants } from './../../../shared/constants/cbb.constants';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
export var ApplyApiGridComponent = (function (_super) {
    __extends(ApplyApiGridComponent, _super);
    function ApplyApiGridComponent(injector) {
        _super.call(this, injector);
        this.pageSize = 10;
        this.maxColumn = 11;
        this.gridCurPage = 1;
        this.itemsPerPage = 11;
        this.pageId = '';
        this.controls = [
            { name: 'BusinessCode', readonly: false, disabled: false, required: false },
            { name: 'BusinessDesc', readonly: true, disabled: false, required: false },
            { name: 'YearNo', readonly: true, disabled: false, required: true },
            { name: 'LessThan', readonly: false, disabled: false, required: true },
            { name: 'MonthName', readonly: false, disabled: false, required: true },
            { name: 'ViewBy', readonly: false, disabled: false, required: true }
        ];
        this.headerParams = {
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAApplyAPIGrid',
            module: 'api'
        };
        this.viewTypesArray = [
            { text: 'branch', value: 'Branch' },
            { text: 'Region', value: 'Region' }
        ];
        this.formValidFlag = 1;
        this.lessThanValidFlag = false;
        this.yearNoValidFlag = false;
        this.showPromptMessageHeader = true;
        this.promptConfirmTitle = '';
        this.pageId = PageIdentifier.ICABSAAPPLYAPIGRID;
        this.pageTitle = 'Preview API';
        this.search = this.getURLSearchParamObject();
    }
    ApplyApiGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessDesc');
        this.cbbSubscription = this.cbbService.changeEmitter.subscribe(function (data) {
            switch (data[CBBConstants.c_s_CHANGED_PROPERTY]) {
                case CBBConstants.c_s_CHANGE_BRANCH_CODE:
                case CBBConstants.c_s_CHANGE_BUSINESS_CODE:
                case CBBConstants.c_s_CHANGE_COUNTRY_CODE:
                    console.log(' CBB change');
                    _this.getFormData('Business');
                    break;
            }
        });
        if (this.attributes.MonthNo) {
            this.populateUIFromFormData();
            this.setControlValue('ViewBy', this.attributes.ViewBy);
            this.search = this.getURLSearchParamObject();
            this.buildGrid();
        }
        else {
            this.pageParams.months = [];
            this.setControlValue('ViewBy', 'Branch');
            this.attributes.ViewBy = 'Branch';
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.businessCode());
            this.getFormData('Business');
        }
    };
    ApplyApiGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        if (this.cbbSubscription) {
            this.cbbSubscription = null;
        }
    };
    ApplyApiGridComponent.prototype.onViewTypeCodeChange = function (viewType) {
        if (viewType === 'Branch') {
            this.gridSortHeaders = [{
                    'fieldName': 'BranchNumber',
                    'colName': 'Branch Number',
                    'sortType': 'ASC'
                }];
        }
        else {
            this.gridSortHeaders = [{
                    'fieldName': 'RegionCode',
                    'colName': 'Region Code',
                    'sortType': 'ASC'
                }];
        }
        this.attributes.ViewBy = viewType;
    };
    ApplyApiGridComponent.prototype.getGridInfo = function (info) {
        this.totalRecords = info.totalRows;
    };
    ApplyApiGridComponent.prototype.getSelectedRowInfo = function (info) {
        if (info.cellData['rowID'] !== 'TOTAL') {
            if (this.attributes.ViewBy === 'Branch') {
                this.attributes.BranchName = info.trRowData[1].text;
                this.attributes.BranchNumber = info.trRowData[0].text;
            }
            else {
                this.attributes.RegionCode = info.trRowData[0].text;
                this.attributes.RegionDescription = info.trRowData[1].text;
            }
            this.attributes.MonthNo = this.getControlValue('MonthName');
            this.attributes.MonthName = this.pageParams.months[parseInt(this.getControlValue('MonthName'), 10) - 1].text;
            this.attributes.BusinessCode = this.businessCode;
            this.attributes.CountryCode = this.countryCode;
            this.attributes.Row = this.businessCode;
            this.attributes.YearNo = this.riExchange.riInputElement.GetValue(this.uiForm, 'YearNo');
            this.attributes.Row = info.cellData['rowID'];
            for (var key in this.attributes) {
                if (key) {
                    this.riExchange.setParentAttributeValue(key, this.attributes[key]);
                }
            }
            this.navigate('ApplyAPIGrid', 'grid/application/applyapigrid');
        }
    };
    ApplyApiGridComponent.prototype.getCurrentPage = function (data) {
        this.gridCurPage = data.value;
        this.buildGrid();
    };
    ApplyApiGridComponent.prototype.sortGrid = function (data) {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, data.sort === 'DESC' ? 'Descending' : 'Ascending');
        this.buildGrid();
    };
    ApplyApiGridComponent.prototype.refresh = function () {
        if (this.validateEditableFields()) {
            this.gridCurPage = 1;
            this.apiGrid.clearGridData();
            this.buildGrid();
        }
        else {
            this.errorModal.showHeader = true;
            this.errorModal.showCloseButton = true;
            var data = {
                'errorMessage': MessageConstant.Message.NoSpecialCharecter
            };
            this.errorModal.show(data, true);
        }
    };
    ApplyApiGridComponent.prototype.onLessThanValueChange = function () {
        var temp = this.getControlValue('LessThan');
        this.setControlValue('LessThan', this.utils.numToDecimal(temp, 2));
    };
    ApplyApiGridComponent.prototype.validateEditableFields = function () {
        if (this.uiForm['controls']['YearNo']['value'].length === 0) {
            this.formValidFlag = 0;
            this.yearNoValidFlag = true;
            return false;
        }
        else if (!isNaN(this.uiForm['controls']['YearNo']['value'])) {
            this.formValidFlag = 1;
            this.yearNoValidFlag = false;
        }
        else {
            this.formValidFlag = 0;
            this.yearNoValidFlag = true;
            return false;
        }
        if (this.uiForm['controls']['LessThan']['value'].length === 0) {
            this.formValidFlag = 0;
            this.lessThanValidFlag = true;
            return false;
        }
        else if (!isNaN(this.uiForm['controls']['LessThan']['value'])) {
            this.formValidFlag = 1;
            this.lessThanValidFlag = false;
        }
        else {
            this.formValidFlag = 0;
            this.lessThanValidFlag = true;
            return false;
        }
        if (this.formValidFlag === 1) {
            return true;
        }
    };
    ApplyApiGridComponent.prototype.buildGrid = function () {
        this.search.delete('YearNo');
        this.search.delete('MonthNo');
        this.search.delete('postDesc');
        this.search.set('ViewBy', this.attributes.ViewBy);
        var previewMonth = this.getControlValue('MonthName');
        this.search.set(this.serviceConstants.Action, '2');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'YearNo') && previewMonth) {
            this.search.set('YearNo', this.riExchange.riInputElement.GetValue(this.uiForm, 'YearNo'));
            this.search.set('MonthNo', previewMonth);
        }
        this.search.set('Level', 'Business');
        this.search.set('LessThan', this.riExchange.riInputElement.GetValue(this.uiForm, 'LessThan'));
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '2229546');
        this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        var apiParams = {};
        apiParams.module = this.headerParams.module;
        apiParams.method = this.headerParams.method;
        apiParams.operation = this.headerParams.operation;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        apiParams.search = this.search;
        this.apiGrid.itemsPerPage = this.pageSize;
        this.apiGrid.loadGridData(apiParams);
    };
    ApplyApiGridComponent.prototype.getFormData = function (postDesc) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('postDesc', postDesc);
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.search)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                if (postDesc && postDesc === 'GetMonthNames') {
                    _this.pageParams.months = [];
                    var monthString = e.MonthNames;
                    var monthArray = monthString.split(',');
                    for (var i = 1; i <= monthArray.length; i++) {
                        var month = { text: monthArray[i - 1], value: i };
                        _this.pageParams.months.push(month);
                    }
                    if (_this.attributes.MonthNo) {
                        _this.setControlValue('MonthName', _this.attributes.MonthNo);
                        _this.search = _this.getURLSearchParamObject();
                        _this.buildGrid();
                    }
                    else {
                        _this.getFormData('APIMonth');
                    }
                }
                else if (postDesc && postDesc === 'APIMonth') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'LessThan', _this.utils.numToDecimal(e.LessThanValue, 2));
                    _this.setControlValue('MonthName', (e.APIMonth).toString());
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'YearNo', e.APIYear);
                }
                else if (postDesc && postDesc === 'Business') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'BusinessDesc', e.BusinessDesc);
                    _this.getFormData('GetMonthNames');
                }
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
            _this.buildGrid();
        }, function (error) {
            _this.errorMessage = error;
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    ApplyApiGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAApplyApiGrid.html'
                },] },
    ];
    ApplyApiGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ApplyApiGridComponent.propDecorators = {
        'apiGrid': [{ type: ViewChild, args: ['ApplyApiGrid',] },],
        'apiPagination': [{ type: ViewChild, args: ['ApiGridPagination',] },],
        'businessCodesDropdown': [{ type: ViewChild, args: ['BusinessCodeDropdown',] },],
        'countryCodesDropdown': [{ type: ViewChild, args: ['CountryCodeDropdown',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return ApplyApiGridComponent;
}(BaseComponent));
