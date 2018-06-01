import { Logger } from '@nsalaun/ng2-logger';
import { GridColumnComponent } from './grid-cell';
import { MntConst } from './../../services/riMaintenancehelper';
import { Component, OnInit, OnDestroy, AfterViewChecked, EventEmitter, Output, ElementRef, Renderer, HostListener, ViewChild } from '@angular/core';
/**
 * Created - 17/05/2017
 * Component - riGrid Component
 * Usage - This component is use to display grid in your pages
 */

@Component({
    selector: 'icabs-grid-advanced',
    templateUrl: 'grid-advanced.html'
})

export class GridAdvancedComponent implements AfterViewChecked {
    @ViewChild('gridcell') gridCell: GridColumnComponent;

    @Output() public onSuccess = new EventEmitter();
    @Output() public TRClick = new EventEmitter();
    @Output() public TRDblClick = new EventEmitter();
    @Output() public headerClick = new EventEmitter();
    @Output() public bodyClick = new EventEmitter();
    @Output() public bodyDblClick = new EventEmitter();
    @Output() public bodyKeyDown = new EventEmitter();
    @Output() public columnLookUpRequested = new EventEmitter();
    @Output() public bodyColumnFocus = new EventEmitter();
    @Output() public bodyColumnBlur = new EventEmitter();

    /**
     * Private variables
     */
    private tempArray: Array<any> = [];
    private totalColSize: number = 0;
    private clickEvent: any;;

    private strColumnName: string;
    private strColumnValue: any;
    private nCurRow: number = 0;
    private nCurCell: number = 0;
    private strBorderColor: string;
    private strTextColor: string;
    private bFunctionUpdateSupport: boolean = false;
    private bFunctionPaging: boolean = false;
    private bFixedWidth: boolean = false;
    private bFunctionTabSupport: boolean = false;
    private bHighlightBar: boolean = false;
    private bHidePageNumber: boolean = false;
    private nMode: string = MntConst.eModeNormal;
    private strHeaderClickedColumn: string = '';
    private bDescendingSort: boolean = true;
    private nPageSize: number;
    private strRowID: string;
    private nStartColumn: number = -1;
    private nStartRow: number = -1;
    private bUpdate: boolean = false;
    private bUpdateHeader: boolean = true;
    private bUpdateBody: boolean = true;
    private bUpdateFooter: boolean = true;
    private bUpdateRow: boolean = false;
    private loadingGrid: boolean = false;
    private headerData: Array<any> = [];
    private bodyData: Array<any> = [];
    private footerData: Array<any> = [];
    public previousValues: Array<any> = [];

    /**
     * Public Variables
     */
    public tableTitle;
    public currentPage;
    public totalPages;
    public gridHead;
    public gridBody;
    public gridFooter;
    public colArray: Array<any> = [];
    public headerArray: Array<any> = [];
    public bodyArray: Array<any> = [];
    public footerArray: Array<any> = [];
    public Enable: boolean = true;
    public HTMLCellIndex: number = 0;
    public widthType: string = 'width';

    constructor(public el: ElementRef, public rendrer: Renderer, public logger: Logger) {

    }

    public ngAfterViewChecked(): void {
        if (this.HTMLGridHeader && this.loadingGrid) {
            this.loadingGrid = false;
            this.onSuccess.emit();
        }

    }

    /**************************************** Grid Properties**********************************************/
    /**
     * @description Current cell selected columnname
     */
    public get CurrentColumnName(): string {
        return this.strColumnName;
    }
    public set CurrentColumnName(value: string) {
        this.strColumnName = value;
    }


    /**
     * (@description) Current Cell selected value
     */
    public get CurrentColumnValue(): any {
        return this.strColumnValue;
    }
    public set CurrentColumnValue(value: any) {
        this.strColumnValue = value;
    }

    /**
     * (@description) Holds the current row number.
     */
    public get CurrentRow(): number {
        return this.nCurRow;
    }
    public set CurrentRow(value: number) {
        this.nCurRow = value;
    }

    /**
     * (@description) Holds the current row number.
     */
    public get CurrentCell(): number {
        return this.nCurCell;
    }
    public set CurrentCell(value: number) {
        this.nCurCell = value;
    }

    /**
     * (@description) Changes default border color.
     */
    public set DefaultBorderColor(value: string) {
        if (value) {
            this.strBorderColor = '2px solid #' + value;
        }
    }

