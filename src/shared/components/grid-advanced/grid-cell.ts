import { GlobalizeService } from './../../services/globalize.service';
import { StaticUtils } from './../../services/static.utility';
import { MntConst } from './../../services/riMaintenancehelper';
import { GridAdvancedComponent } from './grid-advanced';
import { Utils } from './../../services/utility';
import { Component, Input, ElementRef, Renderer, OnInit, ViewChild, AfterViewInit, HostListener, Output } from '@angular/core';
import * as moment from 'moment';
@Component({
    selector: 'icabs-grid-cell',
    templateUrl: 'grid-cell.html'
})

export class GridColumnComponent implements OnInit, AfterViewInit {
    @ViewChild('Text') public innerText: ElementRef;
    @ViewChild('Input') public input: ElementRef;
    @ViewChild('Checkbox') public checkbox: ElementRef;
    @ViewChild('Button') public button: ElementRef;
    @ViewChild('Image') public image: ElementRef;
    @ViewChild('Textarea') public textarea: ElementRef;
    @ViewChild('DropDown') public select: ElementRef;
    @ViewChild('SortIcon') public sortIcon: ElementRef;

    @Input() public ColumnAlign: string;
    @Input() public ColumnSize: number;
    @Input() public ColumnBiDirectionalSort: boolean;
    @Input() public ColumnDescription: string;
    @Input() public ColumnDrillDown: boolean = false;
    @Input() public ColumnInputID: string;
    @Input() public ColumnInputName: string;
    @Input() public ColumnName: string;
    @Input() public ColumnOrderable: boolean;
    @Input() public ColumnRequired: boolean;
    @Input() public ColumnScreen: boolean;
    @Input() public ColumnTabSupport: boolean = false;
    @Input() public ColumnType: MntConst;
    @Input() public ColumnUpdateSupport: boolean = false;
    @Input() public CellData: any;
    @Input() public ParentHTML: string;
    @Input() public Ellipsis: any;
    @Input() public Dropdown: any;
    @Input() public RowIndex: number;
    @Input() public CellIndex: number;

    private clickEvent: any;
    // private previousValues: any;
    public sortOrderIcon: string = 'right-arrow';
    public cellType: string = 'text';
    public dropdownRecords: Array<any> = [];
    public dropdownSelectedItem = '';

    private HTMLTable: any;
    private HTMLTableHead: any;
    private HTMLTableBody: any;
    private HTMLTableFooter: any;
    private HTMLToElement: HTMLTableCellElement;

    private RowOld = -1;
    private CellOld = -1;
    private RowNew = -1;
    private CellNew = -1;
    private RowCurrent = -1;
    private CellCurrent = -1;
    private CurrentColumnName = null;
    private blnBodyBeforeDeactivate: boolean = false;
    private updatedRowIndex: number = -1;

    constructor(
        public el: ElementRef,
        public renderer: Renderer,
        public utils: Utils,
        public riGrid: GridAdvancedComponent,
        public globalize: GlobalizeService
    ) { }

    // tslint:disable-next-line:no-empty
    public ngOnInit(): void {
        if (this.ParentHTML !== 'Header') {
            //for all Column without RowID
            this.cellType = 'text';
            if (this.CellData.rowID && this.CellData.rowID !== '0') {
                if ((this.CellData.text === '') && !this.ColumnUpdateSupport) {
                    this.cellType = 'text';
                    return;
                }
                switch (this.ColumnType) {
                    case MntConst.eTypeButton: //Button
                        this.cellType = 'button';
                        break;
                    case MntConst.eTypeImage: //Image
                        this.cellType = 'image';
                        break;
                    case MntConst.eTypeCheckBox: //Checkbox
                        this.cellType = 'checkbox';
                        break;
                    case MntConst.eTypeEllipsis: //Ellipsis
                        this.cellType = 'ellipsis';
                        break;
                    case MntConst.eTypeDropdown: //Dropdown
                        this.cellType = 'dropdown';
                        break;
                    default:
                        this.cellType = 'input';
                }
            }
        }
    }

