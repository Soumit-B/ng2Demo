import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { InternalGridSearchApplicationModuleRoutes } from './../../../base/PageRoutes';
import { ProductSearchGridComponent } from './../../search/iCABSBProductSearch';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { PremiseLocationSearchComponent } from './../../search/iCABSAPremiseLocationSearch.component';
import { BranchServiceAreaSearchComponent } from './../../search/iCABSBBranchServiceAreaSearch';
import { RouteAwayGlobals } from './../../../../shared/services/route-away-global.service';
import { RouteAwayComponent } from './../../../../shared/components/route-away/route-away';
import { Observable } from 'rxjs/Observable';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { LookUp } from './../../../../shared/services/lookup';
import { RiExchange } from './../../../../shared/services/riExchange';
import { FormGroup } from '@angular/forms';
import { SysCharConstants } from './../../../../shared/constants/syscharservice.constant';
import { Utils } from './../../../../shared/services/utility';
import { SpeedScript } from './../../../../shared/services/speedscript';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter, Injector } from '@angular/core';

@Component({
    templateUrl: 'iCABSAPlanVisitMaintenance.html'
})

export class PlanVisitMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public pageId: string = '';

    /*Syscar Variables */
    public vBusinessCode: string;
    public vCountryCode: string;
    public vEnableServiceCoverDispLev: boolean;
    public vEnableTimePlanning: boolean;
    public iCount: number;
    public vTimeSeparator: string = ':';

    /*Page Vaiables */
    private routeParams: any = {};
    private vbEnableTimePlanning: boolean;
    private vbEnableServiceCoverDispLev: boolean;
    private vbIsFollowUp: any;
    private vbTimeSeparator: string = ':';

    /*Variables*/
    public contractNumberLabel: string = 'Contract number';
    public cancelVisitReasons: Array<Object> = [{}];
    public promptTitle: string;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;

    /*Other Variables*/
    public dtOriginalVisit: string;

    /*ShowHide attributes */
    public setFocusCancelReinstatePlanVisit = new EventEmitter<boolean>();
    public setFocusOriginalVisitDueDate = new EventEmitter<boolean>();
    public showRealignPlanVisits: boolean = true;
    public showCustomerIntegration: boolean = false;
    public showOriginalVisitDuration: boolean = true;
    public showVisitDuration: boolean = true;
    public showVisitNarrative: boolean = true;
    public showVisitDetailText: boolean = true;
    public showVisitDurationDefault: boolean = true;
    public showInvoiceUnitValue: boolean = true;
    public showAdditionalCharge: boolean = true;
    public showDisplayBlock: boolean = false;
    public showLocation: boolean = false;
    public showCancelReason: boolean = false;
    public showRemoveComponent: boolean = false;
    public showInstallComponent: boolean = false;
    public showRemoveQty: boolean = false;
    public showHardSlottype: boolean = false;
    public showCancelReinstate: boolean = false;
    public showBlank: boolean = true;
    public showBlank2: boolean = true;
    public grdCustomerIntegration: boolean = false;
    public showMessageHeader: boolean = true;
    public mainPageInputs: any = [];
    public arrPlannerStatus: any = [];
    public cancelReinstateLabel: string = 'Cancel/Reinstate Visit';


    public uiDisplay: any = {
        tab: {
            tab1: { visible: true, active: true },
            tab2: { visible: true, active: false },
            tab3: { visible: this.showCustomerIntegration, active: false },
            tab4: { visible: true, active: false }
        }
    };

    public ellipsisConfig = {
        visitNarrative: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            component: ScreenNotReadyComponent
        },
        serviceCoverItem: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            component: ScreenNotReadyComponent
        },
        premiseLocation: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            ContractNumber: '',
            ContractName: '',
            PremiseNumber: '',
            PremiseName: '',
            component: PremiseLocationSearchComponent
        },
        branchServiceArea: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp-ServiceEmp',
            showAddNew: false,
            component: BranchServiceAreaSearchComponent
        }
    };

    public headerParams: any = {
        method: 'service-planning/maintenance',
        module: 'plan-visits',
        operation: 'Application/iCABSAPlanVisitMaintenance'
    };

    /*Service Variables**/
    constructor(injector: Injector) {
        super(injector);
        this.pageTitle = this.browserTitle = 'Planned Visit Maintenance';
        this.pageId = PageIdentifier.ICABSAPLANVISITMAINTENANCE;
    }

    public controls: any[] = [
        { name: 'BranchNumber' },
        { name: 'BranchName' },
        { name: 'ContractNumber', disabled: true },
        { name: 'ContractName', disabled: true },
        { name: 'BranchServiceAreaCodeSC', disabled: true },
        { name: 'BranchServiceAreaDescSC', disabled: true },
        { name: 'PremiseNumber', disabled: true },
        { name: 'PremiseName', disabled: true },
        { name: 'BranchServiceAreaCode', required: true },
        { name: 'EmployeeSurname', disabled: true },
        { name: 'ProductCode', disabled: true },
        { name: 'ProductDesc', disabled: true },
        { name: 'VisitTypeCode', disabled: true },
        { name: 'VisitTypeDesc', disabled: true },
        { name: 'ActualVisitTypeCode', disabled: true },
        { name: 'ActualVisitTypeDesc', disabled: true },

        /*Tab 1*/
        { name: 'PlanVisitStatusCode', disabled: true },
        { name: 'PlanVisitStatusDesc', disabled: true },
        { name: 'RealignPlanVisits' },
        { name: 'PlanQuantity', disabled: true },
        { name: 'PlannedVisitDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'StaticVisitDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'CancelReinstatePlanVisit', value: false },
        { name: 'SelReason' },
        { name: 'ActualQuantity', disabled: true },
        { name: 'ActualVisitDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'RoutingVisitStartTime', type: MntConst.eTypeTime },
        { name: 'HardSlotInd', value: false },
        { name: 'selHardSlotType', disabled: true },
        { name: 'PlanRemQuantity', disabled: true },
        { name: 'RemovalQuantity', disabled: true },
        { name: 'EstimatedDuration' },
        { name: 'AppointmentConfirmed', value: false },
        { name: 'AppointmentConfirmedReason' },
        { name: 'ProcessedDateTime', disabled: true, type: MntConst.eTypeDate },
        { name: 'PlanVisitUserCode', disabled: true },
        { name: 'VisitDurationDefault', disabled: true },
        { name: 'SelConfirmationType' },
        { name: 'PlannedVisitDuration', disabled: true },
        { name: 'ActualVisitDuration', disabled: true },
        { name: 'OriginalVisitDuration', disabled: true },
        { name: 'ExcludeFromRouting', value: false },
        { name: 'RoutingExclusionReason' },
        { name: 'ServiceVisitText' },
        { name: 'ServicePlanNumber', disabled: true },
        { name: 'OriginalValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'SelPlannerStatus' },
        { name: 'ClientReference' },
        { name: 'TelesalesOrderNumber', disabled: true },
        { name: 'CmdTelesalesOrder', disabled: true },
        { name: 'VisitNarrativeCode' },
        { name: 'VisitNarrativeDesc', disabled: true },
        { name: 'TelesalesOrderLineNumber', disabled: true },
        { name: 'CmdTelesalesOrderLine' },
        { name: 'ServiceCoverItemNumber', disabled: true },
        { name: 'ItemDescription', disabled: true },
        { name: 'PremiseLocationNumber' },
        { name: 'PremiseLocationDesc', disabled: true },
        { name: 'ProductComponentRemoved', disabled: true },
        { name: 'ProductComponentRemDesc', disabled: true },
        { name: 'ProductComponentCode', disabled: true },
        { name: 'ProductComponentDesc', disabled: true },
        { name: 'InvoiceUnitValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'AdditionalChargeValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'OriginalVisitDueDate', required: true, type: MntConst.eTypeDate },

        /*Tab 2 */
        { name: 'PlanVisitSeqNo', type: MntConst.eTypeCode },
        { name: 'SpecialInstructions' },

        /*Tab 3*/
        { name: 'CICustomerRef', disabled: true },
        { name: 'LinkedCICustomerRef', disabled: true },
        { name: 'CISLAStartDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'CISLAStartTime', disabled: true, type: MntConst.eTypeTime },

        /*Tab 4*/
        { name: 'VisitNotes' },

        //hidden
        { name: 'RequireAnnualTimeInd' },
        { name: 'RequiresVisitDetailTextInd' },
        { name: 'RequiresManualVisitPlanningInd' },
        { name: 'VisitStatusReasonCode' },
        { name: 'DisplayLevelInd', value: false },
        { name: 'CICustRefReq' },
        { name: 'ServiceCoverNumber' },
        { name: 'SelProductCode' },
        { name: 'SelProductDesc' },
        { name: 'SelComponentTypeCode' },
        { name: 'PlanVisitRowID' },
        { name: 'ErrorMessage' },
        { name: 'PlannerStatus' },
        { name: 'ConfirmationType' },
        { name: 'HardSlotType' },
        { name: 'ProdReplacement', value: false },
        { name: 'VisitDurationExists', value: false },
        { name: 'BusinessCode' },
        { name: 'ReasonCode' },
        { name: 'ReasonDesc' },
        { name: 'EmployeeCode' },
        { name: 'Password' }
    ];

    public ngOnInit(): void {
        super.ngOnInit();
        this.loadSpeedScript();
        this.utils.disableCBB(true);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private loadSpeedScript(): void {
        this.vBusinessCode = this.utils.getBusinessCode();
        this.vCountryCode = this.utils.getCountryCode();

        let sysCharNumbers = [
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharEnableTimePlanning
        ];

        let sysCharIP = {
            operation: 'iCABSAPlanVisitMaintenance',
            action: 0,
            businessCode: this.vBusinessCode,
            countryCode: this.vCountryCode,
            SysCharList: sysCharNumbers.toString()
        };

        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            this.vbEnableServiceCoverDispLev = data['records'][0].Required;
            this.vbEnableTimePlanning = data['records'][1].Required;

            if (this.vbEnableTimePlanning === true) {
                this.showVisitDurationDefault = true;
            }
            for (let iCount = 0; iCount < 14; iCount++) {
                let ttPlannerStatus: any = {};
                ttPlannerStatus.PlannerStatusCode = iCount;

                switch (iCount) {
                    case 0: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_00;
                        ttPlannerStatus.SeqNo = 1;
                        break;
                    case 14: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_14;
                        ttPlannerStatus.SeqNo = 2;
                        break;
                    case 13: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_13;
                        ttPlannerStatus.SeqNo = 3;
                        break;
                    case 12: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_12;
                        ttPlannerStatus.SeqNo = 4;
                        break;
                    case 11: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_11;
                        ttPlannerStatus.SeqNo = 5;
                        break;
                    case 10: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_10;
                        ttPlannerStatus.SeqNo = 6;
                        break;
                    case 9: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_09;
                        ttPlannerStatus.SeqNo = 7;
                        break;
                    case 8: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_08;
                        ttPlannerStatus.SeqNo = 8;
                        break;
                    case 7: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_07;
                        ttPlannerStatus.SeqNo = 9;
                        break;
                    case 6: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_06;
                        ttPlannerStatus.SeqNo = 10;
                        break;
                    case 5: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_05;
                        ttPlannerStatus.SeqNo = 11;
                        break;
                    case 4: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_04;
                        ttPlannerStatus.SeqNo = 12;
                        break;
                    case 3: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_03;
                        ttPlannerStatus.SeqNo = 13;
                        break;
                    case 2: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_02;
                        ttPlannerStatus.SeqNo = 14;
                        break;
                    case 1: ttPlannerStatus.PlannerStatusDesc = this.speedScriptConstants.PLANNERSTATUS_01;
                        ttPlannerStatus.SeqNo = 15;
                        break;
                }
                this.arrPlannerStatus.push(ttPlannerStatus);
            }
            this.onWindowLoad();
        });
    }

    private onWindowLoad(): void {
        let strInpTitle = '^1^ Number';
        let currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        this.contractNumberLabel = strInpTitle.replace('^1^', currentContractTypeLabel);

        this.riExchange.riInputElement.Disable(this.uiForm, 'SelReason');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelPlannerStatus');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelConfirmationType');

        this.setPageAsParentMode();
    }

    /**
     * Updates document as per parentMode
     */
    private setPageAsParentMode(): void {
        let vrRowid: any;
        switch (this.parentMode) {
            case 'ContactHistory':
                vrRowid = this.riExchange.getParentAttributeValue('RowID');
                break;
            case 'TechVisitDiary':
                vrRowid = this.riExchange.getParentHTMLValue('PlanVisitRowId');
                this.setControlValue('PlanVisitRowID', vrRowid);
                break;
            default:
                vrRowid = this.riExchange.getParentAttributeValue('PlanVisitRowID');
                break;
        }
        if (vrRowid !== '') {
            this.setControlValue('PlanVisitRowID', vrRowid);
        }
        this.fetchRecord(vrRowid);
    }

    /**
     * Fetches Record for a particular RowID
     * @param vrRowid
     */
    private fetchRecord(vrRowid: any): void {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('PlanVisitROWID', vrRowid);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.messageModal.show(data, true);
                    return;
                }

                this.routeAwayGlobals.setSaveEnabledFlag(true);
                let checkBoxList = ['AppointmentConfirmed', 'VisitDurationExists', 'DisplayLevelInd', 'CancelReinstatePlanVisit',
                    'ProdReplacement', 'ExcludeFromRouting', 'HardSlotInd', 'CICustRefReq', 'RealignPlanVisits'];

                for (let key in data) {
                    if (key) {
                        if (checkBoxList.indexOf(key) >= 0) {
                            this.setControlValue(key, this.utils.convertResponseValueToCheckboxInput(data[key]));
                            continue;
                        } else if (key === 'OriginalValue' || key === 'AdditionalChargeValue' || key === 'InvoiceUnitValue') {
                            this.setControlValue(key, data[key]);
                        } else if (key === 'RoutingVisitStartTime' || key === 'CISLAStartTime') {
                            this.setControlValue(key, this.utils.secondsToHms(data[key]));
                        }
                        else if (key === 'PlanVisit') {
                            this.setControlValue('PlanVisitRowID', data[key]);
                        } else {
                            this.setControlValue(key, data[key]);
                        }
                    }
                }
                this.ellipsisConfig.premiseLocation.ContractNumber = data['ContractNumber'];
                this.ellipsisConfig.premiseLocation.PremiseNumber = data['PremiseNumber'];
                this.lookup();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private lookup(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookup_details = [{
            'table': 'Contract',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'ContractNumber': this.getControlValue('ContractNumber')
            },
            'fields': ['ContractName']
        }, {
            'table': 'Premise',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'ContractNumber': this.getControlValue('ContractNumber'),
                'PremiseNumber': this.getControlValue('PremiseNumber')
            },
            'fields': ['PremiseName', 'CICustRefReq']
        }, {
            'table': 'Product',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'ProductCode': this.getControlValue('ProductCode')
            },
            'fields': ['ProductDesc', 'RequireAnnualTimeInd', 'RequiresVisitDetailTextInd', 'RequiresManualVisitPlanningInd']
        }, {
            'table': 'Branch',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'BranchNumber': this.getControlValue('BranchNumber')
            },
            'fields': ['BranchName']
        }, {
            'table': 'BranchServiceArea',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'BranchNumber': this.getControlValue('BranchNumber'),
                'BranchServiceAreaCode': this.getControlValue('BranchServiceAreaCode')
            },
            'fields': ['EmployeeCode', 'BranchServiceAreaDesc']
        }, {
            'table': 'VisitType',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'VisitTypeCode': this.getControlValue('VisitTypeCode')
            },
            'fields': ['VisitTypeDesc', 'ActualVisitTypeDesc']
        }, {
            'table': 'PlanVisitStatusLang',
            'query': {
                'LanguageCode': this.riExchange.LanguageCode(), // LanguageCode
                'PlanVisitStatusCode': this.getControlValue('PlanVisitStatusCode')
            },
            'fields': ['PlanVisitStatusDesc']
        }, {
            'table': 'VisitNarrative',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'VisitNarrativeCode': this.getControlValue('VisitNarrativeCode')
            },
            'fields': ['VisitNarrativeDesc']
        }];

        if (this.vbEnableServiceCoverDispLev && this.getControlValue('ProdReplacement') === true) {
            lookup_details.push({
                'table': 'ServiceCoverItem',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode'),
                    'ServiceCoverNumber': this.getControlValue('ServiceCoverNumber'),
                    'ServiceCoverItemNumber': this.getControlValue('ServiceCoverItemNumber')
                },
                'fields': ['ItemDescription']
            });
            lookup_details.push({
                'table': 'PremiseLocation',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'PremiseLocationNumber': this.getControlValue('PremiseLocationNumber')
                },
                'fields': ['PremiseLocationDesc']
            });
        }

        this.LookUp.lookUpRecord(lookup_details).subscribe(
            (data) => {
                if (data.length > 0) {
                    let contractData = data[0];
                    let premiseData = data[1];
                    let productData = data[2];
                    let branchData = data[3];
                    let branchServiceData = data[4];
                    let visitTypeData = data[5];
                    let planVisitStatusData = data[6];
                    let visitNarrativeData = data[7];

                    if (contractData.length > 0) {
                        this.setControlValue('ContractName', contractData[0].ContractName);
                        this.ellipsisConfig.premiseLocation.ContractName = contractData[0].ContractName;
                    }
                    if (premiseData.length > 0) {
                        this.setControlValue('PremiseName', premiseData[0].PremiseName);
                        this.setControlValue('CICustRefReq', premiseData[0].CICustRefReq);
                        this.ellipsisConfig.premiseLocation.PremiseName = premiseData[0].PremiseName;
                        if (this.riExchange.riInputElement.checked(this.uiForm, 'CICustRefReq')) {
                            this.showCustomerIntegration = premiseData[0].CICustRefReq;
                        }
                    } if (productData.length > 0) {
                        this.setControlValue('ProductDesc', productData[0].ProductDesc);
                        this.setControlValue('RequiresManualVisitPlanningInd', productData[0].RequiresManualVisitPlanningInd);
                        this.setControlValue('RequireAnnualTimeInd', productData[0].RequireAnnualTimeInd);
                        this.setControlValue('RequiresVisitDetailTextInd', productData[0].RequiresVisitDetailTextInd);

                        if (!this.riExchange.riInputElement.checked(this.uiForm, 'RequireAnnualTimeInd')) {
                            this.showOriginalVisitDuration = false;
                            this.showVisitDuration = false;
                            this.showBlank = true;
                        }
                        if (!this.riExchange.riInputElement.checked(this.uiForm, 'RequiresVisitDetailTextInd')) {
                            this.showVisitDetailText = false;
                        }
                    }
                    if (branchData.length > 0) {
                        this.setControlValue('BranchName', branchData[0].BranchName);
                    }
                    if (branchServiceData.length > 0) {
                        this.setControlValue('BranchServiceAreaDescSC', branchServiceData[0].BranchServiceAreaDesc);
                        this.setControlValue('EmployeeCode', branchServiceData[0].EmployeeCode);
                        this.getEmployeeSurname(branchServiceData[0].EmployeeCode);
                    }
                    if (visitTypeData.length > 0) {
                        this.setControlValue('VisitTypeDesc', visitTypeData[0].VisitTypeDesc);
                        if (this.getControlValue('ActualVisitTypeCode')) {
                            this.setControlValue('ActualVisitTypeDesc', visitTypeData[0].VisitTypeDesc);
                        }
                    }
                    if (planVisitStatusData.length > 0) {
                        this.setControlValue('PlanVisitStatusDesc', planVisitStatusData[0].PlanVisitStatusDesc);
                    }
                    if (visitNarrativeData.length > 0) {
                        this.setControlValue('VisitNarrativeDesc', visitNarrativeData[0].VisitNarrativeDesc);
                    }

                    if (this.vbEnableServiceCoverDispLev && this.getControlValue('ProdReplacement') === true) {
                        let serviceCoverItemData = data[8];
                        let premiseLocationData = data[9];
                        if (serviceCoverItemData.length > 0) {
                            this.setControlValue('ItemDescription', serviceCoverItemData[0].ItemDescription);
                        }
                        if (premiseLocationData.length > 0) {
                            this.setControlValue('PremiseLocationDesc', premiseLocationData[0].PremiseLocationDesc);
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.updatePageView();
            });
    }

    private updatePageView(): void {

        let premiseLocationNumber = this.getControlValue('PremiseLocationNumber');
        if (premiseLocationNumber !== '0' && !premiseLocationNumber) {
            this.premiseLocationNumber_onChange();
        }

        let serviceCoverItemNumber = this.getControlValue('ServiceCoverItemNumber');
        if (serviceCoverItemNumber !== '0' && !serviceCoverItemNumber) {
            this.setServiceCoverItemDesc();
        }

        this.setFieldLabels();

        if (!this.getIsSCHardSlot()) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'HardSlotInd');
        } else {
            this.riExchange.riInputElement.Enable(this.uiForm, 'HardSlotInd');
        }
        this.hardSlotInd_OnClick();
        this.riExchange.riInputElement.Disable(this.uiForm, 'CmdTelesalesOrder');
        this.riExchange.riInputElement.Disable(this.uiForm, 'CmdTelesalesOrderLine');

        if (this.getControlValue('TelesalesOrderNumber') !== '0' && this.getControlValue('TelesalesOrderNumber')) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'CmdTelesalesOrder');
            this.riExchange.riInputElement.Enable(this.uiForm, 'CmdTelesalesOrderLine');
        }

        this.updateVisibilityStatus();
        this.loadCancelPage();
        this.setValue();
    }

    private setFieldLabels(): void {
        this.showCancelReason = false;
        let planVisitStatusCode = this.getControlValue('PlanVisitStatusCode');

        switch (planVisitStatusCode) {
            case 'C':
                // Show Cancel Reason READ-ONLY! User Can Then See Why Previously Cancelled
                this.showCancelReinstate = true;
                this.showCancelReason = true;
                this.utils.getTranslatedval('Reinstate Visit').then((res: string) => { this.cancelReinstateLabel = res; });
                this.setControlValue('SelReason', '');
                break;
            case 'U':
            case 'I':
            case 'P':
                this.showCancelReason = true;
                this.showCancelReinstate = true;
                this.utils.getTranslatedval('Cancel Visit').then((res: string) => { this.cancelReinstateLabel = res; });
                this.setControlValue('SelReason', '');
                break;
            case 'V':
                this.showCancelReinstate = false;
        }
    }

    private getIsSCHardSlot(): boolean {

        this.ajaxSource.next(this.ajaxconstant.START);

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');

        searchParams.set('Function', 'IsSCHardSlot');
        searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        searchParams.set('ProductCode', this.getControlValue('ProductCode'));
        searchParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
        searchParams.set(this.serviceConstants.Action, '0');

        let isSCHardSlot;
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
            (data) => {
                if (!data.error) {
                    if (data.IsSCHardSlot) {
                        isSCHardSlot = true;
                    } else {
                        isSCHardSlot = false;
                    }
                    this.setControlValue('selHardSlotType', data.HardSlotType);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

        return isSCHardSlot;
    }

    private loadCancelPage(): void {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');

        let bodyParams: any = {};
        bodyParams['Function'] = 'LoadCancelPage';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.setControlValue('ReasonCode', data.ReasonCode);
                this.setControlValue('ReasonDesc', data.ReasonDesc);
                this.setControlValue('Password', data.Password);
                this.cancelVisitReasons = [];

                let vcReasonCodes = data.ReasonCode.split(';');
                let vcReasonDescs = data.ReasonDesc.split(';');

                for (let i = -1; i < vcReasonCodes.length; i++) {
                    let obj = {
                        key: vcReasonCodes[i],
                        value: vcReasonDescs[i]
                    };

                    this.cancelVisitReasons.push(obj);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private setValue(): void {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');

        let bodyParams: any = {};
        bodyParams['Function'] = 'SetValue';
        bodyParams['PlanVisitROWID'] = this.getControlValue('PlanVisitRowID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.messageModal.show(data, true);
                    return;
                }

                this.vbIsFollowUp = data.IsFollowUp;
                this.setControlValue('PlanVisitUserCode', data.PlanVisitUserCode);
                if (this.vbIsFollowUp === 'False') {
                    this.riExchange.riInputElement.Disable(this.uiForm, 'EstimatedDuration');
                }

                // When Cancelled Populate DropDown So It Is Shown On Update
                if (this.getControlValue('PlanVisitStatusCode') === 'C') {
                    this.setControlValue('SelReason', this.getControlValue('VisitStatusReasonCode'));
                } else {
                    this.setValidCancelReason();
                }
                this.setControlValue('SelPlannerStatus', this.getControlValue('PlannerStatus'));

                if (this.getControlValue('ConfirmationType') === '') {
                    this.setControlValue('SelConfirmationType', '');
                } else {
                    this.setControlValue('SelConfirmationType', this.getControlValue('ConfirmationType').toLowerCase());
                }

                this.appointmentConfirmed_OnClick();
                this.excludeFromRouting_OnClick();

                if (this.parentMode === 'ServicePlanningNote') {
                    this.renderTab(2);
                }

                this.beforeUpdate();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private setValidCancelReason(): void {
        this.cancelVisitReasons.pop();
        this.cancelVisitReasons = [];

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');

        let bodyParams: any = {};
        bodyParams['Function'] = 'SetValidCancelReason';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (!data.error) {
                    this.setControlValue('ReasonCode', data.ReasonCode);
                    this.setControlValue('ReasonDesc', data.ReasonDesc);
                    this.cancelVisitReasons = [];
                    let vcReasonCodes = data.ReasonCode.split(';');
                    let vcReasonDescs = data.ReasonDesc.split(';');

                    for (let i = -1; i < vcReasonCodes.length; i++) {
                        let obj = {
                            key: vcReasonCodes[i],
                            value: vcReasonDescs[i]
                        };
                        this.cancelVisitReasons.push(obj);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private updateVisibilityStatus(): void {
        if (this.vbEnableServiceCoverDispLev) {
            this.showVisitDetailText = true;
            this.showVisitNarrative = true;
            this.showInvoiceUnitValue = true;
            this.showAdditionalCharge = true;

            if (this.getControlValue('ProdReplacement') === true) {
                this.showDisplayBlock = true;
                this.showLocation = true;
                this.showRemoveComponent = true;
                this.showInstallComponent = true;
                this.showRemoveQty = true;
            } else {
                this.showDisplayBlock = false;
                this.showLocation = false;
                this.showRemoveComponent = false;
                this.showInstallComponent = false;
                this.showRemoveQty = false;
            }
        } else {
            this.showVisitNarrative = false;
            this.showAdditionalCharge = false;
            this.showInvoiceUnitValue = false;
            this.showInstallComponent = false;
            this.showRemoveComponent = false;
            this.showLocation = false;
            this.showDisplayBlock = false;
            this.showRemoveQty = false;
        }
    }

    private setServiceCoverItemDesc(): void {
        if (this.getControlValue('PremiseLocationNumber')) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');

            searchParams.set('Function', 'SetItemDescription');
            searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
            searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            searchParams.set('ProductCode', this.getControlValue('ProductCode'));
            searchParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
            searchParams.set('ServiceCoverItemNumber', this.getControlValue('ServiceCoverItemNumber'));

            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.messageModal.show(data, true);
                    } else {
                        this.setControlValue('ItemDescription', data.ItemDescription);
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.setControlValue('ItemDescription', '');
        }
    }

    public visitNarrativeCode_onchange(): void {
        this.setControlValue('VisitNarrativeCode', this.UCase(this.getControlValue('VisitNarrativeCode')));
        if (this.getControlValue('VisitNarrativeCode')) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '6');

            let bodyParams: any = {};
            bodyParams['Function'] = 'GetVisitNarrativeDesc';
            bodyParams['VisitNarrativeCode'] = this.getControlValue('VisitNarrativeCode');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.messageModal.show(data, true);
                        this.setControlValue('VisitNarrativeCode', '');
                        this.setControlValue('VisitNarrativeDesc', '');
                    } else {
                        this.setControlValue('VisitNarrativeDesc', data.VisitNarrativeDesc);
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.setControlValue('VisitNarrativeDesc', '');
        }
    }

    public serviceCoverItemNumber_onchange(): void {
        if (this.getControlValue('ServiceCoverItemNumber')) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');

            searchParams.set('Function', 'GetServiceCoverItemNumberDesc');
            searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
            searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            searchParams.set('ProductCode', this.getControlValue('ProductCode'));
            searchParams.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
            searchParams.set('ServiceCoverItemNumber', this.getControlValue('ServiceCoverItemNumber'));

            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
                (data) => {
                    if (data.hasError) {
                        this.messageModal.show(data, true);
                        this.setControlValue('ServiceCoverItemNumber', '0');
                        this.setControlValue('ItemDescription', '');
                    } else {
                        this.setControlValue('ItemDescription', data.ItemDescription);
                        this.setControlValue('PremiseLocationNumber', data.PremiseLocationNumber);
                        this.setControlValue('PremiseLocationDesc', data.PremiseLocationDesc);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.setControlValue('VisitNarrativeDesc', '');
        }
    }

    public premiseLocationNumber_onChange(): void {
        if (this.getControlValue('PremiseLocationNumber')) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');

            searchParams.set('Function', 'GetServiceCoverItemNumberDesc');
            searchParams.set('ContractNumber', this.getControlValue('ContractNumber'));
            searchParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            searchParams.set('PremiseLocationNumber', this.getControlValue('ProductCode'));

            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
                (data) => {
                    if (data.hasError) {
                        this.messageModal.show(data, true);
                        this.setControlValue('PremiseLocationNumber', '0');
                        this.setControlValue('PremiseLocationDesc', '');
                    } else {
                        this.setControlValue('PremiseLocationDesc', data.PremiseLocationDesc);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.setControlValue('PremiseLocationDesc', '');
        }

    }

    public productComponentRemoved_onChange(): void {
        if (this.getControlValue('ProductComponentRemoved')) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');

            searchParams.set('Function', 'GetProductComponentRemDesc');
            searchParams.set('ProductComponentRemoved', this.getControlValue('ContractNumber'));

            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
                (data) => {
                    if (data.hasError) {
                        this.messageModal.show(data, true);
                        this.setControlValue('ProductComponentRemDesc', '');
                    } else {
                        this.setControlValue('ProductComponentRemDesc', data.ProductComponentRemDesc);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        else {
            this.setControlValue('ProductComponentRemDesc', '');
        }
    }

    public productComponentCode_onChange(): void {
        if (this.getControlValue('ProductComponentCode')) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '0');

            searchParams.set('Function', 'GetProductComponentDesc');
            searchParams.set('ProductComponentCode', this.getControlValue('ProductComponentCode'));

            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
                (data) => {
                    if (data.hasError) {
                        this.messageModal.show(data, true);
                        this.setControlValue('ProductComponentRemDesc', '');
                    } else {
                        this.setControlValue('ProductComponentDesc', data.ProductComponentRemDesc);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.setControlValue('ProductComponentDesc', '');
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        else {
            this.setControlValue('ProductComponentDesc', '');
        }
    }

    /**
     * On Ellipsis Data Fetch
     * @param e
     * @param name
     */
    public inputField_OnChange(e: any, name: any): void {
        if (name === 'VisitNarrative') {
            this.visitNarrativeCode_onchange();
        } else if (name === 'ServiceCoverItem') {
            this.serviceCoverItemNumber_onchange();
        } else if (name === 'PremiseLocation') {
            this.setControlValue('PremiseLocationNumber', e.PremiseLocationNumber);
            this.setControlValue('PremiseLocationDesc', e.PremiseLocationDesc);
        } else if (name === 'ProductRemoved') {
            this.setControlValue('ProductComponentRemoved', e.SelProductCode);
            this.setControlValue('ProductComponentRemDesc', e.SelProductDesc);
        } else if (name === 'Product') {
            this.setControlValue('ProductComponentCode', e.SelProductCode);
            this.setControlValue('ProductComponentDesc', e.SelProductDesc);
        } else if (name === 'BranchServiceArea') {
            this.setControlValue('BranchServiceAreaCode', e.BranchServiceAreaCode);
            this.setControlValue('EmployeeSurname', e.EmployeeSurname);
        }
    }

    public visitDurationDefault_OnChange(): void {
        this.processTimeString('VisitDurationDefault');
    }

    public estimatedDuration_OnChange(): void {
        this.processTimeString('EstimatedDuration');
    }

    private originalVisitDueDate_onDeactivate(): void {
        if (this.getControlValue('AppointmentConfirmed')) {
            this.setControlValue('PlannedVisitDate', this.getControlValue('OriginalVisitDueDate'));
        }
    }

    public branchServiceAreaCode_onChange(): void {
        this.setControlValue('BranchServiceAreaCode', this.UCase(this.getControlValue('BranchServiceAreaCode')));
        if (this.getControlValue('BranchServiceAreaCode')) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '6');

            let bodyParams: any = {};
            bodyParams['Function'] = 'GetEmployeeSurname';
            bodyParams['BranchNumber'] = this.getControlValue('BranchNumber');
            bodyParams['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.messageModal.show(data, true);
                        this.setControlValue('BranchServiceAreaCode', '');
                        this.setControlValue('EmployeeSurname', '');
                    } else {
                        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                    }
                },
                (error) => {
                    this.setControlValue('BranchServiceAreaCode', '');
                    this.setControlValue('EmployeeSurname', '');
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    /**
     * Fetches Employee surname from EmployeeCode
     * @param empCode
     */
    private getEmployeeSurname(empCode: any): void {
        let employee_details = [{
            'table': 'Employee',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'EmployeeCode': empCode
            },
            'fields': ['EmployeeSurname']
        }];

        this.LookUp.lookUpRecord(employee_details).subscribe((data) => {
            if (data.length > 0) {
                let empData = data[0];
                this.setControlValue('EmployeeSurname', empData[0].EmployeeSurname);
            }
        });
    }

    private processTimeString(vbTimeField: string): void {
        let vbTime;
        let vbDurationHours;
        let vbDurationMinutes;
        let vbTimeSec;
        let vbVisitDurationSec;
        let vbError = false;
        let vbMsgResult;
        let vbTimeFormat = '00' + this.vbTimeSeparator + '00';

        switch (vbTimeField) {
            case 'EstimatedDuration':
                vbTime = this.getControlValue('EstimatedDuration').replace(this.vbTimeSeparator, '');
                break;
            case 'VisitDurationDefault':
                vbTime = this.getControlValue('VisitDurationDefault').replace(this.vbTimeSeparator, '');
                break;
        }

        if ((vbTime.length > 4 && vbTime.length < 7) || (vbTime !== 0)) {
            vbDurationHours = vbTime.substr(1, vbTime.length - 2);
            vbDurationMinutes = this.utils.Right(vbTime, 2);
            if (vbDurationMinutes > 59) {
                let translatedMsg1, translatedMsg2;

                let msg1 = this.getTranslatedValue('Minutes Entered Cannot Be Greater Than 59');
                let msg2 = this.getTranslatedValue('Warning');

                let errMessage;
                errMessage['errorMessage'] = msg1 + '!' + msg2;
                this.messageModal.show(errMessage, true);

                vbError = true;
            } else {
                vbTimeSec = (vbDurationHours * 60 * 60) + (vbDurationMinutes * 60);
            }
        }

        switch (vbTimeField) {
            case 'EstimatedDuration':
                if (!vbError) {
                    this.setControlValue('EstimatedDuration', vbTimeFormat);
                }
                else {
                    this.setControlValue('EstimatedDuration', '');
                }
                break;
            case 'VisitDurationDefault':
                if (!vbError) {
                    this.setControlValue('VisitDurationDefault', vbTimeFormat);
                }
                else {
                    this.setControlValue('VisitDurationDefault', '');
                }
                break;
        }
    }

    /**
     * Checks if it is a Telesales
     */
    private getIsTelesales(): void {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '0');

        searchParams.set('Function', 'IsTelesales');
        searchParams.set('PlanVisitROWID', this.getControlValue('PlanVisitRowID'));

        let isTelesales;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.messageModal.show(data, true);
                    return;
                }
                if (data.IsTelesales) {
                    isTelesales = true;
                } else {
                    isTelesales = false;
                }

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

        return isTelesales;
    }

    /**
     * HardSlot is Checked/Unchecked
     */
    public hardSlotInd_OnClick(): void {
        if (this.getControlValue('HardSlotInd') === true) {
            this.showHardSlottype = true;
        } else {
            this.showHardSlottype = false;
        }
    }

    /**
     * Cancels PlanVisit
     */
    public cancelReinstatePlanVisit_OnClick(): void {
        if (this.getControlValue('PlanVisitStatusCode') === 'U' ||
            this.getControlValue('PlanVisitStatusCode') === 'I' ||
            this.getControlValue('PlanVisitStatusCode') === 'P') {
            if (this.getControlValue('CancelReinstatePlanVisit') === true) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'SelReason');
            } else {
                this.riExchange.riInputElement.Disable(this.uiForm, 'SelReason');
                this.setControlValue('SelReason', 'None');
            }
        }
    }

    /**
     * On Confirmation Type Changes
     */
    public selConfirmationType_OnChange(): void {
        if (this.getControlValue('SelConfirmationType') !== '') {
            this.setControlValue('AppointmentConfirmed', true);
            this.setControlValue('PlannedVisitDate', this.getControlValue('OriginalVisitDueDate'));
        } else {
            this.setControlValue('AppointmentConfirmed', false);
            this.setControlValue('PlannedVisitDate', '');
        }
        this.appointmentConfirmed_OnClick();
    }

    public appointmentConfirmed_OnClick(): void {
        let appointmentConfirmed: any = this.getControlValue('AppointmentConfirmed');

        if (appointmentConfirmed) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'AppointmentConfirmedReason');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingVisitStartTime', true);
            this.setControlValue('PlannedVisitDate', this.getControlValue('OriginalVisitDueDate'));
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'AppointmentConfirmedReason');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingVisitStartTime', false);
            this.setControlValue('AppointmentConfirmedReason', '');
            this.setControlValue('PlannedVisitDate', '');
            this.setControlValue('SelConfirmationType', '');
        }
    }

    public excludeFromRouting_OnClick(): void {
        if (this.getControlValue('ExcludeFromRouting') === true) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'RoutingExclusionReason');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingExclusionReason', true);
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'RoutingExclusionReason');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingExclusionReason', false);
            this.setControlValue('RoutingExclusionReason', '');
        }
    }

    /**
     * Show/Hide Tab
     * @param tabindex
     */
    public renderTab(tabindex: number): void {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = false;
                break;
            case 3:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = true;
                this.uiDisplay.tab.tab4.active = false;
                break;
            case 4:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                this.uiDisplay.tab.tab4.active = true;
                break;
        }
    }

    /**
     * Prompts model for Save
     */
    public beforeSave(): void {
        let vbMessageResult;
        if (this.getControlValue('CancelReinstatePlanVisit') === true) {
            if (this.getIsTelesales()) {
                this.promptTitle = 'Warning';
                let errorMsg = this.getControlValue('ErrorMessage');
                this.promptModal.show();
                return;
            }
        }
        this.setControlValue('VisitStatusReasonCode', this.getControlValue('SelReason'));
        this.setControlValue('PlannerStatus', this.getControlValue('SelPlannerStatus'));
        this.setControlValue('ConfirmationType', this.getControlValue('SelConfirmationType'));

        let formValid = true;
        for (let control in this.uiForm.controls) {
            if (control) {
                this.riExchange.riInputElement.isError(this.uiForm, control);
            }
        }
        if (this.uiForm.invalid) return;

        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.promptModal.show();

        this.utils.disableCBB(true);
    }

    /**
     * Checks for Update
     */
    private beforeUpdate(): void {
        let appointmentConfirmed: any = this.getControlValue('AppointmentConfirmed');

        if (!appointmentConfirmed) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'AppointmentConfirmedReason');
        } else {
            this.riExchange.riInputElement.Enable(this.uiForm, 'AppointmentConfirmedReason');
        }

        //Disable Original Visit
        if (this.getControlValue('RequiresManualVisitPlanningInd') === 'true') {
            this.showRealignPlanVisits = false;
            this.riExchange.riInputElement.Disable(this.uiForm, 'OriginalVisitDueDate');
            this.originalVisitDueDate_onDeactivate();
            if (!this.showCancelReinstate) {
                this.setFocusCancelReinstatePlanVisit.emit(true);
            }
        } else {
            this.setFocusOriginalVisitDueDate.emit(true);
        }

        this.riExchange.riInputElement.Enable(this.uiForm, 'SelConfirmationType');
        if (this.parentMode === 'Cancel') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'OriginalVisitDueDate');
            this.originalVisitDueDate_onDeactivate();
            this.riExchange.riInputElement.Disable(this.uiForm, 'RealignPlanVisits');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AppointmentConfirmed');
            this.setControlValue('CancelReinstatePlanVisit', true);

            this.cancelReinstatePlanVisit_OnClick();
        }
    }

    /**
     * Saves Record
     */
    private saveRecord(): void {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '2');

        let checkBoxList = ['AppointmentConfirmed', 'VisitDurationExists', 'DisplayLevelInd', 'CancelReinstatePlanVisit',
            'ProdReplacement', 'ExcludeFromRouting', 'HardSlotInd', 'CICustRefReq', 'RealignPlanVisits'];
        let saveControls = [
            'RealignPlanVisits', 'CancelReinstatePlanVisit', 'ActualVisitTypeCode', 'OriginalValue', 'PlanVisitUserCode', 'RemovalQuantity', 'PlanVisitSeqNo', 'SpecialInstructions', 'BranchServiceAreaCodeSC', 'EmployeeCode', 'CICustomerRef',
            'LinkedCICustomerRef', 'PlanVisitRowID', 'ContractNumber', 'PremiseNumber', 'ProductCode', 'BusinessCode', 'BranchNumber', 'BranchServiceAreaCode', 'VisitTypeCode', 'PlannedVisitDate', 'ActualVisitDate', 'ActualQuantity',
            'PlanQuantity', 'PlanRemQuantity', 'PlanVisitStatusCode', 'AppointmentConfirmedReason', 'VisitStatusReasonCode', 'DisplayLevelInd', 'ProdReplacement', 'VisitDurationExists', 'OriginalVisitDueDate', 'AppointmentConfirmed', 'HardSlotInd',
            'OriginalVisitDuration', 'PlannedVisitDuration', 'ActualVisitDuration', 'VisitDurationDefault', 'ServiceVisitText', 'ServicePlanNumber', 'ProcessedDateTime', 'VisitNarrativeCode', 'VisitNarrativeDesc', 'ServiceCoverNumber', 'ServiceCoverItemNumber',
            'ItemDescription', 'PremiseLocationNumber', 'PremiseLocationDesc', 'ProductComponentRemoved', 'ProductComponentRemDesc', 'ProductComponentCode', 'ProductComponentDesc', 'InvoiceUnitValue', 'AdditionalChargeValue', 'ClientReference', 'EstimatedDuration',
            'RoutingVisitStartTime', 'VisitNotes', 'ExcludeFromRouting', 'RoutingExclusionReason', 'PlannerStatus', 'ConfirmationType', 'StaticVisitDate', 'TelesalesOrderNumber', 'TelesalesOrderLineNumber', 'CISLAStartDate', 'CISLAStartTime'];

        let bodyParams: any = {};
        for (let i = 0; i < saveControls.length; i++) {
            if (checkBoxList.indexOf(saveControls[i]) > -1) {
                bodyParams[saveControls[i]] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue(saveControls[i]));
            } else if (saveControls[i] === 'PlanVisitRowID') {
                bodyParams['PlanVisitROWID'] = this.getControlValue('PlanVisitRowID');
            } else if (saveControls[i] === 'OriginalValue' || saveControls[i] === 'AdditionalChargeValue' || saveControls[i] === 'InvoiceUnitValue') {
                bodyParams[saveControls[i]] = this.getControlValue(saveControls[i]);
            } else if (saveControls[i] === 'RoutingVisitStartTime' || saveControls[i] === 'CISLAStartTime') {
                bodyParams[saveControls[i]] = this.utils.hmsToSeconds(this.getControlValue(saveControls[i]));
            } else {
                bodyParams[saveControls[i]] = this.getControlValue(saveControls[i]);
            }
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.messageModal.show(data, true);
                    return;
                }
                this.routeAwayGlobals.setSaveEnabledFlag(false);
                this.location.back();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public timeValidation(event: any, field: any): any {
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, false);
        let formatedTime: any;
        if (event) formatedTime = this.formatTime(event, field);
    }

    public formatTime(time: any, field: any): void {
        if (time.indexOf(':') === -1) {
            let result: any = '';
            let re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            let firstDta = parseInt(time[0] + time[1], 10);
            let secondDta = parseInt(time[2] + time[3], 10);
            if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && time.length === 4) {
                result = time[0] + time[1] + ':' + time[2] + time[3];
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, false);
                this.setControlValue(field, result);
            }
            else {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, true);
                this.setControlValue(field, time);
            }
        } else {
            let firstDta = time.split(':')[0];
            let secondDta = time.split(':')[1];
            if (!((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) || time.length !== 5) {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, true);
                this.setControlValue(field, time);
            }
        }
    }

    /**
     * Propmpts to save record
     * @param e
     */
    public promptSave(e: any): void {
        this.formPristine();
        this.saveRecord();
    }

    public onAbandonClick(): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.location.back();
    }

    public cmdTelesalesOrder_onclick(): void {
        //this.router.navigate(['/application/iCABSATeleSalesOrderGrid.htm'], { queryParams: { parent: 'PlanVisit' } });
    }

    public cmdTelesalesOrderLine_onclick(): void {
        this.navigate('PlanVisit', InternalGridSearchApplicationModuleRoutes.ICABSATELESALESORDERLINEGRID);
        //this.router.navigate(['/application/iCABSATeleSalesOrderLineGrid.htm'], { queryParams: { parent: 'PlanVisit' } });
    }

    public onAppReasonChange(): void {
        this.setControlValue('AppointmentConfirmedReason', this.getControlValue('AppointmentConfirmedReason').toUpperCase());
    }
}
