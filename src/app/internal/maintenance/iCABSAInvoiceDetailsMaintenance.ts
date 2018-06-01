import { Component, OnInit, OnDestroy, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { Subscription } from 'rxjs/Subscription';
import { InvoiceFrequencySearchComponent } from '../../internal/search/iCABSBBusinessInvoiceFrequencySearch';
import { URLSearchParams } from '@angular/http';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSAInvoiceDetailsMaintenance.html',
    styles: [
        `.red-bdr span {border-color: transparent !important;}
    `]
})

export class InvoiceDetailsMaintainanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('promptModal') public promptModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    public pageId: string = '';
    public modalTitle: string = '';
    public AnniversaryDate: Date;
    public autoOpen: boolean = false;
    public autoOpenSearch: boolean = false;
    public invoiceFreqValidation: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public contractSearchParams: any = {
        'parentMode': 'LookUp',
        'showAddNew': false,
        'currentContractType': 'C'
    };
    public inputParamsfreqSearch: any = { 'parentMode': 'LookUp', action: 0, 'countryCode': this.utils.getCountryCode(), 'businessCode': this.utils.getBusinessCode() };
    public showHeader: boolean = true;
    public contractSearchComponent = ContractSearchComponent;
    public invoiceFreqComponent = InvoiceFrequencySearchComponent;
    public showCloseButton: boolean = true;
    public NegBranchNumber: string;
    public lookUpSubscription: Subscription;
    private method: string = 'contract-management/maintenance';
    private module: string = 'contract-admin';
    private operation: string = 'Application/iCABSAInvoiceDetailsMaintenance';
    private search: URLSearchParams;
    public inputParams: any = {};
    public BranchOption: Array<any> = [];
    public invoiceFreqValue: boolean = false;
    public invoiceFreqValueHide: boolean = false;
    public contractDurationHide: boolean = false;
    private contractDurationCode: string;
    public annumalValuehide: boolean = true;
    public ContractExpiryDate: string;
    public InvoiceAnnivarsaryDate: string;
    public InvoiceAnnivarsaryDateDisplay: string;
    public ContractExpiryDateDisplay: string;
    private ContractROWID: string;
    private InvoiceFrequencyChargeIndValue: string;
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public promptTitle: string = 'Confirm Record?';
    public promptContent: string = '';
    public backUpObject: any = {};
    private successCheck: boolean = false;
    public pageTitle: string;
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false },
        { name: 'Status', readonly: true, disabled: true, required: true },
        { name: 'AccountNumber', readonly: true, disabled: true, required: true },
        { name: 'AccountName', readonly: true, disabled: true, required: true },
        { name: 'ContractAddressLine1', readonly: true, disabled: true, required: false },
        { name: 'ContractAddressLine2', readonly: true, disabled: true, required: false },
        { name: 'ContractAnnualValue', readonly: true, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'ContractAddressLine3', readonly: true, disabled: true, required: false },
        { name: 'ContractCommenceDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate  },
        { name: 'ContractAddressLine4', readonly: true, disabled: true, required: false },
        { name: 'ContractDurationCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'ContractAddressLine5', readonly: true, disabled: true, required: false },
        { name: 'ContractPostcode', readonly: true, disabled: true, required: false },
        { name: 'InvoiceFrequencyCode', readonly: true, disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'InvoiceFrequencyDesc', readonly: true, disabled: true, required: false },
        { name: 'InvoiceFrequencyChargeInd', readonly: false, disabled: false, required: false },
        { name: 'AdvanceInvoiceInd', readonly: true, disabled: false, required: false },
        { name: 'InvoiceFrequencyChargeValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency },
        { name: 'BranchOption', readonly: true, disabled: true, required: false },
        { name: 'LastChangeEffectiveDate', readonly: false, disabled: false, required: false },
        { name: 'InvoiceAnnivDate', required: true, type: MntConst.eTypeDate },
        { name: 'ContractExpiryDatePicker', required: false },
        { name: 'LastChangeEffectDate', required: true, value: '' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICEDETAILSMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Invoice Details Maintenance';
        this.contractSearchComponent = ContractSearchComponent;
        this.invoiceFreqComponent = InvoiceFrequencySearchComponent;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.riMaintenance.FunctionAdd = false;
        this.riMaintenance.FunctionDelete = false;
        this.backUpObject.LastChangeEffectDate = this.getControlValue('LastChangeEffectDate');
        switch (this.parentMode) {
            case 'InvoiceTypeChange':
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setupDetails(this.getControlValue('ContractNumber'));
                break;
        }

    };

    ngAfterViewInit(): void {
        this.autoOpen = true;
    }

    private checkContractType(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        //     this.search.set('CurrentContractType', 'C');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['Function'] = 'CheckContractType';
        //  formdata['methodtype'] = 'maintenance';
        //  formdata['CurrentContractType'] = 'C';
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                if (error.errorMessage) {
                    this.errorService.emitError({
                        msg: error.errorMessage
                    });
                    return;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public onContractDataReceived(data: any): void {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('InvoiceFrequencyCode', data.InvoiceFrequencyCode);
        this.setControlValue('ContractCommenceDate', this.changeDateFormat(data.ContractCommenceDate));
        this.setControlValue('Status', data.PortfolioStatusDesc);
        this.backUpObject.InvoiceFrequencyCode = data.InvoiceFrequencyCode;
        this.backUpObject.InvoiceAnnivarsaryDate = data.InvoiceAnnivDate;
        this.setControlValue('InvoiceAnnivDate', data.InvoiceAnnivDate);
        this.NegBranchNumber = data.NegBranchNumber;
        this.ContractExpiryDate = data.ContractExpiryDate;
        this.ContractROWID = data.ttContract;
        this.checkContractType();
        this.invoiceFreqValue = false;

        this.dollokupForAccount();

    }


    private setupDetails(contractNumber: string): void {
        let loopUpIpContract = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ContractNumber': contractNumber
                },
                'fields': ['InvoiceFrequencyChargeInd', 'AdvanceInvoiceInd', 'ContractAnnualValue', 'InvoiceFrequencyChargeValue', 'ContractDurationCode', 'ContractNumber', 'ContractName', 'AccountNumber', 'InvoiceFrequencyCode', 'ContractCommenceDate', 'Status', 'NegBranchNumber', 'PortfolioStatusDesc', 'InvoiceAnnivDate', 'ContractExpiryDate', 'ttContract']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(loopUpIpContract).subscribe((data) => {
            let Contract = data[0][0];
            if (Contract) {
                this.setControlValue('ContractNumber', Contract.ContractNumber);
                this.setControlValue('ContractName', Contract.ContractName);
                this.setControlValue('AccountNumber', Contract.AccountNumber);
                this.setControlValue('InvoiceFrequencyCode', Contract.InvoiceFrequencyCode);
                this.setControlValue('ContractCommenceDate', this.changeDateFormat(Contract.ContractCommenceDate));
                this.setControlValue('Status', Contract.PortfolioStatusDesc);
                this.NegBranchNumber = Contract.NegBranchNumber;
                this.setControlValue('InvoiceAnnivDate', this.utils.formatDate(new Date(data.InvoiceAnnivDate)));
                this.ContractExpiryDate = data.ContractExpiryDate;
                this.ContractROWID = Contract.ttContract;
                this.checkContractType();
                this.invoiceFreqValue = false;
                this.dollokupForAccount();
            }
        });

    }

    public dollokupForAccount(): void {
        let lookupIP = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode,
                    'AccountNumber': this.getControlValue('AccountNumber')
                },
                'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPOstCode']
            },
            {
                'table': 'SystemInvoiceFrequency',
                'query': {
                    'BusinessCode': this.businessCode,
                    'InvoiceFrequencyCode': this.getControlValue('InvoiceFrequencyCode')
                },
                'fields': ['InvoiceFrequencyDesc']
            },
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.NegBranchNumber
                },
                'fields': ['BranchName']
            },
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['InvoiceFrequencyChargeInd', 'AdvanceInvoiceInd', 'ContractAnnualValue', 'InvoiceFrequencyChargeValue', 'ContractDurationCode', 'ContractNumber', 'ContractName', 'AccountNumber', 'InvoiceFrequencyCode', 'ContractCommenceDate', 'Status', 'LastChangeEffectDate']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Account = data[0][0];
            if (Account) {
                this.setControlValue('AccountName', Account.AccountName);
                this.setControlValue('ContractAddressLine1', Account.AccountAddressLine1);
                this.setControlValue('ContractAddressLine2', Account.AccountAddressLine2);
                this.setControlValue('ContractAddressLine3', Account.AccountAddressLine3);
                this.setControlValue('ContractAddressLine4', Account.AccountAddressLine4);
                this.setControlValue('ContractPostcode', Account.AccountPostcode);

            }
            let SystemInvoiceFrequency = data[1][0];
            if (SystemInvoiceFrequency) {
                this.setControlValue('InvoiceFrequencyDesc', SystemInvoiceFrequency.InvoiceFrequencyDesc);
                this.backUpObject.InvoiceFrequencyDesc = SystemInvoiceFrequency.InvoiceFrequencyDesc;
            }
            let Branch = data[2][0];
            if (Branch) {
                this.BranchOption.push({ 'text': this.NegBranchNumber + '-' + Branch.BranchName, 'value': this.NegBranchNumber });
            }
            let Contract = data[3][0];
            if (Contract) {
                //  this.setControlValue('BranchOption', this.utils.getBranchCode() + '-' + Branch.BranchName);
                this.setControlValue('AdvanceInvoiceInd', Contract.AdvanceInvoiceInd);
                this.setControlValue('InvoiceFrequencyChargeInd', Contract.InvoiceFrequencyChargeInd);
                // this.setControlValue('ContractAnnualValue', Contract.ContractAnnualValue);
                this.setControlValue('ContractAnnualValue', Contract.ContractAnnualValue);
                this.setControlValue('InvoiceFrequencyChargeValue', Contract.InvoiceFrequencyChargeValue);
                this.backUpObject.AdvanceInvoiceInd = Contract.AdvanceInvoiceInd;
                this.setControlValue('LastChangeEffectDate', Contract.LastChangeEffectDate);
                //    this.LastChangeEffectDate = Contract.LastChangeEffectDate;
                this.contractDurationCode = Contract.ContractDurationCode;
                if (this.contractDurationCode == null) {
                    this.contractDurationHide = false;
                } else {
                    this.contractDurationHide = true;
                }
            }
        });
    }


    public onInvoiceFreq(data: any): void {
        this.riExchange_CBORequest(data);
        this.setControlValue('InvoiceFrequencyCode', data.InvoiceFrequencyCode);
        this.setControlValue('InvoiceFrequencyDesc', data.InvoiceFrequencyDesc);

    }

    private riExchange_CBORequest(data: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        //  this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        //     this.search.set('CurrentContractType', 'C');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['Function'] = 'GetInvoiceFrequencyCharge';
        //  formdata['methodtype'] = 'maintenance';
        //  formdata['CurrentContractType'] = 'C';
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['InvoiceFrequencyCode'] = data.InvoiceFrequencyCode;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasOwnProperty('errorMessage')) {
                    this.errorModal.show(data, true);
                } else {
                    if (data.InvoiceFrequencyChargeInd === 'no') {
                        this.setControlValue('InvoiceFrequencyChargeInd', false);
                        this.invoiceFreqValueHide = false;
                        this.setControlValue('InvoiceFrequencyChargeValue', data.InvoiceFrequencyChargeValue);
                        this.invoiceFreqValue = false;
                    } else {
                        this.setControlValue('InvoiceFrequencyChargeInd', true);
                        this.setControlValue('InvoiceFrequencyChargeValue', data.InvoiceFrequencyChargeValue);
                        this.invoiceFreqValueHide = true;
                        this.invoiceFreqValue = true;
                    }
                }
            },
            (error) => {
                if (error.errorMessage) {
                    this.errorService.emitError({
                        msg: error.errorMessage
                    });
                    return;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public AdvanceInvoiceIndChange(event: any): void {
        if (event.target.checked) {
            this.setControlValue('AdvanceInvoiceInd', true);
        } else {
            this.setControlValue('AdvanceInvoiceInd', false);
        }
    }

    public InvoiceAnnivDateSelectedValue(value: any): void {
        this.setControlValue('InvoiceAnnivDate', value.value);
    }

    public ContractExpiryDateSelectedValue(value: any): void {
        this.setControlValue('ContractExpiryDatePicker', value.value);
    }

    public LastChangeEffectDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('LastChangeEffectDate', value.value);
        }
    }
    public InvoiceFrequencyChargeIndChange(event: any): void {
        if (event.target.checked) {
            this.invoiceFreqValueHide = true;
        } else {
            this.invoiceFreqValueHide = false;
        }
    }

    public onCancelClick(event: any): void {
        this.setControlValue('InvoiceFrequencyCode', this.backUpObject.InvoiceFrequencyCode);
        this.setControlValue('InvoiceFrequencyDesc', this.backUpObject.InvoiceFrequencyDesc);
        this.setControlValue('InvoiceAnnivDate', this.backUpObject.InvoiceAnnivarsaryDate);
        // this.InvoiceAnnivarsaryDate = this.backUpObject.InvoiceAnnivarsaryDate;
        this.setControlValue('AdvanceInvoiceInd', this.backUpObject.AdvanceInvoiceInd);
        this.setControlValue('LastChangeEffectDate', this.backUpObject.LastChangeEffectDate);
        this.riExchange.riInputElement.isCorrect(this.uiForm, 'LastChangeEffectDate');
        this.riExchange.riInputElement.isCorrect(this.uiForm, 'InvoiceAnnivDate');
    }

    public onSaveValue(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['ContractROWID'] = this.ContractROWID;
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['InvoiceFrequencyCode'] = this.getControlValue('InvoiceFrequencyCode');
        if (this.getControlValue('InvoiceFrequencyChargeInd')) {
            formdata['InvoiceFrequencyChargeInd'] = 'yes';
        } else {
            formdata['InvoiceFrequencyChargeInd'] = 'no';
        }
        formdata['InvoiceFrequencyChargeValue'] = this.getControlValue('InvoiceFrequencyChargeValue');
        formdata['InvoiceAnnivDate'] = this.getControlValue('InvoiceAnnivDate');
        if (this.getControlValue('AdvanceInvoiceInd')) {
            formdata['AdvanceInvoiceInd'] = 'yes';
        } else {
            formdata['AdvanceInvoiceInd'] = 'no';
        }
        formdata['ContractName'] = this.getControlValue('ContractName');
        formdata['AccountNumber'] = this.getControlValue('AccountNumber');
        formdata['ContractAnnualValue'] = this.getControlValue('ContractAnnualValue');
        formdata['ContractCommenceDate'] = this.getControlValue('ContractCommenceDate');
        formdata['LastChangeEffectDate'] = this.getControlValue('LastChangeEffectDate');
        formdata['ContractDurationCode'] = this.getControlValue('ContractDurationCode');
        if (this.ContractExpiryDate === null) {
            formdata['ContractExpiryDate'] = '';
        } else {
            formdata['ContractExpiryDate'] = this.ContractExpiryDate;
        }

        formdata['NegBranchNumber'] = this.NegBranchNumber;
        formdata['Function'] = 'GetStatus';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.hasOwnProperty('errorMessage')) {
                    this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                } else {
                    this.backUpObject.InvoiceFrequencyCode = this.getControlValue('InvoiceFrequencyCode');
                    this.backUpObject.InvoiceFrequencyDesc = this.getControlValue('InvoiceFrequencyDesc');
                    this.backUpObject.AdvanceInvoiceInd = this.getControlValue('AdvanceInvoiceInd');
                    this.backUpObject.InvoiceAnnivarsaryDate = this.getControlValue('InvoiceAnnivDate');
                    this.backUpObject.LastChangeEffectDate = this.getControlValue('LastChangeEffectDate');
                    this.successCheck = true;
                    this.errorModal.show({
                        msg: MessageConstant.Message.RecordSavedSuccessfully
                    }, false);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                if (error.errorMessage) {
                    this.errorService.emitError({
                        msg: error.errorMessage
                    });
                    return;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public onSubmit(formObj: any, e: any): void {
        event.preventDefault();
        this.uiForm.controls['LastChangeEffectDate'].markAsTouched();
        this.uiForm.controls['InvoiceFrequencyCode'].markAsTouched();
        this.uiForm.controls['InvoiceAnnivDate'].markAsTouched();
        if (this.uiForm.valid) {
            this.lookUpSystemInvoiceFrequency();
        }

    }
    public promptSave(event: any): void {
        this.onSaveValue();
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }

    public onContractNumberTabOut(event: any): void {
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': event.target.value
                },
                'fields': ['ContractNumber', 'ContractName', 'AccountNumber', 'InvoiceFrequencyCode', 'ContractCommenceDate', 'Status', 'InvoiceFrequencyCode', 'InvoiceAnnivDate', 'NegBranchNumber', 'ContractExpiryDate', 'ttContract', 'PortfolioStatusCode']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Contract = data[0][0];
            if (Contract) {
                this.setControlValue('ContractNumber', Contract.ContractNumber);
                this.setControlValue('ContractName', Contract.ContractName);
                this.setControlValue('AccountNumber', Contract.AccountNumber);
                this.setControlValue('InvoiceFrequencyCode', Contract.InvoiceFrequencyCode);
                this.setControlValue('ContractCommenceDate', this.changeDateFormat(Contract.ContractCommenceDate));
                this.setControlValue('Status', Contract.PortfolioStatusDesc);
                this.backUpObject.InvoiceFrequencyCode = Contract.InvoiceFrequencyCode;
                this.backUpObject.InvoiceAnnivarsaryDate = this.utils.formatDate(Contract.InvoiceAnnivDate);
                this.setControlValue('InvoiceAnnivDate', this.utils.formatDate(Contract.InvoiceAnnivDate));
                //  this.InvoiceAnnivarsaryDate = Contract.InvoiceAnnivDate;
                this.NegBranchNumber = Contract.NegBranchNumber;
                this.ContractExpiryDate = Contract.ContractExpiryDate;
                this.ContractROWID = Contract.ttContract;
                this.invoiceFreqValue = false;
                this.lookUpPortfolioStatus(Contract.PortfolioStatusCode);

            }
        });
    }

    private lookUpPortfolioStatus(code: string): void {
        let lookupIP = [
            {
                'table': 'PortfolioStatus',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'PortfolioStatusCode': code
                },
                'fields': ['PortfolioStatusSystemDesc']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let PortfolioStatus = data[0][0];
            if (PortfolioStatus) {
                this.setControlValue('Status', PortfolioStatus.PortfolioStatusSystemDesc);
                this.checkContractType();
                this.dollokupForAccount();
            }
        });
    }

    private lookUpSystemInvoiceFrequency(): void {
        let lookupIP = [
            {
                'table': 'SystemInvoiceFrequency',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'InvoiceFrequencyCode': this.getControlValue('InvoiceFrequencyCode')
                },
                'fields': ['InvoiceFrequencyDesc']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let SystemInvoiceFrequency = data[0][0];
            if (SystemInvoiceFrequency) {
                this.promptModal.show();
            } else {
                this.invoiceFreqValidation = true;
                this.setControlValue('InvoiceFrequencyDesc', '');
            }
        });
    }

    private lookUpSystemInvoiceFrequency1(): void {
        let lookupIP = [
            {
                'table': 'SystemInvoiceFrequency',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'InvoiceFrequencyCode': this.getControlValue('InvoiceFrequencyCode')
                },
                'fields': ['InvoiceFrequencyDesc']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let SystemInvoiceFrequency = data[0][0];
            if (SystemInvoiceFrequency) {
                this.setControlValue('InvoiceFrequencyDesc', SystemInvoiceFrequency.InvoiceFrequencyDesc);
            } else {
                this.setControlValue('InvoiceFrequencyDesc', '');
            }
        });
    }

    private changeDateFormat(inputDate: string): string {  // expects Y-m-d
        if (inputDate.indexOf('-') > -1) {
            let splitDate = inputDate.split('-');
            let year = splitDate[0];
            let month = splitDate[1];
            let day = splitDate[2];
            inputDate = day + '/' + month + '/' + year;
        }
        return inputDate;
    }

    public onInvoiceFrequencyCodeTabOut(event: any): void {
        let data = {};
        data['InvoiceFrequencyCode'] = event.target.value;
        this.lookUpSystemInvoiceFrequency1();
        this.riExchange_CBORequest(data);
    }

}
