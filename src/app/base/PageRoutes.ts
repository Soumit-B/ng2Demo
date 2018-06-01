export class AppModuleRoutes {
    public static readonly BILLTOCASH = '/billtocash/';
    public static readonly CONTRACTMANAGEMENT = '/contractmanagement/';
    public static readonly CCM = '/ccm/';
    public static readonly EXTRANETSORCONNECT = '/extranetsorconnect/';
    public static readonly ITFUNCTIONS = '/itfunctions/';
    public static readonly PEOPLE = '/people/';
    public static readonly PROSPECTTOCONTRACT = '/prospecttocontract/';
    public static readonly SERVICEDELIVERY = '/servicedelivery/';
    public static readonly SERVICEPLANNING = '/serviceplanning/';
    public static readonly ACCOUNTADMIN = 'accountadmin/';
    public static readonly ACCOUNTMAINTENANCE = 'accountmaintenance/';
    public static readonly AREAS = 'areas/';
    public static readonly CONTRACTADMIN = 'contractadmin/';
    public static readonly CUSTOMERINFO = 'customerinfo/';
    public static readonly GENERAL = 'general/';
    public static readonly GROUPACCOUNT = 'groupaccount/';
    public static readonly PREMISESADMIN = 'premisesadmin/';
    public static readonly PREMISESMAINTENANCE = 'premisesmaintenance/';
    public static readonly PRODUCTADMIN = 'productadmin/';
    public static readonly PRODUCTSALE = 'productsale/';
    public static readonly REPORTS = 'reports/';
    public static readonly RETENTION = 'retention/';
    public static readonly SERVICECOVERADMIN = 'servicecoveradmin/';
    public static readonly SERVICECOVERMAINTENANCE = 'servicecovermaintenance/';
    public static readonly GRID = '/grid/';
    public static readonly GRID_SALES = 'grid/sales/';
    public static readonly GRID_APPLICATION = 'grid/application/';
    public static readonly GRID_SERVICE = 'grid/service/';
    public static readonly MAINTENANCE_SALES = 'sales/';
    public static readonly MAINTENANCE_APPLICATION = 'application/';
    public static readonly MAINTENANCE_SERVICE = 'service/';
}

export class BillToCashModuleRoutes {
    public static readonly ICABSAINVOICEGROUPMAINTENANCE = 'maintenance/invoicegroup/search';
    public static readonly ICABSASERVICECOVERACCEPTGRID = 'servicecover/acceptGrid';
    public static readonly ICABSARVARIANCEFROMPRICECOSTGRID = 'servicecover/pricecostvariance';
    public static readonly ICABSARGENERATENEXTINVOICERUNFORECAST = 'application/invoiceRunForecastComponent';
    public static readonly ICABSAINVOICEDETAILSMAINTENANCE = 'maintenance/invoiceDetailsMaintainance';
    public static readonly ICABSACONTRACTINVOICEGRID = AppModuleRoutes.BILLTOCASH + 'contract/invoice';
}

export class ContractManagementModuleRoutes {
    public static readonly ICABSAPREMISESELECTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.RETENTION + 'deletePremise/premiseSelectMaintenance';
    public static readonly ICABSAMULTIPREMISEPURCHASEORDERAMEND = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESADMIN + 'contract/multipremise/purchaseorderamend';
    public static readonly ICABSASERVICEVISITDETAILSUMMARY = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'serviceVisitDetail/serviceVisitDetailSummaryGrid';
    public static readonly ICABSASERVICECOVERFREQUENCYMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'maintenance/ServiceCoverFrequencyMaintenance';
    public static readonly ICABSAACCOUNTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.ACCOUNTMAINTENANCE + 'account/maintenance';
    public static readonly ICABSAACCOUNTASSIGN = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.ACCOUNTADMIN + 'account/assign/search';
    public static readonly ICABSAACCOUNTMERGE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.ACCOUNTADMIN + 'account/merge/search';
    public static readonly ICABSAACCOUNTMOVE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.ACCOUNTADMIN + 'account/move/search';
    public static readonly ICABSACONTRACTINVOICEDETAILGRID = AppModuleRoutes.CONTRACTMANAGEMENT + 'contractInvoice/ContractInvoiceDetailGrid';
    public static readonly ICABSAPREMISEMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESMAINTENANCE + 'maintenance/premise';
    public static readonly ICABSACONTRACTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + 'maintenance/contract';
    public static readonly ICABSAJOBMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + 'maintenance/job';
    public static readonly ICABSAPREMISESERVICESUSPENDMAINTENANCE = 'servicesuspendmaintenance';
    public static readonly ICABSAPRODUCTSALEMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + 'maintenance/product';
    public static readonly ICABSASERVICECOVERYTDMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'servicecover/YTDMaintenance';
    public static readonly ICABSRENEWALEXTRACTGENERATION = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.REPORTS + 'sales/renewalextractgeneration';
    public static readonly ICABSSEPREMISECONTACTCHANGEGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESADMIN + 'PDAReturns/premiseContactChange';
    public static readonly ICABSASERVICECOVERTRIALPERIODRELEASEGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'servicecover/TialPeriodRelease';
    public static readonly ICABSBPOSTCODEMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.AREAS + 'branch/postalcode/maintenance';
    public static readonly ICABSBPOSTCODESGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.AREAS + 'branchgeography/postcodesgrid';
    public static readonly ICABSSGROUPACCOUNTMOVE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.GROUPACCOUNT + 'account/groupaccountmove';
    public static readonly ICABSSEDATACHANGEGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.CUSTOMERINFO + 'customerdataupdate/datachangegrid';
    public static readonly ICABSAPOSTCODEMOVEBRANCH = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESADMIN + 'premise/postcodemovebranch';
    public static readonly ICABSSSALESSTATSADJUSTMENTGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.REPORTS + 'salesMaintenance/renegAdjustments';
    public static readonly ICABSASERVICECOVERSELECTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.RETENTION + 'clientRetention/serviceCoverSelectMaintenance';
    public static readonly ICABSACONTRACTSELECTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.RETENTION + 'maintenance/ContractSelectMaintenance';
    public static readonly ICABSSGROUPACCOUNTMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.GROUPACCOUNT + 'account/groupaccountmaintenance';
    public static readonly ICABSAPRODUCTCODEUPGRADE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'contractservicecover/productupgrade';
    public static readonly ICABSASERVICECOVERINVOICEONFIRSTVISITMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'maintenance/serviceCoverInvoiceMaintenceOnFirstVisit';
    public static readonly ICABSASERVICECOVERMAINTENANCE = AppModuleRoutes.SERVICECOVERMAINTENANCE + 'maintenance/servicecover';
    public static readonly ICABSASERVICECOVERMAINTENANCECONTRACT = AppModuleRoutes.SERVICECOVERMAINTENANCE + 'maintenance/servicecover/contract';
    public static readonly ICABSASERVICECOVERMAINTENANCEJOB = AppModuleRoutes.SERVICECOVERMAINTENANCE + 'maintenance/servicecover/job';
    public static readonly ICABSASERVICECOVERMAINTENANCEREDUCE = AppModuleRoutes.SERVICECOVERMAINTENANCE + 'maintenance/servicecover/reduce';

    public static readonly ICABSAMULTIPREMISESPECIAL = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PREMISESADMIN + 'application/multiPremisesSpecial';
    public static readonly ICABSANEGBRANCHMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.CONTRACTADMIN + 'negbranchmaintenance';
    public static readonly ICABSAPERCENTAGEPRICECHANGE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'percentagepricechange/perchanges/:type';
    public static readonly ICABSACONTRACTANNIVERSARYCHANGE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.CONTRACTADMIN + 'contractAnniversaryChange';
    public static readonly ICABSARBRANCHCONTRACTREPORT = 'contractForBranchReport';
    public static readonly ICABSAMASSPRICECHANGEGRID = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.SERVICECOVERADMIN + 'application/massPriceChangeGrid';
    public static readonly ICABSBPRODUCTCOVERMAINTENANCE = AppModuleRoutes.CONTRACTMANAGEMENT + AppModuleRoutes.PRODUCTADMIN + 'business/service/productcover';

