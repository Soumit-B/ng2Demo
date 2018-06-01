import { RiExchange } from './../../../shared/services/riExchange';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
@Component({
    templateUrl: 'iCABSBTierSearchComponent.html'
})
export class BusinessTierSearchComponent implements OnInit, OnDestroy {
    @ViewChild('tierSearchTable') tierSearchTable: TableComponent;
    public selectedrowdata: any;
    public method: string = 'contract-management/search';
    public module: string = 'contract-admin';
    public operation: string = 'Business/iCABSBTierSearch';
    public search: URLSearchParams = new URLSearchParams();
    public setParentAttrBusinessRuleValue: any = '';
    public itemsPerPage: number = 10;
    public page: number = 1;
    public totalItem: number = 10;
    public inputParams: any;
    public columns: Array<any> = [
        { title: 'Code', name: 'TierCode', sort: 'ASC' },
        { title: 'Description', name: 'TierSystemDescription' }
    ];
    public rowmetadata: Array<any> = new Array();
    private routeParams: any;
    private sub: Subscription;
    public translateSubscription: Subscription;
    constructor(
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private router: Router,
        private localeTranslateService: LocaleTranslationService,
        private route: ActivatedRoute,
        private utils: Utils,
        private translate: TranslateService,
        private logger: Logger,
        private riExchange: RiExchange
    ) { }
    ngOnInit(): void {
        this.inputParams = {
            'parentMode': 'LookUp',
            'getParentAttrBusinessRuleValue': ''
        };
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
        this.updateView();
    }
    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }
    public fetchTranslationContent(): void {
        for (let i = 0; i < this.columns.length; i++) {
            this.localeTranslateService.getTranslatedValue(this.columns[i].title, null).subscribe((res: string) => {
                if (res) {
                    this.columns[i].title = res;
                }
            });
        }
    }
    public selectedData(event: any): void {
        let returnObj: any;
        let strTierList: any = this.inputParams.getParentAttrBusinessRuleValue;
        if (this.inputParams.parentMode === 'BusinessRuleMaintenance') {
            if (this.inputParams.getParentAttrBusinessRuleValue !== '' || this.inputParams.getParentAttrBusinessRuleValue !== undefined || this.inputParams.getParentAttrBusinessRuleValue !== null) {
                strTierList = strTierList + ',' + event.row.TierCode;
            }
            else {
                strTierList = event.row.TierCode;
            }
            returnObj = {
                'TierCode': strTierList
            };
            this.setParentAttrBusinessRuleValue = strTierList;
        }
        else if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'TierCode': event.row.TierCode,
                'TierSystemDescription': event.row.TierSystemDescription
            };
        }

        else {
            returnObj = {
                'TierCode': event.row.TierCode
            };
        }

        this.ellipsis.sendDataToParent(returnObj);
    }

    public updateView(): void {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.tierSearchTable.loadTableData(this.inputParams);
    }
    public refresh(): void {
        this.updateView();
    }
    public ngOnDestroy(): void {
        //this.riExchange.releaseReference(this);
    }
}
