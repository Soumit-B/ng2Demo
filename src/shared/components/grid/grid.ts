import { Observable } from 'rxjs/Observable';
import { Logger } from '@nsalaun/ng2-logger';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit, OnChanges, Input, Output, EventEmitter, NgZone, OnDestroy, ViewChild, ElementRef, Renderer, trigger } from '@angular/core';
import { HttpService } from './../../services/http-service';
import { ErrorService } from './../../services/error.service';
import { GridStructure, PageData, Header, Body, Footer } from './grid-structure';
import { GlobalConstant } from '../../constants/global.constant';
import { ErrorConstant } from '../../constants/error.constant';
import { Subscription } from 'rxjs/Subscription';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { RiExchange } from '../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { MntConst } from './../../services/riMaintenancehelper';
import { GlobalizeService } from '../../../shared/services/globalize.service';

@Component({
    selector: 'icabs-grid',
    templateUrl: 'grid.html'
})

export class GridComponent implements OnInit, OnDestroy, OnChanges {
    @Input() maxColumns: number;
    @Input() currentPage: number;
    @Input() url: string;
    @Input() gridData: GridStructure;
    @Input() infoDataColumnReference: number;
    @Input() itemsPerPage: number;
    @Input() sortHeaders: Array<any>;
    @Input() sortIndex: Array<any>;
    @Input() dataFromParent: any;
    @Input() builtFromParent: boolean;
    @Input() displayError: boolean;
    @Input() showTotalRow: boolean;
    @Input() showTick: boolean;
    @Input() showCheckboxInsteadOfTick: boolean;
    @Input() displayCountryBusiness: boolean;
    @Input() editableColumns: Array<any> = [];
    @Input() showPageCount: boolean = true;
    @Input() headerProperties: any;
    @Input() checkItemsPerPage: boolean;
    @Input() validateProperties: any;

    @Output() gridDataLoadSuccess = new EventEmitter();
    @Output() gridInfo = new EventEmitter();
    @Output() getCellData = new EventEmitter();
    @Output() getCellDataonBlur = new EventEmitter();
    @Output() getchangedCheckBox = new EventEmitter();
    @Output() getCellKeyDownData = new EventEmitter();
    @Output() selectedRowInfo = new EventEmitter();
    @Output() infoData = new EventEmitter();
    @Output() sortInfo = new EventEmitter();
    @ViewChild('errorModal') public errorModal;
    //Component Variables
    private errorMessage: string;
    private newIndex: number = 0;
    private gridInErrorState: boolean = false;
    //Table Variables
    public update: Boolean = false;
    public tableTitle: String;
    public pageInfo: string;
    public pageData: PageData;
    public tableHeader: Header;
    public headerStructure: Array<any> = [];
    public headerColumns: Array<any>;
    public headObj: Array<any>;
    public headerRows: Array<any> = [];
    public headerColCounter: number = 0;
    public headerRowCounter: number = 0;
    public tableBody: Body;
    public totalBodyStructure: Array<any> = [];
    public bodyStructure: Array<any> = [];
    public bodyColumns: Array<any>;
    public bodyRows: Array<any> = [];
    public bodyColCounter: number = 0;
    public bodyRowCounter: number = 0;
    public gridArray: Array<Object> = [];
    public isRequesting: boolean = false;
    public sort: Object = {};
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public showErrorHeader: boolean = true;
    public ajaxSubscription: Subscription;
    public mntConst: any = {};
    private rowId: string = '';
    private errorSubscription: Subscription;
    private httpSubscription: any;
    private createGridFromOnChange: boolean = false;
    private clickEvent: any;
    private isEditableField: false;
    private tableFooter: Footer;
    private tableFooterRows: Array<any>;
    private prevData: Object = {
        pageCurrent: 1,
        lastPageNumber: 1
    };
    private pageAction: Number = 0;
    private isRowHighlightTrue: boolean = true;