    public static readonly ICABSAPREMISESELECTMAINTENANCE_SUB = 'deletePremise/premiseSelectMaintenance';
    public static readonly ICABSAMULTIPREMISEPURCHASEORDERAMEND_SUB = 'contract/multipremise/purchaseorderamend';
    public static readonly ICABSASERVICEVISITDETAILSUMMARY_SUB = 'serviceVisitDetail/serviceVisitDetailSummaryGrid';
    public static readonly ICABSASERVICECOVERFREQUENCYMAINTENANCE_SUB = 'maintenance/ServiceCoverFrequencyMaintenance';
    public static readonly ICABSAACCOUNTMAINTENANCE_SUB = 'account/maintenance';
    public static readonly ICABSAACCOUNTASSIGN_SUB = 'account/assign/search';
    public static readonly ICABSAACCOUNTMERGE_SUB = 'account/merge/search';
    public static readonly ICABSAACCOUNTMOVE_SUB = 'account/move/search';
    public static readonly ICABSACONTRACTINVOICEDETAILGRID_SUB = 'contractInvoice/ContractInvoiceDetailGrid';
    public static readonly ICABSAPREMISEMAINTENANCE_SUB = 'maintenance/premise';
    public static readonly ICABSACONTRACTMAINTENANCE_SUB = 'maintenance/contract';
    public static readonly ICABSAJOBMAINTENANCE_SUB = 'maintenance/job';
    public static readonly ICABSAPRODUCTSALEMAINTENANCE_SUB = 'maintenance/product';
    public static readonly ICABSASERVICECOVERYTDMAINTENANCE_SUB = 'servicecover/YTDMaintenance';
    public static readonly ICABSRENEWALEXTRACTGENERATION_SUB = 'sales/renewalextractgeneration';
    public static readonly ICABSSEPREMISECONTACTCHANGEGRID_SUB = 'PDAReturns/premiseContactChange';
    public static readonly ICABSASERVICECOVERTRIALPERIODRELEASEGRID_SUB = 'servicecover/TialPeriodRelease';
    public static readonly ICABSBPOSTCODEMAINTENANCE_SUB = 'branch/postalcode/maintenance';
    public static readonly ICABSBPOSTCODESGRID_SUB = 'branchgeography/postcodesgrid';
    public static readonly ICABSSGROUPACCOUNTMOVE_SUB = 'account/groupaccountmove';
    public static readonly ICABSSEDATACHANGEGRID_SUB = 'customerdataupdate/datachangegrid';
    public static readonly ICABSAPOSTCODEMOVEBRANCH_SUB = 'premise/postcodemovebranch';
    public static readonly ICABSSSALESSTATSADJUSTMENTGRID_SUB = 'salesMaintenance/renegAdjustments';
    public static readonly ICABSASERVICECOVERSELECTMAINTENANCE_SUB = 'clientRetention/serviceCoverSelectMaintenance';
    public static readonly ICABSACONTRACTSELECTMAINTENANCE_SUB = 'maintenance/ContractSelectMaintenance';
    public static readonly ICABSSGROUPACCOUNTMAINTENANCE_SUB = 'account/groupaccountmaintenance';
    public static readonly ICABSAPRODUCTCODEUPGRADE_SUB = 'contractservicecover/productupgrade';
    public static readonly ICABSASERVICECOVERINVOICEONFIRSTVISITMAINTENANCE_SUB = 'maintenance/serviceCoverInvoiceMaintenceOnFirstVisit';
    public static readonly ICABSASERVICECOVERMAINTENANCE_SUB = 'maintenance/servicecover';
    public static readonly ICABSAMULTIPREMISESPECIAL_SUB = 'application/multiPremisesSpecial';
    public static readonly ICABSANEGBRANCHMAINTENANCE_SUB = 'negbranchmaintenance';
    public static readonly ICABSAPERCENTAGEPRICECHANGECONTRACT_SUB = 'percentagepricechange/perchanges/Contract';
    public static readonly ICABSAPERCENTAGEPRICECHANGEPREMISE_SUB = 'percentagepricechange/perchanges/Premise';
    public static readonly ICABSAPERCENTAGEPRICECHANGEJOB_SUB = 'percentagepricechange/perchanges/ServiceCover';
    public static readonly ICABSACONTRACTANNIVERSARYCHANGE_SUB = 'contractAnniversaryChange';
    public static readonly ICABSAMASSPRICECHANGEGRID_SUB = 'application/massPriceChangeGrid';
    public static readonly ICABSASERVICECOVERMAINTENANCECONTRACT_SUB = 'maintenance/servicecover/contract';
    public static readonly ICABSASERVICECOVERMAINTENANCEJOB_SUB = 'maintenance/servicecover/job';
    public static readonly ICABSASERVICECOVERMAINTENANCEREDUCE_SUB = 'maintenance/servicecover/reduce';
    public static readonly ICABSBPRODUCTCOVERMAINTENANCE_SUB = 'business/service/productcover';
    public static readonly ICABSCMGENERALSEARCHGRID_SUB = 'generalsearchgrid';
    public static readonly ICABSAINACTIVECONTRACTINFOMAINTENANCE_SUB = 'inactive/contractinfo';
    public static readonly ICABSAINACTIVECONTRACTINFOMAINTENANCECANCEL_SUB = 'inactive/contractinfo/cancel';
    public static readonly ICABSAINACTIVECONTRACTINFOMAINTENANREINSTATEL_SUB = 'inactive/contractinfo/reinstate';
    public static readonly ICABSBPRODUCTEXPENSEMAINTENANCE = 'product/expense/maintenance';
}

export class CCMModuleRoutes {
    public static readonly ICABSCMSMSMESSAGESGRID = 'service/smsmessages';
    public static readonly ICABSCONTACTMEDIUMGRID = 'service/contactmedium';
    public static readonly ICABSCMCONTACTACTIONMAINTENANCE = 'service/contactActionMaintenance';
    public static readonly ICABSCMCALLANALYSISGRID = 'contactmanagement/callAnalysisGrid';
    public static readonly SENDBULKSMSBUSINESS = 'sendbulksms/business';
    public static readonly SENDBULKSMSBRANCH = 'sendbulksms/branch';
    public static readonly SENDBULKSMSACCOUNT = 'sendbulksms/account';
    public static readonly ICABSCMCONTACTREDIRECTION = 'contactmanagement/scmContactRedirection';
    public static readonly ICABSCMCALLCENTREASSIGNGRID = 'customerContact/callCentreAssignGrid';
    public static readonly ICABSCMWORKORDERREVIEWGRID = 'workOrderReviewGrid';
    public static readonly ICABSATELESALESORDERGRID = 'customerContact/telesalesordergrid';
    public static readonly ICABSCMCALLCENTREGRIDNEWCONTACT = 'contactManagement/CallCentreGridNewContact';
    public static readonly ICABSCMCALLCENTREGRID = 'callcentersearch';
    public static readonly ICABSCMCALLCENTREREVIEWGRID = 'centreReview';
    public static readonly ICABSCMCUSTOMERCONTACTCALLOUTGRID = 'customercontact/callout/grid';
    public static readonly ICABSSCONTACTTYPEMAINTENANCE = 'system/contact/contacttype';
}

export class ExtranetsOrConnectModuleRoutes {
}

export class InternalGridSearchModuleRoutes {
}

export class InternalGridSearchSalesModuleRoutesConstant {
    public static readonly ICABSCMPROSPECTCONVGRID = 'prospectconvgrid';
    public static readonly ICABSSPIPELINESERVICECOVERGRID = 'PipelineServiceCoverGridComponent';
    public static readonly ICABSSPIPELINEPREMISEGRID = 'PipelinePremiseGridComponent';
    public static readonly ICABSSSOQUOTEGRID = 'ssoQuoteGrid';
    public static readonly ICABSSDLCONTRACTAPPROVALGRID = 'contractapprovalgrid';
    public static readonly ICABSSSALESSTATISTICSSERVICEVALUEDETAILADJUSTGRID = 'statisticsServiceValueDetailAdjustGrid';
    public static readonly ICABSSSOSERVICECOVERGRID = 'SOServiceCoverGrid';
    public static readonly ICABSSPIPELINEQUOTEGRID = 'PipelineQuoteGrid';
    public static readonly ICABSARENVAGENCYQUARTERLYRETURN = 'envagencyquarterlyreturn';
    public static readonly ICABSALINKEDPRODUCTSGRID = 'LinkedProductsGrid';
    public static readonly ICABSSSOPREMISEGRID = 'SOPremiseGrid';
    public static readonly ICABSSDLHISTORYGRID = 'DLHistoryGridComponent';
    public static readonly ICABSAEMPTYPREMISELOCATIONSEARCHGRID = 'EmptyPremiseLocationSearchGrid';
    public static readonly ICABSASTATICVISITGRIDDAY = 'service/staticVisitGridDay';
    public static readonly ICABSASTATICVISITGRIDYEAR = 'service/StaticVisitGridYear';
    public static readonly ICABSAPRORATACHARGESUMMARY = 'proRatacharge/summary';
    public static readonly ICABSACONTRACTHISTORYGRID = 'contract/history';
    public static readonly ICABSAPLANVISITGRIDYEAR = 'contract/planVisitGridYear';
    public static readonly ICABSAPLANVISITGRIDDAY = 'contract/planVisitGridDay';
    public static readonly ICABSAPRODUCTSALESSCDETAILMAINTENANCE = 'productSalesSCDetailsMaintenance';
    public static readonly ICABSAPREMISESERVICESUMMARY = 'premiseServiceSummary';
    public static readonly ICABSBSALESAREAPOSTCODEGRID = 'SalesAreaPostCode';
    public static readonly ICABSARELATEDVISITGRID = 'relatedVisitGrid';
    public static readonly ICABSPREMISEACCESSTIMESGRID = 'PremiseAccessTimesGrid';
    public static readonly ICABSSCONTACTTYPEDETAILESCALATEGRID = 'contactTypeDetailEscalateGrid';
    public static readonly ICABSSCONTACTTYPEDETAILPROPERTIESGRID = 'contactTypeDetailPropertiesGrid';
    public static readonly ICABSACONTRACTINVOICETURNOVERGRID = 'contactinvoice/turnover';
    public static readonly ICABSSESUMMARYWORKLOADGRIDMONTHBRANCH = 'summary/workload';
    public static readonly ICABSBUSERAUTHORITYBRANCHGRID = 'Userauthoritybranch';
    public static readonly ICABSAPRORATACHARGEBRANCHGRID = 'prorata/charge/branch';
    public static readonly ICABSBINVOICERANGEUPDATEGRID = 'invoice/range/update/grid';
    public static readonly ICABSSESERVICEPATTERNGRID = 'servicepattern/grid';
    public static readonly ICABSSSALESSTATISTICSSERVICEVALUEGRID = {
        CONTRACT: 'statistics/servicevalue/contract',
        JOB: 'statistics/servicevalue/job',
        PRODUCT: 'statistics/servicevalue/product'
    };
}

