import { OnInit, Injector, Component, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSAContractInvoiceTurnoverGrid.html'
})

export class ContractInvoiceTurnoverGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    private queryParams: any = {
        operation: 'Application/iCABSAContractInvoiceTurnoverGrid',
        module: 'turnover',
        method: 'bill-to-cash/grid'
    };
    public isHidePagination: boolean = true;
    public pageId: string = '';
    public controls: any[] = [
        { name: 'AccountNumber', disabled: true, type: MntConst.eTypeCode },
        { name: 'AccountName', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractNumber', disabled: true, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText },
        { name: 'InvoiceGroupNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'InvoiceGroupDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'CompanyCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'CompanyDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'InvoiceNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'InvoiceName', disabled: true, type: MntConst.eTypeText },
        { name: 'SystemInvoiceNumber' }
    ];

    public gridParams: Object = {
        totalRecords: 0,
        itemsPerPage: 10,
        currentPage: 1,
        pageCurrent: 1,
        riGridMode: 0
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACONTRACTINVOICETURNOVERGRID;
        this.pageTitle = 'Contract Details';
        this.browserTitle = 'Turnover';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnload(): void {
        switch (this.parentMode) {
            case 'Account':
                this.setControlValue('InvoiceNumber', this.riExchange.getParentAttributeValue('InvoiceNumber'));
                this.setControlValue('InvoiceName', this.riExchange.getParentAttributeValue('InvoiceName'));
                this.setControlValue('CompanyCode', this.riExchange.getParentAttributeValue('CompanyCode'));
                this.setControlValue('CompanyDesc', this.riExchange.getParentAttributeValue('CompanyDesc'));
                break;
            case 'InvoiceGroup':
                this.pageParams.trAccount = true;
                this.pageParams.trInvoiceGroup = true;
                this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber') || this.riExchange.getParentAttributeValue('AccountNumber'));
                this.setControlValue('AccountName', this.riExchange.getParentHTMLValue('AccountName') || this.riExchange.getParentAttributeValue('AccountName'));
                this.setControlValue('InvoiceGroupNumber', this.riExchange.getParentHTMLValue('InvoiceGroupNumber') || this.riExchange.getParentAttributeValue('InvoiceGroupNumber'));
                this.setControlValue('InvoiceGroupDesc', this.riExchange.getParentHTMLValue('InvoiceGroupDesc') || this.riExchange.getParentAttributeValue('InvoiceGroupDesc'));
                this.setControlValue('InvoiceNumber', this.riExchange.getParentHTMLValue('InvoiceNumber') || this.riExchange.getParentAttributeValue('InvoiceNumber'));
                this.setControlValue('InvoiceName', this.riExchange.getParentHTMLValue('InvoiceName') || this.riExchange.getParentAttributeValue('InvoiceName'));
                this.setControlValue('CompanyCode', this.riExchange.getParentHTMLValue('CompanyCode') || this.riExchange.getParentAttributeValue('CompanyCode'));
                this.setControlValue('CompanyDesc', this.riExchange.getParentHTMLValue('CompanyDesc') || this.riExchange.getParentAttributeValue('CompanyDesc'));
                break;
            case 'Contract':
                this.pageParams.trContract = true;
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.setControlValue('InvoiceNumber', this.riExchange.getParentHTMLValue('InvoiceNumber'));
                this.setControlValue('InvoiceName', this.riExchange.getParentHTMLValue('InvoiceName'));
                this.setControlValue('CompanyCode', this.riExchange.getParentHTMLValue('CompanyCode'));
                this.setControlValue('CompanyDesc', this.riExchange.getParentHTMLValue('CompanyDesc'));
                break;
            case 'Premise':
                this.pageParams.trContract = true;
                this.pageParams.trPremise = true;
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.setControlValue('InvoiceNumber', this.riExchange.getParentHTMLValue('InvoiceNumber'));
                this.setControlValue('InvoiceName', this.riExchange.getParentHTMLValue('InvoiceName'));
                this.setControlValue('CompanyCode', this.riExchange.getParentHTMLValue('CompanyCode'));
                this.setControlValue('CompanyDesc', this.riExchange.getParentHTMLValue('CompanyDesc'));
                break;
            case 'Product':
                this.pageParams.trContract = true;
                this.pageParams.trPremise = true;
                this.pageParams.trProduct = true;
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                this.setControlValue('InvoiceNumber', this.riExchange.getParentHTMLValue('InvoiceNumber'));
                this.setControlValue('InvoiceName', this.riExchange.getParentAttributeValue('InvoiceName'));
                this.setControlValue('CompanyCode', this.riExchange.getParentAttributeValue('CompanyCode'));
                this.setControlValue('CompanyDesc', this.riExchange.getParentAttributeValue('CompanyDesc'));
                break;
        }
        this.buildGrid();
    }

    public buildGrid(): void {
        this.riGrid.PageSize = 10;
        this.riGrid.AddColumn('ContractNumber', 'Turnover', 'ContractNumber', MntConst.eTypeText, 8);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNumber', 'Turnover', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ProductCode', 'Turnover', 'ProductCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('TurnoverReleaseYear', 'Turnover', 'TurnoverReleaseYear', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('TurnoverReleaseYear', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('TurnoverReleaseMonth', 'Turnover', 'TurnoverReleaseMonth', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumnAlign('TurnoverReleaseMonth', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('TurnoverValue', 'Turnover', 'TurnoverValue', MntConst.eTypeDecimal2, 15);
        this.riGrid.AddColumn('MonthlyPortions', 'Turnover', 'MonthlyPortions', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('MonthlyPortions', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('Branch', 'Turnover', 'Branch', MntConst.eTypeInteger, 2, false);
        this.riGrid.AddColumnAlign('Branch', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('TurnoverPosted', 'Turnover', 'TurnoverPosted', MntConst.eTypeImage, 1, false);
        this.riGrid.AddColumn('ExpenseCode', 'Turnover', 'ExpenseCode', MntConst.eTypeText, 7);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('TurnoverReleaseYear', true);
        this.riGrid.AddColumnOrderable('Branch', true);
        this.riGrid.AddColumnOrderable('ExpenseCode', true);
        this.riGrid.Complete();
        this.loadData();
    }

    public loadData(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('InvoiceNumber', this.riExchange.getParentHTMLValue('SystemInvoiceNumber'));
        search.set('Mode', 'Turnover');
        search.set(this.serviceConstants.PageSize, this.gridParams['itemsPerPage']);
        search.set(this.serviceConstants.PageCurrent, this.gridParams['pageCurrent']);
        search.set(this.serviceConstants.GridMode, this.gridParams['riGridMode']);
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort)
            sortOrder = 'Ascending';
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.gridParams['pageCurrent'] = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridParams['totalRecords'] = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.Execute(data);
                    if (data.pageData && (data.pageData.lastPageNumber * 10) > 0) {
                        this.isHidePagination = false;
                    } else {
                        this.isHidePagination = true;
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public getCurrentPage(currentPage: any): void {
        this.gridParams['pageCurrent'] = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    }

    public riGridSort(event: any): void {
        this.loadData();
    }

    public refresh(): void {
       this.loadData();
    }

}
