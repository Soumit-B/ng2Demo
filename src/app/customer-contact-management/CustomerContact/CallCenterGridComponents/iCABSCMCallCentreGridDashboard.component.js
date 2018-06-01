import { Component, NgZone, Renderer } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { CallCenterActionTypes } from '../../../actions/call-centre-search';
import { ServiceConstants } from '../../../../shared/constants/service.constants';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { Utils } from '../../../../shared/services/utility';
export var CallCenterGridDashboardComponent = (function () {
    function CallCenterGridDashboardComponent(zone, fb, route, router, store, httpService, utils, serviceConstants, renderer) {
        this.zone = zone;
        this.fb = fb;
        this.route = route;
        this.router = router;
        this.store = store;
        this.httpService = httpService;
        this.utils = utils;
        this.serviceConstants = serviceConstants;
        this.renderer = renderer;
        this.fieldVisibility = {
            DashboardDrill: true
        };
        this.queryCallCentre = new URLSearchParams();
        this.queryParamsCallCenter = {
            action: '0',
            operation: 'ContactManagement/iCABSCMCallCentreGrid',
            module: 'call-centre',
            method: 'ccm/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.dashboardArray = [];
        this.formGroup = this.fb.group({
            DashboardDrill: [{ value: 'none', disabled: false }]
        });
    }
    CallCenterGridDashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.storeSubscription = this.store.select('callcentresearch').subscribe(function (data) {
            _this.storeData = data;
            if (data && data['action']) {
                switch (data['action']) {
                    case CallCenterActionTypes.BUILD_GRID:
                        _this.fetchCallCentreDataPost('GetDashboardDetails', {}, { AccountNumber: _this.utils.checkIfValueExistAndReturn(_this.storeData['otherParams'].otherVariables, 'AccountNumber'), BusinessCode: _this.storeData['code'].business }).subscribe(function (data) {
                            if (data['status'] === GlobalConstant.Configuration.Failure) {
                                _this.store.dispatch({
                                    type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
                                });
                            }
                            else {
                                if (!data['errorMessage']) {
                                    _this.buildDashboardElements(data);
                                }
                            }
                        });
                        break;
                    case CallCenterActionTypes.BUILD_SPECIFIC_GRID:
                        if (_this.storeData['gridToBuild'].indexOf('Dashboard') > -1) {
                            _this.fetchCallCentreDataPost('GetDashboardDetails', {}, { AccountNumber: _this.utils.checkIfValueExistAndReturn(_this.storeData['otherParams'].otherVariables, 'AccountNumber'), BusinessCode: _this.storeData['code'].business }).subscribe(function (data) {
                                if (data['status'] === GlobalConstant.Configuration.Failure) {
                                    _this.store.dispatch({
                                        type: CallCenterActionTypes.DISPLAY_ERROR, payload: data['oResponse']
                                    });
                                }
                                else {
                                    if (!data['errorMessage']) {
                                        _this.buildDashboardElements(data);
                                    }
                                }
                            });
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    };
    CallCenterGridDashboardComponent.prototype.ngAfterViewInit = function () {
        this.store.dispatch({
            type: CallCenterActionTypes.FORM_GROUP, payload: {
                tabDashboard: this.formGroup
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.INITIALIZATION, payload: {
                tabDashboard: true
            }
        });
        this.store.dispatch({
            type: CallCenterActionTypes.SAVE_VISIBILITY_FIELD, payload: {
                tabDashboard: this.fieldVisibility
            }
        });
    };
    CallCenterGridDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.storeSubscription)
            this.storeSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
    };
    CallCenterGridDashboardComponent.prototype.buildDashboardElements = function (data) {
        var dashboardArray = [];
        var counter = 0;
        this.dashboardArray = [];
        for (var prop in data) {
            if (data.hasOwnProperty(prop)) {
                counter++;
                var splitArray = data[prop].split('|');
                dashboardArray.push({
                    label: splitArray[0],
                    value: splitArray[1],
                    backgroundColor: splitArray[2]
                });
                if (counter === 3) {
                    counter = 0;
                    this.dashboardArray.push(dashboardArray);
                    dashboardArray = [];
                }
            }
        }
    };
    CallCenterGridDashboardComponent.prototype.dashboardDrillOnChange = function (event) {
        switch (this.formGroup.controls['DashboardDrill'].value) {
            case 'open':
                this.autoRefineLogsTab('OpenOnly');
                break;
            case 'openoverdue':
                this.autoRefineLogsTab('openoverdue');
                break;
            case 'opencallouts':
                this.autoRefineLogsTab('opencallouts');
                break;
            case 'opencomplaints':
                this.autoRefineLogsTab('opencomplaints');
                break;
            case 'closed31days':
                this.autoRefineLogsTab('closed31days');
                break;
            case 'workorderoverdue':
                this.autoRefineWOTab('overdue');
                break;
            default:
                break;
        }
        this.formGroup.controls['DashboardDrill'].setValue('none');
    };
    CallCenterGridDashboardComponent.prototype.fetchCallCentreDataPost = function (functionName, params, formData) {
        this.queryCallCentre = new URLSearchParams();
        var businessCode = (this.storeData['code'] && this.storeData['code'].business) ? this.storeData['code'].business : this.utils.getBusinessCode();
        var countryCode = (this.storeData['code'] && this.storeData['code'].country) ? this.storeData['code'].country : this.utils.getCountryCode();
        this.queryCallCentre.set(this.serviceConstants.BusinessCode, businessCode);
        this.queryCallCentre.set(this.serviceConstants.CountryCode, countryCode);
        if (functionName !== '') {
            this.queryCallCentre.set(this.serviceConstants.Action, '6');
            this.queryCallCentre.set('Function', functionName);
        }
        for (var key in params) {
            if (key) {
                this.queryCallCentre.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.queryParamsCallCenter.method, this.queryParamsCallCenter.module, this.queryParamsCallCenter.operation, this.queryCallCentre, formData);
    };
    CallCenterGridDashboardComponent.prototype.autoRefineLogsTab = function (value) {
        this.storeData['formGroup'].tabLogs.controls['CallLogSearchOn'].setValue(value);
        var click = new Event('click', { bubbles: true });
        this.renderer.invokeElementMethod(document.querySelector('#tabCont .nav-tabs li:nth-child(6) a'), 'dispatchEvent', [click]);
    };
    CallCenterGridDashboardComponent.prototype.autoRefineWOTab = function (value) {
        this.storeData['formGroup'].tabWorkOrders.controls['WorkOrderType'].setValue(value);
        var click = new MouseEvent('click', { bubbles: true });
        this.renderer.invokeElementMethod(document.querySelector('#tabCont .nav-tabs li:nth-child(8) a'), 'click', [click]);
    };
    CallCenterGridDashboardComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-call-center-grid-dashboard',
                    templateUrl: 'iCABSCMCallCentreGridDashboard.html'
                },] },
    ];
    CallCenterGridDashboardComponent.ctorParameters = [
        { type: NgZone, },
        { type: FormBuilder, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: Store, },
        { type: HttpService, },
        { type: Utils, },
        { type: ServiceConstants, },
        { type: Renderer, },
    ];
    return CallCenterGridDashboardComponent;
}());
