import { URLSearchParams } from '@angular/http';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Logger } from '@nsalaun/ng2-logger';

import { Utils } from './../../../../shared/services/utility';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { TableComponent } from './../../../../shared/components/table/table';

@Component({
    templateUrl: 'iCABSBCampaignSearch.html'
})
export class CampaignSearchComponent implements OnInit {
    @ViewChild('resultTable') resultTable: TableComponent;

    public selectedrowdata: any;
    public method: string = 'ccm/search';
    public module: string = 'campaign';
    public operation: string = 'Business/iCABSBCampaignSearch';
    public search: URLSearchParams = new URLSearchParams();
    public inputParams: any;
    public tableheader = 'Campaign Search';

    constructor(
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private utils: Utils,
        private logger: Logger,
        private localeTranslateService: LocaleTranslationService) {
    }

    itemsPerPage: number = 10;
    page: number = 1;
    totalItem: number = 11;

    public columns: Array<any> = [
        { title: 'Code', name: 'CampaignID', sort: 'asc' },
        { title: 'Description', name: 'CampaignDesc' },
        { title: 'Type', name: 'CampaignTypeCode' },
        { title: 'Effective From', name: 'EffectiveFromDate' }
    ];
    public rowmetadata: Array<any> = [];

    public selectedData(event: any): void {
        let returnObj: any;
        this.logger.warn(event.row);
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'CampaignID': event.row.CampaignID,
                'CampaignDesc': event.row.CampaignDesc
            };
        } else {
            returnObj = {
                'CampaignID': event.row.CampaignID
            };
        }
        this.logger.warn(returnObj);
        this.ellipsis.sendDataToParent(returnObj);
    }

    getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
    }

   public updateView(params: any): void {
        this.inputParams = params;
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set('pageSize', '10');
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        this.inputParams.search = this.search;

        this.resultTable.loadTableData(this.inputParams);
    }
    public refresh(): void {
        this.updateView(this.inputParams);
    }
}