    /**
     * (@description) Changes default text color.
     */
    public set DefaultTextColor(value: string) {
        if (value) {
            this.strTextColor = '#' + value;
        }
    }

    /**
     * (@description) If set to true then the First, Last, Next and Previous buttons will be displayed where apropeate.
     */
    /*public get FunctionPaging(): boolean {
        return;
    }*/
    public set FunctionPaging(value: boolean) {
        this.bFunctionPaging = value;
    }

    public get FunctionPaging(): boolean {
        return this.bFunctionPaging;
    }

    /**
     * (@description) Checks if Grid is Updatable or not
     */
    public set FunctionUpdateSupport(value: boolean) {
        this.bFunctionUpdateSupport = value;
    }

    public get FunctionUpdateSupport(): boolean {
        return this.bFunctionUpdateSupport;
    }

    /**
     * (@description) Checks if Grid Row Selction can change using UP/DOWN arrown Keys
     */
    public set FunctionTabSupport(value: boolean) {
        this.bFunctionTabSupport = value;
    }

    public get FunctionTabSupport(): boolean {
        return this.bFunctionTabSupport;
    }

    /**
     * (@description) Checks for HeaderClicked column
     */
    public set HeaderClickedColumn(value: string) {
        this.strHeaderClickedColumn = value;
        if (value === '') {
            this.DescendingSort = !this.DescendingSort;
        }
        else if (this.GetColumnByName(value).columnBiDirectionalSort) {
            if (value !== '') {
                this.DescendingSort = !this.DescendingSort;
            } else {
                this.DescendingSort = false;
            }
        } else {
            this.DescendingSort = false;
        }
    }

    public get HeaderClickedColumn(): string {
        return this.strHeaderClickedColumn;
    }

    public set DescendingSort(value: boolean) {
        this.bDescendingSort = value;
    }

    public get DescendingSort(): boolean {
        return this.bDescendingSort;
    }


    /**
     * (@description) If true a row will be highlighted on hover.
     */
    public set HighlightBar(value: boolean) {
        this.bHighlightBar = value;;
    }

    public get HighlightBar(): boolean {
        return this.bHighlightBar;
    }

    /**
     * (@description) If false, page number is not displayed.
     */
    public set HidePageNumber(value: boolean) {
        this.bHidePageNumber = value;;
    }

    public get HidePageNumber(): boolean {
        return this.bHidePageNumber;
    }

    /*public get FunctionPaging(): boolean {
        return;
    }*/
    public set FixedWidth(value: boolean) {
        this.bFixedWidth = value;
    }

    public get FixedWidth(): boolean {
        return this.bFixedWidth;
    }

    /**
     * (@description) Grid ooperational Mode.
     */
    public get Mode(): string {
        return this.nMode;
    }

    public set Mode(value: string) {
        this.nMode = value;
    }

    /**
     * (@description) Sets the max rows of GridComponent
     */
    public get PageSize(): number {
        return this.nPageSize;
    }

    public set PageSize(value: number) {
        this.nPageSize = value;
    }

    /**
     *
     */
    public get RowID(): string {
        return this.strRowID;
    }
    public set RowID(value: string) {
        this.strRowID = value;
    }

    /**
     * Grid Update Section Properties
     */
    public get Update(): boolean {
        return this.bUpdate;
    }
    public set Update(value: boolean) {
        this.bUpdate = value;
    }

    public get UpdateHeader(): boolean {
        return this.bUpdateHeader;
    }
    public set UpdateHeader(value: boolean) {
        this.bUpdateHeader = value;
    }

    public get UpdateBody(): boolean {
        return this.bUpdateBody;
    }
    public set UpdateBody(value: boolean) {
        this.bUpdateBody = value;
    }

    public get UpdateFooter(): boolean {
        return this.bUpdateFooter;
    }
    public set UpdateFooter(value: boolean) {
        this.bUpdateFooter = value;
    }

    public get UpdateRow(): boolean {
        return this.bUpdateRow;
    }
    public set UpdateRow(value: boolean) {
        this.bUpdateRow = value;
    }

    public get StartColumn(): number {
        return this.nStartColumn;
    }
    public set StartColumn(value: number) {
        this.nStartColumn = value;
    }

    public get StartRow(): number {
        return this.nStartRow;
    }
    public set StartRow(value: number) {
        this.nStartRow = value;
    }

