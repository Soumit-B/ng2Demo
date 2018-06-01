import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { AccountPremiseSearchComponent } from '../../internal/grid-search/iCABSAAccountPremiseSearchGrid';
import { Subscription } from 'rxjs/Subscription';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { BCompanySearchComponent } from './../search/iCABSBCompanySearch';
import { InvoiceGroupSearchComponent } from './../search/iCABSAInvoiceGroupSearch.component';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Observable } from 'rxjs/Rx';
import { InvoiceSearchComponent } from '../../internal/search/iCABSInvoiceSearch.component';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalMaintenanceApplicationModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';


@Component({
    templateUrl: 'iCABSAInvoiceHeaderGrid.html'
})

export class InvoiceHeaderGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('lstCriteriaOneDropDown') lstCriteriaOneDropDown: DropdownStaticComponent;
    @ViewChild('lstCriteriaTwoDropDown') lstCriteriaTwoDropDown: DropdownStaticComponent;
    @ViewChild('lstDateDropDown') lstDateDropDown: DropdownStaticComponent;
    @ViewChild('invoiceHeaderGrid') invoiceHeaderGrid: GridComponent;
    @ViewChild('invoiceHeaderGridPagination') invoiceHeaderGridPagination: PaginationComponent;
    @ViewChild('companyDropdown') companyDropdown: BCompanySearchComponent;
    @ViewChild('invoiceGroupEllipsis') public invoiceGroupEllipsis: EllipsisComponent;
    @ViewChild('invoiceSearchEllipsis') invoiceSearchEllipsis: EllipsisComponent;
    @ViewChild('extractDatePicker') extractDatePicker: DatepickerComponent;
    @ViewChild('periodDatePicker') periodDatePicker: DatepickerComponent;
    @ViewChild('processdatePicker') processdatePicker: DatepickerComponent;
    @ViewChild('messageModal') public messageModal;


    public pageId: string = '';
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 15;
    public showHeader: boolean = true;
    public promptConfirmTitle: string = '';
    public promptConfirmContent: any;
    public warningMessage: string = '';
    public search = new URLSearchParams();
    public lstCriteriaOneOptions: Array<any> = [{}];
    public lstDateOptions: Array<any> = [{}];
    public lstCriteriaTwoOptions: Array<any> = [{}];
    public gridSortHeaders: Array<any> = [];
    public headerProperties: Array<any> = [];
    //public screenNotReadyComponent = ScreenNotReadyComponent;
    public companyInputParams: any = {};
    public currDate: any = null;
    public currDate1: any = null;
    public currDate2: any = null;
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    public showCloseButton: boolean = true;
    public contractSearchComponent = ContractSearchComponent;
    public isAccountEllipsisDisabled: boolean = false;
    public accountSearchComponent = AccountSearchComponent;
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public headerClickedColumn: string = '';
    public riSortOrder: string = '';
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public showMessageHeader: boolean = true;
    private columnIndex: any = {
        invoiceName: 0,
        invoiceNumber: 3,
        ValueExclTax: 11,
        invoicePrint: 0
    };
    public invoiceshowDisable: boolean = false;
    private lookUpSubscription: Subscription;
    public inputParamsAccount: any = {
        'parentMode': 'HistorySearch',
        'showAddNewDisplay': false
    };
    public invoiceSearchComponentinputParams: any = {
        parentMode: 'InvoiceHistory',
        businessCode: this.utils.getBusinessCode(),
        countryCode: this.utils.getCountryCode(),
        companyCode: '',
        CompanyInvoiceNumber: ''
    };
    public invoiceSearchComponent: any = InvoiceSearchComponent;
    public fieldHidden: any = {
        tdCheckBoxes: false,
        trCopyInvoice: false,
        trInvoiceForEmail: false,
        trAccountNumber: true,
        trInvoiceGroupNumber: true,
        trExtractDate: true,
        trExtractRunNumber: true,
        trPeriodDate: true,
        trProcessedDate: true,
        trCompanyCode: false,
        trInvoiceNumber: false,
        tdLstDate: false
    };
    public fieldDisable: any = {
        CompanyCode: false
    };
    public inputParamsInvoiceGroupNumber: any = {
        parentMode: 'LookUp',
        isEllipsis: true
    };
    public invoiceGroupGridComponent = InvoiceGroupSearchComponent;
    public queryParams: any = {
        operation: 'Application/iCABSAInvoiceHeaderGrid',
        module: 'report',
        method: 'bill-to-cash/grid'
    };
    public companyDefault: Object = {
        id: '',
        text: ''
    };
    private querySysChar: URLSearchParams = new URLSearchParams();
    private searchParams: any;

    public controls = [
        { name: 'CopyInvoice', readonly: true, disabled: false, required: false },
        { name: 'EmailInvoice', readonly: true, disabled: false, required: false },
        { name: 'CompanyInvoiceNumber', readonly: true, disabled: false, required: false },
        { name: 'InvoiceName', readonly: true, disabled: true, required: false },
        { name: 'lstCriteriaOne', readonly: true, disabled: false, required: false },
        { name: 'lstDate', readonly: true, disabled: false, required: false },
        { name: 'lstCriteriaTwo', readonly: true, disabled: false, required: false },
        { name: 'CompanyCode', readonly: true, disabled: false, required: false },
        { name: 'CompanyDesc', readonly: true, disabled: false, required: false },
        { name: 'AccountNumber', readonly: true, disabled: false, required: false },
        { name: 'AccountName', readonly: true, disabled: true, required: false },
        { name: 'InvoiceNumber', readonly: true, disabled: false, required: false },
        { name: 'InvoiceGroupNumber', readonly: true, disabled: false, required: false },
        { name: 'InvoiceGroupDesc', readonly: true, disabled: true, required: false },
        { name: 'ExtractDate', readonly: true, disabled: false, required: false },
        { name: 'PeriodDate', readonly: true, disabled: false, required: false },
        { name: 'ProcessedDate', readonly: true, disabled: false, required: false },
        { name: 'SelectedInvoice', readonly: true, disabled: false, required: false },
        { name: 'ExtractRunNumberFrom', readonly: true, disabled: false, required: false },
        { name: 'ExtractRunNumberTo', readonly: true, disabled: false, required: false }

    ];
    public validateProperties: Array<any> = [];
    constructor(injector: Injector,
        private _router: Router, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICEHEADERGRID;
        this.companyInputParams[this.serviceConstants.CountryCode] = this.utils.getCountryCode();
        this.companyInputParams[this.serviceConstants.BusinessCode] = this.utils.getBusinessCode();
        this.companyInputParams['parentMode'] = 'LookUp';
    }

    /**
     * Load all system characters for the page
     */
    private loadSysChars(): void {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableCompanyCode,
            this.sysCharConstants.SystemCharEnableMultipleInvoiceLayouts,
            this.sysCharConstants.SystemCharEnableSeparateTaxAndNonTaxInvoiceLayouts,
            this.sysCharConstants.SystemCharEnableTaxBreakdownOnInvHist,
            this.sysCharConstants.SystemCharEnableRoundingValuesOnInvoiceHistory,
            this.sysCharConstants.SystemCharReproduceInvoicesForEmail
        ];
        this.lookUpSubscription = this.fetchSysChar(sysCharList).subscribe((data) => {
            try {
                if (data.records) {
                    this.pageParams.vSCEnableCompanyCode = data.records[0].Required;
                    this.pageParams.vSCEnableMultipleInvoiceLayouts = data.records[1].Required;
                    this.pageParams.vSCNumberOfInvoiceLayouts = data.records[1].Integer;
                    this.pageParams.vSCEnableSeparateTaxInvLayout = data.records[2].Required;
                    this.pageParams.vSCEnableTaxBreakdownOnInvHist = data.records[3].Required;
                    this.pageParams.vSCEnableInvoiceCreditBreakdown = data.records[3].Logical;
                    this.pageParams.vSCEnableRoundingOnInvHist = data.records[4].Required;
                    this.pageParams.vReproduceInvoiceForEmail = data.records[5].Required;
                    this.pageParams.vbNumTaxColumns = 0;
                    this.pageParams.SCNumberOfInvoiceLayouts = ((this.pageParams.vSCEnableMultipleInvoiceLayouts && this.pageParams.vSCNumberOfInvoiceLayouts > 0) && !this.pageParams.vSCEnableSeparateTaxInvLayout) ? this.pageParams.vSCNumberOfInvoiceLayouts : 0;
                    this.lstCriteriaOneOptionsChange(this.uiForm.controls['lstCriteriaOne'].value);
                    this.setPrintVariables();
                    this.setMaxColumn();
                    if (this.pageParams.vSCEnableTaxBreakdownOnInvHist) {
                        let postData = {};
                        postData['Function'] = 'GetTaxFields';
                        this.search = new URLSearchParams();
                        this.search.set(this.serviceConstants.Action, '6');
                        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
                        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
                            (data) => {
                                try {
                                    if (data.errorMessage !== '') {
                                        this.warningMessage = data.errorMessage;
                                        this.showAlert(data.errorMessage);
                                    } else {
                                        this.pageParams.vbNumTaxColumns = data.NumberOfTaxColumns;
                                        this.setMaxColumn();
                                    }
                                } catch (error) {
                                    this.logger.warn(error);
                                }
                            },
                            (error) => {
                                this.errorService.emitError(error);
                            }
                        );
                    }
                }
            } catch (e) {
                this.logger.warn('System variable response error' + e);
            }
        });
    }
    /**
     * Set checkbox values initially
     */
    private setPrintVariables(): void {
        if (this.pageParams.StrMode === 'Copy' && !this.pageParams.vReproduceInvoiceForEmail) {
            this.fieldHidden.tdCheckBoxes = false;
            this.fieldHidden.trCopyInvoice = false;
            this.fieldHidden.trInvoiceForEmail = true;
            this.uiForm.controls['CopyInvoice'].setValue(false);
            this.uiForm.controls['EmailInvoice'].setValue(false);
        }
        if (this.pageParams.StrMode !== 'Copy' && this.pageParams.vReproduceInvoiceForEmail) {
            this.fieldHidden.tdCheckBoxes = false;
            this.fieldHidden.trCopyInvoice = true;
            this.fieldHidden.trInvoiceForEmail = false;
            this.uiForm.controls['CopyInvoice'].setValue(true);
            this.uiForm.controls['EmailInvoice'].setValue(false);
        }
        if (this.pageParams.StrMode !== 'Copy' && !this.pageParams.vReproduceInvoiceForEmail) {
            this.fieldHidden.tdCheckBoxes = true;
            this.fieldHidden.trCopyInvoice = true;
            this.fieldHidden.trInvoiceForEmail = true;
            this.uiForm.controls['CopyInvoice'].setValue(true);
            this.uiForm.controls['EmailInvoice'].setValue(false);
        }
    }
    /***
     * Method to get system characters for ProspectMaintenance
    * @params field- systemchars variables looking for  and type- L,R,I
    */
    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');

        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode());
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }

    /**
     * Service call fetch look up data
     */

    public lookUpRecord(data: any, maxresults: any): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }


    /**
     * Account data received from ellipsis
     */
    public onAccountDataReceived(data: any): void {
        this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
        this.uiForm.controls['AccountName'].setValue(data.AccountName);
        this.inputParamsInvoiceGroupNumber['AccountNumber'] = this.uiForm.controls['AccountNumber'].value;
        this.inputParamsInvoiceGroupNumber['AccountName'] = this.uiForm.controls['AccountName'].value;
        this.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
        this.invoiceGroupEllipsis.childConfigParams = this.inputParamsInvoiceGroupNumber;
        this.invoiceshowDisable = false;
        this.populateDescriptions();
    }

    /**
     * Setting look up data
     */
    private setLookup(): void {
        let data = [{
            'table': 'Company',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'CountryCode': this.utils.getCountryCode(), 'DefaultCompanyInd': 'True' },
            'fields': ['CompanyCode', 'CompanyDesc']
        }];
        this.lookUpSubscription = this.lookUpRecord(JSON.parse(JSON.stringify(data)), 2).subscribe(
            (e) => {
                try {
                    if (e.results[0][0]) {
                        this.pageParams.vDefaultCompanyCode = e.results[0][0].CompanyCode;
                        this.pageParams.vDefaultCompanyDesc = e.results[0][0].CompanyDesc;
                        this.lstCriteriaOneOptionsChange(this.uiForm.controls['lstCriteriaOne'].value);
                    }
                } catch (err) {
                    this.logger.warn(err);
                }
            });
    }

    /**
     * Fetch invoice data
     */
    private fetchInvoiceData(): void {
        let data = {}, param = {};
        this.pageParams.invoiceData = [];
        if (this.uiForm.controls['CompanyCode'].value) {
            data = [{
                'table': 'InvoiceHeader',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'CompanyCode': this.uiForm.controls['CompanyCode'].value, 'CompanyInvoiceNumber': this.uiForm.controls['CompanyInvoiceNumber'].value },
                'fields': ['InvoiceNumber']
            }];
            this.lookUpSubscription = this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    try {
                        this.pageParams.invoiceData = [];
                        e.results[0].forEach(item => {
                            this.pageParams.invoiceData.push(item);
                        });
                        if (this.pageParams.invoiceData.length > 0) {
                            this.uiForm.controls['InvoiceNumber'].setValue(this.pageParams.invoiceData[0].InvoiceNumber);
                            this.invoiceSearchComponentinputParams.CompanyInvoiceNumber = this.uiForm.controls['CompanyInvoiceNumber'].value;
                            this.invoiceSearchComponentinputParams.companyCode = this.uiForm.controls['CompanyCode'].value;
                        } else {
                            this.invoiceSearchComponentinputParams.CompanyInvoiceNumber = this.uiForm.controls['CompanyInvoiceNumber'].value;
                            this.invoiceSearchComponentinputParams.companyCode = this.uiForm.controls['CompanyCode'].value;
                            this.invoiceSearchEllipsis.childConfigParams = this.invoiceSearchComponentinputParams;
                            this.uiForm.controls['InvoiceNumber'].setValue('');
                            this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                        }
                        if (this.pageParams.invoiceData.length > 1) {
                            this.invoiceSearchEllipsis.openModal();
                        } else {
                            this.buildGrid();
                            this.populateDescriptions();
                        }
                    } catch (err) {
                        this.logger.warn(err);
                    }
                });
        } else {
            data = [{
                'table': 'InvoiceHeader',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'CompanyInvoiceNumber': this.uiForm.controls['CompanyInvoiceNumber'].value },
                'fields': ['InvoiceNumber', 'CompanyCode']
            }];
            param = [{
                'table': 'Company',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['CompanyCode']
            }];
            let observableBatch = [this.lookUpRecord(JSON.parse(JSON.stringify(data)), 2), this.lookUpRecord(JSON.parse(JSON.stringify(param)), 1000)];
            Observable.forkJoin(
                observableBatch).subscribe((data) => {
                    data[0]['results'][0].forEach(item => {
                        for (let c of data[1]['results'][0]) {
                            if (c.CompanyCode === item.CompanyCode) {
                                this.pageParams.invoiceData.push(item);
                            }
                        }
                    });
                    if (this.pageParams.invoiceData.length === 1) {
                        this.uiForm.controls['InvoiceNumber'].setValue(this.pageParams.invoiceData[0].InvoiceNumber);
                    } else {
                        this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                        this.uiForm.controls['InvoiceNumber'].setValue('');
                    }
                    if (this.pageParams.invoiceData.length > 1) {
                        this.riExchange.setParentAttributeValue('CompanyInvoiceNumber', this.uiForm.controls['CompanyInvoiceNumber'].value);
                        this.riExchange.setParentAttributeValue('CompanyInvoiceNumberCompanyCode', this.uiForm.controls['CompanyCode'].value);
                        this._router.navigate([' application/InvoiceSearch'], { queryParams: { Mode: 'InvoiceHistory' } });
                    } else {
                        this.buildGrid();
                        this.populateDescriptions();
                    }
                });
        }

    }


    /**
     * Page load initialization data
     */
    private initData(): void {
        if (this.isReturning() === true) {
            this.resetForm();
        }
        this.createCriteriaDropDown();
        this.pageParams.vSCNumberOfInvoiceLayouts = 0;
        this.pageParams.SCNumberOfInvoiceLayouts = 0;
        this.pageParams.StrMode = '';
        this.loadSysChars();
        this.setLookup();
        this.pageTitle = 'Invoice Header Grid';
        if (this.riExchange.URLParameterContains('copy')) {
            this.pageParams.StrMode = 'Copy';
        }
    }

    private resetForm(): void {
        for (let cntrl of this.controls) {
            this.uiForm.controls[cntrl['name']].setValue('');
        }
    }

    /**
     * Set Maxcolumn of grid
     */
    private setMaxColumn(): void {
        this.validateProperties = [];
        this.pageParams.vbAdditionalCols = 0;
        this.maxColumn = 14;
        this.columnIndex.invoiceName = 13;
        this.columnIndex.invoicePrint = 14;
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': 0,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': 1,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': 2,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeInteger,
            'index': 3,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': 4,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeInteger,
            'index': 5,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeInteger,
            'index': 6,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeDate,
            'index': 7,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeDate,
            'index': 8,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeDate,
            'index': 9,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeImage,
            'index': 10,
            'align': 'center'
        });
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': 11,
            'align': 'center'
        });
        if (this.pageParams.vSCEnableRoundingOnInvHist) {
            this.pageParams.vbAdditionalCols = 1;
            this.maxColumn++;
            this.columnIndex.invoiceName++;
            this.columnIndex.invoicePrint++;
            this.validateProperties.push({
                'type': MntConst.eTypeText,
                'index': 12,
                'align': 'center'
            });
        }
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': 13,
            'align': 'center'
        });
        if (this.pageParams.vSCEnableTaxBreakdownOnInvHist) {
            this.maxColumn += this.pageParams.vbNumTaxColumns;
            this.columnIndex.invoicePrint += this.pageParams.vbNumTaxColumns;
            this.columnIndex.invoiceName += this.pageParams.vbNumTaxColumns;
            if (this.pageParams.vSCEnableRoundingOnInvHist) {
                this.maxColumn++;
                this.columnIndex.invoiceName++;
                this.pageParams.vbAdditionalCols++;
                this.columnIndex.invoicePrint++;
            }
        }
        if (this.pageParams.vSCEnableInvoiceCreditBreakdown) {
            this.columnIndex.invoiceName += this.pageParams.vbNumTaxColumns;
            this.columnIndex.invoicePrint += this.pageParams.vbNumTaxColumns;
            this.maxColumn += this.pageParams.vbNumTaxColumns;
            this.pageParams.vbAdditionalCols += this.pageParams.vbNumTaxColumns;
            if (this.pageParams.vSCEnableRoundingOnInvHist) {
                this.maxColumn++;
                this.columnIndex.invoiceName++;
                this.columnIndex.invoicePrint++;
                this.pageParams.vbAdditionalCols++;
            }
        }

        if (this.pageParams.SCNumberOfInvoiceLayouts > 1) {
            let layoutNumber: number = 0, counter: number = this.pageParams.SCNumberOfInvoiceLayouts, index: number = 0;
            while (layoutNumber < counter--) {
                this.maxColumn++;
                this.columnIndex.invoicePrint++;
                index++;
                this.validateProperties.push({
                    'type': MntConst.eTypeImage,
                    'index': 13 + index,
                    'align': 'center'
                });
            }
        } else {
            this.maxColumn++;
            this.columnIndex.invoicePrint++;
            this.validateProperties.push({
                'type': MntConst.eTypeImage,
                'index': 14,
                'align': 'center'
            });
        }
        this.headerProperties = [];
        let branchNameAdjust: Object = {
            'align': 'center',
            'width': '110px',
            'minWidth': '110px',
            'index': 1
        };
        let invoiceNumberAdjust: Object = {
            'align': 'center',
            'width': '105px',
            'minWidth': '105px',
            'index': 3
        };
        this.headerProperties.push(branchNameAdjust);
        this.headerProperties.push(invoiceNumberAdjust);
    }

    /**
     * Generate grid method
     */
    private buildGrid(): void {
        if (this.pageParams.vSCEnableTaxBreakdownOnInvHist) {
            this.showAlert(this.warningMessage);
        } else {
            if (this.uiForm.valid) {
                this.setMaxColumn();
                this.search = new URLSearchParams();
                this.search.set(this.serviceConstants.Action, '2');
                this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                this.search.set(this.serviceConstants.CountryCode, this.countryCode());
                //set parameters
                this.search.set('CriteriaOne', this.uiForm.controls['lstCriteriaOne'].value);
                this.search.set('CriteriaTwo', this.uiForm.controls['lstCriteriaTwo'].value);
                this.search.set('CriteriaDate', this.uiForm.controls['lstDate'].value);
                this.search.set('SCNumberOfInvoiceLayouts', this.pageParams.SCNumberOfInvoiceLayouts);
                this.search.set('SCEnableSeparateTaxInvLayout', this.pageParams.vSCEnableSeparateTaxInvLayout);
                this.search.set('GridType', 'Component');
                this.search.set(this.serviceConstants.GridMode, '0');
                this.search.set(this.serviceConstants.GridHandle, '0');
                this.search.set('riCacheRefresh', 'True');
                if (this.uiForm.controls['lstCriteriaOne'].value === 'InvoiceNumber') {
                    if (!this.uiForm.controls['InvoiceNumber'].value) {
                        this.uiForm.controls['InvoiceNumber'].setValue(this.uiForm.controls['CompanyInvoiceNumber'].value);
                    }
                    this.search.set('InvoiceNumber', this.uiForm.controls['InvoiceNumber'].value);
                }
                if (this.uiForm.controls['lstCriteriaOne'].value === 'AccountNumber') {
                    this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
                }
                if (this.uiForm.controls['lstCriteriaOne'].value === 'InvoiceGroupNumber') {
                    this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
                    if (this.uiForm.controls['InvoiceGroupDesc'].value === '' && this.uiForm.controls['InvoiceGroupNumber'].value) {
                        setTimeout(() => {
                            this.populateDescriptions();
                        }, 0);
                    }
                    this.search.set('InvoiceGroupNumber', this.uiForm.controls['InvoiceGroupNumber'].value);
                }
                if (this.uiForm.controls['lstCriteriaOne'].value === 'ExtractDate') {
                    this.search.set('ExtractDate', this.uiForm.controls['ExtractDate'].value);
                }
                if (this.uiForm.controls['lstCriteriaOne'].value === 'ExtractRunNumber') {
                    this.search.set('ExtractRunNumberFrom', this.uiForm.controls['ExtractRunNumberFrom'].value);
                    this.search.set('ExtractRunNumberTo', this.uiForm.controls['ExtractRunNumberTo'].value);
                }
                if (this.uiForm.controls['lstDate'].value === 'PeriodDate') {
                    this.search.set('StartDate', this.uiForm.controls['PeriodDate'].value);
                }
                if (this.uiForm.controls['lstDate'].value === 'ProcessedDate') {
                    this.search.set('StartDate', this.uiForm.controls['ProcessedDate'].value);
                }
                // set grid building parameters
                this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
                this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
                this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
                this.search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
                this.queryParams.search = this.search;
                this.invoiceHeaderGrid.loadGridData(this.queryParams);
            }
        }
    }

    /**
     * Account number change
     */
    public accountChange(): void {
        if (this.uiForm.controls['AccountNumber'].value) {
            this.uiForm.controls['AccountNumber'].setValue(this.utils.numberPadding(this.uiForm.controls['AccountNumber'].value, 9));
            this.populateDescriptions();
        } else {
            this.uiForm.controls['AccountName'].setValue('');
            this.uiForm.controls['InvoiceGroupNumber'].setValue('');
            this.uiForm.controls['InvoiceGroupDesc'].setValue('');
        }
    }


    /**
     * Method tp print invoice
     */
    public invoicePrint(invoiceNumber: any, layoutNumber: any): void {
        let strURL, strReproduceInvoiceForEmail, strCopyInvoice;
        if (this.uiForm.controls['EmailInvoice'].value) {
            strReproduceInvoiceForEmail = 'True';
        } else {
            strReproduceInvoiceForEmail = 'False';
        }
        if (this.uiForm.controls['CopyInvoice'].value) {
            strCopyInvoice = 'True';
        } else {
            strCopyInvoice = 'False';
        }
        let postData = {};
        postData['Function'] = 'Single';
        postData['InvoiceNumber'] = invoiceNumber;
        postData['LayoutNumber'] = layoutNumber;
        postData['EmailInvoice'] = strReproduceInvoiceForEmail;
        postData['Copy'] = strCopyInvoice;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    if (!data['fullError']) {
                        window.open(data.url, '_blank');
                    }
                    else {
                        if (data.fullError.indexOf('iCABSAInvoiceReprintMaintenance.htm') >= 0) {
                            let tempList = data.fullError.split('?');
                            if (tempList && tempList.length > 1) {
                                let params = new URLSearchParams(tempList[1]);
                                this.router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAINVOICEREPRINTMAINTENANCE], { queryParams: { InvoiceNumber: params.get('InvoiceNumber') } });
                            }
                        } else {
                            window.open(data.fullError, '_blank');
                        }
                    }


                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    /**
     * Company invoice onchange method
     */
    public companyInvoiceNumberOonChange(obj: any): void {
        if (this.uiForm.controls['CompanyInvoiceNumber'].valid) {
            this.fetchInvoiceData();
        }
        if (this.pageParams.vSCEnableTaxBreakdownOnInvHist) {
            this.showAlert(this.warningMessage);
        }
    }

    public populateDescriptions(): void {
        let postData = {};
        postData['Function'] = 'SetDisplayFields';
        if (this.uiForm.controls['CompanyCode'].value) {
            postData['CompanyCode'] = this.uiForm.controls['CompanyCode'].value;
        }
        if (this.uiForm.controls['InvoiceNumber'].value) {
            postData['InvoiceNumber'] = this.uiForm.controls['InvoiceNumber'].value;
        }
        if (this.uiForm.controls['AccountNumber'].value) {
            postData['AccountNumber'] = this.uiForm.controls['AccountNumber'].value;
        }
        if (this.uiForm.controls['InvoiceGroupNumber'].value) {
            postData['InvoiceGroupNumber'] = this.uiForm.controls['InvoiceGroupNumber'].value;
        }
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postData).subscribe(
            (data) => {
                try {
                    this.uiForm.controls['CompanyDesc'].setValue(data.CompanyDesc);
                    this.uiForm.controls['InvoiceName'].setValue(data.InvoiceName);
                    this.uiForm.controls['AccountName'].setValue(data.AccountName);
                    this.uiForm.controls['InvoiceGroupDesc'].setValue(data.InvoiceGroupDesc);
                    this.inputParamsInvoiceGroupNumber['AccountNumber'] = this.uiForm.controls['AccountNumber'].value;
                    this.inputParamsInvoiceGroupNumber['AccountName'] = this.uiForm.controls['AccountName'].value;

                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    public getGridInfo(info: any): void {
        this.invoiceHeaderGridPagination.totalItems = info.totalRows;
        if (this.pageParams.GridMode === '3')
            this.buildGrid();
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    }

    public refresh(): void {
        this.buildGrid();
    }

    public onGridRowDblClick(event: any): void {
        let objSrcName: any = '';
        objSrcName = event.cellIndex;
        if (objSrcName === this.columnIndex.invoiceName) {
            this.attributes['InvoiceHeaderRowID'] = event.cellData.RowID;
            this._router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAINVOICEHEADERADDRESSDETAILS], { queryParams: { parentMode: 'InvoiceAddressDetails', InvoiceNumber: event.trRowData[3].text.toString().trim(), ROWID: event.trRowData[3].rowID } });
        } else if (objSrcName === this.columnIndex.invoiceNumber) {
            this.attributes['InvoiceNumber'] = event.cellData.text;
            this.attributes['SystemInvoiceNumber'] = event.cellData.additionalData;
            this.attributes['CompanyCode'] = event.trRowData[2].text;
            this.attributes['CompanyDesc'] = event.trRowData[2].additionalData;
            this.attributes['InvoiceName'] = event.trRowData[this.columnIndex.invoiceName].text;
            this.attributes['AccountNumber'] = event.trRowData[4].text;
            this.attributes['AccountName'] = event.trRowData[4].additionalData;
            this.attributes['InvoiceGroupNumber'] = event.trRowData[5].text;
            this.attributes['InvoiceGroupDesc'] = event.trRowData[5].additionalData;
            this.navigate('InvoiceGroup', this.ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID);
        } else if (objSrcName === this.columnIndex.ValueExclTax) {
            this.attributes['InvoiceNumber'] = event.trRowData[3].text;
            this.attributes['SystemInvoiceNumber'] = event.trRowData[3].additionalData;
            this.attributes['CompanyCode'] = event.trRowData[2].text;
            this.attributes['CompanyDesc'] = event.trRowData[2].additionalData;
            this.attributes['InvoiceName'] = event.trRowData[this.columnIndex.invoiceName].text;
            this.attributes['AccountNumber'] = event.trRowData[4].text;
            this.attributes['AccountName'] = event.trRowData[4].additionalData;
            this.attributes['InvoiceGroupNumber'] = event.trRowData[5].text;
            this.attributes['InvoiceGroupDesc'] = event.trRowData[5].additionalData;

            this.attributes['SelectedInvoiceInvoiceNumber'] = event.trRowData[3].text;
            this.attributes['SelectedInvoiceSystemInvoiceNumber'] = event.trRowData[3].additionalData;
            this.attributes['SelectedInvoiceCompanyCode'] = event.trRowData[2].text;
            this.attributes['SelectedInvoiceCompanyDesc'] = event.trRowData[2].additionalData;
            this.attributes['SelectedInvoiceInvoiceName'] = event.trRowData[this.columnIndex.invoiceName].text;
            this.attributes['SelectedInvoiceAccountNumber'] = event.trRowData[4].text;
            this.attributes['SelectedInvoiceAccountName'] = event.trRowData[4].additionalData;
            this.attributes['SelectedInvoiceInvoiceGroupNumber'] = event.trRowData[5].text;
            this.attributes['SelectedInvoiceInvoiceGroupDesc'] = event.trRowData[5].additionalData;
            this._router.navigate([InternalGridSearchSalesModuleRoutes.ICABSACONTRACTINVOICETURNOVERGRID], {
                queryParams: {
                    parentMode: 'InvoiceGroup',
                    AccountNumber: this.attributes['AccountNumber'],
                    AccountName: this.attributes['AccountName'],
                    InvoiceGroupNumber: this.attributes['InvoiceGroupNumber'],
                    InvoiceGroupDesc: this.attributes['InvoiceGroupDesc'],
                    InvoiceNumber: this.attributes['InvoiceNumber'],
                    InvoiceName: this.attributes['InvoiceName'],
                    CompanyCode: this.attributes['CompanyCode'],
                    CompanyDesc: this.attributes['CompanyDesc'],
                    SystemInvoiceNumber: this.attributes['SystemInvoiceNumber']
                }
            });
        } else if (event.cellData.text && event.cellData.text === 'SP') {
            let layoutNumber: string = '';
            if (this.pageParams.SCNumberOfInvoiceLayouts > 1) {
                this.invoicePrint(event.trRowData[3].rowID, event.cellData.rowID);
            } else {
                if (this.pageParams.vSCEnableSeparateTaxInvLayout) {
                    layoutNumber = event.trRowData[this.columnIndex.invoicePrint].rowID;
                } else {
                    layoutNumber = '';
                }
                this.invoicePrint(event.trRowData[3].rowID, layoutNumber);
            }
        }
    }

    /**
     * Create criteria options
     */

    private createCriteriaDropDown(): void {
        this.lstCriteriaOneOptions = [];
        this.lstCriteriaOneOptions.push({ value: 'InvoiceNumber', text: 'Invoice / Credit Number' });
        this.lstCriteriaOneOptions.push({ value: 'AccountNumber', text: 'Account Number' });
        this.lstCriteriaOneOptions.push({ value: 'InvoiceGroupNumber', text: 'Invoice Group Number' });
        this.lstCriteriaOneOptions.push({ value: 'ExtractDate', text: 'Extract Date' });
        this.lstCriteriaOneOptions.push({ value: 'ExtractRunNumber', text: 'Run Number' });
        this.lstCriteriaOneOptions.splice(0, 1);
        this.lstCriteriaOneDropDown.defaultOption = { value: 'InvoiceNumber', text: 'Invoice / Credit Number' };

        this.lstCriteriaTwoOptions = [];
        this.lstCriteriaTwoOptions.push({ value: 'ShowAll', text: 'Show All' });
        this.lstCriteriaTwoOptions.push({ value: 'Invoices', text: 'Show Invoices Only' });
        this.lstCriteriaTwoOptions.push({ value: 'Credits', text: 'Show Credits Only' });
        this.lstCriteriaTwoOptions.splice(0, 1);
        this.lstCriteriaTwoDropDown.defaultOption = { value: 'ShowAll', text: 'Show All' };

        this.lstDateOptions = [];
        this.lstDateOptions.push({ value: 'AllDates', text: 'All Dates' });
        this.lstDateOptions.push({ value: 'PeriodDate', text: 'Period Date' });
        this.lstDateOptions.push({ value: 'ProcessedDate', text: 'Processed Date' });
        this.lstDateOptions.splice(0, 1);
        this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
    }

    /**
     * Set values on Dropdown changes
     */

    public lstCriteriaOneOptionsChange(obj: any): void {
        this.uiForm.controls['lstCriteriaOne'].setValue(obj);
        this.invoiceHeaderGrid.clearGridData();
        switch (obj) {
            case 'InvoiceNumber':
                if (this.pageParams.vSCEnableCompanyCode) {
                    this.fieldHidden.trCompanyCode = false;
                    this.uiForm.controls['CompanyCode'].setValue(this.pageParams.vDefaultCompanyCode);
                    this.uiForm.controls['CompanyDesc'].setValue(this.pageParams.vDefaultCompanyDesc);
                    if (this.pageParams.vDefaultCompanyCode)
                        this.companyDropdown.active = { id: this.pageParams.vDefaultCompanyCode, text: this.pageParams.vDefaultCompanyCode + ' - ' + this.pageParams.vDefaultCompanyDesc };
                } else {
                    this.fieldHidden.trCompanyCode = true;
                    this.uiForm.controls['CompanyCode'].setValue(this.pageParams.vDefaultCompanyCode);
                    this.uiForm.controls['CompanyDesc'].setValue(this.pageParams.vDefaultCompanyDesc);
                }
                this.fieldHidden.trInvoiceNumber = false;
                this.uiForm.controls['InvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.tdLstDate = false;
                this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
                this.fieldHidden.trPeriodDate = true;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trAccountNumber = true;
                this.uiForm.controls['AccountNumber'].setValue('');
                this.uiForm.controls['AccountName'].setValue('');
                this.fieldHidden.trInvoiceGroupNumber = true;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.fieldHidden.trExtractDate = true;
                this.currDate = null;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.fieldHidden.trExtractRunNumber = true;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                if (!this.pageParams.vSCEnableCompanyCode) {
                    this.uiForm.controls['CompanyCode'].setValue(this.pageParams.vDefaultCompanyCode);
                    this.uiForm.controls['CompanyDesc'].setValue(this.pageParams.vDefaultCompanyDesc);
                    this.fieldDisable.CompanyCode = true;
                    this.el.nativeElement.querySelector('#CompanyInvoiceNumber').focus();
                } else {
                    this.fieldDisable.CompanyCode = false;
                    this.fieldDisable.CompanyCode = false;
                }
                break;
            case 'AccountNumber':
                this.fieldHidden.trAccountNumber = false;
                this.uiForm.controls['AccountNumber'].setValue('');
                this.uiForm.controls['AccountName'].setValue('');
                this.fieldHidden.tdLstDate = false;
                this.lstDateDropDown.selectedItem = 'AllDates';
                this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
                this.fieldHidden.trPeriodDate = true;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trInvoiceNumber = true;
                this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.trInvoiceGroupNumber = true;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.fieldHidden.trCompanyCode = true;
                this.uiForm.controls['CompanyCode'].setValue('');
                this.companyDropdown.active['id'] = '';
                this.fieldHidden.trExtractDate = true;
                this.currDate = null;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.fieldHidden.trExtractRunNumber = true;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                break;
            case 'InvoiceGroupNumber':
                this.fieldHidden.trAccountNumber = false;
                this.fieldHidden.trInvoiceGroupNumber = false;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.uiForm.controls['AccountNumber'].setValue('');
                this.uiForm.controls['AccountName'].setValue('');
                this.fieldHidden.tdLstDate = false;
                this.fieldHidden.trPeriodDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trCompanyCode = true;
                this.uiForm.controls['CompanyCode'].setValue('');
                this.companyDropdown.active['id'] = '';
                this.fieldHidden.trInvoiceNumber = true;
                this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.trExtractDate = true;
                this.currDate = null;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.fieldHidden.trExtractRunNumber = true;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                break;
            case 'ExtractDate':
                this.fieldHidden.trExtractDate = false;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.currDate = null;
                this.fieldHidden.tdLstDate = true;
                this.lstDateDropDown.selectedItem = 'AllDates';
                this.lstDateDropDown.selectedItem = 'AllDates';
                this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
                this.uiForm.controls['lstDate'].setValue('');
                this.fieldHidden.trPeriodDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trCompanyCode = true;
                this.uiForm.controls['CompanyCode'].setValue('');
                this.companyDropdown.active['id'] = '';
                this.fieldHidden.trInvoiceNumber = true;
                this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.trExtractRunNumber = true;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                this.fieldHidden.trInvoiceGroupNumber = true;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.fieldHidden.trAccountNumber = true;
                this.uiForm.controls['AccountNumber'].setValue('');
                break;
            case 'ExtractRunNumber':
                this.fieldHidden.trExtractRunNumber = false;
                this.uiForm.controls['ExtractRunNumberFrom'].setValue('');
                this.uiForm.controls['ExtractRunNumberTo'].setValue('');
                this.uiForm.controls['ExtractDate'].setValue('');
                this.currDate = null;
                this.fieldHidden.tdLstDate = true;
                this.lstDateDropDown.selectedItem = 'AllDates';
                this.lstDateDropDown.defaultOption = { value: 'AllDates', text: 'All Dates' };
                this.uiForm.controls['lstDate'].setValue('');
                this.uiForm.controls['lstDate'].setValue('');
                this.fieldHidden.trPeriodDate = true;
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trProcessedDate = true;
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trCompanyCode = true;
                this.uiForm.controls['CompanyCode'].setValue('');
                this.companyDropdown.active['id'] = '';
                this.fieldHidden.trInvoiceNumber = true;
                this.uiForm.controls['CompanyInvoiceNumber'].setValue('');
                this.uiForm.controls['InvoiceName'].setValue('');
                this.fieldHidden.trExtractDate = true;
                this.currDate = null;
                this.uiForm.controls['ExtractDate'].setValue('');
                this.fieldHidden.trInvoiceGroupNumber = true;
                this.uiForm.controls['InvoiceGroupNumber'].setValue('');
                this.uiForm.controls['InvoiceGroupDesc'].setValue('');
                this.fieldHidden.trAccountNumber = true;
                this.uiForm.controls['AccountNumber'].setValue('');
                break;
            default:
                break;
        }
        this.lstDateDropDown.selectedItem = 'AllDates';
        if (this.parentMode === 'ExtractRunDetails') {
            this.uiForm.controls['InvoiceNumber'].setValue(this.riExchange.getParentAttributeValue('ExtractRunNumberSystemInvoiceNumber'));
            this.uiForm.controls['CompanyInvoiceNumber'].setValue(this.riExchange.getParentHTMLValue('ExtractRunNumberInvoiceNumber'));
            this.uiForm.controls['CompanyCode'].setValue(this.riExchange.getParentHTMLValue('ExtractRunNumberCompanyCode'));
            this.uiForm.controls['CompanyDesc'].setValue(this.riExchange.getParentHTMLValue('ExtractRunNumberCompanyDesc'));
        }
        this.buildGrid();
    }
    public lstDateOptionsChange(obj: any): void {
        this.uiForm.controls['lstDate'].setValue(obj);
        switch (obj) {
            case 'AllDates':
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.uiForm.controls['PeriodDate'].setValue('');
                this.fieldHidden.trPeriodDate = true;
                this.fieldHidden.trProcessedDate = true;
                break;
            case 'PeriodDate':
                this.uiForm.controls['ProcessedDate'].setValue('');
                this.currDate2 = null;
                this.fieldHidden.trPeriodDate = false;
                this.fieldHidden.trProcessedDate = true;
                break;
            case 'ProcessedDate':
                this.uiForm.controls['PeriodDate'].setValue('');
                this.currDate1 = null;
                this.fieldHidden.trPeriodDate = true;
                this.fieldHidden.trProcessedDate = false;
                break;
            default:
                break;
        }
    }
    public lstCriteriaTwoOptionsChange(obj: any): void {
        this.uiForm.controls['lstCriteriaTwo'].setValue(obj);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.initData();
    }
    public ngAfterViewInit(): void {
        let invoiceNumber: any = {
            'fieldName': 'InvoiceNumber',
            'index': 3,
            'sortType': 'ASC'
        };
        let invoiceExtractNumber: any = {
            'fieldName': 'InvoiceExtractNumber',
            'index': 6,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(invoiceNumber);
        this.gridSortHeaders.push(invoiceExtractNumber);
        this.utils.setTitle(this.pageTitle);
    }
    /**
     * Company code recieved
     */
    public onCompanyChange(data: any): void {
        this.uiForm.controls['CompanyCode'].setValue(data.CompanyCode);
        if (this.uiForm.controls['CompanyCode'].value) {
            this.companyInvoiceNumberOonChange(this.uiForm.controls['CompanyInvoiceNumber'].value);
        }
        if (this.pageParams.vSCEnableTaxBreakdownOnInvHist) {
            this.showAlert(this.warningMessage);
        }
    }
    /**
     * Extra date recieved method
     */
    public extraDateSelectedValue(data: any): void {
        this.uiForm.controls['ExtractDate'].setValue(data.value);
        this.buildGrid();
    }


    /**
     * Extra date recieved method
     */

    public processedDateSelectedValue(data: any): void {
        this.uiForm.controls['ProcessedDate'].setValue(data.value);
    }

    /**
     * Extra date recieved method
     */
    public periodDateSelectedValue(data: any): void {
        this.uiForm.controls['PeriodDate'].setValue(data.value);
    }
    /**
     * Method tp invoice Group number recieve
     */
    public onInvoiceGroupNumberReceived(data: any): void {
        this.uiForm.controls['InvoiceGroupNumber'].setValue(data.InvoiceGroupNumber);
        this.uiForm.controls['InvoiceGroupDesc'].setValue(data.InvoiceGroupDesc);
    }
    /**
     * Set checked value copyInvoice
     */
    public copyInvoiceOnChange(ev: any): void {
        this.uiForm.controls['CopyInvoice'].setValue(ev);
    }
    /**
     * Set checked value EmailInvoice
     */
    public emailInvoiceOnChange(ev: any): void {
        this.uiForm.controls['EmailInvoice'].setValue(ev);
    }
    public invoiceSearchComponentDataReceived(eventObj: any): any {
        this.uiForm.controls['InvoiceNumber'].setValue(eventObj);
        this.populateDescriptions();
    }
    public sortGrid(data: any): void {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }
    ngOnDestroy(): void {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.lookUpSubscription)
            this.lookUpSubscription.unsubscribe();
        super.ngOnDestroy();
    }

    private showAlert(msgTxt: string): void {
        this.messageModal.show({ msg: msgTxt, title: 'Message' }, false);
    }

}
