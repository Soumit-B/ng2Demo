import { SeasonalTemplateSearchComponent } from './../../search/iCABSBSeasonalTemplateSearch';
import { ServiceTypeSearchComponent } from './../../search/iCABSBServiceTypeSearch.component';
import { RMMCategoryLanguageSearchComponent } from './../../search/iCABSARMMCategoryLanguageSearch.component';
import { ICABSBAPICodeSearchComponent } from './../../search/iCABSBAPICodeSearchComponent';
import { CalendarTemplateSearchComponent } from './../../search/iCABSBCalendarTemplateSearch.component';
import { Observable } from 'rxjs/Observable';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { TaxCodeSearchComponent } from './../../search/iCABSSTaxCodeSearch.component';
import { EmployeeSearchComponent } from './../../search/iCABSBEmployeeSearch';
import { DeportSearchComponent } from './../../search/iCABSBDepotSearch.component';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { ProductSearchGridComponent } from './../../search/iCABSBProductSearch';
import { BranchServiceAreaSearchComponent } from './../../search/iCABSBBranchServiceAreaSearch';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { DatepickerComponent } from './../../../../shared/components/datepicker/datepicker';
import { ServiceCoverSearchComponent } from './../../search/iCABSAServiceCoverSearch';
import { ClosedTemplateSearchComponent } from './../../search/iCABSBClosedTemplateSearch.component';
import { PremiseSearchComponent } from './../../search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../search/iCABSAContractSearch';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { QueryParametersCallback } from './../../../base/Callback';
import { ServiceCoverMaintenanceLoadVTs } from './iCABSAServiceCoverMaintenanceLoadVTs';
import { ServiceCoverMaintenanceLoad } from './iCABSAServiceCoverMaintenanceLoad';
import { ServiceCoverMaintenance6 } from './iCABSAServiceCoverMaintenance6';
import { ServiceCoverMaintenance5 } from './iCABSAServiceCoverMaintenance5';
import { ServiceCoverMaintenance4 } from './iCABSAServiceCoverMaintenance4';
import { ServiceCoverMaintenance3 } from './iCABSAServiceCoverMaintenance3';
import { ServiceCoverMaintenance2 } from './iCABSAServiceCoverMaintenance2';
import { RiMaintenance, MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ServiceCoverMaintenance7 } from './iCABSAServiceCoverMaintenance7';
import { ServiceCoverMaintenance8 } from './iCABSAServiceCoverMaintenance8';
import { ServiceCoverMaintenance1 } from './iCABSAServiceCoverMaintenance1';
import { ServiceCoverMaintenanceVTs } from './iCABSAServiceCoverMaintenanceVTs';
import { Subscription } from 'rxjs/Rx';

