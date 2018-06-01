import { Component, NgZone, OnInit, OnDestroy, ViewChild, ElementRef, Injector } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { HttpService } from './../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { Utils } from '../../../shared/services/utility';
import { ContractActionTypes } from '../../../app/actions/contract';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { ConfirmOkComponent } from './../../../shared/components/confirm-ok/confirm-ok';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSAServiceCoverCommenceDateMaintenance.html'
})

export class ServiceCoverCommenceDateMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('CommencePicker') CommencePicker: DatepickerComponent;
    @ViewChild('annivDatePicker') annivDatePicker: DatepickerComponent;
    @ViewChild('promptModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    private ServiceCoverRowID: string;
    private search: URLSearchParams;
    private setDateDisplay: string;
    private checkDTLoading: boolean = true;
    public lookUpSubscription: Subscription;
    public method: string = 'contract-management/maintenance';
    public module: string = 'service-cover';
    public operation: string = 'Application/iCABSAServiceCoverCommenceDateMaintenance';
    public contractSearchComponent = ContractSearchComponent;
    public premiseSearchComponent = PremiseSearchComponent;
    public promptTitle: string;
    public promptContent: string;
    public isContractEllipsisDisabled: boolean = true;
    public isPremisesEllipsisDisabled: boolean = true;
    public isProductEllipsisDisabled: boolean = true;
    public autoOpenSearch: boolean = false;
    public showCloseButton: boolean = true;
    public showMessageHeader: any = true;
    public showCancel: boolean = true;
    public pageId: string = '';
    public confirmdata: any = {};
    public regex: any = /^\d{4}-\d{2}-\d{2}$/;
    public commenceDate: Date = new Date();
    public anniversaryDate: Date = new Date();
    public backUpObject: any = {};
    public controls = [
        { name: 'ContractNumber', disabled: true, required: false },
        { name: 'ContractName', disabled: true, required: false },
        { name: 'Status', disabled: true, required: false },
        { name: 'PremiseNumber', disabled: true, required: false },
        { name: 'PremiseName', disabled: true, required: false },
        { name: 'ProductCode', disabled: true, required: true },
        { name: 'ProductDesc', disabled: true, required: false },
        { name: 'AccountNumber', disabled: true, required: false },
        { name: 'AccountName', disabled: true, required: false },
        { name: 'ContractAddressLine1', disabled: true, required: false },
        { name: 'ContractAddressLine2', disabled: true, required: false },
        { name: 'ContractAddressLine3', disabled: true, required: false },
        { name: 'ContractAddressLine4', disabled: true, required: false },
        { name: 'ContractAddressLine5', disabled: true, required: false },
        { name: 'ContractPostcode', disabled: true, required: false },
        { name: 'ContractAnnualValue', disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'ServiceCover', disabled: true, required: false },
        { name: 'ServiceCommenceDate', disabled: false, required: true },
        { name: 'ServiceVisitAnnivDate', disabled: false, required: true }
    ];

    public fieldRequired: any = {
        contractCommenceDate: true,
        annivDate: true
    };
    public defaultCode: any = {
        country: '',
        business: ''
    };
    public dateObjectsEnabled: Object = {
        contractCommenceDate: true,
        annivDate: true
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public queryParamsContract: any = {
        action: '0',
        operation: 'Application/iCABSAContractMaintenance',
        module: 'contract',
        method: 'contract-management/maintenance',
        contentType: 'application/x-www-form-urlencoded',
        branchNumber: '',
        branchName: ''
    };
    public queryParamsContractCommenceDate: any = {
        action: '0',
        operation: 'Application/iCABSAContractCommenceDateMaintenanceEx',
        module: 'contract',
        method: '/contract-management/maintenance',
        contentType: 'application/x-www-form-urlencoded'
    };
    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public contractSearchParams: any = {
        'parentMode': 'LookUp',
        'currentContractType': 'C',
        'currentContractTypeURLParameter': '<contract>',
        'showAddNew': true,
        'contractNumber': ''
    };

    public premisesSearchParams: any = {
        'parentMode': 'LookUp',
        'currentContractType': 'C',
        'currentContractTypeURLParameter': '<premise>',
        'showAddNew': true,
        'contractNumber': ''
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCE;
    }

    public promptSave(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        let formdata: Object = {};
        formdata['ServiceCoverROWID'] = this.getControlValue('ServiceCover');
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
        formdata['ServiceVisitAnnivDate'] = this.getControlValue('ServiceVisitAnnivDate');
        formdata['ServiceAnnualValue'] = this.getControlValue('ContractAnnualValue');
        formdata['Function'] = 'GetStatus';
        formdata['SCRowID'] = this.getControlValue('ServiceCover');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.hasOwnProperty('errorMessage')) {
                    this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                } else {
                    this.backUpObject['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
                    this.backUpObject['ServiceVisitAnnivDate'] = this.getControlValue('ServiceVisitAnnivDate');
                    this.formPristine();
                    this.location.back();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                if (error.errorMessage) {
                    this.errorModal.show(error, true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }


    ngOnInit(): void {
        super.ngOnInit();
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('Status', this.riExchange.getParentHTMLValue('Status'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.setControlValue('AccountName', this.riExchange.getParentHTMLValue('AccountName'));
        this.setControlValue('ServiceCover', this.riExchange.getParentAttributeValue('ContractNumberServiceCoverRowID'));
        this.fetchContractCommenceData();
        this.fetchOtherData();
        this.riMaintenance_Search();
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }

    public onContractDataReceived(data: any): any {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.premisesSearchParams.ContractNumber = this.getControlValue('ContractNumber');
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.riMaintenance_Search();
    }
    public onPremiseDataReceived(data: any): any {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
    }

    public fetchContractCommenceData(): any {
        let data = [{
            'table': 'ServiceCover',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.getControlValue('ContractNumber'), 'PremiseNumber': this.getControlValue('PremiseNumber'), 'ProductCode': this.getControlValue('ProductCode'), 'ttServiceCover': this.getControlValue('ServiceCover') },
            'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCommenceDate', 'ServiceVisitAnnivDate', 'ServiceAnnualValue', 'ServiceCoverRowID']
        }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(data).subscribe((data) => {
            if (data.length > 0) {
                let serviceCoverData = data[0];
                let contractData = data[1];
                let premiseData = data[2];
                if (serviceCoverData.length > 0) {
                    for (let i = 0; i < serviceCoverData.length; i++) {
                        if (serviceCoverData[i].ttServiceCover === this.getControlValue('ServiceCover')) {
                            this.setControlValue('ServiceCover', serviceCoverData[i].ttServiceCover);
                            this.setControlValue('ContractAnnualValue', serviceCoverData[i].ServiceAnnualValue);
                            this.getStatus();
                            this.backUpObject['ServiceCommenceDate'] = serviceCoverData[i].ServiceCommenceDate;
                            this.backUpObject['ServiceVisitAnnivDate'] = serviceCoverData[i].ServiceVisitAnnivDate;
                            this.setCommenceDate(serviceCoverData[i].ServiceCommenceDate);
                            this.setAnniversaryeDate(serviceCoverData[i].ServiceVisitAnnivDate);
                            break;
                        }
                    }
                }
            }
        });
    }
    public fetchOtherData(): any {
        let data = [
            {
                'table': 'Product',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ProductCode': this.getControlValue('ProductCode') },
                'fields': ['ProductCode', 'ProductDesc']
            },
            {
                'table': 'Premise',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.getControlValue('ContractNumber'), 'PremiseNumber': this.getControlValue('PremiseNumber') },
                'fields': ['PremiseNumber', 'PremiseName']
            },
            {
                'table': 'Contract',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.getControlValue('ContractNumber') },
                'fields': ['ContractName', 'AccountNumber']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(data).subscribe((data) => {
            let Product = data[0][0];
            if (Product) {
                this.setControlValue('ProductDesc', Product.ProductDesc);
            }

            let Premise = data[1][0];
            if (Premise) {
                this.setControlValue('PremiseName', Premise.PremiseName);
            }

            let Contract = data[2][0];
            if (Contract) {
                this.setControlValue('ContractName', Contract.ContractName);
                this.setControlValue('AccountNumber', Contract.AccountNumber);
            }
        });
    }

    public onSubmit(e: any): void {
        e.preventDefault();
        this.CommencePicker.validateDateField();
        this.annivDatePicker.validateDateField();
        if (this.uiForm.valid) {
            this.callAccountDetails();
            this.promptTitle = 'Confirm';
            this.promptContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    }

    public commenceDateSelectedValue(value: any): void {
        if (value && value.value) {
            if (this.getControlValue('ServiceCommenceDate') !== '' && value.value !== this.getControlValue('ServiceCommenceDate')) {
                this.setControlValue('ServiceCommenceDate', value.value);
                this.CheckCommenceDate();
            }
        }
        this.setDateDisplay = value.value;
        this.setControlValue('ServiceCommenceDate', this.setDateDisplay);
    }

    public annivDateSelectedValue(value: any): void {
        this.setDateDisplay = value.value;
        this.setControlValue('ServiceVisitAnnivDate', this.setDateDisplay);
    }

    public oncancel(event: any): void {
        this.setCommenceDate(this.backUpObject['ServiceCommenceDate']);
        this.setAnniversaryeDate(this.backUpObject['ServiceVisitAnnivDate']);
        this.formPristine();
        this.location.back();
    }

    private riMaintenance_Search(): void {
        if (this.getControlValue('ContractNumber') === '') {
            this.isContractEllipsisDisabled = false;
        }
        if (this.getControlValue('ContractNumber') !== '' && this.getControlValue('PremiseNumber') === '') {
            this.isPremisesEllipsisDisabled = false;
        }
        if (this.getControlValue('ContractNumber') !== '' && this.getControlValue('PremiseNumber') !== '') {
            this.isProductEllipsisDisabled = true;
        }
    }


    private callAccountDetails(): void {
        let data = [{
            'table': 'Account',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'AccountNumber': this.getControlValue('AccountNumber') },
            'fields': ['AccountNumber', 'AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
        }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(data).subscribe((data) => {
            let Account = data[0][0];
            if (Account) {
                this.setControlValue('AccountName', Account.AccountName);
                this.setControlValue('ContractAddressLine1', Account.AccountAddressLine1);
                this.setControlValue('ContractAddressLine2', Account.AccountAddressLine2);
                this.setControlValue('ContractAddressLine3', Account.AccountAddressLine3);
                this.setControlValue('ContractAddressLine4', Account.AccountAddressLine4);
                this.setControlValue('ContractAddressLine5', Account.AccountAddressLine5);
                this.setControlValue('ContractPostcode', Account.AccountPostcode);
            }
        });
    }

    private getStatus(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        let formdata: Object = {};
        formdata['Function'] = 'GetStatus';
        formdata['SCRowID'] = this.getControlValue('ServiceCover');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                this.setControlValue('Status', data.Status);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                if (error.errorMessage) {
                    this.errorModal.show(error, true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    private CheckCommenceDate(): void {
        if (this.checkDTLoading === true) {
            this.search = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, '6');
            let formdata: Object = {};
            formdata['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
            formdata['Function'] = 'GetAnniversaryDate,WarnCommenceDate';
            formdata['SCRowID'] = this.getControlValue('ServiceCover');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
                .subscribe(
                (data) => {
                    if (data.hasOwnProperty('errorMessage')) {
                        this.errorModal.show(data, true);
                    } else {
                        if (data.hasOwnProperty('ErrorMessage')) {
                            if (data.ErrorMessage !== '')
                                this.errorModal.show({ msg: data.ErrorMessage, title: 'Error' }, false);
                            this.setAnniversaryeDate(data.ServiceVisitAnnivDate);
                        } else {
                            this.setAnniversaryeDate(data.ServiceVisitAnnivDate);
                        }
                    }

                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    if (error.errorMessage) {
                        this.errorModal.show(error, true);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        this.checkDTLoading = true;
    }


    private isValidDate(date: any): boolean {
        return date.match(this.regex) != null;
    }

    private setCommenceDate(date: string): void {
        if (date) {
            this.setDateDisplay = date;
        } else {
            this.setDateDisplay = null;
        }

        if (!this.setDateDisplay) {
            this.commenceDate = null;
            this.setControlValue('ServiceCommenceDate', '');
        } else {
            if (this.isValidDate(this.setDateDisplay))
                this.commenceDate = new Date(this.setDateDisplay);
            else
                this.commenceDate = new Date(this.utils.convertDate(this.setDateDisplay));
            this.setControlValue('ServiceCommenceDate', this.utils.formatDate(this.commenceDate));
        }
    }

    private setAnniversaryeDate(date: string): void {
        if (date) {
            this.setDateDisplay = date;
        } else {
            this.setDateDisplay = null;
        }

        if (!this.setDateDisplay) {
            this.anniversaryDate = null;
            this.setControlValue('ServiceVisitAnnivDate', '');
        } else {
            let getFromDate: any = this.globalize.parseDateToFixedFormat(this.setDateDisplay);
            this.anniversaryDate = this.globalize.parseDateStringToDate(getFromDate) as Date;
        }
    }

}
