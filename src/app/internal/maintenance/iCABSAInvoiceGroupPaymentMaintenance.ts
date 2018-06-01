
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
import { InvoiceGroupGridComponent } from '../grid-search/iCABSAInvoiceGroupGrid';
import { PaymentTermSearchComponent } from '../search/iCABSBPaymentTermSearch.component';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BillToCashConstants } from '../../bill-to-cash/bill-to-cash-constants';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { Route, ActivatedRoute, Params } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';
import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Subscription } from 'rxjs';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';

@Component({
    templateUrl: 'iCABSAInvoiceGroupPaymentMaintenance.html'
})

export class InvoiceGroupPaymentMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModalForSave') public promptModalForSave;
    @ViewChild('invoiceGroupEllipsis') public invoiceGroupEllipsis: EllipsisComponent;
    @ViewChild('paymentTermEllipsis') public paymentTermEllipsis: EllipsisComponent;
    public pageId: string;
    public messageContentError: string;
    public showErrorHeader: boolean = true;
    public messageContentSave: string;
    public queryPost: URLSearchParams = new URLSearchParams();
    public errorMessage: string;
    public uiForm: FormGroup;
    public promptConfirmContent: string;
    public showMessageHeader = true;
    public showMessageHeaderSave: boolean = true;
    public showPromptCloseButtonSave: boolean = true;
    public promptTitleSave: string = '';
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public showHeader = true;
    public showCloseButton = true;
    public modalConfig: Object;
    public controls = [];
    public autoOpenSearch: boolean = false;
    public lookUpSubscription: Subscription;
    public promptModalConfigSave = {
        ignoreBackdropClick: true
    };
    public cloneObj: Object = {};
    public formdata: Object = {};

    // inputParams
    public inputParams: any = {
        Operation: 'Application/iCABSAInvoiceGroupPaymentMaintenance',
        method: 'bill-to-cash/maintenance',
        module: 'payment',
        action: '',
        parentMode: '',
        businessCode: '',
        countryCode: ''
    };

    // Ellipsis Component
    public invoiceGroupGridComponent = InvoiceGroupGridComponent;
    public PaymentTermSearchComponent = PaymentTermSearchComponent;
    public accountSearchComponent = AccountSearchComponent;
    public ellipsisQueryParams: any = {
        inputParamsAccountNumber: {
            parentMode: 'AccountSearch',
            showAddNewDisplay: false
        },
        inputParamsInvoiceGroupNumber: {
            parentMode: 'Lookup'
        },
        inputParamsPaymentTermSearch: {
            parentMode: 'LookUp-Active'
        }
    };
    public ellipsis: any = {
        account: {
            disable: false
        },
        invoice: {
            disable: true
        },
        payment: {
            disable: true
        }
    };

    public formClone: any;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICEGROUPPAYMENTMAINTENANCE;
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.messageContentError = MessageConstant.Message.SaveError;
    }

    public ngAfterViewInit(): void {
        this.autoOpenSearch = true;
        // Set message call back
        this.setMessageCallback(this);
        // Set error message call back
        this.setErrorCallback(this);
    }

    public ngOnInit(): void {
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.inputParams.countryCode = this.utils.getCountryCode();

        // Initialize Form
        this.buildForm();
        this.disableControl('Save', true);
        this.disableControl('Cancel', true);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }

    private buildForm(): void {
        this.uiForm = this.formBuilder.group({
            AccountNumber: [{ value: '', disabled: false }, Validators.required],
            AccountName: [{ value: '', disabled: true }],
            InvoiceGroupNumber: [{ value: '', disabled: true }, Validators.required],
            InvoiceGroupName: [{ value: '', disabled: true }],
            PaymentTermNumber: [{ value: '', disabled: true }, Validators.required],
            PaymentTermDesc: [{ value: '', disabled: true }],
            Save: [{ disabled: true }],
            Cancel: [{ disabled: true }]
        });
    }

    //AccountNumver Received
    public onAccountNumberReceived(data: any): void {
        let accountNumber = data[this.serviceConstants.AccountNumber];
        let accountName = data['AccountName'];
        // Set Account Number
        this.setControlValue(this.serviceConstants.AccountNumber, accountNumber);
        this.setControlValue('AccountName', accountName);
        this.setControlValue('InvoiceGroupNumber', '');
        this.setControlValue('PaymentTermNumber', '');
        this.setControlValue('PaymentTermDesc', '');

        this.disableControl('InvoiceGroupNumber', false);
        this.disableControl('PaymentTermNumber', true);
        this.ellipsis.invoice.disable = false;
        this.ellipsis.payment.disable = true;
        this.formClone = this.uiForm.getRawValue();
        // Update ellipsis
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = accountNumber;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = accountName;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountNumberChanged'] = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['parentMode'] = 'InvoiceGroupPaymentMaintenance';
        this.invoiceGroupEllipsis.childConfigParams = this.ellipsisQueryParams.inputParamsInvoiceGroupNumber;
        this.setFormMode(this.c_s_MODE_UPDATE);
    }

    //InvoiceGroupNumber Received
    public onInvoiceGroupNumberReceived(data: any): void {
        let invoiceGroupNumber = data['Number'];
        let invoiceGroupName = data['Description'];

        // Set Invoice Group Number
        this.setControlValue('InvoiceGroupNumber', invoiceGroupNumber);
        this.setControlValue('InvoiceGroupName', invoiceGroupName);
        //this.disableControl('InvoiceGroupNumber', true);
        this.disableControl('PaymentTermNumber', false);
        this.disableControl('Save', false);
        this.disableControl('Cancel', false);
        this.ellipsis.payment.disable = false;
        this.formClone = this.uiForm.getRawValue();
        this.onPaymentTermNumberReceived();
        this.setFormMode(this.c_s_MODE_UPDATE);

    }

    //PaymentTerm Received
    public onPaymentTermReceived(data: any): void {
        let PaymentTermNumber = data['PaymentTermNumber'];
        let PaymentTermDesc = data['PaymentTermDesc'];
        // Set Invoice Group Number
        this.setControlValue('PaymentTermNumber', PaymentTermNumber);
        this.setControlValue('PaymentTermDesc', PaymentTermDesc);
        this.setFormMode(this.c_s_MODE_UPDATE);

    }

    public onAccountNumberChange(event: any): void {
        this.setControlValue('AccountName', '');
        this.setControlValue('InvoiceGroupNumber', '');
        this.setControlValue('PaymentTermNumber', '');
        this.setControlValue('PaymentTermDesc', '');
        this.disableControl('PaymentTermNumber', true);
        this.disableControl('Save', true);
        this.disableControl('Cancel', true);
        this.setFormMode(this.c_s_MODE_SELECT);
        this.formClone = this.uiForm.getRawValue();
        //this.ellipsis.invoice.disable = true;
        this.ellipsis.payment.disable = true;
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber[this.serviceConstants.AccountNumber] = this.getControlValue(this.serviceConstants.AccountNumber);
        this.ellipsisQueryParams.inputParamsInvoiceGroupNumber['AccountName'] = this.getControlValue('AccountName');
    }

    public onInvoiceNumberChange(event: any): void {
        this.setControlValue('PaymentTermNumber', '');
        this.setControlValue('PaymentTermDesc', '');
        this.disableControl('PaymentTermNumber', true);
        this.disableControl('Save', true);
        this.disableControl('Cancel', true);
        this.ellipsis.payment.disable = true;
        this.formClone = this.uiForm.getRawValue();
    }

    // SavePrompt
    public saveInvoiceGroupData(): void {
        let lookupIP = [
            {
                'table': 'InvoiceGroup',
                'query': {
                    'AccountNumber': this.getControlValue('AccountNumber'),
                    'BusinessCode': this.utils.getBusinessCode(),
                    'InvoiceGroupNumber': this.getControlValue('InvoiceGroupNumber'),
                    'PaymentTermCode': this.getControlValue('PaymentTermNumber')
                },
                'fields': ['PaymentTermCode']
            },
            {
                'table': 'Account',
                'query': { 'AccountNumber': this.getControlValue('AccountNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['AccountName']
            },
            {
                'table': 'PaymentTerm',
                'query': {
                    'PaymentTermCode': this.getControlValue('PaymentTermNumber'),
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['PaymentTermDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[2].length > 0) {
                this.promptModalForSave.show();
                this.setControlValue('PaymentTermDesc', data[2][0].PaymentTermDesc);
            } else {
                this.setControlValue('PaymentTermNumber', '');
                this.setControlValue('PaymentTermDesc', '');
                this.uiForm.controls['PaymentTermNumber'].setErrors({});
            }
        });
    }

    //Cancel
    public resetForm(): void {
        this.setControlValue('AccountNumber', this.cloneObj['AccountNumber']);
        this.setControlValue('AccountName', this.cloneObj['AccountName']);
        this.setControlValue('InvoiceGroupNumber', this.cloneObj['InvoiceGroupNumber']);
        this.setControlValue('PaymentTermNumber', this.cloneObj['PaymentTermNumber']);
        this.setControlValue('PaymentTermDesc', this.cloneObj['PaymentTermDesc']);
        this.fetchTranslationContent();
    }

    // Implementation of save logic
    public promptContentSaveData(eventObj: any): void {
        //let formdata: Object = {};
        this.queryPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryPost.set(this.serviceConstants.Action, '2');
        this.formdata[this.serviceConstants.AccountNumber] = this.getControlValue(this.serviceConstants.AccountNumber);
        this.formdata['InvoiceGroupNumber'] = this.getControlValue('InvoiceGroupNumber');
        this.formdata['PaymentTermNumber'] = this.getControlValue('PaymentTermNumber');
        this.formdata['PaymentTermCode'] = this.getControlValue('PaymentTermNumber');
        this.cloneObj = this.formdata;
        this.cloneObj['AccountName'] = this.getControlValue('AccountName');
        this.cloneObj['PaymentTermDesc'] = this.getControlValue('PaymentTermDesc');
        this.inputParams.search = this.queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.Operation, this.queryPost, this.formdata)
            .subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.showErrorModal(data.oResponse);
                } else {
                    if (data.errorMessage && data.errorMessage !== '') {
                        this.showErrorModal({
                            msg: data.errorMessage
                        });
                    } else {
                        this.showMessageModal({
                            msg: MessageConstant.Message.RecordSavedSuccessfully
                        });
                        this.setControlValue('AccountNumber', this.formdata['AccountNumber']);
                        this.setControlValue('AccountName', this.getControlValue('AccountName'));
                        this.setControlValue('InvoiceGroupNumber', this.formdata['InvoiceGroupNumber']);
                        this.setControlValue('PaymentTermNumber', this.formdata['PaymentTermNumber']);
                        this.setControlValue('PaymentTermDesc', this.getControlValue('PaymentTermDesc'));
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

        this.disableControl('InvoiceGroupNumber', false);
        this.disableControl('AccountNumber', false);
    }

    public onPaymentTermNumberReceived(): void {
        if (this.getControlValue('AccountNumber') && this.getControlValue('InvoiceGroupNumber')) {
            this.doLookupforPaymentTermNumber();
        }

    }

    public doLookupforPaymentTermNumber(): void {
        let lookupIP = [
            {
                'table': 'InvoiceGroup',
                'query': {
                    'AccountNumber': this.getControlValue('AccountNumber'),
                    'BusinessCode': this.utils.getBusinessCode(),
                    'InvoiceGroupNumber': this.getControlValue('InvoiceGroupNumber')
                },
                'fields': ['PaymentTermCode']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let PaymentTermData = data[0][0];
            this.setControlValue('PaymentTermNumber', PaymentTermData.PaymentTermCode);
            this.onPaymentTermDescReceived();
            this.disableControl('Save', false);
            this.disableControl('Cancel', false);
            this.formClone = this.uiForm.getRawValue();

        });
    }

    public onPaymentTermDescReceived(): void {
        if (this.getControlValue('PaymentTermNumber')) {
            this.doLookupforPaymentTermDesc();
        }
    }

    public doLookupforPaymentTermDesc(): void {
        let lookupIP = [
            {
                'table': 'PaymentTerm',
                'query': {
                    'PaymentTermCode': this.getControlValue('PaymentTermNumber'),
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['PaymentTermDesc']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let PaymentTermData = data[0][0];
            this.setControlValue('PaymentTermDesc', PaymentTermData.PaymentTermDesc);
            this.formClone = this.uiForm.getRawValue();
        });
    }

    private fetchTranslationContent(): void {
        this.getTranslatedValue('Save', null).subscribe((res: string) => {
            if (res) {
                this.setControlValue('Save', res);
            }
        });
        this.getTranslatedValue('Cancel', null).subscribe((res: string) => {
            if (res) {
                this.setControlValue('Cancel', res);
            }
        });
    }

}
