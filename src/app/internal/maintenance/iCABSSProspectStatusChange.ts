import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { ContractDurationComponent } from './../search/iCABSBContractDurationSearch';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, OnDestroy, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';

@Component({
    templateUrl: 'iCABSSProspectStatusChange.html'
})

export class ProspectStatusChangeComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('contractDurationDropDown') contractDurationDropDown: ContractDurationComponent;

    public pageId: string = '';
    public controls = [
        { name: 'ProspectNumber', disabled: true, required: true },
        { name: 'ProspectName', disabled: true },
        { name: 'ProspectTypeDesc', disabled: true },
        { name: 'ProspectStatusCode', required: true },
        { name: 'ProspectStatusDesc' },
        { name: 'LostBusinessCode' },
        { name: 'LostBusinessDesc' },
        { name: 'LostBusinessDetailCode' },
        { name: 'LostBusinessDetailDesc' },
        { name: 'EstimatedValue' },
        { name: 'EstimatedExpiryDate' },
        { name: 'FollowUpInd' },
        { name: 'FollowUpDate' },
        { name: 'Services' },
        { name: 'HistoryNarrative' },
        { name: 'SalesEmailInd' },
        { name: 'ManagerEmailInd' },
        { name: 'OtherEmailInd' },
        { name: 'OtherEmailAddress' },
        { name: 'ReasonInd', value: 'no' },

        { name: 'ContractDurationCode' },
        { name: 'UpdateableInd', value: 'no' }
    ];

    public queryParams: any = {
        method: 'prospect-to-contract/maintenance',
        module: 'prospect',
        operation: 'Sales/iCABSSProspectStatusChange'
    };

    public showCloseButton: boolean = true;
    public showHeader: boolean = true;

    public trLostBusiness: boolean = false;
    public trLostBusinessDetail: boolean = false;
    public trEstimatedValue: boolean = false;
    public trContractDurationCode: boolean = false;
    public trEstimatedExpiryDate: boolean = false;
    public trFollowUpInd: boolean = false;
    public trServices: boolean = false;
    public tdOtherEmailAddress: boolean = false;
    public tdFollowUpDate: boolean = false;

    public prospectStatusSearchComponent: any;
    public screenNotReadyComponent: any;

    public inputParamsContractDuration = {
        parentMode: 'SOPProspectStatusChange',
        businessCode: this.businessCode(),
        countryCode: this.countryCode()
    };

    public contractDurationDefault: any = {
        id: '',
        text: ''
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSPROSPECTSTATUSCHANGE;
        this.pageTitle = 'Prospect Status Maintenance';
        this.browserTitle = this.pageTitle;
        this.prospectStatusSearchComponent = ScreenNotReadyComponent;
        this.screenNotReadyComponent = ScreenNotReadyComponent; //iCABSBLostBusinessLanguageSearch, iCABSBLostBusinessDetailSearch
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnload(): void {
        if ((this.parentMode === 'PipelineGrid')) {
            this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
            this.setControlValue('ProspectName', this.riExchange.getParentHTMLValue('ProspectName'));
        }
        if ((this.parentMode === 'WorkOrderMaintenance')) {
            this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
            this.setControlValue('ProspectName', this.riExchange.getParentHTMLValue('ProspectName'));
        }
        else {
            this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('PassProspectNumber'));
        }
        this.getProspectDetails();
        this.showHideFields();
    }

    public getProspectDetails(): void {
        this.ajaxSource.next(this.ajaxconstant.START);

        let postSearchParams: URLSearchParams = new URLSearchParams();
        postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        postSearchParams.set(this.serviceConstants.Action, '0');
        postSearchParams.set('ProspectNumber', this.getControlValue('ProspectNumber'));

        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.setControlValue('ProspectName', data.ProspectName);
                    this.setControlValue('ProspectTypeDesc', data.ProspectTypeDesc);
                    this.setControlValue('ProspectStatusCode', data.ProspectStatusCode);
                    this.setControlValue('LostBusinessCode', data.LostBusinessCode);
                    this.setControlValue('LostBusinessDesc', data.LostBusinessDesc);
                    this.setControlValue('LostBusinessDetailCode', data.LostBusinessDetailCode);
                    this.setControlValue('LostBusinessDetailDesc', data.LostBusinessDetailDesc);
                    this.setControlValue('EstimatedContractValue', data.EstimatedContractValue);
                    this.setControlValue('ContractDurationCode', data.ContractDurationCode);
                    this.setControlValue('EstimatedExpiryDate', data.EstimatedExpiryDate);
                    this.setControlValue('FollowUp', this.utils.convertResponseValueToCheckboxInput(data.FollowUp));
                    this.setControlValue('FollowUpDate', data.FollowUpDate);
                    this.setControlValue('Services', data.Services);
                    this.lookUpData();
                    this.prospectStatus();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onProspectStatusDataReceived(data: any): void {
        this.setControlValue('ProspectStatusCode', data.ProspectStatusCode);
        this.setControlValue('ProspectStatusDesc', data.ProspectStatusDesc);
        this.prospectStatus();
    }

    public onProspectStatusCodeChange(data: any): void {
        this.prospectStatus();
    }

    public onFollowUpChange(data: any): void {
        if (this.getControlValue('FollowUpInd')) {
            this.tdFollowUpDate = true;
            this.setControlValue('FollowUpDate', this.utils.formatDate(new Date()));
        }
        else {
            this.tdFollowUpDate = false;
        }
    }

    public onOtherEmailIndChange(data: any): void {
        if (this.getControlValue('OtherEmailInd')) {
            this.tdOtherEmailAddress = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', true);
        }
        else {
            this.tdOtherEmailAddress = false;
            this.setControlValue('OtherEmailAddress', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', false);
        }
    }

    public onReceivedContractDuration(data: any): void {
        this.calcExpiryDate();
    }

    public onSelectedDateValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('EstimatedExpiryDate', value.value);
        }
    }

    public saveData(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.confirmOk.bind(this)));
        }
    }
    public cancelData(data: any): void {
        this.getProspectDetails();
        this.setControlValue('HistoryNarrative', '');
        this.setControlValue('FollowUpInd', false);
        this.setControlValue('SalesEmailInd', false);
        this.setControlValue('ManagerEmailInd', false);
        this.setControlValue('OtherEmailInd', false);
        this.tdOtherEmailAddress = false;
        this.setControlValue('OtherEmailAddress', '');
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OtherEmailAddress', false);
    }

    public confirmOk(): void {
        this.ajaxSource.next(this.ajaxconstant.START);

        let postSearchParams: URLSearchParams = new URLSearchParams();
        postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        postSearchParams.set(this.serviceConstants.Action, '1');

        let postParams: Object = {};
        postParams['ProspectNumber'] = this.getControlValue('ProspectNumber');
        postParams['ProspectName'] = this.getControlValue('ProspectName');
        postParams['ProspectTypeDesc'] = this.getControlValue('ProspectTypeDesc');
        postParams['ProspectStatusCode'] = this.getControlValue('ProspectStatusCode');
        postParams['ProspectStatusDesc'] = this.getControlValue('ProspectStatusDesc');
        postParams['LostBusinessCode'] = this.getControlValue('LostBusinessCode');
        postParams['LostBusinessDetailCode'] = this.getControlValue('LostBusinessDetailCode');
        postParams['ContractDurationCode'] = this.getControlValue('ContractDurationCode');
        postParams['ContractDurationDesc'] = this.getControlValue('ContractDurationDesc');
        postParams['EstimatedExpiryDate'] = this.getControlValue('EstimatedExpiryDate');
        postParams['FollowUpInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('FollowUpInd'));
        postParams['FollowUpDate'] = this.getControlValue('FollowUpDate');
        postParams['Services'] = this.getControlValue('Services');
        postParams['HistoryNarrative'] = this.getControlValue('HistoryNarrative');
        postParams['ReasonInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('ReasonInd'));
        postParams['SalesEmailInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('SalesEmailInd'));
        postParams['ManagerEmailInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('ManagerEmailInd'));
        postParams['OtherEmailInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('OtherEmailInd'));
        postParams['OtherEmailAddress'] = this.getControlValue('OtherEmailAddress');
        postParams['UpdateableInd'] = this.getControlValue('UpdateableInd');
        postParams['dlContractRowID'] = this.getControlValue('dlContractRowID');

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                }
                else {
                    this.formPristine();
                    this.getProspectDetails();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public lookUpData(): void {
        let lookupIP = [
            {
                'table': 'ProspectStatusLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'BusinessCode': this.businessCode(),
                    'ProspectStatusCode': this.getControlValue('ProspectStatusCode')
                },
                'fields': ['ProspectStatusDesc']
            },
            {
                'table': 'ContractDurationLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'BusinessCode': this.businessCode(),
                    'ContractDurationCode': this.getControlValue('ContractDurationCode')
                },
                'fields': ['ContractDurationDesc']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP).subscribe(
            (data) => {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                    return;
                }
                if (data[0].length) {
                    this.setControlValue('ProspectStatusDesc', data[0][0].ProspectStatusDesc);
                }
                if (data[1].length) {
                    this.setControlValue('ContractDurationDesc', data[1][0].ContractDurationDesc);
                    this.contractDurationDefault = {
                        text: this.getControlValue('ContractDurationCode') + ' - ' + data[1][0].ContractDurationDesc,
                        id: this.getControlValue('ContractDurationCode')
                    };
                }
            }, (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
            });
    }

    public prospectStatus(): void {
        if ((this.riExchange.riInputElement.HasChanged(this.uiForm, 'ProspectStatusCode')) && (this.getControlValue('ProspectStatusCode') !== '')) {
            this.ajaxSource.next(this.ajaxconstant.START);

            let postSearchParams: URLSearchParams = new URLSearchParams();
            postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            postSearchParams.set(this.serviceConstants.Action, '6');

            let postParams: Object = {};
            postParams['Function'] = 'GetStatus';
            postParams['ProspectNumber'] = this.getControlValue('ProspectNumber');
            postParams['ProspectStatusCode'] = this.getControlValue('ProspectStatusCode');

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                    } else {
                        this.setControlValue('ProspectStatusDesc', data.ProspectStatusDesc);
                        this.setControlValue('Services', data.Services);
                        this.setControlValue('ReasonInd', data.ReasonInd);
                        this.showHideFields();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public showHideFields(): void {
        let reasonInd = (this.getControlValue('ReasonInd') === 'yes') ? true : false;
        if (reasonInd) {
            this.trLostBusiness = true;
            this.trLostBusinessDetail = true;
            this.trEstimatedValue = true;
            this.trContractDurationCode = true;
            this.setControlValue('ContractDurationCode', '12');
            this.lookUpData();
            this.calcExpiryDate();
            this.trEstimatedExpiryDate = true;
            this.setControlValue('EstimatedExpiryDate', new Date().getDate());
            this.trFollowUpInd = true;
            this.trServices = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', true);
        }
        else {
            this.trLostBusiness = false;
            this.trLostBusinessDetail = false;
            this.trEstimatedValue = false;
            this.trContractDurationCode = false;
            this.trEstimatedExpiryDate = false;
            this.trFollowUpInd = false;
            this.trServices = false;
            this.tdFollowUpDate = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', false);
        }
    }

    public calcExpiryDate(): void {

        if (this.getControlValue('ContractDurationCode') !== '') {
            this.ajaxSource.next(this.ajaxconstant.START);

            let postSearchParams: URLSearchParams = new URLSearchParams();
            postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            postSearchParams.set(this.serviceConstants.Action, '6');

            let postParams: Object = {};
            postParams['Function'] = 'CalculateExpiryDate';
            postParams['ContractDurationCode'] = this.getControlValue('ContractDurationCode');

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                    } else {
                        this.setControlValue('EstimatedExpiryDate', data.EstimatedExpiryDate);
                        this.setControlValue('FollowUpDate', data.FollowUpDate);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }
}
