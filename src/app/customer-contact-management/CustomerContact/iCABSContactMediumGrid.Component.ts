import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

@Component({
    templateUrl: 'iCABSContactMediumGrid.html'
})

export class ContactMediumGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('errorModal') public errorModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('contactMediumPagination') contactMediumPagination: PaginationComponent;

    public pageId: string = '';

    public controls = [
        { name: 'DateFrom', required: false, type: MntConst.eTypeDate },
        { name: 'DateTo', required: false, type: MntConst.eTypeDate },
        { name: 'FilterValue', required: true, value: 'thisbranch' },
        { name: 'BranchNumber', required: false },
        { name: 'CustomerContactNumber', required: false }
    ];

    public isRequesting: boolean = false;
    public showErrorHeader: boolean = true;
    public search = new URLSearchParams();
    public itemsPerPage: number = 10;
    public PageCurrent: number = 1;
    public totalRecords: number = 10;
    public DateFrom;
    public DateTo;

    public queryParams: any = {
        operation: 'ContactManagement/iCABSContactMediumGrid',
        module: 'tickets',
        method: 'ccm/maintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCONTACTMEDIUMGRID;
        this.pageTitle = this.browserTitle = 'Customer Contact Medium';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.setControlValue('FilterValue', this.pageParams.FilterValue);
            this.DateFrom = this.pageParams.DateFrom;
            this.DateTo = this.pageParams.DateTo;
        }
        else
            this.window_onload();
    }

    public window_onload(): void {
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        let datefromstring = this.utils.removeDays(new Date(), 14);
        let dateFrom = this.globalize.parseDateToFixedFormat(datefromstring).toString();
        this.DateFrom = this.globalize.parseDateStringToDate(dateFrom);
        let datetostring = new Date();
        let dateTo = this.globalize.parseDateToFixedFormat(datetostring).toString();
        this.DateTo = this.globalize.parseDateStringToDate(dateTo);
        this.setControlValue('DateFrom', this.DateFrom);
        this.setControlValue('DateTo', this.DateTo);
    }


    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;

        this.riGrid.AddColumn('ContactActionNumber', 'ContactActionNumber', 'ContactActionNumber', MntConst.eTypeInteger, 6, true);
        this.riGrid.AddColumn('BranchNumberG', 'BranchNumberG', 'BranchNumberG', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('ContractNumber', 'ContractNumber', 'ContractNumber', MntConst.eTypeText, 8, true);
        this.riGrid.AddColumn('PremiseNumber', 'PremiseNumber', 'PremiseNumber', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumn('ProductCode', 'ProductCode', 'ProductCode', MntConst.eTypeText, 5);
        this.riGrid.AddColumn('ServiceCoverNumber', 'ServiceCoverNumber', 'ServiceCoverNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumn('ContactType', 'ContactType', 'CustomerName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContactTypedesc', 'ContactTypedesc', 'CustomerNamedesc', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContactName', 'ContactName', 'ContactName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContactPosition', 'ContactPosition', 'ContactPosition', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContactTelephone', 'ContactTelephone', 'ContactTelephone', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('Contactmediumdesc', 'Contactmediumdesc', 'Contactmediumdesc', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('CreatedDate', 'CreatedDate', 'CreatedDate', MntConst.eTypeDate, 15);
        this.riGrid.AddColumn('ConvertedDate', 'ConvertedDate', 'ConvertedDate', MntConst.eTypeDate, 15);
        this.riGrid.AddColumn('ConvertedValue', 'ConvertedValue', 'ConvertedValue', MntConst.eTypeCurrency, 15);
        this.riGrid.AddColumn('SalesEmployeeName', 'SalesEmployeeName', 'SalesEmployeeName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ConvertedContractNumber', 'ConvertedContractNumber', 'ConvertedContractNumber', MntConst.eTypeText, 8);
        this.riGrid.AddColumn('ConvertedPremiseNumber', 'ConvertedPremiseNumber', 'ConvertedPremiseNumber', MntConst.eTypeInteger, 5);

        this.riGrid.AddColumnOrderable('ContactActionNumber', true);
        this.riGrid.AddColumnOrderable('BranchNumberG', true);
        this.riGrid.AddColumnOrderable('SalesEmployeeName', true);
        this.riGrid.AddColumnOrderable('Contactmediumdesc', true);
        this.riGrid.AddColumnOrderable('ContactType', true);

        this.riGrid.AddColumnScreen('ContactPosition', false);
        this.riGrid.AddColumnScreen('ContactTelephone', false);
        this.riGrid.AddColumnScreen('ConvertedDate', false);
        this.riGrid.AddColumnScreen('ContactTypedesc', false);
        this.riGrid.AddColumnScreen('ConvertedContractNumber', false);
        this.riGrid.AddColumnScreen('ConvertedPremiseNumber', false);

        this.riGrid.AddColumnAlign('BranchNumberG', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceCoverNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ConvertedValue', MntConst.eAlignmentRight);

        this.riGrid.Complete();

        this.loadGrid();
    }

    public loadGrid(): void {

        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;

        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('BranchNumber', this.getControlValue('BranchNumber'));
        this.search.set('FilterValue', this.getControlValue('FilterValue'));
        this.search.set('DateFrom', this.getControlValue('DateFrom'));
        this.search.set('DateTo', this.getControlValue('DateTo'));
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.PageCurrent.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.queryParams.search = this.search;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search)
            .subscribe(
            (data) => {
                if (data) {
                    try {
                        this.PageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        //this.riGrid.Update = true;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.UpdateFooter = true;
                        if (data && data.errorMessage) {
                            this.errorModal.show(data, true);
                        } else {
                            this.isRequesting = true;
                            this.riGrid.Execute(data);
                        }

                    } catch (e) {
                        this.logger.log('Problem in grid load', e);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            error => {
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_Sort(event: any): void {
        this.loadGrid();
    }

    public getCurrentPage(currentPage: any): void {
        this.PageCurrent = currentPage.value;
        this.loadGrid();
    }

    public refresh(): void {
        this.buildGrid();
        this.loadGrid();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public onGridRowClick(data: any): void {

        this.attributes.CustomerContactNumberRow = this.riGrid.CurrentRow;
        this.attributes.CustomerContactNumberCell = this.riGrid.CurrentCell;
        this.attributes.CustomerContactNumberRowID = this.riGrid.Details.GetAttribute('ContactActionNumber', 'RowID');
        this.attributes.CustomerContactNumberContractRowID = this.riGrid.Details.GetAttribute('ContractNumber', 'RowID');
        this.attributes.CustomerContactNumberContractJob = this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty');
        this.attributes.CustomerContactNumberPremiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'RowID');
        let contractnumber = this.riGrid.Details.GetValue('ContractNumber').substring(1);

        this.pageParams.DateTo = this.getControlValue('DateTo');
        this.pageParams.DateFrom = this.getControlValue('DateFrom');
        this.pageParams.FilterValue = this.getControlValue('FilterValue');

        switch (this.riGrid.CurrentColumnName) {
            case 'ContactActionNumber':
                //this.navigate('CMSearch','iCABSCMCustomerContactMaintenance');
                alert('iCABSCMCustomerContactMaintenance not developed');
                break;
            case 'ContractNumber':
                if (this.attributes.CustomerContactNumberContractJob === 'J') {
                    this.navigate('ContactMedium', '/contractmanagement/maintenance/job',
                        {
                            currentContractTypeURLParameter: 'job',
                            ContractNumber: contractnumber
                        });
                }
                else
                    this.navigate('ContactMedium', '/contractmanagement/maintenance/contract',
                        {
                            ContractNumber: contractnumber
                        });
                break;
            case 'PremiseNumber':
                if (this.attributes.CustomerContactNumberContractJob === 'J') {
                    this.navigate('ContactMedium', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE,
                        {
                            contractTypeCode: 'J',
                            ContractNumber: contractnumber,
                            PremiseNumber: this.riGrid.Details.GetValue('PremiseNumber')
                        });
                }
                else
                    this.navigate('ContactMedium', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE,
                        {
                            ContractNumber: contractnumber,
                            PremiseNumber: this.riGrid.Details.GetValue('PremiseNumber')
                        });
                break;
        }
    }
    public dateTOelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('DateTo', value.value);
        }
        else
            this.setControlValue('DateTo', '');
    }

    public datefromelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('DateFrom', value.value);
        }
        else
            this.setControlValue('DateFrom', '');
    }
}
