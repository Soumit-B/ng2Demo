import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractManagementModuleRoutes, InternalMaintenanceApplicationModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { AccountSearchComponent } from './../search/iCABSASAccountSearch';
import { GroupAccountNumberComponent } from './../search/iCABSSGroupAccountNumberSearch';


@Component({
    templateUrl: 'iCABSAInvoiceByAccountGrid.html'
})

export class InvoiceByAccountGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;

    private queryParams: Object = {
        operation: 'Application/iCABSAInvoiceByAccountGrid',
        module: 'report',
        method: 'bill-to-cash/grid'
    };
    public gridParams: Object = {
        totalRecords: 0,
        itemsPerPage: 10,
        currentPage: 1,
        pageCurrent: 1,
        riGridMode: 0
    };
    public controls: any[] = [
        { name: 'AccountNumber', type: MntConst.eTypeText },
        { name: 'AccountName', disabled: true },
        { name: 'GroupAccountNumber', type: MntConst.eTypeInteger },
        { name: 'GroupName', disabled: true },
        { name: 'StartDate', type: MntConst.eTypeDate },
        { name: 'EndDate', type: MntConst.eTypeDate },
        { name: 'ExtractRunNumber', type: MntConst.eTypeInteger }
    ];
    public ellipsis: any = {
        accountNumber: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Lookup-UpdateParent',
                'showAddNewDisplay': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: AccountSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        groupAccountNumber: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Lookup-UpdateParent'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: GroupAccountNumberComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        extractRunNumber: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'ExtractNumber'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ScreenNotReadyComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }

    };

    public pageId: string = '';
    public isHidePagination: boolean = true;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICEBYACCOUNTGRID;
        this.browserTitle = this.pageTitle = 'Invoice by Account';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.gridRefresh();
            this.riGridBeforeExecute();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public riGridBeforeExecute(): boolean {
        let isNumberValid: boolean, isDateValid: boolean, isReturn: boolean;

        isNumberValid = false;
        isDateValid = false;
        isReturn = false;
        this.enableFields();
        if ((this.getControlValue('AccountNumber') === '') && (this.getControlValue('GroupAccountNumber') === '')) {
            this.pageParams.isAccount = true;
            this.pageParams.isGroupAccount = true;
            this.uiForm.controls['AccountNumber'].markAsTouched();
            this.uiForm.controls['GroupAccountNumber'].markAsTouched();
            isNumberValid = false;
        } else {
            this.pageParams.isAccount = false;
            this.pageParams.isGroupAccount = false;
            this.uiForm.controls['AccountNumber'].markAsUntouched();
            this.uiForm.controls['GroupAccountNumber'].markAsUntouched();
            isNumberValid = true;
        }
        if ((this.getControlValue('StartDate')) && (this.getControlValue('EndDate'))) {
            this.pageParams.isStartDate = true;
            this.pageParams.isEndDate = true;
            isDateValid = true;
        } else if ((this.getControlValue('StartDate') === '') && (this.getControlValue('EndDate') === '')) {
            this.pageParams.isStartDate = false;
            this.pageParams.isEndDate = false;
            this.uiForm.controls['StartDate'].markAsUntouched();
            this.uiForm.controls['EndDate'].markAsUntouched();
            isDateValid = true;
        }
        else {
            this.pageParams.isStartDate = true;
            this.pageParams.isEndDate = true;
            this.uiForm.controls['StartDate'].markAsTouched();
            this.uiForm.controls['EndDate'].markAsTouched();
            isDateValid = false;
        }
        if (isNumberValid && isDateValid)
            isReturn = true;
        return isReturn;
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('CompanyCode', 'InvoiceHeader', 'CompanyCode', MntConst.eTypeCode, 2, false);
        this.riGrid.AddColumn('InvoiceNumber', 'InvoiceHeader', 'InvoiceNumber', MntConst.eTypeInteger, 10, true);
        this.riGrid.AddColumn('GroupAccountNumber', 'InvoiceHeader', 'GroupAccountNumber', MntConst.eTypeInteger, 9);
        this.riGrid.AddColumn('AccountNumber', 'InvoiceHeader', 'AccountNumber', MntConst.eTypeText, 9);
        this.riGrid.AddColumn('InvoiceGroupNumber', 'InvoiceHeader', 'InvoiceGroupNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('ExtractDate', 'InvoiceHeader', 'ExtractDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('PeriodStart', 'InvoiceHeader', 'PeriosStart', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('TaxPointDate', 'InvoiceHeader', 'TaxPointDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('AdvanceInvoice', 'InvoiceHeader', 'AdvanceInvoice', MntConst.eTypeImage, 1);
        this.riGrid.AddColumn('ValueExclTax', 'InvoiceHeader', 'ValueExclTax', MntConst.eTypeText, 10, true);
        this.riGrid.AddColumn('TaxValue', 'InvoiceHeader', 'TaxValue', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('InvoiceName', 'InvoiceHeader', 'InvoiceName', MntConst.eTypeText, 15, true);
        this.riGrid.AddColumn('PrintImage', 'InvoiceHeader', 'PrintImage', MntConst.eTypeImage, 1, true);
        this.riGrid.AddColumnAlign('CompanyCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('InvoiceNumber', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('InvoiceGroupNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('AdvanceInvoice', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('ValueExclTax', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('TaxValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('PrintImage', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.riGrid.RefreshRequired();
        this.loadGridData();
    }

    public loadGridData(): void {
        let search: URLSearchParams;

        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('AccountNumber', this.getControlValue('AccountNumber'));
        search.set('GroupAccountNumber', this.getControlValue('GroupAccountNumber'));
        search.set('StartDate', this.getControlValue('StartDate'));
        search.set('EndDate', this.getControlValue('EndDate'));
        search.set('ExtractRunNumber', this.getControlValue('ExtractRunNumber'));
        search.set(this.serviceConstants.GridMode, this.gridParams['riGridMode']);
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.PageSize, this.gridParams['itemsPerPage']);
        search.set(this.serviceConstants.PageCurrent, this.gridParams['pageCurrent']);
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.gridParams['pageCurrent'] = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridParams['totalRecords'] = data.pageData ? data.pageData.lastPageNumber * this.gridParams['itemsPerPage'] : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.Execute(data);
                    if (data.pageData && (data.pageData.lastPageNumber * 10) > 0)
                        this.isHidePagination = false;
                    else
                        this.isHidePagination = true;
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public onGridDblClick(data: any): void {
        let params: any = {
            'InvoiceNumber': this.globalize.parseIntegerToFixedFormat(this.riGrid.Details.GetValue('InvoiceNumber')),
            'SystemInvoiceNumber': this.riGrid.Details.GetAttribute('CompanyCode', 'additionalproperty'),
            'InvoiceName': this.riGrid.Details.GetValue('InvoiceName'),
            'AccountNumber': this.riGrid.Details.GetValue('AccountNumber'),
            'AccountName': this.riGrid.Details.GetAttribute('AccountNumber', 'additionalproperty'),
            'InvoiceGroupNumber': this.riGrid.Details.GetValue('InvoiceGroupNumber'),
            'InvoiceGroupDesc': this.riGrid.Details.GetAttribute('InvoiceGroupNumber', 'additionalproperty'),
            'CompanyCode': this.riGrid.Details.GetValue('CompanyCode'),
            'CompanyDesc': this.riGrid.Details.GetAttribute('CompanyCode', 'title')
        };
        switch (this.riGrid.CurrentColumnName) {
            case 'InvoiceNumber':
                this.navigate('InvoiceGroup', ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID, params);
                break;
            case 'InvoiceName':
                this.navigate('InvoiceAddressDetails', InternalMaintenanceApplicationModuleRoutes.ICABSAINVOICEHEADERADDRESSDETAILS, {
                    'InvoiceNumber': this.globalize.parseIntegerToFixedFormat(this.riGrid.Details.GetValue('InvoiceNumber')),
                    'InvoiceHeaderRowID': this.riGrid.Details.GetAttribute('InvoiceNumber', 'rowid')
                });
                break;
            case 'ValueExclTax':
                this.navigate('InvoiceGroup', InternalGridSearchSalesModuleRoutes.ICABSACONTRACTINVOICETURNOVERGRID, params);
                break;
            case 'PrintImage':
                this.attributes.RowID = this.riGrid.Details.GetAttribute('InvoiceNumber', 'rowid');
                this.invoicePrint(this.attributes.RowID);
                break;
        }
    }

    public getCurrentPage(currentPage: any): void {
        this.gridParams['pageCurrent'] = currentPage.value;
        this.riGrid.RefreshRequired();
        this.buildGrid();
    }

    public gridRefresh(): void {
        this.riGrid.RefreshRequired();
        if (this.riGridBeforeExecute()) {
            this.buildGrid();
        }
    }

    public invoicePrint(rowID: string): void {
        let search: URLSearchParams, formdata: Object = {};

        this.ajaxSource.next(this.ajaxconstant.START);
        search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        formdata['InvoiceNumber'] = this.riGrid.Details.GetAttribute('InvoiceNumber', 'rowid');
        formdata['Function'] = 'Single';
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], search, formdata)
            .subscribe(
            (res) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (res.hasError) {
                    if (res.fullError.indexOf('iCABSAInvoiceReprintMaintenance.htm') >= 0) {
                        let tempList: any, params: any;

                        tempList = res.fullError.split('?');
                        if (tempList && tempList.length > 1) {
                            params = new URLSearchParams(tempList[1]);
                            this.navigate('', InternalMaintenanceApplicationModuleRoutes.ICABSAINVOICEREPRINTMAINTENANCE,
                                {
                                    'InvoiceNumber': params.get('InvoiceNumber'),
                                    'InvoiceRowId': rowID
                                });
                        }
                    } else {
                        window.open(res.fullError, '_blank');
                    }
                } else {
                    window.open(res.url, '_blank');
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public onEllipsisDataBlur(): void {
        if (this.getControlValue('AccountNumber')) {
            this.onEllipsisDataChange('AccountNumber');
            return;
        }
        if (this.getControlValue('GroupAccountNumber')) {
            this.onEllipsisDataChange('GroupAccountNumber');
            return;
        }
        this.setControlValue('GroupAccountNumber', '');
        this.setControlValue('GroupName', '');
        this.setControlValue('AccountNumber', '');
        this.setControlValue('AccountName', '');
        this.enableFields();
    }

    public onEllipsisDataChange(data: string): void {
        let str: any, name: any, search: URLSearchParams, formdata: Object = {};

        this.ajaxSource.next(this.ajaxconstant.START);
        str = data;
        name = (str === 'AccountNumber') ? 'AccountName' : 'GroupName';
        search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        formdata['fn'] = (str === 'AccountNumber') ? 'AccountName' : 'GroupName';
        formdata[str] = this.getControlValue(str);

        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], search, formdata)
            .subscribe(
            (res) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (res.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage, res.fullError));
                }
                else {
                    this.setControlValue(name, res[name]);
                    this.riGridBeforeExecute();
                    this.enableFields();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public enableFields(): void {
        if (this.getControlValue('ExtractRunNumber') === '') {
            this.disableControl('StartDate', false);
            this.disableControl('EndDate', false);
        } else {
            this.setControlValue('StartDate', '');
            this.setControlValue('EndDate', '');
            this.disableControl('StartDate', true);
            this.disableControl('EndDate', true);
        }
        if (this.getControlValue('AccountNumber') === '') {
            this.disableControl('GroupAccountNumber', false);
            this.pageParams.groupAccountEllipsis = false;
        } else {
            this.setControlValue('GroupAccountNumber', '');
            this.disableControl('GroupAccountNumber', true);
            this.pageParams.groupAccountEllipsis = true;
        }
        if (this.getControlValue('GroupAccountNumber') === '') {
            this.disableControl('AccountNumber', false);
            this.pageParams.accountEllipsis = false;
        } else {
            this.setControlValue('AccountNumber', '');
            this.disableControl('AccountNumber', true);
            this.pageParams.accountEllipsis = true;
        }
        if ((this.getControlValue('StartDate') === '') && (this.getControlValue('EndDate') === '')) {
            this.pageParams.isStartDate = false;
            this.pageParams.isEndDate = false;
        }
    }


    public onAccountNumberRecieved(data: any): void {
        if (data) {
            this.setControlValue('AccountNumber', data.AccountNumber);
            this.setControlValue('AccountName', data.AccountName);
        } else {
            this.setControlValue('AccountNumber', '');
            this.setControlValue('AccountName', '');
        }
        this.enableFields();
    }

    public onGroupAccountNumberRecieved(data: any): void {
        if (data) {
            this.setControlValue('GroupAccountNumber', data.GroupAccountNumber);
            this.setControlValue('GroupName', data.GroupName);
        } else {
            this.setControlValue('GroupAccountNumber', '');
            this.setControlValue('GroupName', '');
        }
        this.enableFields();
    }

    public onExtractNumberRecieved(data: any): void {
        if (data) {
            this.setControlValue('ExtractRunNumber', data.ExtractRunNumber);
        } else {
            this.setControlValue('ExtractRunNumber', '');
        }
        this.enableFields();
    }

    public startDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('StartDate', value.value);
            this.setControlValue('ExtractRunNumber', '');
            this.disableControl('ExtractRunNumber', true);
            this.pageParams.extractRunEllipsis = true;
        }
        else {
            this.setControlValue('StartDate', '');
            this.setControlValue('EndDate', '');
            this.disableControl('ExtractRunNumber', false);
            this.pageParams.isStartDate = false;
            this.pageParams.isEndDate = false;
            this.pageParams.extractRunEllipsis = false;
        }
        this.enableFields();
    }

    public endDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('EndDate', value.value);
        }
        else {
            this.setControlValue('EndDate', '');
        }
        this.enableFields();
    }
}
