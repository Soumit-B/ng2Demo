import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ServiceCoverMaintenanceComponent } from './iCABSAServiceCoverMaintenance.component';

export class ServiceCoverMaintenanceLoadVTs {

    private context: ServiceCoverMaintenanceComponent;

    constructor(private parent: ServiceCoverMaintenanceComponent) {
        this.context = parent;
    }

    public LoadVirtualTables(): void {
        /************************************************************************************
         * Add Virtual Tables                                                               *
         ************************************************************************************/

        if (this.context.parentMode === 'Search' || this.context.parentMode === 'SearchAdd'
            || this.context.parentMode === 'ContactAdd'
            || this.context.parentMode === 'Premise-Add'
            || this.context.parentMode === 'ContactUpdate') {

            this.context.riMaintenance.AddVirtualTable('Contract');
            this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('AccountNumber', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('TrialPeriodInd', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual', 'ContractTrialPeriodInd');
            this.context.riMaintenance.AddVirtualJoin('Account', MntConst.eVirtualJoinTypeInner, 'Account.BusinessCode=Contract.BusinessCode and Account.AccountNumber=Contract.Accountnumber');
            this.context.riMaintenance.AddVirtualJoinField('NationalAccount', MntConst.eTypeCheckBox, MntConst.eVirtualFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddVirtualJoinCommit(this.context);
            this.context.riMaintenance.AddVirtualTableCommit(this.context);

        } else {

            this.context.riMaintenance.AddVirtualTable('Contract');
            this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('AccountNumber', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
            //this.context.riMaintenance.AddVirtualTableField('TrialPeriodInd',MntConst.eTypeText,MntConst.eVirtualFieldStateFixed,'Virtual');
            this.context.riMaintenance.AddVirtualTableField('TrialPeriodInd', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual', 'ContractTrialPeriodInd');
            this.context.riMaintenance.AddVirtualJoin('Account', MntConst.eVirtualJoinTypeInner, 'Account.BusinessCode=Contract.BusinessCode and Account.AccountNumber=Contract.Accountnumber');
            this.context.riMaintenance.AddVirtualJoinField('NationalAccount', MntConst.eTypeCheckBox, MntConst.eVirtualFieldStateReadOnly, 'ReadOnly');
            this.context.riMaintenance.AddVirtualJoinCommit(this.context);
            this.context.riMaintenance.AddVirtualTableCommit(this.context);

        }


        if (this.context.parentMode === 'Search'
            || this.context.parentMode === 'SearchAdd'
            || this.context.parentMode === 'Premise-Add') {

            this.context.riMaintenance.AddVirtualTable('Premise');
            this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('PNOL', MntConst.eTypeCheckBox, MntConst.eVirtualFieldStateFixed, 'Virtual');
            this.context.riMaintenance.AddVirtualTableCommit(this.context);

        } else {

            this.context.riMaintenance.AddVirtualTable('Premise');
            this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('PNOL', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.context.riMaintenance.AddVirtualTableCommit(this.context);

        }

        this.context.riMaintenance.AddVirtualTable('Product');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('RequireAnnualTimeInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('DispenserInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('ConsumableInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('DisplayLevelInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('InvoiceSuspendInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual', 'DeliveryConfirmationInd');
        this.context.riMaintenance.AddVirtualTableField('InitialInvoicePeriodInYears', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('LocationsEnabled', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('ValueRequiredInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('InvoiceUnitValueRequired', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('CapableOfUplift', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
            this.context.linkedServiceCoverSearchParams.DispenserInd = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DispenserInd');
            this.context.linkedServiceCoverSearchParams.ConsumableInd = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ConsumableInd');
        });


        this.context.riMaintenance.AddVirtualTable('Product', 'LinkedProduct');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'LinkedProductCode', 'Key');
        this.context.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateReadOnly, 'Virtual', 'LinkedProductDesc');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('Branch');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('BranchNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceBranchNumber', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('BranchName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('BranchServiceArea');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('BranchNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateReadOnly, '', '', 'ServiceBranchNumber', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('BranchServiceAreaCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('BranchServiceAreaDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('Employee', 'Employee01');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceSalesEmployee', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('Employee', 'LeadEmployee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'LeadEmployee', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'LeadEmployeeSurname');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('Employee', 'ServiceEmployee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceEmployeeCode', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'ServiceEmployeeSurname');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('WasteTransferType');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('WasteTransferTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'WasteTransferTypeCode', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('WasteTransferTypeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('Employee', 'InstallationEmployee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'InstallationEmployeeCode', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'InstallationEmployeeName');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('Employee', 'RemovalEmployee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'RemovalEmployeeCode', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'RemovalEmployeeName');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('ServiceType');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('ServiceTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('ServiceTypeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('BusinessOrigin');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('BusinessOriginCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('LeadInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('DetailRequiredInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('BusinessOriginLang');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('BusinessOriginCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('BusinessOriginDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
            this.context.setBusinessOriginDropDownValue();
        });

        this.context.riMaintenance.AddVirtualTable('BusinessOriginDetailLang');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('BusinessOriginCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('BusinessOriginDetailCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('BusinessOriginDetailDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('SeasonalTemplate');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('SeasonalTemplateNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('TemplateName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        if (this.context.pageParams.vbEnableEntitlement && this.context.pageParams.CurrentContractType === 'C') {
            this.context.riMaintenance.AddVirtualTable('EntitlementInvoiceType');
            this.context.riMaintenance.AddVirtualTableKey('EntitlementInvoiceTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('EntitlementInvoiceTypeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.context.riMaintenance.AddVirtualTableCommit(this.context);
        }

        if (this.context.riExchange.URLParameterContains('PendingReduction') || this.context.riExchange.URLParameterContains('PendingDeletion')) {
            this.context.riMaintenance.AddVirtualTable('LostBusinessLang');
            this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.AddVirtualTableKey('LostBusinessCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('LostBusinessDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
                this.context.setDropDownComponentValue('LostBusinessCode', 'LostBusinessDesc');
            });

            this.context.riMaintenance.AddVirtualTable('LostBusinessDetailLang');
            this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.AddVirtualTableKey('LostBusinessCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableKey('LostBusinessDetailCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('LostBusinessDetailDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
                this.context.setDropDownComponentValue('LostBusinessDetailCode', 'LostBusinessDetailDesc');
            });
        }

        //MSA - 23/10/2007 - Service Cover API Code;
        this.context.riMaintenance.AddVirtualTable('APICode');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('APICode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('APICodeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('PreferredDayOfWeekReasonLang');
        this.context.riMaintenance.AddVirtualTableKey('PreferredDayOfWeekReasonCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('PreferredDayOfWeekReasonLangDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('Depot');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('DepotNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('DepotName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('TaxCode', 'TaxCodeMaterials');
        this.context.riMaintenance.AddVirtualTableKey('TaxCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'TaxCodeMaterials', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('TaxCodeDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual', 'TaxCodeMaterialsDesc');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('TaxCode', 'TaxCodeLabour');
        this.context.riMaintenance.AddVirtualTableKey('TaxCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'TaxCodeLabour', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('TaxCodeDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual', 'TaxCodeLabourDesc');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        this.context.riMaintenance.AddVirtualTable('TaxCode', 'TaxCodeReplacement');
        this.context.riMaintenance.AddVirtualTableKey('TaxCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'TaxCodeReplacement', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('TaxCodeDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual', 'TaxCodeReplacementDesc');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        if (this.context.pageParams.blnEnableDOWSentricon && this.context.pageParams.currentContractType !== 'P') {
            this.context.riMaintenance.AddVirtualTable('DOWProduct');
            this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.AddVirtualTableKey('DOWProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('DOWProductDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual');
            this.context.riMaintenance.AddVirtualTableCommit(this.context);

            this.context.riMaintenance.AddVirtualTable('DOWInstallType');
            this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.context.riMaintenance.AddVirtualTableKey('DOWInstallTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.context.riMaintenance.AddVirtualTableField('DOWInstallTypeDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual');
            this.context.riMaintenance.AddVirtualTableCommit(this.context);
        }
        this.context.riMaintenance.AddVirtualTable('PropertyNoGuarantee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('NoGuaranteeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('NoGuaranteeDescription', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
            this.context.setDropDownComponentValue('NoGuaranteeCode', 'NoGuaranteeDescription');
        });

        this.context.riMaintenance.AddVirtualTable('PropertyListedBuilding');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('ListedCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('ListedDescription', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);

        if (this.context.pageParams.vSCRepeatSalesMatching) {
            if (this.context.getControlValue('MatchedContractNumber')) {
                this.context.riMaintenance.AddVirtualTable('Contract', 'MatchedContract');
                this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.context.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'MatchedContractNumber', 'Virtual');
                this.context.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'MatchedContractName');
                this.context.riMaintenance.AddVirtualTableCommit(this.context);
            }

            if (this.context.getControlValue('MatchedPremiseNumber')) {
                this.context.riMaintenance.AddVirtualTable('Premise', 'MatchedPremise');
                this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.context.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'MatchedContractNumber', 'Virtual');
                this.context.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', 'MatchedPremiseNumber', 'Virtual');
                this.context.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual', 'MatchedPremiseName');
                this.context.riMaintenance.AddVirtualTableCommit(this.context);
            }
        }
        this.context.riMaintenance.AddVirtualTable('RMMCategoryLang');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('RMMCategoryCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('RMMCategoryDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
            this.context.inputParamsContractSearch.accountNumber = this.context.getControlValue('AccountNumber');
            this.context.setDropDownComponentValue('RMMCategoryCode', 'RMMCategoryDesc');
            this.context.setDropDownComponentValue('ServiceTypeCode', 'ServiceTypeDesc');
            this.context.setDropDownComponentValue('PreferredDayOfWeekReasonCode', 'PreferredDayOfWeekReasonLangDesc');
            this.context.iCABSAServiceCoverMaintenanceLoad.load1();
        });
        //this.context.iCABSAServiceCoverMaintenanceLoad.load1();
    }

}
