import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { TableComponent } from './../../../shared/components/table/table';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ModalModule } from 'ng2-bootstrap';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
@Component({
    templateUrl: 'iCABSBPaymentTermSearch.html'
})

export class PaymentTermSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('paymentTermSearch') paymentTermSearch: TableComponent;
    public pageId: string = '';
    public search = new URLSearchParams();
    public controls = [];

    public columns: Array<any> = [
        { title: 'Code', name: 'PaymentTermCode', className: 'col2' },
        { title: 'Description', name: 'PaymentTermDesc', className: 'col21' },
        { title: 'Default For Business', name: 'DefaultPaymentTermInd', className: 'col1' }
    ];
    public queryParams: any = {
        operation: 'Business/iCABSBPaymentTermSearch',
        module: 'payment',
        method: 'bill-to-cash/search'
    };
    public tableheading: string = 'List Group Search';
    public page: string = '1';
    public itemsPerPage: string = '10';
    public totalItem: number = 10;
    public inputParams: any;
    public rowmetadata: Array<any> = [
        { name: 'DefaultPaymentTermInd', type: 'img' }
    ];
    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBLISTGROUPSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Payment Term Search';

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    public updateView(params: any): void {
        this.inputParams = params;
        this.buildTable();
    };

    public onSelect(data: any): void {
        let returnObj: any;
        switch (this.inputParams.parentMode) {
            case 'Lookup':
            case 'LookUp-Active':
                returnObj = {
                    'PaymentTermNumber': data.row['PaymentTermCode'],
                    'PaymentTermDesc': data.row['PaymentTermDesc']
                };
                break;
            default:
                returnObj = {
                    'PaymentTermNumber': '',
                    'PaymentTermDesc': ''
                };
                break;
        }

        this.ellipsis.sendDataToParent(returnObj);
        //console.log(this.ellipsis);
    }
    public onRefresh(): void {
        this.buildTable();
    }
    public buildTable(): void {
        this.queryParams.rowmetadata = this.rowmetadata;
        this.localeTranslateService.setUpTranslation();
        this.search.set(this.serviceConstants.Action, '0');
        if (this.inputParams.parentMode === 'LookUp-Active') {
            this.search.set('InactiveForNew', 'false');
        }
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.search = this.search;
        this.paymentTermSearch.loadTableData(this.queryParams);
    }

}
