var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
export var JobServiceCoverSearchComponent = (function (_super) {
    __extends(JobServiceCoverSearchComponent, _super);
    function JobServiceCoverSearchComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [];
        this.method = 'prospect-to-contract/search';
        this.module = 'natax';
        this.operation = 'ContactManagement/iCABSCMNatAxJobServiceCoverSearch';
        this.inputParams = {};
        this.page = 1;
        this.itemsPerPage = 10;
        this.tableheading = 'National Account Job Service Cover Search';
        this.columns = [
            { title: 'Product Code', name: 'ProductCode' },
            { title: 'Description', name: 'ProductDesc' },
            { title: 'Visit Frequency', name: 'VisitFrequency' }
        ];
        this.pageId = PageIdentifier.ICABSCMNATAXJOBSERVICECOVERSEARCH;
        this.controls = [
            { name: 'ProspectNumber', readonly: true, disabled: true, required: true },
            { name: 'NatAxJobServiceCoverRowID', readonly: true, disabled: false, required: false }
        ];
    }
    JobServiceCoverSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.ProspectNumber = this.riExchange.getParentHTMLValue('ProspectNumber');
        this.formData.ProspectNumber = this.ProspectNumber;
        this.populateUIFromFormData();
        this.buidTable();
    };
    JobServiceCoverSearchComponent.prototype.buidTable = function () {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ProspectNumber', this.ProspectNumber);
        this.inputParams.search = this.search;
        this.jobServiceCoverTable.loadTableData(this.inputParams);
    };
    JobServiceCoverSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    JobServiceCoverSearchComponent.prototype.onSearchClick = function () {
        this.buidTable();
    };
    JobServiceCoverSearchComponent.prototype.selectedData = function (event) {
        var NatAxJobServiceCoverRowID = event.row.ttNatAxJobServiceCover;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NatAxJobServiceCoverRowID', NatAxJobServiceCoverRowID);
        switch (this.parentMode) {
            case 'Prospect':
                this.navigate('Search', '/contractmanagement/iCABSCMNatAxJobServiceCoverMaintenance');
                break;
            case 'LookUp':
                this.riExchange.SetParentHTMLInputElementAttribute('ProductCode', 'NatAxJobServiceCoverRowID');
                this.riExchange.SetParentHTMLInputValue('ProductCode', event.row.ProductCode);
                this.riExchange.SetParentHTMLInputValue('ProductDesc', event.row.ProductDesc);
                break;
        }
    };
    JobServiceCoverSearchComponent.prototype.serviceCoverOnChange = function (event) {
        if (event.target.selectedIndex === 1) {
        }
    };
    JobServiceCoverSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSCMNatAxJobServiceCoverSearch.html'
                },] },
    ];
    JobServiceCoverSearchComponent.ctorParameters = [
        { type: Injector, },
    ];
    JobServiceCoverSearchComponent.propDecorators = {
        'jobServiceCoverTable': [{ type: ViewChild, args: ['jobServiceCoverTable',] },],
    };
    return JobServiceCoverSearchComponent;
}(BaseComponent));
