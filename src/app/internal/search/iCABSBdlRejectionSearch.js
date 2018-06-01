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
export var DlRejectionSearchComponent = (function (_super) {
    __extends(DlRejectionSearchComponent, _super);
    function DlRejectionSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.queryParams = {
            operation: 'Business/iCABSBdlRejectionSearch',
            module: 'advantage',
            method: 'prospect-to-contract/search'
        };
        this.pageId = '';
        this.search = new URLSearchParams();
        this.controls = [];
        this.columns = [
            { title: 'Rejection Code', name: 'dlRejectionCode' },
            { title: 'Description', name: 'dlRejectionDesc' }
        ];
        this.pageTitle = 'Data Load Approval Level Search';
        this.pageId = PageIdentifier.ICABSBDLREJECTIONSEARCH;
    }
    DlRejectionSearchComponent.prototype.buildTable = function () {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.queryParams.search = this.search;
        this.rejectionSearch.loadTableData(this.queryParams);
    };
    DlRejectionSearchComponent.prototype.selectedData = function (event) {
        var strCustomerTypes;
        var returnObj;
        returnObj = {
            'dlRejectionCode': event.row.dlRejectionCode,
            'dlRejectionDesc': event.row.dlRejectionDesc
        };
        this.ellipsis.sendDataToParent(returnObj);
    };
    DlRejectionSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
    };
    DlRejectionSearchComponent.prototype.ngAfterViewInit = function () {
        this.buildTable();
    };
    DlRejectionSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBdlRejectionSearch.html'
                },] },
    ];
    DlRejectionSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    DlRejectionSearchComponent.propDecorators = {
        'rejectionSearch': [{ type: ViewChild, args: ['rejectionSearch',] },],
    };
    return DlRejectionSearchComponent;
}(BaseComponent));
