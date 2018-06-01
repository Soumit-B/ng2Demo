import * as moment from 'moment';
import { FormControl, Validator, Validators } from '@angular/forms';
import { CBBService } from './cbb.service';
import { GlobalConstant } from './../constants/global.constant';
import { LocalStorageService } from 'ng2-webstorage';
import { ReplaySubject } from 'rxjs/Rx';
import { ServiceConstants } from './../constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { HttpService } from './http-service';
import { Injectable, OnInit } from '@angular/core';
import { Logger } from '@nsalaun/ng2-logger';
import { Title } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from './translation.service';
import { GlobalizeService } from './globalize.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class Utils implements OnInit {
    private translatedOptionsText: string;
    private currentUrl: string;
    private countryCodeListFromSearchAPI: Array<any>;
    constructor(
        private logger: Logger,
        private titleService: Title,
        private _ls: LocalStorageService,
        private serviceConstants: ServiceConstants,
        private xhr: HttpService,
        private globalConstant: GlobalConstant,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private cbbService: CBBService,
        private globalize: GlobalizeService
    ) {
        this.localeTranslateService.setUpTranslation();
        this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.getTranslatedValue('Options', null).subscribe(res => {
                    if (res) {
                        this.translatedOptionsText = res;
                    }
                });
            }
        });
    }

    ngOnInit(): void {
        this.logger.log('Utility Class initialized.');
    }

    private getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }

    private emitError(error: any): void {
        this.logger.info('Emitting error');
    }

    public setTitle(title: string, relaceKey?: string, replaceValue?: string): void {
        if (title !== '') {
            this.getTranslatedval(title).then((res) => {
                let tempStr = title;
                if (res) { tempStr = res; }
                this.titleService.setTitle(tempStr);

                if (relaceKey && replaceValue) {
                    this.getTranslatedval(replaceValue).then((resp: string) => {
                        tempStr = tempStr.replace(relaceKey, resp);
                        this.titleService.setTitle(tempStr);
                    });
                }
            });
        }
    }

    /**
     * Method to get RI User Code
     * @return: string
     */
    public getUserCode(): string {
        return this._ls.retrieve('RIUserCode');
    }

    /**
     * Method to get RI User Information
     * @return: string
     */
    public getUserInfo(): string {
        return this._ls.retrieve('RIUserInfo');
    }

    /**
     * Method to get RI Type Code
     * @return: string
     */
    public getUserTypeCode(): string {
        return this._ls.retrieve('RIUserTypeCode');
    }

    /**
     * Method to get RI User Name
     * @return: string
     */
    public getUserName(): string {
        return this._ls.retrieve('RIUserName');
    }

    /**
     * Method to get RI User Email
     * @return: string
     */
    public getEmail(): string {
        return this._ls.retrieve('RIUserEmail');
    }

    /**
     * Method to get Country Code From CBB Service
     * @return: string
     */
    public getLogInCountryCode(): string {
        return this._ls.retrieve('RICountryCode');
    }

    /**
     * Method to get RI Country Code List
     * @return: string
     */
    public getCountryCodeList(): Array<any> {
        let userData: any = this._ls.retrieve('USERCODE');
        return [userData.CountryCode];
    }
    /**
     * Method to get Country Code From CBB Service
     * @return: string
     */
    public getCountryCode(): string {
        let countryCode = this.cbbService.getCountryCode() || this.getLogInCountryCode();
        return countryCode;
    }
    /**
     * Method to get Country Desc From CBB Service
     * @return: string
     */
    public getCountryDesc(countryCode: string): string {
        let countryObj = this.cbbService.getCountryList();
        for (let i = 0; i < countryObj.length; i++) {
            if (countryObj[i].value === countryCode) return countryObj[i].text;
        }
        return '';
    }

    /**
     * Method to get Country Desc From Country Search API
     * @return: string
     */
    public getCountryDescFromSearchAPI(countryCode: string): string {
        let countryListLength = this.countryCodeListFromSearchAPI.length;
        for (let i = 0; i < countryListLength; i++) {
            if (this.countryCodeListFromSearchAPI[i]['riCountryCode'] === countryCode) return this.countryCodeListFromSearchAPI[i]['riCountryDescription'];
        }
        return '';
    }
    /**
     * Method to set Country Data From Country Search API
     * @return: string
     */
    public setCountryListFromSearchAPI(data: Array<any>): void {
        if (data) {
            this.countryCodeListFromSearchAPI = data;
        } else {
            this.countryCodeListFromSearchAPI = [];
        }
    }
    /**
     * Method to get Default
     * @return: string
     */
    public getDefaultLang(): string {
        return this._ls.retrieve('DEFAULT_LANGUAGE');
    }

    /**
     * Method: getLogInBusinessCode
     * Returns busniess code with which user logged in
     */
    public getLogInBusinessCode(): string {
        let businessList = this.cbbService.getBusinessListByCountry(this.getCountryCode());
        let BusinessCode = businessList[0]['value'];
        return BusinessCode;
    }

    /**
     * Method to get Business Code From CBB service
     * @return: Observable
     */
    public getBusinessCode(): string {
        let BusinessCode = this.cbbService.getBusinessCode() || this.getLogInBusinessCode();
        return BusinessCode;
    }

    /**
     * Method to get Business Code
     * @return: Observable
     */
    public getBusinessCodeList(): Array<any> {
        //TODO
        let userData: any = this._ls.retrieve('USERCODE');
        let BusinessCode;
        if (userData && userData.AuthorisedBusinesses) {
            BusinessCode = userData.AuthorisedBusinesses;
        }
        return BusinessCode;
    }

    /**
     * Method to get Business description
     * @params: BusinessCode: string
     * @return: Observable
     * @examplpe: this.utils.getBusinessDesc('K').subscribe(data => {this.logger.log(data.BusinessDesc);});
     */
    public getBusinessDesc(BusinessCode: string, countryCode?: string): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, BusinessCode);
        search.set(this.serviceConstants.CountryCode, countryCode ? countryCode : this.getCountryCode());
        search.set('postDesc', 'Business');

        let xhrParams: any = {
            method: 'contract-management/maintenance', //TODO
            operation: 'Application/iCABSAApplyAPIGrid', //TODO
            module: 'api', //TODO
            search: search
        };

        this.xhr.makeGetRequest(
            xhrParams.method,
            xhrParams.module,
            xhrParams.operation,
            xhrParams.search
        ).subscribe(res => retObj.next(res));

        return retObj;
    }

    /**
     * Method: Get Business Description From CBB service
     * @params: businessCode: string, countryCode: string
     * @return: string
     */
    public getBusinessText(businessCode?: string, countryCode?: string): string {
        let businessDesc = '';
        let bCode = businessCode || this.getBusinessCode();
        let cCode = countryCode || this.getCountryCode();
        let businessList = this.cbbService.getBusinessListByCountry(cCode);
        if (businessList) {
            for (let index = 0; index < businessList.length; index++) {
                if (businessList[index].value === bCode) {
                    businessDesc = businessList[index].text;
                    break;
                }
            }
        }

        if (businessDesc) {
            let index: number = businessDesc.indexOf('-');
            businessDesc = businessDesc.substring(index + 1);
        }

        return businessDesc;
    }

    /**
     * Method to get Access type for current user. return Restricted/Full
     * @return: Observable
     */
    public getUserAccessType(): Observable<any> {
        let accessType: ReplaySubject<any> = new ReplaySubject(1);
        let businessCode = this.cbbService.getBusinessCode() || this.getLogInBusinessCode();
        let countryCode = this.cbbService.getCountryCode() || this.getLogInCountryCode();
        let lookupIP = [{
            'table': 'UserAuthority',
            'query': {
                'BusinessCode': businessCode,
                'UserCode': this.getUserCode()
            },
            'fields': ['FullAccessInd']
        }];

        let queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, businessCode ? businessCode : this.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, countryCode ? countryCode : this.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '1');

        //this.lookup.lookUpRecord(table).subscribe(
        this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe((data) => {
            let userAuthority = data.results[0][0];
            let FullAccessInd = userAuthority.FullAccessInd;

            if (FullAccessInd) {
                accessType.next('Full');
            } else {
                accessType.next('Restricted');
            }
        });
        return accessType;
    }

    /**
     * Method to get padded value
     * @return: string
     */
    public numberPadding(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }
    /**
     * Method to format date/date string to fixed format
     * @return: string
     */
    public formatDate(date: any): any {
        if (date && (typeof date === 'string' || date instanceof Date)) {
            return this.globalize.parseDateToFixedFormat(date);
        } else return date;
    }
    /**
     * Method to convert dateString to date object
     * @return: string
     */
    public convertDate(dateStr: string): any {
        if (dateStr) {
            return this.globalize.parseDateStringToDate(dateStr);
        } else return dateStr;
    }

    /**
     * Method to format date string to fixed format
     * @return: string
     */
    public convertDateString(dateStr: string): any {
        if (dateStr) {
            return this.globalize.parseDateToFixedFormat(dateStr);
        } else return dateStr;
    }

    /**
     * Method to format date string to fixed format
     * @return: string
     */
    public convertAnyToUKString(dateStr: string): string {
        if (dateStr) {
            return this.globalize.parseDateToFixedFormat(dateStr) as string;
        } else return dateStr;
    }

    /**
     * Method to Add/remove days to Date in dd/mm/yyyy format
     * @return: string
     */
    public addDays(date: Date, days: number): Date {
        let d = this.convertDate(this.globalize.parseDateToFixedFormat(date) as string);
        let newDate: Date = new Date(d);
        newDate.setDate(newDate.getDate() + days);
        let adddate = this.formatDate(newDate);
        return adddate;
    }
    public removeDays(date: Date, days: number): Date {
        let time = date.getTime() - (days * 86400000);
        return new Date(time);
    }

    public getCurrentContractType(currentContractTypeURLParameter: string): string {
        let currentContractType = 'C';
        if (currentContractTypeURLParameter) {
            let mode = currentContractTypeURLParameter.toUpperCase().replace('<', '').replace('>', '');
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
    }

    public getCurrentContractLabel(currentContractType: string): string {
        let contractTypesList: any[];
        let currentContractTypeLabel: string;
        let count;
        let clientSideValue = this.getClientSideValues('ContractTypes');
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
        // TODO remove after we get getClientSideValues();
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
    }

    /**
     * Method to get Branch Code From CBB Service
     * @return: string
     */
    public getBranchCode(): string {
        let branchCode: string = this.cbbService.getBranchCode();

        if (branchCode) {
            return branchCode;
        }

        branchCode = '';
        let branchList = this.cbbService.getBranchListByCountryAndBusiness(this.getCountryCode(), this.getBusinessCode());
        if (branchList.length) {
            branchCode = branchList[0].value;
        }
        return branchCode;
    }

    /**
     * Method to get Branch Name From CBB Service
     * @return: string
     */
    public getBranchText(branchNumber?: string): string {
        let branchName;
        let branchCode = branchNumber || this.cbbService.getBranchCode();
        let branchList = this.cbbService.getBranchListByCountryAndBusiness(this.getCountryCode(), this.getBusinessCode());
        if (branchList.length) {
            if (branchCode) {
                for (let branchIndex in branchList) {
                    if (parseInt(branchCode, 10) === branchList[branchIndex]['value']) {
                        branchName = branchList[branchIndex]['text'];
                    }
                }
            } else {
                branchName = branchList[0].text;
            }
        }
        return branchName;
    }

    public getLoggedInBranch(businessCode?: string, countryCode?: string): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let lookupIP = [{
            'table': 'UserAuthorityBranch',
            'query': { 'UserCode': this.getUserCode(), 'BusinessCode': businessCode ? businessCode : this.getBusinessCode(), 'CurrentBranchInd': 'true' },
            'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
        },
        {
            'table': 'UserAuthorityBranch',
            'query': { 'UserCode': this.getUserCode(), 'BusinessCode': businessCode ? businessCode : this.getBusinessCode(), 'DefaultBranchInd': 'true' },
            'fields': ['BusinessCode', 'BranchNumber', 'DefaultBranchInd', 'CurrentBranchInd', 'UserCode']
        }];

        let queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, businessCode ? businessCode : this.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, countryCode ? countryCode : this.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '100');

        this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(res => retObj.next(res));
        return retObj;
    }

    public determinePostCodeDefaulting(blnEnablePostCodeDefaulting: any, businessCode?: string, countryCode?: string): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        if (blnEnablePostCodeDefaulting) {
            let lookupIP = [{
                'table': 'Branch',
                'query': { 'BusinessCode': businessCode ? businessCode : this.getBusinessCode(), 'EnablePostCodeDefaulting': 'FALSE' },
                'fields': ['BranchNumber', 'EnablePostCodeDefaulting']
            }];

            let queryLookUp = new URLSearchParams();
            queryLookUp.set(this.serviceConstants.Action, '0');
            queryLookUp.set(this.serviceConstants.BusinessCode, businessCode ? businessCode : this.getBusinessCode());
            queryLookUp.set(this.serviceConstants.CountryCode, countryCode ? countryCode : this.getCountryCode());
            queryLookUp.set(this.serviceConstants.MaxResults, '100');

            this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(e => {
                let excludedBranches = '';
                let excludedBranchesArray = [];
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        for (let i = 0; i < e['results'][0].length; i++) {
                            if (excludedBranches === '') {
                                excludedBranches = '';
                            } else {
                                excludedBranches = excludedBranches + ',';
                            }
                            excludedBranches = excludedBranches + e['results'][0][i].BranchNumber;
                            excludedBranchesArray.push(e['results'][0][i].BranchNumber);
                        }
                    }
                }
                if (excludedBranchesArray.indexOf(this.getBranchCode()) !== -1) {
                    retObj.next(false);
                } else {
                    retObj.next(true);
                }
            });
            return retObj;
        } else {
            return retObj;
        }
    }

    // Method to retrieve RegionCode from Branch
    public getRegionCode(branchCode?: string, businessCode?: string, countryCode?: string): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let lookupIP = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': businessCode || this.getBusinessCode(),
                    'BranchNumber': branchCode || this.getBranchCode()
                },
                'fields': ['RegionCode']
            }
        ];

        let queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, businessCode || this.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, countryCode || this.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '100');

        this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(res => retObj.next(res.results[0][0].RegionCode));
        return retObj;
    }

    // We will implement this feature later during page integration phase
    public getClientSideValues(paramName: string): String {
        let clientSideValue = '';

        switch (paramName) {
            case 'ContractTypes':
                clientSideValue = 'Contract,Job,Product';
                break;
            default:
        }
        return clientSideValue;
    }

    /**
     * Method - convertResponseValueToCheckboxInput
     * Accepts response values as yes/no
     * Returns value as true/false so that can be set in checkboxes
     */
    public convertResponseValueToCheckboxInput(responseValue: string): boolean {
        if (!responseValue) {
            return false;
        }
        if (typeof responseValue === 'string') {
            return (GlobalConstant.Configuration.Yes === responseValue.toUpperCase());
        }
        if (typeof responseValue === 'boolean') {
            return (responseValue);
        }
    }

    /**
     * Method - convertCheckboxValueToRequestValue
     * Accepts any as parameter
     * Return string as yes/no
     */
    public convertCheckboxValueToRequestValue(checkboxValue: any): string {
        if (typeof checkboxValue === 'boolean') {
            return (!checkboxValue ? GlobalConstant.Configuration.No.toLowerCase() : GlobalConstant.Configuration.Yes.toLowerCase());
        } else {
            if (typeof checkboxValue === 'string') {
                return (checkboxValue.toLowerCase() === 'true') ? GlobalConstant.Configuration.Yes.toLowerCase() : GlobalConstant.Configuration.No.toLowerCase();
            }
        }
    }

    /**
     * Method - capitalizeFirstLetter
     * Returns the passed string capitializing the first character
     */
    public capitalizeFirstLetter(value: string): string {
        return (!value ? value : value.charAt(0).toUpperCase() + value.slice(1));
    }

    public mid(str: string, start: number, len?: number): string { return str.substr(start - 1, len); }
    public ucase(str: string): string {
        if (str) {
            return str.toUpperCase();
        } else {
            return '';
        }
    }

    public lcase(str: string): string {
        if (str) {
            return str.toLowerCase();
        } else {
            return '';
        }
    }

    public trim(str: string): string {
        if (str) {
            return str.trim();
        } else {
            return '';
        }
    }

    public len(str: string): number {
        if (str) {
            return str.length;
        } else {
            return 0;
        }
    }

    public year(date: any): any {
        if (typeof date === 'string') {
            if (moment(date, 'DD/MM/YYYY', true).isValid()) {
                date = this.convertDate(date);
            } else {
                date = this.formatDate(date);
            }
        }
        let d = new Date(date),
            year = d.getFullYear();
        return year;
    }

    /**
     * Method - StrComp
     * Accepts 2 string and compares and returns 0/1/-1. Also accepts compare type 0/1 for Case-Sensetive strings
     */
    public StrComp(str1: string, str2: string, compare?: number): number {
        let compMethod = 0;
        let chkStr1 = str1;
        let chkStr2 = str2;

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
    }

    /**
     * Method - TimeValue
     * Implemented TimeValue VB function in JavaScript
     */
    public TimeValue(str: string): number {
        if (str === null || str === undefined) {
            return 0;
        }
        let timeStr = str.replace(/#/g, '');
        let timeStrArr = [];
        let retTimeValue = 0;
        if (str.indexOf(':') > 0) {
            if (timeStr.indexOf('PM') > 2) { //PM
                timeStr = str.replace(/ PM/g, '');
                timeStrArr = timeStr.split(':');
                timeStrArr[0] = timeStrArr[0] + 12;
            } else { //AM
                timeStr = str.replace(/ AM/g, '');
                timeStrArr = timeStr.split(':');
            }
            let retTime = timeStrArr.join(':');
            retTimeValue = (timeStrArr[0] * 60 * 60) + (timeStrArr[1] * 60) + (timeStrArr.length === 3 ? timeStrArr[2] : 0);
            //this.logger.log('TimeValue', str, retTime, retTimeValue);
        } else retTimeValue = parseInt(str.trim(), 10);
        if (isNaN(retTimeValue)) return 0;
        return retTimeValue;
    }

    public TestForY(strTestString: any): boolean {
        if (strTestString.trim() === '') { return true; }
        else if (strTestString.trim().toUpperCase() === 'Y') { return true; }
        else { return false; }
    }

    public TestForChar(str: string): boolean {
        return (str.match(/[a-z]/ig) ? str.match(/[a-z]/ig).length : 0) > 0 ? true : false;
    }

    public validateEmail(email: string): boolean {
        let re = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**
     * Method - DateDiff
     * Implemented DateDiff VB function in JavaScript
     */
    public DateDiff(format: string, fromDate: string, toDate: string): number {
        //Format currently not used
        let fromDt = this.formatDate(fromDate).split('/'); //dd/mm/yyyy as string
        let fromDatetTime = new Date(fromDt[1] + '/' + fromDt[0] + '/' + fromDt[2]).getTime(); //Converted from dd/mm/yyyy to mm/dd/yyyy and then getTime
        let toDt = this.formatDate(toDate).split('/');
        let toDateTime = new Date(toDt[1] + '/' + toDt[0] + '/' + toDt[2]).getTime();
        return toDateTime - fromDatetTime;
    }


    /**
     * Method - fillLeadingZeros
     * Accepts string to be filled and size to be generated
     * Returns result after filling leading zeros based on the size provided
     * If size is not passed it will take default size from global constants
     * E.g. - If 123456 is passed as input and 9 passed as size it will return 000123456
     */
    public fillLeadingZeros(input: string, size?: number): string {
        let result = input,
            formatSize = size;

        if (!size) {
            formatSize = this.globalConstant.AppConstants().defaultFormatSize;
        }

        for (let i = 0; i < (formatSize - input.length); i++) {
            result = '0' + result;
        }

        return result;
    }

    public secondsToHr(seconds: any): number {
        let hr: number;
        hr = Number(seconds) / 3600;
        return hr;
    }

    public secondsToMin(seconds: any): number {
        let min: number;
        min = Number(seconds) / 60;
        return min;
    }

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
     * Property- gridHandle
     * Calculates gridHandle value for grid.
     */
    public get gridHandle(): string {
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }

    /**
     * Method - convertCurrency
     * @param num
     * Converts number to currency
     */
    public cCur(num: string): any {
        // let currency = { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 };
        // let currencyEnabled = false;
        // let value = (parseFloat(num.replace(/\,/g, '')));
        // let formatedValue = (Math.round(value * 100) / 100).toLocaleString(this.getDefaultLang(), { minimumFractionDigits: 2 });
        // return formatedValue;
        return num;
    }

    /**
     * Method - CCurToNum
     * @param currency
     * Converts currency to number
     */
    public CCurToNum(currency: any): any {
        // if (typeof currency !== 'string') {
        //     currency = currency.toString();
        // }
        // return Number(currency.replace(/[^0-9\.]+/g, '')).toString();
        return currency;
    }

    /**
     * Method to parse int
     */
    public CInt(num: string): any {
        return parseInt(num, 10);
    }

    /**
     * Method to convert number to decimal
     */
    public numToDecimal(num: any, mantisa: number): string {
        return parseFloat(num).toFixed(mantisa).toString();
    }

    /**
     * Method - Left
     * @param str
     * @param n
     * Left method of VBScript
     */
    public Left(str: string, n: number): string {
        if (n <= 0)
            return '';
        else if (n > String(str).length)
            return str;
        else
            return String(str).substring(0, n);
    }

    /**
     * Method - Right
     * @param str
     * @param n
     * Right Method of VBScript
     */
    public Right(str: string, n: number): string {
        if (n <= 0)
            return '';
        else if (n > String(str).length)
            return str;
        else {
            let iLen = String(str).length;
            return String(str).substring(iLen, iLen - n);
        }
    }
    /**
     * Method - checkIfValueExistAndReturn
     * @param obj
     * @param parameter
     * Check if a parameter exist in the object and returns its value
     */
    public checkIfValueExistAndReturn(obj: any, parameter: string): string {
        if (!obj) {
            return '';
        } else if (!obj[parameter]) {
            return '';
        } else return obj[parameter];
    }

    public Time(): string {
        let date = new Date();
        let hours: string = date.getHours() > 9 ? date.getHours().toString() : ('0' + date.getHours());
        let minutes: string = date.getMinutes() > 9 ? date.getMinutes().toString() : ('0' + date.getMinutes());
        let seconds: string = date.getSeconds() > 9 ? date.getSeconds().toString() : ('0' + date.getSeconds());
        return hours + ':' + minutes + ':' + seconds;
    }

    public Today(): string {
        let date = new Date();
        let day: string = date.getUTCDate() > 9 ? date.getUTCDate().toString() : ('0' + date.getUTCDate());
        let month: string = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : ('0' + (date.getMonth() + 1));
        let year: string = date.getFullYear() > 9 ? date.getFullYear().toString() : ('0' + date.getFullYear());
        return month + '/' + day + '/' + year;
    }

    public TodayAsDDMMYYYY(): string {
        let date = new Date();
        let day: string = date.getUTCDate() > 9 ? date.getUTCDate().toString() : ('0' + date.getUTCDate());
        let month: string = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : ('0' + (date.getMonth() + 1));
        let year: string = date.getFullYear() > 9 ? date.getFullYear().toString() : ('0' + date.getFullYear());
        return day + '/' + month + '/' + year;
    }

    public cleanForm(form: any): any {
        let retForm = {};
        for (let i in form) {
            if (i && form[i]) {
                retForm[i] = form[i];
            }
        }
        return retForm;
    }

    public Format(text: string, formattext: string): string {
        let textLen = text.length;
        let formattextLen = formattext.length;
        let retText = text;
        if (textLen < formattextLen) {
            for (let i = 0; i < (formattextLen - textLen); i++) {
                retText = '0' + retText;
            }
        }
        return retText;
    }

    // Detects if an element has a css class
    public hasClass(el: any, className: string): any {
        if (el.classList)
            return el.classList.contains(className);
        else
            return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    }

    // Adds css class
    public addClass(el: any, className: string): any {
        if (el.classList)
            el.classList.add(className);
        else if (!this.hasClass(el, className)) el.className += ' ' + className;
    }

    // Removes css class
    public removeClass(el: any, className: string): any {
        if (el.classList)
            el.classList.remove(className);
        else if (this.hasClass(el, className)) {
            let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(reg, ' ');
        }
    }

    //Noop method to do nothing
    // tslint:disable-next-line:no-empty
    public noop(): void { }

    public disableCBB(disable: boolean): void {
        this.cbbService.disableComponent(disable);
    }

    public timeInHourMinutes(val: string): string {
        let hr = this.leftPad(Math.floor(moment.duration(parseInt(val, 10), 'seconds').asHours()));
        let min = this.leftPad(moment.duration(parseInt(val, 10), 'seconds').minutes());
        return hr + ':' + min;
    }

    private leftPad(n: number): string {
        return n > 9 ? '' + n : '0' + n;
    }

    /**
     * Quick translate - as promise
     * @param key
     * example: this.utils.getTranslatedval('Contract Number').then((res) => { console.log('UTILS Translation', res); });
     */
    public getTranslatedval(key: string): Promise<any> {
        return this.translate.get(key).toPromise();
    }
    // To Title case
    public toTitleCase(str: string): string {
        if (str) {
            return str.toString().replace(/\w\S*/g, (txt: string) => { return txt.charAt(0).toUpperCase() + txt.substr(1); });
        } else {
            return '';
        }
    }

    // Random 6 digit number
    public randomSixDigitString(): string {
        return (Math.floor(Math.random() * 900000) + 100000).toString();
    }

    public makeTabsNormal(): void {
        let elem: any = document.querySelector('.nav-tabs');
        if (elem) {
            elem = elem.children;
            for (let i = 0; i < elem.length; i++) {
                this.removeClass(elem[i], 'error');
            }
        }
    }

    public makeTabsRed(tabNumber?: any): void {
        try {
            let elem: any = document.querySelector('.nav-tabs');
            if (elem) {
                elem = document.querySelector('.nav-tabs').children;
                for (let i = 0; i < elem.length; i++) {
                    if (tabNumber && (tabNumber.length > i)) {
                        if (!tabNumber[i]) {
                            continue;
                        }
                    }
                    this.removeClass(elem[i], 'error');
                    if (!this.hasClass(elem[i], 'hidden')) {
                        let tempString: any = document.querySelector('.tab-content');
                        if (tempString) {
                            tempString = tempString.children[i].innerHTML;
                            let flag = true;
                            while (flag) {
                                if (tempString.indexOf('<icabs-ellipsis') > -1) {
                                    let startIndex = tempString.indexOf('<icabs-ellipsis');
                                    let endIndex = tempString.indexOf('</icabs-ellipsis>', startIndex + 1) + 17;
                                    tempString = tempString.replace(tempString.substring(startIndex, endIndex, ''));
                                }
                                if (tempString.indexOf('<icabs-ellipsis') === -1) { flag = false; }
                            }
                            flag = true;
                            while (flag) {
                                if (tempString.indexOf('<icabs-datepicker') > -1) {
                                    let startIndex = tempString.indexOf('<icabs-datepicker');
                                    let endIndex = tempString.indexOf('</icabs-datepicker>', startIndex + 1) + 19;
                                    tempString = tempString.replace(tempString.substring(startIndex, endIndex, ''));
                                }
                                if (tempString.indexOf('<icabs-datepicker') === -1) { flag = false; }
                            }
                            flag = true;
                            while (flag) {
                                if (tempString.indexOf('<icabs-custom-datepicker') > -1) {
                                    let startIndex = tempString.indexOf('<icabs-custom-datepicker');
                                    let endIndex = tempString.indexOf('</icabs-custom-datepicker>', startIndex + 1) + 26;
                                    tempString = tempString.replace(tempString.substring(startIndex, endIndex, ''));
                                }
                                if (tempString.indexOf('<icabs-custom-datepicker') === -1) { flag = false; }
                            }
                            let parser = new DOMParser();
                            let elemDom = parser.parseFromString(tempString, 'text/html');
                            let invalidElementArray = elemDom.querySelectorAll('.ng-invalid');
                            if (invalidElementArray && invalidElementArray.length > 0) {
                                for (let k = 0; k < invalidElementArray.length; k++) {
                                    let invalidElement: Element = invalidElementArray[k];
                                    if (invalidElement.parentElement && this.hasClass(invalidElement.parentElement, 'hidden')) {
                                        continue;
                                    }
                                    if (invalidElement.parentElement && invalidElement.parentElement.parentElement
                                        && this.hasClass(invalidElement.parentElement.parentElement, 'hidden')) {
                                        continue;
                                    }
                                    if (invalidElement.parentElement && invalidElement.parentElement.parentElement
                                        && invalidElement.parentElement.parentElement.parentElement
                                        && this.hasClass(invalidElement.parentElement.parentElement.parentElement, 'hidden')) {
                                        continue;
                                    }
                                    this.addClass(elem[i], 'error');
                                }
                            }
                        }
                    }
                }
            }
        } catch (err) {
            // statement
        }
    }

    public highlightTabs(): any {
        try {
            this.makeTabsRed();
            let elem: any = document.querySelector('.nav-tabs');
            if (elem) {
                elem = elem.children;

                //Focus 1st Error Tab
                let currentActiveTab = 0;
                let newActiveTab = 99;
                for (let j = 0; j < elem.length; j++) {
                    if (this.hasClass(elem[j], 'active')) { currentActiveTab = j; }
                    if (this.hasClass(elem[j], 'error')) {
                        newActiveTab = (j < newActiveTab) ? j : newActiveTab;
                    }
                }
                this.removeClass(elem[currentActiveTab], 'active');
                this.removeClass(document.querySelector('.tab-content').children[currentActiveTab], 'active');
                if (newActiveTab !== 99) {
                    this.addClass(elem[newActiveTab], 'active');
                    this.addClass(document.querySelector('.tab-content').children[newActiveTab], 'active');
                } else {
                    this.addClass(elem[0], 'active');
                    this.addClass(document.querySelector('.tab-content').children[0], 'active');
                }
            }
        } catch (err) {
            // statement
        }
    }

    /**
     * Use this method whenh using *ngIf for tabs to highlight error tabs
     */
    public highlightTabsByIds(): any {
        try {
            this.makeTabsRedById();
            let elem = document.querySelector('.nav-tabs').children;

            //Focus 1st Error Tab
            let currentActiveTab = 0;
            let newActiveTab = 99;
            for (let j = 0; j < elem.length; j++) {
                if (this.hasClass(elem[j], 'active')) { currentActiveTab = j; }
                if (this.hasClass(elem[j], 'error')) {
                    newActiveTab = (j < newActiveTab) ? j : newActiveTab;
                }
            }
            this.removeClass(elem[currentActiveTab], 'active');
            let id = elem[currentActiveTab].getAttribute('id');
            let oldTabElem = document.querySelector('.tab-content #' + id).parentElement;
            this.removeClass(oldTabElem, 'active');

            if (newActiveTab === 99) {
                newActiveTab = 0;
            }
            this.addClass(elem[newActiveTab], 'active');
            let newid = elem[newActiveTab].getAttribute('id');
            let newTabElem = document.querySelector('.tab-content #' + newid).parentElement;
            this.addClass(newTabElem, 'active');
        } catch (err) {
            // statement
        }
    }

    /**
     * Use this method whenh using *ngIf for tabs to mark error tabs
     */
    public makeTabsRedById(tabNumber?: any): void {
        try {
            let elem: any = document.querySelector('.nav-tabs');
            if (elem) {
                elem = elem.children;

                for (let i = 0; i < elem.length; i++) {
                    let id = elem[i].getAttribute('id');
                    if (tabNumber && (tabNumber.indexOf(id) === -1)) {
                        continue;
                    }
                    this.removeClass(elem[i], 'error');
                    if (!this.hasClass(elem[i], 'hidden')) {
                        let element = document.querySelector('.tab-content #' + id);
                        let tempString = element ? element.innerHTML : '';
                        if (!tempString) {
                            element = document.querySelector('#' + id + 'Content');
                            tempString = element ? element.innerHTML : '';
                        }
                        let flag = true;
                        while (flag) {
                            if (tempString.indexOf('<icabs-ellipsis') > -1) {
                                tempString = tempString.replace(tempString.substring(tempString.indexOf('<icabs-ellipsis'), tempString.indexOf('</icabs-ellipsis>') + 17), '');
                            }
                            if (tempString.indexOf('<icabs-ellipsis') === -1) { flag = false; }
                        }
                        flag = true;
                        while (flag) {
                            if (tempString.indexOf('<icabs-datepicker') > -1) {
                                tempString = tempString.replace(tempString.substring(tempString.indexOf('<icabs-datepicker'), tempString.indexOf('</icabs-datepicker>') + 19), '');
                            }
                            if (tempString.indexOf('<icabs-datepicker') === -1) { flag = false; }
                        }
                        let parser = new DOMParser();
                        let elemDom = parser.parseFromString(tempString, 'text/html');
                        let invalidElementArray = elemDom.querySelectorAll('.ng-invalid');
                        if (invalidElementArray && invalidElementArray.length > 0) {
                            for (let k = 0; k < invalidElementArray.length; k++) {
                                let invalidElement: Element = invalidElementArray[k];
                                if (invalidElement.parentElement && this.hasClass(invalidElement.parentElement, 'hidden')) {
                                    continue;
                                }
                                if (invalidElement.parentElement && invalidElement.parentElement.parentElement
                                    && this.hasClass(invalidElement.parentElement.parentElement, 'hidden')) {
                                    continue;
                                }
                                if (invalidElement.parentElement && invalidElement.parentElement.parentElement
                                    && invalidElement.parentElement.parentElement.parentElement
                                    && this.hasClass(invalidElement.parentElement.parentElement.parentElement, 'hidden')) {
                                    continue;
                                }
                                this.addClass(elem[i], 'error');
                            }
                        }
                    }
                }
            }
        } catch (err) {
            // statement
        }
    }

    public fieldValidateTransform(event: any): any {
        let target = event.target || event.srcElement || event.currentTarget;
        let idAttr = target.attributes.id.nodeValue;
        let value = target.value;

        let pattern = (target.attributes.pattern) ? target.attributes.pattern.nodeValue : '';
        let transform = (target.attributes.transform) ? target.attributes.transform.nodeValue.toUpperCase() : '';

        let val = value;
        if (transform) {
            switch (transform) {
                case 'UCASE':
                    val = value.toUpperCase();
                    break;
                case 'LCASE':
                    val = value.toLowerCase();
                    break;
                case 'TITLE':
                    val = value.split(' ').map(([h, ...t]) => h.toUpperCase() + t.join('').toLowerCase()).join(' ');
                    break;
                case 'CAPS':
                    val = value.charAt(0).toUpperCase() + value.slice(1);
                    break;
                case 'HH:MM':
                    let firstDta = parseInt(value[0] + value[1], 10);
                    let secondDta = parseInt(value[2] + value[3], 10);
                    if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && value.length === 4) {
                        val = value[0] + value[1] + ':' + value[2] + value[3];
                    }
                    break;
            }
        }

        let status = true;
        if (pattern) {
            //Sanitize the regex
            let flags = '';
            if (pattern[0] === '/') { pattern = pattern.substring(1); }
            if (pattern.lastIndexOf('/') !== -1) {
                flags = pattern.substr(pattern.lastIndexOf('/') + 1);
                pattern = pattern.substring(0, pattern.lastIndexOf('/'));
            }

            let regex = new RegExp(pattern, flags);
            status = regex.test(val);

            // let elem = document.querySelector('#' + idAttr);
            // this.removeClass(elem, 'ng-valid');
            // this.removeClass(elem, 'ng-invalid');
            // if (!status) {
            //     this.addClass(elem, 'ng-invalid');
            // } else {
            //     this.addClass(elem, 'ng-valid');
            // }
        }

        return { id: idAttr, value: val, status: status };
    }

    public sortByKey(array: any, key: any, reverse: boolean = false): any {
        return array.sort(function (a: any, b: any): any {
            let x = a[key].toLowerCase(); let y = b[key].toLowerCase();
            return reverse ? ((y < x) ? -1 : ((y > x) ? 1 : 0)) : ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    public setDateValueByForce(id: any, value: any): any {
        try {
            if (id.indexOf('Date') > 0) {
                let elem = document.querySelector('#' + id).parentElement;
                if (elem && elem.firstElementChild && elem.firstElementChild.firstElementChild && elem.firstElementChild.firstElementChild.firstElementChild && elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild) {
                    let dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
                    let dateFieldID = dateField.getAttribute('id');

                    if (dateField) {
                        document.getElementById(dateFieldID)['value'] = value;
                    }
                }
            }
        } catch (err) {
            // statement
        }
    }

    public isRequired(ctrl: FormControl): boolean {
        let retObj = false;
        if (ctrl) {
            if (ctrl.validator && ctrl.validator.length > 0) {
                let obj = ctrl.validator;
                retObj = obj(ctrl) && obj(ctrl)['required'];
            }
        }
        return retObj;
    }

    public getFirstFocusableFieldForTab(currentTab: number): any {
        try {
            let elem = document.querySelector('.tab-content');
            if (elem) {
                elem = elem.children[currentTab - 1];
                let elementArray = elem.querySelectorAll('input[id]:not(:disabled):not(.hidden), textarea[formcontrolname]:not(:disabled):not(.hidden), select[formcontrolname]:not(:disabled):not(.hidden)');
                for (let i = 0; i < elementArray.length; i++) {
                    let focusElem = elementArray[i];
                    if (focusElem.parentElement && this.hasClass(focusElem.parentElement, 'hidden')) {
                        continue;
                    }
                    if (focusElem.parentElement && focusElem.parentElement.parentElement
                        && this.hasClass(focusElem.parentElement.parentElement, 'hidden')) {
                        continue;
                    }
                    focusElem['focus']();
                    break;
                }
            }
        } catch (err) {
            // statement
        }
    }

    public resetOptions(): void {
        try {
            let elem = document.querySelectorAll('select[name^="option"]');
            let elem2: any = '';
            if (elem.length > 0) {
                elem2 = elem[elem.length - 1].getElementsByTagName('option')[0];
                if (this.translatedOptionsText && elem2 && elem2['text'] && this.translatedOptionsText.toString().toUpperCase().indexOf(elem2['text'].toString().toUpperCase()) > -1) {
                    elem[elem.length - 1]['selectedIndex'] = 0;
                } else {
                    elem[elem.length - 1]['value'] = '';
                }
            } else {
                let selectElem: any = document.getElementsByTagName('select');
                if (selectElem.length > 0) {
                    selectElem = selectElem[selectElem.length - 1];
                    let options = selectElem.getElementsByTagName('option');
                    for (let z = 0; z < options.length; z++) {
                        if (this.translatedOptionsText && options[z]['text'] && this.translatedOptionsText.toString().toUpperCase().indexOf(options[z]['text'].toString().toUpperCase()) > -1) {
                            selectElem['selectedIndex'] = z;
                            break;
                        }
                    }
                }
            }
        } catch (err) {
            // statement
        }
    }

    public removeSelection(): void {
        if (window.getSelection) {
            if (window.getSelection().empty) {  // Chrome
                window.getSelection().empty();
            } else if (window.getSelection().removeAllRanges) {  // Firefox
                window.getSelection().removeAllRanges();
            }
        } else if (document['selection']) {  // IE?
            document['selection'].empty();
        }
    }

    public validateDateElemObj(formControlName: string): any {
        try {
            let id = formControlName.replace('#', '');
            let elem = document.querySelector('#' + id).parentElement;
            let dateField = null;
            if (elem) {
                if (elem.firstElementChild
                    && elem.firstElementChild.firstElementChild
                    && elem.firstElementChild.firstElementChild.firstElementChild
                    && elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild)
                    dateField = dateField = elem.firstElementChild.firstElementChild.firstElementChild.firstElementChild;
            }
            return dateField;
        } catch (err) {
            // statement
        }
    }

    public customTruthyCheck(obj: any): boolean {
        if (obj === null || obj === undefined || obj === '') {
            return false;
        } else return true;
    }

    public getCurrentUrl(): any {
        return this.currentUrl;
    }

    public setCurrentUrl(val: string): void {
        this.currentUrl = val;
    }

    public updateURL(url: string, currentContractType: string): string {
        let CurrentContractLabel = this.getCurrentContractLabel(currentContractType).toLowerCase();
        if (CurrentContractLabel === 'product sales') CurrentContractLabel = 'product';
        let retURL = [];
        retURL = url.split('/');
        retURL.splice(-1, 1);
        retURL.push(CurrentContractLabel);
        return retURL.join('/');
    }

    public tabSwitchOnTab(e: any): void {
        let code = (e.keyCode ? e.keyCode : e.which);
        let elemList = document.querySelectorAll('#tabCont .nav-tabs li:not(.hidden) a');
        if (elemList.length <= 0) {
            elemList = document.querySelectorAll('.nav-tabs li:not(.hidden) a');
        }
        let currentSelectedIndex = Array.prototype.indexOf.call(elemList, document.querySelector('#tabCont .nav-tabs li:not(.hidden) a.active'));
        if (code === 9 && currentSelectedIndex < (elemList.length - 1)) {
            elemList[currentSelectedIndex + 1]['click']();
            setTimeout(() => {
                this.tabFirstControlFocus();
            }, 0);
        }
        return;
    }

    public tabFirstControlFocus(): void {
        let elem = document.querySelector('#tabCont .tab-content .tab-pane.active .ui-select-toggle, #tabCont .tab-content .tab-pane.active input:not([disabled]), #tabCont .tab-content .tab-pane.active select:not([disabled]), #tabCont .tab-content .tab-pane.active textarea:not([disabled])');
        if (!elem) {
            elem = document.querySelector('.tab-content .tab-pane.active .ui-select-toggle, .tab-content .tab-pane.active input:not([disabled]), .tab-content .tab-pane.active select:not([disabled]), .tab-content .tab-pane.active textarea:not([disabled])');
        }
        if (elem) {
            elem['focus']();
        }
    }

    //Below fn removes white space from texts
    public removeWhiteSpace(someTextWithWhiteSpace: string): string {
        return someTextWithWhiteSpace.replace(/ /g, '');
    }

    // Utilites for globalize
    public isTimeInHHMM(val: string): boolean {
        return /^\d{2}:\d{2}$/.test(val);
    }

    public isTimeInHHMMSS(val: string): boolean {
        return /^\d{2}:\d{2}:\d{2}$/.test(val);
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

    public getEndofWeekDate(vEndofWeekDay: any): Date {
        let today: Date = new Date(), vEndofWeekDate: Date;
        vEndofWeekDate = this.addDays(today, ((7 - today.getDay()) + vEndofWeekDay - 1));
        return vEndofWeekDate;
    }

    public dateDiffInDays(sDate: Date, eDate: Date): any {
        let start: any = moment(sDate);
        let end: any = moment(eDate);
        let duration: any = moment.duration(end.diff(start));
        return duration.asDays();
    }

    public dateDiffInWeeks(sDate: Date, eDate: Date): any {
        let start: any = moment(sDate);
        let end: any = moment(eDate);
        let duration: any = moment.duration(end.diff(start));
        return duration.asWeeks();
    }

    public dateDiffInMonths(sDate: Date, eDate: Date): any {
        let start = moment(sDate);
        let end = moment(eDate);
        let duration = moment.duration(end.diff(start));
        return duration.asMonths();
    }

    public dateDiffInYears(sDate: Date, eDate: Date): any {
        let start = moment(sDate);
        let end = moment(eDate);
        let duration = moment.duration(end.diff(start));
        return duration.asYears();
    }

    public stringToBoolean(data: string): boolean {
        let returnVal: boolean = false;
        if (data) {
            switch (data.toLowerCase()) {
                case 'true':
                    returnVal = true;
                    break;
            }
        }
        return returnVal;
    }

    public booleanToString(data: boolean): string {
        return data ? 'true' : 'false';
    }

    /**
     * This function sets the control value based on the lookup array data returned
     * @param  {any} baseCompRef [Base Component reference]
     * @param  {Array} fields [Lookup fields array]
     * @param  {Array} data [Single Response for the Lookup]
     * @return {void}
     */
    public setLookupValue(baseCompRef: any, fields: Array<string>, data: Array<any>): void {
        if (data && data.length > 0) {
            fields.forEach((ctrlName: string) => {
                let record = data[0];
                if (record.hasOwnProperty(ctrlName)) {
                    baseCompRef.setControlValue(ctrlName, record[ctrlName]);
                }
            });
        }
    }

    /**
     * This function will set the value of the Custom Dropdon value if the arrData is set as code & desc
     * @param  {any} Dropdown object
     * @param  {any} Code
     * @return {void}
     */
    public setCustomDropdownValue(objDropDown: any, code: any): void {
        if (objDropDown.hasOwnProperty('arrData')) {
            let len: number = objDropDown.arrData.length;
            let desc: string = '';
            for (let i = 0; i < len; i++) {
                if (objDropDown.arrData[i].code === code) {
                    objDropDown.active = { id: code, text: code + ' - ' + objDropDown.arrData[i].desc };
                    break;
                }
            }
        }
    }

    /**
     * Custom validator escape [?"]
     * @param respective form field
     * @return validate object
     */
    public commonValidate(field: any): any {
        let regexValidator: any = new RegExp('["]');
        if (regexValidator.test(field.value)) {
            return { 'invalidValue': true };
        }
        if (field.value) {
            return (field.value.toString().trim() === '?') ? { 'invalidValue': true } : null;
        }
        return null;
    }
    // Checks if string is empty
    public isFalsy(str: String): boolean {
        return (!str || 0 === str.length);
    }
}