    public ngAfterViewInit(): void {
        let elType;
        switch (this.cellType) {
            case 'input':
            case 'ellipsis':
                elType = this.input.nativeElement;
                break;
            case 'text':
                elType = this.innerText.nativeElement;
                break;
            case 'image':
                elType = this.image.nativeElement;
                break;
            case 'button':
                elType = this.button.nativeElement;
                break;
            case 'checkbox':
                elType = this.checkbox.nativeElement;
                break;
            case 'dropdown':
                elType = this.select.nativeElement;
                break;
        }


        this.HTMLTable = this.el.nativeElement.parentElement.parentElement.parentElement.parentElement;
        this.HTMLTableHead = this.HTMLTable.children[0];
        this.HTMLTableBody = this.HTMLTable.children[1];
        this.HTMLTableFooter = this.HTMLTable.children[2];

        let alignType;
        switch (this.ColumnAlign) {
            case MntConst.eAlignmentCenter:
                alignType = 'center';
                break;
            case MntConst.eAlignmentRight:
                alignType = 'right';
                break;
            default:
                alignType = 'left';
                break;
        }

        if (this.ParentHTML === 'Header') {
            this.renderer.setElementStyle(elType, 'float', 'center');
            this.renderer.setElementClass(elType.parentElement.parentElement, !this.ColumnOrderable ? 'cursor-default' : 'pointer', true);
            if (this.ColumnOrderable) {
                if (this.riGrid.GetColumnByName(this.ColumnName).columnName === this.riGrid.HeaderClickedColumn) {
                    this.renderer.setElementClass(this.sortIcon.nativeElement, 'glyphicon-menu-up', !this.riGrid.DescendingSort);
                    this.renderer.setElementClass(this.sortIcon.nativeElement, 'glyphicon-menu-down', this.riGrid.DescendingSort);
                } else {
                    this.renderer.setElementClass(this.sortIcon.nativeElement, 'glyphicon-menu-left', true);
                }
            }
        }
        if (this.ParentHTML === 'Body') {
            let isPointer = false;
            this.renderer.setElementStyle(elType, 'color', '#' + (this.CellData.textColor).replace('#', ''));
            this.renderer.setElementStyle(elType.parentElement.parentElement, 'background-color', '#' + (this.CellData.cellColor).replace('#', ''));
            this.renderer.setElementClass(elType.parentElement.parentElement, 'cursor-default', true);

            if ((this.ColumnDrillDown || this.CellData.drillDown) && this.CellData.text !== '') {
                this.renderer.setElementClass(elType, 'pointer', true);
            } else {
                this.renderer.setElementClass(elType, 'cursor-default', true);
            }

            this.renderer.setElementAttribute(elType.parentElement, 'title', null);

            if (this.CellData.borderColor) {
                this.renderer.setElementStyle(elType, 'border', '1px solid ' + this.CellData.borderColor);
            }
            if (this.CellData.toolTip) {
                this.renderer.setElementAttribute(elType.parentElement, 'title', this.CellData.toolTip);
            } else if (this.ColumnDescription) {
                this.renderer.setElementAttribute(elType.parentElement, 'title', this.ColumnDescription);
            }
            if (this.cellType === 'input' || this.cellType === 'ellipsis' || this.cellType === 'checkbox') {
                if (this.CellData.text === '<riTag locked>') {
                    this.renderer.setElementAttribute(elType, 'disabled', 'disabled');
                }

                if (!this.ColumnAlign) {
                    switch (this.ColumnType) {
                        case MntConst.eTypeInteger:
                        case MntConst.eTypeDecimal1:
                        case MntConst.eTypeDecimal2:
                        case MntConst.eTypeDecimal3:
                        case MntConst.eTypeDecimal4:
                        case MntConst.eTypeDecimal5:
                        case MntConst.eTypeDecimal6:
                            this.renderer.setElementClass(elType, 'right', true);
                            break;
                    }
                } else {
                    this.renderer.setElementClass(elType, alignType, true);
                }

                this.renderer.setElementStyle(elType, 'background', this.CellData.backgroundColor ? this.CellData.backgroundColor : 'FFF');
                this.renderer.setElementStyle(elType.parentElement.parentElement, 'background', this.CellData.cellColor ? this.CellData.cellColor : 'FFF');
                this.renderer.setElementAttribute(elType, 'readonly', 'readonly');
                this.renderer.setElementAttribute(elType, 'tabIndex', '-1');

                if (this.ColumnUpdateSupport) {
                    this.renderer.setElementAttribute(elType, 'readonly', null);
                    this.renderer.setElementAttribute(elType, 'tabIndex', null);
                }
                if (this.cellType === 'checkbox') {
                    if (this.CellData.text.toUpperCase() === 'YES') {
                        this.renderer.setElementAttribute(elType, 'checked', 'true');
                    }
                }
                if (this.CellData.text) elType.value = this.convertCellDataToString(this.ColumnType);
            }
            else if (this.cellType === 'text') {
                if ((this.ColumnDrillDown || this.CellData.drillDown) && this.CellData.text !== '') {
                    this.renderer.setElementStyle(elType.parentElement.parentElement, 'cursor', 'pointer');
                }
                this.renderer.setElementStyle(elType.parentElement.parentElement, 'text-align', alignType);
                if (this.CellData.text) elType.innerText = this.convertCellDataToString(this.ColumnType);
            }
            else if (this.cellType === 'image') {
                if (this.CellData.text) {
                    this.renderer.setElementAttribute(elType, 'src', StaticUtils.c_s_IMAGE_REPO_URL + this.CellData.text.toLowerCase() + '.gif');
                    this.renderer.setElementAttribute(elType, 'value', this.CellData.text.toLowerCase());
                    this.renderer.setElementClass(elType, 'hidden', false);
                } else {
                    this.renderer.setElementAttribute(elType, 'src', null);
                    this.renderer.setElementAttribute(elType, 'value', '');
                    this.renderer.setElementClass(elType, 'hidden', true);
                }
            }
            else if (this.cellType === 'dropdown') {
                let defaultOpt: Object = { text: '', value: '' };
                this.dropdownRecords.push(defaultOpt);

                let records = this.Dropdown.dataObject.records;
                for (let i = 0; i < records.length; i++) {
                    let code = this.Dropdown.value;
                    let desc = this.Dropdown.desc;

                    let options: Object = {
                        text: records[i][code] + ' - ' + records[i][desc],
                        value: records[i][code]
                    };
                    this.dropdownRecords.push(options);
                }
            }

            this.renderer.setElementAttribute(elType, 'RowID', this.CellData.rowID ? this.CellData.rowID : null);
            this.renderer.setElementAttribute(elType, 'AdditionalProperty', this.CellData.additionalData ? this.CellData.additionalData : null);

            if (this.ColumnType === MntConst.eTypeDate || this.ColumnType === MntConst.eTypeCurrency) {
                this.renderer.setElementClass(elType, 'no-wrap', true);
            }
        }
    }

