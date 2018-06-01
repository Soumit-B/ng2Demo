import { OrderBy } from './../../pipes/orderBy';
import { Observable } from 'rxjs';
import { VariableService } from '../../services/variable.service';
import { Component, Input, Output, EventEmitter, ElementRef, OnInit, NgZone, OnDestroy } from '@angular/core';

// keyboard events
const KEY_DW = 40;
const KEY_RT = 39;
const KEY_UP = 38;
const KEY_LF = 37;
const KEY_ES = 27;
const KEY_EN = 13;
const KEY_TAB = 9;

@Component({
    selector: 'icabs-autocomplete',
    templateUrl: 'autocomplete.html'
})

export class AutocompleteComponent implements OnInit, OnDestroy {
    @Input() public datasource: Array<any> = [];
    @Input() public placeholder: string = 'Search';
    @Input() public autofocus: boolean = true;
    @Input() public pause: number = 100;
    @Input() public minlength: number = 1;
    @Input() public displaySearching: Boolean = true;
    @Input() public displayNoResults: Boolean = true;
    @Input() public textSearching: string = 'Searching';
    @Input() public textNoResults: string = 'No Results Found';
    @Input() public titleField: string;
    @Input() public searchField: string;
    @Input() public descriptionField: string;
    @Input() public autoMatch: boolean = true;
    @Input() public clearSelected: Boolean = false;
    @Input() public focusFirst: Boolean = false;
    @Output() public selected = new EventEmitter<any>();

    private matchClass: Boolean = true;
    private selectedObject: any;
    private selectedObjectData: any;
    public searchStr: string;
    private searchTimer: any = null;
    private showDropdown: Boolean = false;
    private results: Array<any> = [];
    public currentIndex: number = -1;
    private isSearching: boolean = false;
    private nativeElement: any;
    private dropdownElement: any;
    public inputName: string = '';
    public fieldTabindex: number = 0;

    constructor(private el: ElementRef, private zone: NgZone, private orderby: OrderBy, private variableService: VariableService) {
    }

    // ngOnInit - Executed On component initialize
    public ngOnInit(): void {
        this.nativeElement = this.el.nativeElement;
    }

    // ngOnDestroy - Executed On component destroy
    public ngOnDestroy(): void {
        return;
    }

    //Get Method for Dropdown
    private get dropdown(): any {
        return this.el.nativeElement.querySelector('.autocomplete-dropdown');
    }

    //Get Current Dropdown row
    private get dropdownRow(): any {
        return this.el.nativeElement.querySelectorAll('.autocomplete-row')[this.currentIndex];
    }

    //Check if dropdown has Scrolling enabled
    private get isScrollOn(): Boolean {
        let css = getComputedStyle(this.dropdown);
        return css.maxHeight && css.overflowY === 'auto';
    }

    //Get dropdown top of current row
    private get dropdownRowTop(): any {
        return this.dropdownRow.getBoundingClientRect().top -
            (this.dropdown.getBoundingClientRect().top +
                parseInt(getComputedStyle(this.dropdown).paddingTop, 10));
    }

    //Get dropdown height
    private get dropdownHeight(): any {
        return this.dropdown.getBoundingClientRect().top +
            parseInt(getComputedStyle(this.dropdown).maxHeight, 10);
    }

    /**
     * Method - keyupHandler
     * Callback for any key up event
     * Searches text on keypress
     */
    public keyupHandler(event: KeyboardEvent): void {
        let row: any = null;
        let rowTop: any = null;

        if (event.keyCode === KEY_LF || event.keyCode === KEY_RT || event.keyCode === KEY_TAB) {
            // do nothing
            return;
        }
        if (event.keyCode === KEY_UP || event.keyCode === KEY_EN) {
            event.preventDefault();
        }
        else if (event.keyCode === KEY_DW) {
            event.preventDefault();
            if (!this.showDropdown && this.searchStr && this.searchStr.length >= this.minlength) {
                this.initResults();
                this.isSearching = true;
                this.searchTimerComplete(this.searchStr);
            }
        }
        else if (event.keyCode === KEY_ES) {
            // This is very specific to IE10/11 #272
            // without this, IE clears the input text
            event.preventDefault();
        }
        else {
            if (this.minlength === 0 && !this.searchStr) {
                return;
            }

            if (!this.searchStr || this.searchStr === '') {
                this.showDropdown = false;
            } else if (this.searchStr.length >= this.minlength) {
                this.initResults();
                if (this.searchTimer) {
                    this.searchTimer.unsubscribe();
                }
                this.isSearching = true;
                this.searchTimer = Observable.timer(this.pause).subscribe(() => {
                    this.searchTimerComplete(this.searchStr);
                });
            }

            if (!this.clearSelected) {
                this.zone.run(() => {
                    this.callOrAssign();
                });
            }
        }
    }

