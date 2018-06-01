import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { PostCodeUtils } from './../../../../shared/services/postCode-utility';
export var ServiceCoverMaintenance1 = (function () {
    function ServiceCoverMaintenance1(parent, injector) {
        this.parent = parent;
        this.context = parent;
        this.PostCodeDefaultingFunctions = injector.get(PostCodeUtils);
    }
    ServiceCoverMaintenance1.prototype.init = function () {
        var _this = this;
        this.PostCodeDefaultingFunctions.PostCodeList().subscribe(function (res) {
            _this.context.pageParams.vEnablePostcodeDefaulting = res;
        }, function (error) {
            _this.context.pageParams.vEnablePostcodeDefaulting = false;
        });
        this.context.iCABSAServiceCoverMaintenanceLoad.window_onload();
    };
    ServiceCoverMaintenance1.prototype.riMaintenance_BeforeSelect = function () {
        this.context.pageParams.uiDisplay.trInstallationValue = false;
        this.context.pageParams.uiDisplay.trRemovalValue = false;
        this.context.pageParams.uiDisplay.trServiceAnnualValue = false;
        this.context.pageParams.uiDisplay.cmdValue = false;
        this.context.pageParams.uiDisplay.labelInactiveEffectDate = false;
        this.context.pageParams.uiDisplay.InactiveEffectDate = false;
        this.context.pageParams.uiDisplay.tdReasonLab = false;
        this.context.pageParams.uiDisplay.tdReason = false;
        this.context.pageParams.uiDisplay.trAverageUnitValue = false;
        this.context.pageParams.uiDisplay.trServiceVisitFrequencyCopy = false;
        this.context.pageParams.uiDisplay.trServiceVisitCycleFields1 = false;
        this.context.pageParams.uiDisplay.trServiceVisitCycleFields2 = false;
        this.context.pageParams.uiDisplay.trServiceVisitCycleFields3 = false;
        this.context.pageParams.uiDisplay.trStaticVisit = false;
        this.context.pageParams.uiDisplay.trDOWSentricon = false;
        this.context.pageParams.uiDisplay.trDOWInstall = false;
        this.context.pageParams.uiDisplay.trDOWProduct = false;
        this.context.pageParams.uiDisplay.trDOWPerimeter = false;
        this.context.pageParams.uiDisplay.trDOWRenewalDate = false;
        this.context.pageParams.uiDisplay.tdLineOfService_innerhtml = '';
        this.context.pageParams.uiDisplay.tdLineOfService = false;
        this.context.pageParams.uiDisplay.trUnitValue = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selTaxCode', '');
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.pageParams.uiDisplay.trUnitValue = false;
        }
    };
    ServiceCoverMaintenance1.prototype.CalAverageUnitValue = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
        this.context.riMaintenance.PostDataAdd('Function', 'CalculateAverageUnitValue', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.pageParams.ServiceCoverRowID, MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('AverageUnitValue', MntConst.eTypeCurrency);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AverageUnitValue', data['AverageUnitValue']);
        }, 'POST');
    };
    ServiceCoverMaintenance1.prototype.CalDisplayValues = function () {
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.context.riMaintenance.PostDataAdd('Function', 'ReCalcDisplayValues', MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('LastChangeEffectDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'), MntConst.eTypeDate);
            }
            else {
                this.context.riMaintenance.PostDataAdd('Function', 'CalcDisplayValues', MntConst.eTypeText);
            }
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.pageParams.ServiceCoverRowID, MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('WEDValue', MntConst.eTypeDecimal1);
            this.context.riMaintenance.ReturnDataAdd('PricePerWED', MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('MaterialsValue', MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('MaterialsCost', MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('LabourValue', MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('LabourCost', MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('ReplacementValue', MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('ReplacementCost', MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('ReplacementIncludeInd', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WEDValue', data['WEDValue']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PricePerWED', data['PricePerWED']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MaterialsValue', data['MaterialsValue']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MaterialsCost', data['MaterialsCost']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LabourValue', data['LabourValue']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LabourCost', data['LabourCost']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ReplacementValue', data['ReplacementValue']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ReplacementCost', data['ReplacementCost']);
                switch (data['ReplacementIncludeInd']) {
                    case 'yes':
                        this.context.pageParams.rsPlantReplaceIndyes = true;
                        break;
                    case 'no':
                        this.context.pageParams.rsPlantReplaceIndno = true;
                        break;
                    case 'Mixed':
                        this.context.pageParams.rsPlantReplaceIndmixed = true;
                        break;
                }
            }, 'POST');
        }
    };
    ServiceCoverMaintenance1.prototype.ServiceCoverWasteReq = function () {
        this.context.pageParams.blnServiceCoverWasteReq = false;
        this.context.iCABSAServiceCoverMaintenance8.GetServiceCoverWasteRequired();
    };
    ServiceCoverMaintenance1.prototype.riMaintenance_AfterFetch = function () {
        this.context.iCABSAServiceCoverMaintenance4.ShowHideBudgetBilling();
        this.context.iCABSAServiceCoverMaintenance6.ShowHideTermiteRelatedFields();
        this.context.attributes.DefaultEffectiveDate = null;
        this.context.attributes.DefaultEffectiveDateProduct = null;
        this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('C');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelServiceBasis', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBasis'));
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation'));
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern'));
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift') === '') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelSubjectToUplift', 'N');
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelSubjectToUplift', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift'));
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelUpliftVisitPosition', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UpliftVisitPosition'));
        this.context.iCABSAServiceCoverMaintenance2.SelServiceBasis_OnChange();
        this.context.iCABSAServiceCoverMaintenance8.selSubjectToUplift_onChange();
        this.context.iCABSAServiceCoverMaintenance7.selUpliftVisitPosition_onChange();
        if (this.context.pageParams.vbEnableWeeklyVisitPattern &&
            (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBasis') === 'S' ||
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBasis') === 'T')) {
            this.context.pageParams.blnUseVisitCycleValues = false;
        }
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeSelect) {
            this.context.pageParams.uiDisplay.tdLineOfService_innerhtml = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LOSName');
            this.context.pageParams.uiDisplay.tdLineOfService = true;
            this.context.iCABSAServiceCoverMaintenance3.BuildTaxCodeCombo();
        }
        this.context.iCABSAServiceCoverMaintenance4.ShowFields();
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
            this.context.iCABSAServiceCoverMaintenance1.CalAverageUnitValue();
        }
        this.context.iCABSAServiceCoverMaintenance6.CalculateUnitValue();
        if (this.context.pageParams.blnUseVisitCycleValues) {
            this.context.pageParams.SavedVisitCycleInWeeksOverrideNote = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeksOverrideNote');
            this.context.pageParams.SavedCalculatedVisits = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CalculatedVisits');
            this.context.pageParams.SavedVisitCycleInWeeks = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks');
            this.context.pageParams.SavedVisitsPerCycle = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceVisitFrequencyCopy', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'));
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitFrequencyWarningMessage') !== null) {
                this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning = true;
                this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning_innerText = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitFrequencyWarningMessage');
            }
            else {
                this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning = false;
            }
        }
        if (this.context.utils.getBranchCode().toString() === this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBranchNumber').toString()
            || this.context.utils.getBranchCode().toString() === this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NegBranchNumber').toString()) {
            this.context.pageParams.blnAccess = true;
        }
        else {
            this.context.pageParams.blnAccess = false;
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldHideList') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldHideList').indexOf('ServiceAnnualValue') === -1) {
            this.context.pageParams.blnValueRequired = true;
        }
        else {
            this.context.pageParams.blnValueRequired = false;
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldHideList') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldHideList').indexOf('MultipleTaxRates') === -1
            && this.context.pageParams.vbEnableMultipleTaxRates) {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'MultipleTaxRates')) {
                this.context.pageParams.uiDisplay.trTaxHeadings = true;
                this.context.pageParams.uiDisplay.trTaxMaterials = true;
                this.context.pageParams.uiDisplay.trTaxLabour = true;
                this.context.pageParams.uiDisplay.trTaxReplacement = true;
                this.context.pageParams.uiDisplay.trConsolidateEqualTaxRates = true;
            }
            else {
                this.context.pageParams.uiDisplay.trTaxHeadings = false;
                this.context.pageParams.uiDisplay.trTaxMaterials = false;
                this.context.pageParams.uiDisplay.trTaxLabour = false;
                this.context.pageParams.uiDisplay.trTaxReplacement = false;
                this.context.pageParams.uiDisplay.trConsolidateEqualTaxRates = false;
            }
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ValueRequiredInd')) {
            this.context.pageParams.uiDisplay.trZeroValueIncInvoice = true;
        }
        if (this.context.pageParams.blnValueRequired) {
            this.context.pageParams.uiDisplay.trInvoiceType = true;
            this.context.pageParams.uiDisplay.trInvoiceStartDate = true;
            this.context.pageParams.uiDisplay.trInvoiceEndDate = true;
            this.context.pageParams.uiDisplay.trInvoiceValue = true;
            this.context.pageParams.uiDisplay.trForwardDateChangeInd = true;
            this.context.pageParams.uiDisplay.trInvoiceSuspend = true;
            this.context.pageParams.uiDisplay.trInvoiceReleased = true;
        }
        else {
            this.context.pageParams.uiDisplay.trInvoiceType = false;
            this.context.pageParams.uiDisplay.trInvoiceStartDate = false;
            this.context.pageParams.uiDisplay.trInvoiceEndDate = false;
            this.context.pageParams.uiDisplay.trInvoiceValue = false;
            this.context.pageParams.uiDisplay.trForwardDateChangeInd = false;
            this.context.pageParams.uiDisplay.trInvoiceSuspend = false;
            this.context.pageParams.uiDisplay.trInvoiceReleased = false;
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequireAnnualTimeInd')) {
            this.context.pageParams.uiDisplay.trAnnualTime = true;
        }
        else {
            this.context.pageParams.uiDisplay.trAnnualTime = false;
        }
        this.context.iCABSAServiceCoverMaintenance7.BuildInvoiceTypeSelect();
        switch (this.context.pageParams.currentContractType) {
            case 'C':
                if (this.context.pageParams.blnAccess && this.context.pageParams.blnValueRequired) {
                    if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                        (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                        this.context.pageParams.uiDisplay.tdUnitValueChangeLab = true;
                        this.context.pageParams.uiDisplay.UnitValueChange = true;
                        this.context.pageParams.uiDisplay.trUnitValue = true;
                    }
                    this.context.pageParams.uiDisplay.tdAnnualValueChangeLab = true;
                    this.context.pageParams.uiDisplay.AnnualValueChange = true;
                    this.context.pageParams.uiDisplay.trInvoiceValue = true;
                    this.context.pageParams.uiDisplay.trServiceAnnualValue = true;
                }
                else {
                    if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                        (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                        this.context.pageParams.uiDisplay.tdUnitValueChangeLab = true;
                        this.context.pageParams.uiDisplay.UnitValueChange = true;
                        this.context.pageParams.uiDisplay.trUnitValue = false;
                    }
                    this.context.pageParams.uiDisplay.tdAnnualValueChangeLab = false;
                    this.context.pageParams.uiDisplay.AnnualValueChange = false;
                    this.context.pageParams.uiDisplay.trInvoiceValue = false;
                    this.context.pageParams.uiDisplay.trServiceAnnualValue = false;
                }
                this.context.pageParams.uiDisplay.trInitialValue = (this.context.pageParams.vEnableInitialCharge && !this.context.pageParams.vEnableInitialChargeorInstall);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualTimeChange', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualValueChange', '0');
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValueChange', '0');
                    this.context.riExchange.riInputElement.isCorrect(this.context.uiForm, 'UnitValueChange');
                }
                this.context.riExchange.riInputElement.isCorrect(this.context.uiForm, 'AnnualValueChange');
                if (this.context.pageParams.blnValueRequired && !this.context.riExchange.URLParameterContains('PendingReduction')) {
                    this.context.pageParams.uiDisplay.trChkRenegContract = true;
                    if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkRenegContract')) {
                        this.context.pageParams.uiDisplay.tdRenegOldContract = true;
                    }
                    else {
                        this.context.pageParams.uiDisplay.tdRenegOldContract = false;
                    }
                }
                else {
                    this.context.pageParams.uiDisplay.trChkRenegContract = false;
                }
                if (this.context.riMaintenance.CurrentMode !== MntConst.eModeUpdate) {
                    this.context.iCABSAServiceCoverMaintenance7.ToggleSeasonalDates();
                }
                if (this.context.pageParams.vbEnableEntitlement) {
                    this.context.iCABSAServiceCoverMaintenance3.ToggleEntitlementRequired();
                }
                if (this.context.pageParams.vbEnableTrialPeriodServices) {
                    if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ContractTrialPeriodInd')) {
                        this.context.pageParams.uiDisplay.tdTrialPeriodInd = false;
                        this.context.pageParams.uiDisplay.tdContractTrialPeriodInd = true;
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ContractTrialPeriodInd', true);
                        this.context.riMaintenance.DisableInput('ContractTrialPeriodInd');
                    }
                    else {
                        this.context.pageParams.dtTrialPeriodEndDateRecordValue = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TrialPeriodEndDate');
                        this.context.pageParams.deTrialPeriodChargeRecordValue = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TrialPeriodChargeValue');
                        this.context.pageParams.uiDisplay.tdTrialPeriodInd = true;
                        this.context.pageParams.uiDisplay.tdContractTrialPeriodInd = false;
                        this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
                    }
                }
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkFOC')) {
                    this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = true;
                    this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = true;
                }
                else {
                    this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = false;
                    this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = false;
                }
                break;
            case 'J':
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.pageParams.uiDisplay.tdUnitValueChangeLab = false;
                    this.context.pageParams.uiDisplay.UnitValueChange = false;
                }
                this.context.pageParams.uiDisplay.tdAnnualValueChangeLab = false;
                this.context.pageParams.uiDisplay.AnnualValueChange = false;
                this.context.pageParams.uiDisplay.trChkRenegContract = false;
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FirstInvoicedDate') === 'yes') {
                    this.context.pageParams.uiDisplay.trInvoiceType = false;
                    this.context.pageParams.uiDisplay.trInvoiceStartDate = false;
                    this.context.pageParams.uiDisplay.trInvoiceEndDate = false;
                    this.context.pageParams.uiDisplay.trInvoiceValue = false;
                    this.context.pageParams.uiDisplay.trForwardDateChangeInd = false;
                }
                if (this.context.pageParams.blnAccess && this.context.pageParams.blnValueRequired) {
                    if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                        (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                        this.context.pageParams.uiDisplay.trUnitValue = true;
                    }
                    this.context.pageParams.uiDisplay.trServiceAnnualValue = true;
                }
                else {
                    if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                        (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                        this.context.pageParams.uiDisplay.trUnitValue = false;
                    }
                    this.context.pageParams.uiDisplay.trServiceAnnualValue = false;
                    this.context.pageParams.uiDisplay.trInvoiceValue = false;
                }
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InactiveEffectDate')) {
            this.context.pageParams.uiDisplay.labelInactiveEffectDate = true;
            this.context.pageParams.uiDisplay.InactiveEffectDate = true;
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SCLostBusinessDesc')) {
                this.context.pageParams.uiDisplay.tdReasonLab = true;
                this.context.pageParams.SCLostBusinessDesc_title = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SCLostBusinessDesc2') +
                    '\n' + this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SCLostBusinessDesc3');
                this.context.pageParams.uiDisplay.tdReason = true;
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
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ShowValueButton') && this.context.pageParams.blnValueRequired) {
            this.context.pageParams.uiDisplay.cmdValue = true;
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdValue');
        }
        else {
            this.context.pageParams.uiDisplay.cmdValue = false;
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdValue');
        }
        if (this.context.parentMode === 'ContactUpdate') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutcomeEffectDate', this.context.riExchange.getParentHTMLValue('OutcomeEffectDate'));
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LastChangeEffectDate', this.context.riExchange.getParentHTMLValue('LastChangeEffectDate'));
        }
        this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
        this.context.pageParams.uiDisplay.trInstallationEmployee = false;
        this.context.pageParams.uiDisplay.trInstallationValue = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations', '0');
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'StockOrderAllowed') === 'yes') {
            this.context.pageParams.uiDisplay.trChkStockOrder = true;
        }
        else {
            this.context.pageParams.uiDisplay.trChkStockOrder = false;
        }
        this.context.pageParams.vbEnableRouteOptimisation = this.context.pageParams.vEnableRouteOptimisation;
        if (this.context.pageParams.vbEnableRouteOptimisation !== true) {
            this.context.pageParams.uiDisplay.trAutoRouteProductInd = false;
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequireAnnualTimeInd')) {
            this.context.pageParams.uiDisplay.trAnnualTime = true;
            this.context.pageParams.uiDisplay.trStandardTreatmentTime = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'StandardTreatmentTime', false);
        }
        else {
            this.context.pageParams.uiDisplay.trAnnualTime = false;
            if (this.context.pageParams.vbEnableStandardTreatmentTime) {
                this.context.pageParams.uiDisplay.trStandardTreatmentTime = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'StandardTreatmentTime', true);
            }
        }
        if (!isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), 2))) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceVisitFrequency', parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), 2));
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceVisitFrequency', '0');
        }
        if (!isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 2))) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'));
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceQuantity', '0');
        }
        if (!isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue'), 2))) {
            this.context.pageParams.SavedServiceAnnualValue = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue');
        }
        else {
            this.context.pageParams.SavedServiceAnnualValue = '0.00';
        }
        this.context.pageParams.SavedInitialTreatmentTime = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InitialTreatmentTime');
        this.context.pageParams.SavedServiceAnnualTime = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualTime');
        this.context.pageParams.SavedWasteTransferType = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode');
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'NationalAccountChecked') &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'NationalAccount')) {
            this.context.pageParams.uiDisplay.tdNationalAccount = true;
        }
        else {
            this.context.pageParams.uiDisplay.tdNationalAccount = false;
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'PNOL')) {
            this.context.pageParams.uiDisplay.tdPNOL = true;
        }
        else {
            this.context.pageParams.uiDisplay.tdPNOL = false;
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'CustomerInfoAvailable')) {
            this.context.pageParams.uiDisplay.tdCustomerInfo = true;
        }
        else {
            this.context.pageParams.uiDisplay.tdCustomerInfo = false;
        }
        if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo')).length < 4) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo', this.context.utils.Format(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo'), '0000'));
        }
        else {
            if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo')).length > 4) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo', this.context.utils.Format(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo'), '000000'));
            }
        }
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'InvTypeSel');
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'contracthasexpired') === 'Yes') {
            this.context.pageParams.uiDisplay.tdContractHasExpired = true;
        }
        else {
            this.context.pageParams.uiDisplay.tdContractHasExpired = false;
        }
        this.context.pageParams.vbServiceQuantity = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity');
        this.context.pageParams.vbServiceVisitFrequency = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency');
        this.context.pageParams.vbPriceChangeOnlyInd = false;
        if (this.context.pageParams.currentContractType !== 'P') {
            this.context.iCABSAServiceCoverMaintenance7.DOWSentriconToggle();
        }
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
        this.context.iCABSAServiceCoverMaintenance8.EnableRMMFields();
        this.context.iCABSAServiceCoverMaintenance2.HardSlotType_OnChange();
        this.context.iCABSAServiceCoverMaintenance5.AutoRouteProductInd_onClick();
        this.context.iCABSAServiceCoverMaintenance2.ServiceQuantityLabel();
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequireAnnualTimeInd') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift') !== '') {
            this.context.pageParams.uiDisplay.trUplift = true;
            this.context.iCABSAServiceCoverMaintenance8.GetUpliftStatus();
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift') === 'U') {
                this.context.pageParams.uiDisplay.trUpliftCalendar = true;
            }
            else {
                this.context.pageParams.uiDisplay.trUpliftCalendar = false;
            }
        }
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.iCABSAServiceCoverMaintenance1.riMaintenance_BeforeAdd();
        }
        this.context.iCABSAServiceCoverMaintenance2.riMaintenanceAfterEvent();
    };
    ServiceCoverMaintenance1.prototype.riMaintenance_BeforeAddMode = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ComponentGridCacheTime', this.context.utils.Time());
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdComponentSelAll');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdComponentDesAll');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'selTaxCode');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', 'D');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoPattern');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoPattern', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoPattern'));
        this.context.iCABSAServiceCoverMaintenance7.HideQuickWindowSet(false);
        if (this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintLog === true) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selTaxCode', true);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositCanAmend', 'Y');
        this.context.pageParams.SavedIncreaseQuantity = 0;
        this.context.pageParams.uiDisplay.trInvoiceType = true;
        this.context.pageParams.uiDisplay.trInvoiceStartDate = true;
        this.context.pageParams.uiDisplay.trInvoiceEndDate = true;
        this.context.pageParams.uiDisplay.trInvoiceValue = true;
        this.context.pageParams.uiDisplay.trForwardDateChangeInd = true;
        this.context.pageParams.tdAnnualTimeChange = false;
        this.context.pageParams.tdAnnualTimeChangeLab = false;
        this.context.pageParams.uiDisplay.trInvoiceSuspend = false;
        this.context.pageParams.uiDisplay.trInvoiceReleased = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InstallByBranchInd', true);
        this.context.pageParams.uiDisplay.labelInactiveEffectDate = false;
        this.context.pageParams.uiDisplay.InactiveEffectDate = false;
        this.context.pageParams.uiDisplay.tdReasonLab = false;
        this.context.pageParams.uiDisplay.tdReason = false;
        this.context.pageParams.uiDisplay.trEffectiveDate = false;
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.pageParams.uiDisplay.trUnitValue = false;
        }
        this.context.pageParams.uiDisplay.cmdValue = false;
        this.context.pageParams.uiDisplay.tdWasteTransfer = false;
        this.context.pageParams.uiDisplay.trDeliveryConfirmation = false;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') !== ''
            && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber') !== '') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdCopyServiceCover');
        }
        else {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCopyServiceCover');
        }
        this.context.pageParams.uiDisplay.trDepositLineAdd = false;
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DepositAmount');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DepositDate');
        if (this.context.pageParams.currentContractType === 'C') {
            this.context.pageParams.uiDisplay.trChkRenegContract = true;
            this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = false;
            this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = false;
        }
        else {
            this.context.pageParams.uiDisplay.trChkRenegContract = false;
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.pageParams.uiDisplay.tdUnitValueChangeLab = false;
            this.context.pageParams.uiDisplay.UnitValueChange = false;
        }
        this.context.pageParams.uiDisplay.tdAnnualValueChangeLab = false;
        this.context.pageParams.uiDisplay.AnnualValueChange = false;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') !== ''
            && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber') !== '') {
            if (this.context.parentMode === 'Premise-Add' || this.context.pageParams.currentContractType === 'J') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewPremise', 'yes');
            }
            else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewPremise', 'no');
            }
            this.context.riMaintenance.CBORequestClear();
            this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetServiceDefaultValues,GetPremiseWindows';
            this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.CBORequestAdd('ContractNumber');
            this.context.riMaintenance.CBORequestAdd('PremiseNumber');
            this.context.riMaintenance.CBORequestAdd('NewPremise');
            this.context.riMaintenance.CBORequestExecute(this.context, function (data) {
                if (data) {
                    this.context.riMaintenance.renderResponseForCtrl(this.context, data);
                }
                this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strEntryProcedure;
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'PremiseDefaultTimesInd')) {
                    this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('P');
                    this.context.iCABSAServiceCoverMaintenance2.UpdateDefaultTimes('Premise');
                }
                else {
                    this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('D');
                    this.context.iCABSAServiceCoverMaintenance2.UpdateDefaultTimes('Default');
                }
            });
        }
        if (this.context.parentMode === 'Premise-Add') {
            if (this.context.riExchange.getParentAttributeValue('RenegContract') !== null
                && this.context.riExchange.getParentAttributeValue('RenegContract') === 'true') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'chkRenegContract', true);
                this.context.iCABSAServiceCoverMaintenance3.chkRenegContract_onclick();
                this.context.riMaintenance.DisableInput('chkRenegContract');
                this.context.riMaintenance.DisableInput('RenegOldContract');
                this.context.riMaintenance.DisableInput('RenegOldPremise');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RenegOldContract', this.context.riExchange.getParentAttributeValue('ContractNumber'));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RenegOldPremise', this.context.riExchange.getParentAttributeValue('PremiseNumber'));
            }
        }
        this.context.riMaintenance.DisableInput('SeasonalBranchUpdate');
        this.context.iCABSAServiceCoverMaintenance7.CreateTabs();
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber')) {
        }
        else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber')) {
        }
        else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')) {
        }
        this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ServiceCommenceDate', false);
        this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ContractNumber', false);
        this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'PremiseNumber', false);
        this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ProductCode', false);
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'GetDefaultServiceType', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ServicMntConst.eTypeCode', MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ServiceTypeDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeCode', data['ServiceTypeCode']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeDesc', data['ServiceTypeDesc']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceBasis', 'N');
            this.context.iCABSAServiceCoverMaintenance2.ServiceBasis_OnChange();
            this.context.iCABSAServiceCoverMaintenance2.WindowPreferredIndChanged();
            this.context.iCABSAServiceCoverMaintenance3.GetDefaultTaxCode();
            if (this.context.parentMode === 'Premise-Add') {
                this.context.iCABSAServiceCoverMaintenance3.DefaultFromProspect();
                this.context.iCABSAServiceCoverMaintenance3.LeadEmployeeDisplay();
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LeadInd')) {
                    this.context.riExchange.riInputElement.focus('LeadEmployee');
                }
                this.context.iCABSAServiceCoverMaintenance3.BusinessOriginDetailDisplay();
            }
            this.context.iCABSAServiceCoverMaintenance4.ShowFields();
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd && this.context.pageParams.vbEnableProductServiceType) {
                this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
            }
        }, 'POST');
    };
    ServiceCoverMaintenance1.prototype.riMaintenance_BeforeAdd = function () {
        this.context.pageParams.uiDisplay.trEffectiveDate = false;
        this.context.pageParams.uiDisplay.trOutstandingRemovals = false;
        this.context.pageParams.uiDisplay.trRemovalEmployee = false;
        this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
        this.context.pageParams.uiDisplay.trInstallationEmployee = false;
        this.context.pageParams.uiDisplay.trRefreshDisplayVal = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo', '0');
        this.context.pageParams.uiDisplay.trUplift = false;
        this.context.pageParams.uiDisplay.trUpliftCalendar = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RMMJobVisitValue', '');
        this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning_innerText = true;
        this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelServiceBasis', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBasis'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelSubjectToUplift', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelUpliftVisitPosition', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UpliftVisitPositIon'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern'));
        this.context.iCABSAServiceCoverMaintenance2.SelServiceBasis_OnChange();
        if (this.context.pageParams.currentContractType === 'J') {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ServiceCommenceDate');
        }
        else if (this.context.pageParams.currentContractType === 'C') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SeasonalServiceInd');
            if (this.context.pageParams.vbEnableEntitlement) {
                this.context.iCABSAServiceCoverMaintenance3.ToggleEntitlementRequired();
            }
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelServiceBasis');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'selHardSlotType');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdHardSlotCalendar');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdDiaryView');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelSubjectToUplift');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelUpliftVisitPosition');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoAllocation');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoPattern');
        }
        this.context.riMaintenance.CBORequestClear();
        this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=BuildInvoiceTypeSelect' + '&ContractTypeCode=' + this.context.pageParams.currentContractType;
        this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.CBORequestExecute(this.context, function (data) {
            if (data) {
                this.context.riMaintenance.renderResponseForCtrl(this.context, data);
            }
            this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.iCABSAServiceCoverMaintenance7.BuildInvoiceTypeSelect();
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'InvTypeSel');
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                if (!this.context.pageParams.vbEnableServiceCoverDepreciation) {
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepreciationPeriod');
                }
            }
            this.context.iCABSAServiceCoverMaintenance4.ShowHideBudgetBilling();
            this.context.iCABSAServiceCoverMaintenance1.riMaintenance_BeforeAddMode();
        });
    };
    ServiceCoverMaintenance1.prototype.SetHTMLPageSettings = function () {
        this.context.pageParams.vbEnablePostcodeDefaulting = this.context.pageParams.vEnablePostcodeDefaulting;
        this.context.pageParams.vbEnableServiceCoverDetail = this.context.pageParams.vEnableServiceCoverDetail;
        this.context.pageParams.vbEnableInstallsRemovals = this.context.pageParams.vEnableInstallsRemovals;
        this.context.pageParams.vbEnableLocations = this.context.pageParams.vEnableLocations;
        this.context.pageParams.vbEnableDetailLocations = this.context.pageParams.vEnableDetailLocations;
        this.context.pageParams.vbLocationsSingleEntry = this.context.pageParams.vLocationsSingleEntry;
        this.context.pageParams.vbEnableEntitlement = this.context.pageParams.vEnableEntitlement;
        this.context.pageParams.vbEnableJobsToInvoiceAfterVisit = this.context.pageParams.vEnableJobsToInvoiceAfterVisit;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NationalAccountChecked', this.context.pageParams.vEnableNationalAccountWarning);
        this.context.pageParams.vbEnableFreeOfChargeServices = this.context.pageParams.vEnableFreeOfChargeServices;
        this.context.pageParams.vbEnableTrialPeriodServices = this.context.pageParams.vEnableTrialPeriodServices;
        this.context.pageParams.vbEnableStandardTreatmentTime = this.context.pageParams.vEnableSTTEntry;
        this.context.pageParams.vbEnableInitialTreatmentTime = this.context.pageParams.vEnableInitialTreatmentTime;
        this.context.pageParams.vbEnableAPICodeEntry = this.context.pageParams.vEnableAPICodeEntry;
        this.context.pageParams.vbEnableWorkLoadIndex = this.context.pageParams.vEnableWorkLoadIndex;
        this.context.pageParams.vbEnableMonthlyUnitPrice = this.context.pageParams.vEnableMonthlyUnitPrice;
        this.context.pageParams.vbSuspendSalesStatPortFig = this.context.pageParams.vSuspendSalesStatPortFig;
        this.context.pageParams.vbDefaultStockReplenishment = this.context.pageParams.vDefaultStockReplenishment;
        this.context.pageParams.vbEnableProductLinking = this.context.pageParams.vEnableProductLinking;
        this.context.pageParams.vbSuspendSalesStatPortFig = this.context.pageParams.vSuspendSalesStatPortFig;
        this.context.pageParams.vbEnableWeeklyVisitPattern = this.context.pageParams.vEnableWeeklyVisitPattern;
        this.context.pageParams.vbEnableTimePlanning = this.context.pageParams.vEnableTimePlanning;
        this.context.pageParams.vbShowInspectionPoint = this.context.pageParams.vShowInspectionPoint;
        this.context.pageParams.vbShowPremiseWasteTab = this.context.pageParams.vShowPremiseWasteTab;
        this.context.pageParams.vbEnableServiceCoverAvgWeightReq = this.context.pageParams.vEnableServiceCoverAvgWeightReq;
        this.context.pageParams.vbEnableServiceCoverDispLev = this.context.pageParams.vEnableServiceCoverDispLev;
        this.context.pageParams.vbEnableServiceCoverDepreciation = this.context.pageParams.vEnableServiceCoverDepreciation;
        this.context.pageParams.vbDisplayLevelInstall = this.context.pageParams.vDisplayLevelInstall;
        this.context.pageParams.vbEnableSpecificVisitDays = this.context.pageParams.vbEnableSpecificVisitDays;
        this.context.pageParams.vbEnableDeliveryRelease = this.context.pageParams.vEnableDeliveryRelease;
        this.context.pageParams.vbEnableMultipleTaxRates = this.context.pageParams.vEnableMultipleTaxRates;
        this.context.pageParams.vbOverrideMultipleTaxRates = this.context.pageParams.vOverrideMultipleTaxRates;
        this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintReq = this.context.pageParams.vDefaultTaxCodeProductExpenseReq;
        this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintLog = this.context.pageParams.vDefaultTaxCodeProductExpenseLog;
        this.context.pageParams.vWasteTransferReq = this.context.pageParams.vSCEnableWasteTransfer;
        this.context.pageParams.vbEnableProductServiceType = this.context.pageParams.vSCEnableProductServiceType;
        this.context.pageParams.vbEnableDepositProcessing = this.context.pageParams.vEnableDepositProcessing;
        this.context.pageParams.vbEnableRMM = this.context.pageParams.vEnableRMM;
        if (this.context.pageParams.vbEnableServiceCoverAvgWeightReq) {
            this.context.pageParams.vbEnableServiceCoverAvgWeightText = this.context.pageParams.vEnableServiceCoverAvgWeightText;
        }
        if (this.context.pageParams.currentContractType === 'J') {
            this.context.pageParams.vbEnableWeeklyVisitPattern = false;
        }
        if (this.context.pageParams.vbEnableJobsToInvoiceAfterVisit) {
            this.context.pageParams.JobInvoiceFirstVisitValue = this.context.pageParams.vJobInvoiceFirstVisitValue;
        }
        this.context.pageParams.uiDisplay.trRetainServiceWeekday = this.context.pageParams.vEnableRetentionOfServiceWeekDay;
        this.context.pageParams.uiDisplay.trInitialValue = this.context.pageParams.vEnableInitialCharge;
        this.context.pageParams.uiDisplay.trWorkLoadIndex = this.context.pageParams.vEnableWorkLoadIndex;
        this.context.pageParams.uiDisplay.trMonthlyUnitPrice = this.context.pageParams.vEnableMonthlyUnitPrice;
        this.context.pageParams.uiDisplay.trServiceDepot = this.context.pageParams.vShowServiceDepot;
        if (this.context.pageParams.vbEnableServiceCoverDispLev) {
            this.context.pageParams.uiDisplay.trWEDValue = this.context.pageParams.vEnableWED;
            this.context.pageParams.uiDisplay.trPricePerWED = this.context.pageParams.vEnableWED;
            this.context.pageParams.uiDisplay.trMinimumDuration = true;
        }
        else {
            this.context.pageParams.uiDisplay.trMinimumDuration = false;
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.pageParams.uiDisplay.trUnitValue = true;
        }
        else {
            this.context.pageParams.uiDisplay.trUnitValue = false;
        }
        if (this.context.pageParams.vbEnableAPICodeEntry && this.context.pageParams.currentContractType === 'C') {
            this.context.pageParams.uiDisplay.trAPICode = true;
        }
        else {
            this.context.pageParams.uiDisplay.trAPICode = false;
        }
        this.context.pageParams.uiDisplay.InactiveEffectDate = false;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCopyServiceCover');
        this.context.pageParams.uiDisplay.trWasteTransferType = this.context.pageParams.vShowPremiseWasteTab;
        this.context.iCABSAServiceCoverMaintenance8.EnableRMMFields();
    };
    ServiceCoverMaintenance1.prototype.ProductCode_OnChange = function () {
        this.context.initialLoad = true;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.iCABSAServiceCoverMaintenance6.TermiteServiceCheck();
            this.context.iCABSAServiceCoverMaintenance3.GetDefaultTaxCode();
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductDesc') === '') {
            this.context.iCABSAServiceCoverMaintenance1.GetProductDescription();
        }
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd && this.context.pageParams.vbEnableProductServiceType) {
            this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
        }
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
        }
        if (this.context.pageParams.boolPropertyCareInd === 'Y' && this.context.pageParams.boolUserWriteAccess === 'yes') {
            this.context.iCABSAServiceCoverMaintenance1.CheckGuaranteeRequiredInd();
        }
        this.context.iCABSAServiceCoverMaintenance8.EnableRMMFields();
        this.context.iCABSAServiceCoverMaintenance7.APTChangedAccordingToQuantity();
    };
    ServiceCoverMaintenance1.prototype.GetProductServiceType = function () {
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'GetProductServiceType', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ServicMntConst.eTypeCode', MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ServiceTypeDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeCode', data['ServiceTypeCode']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeDesc', data['ServiceTypeDesc']);
        }, 'POST');
    };
    ServiceCoverMaintenance1.prototype.GetProductExpenseTaxCodeDefault = function () {
        var _this = this;
        if (this.context.pageParams.vbDefaultTaxCodeProductExpenseReq === true) {
            this.context.ajaxSource.next(this.context.ajaxconstant.START);
            var query = this.context.getURLSearchParamObject();
            query.set(this.context.serviceConstants.Action, '6');
            var formData = {
                'Function': 'GetProductExpenseDefaultTaxCode',
                'ContractTypeCode': this.context.pageParams.currentContractType,
                'ProductCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')
            };
            this.context.httpService.makePostRequest(this.context.xhrParams.method, this.context.xhrParams.module, this.context.xhrParams.operation, query, formData)
                .subscribe(function (data) {
                _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    _this.context.errorService.emitError(data.errorMessage);
                    _this.context.showAlert(data.errorMessage, 0);
                }
                else {
                    _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TaxCode', data['TaxCode']);
                    _this.context.riExchange.riInputElement.SetValue(_this.context.uiForm, 'TaxDesc', data['TaxDesc']);
                    _this.context.riExchange.riInputElement.Disable(_this.context.uiForm, 'selTaxCode');
                    _this.context.pageParams.selTaxCode = [];
                    var obj = {
                        text: data['TaxCode'] + ' - ' + data['TaxDesc'],
                        value: data['TaxCode']
                    };
                    _this.context.pageParams.selTaxCode.push(obj);
                }
            }, function (error) {
                _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
                _this.context.errorService.emitError('Record not found');
            });
        }
    };
    ServiceCoverMaintenance1.prototype.GetProductDescription = function () {
        this.context.riMaintenance.BusinessObject = 'iCABSMassPriceChangeGrid.p';
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'GetProductDescription', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ProductDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProductDesc', data['ProductDesc']);
            if (this.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
                this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeFetch();
            }
        }, 'POST');
    };
    ServiceCoverMaintenance1.prototype.CheckGuaranteeRequiredInd = function () {
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        ;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'CheckGuaranteeRequiredInd', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('GuaranteeRequiredInd', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            if (data['GuaranteeRequiredInd'] === 'y') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GuaranteeRequired', true);
                this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
            }
            else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GuaranteeRequired', false);
            }
        }, 'POST');
    };
    return ServiceCoverMaintenance1;
}());
