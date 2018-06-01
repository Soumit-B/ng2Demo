import { StaticUtils } from './../../services/static.utility';
import { MntConst } from './../../services/riMaintenancehelper';
import { LocaleTranslationService } from './../../services/translation.service';
import { Utils } from './../../services/utility';
import { Component, Input, Output, ViewChild, EventEmitter, NgZone, ElementRef } from '@angular/core';
import { HttpService } from './../../services/http-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { GlobalConstant } from '../../constants/global.constant';
import { ErrorConstant } from '../../constants/error.constant';
import { ServiceConstants } from '../../constants/service.constants';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorService } from './../../services/error.service';
import { Logger } from '@nsalaun/ng2-logger';
import { RiExchange } from '../../../shared/services/riExchange';
export var TableComponent = (function () {
    function TableComponent(searchService, _global, ajaxconstant, serviceConstant, zone, translate, authService, _logger, errorService, riExchange, utils, localeTranslateService, elem) {
        this.searchService = searchService;
        this._global = _global;
        this.ajaxconstant = ajaxconstant;
        this.serviceConstant = serviceConstant;
        this.zone = zone;
        this.translate = translate;
        this.authService = authService;
        this._logger = _logger;
        this.errorService = errorService;
        this.riExchange = riExchange;
        this.utils = utils;
        this.localeTranslateService = localeTranslateService;
        this.elem = elem;
        this.columns = [];
        this.tabbable = true;
        this.pagination = true;
        this.selectedData = new EventEmitter();
        this.onRefresh = new EventEmitter();
        this.dataLoaded = new EventEmitter();
        this.doTranslate = false;
        this.isRequesting = false;
        this.selectedRow = -1;
        this.ajaxSource = new BehaviorSubject(0);
        this.pageAction = 0;
        this.rowId = '';
        this.pageData = {};
        this.prevCB = {
            country: '',
            business: ''
        };
        this._config = this._global.AppConstants().paginationConfig;
        this.defaultStartPage = this._config.defaultStartPage;
        this.currentPage = this.currentPage || this._config.defaultStartPage;
        this.originalData = {};
        this.commonCellWidth = 10;
        this.tableColumns = [];
        this.totalConfiguredCellWidth = 0;
        this.config = {
            paging: this.pagination || true,
            columns: this.columns || [],
            className: ['table-bordered']
        };
    }
    TableComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.localeTranslateService.setUpTranslation();
        this.rowmetadata = this.rowmetadata || [];
        this.rows = this.rows || [];
        this.columns = this.columns || [];
        this.tabledata = this.tabledata || [];
        this.page = this.page || 1;
        this.itemsPerPage = this.itemsPerPage || this._global.AppConstants().tableConfig.itemsPerPage;
        if (this.displayError === null || this.displayError === undefined) {
            this.displayError = true;
        }
        if (this.displayError === null || this.displayError === undefined) {
            this.paginationTop = true;
        }
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
    };
    TableComponent.prototype.ngOnDestroy = function () {
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        this.tabledata = null;
        this.rows = null;
    };
    TableComponent.prototype.ngOnChanges = function (change) {
        if (this.rows) {
            this.totalPage = Math.ceil(this.rows.length / this.itemsPerPage);
        }
        if (change.resetRowId && change.resetRowId.currentValue === true) {
            this.rowId = '';
        }
    };
    TableComponent.prototype.loadTableData = function (params, same) {
        var _this = this;
        if (!same) {
            this.rowId = '';
            this.pageData = {};
        }
        this.inputParams = params;
        var isAllSearch = false;
        if (params.columns) {
            this.config.columns = [];
            this.config.columns = params.columns;
        }
        this.columns = this.tableColumns.length ? this.tableColumns : this.columns;
        if (params.rowmetadata) {
            this.rowmetadata = params.rowmetadata;
        }
        var userCode = this.authService.getSavedUserCode();
        if (params) {
            if (!params['pageSize'] || params['pageSize'] === '') {
                params.search.set('pageSize', this._global.AppConstants().tableConfig.itemsPerPage);
            }
        }
        var postData = {};
        if (params.search.get(this.serviceConstant.CountryCode).toUpperCase() === GlobalConstant.Configuration.All.toUpperCase() || params.search.get(this.serviceConstant.BusinessCode).toUpperCase() === GlobalConstant.Configuration.All.toUpperCase()) {
            isAllSearch = true;
            if ((params.search.get(this.serviceConstant.CountryCode) === this.prevCB['country']) && (params.search.get(this.serviceConstant.BusinessCode) === this.prevCB['business'])) {
                if (this.pageData && !(Object.keys(this.pageData).length === 0 && this.pageData.constructor === Object)) {
                    postData = {
                        pageData: this.pageData
                    };
                }
                else {
                    postData = {};
                    this.pageData = {};
                }
            }
            else {
                postData = {};
                this.pageData = {};
            }
        }
        else {
            isAllSearch = false;
            if (this.rowId) {
                if ((params.search.get(this.serviceConstant.CountryCode) === this.prevCB['country']) && (params.search.get(this.serviceConstant.BusinessCode) === this.prevCB['business'])) {
                    params.search.set('rowid', this.rowId);
                }
                else {
                    this.rowId = '';
                    params.search.set('rowid', '');
                }
            }
            else {
                this.rowId = '';
                params.search.set('rowid', '');
            }
        }
        params.search.set('action', this.pageAction);
        this.ajaxSource.next(this.ajaxconstant.START);
        if (isAllSearch === true) {
            this.searchService.makePostJsonRequest(params.method, params.module, params.operation, params.search, postData, 'application/json')
                .subscribe(function (data) {
                _this.processServiceResponse(data, params, isAllSearch);
            }, function (error) {
                _this.processServiceError(error, params);
            });
        }
        else {
            this.searchService.makeGetRequest(params.method, params.module, params.operation, params.search)
                .subscribe(function (data) {
                _this.processServiceResponse(data, params, isAllSearch);
            }, function (error) {
                _this.processServiceError(error, params);
            });
        }
    };
    TableComponent.prototype.clearTable = function () {
        this.tableColumns = [];
        this.tabledata = [];
        this.rows = [];
    };
    TableComponent.prototype.refresh = function () {
        if (!this.columns.length || !this.inputParams) {
            return;
        }
        this.pageAction = 2;
        this.loadTableData(this.inputParams, true);
    };
    TableComponent.prototype.getAlignmentClass = function (column) {
        var alignmentClass = '';
        switch (column.alignment) {
            case MntConst.eAlignmentRight:
                alignmentClass = 'text-right';
                break;
            case MntConst.eAlignmentLeft:
                alignmentClass = 'text-left';
                break;
        }
        return alignmentClass;
    };
    TableComponent.prototype.AddTableField = function (name, type, required, title, size, alignment) {
        if (!size) {
            size = 10;
        }
        this.totalConfiguredCellWidth += size;
        this.tableColumns.push({
            name: name,
            type: type || MntConst.eTypeText,
            title: title || name,
            alignment: alignment || MntConst.eAlignmentCenter,
            size: size
        });
    };
    TableComponent.prototype.AddTableFields = function (columns) {
        var _this = this;
        columns.forEach(function (column) {
            _this.AddTableField(column[0], column[1] || '', column[2] || '', column[3] || '', column[4] ? parseFloat(column[4]) : 0, column[5] || '');
        });
    };
    TableComponent.prototype.getCellWidth = function (size) {
        return (size / this.totalConfiguredCellWidth) * 100;
    };
    TableComponent.prototype.formatData = function (row, column) {
        var formattedData = '', rawData = '', type = column.type, method;
        rawData = row[column.name];
        if (rawData === undefined || rawData === '') {
            return rawData;
        }
        if (!type) {
            return rawData;
        }
        method = type.replace('eType', 'to');
        if (StaticUtils.ConversionHelper[method]) {
            formattedData = StaticUtils.ConversionHelper[method](rawData);
            return rawData;
        }
        switch (type) {
            case MntConst.eTypeCheckBox:
                formattedData = this.getCheckboxHTML(rawData);
                break;
            case MntConst.eTypeImage:
                formattedData = this.getImageHTML(rawData);
                break;
        }
        return formattedData || rawData;
    };
    TableComponent.prototype.firstPage = function ($event) {
        if ($event && $event.preventDefault) {
            $event.preventDefault();
        }
        this.page = 1;
        this.pageAction = 0;
        this.loadTableData(this.inputParams, true);
        this.resetAction();
    };
    TableComponent.prototype.prevPage = function ($event) {
        if ($event && $event.preventDefault) {
            $event.preventDefault();
        }
        this.page -= 1;
        this.pageAction = 1;
        this.loadTableData(this.inputParams, true);
        this.resetAction();
    };
    TableComponent.prototype.nextPage = function ($event) {
        if ($event && $event.preventDefault) {
            $event.preventDefault();
        }
        this.page += 1;
        this.pageAction = 3;
        this.loadTableData(this.inputParams, true);
        this.resetAction();
    };
    TableComponent.prototype.lastPage = function ($event) {
        if ($event && $event.preventDefault) {
            $event.preventDefault();
        }
        this.page = this.totalPage;
        this.pageAction = 4;
        this.loadTableData(this.inputParams, true);
        this.resetAction();
    };
    TableComponent.prototype.changePage = function (data) {
        if (data === void 0) { data = this.tabledata; }
        this.page = this.page || 1;
        if (this.page > this.totalPage) {
            this.page = 1;
        }
        if (this.rowmetadata) {
            this.selectImg(data);
        }
        this.rows = data;
    };
    TableComponent.prototype.processServiceResponse = function (data, params, isAllSearch) {
        var _this = this;
        if (data.records) {
            if (this.dataLoaded) {
                this.dataLoaded.emit({
                    value: 'loaded',
                    tableData: data
                });
            }
            this.originalData = data;
            this.tabledata = data.records;
            var rows = [], rowObj = {};
            for (var i = 0; i < this.tabledata.length; i++) {
                for (var key in this.tabledata[i]) {
                    if (key) {
                        var splitKey = key.split('.');
                        rowObj[splitKey[splitKey.length - 1]] = this.tabledata[i][key];
                    }
                }
                rows.push(JSON.parse(JSON.stringify(rowObj)));
                rowObj = {};
            }
            if (isAllSearch === true) {
                if (data['pageData'].length > 0) {
                    data['pageData'].forEach(function (v) {
                        v['rowId'] = v['rowid'];
                        delete v.rowid;
                        delete v.numResults;
                    });
                    this.pageData = this.toCamelCase(data['pageData']);
                }
                else {
                    this.pageData = data['pageData'];
                }
            }
            else {
                if (data['pageData']) {
                    if (data['pageData'] instanceof Array) {
                        this.rowId = data['pageData'][0].rowid ? data['pageData'][0].rowid : '';
                    }
                    else if (data['pageData'].rowid) {
                        this.rowId = data['pageData'].rowid;
                    }
                }
            }
            this.prevCB['country'] = params.search.get(this.serviceConstant.CountryCode);
            this.prevCB['business'] = params.search.get(this.serviceConstant.BusinessCode);
            this.tabledata = rows;
            this.length = this.tabledata.length;
            if (this.tabledata && this.tabledata.length > 0) {
                this.rows = data.records;
                for (var i = 0; i < this.tabledata.length; i++) {
                    if (this.tabledata[i]['APIRateEffectDate'] !== undefined && this.tabledata[i]['APIRateEffectDate'] !== null) {
                        if (this.isDate(this.tabledata[i]['APIRateEffectDate'])) {
                            this.tabledata[i]['APIRateEffectDate'] = this.formatDate(this.tabledata[i]['APIRateEffectDate']);
                        }
                    }
                    if (this.tabledata[i]['ContractCommenceDate'] !== undefined && this.tabledata[i]['ContractCommenceDate'] !== null) {
                        if (this.isDate(this.tabledata[i]['ContractCommenceDate'])) {
                            this.tabledata[i]['ContractCommenceDate'] = this.formatDate(this.tabledata[i]['ContractCommenceDate']);
                        }
                    }
                    if (this.tabledata[i]['DetailCommenceDate'] !== undefined && this.tabledata[i]['DetailCommenceDate'] !== null) {
                        if (this.isDate(this.tabledata[i]['DetailCommenceDate'])) {
                            this.tabledata[i]['DetailCommenceDate'] = this.formatDate(this.tabledata[i]['DetailCommenceDate']);
                        }
                    }
                    if (this.tabledata[i]['GroupAgreementDate'] !== undefined && this.tabledata[i]['GroupAgreementDate'] !== null) {
                        if (this.isDate(this.tabledata[i]['GroupAgreementDate'])) {
                            this.tabledata[i]['GroupAgreementDate'] = this.formatDate(this.tabledata[i]['GroupAgreementDate']);
                        }
                    }
                    if (this.tabledata[i]['InvoiceAnnivDate'] !== undefined && this.tabledata[i]['InvoiceAnnivDate'] !== null) {
                        if (this.isDate(this.tabledata[i]['InvoiceAnnivDate'])) {
                            this.tabledata[i]['InvoiceAnnivDate'] = this.formatDate(this.tabledata[i]['InvoiceAnnivDate']);
                        }
                    }
                    if (this.tabledata[i]['ContractExpiryDate'] !== undefined && this.tabledata[i]['ContractExpiryDate'] !== null) {
                        if (this.isDate(this.tabledata[i]['ContractExpiryDate'])) {
                            this.tabledata[i]['ContractExpiryDate'] = this.formatDate(this.tabledata[i]['ContractExpiryDate']);
                        }
                    }
                    if (this.tabledata[i]['BatchProcessSubmittedDate'] !== undefined && this.tabledata[i]['BatchProcessSubmittedDate'] !== null) {
                        if (this.isDate(this.tabledata[i]['BatchProcessSubmittedDate'])) {
                            this.tabledata[i]['BatchProcessSubmittedDate'] = this.formatDate(this.tabledata[i]['BatchProcessSubmittedDate']);
                        }
                    }
                    if (this.tabledata[i]['riBPSNextDate'] !== undefined && this.tabledata[i]['riBPSNextDate'] !== null) {
                        if (this.isDate(this.tabledata[i]['riBPSNextDate'])) {
                            this.tabledata[i]['riBPSNextDate'] = this.formatDate(this.tabledata[i]['riBPSNextDate']);
                        }
                    }
                    if (this.tabledata[i]['BatchProcessSubmittedTime'] !== undefined && this.tabledata[i]['BatchProcessSubmittedTime'] !== null) {
                        if (this.isDate(this.tabledata[i]['BatchProcessSubmittedTime'])) {
                            this.tabledata[i]['BatchProcessSubmittedTime'] = this.utils.secondsToHms(this.tabledata[i]['BatchProcessSubmittedTime']);
                        }
                    }
                    if (this.tabledata[i]['riBPSNextTime'] !== undefined && this.tabledata[i]['riBPSNextTime'] !== null) {
                        if (this.isDate(this.tabledata[i]['riBPSNextDateTime'])) {
                            this.tabledata[i]['riBPSNextTime'] = this.utils.secondsToHms(this.tabledata[i]['riBPSNextTime']);
                        }
                    }
                }
                this.totalPage = Math.ceil(this.length / this.itemsPerPage);
                this.onChangeTable(this.config);
                this.selectImg(this.tabledata);
                this.changePage();
            }
            else {
                this.rows = [];
                this.totalPage = 0;
                this.page = 1;
                setTimeout(function () {
                    _this.length = 1;
                }, 200);
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        }
        else {
            this.processServiceError(data, params);
        }
    };
    TableComponent.prototype.toCamelCase = function (param) {
        var newO, origKey, newKey, value;
        if (param instanceof Array) {
            newO = [];
            for (origKey in param) {
                if (param.hasOwnProperty(origKey)) {
                    value = param[origKey];
                    if (typeof value === 'object') {
                        value = this.toCamelCase(value);
                    }
                    newO.push(value);
                }
            }
        }
        else {
            newO = {};
            for (origKey in param) {
                if (param.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
                    value = param[origKey];
                    if (value !== null && value.constructor === Object) {
                        value = this.toCamelCase(value);
                    }
                    newO[newKey] = value;
                }
            }
        }
        return newO;
    };
    TableComponent.prototype.processServiceError = function (data, params) {
        this.dataLoaded.emit({
            value: 'failed',
            tableData: data
        });
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (this.displayError) {
            this.errorService.emitError({
                errorMessage: ErrorConstant.Message.TableFetchError + ' Method - ' + params.method + ' Module - ' + params.module + ' Operation - ' + params.operation
            });
        }
    };
    TableComponent.prototype.selectImg = function (data) {
        if (data === void 0) { data = this.tabledata; }
        for (var key in data) {
            if (!data.hasOwnProperty(key))
                continue;
            var obj = data[key];
            for (var prop in obj) {
                if (!obj.hasOwnProperty(prop))
                    continue;
                if (prop) {
                    obj[prop] = this.selectmetaprop(prop, obj[prop]);
                }
            }
        }
    };
    TableComponent.prototype.selectmetaprop = function (prop, propvalue) {
        if (propvalue !== null && propvalue !== 'undefined') {
            for (var i = 0; i < this.rowmetadata.length; i++) {
                if (prop === this.rowmetadata[i].name) {
                    if (this.rowmetadata[i].type === 'img') {
                        var columncontent = ((propvalue.toString().toUpperCase() === 'TRUE') ||
                            (propvalue.toString().toUpperCase().indexOf('/assets/images/tick-icon.png'.toUpperCase()) !== -1)) ?
                            '<div class="text-center"><img src="/assets/images/tick-icon.png" class="tick"></div>' : '<div class="text-center"><img src="/assets/images/cross-icon.png" class="cross-tick"></div>';
                        return columncontent;
                    }
                }
            }
        }
        return propvalue;
    };
    TableComponent.prototype.onChangeTable = function (config, page) {
        if (page === void 0) { page = { page: this.page, itemsPerPage: this.itemsPerPage }; }
        if (config.columns && config.columns.length > 0) {
            this.columns = config.columns.length ? config.columns : this.columns;
        }
        this.rows = this.tabledata;
        if (this.pageAction === 0) {
            this.page = 1;
            this.length = (this.page * this.itemsPerPage) + (this.itemsPerPage * 2);
        }
        else if (this.pageAction === 1 || this.pageAction === 3) {
            this.length = (this.page * this.itemsPerPage) + (this.itemsPerPage * 2);
        }
        if (this.pageAction === 4) {
            this.length = (this.page * this.itemsPerPage);
        }
    };
    TableComponent.prototype.focusRow = function (index) {
        if (index < 0 || index >= this.itemsPerPage) {
            return;
        }
        this.selectedRow = index;
        var clickedElem = this.elem.nativeElement.querySelector('table tbody tr:nth-child(' + (index + 1) + ')');
        clickedElem.focus();
    };
    TableComponent.prototype.formatDate = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    };
    TableComponent.prototype.isDate = function (date) {
        return ((new Date(date).toString() !== 'Invalid Date'));
    };
    TableComponent.prototype.getCheckboxHTML = function (value) {
        var checkedHTML = '<div class="text-center"><img src="/assets/images/tick-icon.png" class="tick"></div>';
        return value ? checkedHTML : '<div class="text-center"><img src="/assets/images/cross-icon.png" class="cross-tick"></div>';
    };
    TableComponent.prototype.getImageHTML = function (value) {
        return '<div class="text-center"><img src="' + StaticUtils.c_s_IMAGE_REPO_URL + value + '" title="' + value + '"></div>';
    };
    TableComponent.prototype.onCellClick = function (index, $event) {
        var data = {};
        var clickedElem;
        if ($event) {
            $event.preventDefault();
        }
        this.focusRow(index);
        data['row'] = this.rows[index];
        this.selectedRow = -1;
        this.selectedData.emit(data);
    };
    TableComponent.prototype.onKeyUp = function (index, $event) {
        switch ($event.keyCode) {
            case 9:
                this.focusRow(index);
                break;
            case 40:
                this.focusRow(index + 1);
                break;
            case 38:
                this.focusRow(index - 1);
                break;
            case 13:
                this.onCellClick(index);
                break;
        }
    };
    TableComponent.prototype.onPageChange = function (event) {
        var _this = this;
        if (event.page > this.page) {
            if (event.page - this.page === 1) {
                this.pageAction = 3;
            }
            else {
                this.pageAction = 4;
            }
        }
        else if (event.page < this.page) {
            if (this.page - event.page === 1) {
                this.pageAction = 1;
                setTimeout(function () {
                    _this.page = event.page + 1;
                    _this.onRefresh.emit();
                }, 0);
                return;
            }
            else {
                this.pageAction = 0;
            }
        }
        else {
            this.pageAction = 2;
        }
        this.onRefresh.emit();
    };
    TableComponent.prototype.resetAction = function () {
        var _this = this;
        setTimeout(function () {
            _this.pageAction = 2;
        }, 100);
    };
    TableComponent.prototype.doTranslation = function () {
        if (this.columns) {
            var _loop_1 = function(column) {
                if (column) {
                    var obj_1 = this_1.columns[column];
                    this_1.getTranslatedValue(obj_1.title, null).then(function (res) {
                        if (res) {
                            obj_1.title = res;
                        }
                    });
                }
            };
            var this_1 = this;
            for (var column in this.columns) {
                _loop_1(column);
            }
        }
        if (this.config.columns) {
            var _loop_2 = function(column) {
                if (column) {
                    var obj_2 = this_2.config.columns[column];
                    this_2.getTranslatedValue(obj_2.title, null).then(function (res) {
                        if (res) {
                            obj_2.title = res;
                        }
                    });
                }
            };
            var this_2 = this;
            for (var column in this.config.columns) {
                _loop_2(column);
            }
        }
    };
    TableComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params }).toPromise();
        }
        else {
            return this.translate.get(key).toPromise();
        }
    };
    TableComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-table',
                    templateUrl: 'table.html',
                    providers: [ErrorService]
                },] },
    ];
    TableComponent.ctorParameters = [
        { type: HttpService, },
        { type: GlobalConstant, },
        { type: AjaxObservableConstant, },
        { type: ServiceConstants, },
        { type: NgZone, },
        { type: TranslateService, },
        { type: AuthService, },
        { type: Logger, },
        { type: ErrorService, },
        { type: RiExchange, },
        { type: Utils, },
        { type: LocaleTranslationService, },
        { type: ElementRef, },
    ];
    TableComponent.propDecorators = {
        'tabledata': [{ type: Input },],
        'columns': [{ type: Input },],
        'rowmetadata': [{ type: Input },],
        'itemsPerPage': [{ type: Input },],
        'rows': [{ type: Input },],
        'page': [{ type: Input },],
        'totalPage': [{ type: Input },],
        'displayError': [{ type: Input },],
        'tableheader': [{ type: Input },],
        'resetRowId': [{ type: Input },],
        'tabbable': [{ type: Input },],
        'pagination': [{ type: Input },],
        'selectedData': [{ type: Output },],
        'onRefresh': [{ type: Output },],
        'dataLoaded': [{ type: Output },],
        'paginationStyle': [{ type: Input },],
        'paginationTop': [{ type: Input },],
        'doTranslate': [{ type: Input },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return TableComponent;
}());
