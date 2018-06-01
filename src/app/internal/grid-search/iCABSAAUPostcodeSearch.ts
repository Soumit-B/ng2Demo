import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, OnDestroy, NgZone, Inject, forwardRef } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate';

import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Utils } from './../../../shared/services/utility';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ModalAdvService } from './../../../shared/components/modal-adv/modal-adv.service';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { HttpService } from './../../../shared/services/http-service';

@Component({
    templateUrl: 'iCABSAAUPostcodeSearch.html'
})

export class AUPostcodeSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public query: URLSearchParams = new URLSearchParams();
    public parentMode: string = '';
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$: Observable<any>;
    public ajaxSubscription: Subscription;
    public isRequesting: boolean = false;
    public modalAdvService: ModalAdvService;
    public ipTown: string = '';
    public ipState: string = '';
    public ipPostCode: string = '';
    public queryParams: any = {
        operation: 'Application/iCABSAAUPostcodeSearch',
        module: 'validation',
        method: 'contract-management/maintenance',
        contentType: 'application/x-www-form-urlencoded'
    };
    public inputParams: any = {
        town: '',
        state: '',
        postCode: ''
    };

    constructor(private serviceConstants: ServiceConstants,
        private ajaxconstant: AjaxObservableConstant,
        private zone: NgZone,
        private util: Utils,
        private httpService: HttpService,
        private translateService: LocaleTranslationService,
        private ellipsis: EllipsisComponent) {
        super();
        this.ajaxSource$ = this.ajaxSource.asObservable();
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
    }

    public ngOnInit(): void {
        this.translateService.setUpTranslation();
    }

    public ngOnDestroy(): void {
        this.ajaxSubscription.unsubscribe();
    }

    public getRefreshData(): void {
        this.riGridBeforeExecute();
    }

    public updateView(params: any): void {
        this.currentPage = 1;
        this.totalItems = 1;
        this.riGrid.ResetGrid();
        if (params) {
            this.ipTown = params.town;
            this.ipState = params.state;
            this.ipPostCode = params.postCode;
            if (params.parentMode) {
                this.parentMode = params.parentMode;
            }
            this.buildGrid();
            if (this.ipTown || this.ipState || this.ipPostCode) {
                this.riGridBeforeExecute();
            }
        }
    }

    public getCurrentPage(event: any): void {
        this.currentPage = event.value;
        this.riGridBeforeExecute();
    }

    public riGridBeforeExecute(): void {
        this.query = new URLSearchParams();
        this.query.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        this.query.set(this.serviceConstants.Action, '2');
        this.query.set('riGridMode', '0');
        this.query.set('riGridHandle', this.util.randomSixDigitString());
        this.query.set('riCacheRefresh', 'True');
        // set grid sorting parameters
        this.query.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        let sortOrder: string = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.query.set('riSortOrder', sortOrder);
        this.query.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        this.query.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.query.set('Town', this.ipTown);
        this.query.set('State', this.ipState);
        this.query.set('Postcode', this.ipPostCode);
        this.queryParams.search = this.query;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search)
            .subscribe(
            (data) => {
                if (data) {
                    this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalItems = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.riGrid.Execute(data);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.totalItems = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.PageSize = 10;
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.AddColumn('Town', 'AUPostcode', 'Town', MntConst.eTypeCode, 40);
        this.riGrid.AddColumn('State', 'AUPostcode', 'State', MntConst.eTypeCode, 8);
        this.riGrid.AddColumn('Postcode', 'AUPostcode', 'Postcode', MntConst.eTypeCode, 15);
        this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
    }

    public riGridBodyOnClick(): void {
        let returnObj: any = {};
        let ipTown: string = this.riGrid.Details.GetValue('Town');
        let ipState: string = this.riGrid.Details.GetValue('State');
        let ipPostCode: string = this.riGrid.Details.GetValue('Postcode');
        if (this.parentMode === 'Premise') {
            returnObj['PremiseAddressLine4'] = ipTown;
            returnObj['PremiseAddressLine5'] = ipState;
            returnObj['PremisePostcode'] = ipPostCode;
        }
        if (this.parentMode === 'Prospect') {
            returnObj['AddressLine4'] = ipTown;
            returnObj['AddressLine5'] = ipState;
            returnObj['Postcode'] = ipPostCode;
        }
        if (this.parentMode === 'FixedPriceJob') {
            returnObj['JobInvoiceAddressLine4'] = ipTown;
            returnObj['JobInvoiceAddressLine5'] = ipState;
            returnObj['JobInvoicePostcode'] = ipPostCode;
        }
        if (this.parentMode === 'FixedPricePremiseJob') {
            returnObj['JobPremiseAddressLine4'] = ipTown;
            returnObj['JobPremiseAddressLine5'] = ipState;
            returnObj['JobPremisePostcode'] = ipPostCode;
        }
        if (this.parentMode === 'Account') {
            returnObj['AccountAddressLine4'] = ipTown;
            returnObj['AccountAddressLine5'] = ipState;
            returnObj['AccountPostcode'] = ipPostCode;
        }
        if (this.parentMode === 'Contract') {
            returnObj['ContractAddressLine4'] = ipTown;
            returnObj['ContractAddressLine5'] = ipState;
            returnObj['ContractPostcode'] = ipPostCode;
        }
        if (this.parentMode === 'Invoice') {
            returnObj['InvoiceAddressLine4'] = ipTown;
            returnObj['InvoiceAddressLine5'] = ipState;
            returnObj['InvoicePostcode'] = ipPostCode;
        }
        if (this.parentMode === 'Statement') {
            returnObj['StatementAddressLine4'] = ipTown;
            returnObj['StatementAddressLine5'] = ipState;
            returnObj['StatementPostcode'] = ipPostCode;
        }
        if (this.parentMode === 'Search') {
            returnObj['Town'] = ipTown;
            returnObj['State'] = ipState;
            returnObj['Postcode'] = ipPostCode;
        }
        if (this.parentMode === 'ContactCentreNewContact') {
            returnObj['CallAddressLine4'] = ipTown;
            returnObj['CallAddressLine5'] = ipState;
            returnObj['CallContactPostcode'] = ipPostCode;
        }
        this.emitSelectedData(returnObj);
    }
}
