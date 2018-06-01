import { PremiseMaintenanceAddrRes } from './iCABSAPremiseMaintenanceAddrRes';
import { PremiseMaintenanceAddrRes1 } from './iCABSAPremiseMaintenanceAddrRes1';
import { PremiseMaintenanceAddrRes2 } from './iCABSAPremiseMaintenanceAddrRes2';

import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { RiExchange } from './../../../shared/services/riExchange';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { MessageConstant } from './../../../shared/constants/message.constant';

export class PremiseMaintenanceAddrRes3 {
    public sysCharConstants: SysCharConstants;

    //Duplicated Parent Class objects
    public utils: any;
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

    public pgPM_AR: PremiseMaintenanceAddrRes;
    public pgPM_AR1: PremiseMaintenanceAddrRes1;
    public pgPM_AR2: PremiseMaintenanceAddrRes2;
    public pgPM_AR3: PremiseMaintenanceAddrRes3;

    constructor(private parent: any) {
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

    public killSubscription(): void { /* No Subscriptions Present */ }

    public window_onload(): void {
        this.pgPM_AR = this.parent.pgPM_AR;
        this.pgPM_AR1 = this.parent.pgPM_AR1;
        this.pgPM_AR2 = this.parent.pgPM_AR2;
        this.pgPM_AR3 = this.parent.pgPM_AR3;
        //console.log('PremiseMaintenanceAddrRes3 window_onload:', this.utils.getBusinessCode());
        this.init();
    }

    public init(): void {
        //this.logger.log('PremiseMaintenanceAddrRes3 init:');
    }

    /***************************/

    public DateFrom_a1(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo2');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom2', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo2', true);
    }

    public DateFrom_a2(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo3');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom3', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo3', true);
    }

    public DateFrom_a3(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo4', true);
    }

    public DateFrom_a4(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
    }

    public DateFrom_a5(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    }

    public DateFrom_a6(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    }

    public DateFrom_a7(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    }

    public DateFrom_a8(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    }

    public DateFrom_a9(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public DateFrom_b1(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo3');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom3', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo3', true);
    }

    public DateFrom_b2(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo4', true);
    }

    public DateFrom_b3(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
    }

    public DateFrom_b4(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    }

    public DateFrom_b5(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    }

    public DateFrom_b6(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    }

    public DateFrom_b7(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    }

    public DateFrom_b8(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public DateFrom_c1(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo4', true);
    }

    public DateFrom_c2(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
    }

    public DateFrom_c3(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    }

    public DateFrom_c4(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public DateFrom_c5(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    }

    public DateFrom_c6(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    }

    public DateFrom_c7(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public DateFrom_d1(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo5', true);
    }

    public DateFrom_d2(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    }

    public DateFrom_d3(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    }

    public DateFrom_d4(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    }

    public DateFrom_d5(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    }

    public DateFrom_d6(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public DateFrom_e1(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo6', true);
    }

    public DateFrom_e2(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    }

    public DateFrom_e3(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    }

    public DateFrom_e4(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    }

    public DateFrom_e5(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public DateFrom_f1(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo7', true);
    }

    public DateFrom_f2(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    }

    public DateFrom_f3(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    }

    public DateFrom_f4(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public DateFrom_g1(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo8', true);
    }

    public DateFrom_g2(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    }

    public DateFrom_g3(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public DateFrom_h1(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo9', true);
    }

    public DateFrom_h2(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public DateFrom_i1(): void {
        let msgbox = 'A date within this range has already been added';
        this.pgPM_AR2.validateField(msgbox, 7, 'DateTo10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'DateTo10', true);
    }

    public AccessFrom_a1(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom2');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom2', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo2', true);
    }

    public AccessFrom_a2(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom3');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom3', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo3', true);
    }

    public AccessFrom_a3(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo4', true);
    }

    public AccessFrom_a4(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo5', true);
    }

    public AccessFrom_a5(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    }

    public AccessFrom_a6(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    }

    public AccessFrom_a7(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    }

    public AccessFrom_a8(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    }

    public AccessFrom_a9(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    }

    public AccessFrom_b1(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom3');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom3', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo3', true);
    }

    public AccessFrom_b2(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo4', true);
    }

    public AccessFrom_b3(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo5', true);
    }

    public AccessFrom_b4(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    }

    public AccessFrom_b5(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    }

    public AccessFrom_b6(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    }

    public AccessFrom_b7(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    }

    public AccessFrom_b8(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    }

    public AccessFrom_c1(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom4');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom4', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo4', true);
    }

    public AccessFrom_c2(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo5', true);
    }

    public AccessFrom_c3(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    }

    public AccessFrom_c4(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    }

    public AccessFrom_c5(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    }

    public AccessFrom_c6(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    }

    public AccessFrom_c7(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    }

    public AccessFrom_d1(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom5');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom5', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo5', true);
    }

    public AccessFrom_d2(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    }

    public AccessFrom_d3(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    }

    public AccessFrom_d4(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    }

    public AccessFrom_d5(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    }

    public AccessFrom_d6(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    }

    public AccessFrom_e1(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom6');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom6', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo6', true);
    }

    public AccessFrom_e2(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    }

    public AccessFrom_e3(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    }

    public AccessFrom_e4(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    }

    public AccessFrom_e5(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    }

    public AccessFrom_f1(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom7');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom7', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo7', true);
    }

    public AccessFrom_f2(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    }

    public AccessFrom_f3(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    }

    public AccessFrom_f4(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    }

    public AccessFrom_g1(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom8');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom8', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo8', true);
    }

    public AccessFrom_g2(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    }

    public AccessFrom_g3(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    }

    public AccessFrom_h1(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom9');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom9', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo9', true);
    }

    public AccessFrom_h2(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    }

    public AccessFrom_i1(): void {
        let msgbox = 'This time range has already been defined';
        this.pgPM_AR2.validateField(msgbox, 8, 'AccessFrom10');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessFrom10', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AccessTo10', true);
    }

    public RefreshTechs(): void {
        let ctrl = this.uiForm.controls;
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
        this.riMaintenance.Execute(this, function (data: any): any {
            this.parent.setControlValue('EmployeeCode1', data['EmployeeCode1']);
            this.parent.setControlValue('EmployeeSurname1', data['EmployeeSurname1']);
            this.parent.setControlValue('OccupationDesc1', data['OccupationDesc1']);
            this.parent.setControlValue('Priority1', data['Priority1']);
            this.parent.setControlValue('AllowAllTasks1', data['AllowAllTasks1']);
            this.parent.setControlValue('EmployeeCode2', data['EmployeeCode2']);
            this.parent.setControlValue('EmployeeSurname2', data['EmployeeSurname2']);
            this.parent.setControlValue('OccupationDesc2', data['OccupationDesc2']);
            this.parent.setControlValue('Priority2', data['Priority2']);
            this.parent.setControlValue('AllowAllTasks2', data['AllowAllTasks2']);
            this.parent.setControlValue('EmployeeCode3', data['EmployeeCode3']);
            this.parent.setControlValue('EmployeeSurname3', data['EmployeeSurname3']);
            this.parent.setControlValue('OccupationDesc3', data['OccupationDesc3']);
            this.parent.setControlValue('Priority3', data['Priority3']);
            this.parent.setControlValue('AllowAllTasks3', data['AllowAllTasks3']);
            this.parent.setControlValue('EmployeeCode4', data['EmployeeCode4']);
            this.parent.setControlValue('EmployeeSurname4', data['EmployeeSurname4']);
            this.parent.setControlValue('OccupationDesc4', data['OccupationDesc4']);
            this.parent.setControlValue('Priority4', data['Priority4']);
            this.parent.setControlValue('AllowAllTasks4', data['AllowAllTasks4']);
            this.parent.setControlValue('EmployeeCode5', data['EmployeeCode5']);
            this.parent.setControlValue('EmployeeSurname5', data['EmployeeSurname5']);
            this.parent.setControlValue('OccupationDesc5', data['OccupationDesc5']);
            this.parent.setControlValue('Priority5', data['Priority5']);
            this.parent.setControlValue('AllowAllTasks5', data['AllowAllTasks5']);
            this.parent.setControlValue('EmployeeCode6', data['EmployeeCode6']);
            this.parent.setControlValue('EmployeeSurname6', data['EmployeeSurname6']);
            this.parent.setControlValue('OccupationDesc6', data['OccupationDesc6']);
            this.parent.setControlValue('Priority6', data['Priority6']);
            this.parent.setControlValue('AllowAllTasks6', data['AllowAllTasks6']);
            this.parent.setControlValue('EmployeeCode7', data['EmployeeCode7']);
            this.parent.setControlValue('EmployeeSurname7', data['EmployeeSurname7']);
            this.parent.setControlValue('OccupationDesc7', data['OccupationDesc7']);
            this.parent.setControlValue('Priority7', data['Priority7']);
            this.parent.setControlValue('AllowAllTasks7', data['AllowAllTasks7']);
            this.parent.setControlValue('EmployeeCode8', data['EmployeeCode8']);
            this.parent.setControlValue('EmployeeSurname8', data['EmployeeSurname8']);
            this.parent.setControlValue('OccupationDesc8', data['OccupationDesc8']);
            this.parent.setControlValue('Priority8', data['Priority8']);
            this.parent.setControlValue('AllowAllTasks8', data['AllowAllTasks8']);
            this.parent.setControlValue('EmployeeCode9', data['EmployeeCode9']);
            this.parent.setControlValue('EmployeeSurname9', data['EmployeeSurname9']);
            this.parent.setControlValue('OccupationDesc9', data['OccupationDesc9']);
            this.parent.setControlValue('Priority9', data['Priority9']);
            this.parent.setControlValue('EmployeeCode10', data['EmployeeCode10']);
            this.parent.setControlValue('EmployeeSurname10', data['EmployeeSurname10']);
            this.parent.setControlValue('OccupationDesc10', data['OccupationDesc10']);
            this.parent.setControlValue('Priority10', data['Priority10']);
            this.parent.setControlValue('AllowAllTasks10', data['AllowAllTasks10']);
        });
    }

    public RefreshDates(): void {
        let ctrl = this.uiForm.controls;
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
        this.riMaintenance.Execute(this, function (data: any): any {
            this.parent.setControlValue('DateFrom1', data['DateFrom1']);
            this.parent.setControlValue('DateTo1', data['DateTo1']);
            this.parent.setControlValue('DateFrom2', data['DateFrom2']);
            this.parent.setControlValue('DateTo2', data['DateTo2']);
            this.parent.setControlValue('DateFrom3', data['DateFrom3']);
            this.parent.setControlValue('DateTo3', data['DateTo3']);
            this.parent.setControlValue('DateFrom4', data['DateFrom4']);
            this.parent.setControlValue('DateTo4', data['DateTo4']);
            this.parent.setControlValue('DateFrom5', data['DateFrom5']);
            this.parent.setControlValue('DateTo5', data['DateTo5']);
            this.parent.setControlValue('DateFrom6', data['DateFrom6']);
            this.parent.setControlValue('DateTo6', data['DateTo6']);
            this.parent.setControlValue('DateFrom7', data['DateFrom7']);
            this.parent.setControlValue('DateTo7', data['DateTo7']);
            this.parent.setControlValue('DateFrom8', data['DateFrom8']);
            this.parent.setControlValue('DateTo8', data['DateTo8']);
            this.parent.setControlValue('DateFrom9', data['DateFrom9']);
            this.parent.setControlValue('DateTo9', data['DateTo9']);
            this.parent.setControlValue('DateFrom10', data['DateFrom10']);
            this.parent.setControlValue('DateTo10', data['DateTo10']);
        });
    }

    public RefreshTimes(): void {
        let ctrl = this.uiForm.controls;
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
        this.riMaintenance.Execute(this, function (data: any): any {
            this.parent.setControlValue('AccessFrom1', data['AccessFrom1']);
            this.parent.setControlValue('AccessTo1', data['AccessTo1']);
            this.parent.setControlValue('AccessFrom2', data['AccessFrom2']);
            this.parent.setControlValue('AccessTo2', data['AccessTo2']);
            this.parent.setControlValue('AccessFrom3', data['AccessFrom3']);
            this.parent.setControlValue('AccessTo3', data['AccessTo3']);
            this.parent.setControlValue('AccessFrom4', data['AccessFrom4']);
            this.parent.setControlValue('AccessTo4', data['AccessTo4']);
            this.parent.setControlValue('AccessFrom5', data['AccessFrom5']);
            this.parent.setControlValue('AccessTo5', data['AccessTo5']);
            this.parent.setControlValue('AccessFrom6', data['AccessFrom6']);
            this.parent.setControlValue('AccessTo6', data['AccessTo6']);
            this.parent.setControlValue('AccessFrom7', data['AccessFrom7']);
            this.parent.setControlValue('AccessTo7', data['AccessTo7']);
            this.parent.setControlValue('AccessFrom8', data['AccessFrom8']);
            this.parent.setControlValue('AccessTo8', data['AccessTo8']);
            this.parent.setControlValue('AccessFrom9', data['AccessFrom9']);
            this.parent.setControlValue('AccessTo9', data['AccessTo9']);
            this.parent.setControlValue('AccessFrom10', data['AccessFrom10']);
            this.parent.setControlValue('AccessTo10', data['AccessTo10']);

            if (this.parent.getControlValue('AccessFrom1') === '00:00') {
                this.parent.setControlValue('AccessFrom1', '');
            }
            if (this.parent.getControlValue('AccessFrom2') === '00:00') {
                this.parent.setControlValue('AccessFrom2', '');
            }
            if (this.parent.getControlValue('AccessFrom3') === '00:00') {
                this.parent.setControlValue('AccessFrom3', '');
            }
            if (this.parent.getControlValue('AccessFrom4') === '00:00') {
                this.parent.setControlValue('AccessFrom4', '');
            }
            if (this.parent.getControlValue('AccessFrom5') === '00:00') {
                this.parent.setControlValue('AccessFrom5', '');
            }
            if (this.parent.getControlValue('AccessFrom6') === '00:00') {
                this.parent.setControlValue('AccessFrom6', '');
            }
            if (this.parent.getControlValue('AccessFrom7') === '00:00') {
                this.parent.setControlValue('AccessFrom7', '');
            }
            if (this.parent.getControlValue('AccessFrom8') === '00:00') {
                this.parent.setControlValue('AccessFrom8', '');
            }
            if (this.parent.getControlValue('AccessFrom9') === '00:00') {
                this.parent.setControlValue('AccessFrom9', '');
            }
            if (this.parent.getControlValue('AccessFrom10') === '00:00') {
                this.parent.setControlValue('AccessFrom10', '');
            }
            if (this.parent.getControlValue('AccessTo1') === '00:00') {
                this.parent.setControlValue('AccessTo1', '');
            }
            if (this.parent.getControlValue('AccessTo2') === '00:00') {
                this.parent.setControlValue('AccessTo2', '');
            }
            if (this.parent.getControlValue('AccessTo3') === '00:00') {
                this.parent.setControlValue('AccessTo3', '');
            }
            if (this.parent.getControlValue('AccessTo3') === '00:00') {
                this.parent.setControlValue('AccessTo3', '');
            }
            if (this.parent.getControlValue('AccessTo4') === '00:00') {
                this.parent.setControlValue('AccessTo4', '');
            }
            if (this.parent.getControlValue('AccessTo5') === '00:00') {
                this.parent.setControlValue('AccessTo5', '');
            }
            if (this.parent.getControlValue('AccessTo6') === '00:00') {
                this.parent.setControlValue('AccessTo6', '');
            }
            if (this.parent.getControlValue('AccessTo7') === '00:00') {
                this.parent.setControlValue('AccessTo7', '');
            }
            if (this.parent.getControlValue('AccessTo8') === '00:00') {
                this.parent.setControlValue('AccessTo8', '');
            }
            if (this.parent.getControlValue('AccessTo9') === '00:00') {
                this.parent.setControlValue('AccessTo9', '');
            }
            if (this.parent.getControlValue('AccessTo10') === '00:00') {
                this.parent.setControlValue('AccessTo10', '');
            }
        });
    }

    public EmployeeCode1_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode1') === '') {
            this.parent.setControlValue('EmployeeSurname1', '');
            this.parent.setControlValue('OccupationDesc1', '');
            this.parent.setControlValue('Priority1', '');
            this.parent.setControlValue('AllowAllTasks1', '');
        }
    }

    public EmployeeCode2_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode2') === '') {
            this.parent.setControlValue('EmployeeSurname2', '');
            this.parent.setControlValue('OccupationDesc2', '');
            this.parent.setControlValue('Priority2', '');
            this.parent.setControlValue('AllowAllTasks2', '');
        }
    }

    public EmployeeCode3_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode3') === '') {
            this.parent.setControlValue('EmployeeSurname3', '');
            this.parent.setControlValue('OccupationDesc3', '');
            this.parent.setControlValue('Priority3', '');
            this.parent.setControlValue('AllowAllTasks3', '');
        }
    }

    public EmployeeCode4_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode4') === '') {
            this.parent.setControlValue('EmployeeSurname4', '');
            this.parent.setControlValue('OccupationDesc4', '');
            this.parent.setControlValue('Priority4', '');
            this.parent.setControlValue('AllowAllTasks4', '');
        }
    }

    public EmployeeCode5_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode5') === '') {
            this.parent.setControlValue('EmployeeSurname5', '');
            this.parent.setControlValue('OccupationDesc5', '');
            this.parent.setControlValue('Priority5', '');
            this.parent.setControlValue('AllowAllTasks5', '');
        }
    }

