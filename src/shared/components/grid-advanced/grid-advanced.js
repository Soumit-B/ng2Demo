import { MntConst } from './../../services/riMaintenancehelper';
import { Component, EventEmitter, Output, ElementRef, Renderer, HostListener, ViewChild } from '@angular/core';
export var GridAdvancedComponent = (function () {
    function GridAdvancedComponent(el, rendrer) {
        this.el = el;
        this.rendrer = rendrer;
        this.onSuccess = new EventEmitter();
        this.TRClick = new EventEmitter();
        this.TRDblClick = new EventEmitter();
        this.headerClick = new EventEmitter();
        this.bodyClick = new EventEmitter();
        this.bodyDblClick = new EventEmitter();
        this.bodyKeyDown = new EventEmitter();
        this.columnLookUpRequested = new EventEmitter();
        this.bodyColumnFocus = new EventEmitter();
        this.bodyColumnBlur = new EventEmitter();
        this.tempArray = [];
        this.totalColSize = 0;
        this.nCurRow = 0;
        this.nCurCell = 0;
        this.bFunctionUpdateSupport = false;
        this.bFunctionPaging = false;
        this.bFunctionTabSupport = false;
        this.bHighlightBar = false;
        this.bHidePageNumber = false;
        this.nMode = MntConst.eModeNormal;
        this.strHeaderClickedColumn = '';
        this.bDescendingSort = true;
        this.nStartColumn = -1;
        this.nStartRow = -1;
        this.bUpdate = false;
        this.bUpdateHeader = true;
        this.bUpdateBody = true;
        this.bUpdateFooter = true;
        this.bUpdateRow = false;
        this.loadingGrid = false;
        this.previousValues = [];
        this.colArray = [];
        this.headerArray = [];
        this.bodyArray = [];
        this.footerArray = [];
        this.Enable = true;
        this.HTMLCellIndex = 0;
        this.Details = {
            context: this,
            AdditionalPropertyContains: function (strColumnName, strContains) {
                var gridBody = this.context.HTMLGridBody;
                var selectedRow = gridBody.children[this.context.CurrentRow];
                var isContained = false;
                for (var j = 0; j < selectedRow.children.length; j++) {
                    if (selectedRow.children[j].getAttribute('name') === strColumnName) {
                        if (selectedRow.children[j].getAttribute('additionalProperty').indexOf(strContains) > 0) {
                            isContained = true;
                        }
                        break;
                    }
                }
                return isContained;
            },
            Focus: function (strColumnName) {
            },
            GetAttribute: function (strColumnName, strAttribute) {
                var gridBody = this.context.HTMLGridBody;
                var selectedRow = gridBody.children[this.context.CurrentRow];
                var outputValue;
                for (var j = 0; j < selectedRow.children.length; j++) {
                    if (selectedRow.children[j].getAttribute('name') === strColumnName) {
                        switch (strAttribute.toLowerCase()) {
                            case 'additionalproperty':
                                outputValue = selectedRow.children[j].getAttribute('additionalProperty');
                                break;
                            case 'rowid':
                                outputValue = selectedRow.children[j].getAttribute('rowid');
                                break;
                            case 'title':
                                outputValue = selectedRow.children[j].getAttribute('title');
                                break;
                        }
                        break;
                    }
                }
                return outputValue;
            },
            GetValue: function (strColumnName) {
                var gridBody = this.context.HTMLGridBody;
                var selectedRow = gridBody.children[this.context.CurrentRow];
                var outputValue;
                for (var j = 0; j < selectedRow.children.length; j++) {
                    if (selectedRow.children[j].getAttribute('name') === strColumnName) {
                        var selectedCell = selectedRow.children[j].children[0].children[0];
                        if (selectedCell.tagName === 'INPUT' || selectedCell.tagName === 'TEXTAREA') {
                            outputValue = selectedCell.value;
                        }
                        else {
                            outputValue = selectedCell.innerText;
                        }
                    }
                }
                return outputValue;
            },
            SetValue: function (strColumnName, strValue) {
                var gridBody = this.context.HTMLGridBody;
                var selectedRow = gridBody.children[this.context.CurrentRow];
                for (var j = 0; j < selectedRow.children.length; j++) {
                    if (selectedRow.children[j].getAttribute('name') === strColumnName) {
                        var selectedCell = selectedRow.children[j].children[0].children[0];
                        if (selectedCell.tagName === 'INPUT' || selectedCell.tagName === 'TEXTAREA') {
                            selectedCell.value = strValue;
                        }
                        else {
                            selectedCell.innerText = strValue;
                        }
                    }
                }
            },
            Warning: function (strColumnName) {
            }
        };
    }
    ;
    GridAdvancedComponent.prototype.ngAfterViewChecked = function () {
        if (this.HTMLGridBody && this.loadingGrid) {
            this.loadingGrid = false;
            this.onSuccess.emit();
        }
    };
    Object.defineProperty(GridAdvancedComponent.prototype, "CurrentColumnName", {
        get: function () {
            return this.strColumnName;
        },
        set: function (value) {
            this.strColumnName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "CurrentColumnValue", {
        get: function () {
            return this.strColumnValue;
        },
        set: function (value) {
            this.strColumnValue = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "CurrentRow", {
        get: function () {
            return this.nCurRow;
        },
        set: function (value) {
            this.nCurRow = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "CurrentCell", {
        get: function () {
            return this.nCurCell;
        },
        set: function (value) {
            this.nCurCell = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "DefaultBorderColor", {
        set: function (value) {
            if (value) {
                this.strBorderColor = '2px solid #' + value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "DefaultTextColor", {
        set: function (value) {
            if (value) {
                this.strTextColor = '#' + value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "FunctionPaging", {
        get: function () {
            return this.bFunctionPaging;
        },
        set: function (value) {
            this.bFunctionPaging = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "FunctionUpdateSupport", {
        get: function () {
            return this.bFunctionUpdateSupport;
        },
        set: function (value) {
            this.bFunctionUpdateSupport = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "FunctionTabSupport", {
        get: function () {
            return this.bFunctionTabSupport;
        },
        set: function (value) {
            this.bFunctionTabSupport = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "HeaderClickedColumn", {
        get: function () {
            return this.strHeaderClickedColumn;
        },
        set: function (value) {
            if (this.strHeaderClickedColumn === '') {
                this.strHeaderClickedColumn = value;
                this.DescendingSort = !this.DescendingSort;
            }
            else if (this.GetColumnByName(value).ColumnBiDirectionalSort) {
                if (this.strHeaderClickedColumn === '') {
                    this.strHeaderClickedColumn = value;
                    this.DescendingSort = !this.DescendingSort;
                }
                else {
                    this.strHeaderClickedColumn = value;
                    this.DescendingSort = false;
                }
            }
            else {
                this.strHeaderClickedColumn = value;
                this.DescendingSort = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "DescendingSort", {
        get: function () {
            return this.bDescendingSort;
        },
        set: function (value) {
            this.bDescendingSort = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "HighlightBar", {
        get: function () {
            return this.bHighlightBar;
        },
        set: function (value) {
            this.bHighlightBar = value;
            ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "HidePageNumber", {
        get: function () {
            return this.bHidePageNumber;
        },
        set: function (value) {
            this.bHidePageNumber = value;
            ;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "Mode", {
        get: function () {
            return this.nMode;
        },
        set: function (value) {
            this.nMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "PageSize", {
        get: function () {
            return this.nPageSize;
        },
        set: function (value) {
            this.nPageSize = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "RowID", {
        get: function () {
            return this.strRowID;
        },
        set: function (value) {
            this.strRowID = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "Update", {
        get: function () {
            return this.bUpdate;
        },
        set: function (value) {
            this.bUpdate = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "UpdateHeader", {
        get: function () {
            return this.bUpdateHeader;
        },
        set: function (value) {
            this.bUpdateHeader = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "UpdateBody", {
        get: function () {
            return this.bUpdateBody;
        },
        set: function (value) {
            this.bUpdateBody = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "UpdateFooter", {
        get: function () {
            return this.bUpdateFooter;
        },
        set: function (value) {
            this.bUpdateFooter = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "UpdateRow", {
        get: function () {
            return this.bUpdateRow;
        },
        set: function (value) {
            this.bUpdateRow = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "StartColumn", {
        get: function () {
            return this.nStartColumn;
        },
        set: function (value) {
            this.nStartColumn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "StartRow", {
        get: function () {
            return this.nStartRow;
        },
        set: function (value) {
            this.nStartRow = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "HTMLGridBody", {
        get: function () {
            var gridTable = this.el.nativeElement.children[0];
            if (gridTable.children[1]) {
                return gridTable.children[1];
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "CurrentHTMLRow", {
        get: function () {
            var gridTable = this.el.nativeElement.children[0];
            var gridRow;
            if (gridTable.children[1]) {
                var gridBody = gridTable.children[1];
                gridRow = gridBody.children[this.CurrentRow];
            }
            return gridRow;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridAdvancedComponent.prototype, "CurrentHTMLCell", {
        get: function () {
            var gridTable = this.el.nativeElement.children[0];
            var gridBody, gridRow, gridCell;
            if (gridTable.children[1]) {
                var gridBody_1 = gridTable.children[1];
                gridRow = gridBody_1.children[this.CurrentRow];
                gridCell = gridRow.children[this.CurrentCell];
            }
            return gridCell;
        },
        enumerable: true,
        configurable: true
    });
    GridAdvancedComponent.prototype.RefreshRequired = function () {
        this.UpdateHeader = true;
        this.UpdateBody = true;
        this.UpdateFooter = true;
    };
    GridAdvancedComponent.prototype.ResetGrid = function () {
        this.headerArray = [];
        this.bodyArray = [];
        this.footerArray = [];
    };
    Object.defineProperty(GridAdvancedComponent.prototype, "SortOrder", {
        get: function () {
            var order = 'Descending';
            if (!this.DescendingSort) {
                order = 'Ascending';
            }
            return order;
        },
        enumerable: true,
        configurable: true
    });
    GridAdvancedComponent.prototype.AddColumn = function (strColumnName, strColumnInputID, strColumnInputName, eColumnType, intColumnSize, blnColumnDrillDown, strColumnDescription) {
        var column = {
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
    };
    GridAdvancedComponent.prototype.AddColumnAlign = function (strColumnName, eColumnAlign) {
        for (var i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnAlign = eColumnAlign;
            }
        }
    };
    GridAdvancedComponent.prototype.AddColumnNoWrap = function (strColumnName, NoWrap) {
        for (var i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].noWrap = NoWrap;
            }
        }
    };
    GridAdvancedComponent.prototype.AddColumnOrderable = function (strColumnName, blnColumnOrderable, blnBiDirectionalSort) {
        for (var i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnOrderable = blnColumnOrderable;
                this.tempArray[i].columnBiDirectionalSort = false;
                if (blnBiDirectionalSort) {
                    this.tempArray[i].columnBiDirectionalSort = blnBiDirectionalSort;
                }
            }
        }
    };
    GridAdvancedComponent.prototype.AddColumnRequired = function (strColumnName, blnColumnRequired) {
        for (var i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnRequired = blnColumnRequired;
            }
        }
    };
    GridAdvancedComponent.prototype.AddColumnScreen = function (strColumnName, blnScreen) {
        for (var i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                if (!blnScreen) {
                    this.tempArray.splice(i, 1);
                }
            }
        }
    };
    GridAdvancedComponent.prototype.AddColumnTabSupport = function (strColumnName, blnColumnTabSupport) {
        for (var i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnTabSupport = blnColumnTabSupport;
            }
        }
    };
    GridAdvancedComponent.prototype.AddColumnUpdateSupport = function (strColumnName, blnColumnUpdateSupport) {
        for (var i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                this.tempArray[i].columnUpdateSupport = blnColumnUpdateSupport;
            }
        }
    };
    GridAdvancedComponent.prototype.AddEllipsisControl = function (strColumnName, ellipsisComponent, returnObjectName) {
        for (var i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                var ellipsisObj = ({
                    component: ellipsisComponent,
                    returnObject: returnObjectName
                });
                this.tempArray[i].ellipsis = ellipsisObj;
            }
        }
    };
    GridAdvancedComponent.prototype.AddDropDownData = function (strColumnName, objData, strValueName, strDescName, blnDisabled, blnRequired) {
        for (var i = 0; i < this.tempArray.length; i++) {
            if (this.tempArray[i].columnName === strColumnName) {
                var dropDownObj = ({
                    value: strValueName,
                    desc: strDescName,
                    dataObject: objData,
                    isDisabled: blnDisabled ? blnDisabled : false,
                    isRequired: blnRequired ? blnRequired : false
                });
                this.tempArray[i].dropdown = dropDownObj;
            }
        }
    };
    GridAdvancedComponent.prototype.Clear = function () {
        this.colArray = [];
        this.tempArray = [];
        this.ResetGrid();
    };
    GridAdvancedComponent.prototype.Complete = function () {
        this.colArray = Array.from(this.tempArray);
        this.tempArray = null;
        this.CalculateColumnWidth();
    };
    GridAdvancedComponent.prototype.DisableButtons = function () {
    };
    GridAdvancedComponent.prototype.EnableButtons = function () {
    };
    GridAdvancedComponent.prototype.Execute = function (objData) {
        var chunk = this.colArray.length;
        this.loadingGrid = true;
        if (objData.pageData) {
            this.currentPage = objData.pageData.pageNumber;
            this.totalPages = objData.pageData.lastPageNumber;
        }
        if (this.UpdateHeader) {
            this.headerArray = [];
            if (objData.header && objData.header.cells && objData.header.cells.length > 0) {
                var headerData = objData.header.cells;
                var spancounter = 0, colspan = void 0, startIndex = 0;
                if (objData.header.title[0].title) {
                    this.tableTitle = objData.header.title[0].title;
                }
                for (var k = 0; k < headerData.length; k++) {
                    colspan = headerData[k].colSpan;
                    headerData[k].colObject = {};
                    spancounter += colspan;
                    if (spancounter === chunk) {
                        if (k + 1 === headerData.length) {
                            for (var i = 0; i < this.colArray.length; i++) {
                                headerData[k].colObject = this.colArray[i];
                            }
                        }
                        this.headerArray.push(headerData.slice(startIndex, k + 1));
                        startIndex = k + 1;
                        spancounter = 0;
                    }
                    ;
                }
            }
            this.UpdateHeader = false;
        }
        if (this.UpdateBody) {
            this.bodyArray = [];
            if (objData.body && objData.body.cells && objData.body.cells.length > 0) {
                var bodyData = objData.body.cells;
                var rCounter = -1;
                if (chunk > 0) {
                    for (var i = 0, j = bodyData.length; i < j; i += chunk) {
                        ++rCounter;
                        this.bodyArray.push(bodyData.slice(i, i + chunk));
                    }
                }
            }
            this.UpdateBody = false;
        }
        if (this.UpdateFooter) {
            this.footerArray = [];
            if (objData.footer && objData.footer.cells && objData.footer.cells.length > 0) {
                var footerData = objData.footer.cells;
                if (chunk > 0) {
                    for (var i = 0, j = footerData.length; i < j; i += chunk) {
                        this.footerArray.push(footerData.slice(i, i + chunk));
                    }
                }
            }
            this.UpdateFooter = false;
        }
    };
    GridAdvancedComponent.prototype.SetDefaultFocus = function () {
        var eleFocused = false;
        for (var i = 0; i < this.HTMLGridBody.children.length; i++) {
            for (var j = 0; j < this.colArray.length; j++) {
                var element = this.HTMLGridBody.children[i].children[j].children[0].children[0];
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'CHECKBOX') {
                    if (this.colArray[j].columnUpdateSupport) {
                        element.focus();
                        element.select();
                        eleFocused = true;
                    }
                }
                if (eleFocused)
                    break;
            }
            if (eleFocused)
                break;
        }
    };
    GridAdvancedComponent.prototype.SetRecordType = function (eRecordTypeRecordPerRow) {
    };
    GridAdvancedComponent.prototype.CalculateColumnWidth = function () {
        for (var j = 0; j < this.colArray.length; j++) {
            this.colArray[j].columnWidth = (100 / this.totalColSize) * this.colArray[j].columnSize;
        }
    };
    GridAdvancedComponent.prototype.GetColumnByName = function (colName) {
        for (var j = 0; j < this.colArray.length; j++) {
            if (this.colArray[j].columnName === colName) {
                return this.colArray[j];
            }
        }
    };
    GridAdvancedComponent.prototype.rowOnClick = function (ev) {
        var _this = this;
        if (this.clickEvent) {
            clearTimeout(this.clickEvent);
        }
        this.clickEvent = setTimeout(function () {
            _this.gridCell.cellOnFocus(ev);
            _this.TRClick.emit(ev);
        }, 200);
    };
    GridAdvancedComponent.prototype.rowOnDoubleClick = function (ev) {
        clearTimeout(this.clickEvent);
        this.gridCell.cellOnFocus(ev);
        this.TRDblClick.emit(ev);
    };
    GridAdvancedComponent.prototype.rowOnHover = function (ev) {
        var objHTMLTableRow, objHTMLTableCell;
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
                    for (var i = 0; i < objHTMLTableRow.cells.length; i++) {
                        objHTMLTableCell = objHTMLTableRow.children[i];
                        objHTMLTableCell.setAttribute('riOldColor', objHTMLTableCell.style.backgroundColor);
                        objHTMLTableCell.style.backgroundColor = null;
                        objHTMLTableCell.setAttribute('riOldClassName', objHTMLTableCell.className);
                        objHTMLTableCell.className = 'riGridBodyHighLightBar';
                    }
                }
            }
        }
    };
    GridAdvancedComponent.prototype.rowOnHoverLost = function (ev) {
        var objHTMLTableRow, objHTMLTableCell;
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
                    for (var i = 0; i < objHTMLTableRow.cells.length; i++) {
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
    };
    GridAdvancedComponent.prototype.keyup = function (ev) {
        this.gridCell.pageKeyUp(ev);
    };
    GridAdvancedComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-grid-advanced',
                    templateUrl: 'grid-advanced.html'
                },] },
    ];
    GridAdvancedComponent.ctorParameters = [
        { type: ElementRef, },
        { type: Renderer, },
    ];
    GridAdvancedComponent.propDecorators = {
        'gridCell': [{ type: ViewChild, args: ['gridcell',] },],
        'onSuccess': [{ type: Output },],
        'TRClick': [{ type: Output },],
        'TRDblClick': [{ type: Output },],
        'headerClick': [{ type: Output },],
        'bodyClick': [{ type: Output },],
        'bodyDblClick': [{ type: Output },],
        'bodyKeyDown': [{ type: Output },],
        'columnLookUpRequested': [{ type: Output },],
        'bodyColumnFocus': [{ type: Output },],
        'bodyColumnBlur': [{ type: Output },],
        'keyup': [{ type: HostListener, args: ['keyup', ['$event'],] },],
    };
    return GridAdvancedComponent;
}());
