import { ErrorCallback, MessageCallback } from './../../base/Callback';
import { ValueVisitor } from '@angular/compiler/src/util';
import { PromptModalComponent } from './../../../shared/components/prompt-modal/prompt-modal';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { PaymentSearchComponent } from './../search/iCABSBPaymentTypeSearch';
import { Component, ViewChild, AfterViewInit, OnInit, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSSOQuoteSubmitMaintenance.html'
})

export class QuoteSubmitMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, ErrorCallback, MessageCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;

    private readonly CONFIRM_CANCEL: string = 'CONFIRM_CANCEL';
    private readonly CONFIRM_SAVE: string = 'CONFIRM_SAVE';

    public pageId: string;
    private curPageMode: string;
    public hasErrorProcessedVADDInd: boolean = false;

    //Form variables
    public controls: any[] = [
        { name: 'PaymentTypeCode', required: true },
        { name: 'PaymentDesc', disabled: true },
        { name: 'AuthorityCode' },
        { name: 'ProcessedVADDInd', required: true },
        { name: 'MandateRequired' },
        { name: 'ReferenceRequired' },
        { name: 'dlBatchRef' },
        { name: 'dlRecordType' },
        { name: 'dlExtRef' },
        { name: 'dlContractRef' },
        { name: 'QuoteNumber' },
        { name: 'ProspectNumber' },
        { name: 'SubmitMessage' }
    ];

    //Hidden controls
    public hideControl: any = {
        AuthorityCode: false,
        ProcessedVADDInd: false
    };

    //API variables
    public xhrConfig = {
        method: 'prospect-to-contract/maintenance',
        module: 'advantage',
        operation: 'Sales/iCABSSSOQuoteSubmitMaintenance'
    };

    //Modal variables
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public showPromptHeader: boolean = true;
    public promptTitle: string = MessageConstant.Message.ConfirmRecord;
    public promptContent: string = '';

    //Ellipsis variables
    public ellipsConf: any = {
        paymentTypeCode: {
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'businessCode': '',
                'countryCode': '',
                action: 0
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PaymentSearchComponent,
            showHeader: true
        }
    };

    //LookUp varuables
    private ttPaymentDesc = '';
    private ttMandateRequired = '';
    private ttReferenceRequired = '';

    //Page Business logis
    private rowID: any;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMPROSPECTCONVERSIONMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.ellipsConf.paymentTypeCode.childConfigParams.businessCode = this.businessCode();
        this.ellipsConf.paymentTypeCode.childConfigParams.countryCode = this.countryCode();
    }

    ngAfterViewInit(): void {
        // Set message call back
        this.setMessageCallback(this);
        this.messageModal.showCloseButton = false;

        // Set error message call back
        this.setErrorCallback(this);

        this.initPage();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    }

    public onModalClose(): void {
        this.location.back();
    }

    public promptSave(e: any): void {
        if (e.value === PromptModalComponent.SAVE) {
            if (e.data.action === this.CONFIRM_SAVE) {
                this.doSave();
            }
        }
    }

    private initPage(): void {
        //get parent page ValueVisitor
        this.setControlValue('ProspectNumber', this.riExchange.getParentAttributeValue('ProspectNumber'));
        this.setControlValue('QuoteNumber', this.riExchange.getParentAttributeValue('QuoteNumber'));
        this.rowID = this.riExchange.getParentAttributeValue('dlContractRowID');

        if (this.rowID) {
            this.fetchRecord();
        }
    }

    private fetchRecord(): void {
        let queryParams: any;
        queryParams = this.getURLSearchParamObject();
        queryParams.set(this.serviceConstants.Action, '0');
        queryParams.set('dlContractROWID', this.rowID);
        queryParams.set('dlBatchRef', this.getControlValue('dlBatchRef'));
        queryParams.set('dlRecordType', this.getControlValue('dlRecordType'));
        queryParams.set('dlContractRef', this.getControlValue('dlContractRef'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrConfig.method, this.xhrConfig.module,
            this.xhrConfig.operation, queryParams)
            .subscribe(
            (value) => {
                if (value.hasError) {
                    this.errorService.emitError(value);
                } else {
                    this.populateDataToForm(value);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
    private populateDataToForm(data: any): void {
        if (data) {
            //this.setControlValue('dlContract', data.dlContract);
            this.setControlValue('dlBatchRef', data.dlBatchRef);
            this.setControlValue('dlContractRef', data.dlContractRef);
            this.setControlValue('PaymentTypeCode', data.PaymentTypeCode);
            this.setControlValue('PaymentDesc', data.PaymentDesc);
            this.setControlValue('AuthorityCode', data.AuthorityCode);
            this.setControlValue('ReferenceRequired', data.ReferenceRequired);
            this.setControlValue('MandateRequired', data.MandateRequired);

            setTimeout(function (): void {
                this.doLookup();
                this.populatePaymentCodeFields();
            }.bind(this), 1000);
        }
    }

    public onChangePaymentTypeCode(e: any): void {
        this.populatePaymentCodeFields();
    }

    private populatePaymentCodeFields(): void {
        let queryParams: any, formData: any = {};
        queryParams = this.getURLSearchParamObject();
        queryParams.set(this.serviceConstants.Action, '6');

        //body Params
        formData['Function'] = 'GetPaymentTypeCodeDetails';
        formData['PaymentTypeCode'] = this.getControlValue('PaymentTypeCode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrConfig.method, this.xhrConfig.module,
            this.xhrConfig.operation, queryParams, formData)
            .subscribe(
            (value) => {
                if (value.hasError) {
                    //this.errorService.emitError(value);
                } else {
                    this.populatePaymentCodeFieldsToForm(value);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                //this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
    private populatePaymentCodeFieldsToForm(data: any): void {
        if (data) {
            this.setControlValue('ReferenceRequired', false);
            this.setControlValue('MandateRequired', false);

            if (data.ReferenceRequired && data.ReferenceRequired.toLowerCase() === 'yes') {
                this.setControlValue('ReferenceRequired', true);
            }
            if (data.MandateRequired && data.MandateRequired.toLowerCase() === 'yes') {
                this.setControlValue('MandateRequired', true);
            }
            this.setControlValue('PaymentDesc', data.PaymentDesc);
            setTimeout(function (): void {
                this.refreshPaymentCodeFields();
            }.bind(this), 1000);

        }
    }

    private refreshPaymentCodeFields(): void {
        let referenceRequired: any = this.getControlValue('ReferenceRequired'),
            mandateRequired: any = this.getControlValue('MandateRequired');

        if (referenceRequired) {
            this.hideControl.AuthorityCode = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AuthorityCode', true);
        } else {
            this.hideControl.AuthorityCode = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AuthorityCode', false);
        }

        if (mandateRequired) {
            this.hideControl.ProcessedVADDInd = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProcessedVADDInd', true);
        } else {
            this.hideControl.ProcessedVADDInd = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProcessedVADDInd', false);
        }
    }

    //Start: Loockup functionality
    public doLookup(): void {
        let paymentTypeCode = this.getControlValue('PaymentTypeCode');
        let data = [
            {
                'table': 'PaymentType',
                'query': { 'PaymentTypeCode': paymentTypeCode, 'BusinessCode': this.businessCode() },
                'fields': ['PaymentDesc', 'MandateRequired', 'ReferenceRequired']
            }
        ];

        this.lookUpRecord(data, 500).subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                } else {
                    if (e['results'] && e['results'].length > 0) {

                        if (e['results'] && e['results'][0].length > 0) {
                            let paymentType: any[] = [];

                            if (e['results'].length > 0 && e['results'][0].length > 0) {
                                paymentType = e['results'][0];
                            }
                        }
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    public lookUpRecord(data: any, maxresults: any): any {
        let queryLookUp = this.getURLSearchParamObject();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(queryLookUp, data);
    }
    //End: Loockup functionality

    //Start: Ellipsis functionality
    public onPaymentTypeCodeEllipsisDataReceived(data: any): void {
        if (data) {
            this.setControlValue('PaymentTypeCode', data.PaymentTypeCode);
            this.setControlValue('PaymentDesc', data.PaymentDesc);
            setTimeout(function (): void {
                this.populatePaymentCodeFields();
            }.bind(this), 1000);
        }
    }
    //End: Ellipsis functionality

    //Start: Save functionality
    public onClickSaveBtn(): void {
        this.riMaintenance_BeforeSave();
    }
    private riMaintenance_BeforeSave(): void {
        let isValid: boolean,
            mandateRequired: any = this.getControlValue('MandateRequired');
        this.hasErrorProcessedVADDInd = false;
        isValid = this.riExchange.validateForm(this.uiForm);
        if (!this.getControlValue('ProcessedVADDInd')) {
            isValid = false;
            this.hasErrorProcessedVADDInd = true;
        }
        if (isValid) {
            this.promptModal.show({ 'action': this.CONFIRM_SAVE });
        }
    }
    private doSave(): void {
        let queryParams: any, formData: any = {};
        queryParams = this.getURLSearchParamObject();
        queryParams.set(this.serviceConstants.Action, '2');

        //body Params
        formData['dlContractROWID'] = this.rowID;
        formData['dlBatchRef'] = this.getControlValue('dlBatchRef');
        formData['dlRecordType'] = this.getControlValue('dlRecordType');
        formData['dlContractRef'] = this.getControlValue('dlContractRef');
        formData['PaymentTypeCode'] = this.getControlValue('PaymentTypeCode');
        formData['AuthorityCode'] = this.getControlValue('AuthorityCode');
        formData['SubmitMessage'] = this.getControlValue('SubmitMessage');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrConfig.method, this.xhrConfig.module,
            this.xhrConfig.operation, queryParams, formData)
            .subscribe(
            (value) => {
                if (value.hasError) {
                    this.errorService.emitError(value);
                } else {
                    this.location.back();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
    //End: Save functionality

    //Start: Cancel functionality
    public doCancel(): void {
        this.location.back();
    }
    //End: Cancel functionality
}
