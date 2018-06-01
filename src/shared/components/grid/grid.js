import { Logger } from '@nsalaun/ng2-logger';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef, Renderer } from '@angular/core';
import { HttpService } from './../../services/http-service';
import { ErrorService } from './../../services/error.service';
import { GlobalConstant } from '../../constants/global.constant';
import { ErrorConstant } from '../../constants/error.constant';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { RiExchange } from '../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { MntConst } from './../../services/riMaintenancehelper';
export var GridComponent = (function () {
    function GridComponent(httpService, el, renderer, global, ajaxconstant, zone, logger, errorService, riExchange, utils) {
        this.httpService = httpService;
        this.el = el;
        this.renderer = renderer;
        this.global = global;
        this.ajaxconstant = ajaxconstant;
        this.zone = zone;
        this.logger = logger;
        this.errorService = errorService;
        this.riExchange = riExchange;
        this.utils = utils;
        this.editableColumns = [];
        this.showPageCount = true;
        this.gridDataLoadSuccess = new EventEmitter();
        this.gridInfo = new EventEmitter();
        this.getCellData = new EventEmitter();
        this.getCellDataonBlur = new EventEmitter();
        this.getchangedCheckBox = new EventEmitter();
        this.getCellKeyDownData = new EventEmitter();
        this.selectedRowInfo = new EventEmitter();
        this.infoData = new EventEmitter();
        this.sortInfo = new EventEmitter();
        this.newIndex = 0;
        this.gridInErrorState = false;
        this.update = false;
        this.headerStructure = [];
        this.headerRows = [];
        this.headerColCounter = 0;
        this.headerRowCounter = 0;
        this.totalBodyStructure = [];
        this.bodyStructure = [];
        this.bodyRows = [];
        this.bodyColCounter = 0;
        this.bodyRowCounter = 0;
        this.gridArray = [];
        this.isRequesting = false;
        this.sort = {};
        this.ajaxSource = new BehaviorSubject(0);
        this.showErrorHeader = true;
        this.mntConst = {};
        this.rowId = '';
        this.createGridFromOnChange = false;
        this.prevData = {
            pageCurrent: 1,
            lastPageNumber: 1
        };
        this.pageAction = 0;
    }
    ;
    GridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.mntConst = MntConst;
        this.update = false;
        this.itemsPerPage = this.itemsPerPage || this.global.AppConstants().tableConfig.itemsPerPage;
        this.sortIndex = this.sortIndex || [];
        this.headerProperties = this.headerProperties || [];
        this.validateProperties = this.validateProperties || [];
        if (this.showTotalRow) {
            this.itemsPerPage = this.itemsPerPage + 1;
        }
        this.sortHeaders = this.sortHeaders || [];
        this.builtFromParent = this.builtFromParent || false;
        if (this.displayError === null || this.displayError === undefined) {
            this.displayError = true;
        }
        if (this.checkItemsPerPage === null || this.checkItemsPerPage === undefined) {
            this.checkItemsPerPage = true;
        }
        this.createGridStructure();
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                if (_this.zone) {
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
            }
        });
    };
    GridComponent.prototype.ngOnChanges = function () {
        this.createGridFromOnChange = true;
        this.createGridStructure();
        this.createGridFromOnChange = false;
    };
    GridComponent.prototype.ngOnDestroy = function () {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
    };
    GridComponent.prototype.loadGridData = function (params, rowId) {
        var _this = this;
        if (rowId) {
            this.rowId = rowId;
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(params.method, params.module, params.operation, params.search)
            .subscribe(function (data) {
            if (_this.zone) {
                _this.zone.run(function () {
                    _this.onServiceSuccess(data, rowId);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
            }
        }, function (error) {
            _this.onServiceFailure(error, params);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    GridComponent.prototype.updateGridData = function (params, rowId, postObject) {
        var _this = this;
        if (rowId) {
            this.rowId = rowId;
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(params.method, params.module, params.operation, params.search, postObject ? postObject : params.body)
            .subscribe(function (data) {
            if (_this.zone) {
                _this.zone.run(function () {
                    _this.onServiceSuccess(data);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                });
            }
        }, function (error) {
            _this.onServiceFailure(error, params);
        });
    };
    GridComponent.prototype.onServiceSuccess = function (data, rowId) {
        if (data.errorMessage || data.fullError) {
            this.tableTitle = '';
            var gridDetails = {
                'curPage': 0,
                'totalRows': 0,
                'totalPages': 0
            };
            this.errorService.emitError(data);
        }
        else {
            if (!rowId) {
                this.gridData = data;
                this.logger.log('GridData', data);
                this.createGridStructure();
            }
            else {
                this.updateRow(data);
            }
        }
    };
    GridComponent.prototype.onServiceFailure = function (error, params) {
        this.errorMessage = error;
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        var gridDetails = {
            'curPage': 0,
            'totalRows': 0,
            'totalPages': 0
        };
        if (this.displayError) {
            this.errorService.emitError({
                errorMessage: ErrorConstant.Message.GridFetchError + ' Method - ' + params.method + ' Module - ' + params.module + ' Operation - ' + params.operation
            });
        }
    };
    GridComponent.prototype.createGridStructure = function () {
        var numberOfBusiness = 1;
        this.headerStructure = [];
        this.headerRows = [];
        this.headerColumns = [];
        this.headerRowCounter = 0;
        this.bodyRowCounter = 0;
        this.bodyStructure = [];
        this.bodyColumns = [];
        this.bodyRows = [];
        this.bodyColCounter = 0;
        this.headerColCounter = 0;
        this.gridArray = [];
        if (this.displayCountryBusiness && this.gridData && this.gridData.constructor === Array) {
            var gridDataClone = JSON.parse(JSON.stringify(this.gridData));
            var parentBodyRowList = [];
            var lastPageNumberList = [];
            var currPageNumberList = [];
            numberOfBusiness = gridDataClone.length;
            for (var i = 0; i < gridDataClone.length; i++) {
                gridDataClone[i].header.cells.unshift({
                    text: 'Business',
                    colSpan: 1
                });
                gridDataClone[i].header.cells.unshift({
                    text: 'Country',
                    colSpan: 1
                });
                lastPageNumberList.push(gridDataClone[i].pageData.lastPageNumber);
                currPageNumberList.push(gridDataClone[i].pageData.pageNumber);
                if (gridDataClone[i].body.cells.length > 0) {
                    var numberOfRows = Math.ceil(gridDataClone[i].body.cells.length / (this.maxColumns - 2));
                    var bodyRowList = [];
                    for (var j = 0; j < numberOfRows; j++) {
                        var bodyRow = gridDataClone[i].body.cells.slice((j * (this.maxColumns - 2)), ((j + 1) * (this.maxColumns - 2)));
                        var cbList = [
                            {
                                text: gridDataClone[i].CountryCode,
                                drillDown: false,
                                colSpan: 1,
                                rowID: ''
                            },
                            {
                                text: gridDataClone[i].BusinessCode,
                                drillDown: false,
                                colSpan: 1,
                                rowID: ''
                            }
                        ];
                        var concat = cbList.concat(bodyRow);
                        bodyRowList.push(concat);
                    }
                    for (var k = 0; k < bodyRowList.length; k++) {
                        parentBodyRowList.push(bodyRowList[k]);
                    }
                }
            }
            parentBodyRowList = [].concat.apply([], parentBodyRowList);
            this.gridData = {
                header: {
                    cells: [],
                    title: []
                },
                body: {
                    cells: []
                },
                footer: {
                    rows: []
                },
                pageData: {
                    lastPageNumber: 0,
                    pageNumber: 0
                },
                errorMessage: ''
            };
            this.gridData['header']['cells'] = gridDataClone[0].header.cells;
            this.gridData['header']['title'] = gridDataClone[0].header.title;
            this.gridData['body']['cells'] = parentBodyRowList;
            this.gridData['pageData']['lastPageNumber'] = Math.max.apply(null, lastPageNumberList);
            this.gridData['pageData']['pageNumber'] = Math.max.apply(null, currPageNumberList);
            gridDataClone = null;
        }
        if (this.gridData && this.gridData.footer) {
            this.tableFooter = this.gridData.footer;
            this.tableFooterRows = this.tableFooter.rows;
        }
        if (this.gridData && this.gridData.header && this.gridData.header.cells.length > 0) {
            this.tableHeader = this.gridData.header;
            if (this.tableHeader.title.length > 0) {
                this.tableTitle = this.tableHeader.title[0].title;
            }
            else {
                this.tableTitle = '';
            }
            this.headerColumns = this.tableHeader.cells;
            this.tableBody = this.gridData.body;
            this.bodyColumns = this.gridData.body.cells;
            if (this.headerColumns && this.headerColumns.length > 0) {
                for (var i = 0; i < this.headerColumns.length; i++) {
                    for (var k = 0; k < this.sortHeaders.length; k++) {
                        if (this.headerColumns[i].text === this.sortHeaders[k].colName) {
                            this.headerColumns[i]['isSortable'] = true;
                            this.headerColumns[i]['fieldName'] = this.sortHeaders[k].fieldName;
                            this.headerColumns[i]['sortType'] = this.sortHeaders[k].sortType;
                        }
                    }
                    for (var j = 0; j < this.sortIndex.length; j++) {
                        if (this.sortIndex[j].index === this.headerColCounter) {
                            this.headerColumns[i]['isSortable'] = true;
                            this.headerColumns[i]['fieldName'] = this.sortIndex[j].fieldName;
                            this.headerColumns[i]['sortType'] = this.sortIndex[j].sortType;
                        }
                    }
                    for (var j = 0; j < this.headerProperties.length; j++) {
                        if (this.headerProperties[j].index === this.headerColCounter) {
                            this.headerColumns[i]['align'] = this.propValue(this.headerProperties[j], 'align');
                            this.headerColumns[i]['width'] = this.propValue(this.headerProperties[j], 'width');
                        }
                    }
                    this.headerColCounter += this.headerColumns[i].colSpan;
                    this.headerRows.push(this.headerColumns[i]);
                    if (this.headerColCounter === this.maxColumns) {
                        this.headerStructure[this.headerRowCounter] = this.headerRows;
                        this.headerColCounter = 0;
                        this.headerRowCounter += 1;
                        this.headerRows = [];
                    }
                }
            }
            this.headObj = this.headerStructure[this.headerRowCounter - 1];
            if (this.bodyColumns && this.bodyColumns.length > 0) {
                if (this.checkItemsPerPage) {
                    for (var i = 0; i < this.bodyColumns.length; i++) {
                        if (this.bodyRowCounter < this.itemsPerPage) {
                            if (this.validateProperties.length > 0) {
                                for (var j = 0; j < this.validateProperties.length; j++) {
                                    if (this.validateProperties[j].index === this.bodyColCounter) {
                                        this.bodyColumns[i]['align'] = this.validateProperties[j].align;
                                        this.bodyColumns[i]['maxlength'] = this.validateProperties[j].maxlength;
                                        this.bodyColumns[i]['readonly'] = this.validateProperties[j].readonly;
                                        if (this.validateProperties[j].type === MntConst.eTypeCode) {
                                            this.bodyColumns[i].text = this.bodyColumns[i].text.toUpperCase();
                                        }
                                        if (this.validateProperties[j].type === MntConst.eTypeImage) {
                                            this.bodyColumns[i].type = MntConst.eTypeImage;
                                        }
                                        break;
                                    }
                                }
                            }
                            this.bodyColCounter += this.bodyColumns[i].colSpan;
                            if (this.dataFromParent && this.dataFromParent['col11'] && this.bodyColCounter === this.dataFromParent['col11'].colNumber) {
                                this.bodyColumns[i].text = window['moment']().startOf('day').seconds(this.bodyColumns[i].text).format('HH:mm');
                            }
                            this.bodyRows.push(this.bodyColumns[i]);
                            if (this.bodyColCounter === this.maxColumns) {
                                this.createGridObject(this.headObj, this.bodyRows);
                                this.bodyStructure[this.bodyRowCounter] = this.bodyRows;
                                this.bodyColCounter = 0;
                                this.bodyRowCounter += 1;
                                this.bodyRows = [];
                            }
                            this.bodyStructure['selected'] = -1;
                        }
                    }
                }
                else {
                    for (var i = 0; i < this.bodyColumns.length; i++) {
                        if (this.validateProperties.length > 0) {
                            for (var j = 0; j < this.validateProperties.length; j++) {
                                if (this.validateProperties[j].index === this.bodyColCounter) {
                                    this.bodyColumns[i]['align'] = this.validateProperties[j].align;
                                    this.bodyColumns[i]['maxlength'] = this.validateProperties[j].maxlength;
                                    this.bodyColumns[i]['readonly'] = this.validateProperties[j].readonly;
                                    if (this.validateProperties[j].type === MntConst.eTypeCode) {
                                        this.bodyColumns[i].text = this.bodyColumns[i].text.toUpperCase();
                                    }
                                    break;
                                }
                            }
                        }
                        this.bodyColCounter += this.bodyColumns[i].colSpan;
                        if (this.dataFromParent && this.dataFromParent['col11'] && this.bodyColCounter === this.dataFromParent['col11'].colNumber) {
                            this.bodyColumns[i].text = window['moment']().startOf('day').seconds(this.bodyColumns[i].text).format('HH:mm');
                        }
                        this.bodyRows.push(this.bodyColumns[i]);
                        if (this.bodyColCounter === this.maxColumns) {
                            this.createGridObject(this.headObj, this.bodyRows);
                            this.bodyStructure[this.bodyRowCounter] = this.bodyRows;
                            this.bodyColCounter = 0;
                            this.bodyRowCounter += 1;
                            this.bodyRows = [];
                        }
                        this.bodyStructure['selected'] = -1;
                    }
                }
            }
            this.totalBodyStructure = this.bodyStructure;
            var totalPages = this.gridData.pageData.lastPageNumber;
            var itemCount = this.itemsPerPage;
            if (this.showTotalRow) {
                itemCount = itemCount - 1;
            }
            var approxRecords = totalPages * itemCount;
            var currentPage = this.gridData.pageData.lastPageNumber === 0 ? 0 : this.gridData.pageData.pageNumber;
            this.pageInfo = ' (Page ' + currentPage + ' of ' + totalPages + ')';
            var gridDetails = {
                'gridData': this.gridData,
                'curPage': currentPage,
                'totalRows': approxRecords,
                'totalPages': totalPages,
                'numberOfBusiness': numberOfBusiness
            };
            if (!this.createGridFromOnChange) {
                this.gridInfo.emit(JSON.parse(JSON.stringify(gridDetails)));
            }
        }
        else {
            this.gridInfo.emit({ 'totalPages': 0 });
        }
    };
    GridComponent.prototype.propValue = function (obj, propName) {
        if (obj[propName]) {
            return obj[propName];
        }
        else {
            return '';
        }
    };
    GridComponent.prototype.updateRow = function (data) {
        var counter = 0;
        for (var p = 0; p < data.body.cells.length; p++) {
            if (this.rowId === data.body.cells[p].rowID) {
                this.newIndex = p;
                break;
            }
        }
        for (var i = 0; i < this.bodyColumns.length; i++) {
            if (this.rowId === this.bodyColumns[i].rowID) {
                for (var j = 0; j <= counter; j++) {
                    this.bodyColumns[i - j].text = data.body.cells[this.newIndex - j].text;
                }
                for (var k = 1; k < (this.maxColumns - counter); k++) {
                    this.bodyColumns[i + k].text = data.body.cells[this.newIndex + k].text;
                }
                break;
            }
            counter = (counter + 1) % this.maxColumns;
        }
    };
    GridComponent.prototype.onCellClick = function (rowIndex, cellIndex, cellData) {
        var _this = this;
        if (this.clickEvent) {
            clearTimeout(this.clickEvent);
        }
        this.clickEvent = setTimeout(function () {
            if (!cellData) {
                var index = rowIndex * _this.maxColumns + cellIndex;
                cellData = _this.gridData.body.cells[index];
            }
            _this.bodyStructure['selected'] = rowIndex;
            var returnObj = {
                'rowData': _this.gridArray[rowIndex],
                'cellData': cellData,
                'cellIndex': cellIndex,
                'rowIndex': rowIndex,
                'trRowData': _this.bodyStructure[rowIndex],
                'columnClicked': _this.headObj[cellIndex]
            };
            _this.getCellData.emit(returnObj);
        }, 250);
    };
    GridComponent.prototype.onRowClick = function (rowData, event) {
        event.stopPropagation();
    };
    GridComponent.prototype.onCellBlur = function (e, rowIndex, cellIndex, cellData) {
        if (!cellData)
            cellData = this.gridData.body.cells[cellIndex];
        this.bodyStructure['selected'] = rowIndex;
        if (this.validateProperties.length > 0) {
            for (var j = 0; j < this.validateProperties.length; j++) {
                if (this.validateProperties[j].index === cellIndex) {
                    if (this.validateProperties[j].type === MntConst.eTypeInteger) {
                        if (e.target) {
                            if (isNaN(e.target.value)) {
                                this.utils.addClass(e.target, 'error');
                                this.gridInErrorState = true;
                            }
                            else {
                                this.utils.removeClass(e.target, 'error');
                                this.gridInErrorState = false;
                            }
                        }
                    }
                }
            }
            if (this.gridInErrorState || document.querySelector("icabs-grid .gridtable tbody input[type='text'].error")) {
                return;
            }
        }
        var returnObj = {
            'keyCode': e,
            'rowData': this.gridArray[rowIndex],
            'cellData': cellData,
            'cellIndex': cellIndex,
            'trRowData': this.bodyStructure[rowIndex],
            'completeRowData': this.bodyStructure[rowIndex],
            'updateValue': e.target.value
        };
        this.getCellDataonBlur.emit(returnObj);
    };
    GridComponent.prototype.onFocusOut = function (keycode, rowIndex, cellIndex, cellData) {
        if (this.dataFromParent[cellIndex].editable) {
            this.bodyStructure['selected'] = -1;
        }
        else {
            this.bodyStructure['selected'] = rowIndex;
        }
    };
    GridComponent.prototype.changeCheckbox = function (event, rowIndex, cellIndex, cellData) {
        if (!cellData)
            cellData = this.gridData.body.cells[cellIndex];
        this.bodyStructure['selected'] = rowIndex;
        var returnObj = {
            'event': event,
            'rowData': this.gridArray[rowIndex],
            'cellData': cellData,
            'cellIndex': cellIndex
        };
        this.getchangedCheckBox.emit(returnObj);
    };
    GridComponent.prototype.changeSelectedRow = function (e, rowIndex, cellIndex, cellData) {
        var _this = this;
        e.stopPropagation();
        if (!cellData)
            cellData = this.gridData.body.cells[cellIndex];
        this.bodyStructure['selected'] = rowIndex;
        var returnObj = {
            'keyCode': e,
            'rowData': this.gridArray[rowIndex],
            'cellData': cellData,
            'cellIndex': cellIndex,
            'headerclickedCol': this.headObj[cellIndex]
        };
        this.getCellKeyDownData.emit(returnObj);
        if (e['keyCode'] !== 38 || e['keyCode'] !== 40)
            return;
        if (e['keyCode'] === 38 && rowIndex > 0) {
            this.bodyStructure['selected'] = --rowIndex;
        }
        else if (e['keyCode'] === 40 && rowIndex < this.bodyStructure.length - 1) {
            this.bodyStructure['selected'] = ++rowIndex;
        }
        setTimeout(function () {
            _this.el.nativeElement.querySelector('tr.selected input').focus();
        }, 100);
    };
    GridComponent.prototype.onCellDblClick = function (cellData, rowIndex, cellIndex, event) {
        clearTimeout(this.clickEvent);
        var returnObj = {
            'rowData': this.gridArray[rowIndex],
            'cellData': cellData,
            'cellIndex': cellIndex,
            'rowIndex': rowIndex,
            'columnClicked': this.headerColumns[cellIndex],
            'trRowData': this.bodyStructure[rowIndex],
            'headerColclicked': this.headObj[cellIndex]
        };
        this.selectedRowInfo.emit(returnObj);
        event.stopPropagation();
    };
    GridComponent.prototype.getCellInfoForSelectedRow = function (rowIndex, cellIndex) {
        var cellData = new Object();
        cellData = this.bodyStructure[rowIndex][cellIndex];
        return cellData;
    };
    GridComponent.prototype.getHeaderInfoForSelectedCell = function (rowIndex, cellIndex) {
        var headerColumnData = new Object();
        headerColumnData = this.headObj[cellIndex];
        return headerColumnData;
    };
    GridComponent.prototype.getFooterInfo = function () {
        return this.tableFooterRows;
    };
    GridComponent.prototype.showInfoModal = function (event, rowData, columnNumber, rowIndex) {
        event.stopPropagation();
        if (this.infoDataColumnReference !== null && this.infoDataColumnReference !== undefined) {
            var index = columnNumber + this.infoDataColumnReference;
            var returnObj = {
                'data': rowData[index],
                'trRowData': this.bodyStructure[rowIndex]
            };
            this.infoData.emit(returnObj);
        }
        else {
            var index = columnNumber;
            var returnObj = {
                'data': rowData[index],
                'trRowData': this.bodyStructure[rowIndex]
            };
            this.infoData.emit(returnObj);
        }
    };
    GridComponent.prototype.changeSorting = function (fieldName, sortType, index) {
        var newSortType;
        for (var k = 0; k < this.sortHeaders.length; k++) {
            if (this.sortHeaders[k].fieldName === fieldName) {
                if (sortType === 'ASC') {
                    newSortType = 'DESC';
                    this.sortHeaders[k].sortType = newSortType;
                }
                else {
                    newSortType = 'ASC';
                }
                this.sortHeaders[k].sortType = newSortType;
            }
            else {
                this.sortHeaders[k].sortType = 'ASC';
            }
        }
        for (var k = 0; k < this.sortIndex.length; k++) {
            if (this.sortIndex[k].fieldName === fieldName) {
                if (sortType === 'ASC') {
                    newSortType = 'DESC';
                    this.sortIndex[k].sortType = newSortType;
                }
                else {
                    newSortType = 'ASC';
                }
                this.sortIndex[k].sortType = newSortType;
            }
            else {
                this.sortIndex[k].sortType = 'ASC';
            }
        }
        var returnObj = {
            fieldname: fieldName,
            sort: newSortType,
            index: index,
            sortIndex: this.sortIndex
        };
        this.sortInfo.emit(returnObj);
    };
    GridComponent.prototype.createGridObject = function (headObj, bodyObj) {
        var gridObj = {};
        for (var i = 0; i < this.maxColumns; i++) {
            if (this.dataFromParent) {
                if (this.dataFromParent['pageName'] && this.dataFromParent['pageName'] === 'visitSummary') {
                    if (i === this.dataFromParent['timeFormatIndex']['StandardDuration'] || i === this.dataFromParent['timeFormatIndex']['OvertimeDuration']) {
                        bodyObj[i].text = this.utils.secondsToHms(bodyObj[i].text);
                    }
                }
            }
            if (headObj && headObj[i]) {
                gridObj[headObj[i].text] = bodyObj[i].text;
            }
        }
        this.gridArray.push(gridObj);
    };
    GridComponent.prototype.clearGridData = function () {
        this.gridData = null;
        var gridDetails = {
            'curPage': 0,
            'totalRows': 0,
            'totalPages': 0
        };
        this.pageInfo = '';
        this.tableTitle = '';
        this.createGridStructure();
    };
    GridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-grid',
                    templateUrl: 'grid.html'
                },] },
    ];
    GridComponent.ctorParameters = [
        { type: HttpService, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: GlobalConstant, },
        { type: AjaxObservableConstant, },
        { type: NgZone, },
        { type: Logger, },
        { type: ErrorService, },
        { type: RiExchange, },
        { type: Utils, },
    ];
    GridComponent.propDecorators = {
        'maxColumns': [{ type: Input },],
        'currentPage': [{ type: Input },],
        'url': [{ type: Input },],
        'gridData': [{ type: Input },],
        'infoDataColumnReference': [{ type: Input },],
        'itemsPerPage': [{ type: Input },],
        'sortHeaders': [{ type: Input },],
        'sortIndex': [{ type: Input },],
        'dataFromParent': [{ type: Input },],
        'builtFromParent': [{ type: Input },],
        'displayError': [{ type: Input },],
        'showTotalRow': [{ type: Input },],
        'showTick': [{ type: Input },],
        'showCheckboxInsteadOfTick': [{ type: Input },],
        'displayCountryBusiness': [{ type: Input },],
        'editableColumns': [{ type: Input },],
        'showPageCount': [{ type: Input },],
        'headerProperties': [{ type: Input },],
        'checkItemsPerPage': [{ type: Input },],
        'validateProperties': [{ type: Input },],
        'gridDataLoadSuccess': [{ type: Output },],
        'gridInfo': [{ type: Output },],
        'getCellData': [{ type: Output },],
        'getCellDataonBlur': [{ type: Output },],
        'getchangedCheckBox': [{ type: Output },],
        'getCellKeyDownData': [{ type: Output },],
        'selectedRowInfo': [{ type: Output },],
        'infoData': [{ type: Output },],
        'sortInfo': [{ type: Output },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return GridComponent;
}());
