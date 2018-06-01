import { InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { PremiseMaintenanceComponent } from './iCABSAPremiseMaintenance';
import { PremiseMaintenance0 } from './iCABSAPremiseMaintenance0';
import { PremiseMaintenance1 } from './iCABSAPremiseMaintenance1';
import { PremiseMaintenance1a } from './iCABSAPremiseMaintenance1a';
import { PremiseMaintenance3 } from './iCABSAPremiseMaintenance3';
import { PremiseMaintenance4 } from './iCABSAPremiseMaintenance4';

import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from './../../../shared/services/utility';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { ContractActionTypes } from '../../actions/contract';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';

export class PremiseMaintenance2 {
    //Duplicated Parent Class objects
    public utils: Utils;
    private xhr: any;
    private xhrParams: any;
    private uiForm: any;
    private controls: any;
    private uiDisplay: any;
    private pageParams: any;
    private attributes: any;
    private formData: any;
    private LookUp: any;
    private logger: any;
    private riExchange: RiExchange;
    private riMaintenance: RiMaintenance;
    private riTab: RiTab;
    private viewChild: any;

    public pgPM0: PremiseMaintenance0;
    public pgPM1: PremiseMaintenance1;
    public pgPM1a: PremiseMaintenance1a;
    public pgPM2: PremiseMaintenance2;
    public pgPM3: PremiseMaintenance3;
    public pgPM4: PremiseMaintenance4;

    constructor(private parent: PremiseMaintenanceComponent) {
        this.utils = this.parent.utils;
        this.logger = this.parent.logger;
        this.xhr = this.parent.xhr;
        this.xhrParams = this.parent.xhrParams;
        this.LookUp = this.parent.LookUp;
        this.uiForm = this.parent.uiForm;
        this.controls = this.parent.controls;
        this.uiDisplay = this.parent.uiDisplay;
        this.viewChild = this.parent.viewChild;
        this.pageParams = this.parent.pageParams;
        this.attributes = this.parent.attributes;
        this.formData = this.parent.formData;
        this.riExchange = this.parent.riExchange;
        this.riMaintenance = this.parent.riMaintenance;
        this.riTab = this.parent.riTab;
    }

    public killSubscription(): void {/* */ }

    public window_onload(): void {
        this.pgPM0 = this.parent.pgPM0;
        this.pgPM1 = this.parent.pgPM1;
        this.pgPM1a = this.parent.pgPM1a;
        this.pgPM2 = this.parent.pgPM2;
        this.pgPM3 = this.parent.pgPM3;
        this.pgPM4 = this.parent.pgPM4;
    }

    //***********
    //* Search  *
    //***********
    public riMaintenance_Search(): void {
        //Functionality modified and current block not required
    }


    //*******************************
    //* BEFORE SELECT (Hide fields) *
    //*******************************
    public riMaintenance_BeforeSelect(): void {
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdBtnAmendContact = false;
        }

        this.uiDisplay.tdCustomerInfo = false;
        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.LostBusinessDesc = false;
        this.uiDisplay.cmdValue = false;
        this.uiDisplay.tdPremiseAnnualValueLab = false;
    }

    //********************************************
    //* BEFORE FETCH (Check contract type valid) *
    //********************************************
    public riMaintenance_BeforeFetch(): void {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ContractTypeCode=' + this.pageParams.CurrentContractType;
    }

    //****************
    //* BEFORE MODE  *
    //****************
    public riMaintenance_BeforeMode(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetAddress');
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdVtxGeoCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdValue');
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGeocode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'selCustomerIndicationNumber');
        }

        if (this.riMaintenance.CurrentMode === MntConst.eNormalMode) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdGetAddress');
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdVtxGeoCode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdCopyPremise');
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdValue');
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdGeocode');
            this.riExchange.riInputElement.Disable(this.uiForm, 'selCustomerIndicationNumber');
        }

        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.uiDisplay.labelInactiveEffectDate = false;
            this.uiDisplay.InactiveEffectDate = false;
            this.uiDisplay.cmdValue = false;

            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdValue');
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdVtxGeoCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGeocode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'selCustomerIndicationNumber');

            this.parent.pgPM2.AddTabs();
            this.parent.pgPM2.ShowInvoiceNarrativeTab();
        }
    }


    //**********************
    //* BEFORE ADD MODE    *
    //**********************
    public riMaintenance_BeforeAddMode(): void {
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdbtnAmendContact = false;
            this.parent.pgPM3.SensitiseContactDetails(true);
        }

        if (this.pageParams.SCEnableBarcodes && this.pageParams.SCRequireBarcodes) {
            this.parent.setControlValue('ProofScanRequiredInd', true); //Checkbox
        }

        if (this.pageParams.SCEnableSignatures && this.pageParams.SCRequireSignatures) {
            this.parent.setControlValue('ProofSignatureRequiredInd', true); //Checkbox
        }

        this.parent.setControlValue('PremiseVtxGeoCode', '');

        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetAddress');
        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdVtxGeoCode');

        if (!this.pageParams.GridCacheTime) this.pageParams.GridCacheTime = (new Date()).toTimeString().split(' ')[0];
        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdSRAGenerateText');

        this.parent.pgPM2.HideQuickWindowSet(false);

        if (this.parent.getControlValue('ContractNumber') !== '') {
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdCopyPremise');
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdCopyPremise');
        }

        this.parent.setControlValue('CurrentContractType', this.pageParams.CurrentContractType);

        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.LostBusinessDesc = false;

        //Make request to get default discount code for Business
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetDefaultDiscountCode';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            if (data.hasError) this.parent.showAlert(data.errorMessage);
            else this.parent.setControlValue('DiscountCode', data['DiscountCode']);
        });

        this.parent.pgPM2.WindowPreferredIndChanged();

        //Make request to get default LanguageCode
        if (this.parent.getControlValue('InvoiceGroupNumber')) {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetDefaultLanguageCode';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('AccountNumber');
            this.riMaintenance.CBORequestAdd('InvoiceGroupNumber');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) this.parent.showAlert(data.errorMessage);
                else this.parent.setControlValue('LanguageCode', data['LanguageCode']);
            });
        }

        //Make request to get Telesales Flag
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetTelesalesInd';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            if (data.hasError) this.parent.showAlert(data.errorMessage);
            else {
                this.parent.setControlValue('TelesalesInd', this.utils.convertResponseValueToCheckboxInput(data['TelesalesInd']));
                if (this.riExchange.riInputElement.checked(this.uiForm, 'TelesalesInd')) { //Checkbox
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TelesalesEmployeeCode', true);
                } else {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TelesalesEmployeeCode', false);
                }
            }
        });

        //Make request to get the default business windows
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetBusinessDefaultWindows';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            this.parent.isRequestingInitial = false;

            if (data.hasError) this.parent.showAlert(data.errorMessage);
            this.parent.riMaintenance.renderResponseForCtrl(this, data);

            this.pageParams.PNOLMode = 'Add';

            this.parent.pgPM1.SetOkToUpgradeToPNOL();

            if (!this.pageParams.vSICCodeRequire) {
                this.riExchange.riInputElement.Disable(this.uiForm, 'SICCode');
            }

            if (this.pageParams.vbShowPremiseWasteTab) {
                this.parent.pgPM2.WasteConsignmentNoteExemptInd_onClick();
            }

            //Next Waste Consignment Note Number should always be disabled
            this.riExchange.riInputElement.Disable(this.uiForm, 'NextWasteConsignmentNoteNumber');
            this.riExchange.riInputElement.Enable(this.uiForm, 'SelServiceNotifyTemplateEmail');
            this.riExchange.riInputElement.Enable(this.uiForm, 'SelServiceNotifyTemplateSMS');

            this.parent.setControlValue('selRoutingSource', '');
            this.parent.setControlValue('SelServiceNotifyTemplateEmail', '');
            this.parent.setControlValue('SelServiceNotifyTemplateSMS', '');

            this.parent.pgPM2.SetQuickWindowSetValue('D');
            this.parent.pgPM3.UpdateBusinessDefaultTimes();

            this.parent.setControlValue('CustomerIndicationNumber', 0);
            this.parent.pgPM3.CustomerIndicationNumber_onChange();

            this.pageParams.lPremiseMatchedDone = false;
        });

        //If come via Client Retention then need to get LostBusinessRequestNumber from Contact (parent)
        if (this.pageParams.ParentMode === 'Contact') {
            this.riExchange.getParentHTMLValue('LostBusinessRequestNumber');
        }

        if (this.pageParams.CurrentContractType === 'P') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseCommenceDate'); this.parent.dateDisable('PremiseCommenceDate', true, false);
        } else { // Do not disable PremiseCommenceDate on addition.
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseCommenceDate'); this.parent.dateDisable('PremiseCommenceDate', false, false);
        }

        if (this.pageParams.CurrentContractType === 'C' || this.pageParams.CurrentContractType === 'J') {
            this.parent.attributes.RenegContract = false;
            this.parent.attributes.ContractNumber = '';
            this.parent.attributes.PremiseNumber = '';

            this.uiDisplay.tdDrivingChargeValueLab = false;
            this.uiDisplay.tdDrivingChargeValue = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DrivingChargeValue', false);
        }

        if (this.pageParams.ParentMode === 'CSearch' ||
            this.pageParams.ParentMode === 'CSearchAdd' ||
            this.pageParams.ParentMode === 'IGSearch' ||
            this.pageParams.ParentMode === 'Contract-Add' ||
            this.pageParams.ParentMode === 'Contact') {
            if (this.pageParams.CurrentContractType !== 'P') {
                this.parent.focusField('PremiseCommenceDate');
            } else {
                this.parent.focusField('PremiseName');
            }
        }
        else {
            this.parent.focusField('ContractNumber');
        }
    }


    public riExchange_UnloadHTMLDocument(): void {
        if (this.parent.getControlValue('ClosedWithChanges') === 'Y') {
            this.parent.setControlValue('WindowClosingName', 'AmendmentsMade');
        }
        else {
            this.parent.setControlValue('WindowClosingName', 'AmendmentsMade');
        }

        this.riExchange.setParentHTMLValue('WindowClosingName', this.parent.getControlValue('WindowClosingName'));
        this.riExchange.setParentHTMLValue('ClosedWithChanges', this.parent.getControlValue('ClosedWithChanges'));
    }

    public PostcodeDefaultingEnabled(): void {
        if (this.pageParams.SCEnablePostcodeDefaulting) {  //Only do the following if Postcode Defaulting is enabled
            //if the currently logged in branch should not use postcode defaulting, then leave the function routine
            if (!this.parent.pgPM1.DeterminePostCodeDefaulting(true)) {
                return;
            }

            //Only disable Service Branch if syschar EnableServiceBranchUpdate is NOT REQUIRED
            if (!this.pageParams.SCEnableServiceBranchUpdate) {
                //Disable Service Branch if defaulting by postcode so user must enter a valid postcode
                this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceBranchNumber');
            }

            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber') || this.parent.getControlValue('PremiseName') === '') {
                    //if the new postcode already exists in iCABS then this may be a renegotiated premises, if so this.Reneg Screen
                    if (this.parent.getControlValue('PremisePostcode') !== '' && this.pageParams.CurrentContractType === 'C') {
                        this.parent.pgPM3.CheckPostcode();
                    }
                }

                //Again if the new postcode already exists in iCABS then this may be a renegotiated premises, if so this.Reneg Screen
                if (this.pageParams.CurrentContractType === 'C' && this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremisePostcode')) {
                    this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'PremisePostcode');
                    this.parent.pgPM3.CheckPostcode();
                }
            }
        }
    }

    //****************
    //* CBO REQUESTS *
    //****************
    public riExchange_CBORequest(): void {
        this.parent.lErrorMessageDesc = [];
        let vbGetContractDetails = false;

        this.parent.ellipsis.SalesAreaSearchComponent.childparams.ServiceBranchNumber = this.parent.getControlValue('ServiceBranchNumber');

        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber')
                || this.parent.getControlValue('PremiseName') === '') {

                //Default the premise commence date to contract commence date if adding a job or product sales
                if (this.pageParams.ParentMode === 'Contract-Add' || this.pageParams.CurrentContractType === 'J') {
                    this.parent.setControlValue('NewContract', true); //Checkbox
                } else {
                    this.parent.setControlValue('NewContract', false); //Checkbox
                }

                this.parent.setControlValue('ContractTypeCode', this.pageParams.CurrentContractType);

                //Make request to get defaults from Contract
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetContractDefaults';
                this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.CBORequestAdd('ContractNumber');
                this.riMaintenance.CBORequestAdd('ContractTypeCode');
                this.riMaintenance.CBORequestAdd('NewContract');
                this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                    if (data.hasError) this.parent.showAlert(data.errorMessage);
                    //this.riExchange.updateUiFields(data, this.uiForm, this.controls);
                    this.riMaintenance.renderResponseForCtrl(this, data);
                    this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'ContractNumber');

                    //groupPremise ellipsis
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.AccountNumber = this.parent.getControlValue('AccountNumber');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.ContractNumber = this.parent.getControlValue('ContractNumber');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.ContractName = this.parent.getControlValue('ContractName');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.SearchPostcode = this.parent.getControlValue('PremisePostcode');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseName = this.parent.getControlValue('PremiseName');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine1 = this.parent.getControlValue('PremiseAddressLine1');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine2 = this.parent.getControlValue('PremiseAddressLine2');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine3 = this.parent.getControlValue('PremiseAddressLine3');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine4 = this.parent.getControlValue('PremiseAddressLine4');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine5 = this.parent.getControlValue('PremiseAddressLine5');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremisePostcode = this.parent.getControlValue('PremisePostcode');
                    this.parent.ellipsis.SalesAreaSearchComponent.childparams.ServiceBranchNumber = this.parent.getControlValue('ServiceBranchNumber');
                });

                if (this.riExchange.riInputElement.checked(this.uiForm, 'CreateNewInvoiceGroupInd')) { //Checkbox
                    this.parent.setControlValue('InvoiceGroupNumber', '');
                    this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceGroupNumber');
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', false);
                } else {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'InvoiceGroupNumber');
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', true);
                }

                this.pageParams.vbGetContractDetails = true;
            }

            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseCommenceDate') &&
                this.parent.getControlValue('PremiseCommenceDate') !== '' &&
                this.parent.getControlValue('ContractNumber') !== '') {
                //Validate PremiseCommenceDate is an anniversary date
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnAnniversaryDate';
                this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.CBORequestAdd('ContractNumber');
                this.riMaintenance.CBORequestAdd('PremiseCommenceDate');
                this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                    this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'PremiseCommenceDate');

                    this.parent.arrFocusElem.length = 0;
                    this.parent.arrFocusElem.push('PremiseName');
                    this.parent.focusField();

                    if (data.hasError) {
                        this.parent.showAlert(data.errorMessage, 2);
                        this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                    }
                });
            }
        }

        this.parent.pgPM2.PostcodeDefaultingEnabled();

        //Blank Serice Area Code and Sales Employee on change of branch
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceBranchNumber')) {
            this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'ServiceBranchNumber');
            this.parent.ellipsis.SalesAreaSearchComponent.childparams.ServiceBranchNumber = this.parent.getControlValue('ServiceBranchNumber');
            this.parent.setControlValue('SalesAreaCode', '');
            this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'SalesAreaCode');
            this.parent.setControlValue('SalesAreaDesc', '');
            this.parent.setControlValue('PremiseSalesEmployee', '');
            this.parent.setControlValue('SalesEmployeeSurname', '');
        }

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'SalesAreaCode') &&
            this.parent.getControlValue('SalesAreaCode') !== '' &&
            this.parent.getControlValue('ServiceBranchNumber') !== '') {
            this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'SalesAreaCode');
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=DefaultFromSalesArea';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('ServiceBranchNumber');
            this.riMaintenance.CBORequestAdd('SalesAreaCode');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage, 2);
                    this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                } else {
                    this.parent.setControlValue('PremiseSalesEmployee', data.PremiseSalesEmployee);
                    this.parent.setControlValue('SalesAreaDesc', data.SalesAreaDesc);
                    this.parent.setControlValue('SalesEmployeeSurname', data.SalesEmployeeSurname);
                }
            });
        }

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'TelesalesEmployeeCode') &&
            this.parent.getControlValue('TelesalesEmployeeCode') !== '') {
            this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'TelesalesEmployeeCode');
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetTelesalesEmployee';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('TelesalesEmployeeCode');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage, 2);
                    this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                }
            });
        }

        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseSRADate')) {
            this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'PremiseSRADate');
            if (this.parent.getControlValue('PremiseSRADate') !== '') {
                //Set required status on SRA Employee
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseSRAEmployee', true);

                //Check PremiseSRADate is not greater than today
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnSRADate';
                this.riMaintenance.CBORequestAdd('PremiseSRADate');
                this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                    if (data.hasError) {
                        this.parent.showAlert(data.errorMessage, 2);
                        this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                    }
                });
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseSRAEmployee', false);
                this.riExchange.riInputElement.isError(this.uiForm, 'PremiseSRAEmployee');
            }
        }

        if (this.riExchange.riInputElement.checked(this.uiForm, 'CustomerInfoAvailable')) { //Checkbox
            this.uiDisplay.tdCustomerInfo = true;
        } else {
            this.uiDisplay.tdCustomerInfo = false;
        }

        if (this.riExchange.riInputElement.checked(this.uiForm, 'NationalAccountChecked') //Checkbox
            && this.riExchange.riInputElement.checked(this.uiForm, 'NationalAccount')) { //Checkbox
            this.uiDisplay.tdNationalAccount = true;
        } else {
            this.uiDisplay.tdNationalAccount = false;
        }

        if ((this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate)
            && this.riExchange.riInputElement.HasChanged(this.uiForm, 'InvoiceGroupNumber') && !this.pageParams.vbGetContractDetails
            && this.parent.getControlValue('InvoiceGroupNumber') && this.uiDisplay.trPaymentType
        ) {
            this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'InvoiceGroupNumber');
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetPaymentTypeDetails';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('ContractNumber');
            this.riMaintenance.CBORequestAdd('InvoiceGroupNumber');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage, 2);
                    this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                }
            });
        }
    }

    //***************
    //* BEFORE SAVE *
    //***************
    public riMaintenance_BeforeSave(): void {
        let verror = false;

        this.parent.setControlValue('RoutingSource', this.parent.getControlValue('SelRoutingsource'));
        this.parent.setControlValue('PrintRequired', this.parent.getControlValue('SelPrintRequired'));

        //Template ID not being blanked out
        if (this.uiDisplay.grdTimeWindows) {
            this.parent.setControlValue('CustomerAvailTemplateID', '');
        }

        //Always set the current callreference field
        this.parent.setControlValue('CallLogID', this.parent.getControlValue('CurrentCallLogID'));
        this.parent.setControlValue('ClosedWithChanges', 'Y');

        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckLength';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        if (this.parent.getControlValue('PremiseSpecialInstructions') !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSpecialInstructions');
        }

        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseSpecialInstructions', true);
                verror = true;
            }
        });


        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnSRAEmployee';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);

        if (this.parent.getControlValue('PremiseSRAEmployee').trim() !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSRAEmployee');
        }
        if (this.parent.getControlValue('PremiseSRADate') !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSRADate');
        }

        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseSRAEmployee', true);
                verror = true;
                this.riMaintenance.CancelEvent = true;
            }
        });

        //Check Address and Postcode
        if (this.pageParams.SCPostCodeMustExistInPAF && (this.pageParams.SCEnableHopewiserPAF || this.pageParams.SCEnableDatabasePAF)) {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckPostcode';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);

            if (this.parent.getControlValue('PremiseName') !== '') this.riMaintenance.CBORequestAdd('PremiseName');
            if (this.parent.getControlValue('PremiseAddressLine1') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine1');
            if (this.parent.getControlValue('PremiseAddressLine2') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine2');
            if (this.parent.getControlValue('PremiseAddressLine3') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine3');
            if (this.parent.getControlValue('PremiseAddressLine4') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine4');
            if (this.parent.getControlValue('PremiseAddressLine5') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine5');
            if (this.parent.getControlValue('PremisePostcode') !== '') this.riMaintenance.CBORequestAdd('PremisePostcode');

            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage);
                    this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                    verror = true;
                }
            });
        }

        if (this.parent.getControlValue('PremiseNumber')) {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckPremiseAddressChange';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('ContractNumber');
            this.riMaintenance.CBORequestAdd('PremiseNumber');
            if (this.parent.getControlValue('PremiseAddressLine1') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine1');
            if (this.parent.getControlValue('PremiseAddressLine2') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine2');
            if (this.parent.getControlValue('PremiseAddressLine3') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine3');
            if (this.parent.getControlValue('PremiseAddressLine4') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine4');
            if (this.parent.getControlValue('PremiseAddressLine5') !== '') this.riMaintenance.CBORequestAdd('PremiseAddressLine5');
            if (this.parent.getControlValue('PremisePostcode') !== '') this.riMaintenance.CBORequestAdd('PremisePostcode');

            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage);
                    this.parent.setControlValue('ErrorMessageDesc', data.errorMessage);
                    verror = true;
                }
            });
        }

        if (verror) {
            this.riMaintenance.CancelEvent = true;
        }

        this.riExchange.updateCtrlValue(this.uiForm.getRawValue(), this.uiForm.controls);
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = '';
        //DisableList.value = FieldDisableList; //Field not found

        if (this.pageParams.vbEnableRouteOptimisation && this.parent.getControlValue('SelRoutingSource') === '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSRoutingSearch.p';
            this.riMaintenance.PostDataAdd('Function', 'GetGeocodeAddress', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine1', this.parent.getControlValue('PremiseAddressLine1'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine2', this.parent.getControlValue('PremiseAddressLine2'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine3', this.parent.getControlValue('PremiseAddressLine3'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine4', this.parent.getControlValue('PremiseAddressLine4'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine5', this.parent.getControlValue('PremiseAddressLine5'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Postcode', this.parent.getControlValue('PremisePostcode'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('GPSX', this.parent.getControlValue('GPSCoordinateX'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('GPSY', this.parent.getControlValue('GPSCoordinateY'), MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('AddressError', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('GPSX', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('GPSY', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('Score', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('Node', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                this.parent.setControlValue('AddressError', data['AddressError']);
                if (data['AddressError'] !== 'Error') {
                    this.parent.setControlValue('RoutingGeonode', data['Node']);
                    this.parent.setControlValue('RoutingScore', data['Score']);
                    this.parent.setControlValue('GPSCoordinateX', data['GPSX']);
                    this.parent.setControlValue('GPSCoordinateY', data['GPSY']);

                    if (data['Score'] > 0) {
                        this.parent.setControlValue('SelRoutingSource', 'T');
                        this.parent.setControlValue('Routingsource', 'T');
                    }
                    else {
                        this.parent.setControlValue('SelRoutingSource', '');
                        this.parent.setControlValue('Routingsource', '');
                    }
                } else {
                    this.parent.showAlert(MessageConstant.PageSpecificMessage.unableToGeocode);
                    this.riMaintenance.CancelEvent = true;
                }
            }, 'POST');
        }

        //Warn that if the site reference is blank, as a new one will be generated if not populated
        if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL') //Checkbox
            && this.parent.getControlValue('PNOLSiteRef') === '') {
            this.parent.showAlert(MessageConstant.PageSpecificMessage.pestNetOnlineBlank);
            this.parent.setControlValue('ErrorMessageDesc', '');
        }

        if (this.pageParams.SCEnableAccountAddressMessage) {
            if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeSaveUpdate) {
                this.parent.showAlert(MessageConstant.PageSpecificMessage.changesToPremiseAddress, 2);
            }
        }
    }

    public riMaintenance_BeforeSaveAdd(): void {
        if (this.pageParams.SCEnableRepeatSalesMatching) {
            if (!this.pageParams.lPremiseMatchedDone) {
                this.parent.pgPM3.MatchPremise();
            }
        }
    }

    //******************
    //* AFTER SAVE ADD *
    //******************
    public riMaintenance_AfterSaveAdd_clbk(): void {
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdBtnAmendContact = '';
        }
        //validate contracts are not added without premises
        if (this.pageParams.ParentMode === 'Contract-Add') {
            this.pageParams.PremiseAdded = true;

            //IUI-15818
            let urlStrArr = this.parent.location.path().split('?');
            let urlStr = urlStrArr[0];
            let qParams = 'parentMode=ServiceCover'
                + '&contractTypeCode=' + this.pageParams.CurrentContractType
                + '&ContractNumber=' + this.parent.getControlValue('ContractNumber')
                + '&PremiseNumber=' + this.parent.getControlValue('PremiseNumber')
                + '&reload=force';
            this.pageParams.ParentMode = 'ServiceCover';
            this.parent.location.replaceState(urlStr, qParams);
        }
        if (this.pageParams.vbEnableLocations && this.pageParams.vbEnablePremiseLocInsert && this.pageParams.CurrentContractType !== 'P') {
            this.parent.promptTitle = MessageConstant.PageSpecificMessage.addPremiseTitle;
            this.parent.promptContent = MessageConstant.PageSpecificMessage.addPremiseContent;
            this.parent.callbackPrompts.push(this.checkResponse);
            this.parent.promptModal.show();
        } else {
            this.parent.pgPM2.OpenServiceCoverScreen();
        }

    }

    private checkResponse(): void {
        if (this.pageParams.promptAns) {
            this.parent.navigate('Premise-Add', 'application/premiseLocationAllocation');
            //TODO - Should navigate from premiseLocationAllocation to Servicecover
            //this.OpenServiceCoverScreen();
        } else {
            this.parent.pgPM2.OpenServiceCoverScreen();
        }
        this.pageParams.promptAns = null;
    }

    public OpenServiceCoverScreen(): void {
        this.parent.routeAwayGlobals.setSaveEnabledFlag(false);
        if (this.pageParams.CurrentContractType === 'C' || this.pageParams.CurrentContractType === 'J') {
            this.parent.navigate('Premise-Add', ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                parentMode: 'Premise-Add',
                currentContractType: this.pageParams.CurrentContractType
            });
        } else {  //(Product Sales)
            this.parent.navigate('Premise-Add', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1, {
                parentMode: 'Premise-Add',
                currentContractType: this.pageParams.CurrentContractType
            });
        }
    }


    //*************************************************
    //* Functions (DefaultFromPostcode/CheckPostcode) *
    //*************************************************
    public DefaultFromPostcode(): void {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=DefaultFromPostcode' +
            '&ContractTypeCode=' + this.pageParams.CurrentContractType +
            '&NegBranchNumber=' + this.parent.getControlValue('NegBranchNumber') +
            '&PremiseAddressLine4=' + encodeURI(this.parent.getControlValue('PremiseAddressLine4')) +
            '&PremiseAddressLine5=' + encodeURI(this.parent.getControlValue('PremiseAddressLine5'));
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');
        this.riMaintenance.CBORequestAdd('PremisePostcode');
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            if (data.hasError) this.parent.showAlert(data.errorMessage);
            else {
                this.riMaintenance.renderResponseForCtrl(this, data);
                this.parent.ellipsis.SalesAreaSearchComponent.childparams.ServiceBranchNumber = this.parent.getControlValue('ServiceBranchNumber');
            }
        });
    }


    //******************************************
    //* Functions (Show Invoice Narrative Tab) *
    //******************************************
    public AddTabs(): void {
        this.riTab.TabSet();
        this.riTab.TabClear();
        this.riTab.TabAdd('Address');
        this.riTab.TabAdd('General');
        if (this.pageParams.SCEnablePestNetOnlineProcessing) {
            this.riTab.TabAdd('PestNetOnline');
        }
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            // this.riTab.TabAdd('Global SRA Input');
            // this.riTab.TabAdd('Global SRA Edit');
        } else {
            this.riTab.TabAdd('Site Risk Assessment');
        }
        if (this.pageParams.vbShowPremiseAdditionalTab) {
            this.riTab.TabAdd('Additional Comments');
        }

        this.riTab.TabAdd('Planning');
        if (this.pageParams.vbShowPremiseWasteTab) {
            this.riTab.TabAdd('PremiseWaste');
        }

        if (this.pageParams.vbEnableServiceCoverDispLev) {
            this.riTab.TabAdd('DisplayValue1');
        }

        if (this.pageParams.boolPropertyCareInd === 'Y' && this.pageParams.boolUserWriteAccess === 'yes') {
            this.riTab.TabAdd('Guarantee');
        } else {
            this.uiDisplay.grdGuarantee = false;
        }

        if (this.pageParams.boolCIEnabled) {
            this.riTab.TabAdd('Customer Integration');
        } else {
            this.uiDisplay.grCustomerInt = false;
        }

        //this.iefAddCustomTabs() //TODO Functionality for not found
        this.riTab.TabDraw();
    }

    public ShowInvoiceNarrativeTab(): void {
        let blnShowTab = false;
        if (!this.pageParams.blnShowInvoiceNarrativeTab) {
            //By default, we will not show tab

            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
            //N.B. Some of these fields may be blank (e.g. when adding), in which case the request will determine whether the tab should be
            //     shown by default. Otherwise the request returns whether the tab should be shown for this premise.
            this.riMaintenance.PostDataAdd('Function', 'ShowInvoiceTab', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('AccountNumber', this.parent.getControlValue('AccountNumber'), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('InvoiceGroupNumber', this.parent.getControlValue('InvoiceGroupNumber'), MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('ShowInvoiceNarrativeTab', MntConst.eTypeText);

            this.riMaintenance.Execute(this, function (data: any): any {
                if (!data.hasError) {
                    if (data && data['ShowInvoiceNarrativeTab']) {
                        if (data['ShowInvoiceNarrativeTab'].toString().trim() === 'true') {
                            blnShowTab = true;
                        }
                    }

                    //if global default has not yet been set, then set it according to blnShowTab.
                    if (this.pageParams.blnShowInvoiceNarrativeTab === '' && this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                        this.pageParams.blnShowInvoiceNarrativeTab = blnShowTab;
                    }

                    //Default has been set and current mode is MntConst.eModeAdd, so show tab only if it should be shown by default
                    if (this.pageParams.blnShowInvoiceNarrativeTab) blnShowTab = this.pageParams.blnShowInvoiceNarrativeTab;

                    //Show tab if  needed.
                    if (blnShowTab) {
                        this.riTab.TabAdd('Invoice Narrative');
                        this.riTab.TabDraw();
                    }
                }
                this.riTab.TabDraw();
            }, 'POST');
        } else {
            //Default has been set and current mode is MntConst.eModeAdd, so show tab only if it should be shown by default
            blnShowTab = this.pageParams.blnShowInvoiceNarrativeTab;
            //Show tab if needed.
            if (blnShowTab) {
                this.riTab.TabAdd('Invoice Narrative');
                this.riTab.TabDraw();
            }
        }

        this.riTab.TabAdd('Servicing');
        this.riTab.TabDraw();
    }

    //********
    //* Menu *
    //********
    public BuildMenuOptions(): void {
        //The following variable is primarily used through contact centre to limit access by employee
        let cEmployeeLimitChildDrillOptions = this.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions');

        let objPortfolioGroup = [];
        let objHistoryGroup = [];
        let objInvoicingGroup = [];
        let objServiceGroup = [];
        let objCustomerGroup = [];
        //Must check to see if the menu is hidden first, otherwise adding an item displays the drop down!
        if (this.riExchange.riInputElement.checked(this.uiForm, 'RunningReadOnly')) { //Checkbox
            objPortfolioGroup.push({ value: 'ServiceCover', label: 'Service Covers' });
        }

        if (this.pageParams.cEmployeeLimitChildDrillOptions !== 'Y') {
            objPortfolioGroup.push({ value: 'Contract', label: 'Contract' });
        }

        if (this.pageParams.vSCMultiContactInd) {
            objPortfolioGroup.push({ value: 'contacts', label: 'Contact Details' });
        }
        objPortfolioGroup.push({ value: 'ServiceCover', label: 'Service Covers' });

        if (this.pageParams.SCServiceCoverUpdateViaGrid && this.pageParams.CurrentContractType !== 'P') {
            if (this.pageParams.ParentMode !== 'CallCentreSearch' && this.pageParams.cEmployeeLimitChildDrillOptions !== 'Y') {
                objPortfolioGroup.push({ value: 'ServiceCoverUpdateable', label: 'Service Cover Summary Grid' });
            }
        }

        if (this.pageParams.CurrentContractType !== 'P') {
            objPortfolioGroup.push({ value: 'CopyToProductSales', label: 'Create Product Sale' });
        }
        objPortfolioGroup.push({ value: 'TeleSalesOrder', label: 'Telesales Order' });

        //History Options
        objHistoryGroup.push({ value: 'History', label: 'Premises History' });
        objHistoryGroup.push({ value: 'EventHistory', label: 'Event History' });

        if (this.pageParams.SCEnablePestNetOnlineProcessing) {
            objHistoryGroup.push({ value: 'PNOLLevel', label: 'PestNetOnline Level History' });
        }

        //Invoicing Options
        objInvoicingGroup.push({ value: 'ProRataCharge', label: 'Pro Rata Charge' });
        objInvoicingGroup.push({ value: 'InvoiceNarrative', label: 'Invoice Narrative' });
        objInvoicingGroup.push({ value: 'InvoiceCharge', label: 'Invoice Charge' });
        objInvoicingGroup.push({ value: 'InvoiceHistory', label: 'Invoice History' });

        //Service Options
        objServiceGroup.push({ value: 'StaticVisits', label: 'Static Visits (SOS)' });
        objServiceGroup.push({ value: 'VisitSummary', label: 'Visit Summary' });
        objServiceGroup.push({ value: 'Service Recommendations', label: 'Service Recommendations' });
        objServiceGroup.push({ value: 'StateOfService', label: 'State Of Service' });

        if (this.pageParams.SCEnableBarcodes) {
            objServiceGroup.push({ value: 'Barcode', label: 'Barcode' });
        }

        if (this.pageParams.vbEnableLocations) {
            objServiceGroup.push({ value: 'Allocate', label: 'Allocate Locations' });
        }

        if (this.pageParams.vbEnableInstallsRemovals) {
            objServiceGroup.push({ value: 'ThirdPartyInstall', label: '3rd Party Installation Note' });
        }

        objServiceGroup.push({ value: 'ServiceCoverAccessTimes', label: 'Service Cover Access Times' });

        if (this.pageParams.vbShowWasteConsignmentNoteHistory) {
            objServiceGroup.push({ value: 'WasteConsignmentNoteHistory', label: 'Waste Consignment Note History' });
        }

        if (this.pageParams.SCVisitTolerances) {
            objServiceGroup.push({ value: 'VisitTolerances', label: 'Visit Tolerances' });
        }

        if (this.pageParams.SCInfestationTolerances) {
            objServiceGroup.push({ value: 'InfestationTolerances', label: 'Infestation Tolerances' });
        }

        objCustomerGroup.push({ value: 'ContactManagement', label: 'Contact Management' });
        objCustomerGroup.push({ value: 'ContactManagementSearch', label: 'Contact Centre Search' });
        if (this.pageParams.vEnableRMM) {
            objCustomerGroup.push({ value: 'CustomerCCO', label: 'Customer CCO Report' });
        }
        objCustomerGroup.push({ value: 'CustomerInformation', label: 'Customer Information' });

        //Add any extension options
        if (this.riExchange.riInputElement.checked(this.uiForm, 'RunningReadOnly') && this.uiDisplay.grdPremiseMaintenanceControl) { //Checkbox
            //this.iefAddCustomOptions(); //Functionality not sure
        }

        //Add Groups to menu
        let menuOptions = [
            { OptionGrp: 'Portfolio', Options: objPortfolioGroup },
            { OptionGrp: 'History', Options: objHistoryGroup },
            { OptionGrp: 'Invoicing', Options: objInvoicingGroup },
            { OptionGrp: 'Servicing', Options: objServiceGroup },
            { OptionGrp: 'Customer Relations', Options: objCustomerGroup }
        ];

        this.parent.dropDown.menu = menuOptions;
        setTimeout(() => { this.parent.setControlValue('menu', 'Options'); }, 500);
    }

    public BuildMenuAddOption(rstrValue: any, rstrText: any): void {
        //Functionality not required
    }


    //**************************************
    //* Menu - onchange/ondeactivate actions *
    //**************************************
    public menu_onchange(menu: any): void {
        let ctrl = this.uiForm.controls;
        if (this.riMaintenance.RecordSelected()) {
            let blnAccess;
            if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full' ||
                this.riExchange.ClientSideValues.Fetch('BranchNumber') === ctrl.ServiceBranchNumber.value ||
                this.riExchange.ClientSideValues.Fetch('BranchNumber') === ctrl.NegBranchNumber.value) {
                blnAccess = true;
            } else {
                blnAccess = false;
            }

            switch (menu) {
                case 'ContactManagement': this.cmdContactManagement_onclick(); break;
                case 'ContactManagementSearch':
                    this.parent.navigate('Premise', 'ccm/callcentersearch', {
                        'ContractNumber': this.parent.getControlValue('ContractNumber'),
                        'PremiseNumber': this.parent.getControlValue('PremiseNumber')
                    }); //TODO - verify
                    break;
                case 'contacts':
                    if (this.riMaintenance.RecordSelected()) {
                        this.parent.pgPM3.cmdContactDetails();
                    }
                    break;
                case 'PNOLLevel': this.cmdPNOLLevel_onclick(); break;
                case 'ServiceCover': this.cmdServiceSummary_onclick(); break;
                case 'CopyToProductSales': this.parent.pgPM3.cmdProductSales_onclick('save'); break;
                case 'ServiceCoverUpdateable': this.cmdServiceCoverUpdateable_onclick(); break;
                case 'History': if (blnAccess) this.cmdHistory_onclick(); break;
                case 'Allocate': if (blnAccess) this.cmdAllocate_onclick(); break;
                case 'InvoiceNarrative': if (blnAccess) this.cmdInvoiceNarrative_onclick(); break;
                case 'ProRataCharge': if (blnAccess) this.cmdProRata_onclick(); break;
                case 'InvoiceCharge': if (blnAccess) this.cmdInvoiceCharge_onclick(); break;
                case 'InvoiceHistory': if (blnAccess) this.cmdInvoiceHistory_onclick(); break;
                case 'ServiceCoverAccessTimes': this.cmdAccessTimes_onclick(); break;
                case 'ThirdPartyInstall': if (blnAccess) this.cmdThirdPartyInstall_onclick(); break;
                case 'StaticVisits': if (blnAccess) this.cmdStaticVisits_onclick(); break;
                case 'VisitSummary': if (blnAccess) this.cmdVisitSummary_onclick(); break;
                case 'Service Recommendations': this.cmdServiceRecommendations_onclick(); break;
                case 'StateOfService': if (blnAccess) this.cmdStateOfService_onclick(); break;
                case 'EventHistory': this.cmdEventHistory_onclick(); break;
                case 'Contract': this.cmdContract_onclick(); break;
                case 'CustomerInformation': this.cmdCustomerInformation_onclick(); break;
                case 'Barcode': this.cmdBarcode_onclick(); break;
                case 'WasteConsignmentNoteHistory': this.cmdWasteConsignmentNoteHistory_onclick(); break;
                case 'VisitTolerances': this.cmdVisitTolerances_onclick(); break;
                case 'InfestationTolerances': this.cmdInfestationTolerances_onclick(); break;
                case 'TeleSalesOrder': this.cmdTeleSalesOrder_onclick(); break;
                case 'CustomerCCO': this.cmdCustomerCCO_onclick(); break;
                default: //TODO this.iefSelectCustomOption(); //Check for extension items
            }
        }
    }

    public PremiseName_onchange(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.pageParams.SCRunPAFSearchOnFirstAddressLine) {
                this.cmdGetAddress_onclick();
            }
        }
    }

    public GPSCoordinateX_onchange(): void {
        this.SetRoutingSource();
    }

    public GPSCoordinateY_onchange(): void {
        this.SetRoutingSource();
    }

    public RoutingScore_onchange(): void {
        this.SetRoutingSource();
    }

    public SetRoutingSource(): void {
        let decGPSX = 0;
        let decGPSY = 0;
        let intRoutingScore = 0;

        if (!isNaN(parseInt(this.parent.getControlValue('GPSCoordinateX'), 2))) {
            decGPSX = parseInt(this.parent.getControlValue('GPSCoordinateX'), 2);
        } else {
            decGPSX = 0;
        }

        if (!isNaN(parseInt(this.parent.getControlValue('GPSCoordinateY'), 2))) {
            decGPSY = parseInt(this.parent.getControlValue('GPSCoordinateY'), 2);
        } else {
            decGPSY = 0;
        }

        if (!isNaN(parseInt(this.parent.getControlValue('RoutingScore'), 2))) {
            intRoutingScore = parseInt(this.parent.getControlValue('RoutingScore'), 2);
        } else {
            intRoutingScore = 0;
        }

        if (intRoutingScore === 0 || decGPSY === 0 || decGPSX === 0) {
            this.parent.setControlValue('SelRoutingSource', '');
            this.parent.setControlValue('Routingsource', '');
        } else {
            this.parent.setControlValue('SelRoutingSource', 'M');
            this.parent.setControlValue('Routingsource', 'M');
        }
    }

    public PremisePostcode_ondeactivate(): void {
        if (this.pageParams.SCPostCodeRequired && this.parent.getControlValue('PremisePostcode').trim() === '') {
            this.cmdGetAddress_onclick();
        }
        switch (this.riMaintenance.CurrentMode) {
            case MntConst.eModeAdd:
                this.DefaultFromPostcode();
                this.riExchange_CBORequest();
                break;
        }
    }

    public PremiseCommenceDate_ondeactivate(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.parent.getControlValue('ErrorMessageDesc') === '') {
                this.riTab.TabFocus(1);
            } else {
                this.parent.setControlValue('ErrorMessageDesc', '');
            }
            this.parent.pgPM2.riExchange_CBORequest();
        }
    }

    public PremiseName_ondeactivate(): void {
        if (!this.pageParams.blnIgnore) {
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd && this.parent.getControlValue('PremisePostcode') === '') {
                this.cmdGetAddress_onclick();
            }
        }
    }

    public ContractNumber_ondeactivate(): void {
        if (this.parent.getControlValue('ContractNumber') !== '' && this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdCopyPremise');
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdCopyPremise');
        }
    }


    //********************************
    //* Menu Options (onclick actions) *
    //********************************
    public cmdCustomerInformation_onclick(): void {
        this.parent.navigate('ServiceCover', InternalGridSearchServiceModuleRoutes.ICABSACUSTOMERINFORMATIONSUMMARY.URL_1, {
            parentMode: 'ServiceCover',
            contractNumber: this.parent.getControlValue('ContractNumber'),
            contractName: this.parent.getControlValue('ContractName'),
            accountNumber: this.parent.getControlValue('AccountNumber')
        }); //iCABSACustomerInformationSummary.htm
    }

    public tdCustomerInfo_onclick(): void {
        this.cmdCustomerInformation_onclick();
    }

    public cmdContactManagement_onclick(): void {
        if (this.pageParams.lREGContactCentreReview) {
            this.parent.navigate('Premise', 'ccm/centreReview', {
                AccountNumber: this.parent.getControlValue('AccountNumber'),
                AccountName: this.parent.getControlValue('AccountName'),
                ContractNumber: this.parent.getControlValue('ContractNumber'),
                ContractName: this.parent.getControlValue('ContractName'),
                PremiseNumber: this.parent.getControlValue('PremiseNumber'),
                PremiseName: this.parent.getControlValue('PremiseName')
            });
        } else {
            this.parent.navigate('Premise', 'ccm/contact/search', {
                AccountNumber: this.parent.getControlValue('AccountNumber'),
                AccountName: this.parent.getControlValue('AccountName'),
                ContractNumber: this.parent.getControlValue('ContractNumber'),
                ContractName: this.parent.getControlValue('ContractName'),
                PremiseNumber: this.parent.getControlValue('PremiseNumber'),
                PremiseName: this.parent.getControlValue('PremiseName')
            });
        }
    }

    public cmdPNOLLevel_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchApplicationModuleRoutes.ICABSAPNOLLEVELHISTORY);
    }

    public cmdHistory_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSACONTRACTHISTORYGRID, {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            PremiseNumber: this.parent.getControlValue('PremiseNumber'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType,
            PremiseName: this.parent.getControlValue('PremiseName'),
            PremiseRowID: this.parent.getControlValue('Premise'),
            parentMode: 'Premise'
        });
    }

    public cmdServiceSummary_onclick(): void {
        if (this.pageParams.CurrentContractType === 'P') {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'TelesalesInd')) {
                this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSAPREMISESERVICESUMMARY);
            }
            else {
                this.parent.navigate('Premise', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_2);
            }
        } else {

            this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSAPREMISESERVICESUMMARY);
        }
    }

    public cmdServiceCoverUpdateable_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchApplicationModuleRoutes.ICABSASERVICECOVERUPDATEABLEGRID, {
            'PremiseAnnualValue': this.parent.getControlValue('PremiseAnnualValue'),
            'ContractTypeCode': this.pageParams.CurrentContractType,
            'ContractNumber': this.parent.getControlValue('ContractNumber'),
            'PremiseNumber': this.parent.getControlValue('PremiseNumber'),
            'ContractName': this.parent.getControlValue('ContractName'),
            'PremiseName': this.parent.getControlValue('PremiseName'),
            'ServiceBranchNumber': this.parent.getControlValue('ServiceBranchNumber'),
            'BranchName': this.parent.getControlValue('BranchName')
        });
    }

    public cmdAllocate_onclick(): void {
        this.parent.navigate('Premise-Allocate', '/application/premiseLocationAllocation', {
            'ServiceCoverRowID': this.parent.getControlValue('Premise'),
            'ContractTypeCode': this.pageParams.CurrentContractType,
            'ContractNumber': this.parent.getControlValue('ContractNumber'),
            'PremiseNumber': this.parent.getControlValue('PremiseNumber'),
            'ContractName': this.parent.getControlValue('ContractName'),
            'PremiseName': this.parent.getControlValue('PremiseName')
        });
    }

    public cmdServiceCover_onclick(): void {
        if (this.pageParams.CurrentContractType === 'P') {
            this.parent.navigate('Premise', InternalGridSearchServiceModuleRoutes.ICABSAPRODUCTSALESSCENTRYGRID.URL_1);
        } else {
            //TODO - Open as ellipsis
            //     riExchange.Mode = 'Premise'
            //     window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=Application/iCABSAServiceCoverSearch.htm' + CurrentContractTypeURLParameter
            this.parent.navigate('Premise', 'Application/iCABSAServiceCoverSearch'); // Need to verify route
        }
    }

    public cmdInvoiceNarrative_onclick(): void {
        this.parent.navigate('Premise', InternalMaintenanceSalesModuleRoutes.ICABSAINVOICENARRATIVEMAINTENANCE, {
            AccountNumber: this.parent.getControlValue('AccountNumber'),
            AccountName: this.parent.getControlValue('AccountName'),
            InvoiceGroupNumber: this.parent.getControlValue('InvoiceGroupNumber'),
            InvoiceGroupDesc: this.parent.getControlValue('InvoiceGroupDesc'),
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            PremiseNumber: this.parent.getControlValue('PremiseNumber'),
            PremiseName: this.parent.getControlValue('PremiseName')
        });
    }

    public cmdInvoiceCharge_onclick(): void {
        this.parent.navigate('Premise', 'contractmanagement/account/invoiceCharge', {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            PremiseNumber: this.parent.getControlValue('PremiseNumber'),
            PremiseName: this.parent.getControlValue('PremiseName')
        });
    }

    public cmdThirdPartyInstall_onclick(): void {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
        //   riExchange.Mode = 'Premise'
        //   window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=ApplicationReport/iCABSARThirdPartyInstallationNoteReport.htm' + CurrentContractTypeURLParameter
        // this.parent.navigate('Premise', 'Application/iCABSARThirdPartyInstallationNoteReport'); //TODO - Page not ready
    }

    public cmdGetAddress_onclick(): void {
        if (this.pageParams.vSCEnableHopewiserPAF) {
            this.parent.ellipsis.MPAFSearch.childparams.PostCode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.MPAFSearch.childparams.State = this.parent.getControlValue('PremiseAddressLine5');
            this.parent.ellipsis.MPAFSearch.childparams.Town = this.parent.getControlValue('PremiseAddressLine4');
            this.parent.ellipsis.MPAFSearch.childparams.BranchNumber = this.parent.utils.getBranchCode();
            setTimeout(() => { this.parent.isModalOpen(true); this.parent.MPAFSearch.openModal(); }, 200);
        } else if (this.pageParams.vSCEnableMarktSelect) {
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseName = this.parent.getControlValue('PremiseName');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremisePostcode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine1 = this.parent.getControlValue('PremiseAddressLine1');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine2 = this.parent.getControlValue('PremiseAddressLine2');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine3 = this.parent.getControlValue('PremiseAddressLine3');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine4 = this.parent.getControlValue('PremiseAddressLine4');
            this.parent.ellipsis.MarktSelectSearch.childparams.countryCode = this.parent.getControlValue('PremiseAddressLine5');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseContactTelephone = this.parent.getControlValue('PremiseContactTelephone');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseContactFax = this.parent.getControlValue('PremiseContactFax');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseReference = this.parent.getControlValue('PremiseReference');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseRegNumber = this.parent.getControlValue('PremiseRegNumber');
            this.parent.ellipsis.MarktSelectSearch.childparams.CustomerTypeCode = this.parent.getControlValue('CustomerTypeCode');
            this.parent.ellipsis.MarktSelectSearch.childparams.BranchNumber = this.parent.utils.getBranchCode();
            setTimeout(() => { this.parent.isModalOpen(true); this.parent.MarktSelectSearch.openModal(); }, 200);
        } else if (this.pageParams.vSCEnableDatabasePAF) {
            this.parent.ellipsis.PostCodeSearch.childparams.PremisePostCode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.PostCodeSearch.childparams.PremiseAddressLine5 = this.parent.getControlValue('PremiseAddressLine5');
            this.parent.ellipsis.PostCodeSearch.childparams.PremiseAddressLine4 = this.parent.getControlValue('PremiseAddressLine4');
            this.parent.ellipsis.PostCodeSearch.childparams.BranchNumber = this.parent.utils.getBranchCode();
            setTimeout(() => { this.parent.isModalOpen(true); this.parent.PostCodeSearch.openModal(); }, 200);
        }

        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) this.DefaultFromPostcode();
    }

    public cmdVtxGeoCode_onclick(): void {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
        // this.parent.navigate('Premise', 'Application/iCABSVertexGeoCodeSearch'); //TODO - Page not ready yet
    }

    public cmdValue_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID);
    }

    public cmdProRata_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY);
    }

    public cmdInvoiceHistory_onclick(): void {
        this.parent.navigate('Premise', '/billtocash/contract/invoice', {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            PremiseNumber: this.parent.getControlValue('PremiseNumber'),
            PremiseName: this.parent.getControlValue('PremiseName')
        });
    }

    public cmdAccessTimes_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSPREMISEACCESSTIMESGRID);
    }

    public cmdStateOfService_onclick(): void {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
        // this.parent.navigate('SOS', 'Application/iCABSSeStateOfServiceNatAccountGrid'); //TODO - Page not ready
    }

    public cmdStaticVisits_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchSalesModuleRoutes.ICABSASTATICVISITGRIDYEAR, {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            PremiseNumber: this.parent.getControlValue('PremiseNumber'),
            PremiseName: this.parent.getControlValue('PremiseName'),
            Premise: this.parent.getControlValue('Premise'),
            PremiseRowID: this.parent.getControlValue('Premise'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType
        });
    }

    public cmdVisitSummary_onclick(): void {
        this.parent.store.dispatch({
            type: ContractActionTypes.SAVE_DATA,
            payload: {
                'CurrentContractTypeURLParameter': this.pageParams.contractType,
                'ContractNumber': this.parent.getControlValue('ContractNumber'),
                'ContractName': this.parent.getControlValue('ContractName'),
                'PremiseNumber': this.parent.getControlValue('PremiseNumber'),
                'PremiseName': this.parent.getControlValue('PremiseName'),
                'ProductCode': this.parent.getControlValue('ProductCode'),
                'ProductDesc': this.parent.getControlValue('ProductDesc'),
                'PremiseRowID': this.parent.getControlValue('Premise'),
                'currentContractType': this.pageParams.CurrentContractType
            }
        });
        this.parent.navigate('ShowPremiseLevel', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVISITSUMMARY);
    }

    public cmdServiceRecommendations_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchServiceModuleRoutes.ICABSARECOMMENDATIONGRID.URL_1, {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            PremiseNumber: this.parent.getControlValue('PremiseNumber'),
            PremiseName: this.parent.getControlValue('PremiseName')
        });
    }

    public cmdEventHistory_onclick(): void {
        this.parent.navigate('Premise', InternalGridSearchServiceModuleRoutes.ICABSCMCUSTOMERCONTACTHISTORYGRID);
    }

    public cmdContract_onclick(): void {
        let URL = this.parent.utils.updateURL(ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, this.pageParams.CurrentContractType);
        this.parent.navigate('Premise', URL, {
            ContractNumber: this.parent.getControlValue('ContractNumber'),
            ContractName: this.parent.getControlValue('ContractName'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType,
            parentMode: 'Premise'
        });
    }

    public DrivingChargeInd_onclick(): void {
        this.logger.log('DrivingChargeInd', this.riExchange.riInputElement.checked(this.uiForm, 'DrivingChargeInd'));
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'DrivingChargeInd')) { //Checkbox
                this.uiDisplay.tdDrivingChargeValueLab = true;
                this.uiDisplay.tdDrivingChargeValue = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DrivingChargeValue', true);
            } else {
                this.uiDisplay.tdDrivingChargeValueLab = false;
                this.uiDisplay.tdDrivingChargeValue = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DrivingChargeValue', false);
            }
        }
    }

    public cmdCopyPremise_onclick(): void {
        this.parent.PremiseSearchMode = 'COPY';
        this.parent.flagCopyPremise = true;
        this.parent.ellipsis.premiseNumberEllipsis.disabled = false;
        this.parent.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'PremiseCopy';
        this.parent.ellipsis.premiseNumberEllipsis.childparams.showAddNew = false;
        this.parent.ellipsis.premiseNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
        this.parent.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.parent.getControlValue('ContractNumber');
        this.parent.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.parent.getControlValue('ContractName');
        this.parent.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.parent.getControlValue('AccountNumber');
        setTimeout(() => { this.parent.premiseNumberEllipsis.openModal(); }, 200);

        if (this.pageParams.vbShowPremiseWasteTab) {
            this.WasteConsignmentNoteExemptInd_onClick();
        }

        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.parent.pgPM3.GetGblSRAValues();
        }
    }


    public cmdResendPremises_onclick(): void {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.PostDataAdd('Function', 'ResendPremises', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BusinessCode', this.parent.businessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', this.parent.getControlValue('ContractNumber'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', this.parent.getControlValue('PremiseNumber'), MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('BatchProcessInformation', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) this.parent.showAlert(data.errorMessage);
            this.uiDisplay.render.BatchProcessInformation = data['BatchProcessInformation'];
            this.uiDisplay.trBatchProcessInformation = true;
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdResendPremises');
        }, 'POST');
    }

    public cmdBarcode_onclick(): void {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
        // this.parent.navigate('Barcode', 'Application/iCABSBBarcodeGrid'); //TODO - Page not ready
    }

    public cmdWasteConsignmentNoteHistory_onclick(): void {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
        // this.parent.navigate('Premise', 'Application/iCABSAWasteConsignmentNoteHistoryGrid'); //TODO - Page not ready
    }

    public cmdVisitTolerances_onclick(): void {
        this.parent.navigate('PremiseVisitTolerance', InternalGridSearchServiceModuleRoutes.ICABSSVISITTOLERANCEGRID, {
            'BusinessCode': this.utils.getBusinessCode(),
            'ContractNumber': this.parent.getControlValue('ContractNumber'),
            'PremiseNumber': this.parent.getControlValue('PremiseNumber')
        });
    }

    public cmdInfestationTolerances_onclick(): void {
        this.parent.navigate('PremiseInfestationTolerance', InternalGridSearchServiceModuleRoutes.ICABSSINFESTATIONTOLERANCEGRID, {
            'BusinessCode': this.utils.getBusinessCode(),
            'ContractNumber': this.parent.getControlValue('ContractNumber'),
            'PremiseNumber': this.parent.getControlValue('PremiseNumber')
        });
    }

    public cmdTeleSalesOrder_onclick(): void {
        this.parent.navigate('PremiseTeleSalesOrder', InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY);
    }

    public cmdCustomerCCO_onclick(): void {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
        // this.parent.navigate('PremiseCustomerCCO', 'Application/iCABSARCustomerCCOReportGrid'); //TODO - page not ready
    }

    public WasteConsignmentNoteExemptInd_onClick(): void {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'WasteConsignmentNoteExemptInd')) { //Checkbox
                this.riExchange.riInputElement.Disable(this.uiForm, 'WasteConsignmentNoteExpiryDate');
                this.parent.dateDisable('WasteConsignmentNoteExpiryDate', true, true);
                this.riExchange.riInputElement.Disable(this.uiForm, 'WasteRegulatoryPremiseRef');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'WasteRegulatoryPremiseRef', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'WasteConsignmentNoteExpiryDate', false);
                this.parent.setControlValue('NextWasteConsignmentNoteNumber', '');
            } else {
                this.riExchange.riInputElement.Enable(this.uiForm, 'WasteConsignmentNoteExpiryDate');
                this.parent.dateDisable('WasteConsignmentNoteExpiryDate', false, false);
                this.riExchange.riInputElement.Enable(this.uiForm, 'WasteRegulatoryPremiseRef');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'WasteRegulatoryPremiseRef', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'WasteConsignmentNoteExpiryDate', true);
                if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                    this.parent.setControlValue('NextWasteConsignmentNoteNumber', this.pageParams.vbNextWCNoteNumberDefault);
                }
            }
        }
    }

    //*****************************
    //* LookUps (onkeydown actions)
    //*****************************
    public PNOLiCABSLevel_onChange(): void {
        this.CheckCanUpdatePNOLDetails();
        let lookupIP = [
            {
                'table': 'PestNetOnLineLevel',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'PNOLiCABSLevel': this.parent.getControlValue('PNOLiCABSLevel') },
                'fields': ['PNOLiCABSLevel', 'PNOLDescription']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            if (data && data[0].length > 0) {
                this.parent.PNOLiCABSLevelSelection(data[0][0]);
            }
        });
    }

    public PNOLEffectiveDate_onChange(): void {
        this.parent.pgPM2.CheckCanUpdatePNOLDetails();
    }

    public CheckCanUpdatePNOLDetails(): void {
        if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL') &&
            (this.parent.getControlValue('PNOLiCABSLevel') !== this.parent.getControlValue('origPNOLiCABSLevel')) ||
            (this.parent.getControlValue('PNOLEffectiveDate') !== this.parent.getControlValue('origPNOLEffectiveDate')) &&
            this.pageParams.CurrentContractType === 'C'
        ) {
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.uiDisplay.trAddToPNOLUpliftAmount = false;
                this.riMaintenance.DisableInput('PNOLUpliftAmount');
            } else {
                this.uiDisplay.trAddToPNOLUpliftAmount = true;
                this.riMaintenance.EnableInput('PNOLUpliftAmount');
            }
            this.uiDisplay.trAddToPNOLSetupChargeToApply = true;
            this.riMaintenance.EnableInput('PNOLSetUpChargeToApply');
        } else {
            this.uiDisplay.trAddToPNOLUpliftAmount = false;
            this.uiDisplay.trAddToPNOLSetupChargeToApply = false;
        }
    }

    public ServiceBranchNumber_onkeydown(): void { //
        //   if ( window.event.keyCode = 34 ) {
        //     riExchange.Mode = 'LookUp-ServBranch': window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=Business/iCABSBBranchSearch.htm'
        //   }
    }

    public CustomerTypeCode_onkeydown(): void {
        //   if ( this.riExchange.riInputElement.isLookUpRequested('CustomerTypeCode') ) {
        //       if ( vSICCodeEnable ) {
        //          riExchange.Mode = 'LookUp-PremiseIncSIC': window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=System/iCABSSCustomerTypeSearch.htm'

        //          this.riExchange.ProcessDoEvents()

        //          Do While riExchange.Busy
        //             this.riExchange.ProcessDoEvents()
        //          Loop

        //          this.SICCode_onChange
        //       Else
        //          riExchange.Mode = 'LookUp-Premise': window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=System/iCABSSCustomerTypeSearch.htm'

        //          this.riExchange.ProcessDoEvents()

        //          Do While riExchange.Busy
        //             this.riExchange.ProcessDoEvents()
        //          Loop
        //       }

        //       this.GetGblSRAValues()

        //       Switch(){ //this.riMaintenance.CurrentMode
        //       case MntConst.eModeAdd
        //         this.GetCustomerTypeDefault()
        //       }
        //   }
    }

    public CustomerTypeCode_onchange(): void {
        if (this.parent.getControlValue('CustomerTypeCode') !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.riMaintenance.PostDataAdd('PostDesc', 'CustomerType2', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('CustomerTypeCode', this.parent.getControlValue('CustomerTypeCode'), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SICCodeEnable', this.pageParams.vSICCodeEnable, MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('CustomerTypeDesc', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('SICCode', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('SICDesc', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (data['CustomerTypeDesc'] !== '') {
                    this.parent.setControlValue('CustomerTypeDesc', data['CustomerTypeDesc']);
                    this.parent.setControlValue('SICCode', data['SICCode']);
                    this.parent.setControlValue('SICDesc', data['SICDesc']);
                } else {
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'CustomerTypeCode');
                    // this.parent.setControlValue('CustomerTypeCode', '');
                    this.parent.setControlValue('CustomerTypeDesc', '');
                    this.parent.setControlValue('SICCode', '');
                    this.parent.setControlValue('SICDesc', '');
                }
            }, 'POST', 0);
        } else {
            this.parent.setControlValue('CustomerTypeDesc', '');
            this.parent.setControlValue('SICCode', '');
            this.parent.setControlValue('SICDesc', '');
        }

        this.parent.pgPM3.GetGblSRAValues();

        switch (this.riMaintenance.CurrentMode) {
            case MntConst.eModeAdd:
                this.parent.pgPM3.GetCustomerTypeDefault();
                break;
        }
    }

    public RegulatoryAuthorityNumber_onChange(): void {
        if (this.parent.getControlValue('RegulatoryAuthorityNumber') !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.riMaintenance.PostDataAdd('PostDesc', 'RegulatoryAuthority', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('RegulatoryAuthorityNumber', this.parent.getControlValue('RegulatoryAuthorityNumber'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('RegulatoryAuthorityName', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (data.hasError) {
                    this.parent.setControlValue('RegulatoryAuthorityNumber', '');
                    this.parent.setControlValue('RegulatoryAuthorityName', '');
                } else {
                    this.parent.setControlValue('RegulatoryAuthorityName', data['RegulatoryAuthorityName']);
                }
            }, 'POST', 0);
        } else {
            this.parent.setControlValue('RegulatoryAuthorityName', '');
        }
    }

    public PremiseSRAEmployee_onkeydown(): void {
        //   if ( window.event.keyCode = 34 ) {
        //     riExchange.Mode = 'LookUp-PremiseSRAEmployee': window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=Business/iCABSBEmployeeSearch.htm'
        //   }
    }

    public DiscountCode_onkeydown(): void { //TODO dropdown
        //   if ( window.event.keyCode = 34 ) {
        //     riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=Business/iCABSBDiscountSearch.htm'
        //   }
    }

    public InvoiceGroupNumber_onkeydown(): void { //TODO already a keydown fn present
        //   if ( window.event.keyCode = 34 ) {
        //     riExchange.Mode = 'PremiseMaintenanceSearch': window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=Application/iCABSAInvoiceGroupGrid.htm<maxwidth>'
        //   }
    }

    public LinkedToContractNumber_onkeydown(obj: any): void {
        if (obj.keyCode === 34) {
            this.parent.ellipsis.contractNumberEllipsis.childparams.parentMode = 'LookUp-LinkedToContract';
            this.parent.ellipsis.contractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
            this.parent.contractNumberEllipsis.openModal();
        }
    }

    public LinkedToPremiseNumber_onkeydown(obj: any): void {
        if (obj.keyCode === 34) {
            this.parent.ellipsis.contractNumberEllipsis.childparams.parentMode = 'Search-LinkedToPremise';
            this.parent.ellipsis.contractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
            this.parent.PremiseSearchMode = 'LINKED';
            this.parent.premiseNumberEllipsis.openModal();
        }
    }

    public CustomerAvailTemplateID_onkeydown(): void {
        //   if ( window.event.keyCode = 34 ) {
        //     riExchange.Mode = "LookUp": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSCustomerAvailabilityTemplateSearch.htm"
        //     this.riExchange.ProcessDoEvents() //COMMENTED- RTB0096
        //     Do While riExchange.Busy
        //         this.riExchange.ProcessDoEvents()
        //     Loop
        //     UpdateTemplate()
        //   }
    }

    public CustomerAvailTemplateID_OnChange(): void {
        this.UpdateTemplate();
    }

    public PreferredDayOfWeekReasonCode_onkeydown(): void {
        //   if ( window.event.keyCode = 34 ) {
        //     riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?rif (ileName=Business/iCABSBPreferredDayOfWeekReasonSearch.htm'
        //   }
    }

    public PreferredDayOfWeekReasonCode_onchange(): void {
        if (this.parent.getControlValue('PreferredDayOfWeekReasonCode') !== '0' &&
            this.parent.getControlValue('PreferredDayOfWeekReasonCode') !== '') {

            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.riMaintenance.PostDataAdd('PostDesc', 'PreferredDayOfWeekReason', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('PreferredDayOfWeekReasonCode', this.parent.getControlValue('PreferredDayOfWeekReasonCode'), MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('LanguageCode', this.riExchange.LanguageCode(), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('PreferredDayOfWeekReasonDesc', MntConst.eTypeText);

            this.riMaintenance.Execute(this, function (data: any): any {
                this.parent.setControlValue('PreferredDayOfWeekReasonLangDesc', data['PreferredDayOfWeekReasonDesc']);
            }, 'POST', 0);
        } else {
            this.parent.setControlValue('PreferredDayOfWeekReasonCode', '');
            this.parent.setControlValue('PreferredDayOfWeekReasonLangDesc', '');
        }
    }

    public SetQuickWindowSetValue(strValue: any): void {
        for (let i = 1; i <= 7; i++) {
            this.parent.setControlValue('selQuickWindowSet' + i, strValue);
        }
    }

    public WindowPreferredIndChanged(): void {
        let blnAnyPreferred = false;

        //Clicking the checkboxes even though not in add or update mode, triggers this function
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            for (let iLoop = 1; iLoop <= 7; iLoop++) {
                if (this.riExchange.riInputElement.checked(this.uiForm, 'WindowPreferredInd0' + iLoop)) { //Checkbox
                    blnAnyPreferred = true;
                }
            }

            if (blnAnyPreferred) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'PreferredDayOfWeekReasonCode');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PreferredDayOfWeekReasonCode', true);
                this.riExchange.riInputElement.Enable(this.uiForm, 'PreferredDayOfWeekNote');
            } else {
                this.parent.setControlValue('PreferredDayOfWeekReasonCode', '');
                this.riExchange.riInputElement.Disable(this.uiForm, 'PreferredDayOfWeekReasonCode');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PreferredDayOfWeekReasonCode', false);
                this.parent.setControlValue('PreferredDayOfWeekReasonLangDesc', '');
                this.parent.setControlValue('PreferredDayOfWeekNote', '');
                this.riExchange.riInputElement.Disable(this.uiForm, 'PreferredDayOfWeekNote');
            }
        }
    }


    public WasteRegulatoryPremiseRef_OnChange(): void {
        if (this.parent.getControlValue('WasteRegulatoryPremiseRef') !== '') {
            this.parent.setControlValue('NextWasteConsignmentNoteNumber', this.pageParams.vbNextWCNoteNumberDefault);
        } else {
            this.parent.setControlValue('NextWasteConsignmentNoteNumber', '');
        }
    }

    public riExchange_QueryUnloadHTMLDocument(): void {
        //Functionality not required - TODO?
        //   if ( riExchange.ParentMode = '/wsscripts/riHTMLWrapper.p?rifileName=Contract-Add' ) {
        //     if ( Not PremiseAdded ) {
        //        msgbox 'No Premises Have Been Added For This Contract'
        //     }
        //   }
    }

    public ContractNumberFormatChange(num: string): any {
        let paddedNum = '';
        if (num) {
            paddedNum = this.utils.numberPadding(num, 8);
        }
        return paddedNum;
    }

    // public ContractNumber_onchange(): void {
    //     //TODO - Should go in premiseMnt file
    //     this.parent.setControlValue('ContractNumber', this.ContractNumberFormatChange(this.parent.getControlValue('ContractNumber')));
    //     if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
    //         this.parent.pgPM3.TermiteServiceCheck();
    //     }
    // }

    public LinkedToPremiseNumber_onchange(): void {
        this.LinkedStatusChanged();
    }

    public LinkedToContractNumber_onchange(): void {
        this.parent.setControlValue('LinkedToContractNumber', this.ContractNumberFormatChange(this.parent.getControlValue('LinkedToContractNumber')));
        this.LinkedStatusChanged();

        this.riExchange.riInputElement.Disable(this.uiForm, 'LinkedToPremiseNumber');
        //Do LookUp
        this.LookUp.lookUpPromise([{
            'table': 'Contract',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.parent.getControlValue('LinkedToContractNumber') },
            'fields': ['ContractNumber', 'ContractName']
        }]).then((data) => {
            if (data) {
                if (data[0].length > 0) {
                    let objData = data[0][0];
                    this.parent.setControlValue('LinkedToContractName', data[0][0].ContractName);

                    //Update data for PremiseSearch Ellipsis
                    this.parent.ellipsis.linkedPremiseNumberEllipsis.disabled = false;
                    this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.parentMode = 'Search';
                    this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
                    this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.ContractNumber = this.parent.getControlValue('LinkedToContractNumber');
                    this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.ContractName = this.parent.getControlValue('LinkedToContractName');
                    this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.AccountNumber = data[0][0].AccountNumber;

                    this.riExchange.riInputElement.Enable(this.uiForm, 'LinkedToPremiseNumber');
                } else {
                    this.parent.setControlValue('LinkedToContractName', '');
                    this.parent.setControlValue('LinkedToPremiseNumber', '');
                    this.parent.setControlValue('LinkedToPremiseName', '');
                    this.parent.pgPM2.LinkedStatusChanged();
                }
            }
        });
    }

    public LinkedStatusChanged(): void {
        if (this.parent.getControlValue('LinkedToContractNumber') !== '' ||
            this.parent.getControlValue('LinkedToPremiseNumber') !== '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LinkedToContractNumber', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LinkedToPremiseNumber', true);
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LinkedToContractNumber', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LinkedToPremiseNumber', false);
        }
    }

    public RegulatoryAuthorityNumber_onkeydown(): void {
        //TODO - Ellipsis
        // if (obj.keyCode === 34) {
        //     this.parent.navigate('LookUp', 'iCABSBRegulatoryAuthoritySearch.htm');
        // }
    }

    public PNOLSiteRef_OnKeyDown(obj: any): void {
        if (obj.keyCode === 34) {
            this.parent.navigate('LookUp', 'grid/application/PNOLPremiseSearch');
        }
    }

    public SalesAreaCodeSearch(): void {
        //TODO - Ellipsis
        // blnNoFire = true
        // this.parent.navigate('LookUp-Premise', 'iCABSBSalesAreaSearch.htm');
        // blnNoFire = false
    }

    public PremiseAddressLine4_onfocusout(): void {
        if (this.pageParams.SCAddressLine4Required && this.parent.getControlValue('PremiseAddressLine4').trim() === '' && this.pageParams.vbEnableValidatePostcodeSuburb) {
            this.cmdGetAddress_onclick();
        }
    }

    public PremiseAddressLine5_onfocusout(): void {
        if (this.pageParams.SCAddressLine5Required && this.parent.getControlValue('PremiseAddressLine5').trim() === '' && this.pageParams.vbEnableValidatePostcodeSuburb) {
            this.cmdGetAddress_onclick();
        }
    }

    public PremisePostcode_onfocusout(): void {
        //Not required - merged with _ondeactivate
    }

    public TelesalesEmployeeCode_onkeydown(obj: any): void {
        //Not required here
    }

    public PremisePostcode_onkeydown(): void {
        //TODO - Page Down out of scope
        // this.cmdGetAddress_onclick();
    }

    public HideQuickWindowSet(ipHide: boolean): void {
        let iLoop = 0;
        let strDisp = false;

        if (ipHide) {
            strDisp = false;
        }
        else {
            strDisp = true;
            this.SetQuickWindowSetValue('C');
        }

        for (let i = 1; i <= 7; i++) {
            this.uiDisplay['selQuickWindowSet' + i] = strDisp;
        }
    }

    public CalDisplayValues(): void {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.PostDataAdd('Function', 'CalcDisplayValues', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BusinessCode', this.parent.businessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', this.parent.getControlValue('ContractNumber'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', this.parent.getControlValue('PremiseNumber'), MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('DisplayQty', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('WEDValue', MntConst.eTypeDecimal1);
        this.riMaintenance.ReturnDataAdd('MaterialsValue', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('MaterialsCost', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('LabourValue', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('LabourCost', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('ReplacementValue', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('ReplacementCost', MntConst.eTypeCurrency);

        this.riMaintenance.Execute(this, function (data: any): any {
            if (data.hasError) this.parent.showAlert(data.errorMessage);
            this.parent.setControlValue('DisplayQty', data['DisplayQty']);
            this.parent.setControlValue('WEDValue', data['WEDValue']);
            this.parent.setControlValue('MaterialsValue', data['MaterialsValue']);
            this.parent.setControlValue('MaterialsCost', data['MaterialsCost']);
            this.parent.setControlValue('LabourValue', data['LabourValue']);
            this.parent.setControlValue('LabourCost', data['LabourCost']);
            this.parent.setControlValue('ReplacementValue', data['ReplacementValue']);
            this.parent.setControlValue('ReplacementCost', data['ReplacementCost']);
        }, 'POST');
    }

    public UpdateTemplate(): void {
        if (this.parent.getControlValue('CustomerAvailTemplateID') !== '') {
            this.riMaintenance.clear();

            this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
            this.riMaintenance.PostDataAdd('Function', 'CustomerAvailTemplate', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.parent.businessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('CustomerAvailTemplateID', this.parent.getControlValue('CustomerAvailTemplateID'), MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('CustomerAvailTemplateDesc', MntConst.eTypeText);
            for (let i = 1; i <= 14; i++) {
                this.riMaintenance.ReturnDataAdd('WindowStart' + this.utils.numberPadding(i, 2), MntConst.eTypeTime);
                this.riMaintenance.ReturnDataAdd('WindowEnd' + this.utils.numberPadding(i, 2), MntConst.eTypeTime);
            }

            this.riMaintenance.Execute(this, function (data: any): any {
                if (data.hasError) this.parent.showAlert(data.errorMessage);
                this.parent.setControlValue('CustomerAvailTemplateDesc', data['CustomerAvailTemplateDesc']);
                for (let i = 1; i <= 14; i++) {
                    this.parent.setControlValue('WindowStart' + this.utils.numberPadding(i, 2), data['WindowStart' + this.utils.numberPadding(i, 2)]);
                    this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(i, 2), data['WindowEnd' + this.utils.numberPadding(i, 2)]);
                    if (i <= 7) {
                        this.parent.setControlValue('selQuickWindowSet' + i, 'C');
                        this.parent.pgPM3.selQuickWindowSet_onchange({ id: 'selQuickWindowSet' + i });
                    }
                }
            }, 'POST');
        }
    }
}
