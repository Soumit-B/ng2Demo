import { HttpService } from './../../services/http-service';
import { Component, NgZone, Input, Output, EventEmitter, OnInit, AfterViewInit, OnChanges, OnDestroy } from '@angular/core';
import { RiExchange } from '../../../shared/services/riExchange';
import { Utils } from '../../../shared/services/utility';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'icabs-dropdown',
    template: `
        <div [id]="randomId" [ngClass]="{'required': isRequired, 'error': isError }">
            <ng-select [allowClear]="allowClear" [items]="items" [active]=[active] [disabled]="disabled" (data)="refreshValue($event)" (selected)="selected($event)" (removed)="removed($event)" (typed)="typed($event)" [placeholder]="placeholder">
            </ng-select>
        </div>
    `
})
export class DropdownComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    constructor(private searchService: HttpService, private zone: NgZone, private riExchange: RiExchange, private utils: Utils) { }
    @Input() public inputArray: Array<any>;
    @Input() public url: string;
    @Input() public seperator: string = ' - ';
    @Input() public itemsToDisplay: Array<string>;
    @Input() public allowClear: boolean = false;
    @Input() public showUnique: boolean = true;
    @Input() public disabled: boolean;
    @Input() public active: any;
    @Input() public isRequired: boolean;
    @Input() public triggerValidate: boolean;
    @Input() public uiFormGroup: any;
    @Input() public controlName: string;
    @Input() public isFirstItemSelected: boolean;
    @Output() selectedValue = new EventEmitter();

    public placeholder: string;
    public items: Array<any> = null;
    public isError: boolean = false;
    public randomId: string = '';
    private currentSelection: any;
    private value: any = {};
    private onFocusRef: any;
    private onBlurRef: any;
    private itemsClone: any;

    public ngOnInit(): any {
        if (this.inputArray !== null && this.inputArray !== undefined) {
            this.drawComponent();
        }

        if (this.disabled === null || this.disabled === undefined) {
            this.disabled = false;
        }

        if (this.active === null || this.active === undefined) {
            this.active = {
                id: '',
                text: ''
            };
        }

        if (this.isRequired === null || this.isRequired === undefined) {
            this.isRequired = false;
        }
        this.currentSelection = this.active;
        this.randomId = 'id' + (Math.floor(Math.random() * 90000) + 10000).toString();

        if (window['Element']) {
            window['Element'].prototype.matches = window['Element'].prototype.matches ||
                window['Element'].prototype.matchesSelector ||
                window['Element'].prototype.webkitMatchesSelector ||
                window['Element'].prototype.msMatchesSelector ||
                function (selector: any): any {
                    let node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
                    while (nodes[++i] && nodes[i] !== node);
                    return !!nodes[i];
                };
        }
        if (this.uiFormGroup && this.controlName) {
            if (this.uiFormGroup.controls && this.uiFormGroup.controls[this.controlName]) {
                this.uiFormGroup.controls[this.controlName].statusChanges.subscribe((value) => {
                    if (this.uiFormGroup.controls[this.controlName].invalid === true && this.uiFormGroup.controls[this.controlName].dirty === true) {
                        this.isError = true;
                    } else {
                        this.isError = false;
                    }
                });
            }
        }

    }

    ngAfterViewInit(): any {
        this.validate({});
        if (this.inputArray && this.active && this.active.text !== '') {
            for (let i = 0; i < this.inputArray.length; i++) {
                if (this.inputArray[i].riCountryCode) {
                    this.active.text = this.active.text + this.seperator + this.inputArray['riCountryDescription'];
                    break;
                } else if (this.inputArray[i].code) {
                    this.active.text = this.active.text + this.seperator + this.inputArray['desc'];
                    break;
                }
            }
        }
        this.onFocusRef = this.dropdownFocus.bind(this);
        this.onBlurRef = this.dropdownBlur.bind(this);
        this.live('#' + this.randomId + ' li:last-child .dropdown-item', 'blur', (el: any, event: any) => {
            document.querySelector('body').click();
        }, document.querySelector('#' + this.randomId));
        if (this.randomId) {
            let elem = document.querySelector('#' + this.randomId + ' .ui-select-container');
            if (elem) {
                elem.addEventListener('focus', this.onFocusRef);
                elem.addEventListener('blur', this.onBlurRef);
                if (this.disabled === true) {
                    elem.setAttribute('tabindex', '-1');
                } else {
                    elem.setAttribute('tabindex', '0');
                }
            }
        }
    }

    ngOnChanges(change: any): void {
        if (this.inputArray !== null && this.inputArray !== undefined) {
            this.drawComponent();
        }
        if (change.active) {
            this.currentSelection = this.active;
        }
        this.validate({});

        if (this.randomId) {
            let elem = document.querySelector('#' + this.randomId + ' .ui-select-container');
            if (elem) {
                if (this.disabled === true) {
                    elem.setAttribute('tabindex', '-1');
                } else {
                    elem.setAttribute('tabindex', '0');
                }
            }
        }
    }

    ngOnDestroy(): void {
        if (this.randomId) {
            let elem = document.querySelector('#' + this.randomId + ' .ui-select-container');
            if (elem) {
                elem.removeEventListener('focus', this.onFocusRef);
                elem.removeEventListener('blur', this.onBlurRef);
            }
        }
    }

    public dropdownFocus(event: any): void {
        if (event.relatedTarget && this.utils.hasClass(event.relatedTarget, 'ui-select-search')) {
            return;
        }
        let elem = document.querySelector('#' + this.randomId + ' .ui-select-toggle');
        if (elem && !this.utils.hasClass(elem, 'focus')) {
            this.utils.addClass(elem, 'focus');
        } else {
            setTimeout(() => {
                let textElem = document.querySelector('#' + this.randomId + ' .ui-select-search');
                if (textElem) {
                    textElem['focus']();
                }
            }, 0);
        }
    }

    public dropdownBlur(event: any): void {
        let elem = document.querySelector('#' + this.randomId + ' .ui-select-toggle');
        if (elem && this.utils.hasClass(elem, 'focus')) {
            this.utils.removeClass(elem, 'focus');
        }
        this.validate({}, true);
    }

    public live(selector: any, event: string, callback: any, context?: any): void {
        this.addEvent(context || document, event, function (e: any): void {
            let found, el = e.target || e.srcElement;
            found = el.matches(selector);
            while (el && el.matches && el !== context && !(found)) {
                el = el.parentElement;
                found = el.matches(selector);
            }
            if (found) callback.call(el, e);
        });
    }

    public addEvent(el: any, type: string, handler: any): void {
        el.addEventListener(type, handler, true);
    }

    public updateComponent(data: Array<any>): void {
        this.inputArray = data;
        this.drawComponent();
        if (this.isFirstItemSelected && this.items) {
            if (this.isRequired) {
                if (this.items.length > 0) {
                    this.active = this.items[0];
                }
            }
            else if (this.items.length > 1) {
                this.active = this.items[1];
            }
        }
    }

    public drawComponent(): void {
        try {
            this.items = [];
            if (!this.isRequired) {
                this.items.push({
                    id: (this.inputArray.length + 1),
                    text: ' '
                });
            }
            if (!this.itemsToDisplay) {
                this.items = this.inputArray;
            } else {
                for (let i = 0; i < this.inputArray.length; i++) {
                    let item = this.inputArray[i];
                    let displayText: String = item[this.itemsToDisplay[0]];
                    if (this.itemsToDisplay.length > 1) {
                        for (let j = 1; j < this.itemsToDisplay.length; j++) {
                            displayText = displayText + this.seperator + item[this.itemsToDisplay[j]];
                        }
                    }
                    this.items.push({
                        id: i + 1,
                        text: displayText
                    });
                };
            }
            this.itemsClone = JSON.parse(JSON.stringify(this.items));
        } catch (e) {
            // catch statement
        }
    }

    public removed(value: any): void {
        if (this.isRequired && document.querySelector('#' + this.randomId + ' .ui-select-search')['value'].toString().trim() === '') {
            this.currentSelection = {
                id: '',
                text: ''
            };
            this.active = {
                id: '',
                text: ''
            };
            this.validate({
                id: ''
            });
        } else {
            this.selectedValue.emit({
                value: ''
            });
        }
    }

    public typed(value: any): void {
        if (value === '') {
            setTimeout(() => {
                document.querySelector('#' + this.randomId + ' .ui-select-search')['value'] = '';
            }, 0);
        } else {
            this.value = value;
            this.validate(value);
        }
    }

    public selected(value: any): void {
        if (!this.itemsToDisplay) {
            this.currentSelection = {
                id: value.id,
                text: value.id
            };
            this.active.text = value.id;
            this.selectedValue.emit({
                value: value.id
            });

        } else {
            // Added to detect empty selection
            let obj = {};
            if (!this.inputArray[value.id - 1]) {
                for (let j = 0; j < this.itemsToDisplay.length; j++) {
                    obj[this.itemsToDisplay[j]] = '';
                }
                obj['isEmpty'] = true;
            }
            this.currentSelection = {
                id: value.id,
                text: this.inputArray[value.id - 1] ? this.inputArray[value.id - 1] : obj
            };
            this.selectedValue.emit({
                value: this.inputArray[value.id - 1] ? this.inputArray[value.id - 1] : obj
            });
        }
        if (this.active && this.active.text) {
            this.active.text = '';
        }
        this.validate(value);
    }

    public validate(value: any, calledFromBlur?: boolean): void {
        setTimeout(() => {
            this.zone.run(() => {
                if (!this.disabled) {
                    let query = '#' + this.randomId + ' .ui-select-match-text';
                    if (document.querySelectorAll(query).length <= 0) {
                        if (this.isRequired && !value['id'] && ((typeof this.currentSelection['text'] === 'string' && !this.currentSelection['text'])) || (typeof this.currentSelection['text'] === 'object' && this.currentSelection['text']['isEmpty'])) {
                            this.isError = true;
                        } else {
                            if (value instanceof Array && value.length < 1) {
                                if (this.isRequired) {
                                    this.isError = true;
                                } else {
                                    this.isError = false;
                                }
                            } else {
                                this.isError = false;
                            }
                        }
                    } else {
                        if (this.isRequired && !value['id'] && ((typeof this.currentSelection['text'] === 'string' && !this.currentSelection['text'])) || (typeof this.currentSelection['text'] === 'object' && this.currentSelection['text']['isEmpty'])) {
                            if (this.triggerValidate || calledFromBlur) {
                                this.isError = true;
                            }
                        } else {
                            this.isError = false;
                        }
                    }
                } else {
                    this.isError = false;
                }
                if (this.isError === true) {
                    if (this.uiFormGroup && this.controlName) {
                        if (this.uiFormGroup.controls && this.uiFormGroup.controls[this.controlName]) {
                            this.uiFormGroup.controls[this.controlName].setValue('');
                            this.uiFormGroup.controls[this.controlName].markAsTouched();
                            this.uiFormGroup.controls[this.controlName].markAsDirty();
                            this.uiFormGroup.controls[this.controlName].updateValueAndValidity();
                        }
                    } else {
                        if (!calledFromBlur) {
                            if (!this.itemsToDisplay) {
                                this.selectedValue.emit({
                                    value: ''
                                });
                            } else {
                                let obj = {};
                                for (let j = 0; j < this.itemsToDisplay.length; j++) {
                                    obj[this.itemsToDisplay[j]] = '';
                                }
                                this.selectedValue.emit({
                                    value: obj
                                });
                            }
                        }
                    }
                }
            });
        }, 200);
    }

    public refreshValue(value: any): void {
        this.validate(value);
    }

}
