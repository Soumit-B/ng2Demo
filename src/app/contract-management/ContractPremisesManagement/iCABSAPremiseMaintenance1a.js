export var PremiseMaintenance1a = (function () {
    function PremiseMaintenance1a(parent) {
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
    PremiseMaintenance1a.prototype.killSubscription = function () { };
    PremiseMaintenance1a.prototype.window_onload = function () {
        this.pgPM0 = this.parent.pgPM0;
        this.pgPM1 = this.parent.pgPM1;
        this.pgPM1a = this.parent.pgPM1a;
        this.pgPM2 = this.parent.pgPM2;
        this.pgPM3 = this.parent.pgPM3;
        this.pgPM4 = this.parent.pgPM4;
    };
    PremiseMaintenance1a.prototype.SetServiceNotificationFields = function () {
        this.parent.pgPM3.SelServiceNotifyTemplateEmail_OnChange();
        this.parent.pgPM3.SelServiceNotifyTemplateSMS_OnChange();
    };
    PremiseMaintenance1a.prototype.VehicleTypeNumber_onkeydown = function (obj) {
        this.parent.vehicleTypeEllipsis.openModal();
    };
    PremiseMaintenance1a.prototype.LanguageCode_onkeydown = function () {
    };
    PremiseMaintenance1a.prototype.ClosedCalendarTemplateNumber_onkeydown = function () {
    };
    PremiseMaintenance1a.prototype.AddHOptions = function (objSelect) {
    };
    PremiseMaintenance1a.prototype.AddMOptions = function (objSelect) {
    };
    return PremiseMaintenance1a;
}());
