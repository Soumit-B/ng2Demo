import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Utils } from './../../../shared/services/utility';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ComponentInteractionService } from './../../../shared/services/component-interaction.service';
import { Title } from '@angular/platform-browser';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { MessageService } from './../../../shared/services/message.service';
import { ErrorService } from './../../../shared/services/error.service';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, NgZone } from '@angular/core';
export var AUPostcodeSearchComponent = (function () {
    function AUPostcodeSearchComponent(serviceConstants, ajaxconstant, errorService, messageService, titleService, zone, util, componentInteractionService, translateService, ellipsis) {
        var _this = this;
        this.serviceConstants = serviceConstants;
        this.ajaxconstant = ajaxconstant;
        this.errorService = errorService;
        this.messageService = messageService;
        this.titleService = titleService;
        this.zone = zone;
        this.util = util;
        this.componentInteractionService = componentInteractionService;
        this.translateService = translateService;
        this.ellipsis = ellipsis;
        this.queryParams = {
            operation: 'Application/iCABSAAUPostcodeSearch',
            module: 'validation',
            method: 'contract-management/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.query = new URLSearchParams();
        this.inputParams = {
            Town: '',
            State: '',
            Postcode: ''
        };
        this.itemsPerPage = 10;
        this.pageCurrent = 1;
        this.currentPage = 1;
        this.page = 1;
        this.totalItems = 10;
        this.maxColumn = 3;
        this.headerProperties = [];
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.showStatus = true;
        this.showErrorHeader = true;
        this.componentInteractionService.emitMessage(false);
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data['errorMessage']) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
    }
    AUPostcodeSearchComponent.prototype.ngOnInit = function () {
        this.translateService.setUpTranslation();
    };
    AUPostcodeSearchComponent.prototype.ngOnDestroy = function () {
        this.errorSubscription.unsubscribe();
        this.ajaxSubscription.unsubscribe();
        this.titleService.setTitle('');
    };
    AUPostcodeSearchComponent.prototype.getGridInfo = function (info) {
        this.totalItems = info.totalRows;
        this.postCodeGridPagination.totalItems = this.totalItems;
    };
    AUPostcodeSearchComponent.prototype.getRefreshData = function () {
        this.page = 1;
        this.loadGridData();
    };
    AUPostcodeSearchComponent.prototype.updateView = function (params) {
        if (params) {
            this.inputParams.Town = params.Town;
            this.inputParams.State = params.State;
            this.inputParams.Postcode = params.Postcode;
            this.postCodeGrid.clearGridData();
            if (this.inputParams.Town || this.inputParams.State || this.inputParams.Postcode) {
                this.loadGridData();
            }
        }
    };
    AUPostcodeSearchComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.loadGridData();
    };
    AUPostcodeSearchComponent.prototype.setGridHeaders = function () {
        this.headerProperties = [
            {
                'text-align': 'center',
                'width': '10%',
                'index': 0
            },
            {
                'text-align': 'center',
                'width': '10%',
                'index': 1
            },
            {
                'text-align': 'center',
                'width': '10%',
                'index': 2
            }
        ];
    };
    AUPostcodeSearchComponent.prototype.loadGridData = function () {
        this.setGridHeaders();
        this.query = new URLSearchParams();
        this.query.set(this.serviceConstants.BusinessCode, this.util.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.util.getCountryCode());
        this.query.set(this.serviceConstants.Action, '2');
        this.query.set('riGridMode', '0');
        this.query.set('riGridHandle', this.util.randomSixDigitString());
        this.query.set('riCacheRefresh', 'True');
        this.query.set('HeaderClickedColumn', '');
        this.query.set('riSortOrder', 'Descending');
        this.query.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        this.query.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.query.set('Town', this.inputParams.Town);
        this.query.set('State', this.inputParams.State);
        this.query.set('Postcode', this.inputParams.Postcode);
        this.queryParams.search = this.query;
        this.postCodeGrid.headerProperties = [
            {
                'align': 'center',
                'width': '120px',
                'index': 0
            }
        ];
        this.postCodeGrid.loadGridData(this.queryParams);
    };
    AUPostcodeSearchComponent.prototype.getSelectedRowInfo = function (event) {
        if (event.trRowData) {
            this.ellipsis.sendDataToParent(event.trRowData);
        }
    };
    AUPostcodeSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAAUPostcodeSearch.html',
                    providers: [ErrorService, MessageService],
                    styles: ["\n        :host /deep/ .gridtable>tbody>tr>td input.form-control{\n            text-align: left;\n        }\n    "]
                },] },
    ];
    AUPostcodeSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: AjaxObservableConstant, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: Title, },
        { type: NgZone, },
        { type: Utils, },
        { type: ComponentInteractionService, },
        { type: LocaleTranslationService, },
        { type: EllipsisComponent, },
    ];
    AUPostcodeSearchComponent.propDecorators = {
        'postCodeGrid': [{ type: ViewChild, args: ['postCodeGrid',] },],
        'postCodeGridPagination': [{ type: ViewChild, args: ['postCodeGridPagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return AUPostcodeSearchComponent;
}());