export class InternalGridSearchSalesModuleRoutes {
    public static readonly ICABSCMPROSPECTCONVGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSCMPROSPECTCONVGRID;
    public static readonly ICABSSPIPELINESERVICECOVERGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSPIPELINESERVICECOVERGRID;
    public static readonly ICABSSPIPELINEPREMISEGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSPIPELINEPREMISEGRID;
    public static readonly ICABSSSOQUOTEGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSSOQUOTEGRID;
    public static readonly ICABSSDLCONTRACTAPPROVALGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSDLCONTRACTAPPROVALGRID;
    public static readonly ICABSSSALESSTATISTICSSERVICEVALUEDETAILADJUSTGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSSALESSTATISTICSSERVICEVALUEDETAILADJUSTGRID;
    public static readonly ICABSSSOSERVICECOVERGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSSOSERVICECOVERGRID;
    public static readonly ICABSSPIPELINEQUOTEGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSPIPELINEQUOTEGRID;
    public static readonly ICABSARENVAGENCYQUARTERLYRETURN = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSARENVAGENCYQUARTERLYRETURN;
    public static readonly ICABSALINKEDPRODUCTSGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSALINKEDPRODUCTSGRID;
    public static readonly ICABSSSOPREMISEGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSSOPREMISEGRID;
    public static readonly ICABSSDLHISTORYGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSDLHISTORYGRID;
    public static readonly ICABSAEMPTYPREMISELOCATIONSEARCHGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSAEMPTYPREMISELOCATIONSEARCHGRID;
    public static readonly ICABSASTATICVISITGRIDDAY = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSASTATICVISITGRIDDAY;
    public static readonly ICABSASTATICVISITGRIDYEAR = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSASTATICVISITGRIDYEAR;
    public static readonly ICABSAPRORATACHARGESUMMARY = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSAPRORATACHARGESUMMARY;
    public static readonly ICABSACONTRACTHISTORYGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSACONTRACTHISTORYGRID;
    public static readonly ICABSAPLANVISITGRIDYEAR = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSAPLANVISITGRIDYEAR;
    public static readonly ICABSAPLANVISITGRIDDAY = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSAPLANVISITGRIDDAY;
    public static readonly ICABSAPRODUCTSALESSCDETAILMAINTENANCE = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSAPRODUCTSALESSCDETAILMAINTENANCE;
    public static readonly ICABSAPREMISESERVICESUMMARY = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSAPREMISESERVICESUMMARY;
    public static readonly ICABSBSALESAREAPOSTCODEGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSBSALESAREAPOSTCODEGRID;
    public static readonly ICABSARELATEDVISITGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSARELATEDVISITGRID;
    public static readonly ICABSPREMISEACCESSTIMESGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSPREMISEACCESSTIMESGRID;
    public static readonly ICABSSCONTACTTYPEDETAILESCALATEGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILESCALATEGRID;
    public static readonly ICABSSCONTACTTYPEDETAILPROPERTIESGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILPROPERTIESGRID;
    public static readonly ICABSACONTRACTINVOICETURNOVERGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSACONTRACTINVOICETURNOVERGRID;
    public static readonly ICABSSESUMMARYWORKLOADGRIDMONTHBRANCH = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSESUMMARYWORKLOADGRIDMONTHBRANCH;
    public static readonly ICABSBUSERAUTHORITYBRANCHGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSBUSERAUTHORITYBRANCHGRID;
    public static readonly ICABSAPRORATACHARGEBRANCHGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSAPRORATACHARGEBRANCHGRID;
    public static readonly ICABSBINVOICERANGEUPDATEGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSBINVOICERANGEUPDATEGRID;
    public static readonly ICABSSESERVICEPATTERNGRID = AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSESERVICEPATTERNGRID;
    public static readonly ICABSSSALESSTATISTICSSERVICEVALUEGRID = {
        CONTRACT: AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSSALESSTATISTICSSERVICEVALUEGRID.CONTRACT,
        JOB: AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSSALESSTATISTICSSERVICEVALUEGRID.JOB,
        PRODUCT: AppModuleRoutes.GRID_SALES + InternalGridSearchSalesModuleRoutesConstant.ICABSSSALESSTATISTICSSERVICEVALUEGRID.PRODUCT
    };
}

export class InternalGridSearchApplicationModuleRoutesConstant {
    public static readonly ICABSAAPPLYAPICONTRACTGRID = 'applyapigrid';
    public static readonly ICABSASERVICECOVERSEASONGRID = 'servicecover/seasongrid';
    public static readonly ICABSAPNOLLEVELHISTORY = 'PNOLLevelHistory';
    public static readonly ICABSASERVICECOVERWASTEGRID = 'servicecover/wastegrid';
    public static readonly ICABSAINVOICEHEADERGRID = 'invoiceheadergridcomponent';
    public static readonly ICABSSASERVICECOVERDISPLAYGRID = 'serviceCoverDisplayGrid';
    public static readonly ICABSCMCALLCENTRESEARCHEMPLOYEEGRID = 'cmCallCentreSearchEmployeeGrid';
    public static readonly ICABSCMCALLCENTREGRIDNOTEPAD = 'callCentreGridNotepad';
    public static readonly ICABSATELESALESORDERLINEGRID = 'teleSalesOrderLineGrid';
    public static readonly ICABSACREDITAPPROVALGRID = 'creditApprovalGrid';
    public static readonly ICABSCMCALLANALYSISTICKETGRID = 'CallAnalysisTicketGridComponent';
    public static readonly ICABSALINKEDPREMISESUMMARYGRID = 'linkedPremiseSummaryGrid';
    public static readonly ICABSAINVOICEGROUPADDRESSAMENDMENTGRID = 'addressAmendment';
    public static readonly ICABSCLOSEDTEMPLATEDATEGRID = 'closedTemplateDateGrid';
    public static readonly ICABSCMCALLCENTERGRIDEMPLOYEEVIEW = 'callcentergridemployee';
    public static readonly ICABSACALENDARTEMPLATEBRANCHACCESSGRID = 'calendarTemplateBranchAccessGrid';
    public static readonly ICABSCMCUSTOMERCONTACTDETAILGRID = 'customer/contactdetail';
    public static readonly ICABSCMCALLCENTREGRIDCALLLOGDETAILVIEW = 'callcentregridcallLogdetailview';
    public static readonly ICABSBPREMISEPOSTCODEREZONEGRID = 'premisePostcodeRezoneGrid';
    public static readonly ICABSCMHCALEADGRID = 'leadgrid';
    public static readonly ICABSASERVICECOVERCALENDARDATEGRID = 'servicecover/calendardate';
    public static readonly ICABSASERVICECOVERCLOSEDDATEGRID = 'servicecovercloseddategrid';
    public static readonly ICABSAEMPLOYEEGRID = 'employeegrid';
    public static readonly ICABSBLISTGROUPSEARCH = 'ListGroupSearch';
    public static readonly ICABSCMACCOUNTREVIEWGRID = 'reportContacts/accountReviewGrid';
    public static readonly ICABSSEPLANVISITGRID = 'visitmaintenance/planvisitGrid';
    public static readonly ICABSSCONTACTTYPEDETAILASSIGNEEGRID = 'contactyypedetailassigneegrid';
    public static readonly ICABSAINVOICEBYACCOUNTGRID = 'invoice/account';
    public static readonly ICABSCMCUSTOMERCONTACTNOTIFICATIONSGRID = 'customercontact/notification';
    public static readonly ICABSASERVICECOVERUPDATEABLEGRID = 'serviceCoverUpdateableGrid';
}

