import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSSeCustomerSignatureDetail.html'
})

export class CustomerSignatureDetailComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public pageId: string = '';
    public search = new URLSearchParams();
    public controls = [
        { name: 'BusinessDesc' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeSurname' },
        { name: 'BranchName' },
        { name: 'ViewByDesc' },
        { name: 'DateFrom' },
        { name: 'DateTo' },
        // Hidden field
        { name: 'Level' },
        { name: 'ViewByCode' },
        { name: 'BranchNumber' }
    ];

    // Grid Component Variables
    public gridConfig = {
        pageSize: 10,
        currentPage: 1,
        totalRecords: 1
    };

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Service/iCABSSeCustomerSignatureDetail',
        module: 'service',
        method: 'service-delivery/maintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSECUSTOMERSIGNATUREDETAIL;

        this.browserTitle = this.pageTitle = 'Customer Signature Detail';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    public window_onload(): void {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = this.gridConfig.totalRecords;

        this.disableControls(['Level', 'ViewByCode', 'BranchNumber']);

        this.setControlValue('Level', 'Detail');
        this.pageParams.trBusinessDisplay = false;
        this.pageParams.trBranchDisplay = true;

        this.setControlValue('BusinessDesc', this.utils.getBusinessText());
        this.setControlValue('BranchNumber', this.riExchange.getParentHTMLValue('BranchNumber'));
        this.setControlValue('BranchName', this.utils.getBranchText(this.getControlValue('BranchNumber')));
        this.setControlValue('EmployeeCode', this.riExchange.getParentAttributeValue('EmployeeCode'));
        this.setControlValue('EmployeeSurname', this.riExchange.getParentAttributeValue('EmployeeSurname'));
        this.setControlValue('ViewByCode', this.riExchange.getParentAttributeValue('ViewByCode'));
        this.setControlValue('ViewByDesc', this.riExchange.getParentAttributeValue('ViewByDesc'));
        this.setControlValue('DateFrom', this.riExchange.getParentHTMLValue('DateFrom'));
        this.setControlValue('DateTo', this.riExchange.getParentHTMLValue('DateTo'));

        this.buildGrid();
        this.riGrid_onRefresh();
    }

    // Builds the structure of the grid
    public buildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('EmployeeCode', 'SignatureDetail', 'EmployeeCode', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('EmployeeName', 'SignatureDetail', 'EmployeeName', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('EmployeeName', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('SequenceNumber', 'SignatureDetail', 'SequenceNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('SequenceNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ContractNumber', 'SignatureDetail', 'ContractNumber', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ContractName', 'SignatureDetail', 'ContractName', MntConst.eTypeText, 30);
        this.riGrid.AddColumnAlign('ContractName', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('PremiseNumber', 'SignatureDetail', 'PremiseNumber', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseName', 'SignatureDetail', 'PremiseName', MntConst.eTypeText, 30);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ProductCode', 'SignatureDetail', 'ProductCode', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ProductDesc', 'SignatureDetail', 'ProductDesc', MntConst.eTypeText, 30);
        this.riGrid.AddColumnAlign('ProductDesc', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('VisitTypeCode', 'SignatureDetail', 'VisitTypeCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceDate', 'SignatureDetail', 'ServiceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('NoSignatureReason', 'SignatureDetail', 'NoSignatureReason', MntConst.eTypeText, 30);
        this.riGrid.AddColumnAlign('NoSignatureReason', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('Signature', 'SignatureDetail', 'Signature', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnAlign('Signature', MntConst.eAlignmentLeft);

        this.riGrid.Complete();
    }

    // Refresh the grid data on user click
    public riGrid_onRefresh(): void {
        if (this.gridConfig.currentPage <= 0) {
            this.gridConfig.currentPage = 1;
        }
        this.populateGrid();
    }

    // Populate data into the grid
    public populateGrid(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set('Level', this.getControlValue('Level'));
        this.search.set('BranchNumber', this.getControlValue('BranchNumber'));
        this.search.set('DateFrom', this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom')).toString());
        this.search.set('DateTo', this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo')).toString());
        this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        this.search.set('ViewByCode', this.getControlValue('ViewByCode'));
        this.search.set('ViewByDesc', this.getControlValue('ViewByDesc'));

        // set grid building parameters
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.PageSize, this.gridConfig.pageSize.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.gridConfig.currentPage.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set(this.serviceConstants.GridSortOrder, sortOrder);
        this.search.set(this.serviceConstants.Action, '2');

        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.riGrid.RefreshRequired();
                    this.gridConfig.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridConfig.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.gridConfig.pageSize : 1;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Callback to retrieve the current page on user clicks
    public getCurrentPage(currentPage: any): void {
        this.gridConfig.currentPage = currentPage.value;
        this.riGrid_onRefresh();
    }

    // Grid body on double click
    public riGrid_BodyOnDblClick(event: any): void {
        let CurrentContractTypeURLParameter = this.riGrid.Details.GetAttribute('Signature', 'AdditionalProperty');

        switch (CurrentContractTypeURLParameter) {
            case 'C':
                CurrentContractTypeURLParameter = '';
                break;
            case 'J':
                CurrentContractTypeURLParameter = '<job>';
                break;
            case 'P':
                CurrentContractTypeURLParameter = '<product>';
                break;
        }

        this.setAttribute('PremiseVisitRowID', this.riGrid.Details.GetAttribute('Signature', 'RowID'));

        if (this.riGrid.CurrentColumnName === 'Signature') {
            // TODO will navigate to iCABSSePremiseVisitMaintenance screen
            //this.navigate('Summary', '',{ CurrentContractTypeURLParameter: CurrentContractTypeURLParameter });
            this.modalAdvService.emitMessage(new ICabsModalVO('Service/iCABSSePremiseVisitMaintenance.htm - This screen is not yet developed!'));
        }
    }
}
