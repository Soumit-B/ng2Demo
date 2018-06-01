var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
export var PNOLLevelHistoryComponent = (function (_super) {
    __extends(PNOLLevelHistoryComponent, _super);
    function PNOLLevelHistoryComponent(injector, route) {
        var _this = this;
        _super.call(this, injector);
        this.route = route;
        this.pageId = '';
        this.search = new URLSearchParams();
        this.controls = [
            { name: 'BusinessDesc', readonly: false, disabled: true, required: false },
            { name: 'ContractNumber', readonly: false, disabled: true, required: false },
            { name: 'ContractName', readonly: false, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: true, required: false },
            { name: 'PremiseName', readonly: false, disabled: true, required: false }
        ];
        this.queryParams = {
            operation: 'Application/iCABSAPNOLLevelHistory',
            module: 'pnol',
            method: 'extranets-connect/grid'
        };
        this.gridParams = {
            totalRecords: 0,
            maxColumn: 11,
            itemsPerPage: 10,
            currentPage: 1,
            riGridMode: 0,
            riGridHandle: 2164062,
            riSortOrder: 'Descending'
        };
        this.pageId = PageIdentifier.ICABSAPNOLLEVELHISTORY;
        this.route.queryParams.subscribe(function (params) {
            _this.ContractNumber = params['ContractNumber'];
            _this.PremiseNumber = params['PremiseNumber'];
        });
    }
    ;
    PNOLLevelHistoryComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        console.log(this.riExchange.getParentHTMLValue('PremiseNumber'));
        if (this.riExchange.getParentHTMLValue('ContractNumber'))
            this.uiForm.controls['ContractNumber'].setValue(this.riExchange.getParentHTMLValue('ContractNumber'));
        else
            this.uiForm.controls['ContractNumber'].setValue(this.ContractNumber);
        if (this.riExchange.getParentHTMLValue('PremiseNumber'))
            this.uiForm.controls['PremiseNumber'].setValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
        else
            this.uiForm.controls['PremiseNumber'].setValue(this.PremiseNumber);
        this.doLookup();
        this.buildGrid();
    };
    ;
    PNOLLevelHistoryComponent.prototype.doLookup = function () {
        var _this = this;
        var lookupIPSub = [
            {
                'table': 'Business',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessDesc']
            },
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.uiForm.controls['ContractNumber'].value,
                    'PremiseNumber': this.uiForm.controls['PremiseNumber'].value
                },
                'fields': ['PremiseName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIPSub).subscribe(function (data) {
            if (data.length > 0 && data[0].length > 0) {
                var resultBusiness = data[0];
                var resultContract = data[1];
                var resultPremise = data[2];
                _this.uiForm.controls['BusinessDesc'].setValue(resultBusiness[0].BusinessDesc);
                _this.uiForm.controls['ContractName'].setValue(resultContract[0].ContractName);
                _this.uiForm.controls['PremiseName'].setValue(resultPremise[0].PremiseName);
            }
        });
    };
    PNOLLevelHistoryComponent.prototype.refresh = function () {
        this.buildGrid();
    };
    ;
    PNOLLevelHistoryComponent.prototype.getCurrentPage = function (curPage) {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.buildGrid();
    };
    ;
    PNOLLevelHistoryComponent.prototype.buildGrid = function () {
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('Level', 'PestNetOnLineHistory');
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('riGridHandle', this.gridParams.riGridHandle);
        this.search.set('riGridMode', this.gridParams.riGridMode);
        this.search.set('riSortOrder', this.gridParams.riSortOrder);
        this.search.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        this.search.set('PageCurrent', this.gridParams.currentPage);
        this.search.set('HeaderClickedColumn', '');
        this.queryParams.search = this.search;
        this.pnolLeaveHistoryGrid.loadGridData(this.queryParams);
    };
    ;
    PNOLLevelHistoryComponent.prototype.getGridInfo = function (info) {
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
    };
    PNOLLevelHistoryComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPNOLLevelHistory.html'
                },] },
    ];
    PNOLLevelHistoryComponent.ctorParameters = [
        { type: Injector, },
        { type: ActivatedRoute, },
    ];
    PNOLLevelHistoryComponent.propDecorators = {
        'pnolLeaveHistoryGrid': [{ type: ViewChild, args: ['pnolLeaveHistoryGrid',] },],
    };
    return PNOLLevelHistoryComponent;
}(BaseComponent));
