import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from './../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSARGenerateNextInvoiceRunForecast.html'
})

export class ARGenerateNextInvoiceRunForecastComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public isRequesting: boolean;
    public thInformation: any;
    public thInformationDisplayed: boolean = false;
    public controls = [
        { name: 'BusinessCode', required: true, type: MntConst.eTypeCode },
        { name: 'BusinessDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ForecastDate', required: true, type: MntConst.eTypeDate },
        { name: 'IncludeAdvancedContracts', type: MntConst.eTypeCheckBox },
        { name: 'IncludeArrearsContracts', type: MntConst.eTypeCheckBox },
        { name: 'IncludeJobs', type: MntConst.eTypeCheckBox },
        { name: 'IncludeCredits', type: MntConst.eTypeCheckBox },
        { name: 'ContractNumberString', type: MntConst.eTypeTextFree }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSARGENERATENEXTINVOICERUNFORECAST;
        this.browserTitle = 'Generate Next Invoice Run Forecast Report';
    }

    public xhrParams: any = {
        operation: 'ApplicationReport/iCABSARGenerateNextInvoiceRunForecast',
        module: 'invoicing',
        method: 'bill-to-cash/batch'
    };

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnload(): void {
        this.setControlValue('BusinessCode', this.utils.getBusinessCode());
        this.utils.getBusinessDesc(this.utils.getBusinessCode(), this.countryCode()).subscribe((data) => {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessDesc', data.BusinessDesc);
        });
        this.setControlValue('IncludeAdvancedContracts', true);
        this.setControlValue('IncludeArrearsContracts', true);
        this.setControlValue('IncludeJobs', true);
        this.setControlValue('IncludeCredits', true);
        this.setControlValue('ForecastDate', new Date());
    }

    /*
    Method invoked on clicking submit button
    */
    public generateReport(event: any): void {
        if (this.getControlValue('ForecastDate')) {
            this.postRequestInvoiceRunCheck();
        }
    }

    /*
    Method to check if Invoice is already running
    */
    public postRequestInvoiceRunCheck(): void {
        let searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'InvoiceRunCheck';
        postParams.ForecastDate = this.globalize.parseDateToFixedFormat(this.getControlValue('ForecastDate'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                else {
                    this.submitReportRequest();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    /*
    Method for creating report
    */
    public submitReportRequest(): void {
        let strDescription = 'Next Invoice Run Forecast';
        let strProgramName = 'iCABSInvoiceRoutineBatch.p';
        let date = new Date();
        let strStartDate: any = this.globalize.parseDateToFixedFormat(date);
        let strStartTime: any = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
        let strParamName = 'BusinessCodeExtractDateNextInvoiceRunForecastIncludeAdvancedContractsIncludeArrearsContractsIncludeJobsIncludeCreditsContractNumberString';
        let strParamValue = this.getControlValue('BusinessCode') + '' + this.globalize.parseDateToFixedFormat(this.getControlValue('ForecastDate')).toString() + '' +
            'true' + '' + this.getControlValue('IncludeAdvancedContracts') + '' +
            this.getControlValue('IncludeArrearsContracts') + '' + this.getControlValue('IncludeJobs') + '' + this.getControlValue('IncludeCredits') + '' + this.getControlValue('ContractNumberString') + '';
        let searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'InvoiceRoutineRunCheck';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (e.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                else {
                    let searchParams = this.getURLSearchParamObject();
                    searchParams.set(this.serviceConstants.Action, '0');
                    searchParams.set('Description', strDescription);
                    searchParams.set('ProgramName', strProgramName);
                    searchParams.set('StartDate', strStartDate);
                    searchParams.set('StartTime', strStartTime.toString());
                    searchParams.set('Report', 'Batch');
                    searchParams.set('ParameterName', strParamName);
                    searchParams.set('ParameterValue', strParamValue);
                    this.ajaxSource.next(this.ajaxconstant.START);
                    this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module,
                        this.xhrParams.operation, searchParams)
                        .subscribe(
                        (e) => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                            if (e.hasError) {
                                this.thInformation = e.fullError;
                                this.thInformationDisplayed = true;
                            }

                        },
                        (error) => {
                            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                        });
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }
}
