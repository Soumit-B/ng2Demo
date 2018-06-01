import { Component, OnInit, AfterViewInit, OnDestroy, Input, ViewChild, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import { UiControls } from './uiControls';
import { ObjEllipsis } from './objEllipsis';
import { ObjLookUps } from './objLookUps';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { InternalGridSearchSalesModuleRoutes, ContractManagementModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../../base/PageRoutes';
import { QueryParametersCallback } from './../../../base/Callback';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { HttpService } from './../../../../shared/services/http-service';
import { Utils } from './../../../../shared/services/utility';
import { MntConst, RiTab } from './../../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';

@Component({
    selector: 'icabs-service-visit-maintenance',
    templateUrl: 'iCABSSeServiceVisitMaintenance.html'
})
export class ServiceVisitMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, QueryParametersCallback {
    //Dropdowns
    @ViewChild('visitTypeSearch') public visitTypeSearch; //VisitTypeSearchComponent

    //Ellipsis
    @ViewChild('PlanVisitNumber') PlanVisitNumber: EllipsisComponent;
    @ViewChild('PlanVisitNumber2') PlanVisitNumber2: EllipsisComponent;
    @ViewChild('EmployeeCode') EmployeeCode: EllipsisComponent;
    @ViewChild('AdditionalEmployee') AdditionalEmployee: EllipsisComponent;
    @ViewChild('ProductComponentCode') ProductComponentCode: EllipsisComponent;

    public ellipsis: any = {};
    public lookUpRefs: any = {};

    public isInit: boolean = false;
    public queryParams: any;
    public pageMode: string = '';
    public riGridHandle: any = '';
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public promptContentDel: string = MessageConstant.Message.DeleteRecord;
    public modalConfig: any = { backdrop: 'static', keyboard: true };

    public labelStartDate: string = '';
    public labelStartTime: string = '';

    public uiDisplay: any = {
        menu: true,
        objTR: false, //??
        PremiseContactName: false, //??
        PremiseContactPrintedName: false, //??
        PremiseContactSignature: false, //??
        tdContactName: false, //??
        tdReviewDisplays: false,
        tdVisitReference: false,
        tdVisitReference2: false,
        trAdditionalChargeValue: false,
        trCustVisitReference: false,
        trDeliveryNoteNumber: false,
        trDeliveryQuantity: false,
        trInfestation: false,
        trInvoiceUnitValue: false,
        trManualVisitReason: false,
        trOrderQuantity: false,
        trPremiseLocationNumber: false,
        trPrepUsed: false,
        trProductComponentCode: false,
        trProductComponentRemoved: false,
        trReasonDesc: false,
        trReasonNumber: false,
        trRemovalQuantity: false,
        trServiceCoverItemNumber: false,
        trServicedQuantity: false,
        trServiceEnd: false,
        trServiceStart: false,
        trSignature: false,
        trUnDeliveredQuantity: false,
        trWasteCollected: false,
        trWasteConsignmentNoteNumber: false,
        trWEDSQty: false,
        trWorkLoadIndex: false
    };
    public dropDown: any = {
        menu: [],
        VisitTypeCode: {
            isRequired: true,
            triggerValidate: false,
            active: { id: '', text: '' },
            arrData: [], //TODO - already implemeted in dropdown, remove from base compoenent
            inputParams: {
                parentMode: 'LookUp'
            }
        } /*, //TODO-Integrate Dropdown components
        VisitNarrativeCode: { //iCABSBVisitNarrativeSearch
            isRequired: true,
            active: { id: '', text: ''},
            arrData: [],
            inputParams: {}
        },
        ReasonNumber: { //iCABSBNoSignatureReasonSearch
            isRequired: true,
            active: { id: '', text: ''},
            arrData: [],
            inputParams: {}
        },
        ManualVisitReasonCode: { //iCABSBManualVisitReasonSearch
            isRequired: true,
            active: { id: '', text: ''},
            arrData: [],
            inputParams: {}
        },
        NoServiceReasonCode: { //'LookUp-Product': iCABSBNoServiceReasonSearch.htm'
            isRequired: true,
            active: { id: '', text: ''},
            arrData: [],
            inputParams: {}
        }*/
    };

    public xhr: HttpService;
    public xhrParams: any = {
        module: 'service',
        method: 'service-delivery/maintenance',
        operation: 'Service/iCABSSeServiceVisitMaintenance'
    };

    public pageId: string = '';
    public controls: Array<any>;
    // public controlsMap: Object = {};

    public riTab: RiTab;
    public tab: any = {
        tab1: { id: 'grdMain', name: 'Main', visible: true, active: true },
        tab2: { id: 'grdAdditional', name: 'Additional', visible: true, active: false },
        tab3: { id: 'grdSiteRiskAssessment', name: 'Site Risk Assessment', visible: false, active: false } //Out of Scope
    };

    public lookUpObj: any = {};

    public subUserAccess: Subscription;
    public subLoggedInBranch: Subscription;

    ngOnInit(): void {
        super.ngOnInit();
        this.genCtrlMap();
    }

    ngAfterViewInit(): void {
        this.isInit = true;
        this.isRequesting = true;
        this.init();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.subUserAccess) this.subUserAccess.unsubscribe();
        if (this.subLoggedInBranch) this.subLoggedInBranch.unsubscribe();
    }

    constructor(injector: Injector) {
        super(injector);

        this.controls = new UiControls().controls;
        this.ellipsis = new ObjEllipsis().ellipsis;
        this.lookUpRefs = new ObjLookUps().LookUpRefs;

        this.pageId = PageIdentifier.ICABSSESERVICEVISITMAINTENANCE;
        this.setURLQueryParameters(this);
    }

    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return super.canDeactivate();
    }

    public getURLQueryParameters(param: any): void {
        this.queryParams = param;
        this.isRequesting = true;
        if (this.isInit) { this.init(); }
    }

    public init(): void {
        this.browserTitle = this.pageTitle = 'Service Visit Maintenance';

        this.riTab = new RiTab(this.tab, this.utils);
        this.tab = this.riTab.tabObject;
        this.riTab.TabAdd('Main');
        this.riTab.TabAdd('Additional');

        this.pageParams.vBusinessCode = this.utils.getBusinessCode();
        this.pageParams.vCountryCode = this.utils.getCountryCode();
        this.parentMode = this.riExchange.getParentMode();
        this.riGridHandle = this.utils.gridHandle;

        //Init Dropdowns
        this.visitTypeSearch.triggerDataFetch(this.dropDown.VisitTypeCode.inputParams);
        //TODO - Integrate other dropdown compoents

        this.getSysCharDtetails();
    }

    //SpeedScript
    public getSysCharDtetails(): any {
        this.pageParams.vSCEnableVisitRef = false;
        this.pageParams.vSCEnableSharedTeamVisits = false;
        this.pageParams.vSCEnableVisitDetail = false;
        this.pageParams.vSCEnableCustomerVisitRef = false;
        this.pageParams.vSCShowConsNote = false;
        this.pageParams.vSCShowWED = false;
        this.pageParams.vSCEnableServiceCoverDispLev = false;
        this.pageParams.vSCEnableServiceTime = false;
        this.pageParams.vSCEnableManualVisitReasonCode = false;
        this.pageParams.vLoop = 0;
        this.pageParams.vDeletionWarning = MessageConstant.PageSpecificMessage.msg2668;

        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableEntryOfVisitRefInVisitEntry, //Required
            this.sysCharConstants.SystemCharEnableSharedTeamVisits, //Required
            this.sysCharConstants.SystemCharEnableVisitDetail, //Required
            this.sysCharConstants.SystemCharEnableEntryOfCustomerRefInVisitEntry, //Required
            this.sysCharConstants.SystemCharShowWasteConsNumInVisitEntry, //Required
            this.sysCharConstants.SystemCharEnableWED, //Required
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel, //Required
            this.sysCharConstants.SystemCharEnableServiceStartAndEndTime, //Required
            this.sysCharConstants.SystemCharEnableManualVisitReasonCode //Required
        ];

        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };

        //Out of Scope
        // this.pageParams.glEnableGlobalSiteRiskAssessment = false;
        // this.LookUp.i_GetBusinessRegistryValue(this.utils.getBusinessCode(), 'Advantage', 'EnableGlobalSiteRiskAssessment').then((data: any): void => {
        //     this.pageParams.glEnableGlobalSiteRiskAssessment = data;
        //     this.riTab.TabAdd('Site Risk Assessment');
        //     console.log('GetBusinessRegistryValue', data);
        // });

        this.speedScript.sysCharPromise(sysCharIP).then((data) => {
            let records = data.records;
            this.pageParams.vSCEnableVisitRef = records[0].Required;
            this.pageParams.vSCEnableSharedTeamVisits = records[1].Required;
            this.pageParams.vSCEnableVisitDetail = records[2].Required;
            this.pageParams.vSCEnableCustomerVisitRef = records[3].Required;
            this.pageParams.vSCShowConsNote = records[4].Required;
            this.pageParams.vSCShowWED = records[5].Required;
            this.pageParams.vSCEnableServiceCoverDispLev = records[6].Required;
            this.pageParams.vSCEnableServiceTime = records[7].Required;
            this.pageParams.vSCEnableManualVisitReasonCode = records[8].Required;
            this.onLoad();
        });
    }

    public onLoad(): any {
        this.isRequesting = false;
        this.pageParams.ServiceDateStartChanged = false;
        this.riExchange.setCurrentContractType();
        this.fnBuildMenuAddOption();

        if (this.pageParams.vSCEnableVisitRef) {
            this.uiDisplay.tdVisitReference = true;
            this.uiDisplay.tdVisitReference2 = true;
        }

        if (this.pageParams.vSCEnableCustomerVisitRef) {
            this.uiDisplay.trCustVisitReference = true;
        }

        if (this.pageParams.vSCEnableServiceTime) {
            this.uiDisplay.trServiceStart = true;
        } else {
            this.uiDisplay.trServiceStart = false;
        }

        let labelStartText: string = 'Start';

        if (this.parentMode === 'ProductSalesDelivery') {
            this.uiDisplay.trOrderQuantity = true;
            this.uiDisplay.trDeliveryQuantity = true;
            this.uiDisplay.trUnDeliveredQuantity = true;
            this.uiDisplay.trServiceEnd = false;

            Observable.forkJoin(
                this.utils.getTranslatedval('Delivery'),
                this.utils.getTranslatedval('Visit Maintenance'),
                this.utils.getTranslatedval('Date'),
                this.utils.getTranslatedval(' Start Time'),
                this.utils.getTranslatedval('Service')
            ).subscribe((e) => {
                this.browserTitle = this.pageTitle = e[0] + ' ' + e[1];
                this.utils.setTitle(this.pageTitle);
                this.labelStartDate = e[0] + ' ' + e[2];
                this.labelStartTime = e[4] + e[3];
            });
        } else {
            this.uiDisplay.trServicedQuantity = true;
            Observable.forkJoin(
                this.utils.getTranslatedval('Service'),
                this.utils.getTranslatedval('Visit Maintenance'),
                this.utils.getTranslatedval('Date'),
                this.utils.getTranslatedval(' Start Time')
            ).subscribe((e) => {
                this.browserTitle = this.pageTitle = e[0] + ' ' + e[1];
                this.utils.setTitle(this.pageTitle);
                this.labelStartDate = e[0] + ' ' + e[2];
                this.labelStartTime = e[0] + e[3];
            });
        }

        if (this.parentMode !== 'ProductSalesDelivery') {
            // this.setRequiredStatus('ServicedQuantity', true);
            // this.setRequiredStatus('ServiceDateEnd', true);
        }

        if (this.pageParams.vSCEnableServiceTime) {
            // this.setRequiredStatus('ServiceTimeEnd', true);
        }

        if (this.pageParams.vSCShowWED) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'WEDSQty');
        }

        if (this.pageParams.vSCEnableVisitRef) {
            this.setRequiredStatus('VisitReference', true);
        } else {
            this.setRequiredStatus('VisitReference', false);
        }

        if (this.pageParams.vSCEnableManualVisitReasonCode && (this.parentMode === 'SearchAdd' || this.parentMode === 'ServiceVisitEntryGrid')) {
            this.setRequiredStatus('ManualVisitReasonCode', true);
        } else {
            this.setRequiredStatus('ManualVisitReasonCode', false);
        }

        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));

        this.setControlValue('ServiceVisitRowID', this.riExchange.getParentHTMLValue('ServiceVisitRowID'));
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));

        //TODO - Verify below 3 lines
        this.pageParams.vWasteConsignmentNoteNumber = this.riExchange.getParentHTMLValue('WasteConsignmentNoteNumber');
        if (!this.pageParams.vWasteConsignmentNoteNumber) this.pageParams.vWasteConsignmentNoteNumber = '';
        this.setControlValue('WasteConsignmentNoteNumber', '');

        if (this.parentMode === 'ProductSalesDelivery') {
            this.setRequiredStatus('DeliveryQuantity', true);
            this.riExchange.riInputElement.Disable(this.uiForm, 'UndeliveredQuantity');
        }
        if (this.parentMode === 'ProductSalesDelivery' || this.pageParams.vProdReplacement) { // this.pageParams.vProdReplacement??
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceQuantity');
        }

        switch (this.parentMode) {
            case 'GroupServiceVisit':
            case 'ConfirmedPlan':
            case 'DespatchGrid':
                if (!this.getControlValue('ServiceVisitRowID')) {
                    this.pageMode = MntConst.eModeAdd;
                } else {
                    this.pageMode = MntConst.eModeUpdate;
                }
                break;
            case 'SearchAdd':
            case 'ProductSalesDelivery':
            case 'CreditMissedService':
            case 'ServiceVisitEntryGrid':
            case 'CallOut':
                this.pageMode = MntConst.eModeAdd;
                break;
            case 'ContactHistory':
                this.pageMode = MntConst.eModeUpdate;
                break;
            default:
                this.pageMode = MntConst.eModeUpdate;
        }

        if (this.pageMode !== MntConst.eModeAdd) {
            //Service Call
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '0');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            search.set('ContractNumber', this.getControlValue('ContractNumber'));
            search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            search.set('ProductCode', this.getControlValue('ProductCode'));
            search.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
            search.set('ServiceVisitRowID', this.getControlValue('ServiceVisitRowID'));

            this.httpService.xhrGet(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    console.log('Debug >>>', data);
                    for (let i in data) {
                        if (data.hasOwnProperty(i)) {
                            this.setControlValue(i, data[i]);
                        }
                    }

                    //TODO - Connector Issue Remove Later
                    this.setControlValue('PremiseContactSignatureURL', 'http://10.117.192.160:9090/wsscripts/wspd_cgi.sh/WService=iCABS_WS/iCABSPDASignatureImage.p?usercode=cit.cogda&PremiseVisitRowID=0x0000000003d3a0a1&Signature=Signature');

                    this.updateCustomDropdowns();
                    if (data.hasOwnProperty('ServiceVisit')) { this.setControlValue('ServiceVisitRowID', data.ServiceVisit); }
                    this.doLookup();
                    this.riMntAfterFetch();
                }
            });
        } else {
            this.doLookup();
        }

        if (this.parentMode === 'ProductSalesDelivery') {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            formData['Function'] = 'GetProductSaleDetails';
            formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    console.log('TODO SUCCESS A', data);
                    this.setControlValue('VisitTypeCode', data['VisitTypeCode']);
                    this.setControlValue('VisitTypeDesc', data['VisitTypeDesc']);
                    this.setControlValue('ServiceDateStart', data['ServiceDateStart']);
                    this.setControlValue('ServiceTimeStart', data['ServiceTimeStart']);
                }
            });
        }

        this.riTab.TabsToNormal();

        this.fnSetVariables();

        //RiMaintenance Mode execution
        setTimeout(() => {
            this.riMntBeforeMode();
            if (this.pageMode === MntConst.eModeUpdate) {
                //Update or Delete
                this.riMntBeforeUpdate();
                this.riExchangeCBORequest();
            } else {
                //Add
                this.riMntBeforeAddMode();
            }
        }, 1000);
    }

    public doLookup(): any {
        switch (this.parentMode) {
            case 'Search':
            case 'SearchAdd':
            case 'CreditMissedService':
            case 'ProductSalesDelivery':
            case 'ServiceVisitHistory':
            case 'GroupServiceVisit':
            case 'ConfirmedPlan':
            case 'Summary':
            case 'Release':
            case 'ServiceStatsAdjust':
            case 'ServiceVisitEntryGrid':
            case 'ServiceCoverDisplay':
            case 'DespatchGrid':
            case 'CallOut':
            default:
                let lookupIP: Array<any> = [];
                this.lookUpRefs.Contract.query.BusinessCode = this.utils.getBusinessCode();
                this.lookUpRefs.Contract.query.ContractNumber = this.getControlValue('ContractNumber');
                lookupIP.push(this.lookUpRefs.Contract);

                this.lookUpRefs.Premise.query.BusinessCode = this.utils.getBusinessCode();
                this.lookUpRefs.Premise.query.ContractNumber = this.getControlValue('ContractNumber');
                this.lookUpRefs.Premise.query.PremiseNumber = this.getControlValue('PremiseNumber');
                lookupIP.push(this.lookUpRefs.Premise);

                this.lookUpRefs.Product.query.BusinessCode = this.utils.getBusinessCode();
                this.lookUpRefs.Product.query.ProductCode = this.getControlValue('ProductCode');
                lookupIP.push(this.lookUpRefs.Product);

                this.LookUp.lookUpPromise(lookupIP).then((data) => {
                    if (data) {
                        this.utils.setLookupValue(this, this.lookUpRefs.Contract.fields, data[0]);
                        this.utils.setLookupValue(this, this.lookUpRefs.Premise.fields, data[1]);
                        this.utils.setLookupValue(this, this.lookUpRefs.Product.fields, data[2]);
                    }
                });
        }

        let lookupIP1: Array<any> = [];
        this.lookUpRefs.VisitType.query.BusinessCode = this.utils.getBusinessCode();
        this.lookUpRefs.VisitType.query.VisitTypeCode = this.getControlValue('VisitTypeCode');
        lookupIP1.push(this.lookUpRefs.VisitType);

        this.lookUpRefs.VisitNarrative.query.BusinessCode = this.utils.getBusinessCode();
        this.lookUpRefs.VisitNarrative.query.VisitNarrativeCode = this.getControlValue('VisitNarrativeCode');
        lookupIP1.push(this.lookUpRefs.VisitNarrative);

        this.lookUpRefs.Employee.query.BusinessCode = this.utils.getBusinessCode();
        this.lookUpRefs.Employee.query.EmployeeCode = this.getControlValue('EmployeeCode');
        lookupIP1.push(this.lookUpRefs.Employee);

        this.lookUpRefs.ManualVisitReason.query.BusinessCode = this.utils.getBusinessCode();
        this.lookUpRefs.ManualVisitReason.query.ManualVisitReasonCode = this.getControlValue('ManualVisitReasonCode');
        lookupIP1.push(this.lookUpRefs.ManualVisitReason);

        this.LookUp.lookUpPromise(lookupIP1).then((data) => {
            if (data) {
                this.utils.setLookupValue(this, this.lookUpRefs.VisitType.fields, data[0]);
                this.utils.setLookupValue(this, this.lookUpRefs.VisitNarrative.fields, data[1]);
                this.utils.setLookupValue(this, this.lookUpRefs.Employee.fields, data[2]);
                this.utils.setLookupValue(this, this.lookUpRefs.ManualVisitReason.fields, data[3]);
            }
        });

        let lookupIP2: Array<any> = [];
        this.lookUpRefs.NoSignatureReason.query.BusinessCode = this.utils.getBusinessCode();
        this.lookUpRefs.NoSignatureReason.query.ReasonNumber = this.getControlValue('ReasonNumber');
        lookupIP2.push(this.lookUpRefs.NoSignatureReason);

        this.lookUpRefs.NoServiceReason.query.BusinessCode = this.utils.getBusinessCode();
        this.lookUpRefs.NoServiceReason.query.NoServiceReasonCode = this.getControlValue('NoServiceReasonCode');
        lookupIP2.push(this.lookUpRefs.NoServiceReason);

        this.LookUp.lookUpPromise(lookupIP2).then((data) => {
            if (data) {
                this.utils.setLookupValue(this, this.lookUpRefs.NoSignatureReason.fields, data[0]);
                this.utils.setLookupValue(this, this.lookUpRefs.NoServiceReason.fields, data[1]);
            }

            this.updateEllipsisParams();
        });

        //TODO - Lookup for AddEmployee1,2,3... - Not Required?
    }

    public fnSetVariables(): any {
        // Check to see if Quantites/Shared Ind/Preps/Infestations are required for this Business/Product;
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};
        formData['Function'] = 'GetVariables';
        formData['VisitTypeCode'] = this.getControlValue('VisitTypeCode');
        formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        formData['ServiceVisitRowID'] = this.getControlValue('ServiceVisitRowID');
        this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                console.log('TODO SUCCESS D', data);
                this.pageParams.vReqQuantity = (data['ReqQuantity'] === 'yes') ? true : false;
                this.pageParams.vReqPreps = (data['ReqPreps'] === 'yes') ? true : false;
                this.pageParams.vReqInfestations = (data['ReqInfestations'] === 'yes') ? true : false;
                this.pageParams.vReqDeliveryNoteNumber = (data['ReqDeliveryNoteNumber'] === 'yes') ? true : false;
                this.pageParams.vWasteCollected = (data['WasteCollected'] === 'yes') ? true : false;
                this.pageParams.vVisitTypeNarrative = (data['VisitTypeNarrative'] === 'yes') ? true : false;
                this.pageParams.vReqWorkLoadIndex = (data['ReqWorkLoadIndex'] === 'yes') ? true : false;
                this.pageParams.vProdReplacement = (data['ProdReplacement'] === 'yes') ? true : false;
                this.pageParams.vRoutineVisit = (data['RoutineVisit'] === 'yes') ? true : false;
                this.pageParams.vReviewDisplays = (data['ReviewDisplays'] === 'yes') ? true : false;
                this.setControlValue('ServiceCoverRowID', data['ServiceCoverRowID']);

                if (this.pageParams.vReqQuantity || this.pageParams.vProdReplacement) {
                    this.uiDisplay.trServicedQuantity = true;
                    if (this.pageParams.vSCEnableServiceCoverDispLev && this.pageParams.vReviewDisplays) {
                        this.uiDisplay.tdReviewDisplays = true;
                    } else {
                        this.uiDisplay.tdReviewDisplays = false;
                    }
                } else {
                    this.uiDisplay.trServicedQuantity = false;
                    this.uiDisplay.tdReviewDisplays = false;
                }

                if (this.pageParams.vWasteCollected) {
                    this.uiDisplay.trWasteCollected = true;
                } else {
                    this.uiDisplay.trWasteCollected = false;
                }

                if (this.pageParams.vReqPreps && this.getControlValue('PrepUsedInd', true)) {
                    this.uiDisplay.trPrepUsed = true;
                    this.fnBuildMenuAddOption();
                } else if (this.pageParams.vReqPreps) {
                    this.uiDisplay.trPrepUsed = true;
                } else {
                    this.uiDisplay.trPrepUsed = false;
                }

                if (this.pageParams.vReqInfestations && this.getControlValue('InfestationInd', true)) {
                    this.uiDisplay.trInfestation = true;
                    this.fnBuildMenuAddOption();
                } else if (this.pageParams.vReqInfestations) {
                    this.uiDisplay.trInfestation = true;
                } else {
                    this.uiDisplay.trInfestation = false;
                }

                if (this.pageParams.vReqDeliveryNoteNumber) {
                    this.uiDisplay.trDeliveryNoteNumber = true;
                } else {
                    this.uiDisplay.trDeliveryNoteNumber = false;
                }

                if (this.pageParams.vVisitTypeNarrative) {
                    this.setRequiredStatus('VisitNarrativeCode', true); //TODO??
                } else {
                    this.setRequiredStatus('VisitNarrativeCode', false); //TODO??
                }

                if (this.pageParams.vReqWorkLoadIndex) {
                    this.uiDisplay.trWorkLoadIndex = true;
                } else {
                    this.uiDisplay.trWorkLoadIndex = false;
                }

                if (this.pageParams.vProdReplacement) {
                    this.uiDisplay.trServiceCoverItemNumber = true;
                    this.uiDisplay.trPremiseLocationNumber = true;
                    this.uiDisplay.trProductComponentCode = true;
                    this.uiDisplay.trProductComponentRemoved = true;
                    this.uiDisplay.trRemovalQuantity = true;
                    this.uiDisplay.trInvoiceUnitValue = true;
                    this.uiDisplay.trAdditionalChargeValue = true;
                } else {
                    this.uiDisplay.trServiceCoverItemNumber = false;
                    this.uiDisplay.trPremiseLocationNumber = false;
                    this.uiDisplay.trProductComponentCode = false;
                    this.uiDisplay.trProductComponentRemoved = false;
                    this.uiDisplay.trRemovalQuantity = false;
                    this.uiDisplay.trInvoiceUnitValue = false;
                    this.uiDisplay.trAdditionalChargeValue = false;
                }

                if (this.pageParams.vSCShowWED && this.pageParams.vRoutineVisit) {
                    this.uiDisplay.trWEDSQty = true;
                } else {
                    this.uiDisplay.trWEDSQty = false;
                }

                ///default to zero;
                this.setControlValue('AdditionalEmployees', 0);
                if (this.pageParams.vProdReplacement) {
                    ///Get List of dummy product codes  &&  Single Qty Components;
                    this.ajaxSource.next(this.ajaxconstant.START);
                    search = new URLSearchParams();
                    search.set(this.serviceConstants.Action, '6');
                    search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                    search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

                    let formData: any = {};
                    formData['Function'] = 'DummyProductCodeList';
                    formData['ProductCode'] = this.getControlValue('ProductCode');
                    this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        console.log('SUCCESS >>> E', data);
                        this.pageParams.vbDummyProductCodes = data['DummyProductCodes'].split('|');

                        if (this.getControlValue('ProductComponentCode')) {
                            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
                            //TODO
                            // for each vbProductCode in this.pageParams.vbDummyProductCodes {
                            //     if(UCase(ProductComponentCode.value) === UCase(vbProductCode)) {
                            //         this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
                            //         Exit For;
                            //     }
                            // }
                        } else {
                            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
                            this.setControlValue('ProductComponentDesc', '');
                        }
                    });
                }
            }
        });
    }

    public fnCheckServiceVisitValid(): void {
        if (this.getControlValue('VisitTypeCode') !== '' && this.getControlValue('ServiceDateStart') !== '') {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            formData['Function'] = 'CheckServiceVisitsValid';
            formData['VisitTypeCode'] = this.getControlValue('VisitTypeCode');
            formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
            formData['PlanVisitNumber'] = this.getControlValue('PlanVisitNumber');
            formData['ServiceDateStart'] = this.getControlValue('ServiceDateStart');
            formData['ProductComponentCode'] = this.getControlValue('ProductComponentCode');
            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    console.log('TODO SUCCESS F', data);
                }
            });
        }
    }

    public fnValidateVisitDate(): any {
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};
        formData['Function'] = 'ValidateVisitDate';
        formData['VisitTypeCode'] = this.getControlValue('VisitTypeCode');
        formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        formData['ServiceDateStart'] = this.getControlValue('ServiceDateStart');
        this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                console.log('TODO SUCCESS G', data);
            }
        });
    }

    public fnGetDefaultVisitReference(callBkFn?: any): any {
        if (this.pageParams.ServiceDateStartChanged && this.getControlValue('ServiceDateStart') !== '') {
            this.fnValidateVisitDate();
            this.fnCheckServiceVisitValid();
            if (this.pageParams.vSCEnableVisitRef && this.getControlValue('ServiceDateStart') !== '') {
                this.ajaxSource.next(this.ajaxconstant.START);
                let search: URLSearchParams = new URLSearchParams();
                search.set(this.serviceConstants.Action, '6');
                search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

                let formData: any = {};
                formData['Function'] = 'GetDefaultVisitReference';
                formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
                formData['ServiceDateStart'] = this.getControlValue('ServiceDateStart');
                formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
                this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        console.log('TODO SUCCESS H', data);
                        this.riExchange.riInputElement.Enable(this.uiForm, 'VisitReference');
                        if (data['VisitReference'] !== '') {
                            this.setControlValue('VisitReference', data['VisitReference']);
                            this.riExchange.riInputElement.Disable(this.uiForm, 'VisitReference');
                        }

                        if (callBkFn && typeof callBkFn === 'function') {
                            console.log('Debug 33 A');
                            callBkFn.call(this);
                        }
                    }
                });
            } else {
                if (callBkFn && typeof callBkFn === 'function') {
                    console.log('Debug 33 B');
                    callBkFn.call(this);
                }
            }
        } else {
            if (callBkFn && typeof callBkFn === 'function') {
                console.log('Debug 33 C');
                callBkFn.call(this);
            }
        }
    }

    public fnCheckComponentExchange(callBkFn?: any): any {
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};
        formData['Function'] = 'CheckComponentExchange';
        formData['VisitTypeCode'] = this.getControlValue('VisitTypeCode');
        this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            console.log('TODO SUCCESS I', data);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            }

            if (callBkFn && typeof callBkFn === 'function') {
                console.log('Debug 44 A');
                callBkFn.call(this);
            }
        });
    }

    public fnCheckExistingServiceVisit(): any {
        if (this.pageParams.vSCEnableServiceTime) {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            formData['Function'] = 'CheckExistingServiceVisit';
            formData['VisitTypeCode'] = this.getControlValue('VisitTypeCode');
            formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
            formData['ServiceDateStart'] = this.getControlValue('ServiceDateStart');
            formData['ServiceTimeStart'] = this.getControlValue('ServiceTimeStart');
            formData['ServiceTimeEnd'] = this.getControlValue('ServiceTimeEnd');
            if (this.pageMode === MntConst.eModeUpdate) {
                formData['ServiceVisitRowID'] = this.getControlValue('ServiceVisitRowID'); //TODO - verify
            }

            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                console.log('TODO SUCCESS J', data);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.MessageDesc));
                }
            });
        }
    }

    public fnCheckWasteConsignmentNumberRequired(): any {
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};
        formData['Function'] = 'CheckWasteConsignmentNumberRequired';
        formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        formData['VisitTypeCode'] = this.getControlValue('VisitTypeCode');
        this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            console.log('TODO SUCCESS K', data);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.setControlValue('WasteConsNoteIsMandatory', (data['WasteConsignmentNumberRequired'] === 'yes') ? true : false);
                this.fnSetEdittableFields();
            }
        });
    }

    public fnFindRelatedPlanVisit(): any {
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};
        formData['Function'] = 'FindRelatedPlanVisit';
        formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        if (this.pageMode === MntConst.eModeUpdate) {
            formData['ServiceVisitRowID'] = this.getControlValue('ServiceVisitRowID');
        }
        if (this.parentMode === 'SearchAdd' && this.pageParams.vWasteConsignmentNoteNumber !== '') {
            formData['WasteConsignmentNoteNumber'] = this.pageParams.vWasteConsignmentNoteNumber;
        }
        if (this.getControlValue('WasteConsignmentNoteNumber') !== '' && this.pageParams.vWasteConsignmentNoteNumber === '') {
            formData['WasteConsignmentNoteNumber'] = this.getControlValue('WasteConsignmentNoteNumber');
        }
        formData['VisitTypeCode'] = this.getControlValue('VisitTypeCode');
        this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            console.log('TODO SUCCESS L', data);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                for (let i in data) {
                    if (data.hasOwnProperty(i)) {
                        this.setControlValue(i, data[i]);
                    }
                }
            }
        });
    }

    public fnBuildMenuAddOption(): void {
        let menuOptions: any = [];
        menuOptions.push({ value: 'PlanVisits', label: 'Planned Visits' });
        if (this.pageParams.vSCEnableVisitDetail) {
            menuOptions.push({ value: 'VisitDetail', label: 'Visit Details' });
        }

        if (this.getControlValue('PrepUsedInd', true) && this.pageMode !== MntConst.eModeAdd) {
            menuOptions.push({ value: 'PrepUsed', label: 'Preps Used' });
        }
        if (this.getControlValue('InfestationInd', true) && this.pageMode !== MntConst.eModeAdd) {
            menuOptions.push({ value: 'Infestation', label: 'Infestations' });
        }

        //Issue with ForkJoin on these particular functions and hence applying alternate solution
        this.subUserAccess = this.utils.getUserAccessType().subscribe(data => {
            if (data === 'Full') {
                menuOptions.push({ value: 'ProRataCharges', label: 'Pro Rata Charges' });
            } else {
                this.subLoggedInBranch = this.utils.getLoggedInBranch().subscribe(data => {
                    if (data && data.results[0]) {
                        let branchNumber: number = data.results[0][0]['BranchNumber'];
                        if (this.getControlValue('ServiceBranchNumber') === branchNumber || this.getControlValue('NegBranchNumber') === branchNumber) {
                            menuOptions.push({ value: 'ProRataCharges', label: 'Pro Rata Charges' });
                        }
                    }
                });
            }
        });

        this.dropDown.menu = menuOptions;
        this.setControlValue('menu', 'Options');
    }

    public fnCheckServiceVisitQty(): any {
        console.log('Debug - fnCheckServiceVisitQty');

        if (this.pageParams.vSCEnableServiceCoverDispLev && this.pageParams.vReviewDisplays) {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let vServiceVisitMode: string = '';
            if (this.pageMode === MntConst.eModeAdd) {
                vServiceVisitMode = 'AddServiceVisit';
            } else if (this.pageMode === MntConst.eModeUpdate) {
                vServiceVisitMode = 'UpdateServiceVisit';
            }

            let formData: any = {};
            formData['Function'] = 'CheckServiceVisitQty';
            formData['ServiceVisitQty'] = this.getControlValue('ServicedQuantity');
            formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
            formData['VisitTypeCode'] = this.getControlValue('VisitTypeCode');
            formData['riGridHandle'] = this.riGridHandle;
            formData['ServiceVisitMode'] = vServiceVisitMode;
            if (this.getControlValue('ServiceVisitRowID') !== '') {
                formData['ServiceVisitRowID'] = this.getControlValue('ServiceVisitRowID');
            }
            // check the service visit qty matches the number of displays assigned to the visit
            return this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                console.log('TODO SUCCESS M', data);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    //TODO
                    // this.ServicedQuantity.focus();
                    this.modalAdvService.emitPrompt(new ICabsModalVO(this.promptContent, null, this.riMntAfterSave.bind(this), null));
                }
            });
        } else {
            // this.modalAdvService.emitPrompt( new ICabsModalVO( this.promptContent, null, this.confirmed.bind(this), this.promptCancel.bind(this)));
            this.modalAdvService.emitPrompt(new ICabsModalVO(this.promptContent, null, this.riMntAfterSave.bind(this), null));
        }
    }

    public fnSetDisableServiceQty(): any {
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};
        formData['Function'] = 'SetDisableServiceQty';
        formData['ProductCode'] = this.getControlValue('ProductCode');

        return this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            console.log('TODO SUCCESS N', data);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                if (data['ProductDisplayLevel'] === 'yes') {
                    this.riExchange.riInputElement.Disable(this.uiForm, 'ServicedQuantity');
                }
            }
        });
    }

    public arrAdditionalEmployees: Array<any> = [];
    public generateAdditionAlEmpObj(): void {
        let len = this.getControlValue('AdditionalEmployees');
        if (len > 10) {
            len = 10;
            this.setControlValue('AdditionalEmployees', 10);
        }
        if (len < 0) {
            len = 0;
            this.setControlValue('AdditionalEmployees', 0);
        }
        this.arrAdditionalEmployees = [];
        for (let i = 0; i < 10; i++) {
            this.setRequiredStatus('AddEmployeeCode' + (i + 1), false);
        }
        if (len > 0) {
            this.setControlValue('SharedInd', true);
        }
        for (let i = 0; i < len; i++) {
            this.arrAdditionalEmployees.push({ code: 'AddEmployeeCode' + (i + 1), desc: 'AddEmployeeSurname' + (i + 1), index: (i + 1) });
            this.setRequiredStatus('AddEmployeeCode' + (i + 1), true);
        }
    }

    //No reference found
    public fnChangeStandardDuration(): any {
        let iStartTime: number = 0;
        let iEndTime: number = 0;;
        let iDuration: number = 0;
        if (!this.riExchange.riInputElement.isError(this.uiForm, 'ServiceTimeStart') && !this.riExchange.riInputElement.isError(this.uiForm, 'ServiceTimeEnd')) {
            iStartTime = this.getControlValue('ServiceTimeStart'); //fnConvertTimeToMinutes(ServiceTimeStart.value);
            iEndTime = this.getControlValue('ServiceTimeEnd'); //fnConvertTimeToMinutes(ServiceTimeEnd.value);
            if (iStartTime !== 0 && iEndTime !== 0) {
                iDuration = iEndTime - iStartTime;
                this.setControlValue('StandardDuration', iDuration); //FormatDateTime(fnConvertMinutesToTime(iDuration), vbShortTime);
                // this.riExchange.riInputElement.isErrorEx('StandardDuration', false, false);
            }
        }
    }

    public fnCheckServiceVisitProRataCharge(): any {
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};
        formData['Function'] = 'CheckServiceVisitProRataCharge';
        formData['ServiceVisitRowID'] = this.getControlValue('ServiceVisit');

        return this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            console.log('TODO SUCCESS O', data);

            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                if (data.DisplayMessage) {
                    this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.PageSpecificMessage.msgVisitMnt, null, this.fnDeleteRecord.bind(this), null));
                } else {
                    this.fnDeleteRecord();
                }
            }
        }).catch((error): any => {
            console.log('Error', error);
            //Do nothing
        });
    }

    public fnDeleteRecord(): any {
        console.log('Debug - fnDeleteRecord');
        if (this.pageMode === MntConst.eModeDelete) {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '3');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            formData['Table'] = 'ServiceVisit';
            formData['ROWID'] = this.getControlValue('ServiceVisitRowID');

            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                console.log('TODO SUCCESS Delete save', data);

                //TODO - Mark form as pristine

                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    // this.location.back(); //TODO - verify
                }
            });
        }
    }

    public onloadPremiseContactSignature(): any {
        if (this.getControlValue('PremiseContactSignature') !== '') {
            // PremiseContactSignature = true;
            this.uiDisplay.trSignature = true;
        }
    }

    public riMntBeforeDelete(): any {
        console.log('Debug - riMntBeforeDelete', this.getControlValue('SharedInd', true));
        if (this.getControlValue('SharedInd', true)) {
            setTimeout(() => {
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.msgSharedVisit));
            }, 500);
        }
        this.fnCheckComponentExchange(this.fnCheckServiceVisitProRataCharge);
    }

    public riMntBeforeSaveAdd(): any {
        console.log('Debug - riMntBeforeSaveAdd');
        this.fnGetDefaultVisitReference(this.riMntBeforeConfirm);
    }

    public riExchangeCBORequest(): any {
        console.log('Debug -- riExchangeCBORequest');
        if (this.pageParams.vVisitTypeNarrative) {
            this.setRequiredStatus('VisitNarrativeCode', true);
        } else {
            this.setRequiredStatus('VisitNarrativeCode', false);
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'VisitTypeCode') && this.getControlValue('VisitTypeCode') !== '') {
            this.fnFindRelatedPlanVisit();
            this.fnSetVariables();
            let iAdditionalEmployees: number = 0;
            //TODO - Not Required - Implementation changed
            // if (this.getControlValue('AdditionalEmployees') !== '' && this.IsNumeric(this.getControlValue('AdditionalEmployees'))) {
            //     iAdditionalEmployees = this.CInt(this.getControlValue('AdditionalEmployees'));
            // }
            // if (iAdditionalEmployees > 0) {
            //     for (let i = 0; i < iAdditionalEmployees; i++) {
            //         //TODO
            //         // set objCellCode = document.getElementById('AddEmployeeCode' + i);
            //         // set objCellDesc = document.getElementById('AddEmployeeSurname' + i);
            //         // objCellDesc.Value = '';
            //         // objCellCode.Value = '';
            //     }
            // }
            this.fnCheckServiceVisitValid();
            this.fnCheckWasteConsignmentNumberRequired();
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'PlanVisitNumber') && this.getControlValue('PlanVisitNumber') !== '') {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            formData['Function'] = 'GetDetailsFromPlanVisit';
            formData['Mode'] = this.parentMode;
            formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
            formData['PlanVisitNumber'] = this.getControlValue('PlanVisitNumber');
            formData['VisitTypeCode'] = this.getControlValue('VisitTypeCode');
            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                console.log('SUCCESS >>> P', data);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
            });
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'WasteConsignmentNoteNumber')) {
            this.fnFindRelatedPlanVisit();
        }
    }

    public riMntBeforeUpdate(): any {
        this.setControlValue('ServiceVisitDetail', this.pageParams.vSCEnableVisitDetail);
        if (this.getControlValue('ProductComponentCode') !== '') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            //TODO
            // for each vbProductCode in this.pageParams.vbDummyProductCodes {
            //     if(UCase(ProductComponentCode.value) === UCase(vbProductCode)) {
            //         this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
            //         Exit For;
            //     }
            // }
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            this.setControlValue('ProductComponentDesc', '');
        }
        this.fnSetEdittableFields();
        if (this.pageParams.vSCEnableServiceCoverDispLev) {
            this.fnSetDisableServiceQty();
        }
    }

    public riMntBeforeAddMode(): any {
        this.setControlValue('ServiceTimeStart', 0);
        this.setControlValue('ServiceTimeEnd', 0);
        this.setControlValue('StandardDuration', 60);
        this.setControlValue('OvertimeDuration', 0);

        /// If adding, no ServiceVisitDetail will be present;
        this.setControlValue('ServiceVisitDetail', false);

        /// If adding, Service End Date will always be blank,  &&  so hide.;
        this.uiDisplay.trServiceEnd = false;

        ///hide the Review Displays button until a visit type code has been entered;
        this.uiDisplay.tdReviewDisplays = false;

        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};

        switch (this.parentMode) {
            case 'ProductSalesDelivery':
                this.setControlValue('VisitTypeCode', this.getControlValue('VisitTypeCode'));
                this.setControlValue('VisitTypeDesc', this.getControlValue('VisitTypeDesc'));
                this.setControlValue('ServiceDateStart', this.getControlValue('ServiceDateStart'));
                this.setControlValue('ServiceTimeStart', this.getControlValue('ServiceTimeStart'));
                //TODO EmployeeCode.focus();
                break;
            case 'CreditMissedService':
                formData['Function'] = 'GetCreditMissedServiceDefaults';
                formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
                formData['ProRataChargeRowID'] = this.getControlValue('ProRataChargeRowID');
                break;
            case 'GroupServiceVisit':
            case 'DespatchGrid':
            case 'ConfirmedPlan':
                formData['Function'] = 'GetPlanVisitDefaultsNoDates';
                formData['PlanVisitRowID'] = this.getControlValue('PlanVisitRowID');
                break;
            case 'ServiceVisitEntryGrid':
                formData['Function'] = 'GetServiceCoverDetails';
                formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
                break;
        }
        if (!this.getControlValue('ServiceBranchNumber')) {
            formData['Function'] = 'GetServiceCoverDetails';
            formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        }

        this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.fnSetEdittableFields();
            }
        });
    }

    public riMntBeforeConfirm(): any {
        console.log('Debug - riMntBeforeConfirm', this.pageParams.vSCEnableServiceCoverDispLev, this.pageParams.vReviewDisplays);
        this.fnCheckServiceVisitQty();
    }

    public riMntBeforeSave(callBkFn?: any): any {
        console.log('Debug - riMntBeforeSave');
        this.fnCheckExistingServiceVisit();
        this.ajaxSource.next(this.ajaxconstant.START);
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '6');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        let formData: any = {};
        formData['Mode'] = this.parentMode;

        formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        if (this.pageMode === MntConst.eModeUpdate) {
            formData['ServiceVisitRowID'] = this.getControlValue('ServiceVisitRowID');
        }
        if (this.parentMode === 'ProductSalesDelivery') {
            formData['DeliveryQuantity'] = this.getControlValue('DeliveryQuantity');
        }

        this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            console.log('TODO SUCCESS Q', data);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                // this.modalAdvService.emitMessage(new ICabsModalVO(data.MessageDesc));
                if (callBkFn && typeof callBkFn === 'function') {
                    console.log('Debug 2');
                    callBkFn.call(this);
                }
            }
        });
    }

    public riMntBeforeMode(): any {
        if (this.pageMode === MntConst.eModeDelete) {
            if (this.getControlValue('ServiceVisitDetail', true)) {
                console.log('Debug - riMntBeforeMode', this.pageMode, this.getControlValue('ServiceVisitDetail', true), this.pageParams.vDeletionWarning);
                setTimeout(() => {
                    let tempModal: ICabsModalVO = new ICabsModalVO(this.pageParams.vDeletionWarning);
                    tempModal.closeCallback = this.riMntBeforeDelete.bind(this);
                    this.modalAdvService.emitMessage(tempModal);
                }, 500);
            } else {
                this.riMntBeforeDelete();
            }
        }
    }

    public riMntAfterSave(callBkFn?: any): any {
        console.log('Debug - riMntAfterSave');
        //UPDATE
        if (this.pageMode === MntConst.eModeUpdate) {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '2');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            let len = this.controls.length;
            for (let i = 0; i < len; i++) {
                let ctrlName: string = this.controls[i].name;
                let ctrlValue: any = this.getControlValue(this.controls[i].name, true);
                if (this.controls[i].type === MntConst.eTypeCheckBox) {
                    ctrlValue = this.utils.convertCheckboxValueToRequestValue(ctrlValue);
                }
                formData[ctrlName] = ctrlValue;
            }
            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                console.log('TODO SUCCESS Update save', data);

                //TODO - Mark form as pristine

                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    for (let i in data) {
                        if (i) {
                            console.log('TODO SUCCESS Save Successful', i, data[i]);
                            this.setControlValue(i, data[i]);
                        }
                    }

                    if (this.pageParams.vSCEnableVisitRef) {
                        if (this.getControlValue('VisitReferenceWarning') !== '') {
                            this.modalAdvService.emitMessage(new ICabsModalVO(this.getControlValue('VisitReferenceWarning')));
                        }
                    }
                    if (this.parentMode === 'GroupServiceVisit' || this.parentMode === 'ConfirmedPlan' || this.parentMode === 'DespatchGrid') {
                        // this.location.back(); //TODO - verify
                    }
                    this.riGridHandle = '';
                }
            });
        }
        //ADD
        if (this.pageMode === MntConst.eModeAdd) {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '1');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            let len = this.controls.length;
            for (let i = 0; i < len; i++) {
                let ctrlName: string = this.controls[i].name;
                let ctrlValue: any = this.getControlValue(this.controls[i].name, true);
                if (this.controls[i].type === MntConst.eTypeCheckBox) {
                    ctrlValue = this.utils.convertCheckboxValueToRequestValue(ctrlValue);
                }
                formData[ctrlName] = ctrlValue;
            }
            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                console.log('TODO SUCCESS Add save', data);

                //TODO - Mark form as pristine

                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    for (let i in data) {
                        if (i) {
                            console.log('TODO SUCCESS Save Successful', i, data[i]);
                            this.setControlValue(i, data[i]);
                        }
                    }

                    this.riMntAfterSaveAdd(data);
                }
            });
        }
    }

    public riMntAfterSaveAdd(data: any): any {
        if (this.getControlValue('InfestationInd', true)) {
            let parentMode: string = '';
            if (this.getControlValue('PrepUsedInd', true)) {
                parentMode = 'ServiceVisitPrep';
            } else {
                parentMode = 'ServiceVisit';
            }

            if (data && data.hasOwnProperty('ServiceVisit')) {
                this.setControlValue('ServiceVisitRowID', data.ServiceVisit);
            }

            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            formData['Function'] = 'UpdateSLAVisitCycle';
            formData['ServiceVisitRowID'] = this.getControlValue('ServiceVisitRowID');

            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.navigate(parentMode, InternalMaintenanceServiceModuleRoutes.ICABSSEINFESTATIONMAINTENANCE, {
                        currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam()
                    });
                }
            });
        }
        if (this.getControlValue('PrepUsedInd', true) && !this.getControlValue('InfestationInd', true)) {
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
            // this.navigate('ServiceVisit', 'Service/iCABSSePrepUsedMaintenance.htm',{
            //     CurrentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam()
            // });
        }
    }

    public riMntAfterFetch(): any {
        this.fnCheckWasteConsignmentNumberRequired();
        if (this.getControlValue('ServiceVisitDetail', true)) {
            this.uiDisplay.trServiceEnd = true;
        } else {
            this.uiDisplay.trServiceEnd = false;
        }
        if (this.getControlValue('GotSignature', true)) {
            this.uiDisplay.trSignature = true;
            this.uiDisplay.PremiseContactSignature = false;
            this.uiDisplay.trReasonNumber = false;
            this.uiDisplay.trReasonDesc = false;
            if (this.getControlValue('PremiseContactSignatureURL') !== '') {
                this.setControlValue('PremiseContactSignature', this.getControlValue('PremiseContactSignatureURL'));
                // PremiseContactSignature.src = PremiseContactSignatureURL.value;
            } else {
                // PremiseContactSignature.src = '';
                this.setControlValue('PremiseContactSignature', '');
            }
            this.uiDisplay.tdContactName = true;
            if (this.getControlValue('NameCapturedInd', true)) {
                this.uiDisplay.PremiseContactPrintedName = true;
                if (this.getControlValue('PremiseContactPrintedNameURL') !== '') {
                    this.setControlValue('PremiseContactSignature', this.getControlValue('PremiseContactSignatureURL'));
                    // PremiseContactPrintedName.src = PremiseContactPrintedNameURL.value;
                } else {
                    // PremiseContactPrintedName.src = '';
                    this.setControlValue('PremiseContactSignature', '');
                }
            } else {
                this.uiDisplay.PremiseContactName = true;
            }
        } else {
            this.uiDisplay.trSignature = false;
            if (this.getControlValue('ReasonNumber') !== '') {
                this.uiDisplay.trReasonNumber = true;
                this.uiDisplay.trReasonDesc = false;
            } else {
                this.uiDisplay.trReasonNumber = false;
                this.uiDisplay.trReasonDesc = true;
            }
        }

        //TODO - verify
        this.onloadPremiseContactSignature();
    }

    //OnChange functionalities - Start
    public ProductComponentCode_onChange(): any {
        if (this.getControlValue('ProductComponentCode') !== '') {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            formData['Function'] = 'GetProductValues';
            formData['ProductComponentCode'] = this.getControlValue('ProductComponentCode');
            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                console.log('TODO SUCCESS S', data);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('AlternateProductCode', data['AlternateProductCode']);
                    this.setControlValue('ProductComponentDesc', data['ProductComponentDesc']);
                    this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
                    // for each vbProductCode in this.pageParams.vbDummyProductCodes
                    //     if (UCase(ProductComponentCode.value) === UCase(vbProductCode)) {
                    //         this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
                    //         Exit For;
                    //     }
                    // Next
                }
            });
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
            this.setControlValue('AlternateProductCode', '');
            this.setControlValue('ProductComponentDesc', '');
        }
    }

    public AlternateProductCode_onChange(): any {
        if (this.getControlValue('AlternateProductCode') !== '') {
            this.ajaxSource.next(this.ajaxconstant.START);
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '6');
            search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            let formData: any = {};
            formData['Function'] = 'GetAlternateProductValues';
            formData['AlternateProductCode'] = this.getControlValue('AlternateProductCode');
            this.httpService.xhrPost(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, formData).then((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                console.log('TODO SUCCESS T', data);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ProductComponentCode', data['ProductComponentCode']);
                    this.setControlValue('ProductComponentDesc', data['ProductComponentDesc']);
                    this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
                    // for each vbProductCode in this.pageParams.vbDummyProductCodes
                    //     if (UCase(ProductComponentCode.value) === UCase(vbProductCode)) {
                    //         this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
                    //         Exit For;
                    //     }
                    // Next
                }
            });
        }
    }

    public onChangeServiceDateStart(event: any): void {
        this.pageParams.ServiceDateStartChanged = true;
        console.log('Datepicker - onChangeServiceDateStart', event);
    }
    public onChangeServiceDateEnd(event: any): void {
        console.log('Datepicker - onChangeServiceDateEnd', event);
    }

    public onChangeMenu(): any {
        switch (this.getControlValue('menu')) {
            case 'ServiceStatsAdjust':
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                // this.navigate('ServiceVisit', 'Service/iCABSSeServiceStatsAdjustmentSearch.htm', {
                //     CurrentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam()
                // });
                break;
            case 'PrepUsed':
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                // this.navigate('ServiceVisit', 'Service/iCABSSePrepUsedSearch.htm');
                break;
            case 'Infestation':
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                // this.navigate('ServiceVisit', 'Service/iCABSSeInfestationSearch.htm');
                break;
            case 'PlanVisits':
                this.navigate('ServiceVisitMaintenance', InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR, {
                    CurrentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam(),
                    ServiceCoverRowID: this.getControlValue('ServiceCoverRowID'),
                    ContractNumber: this.getControlValue('ContractNumber'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    ProductCode: this.getControlValue('ProductCode')
                });
                break;
            case 'ProRataCharges':
                this.navigate('ServiceVisitMaint', InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY, {
                    CurrentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam()
                });
                break;
            case 'VisitDetail':
                this.navigate('ServiceVisit', ContractManagementModuleRoutes.ICABSASERVICEVISITDETAILSUMMARY);
                break;
        }
        this.setControlValue('menu', 0);
    }
    //OnChange functionalities - End

    //Click functionalities - Start
    public trPrepUsed_onclick(): any {
        if (this.pageMode === MntConst.eModeUpdate) {
            this.fnBuildMenuAddOption();
        }
    }

    public trInfestation_onclick(): any {
        if (this.pageMode === MntConst.eModeUpdate) {
            this.fnBuildMenuAddOption();
        }
    }

    public onClickReviewDisplays(): any {
        let parentMode: string = '';
        if (this.pageMode === MntConst.eModeAdd || this.pageMode === MntConst.eModeUpdate) {
            parentMode = 'ServiceVisitUpdate';
        } else {
            parentMode = 'ServiceVisitView';
        }

        this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
        // this.navigate(parentMode, 'Application/iCABSAServiceVisitDisplayGrid.htm',{
        //     CurrentContractTypeURLParameter: this.riExchange.getCurrentContractTypeUrlParam(),
        //     ServiceVisitRowID: this.getControlValue('ServiceVisitRowID')
        // });
    }
    //Click functionalities - End

    //KeyDown functions - Out of scope
    public ProductComponentCode_onkeydown(): any {
        // SelProductCode.value = ProductComponentCode.value;
        // if (window.event.keyCode === 34) {
        //     WindowPath = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBProductSearch.htm';
        //     riExchange.Mode = 'ComponentReplacement': window.location = WindowPath;
        //     this.riExchange.ProcessDoEvents();
        //     while (riExchange.Busy) {
        //         this.riExchange.ProcessDoEvents();
        //         Loop
        //     }
        //     if (SelProductCode.value !== ProductComponentCode.value) {
        //         ProductComponentCode.value = SelProductCode.value;
        //         ProductComponentDesc.value = SelProductDesc.value;
        //         AlternateProductCode.value = SelProductAlternateCode.value;
        //         if (ProductComponentCode.value !== '') {
        //             this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
        //             For each vbProductCode in this.pageParams.vbDummyProductCodes
        //             if (UCase(ProductComponentCode.value) === UCase(vbProductCode)) {
        //                 this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
        //                 this.riExchange.riInputElement.focus('ProductComponentDesc');
        //                 Exit For;
        //             }
        //             Next
        //         } else {
        //             this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
        //             ProductComponentDesc.value = '';
        //         }
        //     }
        // }
    }

    public AlternateProductCode_onkeydown(): any {
        // SelProductCode.value = ProductComponentCode.value;
        // SelProductAlternateCode.value = AlternateProductCode.value;
        // SelProductDesc.value = ProductComponentDesc.value;
        // if (window.event.keycode === 34) {
        //     WindowPath = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBProductSearch.htm';
        //     riExchange.Mode = 'AlternateComponentReplacement': window.location = WindowPath;
        //     this.riExchange.ProcessDoEvents();
        //     while (riExchange.Busy) {
        //         this.riExchange.ProcessDoEvents();
        //         Loop
        //     }
        //     if (SelProductAlternateCode.value !== AlternateProductCode.value || SelProductCode.value !== ProductComponentCode.value   ) {
        //         AlternateProductCode.value = SelProductAlternateCode.value;
        //         ProductComponentCode.value = SelProductCode.value;
        //         ProductComponentDesc.value = SelProductDesc.value;
        //         if (ProductComponentCode.value !== '') {
        //             this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
        //             For each vbProductCode in this.pageParams.vbDummyProductCodes
        //             if (UCase(ProductComponentCode.value) === UCase(vbProductCode)) {
        //                 this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentDesc');
        //                 this.riExchange.riInputElement.focus('ProductComponentDesc');
        //                 Exit For;
        //             }
        //             Next
        //         } else {
        //             this.riExchange.riInputElement.Disable(this.uiForm, 'ProductComponentDesc');
        //             ProductComponentDesc.value = '';
        //         }
        //     }
        // }
    }
    //KeyDown - End

    public updateEllipsisParams(): void {
        this.ellipsis.PlanVisitNumber.childparams.parentMode = (this.parentMode === 'CreditMissedService') ? 'LookUp-CreditMissedService' : 'LookUp';
        this.ellipsis.PlanVisitNumber.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.PlanVisitNumber.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.PlanVisitNumber.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.PlanVisitNumber.childparams.PremiseName = this.getControlValue('PremiseName');
        this.ellipsis.PlanVisitNumber.childparams.ProductCode = this.getControlValue('ProductCode');
        this.ellipsis.PlanVisitNumber.childparams.ProductDesc = this.getControlValue('ProductDesc');
        this.ellipsis.PlanVisitNumber.childparams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        // this.ellipsis.PlanVisitNumber.childparams.LastServiceVisitAnnivDate = this.getControlValue('LastServiceVisitAnnivDate');
        // this.ellipsis.PlanVisitNumber.childparams.EarliestVisitDueDate = this.getControlValue('EarliestVisitDueDate');

        this.ellipsis.PlanVisitNumber2.childparams.parentMode = 'LookUp';
        this.ellipsis.PlanVisitNumber2.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.PlanVisitNumber2.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.PlanVisitNumber2.childparams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.PlanVisitNumber2.childparams.PremiseName = this.getControlValue('PremiseName');
        this.ellipsis.PlanVisitNumber2.childparams.ProductCode = this.getControlValue('ProductCode');
        this.ellipsis.PlanVisitNumber2.childparams.ProductDesc = this.getControlValue('ProductDesc');
        this.ellipsis.PlanVisitNumber2.childparams.ServiceCoverRowID = this.getControlValue('ServiceCoverRowID');
        // this.ellipsis.PlanVisitNumber2.childparams.LastServiceVisitAnnivDate = this.getControlValue('LastServiceVisitAnnivDate');
        // this.ellipsis.PlanVisitNumber2.childparams.EarliestVisitDueDate = this.getControlValue('EarliestVisitDueDate');

    }

    public ellipsisRespHandler(data: any, ellipsisID: string): any {
        console.log('Debug >>', ellipsisID, data);
        switch (ellipsisID) {
            case 'PlanVisitNumber':
            case 'PlanVisitNumber2':
                for (let i in data) {
                    if (data.hasOwnProperty(i)) {
                        this.setControlValue(i, data[i]);
                        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, i);
                    }
                }
                this.riExchangeCBORequest();
                break;
            case 'EmployeeCode':
                this.setControlValue('EmployeeCode', data.EmployeeCode);
                this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                break;
            case 'ProductComponentCode':
                break;
            default:
                let ctrlId: string = ellipsisID;
                if (ctrlId.indexOf('AddEmployeeCode') === 0) {
                    this.setControlValue(ctrlId, data.AddEmployeeCode);
                    this.setControlValue(ctrlId.replace('Code', 'Surname'), data.AddEmployeeSurname);
                }
                break;
        }
    }

    public fnSetEdittableFields(): any {
        this.setRequiredStatus('WasteConsignmentNoteNumber', false);
        if (this.pageParams.vSCShowConsNote) {
            if (this.getControlValue('WasteConsNoteIsMandatory', true)) {
                this.uiDisplay.trWasteConsignmentNoteNumber = true;
                this.setRequiredStatus('WasteConsignmentNoteNumber', true);
                if (this.parentMode === 'SearchAdd') {
                    this.setControlValue('WasteConsignmentNoteNumber', this.riExchange.getParentHTMLValue('WasteConsignmentNoteNumber'));
                    if (this.getControlValue('WasteConsignmentNoteNumber') !== '') {
                        this.riExchange.riInputElement.Disable(this.uiForm, 'WasteConsignmentNoteNumber');
                    }
                }
            }
            else {
                this.uiDisplay.trWasteConsignmentNoteNumber = false;
            }
        }

        if (this.pageParams.vSCEnableManualVisitReasonCode &&
            (this.parentMode === 'SearchAdd' || this.parentMode === 'ServiceVisitEntryGrid' || this.getControlValue('ManualVisitInd', true))) {
            this.setRequiredStatus('ManualVisitReasonCode', true);
            this.uiDisplay.trManualVisitReason = true;
        } else {
            this.setRequiredStatus('ManualVisitReasonCode', false);
            this.uiDisplay.trManualVisitReason = false;
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactReason');
        /// Based on the Visit Detail checkbox value, set the properties of various fields;

        let flag: boolean = this.getControlValue('ServiceVisitDetail', true);
        if (flag) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServicedQuantity');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceDateStart');
            this.riExchange.riInputElement.Disable(this.uiForm, 'StandardDuration');
            this.riExchange.riInputElement.Disable(this.uiForm, 'OvertimeDuration');
            this.riExchange.riInputElement.Disable(this.uiForm, 'AdditionalEmployees');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceQuantity');
            this.riExchange.riInputElement.Disable(this.uiForm, 'UndeliveredQuantity');
            this.riExchange.riInputElement.Disable(this.uiForm, 'DeliveryQuantity');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceDateEnd');
            this.riExchange.riInputElement.Disable(this.uiForm, 'WorkLoadIndexTotal');
            this.riExchange.riInputElement.Disable(this.uiForm, 'ReasonNumber');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactName');
            let len = this.getControlValue('AdditionalEmployees');
            for (let i = 0; i < len; i++) {
                this.riExchange.riInputElement.Disable(this.uiForm, 'AddEmployeeCode' + (i + 1));
            }
            this.setRequiredStatus('EmployeeCode', false);
            this.setRequiredStatus('ServiceDateStart', false);
            this.setRequiredStatus('StandardDuration', false);
            this.setRequiredStatus('OvertimeDuration', false);
        } else {
            this.riExchange.riInputElement.Enable(this.uiForm, 'EmployeeCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceQuantity');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ProductComponentCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AlternateProductCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceDateStart');
            this.riExchange.riInputElement.Enable(this.uiForm, 'StandardDuration');
            this.riExchange.riInputElement.Enable(this.uiForm, 'OvertimeDuration');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AdditionalEmployees');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceQuantity');
            this.riExchange.riInputElement.Enable(this.uiForm, 'UndeliveredQuantity');
            this.riExchange.riInputElement.Enable(this.uiForm, 'DeliveryQuantity');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceTimeStart');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceDateEnd');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceTimeEnd');
            this.riExchange.riInputElement.Enable(this.uiForm, 'WorkLoadIndexTotal');
            let len = this.getControlValue('AdditionalEmployees');
            for (let i = 0; i < len; i++) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'AddEmployeeCode' + (i + 1));
            }
            this.setRequiredStatus('EmployeeCode', true);
            this.setRequiredStatus('ServiceDateStart', true);
            this.setRequiredStatus('StandardDuration', true);
            this.setRequiredStatus('OvertimeDuration', true);
        }
    }


    public ServiceTimeStart_onChange(): any {
        this.fnChangeStandardDuration();
    }
    public ServiceTimeEnd_onChange(): any {
        this.fnChangeStandardDuration();
    }
    public fnConvertTimeToMinutes(iTime: number): any {
        // let iHours;
        // let iMinutes;
        // iHours = hour(iTime);
        // iMinutes = minute(iTime);
        // /// Now do the math;
        // fnConvertTimeToMinutes = (iHours * 60) + iMinutes;
    }
    public fnConvertMinutesToTime(iTime: number): any {
        // let iHours;
        // let iMinutes;
        // iHours = Int(iTime / 60);
        // iMinutes = iTime - (iHours * 60);
        // fnConvertMinutesToTime = TimeSerial(iHours, iMinutes, 0);
    }

    //Dropdown Component Handling
    public updateCustomDropdowns(): void {
        let len = this.controls.length;
        for (let i = 0; i < len; i++) {
            if (this.controls[i].hasOwnProperty('isCutomDropdown')) {
                if (this.controls[i].isCutomDropdown && this.dropDown[this.controls[i].name]) {
                    this.utils.setCustomDropdownValue(this.dropDown[this.controls[i].name], this.getControlValue(this.controls[i].name));
                }
            }
        }
    }
    public visitTypeSelectedValue(event: any): any {
        this.setControlValue('VisitTypeCode', event.VisitTypeCode || event.value);
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'VisitTypeCode');
        this.dropDown.VisitTypeCode.triggerValidate = false;
        this.riExchangeCBORequest();
    }
    public visitTypeDataRecieved(event: any): any {
        let len = (event) ? event.length : 0;
        this.dropDown.VisitTypeCode.arrData = [];
        for (let i = 0; i < len; i++) {
            this.dropDown.VisitTypeCode.arrData.push({ code: event[i]['VisitType.VisitTypeCode'], desc: event[i]['VisitType.VisitTypeDesc'] });
        }
    }

    public focusSave(obj: any): void {
        this.riTab.focusNextTab(obj);
    }

    public save(): void {
        this.utils.highlightTabs();
        this.riExchange.validateForm(this.uiForm);

        for (let i in this.dropDown) {
            if (this.dropDown.hasOwnProperty(i)) {
                if (this.dropDown[i].hasOwnProperty('isRequired') && this.dropDown[i].isRequired) {
                    this.dropDown[i].triggerValidate = true;
                }
            }
        }

        console.log('Debug >>', this.uiForm);
        if (this.uiForm.status === 'VALID') {
            if (this.pageMode === 'eModeAdd') {
                this.add();
            } else {
                this.update();
            }
        } else {
            for (let control in this.uiForm.controls) {
                if (this.uiForm.controls[control].invalid) {
                    console.log('   >> Invalid:', control, this.uiForm.controls[control].errors, this.uiForm.controls[control]);
                }
            }
        }
    }
    public add(): void {
        console.log('Clicked: Add Mode');
        this.riMntBeforeSave(this.riMntBeforeSaveAdd);

    }
    public update(): void {
        console.log('Clicked: Update Mode');
        this.riMntBeforeSave(this.riMntBeforeConfirm);
    }
    public delete(): void {
        console.log('Clicked: Delete Mode');
        this.pageMode = MntConst.eModeDelete;
        this.modalAdvService.emitPrompt(new ICabsModalVO(this.promptContentDel, null, this.riMntBeforeMode.bind(this), this.cancel.bind(this)));
    }
    public cancel(): void {
        this.pageMode = MntConst.eModeUpdate;
        console.log('Clicked: Cancel');
    }
}

    /*
        // public cancel(): void {
        // 	this.routeAwayGlobals.setSaveEnabledFlag(false);
        // 	this.markAsPristine();
        // 	//Update Mode
        // 	if (this.pageMode === MntConst.eModeUpdate || this.pageMode === MntConst.eModeSaveUpdate) {
        // 		this.pageMode = MntConst.eModeUpdate; //On cancel -> Update mode
        // 		for (let i = 0; i < this.controls.length; i++) {
        // 			this.riExchange.updateCtrl(this.controls, this.controls[i].name, 'value', this.controls[i].value);
        // 			this.setControlValue(this.controls[i].name, this.controls[i].value);
        // 		}
        // 		this.updateButton();
        // 		this.onChangeFn(null, '', 'PrepCode');
        // 	}
        // 	//Add Mode
        // 	if (this.pageMode === MntConst.eModeAdd || this.pageMode === MntConst.eModeSaveAdd) {
        // 		this.clearAllFields('save, cancel, delete');
        // 		//TODO - Open ellipsis
        // 	}
        // }

        // public markAsPristine(): void {
        // 	for (let i = 0; i < this.controls.length; i++) {
        // 		this.uiForm.controls[this.controls[i].name].markAsPristine();
        // 	}
        // }

        // public fieldValidateTransform(event: any): void {
        // 	let retObj = this.utils.fieldValidateTransform(event);
        // 	this.setControlValue(retObj.id, retObj.value);
        // 	if (!retObj.status) {
        // 		this.riExchange.riInputElement.markAsError(this.uiForm, retObj.id);
        // 	}
        // }

        //Change Function
        // public onChangeFn(event: any, id?: string, fieldName?: string): void {
        // 	let target = (event) ? (event.target || event.srcElement || event.currentTarget) : null;
        // 	let idAttr = (target) ? target.attributes.id.nodeValue : (fieldName ? fieldName : '');
        // 	let value = (target) ? target.value : '';

        // 	switch (idAttr) {
        // 		case 'PrepCode':
        // 			this.riMaintenance.AddVirtualTable('Prep');
        // 			this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        // 			this.riMaintenance.AddVirtualTableKey('PrepCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        // 			this.riMaintenance.AddVirtualTableField('PrepDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        // 			this.riMaintenance.AddVirtualTableCommit(this);
        // 			break;
        // 	}
        // }

    */
