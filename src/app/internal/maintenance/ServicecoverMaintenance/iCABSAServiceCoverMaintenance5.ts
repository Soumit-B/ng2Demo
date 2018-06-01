import { setTimeout } from 'timers';
import { MessageConstant } from '../../../../shared/constants/message.constant';
import { Injector } from '@angular/core';
import { ServiceCoverMaintenanceComponent } from './iCABSAServiceCoverMaintenance.component';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

export class ServiceCoverMaintenance5 {

    private context: ServiceCoverMaintenanceComponent;
    private injector: Injector;

    constructor(private parent: ServiceCoverMaintenanceComponent, injector: Injector) {
        this.context = parent;
    }

    public selTaxCode_OnChange(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCode',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selTaxCode'));
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('Function', 'GetRequireExemptNumberInd', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('TaxCodeForExemptionInd', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('RequireExemptNumberInd', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RequireExemptNumberInd', data['RequireExemptNumberInd']);
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RequireExemptNumberInd') === 'yes') {
                this.context.pageParams.uiDisplay.TaxExemptionNumberLabel = true;
                this.context.pageParams.TaxExemptionNumber = true;
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'TaxExemptionNumber', true);
                }
            } else {
                this.context.pageParams.uiDisplay.TaxExemptionNumberLabel = false;
                this.context.pageParams.TaxExemptionNumber = false;
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxExemptionNumber', 'true');
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'TaxExemptionNumber', false);
                }
            }
        }, 'POST');
    }

    public AddMultipleTaxRates(): void {
        if (this.context.pageParams.vbOverrideMultipleTaxRates) {
            this.context.riMaintenance.AddTableField('MultipleTaxRates', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('ConsolidateEqualTaxRates', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('TaxCodeMaterials', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'LookUp');
            this.context.riMaintenance.AddTableField('TaxCodeLabour', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'LookUp');
            this.context.riMaintenance.AddTableField('TaxCodeReplacement', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'LookUp');
            this.context.riMaintenance.AddTableField('InvoiceTextMaterials', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('InvoiceTextLabour', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('InvoiceTextReplacement', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.disableControl('MultipleTaxRates', false);
            this.context.disableControl('ConsolidateEqualTaxRates', false);
            this.context.disableControl('TaxCodeMaterials', false);
            this.context.disableControl('TaxCodeLabour', false);
            this.context.disableControl('TaxCodeReplacement', false);
            this.context.disableControl('InvoiceTextMaterials', false);
            this.context.disableControl('InvoiceTextLabour', false);
            this.context.disableControl('InvoiceTextReplacement', false);
        } else {
            this.context.riMaintenance.AddTableField('MultipleTaxRates', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('ConsolidateEqualTaxRates', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('TaxCodeMaterials', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('TaxCodeLabour', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('TaxCodeReplacement', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('InvoiceTextMaterials', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('InvoiceTextLabour', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('InvoiceTextReplacement', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.disableControl('MultipleTaxRates', true);
            this.context.disableControl('ConsolidateEqualTaxRates', true);
            this.context.disableControl('TaxCodeMaterials', true);
            this.context.disableControl('TaxCodeLabour', true);
            this.context.disableControl('TaxCodeReplacement', true);
            this.context.disableControl('InvoiceTextMaterials', true);
            this.context.disableControl('InvoiceTextLabour', true);
            this.context.disableControl('InvoiceTextReplacement', true);
        }
    }

    public cmdHardSlotCalendar_onClick(): void {
        this.context.pageParams.blnAllowHSCalendar = true;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeNormal) {
            this.context.pageParams.blnAllowHSCalendar = true;
        } else if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')) {
            this.context.showAlert(MessageConstant.PageSpecificMessage.Product_Code_Is_Required);
            this.context.pageParams.blnAllowHSCalendar = false;
            return;
        } else if (this.context.pageParams.uiDisplay.trServiceVisitFrequency === true &&
            !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency')) {
            this.context.showAlert(MessageConstant.PageSpecificMessage.Visit_Frequency_Is_Required);
            this.context.pageParams.blnAllowHSCalendar = false;
            return;
        } else if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.context.pageParams.SavedServiceVisitFrequency !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency') &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate')) {
                this.context.showAlert(MessageConstant.PageSpecificMessage.Effective_Date_Is_Required);
                this.context.pageParams.blnAllowHSCalendar = false;
                return;
            } else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'HardSlotEffectDate',
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'));
            }
        } else if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate')) {
                this.context.showAlert(MessageConstant.PageSpecificMessage.Service_Commence_Date_Is_Required);
                this.context.pageParams.blnAllowHSCalendar = false;
                return;
            } else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'HardSlotEffectDate',
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate'));
            }
        }
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotType')) {
            this.context.showAlert(MessageConstant.PageSpecificMessage.Hard_Slot_Type_Is_Required);
            this.context.pageParams.blnAllowHSCalendar = false;
            return;
        }
        if (this.context.pageParams.blnAllowHSCalendar) {
            //riExchange.Mode = 'ServiceCover';
            //window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverHSCalendarGrid.htm<maxwidth>';
            alert(' Navigate to iCABSAServiceCoverHSCalendarGrid when available');
        }
    }

    public cmdDiaryView_onClick(): void {
        //riExchange.Mode = 'ServiceCover';
        //window.location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Application/iCABSATechnicianVisitDiaryGrid.htm<maxwidth>';
        alert(' Navigate to iCABSATechnicianVisitDiaryGrid when available');
    }
    public AutoRouteProductInd_onClick(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'AutoRouteProductInd')) {
            this.context.pageParams.uiDisplay.RoutingExclusionReason = true;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RoutingExclusionReason', true);
        } else {
            this.context.pageParams.uiDisplay.RoutingExclusionReason = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RoutingExclusionReason', false);
        }
    }

    public VisitPatternEffectiveDate_OnChange(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitPatternEffectiveDate')) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.PostDataAdd('Function', 'CheckPatternEffectiveDate', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.riMaintenance.GetRowID('ServiceCoverROWID'), MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('VisitPatternRowID', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitPatternRowID'), MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('VisitPatternEffectiveDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitPatternEffectiveDate'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('VisitPatternRowID', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('AutoPattern', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('AutoAllocation', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('ChangeDateInd', MntConst.eTypeCheckBox);
            for (let iCount = 1; iCount <= 7; iCount++) {
                this.context.riMaintenance.ReturnDataAdd('VisitOnDay' + iCount, MntConst.eTypeCheckBox);
                this.context.riMaintenance.ReturnDataAdd('BranchServiceAreaCode' + iCount, MntConst.eTypeText);
            }
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitPatternRowID', data['VisitPatternRowID']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ChangeDateInd', data['ChangeDateInd']);
                if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ChangeDateInd')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoPattern', data['AutoPattern']);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoAllocation', data['AutoAllocation']);
                    if (this.context.riExchange.riInputElement.GetValue(this.uiForm, 'SelAutoPattern') !== 'P') {
                        this.iCABSAServiceCoverMaintenance5.AutoPattern_OnChange();
                    }
                    this.iCABSAServiceCoverMaintenance5.SelAutoPattern_Onchange();
                    this.iCABSAServiceCoverMaintenance5.AutoAllocation_OnChange();
                    this.iCABSAServiceCoverMaintenance5.SelAutoAllocation_OnChange();
                    for (let iCount = 1; iCount <= 7; iCount++) {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitOnDay' + iCount, data['VisitOnDay' + iCount]);
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount, data['VisitOnDay' + iCount]);
                    }
                }
            }, 'POST');
        }
    }

    public AutoPattern_OnChange(): void {
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', 'D');
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern',
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern'));
        }
    }

    public SelAutoPattern_Onchange(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoPattern',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoPattern'));
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoPattern');
        this.context.iCABSAServiceCoverMaintenance5.SetVisitPatternEffectiveDate();
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoPattern') === 'D') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', 'D');
        }

        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern') === 'D') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoAllocation', 'D');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoAllocation');
            for (let iCount = 1; iCount <= 7; iCount++) {
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitOnDay' + iCount);
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BranchServiceAreaCode' + iCount);
            }
        } else {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'VisitPatternEffectiveDate');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoAllocation');
        }
    }

    public AutoAllocation_OnChange(): void {
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', 'D');
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation',
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation'));
        }
    }

    public SelAutoAllocation_Onchange(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoAllocation',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoAllocation'));
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation') === 'D') {
            for (let iCount = 1; iCount <= 7; iCount++) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitOnDay' + iCount, false);
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitOnDay' + iCount);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount, '');
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BranchServiceAreaCode' + iCount);
            }
        } else {
            for (let iCount = 1; iCount <= 7; iCount++) {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'VisitOnDay' + iCount);
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'BranchServiceAreaCode' + iCount);
            }
        }
    }


    public GetServiceAreaRequired(): void {
        for (let iCount = 1; iCount <= 7; iCount++) {
            this.context.pageParams.blnRequired = this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitOnDay' + iCount);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'BranchServiceAreaCode' + iCount, this.context.pageParams.blnRequired);
            if (!this.context.pageParams.blnRequired) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount, '');
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'BranchServiceAreaCode' + iCount, false);
            }
        }
    }

    public ValidateServiceArea(): void {
        for (let iCount = 1; iCount <= 7; iCount++) {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitOnDay' + iCount) &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount)) {
                this.context.riExchange.riInputElement.isError(this.context.uiForm, 'BranchServiceAreaCode' + iCount);
            }
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount)) {
                this.context.riMaintenance.clear();
                this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
                this.context.riMaintenance.PostDataAdd('Function', 'CheckBranchServiceArea', MntConst.eTypeText);
                this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
                this.context.riMaintenance.PostDataAdd('ServiceBranchNumber',
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceBranchNumber'), MntConst.eTypeInteger);
                this.context.riMaintenance.PostDataAdd('BranchServiceAreaCode' + iCount,
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount), MntConst.eTypeCode);
                this.context.riMaintenance.Execute(this.context, function (data: any): any {
                    if (data.hasOwnProperty('errorMessage')) {
                        this.context.riExchange.riInputElement.SetErrorStatus('BranchServiceAreaCode' + iCount, true);
                        this.context.riMaintenance.CancelEvent = true;
                    }
                }, 'POST');
            }
        }
    }

    public ValidateVisitPattern(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern') === 'D'
            && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation') === 'D') {
            for (let iCount = 1; iCount <= 7; iCount++) {
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitOnDay' + iCount)) {
                    this.context.pageParams.blnVisitCount = this.context.pageParams.blnVisitCount + 1;
                }
            }

            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitOnDayCount', this.context.pageParams.blnVisitCount);
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle') !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitOnDayCount')) {
                //this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'MessageDisplay', ''Visit patterns are out of synchronisation && need to be updated.Do you want to continue?')%>'' );
                //if (MsgBox(MessageDisplay.value, this.context.pageParams.vbYesNo + this.context.pageParams.vbQuestion + this.context.pageParams.vbDefaultButton1, '<% ===riT('Visit Pattern Records')%>') = this.context.pageParams.vbNo) {
                //riMaintenance.CancelEvent = true;
                //} else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', 'D');
                this.context.iCABSAServiceCoverMaintenance5.SelAutoPattern_Onchange();
                this.context.iCABSAServiceCoverMaintenance5.GetServiceAreaRequired();
                //}
            }
        }
    }

    public SetVisitPatternEffectiveDate(): void {
        if (this.context.InStr('FieldShowList', 'VisitCycleInWeeks') !== -1 &&
            this.context.pageParams.blnUseVisitCycleValues &&
            this.context.pageParams.currentContractType === 'C') {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoAllocation') === 'D' ||
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoPattern') === 'D') {
                if ((this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) &&
                    !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitPatternEffectiveDate')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitPatternEffectiveDate', this.context.utils.TodayAsDDMMYYYY());
                    setTimeout(function (): void {
                        this.context.setDateToFields('VisitPatternEffectiveDate', this.context.utils.TodayAsDDMMYYYY());
                    }.bind(this.context), 100);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', 'D');
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoAllocation');
                    for (let iCount = 1; iCount <= 7; iCount++) {
                        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitOnDay' + iCount);
                        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BranchServiceAreaCode' + iCount);
                    }
                    this.context.iCABSAServiceCoverMaintenance5.DefaultVisitPattern();
                }
            }
        }
    }

    public DefaultVisitPattern(): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('Function', 'GetDefaultVisitPattern', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.riMaintenance.GetRowID('ServiceCoverROWID'), MntConst.eTypeText);
        for (let iCount = 1; iCount <= 7; iCount++) {
            this.context.riMaintenance.ReturnDataAdd('VisitOnDay' + iCount, MntConst.eTypeCheckBox);
            this.context.riMaintenance.ReturnDataAdd('BranchServiceAreaCode' + iCount, MntConst.eTypeText);
        }
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            for (let iCount = 1; iCount <= 7; iCount++) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitOnDay' + iCount, data['VisitOnDay' + iCount]);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount, data['BranchServiceAreaCode' + iCount]);
            }
        }, 'POST');
    }

}
