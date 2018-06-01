import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { TableComponent } from './../../../shared/components/table/table';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSBBranchServiceAreaSearch.html'
})

export class BranchServiceAreaSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('BranchServiceAreaTable') BranchServiceAreaTable: TableComponent;
    @ViewChild('errorModal') public errorModal;
    public pageId: string = '';
    public tServiceBranch: boolean = true;
    public branchdropDownDisabled: boolean = false;
    public inputParamsBranch: any = {};
    public lookUpSubscription: Subscription;
    public search: URLSearchParams;
    public postsearch: URLSearchParams;
    public pageTitle: string;
    public negBranchNumberSelected: Object = {
        id: '',
        text: ''
    };
    public inputparams: any = {};
    public method: string = 'service-delivery/search';
    public module: string = 'service';
    public operation: string = 'Business/iCABSBBranchServiceAreaSearch';
    public controls = [
        { name: 'ServiceBranchNumber' },
        { name: 'BranchName' },
        { name: 'EmployeeCode' }
    ];

    public columns: Array<any> = [
        { title: 'Code', name: 'BranchServiceAreaCode' },
        { title: 'Description', name: 'BranchServiceAreaDesc' },
        { title: 'Employee', name: 'EmployeeCode' },
        { title: 'Employee Name', name: 'EmployeeSurname' }
    ];

    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBRANCHSERVICEAREASEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Area Search';
        this.inputparams.method = this.method;
        this.inputparams.module = this.module;
        this.inputparams.operation = this.operation;
        //  this.updateView();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public updateView(): void {
        this.window_onload();
        this.createColumnsLists();
        this.AreaSearch();
    }

    public onBranchDataReceived(data: any): void {
        this.setControlValue('ServiceBranchNumber', data.BranchNumber);
        this.setControlValue('BranchName', data.BranchName);
        this.AreaSearch();
    }

    private window_onload(): void {
        this.parentMode = this.ellipsis.childConfigParams['parentMode'];
        switch (this.parentMode) {
            case 'LookUp-PlanVisit':
            case 'LookUp-List':
            case 'LookUp-ServiceEngineer':
                this.setControlValue('ServiceBranchNumber', this.ellipsis.childConfigParams['BranchNumberServiceBranchNumber']);
                this.setControlValue('BranchName', this.ellipsis.childConfigParams['BranchName']);
                if (this.ellipsis.childConfigParams['BranchNumberServiceBranchNumber']) {
                this.negBranchNumberSelected = {
                    id: this.getControlValue('ServiceBranchNumber'),
                    text: this.getControlValue('ServiceBranchNumber') + ' - ' + this.getControlValue('BranchName')
                };
                }
                this.tServiceBranch = true;
                break;
            case 'LookUp-SC':
            case 'LookUp-SOPSC':
            case 'ContractJobReport':
            case 'LookUp':
            case 'LookUp-Waste':
            case 'LookUp-FixedPricedJob':
            case 'LookUp-VisitPattern':
                this.setControlValue('ServiceBranchNumber', this.ellipsis.childConfigParams['ServiceBranchNumber']);
                this.setControlValue('BranchName', this.ellipsis.childConfigParams['BranchName']);
                if (this.ellipsis.childConfigParams['BranchNumberServiceBranchNumber']) {
                this.negBranchNumberSelected = {
                    id: this.getControlValue('ServiceBranchNumber'),
                    text: this.getControlValue('ServiceBranchNumber') + ' - ' + this.getControlValue('BranchName')
                };
                }
                this.tServiceBranch = true;
                break;
            case 'LookUp-Employee':
            case 'LookUp-SCDisplay':
                this.setControlValue('ServiceBranchNumber', this.ellipsis.childConfigParams['ServiceBranchNumber']);
                this.tServiceBranch = false;
                break;
            case 'LookUp-FB':
                this.setControlValue('ServiceBranchNumber', this.ellipsis.childConfigParams['FBEVBranchServiceAreaCode']);
                this.tServiceBranch = true;
                break;
            default:
                this.tServiceBranch = false;
                break;

        }

        if (this.parentMode === 'LookUp' || this.parentMode === 'LookUp-Waste') {
            this.branchdropDownDisabled = true;
        } else {
            this.branchdropDownDisabled = false;
        }


    }

    private AreaSearch(): void {

        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('BranchServiceAreaCode', '');
        switch (this.parentMode) {
            case 'LookUp-SC':
            case 'LookUp-VisitPattern':
            case 'LookUp-FixedPricedJob':
            case 'LookUp-SOPSC':
            case 'ContractJobReport':
            case 'LookUp-PlanVisit':
            case 'LookUp-Employee':
            case 'LookUp-List':
            case 'LookUp-Waste':
            case 'LookUp-SCDisplay':
                this.search.set('BranchNumber', this.getControlValue('ServiceBranchNumber'));
                if (this.parentMode === 'LookUp-FixedPricedJob') {
                    this.search.set('FixedPriceJob', 'true');
                }
                break;
            default:
                this.search.set('BranchNumber', this.utils.getBranchCode());
                break;

        }
        if (this.parentMode === 'LookUp-Employee') {
            this.setControlValue('EmployeeCode', this.ellipsis.childConfigParams['EmployeeCode']);
            this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        } else {
            this.search.set('EmployeeCode', '');
        }
        if (this.parentMode === 'LookUp-DespatchGrid') {
            // lookupIP[0].query.push('MultiBranchArea')
            this.search.set('MultiBranchArea', 'True');
        }
        if (this.parentMode !== 'LookUp-All' && this.parentMode !== 'Search') {
            this.search.set('LiveServiceArea', 'Yes');
        }
        this.inputparams.columns = [];
        this.inputparams.columns = this.columns;
        this.inputparams.search = this.search;
        if (this.parentMode !== 'LookUp-AnnualCalendar') {
            this.BranchServiceAreaTable.loadTableData(this.inputparams);
        } else {
            this.postsearch = this.getURLSearchParamObject();
            this.postsearch.set(this.serviceConstants.Action, '6');
            this.inputparams.postsearch = this.postsearch;
            let formdata: Object = {};
            formdata['Function'] = 'GetBranchServiceArea';
            formdata['LoggedInBranch'] = this.utils.getBranchCode();
            formdata['ContractNumber'] = this.ellipsis.childConfigParams['ContractNumber'];
            formdata['PremiseNumber'] = this.ellipsis.childConfigParams['PremiseNumber'];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.inputparams.postsearch, formdata)
                .subscribe(
                (data) => {
                    if (data.hasOwnProperty('errorMessage')) {
                        this.errorModal.show({ msg: data.errorMessage, title: MessageConstant.Message.ErrorTitle }, false);
                    } else {
                        this.search.set('BranchServiceAreaCode', data.BranchServiceAreaCode);
                        this.inputparams.search = this.search;
                        this.BranchServiceAreaTable.loadTableData(this.inputparams);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                },
                (error) => {
                    this.search.set('BranchServiceAreaCode', '');
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public onSearchClick(): void {
        this.AreaSearch();
    }

    private createColumnsLists(): void {
        this.columns = [{ title: 'Code', name: 'BranchServiceAreaCode', type: MntConst.eTypeCode },
        { title: 'Description', name: 'BranchServiceAreaDesc', type: MntConst.eTypeText },
        { title: 'Employee', name: 'EmployeeCode', type: MntConst.eTypeCode },
        { title: 'Employee Name', name: 'EmployeeSurname', type: MntConst.eTypeText }
        ];
        if (this.parentMode === 'LookUp-All' || this.parentMode === 'Search') {
            this.columns.push({ title: 'Live', name: 'LiveServiceArea', type: 'eTypeCheckBox' });
        }
    }


    public selectedData(event: any): void {
        let returnObj: any;
        switch (this.parentMode) {
            case 'ContractJobReport':
                returnObj = {
                    'ServiceAreaCode': event.row.BranchServiceAreaCode
                };
                break;
            case 'LookUp':
            case '"LookUp-All':
            // case 'LookUp-SC':
            case 'LookUp-SOPSC':
            case 'LookUp-PlanVisit':
            case 'LookUp-UpdateParent':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
            case 'LookUp-VisitPattern':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
            case 'LookUp-Waste':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'EmployeeCode': event.row.EmployeeCode
                };
                break;
            case 'LookUp-Employee':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode
                };
                break;
            case 'LookUp-To':
                returnObj = {
                    'BranchServiceAreaCodeTo': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDescTo': event.row.BranchServiceAreaDesc
                };
                break;
            case 'LookUp-ToEmp':
                returnObj = {
                    'BranchServiceAreaCodeTo': event.row.BranchServiceAreaCode,
                    'EmployeeSurnameTo': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-Emp':
            case 'LookUp-Emp-UpdateParent':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ServiceEmp':
            case 'LookUp-FixedPricedJob':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-SC':
            case 'LookUp-GroupVisitEntry':
            case 'LookUp-UnreturnedConsignmentNotes':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-SVBCTEmp':
                returnObj = {
                    'SVBCTServiceAreaCode': event.row.BranchServiceAreaCode,
                    'SVBCTServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
            case 'LookUp-PlanEmp':
                returnObj = {
                    'BranchServiceAreaPlan': event.row.BranchServiceAreaCode,
                    'PlanEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'GeneralSearch-Lookup':
                returnObj = {
                    'SearchValue': event.row.BranchServiceAreaCode
                };
                break;
            case 'LookUp-List':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-EmpManpowerList':
            case 'LookUp-PlanningDiary':
            case 'LookUp-EmpList':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ServiceEngineer':
                returnObj = {
                    'EngineerServiceAreaCode': event.row.BranchServiceAreaCode,
                    'EngineerServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
            case 'LookUp-DespatchGrid':
                returnObj = {
                    'BranchServiceAreaCodeChange': event.row.BranchServiceAreaCode,
                    'EmployeeSurnameChange': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-AssignSADespatchGrid':
                returnObj = {
                    'AssignServiceArea': event.row.BranchServiceAreaCode,
                    'AssignServiceEmployee': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-SCDisplay':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'ScheduleEmployeeCode': event.row.EmployeeCode,
                    'ScheduleEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-FB':
                returnObj = {
                    'FBEVBranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'FBEVBranchServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
            default:
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
        }
        this.ellipsis.sendDataToParent(returnObj);
    }

}
