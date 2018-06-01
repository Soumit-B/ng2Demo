export const MAIN_NAV_DESIGN = `{
  "menu": [{
    "domainname": "Management",
    "id": "Management",
    "alwaysdisplay": false,
    "visibility": false,
    "feature": [{
      "featurename": "Customer Contact",
      "visibility": false,
      "module": [{
        "modulename": "General Search",
        "programURL": "/ContactManagement/iCABSCMGeneralSearchGrid.htm",
        "routeURL": "/contractmanagement/generalsearchgrid",
        "visibility": false
      }, {
        "modulename": "Contact Centre Search",
        "programURL": "/ContactManagement/iCABSCMCallCentreGrid.htm",
        "routeURL": "/ccm/callcentersearch/",
        "visibility": false
      }, {
        "modulename": "Contact Centre Review",
        "programURL": "/ContactManagement/iCABSCMCallCentreReviewGrid.htm",
        "routeURL": "/ccm/centreReview",
        "visibility": false
      }, {
        "modulename": "Contact Centre Assign",
        "programURL": "/ContactManagement/iCABSCMCallCentreAssignGrid.htm",
        "routeURL": "/ccm/customerContact/callCentreAssignGrid",
        "visibility": false
      }, {
        "modulename": "Account Review",
        "programURL": "/ContactManagement/iCABSCMAccountReviewGrid.htm",
        "routeURL": "grid/application/reportContacts/accountReviewGrid",
        "visibility": false
      }, {
        "modulename": "Call Analysis",
        "programURL": "/ContactManagement/iCABSCMCallAnalysisGrid.htm",
        "routeURL": "/ccm/contactmanagement/callAnalysisGrid",
        "visibility": false
      }, {
        "modulename": "Contact Medium",
        "programURL": "/ContactManagement/iCABSContactMediumGrid.htm",
        "routeURL": "/ccm/service/contactmedium",
        "visibility": false
      }]
    }, {
      "featurename": "Finance",
      "visibility": false,
      "module": [{
        "modulename": "Credit / Charge Read-Only",
        "programURL": "/Application/iCABSACreditApprovalGrid.htm",
        "routeURL": "/grid/application/creditApprovalGrid",
        "queryParams": {"readonly": "true"},
        "visibility": false
      }, {
        "modulename": "Credit / Charge Approval",
        "programURL": "/Application/iCABSACreditApprovalGrid.htm",
        "routeURL": "/grid/application/creditApprovalGrid",
        "visibility": false
      }, {
        "modulename": "Price / Cost Variance",
        "programURL": "/ApplicationReport/iCABSARVarianceFromPriceCostGrid.htm",
        "routeURL": "/billtocash/servicecover/pricecostvariance",
        "visibility": false
      }, {
        "modulename": "Renewal / Period",
        "programURL": "/Application/iCABSAContractRenewalMaintenance.htm",
        "routeURL": "application/contract/renewal",
        "visibility": false
      }]
    }, {
      "featurename": "Imports & Notifications",
      "visibility": false,
      "module": [{
        "modulename": "Bulk SMS Messages: Business",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/business",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Branch",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/branch",
        "visibility": false
      }]
    }, {
      "featurename": "Tools",
      "visibility": false,
      "module": [{
        "modulename": "Batch Process Monitor",
        "programURL": "/Model/riMBatchProcessMonitorSearch.htm",
        "routeURL": "/itfunctions/batchprocess/monitor",
        "visibility": false
      }, {
        "modulename": "Report Process Viewer",
        "programURL": "/Model/riMReportViewerSearch.htm",
        "routeURL": "",
        "visibility": false
      }]
    }]
  }, {
    "domainname": "Customer Service",
    "id": "Customer Service",
    "alwaysdisplay": false,
    "visibility": false,
    "feature": [{
      "featurename": "Customer Contact",
      "visibility": false,
      "module": [{
        "modulename": "General Search",
        "programURL": "/ContactManagement/iCABSCMGeneralSearchGrid.htm",
        "routeURL": "/contractmanagement/generalsearchgrid",
        "visibility": false
      }, {
        "modulename": "Contact Centre Search",
        "programURL": "/ContactManagement/iCABSCMCallCentreGrid.htm",
        "routeURL": "/ccm/callcentersearch/",
        "visibility": false
      }, {
        "modulename": "Contact Centre Review",
        "programURL": "/ContactManagement/iCABSCMCallCentreReviewGrid.htm",
        "routeURL": "/ccm/centreReview",
        "visibility": false
      }, {
        "modulename": "Contact Centre Assign",
        "programURL": "/ContactManagement/iCABSCMCallCentreAssignGrid.htm",
        "routeURL": "/ccm/customerContact/callCentreAssignGrid",
        "visibility": false
      }, {
        "modulename": "Work Order Review",
        "programURL": "/ContactManagement/iCABSCMWorkorderReviewGrid.htm",
        "routeURL": "/ccm/workOrderReviewGrid",
        "visibility": false
      }, {
        "modulename": "Contact Redirection",
        "programURL": "/ContactManagement/iCABSCMContactRedirection.htm",
        "routeURL": "ccm/contactmanagement/scmContactRedirection",
        "visibility": false
      }, {
        "modulename": "Callout Search",
        "programURL": "/ContactManagement/iCABSCMCustomerContactCalloutGrid.htm",
        "routeURL": "/ccm/customercontact/callout/grid",
        "visibility": false
      }, {
        "modulename": "Call Analysis",
        "programURL": "/ContactManagement/iCABSCMCallAnalysisGrid.htm",
        "routeURL": "/ccm/contactmanagement/callAnalysisGrid",
        "visibility": false
      }, {
        "modulename": "Contact Medium",
        "programURL": "/ContactManagement/iCABSContactMediumGrid.htm",
        "routeURL": "/ccm/service/contactmedium",
        "visibility": false
      }]
    }, {
      "featurename": "Telesales",
      "visibility": false,
      "module": [{
        "modulename": "Telesales Order Grid",
        "programURL": "/Application/iCABSATeleSalesOrderGrid.htm",
        "routeURL": "/ccm/customerContact/telesalesordergrid",
        "visibility": false
      }]
    }, {
      "featurename": "Imports & Notifications",
      "visibility": false,
      "module": [{
        "modulename": "CVC Ticket Import",
        "programURL": "/ContactManagement/iCABSCMCVCImport.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Business",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/business",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Branch",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/branch",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Account",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/account",
        "visibility": false
      }, {
        "modulename": "Email Messages",
        "programURL": "/Business/iCABSBEmailGrid.htm",
        "routeURL": "/ccm/business/email",
        "visibility": false
      }, {
        "modulename": "SMS Messages",
        "programURL": "/ContactManagement/iCABSCMSMSMessagesGrid.htm",
        "routeURL": "/ccm/service/smsmessages",
        "visibility": false
      }, {
        "modulename": "Notification Templates",
        "programURL": "/System/iCABSSNotificationTemplateMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Notification Groups",
        "programURL": "/System/iCABSSNotificationGroupMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Ticket Type",
        "programURL": "/System/iCABSSContactTypeMaintenance.htm",
        "routeURL": "/ccm/system/contact/contacttype",
        "visibility": false
      }, {
        "modulename": "Ticket Type Detail",
        "programURL": "/System/iCABSSContactTypeDetailMaintenance.htm",
        "routeURL": "/application/maintenance/contacttype/detail",
        "visibility": false
      }, {
        "modulename": "Ticket Type Detail - Translation",
        "programURL": "/System/iCABSSContactTypeDetailLangMaintenance.htm",
        "routeURL": "sales/contact/type/detial/langmaintenance",
        "visibility": false
      }]
    }, {
      "featurename": "Tools",
      "visibility": false,
      "module": [{
        "modulename": "Batch Process Monitor",
        "programURL": "/Model/riMBatchProcessMonitorSearch.htm",
        "routeURL": "/itfunctions/batchprocess/monitor",
        "visibility": false
      }, {
        "modulename": "Report Process Viewer",
        "programURL": "/Model/riMReportViewerSearch.htm",
        "routeURL": "",
        "visibility": false
      }]
    }]
  }, {
    "domainname": "Administration",
    "id": "Administration",
    "alwaysdisplay": false,
    "visibility": false,
    "feature": [{
      "featurename": "Customer Contact",
      "visibility": false,
      "module": [{
        "modulename": "General Search",
        "programURL": "/ContactManagement/iCABSCMGeneralSearchGrid.htm",
        "routeURL": "/contractmanagement/generalsearchgrid",
        "visibility": false
      }, {
        "modulename": "Contact Centre Search",
        "programURL": "/ContactManagement/iCABSCMCallCentreGrid.htm",
        "routeURL": "/ccm/callcentersearch/",
        "visibility": false
      }, {
        "modulename": "Contact Centre Review",
        "programURL": "/ContactManagement/iCABSCMCallCentreReviewGrid.htm",
        "routeURL": "/ccm/centreReview",
        "visibility": false
      }, {
        "modulename": "Contact Centre Assign",
        "programURL": "/ContactManagement/iCABSCMCallCentreAssignGrid.htm",
        "routeURL": "/ccm/customerContact/callCentreAssignGrid",
        "visibility": false
      }, {
        "modulename": "Work Order Review",
        "programURL": "/ContactManagement/iCABSCMWorkorderReviewGrid.htm",
        "routeURL": "/ccm/workOrderReviewGrid",
        "visibility": false
      }, {
        "modulename": "Contact Redirection",
        "programURL": "/ContactManagement/iCABSCMContactRedirection.htm",
        "routeURL": "/ccm/contactmanagement/scmContactRedirection",
        "visibility": false
      }, {
        "modulename": "Contact Medium",
        "programURL": "/ContactManagement/iCABSContactMediumGrid.htm",
        "routeURL": "/ccm/service/contactmedium",
        "visibility": false
      }]
    }, {
      "featurename": "Prospects",
      "visibility": false,
      "module": [{
        "modulename": "Prospect Maintenance",
        "programURL": "/ContactManagement/iCABSCMPipelineProspectMaintenance.htm",
        "routeURL": "/prospecttocontract/maintenance/prospect",
        "visibility": false
      }, {
        "modulename": "Prospect Grid",
        "programURL": "/ContactManagement/iCABSCMProspectGrid.htm",
        "routeURL": "/prospecttocontract/prospectgrid",
        "visibility": false
      }, {
        "modulename": "Prospect Bulk Import",
        "programURL": "/ContactManagement/iCABSCMProspectBulkImport.htm",
        "routeURL": "prospecttocontract/application/CMProspectBulkImport",
        "visibility": false
      }, {
        "modulename": "Pipeline Prospect Grid",
        "programURL": "/Sales/iCABSSPipelineGrid.htm",
        "routeURL": "/prospecttocontract/SalesOrderProcessing/PipelineGrid",
        "visibility": false
      }, {
        "modulename": "Sales Order Prospects",
        "programURL": "/Sales/iCABSSSOProspectGrid.htm",
        "routeURL": "/grid/service/prospectgrid",
        "visibility": false
      }, {
        "modulename": "Contract Approval",
        "programURL": "/Sales/iCABSSdlContractApprovalGrid.htm",
        "routeURL": "/grid/sales/contractapprovalgrid",
        "visibility": false
      }, {
        "modulename": "Diary",
        "programURL": "/ContactManagement/iCABSCMDiaryMaintenance.htm",
        "routeURL": "/prospecttocontract/maintenance/diary",
        "visibility": false
      }, {
        "modulename": "Diary Day",
        "programURL": "/ContactManagement/iCABSCMDiaryDayMaintenance.htm",
        "routeURL": "/prospecttocontract/maintenance/diarydaymaintaianance",
        "visibility": false
      }, {
        "modulename": "Key Account Job",
        "programURL": "/ContactManagement/iCABSCMProspectEntryMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Confirm Key Account Job",
        "programURL": "/ContactManagement/iCABSCMProspectEntryGrid.htm",
        "routeURL": "/prospecttocontract/contactmanagement/prospectEntryGrid",
        "visibility": false
      }]
    }, {
      "featurename": "Account & Invoice Group",
      "visibility": false,
      "module": [{
        "modulename": "Account Maintenance",
        "programURL": "/Application/iCABSAAccountMaintenance.htm",
        "routeURL": "/contractmanagement/accountmaintenance/account/maintenance",
        "visibility": false
      }, {
        "modulename": "Merge Account",
        "programURL": "/Application/iCABSAAccountMerge.htm",
        "routeURL": "/contractmanagement/accountadmin/account/merge/search",
        "visibility": false
      }, {
        "modulename": "Move Account",
        "programURL": "/Application/iCABSAAccountMove.htm",
        "routeURL": "/contractmanagement/accountadmin/account/move/search",
        "visibility": false
      }, {
        "modulename": "Assign Account",
        "programURL": "/Application/iCABSAAccountAssign.htm",
        "routeURL": "/contractmanagement/accountadmin/account/assign/search",
        "visibility": false
      }, {
        "modulename": "Account Bank Details",
        "programURL": "/Application/iCABSAAccountBankDetailsMaintenance.htm",
        "routeURL": "application/AccountBankDetailsMaintenance",
        "visibility": false
      }, {
        "modulename": "Account Address Change History",
        "programURL": "/Application/iCABSAAccountAddressChangeHistoryGrid.htm",
        "routeURL": "/grid/service/contractmanagement/account/addressChangeHistory",
        "visibility": false
      }, {
        "modulename": "Tax Registration Maintenance",
        "programURL": "/Application/iCABSATaxRegistrationChange.htm",
        "routeURL": "/billtocash/application/taxregistrationchange",
        "visibility": false
      }, {
        "modulename": "Account Owning Branch Maintenance",
        "programURL": "/Application/iCABSAAccountOwnerMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Group Account Maintenance",
        "programURL": "/System/iCABSSGroupAccountMaintenance.htm",
        "routeURL": "/contractmanagement/groupaccount/account/groupaccountmaintenance",
        "visibility": false
      }, {
        "modulename": "Group Account Move",
        "programURL": "/System/iCABSSGroupAccountMove.htm",
        "routeURL": "/contractmanagement/groupaccount/account/groupaccountmove",
        "visibility": false
      }, {
        "modulename": "Invoice Group Maintenance",
        "programURL": "/Application/iCABSAInvoiceGroupMaintenance.htm",
        "routeURL": "/billtocash/maintenance/invoicegroup/search",
        "visibility": false
      }, {
        "modulename": "Invoice Group / Premises",
        "programURL": "/Application/iCABSAInvoiceGroupPremiseMaintenance.htm",
        "routeURL": "sales/invoicepremisegroup/search",
        "visibility": false
      }, {
        "modulename": "Invoice Group Payment",
        "programURL": "/Application/iCABSAInvoiceGroupPaymentMaintenance.htm",
        "routeURL": "/application/grouppaymentmaintenance",
        "visibility": false
      }]
    }, {
      "featurename": "Contract",
      "visibility": false,
      "module": [{
        "modulename": "Contract Maintenance",
        "programURL": "/Application/iCABSAContractMaintenance.htm",
        "routeURL": "/contractmanagement/maintenance/contract",
        "visibility": false
      }, {
        "modulename": "Cancel Contract",
        "programURL": "/Application/iCABSAInactiveContractInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Terminate Contract",
        "programURL": "/Application/iCABSAContractSelectMaintenance.htm",
        "routeURL": "/contractmanagement/retention/maintenance/ContractSelectMaintenance",
        "visibility": false
      }, {
        "modulename": "Amend Contract Termination",
        "programURL": "/Application/iCABSAInactiveContractInfoMaintenance.htm",
        "routeURL": "/contractmanagement/retention/inactive/contractinfo",
        "queryParams": {"CurrentContractType": "C" },
        "visibility": false
      }, {
        "modulename": "Reinstate Contract",
        "programURL": "/Application/iCABSAInactiveContractInfoMaintenance.htm",
        "routeURL": "/contractmanagement/retention/inactive/contractinfo/reinstate",
        "queryParams": {"CurrentContractType": "C" },
        "visibility": false
      }, {
        "modulename": "Contract Approval",
        "programURL": "/Sales/iCABSSdlContractApprovalGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Suspend Contract Invoice",
        "programURL": "/Application/iCABSAContractSuspendMaintenance.htm",
        "routeURL": "sales/contract/suspend",
        "queryParams": {"currentContractType": "C"},
        "visibility": false
      }, {
        "modulename": "Renewal / Period",
        "programURL": "/Application/iCABSAContractRenewalMaintenance.htm",
        "routeURL": "application/contract/renewal",
        "visibility": false
      }, {
        "modulename": "Invoice Changes",
        "programURL": "/Application/iCABSAInvoiceDetailsMaintenance.htm",
        "routeURL": "/billtocash/maintenance/invoiceDetailsMaintainance",
        "visibility": false
      }, {
        "modulename": "Negotiating Branch",
        "programURL": "/Application/iCABSANegBranchMaintenance.htm",
        "routeURL": "/contractmanagement/contractadmin/negbranchmaintenance",
        "visibility": false
      }, {
        "modulename": "Customer Information",
        "programURL": "/Application/iCABSACustomerInfoMaintenance.htm",
        "routeURL": "sales/customerInfoMaintenance",
        "visibility": false
      }, {
        "modulename": "Mass Price Change",
        "programURL": "/Application/iCABSAMassPriceChangeGrid.htm",
        "routeURL": "/contractmanagement/servicecoveradmin/application/massPriceChangeGrid",
        "visibility": false
      }, {
        "modulename": "Percentage Price Change",
        "programURL": "/Application/iCABSAPercentagePriceChange.htm",
        "routeURL": "/contractmanagement/servicecoveradmin/percentagepricechange/perchanges/Contract",
        "visibility": false
      }, {
        "modulename": "Multi-Premises Special Instructions Change",
        "programURL": "/Application/iCABSAMultiPremiseSpecial.htm",
        "routeURL": "/contractmanagement/premisesadmin/application/multiPremisesSpecial",
        "visibility": false
      }, {
        "modulename": "Multi-Premises Purchase Order Number Change",
        "programURL": "/Application/iCABSAMultiPremisePurchaseOrderAmend.htm",
        "routeURL": "/contractmanagement/premisesadmin/contract/multipremise/purchaseorderamend",
        "visibility": false
      }, {
        "modulename": "Contract For Branch",
        "programURL": "/ApplicationReport/iCABSARBranchContractReport.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Price / Cost Variance",
        "programURL": "/ApplicationReport/iCABSARVarianceFromPriceCostGrid.htm",
        "routeURL": "/billtocash/servicecover/pricecostvariance",
        "visibility": false
      }]
    }, {
      "featurename": "Contract - Premises",
      "visibility": false,
      "module": [{
        "modulename": "Premises Maintenance",
        "programURL": "/Application/iCABSAPremiseMaintenance.htm",
        "routeURL": "/contractmanagement/premisesmaintenance/maintenance/premise",
        "queryParams": {"contractTypeCode": "C"},
        "visibility": false
      }, {
        "modulename": "Cancel Premises",
        "programURL": "/Application/iCABSAInactivePremiseInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Delete Premises",
        "programURL": "/Application/iCABSAPremiseSelectMaintenance.htm",
        "routeURL": "/contractmanagement/retention/deletePremise/premiseSelectMaintenance",
        "visibility": false
      }, {
        "modulename": "Amend Premises Deletion",
        "programURL": "/Application/iCABSAInactivePremiseInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Reinstate Premises",
        "programURL": "/Application/iCABSAInactivePremiseInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Suspend Premises Service",
        "programURL": "/Application/iCABSAPremiseServiceSuspendMaintenance.htm",
        "routeURL": "/contractmanagement/premisesmaintenance/servicesuspendmaintenance",
        "visibility": false
      }, {
        "modulename": "Suspend Premises Invoice",
        "programURL": "/Application/iCABSAPremiseSuspendMaintenance.htm",
        "routeURL": "application/premise/suspend/contract",
        "queryParams": {"currentContractType": "C"},
        "visibility": false
      }, {
        "modulename": "Key Account Upload",
        "programURL": "/Application/iCABSANatAccountsUpload.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Percentage Price Change - Premises",
        "programURL": "/Application/iCABSAPercentagePriceChange.htm",
        "routeURL": "/contractmanagement/servicecoveradmin/percentagepricechange/perchanges/Premise",
        "visibility": false
      }]
    }, {
      "featurename": "Contract - Service Cover",
      "visibility": false,
      "module": [{
        "modulename": "Service Cover Maintenance",
        "programURL": "/Application/iCABSAServiceCoverMaintenance.htm",
        "routeURL": "servicecovermaintenance/maintenance/servicecover/contract",
        "visibility": false
      }, {
        "modulename": "Cancel Service Cover",
        "programURL": "/Application/iCABSAInactiveServiceCoverInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Delete Service Cover",
        "programURL": "/Application/iCABSAServiceCoverSelectMaintenance.htm",
        "routeURL": "/contractmanagement/retention/clientRetention/serviceCoverSelectMaintenance",
        "visibility": false
      }, {
        "modulename": "Amend Service Cover Deletion",
        "programURL": "/Application/iCABSAInactiveServiceCoverInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Reinstate Service Cover",
        "programURL": "/Application/iCABSAInactiveServiceCoverInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Delete Service Detail",
        "programURL": "/Application/iCABSAServiceCoverDetailMaintenance.htm",
        "routeURL": "/application/ServiceCoverDetailMaintenance",
        "queryParams": {"Pending": "true"},
        "visibility": false
      }, {
        "modulename": "Reduce Service Cover",
        "programURL": "/Application/iCABSAServiceCoverMaintenance.htm",
        "routeURL": "servicecovermaintenance/maintenance/servicecover/reduce",
        "queryParams": {"PendingReduction": "true"},
        "visibility": false
      }, {
        "modulename": "Retained Service Cover Acceptance",
        "programURL": "/Application/iCABSAServiceCoverAcceptGrid.htm",
        "routeURL": "/billtocash/servicecover/acceptGrid",
        "visibility": false
      }, {
        "modulename": "Delivery Confirmation",
        "programURL": "/Application/iCABSAServiceCoverUnsuspendGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Suspend Product Service",
        "programURL": "/Application/iCABSAServiceCoverServiceSuspendMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Suspend Product Invoice",
        "programURL": "/Application/iCABSAServiceCoverSuspendMaintenance.htm",
        "routeURL": "/application/servicecover/suspend/contract",
        "queryParams": {"currentContractType": "C"},
        "visibility": false
      }, {
        "modulename": "Product Upgrade",
        "programURL": "/Application/iCABSAProductCodeUpgrade.htm",
        "routeURL": "/contractmanagement/servicecoveradmin/contractservicecover/productupgrade",
        "visibility": false
      }, {
        "modulename": "Trial Period",
        "programURL": "/Application/iCABSAServiceCoverTrialPeriodReleaseGrid.htm",
        "routeURL": "/contractmanagement/servicecoveradmin/servicecover/TialPeriodRelease",
        "visibility": false
      }, {
        "modulename": "Visit Anniversary Date Change",
        "programURL": "/Application/iCABSAContractAnniversaryChange.htm",
        "routeURL": "/contractmanagement/contractadmin/contractAnniversaryChange",
        "visibility": false
      }, {
        "modulename": "YTD Maintenance",
        "programURL": "/Application/iCABSAServiceCoverYTDMaintenance.htm",
        "routeURL": "/contractmanagement/servicecoveradmin/servicecover/YTDMaintenance",
        "visibility": false
      }, {
        "modulename": "Percentage Price Change - Product",
        "programURL": "/Application/iCABSAPercentagePriceChange.htm",
        "routeURL": "/contractmanagement/servicecoveradmin/percentagepricechange/perchanges/ServiceCover",
        "visibility": false
      }]
    }, {
      "featurename": "Job",
      "visibility": false,
      "module": [{
        "modulename": "Job Maintenance",
        "programURL": "/Application/iCABSAContractMaintenance.htm",
        "routeURL": "/contractmanagement/maintenance/job",
        "visibility": false
      }, {
        "modulename": "Cancel Job",
        "programURL": "/Application/iCABSAInactiveContractInfoMaintenance.htm",
        "routeURL": "/contractmanagement/retention/inactive/contractinfo/cancel",
        "queryParams": {"CurrentContractType": "J"},
        "visibility": false
      }, {
        "modulename": "Suspend Job Invoice",
        "programURL": "/Application/iCABSAContractSuspendMaintenance.htm",
        "routeURL": "sales/job/suspend",
        "queryParams": {"currentContractType": "J"},
        "visibility": false
      }, {
        "modulename": "Job Premises Maintenance",
        "programURL": "/Application/iCABSAPremiseMaintenance.htm",
        "routeURL": "/contractmanagement/premisesmaintenance/maintenance/premise",
        "queryParams": {"contractTypeCode": "J"},
        "visibility": false
      }, {
        "modulename": "Cancel Job Premises",
        "programURL": "/Application/iCABSAInactivePremiseInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Suspend Job Premises Invoice",
        "programURL": "/Application/iCABSAPremiseSuspendMaintenance.htm",
        "routeURL": "application/premise/suspend/job",
        "queryParams": {"currentContractType": "J"},
        "visibility": false
      }, {
        "modulename": "Job Service Cover Maintenance",
        "programURL": "/Application/iCABSAServiceCoverMaintenance.htm",
        "routeURL": "servicecovermaintenance/maintenance/servicecover/job",
        "queryParams": {"currentContractType": "J"},
        "visibility": false
      }, {
        "modulename": "Cancel Job Service Cover",
        "programURL": "/Application/iCABSAInactiveServiceCoverInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Suspend Job Product Invoice",
        "programURL": "/Application/iCABSAServiceCoverSuspendMaintenance.htm",
        "routeURL": "/application/servicecover/suspend/job",
        "queryParams": {"currentContractType": "J"},
        "visibility": false
      }, {
        "modulename": "Invoice On First / Last Visit",
        "programURL": "/Application/iCABSAServiceCoverInvoiceOnFirstVisitMaintenance.htm",
        "routeURL": "/contractmanagement/servicecoveradmin/maintenance/serviceCoverInvoiceMaintenceOnFirstVisit",
        "visibility": false
      }, {
        "modulename": "Visit Frequency",
        "programURL": "/Application/iCABSAServiceCoverFrequencyMaintenance.htm",
        "routeURL": "/contractmanagement/servicecoveradmin/maintenance/ServiceCoverFrequencyMaintenance",
        "visibility": false
      }]
    }, {
      "featurename": "Product Sale",
      "visibility": false,
      "module": [{
        "modulename": "Product Sale Maintenance",
        "programURL": "/Application/iCABSAContractMaintenance.htm",
        "routeURL": "/contractmanagement/maintenance/product",
        "visibility": false
      }, {
        "modulename": "Cancel Product Sale",
        "programURL": "/Application/iCABSAInactiveContractInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Product Sale Premises Maintenance",
        "programURL": "/Application/iCABSAPremiseMaintenance.htm",
        "routeURL": "/contractmanagement/premisesmaintenance/maintenance/premise",
        "queryParams": {"contractTypeCode": "P"},
        "visibility": false
      }, {
        "modulename": "Cancel Product Sale Premises",
        "programURL": "/Application/iCABSAInactivePremiseInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Product Sale Service Cover Maintenance",
        "programURL": "/Application/iCABSAProductSalesSCEntryGrid.htm",
        "routeURL": "grid/service/contractmanagement/maintenance/productSalesSCEntryGrid",
        "visibility": false
      }, {
        "modulename": "Cancel Product Sale Service Cover",
        "programURL": "/Application/iCABSAInactiveServiceCoverInfoMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Deliveries Due",
        "programURL": "/Application/iCABSAProductSalesDeliveriesDueGrid.htm",
        "routeURL": "/servicedelivery/reportsplanning/productsalesdeliverydue",
        "queryParams": {"currentContractType": "P"},
        "visibility": false
      }]
    }, {
      "featurename": "Sales Maintenance",
      "visibility": false,
      "module": [{
        "modulename": "New / Reneg Adjustment",
        "programURL": "/Sales/iCABSSSalesStatsAdjustmentGrid.htm",
        "routeURL": "/contractmanagement/reports/salesMaintenance/renegAdjustments",
        "visibility": false
      }, {
        "modulename": "Contract Service Values Adjustment",
        "programURL": "/Sales/iCABSSSalesStatisticsServiceValueGrid.htm",
        "routeURL": "/grid/sales/statistics/servicevalue/contract",
        "queryParams": {"currentContractType": "C"},
        "visibility": false
      }, {
        "modulename": "Job Service Values Adjustment",
        "programURL": "/Sales/iCABSSSalesStatisticsServiceValueGrid.htm",
        "routeURL": "/grid/sales/statistics/servicevalue/job",
        "queryParams": {"currentContractType": "J"},
        "visibility": false
      }, {
        "modulename": "Product Sale Service Values Adjustment",
        "programURL": "/Sales/iCABSSSalesStatisticsServiceValueGrid.htm",
        "routeURL": "/grid/sales/statistics/servicevalue/product",
        "queryParams": {"currentContractType": "P"},
        "visibility": false
      }, {
        "modulename": "Negotiating Employee Reassign",
        "programURL": "/Business/iCABSBContractSalesEmployeeReassignGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Portfolio Rezone",
        "programURL": "/Business/iCABSBSalesAreaPostcodeRezoneGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Postcode Rezone",
        "programURL": "/Business/iCABSBSalesAreaRezoneGrid.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Invoicing & API",
      "visibility": false,
      "module": [{
        "modulename": "Credit / Charge Summary Grid",
        "programURL": "/Application/iCABSAProRataChargeBranchGrid.htm",
        "routeURL": "/grid/sales/prorata/charge/branch",
        "visibility": false
      }, {
        "modulename": "Credit / Charge Approval",
        "programURL": "/Application/iCABSACreditApprovalGrid.htm",
        "routeURL": "/grid/application/creditApprovalGrid",
        "visibility": false
      }, {
        "modulename": "Credit / Charge Read-Only",
        "programURL": "/Application/iCABSACreditApprovalGrid.htm",
        "routeURL": "/grid/application/creditApprovalGrid",
        "queryParams": {"readonly": "true"},
        "visibility": false
      }, {
        "modulename": "Invoice Run Forecast: Forecast Generation",
        "programURL": "/ApplicationReport/iCABSARGenerateNextInvoiceRunForecast.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Invoice Run",
        "programURL": "/Business/iCABSBInvoiceRunDatesGrid.htm",
        "routeURL": "/billtocash/rundatesgrid",
        "visibility": false
      }, {
        "modulename": "Single Invoice Run",
        "programURL": "/Business/iCABSBInvoiceRunDatesGrid.htm",
        "routeURL": "/billtocash/rundatesgrid",
         "queryParams": {"single": "true"},
        "visibility": false
      }, {
        "modulename": "Preview API",
        "programURL": "/Application/iCABSAApplyAPIGrid.htm",
        "routeURL": "/billtocash/apigrid",
        "visibility": false
      }, {
        "modulename": "Apply API",
        "programURL": "/Application/iCABSAApplyAPIGeneration.htm",
        "routeURL": "/billtocash/apigeneration",
        "visibility": false
      }, {
        "modulename": "API Code / Rate",
        "programURL": "/Business/iCABSBAPICodeMaintenance.htm",
        "routeURL": "/billtocash/apicodemaintenance",
        "visibility": false
      }, {
        "modulename": "Exempt A Contract",
        "programURL": "/Application/iCABSAContractAPIMaintenance.htm",
        "routeURL": "/billtocash/contract/apiexempt",
        "visibility": false
      }, {
        "modulename": "API Date Change",
        "programURL": "/Application/iCABSAAPIDateMaintenance.htm",
        "routeURL": "/billtocash/apidate",
        "visibility": false
      }, {
        "modulename": "Service Cover API Update",
        "programURL": "/Application/iCABSAServiceCoverAPIGrid.htm",
        "routeURL": "/billtocash/serviceCoverApiGrid",
        "visibility": false
      }, {
        "modulename": "Reverse API Contract",
        "programURL": "/Application/iCABSAAPIReverse.htm",
        "routeURL": "/billtocash/contract/apireverse",
        "visibility": false
      }, {
        "modulename": "Reverse API Premises",
        "programURL": "/Application/iCABSAAPIReverse.htm",
        "routeURL": "/billtocash/premise/apireverse",
        "visibility": false
      }, {
        "modulename": "Reverse API Service Cover",
        "programURL": "/Application/iCABSAAPIReverse.htm",
        "routeURL": "/billtocash/servicecover/apireverse",
        "visibility": false
      }, {
        "modulename": "Release For Invoicing",
        "programURL": "/Application/iCABSReleaseForInvoiceGrid.htm",
        "routeURL": "/billtocash/application/releaseforinvoiceGrid",
        "visibility": false
      }, {
        "modulename": "Retained Service Cover Acceptance",
        "programURL": "/Application/iCABSAServiceCoverAcceptGrid.htm",
        "routeURL": "/billtocash/servicecover/acceptGrid",
        "visibility": false
      }, {
        "modulename": "Invoice Changes",
        "programURL": "/Application/iCABSAInvoiceDetailsMaintenance.htm",
        "routeURL": "/billtocash/maintenance/invoiceDetailsMaintainance",
        "visibility": false
      }, {
        "modulename": "Credit & Re-invoice",
        "programURL": "/Application/iCABSACreditAndReInvoiceMaintenance.htm",
        "routeURL": "/billtocash/postInvoiceManagement/creditAndReInvoiceMaintenance",
        "visibility": false
      }, {
        "modulename": "Invoice Text Maintenance",
        "programURL": "/Application/iCABSAInvoicePrintMaintenance.htm",
        "routeURL": "application/invoice/print/maintenance",
        "visibility": false
      }, {
        "modulename": "History",
        "programURL": "/Application/iCABSAInvoiceHeaderGrid.htm",
        "routeURL": "grid/application/invoiceheadergridcomponent",
        "visibility": false
      }, {
        "modulename": "Invoices By Account",
        "programURL": "/Application/iCABSAInvoiceByAccountGrid.htm",
        "routeURL": "grid/application/invoice/account",
        "visibility": false
      }]
    }, {
      "featurename": "Letters & Labels",
      "visibility": false,
      "module": [{
        "modulename": "Renewal Letter Generation",
        "programURL": "/ApplicationReport/iCABSRenewalGenerate.htm",
        "routeURL": "sales/renewalLetterGenerate",
        "visibility": false
      }, {
        "modulename": "Renewal Letter Print",
        "programURL": "/Sales/iCABSRenewalExtractGeneration.htm",
        "routeURL": "contractmanagement/reports/sales/renewalextractgeneration",
        "visibility": false
      }, {
        "modulename": "Anniversary Letter Generation",
        "programURL": "/ApplicationReport/iCABSAnniversaryGenerate.htm",
        "routeURL": "grid/service/AnniversaryGenerate",
        "visibility": false
      }, {
        "modulename": "Customer Quarterly Returns",
        "programURL": "/ApplicationReport/iCABSARCustomerQuarterlyReturnsPrint.htm",
        "routeURL": "",
        "visibility": false
      },
      {
        "modulename": "Non-Returned Paperwork Audit",
        "programURL": "/ApplicationReport/iCABSARReturnedPaperWorkGrid.htm",
        "routeURL": "/servicedelivery/lettersAndLabels/returnedPaperWorkGrid",
        "visibility": false
      }]
    }, {
      "featurename": "Imports & Notifications",
      "visibility": false,
      "module": [{
        "modulename": "CVC Ticket Import",
        "programURL": "/ContactManagement/iCABSCMCVCImport.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Business",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/business",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Branch",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/branch",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Account",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/account",
        "visibility": false
      }, {
        "modulename": "Email Messages",
        "programURL": "/Business/iCABSBEmailGrid.htm",
        "routeURL": "/ccm/business/email",
        "visibility": false
      }, {
        "modulename": "SMS Messages",
        "programURL": "/ContactManagement/iCABSCMSMSMessagesGrid.htm",
        "routeURL": "/ccm/service/smsmessages",
        "visibility": false
      }, {
        "modulename": "Notification Templates",
        "programURL": "/System/iCABSSNotificationTemplateMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Notification Groups",
        "programURL": "/System/iCABSSNotificationGroupMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Ticket Type",
        "programURL": "/System/iCABSSContactTypeMaintenance.htm",
        "routeURL": "/ccm/system/contact/contacttype",
        "visibility": false
      }, {
        "modulename": "Ticket Type Detail",
        "programURL": "/System/iCABSSContactTypeDetailMaintenance.htm",
        "routeURL": "/application/maintenance/contacttype/detail",
        "visibility": false
      }, {
        "modulename": "Ticket Type Detail - Translation",
        "programURL": "/System/iCABSSContactTypeDetailLangMaintenance.htm",
        "routeURL": "sales/contact/type/detial/langmaintenance",
        "visibility": false
      }]
    }, {
      "featurename": "Waste",
      "visibility": false,
      "module": [{
        "modulename": "Daily Prenotification Report",
        "programURL": "/ApplicationReport/iCABSARDailyPrenotificationReport.htm",
        "routeURL": "/servicedelivery/dailyprenotificationreport",
        "visibility": false
      }, {
        "modulename": "Environment Agency Business Waste Generation Report",
        "programURL": "/ApplicationReport/iCABSAREnvAgencyBusinessWaste.htm",
        "routeURL": "/servicedelivery/wasteconsignment/envagencybusinesswaste",
        "visibility": false
      }, {
        "modulename": "Environment Agency Exceptions",
        "programURL": "/ApplicationReport/iCABSAREnvAgencyExceptions.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Environment Agency Quarterly Returns",
        "programURL": "/ApplicationReport/iCABSAREnvAgencyQuarterlyReturn.htm",
        "routeURL": "/grid/sales/envagencyquarterlyreturn",
        "visibility": false
      }, {
        "modulename": "Annual Prenotification Report",
        "programURL": "/ApplicationReport/iCABSARPrenotificationReport.htm",
        "routeURL": "/servicedelivery/reports/prenotificationreport",
        "visibility": false
      }, {
        "modulename": "Waste Transfer Notes",
        "programURL": "/ApplicationReport/iCABSARWasteTransferNotesPrint.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Calendars",
      "visibility": false,
      "module": [{
        "modulename": "Apply Annual Calendar",
        "programURL": "/Application/iCABSAServiceCoverCalendarDatesMaintenance.htm",
        "routeURL": "sales/ServiceCoverCalendarDatesMaintenance",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Summary",
        "programURL": "/Application/iCABSAServiceCoverCalendarDatesMaintenanceGrid.htm",
        "routeURL": "/serviceplanning/calendarandSeasons/serviceCoverCalendarDateMaintenanceGrid",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Template",
        "programURL": "/Application/iCABSACalendarTemplateMaintenance.htm",
        "routeURL": "/application/calendarTemplateMaintenance",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Template Access",
        "programURL": "/Application/iCABSACalendarTemplateBranchAccessGrid.htm",
        "routeURL": "/grid/application/calendarTemplateBranchAccessGrid",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Template Use",
        "programURL": "/Application/iCABSACalendarServiceGrid.htm",
        "routeURL": "/serviceplanning/Templates/CalendarTemplateUse",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Template Change History",
        "programURL": "/Application/iCABSACalendarHistoryGrid.htm",
        "routeURL": "/serviceplanning/application/calenderHistoryGrid",
        "visibility": false
      }, {
        "modulename": "Closed Calendar Template",
        "programURL": "/Application/iCABSAClosedTemplateMaintenance.htm",
        "routeURL": "/serviceplanning/application/closedtemplatemaintenance",
        "visibility": false
      }, {
        "modulename": "Closed Calendar Template Access",
        "programURL": "/Application/iCABSAClosedTemplateBranchAccessGrid.htm",
        "routeURL": "/grid/service/ClosedTemplateBranchAccessGrid",
        "visibility": false
      }, {
        "modulename": "Closed Calendar Template Use",
        "programURL": "/Application/iCABSAClosedServiceGrid.htm",
        "routeURL": "/serviceplanning/Templates/HolidayClosedTemplateUse",
        "visibility": false
      }, {
        "modulename": "Closed Calendar Template Change History",
        "programURL": "/Application/iCABSAClosedHistoryGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Apply Seasonal Service",
        "programURL": "/Application/iCABSAServiceCoverSeasonalDatesMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Seasonal Template",
        "programURL": "/Application/iCABSASeasonalTemplateMaintenance.htm",
        "routeURL": "application/seasonal/templatemaintenance",
        "visibility": false
      }, {
        "modulename": "Seasonal Template Details",
        "programURL": "/Application/iCABSASeasonalTemplateDetailGrid.htm",
        "routeURL": "/grid/service/seasonaltemplatedetailgrid",
        "visibility": false
      }]
    }, {
      "featurename": "Users & Employees",
      "visibility": false,
      "module": [{
        "modulename": "User",
        "programURL": "/Model/riMUserInformationMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "User Authority",
        "programURL": "/Business/iCABSBUserAuthorityMaintenance.htm",
        "routeURL": "/people/business/authoritymaintainance",
        "visibility": false
      }, {
        "modulename": "User Type",
        "programURL": "/Model/riMUserTypeMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "User Type Menu Access",
        "programURL": "/Model/riMUserTypeMenuAccessMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Employee",
        "programURL": "/Business/iCABSBEmployeeMaintenance.htm",
        "routeURL": "/people/business/employeemaintenance",
        "visibility": false
      }, {
        "modulename": "Employee Number Change",
        "programURL": "/Application/iCABSAChangeEmployeeNumber.htm",
        "routeURL": "/people/tablemaintenance/changeemployeenumber",
        "visibility": false
      }, {
        "modulename": "Employee Address Labels",
        "programURL": "/ApplicationReport/iCABSARAddressLabelPrint.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Business & Branch",
      "visibility": false,
      "module": [{
        "modulename": "Business",
        "programURL": "/System/iCABSSBusinessMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Business Registry",
        "programURL": "/Business/iCABSBBusinessRegistryGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Company",
        "programURL": "/Business/iCABSBCompanyMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Branch",
        "programURL": "/Business/iCABSBBranchMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Postcode",
        "programURL": "/Business/iCABSBPostcodeMaintenance.htm",
        "routeURL": "/contractmanagement/areas/branch/postalcode/maintenance",
        "visibility": false
      }, {
        "modulename": "Sales Area",
        "programURL": "/Business/iCABSBSalesAreaGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Service Area",
        "programURL": "/Business/iCABSBBranchServiceAreaGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Branch Holidays",
        "programURL": "/Business/iCABSBBranchHolidayGrid.htm",
        "routeURL": "/grid/service/business/branchholiday",
        "visibility": false
      }, {
        "modulename": "Invoice Ranges",
        "programURL": "/Business/iCABSBInvoiceRangeUpdateGrid.htm",
        "routeURL": "grid/sales/invoice/range/update/grid",
        "visibility": false
      }]
    }, {
      "featurename": "Product & Service Setup",
      "visibility": false,
      "module": [{
        "modulename": "Product Full Access",
        "programURL": "/Business/iCABSBProductMaintenance.htm",
        "routeURL": "application/product/maintenance",
        "visibility": false
      }, {
        "modulename": "Product Language",
        "programURL": "/Business/iCABSBProductLanguageMaintenance.htm",
        "routeURL": "/servicedelivery/maintenance/productlanguage",
        "visibility": false
      }, {
        "modulename": "Product Service Group",
        "programURL": "/Business/iCABSBProductServiceGroupMaintenance.htm",
        "routeURL": "application/maintenance/productservice/group",
        "visibility": false
      }, {
        "modulename": "Expense Code",
        "programURL": "/Business/iCABSBExpenseCodeMaintenance.htm",
        "routeURL": "sales/expensecode",
        "visibility": false
      }, {
        "modulename": "Product Expense Code",
        "programURL": "/Business/iCABSBProductExpenseMaintenance.htm",
        "routeURL": "contractmanagement/productadmin/product/expense/maintenance",
        "visibility": false
      }, {
        "modulename": "Product Detail",
        "programURL": "/Business/iCABSBProductDetailMaintenance.htm",
        "routeURL": "application/maintenance/product/detail",
        "visibility": false
      }, {
        "modulename": "Product Cover",
        "programURL": "/Business/iCABSBProductCoverMaintenance.htm",
        "routeURL": "/contractmanagement/productadmin/business/service/productcover",
        "visibility": false
      }, {
        "modulename": "Valid Linked Products",
        "programURL": "/Business/iCABSBValidLinkedProductsGrid.htm",
        "routeURL": "/servicedelivery/products/valid/linked",
        "visibility": false
      }, {
        "modulename": "Prep",
        "programURL": "/Business/iCABSBPreparationMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Prep Charge Rate",
        "programURL": "/Business/iCABSBPrepChargeRateMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Infestation Level",
        "programURL": "/Business/iCABSBInfestationLevelMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Detector",
        "programURL": "/Business/iCABSBDetectorMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "myRentokil Level",
        "programURL": "/Business/iCABSBPestNetOnLineLevelMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Visit Action",
        "programURL": "/Business/iCABSBVisitActionMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Visit Type",
        "programURL": "/Business/iCABSBVisitTypeMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Waste Consignment Note Range",
        "programURL": "/Business/iCABSBWasteConsignmentNoteRangeGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Waste Consignment Note Range Type",
        "programURL": "/Business/iCABSBWasteConsignmentNoteRangeTypeMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "RMM Category",
        "programURL": "/Business/iCABSBRMMCategoryMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Sales Setup",
      "visibility": false,
      "module": [{
        "modulename": "Business Origin",
        "programURL": "/Business/iCABSBBusinessOriginMaintenance.htm",
        "routeURL": "/prospecttocontract/prospect/business/businessOrigin",
        "visibility": false
      }, {
        "modulename": "Customer Type",
        "programURL": "/System/iCABSSCustomerTypeMaintenance.htm",
        "routeURL": "/application/maintenance/customertype",
        "visibility": false
      }, {
        "modulename": "Lost Business Detail",
        "programURL": "/Business/iCABSBLostBusinessDetailGrid.htm",
        "routeURL": "sales/lostbusinessmaintenance",
        "routeURL": "/prospecttocontract/lostbusinessdetailgrid",
        "visibility": false
      }]
    }, {
      "featurename": "Tools",
      "visibility": true,
      "module": [{
        "modulename": "Batch Process Monitor",
        "programURL": "/Model/riMBatchProcessMonitorSearch.htm",
        "routeURL": "/itfunctions/batchprocess/monitor",
        "visibility": false
      }, {
        "modulename": "Report Process Viewer",
        "programURL": "/Model/riMReportViewerSearch.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Program Schedule",
        "programURL": "/Model/riMBatchProgramScheduleMaintenance.htm",
        "routeURL": "sales/batchProgramSchedule",
        "visibility": false
      }, {
        "modulename": "Program Maintenance",
        "programURL": "/Model/riMGBatchProgramMaintenance.htm",
        "routeURL": "/itfunctions/batchprogram/maintenance",
        "visibility": false
      }, {
        "modulename": "User Search",
        "programURL": "/Model/riMUserSearch.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "User Credit Approval Level",
        "programURL": "/Model/riMUserApprovalLevelMaintenance.htm",
        "routeURL": "/billtocash/creditapproval",
        "visibility": false
      }, {
        "modulename": "Employee Export: Business",
        "programURL": "/ApplicationReport/iCABSAREmployeeExportGrid.htm",
        "routeURL": "/people/employeeExport/business",
        "queryParams": {"Business": "exportType"},
        "visibility": false
      }, {
        "modulename": "Employee Export: Region",
        "programURL": "/ApplicationReport/iCABSAREmployeeExportGrid.htm",
        "routeURL": "/people/employeeExport/region",
        "queryParams": {"Region": "exportType"},
        "visibility": false
      }, {
        "modulename": "Employee Export: Branch",
        "programURL": "/ApplicationReport/iCABSAREmployeeExportGrid.htm",
        "routeURL": "/people/employeeExport/branch",
        "queryParams": {"Branch": "exportType"},
        "visibility": false
      }, {
        "modulename": "Move Branch By Postcode",
        "programURL": "/Application/iCABSAPostcodeMoveBranch.htm",
        "routeURL": "/contractmanagement/premisesadmin/premise/postcodemovebranch",
        "visibility": false
      }, {
        "modulename": "Clear Down Plan Visits",
        "programURL": "/Service/iCABSSeClearDownPlanVisits.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Translations",
        "programURL": "/Model/riMGTranslationMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "System / Business Visit Type",
        "programURL": "/Business/iCABSBSystemBusinessVisitTypeMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Business System Characteristics",
        "programURL": "/System/iCABSSBusinessSystemCharacteristicsCustomMaintenance.htm",
        "routeURL": "/itfunctions/batchprocess/syscharmonitor",
        "visibility": false
      }, {
        "modulename": "System Parameters Maintenance",
        "programURL": "/System/iCABSSSystemParameterMaintenance.htm",
        "routeURL": "/itfunctions/maintenance/maintainParameters/system",
        "visibility": false
      }]
    }, {
      "featurename": "Registry Setup A",
      "visibility": false,
      "module": [{
          "modulename": "Advantage",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Advantage",
          "visibility": false
        },
        {
          "modulename": "Archiving",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Archiving",
          "visibility": false
        },
        {
          "modulename": "CCM Disputed Invoices",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/CCM Disputed Invoices",
          "visibility": false
        },
        {
          "modulename": "CCM Escalation",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/CCM Escalation",
          "visibility": false
        },
        {
          "modulename": "CCM Ticket Analysis",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/CCM Ticket Analysis",
          "visibility": false
        },
        {
          "modulename": "ClearDown",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/ClearDown",
          "visibility": false
        },
        {
          "modulename": "Contact Centre Assign",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Contact Centre Assign",
          "visibility": false
        },
        {
          "modulename": "Contact Centre Jobs",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Contact Centre Jobs",
          "visibility": false
        },
        {
          "modulename": "Contact Centre Review",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Contact Centre Review",
          "visibility": false
        },
        {
          "modulename": "Contact Centre Search",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Contact Centre Search",
          "visibility": false
        },
        {
          "modulename": "Contact Person",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Contact Person",
          "visibility": false
        },
        {
          "modulename": "CSV Export Codepage",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/CSV Export Codepage",
          "visibility": false
        },
        {
          "modulename": "Daily Transactions",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Daily Transactions",
          "visibility": false
        },
        {
          "modulename": "Dashboards",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Dashboards",
          "visibility": false
        },
        {
          "modulename": "EDIInvoicesAsPDFs",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/EDIInvoicesAsPDFs",
          "visibility": false
        },
        {
          "modulename": "Electronic Invoice Delivery",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Electrontic Invoice Delivery",
          "visibility": false
        },
        {
          "modulename": "Email Reports",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Email Reports",
          "visibility": false
        },
        {
          "modulename": "FOLE Extract",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/FOLE Extract",
          "visibility": false
        },
        {
          "modulename": "Freeway EDI",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Freeway EDI",
          "visibility": false
        },
        {
          "modulename": "General",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/General",
          "visibility": false
        }]
    }, {
      "featurename": "Registry Setup B",
      "visibility": false,
      "module": [{
          "modulename": "GoogleCalendar",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/GoogleCalendar",
          "visibility": false
        },
        {
          "modulename": "Invoice Feeder File Transfer",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Invoice Feeder File Transfer",
          "visibility": false
        },
        {
          "modulename": "Invoice PDF Transfer",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Invoice PDF Transfer",
          "visibility": false
        },
        {
          "modulename": "Luminos",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Luminos",
          "visibility": false
        },
        {
          "modulename": "MarktSelect",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/MarktSelect",
          "visibility": false
        },
        {
          "modulename": "MyMedical Feeder",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/MyMedical Feeder",
          "visibility": false
        },
        {
          "modulename": "MyRentokil Feeders",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/MyRentokil Feeders",
          "visibility": false
        },
        {
          "modulename": "MyWashrooms Feeder",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/MyWashrooms Feeder",
          "visibility": false
        },
        {
          "modulename": "Ortec",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Ortec",
          "visibility": false
        },
        {
          "modulename": "PestNet Online Report",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/PestNet Online Report",
          "visibility": false
        },
        {
          "modulename": "PestNetOnline Web Services",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/PestNetOnline Web Services",
          "visibility": false
        },
        {
          "modulename": "Prospect Defaults",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Prospect Defaults",
          "visibility": false
        },
        {
          "modulename": "Qualification User Types",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Qualification User Types",
          "visibility": false
        },
        {
          "modulename": "Reports",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Reports",
          "visibility": false
        },
        {
          "modulename": "Sales Order Processing",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Sales Order Processing",
          "visibility": false
        },
        {
          "modulename": "Scheduling",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Scheduling",
          "visibility": false
        },
        {
          "modulename": "SMS Messaging",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/SMS Messaging",
          "visibility": false
        },
        {
          "modulename": "SystemDirectories",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/SystemDirectories",
          "visibility": false
        },
        {
          "modulename": "Vehicle Parameters",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Vehicle Parameters",
          "visibility": false
        },
        {
          "modulename": "Vertex",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Vertex",
          "visibility": false
        },
        {
          "modulename": "Waste Consignment Note",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Waste Consignment Note",
          "visibility": false
        }]
    }, {
      "featurename": "Registry Setup C",
      "visibility": false,
      "module": [{
          "modulename": "WEB-SESSIONS",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/WEB-SESSIONS",
          "visibility": false
        },
        {
          "modulename": "WOReview",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/WOReview",
          "visibility": false
        },
        {
          "modulename": "Work Order Review",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/Work Order Review",
          "visibility": false
        },
        {
          "modulename": "XContact Person",
          "programURL": "/Model/riRegistry.htm",
          "routeURL": "/itfunctions/registry/XContact Person",
          "visibility": false
        }
      ]
    }]
  }, {
    "domainname": "Finance",
    "id": "Finance",
    "alwaysdisplay": false,
    "visibility": false,
    "feature": [{
      "featurename": "Customer Contact",
      "visibility": false,
      "module": [{
        "modulename": "General Search",
        "programURL": "/ContactManagement/iCABSCMGeneralSearchGrid.htm",
        "routeURL": "/contractmanagement/generalsearchgrid",
        "visibility": false
      }, {
        "modulename": "Contact Centre Search",
        "programURL": "/ContactManagement/iCABSCMCallCentreGrid.htm",
        "routeURL": "/ccm/callcentersearch/",
        "visibility": false
      }, {
        "modulename": "Contact Centre Review",
        "programURL": "/ContactManagement/iCABSCMCallCentreReviewGrid.htm",
        "routeURL": "/ccm/centreReview",
        "visibility": false
      }]
    }, {
      "featurename": "Account",
      "visibility": false,
      "module": [{
        "modulename": "Account Maintenance",
        "programURL": "/Application/iCABSAAccountMaintenance.htm",
        "routeURL": "/contractmanagement/accountmaintenance/account/maintenance",
        "visibility": false
      }, {
        "modulename": "Merge Account",
        "programURL": "/Application/iCABSAAccountMerge.htm",
        "routeURL": "/contractmanagement/accountadmin/account/merge/search",
        "visibility": false
      }, {
        "modulename": "Move Account",
        "programURL": "/Application/iCABSAAccountMove.htm",
        "routeURL": "/contractmanagement/accountadmin/account/move/search",
        "visibility": false
      }, {
        "modulename": "Assign Account",
        "programURL": "/Application/iCABSAAccountAssign.htm",
        "routeURL": "/contractmanagement/accountadmin/account/assign/search",
        "visibility": false
      }, {
        "modulename": "Account Bank Details",
        "programURL": "/Application/iCABSAAccountBankDetailsMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Account Address Change History",
        "programURL": "/Application/iCABSAAccountAddressChangeHistoryGrid.htm",
        "routeURL": "/grid/service/contractmanagement/account/addressChangeHistory",
        "visibility": false
      }, {
        "modulename": "Tax Registration Maintenance",
        "programURL": "/Application/iCABSATaxRegistrationChange.htm",
        "routeURL": "/billtocash/application/taxregistrationchange",
        "visibility": false
      }, {
        "modulename": "Account Owning Branch Maintenance",
        "programURL": "/Application/iCABSAAccountOwnerMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Group Account Maintenance",
        "programURL": "/System/iCABSSGroupAccountMaintenance.htm",
        "routeURL": "/contractmanagement/groupaccount/account/groupaccountmaintenance",
        "visibility": false
      }, {
        "modulename": "Group Account Move",
        "programURL": "/System/iCABSSGroupAccountMove.htm",
        "routeURL": "/contractmanagement/groupaccount/account/groupaccountmove",
        "visibility": false
      }]
    }, {
      "featurename": "Invoice Group",
      "visibility": false,
      "module": [{
        "modulename": "Invoice Group Maintenance",
        "programURL": "/Application/iCABSAInvoiceGroupMaintenance.htm",
        "routeURL": "/billtocash/maintenance/invoicegroup/search",
        "visibility": false
      }, {
        "modulename": "Invoice Group / Premises",
        "programURL": "/Application/iCABSAInvoiceGroupPremiseMaintenance.htm",
        "routeURL": "sales/invoicepremisegroup/search",
        "visibility": false
      }, {
        "modulename": "Invoice Group Payment",
        "programURL": "/Application/iCABSAInvoiceGroupPaymentMaintenance.htm",
        "routeURL": "/application/grouppaymentmaintenance",
        "visibility": false
      }]
    }, {
      "featurename": "Contract & Job",
      "visibility": false,
      "module": [{
        "modulename": "Suspend Contract Invoice",
        "programURL": "/Application/iCABSAContractSuspendMaintenance.htm",
        "routeURL": "sales/contract/suspend",
        "queryParams": {"currentContractType": "C"},
        "visibility": false
      }, {
        "modulename": "Suspend Premises Invoice",
        "programURL": "/Application/iCABSAPremiseSuspendMaintenance.htm",
        "routeURL": "application/premise/suspend/contract",
        "queryParams": {"currentContractType": "C"},
        "visibility": false
      }, {
        "modulename": "Suspend Product Invoice",
        "programURL": "/Application/iCABSAServiceCoverSuspendMaintenance.htm",
        "routeURL": "/application/servicecover/suspend/contract",
        "queryParams": {"currentContractType": "C"},
        "visibility": false
      }, {
        "modulename": "Suspend Job Invoice",
        "programURL": "/Application/iCABSAContractSuspendMaintenance.htm",
        "routeURL": "sales/job/suspend",
        "queryParams": {"currentContractType": "J"},
        "visibility": false
      }, {
        "modulename": "Suspend Job Premises Invoice",
        "programURL": "/Application/iCABSAPremiseSuspendMaintenance.htm",
        "routeURL": "application/premise/suspend/job",
        "queryParams": {"currentContractType": "J"},
        "visibility": false
      }, {
        "modulename": "Suspend Job Product Invoice",
        "programURL": "/Application/iCABSAServiceCoverSuspendMaintenance.htm",
        "routeURL": "/application/servicecover/suspend/job",
        "queryParams": {"currentContractType": "J"},
        "visibility": false
      }, {
        "modulename": "Renewal / Period",
        "programURL": "/Application/iCABSAContractRenewalMaintenance.htm",
        "routeURL": "application/contract/renewal",
        "visibility": false
      }, {
        "modulename": "Price / Cost Variance",
        "programURL": "/ApplicationReport/iCABSARVarianceFromPriceCostGrid.htm",
        "routeURL": "/billtocash/servicecover/pricecostvariance",
        "visibility": false
      }]
    }, {
      "featurename": "Invoicing",
      "visibility": false,
      "module": [{
        "modulename": "Credit / Charge Summary Grid",
        "programURL": "/Application/iCABSAProRataChargeBranchGrid.htm",
        "routeURL": "/grid/sales/prorata/charge/branch",
        "visibility": false
      }, {
        "modulename": "Credit / Charge Approval",
        "programURL": "/Application/iCABSACreditApprovalGrid.htm",
        "routeURL": "/grid/application/creditApprovalGrid",
        "visibility": false
      }, {
        "modulename": "Invoice Run Forecast: Forecast Generation",
        "programURL": "/ApplicationReport/iCABSARGenerateNextInvoiceRunForecast.htm",
        "routeURL": "/billtocash/application/invoiceRunForecastComponent",
        "visibility": false
      }, {
        "modulename": "Invoice Run",
        "programURL": "/Business/iCABSBInvoiceRunDatesGrid.htm",
       "routeURL": "/billtocash/rundatesgrid",
        "visibility": false
      }, {
        "modulename": "Single Invoice Run",
        "programURL": "/Business/iCABSBInvoiceRunDatesGrid.htm",
        "routeURL": "/billtocash/rundatesgrid",
        "queryParams": {"single": "true"},
        "visibility": false
      }, {
        "modulename": "Release For Invoicing",
        "programURL": "/Application/iCABSReleaseForInvoiceGrid.htm",
        "routeURL": "/billtocash/application/releaseforinvoiceGrid",
        "visibility": false
      }, {
        "modulename": "Retained Service Cover Acceptance",
        "programURL": "/Application/iCABSAServiceCoverAcceptGrid.htm",
        "routeURL": "/billtocash/servicecover/acceptGrid",
        "visibility": false
      }, {
        "modulename": "Delivery Confirmation",
        "programURL": "/Application/iCABSAServiceCoverUnsuspendGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Invoice Changes",
        "programURL": "/Application/iCABSAInvoiceDetailsMaintenance.htm",
        "routeURL": "/billtocash/maintenance/invoiceDetailsMaintainance",
        "visibility": false
      }, {
        "modulename": "Credit & Re-invoice",
        "programURL": "/Application/iCABSACreditAndReInvoiceMaintenance.htm",
        "routeURL": "/billtocash/postInvoiceManagement/creditAndReInvoiceMaintenance",
        "visibility": false
      }, {
        "modulename": "Invoice Text Maintenance",
        "programURL": "/Application/iCABSAInvoicePrintMaintenance.htm",
        "routeURL": "application/invoice/print/maintenance",
        "visibility": false
      }, {
        "modulename": "History",
        "programURL": "/Application/iCABSAInvoiceHeaderGrid.htm",
        "routeURL": "grid/application/invoiceheadergridcomponent",
        "visibility": false
      }, {
        "modulename": "Invoices By Account",
        "programURL": "/Application/iCABSAInvoiceByAccountGrid.htm",
        "routeURL": "grid/application/invoice/account",
        "visibility": false
      }]
    }, {
      "featurename": "API",
      "visibility": false,
      "module": [{
        "modulename": "Preview API",
        "programURL": "/Application/iCABSAApplyAPIGrid.htm",
        "routeURL": "/billtocash/apigrid",
        "visibility": false
      }, {
        "modulename": "Apply API",
        "programURL": "/Application/iCABSAApplyAPIGeneration.htm",
        "routeURL": "/billtocash/apigeneration",
        "visibility": false
      }, {
        "modulename": "API Code / Rate",
        "programURL": "/Business/iCABSBAPICodeMaintenance.htm",
        "routeURL": "/billtocash/apicodemaintenance",
        "visibility": false
      }, {
        "modulename": "Exempt A Contract",
        "programURL": "/Application/iCABSAContractAPIMaintenance.htm",
        "routeURL": "/billtocash/contract/apiexempt",
        "visibility": false
      }, {
        "modulename": "API Date Change",
        "programURL": "/Application/iCABSAAPIDateMaintenance.htm",
        "routeURL": "/billtocash/apidate",
        "visibility": false
      }, {
        "modulename": "Service Cover API Update",
        "programURL": "/Application/iCABSAServiceCoverAPIGrid.htm",
        "routeURL": "/billtocash/serviceCoverApiGrid",
        "visibility": false
      }, {
        "modulename": "Reverse API Contract",
        "programURL": "/Application/iCABSAAPIReverse.htm",
        "routeURL": "/billtocash/contract/apireverse",
        "visibility": false
      }, {
        "modulename": "Reverse API Premises",
        "programURL": "/Application/iCABSAAPIReverse.htm",
        "routeURL": "/billtocash/premise/apireverse",
        "visibility": false
      }, {
        "modulename": "Reverse API Service Cover",
        "programURL": "/Application/iCABSAAPIReverse.htm",
        "routeURL": "/billtocash/servicecover/apireverse",
        "visibility": false
      }]
    }, {
      "featurename": "Tools",
      "visibility": false,
      "module": [{
        "modulename": "Batch Process Monitor",
        "programURL": "/Model/riMBatchProcessMonitorSearch.htm",
        "routeURL": "/itfunctions/batchprocess/monitor",
        "visibility": false
      }, {
        "modulename": "Report Process Viewer",
        "programURL": "/Model/riMReportViewerSearch.htm",
        "routeURL": "",
        "visibility": false
      }]
    }]
  }, {
    "domainname": "Sales",
    "id": "Sales",
    "alwaysdisplay": false,
    "visibility": false,
    "feature": [{
      "featurename": "Customer Contact",
      "visibility": false,
      "module": [{
        "modulename": "General Search",
        "programURL": "/ContactManagement/iCABSCMGeneralSearchGrid.htm",
        "routeURL": "/contractmanagement/generalsearchgrid",
        "visibility": false
      }, {
        "modulename": "Contact Centre Search",
        "programURL": "/ContactManagement/iCABSCMCallCentreGrid.htm",
        "routeURL": "/ccm/callcentersearch/",
        "visibility": false
      }, {
        "modulename": "Contact Centre Review",
        "programURL": "/ContactManagement/iCABSCMCallCentreReviewGrid.htm",
        "routeURL": "/ccm/centreReview",
        "visibility": false
      }, {
        "modulename": "Account Review",
        "programURL": "/ContactManagement/iCABSCMAccountReviewGrid.htm",
        "routeURL": "grid/application/reportContacts/accountReviewGrid",
        "visibility": false
      }, {
        "modulename": "Work Order Review",
        "programURL": "/ContactManagement/iCABSCMWorkorderReviewGrid.htm",
        "routeURL": "/ccm/workOrderReviewGrid",
        "visibility": false
      }]
    }, {
      "featurename": "Telesales",
      "visibility": false,
      "module": [{
        "modulename": "Telesales Order Grid",
        "programURL": "/Application/iCABSATeleSalesOrderGrid.htm",
        "routeURL": "/ccm/customerContact/telesalesordergrid",
        "visibility": false
      }]
    }, {
      "featurename": "Prospects",
      "visibility": false,
      "module": [{
        "modulename": "Prospect Maintenance",
        "programURL": "/ContactManagement/iCABSCMPipelineProspectMaintenance.htm",
        "routeURL": "/prospecttocontract/maintenance/prospect",
        "visibility": false
      }, {
        "modulename": "Prospect Grid",
        "programURL": "/ContactManagement/iCABSCMProspectGrid.htm",
        "routeURL": "/prospecttocontract/prospectgrid",
        "visibility": false
      }, {
        "modulename": "Pipeline Prospect Grid",
        "programURL": "/Sales/iCABSSPipelineGrid.htm",
        "routeURL": "/prospecttocontract/SalesOrderProcessing/PipelineGrid",
        "visibility": false
      }, {
        "modulename": "Sales Order Prospects",
        "programURL": "/Sales/iCABSSSOProspectGrid.htm",
        "routeURL": "/grid/service/prospectgrid",
        "visibility": false
      }, {
        "modulename": "Contract Approval",
        "programURL": "/Sales/iCABSSdlContractApprovalGrid.htm",
        "routeURL": "/grid/sales/contractapprovalgrid",
        "visibility": false
      }, {
        "modulename": "Diary",
        "programURL": "/ContactManagement/iCABSCMDiaryMaintenance.htm",
        "routeURL": "/prospecttocontract/maintenance/diary",
        "visibility": false
      }, {
        "modulename": "Diary Day",
        "programURL": "/ContactManagement/iCABSCMDiaryDayMaintenance.htm",
        "routeURL": "/prospecttocontract/maintenance/diarydaymaintaianance",
        "visibility": false
      }, {
        "modulename": "Key Account Job",
        "programURL": "/ContactManagement/iCABSCMProspectEntryMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Confirm Key Account Job",
        "programURL": "/ContactManagement/iCABSCMProspectEntryGrid.htm",
        "routeURL": "/prospecttocontract/contactmanagement/prospectEntryGrid",
        "visibility": false
      }]
    }, {
      "featurename": "Sales Maintenance",
      "visibility": false,
      "module": [{
        "modulename": "Sales Area",
        "programURL": "/Business/iCABSBSalesAreaGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Negotiating Employee Reassign",
        "programURL": "/Business/iCABSBContractSalesEmployeeReassignGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Portfolio Rezone",
        "programURL": "/Business/iCABSBSalesAreaPostcodeRezoneGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Postcode Rezone",
        "programURL": "/Business/iCABSBSalesAreaRezoneGrid.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Contract",
      "visibility": false,
      "module": [{
        "modulename": "Contract For Branch",
        "programURL": "/ApplicationReport/iCABSARBranchContractReport.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Imports & Notifications",
      "visibility": false,
      "module": [{
        "modulename": "Bulk SMS Messages: Business",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/business",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Branch",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/branch",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Account",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/account",
        "visibility": false
      }]
    }, {
      "featurename": "Tools",
      "visibility": false,
      "module": [{
        "modulename": "Batch Process Monitor",
        "programURL": "/Model/riMBatchProcessMonitorSearch.htm",
        "routeURL": "/itfunctions/batchprocess/monitor",
        "visibility": false
      }, {
        "modulename": "Report Process Viewer",
        "programURL": "/Model/riMReportViewerSearch.htm",
        "routeURL": "",
        "visibility": false
      }]
    }]
  }, {
    "domainname": "Service",
    "id": "Service",
    "alwaysdisplay": false,
    "visibility": false,
    "feature": [{
      "featurename": "Customer Contact",
      "visibility": false,
      "module": [{
        "modulename": "General Search",
        "programURL": "/ContactManagement/iCABSCMGeneralSearchGrid.htm",
        "routeURL": "/contractmanagement/generalsearchgrid",
        "visibility": false
      }, {
        "modulename": "Contact Centre Search",
        "programURL": "/ContactManagement/iCABSCMCallCentreGrid.htm",
        "routeURL": "/ccm/callcentersearch/",
        "visibility": false
      }, {
        "modulename": "Contact Centre Review",
        "programURL": "/ContactManagement/iCABSCMCallCentreReviewGrid.htm",
        "routeURL": "/ccm/centreReview",
        "visibility": false
      }, {
        "modulename": "Callout Search",
        "programURL": "/ContactManagement/iCABSCMCustomerContactCalloutGrid.htm",
        "routeURL": "/ccm/customercontact/callout/grid",
        "visibility": false
      }]
    }, {
      "featurename": "Service Maintenance",
      "visibility": false,
      "module": [{
        "modulename": "Service Area",
        "programURL": "/Business/iCABSBBranchServiceAreaGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Service Verification",
        "programURL": "/Service/iCABSSeAwaitingVerificationGrid.htm",
        "routeURL": "/serviceplanning/Service/verification",
        "visibility": false
      }, {
        "modulename": "Portfolio Rezone",
        "programURL": "/Business/iCABSBPremisePostcodeRezoneGrid.htm",
        "routeURL": "/grid/application/premisePostcodeRezoneGrid",
        "visibility": false
      }, {
        "modulename": "Postcode Rezone",
        "programURL": "/Business/iCABSBServiceAreaRezoneGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Area Detail",
        "programURL": "/Service/iCABSSeServiceAreaDetailGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Visit Anniversary Date Change",
        "programURL": "/Application/iCABSAContractAnniversaryChange.htm",
        "routeURL": "/contractmanagement/contractadmin/contractAnniversaryChange",
        "visibility": false
      }, {
        "modulename": "Suspend Premises Service",
        "programURL": "/Application/iCABSAPremiseServiceSuspendMaintenance.htm",
        "routeURL": "/contractmanagement/premisesmaintenance/servicesuspendmaintenance",
        "visibility": false
      }, {
        "modulename": "Suspend Product Service",
        "programURL": "/Application/iCABSAServiceCoverServiceSuspendMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Multi-Premises Special Instructions Change",
        "programURL": "/Application/iCABSAMultiPremiseSpecial.htm",
        "routeURL": "/contractmanagement/premisesadmin/application/multiPremisesSpecial",
        "visibility": false
      }, {
        "modulename": "Bump Static Plan",
        "programURL": "/Service/iCABSSeServiceMoveGrid.htm",
        "routeURL": "/serviceplanning/ServiceMoveGridSearch",
        "queryParams": {"Plan": "Bump"},
        "visibility": false
      }, {
        "modulename": "Bulk Service Cover Uplift Upload",
        "programURL": "/Service/iCABSSeUploadBulkServiceCoverUplifts.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Calendars",
      "visibility": false,
      "module": [{
        "modulename": "Apply Annual Calendar",
        "programURL": "/Application/iCABSAServiceCoverCalendarDatesMaintenance.htm",
        "routeURL": "sales/ServiceCoverCalendarDatesMaintenance",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Summary",
        "programURL": "/Application/iCABSAServiceCoverCalendarDatesMaintenanceGrid.htm",
        "routeURL": "/serviceplanning/calendarandSeasons/serviceCoverCalendarDateMaintenanceGrid",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Template",
        "programURL": "/Application/iCABSACalendarTemplateMaintenance.htm",
        "routeURL": "/application/calendarTemplateMaintenance",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Template Access",
        "programURL": "/Application/iCABSACalendarTemplateBranchAccessGrid.htm",
        "routeURL": "/grid/application/calendarTemplateBranchAccessGrid",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Template Use",
        "programURL": "/Application/iCABSACalendarServiceGrid.htm",
        "routeURL": "/serviceplanning/Templates/CalendarTemplateUse",
        "visibility": false
      }, {
        "modulename": "Annual Calendar Template Change History",
        "programURL": "/Application/iCABSACalendarHistoryGrid.htm",
        "routeURL": "/serviceplanning/application/calenderHistoryGrid",
        "visibility": false
      }, {
        "modulename": "Closed Calendar Template",
        "programURL": "/Application/iCABSAClosedTemplateMaintenance.htm",
        "routeURL": "/serviceplanning/application/closedtemplatemaintenance",
        "visibility": false
      }, {
        "modulename": "Closed Calendar Template Access",
        "programURL": "/Application/iCABSAClosedTemplateBranchAccessGrid.htm",
        "routeURL": "/grid/service/ClosedTemplateBranchAccessGrid",
        "visibility": false
      }, {
        "modulename": "Closed Calendar Template Use",
        "programURL": "/Application/iCABSAClosedServiceGrid.htm",
        "routeURL": "/serviceplanning/Templates/HolidayClosedTemplateUse",
        "visibility": false
      }, {
        "modulename": "Closed Calendar Template Change History",
        "programURL": "/Application/iCABSAClosedHistoryGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Apply Seasonal Service",
        "programURL": "/Application/iCABSAServiceCoverSeasonalDatesMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Seasonal Template",
        "programURL": "/Application/iCABSASeasonalTemplateMaintenance.htm",
        "routeURL": "application/seasonal/templatemaintenance",
        "visibility": false
      }, {
        "modulename": "Seasonal Template Details",
        "programURL": "/Application/iCABSASeasonalTemplateDetailGrid.htm",
        "routeURL": "/grid/service/seasonaltemplatedetailgrid",
        "visibility": false
      }]
    }, {
      "featurename": "Planning",
      "visibility": false,
      "module": [{
        "modulename": "Create Service Plan",
        "programURL": "/Service/iCABSSeServicePlanningGrid.htm",
        "routeURL": "grid/service/planning/grid",
        "visibility": false
      }, {
        "modulename": "Create Service Plan (Hygiene)",
        "programURL": "/Service/iCABSSeServicePlanningGridHg.htm",
        "routeURL": "/serviceplanning/serviceplanninggridhg",
        "visibility": false
      }, {
        "modulename": "Plan Visit Maintenance",
        "programURL": "/Service/iCABSSePlanVisitGrid.htm",
        "routeURL": "grid/application/visitmaintenance/planvisitGrid",
        "visibility": false
      }, {
        "modulename": "Service Planning Maintenance",
        "programURL": "/Service/iCABSSeServicePlanningMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Planning Diary",
        "programURL": "/Service/iCABSSePlanningDiary.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Confirmed Plans",
        "programURL": "/Service/iCABSSeServicePlanGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Area Reallocation",
        "programURL": "/Service/iCABSSeAreaReallocationGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Service Area Allocation",
        "programURL": "/Business/iCABSBServiceAreaAllocationGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Area Sequence",
        "programURL": "/Service/iCABSSeServiceAreaSequenceGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Area Sequence By Postcode",
        "programURL": "/Service/iCABSSeServiceAreaPostcodeSequenceGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Service Planning Re-Sequencing",
        "programURL": "/Service/iCABSSeServiceAreaReSequencing.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Summary Workload",
        "programURL": "/Service/iCABSSESummaryWorkloadGridMonthBranch.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Summary Workload Reroute",
        "programURL": "/Service/iCABSSESummaryWorkloadGridMonthBranch.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Despatch Grid",
        "programURL": "/Service/iCABSSeDespatchGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Deliveries Due",
        "programURL": "/Application/iCABSAProductSalesDeliveriesDueGrid.htm",
        "routeURL": "/servicedelivery/reportsplanning/productsalesdeliverydue",
        "queryParams": {"currentContractType": "P"},
        "visibility": false
      }]
    }, {
      "featurename": "Paperwork Generation",
      "visibility": false,
      "module": [{
        "modulename": "Work List",
        "programURL": "/Service/iCABSWorkListConfirm.htm",
        "routeURL": "/servicedelivery/service/worklist",
        "visibility": false
      }, {
        "modulename": "Worklist By Date Range",
        "programURL": "/Service/iCABSSeServiceWorkListDateGrid.htm",
        "routeURL": "/grid/service/service/worklist/dategrid",
        "visibility": false
      }, {
        "modulename": "Install & Removal Receipts",
        "programURL": "/Sales/iCABSSInstallReceipt.htm",
        "routeURL": "servicedelivery/installReceipt",
        "visibility": false
      }, {
        "modulename": "Service Listing / Receipts",
        "programURL": "/Service/iCABSSeServicePlanDeliveryNoteGrid.htm",
        "routeURL": "/servicedelivery/paperwork/servicelisting",
        "visibility": false
      }, {
        "modulename": "Single Service Receipt",
        "programURL": "/Service/iCABSSeServicePlanDeliveryNotebyProduct.htm",
        "routeURL": "/servicedelivery/paperwork/singleServiceReceipt",
        "visibility": false
      }, {
        "modulename": "Service Planning List",
        "programURL": "/Service/iCABSSeServicePlanningListEntry.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Treatment Label Print",
        "programURL": "/ApplicationReport/iCABSARTreatmentLabelPrint.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Van Loading Report",
        "programURL": "/ApplicationReport/iCABSARVanLoadingReport.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Waste Consignment Note Generation",
        "programURL": "/Service/iCABSSeWasteConsignmentNoteGenerate.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Blank Consignment Notes",
        "programURL": "/Service/iCABSSeBlankConsignmentNotePrint.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Service Monitoring",
      "visibility": false,
      "module": [{
        "modulename": "Tech Work Grid",
        "programURL": "/Service/iCABSSeTechnicianWorkSummaryGrid.htm",
        "routeURL": "/servicedelivery/techWorkGridService/TechnicianWorkSummaryGrid",
        "visibility": false
      }, {
        "modulename": "Branch Service Monitor",
        "programURL": "/Service/iCABSSeDebriefBranchGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Employee Service Monitor",
        "programURL": "/Service/iCABSSeDebriefEmployeeGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Outstanding Tasks",
        "programURL": "/Service/iCABSSeDebriefOutstandingGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Debrief",
        "programURL": "/Service/iCABSSeDebriefSummaryGrid.htm",
        "routeURL": "/grid/service/debrief/summary",
        "visibility": false
      }, {
        "modulename": "Visit Rejections",
        "programURL": "/Service/iCABSSeServiceVisitRejectionsGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Visit Rejections (All Branches)",
        "programURL": "/Service/iCABSSeServiceVisitRejectionsGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Tech Sync Summary",
        "programURL": "/Service/iCABSSeTechnicianSyncSummaryGrid.htm",
        "routeURL": "/servicedelivery/pdareturns/techniciansyncsummary",
        "visibility": false
      }, {
        "modulename": "Unprocessed PDA Sync Visit (PC)",
        "programURL": "/Service/iCABSSePESVisitGrid.htm",
        "routeURL": "/servicedelivery/pdareturns/SePESVisitGrid",
        "queryParams": {"Business": "true"},
        "visibility": false
      }]
    }, {
      "featurename": "Mobile Service Updates",
      "visibility": false,
      "module": [{
        "modulename": "Customer Contact Update",
        "programURL": "/Service/iCABSSePremiseContactChangeGrid.htm",
        "routeURL": "/contractmanagement/premisesadmin/PDAReturns/premiseContactChange",
        "visibility": false
      }, {
        "modulename": "Customer Data Update",
        "programURL": "/Service/iCABSSeDataChangeGrid.htm",
        "routeURL": "/contractmanagement/customerinfo/customerdataupdate/datachangegrid",
        "visibility": false
        }, {
        "modulename": "New Locations",
        "programURL": "/Service/iCABSSeHCANewLocationGrid.htm",
        "routeURL": "/grid/service/hca/newlocation",
        "visibility": false
      }, {
        "modulename": "Risk Assessment",
        "programURL": "/Service/iCABSSeHCARiskAssessmentGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Special Instructions",
        "programURL": "/Service/iCABSSeHCASpecialInstructionsGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Lead Maintenance",
        "programURL": "/ContactManagement/iCABSCMHCALeadMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Area Rezone Rejections",
        "programURL": "/Service/iCABSSeServiceAreaRezoneRejectionsGrid.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Visits",
      "visibility": false,
      "module": [{
        "modulename": "Shared Visit Release",
        "programURL": "/Service/iCABSSeServiceVisitReleaseGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Visit Rejections",
        "programURL": "/Service/iCABSSeServiceVisitRejectionsGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Visit Rejections (All Branches)",
        "programURL": "/Service/iCABSSeServiceVisitRejectionsGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Visit Maintenance",
        "programURL": "/Service/iCABSSeServiceVisitEntryGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Group Visit Maintenance",
        "programURL": "/Service/iCABSSeGroupServiceVisitEntryGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Entitlement Visit Maintenance",
        "programURL": "/Service/iCABSSeServiceVisitEntitlementEntryGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Service Docket Data Entry",
        "programURL": "/Service/iCABSSeServiceDocketDataEntry.htm",
        "routeURL": "/servicedelivery/service/visit/maintenance/docketentry",
        "visibility": false
      }, {
        "modulename": "Service Work List Entry",
        "programURL": "/Service/iCABSSePDAWorkListEntryGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Non-Returned Paperwork Audit",
        "programURL": "/ApplicationReport/iCABSARReturnedPaperWorkGrid.htm",
        "routeURL": "/servicedelivery/lettersAndLabels/returnedPaperWorkGrid",
        "visibility": false
      }, {
        "modulename": "Manual Waste Consignment Note Entry",
        "programURL": "/Service/iCABSSeManualWasteConsignmentNote.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Void Waste Consignment Note",
        "programURL": "/Service/iCABSSeManualWasteConsignmentNote.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Despatch Grid",
        "programURL": "/Service/iCABSSeDespatchGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Service Activity",
        "programURL": "/Service/iCABSSeServiceActivityUpdateGrid.htm",
        "routeURL": "/grid/service/visit/activity",
        "visibility": false
      }]
    }, {
      "featurename": "Service Delivery",
      "visibility": false,
      "module": [{
        "modulename": "Adjust Productivity",
        "programURL": "/Service/iCABSSeProductivityAdjustmentMaintenance.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Customer Signature Summary: Business",
        "programURL": "/Service/iCABSSeCustomerSignatureSummary.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Customer Signature Summary: Region",
        "programURL": "/Service/iCABSSeCustomerSignatureSummary.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Customer Signature Summary: Branch",
        "programURL": "/Service/iCABSSeCustomerSignatureSummary.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Follow Up Calls",
        "programURL": "/Service/iCABSSeFollowUpGrid.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Service Call Type: Business",
        "programURL": "/Service/iCABSServiceCallTypeGrid.htm",
        "routeURL": "servicedelivery/businessservicecalltype",
        "queryParams": {"mode": "Business"},
        "visibility": false
      }, {
        "modulename": "Service Call Type: Region",
        "programURL": "/Service/iCABSServiceCallTypeGrid.htm",
        "routeURL": "servicedelivery/regionservicecalltype",
        "queryParams": {"mode": "Region"},
        "visibility": false
      }, {
        "modulename": "Service Call Type: Branch",
        "programURL": "/Service/iCABSServiceCallTypeGrid.htm",
        "routeURL": "servicedelivery/branchservicecalltype",
         "queryParams": {"mode": "Branch"},
        "visibility": false
      }, {
        "modulename": "Service Visit Export",
        "programURL": "/Service/iCABSSeServiceVisitExport.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Waste",
      "visibility": false,
      "module": [{
        "modulename": "Daily Prenotification Report",
        "programURL": "/ApplicationReport/iCABSARDailyPrenotificationReport.htm",
        "routeURL": "/servicedelivery/dailyprenotificationreport",
        "visibility": false
      }, {
        "modulename": "Environment Agency Business Waste Generation Report",
        "programURL": "/ApplicationReport/iCABSAREnvAgencyBusinessWaste.htm",
        "routeURL": "/servicedelivery/wasteconsignment/envagencybusinesswaste",
        "visibility": false
      }, {
        "modulename": "Environment Agency Exceptions",
        "programURL": "/ApplicationReport/iCABSAREnvAgencyExceptions.htm",
        "routeURL": "",
        "visibility": false
      }, {
        "modulename": "Environment Agency Quarterly Returns",
        "programURL": "/ApplicationReport/iCABSAREnvAgencyQuarterlyReturn.htm",
        "routeURL": "/grid/sales/envagencyquarterlyreturn",
        "visibility": false
      }, {
        "modulename": "Annual Prenotification Report",
        "programURL": "/ApplicationReport/iCABSARPrenotificationReport.htm",
        "routeURL": "/servicedelivery/reports/prenotificationreport",
        "visibility": false
      }, {
        "modulename": "Waste Transfer Notes",
        "programURL": "/ApplicationReport/iCABSARWasteTransferNotesPrint.htm",
        "routeURL": "",
        "visibility": false
      }]
    }, {
      "featurename": "Imports & Notifications",
      "visibility": false,
      "module": [{
        "modulename": "Bulk SMS Messages: Business",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/business",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Branch",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/branch",
        "visibility": false
      }, {
        "modulename": "Bulk SMS Messages: Account",
        "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
        "routeURL": "/ccm/sendbulksms/account",
        "visibility": false
      }]
    }, {
      "featurename": "Tools",
      "visibility": false,
      "module": [{
        "modulename": "Batch Process Monitor",
        "programURL": "/Model/riMBatchProcessMonitorSearch.htm",
        "routeURL": "/itfunctions/batchprocess/monitor",
        "visibility": false
      }, {
        "modulename": "Report Process Viewer",
        "programURL": "/Model/riMReportViewerSearch.htm",
        "routeURL": "",
        "visibility": false
      }]
    }]
  },
  {
      "domainname": "Reporting & Dashboards",
      "id": "Dashboard",
      "alwaysdisplay": true,
      "visibility": false,
      "feature": [
        {
          "featurename": "Dashboard",
          "visibility": false,
          "module": [
            {
              "modulename": "Service & Productivity Dashboard",
              "programURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/fa1c5f7c-1592-4dc9-b64b-2625828a10f1",
              "routeURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/fa1c5f7c-1592-4dc9-b64b-2625828a10f1",
              "visibility": false,
              "external": true
            },
            {
              "modulename": "Sales Stats",
              "programURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/b8985585-5ec9-4a9c-93dc-ba982b363e4a",
              "routeURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/b8985585-5ec9-4a9c-93dc-ba982b363e4a",
              "visibility": false,
              "external": true
            },
            {
              "modulename": "Test Screen",
              "programURL": "people/test",
              "routeURL": "people/test",
              "visibility": true,
              "external": false
            }]
        },
        {
          "featurename": "Sales",
          "visibility": false,
          "module": [
            {
              "modulename": "",
              "programURL": "",
              "routeURL": "",
              "visibility": false
            }]
        },
        {
          "featurename": "Contractual",
          "visibility": false,
          "module": [
            {
              "modulename": "",
              "programURL": "",
              "routeURL": "",
              "visibility": false
            }]
        },
        {
          "featurename": "Servicing",
          "visibility": false,
          "module": [
            {
              "modulename": "",
              "programURL": "",
              "routeURL": "",
              "visibility": false
            }]
        },
        {
          "featurename": "Finance",
          "visibility": false,
          "module": [
            {
              "modulename": "",
              "programURL": "",
              "routeURL": "",
              "visibility": false
            }]
        }]
    }]
}`;
