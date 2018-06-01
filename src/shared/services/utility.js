import { Validators } from '@angular/forms';
import { CBBService } from './cbb.service';
import { GlobalConstant } from './../constants/global.constant';
import { LocalStorageService } from 'ng2-webstorage';
import { AuthService } from './auth.service';
import { ReplaySubject } from 'rxjs/Rx';
import { ServiceConstants } from './../constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './http-service';
import { Injectable } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { Title } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from './translation.service';
export var Utils = (function () {
    function Utils(logger, titleService, _ls, authService, serviceConstants, xhr, globalConstant, translate, localeTranslateService, cbbService) {
        this.logger = logger;
        this.titleService = titleService;
        this._ls = _ls;
        this.authService = authService;
        this.serviceConstants = serviceConstants;
        this.xhr = xhr;
        this.globalConstant = globalConstant;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.cbbService = cbbService;
    }
    Utils.prototype.ngOnInit = function () {
        this.logger.log('Utility Class initialized.');
    };
    Utils.prototype.emitError = function (error) {
        this.logger.info('Emitting error');
    };
    Utils.prototype.setTitle = function (title) {
        this.titleService.setTitle(title);
    };
    Utils.prototype.getUserCode = function () {
        return this._ls.retrieve('RIUserCode');
    };
    Utils.prototype.getUserInfo = function () {
        return this._ls.retrieve('RIUserInfo');
    };
    Utils.prototype.getUserTypeCode = function () {
        return this._ls.retrieve('RIUserTypeCode');
    };
    Utils.prototype.getUserName = function () {
        return this._ls.retrieve('RIUserName');
    };
    Utils.prototype.getEmail = function () {
        return this._ls.retrieve('RIUserEmail');
    };
    Utils.prototype.getLogInCountryCode = function () {
        return this._ls.retrieve('RICountryCode');
    };
    Utils.prototype.getCountryCodeList = function () {
        var userData = this._ls.retrieve('USERCODE');
        return [userData.CountryCode];
    };
    Utils.prototype.getCountryCode = function () {
        var countryCode = this.cbbService.getCountryCode() || this.getLogInCountryCode();
        return countryCode;
    };
    Utils.prototype.getCountryDesc = function (countryCode) {
        var countryObj = this.cbbService.getCountryList();
        for (var i = 0; i < countryObj.length; i++) {
            if (countryObj[i].value === countryCode)
                return countryObj[i].text;
        }
        return '';
    };
    Utils.prototype.getDefaultLang = function () {
        return this._ls.retrieve('DEFAULT_LANGUAGE');
    };
    Utils.prototype.getLogInBusinessCode = function () {
        var businessList = this.cbbService.getBusinessListByCountry(this.getCountryCode());
        var BusinessCode = businessList[0]['value'];
        return BusinessCode;
    };
    Utils.prototype.getBusinessCode = function () {
        var BusinessCode = this.cbbService.getBusinessCode() || this.getLogInBusinessCode();
        return BusinessCode;
    };
    Utils.prototype.getBusinessCodeList = function () {
        var userData = this._ls.retrieve('USERCODE');
        var BusinessCode;
        if (userData && userData.AuthorisedBusinesses) {
            BusinessCode = userData.AuthorisedBusinesses;
        }
        return BusinessCode;
    };
    Utils.prototype.getBusinessDesc = function (BusinessCode, countryCode) {
        var retObj = new ReplaySubject(1);
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, BusinessCode);
        search.set(this.serviceConstants.CountryCode, countryCode ? countryCode : this.getCountryCode());
        search.set('postDesc', 'Business');
        var xhrParams = {
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAApplyAPIGrid',
            module: 'api',
            search: search
        };
        this.xhr.makeGetRequest(xhrParams.method, xhrParams.module, xhrParams.operation, xhrParams.search).subscribe(function (res) { return retObj.next(res); });
        return retObj;
    };
    Utils.prototype.getUserAccessType = function () {
        var accessType = new ReplaySubject(1);
        var businessCode = this.cbbService.getBusinessCode() || this.getLogInBusinessCode();
        var countryCode = this.cbbService.getCountryCode() || this.getLogInCountryCode();
        var lookupIP = [{
                'table': 'UserAuthority',
                'query': {
                    'BusinessCode': businessCode,
                    'UserCode': this.getUserCode()
                },
                'fields': ['FullAccessInd']
            }];
        var queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, businessCode ? businessCode : this.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, countryCode ? countryCode : this.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '1');
        this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(function (data) {
            var userAuthority = data.results[0][0];
            var FullAccessInd = userAuthority.FullAccessInd;
            if (FullAccessInd) {
                accessType.next('Full');
            }
            else {
                accessType.next('Restricted');
            }
        });
        return accessType;
    };
    Utils.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    Utils.prototype.formatDate = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    };
    Utils.prototype.convertDate = function (dateStr) {
        var newdate = new Date(dateStr.split('/').reverse().join('-'));
        return newdate;
    };
    Utils.prototype.convertDateString = function (dateStr) {
        var newdate = dateStr.split('/').reverse().join('-');
        return newdate;
    };
    Utils.prototype.convertAnyToUKString = function (dateStr) {
        var returnVal = '';
        if (dateStr) {
            if (window['moment'](dateStr, 'DD/MM/YYYY', true).isValid()) {
                returnVal = this.convertDateString(dateStr);
            }
            else {
                returnVal = dateStr;
            }
        }
        if (!returnVal) {
            returnVal = dateStr;
        }
        else {
            if (!window['moment'](returnVal, 'DD/MM/YYYY', true).isValid()) {
                returnVal = this.formatDate(new Date(returnVal));
            }
        }
        return returnVal;
    };
    Utils.prototype.addDays = function (date, days) {
        var d = this.convertDate(date.toString());
        var newDate = new Date(d);
        newDate.setDate(newDate.getDate() + days);
        var adddate = this.formatDate(newDate);
        return adddate;
    };
    Utils.prototype.removeDays = function (date, days) {
        var time = date.getTime() - (days * 86400000);
        return new Date(time);
    };
    Utils.prototype.getCurrentContractType = function (currentContractTypeURLParameter) {
        var currentContractType = 'C';
        if (currentContractTypeURLParameter) {
            var mode = currentContractTypeURLParameter.toUpperCase().replace('<', '').replace('>', '');
            switch (mode) {
                case 'JOB':
                    currentContractType = 'J';
                    break;
                case 'PRODUCT':
                    currentContractType = 'P';
                    break;
                default:
                case 'CONTRACT':
                    currentContractType = 'C';
            }
        }
        return currentContractType;
    };
    Utils.prototype.getCurrentContractLabel = function (currentContractType) {
        var contractTypesList;
        var currentContractTypeLabel;
        var count;
        var clientSideValue = this.getClientSideValues('ContractTypes');
        contractTypesList = clientSideValue.split(',');
        count = 0;
        if (contractTypesList !== null) {
            for (count = 0; count <= contractTypesList.length; count = count + 2) {
                if (contractTypesList[count] === currentContractType) {
                    currentContractTypeLabel = contractTypesList[count + 1];
                    count = contractTypesList.length;
                }
            }
        }
        if (currentContractType && currentContractType === 'J') {
            currentContractTypeLabel = 'Job';
        }
        else if (currentContractType && currentContractType === 'P') {
            currentContractTypeLabel = 'Product Sales';
        }
        else {
            currentContractTypeLabel = 'Contract';
        }
        return currentContractTypeLabel;
    };
    Utils.prototype.getBranchCode = function () {
        var branchCode = this.cbbService.getBranchCode();
        if (branchCode) {
            return branchCode;
        }
        branchCode = '';
        var branchList = this.cbbService.getBranchListByCountryAndBusiness(this.getCountryCode(), this.getBusinessCode());
        if (branchList.length) {
            branchCode = branchList[0].value;
        }
        return branchCode;
    };
    Utils.prototype.getBranchText = function (branchCode) {
        var branchName;
        var branchList = this.cbbService.getBranchListByCountryAndBusiness(this.getCountryCode(), this.getBusinessCode());
        if (branchList.length) {
            if (branchCode) {
                for (var branchIndex in branchList) {
                    if (parseInt(branchCode, 10) === branchList[branchIndex]['value']) {
                        branchName = branchList[branchIndex]['text'];
                    }
                }
            }
            else {
                branchName = branchList[0].text;
            }
        }
        return branchName;
    };
    Utils.prototype.getLoggedInBranch = function (businessCode, countryCode) {
        var retObj = new ReplaySubject(1);
        var lookupIP = [{
                'table': 'UserAuthorityBranch',
                'query': { 'UserCode': this.getUserCode(), 'BusinessCode': businessCode ? businessCode : this.getBusinessCode(), 'CurrentBranchInd': 'true' },
                'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
            },
            {
                'table': 'UserAuthorityBranch',
                'query': { 'UserCode': this.getUserCode(), 'BusinessCode': businessCode ? businessCode : this.getBusinessCode(), 'DefaultBranchInd': 'true' },
                'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
            }];
        var queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, businessCode ? businessCode : this.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, countryCode ? countryCode : this.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '100');
        this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(function (res) { return retObj.next(res); });
        return retObj;
    };
    Utils.prototype.determinePostCodeDefaulting = function (blnEnablePostCodeDefaulting, businessCode, countryCode) {
        var _this = this;
        var retObj = new ReplaySubject(1);
        if (blnEnablePostCodeDefaulting) {
            var lookupIP = [{
                    'table': 'Branch',
                    'query': { 'BusinessCode': businessCode ? businessCode : this.getBusinessCode(), 'EnablePostCodeDefaulting': 'FALSE' },
                    'fields': ['BranchNumber', 'EnablePostCodeDefaulting']
                }];
            var queryLookUp = new URLSearchParams();
            queryLookUp.set(this.serviceConstants.Action, '0');
            queryLookUp.set(this.serviceConstants.BusinessCode, businessCode ? businessCode : this.getBusinessCode());
            queryLookUp.set(this.serviceConstants.CountryCode, countryCode ? countryCode : this.getCountryCode());
            queryLookUp.set(this.serviceConstants.MaxResults, '100');
            this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(function (e) {
                var excludedBranches = '';
                var excludedBranchesArray = [];
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        for (var i = 0; i < e['results'][0].length; i++) {
                            if (excludedBranches === '') {
                                excludedBranches = '';
                            }
                            else {
                                excludedBranches = excludedBranches + ',';
                            }
                            excludedBranches = excludedBranches + e['results'][0][i].BranchNumber;
                            excludedBranchesArray.push(e['results'][0][i].BranchNumber);
                        }
                    }
                }
                if (excludedBranchesArray.indexOf(_this.getBranchCode()) !== -1) {
                    retObj.next(false);
                }
                else {
                    retObj.next(true);
                }
            });
            return retObj;
        }
        else {
            return retObj;
        }
    };
    Utils.prototype.getClientSideValues = function (paramName) {
        var clientSideValue = '';
        switch (paramName) {
            case 'ContractTypes':
                clientSideValue = 'Contract,Job,Product';
                break;
            default:
        }
        return clientSideValue;
    };
    Utils.prototype.convertResponseValueToCheckboxInput = function (responseValue) {
        if (!responseValue) {
            return false;
        }
        return (GlobalConstant.Configuration.Yes === responseValue.toUpperCase());
    };
    Utils.prototype.convertCheckboxValueToRequestValue = function (checkboxValue) {
        if (typeof checkboxValue === 'boolean') {
            return (!checkboxValue ? GlobalConstant.Configuration.No.toLowerCase() : GlobalConstant.Configuration.Yes.toLowerCase());
        }
        else {
            if (typeof checkboxValue === 'string') {
                return (checkboxValue.toLowerCase() === 'true') ? GlobalConstant.Configuration.Yes.toLowerCase() : GlobalConstant.Configuration.No.toLowerCase();
            }
        }
    };
    Utils.prototype.capitalizeFirstLetter = function (value) {
        return (!value ? value : value.charAt(0).toUpperCase() + value.slice(1));
    };
    Utils.prototype.mid = function (str, start, len) { return str.substr(start - 1, len); };
    Utils.prototype.ucase = function (str) {
        if (str) {
            return str.toUpperCase();
        }
        else {
            return '';
        }
    };
    Utils.prototype.lcase = function (str) {
        if (str) {
            return str.toLowerCase();
        }
        else {
            return '';
        }
    };
    Utils.prototype.trim = function (str) {
        if (str) {
            return str.trim();
        }
        else {
            return '';
        }
    };
    Utils.prototype.len = function (str) {
        if (str) {
            return str.length;
        }
        else {
            return 0;
        }
    };
    Utils.prototype.year = function (date) {
        if (typeof date === 'string') {
            if (window['moment'](date, 'DD/MM/YYYY', true).isValid()) {
                date = this.convertDate(date);
            }
            else {
                date = this.formatDate(date);
            }
        }
        var d = new Date(date), year = d.getFullYear();
        return year;
    };
    Utils.prototype.StrComp = function (str1, str2, compare) {
        var compMethod = 0;
        var chkStr1 = str1;
        var chkStr2 = str2;
        if (typeof compare !== 'undefined') {
            compMethod = compare;
        }
        if (compMethod === 1) {
            chkStr1 = chkStr1.toLowerCase();
            chkStr2 = chkStr2.toLowerCase();
        }
        if (chkStr1 === chkStr2) {
            return 0;
        }
        else {
            if (chkStr1.length < chkStr2.length)
                return -1;
            else
                return 1;
        }
    };
    Utils.prototype.TimeValue = function (str) {
        var timeStr = str.replace(/#/g, '');
        var timeStrArr = [];
        var retTimeValue = 0;
        if (str.indexOf(':') > 0) {
            if (timeStr.indexOf('PM') > 2) {
                timeStr = str.replace(/ PM/g, '');
                timeStrArr = timeStr.split(':');
                timeStrArr[0] = timeStrArr[0] + 12;
            }
            else {
                timeStr = str.replace(/ AM/g, '');
                timeStrArr = timeStr.split(':');
            }
            var retTime = timeStrArr.join(':');
            retTimeValue = (timeStrArr[0] * 60 * 60) + (timeStrArr[1] * 60) + (timeStrArr.length === 3 ? timeStrArr[2] : 0);
        }
        else
            retTimeValue = parseInt(str.trim(), 10);
        if (isNaN(retTimeValue))
            return 0;
        return retTimeValue;
    };
    Utils.prototype.TestForY = function (strTestString) {
        if (strTestString.trim() === '') {
            return true;
        }
        else if (strTestString.trim().toUpperCase() === 'Y') {
            return true;
        }
        else {
            return false;
        }
    };
    Utils.prototype.TestForChar = function (str) {
        return (str.match(/[a-z]/ig) ? str.match(/[a-z]/ig).length : 0) > 0 ? true : false;
    };
    Utils.prototype.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    Utils.prototype.DateDiff = function (format, fromDate, toDate) {
        var fromDt = this.formatDate(fromDate).split('/');
        var fromDatetTime = new Date(fromDt[1] + '/' + fromDt[0] + '/' + fromDt[2]).getTime();
        var toDt = this.formatDate(toDate).split('/');
        var toDateTime = new Date(toDt[1] + '/' + toDt[0] + '/' + toDt[2]).getTime();
        return toDateTime - fromDatetTime;
    };
    Utils.prototype.fillLeadingZeros = function (input, size) {
        var result = input, formatSize = size;
        if (!size) {
            formatSize = this.globalConstant.AppConstants().defaultFormatSize;
        }
        for (var i = 0; i < (formatSize - input.length); i++) {
            result = '0' + result;
        }
        return result;
    };
    Utils.prototype.secondsToHr = function (seconds) {
        var hr;
        hr = Number(seconds) / 3600;
        return hr;
    };
    Utils.prototype.secondsToMin = function (seconds) {
        var min;
        min = Number(seconds) / 60;
        return min;
    };
    Utils.prototype.secondsToHms = function (d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
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
    Utils.prototype.hmsToSeconds = function (hms) {
        var aTime = hms.split(':');
        var hr = 0, min = 0, sec = 0;
        var isError = false;
        hr = Number(aTime[0]);
        min = Number(aTime[1]);
        if (aTime.length > 2) {
            sec = Number(aTime[2]);
        }
        if (hr > 24 || min > 59 || sec > 59) {
            isError = true;
        }
        if (!isError) {
            var seconds = (hr * 3600) + (min * 60) + sec;
            return seconds.toString();
        }
        else {
            return '';
        }
    };
    Object.defineProperty(Utils.prototype, "gridHandle", {
        get: function () {
            return (Math.floor(Math.random() * 900000) + 100000).toString();
        },
        enumerable: true,
        configurable: true
    });
    Utils.prototype.cCur = function (num) {
        return num;
    };
    Utils.prototype.CCurToNum = function (currency) {
        return currency;
    };
    Utils.prototype.CInt = function (num) {
        return parseInt(num, 10);
    };
    Utils.prototype.numToDecimal = function (num, mantisa) {
        return parseFloat(num).toFixed(mantisa).toString();
    };
    Utils.prototype.Left = function (str, n) {
        if (n <= 0)
            return '';
        else if (n > String(str).length)
            return str;
        else
            return String(str).substring(0, n);
    };
    Utils.prototype.Right = function (str, n) {
        if (n <= 0)
            return '';
        else if (n > String(str).length)
            return str;
        else {
            var iLen = String(str).length;
            return String(str).substring(iLen, iLen - n);
        }
    };
    Utils.prototype.checkIfValueExistAndReturn = function (obj, parameter) {
        if (!obj) {
            return '';
        }
        else if (!obj[parameter]) {
            return '';
        }
        else
            return obj[parameter];
    };
    Utils.prototype.Time = function () {
        var date = new Date();
        var hours = date.getHours() > 9 ? date.getHours().toString() : ('0' + date.getHours());
        var minutes = date.getMinutes() > 9 ? date.getMinutes().toString() : ('0' + date.getMinutes());
        var seconds = date.getSeconds() > 9 ? date.getSeconds().toString() : ('0' + date.getSeconds());
        return hours + ':' + minutes + ':' + seconds;
    };
    Utils.prototype.Today = function () {
        var date = new Date();
        var day = date.getUTCDate() > 9 ? date.getUTCDate().toString() : ('0' + date.getUTCDate());
        var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : ('0' + (date.getMonth() + 1));
        var year = date.getFullYear() > 9 ? date.getFullYear().toString() : ('0' + date.getFullYear());
        return month + '/' + day + '/' + year;
    };
    Utils.prototype.TodayAsDDMMYYYY = function () {
        var date = new Date();
        var day = date.getUTCDate() > 9 ? date.getUTCDate().toString() : ('0' + date.getUTCDate());
        var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : ('0' + (date.getMonth() + 1));
        var year = date.getFullYear() > 9 ? date.getFullYear().toString() : ('0' + date.getFullYear());
        return day + '/' + month + '/' + year;
    };
    Utils.prototype.cleanForm = function (form) {
        var retForm = {};
        for (var i in form) {
            if (i && form[i]) {
                retForm[i] = form[i];
            }
        }
        return retForm;
    };
    Utils.prototype.Format = function (text, formattext) {
        var textLen = text.length;
        var formattextLen = formattext.length;
        var retText = text;
        if (textLen < formattextLen) {
            for (var i = 0; i < (formattextLen - textLen); i++) {
                retText = '0' + retText;
            }
        }
        return text;
    };
    Utils.prototype.hasClass = function (el, className) {
        if (el.classList)
            return el.classList.contains(className);
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    };
    Utils.prototype.addClass = function (el, className) {
        if (el.classList)
            el.classList.add(className);
        else if (!this.hasClass(el, className))
            el.className += ' ' + className;
    };
    Utils.prototype.removeClass = function (el, className) {
        if (el.classList)
            el.classList.remove(className);
        else if (this.hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    };
    Utils.prototype.noop = function () { };
    Utils.prototype.disableCBB = function (disable) {
        this.cbbService.disableComponent(disable);
    };
    Utils.prototype.timeInHourMinutes = function (val) {
        var hr = this.leftPad(Math.floor(window['moment'].duration(parseInt(val, 10), 'seconds').asHours()));
        var min = this.leftPad(window['moment'].duration(parseInt(val, 10), 'seconds').minutes());
        return hr + ':' + min;
    };
    Utils.prototype.leftPad = function (n) {
        return n > 9 ? '' + n : '0' + n;
    };
    Utils.prototype.getTranslatedval = function (key) {
        return this.translate.get(key).toPromise();
    };
    Utils.prototype.toTitleCase = function (str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1); });
    };
    Utils.prototype.randomSixDigitString = function () {
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    };
    Utils.prototype.makeTabsRed = function () {
        var elem = document.querySelector('.nav-tabs').children;
        for (var i = 0; i < elem.length; i++) {
            this.removeClass(elem[i], 'error');
            if (!this.hasClass(elem[i], 'hidden')) {
                var tempString = document.querySelector('.tab-content').children[i].innerHTML;
                var flag = true;
                while (flag) {
                    if (tempString.indexOf('<icabs-ellipsis') > -1) {
                        tempString = tempString.replace(tempString.substring(tempString.indexOf('<icabs-ellipsis'), tempString.indexOf('</icabs-ellipsis>') + 17), '');
                    }
                    if (tempString.indexOf('<icabs-ellipsis') === -1) {
                        flag = false;
                    }
                }
                flag = true;
                while (flag) {
                    if (tempString.indexOf('<icabs-datepicker') > -1) {
                        tempString = tempString.replace(tempString.substring(tempString.indexOf('<icabs-datepicker'), tempString.indexOf('</icabs-datepicker>') + 19), '');
                    }
                    if (tempString.indexOf('<icabs-datepicker') === -1) {
                        flag = false;
                    }
                }
                var parser = new DOMParser();
                var elemDom = parser.parseFromString(tempString, 'text/html');
                var invalidElementArray = elemDom.querySelectorAll('.ng-invalid');
                if (invalidElementArray && invalidElementArray.length > 0) {
                    for (var k = 0; k < invalidElementArray.length; k++) {
                        var invalidElement = invalidElementArray[k];
                        if (invalidElement.parentElement && this.hasClass(invalidElement.parentElement, 'hidden')) {
                            continue;
                        }
                        if (invalidElement.parentElement && invalidElement.parentElement.parentElement
                            && this.hasClass(invalidElement.parentElement.parentElement, 'hidden')) {
                            continue;
                        }
                        this.addClass(elem[i], 'error');
                    }
                }
            }
        }
    };
    Utils.prototype.highlightTabs = function () {
        this.makeTabsRed();
        var elem = document.querySelector('.nav-tabs').children;
        var currentActiveTab = 0;
        var newActiveTab = 99;
        for (var j = 0; j < elem.length; j++) {
            if (this.hasClass(elem[j], 'active')) {
                currentActiveTab = j;
            }
            if (this.hasClass(elem[j], 'error')) {
                newActiveTab = (j < newActiveTab) ? j : newActiveTab;
            }
        }
        this.removeClass(elem[currentActiveTab], 'active');
        this.removeClass(document.querySelector('.tab-content').children[currentActiveTab], 'active');
        if (newActiveTab !== 99) {
            this.addClass(elem[newActiveTab], 'active');
            this.addClass(document.querySelector('.tab-content').children[newActiveTab], 'active');
        }
        else {
            this.addClass(elem[0], 'active');
            this.addClass(document.querySelector('.tab-content').children[0], 'active');
        }
    };
    Utils.prototype.fieldValidateTransform = function (event) {
        var target = event.target || event.srcElement || event.currentTarget;
        var idAttr = target.attributes.id.nodeValue;
        var value = target.value;
        var pattern = (target.attributes.pattern) ? target.attributes.pattern.nodeValue : '';
        var transform = (target.attributes.transform) ? target.attributes.transform.nodeValue.toUpperCase() : '';
        var val = value;
        if (transform) {
            switch (transform) {
                case 'UCASE':
                    val = value.toUpperCase();
                    break;
                case 'LCASE':
                    val = value.toLowerCase();
                    break;
                case 'TITLE':
                    val = value.split(' ').map(function (_a) {
                        var h = _a[0], t = _a.slice(1);
                        return h.toUpperCase() + t.join('').toLowerCase();
                    }).join(' ');
                    break;
                case 'CAPS':
                    val = value.charAt(0).toUpperCase() + value.slice(1);
                    break;
                case 'HH:MM':
                    var firstDta = parseInt(value[0] + value[1], 10);
                    var secondDta = parseInt(value[2] + value[3], 10);
                    if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && value.length === 4) {
                        val = value[0] + value[1] + ':' + value[2] + value[3];
                    }
                    break;
            }
        }
        var status = true;
        if (pattern) {
            var flags = '';
            if (pattern[0] === '/') {
                pattern = pattern.substring(1);
            }
            if (pattern.lastIndexOf('/') !== -1) {
                flags = pattern.substr(pattern.lastIndexOf('/') + 1);
                pattern = pattern.substring(0, pattern.lastIndexOf('/'));
            }
            var regex = new RegExp(pattern, flags);
            status = regex.test(val);
        }
        return { id: idAttr, value: val, status: status };
    };
    Utils.prototype.sortByKey = function (array, key, reverse) {
        if (reverse === void 0) { reverse = false; }
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return reverse ? ((y < x) ? -1 : ((y > x) ? 1 : 0)) : ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };
    Utils.prototype.setDateValueByForce = function (id, value) {
        if (id.indexOf('Date') > 0) {
            var elem = document.querySelector('#' + id).parentElement;
            var dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
            var dateFieldID = dateField.getAttribute('id');
            if (dateField) {
                document.getElementById(dateFieldID)['value'] = value;
            }
        }
    };
    Utils.prototype.isRequired = function (ctrl) {
        var retObj = false;
        if (ctrl.validator && ctrl.validator.length > 0) {
            var obj = ctrl.validator;
            var objReq = Validators.required;
            retObj = (obj === objReq) ? true : false;
        }
        return retObj;
    };
    Utils.decorators = [
        { type: Injectable },
    ];
    Utils.ctorParameters = [
        { type: Logger, },
        { type: Title, },
        { type: LocalStorageService, },
        { type: AuthService, },
        { type: ServiceConstants, },
        { type: HttpService, },
        { type: GlobalConstant, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: CBBService, },
    ];
    return Utils;
}());
