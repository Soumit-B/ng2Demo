import { Component, OnInit, AfterViewInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { PageIdentifier } from '../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSAServiceCoverClosedDateGrid.html'
})

export class ServiceCoverClosedDateGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('serviceCoverClosedDateGridPagination') serviceCoverClosedDateGridPagination: PaginationComponent;
    @ViewChild('yearSelectDropdown') yearSelectDropdown: DropdownStaticComponent;

    private queryParams: any = {
        method: 'service-planning/maintenance',
        module: 'template',
        operation: 'Application/iCABSAServiceCoverClosedDateGrid'
    };
    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public yearData: Array<any> = [];
    public gridParams: any = {
        totalRecords: 0,
        pageCurrent: 1,
        itemsPerPage: 10,
        riGridMode: 0
    };
    public uiDisplay: any = {
        legend: [],
        isButtonsEnable: false
    };
    public controls: Array<any> = [
        { name: 'ContractNumber', disabled: true, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeText },
        { name: 'TotalClosed', disabled: true, type: MntConst.eTypeInteger },
        { name: 'ProductCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'UpdateCalendar' },
        { name: 'SelectedDay' },
        { name: 'SelectedMonth' },
        { name: 'SCRowID' },
        { name: 'CalendarUpdateAllowed' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERCLOSEDDATEGRID;
        this.pageTitle = this.browserTitle = 'Closed Service';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
    }

    public ngAfterViewInit(): void {
        this.buildYearselect();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        this.riGrid.DefaultBorderColor = 'DDDDDD';
        this.riGrid.FunctionPaging = false;
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('SCRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
        this.setControlValue('CalendarUpdateAllowed', 'false');
    }

    // create year dropdown
    private buildYearselect(): void {
        let start = (new Date()).getFullYear() - 5;
        for (let i = 1; i <= 7; i++) {
            let obj = {
                text: (start + i).toString(),
                value: (start + i).toString()
            };
            this.yearData.push(obj);
        }
        this.yearSelectDropdown.selectedItem = ((new Date()).getFullYear()).toString();
        this.buildGrid();
    }

    private buildGrid(): void {
        let iLoop: number = 1;
        this.riGrid.Clear();
        this.riGrid.AddColumn('Month', 'Closed', 'Month', MntConst.eTypeText, 20);
        for (let i = 0; i < 31; i++) {
            this.riGrid.AddColumn((iLoop).toString(), 'Closed', (iLoop).toString(), MntConst.eTypeText, 1);
            this.riGrid.AddColumnAlign((iLoop).toString(), MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('Total', 'Closed', 'Total', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('Total', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.loadGrid();
    }

    private loadGrid(): void {
        //this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;

        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        this.search.set('SCRowID', this.getControlValue('SCRowID'));
        this.search.set('SelectedDay', this.getControlValue('SelectedDay'));
        this.search.set('SelectedMonth', this.getControlValue('SelectedMonth'));
        this.search.set('SelectedYear', this.yearSelectDropdown.selectedItem);
        this.search.set('UpdateCalendar', this.getControlValue('UpdateCalendar'));
        this.search.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
        this.search.set(this.serviceConstants.PageCurrent, this.gridParams.pageCurrent);
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.gridHandle);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
                else {
                    this.gridParams.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    //this.riGrid.Update = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.HidePageNumber = true;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.gridParams.totalRecords = 1;
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    //create legend and total
    public riGrid_AfterExecute(): void {
        let totalvalue, i, currentMonth, iBeforeCurrentMonth, iAfterCurrentMonth, legend, legendLen: number;
        let bgcolor = this.riGrid.HTMLGridBody.children[0].children[0].getAttribute('additionalproperty');
        if (bgcolor) {
            setTimeout(() => {
                this.uiDisplay.legend = [];
                legend = bgcolor.split('bgcolor=');
                legendLen = legend.length;
                for (i = 0; i < legendLen; i++) {
                    let str = legend[i];
                    if (str.indexOf('"#') >= 0) {
                        this.uiDisplay.legend.push({
                            color: str.substr(str.indexOf('"#') + 1, 7),
                            label: str.substr(str.indexOf('<td>') + 4, str.substr(str.indexOf('<td>') + 4).indexOf('&'))
                        });
                    }
                }
            }, 100);
        }
        currentMonth = new Date().getMonth();
        iBeforeCurrentMonth = new Date().getMonth();
        iAfterCurrentMonth = new Date().getMonth() + 1;
        let objList = document.querySelectorAll('.gridtable tbody > tr');
        if (objList && objList.length >= currentMonth) {
            let tr = objList[currentMonth];
            if (tr) {
                tr.setAttribute('class', 'currentMonth');
            }
        }
        totalvalue = this.riGrid.HTMLGridBody.children[1].children[0].getAttribute('additionalproperty').split('|');
        this.setControlValue('TotalClosed', totalvalue[0]);
    }

    public refresh(): void {
        this.gridParams.pageCurrent = 1;
        this.loadGrid();
    }
}
