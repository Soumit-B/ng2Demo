import { StaticUtils } from './../../services/static.utility';
import { MntConst } from './../../services/riMaintenancehelper';
import { GridAdvancedComponent } from './grid-advanced';
import { Utils } from './../../services/utility';
import { Component, Input, ElementRef, Renderer, ViewChild, HostListener } from '@angular/core';
export var GridColumnComponent = (function () {
    function GridColumnComponent(el, renderer, utils, riGrid) {
        this.el = el;
        this.renderer = renderer;
        this.utils = utils;
        this.riGrid = riGrid;
        this.ColumnDrillDown = false;
        this.ColumnTabSupport = false;
        this.ColumnUpdateSupport = false;
        this.sortOrderIcon = 'right-arrow';
        this.cellType = 'text';
        this.dropdownRecords = [];
        this.dropdownSelectedItem = '';
        this.RowOld = -1;
        this.CellOld = -1;
        this.RowNew = -1;
        this.CellNew = -1;
        this.RowCurrent = -1;
        this.CellCurrent = -1;
        this.CurrentColumnName = null;
        this.blnBodyBeforeDeactivate = false;
        this.updatedRowIndex = -1;
    }
    GridColumnComponent.prototype.ngOnInit = function () {
        if (this.ParentHTML !== 'Header') {
            this.cellType = 'text';
            if (this.CellData.rowID && this.CellData.rowID !== '0') {
                if ((this.CellData.text === '') && !this.ColumnUpdateSupport) {
                    this.cellType = 'text';
                    return;
                }
                switch (this.ColumnType) {
                    case MntConst.eTypeButton:
                        this.cellType = 'button';
                        break;
                    case MntConst.eTypeImage:
                        this.cellType = 'image';
                        break;
                    case MntConst.eTypeCheckBox:
                        this.cellType = 'checkbox';
                        break;
                    case MntConst.eTypeEllipsis:
                        this.cellType = 'ellipsis';
                        break;
                    case MntConst.eTypeDropdown:
                        this.cellType = 'dropdown';
                        break;
                    default:
                        this.cellType = 'input';
                }
            }
        }
    };
    GridColumnComponent.prototype.ngAfterViewInit = function () {
        var elType;
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
        var alignType;
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
                    this.renderer.setElementClass(this.sortIcon.nativeElement, 'glyphicon-menu-up', true);
                }
                this.renderer.setElementClass(this.sortIcon.nativeElement, 'glyphicon-menu-left', true);
            }
        }
        if (this.ParentHTML !== 'Header') {
            var isPointer = false;
            this.renderer.setElementStyle(elType, 'color', '#' + (this.CellData.textColor).replace('#', ''));
            this.renderer.setElementStyle(elType.parentElement.parentElement, 'background-color', '#' + (this.CellData.cellColor).replace('#', ''));
            if (this.ColumnDrillDown || this.CellData.drillDown) {
                this.renderer.setElementClass(elType, 'pointer', true);
            }
            else {
                this.renderer.setElementClass(elType, 'cursor-default', true);
            }
            this.renderer.setElementAttribute(elType.parentElement, 'title', null);
            if (this.CellData.borderColor) {
                this.renderer.setElementStyle(elType, 'border', '1px solid ' + this.CellData.borderColor);
            }
            if (this.CellData.toolTip) {
                this.renderer.setElementAttribute(elType.parentElement, 'title', this.CellData.toolTip);
            }
            else if (this.ColumnDescription) {
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
                }
                else {
                    this.renderer.setElementClass(elType, alignType, true);
                }
                this.renderer.setElementStyle(elType, 'background', this.CellData.backgroundColor ? this.CellData.backgroundColor : 'FFF');
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
                if (this.CellData.text)
                    elType.value = this.convertCellDataToString(this.ColumnType);
            }
            else if (this.cellType === 'text') {
                if (this.ColumnDrillDown || this.CellData.drillDown) {
                    this.renderer.setElementStyle(elType.parentElement.parentElement, 'cursor', 'pointer');
                }
                this.renderer.setElementStyle(elType.parentElement.parentElement, 'text-align', alignType);
                if (this.CellData.text)
                    elType.innerText = this.convertCellDataToString(this.ColumnType);
            }
            else if (this.cellType === 'image') {
                if (this.CellData.text) {
                    this.renderer.setElementAttribute(elType, 'src', StaticUtils.c_s_IMAGE_REPO_URL + this.CellData.text + '.gif');
                    this.renderer.setElementClass(elType, 'hidden', false);
                }
                else {
                    this.renderer.setElementAttribute(elType, 'src', null);
                    this.renderer.setElementClass(elType, 'hidden', true);
                }
            }
            else if (this.cellType === 'dropdown') {
                var defaultOpt = { text: '', value: '' };
                this.dropdownRecords.push(defaultOpt);
                var records = this.Dropdown.dataObject.records;
                for (var i = 0; i < records.length; i++) {
                    var code = this.Dropdown.value;
                    var desc = this.Dropdown.desc;
                    var options = {
                        text: records[i][code] + ' - ' + records[i][desc],
                        value: records[i][code]
                    };
                    this.dropdownRecords.push(options);
                }
            }
            this.renderer.setElementAttribute(elType, 'RowID', this.CellData.rowID ? this.CellData.rowID : null);
            this.renderer.setElementAttribute(elType, 'AdditionalProperty', this.CellData.additionalData ? this.CellData.additionalData : null);
        }
    };
    GridColumnComponent.prototype.selectOptionOnChange = function (ev) {
        console.log(ev);
    };
    GridColumnComponent.prototype.cellOnFocus = function (ev) {
        var srcElement, HTMLTableRow, xlBottom;
        if (ev.srcElement.tagName === 'ICABS-GRID-CELL') {
            srcElement = ev.srcElement;
        }
        else if (ev.srcElement.parentElement.tagName === 'ICABS-GRID-CELL') {
            srcElement = ev.srcElement.parentElement;
        }
        else if (ev.srcElement.tagName === 'TD') {
            srcElement = ev.srcElement.children[0];
        }
        else {
            return;
        }
        this.RowCurrent = -1;
        this.CellCurrent = -1;
        this.CurrentColumnName = null;
        if (this.el.nativeElement.parentElement.tagName === 'TR') {
            xlBottom = srcElement.parentElement;
        }
        else {
            if (srcElement.parentElement.parentElement.tagName === 'TR') {
                HTMLTableRow = srcElement.parentElement.parentElement;
            }
        }
        if (HTMLTableRow) {
            var HTMLTableCell = void 0;
            this.RowCurrent = HTMLTableRow.sectionRowIndex;
            if (this.riGrid.Mode === MntConst.eModeUpdate && this.riGrid.CurrentRow !== this.RowCurrent) {
                this.el.nativeElement.children[0].blur();
                return;
            }
            this.riGrid.CurrentRow = this.RowCurrent;
            if (srcElement.tagName === 'TD') {
                HTMLTableCell = this.el.nativeElement;
            }
            else {
                if (srcElement.parentElement.tagName === 'TD') {
                    HTMLTableCell = srcElement.parentElement;
                }
            }
            if (HTMLTableCell) {
                this.CellCurrent = HTMLTableCell.cellIndex;
                this.riGrid.CurrentCell = this.CellCurrent;
                this.riGrid.CurrentColumnName = HTMLTableCell.getAttribute('name');
                this.riGrid.bodyColumnFocus.emit(ev);
            }
        }
    };
    GridColumnComponent.prototype.cellOnBlur = function (ev) {
        var tableRow;
        var tableCell;
        var intCount;
        var unknownElement;
        var inputElement;
        var textAreaElement;
        var blnCheckTRData = false;
        var strRowOldTableID;
        var strRowNewTableID;
        var validRowData = true;
        this.blnBodyBeforeDeactivate = true;
        if (this.riGrid.Mode === MntConst.eModeUpdate) {
            this.RowOld = -1;
            this.CellOld = -1;
            var srcElement = ev.srcElement.parentElement.tagName === 'ICABS-GRID-CELL' ? ev.srcElement.parentElement : ev.srcElement.children[0];
            strRowOldTableID = srcElement.parentElement.parentElement.parentElement.id;
            if (srcElement.parentElement.tagName === 'TR') {
                tableRow = srcElement.parentElement;
            }
            else {
                if (srcElement.parentElement.parentElement.tagName === 'TR') {
                    tableRow = srcElement.parentElement.parentElement;
                }
            }
            if (tableRow) {
                this.RowOld = tableRow.sectionRowIndex;
                if (this.riGrid.CurrentRow !== this.RowOld) {
                    var tableRow_1 = srcElement.parentElement.parentElement.parentElement.children[this.riGrid.CurrentRow];
                    var tableCell_1 = tableRow_1.children[this.riGrid.CurrentCell].children[0].children[0];
                    tableCell_1.focus();
                    return;
                }
                tableRow = null;
                if (srcElement.tagName === 'TD') {
                    tableCell = srcElement;
                }
                else {
                    if (srcElement.parentElement.tagName === 'TD') {
                        tableCell = srcElement.parentElement;
                    }
                }
                if (tableCell) {
                    this.CellOld = tableCell.cellIndex;
                    tableCell = null;
                    this.RowNew = -1;
                    this.CellNew = -1;
                    if (!ev.relatedTarget) {
                        blnCheckTRData = true;
                    }
                    else {
                        if (!ev.relatedTarget.parentElement) {
                            blnCheckTRData = true;
                        }
                        else {
                            if (!ev.relatedTarget.parentElement.parentElement) {
                                blnCheckTRData = true;
                            }
                            else {
                                if (!ev.relatedTarget.parentElement.parentElement.parentElement) {
                                    blnCheckTRData = true;
                                }
                                else {
                                    if (!ev.relatedTarget.parentElement.parentElement.parentElement.parentElement) {
                                        blnCheckTRData = true;
                                    }
                                    else {
                                        strRowNewTableID = ev.relatedTarget.parentElement.parentElement.parentElement.parentElement.parentElement.id;
                                        if (strRowNewTableID !== strRowOldTableID) {
                                            blnCheckTRData = true;
                                        }
                                        else {
                                            if (ev.relatedTarget.parentElement.parentElement.tagName === 'TR') {
                                                tableRow = ev.relatedTarget.parentElement.parentElement;
                                            }
                                            else {
                                                if (ev.relatedTarget.parentElement.parentElement.parentElement.tagName === 'TR') {
                                                    tableRow = ev.relatedTarget.parentElement.parentElement.parentElement;
                                                }
                                            }
                                            if (tableRow) {
                                                this.RowNew = tableRow.sectionRowIndex;
                                                tableRow = null;
                                                if (ev.relatedTarget.parentElement.tagName === 'TD') {
                                                    tableCell = ev.relatedTarget.parentElement;
                                                }
                                                else {
                                                    if (ev.relatedTarget.parentElement.parentElement.tagName === 'TD') {
                                                        tableCell = ev.relatedTarget.parentElement.parentElement;
                                                    }
                                                }
                                                if (tableCell) {
                                                    this.CellNew = tableCell.cellIndex;
                                                    tableCell = null;
                                                    {
                                                        if (this.RowOld !== this.RowNew) {
                                                            blnCheckTRData = true;
                                                        }
                                                    }
                                                }
                                                else {
                                                    blnCheckTRData = true;
                                                }
                                            }
                                            else {
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
            for (var i = 0; i < tableRow.cells.length; i++) {
                tableCell = tableRow.children[i].children[0];
                if (tableCell.children[0]) {
                    unknownElement = tableCell.children[0];
                    if (unknownElement.tagName === 'INPUT' || unknownElement.tagName === 'TEXTAREA') {
                        if (this.riGrid.colArray[i].columnUpdateSupport) {
                            var element = tableCell.children[0];
                            var colType = this.riGrid.colArray[i].columnType;
                            if (this.isError(element, colType)) {
                                validRowData = false;
                                break;
                            }
                        }
                    }
                }
            }
            if (this.CellData.text && validRowData) {
                this.el.nativeElement.children[0].value = this.convertCellDataToString(this.ColumnType);
            }
            if (validRowData && blnCheckTRData) {
                this.riGrid.UpdateRow = blnCheckTRData;
                this.riGrid.bodyColumnBlur.emit(ev);
            }
        }
    };
    GridColumnComponent.prototype.cellDataOnChange = function (ev) {
        if (this.riGrid.FunctionUpdateSupport) {
            if (this.ColumnUpdateSupport) {
                if (this.riGrid.Mode === MntConst.eModeNormal) {
                    this.riGrid.Mode = MntConst.eModeUpdate;
                    if (this.el.nativeElement.parentElement) {
                        if (this.el.nativeElement.parentElement.parentElement) {
                            if (this.el.nativeElement.parentElement.parentElement.tagName === 'TR') {
                                var HTMLRow = this.el.nativeElement.parentElement.parentElement;
                                this.riGrid.previousValues = [];
                                this.SavePreviousValues(HTMLRow);
                            }
                        }
                    }
                }
            }
        }
    };
    GridColumnComponent.prototype.cellOnKeyDown = function (ev) {
        var tableRow;
        var tableCell;
        var inputElement;
        if (this.CheckSrcElementTagName) {
            var tagName = this.el.nativeElement.children[0].tagName;
            switch (ev.code) {
                case 'Delete':
                case 'Backspace':
                    if (this.riGrid.FunctionUpdateSupport) {
                        if (this.ColumnUpdateSupport) {
                            if (this.riGrid.Mode === MntConst.eModeNormal) {
                                this.riGrid.Mode = MntConst.eModeUpdate;
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
                    if (this.riGrid.FunctionTabSupport) {
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
                    if (this.riGrid.FunctionTabSupport) {
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
    };
    GridColumnComponent.prototype.cellOnClick = function (ev) {
        var _this = this;
        if (this.clickEvent) {
            clearTimeout(this.clickEvent);
        }
        this.clickEvent = setTimeout(function () {
            if (_this.riGrid.Enable) {
                var tagName = _this.el.nativeElement.children[0].tagName;
                if (_this.el.nativeElement.parentElement.tagName === 'TH') {
                    var gridCell = void 0;
                    if (tagName === 'IMG' || tagName === 'SPAN') {
                        gridCell = _this.el.nativeElement.parentElement;
                    }
                    else {
                        gridCell = _this.el.nativeElement;
                    }
                    if (gridCell) {
                        if (_this.ColumnOrderable) {
                            _this.riGrid.HeaderClickedColumn = _this.ColumnName;
                            _this.riGrid.headerClick.emit(ev);
                        }
                    }
                }
                else {
                    if (_this.CheckSrcElementTagName || _this.CellData.drillDown || _this.ColumnDrillDown) {
                        _this.cellOnFocus(ev);
                        if (_this.riGrid.FunctionUpdateSupport) {
                            if (_this.riGrid.Mode === MntConst.eModeNormal && _this.ColumnName) {
                                if (_this.ColumnUpdateSupport) {
                                    if (_this.el.nativeElement.tagName === 'INPUT') {
                                        _this.el.nativeElement.children[0].select();
                                        if (_this.cellType === 'checkbox') {
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                        _this.riGrid.bodyClick.emit(ev);
                    }
                }
            }
            else {
                if (_this.riGrid.Mode === MntConst.eModeUpdate) {
                    if (_this.blnBodyBeforeDeactivate) {
                        return;
                    }
                }
            }
        }, 200);
    };
    GridColumnComponent.prototype.cellOnDoubleClick = function (ev) {
        clearTimeout(this.clickEvent);
        if (this.CheckSrcElementTagName || this.CellData.drillDown) {
            this.cellOnFocus(ev);
            this.riGrid.bodyDblClick.emit(ev);
        }
    };
    GridColumnComponent.prototype.pageKeyUp = function (event) {
        if (event.code === 'Escape') {
            if (this.riGrid.FunctionUpdateSupport) {
                if (this.riGrid.Mode === MntConst.eModeUpdate) {
                    this.riGrid.Mode = MntConst.eModeNormal;
                    if (this.el.nativeElement.parentElement) {
                        if (this.el.nativeElement.parentElement.parentElement) {
                            if (this.el.nativeElement.parentElement.parentElement.parentElement) {
                                if (this.el.nativeElement.parentElement.parentElement.parentElement.parentElement) {
                                    if (this.el.nativeElement.parentElement.parentElement.parentElement.parentElement.children[1]) {
                                        var tableBody = this.el.nativeElement.parentElement.parentElement.parentElement.parentElement.children[1];
                                        var tableRow = tableBody.children[this.riGrid.CurrentRow];
                                        this.RestorePreviousValues(tableRow);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    GridColumnComponent.prototype.SavePreviousValues = function (rHTMLTableRow) {
        var lHTMLTableCell;
        var lHTMLUnknownElement;
        var obj = {};
        for (var i = 0; i < rHTMLTableRow.cells.length; i++) {
            lHTMLTableCell = rHTMLTableRow.cells[i].children[0];
            if (lHTMLTableCell.children[0]) {
                lHTMLUnknownElement = lHTMLTableCell.children[0];
            }
            this.riGrid.previousValues[i] = new Object();
            switch (lHTMLUnknownElement.tagName) {
                case 'INPUT':
                    var lHTMLInputElement = lHTMLUnknownElement;
                    var val = void 0;
                    if (lHTMLInputElement.type === 'checkbox') {
                        val = lHTMLInputElement.checked;
                    }
                    else {
                        val = lHTMLInputElement.value;
                    }
                    obj = {
                        id: lHTMLInputElement.id,
                        value: val
                    };
                    console.log('previousValues', obj);
                    this.riGrid.previousValues[i] = obj;
                    break;
                case 'TEXTAREA':
                    var lHTMLTextAreaElement = lHTMLUnknownElement;
                    obj = {
                        id: lHTMLTextAreaElement.id,
                        value: lHTMLTextAreaElement.value
                    };
                    this.riGrid.previousValues[i] = obj;
                    break;
            }
        }
    };
    GridColumnComponent.prototype.RestorePreviousValues = function (rHTMLTableRow) {
        var tableCell;
        var element;
        for (var i = 0; i < rHTMLTableRow.cells.length; i++) {
            tableCell = rHTMLTableRow.cells[i].children[0];
            if (tableCell.children[0]) {
                element = tableCell.children[0];
            }
            switch (element.tagName) {
                case 'INPUT':
                    var inputElement = element;
                    if (inputElement.type === 'checkbox') {
                        inputElement.checked = Boolean(this.riGrid.previousValues[i].value);
                    }
                    else {
                        inputElement.value = this.riGrid.previousValues[i].value;
                    }
                    if (this.riGrid.colArray[i].columnUpdateSupport) {
                        this.renderer.setElementClass(inputElement, 'error', false);
                    }
                    break;
                case 'TEXTAREA':
                    var textAreaElement = element;
                    textAreaElement.value = this.riGrid.previousValues[i].value;
                    if (this.riGrid.colArray[i].columnUpdateSupport) {
                        this.renderer.setElementClass(textAreaElement, 'error', false);
                    }
                    break;
            }
        }
    };
    GridColumnComponent.prototype.setInputValue = function (data) {
        this.cellDataOnChange();
        var event = new Object();
        var oldValue = this.el.nativeElement.children[0].value;
        this.el.nativeElement.children[0].value = data[this.Ellipsis.returnObject];
        event.srcElement = this.el.nativeElement.children[0];
        event.srcElement.focus();
    };
    GridColumnComponent.prototype.convertCellDataToString = function (colType) {
        var strValue;
        var fieldValue;
        if (this.riGrid.Mode === MntConst.eModeUpdate) {
            if (this.cellType === 'input' || this.cellType === 'ellipsis') {
                fieldValue = this.el.nativeElement.children[0].value;
            }
        }
        else {
            fieldValue = this.CellData.text;
            if (fieldValue === '<riTag locked>') {
                return strValue = '';
            }
        }
        strValue = fieldValue ? fieldValue : '';
        switch (colType) {
            case MntConst.eTypeCheckBox:
                var dataValue = fieldValue.toUpperCase();
                strValue = false;
                if (dataValue === 'YES' || dataValue === 'TRUE') {
                    strValue = true;
                }
                break;
            case MntConst.eTypeCurrency:
                strValue = isNaN(fieldValue) ? fieldValue : this.utils.cCur(fieldValue);
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
                    if (fieldValue.indexOf(':') === -1) {
                        strValue = fieldValue ? this.utils.secondsToHms(fieldValue) : '';
                    }
                }
                else {
                    strValue = fieldValue ? this.formatTime(fieldValue) : '';
                }
                break;
            case MntConst.eTypeCode:
                strValue = fieldValue.toUpperCase();
                break;
            case MntConst.eTypeInteger:
                strValue = fieldValue ? Math.round(fieldValue) : '';
                break;
            case MntConst.eTypeDecimal1:
                strValue = fieldValue ? (Math.round(parseFloat(fieldValue) * 10) / 10).toFixed(1) : '';
                break;
            case MntConst.eTypeDecimal2:
                strValue = fieldValue ? (Math.round(parseFloat(fieldValue) * 100) / 100).toFixed(2) : '';
                break;
            case MntConst.eTypeDecimal3:
                strValue = fieldValue ? (Math.round(parseFloat(fieldValue) * 1000) / 1000).toFixed(3) : '';
                break;
            case MntConst.eTypeDecimal4:
                strValue = fieldValue ? (Math.round(parseFloat(fieldValue) * 10000) / 10000).toFixed(4) : '';
                break;
            case MntConst.eTypeDecimal5:
                strValue = fieldValue ? (Math.round(parseFloat(fieldValue) * 100000) / 100000).toFixed(5) : '';
                break;
            case MntConst.eTypeDecimal6:
                strValue = fieldValue ? (Math.round(parseFloat(fieldValue) * 1000000) / 1000000).toFixed(6) : '';
                break;
            default:
                strValue = fieldValue;
                break;
        }
        return strValue;
    };
    Object.defineProperty(GridColumnComponent.prototype, "CheckSrcElementTagName", {
        get: function () {
            var objEvent;
            var tagName = this.el.nativeElement.children[0].tagName;
            var isElementTagName = false;
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
        },
        enumerable: true,
        configurable: true
    });
    GridColumnComponent.prototype.isError = function (ele, colType) {
        var isInvalid = false;
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
            case MntConst.eTypeTime:
            case MntConst.eTypeTimeNow:
                isInvalid = this.validateTimeFormat(ele.value);
                break;
        }
        this.renderer.setElementClass(ele, 'error', isInvalid);
        return isInvalid;
    };
    GridColumnComponent.prototype.formatTime = function (time) {
        var formattedTime;
        var firstDta, secondDta;
        if (time.indexOf(':') === -1) {
            var result = '';
            var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            firstDta = parseInt(time[0] + time[1], 10);
            secondDta = parseInt(time[2] + time[3], 10);
            if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && time.length === 4) {
                formattedTime = time[0] + time[1] + ':' + time[2] + time[3];
            }
        }
        else {
            firstDta = time.split(':')[0];
            secondDta = time.split(':')[1];
            if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) || time.length !== 5) {
                formattedTime = time;
            }
        }
        return formattedTime;
    };
    GridColumnComponent.prototype.validateTimeFormat = function (time) {
        var isInvalid = false;
        var firstDta, secondDta;
        if (time.indexOf(':') === -1) {
            var result = '';
            var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            firstDta = parseInt(time[0] + time[1], 10);
            secondDta = parseInt(time[2] + time[3], 10);
            if (!(((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && time.length === 4)) {
                isInvalid = true;
            }
        }
        else {
            firstDta = time.split(':')[0];
            secondDta = time.split(':')[1];
            if (!((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) || time.length !== 5) {
                isInvalid = true;
            }
        }
        return isInvalid;
    };
    GridColumnComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-grid-cell',
                    templateUrl: 'grid-cell.html'
                },] },
    ];
    GridColumnComponent.ctorParameters = [
        { type: ElementRef, },
        { type: Renderer, },
        { type: Utils, },
        { type: GridAdvancedComponent, },
    ];
    GridColumnComponent.propDecorators = {
        'innerText': [{ type: ViewChild, args: ['Text',] },],
        'input': [{ type: ViewChild, args: ['Input',] },],
        'checkbox': [{ type: ViewChild, args: ['Checkbox',] },],
        'button': [{ type: ViewChild, args: ['Button',] },],
        'image': [{ type: ViewChild, args: ['Image',] },],
        'textarea': [{ type: ViewChild, args: ['Textarea',] },],
        'select': [{ type: ViewChild, args: ['DropDown',] },],
        'sortIcon': [{ type: ViewChild, args: ['SortIcon',] },],
        'ColumnAlign': [{ type: Input },],
        'ColumnSize': [{ type: Input },],
        'ColumnBiDirectionalSort': [{ type: Input },],
        'ColumnDescription': [{ type: Input },],
        'ColumnDrillDown': [{ type: Input },],
        'ColumnInputID': [{ type: Input },],
        'ColumnInputName': [{ type: Input },],
        'ColumnName': [{ type: Input },],
        'ColumnOrderable': [{ type: Input },],
        'ColumnRequired': [{ type: Input },],
        'ColumnScreen': [{ type: Input },],
        'ColumnTabSupport': [{ type: Input },],
        'ColumnType': [{ type: Input },],
        'ColumnUpdateSupport': [{ type: Input },],
        'CellData': [{ type: Input },],
        'ParentHTML': [{ type: Input },],
        'Ellipsis': [{ type: Input },],
        'Dropdown': [{ type: Input },],
        'RowIndex': [{ type: Input },],
        'CellIndex': [{ type: Input },],
        'cellOnKeyDown': [{ type: HostListener, args: ['keydown', ['$event'],] },],
        'cellOnClick': [{ type: HostListener, args: ['click', ['$event'],] },],
        'cellOnDoubleClick': [{ type: HostListener, args: ['dblclick', ['$event'],] },],
    };
    return GridColumnComponent;
}());
