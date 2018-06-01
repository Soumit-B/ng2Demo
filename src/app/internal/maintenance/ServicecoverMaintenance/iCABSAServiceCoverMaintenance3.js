import { InternalGridSearchModuleRoutes, AppModuleRoutes } from './../../../base/PageRoutes';
import { ContractActionTypes } from './../../../actions/contract';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ContractManagementModuleRoutes } from '../../../base/PageRoutes';
export var ServiceCoverMaintenance3 = (function () {
    function ServiceCoverMaintenance3(parent, injector) {
        this.parent = parent;
        this.context = parent;
    }
    ServiceCoverMaintenance3.prototype.InvTypeSel_OnChange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTypeNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvTypeSel'));
        this.context.iCABSAServiceCoverMaintenance4.ShowHideBudgetBilling();
        if (this.context.pageParams.vbEnableServiceCoverDispLev) {
            this.context.iCABSAServiceCoverMaintenance6.IsVisitTriggered();
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValue', '0');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValueChange', '0');
                this.context.pageParams.uiDisplay.trUnitValue = false;
                this.context.pageParams.uiDisplay.trUnitValueChange = false;
            }
            else {
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                    this.context.pageParams.uiDisplay.trUnitValue = true;
                }
                else {
                    this.context.pageParams.uiDisplay.trUnitValueChange = true;
                }
            }
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValue', '0');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValueChange', '0');
            this.context.pageParams.uiDisplay.trUnitValue = false;
            this.context.pageParams.uiDisplay.trUnitValueChange = false;
        }
    };
    ServiceCoverMaintenance3.prototype.ServiceVisitFrequency_OnChange = function () {
        if (this.context.pageParams.blnUseVisitCycleValues) {
            this.context.iCABSAServiceCoverMaintenance2.GetVisitCycleValues();
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceVisitFrequencyCopy', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'));
        }
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') ||
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'InvoiceUnitValueRequired')) &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValue') !== '0'
                    && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValue') !== null) {
                    this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValue();
                }
            }
            else {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange') !== '0'
                    && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange') !== null) {
                    this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValueChange();
                }
            }
        }
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    };
    ServiceCoverMaintenance3.prototype.ClosedCalendarTemplateNumber_onchange = function (obj) {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedTemplateName', '');
    };
    ServiceCoverMaintenance3.prototype.AnnualCalendarTemplateNumber_onChange = function (obj) {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CalendarTemplateName', '');
    };
    ServiceCoverMaintenance3.prototype.ContractNumber_onchange = function () {
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ContractNumber')) {
            if (this.context.getControlValue('ContractNumber')) {
                this.context.setControlValue('ContractNumber', this.context.utils.fillLeadingZeros(this.context.getControlValue('ContractNumber'), 8));
                this.context.disableControl('PremiseNumber', false);
            }
            else {
                this.context.disableControl('PremiseNumber', true);
            }
            this.context.getSysCharDtetails(true);
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.context.iCABSAServiceCoverMaintenance3.GetDefaultTaxCode();
                this.context.iCABSAServiceCoverMaintenance3.BuildTaxCodeCombo();
            }
            this.context.serviceCoverSearchParams.ContractNumber = this.context.getControlValue('ContractNumber');
            this.context.inputParamsAccountPremise.ContractNumber = this.context.getControlValue('ContractNumber');
        }
    };
    ServiceCoverMaintenance3.prototype.PremiseNumber_onchange = function () {
        if (this.context.getControlValue('PremiseNumber')) {
            this.context.serviceCoverSearchParams.PremiseNumber = this.context.getControlValue('PremiseNumber');
            this.context.disableControl('ProductCode', false);
        }
        else {
            this.context.disableControl('ProductCode', true);
        }
    };
    ServiceCoverMaintenance3.prototype.TaxCodeMaterials_onChange = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCodeMaterials') === null) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterialsDesc', '');
        }
        else {
            this.context.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.context.riMaintenance.clear();
            this.context.riMaintenance.PostDataAdd('PostDesc', 'TaxCode', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('TaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCodeMaterials'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('TaxCodeDesc', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterialsDesc', data['TaxCodeDesc']);
            });
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterialsDesc', '');
        }
    };
    ServiceCoverMaintenance3.prototype.TaxCodeLabour_onChange = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCodeLabour') === null) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabourDesc', '');
        }
        else {
            this.context.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.context.riMaintenance.clear();
            this.context.riMaintenance.PostDataAdd('PostDesc', 'TaxCode', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('TaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCodeLabour'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('TaxCodeDesc', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabourDesc', data['TaxCodeDesc']);
            });
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabourDesc', '');
        }
    };
    ServiceCoverMaintenance3.prototype.TaxCodeReplacement_onChange = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCodeReplacement') === null) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacementDesc', '');
        }
        else {
            this.context.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.context.riMaintenance.clear();
            this.context.riMaintenance.PostDataAdd('PostDesc', 'TaxCode', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('TaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCodeReplacement'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('TaxCodeDesc', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacementDesc', data['TaxCodeDesc']);
            });
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacementDesc', '');
        }
    };
    ServiceCoverMaintenance3.prototype.GetDefaultTaxCode = function () {
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'GetDefaultTaxCode', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractTypeCode', this.context.riExchange.getCurrentContractType(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('TaxCode', MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('TaxDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCode', data['TaxCode']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxDesc', data['TaxDesc']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selTaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCode'));
            if (this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintLog === true) {
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
                this.context.pageParams.selTaxCode = [];
                var obj = {
                    text: data['TaxCode'] + ' - ' + data['TaxDesc'],
                    value: data['TaxCode']
                };
                this.context.pageParams.selTaxCode.push(obj);
            }
        }, 'POST');
    };
    ServiceCoverMaintenance3.prototype.EntitlementAnnualQuantity_OnChange = function () {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'EntitlementNextAnnualQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnualQuantity'));
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    };
    ServiceCoverMaintenance3.prototype.DepotNumber_onChange = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DepotNumber') &&
            !this.context.riExchange.riInputElement.isError(this.context.uiForm, 'DepotNumber')) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.PostDataAdd('Function', 'GetDepotName', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('DepotNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DepotNumber'), MntConst.eTypeInteger);
            this.context.riMaintenance.ReturnDataAdd('DepotName', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepotName', data['DepotName']);
            }, 'POST');
        }
        else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepotName', '');
        }
    };
    ServiceCoverMaintenance3.prototype.SetQuickWindowSetValue = function (strValue) {
        for (var iLoop = 1; iLoop <= 7; iLoop++) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet' + iLoop, strValue);
        }
    };
    ServiceCoverMaintenance3.prototype.RenegOldContract_onchange = function () {
        if (this.context.getControlValue('RenegOldContract')) {
            this.context.setControlValue('RenegOldContract', this.context.utils.fillLeadingZeros(this.context.getControlValue('RenegOldContract'), 8));
        }
        this.context.inputRenegPremiseSearch.ContractNumber = this.context.getControlValue('RenegOldContract');
    };
    ServiceCoverMaintenance3.prototype.InitialTreatmentTime_OnChange = function () {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('InitialTreatmentTime');
    };
    ServiceCoverMaintenance3.prototype.StandardTreatmentTime_OnChange = function () {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('StandardTreatmentTime');
    };
    ServiceCoverMaintenance3.prototype.ServiceAnnualTime_OnChange = function () {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('ServiceAnnualTime');
    };
    ServiceCoverMaintenance3.prototype.AnnualTimeChange_OnChange = function () {
        if (this.context.formatTime(this.context.getControlValue('AnnualTimeChange'), 'AnnualTimeChange')) {
            this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        }
    };
    ServiceCoverMaintenance3.prototype.SalesPlannedTime_OnChange = function () {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('SalesPlannedTime');
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ActualPlannedTime', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SalesPlannedTime'));
        }
    };
    ServiceCoverMaintenance3.prototype.ActualPlannedTime_OnChange = function () {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('ActualPlannedTime');
    };
    ServiceCoverMaintenance3.prototype.MinimumDuration_OnChange = function () {
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'MinimumDuration') ||
            !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ExpiryDate', '');
        }
        else {
        }
    };
    ServiceCoverMaintenance3.prototype.LeadEmployeeDisplay = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LeadInd')) {
            this.context.pageParams.uiDisplay.tdLeadEmployeeLabel = true;
            this.context.pageParams.LeadEmployee = true;
            this.context.pageParams.LeadEmployeeSurname = true;
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LeadEmployee', false);
            }
            else {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LeadEmployee', true);
            }
        }
        else {
            this.context.pageParams.uiDisplay.tdLeadEmployeeLabel = false;
            this.context.pageParams.LeadEmployee = false;
            this.context.pageParams.LeadEmployeeSurname = false;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LeadEmployee', false);
        }
    };
    ServiceCoverMaintenance3.prototype.PopulateCompositeCode = function () {
        var iext;
        var ValArray;
        var DescArray;
        this.context.pageParams.selTaxCode = [];
        var CompositeCodeList = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CompositeCodeList');
        var CompositeDescList = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CompositeDescList');
        if (CompositeCodeList && CompositeDescList) {
            ValArray = CompositeCodeList.split('^');
            DescArray = CompositeDescList.split('^');
            for (var i = 0; i < ValArray.length; i++) {
                var obj = {
                    text: ValArray[0] + ' - ' + DescArray[0],
                    value: ValArray[0]
                };
                this.context.pageParams.selTaxCode.push(obj);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelectCompositeProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CompositeProductCode'));
            }
        }
    };
    ServiceCoverMaintenance3.prototype.DefaultFromProspect = function () {
        if (this.context.riExchange.getParentHTMLValue('ProspectNumber') !== '') {
            this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
            this.context.riMaintenance.clear();
            this.context.riMaintenance.PostDataAdd('Function', 'DefaultFromProspect', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('ProspectNumber', this.context.riExchange.getParentHTMLValue('ProspectNumber'), MntConst.eTypeInteger);
            this.context.riMaintenance.ReturnDataAdd('BusinessOriginCode', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('BusinessOriginDesc', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('BusinessOriginDetailCode', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('BusinessOriginDetailDesc', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('LeadEmployee', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('LeadEmployeeSurname', MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('LeadInd', MntConst.eTypeCheckBox);
            this.context.riMaintenance.ReturnDataAdd('DetailRequiredInd', MntConst.eTypeCheckBox);
            this.context.riMaintenance.Execute(this.context, function (data) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginCode', data['BusinessOriginCode']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDesc', data['BusinessOriginDesc']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailCode', data['BusinessOriginDetailCode']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailDesc', data['BusinessOriginDetailDesc']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadEmployee', data['LeadEmployee']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadEmployeeSurname', data['LeadEmployeeSurname']);
                if (data['LeadInd'].toLowerCase() === 'yes' || data['LeadInd'].toLowerCase() === 'true') {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadInd', 'true');
                }
                else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadInd', 'false');
                }
                if (data['DetailRequiredInd'].toLowerCase() === 'yes' || data['DetailRequiredInd'].toLowerCase() === 'true') {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DetailRequiredInd', 'true');
                }
                else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DetailRequiredInd', 'false');
                }
            }, 'POST');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginCode', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDesc', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailCode', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailDesc', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadEmployee', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadEmployeeSurname', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadInd', 'false');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DetailRequiredInd', 'false');
        }
        ;
    };
    ServiceCoverMaintenance3.prototype.menu_onchange = function (event) {
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
            switch (event) {
                case 'ContactManagement':
                    this.context.iCABSAServiceCoverMaintenance3.cmdContactManagement_onclick();
                    break;
                case 'ContactManagementSearch':
                    ;
                    this.context.navigate('ServiceCover', 'ccm/contact/search', {
                        'AccountNumber': this.context.getControlValue('AccountNumber'),
                        'AccountName': this.context.getControlValue('AccountName'),
                        'ContractNumber': this.context.getControlValue('ContractNumber'),
                        'ContractName': this.context.getControlValue('ContractName'),
                        'PremiseNumber': this.context.getControlValue('PremiseNumber'),
                        'PremiseName': this.context.getControlValue('PremiseName'),
                        'ProductCode': this.context.getControlValue('ProductCode'),
                        'ProductDesc': this.context.getControlValue('ProductDesc'),
                        'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
                        'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID')
                    });
                    break;
                case 'PlanVisit':
                    this.context.iCABSAServiceCoverMaintenance3.cmdPlanVisit_onclick();
                    break;
                case 'PlanVisitTabular':
                    this.context.iCABSAServiceCoverMaintenance3.cmdPlanVisitTabular_onclick();
                    break;
                case 'StaticVisit':
                    this.context.iCABSAServiceCoverMaintenance3.cmdStaticVisit_onclick();
                    break;
                case 'ServiceDetail':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdServiceDetail_onclick();
                    }
                    break;
                case 'DOWServiceValue':
                    if (this.context.pageParams.blnAccess && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DOWSentriconInd') === 'true' ? true : false) {
                        this.context.iCABSAServiceCoverMaintenance7.cmdDOWServiceValue_onclick();
                    }
                    break;
                case 'ServiceValue':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdServiceValue_onclick();
                    }
                    break;
                case 'VisitHistory':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdVisitHistory_onclick();
                    }
                    break;
                case 'Service Recommendations':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdServiceRecommendations_onclick();
                    }
                    break;
                case 'History':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdHistory_onclick();
                    }
                    break;
                case 'ProRata':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdProRata_onclick();
                    }
                    break;
                case 'Location':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdLocation_onclick();
                    }
                    break;
                case 'SalesStatsAdjustment':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdSalesStatsAdjustment_onclick();
                    }
                    break;
                case 'InvoiceHistory':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdInvoiceHistory_onclick();
                    }
                    break;
                case 'StateOfService':
                    if (this.context.pageParams.blnAccess) {
                        this.context.iCABSAServiceCoverMaintenance3.cmdStateOfService_onclick();
                    }
                    break;
                case 'EventHistory':
                    this.context.iCABSAServiceCoverMaintenance3.cmdEventHistory_onclick();
                    break;
                case 'Contract':
                    this.context.iCABSAServiceCoverMaintenance3.cmdContract_onclick();
                    break;
                case 'Premise':
                    this.context.iCABSAServiceCoverMaintenance3.cmdPremise_onclick();
                    break;
                case 'SeasonalService':
                    this.context.iCABSAServiceCoverMaintenance3.cmdSeasonalService_onclick();
                    break;
                case 'ServiceCalendar':
                    this.context.iCABSAServiceCoverMaintenance3.cmdServiceCalendar_onclick();
                    break;
                case 'CustomerInformation':
                    this.context.iCABSAServiceCoverMaintenance3.cmdCustomerInformation_onclick();
                    break;
                case 'AnnualCalendar':
                    this.context.iCABSAServiceCoverMaintenance3.cmdAnnualCalendar_onclick();
                    break;
                case 'SeasonalMaint':
                    this.context.iCABSAServiceCoverMaintenance3.cmdSeasonalMaint_onclick();
                    break;
                case 'ServiceVisitPlanning':
                    this.context.iCABSAServiceCoverMaintenance3.cmdServiceVisitPlanning_onclick();
                    break;
                case 'LinkedProducts':
                    this.context.iCABSAServiceCoverMaintenance3.cmdLinkedProducts_onclick();
                    break;
                case 'ServiceCoverWaste':
                    this.context.iCABSAServiceCoverMaintenance3.cmdServiceCoverWaste_onclick();
                    break;
                case 'WasteConsignmentNoteHistory':
                    this.context.iCABSAServiceCoverMaintenance3.cmdWasteConsignmentNoteHistory_onclick();
                    break;
                case 'ClosedCalendar':
                    this.context.iCABSAServiceCoverMaintenance3.cmdClosedCalendar_onclick();
                    break;
                case 'ServiceCoverDisplays':
                    this.context.iCABSAServiceCoverMaintenance6.cmdServiceCoverDisplays_onclick();
                    break;
                case 'VisitTolerances':
                    this.context.iCABSAServiceCoverMaintenance6.cmdVisitTolerances_onclick();
                    break;
                case 'InfestationTolerances':
                    this.context.iCABSAServiceCoverMaintenance6.cmdInfestationTolerances_onclick();
                    break;
                case 'TeleSalesOrderLine':
                    this.context.iCABSAServiceCoverMaintenance6.cmdTeleSalesOrderLine_onclick();
                    break;
                case 'Qualif(ications':
                    this.context.iCABSAServiceCoverMaintenance6.cmdQualifications_onclick();
                    break;
                case 'TreatmentPlan':
                    this.context.iCABSAServiceCoverMaintenance3.cmdTreatmentPlan_onclick();
                    break;
            }
        }
        else {
            this.context.showAlert('In add mode, cannot navigate');
        }
        this.context.setControlValue('menu', 'Options');
    };
    ServiceCoverMaintenance3.prototype.SeasonalBranchUpdate_onclick = function () {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'SeasonalBranchUpdate')) {
            this.context.iCABSAServiceCoverMaintenance7.EnableSeasonalChanges(!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalBranchUpdate'));
        }
    };
    ServiceCoverMaintenance3.prototype.SeasonalFromWeekChange = function (ipFromWeek, ipFromYear, opFromDate) {
        this.context.iCABSAServiceCoverMaintenance7.SeasonalWeekChange('GetWeekStartFromWeek', ipFromWeek, ipFromYear, opFromDate);
    };
    ServiceCoverMaintenance3.prototype.SeasonalToWeekChange = function (ipFromWeek, ipFromYear, opFromDate) {
        this.context.iCABSAServiceCoverMaintenance7.SeasonalWeekChange('GetWeekEndFromWeek', ipFromWeek, ipFromYear, opFromDate);
    };
    ServiceCoverMaintenance3.prototype.cmdCustomerInformation_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/contractmanagement/maintenance/contract/customerinformation', {
            'contractNumber': this.context.getControlValue('ContractNumber'),
            'contractName': this.context.getControlValue('ContractName'),
            'accountNumber': this.context.getControlValue('AccountNumber'),
            'accountName': this.context.getControlValue('AccountName'),
            'currentContractType': this.context.riExchange.getCurrentContractType()
        });
    };
    ServiceCoverMaintenance3.prototype.tdCustomerInfo_onclick = function () {
        this.cmdCustomerInformation_onclick();
    };
    ServiceCoverMaintenance3.prototype.cmdContactManagement_onclick = function () {
        if (this.context.pageParams.lRegContactCentreReview) {
            this.context.store.dispatch({
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
                    'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                    'currentContractType': this.context.riExchange.getCurrentContractType()
                }
            });
            this.context.navigate('ServiceCover', 'ccm/centreReview');
        }
        else {
            this.context.navigate('ServiceCover', 'ccm/contact/search', {
                'AccountNumber': this.context.getControlValue('AccountNumber'),
                'AccountName': this.context.getControlValue('AccountName'),
                'ContractNumber': this.context.getControlValue('ContractNumber'),
                'ContractName': this.context.getControlValue('ContractName'),
                'PremiseNumber': this.context.getControlValue('PremiseNumber'),
                'PremiseName': this.context.getControlValue('PremiseName'),
                'ProductCode': this.context.getControlValue('ProductCode'),
                'ProductDesc': this.context.getControlValue('ProductDesc'),
                'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'currentContractType': this.context.riExchange.getCurrentContractType()
            });
        }
    };
    ServiceCoverMaintenance3.prototype.cmdHistory_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/application/contract/history', {
            'currentContractTypeURLParameter': this.context.riExchange.getCurrentContractType(),
            'AccountNumber': this.context.getControlValue('AccountNumber'),
            'AccountName': this.context.getControlValue('AccountName'),
            'ContractNumber': this.context.getControlValue('ContractNumber'),
            'ContractName': this.context.getControlValue('ContractName'),
            'PremiseNumber': this.context.getControlValue('PremiseNumber'),
            'PremiseName': this.context.getControlValue('PremiseName'),
            'ProductCode': this.context.getControlValue('ProductCode'),
            'ProductDesc': this.context.getControlValue('ProductDesc'),
            'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'currentContractType': this.context.riExchange.getCurrentContractType(),
            'countryCode': this.context.utils.getCountryCode()
        });
    };
    ServiceCoverMaintenance3.prototype.cmdServiceValue_onclick = function () {
        this.context.navigate('ServiceCoverAll', 'grid/contractmanagement/account/serviceValue', {
            'ParentMode': 'ServiceCoverAll',
            'AccountNumber': this.context.getControlValue('AccountNumber'),
            'AccountName': this.context.getControlValue('AccountName'),
            'ContractNumber': this.context.getControlValue('ContractNumber'),
            'ContractName': this.context.getControlValue('ContractName'),
            'PremiseNumber': this.context.getControlValue('PremiseNumber'),
            'PremiseName': this.context.getControlValue('PremiseName'),
            'ProductCode': this.context.getControlValue('ProductCode'),
            'ProductDesc': this.context.getControlValue('ProductDesc'),
            'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'currentContractType': this.context.riExchange.getCurrentContractType()
        });
    };
    ServiceCoverMaintenance3.prototype.cmdLocation_onclick = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            this.context.navigate('Premise-Allocate', 'grid/application/EmptyPremiseLocationSearchGrid');
        }
        else {
            if (this.context.pageParams.vbEnableDetailLocations &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LocationsEnabled')) {
                this.context.navigate('ProductDetailSC', 'grid/application/ServiceCoverDetailLocationEntryGridComponent', {
                    'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID')
                });
            }
            else {
                this.context.navigate('Premise-Allocate', 'grid/application/premiseLocationAllocation');
            }
        }
    };
    ServiceCoverMaintenance3.prototype.cmdVisitHistory_onclick = function () {
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
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'ServiceVisitAnnivDate': this.context.getControlValue('ServiceVisitAnnivDate'),
                'currentContractType': this.context.riExchange.getCurrentContractType()
            }
        });
        this.context.navigate('ServiceCover', 'grid/contractmanagement/maintenance/contract/visitsummary');
    };
    ServiceCoverMaintenance3.prototype.cmdServiceDetail_onclick = function () {
        this.context.navigate('ServiceCover', 'application/ServiceCoverDetails', {
            'AccountNumber': this.context.getControlValue('AccountNumber'),
            'AccountName': this.context.getControlValue('AccountName'),
            'ContractNumber': this.context.getControlValue('ContractNumber'),
            'ContractName': this.context.getControlValue('ContractName'),
            'PremiseNumber': this.context.getControlValue('PremiseNumber'),
            'PremiseName': this.context.getControlValue('PremiseName'),
            'ProductCode': this.context.getControlValue('ProductCode'),
            'ProductDesc': this.context.getControlValue('ProductDesc'),
            'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'ServiceVisitAnnivDate': this.context.getControlValue('ServiceVisitAnnivDate'),
            'currentContractType': this.context.riExchange.getCurrentContractType()
        });
    };
    ServiceCoverMaintenance3.prototype.cmdProRata_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/application/proRatacharge/summary');
    };
    ServiceCoverMaintenance3.prototype.cmdInvoiceHistory_onclick = function () {
        this.context.navigate('Product', 'billtocash/contract/invoice', {
            'AccountNumber': this.context.getControlValue('AccountNumber'),
            'AccountName': this.context.getControlValue('AccountName'),
            'ContractNumber': this.context.getControlValue('ContractNumber'),
            'ContractName': this.context.getControlValue('ContractName'),
            'PremiseNumber': this.context.getControlValue('PremiseNumber'),
            'PremiseName': this.context.getControlValue('PremiseName'),
            'ProductCode': this.context.getControlValue('ProductCode'),
            'ProductDesc': this.context.getControlValue('ProductDesc'),
            'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'currentContractType': this.context.riExchange.getCurrentContractType()
        });
    };
    ServiceCoverMaintenance3.prototype.cmdStateOfService_onclick = function () {
        alert(' Open iCABSSeStateOfServiceNatAccountGrid wheh available');
    };
    ServiceCoverMaintenance3.prototype.cmdValue_onclick = function () {
        this.context.navigate('ServiceCoverAll', 'grid/contractmanagement/account/serviceValue', {
            'AccountNumber': this.context.getControlValue('AccountNumber'),
            'AccountName': this.context.getControlValue('AccountName'),
            'ContractNumber': this.context.getControlValue('ContractNumber'),
            'ContractName': this.context.getControlValue('ContractName'),
            'PremiseNumber': this.context.getControlValue('PremiseNumber'),
            'PremiseName': this.context.getControlValue('PremiseName'),
            'ProductCode': this.context.getControlValue('ProductCode'),
            'ProductDesc': this.context.getControlValue('ProductDesc'),
            'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'currentContractType': this.context.riExchange.getCurrentContractType()
        });
    };
    ServiceCoverMaintenance3.prototype.cmdPlanVisit_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/application/contract/planVisitGridYear', {
            'AccountNumber': this.context.getControlValue('AccountNumber'),
            'AccountName': this.context.getControlValue('AccountName'),
            'ContractNumber': this.context.getControlValue('ContractNumber'),
            'ContractName': this.context.getControlValue('ContractName'),
            'PremiseNumber': this.context.getControlValue('PremiseNumber'),
            'PremiseName': this.context.getControlValue('PremiseName'),
            'ProductCode': this.context.getControlValue('ProductCode'),
            'ProductDesc': this.context.getControlValue('ProductDesc'),
            'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'currentContractType': this.context.riExchange.getCurrentContractType(),
            'CurrentContractTypeURLParameter': this.context.riExchange.getCurrentContractTypeUrlParam()
        });
    };
    ServiceCoverMaintenance3.prototype.cmdTreatmentPlan_onclick = function () {
        alert(' Open iCABSATreatmentPlan wheh available');
    };
    ServiceCoverMaintenance3.prototype.cmdPlanVisitTabular_onclick = function () {
        if (this.context.pageParams.vEnableTabularView) {
            this.context.navigate('ServiceCover', 'grid/application/premise/planVisit', {
                'AccountNumber': this.context.getControlValue('AccountNumber'),
                'AccountName': this.context.getControlValue('AccountName'),
                'ContractNumber': this.context.getControlValue('ContractNumber'),
                'ContractName': this.context.getControlValue('ContractName'),
                'PremiseNumber': this.context.getControlValue('PremiseNumber'),
                'PremiseName': this.context.getControlValue('PremiseName'),
                'ProductCode': this.context.getControlValue('ProductCode'),
                'ProductDesc': this.context.getControlValue('ProductDesc'),
                'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'CurrentContractTypeURLParameter': this.context.riExchange.getCurrentContractTypeUrlParam()
            });
        }
    };
    ServiceCoverMaintenance3.prototype.cmdStaticVisit_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/application/service/StaticVisitGridYear', {
            'AccountNumber': this.context.getControlValue('AccountNumber'),
            'AccountName': this.context.getControlValue('AccountName'),
            'ContractNumber': this.context.getControlValue('ContractNumber'),
            'ContractName': this.context.getControlValue('ContractName'),
            'PremiseNumber': this.context.getControlValue('PremiseNumber'),
            'PremiseName': this.context.getControlValue('PremiseName'),
            'ProductCode': this.context.getControlValue('ProductCode'),
            'ProductDesc': this.context.getControlValue('ProductDesc'),
            'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'currentContractType': this.context.riExchange.getCurrentContractType()
        });
    };
    ServiceCoverMaintenance3.prototype.cmdServiceRecommendations_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/application/service/recommendation', {
            'AccountNumber': this.context.getControlValue('AccountNumber'),
            'AccountName': this.context.getControlValue('AccountName'),
            'ContractNumber': this.context.getControlValue('ContractNumber'),
            'ContractName': this.context.getControlValue('ContractName'),
            'PremiseNumber': this.context.getControlValue('PremiseNumber'),
            'PremiseName': this.context.getControlValue('PremiseName'),
            'ProductCode': this.context.getControlValue('ProductCode'),
            'ProductDesc': this.context.getControlValue('ProductDesc'),
            'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'currentContractType': this.context.riExchange.getCurrentContractType()
        });
    };
    ServiceCoverMaintenance3.prototype.cmdSalesStatsAdjustment_onclick = function () {
        alert(' Open iCABSSSalesStatisticsServiceValueGrid wheh available');
    };
    ServiceCoverMaintenance3.prototype.cmdSeasonalService_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/' + InternalGridSearchModuleRoutes.ICABSASERVICECOVERSEASONGRID, {
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID')
        });
    };
    ServiceCoverMaintenance3.prototype.cmdServiceVisitPlanning_onclick = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            this.context.attributes.Mode = 'Update';
            alert(' Open iCABSAServiceVisitPlanningGrid wheh available');
        }
        else {
            this.context.showAlert('Product Does Not Require Manual Visit Planning');
        }
    };
    ServiceCoverMaintenance3.prototype.cmdLinkedProducts_onclick = function () {
        this.context.attributes.Mode = 'Update';
        alert(' Open iCABSALinkedProductsGrid wheh available');
    };
    ServiceCoverMaintenance3.prototype.cmdServiceCalendar_onclick = function () {
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'AnnualCalendarInd')) {
                this.context.navigate('ServiceCover', AppModuleRoutes.GRID + InternalGridSearchModuleRoutes.ICABSASERVICECOVERCALENDARDATEGRID, {
                    'AccountNumber': this.context.getControlValue('AccountNumber'),
                    'AccountName': this.context.getControlValue('AccountName'),
                    'ContractNumber': this.context.getControlValue('ContractNumber'),
                    'ContractName': this.context.getControlValue('ContractName'),
                    'PremiseNumber': this.context.getControlValue('PremiseNumber'),
                    'PremiseName': this.context.getControlValue('PremiseName'),
                    'ProductCode': this.context.getControlValue('ProductCode'),
                    'ProductDesc': this.context.getControlValue('ProductDesc'),
                    'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
                    'ServiceCover': this.context.getControlValue('ServiceCoverROWID'),
                    'CalendarUpdateAllowed': this.context.getControlValue('CalendarUpdateAllowed'),
                    'ServiceVisitFrequency': this.context.getControlValue('ServiceVisitFrequency'),
                    'currentContractType': this.context.riExchange.getCurrentContractType()
                });
            }
        }
    };
    ServiceCoverMaintenance3.prototype.cmdClosedCalendar_onclick = function () {
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            alert(' Open iCABSAServiceCoverClosedDateGrid wheh available');
        }
    };
    ServiceCoverMaintenance3.prototype.cmdAnnualCalendar_onclick = function () {
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            alert(' Open iCABSAServiceCoverCalendarDatesMaintenance wheh available');
        }
    };
    ServiceCoverMaintenance3.prototype.cmdSeasonalMaint_onclick = function () {
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            alert(' Open iCABSAServiceCoverSeasonalDatesMaintenance wheh available');
        }
    };
    ServiceCoverMaintenance3.prototype.cmdServiceCoverWaste_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/' + InternalGridSearchModuleRoutes.ICABSASERVICECOVERWASTEGRID);
    };
    ServiceCoverMaintenance3.prototype.cmdWasteConsignmentNoteHistory_onclick = function () {
        alert(' Open iCABSAWasteConsignmentNoteHistoryGrid wheh available');
    };
    ServiceCoverMaintenance3.prototype.chkRenegContract_onclick = function () {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'chkRenegContract')) {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkRenegContract')) {
                this.context.pageParams.uiDisplay.tdRenegOldContract = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldContract', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldPremise', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldValue', true);
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RenegOldContract', '');
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RenegOldPremise', '');
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RenegOldValue', '');
                }
            }
            else {
                this.context.pageParams.uiDisplay.tdRenegOldContract = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldContract', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldPremise', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldValue', false);
            }
        }
    };
    ServiceCoverMaintenance3.prototype.chkFOC_onclick = function () {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'chkFOC')) {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkFOC')) {
                this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = true;
                this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'FOCInvoiceStartDate', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'FOCProposedAnnualValue', true);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualValue', '0');
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'ServiceAnnualValue');
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValue', '0');
                    this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'UnitValue');
                }
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TrialPeriodInd', false);
                this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TrialPeriodInd');
            }
            else {
                this.context.pageParams.uiDisplay.tdFOCInvoiceStartDate = false;
                this.context.pageParams.uiDisplay.tdFOCProposedAnnualValue = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'FOCInvoiceStartDate', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'FOCProposedAnnualValue', false);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FOCInvoiceStartDate', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'FOCProposedAnnualValue', '');
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'UnitValue');
                }
                this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'ServiceAnnualValue');
                if (this.context.riExchange.getCurrentContractType() === 'C') {
                    this.context.pageParams.uiDisplay.tdTrialPeriodInd = true;
                    this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TrialPeriodInd');
                }
            }
        }
    };
    ServiceCoverMaintenance3.prototype.cmdEventHistory_onclick = function () {
        this.context.navigate('ServiceCover', 'grid/contactmanagement/customercontactHistorygrid');
    };
    ServiceCoverMaintenance3.prototype.cmdContract_onclick = function () {
        var url = '/contractmanagement/maintenance/contract';
        switch (this.context.riExchange.getCurrentContractType()) {
            case 'P':
                url = ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE;
                break;
            case 'J':
                url = ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE;
                break;
            default:
            case 'C':
                url = ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE;
                break;
        }
        this.context.navigate('ServiceCover', url, {
            'ContractNumber': this.context.getControlValue('ContractNumber')
        });
    };
    ServiceCoverMaintenance3.prototype.cmdPremise_onclick = function () {
        this.context.navigate('ServiceCover', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
    };
    ServiceCoverMaintenance3.prototype.cmdCopyServiceCover_onclick = function () {
        this.context.navigate('ServiceCoverCopy', 'application/serviceCoverSearch');
    };
    ServiceCoverMaintenance3.prototype.cmdRefreshDisplayVal_onclick = function () {
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            this.context.iCABSAServiceCoverMaintenance1.CalDisplayValues();
        }
    };
    ServiceCoverMaintenance3.prototype.ToggleEntitlementRequired = function () {
        if (!(this.context.riExchange.riInputElement.checked(this.context.uiForm, 'EntitlementRequiredInd'))) {
            if (this.context.riExchange.getCurrentContractType() === 'C') {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementAnnivDate', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementAnnualQuantity', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementNextAnnualQuantity', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementPricePerUnit', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementInvoiceTypeCode', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementAnnivDate', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementAnnualQuantity', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementNextAnnualQuantity', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementPricePerUnit', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementInvoiceTypeCode', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementServiceQuantity', false);
            }
            this.context.pageParams.uiDisplay.tdEntitlement = false;
            this.context.pageParams.uiDisplay.trEntitlementInvoice = false;
            this.context.iCABSAServiceCoverMaintenance3.MinCommitQtyToggle();
        }
        else {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnivDate') === '') {
                this.context.setDateToFields('EntitlementAnnivDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitAnnivDate'));
            }
            if (this.context.riExchange.getCurrentContractType() === 'C') {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementAnnivDate', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementAnnualQuantity', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementNextAnnualQuantity', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementPricePerUnit', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementInvoiceTypeCode', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementServiceQuantity', false);
            }
            this.context.iCABSAServiceCoverMaintenance3.MinCommitQtyToggle();
            this.context.pageParams.uiDisplay.tdEntitlement = true;
            this.context.pageParams.uiDisplay.trEntitlementInvoice = true;
        }
    };
    ServiceCoverMaintenance3.prototype.MinCommitQtyToggle = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'MinCommitQty')) {
            if (this.context.pageParams.uiDisplay.trServiceVisitFrequency === true) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceVisitFrequency', false);
            }
            if (this.context.pageParams.uiDisplay.trServiceAnnualValue === true) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualValue', false);
            }
            if (this.context.pageParams.uiDisplay.trServiceQuantity === true) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceQuantity', false);
            }
            this.context.pageParams.spanEntitlementAnnivDateLab_innerText = 'Minimum Commitment Anniversary Date';
            this.context.pageParams.spanEntitlementAnnualQuantityLab_innerText = 'Minimum Commitment Quantity';
            this.context.pageParams.spanEntitlementNextAnnualQuantityLab_innerText = 'Next Year\'s Minimum Commitment Quantity';
        }
        else {
            if (this.context.pageParams.uiDisplay.trServiceVisitFrequency === true) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceVisitFrequency', true);
            }
            if (this.context.pageParams.uiDisplay.trServiceAnnualValue === true) {
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate && this.context.riExchange.URLParameterContains('PendingReduction')) {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualValue', false);
                }
                else {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualValue', true);
                }
            }
            if (this.context.pageParams.uiDisplay.trServiceQuantity === true) {
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate && this.context.riExchange.URLParameterContains('PendingReduction')) {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceQuantity', false);
                }
                else {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceQuantity', true);
                }
            }
            this.context.pageParams.spanEntitlementAnnivDateLab_innerText = 'Entitlement Anniversary Date';
            this.context.pageParams.spanEntitlementAnnualQuantityLab_innerText = 'Annual Entitlement Quantity';
            this.context.pageParams.spanEntitlementNextAnnualQuantityLab_innerText = 'Next Year\'s Entitlement Quantity';
        }
    };
    ServiceCoverMaintenance3.prototype.btnDefaultServiceQuantity_onClick = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'GetServiceVisitQuantity', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ServiceVisitFrequency', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('EntitlementAnnualQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnualQuantity'), MntConst.eTypeInteger);
        this.context.riMaintenance.ReturnDataAdd('EntitlementServiceVisitQuantity', MntConst.eTypeInteger);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'EntitlementServiceQuantity', data['EntitlementServiceVisitQuantity']);
        }, 'POST');
    };
    ServiceCoverMaintenance3.prototype.MultipleTaxRates_onClick = function () {
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeNormal && this.context.pageParams.vbOverrideMultipleTaxRates) {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'MultipleTaxRates') === 'true' ? true : false) {
                this.context.pageParams.uiDisplay.trTaxHeadings = true;
                this.context.pageParams.uiDisplay.trTaxMaterials = true;
                this.context.pageParams.uiDisplay.trTaxLabour = true;
                this.context.pageParams.uiDisplay.trTaxReplacement = true;
                this.context.pageParams.uiDisplay.trConsolidateEqualTaxRates = true;
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')) {
                    this.context.iCABSAServiceCoverMaintenance6.GetDefaultMultipleTaxRates();
                }
            }
            else {
                this.context.pageParams.uiDisplay.trTaxHeadings = false;
                this.context.pageParams.uiDisplay.trTaxMaterials = false;
                this.context.pageParams.uiDisplay.trTaxLabour = false;
                this.context.pageParams.uiDisplay.trTaxReplacement = false;
                this.context.pageParams.uiDisplay.trConsolidateEqualTaxRates = false;
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterials', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterialsDesc', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTextMaterials', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabour', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabourDesc', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTextLabour', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacement', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacementDesc', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTextReplacement', '');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ConsolidateEqualTaxRates', '');
            }
        }
    };
    ServiceCoverMaintenance3.prototype.riTab_TabFocusAfterComponent = function () {
        this.context.pageParams.uiDisplay.trComponentGrid = true;
        this.context.pageParams.uiDisplay.trComponentGridControls = true;
        this.context.pageParams.uiDisplay.trComponentControls = true;
        this.context.iCABSAServiceCoverMaintenance3.BuildComponentGrid();
        this.context.iCABSAServiceCoverMaintenance3.riComponentGrid_BeforeExecute();
    };
    ServiceCoverMaintenance3.prototype.riTab_TabFocusAfterDisplays = function () {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID')) {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'riGridHandle') === '') {
                this.context.pageParams.riDisplayGrid.RequestCacheRefresh = true;
            }
            else {
                this.context.pageParams.riDisplayGrid.RequestCacheRefresh = false;
            }
            this.context.iCABSAServiceCoverMaintenance3.BuildDisplayGrid();
            this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
        }
    };
    ServiceCoverMaintenance3.prototype.riComponentGrid_BeforeExecute = function () {
        var _this = this;
        var search = this.context.getURLSearchParamObject();
        this.context.riComponentGrid.UpdateHeader = false;
        this.context.riComponentGrid.UpdateBody = true;
        this.context.riComponentGrid.UpdateFooter = true;
        search.set('action', '2');
        search.set('ContractNumber', this.context.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.context.getControlValue('PremiseNumber'));
        search.set('ProductCode', this.context.getControlValue('ProductCode'));
        search.set('ServiceCoverROWID', this.context.getControlValue('ServiceCoverROWID'));
        search.set('CompositeFrequency', this.context.getControlValue('ServiceVisitFrequency'));
        search.set('CompositeQuantity', this.context.getControlValue('ServiceQuantity'));
        search.set('CompositeValue', this.context.getControlValue('ServiceAnnualValue'));
        search.set('GridCacheTime', this.context.getControlValue('ComponentGridCacheTime'));
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('PageSize', '10');
        search.set('PageCurrent', this.context.pageParams.riComponentGridPageCurrent.toString());
        search.set('HeaderClickedColumn', this.context.riComponentGrid.HeaderClickedColumn);
        var sortOrder = 'Descending';
        if (!this.context.riComponentGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.httpService.makeGetRequest(this.context.xhrParams.method, this.context.xhrParams.module, this.context.xhrParams.operation, search)
            .subscribe(function (data) {
            if (data) {
                _this.context.pageParams.riComponentGridPageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                _this.context.pageParams.riComponentTotalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                _this.context.riComponentGrid.Update = true;
                _this.context.riComponentGrid.UpdateBody = true;
                _this.context.riComponentGrid.UpdateFooter = true;
                _this.context.riComponentGrid.UpdateHeader = true;
                if (data && data.errorMessage) {
                    _this.context.showAlert(data);
                }
                else {
                    _this.context.riComponentGrid.Execute(data);
                }
            }
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.context.pageParams.riComponentTotalRecords = 1;
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverMaintenance3.prototype.riComponentGrid_UpdateExecute = function () {
        var _this = this;
        var search = this.context.getURLSearchParamObject();
        this.context.riComponentGrid.UpdateHeader = false;
        this.context.riComponentGrid.UpdateBody = true;
        this.context.riComponentGrid.UpdateFooter = true;
        search.set('action', '2');
        search.set('ContractNumber', this.context.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.context.getControlValue('PremiseNumber'));
        search.set('ProductCode', this.context.getControlValue('ProductCode'));
        search.set('ServiceCoverROWID', this.context.getControlValue('ServiceCoverROWID'));
        search.set('CompositeFrequency', this.context.getControlValue('ServiceVisitFrequency'));
        search.set('CompositeQuantity', this.context.getControlValue('ServiceQuantity'));
        search.set('CompositeValue', this.context.getControlValue('ServiceAnnualValue'));
        search.set('ROWID', this.context.getAttribute('ROWID'));
        search.set('GridCacheTime', this.context.getControlValue('ComponentGridCacheTime'));
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('PageSize', '10');
        search.set('PageCurrent', this.context.pageParams.riComponentGridPageCurrent.toString());
        search.set('HeaderClickedColumn', this.context.riComponentGrid.HeaderClickedColumn);
        var sortOrder = 'Descending';
        if (!this.context.riComponentGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.httpService.makeGetRequest(this.context.xhrParams.method, this.context.xhrParams.module, this.context.xhrParams.operation, search)
            .subscribe(function (data) {
            if (data) {
                _this.context.iCABSAServiceCoverMaintenance3.riComponentGrid_BeforeExecute();
            }
        }, function (error) {
            _this.context.pageParams.riComponentTotalRecords = 1;
            _this.context.ajaxSource.next(_this.context.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverMaintenance3.prototype.riComponentGrid_BodyOnClick = function (event) {
        if (this.context.pageParams.cmdSRAGenerateText.disabled === false) {
            this.context.iCABSAServiceCoverMaintenance3.SelectedRowFocus(event.srcElement.parentElement.parentElement.Children[0].Children[0]);
        }
    };
    ServiceCoverMaintenance3.prototype.riDisplayGrid_BeforeExecute = function () {
        this.context.riDisplayGrid.Execute({});
    };
    ServiceCoverMaintenance3.prototype.riDisplayGrid_AfterExecute = function (data) {
        this.context.pageParams.blnGridHasData = (data.length > 0);
        if (this.context.pageParams.blnGridHasData) {
            this.context.pageParams.uiDisplay.riGridHandle.value = this.context.riDisplayGrid.Details.GetAttribute('Component1', 'AdditionalProperty');
            if (this.context.pageParams.vbUpdate) {
                this.context.iCABSAServiceCoverMaintenance3.CalcDisplayValueChanges();
                this.context.pageParams.vbUpdate = false;
            }
        }
        this.context.riDisplayGrid.Update = false;
        this.context.pageParams.blnDeleteServiceCoverItem = false;
    };
    ServiceCoverMaintenance3.prototype.SelectedRowFocus = function (rsrcElement) {
        rsrcElement.select();
        this.context.setAttribute('Row', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
        this.context.setAttribute('Cell', rsrcElement.parentElement.parentElement.cellIndex);
        this.context.setAttribute('ROWID', rsrcElement.getAttribute('RowID'));
        rsrcElement.focus();
    };
    ServiceCoverMaintenance3.prototype.riComponentGrid_BodyOnDblClick = function (event) {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'cmdComponentSelAll')) {
            console.log('Column ', this.context.riComponentGrid.CurrentColumnName);
            if (this.context.riComponentGrid.CurrentColumnName === 'ComponentSelected') {
                this.context.iCABSAServiceCoverMaintenance3.SelectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
                this.context.riComponentGrid.Update = true;
                this.context.iCABSAServiceCoverMaintenance3.riComponentGrid_UpdateExecute();
            }
            this.context.iCABSAServiceCoverMaintenance3.SelectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
        }
    };
    ServiceCoverMaintenance3.prototype.CreateComponentGrid = function () {
        this.context.riComponentGrid.DefaultBorderColor = 'ADD8E6';
        this.context.riComponentGrid.DefaultTextColor = '0000FF';
        this.context.riComponentGrid.PageSize = 10;
        this.context.riComponentGrid.FunctionPaging = true;
        this.context.riComponentGrid.HighlightBar = true;
    };
    ServiceCoverMaintenance3.prototype.BuildComponentGrid = function () {
        this.context.riComponentGrid.Clear();
        this.context.riComponentGrid.AddColumn('ComponentProduct', 'Component', 'ComponentProduct', MntConst.eTypeCode, 6, false);
        this.context.riComponentGrid.AddColumn('ComponentDescription', 'Component', 'ComponentDescription', MntConst.eTypeTextFree, 20, false);
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riComponentGrid.AddColumn('ComponentQuantity', 'Component', 'ComponentQuantity', MntConst.eTypeInteger, 5, false);
            this.context.riComponentGrid.AddColumn('ComponentAnnualValue', 'Component', 'ComponentAnnualvalue', MntConst.eTypeCurrency, 15, false);
            this.context.riComponentGrid.AddColumn('ComponentExists', 'Component', 'ComponentExists', MntConst.eTypeImage, 1, false);
        }
        this.context.riComponentGrid.AddColumn('ServiceCoverQuantity', 'Component', 'ServiceCoverQuantity', MntConst.eTypeInteger, 5, false);
        this.context.riComponentGrid.AddColumn('ServiceCoverFrequency', 'Component', 'ServiceCoverFrequency', MntConst.eTypeInteger, 5, false);
        this.context.riComponentGrid.AddColumn('ServiceCoverAnnualValue', 'Component', 'ServiceCoverAnnualvalue', MntConst.eTypeCurrency, 15, false);
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riComponentGrid.AddColumn('ComponentSelected', 'Component', 'ComponentSelected', MntConst.eTypeImage, 1, false);
        }
        this.context.riComponentGrid.Complete();
    };
    ServiceCoverMaintenance3.prototype.CreateDisplayGrid = function () {
        this.context.riDisplayGrid.DefaultBorderColor = 'DDDDDD';
        this.context.riDisplayGrid.PageSize = 10;
        this.context.riDisplayGrid.FunctionPaging = true;
        this.context.riDisplayGrid.HighlightBar = true;
        this.context.riDisplayGrid.FunctionUpdateSupport = true;
    };
    ServiceCoverMaintenance3.prototype.BuildDisplayGrid = function () {
        this.context.riDisplayGrid.Clear();
        this.context.riDisplayGrid.AddColumn('ItemDescription', 'Display', 'ItemDescription', MntConst.eTypeCode, 20);
        this.context.riDisplayGrid.AddColumn('Component1', 'Display', 'Component1', MntConst.eTypeText, 20);
        this.context.riDisplayGrid.AddColumn('Component2', 'Display', 'Component2', MntConst.eTypeText, 20);
        this.context.riDisplayGrid.AddColumn('Component3', 'Display', 'Component3', MntConst.eTypeText, 20);
        this.context.riDisplayGrid.AddColumn('GridMaterialsValue', 'Display', 'GridMaterialsValue', MntConst.eTypeCurrency, 8);
        this.context.riDisplayGrid.AddColumn('GridLabourValue', 'Display', 'GridLabourValue', MntConst.eTypeCurrency, 8);
        this.context.riDisplayGrid.AddColumn('GridReplacementValue', 'Display', 'GridReplacementValue', MntConst.eTypeCurrency, 8);
        this.context.riDisplayGrid.AddColumn('CommenceDate', 'Display', 'CommenceDate', MntConst.eTypeDate, 10);
        this.context.riDisplayGrid.AddColumn('WED', 'Display', 'WED', MntConst.eTypeInteger, 6);
        this.context.riDisplayGrid.AddColumn('AnnualValue', 'Display', 'AnnualValue', MntConst.eTypeCurrency, 6);
        this.context.riDisplayGrid.AddColumn('DeletedDate', 'Display', 'DeletedDate', MntConst.eTypeDate, 10);
        this.context.riDisplayGrid.AddColumn('DeleteServiceCoverItem', 'Display', 'DeleteServiceCoverItem', MntConst.eTypeImage, 1, true);
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.context.riDisplayGrid.AddColumnUpdateSupport('GridMaterialsValue', true);
            this.context.riDisplayGrid.AddColumnUpdateSupport('GridLabourValue', true);
            this.context.riDisplayGrid.AddColumnUpdateSupport('GridReplacementValue', true);
        }
        this.context.riDisplayGrid.Complete();
    };
    ServiceCoverMaintenance3.prototype.tbodySCDispGrid_onDblClick = function (event) {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (event.srcElement.Name === 'DeleteServiceCoverItem' && event.srcElement.parentElement.tagname
                && event.srcElement.parentElement.tagname.toUpperCase() === 'TD') {
                if (this.context.getControlValue('LastChangeEffectDate.value') === '') {
                    this.context.iCABSAServiceCoverMaintenance3.DisplayValueError('');
                    this.context.renderTab(1);
                }
                else {
                    this.context.iCABSAServiceCoverMaintenance3.UpdateDisplayDelete(event);
                    this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
                }
            }
        }
    };
    ServiceCoverMaintenance3.prototype.UpdateDisplayDelete = function (event) {
        var oTR = event.srcElement.parentElement.parentElement;
        if (oTR.tagName && oTR.tagname.toUpperCase() === 'TD') {
            oTR = event.srcElement.parentElement.parentElement.parentElement;
        }
        this.context.riDisplayGrid.Update = true;
        this.context.setAttribute('ServiceCoverItemRowID', oTR.Children[0].Children[0].RowID);
        this.context.setAttribute('Row', oTR.sectionRowIndex);
        this.context.pageParams.blnDeleteServiceCoverItem = true;
        this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
    };
    ServiceCoverMaintenance3.prototype.riDisplayGrid_BodyColumnFocus = function (event) {
        var oTR = event.srcElement.parentElement.parentElement;
        if (oTR.tagName && oTR.tagname.toUpperCase() === 'TD') {
            oTR = event.srcElement.parentElement.parentElement.parentElement;
            switch (this.context.riDisplayGrid.CurrentColumnName) {
                case 'GridMaterialsValue':
                    ;
                    this.context.setAttribute('OrigMaterialsValue', event.srcElement.parentElement.parentElement.Children[0].AdditionalProperty);
                    this.context.setAttribute('ServiceCoverItemRowID', event.srcElement.parentElement.parentElement.Children[0].RowID);
                    this.context.setAttribute('Row', oTR.sectionRowIndex);
                    break;
                case 'GridLabourValue':
                    ;
                    this.context.setAttribute('OrigLabourValue', event.srcElement.parentElement.parentElement.Children[0].AdditionalProperty);
                    this.context.setAttribute('ServiceCoverItemRowID', event.srcElement.parentElement.parentElement.Children[0].RowID);
                    this.context.setAttribute('Row', oTR.sectionRowIndex);
                    break;
                case 'GridReplacementValue':
                    ;
                    this.context.setAttribute('OrigReplacementValue', event.srcElement.parentElement.parentElement.Children[0].AdditionalProperty);
                    this.context.setAttribute('ServiceCoverItemRowID', event.srcElement.parentElement.parentElement.Children[0].RowID);
                    this.context.setAttribute('Row', oTR.sectionRowIndex);
                    break;
            }
        }
    };
    ServiceCoverMaintenance3.prototype.riDisplayGrid_BodyColumnLostFocus = function (event) {
        var NewTotal;
        switch (this.context.riDisplayGrid.CurrentColumnName) {
            case 'GridMaterialsValue':
                ;
                if (!this.context.IsNumeric(event.srcElement.value)) {
                    event.srcElement.value = this.context.getAttribute('OrigMaterialsValue');
                }
                else if (this.context.CDbl(event.srcElement.value) > this.context.CDbl(this.context.getAttribute('OrigMaterialsValue'))
                    || (this.context.getControlValue('LastChangeEffectDate') === '' && this.context.CDbl(event.srcElement.value) !== this.context.CDbl(this.context.getAttribute('OrigMaterialsValue')))) {
                    this.context.iCABSAServiceCoverMaintenance3.DisplayValueError('Materials');
                    event.srcElement.value = this.context.getAttribute('OrigMaterialsValue');
                }
                else {
                    var NewTotal_1 = this.context.CDbl(event.srcElement.value) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridLabourValue')) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridReplacementValue'));
                    this.context.riDisplayGrid.Details.SetValue('AnnualValue', NewTotal_1);
                    this.context.riDisplayGrid.Update = true;
                    this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
                }
                break;
            case 'GridLabourValue':
                ;
                if (!this.context.IsNumeric(event.srcElement.value)) {
                    event.srcElement.value = this.context.getAttribute('OrigLabourValue');
                }
                else if (this.context.CDbl(event.srcElement.value) > this.context.CDbl(this.context.getAttribute('OrigLabourValue'))
                    || (this.context.getControlValue('LastChangeEffectDate') === '' && this.context.CDbl(event.srcElement.value) !== this.context.CDbl(this.context.getAttribute('OrigLabourValue')))) {
                    this.context.iCABSAServiceCoverMaintenance3.DisplayValueError('Labour');
                    event.srcElement.value = this.context.getAttribute('OrigLabourValue');
                }
                else {
                    var NewTotal_2 = this.context.CDbl(event.srcElement.value) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridMaterialsValue')) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridReplacementValue'));
                    this.context.riDisplayGrid.Details.SetValue('AnnualValue', NewTotal_2);
                    this.context.riDisplayGrid.Update = true;
                    this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
                }
                break;
            case 'GridReplacementValue':
                ;
                if (!this.context.IsNumeric(event.srcElement.value)) {
                    event.srcElement.value = this.context.getAttribute('OrigReplacementValue');
                }
                else if (this.context.CDbl(event.srcElement.value) > this.context.CDbl(this.context.getAttribute('OrigReplacementValue'))
                    || (this.context.getControlValue('LastChangeEffectDate') === '' && this.context.CDbl(event.srcElement.value) !== this.context.CDbl(this.context.getAttribute('OrigReplacementValue')))) {
                    this.context.iCABSAServiceCoverMaintenance3.DisplayValueError('Replacement');
                    event.srcElement.value = this.context.getAttribute('OrigReplacementValue');
                }
                else {
                    var NewTotal_3 = this.context.CDbl(event.srcElement.value) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridMaterialsValue')) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridLabourValue'));
                    this.context.riDisplayGrid.Details.SetValue('AnnualValue', NewTotal_3);
                    this.context.riDisplayGrid.Update = true;
                    this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
                }
                break;
        }
        if (this.context.getControlValue('LastChangeEffectDate') === '') {
            this.context.renderTab(1);
        }
    };
    ServiceCoverMaintenance3.prototype.CalcDisplayValueChanges = function () {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverReduceDisplayGrid.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'TotalDisplayValues', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('PremiseNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('ServiceCoverROWID', this.context.riExchange.getParentAttributeValue('ServiceCover'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('EffectiveDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'), MntConst.eTypeDate);
        this.context.riMaintenance.PostDataAdd('GridType', 'Main', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('riGridHandle', this.context.pageParams.uiDisplay.riGridHandle.value, MntConst.eTypeTextFree);
        this.context.riMaintenance.ReturnDataAdd('DisplayTotal', MntConst.eTypeDecimal1);
        this.context.riMaintenance.ReturnDataAdd('OrigTotal', MntConst.eTypeDecimal1);
        this.context.riMaintenance.ReturnDataAdd('Quantity', MntConst.eTypeInteger);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewTotalValue', data['DisplayTotal']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OrigTotalValue', data['OrigTotal']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualValueChange', parseFloat(data['DisplayTotal']) - parseFloat(data['OrigTotal']));
            this.context.attributes.AnnualValueChange_riChange = true;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceQuantity', data['Quantity']);
            this.context.attributes.ServiceQuantity_riChange = true;
            this.context.iCABSAServiceCoverMaintenance4.AnnualValueChangeonBlur();
        }, 'POST');
    };
    ServiceCoverMaintenance3.prototype.DisplayValueError = function (ipErrorType) {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverReduceDisplayGrid.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'DisplayValueError', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('ErrorType', ipErrorType, MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('LastChangeEffectDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'), MntConst.eTypeDate);
        this.context.riMaintenance.ReturnDataAdd('ErrorMessage', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            if (data['ErrorMessage']) {
                this.context.showAlert(data['ErrorMessage']);
            }
        });
    };
    ServiceCoverMaintenance3.prototype.cmdComponentSelAll_OnClick = function () {
        this.MultiSetComponents(true);
    };
    ServiceCoverMaintenance3.prototype.cmdComponentDesAll_OnClick = function () {
        this.MultiSetComponents(false);
    };
    ServiceCoverMaintenance3.prototype.MultiSetComponents = function (lSelectAll) {
        var cFunction;
        if (lSelectAll) {
            cFunction = 'SelectAll';
        }
        else {
            cFunction = 'DeselectAll';
        }
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverComponentGrid.p';
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', cFunction, MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('PremiseNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('CompositeFrequency', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('CompositeQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceQuantity'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('CompositeValue', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceAnnualValue'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('GridCacheTime', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ComponentGridCacheTime'), MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.iCABSAServiceCoverMaintenance3.riComponentGrid_BeforeExecute();
        }, 'POST');
    };
    ServiceCoverMaintenance3.prototype.BusinessOriginDetailDisplay = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DetailRequiredInd')) {
            this.context.pageParams.uiDisplay.trBusinessOriginDetailCode = true;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'BusinessOriginDetailCode', true);
        }
        else {
            this.context.pageParams.uiDisplay.trBusinessOriginDetailCode = false;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailCode', '');
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'BusinessOriginDetailCode', false);
        }
    };
    ServiceCoverMaintenance3.prototype.CheckWasteTransferRequired = function () {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresWasteTransferType')) {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'WasteTransferTypeCode', true);
        }
        else {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'WasteTransferTypeCode', false);
        }
    };
    ServiceCoverMaintenance3.prototype.ShowAverageWeight = function () {
        var bShowAverageWeight;
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'GetAverageWeightStatus', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('PremiseNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('NoAverageWeight', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data) {
            bShowAverageWeight = data['NoAverageWeight'];
            if (bShowAverageWeight === 'yes') {
                this.context.pageParams.uiDisplay.trAverageWeight = true;
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                    if (this.context.pageParams.vbEnableServiceCoverAvgWeightReq) {
                        if (this.context.pageParams.vbEnableServiceCoverAvgWeightText !== '') {
                            this.EnableAvgWeightForUser();
                        }
                        else {
                            this.context.riMaintenance.EnableInput('AverageWeight');
                        }
                    }
                    else {
                        this.context.riMaintenance.EnableInput.DisableInput('AverageWeight');
                    }
                }
            }
            else {
                this.context.pageParams.uiDisplay.trAverageWeight = false;
            }
            ;
        }, 'POST');
    };
    ServiceCoverMaintenance3.prototype.EnableAvgWeightForUser = function () {
        var bEnableAverageWeightForUser;
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'EnableAverageWeight', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('EnableAverageWeightText', this.context.pageParams.vbEnableServiceCoverAvgWeightText, MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('EnableAverageWeight', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data) {
            bEnableAverageWeightForUser = data['EnableAverageWeight'];
            if (bEnableAverageWeightForUser) {
                this.context.riMaintenance.EnableInput('AverageWeight');
            }
            else {
                this.context.riMaintenance.EnableInput.DisableInput('AverageWeight');
            }
        });
    };
    ServiceCoverMaintenance3.prototype.BuildTaxCodeCombo = function () {
        var strReturn, Arr, iLoop, ELLE, Pair;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
        this.context.riMaintenance.PostDataAdd('Function', 'BuildTaxCodeCombo', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('TaxCodeList', MntConst.eTypeTextFree);
        this.context.riMaintenance.Execute(this.context, function (data) {
            this.context.pageParams.selTaxCode = [];
            strReturn = data['TaxCodeList'];
            if (strReturn !== '') {
                Arr = strReturn.split(String.fromCharCode(1));
                for (var i = 0; i < Arr.length; i++) {
                    Pair = Arr[i].split('|');
                    var obj = {
                        text: Pair[0] + ' - ' + Pair[1],
                        value: Pair[0]
                    };
                    this.context.pageParams.selTaxCode.push(obj);
                }
                this.context.setControlValue('selTaxCode', this.context.getControlValue('TaxCode'));
            }
        }, 'POST');
    };
    ServiceCoverMaintenance3.prototype.SetReplacementIncInd = function () {
        switch (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ReplacementIncludeInd')) {
            case 'yes':
                this.context.pageParams.rsPlantReplaceIndyes = true;
                break;
            case 'no':
                this.context.pageParams.rsPlantReplaceIndno = true;
                break;
            case 'Mixed':
                this.context.pageParams.rsPlantReplaceIndmixed = true;
                break;
        }
    };
    ServiceCoverMaintenance3.prototype.riExchange_UpdateHTMLDocument = function () {
        if (this.context.parentMode === 'ServiceCoverCopy') {
            this.ServiceVisitFrequency_OnChange();
            if (this.context.pageParams.blnUseVisitCycleValues) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeks', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CopiedVisitCycleInWeeks'));
                this.context.iCABSAServiceCoverMaintenance2.VisitCycleInWeeks_OnChange();
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitsPerCycle', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CopiedVisitsPerCycle'));
                this.context.iCABSAServiceCoverMaintenance2.VisitsPerCycle_OnChange();
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'VisitCycleInWeeksOverrideNote', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CopiedVisitCycleInWeeksOverrideNote'));
            }
        }
    };
    return ServiceCoverMaintenance3;
}());
