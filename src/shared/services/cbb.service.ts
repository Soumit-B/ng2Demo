/**
 * Service - CBBService
 * Handles Country, Business And Branch Functionality
 * Popular Usage Areas -
 *      # CBBComponent
 *      # AuthService
 * Initialized HTTPService using injector and when required only since,
 * _ service instance does not return null when AuthService is initialized
 * _ HTTPService initializes AuthService And AuthService Initiazes CBBService
 * _ hence there is a chance of ambiguity
 * For web storage SesssionStorage is used; So that user can run multiple instances in multiple browser tabs
 */
import { Injectable, Injector, EventEmitter, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { ErrorService } from './error.service';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';
import { ServiceConstants } from './../constants/service.constants';
import { Observable } from 'rxjs/Observable';
import { HttpService } from './http-service';
import { CBBConstants } from '../constants/cbb.constants';
import { OrderBy } from './../pipes/orderBy';

@Injectable()
export class CBBService {
    // Class Properties
    // CBB Properties
    private countryCode: string;
    private businessCode: string;
    private branchCode: string;
    private cbbList: Object;
    private defaultBranchCode: string;
    private routeList: Array<Object>;
    private componentDisabled: boolean;
    // Miscellaneous Properties
    private defaultBranchSearch: URLSearchParams;
    // Event Emitter Properties
    public changeEmitter: EventEmitter<any>;
    // Service Injectable Properties
    private errorService: ErrorService;
    private localStorageService: LocalStorageService;
    private sessionStorageService: SessionStorageService;
    private serviceConstants: ServiceConstants;
    private httpService: HttpService;
    private orderBy: OrderBy;

    constructor(private injector: Injector) {
        this.init();
    }

    // Lifecycle Methods
    /**
     * Method: init
     * Initializes The Classes
     */
    private init(): void {
        this.errorService = this.injector.get(ErrorService);
        this.serviceConstants = this.injector.get(ServiceConstants);
        this.sessionStorageService = this.injector.get(SessionStorageService);
        this.localStorageService = this.injector.get(LocalStorageService);
        this.orderBy = this.injector.get(OrderBy);

        this.changeEmitter = new EventEmitter();

        // Get CBB List From Store
        this.getFromStore();
    }

    /**
     * Getter And Setters For The Properties
     */
    // Country
    public getCountryCode(): string {
        return this.countryCode;
    }
    public setCountryCode(countryCode: string, propagate?: boolean): void {
        this.countryCode = countryCode;
        // Emit If Propagate Is Sent As true
        if (propagate) {
            this.emitChange(CBBConstants.c_s_CHANGE_COUNTRY_CODE, this.countryCode);
        }
    }

    // Business
    public getBusinessCode(): string {
        return this.businessCode;
    }
    public setBusinessCode(businessCode: string, fetchDefaultBranch?: boolean, propagate?: boolean): void {
        this.businessCode = businessCode;

        if (fetchDefaultBranch) {
            // Call To Get Default Branch
            this.getDefaultBranch();
        }

        // Emit If Propagate Is Sent As true
        if (propagate) {
            this.emitChange(CBBConstants.c_s_CHANGE_BUSINESS_CODE, this.businessCode);
        }
    }

    // Branch
    public getBranchCode(): string {
        return this.branchCode;
    }
    public setBranchCode(branchCode: string, propagate?: boolean): void {
        this.branchCode = branchCode;

        // Emit If Propagate Is Sent As true
        if (propagate) {
            this.emitChange(CBBConstants.c_s_CHANGE_BRANCH_CODE, this.branchCode);
        }
    }

    // CBBList
    public getCBBList(): Object {
        return this.cbbList;
    }
    public setCBBList(cbbList: Object): void {
        this.cbbList = cbbList;

        // Set In Store As Well
        this.setInStore();
    }

    /**
     * Method: disableComponent
     * Emit to set the component state
     */
    public disableComponent(disable: boolean): void {
        // Set Class Property
        this.componentDisabled = disable;

        // Emit To Update The Component
        this.emitChange(CBBConstants.c_s_CHANGE_COMPONENT_STATE, this.componentDisabled);
    }

    /**
     * Method: getCountryList
     * Returns cbbList Property
     */
    public getCountryList(): Array<any> {
        return (this.cbbList ? this.cbbList[CBBConstants.c_s_COUNTRIES] : []);
    }

    /**
     * Method: getBusinessListByCountry
     * Returns the busniesses for the passed country code
     */
    public getBusinessListByCountry(country: string): Array<any> {
        let countryIdx: number = 0;
        let countries: Array<any>;
        let businessList: Array<any>;

        countries = this.getCountryList();

        // Get Country Index From Array
        while (countries.length > countryIdx && country !== countries[countryIdx][CBBConstants.c_s_VALUE]) {
            ++countryIdx;
        }

        // If Country Not Found Return Blank Array;
        if (countries.length === countryIdx) {
            return [];
        }

        // Get The Business
        businessList = countries[countryIdx][CBBConstants.c_s_BUSINESSES];

        return businessList;
    }

    /**
     * Method: getBranchListByCountryAndBusiness
     * Returns the branches for the passed country code and business code
     */
    public getBranchListByCountryAndBusiness(country: string, business: string): Array<any> {
        let businessIdx: number = 0;
        let businessList: Object;
        let businesses: Array<any>;
        let branchList: Array<any>;

        businesses = this.getBusinessListByCountry(country);

        // Get Business Index From Array
        while (businesses.length > businessIdx && business !== businesses[businessIdx][CBBConstants.c_s_VALUE]) {
            ++businessIdx;
        }

        // If Country Not Found Return Blank Array;
        if (businesses.length === businessIdx) {
            return [];
        }

        // Get The Business
        branchList = businesses[businessIdx][CBBConstants.c_s_BRANCHES];

        return branchList;
    }

    /**
     * Method: getDefaultBranch
     * Get default branch
     * Checks in the stored data first if not avialable gets data from service
     */
    private getDefaultBranch(): void {
        let countryIdx: number = 0;
        let businessIdx: number = 0;
        let countryArray: Array<any> = [];
        let businessArray: Array<any> = [];
        let defaultBranchCode: string;

        // Execute Only If Country Or Business Is Populated
        if (!this.countryCode || !this.businessCode) {
            return;
        }

        // Get HTTP Service Reference
        this.httpService = this.injector.get(HttpService);

        // Get CBB List From WebStorage
        this.getFromStore();
        countryArray = this.cbbList[CBBConstants.c_s_COUNTRIES];

        // Loop Through List To Get The Country And Business
        for (countryIdx = 0; countryIdx < countryArray.length;) {
            if (this.countryCode === countryArray[countryIdx][CBBConstants.c_s_VALUE]) {
                break;
            }
            countryIdx++;
        }
        businessArray = countryArray[countryIdx][CBBConstants.c_s_BUSINESSES];
        for (businessIdx = 0; businessIdx < businessArray.length;) {
            if (this.businessCode === businessArray[businessIdx][CBBConstants.c_s_VALUE]) {
                break;
            }
            businessIdx++;
        }

        this.defaultBranchCode
            = this.cbbList[CBBConstants.c_s_COUNTRIES][countryIdx][CBBConstants.c_s_BUSINESSES][businessIdx][CBBConstants.c_s_DEFAULT_BRANCH]
            || '';

        if (this.defaultBranchCode) {
            this.emitChange(CBBConstants.c_s_CHANGE_BRANCH_CODE, this.defaultBranchCode);
            return;
        }

        // Set Lookup Params For Default Branch
        let lookupParams = [{
            'table': 'UserAuthorityBranch',
            'query': { 'UserCode': this.localStorageService.retrieve('RIUserCode'), 'BusinessCode': this.businessCode, 'DefaultBranchInd': 'true' },
            'fields': ['BranchNumber']
        }];

        // Set URL Params
        this.defaultBranchSearch = new URLSearchParams();
        this.defaultBranchSearch.set(this.serviceConstants.Action, '0');
        this.defaultBranchSearch.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.defaultBranchSearch.set(this.serviceConstants.CountryCode, this.countryCode);
        this.defaultBranchSearch.set(this.serviceConstants.MaxResults, '5');

        // Create And Return Service Call Observable
        this.httpService.lookUpRequest(
            this.defaultBranchSearch,
            lookupParams).subscribe(
            data => {
                if (!data.results[0].length) {
                    return;
                }
                this.defaultBranchCode = data.results[0][0].BranchNumber;
                this.emitChange(CBBConstants.c_s_CHANGE_BRANCH_CODE, this.defaultBranchCode);
                this.cbbList[CBBConstants.c_s_COUNTRIES][countryIdx][CBBConstants.c_s_BUSINESSES][businessIdx][CBBConstants.c_s_DEFAULT_BRANCH]
                    = this.defaultBranchCode;
                this.setInStore();
            },
            error => {
                this.errorService.emitError(error);
            });
    }

    /**
     * Method - emitChange
     * Emits change data
     * Consuming Class needs to subscribe to the emitter to get the value
     */
    private emitChange(changedProperty: string, newData: any): void {
        let emitData: any = {};

        emitData[CBBConstants.c_s_CHANGED_PROPERTY] = changedProperty;
        emitData[CBBConstants.c_s_NEW_DATA] = newData;

        // Emit Change Data
        this.changeEmitter.emit(emitData);
    }

    /**
     * Method: formatReponseData
     * Formats response data for using in dropdowns
     * Converts reponse key names to names which dropdown component can accept
     * 'WriteAccess' parameter has been kept for any future use
     */
    public formatResponsedata(response: any): Object {
        let responseData: any;
        let formattedData: any = {};
        let lastCountry: string = '';
        let countryObj: any = {};
        let branchObj: Array<any> = [];

        responseData = this.orderBy.transform(response, CBBConstants.c_s_COUNTRY_CODE);
        formattedData[CBBConstants.c_s_COUNTRIES] = [];
        //console.log(responseData);
        for (let countryIdx = 0; countryIdx < responseData.length; countryIdx++) {
            let currentCountry: string = responseData[countryIdx][CBBConstants.c_s_COUNTRY_CODE];
            let businessIdx: number = 0;
            let businessObj: any = {};
            let currentBranches: any = {};
            let branchList: Array<any> = [];
            //console.log(responseData[countryIdx]);
            if (currentCountry !== lastCountry) {
                lastCountry = currentCountry;
                countryObj = {};
                formattedData[CBBConstants.c_s_COUNTRIES].push(countryObj);
                countryObj[CBBConstants.c_s_VALUE] = responseData[countryIdx][CBBConstants.c_s_COUNTRY_CODE];
                countryObj[CBBConstants.c_s_TEXT] = responseData[countryIdx][CBBConstants.c_s_COUNTRY_CODE] + ' - ' + responseData[countryIdx][CBBConstants.c_s_COUNTRY_NAME];
                countryObj[CBBConstants.c_s_BUSINESSES] = [];
                countryObj[CBBConstants.c_s_LANGUAGECODE] = responseData[countryIdx][CBBConstants.c_s_LANGUAGECODE];
                businessIdx = 0;
            }

            currentBranches = responseData[countryIdx][CBBConstants.c_s_BUSINESSES][0][CBBConstants.c_s_BRANCHES];
            for (let branchIdx = 0; branchIdx < currentBranches.length; branchIdx++) {
                let branchObj: any = {};
                branchObj[CBBConstants.c_s_TEXT] = currentBranches[branchIdx][CBBConstants.c_s_BRANCH_CODE] + ' - ' + currentBranches[branchIdx][CBBConstants.c_s_BRANCH_NAME];
                branchObj[CBBConstants.c_s_VALUE] = currentBranches[branchIdx][CBBConstants.c_s_BRANCH_CODE];
                branchObj[CBBConstants.c_s_USER_DEFAULT_BRANCH] = currentBranches[branchIdx][CBBConstants.c_s_USER_DEFAULT_BRANCH];
                branchList.push(branchObj);
            }

            businessObj[CBBConstants.c_s_BRANCHES] = branchList;
            businessObj[CBBConstants.c_s_VALUE] = responseData[countryIdx][CBBConstants.c_s_BUSINESSES][0][CBBConstants.c_s_BUSINESS_CODE];
            businessObj[CBBConstants.c_s_TEXT] = responseData[countryIdx][CBBConstants.c_s_BUSINESSES][0][CBBConstants.c_s_BUSINESS_CODE] + ' - ' + responseData[countryIdx][CBBConstants.c_s_BUSINESSES][0][CBBConstants.c_s_BUSINESS_NAME];
            businessObj[CBBConstants.c_s_DEFAULT_BUSINESS] = responseData[countryIdx][CBBConstants.c_s_BUSINESSES][0][CBBConstants.c_s_DEFAULT_BUSINESS];
            countryObj[CBBConstants.c_s_BUSINESSES].push(businessObj);
        }
        return formattedData;
    }

    // Store Handler Methods
    /**
     * Method: setInStore
     * Saves object in store
     */
    private setInStore(): void {
        if (this.cbbList) {
            this.sessionStorageService.store(CBBConstants.c_s_CBB_STORAGE_KEY_NAME, JSON.stringify(this.cbbList));
        }
    }

    /**
     * Method: getFromStore
     * Gets object from store and sets in class property
     * First checks in 'USERCBBDATA' SessionStorage; Browser/Tab has not been closed yet
     * _ if available sets into property
     * If not avialable in SessionStorage; Browser/Tab is closed or user logged out
     * _ checks in 'USERCODERESPONSEDATA' LocalStorage; Backup when user have not looged out but closed Browser/Tab
     * _ if available sets into property
     * If not avialable in both the above cases; sets empty object in class properties
     */
    private getFromStore(): void {
        let usercodeResponse: any;

        // Get From SessionStorage
        usercodeResponse = this.sessionStorageService.retrieve(CBBConstants.c_s_CBB_STORAGE_KEY_NAME);
        if (usercodeResponse) { // Got from SessionStorage; Break out
            this.cbbList = JSON.parse(this.sessionStorageService.retrieve(CBBConstants.c_s_CBB_STORAGE_KEY_NAME)) || {};
            return;
        }

        // Get From LocalStorage; Else Set To Empty Object
        usercodeResponse = this.localStorageService.retrieve(CBBConstants.c_s_USERCODE_RESPONSE_STORAGE_KEY_NAME) || [];
        if (usercodeResponse.length) { // Got From LocalStorage
            // Used setCBBList Method So That It Is Set In SessionStorage As Well
            this.setCBBList(this.formatResponsedata(usercodeResponse));
        }
    }

    /**
     * Method: clearStore
     * Clears store; Called when logging out
     */
    public clearStore(): void {
        this.sessionStorageService.clear();
    }
}
