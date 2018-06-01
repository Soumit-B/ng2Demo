var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ICABSBAPICodeSearchComponent } from './../../search/iCABSBAPICodeSearchComponent';
import { CalendarTemplateSearchComponent } from './../../search/iCABSBCalendarTemplateSearch.component';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { EmployeeSearchComponent } from './../../search/iCABSBEmployeeSearch';
import { DeportSearchComponent } from './../../search/iCABSBDepotSearch.component';
import { ProductSearchGridComponent } from './../../search/iCABSBProductSearch';
import { BranchServiceAreaSearchComponent } from './../../search/iCABSBBranchServiceAreaSearch';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { ServiceCoverSearchComponent } from './../../search/iCABSAServiceCoverSearch';
import { ClosedTemplateSearchComponent } from './../../search/iCABSBClosedTemplateSearch.component';
import { PremiseSearchComponent } from './../../search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../search/iCABSAContractSearch';
import { ServiceCoverMaintenanceLoadVTs } from './iCABSAServiceCoverMaintenanceLoadVTs';
import { ServiceCoverMaintenanceLoad } from './iCABSAServiceCoverMaintenanceLoad';
import { ServiceCoverMaintenance6 } from './iCABSAServiceCoverMaintenance6';
import { ServiceCoverMaintenance5 } from './iCABSAServiceCoverMaintenance5';
import { ServiceCoverMaintenance4 } from './iCABSAServiceCoverMaintenance4';
import { ServiceCoverMaintenance3 } from './iCABSAServiceCoverMaintenance3';
import { ServiceCoverMaintenance2 } from './iCABSAServiceCoverMaintenance2';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ServiceCoverMaintenance7 } from './iCABSAServiceCoverMaintenance7';
import { ServiceCoverMaintenance8 } from './iCABSAServiceCoverMaintenance8';
import { ServiceCoverMaintenance1 } from './iCABSAServiceCoverMaintenance1';
import { Component, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
export var ServiceCoverMaintenanceComponent = (function (_super) {
    __extends(ServiceCoverMaintenanceComponent, _super);
    function ServiceCoverMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.Mode = { ADD: 1, UPDATE: 2 };
        this.inputParamsContractSearch = {
            'parentMode': 'LookUp',
            'accountNumber': '',
            'currentContractType': 'C'
        };
        this.promptTitle = 'Confirm Record?';
        this.promptContent = '';
        this.inputParamsDepotSearch = { 'parentMode': 'LookUp' };
        this.inputParamsClosedTemp = {
            'parentMode': 'LookUp-AllAccessCalendarServiceCover'
        };
        this.inputParamsAnnualTemp = {
            'parentMode': 'LookUp'
        };
        this.inputParamsAccountPremise = {
            'parentMode': 'LookUp',
            'currentContractType': 'P',
            'ContractNumber': '',
            'showAddNew': false
        };
        this.inputRenegPremiseSearch = {
            'parentMode': 'LookUp',
            'currentContractType': 'P',
            'ContractNumber': '',
            'showAddNew': false
        };
        this.serviceCoverSearchParams = {
            'parentMode': 'Search',
            'ContractNumber': '',
            'PremiseNumber': '',
            'showAddNew': true
        };
        this.employeeSearchParams = {
            'parentMode': 'LookUp-ServiceBranchEmployee'
        };
        this.installEmployeeSearchParams = {
            'parentMode': 'LookUp-InstallationEmployee'
        };
        this.removalEmployeeSearchParams = {
            'parentMode': 'LookUp-RemovalEmployee'
        };
        this.LeadEmployeeSearchParams = {
            'parentMode': 'LookUp-LeadEmployee'
        };
        this.branchServiceAreaSearchParams = {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            showAddNew: false,
            autoOpenSearch: false,
            parentMode: 'LookUp-SC'
        };
        this.APICodeSearchParams = {
            'parentMode': 'LookUp'
        };
        this.saveClicked = false;
        this.initialLoad = true;
        this.initialising = true;
        this.itemsPerPage = 10;
        this.pageId = '';
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'AccountNumber', readonly: false, disabled: true, required: false },
            { name: 'InvoiceFrequencyCode', readonly: false, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'ProductCode', readonly: false, disabled: false, required: false },
            { name: 'ProductDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'Status', readonly: false, disabled: true, required: false },
            { name: 'InactiveEffectDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDateText },
            { name: 'ServiceBranchNumber', readonly: false, disabled: true, required: false },
            { name: 'BranchName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'SCLostBusinessDesc', readonly: false, disabled: true, required: false },
            { name: 'SCLostBusinessDesc2', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'SCLostBusinessDesc3', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'LastChangeEffectDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'ServiceVisitFrequency', readonly: false, disabled: false, required: false },
            { name: 'FOCProposedAnnualValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'ServiceQuantity', readonly: false, disabled: false, required: false },
            { name: 'WasteTransferChargeValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'UnitValue', readonly: false, disabled: false, required: false },
            { name: 'ServiceAnnualValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'UnConfirmedEffectiveDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
            { name: 'UnConfirmedServiceQuantity', readonly: false, disabled: true, required: false },
            { name: 'UnConfirmedServiceValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'AverageUnitValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'UnitValueChange', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'AnnualValueChange', readonly: false, disabled: false, required: false, type: MntConst.eTypeText, value: '' },
            { name: 'LostBusinessCode', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'LostBusinessDetailCode', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessDetailDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InitialValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'InstallationValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '0.00' },
            { name: 'OutstandingInstallations', readonly: false, disabled: false, required: false },
            { name: 'RemovalValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '0.00' },
            { name: 'OutstandingRemovals', readonly: false, disabled: false, required: false },
            { name: 'MonthlyUnitPrice', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'WorkLoadIndex', readonly: false, disabled: true, required: false },
            { name: 'WorkLoadIndexTotal', readonly: false, disabled: true, required: false },
            { name: 'LinkedProductCode', readonly: false, disabled: false, required: false },
            { name: 'LinkedProductDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'LinkedServiceVisitFreq', readonly: false, disabled: true, required: false },
            { name: 'WeighingRequiredInd', readonly: false, disabled: false, required: false },
            { name: 'AverageWeight', readonly: false, disabled: false, required: false },
            { name: 'CompositeSequence', readonly: false, disabled: false, required: false },
            { name: 'MinimumDuration', readonly: false, disabled: false, required: false },
            { name: 'PerimeterValue', readonly: false, disabled: false, required: false },
            { name: 'WarrantyRenewalValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'ServiceSalesEmployee', readonly: false, disabled: false, required: false },
            { name: 'EmployeeSurname', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'SalesEmployeeText', readonly: false, disabled: false, required: false },
            { name: 'LeadEmployee', readonly: false, disabled: false, required: false },
            { name: 'LeadEmployeeSurname', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'RenegOldContract', readonly: false, disabled: false, required: false },
            { name: 'RenegOldPremise', readonly: false, disabled: false, required: false },
            { name: 'RenegOldValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'RoutingExclusionReason', readonly: false, disabled: false, required: false },
            { name: 'ClientReference', readonly: false, disabled: false, required: false },
            { name: 'PurchaseOrderNo', readonly: false, disabled: false, required: false },
            { name: 'DOWInstallTypeCode', readonly: false, disabled: false, required: false },
            { name: 'DOWInstallTypeDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'DOWProductCode', readonly: false, disabled: false, required: false },
            { name: 'DOWProductDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'DOWPerimeterValue', readonly: false, disabled: false, required: false },
            { name: 'MatchedContractNumber', readonly: false, disabled: true, required: false },
            { name: 'MatchedContractName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'MatchedPremiseNumber', readonly: false, disabled: true, required: false },
            { name: 'MatchedPremiseName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InspectionPoints', readonly: false, disabled: false, required: false },
            { name: 'SalesPlannedTime', readonly: false, disabled: false, required: false },
            { name: 'ActualPlannedTime', readonly: false, disabled: false, required: false },
            { name: 'AnnualCalendarTemplateNumber', readonly: false, disabled: false, required: false },
            { name: 'CalendarTemplateName', readonly: false, disabled: true, required: false },
            { name: 'StandardTreatmentTime', readonly: false, disabled: false, required: false },
            { name: 'ClosedCalendarTemplateNumber', readonly: false, disabled: false, required: false },
            { name: 'ClosedTemplateName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InitialTreatmentTime', readonly: false, disabled: false, required: false },
            { name: 'ServiceAnnualTime', readonly: false, disabled: false, required: false },
            { name: 'AnnualTimeChange', readonly: false, disabled: false, required: false },
            { name: 'HardSlotVisitTime', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'ServiceVisitFrequencyCopy', readonly: false, disabled: true, required: false },
            { name: 'VisitCycleInWeeks', readonly: false, disabled: false, required: false },
            { name: 'VisitCycleInWeeksOverrideNote', readonly: false, disabled: true, required: false },
            { name: 'VisitsPerCycle', readonly: false, disabled: true, required: false },
            { name: 'CalculatedVisits', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'ServiceEmployeeCode', readonly: false, disabled: true, required: false },
            { name: 'ServiceEmployeeSurname', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InstallationEmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'InstallationEmployeeName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'RemovalEmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'RemovalEmployeeName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'EFKReplacementMonth', readonly: false, disabled: false, required: false },
            { name: 'GraphNumber', readonly: false, disabled: false, required: false },
            { name: 'RMMCategoryCode', readonly: false, disabled: false, required: false },
            { name: 'RMMCategoryDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'TotalFreeAddnlVisits', readonly: false, disabled: false, required: false },
            { name: 'RMMJobVisitValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'CurrentAddnlVisitCount', readonly: false, disabled: false, required: false },
            { name: 'GuaranteeCommence', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
            { name: 'GuaranteeExpiry', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
            { name: 'NoGuaranteeCode', readonly: false, disabled: false, required: false },
            { name: 'NoGuaranteeDescription', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'AgeOfProperty', readonly: false, disabled: false, required: false },
            { name: 'ListedCode', readonly: false, disabled: false, required: false },
            { name: 'ListedDescription', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'NumberBedrooms', readonly: false, disabled: false, required: false },
            { name: 'NumberOfSeasons', readonly: false, disabled: false, required: false },
            { name: 'SeasonalTemplateNumber', readonly: false, disabled: false, required: false },
            { name: 'TemplateName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'SeasonNumber', readonly: false, disabled: false, required: false },
            { name: 'DepotNumber', readonly: false, disabled: false, required: false },
            { name: 'DepotName', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'SeasonalFromWeek', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'SeasonalFromYear', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'SeasonalToWeek', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'SeasonalToYear', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'SeasonalFromDate', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'BudgetNumberInstalments', readonly: false, disabled: false, required: false },
            { name: 'CanUpdateBudgetDetails', readonly: false, disabled: false, required: false },
            { name: 'NextInvoiceStartDate', readonly: false, disabled: true, required: false },
            { name: 'BudgetValidInstalments', readonly: false, disabled: false, required: false },
            { name: 'NextInvoiceEndDate', readonly: false, disabled: true, required: false },
            { name: 'BudgetInstalAmount', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'NextInvoiceValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'BudgetTermsDesc', readonly: false, disabled: true, required: false },
            { name: 'ForwardDateChangeInd', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'BudgetBalance', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'DepositAmount', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'InvoiceReleasedDate', readonly: false, disabled: true, required: false },
            { name: 'DepositAmountApplied', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'DepositPostedDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
            { name: 'TaxExemptionNumber', readonly: false, disabled: false, required: false },
            { name: 'MultipleTaxRates', readonly: false, disabled: false, required: false },
            { name: 'ConsolidateEqualTaxRates', readonly: false, disabled: false, required: false },
            { name: 'TaxCodeMaterials', readonly: false, disabled: false, required: false },
            { name: 'SurveyDetail', readonly: false, disabled: false, required: false },
            { name: 'TaxCodeMaterialsDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InvoiceTextMaterials', readonly: false, disabled: false, required: false },
            { name: 'TaxCodeLabour', readonly: false, disabled: false, required: false },
            { name: 'TaxCodeLabourDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InvoiceTextLabour', readonly: false, disabled: false, required: false },
            { name: 'TaxCodeReplacement', readonly: false, disabled: false, required: false },
            { name: 'TaxCodeReplacementDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InvoiceTextReplacement', readonly: false, disabled: false, required: false },
            { name: 'APICode', readonly: false, disabled: false, required: false },
            { name: 'APICodeDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InvoiceSuspendText', readonly: false, disabled: true, required: false },
            { name: 'EntitlementInvoiceTypeCode', readonly: false, disabled: false, required: false },
            { name: 'EntitlementInvoiceTypeDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'ServiceSpecialInstructions', readonly: false, disabled: false, required: false },
            { name: 'EntitlementAnnualQuantity', readonly: false, disabled: false, required: false },
            { name: 'EntitlementNextAnnualQuantity', readonly: false, disabled: false, required: false },
            { name: 'EntitlementOrderedQuantity', readonly: false, disabled: true, required: false },
            { name: 'EntitlementYTDQuantity', readonly: false, disabled: true, required: false },
            { name: 'EntitlementServiceQuantity', readonly: false, disabled: false, required: false },
            { name: 'EntitlementPricePerUnit', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'UnitDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'TrialPeriodStartDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
            { name: 'ProposedAnnualValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'TrialPeriodChargeValue', readonly: false, disabled: false, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'WindowStart01', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd01', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart08', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd08', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart02', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd02', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart09', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd09', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart03', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd03', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart10', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd10', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart04', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd04', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart11', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd11', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart05', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd05', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart12', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd12', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart06', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd06', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart13', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd13', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart07', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd07', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowStart14', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'WindowEnd14', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'MaterialsValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'MaterialsCost', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'LabourValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'LabourCost', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'ReplacementValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'ReplacementCost', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'WedValue', readonly: false, disabled: true, required: false },
            { name: 'PricePerWED', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency, value: '' },
            { name: 'rsPlantReplaceInd', readonly: false, disabled: true, required: false },
            { name: 'DepreciationPeriod', readonly: false, disabled: false, required: false },
            { name: 'ShowValueButton', readonly: false, disabled: true, required: false },
            { name: 'ForwardQuantityReduction', readonly: false, disabled: true, required: false },
            { name: 'InstallationRequired', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'RequireAnnualTimeInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'FieldHideList', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'FieldShowList', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'FirstInvoicedDate', readonly: false, disabled: true, required: false },
            { name: 'CurrentServiceCoverRowID', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'DetailRequired', readonly: false, disabled: false, required: false },
            { name: 'LostBusinessRequestNumber', readonly: false, disabled: false, required: false },
            { name: 'NegBranchNumber', readonly: false, disabled: true, required: false },
            { name: 'NewPremise', readonly: false, disabled: true, required: false },
            { name: 'QuantityChange', readonly: false, disabled: true, required: false },
            { name: 'SavedServiceQuantity', readonly: false, disabled: true, required: false },
            { name: 'PendingReduction', readonly: false, disabled: true, required: false },
            { name: 'PendingDeletion', readonly: false, disabled: true, required: false },
            { name: 'GenContractNumber', readonly: false, disabled: false, required: false },
            { name: 'GenPremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'ErrorMessage', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'NationalAccountChecked', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false, ignoreSubmit: true },
            { name: 'NationalAccount', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false, ignoreSubmit: true },
            { name: 'PatternWarningString', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'CustomerInfoAvailable', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false, ignoreSubmit: true },
            { name: 'InvoiceTypeVal', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InvoiceTypeDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'InvoiceTypeNumber', readonly: false, disabled: true, required: false },
            { name: 'FixedNumberOfSeasons', readonly: false, disabled: true, required: false },
            { name: 'FirstSeasonStartDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
            { name: 'FOCMessageText', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'ServiceBasis', readonly: false, disabled: true, required: false },
            { name: 'VisitFrequencyWarningMessage', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'VisitFrequencyWarningColour', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'VFPNumberOfWeeks', readonly: false, disabled: true, required: false },
            { name: 'VFPNumberOfVisitsPerWeek', readonly: false, disabled: true, required: false },
            { name: 'CalendarUpdateAllowed', readonly: false, disabled: true, required: false },
            { name: 'LeadInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'RunningReadOnly', readonly: false, disabled: false, required: false },
            { name: 'CallLogID', readonly: false, disabled: false, required: false },
            { name: 'CurrentCallLogID', readonly: false, disabled: false, required: false },
            { name: 'WindowClosingName', readonly: false, disabled: false, required: false },
            { name: 'ClosedWithChanges', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'LinkedServiceCoverNumber', readonly: false, disabled: false, required: false },
            { name: 'SelectedComponent', readonly: false, disabled: false, required: false },
            { name: 'ComponentGridCacheTime', readonly: false, disabled: false, required: false },
            { name: 'CompositePricingType', readonly: false, disabled: true, required: false },
            { name: 'CompositeProductCode', readonly: false, disabled: true, required: false },
            { name: 'CompositeCodeList', readonly: false, disabled: true, required: false },
            { name: 'CompositeDescList', readonly: false, disabled: true, required: false },
            { name: 'DetailRequiredInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false, ignoreSubmit: true },
            { name: 'SelectChange', readonly: false, disabled: false, required: false },
            { name: 'TaxCode', readonly: false, disabled: false, required: false },
            { name: 'EmployeeLimitChildDrillOptions', readonly: false, disabled: false, required: false },
            { name: 'DisplayLevelInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false, ignoreSubmit: true },
            { name: 'ExcludeUnConfirmedValues', readonly: false, disabled: false, required: false },
            { name: 'DeliveryConfirmationInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false, ignoreSubmit: true },
            { name: 'CalcAnnualValue', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'CalcAnnualValueChange', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'VisitTriggered', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'OriBranchServiceAreaCode', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'MessageDisplay', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'TaxDesc', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'PNOL', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false, ignoreSubmit: true },
            { name: 'BranchServiceAreaSeqNo', readonly: false, disabled: false, required: false },
            { name: 'ServiceTypeCode', readonly: false, disabled: true, required: false },
            { name: 'IsTermiteProduct', readonly: false, disabled: false, required: false },
            { name: 'InvTypeSel', readonly: false, disabled: false, required: false },
            { name: 'InitialInvoicePeriodInYears', readonly: false, disabled: false, required: false },
            { name: 'LocationsEnabled', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false, ignoreSubmit: true },
            { name: 'ValueRequiredInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'LOSName', readonly: false, disabled: true, required: false },
            { name: 'HardSlotType', readonly: false, disabled: false, required: false },
            { name: 'selTaxCode', readonly: false, disabled: false, required: false },
            { name: 'HardSlotTemplateNumber', readonly: false, disabled: false, required: false },
            { name: 'HardSlotVersionNumber', readonly: false, disabled: true, required: false },
            { name: 'HardSlotEffectDate', readonly: false, disabled: false, required: false },
            { name: 'InvoiceUnitValueRequired', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'ServiceCoverInvTypeString', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'SubjectToUplift', readonly: false, disabled: false, required: false },
            { name: 'UpliftVisitPosition', readonly: false, disabled: false, required: false },
            { name: 'AutoAllocation', readonly: false, disabled: false, required: false },
            { name: 'AutoPattern', readonly: false, disabled: true, required: false },
            { name: 'ValidateServiceArea', readonly: false, disabled: false, required: false },
            { name: 'TodayDate', readonly: false, disabled: false, required: false },
            { name: 'VisitOnDayCount', readonly: false, disabled: false, required: false },
            { name: 'VisitPatternRowID', readonly: false, disabled: false, required: false },
            { name: 'ChangeDateInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'ReplacementIncludeInd', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'CapableOfUplift', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'CopiedVisitCycleInWeeks', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'CopiedVisitsPerCycle', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'CopiedVisitCycleInWeeksOverrideNote', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'ShowFreeCallouts', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'PremiseWindowStart01', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd01', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart02', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd02', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart03', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd03', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart04', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd04', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart05', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd05', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart06', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd06', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart07', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd07', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart08', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd08', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart09', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd09', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart10', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd10', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart11', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd11', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart12', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd12', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart13', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd13', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowStart14', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'PremiseWindowEnd14', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart01', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd01', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart02', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd02', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart03', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd03', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart04', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd04', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart05', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd05', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart06', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd06', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart07', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd07', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart08', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd08', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart09', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd09', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart10', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd10', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart11', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd11', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart12', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd12', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart13', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd13', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowStart14', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'DefaultWindowEnd14', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
            { name: 'ServiceCoverROWID', readonly: false, disabled: false, required: false },
            { name: 'DispenserInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false, ignoreSubmit: true },
            { name: 'ConsumableInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'ContractTypeCode', readonly: false, disabled: false, required: false },
            { name: 'cmdCopyServiceCover', readonly: false, disabled: true, required: false, ignoreSubmit: true },
            { name: 'SelectCompositeProductCode', readonly: false, disabled: false, required: false },
            { name: 'cmdValue', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'cmdHardSlotCalendar', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'cmdDiaryView', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'SelServiceBasis', readonly: false, disabled: false, required: false },
            { name: 'SelSubjectToUplift', readonly: false, disabled: false, required: false },
            { name: 'SelUpliftVisitPosition', readonly: false, disabled: false, required: false },
            { name: 'selHardSlotType', readonly: false, disabled: false, required: false },
            { name: 'SelAutoPattern', readonly: false, disabled: false, required: false },
            { name: 'SelAutoAllocation', readonly: false, disabled: false, required: false },
            { name: 'selQuickWindowSet1', readonly: false, disabled: false, required: false },
            { name: 'selQuickWindowSet2', readonly: false, disabled: false, required: false },
            { name: 'selQuickWindowSet3', readonly: false, disabled: false, required: false },
            { name: 'selQuickWindowSet4', readonly: false, disabled: false, required: false },
            { name: 'selQuickWindowSet5', readonly: false, disabled: false, required: false },
            { name: 'selQuickWindowSet6', readonly: false, disabled: false, required: false },
            { name: 'selQuickWindowSet7', readonly: false, disabled: false, required: false },
            { name: 'menu', readonly: false, disabled: true, required: false, value: 'Options', ignoreSubmit: true },
            { name: 'InvoiceAnnivDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
            { name: 'ServiceCommenceDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'FOCInvoiceStartDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'ExpiryDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'PurchaseOrderExpiryDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'DOWRenewalDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
            { name: 'ServiceVisitAnnivDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'InstallationDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'RemovalDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'VisitPatternEffectiveDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'DeliveryReleaseDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
            { name: 'DepositDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'EntitlementAnnivDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'TrialPeriodEndDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
            { name: 'BusinessOriginCode', readonly: false, disabled: false, required: false },
            { name: 'WasteTransferTypeCode', readonly: false, disabled: false, required: false },
            { name: 'chkRenegContract', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'StockOrderAllowed', readonly: false, disabled: false, required: false },
            { name: 'chkStockOrder', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'RequiresManualVisitPlanningInd', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'SeasonalBranchUpdate', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'FollowTemplateInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'HardSlotUpdate', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'SeasonalServiceInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'InstallByBranchInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'InvoiceSuspendInd', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'InvoiceOnFirstVisitInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'InvoiceReleasedInd', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'RetainServiceWeekdayInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WasteTransferUpdateValueInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WasteTransferAddChargeInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'ContractHasExpired', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'AutoRouteProductInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'GuaranteeRequired', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WarrantyAPIAppliedInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'SuspendRenewalLetterInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'AppointmentRequiredInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'RetainServiceCoverInd', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'EntitlementRequiredInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'MinCommitQty', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'chkFOC', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'TrialPeriodInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'TrialPeriodReleasedInd', readonly: false, disabled: true, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'AnnualCalendarInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WindowPreferredInd01', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WindowPreferredInd02', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WindowPreferredInd03', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WindowPreferredInd04', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WindowPreferredInd05', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WindowPreferredInd06', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'WindowPreferredInd07', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'PriceChangeOnlyInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'CompositeProductInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'PremiseDefaultTimesInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'ZeroValueIncInvoice', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'HardSlotInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'ServiceNotifyInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'DOWSentriconInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'RequireExemptNumberInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'ContractTrialPeriodInd', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'VisitOnDay1', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'VisitOnDay2', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'VisitOnDay3', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'VisitOnDay4', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'VisitOnDay5', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'VisitOnDay6', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'VisitOnDay7', readonly: false, disabled: false, required: false, type: MntConst.eTypeCheckBox, value: false },
            { name: 'BranchServiceAreaCode1', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaCode2', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaCode3', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaCode4', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaCode5', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaCode6', readonly: false, disabled: false, required: false },
            { name: 'BranchServiceAreaCode7', readonly: false, disabled: false, required: false },
            { name: 'CustomerAvailTemplateID', readonly: false, disabled: false, required: false },
            { name: 'PreferredDayOfWeekReasonCode', readonly: false, disabled: false, required: false },
            { name: 'cmdCustomerInfo', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'cmdComponentSelAll', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'cmdComponentDesAll', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'cmdCalculate', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'btnDepositAdd', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'btnDefaultValue', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'cmdRefreshDisplayVal', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'save', readonly: false, disabled: false, required: false, ignoreSubmit: true },
            { name: 'cancel', readonly: false, disabled: false, required: false, ignoreSubmit: true }
        ];
        this.xhrParams = {
            module: 'service-cover',
            method: 'contract-management/maintenance',
            operation: 'Application/iCABSAServiceCoverMaintenance'
        };
        this.uiDisplay = {
            tab: {
                tab1: { visible: false, active: true },
                tab2: { visible: false, active: false },
                tab3: { visible: false, active: false },
                tab4: { visible: false, active: false },
                tab5: { visible: false, active: false },
                tab6: { visible: false, active: false },
                tab7: { visible: false, active: false },
                tab8: { visible: false, active: false },
                tab9: { visible: false, active: false },
                tab10: { visible: false, active: false },
                tab11: { visible: false, active: false },
                tab12: { visible: false, active: false },
                tab13: { visible: false, active: false },
                tab14: { visible: false, active: false },
                tab15: { visible: false, active: false }
            }
        };
        this.contractSearchComponent = ContractSearchComponent;
        this.DeportSearchComponent = DeportSearchComponent;
        this.branchServiceAreaComponent = BranchServiceAreaSearchComponent;
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.apiSearchComponent = ICABSBAPICodeSearchComponent;
        this.dateObj = {
            InvoiceAnnivDate: {
                InvoiceAnnivDateDT: null,
                isDisabled: true
            }
        };
        this.context = this;
        this.parent = this;
        this.pageId = PageIdentifier.ICABSASERVICECOVERMAINTENANCE;
        this.setMessageCallback(this);
        this.setURLQueryParameters(this);
        this.iCABSAServiceCoverMaintenance1 = new ServiceCoverMaintenance1(this, injector);
        this.iCABSAServiceCoverMaintenance2 = new ServiceCoverMaintenance2(this, injector);
        this.iCABSAServiceCoverMaintenance3 = new ServiceCoverMaintenance3(this, injector);
        this.iCABSAServiceCoverMaintenance4 = new ServiceCoverMaintenance4(this, injector);
        this.iCABSAServiceCoverMaintenance5 = new ServiceCoverMaintenance5(this, injector);
        this.iCABSAServiceCoverMaintenance6 = new ServiceCoverMaintenance6(this, injector);
        this.iCABSAServiceCoverMaintenance7 = new ServiceCoverMaintenance7(this);
        this.iCABSAServiceCoverMaintenance8 = new ServiceCoverMaintenance8(this);
        this.iCABSAServiceCoverMaintenanceLoad = new ServiceCoverMaintenanceLoad(this);
        this.iCABSAServiceCoverMaintenanceLoadVTs = new ServiceCoverMaintenanceLoadVTs(this);
        this.pages = [
            this.iCABSAServiceCoverMaintenance1,
            this.iCABSAServiceCoverMaintenance2,
            this.iCABSAServiceCoverMaintenance3,
            this.iCABSAServiceCoverMaintenance4,
            this.iCABSAServiceCoverMaintenance5,
            this.iCABSAServiceCoverMaintenance6,
            this.iCABSAServiceCoverMaintenance7,
            this.iCABSAServiceCoverMaintenance8,
            this.iCABSAServiceCoverMaintenanceLoad,
            this.iCABSAServiceCoverMaintenanceLoadVTs
        ];
    }
    ServiceCoverMaintenanceComponent.prototype.showMessageModal = function (data) {
        this.messageModal.show({ msg: data.msg, title: data.title }, false);
    };
    ServiceCoverMaintenanceComponent.prototype.showAlert = function (msgTxt, type) {
        this.logger.log('showAlert', msgTxt);
        var titleModal = '';
        if (typeof type === 'undefined')
            type = 0;
        switch (type) {
            default:
            case 0:
                titleModal = MessageConstant.Message.ErrorTitle;
                break;
            case 1:
                titleModal = MessageConstant.Message.SuccessTitle;
                break;
            case 2:
                titleModal = MessageConstant.Message.WarningTitle;
                break;
        }
        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    };
    ServiceCoverMaintenanceComponent.prototype.renderTab = function (tabindex) {
        var elem = document.querySelector('.nav-tabs').children;
        for (var i_1 = 0; i_1 < elem.length; i_1++) {
            if (this.utils.hasClass(elem[i_1], 'error')) {
                this.utils.removeClass(elem[i_1], 'active');
                this.utils.removeClass(document.querySelector('.tab-content').children[i_1], 'active');
            }
        }
        var i = 0;
        for (var tab in this.uiDisplay.tab) {
            if (tab !== '') {
                i++;
                this.uiDisplay.tab[tab].active = (i === tabindex) ? true : false;
            }
        }
        this.utils.addClass(elem[tabindex - 1], 'active');
        this.utils.addClass(document.querySelector('.tab-content').children[tabindex - 1], 'active');
        setTimeout(this.utils.makeTabsRed(), 200);
        if (tabindex === 2) {
            this.context.iCABSAServiceCoverMaintenance3.riTab_TabFocusAfterComponent();
        }
        else if (tabindex === 3) {
            this.context.iCABSAServiceCoverMaintenance3.riTab_TabFocusAfterDisplays();
        }
    };
    ServiceCoverMaintenanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.premiseSearchComponent = PremiseSearchComponent;
        this.closedTempComponent = ClosedTemplateSearchComponent;
        this.annualTempComponent = CalendarTemplateSearchComponent;
        this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        this.screennotready = ScreenNotReadyComponent;
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riExchange.getCurrentContractType());
        this.iCABSAServiceCoverMaintenance7.CreateTabs();
        if (this.isReturning()) {
            this.pageParams.dtInvoiceAnnivDate.value = null;
            this.pageParams.dtServiceCommenceDate.value = null;
            this.pageParams.dtFOCInvoiceStartDate.value = null;
            this.pageParams.dtExpiryDate.value = null;
            this.pageParams.dtPurchaseOrderExpiryDate.value = null;
            this.pageParams.dtDOWRenewalDate.value = null;
            this.pageParams.dtPurchaseOrderExpiryDate.value = null;
            this.pageParams.dtServiceVisitAnnivDate.value = null;
            this.pageParams.dtInstallationDate.value = null;
            this.pageParams.dtRemovalDate.value = null;
            this.pageParams.dtVisitPatternEffectiveDate.value = null;
            this.pageParams.dtDeliveryReleaseDate.value = null;
            this.pageParams.dtDepositDate.value = null;
            this.pageParams.dtEntitlementAnnivDate.value = null;
            this.pageParams.dtTrialPeriodEndDate.value = null;
            this.pageParams.dtLastChangeEffectDate.value = null;
            this.riExchange.renderForm(this.uiForm, this.pageParams.initialForm);
            this.restorePageParams();
            this.inputParamsContractSearch.accountNumber = this.getControlValue('AccountNumber');
            this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
            this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
            this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
            this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName');
            this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
            this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
            return;
        }
        this.pageParams.menu = [];
        this.pageParams.riComponentGridPageCurrent = 1;
        this.context.pageParams.riComponentTotalRecords = 1;
        this.inputParamsContractSearch.currentContractType = this.pageParams.currentContractType;
        this.inputParamsAccountPremise.currentContractType = this.pageParams.currentContractType;
        this.inputRenegPremiseSearch.currentContractType = this.pageParams.currentContractType;
        this.context.pageParams.strDocTitle = this.context.riExchange.getCurrentContractTypeLabel();
        this.context.pageParams.strInpTitle = this.context.riExchange.getCurrentContractTypeLabel();
        this.pageParams.SelectCompositeProductCode = [];
        this.pageParams.spanEntitlementAnnivDateLab_innerText = 'Entitlement Anniversary Date';
        this.pageParams.spanEntitlementAnnualQuantityLab_innerText = 'Annual Entitlement Quantity';
        this.pageParams.spanEntitlementNextAnnualQuantityLab_innerText = 'Next Year\'s Entitlement Quantity';
        this.pageParams.spanProductCodeLabel_innertext = 'Product Code';
        this.pageParams.InvTypeSel = [];
        this.initPageParams();
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
            this.context.pageParams.uiDisplay.trInitialTreatmentTime = false;
            this.context.pageParams.uiDisplay.trClosedCalendarTemplateFields = false;
            if (this.context.pageParams.vbEnableJobsToInvoiceAfterVisit) {
                this.context.pageParams.uiDisplay.trInvoiceOnFirstVisit = true;
            }
        }
        if (this.context.riExchange.getCurrentContractType() === 'P') {
            this.context.pageParams.uiDisplay.trRetainServiceCover = false;
        }
        this.pageParams.uiDisplay.Seasons = [];
        this.setControlValue('selHardSlotType', 'D');
        this.setControlValue('HardSlotType', 'D');
        this.setControlValue('SelAutoAllocation', 'D');
        this.setControlValue('SelAutoPattern', 'D');
        this.createSeasonalEntry();
        if (this.riMaintenance.CurrentMode !== MntConst.eModeSelect) {
            this.getSysCharDtetails();
        }
        setTimeout(function () {
            _this.isReturningFlag = false;
            _this.initialising = false;
        }, 4000);
    };
    ServiceCoverMaintenanceComponent.prototype.initPageParams = function () {
        this.pageParams.uiDisplay = {};
        this.pageParams.uiDisplay.tdLineOfService = false;
        this.pageParams.uiDisplay.tdInvFreq = true;
        this.pageParams.uiDisplay.tdAnnDate = true;
        this.pageParams.uiDisplay.labelInactiveEffectDate = true;
        this.pageParams.uiDisplay.InactiveEffectDate = true;
        this.pageParams.uiDisplay.tdReason = true;
        this.pageParams.uiDisplay.trMultipleTaxRates = false;
        this.pageParams.uiDisplay.trServiceVisitFrequency = true;
        this.pageParams.uiDisplay.trServiceQuantity = true;
        this.pageParams.uiDisplay.trAverageUnitValue = true;
        this.pageParams.uiDisplay.trUnitValueChange = true;
        this.pageParams.uiDisplay.trAnnualValueChange = true;
        this.pageParams.uiDisplay.trPriceChangeOnly = false;
        this.pageParams.uiDisplay.trMonthlyUnitPrice = true;
        this.pageParams.uiDisplay.trWorkLoadIndex = true;
        this.pageParams.uiDisplay.trMinimumDuration = true;
        this.pageParams.uiDisplay.trPerimeterValue = false;
        this.pageParams.uiDisplay.trComponentGrid = true;
        this.pageParams.uiDisplay.trWasteTransferType = true;
        this.pageParams.uiDisplay.trGuaranteeRequired = true;
        this.pageParams.uiDisplay.trPurchaseOrderDetails = false;
        this.pageParams.uiDisplay.trDOWInstall = true;
        this.pageParams.uiDisplay.trDOWProduct = true;
        this.pageParams.uiDisplay.trDOWPerimeter = true;
        this.pageParams.uiDisplay.trDOWRenewalDate = true;
        this.pageParams.uiDisplay.trMatchedContract = true;
        this.pageParams.uiDisplay.trMatchedPremise = true;
        this.pageParams.uiDisplay.trServiceVisitAnnivDate = true;
        this.pageParams.uiDisplay.trInspectionPoints = true;
        this.pageParams.uiDisplay.cmdDiaryView = true;
        this.pageParams.uiDisplay.trSalesPlannedTime = true;
        this.pageParams.uiDisplay.trFollowTemplate = true;
        this.pageParams.uiDisplay.trActualPlannedTime = true;
        this.pageParams.uiDisplay.trAnnualCalendarTemplateFields = true;
        this.pageParams.uiDisplay.trStandardTreatmentTime = true;
        this.pageParams.uiDisplay.trClosedCalendarTemplateFields = true;
        this.pageParams.uiDisplay.trInitialTreatmentTime = true;
        this.pageParams.uiDisplay.trServiceVisitFrequencyCopy = true;
        this.pageParams.uiDisplay.trRetainServiceWeekday = true;
        this.pageParams.uiDisplay.trServiceVisitCycleFields1 = true;
        this.pageParams.uiDisplay.trServiceVisitCycleFields2 = true;
        this.pageParams.uiDisplay.trStaticVisit = true;
        this.pageParams.uiDisplay.trServiceVisitCycleFields3 = true;
        this.pageParams.uiDisplay.tdNumberOfVisitsWarning = true;
        this.pageParams.uiDisplay.trServiceDepot = true;
        this.pageParams.uiDisplay.trGuaranteeCommence15 = true;
        this.pageParams.uiDisplay.trGuaranteeExpiry15 = true;
        this.pageParams.uiDisplay.trNoGuaranteeReason = true;
        this.pageParams.uiDisplay.trAgeOfPropertyLabel = true;
        this.pageParams.uiDisplay.trListedBuilding = true;
        this.pageParams.uiDisplay.trNumberBedrooms = true;
        this.pageParams.uiDisplay.trInvoiceType = true;
        this.pageParams.uiDisplay.trInvoiceStartDate = true;
        this.pageParams.uiDisplay.trBudgetBillingLine2 = true;
        this.pageParams.uiDisplay.trInvoiceEndDate = true;
        this.pageParams.uiDisplay.trBudgetBillingLine3 = true;
        this.pageParams.uiDisplay.trInvoiceValue = true;
        this.pageParams.uiDisplay.trBudgetBillingLine4 = true;
        this.pageParams.uiDisplay.trForwardDateChangeInd = true;
        this.pageParams.uiDisplay.trBudgetBillingLine5 = true;
        this.pageParams.uiDisplay.trDepositLine1 = true;
        this.pageParams.uiDisplay.trDepositLine2 = true;
        this.pageParams.uiDisplay.trZeroValueIncInvoice = true;
        this.pageParams.uiDisplay.trDepositLine3 = true;
        this.pageParams.uiDisplay.trDepositLine4 = true;
        this.pageParams.uiDisplay.TaxExemptionNumberLabel = true;
        this.pageParams.uiDisplay.trAPICode = true;
        this.pageParams.uiDisplay.trRetainServiceCover = true;
        this.pageParams.uiDisplay.trAutoRouteProductInd = true;
        this.pageParams.uiDisplay.trEntitlementServiceQuantity = true;
        this.pageParams.uiDisplay.selQuickWindowSet1 = true;
        this.pageParams.uiDisplay.selQuickWindowSet2 = true;
        this.pageParams.uiDisplay.selQuickWindowSet3 = true;
        this.pageParams.uiDisplay.selQuickWindowSet4 = true;
        this.pageParams.uiDisplay.selQuickWindowSet5 = true;
        this.pageParams.uiDisplay.selQuickWindowSet6 = true;
        this.pageParams.uiDisplay.selQuickWindowSet7 = true;
        this.pageParams.uiDisplay.trWEDValue = true;
        this.pageParams.uiDisplay.trPricePerWED = true;
        this.pageParams.uiDisplay.trRefreshDisplayVal = true;
        this.pageParams.uiDisplay.trStandardTreatmentTimeMandatory = true;
        this.pageParams.uiDisplay.tdContractHasExpired = false;
        this.pageParams.uiDisplay.tdNationalAccount = false;
        this.pageParams.uiDisplay.tdCustomerInfo = false;
        this.pageParams.uiDisplay.tdPNOL = false;
        this.pageParams.uiDisplay.SCLostBusinessDesc2 = false;
        this.pageParams.uiDisplay.SCLostBusinessDesc3 = false;
        this.pageParams.uiDisplay.tdTrialPeriodInd = false;
        this.pageParams.uiDisplay.spanTrialPeriodInd = false;
        this.pageParams.uiDisplay.tdContractTrialPeriodInd = false;
        this.pageParams.uiDisplay.spanContractTrialPeriodInd = false;
        this.pageParams.uiDisplay.trEffectiveDate = false;
        this.pageParams.uiDisplay.trFOC = false;
        this.pageParams.uiDisplay.tdFOCInvoiceStartDate = false;
        this.pageParams.uiDisplay.FOCInvoiceStartDate = false;
        this.pageParams.uiDisplay.tdFOCProposedAnnualValue = false;
        this.pageParams.uiDisplay.FOCProposedAnnualValue = false;
        this.pageParams.uiDisplay.tdWasteTransfer = false;
        this.pageParams.uiDisplay.trUnitValue = false;
        this.pageParams.uiDisplay.cmdValue = false;
        this.pageParams.uiDisplay.trUnConfirmedLabel = false;
        this.pageParams.uiDisplay.trUnConfirmedEffectiveDate = false;
        this.pageParams.uiDisplay.trUnconfirmedDeliveryQty = false;
        this.pageParams.uiDisplay.trUnconfirmedDeliveryValue = false;
        this.pageParams.uiDisplay.tdUnitValueChangeLab = false;
        this.pageParams.uiDisplay.UnitValueChange = false;
        this.pageParams.uiDisplay.tdAnnualValueChangeLab = false;
        this.pageParams.uiDisplay.AnnualValueChange = false;
        this.pageParams.uiDisplay.tdLostBusiness = false;
        this.pageParams.uiDisplay.trInitialValue = false;
        this.pageParams.uiDisplay.trInstallationValue = false;
        this.pageParams.uiDisplay.trOutstandingInstallations = false;
        this.pageParams.uiDisplay.trRemovalValue = false;
        this.pageParams.uiDisplay.trOutstandingRemovals = false;
        this.pageParams.uiDisplay.WorkLoadIndex = false;
        this.pageParams.uiDisplay.trLinkedProduct = false;
        this.pageParams.uiDisplay.DispenserInd = false;
        this.pageParams.uiDisplay.ConsumableInd = false;
        this.pageParams.uiDisplay.trLinkedServiceCover = false;
        this.pageParams.uiDisplay.trWeighingRequiredInd = false;
        this.pageParams.uiDisplay.trAverageWeight = false;
        this.pageParams.uiDisplay.trCompositeProductDetails1 = false;
        this.pageParams.uiDisplay.trCompositeProductDetails2 = false;
        this.pageParams.uiDisplay.trTermiteWarrantyLine1 = false;
        this.pageParams.uiDisplay.IsTermiteProduct = false;
        this.pageParams.uiDisplay.trTermiteWarrantyLine2 = false;
        this.pageParams.uiDisplay.trTermiteWarrantyLine3 = false;
        this.pageParams.uiDisplay.grdComponent = false;
        this.pageParams.uiDisplay.trComponentGridControls = false;
        this.pageParams.uiDisplay.trComponentControls = false;
        this.pageParams.uiDisplay.grdReduceDisplays = false;
        this.pageParams.uiDisplay.riGridHandle = false;
        this.pageParams.uiDisplay.origTotalValue = false;
        this.pageParams.uiDisplay.NewTotalValue = false;
        this.pageParams.uiDisplay.tdLeadEmployeeLabel = false;
        this.pageParams.uiDisplay.trBusinessOriginDetailCode = false;
        this.pageParams.uiDisplay.trChkRenegContract = false;
        this.pageParams.uiDisplay.tdRenegOldContract = false;
        this.pageParams.uiDisplay.trChkStockOrder = false;
        this.pageParams.uiDisplay.RoutingExclusionReason = false;
        this.pageParams.uiDisplay.RequiresWasteTransferType = false;
        this.pageParams.uiDisplay.trDOWSentricon = false;
        this.pageParams.uiDisplay.cmdHardSlotCalendar = false;
        this.pageParams.uiDisplay.trUplift = false;
        this.pageParams.uiDisplay.trUpliftCalendar = false;
        this.pageParams.uiDisplay.trInstallationEmployee = false;
        this.pageParams.uiDisplay.trRemovalEmployee = false;
        this.pageParams.uiDisplay.trEFKReplacementMonth = false;
        this.pageParams.uiDisplay.trGraphNumber = false;
        this.pageParams.uiDisplay.tdTotalFreeAdditionalVisitsAllowedLabel = false;
        this.pageParams.uiDisplay.tdTotalFreeAdditionalVisitsAllowed = false;
        this.pageParams.uiDisplay.tdRMMJobVisitValueLabel = false;
        this.pageParams.uiDisplay.tdRMMJobVisitValue = false;
        this.pageParams.uiDisplay.tdCurrentAddnlVisitCountLabel = false;
        this.pageParams.uiDisplay.tdCurrentAddnlVisitCount = false;
        this.pageParams.uiDisplay.trAnnualTime = false;
        this.pageParams.uiDisplay.trHardSlotType = false;
        this.pageParams.uiDisplay.trAppointmentRequiredInd = false;
        this.pageParams.uiDisplay.trDeliveryConfirmation = false;
        this.pageParams.uiDisplay.trInvoiceReleased = false;
        this.pageParams.uiDisplay.trConsolidateEqualTaxRates = false;
        this.pageParams.uiDisplay.trInvoiceSuspend = false;
        this.pageParams.uiDisplay.trInvoiceOnFirstVisit = false;
        this.pageParams.uiDisplay.trEntitlementInvoice = false;
        this.pageParams.uiDisplay.CanUpdateBudgetDetails = false;
        this.pageParams.uiDisplay.trDepositLineAdd = false;
        this.pageParams.uiDisplay.trTaxHeadings = false;
        this.pageParams.uiDisplay.trTaxMaterials = false;
        this.pageParams.uiDisplay.trTaxLabour = false;
        this.pageParams.uiDisplay.trTaxReplacement = false;
        this.pageParams.uiDisplay.grdSpecialInst = false;
        this.pageParams.uiDisplay.grdEntitlement = false;
        this.pageParams.uiDisplay.tdEntitlement = false;
        this.pageParams.uiDisplay.grdTrialPeriod = false;
        this.pageParams.uiDisplay.grdSeasonalService = false;
        this.pageParams.uiDisplay.trSeason1 = false;
        this.pageParams.uiDisplay.trSeason2 = false;
        this.pageParams.uiDisplay.trSeason3 = false;
        this.pageParams.uiDisplay.trSeason4 = false;
        this.pageParams.uiDisplay.trSeason5 = false;
        this.pageParams.uiDisplay.trSeason6 = false;
        this.pageParams.uiDisplay.trSeason7 = false;
        this.pageParams.uiDisplay.trSeason8 = false;
        this.pageParams.uiDisplay.grdTimeWindows = false;
        this.pageParams.uiDisplay.grdSurveyDetail = false;
        this.pageParams.uiDisplay.grdDisplayValue1 = false;
        this.pageParams.uiDisplay.ReplacementIncludeInd = false;
        this.pageParams.dtInvoiceAnnivDate = { value: null, disabled: false, required: false };
        this.pageParams.dtServiceCommenceDate = { value: null, disabled: false, required: false };
        this.pageParams.dtFOCInvoiceStartDate = { value: null, disabled: false, required: false };
        this.pageParams.dtExpiryDate = { value: null, disabled: false, required: false };
        this.pageParams.dtPurchaseOrderExpiryDate = { value: null, disabled: false, required: false };
        this.pageParams.dtDOWRenewalDate = { value: null, disabled: false, required: false };
        this.pageParams.dtPurchaseOrderExpiryDate = { value: null, disabled: false, required: false };
        this.pageParams.dtServiceVisitAnnivDate = { value: null, disabled: false, required: false };
        this.pageParams.dtInstallationDate = { value: null, disabled: false, required: false };
        this.pageParams.dtRemovalDate = { value: null, disabled: false, required: false };
        this.pageParams.dtVisitPatternEffectiveDate = { value: null, disabled: false, required: false };
        this.pageParams.dtDeliveryReleaseDate = { value: null, disabled: false, required: false };
        this.pageParams.dtDepositDate = { value: null, disabled: false, required: false };
        this.pageParams.dtEntitlementAnnivDate = { value: null, disabled: false, required: false };
        this.pageParams.dtTrialPeriodEndDate = { value: null, disabled: false, required: false };
        this.pageParams.dtLastChangeEffectDate = { value: null, disabled: false, required: false, error: false };
    };
    ServiceCoverMaintenanceComponent.prototype.clearDateFields = function () {
        this.cleardate('InvoiceAnnivDate');
        this.cleardate('ServiceCommenceDate');
        this.cleardate('FOCInvoiceStartDate');
        this.cleardate('ExpiryDate');
        this.cleardate('PurchaseOrderExpiryDate');
        this.cleardate('DOWRenewalDate');
        this.cleardate('PurchaseOrderExpiryDate');
        this.cleardate('ServiceVisitAnnivDate');
        this.cleardate('InstallationDate');
        this.cleardate('RemovalDate');
        this.cleardate('VisitPatternEffectiveDate');
        this.cleardate('DeliveryReleaseDate');
        this.cleardate('DepositDate');
        this.cleardate('EntitlementAnnivDate');
        this.cleardate('TrialPeriodEndDate');
        this.cleardate('LastChangeEffectDate');
    };
    ServiceCoverMaintenanceComponent.prototype.cleardate = function (id) {
        var elem = document.querySelector('#' + id).parentElement;
        if (elem.lastElementChild.firstElementChild) {
            var dateField = elem.lastElementChild.firstElementChild.firstElementChild.firstElementChild;
            var dateFieldID_1 = dateField.getAttribute('id');
            setTimeout(function () { document.getElementById(dateFieldID_1)['value'] = ''; }, 0);
        }
    };
    ServiceCoverMaintenanceComponent.prototype.createSeasonalEntry = function () {
        for (var i = 1; i <= 8; i++) {
            var season = {
                trRow: false,
                SeasonNumber: 'SeasonNumber' + i,
                SeasonalFromDate: 'SeasonalFromDate' + i,
                SeasonalFromWeek: 'SeasonalFromWeek' + i,
                SeasonalFromYear: 'SeasonalFromYear' + i,
                SeasonalToDate: 'SeasonalToDate' + i,
                SeasonalToWeek: 'SeasonalToWeek' + i,
                SeasonalToYear: 'SeasonalToYear' + i,
                SeasonNoOfVisits: 'SeasonNoOfVisits' + i
            };
            this.controls.push({
                name: 'SeasonNumber' + i, readonly: false, disabled: false, required: false
            });
            this.controls.push({
                name: 'SeasonalFromDate' + i, readonly: false, disabled: false, required: false, type: MntConst.eTypeDate
            });
            this.controls.push({
                name: 'SeasonalFromWeek' + i, readonly: false, disabled: false, required: false
            });
            this.controls.push({
                name: 'SeasonalFromYear' + i, readonly: false, disabled: false, required: false
            });
            this.controls.push({
                name: 'SeasonalToDate' + i, readonly: false, disabled: false, required: false, type: MntConst.eTypeDate
            });
            this.controls.push({
                name: 'SeasonalToWeek' + i, readonly: false, disabled: false, required: false
            });
            this.controls.push({
                name: 'SeasonalToYear' + i, readonly: false, disabled: false, required: false
            });
            this.controls.push({
                name: 'SeasonNoOfVisits' + i, readonly: false, disabled: false, required: false
            });
            this.riExchange.renderForm(this.uiForm, this.controls);
            this.pageParams.uiDisplay.Seasons.push(season);
        }
    };
    ServiceCoverMaintenanceComponent.prototype.ngOnDestroy = function () {
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        if (this.statusChangeSubscription) {
            this.statusChangeSubscription.unsubscribe();
        }
        _super.prototype.ngOnDestroy.call(this);
    };
    ServiceCoverMaintenanceComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.setControlValue('menu', 'Options');
        if (this.isReturning()) {
            var _loop_1 = function(key) {
                if (key) {
                    var type = this_1.riExchange.getCtrlType(this_1.controls, key);
                    if (type === MntConst.eTypeDate && this_1.uiForm.controls[key]['value']) {
                        setTimeout(function () {
                            _this.setDateToFields(key, _this.uiForm.controls[key]['value']);
                        }, 10);
                    }
                }
            };
            var this_1 = this;
            for (var key in this.uiForm.controls) {
                _loop_1(key);
            }
            this.disableControl('menu', false);
            setTimeout(function () {
                _this.isReturningFlag = false;
                _this.initialising = false;
            }, 4000);
            return;
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeSelect) {
            this.initiPageState();
            this.riMaintenance.execMode(MntConst.eModeSelect, this.pages);
            this.iCABSAServiceCoverMaintenance7.riMaintenance_Search();
        }
    };
    ServiceCoverMaintenanceComponent.prototype.getSysCharDtetails = function (noInit) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableInstallationEmployeeCodeValidation,
            this.sysCharConstants.SystemCharEnableSurveyDetail,
            this.sysCharConstants.SystemCharShowWasteConsignmentNoteHistory,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharEnablePlanVisitTabularView,
            this.sysCharConstants.SystemCharEnableSpecificVisitDays,
            this.sysCharConstants.SystemCharUseVisitTolerances,
            this.sysCharConstants.SystemCharUseInfestationTolerances,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableServiceCoverDetail,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableEntitlement,
            this.sysCharConstants.SystemCharEnableNationalAccountWarning,
            this.sysCharConstants.SystemCharEnableRetentionOfServiceWeekday,
            this.sysCharConstants.SystemCharEnableFreeOfChargeServices,
            this.sysCharConstants.SystemCharEnableTrialPeriodServices,
            this.sysCharConstants.SystemCharEnableServiceCoverAPICode,
            this.sysCharConstants.SystemCharEnableWorkLoadIndex,
            this.sysCharConstants.SystemCharEnableMonthlyUnitPrice,
            this.sysCharConstants.SystemCharSuspendSalesStatPortFigToDelDate,
            this.sysCharConstants.SystemCharEnableInitialTreatmentTime,
            this.sysCharConstants.SystemCharEnableRouteOptimisationSoftwareIntegration,
            this.sysCharConstants.SystemCharShowPremiseWasteTab,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharEnableWED,
            this.sysCharConstants.SystemCharDisplayLevelInstall,
            this.sysCharConstants.SystemCharDeliveryRelease,
            this.sysCharConstants.SystemCharEnableServiceCoverDepreciation,
            this.sysCharConstants.SystemCharEnableSpecificVisitDays,
            this.sysCharConstants.SystemCharEnableProductLinking,
            this.sysCharConstants.SystemCharDefaultStockReplenishment,
            this.sysCharConstants.SystemCharShowServiceDepot,
            this.sysCharConstants.SystemCharEnableWeeklyVisitPattern,
            this.sysCharConstants.SystemCharEnableJobsToInvoiceAfterVisit,
            this.sysCharConstants.SystemCharMultipleToCalculateSTT,
            this.sysCharConstants.SystemCharEnableInitialCharge,
            this.sysCharConstants.SystemCharEnableTimePlanning,
            this.sysCharConstants.SystemCharEnableServiceCoverAvgWeight,
            this.sysCharConstants.SystemCharMultipleTaxRates,
            this.sysCharConstants.SystemCharEnableLocations,
            this.sysCharConstants.SystemCharEnableLocations2,
            this.sysCharConstants.SystemCharDefaultTaxCodeOnServiceCoverMaint,
            this.sysCharConstants.SystemCharEnableWasteTransfer,
            this.sysCharConstants.SystemCharEnableProductServiceType,
            this.sysCharConstants.SystemCharEnableDepositProcessing,
            this.sysCharConstants.SystemCharEnablePlanVisitTabularView,
            this.sysCharConstants.SystemCharEnableInstallationEmployeeCodeValidation,
            this.sysCharConstants.SystemCharEnableSurveyDetail,
            this.sysCharConstants.SystemCharShowWasteConsignmentNoteHistory,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharEnablePlanVisitTabularView,
            this.sysCharConstants.SystemCharEnableSpecificVisitDays,
            this.sysCharConstants.SystemCharUseVisitTolerances,
            this.sysCharConstants.SystemCharUseInfestationTolerances,
            this.sysCharConstants.SystemCharValidateInvoiceTypeOnNewServiceCover,
            this.sysCharConstants.SystemCharEnableAPTByServiceType,
            this.sysCharConstants.SystemCharEnableSpecificVisitDays,
            this.sysCharConstants.SystemCharEnablePORefsAtServiceCoverLevel,
            this.sysCharConstants.SystemCharEnableiCABSRepeatSalesMatching,
            this.sysCharConstants.SystemCharEnableTechDiary
        ];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vEnableInsEmpCodeValidation = record[0].Required;
            _this.pageParams.vEnableSurveyDetail = record[1].Required;
            _this.pageParams.vShowWasteHistory = record[2].Required;
            _this.pageParams.vEnableServiceCoverDispLev = record[3].Required;
            _this.pageParams.vEnableTabularView = record[4].Required;
            _this.pageParams.vEnableSpecificVisitDays = record[5].Required;
            _this.pageParams.vSCVisitTolerances = record[6].Required;
            _this.pageParams.vSCInfestationTolerances = record[7].Required;
            _this.pageParams.vEnablePostcodeDefaulting = record[8].Required;
            _this.pageParams.vEnableServiceCoverDetail = record[9].Required;
            _this.pageParams.vEnableInstallsRemovals = record[10].Required;
            _this.pageParams.vEnableEntitlement = record[11].Required;
            _this.pageParams.vEnableNationalAccountWarning = record[12].Required;
            _this.pageParams.vEnableRetentionOfServiceWeekDay = record[13].Required;
            _this.pageParams.vEnableFreeOfChargeServices = record[14].Required;
            _this.pageParams.vEnableTrialPeriodServices = record[15].Required;
            _this.pageParams.vEnableAPICodeEntry = record[16].Required;
            _this.pageParams.vEnableWorkLoadIndex = record[17].Required;
            _this.pageParams.vEnableMonthlyUnitPrice = record[18].Required;
            _this.pageParams.vSuspendSalesStatPortFig = record[19].Required;
            _this.pageParams.vEnableInitialTreatmentTime = record[20].Required;
            _this.pageParams.vEnableRouteOptimisation = record[21].Required;
            _this.pageParams.vShowPremiseWasteTab = record[22].Required;
            _this.pageParams.vEnableServiceCoverDispLev = record[23].Required;
            _this.pageParams.vEnableWED = record[24].Required;
            _this.pageParams.vDisplayLevelInstall = record[25].Required;
            _this.pageParams.vEnableDeliveryRelease = record[26].Required;
            _this.pageParams.vEnableServiceCoverDepreciation = record[27].Required;
            _this.pageParams.vEnableSpecificVisitDays = record[28].Required;
            _this.pageParams.vEnableProductLinking = record[29].Required;
            _this.pageParams.vDefaultStockReplenishment = record[30].Required;
            _this.pageParams.vShowServiceDepot = record[31].Required;
            _this.pageParams.vWeeklyVisitPatternReq = record[32].Required;
            _this.pageParams.vEnableJobsToInvoiceAfterVisit = record[33].Required;
            _this.pageParams.vEnableStandardTreatmentTime = record[34].Required;
            _this.pageParams.vEnableInitialCharge = record[35].Required;
            _this.pageParams.vEnableTimePlanning = record[36].Required;
            _this.pageParams.vEnableServiceCoverAvgWeightReq = record[37].Required;
            _this.pageParams.vEnableMultipleTaxRates = record[38].Required;
            _this.pageParams.vEnableLocations = record[39].Required;
            _this.pageParams.vBlank = record[40].Required;
            _this.pageParams.vDefaultTaxCodeProductExpenseReq = record[41].Required;
            _this.pageParams.vSCEnableWasteTransfer = record[42].Required;
            _this.pageParams.vSCEnableProductServiceType = record[43].Required;
            _this.pageParams.vEnableDepositProcessing = record[44].Required;
            _this.pageParams.vEnableTabularView = record[45].Required;
            _this.pageParams.vEnableInsEmpCodeValidation = record[46].Required;
            _this.pageParams.vEnableSurveyDetail = record[47].Required;
            _this.pageParams.vShowWasteHistory = record[48].Required;
            _this.pageParams.vEnableServiceCoverDispLev = record[49].Required;
            _this.pageParams.vEnableTabularView = record[50].Required;
            _this.pageParams.vEnableSpecificVisitDays = record[51].Required;
            _this.pageParams.vSCVisitTolerances = record[52].Required;
            _this.pageParams.vSCInfestationTolerances = record[53].Required;
            _this.pageParams.vSCValidateInvoiceTypeOnNewSC = record[54].Required;
            _this.pageParams.vSCEnableAPTByServiceType = record[55].Required;
            _this.pageParams.vEnableSpecificVisitDays = record[56].Required;
            _this.pageParams.vSCPORefsAtServiceCover = record[57].Required;
            _this.pageParams.vSCRepeatSalesMatching = record[58].Required;
            _this.pageParams.vSCEnableTechDiary = record[59].Required;
            _this.pageParams.vWeeklyVisitPatternLog = record[32].Logical;
            _this.pageParams.vJobInvoiceFirstVisitValue = record[33].Value;
            _this.pageParams.vEnableSTTEntry = record[34].Logical;
            _this.pageParams.vEnableInitialChargeorInstall = record[35].Logical;
            _this.pageParams.vShowInspectionPoint = record[36].Logical;
            _this.pageParams.vEnableServiceCoverAvgWeightText = record[37].Text;
            _this.pageParams.vOverrideMultipleTaxRates = record[38].Logical;
            _this.pageParams.vEnableDetailLocations = record[39].Logical;
            _this.pageParams.vLocationsSingleEntry = record[40].Logical;
            _this.pageParams.vDefaultTaxCodeProductExpenseLog = record[41].Logical;
            _this.pageParams.vEnableSTTEntry = (_this.pageParams.vEnableSTTEntry && _this.pageParams.vEnableStandardTreatmentTime);
            _this.pageParams.vEnableWeeklyVisitPattern = (_this.pageParams.vWeeklyVisitPatternReq && _this.pageParams.vWeeklyVisitPatternLog);
            _this.getregistryValues(noInit);
        });
    };
    ServiceCoverMaintenanceComponent.prototype.getregistryValues = function (noInit) {
        var _this = this;
        var lookupIP = [
            {
                'table': 'BusinessRegistry',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'RegSection': 'DOW Sentricon',
                    'RegKey': 'Enable DOW Sentricon'
                },
                'fields': ['RegValue']
            },
            {
                'table': 'BusinessRegistry',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'RegSection': 'European Biocide Regime',
                    'RegKey': 'Enable_RMM'
                },
                'fields': ['RegValue']
            },
            {
                'table': 'BusinessRegistry',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'RegSection': 'Contact Centre Review',
                    'RegKey': this.businessCode() + '_' + 'System Default Review From Drill Option'
                },
                'fields': ['RegValue']
            },
            {
                'table': 'riCountry',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'riCountryCode': this.countryCode()
                },
                'fields': ['riTimeSeparator']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0] && data[0][0]) {
                _this.pageParams.vDOWSentriconParams = data[0][0]['RegValue'];
            }
            if (data[1] && data[1][0]) {
                _this.pageParams.vRegEnableRMM = data[1][0]['RegValue'];
            }
            if (data[2] && data[2][0]) {
                _this.pageParams.gcRegContactCentreReview = data[2][0]['RegValue'];
            }
            var vTimeSeparator = ':';
            if (data[3] && data[3][0]) {
                vTimeSeparator = data[3][0]['riTimeSeparator'];
            }
            if (vTimeSeparator) {
                _this.pageParams.vbTimeSeparator = vTimeSeparator;
            }
            else {
                _this.pageParams.vbTimeSeparator = ':';
            }
            if (_this.pageParams.vDOWSentriconParams === 'YES') {
                _this.pageParams.vEnableDOWSentricon = true;
            }
            else {
                _this.pageParams.vEnableDOWSentricon = false;
            }
            if (_this.pageParams.vRegEnableRMM && _this.pageParams.vRegEnableRMM.toString().toUpperCase() === 'TRUE') {
                _this.pageParams.vEnableRMM = true;
            }
            else {
                _this.pageParams.vEnableRMM = false;
            }
            if (_this.pageParams.gcRegContactCentreReview === 'Y') {
                _this.pageParams.lRegContactCentreReview = true;
            }
            else {
                _this.pageParams.lRegContactCentreReview = false;
            }
            if (!noInit && _this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                _this.iCABSAServiceCoverMaintenance1.init();
                _this.disableControl('ContractNumber', true);
                _this.disableControl('PremiseNumber', true);
                _this.disableControl('ProductCode', true);
                _this.disableControl('menu', false);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverMaintenanceComponent.prototype.ZeroPadInt = function (i, numDigits) {
        var ret = i + '';
        ret = (i < 10) ? ('0' + i) : ret;
        return ret;
    };
    ServiceCoverMaintenanceComponent.prototype.getURLQueryParameters = function (param) {
        if (param.fromMenu === 'true') {
            this.riMaintenance.CurrentMode = MntConst.eModeSelect;
        }
        else {
            this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        }
    };
    ServiceCoverMaintenanceComponent.prototype.setContractNumber = function (event) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', event.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', event.ContractName);
        this.uiForm.controls['ContractNumber'].markAsDirty();
        this.disableControl('PremiseNumber', false);
        this.inputParamsAccountPremise.ContractNumber = event.ContractNumber;
        this.inputParamsAccountPremise.ContractName = event.ContractName;
        this.serviceCoverSearchParams.ContractNumber = event.ContractNumber;
        this.serviceCoverSearchParams.ContractName = event.ContractName;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
            this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.iCABSAServiceCoverMaintenance3.GetDefaultTaxCode();
            this.context.iCABSAServiceCoverMaintenance3.BuildTaxCodeCombo();
        }
        this.context.getSysCharDtetails(true);
        if (typeof this.modalCallback === 'function') {
            this.modalCallback();
        }
    };
    ServiceCoverMaintenanceComponent.prototype.onPremiseSearchDataReceived = function (data) {
        if (data) {
            this.setControlValue('PremiseNumber', data.PremiseNumber);
            this.setControlValue('PremiseName', data.PremiseName);
            this.uiForm.controls['PremiseNumber'].markAsDirty();
            this.disableControl('ProductCode', false);
            this.serviceCoverSearchParams.PremiseNumber = data.PremiseNumber;
            this.serviceCoverSearchParams.PremiseName = data.PremiseName;
        }
        if (typeof this.modalCallback === 'function') {
            this.modalCallback();
        }
    };
    ServiceCoverMaintenanceComponent.prototype.setBranchServiceArea = function (event) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', event.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', event.BranchServiceAreaDesc);
        this.uiForm.controls['BranchServiceAreaCode'].markAsDirty();
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    };
    ServiceCoverMaintenanceComponent.prototype.setClosedTemp = function (event) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedCalendarTemplateNumber', event.ClosedCalendarTemplateNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedTemplateName', event.TemplateName);
    };
    ServiceCoverMaintenanceComponent.prototype.setAnnualTemp = function (event) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AnnualCalendarTemplateNumber', event.AnnualCalendarTemplateNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CalendarTemplateName', event.TemplateName);
    };
    ServiceCoverMaintenanceComponent.prototype.openSearchModal = function (comp, callback) {
        if (typeof callback === 'function') {
            this.modalCallback = callback;
        }
        comp.openModal();
    };
    ServiceCoverMaintenanceComponent.prototype.setDateToFields = function (fieldName, value) {
        this.setControlValue(fieldName, value);
        if (value) {
            this.pageParams['dt' + fieldName].value = new Date(value);
        }
        else {
            this.pageParams['dt' + fieldName].value = null;
        }
    };
    ServiceCoverMaintenanceComponent.prototype.dateToSelectedValue = function (value, id) {
        if (value) {
            if (value.value !== this.getControlValue(id)) {
                this.setControlValue(id, value.value);
                if (this.uiForm.controls.hasOwnProperty(id)) {
                    this.uiForm.controls[id].markAsDirty();
                }
                if (!this.isReturning() && !this.initialising && !this.initialLoad) {
                    this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
                }
            }
        }
    };
    ServiceCoverMaintenanceComponent.prototype.seasonalDateFromSelectedValue = function (value, id) {
        this.setControlValue(id, value.value);
        if (this.uiForm.controls.hasOwnProperty(id)) {
            this.uiForm.controls[id].markAsDirty();
        }
        var c = this.utils.Right(id, 1);
        this.context.iCABSAServiceCoverMaintenance7.SeasonalDateChange(id, 'SeasonalFromWeek' + c, 'SeasonalFromYear' + c);
    };
    ServiceCoverMaintenanceComponent.prototype.seasonalDateToSelectedValue = function (value, id) {
        this.setControlValue(id, value.value);
        if (this.uiForm.controls.hasOwnProperty(id)) {
            this.uiForm.controls[id].markAsDirty();
        }
        var c = this.utils.Right(id, 1);
        this.context.iCABSAServiceCoverMaintenance7.SeasonalDateChange(id, 'SeasonalToWeek' + c, 'SeasonalToYear' + c);
    };
    ServiceCoverMaintenanceComponent.prototype.setProductCode = function (data) {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.setControlValue('ProductCode', data.ProductCode);
            this.uiForm.controls['ProductCode'].markAsDirty();
            this.setControlValue('ProductDesc', data.ProductDesc);
            this.enableForm();
            this.context.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
            if (this.context.pageParams.vbEnableProductServiceType) {
                this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
            }
            this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
            this.iCABSAServiceCoverMaintenance1.init();
            this.routeAwayGlobals.setSaveEnabledFlag(true);
        }
        else {
            if (data.parentMode && data.parentMode === 'SearchAdd') {
                this.initialLoad = true;
                this.riMaintenance.CurrentMode = MntConst.eModeAdd;
                this.serviceCoverSearchParams.parentMode = 'ServiceCover-' + this.riExchange.getCurrentContractType();
                this.serviceCoverSearchComponent = ProductSearchGridComponent;
                setTimeout(function () {
                    this.serviceCoverSearch.openModal();
                }.bind(this), 1000);
                this.initMode(this.Mode.ADD);
            }
            else {
                this.setControlValue('ProductCode', data.row.ProductCode);
                this.uiForm.controls['ProductCode'].markAsDirty();
                this.setControlValue('ServiceCoverROWID', data.row.ttServiceCover);
                this.setControlValue('ProductDesc', data.row.ProductDesc);
                this.enableForm();
                if (this.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
                    this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
                    this.disableControl('ContractNumber', true);
                    this.disableControl('PremiseNumber', true);
                    this.disableControl('ProductCode', true);
                    this.disableControl('menu', false);
                }
                this.initMode(this.Mode.UPDATE);
                this.context.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
                if (this.context.pageParams.vbEnableProductServiceType) {
                    this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
                }
                this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
                this.iCABSAServiceCoverMaintenance1.init();
            }
        }
    };
    ServiceCoverMaintenanceComponent.prototype.onProductCodeChange = function () {
        if (this.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ProductCode')) {
            if (this.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
                this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
            }
            this.initMode(this.Mode.UPDATE);
            this.context.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
            this.iCABSAServiceCoverMaintenance1.init();
        }
    };
    ServiceCoverMaintenanceComponent.prototype.initMode = function (mode) {
        var contractNum = this.getControlValue('ContractNumber');
        var contractname = this.getControlValue('ContractName');
        var premiseNume = this.getControlValue('PremiseNumber');
        var premisename = this.getControlValue('PremiseName');
        var contractType = this.getControlValue('ContractTypeCode');
        var productCode, productName, ServiceCoverROWID = '';
        if (mode === this.Mode.UPDATE) {
            productCode = this.getControlValue('ProductCode');
            productName = this.getControlValue('ProductDesc');
            ServiceCoverROWID = this.getControlValue('ServiceCoverROWID');
        }
        for (var key in this.uiForm.controls) {
            if (key && this.uiForm.controls.hasOwnProperty(key)) {
                this.uiForm.controls[key].markAsPristine();
                this.setControlValue(key, '');
            }
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', contractNum);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', contractname);
        this.setControlValue('PremiseNumber', premiseNume);
        this.setControlValue('PremiseName', premisename);
        this.setControlValue('ContractTypeCode', contractType);
        if (mode === this.Mode.UPDATE) {
            this.setControlValue('ProductCode', productCode);
            this.uiForm.controls['ProductCode'].markAsDirty();
            this.setControlValue('ServiceCoverROWID', ServiceCoverROWID);
            this.setControlValue('ProductDesc', productName);
        }
        this.uiForm.controls['ContractNumber'].markAsDirty();
        this.uiForm.controls['PremiseNumber'].markAsDirty();
        this.disableControl('ContractNumber', true);
        this.disableControl('PremiseNumber', true);
    };
    ServiceCoverMaintenanceComponent.prototype.enableForm = function () {
        this.uiForm.enable();
        this.setButtonText();
        for (var i = 0; i < this.controls.length; i++) {
            if (this.controls[i].disabled) {
                this.disableControl(this.controls[i].name, true);
            }
        }
    };
    ServiceCoverMaintenanceComponent.prototype.getValueForService = function (field) {
        var ret = this.context.getControlValue(field);
        if (field === 'CallLogID' && !ret) {
            ret = '';
        }
        if ((field.indexOf('WindowStart') > -1) || (field.indexOf('WindowEnd') > -1)
            || (field.indexOf('HardSlotVisitTime') > -1)) {
            if (ret) {
                return this.context.utils.hmsToSeconds(ret);
            }
            else {
                return ret;
            }
        }
        if (typeof ret === 'boolean') {
            if (ret) {
                return 'yes';
            }
            else {
                return 'no';
            }
        }
        if (this.uiForm.controls.hasOwnProperty(field) &&
            this.uiForm.controls[field]['type'] === MntConst.eTypeCurrency) {
            ret = this.utils.CCurToNum(ret);
        }
        if (!ret && this.uiForm.controls.hasOwnProperty(field)) {
            if (this.uiForm.controls[field]['type'] === MntConst.eTypeCheckBox) {
                return 'no';
            }
            else {
                return ret;
            }
        }
        else {
            return ret;
        }
    };
    ServiceCoverMaintenanceComponent.prototype.handleCancel = function () {
        var _this = this;
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.riExchange.renderForm(this.uiForm, this.pageParams.initialForm);
            setTimeout(function () {
                _this.restorePageParams();
            }, 1000);
            this.setDateToFields('InvoiceAnnivDate', this.getControlValue('InvoiceAnnivDate'));
            this.setDateToFields('ServiceCommenceDate', this.getControlValue('ServiceCommenceDate'));
            this.setDateToFields('FOCInvoiceStartDate', this.getControlValue('FOCInvoiceStartDate'));
            this.setDateToFields('ExpiryDate', this.getControlValue('ExpiryDate'));
            this.setDateToFields('PurchaseOrderExpiryDate', this.getControlValue('PurchaseOrderExpiryDate'));
            this.setDateToFields('DOWRenewalDate', this.getControlValue('DOWRenewalDate'));
            this.setDateToFields('ServiceVisitAnnivDate', this.getControlValue('ServiceVisitAnnivDate'));
            this.setDateToFields('InstallationDate', this.getControlValue('InstallationDate'));
            this.setDateToFields('RemovalDate', this.getControlValue('RemovalDate'));
            this.setDateToFields('VisitPatternEffectiveDate', this.getControlValue('VisitPatternEffectiveDate'));
            this.setDateToFields('DeliveryReleaseDate', this.getControlValue('DeliveryReleaseDate'));
            this.setDateToFields('DepositDate', this.getControlValue('DepositDate'));
            this.setDateToFields('EntitlementAnnivDate', this.getControlValue('EntitlementAnnivDate'));
            this.setDateToFields('TrialPeriodEndDate', this.getControlValue('TrialPeriodEndDate'));
            this.setDateToFields('LastChangeEffectDate', this.getControlValue('LastChangeEffectDate'));
            this.renderTab(1);
        }
        else if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.serviceCoverSearchParams.PremiseNumber = '';
            this.serviceCoverSearchParams.PremiseName = '';
            this.inputParamsAccountPremise.ContractNumber = '';
            this.inputParamsAccountPremise.ContractName = '';
            this.serviceCoverSearchParams.ContractNumber = '';
            this.serviceCoverSearchParams.ContractName = '';
            this.serviceCoverSearchParams.parentMode = 'Search';
            this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
            this.inputParamsContractSearch.accountNumber = '';
            this.pageParams.uiDisplay.tdContractHasExpired = false;
            this.pageParams.uiDisplay.tdNationalAccount = false;
            this.pageParams.uiDisplay.tdPNOL = false;
            this.pageParams.uiDisplay.tdLineOfService = false;
            this.initiPageState();
            setTimeout(function () {
                _this.contractSearch.openModal();
            }, 1000);
        }
        this.iCABSAServiceCoverMaintenance7.CreateTabs();
    };
    ServiceCoverMaintenanceComponent.prototype.restorePageParams = function () {
        for (var key in this.pageParams.initialUIDisplay) {
            if (key && this.pageParams.uiDisplay.hasOwnProperty(key)) {
                this.pageParams.uiDisplay[key] = this.pageParams.initialUIDisplay[key];
            }
        }
    };
    ServiceCoverMaintenanceComponent.prototype.storePageParams = function () {
        this.pageParams.initialUIDisplay = {};
        for (var key in this.pageParams.uiDisplay) {
            if (key && this.pageParams.uiDisplay.hasOwnProperty(key)) {
                this.pageParams.initialUIDisplay[key] = this.pageParams.uiDisplay[key];
            }
        }
    };
    ServiceCoverMaintenanceComponent.prototype.initiPageState = function () {
        this.uiForm.reset();
        this.uiForm.disable();
        this.clearDateFields();
        this.setButtonText();
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riExchange.getCurrentContractType());
        this.disableControl('ContractNumber', false);
        this.disableControl('menu', true);
        this.riMaintenance.CurrentMode = MntConst.eModeSelect;
    };
    ServiceCoverMaintenanceComponent.prototype.setButtonText = function () {
        var _this = this;
        this.utils.getTranslatedval('Save').then(function (res) { _this.setControlValue('save', res); });
        this.utils.getTranslatedval('Cancel').then(function (res) { _this.setControlValue('cancel', res); });
        this.utils.getTranslatedval('Customer Information').then(function (res) { _this.setControlValue('cmdCustomerInfo', res); });
        this.utils.getTranslatedval('Future Change').then(function (res) { _this.setControlValue('cmdValue', res); });
        this.utils.getTranslatedval('Copy').then(function (res) { _this.setControlValue('cmdCopyServiceCover', res); });
        this.utils.getTranslatedval('Select All').then(function (res) { _this.setControlValue('cmdComponentSelAll', res); });
        this.utils.getTranslatedval('DeSelect All').then(function (res) { _this.setControlValue('cmdComponentDesAll', res); });
        this.utils.getTranslatedval('Hard Slot Calendar').then(function (res) { _this.setControlValue('cmdHardSlotCalendar', res); });
        this.utils.getTranslatedval('Diary View').then(function (res) { _this.setControlValue('cmdDiaryView', res); });
        this.utils.getTranslatedval('Calculate').then(function (res) { _this.setControlValue('cmdCalculate', res); });
        this.utils.getTranslatedval('Add New Deposit').then(function (res) { _this.setControlValue('btnDepositAdd', res); });
        this.utils.getTranslatedval('Default Value').then(function (res) { _this.setControlValue('btnDefaultValue', res); });
        this.utils.getTranslatedval('Refresh Display Values').then(function (res) { _this.setControlValue('cmdRefreshDisplayVal', res); });
    };
    ServiceCoverMaintenanceComponent.prototype.promptYes = function (event) {
        if (this.promptCallback && typeof this.promptCallback === 'function') {
            this.promptModal.hide();
            this.promptCallback.call(this);
        }
    };
    ServiceCoverMaintenanceComponent.prototype.modalClose = function (event) {
        if (this.messageModalCallback && typeof this.messageModalCallback === 'function') {
            this.messageModalCallback.call(this);
            this.messageModalCallback = null;
        }
    };
    ServiceCoverMaintenanceComponent.prototype.showMessageDialog = function (message, fncallback) {
        var _this = this;
        this.messageModalCallback = fncallback;
        setTimeout(function () { _this.messageModal.show({ msg: message, title: MessageConstant.Message.WarningTitle }, false); }, 1000);
    };
    ServiceCoverMaintenanceComponent.prototype.showDialog = function (message, fncallback) {
        var _this = this;
        this.promptCallback = fncallback;
        this.getTranslatedValue(message, null).subscribe(function (res) {
            if (res) {
                _this.promptContent = res;
            }
            else {
                _this.promptContent = message;
            }
        });
        setTimeout(function () { _this.promptModal.show(); }, 1000);
    };
    ServiceCoverMaintenanceComponent.prototype.getCurrentPage = function (event) {
        if (this.pageParams.riComponentGridPageCurrent !== event.value) {
            this.pageParams.riComponentGridPageCurrent = event.value;
            this.iCABSAServiceCoverMaintenance3.riComponentGrid_BeforeExecute();
        }
    };
    ServiceCoverMaintenanceComponent.prototype.onDepotSearch = function (data) {
        this.setControlValue('DepotNumber', data.DepotNumber);
        this.setControlValue('DepotName', data.DepotName);
    };
    ServiceCoverMaintenanceComponent.prototype.employeeOnchange = function (obj, call) {
        this.setControlValue('ServiceSalesEmployee', obj.EmployeeCode);
        this.setControlValue('EmployeeSurname', obj.EmployeeSurname);
    };
    ServiceCoverMaintenanceComponent.prototype.installEmployeeOnchange = function (obj) {
        this.setControlValue('InstallationEmployeeCode', obj.InstallationEmployeeCode);
        this.setControlValue('InstallationEmployeeName', obj.InstallationEmployeeName);
    };
    ServiceCoverMaintenanceComponent.prototype.removalEmployeeOnchange = function (obj) {
        this.setControlValue('RemovalEmployeeCode', obj.RemovalEmployeeCode);
        this.setControlValue('RemovalEmployeeName', obj.RemovalEmployeeName);
    };
    ServiceCoverMaintenanceComponent.prototype.leadEmployeeOnchange = function (obj) {
        this.setControlValue('LeadEmployee', obj.LeadEmployee);
        this.setControlValue('LeadEmployeeSurname', obj.LeadEmployeeSurname);
    };
    ServiceCoverMaintenanceComponent.prototype.setRenegContractNumber = function (obj) {
        this.setControlValue('RenegOldContract', obj.ContractNumber);
        this.inputRenegPremiseSearch.ContractNumber = obj.ContractNumber;
    };
    ServiceCoverMaintenanceComponent.prototype.setRenegPremiseNumber = function (obj) {
        this.setControlValue('RenegOldPremise', obj.PremiseNumber);
    };
    ServiceCoverMaintenanceComponent.prototype.validateAndFormatTime = function (field) {
        this.formatTime(this.getControlValue(field), field);
    };
    ServiceCoverMaintenanceComponent.prototype.formatTime = function (time, field) {
        if (time.indexOf(':') === -1) {
            var result = '';
            var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            var firstDta = parseInt(time[0] + time[1], 10);
            var secondDta = parseInt(time[2] + time[3], 10);
            if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && time.length === 4) {
                result = time[0] + time[1] + ':' + time[2] + time[3];
                this.riExchange.riInputElement.isCorrect(this.uiForm, field);
                this.setControlValue(field, result);
                return true;
            }
            else {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, true);
                this.setControlValue(field, time);
                return false;
            }
        }
        else {
            var firstDta = time.split(':')[0];
            var secondDta = time.split(':')[1];
            if (!((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) || time.length !== 5) {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, true);
                this.setControlValue(field, time);
                return false;
            }
            else {
                this.riExchange.riInputElement.isCorrect(this.uiForm, field);
                return true;
            }
        }
    };
    ServiceCoverMaintenanceComponent.prototype.canDeactivate = function () {
        if (this.routeAwayComponent) {
            return this.routeAwayComponent.canDeactivate();
        }
    };
    ServiceCoverMaintenanceComponent.prototype.setNumberTwoDecimalPlace = function (field) {
        var val = this.getControlValue(field);
        if (val) {
            val = val.toString();
            val = this.utils.cCur(val);
            try {
                if (!isNaN(val)) {
                    this.setControlValue(field, val);
                    this.riExchange.riInputElement.isCorrect(this.uiForm, field);
                }
                else {
                    this.uiForm.controls[field].setErrors({ 'incorrect': true });
                }
            }
            catch (e) {
                this.uiForm.controls[field].setErrors({ 'incorrect': true });
            }
        }
        else {
            this.riExchange.riInputElement.isCorrect(this.uiForm, field);
        }
    };
    ServiceCoverMaintenanceComponent.prototype.fieldValidateTransform = function (event) {
        var retObj = this.utils.fieldValidateTransform(event);
        this.setControlValue(retObj.id, retObj.value);
        if (!retObj.status) {
            this.riExchange.riInputElement.markAsError(this.uiForm, retObj.id);
        }
        return retObj.status;
    };
    ServiceCoverMaintenanceComponent.prototype.onAPICodeDataReceived = function (Obj) {
        this.context.setControlValue('APICode', Obj.APICode);
        this.context.setControlValue('APICodeDesc', Obj.APICodeDesc);
    };
    ServiceCoverMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-service-cover-maintenance',
                    templateUrl: 'iCABSAServiceCoverMaintenance.html'
                },] },
    ];
    ServiceCoverMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'contractSearch': [{ type: ViewChild, args: ['contractSearch',] },],
        'premiseSearch': [{ type: ViewChild, args: ['premiseSearch',] },],
        'serviceCoverSearch': [{ type: ViewChild, args: ['serviceCoverSearch',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'riComponentGrid': [{ type: ViewChild, args: ['riComponentGrid',] },],
        'riDisplayGrid': [{ type: ViewChild, args: ['riDisplayGrid',] },],
        'LastChangeEffectDatePicker': [{ type: ViewChild, args: ['LastChangeEffectDatePicker',] },],
    };
    return ServiceCoverMaintenanceComponent;
}(BaseComponent));
