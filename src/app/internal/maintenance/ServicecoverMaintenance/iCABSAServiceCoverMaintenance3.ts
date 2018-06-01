import { RiExchange } from './../../../../shared/services/riExchange';
import { InternalGridSearchModuleRoutes, AppModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalGridSearchApplicationModuleRoutesConstant } from './../../../base/PageRoutes';
import { ContractActionTypes } from './../../../actions/contract';
import { contact } from './../../../reducers/contact';
import { Injector } from '@angular/core';
import { ServiceCoverMaintenanceComponent } from './iCABSAServiceCoverMaintenance.component';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ContractManagementModuleRoutes } from '../../../base/PageRoutes';

export class ServiceCoverMaintenance3 {

    private context: ServiceCoverMaintenanceComponent;
    private injector: Injector;

    constructor(private parent: ServiceCoverMaintenanceComponent, injector: Injector) {
        this.context = parent;
    }

    public InvTypeSel_OnChange(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'InvoiceTypeNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'InvTypeSel'));
        this.context.iCABSAServiceCoverMaintenance4.ShowHideBudgetBilling();

        if (this.context.pageParams.vbEnableServiceCoverDispLev) {
            this.context.iCABSAServiceCoverMaintenance6.IsVisitTriggered();
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'VisitTriggered')) {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValue', '0');
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValueChange', '0');
                this.context.pageParams.uiDisplay.trUnitValue = false;
                this.context.pageParams.uiDisplay.trUnitValueChange = false;
            } else {
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {  // Add;
                    this.context.pageParams.uiDisplay.trUnitValue = true;
                } else {
                    this.context.pageParams.uiDisplay.trUnitValueChange = true;       // Update
                }
            }
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValue', '0');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'UnitValueChange', '0');
            this.context.pageParams.uiDisplay.trUnitValue = false;
            this.context.pageParams.uiDisplay.trUnitValueChange = false;
        }
    }

    public ServiceVisitFrequency_OnChange(event?: any): void {
        if (this.context.pageParams.blnUseVisitCycleValues) {
            this.context.iCABSAServiceCoverMaintenance2.GetVisitCycleValues();
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceVisitFrequencyCopy',
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'));
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
            } else {
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange') !== '0'
                    && this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'UnitValueChange') !== null) {
                    this.context.iCABSAServiceCoverMaintenance6.CalculateAnnualValueChange();
                }
            }
        }
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    }

    public ClosedCalendarTemplateNumber_onchange(obj: any): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ClosedTemplateName', '');
    }

    public AnnualCalendarTemplateNumber_onChange(obj: any): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'CalendarTemplateName', '');
    }

    public ContractNumber_onchange(): void {
        if (this.context.riExchange.riInputElement.HasChanged(this.context.uiForm, 'ContractNumber')) {
            if (!this.context.pageParams.FullAccess) {
                this.context.accessSubscription = this.context.utils.getUserAccessType().subscribe(data => {
                    this.context.pageParams.FullAccess = data;
                }, error => {
                    this.context.pageParams.FullAccess = 'Restricted';
                });
            }
            if (this.context.getControlValue('ContractNumber')) {
                this.context.setControlValue('ContractNumber', this.context.utils.fillLeadingZeros(this.context.getControlValue('ContractNumber'), 8));
                this.context.disableControl('PremiseNumber', false);
            } else {
                this.context.disableControl('PremiseNumber', true);
            }
            this.context.getSysCharDtetails(true);
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.context.iCABSAServiceCoverMaintenance3.GetDefaultTaxCode();
                this.context.iCABSAServiceCoverMaintenance3.BuildTaxCodeCombo();
            }
            this.context.serviceCoverSearchParams.ContractNumber = this.context.getControlValue('ContractNumber');
            this.context.inputParamsAccountPremise.ContractNumber = this.context.getControlValue('ContractNumber');
            this.context.linkedServiceCoverSearchParams.ContractNumber = this.context.getControlValue('ContractNumber');
        }
        document.querySelector('#PremiseNumber')['focus']();
    }

    public PremiseNumber_onchange(): void {
        if (this.context.getControlValue('PremiseNumber')) {
            this.context.serviceCoverSearchParams.PremiseNumber = this.context.getControlValue('PremiseNumber');
            this.context.linkedServiceCoverSearchParams.PremiseNumber = this.context.getControlValue('PremiseNumber');
            this.context.disableControl('ProductCode', false);
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.context.disableControl('cmdCopyServiceCover', false);
            }
        } else {
            this.context.disableControl('ProductCode', true);
        }
        document.querySelector('#ProductCode')['focus']();
    }

    public TaxCodeMaterials_onChange(): void {
        if (!this.context.fieldHasValue('TaxCodeMaterials')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterialsDesc', '');
        } else {
            this.context.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.context.riMaintenance.clear();
            this.context.riMaintenance.PostDataAdd('PostDesc', 'TaxCode', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('TaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCodeMaterials'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('TaxCodeDesc', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterialsDesc', data['TaxCodeDesc']);
            }, 'GET', 0);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeMaterialsDesc', '');
        }
    }

    public TaxCodeLabour_onChange(): void {
        if (!this.context.fieldHasValue('TaxCodeLabour')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabourDesc', '');
        } else {
            this.context.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.context.riMaintenance.clear();
            this.context.riMaintenance.PostDataAdd('PostDesc', 'TaxCode', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('TaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCodeLabour'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('TaxCodeDesc', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabourDesc', data['TaxCodeDesc']);
            }, 'GET', 0);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeLabourDesc', '');
        }
    }

    public TaxCodeReplacement_onChange(): void {
        if (!this.context.fieldHasValue('TaxCodeReplacement')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacementDesc', '');
        } else {
            this.context.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.context.riMaintenance.clear();
            this.context.riMaintenance.PostDataAdd('PostDesc', 'TaxCode', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('TaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCodeReplacement'), MntConst.eTypeText);
            this.context.riMaintenance.ReturnDataAdd('TaxCodeDesc', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacementDesc', data['TaxCodeDesc']);
            }, 'GET', 0);

            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCodeReplacementDesc', '');
        }
    }

    public GetDefaultTaxCode(): void {
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('Function', 'GetDefaultTaxCode', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractTypeCode', this.context.riExchange.getCurrentContractType(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('TaxCode', MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('TaxDesc', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxCode', data['TaxCode']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TaxDesc', data['TaxDesc']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selTaxCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'TaxCode'));
            if (this.context.pageParams.vbDefaultTaxCodeOnServiceCoverMaintLog === true) {
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'selTaxCode');
                this.context.pageParams.selTaxCode = [];
                let obj = {
                    text: data['TaxCode'] + ' - ' + data['TaxDesc'],
                    value: data['TaxCode']
                };
                this.context.pageParams.selTaxCode.push(obj);
            }
        }, 'POST');
    }

    public EntitlementAnnualQuantity_OnChange(): void {
        this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'EntitlementNextAnnualQuantity',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnualQuantity'));
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
    }

    public DepotNumber_onChange(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DepotNumber') &&
            !this.context.riExchange.riInputElement.isError(this.context.uiForm, 'DepotNumber')) {
            this.context.riMaintenance.clear();
            this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
            this.context.riMaintenance.PostDataAdd('Function', 'GetDepotName', MntConst.eTypeText);
            this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
            this.context.riMaintenance.PostDataAdd('DepotNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'DepotNumber'), MntConst.eTypeInteger);
            this.context.riMaintenance.ReturnDataAdd('DepotName', MntConst.eTypeText);
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepotName', data['DepotName']);
            }, 'POST');
        } else {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DepotName', '');
        }
    }

    public SetQuickWindowSetValue(strValue: string): void {
        for (let iLoop = 1; iLoop <= 7; iLoop++) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'selQuickWindowSet' + iLoop, strValue);
        }
    }

    public RenegOldContract_onchange(): void {
        if (this.context.getControlValue('RenegOldContract')) {
            this.context.setControlValue('RenegOldContract', this.context.utils.fillLeadingZeros(this.context.getControlValue('RenegOldContract'), 8));
        }
        this.context.inputRenegPremiseSearch.ContractNumber = this.context.getControlValue('RenegOldContract');
    }

    public InitialTreatmentTime_OnChange(): void {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('InitialTreatmentTime');
    }

    public StandardTreatmentTime_OnChange(): void {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('StandardTreatmentTime');
    }

    public ServiceAnnualTime_OnChange(): void {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('ServiceAnnualTime');
    }

    public AnnualTimeChange_OnChange(): void {
        if (this.context.formatTime(this.context.getControlValue('AnnualTimeChange'), 'AnnualTimeChange')) {
            this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        }
    }

    public SalesPlannedTime_OnChange(): void {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('SalesPlannedTime');
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ActualPlannedTime',
                this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'SalesPlannedTime'));
        }
    }

    public ActualPlannedTime_OnChange(): void {
        this.context.iCABSAServiceCoverMaintenance2.ProcessTimeString('ActualPlannedTime');
    }

    public MinimumDuration_OnChange(): void {
        if (!this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'MinimumDuration') ||
            !this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceCommenceDate')) {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ExpiryDate', '');
            this.context.pageParams.dtExpiryDate.value = null;
        } else {
            //this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ExpiryDate', 'DateAdd('m',MinimumDuration.value), ServiceCommenceDate.value);
            let months = parseInt(this.context.getControlValue('MinimumDuration'), 10);
            let temp = this.context.globalize.parseDateStringToDate(this.context.getControlValue('ServiceCommenceDate'));
            if (typeof temp !== 'boolean') {
                let newdate = new Date(temp.setMonth(temp.getMonth() + months));
                this.context.pageParams.dtExpiryDate.value = newdate;
            }
        }
    }
    public LeadEmployeeDisplay(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LeadInd')) {
            this.context.pageParams.uiDisplay.tdLeadEmployeeLabel = true;
            this.context.pageParams.LeadEmployee = true;
            this.context.pageParams.LeadEmployeeSurname = true;
            if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LeadEmployee', false);
            } else {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LeadEmployee', true);
            }
        } else {
            this.context.pageParams.uiDisplay.tdLeadEmployeeLabel = false;
            this.context.pageParams.LeadEmployee = false;
            this.context.pageParams.LeadEmployeeSurname = false;
            this.context.setControlValue('LeadEmployee', '');
            this.context.setControlValue('LeadEmployeeSurname', '');
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'LeadEmployee', false);
        }
    }

    public PopulateCompositeCode(): void {
        let iext;
        let ValArray;
        let DescArray;
        this.context.pageParams.selTaxCode = [];
        let CompositeCodeList = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CompositeCodeList');
        let CompositeDescList = this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CompositeDescList');
        if (CompositeCodeList && CompositeDescList) {
            ValArray = CompositeCodeList.split('^');
            DescArray = CompositeDescList.split('^');
            for (let i = 0; i < ValArray.length; i++) {
                let obj = {
                    text: ValArray[0] + ' - ' + DescArray[0],
                    value: ValArray[0]
                };
                this.context.pageParams.selTaxCode.push(obj);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'SelectCompositeProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CompositeProductCode'));
            }
        }
    }

    public DefaultFromProspect(): void {
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
            this.context.riMaintenance.Execute(this.context, function (data: any): any {
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginCode', data['BusinessOriginCode']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDesc', data['BusinessOriginDesc']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailCode', data['BusinessOriginDetailCode']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailDesc', data['BusinessOriginDetailDesc']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadEmployee', data['LeadEmployee']);
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadEmployeeSurname', data['LeadEmployeeSurname']);
                this.context.setBusinessOriginDropDownValue();
                if (this.context.LCase(data['LeadInd']) === 'yes' || this.context.LCase(data['LeadInd']) === 'true') {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadInd', true);
                } else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadInd', false);
                }
                if (this.context.LCase(data['DetailRequiredInd']) === 'yes' || this.context.LCase(data['DetailRequiredInd']) === 'true') {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DetailRequiredInd', true);
                } else {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DetailRequiredInd', false);
                }
            }, 'POST');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginCode', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDesc', '');
            this.context.setBusinessOriginDropDownValue();
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailCode', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailDesc', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadEmployee', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadEmployeeSurname', '');
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'LeadInd', false);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'DetailRequiredInd', false);
        }
    }

    public menu_onchange(event: any): void {

        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeAdd) {
            switch (event) {

                case 'ContactManagement':
                    this.context.iCABSAServiceCoverMaintenance3.cmdContactManagement_onclick();
                    break;
                case 'ContactManagementSearch': ;
                    this.context.navigate('ServiceCover', 'ccm/callcentersearch',
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
                        this.context.iCABSAServiceCoverMaintenance3.cmdServiceRecommendations_onclick();    // PDA Enhancements;
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
        } else {
            this.context.showAlert('In add mode, cannot navigate');
        }
        this.context.setControlValue('menu', 'Options');
    }

    //******************************************************
    //* Menu options/Buttons/Check boxes (onclick actions) *
    //******************************************************

    public SeasonalBranchUpdate_onclick(): void {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'SeasonalBranchUpdate')) {
            this.context.iCABSAServiceCoverMaintenance7.EnableSeasonalChanges(!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'SeasonalBranchUpdate'));
        }
    }

    public SeasonalFromWeekChange(ipFromWeek: any, ipFromYear: any, opFromDate: any): void {
        this.context.iCABSAServiceCoverMaintenance7.SeasonalWeekChange('GetWeekStartFromWeek', ipFromWeek, ipFromYear, opFromDate);
    }

    public SeasonalToWeekChange(ipFromWeek: any, ipFromYear: any, opFromDate: any): void {
        this.context.iCABSAServiceCoverMaintenance7.SeasonalWeekChange('GetWeekEndFromWeek', ipFromWeek, ipFromYear, opFromDate);
    }

    public cmdCustomerInformation_onclick(): void {
        this.context.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_2, {
            'contractNumber': this.context.getControlValue('ContractNumber'),
            'contractName': this.context.getControlValue('ContractName'),
            'accountNumber': this.context.getControlValue('AccountNumber'),
            'accountName': this.context.getControlValue('AccountName'),
            'currentContractType': this.context.riExchange.getCurrentContractType()
        });
    }

    public tdCustomerInfo_onclick(): void {
        this.cmdCustomerInformation_onclick();
    }

    public cmdContactManagement_onclick(): void {

        if (this.context.pageParams.lRegContactCentreReview) {
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
                    'currentContractType': this.context.riExchange.getCurrentContractType()
                }
            });
            this.context.navigate('ServiceCover', 'ccm/centreReview');
        } else {
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
                    'currentContractType': this.context.riExchange.getCurrentContractType()
                }
            });
            this.context.navigate('ServiceCover', 'ccm/contact/search');
        }
    }

    public cmdHistory_onclick(): void {
        /*this.context.store.dispatch({
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
                'ContractRowID': this.context.getControlValue('ServiceCoverROWID'),
                'currentContractType': this.context.riExchange.getCurrentContractType(),
                'countryCode': this.context.utils.getCountryCode()
            }
        });*/
        this.context.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSACONTRACTHISTORYGRID, {
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
    }

    public cmdServiceValue_onclick(): void {
        this.context.navigate('ServiceCoverAll', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID,
            {
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
    }

    public cmdLocation_onclick(): void {
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            this.context.navigate('Premise-Allocate', InternalGridSearchSalesModuleRoutes.ICABSAEMPTYPREMISELOCATIONSEARCHGRID);
        } else {
            if (this.context.pageParams.vbEnableDetailLocations &&
                this.context.riExchange.riInputElement.checked(this.context.uiForm, 'LocationsEnabled')) {
                this.context.navigate('ProductDetailSC', InternalGridSearchServiceModuleRoutes.ICABSASERVICECOVERDETAILLOCATIONENTRYGRID,
                    {
                        'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID')
                    });
            } else {
                this.context.navigate('Premise-Allocate', 'application/premiseLocationAllocation');
            }
        }
    }

    public cmdVisitHistory_onclick(): void {
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
                'ServiceVisitFrequency': this.context.getControlValue('ServiceVisitFrequency'),
                'currentContractType': this.context.riExchange.getCurrentContractType()
            }
        });
        this.context.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVISITSUMMARY);
    }

    public cmdServiceDetail_onclick(): void {
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
    }

    public cmdProRata_onclick(): void {
        this.context.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY, {
            'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
            'currentContractType': this.context.riExchange.getCurrentContractType()
        });
    }

    public cmdInvoiceHistory_onclick(): void {
        //riExchange.Mode = 'Product';
        //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Application/iCABSAContractInvoiceGrid.htm<maxwidth>' + CurrentContractTypeURLParameter;
        this.context.navigate('Product', 'billtocash/contract/invoice',
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
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'currentContractType': this.context.riExchange.getCurrentContractType()
            });
    }

    public cmdStateOfService_onclick(): void {
        alert(' Open iCABSSeStateOfServiceNatAccountGrid wheh available');
        //riExchange.Mode = 'SOS';
        //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Service/iCABSSeStateOfServiceNatAccountGrid.htm<maxwidth>';
    }

    public cmdValue_onclick(): void {
        this.context.navigate('ServiceCoverAll', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID,
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
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'currentContractType': this.context.riExchange.getCurrentContractType()
            });
    }

    public cmdPlanVisit_onclick(): void {
        this.context.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR,
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
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'currentContractType': this.context.riExchange.getCurrentContractType(),
                'CurrentContractTypeURLParameter': this.context.riExchange.getCurrentContractTypeUrlParam()
            });
    }

    public cmdTreatmentPlan_onclick(): void {
        alert(' Open iCABSATreatmentPlan wheh available');
        //riExchange.Mode = 'TreatmentPlan';
        //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Application/iCABSATreatmentPlan.htm<maxwidth>' + CurrentContractTypeURLParameter;
    }

    public cmdPlanVisitTabular_onclick(): void {
        if (this.context.pageParams.vEnableTabularView) {
            this.context.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSAPLANVISITTABULAR,
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
                    'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                    'CurrentContractTypeURLParameter': this.context.riExchange.getCurrentContractTypeUrlParam()
                });
        }
    }

    public cmdStaticVisit_onclick(): void {
        this.context.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSASTATICVISITGRIDYEAR,
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
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'currentContractType': this.context.riExchange.getCurrentContractType()
            });
    }

    public cmdServiceRecommendations_onclick(): void {
        this.context.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSARECOMMENDATIONGRID.URL_1,
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
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'currentContractType': this.context.riExchange.getCurrentContractType()
            });
    }

    public cmdSalesStatsAdjustment_onclick(): void {
        alert(' Open iCABSSSalesStatisticsServiceValueGrid wheh available');
        //riExchange.Mode = 'ServiceCover';
        //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Sales/iCABSSSalesStatisticsServiceValueGrid.htm<maxwidth>' + CurrentContractTypeURLParameter;
    }

    public cmdSeasonalService_onclick(): void {
        this.context.navigate('ServiceCover', InternalGridSearchApplicationModuleRoutes.ICABSASERVICECOVERSEASONGRID,
            {
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID')
            });
    }

    public cmdServiceVisitPlanning_onclick(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            this.context.attributes.Mode = 'Update';
            //riExchange.Mode = 'ServiceCover';
            //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Application/iCABSAServiceVisitPlanningGrid.htm<maxwidth>';
            alert(' Open iCABSAServiceVisitPlanningGrid wheh available');
        } else {
            this.context.showAlert('Product Does Not Require Manual Visit Planning', 3);
        }
    }

    public cmdLinkedProducts_onclick(): void {
        this.context.attributes.Mode = 'Update';
        //alert(' Open iCABSALinkedProductsGrid wheh available');
        //riExchange.Mode = 'ServiceCover';
        //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Application/iCABSALinkedProductsGrid.htm<maxwidth>' + CurrentContractTypeURLParameter;

        this.context.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSALINKEDPRODUCTSGRID,
            {
                'ContractNumber': this.context.getControlValue('ContractNumber'),
                'ContractName': this.context.getControlValue('ContractName'),
                'PremiseNumber': this.context.getControlValue('PremiseNumber'),
                'PremiseName': this.context.getControlValue('PremiseName'),
                'ProductCode': this.context.getControlValue('ProductCode'),
                'ProductDesc': this.context.getControlValue('ProductDesc'),
                'DispenserInd': this.context.getControlValue('DispenserInd'),
                'ConsumableInd': this.context.getControlValue('ConsumableInd'),
                'ServiceVisitFrequency': this.context.getControlValue('ServiceVisitFrequency'),
                'ServiceCoverNumber': this.context.getControlValue('LinkedServiceCoverNumber'),
                'ServiceCoverRowID': this.context.getControlValue('ServiceCoverROWID'),
                'currentContractType': this.context.riExchange.getCurrentContractType()
            });


    }

    public cmdServiceCalendar_onclick(): void {
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'AnnualCalendarInd')) {
                this.context.navigate('ServiceCover', InternalGridSearchApplicationModuleRoutes.ICABSASERVICECOVERCALENDARDATEGRID,
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
                        'ServiceCover': this.context.getControlValue('ServiceCoverROWID'),
                        'CalendarUpdateAllowed': this.context.getControlValue('CalendarUpdateAllowed'),
                        'ServiceVisitFrequency': this.context.getControlValue('ServiceVisitFrequency'),
                        'currentContractType': this.context.riExchange.getCurrentContractType()
                    });
            }
        }
    }

    public cmdClosedCalendar_onclick(): void {
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            //alert(' Open iCABSAServiceCoverClosedDateGrid wheh available');
            //riExchange.Mode = 'ServiceCover';
            //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Application/iCABSAServiceCoverClosedDateGrid.htm<maxwidth>';
            this.context.navigate('ServiceCover', InternalGridSearchApplicationModuleRoutes.ICABSASERVICECOVERCLOSEDDATEGRID);
        }
    }

    public cmdAnnualCalendar_onclick(): void {
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            alert(' Open iCABSAServiceCoverCalendarDatesMaintenance wheh available');
            //riExchange.Mode = 'ServiceCover';
            //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Application/iCABSAServiceCoverCalendarDatesMaintenance.htm<maxwidth>';
        }
    }

    public cmdSeasonalMaint_onclick(): void {
        if (!this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresManualVisitPlanningInd')) {
            alert(' Open iCABSAServiceCoverSeasonalDatesMaintenance wheh available');
            //riExchange.Mode = 'ServiceCover';
            //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Application/iCABSAServiceCoverSeasonalDatesMaintenance.htm<maxwidth>';
        }
    }

    public cmdServiceCoverWaste_onclick(): void {
        this.context.navigate('ServiceCover', InternalGridSearchApplicationModuleRoutes.ICABSASERVICECOVERWASTEGRID);
    }

    public cmdWasteConsignmentNoteHistory_onclick(): void {
        alert(' Open iCABSAWasteConsignmentNoteHistoryGrid wheh available');
        //riExchange.Mode = 'Product';
        //location = '/wsscripts/riHTMLWrapper.p?rif(ileName=Application/iCABSAWasteConsignmentNoteHistoryGrid.htm<maxwidth>' + CurrentContractTypeURLParameter;
    }

    public chkRenegContract_onclick(): void {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'chkRenegContract')) {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'chkRenegContract')) {
                this.context.pageParams.uiDisplay.tdRenegOldContract = true;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldContract', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldPremise', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldValue', true);
                //if( Update Mode ) { blank out Contract/Premise/Value to be re-entered;
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RenegOldContract', '');
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RenegOldPremise', '');
                    this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'RenegOldValue', '');
                }
            } else {
                this.context.pageParams.uiDisplay.tdRenegOldContract = false;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldContract', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldPremise', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'RenegOldValue', false);
            }
        }
    }

    public chkFOC_onclick(): void {
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
                // Disable Trial Period Indicator;
                this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'TrialPeriodInd', false);
                this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
                this.context.riExchange.riInputElement.Disable(this.context.uiForm, 'TrialPeriodInd');
            } else {
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
                // Enable Trial Period Indicator if( this is a Contract;
                if (this.context.riExchange.getCurrentContractType() === 'C') {
                    this.context.pageParams.uiDisplay.tdTrialPeriodInd = true;
                    this.context.iCABSAServiceCoverMaintenance7.ToggleTrialPeriodStatus();
                    this.context.riExchange.riInputElement.Enable(this.context.uiForm, 'TrialPeriodInd');
                }
            }
        }
    }

    public cmdEventHistory_onclick(): void {
        this.context.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSCMCUSTOMERCONTACTHISTORYGRID);
    }

    public cmdContract_onclick(): void {
        let url = '/contractmanagement/maintenance/contract';
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
        /*this.context.store.dispatch({
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
        });*/
        this.context.navigate('ServiceCover', url,
            {
                'ContractNumber': this.context.getControlValue('ContractNumber')
            });
    }

    public cmdPremise_onclick(): void {
        this.context.navigate('ServiceCover', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
    }

    public cmdCopyServiceCover_onclick(): void {
        //this.context.navigate('ServiceCoverCopy', 'application/serviceCoverSearch');
        this.context.iCABSAServiceCoverMaintenance4.riExchange_CBORequest();
        this.context.serviceCoverCopy.openModal();
    }

    public cmdRefreshDisplayVal_onclick(): void {
        if (this.context.pageParams.vbEnableServiceCoverDispLev &&
            this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd')) {
            this.context.iCABSAServiceCoverMaintenance1.CalDisplayValues();
        }
    }

    public ToggleEntitlementRequired(): void {
        if (!(this.context.riExchange.riInputElement.checked(this.context.uiForm, 'EntitlementRequiredInd'))) {
            if (this.context.riExchange.getCurrentContractType() === 'C') {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementAnnivDate', false);    // RT402;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementAnnualQuantity', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementNextAnnualQuantity', false); // #19864;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementPricePerUnit', false);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementInvoiceTypeCode', false); // SRS 19;
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementAnnivDate', false);       // RT402;
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementAnnualQuantity', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementNextAnnualQuantity', false); // #19864;
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementPricePerUnit', false);
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementInvoiceTypeCode', false); // SRS 19;
                this.context.riExchange.riInputElement.SetErrorStatus(this.context.uiForm, 'EntitlementServiceQuantity', false);
            }
            this.context.pageParams.uiDisplay.tdEntitlement = false;
            this.context.pageParams.uiDisplay.trEntitlementInvoice = false; // SRS 19;
            this.context.iCABSAServiceCoverMaintenance3.MinCommitQtyToggle();
        } else {
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnivDate') === '') {  // SRS 19 Set default date' );
                this.context.setDateToFields('EntitlementAnnivDate',
                    this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitAnnivDate'));
            }
            if (this.context.riExchange.getCurrentContractType() === 'C') {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementAnnivDate', true);    // RT402;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementAnnualQuantity', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementNextAnnualQuantity', true); // #19864;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementPricePerUnit', true);
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementInvoiceTypeCode', true);  // SRS 19;
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'EntitlementServiceQuantity', false);
            }
            this.context.iCABSAServiceCoverMaintenance3.MinCommitQtyToggle();
            this.context.pageParams.uiDisplay.tdEntitlement = true;
            this.context.pageParams.uiDisplay.trEntitlementInvoice = true;  // SRS 19;
        }
    }

    public MinCommitQtyToggle(): void {
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
        } else {
            if (this.context.pageParams.uiDisplay.trServiceVisitFrequency === true) {
                this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceVisitFrequency', true);
            }
            if (this.context.pageParams.uiDisplay.trServiceAnnualValue === true) {
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate && this.context.riExchange.URLParameterContains('PendingReduction')) {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualValue', false);
                } else {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceAnnualValue', true);
                }
            }
            if (this.context.pageParams.uiDisplay.trServiceQuantity === true) {
                if (this.context.pageParams.vbEnableServiceCoverDispLev &&
                    this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DisplayLevelInd') &&
                    this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate && this.context.riExchange.URLParameterContains('PendingReduction')) {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceQuantity', false);
                } else {
                    this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'ServiceQuantity', true);
                }
            }
            this.context.pageParams.spanEntitlementAnnivDateLab_innerText = 'Entitlement Anniversary Date';
            this.context.pageParams.spanEntitlementAnnualQuantityLab_innerText = 'Annual Entitlement Quantity';
            this.context.pageParams.spanEntitlementNextAnnualQuantityLab_innerText = 'Next Year\'s Entitlement Quantity';
        }
    }

    public btnDefaultServiceQuantity_onClick(): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'GetServiceVisitQuantity', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ServiceVisitFrequency',
            this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ServiceVisitFrequency'), MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('EntitlementAnnualQuantity', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'EntitlementAnnualQuantity'), MntConst.eTypeInteger);
        this.context.riMaintenance.ReturnDataAdd('EntitlementServiceVisitQuantity', MntConst.eTypeInteger);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'EntitlementServiceQuantity', data['EntitlementServiceVisitQuantity']);
        }, 'POST');
    }

    public MultipleTaxRates_onClick(): void {
        if (this.context.riMaintenance.CurrentMode !== MntConst.eModeNormal && this.context.pageParams.vbOverrideMultipleTaxRates) {
            if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'MultipleTaxRates')) {
                this.context.pageParams.uiDisplay.trTaxHeadings = true;
                this.context.pageParams.uiDisplay.trTaxMaterials = true;
                this.context.pageParams.uiDisplay.trTaxLabour = true;
                this.context.pageParams.uiDisplay.trTaxReplacement = true;
                this.context.pageParams.uiDisplay.trConsolidateEqualTaxRates = true;
                if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode')) {
                    this.context.iCABSAServiceCoverMaintenance6.GetDefaultMultipleTaxRates();
                }
            } else {
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
    }

    public riTab_TabFocusAfterComponent(): void {
        //if (this.context.pageParams.CurrentTabid === 'grdComponent') {
        this.context.pageParams.uiDisplay.trComponentGrid = true;
        this.context.pageParams.uiDisplay.trComponentGridControls = true;
        this.context.pageParams.uiDisplay.trComponentControls = true;
        this.context.iCABSAServiceCoverMaintenance3.BuildComponentGrid();
        this.context.iCABSAServiceCoverMaintenance3.riComponentGrid_BeforeExecute();
        // } else {
        //     this.context.pageParams.uiDisplay.trComponentGrid = false;
        //     this.context.pageParams.uiDisplay.trComponentGridControls = false;
        //     this.context.pageParams.uiDisplay.trComponentControls = false;
        // }
    }

    public riTab_TabFocusAfterDisplays(): void {
        if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'CurrentServiceCoverRowID')) {
            //make sure values are reassigned after save;
            if (this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'riGridHandle') === '') {
                this.context.pageParams.riDisplayGrid_RequestCacheRefresh = true;
            } else {
                this.context.pageParams.riDisplayGrid_RequestCacheRefresh = false;
            }
            this.context.iCABSAServiceCoverMaintenance3.BuildDisplayGrid();
            this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
        }
    }

    public riComponentGrid_BeforeExecute(): void {
        let search = this.context.getURLSearchParamObject();
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
        let sortOrder = 'Descending';
        if (!this.context.riComponentGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);

        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.httpService.makeGetRequest(this.context.xhrParams.method, this.context.xhrParams.module,
            this.context.xhrParams.operation, search)
            .subscribe(
            (data) => {
                if (data) {
                    this.context.pageParams.riComponentGridPageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.context.pageParams.riComponentTotalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    //   this.context.riComponentGrid.Update = true;
                    this.context.riComponentGrid.UpdateBody = true;
                    this.context.riComponentGrid.UpdateFooter = true;
                    this.context.riComponentGrid.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.context.showAlert(data);
                    } else {
                        this.context.riComponentGrid.Execute(data);
                    }
                }
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            },
            error => {
                this.context.pageParams.riComponentTotalRecords = 1;
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            });
    }

    public riComponentGrid_UpdateExecute(): void {
        let search = this.context.getURLSearchParamObject();
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
        let sortOrder = 'Descending';
        if (!this.context.riComponentGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);

        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.httpService.makeGetRequest(this.context.xhrParams.method, this.context.xhrParams.module,
            this.context.xhrParams.operation, search)
            .subscribe(
            (data) => {
                if (data) {
                    this.context.iCABSAServiceCoverMaintenance3.riComponentGrid_BeforeExecute();
                }
            },
            error => {
                this.context.pageParams.riComponentTotalRecords = 1;
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            });
    }

    public riComponentGrid_BodyOnClick(event: any): void {
        if (this.context.pageParams.cmdSRAGenerateText.disabled === false) { // Only allow when adding/updating etc...;
            this.context.iCABSAServiceCoverMaintenance3.SelectedRowFocus(event.srcElement.parentElement.parentElement.children[0].children[0]);
        }
    }

    public riDisplayGrid_BeforeExecute(): void {
        //don//t refresh the grid when using the refresh button;
        // if (riDisplayGrid.Mode !== 3 && riDisplayGrid.Action === 2 && not this.pageParams.vb Abandon ) {
        //     riDisplayGrid.RequestCacheRefresh = false;
        // }
        // //make sure values are reassigned after save;
        // if (riGridHandle.value === true) {
        //     riDisplayGrid.RequestCacheRefresh = true;
        // }
        // riDisplayGrid.BusinessObjectPostData = 'BusinessCode=' & riExchange.Functions.ClientSideValues.Fetch('BusinessCode') & _;
        // '&ContractNumber=' & ContractNumber.value & _;
        // '&PremiseNumber=' & PremiseNumber.value & _;
        // '&ProductCode=' & ProductCode.value & _;
        // '&ServiceCoverROWID=' & this.context.riMaintenance.GetRowID('ServiceCover') & _;
        // '&ServiceCoverItemRowID=' & grdServiceCoverItem.getAttribute('ServiceCoverItemRowID') & _;
        // '&DeleteSCItem=' & GetLogicalStringValue(blnDeleteServiceCoverItem) & _;
        // '&EffectiveDate=' & LastChangeEffectDate.value & _;
        // '&GridType=Main';
        // if (riDisplayGrid.Update) {
        //     riDisplayGrid.StartRow = grdServiceCoverItem.getAttribute('Row');
        //     riDisplayGrid.StartColumn = 0;
        //     riDisplayGrid.RowID = grdServiceCoverItem.getAttribute('ServiceCoverItemRowID');
        //     riDisplayGrid.UpdateHeader = false;
        //     riDisplayGrid.UpdateBody = true;
        //     riDisplayGrid.UpdateFooter = false;
        //     this.pageParams.vb Update                   = true;
        // }
        let search = this.context.getURLSearchParamObject();
        this.context.riDisplayGrid.UpdateHeader = false;
        this.context.riDisplayGrid.UpdateBody = true;
        this.context.riDisplayGrid.UpdateFooter = true;
        let RequestCacheRefresh = false;
        if (!this.context.pageParams.riGridHandlevalue) {
            this.context.pageParams.riGridHandlevalue = (Math.floor(Math.random() * 900000) + 100000).toString();
            this.context.setControlValue('riGridHandle', this.context.pageParams.riGridHandlevalue);
            RequestCacheRefresh = true;
        }
        search.set('action', '2');
        search.set('ContractNumber', this.context.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.context.getControlValue('PremiseNumber'));
        search.set('ProductCode', this.context.getControlValue('ProductCode'));
        search.set('ServiceCoverROWID', this.context.getControlValue('ServiceCoverROWID'));
        search.set('ServiceCoverItemRowID', this.context.getAttribute('ServiceCoverItemRowID') ? this.context.getAttribute('ServiceCoverItemRowID') : '');
        search.set('DeleteSCItem', this.context.pageParams.blnDeleteServiceCoverItem ? 'true' : 'false');
        search.set('EffectiveDate', this.context.getControlValue('LastChangeEffectDate') ? this.context.getControlValue('LastChangeEffectDate') : '');
        search.set('GridType', 'Main');
        search.set('riGridMode', '0');
        search.set('riGridHandle', this.context.pageParams.riGridHandlevalue);
        search.set('PageSize', '10');
        if (RequestCacheRefresh) {
            search.set('riCacheRefresh', 'true');
        }
        search.set('PageCurrent', this.context.pageParams.riDisplayGridPageCurrent.toString());
        search.set('HeaderClickedColumn', this.context.riDisplayGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.context.riDisplayGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);

        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.httpService.makeGetRequest(this.context.xhrParams.method, this.context.xhrParams.module,
            this.context.xhrParams.operation, search)
            .subscribe(
            (data) => {
                if (data) {
                    this.context.pageParams.DisplayGridPageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.context.pageParams.riDisplayGridTotalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    //this.context.riDisplayGrid.Update = true;
                    this.context.riDisplayGrid.UpdateBody = true;
                    this.context.riDisplayGrid.UpdateFooter = true;
                    this.context.riDisplayGrid.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.context.showAlert(data);
                    } else {
                        this.context.riDisplayGrid.Execute(data);
                        this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_AfterExecute(data);
                    }
                }
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            },
            error => {
                this.context.pageParams.riDisplayGridTotalRecords = 1;
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            });
    }

    public riDisplayGrid_UpdateExecute(): void {
        let search = this.context.getURLSearchParamObject();
        this.context.riDisplayGrid.UpdateHeader = false;
        this.context.riDisplayGrid.UpdateBody = true;
        this.context.riDisplayGrid.UpdateFooter = true;
        search.set('action', '2');
        search.set('ContractNumber', this.context.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.context.getControlValue('PremiseNumber'));
        search.set('ProductCode', this.context.getControlValue('ProductCode'));
        search.set('ServiceCoverROWID', this.context.getControlValue('ServiceCoverROWID'));
        search.set('ServiceCoverItemRowID', this.context.getAttribute('ServiceCoverItemRowID') ? this.context.getAttribute('ServiceCoverItemRowID') : '');
        search.set('DeleteSCItem', this.context.pageParams.blnDeleteServiceCoverItem ? 'True' : 'False');
        search.set('EffectiveDate', this.context.getControlValue('LastChangeEffectDate') ? this.context.getControlValue('LastChangeEffectDate') : '');
        search.set('GridType', 'Main');
        search.set('ROWID', this.context.getAttribute('ServiceCoverItemRowID') ? this.context.getAttribute('ServiceCoverItemRowID') : '');
        search.set('riGridMode', '0');
        search.set('riGridHandle', this.context.pageParams.riGridHandlevalue);
        search.set('PageSize', '10');
        search.set('PageCurrent', this.context.pageParams.riDisplayGridPageCurrent.toString());
        search.set('HeaderClickedColumn', this.context.riDisplayGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.context.riDisplayGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.httpService.makeGetRequest(this.context.xhrParams.method, this.context.xhrParams.module,
            this.context.xhrParams.operation, search)
            .subscribe(
            (data) => {
                if (data) {
                    //this.context.riDisplayGrid.Update = true;
                    this.context.riDisplayGrid.UpdateBody = true;
                    this.context.riDisplayGrid.UpdateFooter = true;
                    this.context.riDisplayGrid.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.context.showAlert(data);
                    } else {
                        this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_AfterUpdate();
                    }
                }
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            },
            error => {
                this.context.pageParams.riDisplayGridTotalRecords = 1;
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            });
    }

    public riDisplayGrid_UpdateEditExecute(): void {
        let search = this.context.getURLSearchParamObject();
        this.context.riDisplayGrid.UpdateHeader = false;
        this.context.riDisplayGrid.UpdateBody = true;
        this.context.riDisplayGrid.UpdateFooter = true;
        search.set('action', '0');
        search.set('ItemDescriptionRowID', this.context.getAttribute('ServiceCoverItemRowID') ? this.context.getAttribute('ServiceCoverItemRowID') : '');
        search.set('ItemDescription', this.context.riDisplayGrid.Details.GetValue('ItemDescription'));
        search.set('Component1', this.context.riDisplayGrid.Details.GetValue('Component1'));
        search.set('Component2', this.context.riDisplayGrid.Details.GetValue('Component2'));
        search.set('Component3', this.context.riDisplayGrid.Details.GetValue('Component3'));
        search.set('GridMaterialsValueRowID', this.context.getAttribute('ServiceCoverItemRowID') ? this.context.getAttribute('ServiceCoverItemRowID') : '');
        search.set('GridMaterialsValue', this.context.riDisplayGrid.Details.GetValue('GridMaterialsValue'));
        search.set('GridLabourValueRowID', this.context.getAttribute('ServiceCoverItemRowID') ? this.context.getAttribute('ServiceCoverItemRowID') : '');
        search.set('GridLabourValue', this.context.riDisplayGrid.Details.GetValue('GridLabourValue'));
        search.set('GridReplacementValueRowID', this.context.getAttribute('ServiceCoverItemRowID') ? this.context.getAttribute('ServiceCoverItemRowID') : '');
        search.set('GridReplacementValue', this.context.riDisplayGrid.Details.GetValue('GridReplacementValue'));
        search.set('ContractNumber', this.context.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.context.getControlValue('PremiseNumber'));
        search.set('ProductCode', this.context.getControlValue('ProductCode'));
        search.set('ContractNumber', this.context.getControlValue('ContractNumber'));
        search.set('PremiseNumber', this.context.getControlValue('PremiseNumber'));
        search.set('ProductCode', this.context.getControlValue('ProductCode'));
        search.set('ServiceCoverROWID', this.context.getControlValue('ServiceCoverROWID'));
        search.set('ServiceCoverItemRowID', this.context.getAttribute('ServiceCoverItemRowID') ? this.context.getAttribute('ServiceCoverItemRowID') : '');
        search.set('DeleteSCItem', this.context.pageParams.blnDeleteServiceCoverItem ? 'True' : 'False');
        search.set('EffectiveDate', this.context.getControlValue('LastChangeEffectDate') ? this.context.getControlValue('LastChangeEffectDate') : '');
        search.set('GridType', 'Main');
        search.set('ROWID', this.context.getAttribute('ServiceCoverItemRowID') ? this.context.getAttribute('ServiceCoverItemRowID') : '');
        search.set('riGridMode', '3');
        search.set('riGridHandle', this.context.pageParams.riGridHandlevalue);
        search.set('PageSize', '10');
        search.set('PageCurrent', this.context.pageParams.riDisplayGridPageCurrent.toString());
        search.set('HeaderClickedColumn', this.context.riDisplayGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.context.riDisplayGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);
        this.context.ajaxSource.next(this.context.ajaxconstant.START);
        this.context.httpService.makeGetRequest(this.context.xhrParams.method, this.context.xhrParams.module,
            this.context.xhrParams.operation, search)
            .subscribe(
            (data) => {
                if (data) {
                    //this.context.riDisplayGrid.Update = true;
                    this.context.riDisplayGrid.UpdateBody = true;
                    this.context.riDisplayGrid.UpdateFooter = true;
                    this.context.riDisplayGrid.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.context.showAlert(data);
                    } else {
                        this.context.riExchange.updateCtrl(this.context.controls, 'riGridHandle', 'ignoreSubmit', false);
                        this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_AfterUpdate();
                    }
                }
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            },
            error => {
                this.context.pageParams.riDisplayGridTotalRecords = 1;
                this.context.ajaxSource.next(this.context.ajaxconstant.COMPLETE);
            });
    }

    public riDisplayGrid_AfterUpdate(): void {
        this.context.iCABSAServiceCoverMaintenance3.CalcDisplayValueChanges();
        this.context.pageParams.vbUpdate = false;
        //this.context.riDisplayGrid.Update = false;
        this.context.pageParams.blnDeleteServiceCoverItem = false;
        this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_BeforeExecute();
    }

    public riDisplayGrid_AfterExecute(data: any): void {
        this.context.pageParams.blnGridHasData = (data.length > 0);
        if (this.context.pageParams.blnGridHasData) {
            //this.context.pageParams.riGridHandlevalue = this.context.riDisplayGrid.Details.GetAttribute('Component1', 'AdditionalProperty');
            if (this.context.pageParams.vbUpdate) {
                this.context.iCABSAServiceCoverMaintenance3.CalcDisplayValueChanges();
                this.context.pageParams.vbUpdate = false;
            }
        }
        //this.context.riDisplayGrid.Update = false;
        this.context.pageParams.blnDeleteServiceCoverItem = false;
    }

    public SelectedRowFocus(rsrcElement: any): void {
        rsrcElement.select();
        this.context.setAttribute('Row', rsrcElement.parentElement.parentElement.parentElement.sectionRowIndex);
        this.context.setAttribute('Cell', rsrcElement.parentElement.parentElement.cellIndex);
        this.context.setAttribute('ROWID', rsrcElement.getAttribute('RowID'));
        rsrcElement.focus();
    }

    public riComponentGrid_BodyOnDblClick(event: any): void {
        if (!this.context.riExchange.riInputElement.isDisabled(this.context.uiForm, 'cmdComponentSelAll')) { // Only allow when adding/updating etc...;
            if (this.context.riComponentGrid.CurrentColumnName === 'ComponentSelected') {
                this.context.iCABSAServiceCoverMaintenance3.SelectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
                //    this.context.riComponentGrid.Update = true;
                this.context.iCABSAServiceCoverMaintenance3.riComponentGrid_UpdateExecute();
            }
            this.context.iCABSAServiceCoverMaintenance3.SelectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
        }
    }

    public CreateComponentGrid(): void {
        this.context.riComponentGrid.DefaultBorderColor = 'ADD8E6';
        this.context.riComponentGrid.DefaultTextColor = '0000FF';
        this.context.riComponentGrid.PageSize = 10;
        this.context.riComponentGrid.FunctionPaging = true;
        this.context.riComponentGrid.HighlightBar = true;
    }

    public BuildComponentGrid(): void {
        this.context.riComponentGrid.Clear();
        this.context.riComponentGrid.AddColumn('ComponentProduct', 'Component', 'ComponentProduct', MntConst.eTypeCode, 6, false);
        this.context.riComponentGrid.AddColumn('ComponentDescription', 'Component', 'ComponentDescription', MntConst.eTypeTextFree, 20, false);
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.context.riComponentGrid.AddColumn('ComponentQuantity', 'Component', 'ComponentQuantity', MntConst.eTypeInteger, 5, false);
            //if( Not Pricing By Header ) { Show Component Pricing;
            //   if( CompositePricingType.value !== '1' ) { - JBARN Decided Not Required;
            this.context.riComponentGrid.AddColumn('ComponentAnnualValue', 'Component', 'ComponentAnnualvalue', MntConst.eTypeCurrency, 15, false);
            //    }
            this.context.riComponentGrid.AddColumn('ComponentExists', 'Component', 'ComponentExists', MntConst.eTypeImage, 1, false);
        }
        this.context.riComponentGrid.AddColumn('ServiceCoverQuantity', 'Component', 'ServiceCoverQuantity', MntConst.eTypeInteger, 5, false);
        this.context.riComponentGrid.AddColumn('ServiceCoverFrequency', 'Component', 'ServiceCoverFrequency', MntConst.eTypeInteger, 5, false);
        // if( CompositePricingType.value !== '1' || this.context.riMaintenance.CurrentMode !== eModeAdd ) { REMOVED - JBARN Decided Not Required;
        //if this.context.riMaintenance.CurrentMode !== eModeAdd ) {
        this.context.riComponentGrid.AddColumn('ServiceCoverAnnualValue', 'Component', 'ServiceCoverAnnualvalue', MntConst.eTypeCurrency, 15, false);
        //}
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd) { // When Updating Only Show CURRENT Service Cover Settings;
            this.context.riComponentGrid.AddColumn('ComponentSelected', 'Component', 'ComponentSelected', MntConst.eTypeImage, 1, false);
        }
        this.context.riComponentGrid.Complete();
    }

    public CreateDisplayGrid(): void {
        this.context.riDisplayGrid.DefaultBorderColor = 'DDDDDD';
        this.context.riDisplayGrid.PageSize = 10;
        this.context.riDisplayGrid.FunctionPaging = true;
        this.context.riDisplayGrid.HighlightBar = true;
        this.context.riDisplayGrid.FunctionUpdateSupport = true; // Updateable Grid
    }

    public BuildDisplayGrid(): void {
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
    }

    public tbodySCDispGrid_onDblClick(event: any): void {
        if (this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.context.riDisplayGrid.CurrentColumnName === 'DeleteServiceCoverItem' && event.srcElement.parentElement.parentElement.tagName
                && event.srcElement.parentElement.parentElement.tagName.toUpperCase() === 'TD') {
                if (!this.context.getControlValue('LastChangeEffectDate')) {
                    this.context.iCABSAServiceCoverMaintenance3.DisplayValueError('');
                    this.context.messageModalCallback = this.context.renderTab(1);
                } else {
                    this.context.iCABSAServiceCoverMaintenance3.UpdateDisplayDelete(event);
                }
            }
        }
    }

    public UpdateDisplayDelete(event: any): void {
        let oTR = event.srcElement.parentElement.parentElement;
        if (oTR.tagName && oTR.tagName.toUpperCase() === 'TD') {
            oTR = event.srcElement.parentElement.parentElement.parentElement;
        }
        //this.context.riDisplayGrid.Update = true;
        this.context.setAttribute('ServiceCoverItemRowID', oTR.children[0].children[0].children[0].getAttribute('RowID'));
        this.context.setAttribute('Row', oTR.sectionRowIndex);
        this.context.pageParams.blnDeleteServiceCoverItem = true;
        this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_UpdateExecute();
    }

    public riDisplayGrid_BodyColumnFocus(event: any): void {
        let oTR = event.srcElement.parentElement.parentElement;
        if (oTR.tagName && oTR.tagName.toUpperCase() === 'TD') {
            oTR = event.srcElement.parentElement.parentElement.parentElement;
            switch (this.context.riDisplayGrid.CurrentColumnName) {
                case 'GridMaterialsValue': ;
                    this.context.setAttribute('OrigMaterialsValue', event.srcElement.parentElement.parentElement.children[0].getAttribute('AdditionalProperty'));
                    this.context.setAttribute('ServiceCoverItemRowID', event.srcElement.parentElement.parentElement.children[0].getAttribute('RowID'));
                    this.context.setAttribute('Row', oTR.sectionRowIndex);
                    this.context.prevMaterialsValue = event.srcElement.value;
                    this.context.riDisplayGrid.Mode = MntConst.eModeUpdate;
                    break;
                case 'GridLabourValue': ;
                    this.context.setAttribute('OrigLabourValue', event.srcElement.parentElement.parentElement.children[0].getAttribute('AdditionalProperty'));
                    this.context.setAttribute('ServiceCoverItemRowID', event.srcElement.parentElement.parentElement.children[0].getAttribute('RowID'));
                    this.context.setAttribute('Row', oTR.sectionRowIndex);
                    this.context.prevLabourValue = event.srcElement.value;
                    this.context.riDisplayGrid.Mode = MntConst.eModeUpdate;
                    break;
                case 'GridReplacementValue': ;
                    this.context.setAttribute('OrigReplacementValue', event.srcElement.parentElement.parentElement.children[0].getAttribute('AdditionalProperty'));
                    this.context.setAttribute('ServiceCoverItemRowID', event.srcElement.parentElement.parentElement.children[0].getAttribute('RowID'));
                    this.context.setAttribute('Row', oTR.sectionRowIndex);
                    this.context.prevReplacementValue = event.srcElement.value;
                    this.context.riDisplayGrid.Mode = MntConst.eModeUpdate;
                    break;
            }
        }
    }

    public riDisplayGrid_BodyColumnLostFocus(event: any): void {
        let NewTotal;
        this.context.riDisplayGrid.Mode = MntConst.eModeNormal;
        switch (this.context.riDisplayGrid.CurrentColumnName) {
            //make sure value entered is less than original value, otherwise display error && assign back to original value;
            case 'GridMaterialsValue':
                if (this.context.prevReplacementValue !== event.srcElement.value) {
                    if (!this.isNumericValue(event.srcElement.value)) {
                        event.srcElement.value = this.context.getAttribute('OrigMaterialsValue');
                    } else if (this.context.CDbl(event.srcElement.value) > this.context.CDbl(this.context.getAttribute('OrigMaterialsValue'))
                        || ((!this.context.getControlValue('LastChangeEffectDate')) && this.context.CDbl(event.srcElement.value) !== this.context.CDbl(this.context.getAttribute('OrigMaterialsValue')))) {
                        this.context.iCABSAServiceCoverMaintenance3.DisplayValueError('Materials');
                        event.srcElement.value = this.context.getAttribute('OrigMaterialsValue');
                    } else {
                        //display new total in value column;
                        let NewTotal = this.context.CDbl(event.srcElement.value) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridLabourValue')) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridReplacementValue'));
                        this.context.riDisplayGrid.Details.SetValue('AnnualValue', parseFloat(NewTotal).toFixed(2));
                        //this.context.riDisplayGrid.Update = true;
                        this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_UpdateEditExecute();
                    }
                    if (this.context.getControlValue('LastChangeEffectDate') === '') {
                        this.context.renderTab(1);
                    }
                }
                break;
            case 'GridLabourValue':
                if (this.context.prevLabourValue !== event.srcElement.value) {
                    if (!this.isNumericValue(event.srcElement.value)) {
                        event.srcElement.value = this.context.getAttribute('OrigLabourValue');
                    } else if (this.context.CDbl(event.srcElement.value) > this.context.CDbl(this.context.getAttribute('OrigLabourValue'))
                        || ((!this.context.getControlValue('LastChangeEffectDate')) && this.context.CDbl(event.srcElement.value) !== this.context.CDbl(this.context.getAttribute('OrigLabourValue')))) {
                        this.context.iCABSAServiceCoverMaintenance3.DisplayValueError('Labour');
                        event.srcElement.value = this.context.getAttribute('OrigLabourValue');
                    } else {
                        //display new total in value column;
                        let NewTotal = this.context.CDbl(event.srcElement.value) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridMaterialsValue')) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridReplacementValue'));
                        this.context.riDisplayGrid.Details.SetValue('AnnualValue', parseFloat(NewTotal).toFixed(2));
                        //this.context.riDisplayGrid.Update = true;
                        this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_UpdateEditExecute();
                    }
                    if (this.context.getControlValue('LastChangeEffectDate') === '') {
                        this.context.renderTab(1);
                    }
                }
                break;
            case 'GridReplacementValue':
                if (this.context.prevReplacementValue !== event.srcElement.value) {
                    if (!this.isNumericValue(event.srcElement.value)) {
                        event.srcElement.value = this.context.getAttribute('OrigReplacementValue');
                    } else if (this.context.CDbl(event.srcElement.value) > this.context.CDbl(this.context.getAttribute('OrigReplacementValue'))
                        || ((!this.context.getControlValue('LastChangeEffectDate')) && this.context.CDbl(event.srcElement.value) !== this.context.CDbl(this.context.getAttribute('OrigReplacementValue')))) {
                        this.context.iCABSAServiceCoverMaintenance3.DisplayValueError('Replacement');
                        event.srcElement.value = this.context.getAttribute('OrigReplacementValue');
                    } else {
                        let NewTotal = this.context.CDbl(event.srcElement.value) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridMaterialsValue')) + this.context.CDbl(this.context.riDisplayGrid.Details.GetValue('GridLabourValue'));
                        this.context.riDisplayGrid.Details.SetValue('AnnualValue', parseFloat(NewTotal).toFixed(2));
                        //this.context.riDisplayGrid.Update = true;
                        this.context.iCABSAServiceCoverMaintenance3.riDisplayGrid_UpdateEditExecute();
                    }
                    if (this.context.getControlValue('LastChangeEffectDate') === '') {
                        this.context.renderTab(1);
                    }
                }
                break;
        }
    }

    public isNumericValue(val: any): boolean {
        try {
            return !isNaN(parseInt(val, 10));
        } catch (e) {
            return false;
        }
    }

    public CalcDisplayValueChanges(): void {
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
        this.context.riMaintenance.PostDataAdd('riGridHandle', this.context.pageParams.riGridHandlevalue, MntConst.eTypeTextFree);
        this.context.riMaintenance.ReturnDataAdd('DisplayTotal', MntConst.eTypeDecimal1);
        this.context.riMaintenance.ReturnDataAdd('OrigTotal', MntConst.eTypeDecimal1);
        this.context.riMaintenance.ReturnDataAdd('Quantity', MntConst.eTypeInteger);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'NewTotalValue', data['DisplayTotal']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'OrigTotalValue', data['OrigTotal']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceAnnualValue', data['DisplayTotal']);
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'AnnualValueChange', (parseFloat(data['DisplayTotal']) - parseFloat(data['OrigTotal'])).toFixed(2));
            this.context.attributes.AnnualValueChange_riChange = true;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'ServiceQuantity', data['Quantity']);
            this.context.riExchange.riInputElement.MarkAsDirty(this.context.uiForm, 'ServiceAnnualValue');
            this.context.riExchange.riInputElement.MarkAsDirty(this.context.uiForm, 'AnnualValueChange');
            this.context.attributes.ServiceQuantity_riChange = true;
            this.context.iCABSAServiceCoverMaintenance2.AnnualValueChangeonBlur();
        }, 'POST');
    }

    public DisplayValueError(ipErrorType: any): void {
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverReduceDisplayGrid.p';
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'DisplayValueError', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('ErrorType', ipErrorType, MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('LastChangeEffectDate', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'LastChangeEffectDate'), MntConst.eTypeDate);
        this.context.riMaintenance.ReturnDataAdd('ErrorMessage', MntConst.eTypeText);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            if (data['ErrorMessage']) {
                this.context.showAlert(data['ErrorMessage']);
            }
        }, 'POST');
    }

    public cmdComponentSelAll_OnClick(): void {
        this.MultiSetComponents(true);
    }

    public cmdComponentDesAll_OnClick(): void {
        this.MultiSetComponents(false);
    }

    public MultiSetComponents(lSelectAll: any): void {
        let cFunction;
        if (lSelectAll) {
            cFunction = 'SelectAll';
        } else {
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
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.iCABSAServiceCoverMaintenance3.riComponentGrid_BeforeExecute();
        }, 'POST');
    }

    public BusinessOriginDetailDisplay(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'DetailRequiredInd')) {
            this.context.pageParams.uiDisplay.trBusinessOriginDetailCode = true;
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'BusinessOriginDetailCode', true);
        } else {
            this.context.pageParams.uiDisplay.trBusinessOriginDetailCode = false;
            this.context.riExchange.riInputElement.SetValue(this.context.uiForm, 'BusinessOriginDetailCode', '');
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'BusinessOriginDetailCode', false);
        }
    }

    public CheckWasteTransferRequired(): void {
        if (this.context.riExchange.riInputElement.checked(this.context.uiForm, 'RequiresWasteTransferType')) {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'WasteTransferTypeCode', true);
        } else {
            this.context.riExchange.riInputElement.SetRequiredStatus(this.context.uiForm, 'WasteTransferTypeCode', false);
        }
    }

    public ShowAverageWeight(): void {
        let bShowAverageWeight;
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'GetAverageWeightStatus', MntConst.eTypeText);
        //this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('ContractNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ContractNumber'), MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('PremiseNumber', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'PremiseNumber'), MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('ProductCode', this.context.riExchange.riInputElement.GetValue(this.context.uiForm, 'ProductCode'), MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('NoAverageWeight', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            bShowAverageWeight = data['NoAverageWeight'];
            if (!bShowAverageWeight) {
                this.context.pageParams.uiDisplay.trAverageWeight = true;
                if (this.context.riMaintenance.CurrentMode === MntConst.eModeAdd || this.context.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
                    if (this.context.pageParams.vbEnableServiceCoverAvgWeightReq) {
                        if (this.context.pageParams.vbEnableServiceCoverAvgWeightText !== '') {
                            this.context.iCABSAServiceCoverMaintenance3.EnableAvgWeightForUser();
                        } else {
                            this.context.riMaintenance.EnableInput('AverageWeight');
                        }
                    } else {
                        this.context.riMaintenance.DisableInput('AverageWeight');
                    }
                }
            } else {
                this.context.pageParams.uiDisplay.trAverageWeight = false;
            };
        }, 'POST');
    }

    public EnableAvgWeightForUser(): void {
        let bEnableAverageWeightForUser;
        this.context.riMaintenance.BusinessObject = this.context.pageParams.strRequestProcedure;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.PostDataAdd('action', '6', MntConst.eTypeInteger);
        this.context.riMaintenance.PostDataAdd('Function', 'EnableAverageWeight', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.PostDataAdd('EnableAverageWeightText', this.context.pageParams.vbEnableServiceCoverAvgWeightText, MntConst.eTypeText);
        this.context.riMaintenance.ReturnDataAdd('EnableAverageWeight', MntConst.eTypeCheckBox);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            bEnableAverageWeightForUser = data['EnableAverageWeight'];
            if (bEnableAverageWeightForUser) {
                this.context.riMaintenance.EnableInput('AverageWeight');
            } else {
                this.context.riMaintenance.DisableInput('AverageWeight');
            }
        }, 'POST');
    }

    public BuildTaxCodeCombo(): void {
        let strReturn, Arr, iLoop, ELLE, Pair;
        this.context.riMaintenance.clear();
        this.context.riMaintenance.BusinessObject = 'iCABSServiceCoverEntryRequests.p';
        this.context.riMaintenance.PostDataAdd('Function', 'BuildTaxCodeCombo', MntConst.eTypeText);
        this.context.riMaintenance.PostDataAdd('BusinessCode', this.context.utils.getBusinessCode(), MntConst.eTypeCode);
        this.context.riMaintenance.ReturnDataAdd('TaxCodeList', MntConst.eTypeTextFree);
        this.context.riMaintenance.Execute(this.context, function (data: any): any {
            this.context.pageParams.selTaxCode = [];
            strReturn = data['TaxCodeList'];
            if (strReturn !== '') {
                Arr = strReturn.split(String.fromCharCode(1));
                for (let i = 0; i < Arr.length; i++) {
                    Pair = Arr[i].split('|');
                    let obj = {
                        text: Pair[0] + ' - ' + Pair[1],
                        value: Pair[0]
                    };
                    this.context.pageParams.selTaxCode.push(obj);
                }
                setTimeout(function (): void {
                    this.context.setControlValue('selTaxCode', this.context.getControlValue('TaxCode'));
                }.bind(this), 1000);
            }
        }, 'POST');
    }

    public SetReplacementIncInd(): void {
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
    }

    public riExchange_UpdateHTMLDocument(): void {

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

    }

}
