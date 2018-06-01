import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ProductSearchGridComponent } from './../../search/iCABSBProductSearch';
import { ProductSalesGroupSearchComponent } from './../../search/iCABSBProductSalesGroupSearch.component';
import { TaxCodeSearchComponent } from './../../search/iCABSSTaxCodeSearch.component';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';

export class ProductMaintenanceUiControls {
    public controls: Array<any> = [
        { name: 'Product' },
        { name: 'ProductCode', required: true, disabled: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductSaleGroupCode', required: true, disabled: true, type: MntConst.eTypeCode },
        { name: 'ProductSaleGroupDesc', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductServiceGroupCode', required: true, disabled: true, type: MntConst.eTypeCode },
        { name: 'ProductServiceGroupDesc', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'LOSCode', required: true, disabled: true, type: MntConst.eTypeCode },
        { name: 'LOSName', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'FrequencyRequiredInd', required: false, disabled: true },
        { name: 'ValidForNewInd', required: false, disabled: true },
        { name: 'MaintenanceInd', required: false, disabled: true },
        { name: 'ValueRequiredInd', required: false, disabled: true },
        { name: 'PassToPDAInd', required: false, disabled: true },
        { name: 'EmailOrderInd', required: false, disabled: true },
        { name: 'QuantityRequired', required: false, disabled: true },
        { name: 'ReplacementMonthRequiredInd', required: false, disabled: true },
        { name: 'DispenserInd', required: false, disabled: true },
        { name: 'ValidForEntitlementInd', required: false, disabled: true },
        { name: 'ConsumableInd', required: false, disabled: true },
        { name: 'StockItem', required: false, disabled: true },
        { name: 'ThirdPartyServiceInd', required: false, disabled: true },
        { name: 'InvoiceSuspendInd', required: false, disabled: true },
        { name: 'SOSExemptInd', required: false, disabled: true },
        { name: 'EngineerRequiredInd', required: false, disabled: true },
        { name: 'InstallationRequired', required: false, disabled: true },
        { name: 'HideQuantityOnInvoice', required: false, disabled: true },
        { name: 'RetainServiceCoverInd', required: false, disabled: true },
        { name: 'DetailRequired', required: false, disabled: true },
        { name: 'RequiresVisitDetailTextInd', required: false, disabled: true },
        { name: 'InnovationMetricInd', required: false, disabled: true },
        { name: 'RequiresManualVisitPlanningInd', required: false, disabled: true },
        { name: 'WasteTransferRequired', required: false, disabled: true },
        { name: 'RequireAnnualTimeInd', required: false, disabled: true },
        { name: 'CustomerSpecificInd', required: false, disabled: true },
        { name: 'DisplayLevelInd', required: false, disabled: true },
        { name: 'CompositeProductInd', required: false, disabled: true },
        { name: 'SelectCompositePricingType', required: false, disabled: true, type: MntConst.eTypeInteger },
        { name: 'ReplacementInd', required: false, disabled: true },
        { name: 'DummyProductInd', required: false, disabled: true },
        { name: 'ReplacementDefaultInd', required: false, disabled: true },
        { name: 'RoutineLabels', required: false, disabled: true },
        { name: 'RotationalProductInd', required: false, disabled: true },
        { name: 'TermiteRenewalLetterInd', required: false, disabled: true },
        { name: 'PerimeterValueRequired', required: false, disabled: true },
        { name: 'DOWSentriconInd', required: false, disabled: true },
        { name: 'WeighingRequiredInd', required: false, disabled: true },
        { name: 'UsePercentageValuesInd', required: false, disabled: true },
        { name: 'RotationByScheduleInd', required: false, disabled: true, type: MntConst.eTypeCheckBox },
        { name: 'ComponentTypeCode', required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'EDRMCode', required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'GuaranteeRequiredInd', required: false, disabled: true },
        { name: 'GuaranteeCode', required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'GuaranteeDurationMonths', required: false, disabled: true, type: MntConst.eTypeInteger },
        { name: 'LocationsEnabled', required: false, disabled: true },
        { name: 'PrepsEnabled', required: false, disabled: true },
        { name: 'RecordInfestations', required: false, disabled: true },
        { name: 'ZeroQuantityEnabled', required: false, disabled: true },
        { name: 'ProductLinkingEnabled', required: false, disabled: true },
        { name: 'termiteinspectionInd', required: false, disabled: true },
        { name: 'NoScanRequiredInd', required: false, disabled: true },
        { name: 'InvoiceUnitValueRequired', required: false, disabled: true },
        { name: 'BudgetBillingInstalmentCode', required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'BudgetBillingInstalmentDesc', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'CapableOfUplift', required: false, disabled: true },
        { name: 'InstallationValue', required: false, disabled: true, type: MntConst.eTypeCurrency },
        { name: 'InstallTime', required: false, disabled: true, type: MntConst.eTypeTime },
        { name: 'RemovalValue', required: false, disabled: true, type: MntConst.eTypeCurrency },
        { name: 'RemovalTime', required: false, disabled: true, type: MntConst.eTypeTime },
        { name: 'CostPrice', required: false, disabled: true, type: MntConst.eTypeCurrency },
        { name: 'ListPrice', required: false, disabled: true, type: MntConst.eTypeCurrency },
        { name: 'ServiceTime', required: false, disabled: true, type: MntConst.eTypeTime },
        { name: 'WeightFactor', required: false, disabled: true, type: MntConst.eTypeCurrency },
        { name: 'AverageWeight', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'ProductChargeType', required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'ProductChargeDesc', required: false, disabled: true, type: MntConst.eTypeTextFree },
        { name: 'ProductChargeQuantity', required: false, disabled: true, type: MntConst.eTypeInteger },
        { name: 'ProductPriceGroupCode', required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'ProductPriceGroupDesc', required: false, disabled: true, type: MntConst.eTypeTextFree },
        { name: 'CapacityFactor', required: false, disabled: true, type: MntConst.eTypeInteger },
        { name: 'ServiceType', required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'ReplacementCost', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'ReplacementValue', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'DepreciationPeriod', required: false, disabled: true, type: MntConst.eTypeInteger },
        { name: 'MaxUnitsPerTrip', required: false, disabled: true, type: MntConst.eTypeInteger },
        { name: 'DefaultVisitFrequency', required: false, disabled: true, type: MntConst.eTypeInteger },
        { name: 'CapitalRecoveryValue', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'PrepUsageValue', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'LabourValuePerc', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'MaterialsValuePerc', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'ReplacementValuePerc', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'MaterialSharePercentage', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'WasteTransferChargeValue', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'MultipleTaxRates', required: false, disabled: true },
        { name: 'TaxCode', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'TaxCodeDesc', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'UnitDesc', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ConsolidateEqualTaxRates', required: false, disabled: true },
        { name: 'RotationalRule', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'APICode', required: true, disabled: true, type: MntConst.eTypeCode },
        { name: 'APICodeDesc', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductInvoiceDesc', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'TaxCodeMaterials', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'TaxCodeMaterialsDesc', required: false, disabled: true },
        { name: 'InvoiceTextMaterials', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProcurementURL', required: false, disabled: true, type: MntConst.eTypeTextFree },
        { name: 'ProductEmail', required: false, disabled: true, type: MntConst.eTypeTextFree },
        { name: 'ProductImage', required: false, disabled: true, type: MntConst.eTypeTextFree },
        { name: 'TaxCodeLabour', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'TaxCodeLabourDesc', required: false, disabled: true },
        { name: 'InvoiceTextLabour', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'PricingModel', required: false, disabled: true, type: MntConst.eTypeTextFree },
        { name: 'LongDescription', required: false, disabled: true, type: MntConst.eTypeTextFree },
        { name: 'TaxCodeReplacement', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'TaxCodeReplacementDesc', required: false, disabled: true },
        { name: 'InvoiceTextReplacement', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductRange', required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'RangeDesc', required: false, disabled: true, type: MntConst.eTypeTextFree },
        { name: 'ProductDisplayCode', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'InitialInvoicePeriodInYears', required: false, disabled: true, type: MntConst.eTypeInteger },
        { name: 'CombineInvoiceValueInd', required: false, disabled: true },
        { name: 'CombineInvoiceValueDesc', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductCategoryCode', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductCategoryDesc', required: false, disabled: true },
        { name: 'ProductBusinessLineCode', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductBusinessLineDesc', required: false, disabled: true },
        { name: 'ProductHierarchyServiceGroupCode', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductHierarchyServiceGroupDesc', required: false, disabled: true },
        { name: 'ProductSubGroupCode', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductSubGroupDesc', required: false, disabled: true },
        { name: 'ProductProductUsageCode', required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProductProductUsageDesc', required: false, disabled: true },
        { name: 'TelesalesInd', required: false, disabled: true },
        { name: 'UnitPrice', required: false, disabled: true, type: MntConst.eTypeCurrency },
        { name: 'TelesalesMinimumQuantity', required: false, disabled: true, type: MntConst.eTypeInteger },
        { name: 'TelesalesAllowDiscountInd', required: false, disabled: true },
        { name: 'TelesalesMaxDiscountPercAllowed', required: false, disabled: true, type: MntConst.eTypeDecimal2 },
        { name: 'ServiceTypeCode', required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'ServiceTypeDesc', required: false, disabled: true, type: MntConst.eTypeTextFree },
        // Hidden
        { name: 'CompositePricingType', type: MntConst.eTypeInteger },
        { name: 'ProductInUse', type: MntConst.eTypeInteger },
        { name: 'FieldListToDisable', type: MntConst.eTypeInteger },
        { name: 'ReadOnlyMode', type: MntConst.eTypeInteger },
        { name: 'ProductCategoryCode', type: MntConst.eTypeInteger },
        { name: 'ProductBusinessLineCode', type: MntConst.eTypeInteger },
        { name: 'ProductHierarchyServiceGroupCode', type: MntConst.eTypeInteger },
        { name: 'ProductSubGroupCode', type: MntConst.eTypeInteger },
        { name: 'ProductProductUsageCode', type: MntConst.eTypeInteger },
        { name: 'ProductHierarchyID', type: MntConst.eTypeInteger }, // May not be required
        { name: 'SelectedLine', type: MntConst.eTypeInteger },
        { name: 'ProductServiceType', type: MntConst.eTypeInteger },
        { name: 'NoProductServiceType', type: MntConst.eTypeInteger },
        { name: 'NoQuantityTime', type: MntConst.eTypeInteger },
        { name: 'CheckWarning', type: MntConst.eTypeInteger }, // May not be required
        { name: 'SavedCapableOfUplift', type: MntConst.eTypeInteger }
    ];

    public searchConfigs: any = {
        productSearch: {
            params: {
                parentMode: 'LookUp',
                isShowAddNew: true
            },
            component: ProductSearchGridComponent
        },
        productSalesGroupSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUp'
            },
            component: ProductSalesGroupSearchComponent
        },
        productServiceGroupSearch: {
            isDisabled: true,
            isRequired: true,
            isTriggerValidate: false,
            params: {
                parentMode: 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        losSearch: {
            isDisabled: true,
            isRequired: true,
            isTriggerValidate: false,
            params: {
                parentMode: 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        apiCodeSearch: {
            isDisabled: true,
            isRequired: true,
            isTriggerValidate: false,
            params: {
                parentMode: 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        taxCodeSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUp'
            },
            component: TaxCodeSearchComponent
        },
        taxCodeMaterialsSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUpMaterialsTax'
            },
            component: TaxCodeSearchComponent
        },
        taxCodeLabourSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUpLabourTax'
            },
            component: TaxCodeSearchComponent
        },
        taxCodeReplacementSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUpReplacementTax'
            },
            component: TaxCodeSearchComponent
        },
        serviceTypeSearch: {
            isDisabled: false,
            isRequired: false,
            isTriggerValidate: false,
            params: {
                parentMode: 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        // Here till end Not in 577
        propertyGuaranteeSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUp'
            },
            component: ScreenNotReadyComponent
        },
        productPriceGroupSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUp'
            },
            component: ScreenNotReadyComponent
        },
        budgetBillingInstalmentSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUp'
            },
            component: ScreenNotReadyComponent
        },
        componentTypeSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUp'
            },
            component: ScreenNotReadyComponent
        },
        productChargeTypeSearch: {
            isDisabled: true,
            params: {
                parentMode: 'LookUp'
            },
            component: ScreenNotReadyComponent
        },
        rangeHeaderSearch: {
            isDisabled: true,
            params: {
                parentMode: 'ProductSearch'
            },
            component: ScreenNotReadyComponent
        }
    };

