var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
export var OccupationSearchComponent = (function (_super) {
    __extends(OccupationSearchComponent, _super);
    function OccupationSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.controls = [];
        this.search = new URLSearchParams();
        this.itemsPerPage = 10;
        this.columns = new Array();
        this.rowmetadata = new Array();
        this.tableheading = 'Occupation Search';
        this.showMessageHeader = true;
        this.inputParams = {
            operation: 'System/iCABSSOccupationSearch',
            module: 'employee',
            method: 'people/search'
        };
        this.pageId = PageIdentifier.ICABSSOCCUPATIONSEARCH;
    }
    OccupationSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Occupation Search';
        this.createPage(this.parentMode);
        this.updateTable();
    };
    OccupationSearchComponent.prototype.createPage = function (pageparentmode) {
        this.addTableColumns();
        switch (this.ellipsis.childConfigParams['parentMode']) {
            case 'LookUp-Service':
                this.search.set('ServiceEmployeeInd', 'True');
                break;
            case 'LookUp-Sales':
                this.search.set('SalesEmployeeInd', 'True');
                break;
        }
    };
    OccupationSearchComponent.prototype.addTableColumns = function () {
        var _this = this;
        this.getTranslatedValue('Type Code', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'OccupationCode' });
            }
            else {
                _this.columns.push({ title: 'Type Code', name: 'OccupationCode', sort: 'ASC' });
            }
        });
        this.getTranslatedValue('Description', null).subscribe(function (res) {
            if (res) {
                _this.columns.push({ title: res, name: 'OccupationDesc' });
            }
            else {
                _this.columns.push({ title: 'Description', name: 'OccupationDesc', sort: 'ASC' });
            }
        });
        if (this.ellipsis.childConfigParams['parentMode'] !== 'LookUp-Service' && this.ellipsis.childConfigParams['parentMode'] !== 'LookUp-Sales') {
            this.getTranslatedValue('Service Employee', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'ServiceEmployeeInd' });
                    _this.rowmetadata.push({ title: res, name: 'ServiceEmployeeInd', type: 'img' });
                }
                else {
                    _this.columns.push({ title: 'Service Employee', name: 'ServiceEmployeeInd' });
                    _this.rowmetadata.push({ title: 'Service Employee', name: 'ServiceEmployeeInd', type: 'img' });
                }
            });
            this.getTranslatedValue('Sales Employee', null).subscribe(function (res) {
                if (res) {
                    _this.columns.push({ title: res, name: 'SalesEmployeeInd' });
                    _this.rowmetadata.push({ title: res, name: 'SalesEmployeeInd', type: 'img' });
                }
                else {
                    _this.columns.push({ title: 'Sales Employee', name: 'SalesEmployeeInd' });
                    _this.rowmetadata.push({ title: 'Sales Employee', name: 'SalesEmployeeInd', type: 'img' });
                }
            });
            this.inputParams.rowmetadata = [];
            this.inputParams.rowmetadata = this.rowmetadata;
            this.inputParams.columns = [];
            this.inputParams.columns = this.columns;
        }
    };
    OccupationSearchComponent.prototype.updateTable = function () {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.inputParams.search = this.search;
        this.occupationSearchTable.loadTableData(this.inputParams);
    };
    OccupationSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        if (this.ellipsis.childConfigParams['parentMode'] === 'LookUp-String') {
            var strOccupations = this.riExchange.getParentHTMLValue('OccupationCodeString');
            if (strOccupations === null || strOccupations === undefined) {
                strOccupations = event.row.OccupationCode;
            }
            else {
                strOccupations = strOccupations + ',' + event.row.OccupationCode;
            }
            this.riExchange.setParentAttributeValue('OccupationCodeString', strOccupations);
            this.ellipsis.sendDataToParent(strOccupations);
        }
        else if (this.ellipsis.childConfigParams['parentMode'] === 'LookUp' || this.ellipsis.childConfigParams['parentMode'] === 'LookUp-Service' || this.ellipsis.childConfigParams['parentMode'] === 'LookUp-Sales') {
            this.riExchange.setParentAttributeValue('OccupationCode', event.row.OccupationCode);
            this.riExchange.setParentAttributeValue('OccupationDesc', event.row.OccupationDesc);
            returnObj = {
                'OccupationCode': event.row.OccupationCode,
                'OccupationDesc': event.row.OccupationDesc
            };
            this.ellipsis.sendDataToParent(returnObj);
        }
        else if (this.ellipsis.childConfigParams['parentMode'] === 'LookUpMultiple') {
            var strOccupations = this.riExchange.getParentHTMLValue('OccupationFilter');
            if (strOccupations === null) {
                strOccupations = event.row.OccupationCode;
            }
            else {
                strOccupations = strOccupations + ',' + event.row.OccupationCode;
            }
            this.riExchange.setParentAttributeValue('OccupationFilter', strOccupations);
            returnObj = {
                'OccupationCode': strOccupations
            };
            this.ellipsis.sendDataToParent(returnObj);
        }
        else {
            this.riExchange.setParentAttributeValue('OccupationCode', event.row.OccupationCode);
            this.ellipsis.sendDataToParent(event.row.OccupationCode);
        }
    };
    OccupationSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    OccupationSearchComponent.prototype.refresh = function () {
        this.updateTable();
    };
    OccupationSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSOccupationSearch.html'
                },] },
    ];
    OccupationSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    OccupationSearchComponent.propDecorators = {
        'occupationSearchTable': [{ type: ViewChild, args: ['occupationSearchTable',] },],
        'messageModal1': [{ type: ViewChild, args: ['messageModal1',] },],
    };
    return OccupationSearchComponent;
}(BaseComponent));
