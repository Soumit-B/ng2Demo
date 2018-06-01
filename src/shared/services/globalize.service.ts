import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { GlobalConstant } from '../constants/global.constant';
import * as moment from 'moment';
let Globalize = require('globalize');
let GlobalizeParser = window['GlobalizeParser'];

@Injectable()
export class GlobalizeService {
    private numberFormatter: any;
    private decimalType1Formatter: any;
    private decimalType2Formatter: any;
    private decimalType3Formatter: any;
    private decimalType4Formatter: any;
    private decimalType5Formatter: any;
    private decimalType6Formatter: any;
    private currencyFormatter: any;
    private dateFormatter: any;
    private currentLocale: any;
    private defaultLocale: Object;
    private dateJsUrl: string = '';
    private globalizeParserUrl: string = '';
    private globalizeCldrSupplementalUrl: string = '';
    private globalizeCldrMainUrl: string = '';
    private dateLoaded: boolean = false;
    private dateValueToDetectSupportForMonthDayYearFormat: string = '12/31/2017';
    private dateValueToDetectSupportForDayMonthYearFormat: string = '31/12/2017';
    constructor(private ls: LocalStorageService, private http: Http) {

    }
    /**
     * Initializes localization by fetching appropriate configuration files based on user locale
     * @param {any} locale [description]
     */
    public init(locale?: any): void {
        if (process.env.FETCH_LOCALIZATION_FROM_FIREBASE) {
            this.dateJsUrl = process.env.FIREBASE_LOCALIZATION_URL + GlobalConstant.Configuration.DateLocaleUrl;
            this.globalizeParserUrl = process.env.FIREBASE_LOCALIZATION_URL + GlobalConstant.Configuration.ParserUrl;
            this.globalizeCldrSupplementalUrl = process.env.FIREBASE_LOCALIZATION_URL + GlobalConstant.Configuration.CldrSupplementalUrl;
            this.globalizeCldrMainUrl = process.env.FIREBASE_LOCALIZATION_URL + GlobalConstant.Configuration.CldrMainUrl;
        } else {
            this.dateJsUrl = GlobalConstant.Configuration.DateLocaleUrl;
            this.globalizeParserUrl = GlobalConstant.Configuration.ParserUrl;
            this.globalizeCldrSupplementalUrl = GlobalConstant.Configuration.CldrSupplementalUrl;
            this.globalizeCldrMainUrl = GlobalConstant.Configuration.CldrMainUrl;
        }
        this.defaultLocale = JSON.parse(process.env.DEFAULT_LOCALE);
        this.fetchLocaleCulture(locale);
        if (!this.dateLoaded) {
            this.fetchLocaleDate(locale);
        }
        this.fetchLocaleParser(locale);
    }
    /**
     * Formatter initializer
     */
    private initialiseFormatter(): void {
        this.numberFormatter = Globalize.numberFormatter({
            maximumFractionDigits: 0,
            round: 'round'
        });
        this.decimalType1Formatter = Globalize.numberFormatter({
            maximumFractionDigits: 1,
            minimumFractionDigits: 1
        });
        this.decimalType2Formatter = Globalize.numberFormatter({
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
        this.decimalType3Formatter = Globalize.numberFormatter({
            maximumFractionDigits: 3,
            minimumFractionDigits: 3
        });
        this.decimalType4Formatter = Globalize.numberFormatter({
            maximumFractionDigits: 4,
            minimumFractionDigits: 4
        });
        this.decimalType5Formatter = Globalize.numberFormatter({
            maximumFractionDigits: 5,
            minimumFractionDigits: 5
        });
        this.decimalType6Formatter = Globalize.numberFormatter({
            maximumFractionDigits: 6,
            minimumFractionDigits: 6
        });
        this.currencyFormatter = Globalize.currencyFormatter(this.currentLocale['currencyCode'], {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
        this.dateFormatter = Globalize.dateFormatter({
            date: 'short'
        });
        window['Globalize'] = Globalize;
    }
    /**
     * Converts integer/decimal string into fixed format; returns false if there is an exception or parsing fails
     * @param  {string} value [description]
     * @return {string}       [description]
     */
    public parseCurrencyToFixedFormat(value: string): number | boolean {
        try {
            let parsedValue;
            if (typeof value === 'string' && value.trim() !== '') {
                parsedValue = this.round(GlobalizeParser.parseFloat(value), 2);
            } else {
                parsedValue = value;
            }
            if (isNaN(parsedValue)) {
                parsedValue = false;
            }
            return parsedValue;
        } catch (err) {
            return false;
        }
    }
    /**
     * Converts integer string into fixed format; returns false if there is an exception or parsing fails
     * @param  {string} value [description]
     * @return {number}       [description]
     */
    public parseIntegerToFixedFormat(value: string): number | boolean {
        try {
            let parsedValue;
            if (typeof value === 'string' && value.trim() !== '') {
                parsedValue = this.round(GlobalizeParser.parseFloat(value), 0);
                parsedValue = GlobalizeParser.parseInt(parsedValue.toString());
            } else {
                parsedValue = value;
            }
            if (isNaN(parsedValue)) {
                parsedValue = false;
            }
            return parsedValue;
        } catch (err) {
            return false;
        }
    }
    /**
     * Converts decimal strings into fixed format; returns false if there is an exception or parsing fails
     * @param  {string} value    [description]
     * @param  {number} decimals [description]
     * @return {string}          [description]
     */
    public parseDecimal1ToFixedFormat(value: string): number | boolean {
        return this.parseDecimalToFixedFormat(value, 1);
    }
    public parseDecimal2ToFixedFormat(value: string): number | boolean {
        return this.parseDecimalToFixedFormat(value, 2);
    }
    public parseDecimal3ToFixedFormat(value: string): number | boolean {
        return this.parseDecimalToFixedFormat(value, 3);
    }
    public parseDecimal4ToFixedFormat(value: string): number | boolean {
        return this.parseDecimalToFixedFormat(value, 4);
    }
    public parseDecimal5ToFixedFormat(value: string): number | boolean {
        return this.parseDecimalToFixedFormat(value, 5);
    }
    public parseDecimal6ToFixedFormat(value: string): number | boolean {
        return this.parseDecimalToFixedFormat(value, 6);
    }
    /**
     * Converts decimal strings into fixed format; returns false if there is an exception or parsing fails
     * @param  {string} value    [description]
     * @param  {number} decimals [description]
     * @return {string}          [description]
     */
    public parseDecimalToFixedFormat(value: string, decimals: number): number | boolean {
        try {
            let parsedValue;
            if (typeof value === 'string' && value.trim() !== '') {
                parsedValue = this.round(GlobalizeParser.parseFloat(value), decimals);
            } else {
                parsedValue = value;
            }
            if (isNaN(parsedValue)) {
                parsedValue = false;
            }
            return parsedValue;
        } catch (err) {
            return false;
        }
    }
    /**
     * Converts time values into fixed format(number of seconds since midnight); returns the input value if parsing fails or false if there is an exception
     * @param  {string} value [description]
     * @return {string}       [description]
     */
    public parseTimeToFixedFormat(value: string): string | boolean {
        try {
            let parsedValue;
            if (typeof value === 'string' && value.trim() !== '') {
                if (moment(value, 'H:m', true).isValid()) {
                    value = moment(value.toString(), 'H:m').format('HH:mm');
                    parsedValue = moment.duration(value).asSeconds();
                    if (parsedValue === null || parsedValue === undefined) {
                        parsedValue = this.hmsToSeconds(value);
                    }
                } else {
                    parsedValue = value;
                }
            } else {
                parsedValue = value;
            }
            return parsedValue.toString();
        } catch (err) {
            return false;
        }
    }
    /**
     * Converts date/date-string(user locale format) into fixed format date-string; returns the input value if parsing fails or false if there is an exception
     * @param  {Date | string}      value [description]
     * @return {string}    [description]
     */
    public parseDateToFixedFormat(value: Date | string): string | boolean {
        try {
            let parsedValue: any;
            if (typeof value !== 'undefined' && value !== null && value !== '') {
                if (value instanceof Date) {
                    parsedValue = value;
                } else if (typeof value === 'string') {
                    value = value.trim();
                    if (moment(value, 'YYYY-M-D', true).isValid()) {
                        parsedValue = moment(value, 'YYYY-M-D').toDate();
                    } else if (moment(value, 'Y/M/D', true).isValid()) {
                        parsedValue = moment(value, 'Y/M/D').toDate();
                    } else {
                        parsedValue = GlobalizeParser.parseDate(value);
                    }
                }
                if (parsedValue) {
                    parsedValue = moment(parsedValue).format('YYYY/MM/DD');
                } else {
                    parsedValue = Date.parse(value.toString());
                    if (parsedValue) {
                        parsedValue = moment(parsedValue).format('YYYY/MM/DD');
                    }
                }
            } else {
                parsedValue = value;
            }
            if (!parsedValue) {
                parsedValue = value;
            }
            return parsedValue;
        } catch (err) {
            return false;
        }
    }
    /**
     * Converts date-string into date object based on user locale; returns false if parsing fails
     * @param  {string} value [description]
     * @return {Date}         [description]
     */
    public parseDateStringToDate(value: string): Date | boolean {
        try {
            let parsedValue: any;
            if (typeof value !== 'undefined' && value !== null && value !== '') {
                if (typeof value === 'string') {
                    value = value.trim();
                    if (moment(value, 'YYYY-M-D', true).isValid()) {
                        parsedValue = moment(value, 'YYYY-M-D').toDate();
                    } else if (moment(value, 'Y/M/D', true).isValid()) {
                        parsedValue = moment(value, 'Y/M/D').toDate();
                    } else {
                        parsedValue = GlobalizeParser.parseDate(value);
                    }
                }
                if (!parsedValue) {
                    parsedValue = Date.parse(value);
                }
            }
            if (!(parsedValue instanceof Date)) {
                parsedValue = false;
            }
            return parsedValue;
        } catch (err) {
            return false;
        }
    }
    /**
     * Format numeric values into integer string based on user locale(exclusive of separators); returns false if formatting fails
     * @param  {any}    value [description]
     * @return {string}       [description]
     */
    public formatIntegerToLocaleFormat(value: any): string | boolean {
        try {
            let formattedValue;
            if (typeof value !== 'undefined' && value !== null) {
                if (value === '') {
                    formattedValue = value;
                } else {
                    let valueString = value.toString();
                    let start = valueString.indexOf('(');
                    let end = valueString.indexOf(')');
                    if (start === 0 && end === (valueString.length - 1)) {
                        valueString = '-' + valueString.replace(/\(/g, '').replace(/\)/g, '');
                    }
                    formattedValue = this.parseIntegerToFixedFormat(valueString);
                    if (typeof formattedValue === 'number') {
                        formattedValue = formattedValue.toString();
                    } else {
                        formattedValue = false;
                    }
                }
            } else {
                formattedValue = false;
            }
            if (typeof formattedValue === 'string') {
                return formattedValue.replace(/\u00A0/g, ' ');
            } else {
                return formattedValue;
            }
        } catch (err) {
            return false;
        }
    }
    /**
     * Format numeric values into numeric string based on user locale(inclusive of separators); returns false if formatting fails
     * @param  {any}    value [description]
     * @return {string}       [description]
     */
    public formatNumberToLocaleFormat(value: any, calledFromChange?: boolean): string | boolean {
        try {
            let formattedValue;
            if (typeof value !== 'undefined' && value !== null) {
                if (value === '') {
                    formattedValue = value;
                } else {
                    let valueString = value.toString();
                    let numberVal: any = Number(valueString);
                    let parsedVal = this.parseIntegerToFixedFormat(valueString);
                    let start = valueString.indexOf('(');
                    let end = valueString.indexOf(')');
                    if (start === 0 && end === (valueString.length - 1)) {
                        valueString = '-' + valueString.replace(/\(/g, '').replace(/\)/g, '');
                    }
                    if (calledFromChange) {
                        formattedValue = this.numberFormatter(parsedVal);
                    }
                    else {
                        valueString = this.decimalFaultTolerance(valueString.toString());
                        if (!isNaN(valueString)) {
                            numberVal = Number(valueString);
                        } else {
                            numberVal = this.parseIntegerToFixedFormat(valueString);
                        }
                        formattedValue = this.numberFormatter(numberVal);
                    }
                }
            } else {
                formattedValue = false;
            }
            if (typeof formattedValue === 'string') {
                return formattedValue.replace(/\u00A0/g, ' ');
            } else {
                return formattedValue;
            }
        } catch (err) {
            return false;
        }
    }
    /**
     * Format numeric values into decimal based on user locale(inclusive of separators); returns false if formatting fails
     * @param  {any}    value    [description]
     * @param  {number} decimals [description]
     * @return {string}          [description]
     */
    public formatDecimalToLocaleFormat(value: any, decimals: number, calledFromChange?: boolean): string | boolean {
        try {
            let formattedValue;
            if (typeof value !== 'undefined' && value !== null) {
                if (value === '') {
                    formattedValue = value;
                } else {
                    let valueString = value.toString();
                    let start = valueString.indexOf('(');
                    let end = valueString.indexOf(')');
                    if (start === 0 && end === (valueString.length - 1)) {
                        valueString = '-' + valueString.replace(/\(/g, '').replace(/\)/g, '');
                    }
                    let numberVal: any = Number(valueString);
                    let parsedVal = this.parseDecimalToFixedFormat(valueString, decimals);
                    switch (decimals) {
                        case 1:
                            if (calledFromChange) {
                                formattedValue = this.decimalType1Formatter(parsedVal);
                            } else {
                                valueString = this.decimalFaultTolerance(valueString.toString());
                                if (!isNaN(valueString)) {
                                    numberVal = Number(valueString);
                                } else {
                                    numberVal = this.parseDecimalToFixedFormat(valueString, decimals);
                                }
                                formattedValue = this.decimalType1Formatter(numberVal);
                            }
                            break;
                        case 2:
                            if (calledFromChange) {
                                formattedValue = this.decimalType2Formatter(parsedVal);
                            } else {
                                valueString = this.decimalFaultTolerance(valueString.toString());
                                if (!isNaN(valueString)) {
                                    numberVal = Number(valueString);
                                } else {
                                    numberVal = this.parseDecimalToFixedFormat(valueString, decimals);
                                }
                                formattedValue = this.decimalType2Formatter(numberVal);
                            }
                            break;
                        case 3:
                            if (calledFromChange) {
                                formattedValue = this.decimalType3Formatter(parsedVal);
                            } else {
                                valueString = this.decimalFaultTolerance(valueString.toString());
                                if (!isNaN(valueString)) {
                                    numberVal = Number(valueString);
                                } else {
                                    numberVal = this.parseDecimalToFixedFormat(valueString, decimals);
                                }
                                formattedValue = this.decimalType3Formatter(numberVal);
                            }
                            break;
                        case 4:
                            if (calledFromChange) {
                                formattedValue = this.decimalType4Formatter(parsedVal);
                            } else {
                                valueString = this.decimalFaultTolerance(valueString.toString());
                                if (!isNaN(valueString)) {
                                    numberVal = Number(valueString);
                                } else {
                                    numberVal = this.parseDecimalToFixedFormat(valueString, decimals);
                                }
                                formattedValue = this.decimalType4Formatter(numberVal);
                            }
                            break;
                        case 5:
                            if (calledFromChange) {
                                formattedValue = this.decimalType5Formatter(parsedVal);
                            } else {
                                valueString = this.decimalFaultTolerance(valueString.toString());
                                if (!isNaN(valueString)) {
                                    numberVal = Number(valueString);
                                } else {
                                    numberVal = this.parseDecimalToFixedFormat(valueString, decimals);
                                }
                                formattedValue = this.decimalType5Formatter(numberVal);
                            }
                            break;
                        case 6:
                            if (calledFromChange) {
                                formattedValue = this.decimalType6Formatter(parsedVal);
                            } else {
                                valueString = this.decimalFaultTolerance(valueString.toString());
                                if (!isNaN(valueString)) {
                                    numberVal = Number(valueString);
                                } else {
                                    numberVal = this.parseDecimalToFixedFormat(valueString, decimals);
                                }
                                formattedValue = this.decimalType6Formatter(numberVal);
                            }
                            break;
                        default:
                            if (calledFromChange) {
                                formattedValue = this.decimalType2Formatter(parsedVal);
                            } else {
                                valueString = this.decimalFaultTolerance(valueString.toString());
                                if (!isNaN(valueString)) {
                                    numberVal = Number(valueString);
                                } else {
                                    numberVal = this.parseDecimalToFixedFormat(valueString, decimals);
                                }
                                formattedValue = this.decimalType2Formatter(numberVal);
                            }
                            break;
                    }
                }
            } else {
                formattedValue = false;
            }
            if (typeof formattedValue === 'string') {
                return formattedValue.replace(/\u00A0/g, ' ');
            } else {
                return formattedValue;
            }
        } catch (err) {
            return false;
        }
    }
    /**
     * Format currency values into user locale format; returns false if formatting fails
     * @param  {any}    value [description]
     * @return {string}       [description]
     */
    public formatCurrencyToLocaleFormat(value: any, calledFromChange?: boolean): string | boolean {
        try {
            let formattedValue;
            if (typeof value !== 'undefined' && value !== null) {
                if (value === '') {
                    formattedValue = value;
                } else {
                    let numberVal: any = Number(value.toString());
                    let parsedVal = this.parseCurrencyToFixedFormat(value.toString());
                    if (calledFromChange) {
                        formattedValue = this.currencyFormatter(parsedVal);
                        if (typeof parsedVal === 'number' && parsedVal < 0) {
                            formattedValue = '(' + formattedValue.replace(/\-/g, '') + ')';
                        }
                    } else {
                        value = this.decimalFaultTolerance(value.toString());
                        if (!isNaN(value)) {
                            numberVal = Number(value);
                            formattedValue = this.currencyFormatter(numberVal);
                            if (numberVal < 0) {
                                formattedValue = '(' + formattedValue.replace(/\-/g, '') + ')';
                            }
                        } else {
                            parsedVal = this.parseCurrencyToFixedFormat(value);
                            formattedValue = this.currencyFormatter(parsedVal);
                            if (typeof parsedVal === 'number' && parsedVal < 0) {
                                formattedValue = '(' + formattedValue.replace(/\-/g, '') + ')';
                            }
                        }
                    }
                }
            } else {
                formattedValue = false;
            }
            if (typeof formattedValue === 'string') {
                return formattedValue.replace(/\u00A0/g, ' ');
            } else {
                return formattedValue;
            }
        } catch (err) {
            return false;
        }
    }
    /**
     * Formats time values into HH:mm; returns false if formatting fails
     * @param  {any}    value [description]
     * @return {string}       [description]
     */
    public formatTimeToLocaleFormat(value: any, calledFromChange?: boolean): string | boolean {
        try {
            let formattedValue;
            if (typeof value !== 'undefined' && value !== null) {
                let numeric = Number(value.toString());
                if (value === '') {
                    formattedValue = value;
                } else if (!isNaN(numeric) && !calledFromChange) {
                    if (numeric > 86400) {
                        numeric = numeric % 86400;
                    } else if (numeric < 0) {
                        numeric = (numeric + 86400) % 86400;
                    }
                    formattedValue = this.secondsToHms(numeric);
                } else {
                    if (calledFromChange) {
                        let numString = value.toString();
                        let numeric = Number(numString);
                        if (!isNaN(numeric)) {
                            if (numString.length === 4) {
                                numString = numString.replace(/(.{2})/g, '\:$1').slice(1);
                                if (moment(numString, 'H:m', true).isValid()) {
                                    formattedValue = moment(numString, 'H:m').format('HH:mm');
                                } else {
                                    formattedValue = false;
                                }
                            } else {
                                formattedValue = false;
                            }
                            return formattedValue;
                        }
                    }
                    if (moment(value.toString(), 'HH:mm', true).isValid()) {
                        formattedValue = value;
                    } else if (moment(value.toString(), 'H:m:s', true).isValid()) {
                        formattedValue = moment(value.toString(), 'H:m:s').format('HH:mm');
                    } else if (moment(value.toString(), 'H:m', true).isValid()) {
                        formattedValue = moment(value.toString(), 'H:m').format('HH:mm');
                    } else {
                        formattedValue = false;
                    }
                }
            } else {
                formattedValue = false;
            }
            return formattedValue;
        } catch (err) {
            return false;
        }
    }
    /**
     * Formats date/date-string into user locale format; returns false if formatting fails
     * @param  {Date | string}      value [description]
     * @return {string}    [description]
     */
    public formatDateToLocaleFormat(value: Date | string, calledFromChange?: boolean): string | boolean {
        try {
            let formattedValue;
            if (typeof value !== 'undefined' && value !== null) {
                if (value instanceof Date) {
                    if (calledFromChange === true) {
                        let dateYear: number = value.getFullYear();
                        dateYear = this.checkValidDateYear(dateYear);
                        if (dateYear === 0) {
                            formattedValue = false;
                        } else {
                            value.setFullYear(dateYear);
                            formattedValue = this.dateFormatter(value);
                        }
                    } else {
                        formattedValue = this.dateFormatter(value);
                    }
                } else if (typeof value === 'string') {
                    value = value.trim();
                    if (value === '*') {
                        formattedValue = this.dateFormatter(new Date());
                    } else if (value === '') {
                        formattedValue = value;
                    } else if (moment(value, 'YYYY-M-D', true).isValid()) {
                        let dateObj: Date = moment(value, 'YYYY-M-D').toDate();
                        let dateYear: number = dateObj.getFullYear();
                        dateYear = this.checkValidDateYear(dateYear);
                        if (calledFromChange === true) {
                            if (dateYear === 0) {
                                formattedValue = false;
                            } else {
                                dateObj.setFullYear(dateYear);
                                formattedValue = this.dateFormatter(dateObj);
                            }
                        } else {
                            formattedValue = this.dateFormatter(dateObj);
                        }
                    } else if (moment(value, 'YYYY/M/D', true).isValid()) {
                        let dateObj: Date = moment(value, 'YYYY/M/D').toDate();
                        let dateYear: number = dateObj.getFullYear();
                        dateYear = this.checkValidDateYear(dateYear);
                        if (calledFromChange === true) {
                            if (dateYear === 0) {
                                formattedValue = false;
                            } else {
                                dateObj.setFullYear(dateYear);
                                formattedValue = this.dateFormatter(dateObj);
                            }
                        } else {
                            formattedValue = this.dateFormatter(dateObj);
                        }
                    } else if (!calledFromChange && moment(value, 'YY/M/D', true).isValid()) {
                        let dateObj: Date = moment(value, 'YY/M/D').toDate();
                        formattedValue = this.dateFormatter(dateObj);
                    } else {
                        let parsedDate = GlobalizeParser.parseDate(value);
                        if (parsedDate) {
                            formattedValue = this.dateFormatter(parsedDate);
                        } else {
                            if (Date.parse(value)) {
                                formattedValue = this.dateFormatter(Date.parse(value));
                            } else {
                                if (value.length === 8) {
                                    let year: number = Number(value.slice(4));
                                    if (calledFromChange === true) {
                                        if (!isNaN(year)) {
                                            year = this.checkValidDateYear(year);
                                        }
                                    }
                                    if (calledFromChange === true && year === 0) {
                                        formattedValue = false;
                                    } else {
                                        formattedValue = this.checkDateShortCuts(value, year);
                                    }
                                } else if (value.length === 6) {
                                    let year: number = Number(value.slice(4, 6));
                                    if (calledFromChange === true) {
                                        if (!isNaN(year)) {
                                            year = this.checkValidDateYear(year);
                                        }
                                    }
                                    if (calledFromChange === true && year === 0) {
                                        formattedValue = false;
                                    } else {
                                        formattedValue = this.checkDateShortCuts(value, year);
                                    }
                                } else {
                                    formattedValue = false;
                                }
                            }
                        }
                    }
                    if (calledFromChange === true) {
                        let dateObj: Date = GlobalizeParser.parseDate(formattedValue);
                        if (formattedValue && dateObj instanceof Date) {
                            let dateYear: number = dateObj.getFullYear();
                            dateYear = this.checkValidDateYear(dateYear);
                            if (dateYear === 0) {
                                formattedValue = false;
                            } else {
                                dateObj.setFullYear(dateYear);
                                formattedValue = this.dateFormatter(dateObj);
                            }
                        }
                    }
                } else {
                    formattedValue = false;
                }
            } else {
                formattedValue = false;
            }
            if (typeof formattedValue === 'string') {
                return formattedValue.replace(/\u00A0/g, ' ');
            } else {
                return formattedValue;
            }
        } catch (err) {
            return false;
        }
    }

    /**
     * Checks if the current locale supports m/d/y or not and then does formatting
     * @param  {string} value [description]
     * @param  {number} year [description]
     * @return {string | boolean}          [description]
     */
    public checkDateShortCuts(value: string, year: number): string | boolean {
        let formattedValue;
        let textDate = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + String(year);
        if (GlobalizeParser.parseDate(this.dateValueToDetectSupportForMonthDayYearFormat) && !GlobalizeParser.parseDate(this.dateValueToDetectSupportForDayMonthYearFormat)) {
            if (moment(textDate, 'M/D/Y', true).isValid()) {
                formattedValue = this.dateFormatter(moment(textDate, 'M/D/Y').toDate());
            } else if (moment(textDate, 'D/M/Y', true).isValid()) {
                formattedValue = this.dateFormatter(moment(textDate, 'DD/MM/YYYY').toDate());
            } else {
                formattedValue = false;
            }
        } else {
            if (moment(textDate, 'D/M/Y', true).isValid()) {
                formattedValue = this.dateFormatter(moment(textDate, 'DD/MM/YYYY').toDate());
            } else if (moment(textDate, 'M/D/Y', true).isValid()) {
                formattedValue = this.dateFormatter(moment(textDate, 'M/D/Y').toDate());
            } else {
                formattedValue = false;
            }
        }
        return formattedValue;
    }

    /**
     * Checks if the year is a valid logical year
     * @param  {number} dateYear [description]
     * @return {number}          [description]
     */
    public checkValidDateYear(dateYear: number): number {
        if (dateYear >= 0 && dateYear < 50) {
            dateYear += 2000;
        } else if (dateYear >= 50 && dateYear < 100) {
            dateYear += 1900;
        } else if (dateYear >= 100 && dateYear < 1900) {
            dateYear = 0;
        } else if (dateYear >= 2100) {
            dateYear = 0;
        }
        return dateYear;
    }

    /**
     * Compares parsedValue with numberValue
     * @param  {number} parsedVal [description]
     * @param  {number} numberVal [description]
     * @return {number}           [description]
     */
    public checkParsedValueWithNumberValue(parsedVal: any, numberVal: number): number {
        if (!isNaN(parsedVal) && numberVal !== parsedVal) {
            numberVal = parsedVal;
        }
        return numberVal;
    }

    /**
     * Fetch cldr supplemental configuration files, this is prerequisite for globalize library to perform formatting
     */
    public fetchSupplemental(): void {
        let supplemental = this.ls.retrieve('SUPPLEMENTAL');
        if (supplemental) {
            Globalize.load(supplemental[0]);
            Globalize.load(supplemental[1]);
            Globalize.load(supplemental[2]);
            Globalize.load(supplemental[3]);
            Globalize.load(supplemental[4]);
            Globalize.load(supplemental[5]);
        } else {
            Observable.forkJoin(
                this.http.get(this.globalizeCldrSupplementalUrl + 'currencyData.json').map(request => { return request.json(); }),
                this.http.get(this.globalizeCldrSupplementalUrl + 'likelySubtags.json').map(request => { return request.json(); }),
                this.http.get(this.globalizeCldrSupplementalUrl + 'metaZones.json').map(request => { return request.json(); }),
                this.http.get(this.globalizeCldrSupplementalUrl + 'plurals.json').map(request => { return request.json(); }),
                this.http.get(this.globalizeCldrSupplementalUrl + 'timeData.json').map(request => { return request.json(); }),
                this.http.get(this.globalizeCldrSupplementalUrl + 'weekData.json').map(request => { return request.json(); })
            ).subscribe((data) => {
                Globalize.load(data[0]);
                Globalize.load(data[1]);
                Globalize.load(data[2]);
                Globalize.load(data[3]);
                Globalize.load(data[4]);
                Globalize.load(data[5]);
                this.ls.store('SUPPLEMENTAL', data);
            });
        }
    }
    /**
     * Load and execute datejs script based on the locale
     * @param {any} locale [description]
     */
    public fetchLocaleDate(locale?: any): void {
        let setup = this.ls.retrieve('SETUP_INFO');
        if (!locale) {
            if (setup && setup.localeCultureCode && !(Object.keys(setup.localeCultureCode).length === 0 && setup.localeCultureCode.constructor === Object)) {
                locale = setup.localeCultureCode;
            } else {
                locale = this.defaultLocale;
            }
        }
        this.loadScript(this.dateJsUrl + GlobalConstant.Configuration.DateLocalePrefix + locale['dateLocaleCode']).then(data => {
            this.dateLoaded = true;
        }).catch(error => {
            this.loadScript(this.dateJsUrl + GlobalConstant.Configuration.DateLocalePrefix + this.defaultLocale['dateLocaleCode']).then(data => {
                this.dateLoaded = true;
            }).catch(error => {
                this.dateLoaded = false;
            });
        });
    }
    /**
     * Load and execute globalize parser script based on the locale
     * @param {any} locale [description]
     */
    public fetchLocaleParser(locale?: any): void {
        let setup = this.ls.retrieve('SETUP_INFO');
        if (!locale) {
            if (setup && setup.localeCultureCode && !(Object.keys(setup.localeCultureCode).length === 0 && setup.localeCultureCode.constructor === Object)) {
                locale = setup.localeCultureCode;
            } else {
                locale = this.defaultLocale;
            }
        }
        this.loadScript(this.globalizeParserUrl + GlobalConstant.Configuration.ParserPrefix + locale['globalizeParserLocaleCode']).then(data => {
            //statement
        }).catch(error => {
            this.loadScript(this.globalizeParserUrl + GlobalConstant.Configuration.ParserPrefix + this.defaultLocale['globalizeParserLocaleCode']);
        });
    }
    /**
     * Fetch globalize cldr configuration files for a locale and applies it when loading completes; additionally it saves the configuation json in localStorage
     * @param {any} locale [description]
     */
    public fetchLocaleCulture(locale?: any): void {
        let setup = this.ls.retrieve('SETUP_INFO');
        let supplemental = this.ls.retrieve('SUPPLEMENTAL');
        let culture = this.ls.retrieve('CULTURE');
        if (!locale) {
            if (setup && setup.localeCultureCode && !(Object.keys(setup.localeCultureCode).length === 0 && setup.localeCultureCode.constructor === Object)) {
                locale = setup.localeCultureCode;
            } else {
                locale = this.defaultLocale;
            }
            this.currentLocale = locale;
        } else {
            this.currentLocale = locale;
        }
        if (supplemental) {
            Globalize.load(supplemental[0]);
            Globalize.load(supplemental[1]);
            Globalize.load(supplemental[2]);
            Globalize.load(supplemental[3]);
            Globalize.load(supplemental[4]);
            Globalize.load(supplemental[5]);

            if (culture) {
                Globalize.load(culture[0]);
                Globalize.load(culture[1]);
                Globalize.load(culture[2]);
                Globalize.load(culture[3]);
                Globalize.load(culture[4]);
                Globalize.load(culture[5]);
                Globalize.locale(locale['globalizeLocaleCode']);
                GlobalizeParser.culture(locale['globalizeParserLocaleCode']);
                this.initialiseFormatter();
            } else {
                Observable.forkJoin(
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/ca-gregorian.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/currencies.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/dateFields.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/numbers.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/timeZoneNames.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/units.json').map(request => { return request.json(); })
                ).subscribe((data) => {
                    Globalize.load(data[0]);
                    Globalize.load(data[1]);
                    Globalize.load(data[2]);
                    Globalize.load(data[3]);
                    Globalize.load(data[4]);
                    Globalize.load(data[5]);
                    Globalize.locale(locale['globalizeLocaleCode']);
                    GlobalizeParser.culture(locale['globalizeParserLocaleCode']);
                    this.ls.store('CULTURE', data);
                    this.initialiseFormatter();
                }, (error) => {
                    Observable.forkJoin(
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/ca-gregorian.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/currencies.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/dateFields.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/numbers.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/timeZoneNames.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/units.json').map(request => { return request.json(); })
                    ).subscribe((data) => {
                        Globalize.load(data[0]);
                        Globalize.load(data[1]);
                        Globalize.load(data[2]);
                        Globalize.load(data[3]);
                        Globalize.load(data[4]);
                        Globalize.load(data[5]);
                        Globalize.locale(locale['globalizeLocaleCode']);
                        GlobalizeParser.culture(locale['globalizeParserLocaleCode']);
                        this.ls.store('CULTURE', data);
                        this.initialiseFormatter();
                    });
                });
            }
        } else {
            if (culture) {
                Observable.forkJoin(
                    this.http.get(this.globalizeCldrSupplementalUrl + 'currencyData.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'likelySubtags.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'metaZones.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'plurals.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'timeData.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'weekData.json').map(request => { return request.json(); })
                ).subscribe((data) => {
                    Globalize.load(data[0]);
                    Globalize.load(data[1]);
                    Globalize.load(data[2]);
                    Globalize.load(data[3]);
                    Globalize.load(data[4]);
                    Globalize.load(data[5]);

                    Globalize.load(culture[0]);
                    Globalize.load(culture[1]);
                    Globalize.load(culture[2]);
                    Globalize.load(culture[3]);
                    Globalize.load(culture[4]);
                    Globalize.load(culture[5]);
                    Globalize.locale(locale['globalizeLocaleCode']);
                    GlobalizeParser.culture(locale['globalizeParserLocaleCode']);
                    this.ls.store('SUPPLEMENTAL', data);
                    this.initialiseFormatter();
                });
            } else {
                Observable.forkJoin(
                    this.http.get(this.globalizeCldrSupplementalUrl + 'currencyData.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'likelySubtags.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'metaZones.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'plurals.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'timeData.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrSupplementalUrl + 'weekData.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/ca-gregorian.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/currencies.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/dateFields.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/numbers.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/timeZoneNames.json').map(request => { return request.json(); }),
                    this.http.get(this.globalizeCldrMainUrl + locale['globalizeLocaleCode'] + '/units.json').map(request => { return request.json(); })
                ).subscribe((data) => {
                    Globalize.load(data[0]);
                    Globalize.load(data[1]);
                    Globalize.load(data[2]);
                    Globalize.load(data[3]);
                    Globalize.load(data[4]);
                    Globalize.load(data[5]);
                    Globalize.load(data[6]);
                    Globalize.load(data[7]);
                    Globalize.load(data[8]);
                    Globalize.load(data[9]);
                    Globalize.load(data[10]);
                    Globalize.load(data[11]);
                    Globalize.locale(locale['globalizeLocaleCode']);
                    GlobalizeParser.culture(locale['globalizeParserLocaleCode']);
                    this.ls.store('SUPPLEMENTAL', data.slice(0, 6));
                    this.ls.store('CULTURE', data.slice(6, data.length));
                    this.initialiseFormatter();
                }, (error) => {
                    Observable.forkJoin(
                        this.http.get(this.globalizeCldrSupplementalUrl + 'currencyData.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrSupplementalUrl + 'likelySubtags.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrSupplementalUrl + 'metaZones.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrSupplementalUrl + 'plurals.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrSupplementalUrl + 'timeData.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrSupplementalUrl + 'weekData.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/ca-gregorian.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/currencies.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/dateFields.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/numbers.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/timeZoneNames.json').map(request => { return request.json(); }),
                        this.http.get(this.globalizeCldrMainUrl + this.defaultLocale['globalizeLocaleCode'] + '/units.json').map(request => { return request.json(); })
                    ).subscribe((data) => {
                        Globalize.load(data[0]);
                        Globalize.load(data[1]);
                        Globalize.load(data[2]);
                        Globalize.load(data[3]);
                        Globalize.load(data[4]);
                        Globalize.load(data[5]);
                        Globalize.load(data[6]);
                        Globalize.load(data[7]);
                        Globalize.load(data[8]);
                        Globalize.load(data[9]);
                        Globalize.load(data[10]);
                        Globalize.load(data[11]);
                        Globalize.locale(locale['globalizeLocaleCode']);
                        GlobalizeParser.culture(locale['globalizeParserLocaleCode']);
                        this.ls.store('SUPPLEMENTAL', data.slice(0, 6));
                        this.ls.store('CULTURE', data.slice(6, data.length));
                        this.initialiseFormatter();
                    });
                });
            }
        }
    }
    /**
     * Adds a script inside HEAD tag so that it get executed on load
     * @param  {string} locale [description]
     * @return {any}           [description]
     */
    public loadScript(locale: string): any {
        return new Promise((resolve, reject) => {
            let script: any = document.createElement('script');
            script.type = 'text/javascript';
            script.src = locale + '.js';
            if (script.readyState) {  //IE
                script.onreadystatechange = () => {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        resolve({ script: name, loaded: true, status: 'Loaded' });
                    }
                };
            } else {
                script.onload = () => {
                    resolve({ script: name, loaded: true, status: 'Loaded' });
                };
            }
            script.onerror = (error: any) => {
                reject({ script: name, loaded: false, status: 'Load Fail' });
            };
            document.getElementsByTagName('head')[0].appendChild(script);
        });
    }

    /**
     * Rounds a number based on the requested decimal place
     * @param  {any}    value    [description]
     * @param  {number} decimals [description]
     * @return {number}          [description]
     */
    public round(value: any, decimals: number): number {
        try {
            let roundedValue: number;
            if (typeof value !== 'undefined' && value !== null && value !== '') {
                roundedValue = Number(Math.round(parseFloat(value + 'e' + decimals)) + 'e-' + decimals);
            } else {
                roundedValue = value;
            }
            return roundedValue;
        } catch (err) {
            return value;
        }
    }
    /**
     * This function checks for decimal fault tolerance For e.g 1,200.00 to 1200.00
     * @param  {string} value [description]
     * @return {string}       [description]
     */
    public decimalFaultTolerance(value: string): string {
        try {
            value = value.toString();
            let commaIndex = value.indexOf(',');
            let dotIndex = value.indexOf('.');
            if (commaIndex >= 0 && dotIndex >= 0 && dotIndex > commaIndex) {
                value = value.replace(/,/g, '');
            }
            return value;
        }
        catch (err) {
            return value;
        }
    }

    /**
     * Converts Hr:Min:Sec / Hr:Min to Total Seconds
     * @param hms
     */
    public hmsToSeconds(hms: any): string {
        let aTime = hms.split(':'); // split it at the colons
        let hr = 0, min = 0, sec = 0;
        let isError: boolean = false;

        hr = Number(aTime[0]);
        min = Number(aTime[1]);

        if (aTime.length > 2) {
            sec = Number(aTime[2]);
        }

        if (hr > 24 || min > 59 || sec > 59) {
            isError = true;
        }

        if (!isError) {
            // minutes are worth 60 seconds. Hours are worth 60 minutes.
            let seconds = (hr * 3600) + (min * 60) + sec;
            return seconds.toString();
        } else {
            return '';
        }
    }
    /**
     * Converts Seconds to Hr:Min
     * @param hms
     */
    public secondsToHms(d: any): string {
        d = Number(d);
        let h = Math.floor(d / 3600);
        let m = Math.floor(d % 3600 / 60);
        let s = Math.floor(d % 3600 % 60);

        let hDisplay = h + ':';
        if (h > 0) {
            hDisplay = h > 9 ? h + ':' : '0' + h + ':';
        } else {
            hDisplay = '00' + ':';
        }
        let mDisplay = m + ':';
        if (m > 0) {
            mDisplay = m > 9 ? m + '' : '0' + m;
        } else {
            mDisplay = '00';
        }
        return hDisplay + mDisplay;
    }
}
