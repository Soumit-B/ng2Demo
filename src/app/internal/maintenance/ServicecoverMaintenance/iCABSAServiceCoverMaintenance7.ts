import { InternalMaintenanceModuleRoutes, InternalGridSearchModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalMaintenanceApplicationModuleRoutes, InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../../base/PageRoutes';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ServiceCoverMaintenanceComponent } from './iCABSAServiceCoverMaintenance.component';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ServiceCoverSearchComponent } from './../../search/iCABSAServiceCoverSearch';

export class ServiceCoverMaintenance7 {

    private context: ServiceCoverMaintenanceComponent;

    constructor(private parent: ServiceCoverMaintenanceComponent) {
        this.context = parent;
    }

    public CreateTabs(): void {
        this.context.uiDisplay.tab.tab1.visible = true;

        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'CompositeProductInd')) {
            this.context.uiDisplay.tab.tab2.visible = true;
        } else {
            this.context.uiDisplay.tab.tab2.visible = false;
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            if (this.context.riExchange.URLParameterContains('PendingReduction')) {
                this.context.uiDisplay.tab.tab3.visible = true;
            } else {
                this.context.uiDisplay.tab.tab3.visible = false;
            }
        }
        this.context.uiDisplay.tab.tab4.visible = true;
        this.context.uiDisplay.tab.tab5.visible = true;

        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldShowList') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FieldShowList').indexOf('VisitCycleInWeeks') === 0 ||
            this.context.riExchange.getCurrentContractType() === 'J' || !this.context.pageParams.blnUseVisitCycleValues) {
            this.context.uiDisplay.tab.tab6.visible = false;
        } else {
            this.context.uiDisplay.tab.tab6.visible = true;
        }
        //APH Removed property care && user write access calls, as already exist in Window_OnLoad
        if (this.context.pageParams.boolPropertyCareInd === 'Y' && this.context.pageParams.boolUserWriteAccess === 'yes') {
            this.context.uiDisplay.tab.tab7.visible = true;
        } else {
            this.context.uiDisplay.tab.tab7.visible = false;
        }

        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd')
            && this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.uiDisplay.tab.tab8.visible = true;
        } else {
            this.context.uiDisplay.tab.tab8.visible = false;
        }

        this.context.uiDisplay.tab.tab9.visible = true;
        this.context.uiDisplay.tab.tab10.visible = true;

        if (this.context.pageParams.vbEnableEntitlement &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'EntitlementRequiredInd') &&
            this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.uiDisplay.tab.tab11.visible = true;
        } else {
            this.context.uiDisplay.tab.tab11.visible = false;
        }
        // Only add this tab if( Trial Period indicator is ticked, && this is a contract
        if ((this.context.riExchange.riInputElement.checked(this.context.uiForm, 'TrialPeriodInd') ||
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ContractTrialPeriodInd')) &&
            this.context.riExchange.getCurrentContractType() === 'C') {   // BC 39729
            this.context.uiDisplay.tab.tab12.visible = true;
        } else {
            this.context.uiDisplay.tab.tab12.visible = false;
        }
        this.context.uiDisplay.tab.tab13.visible = true;
        // MDP - 07/11/08 #35611: UK HY - Survey Details (SIP)
        if (this.context.pageParams.vEnableSurveyDetail) {
            this.context.uiDisplay.tab.tab14.visible = true;
        } else {
            this.context.uiDisplay.tab.tab14.visible = false;
        }

        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            this.context.uiDisplay.tab.tab15.visible = true;
        } else {
            this.context.uiDisplay.tab.tab15.visible = false;
        }

        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ServiceCommenceDate', false);
            this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'ServiceVisitFrequency', false);
        }
    }

    public riMaintenance_BeforeSave(): void {
        this.context.pageParams.verror = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CompositeProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelectCompositeProductCode'));
        if (this.context.pageParams.uiDisplay.trServiceAnnualValue === false
            && this.context.riExchange.URLParameterContains('PendingReduction')) {
            this.context.showAlert('Service Covers Can Only Be Reduced Where Value Is Required');
            this.context.pageParams.verror = true;
            this.context.saveClicked = false;
            return;
        }

        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selTaxCode') &&
            !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCode')) {
            this.context.showAlert('Tax Code Is Required');
            this.context.pageParams.verror = true;
            this.context.saveClicked = false;
            return;
        }

        if (this.context.pageParams.blnUseVisitCycleValues) {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks') &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeks') === '0') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeks', '');
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'VisitCycleInWeeks');
                this.context.saveClicked = false;
                return;
            } else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle') &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle') === '0') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitsPerCycle', '');
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'VisitsPerCycle');
                this.context.saveClicked = false;
                return;
            }
            if ((this.context.getControlValueAsString('VFPNumberOfWeeks') !== this.context.getControlValueAsString('VisitCycleInWeeks')) &&
                this.context.utils.len(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitCycleInWeeksOverrideNote')) < 10) {
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'VisitCycleInWeeksOverrideNote');
                this.context.saveClicked = false;
                return;
            }
        }

        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVisitTime') &&
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'HardSlotVisitTime')) {
            let iHour = this.context.utils.mid(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVisitTime'), 1,
                this.context.utils.len(this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVisitTime')) - 3);
            if (parseInt(iHour, 10) > 23) {
                this.context.showAlert('Hard Slot Visit Time Do Not Accept 24:00');
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'HardSlotVisitTime');
                this.context.pageParams.verror = true;
                this.context.saveClicked = false;
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
                            //InstallationEmployeeCode.focus();
                            //this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'InstallationEmployeeCode', true);
                            this.context.pageParams.verror = true;
                            this.context.saveClicked = false;
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
                    this.context.showDialog('Effective Date Is Not In Current Year - Do You Wish To Continue ',
                        this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd, this.context.iCABSAServiceCoverMaintenance7.handleSaveDecline);
                } else {
                    this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd();
                }
            } else {
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd();
            }
        }
    }

    public riMaintenance_BeforeSaveContd(): void {
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
        this.context.riMaintenance.CBORequestExecute(this.context, function (data: any): any {
            if (data) {
                this.context.riMaintenance.renderResponseForCtrl(this.context, data);
            }
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveFirstCallback();
        });

    }

    public handlesaveClick(): void {
        this.context.saveClicked = true;
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceCommenceDate', true);
        this.context.riExchange.updateCtrl(this.context.controls, 'ServiceCommenceDate', 'required', true);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LastChangeEffectDate', true);
        this.context.riExchange.updateCtrl(this.context.controls, 'LastChangeEffectDate', 'required', true);
        if (this.context.riExchange.validateForm(this.context.uiForm)) {
            /*this.context.renderTab(1);
            this.context.showDialog(MessageConstant.Message.ConfirmRecord,
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSave);*/
            this.context.utils.makeTabsNormal();
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSave();
        } else {
            if (!status) {
                for (let control in this.context.uiForm.controls) {
                    if (this.context.uiForm.controls[control].invalid) {
                        console.log('DEBUG validateForm -- INVALID formControl:', control);
                        if (this.context.pageParams['dt' + control]) {
                            this.context.pageParams['dt' + control].validate = true;
                        }
                    }
                }
            }
            this.context.utils.highlightTabsByIds();
            this.context.saveClicked = false;
        }
    }

    public handleSaveDecline(): void {
        this.context.saveClicked = false;
    }

    /**
     * Before Save Callbacks
     */

    public riMaintenance_BeforeSaveFirstCallback(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PatternWarningString')) {
            let msgTextR: string = this.context.getControlValue('PatternWarningString');
            // let msg: string = 'Visit Patterns Exist : ' +
            //     msgTextR.replace('/*NL*/', String.fromCharCode(10) + String.fromCharCode(13)) +
            //     String.fromCharCode(10) + String.fromCharCode(13) +
            //     'Do You Wish To Continue ?';
            let msgArray = [];
            msgArray.push('Visit Patterns Exist : ');
            msgArray = msgArray.concat(msgTextR.split('/*NL*/'));
            msgArray.push('Do You Wish To Continue ?');
            this.context.showDialog(msgArray,
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd1, this.context.iCABSAServiceCoverMaintenance7.handleSaveDecline);
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd1();
        }
    }

    public riMaintenance_BeforeSaveContd1(): void {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd && this.context.pageParams.vSCValidateInvoiceTypeOnNewSC) {
            this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=ValidateInvoiceType';
            this.context.riMaintenance.CBORequestAdd('ContractNumber');
            this.context.riMaintenance.CBORequestAdd('InvoiceTypeNumber');
            this.context.riMaintenance.CBORequestExecute(this.context, function (data: any): any {
                if (data) {
                    this.context.riMaintenance.renderResponseForCtrl(this.context, data);
                }
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveSecondCallback();
            });
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveSecondCallback();
        }
    }

    public riMaintenance_BeforeSaveSecondCallback(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCoverInvTypeString')) {
            let msgTextR: string = this.context.getControlValue('ServiceCoverInvTypeString');
            // let msg: string = 'Visit Patterns Exist : ' +
            //     msgTextR.replace('/*NL*/', String.fromCharCode(10) + String.fromCharCode(13)) +
            //     String.fromCharCode(10) + String.fromCharCode(13) +
            //     'Do You Wish To Continue ?';
            let msgArray = [];
            msgArray.push('Other Invoice Types Exist On Service Covers For This Contract : ');
            msgArray = msgArray.concat(msgTextR.split('/*NL*/'));
            msgArray.push('Do You Wish To Continue ?');
            this.context.showDialog(msgArray,
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd2, this.context.iCABSAServiceCoverMaintenance7.handleSaveDecline);
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd2();
        }
    }

    public riMaintenance_BeforeSaveContd2(): void {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaCode')
            !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'oriBranchServiceAreaCode')) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.PostDataAdd('Function', 'GetTechRetentionInd', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('MessageDisplay', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                if (data['MessageDisplay'] !== '') {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MessageDisplay', data['MessageDisplay']);
                    this.context.showDialog(data['MessageDisplay'],
                        this.context.iCABSAServiceCoverMaintenance7.continueBeforeSave, this.context.iCABSAServiceCoverMaintenance7.handleSaveDecline);
                } else {
                    this.context.iCABSAServiceCoverMaintenance7.continueBeforeSave();
                }
            }, 'POST');
        } else {
            this.context.iCABSAServiceCoverMaintenance7.continueBeforeSave();
        }
    }

    public continueBeforeSave(): void {
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
                this.context.riMaintenance.PostDataAdd('ServiceCoverRowID',
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID'), MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('InvoiceTypeNumber',
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeNumber'), MntConst.eTypeInteger);
                this.context.riMaintenance.ReturnDataAdd('MessageDisplay', MntConst.eTypeText);
                this.context.riMaintenance.Execute(this.context, function (data: any): any {
                    if (data['MessageDisplay'] !== '') {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MessageDisplay', data['MessageDisplay']);
                        this.context.showDialog(data['MessageDisplay'],
                            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd3, this.context.iCABSAServiceCoverMaintenance7.handleSaveDecline);
                    } else {
                        this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd3();
                    }
                }, 'POST');
            } else {
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd3();
            }
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_BeforeSaveContd3();
        }
    }

    public riMaintenance_BeforeSaveContd3(): void {
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
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingReduction', '');
        }
        if (this.context.riExchange.URLParameterContains('PendingDeletion')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingDeletion', 'PendingDeletion');
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingDeletion', '');
        }
        this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ContractTypeCode=' + this.context.riExchange.getCurrentContractType();
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selServiceBasis') === 'H') {
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotTemplateNumber')) {
                this.context.showAlert('There is no Hard Slot Template Number assigned.');
                return;
            } else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotType') === 'S'
                && !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVisitTime')) {
                this.context.showAlert('Hard Slot Vist Time is required.');
                return;
            } else {
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
                this.context.riMaintenance.Execute(this.context, function (data: any): any {
                    if (data['MessageDisplay'] !== '') {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MessageDisplay', data['MessageDisplay']);
                        this.context.showDialog(data['MessageDisplay'],
                            this.context.iCABSAServiceCoverMaintenance7.riExchange_CBORequest, this.context.iCABSAServiceCoverMaintenance7.handleSaveDecline);
                    }
                    this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
                });
            }
        } else {
            this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        }
    }

    public saveRecord(): void {
        let action: number = 2;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            action = 1;
        }
        let fieldsArr = this.context.riExchange.getAllCtrl(this.context.controls);
        this.context.riMaintenance.clear();
        if (this.context.riExchange.URLParameterContains('PendingReduction')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingReduction', 'PendingReduction');
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'PendingReduction', '');
        }
        if (this.context.uiDisplay.tab.tab11.visible) {
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementAnnivDate', 'ignoreSubmit', false);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementAnnualQuantity', 'ignoreSubmit', false);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementNextAnnualQuantity', 'ignoreSubmit', false);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementOrderedQuantity', 'ignoreSubmit', false);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementPricePerUnit', 'ignoreSubmit', false);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementRequiredInd', 'ignoreSubmit', false);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementServiceQuantity', 'ignoreSubmit', false);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementYTDQuantity', 'ignoreSubmit', false);
        } else {
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementAnnivDate', 'ignoreSubmit', true);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementAnnualQuantity', 'ignoreSubmit', true);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementNextAnnualQuantity', 'ignoreSubmit', true);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementOrderedQuantity', 'ignoreSubmit', true);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementPricePerUnit', 'ignoreSubmit', true);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementRequiredInd', 'ignoreSubmit', true);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementServiceQuantity', 'ignoreSubmit', true);
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementYTDQuantity', 'ignoreSubmit', true);
        }
        if (!this.context.getControlValue('EntitlementInvoiceTypeCode')) {
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementInvoiceTypeCode', 'ignoreSubmit', true);
        } else {
            this.context.riExchange.updateCtrl(this.context.controls, 'EntitlementInvoiceTypeCode', 'ignoreSubmit', false);
        }
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.context.riMaintenance.getControlType(this.context.controls, id, 'type');
            let ignore = this.context.riMaintenance.getControlType(this.context.controls, id, 'ignoreSubmit');
            if (!ignore) {
                let value = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, id);
                this.context.riMaintenance.PostDataAdd(id, value, dataType);
            }
        }
        if (this.context.fieldHasValue('ClosedCalendarTemplateNumber')) {
            this.context.riMaintenance.PostDataAdd('TemplateName', this.context.getControlValue('ClosedTemplateName'), MntConst.eTypeText);
        }
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            if (data.hasError) {
                if (data.errorMessage.trim() !== '') {
                    this.logger.log('Post data Error', data);
                    this.context.errorModal.show(data, true);
                }
            } else {
                this.context.showSuccessMessageDialog();
                this.context.riExchange.updateCtrl(this.context.controls, 'riGridHandle', 'ignoreSubmit', true);
                this.context.pageParams.riGridHandlevalue = '';
                this.context.setControlValue('riGridHandle', '');
                this.context.riMaintenance.renderResponseForCtrl(this.context, data);
                this.context.setControlValue('ServiceCoverROWID', this.context.getControlValue('CurrentServiceCoverRowID'));
                this.context.pageParams.ServiceCoverRowID = this.context.getControlValue('CurrentServiceCoverRowID');
            }
        }, 'POST', action);
    }

    public postSave(): void {
        this.context.pageParams.initialForm = this.context.createControlObjectFromForm();
        this.context.storePageParams();
        this.context.formIsDirty = false;
        this.context.serviceCoverSearchParams.parentMode = 'Search';
        this.context.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd();
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave();
        }
    }

    //******************
    //* AFTER SAVE ADD *
    //******************
    public riMaintenance_AfterSaveAdd(): void {
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelectCompositeProductcode');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        if (this.context.pageParams.vbDefaultTaxCodeProductExpenseReq && this.context.pageParams.vbDefaultTaxCodeProductExpenseLog) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ComponentGridCacheTime', this.context.utils.Time()); // Unique Key used for Component Grid Rebuilding;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentSelAll');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentDesAll');
        if (this.context.parentMode === 'Premise-Add') {
            this.context.pageParams.ServiceCoverAdded = true;
        }
        //If user has Full Access || logged in neg || service branch ) { show value flds;
        if (this.context.pageParams.FullAccess === 'Full'
            || this.context.utils.getBranchCode().toString() === this.context.getControlValueAsString('ServiceBranchNumber')
            || this.context.utils.getBranchCode().toString() === this.context.getControlValueAsString('NegBranchNumber')) {
            this.context.pageParams.blnAccess = true;
        } else {
            this.context.pageParams.blnAccess = false;
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode')) {
            this.context.iCABSAServiceCoverMaintenance1.ServiceCoverWasteReq();
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd1();
        }
    }

    public riMaintenance_AfterSaveAdd1(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DetailRequired')) {
            if (this.context.pageParams.vbLocationsSingleEntry === false) {
                this.context.navigate('ServiceCover', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE);
                this.context.pageParams.saveReturnCallback = true;
                this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_ADD_3;
            } else {
                this.context.navigate('ServiceCover', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERDETAILGROUPMAINTENANCE);
                this.context.pageParams.saveReturnCallback = true;
                this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_ADD_3;
            }
            // Should prevent location entryif( freq is not req;
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd2();
        }
    }

    public riMaintenance_AfterSaveAdd2(): void {
        if (this.context.pageParams.vbEnableLocations
            && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LocationsEnabled')
            && this.context.InStr('FieldShowList', 'ServiceQuantity') !== -1) {
            //Store the RowID of the ServiceCover record to an attribute, so the Location Grid can know;
            //which record has just been updtd;
            this.context.attributes.ServiceCoverRowID = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID');
            this.context.attributes.OutstandingInstallations = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations');
            this.context.attributes.QuantityChange = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'QuantityChange');
            this.context.attributes.DefaultEffectiveDate = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitAnnivDate');
            this.context.attributes.DefaultEffectiveDateProduct = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode');
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                this.context.navigate('ServiceCover-Increase', InternalGridSearchSalesModuleRoutes.ICABSAEMPTYPREMISELOCATIONSEARCHGRID);
                this.context.pageParams.saveReturnCallback = true;
                this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_ADD_3;
                return;
            } else {
                this.context.navigate('ServiceCover-Increase', 'application/premiseLocationAllocation');
                this.context.pageParams.saveReturnCallback = true;
                this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_ADD_3;
                return;
            }
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd3();
        }
    }

    public riMaintenance_AfterSaveAdd3(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkStockOrder')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GenContractNumber', '');
            ////WindowPath = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAStockOrderFieldsMaintenance.htm<maxwidthproduct>';
            ////window.location = WindowPath;
            //alert('navigate to iCABSAStockOrderFieldsMaintenance when available');
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd3A();
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd4();
        }
    }

    public riMaintenance_AfterSaveAdd3A(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'GenContractNumber')) {
            this.context.navigate('GeneratedStockOrder', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1);
            this.context.pageParams.saveReturnCallback = true;
            this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_ADD_4;
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd4();
        }
    }

    public riMaintenance_AfterSaveAdd4(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            this.context.attributes.Mode = 'New';
            ////riExchange.Mode = 'ServiceCover';
            ////window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceVisitPlanningGrid.htm<maxwidth>';
            alert('navigate to iCABSAServiceVisitPlanningGrid when available');
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd5();
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd5();
        }
    }


    public riMaintenance_AfterSaveAdd5(): void {
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            this.context.navigate('ServiceCoverAdd', InternalGridSearchApplicationModuleRoutes.ICABSSASERVICECOVERDISPLAYGRID, {
                'ServiceCover': this.context.getControlValue('ServiceCoverROWID')
            });
            this.context.pageParams.saveReturnCallback = true;
            this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_ADD_6;
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd6();
        }
    }

    public riMaintenance_AfterSaveAdd6(): void {
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'InvTypeSel');
        this.context.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        this.context.disableControl('ContractNumber', true);
        this.context.disableControl('PremiseNumber', true);
        this.context.disableControl('ProductCode', true);
        this.context.disableControl('menu', false);
        this.context.initMode(this.context.Mode.UPDATE);
        this.context.initialLoad = true;
        this.context.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
        if (this.context.pageParams.vbEnableProductServiceType) {
            this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
        }
        this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
        if (this.context.parentMode === 'Premise-Add'
            || this.context.parentMode === 'SearchAdd'
            || this.context.parentMode === 'ContactAdd') {
            this.context.afterSaveNavigate = true;
        }
        this.context.iCABSAServiceCoverMaintenance1.init();
    }

    public riMaintenance_AfterSave(): void {
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelectCompositeProductcode');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        if (this.context.pageParams.vbDefaultTaxCodeProductExpenseReq && this.context.pageParams.vbDefaultTaxCodeProductExpenseLog) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ComponentGridCacheTime', this.context.utils.Time()); // Unique Key So I Can Control When The Component Grid Needs Rebuilding e.g. change of product;
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
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave1();
        }
    }

    public riMaintenance_AfterSave1(): void {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate
            && this.context.pageParams.vbEnableLocations
            && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LocationsEnabled')
            && this.context.InStr('FieldShowList', 'ServiceQuantity') !== -1
            && (this.context.pageParams.blnQuantityChange || this.context.parentMode === 'ServiceCoverGrid')) {
            //Store the RowID of the ServiceCover record to an attribute, so that the Location Grid can know which record has just been updated;
            this.context.attributes.ServiceCoverRowID = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID');
            this.context.attributes.OutstandingInstallations = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'OutstandingInstallations');
            this.context.attributes.QuantityChange = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'QuantityChange');
            this.context.attributes.DefaultEffectiveDate = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitAnnivDate');
            this.context.attributes.DefaultEffectiveDateProduct = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode');
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                if (!this.context.riExchange.URLParameterContains('PendingReduction')) { //Do not Display Location Information on the Reducing ServiceCover screenif( Display Level is enabled;
                    this.context.navigate('ServiceCover-Increase', InternalGridSearchSalesModuleRoutes.ICABSAEMPTYPREMISELOCATIONSEARCHGRID);
                    this.context.pageParams.saveReturnCallback = true;
                    this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_UPDATE_2;
                    return;
                } else {
                    this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave2();
                }
            } else {
                this.context.navigate('ServiceCover-Increase', 'application/premiseLocationAllocation');
                this.context.pageParams.saveReturnCallback = true;
                this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_UPDATE_2;
            }
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave2();
        }
    }

    public riMaintenance_AfterSave2(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkStockOrder')
            && this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'GenContractNumber', '');
            //alert('navigate to iCABSAStockOrderFieldsMaintenance when available');
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave3();
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave4();
        }
    }

    public riMaintenance_AfterSave3(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'GenContractNumber')) {
            this.context.navigate('GeneratedStockOrder', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1);
            this.context.pageParams.saveReturnCallback = true;
            this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_UPDATE_4;
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave4();
        }
    }

    public riMaintenance_AfterSave4(): void {
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
            //Only open Service Visit Calendarif( freq has changed || Annual Time has changed;
            if (this.context.pageParams.vbUpdateServiceVisit) {
                this.context.attributes.Mode = 'Update';
                ////riExchange.Mode = 'ServiceCover';
                ////window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceVisitPlanningGrid.htm<maxwidth>';
                alert('navigate to iCABSAServiceVisitPlanningGrid when available');
                this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave5();
            }
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave5();
        }
    }

    public riMaintenance_AfterSave5(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ShowValueButton') && this.context.pageParams.blnValueRequired) {
            this.context.pageParams.uiDisplay.cmdValue = true;
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdValue');
        } else {
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
            this.context.navigate('ServiceCoverUpdate', InternalGridSearchApplicationModuleRoutes.ICABSSASERVICECOVERDISPLAYGRID, {
                'ServiceCover': this.context.getControlValue('ServiceCoverROWID')
            });
            this.context.pageParams.saveReturnCallback = true;
            this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_UPDATE_6;
        } else {
            this.context.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave6();
        }
    }

    public riMaintenance_AfterSave6(): void {
        this.context.iCABSAServiceCoverMaintenance8.ResetPriceChangeVariable();
        //this.context.iCABSAServiceCoverMaintenance1.riMaintenance_AfterFetch();
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCopyServiceCover');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'InvTypeSel');
        if (this.context.pageParams.uiDisplay.trEntitlementServiceQuantity) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'btnDefaultServiceQuantity');
        }
        this.context.iCABSAServiceCoverMaintenance7.HideQuickWindowSet(true);
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
        this.context.pageParams.dtLastChangeEffectDate.value = null;
        if (this.context.pageParams['updateMatchedDisplayValues']) {
            this.context.pageParams['updateMatchedDisplayValues'] = false;
            this.context.initialLoad = false;
            this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        }
        this.context.iCABSAServiceCoverMaintenance2.riMaintenanceBeforeUpdate();
    }

    public btnDepositAdd_OnClick(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositAddAdditional', 'Y');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DepositDate');
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DepositAmount');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositDate', '');
        this.context.pageParams.dtDepositDate.value = null;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositAmount', '');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositAmountApplied', '');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepositPostedDate', '');
    }

    //*****************
    //* AFTER ABANDON *
    //*****************
    public riMaintenance_AfterAbandon(): void {
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
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selTaxCode',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCode'));
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
            //this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdHardSlotCalendar');
        } else {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdHardSlotCalendar');
        }
        //rebuild display gridif( service cover reduction && display tab enabled;
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            if (this.context.riExchange.URLParameterContains('PendingReduction')) {
                this.context.iCABSAServiceCoverMaintenance3.BuildDisplayGrid();
                this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
                do {
                    //wait for response from screen
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
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ShowValueButton')
                && this.context.pageParams.blnValueRequired) {
                this.context.pageParams.uiDisplay.cmdValue = true;
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdValue');
            } else {
                this.context.pageParams.uiDisplay.cmdValue = false;
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdValue');
            }
            //Reset the AnnualTimeChange back to blank;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualTimeChange', '');
            //Reset the AnnualValueChange back to 0;
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
            } else {
                this.context.pageParams.uiDisplay.trServiceAnnualValue = false;
            }
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkFOC')) {
                this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = true;
                this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = true;
            } else {
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
        } else {
            this.context.pageParams.uiDisplay.trInvoiceSuspend = false;
        }

        this.context.iCABSAServiceCoverMaintenance3.ToggleEntitlementRequired();
        this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
        this.context.iCABSAServiceCoverMaintenance7.BuildInvoiceTypeSelect();   // restore correct value;
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
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();;
        //this.context.riMaintenance.Focus();
    }

    public riMaintenance_BeforeAbandon(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotUpdate') === 'Yes') {
            this.context.iCABSAServiceCoverMaintenance7.HardSlotTemplateRemove();
        }
    }

    //******************************
    //* Query Unload HTML Document *
    //******************************
    public riExchange_QueryUnloadHTMLDocument(): void {
        if (this.context.parentMode === 'Premise-Add') {
            if (!this.context.pageParams.ServiceCoverAdded) {
                //Msgbox '<%=riT('No Service Cover Records Have Been Added For This Premises') ;
            }
        }
    }

    //***********
    //* Search  *
    //***********
    public riMaintenance_Search(): void {
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber')) {
            //this.context.iCABSAServiceCoverMaintenance7.ContractNumberSelection(riMaintenance_Search_Callback1);
            this.context.iCABSAServiceCoverMaintenance7.ContractNumberSelection();
        }

        function riMaintenance_Search_Callback1(): void {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber')) {
                this.context.iCABSAServiceCoverMaintenance7.PremiseNumberSelection(riMaintenance_Search_Callback2);
            }
        }
        function riMaintenance_Search_Callback2(): void {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber')) {
                this.context.iCABSAServiceCoverMaintenance7.ProductCodeSelection();
            }
        }
    }

    //*************
    //* Functions *
    //*************
    public BuildInvoiceTypeSelect(): void {
        let ValArray;
        let DescArray;
        if (!this.context.fieldHasValue('InvoiceTypeVal')
            || !this.context.fieldHasValue('InvoiceTypeDesc')) { // no valid options - hide select;
            this.context.pageParams.uiDisplay.trInvoiceType = false;
        } else {
            ValArray = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeVal').toString().split('|');
            DescArray = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeDesc').toString().split('|');
            if (ValArray && DescArray) {
                this.context.pageParams.InvTypeSel = [];
                for (let i = 0; i < ValArray.length; i++) {
                    let obj = {
                        text: DescArray[i],
                        value: ValArray[i]
                    };
                    this.context.pageParams.InvTypeSel.push(obj);
                }
            }
            this.context.setControlValue('InvTypeSel', this.context.getControlValue('InvoiceTypeNumber'));
            if (this.context.pageParams.blnValueRequired) {
                this.context.pageParams.uiDisplay.trInvoiceType = true;
            } else {
                this.context.pageParams.uiDisplay.trInvoiceType = false;
            }
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev) {
            this.context.iCABSAServiceCoverMaintenance6.IsVisitTriggered();
        }
    }

    //********
    //* Menu *
    //********
    public BuildMenuOptions(): void {

        let cEmployeeLimitChildDrillOptions = this.context.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions');
        this.context.setControlValue('EmployeeLimitChildDrillOptions', this.context.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions'));

        let objPortfolioGroup = [];
        let objHistoryGroup = [];
        let objInvoicingGroup = [];
        let objServiceGroup = [];
        let objCustomerGroup = [];

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

        //History Options
        objHistoryGroup.push({ value: 'History', label: 'Service Cover History' });
        objHistoryGroup.push({ value: 'EventHistory', label: 'Event History' });
        objHistoryGroup.push({ value: 'ServiceValue', label: 'Service Value' });

        if (this.context.pageParams.blnEnableDOWSentricon) {
            objHistoryGroup.push({ value: 'DOWServiceValue', label: 'DOW Service Value' });
        }
        objHistoryGroup.push({ value: 'SalesStatsAdjustment', label: 'Adjust Sales Stats' });


        //Invoicing Options
        objInvoicingGroup.push({ value: 'ProRata', label: 'Pro Rata Charge' });
        objInvoicingGroup.push({ value: 'InvoiceHistory', label: 'Invoice History' });

        //Service Options
        if (this.context.pageParams.vEnableTabularView) {
            objServiceGroup.push({ value: 'PlanVisit', label: 'Planned Visits Grid' });
            objServiceGroup.push({ value: 'PlanVisitTabular', label: 'Planned Visits Table' });
        } else {
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
        //objServiceGroup.push({ value: 'TreatmentPlan', label: 'Treatment Plan' });

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

        //Add Groups to menu
        this.context.pageParams.menu = [
            { OptionGrp: 'Portfolio', Options: objPortfolioGroup },
            { OptionGrp: 'History', Options: objHistoryGroup },
            { OptionGrp: 'Invoicing', Options: objInvoicingGroup },
            { OptionGrp: 'Servicing', Options: objServiceGroup },
            { OptionGrp: 'Customer Relations', Options: objCustomerGroup }
        ];
        this.context.setControlValue('menu', 'Options');
    }

    //****************************************************
    //*Menu options/Buttons/Check boxes (onclick actions)*
    //****************************************************

    //***********
    //* LookUps *
    //***********
    public ContractNumberSelection(callback?: any): void {
        if (this.context.contractSearch) {
            this.context.openSearchModal(this.context.contractSearch, callback);
        }
    }

    public PremiseNumberSelection(callback?: any): void {
        if (this.context.premiseSearch) {
            this.context.openSearchModal(this.context.premiseSearch, callback);
        }
    }

    public APTChangedAccordingToQuantity(): void {

        if (this.context.pageParams.vSCEnableAPTByServiceType) {
            let APTFound;
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
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                APTFound = data['APTFound'];
                if (APTFound) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ActualPlannedTime', data['ActualPlannedTime']);
                }
            }, 'POST');
        }
    }

    //*****************
    //* BEFORE FETCH  *
    //*****************
    public riMaintenance_BeforeFetch(): void {
        this.context.pageParams.strFunctions = '';
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber') &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber')) {
            this.context.pageParams.strFunctions = 'GetServiceDetails,GetShowFields,';
            this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=' + this.context.utils.Left(this.context.pageParams.strFunctions,
                this.context.utils.len(this.context.pageParams.strFunctions));
            this.context.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.CBORequestAdd('ContractNumber');
            this.context.riMaintenance.CBORequestAdd('PremiseNumber');
            this.context.riMaintenance.CBORequestAdd('ProductCode');
            this.context.riMaintenance.CBORequestAdd('ServiceBranchNumber');
            this.context.riMaintenance.CBORequestExecute(this.context, function (data: any): any {
                if (data) {
                    this.context.riMaintenance.renderResponseForCtrl(this.context, data);
                }
                this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strEntryProcedure;
                if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ErrorMessage')) {
                    this.context.iCABSAServiceCoverMaintenance4.ShowFields();
                    //this.context.riMaintenance.GetVirtuals();
                }
            });
        }
        this.context.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ContractTypeCode=' + this.context.riExchange.getCurrentContractType();
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();;
    }

    public ProductCodeSelection(): void {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            //riExchange.Mode = 'ServiceCover-' + CurrentContractType;
            //window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBProductSearch.htm';
            if (this.context.pageParams.vbEnableProductServiceType) {
                this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
            }
            this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
        } else {
            this.context.serviceCoverSearch.openModal();
        }
    }

    public ServiceTypeCode_ondeactivate(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceTypeCode')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeDesc', '');
        }
    }

    public ServiceTypeCode_onChange(): void {
        if (!this.context.fieldHasValue('ServiceTypeCode')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceTypeDesc', '');
        } else {
            this.context.iCABSAServiceCoverMaintenance7.APTChangedAccordingToQuantity();
            this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
        }
    }

    public CheckServiceNotifyInd(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceNotifyInd', true);
        // if( ProductCode.value !=, this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'nullString && ServiceTypeCode'))  ) {
        //    riExchange.Functions.Request.BusinessObject = this.context.pageParams.strRequestProcedure;
        //    this.context.riMaintenance.clear();
        //    this.context.riMaintenance.PostDataAdd('Function','CheckServiceNotifyInd',MntConst.eTypeText);
        //    this.context.riMaintenance.PostDataAdd('BusinessCode',this.context.utils.getBusinessCode(),MntConst.eTypeCode);
        //    this.context.riMaintenance.PostDataAdd('ProductCode',ProductCode.value,MntConst.eTypeCode);
        //    this.context.riMaintenance.PostDataAdd('ServiceTypeCode',ServiceTypeCode.value,MntConst.eTypeCode);
        //    this.context.riMaintenance.ReturnDataAdd('ServiceNotifyInd',eTypeCheckBox);
        //    this.context.riMaintenance.Execute();
        //;
        //   if( riExchange.Functions.Request.Successful ) {
        //      ServiceNotifyInd.checked = data['ServiceNotifyInd');
        //    }
        //  }
    }

    public GuaranteeRequired_onclick(): void {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'GuaranteeRequired')) {
            this.context.iCABSAServiceCoverMaintenance7.CreateTabs();
            this.context.renderTab(4);
        }
        this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
    }

    public GuaranteeToggle(): void {
        if (this.context.pageParams.boolPropertyCareInd === 'Y') {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'GuaranteeRequired')) {
                this.context.pageParams.uiDisplay.trGuaranteeExpiry15 = true;
                this.context.pageParams.uiDisplay.trGuaranteeCommence15 = true;
                this.context.pageParams.uiDisplay.trNoGuaranteeReason = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'NoGuaranteeCode', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'NoGuaranteeCode', false);
                //Call riTab.TabRefreshStatus();
                this.context.pageParams.uiDisplay.trNumberBedrooms = true;
                this.context.pageParams.uiDisplay.trAgeOfPropertyLabel = true;
                this.context.pageParams.uiDisplay.trListedBuilding = true;
            } else {
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
    }

    public SeasonalServiceInd_onclick(): void {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'SeasonalServiceInd')) {
            this.context.iCABSAServiceCoverMaintenance7.ToggleSeasonalDates();
        }
    }

    public DOWSentriconInd_onclick(): void {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'DOWSentriconInd')) {
            this.context.iCABSAServiceCoverMaintenance7.DOWSentriconToggle();
        }
    }

    public DOWSentriconToggle(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DOWSentriconInd')) {
            this.context.pageParams.uiDisplay.trDOWInstall = true;
            this.context.pageParams.uiDisplay.trDOWProduct = true;
            this.context.pageParams.uiDisplay.trDOWPerimeter = true;
            if (this.context.riExchange.getCurrentContractType() === 'C' &&
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DOWRenewalDate')) {
                this.context.pageParams.uiDisplay.trDOWRenewalDate = true;
            } else {
                this.context.pageParams.uiDisplay.trDOWRenewalDate = false;
            }
            if (this.context.InStr('FieldShowList', 'PerimeterValue') !== -1) {
                this.context.pageParams.uiDisplay.trPerimeterValue = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'PerimeterValue', false);
            }
        } else {
            this.context.pageParams.uiDisplay.trDOWInstall = false;
            this.context.pageParams.uiDisplay.trDOWProduct = false;
            this.context.pageParams.uiDisplay.trDOWPerimeter = false;
            this.context.pageParams.uiDisplay.trDOWRenewalDate = false;
            if (this.context.InStr('FieldShowList', 'PerimeterValue') !== -1) {
                this.context.pageParams.uiDisplay.trPerimeterValue = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'PerimeterValue', true);
            }
        }
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'DOWInstallTypeCode',
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DOWSentriconInd'));
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'DOWProductCode',
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DOWSentriconInd'));
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'DOWPerimeterValue',
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DOWSentriconInd'));

        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DOWSentriconInd');
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DOWRenewalDate')) {
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DOWInstallTypeCode');
            } else {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DOWInstallTypeCode');
            }
        } else if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DOWRenewalDate');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DOWSentriconInd');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'DOWInstallTypeCode');
        }
    }

    public ToggleSeasonalDates(): void {
        this.context.iCABSAServiceCoverMaintenance7.CreateTabs();
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            //this.context.renderTab(5);
        }
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd')) {
            this.context.iCABSAServiceCoverMaintenance7.InitialiseSeasonalService();
        } else {
            // Hide (and make not required) Season 1 data;
            this.context.iCABSAServiceCoverMaintenance7.ShowHideSeasonRow(1, false);
        }
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'NumberOfSeasons',
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalServiceInd'));
    }

    public cmdDOWServiceValue_onclick(): void {
        alert(' Open iCABSADOWServiceValueGrid wheh available');
        //window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSADOWServiceValueGrid.htm<maxwidth>' + CurrentContractTypeURLParameter;
    }

    public MinCommitQty_onclick(): void {
        this.context.iCABSAServiceCoverMaintenance3.MinCommitQtyToggle();
    }

    public TrialPeriodInd_onClick(): void {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'TrialPeriodInd') &&
            this.context.pageParams.uiDisplay.tdTrialPeriodInd) {
            this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
        }
    }

    public ToggleTrialPeriodStatus(): void {
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
            // 17/08/05 PG #12560 Add Trial Period Start Dt;
            // 23/08/05 Ensure dt is formatted before copying;
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate') &&
                this.context.riExchange.riInputElement.isCorrect(this.context.uiForm, 'ServiceCommenceDate')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TrialPeriodStartDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate'));
            }
            // Copy ServiceAnnualValue to ProposedAnnualValueif( it//s not blank;
            // #12561 value being reset after save;
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue') &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProposedAnnualValue')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProposedAnnualValue',
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue'));
            } else {
                // #12561 value being reset after save;
                if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProposedAnnualValue')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProposedAnnualValue', '0');
                }
            }
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualValue', '0');
            // #12561 value being reset after save;
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TrialPeriodChargeValue')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TrialPeriodChargeValue', '0');
            }
            // Call 'isError' on chngd flds to cause formatting to occur;
            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                this.context.riExchange.riInputElement.isError(this.context.uiForm, 'UnitValue');
            }
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'ServiceAnnualValue');
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'ProposedAnnualValue');
            this.context.riExchange.riInputElement.isError(this.context.uiForm, 'TrialPeriodChargeValue');

            if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                this.context.riMaintenance.DisableInput('UnitValue');
            }
            this.context.riMaintenance.DisableInput('ServiceAnnualValue');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'chkFOC');
        } else if (this.context.pageParams.blnRequired && this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            //if( was Trial Period, && we are now updating, set access to flds;
            // Always disable this on updt - it may be enabled later;
            this.context.riMaintenance.DisableInput('TrialPeriodChargeValue');
            if (this.context.pageParams.blnTrialReleased) {
                this.context.riMaintenance.DisableInput('TrialPeriodEndDate');
                this.context.riMaintenance.DisableInput('ProposedAnnualValue');
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ProposedAnnualValue', false);
            } else {
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
    }

    public InitialiseSeasonalService(): void {
        // Set no of seasons to 1;
        if ((this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'NumberOfSeasons') === '') &&
            this.context.riMaintenance.CurrentMode !== MntConst.eModeSelect) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NumberOfSeasons', '1');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FixedNumberOfSeasons', '1');
        }
        this.context.iCABSAServiceCoverMaintenance7.ShowSeasonalRows();
    }

    public HardSlotTemplateRemove(): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('Function', 'HardSlotTemplateRemove', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('HardSlotTemplateNumber',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotTemplateNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('HardSlotVersionNumber',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotVersionNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            //Empty block
        });
    }

    public SelUpliftVisitPosition_onChange(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UpliftVisitPosition',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelUpliftVisitPosition'));
    }

    public ShowSeasonalRows(event?: any): void {
        let arrSeasonsVisible = [false, false, false, false, false, false, false, false];
        let arrSeasonsEnabled = [false, false, false, false, false, false, false, false];
        let arrVisitsEnabled = [true, true, true, true, true, true, true, true];
        let iNumberOfSeasons = -1;
        let iFixedNumberOfSeasons = -1;
        let iVisitCount = 0;

        // Convert value of input to int;
        iNumberOfSeasons = this.context.CInt('NumberOfSeasons');
        iFixedNumberOfSeasons = this.context.CInt('FixedNumberOfSeasons');

        //if( int conversion failed, ) { resolve problems;
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
        //if( current mode is 'update';
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            //if( the no of existing seasons is less than the new no of seasons, ) { need to allow;
            // updts to the new season. Otherwise, we should show all seasons, && only allow updts to;
            // the no of visits.;
            if (iNumberOfSeasons > iFixedNumberOfSeasons) {
                for (let i = 0; i < 8; i++) {
                    arrSeasonsEnabled[i] = !(iNumberOfSeasons >= (i + 1) && iFixedNumberOfSeasons >= (i + 1));
                }
            } else {
                // Need to show the existing no of seasons;
                iNumberOfSeasons = iFixedNumberOfSeasons;
                for (let i = 0; i < 8; i++) {
                    arrSeasonsEnabled[i] = false;
                }
            }

            //If Updating, && the effective dt is before all season start dates - disable every visit pattern field;
            this.context.pageParams.blnDisableVisitPattern = false;
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate')) {
                this.context.pageParams.blnDisableVisitPattern = true;
            } else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate') &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'FirstSeasonStartDate')) {
                this.context.pageParams.blnDisableVisitPattern = false;
            } else if (this.context.CDate('LastChangeEffectDate') < this.context.CDate('FirstSeasonStartDate')) {
                this.context.pageParams.blnDisableVisitPattern = true;
            }

            if (this.context.pageParams.blnDisableVisitPattern) {
                for (let i = 0; i < arrVisitsEnabled.length; i++) {
                    arrVisitsEnabled[i] = false;
                }
            }
        } else if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            for (let i = 0; i < 8; i++) {
                arrSeasonsEnabled[i] = true;
                arrVisitsEnabled[i] = true;
            }
        }
        //Show the correct no of seasons;
        for (let i = 8; i > 0; i--) {
            arrSeasonsVisible[i - 1] = (iNumberOfSeasons >= i);
        }
        //Populate values from arrays through to screen fields;
        //Enabled;
        for (let i = 0; i < arrSeasonsEnabled.length; i++) {
            this.context.iCABSAServiceCoverMaintenance7.EnableSeasonalRow(arrSeasonsEnabled[i], (i + 1));
        }
        //No of Visits Enabled;
        //For i = LBound(arrVisitsEnabled) To UBound(arrVisitsEnabled);
        //Call EnableSeasonalVisitRow(arrVisitsEnabled(i), CStr(i + 1));
        //Next;
        // Visibility;
        for (let i = arrSeasonsVisible.length - 1; i >= 0; i--) {
            this.context.iCABSAServiceCoverMaintenance7.ShowHideSeasonRow((i + 1), arrSeasonsVisible[i]);
        }
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    }

    public ShowHideSeasonRow(ipSeason: number, ipVisible: boolean): void {
        let strDisplay;
        let trRow;
        if (ipVisible) {
            strDisplay = true;
        } else {
            strDisplay = false;
        }
        // Show/hide row;
        this.context.pageParams.uiDisplay.Seasons[ipSeason - 1].trRow = strDisplay;
        // Set required status of input fields;
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonNumber' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalFromDate' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalFromWeek' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalFromYear' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalToDate' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalToWeek' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonalToYear' + ipSeason, ipVisible);
        this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'SeasonNoOfVisits' + ipSeason, ipVisible);
    }

    public EnableSeasonalRow(ipEnable: boolean, ipRow: number): void {
        if (ipEnable) {
            this.context.riMaintenance.EnableInput('SeasonNumber' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalFromDate' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalFromWeek' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalFromYear' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalToDate' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalToWeek' + ipRow);
            this.context.riMaintenance.EnableInput('SeasonalToYear' + ipRow);
        } else {
            this.context.riMaintenance.DisableInput('SeasonNumber' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalFromDate' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalFromWeek' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalFromYear' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalToDate' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalToWeek' + ipRow);
            this.context.riMaintenance.DisableInput('SeasonalToYear' + ipRow);
        }
    }

    public HideQuickWindowSet(ipHide: boolean): void {
        let strDisp;
        if (ipHide) {
            strDisp = false;
        } else {
            strDisp = true;
            //this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('C');
        }
        for (let i = 1; i < 8; i++) {
            this.context.pageParams.uiDisplay['selQuickWindowSet' + i] = strDisp;
        }
    }

    public EnableSeasonalVisitRow(ipEnable: boolean, ipRow: number): void {
        if (ipEnable) {
            this.context.riMaintenance.EnableInput('SeasonNoOfVisits' + ipRow);
        } else {
            this.context.riMaintenance.DisableInput('SeasonNoOfVisits' + ipRow);
        }
    }

    public EnableSeasonalChanges(ipEnable: boolean): void {

        for (let i = 1; i < 8; i++) {
            this.context.iCABSAServiceCoverMaintenance7.EnableSeasonalRow(ipEnable, i);
        }
        // Do not allow user to update number of seasonsif( following template;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SeasonalTemplateNumber')) {
            this.context.riMaintenance.DisableInput('NumberOfSeasons');
        } else {
            this.context.riMaintenance.EnableInput('NumberOfSeasons');
        }
    }

    public SeasonalDateChange(ipFromDate: string, opFromWeek: string, opFromYear: string): void {
        // Call 'isError', in order to get the formatting correct, && to check that the user has not;
        // entered an incorrect value;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, ipFromDate)
            && !this.context.riExchange.riInputElement.isError(this.context.uiForm, ipFromDate)) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = 'iCABSDateTimeRequests.p';
            this.context.riMaintenance.PostDataAdd('Function', 'GetWeekFromDate', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('WeekCalcDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, ipFromDate), MntConst.eTypeDate);
            this.context.riMaintenance.ReturnDataAdd('WeekCalcNumber', MntConst.eTypeInteger);
            this.context.riMaintenance.ReturnDataAdd('WeekCalcYear', MntConst.eTypeInteger);
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromWeek, data['WeekCalcNumber']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromYear, data['WeekCalcYear']);
            }, 'POST');

        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromWeek, '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromYear, '');
        }
    }

    public SeasonalWeekChange(ipRequestFunction: string, ipFromWeek: string, ipFromYear: string, opFromDate: string): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, ipFromWeek) &&
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, ipFromYear)) {
            // Call 'isError', in order to get the formatting correct, && to check that the user has not;
            // entered an incorrect value;
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
                this.context.riMaintenance.Execute(this.context, function (data: any): any {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromDate, data['WeekCalcDate']);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, ipFromWeek, data['WeekCalcNumber']);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, ipFromYear, data['WeekCalcYear']);
                }, 'POST');

            } else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromDate, '');
                if (this.context.pageParams['dt' + opFromDate].value !== null) {
                    this.context.pageParams['dt' + opFromDate].value = null;
                } else {
                    this.context.pageParams['dt' + opFromDate].value = void 0;
                }
            }
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, opFromDate, '');
            if (this.context.pageParams['dt' + opFromDate].value !== null) {
                this.context.pageParams['dt' + opFromDate].value = null;
            } else {
                this.context.pageParams['dt' + opFromDate].value = void 0;
            }
        }
    }

}