export class InternalGridSearchApplicationModuleRoutes {
    public static readonly ICABSAAPPLYAPICONTRACTGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSAAPPLYAPICONTRACTGRID;
    public static readonly ICABSASERVICECOVERSEASONGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERSEASONGRID;
    public static readonly ICABSAPNOLLEVELHISTORY = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSAPNOLLEVELHISTORY;
    public static readonly ICABSASERVICECOVERWASTEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERWASTEGRID;
    public static readonly ICABSAINVOICEHEADERGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSAINVOICEHEADERGRID;
    public static readonly ICABSSASERVICECOVERDISPLAYGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSSASERVICECOVERDISPLAYGRID;
    public static readonly ICABSCMCALLCENTRESEARCHEMPLOYEEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLCENTRESEARCHEMPLOYEEGRID;
    public static readonly ICABSCMCALLCENTREGRIDNOTEPAD = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLCENTREGRIDNOTEPAD;
    public static readonly ICABSATELESALESORDERLINEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSATELESALESORDERLINEGRID;
    public static readonly ICABSACREDITAPPROVALGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSACREDITAPPROVALGRID;
    public static readonly ICABSCMCALLANALYSISTICKETGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLANALYSISTICKETGRID;
    public static readonly ICABSALINKEDPREMISESUMMARYGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSALINKEDPREMISESUMMARYGRID;
    public static readonly ICABSAINVOICEGROUPADDRESSAMENDMENTGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSAINVOICEGROUPADDRESSAMENDMENTGRID;
    public static readonly ICABSCLOSEDTEMPLATEDATEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCLOSEDTEMPLATEDATEGRID;
    public static readonly ICABSCMCALLCENTERGRIDEMPLOYEEVIEW = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLCENTERGRIDEMPLOYEEVIEW;
    public static readonly ICABSACALENDARTEMPLATEBRANCHACCESSGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSACALENDARTEMPLATEBRANCHACCESSGRID;
    public static readonly ICABSCMCUSTOMERCONTACTDETAILGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCUSTOMERCONTACTDETAILGRID;
    public static readonly ICABSCMCALLCENTREGRIDCALLLOGDETAILVIEW = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCALLCENTREGRIDCALLLOGDETAILVIEW;
    public static readonly ICABSBPREMISEPOSTCODEREZONEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSBPREMISEPOSTCODEREZONEGRID;
    public static readonly ICABSCMHCALEADGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCMHCALEADGRID;
    public static readonly ICABSASERVICECOVERCALENDARDATEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERCALENDARDATEGRID;
    public static readonly ICABSASERVICECOVERCLOSEDDATEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERCLOSEDDATEGRID;
    public static readonly ICABSAEMPLOYEEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSAEMPLOYEEGRID;
    public static readonly ICABSBLISTGROUPSEARCH = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSBLISTGROUPSEARCH;
    public static readonly ICABSCMACCOUNTREVIEWGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCMACCOUNTREVIEWGRID;
    public static readonly ICABSSEPLANVISITGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSSEPLANVISITGRID;
    public static readonly ICABSSCONTACTTYPEDETAILASSIGNEEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSSCONTACTTYPEDETAILASSIGNEEGRID;
    public static readonly ICABSCMCUSTOMERCONTACTNOTIFICATIONSGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSCMCUSTOMERCONTACTNOTIFICATIONSGRID;
    public static readonly ICABSAINVOICEBYACCOUNTGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSAINVOICEBYACCOUNTGRID;
    public static readonly ICABSASERVICECOVERUPDATEABLEGRID = AppModuleRoutes.GRID_APPLICATION + InternalGridSearchApplicationModuleRoutesConstant.ICABSASERVICECOVERUPDATEABLEGRID;

}

export class InternalGridSearchServiceModuleRoutesConstant {
    public static readonly ICABSSEHCANEWLOCATIONGRID = 'hca/newlocation';
    public static readonly ICABSSSOPROSPECTGRID = 'prospectgrid';
    public static readonly ICABSACLOSEDTEMPLATEBRANCHACCESSGRID = 'ClosedTemplateBranchAccessGrid';
    public static readonly ICABSSECUSTOMERSIGNATUREDETAIL = 'customerSignatureDetail';
    public static readonly ICABSANNIVERSARYGENERATE = 'AnniversaryGenerate';
    public static readonly ICABSADIARYYEARGRID = 'DairyYearGridGridComponent';
    public static readonly ICABSASERVICECOVERDISPLAYENTRY = 'servicedisplayentry';
    public static readonly ICABSASERVICECOVERDETAILLOCATIONENTRYGRID = 'ServiceCoverDetailLocationEntryGridComponent';
    public static readonly ICABSAPLANVISITTABULAR = 'premise/planVisit';
    public static readonly ICABSBBRANCHHOLIDAYGRID = 'business/branchholiday';

    public static readonly ICABSACALENDARTEMPLATEDATEGRID = 'business/calendartemplategrid';
    public static readonly ICABSASEASONALTEMPLATEDETAILGRID = 'seasonaltemplatedetailgrid';
    public static readonly ICABSSINFESTATIONTOLERANCEGRID = 'contractmanagement/account/infestationToleranceGrid';
    public static readonly ICABSCMCUSTOMERCONTACTHISTORYGRID = 'contactmanagement/customercontactHistorygrid';
    public static readonly ICABSACONTRACTSERVICESUMMARY = 'contractmanagement/account/contractservicesummary';
    public static readonly ICABSSEDEBRIEFSUMMARYGRID = 'debrief/summary';
    public static readonly ICABSASERVICEVALUEGRID = 'contractmanagement/account/serviceValue';
    public static readonly ICABSAACCOUNTADDRESSCHANGEHISTORYGRID = 'contractmanagement/account/addressChangeHistory';
    public static readonly ICABSASERVICEVISITSUMMARY = 'contractmanagement/maintenance/contract/visitsummary';
    public static readonly ICABSCMWORKORDERGRID = 'contactmanagement/scmworkordergrid';

    public static readonly ICABSSCONTACTTYPEDETAILASSIGNEEGRID = 'contactManagement/contactTypeDetail/ContactTypeDetailAssigneeGrid';
    public static readonly ICABSCMGENERALSEARCHINFOGRID = 'contactmanagement/generalsearchInfo';
    public static readonly ICABSSESUMMARYWORKLOADREZONEMOVEGRID = 'application/summaryworkloadrezone/movegrid';
    public static readonly ICABSSESUMMARYWORKLOADREZONEMOVEGRIDDEST = 'application/summaryworkloadrezone/destinatiomovegrid';
    public static readonly ICABSACONTRACTPRODUCTSUMMARY = 'contract/product/summary';

    public static readonly ICABSSVISITTOLERANCEGRID = 'visittolerancegrid';
    public static readonly ICABSARECOMMENDATIONGRID = {
        URL_1: 'recommendation',
        URL_2: 'contractmanagement/account/recommendationGrid'
    };
    public static readonly ICABSAPRODUCTSALESSCENTRYGRID = {
        URL_1: 'productSalesSCEntryGrid',
        URL_2: 'contractmanagement/maintenance/productSalesSCEntryGrid'
    };
    public static readonly ICABSACUSTOMERINFORMATIONSUMMARY = {
        URL_1: 'contract/customerinformation',
        URL_2: 'contractmanagement/maintenance/contract/customerinformation'
    };
    public static readonly ICABSAPREMISESEARCHGRID = {
        URL_1: 'premise/search',
        URL_2: 'contractmanagement/maintenance/contract/premise'
    };
    public static readonly ICABSSESERVICEPLANNINGGRID = 'planning/grid';
    public static readonly ICABSSESERVICEWORKLISTGRID = 'worklist/grid';
    public static readonly ICABSSESERVICEACTIVITYUPDATEGRID = 'visit/activity';
    public static readonly ICABSSESERVICEWORKLISTDATEGRID = 'service/worklist/dategrid';
}

