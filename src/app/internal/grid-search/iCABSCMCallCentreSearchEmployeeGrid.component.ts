import { Component, ViewChild, Injector, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalMaintenanceModuleRoutes, ProspectToContractModuleRoutes, AppModuleRoutes } from './../../base/PageRoutes';
import { Utils } from './../../../shared/services/utility';
import { LookUp } from './../../../shared/services/lookup';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { BankDetailsComponent } from './../../contract-management/AccountAndGroupAccountManagement/tabs/BankDetails.component';
import { EmployeeSearchComponent } from './../search/iCABSBEmployeeSearch';
import { InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSCMCallCentreSearchEmployeeGrid.html'
})
export class CallCentreSearchEmployeeGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;

    public pageId: string;

    //Form variables
    public controls: any[] = [
        { name: 'SearchBy', value: 'Name' },
        { name: 'EmployeeCode' },
        { name: 'EmployeeForename1' },
        { name: 'OccupationCodeSelect' },
        { name: 'EmployeeSurname' },
        { name: 'AddressLine4' },
        { name: 'BranchNumberSelect' },
        { name: 'AddressLine5' },
        { name: 'PostCode' },
        { name: 'SelectedName', disabled: true },
        { name: 'SupervisorSelect' },
        { name: 'RedirectedName', disabled: true },
        { name: 'SupervisorName' },
        { name: 'EmployeeMobile', disabled: true },
        { name: 'SupervisorMobile', disabled: true },
        { name: 'EmployeeTelephone', disabled: true },
        { name: 'SupervisorTelephone', disabled: true },
        { name: 'EmployeeSecondary', disabled: true },
        { name: 'SupervisorSecondary', disabled: true },
        { name: 'EmployeeEmail', disabled: true },
        { name: 'SupervisorEmail', disabled: true },
        { name: 'EmployeeBranch', disabled: true },
        { name: 'SupervisorBranch', disabled: true },
        //hidden fields
        { name: 'SelectedEmployeeCode' },
        { name: 'RedirectedEmployeeCode' },
        { name: 'SupervisorCode' },
        { name: 'PassEmployeeCode' },
        { name: 'SupervisorBranchNo' },
        { name: 'EmployeeBranchNo' },
        { name: 'PassBranchNumber' }
    ];
    public inputParamsBranchSearch: any = {};

    //Grid Component variables
    public pageSize: number = 10;
    public curPage: number = 1;
    public totalRecords: number = 10;
    public maxColumn: number = 8;
    public isHidePagination: boolean = true;

    //API variables
    public queryParams = {
        method: 'ccm/maintenance',
        module: 'call-centre',
        operation: 'ContactManagement/iCABSCMCallCentreSearchEmployeeGrid'
    };

    //Ellipsis variables
    public ellipsConf: any = {
        employee: {
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUpSendForename1'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true
        }
    };

    //LookUp varuables
    public ttBranch = [];
    public ttOccupation = [];
    public gcEmployeeCode: string;
    public gcEmployeeName: string;

    //Hide blocks
    public hideBlock: any = {
        isSearchByEmployee: false,
        isSearchByPostCode: true,
        isSearchResult: true,
        isSupervisorFor: true,
        isRedirectedTo: true
    };

    //Page Business logis
    public selectedEmp: any = {};


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLCENTRESEARCHEMPLOYEEGRID;
        this.browserTitle = this.pageTitle = 'Contact Centre - Employee Search Grid';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.doLookup();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.showHideFormElements(this.pageParams.SearchBy);
        }
        this.windowOnload();
    }

    ngAfterViewInit(): void {
        this.initPage();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public initPage(): void {
        this.setControlValue('OccupationCodeSelect', ' ');
        this.setControlValue('BranchNumberSelect', this.utils.getBranchCode());
    }

    public windowOnload(): void {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.PageSize = 10;

        //this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.buildGrid();
    }

    //Start: Grid functionality
    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('EmployeeCode', 'CCM', 'EmployeeCode', MntConst.eTypeText, 6, true);
        this.riGrid.AddColumn('EmployeeName', 'CCM', 'EmployeeName', MntConst.eTypeText, 40, true);
        this.riGrid.AddColumn('RedirectEmployeeCode', 'CCM', 'RedirectEmployeeCode', MntConst.eTypeText, 6, true);
        this.riGrid.AddColumn('EmployeeOccupation', 'CCM', 'EmployeeOccupation', MntConst.eTypeText, 40, true);
        this.riGrid.AddColumn('EmployeeBranch', 'CCM', 'EmployeeBranch', MntConst.eTypeText, 40, true);
        this.riGrid.AddColumn('EmployeeMobile', 'CCM', 'EmployeeMobile', MntConst.eTypeText, 20, true);
        this.riGrid.AddColumn('EmployeePhone', 'CCM', 'EmployeePhone', MntConst.eTypeText, 20, true);
        this.riGrid.AddColumn('EmployeeEmail', 'CCM', 'EmployeeEmail', MntConst.eTypeText, 20, true);

        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('RedirectEmployeeCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('EmployeeCode', true);
        this.riGrid.AddColumnOrderable('EmployeeName', true);
        this.riGrid.AddColumnOrderable('EmployeeOccupation', true);
        this.riGrid.AddColumnOrderable('EmployeeBranch', true);

        this.riGrid.Complete();
    }

    public riGridBeforeExecute(): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), sortOrder: any = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        search.set(this.serviceConstants.GridPageCurrent, this.curPage.toString());
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('riCacheRefresh', 'True');

        // set parameters
        search.set('Level', 'Business');
        search.set('SearchBy', this.getControlValue('SearchBy'));
        search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        search.set('EmployeeForename', this.getControlValue('EmployeeForename1'));
        search.set('EmployeeSurname', this.getControlValue('EmployeeSurname'));
        search.set('OccupationCode', this.getControlValue('OccupationCodeSelect'));
        search.set('BranchNumber', this.getControlValue('BranchNumberSelect'));
        search.set('AddressLine4', this.getControlValue('AddressLine4'));
        search.set('AddressLine5', this.getControlValue('AddressLine5'));
        search.set('PostCode', this.getControlValue('PostCode'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.Execute(data);

                    if (data.pageData && (data.pageData.lastPageNumber * this.pageSize) > 0) {
                        this.hideBlock.isSearchResult = false;
                        this.isHidePagination = false;
                    } else {
                        this.isHidePagination = true;
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    public riGridAfterExecute(): void {
        if (!this.riGrid.Update) {
            if (this.riGrid.HTMLGridBody.children[0]) {
                if (this.riGrid.HTMLGridBody.children[0].children[0]) {
                    this.riGrid.SetDefaultFocus();
                    this.selectedRowFocus(this.riGrid.HTMLGridBody.children[0].children[0].children[0]);
                }
            }
        }
    }

    public getCurrentPage(data: any): void {
        this.curPage = data.value;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public refresh(): void {
        this.hideBlock.isSearchResult = true;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }
    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public riGridBodyOnClick(ev: Event): void {
        this.selectedRowFocus(ev.srcElement);
    }

    public riGridBodyOnKeyDown(ev: Event): void {
        this.selectedRowFocus(ev.srcElement);
    }
    //End: Grid functionality

    public selectedRowFocus(rsrcElement: any): void {
        let additionalInfo: any;
        additionalInfo = this.riGrid.Details.GetAttribute('EmployeeCode', 'AdditionalProperty');
        if (additionalInfo) {
            additionalInfo = additionalInfo.split('|');
            this.selectedEmp = this.parseGridRowData(additionalInfo);
            this.applySelectedEmpToView(this.selectedEmp);
        }
    }

    public parseGridRowData(additionalInfo: any): any {
        let obj: any = {};
        this.setControlValue('SelectedEmployeeCode', '');
        this.setControlValue('RedirectedEmployeeCode', '');
        if (additionalInfo) {
            obj['Redirection'] = additionalInfo[0];
            obj['SelectedEmployeeCode'] = additionalInfo[1];
            obj['SelectedName'] = additionalInfo[2];
            obj['RedirectedEmployeeCode'] = additionalInfo[3];
            obj['RedirectedName'] = additionalInfo[4];
            //The following details point to either the original employee or the redirected employee
            obj['EmployeeMobile'] = additionalInfo[5];
            obj['EmployeeTelephone'] = additionalInfo[6];
            obj['EmployeeSecondary'] = additionalInfo[7];
            obj['EmployeeEmail'] = additionalInfo[8];
            obj['EmployeeBranch'] = additionalInfo[9];
            obj['EmployeeBranchNo'] = additionalInfo[10];
            //Selected Employee Supervisor Details
            obj['SafeSupervisorCode1'] = additionalInfo[11];
            obj['SafeSupervisorName1'] = additionalInfo[12];
            obj['SafeSupervisorMobile1'] = additionalInfo[13];
            obj['SafeSupervisorTelephone1'] = additionalInfo[14];
            obj['SafeSupervisorSecondary1'] = additionalInfo[15];
            obj['SafeSupervisorEmail1'] = additionalInfo[16];
            obj['SafeSupervisorBranch1'] = additionalInfo[17];
            obj['SafeSupervisorBranchNo1'] = additionalInfo[18];
            //Redirected Employee Supervisor Details
            obj['SafeSupervisorCode2'] = additionalInfo[19];
            obj['SafeSupervisorName2'] = additionalInfo[20];
            obj['SafeSupervisorMobile2'] = additionalInfo[21];
            obj['SafeSupervisorTelephone2'] = additionalInfo[22];
            obj['SafeSupervisorSecondary2'] = additionalInfo[23];
            obj['SafeSupervisorEmail2'] = additionalInfo[24];
            obj['SafeSupervisorBranch2'] = additionalInfo[25];
            obj['SafeSupervisorBranchNo2'] = additionalInfo[26];
        }
        return obj;
    }

    public applySelectedEmpToView(data: any): void {
        if (data) {
            this.setControlValue('SelectedEmployeeCode', data.SelectedEmployeeCode);
            this.setControlValue('RedirectedEmployeeCode', data.RedirectedEmployeeCode);
            //Selected Employee Details
            this.setControlValue('SelectedName', data.SelectedName);
            this.setControlValue('RedirectedName', data.RedirectedName);
            this.setControlValue('EmployeeMobile', data.EmployeeMobile);
            this.setControlValue('EmployeeTelephone', data.EmployeeTelephone);
            this.setControlValue('EmployeeSecondary', data.EmployeeSecondary);
            this.setControlValue('EmployeeEmail', data.EmployeeEmail);
            this.setControlValue('EmployeeBranch', data.EmployeeBranch);
            this.setControlValue('EmployeeBranchNo', data.EmployeeBranchNo);

            if (data.Redirection === 'N') {
                this.hideBlock.isSupervisorFor = true;
                this.hideBlock.isRedirectedTo = true;
                this.setControlValue('SupervisorSelect', 'employee');
                this.supervisorSelectOnChange('employee');
            } else {
                this.hideBlock.isSupervisorFor = false;
                this.hideBlock.isRedirectedTo = false;
                this.setControlValue('SupervisorSelect', 'redirected');
                this.supervisorSelectOnChange('redirected');
            }
        }
    }

    public onChangeSupervisorSelect(data: any): void {
        let value: any = data.target.value;
        this.supervisorSelectOnChange(value);
    }
    public supervisorSelectOnChange(data: any): void {
        switch (data) {
            case 'employee':
                this.setControlValue('SupervisorCode', this.selectedEmp.SafeSupervisorCode1);
                this.setControlValue('SupervisorName', this.selectedEmp.SafeSupervisorName1);
                this.setControlValue('SupervisorMobile', this.selectedEmp.SafeSupervisorMobile1);
                this.setControlValue('SupervisorTelephone', this.selectedEmp.SafeSupervisorTelephone1);
                this.setControlValue('SupervisorSecondary', this.selectedEmp.SafeSupervisorSecondary1);
                this.setControlValue('SupervisorEmail', this.selectedEmp.SafeSupervisorEmail1);
                this.setControlValue('SupervisorBranch', this.selectedEmp.SafeSupervisorBranch1);
                this.setControlValue('SupervisorBranchNo', this.selectedEmp.SafeSupervisorBranchNo1);
                break;
            case 'redirected':
                this.setControlValue('SupervisorCode', this.selectedEmp.SafeSupervisorCode2);
                this.setControlValue('SupervisorName', this.selectedEmp.SafeSupervisorName2);
                this.setControlValue('SupervisorMobile', this.selectedEmp.SafeSupervisorMobile2);
                this.setControlValue('SupervisorTelephone', this.selectedEmp.SafeSupervisorTelephone2);
                this.setControlValue('SupervisorSecondary', this.selectedEmp.SafeSupervisorSecondary2);
                this.setControlValue('SupervisorEmail', this.selectedEmp.SafeSupervisorEmail2);
                this.setControlValue('SupervisorBranch', this.selectedEmp.SafeSupervisorBranch2);
                this.setControlValue('SupervisorBranchNo', this.selectedEmp.SafeSupervisorBranchNo2);
                break;
        }
    }

    //Start: Loockup functionality
    public doLookup(): void {
        let gLanguageCode: any = this.riExchange.LanguageCode();
        let reqData: any[] = [
            {
                'table': 'Branch',
                'query': { 'BusinessCode': this.businessCode(), 'LiveBranch': true },
                'fields': ['BusinessCode', 'BranchNumber', 'BranchName', 'OccupationCode']
            },
            {
                'table': 'Occupation',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['OccupationCode', 'OccupationDesc']
            },
            {
                'table': 'Employee',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['BusinessCode', 'EmployeeCode', 'OccupationCode', 'BranchNumber']
            }
        ];

        this.LookUp.lookUpPromise(reqData).then(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    let branch: any[] = [], occupation: any[] = [], employee: any[] = [];
                    if (data[0] && data[0].length > 0) {
                        branch = data[0];
                    }
                    if (data[1] && data[1].length > 0) {
                        occupation = data[1];
                    }
                    if (data[2] && data[2].length > 0) {
                        employee = data[2];
                    }
                    branch.forEach(b => {
                        let filterData = employee.find(e => ((b.BusinessCode === e.BusinessCode)
                            && (b.BranchNumber === e.BranchNumber)));
                        if (filterData) {
                            this.ttBranch.push({
                                'branchNumber': b.BranchNumber,
                                'branchName': b.BranchName,
                                'businessCode': b.BusinessCode,
                                'ttBranch': b.ttBranch
                            });
                        }
                    });
                    occupation.forEach(o => {
                        let filterData = employee.find(e => (o.OccupationCode === e.OccupationCode));
                        if (filterData) {
                            this.ttOccupation.push({
                                'occupationCode': o.OccupationCode,
                                'occupationDesc': o.OccupationDesc,
                                'ttOccupation': o.ttOccupation
                            });
                        }
                    });
                    this.setDataAfterAPICall();
                }
            }
        ).catch(
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }
    public setDataAfterAPICall(): void {
        if (this.isReturning()) {
            this.setControlValue('BranchNumberSelect', this.pageParams.BranchNumberSelect);
            this.setControlValue('OccupationCodeSelect', this.pageParams.OccupationCodeSelect);
        } else {
            this.setControlValue('BranchNumberSelect', this.cbbService.getBranchCode());
        }
    }
    //End: Loockup functionality

    public onChangeSearchBy(data: any): void {
        let value: any = data.target.value;
        this.showHideFormElements(value);
    }
    public showHideFormElements(data: string): void {
        if (data) {
            this.hideBlock.isSearchByEmployee = true;
            this.hideBlock.isSearchByPostCode = true;
            if (data === 'Name') {
                this.hideBlock.isSearchByEmployee = false;
            } else {
                this.hideBlock.isSearchByPostCode = false;
            }
        }
    }

    //Start: Ellipsis functionality
    public onEmpSearchEllipsisDataReceived(data: any): void {
        if (data) {
            this.setControlValue('EmployeeCode', data.EmployeeCode);
            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
            this.setControlValue('EmployeeForename1', data.EmployeeForename1);
        }
    }
    //End: Ellipsis functionality

    //Start: Page Navigation functionality
    public doNavigate(data: string): void {
        if (data) {
            this.pageParams = this.uiForm.getRawValue();
            this.pageParams.isSearchByEmployee = this.hideBlock.isSearchByEmployee;
            switch (data) {
                case 'Dairy':
                    this.navigate('CallCentre', AppModuleRoutes.PROSPECTTOCONTRACT + ProspectToContractModuleRoutes.ICABSCMDIARYMAINTENANCE, {
                        PassEmployeeCode: this.getControlValue('PassEmployeeCode')
                    });
                    break;
                case 'Branch':
                    this.navigate('CallCentre', InternalMaintenanceServiceModuleRoutes.ICABSCMEMPLOYEEVIEWBRANCHDETAILS, {
                        PassBranchNumber: this.getControlValue('PassBranchNumber')
                    });
                    break;
            }
        }
    }
    //End: Page Navigation functionality
    public runDiary(data: any): void {
        switch (data) {
            case 'SelectedEmployeeCode':
                this.setControlValue('PassEmployeeCode', this.getControlValue('SelectedEmployeeCode'));
                break;
            case 'RedirectedEmployeeCode':
                this.setControlValue('PassEmployeeCode', this.getControlValue('RedirectedEmployeeCode'));
                break;
            default:
                this.setControlValue('PassEmployeeCode', '');
                break;
        }
        this.doNavigate('Dairy');
    }
    public runBranchDetails(data: any): void {
        switch (data) {
            case 'EmployeeBranchNo':
                this.setControlValue('PassBranchNumber', this.getControlValue('EmployeeBranchNo'));
                break;
            case 'SupervisorBranchNo':
                this.setControlValue('PassBranchNumber', this.getControlValue('SupervisorBranchNo'));
                break;
            default:
                this.setControlValue('PassBranchNumber', '');
                break;
        }
        this.doNavigate('Branch');
    }
}
