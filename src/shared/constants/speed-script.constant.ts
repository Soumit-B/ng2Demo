import { Injectable } from '@angular/core';

@Injectable()
export class SpeedScriptConstants {

    public ContactDefinitions: number;
    /* The Portfolio Levels That Contacts Are Stored At */

    public CNFPortfolioLevelGroupAccount: string;
    public CNFPortfolioLevelAccount: string;

    /* Please Note: CNFPortfolioLevelIGAll is only used when running from invoicegroupmaintenance to inform all procedures that we are looking at invoicegroup. It Is NOT Used To Within The Database Records. InvoiceGroup
     related contacts are stored as CNFPortfolioLevelIGStatement and/or  CNFPortfolioLevelIGInvoice */

    public CNFPortfolioLevelIGAll: string;
    public CNFPortfolioLevelIGStatement: string;
    public CNFPortfolioLevelIGInvoice: string;
    public CNFPortfolioLevelContract: string;
    public CNFPortfolioLevelPremise: string;

    /* The ContactPersonRole Which Is Deemed To Be The Primary Contact */
    public CNFContactPersonRolePrimary: number;

    /* Registry Related */
    public CNFContactPersonRegSection: string;
    public CNFContactPersonRegCCentreAmendment: string;
    public CNFContactPersonRegMandatoryPosition: string;
    public CNFContactPersonRegMandatoryTelephone: string;
    public CNFContactPersonRegValidateTelephone: string;
    public CNFContactPersonRegValidateMobile: string;
    public CNFContactPersonRegValidateEmail: string;
    public CNFContactPersonRegValidateFax: string;
    public CNFContactPersonRegNewDefaultPosn: string;
    public CNFContactPersonRegBatchPrimContLimit: string;
    public CNFContactPersonRegNewAutoCreateRole: string;
    public CNFContactPersonRegMaxReadContracts: string;
    public CNFContactPersonRegMaxReadPremises: string;
    public CNFContactPersonRegWhenLastRoleCreate: string;

    /* Used Within Batch Process */
    public CNFContactPersonDetailsChanges: string;
    public CNFContactPersonPrimaryRoleChange: string;

    /* Used Within iCABSProcessContactPersonChang.p */
    public CNFContactPersonNameMatchMaxCount: number;

    /* Used Within iCABSPlannerStatusDesc.i */
    public PLANNERSTATUS_00: string;
    public PLANNERSTATUS_01: string;
    public PLANNERSTATUS_02: string;
    public PLANNERSTATUS_03: string;
    public PLANNERSTATUS_04: string;
    public PLANNERSTATUS_05: string;
    public PLANNERSTATUS_06: string;
    public PLANNERSTATUS_07: string;
    public PLANNERSTATUS_08: string;
    public PLANNERSTATUS_09: string;
    public PLANNERSTATUS_10: string;
    public PLANNERSTATUS_11: string;
    public PLANNERSTATUS_12: string;
    public PLANNERSTATUS_13: string;
    public PLANNERSTATUS_14: string;

    /* Used Within ICABSWOTYPEDEFINITIONS.i */
    public WOTypeURLWOMaint: string;
    public WOTypeURLAccountMaint: string;
    public WOTypeURLInvoiceHistory: string;
    public WOTypeURLCampaign: string;
    public WOTypeURLContractMaint: string;
    public WOTypeURLPremiseMaint: string;
    public WOTypeURLProspectMaint: string;
    public WOTypeURLContactCentreSearch: string;
    public WOTypeURLContactCentreReview: string;
    public WOTypeURLDiary: string;
    public WOTypeURLDiaryDay: string;
    public WOTypeURLTelesales: string;
    public WOTypeURLStockGrid: string;

