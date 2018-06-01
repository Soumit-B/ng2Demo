import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var PremiseMaintenance4 = (function () {
    function PremiseMaintenance4(parent) {
        this.parent = parent;
        this.utils = this.parent.utils;
        this.logger = this.parent.logger;
        this.xhr = this.parent.xhr;
        this.xhrParams = this.parent.xhrParams;
        this.LookUp = this.parent.LookUp;
        this.uiForm = this.parent.uiForm;
        this.controls = this.parent.controls;
        this.uiDisplay = this.parent.uiDisplay;
        this.viewChild = this.parent.viewChild;
        this.pageParams = this.parent.pageParams;
        this.attributes = this.parent.attributes;
        this.formData = this.parent.formData;
        this.riExchange = this.parent.riExchange;
        this.riMaintenance = this.parent.riMaintenance;
        this.riTab = this.parent.riTab;
    }
    PremiseMaintenance4.prototype.killSubscription = function () { };
    PremiseMaintenance4.prototype.window_onload = function () {
        this.pgPM0 = this.parent.pgPM0;
        this.pgPM1 = this.parent.pgPM1;
        this.pgPM1a = this.parent.pgPM1a;
        this.pgPM2 = this.parent.pgPM2;
        this.pgPM3 = this.parent.pgPM3;
        this.pgPM4 = this.parent.pgPM4;
    };
    PremiseMaintenance4.prototype.init = function () {
        this.pageParams.appendedVal = '';
    };
    PremiseMaintenance4.prototype.doLookup = function () {
    };
    PremiseMaintenance4.prototype.OutsideCityLimits_OnClick = function () {
        this.pageParams.initialVtxGeocodeVal = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseVtxGeoCode'), 2);
        if ((this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate)
            && this.riExchange.riInputElement.GetValue(this.uiForm, 'OutsideCityLimits') === 'true') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OriPremiseVtxGeoCode', this.pageParams.initialVtxGeocodeVal);
            this.pageParams.initialVtxGeocodeVal = this.pageParams.initialVtxGeocodeVal - (this.pageParams.initialVtxGeocodeVal % 10000);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseVtxGeoCode', this.pageParams.initialVtxGeocodeVal);
        }
        else if ((this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate)
            && this.riExchange.riInputElement.GetValue(this.uiForm, 'OutsideCityLimits') === 'false') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseVtxGeoCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'OriPremiseVtxGeoCode'));
        }
    };
    return PremiseMaintenance4;
}());