    public saveParams: Array<any> = ['ProductCode', 'BusinessCode', 'ProductDesc', 'LOSCode', 'ProductSaleGroupCode', 'ProductServiceGroupCode', 'InstallationValue', 'ValidForNewInd', 'QuantityRequired', 'DispenserInd', 'ConsumableInd', 'ThirdPartyServiceInd', 'FrequencyRequiredInd', 'ValueRequiredInd', 'CostPrice', 'InstallationRequired', 'EngineerRequiredInd', 'WasteTransferRequired', 'DetailRequired', 'ReplacementMonthRequiredInd', 'ValidForEntitlementInd', 'InvoiceSuspendInd', 'MaintenanceInd', 'EmailOrderInd', 'GuaranteeRequiredInd', 'WeightFactor', 'AverageWeight', 'ListPrice', 'ServiceTime', 'InstallTime', 'RemovalTime', 'RemovalValue', 'APICode', 'UnitDesc', 'ProductInvoiceDesc', 'PassToPDAInd', 'ProductChargeType', 'ProductChargeQuantity', 'ProductPriceGroupCode', 'SOSExemptInd', 'HideQuantityOnInvoice', 'ProcurementURL', 'ProductEmail', 'RequireAnnualTimeInd', 'CustomerSpecificInd', 'CompositeProductInd', 'CompositePricingType', 'RetainServiceCoverInd', 'RequiresManualVisitPlanningInd', 'RequiresVisitDetailTextInd', 'InnovationMetricInd', 'WeighingRequiredInd', 'ReplacementDefaultInd', 'ReplacementInd', 'DummyProductInd', 'RoutineLabels', 'ComponentTypeCode', 'GuaranteeCode', 'GuaranteeDurationMonths', 'ReplacementCost', 'ReplacementValue', 'DepreciationPeriod', 'EDRMCode', 'ProductImage', 'DisplayLevelInd', 'PricingModel', 'DefaultVisitFrequency', 'MultipleTaxRates', 'ConsolidateEqualTaxRates', 'TaxCodeMaterials', 'TaxCodeLabour', 'TaxCodeReplacement', 'InvoiceTextMaterials', 'InvoiceTextLabour', 'InvoiceTextReplacement', 'RotationalProductInd', 'RotationByScheduleInd', 'TermiteRenewalLetterInd', 'RotationalRule', 'ProductRange', 'PerimeterValueRequired', 'MaxUnitsPerTrip', 'PrepUsageValue', 'CapitalRecoveryValue', 'LongDescription', 'UsePercentageValuesInd', 'MaterialsValuePerc', 'LabourValuePerc', 'ReplacementValuePerc', 'MaterialSharePercentage', 'WasteTransferChargeValue', 'InitialInvoicePeriodInYears', 'CombineInvoiceValueInd', 'CombineInvoiceValueDesc', 'ProductHierarchyID', 'TelesalesInd', 'UnitPrice', 'TelesalesMinimumQuantity', 'TelesalesAllowDiscountInd', 'TelesalesMaxDiscountPercAllowed', 'ProductDisplayCode', 'BudgetBillingInstalmentCode', 'LocationsEnabled', 'PrepsEnabled', 'RecordInfestations', 'ZeroQuantityEnabled', 'ProductLinkingEnabled', 'termiteinspectionInd', 'NoScanRequiredInd', 'InvoiceUnitValueRequired', 'CapableOfUplift', 'ServiceTypeCode', 'StockItem', 'CapacityFactor', 'ServiceType', 'ReadOnlyMode', 'ProductCategoryCode', 'ProductBusinessLineCode', 'ProductHierarchyServiceGroupCode', 'ProductSubGroupCode', 'ProductProductUsageCode', 'SavedCapableOfUplift'];
}
