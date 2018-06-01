import { InternalGridSearchServiceModuleRoutes, InternalGridSearchApplicationModuleRoutes } from './../../base/PageRoutes';
import { Component, OnInit, OnDestroy, Injector, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { SpeedScript } from './../../../shared/services/speedscript';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { GridComponent } from './../../../shared/components/grid/grid';
import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { QueryParametersCallback } from '../../base/Callback';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

import { UiControls } from './uiControls';
import { PremiseMaintenance0 } from './iCABSAPremiseMaintenance0';
import { PremiseMaintenance1 } from './iCABSAPremiseMaintenance1';
import { PremiseMaintenance1a } from './iCABSAPremiseMaintenance1a';
import { PremiseMaintenance2 } from './iCABSAPremiseMaintenance2';
import { PremiseMaintenance3 } from './iCABSAPremiseMaintenance3';
import { PremiseMaintenance4 } from './iCABSAPremiseMaintenance4';
import { PremiseMaintenanceAddrRes } from './iCABSAPremiseMaintenanceAddrRes';
import { PremiseMaintenanceAddrRes1 } from './iCABSAPremiseMaintenanceAddrRes1';
import { PremiseMaintenanceAddrRes2 } from './iCABSAPremiseMaintenanceAddrRes2';
import { PremiseMaintenanceAddrRes3 } from './iCABSAPremiseMaintenanceAddrRes3';

@Component({
    templateUrl: 'iCABSAPremiseMaintenance.html'
})

export class PremiseMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit, QueryParametersCallback {
    public pageHeader: string;
    public pageId: string;
    public parent: PremiseMaintenanceComponent;

    //Class Imports
    public xhr: any;
    public xhrParams = {
        module: 'premises',
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAPremiseMaintenance'
    };
    public uiForm: FormGroup;
    public controls: any[];
    public uiDisplay: any;
    public dropDown: any;
    public pageParams: any;
    public queryParams: any;

    public ellipsis: any;
    public riMaintenance: RiMaintenance;
    public viewChild: any;
    public riTab: RiTab;
    public flagCopyPremise = false;
    public PremiseSearchMode = '';

    //Page Refs
    public pgPM0: PremiseMaintenance0;
    public pgPM1: PremiseMaintenance1;
    public pgPM1a: PremiseMaintenance1a;
    public pgPM2: PremiseMaintenance2;
    public pgPM3: PremiseMaintenance3;
    public pgPM4: PremiseMaintenance4;
    public pgPM_AR: PremiseMaintenanceAddrRes;
    public pgPM_AR1: PremiseMaintenanceAddrRes1;
    public pgPM_AR2: PremiseMaintenanceAddrRes2;
    public pgPM_AR3: PremiseMaintenanceAddrRes3;
    public actionSave: number = 2;

    //UI Binding
    public tab: any;
    public isRequesting = true;
    public isRequestingInitial = true;
    public showCloseButton = true;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public pageiCABSAPremiseMaintenance: boolean = false;
    public pageiCABSAPremiseMaintenanceAddrRes: boolean = false;
    public contractSearchModal: boolean = false;
    //viewchild block for message/error modal
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    public promptTitle: string = MessageConstant.Message.ConfirmTitle;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;

    //viewchild block for ellipsis
    @ViewChild('contractNumberEllipsis') contractNumberEllipsis: EllipsisComponent;
    @ViewChild('premiseNumberEllipsis') premiseNumberEllipsis: EllipsisComponent;
    @ViewChild('customerTypeEllipsis') customerTypeEllipsis: EllipsisComponent;
    @ViewChild('telesalesEmployeeEllipsis') telesalesEmployeeEllipsis: EllipsisComponent;
    @ViewChild('vehicleTypeEllipsis') vehicleTypeEllipsis: EllipsisComponent;
    @ViewChild('siteReferenceEllipsis') siteReferenceEllipsis: EllipsisComponent;
    @ViewChild('sicCodeEllipsis') sicCodeEllipsis: EllipsisComponent;
    @ViewChild('invoiceGrpNumberEllipsis') invoiceGrpNumberEllipsis: EllipsisComponent;
    @ViewChild('salesAreaSearchEllipsis') salesAreaSearchEllipsis: EllipsisComponent;
    @ViewChild('RegulatoryAuthorityEllipsis') RegulatoryAuthorityEllipsis: EllipsisComponent;
    @ViewChild('MPAFSearch') MPAFSearch: EllipsisComponent;
    @ViewChild('MarktSelectSearch') MarktSelectSearch: EllipsisComponent;
    @ViewChild('PostCodeSearch') PostCodeSearch: EllipsisComponent;
    @ViewChild('AUPostCodeSearch') AUPostCodeSearch: EllipsisComponent;
    @ViewChild('PestNetOnLineLevelSearch') PestNetOnLineLevelSearch: EllipsisComponent;
    @ViewChild('linkedContractNumberEllipsis') linkedContractNumberEllipsis: EllipsisComponent;
    @ViewChild('linkedPremiseNumberEllipsis') linkedPremiseNumberEllipsis: EllipsisComponent;

    public openModal(ellipsisName: string): void { this[ellipsisName].openModal(); }

    //viewchild block for control onfocus
    @ViewChild('ContractNumber') ContractNumber;
    @ViewChild('ServiceAdjHrs') ServiceAdjHrs;
    @ViewChild('ServiceAdjMins') ServiceAdjMins;
    @ViewChild('PremiseType') PremiseType;
    @ViewChild('ProofOfServFax') ProofOfServFax;
    @ViewChild('PosFax') PosFax;
    @ViewChild('PosSMS') PosSMS;
    @ViewChild('PosEmail') PosEmail;
    @ViewChild('NotifyFax') NotifyFax;
    @ViewChild('ProofOfServSMS') ProofOfServSMS;
    @ViewChild('ProofOfServEmail') ProofOfServEmail;
    @ViewChild('PremisePostcode') PremisePostcode;
    @ViewChild('DateFrom1') DateFrom1;
    @ViewChild('DateFrom2') DateFrom2;
    @ViewChild('DateFrom3') DateFrom3;
    @ViewChild('DateFrom4') DateFrom4;
    @ViewChild('DateFrom5') DateFrom5;
    @ViewChild('DateFrom6') DateFrom6;
    @ViewChild('DateFrom7') DateFrom7;
    @ViewChild('DateFrom8') DateFrom8;
    @ViewChild('DateFrom9') DateFrom9;
    @ViewChild('DateFrom10') DateFrom10;
    @ViewChild('AccessFrom1') AccessFrom1;
    @ViewChild('AccessFrom2') AccessFrom2;
    @ViewChild('AccessFrom3') AccessFrom3;
    @ViewChild('AccessFrom4') AccessFrom4;
    @ViewChild('AccessFrom5') AccessFrom5;
    @ViewChild('AccessFrom6') AccessFrom6;
    @ViewChild('AccessFrom7') AccessFrom7;
    @ViewChild('AccessFrom8') AccessFrom8;
    @ViewChild('AccessFrom9') AccessFrom9;
    @ViewChild('AccessFrom10') AccessFrom10;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    @ViewChild('Grid') Grid: GridComponent;
    @ViewChild('GridPagination') GridPagination: PaginationComponent;

    public LostBusinessText: string = '';
    public arrFocusElem = [];

    constructor(injector: Injector, public SpeedScript: SpeedScript) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPREMISEMAINTENANCE;

        this.xhr = this.httpService;
        this.controls = new UiControls().controls;
        this.uiDisplay = new UiControls().uiDisplay;
        this.ellipsis = new UiControls().ellipsis;
        this.viewChild = new UiControls().viewChild;
        this.dropDown = new UiControls().dropDown;
        this.riMaintenance = new RiMaintenance(this.logger, this.xhr, this.LookUp, this.utils, this.serviceConstants, this.globalize);
        this.uiForm = this.uiForm;

        this.riMaintenance.uiForm = this.uiForm;
        this.riMaintenance.riExchange = this.riExchange;
        this.pageParams.vBusinessCode = this.utils.getBusinessCode();
        this.pageParams.vCountryCode = this.utils.getCountryCode();
        this.pageParams.gUserCode = this.utils.getUserCode();

        this.setURLQueryParameters(this);
    }

    public formStatus: Subscription;
    ngOnInit(): void {
        super.ngOnInit();
        this.parent = this;
        // setTimeout(() => {
        //     this.formStatus = this.uiForm.statusChanges.subscribe((value: any) => {
        //         this.checkFormStatus();
        //     });
        // }, 2000);

        setTimeout(() => { this.isRequesting = false; }, 15000);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.riMaintenance.clearQ();
        if (this.pgPM_AR1) { this.pgPM_AR1.killSubscription(); }
        if (this.pgPM_AR2) { this.pgPM_AR2.killSubscription(); }
        if (this.pgPM_AR3) { this.pgPM_AR3.killSubscription(); }

        if (this.pgPM0) { this.pgPM0.killSubscription(); }
        if (this.pgPM1) { this.pgPM1.killSubscription(); }
        if (this.pgPM1a) { this.pgPM1a.killSubscription(); }
        if (this.pgPM2) { this.pgPM2.killSubscription(); }
        if (this.pgPM3) { this.pgPM3.killSubscription(); }
        if (this.pgPM4) { this.pgPM4.killSubscription(); }

        if (this.formStatus) { this.formStatus.unsubscribe(); }
    }

    public getURLQueryParameters(param: any): void {
        this.queryParams = param;
        this.init();
    }

    private defaultCBBparams = {
        countryCode: '',
        businessCode: '',
        branchNumber: ''
    };

    private init(): void {
        this.cbbService.disableComponent(true);
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.initialFormState(false, false);

        this.defaultCBBparams.countryCode = this.utils.getCountryCode();
        this.defaultCBBparams.businessCode = this.utils.getBusinessCode();
        this.defaultCBBparams.branchNumber = this.utils.getBranchCode();

        let qParams = this.location.path().split('?').pop().split('&');
        let fromMenu = false;
        let reload = false;
        let qParentMode = '';
        let currentContractType = 'C';

        for (let i = 0; i < qParams.length; i++) {
            let qP = qParams[i].split('=');
            let key = qP[0].toLowerCase();
            switch (key) {
                case 'frommenu':
                    if (qP[1] === 'true') fromMenu = true; else fromMenu = false;
                    break;
                case 'contracttypecode':
                    currentContractType = qP[1];
                    break;
                case 'parentmode':
                    qParentMode = qP[1];
                    this.parentMode = qParentMode;
                    break;
                case 'reload':
                    if (qP[1] === 'true') {
                        this.isReturningFlag = false;
                        this.handleProductSalesBack(qParams);
                    }
                    if (qP[1] === 'force') {
                        this.isReturningFlag = false;
                    }
                    break;
                default:
                    this.riExchange.updateCtrl(this.controls, qP[0], 'value', qP[1]);
            }
        }

        switch (currentContractType) {
            default:
            case 'C':
                this.pageParams.currentContractType = 'C';
                this.pageHeader = 'Contract';
                break;
            case 'J':
                this.pageParams.currentContractType = 'J';
                this.pageHeader = 'Job';
                break;
            case 'P':
                this.pageParams.currentContractType = 'P';
                this.pageHeader = 'Product Sales';
                break;
        }
        this.ellipsis.contractNumberEllipsis.childparams.initEmpty = false;
        if (this.pageParams.CurrentContractType !== this.pageParams.currentContractType) {
            this.ellipsis.contractNumberEllipsis.childparams.initEmpty = true;
        }
        this.pageParams.CurrentContractType = this.pageParams.currentContractType;
        this.pageParams.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.pageParams.currentContractType);

        let strDocTitle = '^1^ Premises Entry';
        this.utils.setTitle(strDocTitle, '^1^', this.pageParams.CurrentContractTypeLabel);

        //Update Ellipsis Component
        this.ellipsis.contractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;

        //Flag to Auto Open Contract Modal
        this.pageParams.shouldOpen = fromMenu;

        this.pageParams.ParentMode = this.parentMode;
        if (!this.pageParams.ParentMode) {
            if (qParentMode) {
                this.parentMode = qParentMode;
                this.pageParams.ParentMode = qParentMode;
            } else {
                this.parentMode = 'ServiceCover';
                this.pageParams.ParentMode = 'ServiceCover';
            }
        }

        this.logger.log('INIT Premise Maintenance: ', this.pageParams.ParentMode, fromMenu, this.pageHeader, currentContractType, this.pageParams.CurrentContractType, this.pageParams.CurrentContractTypeLabel, qParams, this.isReturning());

        if (this.isReturning()) {
            this.logger.log('DEBUG --- isReturning', this.isReturningFlag, this.formData, this.pageParams);
            setTimeout(() => {
                this.isReturningFlag = false;
            }, 2000);

            this.riMaintenance.CurrentMode = this.pageParams.CurrentMode;
            this.pageParams.shouldOpen = false;
            //Skip Lookups & SysChars & jump to page load
            this.pgPM1.window_onload();
            this.pgPM2.window_onload();
        } else {
            this.showSpinner();
            this.doLookup();
            this.getSysCharTransData(); //Application Init
        }
    }

    private initializeViewChild(): void {
        //TODO - Focus not working as the DOM is populated later
    }

    private doLookup(): any {
        let lookupIP = [
            {
                'table': 'UserAuthority',
                'query': { 'BusinessCode': this.businessCode(), 'UserCode': this.pageParams.gUserCode },
                'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
            },
            {
                'table': 'Branch',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['BranchNumber', 'BranchName']
            },
            {
                'table': 'Discount',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['DiscountCode', 'DiscountDesc']
            },
            {
                'table': 'Language',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['LanguageCode', 'LanguageDescription']
            }
        ];
        let lookupIP2 = [
            {
                'table': 'CustomerAvailTemplate',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['CustomerAvailTemplateID', 'CustomerAvailTemplateDesc']
            },
            {
                'table': 'ClosedCalendarTemplate',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['ClosedCalendarTemplateNumber', 'TemplateName']
            },
            {
                'table': 'PreferredDayOfWeekReasonLang',
                'query': { 'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['PreferredDayOfWeekReasonCode', 'PreferredDayOfWeekReasonLangDesc']
            }
        ];
        let lookupIP3 = [
            {
                'table': 'SICCodeLang',
                'query': { 'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['SICCode', 'SICDescription']
            },
            {
                'table': 'PestNetOnLineLevel',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['PNOLiCABSLevel', 'PNOLDescription']
            },
            {
                'table': 'PremiseTechRetentionReasons',
                'query': { 'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['TechRetentionReasonCode', 'TechRetentionReasonDesc']
            },
            {
                'table': 'NotificationTemplate',
                'query': { 'BusinessCode': this.businessCode() },
                'fields': ['NotifyTemplateCode', 'NotifyTemplateSystemDesc']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let recordSet_UserAuthority = data[0];
            if (recordSet_UserAuthority && recordSet_UserAuthority.length > 0) {
                let record = recordSet_UserAuthority[0];
                this.pageParams.glAllowUserAuthView = record.hasOwnProperty('AllowViewOfSensitiveInfoInd') ? record['AllowViewOfSensitiveInfoInd'] : false;
                this.pageParams.glAllowUserAuthUpdate = record.hasOwnProperty('AllowUpdateOfContractInfoInd') ? record['AllowUpdateOfContractInfoInd'] : false;
            }
            let branchRecords = data[1];
            if (branchRecords && branchRecords.length > 0) {
                this.dropDown.ServiceBranchNumber = [];
                for (let i = 0; i < branchRecords.length; i++) {
                    this.dropDown.ServiceBranchNumber.push({ value: branchRecords[i].BranchNumber, label: branchRecords[i].BranchNumber + ' - ' + branchRecords[i].BranchName });
                }
            }
            let discountRecords = data[2];
            if (discountRecords && discountRecords.length > 0) {
                this.dropDown.DiscountCode = [];
                for (let i = 0; i < discountRecords.length; i++) {
                    if (discountRecords[i].DiscountCode) {
                        this.dropDown.DiscountCode.push({ value: discountRecords[i].DiscountCode, label: discountRecords[i].DiscountCode + ' - ' + discountRecords[i].DiscountDesc });
                    }
                }
            }
            let langRecords = data[3];
            if (langRecords && langRecords.length > 0) {
                this.dropDown.LanguageCode = [];
                for (let i = 0; i < langRecords.length; i++) {
                    this.dropDown.LanguageCode.push({ value: langRecords[i].LanguageCode, label: langRecords[i].LanguageCode + ' - ' + langRecords[i].LanguageDescription });
                }
            }
        });
        this.LookUp.lookUpPromise(lookupIP2).then((data) => {
            let recordSet_CustomerAvailTemplate = data[0];
            let recordSet_ClosedCalendarTemplate = data[1];
            let recordSet_PreferredDayOfWeekReasonLang = data[2];

            if (recordSet_CustomerAvailTemplate && recordSet_CustomerAvailTemplate.length > 0) {
                this.dropDown.CustomerAvailTemplate = [{ value: '', label: '' }];
                for (let i = 0; i < recordSet_CustomerAvailTemplate.length; i++) {
                    this.dropDown.CustomerAvailTemplate.push({
                        value: recordSet_CustomerAvailTemplate[i].CustomerAvailTemplateID,
                        label: recordSet_CustomerAvailTemplate[i].CustomerAvailTemplateID + ' - ' + recordSet_CustomerAvailTemplate[i].CustomerAvailTemplateDesc
                    });
                }
            }
            if (recordSet_ClosedCalendarTemplate && recordSet_ClosedCalendarTemplate.length > 0) {
                this.dropDown.ClosedCalendarTemplate = [];
                for (let i = 0; i < recordSet_ClosedCalendarTemplate.length; i++) {
                    this.dropDown.ClosedCalendarTemplate.push({
                        value: recordSet_ClosedCalendarTemplate[i].ClosedCalendarTemplateNumber,
                        label: recordSet_ClosedCalendarTemplate[i].ClosedCalendarTemplateNumber + ' - ' + recordSet_ClosedCalendarTemplate[i].TemplateName
                    });
                }
            }
            if (recordSet_PreferredDayOfWeekReasonLang && recordSet_PreferredDayOfWeekReasonLang.length > 0) {
                this.dropDown.PreferredDayOfWeekReasonLang = [];
                for (let i = 0; i < recordSet_PreferredDayOfWeekReasonLang.length; i++) {
                    this.dropDown.PreferredDayOfWeekReasonLang.push({
                        value: recordSet_PreferredDayOfWeekReasonLang[i].PreferredDayOfWeekReasonCode,
                        label: recordSet_PreferredDayOfWeekReasonLang[i].PreferredDayOfWeekReasonCode + ' - ' + recordSet_PreferredDayOfWeekReasonLang[i].PreferredDayOfWeekReasonLangDesc
                    });
                }
            }

        });
        this.LookUp.lookUpPromise(lookupIP3).then((data) => {
            let recordSet_SICCodeLang = data[0];
            let recordSet_PestNetOnLineLevel = data[1];
            let recordSet_PremiseTechRetentionReasonsLang = data[2];
            let recordSet_NotificationTemplate = data[3];

            if (recordSet_SICCodeLang && recordSet_SICCodeLang.length > 0) {
                this.dropDown.SICCodeLang = [];
                for (let i = 0; i < recordSet_SICCodeLang.length; i++) {
                    this.dropDown.SICCodeLang.push({
                        value: recordSet_SICCodeLang[i].SICCode,
                        label: recordSet_SICCodeLang[i].SICCode + ' - ' + recordSet_SICCodeLang[i].SICDescription
                    });
                }
            }
            if (recordSet_PestNetOnLineLevel && recordSet_PestNetOnLineLevel.length > 0) {
                this.dropDown.PestNetOnLineLevel = [];
                for (let i = 0; i < recordSet_PestNetOnLineLevel.length; i++) {
                    this.dropDown.PestNetOnLineLevel.push({
                        value: recordSet_PestNetOnLineLevel[i].PNOLiCABSLevel,
                        label: recordSet_PestNetOnLineLevel[i].PNOLiCABSLevel + ' - ' + recordSet_PestNetOnLineLevel[i].PNOLDescription
                    });
                }
            }
            if (recordSet_PremiseTechRetentionReasonsLang) {
                if (recordSet_PremiseTechRetentionReasonsLang.length > 0) {
                    this.dropDown.PremiseTechRetentionReasonsLang = [];
                    for (let i = 0; i < recordSet_PremiseTechRetentionReasonsLang.length; i++) {
                        this.dropDown.PremiseTechRetentionReasonsLang.push({
                            value: recordSet_PremiseTechRetentionReasonsLang[i].TechRetentionReasonCode,
                            label: recordSet_PremiseTechRetentionReasonsLang[i].TechRetentionReasonCode + ' - ' + recordSet_PremiseTechRetentionReasonsLang[i].TechRetentionReasonDesc
                        });
                    }
                }
            }
            if (recordSet_NotificationTemplate && recordSet_NotificationTemplate.length > 0) {
                this.dropDown.NotificationTemplate = [];
                this.dropDown.NotificationTemplate.push({ value: '', label: 'Not Required' });
                for (let i = 0; i < recordSet_NotificationTemplate.length; i++) {
                    this.dropDown.NotificationTemplate.push({
                        value: recordSet_NotificationTemplate[i].NotifyTemplateCode,
                        label: recordSet_NotificationTemplate[i].NotifyTemplateSystemDesc
                    });
                }
            }
        });
        //PostCodeDefaulting
        let lookupIPpostcodedefaulting = [{
            'table': 'Branch',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'EnablePostCodeDefaulting': 'FALSE' },
            'fields': ['BranchNumber', 'EnablePostCodeDefaulting']
        }];
        this.pageParams.vExcludedBranches = '';
        this.LookUp.lookUpPromise(lookupIPpostcodedefaulting).then((data) => {
            if (data) {
                let excludedBranches = '';
                for (let i = 0; i < data[0].length; i++) {
                    if (excludedBranches === '') {
                        excludedBranches = '';
                    } else {
                        excludedBranches = excludedBranches + ',';
                    }
                    excludedBranches = excludedBranches + data[0][i].BranchNumber;
                }
                this.pageParams.excludedBranches = excludedBranches;
            }
        });
    }

    private getSysCharTransData(): any {
        let sysCharList: number[] = [this.sysCharConstants.SystemCharEnableTransData];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.SpeedScript.sysCharPromise(sysCharIP).then((data) => {
            let record = data.records[0];
            this.pageParams.vEnableTransData = record.Required;
            this.riMaintenance.uiForm = this.uiForm;
            this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
            // this.setFormMode(this.c_s_MODE_UPDATE);

            if (this.pageParams.vEnableTransData) {
                this.pageiCABSAPremiseMaintenanceAddrRes = true;
                this.riTab = new RiTab(new UiControls().tab_iCABSAPremiseMaintenanceAddrRes, this.utils);

                this.pgPM_AR = new PremiseMaintenanceAddrRes(this);
                this.pgPM_AR1 = new PremiseMaintenanceAddrRes1(this);
                this.pgPM_AR2 = new PremiseMaintenanceAddrRes2(this);
                this.pgPM_AR3 = new PremiseMaintenanceAddrRes3(this);

                this.pgPM_AR1.window_onload();
                this.pgPM_AR2.window_onload();
                this.pgPM_AR3.window_onload();
            } else {
                this.pageiCABSAPremiseMaintenance = true;
                this.riTab = new RiTab(new UiControls().tab_iCABSAPremiseMaintenance, this.utils);

                this.pgPM0 = new PremiseMaintenance0(this);
                this.pgPM1 = new PremiseMaintenance1(this);
                this.pgPM1a = new PremiseMaintenance1a(this);
                this.pgPM2 = new PremiseMaintenance2(this);
                this.pgPM3 = new PremiseMaintenance3(this);
                this.pgPM4 = new PremiseMaintenance4(this);

                this.pgPM0.window_onload();
            }
            this.tab = this.riTab.tabObject;
            this.hideSpinner();
        });
    }

    public ngAfterViewInit(): any {
        // setTimeout(this.initializeViewChild(), 3000);
    }

    public lErrorMessageDesc = [];
    public showAlert(msgTxt: string, type?: number): void {
        this.logger.log('showAlert', msgTxt, type);
        if (this.lErrorMessageDesc.indexOf(msgTxt) === -1) {
            this.lErrorMessageDesc.push(msgTxt);
        }
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = MessageConstant.Message.ErrorTitle; break;
            case 1: titleModal = MessageConstant.Message.SuccessTitle;
                this.lErrorMessageDesc = [];
                this.lErrorMessageDesc.push(msgTxt);
                break;
            case 2: titleModal = MessageConstant.Message.WarningTitle; break;
        }
        this.isModalOpen(true);
        this.messageModal.show({ msg: this.lErrorMessageDesc, title: titleModal }, false);
    }
    public callbackHooks: any = [];
    public callbackPrompts: any = [];
    public closeModal(): void {
        this.lErrorMessageDesc = [];
        this.isModalOpen(false);
        this.riMaintenance.handleConfirm(this);

        if (this.callbackHooks.length > 0) {
            this.callbackHooks.pop().call(this);
            this.callbackHooks = [];
        }

        if (this.arrFocusElem.length > 0 && !this.isRequesting && !this.riMaintenance.flagXhrProcessing) {
            setTimeout(() => { this.focusField(); }, 1000);
        }
    }
    public showSpinner(): void {
        if (this.parent) this.parent.isRequesting = true; else this.isRequesting = true;
        // this.isRequesting = true;
    }
    public hideSpinner(): void {
        setTimeout(() => {
            let formrawData = this.uiForm.getRawValue();
            //Update Data Model with the default values
            for (let i = 0; i < this.controls.length; i++) {
                if (formrawData.hasOwnProperty([this.controls[i].name])) {
                    this.controls[i].value = formrawData[this.controls[i].name];
                    if (this.controls[i].name.indexOf('Date') > 0) {
                        if (this.pageParams['dt' + this.controls[i].name]) {
                            this.controls[i]['nascentVal'] = formrawData[this.controls[i].name]; //Because SelDate() updates the control
                        }
                    }
                }
            }
            if (this.parent) this.parent.isRequesting = false; else this.isRequesting = false;
            // this.isRequesting = false;
        }, 3000);
    }

    //Button Events
    public save(): void {
        let status = true;
        this.lErrorMessageDesc = [];
        this.riMaintenance.clearQ();
        this.utils.highlightTabs();
        status = this.riExchange.validateForm(this.uiForm);
        this.logger.log('SAVE clicked', this.pageParams.vEnableTransData, this.riMaintenance.CurrentMode, this.uiForm.status, status);
        if (this.uiForm.status === 'VALID') {
            status = true;
        } else {
            if (!status) {
                for (let control in this.uiForm.controls) {
                    if (this.uiForm.controls[control].invalid) {
                        this.logger.log('DEBUG validateForm -- INVALID formControl:', control);
                        this.focusField(control, false, true);
                    }
                }
            }
        }

        if (status) {
            this.parent.promptTitle = MessageConstant.Message.ConfirmTitle;
            this.parent.promptContent = MessageConstant.Message.ConfirmRecord;
            this.riTab.TabFocus(1);
            if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.riMaintenance.CurrentMode = MntConst.eModeSaveUpdate;
                this.actionSave = 2;
            }
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.riMaintenance.CurrentMode = MntConst.eModeSaveAdd;
                this.actionSave = 1;
            }
            this.currentActivity = 'SAVE';
            this.riMaintenance.CancelEvent = false;
            if (this.pageParams.vEnableTransData) {
                this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this.pgPM_AR, this.pgPM_AR1, this.pgPM_AR2, this.pgPM_AR3, this]);
            } else {
                this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this.pgPM0, this.pgPM1, this.pgPM1a, this.pgPM2, this.pgPM3, this.pgPM4, this]);
            }
        }
    }
    public cancel(): void {
        this.lErrorMessageDesc = [];
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.markAsPrestine();

        this.riTab.TabsToNormal();

        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeSaveUpdate) {
            this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
            for (let i = 0; i < this.controls.length; i++) {
                //if (!this.uiForm.controls[this.controls[i].name].pristine) {} - Unable to update disabled fields
                this.riExchange.updateCtrl(this.controls, this.controls[i].name, 'value', this.controls[i].value);
                this.setControlValue(this.controls[i].name, this.controls[i].value);
                if (this.controls[i].name.indexOf('Date') > 0) {
                    if (this.pageParams['dt' + this.controls[i].name]) {
                        let dateVal = this.controls[i].nascentVal;
                        if (!dateVal) dateVal = '';
                        // this.pageParams['dt' + this.controls[i].name].value = (dateVal) ? this.utils.convertDate(dateVal) : dateVal;
                        this.pageParams['dt' + this.controls[i].name].value = (dateVal) ? this.globalize.parseDateStringToDate(dateVal) : dateVal;
                        this.selDate(dateVal, this.controls[i].name);

                        this.routeAwayGlobals.setSaveEnabledFlag(false);
                    }
                }
            }
            /*IUI-15332*/
            if (this.parentMode === 'AddFromPremise' && this.pageParams.CurrentContractType === 'P') {
                this.navigate('Premise-Add', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1, {
                    parentMode: 'Premise-Add',
                    currentContractType: this.pageParams.CurrentContractType,
                    ContractNumber: this.getControlValue('ContractNumber'),
                    PremiseNumber: this.getControlValue('PremiseNumber')
                });
            }
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeSaveAdd) {
            this.ellipsis.contractNumberEllipsis.childparams.accountNumber = '';
            this.ellipsis.contractNumberEllipsis.childparams.accountName = '';
            this.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'Search';
            this.initialFormState(false, true);
        }

        this.pageParams.GridCacheTime = (new Date()).toTimeString().split(' ')[0];
        this.setGridHandle();
        if (this.pageParams.vEnableTransData) {
            //TODO
        } else {
            this.pgPM3.BuildSRAGrid();
        }
    }
    public confirm(): any {
        if (!this.riMaintenance.CancelEvent) {
            if (typeof this.promptModal === 'undefined') {
                this['parent'].promptModal.show();
            } else {
                this.promptModal.show();
            }
        }
    }
    public currentActivity = '';
    public confirmed(obj: any): any {
        this.lErrorMessageDesc = [];
        if (this.callbackPrompts.length > 0) {
            let fn = this.callbackPrompts.pop();
            this.pageParams.promptAns = true;
            if (typeof fn === 'function') fn.call(this);
            this.callbackPrompts = [];
        } else {
            this.riMaintenance.CancelEvent = false;
            if (this.pageParams.vEnableTransData) {
                this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this.pgPM_AR, this.pgPM_AR1, this.pgPM_AR2, this.pgPM_AR3, this]);
            } else {
                this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this.pgPM0, this.pgPM1, this.pgPM1a, this.pgPM2, this.pgPM3, this.pgPM4, this]);
            }
        }
    }
    public promptCancel(): any {
        if (this.callbackPrompts.length > 0) {
            let fn = this.callbackPrompts.pop();
            this.pageParams.promptAns = false;
            if (typeof fn === 'function') fn.call(this);
            this.callbackPrompts = [];
        }
    }

    public isModalOpen(flag: boolean): void {
        this.riMaintenance.isModalOpen = flag;
    }

    public clearFlags(): void {
        this.uiDisplay.tdContractHasExpired = false;
        this.uiDisplay.tdNationalAccount = false;
        this.uiDisplay.badDebtAccountCheckbox = false;
        this.uiDisplay.badDebtAccount = false;
        this.uiDisplay.tdPNOL = false;
        this.uiDisplay.tdHyperSens = false;
        this.uiDisplay.tdEnvironmentalRestrictedAreaInd = false;
        this.uiDisplay.trialPeriodInd = false;
    }

    public initialFormState(flag: boolean, flagModal: boolean): void {
        if (!flag) this.clearFlags(); //Remove all UI flags
        this.riExchange.disableFormFields(this.uiForm); //Disable All controls
        if (!flag) this.riExchange.resetCtrl(this.controls); //Reset All Control Values
        this.updateButton(); //Update UI buttons with text
        this.enableContractNumber(); //Enable Contract Number

        //Enable/Disable Premise Number
        if (flag) {
            if (this.getControlValue('ContractName') !== '')
                this.enablePremiseNumber();
        }
        else {
            this.disablePremiseNumber();
        }
        this.riExchange.renderForm(this.uiForm, this.controls); //Form Redraw

        //DatePickers initialized
        this.initDatePickers();
        if (!flag) {
            for (let i = 0; i < this.controls.length; i++) {
                if (this.controls[i].name.indexOf('Date') > 0) {
                    if (document.querySelector('#' + this.controls[i].name)) {
                        if (this.pageParams['dt' + this.controls[i].name]) {
                            if (this.pageParams['dt' + this.controls[i].name].value === null) {
                                this.pageParams['dt' + this.controls[i].name].value = void 0;
                            } else {
                                this.pageParams['dt' + this.controls[i].name].value = null;
                            }
                        }

                        let dateField = this.utils.validateDateElemObj(this.controls[i].name);
                        if (dateField) {
                            let dateFieldID = dateField.getAttribute('id');
                            setTimeout(() => { document.getElementById(dateFieldID)['value'] = ''; }, 200);
                        }
                    }
                }
            }
        }

        //Open Contract Search Modal
        if (!flag) {
            if (flagModal) {
                if (this.contractNumberEllipsis) this.contractNumberEllipsis.openModal(); //TODO Bug - Openning URL in the same page opens the popup
            }
            this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        }
    }

    public enableControls(): void {
        for (let i = 0; i < this.controls.length; i++) {
            if (!this.controls[i].disabled) {
                this.riExchange.riInputElement.Enable(this.uiForm, this.controls[i].name);
            }
        }
        this.updateButton(); //Update UI buttons with text
    }

    //On CBB change
    public CBBupdated: boolean = false;
    public updateSysCharsLookup(): void {
        this.CBBupdated = true;
        let retainParams = {
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            AccountNumber: this.getControlValue('AccountNumber')
        };
        this.initialFormState(false, false);

        let skipIDs = 'CurrentContractType,CurrentContractTypeLabel,ParentMode,currentContractType,currentContractTypeLabel,gUserCode,shouldOpen,vBusinessCode,vCountryCode'.split(',');
        for (let id in this.pageParams) {
            if (id && skipIDs.indexOf(id) === -1) {
                if (id.toLowerCase().indexOf('date') === -1)
                    this.pageParams[id] = null;
            }
        }

        setTimeout(() => {
            this.pageParams.vBusinessCode = this.utils.getBusinessCode();
            this.pageParams.vCountryCode = this.utils.getCountryCode();
            this.setControlValue('ContractNumber', retainParams.ContractNumber);
            this.setControlValue('ContractName', retainParams.ContractName);
            this.setControlValue('AccountNumber', retainParams.AccountNumber);
            this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', retainParams.ContractNumber);
            this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', retainParams.ContractName);
            this.riExchange.updateCtrl(this.controls, 'AccountNumber', 'value', retainParams.AccountNumber);

            this.setControlValue('PremiseNumber', '');
            this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', '');

            this.pageiCABSAPremiseMaintenanceAddrRes = false;
            this.pageiCABSAPremiseMaintenance = false;

            this.doLookup();
            this.getSysCharTransData();
        }, 500);
    }

    //Ellipsis Functionalities
    //Contract Number
    public ContractNumber_onchange(type?: string): void {
        this.isRequesting = true;
        let ContractNo = this.getControlValue('ContractNumber');
        ContractNo = this.utils.numberPadding(ContractNo, 8);

        //Defaulting the Current Contract Type
        if (!this.pageParams.CurrentContractType) {
            this.pageParams.CurrentContractType = 'C';
        }

        this.LookUp.lookUpPromise([{
            'table': 'Contract',
            'query': { 'BusinessCode': this.businessCode(), 'ContractNumber': ContractNo/*, 'ContractTypeCode': this.pageParams.CurrentContractType*/ },
            'fields': ['ContractNumber', 'ContractName', 'AccountNumber']
        }]).then((data) => {
            this.isRequesting = false;
            if (data) {
                let objData: any;
                if (data[0].length > 0) {
                    objData = data[0][0];
                    objData['ContractTypePrefix'] = this.pageParams.CurrentContractType;
                } else {
                    objData = {
                        ContractNumber: '',
                        ContractName: '',
                        AccountNumber: ''
                    };
                    this.showAlert(MessageConstant.Message.noRecordFound);
                    this.focusField('ContractNumber', true);
                    this.riTab.TabFocus(1);
                }
                this.ContractNumberSelection(objData);
            }
            this.riMaintenance.clearQ();
        });
    }
    public ContractNumberSelection(data: any): void {
        this.focusField('PremiseNumber', true);
        this.riTab.TabFocus(1);

        this.initialFormState(false, false);
        this.isReturningFlag = false;
        this.primaryFieldsEnableDisable();

        this.ellipsis.contractNumberEllipsis.childparams.initEmpty = false;
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('PremiseNumber', '');
        this.setControlValue('CurrentContractType', this.pageParams.CurrentContractType);
        this.setControlValue('ContractTypeCode', this.pageParams.CurrentContractType);

        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', data.ContractNumber);
        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', data.ContractName);
        this.riExchange.updateCtrl(this.controls, 'AccountNumber', 'value', data.AccountNumber);
        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', '');
        this.riExchange.updateCtrl(this.controls, 'ContractTypeCode', 'value', this.pageParams.CurrentContractType);

        this.ellipsis.contractNumberEllipsis.childparams.accountNumber = this.getControlValue('AccountNumber');
        this.ellipsis.contractNumberEllipsis.childparams.accountName = this.getControlValue('AccountName');

        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');

        this.ellipsis.linkedContractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
        this.ellipsis.linkedPremiseNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;

        this.pageParams.CurrentContractType = data.ContractTypePrefix;

        //If CBB has changed, update SysChar and initialize the page
        if (data.CountryCode) {
            if (this.defaultCBBparams.countryCode !== data.CountryCode) {
                this.updateSysCharsLookup();
                this.defaultCBBparams.countryCode = data.CountryCode;
                this.defaultCBBparams.businessCode = data.BusinessCode;
            }
        }
        if (data.BusinessCode) {
            if (this.defaultCBBparams.businessCode !== data.BusinessCode) {
                this.updateSysCharsLookup();
                this.defaultCBBparams.countryCode = data.CountryCode;
                this.defaultCBBparams.businessCode = data.BusinessCode;
            }
        }

        if (!this.CBBupdated) {
            if (this.pageParams.vEnableTransData) {
                this.pgPM_AR1.init();
            } else {
                this.pgPM1.init();
            }
        }
    }
    public ContractNumberSelection_onkeydown(obj: any): void {
        //TODO - Out of scope
        if (obj.keyCode === 34) {
            this.ellipsis.contractNumberEllipsis.childparams.parentMode = 'Lookup';
            this.ellipsis.contractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
            this.contractNumberEllipsis.openModal();
        }
    }
    public ContractEllipsisClosed(): void {
        this.ellipsis.contractNumberEllipsis.childparams.initEmpty = false;
    }

    //Premise Number
    public PremiseNumber_onchange(type?: string): void {
        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.getControlValue('PremiseNumber'));

        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');

        this.PremiseNumberSelection({
            PremiseNumber: this.getControlValue('PremiseNumber'),
            PremiseName: '',
            ContractNumber: this.getControlValue('ContractNumber')
        });
    }
    public PremiseNumberSelection(data: any): void {
        this.ellipsis.premiseNumberEllipsis.childparams.showAddNew = true;
        if (!this.flagCopyPremise) {
            if (this.PremiseSearchMode !== 'POSTCODE') {
                let ContractNumber = this.getControlValue('ContractNumber').trim();
                let ContractName = this.getControlValue('ContractName').trim();
                let AccountNumber = this.getControlValue('AccountNumber').trim();

                this.initialFormState(false, false);

                if (data.AddMode) {
                    this.riMaintenance.CurrentMode = MntConst.eModeAdd;
                    this.disablePremiseNumber();

                    // setTimeout(() => { this.focusField('PremiseCommenceDate'); }, 2000);
                    this.arrFocusElem.push('PremiseCommenceDate');
                    this.focusField();
                } else {
                    this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
                    this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', data.PremiseNumber);
                    this.setControlValue('PremiseNumber', data.PremiseNumber);
                }

                this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', ContractNumber);
                this.setControlValue('ContractNumber', ContractNumber);
                this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', ContractName);
                this.setControlValue('ContractName', ContractName);
                this.riExchange.updateCtrl(this.controls, 'AccountNumber', 'value', AccountNumber);
                this.setControlValue('AccountNumber', AccountNumber);

                if (this.pageParams.vEnableTransData) {
                    setTimeout(() => { this.pgPM_AR1.init(); }, 250); //250ms add as the execution of initialFormState() is not completed(async)
                } else {
                    this.pgPM1.init();
                }
            }
        } else {
            this.flagCopyPremise = false;
            this.riMaintenance.renderResponseForCtrl(this, data);

            for (let i in data) {
                if (i) {
                    let CheckControls = 'SalesAreaCode, PremisePostcode';
                    if (CheckControls.indexOf(i) > -1) {
                        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, i);
                    }
                }
            }

            if (this.pageParams.vEnableTransData) {
                this.pgPM_AR1.riExchange_CBORequest();
            } else {
                this.pgPM2.riExchange_CBORequest();
                if (this.pageParams.vbShowPremiseWasteTab) { this.pgPM2.WasteConsignmentNoteExemptInd_onClick(); }
                if (this.pageParams.vbEnableGlobalSiteRiskAssessment) { this.pgPM3.GetGblSRAValues(); }
            }
        }

        this.PremiseSearchMode = '';
        this.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'Search';
    }
    public PremiseNumberSelection_onkeydown(obj: any): void {
        //TODO - Out of scope
        //this.ellipsis.premiseNumberEllipsis.disabled = false;
        this.ellipsis.premiseNumberEllipsis.childparams.showAddNew = true;
        if (obj.keyCode === 34 || obj.explicitOpen) {
            this.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'Search';
            this.ellipsis.premiseNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;

            this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');

            if (obj.explicitOpen) {
                if (this.getControlValue('ContractNumber') !== '') {
                    this.premiseNumberEllipsis.openModal();
                }
            } else this.premiseNumberEllipsis.openModal();
        }
    }
    public PremiseNumberSelectionClosed(): void {
        //this.ellipsis.premiseNumberEllipsis.disabled = true;
        this.ellipsis.premiseNumberEllipsis.childparams.showAddNew = true;
    }

    public LinkedContractNumberSelection(data: any): void {
        this.setControlValue('LinkedToContractNumber', data.ContractNumber);
        this.setControlValue('LinkedToContractName', data.ContractName);

        this.ellipsis.linkedPremiseNumberEllipsis.childparams.ContractNumber = data.ContractNumber;
        this.ellipsis.linkedPremiseNumberEllipsis.childparams.ContractName = data.ContractName;
        this.ellipsis.linkedPremiseNumberEllipsis.childparams.AccountNumber = data.AccountNumber;
    }

    public LinkedPremiseNumberSelection(data: any): void {
        this.setControlValue('LinkedToPremiseNumber', data.PremiseNumber);
        this.setControlValue('LinkedToPremiseName', data.PremiseName);
    }

    public InvoiceGroupNumberSelection_onkeydown(obj: any): void {
        //TODO - Out of scope
        if (obj.keyCode === 34) {
            this.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');
            this.invoiceGrpNumberEllipsis.openModal();
        }
    }

    public InvoiceGroupNumberSelection(data: any): void {
        if (data) {
            // this.setControlValue('InvoiceGroupNumber', data.InvoiceGroupNumber);
            // this.setControlValue('InvoiceGroupDesc', data.InvoiceGroupDesc);
            this.setControlValue('InvoiceGroupNumber', data.trRowData[0].text);
            this.setControlValue('InvoiceGroupDesc', data.trRowData[1].text);
        }
    }

    public CustomerTypeSelection(data: any): void {
        if (data) {
            this.logger.log('CustomerTypeSelection', data);
            this.setControlValue('CustomerTypeCode', data.CustomerTypeCode);
            this.setControlValue('CustomerTypeDesc', data.CustomerTypeDesc);
            //Workaround for CustomerCodeSearch lookup bug
            // this.setControlValue('SICCode', data.SICCode);
            // this.setControlValue('SICDesc', data.SICDesc);
            if (this.pageParams.vEnableTransData) {
                //
            } else {
                this.pgPM2.CustomerTypeCode_onchange();
            }
        }
    }

    public onSalesAreaSearch(data: any): void {
        if (data) {
            this.setControlValue('SalesAreaCode', data.SalesAreaCode);
            this.setControlValue('SalesAreaDesc', data.SalesAreaDesc);
            this.setControlValue('PremiseSalesEmployee', data.PremiseSalesEmployee);
            this.setControlValue('SalesEmployeeSurname', data.SalesEmployeeSurname);
        }
    }

    public SICCodeSelection(data: any): void {
        if (data) {
            this.setControlValue('SICCode', data.SICCode);
            this.setControlValue('SICDesc', data.SICDescription);
        }
    }

    public TelesalesEmployeeCodeSelection(data: any): void {
        if (data) {
            this.setControlValue('TelesalesEmployeeCode', data.EmployeeCode);
            this.setControlValue('TelesalesEmployeeName', data.EmployeeSurName);
        }
    }

    public VehicleTypeNumberSelection(data: any): void {
        if (data) {
            this.logger.log('VehicleTypeNumberSelection', data);
            // this.setControlValue('VehicleTypeNumber', data.EmployeeCode);
            // this.setControlValue('VehicleTypeDesc', data.EmployeeSurName);
        }
    }

    public PNOLiCABSLevelSelection(data: any): void {
        if (data) {
            this.setControlValue('PNOLiCABSLevel', data.PNOLiCABSLevel);
            this.setControlValue('PNOLDescription', data.PNOLDescription);
            this.pgPM2.CheckCanUpdatePNOLDetails();
        }
    }

    public PNOLSiteRefSelection(data: any): void {
        if (data) {
            this.setControlValue('PNOLSiteRef', data.PNOLSiteRef);
            this.setControlValue('PNOLSiteRefDesc', data.PNOLSiteRefDesc);
            this.setControlValue('PNOLiCABSLevel', data.PNOLiCABSLevel);

            if (data.PremiseAddressLine1) {
                this.setControlValue('PremiseAddressLine1', data.PremiseAddressLine1);
                this.setControlValue('PremiseAddressLine2', data.PremiseAddressLine2);
                this.setControlValue('PremiseAddressLine3', data.PremiseAddressLine3);
                this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
                this.setControlValue('PremiseAddressLine5', data.PremiseAddressLine5);
                this.setControlValue('PremisePostcode', data.PremisePostcode);
            }
        }
    }

    public RegulatoryAuthoritySelection(data: any): void {
        if (data) {
            this.logger.log('RegulatoryAuthoritySelection', data);
            // this.setControlValue('RegulatoryAuthorityNumber', data.EmployeeCode);
            // this.setControlValue('RegulatoryAuthorityName', data.EmployeeSurName);
        }
    }

    public onEmployeeDataReceived(data: any, employeeCode: string, employeeSurname: string, occupationDesc?: string): void {
        if (data) {
            if (employeeCode === 'PremiseSRAEmployee') {
                this.setControlValue(employeeCode, data.PremiseSRAEmployee);
                this.setControlValue(employeeSurname, data.SRAEmployeeSurname);
            } else {
                this.setControlValue(employeeCode, data.EmployeeCode);
                this.setControlValue(employeeSurname, data.EmployeeSurName);
                this.setControlValue(occupationDesc, data.fullObject.OccupationDesc);
            }
        }
    }

    public ellipsisPostCodeSelection(data: any): void {
        if (this.pageParams.vSCEnableHopewiserPAF) {
            //TODO - Page not ready yet
            this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
            this.setControlValue('PremiseAddressLine5', data.PremiseAddressLine5);
            this.setControlValue('PremisePostcode', data.PremisePostcode);
        } else if (this.pageParams.vSCEnableMarktSelect) {
            if (!(data['PremiseAddressLine1'] === undefined))
                this.setControlValue('PremiseAddressLine1', data.PremiseAddressLine1);
            if (!(data['PremiseAddressLine2'] === undefined))
                this.setControlValue('PremiseAddressLine2', data.PremiseAddressLine2);
            if (!(data['PremiseAddressLine4'] === undefined))
                this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
            if (!(data['PremisePostcode'] === undefined))
                this.setControlValue('PremisePostcode', data.PremisePostcode);
            if (!(data['PremiseName'] === undefined))
                this.setControlValue('PremiseName', data.PremiseName);
            if (!(data['PremiseContactTelephone'] === undefined))
                this.setControlValue('PremiseContactTelephone', data.PremiseContactTelephone);
            if (!(data['PremiseContactFax'] === undefined))
                this.setControlValue('PremiseContactFax', data.PremiseContactFax);
            if (!(data['PremiseReference'] === undefined))
                this.setControlValue('PremiseReference', data.PremiseReference);
            if (!(data['PremiseRegNumber'] === undefined))
                this.setControlValue('PremiseRegNumber', data.PremiseRegNumber);
            if (!(data['CustomerTypeCode'] === undefined))
                this.setControlValue('CustomerTypeCode', data.CustomerTypeCode);
        } else if (this.pageParams.vSCEnableDatabasePAF) {
            this.setControlValue('PremiseAddressLine4', data.PremiseAddressLine4);
            this.setControlValue('PremiseAddressLine5', data.PremiseAddressLine5);
            this.setControlValue('PremisePostcode', data.PremisePostcode);
        }
    }
    public ellipsisPostCodeSelectionClosed(data: any): void {
        this.logger.log('DEBUG -- ellipsisPostCodeSelectionClosed');
        this.isModalOpen(false);
        this.closeModal();

        this.parent.arrFocusElem.length = 0;

        if (!this.getControlValue('PremiseName')) {
            this.parent.arrFocusElem.push('PremiseName');
        } else if (!this.getControlValue('PremiseAddressLine1')) {
            this.parent.arrFocusElem.push('PremiseAddressLine1');
        } else if (!this.getControlValue('PremiseAddressLine2')) {
            this.parent.arrFocusElem.push('PremiseAddressLine2');
        } else if (!this.getControlValue('PremiseAddressLine4')) {
            this.parent.arrFocusElem.push('PremiseAddressLine4');
        } else if (!this.getControlValue('PremiseAddressLine5')) {
            this.parent.arrFocusElem.push('PremiseAddressLine5');
        }
        this.parent.focusField();
    }


    public initDatePickers(): void {
        this.pageParams.dtPremiseCommenceDate = { value: null, required: true, disabled: true, focus: false, autofocus: false, validate: false };
        this.pageParams.dtPNOLEffectiveDate = { value: null, required: false, disabled: true, autofocus: false, validate: false };
        this.pageParams.dtPurchaseOrderExpiryDate = { value: null, required: false, disabled: true, autofocus: false, validate: false };
        this.pageParams.dtInactiveEffectDate = { value: null, required: false, disabled: true, autofocus: false, validate: false };
        this.pageParams.dtWasteConsignmentNoteExpiryDate = { value: null, required: false, disabled: true, autofocus: false, validate: false };
        this.pageParams.dtPremiseSRADate = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom1 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo1 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom2 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo2 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom3 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo3 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom4 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo4 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom5 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo5 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom6 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo6 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom7 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo7 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom8 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo8 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom9 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo9 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateFrom10 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
        this.pageParams.dtDateTo10 = { value: null, required: false, disabled: false, autofocus: false, validate: false };
    }

    public selDate(value: any, id: string, triggerObj?: any): void {
        // this.logger.log('DEBUG selDate ', id, '<', value, '>', triggerObj);

        if (value.length === 10 || value === '') { //DD/MM/YYYY
            this.setControlValue(id, value);
            this.riExchange.updateCtrl(this.controls, id, 'value', value);

            this.riExchange.riInputElement.MarkAsDirty(this.uiForm, id);

            if (id.indexOf('DateFrom') !== -1) {
                let newId = id.replace('DateFrom', 'DateTo');
                this.setControlValue(newId, value);
                this.riExchange.updateCtrl(this.controls, newId, 'value', value);
            }

            this.removeFocus(id);

            let obj: any;
            if (this.pageParams.vEnableTransData) {
                obj = [this.pgPM_AR1, this.pgPM_AR2, this.pgPM_AR3];
            } else {
                obj = [this.pgPM0, this.pgPM1, this.pgPM1a, this.pgPM2, this.pgPM3, this.pgPM4];
            }

            let normalExec = false;
            if (id.indexOf('PremiseCommenceDate') > -1 || id.indexOf('PNOLEffectiveDate') > -1) {
                if (triggerObj && triggerObj.trigger) {
                    normalExec = true;
                }
            } else {
                normalExec = true;
            }

            //Change Events //Blur Events //Deactivate events
            if (normalExec) {
                for (let j = 0; j < obj.length; j++) {
                    //Check if OnChange or OnBlur is implemented
                    let fntail = '_OnChange'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                    fntail = '_onChange'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                    fntail = '_onchange'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                    fntail = '_OnBlur'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                    fntail = '_onBlur'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                    fntail = '_onblur'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                    fntail = '_ondeactivate'; if (typeof obj[j][id + fntail] === 'function') { obj[j][id + fntail].call(this); }
                }
            }
        }
    }

    public dateDisable(id: string, flag: boolean, setEmpty: boolean): void {
        this.logger.log('DEBUG --- dateDisable', id, flag, setEmpty, this.getControlValue(id));

        let tempDate = this.getControlValue(id);
        if (this.pageParams['dt' + id]) {
            this.pageParams['dt' + id].disabled = flag;
            if (setEmpty) {
                this.pageParams['dt' + id].value = null;
            } else {
                if (typeof tempDate === 'object') {
                    this.pageParams['dt' + id].value = tempDate;
                } else {
                    if (tempDate) {
                        // this.pageParams['dt' + id].value = this.utils.convertDate(this.utils.convertAnyToUKString(tempDate));
                        this.pageParams['dt' + id].value = this.globalize.parseDateStringToDate(tempDate);
                    } else {
                        if (this.pageParams['dt' + id].value === null) {
                            this.pageParams['dt' + id].value = void 0;
                        } else {
                            this.pageParams['dt' + id].value = null;
                        }
                    }
                }
            }
        }
    }

    public focusField(id?: string, flagClear?: boolean, validate?: boolean): void {
        if (!id) {
            if (this.arrFocusElem.length > 0) {
                id = this.arrFocusElem[0];
                if (id.indexOf('Date') > 0) {
                    if (this.pageParams['dt' + id]) {
                        if (!this.pageParams['dt' + id].disabled) {
                            id = this.arrFocusElem.shift();
                        }
                    }
                } else {
                    if (!document.getElementById('PremiseName')['disabled']) {
                        id = this.arrFocusElem.shift();
                    }
                }
            }
        }

        this.logger.log('DEBUG --- focusField', id, flagClear);

        if (id) {
            if (id.indexOf('Date') > 0) {
                let tempDate = this.getControlValue(id);

                if (this.pageParams['dt' + id]) {
                    this.pageParams['dt' + id].autofocus = true;
                    if (flagClear) {
                        this.pageParams['dt' + id].value = null;
                    } else {
                        if (typeof tempDate === 'object') {
                            this.pageParams['dt' + id].value = tempDate;
                        } else {
                            if (tempDate) {
                                // this.pageParams['dt' + id].value = this.utils.convertDate(this.utils.convertAnyToUKString(tempDate));
                                this.pageParams['dt' + id].value = this.globalize.parseDateStringToDate(tempDate);
                            } else {
                                if (this.pageParams['dt' + id].value === null) {
                                    this.pageParams['dt' + id].value = void 0;
                                } else {
                                    this.pageParams['dt' + id].value = null;
                                }
                            }
                        }
                    }
                    if (validate) {
                        this.pageParams['dt' + id].validate = validate;
                    }
                }
            } else {
                setTimeout(() => { document.getElementById(id).focus(); }, 200);
            }
        }
    }

    public removeFocus(id: string): void {
        //Functionality not required
    }

    public onTrialPeriodIndChange(event: any): void {
        //Functionality Unknown
    }

    public onChangeFn(event: any, id?: string): void {
        let target = event.target || event.srcElement || event.currentTarget;
        let idAttr = target.attributes.id.nodeValue;
        let value = target.value;

        this.logger.log('onChangeFn --->>', idAttr);
        switch (idAttr) {
            case 'CustomerTypeCode':
                if (this.pageParams.vEnableTransData) { /*AddrRes*/ } else { this.pgPM2.CustomerTypeCode_onchange(); }
                break;
            case 'SalesAreaCode':
                if (this.pageParams.vEnableTransData) { /*AddrRes*/ } else { this.pgPM2.riExchange_CBORequest(); }
                break;
            case 'TelesalesEmployeeCode':
                if (this.pageParams.vEnableTransData) { /*AddrRes*/ } else { this.pgPM2.riExchange_CBORequest(); }
                break;
            case 'ServiceBranchNumber':
                if (this.pageParams.vEnableTransData) { /*AddrRes*/ } else { this.pgPM2.riExchange_CBORequest(); }
                break;
            case 'VehicleTypeNumber':
                if (this.pageParams.vEnableTransData) { /*AddrRes*/ } else { /* Normal */ }
                break;
            case 'PNOLSiteRef':
                if (this.pageParams.vEnableTransData) { /*AddrRes*/ } else { /* Normal */ }
                break;
            case 'PNOLiCABSLevel':
                this.pgPM2.PNOLiCABSLevel_onChange();
                break;
            case 'RegulatoryAuthorityNumber':
                if (this.pageParams.vEnableTransData) { /*AddrRes*/ } else { this.pgPM2.RegulatoryAuthorityNumber_onChange(); }
                break;
        }
    }

    public onKeydownFn(event: any, id?: string): void {
        let target = event.target || event.srcElement || event.currentTarget;
        let idAttr = target.attributes.id.nodeValue;
        let value = target.value;

        if (event.keyCode === 34) {
            event.preventDefault();
            this.logger.log('DEBUG onKeydownFn --->>', idAttr);
            switch (idAttr) {
                case 'CustomerTypeCode':
                    this.customerTypeEllipsis.openModal();
                    break;
                case 'SalesAreaCode':
                    this.salesAreaSearchEllipsis.openModal();
                    break;
                case 'TelesalesEmployeeCode':
                    this.telesalesEmployeeEllipsis.openModal();
                    break;
                case 'VehicleTypeNumber':
                    this.pgPM1a.VehicleTypeNumber_onkeydown(event);
                    //this.vehicleTypeEllipsis.openModal();
                    break;
                case 'PNOLSiteRef':
                    this.siteReferenceEllipsis.openModal();
                    break;
                case 'RegulatoryAuthorityNumber':
                    this.RegulatoryAuthorityEllipsis.openModal();
                    break;
            }
        }
    }

    public disableContractNumber(): void {
        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'disabled', true);
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.ellipsis.contractNumberEllipsis.disabled = true;
    }

    public disablePremiseNumber(): void {
        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'disabled', true);
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.ellipsis.premiseNumberEllipsis.disabled = true;
    }

    public enableContractNumber(): void {
        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'disabled', false);
        this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumber');
        this.ellipsis.contractNumberEllipsis.disabled = false;
    }

    public enablePremiseNumber(): void {
        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'disabled', false);
        this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseNumber');
        this.ellipsis.premiseNumberEllipsis.disabled = false;
    }

    public markAsPrestine(): void {
        for (let i = 0; i < this.controls.length; i++) {
            this.uiForm.controls[this.controls[i].name].markAsPristine();
        }
    }

    public checkFormStatus(): void {
        /* Check Form Status */
        for (let i = 0; i < this.controls.length; i++) {
            if (!this.uiForm.controls[this.controls[i].name].pristine) {
                this.logger.log('NAVIGATE CONTROL >>', this.controls[i].name, this.uiForm.controls[this.controls[i].name].pristine);
                if (this.controls[i].name.toLowerCase().indexOf('date') > -1) {
                    let dateField = this.utils.validateDateElemObj(this.controls[i].name);
                    let checkClassName = 'ng-untouched';
                    if (dateField) {
                        if (this.utils.hasClass(dateField, checkClassName)) {
                            // this.logger.log('NAVIGATE --- CONTROL DatePicker', this.controls[i].name, this.utils.hasClass(dateField, checkClassName));
                            this.uiForm.controls[this.controls[i].name].markAsPristine();
                        }
                    }
                }
            }
        }

        this.uiForm.controls['ContractNumber'].markAsPristine();
        this.uiForm.controls['PremiseNumber'].markAsPristine();
        this.uiForm.controls['menu'].markAsPristine();

        this.logger.log('DEBUG Form Status:', this.uiForm.pristine, this.riMaintenance.CurrentMode);
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (!this.uiForm.pristine) this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (!this.uiForm.pristine) this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
    }

    public updateButton(): void {
        this.utils.getTranslatedval('Save').then((res: string) => { this.setControlValue('save', res); });
        this.utils.getTranslatedval('Cancel').then((res: string) => { this.setControlValue('cancel', res); });
        this.utils.getTranslatedval('Contact Details').then((res: string) => { this.setControlValue('BtnAmendContact', res); });
        this.utils.getTranslatedval('Get Address').then((res: string) => { this.setControlValue('cmdGetAddress', res); });
        this.utils.getTranslatedval('Copy').then((res: string) => { this.setControlValue('cmdCopyPremise', res); });
        this.utils.getTranslatedval('Get Vertex Geo Code').then((res: string) => { this.setControlValue('cmdVtxGeoCode', res); });
        this.utils.getTranslatedval('Geocode').then((res: string) => { this.setControlValue('cmdGeocode', res); });
        this.utils.getTranslatedval('Future Change').then((res: string) => { this.setControlValue('cmdValue', res); });
        this.utils.getTranslatedval('Resolve Address').then((res: string) => { this.setControlValue('cmdGetLatAndLong', res); });
        this.utils.getTranslatedval('Match Premises').then((res: string) => { this.setControlValue('cmdMatchPremise', res); });
        this.utils.getTranslatedval('Resend Premises').then((res: string) => { this.setControlValue('cmdResendPremises', res); });
        this.utils.getTranslatedval('View Linked Premises').then((res: string) => { this.setControlValue('cmdViewLinkedPremises', res); });
        this.utils.getTranslatedval('View Associated Premises').then((res: string) => { this.setControlValue('cmdViewAssociatedPremises', res); });
        this.utils.getTranslatedval('Add Next Hazard').then((res: string) => { this.setControlValue('cmdAddNextHazard', res); });
        this.utils.getTranslatedval('Questionnaire Complete').then((res: string) => { this.setControlValue('cmdQuestionnaireComp', res); });
        this.utils.getTranslatedval('Customer Information').then((res: string) => { this.setControlValue('tdCustomerInfo', res); });
        this.utils.getTranslatedval('Generate Text').then((res: string) => { this.setControlValue('cmdSRAGenerateText', res); });
    }

    public updateEllipsisParams(): void {
        this.ellipsis.contractNumberEllipsis.childparams.accountNumber = this.getControlValue('AccountNumber');
        this.ellipsis.contractNumberEllipsis.childparams.accountName = this.getControlValue('AccountName');

        this.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');

        this.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountName = this.getControlValue('AccountName');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.invoiceGrpNumberEllipsis.childparams.PremiseNumber = this.getControlValue('PremiseNumber');

        this.ellipsis.siteReferenceEllipsis.childparams.AccountNumber = this.getControlValue('AccountNumber');
        this.ellipsis.siteReferenceEllipsis.childparams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.siteReferenceEllipsis.childparams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.siteReferenceEllipsis.childparams.SearchPostcode = this.getControlValue('PremisePostcode');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseName = this.getControlValue('PremiseName');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine1 = this.getControlValue('PremiseAddressLine1');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine2 = this.getControlValue('PremiseAddressLine2');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine3 = this.getControlValue('PremiseAddressLine3');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine4 = this.getControlValue('PremiseAddressLine4');
        this.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine5 = this.getControlValue('PremiseAddressLine5');
        this.ellipsis.siteReferenceEllipsis.childparams.PremisePostcode = this.getControlValue('PremisePostcode');

        this.ellipsis.MPAFSearch.childparams.PostCode = this.getControlValue('PremisePostcode');
        this.ellipsis.MPAFSearch.childparams.State = this.getControlValue('PremiseAddressLine5');
        this.ellipsis.MPAFSearch.childparams.Town = this.getControlValue('PremiseAddressLine4');
        this.ellipsis.MPAFSearch.childparams.BranchNumber = this.utils.getBranchCode();

        this.ellipsis.MarktSelectSearch.childparams.PremiseName = this.getControlValue('PremiseName');
        this.ellipsis.MarktSelectSearch.childparams.PremisePostcode = this.getControlValue('PremisePostcode');
        this.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine1 = this.getControlValue('PremiseAddressLine1');
        this.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine2 = this.getControlValue('PremiseAddressLine2');
        this.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine3 = this.getControlValue('PremiseAddressLine3');
        this.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine4 = this.getControlValue('PremiseAddressLine4');
        this.ellipsis.MarktSelectSearch.childparams.countryCode = this.getControlValue('PremiseAddressLine5');
        this.ellipsis.MarktSelectSearch.childparams.PremiseContactTelephone = this.getControlValue('PremiseContactTelephone');
        this.ellipsis.MarktSelectSearch.childparams.PremiseContactFax = this.getControlValue('PremiseContactFax');
        this.ellipsis.MarktSelectSearch.childparams.PremiseReference = this.getControlValue('PremiseReference');
        this.ellipsis.MarktSelectSearch.childparams.PremiseRegNumber = this.getControlValue('PremiseRegNumber');
        this.ellipsis.MarktSelectSearch.childparams.CustomerTypeCode = this.getControlValue('CustomerTypeCode');
        this.ellipsis.MarktSelectSearch.childparams.BranchNumber = this.utils.getBranchCode();

        this.ellipsis.PostCodeSearch.childparams.PremisePostCode = this.getControlValue('PremisePostcode');
        this.ellipsis.PostCodeSearch.childparams.PremiseAddressLine5 = this.getControlValue('PremiseAddressLine5');
        this.ellipsis.PostCodeSearch.childparams.PremiseAddressLine4 = this.getControlValue('PremiseAddressLine4');
        this.ellipsis.PostCodeSearch.childparams.BranchNumber = this.utils.getBranchCode();

        this.ellipsis.AUPostCodeSearch.childparams.PremisePostCode = this.getControlValue('PremisePostcode');
        this.ellipsis.AUPostCodeSearch.childparams.PremiseAddressLine5 = this.getControlValue('PremiseAddressLine5');
        this.ellipsis.AUPostCodeSearch.childparams.PremiseAddressLine4 = this.getControlValue('PremiseAddressLine4');

        this.ellipsis.SalesAreaSearchComponent.childparams.ServiceBranchNumber = this.parent.getControlValue('ServiceBranchNumber');
    }

    public focusSave(obj: any): void {
        this.riTab.focusNextTab(obj);
    }

    public canDeactivate(): Observable<boolean> {
        this.checkFormStatus();
        return super.canDeactivate();
    }

    public primaryFieldsEnableDisable(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.parent.disablePremiseNumber();
            this.riMaintenance.DisableInput('menu');
        } else {
            this.parent.enablePremiseNumber();
            this.riMaintenance.EnableInput('menu');
        }
    }

    public fieldValidateTransform(event: any): void {
        let retObj = this.utils.fieldValidateTransform(event);
        this.setControlValue(retObj.id, retObj.value);
        if (!retObj.status) {
            this.riExchange.riInputElement.markAsError(this.uiForm, retObj.id);
        }
    }

    public servicePrimaryError(data: any): void {
        let retainParams = {
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            AccountNumber: this.getControlValue('AccountNumber')
        };
        this.initialFormState(false, false);
        setTimeout(() => {
            this.setControlValue('ContractNumber', retainParams.ContractNumber);
            this.setControlValue('ContractName', retainParams.ContractName);
            this.setControlValue('AccountNumber', retainParams.AccountNumber);
            this.setControlValue('PremiseNumber', '');
            this.enablePremiseNumber();
        }, 300);
    }

    //Override OpenFieldCR
    public overrideOpenFieldCR(): void {
        setTimeout(() => {
            this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'disabled', true);
            this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
            this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'disabled', true);
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        }, 200);
    }

    public gridHandle = '';
    public getGridHandle(): string {
        if (!this.gridHandle) this.gridHandle = this.setGridHandle();
        return this.gridHandle;
    }
    public setGridHandle(): string {
        this.gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();
        return this.gridHandle;
    }

    public handleProductSalesBack(qParams: any): void {
        let queryObj = {};
        for (let i = 0; i < qParams.length; i++) {
            let keyVal = qParams[i].split('=');
            queryObj[keyVal[0]] = keyVal[1];
        }
        this.navigate(queryObj['parentMode'], this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
            contractTypeCode: queryObj['contractTypeCode'],
            ContractNumber: queryObj['ContractNumber'],
            PremiseNumber: queryObj['PremiseNumber']
        });
    }
}
