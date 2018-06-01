import { MessageConstant } from './../../../shared/constants/message.constant';
import { MessageCallback } from './../../base/Callback';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { AccountHistoryGridComponent } from './../../internal/grid-search/iCABSAAccountHistoryGrid';
import { URLSearchParams } from '@angular/http';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { BaseComponent } from './../../base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSSePremiseContactChangeGrid.html'
})
export class PremiseContactChangeGridComponent extends BaseComponent implements OnInit, MessageCallback {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('premiseContactChangePagination') premiseContactChangePagination: PaginationComponent;
    public pageId: string = '';
    public controls = [
        { name: 'BranchNumber', readonly: true, disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'EmployeeCode', required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }
    ];
    public childConfigParamsCommissionEmployee: any = {
        // 'parentMode': 'LookUp-ContractBranch-Employee' // Wrong Parent Mode
        'parentMode': 'LookUp'
    };
    //
    public curPage: number = 1;
    public totalRecords: number;
    public pageSize: number = 10;
    //
    public isRequesting: boolean = false;
    public employeeSearchComponent = EmployeeSearchComponent;
    public showCloseButton: boolean = true;
    public branchNumber: any;
    public showMessageHeader: boolean = true;
    public showHeader: boolean = true;
    public inputParams: any = {};
    public queryParams: any = {
        operation: 'Service/iCABSSePremiseContactChangeGrid',
        module: 'contract-admin',
        method: 'contract-management/maintenance'
    };
    public search: URLSearchParams = new URLSearchParams();
    public setFocusOnEmployeeCode = new EventEmitter<boolean>();


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPREMISECONTACTCHANGEGRID;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.PageSize = 10;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.utils.getLoggedInBranch(this.businessCode(), this.countryCode()).subscribe((data) => {
            if (data.results) {
                data.results.forEach(node => {
                    if (node && node.length > 0 && node[0].BusinessCode === this.businessCode()) {
                        this.branchNumber = node[0].BranchNumber;
                        this.fetchBranchData();
                    }
                });
            }
        });
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    }
    //Look up for branch name
    public lookUpRecord(data: any, maxresults: number): any {
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.search.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.search, data);
    }
    //Fetching Current Branch Name
    public fetchBranchData(): any {
        let data = [{
            'table': 'Branch',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'BranchNumber': this.utils.getBranchCode() },
            'fields': ['BranchNumber', 'BranchName']
        }];
        this.lookUpRecord(data, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.uiForm.controls['BranchNumber'].setValue(e['results'][0][0].BranchNumber);
                        this.uiForm.controls['BranchName'].setValue(e['results'][0][0].BranchName);
                        this.setFocusOnEmployeeCode.emit(true);
                        this.buildGrid();
                        this.riGrid_BeforeExecute();
                    }
                }
                this.setFormMode(this.c_s_MODE_UPDATE);
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    public buildGrid(): void {

        this.riGrid.Clear();
        this.riGrid.AddColumn('EmployeeCode', 'Contact', 'EmployeeCode', MntConst.eTypeCode, 6, false);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('EmployeeCode', true);
        this.riGrid.AddColumn('EmployeeName', 'Contact', 'EmployeeName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContactDate', 'Contact', 'ContactDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ContactDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContactDate', true);
        this.riGrid.AddColumn('CustomerName', 'Contact', 'CustomerName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContractNumber', 'Contact', 'ContractNumber', MntConst.eTypeCode, 8);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumn('PremiseNumber', 'Contact', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('OldName', 'Contact', 'OldName', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('NewName', 'Contact', 'NewName', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('Accept', 'Contact', 'Accept', MntConst.eTypeButton, 10);
        this.riGrid.AddColumn('Reject', 'Contact', 'Reject', MntConst.eTypeButton, 10);
        this.riGrid.Complete();
    }

    private riGrid_BeforeExecute(): void {

        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('BranchNumber', this.getControlValue('BranchNumber'));
        gridParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
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
                if (data.hasError) {
                    this.messageModal.show(data, false);
                } else {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.messageModal.show(error, false);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_AfterExecute(event: any): void {
        let rowIndex = 0;
        if (this.riGrid.HTMLGridBody.children[rowIndex]) {
            if (this.riGrid.HTMLGridBody.children[rowIndex].children[8]) {
                this.selectedRowFocus(this.riGrid.HTMLGridBody.children[rowIndex].children[8]);
            }
        }
    }

    public riGrid_BodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.selectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.selectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
        }
    }

    private selectedRowFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement;
        this.attributes.PremiseContactChangeRowID = rsrcElement.getAttribute('rowid');
        this.attributes.Row = oTR.sectionRowIndex;
        rsrcElement.focus();
    }

    public riGrid_BodyOnClick(event: any): void {
        this.selectedRowFocus(event.srcElement);
        if (this.riGrid.CurrentColumnName === 'Accept' || this.riGrid.CurrentColumnName === 'Reject') {
            this.ajaxSource.next(this.ajaxconstant.START);
            let formData: Object = {};
            formData['Function'] = this.riGrid.CurrentColumnName;
            formData['PremiseContactChangeRowID'] = this.attributes.PremiseContactChangeRowID;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, formData).subscribe(
                (e) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (e['status'] === 'failure') {
                        this.errorService.emitError(e['oResponse']);
                    } else {
                        if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                            this.errorService.emitError(e.oResponse['errorMessage']);
                        } else if (e['errorMessage']) {
                            this.messageModal.show({ msg: (e.oResponse['errorMessage']), title: 'Message' }, false);
                        } else {
                            //this.messageModal.show({ msg: this.riGrid.CurrentColumnName, title: 'Message' }, false);
                            // this.buildGrid();
                            this.refresh();
                        }
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.errorService.emitError(error);
                }
            );
        }
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public showErrorModal(msg: any): void {
        this.errorModal.show({ msg: msg, title: 'Error' }, false);
    }

    public showMessageModal(msg: any): void {
        this.messageModal.show({ msg: msg, title: 'Message' }, false);
    }

    public onEmployeeChange(): void {
        let empCode: string = this.getControlValue('EmployeeCode');
        if (empCode) {
            this.ajaxSource.next(this.ajaxconstant.START);
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '6');
            searchParams.set('Function', 'GetEmployeeSurName');
            searchParams.set('EmployeeCode', empCode);

            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams).subscribe(
                (data) => {
                    if (data.ErrorMessageDesc !== '') {
                        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                    else {
                        this.setControlValue('EmployeeCode', '');
                        this.setControlValue('EmployeeSurname', '');
                        this.messageService.emitMessage(MessageConstant.Message.RecordNotFound);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    }
                },
                (error) => {
                    this.setControlValue('EmployeeCode', '');
                    this.setControlValue('EmployeeSurname', '');
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        else {
            this.setControlValue('EmployeeCode', '');
            this.setControlValue('EmployeeSurname', '');
        }
    }

    public onReceivingEmployeeResult(event: any): void {
        this.uiForm.controls['EmployeeCode'].setValue(event.EmployeeCode);
        this.uiForm.controls['EmployeeSurname'].setValue(event.EmployeeSurname);
        // this.buildGrid();
    }
}
