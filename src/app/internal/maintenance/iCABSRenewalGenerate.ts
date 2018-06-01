import { Component, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
@Component({
    templateUrl: 'iCABSRenewalGenerate.html'
})

export class RenewalGenerateComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName', disabled: true },
        { name: 'TermiteRenewal' },
        { name: 'APIOnTermiteRenewal' },
        { name: 'IncludeNationalAccounts' },
        { name: 'FromDate' },
        { name: 'ToDate' }
    ];
    public dateReadOnly: boolean = false;
    public DateTo: Date = new Date();
    public DateFrom: Date = new Date();
    public branchNumber: string;
    public BranchSearch: any;
    public inputParamsBranch: any = {};
    public negBranchNumberSelected: Object = {
        id: '',
        text: ''
    };
    public isRequesting: boolean = false;
    public TodtDisplayed: string;
    public FromdtDisplayed: string;
    public showMessageHeader: boolean = true;
    @ViewChild('ContractSearchComponent') ContractSearchComponent;
    @ViewChild('messageModal') public messageModal;
    public contractSearchComponent = ContractSearchComponent;
    // inputParams for Contract SearchComponent Ellipsis
    public ellipsis = {
        contractSearch: {
            disabled: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'Search',
                currentContractType: 'C',
                currentContractTypeURLParameter: '<contract>',
                showAddNew: true,
                contractNumber: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            showHeader: true,
            showAddNew: false,
            autoOpenSearch: false,
            setFocus: false,
            component: ContractSearchComponent
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSRENEWALGENERATE;
        this.pageTitle = 'Renewal Generation';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.window_onload();
    }

    public window_onload(): void {
        setTimeout(() => {
            this.setFormMode(this.c_s_MODE_UPDATE);
        }, 100);

        this.branchNumber = this.utils.getBranchCode();
        this.lookupBranchName();
        let getFromDate = firstOfNextMonth(1);
        this.DateFrom = getFromDate;
        this.FromdtDisplayed = this.utils.formatDate(this.DateFrom);
        let getToDate = firstOfNextMonth(2);
        getToDate.setDate(getToDate.getDate() - 1);
        this.DateTo = getToDate;
        this.TodtDisplayed = this.utils.formatDate(this.DateTo);
        //Set checkbox value to default selected state
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APIOnTermiteRenewal', 'true');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeNationalAccounts', 'true');
    }

    /*# Get and Set Branch Name #*/
    public lookupBranchName(): any {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.utils.getBranchCode()
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Branch = data[0][0];
            if (Branch) {
                this.negBranchNumberSelected = {
                    id: this.branchNumber,
                    text: this.branchNumber + ' - ' + Branch.BranchName
                };

            }
        });
    }

    public onBranchDataReceived(obj: any): void {
        this.branchNumber = obj.BranchNumber;
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    }

    // On contract number ellipsis data return
    public onContractDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
    }

    public onContractNumberKeyDown(e: any): void {
        if (e.keyCode === 34) {
            this.ellipsis.contractSearch.autoOpenSearch = true;
        }
    }

    public onContractNumberChange(): void {
        if (!this.getControlValue('ContractNumber') || this.getControlValue('ContractNumber') === '') {
            this.setControlValue('ContractName', '');
        } else {
            let queryParams: any = {
                operation: 'ApplicationReport/iCABSRenewalGenerate',
                module: 'letters',
                method: 'ccm/maintenance'
            };
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '0');

            let postParams: any = {};
            postParams.Function = 'GetContractName';
            postParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ajaxSource.next(this.ajaxconstant.START);

            this.httpService.makePostRequest(queryParams.method, queryParams.module, queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (e) => {
                    if (e['status'] === 'failure') {
                        this.errorService.emitError(e['oResponse']);
                    } else {
                        if ((typeof e !== 'undefined' && e['errorMessage'])) {
                            this.messageModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                        } else {
                            this.setControlValue('ContractName', e.ContractName);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public onSubmit(e: any): void {
        if (this.FromdtDisplayed === '' || this.TodtDisplayed === '') {
            //@TODO
        } else {
            let queryParams: any = {
                operation: 'ApplicationReport/iCABSRenewalGenerate',
                module: 'letters',
                method: 'ccm/maintenance'
            };

            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '0');

            let postParams: any = {};
            postParams.TabSelected = 'ALL';
            postParams.BranchNumber = this.branchNumber;
            postParams.IncludeNationalAccounts = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeNationalAccounts') ? 'yes' : 'no';
            postParams.OnlyTermiteContracts = this.riExchange.riInputElement.GetValue(this.uiForm, 'TermiteRenewal') ? 'yes' : 'no';
            postParams.TermiteAPI = this.riExchange.riInputElement.GetValue(this.uiForm, 'APIOnTermiteRenewal') ? 'yes' : 'no';
            postParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            postParams.RNDateFrom = this.FromdtDisplayed;
            postParams.RNDateTo = this.TodtDisplayed;
            postParams.IncludeRN = 'yes';

            this.ajaxSource.next(this.ajaxconstant.START);

            this.httpService.makePostRequest(queryParams.method, queryParams.module, queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (e) => {
                    if (e['status'] === 'failure') {
                        this.errorService.emitError(e['oResponse']);
                    } else {
                        if ((typeof e !== 'undefined' && e['errorMessage'])) {
                            this.messageModal.show({ msg: e['errorMessage'], title: '' }, false);
                        } else {
                            this.messageModal.show({ msg: e.ReturnHTML, title: '' }, false);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.FromdtDisplayed = value.value;
        } else {
            this.FromdtDisplayed = '';
        }
    }

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.TodtDisplayed = value.value;
        } else {
            this.TodtDisplayed = '';
        }
    }

    public modalHidden(e: any): void {
        this.ellipsis.contractSearch.autoOpenSearch = false;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}

function firstOfNextMonth(m: any): any {
    let d = new Date();
    d.setMonth(d.getMonth() + m, 1);
    return d;
}
