import { Component, OnInit, OnDestroy, AfterViewInit, Injector, ViewChild, Input } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { DropdownStaticComponent } from '../../../shared/components/dropdown-static/dropdownstatic';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { BranchServiceAreaSearchComponent } from '../../internal/search/iCABSBBranchServiceAreaSearch';


@Component({
    templateUrl: 'iCABSSeServicePatternGrid.html'
})

export class ServicePatternGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('contractType') contractType: DropdownStaticComponent;
    @ViewChild('viewDropDown') viewDropDown: DropdownStaticComponent;
    @ViewChild('viewTypeDropDown') viewTypeDropDown: DropdownStaticComponent;
    @ViewChild('selectedYear') selectedYear: DropdownStaticComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('servicePatternPagination') servicePatternPagination: PaginationComponent;
    @ViewChild('branchserviceareacodeEllipsis') branchserviceareacodeEllipsis: EllipsisComponent;

    private strShowType: string = '';
    private currentContractType: string;
    private currentContractTypeLabel: string;
    private isEnableInstallsRemovals: boolean = false;
    private iFirstWeek: number = 1;
    private iLastWeek: number = 53;
    private method: string = 'service-planning/maintenance';
    private module: string = 'template';
    private operation: string = 'Service/iCABSSeServicePatternGrid';

    public pageCurrent: string = '1';
    public isVisibleYearCurrentWeek: boolean = false;
    public ellipsis: any = {};
    public curPage: number = 1;
    public totalRecords: number = 0;
    public pageSize: number = 10;
    public maxColumn: number = 8;
    public itemsPerPage: number = 10;
    public pageId: string = '';
    public contractTypeOptions: Array<any> = [];
    public viewDropDownOptions: Array<any> = [];
    public viewTypeDropDownOptions: Array<any> = [];
    public selectedYearDropDownOptions: Array<any> = [{}];
    public controls = [
        { name: 'Branch', disabled: true },
        { name: 'BranchServiceAreaCode', disabled: false },
        { name: 'EmployeeSurname', disabled: true },
        { name: 'ContractTypeCode' },
        { name: 'View' },
        { name: 'ViewType' },
        { name: 'BranchServiceAreaCode' },
        { name: 'EmployeeSurname' },
        { name: 'CurrentWeek', disabled: true },
        { name: 'TotalPremises' },
        { name: 'TotalExchanges' },
        { name: 'TotalHours' },
        { name: 'Year' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPATTERNGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitleDecission();
        this.createOptions();
        this.ellipsis = {
            branchServiceAreaCode: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-Emp',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
                },
                contentComponent: BranchServiceAreaSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private createOptions(): void {
        this.contractTypeOptions = [
            { text: 'All', value: 'All' },
            { text: 'Contracts', value: 'Contract' },
            { text: 'Jobs', value: 'Job' }
        ];
        if (!this.riExchange.URLParameterContains('StaticVisits'))
            this.contractTypeOptions.push({ text: 'Product Sales', value: 'ProductSale' });
        this.viewDropDownOptions = [
            { text: 'Rolling Year', value: 'RollingYear' },
            { text: 'Full Year', value: 'FullYear' }
        ];
        let i: number = 0, newSelectedYearDropDownOptions: any = {};
        for (i = 1; i <= 7; i++) {
            let year: number = (new Date()).getFullYear() - 5 + i;
            newSelectedYearDropDownOptions['value'] = year.toString();
            newSelectedYearDropDownOptions['text'] = year.toString();
            this.selectedYearDropDownOptions.push(JSON.parse(JSON.stringify(newSelectedYearDropDownOptions)));
        }
    };

    private createOptionsViewType(): void {
        this.viewTypeDropDownOptions = [];
        this.setControlValue('ViewType', 'Premise');
        if (this.isEnableInstallsRemovals) {
            this.viewTypeDropDownOptions = [
                { text: 'Number of Units', value: 'Unit' }
            ];
            this.setControlValue('ViewType', 'Unit');
        }
        this.viewTypeDropDownOptions.push({ text: 'Number of Premises', value: 'Premise' });
        this.viewTypeDropDownOptions.push({ text: 'Total Hours', value: 'Time' });
        this.buildGrid();
    };

    ngAfterViewInit(): void {
        this.getSysCharDtetails();
        this.windowOnload();
    }

    private windowOnload(): void {
        this.setControlValue('Year', (new Date()).getFullYear().toString());
        this.getCurrentWeekNumber();
        this.setControlValue('Branch', this.utils.getBranchText());
        if (this.parentMode === 'BranchServiceArea') {
            this.riExchange.getParentHTMLValue('BranchServiceAreaCode');
            this.riExchange.getParentHTMLValue('EmployeeSurname');
            switch (this.riExchange.getParentHTMLValue('ContractTypeCode')) {
                case 'C':
                    this.contractType.selectedItem = 'Contract';
                    this.setControlValue('ContractTypeCode', 'Contract');
                    break;
                case 'J':
                    this.contractType.selectedItem = 'Job';
                    this.setControlValue('ContractTypeCode', 'Job');
                    break;
                case 'P':
                    this.contractType.selectedItem = 'ProductSale';
                    this.setControlValue('ContractTypeCode', 'ProductSale');
                    break;
                default:
                    this.contractType.selectedItem = 'All';
                    this.setControlValue('ContractTypeCode', 'All');
            }
        }
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableInstallsRemovals
        ];
        let sysCharIP: Object = {
            module: this.module,
            operation: this.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            if (data) {
                let record: any = data.records;
                this.isEnableInstallsRemovals = record[0]['Required'];
                this.createOptionsViewType();
            }
        });
    }

    //Change titles depending on what we are looking at
    private pageTitleDecission(): void {
        this.pageTitle = 'Service Pattern Planned Visits';
        if (this.riExchange.URLParameterContains('StaticVisits'))
            this.pageTitle = 'Service Pattern Static Visits';
    }

    private getCurrentWeekNumber(): void {
        let searchParams: any = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.methodtype = 'maintenance';
        postParams.Function = 'GetCurrentWeekNumber';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, searchParams, postParams)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('CurrentWeek', data.CurrentWeek);
                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('VisitFrequency', 'StaticVisit', 'VisitFrequency', MntConst.eTypeInteger, 4);
        let iLoop: number;
        for (iLoop = this.iFirstWeek; iLoop <= this.iLastWeek; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'StaticVisit', iLoop.toString(), MntConst.eTypeInteger, 20);
            this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('Total', 'StaticVisit', 'Total', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('VisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('Total', MntConst.eAlignmentCenter);
        this.riGrid.Complete();

        this.riGridBeforeExecute();
    }

    private riGridBeforeExecute(): void {
        let gridParams: any = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '2');
        let postParams: any = {};
        postParams.methodtype = 'grid';
        postParams.BranchNumber = this.utils.getBranchCode();
        postParams.Level = 'Branch';
        postParams.Year = this.getControlValue('Year');
        postParams.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
        postParams.ViewTypeFilter = this.getControlValue('ViewType');
        postParams.ShowType = 'PlanVisits';
        if (this.riExchange.URLParameterContains('StaticVisits'))
            postParams.ShowType = 'StaticVisits';
        postParams.ContractType = this.getControlValue('ContractTypeCode');
        postParams.YearView = this.getControlValue('View');
        postParams.riGridMode = '0';
        postParams.riGridHandle = this.utils.randomSixDigitString();
        postParams.PageSize = this.pageSize.toString();
        postParams.PageCurrent = this.curPage.toString();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, gridParams, postParams)
            .subscribe(
            (data) => {
                if (data['errorMessage']) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.Execute(data);
                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onChangeBranchServiceAreaCode(): void {
        if (!this.getControlValue('BranchServiceAreaCode')) {
            this.setControlValue('EmployeeSurname', '');
            return;
        }
        let searchParams: any = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.methodtype = 'maintenance';
        postParams.Function = 'GetEmployeeSurname';
        postParams.BranchNumber = this.utils.getBranchCode();
        postParams.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, searchParams, postParams)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onGridSuccess(): void {
        this.setControlValue('TotalPremises', '0');
        this.setControlValue('TotalExchanges', '0');
        this.setControlValue('TotalHours', '00:00');
        if (this.riGrid.HTMLGridBody) {
            let additionalData: any = [];
            additionalData = this.riGrid.HTMLGridBody.children[0].children[0].children[0].getAttribute('additionalproperty').toString().split('|');
            this.setControlValue('TotalPremises', additionalData[0]);
            this.setControlValue('TotalExchanges', additionalData[1]);
            this.setControlValue('TotalHours', additionalData[2]);
        }
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public oncontractTypeChange(data: any): void {
        this.setControlValue('ContractTypeCode', data);
    }

    public onViewChange(data: any): void {
        this.setControlValue('Year', (new Date()).getFullYear().toString());
        this.setControlValue('View', data);
        this.isVisibleYearCurrentWeek = false;
        if (this.getControlValue('View') === 'FullYear') {
            this.isVisibleYearCurrentWeek = true;
            setTimeout(() => {
                this.selectedYear.selectedItem = (new Date()).getFullYear().toString();
            }, 0);
        }
    }

    public onViewTypeChange(data: any): void {
        this.setControlValue('ViewType', data);
    }

    public onSelectedYearChange(data: any): void {
        this.setControlValue('Year', data);
        if (!data)
            this.setControlValue('Year', (new Date()).getFullYear().toString());
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGridBeforeExecute();
    }

    public getGridInfo(info: any): void {
        this.servicePatternPagination.totalItems = info.totalRows;
    }

    public onRecieveBranchServiceAreaCode(data: any): void {
        this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
    }

}
