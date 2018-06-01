var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
export var BatchProgramScheduleSearchComponent = (function (_super) {
    __extends(BatchProgramScheduleSearchComponent, _super);
    function BatchProgramScheduleSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.method = 'it-functions/ri-model';
        this.module = 'batch-process';
        this.operation = 'Model/riMBatchProgramScheduleSearch';
        this.search = new URLSearchParams();
        this.itemsPerPage = '10';
        this.page = '1';
        this.totalItem = '11';
        this.inputParams = {};
        this.columns = new Array();
        this.rowmetadata = new Array();
        this.controls = [];
        this.setParentEditabelMode = 'UPDATE';
        this.pageId = PageIdentifier.RIMBATCHPROGRAMSCHEDULESEARCH;
    }
    BatchProgramScheduleSearchComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
        this.buildTableColumns();
        this.updateView();
    };
    BatchProgramScheduleSearchComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    BatchProgramScheduleSearchComponent.prototype.buildTableColumns = function () {
        var _this = this;
        this.getTranslatedValue('Unique Number', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'riBPSUniqueNumber' });
            }
            else {
                _this.columns.push({ title: 'Code', name: 'riBPSUniqueNumber', sort: 'ASC' });
            }
        });
        this.getTranslatedValue('Program Name', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'riBatchProgramName' });
            }
            else {
                _this.columns.push({ title: 'Program Name', name: 'riBatchProgramName' });
            }
        });
        this.getTranslatedValue('Next Date', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'riBPSNextDate' });
            }
            else {
                _this.columns.push({ title: 'Next Date', name: 'riBPSNextDate' });
            }
        });
        this.getTranslatedValue('Next Time', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'riBPSNextTime' });
            }
            else {
                _this.columns.push({ title: 'Next Time', name: 'riBPSNextTime' });
            }
        });
        this.inputParams.columns = [];
        this.inputParams.columns = this.columns;
    };
    BatchProgramScheduleSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        returnObj = event.row;
        event.row.riBPSMinutes.replace(/yes/g, true);
        event.row.riBPSMinutes.replace(/no/g, false);
        var riMinutes = event.row.riBPSMinutes.split('|');
        returnObj.riMinute00 = riMinutes[0];
        returnObj.riMinute15 = riMinutes[1];
        returnObj.riMinute30 = riMinutes[2];
        returnObj.riMinute45 = riMinutes[3];
        event.row.riBPSHours.replace(/yes/g, true);
        event.row.riBPSHours.replace(/no/g, false);
        var riBPSHours = event.row.riBPSHours.split('|');
        returnObj.riHour00 = riBPSHours[0];
        returnObj.riHour01 = riBPSHours[1];
        returnObj.riHour02 = riBPSHours[2];
        returnObj.riHour03 = riBPSHours[3];
        returnObj.riHour04 = riBPSHours[4];
        returnObj.riHour05 = riBPSHours[5];
        returnObj.riHour06 = riBPSHours[6];
        returnObj.riHour07 = riBPSHours[7];
        returnObj.riHour08 = riBPSHours[8];
        returnObj.riHour09 = riBPSHours[9];
        returnObj.riHour10 = riBPSHours[10];
        returnObj.riHour11 = riBPSHours[11];
        returnObj.riHour12 = riBPSHours[12];
        returnObj.riHour13 = riBPSHours[13];
        returnObj.riHour14 = riBPSHours[14];
        returnObj.riHour15 = riBPSHours[15];
        returnObj.riHour16 = riBPSHours[16];
        returnObj.riHour17 = riBPSHours[17];
        returnObj.riHour18 = riBPSHours[18];
        returnObj.riHour19 = riBPSHours[19];
        returnObj.riHour20 = riBPSHours[20];
        returnObj.riHour21 = riBPSHours[21];
        returnObj.riHour22 = riBPSHours[22];
        returnObj.riHour23 = riBPSHours[23];
        event.row.riBPSDays.replace(/yes/g, true);
        event.row.riBPSDays.replace(/no/g, false);
        var riBPSDays = event.row.riBPSDays.split('|');
        returnObj.riDay00 = riBPSDays[0];
        returnObj.riDay01 = riBPSDays[1];
        returnObj.riDay02 = riBPSDays[2];
        returnObj.riDay03 = riBPSDays[3];
        returnObj.riDay04 = riBPSDays[4];
        returnObj.riDay05 = riBPSDays[5];
        returnObj.riDay06 = riBPSDays[6];
        returnObj.riDay07 = riBPSDays[7];
        returnObj.riDay08 = riBPSDays[8];
        returnObj.riDay09 = riBPSDays[9];
        returnObj.riDay10 = riBPSDays[10];
        returnObj.riDay11 = riBPSDays[11];
        returnObj.riDay12 = riBPSDays[12];
        returnObj.riDay13 = riBPSDays[13];
        returnObj.riDay14 = riBPSDays[14];
        returnObj.riDay15 = riBPSDays[15];
        returnObj.riDay16 = riBPSDays[16];
        returnObj.riDay17 = riBPSDays[17];
        returnObj.riDay18 = riBPSDays[18];
        returnObj.riDay19 = riBPSDays[19];
        returnObj.riDay20 = riBPSDays[20];
        returnObj.riDay21 = riBPSDays[21];
        returnObj.riDay22 = riBPSDays[22];
        returnObj.riDay23 = riBPSDays[23];
        returnObj.riDay24 = riBPSDays[24];
        returnObj.riDay25 = riBPSDays[25];
        returnObj.riDay26 = riBPSDays[26];
        returnObj.riDay27 = riBPSDays[27];
        returnObj.riDay28 = riBPSDays[28];
        returnObj.riDay29 = riBPSDays[29];
        returnObj.riDay30 = riBPSDays[30];
        returnObj.riDay31 = riBPSDays[31];
        event.row.riBPSWeekDays.replace(/yes/g, true);
        event.row.riBPSWeekDays.replace(/no/g, false);
        var riWeekDay01 = event.row.riBPSWeekDays.split('|');
        returnObj.riWeekDay01 = riWeekDay01[0];
        returnObj.riWeekDay02 = riWeekDay01[1];
        returnObj.riWeekDay03 = riWeekDay01[2];
        returnObj.riWeekDay04 = riWeekDay01[3];
        returnObj.riWeekDay05 = riWeekDay01[4];
        returnObj.riWeekDay06 = riWeekDay01[5];
        returnObj.riWeekDay07 = riWeekDay01[6];
        event.row.riBPSMonths.replace(/yes/g, true);
        event.row.riBPSMonths.replace(/no/g, false);
        var riBPSMonths = event.row.riBPSMonths.split('|');
        returnObj.riMonth01 = riBPSMonths[0];
        returnObj.riMonth02 = riBPSMonths[1];
        returnObj.riMonth03 = riBPSMonths[2];
        returnObj.riMonth04 = riBPSMonths[3];
        returnObj.riMonth05 = riBPSMonths[4];
        returnObj.riMonth06 = riBPSMonths[5];
        returnObj.riMonth07 = riBPSMonths[6];
        returnObj.riMonth08 = riBPSMonths[7];
        returnObj.riMonth09 = riBPSMonths[8];
        returnObj.riMonth10 = riBPSMonths[9];
        returnObj.riMonth11 = riBPSMonths[10];
        returnObj.riMonth12 = riBPSMonths[11];
        returnObj.setParentEditabelMode = this.setParentEditabelMode;
        this.ellipsis.sendDataToParent(returnObj);
    };
    BatchProgramScheduleSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    BatchProgramScheduleSearchComponent.prototype.updateView = function () {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.PageCurrent, this.page);
        this.inputParams.search = this.search;
        this.programScheduleGrid.loadTableData(this.inputParams);
    };
    BatchProgramScheduleSearchComponent.prototype.refresh = function () {
        this.updateView();
    };
    BatchProgramScheduleSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'riMBatchProgramScheduleSearch.html'
                },] },
    ];
    BatchProgramScheduleSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    BatchProgramScheduleSearchComponent.propDecorators = {
        'programScheduleGrid': [{ type: ViewChild, args: ['programScheduleGrid',] },],
    };
    return BatchProgramScheduleSearchComponent;
}(BaseComponent));
