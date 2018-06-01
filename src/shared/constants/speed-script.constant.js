import { Injectable } from '@angular/core';
export var SpeedScriptConstants = (function () {
    function SpeedScriptConstants() {
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
    }
    SpeedScriptConstants.decorators = [
        { type: Injectable },
    ];
    SpeedScriptConstants.ctorParameters = [];
    return SpeedScriptConstants;
}());
