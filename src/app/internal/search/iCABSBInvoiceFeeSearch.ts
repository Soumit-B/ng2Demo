import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Input, NgZone } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Logger } from '@nsalaun/ng2-logger';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ng2-webstorage';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { TableComponent } from './../../../shared/components/table/table';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { HttpService } from './../../../shared/services/http-service';
import { AuthService } from '../../../shared/services/auth.service';
import { Utils } from '../../../shared/services/utility';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ActionTypes } from '../../actions/account';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { ErrorService } from '../../../shared/services/error.service';


@Component({
    templateUrl: 'iCABSBInvoiceFeeSearch.html'
})

export class InvoiceFeeSearchComponent implements OnInit, OnDestroy {
    @ViewChild('invoiceFee') invoiceFee: TableComponent;
    // Local variable
    public inputParamsInvoiceFees = {
        method: 'bill-to-cash/search',
        module: 'charges',
        operation: 'Business/iCABSBInvoiceFeeSearch',
        parentMode: '',
        search: {}
    };

    public search: URLSearchParams = new URLSearchParams();
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public storeSubscription: Subscription;

    public isRequesting: boolean = false;
    public vSCInvoiceFeeIsPercentage: boolean;
    private pageParams: any = {};
    public columns: Array<any> = [];
    public inputParams: any = {};
    public contractStoreData: any;
    public storeData: any;

    constructor(private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private authService: AuthService,
        private ajaxconstant: AjaxObservableConstant,
        private ellipsis: EllipsisComponent,
        private zone: NgZone,
        private store: Store<any>,
        private errorService: ErrorService,
        private utils: Utils,
        private logger: Logger,
        private sysCharConstants: SysCharConstants) {
        /*this.storeSubscription = store.select('contract').subscribe(data => {
            if (data !== null && data['data'] &&
                !(Object.keys(data['data']).length === 0 && data['data'].constructor === Object)) {
                this.contractStoreData = data['data'];
            }
        });*/
    }

    itemsPerPage: number = 10;
    page: number = 1;

    private GetInvoiceFeeIsPercentage(): any {
        let sysCharInvoiceFeeIsPercentage: number = this.sysCharConstants.SystemCharInvoiceFeeIsPercentage;
        let syscharMethod: string = 'settings/data';
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set('systemCharNumber', JSON.stringify(sysCharInvoiceFeeIsPercentage));
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.httpService.sysCharRequest(search)
            .subscribe((e) => {
                if (e) {
                    if (e.records) {
                        if (e.records.length > 0) {
                            this.vSCInvoiceFeeIsPercentage = e.records[0].Required;
                            this.pageParams['speedscript'] = this.vSCInvoiceFeeIsPercentage;
                            this.columns = [
                                { title: 'Code', name: 'InvoiceFeeCode', sort: 'asc', type: MntConst.eTypeCode },
                                { title: 'Description', name: 'InvoiceFeeDesc', type: MntConst.eTypeText },
                                { title: this.vSCInvoiceFeeIsPercentage ? 'Percentage' : 'Value', name: this.vSCInvoiceFeeIsPercentage ? 'InvoiceFeePercentage' : 'InvoiceFeeValue', type: this.vSCInvoiceFeeIsPercentage ? MntConst.eTypeDecimal2 : MntConst.eTypeCurrency },
                                { title: 'Default', name: 'InvoiceFeeDefaultInd' }];
                            this.refreshPage();
                        }
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
    }

    public rowmetadata: Array<any> = [{ name: 'InvoiceFeeDefaultInd', type: 'img' }];

    public selectedData(event: any): any {
        let returnObj: any;
        if (this.inputParamsInvoiceFees.parentMode === 'LookUp') {
            returnObj = {
                'InvoiceFeeCode': event.row.InvoiceFeeCode,
                'InvoiceFeeDesc': event.row.InvoiceFeeDesc
            };
        }
        else {
            returnObj = {
                'InvoiceFeeCode': event.row.InvoiceFeeCode,
                'InvoiceFeeDesc': event.row.InvoiceFeeDesc
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    }

    getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.search.set(this.serviceConstants.Action, '0');
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.zone.run(() => {
                    switch (event) {
                        case this.ajaxconstant.START:
                            this.isRequesting = true;
                            break;
                        case this.ajaxconstant.COMPLETE:
                            this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.GetInvoiceFeeIsPercentage();
        this.updateView();
    }

    updateView(): void {
        this.refreshPage();
    }

    public refreshPage(): void {
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParamsInvoiceFees.search = this.search;
        this.invoiceFee.loadTableData(this.inputParamsInvoiceFees);
    }

    public refresh(): void {
        this.refreshPage();
    }

    ngOnDestroy(): void {
        if (this.ajaxSubscription) this.ajaxSubscription.unsubscribe();
        if (this.storeSubscription) this.storeSubscription.unsubscribe();
    }
}
