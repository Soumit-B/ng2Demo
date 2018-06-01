import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, ViewChild, Injector } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { BaseComponent } from './../../base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ErrorCallback } from './../../base/Callback';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Utils } from '../../../shared/services/utility';


@Component({
    templateUrl: 'iCABSAServiceCoverCalendarDateGrid.html'
})

export class ServiceCoverCalendarDateComponent extends BaseComponent implements OnInit, ErrorCallback {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('promptModal') public promptModal;

    public canDeactivateObservable: Observable<boolean>;
    public pageId: string = '';
    private queryParams: any;
    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: true, required: true },
        { name: 'ContractName', readonly: true, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: true },
        { name: 'PremiseName', readonly: false, disabled: true, required: false },
        { name: 'ProductCode', readonly: true, disabled: true, required: true },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false },
        { name: 'SelectedYear', readonly: false, disabled: false, required: false },
        { name: 'UpdateCalendar', readonly: false, disabled: false, required: false },
        { name: 'SelectedDay', readonly: false, disabled: false, required: false },
        { name: 'SelectedMonth', readonly: false, disabled: false, required: false },
        { name: 'SCRowID', readonly: false, disabled: false, required: false },
        { name: 'CalendarUpdateAllowed', readonly: false, disabled: false, required: false },
        { name: 'TotalVisits', readonly: true, disabled: true, required: false }
    ];
    // Legend
    public legend = [
        { label: 'Empty', color: '#DDDDDD' },
        { label: 'Weekend', color: '#AAAAAA' },
        { label: 'Due', color: '#CCFFCC' },
        { label: 'Weekend Due', color: '#6D926D' }
    ];

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public headerParams: any = {
        operation: 'Application/iCABSAServiceCoverCalendarDateGrid',
        module: 'contract-admin',
        method: 'contract-management/maintenance'
    };

    public pageCurrent: string = '1';
    public totalRecords: number = 0;
    public hasMoreEntered: boolean = false;
    private initialRecords: number = -1;
    public promptTitle: string = '';
    public promptContent: string = MessageConstant.Message.RouteAway;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public errorMessages: any = {
        earlierYear: 'Calendar updates cannot be earlier than the current year'
    };
    public promptModalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    constructor(injector: Injector) {
        super(injector);
        this.browserTitle = 'Service Cover Calendar';
        this.pageId = PageIdentifier.ICABSASERVICECOVERCALENDARDATEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (!this.isReturning()) {
            this.window_onload();
        }
    }

    public BuildYearOptions(): void {
        let today = new Date();
        let yyyy = today.getFullYear();
        this.pageParams.yearList = [];
        for (let i = 1; i < 8; i++) {
            this.pageParams.yearList.push({ 'text': (yyyy - 5 + i), 'value': (yyyy - 5 + i) });
        }
        this.setControlValue('SelectedYear', yyyy);
    }

    public window_onload(): void {
        this.pageTitle = 'Service Cover Calendar';
        this.setErrorCallback(this);
        this.pageParams.blnChangesMade = false;
        this.riGrid.FixedWidth = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.HidePageNumber = true;
        this.BuildYearOptions();
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('ProductCode');
        this.riExchange.getParentHTMLValue('ProductDesc');
        this.riExchange.getParentHTMLValue('ServiceVisitFrequency');
        this.riExchange.getParentHTMLValue('CalendarUpdateAllowed');
        if (this.getControlValue('CalendarUpdateAllowed') === 'True') {
            this.pageParams['isUpdatable'] = true;
        }
        this.setControlValue('SCRowID', this.riExchange.getParentHTMLValue('ServiceCover'));
        this.BuildGrid();
    }

    public BuildGrid(): void {
        let iLoop: number = 1;
        this.riGrid.Clear();
        this.riGrid.AddColumn('Month', 'Visit', 'Month', MntConst.eTypeText, 20);
        for (iLoop = 1; iLoop < 32; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'Visit', iLoop.toString(), MntConst.eTypeText, 4);
            this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('Total', 'Visit', 'Total', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('Total', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.loadGridData();
    }

    private loadGridData(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();

        this.ajaxSource.next(this.ajaxconstant.START);

        search.set(this.serviceConstants.Action, '2');
        search.set('SelectedDay', this.getControlValue('SelectedDay'));
        search.set('SelectedMonth', this.getControlValue('SelectedMonth'));
        search.set('SelectedYear', this.getControlValue('SelectedYear'));
        search.set('UpdateCalendar', this.getControlValue('UpdateCalendar'));
        search.set('SCRowID', this.getControlValue('SCRowID'));
        search.set(this.serviceConstants.PageSize, '10');
        search.set(this.serviceConstants.PageCurrent, this.pageCurrent);
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.GridCacheRefresh, 'True');
        search.set(this.serviceConstants.GridCacheRefresh, 'True');
        search.set(this.serviceConstants.GridHeaderClickedColumn, '');
        search.set(this.serviceConstants.GridSortOrder, '');
        search.set(this.serviceConstants.GridSortOrder, 'Descending');

        this.httpService.makeGetRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            search).subscribe(data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.displayError(data.errorMessage);
                    return;
                }
                this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                this.riGrid.Execute(data);
                this.setControlValue('UpdateCalendar', '');
                this.hasMoreEntered = false;
            }, error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.displayError(MessageConstant.Message.GeneralError, error);
            });
    }

    public showErrorModal(msg: any): void {
        this.errorModal.show({ msg: msg, title: 'Error' }, false);
    }

    public onGridSuccess(): void {
        let currentMonth: number = (new Date()).getMonth() + 1;
        let additionalProperty: Array<string> = this.riGrid.HTMLGridBody.children[1].children[0].children[0].children[0].getAttribute('additionalProperty').split('|');

        document.querySelector('.gridtable tbody > tr:nth-child(' + currentMonth.toString() + ')').setAttribute('class', 'currentMonth');

        this.setControlValue('TotalVisits', additionalProperty[0]);
    }

    public onGridDoubleClick(data: any): void {
        let selectedDay: string = this.riGrid.CurrentColumnName;
        let selectedMonth: string = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'AdditionalProperty');

        let isClickable: boolean = selectedDay !== 'Total' && selectedDay !== 'Month';

        if (!isClickable || !this.pageParams['isUpdatable']) {
            return;
        }

        if (selectedMonth === '0') {
            this.displayError(this.errorMessages.earlierYear);
            return;
        }

        this.setControlValue('SelectedDay', selectedDay);
        this.setControlValue('SelectedMonth', selectedMonth);
        this.setControlValue('UpdateCalendar', 'True');
        this.pageParams.blnChangesMade = true;

        this.refresh();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.loadGridData();
    }

    public onSave(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};

        if (this.getControlValue('ServiceVisitFrequency') === this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalVisits')) {
            search.set(this.serviceConstants.Action, '6');

            formData['SelectedYear'] = this.getControlValue('SelectedYear');
            formData['Function'] = 'Save';
            formData['SCRowID'] = this.getControlValue('SCRowID');

            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.httpService.makePostRequest(
                this.headerParams.method,
                this.headerParams.module,
                this.headerParams.operation,
                search,
                formData).subscribe(data => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.errorMessage) {
                        this.displayError(data.errorMessage);
                        return;
                    }
                    this.location.back();
                }, error => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.displayError(MessageConstant.Message.GeneralError, error);
                });
        } else {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'TotalVisits', true);
            this.hasMoreEntered = true;
        }
    }

    public onCancel(routeAway?: boolean, observer?: any): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        let formData: any = {};

        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'Abandon';
        formData['SCRowID'] = this.getControlValue('SCRowID');
        this.setControlValue('TotalVisits', this.getControlValue('ServiceVisitFrequency'));

        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.httpService.makePostRequest(
            this.headerParams.method,
            this.headerParams.module,
            this.headerParams.operation,
            search,
            formData).subscribe(data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                if (data.errorMessage) {
                    this.displayError(data.errorMessage);
                    return;
                }
                if (!routeAway) {
                    this.location.back();
                } else {
                    observer.next(true);
                }
            }, error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                observer.next(false);
                this.displayError(MessageConstant.Message.GeneralError, error);
            });
    }

    public canDeactivate(): Observable<boolean> {
        let isUpdated: boolean = this.getControlValue('ServiceVisitFrequency') === this.getControlValue('TotalVisits');
        this.routeAwayGlobals.setSaveEnabledFlag(!isUpdated);
        this.canDeactivateObservable = new Observable((observer) => {
            this.promptModal.saveEmit.subscribe((event) => {
                this.onCancel(true, observer);
            });
            this.promptModal.cancelEmit.subscribe((event) => {
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                observer.next(false);
                setTimeout(() => {
                    this.router.navigate([], { skipLocationChange: true, preserveQueryParams: true });
                }, 0);
            });
            if (!isUpdated) {
                this.promptModal.show();
                return;
            }
            observer.next(true);
        });
        return this.canDeactivateObservable;
    }
}
