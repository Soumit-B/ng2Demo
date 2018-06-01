import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ServiceCoverMaintenanceComponent } from './iCABSAServiceCoverMaintenance.component';

export class ServiceCoverMaintenanceVTs {

    private context: ServiceCoverMaintenanceComponent;

    constructor(private parent: ServiceCoverMaintenanceComponent) {
        this.context = parent;
    }

    public callVTBranchServiceAreaCode(): void {
        this.context.riMaintenance.AddVirtualTable('BranchServiceArea');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('BranchNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateReadOnly, '', '', 'ServiceBranchNumber', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('BranchServiceAreaCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('BranchServiceAreaDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTServiceSalesEmployee(): void {
        this.context.riMaintenance.AddVirtualTable('Employee', 'Employee01');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceSalesEmployee', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTLeadEmployee(): void {
        this.context.riMaintenance.AddVirtualTable('Employee', 'LeadEmployee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'LeadEmployee', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'LeadEmployeeSurname');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTServiceEmployeeCode(): void {
        this.context.riMaintenance.AddVirtualTable('Employee', 'ServiceEmployee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceEmployeeCode', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'ServiceEmployeeSurname');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTWasteTransferTypeCode(): void {
        this.context.riMaintenance.AddVirtualTable('WasteTransferType');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('WasteTransferTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'WasteTransferTypeCode', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('WasteTransferTypeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTInstallationEmployeeCode(): void {
        this.context.riMaintenance.AddVirtualTable('Employee', 'InstallationEmployee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'InstallationEmployeeCode', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'InstallationEmployeeName');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTRemovalEmployeeCode(): void {
        this.context.riMaintenance.AddVirtualTable('Employee', 'RemovalEmployee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'RemovalEmployeeCode', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'RemovalEmployeeName');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTServiceTypeCode(): void {
        this.context.riMaintenance.AddVirtualTable('ServiceType');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('ServiceTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('ServiceTypeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTBusinessOriginCode(): void {
        this.context.riMaintenance.AddVirtualTable('BusinessOrigin');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('BusinessOriginCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('LeadInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('DetailRequiredInd', MntConst.eTypeCheckBox, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTBusinessOriginDetailCode(): void {
        this.context.riMaintenance.AddVirtualTable('BusinessOriginDetailLang');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('BusinessOriginCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('BusinessOriginDetailCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('BusinessOriginDetailDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTEntitlementInvoiceTypeCode(): void {
        this.context.riMaintenance.AddVirtualTable('EntitlementInvoiceType');
        this.context.riMaintenance.AddVirtualTableKey('EntitlementInvoiceTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('EntitlementInvoiceTypeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTLostBusinessCode(): void {
        this.context.riMaintenance.AddVirtualTable('LostBusinessLang');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('LostBusinessCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('LostBusinessDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTLostBusinessDetailCode(): void {
        this.context.riMaintenance.AddVirtualTable('LostBusinessDetailLang');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('LostBusinessCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('LostBusinessDetailCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('LostBusinessDetailDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTAPICode(): void {
        this.context.riMaintenance.AddVirtualTable('APICode');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('APICode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('APICodeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
            if (this.context.fieldHasValue('APICode') && !this.context.fieldHasValue('APICodeDesc')) {
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'APICode');
            }
        });
    }

    public callVTDepotNumber(): void {
        this.context.riMaintenance.AddVirtualTable('Depot');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('DepotNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('DepotName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTTaxCodeMaterials(): void {
        this.context.riMaintenance.AddVirtualTable('TaxCode', 'TaxCodeMaterials');
        this.context.riMaintenance.AddVirtualTableKey('TaxCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'TaxCodeMaterials', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('TaxCodeDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual', 'TaxCodeMaterialsDesc');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTTaxCodeLabour(): void {
        this.context.riMaintenance.AddVirtualTable('TaxCode', 'TaxCodeLabour');
        this.context.riMaintenance.AddVirtualTableKey('TaxCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'TaxCodeLabour', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('TaxCodeDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual', 'TaxCodeLabourDesc');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTTaxCodeReplacement(): void {
        this.context.riMaintenance.AddVirtualTable('TaxCode', 'TaxCodeReplacement');
        this.context.riMaintenance.AddVirtualTableKey('TaxCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'TaxCodeReplacement', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('TaxCodeDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual', 'TaxCodeReplacementDesc');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTDOWProductCode(): void {
        this.context.riMaintenance.AddVirtualTable('DOWProduct');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('DOWProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('DOWProductDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTDOWInstallTypeCode(): void {
        this.context.riMaintenance.AddVirtualTable('DOWInstallType');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('DOWInstallTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('DOWInstallTypeDesc', MntConst.eTypeTextFree, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTNoGuaranteeCode(): void {
        this.context.riMaintenance.AddVirtualTable('PropertyNoGuarantee');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('NoGuaranteeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('NoGuaranteeDescription', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTListedCode(): void {
        this.context.riMaintenance.AddVirtualTable('PropertyListedBuilding');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('ListedCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('ListedDescription', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
            if (this.context.fieldHasValue('ListedCode') && !this.context.fieldHasValue('ListedDescription')) {
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'ListedCode');
            }
        });
    }

    public callVTMatchedContractNumber(): void {
        this.context.riMaintenance.AddVirtualTable('Contract', 'MatchedContract');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'MatchedContractNumber', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'MatchedContractName');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTMatchedPremiseNumber(): void {
        this.context.riMaintenance.AddVirtualTable('Premise', 'MatchedPremise');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'MatchedContractNumber', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', 'MatchedPremiseNumber', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual', 'MatchedPremiseName');
        this.context.riMaintenance.AddVirtualTableCommit(this.context);
    }

    public callVTRMMCategoryCode(): void {
        this.context.riMaintenance.AddVirtualTable('RMMCategoryLang');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('RMMCategoryCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.context.riExchange.LanguageCode(), '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('RMMCategoryDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
            if (this.context.fieldHasValue('RMMCategoryCode') && !this.context.fieldHasValue('RMMCategoryDesc')) {
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'RMMCategoryCode');
            }
        });
    }

    public callVTSeasonalTemplateNumber(): void {
        this.context.riMaintenance.AddVirtualTable('SeasonalTemplate');
        this.context.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.context.riMaintenance.AddVirtualTableKey('SeasonalTemplateNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.context.riMaintenance.AddVirtualTableField('TemplateName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.context.riMaintenance.AddVirtualTableCommit(this.context, function (data: any): any {
            if (this.context.fieldHasValue('SeasonalTemplateNumber') && !this.context.fieldHasValue('TemplateName')) {
                this.context.riExchange.riInputElement.markAsError(this.context.uiForm, 'SeasonalTemplateNumber');
            } else {
                this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
            }
        });
    }

}
