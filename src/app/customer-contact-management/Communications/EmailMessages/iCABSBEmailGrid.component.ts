import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BaseComponent } from './../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { GridComponent } from '../../../../shared/components/grid/grid';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { EmployeeSearchComponent } from '../../../internal/search/iCABSBEmployeeSearch';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { CBBService } from '../../../../shared/services/cbb.service';

@Component({
    templateUrl: 'iCABSBEmailGrid.html'
})

export class EmailGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('emailGrid') emailGrid: GridComponent;
    @ViewChild('emailPagination') emailPagination: PaginationComponent;
    @ViewChild('emailEllipsis') public emailEllipsis: EllipsisComponent;
    @ViewChild('messageModal') public messageModal;
    public pageId: string = '';
    public pageTitle: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public queryParams: any = {
        operation: 'Business/iCABSBEmailGrid',
        module: 'notification',
        method: 'it-functions/maintenance'
    };
    public visiblePagination: Boolean;
    public inputParams: any = {};
    public isFormValid: boolean = false;
    public serviceCoverRowID: string = '';
    public errorMessage: string;
    public uiForm: FormGroup;
    public DateTo: Date = new Date();
    public DateFrom: Date;
    public controls = [
        { name: 'EmployeeCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'DateFrom', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'selectStatus', readonly: false, disabled: false, required: true, value: 'Created' },
        { name: 'selectDestination', readonly: false, disabled: false, required: true, value: 'I' }
    ];
    public showErrorHeader: boolean = true;
    public modalConfig: Object;
    public showHeader = true;
    public itemsPerPage: number = 11;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public gridTotalItems: number;
    public maxColumn: number = 5;
    public dateObjects: any = {};
    public fromDateDisplay;
    public toDateDisplay;

    public validateProperties: Array<any> = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBEMAILGRID;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.visiblePagination = true;
        this.pageTitle = 'Email Notification Message Grid';
        let getToDate = this.globalize.parseDateToFixedFormat(new Date()).toString();
        this.toDateDisplay = this.globalize.parseDateStringToDate(getToDate);
        this.DateTo = this.toDateDisplay;
        let getFromDate = this.globalize.parseDateToFixedFormat(this.utils.removeDays(new Date(), 28)).toString();
        this.fromDateDisplay = this.globalize.parseDateStringToDate(getFromDate);
        this.DateFrom = this.fromDateDisplay;
        this.buildGridInit();
    }

    public buildGridInit(): void {
        this.validateProperties = [
            {
                'type': MntConst.eTypeText,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
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
                'index': 3
            },
            {
                'type': MntConst.eTypeText,
                'index': 4,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 6,
                'align': 'center'
            }
        ];
        this.buildGrid();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public employeeSearchComponent = EmployeeSearchComponent;
    public ellipsisQueryParams: any = {
        inputParamsemployee: {
            parentMode: 'LookUp'
        }
    };

    public onEmployeeDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', data['EmployeeCode']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data['EmployeeSurname']);
        this.setFormMode(this.c_s_MODE_UPDATE);
    }

    public fetchAPIDetails(event: any): void {
        if (!this.getControlValue('EmployeeCode')) {
            this.setControlValue('EmployeeSurname', '');
            this.setFormMode(this.c_s_MODE_SELECT);
        }
        else {
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
            this.search.set('Function', 'GetEmployeeName');
            this.queryParams.search = this.search;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
                .subscribe(
                (e) => {
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);

                    }
                    else {
                        if (e.errorMessage && e.errorMessage !== '') {
                            this.errorService.emitError(e);
                        } else {
                            this.messageService.emitMessage(e);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', e.EmployeeSurname);
                            if (this.getControlValue('EmployeeCode'))
                                this.setFormMode(this.c_s_MODE_UPDATE);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                },
                (error) => {
                    this.errorMessage = error as any;
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
                );
        }
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.fromDateDisplay = value.value;
        }
        else {
            this.fromDateDisplay = '';
        }
    }

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.toDateDisplay = value.value;
        }
        else {
            this.toDateDisplay = '';
        }
    }

    public gridSearch: URLSearchParams = new URLSearchParams();
    public buildGrid(): void {
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.gridSearch.set(this.serviceConstants.Action, '2');
        this.gridSearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.gridSearch.set(this.serviceConstants.CountryCode, this.countryCode());
        this.gridSearch.set('BranchNumber', '3');
        this.gridSearch.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        this.gridSearch.set('Status', this.getControlValue('selectStatus'));
        this.gridSearch.set('DateFrom', this.fromDateDisplay);
        this.gridSearch.set('DateTo', this.toDateDisplay);
        this.gridSearch.set('EmailDestinationType', this.getControlValue('selectDestination'));
        this.gridSearch.set('riGridMode', '0');
        this.gridSearch.set('riGridHandle', '30606786');
        this.gridSearch.set('riCacheRefresh', 'True');
        this.gridSearch.set('PageSize', this.itemsPerPage.toString());
        this.gridSearch.set('PageCurrent', this.currentPage.toString());
        this.gridSearch.set('riSortOrder', 'Descending');
        this.gridSearch.set('HeaderClickedColumn', '');
        this.inputParams.search = this.gridSearch;
        this.emailGrid.loadGridData(this.inputParams);
    }
    public getGridInfo(value: any): void {
        if (value.totalRows !== undefined) {
            if (value.totalRows === 0)
                this.visiblePagination = false;
            else
                this.visiblePagination = true;
            this.emailPagination.totalItems = value.totalRows;
        }
    }
    public getCurrentPage(data: any): void {
        this.currentPage = data.value;
        this.buildGrid();
    }
    public refresh(): void {
        this.currentPage = 1;
        if (this.utils.convertDate(this.fromDateDisplay).getTime() > this.utils.convertDate(this.toDateDisplay).getTime()) {
            this.messageModal.show({ msg: this.fromDateDisplay + '>' + this.toDateDisplay }, false);
        }
        else {
            this.buildGrid();
        }
    }
}
