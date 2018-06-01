import { RiExchange } from './../../../shared/services/riExchange';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
export var BusinessTierSearchComponent = (function () {
    function BusinessTierSearchComponent(serviceConstants, ellipsis, router, localeTranslateService, route, utils, translate, logger, riExchange) {
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this.router = router;
        this.localeTranslateService = localeTranslateService;
        this.route = route;
        this.utils = utils;
        this.translate = translate;
        this.logger = logger;
        this.riExchange = riExchange;
        this.method = 'contract-management/search';
        this.module = 'contract-admin';
        this.operation = 'Business/iCABSBTierSearch';
        this.search = new URLSearchParams();
        this.setParentAttrBusinessRuleValue = '';
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 10;
        this.columns = [
            { title: 'Code', name: 'TierCode', sort: 'ASC' },
            { title: 'Description', name: 'TierSystemDescription' }
        ];
        this.rowmetadata = new Array();
    }
    BusinessTierSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.inputParams = {
            'parentMode': 'LookUp',
            'getParentAttrBusinessRuleValue': ''
        };
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.updateView();
    };
    BusinessTierSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    BusinessTierSearchComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        var _loop_1 = function(i) {
            this_1.localeTranslateService.getTranslatedValue(this_1.columns[i].title, null).subscribe(function (res) {
                if (res) {
                    _this.columns[i].title = res;
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.columns.length; i++) {
            _loop_1(i);
        }
    };
    BusinessTierSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        var strTierList = this.inputParams.getParentAttrBusinessRuleValue;
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
    };
    BusinessTierSearchComponent.prototype.updateView = function () {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.tierSearchTable.loadTableData(this.inputParams);
    };
    BusinessTierSearchComponent.prototype.refresh = function () {
        this.updateView();
    };
    BusinessTierSearchComponent.prototype.ngOnDestroy = function () {
    };
    BusinessTierSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBTierSearchComponent.html'
                },] },
    ];
    BusinessTierSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: Router, },
        { type: LocaleTranslationService, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: TranslateService, },
        { type: Logger, },
        { type: RiExchange, },
    ];
    BusinessTierSearchComponent.propDecorators = {
        'tierSearchTable': [{ type: ViewChild, args: ['tierSearchTable',] },],
    };
    return BusinessTierSearchComponent;
}());
