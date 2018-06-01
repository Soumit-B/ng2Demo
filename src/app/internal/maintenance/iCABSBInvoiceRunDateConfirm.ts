import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from './../../base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Http, URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageCallback, ErrorCallback } from './../../base/Callback';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';

@Component({
    templateUrl: 'iCABSBInvoiceRunDateConfirm.html'
})

export class InvoiceRunDateConfirmComponent extends BaseComponent implements OnInit, AfterViewInit, ErrorCallback, MessageCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('ScheduleStartDatepicker') public ScheduleStartDatepicker: DatepickerComponent;
    @ViewChild('TaxPointDateDatepicker') public TaxPointDateDatepicker: DatepickerComponent;

    public pageId: string;
    public search: URLSearchParams = new URLSearchParams();
    public queryPost: URLSearchParams = new URLSearchParams();
    public errorMessage: string;
    public pageTitle: string = '';
    public messageContentError: string;
    public messageContentSave: string;
    public promptConfirmContent: string;
    public vSCEnableNextInvoiceNumberEntry: boolean = false;
    public hideNextCreditNumber: boolean = false;
    public hideNextInvoiceNumber: boolean = false;
    public hideTaxPointDate: boolean = false;
    public date: any;
    public scheduleStartDate: Date = new Date();
    public taxPointDateValue: Date = null;

    public queryParams: any = {
        module: 'invoicing',
        operation: 'Business/iCABSBInvoiceRunDateConfirm',
        method: 'bill-to-cash/admin'
    };

    public controls = [
        { name: 'ExtractDate', readonly: true, disabled: false, required: false },
        { name: 'ScheduleStartTime', readonly: true, disabled: false, required: true },
        { name: 'ScheduleStartDate', disabled: false, required: true },
        { name: 'InvoiceRunDateRowID', readonly: true, disabled: false, required: false },
        { name: 'NextInvoiceNumber', required: false },
        { name: 'NextCreditNumber', required: false },
        { name: 'TaxPointDate', required: false }

    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBINVOICERUNDATECONFIRM;
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.messageContentError = MessageConstant.Message.SaveError;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Submit Invoice Run Confirm';
        this.setControlValue('InvoiceRunDateRowID',
            this.riExchange.getParentHTMLValue('InvoiceRunDateRowID'));
        this.getSysCharDtetails();
        this.window_onload();
        this.ShowTaxPointDate();
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableNextInvoiceNumberEntryBeforeInvoiceRun];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.vSCEnableNextInvoiceNumberEntry = record[0]['Required'];
            if (this.vSCEnableNextInvoiceNumberEntry) {
                this.hideNextCreditNumber = true;
                this.hideNextInvoiceNumber = true;
            }
        });
    }

    public ngAfterViewInit(): void {
        this.setErrorCallback(this);
        this.setMessageCallback(this);
        this.setFormMode(this.c_s_MODE_UPDATE);
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }

    public window_onload(): void {
        this.setControlValue('ExtractDate', this.riExchange.getParentHTMLValue('ExtractDate'));
        let hours = new Date().getHours();
        // hours = hours > 12 ? hours - 12 : hours;
        this.date = ((hours * 3600) + ((new Date().getMinutes()) * 60));
        this.setControlValue('ScheduleStartTime', this.utils.secondsToHms(this.date));
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.Function, 'ShowTaxPointDate');
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    //this.messageModal.show(data, true);
                    this.errorService.emitError(data);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                //this.messageModal.show(error, true);
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('ScheduleStartDate', value.value);
        } else {
            this.setControlValue('ScheduleStartDate', '');
        }
    }

    public taxPointDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('TaxPointDate', value.value);
        } else {
            this.setControlValue('TaxPointDate', '');
        }
    }

    public runDateConfirmcheck(): void {
        if (this.hideTaxPointDate) {
            if (this.getControlValue('TaxPointDate') === '') {
                let taxPointDate = document.querySelector('#TaxPointDate input[type="text"]');
                this.utils.removeClass(taxPointDate, 'ng-untouched');
                this.utils.addClass(taxPointDate, 'ng-touched');
            }
        }
        if (this.getControlValue('ScheduleStartDate') === '') {
            this.uiForm.controls['ScheduleStartDate'].markAsTouched();
        }
        this.ScheduleStartDatepicker.validateDateField();
        if (this.riExchange.validateForm(this.uiForm)) {
            this.runDateConfirm();
        }
    }


    //confirm
    public runDateConfirm(): void {
        let formdata: Object = {};
        if (!this.riExchange.riInputElement.isError(this.uiForm, 'TaxPointDate')) {
            formdata['InvoiceRunDateRowID'] = this.getControlValue('InvoiceRunDateRowID');
            formdata['ExtractDate'] = this.getControlValue('ExtractDate');
            if (this.hideTaxPointDate) {
                formdata['TaxPointDate'] = this.getControlValue('TaxPointDate');
            }
            formdata['ScheduleStartTime'] = this.date;
            formdata['ScheduleStartDate'] = this.getControlValue('ScheduleStartDate');
            if (this.hideNextCreditNumber && this.hideNextInvoiceNumber) {
                formdata['NextCreditNumber'] = this.getControlValue('NextCreditNumber');
                formdata['NextInvoiceNumber'] = this.getControlValue('NextInvoiceNumber');
            }
            this.queryPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.queryPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.queryPost.set(this.serviceConstants.Action, '0');
            this.queryParams.search = this.queryPost;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryPost, formdata)
                .subscribe(
                (res) => {
                    if (res.hasError) {
                        //this.messageModal.show(res, true);
                        this.errorService.emitError(res);
                    } else {
                        this.navigate('', '/billtocash/rundatesgrid');
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    //this.messageModal.show(error, true);
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });

        }
    }

    public ShowTaxPointDate(): void {
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Function, 'ShowTaxPointDate');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    //this.messageModal.show(data, true);
                    this.errorService.emitError(data);
                }
                else {
                    if (data.ShowTaxPointDate === 'yes') {
                        this.hideTaxPointDate = true;
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TaxPointDate', true);

                    } else {
                        this.hideTaxPointDate = false;
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TaxPointDate', false);
                        this.setControlValue('TaxPointDate', '');
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                //this.messageModal.show(error, true);
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );

    }
    public formatTime(e: any): void {
        let time: any = e.srcElement.value;
        // console.log((time.match(/:/g) || []).length);
        if ((time.match(/:/g) || []).length < 1) {
            time = time.replace(/(..?)/g, '$1:').slice(0, -1);
            this.setControlValue('ScheduleStartTime', time);
        };
    };
}

