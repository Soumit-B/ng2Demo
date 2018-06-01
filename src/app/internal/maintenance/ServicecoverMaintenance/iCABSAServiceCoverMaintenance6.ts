import { InternalGridSearchModuleRoutes, InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../../base/PageRoutes';
import { ContractActionTypes } from './../../../actions/contract';
import { Injector } from '@angular/core';
import { ServiceCoverMaintenanceComponent } from './iCABSAServiceCoverMaintenance.component';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';

export class ServiceCoverMaintenance6 {

    private context: ServiceCoverMaintenanceComponent;
    private injector: Injector;

    constructor(private parent: ServiceCoverMaintenanceComponent, injector: Injector) {
        this.context = parent;
    }

    public ServiceQuantity_onchange(): void {
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValue') &&
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValue') !== '0') {
                    this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValue();
                }
            } else {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange') &&
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange') !== '0') {
                    this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValueChange();
                }
            }
        }
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        this.context.iCABSAServiceCoverMaintenance7.APTChangedAccordingToQuantity();
    }

    public UnitValue_OnChange(): void {
        if (this.context.pageParams.vbEnableServiceCoverDispLev && (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValue();
        }
    }

    public ServiceAnnualValue_OnChange(): void {
        if (this.context.pageParams.vbEnableServiceCoverDispLev && (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            this.context.iCABSAServiceCoverMaintenance6.CalculateUnitValue();
        }
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    }

    public CalculateAnnualValue(): void {
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
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualValue', data['CalcAnnualValue']);
            }, 'POST');
        }
    }

    public UnitValueChange_OnChange(): void {
        if (this.context.pageParams.vbEnableServiceCoverDispLev && (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') || this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) && this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered') === true) {
            this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValueChange();
        }
    }

    public CalculateUnitValue(): void {
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
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValue', data['UnitValue']);
            }, 'POST');
        }
    }

    public CalculateAnnualValueChange(): void {
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
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualValueChange', data['CalcAnnualValueChange']);
            }, 'POST');
        }
    }

    public IsVisitTriggered(): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'GetInvoiceType', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('InvoiceTypeNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvoiceTypeNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.ReturnDataAdd('VisitTriggered', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            if (data['VisitTriggered'] && (this.context.utils.lcase(data['VisitTriggered'].toString()) === 'yes'
                || this.context.utils.lcase(data['VisitTriggered'].toString()) === 'true')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitTriggered', true);
            } else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitTriggered', false);
            }
        }, 'POST');
    }

    public GetDefaultMultipleTaxRates(): void {
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
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterials', data['TaxCodeMaterials']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabour', data['TaxCodeLabour']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacement', data['TaxCodeReplacement']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTextMaterials', data['InvoiceTextMaterials']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTextLabour', data['InvoiceTextLabour']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTextReplacement', data['InvoiceTextReplacement']);
            if (this.context.LCase(data['ConsolidateEqualTaxRates']) === 'yes'
                || this.context.LCase(data['ConsolidateEqualTaxRates']) === 'true') {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ConsolidateEqualTaxRates', true);
            } else {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ConsolidateEqualTaxRates', false);
            }
            this.context.iCABSAServiceCoverMaintenance3.TaxCodeMaterials_onChange();
            this.context.iCABSAServiceCoverMaintenance3.TaxCodeLabour_onChange();
            this.context.iCABSAServiceCoverMaintenance3.TaxCodeReplacement_onChange();
        }, 'POST');
    }

    public TermiteServiceCheck(): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'TermiteServiceCheck', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('IsTermiteProduct', MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('TermiteWarningDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'IsTermiteProduct', data['IsTermiteProduct']);
            if (data['TermiteWarningDesc']) {
                this.context.isTermiteContract = true;
                this.context.showAlert(data['TermiteWarningDesc']);
            }
            this.context.iCABSAServiceCoverMaintenance6.ShowHideTermiteRelatedFields();
        }, 'POST');
    }

    public ShowHideTermiteRelatedFields(): void {
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
    }

    public GetBudgetInstalmentDetails(): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'GetBudgetInstalmentDetails', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('BudgetValidInstalments', MntConst.eTypeTextFree);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BudgetValidInstalments', data['BudgetValidInstalments']);
        });
    }

    public cmdVisitTolerances_onclick(): void {
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
        this.context.navigate('ServiceCoverVisitTolerance', InternalGridSearchServiceModuleRoutes.ICABSSVISITTOLERANCEGRID);
    }

    public cmdInfestationTolerances_onclick(): void {
        /*this.context.store.dispatch({
            type: ContractActionTypes.SAVE_SENT_FROM_PARENT,
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
                'currentContractType': this.context.riExchange.getCurrentContractType(),
                'parentMode': 'ServiceCoverInfestationTolerance'
            }
        });*/
        this.context.navigate('ServiceCoverInfestationTolerance', InternalGridSearchServiceModuleRoutes.ICABSSINFESTATIONTOLERANCEGRID,
            {
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
    }

    public cmdTeleSalesOrderLine_onclick(): void {
        alert(' Open iCABSATeleSalesOrderLineGrid whenh available');
        //riExchange.Mode = 'ServiceCoverTeleSalesOrderLine';
        // window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSATeleSalesOrderLineGrid.htm';
    }

    public cmdServiceCoverDisplays_onclick(): void {
        this.context.navigate('ServiceCover', InternalGridSearchApplicationModuleRoutes.ICABSSASERVICECOVERDISPLAYGRID, {
            'ServiceCover': this.context.getControlValue('ServiceCoverROWID')
        });
    }

    public cmdQualifications_onclick(): void {
        alert(' Open iCABSAServiceCoverQualificationGrid whenh available');
        //riExchange.Mode = 'ServiceCoverQualifications';
        // window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverQualificationGrid.htm';
    }

    public riExchange_UnloadHTMLDocument(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ClosedWithChanges') === 'Y') {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowClosingName', 'AmendmentsMade');
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'WindowClosingName', 'true');
        }
        this.context.riExchange.setParentHTMLValue('WindowClosingName', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'WindowClosingName'));
        this.context.riExchange.setParentHTMLValue('ClosedWithChanges', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ClosedWithChanges'));
        //Call riExchange.UpdateParentHTMLDocument();
    }

}
