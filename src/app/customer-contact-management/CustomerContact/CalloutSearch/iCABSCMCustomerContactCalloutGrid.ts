import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from './../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';

import { ContractSearchComponent } from './../../../../app/internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../../../app/internal/search/iCABSAPremiseSearch';
import { BranchServiceAreaSearchComponent } from './../../../../app/internal/search/iCABSBBranchServiceAreaSearch';
import { EmployeeSearchComponent } from './../../../../app/internal/search/iCABSBEmployeeSearch';

@Component({
    templateUrl: 'iCABSCMCustomerContactCalloutGrid.html'
})
export class CustomerContactCalloutGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('customerContactCalloutEllipsis') public customerContactCalloutEllipsis: EllipsisComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('customerContactCallOutPagination') customerContactCallOutPagination: PaginationComponent;

    public pageId: string = '';
    public itemsPerPage: number = 10;
    public pageCurrent: number = 1;
    public itemsTotal: number = 0;
    public isHidden: boolean = false;

    public ellipsisQueryParams: any = {
        ContractNumber: {
            autoOpen: false,
            isShowCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp',
                isShowAddNew: false
            },
            modalConfig: {
                backdrop: 'static',
                isKeyboard: true
            },
            contentComponent: ContractSearchComponent,
            isShowHeader: true,
            searchModalRoute: '',
            isDisabled: false
        },
        PremiseNumber: {
            isAutoOpen: false,
            isShowCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp',
                isShowAddNew: false,
                ContractNumber: '',
                ContractName: ''
            },
            modalConfig: {
                backdrop: 'static',
                isKeyboard: true
            },
            contentComponent: PremiseSearchComponent,
            isShowHeader: true,
            searchModalRoute: '',
            isDisabled: false
        },
        ServiceArea: {
            isAutoOpen: false,
            isShowCloseButton: true,
            childConfigParams: {
                parentMode: 'Lookup',
                isShowAddNew: true
            },
            modalConfig: {
                backdrop: 'static',
                isKeyboard: true
            },
            contentComponent: BranchServiceAreaSearchComponent,
            isShowHeader: true,
            searchModalRoute: '',
            isDisabled: false
        },
        EmployeeSearch: {
            isAutoOpen: false,
            isShowCloseButton: true,
            childConfigParams: {
                parentMode: 'Lookup',
                isShowAddNew: true
            },
            modalConfig: {
                backdrop: 'static',
                isKeyboard: true
            },
            contentComponent: EmployeeSearchComponent,
            isShowHeader: true,
            searchModalRoute: '',
            isDisabled: false
        }
    };

    public controls = [
        { name: 'selectStatus', value: 'open' },
        { name: 'CustomerContactNumber', type: MntConst.eTypeCode },
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true },
        { name: 'selectImmediate', value: 'all' },
        { name: 'selectBranch', value: 'this' },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true },
        { name: 'selectEmployee', value: 'all' },
        { name: 'EmployeeCode' },
        { name: 'selectOverdue', value: 'all' },
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc', disabled: true },
        { name: 'CallOutROWID' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCUSTOMERCONTACTCALLOUTGRID;
        this.pageTitle = this.browserTitle = 'Callout Search';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.buildGrid();
        this.refresh();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('Reference', 'Reference', 'Reference', MntConst.eTypeCode, 6, true);
        this.riGrid.AddColumnAlign('Reference', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PassedTo', 'PassedTo', 'PassedTo', MntConst.eTypeCode, 10, false);
        this.riGrid.AddColumnAlign('PassedTo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PassedDateTime', 'PassedDateTime', 'PassedDateTime', MntConst.eTypeText, 16, false);
        this.riGrid.AddColumnAlign('PassedDateTime', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceArea', 'ServiceArea', 'ServiceArea', MntConst.eTypeCode, 4, false);
        this.riGrid.AddColumn('Premise', 'Premise', 'Premise', MntConst.eTypeText, 10, false);
        this.riGrid.AddColumn('Info', 'Info', 'Info', MntConst.eTypeImage, 1, true);
        this.riGrid.AddColumn('VisitType', 'VisitType', 'VisitType', MntConst.eTypeCode, 4, false);
        this.riGrid.AddColumnAlign('VisitType', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('VisitDate', 'VisitDate', 'VisitDate', MntConst.eTypeDate, 10, false);
        this.riGrid.AddColumnAlign('VisitDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ProductCode', 'ProductCode', 'ProductCode', MntConst.eTypeText, 10, false);
        this.riGrid.AddColumn('ServiceType', 'ServiceType', 'ServiceType', MntConst.eTypeCode, 2, false);
        this.riGrid.AddColumnAlign('ServiceType', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('RecordedInfo', 'RecordedInfo', 'RecordedInfo', MntConst.eTypeText, 16, false);
        this.riGrid.AddColumn('RecordedBy', 'RecordedBy', 'RecordedBy', MntConst.eTypeCode, 6, false);
        this.riGrid.AddColumn('PlanNumber', 'PlanNumber', 'PlanNumber', MntConst.eTypeInteger, 2, false);
        this.riGrid.AddColumnAlign('PlanNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('Closed', 'Closed', 'Closed', MntConst.eTypeImage, 2, false);

        this.riGrid.AddColumnOrderable('Reference', true);
        this.riGrid.AddColumnOrderable('RecordedInfo', true);
        this.riGrid.AddColumnOrderable('Premise', true);
        this.riGrid.AddColumnOrderable('VisitType', true);
        this.riGrid.AddColumnOrderable('VisitDate', true);
        this.riGrid.AddColumnOrderable('ProductCode', true);
        this.riGrid.AddColumnOrderable('ServiceType', true);
        this.riGrid.AddColumnOrderable('PlanNumber', true);
        this.riGrid.AddColumnOrderable('PassedTo', true);
        this.riGrid.AddColumnOrderable('PassedDateTime', true);

        this.riGrid.Complete();
    }

    private riGridBeforeExecute(): void {
        let gridParams = this.getURLSearchParamObject();
        let queryParams: any = {
            operation: 'ContactManagement/iCABSCMCustomerContactCalloutGrid',
            module: 'callouts',
            method: 'ccm/maintenance'
        };
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set('LanguageCode', this.riExchange.LanguageCode());
        gridParams.set('CustomerContactNumber', this.getControlValue('CustomerContactNumber'));
        gridParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        gridParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        gridParams.set('Status', this.getControlValue('selectStatus'));
        gridParams.set('Immediate', this.getControlValue('selectImmediate'));
        gridParams.set('Branch', this.getControlValue('selectBranch'));
        gridParams.set('Overdue', this.getControlValue('selectOverdue'));
        gridParams.set('Employee', this.getControlValue('selectEmployee'));
        gridParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        gridParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));

        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        gridParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridParams.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(queryParams.method, queryParams.module, queryParams.operation, gridParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullerror']));
                    return;
                }
                this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                this.itemsTotal = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;

                this.riGrid.RefreshRequired();

                this.riGrid.Execute(data);
                this.customerContactCallOutPagination.totalItems = this.itemsTotal;

            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error));
            });
    }

    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public employeeOnChange(data: any): void {
        if (this.getControlValue('selectEmployee') === 'all') {
            this.isHidden = false;
        }
        else {
            this.isHidden = true;
        }
    }

    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        this.riGridBeforeExecute();
    }

    public refresh(): void {
        this.riGridBeforeExecute();
    }

    public onGridRowClick(data: any): void {
        this.setControlValue('CallOutROWID', this.riGrid.Details.GetAttribute('Reference', 'rowid'));
        let columnClicked: string = this.riGrid.CurrentColumnName;
        switch (this.riGrid.CurrentColumnName) {
            case 'Reference':
                this.navigate('UpdateCallOut', InternalMaintenanceServiceModuleRoutes.ICABSCMCALLOUTMAINTENANCE);
                break;
            case 'Info':
                this.modalAdvService.emitMessage(new ICabsModalVO(this.riGrid.Details.GetAttribute('Premise', 'title')));
        }
    }

    public onContractNumberDataReceive(data: any): void {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.AccountName);
        this.ellipsisQueryParams.PremiseNumber.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsisQueryParams.PremiseNumber.childConfigParams.ContractName = this.getControlValue('ContractName');
    }

    public onPremiseNumberDataReceive(data: any): void {
        this.setControlValue('PremiseName', data.PremiseName);
        this.setControlValue('PremiseNumber', data.PremiseNumber);
    }

    public onServiceAreaDataReceive(data: any): void {
        this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
        this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
    }

    public onEmployeeSearchDataReceive(data: any): void {
        this.setControlValue('EmployeeCode', data.EmployeeSurName);
    }
}
