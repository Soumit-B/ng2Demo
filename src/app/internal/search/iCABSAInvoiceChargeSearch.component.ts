import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { Logger } from '@nsalaun/ng2-logger';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Utils } from './../../../shared/services/utility';
import { URLSearchParams } from '@angular/http';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { TranslateService } from 'ng2-translate';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GlobalizeService } from './../../../shared/services/globalize.service';
@Component({
    templateUrl: 'iCABSAInvoiceChargeSearch.html'
})

export class InvoiceChargeSearchComponent implements OnInit, OnDestroy {
    @ViewChild('chargeSearchTable') searchTable: TableComponent;
    public selectedrowdata: any;
    public params: any;
    public method: string = 'contract-management/search';
    public module: string = 'contract-admin';
    public operation: string = 'Application/iCABSAInvoiceChargeSearch';
    public search: URLSearchParams = new URLSearchParams();
    public querySubscription: Subscription;
    public ContractTypeDescription: string = 'Contract';
    public ContractTypeCode: string;
    public ExchangeMode: string = this.ContractTypeDescription + '-Add';
    public CurrentContractTypeURLParameter: string;
    public itemsPerPage: number = 10;
    public page: number = 1;
    public totalItem: number = 11;
    public currentRouteParams: any;
    private ContractNumber: string = '';
    private ContractName: string = '';
    private ContractInvoiceChargeRowId: string;
    private PremiseNumber: string = '';
    private PremiseName: string = '';
    public inputParams: any = { 'parentMode': '', action: 0 };;
    public columns: Array<any> = [
        { title: 'Invoice Charge', name: 'InvoiceChargeLocalDesc', sort: 'ASC' , type: MntConst.eTypeText},
        { title: 'Description', name: 'InvoiceChargeDesc', type: MntConst.eTypeText },
        { title: 'Value', name: 'InvoiceChargeValue', type: MntConst.eTypeCurrency }
    ];
    public invoiceChargeFormGroup: FormGroup;

    constructor(
        private serviceConstants: ServiceConstants,
        private fb: FormBuilder,
        private _router: Router,
        private localeTranslateService: LocaleTranslationService,
        private utils: Utils,
        private logger: Logger,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private globalize: GlobalizeService
    ) {
        this.querySubscription = this.route.queryParams.subscribe(params => {
            this.currentRouteParams = params;
            if (params['ContractNumber']) {
                this.ContractNumber = params['ContractNumber'];
            }
            if (params['ContractName']) {
                this.ContractName = params['ContractName'];
            }
            if (params['parentMode']) {
                this.ContractTypeDescription = params['parentMode'];
                this.inputParams['parentMode'] = params['parentMode'];
            }
            if (params['PremiseNumber']) {
                this.PremiseNumber = params['PremiseNumber'];
            }
            if (params['PremiseName']) {
                this.PremiseName = params['PremiseName'];
            }
        });
    }