    /******Methods ******/
    public selectOptionOnChange(ev: any): void {
        console.log(ev);
    }

    public focusBack(lastElementFocus: any): void {
        if (lastElementFocus) {
            lastElementFocus.focus();
        }
    }

    public cellOnFocus(ev: any): void {
        let srcElement, HTMLTableRow, xlBottom;
        if (ev.srcElement.tagName === 'ICABS-GRID-CELL') {
            srcElement = ev.srcElement;
        } else if (ev.srcElement.parentElement.tagName === 'ICABS-GRID-CELL') {
            srcElement = ev.srcElement.parentElement;
        } else if (ev.srcElement.tagName === 'TD') {
            srcElement = ev.srcElement.children[0];
        } else {
            return;
        }

        //SrcElement (Current)
        this.RowCurrent = -1; this.CellCurrent = -1; this.CurrentColumnName = null;

        //TR - Row
        if (this.el.nativeElement.parentElement.tagName === 'TR') {
            xlBottom = srcElement.parentElement;
        }
        else {
            if (srcElement.parentElement.parentElement.tagName === 'TR') {
                HTMLTableRow = srcElement.parentElement.parentElement;
            }
        }

        if (HTMLTableRow) {
            let HTMLTableCell: any;
            this.RowCurrent = HTMLTableRow.sectionRowIndex;
            if (this.riGrid.Mode === MntConst.eModeUpdate && this.riGrid.CurrentRow !== this.RowCurrent) {
                this.el.nativeElement.children[0].blur();
                return;
            }

            this.riGrid.CurrentRow = this.RowCurrent;
            if (srcElement.tagName === 'TD') {
                HTMLTableCell = this.el.nativeElement;
            } else {
                if (srcElement.parentElement.tagName === 'TD') {
                    HTMLTableCell = srcElement.parentElement;
                }
            }
            if (HTMLTableCell) {
                this.CellCurrent = HTMLTableCell.cellIndex;
                this.riGrid.CurrentCell = this.CellCurrent;
                this.riGrid.CurrentColumnName = HTMLTableCell.getAttribute('name');
                //'RaiseEvent - BodyColumnFocus
                this.riGrid.bodyColumnFocus.emit(ev);
            }
        }
    }

