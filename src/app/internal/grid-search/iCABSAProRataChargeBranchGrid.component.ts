import { Component, OnInit, Injector, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalMaintenanceSalesModuleRoutes, ContractManagementModuleRoutes } from './../../base/PageRoutes';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { BranchSearchComponent } from './../search/iCABSBBranchSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../search/iCABSAServiceCoverSearch';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { ProRataChargeStatusLanguageSearchComponent } from './../search/iCABSSProRataChargeStatusLanguageSearch';
import { InvoiceCreditReasonLanguageSearchComponent } from './../search/iCABSSInvoiceCreditReasonLanguageSearch.component';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

@Component({
    templateUrl: 'iCABSAProRataChargeBranchGrid.html'
})

export class ProRataChargeBranchGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('branchSearchDropDown') branchSearchDropDown: BranchSearchComponent;
    @ViewChild('langSearchDropDown') langSearchDropDown: ProRataChargeStatusLanguageSearchComponent;
    @ViewChild('invoiceCreditReasonCode') invoiceCreditReasonCode: InvoiceCreditReasonLanguageSearchComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('proRataChargeBPagination') proRataChargeBPagination: PaginationComponent;
    private queryParams: any = {
        module: 'charges',
        operation: 'Application/iCABSAProRataChargeBranchGrid',
        method: 'bill-to-cash/grid'
    };
    private search: URLSearchParams = new URLSearchParams();
    public pageId: string = '';
    public controls: any = [
        { name: 'BranchNumber', type: MntConst.eTypeInteger },
        { name: 'BranchName', type: MntConst.eTypeText },
        { name: 'ProRataChargeStatusCode', type: MntConst.eTypeCode },
        { name: 'ProRataChargeStatusDesc', type: MntConst.eTypeText },
        { name: 'InvoiceCreditReasonCode', type: MntConst.eTypeCode },
        { name: 'InvoiceCreditReasonDesc', type: MntConst.eTypeText },
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText, disabled: true },
        { name: 'DateFilter' },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText, disabled: true },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'DateFrom', required: true, type: MntConst.eTypeDate },
        { name: 'DateTo', required: true, type: MntConst.eTypeDate },
        { name: 'ServiceVisitFrequency', type: MntConst.eTypeInteger, disabled: true },
        { name: 'InvoiceCreditCode' },
        { name: 'ServiceCoverRowID' }
    ];
    public dropdown: any = {
        invoiceCreditReasonCode: {
            isRequired: false,
            isDisabled: false,
            isTriggerValidate: false,
            params: {
                parentMode: 'LookUp-All'
            },
            isActive: {
                id: '',
                text: ''
            },
            displayFields: ['InvoiceCreditReasonLang.InvoiceCreditReasonCode', 'InvoiceCreditReasonLang.InvoiceCreditReasonDesc']
        }
    };
    public inputParams: any = {
        branchParams: {
            'parentMode': 'LookUp'
        },
        contractParams: {
            'parentMode': 'LookUp',
            'showAddNew': false
        },
        premiseParams: {
            'parentMode': 'LookUp',
            'ContractNumber': '',
            'ContractName': ''
        },
        serviceCoverSearchParams: {
            'parentMode': 'LookUp',
            'ContractNumber': '',
            'ContractName': '',
            'PremiseNumber': '',
            'PremiseName': ''
        }
    };
    public langSelected: Object = {
        id: '',
        text: ''
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
        this.pageId = PageIdentifier.ICABSAPRORATACHARGEBRANCHGRID;
        this.pageTitle = this.browserTitle = 'Pro Rata Charge Summary';
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
            if (this.getControlValue('BranchNumber')) {
                this.branchSearchDropDown.active = {
                    id: this.getControlValue('BranchNumber'),
                    text: this.getControlValue('BranchNumber') + ' - ' + this.getControlValue('BranchName')
                };
            }
            if (this.getControlValue('ProRataChargeStatusCode')) {
                this.langSearchDropDown.active = {
                    id: this.getControlValue('ProRataChargeStatusCode'),
                    text: this.getControlValue('ProRataChargeStatusCode') + ' - ' + this.getControlValue('ProRataChargeStatusDesc')
                };
            }
            if (this.getControlValue('InvoiceCreditReasonCode')) {
                this.invoiceCreditReasonCode.active = {
                    id: this.getControlValue('InvoiceCreditReasonCode'),
                    text: this.getControlValue('InvoiceCreditReasonCode') + ' - ' + this.getControlValue('InvoiceCreditReasonDesc')
                };
            }
        } else {
            this.windowOnLoad();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        this.branchSearchDropDown.active = {
            id: this.utils.getBranchCode(),
            text: this.utils.getBranchText()
        };
        let branchName: Array<string> = this.utils.getBranchText().split('-');
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.setControlValue('BranchName', branchName[1]);
        let firstDay = this.globalize.parseDateToFixedFormat(new Date(new Date().getFullYear(), 0, 1)).toString();
        this.setControlValue('DateFrom', this.globalize.parseDateStringToDate(firstDay));
        this.setControlValue('DateTo', this.utils.TodayAsDDMMYYYY());
        this.setControlValue('InvoiceCreditCode', 'All');
        this.setControlValue('DateFilter', 'Effective');
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ContractNumber', 'ProRataCharge', 'ContractNumber', MntConst.eTypeCode, 11, true);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNumber', 'ProRataCharge', 'PremiseNumber', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ProductCode', 'ProRataCharge', 'ProductCode', MntConst.eTypeCode, 6, true);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceVisitFrequency', 'ProRataCharge', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceBranchNumber', 'ProRataChargeSummary', 'ServiceBranchNumber', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('ServiceBranchNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('StartDate', 'ProRataChargeSummary', 'StartDate', MntConst.eTypeDate, 10, true);
        this.riGrid.AddColumnAlign('StartDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('EndDate', 'ProRataChargeSummary', 'EndDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('EndDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('InvoiceGroupNumber', 'ProRataChargeSummary', 'InvoiceGroupNumber', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('InvoiceGroupNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('InvoiceCreditDesc', 'ProRataChargeSummary', 'InvoiceCreditDesc', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('InvoiceCreditDesc', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('InvoiceCreditReasonDesc', 'ProRataChargeSummary', 'InvoiceCreditReasonDesc', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('ProRataChargeValue', 'ProRataChargeSummary', 'ProRataChargeValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('ProRataChargeValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ServiceQuantity', 'ProRataChargeSummary', 'ServiceQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('TaxCode', 'ProRataChargeSummary', 'TaxCode', MntConst.eTypeCode, 2);
        this.riGrid.AddColumnAlign('TaxCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ProRataChargeStatusDesc', 'ProRataChargeSummary', 'ProRataChargeStatusDesc', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('ProRataChargeStatusDesc', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('StartDate', true);
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
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.search.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set('DateFrom', this.getControlValue('DateFrom'));
        this.search.set('DateTo', this.getControlValue('DateTo'));
        this.search.set('BranchNumber', this.getControlValue('BranchNumber'));
        this.search.set('InvoiceCreditCode', this.getControlValue('InvoiceCreditCode'));
        this.search.set('ProRataChargeStatusCode', this.getControlValue('ProRataChargeStatusCode'));
        this.search.set('InvoiceCreditReasonCode', this.getControlValue('InvoiceCreditReasonCode'));
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('ProductCode', this.getControlValue('ProductCode'));
        this.search.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        this.search.set('DateFilter', this.getControlValue('DateFilter'));
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
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
                this.pageParams.isPremiseNum = this.getControlValue('PremiseNumber') !== '' ? true : false;
                this.inputParams.serviceCoverSearchParams.parentMode = this.getControlValue('PremiseNumber') !== '' ? 'LookUp' : 'LookUp-Freq';
                this.inputParams.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
                this.inputParams.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
                break;
            case 'ProductCode':
                this.inputParams.serviceCoverSearchParams.ProductCode = this.getControlValue('ProductCode');
                this.inputParams.serviceCoverSearchParams.ProductDesc = this.getControlValue('ProductDesc');
                break;
        }
    }

    public getCurrentPage(currentPage: any): void {
        this.gridParams.pageCurrent = currentPage.value;
        this.loadGridData();
    }

    public riGridSort(event: any): void {
        this.loadGridData();
    }

    public refresh(): void {
        this.gridParams.pageCurrent = 1;
        this.buildGrid();
    }

    public ellipsisData(data: any): void {
        if (data) {
            if (data.ProductCode) {
                this.setControlValue('ProductCode', data.ProductCode);
                this.setControlValue('ProductDesc', data.ProductDesc);
                this.setControlValue('ServiceVisitFrequency', data.row.ServiceVisitFrequency);
                this.assignInputParams('ProductCode');
            }
            else if (data.PremiseNumber) {
                this.setControlValue('PremiseNumber', data.PremiseNumber);
                this.setControlValue('PremiseName', data.PremiseName);
                this.assignInputParams('PremiseNumber');
            }
            else if (data.ContractNumber) {
                this.setControlValue('ContractNumber', data.ContractNumber);
                this.setControlValue('ContractName', data.ContractName);
                this.assignInputParams('ContractNumber');
            }
            this.riGrid.HeaderClickedColumn = '';
            this.riGrid.DescendingSort = true;
        }
    }

    public onContractDataChange(): void {
        this.riGrid.HeaderClickedColumn = '';
        this.riGrid.DescendingSort = true;
        if (this.getControlValue('ContractNumber')) {
            this.onDataChange();
        } else {
            this.setControlValue('ContractNumber', '');
            this.setControlValue('ContractName', '');
            this.setControlValue('PremiseNumber', '');
            this.setControlValue('PremiseName', '');
            this.assignInputParams('ContractNumber');
            this.assignInputParams('PremiseNumber');
        }
    }

    public onPremiseDataChange(): void {
        this.riGrid.HeaderClickedColumn = '';
        this.riGrid.DescendingSort = true;
        if (this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber')) {
            this.onDataChange();
        } else {
            this.setControlValue('PremiseNumber', '');
            this.setControlValue('PremiseName', '');
            this.assignInputParams('PremiseNumber');
        }
    }

    public onProductDataChange(): void {
        this.riGrid.HeaderClickedColumn = '';
        this.riGrid.DescendingSort = true;
        if (this.getControlValue('ProductCode')) {
            this.onDataChange();
        } else {
            this.setControlValue('ProductDesc', '');
            this.assignInputParams('ProductCode');
        }
    }

    public onBranchDataReceived(data: any): void {
        this.riGrid.HeaderClickedColumn = '';
        this.riGrid.DescendingSort = true;
        if (data['BranchNumber']) {
            this.setControlValue('BranchNumber', data['BranchNumber']);
            this.setControlValue('BranchName', data['BranchName']);
        } else {
            this.setControlValue('BranchNumber', '');
            this.setControlValue('BranchName', '');
        }
    }

    public onPCStatusCodeReceived(data: any): void {
        this.riGrid.HeaderClickedColumn = '';
        this.riGrid.DescendingSort = true;
        if (data['ProRataChargeStatusLang.ProRataChargeStatusCode']) {
            this.setControlValue('ProRataChargeStatusCode', data['ProRataChargeStatusLang.ProRataChargeStatusCode']);
            this.setControlValue('ProRataChargeStatusDesc', data['ProRataChargeStatusLang.ProRataChargeStatusDesc']);
        } else {
            this.setControlValue('ProRataChargeStatusCode', '');
            this.setControlValue('ProRataChargeStatusDesc', '');
        }
    }

    public onDataChange(): void {
        let postParams: Object = {};
        let postDataAdd: Array<string> = [
            'BranchNumber',
            'ProRataChargeStatusCode',
            'InvoiceCreditReasonCode',
            'ContractNumber',
            'PremiseNumber',
            'ProductCode',
            'ServiceCoverRowID'
        ];
        let postDataAddlen: number = postDataAdd.length;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.queryParams.search = this.search;
        for (let i = 0; i < postDataAddlen; i++) {
            let postAddControlName: string = postDataAdd[i];
            if (this.getControlValue(postAddControlName))
                postParams[postAddControlName] = this.getControlValue(postAddControlName);
        }
        postParams['Function'] = 'SetDisplayFields';
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
                    if (data['ServiceVisitFrequency'] && data['ServiceVisitFrequency'] === '0')
                        this.setControlValue('ServiceVisitFrequency', '');
                    this.assignInputParams('ContractNumber');
                    this.assignInputParams('PremiseNumber');
                    this.assignInputParams('ProductCode');
                } this.isRequesting = false;
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public onGridRowClick(data: any): void {
        this.attributes.ContractNumber = this.riGrid.Details.GetValue('ContractNumber') ? this.riGrid.Details.GetValue('ContractNumber').substr(2, 10) : '';
        this.attributes.PremiseNumber = this.riGrid.Details.GetValue('PremiseNumber');
        this.attributes.ProductCode = this.riGrid.Details.GetValue('ProductCode');
        this.attributes.StartDate = this.riGrid.Details.GetValue('StartDate');
        this.attributes.ContractRowID = this.riGrid.Details.GetAttribute('ContractNumber', 'rowID');
        this.attributes.PremiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'rowID');
        this.attributes.ServiceCoverRowID = this.riGrid.Details.GetAttribute('ProductCode', 'rowID');
        this.attributes.ProRataChargeRowID = this.riGrid.Details.GetAttribute('StartDate', 'rowID');
        this.attributes.ContractTypeCode = this.riGrid.Details.GetAttribute('ServiceVisitFrequency', 'AdditionalProperty');
        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNumber':
                this.navigate('ProRataCharge', ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    ContractNumber: this.attributes.ContractNumber,
                    RowID: this.attributes.ContractRowID,
                    currentContractTypeURLParameter: this.attributes.ContractTypeCode
                });
                break;
            case 'PremiseNumber':
                this.navigate('ProRataCharge', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    ContractNumber: this.attributes.ContractNumber,
                    PremiseNumber: this.attributes.PremiseNumber,
                    ProductCode: this.attributes.ProductCode,
                    RowID: this.attributes.PremiseRowID,
                    currentContractTypeURLParameter: this.attributes.ContractTypeCode
                });
                break;
            case 'ProductCode':
                this.navigate('ProRataCharge', ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    ContractNumber: this.attributes.ContractNumber,
                    PremiseNumber: this.attributes.PremiseNumber,
                    RowID: this.attributes.ServiceCoverRowID,
                    currentContractTypeURLParameter: this.attributes.ContractTypeCode
                });
                break;
            case 'StartDate':
                this.navigate('ProRataCharge', InternalMaintenanceSalesModuleRoutes.ICABSAPRORATACHARGEMAINTENANCE, {
                    ContractNumber: this.attributes.ContractNumber,
                    PremiseNumber: this.attributes.PremiseNumber,
                    ProductCode: this.attributes.ProductCode,
                    ProRataChargeROWID: this.attributes.ProRataChargeRowID,
                    currentContractTypeURLParameter: this.attributes.ContractTypeCode
                });
                break;
        }
    }

    public invoiceCreditReasonCodeSelected(data: any): void {
        if (data) {
            this.riGrid.HeaderClickedColumn = '';
            this.riGrid.DescendingSort = true;
            this.setControlValue('InvoiceCreditReasonCode', data['InvoiceCreditReasonLang.InvoiceCreditReasonCode'] || '');
            this.setControlValue('InvoiceCreditReasonDesc', data['InvoiceCreditReasonLang.InvoiceCreditReasonDesc'] || '');
        }
    }
}
