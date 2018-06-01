/**
 * @description
 * Shared table component
 * AVOID CALLING METHODS MARKED AS 'View Only' FROM OUTSIDE THE COMPONENT
 * @class TableComponent
 * @implements OnInit, OnChanges, OnDestroy
 * @todo
 *  - Remove commented unused class properties and method
 * @version 2.0.0
 */
import { StaticUtils } from './../../services/static.utility';
import { MntConst } from './../../services/riMaintenancehelper';
import { LocaleTranslationService } from './../../services/translation.service';
import { Utils } from './../../services/utility';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, OnDestroy, Input, Output, ViewChild, EventEmitter, NgZone, ElementRef } from '@angular/core';
import { HttpService } from './../../services/http-service';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { GlobalConstant } from '../../constants/global.constant';
import { ErrorConstant } from '../../constants/error.constant';
import { ServiceConstants } from '../../constants/service.constants';
import { AuthService } from '../../../shared/services/auth.service';
import { ErrorService } from './../../services/error.service';
import { Logger } from '@nsalaun/ng2-logger';
import { RiExchange } from '../../../shared/services/riExchange';
import { GlobalizeService } from './../../services/globalize.service';

@Component({
    selector: 'icabs-table',
    templateUrl: 'table.html',
    providers: [ErrorService]
})
export class TableComponent implements OnInit, OnChanges, OnDestroy {
    // Class Properties
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Table data to be loaded
     * @member {any[]} tabledata
     */
    @Input() tabledata: Array<any>;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Table columns array
     * Accepts keys
     *  - type: string
     *  - title: string
     *  - alignment: string
     *  - size: number
     * @member {any[]} columns
     */
    @Input() columns: Array<any> = [];
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Table row meta data
     * @member {any[]} rowmetadata
     */
    @Input() rowmetadata: Array<any>;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Table items per page
     * @member {number} itemsPerPage
     */
    @Input() itemsPerPage: number;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Subset of table data for page
     * @member {any[]} rows
     */
    @Input() rows: Array<any>;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Table current page number
     * @member {number} page
     */
    @Input() page: number;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Total number of pages
     * @member {number} totalPage
     */
    @Input() totalPage: number;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Flag if error will be displayed
     * @member {boolean} displayError
     */
    @Input() displayError: boolean;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Table header
     * @member {string} tableheader
     */
    @Input() tableheader: string;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Flag to reset table rowId
     * @member {boolean} resetRowId
     */
    @Input() resetRowId: boolean;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Flag to set if table will be tabbable
     * @member {boolean} tabbable
     */
    @Input() tabbable: boolean = true;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Input Directive</strong>
     * Flag to show/hide pagination
     * @member {boolean} pagination
     */
    @Input() pagination: boolean = true;
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@OInput Directive</strong>
     * Event emitter for data selection
     * @member {EventEmitter} selectedData
     */
    @Output() selectedData = new EventEmitter();
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Output Directive</strong>
     * Event emitter after table data is refreshed
     * @member {EventEmitter} onRefresh
     */
    @Output() onRefresh = new EventEmitter();
    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px;">@Output Directive</strong>
     * Event emitter when data load is complete
     * @member {EventEmitter} dataLoaded
     */
    @Output() dataLoaded = new EventEmitter();

    /** Kept to avoid retrofit - Starts */
    @Input() parentPageRowIdFlag: boolean;
    @Input() paginationStyle: any;
    @Input() paginationTop: boolean;
    @Input() doTranslate: boolean = false;
    /** Kept to avoid retrofit - Ends */

    /** added to resolve the issue of avoiding refresh on blank search field */
    @Input() isRefreshDisabled: boolean = false;

    /** View child components */
    @ViewChild('errorModal') public errorModal;

