/**
 * Component: CBBComponent
 * Functionality:
 * Set up component for selecting Country, Business And Branches
 * Contains 3 dropdowns with options for the fields
 * This component will be included in the header component only
 */
import { DropdownStaticComponent } from './../dropdown-static/dropdownstatic';
import { Component, Input, ViewChild, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CBBService } from '../../services/cbb.service';
import { Observable, Subscription } from 'rxjs';
import { AjaxObservableConstant } from './../../constants/ajax-observable.constant';
import { CBBConstants } from '../../constants/cbb.constants';
import { Utils } from './../../services/utility';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgZone } from '@angular/core';
import { LocaleTranslationService } from './../../services/translation.service';
import { Router, NavigationEnd, UrlTree, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from 'ng2-webstorage';

@Component({
    selector: 'icabs-cbb',
    templateUrl: 'cbb.html'
})

export class CBBComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('CBBCountryDropdown') cbbCountryDropdown: DropdownStaticComponent;
    @ViewChild('CBBBusinessDropdown') cbbBusinessDropdown: DropdownStaticComponent;
    @ViewChild('CBBBranchDropdown') cbbBranchDropdown: DropdownStaticComponent;

    // @TODO - Modify this initialization once service is implemented
    public cbbDataCountries: Array<Object> = CBBConstants.c_o_BLANK_DROPDOWN_LIST;
    public cbbDataBusinesses: Array<Object> = CBBConstants.c_o_BLANK_DROPDOWN_LIST;
    public cbbDataBranches: Array<Object> = CBBConstants.c_o_BLANK_DROPDOWN_LIST;
    public isDisabled: boolean;
    private defaultBranch: string;
    /*
     * Should be picked from these keys in the response
     * Modify these keys to alter values and texts in branch dropdown
     */
    private branchDropdownMapKeys = ['BranchName', 'BranchNumber'];
    // Subscriptions
    private ajaxSubscription: Subscription;
    private routeSubscription: Subscription;
    private routeParamSubscription: Subscription;
    // AJAX Spinner Properties
    private ajaxSource: BehaviorSubject<any> = new BehaviorSubject<any>(0);
    private ajaxSource$;
    private currentUrl: string = '';
    public isRequesting: boolean;
    private queryParams: any = {};

    constructor(
        private cbbService: CBBService,
        private ajaxconstant: AjaxObservableConstant,
        private utils: Utils,
        private zone: NgZone,
        private localeTranslateService: LocaleTranslationService,
        private router: Router,
        private ls: LocalStorageService,
        private routeParams: ActivatedRoute
    ) {
        this.cbbDataCountries = this.cbbService.getCBBList() ? this.cbbService.getCBBList()[CBBConstants.c_s_COUNTRIES] : CBBConstants.c_o_BLANK_DROPDOWN_LIST;

        this.routeParamSubscription = this.routeParams.queryParams.subscribe((data) => {
            this.queryParams = data;
            if (data[CBBConstants.c_s_URL_PARAM_COUNTRYCODE]) {
                this.modifyComponentState({});
            }
        });
    }

    // Lifecycle Methods
    // Method - ngOnInit
    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        // Setup Translation Service
        this.localeTranslateService.setUpTranslation();
        // Ajax Subscription For Spinner
        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                switch (event) {
                    case this.ajaxconstant.START:
                        this.isRequesting = true;
                        break;
                    case this.ajaxconstant.COMPLETE:
                        this.isRequesting = false;
                        break;
                }
            }
        });
        // Subscription To Default Branch Code Emitter Of CBBService
        if (!this.cbbService.changeEmitter.observers.length) {
            this.cbbService.changeEmitter.subscribe(
                data => {
                    let dropdownToChange: DropdownStaticComponent;
                    switch (data[CBBConstants.c_s_CHANGED_PROPERTY]) {
                        case CBBConstants.c_s_CHANGE_BRANCH_CODE:
                            this.cbbBranchDropdown.selectedItem = data[CBBConstants.c_s_NEW_DATA];
                            this.onBranchSelect(data[CBBConstants.c_s_NEW_DATA]);
                            break;
                        case CBBConstants.c_s_CHANGE_BUSINESS_CODE:
                            this.cbbBusinessDropdown.selectedItem = data[CBBConstants.c_s_NEW_DATA];
                            this.onBusinessSelect(data[CBBConstants.c_s_NEW_DATA]);
                            break;
                        case CBBConstants.c_s_CHANGE_COUNTRY_CODE:
                            this.cbbCountryDropdown.selectedItem = data[CBBConstants.c_s_NEW_DATA];
                            this.onCountrySelect(data[CBBConstants.c_s_NEW_DATA]);
                            break;
                        case CBBConstants.c_s_CHANGE_COMPONENT_STATE:
                            /*this.zone.run(() => {
                                let urlData: UrlTree = this.router.parseUrl(this.currentUrl);
                                let queryParams: any = urlData.queryParams;
                                let isFromMenu: boolean = (queryParams.hasOwnProperty('fromMenu') && queryParams['fromMenu']) ? true : false;
                                if (isFromMenu) {
                                    this.isDisabled = data[CBBConstants.c_s_NEW_DATA];
                                }
                            });*/
                            break;
                    }
                });
        }

        // Subscribbe To Router Change So That CBB Component Can Be Enabled/Disabled
        this.routeSubscription = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
            this.modifyComponentState(event);
            this.currentUrl = event.url;
        });
    }
    // Method - ngAfterViewInit
    public ngAfterViewInit(): void {
        setTimeout(() => {
            let loginCountryCode = this.queryParams[CBBConstants.c_s_URL_PARAM_COUNTRYCODE] || this.utils.getLogInCountryCode();
            // Set Up Default Country
            this.cbbCountryDropdown.selectedItem = loginCountryCode;
            this.onCountrySelect(loginCountryCode);

            if (this.queryParams[CBBConstants.c_s_URL_PARAM_BUSINESSCODE]) {
                this.onBusinessSelect(this.queryParams[CBBConstants.c_s_URL_PARAM_BUSINESSCODE]);
            }

            if (this.queryParams[CBBConstants.c_s_URL_PARAM_BRANCHCODE]) {
                this.onBranchSelect(this.queryParams[CBBConstants.c_s_URL_PARAM_BRANCHCODE]);
            }
        }, 0);
    }
    // Method - ngOnDestroy
    public ngOnDestroy(): void {
        this.ajaxSource = null;
        this.ajaxSource$ = null;
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
        if (this.routeParamSubscription) {
            this.routeParamSubscription.unsubscribe();
        }
    }

    // Events
    /**
     * Method - onCountrySelect
     * Gets executed on country select
     * Sets input data for business dropdown based on the country selected
     * Also calls the business select function to modify the default value in droopdown
     */
    public onCountrySelect(data: any): void {
        let idx: number = -1;

        if (!data) {
            return;
        }
        // Propagate to service
        this.cbbService.setCountryCode(data);

        for (idx = 0; idx < this.cbbDataCountries.length; idx++) {
            if (this.cbbDataCountries[idx][CBBConstants.c_s_VALUE] === data) {
                this.ls.store('LanguageCode', this.cbbDataCountries[idx][CBBConstants.c_s_LANGUAGECODE]);
                break;
            }
        }

        if (this.cbbDataCountries[idx]) {
            this.cbbDataBusinesses = this.cbbDataCountries[idx][CBBConstants.c_s_BUSINESSES];
        }
        if (this.cbbBusinessDropdown) {
            let i = 0;
            for (i = 0; i < this.cbbDataBusinesses.length; i++) {
                if (this.cbbDataBusinesses[i][CBBConstants.c_s_DEFAULT_BUSINESS] === true) {
                    break;
                }
            }
            if (i >= this.cbbDataBusinesses.length) {
                i = 0;
            }
            this.onBusinessSelect(this.cbbDataBusinesses[i][CBBConstants.c_s_VALUE]);
        }
    }

    /**
     * Method - onBusinessSelect
     * Gets executed on business select
     * Executes CBB service to fetch the branch data
     */
    public onBusinessSelect(data: any): void {
        let idx: number = -1;

        if (!data) {
            return;
        }
        // Propagate to service
        this.cbbService.setBusinessCode(data);

        // Set Dropdown Value
        this.cbbBusinessDropdown.selectedItem = data;
        for (idx = 0; idx < this.cbbDataBusinesses.length; idx++) {
            if (this.cbbDataBusinesses[idx][CBBConstants.c_s_VALUE] === data) {
                break;
            }
        }
        this.cbbDataBranches = this.cbbDataBusinesses[idx] ? this.cbbDataBusinesses[idx][CBBConstants.c_s_BRANCHES] : [];
        if (!this.cbbDataBranches.length) {
            this.cbbDataBranches = CBBConstants.c_o_BLANK_DROPDOWN_LIST;
        }
        if (this.cbbBranchDropdown) {
            let i = 0;
            for (i = 0; i < this.cbbDataBranches.length; i++) {
                if (this.cbbDataBranches[i][CBBConstants.c_s_USER_DEFAULT_BRANCH] === true) {
                    break;
                }
            }
            if (i >= this.cbbDataBranches.length) {
                i = 0;
            }
            //console.log(this.cbbDataBranches[i][CBBConstants.c_s_VALUE]);
            this.onBranchSelect(this.cbbDataBranches[i][CBBConstants.c_s_VALUE]);
        }
    }

    /**
     * Method: onBranchSelect
     * Gets executed on branch select
     */
    public onBranchSelect(data: any): void {
        // Set Dropdown Value
        this.cbbBranchDropdown.selectedItem = data;
        // Propagate to service
        this.cbbService.setBranchCode(data);
    }

    /**
     * Method: modifyComponentState
     * Modifies CBB component state if URL is not available in Menu
     * Checks for 'fromMenu' parameter in URL
     */
    private modifyComponentState(event: any): void {
        if (event.url === '/' || event.url === '/postlogin') {
            this.isDisabled = false;
            return;
        } else {
            let elemList = document.querySelectorAll('.cbb-cont select');
            for (let i = 0; i < elemList.length; i++) {
                this.utils.removeClass(elemList[i], 'ng-dirty');
            }
            this.isDisabled = true;
        }
        /*let urlData: UrlTree = this.router.parseUrl(event.url);
        let queryParams: any = urlData.queryParams;
        let disable: boolean = (queryParams.hasOwnProperty('fromMenu') && queryParams['fromMenu']) ? false : true;

        this.isDisabled = disable;*/
    }
}