    constructor() {

        this.ContactDefinitions = 1;
        this.CNFPortfolioLevelGroupAccount = 'GROUPACCT';
        this.CNFPortfolioLevelAccount = 'ACCOUNT';

        this.CNFPortfolioLevelIGAll = 'IGRP-ALL';
        this.CNFPortfolioLevelIGStatement = 'IGRP-STAT';
        this.CNFPortfolioLevelIGInvoice = 'IGRP-INV';
        this.CNFPortfolioLevelContract = 'CONTRACT';
        this.CNFPortfolioLevelPremise = 'PREMISE';
        this.CNFContactPersonRolePrimary = 1;

        this.CNFContactPersonRegSection = 'Contact Person';
        this.CNFContactPersonRegCCentreAmendment = 'Contact Centre - Add/Amend - ContactType/Detail';
        this.CNFContactPersonRegMandatoryPosition = 'Contact Person Entry - Mandatory ContactPosition';
        this.CNFContactPersonRegMandatoryTelephone = 'Contact Person Entry - Mandatory ContactTelephone';
        this.CNFContactPersonRegValidateTelephone = 'Contact Person Entry - Validate ContactTelephone';
        this.CNFContactPersonRegValidateMobile = 'Contact Person Entry - Validate ContactMobile';
        this.CNFContactPersonRegValidateEmail = 'Contact Person Entry - Validate ContactEmail';
        this.CNFContactPersonRegValidateFax = 'Contact Person Entry - Validate ContactFax';
        this.CNFContactPersonRegNewDefaultPosn = 'Contact Person Entry - Add - Default Position';
        this.CNFContactPersonRegBatchPrimContLimit = 'Use Batch Update When Relationship Exceeds';
        this.CNFContactPersonRegNewAutoCreateRole = 'Contact Person Entry - Add - Auto Create Role';
        this.CNFContactPersonRegMaxReadContracts = 'Maximum Records Contract - Contacts From Account';
        this.CNFContactPersonRegMaxReadPremises = 'Maximum Records Premise - Contacts From Contract';
        this.CNFContactPersonRegWhenLastRoleCreate = 'Contact Person Entry - Delete Of Last Role - CreateRole';

        this.CNFContactPersonDetailsChanges = 'ContactDetailsChange';
        this.CNFContactPersonPrimaryRoleChange = 'ContactPrimaryRoleChange';

        this.CNFContactPersonNameMatchMaxCount = 200;

        this.PLANNERSTATUS_10 = 'Administrator';
        this.PLANNERSTATUS_09 = 'Administrator - Problem';
        this.PLANNERSTATUS_08 = 'Technician';
        this.PLANNERSTATUS_07 = 'Technician - Problem';
        this.PLANNERSTATUS_06 = 'Strategic';
        this.PLANNERSTATUS_05 = 'Strategic - Problem';
        this.PLANNERSTATUS_04 = 'Tactical';
        this.PLANNERSTATUS_03 = 'Tactical - Problem';
        this.PLANNERSTATUS_02 = 'Daily';
        this.PLANNERSTATUS_01 = 'Daily - Problem';
        this.PLANNERSTATUS_00 = 'Unplanned';
        this.PLANNERSTATUS_11 = 'Planned - Unconfirmed';
        this.PLANNERSTATUS_12 = 'Planned - Problem';
        this.PLANNERSTATUS_13 = 'Service+ Planning';
        this.PLANNERSTATUS_14 = 'Service+ Planning - Problems';

        this.WOTypeURLWOMaint = 'WorkOrderMaint';
        this.WOTypeURLAccountMaint = 'AccountMaint';
        this.WOTypeURLInvoiceHistory = 'InvoiceHistory';
        this.WOTypeURLCampaign = 'Campaign';
        this.WOTypeURLContractMaint = 'ContractMaint';
        this.WOTypeURLPremiseMaint = 'PremiseMaint';
        this.WOTypeURLProspectMaint = 'ProspectMaint';
        this.WOTypeURLContactCentreSearch = 'CCentreSearch';
        this.WOTypeURLContactCentreReview = 'CCentreReview';
        this.WOTypeURLDiary = 'Diary';
        this.WOTypeURLDiaryDay = 'DiaryDay';
        this.WOTypeURLTelesales = 'Telesales';
        this.WOTypeURLStockGrid = 'StockGrid';
    }
}
