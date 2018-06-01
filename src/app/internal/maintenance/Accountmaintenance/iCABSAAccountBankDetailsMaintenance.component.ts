import { DropdownStaticComponent } from './../../../../shared/components/dropdown-static/dropdownstatic';
import { CommonDropdownComponent } from './../../../../shared/components/common-dropdown/common-dropdown.component';
import { account } from './../../../reducers/account';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { AccountSearchComponent } from './../../search/iCABSASAccountSearch';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { PostCodeSearchComponent } from '../../../../app/internal/search/iCABSBPostcodeSearch.component';
import { RouteAwayComponent } from '../../../../shared/components/route-away/route-away';
import { Title } from '@angular/platform-browser';
import { Http, URLSearchParams } from '@angular/http';
import { MessageConstant } from '../../../../shared/constants/message.constant';
import { ScreenNotReadyComponent } from '../../../../shared/components/screenNotReady';
import { MessageCallback, ErrorCallback } from '../../../base/Callback';

@Component({
    templateUrl: 'iCABSAAccountBankDetailsMaintenance.html'
})
export class AccountBankDetailsMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('commonDropDown') commonDropDown: CommonDropdownComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('accountSearch') public accountSearch: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('bankAccountTypeCodeDropdown') bankAccountTypeCodeDropdown: DropdownStaticComponent;
    public pageId: string = '';
    public queryPost: URLSearchParams = new URLSearchParams();
    public errorMessage: string;
    @ViewChild('promptModalForSave') public promptModalForSave;
    public showMessageHeaderSave: boolean = true;
    public showHeader: boolean = true;
    public showPromptCloseButtonSave: boolean = true;
    public promptTitleSave: string = '';
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public promptModalConfigSave = {
        ignoreBackdropClick: true
    };
    public isDisabled: boolean = true;
    public isDisabledDropdown: boolean = true;
    public showDeleteDisable: boolean = true;
    public showCancelDisable: boolean = true;
    public showSaveDisable: boolean = true;
    public screenNotReadyComponent: Component;
    @ViewChild('promptModalDelete') public promptModalDelete;
    public headerDelete: boolean = true;
    public closeButtonDelete: boolean = true;
    public promptContentDelete: string = MessageConstant.Message.DeleteRecord;
    public rowid: any;
    public bankactypedesc: any;
    public BankAccountTypeCodeSelectList = [
    ];
    public controls: any = [
        { name: 'AccountNumber', disabled: false },
        { name: 'AccountName', disabled: true },
        { name: 'BankAccountTypeCode', disabled: false },
        { name: 'BankAccountTypeDesc', disabled: true },
        { name: 'BankAccountSortCode', disabled: false },
        { name: 'BankAccountNumber', disabled: false },
        { name: 'VirtualBankAccountNumber', disabled: false },
        { name: 'BankAccountInfo', disabled: false }

    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAACCOUNTBANKDETAILSMAINTENANCE;
    }


    public formControlErrorFlag: any = {
        AccountNumber: false,
        AccountName: false,
        BankAccountTypeCode: false,
        BankAccountSortCode: false,
        BankAccountNumber: false,
        VirtualBankAccountNumber: false,
        BankAccountInfo: false
    };

    public ellipseDisplay: any = {
        accountNumberEllipse: true
    };

    public inputParams: any = {
        operation: 'Application/iCABSAAccountBankDetailsMaintenance',
        module: 'payment',
        method: 'bill-to-cash/maintenance',
        action: '',
        parentMode: '',
        businessCode: '',
        countryCode: ''
    };

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Account Bank Details';
        this.utils.setTitle(this.pageTitle);
        this.screenNotReadyComponent = ScreenNotReadyComponent;
    }

    // tslint:disable-next-line:use-life-cycle-interface
    public ngAfterViewInit(): void {
        this.accountSearch.openModal();
        // Set message call back
        this.setMessageCallback(this);

        // Set error message call back
        this.setErrorCallback(this);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show(data, false);
    }

    public showErrorModal(data: any): void {
        this.messageModal.show(data, true);
    }


    public ngOnDestroy(): void {
        this.routeAwayGlobals.resetRouteAwayFlags();
        if (this.lookUpSubscription)
            this.lookUpSubscription.unsubscribe();
    }


    /**
     * Account number serarch ellipse functionalities
     * updating Account Number and Account Name fields
     */
    public accountSearchComponent = AccountSearchComponent;
    public inputParamsAccSearch: any = {
        'Mode': 'search',
        'showAddNewDisplay': false
    };
    public ellipsisdata = {};
    public setAccountNumber(data: any): void {
        this.showSaveDisable = false;
        this.showCancelDisable = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.ellipsisdata = data;
        this.rowid = data.ttAccount;
        if (data.AccountNumber)
            this.isDisabledDropdown = false;
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('AccountName', data.AccountName);
        this.setControlValue('BankAccountTypeCode', data.BankAccountTypeCode);
        if (data.BankAccountTypeCode)
            this.BankAccountTypeDescoption();
        else
            this.commonDropDown.isActive = '';
        this.setControlValue('BankAccountSortCode', (data.BankAccountSortCode) ? data.BankAccountSortCode : '');
        this.setControlValue('BankAccountNumber', (data.BankAccountNumber) ? data.BankAccountNumber : '');
        this.setControlValue('VirtualBankAccountNumber', (data.VirtualBankAccountNumber) ? data.VirtualBankAccountNumber : '');
        this.setControlValue('BankAccountInfo', (data.BankAccountInfo) ? data.BankAccountInfo : '');
        this.isDisabled = false;
        if ((data.BankAccountTypeCode === null) && (data.VirtualBankAccountNumber === null)
            && (data.BankAccountSortCode === null) && (data.BankAccountNumber === null) && (data.BankAccountInfo === null)) {
            this.showDeleteDisable = true;
        }
        else {
            this.showDeleteDisable = false;
        }
    }

    private BankAccountTypeDescoption(): void {
        let lookupIP: any = [
            {
                'table': 'BankAccountType',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BankAccountTypeCode': this.getControlValue('BankAccountTypeCode')

                },
                'fields': ['BankAccountTypeDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.hasError) {
                this.errorService.emitError(data);
            } else {
                this.bankactypedesc = data[0][0]['BankAccountTypeDesc'];
                this.commonDropDown.isActive = this.getControlValue('BankAccountTypeCode') + ' - ' + this.bankactypedesc;
            }
        },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public accountNumberOnchange(): void {
        this.showSaveDisable = false;
        this.showCancelDisable = false;
        this.setControlValue('AccountNumber', this.utils.fillLeadingZeros(this.getControlValue('AccountNumber'), 9));
        this.Accountname();
        if (this.getControlValue('AccountNumber'))
            this.isDisabledDropdown = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');

    }

    public accountrowid: any;
    //account details lookup
    public lookUpSubscription: Subscription;
    public Accountname(): void {
        let lookupIP: any = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode,
                    'AccountNumber': this.getControlValue('AccountNumber')
                },
                'fields': ['AccountName', 'BankAccountTypeCode', 'BankAccountSortCode', 'BankAccountNumber', 'VirtualBankAccountNumber', 'BankAccountInfo']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP, 1).subscribe((data) => {
            let account: any;
            if (data.hasError) {
                this.errorService.emitError(data);
            } else if (data) {
                account = data[0][0];
                this.setControlValue('AccountName', account.AccountName);
                this.setControlValue('BankAccountTypeCode', account.BankAccountTypeCode);
                if (account.BankAccountTypeCode)
                    this.BankAccountTypeDescoption();
                else
                    this.commonDropDown.isActive = '';
                this.setControlValue('BankAccountSortCode', account.BankAccountSortCode);
                this.setControlValue('BankAccountNumber', account.BankAccountNumber);
                this.setControlValue('VirtualBankAccountNumber', account.VirtualBankAccountNumber);
                this.setControlValue('BankAccountInfo', account.BankAccountInfo);
                this.accountrowid = account.ttAccount;
                if ((account.BankAccountTypeCode === null) && (account.BankAccountSortCode === null) &&
                    (account.BankAccountNumber === null) && (account.VirtualBankAccountNumber === null) && (account.VirtualBankAccountNumber === null) && (account.BankAccountInfo === null)) {
                    this.showDeleteDisable = true;
                }
                else {
                    this.showDeleteDisable = false;
                }
            };
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);

        },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public displayiCABSSSystemBankAccountTypeSearchColumns: Array<string> = ['BankAccountTypeCode', 'BankAccountTypeDesc'];
    public inputParamsiCABSSSystemBankAccountTypeSearchDropdown: any = {
        method: 'bill-to-cash/search',
        module: 'payment',
        operation: 'System/iCABSSSystemBankAccountTypeSearch'
    };

    public oniCABSSSystemBankAccountTypeSearchDropdownDataRecieved(event: any): void {
        this.setControlValue('BankAccountTypeCode', event.BankAccountTypeCode);
        this.setControlValue('BankAccountTypeDesc', event.BankAccountTypeDesc);
    }

    // on clicking save button
    public saveOnclick(): any {
        this.promptModalForSave.show();
    }

    /*** Implementation of save logic*/
    public promptContentSaveData(): void {
        let formdata: Object = {};
        this.queryPost.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryPost.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryPost.set(this.serviceConstants.Action, '2');
        formdata['AccountROWID'] = this.rowid;
        formdata['AccountNumber'] = this.uiForm.controls['AccountNumber'].value;
        formdata['AccountName'] = this.uiForm.controls['AccountName'].value;
        formdata['BankAccountTypeCode'] = this.getControlValue('BankAccountTypeCode');
        formdata['BankAccountSortCode'] = this.uiForm.controls['BankAccountSortCode'].value;
        formdata['BankAccountNumber'] = this.uiForm.controls['BankAccountNumber'].value;
        formdata['VirtualBankAccountNumber'] = this.uiForm.controls['VirtualBankAccountNumber'].value;
        formdata['BankAccountInfo'] = this.uiForm.controls['BankAccountInfo'].value;
        this.inputParams.search = this.queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.queryPost, formdata)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                }
                else {
                    this.messageService.emitMessage({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' });
                    this.formPristine();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    //cancel logic
    public cancelOnclick(): void {
        this.setControlValue('AccountNumber', '');
        this.setControlValue('AccountName', '');
        this.setControlValue('BankAccountTypeCode', '');
        this.setControlValue('BankAccountSortCode', '');
        this.setControlValue('BankAccountNumber', '');
        this.setControlValue('VirtualBankAccountNumber', '');
        this.setControlValue('BankAccountInfo', '');
        this.setAccountNumber(this.ellipsisdata);
    }

    public onDataChanged(data: any): void {
        this.setControlValue(data.target.id, this.utils.capitalizeFirstLetter(data.target.value));
    }

    //Delete logic

    public deleteOnclick(): any {
        this.promptModalDelete.show();
    }

    public promptDelete(): void {
        let formdata: Object = {};
        this.queryPost.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.queryPost.set(this.serviceConstants.CountryCode, this.countryCode());
        this.queryPost.set(this.serviceConstants.Action, '3');
        formdata['AccountROWID'] = this.accountrowid;
        formdata['AccountNumber'] = this.uiForm.controls['AccountNumber'].value;

        this.inputParams.search = this.queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.queryPost, formdata)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                }
                else {
                    this.messageService.emitMessage({ msg: MessageConstant.Message.RecordDeleted, title: 'Message' });
                    this.uiForm.reset();
                    this.isDisabled = true;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
}
