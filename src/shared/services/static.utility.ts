import * as moment from 'moment';
import { Logger } from '@nsalaun/ng2-logger';
import { Injector, ReflectiveInjector, Injectable, Inject } from '@angular/core';
import { ErrorConstant } from './../constants/error.constant';
import { Observable } from 'rxjs/Rx';
import { GlobalConstant } from './../constants/global.constant';

export class StaticUtils {
    // Static Properties
    public static readonly c_i_DEFAULT_FORMAT_SIZE: number = 9;
    public static readonly c_s_DATE_FORMAT_1: string = 'YYYY-MM-DD';
    public static readonly c_s_DATE_FORMAT_2: string = 'YYYY-DD-MM';
    public static readonly c_s_DATE_FORMAT_3: string = 'YYYYDDMM';
    public static readonly c_s_DATE_FORMAT_4: string = 'DD/MM/YYYY';
    public static readonly c_s_DATE_FORMAT_5: string = 'MM/DD/YYYY';
    public static readonly c_s_IMAGE_REPO_URL: string = process.env.IMAGE_REPO_URL;

    /**
     * Method - deepCopy
     * Clones the object and returns the value of the object
     * Helpful to bypass pass by reference of objects
     * @param obj - JS Object
     * @return any
     */
    public static deepCopy(obj: any): any {
        let newObj = obj;
        if (obj && typeof obj === 'object') {
            newObj = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
            for (let i in obj) {
                if (!i) {
                    continue;
                }
                newObj[i] = this.deepCopy(obj[i]);
            }
        }
        return newObj;
    }

    /**
     * Adds leading 0 to make the string of desired length
     * If desired length is not passed in the method default size is used
     * @method fillLeadingZeros
     * @param input - string to pad
     * @param size - desired size of the string
     * @return string - string padded with leading 0
     */
    public static fillLeadingZeros(input: string, size?: number): string {
        let result = input,
            formatSize = size;

        if (!size) {
            formatSize = StaticUtils.c_i_DEFAULT_FORMAT_SIZE;
        }

        for (let i = 0; i < (formatSize - input.length); i++) {
            result = '0' + result;
        }

        return result;
    }

    /**
     * Method - convertResponseValueToCheckboxInput
     * Accepts response values as yes/no
     * Returns value as true/false so that can be set in checkboxes
     */
    public static convertResponseValueToCheckboxInput(responseValue: string): boolean {
        return (GlobalConstant.Configuration.Yes === responseValue.toUpperCase());
    }

    /**
     * Method - convertCheckboxValueToRequestValue
     * Accepts any as parameter
     * Return string as yes/no
     */
    public static convertCheckboxValueToRequestValue(checkboxValue: any): string {
        if (typeof checkboxValue === 'boolean') {
            return (!checkboxValue ? GlobalConstant.Configuration.No.toLowerCase() : GlobalConstant.Configuration.Yes.toLowerCase());
        } else {
            if (typeof checkboxValue === 'string') {
                return (checkboxValue.toLowerCase() === 'true') ? GlobalConstant.Configuration.Yes.toLowerCase() : GlobalConstant.Configuration.No.toLowerCase();
            }
        }
    }

    /**
     * Formats a date string to the specified format
     * If invaid date returns string 'Invalid Date'
     * @method - convertDateToFormat
     * @param value - Value to be formatted
     * @param fromFormat - Current format
     * @param toFormat - New format
     * @return - string - Formatted string
     */
    public static convertDateToFormat(value: string, fromFormat: string, toFormat?: string): string {
        let formattedDate: string = '';
        let date: any;

        if (!toFormat) {
            toFormat = StaticUtils.c_s_DATE_FORMAT_4;
        }

        date = moment(value, fromFormat, true);

        if (!date.isValid()) {
            return 'Invalid Date';
        }

        return date.format(toFormat);
    }

    public static extractDataFromResponse(res: any): Observable<any> {
        let body: any = res.json ? res.json() : res;
        if (typeof body['error_description'] !== 'undefined' && body['error_description'].toString().indexOf(ErrorConstant.Message.Invalid) !== -1) {
            return Observable.throw(res);
        }
        //Check for business error
        if (body && body.hasOwnProperty('oResponse')) {
            if (body.info && body.info.error) {
                body.oResponse = {};
                body.oResponse.errorMessage = body.info.error;
                body.oResponse.hasError = true;
                //this.setErrorMessage(body.oResponse.errorMessage, body.oResponse);
            } else if (body.oResponse && body.oResponse.errorMessage) {
                body.oResponse.hasError = true;
                //this.setErrorMessage(body.oResponse.errorMessage, body.oResponse);
            } else if (body.oResponse && body.oResponse.ErrorMessageDesc) {
                body.oResponse.hasError = true;
                body.oResponse.errorMessage = body.oResponse.ErrorMessageDesc;
                //this.setErrorMessage(body.oResponse.errorMessage, body.oResponse);
            }
            return body.oResponse;
        }
        return body || {};
    }

