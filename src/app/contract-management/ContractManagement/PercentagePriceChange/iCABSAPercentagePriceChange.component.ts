import { Component, OnInit, OnDestroy, Injector, ViewChild, Input, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { ContractSearchComponent } from '../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from '../../../internal/search/iCABSAServiceCoverSearch';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { DatepickerComponent } from '../../../../shared/components/datepicker/datepicker';
import { MessageConstant } from '../../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSAPercentagePriceChange.html',
    styles: [
        `.red-bdr span {border-color: red}
    `]
})

export class PercentagePriceChangeComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public autoOpenContract: boolean = false;
    public autoOpenPremises: boolean = false;
    public autoOpenProduct: boolean = false;
    public Mode: string;
    public trPremise: boolean = true;
    public trServiceCover: boolean = true;
    public trServiceFrequency: boolean = true;
    public tdServiceBranch: boolean = true;
    public trOldContractAnnualValue: boolean = true;
    public tdOldEffectiveDate: boolean = true;
    public showErrorHeader: boolean = true;
    public contrctSearch = ContractSearchComponent;
    public premiseSearch = PremiseSearchComponent;
    public productSearch = ServiceCoverSearchComponent;
    public lookUpSubscription: Subscription;
    public search: URLSearchParams;
    public showHeader: boolean = true;
    public promptContent: string;
    public showMessageHeader: boolean = true;
    public inputParams: any = {};
    public pageTitle: string;
    public isValidateProduct: boolean = false;
    public EffectiveDateRequired: boolean = true;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public validateChanrgeValue: boolean = false;
    public fielddisable: boolean = false;
    public pageId: string = '';
    public method: string = 'contract-management/maintenance';
    public module: string = 'api';
    public operation: string = 'Application/iCABSAPercentagePriceChange';
    public inputParamsContractSearch: any = {
        'parentMode': 'Search',
        'currentContractType': 'C', 'businessCode': 'D',
        action: 0
    };
    public inputParamsPremiseSearch: any = {
        'parentMode': 'Search',
        'businessCode': 'D', 'showAddNew': false,
        action: 0
    };
    public inputParamsProductSearch: any = {
        'parentMode': 'Search',
        'businessCode': 'D',
        action: 0
    };
     public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'Status', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'InvoiceFrequencyCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'InvoiceAnnivDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'ContractAddressLine1', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'NegBranchNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'NegBranchName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContractAddressLine2', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ServiceBranchNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'ServiceBranchName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContractAddressLine3', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContractAddressLine4', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContractAddressLine5', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContractPostcode', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContractAnnualValue', readonly: true, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'OldEffectiveDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'OldContractAnnualValue', readonly: true, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'PercentageChange', readonly: false, disabled: false, required: true, type: MntConst.eTypeDecimal2 },
        { name: 'Decrease', readonly: false, disabled: false, required: false, value: false },
        { name: 'DummyCommission', readonly: false, disabled: false, required: false, value: false },
        { name: 'AccountNumber', type: MntConst.eTypeText },
        { name: 'EffectiveDate', disabled: false, required: true },
        { name: 'Mode', readonly: true, disabled: true, required: false },
        { name: 'ServiceCoverRowID' },
        { name: 'BtnSubmit', disabled: true },
        { name: 'BtnCancel', disabled: true }
    ];
    ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.module = this.module;
        this.inputParams.operation = this.operation;
    }

    private pageOnLoad(): void {
        this.autoOpenContract = true;
        if (this.URLParameterContains('Contract')) {
            this.trPremise = false;
            this.trServiceCover = false;
            this.trServiceFrequency = false;
            this.tdServiceBranch = false;
        } else if (this.URLParameterContains('Premise')) {
            this.trServiceCover = false;
            this.trServiceFrequency = false;
            this.tdServiceBranch = true;
        } else {
            this.tdServiceBranch = true;
        }
        this.trOldContractAnnualValue = false;
        this.tdOldEffectiveDate = false;
        this.inputParamsContractSearch['businessCode'] = this.businessCode();
        this.inputParamsContractSearch['countryCode'] = this.countryCode();
        this.inputParamsPremiseSearch['businessCode'] = this.businessCode();
        this.inputParamsPremiseSearch['countryCode'] = this.countryCode();
        this.inputParamsProductSearch['businessCode'] = this.businessCode();
        this.inputParamsProductSearch['countryCode'] = this.countryCode();
        if (this.URLParameterContains('Contract')) {
            this.inputParamsContractSearch['parentMode'] = 'Search';
        } else {
            this.inputParamsContractSearch['parentMode'] = 'LookUp';
        }

        if (this.URLParameterContains('Premise')) {
            this.inputParamsContractSearch['parentMode'] = 'Search';
        } else {
            this.inputParamsContractSearch['parentMode'] = 'LookUp';
        }
        this.setControlValue('EffectiveDate', '');

    }

    public ngAfterViewInit(): void {
        this.pageOnLoad();
    }

    public onSubmit(formObj: any, e: any): void {
        this.uiForm.controls['PercentageChange'].markAsTouched();
        this.uiForm.controls['EffectiveDate'].markAsTouched();
        this.uiForm.controls['ContractNumber'].markAsTouched();
        if (this.uiForm.valid) {
            event.preventDefault();
            this.promptContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    }


    public onCancelClick(event: any): void {
        this.setControlValue('PercentageChange', '');
        this.setControlValue('DummyCommission', false);
        this.setControlValue('Decrease', false);
        this.uiForm.controls['PercentageChange'].markAsUntouched();
        this.uiForm.controls['EffectiveDate'].markAsUntouched();
        this.setControlValue('EffectiveDate', '');
        this.formPristine();
    }
    public effectiveDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('EffectiveDate', value.value);
            this.checkEffectiveDate();
        }
    }

    private checkEffectiveDate(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        let formdata: Object = {};
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['EffectiveDate'] = this.getControlValue('EffectiveDate');
        formdata['Function'] = 'WarnAnniversaryDate';
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(
            (data) => {
                if (data.hasOwnProperty('errorMessage')) {
                    this.errorModal.show(data, true);
                    this.errorModal.title = MessageConstant.Message.MessageTitle;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            }
            );
    }

    public onContractSearchDataReturn(data: any): void {
        this.getContractError();
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.inputParamsPremiseSearch['ContractNumber'] = this.inputParamsProductSearch['ContractNumber'] = this.getControlValue('ContractNumber');
        this.inputParamsPremiseSearch['ContractName'] = this.inputParamsProductSearch['ContractName'] = this.getControlValue('ContractName');
        if (this.URLParameterContains('Contract')) {
            this.Mode = 'Contract';
            this.setControlValue('Mode', this.Mode);
            this.riMaintenance_BeforeFetch(this.Mode);
            this.riMaintenance_AfterFetch(this.Mode);
        } else if (this.URLParameterContains('Premise')) {
            this.Mode = 'Premise';
        } else {
            this.Mode = 'ServiceCover';
        }
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('PremiseName', '');
        this.setControlValue('Mode', this.Mode);
        if (this.URLParameterContains('Contract')) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'BtnSubmit');
            this.riExchange.riInputElement.Enable(this.uiForm, 'BtnCancel');
        }

    }

    public onPremiseSearchDataReturn(data: any): void {
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        this.clearField();
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
        if (this.getControlValue('Mode') === 'Premise') {
            this.riMaintenance_BeforeFetch(this.Mode);
            this.riMaintenance_AfterFetch(this.Mode);
        }
        this.inputParamsPremiseSearch['PremiseNumber'] = this.getControlValue('PremiseNumber');
        this.inputParamsPremiseSearch['PremiseName'] = this.getControlValue('PremiseName');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        if (this.URLParameterContains('Premise')) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'BtnSubmit');
            this.riExchange.riInputElement.Enable(this.uiForm, 'BtnCancel');
        }

    }

    public onProductSearchDataReturn(data: any): void {
        this.clearField();
        this.autoOpenProduct = false;
        this.setControlValue('ProductCode', data.ProductCode);
        this.setControlValue('ProductDesc', data.ProductDesc);
        this.setControlValue('ServiceCoverRowID', data.row.ttServiceCover);
        this.setControlValue('ServiceVisitFrequency', data.row.ServiceVisitFrequency);
        this.riMaintenance_BeforeFetch(this.Mode);
        this.riMaintenance_AfterFetch(this.Mode);
        if (this.getControlValue('Mode') === 'ServiceCover') {
            this.riExchange.riInputElement.Enable(this.uiForm, 'BtnSubmit');
            this.riExchange.riInputElement.Enable(this.uiForm, 'BtnCancel');
        }

    }

    public onDecreaseChange(data: any): void {
        if (data.target.checked) {
            this.setControlValue('Decrease', true);
        } else {
            this.setControlValue('Decrease', false);
        }
    }

    public onDummyCommissionChange(data: any): void {
        if (data.target.checked) {
            this.setControlValue('DummyCommission', true);
        } else {
            this.setControlValue('DummyCommission', false);
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPERCENTAGEPRICECHANGE;
        this.pageTitle = this.browserTitle = 'Percentage Price Change Maintenance';
    }

    private riMaintenance_AfterFetch(Mode: string): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        let formdata: Object = {};

        if (!this.URLParameterContains('Contract') && !this.URLParameterContains('Premise')) {
            formdata['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        }
        if (this.getControlValue('Mode') === 'Premise') {
            formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        }
        if (this.getControlValue('Mode') === 'ServiceCover') {
            formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
            formdata['ProductCode'] = this.getControlValue('ProductCode');
        }
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['Mode'] = this.getControlValue('Mode');
        formdata['Function'] = 'GetStatus';
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(
            (data) => {
                this.setControlValue('ContractAnnualValue', data.ContractAnnualValue);
                this.setControlValue('Status', data.Status);
                if (!data.hasOwnProperty('Status')) {
                    this.riExchange.riInputElement.Disable(this.uiForm, 'BtnSubmit');
                    this.riExchange.riInputElement.Disable(this.uiForm, 'BtnCancel');
                    this.riExchange.riInputElement.Disable(this.uiForm, 'PercentageChange');
                    this.riExchange.riInputElement.Disable(this.uiForm, 'EffectiveDate');
                    this.riExchange.riInputElement.Disable(this.uiForm, 'Decrease');
                    this.riExchange.riInputElement.Disable(this.uiForm, 'DummyCommission');
                } else {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'PercentageChange');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'EffectiveDate');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'Decrease');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'DummyCommission');
                }
                if (data.hasOwnProperty('ForwardWarningErrorMessage') && data.ForwardDatedWarning.toUpperCase() === GlobalConstant.Configuration.Yes) {
                    this.errorModal.show({ msg: data.ForwardWarningErrorMessage, title: MessageConstant.Message.MessageTitle }, false);
                }
                if (data.hasOwnProperty('errorMessage')) {
                    this.errorModal.show(data, true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );






    }

    private riMaintenance_BeforeFetch(Mode: string): void {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Mode=' + Mode;
        this.search = this.getURLSearchParamObject();
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        if (this.getControlValue('Mode') === 'Premise')
            this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        if (this.getControlValue('Mode') === 'ServiceCover') {
            this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            this.search.set('ProductCode', this.getControlValue('ProductCode'));
        }

        this.search.set('Mode', Mode);
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ServiceCoverROWID', this.getControlValue('ServiceCoverRowID'));
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                this.setControlValue('NegBranchNumber', data.NegBranchNumber);
                this.setControlValue('AccountNumber', data.AccountNumber);
                this.setControlValue('InvoiceFrequencyCode', data.InvoiceFrequencyCode);
                this.setControlValue('InvoiceAnnivDate', data.InvoiceAnnivDate);
                if (data.Status)
                    this.setControlValue('Status', data.Status);
                this.doLookUpCall();
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            }
            );
    }

    private doLookUpCall(): void {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.getControlValue('NegBranchNumber')
                },
                'fields': ['BranchName']
            },
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'AccountNumber': this.getControlValue('AccountNumber')
                },
                'fields': ['AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let Branch = data[0][0];
            if (Branch) {
                this.setControlValue('NegBranchName', Branch.BranchName);
            }
            let Account = data[1][0];
            if (Account) {
                this.setControlValue('ContractAddressLine1', Account.AccountAddressLine1);
                this.setControlValue('ContractAddressLine2', Account.AccountAddressLine2);
                this.setControlValue('ContractAddressLine3', Account.AccountAddressLine3);
                this.setControlValue('ContractAddressLine4', Account.AccountAddressLine4);
                this.setControlValue('ContractAddressLine5', Account.AccountAddressLine5);
                this.setControlValue('ContractPostcode', Account.AccountPostcode);
            }
        }).catch(e => {
            this.setControlValue('ContractAddressLine1', '');
            this.setControlValue('ContractAddressLine2', '');
            this.setControlValue('ContractAddressLine3', '');
            this.setControlValue('ContractAddressLine4', '');
            this.setControlValue('ContractAddressLine5', '');
            this.setControlValue('ContractPostcode', '');
        });
    }

    public promptSave(data: any): void {

        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['EffectiveDate'] = this.getControlValue('EffectiveDate');
        formdata['Mode'] = this.getControlValue('Mode');
        formdata['Function'] = 'Validate';
        if (this.Mode === 'ServiceCover') {
            formdata['ServiceVisitFrequency'] = this.getControlValue('ServiceVisitFrequency');
            formdata['ProductCode'] = this.getControlValue('ProductCode');
        }
        if (this.Mode !== 'Contract')
            formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(
            (data) => {
                this.submitRecord();
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );



    }

    private submitRecord(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['AccountNumber'] = this.getControlValue('AccountNumber');
        formdata['PercentageChange'] = this.getControlValue('PercentageChange');
        if (this.getControlValue('Decrease')) {
            formdata['Decrease'] = 'yes';
        } else {
            formdata['Decrease'] = 'no';
        }
        formdata['EffectiveDate'] = this.getControlValue('EffectiveDate');
        formdata['ContractAnnualValue'] = this.getControlValue('ContractAnnualValue');
        formdata['Mode'] = this.getControlValue('Mode');
        formdata['InvoiceFrequencyCode'] = this.getControlValue('InvoiceFrequencyCode');
        formdata['InvoiceAnnivDate'] = this.getControlValue('InvoiceAnnivDate');
        formdata['ContractName'] = this.getControlValue('ContractName');
        formdata['PremiseName'] = this.getControlValue('PremiseName');
        formdata['ProductDesc'] = this.getControlValue('ProductDesc');
        formdata['ProductDesc'] = this.getControlValue('ProductDesc');
        formdata['ServiceCoverROWID'] = this.getControlValue('ServiceCoverRowID');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['ServiceVisitFrequency'] = this.getControlValue('ServiceVisitFrequency');
        formdata['NegBranchNumber'] = this.getControlValue('NegBranchNumber');
        if (this.getControlValue('DummyCommission')) {
            formdata['DummyCommission'] = 'yes';
        } else {
            formdata['DummyCommission'] = 'no';
        }
        formdata['Function'] = 'Validate';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasOwnProperty('errorMessage')) {
                    this.errorModal.show(data, true);
                } else {
                    this.errorModal.show({
                        msg: MessageConstant.Message.RecordSavedSuccessfully, title: MessageConstant.Message.MessageTitle
                    }, false);
                    this.trOldContractAnnualValue = true;
                    this.tdOldEffectiveDate = true;
                    this.setControlValue('ContractAnnualValue', data.ContractAnnualValue);
                    this.setControlValue('OldContractAnnualValue', data.OldContractAnnualValue);
                    this.setControlValue('OldEffectiveDate', data.OldEffectiveDate);
                    this.setControlValue('DummyCommission', false);
                    this.setControlValue('Decrease', false);
                    this.setControlValue('PercentageChange', '');
                    this.setControlValue('EffectiveDate', '');
                    this.uiForm.controls['PercentageChange'].markAsUntouched();
                    this.uiForm.controls['EffectiveDate'].markAsUntouched();
                    this.formPristine();
                }
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );

    }

    private URLParameterContains(parameter: string): boolean {
        let url = window.location.href;
        if (url.indexOf('/' + parameter + '?') !== -1)
            return true;
        return false;
    }

    private doLookUPForContractData(): void {
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let Contract = data[0][0];
            if (Contract) {
                if (this.URLParameterContains('Contract')) {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'BtnSubmit');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'BtnCancel');
                }
                this.setControlValue('ContractName', Contract.ContractName);
                let data: Object = {};
                data['ContractNumber'] = this.getControlValue('ContractNumber');
                data['ContractName'] = this.getControlValue('ContractName');
                this.onContractSearchDataReturn(data);
            } else {
                this.getContractError();
            }
        }).catch(e => {
            this.getContractError();
        });
        this.formPristine();
    }

    private getContractError(): void {
        // if (this.getControlValue('ContractNumber'))
        //     this.errorModal.show({
        //         msg: MessageConstant.Message.RecordNotFound, title: MessageConstant.Message.ErrorTitle
        //     }, false);
        this.inputParamsPremiseSearch['ContractNumber'] = this.inputParamsProductSearch['ContractNumber'] = '';
        this.inputParamsPremiseSearch['ContractName'] = this.inputParamsProductSearch['ContractName'] = '';
        this.inputParamsPremiseSearch['PremiseNumber'] = this.inputParamsPremiseSearch['PremiseName'] = '';
        this.riExchange.riInputElement.Disable(this.uiForm, 'BtnSubmit');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BtnCancel');
        this.clearField();
        this.setControlValue('ContractName', '');
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
    }

    private clearField(): void {
        this.setControlValue('ServiceVisitFrequency', '');
        this.setControlValue('Status', '');
        this.setControlValue('InvoiceFrequencyCode', '');
        this.setControlValue('InvoiceAnnivDate', '');
        this.setControlValue('ContractAddressLine1', '');
        this.setControlValue('NegBranchNumber', '');
        this.setControlValue('NegBranchName', '');
        this.setControlValue('ContractAddressLine2', '');
        this.setControlValue('ServiceBranchNumber', '');
        this.setControlValue('ServiceBranchName', '');
        this.setControlValue('ContractAddressLine3', '');
        this.setControlValue('ContractAddressLine4', '');
        this.setControlValue('ContractAddressLine5', '');
        this.setControlValue('ContractPostcode', '');
        this.setControlValue('ContractAnnualValue', '');
        this.setControlValue('OldEffectiveDate', '');
        this.setControlValue('OldContractAnnualValue', '');
        this.setControlValue('PercentageChange', '');
        this.setControlValue('EffectiveDate', '');
        this.setControlValue('Decrease', false);
        this.setControlValue('DummyCommission', false);
    }

    private doLookUPForPremiseData(): void {
        let lookupIP = [
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let Premise = data[0][0];
            if (Premise) {
                this.setControlValue('PremiseName', Premise.PremiseName);
                if (this.URLParameterContains('Premise')) {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'BtnSubmit');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'BtnCancel');
                }
                let data: Object = {};
                data['PremiseNumber'] = this.getControlValue('PremiseNumber');
                data['PremiseName'] = this.getControlValue('PremiseName');
                this.onPremiseSearchDataReturn(data);
            } else {
                this.getPremiseError();
            }
        }).catch(e => {
            this.getPremiseError();
        });
        this.formPristine();
    }

    private getPremiseError(): void {
        this.inputParamsPremiseSearch['PremiseNumber'] = this.inputParamsPremiseSearch['PremiseName'] = '';
        this.riExchange.riInputElement.Disable(this.uiForm, 'BtnSubmit');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BtnCancel');
        this.clearField();
        this.setControlValue('PremiseName', '');
        this.setControlValue('ProductCode', '');
        this.setControlValue('ProductDesc', '');
        if (this.getControlValue('PremiseNumber'))
            this.errorModal.show({
                msg: MessageConstant.Message.RecordNotFound, title: MessageConstant.Message.ErrorTitle
            }, false);
        this.setControlValue('PremiseName', '');
    }

    private doLookUPForProductData(): void {
        let lookupIP = [
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc', 'ServiceVisitFrequency']
            }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let Product = data[0][0];
            if (Product) {
                if (this.URLParameterContains('ServiceCover')) {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'BtnSubmit');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'BtnCancel');
                }
                this.setControlValue('ProductDesc', Product.ProductDesc);
                let data: Object = {};
                data['ProductCode'] = this.getControlValue('ProductCode');
                data['ProductDesc'] = this.getControlValue('ProductDesc');
                this.doLookUpForServiceCoverData(data);
            } else {
                this.getProductError();
            }
        }).catch(e => {
            this.getProductError();
        });
        this.formPristine();
    }

    private getProductError(): void {
        this.inputParamsPremiseSearch['ProductCode'] = this.inputParamsPremiseSearch['ProductDesc'] = '';
        if (this.URLParameterContains('ServiceCover')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'BtnSubmit');
            this.riExchange.riInputElement.Disable(this.uiForm, 'BtnCancel');
        }
        this.clearField();
        if (this.getControlValue('ProductCode'))
            this.errorModal.show({
                msg: MessageConstant.Message.RecordNotFound, title: MessageConstant.Message.ErrorTitle
            }, false);
        this.setControlValue('ProductDesc', '');
    }

    private doLookUpForServiceCoverData(data: any): void {
        let lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ServiceVisitFrequency']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((serviceCoverData) => {
            if (serviceCoverData[0].length > 1) {
                this.inputParamsPremiseSearch['ProductCode'] = this.getControlValue('ProductCode');
                this.inputParamsPremiseSearch['ProductDesc'] = this.getControlValue('ProductDesc');
                this.autoOpenProduct = true;
            } else {
                let ServiceCover = serviceCoverData[0][0];
                if (ServiceCover) {
                    data.row = {};
                    data.row['ServiceVisitFrequency'] = ServiceCover.ServiceVisitFrequency;
                    data.row['ttServiceCover'] = ServiceCover.ttServiceCover;
                    this.onProductSearchDataReturn(data);
                }
            }

        });
    }

    public onContractNumberBlur(event: any): void {
        this.setControlValue('ContractNumber', event.target.value);
        this.doLookUPForContractData();
    }

    public onPremiseNumberBlur(event: any): void {
        this.setControlValue('PremiseNumber', event.target.value);
        this.doLookUPForPremiseData();
    }

    public onProductNumberBlur(event: any): void {
        this.setControlValue('ProductCode', event.target.value);
        if (event.target.value === '?' || event.target.value === '"') {
            this.isValidateProduct = true;
        } else {
            this.isValidateProduct = false;
            this.doLookUPForProductData();
        }

    }
}
