import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs';
import { Logger } from '@nsalaun/ng2-logger';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';

@Component({
    templateUrl: 'iCABSAAccountHistoryDetail.html'
})
export class AccountHistoryDetailComponent implements OnInit, OnDestroy {
    public search: URLSearchParams = new URLSearchParams();
    public accountHistoryNarrative: string = '';
    public accountNumber: string;
    public accountName: string = '';
    public accountHistoryNumber: string;
    public invoiceGroupDesc: string = '';
    public invoiceGroupNumber: string = '';
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public isRequesting = false;
    private sub: Subscription;
    private errorMessage;
    private routeParams: any;
    private rowID: string = '';

    constructor(
        private route: ActivatedRoute,
        private serviceConstants: ServiceConstants,
        private _httpService: HttpService,
        private utils: Utils,
        private _logger: Logger
    ) { }

    ngOnInit(): void {
        this._logger.log('Inside: AccountHistoryDetail');
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
                this.accountNumber = this.routeParams.accountNumber;
                this.accountHistoryNumber = '';
                this.invoiceGroupNumber = this.routeParams.invoiceGroupNumber;
                this.rowID = this.routeParams.rowID;
                this.invoiceGroupDesc = this.routeParams.invoiceGroupDesc;
                this.updateView();
            }
        );
    }

    ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
    }

    //public updateView(data: any): void {
    public updateView(): void {
        let xhrParams = {};
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('AccountNumber', this.accountNumber);
        this.search.set('rowID', this.rowID);

        xhrParams = {
            module: 'account',
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAAccountHistoryDetail',
            search: this.search
        };
        this.getData(xhrParams);
    }

    private getData(xhrParams: any): any {
        this.isRequesting = true;
        this._httpService.makeGetRequest(
            xhrParams.method,
            xhrParams.module,
            xhrParams.operation,
            xhrParams.search
        ).subscribe(
            (data) => {
                this.isRequesting = false;
                this.accountHistoryNarrative = data.AccountHistoryNarrative;
                this.accountNumber = data.AccountNumber;
                this.accountHistoryNumber = data.AccountHistoryNumber;
                this.invoiceGroupNumber = data.InvoiceGroupNumber;
                if (data.InvoiceGroupDesc)
                    this.invoiceGroupDesc = data.InvoiceGroupDesc;
                else
                    this.invoiceGroupDesc = '';

                let dataLookup = [{
                    'table': 'Account',
                    'query': { 'AccountNumber': this.accountNumber, 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['AccountNumber', 'AccountName']
                }];
                this.lookUpRecord(JSON.parse(JSON.stringify(dataLookup)), 5).subscribe(
                    (e) => {
                        if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                            this.accountName = e['results'][0][0].AccountName;
                        } else {
                            this.accountName = '';
                        }
                    },
                    (error) => {
                        this.accountName = '';
                    }
                );
            },
            error => {
                this.errorMessage = error as any;
            }
            );
    }

    public lookUpRecord(data: any, maxresults: any): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this._httpService.lookUpRequest(this.queryLookUp, data);
    }
}