    public get HTMLGridHeader(): any {
        let gridTable = this.el.nativeElement.children[0];
        if (gridTable.children[0]) {
            return gridTable.children[0];
        }

        return null;
    }

    public get HTMLGridBody(): any {
        let gridTable = this.el.nativeElement.children[0];
        if (gridTable.children[1]) {
            return gridTable.children[1];
        }

        return null;
    }

    public get HTMLGridFooter(): any {
        let gridTable = this.el.nativeElement.children[0];
        if (gridTable.children[2]) {
            return gridTable.children[2];
        }

        return null;
    }

    public get CurrentHTMLRow(): any {
        let gridTable = this.el.nativeElement.children[0];
        let gridRow;

        if (gridTable.children[1]) {
            let gridBody = gridTable.children[1];
            gridRow = gridBody.children[this.CurrentRow];
        }

        return gridRow;
    }

    public get CurrentHTMLCell(): any {
        let gridTable = this.el.nativeElement.children[0];
        let gridBody, gridRow, gridCell;

        if (gridTable.children[1]) {
            let gridBody = gridTable.children[1];
            gridRow = gridBody.children[this.CurrentRow];
            gridCell = gridRow.children[this.CurrentCell];
        }

        return gridCell;
    }

    /**
     * Resets the mode to initial mode
     */
    public RefreshRequired(): void {
        this.UpdateHeader = true;
        this.UpdateBody = true;
        this.UpdateFooter = true;
    }

    /**
     * Resets Grid to normal stage without data
     */
    public ResetGrid(): void {
        this.headerArray = [];
        this.bodyArray = [];
        this.footerArray = [];
    }

    public get SortOrder(): string {
        let order = 'Descending';
        if (!this.DescendingSort) {
            order = 'Ascending';
        }
        return order;
    }

    /**************************************** Grid Procedures**********************************************/
    /**
     *
     * @param strColumnName: This is the name that will be used for all access to the column.
     * @param strColumnInputID: This sets the ID attribute that will be used while generating the HTML output of the grid.
     * @param strColumnInputName: This sets the ID attribute that will be used while generating the HTML output of the grid.
     * @param eColumnType: This set the data type of the column and controls how it will be displayed. Incorrect data types may result in errors when exporting the grid.
     * @param intColumnSize: This sets the initial width of the column.
     * (optional)
     * @param blnColumnDrillDown: If true and a valid RowID is provided in the data then this enables a drill down on this column. The mouse pointer will change to hand when over this column and a click event can be raised.
     * @param strColumnDescription: This provided an alterative text description of the column and will be used as the default tool tip for this column.
     *
     * @description
     * This method is used to describe a new column to riGrid.
     *
     * {@example: this.riGrid.AddColumn("InvoiceNumber","Site","InvoiceNumber",eTypeInteger,2) }
     */
    public AddColumn(strColumnName: string, strColumnInputID: string, strColumnInputName: string, eColumnType: MntConst, intColumnSize: number, blnColumnDrillDown?: boolean, strColumnDescription?: string): void {
        let column: Object = {
            columnName: strColumnName,
            columnInputID: strColumnInputID,
            columnInputName: strColumnInputName,
            columnType: eColumnType,
            columnSize: intColumnSize,
            columnAlign: 'left'
        };
        if (blnColumnDrillDown) {
            column['columnDrillDown'] = blnColumnDrillDown;
        }
        if (strColumnDescription) {
            column['columnDescription'] = strColumnDescription;
        }
        this.totalColSize += intColumnSize;
        this.tempArray.push(column);
    }