    public cellOnBlur(ev: any): void {
        let tableRow: any;
        let tableCell: any;
        let intCount: number;
        let unknownElement: any;
        let inputElement: any;
        let textAreaElement: any;
        let blnCheckTRData: boolean = false;
        let strRowOldTableID: string;
        let strRowNewTableID: string;
        let validRowData: boolean = true;

        this.blnBodyBeforeDeactivate = true;
        if (this.riGrid.Mode === MntConst.eModeUpdate) {

            //SrcElement (Old)
            this.RowOld = -1; this.CellOld = -1;

            let srcElement = ev.srcElement.parentElement.tagName === 'ICABS-GRID-CELL' ? ev.srcElement.parentElement : ev.srcElement.children[0];
            strRowOldTableID = srcElement.parentElement.parentElement.parentElement.id;
            //TR - Row
            if (srcElement.parentElement.tagName === 'TR') {
                tableRow = srcElement.parentElement;
            } else {
                if (srcElement.parentElement.parentElement.tagName === 'TR') {
                    tableRow = srcElement.parentElement.parentElement;
                }
            }

            if (tableRow) {
                this.RowOld = tableRow.sectionRowIndex;
                if (this.riGrid.CurrentRow !== this.RowOld) {
                    let tableRow = srcElement.parentElement.parentElement.parentElement.children[this.riGrid.CurrentRow];
                    let tableCell = tableRow.children[this.riGrid.CurrentCell].children[0].children[0];
                    tableCell.focus();
                    return;
                }
                tableRow = null;
                //TD -Cell
                if (srcElement.tagName === 'TD') {
                    tableCell = srcElement;
                } else {
                    if (srcElement.parentElement.tagName === 'TD') {
                        tableCell = srcElement.parentElement;
                    }
                }
                if (tableCell) {
                    this.CellOld = tableCell.cellIndex;
                    tableCell = null;
                    //ToElement (New)
                    this.RowNew = -1; this.CellNew = -1;
                    if (!ev.relatedTarget) {
                        blnCheckTRData = true;
                    } else {
                        if (!ev.relatedTarget.parentElement) {
                            blnCheckTRData = true;
                        } else {
                            if (!ev.relatedTarget.parentElement.parentElement) {
                                blnCheckTRData = true;
                            } else {
                                if (!ev.relatedTarget.parentElement.parentElement.parentElement) {
                                    blnCheckTRData = true;
                                } else {
                                    if (!ev.relatedTarget.parentElement.parentElement.parentElement.parentElement) {
                                        blnCheckTRData = true;
                                    } else {
                                        if (!ev.relatedTarget.parentElement.parentElement.parentElement.parentElement.parentElement) return;

                                        strRowNewTableID = ev.relatedTarget.parentElement.parentElement.parentElement.parentElement.parentElement.id;
                                        if (strRowNewTableID !== strRowOldTableID) {
                                            blnCheckTRData = true;
                                        } else {
                                            //TR - Row
                                            if (ev.relatedTarget.parentElement.parentElement.tagName === 'TR') {
                                                tableRow = ev.relatedTarget.parentElement.parentElement;
                                            } else {
                                                if (ev.relatedTarget.parentElement.parentElement.parentElement.tagName === 'TR') {
                                                    tableRow = ev.relatedTarget.parentElement.parentElement.parentElement;
                                                }
                                            }
                                            if (tableRow) {
                                                this.RowNew = tableRow.sectionRowIndex;
                                                tableRow = null;
                                                //TD - Cell
                                                if (ev.relatedTarget.parentElement.tagName === 'TD') {
                                                    tableCell = ev.relatedTarget.parentElement;
                                                } else {
                                                    if (ev.relatedTarget.parentElement.parentElement.tagName === 'TD') {
                                                        tableCell = ev.relatedTarget.parentElement.parentElement;
                                                    }
                                                }
                                                if (tableCell) {
                                                    this.CellNew = tableCell.cellIndex;
                                                    tableCell = null;
                                                        /*if (this.riGrid.GetRecordType === eRecordTypeRecordPerCell) {
                                                            if (Not Me.RowOld = Me.RowNew Or Not Me.CellOld = Me.CellNew ){
                                                                blnCheckTRData = true;
                                                            }
                                                        } else */{
                                                        if (this.RowOld !== this.RowNew) {
                                                            blnCheckTRData = true;
                                                        }
                                                    }
                                                } else {
                                                    blnCheckTRData = true;
                                                }
                                            } else {
                                                blnCheckTRData = true;
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }

            tableRow = this.HTMLTableBody.children[this.RowOld];
            for (let i = 0; i < tableRow.cells.length; i++) {
                tableCell = tableRow.children[i].children[0];
                if (tableCell.children[0]) {
                    unknownElement = tableCell.children[0];
                    if (unknownElement.tagName === 'INPUT' || unknownElement.tagName === 'TEXTAREA') {
                        if (this.riGrid.colArray[i].columnUpdateSupport) {
                            let element = tableCell.children[0];
                            let colType = this.riGrid.colArray[i].columnType;
                            if (this.isError(element, colType)) {
                                validRowData = false;
                            }
                        }
                    }
                }
            }

            if (this.CellData.text && validRowData) {
                this.el.nativeElement.children[0].value = this.convertCellDataToString(this.ColumnType);
            }

            if (validRowData && blnCheckTRData) {
                //Expose ` and raise the BodyColumnLostFocus event for the user to modify it
                this.riGrid.UpdateRow = blnCheckTRData;
                this.riGrid.bodyColumnBlur.emit(ev);
            }
        }
    }

    public cellDataOnChange(ev?: Event): void {
        if (this.riGrid.FunctionUpdateSupport) {
            if (this.ColumnUpdateSupport) {
                if (this.riGrid.Mode === MntConst.eModeNormal) {
                    this.riGrid.Mode = MntConst.eModeUpdate;
                    if (this.el.nativeElement.parentElement) {
                        if (this.el.nativeElement.parentElement.parentElement) {
                            if (this.el.nativeElement.parentElement.parentElement.tagName === 'TR') {
                                let HTMLRow = this.el.nativeElement.parentElement.parentElement;
                                this.riGrid.previousValues = [];
                                this.SavePreviousValues(HTMLRow);
                            }
                        }
                    }
                }
            }
        }
    }

    @HostListener('keydown', ['$event']) cellOnKeyDown(ev: KeyboardEvent): void {
        let tableRow: any;
        let tableCell: any;
        let inputElement: any;
        // let clsColumn: any = this;
        if (this.CheckSrcElementTagName) {
            let tagName = this.el.nativeElement.children[0].tagName;
            switch (ev.code) {
                case 'Delete':
                case 'Backspace':
                    //Check riGrid.FunctionUpdateSupport
                    if (this.riGrid.FunctionUpdateSupport) {
                        if (this.ColumnUpdateSupport) {
                            //Check Mode
                            if (this.riGrid.Mode === MntConst.eModeNormal) {
                                //Set Mode
                                this.riGrid.Mode = MntConst.eModeUpdate;
                                //Save Previous Values
                                if (this.el.nativeElement.parentElement) {
                                    if (this.el.nativeElement.parentElement.parentElement) {
                                        if (this.el.nativeElement.parentElement.parentElement.tagName === 'TR') {
                                            tableRow = this.el.nativeElement.parentElement.parentElement;
                                            this.riGrid.previousValues = [];
                                            this.SavePreviousValues(tableRow);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 'PageDown':
                    this.riGrid.columnLookUpRequested.emit(ev);
                    break;
                case 'ArrowUp':
                    //Check Me.riGrid.FunctionTabSupport
                    if (this.riGrid.FunctionTabSupport) {
                        ev.returnValue = false;
                        if (this.el.nativeElement.children[0].tagName === 'INPUT') {
                            if (this.el.nativeElement.parentElement.parentElement.previousSibling) {
                                tableRow = this.el.nativeElement.parentElement.parentElement.previousSibling;
                                if (tableRow.children[this.el.nativeElement.parentElement.cellIndex]) {
                                    tableCell = tableRow.children[this.el.nativeElement.parentElement.cellIndex].children[0];

                                    if (this.ColumnUpdateSupport || this.ColumnTabSupport) {
                                        if (tableCell.children[0]) {
                                            switch (tableCell.children[0].tagName) {
                                                case 'INPUT':
                                                    inputElement = tableCell.children[0];
                                                    inputElement.focus();
                                                    inputElement.select();
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 'ArrowDown':
                    //Check this.riGrid.FunctionTabSupport
                    if (this.riGrid.FunctionTabSupport) {
                        ev.returnValue = false;
                        if (this.el.nativeElement.children[0].tagName === 'INPUT') {
                            if (this.el.nativeElement.parentElement.parentElement.nextSibling) {
                                tableRow = this.el.nativeElement.parentElement.parentElement.nextSibling;
                                if (tableRow.children[this.el.nativeElement.parentElement.cellIndex]) {
                                    tableCell = tableRow.children[this.el.nativeElement.parentElement.cellIndex].children[0];

                                    if (this.ColumnUpdateSupport || this.ColumnTabSupport) {
                                        if (tableCell.children[0]) {
                                            switch (tableCell.children[0].tagName) {
                                                case 'INPUT':
                                                    inputElement = tableCell.children[0];
                                                    inputElement.focus();
                                                    inputElement.select();
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 'ArrowLeft':
                    //Check Me.riGrid.FunctionTabSupport
                    if (this.riGrid.FunctionTabSupport) {
                        //Check me.riGrid.Mode
                        if (this.riGrid.Mode === MntConst.eModeNormal) {
                            ev.returnValue = false;
                            if (this.el.nativeElement.children[0].tagName === 'INPUT') {
                                if (this.el.nativeElement.parentElement.previousSibling) {
                                    tableCell = this.el.nativeElement.parentElement.previousSibling;
                                    if (this.ColumnUpdateSupport || this.ColumnTabSupport) {
                                        if (tableCell.children[0]) {
                                            switch (tableCell.children[0].tagName) {
                                                case 'INPUT':
                                                    inputElement = tableCell.children[0];
                                                    inputElement.focus();
                                                    inputElement.select();
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
                case 'ArrowRight':
                    //Check Me.riGrid.FunctionTabSupport
                    if (this.riGrid.FunctionTabSupport) {
                        //Check me.riGrid.Mode
                        if (this.riGrid.Mode === MntConst.eModeNormal) {
                            ev.returnValue = false;
                            if (this.el.nativeElement.children[0].tagName === 'INPUT') {
                                if (this.el.nativeElement.parentElement.nextSibling) {
                                    tableCell = this.el.nativeElement.parentElement.nextSibling;
                                    if (this.ColumnUpdateSupport || this.ColumnTabSupport) {
                                        if (tableCell.children[0]) {
                                            switch (tableCell.children[0].tagName) {
                                                case 'INPUT':
                                                    inputElement = tableCell.children[0];
                                                    inputElement.focus();
                                                    inputElement.select();
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            this.riGrid.bodyKeyDown.emit(ev);
        }
    }

    @HostListener('click', ['$event']) cellOnClick(ev: MouseEvent): void {
        if (this.clickEvent) {
            clearTimeout(this.clickEvent);
        }
        this.clickEvent = setTimeout(() => {
            if (this.riGrid.Enable) {
                let tagName = this.el.nativeElement.children[0].tagName;
                if (this.el.nativeElement.parentElement.tagName === 'TH') {
                    let gridCell;
                    if (tagName === 'IMG' || tagName === 'SPAN') {
                        gridCell = this.el.nativeElement.parentElement;
                    } else {
                        gridCell = this.el.nativeElement;
                    }
                    if (gridCell) {
                        if (this.ColumnOrderable) {
                            this.riGrid.HeaderClickedColumn = this.ColumnName;
                            this.riGrid.headerClick.emit(ev);
                        }
                    }
                } else {
                    if (this.CheckSrcElementTagName || this.CellData.drillDown || this.ColumnDrillDown) {
                        this.cellOnFocus(ev);
                        if (this.riGrid.FunctionUpdateSupport) {
                            if (this.riGrid.Mode === MntConst.eModeNormal && this.ColumnName) {
                                if (this.ColumnUpdateSupport) {
                                    if (this.el.nativeElement.tagName === 'INPUT') {
                                        this.el.nativeElement.children[0].select();
                                        if (this.cellType === 'checkbox') {
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                        this.riGrid.bodyClick.emit(ev);
                    }
                }
            } else {
                if (this.riGrid.Mode === MntConst.eModeUpdate) {
                    if (this.blnBodyBeforeDeactivate) {
                        return;
                    }
                }
            }
        }, 200);
    }

    @HostListener('dblclick', ['$event']) cellOnDoubleClick(ev: MouseEvent): void {
        clearTimeout(this.clickEvent);
        if (this.el.nativeElement.parentElement.tagName === 'TH') return;

        if (this.CheckSrcElementTagName || this.CellData.drillDown) {
            this.cellOnFocus(ev);
            this.riGrid.bodyDblClick.emit(ev);
        }
    }

    public pageKeyUp(event: KeyboardEvent): void {
        if (event.code === 'Escape') {
            if (this.riGrid.FunctionUpdateSupport) {
                if (this.riGrid.Mode === MntConst.eModeUpdate) {
                    this.riGrid.Mode = MntConst.eModeNormal;
                    if (this.el.nativeElement.parentElement) {
                        if (this.el.nativeElement.parentElement.parentElement) {
                            if (this.el.nativeElement.parentElement.parentElement.parentElement) {
                                if (this.el.nativeElement.parentElement.parentElement.parentElement.parentElement) {
                                    if (this.el.nativeElement.parentElement.parentElement.parentElement.parentElement.children[1]) {
                                        let tableBody = this.el.nativeElement.parentElement.parentElement.parentElement.parentElement.children[1];
                                        let tableRow = tableBody.children[this.riGrid.CurrentRow];
                                        this.RestorePreviousValues(tableRow);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private SavePreviousValues(rHTMLTableRow: HTMLTableRowElement): void {
        let lHTMLTableCell: any;
        let lHTMLUnknownElement: any;
        let obj = {};

        for (let i = 0; i < rHTMLTableRow.cells.length; i++) {
            lHTMLTableCell = rHTMLTableRow.cells[i].children[0];
            if (lHTMLTableCell.children[0]) {
                lHTMLUnknownElement = lHTMLTableCell.children[0];
            }
            this.riGrid.previousValues[i] = new Object();
            switch (lHTMLUnknownElement.tagName) {
                case 'INPUT':
                    let lHTMLInputElement = lHTMLUnknownElement;
                    let val;
                    if (lHTMLInputElement.type === 'checkbox') {
                        val = lHTMLInputElement.checked;
                    } else {
                        val = lHTMLInputElement.value;
                    }
                    obj = {
                        id: lHTMLInputElement.id,
                        value: val
                    };

                    this.riGrid.previousValues[i] = obj;
                    break;
                case 'TEXTAREA':
                    let lHTMLTextAreaElement = lHTMLUnknownElement;
                    obj = {
                        id: lHTMLTextAreaElement.id,
                        value: lHTMLTextAreaElement.value
                    };
                    this.riGrid.previousValues[i] = obj;
                    break;
            }
        }
    }

    private RestorePreviousValues(rHTMLTableRow: HTMLTableRowElement): void {
        let tableCell: any;
        let element: any;
        for (let i = 0; i < rHTMLTableRow.cells.length; i++) {
            tableCell = rHTMLTableRow.cells[i].children[0];
            if (tableCell.children[0]) {
                element = tableCell.children[0];
            }
            switch (element.tagName) {
                case 'INPUT':
                    let inputElement = element;
                    if (inputElement.type === 'checkbox') {
                        inputElement.checked = Boolean(this.riGrid.previousValues[i].value);
                    } else {
                        inputElement.value = this.riGrid.previousValues[i].value;
                    }
                    if (this.riGrid.colArray[i].columnUpdateSupport) {
                        this.renderer.setElementClass(inputElement, 'error', false);
                    }
                    break;
                case 'TEXTAREA':
                    let textAreaElement = element;
                    textAreaElement.value = this.riGrid.previousValues[i].value;
                    if (this.riGrid.colArray[i].columnUpdateSupport) {
                        this.renderer.setElementClass(textAreaElement, 'error', false);
                    }
                    break;
            }
        }
    }

    public setInputValue(data: any): void {
        this.cellDataOnChange();
        let event: any = new Object();
        let oldValue = this.el.nativeElement.children[0].value;
        this.el.nativeElement.children[0].value = data[this.Ellipsis.returnObject];

        event.srcElement = this.el.nativeElement.children[0];
        event.srcElement.focus();
    }

    private convertCellDataToString(colType: MntConst): string {
        let strValue;
        let fieldValue;
        if (this.riGrid.Mode === MntConst.eModeUpdate) {
            if (this.cellType === 'input' || this.cellType === 'ellipsis') {
                fieldValue = this.el.nativeElement.children[0].value;
            }
        } else {
            fieldValue = this.CellData.text;
            if (fieldValue === '<riTag locked>') {
                return strValue = '';
            }
        }

        strValue = fieldValue ? fieldValue : '';

        switch (colType) {
            case MntConst.eTypeCheckBox:
                let dataValue = fieldValue.toUpperCase();
                strValue = false;
                if (dataValue === 'YES' || dataValue === 'TRUE') {
                    strValue = true;
                }
                break;
            case MntConst.eTypeCode:
                strValue = fieldValue.toUpperCase();
                break;
            case MntConst.eTypeTextFree:
                strValue = fieldValue ? this.utils.toTitleCase(fieldValue) : '';
                break;
            case MntConst.eTypeCurrency:
                fieldValue = this.utils.decimalFaultTolerance(fieldValue);
                strValue = isNaN(fieldValue) ? fieldValue : this.globalize.formatCurrencyToLocaleFormat(fieldValue);
                break;
            case MntConst.eTypeDate:
            case MntConst.eTypeDateNow:
                strValue = fieldValue ? this.globalize.formatDateToLocaleFormat(fieldValue) : '';
                break;
            case MntConst.eTypeHours:
                if (fieldValue !== this.utils.secondsToHr(fieldValue)) {
                    strValue = fieldValue ? this.utils.secondsToHr(fieldValue) : '';
                }
                break;
            case MntConst.eTypeMinutes:
                if (fieldValue !== this.utils.secondsToMin(fieldValue)) {
                    strValue = fieldValue ? this.utils.secondsToMin(fieldValue) : '';
                }
                break;
            case MntConst.eTypeTime:
            case MntConst.eTypeTimeNow:
                if (this.riGrid.Mode === MntConst.eModeNormal) {
                    strValue = fieldValue ? this.globalize.formatTimeToLocaleFormat(fieldValue) : '';
                } else {
                    strValue = fieldValue ? this.globalize.formatTimeToLocaleFormat(fieldValue, true) : '';
                }
                break;
            case MntConst.eTypeInteger:
                if (this.cellType === 'text') {
                    strValue = this.globalize.formatIntegerToLocaleFormat(this.CellData.text);
                }
                else {
                    strValue = fieldValue ? this.globalize.formatIntegerToLocaleFormat(fieldValue) : '';
                }
                break;
            case MntConst.eTypeDecimal1:
                strValue = fieldValue ? this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(fieldValue), 1) : '';
                break;
            case MntConst.eTypeDecimal2:
                strValue = fieldValue ? this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(fieldValue), 2) : '';
                break;
            case MntConst.eTypeDecimal3:
                strValue = fieldValue ? this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(fieldValue), 3) : '';
                break;
            case MntConst.eTypeDecimal4:
                strValue = fieldValue ? this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(fieldValue), 4) : '';
                break;
            case MntConst.eTypeDecimal5:
                strValue = fieldValue ? this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(fieldValue), 5) : '';
                break;
            case MntConst.eTypeDecimal6:
                strValue = fieldValue ? this.globalize.formatDecimalToLocaleFormat(this.utils.decimalFaultTolerance(fieldValue), 6) : '';
                break;
            default:
                strValue = fieldValue;
                break;
        }
        if (!strValue) {
            strValue = fieldValue;
        }
        return strValue;
    }

    //Checks for clicked element type
    private get CheckSrcElementTagName(): boolean {
        let objEvent: any;
        let tagName = this.el.nativeElement.children[0].tagName;
        let isElementTagName: boolean = false;
        switch (tagName) {
            case 'INPUT':
            case 'TEXTAREA':
            case 'SELECT':
            case 'BUTTON':
            case 'IMG':
            case 'SPAN':
                isElementTagName = true;
                break;
            default:
                isElementTagName = false;
                break;
        }
        return isElementTagName;
    }

    //Checks if field is valid
    private isError(ele: any, colType: any): boolean {
        let isInvalid = false;
        let formattedValue: any;
        switch (colType) {
            case MntConst.eTypeInteger:
            case MntConst.eTypeDecimal1:
            case MntConst.eTypeDecimal2:
            case MntConst.eTypeDecimal3:
            case MntConst.eTypeDecimal4:
            case MntConst.eTypeDecimal5:
            case MntConst.eTypeDecimal6:
                isInvalid = isNaN(ele.value);
                break;
            case MntConst.eTypeCurrency:
                formattedValue = this.globalize.formatCurrencyToLocaleFormat(this.utils.decimalFaultTolerance(ele.value));
                if (formattedValue === false) {
                    isInvalid = true;
                } else {
                    ele.value = formattedValue;
                    isInvalid = false;
                }
                break;
            case MntConst.eTypeDate:
                if (this.riGrid.Mode === MntConst.eModeNormal) {
                    formattedValue = this.globalize.formatDateToLocaleFormat(ele.value);
                } else {
                    formattedValue = this.globalize.formatDateToLocaleFormat(ele.value, true);
                }
                if (formattedValue === false) {
                    isInvalid = true;
                } else {
                    ele.value = formattedValue;
                    isInvalid = false;
                }
                break;
            case MntConst.eTypeTime:
            case MntConst.eTypeTimeNow:
                if (this.riGrid.Mode === MntConst.eModeNormal) {
                    formattedValue = this.globalize.formatTimeToLocaleFormat(ele.value);
                } else {
                    formattedValue = this.globalize.formatTimeToLocaleFormat(ele.value, true);
                }
                if (formattedValue === false) {
                    isInvalid = true;
                } else {
                    ele.value = formattedValue;
                    isInvalid = false;
                }
                //isInvalid = this.validateTimeFormat(ele.value);
                break;
        }
        this.renderer.setElementClass(ele, 'error', isInvalid);
        return isInvalid;
    }

    public formatTime(time: any): string {
        let formattedTime;
        let firstDta, secondDta;
        if (time.indexOf(':') === -1) {
            let result: any = '';
            let re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            firstDta = parseInt(time[0] + time[1], 10);
            secondDta = parseInt(time[2] + time[3], 10);
            if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && time.length === 4) {
                formattedTime = time[0] + time[1] + ':' + time[2] + time[3];
            }
        } else {
            firstDta = time.split(':')[0];
            secondDta = time.split(':')[1];

            if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) || time.length !== 5) {
                formattedTime = time;
            }
            if (moment(time, 'H:m', true).isValid()) {
                formattedTime = moment(time, 'H:m').format('HH:mm');
            }
        }
        return formattedTime;
    }


    public validateTimeFormat(time: string): boolean {
        let isInvalid = false;
        let firstDta, secondDta;
        if (time.indexOf(':') === -1) {
            let result: any = '';
            let re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            firstDta = parseInt(time[0] + time[1], 10);
            secondDta = parseInt(time[2] + time[3], 10);
            if (!(((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && time.length === 4)) {
                isInvalid = true;
            }
        } else {
            firstDta = time.split(':')[0];
            secondDta = time.split(':')[1];
            if (!((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) || time.length !== 5) {
                isInvalid = true;
            }

            if (!moment(time, 'H:m', true).isValid()) {
                isInvalid = true;
            } else {
                isInvalid = false;
            }
        }
        return isInvalid;
    }
}
