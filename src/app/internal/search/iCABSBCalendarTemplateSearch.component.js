var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
export var CalendarTemplateSearchComponent = (function (_super) {
    __extends(CalendarTemplateSearchComponent, _super);
    function CalendarTemplateSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.queryParams = {
            operation: 'Business/iCABSBCalendarTemplateSearch',
            module: 'template',
            method: 'service-planning/search'
        };
        this.controls = [
            { name: 'FrequencySearchValue', readonly: false, disabled: false, required: false },
            { name: 'ChkToleranceViewOnly', readonly: false, disabled: false, required: false },
            { name: 'VisitFrequency', readonly: false, disabled: false, required: false },
            { name: 'ServiceVisitFrequency', readonly: false, disabled: false, required: false },
            { name: 'BranchNumber', readonly: false, disabled: false, required: false }
        ];
        this.pageId = '';
        this.showMessageHeader = true;
        this.tdAddRecord = true;
        this.search = new URLSearchParams();
        this.tableheading = 'Calendar Template Search';
        this.itemsPerPage = '10';
        this.page = '1';
        this.totalItem = '11';
        this.pageSize = '14';
        this.inputParams = {};
        this.rowmetadata = new Array();
        this.pageId = PageIdentifier.ICABSBCALENDARTEMPLATESEARCH;
    }
    CalendarTemplateSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Calendar Template Search';
        this.window_onload();
        this.buildTableColumns();
    };
    CalendarTemplateSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    CalendarTemplateSearchComponent.prototype.window_onload = function () {
        this.inputParams.parentMode = this.riExchange.getParentMode();
        this.setControlValue('ChkToleranceViewOnly', false);
        switch (this.inputParams.parentMode) {
            case 'LookUp-UserAuthorityBranch':
                this.utils.getLoggedInBranch();
                break;
            default:
                break;
        }
    };
    CalendarTemplateSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        this.columns = [];
        this.inputParams.columns = this.columns;
        this.inputParams.rowmetadata = [];
        this.inputParams.rowmetadata = this.rowmetadata;
        this.getTranslatedValue('Template Number', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'AnnualCalendarTemplateNumber' });
            }
            else {
                _this.columns.push({ title: 'Template Number', name: 'AnnualCalendarTemplateNumber' });
            }
        });
        this.getTranslatedValue('Template Name', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'TemplateName' });
            }
            else {
                _this.columns.push({ title: 'Template Name', name: 'TemplateName' });
            }
        });
        this.getTranslatedValue('Tolerance Type ', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'ToleranceType' });
            }
            else {
                _this.columns.push({ title: 'Tolerance Type', name: 'ToleranceType' });
            }
        });
        this.getTranslatedValue('Visit Tolerances', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'Tolerance' });
            }
            else {
                _this.columns.push({ title: 'Visit Tolerances', name: 'Tolerance' });
            }
        });
        var _ServiceVisitFrequency = this.riExchange.getParentHTMLValue('ServiceVisitFrequency');
        if (this.inputParams.parentMode === 'LookUp-AnnualCalendar' && _ServiceVisitFrequency !== '') {
            this.setControlValue('VisitFrequency', _ServiceVisitFrequency);
            this.getTranslatedValue('Visit Frequency', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'VisitFrequency' });
                }
                else {
                    _this.columns.push({ title: 'Visit Frequency', name: 'VisitFrequency' });
                }
            });
        }
        else {
            if (!isNaN(parseInt(this.getControlValue('FrequencySearchValue'), 0))) {
                if (parseInt(this.getControlValue('FrequencySearchValue'), 0) > 0) {
                    this.setControlValue('VisitFrequency', this.getControlValue('FrequencySearchValue'));
                }
                else {
                    this.setControlValue('VisitFrequency', this.getControlValue('FrequencySearchValue'));
                }
            }
            else {
                this.setControlValue('VisitFrequency', '');
            }
            this.getTranslatedValue('Visit Frequency', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'VisitFrequency' });
                }
                else {
                    _this.columns.push({ title: 'Visit Frequency', name: 'VisitFrequency' });
                }
            });
        }
        switch (this.inputParams.parentMode) {
            case 'LookUp-AllAccess':
            case 'LookUp-AnnualCalendar':
            case 'LookUp-AllAccessCalendar':
                this.setControlValue('BranchNumber', this.utils.getLoggedInBranch());
                break;
            default:
                this.setControlValue('BranchNumber', this.utils.getBranchCode());
                break;
        }
        this.buildTable();
    };
    CalendarTemplateSearchComponent.prototype.buildTable = function () {
        this.CalendarTemplateSearchTable.clearTable();
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('VisitFrequency', this.getControlValue('VisitFrequency'));
        this.search.set('BranchNumber', this.getControlValue('BranchNumber'));
        this.queryParams.search = this.search;
        this.CalendarTemplateSearchTable.loadTableData(this.queryParams);
    };
    CalendarTemplateSearchComponent.prototype.tableRowClick = function (event) {
        var annualCalendarTemplateNumber = event.row.AnnualCalendarTemplateNumber;
        var templateName = event.row.TemplateName;
        var returnObj = {
            'AnnualCalendarTemplateNumber': annualCalendarTemplateNumber,
            'TemplateName': templateName,
            'row': event.row
        };
        switch (this.inputParams.parentMode) {
            case 'LookUp-AllAccess':
                this.riExchange.setParentHTMLValue('TemplateNumber', returnObj.AnnualCalendarTemplateNumber);
                this.riExchange.setParentHTMLValue('TemplateName', returnObj.TemplateName);
                break;
            case 'LookUp-AllAccessCalendar':
                this.riExchange.setParentHTMLValue('AnnualCalendarTemplateNumber', returnObj.AnnualCalendarTemplateNumber);
                this.riExchange.setParentHTMLValue('TemplateName', returnObj.TemplateName);
                break;
            default:
                this.riExchange.setParentHTMLValue('AnnualCalendarTemplateNumber', returnObj.AnnualCalendarTemplateNumber);
                this.riExchange.setParentHTMLValue('TemplateName', returnObj.TemplateName);
                break;
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    CalendarTemplateSearchComponent.prototype.onClickSearch = function (event) {
        var frequencyValue = this.getControlValue('FrequencySearchValue');
        var regex = new RegExp('^[0-9]*$');
        if (regex.test(frequencyValue))
            this.buildTableColumns();
    };
    CalendarTemplateSearchComponent.prototype.onAddNew = function (event) {
        var msgContent = { title: '', msg: 'This page iCABSACalendarTemplateMaintenance.htm is under construction' };
        this.messageModal.show(msgContent, false);
    };
    CalendarTemplateSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    CalendarTemplateSearchComponent.prototype.refresh = function () {
        this.buildTable();
    };
    CalendarTemplateSearchComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        this.tdAddRecord = params.showAddNew ? true : false;
        this.setControlValue('ChkToleranceViewOnly', params.ChkToleranceViewOnly);
        if (params.ChkToleranceViewOnly !== '') {
            this.setControlValue('ChkToleranceViewOnly', params.ChkToleranceViewOnly);
        }
        else {
            this.setControlValue('ChkToleranceViewOnly', '');
        }
        this.setControlValue('VisitFrequency', params.ChkToleranceViewOnly);
        if (params.VisitFrequency !== '') {
            this.setControlValue('VisitFrequency', params.VisitFrequency);
        }
        else {
            this.setControlValue('VisitFrequency', '');
        }
        this.buildTableColumns();
    };
    CalendarTemplateSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBCalendarTemplateSearch.html'
                },] },
    ];
    CalendarTemplateSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    CalendarTemplateSearchComponent.propDecorators = {
        'CalendarTemplateSearchTable': [{ type: ViewChild, args: ['CalendarTemplateSearchTable',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return CalendarTemplateSearchComponent;
}(BaseComponent));
