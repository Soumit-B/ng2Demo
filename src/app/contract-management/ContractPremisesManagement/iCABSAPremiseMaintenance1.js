import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
export var PremiseMaintenance1 = (function () {
    function PremiseMaintenance1(parent) {
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
    PremiseMaintenance1.prototype.killSubscription = function () { };
    PremiseMaintenance1.prototype.window_onload = function () {
        this.pgPM0 = this.parent.pgPM0;
        this.pgPM1 = this.parent.pgPM1;
        this.pgPM1a = this.parent.pgPM1a;
        this.pgPM2 = this.parent.pgPM2;
        this.pgPM3 = this.parent.pgPM3;
        this.pgPM4 = this.parent.pgPM4;
        this.renderPrimaryFields();
    };
    PremiseMaintenance1.prototype.DeterminePostCodeDefaulting = function (pcdf_blnEnablePostCodeDefaulting) {
        if (pcdf_blnEnablePostCodeDefaulting) {
            if (this.pageParams.excludedBranches.indexOf(this.utils.getBranchCode().toString()) !== -1) {
                return false;
            }
            else {
                return true;
            }
        }
    };
    PremiseMaintenance1.prototype.ZeroPadInt = function (i, numDigits) {
        var str = '00000' + i;
        return str.slice(-numDigits);
    };
    PremiseMaintenance1.prototype.renderPrimaryFields = function () {
        this.logger.log('PremiseMnt -renderPrimaryFields', this.pageParams, this.formData, this.pageParams.ParentMode, 'Mode:', this.riMaintenance.CurrentMode, this.parent.isReturning());
        if (!this.parent.isReturning()) {
            if (this.parent.CBBupdated) {
                this.parent.CBBupdated = false;
                this.parent.updateButton();
            }
            else {
                switch (this.pageParams.ParentMode.trim()) {
                    case 'CSearch':
                    case 'CSearchAdd':
                    case 'IGSearch':
                    case 'Contract':
                    case 'Contract-Add':
                    case 'Contact':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        break;
                    case 'ProductSalesDelivery':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        break;
                    case 'CallCentreSearch':
                    case 'WorkOrderMaintenance':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        break;
                    case 'ServiceCover':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseName', 'value', this.riExchange.getParentHTMLValue('PremiseName'));
                        break;
                    case 'Request':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.uiDisplay.thControl = false;
                        break;
                    case 'LoadByKeyFields':
                    case 'PortfolioGeneralMaintenance':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseName', 'value', this.riExchange.getParentHTMLValue('PremiseName'));
                        break;
                }
                switch (this.pageParams.ParentMode.trim()) {
                    case 'CSearch':
                    case 'Contract':
                    case 'Contract-Add':
                    case 'Contact':
                        this.pageParams.blnIgnore = true;
                        this.riMaintenance.AddMode();
                        this.pageParams.blnIgnore = false;
                        this.logger.log('Mode A', this.riMaintenance.CurrentMode, this.pageParams.ParentMode);
                        break;
                    case 'ContactMedium':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'CSearchAdd':
                        this.parent.focusField('PremiseCommenceDate');
                        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseCommenceDate', false);
                        break;
                    case 'GeneralSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'AccountPremiseSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'AddFromPremise':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('NewPremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentHTMLValue('NewPremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentHTMLValue('NewPremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'NewPremiseRowID', 'value', this.riExchange.getParentHTMLValue('NewPremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        this.riMaintenance.UpdateMode();
                        break;
                    case 'GridSearch':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseName', 'value', this.riExchange.getParentHTMLValue('PremiseName'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'GeneralSearchProduct':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'GridPremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseName'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'CallCentreSearch':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'GridCopySearch':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'GridPremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseName'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'StockEstimatesSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'TreatmentcardRecallSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentHTMLValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'GridSearchAdd':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riMaintenance.AddMode();
                        this.parent.focusField('PremiseCommenceDate');
                        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseCommenceDate', false);
                        this.logger.log('Mode B', this.riMaintenance.CurrentMode, this.pageParams.ParentMode);
                        break;
                    default:
                        this.logger.log('Mode C', this.pageParams.ParentMode.trim());
                }
                switch (this.pageParams.ParentMode.trim()) {
                    case 'ServicePlanning':
                    case 'AreaReallocation':
                    case 'ServiceAreaSequence':
                    case 'GroupServiceVisit':
                    case 'VisitDateDiscrepancy':
                    case 'ServiceVisitHistory':
                    case 'ExchangesDue':
                    case 'InstallationsCommence':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'PortfolioNoTurnover':
                    case 'ServiceStatsAdjust':
                    case 'CancelledVisit':
                    case 'VisitRejection':
                    case 'SuspendServiceandInvoice':
                    case 'TechServiceVisit':
                    case 'DOWSentricon':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'PDAReconciliation':
                    case 'ContractExpiryGrid':
                    case 'ContractPOExpiryGrid':
                    case 'RepeatSales':
                    case 'AdditionalVisit':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'Release':
                    case 'Summary':
                    case 'ProRataCharge':
                    case 'ServiceVisitEntryGrid':
                    case 'ServiceValueEntryGrid':
                    case 'Accept':
                    case 'PremiseMatch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'GridCopySearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'Bonus':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'LostBusinessAnalysis':
                    case 'InvoiceReleased':
                    case 'StaticVisit':
                    case 'PortfolioReports':
                    case 'ServiceVisitWorkIndex':
                    case 'RetainedServiceCovers':
                    case 'TechWorkSummary':
                    case 'ClientRetention':
                    case 'ComReqPlan':
                    case 'CustomerCCOReport':
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
                    case 'DespatchGrid':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                }
            }
        }
        else {
            for (var i in this.formData) {
                if (i) {
                    this.riExchange.updateCtrl(this.controls, i, 'value', this.formData[i]);
                }
            }
        }
        this.parent.updateButton();
        if (!this.pageParams.shouldOpen) {
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.parent.disablePremiseNumber();
            }
            else {
                this.parent.enablePremiseNumber();
            }
        }
        this.SetSCVariables();
        this.SetHTMLPageSettings();
        this.parent.pgPM2.AddTabs();
        this.parent.pgPM2.BuildMenuOptions();
        this.riExchange.renderForm(this.uiForm, this.controls);
        if (this.parent.pageParams.shouldOpen) {
            this.parent.contractNumberEllipsis.openModal();
            this.pageParams.shouldOpen = false;
        }
        this.init();
    };
    PremiseMaintenance1.prototype.init = function () {
        var _this = this;
        this.logger.log('INIT inside PM1');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.CurrentContractType);
        this.logger.log(this.riMaintenance.CurrentMode, '|', 'ParentMode', this.pageParams.ParentMode, '|', 'ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), '|', 'PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'), '|', 'PremiseRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseRowID'), '|', 'ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'), '|', 'CurrentContractType', this.pageParams.CurrentContractType);
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '') {
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseRowID') === '') {
                    this.parent.initialFormState(true, false);
                    return;
                }
            }
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') === '') {
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseRowID') === '') {
                    this.parent.initialFormState(true, false);
                    return;
                }
            }
        }
        this.logger.log('-------------------------------------');
        this.parent.overrideOpenFieldCR();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.CurrentContractType);
        this.parent.enableControls();
        this.parent.primaryFieldsEnableDisable();
        this.parent.setFormMode(this.parent.c_s_MODE_SELECT);
        this.parent.lErrorMessageDesc = [];
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.pgPM3.TermiteServiceCheck();
        }
        this.pageParams.initialVtxGeocodeVal = '';
        this.riExchange.updateCtrl(this.controls, 'cmdGeocode', 'disabled', true);
        this.riExchange.updateCtrl(this.controls, 'cmdVtxGeoCode', 'disabled', true);
        this.riExchange.updateCtrl(this.controls, 'SelRoutingSource', 'disabled', true);
        this.riExchange.updateCtrl(this.controls, 'SelPrintRequired', 'disabled', true);
        this.riExchange.updateCtrl(this.controls, 'SelServiceNotifyTemplateEmail', 'disabled', true);
        this.riExchange.updateCtrl(this.controls, 'SelServiceNotifyTemplateSMS', 'disabled', true);
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSFindPropertyCareBranch.p';
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('Function', 'Request', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BranchNumber', this.utils.getBranchCode(), MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('PropertyCareInd', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('AllowUpdateInd', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA DATA CALLBACK 1', data);
            this.pageParams.boolPropertyCareInd = data['PropertyCareInd'];
            this.pageParams.boolAllowUpdateInd = data['AllowUpdateInd'];
        }, 'POST');
        this.riMaintenance.BusinessObject = 'iCABSCustomerInfoFunctions.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Mode', 'CheckBranchUserRights', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('WriteAccess', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA DATA CALLBACK 2', data);
            this.pageParams.boolUserWriteAccess = data['WriteAccess'];
        }, 'POST', 0);
        this.uiDisplay.tdCustomerInfo = false;
        this.pageParams.GridCacheTime = (new Date()).toTimeString().split(' ')[0];
        this.parent.pgPM3.BuildSRAGrid();
        this.riExchange.updateCtrl(this.controls, 'cmdSRAGenerateText', 'disabled', true);
        this.riExchange.updateCtrl(this.controls, 'selCustomerIndicationNumber', 'disabled', true);
        var strDocTitle = this.pageParams.CurrentContractTypeLabel + ' Premises Entry';
        var strTabTitle = this.pageParams.CurrentContractTypeLabel + ' Premises Maintenance';
        var strInpTitle = this.pageParams.CurrentContractTypeLabel + ' Number';
        this.utils.setTitle(strDocTitle);
        if (this.pageParams.glSCPORefsAtServiceCover) {
            this.uiDisplay.trPurchaseOrderDetails = false;
        }
        this.riExchange.updateCtrl(this.controls, 'CallLogID', 'value', this.riExchange.getParentHTMLValue('CurrentCallLogID'));
        this.riExchange.updateCtrl(this.controls, 'CurrentCallLogID', 'value', this.riExchange.getParentHTMLValue('CurrentCallLogID'));
        this.riExchange.updateCtrl(this.controls, 'ClosedWithChanges', 'value', this.riExchange.getParentHTMLValue('ClosedWithChanges'));
        this.riExchange.updateCtrl(this.controls, 'EmployeeLimitChildDrillOptions', 'value', this.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions'));
        if (!(this.pageParams.SCEnableHopewiserPAF || this.pageParams.SCEnableDatabasePAF || this.pageParams.SCEnableMarktSelect)) {
            this.uiDisplay.cmdGetAddress = false;
        }
        var vntReturnData = [];
        this.riExchange.updateCtrl(this.controls, 'RunningReadOnly', 'value', this.riExchange.getParentHTMLValue('RunningReadOnly'));
        switch (this.pageParams.CurrentContractType) {
            case 'J':
            case 'P':
                this.uiDisplay.labelDiscountCode = false;
                this.uiDisplay.DiscountCode = false;
                this.uiDisplay.DiscountDesc = false;
                this.uiDisplay.tdCustomerInfo = false;
                break;
        }
        this.pageParams.vSICCodeEnable = (this.pageParams.vSICCodeEnable) ? true : false;
        this.pageParams.vSICCodeRequire = (this.pageParams.vSICCodeRequire) ? true : false;
        if (this.pageParams.vSICCodeEnable) {
            this.uiDisplay.trSICCode = true;
        }
        else {
            this.uiDisplay.trSICCode = false;
        }
        this.pageParams.vbEnableRouteOptimisation = (this.pageParams.vEnableRouteOptimisation) ? true : false;
        this.pageParams.vbEnablePremiseLinking = (this.pageParams.vEnablePremiseLinking) ? true : false;
        this.pageParams.vbEnableAssociatedPremise = (this.pageParams.vEnableAssociatedPremise) ? true : false;
        if (this.pageParams.vbEnableRouteOptimisation) {
            this.uiDisplay.trVehicleTypeNumber = true;
            this.uiDisplay.cmdGeocode = true;
            this.uiDisplay.tdGeonode = true;
            this.uiDisplay.tdGPSScore = true;
        }
        else {
            this.uiDisplay.trVehicleTypeNumber = false;
            this.uiDisplay.cmdGeocode = false;
            this.uiDisplay.tdGeonode = false;
            this.uiDisplay.tdGPSScore = false;
        }
        if (this.pageParams.vbEnablePremiseLinking) {
            this.uiDisplay.trEnableLinkedPremises = true;
        }
        else {
            this.uiDisplay.trEnableLinkedPremises = false;
        }
        if (this.pageParams.vbEnableAssociatedPremise) {
            this.uiDisplay.trEnableAssociatedPremises = true;
        }
        else {
            this.uiDisplay.trEnableAssociatedPremises = false;
        }
        if (this.pageParams.SCHidePostCode) {
            this.uiDisplay.tdspanContractPostCode = false;
            this.uiDisplay.tdContractPostCode = false;
        }
        else {
            this.uiDisplay.tdspanContractPostCode = true;
            this.uiDisplay.tdContractPostCode = true;
        }
        if (this.pageParams.vbEnableRegulatoryAuthority) {
            this.uiDisplay.trRegulatoryAuthorityNumber = true;
        }
        else {
            this.uiDisplay.trRegulatoryAuthorityNumber = false;
        }
        if (this.pageParams.SCEnableRepeatSalesMatching) {
            this.uiDisplay.trMatchContract = true;
            this.uiDisplay.trMatchPremise = true;
        }
        else {
            this.uiDisplay.trMatchContract = false;
            this.uiDisplay.trMatchPremise = false;
        }
        if (this.pageParams.vbVtxGeoCode) {
            this.uiDisplay.trVtxGeoCode = true;
            this.uiDisplay.tdOutsideCityLimits = true;
            this.uiDisplay.tdOutsideCityLimitslab = true;
        }
        else {
            this.uiDisplay.trVtxGeoCode = false;
            this.uiDisplay.tdOutsideCityLimits = false;
            this.uiDisplay.tdOutsideCityLimitslab = false;
        }
        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.AnyPendingBelow = false;
        this.riExchange.updateCtrl(this.controls, 'cmdGetAddress', 'disabled', true);
        this.riExchange.updateCtrl(this.controls, 'cmdCopyPremise', 'disabled', true);
        this.riExchange.updateCtrl(this.controls, 'cmdVtxGeoCode', 'disabled', true);
        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.CustomBusinessObject = 'iCABSPremiseEntry.p';
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
        if (this.pageParams.ParentMode === 'CallCentreSearch') {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSelect = false;
        }
        if (this.riExchange.URLParameterContains('pgm')) {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSelect = false;
        }
        this.riExchange.renderForm(this.uiForm, this.controls);
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
        this.riMaintenance.AddTableField('NationalAccount', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequried, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AccountNumber', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('AccountNumber', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PremiseCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableFieldAlignment('PremiseCommenceDate', MntConst.eAlignmentCenter);
        if (this.pageParams.SCCapitalFirstLtr) {
            this.riMaintenance.AddTableField('PremiseName', MntConst.eTypeTextFree, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
            this.riMaintenance.AddTableField('PremiseAddressLine1', MntConst.eTypeTextFree, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
            this.riMaintenance.AddTableField('PremiseAddressLine2', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            if (this.pageParams.SCAddressLine3Logical) {
                this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeTextFree, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            }
            else {
                this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            }
            this.riMaintenance.AddTableField('PremiseAddressLine4', MntConst.eTypeTextFree, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
            if (this.pageParams.SCAddressLine5Logical) {
                this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeTextFree, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            }
            else {
                this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            }
        }
        else {
            this.riMaintenance.AddTableField('PremiseName', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
            this.riMaintenance.AddTableField('PremiseAddressLine1', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
            this.riMaintenance.AddTableField('PremiseAddressLine2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            if (this.pageParams.SCAddressLine3Logical) {
                this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            }
            else {
                this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            }
            this.riMaintenance.AddTableField('PremiseAddressLine4', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
            if (this.pageParams.SCAddressLine5Logical) {
                this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            }
            else {
                this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            }
        }
        if (this.pageParams.SCHidePostcode) {
            this.riMaintenance.AddTableField('PremisePostcode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        else {
            this.riMaintenance.AddTableField('PremisePostcode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        }
        this.riMaintenance.AddTableField('DrivingChargeValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Required');
        if (this.pageParams.vbVtxGeoCode) {
            this.riMaintenance.AddTableField('PremiseVtxGeoCode', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        }
        else {
            this.riMaintenance.AddTableField('PremiseVtxGeoCode', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('OutsideCityLimits', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.pageParams.SCCapitalFirstLtr) {
            this.riMaintenance.AddTableField('PremiseContactName', MntConst.eTypeTextFree, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        }
        else {
            this.riMaintenance.AddTableField('PremiseContactName', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        }
        if (this.pageParams.SCCapitalFirstLtr) {
            this.riMaintenance.AddTableField('PremiseContactPosition', MntConst.eTypeTextFree, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        }
        else {
            this.riMaintenance.AddTableField('PremiseContactPosition', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        }
        if (this.pageParams.SCCapitalFirstLtr) {
            this.riMaintenance.AddTableField('PremiseContactDepartment', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        else {
            this.riMaintenance.AddTableField('PremiseContactDepartment', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('PremiseContactTelephone', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactMobile', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactFax', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactEmail', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('InvoiceGroupNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('DiscountCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableFieldAlignment('DiscountCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('ServiceBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('CustomerTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldAlignment('CustomerTypeCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('SalesAreaCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'LookUp');
        this.riMaintenance.AddTableFieldAlignment('SalesAreaCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PremiseSalesEmployee', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('PremiseSalesEmployee', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PurchaseOrderNo', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PurchaseOrderLineNo', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PurchaseOrderExpiryDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ClientReference', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PrintRequired', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
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
        this.riMaintenance.AddTableField('ProofOfServiceRequired', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOL', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOLSiteRef', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('PNOLiCABSLevel', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOLDescription', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('PNOLEffectiveDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ContractHasExpired', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOLUpliftAmount', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOLSetupChargeToApply', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOLEffectiveDefault', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('StoreType', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldOptionNormal, 'Optional');
        this.riMaintenance.AddTableField('StoreNumber', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldOptionNormal, 'Optional');
        this.riMaintenance.AddTableField('origPNOL', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('origPNOLiCABSLevel', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('origPNOLEffectiveDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('origPNOLSiteRef', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('GPSCoordinateX', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('GPSCoordinateY', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('RoutingGeonode', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('RoutingScore', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('RoutingSource', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseFixedServiceTime', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('VehicleTypeNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('LanguageCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('PremiseRegNumber', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseReference', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('WasteConsignmentNoteExemptInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('WasteConsignmentNoteExpiryDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('WasteRegulatoryPremiseRef', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('NextWasteConsignmentNoteNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.pageParams.vSICCodeEnable) {
            this.riMaintenance.AddTableField('SICCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Lookup');
            this.riMaintenance.AddTableFieldAlignment('SICCode', MntConst.eAlignmentRight);
        }
        for (var iCounter = 1; iCounter <= 14; iCounter++) {
            this.riMaintenance.AddTableField('WindowStart' + this.ZeroPadInt(iCounter, 2), MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('WindowEnd' + this.ZeroPadInt(iCounter, 2), MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('ClosedCalendarTemplateNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Loopkup');
        this.riMaintenance.AddTableField('CallLogID', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseAliasName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.pageParams.vbEnablePremiseLinking) {
            this.riMaintenance.AddTableField('LinkedToContractNumber', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableFieldAlignment('LinkedToContractNumber', MntConst.eAlignmentRight);
            this.riMaintenance.AddTableField('LinkedToPremiseNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        if (this.pageParams.vbEnableAssociatedPremise) {
            this.riMaintenance.AddTableField('AssociatedToPremiseNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('PlanningHighlightInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AppointmentRequiredInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AppointmentDetailDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseParkingNote', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('InitialTreatmentInstructions', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PaymentTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('PaymentDesc', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.riMaintenance.AddTableField('CreateNewSRA', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('GblSRAAdditionalSRA', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('GblSRAAdditionalSRADocRef', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        for (var iCounter = 1; iCounter <= 7; iCounter++) {
            this.riMaintenance.AddTableField(('WindowPreferredInd0' + iCounter), MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('PremisePlanningNote', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PreferredDayOfWeekReasonCode', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('PreferredDayOfWeekNote', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AdditionalComments1', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AdditionalComments2', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EnvironmentalRestrictedAreaText', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.pageParams.vbEnableRegulatoryAuthority) {
            this.riMaintenance.AddTableField('RegulatoryAuthorityNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        }
        else {
            this.riMaintenance.AddTableField('RegulatoryAuthorityNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('TechRetentionInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('TechRetentionReasonCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PDACloseRecommendationInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('HyperSensitive', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EnvironmentalRestrictedAreaInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('GuaranteeNumberBedrooms', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ListedCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('TelesalesEmployeeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldAlignment('TelesalesEmployeeCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('CustomerIndicationNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceNotifyTemplateEmail', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceNotifyTemplateSMS', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CICustRefReq', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CIRWOReq', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CICFWOReq', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CICFWOSep', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CICResponseSLA', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CIFirstSLAEscDays', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CISubSLAEscDays', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.pageParams.SCEnableRepeatSalesMatching) {
            this.riMaintenance.AddTableField('MatchedContractNumber', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.riMaintenance.AddTableField('MatchedPremiseNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        }
        this.riMaintenance.AddTableCommit(this, function (data) {
            if (data && data.hasError) {
                _this.parent.servicePrimaryError(data);
            }
            _this.initiateVirtualTable();
            if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'PurchaseOrderNo') === '') {
                _this.uiDisplay.tdPurchaseOrderLineNo = false;
                _this.uiDisplay.tdPurchaseOrderExpiryDate = false;
            }
            else {
                _this.uiDisplay.tdPurchaseOrderLineNo = true;
                _this.uiDisplay.tdPurchaseOrderExpiryDate = true;
            }
            _this.doLookupforClosedCalendarTemplate();
            _this.parent.updateEllipsisParams();
        });
        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('ContractNumber', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, '');
        this.riMaintenance.AddTableField('PremiseNumber', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, '');
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
        this.riMaintenance.AddTableField('InactiveEffectDate', MntConst.eTypeDateText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('InactiveEffectDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableFieldPostData('InactiveEffectDate', false);
        this.riMaintenance.AddTableField('LostBusinessDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('LostBusinessDesc', false);
        this.riMaintenance.AddTableField('LostBusinessDesc2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('LostBusinessDesc2', false);
        this.riMaintenance.AddTableField('LostBusinessDesc3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('LostBusinessDesc3', false);
        this.riMaintenance.AddTableField('DisableList', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ContractTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AccountName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ShowValueButton', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('NewPremiseRowID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('ShowValueButton', false);
        this.riMaintenance.AddTableField('NewContract', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AnyPendingBelow', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('AnyPendingBelow', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableFieldPostData('AnyPendingBelow', false);
        this.riMaintenance.AddTableField('ErrorMessageDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldPostData('ErrorMessageDesc', false);
        this.riMaintenance.AddTableField('CreateNewInvoiceGroupInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('InvoiceNarrativeText', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('DrivingChargeInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseServiceNote', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        for (var iCounter = 1; iCounter <= 14; iCounter++) {
            this.riMaintenance.AddTableField('DefaultWindowStart' + this.ZeroPadInt(iCounter, 2), MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('DefaultWindowEnd' + this.ZeroPadInt(iCounter, 2), MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('ProofScanRequiredInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ProofSignatureRequiredInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('TelesalesInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CustomerAvailTemplateID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('GblSRATypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('GblSRADesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('GridUniqueID', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        if (this.pageParams.vbEnableServiceCoverDispLev) {
            this.riMaintenance.AddTableField('DisplayQty', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.riMaintenance.AddTableFieldPostData('DisplayQty', false);
            this.riMaintenance.AddTableField('WEDValue', MntConst.eTypeDecimal1, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.riMaintenance.AddTableFieldPostData('WEDValue', false);
            this.riMaintenance.AddTableField('MaterialsValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.riMaintenance.AddTableFieldPostData('MaterialsValue', false);
            this.riMaintenance.AddTableField('MaterialsCost', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.riMaintenance.AddTableFieldPostData('MaterialsCost', false);
            this.riMaintenance.AddTableField('LabourValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.riMaintenance.AddTableFieldPostData('LabourValue', false);
            this.riMaintenance.AddTableField('LabourCost', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.riMaintenance.AddTableFieldPostData('LabourCost', false);
            this.riMaintenance.AddTableField('ReplacementValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.riMaintenance.AddTableFieldPostData('ReplacementValue', false);
            this.riMaintenance.AddTableField('ReplacementCost', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.riMaintenance.AddTableFieldPostData('ReplacementCost', false);
        }
        this.riMaintenance.AddTableCommit(this);
        this.riMaintenance.Complete();
        this.riExchange.riInputElement.Disable(this.uiForm, 'Status');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InactiveEffectDate');
        this.parent.dateDisable('InactiveEffectDate', true, true);
        this.riExchange.riInputElement.Disable(this.uiForm, 'LostBusinessDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PaymentTypeValue');
        this.riExchange.riInputElement.SetLookUpStatus(this.uiForm, 'CustomerTypeCode', true);
        this.parent.pgPM2.ShowInvoiceNarrativeTab();
        this.parent.pgPM2.HideQuickWindowSet(true);
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.parent.pgPM3.PremGblSRADisable();
            this.uiDisplay.trCreateNewSRA = true;
        }
        else {
            this.uiDisplay.trCreateNewSRA = false;
        }
        if (this.riMaintenance.RecordSelected(false)) {
            this.riMaintenance.FetchRecord();
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLiCABSLevel');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLSiteRef');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLEffectiveDate');
        this.parent.dateDisable('PNOLEffectiveDate', true, true);
        this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLUpliftAmount');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLSetupChargeToApply');
        this.riExchange.updateCtrl(this.controls, 'cmdResendPremises', 'disabled', true);
        this.riExchange.riInputElement.Disable(this.uiForm, 'cmdResendPremises');
        this.uiDisplay.trBatchProcessInformation = false;
        if (this.pageParams.ParentMode === 'Contract-Add') {
            this.parent.pgPM3.DefaultFromProspect();
        }
        if (this.riExchange.getParentHTMLValue('RunningReadOnly') === 'yes') {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSelect = false;
            this.riMaintenance.FunctionDelete = false;
            this.riMaintenance.FunctionUpdate = false;
            this.riMaintenance.FunctionSnapShot = false;
        }
        if (this.riExchange.getParentHTMLValue('CurrentCallLogID') !== '' && this.riExchange.getParentHTMLValue('CurrentCallLogID') !== '') {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSelect = false;
        }
        this.parent.pgPM2.BuildMenuOptions();
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riMaintenance.DisableInput('menu');
        }
        else {
            this.riMaintenance.EnableInput('menu');
        }
        if (this.pageParams.vbShowPremiseAdditionalTabLog) {
            this.uiDisplay.trComment2 = true;
            this.uiDisplay.trAdditionalComment2 = true;
        }
        else {
            this.uiDisplay.trComment2 = false;
            this.uiDisplay.trAdditionalComment2 = false;
        }
        if (!this.pageParams.lAllowUserAuthUpdate) {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionUpdate = false;
            this.riMaintenance.FunctionDelete = false;
        }
        if (this.riExchange.getParentHTMLValue('ProspectNumber') !== '' && this.riExchange.getParentHTMLValue('ProspectNumber') !== '') {
            this.riMaintenance.FunctionAdd = true;
        }
        this.parent.pgPM3.setPurchaseOrderFields();
        if (this.riExchange.riInputElement.checked(this.uiForm, 'TelesalesInd')) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TelesalesEmployeeCode', true);
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TelesalesEmployeeCode', false);
        }
        switch (this.riMaintenance.CurrentMode) {
            case MntConst.eModeAdd:
                this.parent.pgPM3.GetCustomerTypeDefault();
                this.parent.pgPM2.riExchange_CBORequest();
                break;
        }
        this.parent.pgPM4.window_onload();
        this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this.pgPM0, this.pgPM1, this.pgPM1a, this.pgPM2, this.pgPM3, this.pgPM4, this.parent]);
    };
    PremiseMaintenance1.prototype.riMaintenance_BeforeUpdate = function () {
        this.parent.pgPM1a.SetServiceNotificationFields();
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdBtnAmendContact = true;
        }
        this.pageParams.GridCacheTime = (new Date()).toTimeString().split(' ')[0];
        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdSRAGenerateText');
        if (this.pageParams.SCEnablePestNetOnlineProcessing) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLUpliftAmount', '0');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLSetUpChargeToApply', '0');
        }
        if ((this.pageParams.vbEnablePremiseLinking && this.riExchange.riInputElement.GetValue(this.uiForm, 'LinkedToContractNumber') !== '') ||
            (this.pageParams.vbEnableAssociatedPremise && this.riExchange.riInputElement.GetValue(this.uiForm, 'AssociatedToPremiseNumber') !== '')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseServiceNote');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseParkingNote');
        }
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelPrintRequired');
        if (this.riExchange.riInputElement.checked(this.uiForm, 'TelesalesInd')) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TelesalesEmployeeCode', true);
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TelesalesEmployeeCode', false);
        }
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.parent.pgPM3.BuildPremGblSRACache();
            this.pageParams.vbGblSRAMode = '';
            this.parent.pgPM3.PremGblSRADisable();
        }
    };
    PremiseMaintenance1.prototype.riMaintenance_BeforeSave = function () {
        if (this.pageParams.initialVtxGeocodeVal) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseVtxGeoCode', this.pageParams.initialVtxGeocodeVal);
        }
    };
    PremiseMaintenance1.prototype.riMaintenance_AfterSave = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', '');
        if (this.parent.actionSave === 1)
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.currentContractType);
        var fieldsArr = this.riExchange.getAllCtrl(this.controls);
        this.riMaintenance.clear();
        for (var i = 0; i < fieldsArr.length; i++) {
            var id = fieldsArr[i];
            var dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            var value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            switch (id) {
                case 'PremiseROWID':
                case 'PremiseRowID':
                    value = this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise');
                    break;
            }
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data) {
            if (data.hasError) {
                if (data.errorMessage.trim() !== '') {
                    this.logger.log('Post data Error', data);
                    this.parent.showAlert(data.errorMessage);
                }
            }
            else {
                this.logger.log('Post data Saved', data);
                this.parent.routeAwayGlobals.setSaveEnabledFlag(false);
                if (data.hasOwnProperty('InvoiceGroupDesc')) {
                    if (data.InvoiceGroupDesc !== '') {
                        this.parent.showAlert(MessageConstant.Message.SavedSuccessfully, 1);
                        this.parent.callbackHooks.push(function () {
                            this.parent.riMaintenance.renderResponseForCtrl(this, data);
                            this.parent.riMaintenance.CurrentMode = MntConst.eModeUpdate;
                            this.parent.pgPM2.riMaintenance_AfterSaveAdd_clbk();
                        });
                    }
                    else {
                        this.parent.showAlert(MessageConstant.Message.SaveUnSuccessful, 0);
                    }
                }
            }
        }, 'POST', this.parent.actionSave);
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdBtnAmendContact = true;
        }
        this.pageParams.GridCacheTime = (new Date()).toTimeString().split(' ')[0];
        this.riExchange.riInputElement.Disable(this.uiForm, 'cmdSRAGenerateText');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelPrintRequired');
        if (this.pageParams.SCEnablePestNetOnlineProcessing) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLUpliftAmount', '0');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLSetUpChargeToApply', '0');
        }
        this.parent.pgPM2.HideQuickWindowSet(true);
        this.parent.pgPM1.SetOkToUpgradeToPNOL();
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.pageParams.vbGblSRAMode = '';
            this.parent.pgPM3.PremGblSRADisable();
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateEmail');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateSMS');
    };
    PremiseMaintenance1.prototype.riMaintenance_AfterFetch = function () {
        this.pageParams.GridCacheTime = (new Date()).toTimeString().split(' ')[0];
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelServiceNotifyTemplateEmail', '');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceNotifyTemplateEmail')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelServiceNotifyTemplateEmail', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceNotifyTemplateEmail'));
        }
        this.parent.pgPM3.SelServiceNotifyTemplateEmail_OnChange();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelServiceNotifyTemplateSMS', '');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceNotifyTemplateSMS')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelServiceNotifyTemplateSMS', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceNotifyTemplateSMS'));
        }
        this.parent.pgPM3.SelServiceNotifyTemplateSMS_OnChange();
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdBtnAmendContact = true;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'RoutingSource').length === 0) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelRoutingSource', '');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelRoutingSource', this.riExchange.riInputElement.GetValue(this.uiForm, 'RoutingSource'));
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PrintRequired').length === 0) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelPrintRequired', 0);
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelPrintRequired', this.riExchange.riInputElement.GetValue(this.uiForm, 'PrintRequired'));
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'InactiveEffectDate') !== '') {
            this.uiDisplay.labelInactiveEffectDate = true;
            this.uiDisplay.InactiveEffectDate = true;
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDesc') !== '') {
                this.uiDisplay.LostBusinessDesc = true;
                this.parent.LostBusinessText = this.parent.getControlValue('LostBusinessDesc2') + '\n' + this.parent.getControlValue('LostBusinessDesc3');
            }
            else {
                this.uiDisplay.LostBusinessDesc = false;
            }
        }
        else {
            this.uiDisplay.labelInactiveEffectDate = false;
            this.uiDisplay.InactiveEffectDate = false;
            this.uiDisplay.LostBusinessDesc = false;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AnyPendingBelow') !== '') {
            this.uiDisplay.AnyPendingBelow = true;
        }
        else {
            this.uiDisplay.AnyPendingBelow = false;
        }
        if (this.riExchange.riInputElement.checked(this.uiForm, 'ShowValueButton')) {
            this.uiDisplay.cmdValue = true;
        }
        else {
            this.uiDisplay.cmdValue = false;
        }
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full' ||
            this.riExchange.ClientSideValues.Fetch('BranchNumber') === this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber') ||
            this.riExchange.ClientSideValues.Fetch('BranchNumber') === this.riExchange.riInputElement.GetValue(this.uiForm, 'NegBranchNumber')) {
            this.uiDisplay.tdPremiseAnnualValueLab = true;
        }
        else {
            this.uiDisplay.tdPremiseAnnualValueLab = false;
        }
        if (this.riExchange.riInputElement.checked(this.uiForm, 'NationalAccountChecked') &&
            this.riExchange.riInputElement.checked(this.uiForm, 'NationalAccount')) {
            this.uiDisplay.tdNationalAccount = true;
        }
        else {
            this.uiDisplay.tdNationalAccount = false;
        }
        if (this.riExchange.riInputElement.checked(this.uiForm, 'CustomerInfoAvailable')) {
            this.uiDisplay.tdCustomerInfo = true;
        }
        else {
            this.uiDisplay.tdCustomerInfo = false;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SCEnableDrivingCharges') &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'DrivingChargeInd') && this.pageParams.CurrentContractType !== 'P') {
            this.uiDisplay.tdDrivingChargeValueLab = true;
            this.uiDisplay.tdDrivingChargeValue = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DrivingChargeValue', true);
        }
        else {
            this.uiDisplay.tdDrivingChargeValueLab = false;
            this.uiDisplay.tdDrivingChargeValue = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DrivingChargeValue', false);
        }
        if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
            this.uiDisplay.tdPNOL = true;
        }
        else {
            this.uiDisplay.tdPNOL = false;
        }
        if (this.riExchange.riInputElement.checked(this.uiForm, 'HyperSensitive')) {
            this.uiDisplay.tdHyperSens = true;
        }
        else {
            this.uiDisplay.tdHyperSens = false;
        }
        if (this.riExchange.riInputElement.checked(this.uiForm, 'EnvironmentalRestrictedAreaInd')) {
            this.uiDisplay.tdEnvironmentalRestrictedAreaInd = true;
        }
        else {
            this.uiDisplay.tdEnvironmentalRestrictedAreaInd = false;
        }
        if (this.pageParams.SCEnableRepeatSalesMatching && this.riExchange.riInputElement.GetValue(this.uiForm, 'MatchedContractNumber') === '' &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'MatchedPremiseNumber') === '0') {
            this.uiDisplay.cmdMatchPremise = true;
        }
        else {
            this.uiDisplay.cmdMatchPremise = false;
        }
        this.parent.pgPM2.AddTabs();
        this.parent.pgPM2.ShowInvoiceNarrativeTab();
        if (this.riExchange.riInputElement.checked(this.uiForm, 'ContractHasExpired')) {
            this.uiDisplay.tdContractHasExpired = true;
        }
        else {
            this.uiDisplay.tdContractHasExpired = false;
        }
        this.uiDisplay.trBatchProcessInformation = false;
        this.parent.pgPM2.HideQuickWindowSet(true);
        this.parent.pgPM1.doLookupforLinkedContract();
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'LinkedToContractNumber') !== '' ||
            this.riExchange.riInputElement.GetValue(this.uiForm, 'AssociatedToPremiseNumber') !== '') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseServiceNote');
        }
        if (this.riExchange.riInputElement.checked(this.uiForm, 'WasteConsignmentNoteExemptInd')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'NextWasteConsignmentNoteNumber', '');
        }
        if (this.pageParams.vbEnableServiceCoverDispLev) {
            this.parent.pgPM2.CalDisplayValues();
        }
        this.parent.pgPM3.setPurchaseOrderFields();
        this.parent.pgPM3.CustomerIndicationNumber_onChange();
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.parent.pgPM3.BuildPremGblSRACache();
            this.pageParams.vbGblSRAMode = '';
            this.parent.pgPM3.PremGblSRADisable();
        }
    };
    PremiseMaintenance1.prototype.SetOkToUpgradeToPNOL = function () {
        if (this.pageParams.SCEnablePestNetOnlineProcessing) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'origPNOL', this.riExchange.riInputElement.GetValue(this.uiForm, 'PNOL'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'origPNOLiCABSLevel', this.riExchange.riInputElement.GetValue(this.uiForm, 'PNOLiCABSLevel'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'origPNOLEffectiveDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'PNOLEffectiveDate'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'origPNOLSiteRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'PNOLSiteRef'));
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.uiDisplay.trAddToPNOLUpliftAmount = false;
            }
            else {
                this.uiDisplay.trAddToPNOLUpliftAmount = true;
            }
            this.PNOL_onClick();
            this.parent.pgPM2.CheckCanUpdatePNOLDetails();
        }
    };
    PremiseMaintenance1.prototype.PNOL_onClick = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeSaveAdd ||
            this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeSaveUpdate) {
            this.pageParams.vbDisablePNOLEffectDateDefaulting = (this.pageParams.vDisablePNOLEffectDateDefaulting) ? true : false;
            if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'PNOLSiteRef');
                this.riExchange.riInputElement.Enable(this.uiForm, 'PNOLiCABSLevel');
                this.riExchange.riInputElement.Enable(this.uiForm, 'PNOLEffectiveDate');
                this.parent.dateDisable('PNOLEffectiveDate', false, true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLiCABSLevel', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLEffectiveDate', true);
                this.pageParams.dtPNOLEffectiveDate.required = true;
                if (!this.riExchange.riInputElement.checked(this.uiForm, 'origPNOL')) {
                    if (this.pageParams.vbDisablePNOLEffectDateDefaulting) {
                        if (this.pageParams.PNOLMode === 'Update' && this.pageParams.CurrentContractType === 'C') {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLEffectiveDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'PNOLEffectiveDefault'));
                        }
                        else {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLEffectiveDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseCommenceDate'));
                        }
                    }
                }
            }
            else {
                if (this.pageParams.PNOLMode === 'Add') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLSiteRef', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLSiteRefDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLiCABSLevel', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLEffectiveDate', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLUpliftAmount', '0');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLSetupChargeToApply', '0');
                }
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLiCABSLevel', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLEffectiveDate', false);
                this.pageParams.dtPNOLEffectiveDate.required = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLSiteRef', false);
                this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLSiteRef');
                this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLiCABSLevel');
                this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLEffectiveDate');
                this.parent.dateDisable('PNOLEffectiveDate', true, true);
                this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLUpliftAmount');
                this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLSiteRef');
                this.riExchange.riInputElement.Disable(this.uiForm, 'PNOLSetupChargeToApply');
            }
        }
    };
    PremiseMaintenance1.prototype.SetSCVariables = function () {
        this.pageParams.SCEnableHopewiserPAF = this.pageParams.vSCEnableHopewiserPAF;
        this.pageParams.SCEnableDatabasePAF = this.pageParams.vSCEnableDatabasePAF;
        this.pageParams.SCEnableMarktSelect = this.pageParams.vSCEnableMarktSelect;
        this.pageParams.SCAddressLine3Logical = this.pageParams.vSCAddressLine3Logical;
        this.pageParams.SCAddressLine4Required = this.pageParams.vSCAddressLine4Required;
        this.pageParams.SCAddressLine5Required = this.pageParams.vSCAddressLine5Required;
        this.pageParams.SCAddressLine5Logical = this.pageParams.vSCAddressLine5Logical;
        this.pageParams.SCPostCodeRequired = this.pageParams.vSCPostCodeRequired;
        this.pageParams.SCPostCodeMustExistInPAF = this.pageParams.vSCPostCodeMustExistInPAF;
        this.pageParams.SCRunPAFSearchOnFirstAddressLine = this.pageParams.vSCRunPAFSearchOn1stAddressLine;
        this.pageParams.SCServiceReceiptRequired = this.pageParams.vSCServiceReceiptRequired;
        this.pageParams.SCProofOfServiceRequired = this.pageParams.vSCServiceReceiptRequired;
        this.pageParams.SCServiceCoverUpdateViaGrid = this.pageParams.vSCServiceCoverUpdateViaGrid;
    };
    PremiseMaintenance1.prototype.SetHTMLPageSettings = function () {
        this.logger.log('PAGEPARAMS', this.pageParams);
        this.uiDisplay.labelDiscountCode = (this.pageParams.vEnableDiscountCode) ? true : false;
        this.uiDisplay.DiscountCode = (this.pageParams.vEnableDiscountCode) ? true : false;
        this.uiDisplay.DiscountDesc = (this.pageParams.vEnableDiscountCode) ? true : false;
        this.uiDisplay.trPremiseAddressLine3 = (this.pageParams.vEnableAddressLine3) ? true : false;
        this.uiDisplay.trPremiseDirectoryName = (this.pageParams.vEnableMapGridReference) ? true : false;
        this.uiDisplay.trPremiseDirectoryNameBlank = (this.pageParams.vEnableMapGridReference) ? true : false;
        this.uiDisplay.trRetainServiceWeekday = (this.pageParams.vEnableRetentionOfServiceWeekDay) ? true : false;
        this.uiDisplay.trRetainServiceWeekdayBlank = (this.pageParams.vEnableRetentionOfServiceWeekDay) ? true : false;
        this.uiDisplay.trServiceReceiptRequired = (this.pageParams.vSCServiceReceiptRequired) ? true : false;
        this.uiDisplay.trServiceReceiptRequiredBlank = (this.pageParams.vSCServiceReceiptRequired) ? true : false;
        this.uiDisplay.tdProofOfServiceRequired = (this.pageParams.vSCProofOfServiceRequired) ? true : false;
        this.uiDisplay.tdProofOfServiceRequired1 = (this.pageParams.vSCProofOfServiceRequired) ? true : false;
        this.uiDisplay.trPaymentType = (this.pageParams.vSCEnablePayTypeInvGroupLevel) ? true : false;
        this.pageParams.vbEnableInstallsRemovals = (this.pageParams.vEnableInstallsRemovals) ? true : false;
        this.pageParams.vbEnableLocations = (this.pageParams.vEnableLocations) ? true : false;
        this.pageParams.vbEnablePremiseLocInsert = (this.pageParams.vEnablePremiseLocInsert) ? true : false;
        this.pageParams.vbEnableLocations = (this.pageParams.vEnableLocations) ? true : false;
        var vEnableNationalAccountWarning = (this.pageParams.vEnableNationalAccountWarning) ? true : false;
        this.riExchange.updateCtrl(this.controls, 'NationalAccountChecked', 'value', vEnableNationalAccountWarning);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NationalAccountChecked', vEnableNationalAccountWarning);
        this.pageParams.SCEnableDrivingCharges = (this.pageParams.vSCEnableDrivingCharges) ? true : false;
        this.pageParams.SCCapitalFirstLtr = (this.pageParams.vSCCapitalFirstLtr) ? true : false;
        this.pageParams.SCEnablePostcodeDefaulting = (this.pageParams.vEnablePostcodeDefaulting) ? true : false;
        this.pageParams.SCEnableServiceBranchUpdate = (this.pageParams.vSCEnableServiceBranchUpdate) ? true : false;
        this.pageParams.SCEnablePestNetOnlineProcessing = (this.pageParams.vSCEnablePestNetOnline) ? true : false;
        this.pageParams.SCEnablePestNetOnlineDefaults = (this.pageParams.vSCEnablePestNetOnlineDefaults) ? true : false;
        this.pageParams.SCFixedServiceTimeRequired = (this.pageParams.vSCFixedServiceTimeRequired) ? true : false;
        this.pageParams.vbEnableRegulatoryAuthority = (this.pageParams.vEnableRegulatoryAuthority) ? true : false;
        this.pageParams.vbShowWasteConsignmentNoteHistory = (this.pageParams.vShowWasteConsignmentNoteHistory) ? true : false;
        this.pageParams.vbShowPremiseWasteTab = (this.pageParams.vShowPremiseWasteTab) ? true : false;
        this.pageParams.vbEnableServiceCoverDispLev = (this.pageParams.vEnableServiceCoverDispLev) ? true : false;
        this.pageParams.SCEnableBarcodes = (this.pageParams.vSCEnableBarcodes) ? true : false;
        this.pageParams.SCRequireBarcodes = (this.pageParams.vSCRequireBarcodes) ? true : false;
        this.pageParams.SCEnableSignatures = (this.pageParams.vSCEnableSignatures) ? true : false;
        this.pageParams.SCRequireSignatures = (this.pageParams.vSCRequireSignatures) ? true : false;
        this.pageParams.vbShowPremiseAdditionalTab = (this.pageParams.vShowPremisesAdditionalTabReq) ? true : false;
        this.pageParams.vbShowPremiseAdditionalTabLog = (this.pageParams.vShowPremisesAdditionalTabLog) ? true : false;
        this.pageParams.vbEnableProductSaleCommenceDate = (this.pageParams.vEnableProductSaleCommenceDate) ? true : false;
        this.pageParams.SCEnableAccountAddressMessage = (this.pageParams.vSCEnableAccountAddressMessage) ? true : false;
        this.pageParams.vbEnableGlobalSiteRiskAssessment = (this.pageParams.glEnableGlobalSiteRiskAssessment) ? true : false;
        if (this.pageParams.vbEnableServiceCoverDispLev) {
            this.uiDisplay.tdWEDLabel = (this.pageParams.vEnableWED) ? true : false;
            this.uiDisplay.WEDValue = (this.pageParams.vEnableWED) ? true : false;
        }
        if (this.pageParams.SCFixedServiceTimeRequired) {
            this.uiDisplay.tdPremiseFixedServiceTime = true;
            this.uiDisplay.tdPremiseFixedServiceTime1 = true;
        }
        else {
            this.uiDisplay.tdPremiseFixedServiceTime = false;
            this.uiDisplay.tdPremiseFixedServiceTime1 = false;
        }
        if (this.pageParams.SCEnablePestNetOnLineProcessing) {
            this.uiDisplay.trPNOL = true;
            this.uiDisplay.trPNOLiCABSLevel = true;
        }
        if (this.pageParams.SCEnableDrivingCharges && this.pageParams.CurrentContractType !== 'P') {
            this.uiDisplay.tdDrivingChargeIndLab = true;
            this.uiDisplay.tdDrivingChargeInd = true;
        }
        else {
            this.uiDisplay.tdDrivingChargeIndLab = false;
            this.uiDisplay.tdDrivingChargeInd = false;
        }
        if (this.pageParams.SCEnableBarcodes) {
            this.uiDisplay.trBarcodeRequired = true;
        }
        else {
            this.uiDisplay.trBarcodeRequired = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProofScanRequiredInd', false);
        }
        if (this.pageParams.SCEnableSignatures) {
            this.uiDisplay.trSignatureRequired = true;
        }
        else {
            this.uiDisplay.trSignatureRequired = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProofSignatureRequiredInd', false);
        }
    };
    PremiseMaintenance1.prototype.GetRegistrySetting = function (pcRegSection, pcRegKey) {
        this.LookUp.GetRegistrySetting(pcRegSection, pcRegKey).then(function (data) {
            this.logger.log('GetRegistrySetting ****', data);
        });
    };
    PremiseMaintenance1.prototype.doLookupforLinkedContract = function () {
        var _this = this;
        if (this.parent.getControlValue('LinkedToContractNumber')) {
            this.LookUp.lookUpPromise([{
                    'table': 'Contract',
                    'query': {
                        'BusinessCode': this.utils.getBusinessCode(),
                        'ContractNumber': this.parent.getControlValue('LinkedToContractNumber')
                    },
                    'fields': ['ContractNumber', 'ContractName']
                }, {
                    'table': 'Premise',
                    'query': {
                        'BusinessCode': this.utils.getBusinessCode(),
                        'ContractNumber': this.parent.getControlValue('LinkedToContractNumber'),
                        'PremiseNumber': this.parent.getControlValue('LinkedToPremiseNumber')
                    },
                    'fields': ['PremiseName']
                }]).then(function (data) {
                if (data) {
                    if (data[0].length > 0) {
                        _this.parent.setControlValue('LinkedToContractName', data[0][0].ContractName);
                    }
                    if (data[1].length > 0) {
                        _this.parent.setControlValue('LinkedToPremiseName', data[1][0].PremiseName);
                    }
                }
            });
        }
    };
    PremiseMaintenance1.prototype.doLookupforClosedCalendarTemplate = function () {
        var _this = this;
        this.LookUp.lookUpPromise([
            {
                'table': 'BranchClosedCalendarTemplate',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'BranchNumber': this.parent.getControlValue('ServiceBranchNumber')
                },
                'fields': ['ClosedCalendarTemplateNumber']
            },
            {
                'table': 'ClosedCalendarTemplate',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['ClosedCalendarTemplateNumber', 'TemplateName']
            }
        ]).then(function (data) {
            var recordSet_BranchClosedCalendarTemplate = data[0];
            var recordSet_ClosedCalendarTemplate = data[1];
            var arrClosedCalendarTemplateNumber = [];
            if (recordSet_BranchClosedCalendarTemplate.length > 0) {
                for (var i = 0; i < recordSet_BranchClosedCalendarTemplate.length; i++) {
                    arrClosedCalendarTemplateNumber.push(recordSet_BranchClosedCalendarTemplate[i].ClosedCalendarTemplateNumber);
                }
            }
            if (recordSet_ClosedCalendarTemplate.length > 0) {
                _this.parent.dropDown.ClosedCalendarTemplate = [];
                for (var i = 0; i < recordSet_ClosedCalendarTemplate.length; i++) {
                    if (arrClosedCalendarTemplateNumber.indexOf(recordSet_ClosedCalendarTemplate[i].ClosedCalendarTemplateNumber) > -1) {
                        _this.parent.dropDown.ClosedCalendarTemplate.push({
                            value: recordSet_ClosedCalendarTemplate[i].ClosedCalendarTemplateNumber,
                            label: recordSet_ClosedCalendarTemplate[i].ClosedCalendarTemplateNumber + ' - ' + recordSet_ClosedCalendarTemplate[i].TemplateName
                        });
                    }
                }
            }
        });
    };
    PremiseMaintenance1.prototype.initiateVirtualTable = function () {
        var _this = this;
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
            this.riMaintenance.AddVirtualTableCommit(this, function (data) {
                setTimeout(function () {
                    _this.riExchange.updateCtrl(_this.controls, 'NationalAccountChecked', 'value', _this.pageParams.vEnableNationalAccountWarning);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NationalAccountChecked', _this.pageParams.vEnableNationalAccountWarning);
                    if (_this.riExchange.riInputElement.checked(_this.uiForm, 'NationalAccountChecked')
                        && _this.riExchange.riInputElement.checked(_this.uiForm, 'NationalAccount')) {
                        _this.uiDisplay.tdNationalAccount = true;
                    }
                    else {
                        _this.uiDisplay.tdNationalAccount = false;
                    }
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
            this.riMaintenance.AddVirtualTable('Employee', 'TelesalesEmployeeCode');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'TelesalesEmployeeCode', 'Virtual');
            this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'TelesalesEmployeeName');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('CustomerTypeLanguage');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('CustomerTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('CustomerTypeDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('VehicleType');
            this.riMaintenance.AddVirtualTableKey('VehicleTypeNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '=', 'vehicleTypeNumber', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('VehicleTypeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('Language');
            this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '=', this.riExchange.LanguageCode(), '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('LanguageDescription', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('CustomerAvailTemplate');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('CustomerAvailTemplateID', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('CustomerAvailTemplateDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', '');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('ClosedCalendarTemplate');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('ClosedCalendarTemplateNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('TemplateName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'ClosedTemplateName');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('PreferredDayOfWeekReasonLang');
            this.riMaintenance.AddVirtualTableKey('PreferredDayOfWeekReasonCode', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('PreferredDayOfWeekReasonLangDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            if (this.pageParams.vSICCodeEnable) {
                this.riMaintenance.AddVirtualTable('SICCodeLang');
                this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
                this.riMaintenance.AddVirtualTableKey('SICCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', 'SICCode', '', 'Virtual');
                this.riMaintenance.AddVirtualTableField('SICDescription', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
                this.riMaintenance.AddVirtualTableCommit(this);
            }
            this.riMaintenance.AddVirtualTable('RegulatoryAuthority');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('RegulatoryAuthorityNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('RegulatoryAuthorityName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', '');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('PestNetOnLineLevel');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('PNOLiCABSLevel', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('PNOLDescription', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', '');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('PremiseTechRetentionReasonsLang');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('TechRetentionReasonCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('TechRetentionReasonDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', '');
            this.riMaintenance.AddVirtualTableCommit(this);
            if (this.pageParams.SCEnableRepeatSalesMatching) {
                this.riMaintenance.AddVirtualTable('Contract', 'MatchedContract');
                this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'MatchedContractNumber', 'Virtual');
                this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'MatchedContractName');
                this.riMaintenance.AddVirtualTableCommit(this);
                this.riMaintenance.AddVirtualTable('Premise', 'MatchedPremise');
                this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'MatchedContractNumber', 'Virtual');
                this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', 'MatchedPremiseNumber', 'Virtual');
                this.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual', 'MatchedPremiseName');
                this.riMaintenance.AddVirtualTableCommit(this);
            }
        }
    };
    return PremiseMaintenance1;
}());