    /**
     *
     * @param strColumnName: This contains the name of the column to have it's alignment adjusted.
     * @param eColumnAlign: Specifies the alignment to set.
     *
     * @description
     * This method sets the alignment of an existing column.
     * This function must be called after the column is added but before the Complete method is called.
     *
     * {@example: this.riGrid.AddColumnAlign("InvoiceNumber",'Right') }
     */
    public AddColumnAlign(strColumnName: string, eColumnAlign: string): void {
        for (let i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnAlign = eColumnAlign;
            }
        }
    }

    /**
     * @param strColumnName: This contains the name of the column to be adjusted.
     * @param NoWrap(optional): TDefault is True. If true then the column body will not word wrap.
     *
     * @description
     * This method turns off the automatic word wrap of the column body text.
     *
     * {@example: this.riGrid.AddColumnNoWrap("SiteName",true)
     */
    public AddColumnNoWrap(strColumnName: string, NoWrap?: boolean): void {
        for (let i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].noWrap = NoWrap;
            }
        }
    }

    /**
     *
     * @param strColumnName: This contains the name of the column to be adjusted.
     * @param blnColumnOrderable: If true the column header can be clicked on to sort the column.
     * @param blnBiDirectionalSort(optional): Default is False. If true a sorted column can be clicked on multiple times.
     *
     * @description
     * This method sets the orderable attribute of a column. Orderable columns can have their headers clicked and this will report back to the backend data.
     * BiDirectionSort columns can be clicked on multiple times to reverse the direction of the sort.
     *
     * {@example: this.riGrid.AddColumnOrderable("IncidentNumber",True) }
     */
    public AddColumnOrderable(strColumnName: string, blnColumnOrderable: boolean, blnBiDirectionalSort?: boolean): void {
        for (let i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnOrderable = blnColumnOrderable;
                this.tempArray[i].columnBiDirectionalSort = false;
                if (blnBiDirectionalSort) {
                    this.tempArray[i].columnBiDirectionalSort = blnBiDirectionalSort;
                }
            }
        }
    }

    /**
     * @param strColumnName: This contains the name of the column to be adjusted.
     * @param blnColumnRequired: Sets or resets the required flag for the given column.
     *
     * @description
     * This method sets the required flag for a column.
     *
     * {@example: this.riGrid.AddColumnRequired("SiteName",true)
     */
    public AddColumnRequired(strColumnName: string, blnColumnRequired: boolean): void {
        for (let i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnRequired = blnColumnRequired;
            }
        }
    }

    /**
     * @param strColumnName: This contains the name of the column to be adjusted.
     * @param blnScreen: Set if this column will appear on the screen..
     *
     * @description
     * This method controls is a column will be included on the screen.
     * The default for a column is to be included in on the screen.
     *
     * {@example: this.riGrid.AddColumnScreen("SiteName",true)
     */
    public AddColumnScreen(strColumnName: string, blnScreen: boolean): void {
        for (let i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                if (!blnScreen) {
                    this.tempArray.splice(i, 1);
                }
            }
        }
    }

    /**
     * @param strColumnName: This contains the name of the column to be adjusted.
     * @param blnColumnTabSupport: Determines if the column tab support.
     *
     * @description
     * This method turns on tab support for a column.
     *
     * {@example: this.riGrid.AddColumnTabSupport("SiteName",true)
     */
    public AddColumnTabSupport(strColumnName: string, blnColumnTabSupport: boolean): void {
        for (let i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnTabSupport = blnColumnTabSupport;
            }
        }
    }

    /**
     * @param strColumnName: This contains the name of the column to be adjusted.
     * @param blnColumnTabSupport: Determines if the column tab support.
     *
     * @description
     * This method allows a column to be updated by the user.
     * Grid row updates will be passed to the backend progress code with a riGridMode set to 3 for updates.
     *
     * {@example: this.riGrid.AddColumnUpdateSupport("SiteName",true)}
     */
    public AddColumnUpdateSupport(strColumnName: string, blnColumnUpdateSupport: boolean): void {
        for (let i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnUpdateSupport = blnColumnUpdateSupport;
            }
        }
    }

    /**
     *
     * @param strColumnName
     * @param component
     * @param returnObjectName
     *
     * @description
     * This add ellipsis functionality
     */
    public AddEllipsisControl(strColumnName: string, ellipsisComponent: any, returnObjectName: string): void {
        for (let i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                let ellipsisObj = ({
                    component: ellipsisComponent,
                    returnObject: returnObjectName
                });
                this.tempArray[i].ellipsis = ellipsisObj;
            }
        }
    }

    /**
     *
     * @param strColumnName
     * @param objData
     * @param strValueName
     * @param strDescName
     * @param blnDisabled
     * @param blnRequired
     */
    public AddDropDownData(strColumnName: string, objData: any, strValueName: string, strDescName: string, blnDisabled?: boolean, blnRequired?: boolean): void {
        for (let i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                let dropDownObj = ({
                    value: strValueName,
                    desc: strDescName,
                    dataObject: objData,
                    isDisabled: blnDisabled ? blnDisabled : false,
                    isRequired: blnRequired ? blnRequired : false
                });
                this.tempArray[i].dropdown = dropDownObj;
            }
        }
    }

    /**
     * @description
     * This method resets the current grid and allow the user to rebuild a new grid.
     */
    public Clear(): void {
        this.colArray = [];
        this.tempArray = [];
        this.ResetGrid();
    }

    /**
     * @description
     * This method finishes the build of the current grid. Calling this function will finalize all columns and display the grid without data.
     * This method must be called before the user can access any of the interface options.
     */
    public Complete(): void {
        this.colArray = Array.from(this.tempArray);
        this.tempArray = null;
        this.CalculateColumnWidth();
    }

    /**
     * @description
     * This method disables all the riGrid buttons
     */
    public DisableButtons(): void {
        //TODO
    }

    /**
     * @description
     * This method enables all valid riGrid buttons
     */
    public EnableButtons(): void {
        //TODO
    }

    /**
     * @param objData: This contains the name of the column to be adjusted.
     *
     * @description
     * This method executes the grid, calling the backend progress code and displaying the results.
     */
    public Execute(objData: any): void {
        let chunk = this.colArray.length;
        this.loadingGrid = true;
        try {
            if (objData.pageData) {
                this.currentPage = objData.pageData.pageNumber;
                this.totalPages = objData.pageData.lastPageNumber;
            }

            if (this.Update) {
                if (this.UpdateBody) {
                    if (objData.body && objData.body.cells && objData.body.cells.length > 0) {
                        let bodyData = objData.body.cells;
                        if (chunk > 0) {
                            for (let i = this.StartColumn, j = bodyData.length; i < j; i += chunk) {
                                this.bodyArray[this.StartRow] = bodyData.slice(i, i + chunk);
                            }
                        }
                    }
                    this.UpdateBody = false;
                }
                this.Update = false;
            }
            else {
                if (this.UpdateHeader) {
                    this.headerArray = [];
                    if (objData.header && objData.header.cells && objData.header.cells.length > 0) {
                        let headerData = objData.header.cells;
                        let spancounter = 0, colspan, startIndex = 0;

                        if (objData.header.title[0].title) {
                            this.tableTitle = objData.header.title[0].title;
                        }

                        for (let k = 0; k < headerData.length; k++) {
                            colspan = headerData[k].colSpan;
                            headerData[k].colObject = {};
                            spancounter += colspan;
                            if (spancounter === chunk) {
                                if (k + 1 === headerData.length) {
                                    for (let i = 0; i < this.colArray.length; i++) {
                                        headerData[k].colObject = this.colArray[i];
                                    }
                                }

                                this.headerArray.push(headerData.slice(startIndex, k + 1));
                                startIndex = k + 1;
                                spancounter = 0;
                            };
                        }
                    }
                    this.UpdateHeader = false;
                }

                if (this.UpdateBody) {
                    this.bodyArray = [];
                    if (objData.body && objData.body.cells && objData.body.cells.length > 0) {
                        let bodyData = objData.body.cells;
                        let rCounter = -1;
                        let dummyElement = '';

                        if (chunk > 0) {
                            for (let i = 0, j = bodyData.length; i < j; i += chunk) {
                                let bodylength = bodyData.slice(i, i + chunk).length;
                                if (bodylength < chunk) {
                                    for (let k = bodylength; k < chunk; k++) {
                                        let newObj = {
                                            additionalData: '',
                                            backgroundColor: '',
                                            borderColor: '',
                                            cellColor: '',
                                            colSpan: 1,
                                            drillDown: false,
                                            imageHeight: null,
                                            imageWidth: null,
                                            rowID: '',
                                            text: '',
                                            textColor: '',
                                            toolTip: ''
                                        };
                                        bodyData.push(newObj);
                                    }
                                }
                                ++rCounter;
                                this.bodyArray.push(bodyData.slice(i, i + chunk));
                            }
                        }
                    }
                    this.UpdateBody = false;
                }

                if (this.UpdateFooter) {
                    this.footerArray = [];
                    if (objData.footer && objData.footer.rows && objData.footer.rows.length > 0) {
                        this.footerArray = objData.footer.rows;
                    }
                    this.UpdateFooter = false;
                }
            }
        } catch (e) {
            this.logger.log('Grid Error');
        }
    }

    /**
     *
     * @description
     * This method moves forcus to the first enabled input field.
     */
    public SetDefaultFocus(): void {
        let eleFocused = false;
        for (let i = 0; i < this.HTMLGridBody.children.length; i++) {
            for (let j = 0; j < this.colArray.length; j++) {
                let element = this.HTMLGridBody.children[i].children[j].children[0].children[0];
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'CHECKBOX') {
                    if (this.colArray[j].columnUpdateSupport) {
                        element.focus();
                        element.select();
                        eleFocused = true;
                    }
                }
                if (eleFocused) break;
            }
            if (eleFocused) break;
        }
    }

    /**
     * @param objData: This contains the name of the column to be adjusted.
     *
     * @description
     * This method sets the current record type (record per row or record per cell).
     * Currently only the record per row record type is supported.
     */
    public SetRecordType(eRecordTypeRecordPerRow: any): void {
        //TODO
    }

    /****Page Methods*****/
    private CalculateColumnWidth(): void {
        this.widthType = this.FixedWidth ? 'width' : 'max-width';
        for (let j = 0; j < this.colArray.length; j++) {
            this.colArray[j].columnWidth = (100 / this.totalColSize) * this.colArray[j].columnSize;
        }
    }

    public GetColumnByName(colName: string): any {
        for (let j = 0; j < this.colArray.length; j++) {
            if (this.colArray[j].columnName === colName) {
                return this.colArray[j];
            }
        }
    }

    /*********************************Detail*****************************************/
    public Details = {
        context: this,
        AdditionalPropertyContains(strColumnName: string, strContains: string): boolean {
            let gridBody = this.context.HTMLGridBody;
            let isContained: boolean = false;
            if (gridBody) {
                let selectedRow = gridBody.children[this.context.CurrentRow];
                if (selectedRow) {
                    for (let j = 0; j < selectedRow.children.length; j++) {
                        if (selectedRow.children[j].getAttribute('name') === strColumnName) {
                            if (selectedRow.children[j].getAttribute('additionalProperty').indexOf(strContains) > 0) {
                                isContained = true;
                            }
                            break;
                        }
                    }
                }
            }
            return isContained;
        },

        Focus(strColumnName: string): void {
            //TODO
        },

        GetAttribute(strColumnName: string, strAttribute: string): any {
            let gridBody = this.context.HTMLGridBody;
            let outputValue;
            if (gridBody) {
                let selectedRow = gridBody.children[this.context.CurrentRow];
                if (selectedRow) {
                    for (let j = 0; j < selectedRow.children.length; j++) {
                        if (selectedRow.children[j].getAttribute('name') === strColumnName) {
                            switch (strAttribute.toLowerCase()) {
                                case 'additionalproperty':
                                    outputValue = selectedRow.children[j].getAttribute('additionalProperty');
                                    break;
                                case 'rowid':
                                    outputValue = selectedRow.children[j].getAttribute('rowid');
                                    break;
                                case 'title':
                                    outputValue = selectedRow.children[j].children[0].getAttribute('title');
                                    break;
                            }
                            break;
                        }
                    }
                }
            }
            return outputValue;
        },
        GetValue(strColumnName: string): any {
            let gridBody = this.context.HTMLGridBody;
            let outputValue;
            if (gridBody) {
                let selectedRow = gridBody.children[this.context.CurrentRow];
                if (selectedRow) {
                    for (let j = 0; j < selectedRow.children.length; j++) {
                        if (selectedRow.children[j].getAttribute('name') === strColumnName) {
                            let selectedCell = selectedRow.children[j].children[0].children[0];
                            if (selectedCell.tagName === 'INPUT' || selectedCell.tagName === 'TEXTAREA') {
                                outputValue = selectedCell.value;
                            }
                            else if (selectedCell.tagName === 'IMG') {
                                outputValue = selectedCell.getAttribute('value');
                            }
                            else {
                                outputValue = selectedCell.innerText;
                            }
                        }
                    }
                }
            }
            return outputValue;
        },
        SetValue(strColumnName: string, strValue: any): void {
            let gridBody = this.context.HTMLGridBody;
            if (gridBody) {
                let selectedRow = gridBody.children[this.context.CurrentRow];
                if (selectedRow) {
                    for (let j = 0; j < selectedRow.children.length; j++) {
                        if (selectedRow.children[j].getAttribute('name') === strColumnName) {
                            let selectedCell = selectedRow.children[j].children[0].children[0];
                            if (selectedCell.tagName === 'INPUT' || selectedCell.tagName === 'TEXTAREA') {
                                selectedCell.value = strValue;
                            } else {
                                selectedCell.innerText = strValue;
                            }
                        }
                    }
                }
            }
        },
        Warning(strColumnName: string): void {
            //TODO
        }
    };

    /*********************************Events*****************************************/
    public setFocusBack(element: any): void {
        this.gridCell.focusBack(element);
    }

    public rowOnClick(ev: MouseEvent): void {
        if (this.clickEvent) {
            clearTimeout(this.clickEvent);
        }
        this.clickEvent = setTimeout(() => {
            this.gridCell.cellOnFocus(ev);
            this.TRClick.emit(ev);
        }, 200);
    }

    public rowOnDoubleClick(ev: MouseEvent): void {
        clearTimeout(this.clickEvent);
        this.gridCell.cellOnFocus(ev);
        this.TRDblClick.emit(ev);
    }

    public rowOnHover(ev: MouseEvent): void {
        let objHTMLTableRow, objHTMLTableCell;
        if (this.HighlightBar) {
            switch (ev.srcElement.tagName) {
                case 'INPUT':
                case 'TEXTAREA':
                case 'SELECT':
                case 'BUTTON':
                case 'IMG':
                case 'SPAN':
                    objHTMLTableRow = ev.srcElement.parentElement.parentElement.parentElement;
                    break;
                case 'TR':
                case 'TD':
                    objHTMLTableRow = ev.srcElement.parentElement;
                    break;
            }

            if (objHTMLTableRow) {
                if (objHTMLTableRow.parentElement.tagName === 'TBODY') {
                    for (let i = 0; i < objHTMLTableRow.cells.length; i++) {
                        objHTMLTableCell = objHTMLTableRow.children[i];
                        objHTMLTableCell.setAttribute('riOldColor', objHTMLTableCell.style.backgroundColor);
                        objHTMLTableCell.style.backgroundColor = null;
                        objHTMLTableCell.setAttribute('riOldClassName', objHTMLTableCell.className);
                        objHTMLTableCell.className = 'riGridBodyHighLightBar';
                    }
                }
            }
        }
    }

    public rowOnHoverLost(ev: MouseEvent): void {
        let objHTMLTableRow, objHTMLTableCell;
        if (this.HighlightBar) {
            switch (ev.srcElement.tagName) {
                case 'INPUT':
                case 'TEXTAREA':
                case 'SELECT':
                case 'BUTTON':
                case 'IMG':
                case 'SPAN':
                    objHTMLTableRow = ev.srcElement.parentElement.parentElement.parentElement;
                    break;
                case 'TR':
                case 'TD':
                    objHTMLTableRow = ev.srcElement.parentElement;
                    break;
            }

            if (objHTMLTableRow) {
                if (objHTMLTableRow.parentElement.tagName === 'TBODY') {
                    for (let i = 0; i < objHTMLTableRow.cells.length; i++) {
                        objHTMLTableCell = objHTMLTableRow.children[i];
                        if ((objHTMLTableCell.getAttribute('riOldColor')) !== null) {
                            objHTMLTableCell.style.backgroundColor = objHTMLTableCell.getAttribute('riOldColor');
                            objHTMLTableCell.removeAttribute('riOldColor');
                        }
                        if ((objHTMLTableCell.getAttribute('riOldClassName')) !== null) {
                            objHTMLTableCell.className = objHTMLTableCell.getAttribute('riOldClassName');
                            objHTMLTableCell.removeAttribute('riOldClassName');
                        }
                    }
                }
            }
        }
        //riDrillDown
        switch (ev.srcElement.tagName) {
            case 'INPUT':
            case 'TEXTAREA':
            case 'SELECT':
            case 'BUTTON':
            case 'IMG':
            case 'SPAN':
                objHTMLTableCell = ev.srcElement.parentElement.parentElement;
                break;
            case 'TD':
                objHTMLTableCell = ev.srcElement;
                break;
        }

        if (objHTMLTableCell) {
            if (objHTMLTableCell.getAttribute('riDrillDown') !== null) {
                if (objHTMLTableCell.getAttribute('riDrillDown')) {
                    objHTMLTableCell.style.cursor = 'default';
                }
            }
        }
    }

    @HostListener('keyup', ['$event']) keyup(ev: KeyboardEvent): void {
        this.gridCell.pageKeyUp(ev);
    }


}
