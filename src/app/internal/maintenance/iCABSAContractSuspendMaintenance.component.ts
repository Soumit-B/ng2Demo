import { Component, OnInit, Injector, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';

@Component({
    templateUrl: 'iCABSAContractSuspendMaintenance.html'
})
export class ContractSuspendMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    // URL Query Parameters
    private queryParams: Object = {
        operation: 'Application/iCABSAContractSuspendMaintenance',
        module: 'suspension',
        method: 'people/maintenance'
    };
    private InvoiceSuspendText: string;
    public pageId: string = '';
    public lookUpSubscription: Subscription;
    public controls: Array<any> = [
        { name: 'ContractNumber', required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractROWID' },
        { name: 'AccountNumber', disabled: true, type: MntConst.eTypeCode },
        { name: 'AccountName', disabled: true, type: MntConst.eTypeText },
        { name: 'Status', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractAddressLine1', disabled: true },
        { name: 'NegBranchNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'BranchName', disabled: true },
        { name: 'ContractAddressLine2', disabled: true },
        { name: 'ContractAddressLine3', disabled: true },
        { name: 'ContractAddressLine4', disabled: true },
        { name: 'ContractAddressLine5', disabled: true },
        { name: 'ContractPostcode', disabled: true },
        { name: 'InvoiceFrequencyCode', disabled: true, type: MntConst.eTypeInteger },
        { name: 'ContractAnnualValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'InvoiceAnnivDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'ContractCommenceDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'InvoiceSuspendInd', disabled: true, type: MntConst.eTypeCheckBox },
        { name: 'InvoiceSuspendText', disabled: true, type: MntConst.eTypeText }
    ];
    public modalConfig: Object = {
        backdrop: 'static',
        keyboard: true
    };
    public contractSearchParams: Object = {
        'parentMode': 'LookUp'
    };
    public numberLabel: string;
    public isAutoOpen: boolean;
    public contractSearchComponent = ContractSearchComponent;
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACONTRACTSUSPENDMAINTENANCE;
        this.contractSearchComponent = ContractSearchComponent;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
    }

    ngAfterViewInit(): void {
        this.pageTitle = this.riExchange.getCurrentContractTypeLabel() + ' Invoice Suspend Maintenance';
        this.numberLabel = this.riExchange.getCurrentContractTypeLabel() + ' Number';
        this.utils.setTitle(this.pageTitle);
        this.pageParams.isSaveCancelEnable = true;
        this.contractSearchParams = {
            parentMode: 'LookUp',
            currentContractType: this.riExchange.getCurrentContractType()
        };
        if (!this.getControlValue('ContractNumber'))
            this.isAutoOpen = true;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        if (this.getControlValue('ContractNumber'))
            this.doLookupformData();
    }

    private doLookupformData(): void {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BranchNumber': this.utils.getBranchCode(),
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['BranchName']
            },
            {
                'table': 'Account',
                'query': {
                    'AccountNumber': this.getControlValue('AccountNumber'),
                    'BusinessCode': this.utils.getBusinessCode()
                },
                'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }

        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0].length > 0) {
                let branchData = data[0][0];
                let contractData = data[1][0];
                this.setControlValue('BranchName', branchData.BranchName);
                this.setControlValue('ContractAddressLine1', contractData.AccountAddressLine1);
                this.setControlValue('ContractAddressLine2', contractData.AccountAddressLine2);
                this.setControlValue('ContractAddressLine3', contractData.AccountAddressLine3);
                this.setControlValue('ContractAddressLine4', contractData.AccountAddressLine4);
                this.setControlValue('ContractAddressLine5', contractData.AccountAddressLine5);
                this.setControlValue('AccountName', contractData.AccountName);
                this.setControlValue('ContractPostcode', contractData.AccountPostcode);
            } else {
                let cnumber = this.getControlValue('ContractNumber');
                this.uiForm.reset();
                this.setControlValue('ContractNumber', cnumber);
            }
        });
        this.ajaxSource.next(this.ajaxconstant.START);
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        let bodyParams: any = {};
        bodyParams['Function'] = 'GetStatus';
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('Status', data.Status);
                    this.setControlValue('ContractAnnualValue', data.ContractAnnualValue);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    private checkContractType(): void {
        let searchParams: URLSearchParams = new URLSearchParams();

        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set(this.serviceConstants.ContractNumber, this.getControlValue('ContractNumber'));
        searchParams.set('ContractTypeCode', this.riExchange.getCurrentContractType());
        let bodyParams: any = {};
        bodyParams['Function'] = 'CheckContractType';
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else
                    this.fetchContractRecord();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    private fetchContractRecord(): void {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        searchParams.set('Mode', 'GetData');
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makeGetRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('AccountNumber', data.AccountNumber);
                    this.setControlValue('NegBranchNumber', data.NegBranchNumber);
                    this.setControlValue('ContractName', data.ContractName);
                    this.setControlValue('InvoiceFrequencyCode', data.InvoiceFrequencyCode);
                    let ContractCommenceDate = this.globalize.parseDateToFixedFormat(data.ContractCommenceDate).toString();
                    this.setControlValue('ContractCommenceDate', this.globalize.parseDateStringToDate(ContractCommenceDate));
                    let InvoiceAnnivDate = this.globalize.parseDateToFixedFormat(data.InvoiceAnnivDate).toString();
                    this.setControlValue('InvoiceAnnivDate', this.globalize.parseDateStringToDate(InvoiceAnnivDate));
                    this.setControlValue('InvoiceSuspendInd', data.InvoiceSuspendInd);
                    this.InvoiceSuspendText = data.InvoiceSuspendText;
                    this.setControlValue('InvoiceSuspendText', data.InvoiceSuspendText);
                    this.setControlValue('ContractROWID', data.ttContract);
                    this.checkAddress();
                    this.doLookupformData();
                    this.pageParams.isSaveCancelEnable = false;
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    // Confirming the records to be saved
    private promptConfirmSave(): void {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams = this.getURLSearchParamObject();
        let formdata: any;
        formdata = {
            BusinessCode: this.businessCode(),
            ContractROWID: this.getControlValue('ContractROWID'),
            ContractName: this.getControlValue('ContractName'),
            ContractNumber: this.getControlValue('ContractNumber'),
            AccountNumber: this.getControlValue('AccountNumber'),
            ContractAnnualValue: this.getControlValue('ContractAnnualValue'),
            ContractCommenceDate: this.getControlValue('ContractCommenceDate'),
            InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode'),
            InvoiceAnnivDate: this.getControlValue('InvoiceAnnivDate'),
            InvoiceSuspendInd: this.utils.convertCheckboxValueToRequestValue(this.getControlValue('InvoiceSuspendInd')),
            NegBranchNumber: this.getControlValue('NegBranchNumber'),
            InvoiceSuspendText: this.getControlValue('InvoiceSuspendText')
        };
        searchParams.set(this.serviceConstants.Action, '2');
        formdata['Function'] = 'GetStatus';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, formdata).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.formPristine();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    // getting contract number from ellipsis
    public onContractDataReceived(data: any): void {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.checkContractType();
    }

    // On changing of Contract number
    public onContractChange(): any {
        if (this.getControlValue('ContractNumber').trim() === '') {
            this.uiForm.reset();
            this.disableControl('InvoiceSuspendText', true);
        } else
            this.checkContractType();
        this.uiForm.controls['ContractNumber'].markAsPristine();
    }

    // On clicking of Checkbox value
    public checkAddress(): any {
        if (this.getControlValue('InvoiceSuspendInd') === true)
            this.disableControl('InvoiceSuspendText', false);
        else {
            this.disableControl('InvoiceSuspendText', true);
            this.setControlValue('InvoiceSuspendText', '');
        }
        this.disableControl('InvoiceSuspendInd', false);
    }

    // Clicking on Save button
    public saveOnClick(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, '', this.promptConfirmSave.bind(this)));
    }

    // Clicking on Cancel button
    public cancelOnClick(): void {
        if (this.getControlValue('ContractNumber')) {
            this.setControlValue('InvoiceSuspendText', this.InvoiceSuspendText);
            this.fetchContractRecord();
        }
    }
}