    public static secondsToHMS(time: any): string {
        time = Number(time);
        let h = Math.floor(time / 3600);
        let m = Math.floor(time % 3600 / 60);
        let s = Math.floor(time % 3600 % 60);

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

    /**
     * @property - To handle conversion of data to different types
     */
    public static ConversionHelper = {
        /**
         * Converts value to integer
         * @method toInteger
         * @param val - Value to be converted
         * @return Formatted value
         */
        toInteger: (val: any): string => {
            try {
                if (isNaN(val)) {
                    throw 'Not a number';
                }

                return parseInt(val, 10).toString();
            } catch (excp) {
                console.log('ERROR', excp);
            }
            return val;
        },
        /**
         * Converts value to float
         * @method toFloat
         * @param val - Value to be converted
         * @param decimals - Decimal places to be required
         * @return Formatted value
         */
        toFloat: (val: any, decimals: number): string => {
            try {
                if (isNaN(val)) {
                    throw 'Not a number';
                }

                return parseFloat(val).toFixed(decimals);
            } catch (excp) {
                console.log('ERROR', excp);
            }
            return val;
        },
        /**
         * Converts value to float and upto 1 decimal places
         * @method toDecimal1
         * @param val - Value to be converted
         * @return Formatted value
         */
        toDecimal1: (val: any): string => {
            return StaticUtils.ConversionHelper.toFloat(val, 1);
        },
        /**
         * Converts value to float and upto 2 decimal places
         * @method toDecimal2
         * @param val - Value to be converted
         * @return Formatted value
         */
        toDecimal2: (val: any): string => {
            return StaticUtils.ConversionHelper.toFloat(val, 2);
        },
        /**
         * Converts value to float and upto 3 decimal places
         * @method toDecimal3
         * @param val - Value to be converted
         * @return Formatted value
         */
        toDecimal3: (val: any): string => {
            return StaticUtils.ConversionHelper.toFloat(val, 3);
        },
        /**
         * Converts value to float and upto 4 decimal places
         * @method toDecimal4
         * @param val - Value to be converted
         * @return Formatted value
         */
        toDecimal4: (val: any): string => {
            return StaticUtils.ConversionHelper.toFloat(val, 4);
        },
        /**
         * Converts value to float and upto 5 decimal places
         * @method toDecimal5
         * @param val - Value to be converted
         * @return Formatted value
         */
        toDecimal5: (val: any): string => {
            return StaticUtils.ConversionHelper.toFloat(val, 5);
        },
        /**
         * Converts value to float and upto 6 decimal places
         * @method toDecimal6
         * @param val - Value to be converted
         * @return Formatted value
         */
        toDecimal6: (val: any): string => {
            return StaticUtils.ConversionHelper.toFloat(val, 6);
        },
        /**
         * Converts value to time in HH:MM format
         * @method toTime
         * @param val - Value to be converted
         * @return Formatted value
         */
        toTime: (val: any): string => {
            return StaticUtils.secondsToHMS(val);
        },
        /**
         * Converts value to code i.e. capitializes the value
         * @method toCode
         * @param val - Value to be converted
         * @return Formatted value
         */
        toCode: (val: any): string => {
            return val ? val.toUpperCase() : val;
        }
    };

    /**
     * @description Set grid input box to readonly using cell index
     * @method - setGridInputReadonly
     * @param - cellIndex - Cell index to set readonly; Index starts from 1
     * @return - void
     */
    public static setGridInputReadonly(cellIndex: number): void {
        setTimeout(function (): void {
            let elems: any = document.querySelectorAll('.gridtable tbody tr td:nth-child(' + cellIndex + ') input');

            elems.forEach(element => {
                element.setAttribute('readonly', '');
            });
        }, 300);
    }

    /**
     * @description Converts all alphabetic charaters to upper case
     * @method - toUpperCase
     * @param - value - String to be converted to upper case
     * @return - void
     */
    public static toUpperCase(value: any): string {
        return value ? value.toString().toUpperCase() : '';
    }

    /**
     * @description Below fn removes white space from texts
     * @return - string
     */
    public static removeWhiteSpace(someTextWithWhiteSpace: string): string {
        return someTextWithWhiteSpace.replace(/ /g, '');
    }

}
