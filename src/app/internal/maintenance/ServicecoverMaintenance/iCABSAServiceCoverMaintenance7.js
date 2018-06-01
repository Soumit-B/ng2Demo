import { MessageConstant } from './../../../../shared/constants/message.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
export var ServiceCoverMaintenance7 = (function () {
    function ServiceCoverMaintenance7(parent) {
        this.parent = parent;
        this.context = parent;
    }
    ServiceCoverMaintenance7.prototype.CreateTabs = function () {
        this.context.uiDisplay.tab.tab1.visible = true;
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'CompositeProductInd')) {
            this.context.uiDisplay.tab.tab2.visible = true;
        }
        else {
            this.context.uiDisplay.tab.tab2.visible = false;
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            if (this.context.riExchange.URLParameterContains('PendingReduction')) {
                this.context.uiDisplay.tab.tab3.visible = true;
            }
            else {
                this.context.uiDisplay.tab.tab3.visible = false;
            }
        }
        this.context.uiDisplay.tab.tab4.visible = true;
        this.context.uiDisplay.tab.tab5.visible = true;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldShowList') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldShowList').indexOf('VisitCycleInWeeks') === 0 ||
            this.context.riExchange.getCurrentContractType() === 'J' || !this.context.pageParams.blnUseVisitCycleValues) {
            this.context.uiDisplay.tab.tab6.visible = false;
        }
        else {
            this.context.uiDisplay.tab.tab6.visible = true;
        }
        if (this.context.pageParams.boolPropertyCareInd === 'Y' && this.context.pageParams.boolUserWriteAccess === 'yes') {
            this.context.uiDisplay.tab.tab7.visible = true;
        }
        else {
            this.context.uiDisplay.tab.tab7.visible = false;
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd')
            && this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.uiDisplay.tab.tab8.visible = true;
        }
        else {
            this.context.uiDisplay.tab.tab8.visible = false;
        }
        this.context.uiDisplay.tab.tab9.visible = true;
        this.context.uiDisplay.tab.tab10.visible = true;
        if (this.context.pageParams.vbEnableEntitlement &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'EntitlementRequiredInd') &&
            this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.uiDisplay.tab.tab11.visible = true;
        }
        else {
            this.context.uiDisplay.tab.tab11.visible = false;
        }
        if ((this.context.riExchange.riInputElement.checked(this.context.uiForm, 'TrialPeriodInd') ||
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ContractTrialPeriodInd')) &&
            this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.uiDisplay.tab.tab12.visible = true;
        }
        else {
            this.context.uiDisplay.tab.tab12.visible = false;
        }
        this.context.uiDisplay.tab.tab13.visible = true;
        if (this.context.pageParams.vEnableSurveyDetail) {
            this.context.uiDisplay.tab.tab14.visible = true;
        }
        else {
            this.context.uiDisplay.tab.tab14.visible = false;
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            this.context.uiDisplay.tab.tab15.visible = true;
        }
        else {
            this.context.uiDisplay.tab.tab15.visible = false;
        }
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ServiceCommenceDate', false);
            this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ServiceVisitFrequency', false);
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_BeforeSave = function () {
        this.context.pageParams.verror = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CompositeProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelectCompositeProductCode'));
        if (this.context.pageParams.uiDisplay.trServiceAnnualValue === false
            && this.context.riExchange.URLParameterContains('PendingReduction')) {
            this.context.showAlert('Service Covers Can Only Be Reduced Where Value Is Required');
            this.context.pageParams.verror = true;
            return;
        }
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selTaxCode') &&
            !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCode')) {
            this.context.showAlert('Tax Code Is Required');
            this.context.pageParams.verror = true;
            return;
        }
        if (this.context.pageParams.blnUseVisitCycleValues) {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks') &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks') === '0') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeks', '');
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'VisitCycleInWeeks', true);
                return;
            }
            else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle') &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle') === '0') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitsPerCycle', '');
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'VisitsPerCycle', true);
                return;
            }
            if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VFPNumberOfWeeks') !==
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks')) &&
                this.context.utils.len(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeksOverrideNote')) < 10) {
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', true);
                return;
            }
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVisitTime') &&
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'HardSlotVisitTime')) {
            var iHour = this.context.utils.mid(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVisitTime'), 1, this.context.utils.len(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVisitTime')) - 3);
            if (parseInt(iHour, 10) > 23) {
                this.context.showAlert('Hard Slot Visit Time Do Not Accept 24:00');
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'HardSlotVisitTime', true);
                this.context.pageParams.verror = true;
                return;
            }
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CallLogID', this.context.riExchange.getParentHTMLValue('CurrentCallLogID'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', 'Y');
        if (this.context.pageParams.vEnableInsEmpCodeValidation) {
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                if (this.context.InStr('FieldShowList', 'InstallationValue') !== -1) {
                    if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations') === '0') {
                        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InstallationEmployeeCode')) {
                            this.context.showAlert('Installation Employee Must Not Be Blank');
                            this.context.pageParams.uiDisplay.trInstallationEmployee = true;
                            this.context.renderTab(5);
                            this.context.pageParams.verror = true;
                            return;
                        }
                    }
                }
            }
        }
        if (this.context.pageParams.verror === false) {
            if (this.context.pageParams.blnServiceVisitAnnivDateChange
                && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate')) {
                if (this.context.utils.year(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'))
                    !== this.context.utils.year(new Date())) {
                    this.context.showDialog('Effective Date Is Not In Current Year - Do You Wish To Continue ', this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd);
                }
            }
            else {
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd();
            }
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_BeforeSaveContd = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PatternWarningString', '');
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceSpecialInstructions')) {
            this.context.pageParams.blnServiceSpecialInstructions = true;
        }
        this.context.pageParams.strFunctions = 'CheckLength,';
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd && this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'CheckVisitPattern,';
            this.context.riMaintenance.CBORequestAdd('ContractNumber');
            this.context.riMaintenance.CBORequestAdd('PremiseNumber');
        }
        this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=' + this.context.utils.Left(this.context.pageParams.strFunctions, this.context.utils.len(this.context.pageParams.strFunctions) - 1);
        this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceSpecialInstructions')) {
            this.context.riMaintenance.CBORequestAdd('ServiceSpecialInstructions');
        }
        this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.CBORequestExecute(this.context, function (data) {
            if (data) {
                this.context.riMaintenance.renderResponseForCtrl(this.context, data);
            }
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveFirstCallback();
        });
    };
    ServiceCoverMaintenance7.prototype.handlesaveClick = function () {
        this.context.saveClicked = true;
        this.context.utils.highlightTabs();
        if (this.context.riExchange.validateForm(this.context.uiForm)) {
            this.context.renderTab(1);
            this.context.showDialog(MessageConstant.Message.ConfirmRecord, this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSave);
        }
        else {
            this.context.saveClicked = false;
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_BeforeSaveFirstCallback = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PatternWarningString')) {
            var msgTextR = this.context.getControlValue('PatternWarningString');
            var msg = 'Visit Patterns Exist : ' +
                msgTextR.replace('/*NL*/', String.fromCharCode(10) + String.fromCharCode(13)) +
                String.fromCharCode(10) + String.fromCharCode(13) +
                'Do You Wish To Continue ?';
            this.context.showDialog(msg, this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd1);
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd1();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_BeforeSaveContd1 = function () {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd && this.context.pageParams.vSCValidateInvoiceTypeOnNewSC) {
            this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=ValidateInvoiceType';
            this.context.riMaintenance.CBORequestAdd('ContractNumber');
            this.context.riMaintenance.CBORequestAdd('InvoiceTypeNumber');
            this.context.riMaintenance.CBORequestExecute(this.context, function (data) {
                if (data) {
                    this.context.riMaintenance.renderResponseForCtrl(this.context, data);
                }
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveSecondCallback();
            });
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveSecondCallback();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_BeforeSaveSecondCallback = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCoverInvTypeString')) {
            this.context.showDialog('Other Invoice Types Exist On Service Covers For This Contract : ' + String.fromCharCode(10) + String.fromCharCode(13), this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd2);
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd2();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_BeforeSaveContd2 = function () {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaCode')
                !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'oriBranchServiceAreaCode')) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.PostDataAdd('Function', 'GetTechRetentionInd', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('MessageDisplay', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data) {
                if (data['MessageDisplay'] !== '') {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MessageDisplay', data['MessageDisplay']);
                    this.context.showDialog(data['MessageDisplay'], this.context.iCABSAServiceCoverMaintenance7.continueBeforeSave);
                }
                else {
                    this.context.iCABSAServiceCoverMaintenance7.continueBeforeSave();
                }
            }, 'POST');
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.continueBeforeSave();
        }
    };
    ServiceCoverMaintenance7.prototype.continueBeforeSave = function () {
        this.context.iCABSAServiceCoverMaintenance5.GetServiceAreaRequired();
        this.context.iCABSAServiceCoverMaintenance5.ValidateServiceArea();
        this.context.iCABSAServiceCoverMaintenance5.ValidateVisitPattern();
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
            this.context.riExchange.getCurrentContractType() === 'J' &&
            this.context.pageParams.uiDisplay.trServiceVisitFrequency &&
            this.context.pageParams.uiDisplay.trServiceAnnualValue) {
            if ((this.context.utils.CInt(this.context.pageParams.SavedServiceVisitFrequency) !== this.context.CInt('ServiceVisitFrequency'))
                || (this.context.utils.cCur(this.context.pageParams.SavedServiceAnnualValue) !== this.context.cCur('ServiceAnnualValue'))) {
                this.context.riMaintenance.clear();
                this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
                this.context.riMaintenance.PostDataAdd('Function', 'JobServiceVisitCheck', MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
                this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID'), MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('InvoiceTypeNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeNumber'), MntConst.eTypeInteger);
                this.context.riMaintenance.ReturnDataAdd('MessageDisplay', MntConst.eTypeText);
                this.context.riMaintenance.Execute(this.context, function (data) {
                    if (data['MessageDisplay'] !== '') {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MessageDisplay', data['MessageDisplay']);
                        this.context.showDialog(data['MessageDisplay'], this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd3);
                    }
                    else {
                        this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd3();
                    }
                }, 'POST');
            }
            else {
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd3();
            }
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd3();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_BeforeSaveContd3 = function () {
        this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strEntryProcedure;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessage')) {
            this.context.showAlert(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessage'));
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ErrorMessage', '');
        }
        if (this.context.parentMode === 'ContactAdd') {
            this.context.setControlValue('LostBusinessRequestNumber', this.context.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));
        }
        if (this.context.riExchange.URLParameterContains('PendingReduction')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingReduction', 'PendingReduction');
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingReduction', '');
        }
        if (this.context.riExchange.URLParameterContains('PendingDeletion')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingDeletion', 'PendingDeletion');
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingDeletion', '');
        }
        this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ContractTypeCode=' + this.context.riExchange.getCurrentContractType();
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selServiceBasis') === 'H') {
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotTemplateNumber')) {
                this.context.showAlert('There is no Hard Slot Template Number assigned.');
                return;
            }
            else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotType') === 'S'
                && !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVisitTime')) {
                this.context.showAlert('Hard Slot Vist Time is required.');
                return;
            }
            else {
                this.context.riMaintenance.clear();
                this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
                this.context.riMaintenance.PostDataAdd('Function', 'ValidateHardSlot', MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
                this.context.riMaintenance.PostDataAdd('LastChangeEffectDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'), MntConst.eTypeDate);
                this.context.riMaintenance.PostDataAdd('ServiceVisitAnnivDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitAnnivDate'), MntConst.eTypeDate);
                this.context.riMaintenance.PostDataAdd('ServiceCommenceDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate'), MntConst.eTypeDate);
                this.context.riMaintenance.PostDataAdd('ServiceVisitFrequency', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), MntConst.eTypeInteger);
                this.context.riMaintenance.PostDataAdd('HardSlotTemplateNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotTemplateNumber'), MntConst.eTypeInteger);
                this.context.riMaintenance.PostDataAdd('ServiceBranchNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBranchNumber'), MntConst.eTypeInteger);
                this.context.riMaintenance.PostDataAdd('HardSlotVisitTime', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVisitTime'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart01', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart01'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart02', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart02'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart03', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart03'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart04', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart04'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart05', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart05'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart06', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart06'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart07', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart07'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart08', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart08'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart09', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart09'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart10', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart10'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart11', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart11'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart12', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart12'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart13', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart13'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowStart14', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowStart14'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd01', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd01'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd02', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd02'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd03', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd03'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd04', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd04'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd05', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd05'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd06', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd06'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd07', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd07'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd08', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd08'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd09', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd09'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd10', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd10'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd11', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd11'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd12', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd12'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd13', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd13'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('WindowEnd14', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowEnd14'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('HardSlotType', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotType'), MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('PremiseNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'), MntConst.eTypeInteger);
                this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID'), MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('ActualPlannedTime', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ActualPlannedTime'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('StandardTreatmentTime', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'StandardTreatmentTime'), MntConst.eTypeTime);
                this.context.riMaintenance.PostDataAdd('BranchServiceAreaCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaCode'), MntConst.eTypeCode);
                this.context.riMaintenance.ReturnDataAdd('MessageDisplay', MntConst.eTypeText);
                this.context.riMaintenance.Execute(this.context, function (data) {
                    if (data['MessageDisplay'] !== '') {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MessageDisplay', data['MessageDisplay']);
                        this.context.showDialog(data['MessageDisplay'], this.context.iCABSAServiceCoverMaintenance7.riExchange_CBORequest);
                    }
                    this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
                });
            }
        }
        else {
            this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        }
    };
    ServiceCoverMaintenance7.prototype.saveRecord = function () {
        var action = 2;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            action = 1;
        }
        var fieldsArr = this.context.riExchange.getAllCtrl(this.context.controls);
        this.context.riMaintenance.clear();
        for (var i = 0; i < fieldsArr.length; i++) {
            var id = fieldsArr[i];
            var dataType = this.context.riMaintenance.getControlType(this.context.controls, id, 'type');
            var ignore = this.context.riMaintenance.getControlType(this.context.controls, id, 'ignoreSubmit');
            if (!ignore) {
                var value = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, id);
                this.context.riMaintenance.PostDataAdd(id, value, dataType);
            }
        }
        this.context.riMaintenance.Execute(this.context, function (data) {
            if (data.hasError) {
                if (data.errorMessage.trim() !== '') {
                    this.logger.log('Post data Error', data);
                    this.parent.showAlert(data.errorMessage);
                }
            }
            else if (data.statusCode !== '200') {
                this.parent.showAlert(MessageConstant.Message.GeneralError);
            }
            else {
                this.context.showAlert(MessageConstant.Message.SavedSuccessfully, 1);
                this.context.riMaintenance.renderResponseForCtrl(this.context, data);
                this.context.setControlValue('ServiceCoverROWID', this.context.getControlValue('CurrentServiceCoverRowID'));
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave();
            }
        }, 'POST', action);
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSaveAdd = function () {
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelectCompositeProductcode');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        if (this.context.pageParams.vbDefaultTaxCodeProductExpenseReq && this.context.pageParams.vbDefaultTaxCodeProductExpenseLog) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ComponentGridCacheTime', this.context.utils.Time());
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentSelAll');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentDesAll');
        if (this.context.parentMode === 'Premise-Add') {
            this.context.pageParams.ServiceCoverAdded = true;
        }
        if (this.context.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full'
            || this.context.utils.getBranchCode().toString() === this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBranchNumber').toString()
            || this.context.utils.getBranchCode().toString() === this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NegBranchNumber').toString()) {
            this.context.pageParams.blnAccess = true;
        }
        else {
            this.context.pageParams.blnAccess = false;
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode')) {
            this.context.iCABSAServiceCoverMaintenance1.ServiceCoverWasteReq();
        }
        this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd1();
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSaveAdd1 = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DetailRequired')) {
            if (this.context.pageParams.vbLocationsSingleEntry === false) {
            }
            else {
            }
        }
        else if (this.context.pageParams.vbEnableLocations
            && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LocationsEnabled')
            && this.context.InStr('FieldShowList', 'ServiceQuantity') !== -1) {
            this.context.attributes.ServiceCoverRowID = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID');
            this.context.attributes.OutstandingInstallations = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations');
            this.context.attributes.QuantityChange = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'QuantityChange');
            this.context.attributes.DefaultEffectiveDate = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitAnnivDate');
            this.context.attributes.DefaultEffectiveDateProduct = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode');
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            }
            else {
            }
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd2();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSaveAdd2 = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkStockOrder')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GenContractNumber', '');
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'GenContractNumber')) {
            }
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd3();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSaveAdd3 = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            this.context.attributes.Mode = 'New';
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
        }
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
        ;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'InvTypeSel');
        this.context.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        this.context.disableControl('ContractNumber', true);
        this.context.disableControl('PremiseNumber', true);
        this.context.disableControl('ProductCode', true);
        this.context.disableControl('menu', false);
        this.context.initMode(this.context.Mode.UPDATE);
        this.context.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
        if (this.context.pageParams.vbEnableProductServiceType) {
            this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
        }
        this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
        this.context.iCABSAServiceCoverMaintenance1.init();
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSave = function () {
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelectCompositeProductcode');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        if (this.context.pageParams.vbDefaultTaxCodeProductExpenseReq && this.context.pageParams.vbDefaultTaxCodeProductExpenseLog) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ComponentGridCacheTime', this.context.utils.Time());
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentSelAll');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentDesAll');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdHardSlotCalendar');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdDiaryView');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelServiceBasis');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selHardSlotType');
        this.context.pageParams.vbUpdateServiceVisit = false;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelSubjectToUplift');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelUpliftVisitPosition');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoPattern');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoAllocation');
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'origTotalValue', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewTotalValue', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'riGridHandle', '');
        }
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode') !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedWasteTransferType')
            && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode')) {
            this.context.iCABSAServiceCoverMaintenance1.ServiceCoverWasteReq();
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave1();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSave1 = function () {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate
            && this.context.pageParams.vbEnableLocations
            && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LocationsEnabled')
            && this.context.InStr('FieldShowList', 'ServiceQuantity') !== -1
            && (this.context.pageParams.blnQuantityChange || this.context.parentMode === 'ServiceCoverGrid')) {
            this.context.attributes.ServiceCoverRowID = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID');
            this.context.attributes.OutstandingInstallations = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations');
            this.context.attributes.QuantityChange = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'QuantityChange');
            this.context.attributes.DefaultEffectiveDate = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitAnnivDate');
            this.context.attributes.DefaultEffectiveDateProduct = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode');
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                if (!this.context.riExchange.URLParameterContains('PendingReduction')) {
                }
            }
            else {
            }
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave2();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSave2 = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkStockOrder')
            && this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GenContractNumber', '');
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'GenContractNumber')) {
            }
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave3();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSave3 = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')
            && this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.pageParams.vbAnnualTimeChange = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualTimeChange').replace(this.context.pageParams.vbTimeSeparator, '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualTimeChange', '');
            if (this.context.IsNumeric('ServiceVisitFrequency')) {
                if (this.context.CInt('ServiceVisitFrequency') !== this.context.pageParams.SavedServiceVisitFrequency) {
                    this.context.pageParams.vbUpdateServiceVisit = true;
                }
            }
            if (this.context.IsNumeric(this.context.pageParams.vbAnnualTimeChange) && !this.context.pageParams.vbUpdateServiceVisit) {
                if (this.context.pageParams.vbAnnualTimeChange !== 0) {
                    this.context.pageParams.vbUpdateServiceVisit = true;
                }
            }
            if (this.context.pageParams.blnServiceVisitAnnivDateChange && !this.context.pageParams.vbUpdateServiceVisit) {
                this.context.pageParams.vbUpdateServiceVisit = true;
            }
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InitialTreatmentTime') !== this.context.pageParams.SavedInitialTreatmentTime
                && !this.context.pageParams.vbUpdateServiceVisit) {
                this.context.pageParams.vbUpdateServiceVisit = true;
            }
            if (this.context.pageParams.vbUpdateServiceVisit) {
                this.context.attributes.Mode = 'Update';
            }
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave4();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSave4 = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ShowValueButton') && this.context.pageParams.blnValueRequired) {
            this.context.pageParams.uiDisplay.cmdValue = true;
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdValue');
        }
        else {
            this.context.pageParams.uiDisplay.cmdValue = false;
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdValue');
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RenegOldValue', '0');
        if (this.context.parentMode !== 'Premise-Add'
            || !this.context.riExchange.getParentAttributeValue('RenegContract')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'chkRenegContract', false);
            this.context.iCABSAServiceCoverMaintenance3.chkRenegContract_onclick();
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
            this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
            this.context.InStr('FieldShowList', 'ServiceQuantity') !== -1 &&
            !this.context.riExchange.URLParameterContains('PendingReduction') &&
            (this.context.pageParams.blnQuantityChange || this.context.pageParams.blnValueChange)) {
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave5();
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterSave5 = function () {
        this.context.iCABSAServiceCoverMaintenance8.ResetPriceChangeVariable();
        this.context.iCABSAServiceCoverMaintenance1.riMaintenance_AfterFetch();
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCopyServiceCover');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'InvTypeSel');
        if (this.context.pageParams.uiDisplay.trEntitlementServiceQuantity) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'btnDefaultServiceQuantity');
        }
        this.context.iCABSAServiceCoverMaintenance7.HideQuickWindowSet(true);
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd();
        }
        else {
            this.context.iCABSAServiceCoverMaintenance2.riMaintenanceBeforeUpdate();
        }
    };
    ServiceCoverMaintenance7.prototype.btnDepositAdd_OnClick = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositAddAdditional', 'Y');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DepositDate');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DepositAmount');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositDate', '');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositAmount', '');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositAmountApplied', '');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositPostedDate', '');
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_AfterAbandon = function () {
        this.context.pageParams.uiDisplay.trDepositLineAdd = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositAddAdditional', 'N');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositAmount');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositDate');
        this.context.iCABSAServiceCoverMaintenance8.EnableRMMFields();
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCalcInstalment');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelectCompositeProductcode');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        if (this.context.pageParams.vbDefaultTaxCodeProductExpenseReq && this.context.pageParams.vbDefaultTaxCodeProductExpenseLog) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }
        this.context.iCABSAServiceCoverMaintenance2.HardSlotType_OnChange();
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selTaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCode'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ComponentGridCacheTime', this.context.utils.Time());
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentSelAll');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentDesAll');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdDiaryView');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelServiceBasis');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selHardSlotType');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoPattern');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoAllocation');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelSubjectToUplift');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelUpliftVisitPosition');
        this.context.pageParams.vbAbandon = true;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selServiceBasis') === 'H') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdHardSlotCalendar');
        }
        else {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdHardSlotCalendar');
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            if (this.context.riExchange.URLParameterContains('PendingReduction')) {
                this.context.iCABSAServiceCoverMaintenance3.BuildDisplayGrid();
                this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
                do {
                } while (this.context.riExchange.Busy);
            }
        }
        this.context.iCABSAServiceCoverMaintenance4.ShowFields();
        this.context.pageParams.vbAbandon = false;
        this.context.iCABSAServiceCoverMaintenance8.ResetPriceChangeVariable();
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber')) {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InactiveEffectDate')) {
                this.context.pageParams.uiDisplay.labelInactiveEffectDate = true;
                this.context.pageParams.uiDisplay.InactiveEffectDate = true;
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SCLostBusinessDesc')) {
                    this.context.pageParams.uiDisplay.tdReasonLab = true;
                    this.context.pageParams.uiDisplay.tdReason = true;
                    this.context.pageParams.SCLostBusinessDesc_title =
                        this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'scLostBusinessDesc2') + '10' +
                            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'scLostBusinessDesc3');
                }
                else {
                    this.context.pageParams.uiDisplay.tdReasonLab = false;
                    this.context.pageParams.uiDisplay.tdReason = false;
                }
            }
            else {
                this.context.pageParams.uiDisplay.labelInactiveEffectDate = false;
                this.context.pageParams.uiDisplay.InactiveEffectDate = false;
                this.context.pageParams.uiDisplay.tdReasonLab = false;
                this.context.pageParams.uiDisplay.tdReason = false;
            }
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ShowValueButton')
                && this.context.pageParams.blnValueRequired) {
                this.context.pageParams.uiDisplay.cmdValue = true;
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdValue');
            }
            else {
                this.context.pageParams.uiDisplay.cmdValue = false;
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdValue');
            }
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualTimeChange', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualValueChange', '0');
            this.context.riExchange.riInputElement.isCorrect(this.context.uiForm, 'AnnualValueChange');
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValueChange', '0');
                this.context.riExchange.riInputElement.isCorrect(this.context.uiForm, 'UnitValueChange');
                this.context.pageParams.uiDisplay.trUnitValue = true;
            }
            if (this.context.pageParams.blnAccess && this.context.pageParams.blnValueRequired) {
                this.context.pageParams.uiDisplay.trServiceAnnualValue = true;
            }
            else {
                this.context.pageParams.uiDisplay.trServiceAnnualValue = false;
            }
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkFOC')) {
                this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = true;
                this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = true;
            }
            else {
                this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = false;
                this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = false;
            }
        }
        this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
        this.context.pageParams.uiDisplay.trInstallationEmployee = false;
        this.context.pageParams.uiDisplay.trOutstandingRemovals = false;
        this.context.pageParams.uiDisplay.trRemovalEmployee = false;
        this.context.pageParams.uiDisplay.trEffectiveDate = false;
        this.context.pageParams.uiDisplay.trInstallationValue = false;
        this.context.pageParams.uiDisplay.trRefreshDisplayVal = true;
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkRenegContract')) {
            this.context.pageParams.uiDisplay.tdRenegOldContract = false;
        }
        this.context.iCABSAServiceCoverMaintenance7.HideQuickWindowSet(true);
        if (this.context.riMaintenance.RecordSelected(false)) {
            this.context.pageParams.uiDisplay.trInvoiceSuspend = true;
        }
        else {
            this.context.pageParams.uiDisplay.trInvoiceSuspend = false;
        }
        this.context.iCABSAServiceCoverMaintenance3.ToggleEntitlementRequired();
        this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
        this.context.iCABSAServiceCoverMaintenance7.BuildInvoiceTypeSelect();
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'InvTypeSel');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCopyServiceCover');
        if (this.context.pageParams.uiDisplay.trEntitlementServiceQuantity) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'btnDefaultServiceQuantity');
        }
        if (this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.iCABSAServiceCoverMaintenance2.ServiceBasis_OnChange();
        }
        this.context.iCABSAServiceCoverMaintenance5.AutoPattern_OnChange();
        this.context.iCABSAServiceCoverMaintenance5.AutoAllocation_OnChange();
        if (this.context.pageParams.uiDisplay.trMultipleTaxRates) {
            this.context.iCABSAServiceCoverMaintenance3.MultipleTaxRates_onClick();
        }
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
        ;
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_BeforeAbandon = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotUpdate') === 'Yes') {
            this.context.iCABSAServiceCoverMaintenance7.HardSlotTemplateRemove();
        }
    };
    ServiceCoverMaintenance7.prototype.riExchange_QueryUnloadHTMLDocument = function () {
        if (this.context.parentMode === 'Premise-Add') {
            if (!this.context.pageParams.ServiceCoverAdded) {
            }
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_Search = function () {
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber')) {
            this.context.iCABSAServiceCoverMaintenance7.ContractNumberSelection();
        }
        function riMaintenance_Search_Callback1() {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber')) {
                this.context.iCABSAServiceCoverMaintenance7.PremiseNumberSelection(riMaintenance_Search_Callback2);
            }
        }
        function riMaintenance_Search_Callback2() {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber')) {
                this.context.iCABSAServiceCoverMaintenance7.ProductCodeSelection();
            }
        }
    };
    ServiceCoverMaintenance7.prototype.BuildInvoiceTypeSelect = function () {
        var ValArray;
        var DescArray;
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeVal')) {
            this.context.pageParams.uiDisplay.trInvoiceType = false;
        }
        else {
            ValArray = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeVal').split('|');
            DescArray = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeDesc').split('|');
            if (ValArray && DescArray) {
                for (var i = 0; i < ValArray.length; i++) {
                    var obj = {
                        text: DescArray[i],
                        value: ValArray[i]
                    };
                    this.context.pageParams.InvTypeSel.push(obj);
                }
            }
            this.context.setControlValue('InvTypeSel', this.context.getControlValue('InvoiceTypeNumber'));
            if (this.context.pageParams.blnValueRequired) {
                this.context.pageParams.uiDisplay.trInvoiceType = true;
            }
            else {
                this.context.pageParams.uiDisplay.trInvoiceType = false;
            }
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev) {
            this.context.iCABSAServiceCoverMaintenance6.IsVisitTriggered();
        }
    };
    ServiceCoverMaintenance7.prototype.BuildMenuOptions = function () {
        var cEmployeeLimitChildDrillOptions = this.context.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions');
        this.context.setControlValue('EmployeeLimitChildDrillOptions', this.context.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions'));
        var objPortfolioGroup = [];
        var objHistoryGroup = [];
        var objInvoicingGroup = [];
        var objServiceGroup = [];
        var objCustomerGroup = [];
        if (this.context.pageParams.cEmployeeLimitChildDrillOptions !== 'Y') {
            objPortfolioGroup.push({ value: 'Contract', label: 'Contract' });
            objPortfolioGroup.push({ value: 'Premise', label: 'Premises' });
        }
        if (this.context.pageParams.vbEnableServiceCoverDetail) {
            objPortfolioGroup.push({ value: 'ServiceDetail', label: 'Service Detail' });
        }
        if (this.context.pageParams.uiDisplay.trLinkedProduct === true) {
            objPortfolioGroup.push({ value: 'LinkedProducts', label: 'Linked Products' });
        }
        objPortfolioGroup.push({ value: 'TeleSalesOrderLine', label: 'Telesales Order Line' });
        objHistoryGroup.push({ value: 'History', label: 'Service Cover History' });
        objHistoryGroup.push({ value: 'EventHistory', label: 'Event History' });
        objHistoryGroup.push({ value: 'ServiceValue', label: 'Service Value' });
        if (this.context.pageParams.blnEnableDOWSentricon) {
            objHistoryGroup.push({ value: 'DOWServiceValue', label: 'DOW Service Value' });
        }
        objHistoryGroup.push({ value: 'SalesStatsAdjustment', label: 'Adjust Sales Stats' });
        objInvoicingGroup.push({ value: 'ProRata', label: 'Pro Rata Charge' });
        objInvoicingGroup.push({ value: 'InvoiceHistory', label: 'Invoice History' });
        if (this.context.pageParams.vEnableTabularView) {
            objServiceGroup.push({ value: 'PlanVisit', label: 'Planned Visits Grid' });
            objServiceGroup.push({ value: 'PlanVisitTabular', label: 'Planned Visits Table' });
        }
        else {
            objServiceGroup.push({ value: 'PlanVisit', label: 'Planned Visits' });
        }
        objServiceGroup.push({ value: 'StaticVisit', label: 'Static Visits (SOS)' });
        objServiceGroup.push({ value: 'VisitHistory', label: 'Visit History' });
        if (this.context.riExchange.getCurrentContractType() === 'C' || this.context.riExchange.getCurrentContractType() === 'J') {
            objServiceGroup.push({ value: 'ServiceVisitPlanning', label: 'Service Visit Planning' });
        }
        if (this.context.pageParams.vbEnableLocations) {
            objServiceGroup.push({ value: 'Location', label: 'Service Cover Locations' });
        }
        if (this.context.riExchange.getCurrentContractType() === 'C') {
            objServiceGroup.push({ value: 'SeasonalService', label: 'Service Seasons' });
            objServiceGroup.push({ value: 'ServiceCalendar', label: 'Service Calendar' });
            objServiceGroup.push({ value: 'ClosedCalendar', label: 'Service Closed Calendar' });
        }
        objServiceGroup.push({ value: 'Service Recommendations', label: 'Service Recommendations' });
        objServiceGroup.push({ value: 'StateOfService', label: 'State Of Service' });
        objServiceGroup.push({ value: 'ServiceCoverWaste', label: 'Service Cover Waste' });
        objServiceGroup.push({ value: 'TreatmentPlan', label: 'Treatment Plan' });
        if (this.context.pageParams.vShowWasteHistory === true) {
            objServiceGroup.push({ value: 'WasteConsignmentNoteHistory', label: 'Waste Consignment Note History' });
        }
        if (this.context.pageParams.vEnableServiceCoverDispLev === true) {
            objServiceGroup.push({ value: 'ServiceCoverDisplays', label: 'Service Cover Displays' });
        }
        if (this.context.pageParams.vSCVisitTolerances === true) {
            objServiceGroup.push({ value: 'VisitTolerances', label: 'Visit Tolerances' });
        }
        if (this.context.pageParams.vSCInfestationTolerances === true) {
            objServiceGroup.push({ value: 'InfestationTolerances', label: 'Infestation Tolerances' });
        }
        if (this.context.pageParams.lEnableQualificationOption === true) {
            objServiceGroup.push({ value: 'Qualifications', label: 'Qualifications' });
        }
        objCustomerGroup.push({ value: 'ContactManagement', label: 'Contact Management' });
        objCustomerGroup.push({ value: 'ContactManagementSearch', label: 'Contact Centre Search' });
        objCustomerGroup.push({ value: 'CustomerInformation', label: 'Customer Information' });
        this.context.pageParams.menu = [
            { OptionGrp: 'Portfolio', Options: objPortfolioGroup },
            { OptionGrp: 'History', Options: objHistoryGroup },
            { OptionGrp: 'Invoicing', Options: objInvoicingGroup },
            { OptionGrp: 'Servicing', Options: objServiceGroup },
            { OptionGrp: 'Customer Relations', Options: objCustomerGroup }
        ];
        this.context.setControlValue('menu', 'Options');
    };
    ServiceCoverMaintenance7.prototype.ContractNumberSelection = function (callback) {
        if (this.context.contractSearch) {
            this.context.openSearchModal(this.context.contractSearch, callback);
        }
    };
    ServiceCoverMaintenance7.prototype.PremiseNumberSelection = function (callback) {
        if (this.context.premiseSearch) {
            this.context.openSearchModal(this.context.premiseSearch, callback);
        }
    };
    ServiceCoverMaintenance7.prototype.APTChangedAccordingToQuantity = function () {
        if (this.context.pageParams.vSCEnableAPTByServiceType) {
            var APTFound_1;
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.context.riMaintenance.PostDataAdd('PostDesc', 'NewAPTValue', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('ServiceQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('LastChangeEffectDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'), MntConst.eTypeDate);
            this.context.riMaintenance.PostDataAdd('ServiceTypeCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceTypeCode'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('ActualPlannedTime', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('APTFound', MntConst.eTypeCheckBox);
            this.context.riMaintenance.Execute(this.context, function (data) {
                APTFound_1 = data['APTFound'];
                if (APTFound_1) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ActualPlannedTime', data['ActualPlannedTime']);
                }
            }, 'POST');
        }
    };
    ServiceCoverMaintenance7.prototype.riMaintenance_BeforeFetch = function () {
        this.context.pageParams.strFunctions = '';
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber')) {
            this.context.pageParams.strFunctions = 'GetServiceDetails,GetShowFields,';
            this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=' + this.context.utils.Left(this.context.pageParams.strFunctions, this.context.utils.len(this.context.pageParams.strFunctions));
            this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.CBORequestAdd('ContractNumber');
            this.context.riMaintenance.CBORequestAdd('PremiseNumber');
            this.context.riMaintenance.CBORequestAdd('ProductCode');
            this.context.riMaintenance.CBORequestAdd('ServiceBranchNumber');
            this.context.riMaintenance.CBORequestExecute(this.context, function (data) {
                if (data) {
                    this.context.riMaintenance.renderResponseForCtrl(this.context, data);
                }
                this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strEntryProcedure;
                if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessage')) {
                    this.context.iCABSAServiceCoverMaintenance4.ShowFields();
                }
            });
        }
        this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ContractTypeCode=' + this.context.riExchange.getCurrentContractType();
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
        ;
    };
    ServiceCoverMaintenance7.prototype.ProductCodeSelection = function () {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.context.pageParams.vbEnableProductServiceType) {
                this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
            }
            this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
        }
        else {
            this.context.serviceCoverSearch.openModal();
        }
    };
    ServiceCoverMaintenance7.prototype.ServiceTypeCode_ondeactivate = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceTypeCode')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeDesc', '');
        }
    };
    ServiceCoverMaintenance7.prototype.ServiceTypeCode_onChange = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceTypeCode')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeDesc', '');
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.APTChangedAccordingToQuantity();
            this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
        }
    };
    ServiceCoverMaintenance7.prototype.CheckServiceNotifyInd = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceNotifyInd', true);
    };
    ServiceCoverMaintenance7.prototype.GuaranteeRequired_onclick = function () {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'GuaranteeRequired')) {
            this.context.iCABSAServiceCoverMaintenance7.CreateTabs();
            this.context.renderTab(4);
        }
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
    };
    ServiceCoverMaintenance7.prototype.GuaranteeToggle = function () {
        if (this.context.pageParams.boolPropertyCareInd === 'Y') {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'GuaranteeRequired')) {
                this.context.pageParams.uiDisplay.trGuaranteeExpiry15 = true;
                this.context.pageParams.uiDisplay.trGuaranteeCommence15 = true;
                this.context.pageParams.uiDisplay.trNoGuaranteeReason = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'NoGuaranteeCode', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'NoGuaranteeCode', false);
                this.context.pageParams.uiDisplay.trNumberBedrooms = true;
                this.context.pageParams.uiDisplay.trAgeOfPropertyLabel = true;
                this.context.pageParams.uiDisplay.trListedBuilding = true;
            }
            else {
                this.context.pageParams.uiDisplay.trGuaranteeExpiry15 = false;
                this.context.pageParams.uiDisplay.trGuaranteeCommence15 = false;
                this.context.pageParams.uiDisplay.trNoGuaranteeReason = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'NoGuaranteeCode', true);
                this.context.pageParams.uiDisplay.trNumberBedrooms = false;
                this.context.pageParams.uiDisplay.trAgeOfPropertyLabel = false;
                this.context.pageParams.uiDisplay.trListedBuilding = false;
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GuaranteeCommence', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GuaranteeExpiry', '');
            }
        }
    };
    ServiceCoverMaintenance7.prototype.SeasonalServiceInd_onclick = function () {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'SeasonalServiceInd')) {
            this.context.iCABSAServiceCoverMaintenance7.ToggleSeasonalDates();
        }
    };
    ServiceCoverMaintenance7.prototype.DOWSentriconInd_onclick = function () {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'DOWSentriconInd')) {
            this.context.iCABSAServiceCoverMaintenance7.DOWSentriconToggle();
        }
    };
    ServiceCoverMaintenance7.prototype.DOWSentriconToggle = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DOWSentriconInd')) {
            this.context.pageParams.uiDisplay.trDOWInstall = true;
            this.context.pageParams.uiDisplay.trDOWProduct = true;
            this.context.pageParams.uiDisplay.trDOWPerimeter = true;
            if (this.context.riExchange.getCurrentContractType() === 'C' &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DOWRenewalDate')) {
                this.context.pageParams.uiDisplay.trDOWRenewalDate = true;
            }
            else {
                this.context.pageParams.uiDisplay.trDOWRenewalDate = false;
            }
            if (this.context.InStr('FieldShowList', 'PerimeterValue') !== -1) {
                this.context.pageParams.uiDisplay.trPerimeterValue = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'PerimeterValue', false);
            }
        }
        else {
            this.context.pageParams.uiDisplay.trDOWInstall = false;
            this.context.pageParams.uiDisplay.trDOWProduct = false;
            this.context.pageParams.uiDisplay.trDOWPerimeter = false;
            this.context.pageParams.uiDisplay.trDOWRenewalDate = false;
            if (this.context.InStr('FieldShowList', 'PerimeterValue') !== -1) {
                this.context.pageParams.uiDisplay.trPerimeterValue = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'PerimeterValue', true);
            }
        }
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'DOWInstallTypeCode', this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DOWSentriconInd'));
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'DOWProductCode', this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DOWSentriconInd'));
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'DOWPerimeterValue', this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DOWSentriconInd'));
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DOWSentriconInd');
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DOWRenewalDate')) {
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DOWInstallTypeCode');
            }
            else {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DOWInstallTypeCode');
            }
        }
        else if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DOWRenewalDate');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DOWSentriconInd');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DOWInstallTypeCode');
        }
    };
    ServiceCoverMaintenance7.prototype.ToggleSeasonalDates = function () {
        this.context.iCABSAServiceCoverMaintenance7.CreateTabs();
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd')) {
            this.context.iCABSAServiceCoverMaintenance7.InitialiseSeasonalService();
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.ShowHideSeasonRow(1, false);
        }
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'NumberOfSeasons', this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd'));
    };
    ServiceCoverMaintenance7.prototype.cmdDOWServiceValue_onclick = function () {
        alert(' Open iCABSADOWServiceValueGrid wheh available');
    };
    ServiceCoverMaintenance7.prototype.MinCommitQty_onclick = function () {
        this.context.iCABSAServiceCoverMaintenance3.MinCommitQtyToggle();
    };
    ServiceCoverMaintenance7.prototype.TrialPeriodInd_onClick = function () {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'TrialPeriodInd') &&
            this.context.pageParams.uiDisplay.tdTrialPeriodInd) {
            this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
        }
    };
    ServiceCoverMaintenance7.prototype.ToggleTrialPeriodStatus = function () {
        this.context.pageParams.blnRequired = this.context.riExchange.riInputElement.checked(this.context.uiForm, 'TrialPeriodInd');
        this.context.pageParams.blnTrialReleased = this.context.riExchange.riInputElement.checked(this.context.uiForm, 'TrialPeriodReleasedInd');
        this.context.iCABSAServiceCoverMaintenance7.CreateTabs();
        this.context.riMaintenance.SetRequiredStatus('TrialPeriodEndDate', this.context.pageParams.blnRequired);
        this.context.riMaintenance.SetRequiredStatus('TrialPeriodChargeValue', this.context.pageParams.blnRequired);
        this.context.riMaintenance.SetRequiredStatus('ProposedAnnualValue', this.context.pageParams.blnRequired);
        if (!this.context.pageParams.blnRequired) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TrialPeriodEndDate', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TrialPeriodChargeValue', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProposedAnnualValue', '');
            this.context.riMaintenance.SetErrorStatus('TrialPeriodEndDate', false);
            this.context.riMaintenance.SetErrorStatus('TrialPeriodChargeValue', false);
            this.context.riMaintenance.SetErrorStatus('ProposedAnnualValue', false);
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd &&
                !this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkFOC')) {
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.riMaintenance.EnableInput('UnitValue');
                }
                this.context.riMaintenance.EnableInput('ServiceAnnualValue');
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'chkFOC');
            }
        }
        if (this.context.pageParams.blnRequired && this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate') &&
                this.context.riExchange.riInputElement.isCorrect(this.context.uiForm, 'ServiceCommenceDate')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TrialPeriodStartDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate'));
            }
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue') &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProposedAnnualValue')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProposedAnnualValue', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue'));
            }
            else {
                if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProposedAnnualValue')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProposedAnnualValue', '0');
                }
            }
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualValue', '0');
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TrialPeriodChargeValue')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TrialPeriodChargeValue', '0');
            }
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'UnitValue');
            }
            this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'ServiceAnnualValue');
            this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'ProposedAnnualValue');
            this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'TrialPeriodChargeValue');
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                this.context.riMaintenance.DisableInput('UnitValue');
            }
            this.context.riMaintenance.DisableInput('ServiceAnnualValue');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'chkFOC');
        }
        else if (this.context.pageParams.blnRequired && this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.riMaintenance.DisableInput('TrialPeriodChargeValue');
            if (this.context.pageParams.blnTrialReleased) {
                this.context.riMaintenance.DisableInput('TrialPeriodEndDate');
                this.context.riMaintenance.DisableInput('ProposedAnnualValue');
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ProposedAnnualValue', false);
            }
            else {
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.riMaintenance.DisableInput('UnitValue');
                    this.context.riMaintenance.DisableInput('UnitValueChange');
                }
                this.context.riMaintenance.DisableInput('ServiceAnnualValue');
                this.context.riMaintenance.DisableInput('AnnualValueChange');
            }
        }
    };
    ServiceCoverMaintenance7.prototype.InitialiseSeasonalService = function () {
        if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NumberOfSeasons') === '') &&
            this.context.riMaintenance.CurrentMode !== MntConst.eModeSelect) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NumberOfSeasons', '1');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FixedNumberOfSeasons', '1');
        }
        this.context.iCABSAServiceCoverMaintenance7.ShowSeasonalRows();
    };
    ServiceCoverMaintenance7.prototype.HardSlotTemplateRemove = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('Function', 'HardSlotTemplateRemove', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('HardSlotTemplateNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotTemplateNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('HardSlotVersionNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVersionNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.Execute(this.context, function (data) {
        });
    };
    ServiceCoverMaintenance7.prototype.selUpliftVisitPosition_onChange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UpliftVisitPosition', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selUpliftVisitPosition'));
    };
    ServiceCoverMaintenance7.prototype.ShowSeasonalRows = function (event) {
        if (event) {
            if (!this.context.fieldValidateTransform(event)) {
                return;
            }
        }
        var arrSeasonsVisible = [false, false, false, false, false, false, false, false];
        var arrSeasonsEnabled = [false, false, false, false, false, false, false, false];
        var arrVisitsEnabled = [true, true, true, true, true, true, true, true];
        var iNumberOfSeasons = -1;
        var iFixedNumberOfSeasons = -1;
        var iVisitCount = 0;
        iNumberOfSeasons = this.context.CInt('NumberOfSeasons');
        iFixedNumberOfSeasons = this.context.CInt('FixedNumberOfSeasons');
        if (iNumberOfSeasons === -1 || iNumberOfSeasons <= 0) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NumberOfSeasons', '1');
            iNumberOfSeasons = 1;
        }
        if (iFixedNumberOfSeasons === -1) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FixedNumberOfSeasons', '0');
            iFixedNumberOfSeasons = 0;
        }
        if (iNumberOfSeasons > 8) {
            iNumberOfSeasons = 8;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NumberOfSeasons', '8');
        }
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (iNumberOfSeasons > iFixedNumberOfSeasons) {
                for (var i = 0; i < 8; i++) {
                    arrSeasonsEnabled[i] = !(iNumberOfSeasons >= (i + 1) && iFixedNumberOfSeasons >= (i + 1));
                }
            }
            else {
                iNumberOfSeasons = iFixedNumberOfSeasons;
                for (var i = 0; i < 8; i++) {
                    arrSeasonsEnabled[i] = false;
                }
            }
            this.context.pageParams.blnDisableVisitPattern = false;
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate')) {
                this.context.pageParams.blnDisableVisitPattern = true;
            }
            else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate') &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FirstSeasonStartDate')) {
                this.context.pageParams.blnDisableVisitPattern = false;
            }
            else if (this.context.CDate('LastChangeEffectDate') < this.context.CDate('FirstSeasonStartDate')) {
                this.context.pageParams.blnDisableVisitPattern = true;
            }
            if (this.context.pageParams.blnDisableVisitPattern) {
                for (var i = 0; i < arrVisitsEnabled.length; i++) {
                    arrVisitsEnabled[i] = false;
                }
            }
        }
        else if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            for (var i = 0; i < 8; i++) {
                arrSeasonsEnabled[i] = true;
                arrVisitsEnabled[i] = true;
            }
        }
        for (var i = 8; i > 0; i--) {
            arrSeasonsVisible[i - 1] = (iNumberOfSeasons >= i);
        }
        for (var i = 0; i < arrSeasonsEnabled.length; i++) {
            this.context.iCABSAServiceCoverMaintenance7.EnableSeasonalRow(arrSeasonsEnabled[i], (i + 1));
        }
        for (var i = arrSeasonsVisible.length - 1; i >= 0; i--) {
            this.context.iCABSAServiceCoverMaintenance7.ShowHideSeasonRow((i + 1), arrSeasonsVisible[i]);
        }
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    };
    ServiceCoverMaintenance7.prototype.ShowHideSeasonRow = function (ipSeason, ipVisible) {
        var strDisplay;
        var trRow;
        if (ipVisible) {
            strDisplay = true;
        }
        else {
            strDisplay = false;
        }
        this.context.pageParams.uiDisplay.Seasons[ipSeason - 1].trRow = strDisplay;
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonNumber' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalFromDate' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalFromWeek' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalFromYear' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalToDate' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalToWeek' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalToYear' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonNoOfVisits' + ipSeason, ipVisible);
    };
    ServiceCoverMaintenance7.prototype.EnableSeasonalRow = function (ipEnable, ipRow) {
        if (ipEnable) {
            this.context.riMaintenance.EnableInput('SeasonNumber' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalFromDate' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalFromWeek' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalFromYear' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalToDate' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalToWeek' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalToYear' + ipRow);
        }
        else {
            this.context.riMaintenance.DisableInput('SeasonNumber' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalFromDate' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalFromWeek' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalFromYear' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalToDate' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalToWeek' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalToYear' + ipRow);
        }
    };
    ServiceCoverMaintenance7.prototype.HideQuickWindowSet = function (ipHide) {
        var strDisp;
        if (ipHide) {
            strDisp = false;
        }
        else {
            strDisp = true;
            this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('C');
        }
        for (var i = 1; i < 8; i++) {
            this.context.pageParams.uiDisplay['selQuickWindowSet' + i] = strDisp;
        }
    };
    ServiceCoverMaintenance7.prototype.EnableSeasonalVisitRow = function (ipEnable, ipRow) {
        if (ipEnable) {
            this.context.riMaintenance.EnableInput('SeasonNoOfVisits' + ipRow);
        }
        else {
            this.context.riMaintenance.DisableInput('SeasonNoOfVisits' + ipRow);
        }
    };
    ServiceCoverMaintenance7.prototype.EnableSeasonalChanges = function (ipEnable) {
        for (var i = 1; i < 8; i++) {
            this.context.iCABSAServiceCoverMaintenance7.EnableSeasonalRow(ipEnable, i);
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SeasonalTemplateNumber')) {
            this.context.riMaintenance.DisableInput('NumberOfSeasons');
        }
        else {
            this.context.riMaintenance.EnableInput('NumberOfSeasons');
        }
    };
    ServiceCoverMaintenance7.prototype.SeasonalDateChange = function (ipFromDate, opFromWeek, opFromYear) {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, ipFromDate)
            && !this.context.riExchange.riInputElement.isError(this.context.uiForm, ipFromDate)) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = 'iCABSDateTimeRequests.p';
            this.context.riMaintenance.PostDataAdd('Function', 'GetWeekFromDate', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('WeekCalcDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, ipFromDate), MntConst.eTypeDate);
            this.context.riMaintenance.ReturnDataAdd('WeekCalcNumber', MntConst.eTypeInteger);
            this.context.riMaintenance.ReturnDataAdd('WeekCalcYear', MntConst.eTypeInteger);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromWeek, data['WeekCalcNumber']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromYear, data['WeekCalcYear']);
            }, 'POST');
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromWeek, '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromYear, '');
        }
    };
    ServiceCoverMaintenance7.prototype.SeasonalWeekChange = function (ipRequestFunction, ipFromWeek, ipFromYear, opFromDate) {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, ipFromWeek) &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, ipFromYear)) {
            if (!this.context.riExchange.riInputElement.isError(this.context.uiForm, ipFromWeek)
                && !!this.context.riExchange.riInputElement.isError(this.context.uiForm, ipFromYear)) {
                this.context.riMaintenance.clear();
                this.context.riMaintenance.BusinessObject = 'iCABSDateTimeRequests.p';
                this.context.riMaintenance.PostDataAdd('Function', ipRequestFunction, MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('WeekCalcNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ipFromWeek'), MntConst.eTypeInteger);
                this.context.riMaintenance.PostDataAdd('WeekCalcYear', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ipFromYear'), MntConst.eTypeInteger);
                this.context.riMaintenance.ReturnDataAdd('WeekCalcDate', MntConst.eTypeDate);
                this.context.riMaintenance.ReturnDataAdd('WeekCalcNumber', MntConst.eTypeInteger);
                this.context.riMaintenance.ReturnDataAdd('WeekCalcYear', MntConst.eTypeInteger);
                this.context.riMaintenance.Execute(this.context, function (data) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromDate, data['WeekCalcDate']);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, ipFromWeek, data['WeekCalcNumber']);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, ipFromYear, data['WeekCalcYear']);
                }, 'POST');
            }
            else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromDate, '');
            }
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromDate, '');
        }
    };
    return ServiceCoverMaintenance7;
}());
