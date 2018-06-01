import { RiExchange } from './../../services/riExchange';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { UserAccessService } from './../../services/user-access.service';
import { LocalStorageService } from 'ng2-webstorage';
import { Store } from '@ngrx/store';
import { Component, OnInit, AfterViewInit, NgZone, OnDestroy, ElementRef, Output, EventEmitter, style } from '@angular/core';
import { ActionTypes } from '../../../app/actions/account';
import { ContractActionTypes } from '../../../app/actions/contract';
import { CallCenterActionTypes } from '../../../app/actions/call-centre-search';
import { AccountMaintenanceActionTypes } from '../../../app/actions/account-maintenance';
import { InvoiceActionTypes } from '../../../app/actions/invoice';
import { ErrorService } from '../../services/error.service';
import { VariableService } from '../../services/variable.service';
import { Utils } from '../../services/utility';
import { MAIN_NAV_DESIGN } from '../main-nav/main-nav-design';
import { DatepickerComponent } from '../../components/datepicker/datepicker';

@Component({
    selector: 'icabs-main-nav',
    templateUrl: 'main-nav.html'

})
export class MainNavComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(private _authService: AuthService, private _ls: LocalStorageService, private ele: ElementRef, private riExchange: RiExchange,
        private zone: NgZone, private _userAccessService: UserAccessService, private _errorService: ErrorService, private _route: ActivatedRoute, private store: Store<any>, private route: Router, private utils: Utils, private variableService: VariableService) {

    }
    @Output() public closeNavEmit = new EventEmitter();
    public data: any;
    public pageKeys: any;
    public mainNavDesign = MAIN_NAV_DESIGN;
    public MainMenu: any;
    public selectedDomain: string;
    public displayFeatureNav: boolean = false;
    public autocompleteMenuData: Array<Object> = [];
    public mainNavData: Array<Object> = [];
    public showMenu: Object = {};
    private documentOnClickRef: any;

    getUserAccess(): void {
        let userData = this._userAccessService.getUserAccessData();
        if (!userData) {
            this.data = this._ls.retrieve('MENU');
        } else {
            this.data = userData;
        }
        if (this.data && typeof this.data.pages !== 'undefined' && this.data.pages.length > 0) {
            this.createUserAccessJson();
        } else {
            this._authService.clearData();
            this._authService.signOut();
            this.route.navigate(['/application/login']);
            //this._errorService.emitError({ title: 'Error from Menu API', message: 'You do not have access to any menus or you are not logged in, redirecting to login in 3 seconds', redirect: true });
        }
    }

    ngOnInit(): void {
        if (!this._route.snapshot.data['domain']) {
            this.selectedDomain = '';
        } else {
            this.selectedDomain = this._route.snapshot.data['domain'];
        }
        this.getUserAccess();
        if (this.MainMenu) {
            for (let i = 0; i < this.MainMenu.length; i++) {
                this.showMenu[this.MainMenu[i]['id']] = false;
            }
        }
        this.documentOnClickRef = this.onDocumentClick.bind(this);
        document.addEventListener('click', this.documentOnClickRef);
    };
    ngAfterViewInit(): void {
        this.mainNavSetHeight();
        this.featureWrapperSetHeight();
        window.onresize = () => {
            this.mainNavSetHeight();
            this.featureWrapperSetHeight();
        };
    };
    ngOnDestroy(): void {
        this._userAccessService = null;
        document.removeEventListener('click', this.documentOnClickRef);
    }

    clearStore(): void {
        /*this.store.dispatch({ type: ActionTypes.CLEAR_ACCOUNT_DATA });
        this.store.dispatch({ type: ContractActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: CallCenterActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: AccountMaintenanceActionTypes.CLEAR_ALL });
        this.store.dispatch({ type: InvoiceActionTypes.CLEAR });
        this.riExchange.clearNavigationData();*/
    }

    menuClick(): void {
        this.variableService.setMenuClick(true);
    }

    createUserAccessJson(): void {
        let domains = JSON.parse(this.mainNavDesign).menu;
        //this._ls.store('LEFTMENU', this.data);
        this.MainMenu = this._userAccessService.getLeftMenuData();
        this.autocompleteMenuData = this._userAccessService.getAutocompleteData();
        if (!this.MainMenu) {
            this.MainMenu = this._ls.retrieve('MAINMENU');
            this.autocompleteMenuData = this._ls.retrieve('AUTOCOMPLETE');
            if (!this.MainMenu) {
                this.autocompleteMenuData = [];
                this.MainMenu = this.checkAndUpdateDomainVisibility(domains);
                this._userAccessService.setLeftMenuData(this.MainMenu);
                this.autocompleteMenuData = this.removeDuplicatesBy(x => x.modulename, this.mainNavData);
                this._userAccessService.setAutocompleteData(this.autocompleteMenuData);
                this._ls.store('AUTOCOMPLETE', this.autocompleteMenuData);
                this._ls.store('MAINMENU', this.MainMenu);
            }
        }
    }

    checkAndUpdateDomainVisibility(domains: any): any {
        let retValue = false;
        let temp = domains.slice(0);
        for (let i = 0; i < temp.length; i++) {
            let domain = temp[i];
            let featureArray = domain.feature;
            domain.visibility = this.checkAndUpdateFeatureVisibility(featureArray, domain.alwaysdisplay);
            if (!domain.visibility && !domain.alwaysdisplay) {
                domains.splice(i, 1);
                temp.splice(i, 1);
                i--;
            }
            if (!retValue) {
                retValue = domain.visibility;
            }
        }
        return domains;
    }

    checkAndUpdateFeatureVisibility(featureArray: any, alwaysDisplay: boolean): boolean {
        let retValue = false;
        let temp = featureArray.slice(0);
        for (let j = 0; j < temp.length; j++) {
            let feature = temp[j];
            let moduleArray = feature.module;
            feature.visibility = this.checkAndUpdateModuleVisibility(moduleArray, alwaysDisplay);
            if (!feature.visibility && !alwaysDisplay) {
                featureArray.splice(j, 1);
                temp.splice(j, 1);
                j--;
            }
            if (!retValue) {
                retValue = feature.visibility;
            }
        }
        return retValue;
    }

    checkAndUpdateModuleVisibility(moduleArray: any, alwaysDisplay: boolean): boolean {
        let retValue = false;
        let temp = moduleArray.slice(0);
        for (let k = 0; k < temp.length; k++) {
            let module = temp[k];
            module.visibility = this.matchWithUserAccess(module.programURL);
            if (!module.visibility && !alwaysDisplay) {
                moduleArray.splice(k, 1);
                temp.splice(k, 1);
                k--;
            }
            else if (temp[k]) {
                this.mainNavData.push(temp[k]);
            }
            if (!retValue) {
                retValue = module.visibility;
            }
        }
        return retValue;
    }

    matchWithUserAccess(programURL: String): boolean {
        let keys = this._userAccessService.getPageKeys();
        for (let i = 0; i < (keys.length); i++) {
            if (keys[i] === programURL) {
                return true;
            }
        }
        return false;
    }

    onModuleSelect(data: any): void {
        let params = this.genQueryParam(data.originalObject);
        this.route.navigate([data.originalObject.routeURL], { queryParams: params });
    }
    public mainNavSetHeight(): void {
        let elem = document.getElementById('main-nav');
        if (elem !== null) {
            if (window.innerWidth < 768) {
                elem.style.height = window.innerHeight - 66 + 'px';
            } else {
                elem.style.height = 'auto';
            }
        }
    }
    public featureWrapperSetHeight(): void {
        if (document.querySelectorAll('.feature-wrapper') !== null && document.querySelectorAll('.feature-wrapper').length > 0 && document.querySelector('.custom-container') !== null) {
            if (window.innerWidth > 767 && window.innerWidth < 1200) {
                this.setCss('.feature-wrapper{height: ' + (window.innerHeight - 150) + 'px}');
            } else if (window.innerWidth > 1200) {
                this.setCss('.feature-wrapper{height: ' + (window.innerHeight - 180) + 'px}');
            } else {
                this.setCss('.feature-wrapper{height: auto}');
            }
        }
    }

    private removeDuplicatesBy(keyFn: any, array: Array<any>): any {
        let mySet = new Set();
        return array.filter((x) => {
            let key = keyFn(x), isNew = !mySet.has(key);
            if (isNew) mySet.add(key);
            return isNew;
        });
    }

    public setCss(css: any): void {
        let head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        style.id = 'feature-wrapper-style';
        if (document.getElementById('feature-wrapper-style')) {
            document.getElementById('feature-wrapper-style').innerText = css + 'sudeep';
        } else {
            style.appendChild(document.createTextNode(css + 'dutta'));
            head.appendChild(style);
        }
    }
    public openFeature(id: any, event: any): void {
        event.stopPropagation();
        if (window.innerWidth < 768) {
            let eleDomain = this.ele.nativeElement.querySelector('#' + id);
            if (eleDomain.className !== 'domain active') {
                eleDomain.className += ' active';
                this.displayFeatureNav = true;
            } else {
                return;
            }
        } else {
            for (let i in this.showMenu) {
                if (i !== id)
                    this.showMenu[i] = false;
            }
            this.showMenu[id] = !this.showMenu[id];
            this.mainNavSetHeight();
            this.featureWrapperSetHeight();
        }
    }
    public openModule(id: any): void {
        if (window.innerWidth < 768) {
            let eleDomain = this.ele.nativeElement.querySelector('#' + id);
            if (eleDomain.className !== 'feature active') {
                if (this.ele.nativeElement.querySelectorAll('.feature-wrapper .feature.active').length > 0) {
                    this.ele.nativeElement.querySelector('.feature-wrapper .feature.active').className = 'feature';
                }
                eleDomain.className += ' active';
                //this.displayFeatureNav = true;
            } else {
                return;
            }
        }
    }
    public backToMain(e: any): void {
        this.ele.nativeElement.querySelector('.main-nav .domain.active').classList.remove('active');
        this.displayFeatureNav = false;
    }
    public closeNav(e: any): void {
        this.closeNavEmit.emit(e);
    }

    public onDocumentClick(event: any): void {
        setTimeout(() => {
            for (let i in this.showMenu) {
                if (this.showMenu.hasOwnProperty(i))
                    this.showMenu[i] = false;
            }
        }, 0);
        if (DatepickerComponent && DatepickerComponent.dateInstance.length > 0) {
            for (let j = 0; j < DatepickerComponent.dateInstance.length; j++) {
              DatepickerComponent.dateInstance[j].opened = false;
            }
        }
        let elem = document.querySelector('.gridtable .selected');
        if (elem)
            this.utils.removeClass(elem, 'selected');
        elem = null;
    }

    public genQueryParam(obj: any): any {
        let param = { fromMenu: true };
        if (obj.hasOwnProperty('queryParams')) {
            for (let i in obj.queryParams) {
                if (i !== '') { param[i] = obj.queryParams[i]; }
            }
        }
        return param;
    }
}