export class InternalGridSearchServiceModuleRoutes {
    public static readonly ICABSSEHCANEWLOCATIONGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSEHCANEWLOCATIONGRID;
    public static readonly ICABSSSOPROSPECTGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSSOPROSPECTGRID;
    public static readonly ICABSACLOSEDTEMPLATEBRANCHACCESSGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSACLOSEDTEMPLATEBRANCHACCESSGRID;
    public static readonly ICABSSECUSTOMERSIGNATUREDETAIL = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSECUSTOMERSIGNATUREDETAIL;
    public static readonly ICABSANNIVERSARYGENERATE = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSANNIVERSARYGENERATE;
    public static readonly ICABSADIARYYEARGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSADIARYYEARGRID;
    public static readonly ICABSASERVICECOVERDISPLAYENTRY = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSASERVICECOVERDISPLAYENTRY;
    public static readonly ICABSASERVICECOVERDETAILLOCATIONENTRYGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSASERVICECOVERDETAILLOCATIONENTRYGRID;
    public static readonly ICABSAPLANVISITTABULAR = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSAPLANVISITTABULAR;
    public static readonly ICABSBBRANCHHOLIDAYGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSBBRANCHHOLIDAYGRID;
    public static readonly ICABSACALENDARTEMPLATEDATEGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSACALENDARTEMPLATEDATEGRID;
    public static readonly ICABSASEASONALTEMPLATEDETAILGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSASEASONALTEMPLATEDETAILGRID;
    public static readonly ICABSSINFESTATIONTOLERANCEGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSINFESTATIONTOLERANCEGRID;
    public static readonly ICABSCMCUSTOMERCONTACTHISTORYGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSCMCUSTOMERCONTACTHISTORYGRID;
    public static readonly ICABSACONTRACTSERVICESUMMARY = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSACONTRACTSERVICESUMMARY;
    public static readonly ICABSSEDEBRIEFSUMMARYGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSEDEBRIEFSUMMARYGRID;
    public static readonly ICABSASERVICEVALUEGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSASERVICEVALUEGRID;
    public static readonly ICABSAACCOUNTADDRESSCHANGEHISTORYGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSAACCOUNTADDRESSCHANGEHISTORYGRID;
    public static readonly ICABSASERVICEVISITSUMMARY = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSASERVICEVISITSUMMARY;
    public static readonly ICABSCMWORKORDERGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSCMWORKORDERGRID;

    public static readonly ICABSSVISITTOLERANCEGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSVISITTOLERANCEGRID;
    public static readonly ICABSARECOMMENDATIONGRID = {
        URL_1: AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSARECOMMENDATIONGRID.URL_1,
        URL_2: AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSARECOMMENDATIONGRID.URL_2
    };
    public static readonly ICABSAPRODUCTSALESSCENTRYGRID = {
        URL_1: AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSAPRODUCTSALESSCENTRYGRID.URL_1,
        URL_2: AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSAPRODUCTSALESSCENTRYGRID.URL_2
    };
    public static readonly ICABSACUSTOMERINFORMATIONSUMMARY = {
        URL_1: AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1,
        URL_2: AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSACUSTOMERINFORMATIONSUMMARY.URL_2
    };
    public static readonly ICABSAPREMISESEARCHGRID = {
        URL_1: AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSAPREMISESEARCHGRID.URL_1,
        URL_2: AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSAPREMISESEARCHGRID.URL_2
    };
    public static readonly ICABSCMGENERALSEARCHINFOGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSCMGENERALSEARCHINFOGRID;
    public static readonly ICABSACONTRACTPRODUCTSUMMARY = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSACONTRACTPRODUCTSUMMARY;
    public static readonly ICABSSESERVICEPLANNINGGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSESERVICEPLANNINGGRID;
    public static readonly ICABSSESERVICEWORKLISTGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSESERVICEWORKLISTGRID;
    public static readonly ICABSSESERVICEACTIVITYUPDATEGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSESERVICEACTIVITYUPDATEGRID;
    public static readonly ICABSSESERVICEWORKLISTDATEGRID = AppModuleRoutes.GRID_SERVICE + InternalGridSearchServiceModuleRoutesConstant.ICABSSESERVICEWORKLISTDATEGRID;
}

export class InternalMaintenanceModuleRoutes {
    public static readonly ICABSCMTELESALESENTRYORDERLINEMAINTENANCE = 'maintenance/telesalesEntryOrderLineMaintenance';
    public static readonly ICABSCMPROSPECTCONVERSIONMAINTENANCE = 'maintenance/prospectConversionMaintenance';
    public static readonly ICABSBPRODUCTSERVICEGROUPMAINTENANCE = 'maintenance/productserviceGroupmaintenance';
}

export class InternalMaintenanceApplicationModuleRoutesConstant {
    public static readonly ICABSAINVOICEHEADERADDRESSDETAILS = 'invoice/addressdetails';
    public static readonly ICABSACONTRACTRENEWALMAINTENANCE = 'contract/renewal';
    public static readonly ICABSASERVICECOVERCOMPONENTENTRY = 'ServiceCoverComponentEntry';
    public static readonly RIMBATCHPROCESSMONITORMAINTENANCE = 'BatchProcessMonitorMaintenance';
    public static readonly ICABSASERVICECOVERDETAILGROUPMAINTENANCE = 'serviceCoverDetailGroupMaintenance';
    public static readonly ICABSAINVOICEREPRINTMAINTENANCE = 'invoiceReprintMaintenance';
    public static readonly ICABSAINVOICEGROUPPAYMENTMAINTENANCE = 'grouppaymentmaintenance';
    public static readonly ICABSAACCOUNTBANKDETAILSMAINTENANCE = 'AccountBankDetailsMaintenance';
    public static readonly ICABSAINVOICEPRINTMAINTENANCE = 'invoice/print/maintenance';
    public static readonly ICABSASERVICECOVERSEASONMAINTENANCE = 'servicecover/season';
    public static readonly ICABSASERVICECOVERDETAILMAINTENANCE = 'ServiceCoverDetailMaintenance';
    public static readonly ICABSACALENDARTEMPLATEMAINTENANCE = 'calendarTemplateMaintenance';
    public static readonly ICABSASEASONALTEMPLATEMAINTENANCE = 'seasonal/templatemaintenance';
    public static readonly ICABSAACCOUNTOWNERMAINTENANCE = 'accountowner';
    public static readonly ICABSAPLANVISITMAINTENANCE = 'planvisit';
    public static readonly ICABSACONTRACTHISTORYDETAIL = 'contractHistoryDetail';
    public static readonly ICABSALOSTBUSINESSREQUESTMAINTENANCE = 'lostbusinessrequestmaintenance';
    public static readonly ICABSAPREMISELOCATIONMAINTENANCE = 'premiseLocationMaintenance';
    public static readonly ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE = 'CustomerInformationAccountMaintenance';
    public static readonly ICABSATRIALPERIODRELEASEMAINTENANCE = 'trialperiodrelease';
    public static readonly ICABSACUSTOMERINFORMATIONMAINTENANCE = 'customerinformation';
    public static readonly ICABSASERVICECOVERPRICECHANGEMAINTENANCE = 'serviceCoverPriceChange';
    public static readonly ICABSASERVICECOVERDISPLAYMASSVALUES = 'serviceCoverDisplayMassValues';
    public static readonly ICABSASERVICECOVERLOCATIONMAINTENANCE = 'servicecoverlocationmaintenance';
    public static readonly ICABSASERVICECOVERCOMMENCEDATEMAINTENANCE = 'serviceCoverCommencedate';
    public static readonly ICABSASERVICECOVERCOMMENCEDATEMAINTENANCEEX = 'servicecover/commencedate';
    public static readonly ICABSASERVICECOVERLOCATIONMOVEMAINTENANCE = 'ServiceCoverLocationMoveMaintenance';
    public static readonly ICABSBPRODUCTMAINTENANCE = 'product/maintenance';
    public static readonly ICABSCMCALLCENTRECREATEFIXEDPRICEJOB = 'callcentre/createfixedpricejob';
    public static readonly ICABSALOSTBUSINESSCONTACTMAINTENANCE = 'lostbusinesscontactmaintenance';
    public static readonly ICABSSCONTACTTYPEDETAILMAINTENANCE = 'maintenance/contacttype/detail';
    public static readonly ICABSBLOSTBUSINESSDETAILMAINTENANCE = 'business/lost/detail/maintenance';
    public static readonly ICABSBPRODUCTDETAILMAINTENANCE = 'maintenance/product/detail';
    public static readonly ICABSASERVICECOVERSUSPENDMAINTENANCE = {
        CONTRACT: 'servicecover/suspend/contract',
        JOB: 'servicecover/suspend/job'
    };
    public static readonly ICABSAPREMISESUSPENDMAINTENANCE = {
        CONTRACT: 'premise/suspend/contract',
        JOB: 'premise/suspend/job'
    };
    public static readonly ICABSBVALIDLINKEDPRODUCTSMAINTENANCE = 'maintenance/validlinkedproduct';
    public static readonly ICABSAVISITAPPOINTMENTMAINTENANCE = 'visit/appointment';
    public static readonly ICABSBPRODUCTSERVICEGROUPMAINTENANCE = 'maintenance/productservice/group';
    public static readonly ICABSSCUSTOMERTYPEMAINTENANCE = 'maintenance/customertype';
}