    /**
     * Public Properties
     */
    /**
     * Flag to show/hide spinner
     * @member {boolean} isRequesting
     */
    public isRequesting: boolean = false;
    /**
     * Row index of focused row
     * @member {number} selectedRow
     */
    public selectedRow: number = -1;
    /**
     * Private Properties
     */
    private ajaxSource = new BehaviorSubject<any>(0);
    private ajaxSource$;
    private ajaxSubscription: Subscription;
    private errorMessage: string;
    private errorSubscription: Subscription;
    private pageAction: number = 0;
    private rowId: string = '';
    private inputParams: any;
    private pageData: any = {};
    private prevCB: Object = {
        country: '',
        business: ''
    };
    private length: number;
    private _config = this._global.AppConstants().paginationConfig;
    private defaultStartPage = this._config.defaultStartPage;
    private currentPage = this.currentPage || this._config.defaultStartPage;
    public originalData: any = {};
    private commonCellWidth: number = 10;
    private tableColumns: Array<any> = [];
    private totalConfiguredCellWidth: number = 0;
    private config: any = {
        paging: this.pagination || true,
        columns: this.columns || [],
        className: ['table-bordered']
    };
    private searchSubscription: Subscription;
    /** Unused Class Properties */
    /*public boundaryLinks = this._config.boundaryLinks;
    public directionLinks = this._config.directionLinks;
    public maxSize = 0;
    public previousText = this._config.previousText;
    public nextText = this._config.nextText;
    public firstText = this._config.firstText;
    public lastText = this._config.lastText;
    public totalItems = this.totalItems || 100;
    public paramsCopy: any = {};
    public showErrorHeader: boolean = true;
    @Input() pagination: boolean;
    @Input() paginationStyle: any;
    @Input() paginationTop: boolean;*/

    // Constructor
    constructor(
        private searchService: HttpService,
        private _global: GlobalConstant,
        private ajaxconstant: AjaxObservableConstant,
        private serviceConstant: ServiceConstants,
        private zone: NgZone,
        private translate: TranslateService,
        private authService: AuthService,
        private _logger: Logger,
        private errorService: ErrorService,
        private riExchange: RiExchange,
        private utils: Utils,
        private localeTranslateService: LocaleTranslationService,
        private elem: ElementRef,
        private globalize: GlobalizeService
    ) { }

