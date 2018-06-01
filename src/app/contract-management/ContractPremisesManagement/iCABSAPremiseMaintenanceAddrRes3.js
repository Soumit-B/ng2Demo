import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var PremiseMaintenanceAddrRes3 = (function () {
    function PremiseMaintenanceAddrRes3(parent) {
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
        this.sysCharConstants = this.parent.sysCharConstants;
        this.riExchange = this.parent.riExchange;
        this.riMaintenance = this.parent.riMaintenance;
        this.riTab = this.parent.riTab;
    }
    PremiseMaintenanceAddrRes3.prototype.killSubscription = function () { };
    PremiseMaintenanceAddrRes3.prototype.window_onload = function () {
        this.pgPM_AR = this.parent.pgPM_AR;
        this.pgPM_AR1 = this.parent.pgPM_AR1;
        this.pgPM_AR2 = this.parent.pgPM_AR2;
        this.pgPM_AR3 = this.parent.pgPM_AR3;
        this.init();
    };
    PremiseMaintenanceAddrRes3.prototype.init = function () {
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_a1 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo2');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom2', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo2', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_a2 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo3');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom3', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo3', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_a3 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo4', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_a4 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_a5 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_a6 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_a7 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_a8 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_a9 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_b1 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo3');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom3', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo3', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_b2 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo4', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_b3 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_b4 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_b5 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_b6 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_b7 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_b8 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_c1 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo4', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_c2 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_c3 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_c4 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_c5 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_c6 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_c7 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_d1 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_d2 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_d3 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_d4 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_d5 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_d6 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_e1 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_e2 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_e3 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_e4 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_e5 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_f1 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_f2 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_f3 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_f4 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_g1 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_g2 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_g3 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_h1 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_h2 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.DateFrom_i1 = function () {
        var msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_a1 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom2');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom2', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo2', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_a2 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom3');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom3', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo3', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_a3 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo4', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_a4 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo5', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_a5 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_a6 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_a7 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_a8 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_a9 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_b1 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom3');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom3', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo3', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_b2 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo4', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_b3 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo5', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_b4 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_b5 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_b6 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_b7 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_b8 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_c1 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo4', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_c2 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo5', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_c3 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_c4 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_c5 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_c6 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_c7 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_d1 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo5', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_d2 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_d3 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_d4 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_d5 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_d6 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_e1 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_e2 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_e3 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_e4 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_e5 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_f1 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_f2 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_f3 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_f4 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_g1 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_g2 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_g3 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_h1 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_h2 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom_i1 = function () {
        var msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    };
    PremiseMaintenanceAddrRes3.prototype.RefreshTechs = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntryAddrResFunctions.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('RefreshTechs', 'Refresh', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.riExchange.ClientSideValues.Fetch('BusinessCode'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('EmployeeCode1', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname1', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc1', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority1', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks1', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeCode2', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname2', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc2', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority2', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks2', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeCode3', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname3', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc3', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority3', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks3', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeCode4', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname4', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc4', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority4', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks4', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeCode5', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname5', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc5', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority5', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks5', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeCode6', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname6', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc6', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority6', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks6', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeCode7', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname7', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc7', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority7', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks7', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeCode8', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname8', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc8', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority8', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks8', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeCode9', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname9', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc9', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority9', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks9', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeCode10', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('EmployeeSurname10', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('OccupationDesc10', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('Priority10', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AllowAllTasks10', MntConst.eTypeCode);
        this.riMaintenance.Execute(this, function (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode1', data['EmployeeCode1']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname1', data['EmployeeSurname1']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc1', data['OccupationDesc1']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority1', data['Priority1']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks1', data['AllowAllTasks1']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode2', data['EmployeeCode2']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname2', data['EmployeeSurname2']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc2', data['OccupationDesc2']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority2', data['Priority2']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks2', data['AllowAllTasks2']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode3', data['EmployeeCode3']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname3', data['EmployeeSurname3']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc3', data['OccupationDesc3']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority3', data['Priority3']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks3', data['AllowAllTasks3']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode4', data['EmployeeCode4']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname4', data['EmployeeSurname4']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc4', data['OccupationDesc4']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority4', data['Priority4']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks4', data['AllowAllTasks4']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode5', data['EmployeeCode5']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname5', data['EmployeeSurname5']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc5', data['OccupationDesc5']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority5', data['Priority5']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks5', data['AllowAllTasks5']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode6', data['EmployeeCode6']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname6', data['EmployeeSurname6']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc6', data['OccupationDesc6']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority6', data['Priority6']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks6', data['AllowAllTasks6']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode7', data['EmployeeCode7']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname7', data['EmployeeSurname7']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc7', data['OccupationDesc7']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority7', data['Priority7']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks7', data['AllowAllTasks7']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode8', data['EmployeeCode8']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname8', data['EmployeeSurname8']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc8', data['OccupationDesc8']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority8', data['Priority8']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks8', data['AllowAllTasks8']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode9', data['EmployeeCode9']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname9', data['EmployeeSurname9']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc9', data['OccupationDesc9']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority9', data['Priority9']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode10', data['EmployeeCode10']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname10', data['EmployeeSurname10']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc10', data['OccupationDesc10']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority10', data['Priority10']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks10', data['AllowAllTasks10']);
        });
    };
    PremiseMaintenanceAddrRes3.prototype.RefreshDates = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntryAddrResFunctions.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('RefreshTimes', 'Refresh', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.riExchange.ClientSideValues.Fetch('BusinessCode'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('DateFrom1', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo1', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateFrom2', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo2', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateFrom3', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo3', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateFrom4', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo4', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateFrom5', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo5', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateFrom6', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo6', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateFrom7', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo7', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateFrom8', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo8', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateFrom9', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo9', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateFrom10', MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('DateTo10', MntConst.eTypeDate);
        this.riMaintenance.Execute(this, function (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom1', data['DateFrom1']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo1', data['DateTo1']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom2', data['DateFrom2']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo2', data['DateTo2']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom3', data['DateFrom3']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo3', data['DateTo3']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom4', data['DateFrom4']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo4', data['DateTo4']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom5', data['DateFrom5']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo5', data['DateTo5']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom6', data['DateFrom6']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo6', data['DateTo6']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom7', data['DateFrom7']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo7', data['DateTo7']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom8', data['DateFrom8']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo8', data['DateTo8']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom9', data['DateFrom9']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo9', data['DateTo9']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom10', data['DateFrom10']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo10', data['DateTo10']);
        });
    };
    PremiseMaintenanceAddrRes3.prototype.RefreshTimes = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntryAddrResFunctions.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('RefreshTimes', 'Refresh', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.riExchange.ClientSideValues.Fetch('BusinessCode'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AccessFrom1', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo1', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessFrom2', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo2', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessFrom3', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo3', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessFrom4', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo4', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessFrom5', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo5', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessFrom6', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo6', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessFrom7', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo7', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessFrom8', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo8', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessFrom9', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo9', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessFrom10', MntConst.eTypeTime);
        this.riMaintenance.ReturnDataAdd('AccessTo10', MntConst.eTypeTime);
        this.riMaintenance.Execute(this, function (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom1', data['AccessFrom1']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo1', data['AccessTo1']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom2', data['AccessFrom2']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo2', data['AccessTo2']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom3', data['AccessFrom3']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo3', data['AccessTo3']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom4', data['AccessFrom4']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo4', data['AccessTo4']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom5', data['AccessFrom5']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo5', data['AccessTo5']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom6', data['AccessFrom6']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo6', data['AccessTo6']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom7', data['AccessFrom7']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo7', data['AccessTo7']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom8', data['AccessFrom8']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo8', data['AccessTo8']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom9', data['AccessFrom9']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo9', data['AccessTo9']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom10', data['AccessFrom10']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo10', data['AccessTo10']);
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom1') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom1', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom2') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom2', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom3') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom3', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom4') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom4', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom5') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom5', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom6') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom6', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom7') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom7', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom8') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom8', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom9') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom9', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom10') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessFrom10', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo1') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo1', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo2') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo2', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo3') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo3', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo3') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo3', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo4') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo4', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo5') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo5', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo6') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo6', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo7') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo7', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo8') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo8', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo9') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo9', '');
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessTo10') === '00:00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo10', '');
            }
        });
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode1_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode1') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname1', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc1', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority1', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks1', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode2_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode2') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname2', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc2', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority2', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks2', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode3_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode3') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname3', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc3', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority3', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks3', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode4_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode4') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname4', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc4', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority4', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks4', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode5_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode5') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname5', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc5', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority5', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks5', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode6_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode6') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname6', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc6', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority6', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks6', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode7_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode7') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname7', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc7', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority7', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks7', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode8_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode8') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname8', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc8', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority8', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks8', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode9_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode9') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname9', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc9', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority9', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks9', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.EmployeeCode10_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode10') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname10', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OccupationDesc10', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Priority10', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowAllTasks10', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom1_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom1') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo1', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom2_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom2') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo2', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom3_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom3') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo3', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom4_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom4') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo4', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom5_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom5') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo5', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom6_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom6') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo6', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom7_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom7') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo7', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom8_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom8') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo8', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom9_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom9') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo9', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AccessFrom10_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccessFrom10') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccessTo10', '');
        }
    };
    PremiseMaintenanceAddrRes3.prototype.AddTabs = function () {
        this.riTab.TabSet();
        this.riTab.TabClear();
        this.riTab.TabAdd('Address');
        this.riTab.TabAdd('General');
        this.riTab.TabAdd('Notification Methods');
        this.riTab.TabAdd('Day Restrictions');
        this.riTab.TabAdd('Techs');
        this.riTab.TabAdd('Data Restrictions');
        this.riTab.TabAdd('Access Times');
        this.riTab.TabDraw();
    };
    PremiseMaintenanceAddrRes3.prototype.ShowInvoiceNarrativeTab = function () {
        var ctrl = this.uiForm.controls;
        var blnShowTab = false;
        if (!this.pageParams.blnShowInvoiceNarrativeTab) {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseEntryAddrRes.p';
            this.riMaintenance.PostDataAdd('Function', 'ShowInvoiceTab', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('InvoiceGroupNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'), MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('ShowInvoiceNarrativeTab', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                if (!data['ShowInvoiceNarrativeTab']) {
                    blnShowTab = true;
                }
                if (this.pageParams.blnShowInvoiceNarrativeTab === '' && this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                    this.pageParams.blnShowInvoiceNarrativeTab = blnShowTab;
                }
                if (blnShowTab) {
                    this.riTab.TabAdd('Invoice Narrative');
                    this.riTab.TabDraw();
                }
            }, 'POST');
        }
        else {
            blnShowTab = this.pageParams.blnShowInvoiceNarrativeTab;
            if (blnShowTab) {
                this.riTab.TabAdd('Invoice Narrative');
                this.riTab.TabDraw();
            }
        }
    };
    PremiseMaintenanceAddrRes3.prototype.TestForDupTechs = function (strTestString) {
        var i = 0;
        var k = 0;
        var vEmpCodesArray = [];
        var vEmpCodeCount = 0;
        var TestForDupTechs = false;
        var ctrl = this.uiForm.controls;
        var vCombEmpCodes = ctrl.EmployeeCode1.value + ',' + ctrl.EmployeeCode2.value + ',';
        vCombEmpCodes = vCombEmpCodes + ctrl.EmployeeCode3.value + ',' + ctrl.EmployeeCode4.value + ',';
        vCombEmpCodes = vCombEmpCodes + ctrl.EmployeeCode5.value + ',' + ctrl.EmployeeCode6.value + ',';
        vCombEmpCodes = vCombEmpCodes + ctrl.EmployeeCode7.value + ',' + ctrl.EmployeeCode8.value + ',';
        vCombEmpCodes = vCombEmpCodes + ctrl.EmployeeCode9.value + ',' + ctrl.EmployeeCode10.value;
        vEmpCodesArray = vCombEmpCodes.split('').splice(0, 10);
        var vEmpCode = 0;
        if (this.utils.mid(strTestString, this.utils.len(strTestString), 1) === 1) {
            for (var i_1 = 0; i_1 < 10; i_1++) {
                for (var j = 0; j < 10; j++) {
                    if (i_1 !== j) {
                        if (vEmpCodesArray[i_1] === vEmpCodesArray[j]) {
                            vEmpCode = vEmpCode + 1;
                        }
                    }
                }
            }
        }
        if (vEmpCode > 0) {
            TestForDupTechs = true;
        }
        return TestForDupTechs;
    };
    PremiseMaintenanceAddrRes3.prototype.TestForY = function (strTestString) {
        return this.utils.TestForY(strTestString);
    };
    PremiseMaintenanceAddrRes3.prototype.TestForChar = function (str) {
        return this.utils.TestForChar(str);
    };
    PremiseMaintenanceAddrRes3.prototype.TestForInvalidChar = function (strEmailString) {
        return this.utils.validateEmail(strEmailString);
    };
    PremiseMaintenanceAddrRes3.prototype.ValidatePostcodeSuburb = function () {
        var error = false;
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntryAddrResFunctions.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('ValidatePostcodeSuburb', 'ValPost', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.riExchange.ClientSideValues.Fetch('BusinessCode'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseAddressLine4', ctrl.PremiseAddressLine4.value, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremiseAddressLine5', ctrl.PremiseAddressLine5.value, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremisePostcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('ValidatePostcodeSuburbError', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            if (data['ValidatePostcodeSuburbError'] === 'true') {
                this.riMaintenance.CancelEvent = true;
                var ValidatePostcodeSuburb = true;
            }
        });
    };
    PremiseMaintenanceAddrRes3.prototype.ValidateTechs = function (callback) {
        var ErrNum;
        var verror = false;
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntryAddrResFunctions.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('ValidateTechs', 'Validate', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BranchNumber', this.riExchange.ClientSideValues.Fetch('BranchNumber'), MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('EmployeeCode1', ctrl.EmployeeCode1.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('EmployeeCode2', ctrl.EmployeeCode2.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('EmployeeCode3', ctrl.EmployeeCode3.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('EmployeeCode4', ctrl.EmployeeCode4.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('EmployeeCode5', ctrl.EmployeeCode5.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('EmployeeCode6', ctrl.EmployeeCode6.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('EmployeeCode7', ctrl.EmployeeCode7.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('EmployeeCode8', ctrl.EmployeeCode8.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('EmployeeCode9', ctrl.EmployeeCode9.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('EmployeeCode10', ctrl.EmployeeCode10.value, MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('ErrEmployeeCode', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('ValidateTechs callback', data);
            ErrNum = data.ErrEmployeeCode;
            if (ErrNum === '1' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode1') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode1');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode1', true);
                verror = true;
            }
            else if (ErrNum === '2' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode2') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode2');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode2', true);
                verror = true;
            }
            else if (ErrNum === '3' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode3') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode3');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode3', true);
                verror = true;
            }
            else if (ErrNum === '4' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode4') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode4');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode4', true);
                verror = true;
            }
            else if (ErrNum === '5' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode5') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode5');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode5', true);
                verror = true;
            }
            else if (ErrNum === '6' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode6') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode6');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode6', true);
                verror = true;
            }
            else if (ErrNum === '7' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode7') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode7');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode7', true);
                verror = true;
            }
            else if (ErrNum === '8' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode8') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode8');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode8', true);
                verror = true;
            }
            else if (ErrNum === '9' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode9') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode9');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode9', true);
                verror = true;
            }
            else if (ErrNum === '10' && this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode10') !== '') {
                var msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode10');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode10', true);
                verror = true;
            }
            if (verror) {
                this.riMaintenance.CancelEvent = true;
                this.pageParams.ValidateTechs = true;
            }
            if (typeof callback === 'function') {
                callback.call(this);
            }
        }, 'POST', 0);
    };
    PremiseMaintenanceAddrRes3.prototype.CheckDatesErr = function (vDateFrom, vDateTo, v1DateFrom, v1DateTo) {
        var verror = false;
        this.riMaintenance.CancelEvent = false;
        var strdate = '01/01/1900';
        var DateFrom = '';
        var DateTo = '';
        var compDateFrom = '';
        var compDateTo = '';
        var Date1Int = 0;
        var Date2Int = 0;
        var Date3Int = 0;
        var Date4Int = 0;
        if (this.utils.StrComp(this.utils.ucase(this.utils.trim(vDateFrom)), '') !== 0) {
            if (this.utils.StrComp(this.utils.ucase(this.utils.trim(vDateTo)), '') !== 0) {
                if (this.utils.StrComp(this.utils.ucase(this.utils.trim(v1DateFrom)), '') !== 0) {
                    if (this.utils.StrComp(this.utils.ucase(this.utils.trim(v1DateTo)), '') !== 0) {
                        DateFrom = this.utils.mid(vDateFrom, 1, 10);
                        DateTo = this.utils.mid(vDateTo, 1, 10);
                        compDateFrom = this.utils.mid(v1DateFrom, 1, 10);
                        compDateTo = this.utils.mid(v1DateTo, 1, 10);
                        Date1Int = this.utils.DateDiff('d', strdate, DateFrom);
                        Date2Int = this.utils.DateDiff('d', strdate, DateTo);
                        Date3Int = this.utils.DateDiff('d', strdate, compDateFrom);
                        Date4Int = this.utils.DateDiff('d', strdate, compDateTo);
                        if (Date3Int <= Date1Int) {
                            if (Date4Int >= Date1Int) {
                                verror = true;
                            }
                        }
                        else if (Date3Int >= Date1Int) {
                            if (Date3Int <= Date2Int) {
                                verror = true;
                            }
                        }
                    }
                    if (verror) {
                        this.riMaintenance.CancelEvent = true;
                        return true;
                    }
                }
            }
        }
        return false;
    };
    PremiseMaintenanceAddrRes3.prototype.CheckTimesErr = function (vTimeFrom, vTimeTo, v1TimeFrom, v1TimeTo) {
        var verror = false;
        this.riMaintenance.CancelEvent = false;
        if (this.utils.StrComp(vTimeFrom, '') !== 0) {
            if (this.utils.StrComp(vTimeTo, '') !== 0) {
                if (this.utils.StrComp(v1TimeFrom, '') !== 0) {
                    if (this.utils.StrComp(v1TimeTo, '') !== 0) {
                        var TimeFrom = this.utils.mid(vTimeFrom, 1, 5);
                        var TimeTo = this.utils.mid(vTimeTo, 1, 5);
                        var compTimeFrom = this.utils.mid(v1TimeFrom, 1, 5);
                        var compTimeTo = this.utils.mid(v1TimeTo, 1, 5);
                        if (this.utils.TimeValue(compTimeFrom) <= this.utils.TimeValue(TimeFrom)) {
                            if (this.utils.TimeValue(compTimeTo) >= this.utils.TimeValue(TimeFrom)) {
                                verror = true;
                            }
                        }
                        else if (this.utils.TimeValue(compTimeFrom) >= this.utils.TimeValue(TimeFrom)) {
                            if (this.utils.TimeValue(compTimeFrom) <= this.utils.TimeValue(TimeTo)) {
                                verror = true;
                            }
                        }
                        if (verror) {
                            this.riMaintenance.CancelEvent = true;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    PremiseMaintenanceAddrRes3.prototype.CheckDatesErr1 = function (vDateFrom, vDateTo) {
        var verror = false;
        if (vDateFrom > vDateTo) {
            verror = true;
        }
        return verror;
    };
    return PremiseMaintenanceAddrRes3;
}());
