import { ProductSearchGridComponent } from './../../search/iCABSBProductSearch';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
export var ServiceCoverMaintenanceLoad = (function () {
    function ServiceCoverMaintenanceLoad(parent) {
        this.parent = parent;
        this.context = parent;
    }
    ServiceCoverMaintenanceLoad.prototype.window_onload = function () {
        this.context.pageParams.strEntryProcedure = 'iCABSServiceCoverEntry.p';
        this.context.pageParams.strRequestProcedure = 'iCABSServiceCoverEntryRequests.p';
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CallLogID', this.context.riExchange.getParentHTMLValue('CurrentCallLogID'));
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedWithChanges', this.context.riExchange.getParentHTMLValue('ClosedWithChanges'));
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelectCompositeProductcode');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        if (this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintLog === true) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
        }
        this.context.pageParams.uiDisplay.trZeroValueIncInvoice = false;
        var iCounter;
        this.context.iCABSAServiceCoverMaintenance1.SetHTMLPageSettings();
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RunningReadOnly', this.context.riExchange.getParentHTMLValue('RunningReadOnly'));
        if (this.context.riExchange.getCurrentContractType() === 'J') {
            this.context.pageParams.uiDisplay.tdCustomerInfo = false;
            this.context.pageParams.uiDisplay.tdAnnDate = false;
            this.context.pageParams.uiDisplay.tdAnnDateLab = false;
            this.context.pageParams.uiDisplay.tdInvFreq = false;
            this.context.pageParams.uiDisplay.tdInvFreqLab = false;
            this.context.pageParams.uiDisplay.trOutstandingInstallations = false;
            this.context.pageParams.uiDisplay.trInstallationEmployee = false;
            this.context.pageParams.uiDisplay.trInitialValue = false;
            this.context.pageParams.uiDisplay.trServiceVisitAnnivDate = false;
            this.context.pageParams.uiDisplay.trForwardDateChangeInd = false;
            this.context.pageParams.uiDisplay.trStandardTreatmentTime = false;
            this.context.pageParams.uiDisplay.trInitialTreatmentTime = false;
            this.context.pageParams.uiDisplay.trClosedCalendarTemplateFields = false;
            if (this.context.pageParams.vbEnableJobsToInvoiceAfterVisit) {
                this.context.pageParams.uiDisplay.trInvoiceOnFirstVisit = true;
            }
        }
        if (this.context.riExchange.getCurrentContractType() === 'P') {
            this.context.pageParams.uiDisplay.trRetainServiceCover = false;
        }
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSFindPropertyCareBranch.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'Request', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BranchNumber', this.context.utils.getBranchCode(), MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('PropertyCareInd', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('AllowUpdateInd', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.pageParams.boolPropertyCareInd = data['PropertyCareInd'];
            if (data['AllowUpdateInd'] === 'N') {
                this.riExchange.riInputElement.Disable(this.context.uiForm, 'GuaranteeRequired');
                this.context.iCABSAServiceCoverMaintenanceLoad.window_onload_contd();
            }
        }, 'POST');
    };
    ServiceCoverMaintenanceLoad.prototype.window_onload_contd = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSCustomerInfoFunctions.p';
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('Mode', 'CheckBranchUserRights', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('WriteAccess', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.pageParams.boolUserWriteAccess = data['WriteAccess'];
            if (this.context.pageParams.boolPropertyCareInd === 'Y' && this.context.pageParams.boolUserWriteAccess === 'yes') {
                this.context.pageParams.uiDisplay.trGuaranteeRequired = true;
            }
            else {
                this.context.pageParams.uiDisplay.trGuaranteeRequired = false;
            }
            this.context.iCABSAServiceCoverMaintenanceLoad.window_onload_contd1();
        }, 'POST');
    };
    ServiceCoverMaintenanceLoad.prototype.window_onload_contd1 = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSQualificationFunctions.p';
        this.context.riMaintenance.PostDataAdd('Function', 'CheckOccupation', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('OccupationIsAllow', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            if (data['OccupationIsAllow'] === 'yes') {
                this.context.pageParams.lEnableQualificationOption = true;
            }
            else {
                this.context.pageParams.lEnableQualificationOption = false;
            }
        }, 'POST');
        this.context.pageParams.lEnableQualificationOption = false;
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ComponentGridCacheTime', this.context.utils.Time());
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentSelAll');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdComponentDesAll');
        if (this.context.riExchange.getCurrentContractType() === 'C') {
            if (this.context.pageParams.vbEnableTrialPeriodServices) {
                this.context.pageParams.uiDisplay.tdTrialPeriodInd = true;
            }
            if (this.context.pageParams.vbEnableFreeOfChargeServices) {
                this.context.pageParams.uiDisplay.trFOC = true;
            }
            this.context.pageParams.uiDisplay.trAnnualCalendarTemplateFields = true;
        }
        if (this.context.parentMode === 'Search'
            || this.context.parentMode === 'SearchAdd'
            || this.context.parentMode === 'Premise-Add'
            || this.context.parentMode === 'ContactAdd'
            || this.context.parentMode === 'ContactUpdate') {
            this.context.setControlValue('AccountNumber', this.context.riExchange.getParentHTMLValue('AccountNumber'));
            this.context.setControlValue('ContractNumber', this.context.riExchange.getParentHTMLValue('ContractNumber'));
            this.context.setControlValue('ContractName', this.context.riExchange.getParentHTMLValue('ContractName'));
            this.context.setControlValue('PremiseNumber', this.context.riExchange.getParentHTMLValue('PremiseNumber'));
            this.context.setControlValue('PremiseName', this.context.riExchange.getParentHTMLValue('PremiseName'));
            if (this.context.parentMode !== 'ContactAdd' && this.context.riExchange.getParentHTMLValue('ProductCode')) {
                this.context.setControlValue('ProductCode', this.context.riExchange.getParentHTMLValue('ProductCode'));
                this.context.setControlValue('ProductDesc', this.context.riExchange.getParentHTMLValue('ProductDesc'));
                if (!this.context.riExchange.getParentHTMLValue('ProductCode')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ProductCode', this.context.riExchange.getParentAttributeValue('ProductCode'));
                }
            }
        }
        if (this.context.parentMode === 'Request') {
            this.context.setControlValue('AccountNumber', this.context.riExchange.getParentHTMLValue('AccountNumber'));
            this.context.setControlValue('ContractNumber', this.context.riExchange.getParentHTMLValue('ContractNumber'));
            this.context.setControlValue('ContractName', this.context.riExchange.getParentHTMLValue('ContractName'));
            this.context.setControlValue('PremiseNumber', this.context.riExchange.getParentHTMLValue('PremiseNumber'));
            this.context.setControlValue('PremiseName', this.context.riExchange.getParentHTMLValue('PremiseName'));
            this.context.setControlValue('ProductCode', this.context.riExchange.getParentHTMLValue('ProductCode'));
            this.context.setControlValue('ProductDesc', this.context.riExchange.getParentHTMLValue('ProductDesc'));
            this.context.pageParams.thControl = false;
        }
        this.context.riMaintenance.BusinessObject = 'riControl.p';
        this.context.riMaintenance.CustomBusinessObject = this.context.pageParams.strEntryProcedure;
        this.context.riMaintenance.CustomBusinessObjectSelect = true;
        this.context.riMaintenance.CustomBusinessObjectConfirm = false;
        this.context.riMaintenance.CustomBusinessObjectInsert = true;
        this.context.riMaintenance.CustomBusinessObjectUpdate = true;
        this.context.riMaintenance.CustomBusinessObjectDelete = false;
        this.context.riMaintenance.DisplayMessages = true;
        if (this.context.riExchange.getParentHTMLValue('CurrentCallLogID') !== '' &&
            this.context.riExchange.getParentHTMLValue('CurrentCallLogID')) {
            this.context.riMaintenance.FunctionAdd = false;
            this.context.riMaintenance.FunctionSelect = false;
        }
        this.context.riMaintenance.FunctionSnapShot = false;
        this.context.riMaintenance.FunctionDelete = false;
        this.context.riMaintenance.DisplayMessages = true;
        if (this.context.parentMode === 'Search'
            || this.context.parentMode === 'SearchAdd') {
            this.context.riMaintenance.FunctionSearch = false;
        }
        if (this.context.riExchange.URLParameterContains('PendingReduction') || this.context.riExchange.URLParameterContains('PendingDeletion')) {
            this.context.riMaintenance.FunctionAdd = false;
        }
        if (this.context.riExchange.URLParameterContains('pgm')) {
            this.context.riMaintenance.FunctionAdd = false;
            this.context.riMaintenance.FunctionSelect = false;
        }
        switch (this.context.parentMode) {
            case 'RepeatSales':
                this.context.riMaintenance.RowID(this.context, 'ServiceCoverROWID', this.context.riExchange.getParentAttributeValue('RowID'));
                break;
            case 'ServiceCoverGrid':
                this.context.riMaintenance.RowID(this.context, 'ServiceCoverROWID', this.context.riExchange.getParentAttributeValue('RowID'));
                break;
            case 'ServiceSuspend':
            case 'ServicePlanning':
            case 'AreaReallocation':
            case 'ServiceAreaSequence':
            case 'StateOfService':
            case 'GroupServiceVisit':
            case 'VisitDateDiscrepancy':
            case 'ServiceVisitHistory':
            case 'Infestation':
            case 'ServiceVisit':
            case 'ExchangesDue':
            case 'InstallationsCommence':
            case 'AnnualCalendar':
                this.context.riMaintenance.RowID(this.context, 'ServiceCoverROWID', this.context.riExchange.getParentAttributeValue('ServiceCoverRowID'));
                break;
            case 'TechVisitDiary':
                this.context.riMaintenance.RowID(this.context, 'ServiceCoverROWID', this.context.riExchange.getParentAttributeValue('ServiceCoverRowID'));
                break;
            case 'ContactUpdate':
                if (this.context.riExchange.getParentHTMLValue('ServiceCoverRowID') !== '') {
                    this.context.riMaintenance.RowID(this.context, 'ServiceCoverROWID', this.context.riExchange.getParentHTMLValue('ServiceCoverRowID'));
                }
                break;
            case 'Request':
                this.context.riMaintenance.RowID(this.context, 'ServiceCoverROWID', this.context.riExchange.getParentAttributeValue('ServiceCover'));
                break;
            case 'PortfolioNoTurnover':
            case 'ServiceStatsAdjust':
            case 'RezoneRejections':
            case 'CancelledVisit':
            case 'VisitRejection':
            case 'TechServiceVisit':
            case 'DOWSentricon':
            case 'SuspendServiceandInvoice':
            case 'Search':
            case 'Summary':
            case 'ContractSoS':
            case 'Release':
            case 'ProRataCharge':
            case 'ServiceVisitEntryGrid':
            case 'ServiceValueEntryGrid':
            case 'TrialPeriod':
            case 'Accept':
            case 'TelesalesOrderLine':
            case 'Bonus':
            case 'Entitlement':
            case 'LostBusinessAnalysis':
            case 'InvoiceReleased':
            case 'StaticVisit':
            case 'TreatmentcardRecall':
            case 'EntitlementVariance':
            case 'PortfolioReports':
            case 'RetainedServiceCovers':
            case 'TechWorkSummary':
            case 'ClientRetention':
            case 'CustomerCCOReport':
                this.context.riMaintenance.RowID(this.context, 'ServiceCoverROWID', this.context.riExchange.getParentAttributeValue('ServiceCoverRowID'));
                break;
        }
        this.window_onload_contd2();
    };
    ServiceCoverMaintenanceLoad.prototype.window_onload_contd2 = function (callback) {
        if ((this.context.parentMode === 'Premise-Add'
            || this.context.parentMode === 'SearchAdd'
            || this.context.parentMode === 'ContactAdd') && this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'selTaxCode');
            if (this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintLog === true) {
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
            }
            this.context.initialLoad = true;
            this.context.serviceCoverSearchParams.parentMode = 'ServiceCover-' + this.context.riExchange.getCurrentContractType();
            this.context.serviceCoverSearchComponent = ProductSearchGridComponent;
            var contractNum = this.context.getControlValue('ContractNumber');
            var contractname = this.context.getControlValue('ContractName');
            var premiseNume = this.context.getControlValue('PremiseNumber');
            var premisename = this.context.getControlValue('PremiseName');
            var contractType = this.context.getControlValue('ContractTypeCode');
            this.context.initiPageState();
            this.context.riMaintenance.CurrentMode = MntConst.eModeAdd;
            this.context.setControlValue('ContractNumber', contractNum);
            this.context.setControlValue('ContractName', contractname);
            this.context.setControlValue('PremiseNumber', premiseNume);
            this.context.setControlValue('PremiseName', premisename);
            this.context.setControlValue('ContractTypeCode', contractType);
            this.context.uiForm.controls['ContractNumber'].markAsDirty();
            this.context.uiForm.controls['PremiseNumber'].markAsDirty();
            this.context.disableControl('ContractNumber', true);
            this.context.disableControl('PremiseNumber', true);
            this.context.disableControl('ProductCode', false);
            setTimeout(function () {
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'ProductCode');
            }.bind(this), 1000);
            return;
        }
        this.context.riMaintenance.AddTable('ServiceCover');
        this.context.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddTableKey('ServiceCoverROWID', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.context.riMaintenance.AddTableKey('ContractTypeCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        if (this.context.parentMode === 'Search'
            || this.context.parentMode === 'SearchAdd'
            || this.context.parentMode === 'Premise-Add'
            || this.context.parentMode === 'ContactAdd'
            || this.context.parentMode === 'ContactUpdate') {
            this.context.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        }
        else {
            this.context.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        }
        if (this.context.parentMode === 'Search'
            || this.context.parentMode === 'SearchAdd'
            || this.context.parentMode === 'Premise-Add') {
            this.context.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        }
        else {
            this.context.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        }
        this.context.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.context.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('ServiceCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableField('ContractNumber', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableField('PremiseNumber', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableField('ProductCode', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableFieldAlignment('ServiceCommenceDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('ServiceVisitFrequency', MntConst.eTypeInteger, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableField('ServiceQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableField('LastChangeEffectDate', MntConst.eTypeDate, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableFieldAlignment('LastChangeEffectDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('ServiceVisitAnnivDate', MntConst.eTypeDate, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableFieldAlignment('ServiceVisitAnnivDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('VisitCycleInWeeks', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableField('VisitCycleInWeeksOverrideNote', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.context.riMaintenance.AddTableField('VisitsPerCycle', MntConst.eTypeInteger, MntConst.eFieldOptionRequried, MntConst.eFieldStateReadOnly, 'Required');
        this.context.riMaintenance.AddTableField('AutoPattern', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateReadOnly, 'Required');
        if (this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.riMaintenance.AddTableField('SeasonalServiceInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        if (this.context.pageParams.vSCRepeatSalesMatching) {
            this.context.riMaintenance.AddTableField('MatchedContractNumber', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('MatchedPremiseNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        }
        this.context.riMaintenance.AddTableField('InitialValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('InstallationValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('RemovalValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('InstallByBranchInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('InstallationEmployeeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('RemovalEmployeeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('InstallationDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldAlignment('InstallationDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('RemovalDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldAlignment('RemovalDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('OutstandingInstallations', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('OutstandingRemovals', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('InvoiceSuspendInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('InvoiceSuspendText', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('InvoiceOnFirstVisitInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('InvoiceReleasedInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('InvoiceReleasedDate', MntConst.eTypeDateText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('InvoiceReleasedDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('NextInvoiceStartDate', MntConst.eTypeDateText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('NextInvoiceStartDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('NextInvoiceEndDate', MntConst.eTypeDateText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('NextInvoiceEndDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('ServiceBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequried, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('BranchServiceAreaCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableFieldAlignment('BranchServiceAreaCode', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('BranchServiceAreaSeqNo', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableFieldAlignment('BranchServiceAreaSeqNo', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('RetainServiceWeekdayInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.context.pageParams.vbEnableProductServiceType) {
            this.context.riMaintenance.AddTableField('ServiceTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');
        }
        else {
            this.context.riMaintenance.AddTableField('ServiceTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        }
        this.context.riMaintenance.AddTableFieldAlignment('ServiceTypeCode', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('ServiceSalesEmployee', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableFieldAlignment('ServiceSalesEmployee', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('DepotNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('SalesEmployeeText', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableFieldAlignment('SalesEmployeeText', MntConst.eAlignmentLeft);
        this.context.riMaintenance.AddTableField('BusinessOriginCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableFieldAlignment('BusinessOriginCode', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('BusinessOriginDetailCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldAlignment('BusinessOriginDetailCode', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('WasteTransferTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableField('LeadEmployee', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableField('TaxCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableFieldAlignment('TaxCode', MntConst.eAlignmentRight);
        if (this.context.pageParams.vbEnableMultipleTaxRates) {
            this.context.iCABSAServiceCoverMaintenance5.AddMultipleTaxRates();
        }
        this.context.riMaintenance.AddTableField('PurchaseOrderNo', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PurchaseOrderExpiryDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('ServiceSpecialInstructions', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('LostBusinessRequestNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('WasteTransferChargeValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('WasteTransferUpdateValueInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('WasteTransferAddChargeInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('EFKReplacementMonth', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('ContractHasExpired', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('AutoRouteProductInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('GuaranteeRequired', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('GuaranteeCommence', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('GuaranteeCommence', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('GuaranteeExpiry', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('GuaranteeExpiry', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('NoGuaranteeCode', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('NumberBedrooms', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('AgeofProperty', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('ListedCode', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('IsTermiteProduct', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('WarrantyRenewalValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('WarrantyAPIAppliedInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('SuspendRenewalLetterInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('GraphNumber', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('AppointmentRequiredInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('ServiceAnnualTime', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('AnnualTimeChange', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('ComponentGridCacheTime', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DeliveryReleaseDate', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('DeliveryReleaseDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('RetainServiceCoverInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('ClientReference', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('TaxExemptionNumber', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.context.riExchange.getCurrentContractType() === 'C' && this.context.pageParams.vbEnableStandardTreatmentTime) {
            this.context.riMaintenance.AddTableField('StandardTreatmentTime', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            this.context.pageParams.uiDisplay.trStandardTreatmentTimeMandatory = true;
        }
        else if (this.context.riExchange.getCurrentContractType() === 'J' && this.context.pageParams.vbEnableStandardTreatmentTime) {
            this.context.riMaintenance.AddTableField('StandardTreatmentTime', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            this.context.pageParams.uiDisplay.trStandardTreatmentTimeMandatory = true;
        }
        else {
            this.context.riMaintenance.AddTableField('StandardTreatmentTime', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.pageParams.uiDisplay.trStandardTreatmentTimeMandatory = false;
        }
        if (this.context.riExchange.getCurrentContractType() === 'C' && this.context.pageParams.vbEnableInitialTreatmentTime) {
            this.context.pageParams.uiDisplay.trInitialTreatmentTime = true;
        }
        else {
            this.context.pageParams.uiDisplay.trInitialTreatmentTime = false;
        }
        this.context.riMaintenance.AddTableField('InitialTreatmentTime', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldAlignment('StandardTreatmentTime', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableFieldAlignment('InitialTreatmentTime', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('CallLogID', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.context.parentMode === 'Premise-Add') {
            if (this.context.attributes.RenegContract === 'true') {
                this.context.riMaintenance.AddTableField('RenegOldValue', MntConst.eTypeCurrency, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            }
            else {
                this.context.riMaintenance.AddTableField('RenegOldValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            }
        }
        else {
            this.context.riMaintenance.AddTableField('RenegOldValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.context.riMaintenance.AddTableField('RenegOldContract', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableField('RenegOldPremise', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        if (this.context.pageParams.vbEnableEntitlement && this.context.riExchange.getCurrentContractType() === 'C') {
            this.context.riMaintenance.AddTableField('EntitlementRequiredInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('EntitlementAnnivDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableFieldAlignment('EntitlementAnnivDate', MntConst.eAlignmentCenter);
            this.context.riMaintenance.AddTableField('EntitlementAnnualQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('EntitlementNextAnnualQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('EntitlementOrderedQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('EntitlementYTDQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('EntitlementPricePerUnit', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('EntitlementInvoicMntConst.eTypeCode', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Lookup');
            this.context.riMaintenance.AddTableField('EntitlementInvoiceTypeDesc', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableField('EntitlementServiceQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('MinCommitQty', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.context.riMaintenance.AddTableField('chkFOC', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('FOCInvoiceStartDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('FOCProposedAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('TrialPeriodInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('TrialPeriodStartDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('TrialPeriodStartDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('TrialPeriodEndDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldAlignment('TrialPeriodEndDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableField('TrialPeriodChargeValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('ProposedAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('TrialPeriodReleasedInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('AnnualCalendarInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('AnnualCalendarTemplateNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('CalendarTemplateName', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('CalendarUpdateAllowed', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('ClosedCalendarTemplateNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('TemplateName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly', '', 'ClosedTemplateName');
        this.context.riMaintenance.AddTableField('SubjectToUplift', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('UpliftVisitPosition', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('UpliftTemplateNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('UpliftTemplateName', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('RMMCategoryCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableFieldAlignment('RMMCategoryCode', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('RMMJobVisitValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('TotalFreeAddnlVisits', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('CurrentAddnlVisitCount', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('APICode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('SurveyDetail', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('WorkLoadIndex', MntConst.eTypeDecimal1, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        for (var iCounter = 1; iCounter <= 14; iCounter++) {
            this.context.riMaintenance.AddTableField('WindowStart' + this.context.ZeroPadInt(iCounter, 2), MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('WindowEnd' + this.context.ZeroPadInt(iCounter, 2), MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        for (var iCounter = 1; iCounter <= 7; iCounter++) {
            this.context.riMaintenance.AddTableField('WindowPreferredInd0' + iCounter, MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.context.riMaintenance.AddTableField('PreferredDayOfWeekReasonCode', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.context.riMaintenance.AddTableField('CustomerAvailTemplateID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('CustomerAvailTemplateDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Virtual');
        this.context.riMaintenance.AddTableField('AverageWeight', MntConst.eTypeDecimal1, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PriceChangeOnlyInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('CompositeProductInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('CompositePricingType', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('CompositeProductCode', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('CompositeSequence', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('CompositeCodeList', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('CompositeDescList', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        if (this.context.pageParams.vbEnableTimePlanning) {
            this.context.riMaintenance.AddTableField('SalesPlannedTime', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            this.context.riMaintenance.AddTableField('ActualPlannedTime', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            if (this.context.pageParams.vbShowInspectionPoint) {
                this.context.riMaintenance.AddTableField('InspectionPoints', MntConst.eTypeInteger, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
            }
            this.context.riMaintenance.AddTableFieldAlignment('SalesPlannedTime', MntConst.eAlignmentCenter);
            this.context.riMaintenance.AddTableFieldAlignment('ActualPlannedTime', MntConst.eAlignmentCenter);
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev) {
            this.context.riMaintenance.AddTableField('DepreciationPeriod', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('MinimumDuration', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('ExpiryDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        if (this.context.pageParams.blnEnableDOWSentricon && this.context.riExchange.getCurrentContractType() !== 'P') {
            this.context.riMaintenance.AddTableField('DOWSentriconInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('DOWProductCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('DOWInstallTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('DOWPerimeterValue', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('DOWRenewalDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        }
        this.context.riMaintenance.AddTableField('PerimeterValue', MntConst.eTypeInteger, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableField('PremiseDefaultTimesInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('ZeroValueIncInvoice', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('HardSlotType', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('HardSlotVisitTime', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('HardSlotInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('HardSlotTemplateNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('RoutingExclusionReason', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('CanUpdateBudgetDetails', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('BudgetNumberInstalments', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('BudgetInstalAmount', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('BudgetTermsDesc', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('BudgetBalance', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('DepositAddAdditional', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DepositExists', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DepositAmount', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DepositDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DepositAmountApplied', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DepositPostedDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('DepositCanAmend', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('ServiceNotifyInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldAlignment('HardSlotVisitTime', MntConst.eAlignmentCenter);
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeSelect
            && this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
            this.context.riMaintenance.AddTableCommit(this.context, function (data) {
                if (data && data.findResult === '<Multi>') {
                    this.context.serviceCoverSearch.openModal();
                    return;
                }
                else {
                    this.context.enableForm();
                    this.disableControl('ContractNumber', true);
                    this.disableControl('PremiseNumber', true);
                    this.disableControl('ProductCode', true);
                    this.context.disableControl('menu', false);
                    this.context.iCABSAServiceCoverMaintenanceLoad.continueTableLoad();
                }
            });
        }
        else {
            this.context.iCABSAServiceCoverMaintenanceLoad.continueTableLoad();
        }
    };
    ServiceCoverMaintenanceLoad.prototype.continueTableLoad = function () {
        this.context.riMaintenance.AddTable('*');
        this.context.riMaintenance.AddTableField('AverageUnitValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('AverageUnitValue', false);
        this.context.riMaintenance.AddTableField('PatternWarningString', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('PatternWarningString', false);
        this.context.riMaintenance.AddTableField('ServiceCoverInvTypeString', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('ServiceCoverInvTypeString', false);
        this.context.riMaintenance.AddTableField('RequiresWasteTransferType', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('RequiresWasteTransferType', false);
        this.context.riMaintenance.AddTableField('UnitDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('UnitDesc', false);
        this.context.riMaintenance.AddTableField('CustomerInfoAvailable', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('CustomerInfoAvailable', false);
        this.context.riMaintenance.AddTableField('Status', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('Status', false);
        this.context.riMaintenance.AddTableField('NewPremise', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('NewPremise', false);
        this.context.riMaintenance.AddTableField('QuantityChange', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('QuantityChange', false);
        this.context.riMaintenance.AddTableField('CurrentServiceCoverRowID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('CurrentServiceCoverRowID', false);
        this.context.riMaintenance.AddTableField('ForwardQuantityReduction', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('ForwardQuantityReduction', false);
        this.context.riMaintenance.AddTableField('InstallationRequired', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('InstallationRequired', false);
        this.context.riMaintenance.AddTableField('InactiveEffectDate', MntConst.eTypeDateText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('InactiveEffectDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableFieldPostData('InactiveEffectDate', false);
        this.context.riMaintenance.AddTableField('SCLostBusinessDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('SCLostBusinessDesc', false);
        this.context.riMaintenance.AddTableField('SCLostBusinessDesc2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('SCLostBusinessDesc2', false);
        this.context.riMaintenance.AddTableField('SCLostBusinessDesc3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('SCLostBusinessDesc3', false);
        this.context.riMaintenance.AddTableField('NextInvoiceValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('NextInvoiceValue', false);
        this.context.riMaintenance.AddTableField('ForwardDateChangeInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('ForwardDateChangeInd', false);
        this.context.riMaintenance.AddTableField('DetailRequired', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldPostData('DetailRequired', false);
        this.context.riMaintenance.AddTableField('InvoiceFrequencyCode', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('InvoiceFrequencyCode', false);
        this.context.riMaintenance.AddTableField('InvoiceAnnivDate', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('InvoiceAnnivDate', MntConst.eAlignmentCenter);
        this.context.riMaintenance.AddTableFieldPostData('InvoiceAnnivDate', false);
        this.context.riMaintenance.AddTableField('ServiceEmployeeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('ServiceEmployeeCode', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('UnitValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('ServiceAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.context.riMaintenance.AddTableField('ShowValueButton', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('ShowValueButton', false);
        this.context.riMaintenance.AddTableField('NegBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('NegBranchNumber', false);
        this.context.riMaintenance.AddTableField('chkRenegContract', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('StockOrderAllowed', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('chkStockOrder', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('FieldHideList', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('FieldHideList', false);
        this.context.riMaintenance.AddTableField('FieldShowList', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('FieldShowList', false);
        this.context.riMaintenance.AddTableField('FirstInvoicedDate', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('FirstInvoicedDate', false);
        this.context.riMaintenance.AddTableField('SavedServiceQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('SavedServiceQuantity', false);
        this.context.riMaintenance.AddTableField('PendingReduction', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('PendingDeletion', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('UnitValueChange', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('AnnualValueChange', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('RequiresManualVisitPlanningInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('UnConfirmedServiceQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('UnConfirmedServiceValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('UnConfirmedEffectiveDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldAlignment('UnConfirmedEffectiveDate', MntConst.eAlignmentCenter);
        if (this.context.riExchange.URLParameterContains('PendingReduction') || this.context.riExchange.URLParameterContains('PendingDeletion')) {
            this.context.riMaintenance.AddTableField('LostBusinessCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Lookup');
            this.context.riMaintenance.AddTableField('LostBusinessDetailCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Lookup');
        }
        this.context.riMaintenance.AddTableField('ErrorMessage', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldPostData('ErrorMessage', false);
        this.context.riMaintenance.AddTableField('ServiceVisitFrequencyCopy', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('ServiceVisitFrequencyCopy', false);
        this.context.riMaintenance.AddTableField('CalculatedVisits', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('CalculatedVisits', false);
        this.context.riMaintenance.AddTableField('VFPNumberOfWeeks', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('VFPNumberOfWeeks', false);
        this.context.riMaintenance.AddTableField('VFPNumberOfVisitsPerWeek', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('VFPNumberOfVisitsPerWeek', false);
        this.context.riMaintenance.AddTableField('VisitFrequencyWarningMessage', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('VisitFrequencyWarningMessage', false);
        this.context.riMaintenance.AddTableField('VisitFrequencyWarningColour', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('VisitFrequencyWarningColour', false);
        this.context.riMaintenance.AddTableField('CopiedVisitCycleInWeeks', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldPostData('CopiedVisitCycleInWeeks', false);
        this.context.riMaintenance.AddTableField('CopiedVisitsPerCycle', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('CopiedVisitsPerCycle', false);
        this.context.riMaintenance.AddTableField('CopiedVisitCycleInWeeksOverrideNote', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('CopiedVisitCycleInWeeksOverrideNote', false);
        this.context.riMaintenance.AddTableField('AccountNumber', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('AccountNumber', false);
        this.context.riMaintenance.AddTableField('InvoiceTypeVal', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.context.riMaintenance.AddTableField('InvoiceTypeDesc', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.context.riMaintenance.AddTableFieldPostData('InvoiceTypeVal', false);
        this.context.riMaintenance.AddTableFieldPostData('InvoiceTypeDesc', false);
        this.context.riMaintenance.AddTableField('InvoiceTypeNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.context.riMaintenance.AddTableField('NumberOfSeasons', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('FixedNumberOfSeasons', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.context.riMaintenance.AddTableField('FirstSeasonStartDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.context.riMaintenance.AddTableField('SeasonalTemplateNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('SeasonalBranchUpdate', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        for (var i = 1; i <= this.context.pageParams.SeasonalMaxNumberSeasons; i++) {
            this.context.riMaintenance.AddTableField('SeasonNumber' + i, MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('SeasonalFromDate' + i, MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('SeasonalFromWeek' + i, MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('SeasonalFromYear' + i, MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('SeasonalToDate' + i, MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('SeasonalToWeek' + i, MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('SeasonalToYear' + i, MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('SeasonNoOfVisits' + i, MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.context.riMaintenance.AddTableField('FOCMessageText', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('FOCMessageText', false);
        this.context.riMaintenance.AddTableField('WorkLoadIndexTotal', MntConst.eTypeDecimal1, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('WorkLoadIndexTotal', false);
        this.context.riMaintenance.AddTableField('MonthlyUnitPrice', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('MonthlyUnitPrice', false);
        this.context.riMaintenance.AddTableField('LinkedProductCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableFieldAlignment('LinkedProductCode', MntConst.eAlignmentRight);
        this.context.riMaintenance.AddTableField('LinkedServiceVisitFreq', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.context.riMaintenance.AddTableField('LinkedServiceCoverNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('LinkedProductDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.context.riMaintenance.AddTableFieldPostData('LinkedProductDesc', false);
        this.context.riMaintenance.AddTableField('ServiceBasis', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableFieldPostData('ServiceBasis', false);
        this.context.riMaintenance.AddTableField('FollowTemplateInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart01', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd01', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart02', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd02', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart03', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd03', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart04', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd04', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart05', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd05', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart06', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd06', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart07', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd07', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart08', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd08', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart09', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd09', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart10', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd10', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart11', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd11', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart12', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd12', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart13', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd13', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowStart14', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('DefaultWindowEnd14', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart01', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd01', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart02', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd02', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart03', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd03', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart04', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd04', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart05', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd05', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart06', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd06', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart07', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd07', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart08', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd08', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart09', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd09', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart10', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd10', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart11', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd11', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart12', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd12', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart13', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd13', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowStart14', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.context.riMaintenance.AddTableField('PremiseWindowEnd14', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.context.pageParams.vbEnableServiceCoverDispLev) {
            this.context.riMaintenance.AddTableField('MaterialsValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableFieldPostData('MaterialsValue', false);
            this.context.riMaintenance.AddTableField('MaterialsCost', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableFieldPostData('MaterialsCost', false);
            this.context.riMaintenance.AddTableField('LabourValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableFieldPostData('LabourValue', false);
            this.context.riMaintenance.AddTableField('LabourCost', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableFieldPostData('LabourCost', false);
            this.context.riMaintenance.AddTableField('ReplacementValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableFieldPostData('ReplacementValue', false);
            this.context.riMaintenance.AddTableField('WEDValue', MntConst.eTypeDecimal1, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableFieldPostData('WEDValue', false);
            this.context.riMaintenance.AddTableField('PricePerWED', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableFieldPostData('PricePerWED', false);
            this.context.riMaintenance.AddTableField('ReplacementCost', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddTableFieldPostData('ReplacementCost', false);
            this.context.riMaintenance.AddTableField('ReplacementIncludeInd', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
            if (this.context.riExchange.URLParameterContains('PendingReduction') || this.context.riExchange.URLParameterContains('PendingDeletion')) {
                this.context.riMaintenance.AddTableField('riGridHandle', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            }
        }
        this.context.riMaintenance.AddTableField('LOSName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('HardSlotUpdate', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('HardSlotVersionNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.context.riMaintenance.AddTableField('RMMCategoryDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        if (this.context.pageParams.vbEnableWeeklyVisitPattern) {
            this.context.riMaintenance.AddTableField('VisitPatternEffectiveDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableFieldAlignment('VisitPatternEffectiveDate', MntConst.eAlignmentCenter);
            this.context.riMaintenance.AddTableField('AutoAllocation', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.context.riMaintenance.AddTableField('VisitPatternRowID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            for (var iCounter = 1; iCounter <= 7; iCounter++) {
                this.context.riMaintenance.AddTableField('VisitOnDay' + iCounter, MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
                this.context.riMaintenance.AddTableField('BranchServiceAreaCode' + iCounter, MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            }
        }
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeSelect &&
            this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
            this.context.riMaintenance.AddTableCommit(this.context, function (data) {
                if (this.context.riMaintenance.CurrentMode !== MntConst.eModeSelect) {
                    this.context.iCABSAServiceCoverMaintenanceLoadVTs.LoadVirtualTables();
                }
                this.context.iCABSAServiceCoverMaintenance7.GuaranteeToggle();
                this.context.riMaintenance.Complete();
                if (this.context.pageParams.vSCPORefsAtServiceCover) {
                    this.context.pageParams.uiDisplay.trPurchaseOrderDetails = true;
                }
                if (!this.context.pageParams.vSCEnableTechDiary) {
                    this.context.pageParams.uiDisplay.cmdDiaryView = false;
                }
                this.context.pageParams.ServiceCoverRowID = this.context.getControlValue('CurrentServiceCoverRowID');
                this.context.setControlValue('ServiceCoverROWID', this.context.pageParams.ServiceCoverRowID);
            });
        }
        else {
            this.context.riMaintenance.setIndependentVTableLookup(true);
            this.context.iCABSAServiceCoverMaintenanceLoadVTs.LoadVirtualTables();
        }
    };
    ServiceCoverMaintenanceLoad.prototype.load1 = function () {
        this.context.pageParams.blnUseVisitCycleValues = this.context.pageParams.vbEnableWeeklyVisitPattern;
        if (!this.context.pageParams.blnUseVisitCycleValues) {
            this.context.pageParams.uiDisplay.trServiceVisitFrequencyCopy = false;
            this.context.pageParams.uiDisplay.trServiceVisitCycleFields1 = false;
            this.context.pageParams.uiDisplay.trServiceVisitCycleFields2 = false;
            this.context.pageParams.uiDisplay.trServiceVisitCycleFields3 = false;
            this.context.pageParams.uiDisplay.trStaticVisit = false;
        }
        if (!this.context.pageParams.vbEnableDepositProcessing) {
            this.context.pageParams.uiDisplay.trDepositLine1 = false;
            this.context.pageParams.uiDisplay.trDepositLine2 = false;
            this.context.pageParams.uiDisplay.trDepositLine3 = false;
            this.context.pageParams.uiDisplay.trDepositLine4 = false;
        }
        ;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelServiceBasis');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selHardSlotType');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdHardSlotCalendar');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdDiaryView');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelSubjectToUplift');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelUpliftVisitPosition');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoAllocation');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'SelAutoPattern');
        this.context.iCABSAServiceCoverMaintenance3.SetQuickWindowSetValue('D');
        this.context.iCABSAServiceCoverMaintenance7.HideQuickWindowSet(true);
        this.context.iCABSAServiceCoverMaintenance7.CreateTabs();
        if (this.context.riMaintenance.RecordSelected(false)) {
            this.context.riMaintenance.FetchRecord();
        }
        if (this.context.parentMode === 'ContactUpdate') {
            if (this.context.riExchange.getParentHTMLValue('ServiceCoverRowID') === '') {
                this.context.riMaintenance.SelectMode();
            }
            else {
                this.context.riMaintenance.UpdateMode();
            }
        }
        if (this.context.parentMode === 'GeneralSearch') {
            this.context.riMaintenance.RowID(this.context.uiForm, 'ServiceCover', this.context.riExchange.getParentAttributeValue('RowID'));
            this.context.riMaintenance.FetchRecord();
        }
        if (this.context.parentMode === 'ContractPOExpiryGrid') {
            this.context.riMaintenance.RowID(this.context.uiForm, 'ServiceCover', this.context.riExchange.getParentAttributeValue('RowID'));
            this.context.riMaintenance.FetchRecord();
            this.context.riMaintenance.FunctionAdd = false;
            this.context.riMaintenance.FunctionSelect = false;
            this.context.riMaintenance.FunctionUpdate = false;
        }
        ;
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'BudgetValidInstalments');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'InvoiceFrequencyCode');
        this.context.pageParams.dtInvoiceAnnivDate.disabled = true;
        if (this.context.parentMode !== 'Request' && (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RunningReadOnly') !== 'yes')) {
            this.context.iCABSAServiceCoverMaintenance7.BuildMenuOptions();
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RunningReadOnly') === 'yes') {
            this.context.pageParams.menu = false;
        }
        if (this.context.pageParams.vbEnableTimePlanning) {
            this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'SalesPlannedTime');
        }
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'InvTypeSel');
            this.context.iCABSAServiceCoverMaintenance1.riMaintenance_AfterFetch();
        }
        if (this.context.parentMode === 'TrialPeriod') {
            this.context.renderTab(12);
        }
        this.context.pageParams.vbEnableRouteOptimisation = this.context.pageParams.vEnableRouteOptimisation;
        if (this.context.pageParams.vbEnableRouteOptimisation !== true) {
            this.context.pageParams.uiDisplay.trAutoRouteProductInd = false;
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'RunningReadOnly') === 'yes') {
            this.context.riMaintenance.FunctionAdd = false;
            this.context.riMaintenance.FunctionSelect = false;
            this.context.riMaintenance.FunctionDelete = false;
            this.context.riMaintenance.FunctionUpdate = false;
            this.context.riMaintenance.FunctionSnapShot = false;
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')) {
            this.context.iCABSAServiceCoverMaintenance3.ShowAverageWeight();
        }
        if (this.context.pageParams.vbEnableTimePlanning) {
            if (this.context.pageParams.vbShowInspectionPoint) {
                this.context.pageParams.uiDisplay.trInspectionPoints = true;
            }
            else {
                this.context.pageParams.uiDisplay.trInspectionPoints = false;
            }
            this.context.pageParams.uiDisplay.trSalesPlannedTime = true;
            this.context.pageParams.uiDisplay.trActualPlannedTime = true;
        }
        else {
            this.context.pageParams.uiDisplay.trInspectionPoints = false;
            this.context.pageParams.uiDisplay.trSalesPlannedTime = false;
            this.context.pageParams.uiDisplay.trActualPlannedTime = false;
        }
        if (this.context.pageParams.vSCRepeatSalesMatching) {
            this.context.pageParams.uiDisplay.trMatchedContract = true;
            this.context.pageParams.uiDisplay.trMatchedPremise = true;
        }
        else {
            this.context.pageParams.uiDisplay.trMatchedContract = false;
            this.context.pageParams.uiDisplay.trMatchedPremise = false;
        }
        this.context.iCABSAServiceCoverMaintenance3.BuildTaxCodeCombo();
        if (!this.context.pageParams.lAllowUserAuthUpdate) {
            this.context.riMaintenance.FunctionAdd = false;
            this.context.riMaintenance.FunctionUpdate = false;
            this.context.riMaintenance.FunctionDelete = false;
        }
        ;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProspectNumber')) {
            this.context.riMaintenance.FunctionAdd = true;
        }
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DepositCanAmend') !== 'Y') {
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositDate');
            this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositAmount');
        }
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositAmountApplied');
        this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'DepositPostedDate');
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OriBranchServiceAreaCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'BranchServiceAreaCode'));
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    };
    return ServiceCoverMaintenanceLoad;
}());
