var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ClosedTemplateSearchComponent = (function (_super) {
    __extends(ClosedTemplateSearchComponent, _super);
    function ClosedTemplateSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.controls = [
            { name: 'BusinessCode', readonly: false, disabled: true, required: false },
            { name: 'BusinessDesc', readonly: false, disabled: true, required: false }
        ];
        this.tableheading = 'Closed Template Search';
        this.IsgrdBusinessDetail = false;
        this.queryParams = {
            operation: 'Business/iCABSBClosedTemplateSearch',
            module: 'template',
            method: 'service-planning/search'
        };
        this.search = new URLSearchParams();
        this.columns = [
            { title: 'Template Number', name: 'ClosedCalendarTemplateNumber', sortType: 'ASC' },
            { title: 'Template Name', name: 'TemplateName' },
            { title: 'Premises Specific', name: 'PremiseSpecificInd' },
            { title: 'Short Name', name: 'PremiseSpecificText' }
        ];
        this.rowmetadata = new Array();
        this.pageId = PageIdentifier.ICABSBCLOSEDTEMPLATESEARCH;
    }
    ClosedTemplateSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Closed Template Search';
        this.fetchTranslationContent();
    };
    ClosedTemplateSearchComponent.prototype.updateView = function (params) {
        switch (params.parentMode) {
            case 'LookUp-UserAuthorityBranch':
                this.IsgrdBusinessDetail = true;
                this.setControlValue('BusinessCode', this.utils.getBusinessCode());
                break;
        }
        this.pageParams.parentMode = params.parentMode;
        this.buildTable();
    };
    ClosedTemplateSearchComponent.prototype.buildTable = function () {
        this.search = this.getURLSearchParamObject();
        this.rowmetadata.push({ title: 'Premises Specific', name: 'PremiseSpecificInd', type: 'img' });
        this.queryParams.rowmetadata = this.rowmetadata;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.queryParams.search = this.search;
        this.closedTemplateSearchTable.loadTableData(this.queryParams);
    };
    ClosedTemplateSearchComponent.prototype.onSelect = function (event) {
        var vntReturnData = event.row;
        var returnObj;
        returnObj = {
            'ClosedCalendarTemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
            'TemplateName': vntReturnData.TemplateName
        };
        if (this.pageParams.parentMode === 'LookUp-AllAccess' || this.pageParams.parentMode === 'LookUp-AllAccessCalendar') {
            returnObj = {
                'ClosedCalendarTemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
                'TemplateName': vntReturnData.TemplateName
            };
        }
        else if (this.pageParams.parentMode === 'LookUp-LookUp-AllAccessCalendarServiceCover') {
            returnObj = {
                'ClosedCalendarTemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
                'ClosedTemplateName': vntReturnData.TemplateName
            };
        }
        else if (this.pageParams.parentMode === 'LookUp-Combined') {
            returnObj = {
                'TemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
                'TemplateName': vntReturnData.TemplateName
            };
        }
        else if (this.pageParams.parentMode === 'LookUp-UpliftCalendarServiceCover') {
            returnObj = {
                'UpliftTemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
                'UpliftTemplateName': vntReturnData.TemplateName
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    ClosedTemplateSearchComponent.prototype.tableDataLoaded = function (data) {
        var tableRecords = data.tableData['records'];
        if (tableRecords.length === 0) {
            this.tableheading = 'No record found';
        }
    };
    ClosedTemplateSearchComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Contract API Maintenance', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.tableheading = res;
                }
            });
        });
    };
    ClosedTemplateSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBClosedTemplateSearch.html'
                },] },
    ];
    ClosedTemplateSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    ClosedTemplateSearchComponent.propDecorators = {
        'closedTemplateSearchTable': [{ type: ViewChild, args: ['closedTemplateSearchTable',] },],
    };
    return ClosedTemplateSearchComponent;
}(BaseComponent));
