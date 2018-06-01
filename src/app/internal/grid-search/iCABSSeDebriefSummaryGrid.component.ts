import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';

@Component({
    templateUrl: 'iCABSSeDebriefSummaryGrid.html'
})

export class SeDebriefSummaryGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    private queryParams: any = {
        operation: 'Service/iCABSSeDebriefSummaryGrid',
        module: 'sam',
        method: 'service-delivery/maintenance'
    };

    public setFocusBranchServiceAreaCode = new EventEmitter<boolean>();
    public pageId: string = '';
    public controls = [
        { name: 'SupervisorEmployeeCode', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'SupervisorEmployeeName', type: MntConst.eTypeText },
        { name: 'BranchServiceAreaCode', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'BranchServiceAreaDesc', type: MntConst.eTypeText },
        { name: 'DebriefFromDate', type: MntConst.eTypeDate },
        { name: 'DebriefToDate', type: MntConst.eTypeDate }
    ];
    public gridConfig: any = {
        pageSize: 10,
        currentPage: 1,
        totalRecords: 1
    };
    public ellipsisParams: any = {
        supervisor: {
            showCloseButton: true,
            showHeader: true,
            disabled: false,
            childConfigParams: {
                parentMode: 'LookUp-Supervisor'
            },
            contentComponent: EmployeeSearchComponent
        },
        serviceArea: {
            showCloseButton: true,
            showHeader: true,
            disabled: false,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            contentComponent: BranchServiceAreaSearchComponent
        },
        common: {
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            }
        }
    };

    constructor(injector: Injector, private ref: ChangeDetectorRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEDEBRIEFSUMMARYGRID;

        this.browserTitle = this.pageTitle = 'Debrief - Branch';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.onWindowLoad();
        }
    }

    // Initializes data into different controls on page load
    private onWindowLoad(): void {
        let today: Date = new Date();
        this.buildGrid();

        this.disableControl('BranchServiceAreaDesc', true);
        this.disableControl('SupervisorEmployeeName', true);

        this.setControlValue('DebriefFromDate', new Date(today.getFullYear(), today.getMonth(), 1));
        this.setControlValue('DebriefToDate', today);

        setTimeout(() => {
            this.setFocusBranchServiceAreaCode.emit(true);
        }, 0);

    }

    // Builds the structure of the grid
    private buildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('Supervisor', 'Grid', 'Supervisor', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('Supervisor', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('BranchServiceAreaCode', 'Grid', 'BranchServiceAreaCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('BranchServiceAreaCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('EmployeeDetails', 'Grid', 'EmployeeDetails', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('EmployeeDetails', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('DebriefNumber', 'Grid', 'DebriefNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('DebriefNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('DebriefDate', 'Grid', 'DebriefDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('DebriefDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('DebriefTime', 'Grid', 'DebriefTime', MntConst.eTypeTime, 5);
        this.riGrid.AddColumnAlign('DebriefTime', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('DebriefFromDate', 'Grid', 'DebriefFromDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('DebriefFromDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('DebriefToDate', 'Grid', 'DebriefToDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('DebriefToDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('DebriefTypeDesc', 'Grid', 'DebriefTypeDesc', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('DebriefTypeDesc', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('OutstandingActions', 'Grid', 'OutstandingActions', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('OutstandingActions', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('OverduePlans', 'Grid', 'OverduePlans', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('OverduePlans', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('UserCode', 'Grid', 'UserCode', MntConst.eTypeText, 15);
        this.riGrid.AddColumnAlign('UserCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('Supervisor', true);

        this.riGrid.Complete();
    }

    // Populate data into the grid
    private populateGrid(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set('BranchNumber', this.utils.getBranchCode());
        search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        search.set('SupervisorEmployeeCode', this.getControlValue('SupervisorEmployeeCode'));
        search.set('DebriefFromDate', this.getControlValue('DebriefFromDate'));
        search.set('DebriefToDate', this.getControlValue('DebriefToDate'));

        // set grid building parameters
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.PageSize, this.gridConfig.pageSize.toString());
        search.set(this.serviceConstants.PageCurrent, this.gridConfig.currentPage.toString());
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        search.set(this.serviceConstants.Action, '2');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.riGrid.RefreshRequired();
                    this.gridConfig.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridConfig.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.gridConfig.pageSize : 1;
                    this.riGrid.Execute(data);
                    this.ref.detectChanges();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Updates the pagelevel attributes on grid row activity
    private onGridFocus(rsrcElement: any): void {
        rsrcElement.focus();

        this.setAttribute('BranchServiceAreaCode', this.riGrid.Details.GetValue('BranchServiceAreaCode'));
        this.setAttribute('BranchServiceAreaDesc', this.riGrid.Details.GetAttribute('BranchServiceAreaCode', 'Title'));
        this.setAttribute('EmployeeCode', this.riGrid.Details.GetAttribute('BranchServiceAreaCode', 'AdditionalProperty'));
        this.setAttribute('EmployeeSurname', this.riGrid.Details.GetAttribute('Supervisor', 'AdditionalProperty'));
        this.setAttribute('DebriefNumber', this.riGrid.Details.GetValue('DebriefNumber'));
        this.setAttribute('DebriefFromDate', this.riGrid.Details.GetValue('DebriefFromDate'));
        this.setAttribute('DebriefToDate', this.riGrid.Details.GetValue('DebriefToDate'));
        this.setAttribute('Row', this.riGrid.CurrentRow);
    }

    // Populate SupervisorEmployeeName & BranchServiceAreaDesc
    private populateDescriptions(): void {
        let formData: any = {};
        let search: URLSearchParams = this.getURLSearchParamObject();

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'GetDescriptions';
        formData['BranchNumber'] = this.utils.getBranchCode();
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['SupervisorEmployeeCode'] = this.getControlValue('SupervisorEmployeeCode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('SupervisorEmployeeName', data.SupervisorEmployeeName);
                    this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
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
        this.onRiGridRefresh(null);
    }

    // Refresh the grid data on user click
    public onRiGridRefresh(event: any): void {
        if (this.gridConfig.currentPage <= 0) {
            this.gridConfig.currentPage = 1;
        }
        if (event) {
            this.riGrid.HeaderClickedColumn = '';
        }
        this.populateGrid();
    }

    // Handles grid sort functionality
    public onRiGridSort(event: any): void {
        this.onRiGridRefresh(null);
    }

    // Grid body on double click
    public onTBodyGridDblClick(event: any): void {
        if (event.srcElement.parentElement.parentElement.getAttribute('name') === 'BranchServiceAreaCode') {
            this.onGridFocus(event.srcElement);
            // this.navigate('DebriefSummary', ''); // ToDo: Service/iCABSSeDebriefEmployeeGrid.htm
            this.modalAdvService.emitMessage(new ICabsModalVO('Service/iCABSSeDebriefEmployeeGrid.htm - This screen is not yet developed!'));
        }
    }

    // Grid keydown on "Up Arror", "Down Arrow" & "Tab"
    public onRiGridBodyKeyDown(event: any): void {
        switch (event.keyCode) {
            // Up Arror
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                            this.onGridFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                        }
                    }
                }
                break;
            // Down Arror Or Tab
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                            this.onGridFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                        }
                    }
                }
                break;
        }
    }

    // BranchServiceAreaCode OnChange event
    public onBranchServiceAreaCodeChange(event: any): void {
        this.populateDescriptions();
    }

    // SupervisorEmployeeCode OnChange event
    public onSupervisorEmployeeCodeChange(event: any): void {
        this.populateDescriptions();
    }

    // Populate data from ellipsis
    public onEllipsisDataReceived(type: string, data: any): void {
        switch (type) {
            case 'Supervisor':
                this.setControlValue('SupervisorEmployeeCode', data.SupervisorEmployeeCode || '');
                this.setControlValue('SupervisorEmployeeName', data.SupervisorSurname || '');
                break;
            case 'ServiceArea':
                this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode || '');
                this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc || '');
                break;
            default:
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
