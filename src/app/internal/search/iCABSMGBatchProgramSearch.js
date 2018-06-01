import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
import { MessageService } from '../../../shared/services/message.service';
export var BatchProgramSearchComponent = (function () {
    function BatchProgramSearchComponent(serviceConstants, ellipsis, router, localeTranslateService, route, utils, translate, logger, messageService) {
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this.router = router;
        this.localeTranslateService = localeTranslateService;
        this.route = route;
        this.utils = utils;
        this.translate = translate;
        this.logger = logger;
        this.messageService = messageService;
        this.method = 'it-functions/ri-model';
        this.module = 'batch-process';
        this.operation = 'Model/riMGBatchProgramSearch';
        this.search = new URLSearchParams();
        this.itemsPerPage = 16;
        this.page = 1;
        this.totalItem = 11;
        this.columns = [
            { title: 'Program Name', name: 'riBatchProgramName', sort: 'ASC' },
            { title: 'Description', name: 'riBatchProgramDescription' }
        ];
        this.rowmetadata = new Array();
        this.isAddNewVisible = false;
        this.isAddNewDisabled = false;
    }
    BatchProgramSearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.inputParams = {
            'parentMode': 'LookUp'
        };
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
        this.updateView();
    };
    BatchProgramSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    BatchProgramSearchComponent.prototype.fetchTranslationContent = function () {
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
    BatchProgramSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'riBatchProgramName': event.row.riBatchProgramName,
                'riBatchProgramDescription': event.row.riBatchProgramDescription,
                'riBatchProgramParam1Label': event.row.riBatchProgramParam1Label,
                'riBatchProgramParam2label': event.row.riBatchProgramParam2label,
                'riBatchProgramParam3Label': event.row.riBatchProgramParam3Label,
                'riBatchProgramParam4Label': event.row.riBatchProgramParam4Label,
                'riBatchProgramParam5Label': event.row.riBatchProgramParam5Label,
                'riBatchProgramParam6Label': event.row.riBatchProgramParam6Label,
                'riBatchProgramParam7Label': event.row.riBatchProgramParam7Label,
                'riBatchProgramParam8Label': event.row.riBatchProgramParam8Label,
                'riBatchProgramParam9Label': event.row.riBatchProgramParam9Label,
                'riBatchProgramParam10Label': event.row.riBatchProgramParam10Label,
                'riBatchProgramParam11Label': event.row.riBatchProgramParam11Label,
                'riBatchProgramParam12Label': event.row.riBatchProgramParam12Label,
                'riBatchProgramReport': event.row.riBatchProgramReport,
                'recordID': event.row.RecordID
            };
        }
        else {
            returnObj = {
                'riBatchProgramName': event.row.riBatchProgramName,
                'riBatchProgramDescription': event.row.riBatchProgramDescription
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    BatchProgramSearchComponent.prototype.updateView = function () {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.batchProgramSearchTable.loadTableData(this.inputParams);
    };
    BatchProgramSearchComponent.prototype.refresh = function () {
        this.updateView();
    };
    BatchProgramSearchComponent.prototype.onAddNew = function () {
        this.messageService.emitMessage({
            updateMode: false,
            addMode: true,
            searchMode: false
        });
        this.ellipsis.closeModal();
    };
    BatchProgramSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSMGBatchProgramSearch.html'
                },] },
    ];
    BatchProgramSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: Router, },
        { type: LocaleTranslationService, },
        { type: ActivatedRoute, },
        { type: Utils, },
        { type: TranslateService, },
        { type: Logger, },
        { type: MessageService, },
    ];
    BatchProgramSearchComponent.propDecorators = {
        'batchProgramSearchTable': [{ type: ViewChild, args: ['batchProgramSearchTable',] },],
    };
    return BatchProgramSearchComponent;
}());