export class InternalMaintenanceApplicationModuleRoutes {
    public static readonly ICABSAINVOICEHEADERADDRESSDETAILS = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAINVOICEHEADERADDRESSDETAILS;
    public static readonly ICABSACONTRACTRENEWALMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSACONTRACTRENEWALMAINTENANCE;
    public static readonly ICABSASERVICECOVERCOMPONENTENTRY = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERCOMPONENTENTRY;
    public static readonly RIMBATCHPROCESSMONITORMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.RIMBATCHPROCESSMONITORMAINTENANCE;
    public static readonly ICABSASERVICECOVERDETAILGROUPMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERDETAILGROUPMAINTENANCE;
    public static readonly ICABSAINVOICEREPRINTMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAINVOICEREPRINTMAINTENANCE;
    public static readonly ICABSAINVOICEGROUPPAYMENTMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAINVOICEGROUPPAYMENTMAINTENANCE;
    public static readonly ICABSAACCOUNTBANKDETAILSMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAACCOUNTBANKDETAILSMAINTENANCE;
    public static readonly ICABSAINVOICEPRINTMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAINVOICEPRINTMAINTENANCE;
    public static readonly ICABSASERVICECOVERSEASONMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERSEASONMAINTENANCE;
    public static readonly ICABSASERVICECOVERDETAILMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERDETAILMAINTENANCE;
    public static readonly ICABSACALENDARTEMPLATEMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSACALENDARTEMPLATEMAINTENANCE;
    public static readonly ICABSALOSTBUSINESSREQUESTMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSALOSTBUSINESSREQUESTMAINTENANCE;
    public static readonly ICABSASEASONALTEMPLATEMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASEASONALTEMPLATEMAINTENANCE;
    public static readonly ICABSAACCOUNTOWNERMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAACCOUNTOWNERMAINTENANCE;
    public static readonly ICABSAPLANVISITMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAPLANVISITMAINTENANCE;
    public static readonly ICABSACONTRACTHISTORYDETAIL = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSACONTRACTHISTORYDETAIL;
    public static readonly ICABSAPREMISELOCATIONMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAPREMISELOCATIONMAINTENANCE;
    public static readonly ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSACUSTOMERINFORMATIONACCOUNTMAINTENANCE;
    public static readonly ICABSATRIALPERIODRELEASEMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSATRIALPERIODRELEASEMAINTENANCE;
    public static readonly ICABSACUSTOMERINFORMATIONMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSACUSTOMERINFORMATIONMAINTENANCE;
    public static readonly ICABSASERVICECOVERPRICECHANGEMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERPRICECHANGEMAINTENANCE;
    public static readonly ICABSASERVICECOVERDISPLAYMASSVALUES = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERDISPLAYMASSVALUES;
    public static readonly ICABSASERVICECOVERLOCATIONMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERLOCATIONMAINTENANCE;
    public static readonly ICABSASERVICECOVERCOMMENCEDATEMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCE;
    public static readonly ICABSASERVICECOVERCOMMENCEDATEMAINTENANCEEX = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCEEX;
    public static readonly ICABSASERVICECOVERLOCATIONMOVEMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERLOCATIONMOVEMAINTENANCE;
    public static readonly ICABSBPRODUCTMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSBPRODUCTMAINTENANCE;
    public static readonly ICABSSCONTACTTYPEDETAILMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSSCONTACTTYPEDETAILMAINTENANCE;
    public static readonly ICABSALOSTBUSINESSCONTACTMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSALOSTBUSINESSCONTACTMAINTENANCE;
    public static readonly ICABSBLOSTBUSINESSDETAILMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSBLOSTBUSINESSDETAILMAINTENANCE;
    public static readonly ICABSBPRODUCTDETAILMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSBPRODUCTDETAILMAINTENANCE;
    public static readonly ICABSASERVICECOVERSUSPENDMAINTENANCE = {
        CONTRACT: AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERSUSPENDMAINTENANCE.CONTRACT,
        JOB: AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSASERVICECOVERSUSPENDMAINTENANCE.JOB
    };
    public static readonly ICABSAPREMISESUSPENDMAINTENANCE = {
        CONTRACT: AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAPREMISESUSPENDMAINTENANCE.CONTRACT,
        JOB: AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAPREMISESUSPENDMAINTENANCE.JOB
    };
    public static readonly ICABSBVALIDLINKEDPRODUCTSMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSBVALIDLINKEDPRODUCTSMAINTENANCE;
    public static readonly ICABSAVISITAPPOINTMENTMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSAVISITAPPOINTMENTMAINTENANCE;
    public static readonly ICABSBPRODUCTSERVICEGROUPMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSBPRODUCTSERVICEGROUPMAINTENANCE;
    public static readonly ICABSSCUSTOMERTYPEMAINTENANCE = AppModuleRoutes.MAINTENANCE_APPLICATION + InternalMaintenanceApplicationModuleRoutesConstant.ICABSSCUSTOMERTYPEMAINTENANCE;
}

export class InternalMaintenanceSalesModuleRoutesConstant {
    public static readonly ICABSAPRORATACHARGEMAINTENANCE = 'invoice/ProRataChargeMaintenance';
    public static readonly ICABSAINVOICENARRATIVEMAINTENANCE = 'contract/invoicenarrative';
    public static readonly ICABSACUSTOMERINFOMAINTENANCE = 'customerInfoMaintenance';
    public static readonly ICABSACONTRACTCOMMENCEDATEMAINTENANCE = 'commencedate';
    public static readonly ICABSACONTRACTCOMMENCEDATEMAINTENANCEEX = 'commencedateex';
    public static readonly ICABSRENEWALGENERATE = 'renewalLetterGenerate';
    public static readonly ICABSASERVICECOVERCALENDARDATESMAINTENANCE = 'ServiceCoverCalendarDatesMaintenance';
    public static readonly ICABSAINVOICECHARGEMAINTENANCE = 'invoiceChargeMaintenance';
    public static readonly ICABSAINVOICEPRINTLINEMAINTENANCE = 'InvoicePrintLine';
    public static readonly ICABSAINVOICEGROUPPREMISEMAINTENANCE = 'invoicepremisegroup/search';
    public static readonly ICABSBINVOICERUNDATEMAINTENANCE = 'invoiceRunDateMaintenance';
    public static readonly ICABSSPROSPECTSTATUSCHANGE = 'prospectstatuschange';
    public static readonly ICABSBINVOICERANGEMAINTENANCE = 'rangemaintenance';
    public static readonly ICABSBINVOICERUNDATECONFIRM = 'rundateconfirm';
    public static readonly ICABSSDLSERVICECOVERMAINTENANCE = 'dlservicecover';
    public static readonly ICABSSSOQUOTESTATUSMAINTENANCE = 'quotestatusmaintenance';
    public static readonly ICABSSDLPREMISEMAINTENANCE = 'sdlpremisemaintenance';
    public static readonly ICABSSDLCONTRACTMAINTENANCE = 'sSdlContractMaintenance';
    public static readonly ICABSSVISITTOLERANCEMAINTENANCE = 'visitTolerance';
    public static readonly ICABSSSOQUOTESUBMITMAINTENANCE = 'quoteSubmitMaintenance';
    public static readonly ICABSBEXPENSECODEMAINTENANCE = 'expensecode';
    public static readonly RIMBATCHPROGRAMSCHEDULEMAINTENANCE = 'batchProgramSchedule';
    public static readonly ICABSASERVICECOVERCOMPONENTREPLACEMENT = 'maintenance/servicecoverreplacement';
    public static readonly ICABSCMTELESALESENTRYCONFIRMORDER = 'ccm/telesalesentryconfirmorder';
    public static readonly ICABSSCONTACTTYPEDETAILLANGMAINTENANCE = 'contact/type/detial/langmaintenance';
    public static readonly ICABSBLOSTBUSINESSMAINTENANCE = 'lostbusinessmaintenance';
    public static readonly ICABSSCONTACTTYPEDETAILPCEXCMAINT = 'system/contacttypedetailpcexcmaint';
    public static readonly ICABSSCONTACTTYPEDETAILPROPERTIESMAINT = 'maintenance/contacttypedetailpropertiesmaintenance';
    public static readonly ICABSACONTRACTSUSPENDMAINTENANCE = {
        CONTRACT: 'contract/suspend',
        JOB: 'job/suspend'
    };
}

