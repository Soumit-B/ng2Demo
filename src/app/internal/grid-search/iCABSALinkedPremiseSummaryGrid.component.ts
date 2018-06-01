import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { URLSearchParams } from '@angular/http';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSALinkedPremiseSummaryGrid.html',
    styles: [`
    :host /deep/ .gridtable tbody tr td:nth-child(5),
    :host /deep/ .gridtable tbody tr td:nth-child(6),
    :host /deep/ .gridtable tbody tr td:nth-child(7),
    :host /deep/ .gridtable tbody tr td:nth-child(8){
        text-align: left;
    }
  `]
})

export class LinkedPremiseSummaryGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('linkedPremiseSummaryGrid') linkedPremiseSummaryGrid: GridComponent;
    @ViewChild('linkedPremiseSummaryGridPagination') linkedPremiseSummaryGridPagination: PaginationComponent;
    @ViewChild('statusSearchTypeDropDown') statusSearchTypeDropDown: DropdownStaticComponent;
    public pageId: string = '';
    public gridSearch: URLSearchParams = new URLSearchParams();
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 9;
    public method: string = 'contract-management/maintenance';
    public module: string = 'service-cover';
    public operation: string = 'Application/iCABSALinkedPremiseSummaryGrid';
    public inputParams: any = {};
    public statusSearchTypeOptions: Array<any> = [{}];
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'StatusSearchType', readonly: false, disabled: false, required: false, type: MntConst.eTypeText }
    ];
    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeText,
            'index': 0
        }, {
            'type': MntConst.eTypeInteger,
            'index': 1
        }, {
            'type': MntConst.eTypeText,
            'index': 2
        }, {
            'type': MntConst.eTypeInteger,
            'index': 3
        }, {
            'type': MntConst.eTypeText,
            'index': 4
        }, {
            'type': MntConst.eTypeText,
            'index': 5
        }, {
            'type': MntConst.eTypeText,
            'index': 6
        }, {
            'type': MntConst.eTypeCode,
            'index': 7
        }, {
            'type': MntConst.eTypeText,
            'index': 8
        }
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSALINKEDPREMISESUMMARYGRID;
        this.pageTitle = 'Linked Premises Summary';
        this.browserTitle = this.pageTitle;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.activatedRoute.queryParams.subscribe(params => {
            let ContractNumber = (this.riExchange.getParentHTMLValue('ContractNumber')) ? this.riExchange.getParentHTMLValue('ContractNumber') : params['ContractNumber'],
                PremiseNumber = (this.riExchange.getParentHTMLValue('PremiseNumber')) ? this.riExchange.getParentHTMLValue('PremiseNumber') : params['PremiseNumber'];
            this.setControlValue('ContractNumber', ContractNumber);
            this.setControlValue('PremiseNumber', PremiseNumber);
            this.createCriteriaDropDown();
            this.fetchName();
            this.buildGrid();
        });

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    public fetchName(): void {
        this.doLookup('Contract', { 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') }, ['ContractName']);
        this.doLookup('Premise', { 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 'BusinessCode': this.utils.getBusinessCode(), 'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') }, ['PremiseName']);
    }
    private doLookup(table: any, query: any, fields: any): any {
        let lookupIP = [{
            'table': table,
            'query': query,
            'fields': fields
        }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let record = data[0];
            switch (table) {
                case 'Contract':
                    if (record.length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', record[0].hasOwnProperty('ContractName') ? record[0]['ContractName'] : false);
                    }
                    break;
                case 'Premise':
                    if (record.length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', record[0].hasOwnProperty('PremiseName') ? record[0]['PremiseName'] : false);
                    }
                    break;
            }
        });
    };
    private createCriteriaDropDown(): void {
        this.statusSearchTypeOptions = [];
        this.statusSearchTypeOptions.push({ value: 'All', text: 'All' });
        this.statusSearchTypeOptions.push({ value: 'L', text: 'Current' });
        this.statusSearchTypeOptions.push({ value: 'FL', text: 'Forward Current' });
        this.statusSearchTypeOptions.push({ value: 'D', text: 'Deleted' });
        this.statusSearchTypeOptions.push({ value: 'FD', text: 'Forward Deleted' });
        this.statusSearchTypeOptions.push({ value: 'PT', text: 'Pending Deletion' });
        this.statusSearchTypeOptions.push({ value: 'T', text: 'Terminated' });
        this.statusSearchTypeOptions.push({ value: 'FT', text: 'Forward Terminated' });
        this.statusSearchTypeOptions.push({ value: 'PT', text: 'Pending Termination' });
        this.statusSearchTypeOptions.push({ value: 'C', text: 'Cancelled' });
        this.statusSearchTypeOptions.splice(0, 1);
        this.statusSearchTypeDropDown.defaultOption = { value: 'All', text: 'All' };
    }
    public refresh(): void {
        this.currentPage = 1;
        this.fetchName();
        this.buildGrid();
    }
    public statusSearchTypeOptionsChange(obj: any): void {
        this.refresh();
    };
    public buildGrid(): void {
        this.gridSearch = this.getURLSearchParamObject();
        let postObj: any = {};
        postObj.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        postObj.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        postObj.PortfolioStatusCode = this.statusSearchTypeDropDown.selectedItem;

        this.gridSearch.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.gridSearch.set(this.serviceConstants.GridPageCurrent, this.currentPage.toString());
        this.gridSearch.set('maxColumn', this.maxColumn.toString());
        this.gridSearch.set(this.serviceConstants.Action, '2');
        this.gridSearch.set(this.serviceConstants.GridMode, '0');
        this.gridSearch.set(this.serviceConstants.GridHandle, this.utils.gridHandle);

        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.inputParams.search = this.gridSearch;
        this.linkedPremiseSummaryGrid.updateGridData(this.inputParams, '', postObj);
    }
    public gridOnDblClick(event: any): void {
        let CurrentContractTypeURLParameter = '';
        // try {
        //     cellInfo = event.columnClicked.text.replace(/[\n\r\s]+/g, '');
        // } catch (e) {
        //     this.logger.warn(e);
        // }
        switch (event.trRowData[4].additionalData) {
            case 'C':
                CurrentContractTypeURLParameter = '';
                break;
            case 'J':
                CurrentContractTypeURLParameter = '<job>';
                break;
            case 'p':
                CurrentContractTypeURLParameter = '<product>';
                break;
        }
        switch (event.cellIndex) {
            case 2:
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                    queryParams: {
                        parentMode: 'Release',
                        ContractNumber: event.trRowData[2].text,
                        CurrentContractTypeURLParameter: CurrentContractTypeURLParameter
                    }
                });
                break;
            case 3:
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE],
                    {
                        queryParams: {
                            'parentMode': 'Release',
                            'PremiseRowID': event.trRowData[3].additionalData,
                            'ContractTypeCode': this.riExchange.getCurrentContractType()
                        }
                    });
                break;
            default:
                break;
        }
    };
    public getGridInfo(info: any): void {
        this.linkedPremiseSummaryGridPagination.totalItems = info.totalRows;
    }
    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.gridSearch.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    }

}
