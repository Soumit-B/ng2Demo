import { PremiseMaintenanceComponent } from './iCABSAPremiseMaintenance';
import { PremiseMaintenanceAddrRes } from './iCABSAPremiseMaintenanceAddrRes';
import { PremiseMaintenanceAddrRes2 } from './iCABSAPremiseMaintenanceAddrRes2';
import { PremiseMaintenanceAddrRes3 } from './iCABSAPremiseMaintenanceAddrRes3';

import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { RiExchange } from './../../../shared/services/riExchange';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { MessageConstant } from './../../../shared/constants/message.constant';

export class PremiseMaintenanceAddrRes1 {
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
        this.sysCharConstants = this.parent.sysCharConstants;
        this.riExchange = this.parent.riExchange;
        this.riMaintenance = this.parent.riMaintenance;
        this.riTab = this.parent.riTab;
    }

    public killSubscription(): void {
        // this.logger.log('PremiseMaintenanceAddrRes1 killSubscription');
        // if (this.subSysChar) { this.subSysChar.unsubscribe(); }
    }

    public vbEnableInstallsRemovals: string = '';
    public vbEnableLocations: string = '';

    public WindowPath: string = '';
    public PremiseAdded: string = '';
    public blnIgnore: boolean = false;
    public blnNoFire: string = '';
    public blnShowInvoiceNarrativeTab: string = '';

    public window_onload(): void {
        this.pgPM_AR = this.parent.pgPM_AR;
        this.pgPM_AR1 = this.parent.pgPM_AR1;
        this.pgPM_AR2 = this.parent.pgPM_AR2;
        this.pgPM_AR3 = this.parent.pgPM_AR3;

        this.logger.log('PremiseMaintenanceAddrRes1 window_onload: ', this.pageParams, this.pageParams.CurrentContractType, this.pageParams.CurrentContractTypeLabel);
        this.getSysCharDtetails();
    }

    public getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableDiscountCode,
            this.sysCharConstants.SystemCharEnableLocations,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableAddressLine3, //Logical
            this.sysCharConstants.SystemCharEnableMapGridReference,
            this.sysCharConstants.SystemCharEnableNationalAccountWarning,
            this.sysCharConstants.SystemCharEnableRetentionOfServiceWeekday,
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharEnableReceiptRequired,
            this.sysCharConstants.SystemCharEnableDrivingCharges,
            this.sysCharConstants.SystemCharMaximumAddressLength, //Integer
            this.sysCharConstants.SystemCharEnableValidatePostcodeSuburb
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.pageParams.vCountryCode,
            SysCharList: sysCharList.toString()
        };
        this.parent.SpeedScript.sysCharPromise(sysCharIP).then((data) => {
            let records = data.records;
            this.pageParams.vEnablePostcodeDefaulting = records[0].Required;
            this.pageParams.vEnableDiscountCode = records[1].Required;
            this.pageParams.vEnableLocations = records[2].Required;
            this.pageParams.vEnableInstallsRemovals = records[3].Required;
            this.pageParams.vEnableAddressLine3 = records[4].Required; //Logical
            this.pageParams.vSCAddressLine3Logical = records[4].Logical;
            this.pageParams.vEnableMapGridReference = records[5].Required;
            this.pageParams.vEnableNationalAccountWarning = records[6].Required;
            this.riExchange.updateCtrl(this.controls, 'NationalAccountChecked', 'value', this.pageParams.vEnableNationalAccountWarning);
            this.parent.setControlValue('NationalAccountChecked', this.pageParams.vEnableNationalAccountWarning);

            this.pageParams.vEnableRetentionOfServiceWeekDay = records[7].Required;
            this.pageParams.vSCEnableHopewiserPAF = records[8].Required;
            this.pageParams.vSCEnableDatabasePAF = records[9].Required;
            this.pageParams.vSCAddressLine4Required = records[10].Required;
            this.pageParams.vSCAddressLine5Required = records[11].Required;
            this.pageParams.vSCPostCodeRequired = records[12].Required;
            this.pageParams.vSCPostCodeMustExistInPAF = records[13].Required;
            this.pageParams.vSCRunPAFSearchOn1stAddressLine = records[14].Required;
            this.pageParams.vSCServiceReceiptRequired = records[15].Required;
            this.pageParams.vSCEnableDrivingCharges = records[16].Required;
            this.pageParams.vEnableMaximumAddressLength = records[17].Integer;
            this.pageParams.vMaximumAddressLength = records[17].Integer;
            this.pageParams.vSCEnableValidatePostcodeSuburb = records[18].Required;

            //this.logger.log('PremiseMaintenanceAddrRes1 getSysCharDtetails:', data, this.pageParams);

            if (!(this.pageParams.vSCEnableHopewiserPAF || this.pageParams.vSCEnableDatabasePAF)) {
                this.uiDisplay.cmdGetAddress = false;
            }

            this.renderPrimaryFields();
        });
    }

    public renderPrimaryFields(): void {
        this.logger.log('PremiseMnt -renderPrimaryFields',
            this.pageParams, this.formData, this.pageParams.ParentMode,
            'Mode:', this.riMaintenance.CurrentMode, this.parent.isReturning());

        if (!this.parent.isReturning()) {
            if (this.parent.CBBupdated) {
                this.parent.CBBupdated = false;
                this.parent.updateButton(); //Update UI buttons with text
            } else {
                let vntReturnData: string = '';
                switch (this.pageParams.ParentMode) {
                    case 'CSearch':
                    case 'CSearchAdd':
                    case 'IGSearch':
                    case 'Contract':
                    case 'Contract-Add':
                    case 'Contact':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        //TODO - input required
                        // if (this.riExchange.RowSelected()) {
                        //     vntReturnData = this.riExchange.GetReturnData();
                        //     this.controls.PremiseNumber.value = this.riExchange.getParentHTMLValue('PremiseNumber', '', vntReturnData(0));
                        //     this.controls.PremiseName.value = this.riExchange.getParentHTMLValue('PremiseName', '', vntReturnData(1));
                        //     if (this.pageParams.ParentMode === 'IGSearch') {
                        //         this.riExchange.getParentHTMLValue('ContractNumber', '', vntReturnData(2));
                        //     }
                        // }
                        break;
                    case 'ProductSalesDelivery':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        break;
                    case 'ServiceCover':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseName', 'value', this.riExchange.getParentHTMLValue('PremiseName'));
                        break;
                }

                switch (this.pageParams.CurrentContractType) {
                    case 'J':
                    case 'P':
                        this.uiDisplay.labelDiscountCode = false;
                        this.uiDisplay.DiscountCode = false;
                        this.uiDisplay.DiscountDesc = false;
                        this.uiDisplay.tdCustomerInfo = false;
                        break;
                }

                this.uiDisplay.labelInactiveEffectDate = false;
                this.uiDisplay.InactiveEffectDate = false;
                this.uiDisplay.AnyPendingBelow = false;
                this.riExchange.updateCtrl(this.controls, 'cmdGetAddress', 'disabled', true);

                switch (this.pageParams.ParentMode) {
                    case 'Request':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.uiDisplay.grdPremiseMaintenanceControl = false;
                        break;
                    case 'LoadByKeyFields':
                    case 'PortfolioGeneralMaintenance':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseName', 'value', this.riExchange.getParentHTMLValue('PremiseName'));
                        break;
                }

                switch (this.pageParams.ParentMode) {
                    case 'ServicePlanning':
                    case 'AreaReallocation':
                    case 'ServiceAreaSequence':
                    case 'GroupServiceVisit':
                    case 'VisitDateDiscrepancy':
                    case 'ServiceVisitHistory':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID')); //TODO
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'PortfolioNoTurnover':
                    case 'ServiceStatsAdjust':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID')); //TODO
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'ContractExpiryGrid':
                    case 'SuspendServiceandInvoice':
                    case 'ContractPOExpiryGrid':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('RowID')); //TODO
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'Release':
                    case 'Summary':
                    case 'ProRataCharge':
                    case 'ServiceVisitEntryGrid':
                    case 'ServiceValueEntryGrid':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID')); //TODO
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'GridCopySearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID')); //TODO
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'Bonus':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID')); //TODO
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'LostBusinessAnalysis':
                    case 'InvoiceReleased':
                    case 'StaticVisit':
                    case 'PortfolioReports':
                    case 'SalesCommissionOnSale':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'Entitlement':
                    case 'Verification':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                }

                switch (this.pageParams.ParentMode) {
                    case 'CSearch':
                    case 'Contract':
                    case 'Contract-Add':
                    case 'Contact':
                        this.blnIgnore = true;
                        this.riMaintenance.AddMode();
                        this.blnIgnore = false;
                        break;
                    case 'CSearchAdd':
                        this.parent.focusField('PremiseCommenceDate');
                        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseCommenceDate', false);
                        break;
                    case 'GeneralSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('RowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'AccountPremiseSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('RowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'GridSearch':
                        this.riExchange.getParentHTMLValue('ContractNumber');
                        this.riExchange.getParentHTMLValue('ContractName');
                        this.riExchange.getParentHTMLValue('PremiseNumber');
                        this.riExchange.getParentHTMLValue('PremiseName');
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'GridCopySearch':
                        this.riExchange.getParentHTMLValue('ContractNumber');
                        this.riExchange.getParentHTMLValue('GridPremiseNumber');
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'StockEstimatesSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'TreatmentcardRecallSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'GridSearchAdd':
                        this.riExchange.getParentHTMLValue('ContractNumber');
                        this.riExchange.getParentHTMLValue('ContractName');
                        this.riMaintenance.AddMode();
                        this.parent.focusField('PremiseCommenceDate');
                        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseCommenceDate', false);
                        break;
                }
            }
        } else {
            for (let i in this.formData) {
                if (i) {
                    this.riExchange.updateCtrl(this.controls, i, 'value', this.formData[i]);
                }
            }
        }

        this.parent.updateButton();

        //Disable primary fields based on various condition
        if (!this.pageParams.shouldOpen) {
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.parent.disablePremiseNumber();
            } else {
                this.parent.enablePremiseNumber();
            }
        }

        this.uiDisplay.tdCustomerInfo = false;
        this.pgPM_AR2.SetSCVariables();
        this.pgPM_AR2.SetHTMLPageSettings(this);
        this.pgPM_AR3.AddTabs();
        this.pgPM_AR2.BuildMenuOptions();
        this.riExchange.renderForm(this.uiForm, this.controls);
        if (this.parent.pageParams.shouldOpen) {
            this.parent.isRequestingInitial = false;
            this.parent.contractNumberEllipsis.openModal();
            this.pageParams.shouldOpen = false;
        }
        this.init();
    }

    public init(): void {
        this.logger.log('INIT inside PM_AR1');
        this.parent.setControlValue('ContractTypeCode', this.pageParams.CurrentContractType);
        this.logger.log(this.riMaintenance.CurrentMode, '|', 'ParentMode', this.pageParams.ParentMode, '|',
            'ContractNumber', this.parent.getControlValue('ContractNumber'), '|',
            'PremiseNumber', this.parent.getControlValue('PremiseNumber'), '|',
            'PremiseRowID', this.parent.getControlValue('PremiseRowID'), '|',
            'ContractTypeCode', this.parent.getControlValue('ContractTypeCode'), '|',
            'CurrentContractType', this.pageParams.CurrentContractType
        );

        //Check if ContractNo & PremiseNo is not blank
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.parent.getControlValue('ContractNumber') === '') {
                if (this.parent.getControlValue('PremiseRowID') === '') {
                    this.parent.initialFormState(true, false);
                    return;
                }
            }
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.parent.getControlValue('ContractNumber') === '' || this.parent.getControlValue('PremiseNumber') === '') {
                if (this.parent.getControlValue('PremiseRowID') === '') {
                    // this.parent.PremiseNumberSelection_onkeydown({ explicitOpen: true }); //Explicitly open Premise Search Modal
                    this.parent.initialFormState(true, false);
                    return;
                }
            }
        }

        this.logger.log('-------------------------------------');
        this.parent.isRequestingInitial = true;
        this.parent.overrideOpenFieldCR();
        this.parent.setControlValue('ContractTypeCode', this.pageParams.CurrentContractType);
        this.parent.enableControls(); //Enable Basic Control
        this.parent.primaryFieldsEnableDisable();
        this.parent.setFormMode(this.parent.c_s_MODE_SELECT);
        this.parent.lErrorMessageDesc = [];

        let strDocTitle = this.pageParams.CurrentContractTypeLabel + ' Premises Entry';
        let strTabTitle = this.pageParams.CurrentContractTypeLabel + ' Premises Maintenance';
        let strInpTitle = this.pageParams.CurrentContractTypeLabel + ' Number';
        // this.utils.setTitle(strDocTitle);

        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.CustomBusinessObject = 'iCABSPremiseEntryAddrRes.p';
        this.riMaintenance.CustomBusinessObjectSelect = true;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = true;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionDelete = false;
        this.riMaintenance.DisplayMessages = true;

        if (this.pageParams.ParentMode === 'ProductSalesDelivery') {
            this.uiDisplay.grdPremiseMaintenanceControl = false;
        }

        if (this.pageParams.ParentMode === 'CSearch' || this.pageParams.ParentMode === 'CSearchAdd' || this.pageParams.ParentMode === 'IGSearch') {
            this.riMaintenance.FunctionSearch = false;
        }

        if (this.pageParams.ParentMode === 'ServiceCover') {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSelect = false;
        }

        if (this.riExchange.URLParameterContains('pgm')) {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSelect = false;
        }

        // '************************************************************************************
        // '* Add Table Premise                                                                *
        // '************************************************************************************
        this.riMaintenance.AddTable('Premise');
        switch (this.pageParams.ParentMode) {
            case 'CSearch':
            case 'CSearchAdd':
            case 'IGSearch':
            case 'Contract':
            case 'Contract-Add':
            case 'Contact':
            case 'GridSearch':
            case 'GridSearchAdd':
            case 'ServiceCover':
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                break;
            default:
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        }

        this.riMaintenance.AddTableKeyAlignment('ContractNumber', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeAutoNumber, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('PremiseRowID', MntConst.eTypeAutoNumber, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableField('NationalAccount', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');

        this.riMaintenance.AddTableField('AccountNumber', MntConst.eTypeCodeNumeric, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('AccountNumber', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PremiseCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableFieldAlignment('PremiseCommenceDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableField('PremiseName', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseAddressLine1', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseAddressLine2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');

        if (this.pageParams.vSCAddressLine3Logical) {
            this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        } else {
            this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }

        this.riMaintenance.AddTableField('PremiseAddressLine4', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Requried');
        this.riMaintenance.AddTableField('PremisePostcode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('DrivingChargeValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactName', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactPosition', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactTelephone', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactMobile', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactFax', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactEmail', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('InvoiceGroupNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('DiscountCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableFieldAlignment('DiscountCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('ServiceBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('CustomerTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldAlignment('CustomerTypeCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('SalesAreaCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'LookUp');
        this.riMaintenance.AddTableFieldAlignment('SalesAreaCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PremiseSalesEmployee', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('PremiseSalesEmployee', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PurchaseOrderNo', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ClientReference', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseDirectoryName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseDirectoryPage', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseDirectoryGridRef', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseSpecialInstructions', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseSRADate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseSRAEmployee', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'LookUp');
        this.riMaintenance.AddTableFieldAlignment('PremiseSRAEmployee', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('LostBusinessRequestNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('InvoiceSuspendInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('InvoiceSuspendInd', false);
        this.riMaintenance.AddTableField('InvoiceSuspendText', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('InvoiceSuspendText', false);
        this.riMaintenance.AddTableField('RetainServiceWeekdayInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceReceiptRequired', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseRowID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableCommit(this, (data: any): any => {
            if (data && data.hasError) { //DATA error
                this.parent.servicePrimaryError(data);
            }

            this.initiateVirtualTable();

            //Update Ellipsis parameters
            this.parent.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.parent.getControlValue('ContractNumber');
            this.parent.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.parent.getControlValue('ContractName');
            this.parent.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.parent.getControlValue('AccountNumber');
            this.parent.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountNumber = this.parent.getControlValue('AccountNumber');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.AccountNumber = this.parent.getControlValue('AccountNumber');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.ContractNumber = this.parent.getControlValue('ContractNumber');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.ContractName = this.parent.getControlValue('ContractName');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.SearchPostcode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseName = this.parent.getControlValue('PremiseName');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine1 = this.parent.getControlValue('PremiseAddressLine1');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine2 = this.parent.getControlValue('PremiseAddressLine2');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine3 = this.parent.getControlValue('PremiseAddressLine3');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine4 = this.parent.getControlValue('PremiseAddressLine4');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine5 = this.parent.getControlValue('PremiseAddressLine5');
            this.parent.ellipsis.siteReferenceEllipsis.childparams.PremisePostcode = this.parent.getControlValue('PremisePostcode');

            this.pageParams.PremiseAddressLine1Orignal = this.parent.getControlValue('PremiseAddressLine1');
            this.pageParams.PremiseAddressLine2Orignal = this.parent.getControlValue('PremiseAddressLine2');
            this.pageParams.PremiseAddressLine3Orignal = this.parent.getControlValue('PremiseAddressLine3');
            this.pageParams.PremiseAddressLine4Orignal = this.parent.getControlValue('PremiseAddressLine4');
            this.pageParams.PremiseAddressLine5Orignal = this.parent.getControlValue('PremiseAddressLine5');
            this.pageParams.PremisePostcodeOrignal = this.parent.getControlValue('PremisePostcode');
            this.pageParams.HaveResolved = true;
            this.pageParams.PBusinessCode = this.utils.getBusinessCode();

            let fields = 'AccessFrom1, AccessFrom2, AccessFrom3, AccessFrom4, AccessFrom5, AccessFrom6, AccessFrom7, AccessFrom8, AccessFrom9, AccessFrom10, AccessTo1, AccessTo2, AccessTo3, AccessTo4, AccessTo5, AccessTo6, AccessTo7, AccessTo8, AccessTo9, AccessTo10'.split(', ');
            fields.map((value: string, index: number, array: string[]) => {
                if (this.parent.getControlValue(value) === '00:00') {
                    this.parent.setControlValue(value, '');
                }
            });
        }, 'Mode=NewUI');

        // '************************************************************************************
        // '* Add Table ' * '                                                                  *
        // '************************************************************************************
        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('PremiseRowID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('Premise', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('CustomerInfoAvailable', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('CustomerInfoAvailable', false);
        this.riMaintenance.AddTableField('PremiseAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('PremiseAnnualValue', false);
        this.riMaintenance.AddTableField('NegBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('NegBranchNumber', false);
        this.riMaintenance.AddTableField('NegBranchName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('NegBranchName', false);
        this.riMaintenance.AddTableField('NationalAccountBranch', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('NationalAccountBranch', false);
        this.riMaintenance.AddTableField('Status', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('Status', false);
        this.riMaintenance.AddTableField('InactiveEffectDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('InactiveEffectDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableFieldPostData('InactiveEffectDate', false);
        this.riMaintenance.AddTableField('LostBusinessDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('LostBusinessDesc', false);
        this.riMaintenance.AddTableField('DisableList', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ContractTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AccountName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ShowValueButton', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('ShowValueButton', false);
        this.riMaintenance.AddTableField('NewContract', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AnyPendingBelow', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('AnyPendingBelow', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableFieldPostData('AnyPendingBelow', false);
        this.riMaintenance.AddTableField('ErrorMessageDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldPostData('ErrorMessageDesc', false);
        this.riMaintenance.AddTableField('CreateNewInvoiceGroupInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('InvoiceNarrativeText', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('DrivingChargeInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('MapStreetNo', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapStreetName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapStreetType', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapSuburb', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapState', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapPostCode', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapLatitude', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapLongitude', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('ServiceTimeAdj', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceAdjHrs', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceAdjMins', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseType', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('ProofOfServFax', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('PosFax', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('ProofOfServSMS', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('PosSMS', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('ProofOfServEmail', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('PosEmail', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyFax', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyFaxDetail', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifySMS', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifySMSDetail', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyPhone', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyPhoneDetail', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyEmail', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyEmailDetail', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyDaysBefore', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('NotifyLine', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyText', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('Monday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Tuesday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Wednesday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Thursday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Friday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Saturday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Sunday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');

        this.riMaintenance.AddTableField('EmployeeCode1', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname1', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc1', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority1', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks1', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('EmployeeCode2', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority2', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks2', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('EmployeeCode3', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority3', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks3', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('EmployeeCode4', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname4', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc4', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority4', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks4', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('EmployeeCode5', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname5', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc5', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority5', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks5', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('EmployeeCode6', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname6', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc6', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority6', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks6', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('EmployeeCode7', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname7', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc7', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority7', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks7', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('EmployeeCode8', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname8', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc8', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority8', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks8', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('EmployeeCode9', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname9', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc9', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority9', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks9', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('EmployeeCode10', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname10', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc10', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority10', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks10', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableField('DateFrom1', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo1', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId1', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom2', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo2', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId2', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom3', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo3', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId3', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom4', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo4', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId4', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom5', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo5', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId5', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom6', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo6', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId6', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom7', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo7', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId7', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom8', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo8', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId8', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom9', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo9', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId9', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom10', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo10', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId10', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom1', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo1', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom2', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo2', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom3', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo3', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom4', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo4', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom5', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo5', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom6', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo6', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom7', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo7', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom8', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo8', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom9', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo9', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom10', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo10', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableCommit(this);

        this.riExchange.riInputElement.Disable(this.uiForm, 'Status');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InactiveEffectDate');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LostBusinessDesc');

        // '************************************************************************************
        // '* Setup Tab Sections                                                               *
        // '************************************************************************************
        this.pgPM_AR3.AddTabs();
        this.pgPM_AR3.ShowInvoiceNarrativeTab();

        // '************************************************************************************
        // '* Fetch Record (if (selected) and Default Mode (Add, Update etc.)                  *
        // '************************************************************************************
        if (this.riMaintenance.RecordSelected(false)) {
            this.riMaintenance.FetchRecord();
        }

        this.pgPM_AR2.BuildMenuOptions();

        if (this.parent.getControlValue('ContractNumber') === '') {
            this.uiDisplay.cmdGetLatAndLong = true;
        }

        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riExchange_CBORequest();
        }

        this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this.pgPM_AR1, this.pgPM_AR2, this.pgPM_AR3, this.parent]);
    }

    private initiateVirtualTable(): void {
        // '************************************************************************************
        // '* Add Virtual Tables                                                               *
        // '************************************************************************************
        switch (this.pageParams.ParentMode) {
            case 'CSearch':
            case 'CSearchAdd':
            case 'IGSearch':
            case 'Contract':
            case 'Contract-Add':
            case 'Contact':
            case 'GridSearch':
            case 'GridSearchAdd':
                this.riMaintenance.AddVirtualTable('Contract');
                this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
                this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
                this.riMaintenance.AddVirtualTableCommit(this);
                break;
            default:
                this.riMaintenance.AddVirtualTable('Contract');
                this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
                this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
                this.riMaintenance.AddVirtualTableCommit(this);
                break;
        }

        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.riMaintenance.AddVirtualTable('InvoiceGroup');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('InvoiceGroupNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('InvoiceGroupDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.riMaintenance.AddVirtualTable('Account');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('NationalAccount', MntConst.eTypeCheckBox, MntConst.eVirtualFieldStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this, (data: any): any => {
                setTimeout(() => {
                    this.riExchange.updateCtrl(this.controls, 'NationalAccountChecked', 'value', this.pageParams.vEnableNationalAccountWarning);
                    this.parent.setControlValue('NationalAccountChecked', this.pageParams.vEnableNationalAccountWarning);

                    if (this.riExchange.riInputElement.checked(this.uiForm, 'NationalAccountChecked') //Checkbox
                        && this.riExchange.riInputElement.checked(this.uiForm, 'NationalAccount')) { //Checkbox
                        this.uiDisplay.tdNationalAccount = true;
                    } else {
                        this.uiDisplay.tdNationalAccount = false;
                    }
                    this.parent.updateEllipsisParams();
                }, 500);
            });

            this.riMaintenance.AddVirtualTable('SalesArea');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('BranchNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceBranchNumber', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('SalesAreaCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('SalesAreaDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.riMaintenance.AddVirtualTable('Discount');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('DiscountCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('DiscountDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.riMaintenance.AddVirtualTable('Branch');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('BranchNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceBranchNumber', 'Virtual');
            this.riMaintenance.AddVirtualTableField('BranchName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.riMaintenance.AddVirtualTable('Employee');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'PremiseSalesEmployee', 'Virtual');
            this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'SalesEmployeeSurname');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.riMaintenance.AddVirtualTable('Employee', 'PremiseSRAEmployee');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'PremiseSRAEmployee', 'Virtual');
            this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'SRAEmployeeSurname');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.riMaintenance.AddVirtualTable('CustomerTypeLanguage');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('CustomerTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('CustomerTypeDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);

            this.iefAddCustomVirtuals(); //TODO - Functionality not Present - Add any extension virtual tables
        }
    }

    // '************************************************************************************
    // '* Search                                                                           *
    // '************************************************************************************
    public riMaintenance_Search(): void {
        let ContractNumber = this.parent.getControlValue('ContractNumber');
        let PremiseNumber = this.parent.getControlValue('PremiseNumber');
        if (ContractNumber === '') {
            //TODO - Open elipsis
            // this.ContractNumberSelection
            // this.ContractNumberSelection.focus();
        }

        if (ContractNumber !== '' && PremiseNumber === '') {
            //TODO - Open elipsis
            // this.PremiseNumberSelection
            // this.ContractNumberSelection.focus();
        }
    }

    // '************************************************************************************
    // '* BEFORE SELECT (Hide fields)                                                      *
    // '************************************************************************************
    public riMaintenance_BeforeSelect(): void {
        this.uiDisplay.tdCustomerInfo = false;
        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.LostBusinessDesc = false;
        this.uiDisplay.cmdValue = false;
        this.uiDisplay.tdPremiseAnnualValueLab = false;
        this.uiDisplay.tdPremiseAnnualValue = false;
        this.pgPM_AR3.AddTabs();
    }

    // '************************************************************************************
    // '* BEFORE FETCH (Check contract type valid)                                         *
    // '************************************************************************************
    public riMaintenance_BeforeFetch(): void {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ContractTypeCode=' + this.pageParams.CurrentContractType;
    }

    // '************************************************************************************
    // '* AFTER FETCH                                                                      *
    // '************************************************************************************
    public riMaintenance_AfterFetch(): void {
        this.pageParams.PremiseAddressLine1Orignal = this.parent.getControlValue('PremiseAddressLine1');
        this.pageParams.PremiseAddressLine2Orignal = this.parent.getControlValue('PremiseAddressLine2');
        this.pageParams.PremiseAddressLine3Orignal = this.parent.getControlValue('PremiseAddressLine3');
        this.pageParams.PremiseAddressLine4Orignal = this.parent.getControlValue('PremiseAddressLine4');
        this.pageParams.PremiseAddressLine5Orignal = this.parent.getControlValue('PremiseAddressLine5');
        this.pageParams.PremisePostcodeOrignal = this.parent.getControlValue('PremisePostcode');
        this.pageParams.HaveResolved = true;
        this.pageParams.PBusinessCode = this.utils.getBusinessCode();
        this.uiDisplay.cmdGetLatAndLong = true;

        let fields = 'AccessFrom1, AccessFrom2, AccessFrom3, AccessFrom4, AccessFrom5, AccessFrom6, AccessFrom7, AccessFrom8, AccessFrom9, AccessFrom10, AccessTo1, AccessTo2, AccessTo3, AccessTo4, AccessTo5, AccessTo6, AccessTo7, AccessTo8, AccessTo9, AccessTo10'.split(', ');
        fields.map((value: string, index: number, array: string[]) => {
            if (this.parent.getControlValue(value) === '00:00') {
                this.parent.setControlValue(value, '');
            }
        });

        if (this.parent.getControlValue('InactiveEffectDate') !== '') {
            this.uiDisplay.labelInactiveEffectDate = true;
            this.uiDisplay.InactiveEffectDate = true;
            if (this.parent.getControlValue('LostBusinessDesc') !== '') {
                this.uiDisplay.LostBusinessDesc = true;
            } else {
                this.uiDisplay.LostBusinessDesc = false;
            }
        }
        else {
            this.uiDisplay.labelInactiveEffectDate = false;
            this.uiDisplay.InactiveEffectDate = false;
            this.uiDisplay.LostBusinessDesc = false;
        }

        if (this.parent.getControlValue('AnyPendingBelow') !== '') {
            this.uiDisplay.AnyPendingBelow = true;
        } else {
            this.uiDisplay.AnyPendingBelow = false;
        }

        if (this.riExchange.riInputElement.checked(this.uiForm, 'ShowValueButton')) {
            this.uiDisplay.cmdValue = true;
        } else {
            this.uiDisplay.cmdValue = false;
        }

        //Hide Premise Annual Value if (this user does not have full access and they do not belong to the neg or service branch
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full'
            || this.riExchange.ClientSideValues.Fetch('BranchNumber') === this.parent.getControlValue('ServiceBranchNumber')
            || this.riExchange.ClientSideValues.Fetch('BranchNumber') === this.parent.getControlValue('NegBranchNumber')
        ) {
            this.uiDisplay.tdPremiseAnnualValueLab = true;
            this.uiDisplay.tdPremiseAnnualValue = true;
        } else {
            this.uiDisplay.tdPremiseAnnualValueLab = false;
            this.uiDisplay.tdPremiseAnnualValue = false;
        }

        if (this.parent.getControlValue('NationalAccountChecked') === 'true' &&
            this.parent.getControlValue('NationalAccount') === 'true') {
            this.uiDisplay.tdNationalAccount = true;
        } else {
            this.uiDisplay.tdNationalAccount = false;
        }

        if (this.parent.getControlValue('CustomerInfoAvailable') === 'true') {
            this.uiDisplay.tdCustomerInfo = true;
        } else {
            this.uiDisplay.tdCustomerInfo = false;
        }

        if (this.pageParams.vSCEnableDrivingCharges && this.parent.getControlValue('DrivingChargeInd') === 'true' && this.pageParams.CurrentContractType !== 'P') {
            this.uiDisplay.tdDrivingChargeValueLab = true;
            this.uiDisplay.tdDrivingChargeValue = true;
        } else {
            this.uiDisplay.tdDrivingChargeValueLab = false;
            this.uiDisplay.tdDrivingChargeValue = false;
        }

        this.pgPM_AR3.AddTabs();
        this.pgPM_AR3.ShowInvoiceNarrativeTab();
    }

    // '************************************************************************************
    // '* BEFORE MODE                                                                      *
    // '************************************************************************************
    public riMaintenance_BeforeMode(): void {
        this.logger.log('DEBUG --- riMaintenance_BeforeMode called');
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.pageParams.HaveResolved = true;
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetLatAndLong');
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetAddress');
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdValue');
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeNormal) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdGetAddress');
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdValue');
            this.pgPM_AR3.AddTabs();
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.uiDisplay.labelInactiveEffectDate = false;
            this.uiDisplay.InactiveEffectDate = false;
            this.uiDisplay.cmdValue = false;
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdValue');
            this.pgPM_AR3.AddTabs();
            this.pgPM_AR3.ShowInvoiceNarrativeTab();
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetLatAndLong');
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeNormal) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdGetLatAndLong');
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetLatAndLong');
        }
    }

    // '************************************************************************************
    // '* BEFORE ADD MODE                                                                  *
    // '************************************************************************************
    public riMaintenance_BeforeAddMode(): void {
        this.logger.log('DEBUG --- riMaintenance_BeforeAddMode called');
        this.parent.setControlValue('Saturday', true);
        this.parent.setControlValue('Sunday', true);
        this.parent.setControlValue('PremiseType', 'NS');
        this.parent.setControlValue('NotifyLine', 'NOTIFICATION OF INITIAL HEALTHCARE SERVICE');

        this.pgPM_AR3.AddTabs();
        this.parent.focusField('PremiseCommenceDate');
        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetAddress');
        this.parent.setControlValue('ContractTypeCode', this.pageParams.CurrentContractType);
        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.LostBusinessDesc = false;

        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetDefaultDiscountCode';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            this.parent.isRequestingInitial = false;
            this.logger.log('CBORequestExecute:', data);
        });

        if (this.pageParams.ParentMode === 'Contact') {
            this.riExchange.getParentHTMLValue('LostBusinessRequestNumber');
        }
        if (this.pageParams.CurrentContractType === 'P') {
            this.riMaintenance.DisableInput('PremiseCommenceDate'); this.parent.dateDisable('PremiseCommenceDate', true, true);
        } else {
            this.riMaintenance.EnableInput('PremiseCommenceDate'); this.parent.dateDisable('PremiseCommenceDate', false, true);
        }
        if (this.pageParams.CurrentContractType === 'C' || this.pageParams.CurrentContractType === 'J') {
            this.parent.attributes.RenegContract = false;
            this.parent.attributes.ContractNumber = '';
            this.parent.attributes.PremiseNumber = '';
            this.uiDisplay.tdDrivingChargeValueLab = false;
            this.uiDisplay.tdDrivingChargeValue = false;
        }
        if (this.pageParams.ParentMode === 'CSearch'
            || this.pageParams.ParentMode === 'CSearchAdd'
            || this.pageParams.ParentMode === 'IGSearch'
            || this.pageParams.ParentMode === 'Contract-Add'
            || this.pageParams.ParentMode === 'Contact') {
            if (this.pageParams.CurrentContractType !== 'P') {
                this.parent.focusField('PremiseCommenceDate');
            } else {
                this.parent.focusField('PremiseName');
            }
        }
        else {
            this.parent.focusField('ContractNumber');
        }
    }

    // '************************************************************************************
    // '* BEFORE UPDATE MODE                                                               *
    // '************************************************************************************
    public riMaintenance_BeforeUpdateMode(): void {
        this.riMaintenance.DisableInput('PremiseCommenceDate'); this.parent.dateDisable('PremiseCommenceDate', true, false);
        if (this.parent.getControlValue('NationalAccountBranch') === 'false') {
            if (this.riExchange.ClientSideValues.Fetch('BranchNumber') !== this.parent.getControlValue('ServiceBranchNumber')) {
                this.riMaintenance.DisableInput('SalesAreaCode');
            }
            if (this.pageParams.CurrentContractType === 'P') {
                this.riMaintenance.DisableInput('ServiceBranchNumber');
            }
        }
        this.pageParams.HaveResolved = true;
        this.parent.isRequestingInitial = false;
    }

    // '************************************************************************************
    // '* C B O  REQUESTS                                                                  *
    // '************************************************************************************
    public riExchange_CBORequest(): void {
        this.logger.log('DEBUG --- riExchange_CBORequest');
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber') || this.parent.getControlValue('PremiseName') === '') {
                //Default the premise commence date to contract commence date if (adding a job or product sales
                if (this.pageParams.ParentMode === 'Contract-Add' || this.pageParams.CurrentContractType === 'J') {
                    this.parent.setControlValue('NewContract', true); //'yes'
                } else {
                    this.parent.setControlValue('NewContract', false); //'no'
                }
                this.parent.setControlValue('ContractTypeCode', this.pageParams.CurrentContractType);

                //Make request to get defaults from Contract
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetContractDefaults';
                this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.CBORequestAdd('ContractNumber');
                this.riMaintenance.CBORequestAdd('ContractTypeCode');
                this.riMaintenance.CBORequestAdd('NewContract');
                this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                    this.riMaintenance.renderResponseForCtrl(this, data);

                    this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'ContractNumber');

                    if (this.parent.getControlValue('CreateNewInvoiceGroupInd')) {
                        this.parent.setControlValue('InvoiceGroupNumber', '');
                        this.riMaintenance.DisableInput('InvoiceGroupNumber');
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', false);
                    }
                    else {
                        this.riMaintenance.EnableInput('InvoiceGroupNumber');
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', true);
                    }
                });
            }

            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseCommenceDate')
                || this.parent.getControlValue('PremiseCommenceDate') !== ''
                && this.parent.getControlValue('ContractNumber') !== '') {
                //Validate PremiseCommenceDate is an anniversary date
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnAnniversaryDate';
                this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.CBORequestAdd('ContractNumber');
                this.riMaintenance.CBORequestAdd('PremiseCommenceDate');
                this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                    this.logger.log('CBORequestExecute:', data);
                    if (data.hasError) {
                        this.parent.showAlert(data.errorMessage);
                    }
                });
            }
        }

        this.pgPM_AR2.PostcodeDefaultingEnabled({}); //TODO - paramater not proper

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'SalesAreaCode')
            || this.parent.getControlValue('SalesAreaCode') !== ''
            && this.parent.getControlValue('ServiceBranchNumber') !== '') {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=DefaultFromSalesArea';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('ServiceBranchNumber');
            this.riMaintenance.CBORequestAdd('SalesAreaCode');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any { this.logger.log('CBORequestExecute:', data); });
        }

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseSRADate')
            && this.parent.getControlValue('PremiseSRADate') !== '') {
            //Check PremiseSRADate is not greater than today
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnSRADate';
            this.riMaintenance.CBORequestAdd('PremiseSRADate');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                this.logger.log('CBORequestExecute:', data);
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage);
                }
            });
        }

        if (this.parent.getControlValue('CustomerInfoAvailable')) {
            this.uiDisplay.tdCustomerInfo = true;
        } else {
            this.uiDisplay.tdCustomerInfo = false;
        }

        if (this.parent.getControlValue('NationalAccountChecked') && this.parent.getControlValue('NationalAccount')) {
            this.uiDisplay.tdNationalAccount = true;
        } else {
            this.uiDisplay.tdNationalAccount = false;
        }
    }

    public iefAddCustomVirtuals(): void {
        //this.logger.log('iefAddCustomVirtuals');
        //TODO - Function not present in 2 & 3
    }

    public iefAddCustomStarFields(): void {
        //this.logger.log('iefAddCustomStarFields');
        //TODO - Function not present in 2 & 3
    }
}

