import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { InternalMaintenanceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { TableComponent } from './../../../shared/components/table/table';

@Component({
    templateUrl: 'iCABSBApiRateSearch.html'
})
export class ApiRateSearchComponent extends BaseComponent implements OnInit {
    @ViewChild('apiRateSearchTable') apiRateSearchTable: TableComponent;
    public queryParams: any = {
        operation: 'Business/iCABSBAPIRateSearch',
        module: 'api',
        method: 'contract-management/search'
    };
    public pageId: string = '';
    public search = this.getURLSearchParamObject();
    public controls = [
        { name: 'APICode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode }, //Parent page
        { name: 'APICodeDesc', readonly: true, disabled: true, required: false }, //Parent page
        { name: 'APIRateEffectDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate }, //Child page
        { name: 'APIRate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDecimal2 }, //Child page
        { name: 'ttAPIRate', readonly: false, disabled: false, required: false }, //Child page
        { name: 'BusinessCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode } //Child page
    ];
    public effectDate: string = 'Effective Date';
    public apIRate: string = 'API Rate';
    public columns: Array<any> = [];
    public tableheader: string = 'API Rate Search';
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBAPIRATESEARCH;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICode', this.riExchange.getParentHTMLValue('APICode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICodeDesc', this.riExchange.getParentHTMLValue('APICodeDesc'));
        this.buildTableColumns();
        this.buildTable();
    }
    public buildTableColumns(): void {
        this.columns = [];
        this.getTranslatedValue(this.effectDate, null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'APIRateEffectDate', type: MntConst.eTypeDate });
            } else {
                this.columns.push({ title: this.effectDate, name: 'APIRateEffectDate', type: MntConst.eTypeDate });
            }
        });
        this.getTranslatedValue(this.apIRate, null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'APIRate', type: MntConst.eTypeDecimal2 });
            } else {
                this.columns.push({ title: this.apIRate, name: 'APIRate', type: MntConst.eTypeDecimal2 });

            }
        });
    }
    private buildTable(): void {
        this.search.set(this.serviceConstants.Action, '0');
        //set parameters
        this.search.set('APICode', this.riExchange.getParentHTMLValue('APICode'));
        this.search.set('search.sortby', 'APIRateEffectDate DESC');
        this.queryParams.search = this.search;
        this.apiRateSearchTable.loadTableData(this.queryParams);
    }
    public onSelect(event: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APIRateEffectDate', event.row.APIRateEffectDate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APIRate', event.row.APIRate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ttAPIRate', event.row.ttAPIRate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', event.row.BusinessCode);
        this.navigate('RowSelected', InternalMaintenanceServiceModuleRoutes.ICABSBAPIRATEMAINTENANCE);

    }
    public onButtonClick(): void {
        this.navigate('SearchAdd', InternalMaintenanceServiceModuleRoutes.ICABSBAPIRATEMAINTENANCE);
    }
    public tableDataLoaded(data: any): void {
        let tableRecords: Array<any> = data.tableData['records'];
        if (tableRecords.length === 0) {
            this.tableheader = 'No record found';
        }
    }
    public refresh(): void {
        this.buildTable();
    }
}
