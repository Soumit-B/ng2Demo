export var AppModuleRoutes = (function () {
    function AppModuleRoutes() {
    }
    AppModuleRoutes.BILLTOCASH = '/billtocash/';
    AppModuleRoutes.CONTRACTMANAGEMENT = '/contractmanagement/';
    AppModuleRoutes.CCM = '/ccm/';
    AppModuleRoutes.EXTRANETSORCONNECT = '/extranetsorconnect/';
    AppModuleRoutes.ITFUNCTIONS = '/itfunctions/';
    AppModuleRoutes.PEOPLE = '/people/';
    AppModuleRoutes.PROSPECTTOCONTRACT = '/prospecttocontract/';
    AppModuleRoutes.SERVICEDELIVERY = '/servicedelivery/';
    AppModuleRoutes.SERVICEPLANNING = '/serviceplanning/';
    AppModuleRoutes.ACCOUNTADMIN = 'accountadmin/';
    AppModuleRoutes.ACCOUNTMAINTENANCE = 'accountmaintenance/';
    AppModuleRoutes.AREAS = 'areas/';
    AppModuleRoutes.CONTRACTADMIN = 'contractadmin/';
    AppModuleRoutes.CUSTOMERINFO = 'customerinfo/';
    AppModuleRoutes.GENERAL = 'general/';
    AppModuleRoutes.GROUPACCOUNT = 'groupaccount/';
    AppModuleRoutes.PREMISESADMIN = 'premisesadmin/';
    AppModuleRoutes.PREMISESMAINTENANCE = 'premisesmaintenance/';
    AppModuleRoutes.PRODUCTADMIN = 'productadmin/';
    AppModuleRoutes.PRODUCTSALE = 'productsale/';
    AppModuleRoutes.REPORTS = 'reports/';
    AppModuleRoutes.RETENTION = 'retention/';
    AppModuleRoutes.SERVICECOVERADMIN = 'servicecoveradmin/';
    AppModuleRoutes.SERVICECOVERMAINTENANCE = 'servicecovermaintenance/';
    AppModuleRoutes.GRID = '/grid/';
    return AppModuleRoutes;
}());
export var BillToCashModuleRoutes = (function () {
    function BillToCashModuleRoutes() {
    }
    BillToCashModuleRoutes.ICABSAINVOICEGROUPMAINTENANCE = 'maintenance/invoicegroup/search';
    BillToCashModuleRoutes.ICABSASERVICECOVERACCEPTGRID = 'servicecover/acceptGrid';
    BillToCashModuleRoutes.ICABSAINVOICEDETAILSMAINTENANCE = AppModuleRoutes.BILLTOCASH + 'maintenance/invoiceDetailsMaintainance';
    return BillToCashModuleRoutes;
}());
export var ContractManagementModuleRoutes = (function () {
    function ContractManagementModuleRoutes() {
    }
    ContractManagementModuleRoutes.ICABSAPREMISESELECTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.RETENTION + 'deletePremise/premiseSelectMaintenance';
    ContractManagementModuleRoutes.ICABSAMULTIPREMISEPURCHASEORDERAMEND = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESADMIN + 'contract/multipremise/purchaseorderamend';
    ContractManagementModuleRoutes.ICABSASERVICEVISITDETAILSUMMARY = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'serviceVisitDetail/serviceVisitDetailSummaryGrid';
    ContractManagementModuleRoutes.ICABSASERVICECOVERFREQUENCYMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'maintenance/ServiceCoverFrequencyMaintenance';
    ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.ACCOUNTMAINTENANCE + 'account/maintenance';
    ContractManagementModuleRoutes.ICABSAACCOUNTASSIGN = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.ACCOUNTADMIN + 'account/assign/search';
    ContractManagementModuleRoutes.ICABSAACCOUNTMERGE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.ACCOUNTADMIN + 'account/merge/search';
    ContractManagementModuleRoutes.ICABSAACCOUNTMOVE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.ACCOUNTADMIN + 'account/move/search';
    ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID = AppModuleRoutes.CONTRACTMANAGEMENT + 'contractInvoice/ContractInvoiceDetailGrid';
    ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESMAINTENANCE + 'maintenance/premise';
    ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + 'maintenance/contract';
    ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + 'maintenance/job';
    ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + 'maintenance/product';
    ContractManagementModuleRoutes.ICABSASERVICECOVERYTDMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'servicecover/YTDMaintenance';
    ContractManagementModuleRoutes.ICABSRENEWALEXTRACTGENERATION = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.REPORTS + 'sales/renewalextractgeneration';
    ContractManagementModuleRoutes.ICABSSEPREMISECONTACTCHANGEGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESADMIN + 'PDAReturns/premiseContactChange';
    ContractManagementModuleRoutes.ICABSASERVICECOVERTRIALPERIODRELEASEGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'servicecover/TialPeriodRelease';
    ContractManagementModuleRoutes.ICABSBPOSTCODEMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.AREAS + 'branch/postalcode/maintenance';
    ContractManagementModuleRoutes.ICABSBPOSTCODESGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.AREAS + 'branchgeography/postcodesgrid';
    ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMOVE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.GROUPACCOUNT + 'account/groupaccountmove';
    ContractManagementModuleRoutes.ICABSSEDATACHANGEGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.CUSTOMERINFO + 'customerdataupdate/datachangegrid';
    ContractManagementModuleRoutes.ICABSAPOSTCODEMOVEBRANCH = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESADMIN + 'premise/postcodemovebranch';
    ContractManagementModuleRoutes.ICABSSSALESSTATSADJUSTMENTGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.REPORTS + 'salesMaintenance/renegAdjustments';
    ContractManagementModuleRoutes.ICABSASERVICECOVERSELECTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.RETENTION + 'clientRetention/serviceCoverSelectMaintenance';
    ContractManagementModuleRoutes.ICABSACONTRACTSELECTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.RETENTION + 'maintenance/ContractSelectMaintenance';
    ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.GROUPACCOUNT + 'account/groupaccountmaintenance';
    ContractManagementModuleRoutes.ICABSAPRODUCTCODEUPGRADE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'contractservicecover/productupgrade';
    ContractManagementModuleRoutes.ICABSASERVICECOVERINVOICEONFIRSTVISITMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'maintenance/serviceCoverInvoiceMaintenceOnFirstVisit';
    ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE = AppModuleRoutes.SERVICECOVERMAINTENANCE + 'maintenance/servicecover';
    ContractManagementModuleRoutes.ICABSAPREMISESELECTMAINTENANCE_SUB = 'deletePremise/premiseSelectMaintenance';
    ContractManagementModuleRoutes.ICABSAMULTIPREMISEPURCHASEORDERAMEND_SUB = 'contract/multipremise/purchaseorderamend';
    ContractManagementModuleRoutes.ICABSASERVICEVISITDETAILSUMMARY_SUB = 'serviceVisitDetail/serviceVisitDetailSummaryGrid';
    ContractManagementModuleRoutes.ICABSASERVICECOVERFREQUENCYMAINTENANCE_SUB = 'maintenance/ServiceCoverFrequencyMaintenance';
    ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE_SUB = 'account/maintenance';
    ContractManagementModuleRoutes.ICABSAACCOUNTASSIGN_SUB = 'account/assign/search';
    ContractManagementModuleRoutes.ICABSAACCOUNTMERGE_SUB = 'account/merge/search';
    ContractManagementModuleRoutes.ICABSAACCOUNTMOVE_SUB = 'account/move/search';
    ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID_SUB = 'contractInvoice/ContractInvoiceDetailGrid';
    ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE_SUB = 'maintenance/premise';
    ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE_SUB = 'maintenance/contract';
    ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE_SUB = 'maintenance/job';
    ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE_SUB = 'maintenance/product';
    ContractManagementModuleRoutes.ICABSASERVICECOVERYTDMAINTENANCE_SUB = 'servicecover/YTDMaintenance';
    ContractManagementModuleRoutes.ICABSRENEWALEXTRACTGENERATION_SUB = 'sales/renewalextractgeneration';
    ContractManagementModuleRoutes.ICABSSEPREMISECONTACTCHANGEGRID_SUB = 'PDAReturns/premiseContactChange';
    ContractManagementModuleRoutes.ICABSASERVICECOVERTRIALPERIODRELEASEGRID_SUB = 'servicecover/TialPeriodRelease';
    ContractManagementModuleRoutes.ICABSBPOSTCODEMAINTENANCE_SUB = 'branch/postalcode/maintenance';
    ContractManagementModuleRoutes.ICABSBPOSTCODESGRID_SUB = 'branchgeography/postcodesgrid';
    ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMOVE_SUB = 'account/groupaccountmove';
    ContractManagementModuleRoutes.ICABSSEDATACHANGEGRID_SUB = 'customerdataupdate/datachangegrid';
    ContractManagementModuleRoutes.ICABSAPOSTCODEMOVEBRANCH_SUB = 'premise/postcodemovebranch';
    ContractManagementModuleRoutes.ICABSSSALESSTATSADJUSTMENTGRID_SUB = 'salesMaintenance/renegAdjustments';
    ContractManagementModuleRoutes.ICABSASERVICECOVERSELECTMAINTENANCE_SUB = 'clientRetention/serviceCoverSelectMaintenance';
    ContractManagementModuleRoutes.ICABSACONTRACTSELECTMAINTENANCE_SUB = 'maintenance/ContractSelectMaintenance';
    ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMAINTENANCE_SUB = 'account/groupaccountmaintenance';
    ContractManagementModuleRoutes.ICABSAPRODUCTCODEUPGRADE_SUB = 'contractservicecover/productupgrade';
    ContractManagementModuleRoutes.ICABSASERVICECOVERINVOICEONFIRSTVISITMAINTENANCE_SUB = 'maintenance/serviceCoverInvoiceMaintenceOnFirstVisit';
    ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE_SUB = 'maintenance/servicecover';
    return ContractManagementModuleRoutes;
}());
export var CCMModuleRoutes = (function () {
    function CCMModuleRoutes() {
    }
    CCMModuleRoutes.ICABSCMSMSMESSAGESGRID = 'service/smsmessages';
    CCMModuleRoutes.SENDBULKSMSBUSINESS = 'sendbulksms/business';
    CCMModuleRoutes.SENDBULKSMSBRANCH = 'sendbulksms/branch';
    CCMModuleRoutes.SENDBULKSMSACCOUNT = 'sendbulksms/account';
    return CCMModuleRoutes;
}());
export var ExtranetsOrConnectModuleRoutes = (function () {
    function ExtranetsOrConnectModuleRoutes() {
    }
    return ExtranetsOrConnectModuleRoutes;
}());
export var InternalGridSearchModuleRoutes = (function () {
    function InternalGridSearchModuleRoutes() {
    }
    InternalGridSearchModuleRoutes.ICABSASERVICECOVERSEASONGRID = 'application/servicecover/seasongrid';
    InternalGridSearchModuleRoutes.ICABSAPNOLLEVELHISTORY = 'application/PNOLLevelHistory';
    InternalGridSearchModuleRoutes.ICABSBDLREJECTIONSEARCH = 'application/PNOLPremiseSearch';
    InternalGridSearchModuleRoutes.ICABSASERVICECOVERWASTEGRID = 'application/servicecover/wastegrid';
    InternalGridSearchModuleRoutes.ICABSAINVOICEHEADERGRID = 'application/invoiceheadergridcomponent';
    InternalGridSearchModuleRoutes.ICABSSASERVICECOVERDISPLAYGRID = 'application/serviceCoverDisplayGrid';
    InternalGridSearchModuleRoutes.ICABSSSOQUOTEGRID = 'sales/ssoQuoteGrid';
    InternalGridSearchModuleRoutes.ICABSSDLCONTRACTAPPROVALGRID = 'sales/contractapprovalgrid';
    InternalGridSearchModuleRoutes.ICABSASERVICECOVERCALENDARDATEGRID = 'application/servicecover/calendardate';
    return InternalGridSearchModuleRoutes;
}());
export var InternalMaintenanceModuleRoutes = (function () {
    function InternalMaintenanceModuleRoutes() {
    }
    InternalMaintenanceModuleRoutes.ICABSAEMPLOYEEGRID = 'application/employeegrid';
    InternalMaintenanceModuleRoutes.ICABSAMNATAXJOBSERVICEDETAILGROUPMAINTENANCE = 'maintenance/jobservicedetailgroupmaintenance';
    InternalMaintenanceModuleRoutes.ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE = 'maintenance/CustomerInformationAccountMaintenance';
    InternalMaintenanceModuleRoutes.ICABSADIARYENTRY = 'maintenance/diaryentry';
    InternalMaintenanceModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE = 'maintenance/dlservicecover';
    InternalMaintenanceModuleRoutes.ICABSACONTRACTRENEWALMAINTENANCE = 'maintenance/contract/renewal';
    InternalMaintenanceModuleRoutes.ICABSAINVOICECHARGEMAINTENANCE = 'maintenance/invoiceChargeMaintenance';
    InternalMaintenanceModuleRoutes.ICABSSSOQUOTESUBMITMAINTENANCE = 'maintenance/quoteSubmitMaintenance';
    InternalMaintenanceModuleRoutes.ICABSATRIALPERIODRELEASEMAINTENANCE = 'maintenance/trialperiodrelease';
    InternalMaintenanceModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE = 'maintenance/customerinformation';
    InternalMaintenanceModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE = 'application/ServiceCoverDetailMaintenance';
    return InternalMaintenanceModuleRoutes;
}());
export var InternalSearchModuleRoutes = (function () {
    function InternalSearchModuleRoutes() {
    }
    InternalSearchModuleRoutes.ICABSBDLREJECTIONSEARCH = 'application/RejectionSearch';
    InternalSearchModuleRoutes.ICABSACMNATAXJOBSERVICECOVERSEARCH = 'application/mnAtAxJobServiceCover';
    InternalSearchModuleRoutes.ICABSSHISTORYTYPELANGUAGESEARCH = 'application/HistoryTypeLanguageSearch';
    InternalSearchModuleRoutes.ICABSBCLOSEDTEMPLATESEARCH = 'application/closedtemplatesearch';
    InternalSearchModuleRoutes.ICABSBPRODUCTSEARCH = 'application/productSearch';
    InternalSearchModuleRoutes.ICABSASERVICESUMMARYDETAIL = 'application/serviceSummaryDetail';
    InternalSearchModuleRoutes.ICABSMARKTSELECTSEARCH = 'application/marktselectsearch';
    InternalSearchModuleRoutes.ICABSBRANCHSERVICEAREASEARCH = 'application/branchservicearea';
    return InternalSearchModuleRoutes;
}());
export var ITFunctionsModuleRoutes = (function () {
    function ITFunctionsModuleRoutes() {
    }
    return ITFunctionsModuleRoutes;
}());
export var PeopleModuleRoutes = (function () {
    function PeopleModuleRoutes() {
    }
    return PeopleModuleRoutes;
}());
export var ProspectToContractModuleRoutes = (function () {
    function ProspectToContractModuleRoutes() {
    }
    return ProspectToContractModuleRoutes;
}());
export var ServiceDeliveryModuleRoutes = (function () {
    function ServiceDeliveryModuleRoutes() {
    }
    ServiceDeliveryModuleRoutes.ICABSSESERVICEDOCKETDATAENTRY = 'service/visit/maintenance/docketentry';
    ServiceDeliveryModuleRoutes.ICABSSEPESVISITGRID = 'pdareturns/SePESVisitGrid';
    return ServiceDeliveryModuleRoutes;
}());
export var ServicePlanningModuleRoutes = (function () {
    function ServicePlanningModuleRoutes() {
    }
    ServicePlanningModuleRoutes.ICABSSESERVICEMOVEGRID = 'ServiceMoveGridSearch';
    return ServicePlanningModuleRoutes;
}());