    /**
     * Method - keydownHandler
     * Callback for any key down event
     * Selects Prev/Next row on arrow
     */
    public keydownHandler(event: KeyboardEvent): void {
        if (event.keyCode === KEY_EN) {
            if (this.currentIndex >= 0 && this.currentIndex < this.results.length) {
                event.preventDefault();
                this.selectResult(this.results[this.currentIndex]);
            } else {
                this.clearResults();
            }
        } else if (event.keyCode === KEY_DW) {
            event.preventDefault();
            this.nextRow();
        } else if (event.keyCode === KEY_UP) {
            event.preventDefault();
            this.prevRow();
        } else if (event.keyCode === KEY_TAB) {
            if (this.results && this.results.length > 0 && this.showDropdown) {
                if (this.currentIndex === -1) {
                    this.currentIndex = 0;
                }
                this.selectResult(this.results[this.currentIndex]);
            }
        } else if (event.keyCode === KEY_ES) {
            // This is very specific to IE10/11 #272
            // without this, IE clears the input text
            event.preventDefault();
        }
    }

    /**
     * Method - searchTimerComplete
     * Callback for event after timer is over
     */
    private searchTimerComplete(str: string): any {
        // Begin the search
        if (!str || str.length < this.minlength) {
            this.isSearching = false;
            return;
        }
        if (this.datasource) {
            this.zone.run(() => {
                let matches: any;
                matches = this.orderby.transform(this.getLocalResults(str), this.searchField);
                this.isSearching = false;
                this.processResults(matches, str);
            });

        }
    }

    /**
     * Method - getLocalResults
     * Callback for getting filtered array
     */
    private getLocalResults(str: any): Array<any> {
        let matches: any[] = [];
        const searchBy = this.searchField ? this.searchField.split(',') : null;
        if (this.searchField !== null && this.searchField !== undefined && str !== '') {
            matches = this.datasource.filter(item => {
                const values: any[] = searchBy ? searchBy.map(searchField => this.extractValue(item, searchField)).filter(value => !!value) : [item];
                return values.some(value => value.toString().toLowerCase().indexOf(str.toString().toLowerCase()) >= 0);
            });
        } else {
            matches = this.datasource;
        }
        return matches;
    }

    /**
     * Method - processResults
     * @param responseData
     * @param str
     * Gets selected object
     */
    private processResults(responseData: string[], str: string): void {
        let formattedText: any, formattedDesc: any;
        if (responseData && responseData.length > 0) {
            this.results = [];

            for (let i = 0; i < responseData.length; i++) {
                if (this.titleField && this.titleField !== '') {
                    formattedText = this.extractTitle(responseData[i]);
                }

                formattedDesc = '';
                if (this.descriptionField) {
                    formattedDesc = this.extractValue(responseData[i], this.descriptionField);
                }

                this.results[this.results.length] = {
                    title: formattedText,
                    description: formattedDesc,
                    originalObject: responseData[i]
                };
            }

        } else {
            this.results = [];
        }

        if (this.autoMatch && this.results.length === 1 &&
            this.checkExactMatch(this.results[0],
                { title: formattedText, desc: formattedDesc || '' }, this.searchStr)) {
            this.showDropdown = false;
        } else if (this.results.length === 0 && !this.displayNoResults) {
            this.showDropdown = false;
        } else {
            this.showDropdown = true;
        }
    }

    /**
     * Method - extractTitle
     * @param data
     * Extracts Title name from Search Object to create array of string
     */
    private extractTitle(data: any): any {
        // split title fields and run extractValue for each and join with ' '
        return this.titleField.split(',')
            .map(field => {
                let val = this.extractValue(data, field);
                return val;
            })
            .join(' ');
    }

    /**
     * Method - extractValue
     * @param obj
     * @param key
     * Extracts value
     */
    private extractValue(obj: any, key: any): any {
        let keys: any, result: any;
        if (key) {
            keys = key.split('.');
            result = obj;
            for (let i = 0; i < keys.length; i++) {
                result = result[keys[i]];
            }
        }
        else {
            result = obj;
        }
        return result;
    }

