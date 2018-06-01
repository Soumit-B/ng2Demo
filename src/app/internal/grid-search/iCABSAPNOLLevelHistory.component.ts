import { Component, Injector, ViewChild } from '@angular/core';
import { Event, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridComponent } from './../../../shared/components/grid/grid';

@Component({
    templateUrl: 'iCABSAPNOLLevelHistory.html'
})

export class PNOLLevelHistoryComponent extends BaseComponent {
    @ViewChild('pnolLeaveHistoryGrid') pnolLeaveHistoryGrid: GridComponent;
    public pageId: string = '';
    public search = new URLSearchParams();
    public ContractNumber: any;
    public PremiseNumber: any;
    public controls = [
        { name: 'BusinessDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContractNumber', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode }, //Parent page
        { name: 'ContractName', readonly: false, disabled: true, required: false, type: MntConst.eTypeText }, //Parent page
        { name: 'PremiseNumber', readonly: false, disabled: true, required: false }, //Parent page
        { name: 'PremiseName', readonly: false, disabled: true, required: false } //Parent page
    ];

    public queryParams: any = {
        operation: 'Application/iCABSAPNOLLevelHistory',
        module: 'pnol',
        method: 'extranets-connect/grid'
    };

    public gridParams: any = {
        totalRecords: 0,
        maxColumn: 11,
        itemsPerPage: 10,
        currentPage: 1,
        riGridMode: 0,
        riGridHandle: 2164062,
        riSortOrder: 'Descending'
    };

    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeDate,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeDate,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 4,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeDecimal2,
            'index': 5,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 6,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeDate,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 7,
            'align': 'center'
        }
    ];

    constructor(injector: Injector, private route: ActivatedRoute) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPNOLLEVELHISTORY;
        this.route.queryParams.subscribe(params => {
            this.ContractNumber = params['ContractNumber'];
            this.PremiseNumber = params['PremiseNumber'];
        });
    };

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit(): void {
        super.ngOnInit();
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

    private doLookup(): any {
        let lookupIPSub = [
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
        this.LookUp.lookUpRecord(lookupIPSub).subscribe((data) => {
            if (data.length > 0 && data[0].length > 0) {
                let resultBusiness = data[0];
                let resultContract = data[1];
                let resultPremise = data[2];
                this.uiForm.controls['BusinessDesc'].setValue(resultBusiness[0].BusinessDesc);
                this.uiForm.controls['ContractName'].setValue(resultContract[0].ContractName);
                this.uiForm.controls['PremiseName'].setValue(resultPremise[0].PremiseName);
            }
        });
    }
    public refresh(): void {
        //this.gridParams.currentPage = 1;
        this.buildGrid();
    };

    public getCurrentPage(curPage: any): void {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.buildGrid();
    };

    public buildGrid(): void {
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

    public getGridInfo(info: any): void {
        if (info) {
            this.gridParams.totalRecords = info.totalRows;
        }
    }
}
