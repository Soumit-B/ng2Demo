import { setTimeout } from 'timers';
import { MessageConstant } from '../../../../shared/constants/message.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
export var ServiceCoverMaintenance5 = (function () {
    function ServiceCoverMaintenance5(parent, injector) {
        this.parent = parent;
        this.context = parent;
    }
    ServiceCoverMaintenance5.prototype.selTaxCode_OnChange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'selTaxCode'));
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('Function', 'GetRequireExemptNumberInd', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('TaxCodeForExemptionInd', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('RequireExemptNumberInd', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RequireExemptNumberInd', data['RequireExemptNumberInd']);
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RequireExemptNumberInd') === 'yes') {
                this.context.pageParams.uiDisplay.TaxExemptionNumberLabel = true;
                this.context.pageParams.TaxExemptionNumber = true;
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'TaxExemptionNumber', true);
                }
            }
            else {
                this.context.pageParams.uiDisplay.TaxExemptionNumberLabel = false;
                this.context.pageParams.TaxExemptionNumber = false;
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxExemptionNumber', 'true');
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'TaxExemptionNumber', false);
                }
            }
        }, 'POST');
    };
    ServiceCoverMaintenance5.prototype.AddMultipleTaxRates = function () {
        if (this.context.pageParams.vbOverrideMultipleTaxRates) {
            this.context.riMaintenance.AddTableField('MultipleTaxRates', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('ConsolidateEqualTaxRates', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('TaxCodeMaterials', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'LookUp');
            this.context.riMaintenance.AddTableField('TaxCodeLabour', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'LookUp');
            this.context.riMaintenance.AddTableField('TaxCodeReplacement', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'LookUp');
            this.context.riMaintenance.AddTableField('InvoiceTextMaterials', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('InvoiceTextLabour', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('InvoiceTextReplacement', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        else {
            this.context.riMaintenance.AddTableField('MultipleTaxRates', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('ConsolidateEqualTaxRates', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('TaxCodeMaterials', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('TaxCodeLabour', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('TaxCodeReplacement', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('InvoiceTextMaterials', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('InvoiceTextLabour', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('InvoiceTextReplacement', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        }
    };
    ServiceCoverMaintenance5.prototype.cmdHardSlotCalendar_onClick = function () {
        this.context.pageParams.blnAllowHSCalendar = true;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeNormal) {
            this.context.pageParams.blnAllowHSCalendar = true;
        }
        else if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')) {
            this.context.showAlert(MessageConstant.PageSpecificMessage.Product_Code_Is_Required);
            this.context.pageParams.blnAllowHSCalendar = false;
            return;
        }
        else if (this.context.pageParams.uiDisplay.trServiceVisitFrequency === true &&
            !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency')) {
            this.context.showAlert(MessageConstant.PageSpecificMessage.Visit_Frequency_Is_Required);
            this.context.pageParams.blnAllowHSCalendar = false;
            return;
        }
        else if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.context.pageParams.SavedServiceVisitFrequency !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency') &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate')) {
                this.context.showAlert(MessageConstant.PageSpecificMessage.Effective_Date_Is_Required);
                this.context.pageParams.blnAllowHSCalendar = false;
                return;
            }
            else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'HardSlotEffectDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'));
            }
        }
        else if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate')) {
                this.context.showAlert(MessageConstant.PageSpecificMessage.Service_Commence_Date_Is_Required);
                this.context.pageParams.blnAllowHSCalendar = false;
                return;
            }
            else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'HardSlotEffectDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate'));
            }
        }
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'HardSlotType')) {
            this.context.showAlert(MessageConstant.PageSpecificMessage.Hard_Slot_Type_Is_Required);
            this.context.pageParams.blnAllowHSCalendar = false;
            return;
        }
        if (this.context.pageParams.blnAllowHSCalendar) {
            alert(' Navigate to iCABSAServiceCoverHSCalendarGrid when available');
        }
    };
    ServiceCoverMaintenance5.prototype.cmdDiaryView_onClick = function () {
        alert(' Navigate to iCABSATechnicianVisitDiaryGrid when available');
    };
    ServiceCoverMaintenance5.prototype.AutoRouteProductInd_onClick = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'AutoRouteProductInd')) {
            this.context.pageParams.uiDisplay.RoutingExclusionReason = true;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RoutingExclusionReason', true);
        }
        else {
            this.context.pageParams.uiDisplay.RoutingExclusionReason = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RoutingExclusionReason', false);
        }
    };
    ServiceCoverMaintenance5.prototype.VisitPatternEffectiveDate_OnChange = function () {
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
            for (var iCount = 1; iCount <= 7; iCount++) {
                this.context.riMaintenance.ReturnDataAdd('VisitOnDay' + iCount, MntConst.eTypeCheckBox);
                this.context.riMaintenance.ReturnDataAdd('BranchServiceAreaCode' + iCount, MntConst.eTypeText);
            }
            this.context.riMaintenance.Execute(this.context, function (data) {
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
                    for (var iCount = 1; iCount <= 7; iCount++) {
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitOnDay' + iCount, data['VisitOnDay' + iCount]);
                        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount, data['VisitOnDay' + iCount]);
                    }
                }
            }, 'POST');
        }
    };
    ServiceCoverMaintenance5.prototype.AutoPattern_OnChange = function () {
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', 'D');
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern'));
        }
    };
    ServiceCoverMaintenance5.prototype.SelAutoPattern_Onchange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoPattern', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoPattern'));
        this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoPattern');
        this.context.iCABSAServiceCoverMaintenance5.SetVisitPatternEffectiveDate();
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoPattern') === 'D') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', 'D');
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern') === 'D') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoAllocation', 'D');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoAllocation');
            for (var iCount = 1; iCount <= 7; iCount++) {
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitOnDay' + iCount);
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BranchServiceAreaCode' + iCount);
            }
        }
        else {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'VisitPatternEffectiveDate');
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SelAutoAllocation');
        }
    };
    ServiceCoverMaintenance5.prototype.AutoAllocation_OnChange = function () {
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', 'D');
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation'));
        }
    };
    ServiceCoverMaintenance5.prototype.SelAutoAllocation_Onchange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AutoAllocation', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoAllocation'));
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation') === 'D') {
            for (var iCount = 1; iCount <= 7; iCount++) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitOnDay' + iCount, false);
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitOnDay' + iCount);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount, '');
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BranchServiceAreaCode' + iCount);
            }
        }
        else {
            for (var iCount = 1; iCount <= 7; iCount++) {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'VisitOnDay' + iCount);
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'BranchServiceAreaCode' + iCount);
            }
        }
    };
    ServiceCoverMaintenance5.prototype.GetServiceAreaRequired = function () {
        for (var iCount = 1; iCount <= 7; iCount++) {
            this.context.pageParams.blnRequired = this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitOnDay' + iCount);
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'BranchServiceAreaCode' + iCount, this.context.pageParams.blnRequired);
            if (!this.context.pageParams.blnRequired) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount, '');
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'BranchServiceAreaCode' + iCount, false);
            }
        }
    };
    ServiceCoverMaintenance5.prototype.ValidateServiceArea = function () {
        var _loop_1 = function(iCount) {
            if (this_1.context.riExchange.riInputElement.checked(this_1.context.uiForm, 'VisitOnDay' + iCount) &&
                !this_1.context.riExchange.riInputElement.GetValue(this_1.context.uiForm, 'BranchServiceAreaCode' + iCount)) {
                this_1.context.riExchange.riInputElement.isError(this_1.context.uiForm, 'BranchServiceAreaCode' + iCount);
            }
            if (this_1.context.riExchange.riInputElement.GetValue(this_1.context.uiForm, 'BranchServiceAreaCode' + iCount)) {
                this_1.context.riMaintenance.clear();
                this_1.context.riMaintenance.BusinessObject = this_1.context.pageParams.strRequestProcedure;
                this_1.context.riMaintenance.PostDataAdd('Function', 'CheckBranchServiceArea', MntConst.eTypeText);
                this_1.context.riMaintenance.PostDataAdd('BusinessCode', this_1.context.utils.getBusinessCode(), MntConst.eTypeCode);
                this_1.context.riMaintenance.PostDataAdd('ServiceBranchNumber', this_1.context.riExchange.riInputElement.GetValue(this_1.context.uiForm, 'ServiceBranchNumber'), MntConst.eTypeInteger);
                this_1.context.riMaintenance.PostDataAdd('BranchServiceAreaCode' + iCount, this_1.context.riExchange.riInputElement.GetValue(this_1.context.uiForm, 'BranchServiceAreaCode' + iCount), MntConst.eTypeCode);
                this_1.context.riMaintenance.Execute(this_1.context, function (data) {
                    if (data.hasOwnProperty('errorMessage')) {
                        this.context.riExchange.riInputElement.SetErrorStatus('BranchServiceAreaCode' + iCount, true);
                        this.context.riMaintenance.CancelEvent = true;
                    }
                }, 'POST');
            }
        };
        var this_1 = this;
        for (var iCount = 1; iCount <= 7; iCount++) {
            _loop_1(iCount);
        }
    };
    ServiceCoverMaintenance5.prototype.ValidateVisitPattern = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoPattern') === 'D'
            && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AutoAllocation') === 'D') {
            for (var iCount = 1; iCount <= 7; iCount++) {
                if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitOnDay' + iCount)) {
                    this.context.pageParams.blnVisitCount = this.context.pageParams.blnVisitCount + 1;
                }
            }
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitOnDayCount', 'blnVisitCount');
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitsPerCycle') !== this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitOnDayCount')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoPattern', 'D');
                this.context.iCABSAServiceCoverMaintenance5.SelAutoPattern_Onchange();
                this.context.iCABSAServiceCoverMaintenance5.GetServiceAreaRequired();
            }
        }
    };
    ServiceCoverMaintenance5.prototype.SetVisitPatternEffectiveDate = function () {
        if (this.context.InStr('FieldShowList', 'VisitCycleInWeeks') !== -1 &&
            this.context.pageParams.blnUseVisitCycleValues &&
            this.context.pageParams.currentContractType === 'C') {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoAllocation') === 'D' ||
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelAutoPattern') === 'D') {
                if ((this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) &&
                    !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'VisitPatternEffectiveDate')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitPatternEffectiveDate', this.context.utils.TodayAsDDMMYYYY());
                    setTimeout(function () {
                        this.context.setDateToFields('VisitPatternEffectiveDate', this.context.utils.TodayAsDDMMYYYY());
                    }.bind(this.context), 100);
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelAutoAllocation', 'D');
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoAllocation');
                    for (var iCount = 1; iCount <= 7; iCount++) {
                        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'VisitOnDay' + iCount);
                        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BranchServiceAreaCode' + iCount);
                    }
                    this.context.iCABSAServiceCoverMaintenance5.DefaultVisitPattern();
                }
            }
        }
    };
    ServiceCoverMaintenance5.prototype.DefaultVisitPattern = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('Function', 'GetDefaultVisitPattern', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.riMaintenance.GetRowID('ServiceCoverROWID'), MntConst.eTypeText);
        for (var iCount = 1; iCount <= 7; iCount++) {
            this.context.riMaintenance.ReturnDataAdd('VisitOnDay' + iCount, MntConst.eTypeCheckBox);
            this.context.riMaintenance.ReturnDataAdd('BranchServiceAreaCode' + iCount, MntConst.eTypeText);
        }
        this.context.riMaintenance.Execute(this.context, function (data) {
            for (var iCount = 1; iCount <= 7; iCount++) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitOnDay' + iCount, data['VisitOnDay' + iCount]);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BranchServiceAreaCode' + iCount, data['BranchServiceAreaCode' + iCount]);
            }
        }, 'POST');
    };
    return ServiceCoverMaintenance5;
}());
