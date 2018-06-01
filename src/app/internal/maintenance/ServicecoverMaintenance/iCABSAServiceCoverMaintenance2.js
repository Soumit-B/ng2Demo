import { MntConst } from './../../../../shared/services/riMaintenancehelper';
export var ServiceCoverMaintenance2 = (function () {
    function ServiceCoverMaintenance2(parent, injector) {
        this.parent = parent;
        this.context = parent;
    }
    ServiceCoverMaintenance2.prototype.riMaintenanceAfterEvent = function () {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd
            || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'chkStockOrder', false);
        }
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
        }
    };
    ServiceCoverMaintenance2.prototype.riMaintenanceBeforeUpdateMode = function () {
        this.context.iCABSAServiceCoverMaintenance4.ShowFields();
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdValue');
        this.context.iCABSAServiceCoverMaintenance5.AutoRouteProductInd_onClick();
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequireAnnualTimeInd')) {
            this.context.pageParams.tdAnnualTimeChange = true;
            this.context.pageParams.tdAnnualTimeChangeLab = true;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualTimeChange', '');
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd'))) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'origTotalValue', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewTotalValue', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'riGridHandle', '');
        }
        this.context.pageParams.SavedReductionQuantity = 0;
        this.context.pageParams.SavedIncreaseQuantity = 0;
        this.context.pageParams.blnQuantityChange = false;
        this.context.pageParams.blnValueChange = false;
        this.context.pageParams.blnServiceVisitAnnivDateChange = false;
        this.context.pageParams.uiDisplay.trInstallationValue = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InstallationValue', 0);
        switch (this.context.pageParams.currentContractType) {
            case 'C':
                if (this.context.pageParams.blnValueRequired) {
                    if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                        (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                        this.context.pageParams.uiDisplay.tdUnitValueChangeLab = true;
                        this.context.pageParams.uiDisplay.UnitValueChange = true;
                        this.context.riMaintenance.DisableInput('UnitValue');
                    }
                    this.context.pageParams.uiDisplay.tdAnnualValueChangeLab = true;
                    this.context.pageParams.uiDisplay.AnnualValueChange = true;
                    this.context.riMaintenance.DisableInput('ServiceAnnualValue');
                }
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InitialValue', '');
                break;
            case 'J':
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LastChangeEffectDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate'));
                break;
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualTimeChange', '');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualValueChange', 0);
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValueChange', 0);
            this.context.riExchange.riInputElement.isCorrect(this.context.uiForm, 'UnitValueChange');
        }
        if (this.context.parentMode === 'ContactUpdate') {
            this.context.setControlValue('LostBusinessRequestNumber', this.context.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));
        }
        if (this.context.utils.getBranchCode().toString() !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBranchNumber').toString()
            && this.context.utils.getBranchCode().toString() !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NegBranchNumber').toString()) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ServiceSalesEmployee');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SalesEmployeeText');
        }
        if (this.context.utils.getBranchCode().toString() !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBranchNumber').toString()) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BranchServiceAreaSeqNo');
        }
        this.context.riMaintenance.DisableInput('TrialPeriodInd');
        this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
        if (this.context.pageParams.vbEnableInstallsRemovals === true) {
            this.context.riMaintenance.DisableInput('RemovalValue');
        }
        if (this.context.pageParams.currentContractType !== 'P') {
            this.context.iCABSAServiceCoverMaintenance7.DOWSentriconToggle();
        }
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('Function', 'GetWindowsType', MntConst.eModeUpdate);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.pageParams.ServiceCoverRowID, MntConst.eModeUpdate);
        this.context.riMaintenance.ReturnDataAdd('WindowType01', MntConst.eModeUpdate);
        this.context.riMaintenance.ReturnDataAdd('WindowType02', MntConst.eModeUpdate);
        this.context.riMaintenance.ReturnDataAdd('WindowType03', MntConst.eModeUpdate);
        this.context.riMaintenance.ReturnDataAdd('WindowType04', MntConst.eModeUpdate);
        this.context.riMaintenance.ReturnDataAdd('WindowType05', MntConst.eModeUpdate);
        this.context.riMaintenance.ReturnDataAdd('WindowType06', MntConst.eModeUpdate);
        this.context.riMaintenance.ReturnDataAdd('WindowType07', MntConst.eModeUpdate);
        this.context.riMaintenance.Execute(this.context, function (data) {
            var _this = this;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet1', data['WindowType01']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet2', data['WindowType02']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet3', data['WindowType03']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet4', data['WindowType04']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet5', data['WindowType05']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet6', data['WindowType06']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet7', data['WindowType07']);
            for (var iLoop = 1; iLoop <= 7; iLoop++) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selQuickWindowSet' + iLoop) === 'C') {
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(iLoop, 2));
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(iLoop, 2));
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(iLoop + 7, 2));
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(iLoop + 7, 2));
                }
                else {
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(iLoop, 2));
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(iLoop, 2));
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(iLoop + 7, 2));
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(iLoop + 7, 2));
                }
            }
            this.context.iCABSAServiceCoverMaintenance2.WindowPreferredIndChanged();
            this.context.renderTab(1);
            this.context.pageParams.dtLastChangeEffectDate.required = true;
            this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'LastChangeEffectDate', false);
            this.context.LastChangeEffectDatePicker.validateDateField();
            this.context.pageParams.initialForm = this.context.createControlObjectFromForm();
            this.context.storePageParams();
            this.context.statusChangeSubscription = this.context.uiForm.statusChanges.subscribe(function (data) {
                if (_this.context.uiForm.dirty) {
                    for (var key in _this.context.uiForm.controls) {
                        if (key && (key !== 'menu') && _this.context.uiForm.controls.hasOwnProperty(key) &&
                            _this.context.uiForm.controls[key].dirty) {
                            _this.context.routeAwayGlobals.setSaveEnabledFlag(true);
                            if (_this.context.statusChangeSubscription) {
                                _this.context.statusChangeSubscription.unsubscribe();
                            }
                        }
                    }
                }
            });
        }, 'POST');
    };
    ServiceCoverMaintenance2.prototype.riMaintenanceBeforeUpdate = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DepositCanAmend') !== 'Y') {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositDate');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositAmount');
        }
        if (this.context.pageParams.vbEnableDepositProcessing &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DepositExists') === 'Y') {
            this.context.pageParams.uiDisplay.trDepositLineAdd = true;
        }
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositAmountApplied');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositPostedDate');
        if (this.context.pageParams.currentContractType === 'J') {
            this.context.pageParams.uiDisplay.trEffectiveDate = false;
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LastChangeEffectDate', null);
            this.context.pageParams.uiDisplay.trEffectiveDate = true;
            this.context.iCABSAServiceCoverMaintenance2.SelServiceBasis_OnChange();
            this.context.iCABSAServiceCoverMaintenance8.selSubjectToUplift_onChange();
            this.context.iCABSAServiceCoverMaintenance7.selUpliftVisitPosition_onChange();
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelServiceBasis');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'selHardSlotType');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdHardSlotCalendar');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdDiaryView');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelSubjectToUplift');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelUpliftVisitPosition');
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoPattern') === '') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', 'D');
            }
            this.context.iCABSAServiceCoverMaintenance5.SelAutoPattern_Onchange();
        }
        if (this.context.pageParams.blnAccess) {
            this.context.iCABSAServiceCoverMaintenance7.HideQuickWindowSet(false);
        }
        else {
            this.context.iCABSAServiceCoverMaintenance7.HideQuickWindowSet(true);
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks') === '1') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'VisitsPerCycle');
        }
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelectCompositeProductcode');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'selTaxCode');
        if (this.context.pageParams.vbDefaultTaxCodeProductExpenseReq === true
            && this.context.pageParams.vbDefaultTaxCodeProductExpenseReq === true) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }
        if (this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintReq === true &&
            this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintLog === true) {
            ;
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ServiceAnnualTime');
        this.context.pageParams.uiDisplay.trOutstandingRemovals = false;
        this.context.pageParams.uiDisplay.trRemovalEmployee = false;
        this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
        this.context.pageParams.uiDisplay.trInstallationEmployee = false;
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'InstallationEmployeeCode', false);
        this.context.iCABSAServiceCoverMaintenance7.ToggleSeasonalDates();
        this.context.iCABSAServiceCoverMaintenance7.EnableSeasonalChanges(false);
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SeasonalServiceInd') === 'true' ? true : false) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ServiceVisitAnnivDate');
        }
        if (this.context.pageParams.vbEnableEntitlement && this.context.pageParams.currentContractType === 'C') {
            this.context.iCABSAServiceCoverMaintenance3.ToggleEntitlementRequired();
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ExpiryDate');
            if (this.context.riExchange.URLParameterContains('PendingReduction')) {
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'UnitValue');
                }
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ServiceAnnualValue');
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ServiceQuantity');
            }
        }
        if (!this.context.pageParams.vbEnableServiceCoverDepreciation) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepreciationPeriod');
        }
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'chkFOC');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'FOCInvoiceStartDate');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'FOCProposedAnnualValue');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ServiceCommenceDate');
        this.context.renderTab(1);
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'CapableOfUplift')
            && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift')) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'UpliftTemplateNumber');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selUpliftVisitPosition');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selSubjectToUplift');
        }
        this.context.iCABSAServiceCoverMaintenance2.riMaintenanceBeforeUpdateMode();
    };
    ServiceCoverMaintenance2.prototype.BranchServiceAreaSeqNoOnChange = function () {
        if (!isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo'), 10))) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo', parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo'), 10));
            this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'BranchServiceAreaSeqNo', false);
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo').length < 4) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo', this.context.utils.Format(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo'), '0000'));
            }
            else {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo').length > 4) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo', this.context.utils.Format(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo'), '000000'));
                }
            }
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo', '');
        }
    };
    ServiceCoverMaintenance2.prototype.CustomerAvailTemplateIDOnChange = function () {
        this.UpdateTemplate();
    };
    ServiceCoverMaintenance2.prototype.UpdateTemplate = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CustomerAvailTemplateID') !== null) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
            this.context.riMaintenance.PostDataAdd('Function', 'CustomerAvailTemplate', MntConst.eModeUpdate);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('CustomerAvailTemplateID', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CustomerAvailTemplateID'), MntConst.eTypeInteger);
            this.context.riMaintenance.ReturnDataAdd('CustomerAvailTemplateDesc', MntConst.eModeUpdate);
            this.context.riMaintenance.ReturnDataAdd('WindowStart01', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd01', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart02', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd02', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart03', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd03', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart04', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd04', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart05', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd05', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart06', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd06', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart07', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd07', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart08', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd08', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart09', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd09', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart10', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd10', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart11', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd11', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart12', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd12', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart13', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd13', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowStart14', MntConst.eTypeTime);
            this.context.riMaintenance.ReturnDataAdd('WindowEnd14', MntConst.eTypeTime);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CustomerAvailTemplateDesc', data['CustomerAvailTemplateDesc']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart01', data['WindowStart01']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd01', data['WindowEnd01']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart01', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd01', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart02', data['WindowStart02']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd02', data['WindowEnd02']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart02', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd02', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart03', data['WindowStart03']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd03', data['WindowEnd03']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart03', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd03', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart04', data['WindowStart04']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd04', data['WindowEnd04']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart04', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd04', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart05', data['WindowStart05']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd05', data['WindowEnd05']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart05', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd05', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart06', data['WindowStart06']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd06', data['WindowEnd06']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart06', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd06', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart07', data['WindowStart07']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd07', data['WindowEnd07']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart07', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd07', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart08', data['WindowStart08']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd08', data['WindowEnd08']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart08', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd08', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart09', data['WindowStart09']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd09', data['WindowEnd09']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart09', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd09', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart10', data['WindowStart10']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd10', data['WindowEnd10']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart10', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd10', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart11', data['WindowStart11']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd11', data['WindowEnd11']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart11', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd11', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart12', data['WindowStart12']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd12', data['WindowEnd12']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart12', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd12', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart13', data['WindowStart13']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd13', data['WindowEnd13']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart13', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd13', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart14', data['WindowStart14']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd14', data['WindowEnd14']);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowStart14', true);
                this.context.riExchange.riInputElement.ReadOnly(this.context.uiForm, 'WindowEnd14', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet1', 'C');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet2', 'C');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet3', 'C');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet4', 'C');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet5', 'C');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet6', 'C');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet7', 'C');
            }, 'POST');
        }
    };
    ServiceCoverMaintenance2.prototype.ServiceBasis_OnChange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelServiceBasis', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBasis'));
    };
    ServiceCoverMaintenance2.prototype.FollowTemplateIndOnClick = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FollowTemplateInd') === 'true' ? true : false) {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'AnnualCalendarTemplateNumber', true);
        }
        else {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'AnnualCalendarTemplateNumber', false);
        }
    };
    ServiceCoverMaintenance2.prototype.SelServiceBasis_OnChange = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelServiceBasis') === 'T') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualCalendarInd', true);
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
                (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
                    !this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'SelServiceBasis'))) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FollowTemplateInd', true);
                if (this.context.pageParams.vbEnableWeeklyVisitPattern) {
                    this.context.pageParams.blnUseVisitCycleValues = false;
                    this.context.iCABSAServiceCoverMaintenance4.ShowFields();
                }
            }
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'FollowTemplateInd')) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'AnnualCalendarTemplateNumber', true);
            }
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SeasonalServiceInd', false);
            this.context.pageParams.uiDisplay.trFollowTemplate = true;
            this.context.pageParams.uiDisplay.trAnnualCalendarTemplateFields = true;
            this.context.pageParams.uiDisplay.trHardSlotType = false;
            this.context.pageParams.uiDisplay.cmdHardSlotCalendar = false;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'HardSlotInd', false);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'HardSlotType', false);
            this.context.iCABSAServiceCoverMaintenance7.SeasonalServiceInd_onclick();
        }
        else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelServiceBasis') === 'S') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SeasonalServiceInd', true);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualCalendarInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FollowTemplateInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'HardSlotInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualCalendarTemplateNumber', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CalendarTemplateName', '');
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'AnnualCalendarTemplateNumber', false);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'HardSlotType', false);
            this.context.pageParams.uiDisplay.trFollowTemplate = false;
            this.context.pageParams.uiDisplay.trAnnualCalendarTemplateFields = false;
            this.context.pageParams.uiDisplay.trHardSlotType = false;
            this.context.pageParams.uiDisplay.cmdHardSlotCalendar = false;
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
                (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
                    !this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'SelServiceBasis'))) {
                if (this.context.pageParams.vbEnableWeeklyVisitPattern) {
                    this.context.pageParams.blnUseVisitCycleValues = false;
                    this.context.iCABSAServiceCoverMaintenance4.ShowFields();
                }
            }
            this.context.iCABSAServiceCoverMaintenance7.SeasonalServiceInd_onclick();
        }
        else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelServiceBasis') === 'H') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SeasonalServiceInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualCalendarInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FollowTemplateInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'HardSlotInd', true);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualCalendarTemplateNumber', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CalendarTemplateName', '');
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'AnnualCalendarTemplateNumber', false);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'HardSlotType', true);
            this.context.pageParams.uiDisplay.trFollowTemplate = false;
            this.context.pageParams.uiDisplay.trAnnualCalendarTemplateFields = false;
            this.context.pageParams.uiDisplay.cmdHardSlotCalendar = true;
            this.context.pageParams.uiDisplay.trHardSlotType = true;
            this.context.iCABSAServiceCoverMaintenance7.SeasonalServiceInd_onclick();
            if ((this.context.riMaintenance.CurrentMode === MntConst.eModeAdd && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotType') === '')
                || (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotType') === '')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selHardSlotType', 'D');
                this.context.iCABSAServiceCoverMaintenance2.selHardSlotType_OnChange();
            }
            ;
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SeasonalServiceInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualCalendarInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FollowTemplateInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'HardSlotInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualCalendarTemplateNumber', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CalendarTemplateName', '');
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'AnnualCalendarTemplateNumber', false);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'HardSlotType', false);
            this.context.pageParams.uiDisplay.trFollowTemplate = false;
            this.context.pageParams.uiDisplay.trAnnualCalendarTemplateFields = false;
            this.context.pageParams.uiDisplay.trHardSlotType = false;
            this.context.pageParams.uiDisplay.cmdHardSlotCalendar = false;
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
                (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
                    !this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'SelServiceBasis'))) {
                if (this.context.pageParams.vbEnableWeeklyVisitPattern) {
                    this.context.pageParams.blnUseVisitCycleValues = true;
                    this.context.iCABSAServiceCoverMaintenance4.ShowFields();
                }
            }
            this.context.iCABSAServiceCoverMaintenance7.SeasonalServiceInd_onclick();
        }
        if (this.context.pageParams.vbActiveElement === 'SelServiceBasis') {
            this.context.renderTab(5);
        }
    };
    ServiceCoverMaintenance2.prototype.selHardSlotType_OnChange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'HardSlotType', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selHardSlotType'));
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selHardSlotType') === 'S') {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'HardSlotVisitTime', true);
        }
        else {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'HardSlotVisitTime', false);
        }
        this.context.iCABSAServiceCoverMaintenance2.cmdHardSlotCalendarSet();
    };
    ServiceCoverMaintenance2.prototype.HardSlotType_OnChange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selHardSlotType', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotType'));
        this.context.iCABSAServiceCoverMaintenance2.selHardSlotType_OnChange();
    };
    ServiceCoverMaintenance2.prototype.cmdHardSlotCalendarSet = function () {
        if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selHardSlotType') !== 'S')
            && this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'cmdHardSlotCalendar')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdHardSlotCalendar');
        }
        else if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selHardSlotType') === 'S')
            && !this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'cmdHardSlotCalendar')) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdHardSlotCalendar');
        }
    };
    ServiceCoverMaintenance2.prototype.HardSlotVisitTimeOnChange = function () {
        this.context.formatTime(this.context.getControlValue('HardSlotVisitTime'), 'HardSlotVisitTime');
        if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'hardSlotVisitTime') !== '')
            && this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'cmdHardSlotCalendar')) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdHardSlotCalendar');
        }
        else if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'hardSlotVisitTime') !== 'S')
            && !this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'cmdHardSlotCalendar')) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdHardSlotCalendar');
        }
    };
    ServiceCoverMaintenance2.prototype.GetVisitCycleValues = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('Function', 'GetVisitCycleValues', MntConst.eModeUpdate);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ServiceVisitFrequency', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), MntConst.eTypeInteger);
        this.context.riMaintenance.ReturnDataAdd('VisitCycleInWeeks', MntConst.eTypeInteger);
        this.context.riMaintenance.ReturnDataAdd('VisitsPerCycle', MntConst.eTypeInteger);
        this.context.riMaintenance.ReturnDataAdd('ErrorMessage', MntConst.eModeUpdate);
        this.context.riMaintenance.Execute(this.context, function (data) {
            if (!data['ErrorMessage']) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeks', data['VisitCycleInWeeks']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitsPerCycle', data['VisitsPerCycle']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VFPNumberOfWeeks', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks'));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VFPNumberOfVisitsPerWeek', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle'));
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ServiceVisitFrequency', false);
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitCycleInWeeksOverrideNote');
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', false);
            }
            else {
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ServiceVisitFrequency', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceVisitFrequencyCopy', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeks', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitsPerCycle', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CalculatedVisits', '');
            }
        }, 'POST');
    };
    ServiceCoverMaintenance2.prototype.VisitCycleInWeeks_OnChange = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks') === '0') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeks', '');
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks') === '1') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'VisitsPerCycle');
        }
        else {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitsPerCycle');
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitsPerCycle', '');
            }
            else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitsPerCycle', '1');
            }
        }
        ;
        this.VisitCycleValueChanges();
    };
    ServiceCoverMaintenance2.prototype.VisitsPerCycle_OnChange = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle') === '0') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitsPerCycle', '');
        }
        ;
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        this.VisitCycleValueChanges();
    };
    ServiceCoverMaintenance2.prototype.VisitCycleValueChanges = function () {
        this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CalculatedVisits', '');
        if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks') !==
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VFPNumberOfWeeks')) ||
            (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle') !==
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VFPNumberOfVisitsPerWeek'))) {
            if ((this.context.pageParams.SavedVisitCycleInWeeks === this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks')) &&
                (this.context.pageParams.SavedVisitsPerCycle === this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle'))
                && this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', this.context.pageParams.SavedVisitCycleInWeeksOverrideNote);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CalculatedVisits', this.context.pageParams.SavedCalculatedVisits);
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitCycleInWeeksOverrideNote');
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', false);
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitFrequencyWarningMessage') !== '') {
                    this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning = true;
                    this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning_innerText = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitFrequencyWarningMessage');
                }
                else {
                    this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning = false;
                }
            }
            else {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'VisitCycleInWeeksOverrideNote');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', '');
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', true);
            }
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', '');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitCycleInWeeksOverrideNote');
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', false);
        }
    };
    ServiceCoverMaintenance2.prototype.selQuickWindowSet_onchange = function (id) {
        var srcValue = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, id);
        var srcRow = parseInt(this.context.utils.Right(window.event.srcElement.id, 1), 10);
        if (srcValue === 'C') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow, 2));
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow, 2));
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow + 7, 2));
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow + 7, 2));
        }
        else {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow, 2));
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow, 2));
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow + 7, 2));
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow + 7, 2));
        }
        switch (srcValue) {
            case 'P':
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseWindowStart' + this.context.ZeroPadInt(srcRow, 2)));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseWindowEnd' + this.context.ZeroPadInt(srcRow, 2)));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow + 7, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseWindowStart' + this.context.ZeroPadInt(srcRow + 7, 2)));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow + 7, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseWindowEnd' + this.context.ZeroPadInt(srcRow + 7, 2)));
                break;
            case 'D':
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DefaultWindowStart' + this.context.ZeroPadInt(srcRow + srcRow - 1, 2)));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DefaultWindowEnd' + this.context.ZeroPadInt(srcRow + srcRow - 1, 2)));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow + 7, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DefaultWindowStart' + this.context.ZeroPadInt(srcRow + srcRow, 2)));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow + 7, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DefaultWindowEnd' + this.context.ZeroPadInt(srcRow + srcRow, 2)));
                break;
            case 'U':
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow, 2), '00:00');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow, 2), '00:00');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow + 7, 2), '00:00');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow + 7, 2), '00:00');
                break;
            case 'A':
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow, 2), '00:00');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow, 2), '11:59');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(srcRow + 7, 2), '12:00');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(srcRow + 7, 2), '23:59');
                break;
        }
    };
    ServiceCoverMaintenance2.prototype.UpdateDefaultTimes = function (vbDefaultName) {
        for (var iLoop = 1; iLoop <= 7; iLoop++) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(iLoop, 2));
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(iLoop, 2));
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(iLoop + 7, 2));
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(iLoop + 7, 2));
            if (vbDefaultName === 'Default') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(iLoop, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, vbDefaultName + 'WindowStart' + this.context.ZeroPadInt(iLoop + iLoop - 1, 2)));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(iLoop, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, vbDefaultName + 'WindowEnd' + this.context.ZeroPadInt(iLoop + iLoop - 1, 2)));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowStart' + this.context.ZeroPadInt(iLoop + 7, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, vbDefaultName + 'WindowStart' + this.context.ZeroPadInt(iLoop + iLoop, 2)));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowEnd' + this.context.ZeroPadInt(iLoop + 7, 2), this.context.riExchange.riInputElement.GetValue(this.context.uiForm, vbDefaultName + 'WindowEnd' + this.context.ZeroPadInt(iLoop + iLoop, 2)));
            }
        }
    };
    ServiceCoverMaintenance2.prototype.WindowPreferredIndChanged = function () {
        this.context.pageParams.blnAnyPreferred = false;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
            this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            for (var iLoop = 1; iLoop <= 7; iLoop++) {
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'WindowPreferredInd0' + iLoop)) {
                    this.context.pageParams.blnAnyPreferred = true;
                }
            }
            if (this.context.pageParams.blnAnyPreferred) {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'PreferredDayOfWeekReasonCode');
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'PreferredDayOfWeekReasonCode', true);
            }
            else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PreferredDayOfWeekReasonCode', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PreferredDayOfWeekReasonLangDesc', true);
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'PreferredDayOfWeekReasonCode');
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'PreferredDayOfWeekReasonCode', false);
            }
        }
    };
    ServiceCoverMaintenance2.prototype.PreferredDayOfWeekReasonCodeonchange = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PreferredDayOfWeekReasonCode') !== '0' &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PreferredDayOfWeekReasonCode') !== '') {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.context.riMaintenance.PostDataAdd('PostDesc', 'PreferredDayOfWeekReason', MntConst.eModeUpdate);
            this.context.riMaintenance.PostDataAdd('PreferredDayOfWeekReasonCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PreferredDayOfWeekReasonCode'), MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('LanguageCode', this.context.riExchange.LanguageCode(), MntConst.eTypeCode);
            this.context.riMaintenance.ReturnDataAdd('PreferredDayOfWeekReasonDesc', MntConst.eModeUpdate);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PreferredDayOfWeekReasonLangDesc', data['PreferredDayOfWeekReasonDesc']);
            });
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PreferredDayOfWeekReasonCode', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PreferredDayOfWeekReasonLangDesc', '');
        }
    };
    ServiceCoverMaintenance2.prototype.LinkedProductCodeOnChange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ComponentGridCacheTime', this.context.utils.Time());
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LinkedServiceCoverNumber', true);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LinkedServiceVisitFreq', true);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LinkedProductDesc', true);
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LinkedServiceCoverNumber') === '') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LinkedProductCode', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LinkedProductDesc', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LinkedServiceVisitFreq', '');
        }
    };
    ServiceCoverMaintenance2.prototype.ProcessTimeString = function (vbTimeField) {
        this.context.pageParams.vbError = false;
        this.context.pageParams.vbTimeFormat = '##00' + this.context.pageParams.vbTimeSeparator + '##';
        switch (vbTimeField) {
            case 'StandardTreatmentTime':
                this.context.pageParams.vbTime = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'StandardTreatmentTime').
                    replace(this.context.pageParams.vbTimeSeparator, '');
                break;
            case 'InitialTreatmentTime':
                this.context.pageParams.vbTime = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InitialTreatmentTime').
                    replace(this.context.pageParams.vbTimeSeparator, '');
                break;
            case 'ServiceAnnualTime':
                this.context.pageParams.vbTime = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualTime').
                    replace(this.context.pageParams.vbTimeSeparator, '');
                break;
            case 'SalesPlannedTime':
                this.context.pageParams.vbTime = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SalesPlannedTime').
                    replace(this.context.pageParams.vbTimeSeparator, '');
                break;
            case 'ActualPlannedTime':
                this.context.pageParams.vbTime = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ActualPlannedTime').
                    replace(this.context.pageParams.vbTimeSeparator, '');
                break;
        }
        try {
            var re = /^[0-9]{4,5}$/;
            var reg = new RegExp(re);
            if (reg.test(this.context.pageParams.vbTime)) {
                if (!isNaN(parseInt(this.context.pageParams.vbTime, 10))) {
                    this.context.pageParams.vbError = false;
                }
                else {
                    this.context.pageParams.vbError = true;
                }
            }
            else {
                this.context.pageParams.vbError = true;
            }
        }
        catch (e) {
            this.context.pageParams.vbError = true;
        }
        if (!this.context.pageParams.vbError && ((this.context.pageParams.vbTime.length < 4) || (this.context.pageParams.vbTime.length > 7))) {
            this.context.pageParams.vbError = true;
        }
        else if (!this.context.pageParams.vbError) {
            if (!this.context.pageParams.vbError && this.context.pageParams.vbTime === 0) {
                this.context.pageParams.vbError = true;
            }
            if (!this.context.pageParams.vbError) {
                this.context.pageParams.vbDurationHours = this.context.utils.mid(this.context.pageParams.vbTime, 1, this.context.pageParams.vbTime.length - 2);
                this.context.pageParams.vbDurationMinutes = this.context.utils.Right(this.context.pageParams.vbTime, 2);
                if (this.context.pageParams.vbDurationMinutes > 59) {
                    this.context.showAlert('Minutes Entered Cannot Be Greater Than 59', 2);
                    this.context.pageParams.vbError = true;
                }
                else {
                    this.context.pageParams.vbTimeSec = (this.context.pageParams.vbDurationHours * 60 * 60) + (this.context.pageParams.vbDurationMinutes * 60);
                }
            }
        }
        switch (vbTimeField) {
            case 'StandardTreatmentTime':
                if (!this.context.pageParams.vbError) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, vbTimeField, this.context.pageParams.vbDurationHours + ':' + this.context.pageParams.vbDurationMinutes);
                }
                else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, vbTimeField, '');
                    this.context.uiForm.controls[vbTimeField].setErrors({ 'incorrect': true });
                }
                break;
            case 'InitialTreatmentTime':
                if (!this.context.pageParams.vbError) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InitialTreatmentTime', this.context.pageParams.vbDurationHours + ':' + this.context.pageParams.vbDurationMinutes);
                }
                else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InitialTreatmentTime', '');
                }
                break;
            case 'ServiceAnnualTime':
                if (!this.context.pageParams.vbError) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualTime', this.context.pageParams.vbDurationHours + ':' + this.context.pageParams.vbDurationMinutes);
                }
                else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualTime', '');
                    this.context.uiForm.controls[vbTimeField].setErrors({ 'incorrect': true });
                }
                break;
            case 'SalesPlannedTime':
                if (!this.context.pageParams.vbError) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SalesPlannedTime', this.context.pageParams.vbDurationHours + ':' + this.context.pageParams.vbDurationMinutes);
                }
                else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SalesPlannedTime', '');
                    this.context.uiForm.controls[vbTimeField].setErrors({ 'incorrect': true });
                }
                break;
            case 'ActualPlannedTime':
                if (!this.context.pageParams.vbError) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ActualPlannedTime', this.context.pageParams.vbDurationHours + ':' + this.context.pageParams.vbDurationMinutes);
                }
                else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ActualPlannedTime', '');
                    this.context.uiForm.controls[vbTimeField].setErrors({ 'incorrect': true });
                }
                break;
        }
    };
    ServiceCoverMaintenance2.prototype.CalculateEntitlementServiceQuantity = function () {
        if (this.context.pageParams.uiDisplay.trEntitlementServiceQuantity) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
            this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('Function', 'GetServiceVisitQuantity', MntConst.eModeUpdate);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ServiceVisitFrequency', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('EntitlementAnnualQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnualQuantity'), MntConst.eTypeInteger);
            this.context.riMaintenance.ReturnDataAdd('EntitlementServiceVisitQuantity', MntConst.eTypeInteger);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'EntitlementServiceQuantity', data['EntitlementServiceVisitQuantity']);
            }, 'POST');
        }
    };
    ServiceCoverMaintenance2.prototype.AnnualValueChangeonBlur = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange')) {
            if (!this.context.pageParams.vbPriceChangeOnlyInd &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency') === this.context.pageParams.vbServiceVisitFrequency &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity') === this.context.pageParams.vbServiceQuantity &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange') !== '0') {
                this.context.pageParams.uiDisplay.trPriceChangeOnly = true;
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PriceChangeOnlyInd', true);
                this.context.pageParams.vbPriceChangeOnlyInd = true;
            }
            else if (this.context.pageParams.vbPriceChangeOnlyInd &&
                (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency') !== this.context.pageParams.vbServiceVisitFrequency ||
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity') !== this.context.pageParams.vbServiceQuantity)) {
                this.context.pageParams.uiDisplay.trPriceChangeOnly = false;
                this.context.pageParams.vbPriceChangeOnlyInd = false;
            }
        }
        else {
            this.context.pageParams.uiDisplay.trPriceChangeOnly = false;
            this.context.pageParams.PriceChangeOnlyInd = false;
            this.context.pageParams.vbPriceChangeOnlyInd = false;
        }
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    };
    ServiceCoverMaintenance2.prototype.ServiceQuantityLabel = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd'))) {
            this.context.pageParams.spanServiceQuantityLab_innerText = 'Quantity of Displays';
            this.context.pageParams.spanUnconfirmedDeliveryQtyLab_innerText = 'Quantity of Displays';
        }
        else {
            this.context.pageParams.spanServiceQuantityLab_innerText = 'Service Quantity';
            this.context.pageParams.spanUnconfirmedDeliveryQtyLab_innerText = 'Quantity';
        }
    };
    return ServiceCoverMaintenance2;
}());
