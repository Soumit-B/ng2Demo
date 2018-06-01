import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { TableComponent } from './../../../shared/components/table/table';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSBCalendarTemplateSearch.html'
})

export class CalendarTemplateSearchComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('CalendarTemplateSearchTable') CalendarTemplateSearchTable: TableComponent;
    @ViewChild('messageModal') public messageModal;

    public queryParams: any = {
        operation: 'Business/iCABSBCalendarTemplateSearch',
        module: 'template',
        method: 'service-planning/search'
    };

    public controls = [
        { name: 'FrequencySearchValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'ChkToleranceViewOnly', readonly: false, disabled: false, required: false },
        { name: 'VisitFrequency', readonly: false, disabled: false, required: false },
        { name: 'ServiceVisitFrequency', readonly: false, disabled: false, required: false },
        { name: 'BranchNumber', readonly: false, disabled: false, required: false }
    ];

    //local variables
    public pageId: string = '';
    public tdAddRecord: boolean = true;
    public regex = new RegExp('^[0-9]*$');

    //table component variables
    public search = new URLSearchParams();
    public columns: Array<any>;
    public itemsPerPage: string = '10';
    public page: string = '1';
    public totalItem: string = '11';
    public pageSize: string = '10';
    public inputParams: any = {};
    public rowmetadata: Array<any> = new Array();

    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBCALENDARTEMPLATESEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Calendar Template Search';
        this.inputParams.parentMode = this.riExchange.getParentMode();
        this.setControlValue('ChkToleranceViewOnly', false);
        this.buildTableColumns();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public buildTableColumns(): void {

        this.columns = [];
        this.inputParams.columns = this.columns;
        this.inputParams.rowmetadata = [];
        this.inputParams.rowmetadata = this.rowmetadata;

        this.getTranslatedValue('Template Number', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'AnnualCalendarTemplateNumber', type: MntConst.eTypeInteger });
            } else {
                this.columns.push({ title: 'Template Number', name: 'AnnualCalendarTemplateNumber', type: MntConst.eTypeInteger });
            }
        });

        this.getTranslatedValue('Template Name', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'TemplateName', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Template Name', name: 'TemplateName', type: MntConst.eTypeText });
            }
        });

        this.getTranslatedValue('Tolerance Type ', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'ToleranceType', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Tolerance Type', name: 'ToleranceType', type: MntConst.eTypeText });
            }
        });


        this.getTranslatedValue('Visit Tolerances', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'Tolerance', type: MntConst.eTypeInteger });
            } else {
                this.columns.push({ title: 'Visit Tolerances', name: 'Tolerance', type: MntConst.eTypeInteger });
            }
        });

        this.getTranslatedValue('Visit Frequency', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'VisitFrequency', type: MntConst.eTypeInteger });
            } else {
                this.columns.push({ title: 'Visit Frequency', name: 'VisitFrequency', type: MntConst.eTypeInteger });
            }
        });

        this.buildTable();

    }

    public buildTable(): void {

        let ServiceVisitFrequency = this.riExchange.getParentHTMLValue('ServiceVisitFrequency') ? this.riExchange.getParentHTMLValue('ServiceVisitFrequency') : '';

        this.CalendarTemplateSearchTable.clearTable();
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        if (this.regex.test(this.getControlValue('FrequencySearchValue'))) {
            this.search.set('VisitFrequency', this.getControlValue('FrequencySearchValue'));
        } else if (this.inputParams.parentMode === 'LookUp-AnnualCalendar' && ServiceVisitFrequency !== '') {
            this.search.set('VisitFrequency', ServiceVisitFrequency);
        } else {
            this.search.set('VisitFrequency', '');
        }

        if (this.inputParams.parentMode === 'LookUp-AllAccessCalendar' || this.inputParams.parentMode === 'LookUp-AnnualCalendar' || this.inputParams.parentMode === 'LookUp-AllAccess') {
            this.search.set('AllAccessCalendar', 'True');
        } else {
            this.search.set('AllAccessCalendar', 'False');
        }

        this.search.set('BranchNumber', this.utils.getBranchCode());

        this.queryParams.search = this.search;
        this.CalendarTemplateSearchTable.loadTableData(this.queryParams);

    }

    public tableRowClick(event: any): void {

        let annualCalendarTemplateNumber = event.row.AnnualCalendarTemplateNumber;
        let templateName = event.row.TemplateName;

        let returnObj = {
            'AnnualCalendarTemplateNumber': annualCalendarTemplateNumber,
            'TemplateName': templateName,
            'row': event.row
        };

        switch (this.inputParams.parentMode) {
            case 'LookUp-AllAccess':
                this.riExchange.setParentHTMLValue('TemplateNumber', returnObj.AnnualCalendarTemplateNumber);
                this.riExchange.setParentHTMLValue('TemplateName', returnObj.TemplateName);
                break;
            case 'LookUp-AllAccessCalendar':
                this.riExchange.setParentHTMLValue('AnnualCalendarTemplateNumber', returnObj.AnnualCalendarTemplateNumber);
                this.riExchange.setParentHTMLValue('TemplateName', returnObj.TemplateName);
                break;
            default:
                this.riExchange.setParentHTMLValue('AnnualCalendarTemplateNumber', returnObj.AnnualCalendarTemplateNumber);
                this.riExchange.setParentHTMLValue('TemplateName', returnObj.TemplateName);
                break;
        }

        this.ellipsis.sendDataToParent(returnObj);
    }

    public onClickSearch(): void {
        if (this.regex.test(this.getControlValue('FrequencySearchValue'))) {
            this.buildTableColumns();
        }
    }

    public onAddNew(event: any): void {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    }

    public getCurrentPage(currentPage: any): void {
        this.page = currentPage;
    }

    public updateView(params: any): void {

        this.inputParams = params;
        this.tdAddRecord = params.showAddNew ? true : false;
        this.pageParams.parentMode = params.parentMode;
        params.ChkToleranceViewOnly = params.ChkToleranceViewOnly ? params.ChkToleranceViewOnly : '';
        params.ServiceVisitFrequency = params.ServiceVisitFrequency ? params.ServiceVisitFrequency : '';

        if (params.ChkToleranceViewOnly !== '') {
            this.setControlValue('ChkToleranceViewOnly', params.ChkToleranceViewOnly);
        } else {
            this.setControlValue('ChkToleranceViewOnly', '');
        }

        if (params.parentMode === 'LookUp-AnnualCalendar' && params.ServiceVisitFrequency !== '') {
            this.setControlValue('FrequencySearchValue', params.ServiceVisitFrequency);
            this.pageParams.tblFreqSearch = false;
        } else {
            this.setControlValue('FrequencySearchValue', '');
            this.pageParams.tblFreqSearch = true;
        }

        this.buildTableColumns();
    }
}
