import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Logger } from '@nsalaun/ng2-logger';
import { ErrorService } from './../../../shared/services/error.service';
import { RiExchange } from '../../../shared/services/riExchange';
import { GridComponent } from './../../../shared/components/grid/grid';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnDestroy, Input, EventEmitter, Injectable, ViewChild, AfterViewInit, NgZone, AfterViewChecked } from '@angular/core';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Utils } from './../../../shared/services/utility';
import { ActionTypes } from '../../../app/actions/account';
import { TranslateService } from 'ng2-translate';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    selector: 'icabs-account-group-search',
    templateUrl: 'iCABSAAccountGroupSearch.html'
})

export class AccountGroupSearchComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    @ViewChild('invoiceGrid') invoiceGrid: GridComponent;
    @ViewChild('invoicePagination') invoicePagination: PaginationComponent;
    public selectedrowdata: any;
    public method: string = 'contract-management/search';
    public module: string = 'account';
    public operation: string = 'Application/iCABSAAccountGroupSearch';
    public search: URLSearchParams = new URLSearchParams();
    public itemsPerPage: string;
    public currentPage: string;
    public maxColumn: number;
    public DatafromParent: any;
    public CheckboxName: string[];
    public cbChecked: string[];
    public AccSearchGroup: FormGroup;
    public totalItems: number;
    public mssgError: string;
    public mssg: string;
    public activatedRouteSubscription: Subscription;

    public inputParams: any = {
        'FilterBranch': 'All',
        'PortfolioStatus': 'Current',
        'Action': '2',
        'riSortOrder': 'Descending',
        'countryCode': '',
        'businessCode': '',
        'BranchNumber': ' '
    };

    private strParams: string;
    private filterOption: string;
    private PortfolioOption: string;
    private BranchOption: string;
    private grpOption: string;
    private PortfolioStatus: string;
    private URLParameterType: string;
    private SelectedContractTypeCode: string;
    private CurrentColumnName: string = '';
    public translateSubscription: Subscription;
    public translatedMessageList: any = {
        'BranchNumber': 'Branch Number',
        'AccountNumber': 'Account Number',
        'Type': 'Type',
        'ContractNumber': 'Contract Number',
        'CustomerName': 'Customer Name',
        'CommenceDate': 'Commence Date',
        'Status': 'Status',
        'ExpiryDate': 'Expiry Date',
        'AddressLine1': 'Address Line 1'
    };

    public validateProperties: Array<any> = [];

    constructor(
        private logger: Logger,
        private serviceConstants: ServiceConstants,
        private fb: FormBuilder,
        private _router: Router,
        private utils: Utils,
        private store: Store<any>,
        private activatedRoute: ActivatedRoute,
        private riExchange: RiExchange,
        public translate: TranslateService,
        public zone: NgZone,
        private localeTranslateService: LocaleTranslationService) {
        this.CheckboxName = ['Accounts', 'Contracts', 'Jobs', 'Product Sales'];
        this.cbChecked = [];
        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(
            (param: any) => {
                this.DatafromParent = param;
            });
    }

    public ngOnInit(): void {

        this.itemsPerPage = '10';
        this.currentPage = '1';
        this.maxColumn = 9;
        this.inputParams.businessCode = this.utils.getBusinessCode();
        this.inputParams.countryCode = this.utils.getCountryCode();
        this.localeTranslateService.setUpTranslation();

        if (this.DatafromParent !== null && this.DatafromParent !== undefined) {
            this.inputParams.GroupName = this.DatafromParent.GroupName;
            this.inputParams.GroupAccountNumber = this.DatafromParent.GroupAccountNumber;
        }
        this.search.set(this.serviceConstants.Action, '0');
        this.AccSearchGroup = this.fb.group({
            GroupAccountNumber: ['', Validators.required],
            BranchNumber: ['', Validators.required],
            GroupName: [this.inputParams.GroupName]
        });

        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });

        this.getValidateProperties();
        this.AccSearchGroup.controls['BranchNumber'].disable();
        this.EnterFormFields();
        this.refresh();
    }

    public ngAfterViewInit(): void {
        //console.log('--this.riGrid--', this.riGrid);
        //this.refresh();
    }

    public ngAfterViewChecked(): void {
        this.setDefaultToolTipValueInGrid();
    }

    public ngOnDestroy(): void {
        if (this.activatedRouteSubscription) {
            this.activatedRouteSubscription.unsubscribe();
        }
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        this.riExchange.releaseReference(this);
        delete this;
    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('Branch Number', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.BranchNumber = res;
                }
            });
        });
        this.getTranslatedValue('Account Number', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.AccountNumber = res;
                }
            });

        });

        this.getTranslatedValue('Type', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.Type = res;
                }
            });
        });

        this.getTranslatedValue('Contract Number', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.ContractNumber = res;
                }
            });
        });
        this.getTranslatedValue('Customer Name', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.CustomerName = res;
                }
            });
        });
        this.getTranslatedValue('CommenceDate', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.CommenceDate = res;
                }
            });
        });
        this.getTranslatedValue('Status', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.Status = res;
                }
            });
        });
        this.getTranslatedValue('Expiry Date', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.ExpiryDate = res;
                }
            });
        });

        this.getTranslatedValue('Address Line 1', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedMessageList.AddressLine1 = res;
                }
            });
        });

    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public EnterFormFields(): void {
        this.AccSearchGroup.controls['GroupAccountNumber'].setValue(this.inputParams.GroupAccountNumber);
        this.AccSearchGroup.controls['GroupName'].setValue(this.inputParams.GroupName);
    }

    public updateCheckedOptions(chBox: any, event: any): void {
        let cbIdx = this.cbChecked.indexOf(chBox);
        if (event.target.checked) {
            if (cbIdx < 0)
                this.cbChecked.push(chBox);
        } else {
            if (cbIdx >= 0)
                this.cbChecked.splice(cbIdx, 1);
        }
        let key = this.cbChecked;
        if (key.indexOf('Accounts') > -1) {
            this.strParams = '&ExcludeAccounts=True';
            this.search.set('ExcludeAccounts', 'True');
        }
        else if (key.indexOf('Accounts') === -1) {
            this.search.delete('ExcludeAccounts');
        }
        if (key.indexOf('Contracts') > -1) {
            this.strParams = '&ExcludeContracts=True';
            this.search.set('ExcludeContracts', 'True');
        }
        else if (key.indexOf('Contracts') === -1) {
            this.search.delete('ExcludeContracts');
        }
        if (key.indexOf('Jobs') > -1) {
            this.strParams = '&ExcludeJobs=True';
            this.search.set('ExcludeJobs', 'True');
        }
        else if (key.indexOf('Jobs') === -1) {
            this.search.delete('ExcludeJobs');
        }
        if (key.indexOf('Product Sales') > -1) {
            this.strParams = '&ExcludeSales=True';
            this.search.set('ExcludeSales', 'True');
        }
        else if (key.indexOf('Product Sales') === -1) {
            this.search.delete('ExcludeSales');
        }
    }

    public getGridInfo(info: any): void {
        this.invoicePagination.totalItems = info.totalRows;
    }

    public getCurrentPage(curPage: any): void {
        this.search.set('PageCurrent', curPage.value);
        this.currentPage = curPage.value;
        this.inputParams.search = this.search;
        this.invoiceGrid.loadGridData(this.inputParams);
    }

    public onChangeFilter(filterOption: any): void {
        this.filterOption = filterOption;
        this.inputParams.FilterBranch = this.filterOption;
        if (this.inputParams.FilterBranch === 'Servicing' || this.inputParams.FilterBranch === 'Negotiating') {
            this.AccSearchGroup.controls['BranchNumber'].enable();
        }
        else {
            this.AccSearchGroup.controls['BranchNumber'].disable();
        }
    }

    public onChangePortfolio(PortfolioOption: any): void {
        this.PortfolioOption = PortfolioOption;
        this.inputParams.PortfolioStatus = this.PortfolioOption;
    }

    public onkeyupBranch(BranchOption: any): void {
        this.BranchOption = BranchOption;
        this.inputParams.BranchNumber = this.BranchOption;
    }

    public onkeyupgrpAcc(grpOption: any): void {
        this.grpOption = grpOption;
        this.inputParams.GroupAccountNumber = this.grpOption;
        this.search.set('GroupAccountNumber', this.inputParams.GroupAccountNumber);
    }

    public onGridRowClick(data: any): void {
        if (data.cellIndex === 1) {
            this.store.dispatch({
                type: ActionTypes.SAVE_ACCOUNT_ROW_DATA, payload:
                {
                    rowData: {
                        name: data.trRowData[4].text,
                        number: data.trRowData[1].text
                    }
                }
            });
            this._router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE], { queryParams: { Mode: 'GeneralSearch', AccountRowID: data.cellData['rowID'] } });
        } else if (data.cellIndex === 3) {
            if (data.trRowData[2].text === 'C') {
                this._router.navigate([ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE],
                    {
                        queryParams: {
                            strMode: 'InvoiceDetail',
                            parentMode: 'InvoiceDetail',
                            ContractNumber: data.trRowData[3].text
                        }
                    });
            } else if (data.trRowData[2].text === 'P') {
                this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE],
                    {
                        queryParams: {
                            strMode: 'InvoiceDetail',
                            parentMode: 'InvoiceDetail',
                            ContractNumber: data.trRowData[3].text
                        }
                    });

            } else if (data.trRowData[2].text === 'J') {
                this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE],
                    {
                        queryParams: {
                            strMode: 'InvoiceDetail',
                            parentMode: 'InvoiceDetail',
                            ContractNumber: data.trRowData[3].text
                        }
                    });

            }
        }
    }

    public updateView(): void {
        this.setInputParams();
        this.invoiceGrid.loadGridData(this.inputParams);
        this.AccSearchGroup.controls['GroupAccountNumber'].setValue(this.inputParams.GroupAccountNumber);
        this.AccSearchGroup.controls['GroupName'].setValue(this.inputParams.GroupName);
    }

    public setInputParams(): void {
        //this.invoicePagination.setPage(1);
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        this.search.set('action', this.inputParams.Action);
        this.search.set('GroupAccountNumber', this.inputParams.GroupAccountNumber);
        this.search.set('FilterBranch', this.inputParams.FilterBranch);
        this.search.set('PortfolioStatus', this.inputParams.PortfolioStatus);
        this.search.set('BranchNumber', '');
        if (this.inputParams.FilterBranch === 'Servicing' || this.inputParams.FilterBranch === 'Negotiating') {
            this.search.set('BranchNumber', this.inputParams.BranchNumber);
        }
        this.search.set('PageSize', this.itemsPerPage);
        this.search.set('PageCurrent', this.currentPage);
        this.search.set('HeaderClickedColumn', this.CurrentColumnName);
        this.search.set('riSortOrder', this.inputParams.riSortOrder);
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('riCacheRefresh', 'True');
        this.inputParams.search = this.search;
    }

    public refresh(): void {
        if (this.AccSearchGroup.valid === true) {
            this.setInputParams();
            this.AccSearchGroup.controls['GroupAccountNumber'].setValue(this.inputParams.GroupAccountNumber);
            this.invoiceGrid.loadGridData(this.inputParams);
        }
    }

    public setDefaultToolTipValueInGrid(): void {
        this.setTooltipInColumn(1, this.translatedMessageList.BranchNumber);
        this.setTooltipInColumn(2, this.translatedMessageList.AccountNumber);
        this.setTooltipInColumn(3, this.translatedMessageList.Type);
        this.setTooltipInColumn(4, this.translatedMessageList.ContractNumber);
        this.setTooltipInColumn(5, this.translatedMessageList.CustomerName);
        this.setTooltipInColumn(6, this.translatedMessageList.CommenceDate);
        this.setTooltipInColumn(7, this.translatedMessageList.Status);
        this.setTooltipInColumn(8, this.translatedMessageList.ExpiryDate);
        this.setTooltipInColumn(9, this.translatedMessageList.AddressLine1);
    }

    public setTooltipInColumn(colIndex: number, toolTipText: string): any {
        if (colIndex) {
            let query = '.gridtable tbody > tr > td:nth-child(' + colIndex + ')';
            let objList = document.querySelectorAll(query);
            //console.log('colIndex', colIndex, objList);
            if (objList) {
                for (let i = 0; i < objList.length; i++) {
                    if (objList[i]) {
                        let tooltip = objList[i].getAttribute('title');
                        // let elm = objList[i].querySelector('input[type=text]');
                        // let val = elm ? elm['value'] : '';
                        if (typeof (tooltip) === 'undefined' || tooltip === '' && toolTipText) {
                            objList[i].setAttribute('title', toolTipText);
                        }
                    }
                }
            }
        }
    }

    public getValidateProperties(): any {

        this.validateProperties = [
            // {
            //     'type': MntConst.eTypeText,
            //     'index': 0,
            //     'align': 'center'
            // },
            // {
            //     'type': MntConst.eTypeText,
            //     'index': 1,
            //     'align': 'center'
            // },
            // {
            //     'type': MntConst.eTypeText,
            //     'index': 2,
            //     'align': 'center'
            // },
            // {
            //     'type': MntConst.eTypeText,
            //     'index': 3,
            //     'align': 'center'
            // },
            // {
            //     'type': MntConst.eTypeText,
            //     'index': 4,
            //     'align': 'center'
            // },
            {
                'type': MntConst.eTypeDate,
                'index': 5,
                'align': 'center'
            },
            // {
            //     'type': MntConst.eTypeText,
            //     'index': 6,
            //     'align': 'center'
            // },
            {
                'type': MntConst.eTypeDate,
                'index': 7,
                'align': 'center'
            }
            // ,
            // {
            //     'type': MntConst.eTypeText,
            //     'index': 8,
            //     'align': 'center'
            // }
        ];
    }

}