export class InternalMaintenanceSalesModuleRoutes {
    public static readonly ICABSAPRORATACHARGEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSAPRORATACHARGEMAINTENANCE;
    public static readonly ICABSAINVOICENARRATIVEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSAINVOICENARRATIVEMAINTENANCE;
    public static readonly ICABSACUSTOMERINFOMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSACUSTOMERINFOMAINTENANCE;
    public static readonly ICABSACONTRACTCOMMENCEDATEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSACONTRACTCOMMENCEDATEMAINTENANCE;
    public static readonly ICABSACONTRACTCOMMENCEDATEMAINTENANCEEX = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSACONTRACTCOMMENCEDATEMAINTENANCEEX;
    public static readonly ICABSRENEWALGENERATE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSRENEWALGENERATE;
    public static readonly ICABSASERVICECOVERCALENDARDATESMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSASERVICECOVERCALENDARDATESMAINTENANCE;
    public static readonly ICABSAINVOICECHARGEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSAINVOICECHARGEMAINTENANCE;
    public static readonly ICABSAINVOICEPRINTLINEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSAINVOICEPRINTLINEMAINTENANCE;
    public static readonly ICABSAINVOICEGROUPPREMISEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSAINVOICEGROUPPREMISEMAINTENANCE;
    public static readonly ICABSBINVOICERUNDATEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSBINVOICERUNDATEMAINTENANCE;
    public static readonly ICABSSPROSPECTSTATUSCHANGE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSPROSPECTSTATUSCHANGE;
    public static readonly ICABSBINVOICERANGEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSBINVOICERANGEMAINTENANCE;
    public static readonly ICABSBINVOICERUNDATECONFIRM = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSBINVOICERUNDATECONFIRM;
    public static readonly ICABSSDLSERVICECOVERMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSDLSERVICECOVERMAINTENANCE;
    public static readonly ICABSSSOQUOTESTATUSMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSSOQUOTESTATUSMAINTENANCE;
    public static readonly ICABSSDLPREMISEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSDLPREMISEMAINTENANCE;
    public static readonly ICABSSDLCONTRACTMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSDLCONTRACTMAINTENANCE;
    public static readonly ICABSSVISITTOLERANCEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSVISITTOLERANCEMAINTENANCE;
    public static readonly ICABSSSOQUOTESUBMITMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSSOQUOTESUBMITMAINTENANCE;
    public static readonly ICABSBEXPENSECODEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSBEXPENSECODEMAINTENANCE;
    public static readonly RIMBATCHPROGRAMSCHEDULEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.RIMBATCHPROGRAMSCHEDULEMAINTENANCE;
    public static readonly ICABSASERVICECOVERCOMPONENTREPLACEMENT = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSASERVICECOVERCOMPONENTREPLACEMENT;
    public static readonly ICABSCMTELESALESENTRYCONFIRMORDER = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSCMTELESALESENTRYCONFIRMORDER;
    public static readonly ICABSSCONTACTTYPEDETAILLANGMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILLANGMAINTENANCE;
    public static readonly ICABSBLOSTBUSINESSMAINTENANCE = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSBLOSTBUSINESSMAINTENANCE;
    public static readonly ICABSSCONTACTTYPEDETAILPCEXCMAINT = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILPCEXCMAINT;
    public static readonly ICABSSCONTACTTYPEDETAILPROPERTIESMAINT = AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSSCONTACTTYPEDETAILPROPERTIESMAINT;
    public static readonly ICABSACONTRACTSUSPENDMAINTENANCE = {
        CONTRACT: AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSACONTRACTSUSPENDMAINTENANCE.CONTRACT,
        JOB: AppModuleRoutes.MAINTENANCE_SALES + InternalMaintenanceSalesModuleRoutesConstant.ICABSACONTRACTSUSPENDMAINTENANCE.JOB
    };
}

export class InternalMaintenanceServiceModuleRoutesConstant {
    public static readonly ICABSBBRANCHHOLIDAYMAINTENANCE = 'business/branchholidaymaintenance';
    public static readonly ICABSALINKEDPRODUCTSMAINTENANCE = 'linkedproduct';
    public static readonly ICABSSESERVICEPLANNINGEMPLOYEETIMEMAINTENANCEHG = 'serviceplanning/employeetimemaintenancehg';
    public static readonly ICABSSEDATACHANGEMAINTENANCE = 'datachangemaintenance';
    public static readonly ICABSSEPDAICABSINFESTATIONMAINTENANCE = 'pda/infestationmaintenance';
    public static readonly ICABSSEINFESTATIONMAINTENANCE = 'infestationmaintenance';
    public static readonly ICABSSESERVICEPLANCANCEL = 'serviceplancancel';
    public static readonly ICABSSESERVICEAREASEQUENCEMAINTENANCE = 'servicearea/sequencemaintenance';
    public static readonly ICABSSESERVICEVISITMAINTENANCE = 'visit/maintenance';
    public static readonly ICABSADIARYENTRY = 'diaryentry';
    public static readonly ICABSCMNATAXJOBSERVICEDETAILGROUPMAINTENANCE = 'maintenance/nataxjobservicedetailgroupmaintenance';
    public static readonly ICABSBAPIRATEMAINTENANCE = 'apiRateMaintenance';
    public static readonly ICABSCMNATAXJOBSERVICECOVERMAINTENANCE = 'jobServiceCoverMaintenance';
    public static readonly ICABSCMCUSTOMERCONTACTEMPLOYEEVIEW = 'customercontactemployeeview';
    public static readonly ICABSCMEMPLOYEEVIEWBRANCHDETAILS = 'employee/branchdetails';
    public static readonly ICABSCMCAMPAIGNENTRY = 'campaign/entry';
    public static readonly ICABSCMPROSPECTMAINTENANCE = 'prospectmaintenance';
    public static readonly ICABSCMTELESALESENTRY = 'telesalesEntry';
    public static readonly ICABSSECREDITSERVICEVISITGROUPMAINTENANCE = 'credit/visitgroupmaintenance';
    public static readonly ICABSCMCONTACTPERSONMAINTENANCE = 'ContactPersonMaintenance';
    public static readonly ICABSCMCALLOUTMAINTENANCE = 'calloutmaintenance';
    public static readonly ICABSCMSMSREDIRECT = 'SMSRedirect';
    public static readonly ICABSSESERVICEVALUEMAINTENANCE = 'servicevalue';
    public static readonly ICABSCMCUSTOMERCONTACTROOTCAUSEENTRY = 'customercontactroot';
    public static readonly ICABSCMCUSTOMERCONTACTMAINTENANCECOPY = 'CustomerContactMaintenanceCopy';
    public static readonly ICABSSESERVICEPLANDELIVERYNOTEGENERATION = 'business/ServicePlanDeliveryNoteGeneration';
    public static readonly ICABSWORKLISTCONFIRMSUBMIT = 'worklistconfirmsubmit';
    public static readonly ICABSSESERVICEPLANDESCMAINTENANCE = 'plandescmaintenance';
    public static readonly ICABSSEPLANVISITMAINTENANCE = 'planvisitmaintenance';
    public static readonly ICABSSEPLANVISITMAINTENANCE2 = 'planvisitmaintenance2';
    public static readonly ICABSCMWORKORDERMAINTENANCE = 'workordermaintenance';

}

export class InternalMaintenanceServiceModuleRoutes {
    public static readonly ICABSBBRANCHHOLIDAYMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSBBRANCHHOLIDAYMAINTENANCE;
    public static readonly ICABSALINKEDPRODUCTSMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSALINKEDPRODUCTSMAINTENANCE;
    public static readonly ICABSSESERVICEPLANNINGEMPLOYEETIMEMAINTENANCEHG = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEPLANNINGEMPLOYEETIMEMAINTENANCEHG;
    public static readonly ICABSSEDATACHANGEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSEDATACHANGEMAINTENANCE;
    public static readonly ICABSSEPDAICABSINFESTATIONMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSEPDAICABSINFESTATIONMAINTENANCE;
    public static readonly ICABSSEINFESTATIONMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSEINFESTATIONMAINTENANCE;
    public static readonly ICABSSESERVICEPLANCANCEL = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEPLANCANCEL;
    public static readonly ICABSSESERVICEAREASEQUENCEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEAREASEQUENCEMAINTENANCE;
    public static readonly ICABSSESERVICEVISITMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEVISITMAINTENANCE;
    public static readonly ICABSADIARYENTRY = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSADIARYENTRY;
    public static readonly ICABSCMNATAXJOBSERVICEDETAILGROUPMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMNATAXJOBSERVICEDETAILGROUPMAINTENANCE;
    public static readonly ICABSBAPIRATEMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSBAPIRATEMAINTENANCE;
    public static readonly ICABSCMNATAXJOBSERVICECOVERMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMNATAXJOBSERVICECOVERMAINTENANCE;
    public static readonly ICABSCMCUSTOMERCONTACTEMPLOYEEVIEW = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCUSTOMERCONTACTEMPLOYEEVIEW;
    public static readonly ICABSCMEMPLOYEEVIEWBRANCHDETAILS = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMEMPLOYEEVIEWBRANCHDETAILS;
    public static readonly ICABSCMPROSPECTMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMPROSPECTMAINTENANCE;
    public static readonly ICABSCMTELESALESENTRY = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMTELESALESENTRY;
    public static readonly ICABSSECREDITSERVICEVISITGROUPMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSECREDITSERVICEVISITGROUPMAINTENANCE;
    public static readonly ICABSCMCAMPAIGNENTRY = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCAMPAIGNENTRY;
    public static readonly ICABSCMCONTACTPERSONMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCONTACTPERSONMAINTENANCE;
    public static readonly ICABSCMCALLOUTMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCALLOUTMAINTENANCE;
    public static readonly ICABSCMSMSREDIRECT = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMSMSREDIRECT;
    public static readonly ICABSCMCUSTOMERCONTACTROOTCAUSEENTRY = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCUSTOMERCONTACTROOTCAUSEENTRY;
    public static readonly ICABSCMCUSTOMERCONTACTMAINTENANCECOPY = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMCUSTOMERCONTACTMAINTENANCECOPY;
    public static readonly ICABSSESERVICEPLANDELIVERYNOTEGENERATION = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEPLANDELIVERYNOTEGENERATION;
    public static readonly ICABSWORKLISTCONFIRMSUBMIT = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSWORKLISTCONFIRMSUBMIT;
    public static readonly ICABSSESERVICEPLANDESCMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSESERVICEPLANDESCMAINTENANCE;
    public static readonly ICABSSEPLANVISITMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSEPLANVISITMAINTENANCE;
    public static readonly ICABSSEPLANVISITMAINTENANCE2 = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSSEPLANVISITMAINTENANCE2;
    public static readonly ICABSCMWORKORDERMAINTENANCE = AppModuleRoutes.MAINTENANCE_SERVICE + InternalMaintenanceServiceModuleRoutesConstant.ICABSCMWORKORDERMAINTENANCE;
}

