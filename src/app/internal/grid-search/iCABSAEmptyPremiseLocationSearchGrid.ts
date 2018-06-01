import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from '../../../app/base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { FormControl, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ModalComponent } from './../../../shared/components/modal/modal';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAEmptyPremiseLocationSearchGrid.html'
})

export class EmptyPremiseLocationSearchGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('emptyPremiseLocationSearchGrid') emptyPremiseLocationSearchGrid: GridComponent;
    @ViewChild('emptyPremiseLocationSearchPagination') emptyPremiseLocationSearchPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal: ModalComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public showHeader: boolean = true;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public gridTotalItems: number;
    public maxColumn: number = 3;
    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public inputParams: any = {};
    public contractnumberDetails: any = {};
    public UpdateParent: boolean = false;
    public backLinkText: string = '';
    public totalRecords: number = 1;
    public vEnableServiceCoverDispLev: boolean = false;
    public tdMenuDisplay: boolean = true;
    public queryParams: any = {
        action: '2',
        operation: 'Application/iCABSAEmptyPremiseLocationSearchGrid',
        module: 'locations',
        method: 'service-delivery/search'
    };
    public controls = [
        { name: 'ContractNumber', disabled: true, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', disabled: true,type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeText  }
    ];
    constructor(injector: Injector, location: Location) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAEMPTYPREMISELOCATIONSEARCHGRID;
        this.search = this.getURLSearchParamObject();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Premises Details';
        this.getSysCharDtetails();
        this.window_onload();
        this.buildGrid();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getSysCharDtetails(): any {
        let sysCharNumbers = [this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel];
        let sysCharIp = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.speedScript.sysChar(sysCharIp).subscribe((data) => {
            this.pageParams.vEnableServiceCoverDispLev = data.records[0].Required;
            if (!(this.pageParams.vEnableServiceCoverDispLev)) {
                this.tdMenuDisplay = false;
            }
        });

    }

    public window_onload(): void {
        //Parent values
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        //Disable Fields
        this.disableControl('ContractNumber', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);

        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.PageSize = 10;
        this.riGrid.FunctionPaging = true;
    }

    public buildGrid(): void {
        if (this.riExchange.riInputElement.isError(this.uiForm, 'PremiseNumber') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'ContractNumber')) {
            return;
        }
        else {
            this.riGrid.Clear();
            this.riGrid.AddColumn('PremiseLocationNumber', 'PremiseLocationSummary', 'PremiseLocationNumber', MntConst.eTypeInteger, 10);
            this.riGrid.AddColumnAlign('PremiseLocationNumber', MntConst.eAlignmentCenter);
            this.riGrid.AddColumn('PremiseLocationDesc', 'PremiseLocationSummary', 'PremiseLocationDesc', MntConst.eTypeText, 40);
            this.riGrid.AddColumnAlign('PremiseLocationDesc', MntConst.eAlignmentLeft);
            this.riGrid.AddColumn('QuantityAtLocation', 'PremiseLocationSummary', 'QuantityAtLocation', MntConst.eTypeInteger, 6);
            this.riGrid.Complete();
            this.loadData();
        }
    }

    public loadData(): void {
        this.search = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;

        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '13305230');
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set('GridSortOrder', 'Descending');
        this.search.set('HeaderClickedColumn', '');
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.inputParams.search = this.search;
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.messageModal.show(data, true);
                }
                else {
                    this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.riGrid.Execute(data);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getGridInfo(value: any): void {
        this.emptyPremiseLocationSearchPagination.totalItems = value.totalRows;
    }
    public getCurrentPage(data: any): void {
        this.currentPage = data.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    }

    public optionsChange(event: any): void {
        switch (event) {
            case 'AddLocation':
                this.navigate('PremiseAllocateAdd', InternalMaintenanceApplicationModuleRoutes.ICABSAPREMISELOCATIONMAINTENANCE);
                break;
            default:
                break;
        }
    }

    //on single click of the row

    public onGridRowClick(data: any): void {
        this.emptyLocationFocus(data);
    }
    public emptyLocationFocus(data: any): void {
        this.contractnumberDetails = {
            'row': data.rowIndex,
            'rowID': data.target.attributes['rowid'].value,
            'premiseLocationRowID': this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowid'),
            'quantityAtLocation': this.riGrid.Details.GetValue('QuantityAtLocation')
        };
    }

    //Double click logic

    public getGridOnDblClick(data: any): void {
        this.navigate('EmptySearch', InternalMaintenanceApplicationModuleRoutes.ICABSAPREMISELOCATIONMAINTENANCE, {
            'premiseLocationRowID': this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowid'),
            'PremiseLocationNumber': this.riGrid.Details.GetValue(this.riGrid.CurrentColumnName),
            'PremiseLocationDesc': this.riGrid.Details.GetValue('PremiseLocationDesc'),
            'QuantityAtLocation': this.riGrid.Details.GetValue('QuantityAtLocation')
        });
    }
    // refresh button logic

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.loadData();
    }

    public riExchange_UpdateHTMLDocument(): void {
        this.UpdateParent = true;
        this.buildGrid();
    }
    public riExchange_UnLoadHTMLDocument(): void {
        this.riExchange_UpdateHTMLDocument();
    }

    // Back link
    // public onBackLinkClick(event: any): void {
    //     event.preventDefault();
    //     this.location.back();
    // }
}