    constructor(
        private httpService: HttpService,
        private el: ElementRef,
        private renderer: Renderer,
        private global: GlobalConstant,
        private ajaxconstant: AjaxObservableConstant,
        private zone: NgZone,
        private logger: Logger,
        private errorService: ErrorService,
        private riExchange: RiExchange,
        private utils: Utils,
        private globalize: GlobalizeService
    ) { };

    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.mntConst = MntConst;
        this.update = false;
        this.itemsPerPage = this.itemsPerPage || this.global.AppConstants().tableConfig.itemsPerPage;
        this.sortIndex = this.sortIndex || [];
        this.headerProperties = this.headerProperties || [];
        this.validateProperties = this.validateProperties || [];
        if (this.showTotalRow) {
            this.itemsPerPage = this.itemsPerPage + 1; //Add total row
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
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                if (this.zone) {
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
            }
        });

        /*this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                if (this.zone) {
                    this.zone.run(() => {
                        if (data['errorMessage']) {
                            this.errorModal.show(data, true);
                        }
                    });
                }
            }
        });*/
    }

    //Reason: Called each time maxcolumn was changed as per requirement
    //TODO: To be removed
    public ngOnChanges(): void {
        this.createGridFromOnChange = true;
        this.createGridStructure();
        this.createGridFromOnChange = false;
    }

    public ngOnDestroy(): void {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
        }
    }

    public loadGridData(params: any, rowId?: any): void {
        if (rowId) {
            this.rowId = rowId;
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        /*let requestPageCurrent =  params.search.get('pageCurrent') || params.search.get('PageCurrent');
        this.pageAction =  params.search.get('action') || params.search.get('Action');
        if (parseInt(this.prevData['pageCurrent'], 10) === parseInt(requestPageCurrent, 10)) {
            this.pageAction = 2;
        } else if (parseInt(requestPageCurrent, 10) === 1) {
            this.pageAction = 0;
        } else if (parseInt(requestPageCurrent, 10) === this.prevData['lastPageNumber']) {
            this.pageAction = 4;
        } else if (parseInt(requestPageCurrent, 10) - parseInt(this.prevData['pageCurrent'], 10) > 0) {
            this.pageAction = 3;
            if (params.search.get('pageCurrent') !== null && params.search.get('pageCurrent') !== undefined) {
                params.search.set('pageCurrent', (parseInt(requestPageCurrent, 10) - 1).toString());
            } else {
                params.search.set('PageCurrent', (parseInt(requestPageCurrent, 10) - 1).toString());
            }
        } else if (parseInt(this.prevData['pageCurrent'], 10) - parseInt(requestPageCurrent, 10) > 0) {
            this.pageAction = 1;
            if (params.search.get('pageCurrent') !== null && params.search.get('pageCurrent') !== undefined) {
                params.search.set('pageCurrent', (parseInt(requestPageCurrent, 10) + 1).toString());
            } else {
                params.search.set('PageCurrent', (parseInt(requestPageCurrent, 10) + 1).toString());
            }
        }
        if (params.search.get('action') !== null && params.search.get('action') !== undefined) {
            params.search.set('action', this.pageAction);
        } else {
            params.search.set('Action', this.pageAction);
        }*/
        this.httpSubscription = this.httpService.makeGetRequest(params.method, params.module, params.operation, params.search)
            .subscribe(
            (data) => {
                if (this.zone) {
                    this.zone.run(() => {
                        this.onServiceSuccess(data, rowId);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        //this.prevData['pageCurrent'] = requestPageCurrent;
                        //this.prevData['lastPageNumber'] = data.pageData ? data.pageData['lastPageNumber'] : 1;
                    });
                }
            },
            error => {
                this.onServiceFailure(error, params);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public updateGridData(params: any, rowId?: any, postObject?: any): void {
        if (rowId) {
            this.rowId = rowId;
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(params.method, params.module, params.operation, params.search, postObject ? postObject : params.body)
            .subscribe(
            (data) => {
                if (this.zone) {
                    this.zone.run(() => {
                        this.onServiceSuccess(data);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    });
                }
            }, error => {
                this.onServiceFailure(error, params);
            });
    }

    private onServiceSuccess(data: any, rowId?: any): void {
        if (data.errorMessage || data.fullError) {
            this.tableTitle = ''; //data.errorMessage;
            let gridDetails: Object = {
                'curPage': 0,
                'totalRows': 0,
                'totalPages': 0
            };

            //this.gridInfo.emit(JSON.parse(JSON.stringify(gridDetails)));
            //this.errorModal.show(data, true);
            this.errorService.emitError(data);
        }
        else {
            if (!rowId) {
                this.gridData = data;
                this.logger.log('GridData', data);
                this.createGridStructure();
            } else {
                this.updateRow(data);
            }
        }
    }

    private onServiceFailure(error: any, params: any): void {
        this.errorMessage = error as any;
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        let gridDetails: Object = {
            'curPage': 0,
            'totalRows': 0,
            'totalPages': 0
        };
        // Commenting for the time being as this prevents testing in credit approval

        if (this.displayError) {
            this.errorService.emitError({
                errorMessage: ErrorConstant.Message.GridFetchError + ' Method - ' + params.method + ' Module - ' + params.module + ' Operation - ' + params.operation
            });
        }
        //this.gridInfo.emit(JSON.parse(JSON.stringify(gridDetails)));
    }

    private createGridStructure(): void {
        let numberOfBusiness = 1;
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
            let gridDataClone = JSON.parse(JSON.stringify(this.gridData));
            let parentBodyRowList = [];
            let lastPageNumberList = [];
            let currPageNumberList = [];
            numberOfBusiness = gridDataClone.length;
            for (let i = 0; i < gridDataClone.length; i++) {
                if (!gridDataClone[i]['fullError'] && !gridDataClone[i]['errrorMessage']) {
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
                        let numberOfRows = Math.ceil(gridDataClone[i].body.cells.length / (this.maxColumns - 2));
                        let bodyRowList = [];
                        for (let j = 0; j < numberOfRows; j++) {
                            let bodyRow = gridDataClone[i].body.cells.slice((j * (this.maxColumns - 2)), ((j + 1) * (this.maxColumns - 2)));
                            let cbList = [
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
                            let concat = cbList.concat(bodyRow);
                            bodyRowList.push(concat);
                        }
                        for (let k = 0; k < bodyRowList.length; k++) {
                            parentBodyRowList.push(bodyRowList[k]);
                        }
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
            if (lastPageNumberList !== null && lastPageNumberList !== undefined) {
                this.gridData['pageData']['lastPageNumber'] = Math.max.apply(null, lastPageNumberList);
            }
            if (currPageNumberList !== null && currPageNumberList !== undefined) {
                this.gridData['pageData']['pageNumber'] = Math.max.apply(null, currPageNumberList);
            }
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
            } else {
                this.tableTitle = '';
            }
            this.headerColumns = this.tableHeader.cells;
            this.tableBody = this.gridData.body;
            this.bodyColumns = this.gridData.body.cells;

            if (this.headerColumns && this.headerColumns.length > 0) {
                for (let i = 0; i < this.headerColumns.length; i++) {

                    for (let k = 0; k < this.sortHeaders.length; k++) {
                        if (this.headerColumns[i].text === this.sortHeaders[k].colName) {
                            this.headerColumns[i]['isSortable'] = true;
                            this.headerColumns[i]['fieldName'] = this.sortHeaders[k].fieldName;
                            this.headerColumns[i]['sortType'] = this.sortHeaders[k].sortType;
                        }
                    }

                    for (let j = 0; j < this.sortIndex.length; j++) {
                        if (this.sortIndex[j].index === this.headerColCounter) {
                            this.headerColumns[i]['isSortable'] = true;
                            this.headerColumns[i]['fieldName'] = this.sortIndex[j].fieldName;
                            this.headerColumns[i]['sortType'] = this.sortIndex[j].sortType;
                        }
                    }
                    for (let j = 0; j < this.headerProperties.length; j++) {
                        if (this.headerProperties[j].index === this.headerColCounter) {
                            this.headerColumns[i]['align'] = this.propValue(this.headerProperties[j], 'align');
                            this.headerColumns[i]['width'] = this.propValue(this.headerProperties[j], 'width');
                            this.headerColumns[i]['minWidth'] = this.propValue(this.headerProperties[j], 'minWidth');
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
                    for (let i = 0; i < this.bodyColumns.length; i++) {
                        if (this.bodyRowCounter < this.itemsPerPage) {
                            if (this.validateProperties.length > 0) {
                                for (let j = 0; j < this.validateProperties.length; j++) {
                                    if (this.validateProperties[j].index === this.bodyColCounter) {
                                        this.bodyColumns[i]['align'] = this.validateProperties[j].align;
                                        this.bodyColumns[i]['maxlength'] = this.validateProperties[j].maxlength;
                                        this.bodyColumns[i]['readonly'] = this.validateProperties[j].readonly;
                                        this.bodyColumns[i]['toolTip'] = this.validateProperties[j].toolTip;
                                        this.globalizeFormatting(i, j);
                                        this.bodyColumns[i].type = this.validateProperties[j].type;
                                        break;
                                    }
                                }
                            }
                            this.bodyColCounter += this.bodyColumns[i].colSpan;
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
                } else {
                    for (let i = 0; i < this.bodyColumns.length; i++) {
                        if (this.validateProperties.length > 0) {
                            for (let j = 0; j < this.validateProperties.length; j++) {
                                if (this.validateProperties[j].index === this.bodyColCounter) {
                                    this.bodyColumns[i]['align'] = this.validateProperties[j].align;
                                    this.bodyColumns[i]['maxlength'] = this.validateProperties[j].maxlength;
                                    this.bodyColumns[i]['readonly'] = this.validateProperties[j].readonly;
                                    this.globalizeFormatting(i, j);
                                    break;
                                }
                            }
                        }
                        this.bodyColCounter += this.bodyColumns[i].colSpan;
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
            let totalPages: any = this.gridData.pageData.lastPageNumber;
            let itemCount = this.itemsPerPage;
            if (this.showTotalRow) {
                itemCount = itemCount - 1;
            }
            let approxRecords: any = totalPages * itemCount;
            let currentPage: any = this.gridData.pageData.lastPageNumber === 0 ? 0 : this.gridData.pageData.pageNumber;

            this.pageInfo = ' (Page ' + currentPage + ' of ' + totalPages + ')';
            let gridDetails: Object = {
                'gridData': this.gridData,
                'curPage': currentPage,
                'totalRows': approxRecords,
                'totalPages': totalPages,
                'numberOfBusiness': numberOfBusiness
            };
            if (!this.createGridFromOnChange) {
                this.gridInfo.emit(JSON.parse(JSON.stringify(gridDetails)));
            }
        } else {
            this.gridInfo.emit({ 'totalPages': 0 });
        }
    }

    private globalizeFormatting(i: number, j: number): void {
        if (typeof this.bodyColumns[i].text !== 'undefined' && this.bodyColumns[i].text !== null && this.bodyColumns[i].text !== '') {
            let formattedValue: any;
            switch (this.validateProperties[j].type) {
                case MntConst.eTypeCode:
                    this.bodyColumns[i].text = this.bodyColumns[i].text.toUpperCase();
                    break;
                case MntConst.eTypeTextFree:
                    this.bodyColumns[i].text = this.utils.toTitleCase(this.bodyColumns[i].text);
                    break;
                case MntConst.eTypeText:
                    this.bodyColumns[i].text = this.bodyColumns[i].text;
                    break;
                case MntConst.eTypeInteger:
                    formattedValue = this.globalize.formatIntegerToLocaleFormat(this.bodyColumns[i].text);
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeDecimal1:
                    formattedValue = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(this.bodyColumns[i].text), 1);
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeDecimal2:
                    formattedValue = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(this.bodyColumns[i].text), 2);
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeDecimal3:
                    formattedValue = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(this.bodyColumns[i].text), 3);
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeDecimal4:
                    formattedValue = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(this.bodyColumns[i].text), 4);
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeDecimal5:
                    formattedValue = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(this.bodyColumns[i].text), 5);
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeDecimal6:
                    formattedValue = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(this.bodyColumns[i].text), 6);
                    if (formattedValue !== null && formattedValue !== undefined && formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeCurrency:
                    formattedValue = this.globalize.formatCurrencyToLocaleFormat(this.utils.decimalFaultTolerance(this.bodyColumns[i].text));
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeTime:
                    formattedValue = this.globalize.formatTimeToLocaleFormat(this.bodyColumns[i].text);;
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeDate:
                    formattedValue = this.globalize.formatDateToLocaleFormat(this.bodyColumns[i].text);;
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeDateText:
                    formattedValue = this.globalize.formatDateToLocaleFormat(this.bodyColumns[i].text);;
                    if (formattedValue !== false) {
                        this.bodyColumns[i].text = formattedValue;
                    }
                    break;
                case MntConst.eTypeImage:
                    // statement
                    break;
            }
        }
    }

    private propValue(obj: any, propName: string): any {
        if (obj[propName]) {
            return obj[propName];
        } else {
            return '';
        }
    }

    private updateRow(data: any): void {
        let counter = 0;
        for (let p = 0; p < data.body.cells.length; p++) {
            if (this.rowId === data.body.cells[p].rowID) {
                this.newIndex = p;
                break;
            }
        }
        for (let i = 0; i < this.bodyColumns.length; i++) {
            if (this.rowId === this.bodyColumns[i].rowID) {
                for (let j = 0; j <= counter; j++) {
                    this.bodyColumns[i - j].text = data.body.cells[this.newIndex - j].text;
                }
                for (let k = 1; k < (this.maxColumns - counter); k++) {
                    this.bodyColumns[i + k].text = data.body.cells[this.newIndex + k].text;
                }
                break;
            }
            counter = (counter + 1) % this.maxColumns;
        }
    }

    public onCellClick(rowIndex: any, cellIndex: any, cellData?: any): void {
        if (this.clickEvent) {
            clearTimeout(this.clickEvent);
        }

        this.clickEvent = setTimeout(() => {
            if (!cellData) {
                let index = rowIndex * this.maxColumns + cellIndex;
                cellData = this.gridData.body.cells[index];
            }
            if (this.isRowHighlightTrue) {
                this.bodyStructure['selected'] = rowIndex;
            }
            let returnObj = {
                'rowData': this.gridArray[rowIndex],
                'cellData': cellData,
                'cellIndex': cellIndex,
                'rowIndex': rowIndex,
                'trRowData': this.bodyStructure[rowIndex],
                'columnClicked': this.headObj[cellIndex]
            };
            this.getCellData.emit(returnObj);
        }, 250);

    }

    public onRowClick(rowData: any, event: any): void {
        event.stopPropagation();
    }

    public onCellBlur(e: any, rowIndex: any, cellIndex: any, cellData?: any): void {
        if (!cellData)
            cellData = this.gridData.body.cells[cellIndex];
        if (this.isRowHighlightTrue) {
            this.bodyStructure['selected'] = rowIndex;
        }
        let parsedValue: any;
        if (this.validateProperties.length > 0) {
            for (let j = 0; j < this.validateProperties.length; j++) {
                if (this.validateProperties[j].index === cellIndex) {
                    if (this.validateProperties[j].type === MntConst.eTypeInteger) {
                        if (e.target) {
                            if (isNaN(e.target.value)) {
                                this.utils.addClass(e.target, 'error');
                                this.gridInErrorState = true;
                            } else {
                                this.utils.removeClass(e.target, 'error');
                                this.gridInErrorState = false;
                            }
                        }
                        parsedValue = this.globalize.parseIntegerToFixedFormat(e.target.value);
                    } else if (this.validateProperties[j].type === MntConst.eTypeCurrency) {
                        let formattedValue: any = this.globalize.formatCurrencyToLocaleFormat(e.target.value, true);
                        if (formattedValue === false) {
                            this.utils.addClass(e.target, 'error');
                        } else {
                            this.utils.removeClass(e.target, 'error');
                        }
                        e.target.value = formattedValue;
                        parsedValue = this.globalize.parseCurrencyToFixedFormat(formattedValue);
                    }
                }
            }
            if (this.gridInErrorState || document.querySelector("icabs-grid .gridtable tbody input[type='text'].error")) {
                return;
            }
        }
        let returnObj = {
            'keyCode': e,
            'rowData': this.gridArray[rowIndex],
            'cellData': cellData,
            'cellIndex': cellIndex,
            'trRowData': this.bodyStructure[rowIndex],
            'completeRowData': this.bodyStructure[rowIndex],
            'updateValue': parsedValue !== null && parsedValue !== undefined ? parsedValue : e.target.value
        };
        this.getCellDataonBlur.emit(returnObj);
    }

    public onFocusOut(keycode: any, rowIndex: any, cellIndex: any, cellData?: any): void {
        if (this.dataFromParent[cellIndex].editable) {
            this.bodyStructure['selected'] = -1;
        } else {
            this.bodyStructure['selected'] = rowIndex;
        }
    }

    public changeCheckbox(event: any, rowIndex: any, cellIndex: any, cellData?: any): void {
        if (!cellData)
            cellData = this.gridData.body.cells[cellIndex];
        this.bodyStructure['selected'] = rowIndex;
        let returnObj = {
            'event': event,
            'rowData': this.gridArray[rowIndex],
            'cellData': cellData,
            'cellIndex': cellIndex
        };
        this.getchangedCheckBox.emit(returnObj);
    }

    public changeSelectedRow(e: Event, rowIndex: any, cellIndex: any, cellData?: any): void {
        e.stopPropagation();
        if (!cellData)
            cellData = this.gridData.body.cells[cellIndex];
        this.bodyStructure['selected'] = rowIndex;
        let returnObj = {
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
        setTimeout(() => {
            this.el.nativeElement.querySelector('tr.selected input').focus();
        }, 100);

    }

    public onCellDblClick(cellData: any, rowIndex: any, cellIndex: any, event: Event): void {
        clearTimeout(this.clickEvent);
        let returnObj = {
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
    }

    public getCellInfoForSelectedRow(rowIndex: any, cellIndex: any): Object {
        let cellData: any = new Object();
        cellData = this.bodyStructure[rowIndex][cellIndex];
        return cellData;
    }

    public getHeaderInfoForSelectedCell(rowIndex: any, cellIndex: any): Object {
        let headerColumnData: any = new Object();
        headerColumnData = this.headObj[cellIndex];
        return headerColumnData;
    }

    public getFooterInfo(): Array<any> {
        return this.tableFooterRows;
    }

    public showInfoModal(event: any, rowData: any, columnNumber: any, rowIndex: any): void {
        event.stopPropagation();
        if (this.infoDataColumnReference !== null && this.infoDataColumnReference !== undefined) {
            let index = columnNumber + this.infoDataColumnReference;
            let returnObj = {
                'data': rowData[index],
                'trRowData': this.bodyStructure[rowIndex]
            };
            this.infoData.emit(returnObj);
        } else {
            let index = columnNumber;
            let returnObj = {
                'data': rowData[index],
                'trRowData': this.bodyStructure[rowIndex]
            };
            this.infoData.emit(returnObj);
        }

    }

    public changeSorting(fieldName: any, sortType: any, index: any): void {
        let newSortType: string;
        for (let k = 0; k < this.sortHeaders.length; k++) {
            if (this.sortHeaders[k].fieldName === fieldName) {
                if (sortType === 'ASC') {
                    newSortType = 'DESC';
                    this.sortHeaders[k].sortType = newSortType;
                } else {
                    newSortType = 'ASC';
                }
                this.sortHeaders[k].sortType = newSortType;
            } else {
                this.sortHeaders[k].sortType = 'ASC';
            }
        }

        for (let k = 0; k < this.sortIndex.length; k++) {
            if (this.sortIndex[k].fieldName === fieldName) {
                if (sortType === 'ASC') {
                    newSortType = 'DESC';
                    this.sortIndex[k].sortType = newSortType;
                } else {
                    newSortType = 'ASC';
                }
                this.sortIndex[k].sortType = newSortType;
            } else {
                this.sortIndex[k].sortType = 'ASC';
            }
        }

        let returnObj = {
            fieldname: fieldName,
            sort: newSortType,
            index: index,
            sortIndex: this.sortIndex
        };
        this.sortInfo.emit(returnObj);
    }

    private createGridObject(headObj: any, bodyObj: any): void {
        let gridObj = {};
        for (let i = 0; i < this.maxColumns; i++) {
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
    }

    public clearGridData(): void {
        this.gridData = null;
        let gridDetails: Object = {
            'curPage': 0,
            'totalRows': 0,
            'totalPages': 0
        };
        this.pageInfo = '';
        this.tableTitle = '';
        //this.gridInfo.emit(JSON.parse(JSON.stringify(gridDetails)));
        this.createGridStructure();
    }

    public setRowHighlight(val: boolean): void {
        this.isRowHighlightTrue = val;
    }

    public isNaN(str: any): boolean {
        return isNaN(str);
    }
}
