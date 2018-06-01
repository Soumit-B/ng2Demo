import { OnInit, Injector, Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { ServiceCoverSearchComponent } from './../search/iCABSAServiceCoverSearch';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSSSalesStatisticsServiceValueGrid.html'
})

export class SalesStatisticsServiceValueGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('riGrid') public riGrid: GridAdvancedComponent;
    @ViewChild('salesStatSVGPagination') public salesStatSVGPagination: PaginationComponent;
    @ViewChild('serviceCoverSearchEllipsis') public serviceCoverSearchEllipsis: EllipsisComponent;
    private queryParams: any = {
        module: 'salesstats',
        operation: 'Sales/iCABSSSalesStatisticsServiceValueGrid',
        method: 'prospect-to-contract/grid'
    };
    private search: URLSearchParams = new URLSearchParams();
    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'ContractNumber', required: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ContractName', type: MntConst.eTypeText, disabled: true },
        { name: 'PremiseNumber', required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText, disabled: true },
        { name: 'ProductCode', required: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'ServiceCoverRowID' }
    ];
    public inputParams: any = {
        contractParams: {
            isAutoOpen: false,
            parentMode: 'LookUp',
            currentContractType: '',
            showAddNew: false
        },
        premiseParams: {
            parentMode: 'LookUp',
            ContractNumber: '',
            ContractName: '',
            CurrentContractType: ''
        },
        serviceCoverSearchParams: {
            parentMode: 'Search',
            ContractNumber: '',
            ContractName: '',
            PremiseNumber: '',
            PremiseName: '',
            ContractTypeCode: '',
            CurrentContractTypeURLParameter: ''
        }
    };
    public gridParams: any = {
        totalRecords: 0,
        pageCurrent: 1,
        itemsPerPage: 10,
        riGridMode: 0
    };
    public isHidePagination: boolean = true;
    public isShowHeader: boolean = true;
    public contractSearchComponent = ContractSearchComponent;
    public premiseSearchComponent = PremiseSearchComponent;
    public productSearchComponent = ProductSearchGridComponent;
    public serviceCoverSearchComponent = ServiceCoverSearchComponent;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSALESSTATISTICSSERVICEVALUEGRID;
        this.pageTitle = this.browserTitle = 'Sales Statistics Service Value';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.buildGrid();
        }
        else {
            this.setLabelTitle();
        }
    }

    ngAfterViewInit(): void {
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // function to set label based on contractType
    private setLabelTitle(): void {
        let contractType: string;
        let contracttypeName: string;
        contractType = this.riExchange.getCurrentContractType();
        contracttypeName = this.riExchange.getCurrentContractTypeLabel();
        this.pageParams.labelTitle = contracttypeName + ' Number';
        this.inputParams.contractParams.currentContractType = contractType;
        this.inputParams.premiseParams.CurrentContractType = contractType;
        this.inputParams.serviceCoverSearchParams.CurrentContractTypeURLParameter = '<' + contracttypeName + '>';
        if (contractType === 'P')
            this.inputParams.serviceCoverSearchParams.CurrentContractTypeURLParameter = '<Product>';
    }

    private windowOnLoad(): void {
        this.pageParams.isAdd = (this.formMode === this.c_s_MODE_ADD) ? true : false;
        this.pageParams.isRecordFound = false;
        if (this.parentMode === 'ServiceCover') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
            this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
        }
        else {
            this.inputParams.contractParams.isAutoOpen = true;
        }
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ChangeProcessed', 'Grid', 'ChangeProcessed', MntConst.eTypeText, 10, true);
        this.riGrid.AddColumn('ServiceEffectDate', 'Grid', 'ServiceEffectDate', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('ReasonDesc', 'Grid', 'ReasonDesc', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('Employee', 'Grid', 'Employee', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('AnnualValueChange', 'Grid', 'AnnualValueChange', MntConst.eTypeDecimal2, 10);
        this.riGrid.AddColumnAlign('AnnualValueChange', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('SalesStatsValue', 'Grid', 'SalesStatsValue', MntConst.eTypeDecimal2, 10);
        this.riGrid.AddColumnAlign('SalesStatsValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Adjusted', 'Grid', 'Adjusted', MntConst.eTypeImage, 10);
        this.riGrid.Complete();
        this.loadGridData();
    }

    private loadGridData(): void {
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.gridParams.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set('level', 'ServiceValue');
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        this.search.set('RowID', this.getControlValue('ServiceCoverRowID'));
        this.search.set('RequestMode', 'Grid');
        this.search.set('Mode', 'Grid');
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.isHidePagination = true;
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
                else {
                    this.pageParams.isRecordFound = true;
                    this.gridParams.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    //this.riGrid.Update = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateFooter = true;
                    this.isRequesting = true;
                    this.riGrid.Execute(data);
                    if (data.pageData && (data.pageData.lastPageNumber * 10) > 0)
                        this.isHidePagination = false;
                    else
                        this.isHidePagination = true;
                }
                this.isRequesting = false;
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.gridParams.totalRecords = 1;
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // modify the input params on change
    private assignInputParams(ctrlName: string): void {
        switch (ctrlName) {
            case 'ContractNumber':
                this.inputParams.premiseParams.ContractNumber = this.getControlValue('ContractNumber');
                this.inputParams.premiseParams.ContractName = this.getControlValue('ContractName');
                this.inputParams.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
                this.inputParams.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName');
                break;
            case 'PremiseNumber':
                this.inputParams.serviceCoverSearchParams.parentMode = this.pageParams.isAdd ? 'ServiceCover' : 'Search';
                this.inputParams.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
                this.inputParams.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
                break;
            case 'ProductCode':
                this.inputParams.serviceCoverSearchParams.ProductCode = this.getControlValue('ProductCode');
                this.inputParams.serviceCoverSearchParams.ProductDesc = this.getControlValue('ProductDesc');
                break;
        }
    }

    //lookup to get ROWID for servicecover
    private lookUpRowId(): void {
        let lookUpDataLen: number;
        let lookupIP: Array<any> = [
            {
                'table': 'ServiceCover',
                'query': {
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ttServiceCover']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    lookUpDataLen = data[0].length;
                    if (data[0] && lookUpDataLen > 0) {
                        if (lookUpDataLen > 1) {
                            this.serviceCoverSearchEllipsis.openModal();
                        } else {
                            this.setControlValue('ServiceCoverRowID', data[0][0].ttServiceCover);
                            this.lookUpData();
                        }
                    } else {
                        this.setControlValue('ServiceCoverRowID', '');
                        this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                    }
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    //lookup to get all data
    private lookUpData(): void {
        let lookupIP: Array<any> = [{
            'table': 'Contract',
            'query': {
                'ContractNumber': this.getControlValue('ContractNumber'),
                'BusinessCode ': this.businessCode()
            },
            'fields': ['ContractName']
        },
        {
            'table': 'Premise',
            'query': {
                'ContractNumber': this.getControlValue('ContractNumber'),
                'PremiseNumber': this.getControlValue('PremiseNumber'),
                'BusinessCode ': this.businessCode()
            },
            'fields': ['PremiseName']
        },
        {
            'table': 'Product',
            'query': {
                'ProductCode': this.getControlValue('ProductCode'),
                'BusinessCode ': this.businessCode()
            },
            'fields': ['ProductDesc']
        }];
        this.LookUp.lookUpPromise(lookupIP).then(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data && data.length > 0) {
                        if (data[0] && data[0].length > 0) {
                            this.setControlValue('ContractName', data[0][0].ContractName || '');
                        }
                        if (data[1] && data[1].length > 0) {
                            this.setControlValue('PremiseName', data[1][0].PremiseName || '');
                        }
                        if (data[2] && data[2].length > 0) {
                            this.setControlValue('ProductDesc', data[2][0].ProductDesc || '');
                        }
                        this.buildGrid();
                    }
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    //api call to get ROWID
    private rowIdData(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set('ROWID', this.getControlValue('ServiceCoverRowID'));
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('Mode', 'Fetch');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.lookUpData();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    //onchange api call
    private onDataChange(): void {
        let postParams: Object = {};
        let postDataAdd: Array<string> = [
            'ContractNumber',
            'PremiseNumber',
            'ProductCode'
        ];
        let postDataAddlen: number = postDataAdd.length;
        this.pageParams.isRecordFound = false;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.queryParams.search = this.search;
        for (let i = 0; i < postDataAddlen; i++) {
            let postAddControlName: string = postDataAdd[i];
            if (this.getControlValue(postAddControlName))
                postParams[postAddControlName] = this.getControlValue(postAddControlName);
        }
        postParams['Function'] = 'GetDescriptions';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search, postParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.uiForm.patchValue(data);
                    this.assignInputParams('ContractNumber');
                    this.assignInputParams('PremiseNumber');
                    this.assignInputParams('ProductCode');
                    if (data.ContractName && data.PremiseName && data.ProductDesc)
                        this.lookUpRowId();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public getCurrentPage(currentPage: any): void {
        if (this.pageParams.isRecordFound) {
            this.gridParams.pageCurrent = currentPage.value;
            this.loadGridData();
        }
    }

    public refresh(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.buildGrid();
    }

    //function for ellipsis data received
    public ellipsisData(data: any, cntrlName: string): void {
        this.pageParams.isRecordFound = false;
        if (data) {
            switch (cntrlName) {
                case 'ContractNumber':
                    this.setControlValue('ContractNumber', data.ContractNumber);
                    this.setControlValue('ContractName', data.ContractName);
                    this.assignInputParams('ContractNumber');
                    break;
                case 'PremiseNumber':
                    this.setControlValue('PremiseNumber', data.PremiseNumber);
                    this.setControlValue('PremiseName', data.PremiseName);
                    this.assignInputParams('PremiseNumber');
                    break;
                case 'ProductCode':
                    this.setControlValue('ProductCode', data.ProductCode);
                    this.setControlValue('ProductDesc', data.ProductDesc);
                    this.setControlValue('ServiceCoverRowID', data.row.ttServiceCover);
                    this.assignInputParams('ProductCode');
                    break;
            }
            if (this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber') && this.getControlValue('ProductCode'))
                this.rowIdData();
        }
    }

    //onchange events
    public onContractChange(): void {
        if (this.getControlValue('ContractNumber'))
            this.onDataChange();
        else {
            this.pageParams.isRecordFound = false;
            this.uiForm.reset();
            this.assignInputParams('ContractNumber');
            this.assignInputParams('PremiseNumber');
            this.assignInputParams('ProductCode');
        }
    }
    public onPremiseChange(): void {
        if (this.getControlValue('PremiseNumber'))
            this.onDataChange();
        else {
            this.pageParams.isRecordFound = false;
            this.setControlValue('PremiseName', '');
            this.setControlValue('ProductCode', '');
            this.setControlValue('ProductDesc', '');
            this.assignInputParams('PremiseNumber');
            this.assignInputParams('ProductCode');
        }
    }
    public onProductChange(): void {
        if (this.getControlValue('ProductCode'))
            this.onDataChange();
        else {
            this.pageParams.isRecordFound = false;
            this.setControlValue('ProductDesc', '');
            this.assignInputParams('ProductCode');
        }
    }

    //grid row click function
    public onGridRowClick(rsrcElement: any): void {
        if (this.pageParams.isRecordFound) {
            this.attributes.RowID = this.riGrid.Details.GetAttribute('ChangeProcessed', 'RowID');
            this.attributes.ServiceValueNumber = this.riGrid.Details.GetAttribute('ChangeProcessed', 'AdditionalProperty');
            this.attributes.Processed = this.riGrid.Details.GetValue('ChangeProcessed');
            this.attributes.Effective = this.riGrid.Details.GetValue('ServiceEffectDate');
            this.attributes.Reason = this.riGrid.Details.GetValue('ReasonDesc');
            this.attributes.Employee = this.riGrid.Details.GetValue('Employee');
            this.attributes.AnnualValueChange = this.riGrid.Details.GetValue('AnnualValueChange');
            this.attributes.SalesStatsValue = this.riGrid.Details.GetValue('SalesStatsValue');
            switch (this.riGrid.CurrentColumnName) {
                case 'ChangeProcessed':
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                    break;
            }
        }
    }
}
