import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { Subscription } from 'rxjs/Subscription';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Title } from '@angular/platform-browser';

@Component({
    templateUrl: 'iCABSATaxRegistrationChange.html'
})

export class TaxRegistrationChangeComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('errorModal') public errorModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    public pageId: string = '';
    public controls = [
        { name: 'AccountNumber', required: true },
        { name: 'AccountName', required: false, disabled: true },
        { name: 'CompanyVATNumber', required: true }
    ];
    public lookUpSubscription: Subscription;
    public showMessageHeader: boolean = true;
    public accountSearchComponent = AccountSearchComponent;
    public showCloseButton: boolean = true;
    public inputParamsAccount: any = {
        'showAddNewDisplay': false,
        'parentMode': 'Search',
        'showAddNew': false,
        'countryCode': this.countryCode(),
        'businessCode': this.businessCode(),
        'showCountryCode': false,
        'showBusinessCode': false
    };
    public isRequesting: boolean = false;
    public autoOpenSearch: boolean = false;
    public searchModalRoute: string = '';
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public pageFormMode: string;
    public showHeader: boolean = true;
    public isAccountEllipsisDisabled: boolean = false;
    public queryParams: any = {
        operation: 'Application/iCABSATaxRegistrationChange',
        module: 'tax',
        method: 'bill-to-cash/maintenance'
    };
    public accountRowID: any;
    public storeDataTemp: any;
    public promptConfirmContent: any;

    constructor(injector: Injector, public titleService: Title) {
        super(injector);
        this.pageId = PageIdentifier.ICABSATAXREGISTRATIONCHANGE;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Tax Registration Maintenance';
        this.pageFormMode = 'New';
    }

    ngAfterViewInit(): void {
        this.autoOpenSearch = true;
        let strDocTitle = 'Move Account';
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            try {
                this.getTranslatedValue(strDocTitle, null).subscribe((res: string) => {
                    if (res) {
                        this.titleService.setTitle(res);
                    } else {
                        this.titleService.setTitle(strDocTitle);
                    }
                });
            } catch (e) {
                //
            }
        });
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public accountNumber_onkeydown(obj: any): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AccountNumber', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccountNumber', false);
        if (obj.keyCode === 34) {
            this.autoOpenSearch = true;
        }
    }

    public accountNumber_onchange(obj: any): void {
        if (obj.value && obj.value !== '') {
            this.setControlValue('AccountNumber', this.utils.numberPadding(obj.value, 9));
            this.ajaxSource.next(this.ajaxconstant.START);

            let data = [{
                'table': 'Account',
                'query': { 'AccountNumber': this.getControlValue('AccountNumber') },
                'fields': ['AccountNumber', 'AccountName']
            }];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.lookUpSubscription = this.LookUp.lookUpRecord(data).subscribe((e) => {
                if (e[0][0]) {
                    this.setControlValue('AccountName', e[0][0].AccountName);
                    this.setFormMode(this.c_s_MODE_UPDATE);
                    this.pageFormMode = 'New';
                } else {
                    this.setControlValue('AccountName', '');
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                    this.errorModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                }
                this.setControlValue('CompanyVATNumber', '');
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
                (error) => {
                    this.setControlValue('AccountName', '');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            );

        } else {
            this.setControlValue('AccountName', '');
            this.pageFormMode = 'New';
            this.setControlValue('CompanyVATNumber', '');
            this.formPristine();
        }
        this.formPristine();
    }



    public companyVatNumber_onkeydown(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyVATNumber', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'CompanyVATNumber', false);
    }

    /**
     * Account data received from ellipsis
     */
    public onAccountDataReceived(data: any): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AccountNumber', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccountNumber', false);
        this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
        this.uiForm.controls['AccountName'].setValue(data.AccountName);
        this.accountRowID = data.ttAccount;
        this.setFormMode(this.c_s_MODE_UPDATE);
        this.pageFormMode = 'New';
        this.setControlValue('CompanyVATNumber', '');
        this.formPristine();
    }

    public updateData(): void {
        if (!this.getControlValue('AccountNumber') || !this.getControlValue('CompanyVATNumber') || this.getControlValue('AccountNumber') === '' || this.getControlValue('CompanyVATNumber') === '') {
            if (!this.getControlValue('AccountNumber') || this.getControlValue('AccountNumber') === '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AccountNumber', true);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccountNumber', true);
            }
            if (!this.getControlValue('CompanyVATNumber') || this.getControlValue('CompanyVATNumber') === '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyVATNumber', true);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'CompanyVATNumber', true);
            }
        } else {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    }

    public promptConfirmSave(): void {

        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        let postParams: any = {};
        postParams.AccountROWID = this.accountRowID;
        postParams.AccountNumber = this.getControlValue('AccountNumber');
        postParams.AccountName = this.getControlValue('AccountName');
        postParams.CompanyVATNumber = this.getControlValue('CompanyVATNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                    } else {
                        this.pageFormMode = 'Update';
                        this.formPristine();
                        this.setValuesInstoreDataTemp();
                        this.errorModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' }, false);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private setValuesInstoreDataTemp(): void {
        this.storeDataTemp = this.uiForm.getRawValue();
    }

    private restoreFieldsOnCancel(): void {
        for (let key in this.uiForm.controls) {
            if (key && this.uiForm.controls.hasOwnProperty(key)) {
                this.uiForm.controls[key].markAsPristine();
                this.setControlValue(key, this.storeDataTemp[key]);
            }
        }
    }

    public companyVatNumber_onchange(obj: any): void {
        this.setControlValue('CompanyVATNumber', this.getControlValue('CompanyVATNumber').toUpperCase());
        if (this.getControlValue('CompanyVATNumber') === '') {
            this.formPristine();
        }
    }
    public cancelClicked(): void {
        if (this.pageFormMode === 'Update') {
            this.restoreFieldsOnCancel();
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'CompanyVATNumber', false);
        } else {
            this.formPristine();
            this.pageFormMode = 'New';
            this.setFormMode(this.c_s_MODE_SELECT);
            this.setControlValue('CompanyVATNumber', '');
        }
    }

}