    public EmployeeCode6_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode6') === '') {
            this.parent.setControlValue('EmployeeSurname6', '');
            this.parent.setControlValue('OccupationDesc6', '');
            this.parent.setControlValue('Priority6', '');
            this.parent.setControlValue('AllowAllTasks6', '');
        }
    }

    public EmployeeCode7_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode7') === '') {
            this.parent.setControlValue('EmployeeSurname7', '');
            this.parent.setControlValue('OccupationDesc7', '');
            this.parent.setControlValue('Priority7', '');
            this.parent.setControlValue('AllowAllTasks7', '');
        }
    }

    public EmployeeCode8_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode8') === '') {
            this.parent.setControlValue('EmployeeSurname8', '');
            this.parent.setControlValue('OccupationDesc8', '');
            this.parent.setControlValue('Priority8', '');
            this.parent.setControlValue('AllowAllTasks8', '');
        }
    }

    public EmployeeCode9_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode9') === '') {
            this.parent.setControlValue('EmployeeSurname9', '');
            this.parent.setControlValue('OccupationDesc9', '');
            this.parent.setControlValue('Priority9', '');
            this.parent.setControlValue('AllowAllTasks9', '');
        }
    }

    public EmployeeCode10_ondeactivate(): void {
        if (this.parent.getControlValue('EmployeeCode10') === '') {
            this.parent.setControlValue('EmployeeSurname10', '');
            this.parent.setControlValue('OccupationDesc10', '');
            this.parent.setControlValue('Priority10', '');
            this.parent.setControlValue('AllowAllTasks10', '');
        }
    }


    //Commented out due to implementation of below code inside seldate function
    // public DateFrom1_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom1') === '') {
    //         this.parent.setControlValue('DateTo1', '');
    //     }
    // }

    // public DateFrom2_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom2') === '') {
    //         this.parent.setControlValue('DateTo2', '');
    //     }
    // }

    // public DateFrom3_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom3') === '') {
    //         this.parent.setControlValue('DateTo3', '');
    //     }
    // }

    // public DateFrom4_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom4') === '') {
    //         this.parent.setControlValue('DateTo4', '');
    //     }
    // }

    // public DateFrom5_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom5') === '') {
    //         this.parent.setControlValue('DateTo5', '');
    //     }
    // }

    // public DateFrom6_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom6') === '') {
    //         this.parent.setControlValue('DateTo6', '');
    //     }
    // }

    // public DateFrom7_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom7') === '') {
    //         this.parent.setControlValue('DateTo7', '');
    //     }
    // }

    // public DateFrom8_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom8') === '') {
    //         this.parent.setControlValue('DateTo8', '');
    //     }
    // }

    // public DateFrom9_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom9') === '') {
    //         this.parent.setControlValue('DateTo9', '');
    //     }
    // }

    // public DateFrom10_ondeactivate(): void {
    //     if (this.parent.getControlValue('DateFrom10') === '') {
    //         this.parent.setControlValue('DateTo10', '');
    //     }
    // }

    public AccessFrom1_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom1') === '') {
            this.parent.setControlValue('AccessTo1', '');
        }
    }

    public AccessFrom2_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom2') === '') {
            this.parent.setControlValue('AccessTo2', '');
        }
    }

    public AccessFrom3_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom3') === '') {
            this.parent.setControlValue('AccessTo3', '');
        }
    }

    public AccessFrom4_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom4') === '') {
            this.parent.setControlValue('AccessTo4', '');
        }
    }

    public AccessFrom5_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom5') === '') {
            this.parent.setControlValue('AccessTo5', '');
        }
    }

    public AccessFrom6_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom6') === '') {
            this.parent.setControlValue('AccessTo6', '');
        }
    }

    public AccessFrom7_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom7') === '') {
            this.parent.setControlValue('AccessTo7', '');
        }
    }

    public AccessFrom8_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom8') === '') {
            this.parent.setControlValue('AccessTo8', '');
        }
    }

    public AccessFrom9_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom9') === '') {
            this.parent.setControlValue('AccessTo9', '');
        }
    }

    public AccessFrom10_ondeactivate(): void {
        if (this.parent.getControlValue('AccessFrom10') === '') {
            this.parent.setControlValue('AccessTo10', '');
        }
    }

    public AddTabs(): void {
        this.riTab.TabSet();
        this.riTab.TabClear();
        this.riTab.TabAdd('Address');
        this.riTab.TabAdd('General');
        // this.riTab.TabAdd('Site Risk Assessment');
        this.riTab.TabAdd('Notification Methods');
        this.riTab.TabAdd('Day Restrictions');
        this.riTab.TabAdd('Techs');
        this.riTab.TabAdd('Data Restrictions'); //Is it Data or Date Restrictions?
        this.riTab.TabAdd('Access Times');
        this.riTab.TabDraw();
    }

    public ShowInvoiceNarrativeTab(): void {
        let ctrl = this.uiForm.controls;
        let blnShowTab = false;
        if (!this.pageParams.blnShowInvoiceNarrativeTab) {
            //By default, we will not show tab
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseEntryAddrRes.p';
            //Some of these fields may be blank (e.g. when adding), in which case the request will determine whether the tab should be
            //shown by default. Otherwise the request returns whether the tab should be shown for this premise.
            this.riMaintenance.PostDataAdd('Function', 'ShowInvoiceTab', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('AccountNumber', this.parent.getControlValue('AccountNumber'), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('InvoiceGroupNumber', this.parent.getControlValue('InvoiceGroupNumber'), MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('ShowInvoiceNarrativeTab', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (!data['ShowInvoiceNarrativeTab']) {
                    blnShowTab = true;
                }
                //if ( global default has not yet been set, ) { set it according to blnShowTab.
                if (this.pageParams.blnShowInvoiceNarrativeTab === '' && this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                    this.pageParams.blnShowInvoiceNarrativeTab = blnShowTab;
                }

                if (blnShowTab) {
                    this.riTab.TabAdd('Invoice Narrative');
                    this.riTab.TabDraw();
                }
            }, 'POST');
        } else {
            //Default has been set and current mode is MntConst.eModeAdd, so show tab only if it should be shown by default
            blnShowTab = this.pageParams.blnShowInvoiceNarrativeTab;
            //Show tab if needed.
            if (blnShowTab) {
                this.riTab.TabAdd('Invoice Narrative');
                this.riTab.TabDraw();
            }
        }
    }

    // to test if a tech has been entered more than once
    public TestForDupTechs(strTestString: any): boolean {
        let i = 0;
        let k = 0;
        let vEmpCodesArray = [];
        let vEmpCodeCount = 0;
        let TestForDupTechs = false;

        let ctrl = this.uiForm.controls;
        let vCombEmpCodes = ctrl.EmployeeCode1.value + ',' + ctrl.EmployeeCode2.value + ',';
        vCombEmpCodes = vCombEmpCodes + ctrl.EmployeeCode3.value + ',' + ctrl.EmployeeCode4.value + ',';
        vCombEmpCodes = vCombEmpCodes + ctrl.EmployeeCode5.value + ',' + ctrl.EmployeeCode6.value + ',';
        vCombEmpCodes = vCombEmpCodes + ctrl.EmployeeCode7.value + ',' + ctrl.EmployeeCode8.value + ',';
        vCombEmpCodes = vCombEmpCodes + ctrl.EmployeeCode9.value + ',' + ctrl.EmployeeCode10.value;

        vEmpCodesArray = vCombEmpCodes.split('').splice(0, 10);

        let vEmpCode = 0;
        if (this.utils.mid(strTestString, this.utils.len(strTestString), 1) === 1) {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    if (i !== j) {
                        if (vEmpCodesArray[i] === vEmpCodesArray[j]) {
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
    }

    // to test that a Y or blank is entered
    public TestForY(strTestString: any): boolean {
        return this.utils.TestForY(strTestString);
    }

    //to test for a character in a string
    public TestForChar(str: string): boolean {
        return this.utils.TestForChar(str);
    }

    //to test for any invalid characters in the email address
    public TestForInvalidChar(strEmailString: string): boolean {
        return this.utils.validateEmail(strEmailString);
    }

    public ValidatePostcodeSuburb(): void {
        let error = false;
        let ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntryAddrResFunctions.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('ValidatePostcodeSuburb', 'ValPost', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.riExchange.ClientSideValues.Fetch('BusinessCode'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseAddressLine4', ctrl.PremiseAddressLine4.value, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremiseAddressLine5', ctrl.PremiseAddressLine5.value, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremisePostcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('ValidatePostcodeSuburbError', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data['ValidatePostcodeSuburbError'] === 'true') {
                this.riMaintenance.CancelEvent = true;
                let ValidatePostcodeSuburb = true;
            }
        });
    }

    public ValidateTechs(callback?: any): void {
        let ErrNum;
        let verror = false;
        let ctrl = this.uiForm.controls;
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
        this.riMaintenance.Execute(this, function (data: any): any {
            this.logger.log('ValidateTechs callback', data);
            ErrNum = data.ErrEmployeeCode;
            if (ErrNum === '1' && this.parent.getControlValue('EmployeeCode1') !== '') {
                let msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode1');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode1', true);
                verror = true;
            }
            else if (ErrNum === '2' && this.parent.getControlValue('EmployeeCode2') !== '') {
                let msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode2');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode2', true);
                verror = true;
            } else if (ErrNum === '3' && this.parent.getControlValue('EmployeeCode3') !== '') {
                let msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode3');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode3', true);
                verror = true;
            } else if (ErrNum === '4' && this.parent.getControlValue('EmployeeCode4') !== '') {
                let msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode4');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode4', true);
                verror = true;
            } else if (ErrNum === '5' && this.parent.getControlValue('EmployeeCode5') !== '') {
                let msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode5');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode5', true);
                verror = true;
            } else if (ErrNum === '6' && this.parent.getControlValue('EmployeeCode6') !== '') {
                let msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode6');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode6', true);
                verror = true;
            } else if (ErrNum === '7' && this.parent.getControlValue('EmployeeCode7') !== '') {
                let msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode7');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode7', true);
                verror = true;
            } else if (ErrNum === '8' && this.parent.getControlValue('EmployeeCode8') !== '') {
                let msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode8');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode8', true);
                verror = true;
            } else if (ErrNum === '9' && this.parent.getControlValue('EmployeeCode9') !== '') {
                let msgbox = 'Invalid Employee code';
                this.pgPM_AR2.validateField(msgbox, 6, 'EmployeeCode9');
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeCode9', true);
                verror = true;
            } else if (ErrNum === '10' && this.parent.getControlValue('EmployeeCode10') !== '') {
                let msgbox = 'Invalid Employee code';
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
    }

    public CheckDatesErr(vDateFrom: any, vDateTo: any, v1DateFrom: any, v1DateTo: any): boolean {
        let verror = false;
        this.riMaintenance.CancelEvent = false;

        let strdate = '01/01/1900';

        let DateFrom = '';
        let DateTo = '';
        let compDateFrom = '';
        let compDateTo = '';

        let Date1Int = 0;
        let Date2Int = 0;
        let Date3Int = 0;
        let Date4Int = 0;

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
                        } else if (Date3Int >= Date1Int) {
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
    }

    public CheckTimesErr(vTimeFrom: any, vTimeTo: any, v1TimeFrom: any, v1TimeTo: any): boolean {
        let verror = false;
        this.riMaintenance.CancelEvent = false;

        if (this.utils.StrComp(vTimeFrom, '') !== 0) {
            if (this.utils.StrComp(vTimeTo, '') !== 0) {
                if (this.utils.StrComp(v1TimeFrom, '') !== 0) {
                    if (this.utils.StrComp(v1TimeTo, '') !== 0) {
                        let TimeFrom = this.utils.mid(vTimeFrom, 1, 5);
                        let TimeTo = this.utils.mid(vTimeTo, 1, 5);
                        let compTimeFrom = this.utils.mid(v1TimeFrom, 1, 5);
                        let compTimeTo = this.utils.mid(v1TimeTo, 1, 5);

                        if (this.utils.TimeValue(compTimeFrom) <= this.utils.TimeValue(TimeFrom)) {
                            if (this.utils.TimeValue(compTimeTo) >= this.utils.TimeValue(TimeFrom)) {
                                verror = true;
                            }
                        } else if (this.utils.TimeValue(compTimeFrom) >= this.utils.TimeValue(TimeFrom)) {
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
    }

    public CheckDatesErr1(vDateFrom: any, vDateTo: any): boolean {
        let verror = false;
        if (vDateFrom > vDateTo) { verror = true; }
        return verror;
    }
}