export class InternalSearchModuleRoutes {
    public static readonly ICABSBDLREJECTIONSEARCH = 'application/RejectionSearch';
    public static readonly ICABSACMNATAXJOBSERVICECOVERSEARCH = 'application/mnAtAxJobServiceCover';
    public static readonly ICABSSHISTORYTYPELANGUAGESEARCH = 'application/HistoryTypeLanguageSearch';
    public static readonly ICABSBCLOSEDTEMPLATESEARCH = 'application/closedtemplatesearch';
    public static readonly ICABSBPRODUCTSEARCH = 'application/productSearchGrid';
    public static readonly ICABSCMPROSPECTSEARCH = 'application/prospectsSearch';
    public static readonly ICABSBSEASONALTEMPLATESEARCH = 'application/seasonal/templatesearch';
    public static readonly ICABSASERVICESUMMARYDETAIL = 'application/serviceSummaryDetail';
    public static readonly ICABSSEPLANVISITSEARCH = 'application/planvisitsearch';
    public static readonly ICABSSESERVICEPLANSEARCH = 'application/serviceplansearch';
    public static readonly ICABSBPESTNETONLINELEVELSEARCH = 'application/pnollevelsearch';
    public static readonly ICABSBINFESTATIONLEVELSEARCH = 'application/infestationlevelsearch';
    public static readonly ICABSMARKTSELECTSEARCH = 'application/marktselectsearch';
    public static readonly ICABSALOSTBUSINESSREQUESTSEARCH = 'application/lostBusinessRequestSearch';
    public static readonly ICABSBRANCHSERVICEAREASEARCH = 'application/branchservicearea';
    public static readonly ICABSBPRODUCTDETAILSEARCH = 'application/productdetailsearch';
    public static readonly ICABSBWASTETRANSFERTYPESEARCH = 'application/wasteTransfertypesearch';
    public static readonly ICABSALOSTBUSINESSCONTACTSEARCH = 'application/lostBusinessContactSearch';
    public static readonly ICABSCMPROSPECTSTATUSSEARCH = 'application/prospectStatusSearch';
    public static readonly ICABSBLOSTBUSINESSDETAILSEARCH = 'application/lostbusinessdetailsearch';
    public static readonly ICABSBPREPARATIONSEARCH = 'application/preparationSearch';
    public static readonly ICABSSTAXCODESEARCH = 'application/taxcodeSearch';
    public static readonly ICABSCMCALLCENTREREVIEWGRIDMULTI = 'application/callcentrereviewgridmulti';
    public static readonly ICABSSLOSTBUSINESSCONTACTOUTCOMELANGUAGESEARCH = 'application/LostBusinessContactOutcomeLanguageSearch';
    public static readonly ICABSSCONTACTMEDIUMLANGUAGESEARCH = 'application/contactmediumsearch';
    public static readonly ICABSBPRODUCTCOVERSEARCH = 'application/productcoversearch';
    public static readonly ICABSBINVOICERUNDATESELECTPRINT2 = 'application/invoicerundateselect/print2';
    public static readonly ICABSSSYSTEMINVOICECREDITREASONSEARCH = 'application/invoice/creditreason';
    public static readonly ICABSBPRODUCTSALESGROUPSEARCH = 'application/productSalesGroupSearch';
    public static readonly ICABSSSYSTEMINVOICEFORMATLANGUAGESEARCH = 'application/invoice/invoiceformatlanguage';
    public static readonly ICABSSSICSEARCH = 'application/invoice/sicsearch';
    public static readonly ICABSBCUSTOMERCATEGORYSEARCH = 'application/customer/category';
    public static readonly ICABSAROUTINGSEARCH = 'application/routingsearch';
}

export class ITFunctionsModuleRoutes {
}

export class PeopleModuleRoutes {
    public static readonly ICABSAREMPLOYEEEXPORTGRIDBUSINESS = 'employeeExport/business';
    public static readonly ICABSAREMPLOYEEEXPORTGRIDREGION = 'employeeExport/region';
    public static readonly ICABSAREMPLOYEEEXPORTGRIDBRANCH = 'employeeExport/branch';
}

export class ProspectToContractModuleRoutes {
    public static readonly ICABSCMPROSPECTBULKIMPORT = 'application/CMProspectBulkImport';
    public static readonly ICABSCMPROSPECTENTRYGRID = 'contactmanagement/prospectEntryGrid';
    public static readonly ICABSBBUSINESSORIGINMAINTENANCE = 'prospect/business/businessOrigin';
    public static readonly ICABSCMPROSPECTMAINTENANCE = 'maintenance/prospectmaintenance';
    public static readonly ICABSCMDIARYMAINTENANCE = 'maintenance/diary';
    public static readonly ICABSCMDIARYDAYMAINTENANCE = 'maintenance/diarydaymaintaianance';
    public static readonly ICABSCMPROSPECTGRID = 'prospectgrid';
    public static readonly ICABSBLOSTBUSINESSDETAILGRID = 'lostbusinessdetailgrid';
    public static readonly ICABSCMPIPELINEPROSPECTMAINTENANCE = 'maintenance/prospect';
}

export class ServiceDeliveryModuleRoutes {
    public static readonly ICABSSESERVICEDOCKETDATAENTRY = 'service/visit/maintenance/docketentry';
    public static readonly ICABSSEPESVISITGRID = 'pdareturns/SePESVisitGrid';
    public static readonly ICABSWORKLISTCONFIRM = 'service/worklist';
    public static readonly ICABSAPRODUCTSALESDELIVERIESDUEGRID = 'reportsplanning/productsalesdeliverydue';
    public static readonly ICABSARPRENOTIFICATIONREPORT = 'reports/prenotificationreport';
    public static readonly ICABSARRETURNEDPAPERWORKGRID = 'lettersAndLabels/returnedPaperWorkGrid';
    public static readonly ICABSSERVICECALLTYPEGRIDBUSINESS = 'businessservicecalltype';
    public static readonly ICABSSERVICECALLTYPEGRIDREGION = 'regionservicecalltype';
    public static readonly ICABSSERVICECALLTYPEGRIDBRANCH = 'branchservicecalltype';
    public static readonly ICABSSERVICECALLTYPEGRIDSERVICEAREA = 'serviceareaservicecalltype';
    public static readonly ICABSARENVAGENCYBUSINESSWASTE = 'wasteconsignment/envagencybusinesswaste';
    public static readonly ICABSBVALIDLINKEDPRODUCTSGRID = 'products/valid/linked';
    public static readonly ICABSBPRODUCTLANGUAGEMAINTENANCE = 'maintenance/productlanguage';
    public static readonly ICABSARDAILYPRENOTIFICATIONREPORT = 'dailyprenotificationreport';
}

export class ServicePlanningModuleRoutes {
    public static readonly ICABSSESERVICEMOVEGRID = 'ServiceMoveGridSearch';
    public static readonly ICBSSACALENDERHISTORYGRID = 'application/calenderHistoryGrid';
    public static readonly ICABSCLOSEDTEMPLATEMAINTENANCE = 'application/closedtemplatemaintenance';
    public static readonly ICABSACLOSEDSERVICEGRID = 'Templates/HolidayClosedTemplateUse';
    public static readonly ICABSSESERVICEPLANNINGGRIDHG = 'serviceplanninggridhg';
    public static readonly ICABSACALENDARSERVICEGRID = 'Templates/CalendarTemplateUse';
    public static readonly ICABSASERVICECOVERCALENDARDATESMAINTENANCEGRID = 'calendarandSeasons/serviceCoverCalendarDateMaintenanceGrid';
}
