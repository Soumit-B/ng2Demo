import { Component, OnInit, Injector, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/takeWhile';

import { InternalSearchModuleRoutes } from './../../base/PageRoutes';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';

@Component({
    templateUrl: 'iCABSBInvoiceRunDateSelectPrint.html'
})

export class InvoiceRunDateSelectPrintComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('invoiceRunDatPagination') invoiceRunDatPagination: PaginationComponent;

    private queryParamValues: any;
    private searchParams: any = {
        'InvoiceNumberFirst': '',
        'InvoiceNumberLast': ''
    };
    private querySubscription: Subscription;
    private vbParameterCount: number = 0;
    private isSCEnableNextInvoiceNumberEntry: boolean = false;
    private isAlive: boolean = true;

    public pageId: string = '';
    public controls: any = [];
    public pageTitle: string = 'Invoice Print';
    private queryParams: any = {
        operation: 'Business/iCABSBInvoiceRunDateSelectPrint',
        module: 'invoicing',
        method: 'bill-to-cash/maintenance'
    };
    public tableheading: string = 'Invoice Run Date';
    public pageCurrent: number = 1;
    public itemsPerPage: number = 10;
    public columns: Array<any>;
    public search: URLSearchParams = new URLSearchParams();
    public pageSize: number = 10;
    public inputParams: any = {};
    public totalRecords: number;
    public maxColumn: number = 9;

    constructor(injector: Injector,
        private _router: Router,
        private route: ActivatedRoute,
        private elem: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBINVOICERUNDATESELECTPRINT;
        this.pageTitle = 'Invoice Print';
        this.browserTitle = 'Submit Invoice Run Print Selection';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setLevels();
        this.initSysCharParams();
        this.querySubscription = this.route.queryParams.subscribe(params => {
            this.queryParamValues = params;
            if (params['InvoiceNumberFirst']) {
                this.searchParams['InvoiceNumberFirst'] = params['InvoiceNumberFirst'];
            }
            if (params['InvoiceNumberLast']) {
                this.searchParams['InvoiceNumberLast'] = params['InvoiceNumberLast'];
            }
            this.search = this.getURLSearchParamObject();
        });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.doCleanUp();
    }

    private doCleanUp(): void {
        this.serviceConstants = null;
        this.httpService = null;
        this.errorService = null;
        this.utils = null;
        this.ajaxSource = null;
        this.isAlive = false;
    }

    private getSysCharDtetails(): void {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableNextInvoiceNumberEntryBeforeInvoiceRun,
            this.sysCharConstants.SystemCharSortInvoicesByCompanyCode,
            this.sysCharConstants.SystemCharSortInvoicesByInvoiceRange
        ];
        let sysCharIP: any = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            if (record[0] && record[0]['Required']) {
                this.pageParams.vSCEnableNextInvoiceNumberEntry = record[0]['Required'];
                this.isSCEnableNextInvoiceNumberEntry = this.pageParams.vSCEnableNextInvoiceNumberEntry;
            }
            if (record[1] && record[1]['Required']) {
                this.pageParams.vSCSortInvoicesByCompanyCode = record[1]['Required'];
            }
            if (record[2] && record[2]['Required']) {
                this.pageParams.vSCSortInvoicesByInvoiceRange = record[2]['Required'];
            }
            this.buildGrid();
        }, (error) => {
            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        });
    }

    private setLevels(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let levelSearch: URLSearchParams = this.getURLSearchParamObject();
        levelSearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        levelSearch.set(this.serviceConstants.CountryCode, this.countryCode());
        levelSearch.set(this.serviceConstants.Action, '0');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, levelSearch)
            .takeWhile(() => this.isAlive)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.pageParams.vbIRCompanyLevel = data.CompanyLevel;
                    this.pageParams.vbIRBranchLevel = data.BranchLevel;
                    this.pageParams.vbIRTaxCodeLevel = data.TaxCodeLevel;
                    this.pageParams.vbIRContractTypeLevel = data.ContractType;
                    this.pageParams.vbIRInvoiceCreditLevel = data.InvoiceCreditLevel;
                    this.getSysCharDtetails();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    private initSysCharParams(): void {
        this.pageParams.vbIRCompanyLevel = false;
        this.pageParams.vbIRBranchLevel = false;
        this.pageParams.vbIRTaxCodeLevel = false;
        this.pageParams.vbIRInvoiceCreditLevel = false;
        this.pageParams.vbIRContractTypeLevel = false;
        this.pageParams.vSCSortInvoicesByCompanyCode = false;
        this.pageParams.vSCSortInvoicesByInvoiceRange = false;
    }

    private displayErrorMessage(errorNumber: number): void {
        let errorSearchParams: any = this.getURLSearchParamObject();
        errorSearchParams.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        errorSearchParams.set('errornumber', errorNumber);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, errorSearchParams)
            .takeWhile(() => this.isAlive)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        this.riGrid.RefreshRequired();
        this.loadData();
    }
    public getGridInfo(info: any): void {
        this.invoiceRunDatPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    }

    public refresh(): void {
        this.riGrid.Update = true;
        this.loadData();
    }

    public buildGrid(): void {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.Clear();
        if (this.pageParams.vSCSortInvoicesByInvoiceRange) {
            if (this.pageParams.vbIRCompanyLevel) {
                this.vbParameterCount += 1;
                this.riGrid.AddColumn('CompanyCode', 'InvoiceRange', 'CompanyCode', MntConst.eTypeText, 2, false);
            }

            if (this.pageParams.vbIRBranchLevel) {
                this.vbParameterCount += 1;
                this.riGrid.AddColumn('BranchNumber', 'InvoiceRange', 'BranchNumber', MntConst.eTypeText, 2, false);
            }

            if (this.pageParams.vbIRTaxCodeLevel) {
                this.vbParameterCount += 1;
                this.riGrid.AddColumn('TaxCode', 'InvoiceRange', 'TaxCode', MntConst.eTypeText, 2, false);
            }

            if (this.pageParams.vbIRInvoiceCreditLevel) {
                this.vbParameterCount += 1;
                this.riGrid.AddColumn('InvoiceCreditCode', 'InvoiceRange', 'InvoiceCreditCode', MntConst.eTypeText, 1, false);
            }

            if (this.pageParams.vbIRContractTypeLevel) {
                this.vbParameterCount += 1;
                this.riGrid.AddColumn('ContractTypeCode', 'InvoiceRange', 'ContractTypeCode', MntConst.eTypeText, 1, false);
            }

            this.riGrid.AddColumn('InvoiceRangeDesc', 'InvoiceRange', 'InvoiceRangeDesc', MntConst.eTypeText, 30, false);

        } else {

            this.riGrid.AddColumn('CompanyCode', 'Company', 'CompanyCode', MntConst.eTypeText, 2, false);
            this.riGrid.AddColumn('CompanyDesc', 'Company', 'CompanyDesc', MntConst.eTypeText, 30, false);

            if (this.isSCEnableNextInvoiceNumberEntry) {
                this.riGrid.AddColumn('InvoiceCreditCode', 'Company', 'InvoiceCreditCode', MntConst.eTypeText, 2, false);
            }

        }

        this.riGrid.AddColumn('FirstInvoiceNumber', 'Company', 'FirstInvoiceNumber', MntConst.eTypeInteger, 10, false);
        this.riGrid.AddColumn('LastInvoiceNumber', 'Company', 'LastInvoiceNumber', MntConst.eTypeInteger, 10, false);
        this.riGrid.AddColumn('PrintImage', 'InvoiceRunDate', 'PrintImage', MntConst.eTypeImage, 1, false);
        this.riGrid.AddColumnAlign('PrintImage', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.loadData();
    }

    public loadData(): void {
        let formdData: any = {};
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        formdData[this.serviceConstants.Function] = 'Company';
        formdData['FirstInvoice'] = this.searchParams['InvoiceNumberFirst'];
        formdData['LastInvoice'] = this.searchParams['InvoiceNumberLast'];
        formdData['SCSortInvoicesByCompanyCode'] = this.pageParams.vSCSortInvoicesByCompanyCode;
        formdData['SCSortInvoicesByInvoiceRange'] = this.pageParams.vSCSortInvoicesByInvoiceRange;
        formdData['IRCompanyLevel'] = this.pageParams.vbIRCompanyLevel.toString();
        formdData['IRBranchLevel'] = this.pageParams.vbIRBranchLevel.toString();
        formdData['IRTaxCodeLevel'] = this.pageParams.vbIRTaxCodeLevel.toString();
        formdData['IRInvoiceCreditLevel'] = this.pageParams.vbIRInvoiceCreditLevel.toString();
        formdData['IRContractTypeLevel'] = this.pageParams.vbIRContractTypeLevel.toString();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, '');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, formdData)
            .takeWhile(() => this.isAlive)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    try {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        if (this.riGrid.Update) {
                            this.riGrid.UpdateHeader = true;
                            this.riGrid.UpdateBody = true;
                            this.riGrid.UpdateFooter = true;
                        }
                        this.riGrid.Execute(data);
                    } catch (e) {
                        this.logger.log(' Problem in grid load', e);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );

    }

    public onGridRowDblClick(event: any): void {
        switch (this.riGrid.CurrentColumnName) {
            case 'PrintImage':
                if (event.target.tagName === 'IMG') {
                    let gridObj: any = this.riGrid.Details;
                    let startInvoiceNumberVal: string = '', endInvoiceNumberVal: string = '', startVisualInvoiceNumberVal: string = '', endVisualInvoiceNumberVal: string = '';
                    let invoiceCreditCodeVal: string = '', taxCodeVal: string = '';
                    startInvoiceNumberVal = gridObj.GetAttribute('FirstInvoiceNumber', 'AdditionalProperty');
                    endInvoiceNumberVal = gridObj.GetAttribute('LastInvoiceNumber', 'AdditionalProperty');
                    startVisualInvoiceNumberVal = gridObj.GetValue('FirstInvoiceNumber');
                    endVisualInvoiceNumberVal = gridObj.GetValue('LastInvoiceNumber');
                    if (this.pageParams.vSCSortInvoicesByInvoiceRange) {
                        invoiceCreditCodeVal = gridObj.GetAttribute('InvoiceCreditCode', 'AdditionalProperty');
                        taxCodeVal = gridObj.GetValue('TaxCode');
                    }
                    if (this.pageParams.vSCEnableNextInvoiceNumberEntry) {
                        startVisualInvoiceNumberVal = gridObj.GetValue('FirstInvoiceNumber');
                        endVisualInvoiceNumberVal = gridObj.GetValue('LastInvoiceNumber');
                        invoiceCreditCodeVal = gridObj.GetAttribute('InvoiceCreditCode', 'AdditionalProperty');
                    }

                    let queryParamsData: any = {
                        companyCode: gridObj.GetValue('CompanyCode'),
                        branchNumber: gridObj.GetValue('BranchNumber'),
                        taxCode: taxCodeVal,
                        invoiceCreditCode: invoiceCreditCodeVal,
                        contractTypeCode: gridObj.GetValue('ContractTypeCode'),
                        startInvoiceNumber: startInvoiceNumberVal,
                        endInvoiceNumber: endInvoiceNumberVal,
                        startVisualInvoiceNumber: startVisualInvoiceNumberVal,
                        endVisualInvoiceNumber: endVisualInvoiceNumberVal
                    };
                    let tempRange: any = {}, companyCodeElem: any;
                    let additionaldata: any = gridObj.GetAttribute('PrintImage', 'AdditionalProperty');
                    tempRange = additionaldata.split(',');
                    if (tempRange) {
                        companyCodeElem = this.elem.nativeElement.querySelector('#CompanyCode');
                        companyCodeElem.setAttribute('InvoiceNumberFirst', tempRange[0]);
                        companyCodeElem.setAttribute('InvoiceNumberLast', tempRange[1]);
                    }
                    this.router.navigate([InternalSearchModuleRoutes.ICABSBINVOICERUNDATESELECTPRINT2], {
                        queryParams: {
                            CompanyCode: queryParamsData['companyCode'],
                            BranchNumber: queryParamsData['branchNumber'],
                            TaxCode: queryParamsData['taxCode'],
                            InvoiceCreditCode: queryParamsData['invoiceCreditCode'],
                            ContractTypeCode: queryParamsData['contractTypeCode'],
                            StartInvoiceNumber: queryParamsData['startInvoiceNumber'],
                            EndInvoiceNumber: queryParamsData['endInvoiceNumber'],
                            StartVisualInvoiceNumber: queryParamsData['startVisualInvoiceNumber'],
                            EndVisualInvoiceNumber: queryParamsData['endVisualInvoiceNumber']
                        }
                    });
                }
                break;

        }
    }
}
