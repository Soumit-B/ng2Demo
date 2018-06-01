var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { HttpService } from '../../../shared/services/http-service';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var BusinessSystemCharacteristicsCustomMaintenanceComponent = (function (_super) {
    __extends(BusinessSystemCharacteristicsCustomMaintenanceComponent, _super);
    function BusinessSystemCharacteristicsCustomMaintenanceComponent(injector, _httpService) {
        _super.call(this, injector);
        this.injector = injector;
        this._httpService = _httpService;
        this.pageId = '';
        this.inputParams = {};
        this.method = 'it-functions/admin';
        this.module = 'configuration';
        this.operation = 'System/iCABSSBusinessSystemCharacteristicsCustomMaintenance';
        this.ModuleObject = [];
        this.ModuleData = [{}];
        this.pageCurrent = '1';
        this.curPage = 1;
        this.pageSize = 10;
        this.maxColumn = 8;
        this.itemsPerPage = 10;
        this.scModule = 'X';
        this.rowUpdate = false;
        this.controls = [{
                name: 'BusinessCode',
                readonly: true,
                disabled: true,
                required: false
            },
            {
                name: 'BusinessDesc',
                readonly: true,
                disabled: true,
                required: false
            },
            {
                name: 'TextFilter',
                readonly: false,
                disabled: false,
                required: false
            },
            {
                name: 'NumberFilter',
                readonly: true,
                disabled: false,
                required: false
            },
            {
                name: 'SelectedLineRow'
            },
            {
                name: 'SelectedLineRowID'
            }
        ];
        this.totalRecords = 15;
        this.showMessageHeader = true;
        this.pageId = PageIdentifier.ICABSSBUSINESSSYSTEMCHARACTERISTICSCUSTOMMAINTENANCE;
    }
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = this.pageSize;
        this.riGrid.FunctionUpdateSupport = true;
        this.initForm();
        this.setupPage();
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('SCNumber', 'SCNumber', 'SCNumber', MntConst.eTypeInteger, 3, false, '');
        this.riGrid.AddColumnUpdateSupport('SCNumber', false);
        this.riGrid.AddColumnOrderable('SCNumber', true);
        this.riGrid.AddColumn('SCDescription', 'SCDescription', 'SCDescription', MntConst.eTypeTextFree, 30, false, '');
        this.riGrid.AddColumnUpdateSupport('SCDescription', false);
        this.riGrid.AddColumnOrderable('SCDescription', true);
        this.riGrid.AddColumn('SCExists', 'SCExists', 'SCExists', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('SCExists', false);
        this.riGrid.AddColumn('SCRequired', 'SCRequired', 'SCRequired', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('SCRequired', false);
        this.riGrid.AddColumn('SCLogical', 'SCLogical', 'SCLogical', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumnUpdateSupport('SCLogical', false);
        this.riGrid.AddColumn('SCText', 'SCText', 'SCText', MntConst.eTypeTextFree, 40, false, '');
        this.riGrid.AddColumnUpdateSupport('SCText', true);
        this.riGrid.AddColumn('SCValue', 'SCValue', 'SCValue', MntConst.eTypeDecimal2, 8, false, '');
        this.riGrid.AddColumnUpdateSupport('SCValue', true);
        this.riGrid.AddColumn('SCInteger', 'SCInteger', 'SCInteger', MntConst.eTypeInteger, 6, false, '');
        this.riGrid.AddColumnUpdateSupport('SCInteger', true);
        this.riGrid.Complete();
        this.riGrid_BeforeExecute();
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('SCModule', this.scModule);
        gridParams.set('TextFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'TextFilter'));
        gridParams.set('NumberFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'NumberFilter'));
        gridParams.set('FileUploaded', '');
        gridParams.set('riSortOrder', this.riGrid.SortOrder);
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                return;
            }
            _this.curPage = data.pageData ? data.pageData.pageNumber : 1;
            _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
            if (_this.riGrid.Update && _this.getControlValue('SelectedLineRow')) {
                _this.riGrid.StartRow = _this.getControlValue('SelectedLineRow');
                _this.riGrid.StartColumn = 0;
                _this.riGrid.UpdateHeader = false;
                _this.riGrid.UpdateFooter = false;
            }
            _this.riGrid.UpdateBody = true;
            _this.riGrid.Execute(data);
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.tbody_onDblclick = function (event) {
        if (event.srcElement.className === 'pointer') {
            switch (event.srcElement.parentElement.getAttribute('name')) {
                case 'SCRequired':
                case 'SCLogical':
                    this.gridFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
                    this.callRequiredChnagedrequest(this.getControlValue('SelectedLineRowID'), 'SCRequired');
                    break;
            }
        }
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.onHeaderClick = function () {
        this.riGrid_BeforeExecute();
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.gridFocus = function (rsrcElement) {
        rsrcElement.select();
        this.setControlValue('Sequence', rsrcElement.value);
        this.setControlValue('SelectedLineRowID', rsrcElement.getAttribute('RowID'));
        this.setControlValue('SelectedLineRow', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.riGrid_BodyColumnFocus = function (event) {
        if (event.srcElement.parentElement.getAttribute('name') === 'SCText') {
            event.srcElement.parentElement.parentElement.parentElement.children[5].children[0].children[0].maxlength = 600;
        }
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.riGrid_AfterExecute = function () {
        if (!this.riGrid.Update) {
            var rowIndex = this.getControlValue('SelectedLineRow') ? this.getControlValue('SelectedLineRow') : 0;
            var rsrcElement = this.riGrid.HTMLGridBody.children[rowIndex].children[0].children[0].children[0];
            this.gridFocus(rsrcElement);
            rsrcElement.focus();
            rsrcElement.select();
        }
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.initForm = function () {
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.setupPage = function () {
        var _this = this;
        this.formData.BusinessCode = this.businessCode();
        var countryCode = this.countryCode();
        this.utils.getBusinessDesc(this.businessCode()).subscribe(function (data) {
            _this.formData.BusinessDesc = data.BusinessDesc;
            _this.populateUIFromFormData();
        });
        this.loadModuleData(this.inputParams);
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.callRequiredChnagedrequest = function (rowID, sc) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['fn'] = 'CheckBox';
        formdata['FieldName'] = sc;
        formdata['Rowid'] = rowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
            }
            else {
                _this.riGrid.Update = true;
                _this.riGrid_BeforeExecute();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorModal.show(error, true);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.updateView = function () {
        this.buildGrid();
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.loadModuleData = function (params) {
        var _this = this;
        this.setFilterValuesForBuildModule(params);
        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            _this.ModuleText = data['ValidList'].split(',');
            for (var i = 0; i < _this.ModuleText.length; i++) {
                var x = _this.ModuleText[i].split('|');
                var a = {
                    'text': x[1],
                    'value': x[0]
                };
                _this.ModuleObject.push(a);
            }
            _this.ModuleData = _this.ModuleObject;
        }, function (error) {
            _this.errorModal.show(error, true);
        });
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.loadExportData = function (params) {
        var _this = this;
        this.setFilerValueforExport(params);
        this.inputParams.search = this.search;
        this._httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search)
            .subscribe(function (data) {
            if (data['SuperUserAllowInd'] === 'Y') {
                _this.zone.run(function () {
                    _this.messageModal.show({
                        msg: 'Exported. File send as Email.',
                        title: 'Message'
                    }, false);
                });
            }
        }, function (error) {
            _this.errorModal.show(error, true);
        });
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.setFilterValuesForBuildModule = function (params) {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set('fn', 'BuildModuleCombo');
        this.search.set('DTE', this.utils.formatDate(new Date()));
        this.search.set('TME', new Date().getTime().toString());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.setFilerValueforExport = function (param) {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set('fn', 'ExportSystemChars');
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.BuildModuleCombo = function () {
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.btnImportBSC_onclick = function (event) {
        var _this = this;
        this.zone.run(function () {
            _this.messageModal.show({
                msg: 'Page under construction.',
                title: 'Message'
            }, false);
        });
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.btnExportBSC_onclick = function (event) {
        this.loadExportData(this.inputParams);
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.onModuleOptionChange = function (event) {
        if (this.ModuleOptions.selectedItem) {
            this.scModule = this.ModuleOptions.selectedItem;
            this.updateView();
        }
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.getGridInfo = function (info) {
        this.sysCharPagination.totalItems = info.totalRows;
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.prototype.onSubmit = function () {
        return;
    };
    BusinessSystemCharacteristicsCustomMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSBusinessSystemCharacteristicsCustomMaintenance.html'
                },] },
    ];
    BusinessSystemCharacteristicsCustomMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: HttpService, },
    ];
    BusinessSystemCharacteristicsCustomMaintenanceComponent.propDecorators = {
        'ModuleOptions': [{ type: ViewChild, args: ['Module',] },],
        'sysCharGrid': [{ type: ViewChild, args: ['grdGrid',] },],
        'sysCharPagination': [{ type: ViewChild, args: ['sysCharPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return BusinessSystemCharacteristicsCustomMaintenanceComponent;
}(BaseComponent));
