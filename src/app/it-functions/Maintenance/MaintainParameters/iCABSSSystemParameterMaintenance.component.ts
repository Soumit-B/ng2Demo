import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { HttpService } from './../../../../shared/services/http-service';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSSSystemParameterMaintenance.html'
})
export class SystemParameterMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public method: string = 'it-functions/admin';
    public module: string = 'configuration';
    public operation: string = 'System/iCABSSSystemParameterMaintenance';

    public errorMessage: string;
    public isFormEnabled: boolean = false;
    public isFormValid: boolean = false;

    /*## Initiate Form Elements ##*/
    public controls = [
        { name: 'SystemParameterEndOFWeekDay', readonly: false, disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'CentralDocumentServer', readonly: false, disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'ReportServer', readonly: false, disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'PCDocumentDirectory', readonly: false, disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'UnixExportDirectory', readonly: false, disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'BatchProcessEmail', readonly: false, disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'SystemPerformanceEmail', readonly: false, disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'SystemPerformanceMaxDuration', readonly: false, disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'NextSiteReviewNumberOfMonths', readonly: false, disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'OACompanyNumber', readonly: false, disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'OADatabaseName', readonly: false, disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'OAConnectionString', readonly: false, disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'OASalesLedger', readonly: false, disabled: false, required: false },
        { name: 'OAGeneralLedger', readonly: false, disabled: false, required: false },
        { name: 'HTTPProxyHost', readonly: false, disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'HTTPProxyPort', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'NextBPayNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'ttSystemParameter', readonly: false, disabled: false, required: false },
        { name: 'SystemParameterKey', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSYSTEMPARAMETERMAINTENANCE;
    }

    @ViewChild('messageModal') public messageModal;

    ngOnInit(): void {
        super.ngOnInit();
        this.getFormData();
        this.utils.setTitle('System Parameter Maintenance');
    }

    /*## Populate Form Data From API Call ##*/
    public getFormData(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search)
            .subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.errorService.emitError(data);
                } else {
                    this.setControlValue('SystemParameterKey', data.SystemParameterKey);
                    this.setControlValue('ttSystemParameter', data.ttSystemParameter);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SystemParameterEndOFWeekDay', data.SystemParameterEndOfWeekDay);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CentralDocumentServer', data.CentralDocumentServer);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ReportServer', data.ReportServer);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PCDocumentDirectory', data.PCDocumentDirectory);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'UnixExportDirectory', data.UnixExportDirectory);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessEmail', data.BatchProcessEmail);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SystemPerformanceEmail', data.SystemPerformanceEmail);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SystemPerformanceMaxDuration', data.SystemPerformanceMaxDuration);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'NextSiteReviewNumberOfMonths', data.NextSiteReviewNumberOfMonths);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OACompanyNumber', data.OACompanyNumber);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OADatabaseName', data.OADatabaseName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OAConnectionString', data.OAConnectionString);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OASalesLedger', data.OASalesLedger);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OAGeneralLedger', data.OAGeneralLedger);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'HTTPProxyHost', data.HTTPProxyHost);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'HTTPProxyPort', data.HTTPProxyPort);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'NextBPayNumber', data.NextBPayNumber);
                    //this.isFormValid = true;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /*## Save Form Data On Submit ##*/
    public saveParameterMaintenance(event: any): void {
        //Mark required properties if left blank
        for (let i in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(i)) {
                this.uiForm.controls[i].markAsTouched();
                if (this.uiForm.controls[i].errors && this.uiForm.controls[i].value !== '') {
                    this.uiForm.controls[i].clearValidators();
                }
            }
        }

        let formdata: Object = {};
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        formdata['ROWID'] = this.getControlValue('ttSystemParameter');
        formdata['SystemParameterEndOFWeekDay'] = this.uiForm.controls['SystemParameterEndOFWeekDay'].value;
        formdata['CentralDocumentServer'] = this.uiForm.controls['CentralDocumentServer'].value;
        formdata['ReportServer'] = this.uiForm.controls['ReportServer'].value;
        formdata['PCDocumentDirectory'] = this.uiForm.controls['PCDocumentDirectory'].value;
        formdata['UnixExportDirectory'] = this.uiForm.controls['UnixExportDirectory'].value;
        formdata['BatchProcessEmail'] = this.uiForm.controls['BatchProcessEmail'].value;
        formdata['SystemPerformanceEmail'] = this.uiForm.controls['SystemPerformanceEmail'].value;
        formdata['SystemPerformanceMaxDuration'] = this.uiForm.controls['SystemPerformanceMaxDuration'].value;
        formdata['NextSiteReviewNumberOfMonths'] = this.uiForm.controls['NextSiteReviewNumberOfMonths'].value;
        formdata['OACompanyNumber'] = this.uiForm.controls['OACompanyNumber'].value;
        formdata['OADatabaseName'] = this.uiForm.controls['OADatabaseName'].value;
        formdata['OAConnectionString'] = this.uiForm.controls['OAConnectionString'].value;
        formdata['OASalesLedger'] = this.uiForm.controls['OASalesLedger'].value;
        formdata['OAGeneralLedger'] = this.uiForm.controls['OAGeneralLedger'].value;
        formdata['HTTPProxyHost'] = this.uiForm.controls['HTTPProxyHost'].value;
        formdata['HTTPProxyPort'] = this.uiForm.controls['HTTPProxyPort'].value;
        formdata['NextBPayNumber'] = this.uiForm.controls['NextBPayNumber'].value;
        if (this.uiForm.valid) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.ajaxSubscription = this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
                .subscribe(
                (e) => {
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                    } else {
                        if (e.errorMessage && e.errorMessage !== '') {
                            setTimeout(() => {
                                this.errorService.emitError(e);
                            }, 200);
                        } else {
                            this.messageService.emitMessage(e);
                            //this.disableForm();
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                    this.getFormData();
                },
                (error) => {
                    this.errorMessage = error as any;
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
                );
        }
    }

    /**
     *   Cancel button click and Reset Form
     */

    public resetData(): void {
        this.getFormData();

    }

    /*   public disableForm(): void {
           this.isFormEnabled = false;
           this.uiForm.reset();
       }*/

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.ajaxSubscription.unsubscribe();
    }

}

