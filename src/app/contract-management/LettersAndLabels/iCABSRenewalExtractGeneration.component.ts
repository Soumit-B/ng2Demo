import * as moment from 'moment';
import { el } from '@angular/platform-browser/testing/browser_util';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from '../../../app/base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { FormControl, FormGroup } from '@angular/forms';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ModalComponent } from './../../../shared/components/modal/modal';

@Component({
    templateUrl: 'iCABSRenewalExtractGeneration.html'

})
export class RenewalExtractGenerationComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('renewalExtractGenerationPagination') renewalExtractGenerationPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal: ModalComponent;
    @ViewChild('errorModal') public errorModal;
    public lastDay: Date;
    public firstDay: Date;
    public fromdate: any;
    public todate: any;
    public pageId: string = '';
    public uiForm: FormGroup;
    public search: URLSearchParams = new URLSearchParams();
    public pageTitle: string;
    public maxColumn: number = 11;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public branchnumberDetails: any = {};
    public inputParams: any = {};
    public errorMessage: string;
    public information: string = '';
    public fromDateDisplay: string = '';
    public toDateDisplay: string = '';
    public dateObjects: any = {
        fromDateDisplay: new Date(),
        toDateDisplay: new Date()
    };
    public pageCurrent: number = 1;
    public totalRecords: number = 1;
    public branchNumber: string;
    public BranchSearch: any;
    public inputParamsBranch: any = {};
    public RowID = '';
    public negBranchNumberSelected: Object = {
        id: '',
        text: ''
    };
    public queryParams: any = {
        operation: 'Sales/iCABSRenewalExtractGeneration',
        module: 'contract-admin',
        method: 'contract-management/batch'
    };

    public controls = [
        { name: 'FromDate', readonly: false, disabled: false, required: false },
        { name: 'ToDate', readonly: false, disabled: false, required: false },
        { name: 'RepDest', readonly: false, disabled: false, required: false },
        { name: 'ReportURL', readonly: false, disabled: false, required: false },
        { name: 'SelectAllInd', required: true },
        { name: 'SubmitReport', required: true }
    ];

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Renewal Letter Extract';
        this.window_onload();
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.utils.setTitle('Renewal Extract');
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSRENEWALEXTRACTGENERATION;
        this.search = this.getURLSearchParamObject();
    }

    //for fetching branch name

    private window_onload(): void {
        this.branchNumber = this.utils.getBranchCode();
        this.lookupBranchName();
        this.search = this.getURLSearchParamObject();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set('Function', 'GetBranchName');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search).subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                }
                else {
                    this.messageService.emitMessage(e);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchName', e.BranchName);
                    this.reportUrl();
                    this.setFormMode(this.c_s_MODE_UPDATE);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
        );

        // setting today's date
        let date = new Date();
        this.firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        this.fromdate = this.utils.formatDate(this.firstDay);
        this.todate = this.utils.formatDate(this.lastDay);
        //prefilling from date
        let getFromDate = this.globalize.parseDateToFixedFormat(this.fromdate).toString();
        this.dateObjects.fromDateDisplay = this.globalize.parseDateStringToDate(getFromDate);
        this.uiForm.controls['FromDate'].setValue(this.globalize.parseDateToFixedFormat(this.dateObjects.fromDateDisplay));
        //prefilling to date
        let getToDate = this.globalize.parseDateToFixedFormat(this.todate).toString();
        this.dateObjects.toDateDisplay = this.globalize.parseDateStringToDate(getToDate);
        this.uiForm.controls['ToDate'].setValue(this.globalize.parseDateToFixedFormat(this.dateObjects.toDateDisplay));

        this.setControlValue('RepDest', 'direct');
        this.buildGrid();
    }

    //branch number dropdown
    public onBranchDataReceived(obj: any): void {
        this.branchNumber = obj.BranchNumber;
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    }

    /*# Get and Set Branch Name #*/
    public lookupBranchName(): void {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.branchNumber
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.hasError) {
                this.errorService.emitError(data);
            } else {
                let Branch = data[0][0];
                if (Branch) {
                    this.negBranchNumberSelected = {
                        id: this.branchNumber,
                        text: this.branchNumber + ' - ' + Branch.BranchName
                    };
                };
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            });

    }

    //lookup for lettertype dropdown values
    public LetterTypeDescoptions = [];
    public lookUpSubscription: Subscription;
    reportUrl(): void {
        let lookupIP = [
            {
                'table': 'Lettertype',
                'query': {
                    'BusinessCode': this.businessCode
                },
                'fields': ['LetterTypeCode', 'DocumentURL', 'LetterTypeDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let reporturl: string;

            if (data.hasError) {
                this.errorService.emitError(data);
            } else if (data) {

                this.LetterTypeDescoptions = [];
                for (let i = 0; i < data[0].length; i++) {
                    reporturl = data[0][i].LetterTypeCode;
                    if (reporturl.indexOf('R') === 0) {
                        this.LetterTypeDescoptions.push(data[0][i]);
                    }
                }
                this.setControlValue('ReportURL', this.LetterTypeDescoptions[0].DocumentURL);
            };
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);

        },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //from date and to date

    public dateFromSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.fromDateDisplay = value['value'];
            this.uiForm.controls['FromDate'].setValue(this.fromDateDisplay);
        } else {
            this.fromDateDisplay = '';
            this.uiForm.controls['FromDate'].setValue('');
        }
    }


    public dateToSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.toDateDisplay = value['value'];
            this.uiForm.controls['ToDate'].setValue(this.toDateDisplay);
        } else {
            this.toDateDisplay = '';
            this.uiForm.controls['ToDate'].setValue('');
        }
    }

    //grid
    public URLReturn: string;
    public rowId = '';

    public buildGrid(): void {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.Clear();
        this.riGrid.AddColumn('RenewalExtractDate', 'RenewalExtract', 'RenewalExtractDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('RenewalExtractDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('RenewalExtractTime', 'RenewalExtract', 'RenewalExtractTime', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('RenewalExtractTime', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('BranchNumber', 'RenewalExtract', 'BranchNumber', MntConst.eTypeDate, 7);
        this.riGrid.AddColumn('BranchName', 'RenewalExtract', 'BranchName', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('SearchCategory', 'RenewalExtract', 'SearchCategory', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('ReportDescription', 'RenewalExtract', 'ReportDescription', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('NumberOfContracts', 'RenewalExtract', 'NumberOfContracts', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('NumberOfContracts', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ValueOfContracts', 'RenewalExtract', 'ValueOfContracts', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumnAlign('ValueOfContracts', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('NumberOfContractsSelected', 'RenewalExtract', 'NumberOfContractsSelected', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('NumberOfContractsSelected', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ValueOfContractsSelected', 'RenewalExtract', 'ValueOfContractsSelected', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumnAlign('ValueOfContractsSelected', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('HeaderSelected', 'RenewalExtract', 'HeaderSelected', MntConst.eTypeImage, 1, false, 'Click here to select');
        this.riGrid.AddColumnAlign('HeaderSelected', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('SearchCategory', true);
        this.riGrid.AddColumnOrderable('RenewalExtractDate', true);
        this.riGrid.Complete();

        this.loadData();
    }

    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    }

    public loadData(): void {
        this.search = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;

        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.Action, '2');
        formdata['Level'] = 'ExtractHeader';
        formdata['RenewalExtractHeaderRowID'] = this.RowID;
        formdata['BranchNumber'] = this.branchNumber;
        formdata['ReportURL'] = this.getControlValue('ReportURL');
        formdata['DateFrom'] = this.getControlValue('FromDate');
        formdata['DateTo'] = this.getControlValue('ToDate');
        formdata[this.serviceConstants.GridMode] = '0';
        formdata[this.serviceConstants.GridHandle] = '7669056';
        formdata['riCacheRefresh'] = 'True';
        formdata[this.serviceConstants.PageSize] = this.itemsPerPage.toString();
        formdata[this.serviceConstants.PageCurrent] = this.currentPage.toString();
        formdata['HeaderClickedColumn'] = '';
        formdata['riSortOrder'] = 'Descending';
        this.inputParams.search = this.search;
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.messageModal.show(data, true);
                }
                else {
                    try {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.Execute(data);
                    } catch (e) {
                        this.logger.log(' Problem in grid load', e);
                    }

                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_Sort(event: any): void {
        this.loadData();
    }

    public proceedGridLoad(): void {
        let getToDate = this.globalize.parseDateToFixedFormat(new Date()).toString();
        this.dateObjects.toDateDisplay = this.globalize.parseDateStringToDate(getToDate);
    }

    public menuOnchange(event: any): void {
        this.SelectAllInd();
    }

    //Select All
    public ischecked(value: any): string {
        if (value) {
            return 'yes';
        } else {
            return 'no';
        }
    }

    public selectsearch: URLSearchParams = new URLSearchParams();

    public SelectAllInd(): void {
        this.selectsearch = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.selectsearch.set(this.serviceConstants.Action, '0');
        this.selectsearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.selectsearch.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['Level'] = 'ModifyPrintSelection';
        if (this.ischecked(this.getControlValue('SelectAllInd')) === 'yes') {
            formdata['TabSelected'] = 'Select All';
        }
        else {
            formdata['TabSelected'] = 'DeSelect All';
        }
        formdata['BranchNumber'] = this.branchNumber;
        formdata['DateFrom'] = this.getControlValue('FromDate');
        formdata['DateTo'] = this.getControlValue('ToDate');
        formdata['ReportURL'] = this.getControlValue('ReportURL');
        this.inputParams.selectsearch = this.selectsearch;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.selectsearch, formdata)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                }
                else {
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateRow = true;
                    this.riGrid.UpdateFooter = true;
                    this.refresh();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
    // Submit report on clicking Button

    public submitsearch: URLSearchParams = new URLSearchParams();
    public trInformation: boolean = false;
    public submitReport(): void {
        this.submitsearch = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.submitsearch.set(this.serviceConstants.Action, '0');
        this.submitsearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.submitsearch.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['TabSelected'] = 'Print Reports';
        formdata['BranchNumber'] = this.branchNumber;
        formdata['RepManDest'] = 'batch|ReportID';
        formdata['ReportURL'] = this.getControlValue('ReportURL');
        this.inputParams.search = this.submitsearch;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                }
                else {
                    if (e.errorMessage && e.errorMessage !== '') {
                        setTimeout(() => {
                            this.errorService.emitError(e);
                        }, 200);

                    } else {
                        this.messageService.emitMessage(e);
                        this.trInformation = true;
                        this.information = e.ReturnHTML;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public refresh(): void {
        this.currentPage = 1;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    }

    // on clicking Grid Body
    public rowclicksearch: URLSearchParams = new URLSearchParams();

    public onGridRowClick(ev: Event): void {

        this.RowID = this.riGrid.Details.GetAttribute('RenewalExtractDate', 'rowid');
        let formdata: Object = {};
        this.rowclicksearch = this.getURLSearchParamObject();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.rowclicksearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.rowclicksearch.set(this.serviceConstants.CountryCode, this.countryCode());
        if (this.riGrid.CurrentColumnName === 'HeaderSelected') {
            this.rowclicksearch.set(this.serviceConstants.Action, '6');
            formdata['Function'] = 'SelectHeader';
            formdata['RenewalExtractHeaderRowID'] = this.RowID;
        }
        else {
            this.rowclicksearch.set(this.serviceConstants.Action, '0');
            formdata['Function'] = 'ReportParameters';
            formdata['RenewalExtractHeaderRowID'] = this.RowID;
            this.rowclicksearch.set('BranchNumber', this.branchNumber);
        }
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.rowclicksearch, formdata)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorModal.show(e, true);
                }
                else {
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateRow = true;
                    this.riGrid.UpdateFooter = true;
                    this.refresh();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
}
