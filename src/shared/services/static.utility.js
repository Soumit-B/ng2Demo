import { ErrorConstant } from './../constants/error.constant';
import { Observable } from 'rxjs/Rx';
import { GlobalConstant } from './../constants/global.constant';
export var StaticUtils = (function () {
    function StaticUtils() {
    }
    StaticUtils.deepCopy = function (obj) {
        var newObj = obj;
        if (obj && typeof obj === 'object') {
            newObj = Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
            for (var i in obj) {
                if (!i) {
                    continue;
                }
                newObj[i] = this.deepCopy(obj[i]);
            }
        }
        return newObj;
    };
    StaticUtils.fillLeadingZeros = function (input, size) {
        var result = input, formatSize = size;
        if (!size) {
            formatSize = StaticUtils.c_i_DEFAULT_FORMAT_SIZE;
        }
        for (var i = 0; i < (formatSize - input.length); i++) {
            result = '0' + result;
        }
        return result;
    };
    StaticUtils.convertResponseValueToCheckboxInput = function (responseValue) {
        return (GlobalConstant.Configuration.Yes === responseValue.toUpperCase());
    };
    StaticUtils.convertCheckboxValueToRequestValue = function (checkboxValue) {
        if (typeof checkboxValue === 'boolean') {
            return (!checkboxValue ? GlobalConstant.Configuration.No.toLowerCase() : GlobalConstant.Configuration.Yes.toLowerCase());
        }
        else {
            if (typeof checkboxValue === 'string') {
                return (checkboxValue.toLowerCase() === 'true') ? GlobalConstant.Configuration.Yes.toLowerCase() : GlobalConstant.Configuration.No.toLowerCase();
            }
        }
    };
    StaticUtils.convertDateToFormat = function (value, fromFormat, toFormat) {
        var formattedDate = '';
        var date;
        if (!toFormat) {
            toFormat = StaticUtils.c_s_DATE_FORMAT_4;
        }
        date = window['moment'](value, fromFormat, true);
        if (!date.isValid()) {
            return 'Invalid Date';
        }
        return date.format(toFormat);
    };
    StaticUtils.extractDataFromResponse = function (res) {
        var body = res.json ? res.json() : res;
        if (typeof body['error_description'] !== 'undefined' && body['error_description'].toString().indexOf(ErrorConstant.Message.Invalid) !== -1) {
            return Observable.throw(res);
        }
        if (body && body.hasOwnProperty('oResponse')) {
            if (body.info && body.info.error) {
                body.oResponse = {};
                body.oResponse.errorMessage = body.info.error;
                body.oResponse.hasError = true;
            }
            else if (body.oResponse && body.oResponse.errorMessage) {
                body.oResponse.hasError = true;
            }
            else if (body.oResponse && body.oResponse.ErrorMessageDesc) {
                body.oResponse.hasError = true;
                body.oResponse.errorMessage = body.oResponse.ErrorMessageDesc;
            }
            return body.oResponse;
        }
        return body || {};
    };
    StaticUtils.secondsToHMS = function (time) {
        time = Number(time);
        var h = Math.floor(time / 3600);
        var m = Math.floor(time % 3600 / 60);
        var s = Math.floor(time % 3600 % 60);
        var hDisplay = h + ':';
        if (h > 0) {
            hDisplay = h > 9 ? h + ':' : '0' + h + ':';
        }
        else {
            hDisplay = '00' + ':';
        }
        var mDisplay = m + ':';
        if (m > 0) {
            mDisplay = m > 9 ? m + '' : '0' + m;
        }
        else {
            mDisplay = '00';
        }
        return hDisplay + mDisplay;
    };
    StaticUtils.setGridInputReadonly = function (cellIndex) {
        setTimeout(function () {
            var elems = document.querySelectorAll('.gridtable tbody tr td:nth-child(' + cellIndex + ') input');
            elems.forEach(function (element) {
                element.setAttribute('readonly', '');
            });
        }, 300);
    };
    StaticUtils.c_i_DEFAULT_FORMAT_SIZE = 9;
    StaticUtils.c_s_DATE_FORMAT_1 = 'YYYY-MM-DD';
    StaticUtils.c_s_DATE_FORMAT_2 = 'YYYY-DD-MM';
    StaticUtils.c_s_DATE_FORMAT_3 = 'YYYYDDMM';
    StaticUtils.c_s_DATE_FORMAT_4 = 'DD/MM/YYYY';
    StaticUtils.c_s_DATE_FORMAT_5 = 'MM/DD/YYYY';
    StaticUtils.c_s_IMAGE_REPO_URL = process.env.IMAGE_REPO_URL;
    StaticUtils.ConversionHelper = {
        toInteger: function (val) {
            try {
                if (isNaN(val)) {
                    throw 'Not a number';
                }
                return parseInt(val, 10).toString();
            }
            catch (excp) {
                console.log('ERROR', excp);
            }
            return val;
        },
        toFloat: function (val, decimals) {
            try {
                if (isNaN(val)) {
                    throw 'Not a number';
                }
                return parseFloat(val).toFixed(decimals);
            }
            catch (excp) {
                console.log('ERROR', excp);
            }
            return val;
        },
        toDecimal1: function (val) {
            return StaticUtils.ConversionHelper.toFloat(val, 1);
        },
        toDecimal2: function (val) {
            return StaticUtils.ConversionHelper.toFloat(val, 2);
        },
        toDecimal3: function (val) {
            return StaticUtils.ConversionHelper.toFloat(val, 3);
        },
        toDecimal4: function (val) {
            return StaticUtils.ConversionHelper.toFloat(val, 4);
        },
        toDecimal5: function (val) {
            return StaticUtils.ConversionHelper.toFloat(val, 5);
        },
        toDecimal6: function (val) {
            return StaticUtils.ConversionHelper.toFloat(val, 6);
        },
        toTime: function (val) {
            return StaticUtils.secondsToHMS(val);
        },
        toCode: function (val) {
            return val.toUpperCase();
        }
    };
    return StaticUtils;
}());