    public ngOnInit(): void {
        //below variables are set from data coming from parent
        this.localeTranslateService.setUpTranslation();
        this.createPage(this.ContractTypeDescription);
        this.updateView(this.inputParams);
        if (this.columns) {
            for (let column in this.columns) {
                if (column) {
                    let obj = this.columns[column];
                    this.getTranslatedValue(obj.title, null).then((res: string) => {
                        if (res) { obj.title = res; }
                    });
                }
            }
        }
        this.utils.setTitle('Invoice Charge Search');
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params }).toPromise();
        } else {
            return this.translate.get(key).toPromise();
        }
    }

    public selectedData(event: any): void {
        let returnObj: any;
        this.ContractTypeCode = this.utils.getCurrentContractType(this.currentRouteParams['currentContractTypeURLParameter'] || '');
        this.ContractInvoiceChargeRowId = event.rowid;
        console.log('row', event);
        this.logger.warn(this.ContractTypeDescription + '`' + this.ContractTypeCode);
        if (this.ContractTypeDescription === 'Contract' || this.ContractTypeDescription === 'Contract-Search') {
            if (this.ContractTypeCode === 'C') {
                returnObj = {
                    'CurrentContractTypeURLParameter': ''

                };
            }
            if (this.ContractTypeCode === 'P') {
                returnObj = {

                    'CurrentContractTypeURLParameter': 'product'
                };
            }
            if (this.ContractTypeCode === 'J') {
                returnObj = {

                    'CurrentContractTypeURLParameter': 'Job'
                };
            }
        } else if (this.ContractTypeDescription === 'Premise' || this.ContractTypeDescription === 'Premise-Search') {

            if (this.ContractTypeCode === 'C') {
                returnObj = {

                    'CurrentContractTypeURLParameter': ' '
                };
            }
            if (this.ContractTypeCode === 'P') {
                returnObj = {

                    'CurrentContractTypeURLParameter': 'product'
                };
            }
            if (this.ContractTypeCode === 'J') {
                returnObj = {

                    'CurrentContractTypeURLParameter': 'Job'
                };
            }
        } else {
            this.ContractInvoiceChargeRowId = event.rowid;
            returnObj = {
                'CurrentContractTypeURLParameter': event.row
            };
        }
        this._router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSAINVOICECHARGEMAINTENANCE], {
            queryParams: {
                parentMode: this.inputParams['parentMode'],
                ContractNumber: this.ContractNumber,
                ContractName: this.ContractName,
                PremiseNumber: this.PremiseNumber,
                PremiseName: this.PremiseName,
                CurrentContractTypeURLParameter: returnObj.currentContractTypeURLParameter,
                ContractInvoiceCharge: event.row.ttContractInvoiceCharge,
                ContractInvoiceChargeNumber: event.row.ContractInvoiceChargeNumber
            }
        });
        //this.ellipsis.sendDataToParent(returnObj);
    }

    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    public createPage(pageparentmode: any): void {
        this.ContractTypeCode = this.utils.getCurrentContractType(this.currentRouteParams['currentContractTypeURLParameter'] || '');
        switch (pageparentmode) {
            case 'Premise':
            case 'Premise-Search':
                this.invoiceChargeFormGroup = this.fb.group({
                    ContractNumber: [this.ContractNumber],
                    ContractName: [this.ContractName],
                    PremiseNumber: [this.PremiseNumber],
                    PremiseName: [this.PremiseName]
                });
                this.search.set('PremiseNumber', this.PremiseNumber);
                break;
            case 'Contract':
            case 'Contract-Search':
                this.invoiceChargeFormGroup = this.fb.group({
                    ContractNumber: [this.ContractNumber],
                    ContractName: [this.ContractName],
                    PremiseNumber: [this.PremiseNumber],
                    PremiseName: [this.PremiseName]
                });
                this.search.set('ContractNumber', this.ContractNumber);
                break;
            default:
                this.invoiceChargeFormGroup = this.fb.group({
                    ContractNumber: [''],
                    ContractName: [''],
                    PremiseNumber: [''],
                    PremiseName: ['']
                });
        }
    }

    public updateView(params: any): void {
        this.inputParams = params;
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ContractNumber', this.ContractNumber);
        this.search.set('PremiseNumber', this.PremiseNumber);
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.searchTable.loadTableData(this.inputParams);

    }

    public onChangeEvent(event: any): void {
        this._router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSAINVOICECHARGEMAINTENANCE], {
            queryParams: {
                parentMode: this.inputParams['parentMode'] + '-Add',
                ContractNumber: this.ContractNumber,
                ContractName: this.ContractName,
                PremiseNumber: this.PremiseNumber,
                PremiseName: this.PremiseName,
                CurrentContractTypeURLParameter: this.currentRouteParams['currentContractTypeURLParameter']
            }
        });
    }

    public refresh(): void {
        this.searchTable.loadTableData(this.inputParams);
    }

    public ngOnDestroy(): void {
        if (this.querySubscription)
            this.querySubscription.unsubscribe();
    }

}