import { Component, OnInit, Input, ViewChild, Injector, OnDestroy, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { MessageCallback } from '../../../../app/base/Callback';
import { BusinessOriginLangSearchComponent } from '../../../../app/internal/search/iCABSBBusinessOriginLanguageSearch.component';
import { LostBusinessDetailLanguageSearchComponent } from './../../search/iCABSBLostBusinessDetailLanguageSearch.component';
import { LostBusinessLanguageSearchComponent } from './../../search/iCABSBLostBusinessLanguageSearch.component';


@Component({
    selector: 'icabs-service-cover-maintenance',
    templateUrl: 'iCABSAServiceCoverMaintenance.html'
})
export class ServiceCoverMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit,
    MessageCallback, QueryParametersCallback {

    @ViewChild('messageModal') public messageModal;
    @ViewChild('successModal') public successModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('contractSearch') public contractSearch: EllipsisComponent;
    @ViewChild('premiseSearch') public premiseSearch: EllipsisComponent;
    @ViewChild('serviceCoverSearch') public serviceCoverSearch: EllipsisComponent;
    @ViewChild('serviceCoverCopy') public serviceCoverCopy: EllipsisComponent;
    @ViewChild('linkedServiceCoverSearch') public linkedServiceCoverSearch: EllipsisComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('promptModal1') public promptModal1;
    @ViewChild('businessOriginDropDown') public businessOriginDropDown: BusinessOriginLangSearchComponent;
    @ViewChild('reasonCodeDropDown') public reasonCodeDropDown: LostBusinessLanguageSearchComponent;
    @ViewChild('detailCodeDropDown') public detailCodeDropDown: LostBusinessDetailLanguageSearchComponent;
    @ViewChild('rmmCategoryDropDown') public rmmCategoryDropDown: RMMCategoryLanguageSearchComponent;
    @ViewChild('serviceTypeCodeDropDown') public serviceTypeCodeDropDown: ServiceTypeSearchComponent;
    @ViewChild('preferredDaySearchDropDown') public preferredDaySearchDropDown: ServiceTypeSearchComponent;
    @ViewChild('riComponentGrid') riComponentGrid: GridAdvancedComponent;
    @ViewChild('riDisplayGrid') riDisplayGrid: GridAdvancedComponent;

    //Date picker
    @ViewChild('LastChangeEffectDatePicker') public LastChangeEffectDatePicker: DatepickerComponent;

    public Mode: any = { ADD: 1, UPDATE: 2 };

    public statusChangeSubscription: Subscription;

    public inputParamsContractSearch: any = {
        'parentMode': 'LookUp',
        'accountNumber': '',
        'currentContractType': 'C',
        'enableAccountSearch': false
    };
    public promptTitle: string = 'Confirm Record?';
    public promptContent: string = '';
    public promptContent1: any = '';

    public inputParamsDepotSearch: any = { 'parentMode': 'LookUp' };

    public inputParamsClosedTemp: any = {
        'parentMode': 'LookUp-AllAccessCalendarServiceCover'
    };

    public inputParamsClosedTempUplift: any = {
        'parentMode': 'LookUp-UpliftCalendarServiceCover'
    };

    public inputParamsAnnualTemp: any = {
        'parentMode': 'LookUp'
    };

    public inputParamsAccountPremise: any = {
        'parentMode': 'LookUp',
        'currentContractType': 'P',
        'ContractNumber': '',
        'showAddNew': false
    };

    public inputRenegPremiseSearch: any = {
        'parentMode': 'LookUp',
        'currentContractType': 'P',
        'ContractNumber': '',
        'showAddNew': false
    };

    public serviceCoverSearchParams: any = {
        'parentMode': 'Search',
        'ContractNumber': '',
        'PremiseNumber': '',
        'showAddNew': true
    };

    public linkedServiceCoverSearchParams: any = {
        'parentMode': 'LinkedSearch',
        'ContractNumber': '',
        'PremiseNumber': '',
        'ProductCode': ''
    };

    public serviceCoverCopyParams: any = {
        'parentMode': 'ServiceCoverCopy',
        'ContractNumber': '',
        'PremiseNumber': ''
    };

    public employeeSearchParams: any = {
        'parentMode': 'LookUp-ServiceBranchEmployee'
    };
    public installEmployeeSearchParams: any = {
        'parentMode': 'LookUp-InstallationEmployee'
    };
    public removalEmployeeSearchParams: any = {
        'parentMode': 'LookUp-RemovalEmployee'
    };
    public LeadEmployeeSearchParams: any = {
        'parentMode': 'LookUp-LeadEmployee'
    };
    public seasonalTemplateNumberSearchParams: any = {
        'parentMode': 'LookUp'
    };
    public branchServiceAreaSearchParams: any = {
        disabled: false,
        showCloseButton: true,
        showHeader: true,
        showAddNew: false,
        autoOpenSearch: false,
        parentMode: 'LookUp-SC'
    };

    public branchServiceAreaSearchParamsVP: any = {
        disabled: false,
        showCloseButton: true,
        showHeader: true,
        showAddNew: false,
        autoOpenSearch: false,
        ServiceBranchNumber: '',
        BranchName: '',
        parentMode: 'LookUp-VisitPattern'
    };

    public APICodeSearchParams: any = {
        'parentMode': 'LookUp'
    };

    public businessOriginCodeSearchParams: any = {
        'parentMode': 'LookUp',
        'businessCode': '',
        'countryCode': ''
    };

    public reasonCodeSearchParams: any = {
        'parentMode': 'LookUp',
        'businessCode': '',
        'countryCode': ''
    };

    public detailCodeSearchParams: any = {
        'parentMode': 'LookUp',
        'businessCode': '',
        'countryCode': '',
        'LostBusinessCode': ''
    };

    public noGuarenteeSearchParams: any = {
        method: 'contract-management/search',
        module: 'property',
        operation: 'Business/iCABSBPropertyNoGuaranteeSearch'
    };

    public noGuarenteeSearchDisplayFields: Array<string> = ['NoGuaranteeCode', 'NoGuaranteeDescription'];

    public taxCodeMaterialsParams: any = {
        'parentMode': 'LookUpMaterialsTax'
    };

    public preferredDaySearchDisplayFields: Array<string> = ['PreferredDayOfWeekReason.PreferredDayOfWeekReasonCode', 'PreferredDayOfWeekReason.PreferredDayOfWeekReasonDesc'];

    public preferredDaySearchParams: any = {
        operation: 'Business/iCABSBPreferredDayOfWeekReasonSearch',
        module: 'template',
        method: 'service-planning/search'
    };

    public taxCodeLabourParams: any = {
        'parentMode': 'LookUpLabourTax'
    };

    public taxCodeReplacementParams: any = {
        'parentMode': 'LookUpReplacementTax'
    };

    public rmmCategorySearchParams: any = {
        'parentMode': 'LookUp',
        'businessCode': '',
        'countryCode': ''
    };

    public serviceTypeCodeSearchParams: any = {
        params: {
            'parentMode': 'LookUp-SC',
            'businessCode': '',
            'countryCode': ''
        }
    };

    public postSaveMethodType: any = {
        'POST_SAVE_ADD_1': 'POST_SAVE_ADD_1',
        'POST_SAVE_ADD_2': 'POST_SAVE_ADD_2',
        'POST_SAVE_ADD_3': 'POST_SAVE_ADD_3',
        'POST_SAVE_ADD_3A': 'POST_SAVE_ADD_3A',
        'POST_SAVE_ADD_4': 'POST_SAVE_ADD_4',
        'POST_SAVE_ADD_5': 'POST_SAVE_ADD_5',
        'POST_SAVE_ADD_6': 'POST_SAVE_ADD_6',
        'POST_SAVE_UPDATE_1': 'POST_SAVE_UPDATE_1',
        'POST_SAVE_UPDATE_2': 'POST_SAVE_UPDATE_2',
        'POST_SAVE_UPDATE_3': 'POST_SAVE_UPDATE_3',
        'POST_SAVE_UPDATE_4': 'POST_SAVE_UPDATE_4',
        'POST_SAVE_UPDATE_5': 'POST_SAVE_UPDATE_5',
        'POST_SAVE_UPDATE_6': 'POST_SAVE_UPDATE_6'
    };

    public modalCallback: any;
    public promptCallback: any;
    public promptNoCallback: any;
    public messageModalCallback: any;
    public saveClicked: boolean = false;
    public initialLoad: boolean = true;
    public initialising: boolean = true;
    public itemsPerPage: number = 10;
    public shouldCall: boolean = false;
    public calledFromOnChange: boolean = false;
    public afterSaveNavigate: boolean = false;
    public productSelectedForAdd: boolean = false;
    public prevMaterialsValue: any = '';
    public prevLabourValue: any = '';
    public prevReplacementValue: any = '';
    public copyMode: boolean = false;
    public isTermiteContract: boolean = false;
    public formIsDirty: boolean = false;
    public canDeactivateObservable: Observable<boolean>;

    public pageId: string = '';
    public controls: any = [
        { name: 'ContractNumber', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ContractName', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'AccountNumber', disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'InvoiceFrequencyCode', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PremiseNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PremiseName', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'ProductCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ProductDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'Status', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'InactiveEffectDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'ServiceBranchNumber', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'BranchName', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'SCLostBusinessDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'SCLostBusinessDesc2', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'SCLostBusinessDesc3', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'LastChangeEffectDate', disabled: false, type: MntConst.eTypeDate, required: true, value: '' },
        { name: 'ServiceVisitFrequency', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'FOCProposedAnnualValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'ServiceQuantity', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'WasteTransferChargeValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'UnitValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'ServiceAnnualValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'UnConfirmedEffectiveDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'UnConfirmedServiceQuantity', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'UnConfirmedServiceValue', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'AverageUnitValue', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'UnitValueChange', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'AnnualValueChange', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'LostBusinessCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'LostBusinessDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'LostBusinessDetailCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'LostBusinessDetailDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'InitialValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'InstallationValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '0.00' },
        { name: 'OutstandingInstallations', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'RemovalValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '0.00' },
        { name: 'OutstandingRemovals', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'MonthlyUnitPrice', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'WorkLoadIndex', disabled: true, type: MntConst.eTypeDecimal2, required: false, value: '' },
        { name: 'WorkLoadIndexTotal', disabled: true, type: MntConst.eTypeDecimal2, required: false, value: '' },
        { name: 'LinkedProductCode', disabled: false, type: '', required: false, value: '' },
        { name: 'LinkedProductDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'LinkedServiceVisitFreq', disabled: true, type: '', required: false, value: '' },
        { name: 'WeighingRequiredInd', disabled: false, type: '', required: false, value: '' },
        { name: 'AverageWeight', disabled: false, type: MntConst.eTypeDecimal2, required: false, value: '' },
        { name: 'CompositeSequence', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'MinimumDuration', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PerimeterValue', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'WarrantyRenewalValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'ServiceSalesEmployee', disabled: false, type: MntConst.eTypeCode, required: true, value: '' },
        { name: 'EmployeeSurname', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'SalesEmployeeText', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'LeadEmployee', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'LeadEmployeeSurname', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'RenegOldContract', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'RenegOldPremise', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'RenegOldValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'RoutingExclusionReason', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ClientReference', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'PurchaseOrderNo', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'DOWInstallTypeCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'DOWInstallTypeDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'DOWProductCode', disabled: false, type: '', required: false, value: '' },
        { name: 'DOWProductDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'DOWPerimeterValue', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'MatchedContractNumber', disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'MatchedContractName', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'MatchedPremiseNumber', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'MatchedPremiseName', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'InspectionPoints', disabled: false, type: MntConst.eTypeInteger, required: true, value: '' },
        { name: 'SalesPlannedTime', disabled: false, type: MntConst.eTypeTime, required: true, value: '' },
        { name: 'ActualPlannedTime', disabled: false, type: MntConst.eTypeTime, required: true, value: '' },
        { name: 'AnnualCalendarTemplateNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'CalendarTemplateName', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'StandardTreatmentTime', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'ClosedCalendarTemplateNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ClosedTemplateName', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'InitialTreatmentTime', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'ServiceAnnualTime', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'AnnualTimeChange', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'HardSlotVisitTime', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'ServiceVisitFrequencyCopy', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'VisitCycleInWeeks', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'VisitCycleInWeeksOverrideNote', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'VisitsPerCycle', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'CalculatedVisits', disabled: true, type: MntConst.eTypeInteger, required: false, value: '', ignoreSubmit: true },
        { name: 'BranchServiceAreaCode', disabled: false, type: MntConst.eTypeCode, required: true, value: '' },
        { name: 'BusinessOriginDetailCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BranchServiceAreaDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'ServiceEmployeeCode', disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ServiceEmployeeSurname', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'InstallationEmployeeCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'InstallationEmployeeName', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'RemovalEmployeeCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'RemovalEmployeeName', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'EFKReplacementMonth', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'GraphNumber', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'RMMCategoryCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'RMMCategoryDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'TotalFreeAddnlVisits', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'RMMJobVisitValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'CurrentAddnlVisitCount', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'GuaranteeCommence', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'GuaranteeExpiry', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'NoGuaranteeCode', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'NoGuaranteeDescription', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'AgeofProperty', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ListedCode', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ListedDescription', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'NumberBedrooms', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'NumberOfSeasons', disabled: false, type: '', required: false, value: '' },
        { name: 'SeasonalTemplateNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'TemplateName', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '', ignoreSubmit: true },
        { name: 'DepotNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'DepotName', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'BudgetNumberInstalments', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'CanUpdateBudgetDetails', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'NextInvoiceStartDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'BudgetValidInstalments', disabled: false, type: '', required: false, value: '' },
        { name: 'NextInvoiceEndDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'BudgetInstalAmount', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'NextInvoiceValue', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'BudgetTermsDesc', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'ForwardDateChangeInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'BudgetBalance', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'DepositAmount', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'InvoiceReleasedDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'DepositAmountApplied', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'DepositPostedDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'TaxExemptionNumber', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'MultipleTaxRates', disabled: false, type: '', required: false, value: '' },
        { name: 'ConsolidateEqualTaxRates', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'TaxCodeMaterials', disabled: false, type: '', required: false, value: '' },
        { name: 'SurveyDetail', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'TaxCodeMaterialsDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'InvoiceTextMaterials', disabled: false, type: '', required: false, value: '' },
        { name: 'TaxCodeLabour', disabled: false, type: '', required: false, value: '' },
        { name: 'TaxCodeLabourDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'InvoiceTextLabour', disabled: false, type: '', required: false, value: '' },
        { name: 'TaxCodeReplacement', disabled: false, type: '', required: false, value: '' },
        { name: 'TaxCodeReplacementDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'InvoiceTextReplacement', disabled: false, type: '', required: false, value: '' },
        { name: 'APICode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'APICodeDesc', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'InvoiceSuspendText', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'EntitlementInvoiceTypeCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '', ignoreSubmit: false },
        { name: 'EntitlementInvoiceTypeDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'ServiceSpecialInstructions', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'EntitlementAnnualQuantity', disabled: false, type: MntConst.eTypeInteger, required: false, value: '', ignoreSubmit: false },
        { name: 'EntitlementNextAnnualQuantity', disabled: false, type: MntConst.eTypeInteger, required: false, value: '', ignoreSubmit: false },
        { name: 'EntitlementOrderedQuantity', disabled: true, type: MntConst.eTypeInteger, required: false, value: '', ignoreSubmit: false },
        { name: 'EntitlementYTDQuantity', disabled: true, type: MntConst.eTypeInteger, required: false, value: '', ignoreSubmit: false },
        { name: 'EntitlementServiceQuantity', disabled: false, type: MntConst.eTypeInteger, required: false, value: '', ignoreSubmit: false },
        { name: 'EntitlementPricePerUnit', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '', ignoreSubmit: false },
        { name: 'UnitDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'TrialPeriodStartDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'ProposedAnnualValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'TrialPeriodChargeValue', disabled: false, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'WindowStart01', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd01', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart08', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd08', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart02', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd02', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart09', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd09', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart03', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd03', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart10', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd10', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart04', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd04', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart11', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd11', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart05', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd05', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart12', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd12', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart06', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd06', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart13', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd13', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart07', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd07', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowStart14', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'WindowEnd14', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'MaterialsValue', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'MaterialsCost', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'LabourValue', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'LabourCost', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'ReplacementValue', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'ReplacementCost', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'WedValue', disabled: true, type: '', required: false, value: '' },
        { name: 'PricePerWED', disabled: true, type: MntConst.eTypeCurrency, required: false, value: '' },
        { name: 'rsPlantReplaceInd', disabled: true, type: '', required: false, value: '' },
        { name: 'DepreciationPeriod', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ShowValueButton', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ForwardQuantityReduction', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'InstallationRequired', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'RequireAnnualTimeInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'FieldHideList', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'FieldShowList', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'FirstInvoicedDate', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'CurrentServiceCoverRowID', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'DetailRequired', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'LostBusinessRequestNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'NegBranchNumber', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'NewPremise', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'QuantityChange', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'SavedServiceQuantity', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PendingReduction', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PendingDeletion', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'GenContractNumber', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'GenPremiseNumber', disabled: false, type: '', required: false, value: '' },
        { name: 'ErrorMessage', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '', ignoreSubmit: true },
        { name: 'NationalAccountChecked', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'NationalAccount', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'PatternWarningString', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'CustomerInfoAvailable', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'InvoiceTypeVal', disabled: true, type: MntConst.eTypeInteger, required: false, value: '', ignoreSubmit: true },
        { name: 'InvoiceTypeDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'InvoiceTypeNumber', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'FixedNumberOfSeasons', disabled: true, type: '', required: false, value: '' },
        { name: 'FirstSeasonStartDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'FOCMessageText', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'ServiceBasis', disabled: true, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'VisitFrequencyWarningMessage', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'VisitFrequencyWarningColour', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'VFPNumberOfWeeks', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'VFPNumberOfVisitsPerWeek', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'CalendarUpdateAllowed', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'LeadInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'RunningReadOnly', disabled: false, type: '', required: false, value: '' },
        { name: 'CallLogID', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'CurrentCallLogID', disabled: false, type: '', required: false, value: '' },
        { name: 'WindowClosingName', disabled: false, type: '', required: false, value: '' },
        { name: 'ClosedWithChanges', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'LinkedServiceCoverNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'SelectedComponent', disabled: false, type: '', required: false, value: '' },
        { name: 'ComponentGridCacheTime', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'CompositePricingType', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'CompositeProductCode', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'CompositeCodeList', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'CompositeDescList', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'DetailRequiredInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'SelectChange', disabled: false, type: '', required: false, value: '' },
        { name: 'TaxCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'EmployeeLimitChildDrillOptions', disabled: false, type: '', required: false, value: '' },
        { name: 'DisplayLevelInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'ExcludeUnConfirmedValues', disabled: false, type: '', required: false, value: '' },
        { name: 'DeliveryConfirmationInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'CalcAnnualValue', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'CalcAnnualValueChange', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'VisitTriggered', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'OriBranchServiceAreaCode', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'MessageDisplay', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'TaxDesc', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'PNOL', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'BranchServiceAreaSeqNo', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceTypeCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ServiceTypeDesc', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'IsTermiteProduct', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'InvTypeSel', disabled: false, type: '', required: false, value: '' },
        { name: 'InitialInvoicePeriodInYears', disabled: false, type: '', required: false, value: '' },
        { name: 'LocationsEnabled', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'ValueRequiredInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'LOSName', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'HardSlotType', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'selTaxCode', disabled: false, type: '', required: false, value: '' },
        { name: 'HardSlotTemplateNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'HardSlotVersionNumber', disabled: true, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'HardSlotEffectDate', disabled: false, type: '', required: false, value: '' },
        { name: 'InvoiceUnitValueRequired', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ServiceCoverInvTypeString', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'SubjectToUplift', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'UpliftVisitPosition', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AutoAllocation', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AutoPattern', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ValidateServiceArea', disabled: false, type: '', required: false, value: '' },
        { name: 'TodayDate', disabled: false, type: '', required: false, value: '' },
        { name: 'VisitOnDayCount', disabled: false, type: '', required: false, value: '' },
        { name: 'VisitPatternRowID', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ChangeDateInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ReplacementIncludeInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'CapableOfUplift', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'CopiedVisitCycleInWeeks', disabled: false, type: MntConst.eTypeInteger, required: false, value: '', ignoreSubmit: true },
        { name: 'CopiedVisitsPerCycle', disabled: true, type: MntConst.eTypeInteger, required: false, value: '', ignoreSubmit: true },
        { name: 'CopiedVisitCycleInWeeksOverrideNote', disabled: true, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'ShowFreeCallouts', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'PremiseWindowStart01', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd01', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart02', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd02', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart03', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd03', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart04', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd04', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart05', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd05', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart06', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd06', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart07', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd07', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart08', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd08', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart09', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd09', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart10', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd10', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart11', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd11', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart12', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd12', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart13', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd13', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowStart14', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'PremiseWindowEnd14', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart01', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd01', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart02', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd02', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart03', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd03', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart04', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd04', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart05', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd05', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart06', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd06', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart07', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd07', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart08', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd08', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart09', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd09', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart10', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd10', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart11', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd11', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart12', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd12', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart13', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd13', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowStart14', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'DefaultWindowEnd14', disabled: false, type: MntConst.eTypeTime, required: false, value: '' },
        { name: 'ServiceCoverROWID', disabled: false, type: '', required: false, value: '' },
        { name: 'DispenserInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: true },
        { name: 'ConsumableInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ContractTypeCode', disabled: false, type: '', required: false, value: '' },
        { name: 'cmdCopyServiceCover', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'SelectCompositeProductCode', disabled: false, type: '', required: false, value: '' },
        { name: 'cmdValue', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'cmdHardSlotCalendar', disabled: true, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'cmdDiaryView', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'SelServiceBasis', disabled: false, type: '', required: false, value: '' },
        { name: 'SelSubjectToUplift', disabled: false, type: '', required: false, value: '' },
        { name: 'SelUpliftVisitPosition', disabled: false, type: '', required: false, value: '' },
        { name: 'selHardSlotType', disabled: false, type: '', required: false, value: '' },
        { name: 'SelAutoPattern', disabled: false, type: '', required: false, value: '' },
        { name: 'SelAutoAllocation', disabled: false, type: '', required: false, value: '' },
        { name: 'selQuickWindowSet1', disabled: false, type: '', required: false, value: '' },
        { name: 'selQuickWindowSet2', disabled: false, type: '', required: false, value: '' },
        { name: 'selQuickWindowSet3', disabled: false, type: '', required: false, value: '' },
        { name: 'selQuickWindowSet4', disabled: false, type: '', required: false, value: '' },
        { name: 'selQuickWindowSet5', disabled: false, type: '', required: false, value: '' },
        { name: 'selQuickWindowSet6', disabled: false, type: '', required: false, value: '' },
        { name: 'selQuickWindowSet7', disabled: false, type: '', required: false, value: '' },
        { name: 'menu', disabled: true, type: '', required: false, value: 'Options', ignoreSubmit: true },
        { name: 'InvoiceAnnivDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'ServiceCommenceDate', disabled: false, type: MntConst.eTypeDate, required: true, value: '' },
        { name: 'FOCInvoiceStartDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'ExpiryDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'PurchaseOrderExpiryDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'DOWRenewalDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'ServiceVisitAnnivDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'InstallationDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'RemovalDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'VisitPatternEffectiveDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'DeliveryReleaseDate', disabled: true, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'DepositDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'EntitlementAnnivDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '', ignoreSubmit: false },
        { name: 'TrialPeriodEndDate', disabled: false, type: MntConst.eTypeDate, required: false, value: '' },
        { name: 'BusinessOriginCode', disabled: false, type: MntConst.eTypeCode, required: true, value: '' },
        { name: 'WasteTransferTypeCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'chkRenegContract', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'StockOrderAllowed', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'chkStockOrder', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'RequiresManualVisitPlanningInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'SeasonalBranchUpdate', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'FollowTemplateInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'HardSlotUpdate', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'SeasonalServiceInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'InstallByBranchInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'InvoiceSuspendInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'InvoiceOnFirstVisitInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'InvoiceReleasedInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'RetainServiceWeekdayInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WasteTransferUpdateValueInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WasteTransferAddChargeInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ContractHasExpired', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'AutoRouteProductInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'GuaranteeRequired', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WarrantyAPIAppliedInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'SuspendRenewalLetterInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'AppointmentRequiredInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'RetainServiceCoverInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'EntitlementRequiredInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '', ignoreSubmit: false },
        { name: 'MinCommitQty', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'chkFOC', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'TrialPeriodInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'TrialPeriodReleasedInd', disabled: true, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'AnnualCalendarInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WindowPreferredInd01', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WindowPreferredInd02', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WindowPreferredInd03', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WindowPreferredInd04', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WindowPreferredInd05', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WindowPreferredInd06', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'WindowPreferredInd07', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'PriceChangeOnlyInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'CompositeProductInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'PremiseDefaultTimesInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ZeroValueIncInvoice', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'HardSlotInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ServiceNotifyInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'DOWSentriconInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'RequireExemptNumberInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'ContractTrialPeriodInd', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'VisitOnDay1', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'VisitOnDay2', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'VisitOnDay3', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'VisitOnDay4', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'VisitOnDay5', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'VisitOnDay6', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'VisitOnDay7', disabled: false, type: MntConst.eTypeCheckBox, required: false, value: '' },
        { name: 'BranchServiceAreaCode1', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BranchServiceAreaCode2', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BranchServiceAreaCode3', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BranchServiceAreaCode4', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BranchServiceAreaCode5', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BranchServiceAreaCode6', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'BranchServiceAreaCode7', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'CustomerAvailTemplateID', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PreferredDayOfWeekReasonCode', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PreferredDayOfWeekReasonLangDesc', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'cmdCustomerInfo', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'cmdComponentSelAll', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'cmdComponentDesAll', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'cmdCalculate', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'btnDepositAdd', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'btnDefaultValue', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'cmdRefreshDisplayVal', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'save', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'cancel', disabled: false, type: '', required: false, value: '', ignoreSubmit: true },
        { name: 'riGridHandle', disabled: false, type: MntConst.eTypeText, required: false, value: '', ignoreSubmit: true },
        { name: 'DepositAddAdditional', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'DepositCanAmend', disabled: false, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'DepositExists', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '' },
        { name: 'UpliftTemplateNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'UpliftTemplateName', disabled: true, type: MntConst.eTypeTextFree, required: false, value: '', ignoreSubmit: true },
        { name: 'BusinessOriginDesc', readonly: false, disabled: true, required: false, ignoreSubmit: true }

    ];
    public xhrParams = {
        module: 'service-cover',
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAServiceCoverMaintenance'
    };

    public uiDisplay: any = {
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
    public tabByNames: [any] = ['grdGeneral', 'grdComponent', 'grdReduceDisplays', 'grdGeneraldetail',
        'grdService', 'grdVisitPattern', 'grdGuarantee', 'grdSeasonalService', 'grdInvoice', 'grdSpecialInst', 'grdEntitlement',
        'grdTrialPeriod', 'grdTimeWindows', 'grdSurveyDetail', 'grdDisplayValue1'];

    public context: ServiceCoverMaintenanceComponent;
    public parent: ServiceCoverMaintenanceComponent;

    public iCABSAServiceCoverMaintenance1: ServiceCoverMaintenance1;
    public iCABSAServiceCoverMaintenance2: ServiceCoverMaintenance2;
    public iCABSAServiceCoverMaintenance3: ServiceCoverMaintenance3;
    public iCABSAServiceCoverMaintenance4: ServiceCoverMaintenance4;
    public iCABSAServiceCoverMaintenance5: ServiceCoverMaintenance5;
    public iCABSAServiceCoverMaintenance6: ServiceCoverMaintenance6;
    public iCABSAServiceCoverMaintenance7: ServiceCoverMaintenance7;
    public iCABSAServiceCoverMaintenance8: ServiceCoverMaintenance8;
    public iCABSAServiceCoverMaintenanceLoad: ServiceCoverMaintenanceLoad;
    public iCABSAServiceCoverMaintenanceLoadVTs: ServiceCoverMaintenanceLoadVTs;
    public iCABSAServiceCoverMaintenanceVTs: ServiceCoverMaintenanceVTs;
    private subSysChar: Subscription;
    private lookUpSubscription: Subscription;
    public accessSubscription: Subscription;
    public contractSearchComponent = ContractSearchComponent;
    public premiseSearchComponent: Component;
    public closedTempComponent: Component;
    public closedTempComponentUplift: Component;
    public annualTempComponent: Component;
    public serviceCoverSearchComponent: Component;
    public linkedServiceCoverSearchComponent: Component;
    public screennotready: Component;
    public DeportSearchComponent = DeportSearchComponent;
    public branchServiceAreaComponent = BranchServiceAreaSearchComponent;
    public branchServiceAreaComponentVP = BranchServiceAreaSearchComponent;
    public serviceCoverCopyComponent: Component;
    public employeeSearchComponent = EmployeeSearchComponent;
    public apiSearchComponent = ICABSBAPICodeSearchComponent;
    public taxCodeSearchComponent = TaxCodeSearchComponent;
    public seasonalTemplateNumberSearch: Component;
    public pages: [any];
    public dateObj = {
        InvoiceAnnivDate: {
            InvoiceAnnivDateDT: null,
            isDisabled: true
        }
    };

    constructor(injector: Injector) {
        super(injector);
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
        this.iCABSAServiceCoverMaintenanceVTs = new ServiceCoverMaintenanceVTs(this);
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

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: data.title }, false);
    }

    public showAlert(msgTxt: string, type?: number): void {
        this.logger.log('showAlert', msgTxt);
        //let translation = this.getTranslatedValue(msgTxt, null); //TODO - Translation needs to be included in the base component
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = MessageConstant.Message.ErrorTitle; break;
            case 1: titleModal = MessageConstant.Message.SuccessTitle; break;
            case 2: titleModal = MessageConstant.Message.WarningTitle; break;
            case 3: titleModal = MessageConstant.Message.MessageTitle; break;
        }

        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    }

    public renderTab(tabindex: number, markRed?: boolean): void {
        let elem: any = document.querySelector('.nav-tabs');
        if (elem) {
            elem = elem.children;
            for (let i = 0; i < elem.length; i++) {
                //if (this.utils.hasClass(elem[i], 'error')) {
                this.utils.removeClass(elem[i], 'active');
                this.utils.removeClass(document.querySelector('.tab-content').children[i], 'active');
                //}
            }
            let i = 0;
            for (let tab in this.uiDisplay.tab) {
                if (tab !== '') {
                    i++;
                    this.uiDisplay.tab[tab].active = (i === tabindex) ? true : false;
                }
            }
            //Failsafe
            let id = this.tabByNames[tabindex - 1];
            let li = document.querySelector('.nav-tabs #' + id);
            this.utils.addClass(li, 'active');
            let tabelem = document.querySelector('.tab-content #' + id).parentElement;
            this.utils.addClass(tabelem, 'active');
            if (markRed) {
                setTimeout(this.utils.makeTabsRedById(this.pageParams.tabsVisited), 200);
            }
            if (tabindex === 2) {
                this.context.iCABSAServiceCoverMaintenance3.riTab_TabFocusAfterComponent();
            } else if (tabindex === 3) {
                this.context.iCABSAServiceCoverMaintenance3.riTab_TabFocusAfterDisplays();
            }
            if (this.pageParams.tabsVisited && this.pageParams.tabsVisited.indexOf(id) === -1) {
                this.pageParams.tabsVisited.push(id);
            }
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.premiseSearchComponent = PremiseSearchComponent;
        this.closedTempComponent = ClosedTemplateSearchComponent;
        this.closedTempComponentUplift = ClosedTemplateSearchComponent;
        this.annualTempComponent = CalendarTemplateSearchComponent;
        this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        this.serviceCoverCopyComponent = ServiceCoverSearchComponent;
        this.linkedServiceCoverSearchComponent = ServiceCoverSearchComponent;
        this.seasonalTemplateNumberSearch = SeasonalTemplateSearchComponent;
        this.screennotready = ScreenNotReadyComponent;
        this.pageParams.spanServiceQuantityLab_innerText = 'Service Quantity';
        this.pageParams.spanUnconfirmedDeliveryQtyLab_innerText = 'Quantity';
        if (this.riExchange.URLParameterContains('PendingReduction')) {
            this.serviceCoverSearchParams.showAddNew = false;
        } else {
            this.serviceCoverSearchParams.showAddNew = true;
        }
        if (this.riExchange.getParentHTMLValue('RunningReadOnly') === 'yes') {
            this.serviceCoverSearchParams.showAddNew = false;
        }
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
            this.linkedServiceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
            this.linkedServiceCoverSearchParams.ContractName = this.getControlValue('ContractName');
            this.linkedServiceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
            this.linkedServiceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
            return;
        }
        this.pageParams.menu = [];
        this.pageParams.riComponentGridPageCurrent = 1;
        this.context.pageParams.riComponentTotalRecords = 1;
        this.pageParams.riDisplayGridPageCurrent = 1;
        this.context.pageParams.riDisplayGridTotalRecords = 1;
        this.inputParamsContractSearch.currentContractType = this.pageParams.currentContractType;
        this.inputParamsAccountPremise.currentContractType = this.pageParams.currentContractType;
        this.inputRenegPremiseSearch.currentContractType = this.pageParams.currentContractType;
        this.context.pageParams.strDocTitle = this.context.riExchange.getCurrentContractTypeLabel();
        this.context.pageParams.strInpTitle = this.context.riExchange.getCurrentContractTypeLabel();
        let translation = this.getTranslatedValue('Service Cover Maintenance').toPromise();
        translation.then((resp) => {
            this.utils.setTitle(this.context.pageParams.strDocTitle + ' ' + resp);
        });
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
            //this.context.pageParams.uiDisplay.trStandardTreatmentTime = false;
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
        this.iCABSAServiceCoverMaintenanceLoad.getServiceCoverRowIDForCallingProgram();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riExchange.getCurrentContractType());
        if (this.riMaintenance.CurrentMode !== MntConst.eModeSelect) {
            this.getSysCharDtetails();
            this.accessSubscription = this.utils.getUserAccessType().subscribe(data => {
                this.pageParams.FullAccess = data;
            }, error => {
                this.pageParams.FullAccess = 'Restricted';
            });
        }
        setTimeout(() => {
            this.isReturningFlag = false;
            this.initialising = false;
        }, 4000);

    }

    public populateEllipsisParams(): void {
        this.inputParamsContractSearch.accountNumber = this.getControlValue('AccountNumber');
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
        this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName');
        this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
        this.linkedServiceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
        this.linkedServiceCoverSearchParams.ContractName = this.getControlValue('ContractName');
        this.linkedServiceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.linkedServiceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
    }

    public initPageParams(): void {
        this.pageParams.tabsVisited = ['grdGeneral'];
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
        this.pageParams.uiDisplay.selUpliftVisitPosLabel = false;
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
        this.pageParams.uiDisplay.VisitFrequencyWarningColour = 'transparent';
        this.pageParams.LostBusinessCodeSelected = { id: '', text: '' };
        this.pageParams.LostBusinessDetailCodeSelected = { id: '', text: '' };
        this.pageParams.NoGuaranteeCodeSelected = { id: '', text: '' };
        this.pageParams.RMMCategoryCodeSelected = { id: '', text: '' };
        this.pageParams.ServiceTypeCodeSelected = { id: '', text: '' };
        this.pageParams.PreferredDayOfWeekReasonCodeSelected = { id: '', text: '' };
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
        this.pageParams.dtSeasonalFromDate1 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalFromDate2 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalFromDate3 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalFromDate4 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalFromDate5 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalFromDate6 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalFromDate7 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalFromDate8 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalToDate1 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalToDate2 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalToDate3 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalToDate4 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalToDate5 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalToDate6 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalToDate7 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.dtSeasonalToDate8 = { value: null, disabled: false, required: false, error: false };
        this.pageParams.businessOriginCodeSelected = { id: '', text: '' };
    }

    public clearDateFields(): void {
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
        for (let i = 1; i <= 8; i++) {
            if (this.pageParams['dtSeasonalFromDate' + i]) {
                this.pageParams['dtSeasonalFromDate' + i].value = null;
            }
            if (this.pageParams['dtSeasonalToDate' + i]) {
                this.pageParams['dtSeasonalToDate' + i].value = null;
            }
        }
    }

    public cleardate(id: string): void {
        if (document.querySelector('#' + id)) {
            let elem = document.querySelector('#' + id).parentElement;
            if (elem.lastElementChild.firstElementChild) {
                let dateField = elem.lastElementChild.firstElementChild.firstElementChild.firstElementChild;
                let dateFieldID = dateField.getAttribute('id');
                setTimeout(() => {
                    if (document.getElementById(dateFieldID)) {
                        document.getElementById(dateFieldID)['value'] = '';
                    }
                }, 0);
            }
        }
    }

    public createSeasonalEntry(): void {
        for (let i = 1; i <= 8; i++) {
            let season: any = {
                trRow: false,
                SeasonNumber: 'SeasonNumber' + i,
                SeasonalFromDate: 'SeasonalFromDate' + i,
                SeasonalFromWeek: 'SeasonalFromWeek' + i,
                SeasonalFromYear: 'SeasonalFromYear' + i,
                SeasonalToDate: 'SeasonalToDate' + i,
                SeasonalToWeek: 'SeasonalToWeek' + i,
                SeasonalToYear: 'SeasonalToYear' + i,
                SeasonNoOfVisits: 'SeasonNoOfVisits' + i,
                number: i
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
    }

    public ngOnDestroy(): void {
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        if (this.statusChangeSubscription) {
            this.statusChangeSubscription.unsubscribe();
        }
        if (this.accessSubscription) {
            this.accessSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
        this.setControlValue('menu', 'Options');
        if (this.isReturning()) {
            for (let key in this.uiForm.controls) {
                if (key) {
                    let type = this.riExchange.getCtrlType(this.controls, key);
                    if (type === MntConst.eTypeDate && this.uiForm.controls[key]['value']) {
                        setTimeout(() => {
                            this.setDateToFields(key, this.uiForm.controls[key]['value']);
                        }, 10);
                    }
                }
            }
            this.disableControl('menu', false);
            if (this.pageParams['updateMatchedDisplayValues']) {
                this.uiForm.controls['ServiceQuantity'].markAsDirty();
                this.uiForm.controls['ServiceAnnualValue'].markAsDirty();
            }
            setTimeout(() => {
                this.isReturningFlag = false;
                this.initialising = false;
            }, 4000);
            this.initialLoad = false;
            if (this.pageParams.saveReturnCallback) {
                setTimeout(() => {
                    this.processPostSaveMethods();
                }, 1000);
                this.pageParams.saveReturnCallback = false;
            } else {
                if (this.context.LastChangeEffectDatePicker) {
                    this.context.LastChangeEffectDatePicker.validateDateField();
                }
            }
            return;
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeSelect) {
            this.initiPageState();
            this.riMaintenance.execMode(MntConst.eModeSelect, this.pages);
            this.iCABSAServiceCoverMaintenance7.riMaintenance_Search();
        }
    }

    public processPostSaveMethods(): void {
        if (!this.pageParams.saveReturnMethod) {
            return;
        }
        switch (this.pageParams.saveReturnMethod) {
            case this.postSaveMethodType.POST_SAVE_ADD_1:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd1();
                break;
            case this.postSaveMethodType.POST_SAVE_ADD_2:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd2();
                break;
            case this.postSaveMethodType.POST_SAVE_ADD_3:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd3();
                break;
            case this.postSaveMethodType.POST_SAVE_ADD_3A:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd3A();
                break;
            case this.postSaveMethodType.POST_SAVE_ADD_4:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd4();
                break;
            case this.postSaveMethodType.POST_SAVE_ADD_5:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd5();
                break;
            case this.postSaveMethodType.POST_SAVE_ADD_6:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSaveAdd6();
                break;
            case this.postSaveMethodType.POST_SAVE_UPDATE_1:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave1();
                break;
            case this.postSaveMethodType.POST_SAVE_UPDATE_2:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave2();
                break;
            case this.postSaveMethodType.POST_SAVE_UPDATE_3:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave3();
                break;
            case this.postSaveMethodType.POST_SAVE_UPDATE_4:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave4();
                break;
            case this.postSaveMethodType.POST_SAVE_UPDATE_5:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave5();
                break;
            case this.postSaveMethodType.POST_SAVE_UPDATE_6:
                this.iCABSAServiceCoverMaintenance7.riMaintenance_AfterSave6();
                break;
        }
    }

    public getSysCharDtetails(noInit?: boolean): any {
        this.ajaxSource.next(this.ajaxconstant.START);
        let sysCharList: number[] = [
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
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vEnableInsEmpCodeValidation = record[0].Required;
            this.pageParams.vEnableSurveyDetail = record[1].Required;
            this.pageParams.vShowWasteHistory = record[2].Required;
            this.pageParams.vEnableServiceCoverDispLev = record[3].Required;
            this.pageParams.vEnableTabularView = record[4].Required;
            this.pageParams.vEnableSpecificVisitDays = record[5].Required;
            this.pageParams.vSCVisitTolerances = record[6].Required;
            this.pageParams.vSCInfestationTolerances = record[7].Required;
            this.pageParams.vEnablePostcodeDefaulting = record[8].Required;
            this.pageParams.vEnableServiceCoverDetail = record[9].Required;
            this.pageParams.vEnableInstallsRemovals = record[10].Required;
            this.pageParams.vEnableEntitlement = record[11].Required;
            this.pageParams.vEnableNationalAccountWarning = record[12].Required;
            this.pageParams.vEnableRetentionOfServiceWeekDay = record[13].Required;
            this.pageParams.vEnableFreeOfChargeServices = record[14].Required;
            this.pageParams.vEnableTrialPeriodServices = record[15].Required;
            this.pageParams.vEnableAPICodeEntry = record[16].Required;
            this.pageParams.vEnableWorkLoadIndex = record[17].Required;
            this.pageParams.vEnableMonthlyUnitPrice = record[18].Required;
            this.pageParams.vSuspendSalesStatPortFig = record[19].Required;
            this.pageParams.vEnableInitialTreatmentTime = record[20].Required;
            this.pageParams.vEnableRouteOptimisation = record[21].Required;
            this.pageParams.vShowPremiseWasteTab = record[22].Required;
            this.pageParams.vEnableServiceCoverDispLev = record[23].Required;
            this.pageParams.vEnableWED = record[24].Required;
            this.pageParams.vDisplayLevelInstall = record[25].Required;
            this.pageParams.vEnableDeliveryRelease = record[26].Required;
            this.pageParams.vEnableServiceCoverDepreciation = record[27].Required;
            this.pageParams.vEnableSpecificVisitDays = record[28].Required;
            this.pageParams.vEnableProductLinking = record[29].Required;
            this.pageParams.vDefaultStockReplenishment = record[30].Required;
            this.pageParams.vShowServiceDepot = record[31].Required;
            this.pageParams.vWeeklyVisitPatternReq = record[32].Required;
            this.pageParams.vEnableJobsToInvoiceAfterVisit = record[33].Required;
            this.pageParams.vEnableStandardTreatmentTime = record[34].Required;
            this.pageParams.vEnableInitialCharge = record[35].Required;
            this.pageParams.vEnableTimePlanning = record[36].Required;
            this.pageParams.vEnableServiceCoverAvgWeightReq = record[37].Required;
            this.pageParams.vEnableMultipleTaxRates = record[38].Required;
            this.pageParams.vEnableLocations = record[39].Required;
            this.pageParams.vBlank = record[40].Required;
            this.pageParams.vDefaultTaxCodeProductExpenseReq = record[41].Required;
            this.pageParams.vSCEnableWasteTransfer = record[42].Required;
            this.pageParams.vSCEnableProductServiceType = record[43].Required;
            this.pageParams.vEnableDepositProcessing = record[44].Required;
            this.pageParams.vEnableTabularView = record[45].Required;
            this.pageParams.vEnableInsEmpCodeValidation = record[46].Required;
            this.pageParams.vEnableSurveyDetail = record[47].Required;
            this.pageParams.vShowWasteHistory = record[48].Required;
            this.pageParams.vEnableServiceCoverDispLev = record[49].Required;
            this.pageParams.vEnableTabularView = record[50].Required;
            this.pageParams.vEnableSpecificVisitDays = record[51].Required;
            this.pageParams.vSCVisitTolerances = record[52].Required;
            this.pageParams.vSCInfestationTolerances = record[53].Required;
            this.pageParams.vSCValidateInvoiceTypeOnNewSC = record[54].Required;
            this.pageParams.vSCEnableAPTByServiceType = record[55].Required;
            this.pageParams.vEnableSpecificVisitDays = record[56].Required;
            this.pageParams.vSCPORefsAtServiceCover = record[57].Required;
            this.pageParams.vSCRepeatSalesMatching = record[58].Required;
            this.pageParams.vSCEnableTechDiary = record[59].Required;
            this.pageParams.vWeeklyVisitPatternLog = record[32].Logical;
            this.pageParams.vJobInvoiceFirstVisitValue = record[33].Value;
            this.pageParams.vEnableSTTEntry = record[34].Logical;
            this.pageParams.vEnableInitialChargeorInstall = record[35].Logical;
            this.pageParams.vShowInspectionPoint = record[36].Logical;
            this.pageParams.vEnableServiceCoverAvgWeightText = record[37].Text;
            this.pageParams.vOverrideMultipleTaxRates = record[38].Logical;
            this.pageParams.vEnableDetailLocations = record[39].Logical;
            this.pageParams.vLocationsSingleEntry = record[40].Logical;
            this.pageParams.vDefaultTaxCodeProductExpenseLog = record[41].Logical;

            this.pageParams.vEnableSTTEntry = (this.pageParams.vEnableSTTEntry && this.pageParams.vEnableStandardTreatmentTime);
            this.pageParams.vEnableWeeklyVisitPattern = (this.pageParams.vWeeklyVisitPatternReq && this.pageParams.vWeeklyVisitPatternLog);
            this.getregistryValues(noInit);
        });
    }

    private getregistryValues(noInit?: boolean): void {
        let lookupIP = [
            {
                'table': 'BusinessRegistry',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'RegSection': 'DOW Sentricon',
                    'RegKey': 'Enable DOW Sentricon'
                    //'EffectiveDate': this.utils.Today()
                },
                'fields': ['RegValue']
            },
            {
                'table': 'BusinessRegistry',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'RegSection': 'European Biocide Regime',
                    'RegKey': 'Enable_RMM'
                    //'EffectiveDate': this.utils.Today()
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
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0] && data[0][0]) {
                this.pageParams.vDOWSentriconParams = data[0][0]['RegValue'];
            }
            if (data[1] && data[1][0]) {
                this.pageParams.vRegEnableRMM = data[1][0]['RegValue'];
            }
            if (data[2] && data[2][0]) {
                this.pageParams.gcRegContactCentreReview = data[2][0]['RegValue'];
            }
            let vTimeSeparator = ':';
            if (data[3] && data[3][0]) {
                vTimeSeparator = data[3][0]['riTimeSeparator'];
            }
            if (vTimeSeparator) {
                this.pageParams.vbTimeSeparator = vTimeSeparator;
            } else {
                this.pageParams.vbTimeSeparator = ':';
            }

            if (this.pageParams.vDOWSentriconParams === 'YES') {
                this.pageParams.vEnableDOWSentricon = true;
            } else {
                this.pageParams.vEnableDOWSentricon = false;
            }
            if (this.pageParams.vRegEnableRMM && this.pageParams.vRegEnableRMM.toString().toUpperCase() === 'TRUE') {
                this.pageParams.vEnableRMM = true;
            } else {
                this.pageParams.vEnableRMM = false;
            }

            if (this.pageParams.gcRegContactCentreReview === 'Y') {
                this.pageParams.lRegContactCentreReview = true;
            } else {
                this.pageParams.lRegContactCentreReview = false;
            }
            //TODO  -Revisit when sub files are completed
            if (!noInit && this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.iCABSAServiceCoverMaintenance1.init();
                this.disableControl('ContractNumber', true);
                this.disableControl('PremiseNumber', true);
                this.disableControl('ProductCode', true);
                this.disableControl('menu', false);
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    public ZeroPadInt(i: number, numDigits: number): string {
        let ret = i + '';
        ret = (i < 10) ? ('0' + i) : ret;
        return ret;
    }

    public getURLQueryParameters(param: any): void {
        if (param.fromMenu === 'true') {
            this.riMaintenance.CurrentMode = MntConst.eModeSelect;
        } else {
            this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        }
    }

    public setContractNumber(event: any): void {
        this.businessOriginCodeSearchParams.businessCode = this.context.businessCode();
        this.businessOriginCodeSearchParams.countryCode = this.context.countryCode();
        this.reasonCodeSearchParams.businessCode = this.context.businessCode();
        this.reasonCodeSearchParams.countryCode = this.context.countryCode();
        this.detailCodeSearchParams.businessCode = this.context.businessCode();
        this.detailCodeSearchParams.countryCode = this.context.countryCode();
        this.rmmCategorySearchParams.businessCode = this.context.businessCode();
        this.rmmCategorySearchParams.countryCode = this.context.countryCode();
        this.serviceTypeCodeSearchParams.businessCode = this.context.businessCode();
        this.serviceTypeCodeSearchParams.countryCode = this.context.countryCode();
        this.businessOriginDropDown.fetchBusinessOriginLangSearchData();
        this.rmmCategoryDropDown.fetchRMMCategoryLanguageSearchDropDown();
        this.serviceTypeCodeDropDown.fetchServiceType();
        this.preferredDaySearchParams.businessCode = this.context.businessCode();
        this.preferredDaySearchParams.countryCode = this.context.countryCode();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', event.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', event.ContractName);
        this.accessSubscription = this.utils.getUserAccessType().subscribe(data => {
            this.pageParams.FullAccess = data;
        }, error => {
            this.pageParams.FullAccess = 'Restricted';
        });
        this.uiForm.controls['ContractNumber'].markAsDirty();
        this.disableControl('PremiseNumber', false);
        this.inputParamsAccountPremise.ContractNumber = event.ContractNumber;
        this.inputParamsAccountPremise.ContractName = event.ContractName;
        this.serviceCoverSearchParams.ContractNumber = event.ContractNumber;
        this.serviceCoverSearchParams.ContractName = event.ContractName;
        this.linkedServiceCoverSearchParams.ContractNumber = event.ContractNumber;
        this.linkedServiceCoverSearchParams.ContractName = event.ContractName;
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd ||
            this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.iCABSAServiceCoverMaintenance3.GetDefaultTaxCode();
            this.context.iCABSAServiceCoverMaintenance3.BuildTaxCodeCombo();
        }
        this.context.getSysCharDtetails(true);
        if (typeof this.modalCallback === 'function') {
            this.modalCallback();
        }
    }

    public onPremiseSearchDataReceived(data: any): void {
        if (data) {
            this.setControlValue('PremiseNumber', data.PremiseNumber);
            this.setControlValue('PremiseName', data.PremiseName);
            this.uiForm.controls['PremiseNumber'].markAsDirty();
            this.disableControl('ProductCode', false);
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.disableControl('cmdCopyServiceCover', false);
            }
            this.serviceCoverSearchParams.PremiseNumber = data.PremiseNumber;
            this.serviceCoverSearchParams.PremiseName = data.PremiseName;
            this.linkedServiceCoverSearchParams.PremiseNumber = data.PremiseNumber;
            this.linkedServiceCoverSearchParams.PremiseName = data.PremiseName;
        }
        if (typeof this.modalCallback === 'function') {
            this.modalCallback();
        }
    }

    public setBranchServiceArea(event: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', event.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', event.BranchServiceAreaDesc);
        this.uiForm.controls['BranchServiceAreaCode'].markAsDirty();
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    }

    public setBranchServiceAreaVP(event: any, field: string): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, field, event.BranchServiceAreaCode);
    }

    public setClosedTemp(event: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedCalendarTemplateNumber', event.ClosedCalendarTemplateNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedTemplateName', event.TemplateName);
    }

    public setClosedTempUplift(event: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'UpliftTemplateNumber', event.UpliftTemplateNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'UpliftTemplateName', event.UpliftTemplateName);
    }

    public setAnnualTemp(event: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AnnualCalendarTemplateNumber', event.AnnualCalendarTemplateNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CalendarTemplateName', event.TemplateName);
    }

    public openSearchModal(comp: EllipsisComponent, callback?: any): void {
        if (typeof callback === 'function') {
            this.modalCallback = callback;
        }
        comp.openModal();
    }

    public setDateToFields(fieldName: string, value: string): void {
        try {
            this.setControlValue(fieldName, value);
            if (value && typeof value !== 'string') {
                this.pageParams['dt' + fieldName].value = new Date(value);
                return;
            }
            if (value) {
                let tempDateString = this.globalize.parseDateToFixedFormat(value).toString();
                this.pageParams['dt' + fieldName].value = new Date(tempDateString);
            } else {
                if (this.pageParams['dt' + fieldName].value !== null) {
                    this.pageParams['dt' + fieldName].value = null;
                } else {
                    this.pageParams['dt' + fieldName].value = void 0;
                }
            }
        } catch (e) {
            // statement
        }
    }

    public dateToSelectedValue(value: any, id: string): void {
        if (value && value.value && value.trigger) {
            if (!this.isReturning()
                && !this.initialising) {
                this.setControlValue(id, value.value);
                if (this.uiForm.controls.hasOwnProperty(id)) {
                    this.uiForm.controls[id].markAsDirty();
                }
                if (!this.isReturning() && !this.initialising) {
                    this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
                    if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                        this.formIsDirty = true;
                    }
                }
            }
        } else if (value && value.trigger) {
            this.setControlValue(id, value.value);
            if (this.uiForm.controls.hasOwnProperty(id)) {
                this.uiForm.controls[id].markAsDirty();
            }
        }
    }

    public seasonalDateFromSelectedValue(value: any, id: string): void {
        if (value && value.trigger) {
            this.setControlValue(id, value.value);
            if (this.uiForm.controls.hasOwnProperty(id)) {
                this.uiForm.controls[id].markAsDirty();
            }
            let c = this.utils.Right(id, 1);
            this.context.iCABSAServiceCoverMaintenance7.SeasonalDateChange(id, 'SeasonalFromWeek' + c, 'SeasonalFromYear' + c);
        }
    }

    public seasonalDateToSelectedValue(value: any, id: string): void {
        if (value && value.trigger) {
            this.setControlValue(id, value.value);
            if (this.uiForm.controls.hasOwnProperty(id)) {
                this.uiForm.controls[id].markAsDirty();
            }
            let c = this.utils.Right(id, 1);
            this.context.iCABSAServiceCoverMaintenance7.SeasonalDateChange(id, 'SeasonalToWeek' + c, 'SeasonalToYear' + c);
        }
    }

    public handleProductUpdateChange(): void {
        this.context.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
        if (!this.isTermiteContract) {
            if (this.context.pageParams.vbEnableProductServiceType) {
                this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
            }
            this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
            this.iCABSAServiceCoverMaintenance1.init();
            this.formIsDirty = true;
        } else {
            this.isTermiteContract = false;
            this.handleInvalidSelectionExit();
        }
    }

    public setProductCode(data: any): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.productSelectedForAdd) {
                this.uiForm.controls['ProductCode'].markAsDirty();
                this.setControlValue('ProductCode', data.ProductCode);
                this.setControlValue('ProductDesc', data.ProductDesc);
                this.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
                return;
            }
            this.productSelectedForAdd = true;
            this.copyMode = false;
            this.setControlValue('ProductCode', data.ProductCode);
            this.uiForm.controls['ProductCode'].markAsDirty();
            this.setControlValue('ProductDesc', data.ProductDesc);
            this.enableForm();
            //this.disableControl('ContractNumber', true);
            //this.disableControl('PremiseNumber', true);
            //this.disableControl('ProductCode', true);
            this.context.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
            this.iCABSAServiceCoverMaintenance1.init();
            this.formIsDirty = true;
        } else {
            if (data.parentMode && data.parentMode === 'SearchAdd') {
                this.initialLoad = true;
                this.productSelectedForAdd = false;
                this.riMaintenance.CurrentMode = MntConst.eModeAdd;
                this.serviceCoverSearchParams.parentMode = 'ServiceCover-' + this.riExchange.getCurrentContractType();
                this.serviceCoverSearchComponent = ProductSearchGridComponent;
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber') !== ''
                    && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber') !== '') {
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'cmdCopyServiceCover');
                } else {
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'cmdCopyServiceCover');
                }
                setTimeout(function (): void {
                    this.serviceCoverSearch.openModal();
                }.bind(this), 1000);
                this.initMode(this.Mode.ADD);
                this.clearDateFields();
                this.iCABSAServiceCoverMaintenance1.riMaintenance_BeforeAdd();
            } else {
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
                this.iCABSAServiceCoverMaintenance1.init();
            }
        }
    }

    public onProductCodeChange(): void {
        if (this.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ProductCode')) {
            if (this.getControlValue('ProductCode')) {
                this.setControlValue('ProductCode', this.getControlValue('ProductCode').toUpperCase());
            }
            if (this.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
                this.disableControl('ContractNumber', true);
                this.disableControl('PremiseNumber', true);
                this.disableControl('ProductCode', true);
            }
            if (this.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
                this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
                this.disableControl('menu', false);
                this.initMode(this.Mode.UPDATE);
            } else {
                this.formIsDirty = true;
            }
            this.enableForm();
            this.context.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
            if (this.productSelectedForAdd) {
                this.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
                return;
            }
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.productSelectedForAdd = true;
            }
            this.iCABSAServiceCoverMaintenance1.init();
        }
    }

    public tabOutOfProductCode(): void {
        if (this.productSelectedForAdd) {
            let tabIndices = this.getCurrentAndNextTab();
            let currtab = tabIndices.currTab + 1;
            this.utils.getFirstFocusableFieldForTab(tabIndices.nextTabIndex);
        }
    }

    public initMode(mode: number): void {
        let contractNum = this.getControlValue('ContractNumber');
        let contractname = this.getControlValue('ContractName');
        let premiseNume = this.getControlValue('PremiseNumber');
        let premisename = this.getControlValue('PremiseName');
        let contractType = this.getControlValue('ContractTypeCode');
        let productCode, productName, ServiceCoverROWID = '';
        if (mode === this.Mode.UPDATE) {
            productCode = this.getControlValue('ProductCode');
            productName = this.getControlValue('ProductDesc');
            ServiceCoverROWID = this.getControlValue('ServiceCoverROWID');
        }
        for (let key in this.uiForm.controls) {
            if (key && this.uiForm.controls.hasOwnProperty(key)) {
                this.uiForm.controls[key].markAsPristine();
                this.setControlValue(key, '');
            }
        }
        this.setButtonText();
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
        if (!this.copyMode) {
            this.uiForm.controls['ContractNumber'].markAsDirty();
            this.uiForm.controls['PremiseNumber'].markAsDirty();
        }
        if (mode === this.Mode.UPDATE) {
            this.disableControl('ContractNumber', true);
            this.disableControl('PremiseNumber', true);
            //this.disableControl('ProductCode', false);
        } else if (mode === this.Mode.ADD) {
            this.disableControl('ContractNumber', false);
            this.disableControl('PremiseNumber', false);
            this.disableControl('ProductCode', false);
        }
    }

    public enableForm(): void {
        this.uiForm.enable();
        for (let i = 0; i < this.controls.length; i++) {
            if (this.controls[i].disabled) {
                this.disableControl(this.controls[i].name, true);
            }
        }
        this.setButtonText();
    }

    public getValueForService(field: string): string {
        let ret = this.context.getControlValue(field);
        if (field === 'CallLogID' && !ret) {
            ret = '';
        }

        if ((field.indexOf('WindowStart') > -1) || (field.indexOf('WindowEnd') > -1)
            || (field.indexOf('HardSlotVisitTime') > -1)) {
            if (ret) {
                return this.context.utils.hmsToSeconds(ret);
            } else {
                return ret;
            }
        }

        if (typeof ret === 'boolean') {
            if (ret) {
                return 'yes';
            } else {
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
            } else {
                return ret;
            }
        } else {
            return ret;
        }
    }

    public handleCancel(): void {
        this.isRequesting = true;
        this.formIsDirty = false;
        this.pageParams.tabsVisited = [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
        this.utils.makeTabsNormal();
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.riExchange.renderForm(this.uiForm, this.pageParams.initialForm);
            setTimeout(() => {
                this.restorePageParams();
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
        } else if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.serviceCoverSearchParams.PremiseNumber = '';
            this.serviceCoverSearchParams.PremiseName = '';
            this.inputParamsAccountPremise.ContractNumber = '';
            this.inputParamsAccountPremise.ContractName = '';
            this.serviceCoverSearchParams.ContractNumber = '';
            this.serviceCoverSearchParams.ContractName = '';
            this.linkedServiceCoverSearchParams.PremiseNumber = '';
            this.linkedServiceCoverSearchParams.PremiseName = '';
            this.linkedServiceCoverSearchParams.ProductCode = '';
            this.linkedServiceCoverSearchParams.ProductDesc = '';
            this.linkedServiceCoverSearchParams.ContractNumber = '';
            this.linkedServiceCoverSearchParams.ContractName = '';
            this.linkedServiceCoverSearchParams.DispenserInd = '';
            this.linkedServiceCoverSearchParams.ConsumableInd = '';
            this.linkedServiceCoverSearchParams.LinkedProductCode = '';
            this.linkedServiceCoverSearchParams.LinkedProductDesc = '';
            this.serviceCoverSearchParams.parentMode = 'Search';
            this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
            this.inputParamsContractSearch.accountNumber = '';
            this.pageParams.uiDisplay.tdContractHasExpired = false;
            this.pageParams.uiDisplay.tdNationalAccount = false;
            this.pageParams.uiDisplay.tdPNOL = false;
            this.pageParams.uiDisplay.tdLineOfService = false;
            this.productSelectedForAdd = false;
            this.initiPageState();
            setTimeout(() => {
                this.contractSearch.openModal();
            }, 1000);
        }
        this.iCABSAServiceCoverMaintenance7.CreateTabs();
        this.renderTab(1);
        this.isRequesting = false;
    }

    public restorePageParams(): void {
        for (let key in this.pageParams.initialUIDisplay) {
            if (key && this.pageParams.uiDisplay.hasOwnProperty(key)) {
                this.pageParams.uiDisplay[key] = this.pageParams.initialUIDisplay[key];
            }
        }
    }

    public storePageParams(): void {
        this.pageParams.initialUIDisplay = {};
        for (let key in this.pageParams.uiDisplay) {
            if (key && this.pageParams.uiDisplay.hasOwnProperty(key)) {
                this.pageParams.initialUIDisplay[key] = this.pageParams.uiDisplay[key];
            }
        }
    }

    public initiPageState(): void {
        this.uiForm.reset();
        this.pageParams.businessOriginCodeSelected = {
            id: '',
            text: ''
        };
        this.pageParams.LostBusinessCodeSelected = {
            id: '',
            text: ''
        };
        this.pageParams.LostBusinessDetailCodeSelected = {
            id: '',
            text: ''
        };
        this.pageParams.NoGuaranteeCodeSelected = {
            id: '',
            text: ''
        };
        this.pageParams.RMMCategoryCodeSelected = {
            id: '',
            text: ''
        };
        this.pageParams.ServiceTypeCodeSelected = {
            id: '',
            text: ''
        };
        this.pageParams.PreferredDayOfWeekReasonCodeSelected = {
            id: '',
            text: ''
        };
        this.uiForm.disable();
        this.clearDateFields();
        this.setButtonText();
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riExchange.getCurrentContractType());
        this.disableControl('ContractNumber', false);
        this.disableControl('menu', true);
        this.riMaintenance.CurrentMode = MntConst.eModeSelect;
    }

    public setButtonText(): void {
        this.utils.getTranslatedval('Save').then((res: string) => { this.setControlValue('save', res); });
        this.utils.getTranslatedval('Cancel').then((res: string) => { this.setControlValue('cancel', res); });
        this.utils.getTranslatedval('Customer Information').then((res: string) => { this.setControlValue('cmdCustomerInfo', res); });
        this.utils.getTranslatedval('Future Change').then((res: string) => { this.setControlValue('cmdValue', res); });
        this.utils.getTranslatedval('Copy').then((res: string) => { this.setControlValue('cmdCopyServiceCover', res); });
        this.utils.getTranslatedval('Select All').then((res: string) => { this.setControlValue('cmdComponentSelAll', res); });
        this.utils.getTranslatedval('DeSelect All').then((res: string) => { this.setControlValue('cmdComponentDesAll', res); });
        this.utils.getTranslatedval('Hard Slot Calendar').then((res: string) => { this.setControlValue('cmdHardSlotCalendar', res); });
        this.utils.getTranslatedval('Diary View').then((res: string) => { this.setControlValue('cmdDiaryView', res); });
        this.utils.getTranslatedval('Calculate').then((res: string) => { this.setControlValue('cmdCalculate', res); });
        this.utils.getTranslatedval('Add New Deposit').then((res: string) => { this.setControlValue('btnDepositAdd', res); });
        this.utils.getTranslatedval('Default Value').then((res: string) => { this.setControlValue('btnDefaultValue', res); });
        this.utils.getTranslatedval('Refresh Display Values').then((res: string) => { this.setControlValue('cmdRefreshDisplayVal', res); });
    }

    public promptYes(event: Event): void {
        if (this.promptCallback && typeof this.promptCallback === 'function') {
            this.promptModal.hide();
            this.promptCallback.call(this);
            this.promptCallback = null;
            this.promptNoCallback = null;
        }
    }

    public promptNo(event: Event): void {
        if (this.promptNoCallback && typeof this.promptNoCallback === 'function') {
            this.promptModal.hide();
            this.promptNoCallback.call(this);
            this.promptCallback = null;
            this.promptNoCallback = null;
        }
    }

    public modalClose(event: Event): void {
        if (this.messageModalCallback && typeof this.messageModalCallback === 'function') {
            this.messageModalCallback.call(this);
            this.messageModalCallback = null;
        }
    }

    public showMessageDialog(message: string, fncallback?: any, title?: string): void {
        this.messageModalCallback = fncallback;
        let msgtitle = title;
        if (!msgtitle) {
            msgtitle = MessageConstant.Message.WarningTitle;
        }
        setTimeout(() => { this.messageModal.show({ msg: message, title: msgtitle }, false); }, 1000);
    }

    public showSuccessMessageDialog(): void {
        this.shouldCall = true;
        this.successModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: MessageConstant.Message.MessageTitle }, false);
    }

    public successModalClose(event: Event): void {
        if (this.shouldCall) {
            this.shouldCall = false;
            this.iCABSAServiceCoverMaintenance7.postSave();
        }
    }

    public showDialog(message: any, fncallback?: any, fnnocallback?: any): void {
        this.promptCallback = fncallback;
        this.promptNoCallback = fnnocallback;
        if (message instanceof Array) {
            this.promptContent1 = message;
            setTimeout(() => { this.promptModal1.show(); }, 1000);
        } else {
            this.getTranslatedValue(message, null).subscribe((res: string) => {
                if (res) {
                    this.promptContent = res;
                } else {
                    this.promptContent = message;
                }
            });
            setTimeout(() => { this.promptModal.show(); }, 1000);
        }
    }

    public onDepotSearch(data: any): void {
        this.setControlValue('DepotNumber', data.DepotNumber);
        this.setControlValue('DepotName', data.DepotName);
    }

    public employeeOnchange(obj: any, call: boolean): void {
        this.setControlValue('ServiceSalesEmployee', obj.ServiceSalesEmployee);
        this.setControlValue('EmployeeSurname', obj.EmployeeSurname);
    }

    public installEmployeeOnchange(obj: any): void {
        this.setControlValue('InstallationEmployeeCode', obj.InstallationEmployeeCode);
        this.setControlValue('InstallationEmployeeName', obj.InstallationEmployeeName);
    }

    public removalEmployeeOnchange(obj: any): void {
        this.setControlValue('RemovalEmployeeCode', obj.RemovalEmployeeCode);
        this.setControlValue('RemovalEmployeeName', obj.RemovalEmployeeName);
    }

    public leadEmployeeOnchange(obj: any): void {
        this.setControlValue('LeadEmployee', obj.LeadEmployee);
        this.setControlValue('LeadEmployeeSurname', obj.LeadEmployeeSurname);
    }

    public onTaxCodeMaterialsReceived(obj: any): void {
        if (obj) {
            this.setControlValue('TaxCodeMaterials', obj.TaxCode);
            this.setControlValue('TaxCodeMaterialsDesc', obj.TaxCodeDesc);
        }
    }

    public onTaxCodeLabourReceived(obj: any): void {
        if (obj) {
            this.setControlValue('TaxCodeLabour', obj.TaxCode);
            this.setControlValue('TaxCodeLabourDesc', obj.TaxCodeDesc);
        }
    }

    public onTaxCodeReplacementReceived(obj: any): void {
        if (obj) {
            this.setControlValue('TaxCodeReplacement', obj.TaxCode);
            this.setControlValue('TaxCodeReplacementDesc', obj.TaxCodeDesc);
        }
    }

    public setRenegContractNumber(obj: any): void {
        this.setControlValue('RenegOldContract', obj.ContractNumber);
        this.inputRenegPremiseSearch.ContractNumber = obj.ContractNumber;
    }

    public setRenegPremiseNumber(obj: any): void {
        this.setControlValue('RenegOldPremise', obj.PremiseNumber);
    }

    public setSeasonalTemplateNumber(obj: any): void {
        if (obj) {
            this.setControlValue('SeasonalTemplateNumber', obj.TemplateNumber);
            this.setControlValue('TemplateName', obj.TemplateName);
            this.uiForm.controls['SeasonalTemplateNumber'].markAsDirty();
            this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        }
    }

    public setLinkedServiceCover(obj: any): void {
        if (obj) {
            this.setControlValue('LinkedServiceCoverNumber', obj.row.ServiceCoverNumber);
            this.setControlValue('LinkedProductCode', obj.row.ProductCode);
            this.setControlValue('LinkedProductDesc', obj.row.ProductDesc);
            this.setControlValue('LinkedServiceVisitFreq', obj.row.ServiceVisitFrequency);
            this.linkedServiceCoverSearchParams.LinkedProductCode = obj.row.ProductCode;
            this.linkedServiceCoverSearchParams.LinkedProductDesc = obj.row.ProductDesc;
        }
        if (this.calledFromOnChange) {
            this.calledFromOnChange = false;
            if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LinkedServiceCoverNumber')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LinkedProductCode', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LinkedProductDesc', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LinkedServiceVisitFreq', '');
                this.linkedServiceCoverSearchParams.LinkedProductCode = '';
                this.linkedServiceCoverSearchParams.LinkedProductDesc = '';
            }
        } else {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LinkedServiceCoverNumber')) {
                this.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
            }
        }
    }

    public validateAndFormatTime(field: any): void {
        this.formatTime(this.getControlValue(field), field);
    }

    public formatTime(time: any, field: any): boolean {
        if (time.indexOf(':') === -1) {
            let result: any = '';
            let re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            let firstDta = parseInt(time[0] + time[1], 10);
            let secondDta = parseInt(time[2] + time[3], 10);
            if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && time.length === 4) {
                result = time[0] + time[1] + ':' + time[2] + time[3];
                this.riExchange.riInputElement.isCorrect(this.uiForm, field);
                this.setControlValue(field, result);
                return true;
            }
            else {
                this.setControlValue(field, time);
                this.riExchange.riInputElement.markAsError(this.uiForm, field);
                return false;
            }
        } else {
            let firstDta = time.split(':')[0];
            let secondDta = time.split(':')[1];
            if (!((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) || time.length !== 5) {
                this.setControlValue(field, time);
                this.riExchange.riInputElement.markAsError(this.uiForm, field);
                return false;
            } else {
                this.riExchange.riInputElement.isCorrect(this.uiForm, field);
                return true;
            }
        }
    }

    public canDeactivate(): Observable<boolean> {
        if (this.parentMode === 'Premise-Add') {
            this.canDeactivateObservable = new Observable((observer) => {
                this.errorModal.modalClose.subscribe((event) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.context.pageParams.ServiceCoverAdded = true;
                    observer.next(true);
                });
                if (!this.context.pageParams.ServiceCoverAdded) {
                    this.errorModal.show({ msg: 'No Service Cover Records Have Been Added For This Premises', title: MessageConstant.Message.MessageTitle }, false);
                    return;
                } else {
                    observer.next(true);
                }
            });
            return this.canDeactivateObservable;
        } else {
            this.routeAwayGlobals.setSaveEnabledFlag(this.formIsDirty);
            if (this.routeAwayComponent) {
                return this.routeAwayComponent.canDeactivate();
            }
        }
    }

    public onAPICodeDataReceived(Obj: any): void {
        this.context.setControlValue('APICode', Obj.APICode);
        this.context.setControlValue('APICodeDesc', Obj.APICodeDesc);
    }

    public getCurrentPageDisplayGrid(event: any): void {
        if (this.pageParams.riDisplayGridPageCurrent !== event.value) {
            this.pageParams.riDisplayGridPageCurrent = event.value;
            this.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
        }
    }

    public getCurrentPageComponent(event: any): void {
        if (this.pageParams.riComponentGridPageCurrent !== event.value) {
            this.pageParams.riComponentGridPageCurrent = event.value;
            this.iCABSAServiceCoverMaintenance3.riComponentGrid_BeforeExecute();
        }
    }

    public setProductCodeCopy(copyData: any): void {
        if (copyData) {
            this.riMaintenance.CurrentMode = MntConst.eModeAdd;
            this.copyMode = true;
            this.productSelectedForAdd = true;
            let data = copyData['ServiceCoverCopy'];
            for (let i in data) {
                if (i) {
                    this.riExchange.updateCtrl(this.controls, i, 'value', data[i]);
                    //this.riExchange.riInputElement.SetValue(this.uiForm, i, data[i]);
                    this.riMaintenance.renderResponseForCtrl(this, data);
                }
            }
            this.setControlValue('ProductCode', data.ProductCode);
            this.uiForm.controls['ProductCode'].markAsDirty();
            this.setControlValue('ProductDesc', data.ProductDesc);
            this.enableForm();
            this.uiForm.controls['ContractNumber'].markAsPristine();
            this.uiForm.controls['PremiseNumber'].markAsPristine();
            this.uiForm.controls['BusinessOriginCode'].markAsDirty();
            this.uiForm.controls['ServiceAnnualValue'].markAsDirty();
            this.pageParams.blnValueRequired = true;
            this.context.iCABSAServiceCoverMaintenance1.ProductCode_OnChange();
            if (this.context.pageParams.vbEnableProductServiceType) {
                this.context.iCABSAServiceCoverMaintenance1.GetProductServiceType();
            }
            this.context.iCABSAServiceCoverMaintenance7.CheckServiceNotifyInd();
            this.iCABSAServiceCoverMaintenance1.init();
            this.formIsDirty = true;
        }
    }

    public focusSave(obj: any): void {
        this.focusNextTab(obj);
    }

    public focusNextTab(obj: any): void {
        if (obj.relatedTarget || obj.keyCode === 9) {
            let tabIndices = this.getCurrentAndNextTab();
            let currtab = tabIndices.currTab + 1;
            let focustab = tabIndices.nextTab + 1;
            if (currtab !== focustab) {
                this.renderTab(focustab);
                this.focusFirstField(tabIndices.nextTabIndex + 1);
            } else {
                document.querySelector('#save')['focus']();
            }
        }
    }

    public getCurrentAndNextTab(): any {
        let nextTab = 0;
        let elem: any = document.querySelector('.nav-tabs');
        let id = 'grdGeneral';
        let nextId = 'grdGeneral';
        if (elem) {
            elem = elem.children;
            for (let i = 0; i < elem.length; i++) {
                if (this.utils.hasClass(elem[i], 'active')) {
                    id = elem[i].getAttribute('id');
                    if (i === (elem.length - 1)) {
                        nextId = elem[i].getAttribute('id');
                    } else {
                        nextId = elem[i + 1].getAttribute('id');
                        nextTab = i + 1;
                    }
                    break;
                }
            }
            if (this.tabByNames.indexOf(id) === this.tabByNames.indexOf(nextId)) {
                nextTab = elem.length;
            }
        }
        return {
            currTab: this.tabByNames.indexOf(id),
            nextTab: this.tabByNames.indexOf(nextId),
            nextTabIndex: nextTab
        };
    }

    public focusFirstField(currentTab: number): void {
        this.utils.getFirstFocusableFieldForTab(currentTab);
    }

    public hasValue(val: any): boolean {
        return ((val !== null) && (val !== undefined) && (val !== ''));
    }

    public fieldHasValue(field: string): boolean {
        return this.hasValue(this.getControlValue(field));
    }

    public businessOriginCodeChange(data: any): void {
        this.uiForm.controls['BusinessOriginCode'].markAsDirty();
        this.setControlValue('BusinessOriginCode', data['BusinessOriginLang.BusinessOriginCode']);
        this.setControlValue('BusinessOriginDesc', data['BusinessOriginLang.BusinessOriginDesc']);
        this.setBusinessOriginDropDownValue();
    }

    public reasonCodeCodeChange(data: any): void {
        this.uiForm.controls['LostBusinessCode'].markAsDirty();
        this.setControlValue('LostBusinessCode', data['LostBusinessLang.LostBusinessCode']);
        this.setControlValue('LostBusinessDesc', data['LostBusinessLang.LostBusinessDesc']);
        this.detailCodeSearchParams.LostBusinessCode = this.getControlValue('LostBusinessCode');
        this.setDropDownComponentValue('LostBusinessCode', 'LostBusinessDesc');
        this.detailCodeDropDown.fetchDropDownData();
    }

    public detailCodeCodeChange(data: any): void {
        this.uiForm.controls['LostBusinessDetailCode'].markAsDirty();
        this.setControlValue('LostBusinessDetailCode', data['LostBusinessDetailLang.LostBusinessDetailCode']);
        this.setControlValue('LostBusinessDetailDesc', data['LostBusinessDetailLang.LostBusinessDetailDesc']);
        this.setDropDownComponentValue('LostBusinessDetailCode', 'LostBusinessDetailDesc');
    }

    public onNoGuarenteeCodeChange(data: any): void {
        this.uiForm.controls['NoGuaranteeCode'].markAsDirty();
        this.setControlValue('NoGuaranteeCode', data['NoGuaranteeCode']);
        this.setControlValue('NoGuaranteeDescription', data['NoGuaranteeDescription']);
        this.setDropDownComponentValue('NoGuaranteeCode', 'NoGuaranteeDescription');
    }

    public rmmCategoryChange(data: any): void {
        this.uiForm.controls['RMMCategoryCode'].markAsDirty();
        this.setControlValue('RMMCategoryCode', data['RMMCategoryLang.RMMCategoryCode']);
        this.setControlValue('RMMCategoryDesc', data['RMMCategoryLang.RMMCategoryDesc']);
        this.setDropDownComponentValue('RMMCategoryCode', 'RMMCategoryDesc');
        this.iCABSAServiceCoverMaintenance8.RMMCategoryCode_onChange();
    }

    public serviceTypeCodeChange(data: any): void {
        this.uiForm.controls['ServiceTypeCode'].markAsDirty();
        this.setControlValue('ServiceTypeCode', data['ServiceTypeCode']);
        this.setControlValue('ServiceTypeDesc', data['ServiceTypeDesc']);
        this.setDropDownComponentValue('ServiceTypeCode', 'ServiceTypeDesc');
        this.iCABSAServiceCoverMaintenance7.ServiceTypeCode_onChange();
    }

    public preferredDayOfWeekReasonCodeChange(data: any): void {
        this.uiForm.controls['PreferredDayOfWeekReasonCode'].markAsDirty();
        this.setControlValue('PreferredDayOfWeekReasonCode', data['PreferredDayOfWeekReason.PreferredDayOfWeekReasonCode']);
        this.setControlValue('PreferredDayOfWeekReasonLangDesc', data['PreferredDayOfWeekReasonLang.PreferredDayOfWeekReasonLangDesc']);
        this.setDropDownComponentValue('PreferredDayOfWeekReasonCode', 'PreferredDayOfWeekReasonLangDesc');
    }

    public callLookUpForFieldChange(field: string, allowBlank: boolean, callCBO: boolean): void {
        if (this.fieldHasValue(field) && this.isFieldValid(field)) {
            this.setControlValue(field, this.UCase(this.getControlValue(field)));
            if (this.iCABSAServiceCoverMaintenanceVTs['callVT' + field]) {
                this.iCABSAServiceCoverMaintenanceVTs['callVT' + field]();
            }
            if (callCBO) {
                this.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
            }
        } else if (allowBlank) {
            if (this.iCABSAServiceCoverMaintenanceVTs['callVT' + field]) {
                this.iCABSAServiceCoverMaintenanceVTs['callVT' + field]();
            }
            if (callCBO) {
                this.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
            }
        }
    }

    public onEntitlementPricePerUnitChange(event: any): void {
        this.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    }

    public handleInvalidSelectionExit(): void {
        this.uiForm.disable();
        this.disableControl('ContractNumber', false);
        this.disableControl('PremiseNumber', false);
        this.disableControl('ProductCode', false);
        this.productSelectedForAdd = false;
    }

    /*
    *Transform Number to Interger Number
    */
    public parseIntegerValue(field: string): void {
        let getFieldValue = this.getControlValue(field);
        this.setControlValue(field, parseInt(getFieldValue, 10));
    }

    public isFieldValid(fieldName: string): boolean {
        return !this.uiForm.controls[fieldName].invalid;
    }

    public setBusinessOriginDropDownValue(): void {
        if (this.fieldHasValue('BusinessOriginCode') && this.fieldHasValue('BusinessOriginDesc')) {
            this.pageParams.businessOriginCodeSelected = {
                id: this.context.getControlValue('BusinessOriginCode'),
                text: this.context.getControlValue('BusinessOriginCode') + '-' + this.context.getControlValue('BusinessOriginDesc')
            };
        } else {
            this.pageParams.businessOriginCodeSelected = {
                id: '',
                text: ''
            };
        }
    }

    public setDropDownComponentValue(fieldCode: string, fieldDesc: string): void {
        if (this.fieldHasValue(fieldCode) && this.fieldHasValue(fieldDesc)) {
            this.pageParams[fieldCode + 'Selected'] = {
                id: this.context.getControlValue(fieldCode),
                text: this.context.getControlValue(fieldCode) + '-' + this.context.getControlValue(fieldDesc)
            };
        } else {
            this.pageParams[fieldCode + 'Selected'] = {
                id: '',
                text: ''
            };
        }
    }

    public dropDownMarkError(fieldName: string): boolean {
        return (this.uiForm.controls[fieldName].invalid && this.uiForm.controls[fieldName].touched);
    }
}