    /******************************************************************************
     *************************** Lifecycle Hooks -Start ***************************
     ******************************************************************************/
    public ngOnInit(): void {
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
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
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
        });
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data['errorMessage']) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.searchSubscription) {
            this.searchSubscription.unsubscribe();
        }
        this.tabledata = null;
        this.rows = null;
        //this.riExchange.releaseReference(this);
    }

    public ngOnChanges(change: any): void {
        if (this.rows) {
            this.totalPage = Math.ceil(this.rows.length / this.itemsPerPage);
        }

        if (change.resetRowId && change.resetRowId.currentValue === true) {
            this.rowId = '';
        }

    }
    /************************* Lifecycle Hooks End ********************************/


    /******************************************************************************
     **************************** Public Mehtods -Start ***************************
     ******************************************************************************/
    /**
     * Executes API call and renders table
     * @method loadTableData
     * @param {any} params Table API parameters
     * @param {boolean} same Optional. Flag to set rowId nd pageData collection to blank
     * @returns {any}
     */
    public loadTableData(params: any, same?: boolean): any {
        if (!same) {
            this.rowId = '';
            this.pageData = {};
        }
        this.inputParams = params;
        let isAllSearch: boolean = false;
        if (params.columns) {
            this.config.columns = [];
            this.config.columns = params.columns;
        }
        this.columns = this.tableColumns.length ? this.tableColumns : this.columns;
        if (params.rowmetadata) {
            this.rowmetadata = params.rowmetadata;
        }
        let userCode = this.authService.getSavedUserCode();
        if (params) {
            if (!params['pageSize'] || params['pageSize'] === '') {
                params.search.set('pageSize', this._global.AppConstants().tableConfig.itemsPerPage);
            }
            /*if (!params['pageNumber'] || params['pageNumber'] === '') {
                params.search.set('pageNumber', this.page);
            }*/
        }
        let postData = {};
        /** Remove Code If Not required */
        /*this.doTranslation();
        if (this.doTranslate) { this.doTranslation(); }*/
        if (params.search.get(this.serviceConstant.CountryCode).toUpperCase() === GlobalConstant.Configuration.All.toUpperCase() || params.search.get(this.serviceConstant.BusinessCode).toUpperCase() === GlobalConstant.Configuration.All.toUpperCase()) {
            isAllSearch = true;
            if ((params.search.get(this.serviceConstant.CountryCode) === this.prevCB['country']) && (params.search.get(this.serviceConstant.BusinessCode) === this.prevCB['business'])) {
                if (this.pageData && !(Object.keys(this.pageData).length === 0 && this.pageData.constructor === Object)) {
                    postData = {
                        pageData: this.pageData
                    };
                } else {
                    postData = {};
                    this.pageData = {};
                }
            } else {
                postData = {};
                this.pageData = {};
            }
        } else {
            isAllSearch = false;
            if (this.rowId) {
                if ((params.search.get(this.serviceConstant.CountryCode) === this.prevCB['country']) && (params.search.get(this.serviceConstant.BusinessCode) === this.prevCB['business'])) {
                    params.search.set('rowid', this.rowId);
                } else {
                    this.rowId = '';
                    params.search.set('rowid', '');
                }
            } else {
                this.rowId = '';
                params.search.set('rowid', '');
            }
        }

        params.search.set('action', this.pageAction);
        this.ajaxSource.next(this.ajaxconstant.START);
        if (isAllSearch === true) {
            this.searchSubscription = this.searchService.makePostJsonRequest(params.method, params.module, params.operation, params.search, postData, 'application/json')
                .subscribe(
                (data) => {
                    this.processServiceResponse(data, params, isAllSearch);
                },
                error => {
                    this.processServiceError(error, params);
                }
                );
        } else {
            this.searchSubscription = this.searchService.makeGetRequest(params.method, params.module, params.operation, params.search)
                .subscribe(
                (data) => {
                    this.processServiceResponse(data, params, isAllSearch);
                },
                error => {
                    this.processServiceError(error, params);
                }
                );
        }
    }

    /**
     * - Clears table columns and data
     * - Call this method before adding columns
     * @method clearTable
     */
    public clearTable(): void {
        this.tableColumns = [];
        this.tabledata = [];
        this.rows = [];
    }

    /**
     * Refreshes table data
     * @method refresh
     */
    public refresh(): void {
        if (this.isRefreshDisabled) { // added to resolve the issue of avoiding refresh on blank search field
            return;
        }

        if (!this.columns.length || !this.inputParams) {
            return;
        }
        this.pageAction = 2;
        this.loadTableData(this.inputParams, true);
    }

    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px; margin: 0 5px;">New, View Only</strong>
     * - Gets alignment class for the class as passed in the column specifications
     * @method getAlignmentClass
     * @param {any} column Current column specifications
     */
    public getAlignmentClass(column: any): string {
        let alignmentClass: string = '';

        switch (column.alignment) {
            case MntConst.eAlignmentRight:
                alignmentClass = 'text-right';
                break;
            case MntConst.eAlignmentLeft:
                alignmentClass = 'text-left';
                break;
        }

        return alignmentClass;
    }

    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px; margin: 0 5px;">New</strong>
     *  - Adds a single table field
     *  - Can be used almost the same line of code from legacy VB Code
     *  - Recommended to use TableComponent.clearTable() before using it
     * @method AddTableField
     * @param {string} name Name of the field
     * @param {string} type Optional. Type of the field; Use from MntConst; Defaults to MntConst.eTypeText
     * @param {string} required Optional. Key/Required; Ignored for now
     * @param {string} title Optional. Title to be displayed. Defaults to name
     * @param {string} size Optional. Size of the field in percentage; Defaults to 10
     * @param {string} alignment Optional. Alignment of the field; Use from MntConst; Defaults to MntConst.eAlignmentCenter
     * @example
     * TableComponent.clearTable()
     * TableComponent.AddTableField('AccountName', MntConst.eTypeText, 'Required', 'Account Name', 40)
     */
    public AddTableField(name: string, type?: string, required?: string, title?: string, size?: number, alignment?: string): void {
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
    }

    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px; margin: 0 5px;">New</strong>
     * - Adds multiple columns in the table
     * - Internally calls TableComponent.AddTableField for each element in Array
     * - Can be used almost the same parameters as passed in the legacy VB application, but in a form of Array
     * - Recommended to call TableComponent.clearTable() before calling this
     * @method AddTableFields
     * @param {string[][]} columns Collection of all columns
     * @example
     * TableComponent.AddTableFields([
     *  ['CountryCode', MntConst.eTypeText, 'Key', 'Country', '9', MntConst.eAlignmentRight],
     *  ['BusinessCode', MntConst.eTypeText, 'Key', 'Bus', '9']
     * ]);
     */
    public AddTableFields(columns: Array<Array<string>>): void {
        columns.forEach((column: Array<string>) => {
            this.AddTableField(
                column[0],
                column[1] || '',
                column[2] || '',
                column[3] || '',
                column[4] ? parseFloat(column[4]) : 0,
                column[5] || ''
            );
        });
    }

    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px; margin: 0 5px;">New, View Only</strong>
     * - Get cell width calculating the total size specified for all the fields
     * @method getCellWidth
     * @param {number} size Calculated size of the field
     * @returns {number}
     */
    public getCellWidth(size: number): number {
        return (size / this.totalConfiguredCellWidth) * 100;
    }

    /**
     * <strong style="font-weight: bold; color: red; font-style: italic; border: 1px solid red; border-radius: 5px; padding: 5px; margin: 0 5px;">New, View Only</strong>
     * - Formats data based on the type passed
     * - If type is not passed then returns data as received
     * @method formatData
     * @param {any} row One data row of the table
     * @param {any} column Column specification for the column
     * @returns {string}
     */
    public formatData(row: any, column: any): string {
        let formattedData: any = '',
            rawData: string = '',
            type: string = column.type,
            method: string;

        rawData = row[column.name];
        if (rawData === undefined || rawData === null || rawData === '') {
            return rawData;
        }
        if (!type) {
            return rawData;
        }

        /*method = type.replace('eType', 'to');

        if (StaticUtils.ConversionHelper[method]) {
            formattedData = StaticUtils.ConversionHelper[method](rawData);
            return formattedData;
        }*/

        switch (type) {
            case MntConst.eTypeCode:
                formattedData = rawData.toString().toUpperCase();
                break;
            case MntConst.eTypeTextFree:
                formattedData = this.utils.toTitleCase(rawData.toString());
                break;
            case MntConst.eTypeText:
                formattedData = rawData;
                break;
            case MntConst.eTypeInteger:
                formattedData = this.globalize.formatIntegerToLocaleFormat(rawData);
                break;
            case MntConst.eTypeDecimal1:
                formattedData = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(rawData), 1);
                break;
            case MntConst.eTypeDecimal2:
                formattedData = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(rawData), 2);
                break;
            case MntConst.eTypeDecimal3:
                formattedData = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(rawData), 3);
                break;
            case MntConst.eTypeDecimal4:
                formattedData = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(rawData), 4);
                break;
            case MntConst.eTypeDecimal5:
                formattedData = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(rawData), 5);
                break;
            case MntConst.eTypeDecimal6:
                formattedData = this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(rawData), 6);
                break;
            case MntConst.eTypeCurrency:
                formattedData = this.globalize.formatCurrencyToLocaleFormat(this.utils.decimalFaultTolerance(rawData));
                break;
            case MntConst.eTypeTime:
                formattedData = this.globalize.formatTimeToLocaleFormat(rawData);
                break;
            case MntConst.eTypeDate:
                formattedData = this.globalize.formatDateToLocaleFormat(rawData);
                break;
            case MntConst.eTypeDateText:
                formattedData = this.globalize.formatDateToLocaleFormat(rawData);
                break;
            case MntConst.eTypeCheckBox:
                formattedData = this.getCheckboxHTML(rawData);
                break;
            case MntConst.eTypeImage:
                formattedData = this.getImageHTML(rawData);
                break;
        }
        return formattedData || rawData;
    }

    /**
     * Navigation to first page
     * @method firstPage
     * @param {any} $event Optional. DOM event
     */
    public firstPage($event?: any): void {
        if ($event && $event.preventDefault) {
            $event.preventDefault();
        }
        if (this.isRefreshDisabled) { // added to resolve the issue of avoiding refresh on blank search field
            return;
        }
        this.page = 1;
        this.pageAction = 0;
        this.loadTableData(this.inputParams, true);
        this.resetAction();
    }

    /**
     * Navigation to previous page
     * @method prevPage
     * @param {any} $event Optional. DOM event
     */
    public prevPage($event?: any): void {
        if ($event && $event.preventDefault) {
            $event.preventDefault();
        }
        if (this.isRefreshDisabled) { // added to resolve the issue of avoiding refresh on blank search field
            return;
        }
        this.page -= 1;
        this.pageAction = 1;
        this.loadTableData(this.inputParams, true);
        this.resetAction();
    }

    /**
     * Navigation to next page
     * @method nextPage
     * @param {any} $event Optional. DOM event
     */
    public nextPage($event?: any): void {
        if ($event && $event.preventDefault) {
            $event.preventDefault();
        }
        if (this.isRefreshDisabled) { // added to resolve the issue of avoiding refresh on blank search field
            return;
        }
        this.page += 1;
        this.pageAction = 3;
        this.loadTableData(this.inputParams, true);
        this.resetAction();
    }

    /**
     * Navigation to last page
     * @method lastPage
     * @param {any} $event Optional. DOM event
     */
    public lastPage($event?: any): void {
        if ($event && $event.preventDefault) {
            $event.preventDefault();
        }
        if (this.isRefreshDisabled) { // added to resolve the issue of avoiding refresh on blank search field
            return;
        }
        this.page = this.totalPage;
        this.pageAction = 4;
        this.loadTableData(this.inputParams, true);
        this.resetAction();
    }

    /**
     * - Changes page based on the pagination control clicked
     * - If no arguement passed takes the whole table data
     * - Avoid calling this from other components
     * @method changePage
     * @param {any[]} data Table data
     */
    public changePage(data: Array<any> = this.tabledata): void {
        this.page = this.page || 1;

        if (this.page > this.totalPage) {
            this.page = 1;
        }

        if (this.rowmetadata) { this.selectImg(data); }
        this.rows = data;
    }
    /************************* Public Methods End *********************************/

    /******************************************************************************
     **************************** Private Mehtods -Start **************************
     ******************************************************************************/
    /**
     * Method to process service response and display data in table
     * @private
     * @method processServiceResponse
     * @param data - Response data
     * @param params - URL search params
     * @param isAllSearch - Flag to set unset rowId
     * @return void
     */
    private processServiceResponse(data: any, params: any, isAllSearch: boolean): void {
        if (data.records) {
            if (this.dataLoaded) {
                this.dataLoaded.emit({
                    value: 'loaded',
                    tableData: data //added to chceck the table is blank or not
                });
            }

            this.originalData = data;
            this.tabledata = data.records;
            let rows = [], rowObj = {};
            for (let i = 0; i < this.tabledata.length; i++) {
                for (let key in this.tabledata[i]) {
                    if (key) {
                        let splitKey = key.split('.');
                        rowObj[splitKey[splitKey.length - 1]] = this.tabledata[i][key];
                    }
                }
                rows.push(JSON.parse(JSON.stringify(rowObj)));
                rowObj = {};
            }
            if (isAllSearch === true) {
                if (data['pageData'].length > 0) {
                    data['pageData'].forEach((v: any) => {
                        v['rowId'] = v['rowid'];
                        delete v.rowid;
                        delete v.numResults;
                    });
                    this.pageData = this.toCamelCase(data['pageData']);
                } else {
                    this.pageData = data['pageData'];
                }

            } else {
                if (data['pageData']) {
                    if (data['pageData'] instanceof Array) {
                        this.rowId = data['pageData'][0].rowid ? data['pageData'][0].rowid : '';
                    } else if (data['pageData'].rowid) {
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
                for (let i = 0; i < this.tabledata.length; i++) {
                    /*if (this.tabledata[i]['APIRateEffectDate'] !== undefined && this.tabledata[i]['APIRateEffectDate'] !== null) {
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
                    if (this.tabledata[i]['riBPSNextDate'] !== undefined && this.tabledata[i]['riBPSNextDate'] !== null) {
                        if (this.isDate(this.tabledata[i]['riBPSNextDate'])) {
                            this.tabledata[i]['riBPSNextDate'] = this.formatDate(this.tabledata[i]['riBPSNextDate']);
                        }
                    }
                    if (this.tabledata[i]['riBPSNextTime'] !== undefined && this.tabledata[i]['riBPSNextTime'] !== null) {
                        if (this.isDate(this.tabledata[i]['riBPSNextDateTime'])) {
                            this.tabledata[i]['riBPSNextTime'] = this.utils.secondsToHms(this.tabledata[i]['riBPSNextTime']);
                        }
                    }*/
                }
                this.totalPage = Math.ceil(this.length / this.itemsPerPage);
                this.onChangeTable(this.config);
                this.selectImg(this.tabledata);
                this.changePage();
            } else {
                this.rows = [];
                this.totalPage = 0;
                this.page = 1;
                setTimeout(() => {
                    this.length = 1;
                }, 200);
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        }
        else {
            //added to handle the error response
            this.processServiceError(data, params);
        }
    }

    /**
     * Converts text to camel case and returns the value
     * @private
     * @method toCamelCase
     * @param param - String to be converted
     * @return any
     */
    private toCamelCase(param: any): any {
        let newO, origKey, newKey, value;
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
        } else {
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
    }

    /**
     * Process the error respponse and displays error modal
     * @private
     * @method processServiceError
     * @param data - Error response data
     * @param params - URL search params
     * @return void
     */
    private processServiceError(data: any, params: any): void {
        this.dataLoaded.emit({
            value: 'failed',
            tableData: data
        });
        // this.errorMessage = error as any;
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        if (this.displayError) {
            this.errorService.emitError({
                errorMessage: ErrorConstant.Message.TableFetchError + ' Method - ' + params.method + ' Module - ' + params.module + ' Operation - ' + params.operation
            });
        }
    }

    /**
     * Updates table data collection with the metadata provided
     * @private
     * @method selectImg
     * @param data - Table data
     * @return void
     */
    private selectImg(data: Array<any> = this.tabledata): void {
        for (let key in data) {
            if (!data.hasOwnProperty(key)) continue;
            let obj = data[key];
            for (let prop in obj) {
                if (!obj.hasOwnProperty(prop)) continue;
                if (prop) {
                    obj[prop] = this.selectmetaprop(prop, obj[prop]);
                }
            }
        }
    }

    /**
     * Selects image based on the meta property
     * @private
     * @method selectmetaprop
     * @param prop - Property name
     * @param propvalue - Property value
     * @return string
     */
    private selectmetaprop(prop: string, propvalue: any): string {
        if (propvalue !== null && propvalue !== 'undefined') {
            for (let i = 0; i < this.rowmetadata.length; i++) {
                if (prop === this.rowmetadata[i].name) {
                    if (this.rowmetadata[i].type === 'img') {
                        let columncontent = ((propvalue.toString().toUpperCase() === 'TRUE') ||
                            (propvalue.toString().toUpperCase().indexOf('/assets/images/tick-icon.png'.toUpperCase()) !== -1)) ?
                            '<div class="text-center"><img src="/assets/images/tick-icon.png" class="tick"></div>' : '<div class="text-center"><img src="/assets/images/cross-icon.png" class="cross-tick"></div>';
                        return columncontent;
                    }
                }
            }
        }
        return propvalue;
    }

    /**
     * Sets action for API call
     * @private
     */
    private onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        if (config.columns && config.columns.length > 0) {
            this.columns = config.columns.length ? config.columns : this.columns;

        }
        this.rows = this.tabledata;

        if (this.pageAction === 0) {
            this.page = 1;
            this.length = (this.page * this.itemsPerPage) + (this.itemsPerPage * 2);
        } else if (this.pageAction === 1 || this.pageAction === 3) {
            this.length = (this.page * this.itemsPerPage) + (this.itemsPerPage * 2);
        } if (this.pageAction === 4) {
            this.length = (this.page * this.itemsPerPage);
        }

        /*if (this.originalData['pageData'] && this.originalData['pageData'].numResults) {
            this.length = parseInt(this.originalData['pageData'].numResults, 10);
        } else {
            this.length = (this.page * this.itemsPerPage) + (this.itemsPerPage);
        }*/
    }

    /**
     * Sets focus in row at the passed index
     * @private
     * @method focusRow
     * @param index - Row index to set focus to
     * @return void
     */
    private focusRow(index: number): void {
        if (index < 0 || index >= this.itemsPerPage) {
            return;
        }
        this.selectedRow = index;
        let clickedElem: any = this.elem.nativeElement.querySelector('table tbody tr:nth-child(' + (index + 1) + ')');
        clickedElem.focus();
    }

    /*
    private formatDate(date: any): any {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }


    private isDate(date: any): any {
        return ((new Date(date).toString() !== 'Invalid Date'));
    }*/

    /**
     * Gets HTML for checkbox type fields; Shows tick or cross icons
     * @private
     * @method getCheckboxHTML
     * @param value - Field value
     * @return string
     */
    private getCheckboxHTML(value: any): string {
        let checkedHTML: string = '<div class="text-center"><img src="/assets/images/tick-icon.png" class="tick"></div>';
        return value ? checkedHTML : '<div class="text-center"><img src="/assets/images/cross-icon.png" class="cross-tick"></div>';
    }

    /**
     * Returns HTML for image as obtained in response
     * @private
     * @method getImageHTML
     * @param value - Field value
     * @return string
     */
    private getImageHTML(value: string): string {
        return '<div class="text-center"><img src="' + StaticUtils.c_s_IMAGE_REPO_URL + value + '" title="' + value + '"></div>';
    }
    /************************* Private Methods End *********************************/

    /******************************************************************************
     ************************* Event Handlers - Start *****************************
     ******************************************************************************/
    /**
     * - Executed on cell click
     * - Emits selectedData event to pass data to parent component
     * - CALLED FROM VIEW; AVOID CALLING FROM OUTSIDE THE COMPONENT
     * @method onCellClick
     * @param index - Index of the row
     * @param $event - Optional. DOM event
     * @return void
     */
    public onCellClick(index: number, $event?: any): void {
        let data: any = {};
        let clickedElem: any;
        if ($event) {
            $event.preventDefault();
        }
        this.focusRow(index);
        data['row'] = this.rows[index];
        this.selectedRow = -1;
        this.selectedData.emit(data);
    }

    /**
     * - Executed on keyup on rows
     * - Currently it works for
     *  - Tab - Focus goes to next row
     *  - Up Arrow - Focus goes to previous row
     *  - Down Arrow - Focus goes to next row
     *  - Enter - Emits selectedData emitter and passes data to parent data
     * - CALLED FROM VIEW; AVOID CALLING FROM OUTSIDE THE COMPONENT
     * @method onKeyUp
     * @param index - Index of the row
     * @param $event - Optional. DOM event
     * @return void
     */
    public onKeyUp(index: number, $event?: any): void {
        switch ($event.keyCode) {
            case 9: //tab
                this.focusRow(index);
                break;
            case 40: //down arrow
                this.focusRow(index + 1);
                break;
            case 38: //up arrow
                this.focusRow(index - 1);
                break;
            case 13: //enter
                this.onCellClick(index);
                break;
        }
    }
    /************************** Event Handlers - End ******************************/

    /******************************************************************************
     ***************************** Methods not used  ******************************
     ******************************************************************************/
    public onPageChange(event: any): void {
        if (event.page > this.page) {
            if (event.page - this.page === 1) {
                this.pageAction = 3;
            } else {
                this.pageAction = 4;
            }
        } else if (event.page < this.page) {
            if (this.page - event.page === 1) {
                this.pageAction = 1;
                setTimeout(() => {
                    this.page = event.page + 1;
                    this.onRefresh.emit();
                }, 0);
                return;
            } else {
                this.pageAction = 0;
            }
        } else {
            this.pageAction = 2;
        }
        this.onRefresh.emit();
    }

    public resetAction(): void {
        setTimeout(() => {
            this.pageAction = 2;
        }, 100);
    }

    /**
     * If doTranslate flag is set to true this method is called to get the translated values
     */
    private doTranslation(): void {
        if (this.columns) {
            for (let column in this.columns) {
                if (column) {
                    let obj = this.columns[column];
                    this.getTranslatedValue(obj.title, null).then((res: string) => {
                        if (res) { obj.title = res; }
                    });
                }
            }
        }
        if (this.config.columns) {
            for (let column in this.config.columns) {
                if (column) {
                    let obj = this.config.columns[column];
                    this.getTranslatedValue(obj.title, null).then((res: string) => {
                        if (res) { obj.title = res; }
                    });
                }
            }
        }
    }

    /**
     * Gets translation from file
     */
    private getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params }).toPromise();
        } else {
            return this.translate.get(key).toPromise();
        }
    }
    /******************************************************************************/
}
