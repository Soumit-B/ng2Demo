import { URLSearchParams } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { Utils } from './../../../../shared/services/utility';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
export var CampaignSearchComponent = (function () {
    function CampaignSearchComponent(serviceConstants, ellipsis, utils, logger, localeTranslateService) {
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this.utils = utils;
        this.logger = logger;
        this.localeTranslateService = localeTranslateService;
        this.method = 'ccm/search';
        this.module = 'campaign';
        this.operation = 'Business/iCABSBCampaignSearch';
        this.search = new URLSearchParams();
        this.tableheader = 'Campaign Search';
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 11;
        this.columns = [
            { title: 'Code', name: 'CampaignID', sort: 'asc' },
            { title: 'Description', name: 'CampaignDesc' },
            { title: 'Type', name: 'CampaignTypeCode' },
            { title: 'Effective From', name: 'EffectiveFromDate' }
        ];
        this.rowmetadata = [];
    }
    CampaignSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        this.logger.warn(event.row);
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'CampaignID': event.row.CampaignID,
                'CampaignDesc': event.row.CampaignDesc
            };
        }
        else {
            returnObj = {
                'CampaignID': event.row.CampaignID
            };
        }
        this.logger.warn(returnObj);
        this.ellipsis.sendDataToParent(returnObj);
    };
    CampaignSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    CampaignSearchComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
    };
    CampaignSearchComponent.prototype.updateView = function (params) {
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
    };
    CampaignSearchComponent.prototype.refresh = function () {
        this.updateView(this.inputParams);
    };
    CampaignSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBCampaignSearch.html'
                },] },
    ];
    CampaignSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: Utils, },
        { type: Logger, },
        { type: LocaleTranslationService, },
    ];
    CampaignSearchComponent.propDecorators = {
        'resultTable': [{ type: ViewChild, args: ['resultTable',] },],
    };
    return CampaignSearchComponent;
}());
