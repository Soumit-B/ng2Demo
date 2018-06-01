import { InternalGridSearchModuleRoutes } from './../../../base/PageRoutes';
import { ContractActionTypes } from './../../../actions/contract';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
export var ServiceCoverMaintenance6 = (function () {
    function ServiceCoverMaintenance6(parent, injector) {
        this.parent = parent;
        this.context = parent;
    }
    ServiceCoverMaintenance6.prototype.ServiceQuantity_onchange = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValue') &&
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValue') !== '0') {
                    this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValue();
                }
            }
            else {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange') &&
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange') !== '0') {
                    this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValueChange();
                }
            }
        }
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        this.context.iCABSAServiceCoverMaintenance7.APTChangedAccordingToQuantity();
    };
    ServiceCoverMaintenance6.prototype.UnitValue_OnChange = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev && (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValue();
        }
    };
    ServiceCoverMaintenance6.prototype.ServiceAnnualValue_OnChange = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev && (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.iCABSAServiceCoverMaintenance6.CalculateUnitValue();
        }
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    };
    ServiceCoverMaintenance6.prototype.CalculateAnnualValue = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev && (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.PostDataAdd('Function', 'CalculateAnnualValue', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ServiceVisitFrequency', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('ServiceQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('UnitValue', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValue'), MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('CalcAnnualValue', MntConst.eTypeCurrency);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualValue', data['CalcAnnualValue']);
            }, 'POST');
        }
    };
    ServiceCoverMaintenance6.prototype.UnitValueChange_OnChange = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev && (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered') === true) {
            this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValueChange();
        }
    };
    ServiceCoverMaintenance6.prototype.CalculateUnitValue = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev && (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired'))) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.PostDataAdd('Function', 'CalculateUnitValue', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ServiceVisitFrequency', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('ServiceQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('ServiceAnnualValue', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue'), MntConst.eTypeCurrency);
            this.context.riMaintenance.PostDataAdd('UnitValueChange', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange'), MntConst.eTypeCurrency);
            this.context.riMaintenance.PostDataAdd('AnnualValueChange', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'AnnualValueChange'), MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('UnitValue', MntConst.eTypeCurrency);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValue', data['UnitValue']);
            }, 'POST');
        }
    };
    ServiceCoverMaintenance6.prototype.CalculateAnnualValueChange = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev && (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired'))) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.PostDataAdd('Function', 'CalculateAnnualValueChange', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ServiceVisitFrequency', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('ServiceQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), MntConst.eTypeInteger);
            this.context.riMaintenance.PostDataAdd('ServiceAnnualValue', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue'), MntConst.eTypeCurrency);
            this.context.riMaintenance.PostDataAdd('UnitValueChange', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange'), MntConst.eTypeCurrency);
            this.context.riMaintenance.ReturnDataAdd('CalcAnnualValueChange', MntConst.eTypeCurrency);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualValueChange', data['CalcAnnualValueChange']);
            }, 'POST');
        }
    };
    ServiceCoverMaintenance6.prototype.IsVisitTriggered = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'GetInvoiceType', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('InvoiceTypeNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.ReturnDataAdd('VisitTriggered', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data) {
            if (data['VisitTriggered'] && (this.context.utils.lcase(data['VisitTriggered'].toString()) === 'yes'
                || this.context.utils.lcase(data['VisitTriggered'].toString()) === 'true')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitTriggered', true);
            }
            else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitTriggered', false);
            }
        }, 'POST');
    };
    ServiceCoverMaintenance6.prototype.GetDefaultMultipleTaxRates = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'DefaultMultipleTaxRates', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('ConsolidateEqualTaxRates', MntConst.eTypeCheckBox);
        this.context.riMaintenance.ReturnDataAdd('TaxCodeMaterials', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('InvoiceTextMaterials', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('TaxCodeLabour', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('InvoiceTextLabour', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('TaxCodeReplacement', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('InvoiceTextReplacement', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterials', data['TaxCodeMaterials']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabour', data['TaxCodeLabour']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacement', data['TaxCodeReplacement']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTextMaterials', data['InvoiceTextMaterials']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTextLabour', data['InvoiceTextLabour']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTextReplacement', data['InvoiceTextReplacement']);
            if (this.context.utils.lcase(data['ConsolidateEqualTaxRates']) === 'yes'
                || this.context.utils.lcase(data['ConsolidateEqualTaxRates']) === 'true') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ConsolidateEqualTaxRates', true);
            }
            else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ConsolidateEqualTaxRates', false);
            }
            this.context.iCABSAServiceCoverMaintenance3.TaxCodeMaterials_onChange();
            this.context.iCABSAServiceCoverMaintenance3.TaxCodeLabour_onChange();
            this.context.iCABSAServiceCoverMaintenance3.TaxCodeReplacement_onChange();
        });
    };
    ServiceCoverMaintenance6.prototype.TermiteServiceCheck = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'TermiteServiceCheck', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('IsTermiteProduct', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('TermiteWarningDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'IsTermiteProduct', data['IsTermiteProduct']);
            if (data['TermiteWarningDesc']) {
                this.context.showAlert(data['TermiteWarningDesc']);
            }
            this.context.iCABSAServiceCoverMaintenance6.ShowHideTermiteRelatedFields();
        }, 'POST');
    };
    ServiceCoverMaintenance6.prototype.ShowHideTermiteRelatedFields = function () {
        this.context.pageParams.uiDisplay.trTermiteWarrantyLine1 = false;
        this.context.pageParams.uiDisplay.trTermiteWarrantyLine2 = false;
        this.context.pageParams.uiDisplay.trTermiteWarrantyLine3 = false;
        this.context.pageParams.uiDisplay.trGraphNumber = false;
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'IsTermiteProduct')) {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'IsTermiteProduct') === 'Y') {
                this.context.pageParams.uiDisplay.trTermiteWarrantyLine1 = true;
                this.context.pageParams.uiDisplay.trTermiteWarrantyLine2 = true;
                this.context.pageParams.uiDisplay.trTermiteWarrantyLine3 = true;
                this.context.pageParams.uiDisplay.trGraphNumber = true;
            }
        }
    };
    ServiceCoverMaintenance6.prototype.GetBudgetInstalmentDetails = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'GetBudgetInstalmentDetails', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('BudgetValidInstalments', MntConst.eTypeTextFree);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BudgetValidInstalments', data['BudgetValidInstalments']);
        });
    };
    ServiceCoverMaintenance6.prototype.cmdVisitTolerances_onclick = function () {
        this.context.store.dispatch({
            type: ContractActionTypes.SAVE_DATA,
            payload: {
                'AccountNumber': this.context.getControlValue('AccountNumber'),
                'AccountName': this.context.getControlValue('AccountName'),
                'ContractNumber': this.context.getControlValue('ContractNumber'),
                'ContractName': this.context.getControlValue('ContractName'),
                'PremiseNumber': this.context.getControlValue('PremiseNumber'),
                'PremiseName': this.context.getControlValue('PremiseName'),
                'ProductCode': this.context.getControlValue('ProductCode'),
                'ProductDesc': this.context.getControlValue('ProductDesc'),
                'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
                'CurrentServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'ServiceVisitAnnivDate': this.context.getControlValue('ServiceVisitAnnivDate'),
                'currentContractType': this.context.riExchange.getCurrentContractType()
            }
        });
        this.context.navigate('ServiceCoverVisitTolerance', 'grid/application/visittolerancegrid');
    };
    ServiceCoverMaintenance6.prototype.cmdInfestationTolerances_onclick = function () {
        this.context.navigate('ServiceCoverInfestationTolerance', 'grid/contractmanagement/account/infestationToleranceGrid', {
            'AccountNumber': this.context.getControlValue('AccountNumber'),
            'AccountName': this.context.getControlValue('AccountName'),
            'ContractNumber': this.context.getControlValue('ContractNumber'),
            'ContractName': this.context.getControlValue('ContractName'),
            'PremiseNumber': this.context.getControlValue('PremiseNumber'),
            'PremiseName': this.context.getControlValue('PremiseName'),
            'ProductCode': this.context.getControlValue('ProductCode'),
            'ProductDesc': this.context.getControlValue('ProductDesc'),
            'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
            'CurrentServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'CurrentContractTypeURLParameter': this.context.riExchange.getCurrentContractTypeUrlParam(),
            'parentMode': 'ServiceCoverInfestationTolerance'
        });
    };
    ServiceCoverMaintenance6.prototype.cmdTeleSalesOrderLine_onclick = function () {
        alert(' Open iCABSATeleSalesOrderLineGrid whenh available');
    };
    ServiceCoverMaintenance6.prototype.cmdServiceCoverDisplays_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/' + InternalGridSearchModuleRoutes.ICABSSASERVICECOVERDISPLAYGRID, {
            'ServiceCover': this.context.getControlValue('ServiceCoverROWID')
        });
    };
    ServiceCoverMaintenance6.prototype.cmdQualifications_onclick = function () {
        alert(' Open iCABSAServiceCoverQualificationGrid whenh available');
    };
    ServiceCoverMaintenance6.prototype.riExchange_UnloadHTMLDocument = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ClosedWithChanges') === 'Y') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowClosingName', 'AmendmentsMade');
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowClosingName', 'true');
        }
        this.context.riExchange.setParentHTMLValue('WindowClosingName', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowClosingName'));
        this.context.riExchange.setParentHTMLValue('ClosedWithChanges', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ClosedWithChanges'));
    };
    return ServiceCoverMaintenance6;
}());
