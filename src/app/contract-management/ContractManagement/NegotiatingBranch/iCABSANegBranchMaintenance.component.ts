import { Component, OnInit, ViewChild, Injector, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs/Rx';

import { AccountHistoryGridComponent } from './../../../internal/grid-search/iCABSAAccountHistoryGrid';
import { LookUp } from './../../../../shared/services/lookup';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { ContractSearchComponent } from '../../../internal/search/iCABSAContractSearch';
import { EmployeeSearchComponent } from '../../../internal/search/iCABSBEmployeeSearch';
import { BranchSearchComponent } from '../../../internal/search/iCABSBBranchSearch';
import { MessageConstant } from '../../../../shared/constants/message.constant';
import { MessageCallback, ErrorCallback } from '../../../base/Callback';
import { ICabsModalVO } from '../../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSANegBranchMaintenance.html'
})
export class NegBranchMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('confirmOkModal') public confirmOkModal;
    @ViewChild('promptModalForSave') public promptModalForSave;
    @ViewChild('promptModalForCancel') public promptModalForCancel;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('branchsearchDropDown') branchsearchDropDown: BranchSearchComponent;

    private messageTitle: string = MessageConstant.Message.MessageTitle;
    private savedSuccessfully: string = MessageConstant.Message.RecordSavedSuccessfully;

    public showMessageHeaderSave: boolean = true;
    public isButtonDisabled: boolean = true;
    public isDisabledBranchSearch: boolean = true;
    public showMessageHeaderCancel: boolean = true;
    public isVisibleContractDurationCode: boolean = false;
    public isVisibleContractExpiryDate: boolean = false;
    public showHeader: boolean = true;
    public showPromptCloseButtonSave: boolean = true;
    public showPromptCloseButtonCancel: boolean = true;
    public showErrorHeader = true;
    public promptTitleSave: string = '';
    public promptTitleCancel: string = '';
    public promptContentSave: string = 'Confirm Record';
    public promptContentCancel: string = 'Cancel Record?';
    public promptModalConfigSave = {
        ignoreBackdropClick: true
    };
    public promptModalConfigCancel = {
        ignoreBackdropClick: true
    };
    public messageContentSave: string;
    public expiryDateDisplay: string = '';
    public dateObjects: any = {};
    public pageId: string = '';
    public pageTitle: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public inputParams: any = {};
    public branchCodeList: Array<any>;
    public autoOpenSearch: boolean;

    public controls = [
        { name: 'AccountNumber', disabled: true, required: false },
        { name: 'AccountName', disabled: true, required: false },
        { name: 'ContractNumber', disabled: false, required: true },
        { name: 'ContractName', disabled: true, required: false },
        { name: 'ContractAddressLine1', disabled: true, required: false },
        { name: 'ContractAddressLine2', disabled: true, required: false },
        { name: 'ContractAddressLine3', disabled: true, required: false },
        { name: 'ContractAddressLine4', disabled: true, required: false },
        { name: 'ContractAnnualValue', disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'ContractAddressLine5', disabled: true, required: false },
        { name: 'ContractCommenceDate', disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'ContractPostcode', disabled: true, required: false },
        { name: 'ContractDurationCode', disabled: true, required: false },
        { name: 'NegotiatingBranch', disabled: false, required: false },
        { name: 'ContractSalesEmployee', disabled: false, required: true },
        { name: 'SalesEmployeeSurname', disabled: false, required: false },
        { name: 'ContractExpiryDate', disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'Status', disabled: true, required: false },
        { name: 'ContractRowID' }
    ];

    constructor(injector: Injector, public router: Router) {
        super(injector);
        this.pageId = PageIdentifier.ICABSANEGBRANCHMAINTENANCE;
        this.messageContentSave = MessageConstant.Message.SavedSuccessfully;
        this.contractSearchComponent = ContractSearchComponent;
        this.browserTitle = 'Negotiating Branch Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Negotiating Branch Maintenance';
        this.branchCodeList = this.cbbService.getBranchListByCountryAndBusiness(this.countryCode(), this.businessCode());
        this.disableControl('ContractSalesEmployee', true);
        this.disableControl('SalesEmployeeSurname', true);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
        // Set message call back
        this.setMessageCallback(this);

        // Set error message call back
        this.setErrorCallback(this);
        if (this.getControlValue('ContractNumber').trim() !== '') {
            this.autoOpenSearch = false;
            this.BeforeUpdate();
        } else {
            this.autoOpenSearch = true;
        }
    }

    public queryParams: any = {
        operation: 'Application/iCABSANegBranchMaintenance',
        module: 'sales',
        method: 'contract-management/maintenance'
    };

    public expiryDate: Date;
    public commenceDate: string = '';

    //select date
    public dateSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.expiryDateDisplay = value['value'];
            this.setControlValue('ContractExpiryDate', this.expiryDateDisplay);
        }
        else {
            this.expiryDateDisplay = '';
            this.setControlValue('ContractExpiryDate', '');
        }
    }

    /**
     * Contract number search ellipse functionalities
     * updating Account Number and Account Name fields
     */
    public contractSearchComponent = ContractSearchComponent;
    public setContractNumber(data: any): void {
        this.rowid = data.ttContract;
        let contractnumber: any = data.ContractNumber;
        this.setControlValue('ContractNumber', contractnumber);
        let contractname: any = data.ContractName;
        this.setControlValue('ContractName', contractname);
        let accountnumber: any = data.AccountNumber;
        this.setControlValue('AccountNumber', accountnumber);
        this.commenceDate = data.ContractCommenceDate;
        this.setControlValue('NegotiatingBranch', data.NegBranchNumber);
        this.fetchNegBranchName();
        this.BeforeFetch();
        this.BeforeUpdate();
        this.AfterFetch();
    }
    public inputParamsContractSearch: any = {
        'Mode': 'search'
    };

    public onChangeContractNumber(): void {
        if (!this.getControlValue('ContractNumber')) {
            this.uiForm.reset();
            this.branchsearchDropDown.active = {id: '' , text: ''};
            this.isButtonDisabled = true;
            this.isDisabledBranchSearch = true;
            this.disableControl('ContractSalesEmployee', true);
        }
        this.BeforeFetch();
        this.BeforeUpdate();
        this.AfterFetch();
    }
    /**
     * Employee Code search ellipse functionalities
     * updating Employee Code field
     */
    public employeeSearchComponent = EmployeeSearchComponent;
    public inputParamsEmployeeSearch: any = { 'parentMode': 'LookUp-ContractSalesEmployee' };
    public setEmployeeNumber(data: any): void {
        let employeecode: any = data.ContractSalesEmployee;
        this.setControlValue('ContractSalesEmployee', employeecode);
        let employeesurname: any = data.SalesEmployeeSurname;
        this.setControlValue('SalesEmployeeSurname', employeesurname);
    }

    //checkcontracttype
    public BeforeFetch(): void {
        this.search = new URLSearchParams();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('Function', 'CheckContractType');
        this.search.set('EntryContractType', 'C');
        //body
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(
            (res) => {
                if (res.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage, res.fullError));
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //After Fetch
    public AfterFetch(): void {
        this.search = new URLSearchParams();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('Function', 'GetStatus');
        //body
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(
            (res) => {
                if (res.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage, res.fullError));
                    this.branchsearchDropDown.active = {id: '' , text: ''};
                    this.isButtonDisabled = true;
                    this.isDisabledBranchSearch = true;
                    this.disableControl('ContractSalesEmployee', true);
                    this.uiForm.reset();
                } else {
                    this.setControlValue('Status', res.Status);
                    this.setControlValue('ContractAnnualValue', res.ContractAnnualValue);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //LookUp for annual value and commence date
    public lookUpSubscription: Subscription;
    BeforeUpdate(): void {
        let lookupIP: any = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['NegBranchNumber', 'ContractSalesEmployee', 'ContractName', 'AccountNumber',
                    'ContractCommenceDate', 'ContractDurationCode', 'ContractExpiryDate', 'ttContract']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Contract: any;
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else if (data) {
                Contract = data[0][0];
                if (Contract) {
                    this.setControlValue('ContractCommenceDate', this.globalize.parseDateStringToDate(Contract.ContractCommenceDate));
                    this.setControlValue('ContractName', Contract.ContractName);
                    this.setControlValue('AccountNumber', Contract.AccountNumber);
                    this.fetchAddressLine();
                    this.rowid = Contract.ttContract;
                    this.setControlValue('ContractDurationCode', Contract.ContractDurationCode);
                    this.setControlValue('ContractExpiryDate', this.globalize.parseDateToFixedFormat(Contract.ContractExpiryDate));
                    this.setControlValue('ContractSalesEmployee', Contract.ContractSalesEmployee);
                    this.fetchSurNameLookup();
                    this.setControlValue('NegotiatingBranch', Contract.NegBranchNumber);
                    this.fetchNegBranchName();
                    this.isDisabledBranchSearch = false;
                    this.disableControl('ContractSalesEmployee', false);
                    this.isButtonDisabled = false;
                    this.isVisibleContractDurationCode = true;
                    this.isVisibleContractExpiryDate = true;
                    if (!this.getControlValue('ContractDurationCode')) {
                        this.isVisibleContractDurationCode = false;
                        this.isVisibleContractExpiryDate = false;
                    }
                }
            };
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    fetchNegBranchName(): void {
        let lookupIP: any = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.getControlValue('NegotiatingBranch')
                },
                'fields': ['BranchName']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else if (data) {
                let branch: any = data[0][0];
                this.branchsearchDropDown.active = { id: this.getControlValue('NegotiatingBranch'), text: this.getControlValue('NegotiatingBranch') + '-' + branch.BranchName };
            };
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //look up for address line
    fetchAddressLine(): void {
        let lookupIP: any = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode,
                    'AccountNumber': this.getControlValue('AccountNumber')
                },
                'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            },
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.getControlValue('NegotiatingBranch')
                },
                'fields': ['BranchName']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode,
                    'EmployeeCode': this.getControlValue('ContractSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Account: any;
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else if (data && data[0][0]) {
                Account = data[0][0];
                if (Account) {
                    this.setControlValue('ContractAddressLine1', Account.AccountAddressLine1);
                    this.setControlValue('ContractAddressLine2', Account.AccountAddressLine2);
                    this.setControlValue('ContractAddressLine3', Account.AccountAddressLine3);
                    this.setControlValue('ContractAddressLine4', Account.AccountAddressLine4);
                    this.setControlValue('ContractAddressLine5', Account.AccountAddressLine5);
                    this.setControlValue('AccountName', Account.AccountName);
                    this.setControlValue('ContractPostcode', Account.AccountPostcode);
                }
            };
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //fetch employee surname
    fetchSurNameLookup(): void {
        let lookupIP: any = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode,
                    'EmployeeCode': this.getControlValue('ContractSalesEmployee')
                },
                'fields': ['EmployeeSurname']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Employee: any;
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else if (this.getControlValue('SalesEmployeeSurname') === '' || this.getControlValue('SalesEmployeeSurname') !== '') {
                if (data && data[0][0]) {
                    Employee = data[0][0];
                    this.setControlValue('SalesEmployeeSurname', Employee.EmployeeSurname);
                } else {
                    this.setControlValue('SalesEmployeeSurname', '');
                    this.riExchange.riInputElement.isError(this.uiForm, 'ContractSalesEmployee');
                }
            };
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    // on clicking save button
    public saveOnclick(): any {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.fetchSurNameLookup();
            this.promptModalForSave.show();
        }
    }

    /*** Implementation of save logic*/
    public rowid: any;
    public promptContentSaveData(eventObj: any): void {
        this.search = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('Function', 'GetStatus');

        formdata['ContractRowID'] = this.rowid;
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['NegBranchNumber'] = this.getControlValue('NegotiatingBranch');
        formdata['ContractSalesEmployee'] = this.getControlValue('ContractSalesEmployee');
        formdata['ContractName'] = this.getControlValue('ContractName');
        formdata['AccountNumber'] = this.getControlValue('AccountNumber');
        formdata['ContractAnnualValue'] = this.getControlValue('ContractAnnualValue');
        formdata['ContractCommenceDate'] = this.getControlValue('ContractCommenceDate');
        formdata['ContractDurationCode'] = this.getControlValue('ContractDurationCode');
        formdata['ContractExpiryDate'] = this.getControlValue('ContractExpiryDate');
        formdata['CurrentBranch'] = this.utils.getBranchCode();

        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(
            (res) => {
                if (res.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(res.errorMessage, res.fullError));
                } else {
                    this.messageModal.show({ msg: this.savedSuccessfully, title: this.messageTitle }, false);
                    this.formPristine();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //cancel logic
    public onCancel(): void {
        this.promptModalForCancel.show();
    }

    public promptContentCancelData(eventObj: any): void {
        this.BeforeUpdate();
    }

    public onreceivedBranch(data: any): void {
        this.setControlValue('NegotiatingBranch', data.BranchNumber);

    }

}
