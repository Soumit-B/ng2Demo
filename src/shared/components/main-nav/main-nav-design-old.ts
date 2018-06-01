export const MAIN_NAV_DESIGN = `{
  "menu": [{
      "domainname": "Favourites",
      "id": "Favourites",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Dashboard",
          "visibility": false,
          "module": [
            {
              "modulename": "Entire dashboard",
              "programURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d",
              "routeURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d",
              "visibility": false
            },
            {
              "modulename": "Service drill-down map",
              "programURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d/sheet/GDWLnh/state/analysis",
              "routeURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d/sheet/GDWLnh/state/analysis",
              "visibility": false
            },
            {
              "modulename": "Routes map",
              "programURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d/sheet/GWdvdM/state/analysis",
              "routeURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d/sheet/GWdvdM/state/analysis",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "CUSTOMER CONTACT MANAGEMENT",
      "id": "CustomerContactManagement",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Communications",
          "visibility": false,
          "module": [
            {
              "modulename": "Email Messages",
              "programURL": "/Business/iCABSBEmailGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Branch - Bulk send SMS",
              "programURL": "/ContactManagement/iCABSBulkSMSMessageMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "SMS Messages",
              "programURL": "/ContactManagement/iCABSCMSMSMessagesGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Contact Redirection",
              "programURL": "/ContactManagement/iCABSCMContactRedirection.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Customer Contact",
          "visibility": false,
          "module": [
            {
              "modulename": "CVC Ticket Import",
              "programURL": "/ContactManagement/iCABSCMCVCImport.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Contact Centre Assign",
              "programURL": "/ContactManagement/iCABSCMCallCentreAssignGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Callout Search",
              "programURL": "/ContactManagement/iCABSCMCustomerContactCalloutGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Contact Medium",
              "programURL": "/ContactManagement/iCABSContactMediumGrid.htm",
              "routeURL": "/ccm/service/contactmedium",
              "visibility": false
            },
            {
              "modulename": "Work Order Review",
              "programURL": "/ContactManagement/iCABSCMWorkorderReviewGrid.htm",
              "routeURL": "",
              "visibility": false
            },
             {
              "modulename": "Contact Centre Review",
              "programURL": "/ContactManagement/iCABSCMCallCentreReviewGrid.htm",
              "routeURL": "/ccm/centreReview",
              "visibility": false
            },
            {
              "modulename": "Contact Search",
              "programURL": "/ContactManagement/iCABSCMCustomerContactSearchGrid.htm",
              "routeURL": "/ccm/contactsearch/",
              "visibility": false
            },
            {
              "modulename": "Contact Centre Search",
              "programURL": "/ContactManagement/iCABSCMCallCentreGrid.htm",
              "routeURL": "/ccm/callcentersearch/",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Letters & Labels",
          "visibility": false,
          "module": [
            {
              "modulename": "Anniversary Letter Generated",
              "programURL": "/ApplicationReport/iCABSAnniversaryGenerate.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Renewal Letter Generated",
              "programURL": "/ApplicationReport/iCABSRenewalGenerate.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Reports-Contact",
          "visibility": false,
          "module": [
            {
              "modulename": "Account Review",
              "programURL": "/ContactManagement/iCABSCMAccountReviewGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Call Analysis",
              "programURL": "/ContactManagement/iCABSCMCallAnalysisGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenance- Business",
          "visibility": false,
          "module": [
            {
              "modulename": "Lost Business Detail",
              "programURL": "/Business/iCABSBLostBusinessDetailGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenance- System",
          "visibility": false,
          "module": [
            {
              "modulename": "Notifications-Template",
              "programURL": "/System/iCABSSNotificationTemplateMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Notifications-Group",
              "programURL": "/System/iCABSSNotificationGroupMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Customer Type",
              "programURL": "/System/iCABSSCustomerTypeMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Contact Type Detail",
              "programURL": "/System/iCABSSContactTypeDetailMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Contact Type",
              "programURL": "/System/iCABSSContactTypeMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Telesales",
          "visibility": false,
          "module": [
            {
              "modulename": "Telesales Order Grid",
              "programURL": "/Application/iCABSATeleSalesOrderGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Translation",
          "visibility": false,
          "module": [
            {
              "modulename": "Contact Type Detail",
              "programURL": "/System/iCABSSContactTypeDetailLangMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "PROSPECT TO CONTRACT",
      "id": "ProspectToContract",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Processes",
          "visibility": false,
          "module": [
            {
              "modulename": "Lead Maintenance",
              "programURL": "/ContactManagement/iCABSCMHCALeadMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Prospect & Dairy Management",
          "visibility": false,
          "module": [
            {
              "modulename": "Dairy Day",
              "programURL": "/ContactManagement/iCABSCMDiaryDayMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Dairy",
              "programURL": "/ContactManagement/iCABSCMDiaryMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Prospect Bulk Import",
              "programURL": "/ContactManagement/iCABSCMProspectBulkImport.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Confirm Nat Acc Job",
              "programURL": "/ContactManagement/iCABSCMProspectEntryGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Nat Acc Job",
              "programURL": "/ContactManagement/iCABSCMProspectEntryMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "New Prospect",
              "programURL": "/ContactManagement/iCABSCMPipelineProspectMaintenance.htm",
              "routeURL": "/prospecttocontract/maintenance/prospect",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Reports Sales",
          "visibility": false,
          "module": [
            {
              "modulename": "Prospect",
              "programURL": "/ContactManagement/iCABSCMProspectGrid.htm",
              "routeURL": "/prospecttocontract/prospectconvgrid",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Sales Order Processing",
          "visibility": false,
          "module": [
            {
              "modulename": "Sales Order Prospect",
              "programURL": "/Sales/iCABSSSOProspectGrid.htm",
              "routeURL": "/grid/service/prospectgrid",
              "visibility": false
            },
            {
              "modulename": "Contract Approval",
              "programURL": "/Sales/iCABSSdlContractApprovalGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Pipeline Prospect Grid",
              "programURL": "/Sales/iCABSSPipelineGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenance- Business",
          "visibility": false,
          "module": [
            {
              "modulename": "Business Origin",
              "programURL": "/Business/iCABSBBusinessOriginMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "CONTRACT MANAGEMENT",
      "id": "ContractManagement",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Account & Group Account Management",
          "visibility": false,
          "module": [
            {
              "modulename": "Group Account Maintenance",
              "programURL": "/System/iCABSSGroupAccountMaintenance.htm",
              "routeURL": "",
              "visibility": "visibile"
            },
            {
              "modulename": "Group Account Move",
              "programURL": "/System/iCABSSGroupAccountMove.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Account Bank Details",
              "programURL": "/Application/iCABSAAccountBankDetailsMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Account Maintenance",
              "programURL": "/Application/iCABSAAccountMaintenance.htm",
              "routeURL": "/contractmanagement/premisesmaintenance/account/maintenance",
              "visibility": false
            },
            {
              "modulename": "Address Changes",
              "programURL": "/Application/iCABSAAccountAddressChangeHistoryGrid.htm",
              "routeURL": "/contractmanagement/account/addressChangeHistory",
              "visibility": false
            },
            {
              "modulename": "Assign Account",
              "programURL": "/Application/iCABSAAccountAssign.htm",
              "routeURL": "/contractmanagement/accountadmin/account/assign/search",
              "visibility": false
            },
            {
              "modulename": "Merge Account",
              "programURL": "/Application/iCABSAAccountMerge.htm",
              "routeURL": "/contractmanagement/accountadmin/account/merge/search",
              "visibility": false
            },
            {
              "modulename": "Move Account",
              "programURL": "/Application/iCABSAAccountMove.htm",
              "routeURL": "/contractmanagement/accountadmin/account/move/search",
              "visibility": true
            }
          ]
        },
        {
          "featurename": "Branch Geography",
          "visibility": false,
          "module": [
            {
              "modulename": "Sales Area",
              "programURL": "/Business/iCABSBSalesAreaGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Postal Code",
              "programURL": "/Business/iCABSBPostcodeMaintenance.htm",
              "routeURL": "/contractmanagement/areas/branch/postalcode/maintenance",
              "visibility": false
            },
            {
              "modulename": "Postal Code/Service Area",
              "programURL": "/Business/iCABSBPostcodesGrid.htm",
              "routeURL": "/contractmanagement/areas/branchgeography/postcodesgrid",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Client Retention",
          "visibility": false,
          "module": [
            {
              "modulename": "Service Cover-Reduce Service Cover",
              "programURL": "/Application/iCABSAServiceCoverMaintenance.htm",
              "routeURL": "/contractmanagement/branch/serviceCover/maintenance",
              "visibility": false
            },
            {
              "modulename": "Service Cover-Delete Service Cover",
              "programURL": "/Application/iCABSAServiceCoverSelectMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Premises- Delete Premises",
              "programURL": "/Application/iCABSAPremiseSelectMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Contract - Terminate",
              "programURL": "/Application/iCABSAContractSelectMaintenance.htm  ",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Contract- Amend Termination",
              "programURL": "/Application/iCABSAInactiveContractInfoMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Premises-Amend Deletion",
              "programURL": "/Application/iCABSAInactivePremiseInfoMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Cover-Amend Deletion",
              "programURL": "/Application/iCABSAInactiveServiceCoverInfoMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Delete Service Details",
              "programURL": "/Application/iCABSAServiceCoverDetailMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Contract Management",
          "visibility": false,
          "module": [
            {
              "modulename": "Customer Info",
              "programURL": "/Application/iCABSACustomerInfoMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Renewal/Period",
              "programURL": "/Application/iCABSAContractRenewalMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Mass Price Changes",
              "programURL": "/Application/iCABSAMassPriceChangeGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Percentage Price Change",
              "programURL": "/Application/iCABSAPercentagePriceChange.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Negotiating Branch",
              "programURL": "/Application/iCABSANegBranchMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "General Search",
              "programURL": "/ContactManagement/iCABSCMGeneralSearchGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Visit Anniversary Date Change",
              "programURL": "/Application/iCABSAContractAnniversaryChange.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Contract Maintenance",
              "programURL": "/Application/iCABSAContractMaintenance.htm",
              "routeURL": "/contractmanagement/maintenance/contract",
              "visibility": false
            },
            {
              "modulename": "General Selection",
              "programURL": "/Application/iCABSAPortfolioGeneralMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Contract Premises Management",
          "visibility": false,
          "module": [
            {
              "modulename": "Purchase Order Number",
              "programURL": "/Application/iCABSAMultiPremisePurchaseOrderAmend.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "National Accounts Upload",
              "programURL": "/Application/iCABSANatAccountsUpload.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Premise Maintenance",
              "programURL": "/Application/iCABSAPremiseMaintenance.htm",
              "routeURL": "/contractmanagement/premisesmaintenance/maintenance/premise",
              "visibility": false
            },
            {
              "modulename": "Move Branch by Postcode",
              "programURL": "/Application/iCABSAPostcodeMoveBranch.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Contract Service Cover Management",
          "visibility": true,
          "module": [
            {
              "modulename": "Special Instruction",
              "programURL": "/Application/iCABSAMultiPremiseSpecial.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Product Upgrade",
              "programURL": "/Application/iCABSAProductCodeUpgrade.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Trail Service",
              "programURL": "/Application/iCABSAServiceCoverTrialPeriodReleaseGrid.htm",
              "routeURL": "/contractmanagement/servicecoveradmin/servicecover/TialPeriodRelease",
              "visibility": false
            },
            {
              "modulename": "YTD Maintenance",
              "programURL": "/Application/iCABSAServiceCoverYTDMaintenance.htm",
              "routeURL": "/contractmanagement/servicecoveradmin/servicecover/YTDMaintenance",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Contract/Job Report",
          "visibility": false,
          "module": [
            {
              "modulename": "Contract For Branch",
              "programURL": "/ApplicationReport/iCABSARBranchContractReport.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Job Management",
          "visibility": false,
          "module": [
            {
              "modulename": "Job Maintenance",
              "programURL": "/Application/iCABSAContractMaintenance.htm",
              "routeURL": "/contractmanagement/maintenance/job",
              "visibility": false
            },
            {
              "modulename": "Invoice on First/Last Visit",
              "programURL": "/Application/iCABSAServiceCoverInvoiceOnFirstVisitMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Visit Frequency",
              "programURL": "/Application/iCABSAServiceCoverFrequencyMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Letters & Labels",
          "visibility": false,
          "module": [
            {
              "modulename": "Renewal Letters Print",
              "programURL": "/Sales/iCABSRenewalExtractGeneration.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "PDA Returns",
          "visibility": false,
          "module": [
            {
              "modulename": "Customer Data Update",
              "programURL": "/Service/iCABSSeDataChangeGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Customer Contact Update",
              "programURL": "/Service/iCABSSePremiseContactChangeGrid.htm",
              "routeURL": "/contractmanagement/premisesadmin/PDAReturns/premiseContactChange",
              "visibility": true
            }
          ]
        },
        {
          "featurename": "Premises",
          "visibility": false,
          "module": [
            {
              "modulename": "Suspended Serivce",
              "programURL": "/Application/iCABSAPremiseServiceSuspendMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Product Sale Management",
          "visibility": false,
          "module": [
            {
              "modulename": "Product Sale Maintenance",
              "programURL": "/Application/iCABSAContractMaintenance.htm",
              "routeURL": "/contractmanagement/maintenance/product",
              "visibility": false
            },
            {
              "modulename": "Maintain Product Sale- Service Cover",
              "programURL": "/Application/iCABSAProductSalesSCEntryGrid.htm",
              "routeURL": "/contractmanagement/maintenance/productSalesSCEntryGrid",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Sale Adjustments",
          "visibility": false,
          "module": [
            {
              "modulename": "Neg. Employee Reassign",
              "programURL": "/Business/iCABSBContractSalesEmployeeReassignGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Portfolio Rezone",
              "programURL": "/Business/iCABSBSalesAreaPostcodeRezoneGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Postcode Rezone",
              "programURL": "/Business/iCABSBSalesAreaRezoneGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "New/Rened Adj",
              "programURL": "/Sales/iCABSSSalesStatsAdjustmentGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Service Cover",
          "visibility": false,
          "module": [
            {
              "modulename": "Suspend Service",
              "programURL": "/Application/iCABSAServiceCoverServiceSuspendMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Service Processes",
          "visibility": false,
          "module": [
            {
              "modulename": "Delivery Confirmation",
              "programURL": "/Application/iCABSAServiceCoverUnsuspendGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenance- Business",
          "visibility": false,
          "module": [
            {
              "modulename": "Product Cover",
              "programURL": "/Business/iCABSBProductCoverMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Product Detail",
              "programURL": "/Business/iCABSBProductDetailMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Product Expense",
              "programURL": "/Business/iCABSBProductExpenseMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Product",
              "programURL": "/Business/iCABSBProductMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "SERVICE PLANNING",
      "id": "ServicePlanning",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Area",
          "visibility": false,
          "module": [
            {
              "modulename": "Area Reallocation",
              "programURL": "/Service/iCABSSeAreaReallocationGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Area Detail",
              "programURL": "/Service/iCABSSeServiceAreaDetailGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Area Seq By Postcode",
              "programURL": "/Service/iCABSSeServiceAreaPostcodeSequenceGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Resequencing",
              "programURL": "/Service/iCABSSeServiceAreaReSequencing.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Area Sequence",
              "programURL": "/Service/iCABSSeServiceAreaSequenceGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Bump Workload",
              "programURL": "/Service/iCABSSeServiceMoveGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Move Workload",
              "programURL": "/Service/iCABSSeServiceMoveGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Calender And Seasons",
          "visibility": false,
          "module": [
            {
              "modulename": "Service Cover -Annual Calendar",
              "programURL": "/Application/iCABSAServiceCoverCalendarDatesMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Contract- Annual Calendar Summary",
              "programURL": "/Application/iCABSAServiceCoverCalendarDatesMaintenanceGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Cover- Seasonal Service",
              "programURL": "/Application/iCABSAServiceCoverSeasonalDatesMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "PDA",
          "visibility": false,
          "module": [
            {
              "modulename": "Follow Up Calls",
              "programURL": "/Service/iCABSSeFollowUpGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Area Rezone REjections",
              "programURL": "/Service/iCABSSeServiceAreaRezoneRejectionsGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Plans",
          "visibility": false,
          "module": [
            {
              "modulename": "Planning Diary",
              "programURL": "/Service/iCABSSePlanningDiary.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Confirmed Plans",
              "programURL": "/Service/iCABSSeServicePlanGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Create Service Plan",
              "programURL": "/Service/iCABSSeServicePlanningGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Create Service Plan(HG)",
              "programURL": "/Service/iCABSSeServicePlanningGridHg.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Planning Maintenance",
              "programURL": "/Service/iCABSSeServicePlanningMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Reports",
          "visibility": false,
          "module": [
            {
              "modulename": "Service Planning List",
              "programURL": "/Service/iCABSSeServicePlanningListEntry.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenance - Business",
          "visibility": false,
          "module": [
            {
              "modulename": "Branch Holidays",
              "programURL": "/Business/iCABSBBranchHolidayGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Material Charge Rate",
              "programURL": "/Business/iCABSBPrepChargeRateMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Tempates",
          "visibility": false,
          "module": [
            {
              "modulename": "Calendar- Template Change History",
              "programURL": "/Application/iCABSACalendarHistoryGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Calendar- Template Use",
              "programURL": "/Application/iCABSACalendarServiceGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Calendar-Branch Template Access",
              "programURL": "/Application/iCABSACalendarTemplateBranchAccessGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Calendar- Template Maintenance",
              "programURL": "/Application/iCABSACalendarTemplateMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Holiday/Closed- Template Use",
              "programURL": "/Application/iCABSAClosedServiceGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Holiday/Closed- Branch Template Access",
              "programURL": "/Application/iCABSAClosedTemplateBranchAccessGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Holiday/Closed- Template Maintenance",
              "programURL": "iCABSAClosedTemplateMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Seasonal- Template Seasons",
              "programURL": "/Application/iCABSASeasonalTemplateDetailGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Seasonal- Template Maintenance",
              "programURL": "/Application/iCABSASeasonalTemplateMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Visit Maintenance",
          "visibility": false,
          "module": [
            {
              "modulename": "Split Plan Visit",
              "programURL": "/Service/iCABSSeServicePlanningSplitServiceMaintenanceHg.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Clear Down Plan Visit",
              "programURL": "/Service/iCABSSeClearDownPlanVisits.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Plan Visit Maintenance",
              "programURL": "/Service/iCABSSePlanVisitGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Workload",
          "visibility": false,
          "module": [
            {
              "modulename": "Service Verification",
              "programURL": "/Service/iCABSSeAwaitingVerificationGrid.htm",
              "routeURL": "/serviceplanning/Service/verification",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "SERVICE DELIVERY",
      "id": "ServiceDelivery",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Delivery Paperwork",
          "visibility": false,
          "module": [
            {
              "modulename": "Single Service Reciept",
              "programURL": "/Service/iCABSSeServicePlanDeliveryNotebyProduct.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Listing/Reciept",
              "programURL": "/Service/iCABSSeServicePlanDeliveryNoteGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Install/RemoveReciept",
              "programURL": "/Sales/iCABSSInstallReceipt.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Work List By Date Range",
              "programURL": "/Service/iCABSSeServiceWorkListDateGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Work List",
              "programURL": "/Service/iCABSWorkListConfirm.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Van Loading Report",
              "programURL": "/ApplicationReport/iCABSARVanLoadingReport.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Letters & Labels",
          "visibility": false,
          "module": [
            {
              "modulename": "Employee Address Label",
              "programURL": "/ApplicationReport/iCABSARAddressLabelPrint.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Treatment Labels",
              "programURL": "/ApplicationReport/iCABSARTreatmentLabelPrint.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Waste -Customer Quarterly Returns",
              "programURL": "/ApplicationReport/iCABSARCustomerQuarterlyReturnsPrint.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Non-Returned Paperwork Audit",
              "programURL": "/ApplicationReport/iCABSARReturnedPaperWorkGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Waste -Transfer Notes",
              "programURL": "/ApplicationReport/iCABSARWasteTransferNotesPrint.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Planning",
          "visibility": false,
          "module": [
            {
              "modulename": "Dispatch Grid",
              "programURL": "/Service/iCABSSeDespatchGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "PDA Returns",
          "visibility": false,
          "module": [
            {
              "modulename": "Unprocessed Sync Visits (PC)",
              "programURL": "/Service/iCABSSePESVisitGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Sync Summary -Tech",
              "programURL": "/Service/iCABSSeTechnicianSyncSummaryGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Tech Work Grid",
              "programURL": "/Service/iCABSSeTechnicianWorkSummaryGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "New Loactions",
              "programURL": "/Service/iCABSSeHCANewLocationGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Risk Assignment",
              "programURL": "/Service/iCABSSeHCARiskAssessmentGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Special Instructions",
              "programURL": "/Service/iCABSSeHCASpecialInstructionsGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Visit Rejections",
              "programURL": "/Service/iCABSSeServiceVisitRejectionsGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Process- Area Maintenance",
          "visibility": false,
          "module": [
            {
              "modulename": "Portfolio Rezone",
              "programURL": "/Business/iCABSBPremisePostcodeRezoneGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Area Allocation",
              "programURL": "/Business/iCABSBServiceAreaAllocationGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Area Map",
              "programURL": "/Business/iCABSBServiceAreaMap.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Zip Code Rezone",
              "programURL": "/Business/iCABSBServiceAreaRezoneGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Process Other",
          "visibility": false,
          "module": [
            {
              "modulename": "Adjust Productivity",
              "programURL": "/Service/iCABSSeProductivityAdjustmentMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Visit Export",
              "programURL": "/Service/iCABSSeServiceVisitExport.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Upload Bulk Service Cover Uplifts",
              "programURL": "/Service/iCABSSeUploadBulkServiceCoverUplifts.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Process- Service Action Monitor",
          "visibility": false,
          "module": [
            {
              "modulename": "Branch",
              "programURL": "/Service/iCABSSeDebriefBranchGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Employee",
              "programURL": "/Service/iCABSSeDebriefEmployeeGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Outstanding Tasks",
              "programURL": "/Service/iCABSSeDebriefOutstandingGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Debrief",
              "programURL": "/Service/iCABSSeDebriefSummaryGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Process-Waste Consignment Note",
          "visibility": false,
          "module": [
            {
              "modulename": "Daily Prenotification Report",
              "programURL": "/ApplicationReport/iCABSARDailyPrenotificationReport.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Annual Prenotification Report",
              "programURL": "/ApplicationReport/iCABSAREnvAgencyBusinessWaste.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Environment Agency Expections",
              "programURL": "/ApplicationReport/iCABSAREnvAgencyExceptions.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Environment Agency Quaterly Returns",
              "programURL": "/ApplicationReport/iCABSAREnvAgencyQuarterlyReturn.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Environment Agency Business Waste Generation Report",
              "programURL": "/ApplicationReport/iCABSARPrenotificationReport.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Blank Consignment Notes",
              "programURL": "/Service/iCABSSeBlankConsignmentNotePrint.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Manual Waste Consignment Note Entry",
              "programURL": "/Service/iCABSSeManualWasteConsignmentNote.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Waste Consignment Note Generation",
              "programURL": "/Service/iCABSSeWasteConsignmentNoteGenerate.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Reports-Customers",
          "visibility": false,
          "module": [
            {
              "modulename": "Customer Signature Summary - Branch",
              "programURL": "/Service/iCABSSeCustomerSignatureSummary.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Reports -Workload",
          "visibility": false,
          "module": [
            {
              "modulename": "Service Call type-Branch",
              "programURL": "/Service/iCABSServiceCallTypeGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Reports Planning",
          "visibility": false,
          "module": [
            {
              "modulename": "Product Sales- Deliveries Due",
              "programURL": "/Application/iCABSAProductSalesDeliveriesDueGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenances-Business",
          "visibility": false,
          "module": [
            {
              "modulename": "Material",
              "programURL": "/Business/iCABSBPreparationMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Area",
              "programURL": "/Business/iCABSBBranchServiceAreaGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Infestation Level",
              "programURL": "/Business/iCABSBInfestationLevelMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "System/Business Visit Type",
              "programURL": "/Business/iCABSBSystemBusinessVisitTypeMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Visit Action",
              "programURL": "/Business/iCABSBVisitActionMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Visit Type",
              "programURL": "iCABSBVisitTypeMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenances-Product",
          "visibility": false,
          "module": [
            {
              "modulename": "Product Service Group",
              "programURL": "/Business/iCABSBProductServiceGroupMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Valid Linked Products",
              "programURL": "/Business/iCABSBValidLinkedProductsGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenances-Waste",
          "visibility": false,
          "module": [
            {
              "modulename": "Waste Consignment Note Range",
              "programURL": "/Business/iCABSBWasteConsignmentNoteRangeGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Waste Consignment Note Range Type",
              "programURL": "iCABSBWasteConsignmentNoteRangeTypeMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Translation",
          "visibility": false,
          "module": [
            {
              "modulename": "Product Language",
              "programURL": "/Business/iCABSBProductLanguageMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Visit Maintenance",
          "visibility": false,
          "module": [
            {
              "modulename": "Service Docket  Data Entry",
              "programURL": "/Service/iCABSSeServiceDocketDataEntry.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Work  List Entry",
              "programURL": "/Service/iCABSSePDAWorkListEntryGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Service Activity",
              "programURL": "/Service/iCABSSeServiceActivityUpdateGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Group Visit Maintenance",
              "programURL": "/Service/iCABSSeGroupServiceVisitEntryGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Entitlement Visit Maintenance",
              "programURL": "/Service/iCABSSeServiceVisitEntitlementEntryGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Visit Maintenance",
              "programURL": "/Service/iCABSSeServiceVisitEntryGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "BILL TO CASH",
      "id": "BillToCash",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Authorization",
          "visibility": false,
          "module": [
            {
              "modulename": "User Credit Approval Level",
              "programURL": "/Model/riMUserApprovalLevelMaintenance.htm",
              "routeURL": "/billtocash/creditapproval",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Invoicing & Api Reporting",
          "visibility": false,
          "module": [
            {
              "modulename": "Next Invoice Run - Forecast Generation",
              "programURL": "/ApplicationReport/iCABSARGenerateNextInvoiceRunForecast.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Invoice Production & API",
          "visibility": false,
          "module": [
            {
              "modulename": "API Code/Rate",
              "programURL": "/Business/iCABSBAPICodeMaintenance.htm",
              "routeURL": "/billtocash/apicodemaintenance",
              "visibility": false
            },
            {
              "modulename": "API Date Change",
              "programURL": "/Application/iCABSAAPIDateMaintenance.htm",
              "routeURL": "/billtocash/apidate",
              "visibility": false
            },
            {
              "modulename": "Apply",
              "programURL": "/Application/iCABSAApplyAPIGeneration.htm",
              "routeURL": "/billtocash/apigeneration",
              "visibility": false
            },
            {
              "modulename": "Exempt A Contract",
              "programURL": "/Application/iCABSAContractAPIMaintenance.htm",
              "routeURL": "/billtocash/contract/apiexempt",
              "visibility": false
            },
            {
              "modulename": "Invoice Run/Single Invoice Run",
              "programURL": "/Business/iCABSBInvoiceRunDatesGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Preview",
              "programURL": "/Application/iCABSAApplyAPIGrid.htm",
              "routeURL": "/billtocash/apigrid",
              "visibility": false
            },
            {
              "modulename": "Reverse API Contract",
              "programURL": "/Application/iCABSAAPIReverse.htm",
              "routeURL": "/billtocash/contract/apireverse",
              "visibility": false
            },
            {
              "modulename": "Reverse API Premise",
              "programURL": "/Application/iCABSAAPIReverse.htm",
              "routeURL": "/billtocash/premise/apireverse",
              "visibility": false
            },
            {
              "modulename": "Reverse API Service Cover",
              "programURL": "/Application/iCABSAAPIReverse.htm",
              "routeURL": "/billtocash/servicecover/apireverse",
              "visibility": false
            },
            {
              "modulename": "Service Cover API Code",
              "programURL": "/Application/iCABSAServiceCoverAPIGrid.htm",
              "routeURL": "/billtocash/serviceCoverApiGrid",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Invoiced & Credited Reporting",
          "visibility": false,
          "module": [
            {
              "modulename": "History",
              "programURL": "/Application/iCABSAInvoiceHeaderGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Post Invoice Management",
          "visibility": false,
          "module": [
            {
              "modulename": "Payment Grid",
              "programURL": "/Application/iCABSAContractInvoiceGrid.htm",
              "routeURL": "/billtocash/contract/invoice",
              "visibility": false
            },
            {
              "modulename": "Credit & Re-Invoice",
              "programURL": "/Application/iCABSACreditAndReInvoiceMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Invoice Text Maintenance",
              "programURL": "/Application/iCABSAInvoicePrintMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Retained Service Cover Acceptance",
              "programURL": "/Application/iCABSAServiceCoverAcceptGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Pre Invoice Management",
          "visibility": false,
          "module": [
            {
              "modulename": "Credit Approval",
              "programURL": "/Application/iCABSACreditApprovalGrid.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Invoice Changes",
              "programURL": "/Application/iCABSAInvoiceDetailsMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Invoice Group",
              "programURL": "/Application/iCABSAInvoiceGroupMaintenance.htm",
              "routeURL": "/billtocash/maintenance/invoicegroup/search",
              "visibility": false
            },
            {
              "modulename": "Invoice Group/Premises",
              "programURL": "/Application/iCABSAInvoiceGroupPaymentMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Invoice Group Payment",
              "programURL": "/Application/iCABSAInvoiceGroupPremiseMaintenance.htm",
              "routeURL": "sales/invoicepremisegroup/search",
              "visibility": false
            },
            {
              "modulename": "Tax Reg.  Maintenance",
              "programURL": "/Application/iCABSATaxRegistrationChange.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Job Release for Invoice",
          "visibility": false,
          "module": [
            {
              "modulename": "Employee",
              "programURL": "/Application/iCABSReleaseForInvoiceGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Portfolio",
          "visibility": false,
          "module": [
            {
              "modulename": "Actual Vs Contractual - Branch",
              "programURL": "/ApplicationReport/iCABSSeActualVsContractualBranch.htm",
              "routeURL": "/billtocash/actualvscontractualbranch",
              "visibility": false
            },
            {
              "modulename": "Actual Vs Contractual - Business",
              "programURL": "/ApplicationReport/iCABSSeActualVsContractualBranch.htm",
              "routeURL": "/billtocash/actualvscontractualbusiness",
              "visibility": false
            },
            {
              "modulename": "Actual Vs Contractual - Region",
              "programURL": "/ApplicationReport/iCABSSeActualVsContractualBranch.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "General Selection",
              "programURL": "/Application/iCABSAPortfolioGeneralMaintenance.htm",
              "routeURL": "/billtocash/portfolio/generalMaintenance",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "EXTRANETS/CONNECT",
      "id": "Extranets",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Table Maintainance- Business",
          "visibility": false,
          "module": [
            {
              "modulename": "Detector",
              "programURL": "/Business/iCABSBDetectorMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "PEOPLE",
      "id": "People",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Table Maintainance- Business",
          "visibility": false,
          "module": [
            {
              "modulename": "Employee Number Change",
              "programURL": "/Application/iCABSAChangeEmployeeNumber.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Employee",
              "programURL": "/Business/iCABSBEmployeeMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Exports",
          "visibility": false,
          "module": [
            {
              "modulename": "Employee Export - Branch",
              "programURL": "/ApplicationReport/iCABSAREmployeeExportGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "IT FUNCTIONS",
      "id": "ITFunctions",
      "alwaysdisplay": false,
      "visibility": false,
      "feature": [
        {
          "featurename": "Configuration",
          "visibility": false,
          "module": [
            {
              "modulename": "Business Registry",
              "programURL": "/Business/iCABSBBusinessRegistryGrid.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Maintenance",
          "visibility": false,
          "module": [
            {
              "modulename": "User Search ",
              "programURL": "/Model/riMUserSearch.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Translation ",
              "programURL": "/Model/riMGTranslationMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "User Type Menu Access ",
              "programURL": "/Model/riMUserTypeMenuAccessMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Program Schedule ",
              "programURL": "/Model/riMBatchProgramScheduleMaintenance.htm",
              "routeURL": "sales/batchProgramSchedule",
              "visibility": false
            },
            {
              "modulename": "Maintain Parameters ",
              "programURL": "/System/iCABSSSystemParameterMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Operations",
          "visibility": false,
          "module": [
            {
              "modulename": "Batch Processes",
              "programURL": "/Operations/iCABSOBatchProcessMonitorSearch.htm",
              "routeURL": "/itfunctions/batchprocess/monitor/search",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Registry",
          "visibility": false,
          "module": [
            {
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
              "modulename": "Electrontic Invoice Delivery",
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
            },
            {
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
            },
            {
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
        },
        {
          "featurename": "Select Access",
          "visibility": false,
          "module": [
            {
              "modulename": "Branch",
              "programURL": "/Business/iCABSBUserAuthorityBranchSearch.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Business ",
              "programURL": "/Business/iCABSBUserAuthoritySearch.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenance -Business",
          "visibility": false,
          "module": [
            {
              "modulename": "Branch",
              "programURL": "/Business/iCABSBBranchMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Company ",
              "programURL": "/Business/iCABSBCompanyMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "User Authority ",
              "programURL": "/Business/iCABSBUserAuthorityMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Table Maintenance -System",
          "visibility": false,
          "module": [
            {
              "modulename": "Business",
              "programURL": "/System/iCABSSBusinessMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "User ",
              "programURL": "/Model/riMUserInformationMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "User Type",
              "programURL": "/Model/riMUserTypeMaintenance.htm",
              "routeURL": "",
              "visibility": false
            },
            {
              "modulename": "Maintain Batch Program",
              "programURL": "/Model/riMGBatchProgramMaintenance.htm",
              "routeURL": "/itfunctions/batchprogram/maintenance",
              "visibility": false
            },
            {
              "modulename": "Business System Chars ",
              "programURL": "/System/iCABSSBusinessSystemCharacteristicsCustomMaintenance.htm",
              "routeURL": "/itfunctions/batchprocess/syscharmonitor",
              "visibility": false
            },
            {
              "modulename": "System Characterstics ",
              "programURL": "/System/iCABSSSystemCharacteristicsMaintenance.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        },
        {
          "featurename": "Tools",
          "visibility": false,
          "module": [
            {
              "modulename": "Batch Process Monitor",
              "programURL": "/Model/riMBatchProcessMonitorSearch.htm",
              "routeURL": "/itfunctions/batchprocess/monitor",
              "visibility": false
            },
            {
              "modulename": "Report Process View",
              "programURL": "/Model/riMReportViewerSearch.htm",
              "routeURL": "",
              "visibility": false
            }
          ]
        }
      ]
    },
    {
      "domainname": "DASHBOARD",
      "id": "Dashboard",
      "alwaysdisplay": true,
      "visibility": false,
      "feature": [
        {
          "featurename": "Dashboard",
          "visibility": false,
          "module": [
            {
              "modulename": "Entire dashboard",
              "programURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d",
              "routeURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d",
              "visibility": false
            },
            {
              "modulename": "Service drill-down map",
              "programURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d/sheet/GDWLnh/state/analysis",
              "routeURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d/sheet/GDWLnh/state/analysis",
              "visibility": false
            },
            {
              "modulename": "Routes map",
              "programURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d/sheet/GWdvdM/state/analysis",
              "routeURL": "https://connect-reporting-staging.rentokil-initial.com/sense/app/7d34af92-e7c6-4c4b-a245-2f5776abc95d/sheet/GWdvdM/state/analysis",
              "visibility": false
            }
          ]
        }
      ]
    }

  ]
}`;
