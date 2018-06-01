import { Component, Injector, ViewChild, OnInit } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAEmployeeGrid.html'
})

export class EmployeeGridComponent extends BaseComponent implements OnInit {
    @ViewChild('employeeGrid') employeeGrid: GridComponent;
    @ViewChild('employeeGridPagination') employeeGridPagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public controls = [
        { name: 'BranchNumber' },
        { name: 'SelEmployeeSurname' },
        { name: 'SelStatus' },
        { name: 'Branch' }
    ];
    public curPage: number = 1;
    public totalRecords: number;
    public pageId: string;
    public search = new URLSearchParams();
    public pageSize: number = 10;
    public isShowBranch: boolean = false;
    public showHeader: boolean = true;
    public modalTitle: string = '';
    public branchSearch: string;
    public status: string = '';
    public employeeArray: any = [];
    public RetEmployeeCodes = '';
    public inputParamsBranchSearch: any = {
        'parentMode': ''
    };
    public negBranchNumberSelected: Object = {
        id: '',
        text: ''
    };
    public queryParams: any = {
        operation: 'Application/iCABSAEmployeeGrid',
        module: 'employee',
        method: 'people/grid'

    };
    private ellipsis: EllipsisComponent;

    constructor(public injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAEMPLOYEEGRID;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }


    public windowOnload(): void {
        this.setControlValue('SelEmployeeSurname', '');
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        // this.riGrid.ExportExcel = false;
        this.riGrid.FunctionPaging = false;
        // this.riGrid.RefreshInterval = 0;
        this.riGrid.HighlightBar = true;
        this.riGrid.PageSize = 10;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.buildGrid();
        this.riGrid_BeforeExecute();
    }

    /*# Get and Set Branch Name #*/
    public lookupBranchName(): any {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.utils.getBranchCode()
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Branch = data[0][0];
            if (Branch) {
                this.negBranchNumberSelected = {
                    id: this.branchSearch,
                    text: this.branchSearch + ' - ' + Branch.BranchName
                };

            }
        });
    }

    public selStatusOnChange(data: string): void {
        this.status = data;
        this.isShowBranch = false;
        this.branchSearch = this.utils.getBranchCode();
        this.lookupBranchName();
        // this.riGrid_BeforeExecute();
        if (data === 'SpecBra') {
            this.isShowBranch = true;
        }
    }

    public onBranchDataReturn(data: any): void {
        this.branchSearch = data.BranchNumber;
        // this.riGrid_BeforeExecute();
    }

    public buildGrid(): void {

        this.riGrid.Clear();
        this.riGrid.AddColumn('EmployeeCode', 'Employee', 'EmployeCode', MntConst.eTypeText, 8, true);
        this.riGrid.AddColumn('EmployeeSurname', 'Employee', 'EmployeeSurname', MntConst.eTypeText, 20, true);
        this.riGrid.AddColumn('OccupationDesc', 'Employee', 'OccupationDesc', MntConst.eTypeText, 20, true);
        this.riGrid.AddColumn('DateLeft', 'Employee', 'DateLeft', MntConst.eTypeText, 20, true);
        this.riGrid.AddColumn('EmployeeSelect', 'Employee', 'EmployeeSelect', MntConst.eTypeCheckBox, 1, true);
        this.riGrid.AddColumnOrderable('EmployeeCode', true);
        this.riGrid.AddColumnOrderable('EmployeeSurname', true);
        this.riGrid.AddColumnOrderable('OccupationDesc', true);
        this.riGrid.AddColumnOrderable('DateLeft', true);
        this.riGrid.AddColumnOrderable('EmployeeSelect', true);
        this.riGrid.Complete();
    }


    private riGrid_BeforeExecute(): void {
        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('Status', this.status ? this.status : 'AllEmp');
        gridParams.set('BranchNumber', this.branchSearch ? this.branchSearch : this.utils.getBranchCode());
        gridParams.set('EmployeeSurname', this.getControlValue('SelEmployeeSurname'));
        gridParams.set('RetEmployeeCodes', this.RetEmployeeCodes ? this.RetEmployeeCodes : '');
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, '1246324');
        // gridParams.set(this.serviceConstants.GridCacheRefresh, 'true');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        // gridParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        // gridParams.set(this.serviceConstants.GridSortOrder, 'Descending');

        //gridQueryParams.set('riSortOrder', 'Descending');
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    return;
                }
                // this.totalRecords = data.pageData.pageNumber;
                this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                this.riGrid.UpdateBody = true;
                this.riGrid.UpdateHeader = true;
                // this.totalRecords = this.riGrid.PageSize * data.pageData.pageNumber;
                this.riGrid.Execute(data);
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        // this.curPage = 1;
        // this.employeeGridPagination.setPage(1);
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_Sort(event: any): void {
        // this.curPage = 1;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_BodyOnDblClick(ev: Event): void {
        if (this.parentMode === 'EmployeeMaintenanceSearch') {
            // Call riExchange.FetchRecord()
        }
    }

    public tbodyEmployeeSearchGrid_onClick(ev: Event): void {
        this.updateEvents(ev);
    }


    private updateEvents(ev: Event): void {
        let selectedEmployeeCode = '';
        switch (this.riGrid.CurrentColumnName) {
            case 'EmployeeSelect':
                let vEmployeeSelect = this.riGrid.Details.GetValue('EmployeeCode');
                if (this.employeeArray.indexOf(vEmployeeSelect) === -1) {
                    this.employeeArray.push(vEmployeeSelect);
                } else {
                    this.employeeArray.splice(this.employeeArray.indexOf(vEmployeeSelect), 1);
                }
                this.RetEmployeeCodes = this.employeeArray.join(';');
                break;
        }
    }

    public selectedEmployeeCode(data: any): void {
        this.riExchange.setParentAttributeValue('LinkedEmployees', this.RetEmployeeCodes);
        if (this.ellipsis) {
            this.ellipsis.sendDataToParent(this.RetEmployeeCodes);
        }
    }

    public employeeSurNameOnChange(data: any): void {
        this.setControlValue('SelEmployeeSurname', data);
        // this.riGrid_BeforeExecute();
    }

    public updateView(data: any): void {
        this.employeeArray = [];
        this.employeeGridPagination.setPage(1);
        this.riGrid.RefreshRequired();
        this.curPage = 1;
        this.riGrid_BeforeExecute();
        this.ellipsis = this.injector.get(EllipsisComponent);
    }

}

