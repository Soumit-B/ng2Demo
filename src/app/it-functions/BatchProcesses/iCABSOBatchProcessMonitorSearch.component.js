import { ErrorService } from './../../../shared/services/error.service';
import { FormBuilder } from '@angular/forms';
import { Utils } from './../../../shared/services/utility';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild } from '@angular/core';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
export var BatchProcessMonitorComponent = (function () {
    function BatchProcessMonitorComponent(serviceConstants, httpService, utils, formBuilder, translate, logger, errorService, localeTranslateService) {
        this.serviceConstants = serviceConstants;
        this.httpService = httpService;
        this.utils = utils;
        this.formBuilder = formBuilder;
        this.translate = translate;
        this.logger = logger;
        this.errorService = errorService;
        this.localeTranslateService = localeTranslateService;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.promptTitle = '';
        this.promptContent = '';
        this.page = '1';
        this.itemsPerPage = '10';
        this.tableheading = 'Batch Process Monitor Search';
        this.columns = [
            { title: 'Unique Number', name: 'BatchProcessUniqueNumber' },
            { title: 'User Code', name: 'BatchProcessUserCode' },
            { title: 'Submitted Date', name: 'BatchProcessSubmittedDate' },
            { title: 'Submitted Time', name: 'BatchProcessSubmittedTime' },
            { title: 'Description', name: 'BatchProcessDescription' }
        ];
        this.queryParams = {
            operation: 'Operations/iCABSOBatchProcessMonitorSearch',
            module: 'batch-process',
            method: 'it-functions/ri-model'
        };
        this.search = new URLSearchParams();
    }
    BatchProcessMonitorComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.localeTranslateService.setUpTranslation();
        this.businessCode = this.utils.getBusinessCode();
        this.countryCode = this.utils.getCountryCode();
        this.uiForm = this.formBuilder.group({
            BatchProcessUserCode: [{ value: '', disabled: false }],
            BatchProcessTypeCode: [{ value: '2', disabled: false }]
        });
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
                if (_this.translateSubscription) {
                    _this.translateSubscription.unsubscribe();
                }
            }
        });
        this.buildTable();
    };
    BatchProcessMonitorComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue(this.tableheading, null).subscribe(function (res) {
            if (res) {
                _this.tableheading = res;
            }
        });
    };
    BatchProcessMonitorComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    BatchProcessMonitorComponent.prototype.buildTable = function () {
        this.localeTranslateService.setUpTranslation();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.countryCode);
        if (this.uiForm.controls['BatchProcessUserCode'].value)
            this.search.set('BatchProcessUserCode', this.uiForm.controls['BatchProcessUserCode'].value);
        else {
            this.search.set('BatchProcessUserCode', '');
        }
        this.search.set('BatchProcessTypeCode', this.uiForm.controls['BatchProcessTypeCode'].value);
        this.queryParams.search = this.search;
        this.batchProcessMonitorTable.loadTableData(this.queryParams);
    };
    BatchProcessMonitorComponent.prototype.onSelect = function (event) {
    };
    BatchProcessMonitorComponent.prototype.tableDataLoaded = function (data) {
        if (data.tableData['records']) {
            var tableRecords = data.tableData['records'];
            if (tableRecords.length === 0) {
                this.tableheading = MessageConstant.Message.noRecordFound;
            }
        }
        else if (data.tableData['error']) {
            this.messageModal.show({ msg: data.tableData['error'], title: 'Message' }, false);
        }
    };
    BatchProcessMonitorComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    BatchProcessMonitorComponent.prototype.refresh = function () {
        this.buildTable();
    };
    BatchProcessMonitorComponent.prototype.promptSave = function (event) {
        this.logger.log(event);
    };
    BatchProcessMonitorComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSOBatchProcessMonitorSearch.html'
                },] },
    ];
    BatchProcessMonitorComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: Utils, },
        { type: FormBuilder, },
        { type: TranslateService, },
        { type: Logger, },
        { type: ErrorService, },
        { type: LocaleTranslationService, },
    ];
    BatchProcessMonitorComponent.propDecorators = {
        'batchProcessMonitorTable': [{ type: ViewChild, args: ['batchProcessMonitorTable',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return BatchProcessMonitorComponent;
}());
