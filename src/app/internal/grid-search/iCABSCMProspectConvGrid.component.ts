import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Utils } from './../../../shared/services/utility';
import { TranslateService } from 'ng2-translate';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Location } from '@angular/common';
import { GridComponent } from './../../../shared/components/grid/grid';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { GlobalConstant } from './../../../shared/constants/global.constant';

@Component({
    selector: 'icabs-scm-prospect-contract-grid',
    templateUrl: 'iCABSCMProspectConvGrid.html'
})

export class SCMProspectConvGridComponent implements OnInit, OnDestroy {

    @ViewChild('apiProspectGrid') apiContractGrid: GridComponent;
    @ViewChild('apiProspectPagination') apiContractPagination: PaginationComponent;

    public method: string = 'prospect-to-contract/maintenance';
    public module: string = 'prospect';
    public operation: string = 'ContactManagement/iCABSCMProspectConvGrid';
    public search: URLSearchParams = new URLSearchParams();
    public storeSubscription: Subscription;
    public displayContract: boolean = true;
    public displayProspect: boolean = true;
    public tableTitle: string;
    public inputParams: any = {
        'parentMode': '',
        'businessCode': '',
        'countryCode': ''
    };
    public backLinkText: string = '';
    public validateProperties: Array<any> = [
        { 'type': MntConst.eTypeText, 'index': 1, 'align': 'center' },
        { 'type': MntConst.eTypeDate, 'index': 2, 'align': 'center' },
        { 'type': MntConst.eTypeText, 'index': 3, 'align': 'center' },
        { 'type': MntConst.eTypeCurrency, 'index': 4, 'align': 'center' },
        { 'type': MntConst.eTypeText, 'index': 5, 'align': 'center' }
    ];
    contractNumber: string = '';
    contractName: string;
    prospectNumber: string = '';
    accountNumber: string = '';
    currentContractTypeLabel: string = '';
    labelContractNumber: string = 'Contract Number';
    labelProspectNumber: string = 'Prospect Number';

    currentContractTypeURLParameter = '<contract>';
    itemsPerPage: number = 10;
    currentPage: number = 1;
    page: number = 1;
    totalItems: number = 1;
    maxColumn: number = 7;
    storeData: any;
    codeData: any;
    subscription: Subscription;
    routerSubscription: Subscription;

    constructor(private activatedRoute: ActivatedRoute, private serviceConstants: ServiceConstants,
        private store: Store<any>, private router: Router, private translateService: LocaleTranslationService,
        private utils: Utils, private translate: TranslateService, private location: Location) {
        this.subscription = activatedRoute.queryParams.subscribe(
            (param: any) => {
                this.inputParams.parentMode = param['parentMode'];
                this.currentContractTypeURLParameter = param['currentContractTypeURLParameter'];
            });

        if (this.inputParams.parentMode && this.inputParams.parentMode !== 'Prospect') {
            this.storeSubscription = store.select('contract').subscribe(data => {
                console.log('STORE  === ', data);
                if (data !== null && data['data'] &&
                    !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                    this.storeData = data['data'];
                    this.codeData = data['code'];
                }
            });
        } else {
            this.storeSubscription = store.select('prospect').subscribe(data => {
                if (data !== null && data['data'] &&
                    !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                    this.storeData = data['data'];
                    this.codeData = data['code'];
                }
            });
        }

    }

    ngOnInit(): void {
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.translateService.setUpTranslation();
        this.tableTitle = 'Prospect Conversion Grid';
        this.utils.setTitle('Prospect Conversion Grid');
        let params = this.inputParams;
        this.inputParams.businessCode = this.codeData.business;
        this.inputParams.countryCode = this.codeData.country;
        let backText = '';
        this.getTranslatedValue('Contract Maintenance', null).subscribe((res: string) => {
            if (res) {
                backText = res;
            } else {
                backText = 'Contract Maintenance';
            }

        });
        /*this.routerSubscription = this.router.events.subscribe(event => {
            this.backLinkText = '< ' + backText;
            this.backLinkUrl = '#/contractmanagement/maintenance/contract';
        });*/
        this.initPage();
        this.loadGridData();
    }

