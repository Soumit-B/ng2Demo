import { RiExchange } from './../../services/riExchange';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { UserAccessService } from './../../services/user-access.service';
import { LocalStorageService } from 'ng2-webstorage';
import { Store } from '@ngrx/store';
import { Component, NgZone, ElementRef, Output, EventEmitter } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { VariableService } from '../../services/variable.service';
import { Utils } from '../../services/utility';
import { MAIN_NAV_DESIGN } from '../main-nav/main-nav-design';
export var MainNavComponent = (function () {
    function MainNavComponent(_authService, _ls, ele, riExchange, zone, _userAccessService, _errorService, _route, store, route, utils, variableService) {
        this._authService = _authService;
        this._ls = _ls;
        this.ele = ele;
        this.riExchange = riExchange;
        this.zone = zone;
        this._userAccessService = _userAccessService;
        this._errorService = _errorService;
        this._route = _route;
        this.store = store;
        this.route = route;
        this.utils = utils;
        this.variableService = variableService;
        this.closeNavEmit = new EventEmitter();
        this.mainNavDesign = MAIN_NAV_DESIGN;
        this.displayFeatureNav = false;
        this.autocompleteMenuData = [];
        this.mainNavData = [];
        this.showMenu = {};
    }
    MainNavComponent.prototype.getUserAccess = function () {
        var userData = this._userAccessService.getUserAccessData();
        if (!userData) {
            this.data = this._ls.retrieve('MENU');
        }
        else {
            this.data = userData;
        }
        if (this.data && typeof this.data.pages !== 'undefined' && this.data.pages.length > 0) {
            this.createUserAccessJson();
        }
        else {
            this._authService.clearData();
            this.route.navigate(['/application/login']);
        }
    };
    MainNavComponent.prototype.ngOnInit = function () {
        if (!this._route.snapshot.data['domain']) {
            this.selectedDomain = '';
        }
        else {
            this.selectedDomain = this._route.snapshot.data['domain'];
        }
        this.getUserAccess();
        if (this.MainMenu) {
            for (var i = 0; i < this.MainMenu.length; i++) {
                this.showMenu[this.MainMenu[i]['id']] = false;
            }
        }
        this.documentOnClickRef = this.onDocumentClick.bind(this);
        document.addEventListener('click', this.documentOnClickRef);
    };
    ;
    MainNavComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.mainNavSetHeight();
        this.featureWrapperSetHeight();
        window.onresize = function () {
            _this.mainNavSetHeight();
            _this.featureWrapperSetHeight();
        };
    };
    ;
    MainNavComponent.prototype.ngOnDestroy = function () {
        this._userAccessService = null;
        document.removeEventListener('click', this.documentOnClickRef);
    };
    MainNavComponent.prototype.clearStore = function () {
    };
    MainNavComponent.prototype.menuClick = function () {
        this.variableService.setMenuClick(true);
    };
    MainNavComponent.prototype.createUserAccessJson = function () {
        var domains = JSON.parse(this.mainNavDesign).menu;
        this.MainMenu = this._userAccessService.getLeftMenuData();
        this.autocompleteMenuData = this._userAccessService.getAutocompleteData();
        if (!this.MainMenu) {
            this.MainMenu = this._ls.retrieve('MAINMENU');
            this.autocompleteMenuData = this._ls.retrieve('AUTOCOMPLETE');
            if (!this.MainMenu) {
                this.autocompleteMenuData = [];
                this.MainMenu = this.checkAndUpdateDomainVisibility(domains);
                this._userAccessService.setLeftMenuData(this.MainMenu);
                this.autocompleteMenuData = this.removeDuplicatesBy(function (x) { return x.modulename; }, this.mainNavData);
                this._userAccessService.setAutocompleteData(this.autocompleteMenuData);
                this._ls.store('AUTOCOMPLETE', this.autocompleteMenuData);
                this._ls.store('MAINMENU', this.MainMenu);
            }
        }
    };
    MainNavComponent.prototype.checkAndUpdateDomainVisibility = function (domains) {
        var retValue = false;
        var temp = domains.slice(0);
        for (var i = 0; i < temp.length; i++) {
            var domain = temp[i];
            var featureArray = domain.feature;
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
    };
    MainNavComponent.prototype.checkAndUpdateFeatureVisibility = function (featureArray, alwaysDisplay) {
        var retValue = false;
        var temp = featureArray.slice(0);
        for (var j = 0; j < temp.length; j++) {
            var feature = temp[j];
            var moduleArray = feature.module;
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
    };
    MainNavComponent.prototype.checkAndUpdateModuleVisibility = function (moduleArray, alwaysDisplay) {
        var retValue = false;
        var temp = moduleArray.slice(0);
        for (var k = 0; k < temp.length; k++) {
            var module_1 = temp[k];
            module_1.visibility = this.matchWithUserAccess(module_1.programURL);
            if (!module_1.visibility && !alwaysDisplay) {
                moduleArray.splice(k, 1);
                temp.splice(k, 1);
                k--;
            }
            else if (temp[k]) {
                this.mainNavData.push(temp[k]);
            }
            if (!retValue) {
                retValue = module_1.visibility;
            }
        }
        return retValue;
    };
    MainNavComponent.prototype.matchWithUserAccess = function (programURL) {
        var keys = this._userAccessService.getPageKeys();
        for (var i = 0; i < (keys.length); i++) {
            if (keys[i] === programURL) {
                return true;
            }
        }
        return false;
    };
    MainNavComponent.prototype.onModuleSelect = function (data) {
        var params = this.genQueryParam(data.originalObject);
        this.route.navigate([data.originalObject.routeURL], { queryParams: params });
    };
    MainNavComponent.prototype.mainNavSetHeight = function () {
        var elem = document.getElementById('main-nav');
        if (elem !== null) {
            if (window.innerWidth < 768) {
                elem.style.height = window.innerHeight - 66 + 'px';
            }
            else {
                elem.style.height = 'auto';
            }
        }
    };
    MainNavComponent.prototype.featureWrapperSetHeight = function () {
        if (document.querySelectorAll('.feature-wrapper') !== null && document.querySelectorAll('.feature-wrapper').length > 0 && document.querySelector('.custom-container') !== null) {
            if (window.innerWidth > 767 && window.innerWidth < 1200) {
                this.setCss('.feature-wrapper{height: ' + (window.innerHeight - 150) + 'px}');
            }
            else if (window.innerWidth > 1200) {
                this.setCss('.feature-wrapper{height: ' + (window.innerHeight - 180) + 'px}');
            }
            else {
                this.setCss('.feature-wrapper{height: auto}');
            }
        }
    };
    MainNavComponent.prototype.removeDuplicatesBy = function (keyFn, array) {
        var mySet = new Set();
        return array.filter(function (x) {
            var key = keyFn(x), isNew = !mySet.has(key);
            if (isNew)
                mySet.add(key);
            return isNew;
        });
    };
    MainNavComponent.prototype.setCss = function (css) {
        var head = document.head || document.getElementsByTagName('head')[0], style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'feature-wrapper-style';
        if (document.getElementById('feature-wrapper-style')) {
            document.getElementById('feature-wrapper-style').innerText = css + 'sudeep';
        }
        else {
            style.appendChild(document.createTextNode(css + 'dutta'));
            head.appendChild(style);
        }
    };
    MainNavComponent.prototype.openFeature = function (id, event) {
        event.stopPropagation();
        if (window.innerWidth < 768) {
            var eleDomain = this.ele.nativeElement.querySelector('#' + id);
            if (eleDomain.className !== 'domain active') {
                eleDomain.className += ' active';
                this.displayFeatureNav = true;
            }
            else {
                return;
            }
        }
        else {
            for (var i in this.showMenu) {
                if (i !== id)
                    this.showMenu[i] = false;
            }
            this.showMenu[id] = !this.showMenu[id];
            this.mainNavSetHeight();
            this.featureWrapperSetHeight();
        }
    };
    MainNavComponent.prototype.openModule = function (id) {
        if (window.innerWidth < 768) {
            var eleDomain = this.ele.nativeElement.querySelector('#' + id);
            if (eleDomain.className !== 'feature active') {
                if (this.ele.nativeElement.querySelectorAll('.feature-wrapper .feature.active').length > 0) {
                    this.ele.nativeElement.querySelector('.feature-wrapper .feature.active').className = 'feature';
                }
                eleDomain.className += ' active';
            }
            else {
                return;
            }
        }
    };
    MainNavComponent.prototype.backToMain = function (e) {
        this.ele.nativeElement.querySelector('.main-nav .domain.active').classList.remove('active');
        this.displayFeatureNav = false;
    };
    MainNavComponent.prototype.closeNav = function (e) {
        this.closeNavEmit.emit(e);
    };
    MainNavComponent.prototype.onDocumentClick = function (event) {
        var _this = this;
        setTimeout(function () {
            for (var i in _this.showMenu) {
                if (_this.showMenu.hasOwnProperty(i))
                    _this.showMenu[i] = false;
            }
        }, 0);
        var elem = document.querySelector('.gridtable .selected');
        if (elem)
            this.utils.removeClass(elem, 'selected');
        elem = null;
    };
    MainNavComponent.prototype.genQueryParam = function (obj) {
        var param = { fromMenu: true };
        if (obj.hasOwnProperty('queryParams')) {
            for (var i in obj.queryParams) {
                if (i !== '') {
                    param[i] = obj.queryParams[i];
                }
            }
        }
        return param;
    };
    MainNavComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-main-nav',
                    templateUrl: 'main-nav.html'
                },] },
    ];
    MainNavComponent.ctorParameters = [
        { type: AuthService, },
        { type: LocalStorageService, },
        { type: ElementRef, },
        { type: RiExchange, },
        { type: NgZone, },
        { type: UserAccessService, },
        { type: ErrorService, },
        { type: ActivatedRoute, },
        { type: Store, },
        { type: Router, },
        { type: Utils, },
        { type: VariableService, },
    ];
    MainNavComponent.propDecorators = {
        'closeNavEmit': [{ type: Output },],
    };
    return MainNavComponent;
}());
