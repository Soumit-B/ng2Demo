import { ServiceCoverMaintenanceComponent } from './iCABSAServiceCoverMaintenance.component';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { InternalGridSearchModuleRoutes, InternalGridSearchApplicationModuleRoutes } from './../../../base/PageRoutes';

export class ServiceCoverMaintenance8 {

    private context: ServiceCoverMaintenanceComponent;

    constructor(private parent: ServiceCoverMaintenanceComponent) {
        this.context = parent;
    }

    public GetUpliftStatus(): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.riMaintenance.GetRowID('ServiceCoverROWID'), MntConst.eTypeTextFree);
        this.context.riMaintenance.PostDataAdd('Function', 'GetUpliftStatus', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('UpliftStatus', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.pageParams.tdUpliftStatus_InnerText = data['UpliftStatus'];
        }, 'POST');
    }

    public UpliftTemplateNumber_onchange(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UpliftTemplateName', '');
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    }

    public SelSubjectToUplift_onChange(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelSubjectToUplift') === 'N') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SubjectToUplift', '');
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SubjectToUplift', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SelSubjectToUplift'));
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift') === 'C') {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ClosedCalendarTemplateNumber', true);
        } else {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ClosedCalendarTemplateNumber', false);
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SubjectToUplift') === 'U') {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'UpliftTemplateNumber', true);
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
                this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate
                && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'CapableOfUplift')) {
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'UpliftTemplateNumber');
            }
            this.context.pageParams.uiDisplay.trUpliftCalendar = true;
        } else {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'UpliftTemplateNumber', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UpliftTemplateNumber', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UpliftTemplateName', '');
            this.context.pageParams.uiDisplay.trUpliftCalendar = false;
        }
        if (!this.context.fieldHasValue('SubjectToUplift')) {
            this.context.pageParams.UpliftVisitPosLabel = false;
            this.context.pageParams.uiDisplay.selUpliftVisitPosLabel = false;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UpliftVisitPosition', '');
            //tdUpliftStatus.style.backgroundcolor = true;
            this.context.pageParams.tdUpliftStatus_InnerText = '';
        } else {
            this.context.pageParams.UpliftVisitPosLabel = true;
            this.context.pageParams.uiDisplay.selUpliftVisitPosLabel = true;
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd &&
                !this.context.pageParams.vbAbandon &&
                !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UpliftVisitPosition')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelUpliftVisitPosition', 'AU');
            } else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelUpliftVisitPosition', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UpliftVisitPosition'));
            }
            this.context.iCABSAServiceCoverMaintenance7.SelUpliftVisitPosition_onChange();
        }
    }

    public EnableRMMFields(): void {
        if (this.context.pageParams.vbEnableRMM) {
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RMMCategoryCode') ||
                this.context.riExchange.riInputElement.isError(this.context.uiForm, 'RMMCategoryCode')) {
                this.context.pageParams.uiDisplay.tdRMMJobVisitValueLabel = false;
                this.context.pageParams.uiDisplay.tdRMMJobVisitValue = false;
            } else if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RMMCategoryCode')) {
                this.context.iCABSAServiceCoverMaintenance8.EnableDisableRMMJobVisitValue();
            }
        }
    }

    public EnableDisableRMMJobVisitValue(): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('Function', 'GetRMMCategoryDesc', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('LanguageCode', this.context.riExchange.LanguageCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('RMMCategoryCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RMMCategoryCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('RMMCategoryDesc', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('NumVisits', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('ShowFreeCallouts', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RMMCategoryDesc', data['RMMCategoryDesc']);
            this.context.pageParams.vbNumVisits = data['NumVisits'];
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ShowFreeCallouts', data['ShowFreeCallouts']);
            if (data.hasError) {
                this.context.errorModal.show(data, true);
                return;
            }
            if (this.context.pageParams.vbNumVisits === '0') {
                this.context.pageParams.uiDisplay.tdRMMJobVisitValueLabel = false;
                this.context.pageParams.uiDisplay.tdRMMJobVisitValue = false;
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RMMJobVisitValue', '0.00');
            } else {
                this.context.pageParams.uiDisplay.tdRMMJobVisitValueLabel = true;
                this.context.pageParams.uiDisplay.tdRMMJobVisitValue = true;
            }
            if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'ShowFreeCallouts')) {
                this.context.pageParams.uiDisplay.tdTotalFreeAdditionalVisitsAllowedLabel = false;
                this.context.pageParams.uiDisplay.tdTotalFreeAdditionalVisitsAllowed = false;
                this.context.pageParams.uiDisplay.tdCurrentAddnlVisitCountLabel = false;
                this.context.pageParams.uiDisplay.tdCurrentAddnlVisitCount = false;
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TotalFreeAddnlVisits', '0');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CurrentAddnlVisitCount', '0');
            } else {
                this.context.pageParams.uiDisplay.tdTotalFreeAdditionalVisitsAllowedLabel = true;
                this.context.pageParams.uiDisplay.tdTotalFreeAdditionalVisitsAllowed = true;
                this.context.pageParams.uiDisplay.tdCurrentAddnlVisitCountLabel = true;
                this.context.pageParams.uiDisplay.tdCurrentAddnlVisitCount = true;
            }
        }, 'POST');
    }

    public RMMCategoryCode_onChange(): void {
        this.context.iCABSAServiceCoverMaintenance8.EnableDisableRMMJobVisitValue();
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    }

    public ResetPriceChangeVariable(): void {
        this.context.pageParams.uiDisplay.trPriceChangeOnly = false;
        this.context.pageParams.vbPriceChangeOnlyInd = false;
    }

    public GetServiceCoverWasteRequired(): void {
        //Determineif( Service Cover Waste Screen should be displayed based on Waste Transfer Type && Regulatory Authority;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverFunctions.p';
        this.context.riMaintenance.PostDataAdd('Function', 'GetServiceCoverWasteRequired', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('PremiseNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('WasteTransferTypeCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WasteTransferTypeCode'), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ServiceCoverRowID', this.context.riMaintenance.GetRowID('ServiceCoverROWID'), MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('ServiceCoverWasteRequired', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.pageParams.blnServiceCoverWasteReq = data['ServiceCoverWasteRequired'];
            if (this.context.pageParams.blnServiceCoverWasteReq) {
                this.context.pageParams.saveReturnCallback = true;
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                    this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_ADD_1;
                } else {
                    this.context.pageParams.saveReturnMethod = this.context.postSaveMethodType.POST_SAVE_UPDATE_1;
                }
                this.context.navigate('ServiceCover', InternalGridSearchApplicationModuleRoutes.ICABSASERVICECOVERWASTEGRID);
            }
        }, 'POST');
    }

    public UpdateSPT(): void {
        // This will only get run when EnabledTimePlanning is switched on;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity')) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
            this.context.riMaintenance.PostDataAdd('Function', 'SetSPTValue', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ServiceQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), MntConst.eTypeCode);
            this.context.riMaintenance.ReturnDataAdd('SalesPlannedTime', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('ActualPlannedTime', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SalesPlannedTime', data['SalesPlannedTime']);
                this.context.iCABSAServiceCoverMaintenance3.SalesPlannedTime_OnChange();
            }, 'POST');
        }
    }

    public SeasonalFromDate_onchange(id: string): void {
        this.context.iCABSAServiceCoverMaintenance7.SeasonalDateChange('SeasonalFromDate' + id, 'SeasonalFromWeek' + id, 'SeasonalFromYear' + id);
    }

    public SeasonalFromWeek_onchange(id: string): void {
        this.context.iCABSAServiceCoverMaintenance3.SeasonalFromWeekChange('SeasonalFromWeek' + id, 'SeasonalFromYear' + id, 'SeasonalFromDate' + id);
    }

    public SeasonalFromYear_onchange(id: string): void {
        this.context.iCABSAServiceCoverMaintenance3.SeasonalFromWeekChange('SeasonalFromWeek' + id, 'SeasonalFromYear' + id, 'SeasonalFromDate' + id);
    }

    public SeasonalToDate_onchange(id: string): void {
        this.context.iCABSAServiceCoverMaintenance7.SeasonalDateChange('SeasonalToDate' + id, 'SeasonalToWeek' + id, 'SeasonalToYear' + id);
    }

    public SeasonalToWeek_onchange(id: string): void {
        this.context.iCABSAServiceCoverMaintenance3.SeasonalToWeekChange('SeasonalToWeek' + id, 'SeasonalToYear' + id, 'SeasonalToDate' + id);
    }

    public SeasonalToYear_onchange(id: string): void {
        this.context.iCABSAServiceCoverMaintenance3.SeasonalToWeekChange('SeasonalToWeek' + id, 'SeasonalToYear' + id, 'SeasonalToDate' + id);
    }

}
