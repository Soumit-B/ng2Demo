import { MessageConstant } from './../../../../shared/constants/message.constant';
import { Injector } from '@angular/core';
import { ServiceCoverMaintenanceComponent } from './iCABSAServiceCoverMaintenance.component';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

export class ServiceCoverMaintenance4 {

    private context: ServiceCoverMaintenanceComponent;
    private injector: Injector;

    constructor(private parent: ServiceCoverMaintenanceComponent, injector: Injector) {
        this.context = parent;
    }

    public cmdCalcInstalment_OnClick(): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntry.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'CalcBudgetInstalments', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeTextFree);
        this.context.riMaintenance.PostDataAdd('PremiseNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        //this.context.riMaintenance.PostDataAdd('ServiceCoverNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCoverNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('ServiceAnnualValue', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue'), MntConst.eTypeDecimal1);
        this.context.riMaintenance.PostDataAdd('BudgetNumberInstalments', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BudgetNumberInstalments'), MntConst.eTypeInteger);
        this.context.riMaintenance.ReturnDataAdd('BudgetNumberInstalments', MntConst.eTypeInteger);
        this.context.riMaintenance.ReturnDataAdd('BudgetInstalAmount', MntConst.eTypeCurrency);
        this.context.riMaintenance.ReturnDataAdd('BudgetTermsDesc', MntConst.eTypeTextFree);
        this.context.riMaintenance.ReturnDataAdd('BudgetBalance', MntConst.eTypeCurrency);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BudgetNumberInstalments', data['BudgetNumberInstalments']);
            this.riExchange.riInputElement.SetValue(this.context.uiForm, 'BudgetInstalAmount', data['BudgetInstalAmount']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BudgetBalance', data['BudgetBalance']);
            this.riExchange.riInputElement.SetValue(this.context.uiForm, 'BudgetTermsDesc', data['BudgetTermsDesc']);
        }, 'POST');
    }

    public ShowHideBudgetBilling(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeNumber')) {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeNumber') === '26') {
                this.context.iCABSAServiceCoverMaintenance6.GetBudgetInstalmentDetails();
                this.context.pageParams.uiDisplay.trBudgetBillingLine1 = true;
                this.context.pageParams.uiDisplay.trBudgetBillingLine2 = true;
                this.context.pageParams.uiDisplay.trBudgetBillingLine3 = true;
                this.context.pageParams.uiDisplay.trBudgetBillingLine4 = true;
                this.context.pageParams.uiDisplay.trBudgetBillingLine5 = true;
            } else {
                this.context.pageParams.uiDisplay.trBudgetBillingLine1 = false;
                this.context.pageParams.uiDisplay.trBudgetBillingLine2 = false;
                this.context.pageParams.uiDisplay.trBudgetBillingLine3 = false;
                this.context.pageParams.uiDisplay.trBudgetBillingLine4 = false;
                this.context.pageParams.uiDisplay.trBudgetBillingLine5 = false;
            }
        }
    }

    // C B O REQUEST;
    public riExchange_CBORequest(): void {
        this.context.logger.log(' IN CBO 0', this.context.riMaintenance.CurrentMode);
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd &&
            this.context.riMaintenance.CurrentMode !== MntConst.eModeUpdate) {
            return;
        }
        this.context.pageParams.FunctionString = '';
        this.context.pageParams.strPostVars = '';
        this.context.pageParams.strFunctions = '';
        this.context.pageParams.blnContractNumber = false;
        this.context.pageParams.blnPremiseNumber = false;
        this.context.pageParams.blnProductCode = false;
        this.context.pageParams.blnNewPremise = false;
        this.context.pageParams.blnFieldShowList = false;
        this.context.pageParams.blnServiceCommenceDate = false;
        this.context.pageParams.blnServiceQuantity = false;
        this.context.pageParams.blnLastChangeEffectDate = false;
        this.context.pageParams.blnNextInvoiceStartDate = false;
        this.context.pageParams.blnNextInvoiceEndDate = false;
        this.context.pageParams.blnServiceAnnualValue = false;
        this.context.pageParams.blnServiceBranchNumber = false;
        this.context.pageParams.blnBranchServiceAreaCode = false;
        this.context.pageParams.blnAnnualValueChange = false;
        this.context.pageParams.blnEntitlementQuantity = false;
        this.context.pageParams.blnEntitlementPrice = false;
        this.context.pageParams.blnTrialPeriodEndDate = false;
        this.context.pageParams.blnSeasonalTemplateNumber = false;
        this.context.pageParams.blnBusinessOrigin = false;
        this.context.pageParams.blnContractTrialInd = false;
        this.context.pageParams.blnWasteTransferTypeCode = false;
        this.context.pageParams.blnLeadEmployee = false;
        this.context.pageParams.blnMinimumDuration = false;
        this.context.pageParams.blnExcludeUnConfirmedValues = false;
        this.context.pageParams.blnUpliftTemplateNumber = false;
        this.context.pageParams.blnRMMCategory = false;

        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetBusinessDefaultWindows,';
        this.context.logger.log(' IN CBO', this.context.riMaintenance.CurrentMode);
        // 1.Decide which functions need to run;
        switch (this.context.riMaintenance.CurrentMode) {
            case MntConst.eModeAdd:
                if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity') && this.context.pageParams.vbEnableTimePlanning) {
                    this.context.iCABSAServiceCoverMaintenance8.UpdateSPT();
                    this.context.iCABSAServiceCoverMaintenance7.APTChangedAccordingToQuantity();
                }

                if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'CustomerAvailTemplateID')) {
                    this.context.iCABSAServiceCoverMaintenance2.UpdateTemplate();
                }

                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') &&
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber')) {
                    if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ContractNumber') ||
                        this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'PremiseNumber')) {
                        if (this.context.parentMode === 'Premise-Add' || this.context.pageParams.currentContractType === 'J') {
                            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewPremise', 'yes');
                        } else {
                            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewPremise', 'no');
                        }
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetServiceDefaultValues,';
                        this.context.pageParams.blnContractNumber = true;
                        this.context.pageParams.blnPremiseNumber = true;
                        this.context.pageParams.blnNewPremise = true;
                        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InstallationEmployeeCode')) {
                            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'DefaultInstallationEmployee,';
                        }
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetPremiseWindows,';
                    } //CN PN changed;

                    if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode') &&
                        this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ProductCode')) {
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetServiceDetails,GetShowFields,GetWasteTransferType,';
                        this.context.pageParams.blnContractNumber = true;
                        this.context.pageParams.blnPremiseNumber = true;
                        this.context.pageParams.blnProductCode = true;
                        this.context.pageParams.blnServiceBranchNumber = true;
                        this.context.pageParams.blnFieldShowList = true;
                        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate')) {
                            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetDates,';
                            this.context.pageParams.blnServiceCommenceDate = true;
                        }
                    }
                    if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode') &&
                        this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ProductCode')) ||
                        (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode') &&
                            this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'WasteTransferTypeCode'))) {

                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'CheckWasteConsignmentNoteRequired,';
                        this.context.pageParams.blnContractNumber = true;
                        this.context.pageParams.blnPremiseNumber = true;
                        this.context.pageParams.blnProductCode = true;
                        this.context.pageParams.blnWasteTransferTypeCode = true;
                    }
                    // 26/05/06 PG #23032 Get Virtuals loses focus, so stop it being called when user;
                    // tabs off the (normally) last fld.  Why is this being called so often anyway?;
                    if (!(this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceSpecialInstructions')
                        || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'EntitlementPricePerUnit'))) {
                        //riMaintenance.GetVirtuals();
                    }
                }
                //Default ServiceVisitAnnivDt,NextInvoiceStartDt && validate ServiceCommenceDt is an anniversary dt;
                if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceCommenceDate') &&
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate')) {
                    this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetDates,WarnAnniversaryCommenceDate,';
                    this.context.pageParams.blnContractNumber = true;
                    this.context.pageParams.blnServiceCommenceDate = true;
                    if (this.context.pageParams.vbEnableServiceCoverDispLev) {
                        this.context.pageParams.blnMinimumDuration = true;
                    }
                }
                // 05/05/05 PG SRS 41 Get inv dts for FOC;
                if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'FOCInvoiceStartDate') &&
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FOCInvoiceStartDate')) {
                    this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetDates,WarnFOCInvoiceStartDate,GetFOCWarning,';
                    this.context.pageParams.blnContractNumber = true;
                    this.context.pageParams.blnServiceCommenceDate = true;
                }
                //Validate ServiceAnnualValue is more than min value && less than max value on Bus file;
                if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceAnnualValue') &&
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue') && this.context.pageParams.blnValueRequired) {
                    this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'WarnValueRange,';
                    //MSA - QRS603(UK) - Inv ServiceCovers on Jobs at same time;
                    if (this.context.pageParams.currentContractType === 'J') {
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetInvoiceOnFirstVisitIndAdd,';
                        this.context.pageParams.blnContractNumber = true;
                        this.context.pageParams.blnPremiseNumber = true;
                    }
                    this.context.pageParams.blnServiceAnnualValue = true;
                }
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd')) {
                    //Get template dtls when template no has chngd;
                    if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'SeasonalTemplateNumber') &&
                        this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SeasonalTemplateNumber')) {
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetSeasonalTemplateInformation,GetSeasonalTemplateDates,';
                        this.context.pageParams.blnSeasonalTemplateNumber = true;
                        this.context.pageParams.blnLastChangeEffectDate = true;
                    }
                }
                this.context.iCABSAServiceCoverMaintenance4.CBO_Contd();
                break;
            case MntConst.eModeUpdate:
                this.context.logger.log(' INSIDE CBO 1', this.context.riMaintenance.CurrentMode);
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered') && this.context.riExchange.URLParameterContains('PendingReduction') &&
                    this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'LastChangeEffectDate')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValueChange', '0');
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualValueChange', '0');
                }
                if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'CustomerAvailTemplateID')) {
                    this.context.iCABSAServiceCoverMaintenance2.UpdateTemplate();
                }
                //Qty has changed;
                if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity')) {
                    if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity')) {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceQuantity', '0');
                    }

                    if (parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 0) >
                        parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity'), 0)) {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations',
                            parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 0) - parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity'), 0));
                        this.context.pageParams.SavedIncreaseQuantity = parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations'), 0);
                        this.context.pageParams.SavedReductionQuantity = 0;
                        if (this.context.pageParams.vbDisplayLevelInstall && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InstallationRequired')) {
                            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations', '0');
                        }
                        //if( Qty has reduced, default the o/standing removals fld to the reduction qty;
                    } else if (parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 0) >
                        parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity'), 0)) {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations',
                            parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity'), 0) - parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 0));
                        this.context.pageParams.SavedReductionQuantity = parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations'), 0);
                        this.context.pageParams.SavedIncreaseQuantity = 0;
                    }
                }
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') &&
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber')) {
                    this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetPremiseWindows,';
                    this.context.pageParams.blnContractNumber = true;
                    this.context.pageParams.blnPremiseNumber = true;
                }
                if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode') &&
                    this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ProductCode')) ||
                    (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode') &&
                        this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'WasteTransferTypeCode'))) {
                    this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'CheckWasteConsignmentNoteRequired,';
                    this.context.pageParams.blnContractNumber = true;
                    this.context.pageParams.blnPremiseNumber = true;
                    this.context.pageParams.blnProductCode = true;
                    this.context.pageParams.blnWasteTransferTypeCode = true;
                }
                //Default //Removal// employee;
                //if( in //Updt// mode && one of the following:  a) Service Area changed;
                //                                             b) Service Qty changed;
                //                                             c) O/standing Removals Qty changed;
                //AND o/standing Removals is less than the ttl reduction made (i.e. some units have already been removed);
                if ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'BranchServiceAreaCode')
                    || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity')
                    || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'OutstandingRemovals'))) {
                    if (isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingRemovals'), 10))) {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingRemovals', '0');
                    }
                    if ((this.context.pageParams.SavedReductionQuantity > 0 && this.context.pageParams.SavedReductionQuantity > parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingRemovals'), 10))
                        && !this.context.pageParams.vbDisplayLevelInstall) {
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'DefaultRemovalEmployee,';
                        this.context.pageParams.blnServiceBranchNumber = true;
                        this.context.pageParams.blnBranchServiceAreaCode = true;
                    }
                }
                //Also do equivalent for Installations;
                if ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'BranchServiceAreaCode')
                    || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity')
                    || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'OutstandingInstallations'))) {
                    if (isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations'), 10))) {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations', '0');
                    }
                    if ((this.context.pageParams.SavedIncreaseQuantity > 0 && this.context.pageParams.SavedIncreaseQuantity > parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations'), 10))
                        && !this.context.pageParams.vbDisplayLevelInstall) {
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'DefaultInstallationEmployee,';
                        this.context.pageParams.blnServiceBranchNumber = true;
                        this.context.pageParams.blnBranchServiceAreaCode = true;
                    }
                }
                //Calc ServiceAnnualValue due to AnnulaValueChange && Qty/Freq at LastChangeEffectDt;
                if (((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'LastChangeEffectDate') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'))
                    || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'AnnualValueChange') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange'))
                    || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceVisitFrequency') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'))
                    || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity')))
                    && this.context.pageParams.currentContractType === 'C') {
                    this.context.pageParams.strPostVars = this.context.pageParams.strPostVars + '&ServiceCoverRowID=' + this.context.riMaintenance.GetRowID('ServiceCoverROWID');
                    if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'LastChangeEffectDate') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate')) {
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetServiceValuesAtEffectDate,';
                        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd')) {
                            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetSeasonValuesAtEffectDate,';
                        }
                    }
                    if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'LastChangeEffectDate') &&
                        this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate')) {
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'WarnAnniversaryDate,';
                        if (this.context.pageParams.blnEnableDowSentricon) {
                            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'CalcDOWSentriconValues,';
                        }
                    }
                    if (this.context.riExchange.URLParameterContains('PendingReduction')) {
                        this.context.pageParams.blnExcludeUnConfirmedValues = true;
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingReduction', 'PendingReduction');
                    } else {
                        this.context.pageParams.blnExcludeUnConfirmedValues = false;
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingReduction', '');
                    }
                    this.context.pageParams.blnLastChangeEffectDate = true;
                    this.context.pageParams.blnAnnualValueChange = true;
                    if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'AnnualValueChange') &&
                        this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange')) {
                        this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetAnnualValueAtEffectDate,WarnValueRange,';
                        if (this.context.pageParams.vbEnableTimePlanning) {
                            let msg1 = 'This Service Cover has an Actual Planned Time of ';
                            let msg2 = '. Please change accordingly if required.';
                            this.context.utils.getTranslatedval('This Service Cover has an Actual Planned Time of ').then((res: string) => {
                                if (res) {
                                    msg1 = res;
                                }
                            });

                            this.context.utils.getTranslatedval('. Please change accordingly if required.').then((res: string) => {
                                if (res) {
                                    msg2 = res;
                                }
                            });
                            setTimeout(() => {
                                this.context.showMessageDialog(msg1 + this.context.getControlValue('ActualPlannedTime') + msg2,
                                    this.context.iCABSAServiceCoverMaintenance4.CBO_Update_contd);
                            }, 100);

                        } else {
                            this.context.iCABSAServiceCoverMaintenance4.CBO_Update_contd();
                        }
                    } else {
                        this.context.iCABSAServiceCoverMaintenance4.CBO_Update_contd();
                    }
                } else {
                    this.context.iCABSAServiceCoverMaintenance4.CBO_Update_contd();
                }
        } //CurrentMode
    }

    public CBO_Update_contd(): void {
        this.context.logger.log(' INSIDE CBO 2', this.context.riMaintenance.CurrentMode);
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate
            && (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'AnnualValueChange') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange'))) {
            this.context.pageParams.blnValueChange = true;
        }
        //Default Inv on First Visit indicator depeneding on value of Job;
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceAnnualValue') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue')
            && this.context.pageParams.currentContractType === 'J') {
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                if (this.context.pageParams.strPostVars === true) {
                    this.context.pageParams.strPostVars = this.context.pageParams.strPostVars + '&ServiceCoverRowID=' + this.context.getControlValue('ServiceCoverROWID')
                        + '&JobInvoiceFirstVisitValue=' + this.context.pageParams.JobInvoiceFirstVisitValue;
                } else {
                    this.context.pageParams.strPostVars = this.context.pageParams.strPostVars + '&JobInvoiceFirstVisitValue=' + this.context.pageParams.JobInvoiceFirstVisitValue;
                }
            }
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'WarnValueRange,GetInvoiceOnFirstVisitInd,';
            this.context.pageParams.blnServiceAnnualValue = true;
            this.context.pageParams.blnValueChange = true; //This will be used to enable display entry;
        }
        // if( Trial Period End Dt has changed, allow change of Trial Period Chrg;
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'TrialPeriodEndDate')) {
            // Check Trial Period End Dt against value retrieved from record - if( dif(ferent;
            // allow change to value fld. if( the same, reset value to value from record and;
            // disable fld.;
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TrialPeriodEndDate') === this.context.pageParams.dtTrialPeriodEndDateRecordValue) {
                this.context.riMaintenance.DisableInput('TrialPeriodChargeValue');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TrialPeriodChargeValue', this.context.pageParams.deTrialPeriodChargeRecordValue);
            } else {
                this.context.riMaintenance.EnableInput('TrialPeriodChargeValue');
            }
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceVisitAnnivDate')) {
            this.context.pageParams.blnServiceVisitAnnivDateChange = true;
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd')) {
            if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'SeasonalTemplateNumber') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SeasonalTemplateNumber')) {
                this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetSeasonalTemplateInformation,GetSeasonalTemplateDates,';
                this.context.pageParams.blnSeasonalTemplateNumber = true;
                this.context.pageParams.blnLastChangeEffectDate = true;
            }
        }
        this.context.iCABSAServiceCoverMaintenance4.CBO_Contd();
    }

    public CBO_Contd(): void {
        if (!(this.context.initialLoad && this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) && ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ProductCode') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'))
            || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'LastChangeEffectDate') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'))
            || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity'))) {
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate && this.context.pageParams.strPostVars === true) {
                this.context.pageParams.strPostVars = this.context.pageParams.strPostVars + '&ServiceCoverRowID=' + this.context.riMaintenance.GetRowID('ServiceCoverROWID');
            }
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'CalculateInstallationValue,';
            this.context.pageParams.blnProductCode = true;
            this.context.pageParams.blnServiceQuantity = true;
            this.context.pageParams.blnLastChangeEffectDate = true;
        }
        //Recalc Inv Val if( Service Commence Dt/Effect Dt/Annual Val chnged;
        if (!(this.context.initialLoad && this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) && ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceCommenceDate') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate'))
            || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'LastChangeEffectDate') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'))
            || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceAnnualValue') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue'))
            || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'AnnualValueChange') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange'))
            || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ProductCode') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'))
            || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'FOCProposedAnnualValue') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FOCProposedAnnualValue')))) { // SRS 041;
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetNextInvoiceValue,';
            this.context.pageParams.blnContractNumber = true;
            this.context.pageParams.blnPremiseNumber = true;
            this.context.pageParams.blnProductCode = true;
            this.context.pageParams.blnLastChangeEffectDate = true;
            this.context.pageParams.blnServiceAnnualValue = true;
            this.context.pageParams.blnNextInvoiceStartDate = true;
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NextInvoiceEndDate')) {
                this.context.pageParams.blnNextInvoiceEndDate = true;
            }
        }
        //Get Service Employee/Seq No if( Branch service area code chngd;
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'BranchServiceAreaCode') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaCode')) {
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetServiceAreaDefaults,';
            this.context.pageParams.blnServiceBranchNumber = true;
            this.context.pageParams.blnBranchServiceAreaCode = true;
            this.context.pageParams.blnContractNumber = true;
            this.context.pageParams.blnPremiseNumber = true;
            //Reset Seq No if( changing Area;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaSeqNo', '0000');
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'EntitlementPricePerUnit') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementPricePerUnit')) {
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'WarnEntitlementPrice,';
            this.context.pageParams.blnEntitlementPrice = true;
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'UpliftTemplateNumber') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UpliftTemplateNumber')) {
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetUpliftTemplateName,';
            this.context.pageParams.blnUpliftTemplateNumber = true;
        }
        if ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'EntitlementAnnualQuantity') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnualQuantity'))
            || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'EntitlementNextAnnualQuantity') &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementNextAnnualQuantity'))) { // #19864;
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'WarnEntitlementQuantity,';
            this.context.pageParams.blnEntitlementQuantity = true;
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'TrialPeriodEndDate') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TrialPeriodEndDate')) {
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetTrialPeriodInvoiceDates,';
            this.context.pageParams.blnContractNumber = true;
            this.context.pageParams.blnTrialPeriodEndDate = true;
            this.context.pageParams.blnServiceCommenceDate = true;
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'BusinessOriginCode') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BusinessOriginCode')) { // 29/02/08 PG #34956;
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetBusinessOrigin,';
            this.context.pageParams.blnBusinessOrigin = true;
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'RMMCategoryCode') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RMMCategoryCode')) { // 29/02/08 PG #34956;
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetRMMCategory,';
            this.context.pageParams.blnRMMCategory = true;
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'LeadEmployee') &&
            this.context.fieldHasValue('LeadEmployee')) {
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetLeadEmployee,';
            this.context.pageParams.blnLeadEmployee = true;
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity') && this.context.pageParams.uiDisplay.tdEntitlement === true
            && (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.context.riMaintenance.CurrentMode === MntConst.eModeAdd)) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'EntitlementAnnualQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'));
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'EntitlementNextAnnualQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'));
            this.context.iCABSAServiceCoverMaintenance2.CalculateEntitlementServiceQuantity();
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'EntitlementAnnualQuantity') && this.context.pageParams.uiDisplay.trServiceQuantity === true
            && (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.context.riMaintenance.CurrentMode === MntConst.eModeAdd)) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnualQuantity'));
        }
        if (this.context.pageParams.blnUseVisitCycleValue) {
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetVisitCycleInWeeks,';
        }
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'Contract') ||
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') ||
            !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractTrialPeriodInd')) {
            this.context.pageParams.blnContractTrialInd = true;
            this.context.pageParams.strFunctions = this.context.pageParams.strFunctions + 'GetContractTrialInd,';
        }

        //* 2. Bld the request && execute it;
        if (this.context.pageParams.strFunctions) {
            this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=' + this.context.utils.Left(this.context.pageParams.strFunctions,
                this.context.utils.len(this.context.pageParams.strFunctions) - 1) + this.context.pageParams.strPostVars;
            this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);

            if (this.context.pageParams.blnContractNumber && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber')) {
                this.context.riMaintenance.CBORequestAdd('ContractNumber');
            }
            if (this.context.pageParams.blnPremiseNumber && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber')) {
                this.context.riMaintenance.CBORequestAdd('PremiseNumber');
            }
            if (this.context.pageParams.blnProductCode && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')) {
                this.context.riMaintenance.CBORequestAdd('ProductCode');
            }
            if (this.context.pageParams.blnNewPremise && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NewPremise')) {
                this.context.riMaintenance.CBORequestAdd('NewPremise');
            }
            if (this.context.pageParams.blnFieldShowList && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldShowList')) {
                this.context.riMaintenance.CBORequestAdd('FieldShowList');
            }
            if (this.context.pageParams.blnServiceCommenceDate && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate')) {
                this.context.riMaintenance.CBORequestAdd('ServiceCommenceDate');
            }
            if (this.context.pageParams.blnServiceQuantity && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity')) {
                this.context.riMaintenance.CBORequestAdd('ServiceQuantity');
            }
            if (this.context.pageParams.blnLastChangeEffectDate && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate')) {
                this.context.riMaintenance.CBORequestAdd('LastChangeEffectDate');
            }
            if (this.context.pageParams.blnNextInvoiceStartDate && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NextInvoiceStartDate')) {
                this.context.riMaintenance.CBORequestAdd('NextInvoiceStartDate');
            }
            if (this.context.pageParams.blnNextInvoiceEndDate && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NextInvoiceEndDate')) {
                this.context.riMaintenance.CBORequestAdd('NextInvoiceEndDate');
            }
            if (this.context.pageParams.blnServiceAnnualValue && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue')) {
                this.context.riMaintenance.CBORequestAdd('ServiceAnnualValue');
            }
            if (this.context.pageParams.blnServiceBranchNumber && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBranchNumber')) {
                this.context.riMaintenance.CBORequestAdd('ServiceBranchNumber');
            }
            if (this.context.pageParams.blnBranchServiceAreaCode && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaCode')) {
                this.context.riMaintenance.CBORequestAdd('BranchServiceAreaCode');
            }
            if (this.context.pageParams.blnAnnualValueChange && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange')) {
                this.context.riMaintenance.CBORequestAdd('AnnualValueChange');
            }
            if (this.context.pageParams.blnEntitlementPrice && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementPricePerUnit')) {
                this.context.riMaintenance.CBORequestAdd('EntitlementPricePerUnit');
            }
            if (this.context.pageParams.blnEntitlementQuantity) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnualQuantity')) {
                    this.context.riMaintenance.CBORequestAdd('EntitlementAnnualQuantity');
                }
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementNextAnnualQuantity')) {
                    this.context.riMaintenance.CBORequestAdd('EntitlementNextAnnualQuantity');
                }
            }
            if (this.context.pageParams.blnServiceSpecialInstructions && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceSpecialInstructions')) {
                this.context.riMaintenance.CBORequestAdd('ServiceSpecialInstructions');
            }
            if (this.context.pageParams.blnTrialPeriodEndDate && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TrialPeriodEndDate')) {
                this.context.riMaintenance.CBORequestAdd('TrialPeriodEndDate');
            }
            if (this.context.pageParams.blnSeasonalTemplateNumber && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SeasonalTemplateNumber')) {
                this.context.riMaintenance.CBORequestAdd('SeasonalTemplateNumber');
            }
            if (this.context.pageParams.blnBusinessOrigin && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BusinessOriginCode')) {
                this.context.riMaintenance.CBORequestAdd('BusinessOriginCode');
            }
            if (this.context.pageParams.blnContractTrialInd && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber')) {
                this.context.riMaintenance.CBORequestAdd('ContractPeriodTrialInd');
            }
            if (this.context.pageParams.blnWasteTransferTypeCode && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode')) {
                this.context.riMaintenance.CBORequestAdd('WasteTransferTypeCode');
            }
            if (this.context.pageParams.blnLeadEmployee && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LeadEmployee')) {
                this.context.riMaintenance.CBORequestAdd('LeadEmployee');
            }
            if (this.context.pageParams.blnMinimumDuration && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'MinimumDuration')) {
                this.context.riMaintenance.CBORequestAdd('MinimumDuration');
            }
            if (this.context.pageParams.blnExcludeUnConfirmedValues && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PendingReduction')) {
                this.context.riMaintenance.CBORequestAdd('PendingReduction');
            }
            if (this.context.pageParams.blnUpliftTemplateNumber && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UpliftTemplateNumber')) {
                this.context.riMaintenance.CBORequestAdd('UpliftTemplateNumber');
            }
            if (this.context.pageParams.blnRMMCategory && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RMMCategoryCode')) {
                this.context.riMaintenance.CBORequestAdd('RMMCategoryCode');
            }
            // 05/05/05 PG SRS 41 Add FoC fields, required for several of the functions;


            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkFOC')) {
                this.context.riMaintenance.CBORequestAdd('chkFOC');
                // Allow CBORequest to proceed even if( FOC fields haven//t been entered, in case the user;
                // ) { unchecks the FOC flag (leaving potentially invalid invoice dts for example);
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FOCInvoiceStartDate')) {
                    this.context.riMaintenance.CBORequestAdd('FOCInvoiceStartDate');
                }
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FOCProposedAnnualValue')) {
                    this.context.riMaintenance.CBORequestAdd('FOCProposedAnnualValue');
                }
            }
            this.context.riMaintenance.CBORequestExecute(this.context, function (data: any): any {
                if (data.hasError) {
                    this.context.showAlert(data.errorMessage);
                } else {
                    //this.context.riMaintenance.renderResponseForCtrl(this.context, data);
                    for (let id in data) {
                        if (id) {
                            let respData = data[id];
                            if (respData) {
                                let ctrlType = this.context.riMaintenance.getControlType(this.context.controls, id, 'type');
                                if (ctrlType) {
                                    respData = this.context.riMaintenance.respDataFormatUI(ctrlType, respData);
                                    if (ctrlType === MntConst.eTypeDate) {
                                        this.context.riMaintenance.updateDateField(this.context, respData, id);
                                    }
                                    this.context.riExchange.updateCtrl(this.context.controls, id, 'value', respData);
                                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, id, respData);
                                } else {
                                    this.context.riExchange.updateCtrl(this.context.controls, id, 'value', respData);
                                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, id, respData);
                                }
                            }
                        }
                    }
                    if (this.context.initialLoad && this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                        this.context.setControlValue('ClosedTemplateName', this.context.getControlValue('TemplateName'));
                        this.context.setControlValue('TemplateName', '');
                    }
                }
                this.iCABSAServiceCoverMaintenance4.postProcessing();

            });
        } else {
            this.context.iCABSAServiceCoverMaintenance4.postProcessing();
        }
    }

    public postProcessing(): void {
        if (this.context.pageParams.strFunctions) {
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                if (this.context.pageParams.blnServiceAnnualValue && this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                    this.context.iCABSAServiceCoverMaintenance6.CalculateUnitValue();
                }
            }
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PendingReduction')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingReduction', '');
            }
            this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strEntryProcedure;

            //* 3. Do any after request processing;
            //override o/standing install to 0;
            if (this.context.pageParams.vbEnableTrialPeriodServices) {   // SRS040A Use syschar flag;
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ContractTrialPeriodInd')) {
                    this.context.pageParams.uiDisplay.tdTrialPeriodInd = false;
                    this.context.pageParams.uiDisplay.tdContractTrialPeriodInd = true;
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ContractTrialPeriodInd', true);
                    this.context.riMaintenance.DisableInput('ContractTrialPeriodInd');
                } else {
                    this.context.pageParams.dtTrialPeriodEndDateRecordValue = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TrialPeriodEndDate');
                    this.context.pageParams.deTrialPeriodChargeRecordValue = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TrialPeriodChargeValue');
                    this.context.pageParams.uiDisplay.tdTrialPeriodInd = true;
                    //riMaintenance.DisableInput('TrialPeriodInd');
                    this.context.pageParams.uiDisplay.tdContractTrialPeriodInd = false;
                    // richy - following call causes Strange TabOrder;
                    this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
                }
            }
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks') === '0') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeks', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitsPerCycle', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', '');
            }
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PreferredDayOfWeekReasonCode') === '0') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PreferredDayOfWeekReasonCode', '');
                this.context.setDropDownComponentValue('PreferredDayOfWeekReasonCode', 'PreferredDayOfWeekReasonLangDesc');
            }
            if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'VisitCycleInWeeks') || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'VisitsPerCycle')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', '');
            }
            if (this.context.pageParams.blnFieldShowList && !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessage')) {
                this.context.iCABSAServiceCoverMaintenance4.ShowFields();
            }
            //Is this product valid for stock order (product sales) ?;
            if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'StockOrderAllowed') === 'yes')
                && this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.context.pageParams.uiDisplay.trChkStockOrder = true;
            } else {
                this.context.pageParams.uiDisplay.trChkStockOrder = false;
            }
            if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'SeasonalTemplateNumber')) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SeasonalTemplateNumber')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SeasonalBranchUpdate', true);
                    this.context.iCABSAServiceCoverMaintenance7.EnableSeasonalChanges(false);
                    this.context.iCABSAServiceCoverMaintenance7.ShowSeasonalRows();
                }
            }
            // 31/08/05 PG SRS041A;
            if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'FOCInvoiceStartDate') &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FOCMessageText')) {
                // Warn the user that service commence dt will be chngd;
                //Call MsgBox(FOCMessageText.value, this.context.pageParams.vbOKOnly);
                this.context.showAlert(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FOCMessageText'), 2);
            }
            if (this.context.pageParams.blnBusinessOrigin) {
                this.context.iCABSAServiceCoverMaintenance3.LeadEmployeeDisplay();
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LeadInd')) {
                    //this.context.riExchange.riInputElement.focus('LeadEmployee');
                } else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadEmployee', '');
                }
                this.context.iCABSAServiceCoverMaintenance3.BusinessOriginDetailDisplay();
            }
            if (this.context.pageParams.strFunctions.indexOf('InheritFromPremise,') > 0) {
                this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('P');
            }
            if (this.context.pageParams.strFunctions.indexOf('GetServiceDefaultValues,') > 0) {
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'PremiseDefaultTimesInd')) {
                    this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('P');
                    this.context.iCABSAServiceCoverMaintenance2.UpdateDefaultTimes('Premise');
                } else {
                    this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('D');
                    this.context.iCABSAServiceCoverMaintenance2.UpdateDefaultTimes('Default');
                }
            }

            this.context.iCABSAServiceCoverMaintenance3.CheckWasteTransferRequired();

            if (!this.context.pageParams.vbShowPremiseWasteTab) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'WasteTransferTypeCode', false);
            }
            if (this.context.pageParams.vbEnableServiceCoverDispLev && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ReplacementIncludeInd')) {
                this.context.iCABSAServiceCoverMaintenance3.SetReplacementIncInd();
            }
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode') &&
                this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ProductCode')) {
                this.context.pageParams.uiDisplay.tdLineOfService_innerhtml = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LOSName');
                this.context.pageParams.uiDisplay.tdLineOfService = true;
                this.context.iCABSAServiceCoverMaintenance2.ServiceQuantityLabel();
            }
        } //this.context.pageParams.strFunctions !== true;
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity')) {
            if (isNaN(parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 10))) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceQuantity', '0');
            }

            switch (this.context.riMaintenance.CurrentMode) {
                case MntConst.eModeAdd:
                    this.context.pageParams.blnQuantityChange = true;
                    if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InstallationRequired')) {
                        if (this.context.pageParams.vbEnableServiceCoverDispLev
                            && this.context.pageParams.vbEnableDeliveryRelease
                            && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                            this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
                            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'));
                        } else {
                            this.context.pageParams.uiDisplay.trOutstandingInstallations = true;
                            //(#45032 - set to 0 if( display level sys char is on);
                            if (!this.context.pageParams.vbDisplayLevelInstall) {
                                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'));
                            } else {
                                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations', '0');
                                this.context.pageParams.uiDisplay.trInstallationEmployee = true;
                                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'InstallationEmployeeCode', true);
                            }
                        }
                        this.context.pageParams.uiDisplay.trInstallationValue = true;
                        this.context.pageParams.uiDisplay.trRemovalValue = true;
                        this.context.pageParams.SavedIncreaseQuantity = parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 10);
                    }
                    break;
                case MntConst.eModeUpdate:
                    if ((parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 10) > parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity'), 10))
                        || (parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 10) < parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity'), 10))) {
                        this.context.pageParams.blnQuantityChange = true;
                    } else {
                        this.context.pageParams.blnQuantityChange = false;
                    }
                    if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InstallationRequired')) {
                        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity')) {
                            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SavedServiceQuantity', '0');
                        }
                        if (parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 10) >
                            parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity'), 10)) {
                            if (this.context.pageParams.vbEnableServiceCoverDispLev
                                && this.context.pageParams.vbEnableDeliveryRelease
                                && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                                this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
                            } else {
                                this.context.pageParams.uiDisplay.trOutstandingInstallations = true;
                            }
                            this.context.pageParams.uiDisplay.trOutstandingRemovals = false;
                            this.context.pageParams.uiDisplay.trRemovalEmployee = false;
                            //if( InstallationValue is required && qty increased, show InstallationValue fld;
                            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldHideList').indexOf('InstallationValue') === -1) {
                                this.context.pageParams.uiDisplay.trInstallationValue = true;
                            }
                            //if( Qty has reduced, hide Install Employee, show Removal Employee;
                        }
                    } else {
                        if (parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 10) < parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SavedServiceQuantity'), 10)) {
                            this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
                            this.context.pageParams.uiDisplay.trInstallationEmployee = false;
                            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'InstallationEmployeeCode', false);
                            if (this.context.pageParams.vbEnableServiceCoverDispLev && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                                this.context.pageParams.uiDisplay.trOutstandingRemovals = false;
                            } else {
                                this.context.pageParams.uiDisplay.trOutstandingRemovals = true;
                            }
                            this.context.pageParams.uiDisplay.trInstallationValue = false;  //No need for InstallationValue if( qty reduction;
                        } else {  //Qty has been changed but ) { changed back so stayed the same qty, so hide both Install/Removal Emp;
                            this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
                            this.context.pageParams.uiDisplay.trInstallationEmployee = false;
                            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'InstallationEmployeeCode', false);
                            this.context.pageParams.uiDisplay.trOutstandingRemovals = false;
                            this.context.pageParams.uiDisplay.trRemovalEmployee = false;
                            this.context.pageParams.uiDisplay.trInstallationValue = false;
                        }
                    }
            }
            if (this.context.pageParams.vbEnableWorkLoadIndex) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity') !== '0') {
                    let a = parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WorkLoadIndex'), 10);
                    let b = parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), 10);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WorkLoadIndexTotal', a * b);
                } else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WorkLoadIndexTotal', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WorkLoadIndex'));
                }
            }
        }  //ServiceQty has changed;
        //if( O/standing Installations changed ) { show Installation Employee dtls;
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'OutstandingInstallations')
            || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity') && this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate)) {
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingInstallations', '0');
            }
            if (parseInt(this.context.pageParams.SavedIncreaseQuantity, 10) >
                parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations'), 10)) {
                this.context.pageParams.uiDisplay.trInstallationEmployee = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'InstallationEmployeeCode', true);
            } else {
                this.context.pageParams.uiDisplay.trInstallationEmployee = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'InstallationEmployeeCode', false);
            }
        }
        //if( O/standing Removals changed ) { show Removal Employee details;
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'OutstandingRemovals')) {
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingRemovals')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OutstandingRemovals', '0');
            }
            if (this.context.pageParams.SavedReductionQuantity > parseInt(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingRemovals'), 10)) {
                this.context.pageParams.uiDisplay.trRemovalEmployee = true;
            } else {
                this.context.pageParams.uiDisplay.trRemovalEmployee = false;
            }
        }
        //Seasonal Service;
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd')) {
            // if( SeasonalTemplateNumber is blank, allow changes;
            if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'SeasonalTemplateNumber')) {
                if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SeasonalTemplateNumber')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SeasonalBranchUpdate', false);
                    this.context.iCABSAServiceCoverMaintenance7.EnableSeasonalChanges(true);
                    this.context.riMaintenance.DisableInput('SeasonalBranchUpdate');
                } else {
                    if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                        this.context.riMaintenance.EnableInput('SeasonalBranchUpdate');
                    }
                }
            }
            // No of seasons has changed;
            if ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'NumberOfSeasons'))
                || (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'LastChangeEffectDate') && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'))) {
                //if( there is no value in the input box, set it to '1';
                if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NumberOfSeasons')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NumberOfSeasons', '1');
                }
                // Show correct no of rows;
                this.context.iCABSAServiceCoverMaintenance7.ShowSeasonalRows();
            }
        }
        //Enable/disable Copy From Service Cover button;
        if ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ContractNumber')
            || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'PremiseNumber')) &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber') &&
            this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdCopyServiceCover');
        }

        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'AnnualTimeChange')) {
                //Time Format;
                this.context.pageParams.vbNegative = false;
                this.context.pageParams.vbError = false;
                this.context.pageParams.vbTimeFormat = '##00' + this.context.pageParams.vbTimeSeparator + '##';
                this.context.riExchange.riInputElement.isCorrect(this.context.uiForm, 'AnnualTimeChange');
                this.context.pageParams.vbAnnualTimeChange = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualTimeChange').replace(this.context.pageParams.vbTimeSeparator, '');
                if (isNaN(parseInt(this.context.pageParams.vbAnnualTimeChange, 10))
                    && this.context.pageParams.vbAnnualTimeChange) {
                    this.context.pageParams.vbError = true;
                }
                if (!this.context.pageParams.vbError && (this.context.utils.len(this.context.pageParams.vbAnnualTimeChange) < 4 || this.context.utils.len(this.context.pageParams.vbAnnualTimeChange) > 8)) {
                    this.context.pageParams.vbError = true;
                } else if (!this.context.pageParams.vbError) {
                    //this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualTimeChange', 'riExchange.Functions.Formats.riformat(this.context.pageParams.vbAnnualTimeChange,this.context.pageParams.vbTimeFormat)');
                    if (!this.context.pageParams.vbError && this.context.pageParams.vbAnnualTimeChange === 0) {
                        this.context.pageParams.vbError = true;
                    }
                    if (!this.context.pageParams.vbError) {
                        this.context.pageParams.vbDurationHours = this.context.utils.mid(this.context.pageParams.vbAnnualTimeChange, 1, this.context.utils.len(this.context.pageParams.vbAnnualTimeChange) - 2);
                        this.context.pageParams.vbDurationMinutes = this.context.utils.Right(this.context.pageParams.vbAnnualTimeChange, 2);
                        if (this.context.pageParams.vbDurationHours < 0) {
                            this.context.pageParams.vbDurationHours = this.context.pageParams.vbDurationHours * -1; //Assign negative value back to a positive;
                            this.context.pageParams.vbNegative = true;
                        }
                        if (this.context.pageParams.vbDurationMinutes < 0) {
                            this.context.pageParams.vbDurationMinutes = this.context.pageParams.vbDurationMinutes * -1;
                            this.context.pageParams.vbNegative = true;
                        }
                        if (this.context.pageParams.vbDurationMinutes > 59) {
                            //this.context.pageParams.vbMsgResult = msgbox('<%=riT('Minutes Entered Cannot Be Greater Than 59')%>', this.context.pageParams.vbOKOnly + this.context.pageParams.vbExclamation, '<%=riT('Warning')%>');
                            this.context.showAlert('Minutes Entered Cannot Be Greater Than 59');
                            this.context.pageParams.vbError = true;
                        } else {
                            this.context.pageParams.vbAnnualTimeChangeSec = (this.context.pageParams.vbDurationHours * 60 * 60) + (this.context.pageParams.vbDurationMinutes * 60);
                            if (this.context.pageParams.vbNegative) {
                                this.context.pageParams.vbAnnualTimeChangeSec = this.context.pageParams.vbAnnualTimeChangeSec * -1;
                            }
                        }
                    }
                }

                if (!this.context.pageParams.vbError && this.context.pageParams.vbAnnualTimeChange) {
                    this.context.riExchange.riInputElement.isCorrect(this.context.uiForm, 'AnnualTimeChange');
                    this.context.riMaintenance.clear();
                    this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
                    this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
                    this.context.riMaintenance.PostDataAdd('Function', 'AnnualTimeChange', MntConst.eTypeText);
                    this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
                    this.context.riMaintenance.PostDataAdd('ServiceAnnualTime', this.context.pageParams.SavedServiceAnnualTime, MntConst.eTypeText);
                    this.context.riMaintenance.PostDataAdd('AnnualTimeChange', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualTimeChange'), MntConst.eTypeText);
                    this.context.riMaintenance.ReturnDataAdd('ServiceAnnualTime', MntConst.eTypeText);
                    this.context.riMaintenance.Execute(this.context, function (data: any): any {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualTime', data['ServiceAnnualTime']);
                    }, 'POST');
                } else {
                    if (this.context.pageParams.vbAnnualTimeChange) {
                        this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'AnnualTimeChange', true);
                    }
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualTime', this.context.pageParams.SavedServiceAnnualTime);
                }
            }
        }

        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate && this.context.pageParams.currentContractType === 'C') {
            //if( AnnualValueChange has changed, updt ServiceAnnualValue fld (only on updates && Contracts);
            if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'AnnualValueChange') &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate')) {
                /*let val = parseFloat(this.context.pageParams.SavedServiceAnnualValue) + parseFloat(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange'));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualValue',
                    this.context.utils.cCur(val.toString()));*/
                //this.context.riExchange.riInputElement.isCorrect(this.context.uiForm,, 'ServiceAnnualValue');
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.iCABSAServiceCoverMaintenance6.CalculateUnitValue();
                }
            }
            if (this.context.parentMode === 'ContactUpdate') {
                if (this.context.riExchange.URLParameterContains('PendingDeletion')) {
                    if (this.context.utils.cCur(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange')) < 0) {
                        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LostBusinessCode', true);
                        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LostBusinessDetailCode', true);
                    } else {
                        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LostBusinessCode', false);
                        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LostBusinessDetailCode', false);
                    }
                }
            }
            //if( Qty/Freq/Val change, show LastChangeEffectDt (only on updt && Contracts);
            if ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity')
                || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceVisitFrequency')
                || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceAnnualValue')
                || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'AnnualValueChange'))) {
                if (this.context.IsNumeric('ServiceQuantity')) {
                    this.context.pageParams.CompServiceQuantity = this.context.CInt('ServiceQuantity');
                } else {
                    this.context.pageParams.CompServiceQuantity = 0;
                }
                if (this.context.IsNumeric('ServiceVisitFrequency')) {
                    this.context.pageParams.CompServiceVisitFrequency = this.context.CInt('ServiceVisitFrequency');
                } else {
                    this.context.pageParams.CompServiceVisitFrequency = 0;
                }
                if (this.context.IsNumeric('ServiceAnnualValue')) {
                    this.context.pageParams.CompServiceAnnualValue = this.context.cCur('ServiceAnnualValue');
                } else {
                    this.context.pageParams.CompServiceAnnualValue = 0;
                }
                if (this.context.pageParams.CompServiceAnnualValue !== this.context.utils.cCur(this.context.pageParams.SavedServiceAnnualValue)
                    || this.context.pageParams.CompServiceVisitFrequency !== this.context.utils.CInt(this.context.pageParams.SavedServiceVisitFrequency)
                    || this.context.pageParams.CompServiceQuantity !== this.context.CInt('SavedServiceQuantity')) {
                    if (this.context.riExchange.riInputElement.isReadOnly(this.context.uiForm, 'LastChangeEffectDate')) {
                        this.context.pageParams.uiDisplay.trEffectiveDate = true;
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LastChangeEffectDate', true);
                    }
                    if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceAnnualValue')
                        || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'AnnualValueChange')) {
                        this.context.pageParams.uiDisplay.trEffectiveDate = true;
                    }
                }
            }
        }  //Mode ===Updt && Contracts;

        if ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceQuantity')
            || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceVisitFrequency')
            || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceAnnualValue')
            || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'AnnualValueChange'))) {
            //SJ #35942 Updt MonthlyUnitPrice whenever Qty/Freq/Value is updtd;
            this.context.pageParams.vbQty = 1;
            this.context.pageParams.vbFreq = 1;

            if (this.context.pageParams.vbEnableMonthlyUnitPrice && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue')) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity')) {
                    this.context.pageParams.vbQty = this.context.CInt('ServiceQuantity');
                } else {
                    this.context.pageParams.vbQty = 1;
                }

                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency')) {
                    this.context.pageParams.vbFreq = this.context.CInt('ServiceVisitFrequency');
                } else {
                    this.context.pageParams.vbFreq = 1;
                }

                if (this.context.pageParams.vbFreq > 12) {
                    this.context.pageParams.vbFreq = 12;
                }

                this.context.pageParams.vbVal = parseFloat(this.context.cCur('ServiceAnnualValue'));
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MonthlyUnitPrice',
                    (this.context.pageParams.vbVal / this.context.pageParams.vbQty / this.context.pageParams.vbFreq));
            }
        }

        //Calc Entitlement Service Qty;
        if ((this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ServiceVisitFrequency')
            || this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'EntitlementAnnualQuantity')) &&
            this.context.pageParams.uiDisplay.trEntitlementServiceQuantity === true) {
            this.context.iCABSAServiceCoverMaintenance2.CalculateEntitlementServiceQuantity();
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'CustomerInfoAvailable')) { //#15737 - JD - Dont display Cus Info box if( no cust info is available;
            this.context.pageParams.uiDisplay.tdCustomerInfo = true;
        } else {
            this.context.pageParams.uiDisplay.tdCustomerInfo = false;
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'NationalAccountChecked') &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'NationalAccount')) { //#15737 - JD - Dont display Nat Accts box if( not Nat Accts;
            this.context.pageParams.uiDisplay.tdNationalAccount = true;
        } else {
            this.context.pageParams.uiDisplay.tdNationalAccount = false;
        }

        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AverageWeight')) {
            this.context.iCABSAServiceCoverMaintenance3.ShowAverageWeight();
        }
        //This will default the indicator but needs to be run after show fields;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')
            && this.context.riMaintenance.CurrentMode === MntConst.eModeAdd &&
            this.context.pageParams.uiDisplay.trDOWSentricon === true) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DOWSentriconInd', true);
            this.context.iCABSAServiceCoverMaintenance7.DOWSentriconToggle();
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessage')) {
            //riExchange.Functions.Information.Description, this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessage'));
            //this.context.riExchange.Information.display();
            this.context.showAlert(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessage'), 3);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ErrorMessage', '');
            this.context.saveClicked = false;
        }
        for (let key in this.context.uiForm.controls) {
            if (key && this.context.uiForm.controls.hasOwnProperty(key) &&
                this.context.uiForm.controls[key].dirty) {
                this.context.uiForm.controls[key].markAsPristine();
                if (!this.context.uiForm.controls[key].invalid &&
                    this.context.uiForm.controls[key].touched) {
                    this.context.uiForm.controls[key].markAsUntouched();
                }
            }
        }
        if (this.context.saveClicked) {
            this.context.saveClicked = false;
            //this.context.iCABSAServiceCoverMaintenance7.saveRecord();
            this.context.renderTab(1);
            this.context.showDialog(MessageConstant.Message.ConfirmRecord,
                this.context.iCABSAServiceCoverMaintenance7.saveRecord);
        } else if (this.context.initialLoad) {
            this.context.initialLoad = false;
            this.context.branchServiceAreaSearchParams['ServiceBranchNumber'] = this.context.getControlValue('ServiceBranchNumber');
            this.context.branchServiceAreaSearchParams['BranchName'] = this.context.getControlValue('BranchName');
            this.context.branchServiceAreaSearchParamsVP['ServiceBranchNumber'] = this.context.getControlValue('ServiceBranchNumber');
            this.context.branchServiceAreaSearchParamsVP['BranchName'] = this.context.getControlValue('BranchName');
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.context.iCABSAServiceCoverMaintenance1.riMaintenance_AfterFetch();
            } else {
                this.context.iCABSAServiceCoverMaintenance2.riMaintenanceBeforeUpdate();
            }
        }
    }

    public ShowFields(): void {
        this.context.pageParams.blnHideOutstandingInstalls = true;
        this.context.pageParams.spanProductCodeLabel_innertext = '';
        //if( Value is required on the Product ) { show values;
        if (this.context.InStr('FieldShowList', 'ServiceAnnualValue') !== -1) {
            this.context.pageParams.blnValueRequired = true;
        } else {
            this.context.pageParams.blnValueRequired = false;
        }
        if (this.context.InStr('FieldShowList', 'WeighingRequiredInd') !== -1) {
            this.context.pageParams.uiDisplay.trWeighingRequiredInd = true;
        } else {
            this.context.pageParams.uiDisplay.trWeighingRequiredInd = false;
        }
        if (this.context.InStr('FieldShowList', 'SubjectToUplift') !== -1 ||
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift')) {
            this.context.pageParams.uiDisplay.trUplift = true;
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelSubjectToUplift', 'N');
                this.context.iCABSAServiceCoverMaintenance8.SelSubjectToUplift_onChange();
            } else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelSubjectToUplift',
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift'));
                this.context.iCABSAServiceCoverMaintenance8.SelSubjectToUplift_onChange();
                this.context.iCABSAServiceCoverMaintenance8.GetUpliftStatus();
                this.context.pageParams.tdUpliftStatus_backgroundcolor = 'white';
            }
        } else {
            this.context.pageParams.uiDisplay.trUplift = false;
            this.context.pageParams.uiDisplay.trUpliftCalendar = false;
            this.context.pageParams.tdUpliftStatus_InnerText = '';
            this.context.pageParams.tdUpliftStatus_backgroundcolor = '';
        }

        if (this.context.InStr('FieldShowList', 'InstallationValue') !== -1
            && this.context.InStr('FieldShowList', 'ServiceQuantity') !== -1) {
            this.context.pageParams.uiDisplay.trInstallationValue = true;
            this.context.pageParams.uiDisplay.trRemovalValue = true;
        } else {
            this.context.pageParams.uiDisplay.trInstallationValue = false;
            this.context.pageParams.uiDisplay.trRemovalValue = false;
        }
        if (this.context.pageParams.vbEnableDeliveryRelease &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DeliveryConfirmationInd') &&
            this.context.pageParams.currentContractType === 'C'
            && this.context.InStr('FieldShowList', 'ServiceQuantity') !== -1 &&
            this.context.InStr('FieldShowList', 'ServiceAnnualValue') !== -1 &&
            !this.context.riExchange.URLParameterContains('PendingReduction')) {
            this.context.pageParams.uiDisplay.trUnConfirmedLabel = true;
            this.context.pageParams.uiDisplay.trUnConfirmedEffectiveDate = true;
            this.context.pageParams.uiDisplay.trUnconfirmedDeliveryQty = true;
            this.context.pageParams.uiDisplay.trUnconfirmedDeliveryValue = true;
        } else {
            this.context.pageParams.uiDisplay.trUnConfirmedLabel = false;
            this.context.pageParams.uiDisplay.trUnConfirmedEffectiveDate = false;
            this.context.pageParams.uiDisplay.trUnconfirmedDeliveryQty = false;
            this.context.pageParams.uiDisplay.trUnconfirmedDeliveryValue = false;
        }
        if (this.context.pageParams.vbEnableInstallsRemovals) {
            if (this.context.InStr('FieldShowList', 'OutstandingInstallations') !== -1) {
                this.context.pageParams.blnHideOutstandingInstalls = false;
            }
        }
        if (this.context.InStr('FieldShowList', 'ServiceQuantity') === -1) {
            this.context.pageParams.uiDisplay.trServiceQuantity = false;
            this.context.pageParams.blnHideOutstandingInstalls = true;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceQuantity', false);
        } else {
            this.context.pageParams.uiDisplay.trServiceQuantity = true;
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
                this.context.riExchange.URLParameterContains('PendingReduction')) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceQuantity', false);
            } else {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceQuantity', true);
            }
        }
        if (this.context.InStr('FieldShowList', 'ServiceVisitAnnivDate') === -1) {
            this.context.pageParams.uiDisplay.trServiceVisitAnnivDate = false;
        } else {
            this.context.pageParams.uiDisplay.trServiceVisitAnnivDate = true;
        }
        if (this.context.InStr('FieldShowList', 'ServiceVisitFrequency') === -1) {
            this.context.pageParams.uiDisplay.trServiceVisitFrequency = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceVisitFrequency', false);
        } else {
            this.context.pageParams.uiDisplay.trServiceVisitFrequency = true;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceVisitFrequency', true);
        }
        if (this.context.InStr('FieldShowList', 'VisitCycleInWeeks') === -1 || this.context.pageParams.currentContractType === 'J' || !this.context.pageParams.blnUseVisitCycleValues) {
            this.context.pageParams.uiDisplay.trServiceVisitFrequencyCopy = false;
            this.context.pageParams.uiDisplay.trServiceVisitCycleFields1 = false;
            this.context.pageParams.uiDisplay.trServiceVisitCycleFields2 = false;
            this.context.pageParams.uiDisplay.trServiceVisitCycleFields3 = false;
            this.context.pageParams.uiDisplay.trStaticVisit = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitCycleInWeeks', false);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitsPerCycle', false);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', false);
        } else {
            this.context.pageParams.uiDisplay.trServiceVisitFrequencyCopy = true;
            this.context.pageParams.uiDisplay.trServiceVisitCycleFields1 = true;
            this.context.pageParams.uiDisplay.trServiceVisitCycleFields2 = true;
            this.context.pageParams.uiDisplay.trServiceVisitCycleFields3 = true;
            this.context.pageParams.uiDisplay.trStaticVisit = true;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitCycleInWeeks', true);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitsPerCycle', true);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', false);
        }
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate && this.context.pageParams.blnAccess)) {
            if (this.context.InStr('FieldShowList', 'ServiceAnnualValue') === -1) {
                this.context.pageParams.uiDisplay.trServiceAnnualValue = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualValue', false);
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.pageParams.uiDisplay.trUnitValue = false;
                }
            } else {
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.pageParams.uiDisplay.trUnitValue = true;
                }
                this.context.pageParams.uiDisplay.trServiceAnnualValue = true;
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
                    this.context.riExchange.URLParameterContains('PendingReduction')) {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualValue', false);
                } else {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualValue', true);
                }
            }
            if (this.context.InStr('FieldShowList', 'AnnualValueChange') === -1) {
                this.context.pageParams.uiDisplay.trAnnualValueChange = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'AnnualValueChange', false);
                this.context.pageParams.valueChange = this.context.controls[27].required = false;
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.pageParams.uiDisplay.trUnitValueChange = false;
                }
            } else if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                        this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                    this.context.pageParams.uiDisplay.trUnitValueChange = true;
                }
                this.context.pageParams.uiDisplay.trAnnualValueChange = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'AnnualValueChange', true);
                this.context.pageParams.valueChange = this.context.controls[27].required = true;
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
                    this.context.riExchange.URLParameterContains('PendingReduction')) {
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'AnnualValueChange');
                    if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'UnitValueChange');
                    }
                }
            }
        }
        if (this.context.InStr('FieldShowList', 'RequireAnnualTimeInd') === -1) {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualTime', false);
            this.context.riExchange.updateCtrl(this.context.controls, 'ServiceAnnualTime', 'required', false);
            this.context.pageParams.uiDisplay.trAnnualTime = false;
        } else {
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualTime', true);
                this.context.riExchange.updateCtrl(this.context.controls, 'ServiceAnnualTime', 'required', true);
            } else {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualTime', false);
                this.context.riExchange.updateCtrl(this.context.controls, 'ServiceAnnualTime', 'required', false);
            }
            this.context.pageParams.uiDisplay.trAnnualTime = true;
            this.context.pageParams.uiDisplay.trStandardTreatmentTime = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'StandardTreatmentTime', false);
        }
        if (this.context.InStr('FieldShowList', 'EFKReplacementMonth') === -1) {
            this.context.pageParams.uiDisplay.trEFKReplacementMonth = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EFKReplacementMonth', false);
        } else {
            this.context.pageParams.uiDisplay.trEFKReplacementMonth = true;
            if (this.context.pageParams.currentContractType === 'J') {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EFKReplacementMonth', false);
            } else {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EFKReplacementMonth', true);
            }
        }
        //if( Waste Transfer Fee is required ) { show value && checkboxes;
        if (this.context.InStr('FieldShowList', 'WasteTransferChargeValue') === -1 ||
            !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode') || !this.context.pageParams.vWasteTransferReq) {
            this.context.pageParams.uiDisplay.tdWasteTransfer = false;
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.context.pageParams.uiDisplay.trAnnualValueChange = false;
            }
        } else {
            this.context.pageParams.uiDisplay.tdWasteTransfer = true;
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.context.pageParams.uiDisplay.trAnnualValueChange = true;
            }
        }

        if (this.context.InStr('FieldShowList', 'DeliveryConfirmation') !== -1
            && this.context.pageParams.vbSuspendSalesStatPortFig
            && this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.pageParams.uiDisplay.trDeliveryConfirmation = true;
        } else {
            this.context.pageParams.uiDisplay.trDeliveryConfirmation = false;
        }
        //Show Inv Start/End/Val fields if( value required;
        if (this.context.pageParams.blnValueRequired) {
            this.context.pageParams.uiDisplay.trInvoiceType = true;
            this.context.pageParams.uiDisplay.trInvoiceStartDate = true;
            this.context.pageParams.uiDisplay.trInvoiceEndDate = true;
            this.context.pageParams.uiDisplay.trInvoiceValue = true;
            this.context.pageParams.uiDisplay.trForwardDateChangeInd = true;
            this.context.pageParams.uiDisplay.trZeroValueIncInvoice = true;
        } else {
            this.context.pageParams.uiDisplay.trInvoiceType = false;
            this.context.pageParams.uiDisplay.trInvoiceStartDate = false;
            this.context.pageParams.uiDisplay.trInvoiceEndDate = false;
            this.context.pageParams.uiDisplay.trInvoiceValue = false;
            this.context.pageParams.uiDisplay.trForwardDateChangeInd = false;
            this.context.pageParams.uiDisplay.trZeroValueIncInvoice = false;
        }
        //Only show Reneg checkbox if( Contract && value required;
        if (this.context.pageParams.currentContractType === 'C' && this.context.pageParams.blnValueRequired &&
            (!this.context.riExchange.URLParameterContains('PendingReduction') || this.context.riExchange.URLParameterContains('PendingDeletion'))) {
            this.context.pageParams.uiDisplay.trChkRenegContract = true;
        } else {
            this.context.pageParams.uiDisplay.trChkRenegContract = false;
        }
        if (this.context.pageParams.blnHideOutstandingInstalls && this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
            this.context.pageParams.uiDisplay.trInstallationEmployee = false;
            this.context.pageParams.uiDisplay.trOutstandingRemovals = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'InstallationEmployeeCode', false);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RemovalEmployeeCode', false);
        }
        //if( Ann Entitlement required && valid on this product ) { enable checkbox;
        if (!this.context.pageParams.vbEnableEntitlement ||
            this.context.InStr('FieldShowList', 'EntitlementRequiredInd') === -1 ||
            !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'EntitlementRequiredInd', false);
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'EntitlementRequiredInd', true);
        }
        if (this.context.riExchange.URLParameterContains('PendingReduction') || this.context.riExchange.URLParameterContains('PendingDeletion')) {
            this.context.pageParams.uiDisplay.tdLostBusiness = true;
        } else {
            this.context.pageParams.uiDisplay.tdLostBusiness = false;
        }
        if (this.context.InStr('FieldShowList', 'ServiceAnnualValue') > -1 && this.context.InStr('FieldShowList', 'ServiceQuantity') > -1) {
            this.context.pageParams.uiDisplay.trAverageUnitValue = true;
        } else {
            this.context.pageParams.uiDisplay.trAverageUnitValue = false;
        }
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeUpdate) {
            if (this.context.InStr('FieldShowList', 'MultipleTaxRates') > -1 && this.context.pageParams.vbEnableMultipleTaxRates) {
                this.context.pageParams.uiDisplay.trMultipleTaxRates = true;
                this.context.pageParams.uiDisplay.trTaxHeadings = true;
                this.context.pageParams.uiDisplay.trTaxMaterials = true;
                this.context.pageParams.uiDisplay.trTaxLabour = true;
                this.context.pageParams.uiDisplay.trTaxReplacement = true;
                this.context.pageParams.uiDisplay.trConsolidateEqualTaxRates = true;
            } else {
                this.context.pageParams.uiDisplay.trMultipleTaxRates = false;
                this.context.pageParams.uiDisplay.trTaxHeadings = false;
                this.context.pageParams.uiDisplay.trTaxMaterials = false;
                this.context.pageParams.uiDisplay.trTaxLabour = false;
                this.context.pageParams.uiDisplay.trTaxReplacement = false;
                this.context.pageParams.uiDisplay.trConsolidateEqualTaxRates = false;
            }
        }
        if (this.context.pageParams.vbEnableProductLinking && this.context.InStr('FieldShowList', 'LinkedProduct') > -1) {
            this.context.pageParams.uiDisplay.trLinkedProduct = true;
            this.context.pageParams.uiDisplay.trLinkedServiceCover = true;
            this.context.iCABSAServiceCoverMaintenance7.BuildMenuOptions();
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.context.riMaintenance.DisableInput('LinkedProductCode');
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LinkedProductCode', false);
            } else if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                if (this.context.InStr('FieldShowList', 'LinkedProductRequired') > -1) {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LinkedProductCode', true);
                } else {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LinkedProductCode', false);
                }
                this.context.riMaintenance.EnableInput('LinkedProductCode');
            }
        } else {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LinkedProductCode', false);
            this.context.pageParams.uiDisplay.trLinkedProduct = false;
            this.context.pageParams.uiDisplay.trLinkedServiceCover = false;
            this.context.iCABSAServiceCoverMaintenance7.BuildMenuOptions();
        }
        this.context.iCABSAServiceCoverMaintenance3.LeadEmployeeDisplay();
        this.context.iCABSAServiceCoverMaintenance3.BusinessOriginDetailDisplay();
        this.context.iCABSAServiceCoverMaintenance3.ToggleEntitlementRequired();
        if (this.context.InStr('FieldShowList', 'ServiceVisitFrequency') !== -1 && this.context.pageParams.vbDefaultStockReplenishment &&
            this.context.pageParams.uiDisplay.tdEntitlement === true) {
            this.context.pageParams.uiDisplay.trEntitlementServiceQuantity = true;
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'btnDefaultServiceQuantity');
            } else {
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'btnDefaultServiceQuantity');
            }
        } else {
            this.context.pageParams.uiDisplay.trEntitlementServiceQuantity = false;
        }

        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'CompositeProductInd')) {
            this.context.pageParams.spanProductCodeLabel_innertext = 'Composite Product Code';
        } else {
            this.context.pageParams.spanProductCodeLabel_innertext = 'Product Code';
        }

        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CompositeProductCode')) {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'CompositeSequence', false);
            this.context.pageParams.uiDisplay.trCompositeProductDetails1 = false;
            this.context.pageParams.uiDisplay.trCompositeProductDetails2 = false;
        } else {
            this.context.pageParams.uiDisplay.trCompositeProductDetails1 = true;
            this.context.pageParams.uiDisplay.trCompositeProductDetails2 = true;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'CompositeSequence', true);
            this.context.iCABSAServiceCoverMaintenance3.PopulateCompositeCode();
        }
        this.context.iCABSAServiceCoverMaintenance7.CreateTabs();
        this.context.iCABSAServiceCoverMaintenance5.SetVisitPatternEffectiveDate();
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelTaxCode')) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.PostDataAdd('Function', 'GetRequireExemptNumberInd', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('TaxCodeForExemptionInd', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelTaxCode'), MntConst.eTypeCode);
            this.context.riMaintenance.ReturnDataAdd('RequireExemptNumberInd', MntConst.eTypeCheckBox);
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RequireExemptNumberInd', data['RequireExemptNumberInd']);

                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RequireExemptNumberInd') === 'yes') {
                    this.context.pageParams.uiDisplay.TaxExemptionNumberLabel = true;
                    this.context.pageParams.TaxExemptionNumber = true;
                    if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'TaxExemptionNumber', true);
                    }
                } else {
                    this.context.pageParams.uiDisplay.TaxExemptionNumberLabel = false;
                    this.context.pageParams.TaxExemptionNumber = false;
                    if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxExemptionNumber', '');
                        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'TaxExemptionNumber', false);
                    }
                }
            });
        } else {
            this.context.pageParams.uiDisplay.TaxExemptionNumberLabel = false;
            this.context.pageParams.TaxExemptionNumber = false;
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxExemptionNumber', '');
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'TaxExemptionNumber', false);
            }
        }

        if (this.context.pageParams.blnEnableDowSentricon && this.context.InStr('FieldShowList', 'DOWSentricon') > -1) {
            this.context.pageParams.uiDisplay.trDOWSentricon = true;
            this.context.iCABSAServiceCoverMaintenance7.DOWSentriconToggle();
        } else {
            this.context.pageParams.uiDisplay.trDOWSentricon = false;
            this.context.pageParams.uiDisplay.trDOWInstall = false;
            this.context.pageParams.uiDisplay.trDOWProduct = false;
            this.context.pageParams.uiDisplay.trDOWPerimeter = false;
            this.context.pageParams.uiDisplay.trDOWRenewalDate = false;
        }
        if (this.context.InStr('FieldShowList', 'PerimeterValue') !== -1
            && !this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DOWSentriconInd')) { //Disable if( DOW Sentricon Indicator is checked as there is a DOW Field that records Perimeter values;
            this.context.pageParams.uiDisplay.trPerimeterValue = true;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'PerimeterValue', true);
        } else {
            this.context.pageParams.uiDisplay.trPerimeterValue = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'PerimeterValue', false);
        }
    }

}
