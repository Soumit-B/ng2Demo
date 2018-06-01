import { InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';

import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { TableComponent } from './../../../shared/components/table/table';
import { Router } from '@angular/router';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSCMNatAxJobServiceCoverSearch.html'
})

export class JobServiceCoverSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls: any = [];
    private ProspectNumber: string;
    private method: string = 'prospect-to-contract/search';
    private module: string = 'natax';
    private operation: string = 'ContactManagement/iCABSCMNatAxJobServiceCoverSearch';
    private inputParams: any = {};
    private search: URLSearchParams;
    public page: number = 1;
    public itemsPerPage: number = 10;
    public pageTitle: string;
    public tableheading: string = 'National Account Job Service Cover Search';
    public columns: Array<any> = [
        { title: 'Product Code', name: 'ProductCode', type: MntConst.eTypeCode },
        { title: 'Description', name: 'ProductDesc', type: MntConst.eTypeText },
        { title: 'Visit Frequency', name: 'VisitFrequency', type: MntConst.eTypeInteger }
    ];
    @ViewChild('jobServiceCoverTable') jobServiceCoverTable: TableComponent;
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMNATAXJOBSERVICECOVERSEARCH;
        this.controls = [
            { name: 'ProspectNumber', disabled: true, required: true },
            { name: 'NatAxJobServiceCoverRowID', disabled: false, required: false }
        ];
        this.browserTitle = 'National Account Job Service Cover Search';
        this.pageTitle = 'National Account Job Service Cover Details';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.ProspectNumber = this.riExchange.getParentHTMLValue('ProspectNumber');
        this.setControlValue('ProspectNumber', this.ProspectNumber);
        this.populateUIFromFormData();
        this.buidTable();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private buidTable(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ProspectNumber', this.ProspectNumber);
        this.inputParams.search = this.search;
        this.jobServiceCoverTable.loadTableData(this.inputParams);
    }

    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    public onSearchClick(): void {
        this.buidTable();
    }

    public selectedData(event: any): void {
        let NatAxJobServiceCoverRowID = event.row.ttNatAxJobServiceCover;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NatAxJobServiceCoverRowID', NatAxJobServiceCoverRowID);
        switch (this.parentMode) {
            case 'Prospect':
                //this.navigate('Search', InternalMaintenanceServiceModuleRoutes.ICABSCMNATAXJOBSERVICECOVERMAINTENANCE);
                break;
            case 'LookUp':
                //    this._router.navigate(['/contractmanagement/iCABSCMNatAxJobServiceCoverMaintenance'], { queryParams: { parentMode: 'Search' } });
                // this.riExchange.SetParentHTMLInputElementAttribute('ProductCode', 'NatAxJobServiceCoverRowID');
                // this.riExchange.SetParentHTMLInputValue('ProductCode', event.row.ProductCode);
                // this.riExchange.SetParentHTMLInputValue('ProductDesc', event.row.ProductDesc);
                break;
        }
        alert('ContactManagement/iCABSCMNatAxJobServiceCoverMaintenance.htm page not developed.');
    }
    public serviceCoverOnChange(event: any): void {
        if (event.target.selectedIndex === 1) {
            alert('ContactManagement/iCABSCMNatAxJobServiceCoverMaintenance.htm page not developed.');
            //  riExchange.Mode = "SearchAdd"
            //  window.location = "/wsscripts/riHTMLWrapper.p?riFileName=ContactManagement/iCABSCMNatAxJobServiceCoverMaintenance.htm"
        }
    }
}