    /**
     * Method - checkExactMatch
     * @param result
     * @param obj
     * @param str
     * Converts string to lower case to get match
     */
    private checkExactMatch(result: any, obj: Object, str: any): boolean {
        if (!str) { return false; }
        for (let key in obj) {
            if (obj[key].toLowerCase() === str.toLowerCase()) {
                this.selectResult(result);
                return true;
            }
        }
        return false;
    }

    /**
     * Method - selectResult
     * @param result
     * Selects Result on click/,ouse down and emits to parent
     */
    public selectResult(result: any): void {
        // Restore original values
        if (this.matchClass) {
            result.title = this.extractTitle(result.originalObject);
            result.description = this.extractValue(result.originalObject, this.descriptionField);
        }

        if (this.clearSelected) {
            this.searchStr = null;
        }
        else {
            this.searchStr = result.title;
        }
        this.variableService.setAutoCompleteSelection(true);
        this.selected.emit(result);
        this.callOrAssign(result);
        this.clearResults();
    };

    /**
     * Method - hideDropdownList
     * Hide the dropdown list
     */
    public hideDropdownList(): void {
        this.searchStr = '';
        this.showDropdown = false;
    }

    /**
     * Method - initResults
     * Initialize the
     */
    private initResults(): void {
        this.showDropdown = this.displaySearching;
        this.currentIndex = this.focusFirst ? 0 : -1;
        this.results = [];
    }

    /**
     * Method - callOrAssign
     * @param value - optional
     * Calls or Assign the selected object
     */
    private callOrAssign(value?: any): void {
        if (typeof this.selectedObject === 'function') {
            this.selectedObject(value, this.selectedObjectData);
        }
        else {
            this.selectedObject = value;
        }
    }

    /**
     * Method - inputChangeHandler
     * @param str
     * Callback for input change
     */
    public inputChangeHandler(str: any): void {
        if (str.length < this.minlength) {
            this.clearResults();
        }
        else if (str.length === 0 && this.minlength === 0) {
            this.showAll();
        }
    };

    /**
     * Method - updateInputField
     * Updates input field value on arrow down/up event
     */
    private updateInputField(): void {
        let current = this.results[this.currentIndex];
        if (this.matchClass) {
            this.searchStr = this.extractTitle(current.originalObject);
        }
        else {
            this.searchStr = current.title;
        }
    }

    /**
     * Method - showAll
     * Reset searching
     */
    private showAll(): void {
        if (this.datasource) {
            this.isSearching = false;
            this.processResults(this.datasource, '');
        }
    }

    /**
     * Method - clearResults
     * Clears result on each search
     */
    private clearResults(): void {
        this.results = [];
        if (this.showDropdown) {
            this.dropdown.scrollTop = 0;
            this.showDropdown = false;
        }
    }

    /**
     * Method - prevRow
     * Selects Previous row of dropdown list
     */
    private prevRow(): void {
        let rowTop: any;
        if (this.currentIndex >= 1) {
            this.zone.run(() => {
                this.currentIndex--;
                this.updateInputField();
            });

            if (this.isScrollOn) {
                rowTop = this.dropdownRowTop;
                if (rowTop < 0) {
                    this.dropdownScrollTopTo(rowTop - 1);
                }
            }
        }
        else if (this.currentIndex === 0) {
            this.zone.run(() => {
                this.currentIndex = 0;
                this.updateInputField();
            });
        }
    }

    /**
     * Method - nextRow
     * Selects next row of dropdown list
     */
    private nextRow(): void {
        let row: any;
        if ((this.currentIndex + 1) < this.results.length && this.showDropdown) {
            this.zone.run(() => {
                this.currentIndex++;
                this.updateInputField();
            });

            if (this.isScrollOn) {
                row = this.dropdownRow;
                if (this.dropdownHeight < row.getBoundingClientRect().bottom) {
                    this.dropdownScrollTopTo(this.dropdownRowOffsetHeight(row));
                }
            }
        }
    }

    /**
     * Method - hoverRow
     * @param index
     * Highlight row on hover
     */
    public hoverRow(index: any): void {
        this.currentIndex = index;
        //this.updateInputField();
    }

    /**
     * Method - dropdownScrollTopTo
     * @param offset
     * Scrolls to top of dropdown
     */
    private dropdownScrollTopTo(offset: any): void {
        this.dropdown.scrollTop = this.dropdown.scrollTop + offset;
    }

    /**
     * Method - dropdownRowOffsetHeight
     * @param row
     * Calculates height of dropdown
     */
    private dropdownRowOffsetHeight(row: any): any {
        let css = getComputedStyle(row);
        return row.offsetHeight +
            parseInt(css.marginTop, 10) + parseInt(css.marginBottom, 10);
    }

}
