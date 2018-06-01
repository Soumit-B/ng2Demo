import { PremiseMaintenanceComponent } from './iCABSAPremiseMaintenance';
import { PremiseMaintenance0 } from './iCABSAPremiseMaintenance0';
import { PremiseMaintenance1 } from './iCABSAPremiseMaintenance1';
import { PremiseMaintenance1a } from './iCABSAPremiseMaintenance1a';
import { PremiseMaintenance2 } from './iCABSAPremiseMaintenance2';
import { PremiseMaintenance3 } from './iCABSAPremiseMaintenance3';

import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from './../../../shared/services/utility';
import { MessageConstant } from './../../../shared/constants/message.constant';

export class PremiseMaintenance4 {
    //Duplicated Parent Class objects
    public utils: Utils;
    private xhr: any;
    private xhrParams: any;
    private uiForm: any;
    private controls: any;
    private uiDisplay: any;
    private pageParams: any;
    private attributes: any;
    private formData: any;
    private LookUp: any;
    private logger: any;
    private riExchange: RiExchange;
    private riMaintenance: RiMaintenance;
    private riTab: RiTab;
    private viewChild: any;

    public pgPM0: PremiseMaintenance0;
    public pgPM1: PremiseMaintenance1;
    public pgPM1a: PremiseMaintenance1a;
    public pgPM2: PremiseMaintenance2;
    public pgPM3: PremiseMaintenance3;
    public pgPM4: PremiseMaintenance4;

    constructor(private parent: PremiseMaintenanceComponent) {
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

    public killSubscription(): void {/* */ }

    public window_onload(): void {
        this.pgPM0 = this.parent.pgPM0;
        this.pgPM1 = this.parent.pgPM1;
        this.pgPM1a = this.parent.pgPM1a;
        this.pgPM2 = this.parent.pgPM2;
        this.pgPM3 = this.parent.pgPM3;
        this.pgPM4 = this.parent.pgPM4;
    }

    public init(): void {
        //Init
        this.pageParams.appendedVal = '';
    }

    public doLookup(): any {
        //Moved to PM0
    }

    public OutsideCityLimits_OnClick(): void {
        this.pageParams.initialVtxGeocodeVal = parseInt(this.parent.getControlValue('PremiseVtxGeoCode'), 2);
        if ((this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate)
            && this.parent.getControlValue('OutsideCityLimits') === 'true') {
            this.parent.setControlValue('OriPremiseVtxGeoCode', this.pageParams.initialVtxGeocodeVal);
            this.pageParams.initialVtxGeocodeVal = this.pageParams.initialVtxGeocodeVal - (this.pageParams.initialVtxGeocodeVal % 10000);
            this.parent.setControlValue('PremiseVtxGeoCode', this.pageParams.initialVtxGeocodeVal);
        }
        else if ((this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate)
            && this.parent.getControlValue('OutsideCityLimits') === 'false') {
            this.parent.setControlValue('PremiseVtxGeoCode', this.parent.getControlValue('OriPremiseVtxGeoCode'));
        }
    }
}

