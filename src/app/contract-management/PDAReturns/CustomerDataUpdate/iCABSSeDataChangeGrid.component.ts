import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { EmployeeSearchComponent } from '../../../../app/internal/search/iCABSBEmployeeSearch';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageCallback, ErrorCallback } from '../../../base/Callback';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { CBBService } from '../../../../shared/services/cbb.service';
import { InternalMaintenanceModuleRoutes, InternalMaintenanceServiceModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSSeDataChangeGrid.html'
})

export class DataChangeGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;

    public showHeader: boolean = true;
    public pageSize: number = 10;
    public curPage: number = 1;
    //public totalItems: number = 10;
    public totalRecords: number = 10;
    public pageId: string = '';
    public isRequesting: boolean = false;
    //public maxColumn: number = 12;
    //public inputParams: any = {};
    //public branchNumber: any;
    //public showCloseButton = true;
    //public headerClicked: string = '';
    public gridSortHeaders: Array<any>;
    public sortType: string = 'Descending';
    public function: string = '';
    public modalConfig: Object;
    public PDAICABSDataChangeRowID: any = {};
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public messageContentSave: string = MessageConstant.Message.SavedSuccessfully;
    public messageContentError: string = MessageConstant.Message.SaveError;
    private currentContractTypeURLParameter: Object = { currentContractTypeURLParameter: 'contract', Mode: 'Release' };

    // Ellipsis Component
    public employeeSearchComponent = EmployeeSearchComponent;
    public ellipsisQueryParams: Object = {
        inputParamsEmployeeCode: {
            parentMode: 'LookUp'
        }
    };

    public queryParams: any = {
        module: 'pda',
        operation: 'Service/iCABSSeDataChangeGrid',
        method: 'contract-management/maintenance'
    };

    public contractSearchParams: any = {
        'currentContractTypeURLParameter': '<contract>'
    };

    public controls = [
        { name: 'BranchNumber', readonly: true, disabled: false, required: false },
        { name: 'BranchName', readonly: true, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: true, disabled: false, required: false },
        { name: 'EmployeeCode', readonly: true, disabled: false, required: false },
        { name: 'ActionedStatus', readonly: true, disabled: false, required: false },
        { name: 'ContractNumber' },
        { name: 'PremiseNumber' }
    ];

    constructor(injector: Injector, private cbb: CBBService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEDATACHANGEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.initGrid();
            this.populateUIFromFormData();
        } else {
            this.window_onload();
        }
        this.refresh();
        this.utils.setTitle('Customer Data Update');
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
        this.setFormMode(this.c_s_MODE_UPDATE);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }

    public window_onload(): void {
        this.initGrid();
        // this.onShowchange('');
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.setControlValue('ActionedStatus', '');
        this.lookupBranchName();
    }

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
                this.setControlValue('BranchName', Branch.BranchName);
            };
        });
    }

    //=Start: Grid functionality
    private initGrid(): void {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.buildGrid();
        // this.riGrid_BeforeExecute();
    }
    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('EmployeeCode', 'Grid', 'EmployeeCode', MntConst.eTypeCode, 6, false);
        this.riGrid.AddColumn('ChangeDate', 'Grid', 'ChangeDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ContractNumber', 'Grid', 'ContractNumber', MntConst.eTypeCode, 8);
        this.riGrid.AddColumn('PremiseNumber', 'Grid', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumn('PremiseName', 'Grid', 'PremiseName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ProductCode', 'Grid', 'ProductCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumn('Field', 'Grid', 'Field', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('OriginalValue', 'Grid', 'OriginalValue', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('UpdatedValue', 'Grid', 'UpdatedValue', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('Accept', 'Grid', 'Accept', MntConst.eTypeButton, 10);
        this.riGrid.AddColumn('Reject', 'Grid', 'Reject', MntConst.eTypeButton, 10);
        this.riGrid.AddColumn('Info', 'Grid', 'Info', MntConst.eTypeImage, 1);

        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ChangeDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('EmployeeCode', true);
        this.riGrid.AddColumnOrderable('ChangeDate', true);
        this.riGrid.AddColumnOrderable('ContractNumber', true);

        this.riGrid.Complete();
    }

    public riGrid_BeforeExecute(): void {
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

        search.set('BranchNumber', this.getControlValue('BranchNumber'));
        search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        search.set('ActionedStatus', this.getControlValue('ActionedStatus'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.messageModal.show(data, true);
                } else {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.ResetGrid();
                    this.riGrid.Execute(data);

                }
                this.isRequesting = false;
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
    public riGrid_AfterExecute(): void {
        /*if (!this.riGrid.Update && this.totalRecords > 0 && this.riGrid.HTMLGridBody) {
            this.selectedRowFocus(this.riGrid.HTMLGridBody.children(0).children(0).children(0));
        }*/
    }
    private selectedRowFocus(rsrcElement: any): void {
        let oTR: any;
        if (rsrcElement) {
            oTR = rsrcElement.parentElement.parentElement.parentElement;
            rsrcElement.Focus();
            this.setAttribute('DataChangeRowID', rsrcElement.RowID);
            this.setAttribute('Row', oTR.sectionRowIndex);
        }
    }

    public riGrid_BodyOnKeyDown(evt: any): void {
        //toto
    }

    public getCurrentPage(data: any): void {
        this.curPage = data.value;
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

    public tbodyDataChange_OnDblClick(ev: Event): void {
        let params: any = {
            CurrentContractTypeURLParameter: this.riGrid.Details.GetAttribute('PremiseName', 'AdditionalProperty'),
            ContractNumber: this.riGrid.Details.GetValue('ContractNumber'),
            PremiseNumber: this.riGrid.Details.GetValue('PremiseNumber'),
            ProductCode: this.riGrid.Details.GetValue('ProductCode'),
            FieldName: this.riGrid.Details.GetValue('Field'),
            CurrentContractType: this.riGrid.Details.GetAttribute('PremiseName', 'AdditionalProperty')
        };
        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNumber':
                this.navigate('Premise', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, params);
                break;
            case 'PremiseNumber':
                this.navigate('ServiceCover', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, params);
                break;
            case 'Field':
            case 'OriginalValue':
                this.navigate('', InternalMaintenanceServiceModuleRoutes.ICABSSEDATACHANGEMAINTENANCE, params);
                break;
            case 'UpdatedValue':
                this.navigate('UpdatedValue', InternalMaintenanceServiceModuleRoutes.ICABSSEDATACHANGEMAINTENANCE, params);
                break;
            case 'ProductCode':
                if (params.ProductCode) {
                    this.setAttribute('ServiceCoverRowID', this.riGrid.Details.GetAttribute('ProductCode', 'AdditionalProperty'));
                    this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, params);
                }
                break;
        }
    }

    public riGrid_BodyOnClick(ev: Event): void {
        let params: any = {
            CurrentContractTypeURLParameter: this.riGrid.Details.GetAttribute('ContractNumber', 'AdditionalProperty'),
            ContractNumber: this.riGrid.Details.GetValue('ContractNumber'),
            ContractHistoryRowID: this.riGrid.Details.GetAttribute('Info', 'rowID')
        };
        switch (this.riGrid.CurrentColumnName) {
            case 'Accept':
            case 'Reject':
                this.PDAICABSDataChangeRowID = this.riGrid.Details.GetAttribute('PremiseName', 'AdditionalProperty');
                this.function = this.riGrid.CurrentColumnName;
                this.selectChange();
                break;
            case 'Info':
                this.navigate('Info', InternalMaintenanceApplicationModuleRoutes.ICABSACONTRACTHISTORYDETAIL, params);
                break;
        }
    }
    //=End: Grid Functionality

    public onEmployeeCodeReceived(data: any): void {
        let employeeCode = data['EmployeeCode'];
        let employeeSurname = data['EmployeeSurname'];
        // Set Employee Number
        this.setControlValue('EmployeeCode', employeeCode);
        this.setControlValue('EmployeeSurname', employeeSurname);
    }

    public onEmployeeCodeChange(evt: any): void {
        let formdata: Object = {};
        let codechangePost: URLSearchParams = this.getURLSearchParamObject();
        codechangePost.set(this.serviceConstants.Action, '6');
        formdata[this.serviceConstants.Function] = 'GetEmployeeSurname';
        formdata['EmployeeCode'] = this.getControlValue('EmployeeCode');
        this.queryParams.search = codechangePost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, codechangePost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.messageModal.show(data, true);
                } else {
                    this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                    this.riGrid.RefreshRequired();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public onShowchange(menu: any): void {
        this.setControlValue('ActionedStatus', menu);
    }

    public selectChange(): void {
        let formdata: Object = {};
        let selectchangePost: URLSearchParams = this.getURLSearchParamObject();
        selectchangePost.set(this.serviceConstants.Action, '0');
        formdata[this.serviceConstants.Function] = this.function;
        selectchangePost.set('PDAICABSDataChangeRowID', this.PDAICABSDataChangeRowID);
        this.queryParams.search = selectchangePost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, selectchangePost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.messageModal.show(data, true);
                } else {
                    this.refresh();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
}