    ngOnDestroy(): void {
        // prevent memory leak by unsubscribing
        this.subscription.unsubscribe();
        this.storeSubscription.unsubscribe();
    }

    getCurrentPage(currentPage: any): void {
        this.page = currentPage.value;
        this.currentPage = currentPage.value;
        this.loadGridData();
    }

    getGridInfo(info: any): void {
        this.totalItems = info.totalRows;
        this.apiContractPagination.totalItems = info.totalRows;
    }

    getRefreshData(): void {
        //this.currentPage = 1;
        //this.page = 1;
        this.loadGridData();
    }

    loadGridData(): void {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        if (this.inputParams.businessCode) {
            this.search.set(this.serviceConstants.BusinessCode, this.inputParams.businessCode);
        }
        if (this.inputParams.countryCode) {
            this.search.set(this.serviceConstants.CountryCode, this.inputParams.countryCode);
        }
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('AccountNumber', this.accountNumber);
        this.search.set('ContractNumber', this.contractNumber);
        this.search.set('ProspectNumber', this.prospectNumber);
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '68368');
        this.search.set('Mode', this.inputParams.parentMode);
        this.inputParams.search = this.search;
        this.apiContractGrid.loadGridData(this.inputParams);
    }

    initPage(): void {
        this.setCurrentContractType();
        if (this.inputParams.parentMode !== 'Prospect') {
            this.tableTitle = this.currentContractTypeLabel + ' Prospect Conversion';
            this.labelContractNumber = this.currentContractTypeLabel + ' Number';
            this.displayProspect = false;
            this.displayContract = true;
        }
        else {
            this.tableTitle = 'Prospect Conversion';
            this.displayContract = false;
            this.displayProspect = true;
        }

        let strInpTitle;
        let strDocTitle;
        strInpTitle = '^1^ Number';
        strDocTitle = '^1^ Prospect Conversion';
        if (this.inputParams.parentMode !== 'Prospect') {
            strInpTitle = strInpTitle.replace('^1^', this.currentContractTypeLabel);
            strDocTitle = strDocTitle.replace('^1^', this.currentContractTypeLabel);
        } else {
            strInpTitle = strInpTitle.replace('^1^', 'Prospect');
        }
        this.labelContractNumber = strInpTitle;
        this.tableTitle = strDocTitle;

        if (this.inputParams.parentMode !== 'Prospect') {
            this.contractNumber = this.getParentHTMLInputValue('ContractNumber');
            this.contractName = this.getParentHTMLInputValue('ContractName');
        } else {
            this.prospectNumber = this.getParentHTMLInputValue('ProspectNumber');
        }
    }

    addData(): void {
        this.inputParams.parentMode = 'Add';
        this.router.navigate(['maintenance/prospectConversionMaintenance'], { queryParams: { ProspectNumber: this.prospectNumber } });
    }

    gridBodyRowClick(event: any): void {
        if (event.name === 'ProspectNumber') {
            //console.log(event, 'event===');
            this.inputParams.parentMode = 'Update';
            let obj = this.apiContractGrid.getCellInfoForSelectedRow(0, 0);
            //console.log(obj, 'obj==============');
            //this.router.navigate(['maintenance/prospectConversionMaintenance'], { queryParams: { ProspectConversionRowID: this.prospectNumber } });
        }
    }

    getParentHTMLInputValue(key: string): any {
        let outputvalue: any;
        if (key === 'ContractNumber') {
            outputvalue = this.storeData['ContractNumber'];
            this.accountNumber = this.storeData['AccountNumber'];
        } else if (key === 'ContractName') {
            outputvalue = this.storeData['ContractName'];
        } else if (key === 'ProspectNumber') {
            outputvalue = this.storeData.ProspectNumber;
        }
        return outputvalue;
    }

    public setCurrentContractType(): void {
        this.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.utils.getCurrentContractType(this.currentContractTypeURLParameter));
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }
}
