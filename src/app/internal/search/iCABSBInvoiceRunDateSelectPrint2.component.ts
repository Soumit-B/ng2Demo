import { Component, OnInit, Injector, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSBInvoiceRunDateSelectPrint2.html'
})

export class InvoiceRunDateSelectPrint2Component extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    private lookUpSubscription: Subscription;
    private queryParams: any = {
        operation: 'Business/iCABSBInvoiceRunDateSelectPrint2',
        module: 'invoicing',
        method: 'bill-to-cash/maintenance'
    };
    public systemChars: Object = {
        vEnableInvoicePrintRange: '', //1662
        vInvoicePrintRange: '', //1662
        vSCEnableNextInvoiceNumberEntry: '',//1670
        vSCEnableMultipleInvoiceLayouts: '',//2150
        vSCNumberOfInvoiceLayouts: '',//2150
        vReproduceInvoiceForEmail: '',//2630
        vSCSortInvoicesByInvoiceRange: '' //1700
    };
    public pageId: string = '';
    public isSaveDisabled: boolean = false;
    public isSuppressCreditsHide: boolean = false;
    public spanRangeMessageDesc: string = '';
    public controls: Array<any> = [
        { name: 'InvoiceRange' },
        { name: 'CopyInvoices' },
        { name: 'SuppressCredits' },
        { name: 'EmailInvoice' }
    ];
    public invoiceOption: Array<any> = [];
    public inputParamsPrint: Object = {};
    public rangeCount: number = 0;
    public rangeSize: number = 0;
    public invoiceLayoutArr: number[] = [];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBINVOICERUNDATESELECTPRINT2;
        this.pageTitle = 'Invoice Print';
        this.browserTitle = 'Submit Invoice Run Print Selection';
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    ngAfterViewInit(): void {
        this.inputParamsPrint = {
            CompanyCode: this.riExchange.getParentHTMLValue('CompanyCode'),
            BranchNumber: this.riExchange.getParentHTMLValue('BranchNumber'),
            TaxCode: this.riExchange.getParentHTMLValue('TaxCode'),
            InvoiceCreditCode: this.riExchange.getParentHTMLValue('InvoiceCreditCode'),
            ContractTypeCode: this.riExchange.getParentHTMLValue('ContractTypeCode'),
            StartInvoiceNumber: this.riExchange.getParentHTMLValue('StartInvoiceNumber'),
            EndInvoiceNumber: this.riExchange.getParentHTMLValue('EndInvoiceNumber'),
            StartVisualInvoiceNumber: this.riExchange.getParentHTMLValue('StartVisualInvoiceNumber'),
            EndVisualInvoiceNumber: this.riExchange.getParentHTMLValue('EndVisualInvoiceNumber')
        };
        this.loadSystemChars();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        };
    }

    public loadSystemChars(): void {
        let sysNumbers: Array<any> = [
            this.sysCharConstants.SystemCharInvoicePrintRange,
            this.sysCharConstants.SystemCharEnableNextInvoiceNumberEntryBeforeInvoiceRun,
            this.sysCharConstants.SystemCharEnableMultipleInvoiceLayouts,
            this.sysCharConstants.SystemCharReproduceInvoicesForEmail,
            this.sysCharConstants.SystemCharSortInvoicesByInvoiceRange
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.fetchSysChar(sysNumbers)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    if (e.records) {
                        this.systemChars['vEnableInvoicePrintRange'] = e.records[0] ? e.records[0].Required : false;
                        this.systemChars['vInvoicePrintRange'] = e.records[0] ? parseInt(e.records[0].Integer, 0) : false;
                        this.systemChars['vSCEnableNextInvoiceNumberEntry'] = e.records[1] ? e.records[1].Required : false;
                        this.systemChars['vSCEnableMultipleInvoiceLayouts'] = e.records[2] ? e.records[2].Required : false;
                        this.systemChars['vSCNumberOfInvoiceLayouts'] = e.records[2] ? e.records[2].Integer : false;
                        this.systemChars['vReproduceInvoiceForEmail'] = e.records[3] ? e.records[3].Required : false;
                        this.systemChars['vSCSortInvoicesByInvoiceRange'] = e.records[4] ? e.records[4].Required : false;
                        this.setSuppressCreditsValue();
                        this.createRange(this.systemChars['vSCNumberOfInvoiceLayouts']);
                    }
                };
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /*** Method to get system characters
    * @params field- systemchars variables looking for  and type- L,R,I
    */
    public fetchSysChar(sysCharNumbers: any): any {
        let querySysChar: URLSearchParams = this.getURLSearchParamObject();
        querySysChar.set(this.serviceConstants.Action, '0');
        querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(querySysChar);
    }

    public getInvoiceRangeDetails(): void {
        if (this.systemChars['vSCSortInvoicesByInvoiceRange']) {
            let search: URLSearchParams = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '6');
            search.set('StartInvoiceNumber', this.inputParamsPrint['StartInvoiceNumber']);
            search.set('EndInvoiceNumber', this.inputParamsPrint['EndInvoiceNumber']);
            search.set(this.serviceConstants.TaxCode, this.inputParamsPrint['TaxCode'] ? this.inputParamsPrint['TaxCode'].split('-')[0] : '');
            search.set('CurrentInvoiceCreditCode', this.inputParamsPrint['InvoiceCreditCode'] ? this.inputParamsPrint['InvoiceCreditCode'] : '');
            search.set('InvoicePrintRange', this.systemChars['vInvoicePrintRange']);
            let postObj: Object = {};
            postObj['ActionType'] = 'GetInvoiceRangeDetails';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, postObj)
                .subscribe(
                (e) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (e.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                    } else {
                        let invoiceRangeArray: Array<any> = e.InvoiceNumberSplit.split('|');
                        invoiceRangeArray.forEach(item => {
                            let InvoiceRangePair: Array<any> = item.split(',');
                            this.addRange(InvoiceRangePair[0], InvoiceRangePair[1], InvoiceRangePair[2], InvoiceRangePair[3]);
                        });
                        if (this.invoiceOption.length > 0) {
                            this.setControlValue('InvoiceRange', this.invoiceOption[0].value);
                        }
                        this.getSelectFields();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        } else {
            this.rangeSize = (parseInt(this.inputParamsPrint['EndInvoiceNumber'], 0) - parseInt(this.inputParamsPrint['StartInvoiceNumber'], 0)) + 1;

            while (this.rangeSize >= this.systemChars['vInvoicePrintRange']) {
                this.addRange(this.inputParamsPrint['StartInvoiceNumber'], parseInt(this.inputParamsPrint['StartInvoiceNumber'], 0) + (this.systemChars['vInvoicePrintRange'] - 1), this.inputParamsPrint['StartVisualInvoiceNumber'], parseInt(this.inputParamsPrint['StartVisualInvoiceNumber'], 0) + this.systemChars['vInvoicePrintRange'] - 1);

                this.inputParamsPrint['StartInvoiceNumber'] = parseInt(this.inputParamsPrint['StartInvoiceNumber'], 0) + this.systemChars['vInvoicePrintRange'];
                this.inputParamsPrint['StartVisualInvoiceNumber'] = parseInt(this.inputParamsPrint['StartVisualInvoiceNumber'], 0) + this.systemChars['vInvoicePrintRange'];
                this.rangeSize = this.rangeSize - this.systemChars['vInvoicePrintRange'];
            }
            if (this.rangeSize > 0) {
                this.addRange(this.inputParamsPrint['StartInvoiceNumber'], this.inputParamsPrint['EndInvoiceNumber'], this.inputParamsPrint['StartVisualInvoiceNumber'], this.inputParamsPrint['EndVisualInvoiceNumber']);
            }
            if (this.invoiceOption.length > 0) {
                this.setControlValue('InvoiceRange', this.invoiceOption[0].value);
            }
            this.getSelectFields();
        }
    }

    public getSelectFields(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        search.set('RangeCount', String(this.rangeCount));
        if (this.inputParamsPrint['CompanyCode'] && this.inputParamsPrint['BranchNumber'] && this.inputParamsPrint['TaxCode'] && this.inputParamsPrint['InvoiceCreditCode'] && this.inputParamsPrint['ContractTypeCode'])
            search.set('InvoiceRangeParameters', 'CompanyCode_' + this.inputParamsPrint['CompanyCode'] + '|' + 'BranchNumber_' + this.inputParamsPrint['BranchNumber'] + '|' + 'TaxCode_' + this.inputParamsPrint['TaxCode'] + '|' + 'InvoiceCreditCode_' + this.inputParamsPrint['InvoiceCreditCode'] + '|' + 'ContractTypeCode_' + this.inputParamsPrint['ContractTypeCode']);
        else
            search.set('InvoiceRangeParameters', '');
        let postObj: Object = {};
        postObj['ActionType'] = 'GetSelectFields';
        postObj['methodtype'] = 'maintenance';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, postObj)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.spanRangeMessageDesc = e.MessageDesc;
                    if (e.SuppressCreditsText) {
                        this.isSuppressCreditsHide = true;
                        if (e.SuppressCreditsText === 'C') {
                            this.setControlValue('SuppressCredits', false);
                        } else {
                            this.setControlValue('SuppressCredits', true);
                        }
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });

    }
    public setSuppressCreditsValue(): void {
        this.setControlValue('SuppressCredits', true);
        if (this.systemChars['vSCEnableNextInvoiceNumberEntry']) {
            this.isSuppressCreditsHide = true;
            this.inputParamsPrint['CurrentInvoiceCreditCode'] = this.riExchange.getParentHTMLValue('CurrentInvoiceCreditCode');
            if (this.inputParamsPrint['CurrentInvoiceCreditCode'] === 'C') {
                this.setControlValue('SuppressCredits', false);
            } else if (this.inputParamsPrint['CurrentInvoiceCreditCode'] === 'Invoice') {
                this.setControlValue('SuppressCredits', true);
            }
        } else {
            this.isSuppressCreditsHide = false;
        }
        this.getInvoiceRangeDetails();
    }
    public addRange(rintRangeStart: any, rintRangeEnd: any, rintVisualRangeStart: any, rintVisualRangeEnd: any): void {
        this.addOption(rintRangeStart + ',' + rintRangeEnd, rintVisualRangeStart + ' - ' + rintVisualRangeEnd);
    }
    public addOption(rstrValue: any, rstrText: any): void {
        this.invoiceOption.push({ value: rstrValue, text: rstrText });
        this.rangeCount = this.rangeCount + 1;
    }
    public createRange(num: number): any {
        for (let i = 1; i <= num; i++) {
            this.invoiceLayoutArr.push(i);
            this.controls.push({ name: 'InvoiceLayout' + i });
        }
        if (this.invoiceLayoutArr.length === num) {
            this.riExchange.renderForm(this.uiForm, this.controls);
        }
    }
    //on Confirm
    public onConfirm(): void {
        let layoutNumber: number = 0,
            selectedLayout: number = 0,
            selectedCnt: number = 0;
        if (this.systemChars['vSCEnableMultipleInvoiceLayouts']) {
            while (layoutNumber < this.systemChars['vSCNumberOfInvoiceLayouts']) {
                layoutNumber = layoutNumber + 1;
                if (this.getControlValue('InvoiceLayout' + layoutNumber)) {
                    selectedLayout = layoutNumber;
                    selectedCnt = selectedCnt + 1;
                };
            }
            if (selectedCnt === 1) {
                this.print(String(selectedLayout));
            } else if (selectedCnt < 1) {
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.invoiceRunDatePrint2.selectLayout));
            } else if (selectedCnt > 1) {
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.invoiceRunDatePrint2.selectOnlyOneLayout));
            }
        } else {
            this.print(String(selectedLayout));
        }
    }
    public print(layoutNum: string): void {
        let invoiceNumbers: any = this.getControlValue('InvoiceRange').split(','), postData = {}, search: URLSearchParams = this.getURLSearchParamObject();
        postData['Function'] = 'UserRange';
        search.set(this.serviceConstants.Action, '6');
        if (this.inputParamsPrint['CompanyCode'] && this.inputParamsPrint['BranchNumber'] && this.inputParamsPrint['TaxCode'] && this.inputParamsPrint['InvoiceCreditCode'] && this.inputParamsPrint['ContractTypeCode']) {
            search.set('InvoiceRangeParameters', 'CompanyCode_' + this.inputParamsPrint['CompanyCode'] + '|' + 'BranchNumber_' + this.inputParamsPrint['BranchNumber'] + '|' + 'TaxCode_' + this.inputParamsPrint['TaxCode'] + '|' + 'InvoiceCreditCode_' + this.inputParamsPrint['InvoiceCreditCode'] + '|' + 'ContractTypeCode_' + this.inputParamsPrint['ContractTypeCode']);
        } else {
            search.set('InvoiceRangeParameters', '');
        }
        search.set('StartInvoiceNumber', invoiceNumbers[0]);
        search.set('EndInvoiceNumber', invoiceNumbers[1]);
        search.set('Copy', this.getControlValue('CopyInvoices') ? 'true' : 'false');
        search.set('EmailInvoice', this.getControlValue('EmailInvoice') ? 'true' : 'false');
        search.set('SuppressCredits', this.getControlValue('SuppressCredits') ? 'true' : 'false');
        search.set('LayoutNumber', layoutNum ? layoutNum : '');
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, postData).subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (!e.fullError) {
                    window.open(e.url, '_blank');
                } else {
                    window.open(e.fullError, '_blank');
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }
}
