import { AuthService } from './../../../../shared/services/auth.service';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { PostCodeUtils } from './../../../../shared/services/postCode-utility';
import { Injector } from '@angular/core';
import { ServiceCoverMaintenanceComponent } from './iCABSAServiceCoverMaintenance.component';

export class ServiceCoverMaintenance1 {

    private context: ServiceCoverMaintenanceComponent;
    private injector: Injector;
    private PostCodeDefaultingFunctions: PostCodeUtils;

    constructor(private parent: ServiceCoverMaintenanceComponent, injector: Injector) {
        this.context = parent;
        this.PostCodeDefaultingFunctions = injector.get(PostCodeUtils);
    }

    public init(): void {
        this.PostCodeDefaultingFunctions.PostCodeList().subscribe(
            (res) => {
                this.context.pageParams.vEnablePostcodeDefaulting = res;
            },
            (error) => {
                this.context.pageParams.vEnablePostcodeDefaulting = false;
            });
        this.context.iCABSAServiceCoverMaintenanceLoad.window_onload();
    }

    /************************************************************************************
     * BEFORE SELECT (Hide fields)      *
     ************************************************************************************/

    public riMaintenance_BeforeSelect(): void {
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

    }

    public CalAverageUnitValue(): void {

        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';

        this.context.riMaintenance.PostDataAdd('Function', 'CalculateAverageUnitValue', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.pageParams.ServiceCoverRowID, MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('AverageUnitValue', MntConst.eTypeCurrency);

        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AverageUnitValue', data['AverageUnitValue']);
        }, 'POST');
    }

    public CalDisplayValues(): void {

        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {

            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';

            if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.context.riMaintenance.PostDataAdd('Function', 'ReCalcDisplayValues', MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('LastChangeEffectDate',
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'), MntConst.eTypeDate);
            } else {
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

            this.context.riMaintenance.Execute(this.context, function (data: any): any {
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
    }

    public ServiceCoverWasteReq(): void {

        this.context.pageParams.blnServiceCoverWasteReq = false;
        this.context.iCABSAServiceCoverMaintenance8.GetServiceCoverWasteRequired();
    }

    /************************************************************************************
     * AFTER FETCH (Hide/Show fields)   *
     ************************************************************************************/
    public riMaintenance_AfterFetch(): void {
        this.context.iCABSAServiceCoverMaintenance4.ShowHideBudgetBilling();
        this.context.iCABSAServiceCoverMaintenance6.ShowHideTermiteRelatedFields();
        this.context.attributes.DefaultEffectiveDate = null;
        this.context.attributes.DefaultEffectiveDateProduct = null;

        //this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('C');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelServiceBasis',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBasis'));
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation',
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation'));
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern'));

        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift') === '') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelSubjectToUplift', 'N');
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelSubjectToUplift',
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift'));
        }

        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelUpliftVisitPosition',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UpliftVisitPosition'));

        this.context.iCABSAServiceCoverMaintenance2.SelServiceBasis_OnChange();
        this.context.iCABSAServiceCoverMaintenance8.SelSubjectToUplift_onChange();
        this.context.iCABSAServiceCoverMaintenance7.SelUpliftVisitPosition_onChange();

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

            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceVisitFrequencyCopy',
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'));
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitFrequencyWarningMessage') !== null) {
                this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning = true;
                this.context.pageParams.uiDisplay.VisitFrequencyWarningColour = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitFrequencyWarningColour');
                this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning_innerText = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitFrequencyWarningMessage');
            } else {
                this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning = false;
            }
        }

        //if ( user has Full Access || logged in neg || service branch then show value fields;
        if (this.context.pageParams.FullAccess === 'Full' || this.context.utils.getBranchCode().toString() === this.context.getControlValueAsString('ServiceBranchNumber')
            || this.context.utils.getBranchCode().toString() === this.context.getControlValueAsString('NegBranchNumber')) {
            this.context.pageParams.blnAccess = true;
        } else {
            this.context.pageParams.blnAccess = false;
        }

        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldHideList') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldHideList').indexOf('ServiceAnnualValue') === -1) {
            this.context.pageParams.blnValueRequired = true;
        } else {
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
            } else {
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

        //Show Invoice Info;
        if (this.context.pageParams.blnValueRequired) {
            this.context.pageParams.uiDisplay.trInvoiceType = true;
            this.context.pageParams.uiDisplay.trInvoiceStartDate = true;
            this.context.pageParams.uiDisplay.trInvoiceEndDate = true;
            this.context.pageParams.uiDisplay.trInvoiceValue = true;
            this.context.pageParams.uiDisplay.trForwardDateChangeInd = true;
            this.context.pageParams.uiDisplay.trInvoiceSuspend = true;
            this.context.pageParams.uiDisplay.trInvoiceReleased = true;
        } else {
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
        } else {
            this.context.pageParams.uiDisplay.trAnnualTime = false;
        }

        this.context.iCABSAServiceCoverMaintenance7.BuildInvoiceTypeSelect();

        switch (this.context.pageParams.currentContractType) {

            case 'C':
                //if ( blnAccess && blnValueRequired && Not vbEnableServiceCoverDispLev ) {
                if (this.context.pageParams.blnAccess && this.context.pageParams.blnValueRequired) {
                    //if ( Contract show AnnualValueChange field (Amendments to value will be added as the change rather than actual value);
                    //Value Change will only be displayed if ( Service Cover Displays not switched on;

                    if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                        (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
                            this.context.pageParams.uiDisplay.tdUnitValueChangeLab = true;
                            this.context.pageParams.uiDisplay.UnitValueChange = true;
                        }
                        this.context.pageParams.uiDisplay.trUnitValue = true;
                    }
                    this.context.pageParams.uiDisplay.tdAnnualValueChangeLab = true;
                    this.context.pageParams.uiDisplay.AnnualValueChange = true;
                    this.context.pageParams.uiDisplay.trInvoiceValue = true;
                    this.context.pageParams.uiDisplay.trServiceAnnualValue = true;
                } else {
                    if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                        (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
                            this.context.pageParams.uiDisplay.tdUnitValueChangeLab = true;
                            this.context.pageParams.uiDisplay.UnitValueChange = true;
                        }
                        this.context.pageParams.uiDisplay.trUnitValue = false;
                    }
                    this.context.pageParams.uiDisplay.tdAnnualValueChangeLab = false;
                    this.context.pageParams.uiDisplay.AnnualValueChange = false;
                    this.context.pageParams.uiDisplay.trInvoiceValue = false;
                    this.context.pageParams.uiDisplay.trServiceAnnualValue = false;
                }

                //#36525 Display Initial Value field for update of a Service cover if ( Initial Value SysChar is enabled;
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

                    //Show Reneg Indicator && if ( set to true, show all Reneg associated fields;

                    this.context.pageParams.uiDisplay.trChkRenegContract = true;

                    if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkRenegContract')) {
                        this.context.pageParams.uiDisplay.tdRenegOldContract = true;
                    } else {
                        this.context.pageParams.uiDisplay.tdRenegOldContract = false;
                    }

                } else {
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
                    } else {

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
                } else {
                    this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = false;
                    this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = false;
                }
                break;
            case 'J':

                //if ( Job hide AnnualValueChange field (enter the full annual value not change in value);
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.pageParams.uiDisplay.tdUnitValueChangeLab = false;
                    this.context.pageParams.uiDisplay.UnitValueChange = false;
                }
                this.context.pageParams.uiDisplay.tdAnnualValueChangeLab = false;
                this.context.pageParams.uiDisplay.AnnualValueChange = false;

                //Hide all Reneg associated fields;
                this.context.pageParams.uiDisplay.trChkRenegContract = false;

                //if ( Contract.FirstInvoicedDate is NE ? Then hide invoice fields;
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FirstInvoicedDate') === 'yes') {
                    this.context.pageParams.uiDisplay.trInvoiceType = false;
                    this.context.pageParams.uiDisplay.trInvoiceStartDate = false;
                    this.context.pageParams.uiDisplay.trInvoiceEndDate = false;
                    this.context.pageParams.uiDisplay.trInvoiceValue = false;
                    this.context.pageParams.uiDisplay.trForwardDateChangeInd = false;
                }

                //Only users with full access || logged in as neg || service branch can view values;
                if (this.context.pageParams.blnAccess && this.context.pageParams.blnValueRequired) {
                    if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                        (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                        this.context.pageParams.uiDisplay.trUnitValue = true;
                    }
                    this.context.pageParams.uiDisplay.trServiceAnnualValue = true;
                } else {
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

        //Hide/Show Term/Delete Date;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InactiveEffectDate')) {
            this.context.pageParams.uiDisplay.labelInactiveEffectDate = true;
            this.context.pageParams.uiDisplay.InactiveEffectDate = true;

            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SCLostBusinessDesc')) {
                this.context.pageParams.uiDisplay.tdReasonLab = true;
                this.context.pageParams.SCLostBusinessDesc_title = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SCLostBusinessDesc2') +
                    '\n' + this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SCLostBusinessDesc3');
                this.context.pageParams.uiDisplay.tdReason = true;
            } else {
                this.context.pageParams.uiDisplay.tdReasonLab = false;
                this.context.pageParams.uiDisplay.tdReason = false;
            }

        } else {
            this.context.pageParams.uiDisplay.labelInactiveEffectDate = false;
            this.context.pageParams.uiDisplay.InactiveEffectDate = false;
            this.context.pageParams.uiDisplay.tdReasonLab = false;
            this.context.pageParams.uiDisplay.tdReason = false;
        }

        //Hide/Show Future Change button;
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ShowValueButton') && this.context.pageParams.blnValueRequired) {
            this.context.pageParams.uiDisplay.cmdValue = true;
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdValue');
        } else {
            this.context.pageParams.uiDisplay.cmdValue = false;
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdValue');
        }

        //if ( come from Client Retention then default the LastChangeEffectDate from OutcomeEffectDate on Contact;
        if (this.context.parentMode === 'ContactUpdate') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutcomeEffectDate',
                this.context.riExchange.getParentHTMLValue('OutcomeEffectDate'));
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LastChangeEffectDate',
                this.context.riExchange.getParentHTMLValue('LastChangeEffectDate'));
        }

        //Hide Outstanding Installation details
        this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
        this.context.pageParams.uiDisplay.trInstallationEmployee = false;
        this.context.pageParams.uiDisplay.trInstallationValue = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations', '0');

        if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'StockOrderAllowed') === 'yes')
            && this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.pageParams.uiDisplay.trChkStockOrder = true;
        } else {
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
            //StandardTreatmentTime.value = FormatDateTime(TimeSerial(0, 0, 0), vbShortTime);
        } else {
            this.context.pageParams.uiDisplay.trAnnualTime = false;

            if (this.context.pageParams.vbEnableStandardTreatmentTime) {
                this.context.pageParams.uiDisplay.trStandardTreatmentTime = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'StandardTreatmentTime', true);
            }
        }

        //Store saved values to be used as comparison to determine what qty's have been changed.;

        if (!isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), 2))) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceVisitFrequency',
                parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), 2));
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceVisitFrequency', '0');
        }

        if (!isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 2))) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceQuantity',
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'));
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceQuantity', '0');
        }

        if (!isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue'), 2))) {
            this.context.pageParams.SavedServiceAnnualValue = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue');
        } else {
            this.context.pageParams.SavedServiceAnnualValue = '0.00';
        }

        this.context.pageParams.SavedInitialTreatmentTime = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InitialTreatmentTime');

        this.context.pageParams.SavedServiceAnnualTime = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualTime');

        this.context.pageParams.SavedWasteTransferType = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode');

        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'NationalAccountChecked') &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'NationalAccount')) {
            this.context.pageParams.uiDisplay.tdNationalAccount = true;
        } else {
            this.context.pageParams.uiDisplay.tdNationalAccount = false;
        }

        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'PNOL')) {
            this.context.pageParams.uiDisplay.tdPNOL = true;
        } else {
            this.context.pageParams.uiDisplay.tdPNOL = false;
        }

        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'CustomerInfoAvailable')) {
            this.context.pageParams.uiDisplay.tdCustomerInfo = true;
        } else {
            this.context.pageParams.uiDisplay.tdCustomerInfo = false;
        }

        //Format SeqNo Display;
        if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo')).length < 4) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo',
                this.context.utils.Format(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo'), '0000'));
        } else {
            if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo')).length > 4) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo',
                    this.context.utils.Format(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaSeqNo'), '000000'));
            }
        }

        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'InvTypeSel');

        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractHasExpired') === 'Yes') {
            this.context.pageParams.uiDisplay.tdContractHasExpired = true;
        } else {
            this.context.pageParams.uiDisplay.tdContractHasExpired = false;
        }

        this.context.pageParams.vbServiceQuantity = this.context.getControlValueAsString('ServiceQuantity') ? this.context.getControlValueAsString('ServiceQuantity') : '0';
        this.context.pageParams.vbServiceVisitFrequency = this.context.getControlValueAsString('ServiceVisitFrequency') ? this.context.getControlValueAsString('ServiceVisitFrequency') : '0';
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
            } else {
                this.context.pageParams.uiDisplay.trUpliftCalendar = false;
            }
        }

        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.iCABSAServiceCoverMaintenance1.riMaintenance_BeforeAdd();
        }
        this.context.iCABSAServiceCoverMaintenance2.riMaintenanceAfterEvent();
    }


    /************************************************************************************
     * BEFORE ADD MODE (Default values/Hide/Show fields)*
     ************************************************************************************/

    public riMaintenance_BeforeAddMode(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ComponentGridCacheTime', this.context.utils.Time());
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdComponentSelAll');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdComponentDesAll');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'selTaxCode');

        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', 'D');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoPattern');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoPattern', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoPattern'));

        //Blank Line of Service value && hide field on new records;
        //this.context.pageParams.tdLineofService_innerhtml = '';
        //this.context.pageParams.uiDisplay.tdLineOfService = false;

        this.context.iCABSAServiceCoverMaintenance7.HideQuickWindowSet(false);

        if (this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintLog === true) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }

        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selTaxCode', true);
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositCanAmend', 'Y');

        this.context.pageParams.SavedIncreaseQuantity = 0;

        this.context.pageParams.uiDisplay.tdUnitValueChangeLab = false;
        this.context.pageParams.uiDisplay.UnitValueChange = false;

        //Show Invoice Start/End/Val fields;
        this.context.pageParams.uiDisplay.trInvoiceType = true;
        this.context.pageParams.uiDisplay.trInvoiceStartDate = true;
        this.context.pageParams.uiDisplay.trInvoiceEndDate = true;
        this.context.pageParams.uiDisplay.trInvoiceValue = true;
        this.context.pageParams.uiDisplay.trForwardDateChangeInd = true;
        this.context.pageParams.tdAnnualTimeChange = false;
        this.context.pageParams.tdAnnualTimeChangeLab = false;

        //SH 03/07/2003 - do not show inv.suspend details when in 'add' mode;
        this.context.pageParams.uiDisplay.trInvoiceSuspend = false;
        this.context.pageParams.uiDisplay.trInvoiceReleased = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InstallByBranchInd', true);

        //Hide Delete/Term Date (not applicable);
        this.context.pageParams.uiDisplay.labelInactiveEffectDate = false;
        this.context.pageParams.uiDisplay.InactiveEffectDate = false;
        this.context.pageParams.uiDisplay.tdReasonLab = false;
        this.context.pageParams.uiDisplay.tdReason = false;
        this.context.pageParams.uiDisplay.trEffectiveDate = false;

        //Hide value button/Waste Transfer details;
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.pageParams.uiDisplay.trUnitValue = false;
        }
        //this.context.pageParams.uiDisplay.trServiceAnnualValue = false;
        this.context.pageParams.uiDisplay.cmdValue = false;
        this.context.pageParams.uiDisplay.tdWasteTransfer = false;
        //trAnnualValueChange.height = '1';

        this.context.pageParams.uiDisplay.trDeliveryConfirmation = false;

        //Enable Copy Service Cover button;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') !== ''
            && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber') !== '') {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdCopyServiceCover');
        } else {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCopyServiceCover');
        }

        this.context.pageParams.uiDisplay.trDepositLineAdd = false;
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DepositAmount');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DepositDate');

        if (this.context.pageParams.currentContractType === 'C') {
            //Only show Renegotitated checkbox if ( Contract;
            this.context.pageParams.uiDisplay.trChkRenegContract = true;
            //SRS 41 C012260 Hide FOC fields until indicator checked;
            this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = false;
            this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = false;
        } else {
            //SH 13/05/2003 QRS0576 - ensure that 'reneg' option is not shown for JOBS;
            this.context.pageParams.uiDisplay.trChkRenegContract = false;
        }

        //And hide the AnnualValueChange field (when in add mode just enter the actual annual value);
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.pageParams.uiDisplay.tdUnitValueChangeLab = false;
            this.context.pageParams.uiDisplay.UnitValueChange = false;
        }

        this.context.pageParams.uiDisplay.tdAnnualValueChangeLab = false;
        this.context.pageParams.uiDisplay.AnnualValueChange = false;

        //Default Service Cover information from the Premise record;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') !== ''
            && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber') !== ''
            && (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ContractNumber')
                || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'PremiseNumber'))) {

            if (this.context.parentMode === 'Premise-Add' || this.context.pageParams.currentContractType === 'J') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewPremise', 'yes');
            } else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewPremise', 'no');
            }

            this.context.riMaintenance.CBORequestClear();
            this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetServiceDefaultValues,GetPremiseWindows';
            this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.CBORequestAdd('ContractNumber');
            this.context.riMaintenance.CBORequestAdd('PremiseNumber');
            this.context.riMaintenance.CBORequestAdd('NewPremise');
            this.context.riMaintenance.CBORequestExecute(this.context, function (data: any): any {
                if (!this.context.copyMode && data) {
                    this.context.riMaintenance.renderResponseForCtrl(this.context, data);
                    this.context.setControlValue('ClosedTemplateName', this.context.getControlValue('TemplateName'));
                    this.context.setControlValue('TemplateName', '');
                }
                this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strEntryProcedure;
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'PremiseDefaultTimesInd')) {
                    this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('P');
                    this.context.iCABSAServiceCoverMaintenance2.UpdateDefaultTimes('Premise');
                } else {
                    this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('D');
                    this.context.iCABSAServiceCoverMaintenance2.UpdateDefaultTimes('Default');
                }
            });
        }


        //Arrived from Premise maintenance after selecting a Renegotiated Premise;
        //MSA 15/09/2004 - Changed slightly to fix problem with lazy evaluation;
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

        //MSA - Seasonal Service;
        this.context.riMaintenance.DisableInput('SeasonalBranchUpdate');

        //MSA - Reset tabs to default;
        this.context.iCABSAServiceCoverMaintenance7.CreateTabs();
        //SRS 019 Focus not in correct field;
        //TODO
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber')) {
            //ContractNumber.Focus;
        } else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber')) {
            //PremiseNumber.Focus;
        } else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')) {
            //ProductCode.Focus;
        }
        //05/01/06 PG #14138 Prevent fields && tabs going red due to moving the focus;
        this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ServiceCommenceDate', false);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceCommenceDate', true);
        this.context.riExchange.updateCtrl(this.context.controls, 'ServiceCommenceDate', 'required', true);
        this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ContractNumber', false);
        this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'PremiseNumber', false);
        this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ProductCode', false);
        //Call riTab.TabRefreshStatus();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'GetDefaultServiceType', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ServicMntConst.eTypeCode', MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ServiceTypeDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            if (!(this.context.copyMode && this.context.fieldHasValue('ServiceTypeCode'))) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeCode', data['ServiceTypeCode']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeDesc', data['ServiceTypeDesc']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceBasis', 'N');
                this.context.setDropDownComponentValue('ServiceTypeCode', 'ServiceTypeDesc');
            }
            this.context.iCABSAServiceCoverMaintenance2.ServiceBasis_OnChange();

            this.context.iCABSAServiceCoverMaintenance2.WindowPreferredIndChanged();
            if (!(this.context.copyMode && this.context.fieldHasValue('TaxCode'))) {
                this.context.iCABSAServiceCoverMaintenance3.GetDefaultTaxCode();
            }
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
            if (this.context.fieldHasValue('ProductCode')) {
                this.context.utils.getFirstFocusableFieldForTab(1);
            }
        }, 'POST');
    }


    /************************************************************************************
     * BEFORE ADD (Default values/Hide/Show fields)
     ************************************************************************************/

    public riMaintenance_BeforeAdd(): void {

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
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'ServiceCommenceDate');

        this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning_innerText = true;
        this.context.pageParams.uiDisplay.tdNumberOfVisitsWarning = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelServiceBasis', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBasis'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelSubjectToUplift', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelUpliftVisitPosition', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UpliftVisitPositIon'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern'));
        if (this.context.initialLoad) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation'));
        }
        this.context.iCABSAServiceCoverMaintenance2.SelServiceBasis_OnChange();

        if (this.context.pageParams.currentContractType === 'J') {

            //Disable ServiceCommenceDate after defaulting it from the Contract Commence Date
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ServiceCommenceDate');

        } else if (this.context.pageParams.currentContractType === 'C') {

            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SeasonalServiceInd');

            if (this.context.pageParams.vbEnableEntitlement) {
                this.context.iCABSAServiceCoverMaintenance3.ToggleEntitlementRequired();
            }
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelServiceBasis');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'selHardSlotType');
            //this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdHardSlotCalendar');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdDiaryView');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelSubjectToUplift');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelUpliftVisitPosition');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoPattern');
            if (this.context.initialLoad) {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoAllocation');
            }
        }
        //SRS 17 Build initial invoice type select;
        this.context.riMaintenance.CBORequestClear();
        this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=BuildInvoiceTypeSelect' + '&ContractTypeCode=' + this.context.pageParams.currentContractType;
        this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.CBORequestExecute(this.context, function (data: any): any {
            if (data) {
                this.context.riMaintenance.renderResponseForCtrl(this.context, data);
            }
            this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.iCABSAServiceCoverMaintenance7.BuildInvoiceTypeSelect();
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'InvTypeSel');

            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                //this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ExpiryDate');

                if (!this.context.pageParams.vbEnableServiceCoverDepreciation) {
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepreciationPeriod');
                }
            }
            this.context.iCABSAServiceCoverMaintenance4.ShowHideBudgetBilling();
            this.context.iCABSAServiceCoverMaintenance1.riMaintenance_BeforeAddMode();
        });
    }


    //*************** S P E E D S C R I P T   L O G I C ************************************************************************;

    public SetHTMLPageSettings(): void {

        //Hide/Show fields && set variables depending on whether System Chars are required || not;
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

        } else {
            this.context.pageParams.uiDisplay.trMinimumDuration = false;
        }

        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.pageParams.uiDisplay.trUnitValue = true;
        } else {
            this.context.pageParams.uiDisplay.trUnitValue = false;
        }

        if (this.context.pageParams.vbEnableAPICodeEntry && this.context.pageParams.currentContractType === 'C') {
            this.context.pageParams.uiDisplay.trAPICode = true;
        } else {
            this.context.pageParams.uiDisplay.trAPICode = false;
        }

        this.context.pageParams.uiDisplay.InactiveEffectDate = false;

        //Disable Copy Service Cover button;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCopyServiceCover');
        this.context.pageParams.uiDisplay.trWasteTransferType = this.context.pageParams.vShowPremiseWasteTab;

        this.context.iCABSAServiceCoverMaintenance8.EnableRMMFields();
    }

    public ProductCode_OnChange(): void {
        this.context.initialLoad = true;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.iCABSAServiceCoverMaintenance6.TermiteServiceCheck();
            this.context.iCABSAServiceCoverMaintenance3.GetDefaultTaxCode();
        }

        this.context.iCABSAServiceCoverMaintenance1.GetProductDescription();

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
        this.context.linkedServiceCoverSearchParams.ProductCode = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode');
    }

    public GetProductServiceType(): void {
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'GetProductServiceType', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ServicMntConst.eTypeCode', MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ServiceTypeDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeCode', data['ServiceTypeCode']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeDesc', data['ServiceTypeDesc']);
            this.context.setDropDownComponentValue('ServiceTypeCode', 'ServiceTypeDesc');
        }, 'POST');
    }

    public GetProductExpenseTaxCodeDefault(): void {
        if (this.context.pageParams.vbDefaultTaxCodeProductExpenseReq === true) {
            this.context.ajaxSource.next(this.context.ajaxconstant.START);
            let query = this.context.getURLSearchParamObject();
            query.set(this.context.serviceConstants.Action, '6');
            let formData = {
                'Function': 'GetProductExpenseDefaultTaxCode',
                'ContractTypeCode': this.context.pageParams.currentContractType,
                'ProductCode': this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')
            };
            //formData = this.context.utils.cleanForm(formData);
            this.context.httpService.makePostRequest(this.context.xhrParams.method, this.context.xhrParams.module,
                this.context.xhrParams.operation, query, formData)
                .subscribe(
                (data) => {
                    this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                    if (data.errorMessage) {
                        this.context.errorService.emitError(data.errorMessage);
                        this.context.showAlert(data.errorMessage, 0);
                    } else {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCode', data['TaxCode']);
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxDesc', data['TaxDesc']);
                        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
                        this.context.pageParams.selTaxCode = [];
                        let obj = {
                            text: data['TaxCode'] + ' - ' + data['TaxDesc'],
                            value: data['TaxCode']
                        };
                        this.context.pageParams.selTaxCode.push(obj);
                    }
                },
                (error) => {
                    this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
                    this.context.errorService.emitError('Record not found');
                }
                );
        }
    }

    public GetProductDescription(): void {
        this.context.riMaintenance.BusinessObject = 'iCABSMassPriceChangeGrid.p';
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'GetProductDescription', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ProductDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProductDesc', data['ProductDesc']);
            if (this.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
                this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeFetch();
            }
        }, 'POST');

    }

    public CheckGuaranteeRequiredInd(): void {
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'CheckGuaranteeRequiredInd', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('GuaranteeRequiredInd', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            if (data['GuaranteeRequiredInd'] === 'y') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GuaranteeRequired', true);
                this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
            } else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GuaranteeRequired', false);
            }
        }, 'POST');
    }
}
