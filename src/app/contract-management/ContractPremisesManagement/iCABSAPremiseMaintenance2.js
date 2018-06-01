import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { ContractActionTypes } from '../../actions/contract';
export var PremiseMaintenance2 = (function () {
    function PremiseMaintenance2(parent) {
        this.parent = parent;
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
    PremiseMaintenance2.prototype.killSubscription = function () { };
    PremiseMaintenance2.prototype.window_onload = function () {
        this.pgPM0 = this.parent.pgPM0;
        this.pgPM1 = this.parent.pgPM1;
        this.pgPM1a = this.parent.pgPM1a;
        this.pgPM2 = this.parent.pgPM2;
        this.pgPM3 = this.parent.pgPM3;
        this.pgPM4 = this.parent.pgPM4;
    };
    PremiseMaintenance2.prototype.riMaintenance_Search = function () {
    };
    PremiseMaintenance2.prototype.riMaintenance_BeforeSelect = function () {
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdBtnAmendContact = false;
        }
        this.uiDisplay.tdCustomerInfo = false;
        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.LostBusinessDesc = false;
        this.uiDisplay.cmdValue = false;
        this.uiDisplay.tdPremiseAnnualValueLab = false;
    };
    PremiseMaintenance2.prototype.riMaintenance_BeforeFetch = function () {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ContractTypeCode=' + this.pageParams.CurrentContractType;
    };
    PremiseMaintenance2.prototype.riMaintenance_BeforeMode = function () {
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
    };
    PremiseMaintenance2.prototype.riMaintenance_BeforeAddMode = function () {
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdbtnAmendContact = false;
            this.parent.pgPM3.SensitiseContactDetails(true);
        }
        if (this.pageParams.SCEnableBarcodes && this.pageParams.SCRequireBarcodes) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProofScanRequiredInd', true);
        }
        if (this.pageParams.SCEnableSignatures && this.pageParams.SCRequireSignatures) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProofSignatureRequiredInd', true);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseVtxGeoCode', '');
        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetAddress');
        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdVtxGeoCode');
        this.pageParams.GridCacheTime = (new Date()).toTimeString().split(' ')[0];
        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdSRAGenerateText');
        this.parent.pgPM2.HideQuickWindowSet(false);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '') {
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdCopyPremise');
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdCopyPremise');
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentContractType', this.pageParams.CurrentContractType);
        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.LostBusinessDesc = false;
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetDefaultDiscountCode';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBO Callback A', data);
            if (data.hasError)
                this.parent.showAlert(data.errorMessage);
            else
                this.parent.setControlValue('DiscountCode', data['DiscountCode']);
        });
        this.parent.pgPM2.WindowPreferredIndChanged();
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetDefaultLanguageCode';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('AccountNumber');
        this.riMaintenance.CBORequestAdd('InvoiceGroupNumber');
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBO Callback B', data);
            if (data.hasError)
                this.parent.showAlert(data.errorMessage);
            else
                this.parent.setControlValue('LanguageCode', data['LanguageCode']);
        });
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetTelesalesInd';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBO Callback C', data);
            if (data.hasError)
                this.parent.showAlert(data.errorMessage);
            else {
                this.parent.setControlValue('TelesalesInd', this.utils.convertResponseValueToCheckboxInput(data['TelesalesInd']));
                if (this.riExchange.riInputElement.checked(this.uiForm, 'TelesalesInd')) {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TelesalesEmployeeCode', true);
                }
                else {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TelesalesEmployeeCode', false);
                }
            }
        });
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetBusinessDefaultWindows';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBO Callback D', data, this);
            if (data.hasError)
                this.parent.showAlert(data.errorMessage);
            this.parent.riMaintenance.renderResponseForCtrl(this, data);
            this.pageParams.PNOLMode = 'Add';
            this.parent.pgPM1.SetOkToUpgradeToPNOL();
            if (!this.pageParams.vSICCodeRequire) {
                this.riExchange.riInputElement.Disable(this.uiForm, 'SICCode');
            }
            if (this.pageParams.vbShowPremiseWasteTab) {
                this.parent.pgPM2.WasteConsignmentNoteExemptInd_onClick();
            }
            this.riExchange.riInputElement.Disable(this.uiForm, 'NextWasteConsignmentNoteNumber');
            this.riExchange.riInputElement.Enable(this.uiForm, 'SelServiceNotifyTemplateEmail');
            this.riExchange.riInputElement.Enable(this.uiForm, 'SelServiceNotifyTemplateSMS');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'selRoutingSource', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelServiceNotifyTemplateEmail', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelServiceNotifyTemplateSMS', '');
            this.parent.pgPM2.SetQuickWindowSetValue('D');
            this.parent.pgPM3.UpdateBusinessDefaultTimes();
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerIndicationNumber', 0);
            this.parent.pgPM3.CustomerIndicationNumber_onChange();
            this.pageParams.lPremiseMatchedDone = false;
        });
        if (this.pageParams.ParentMode === 'Contact') {
            this.riExchange.getParentHTMLValue('LostBusinessRequestNumber');
        }
        if (this.pageParams.CurrentContractType === 'P') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseCommenceDate');
            this.parent.dateDisable('PremiseCommenceDate', true, true);
        }
        else {
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseCommenceDate');
            this.parent.dateDisable('PremiseCommenceDate', false, true);
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
            }
            else {
                this.parent.focusField('PremiseName');
            }
        }
        else {
            this.parent.focusField('ContractNumber');
        }
    };
    PremiseMaintenance2.prototype.riExchange_UnloadHTMLDocument = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClosedWithChanges') === 'Y') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowClosingName', 'AmendmentsMade');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowClosingName', 'AmendmentsMade');
        }
        this.riExchange.setParentHTMLValue('WindowClosingName', this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowClosingName'));
        this.riExchange.setParentHTMLValue('ClosedWithChanges', this.riExchange.riInputElement.GetValue(this.uiForm, 'ClosedWithChanges'));
    };
    PremiseMaintenance2.prototype.PostcodeDefaultingEnabled = function () {
        if (this.pageParams.SCEnablePostcodeDefaulting) {
            if (!this.parent.pgPM1.DeterminePostCodeDefaulting(true)) {
                return;
            }
            if (!this.pageParams.SCEnableServiceBranchUpdate) {
                this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceBranchNumber');
            }
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber') || this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName') === '') {
                    if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode') !== '' && this.pageParams.CurrentContractType === 'C') {
                        this.parent.pgPM3.CheckPostcode();
                    }
                }
                if (this.pageParams.CurrentContractType === 'C' && this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremisePostcode')) {
                    this.parent.pgPM3.CheckPostcode();
                }
            }
        }
    };
    PremiseMaintenance2.prototype.riExchange_CBORequest = function () {
        var vbGetContractDetails = false;
        this.parent.ellipsis.SalesAreaSearchComponent.childparams.ServiceBranchNumber = this.parent.getControlValue('ServiceBranchNumber');
        this.logger.log('riExchange_CBORequest 1', this.riMaintenance.CurrentMode);
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.logger.log('riExchange_CBORequest 2', this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber'), this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'));
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber') || this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName') === '') {
                this.logger.log('riExchange_CBORequest 3', this.riMaintenance.CurrentMode);
                if (this.pageParams.ParentMode === 'Contract-Add' || this.pageParams.CurrentContractType === 'J') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'NewContract', true);
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'NewContract', false);
                }
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.CurrentContractType);
                this.logger.log('riExchange_CBORequest 4', this.pageParams.CurrentContractType);
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetContractDefaults';
                this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.CBORequestAdd('ContractNumber');
                this.riMaintenance.CBORequestAdd('ContractTypeCode');
                this.riMaintenance.CBORequestAdd('NewContract');
                this.logger.log('riExchange_CBORequest outside');
                this.riMaintenance.CBORequestExecute(this, function (data) {
                    this.logger.log('riExchange_CBORequest 6');
                    this.logger.log('CBO Callback E', data);
                    if (data.hasError)
                        this.parent.showAlert(data.errorMessage);
                    this.riMaintenance.renderResponseForCtrl(this, data);
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.AccountNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.SearchPostcode = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseName = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine1');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine2 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine2');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine3 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine3');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine4 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine4');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine5 = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine5');
                    this.parent.ellipsis.siteReferenceEllipsis.childparams.PremisePostcode = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode');
                });
                this.logger.log('riExchange_CBORequest 5');
                if (this.riExchange.riInputElement.checked(this.uiForm, 'CreateNewInvoiceGroupInd')) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupNumber', '');
                    this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceGroupNumber');
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', false);
                }
                else {
                    this.riExchange.riInputElement.Enable(this.uiForm, 'InvoiceGroupNumber');
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', true);
                }
                this.pageParams.vbGetContractDetails = true;
            }
            this.logger.log('riExchange_CBORequest 7', this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseCommenceDate'), this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseCommenceDate'), this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseCommenceDate') !== '', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '');
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseCommenceDate') &&
                this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseCommenceDate') !== '' &&
                this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '') {
                this.logger.log('riExchange_CBORequest 8');
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnAnniversaryDate';
                this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.CBORequestAdd('ContractNumber');
                this.riMaintenance.CBORequestAdd('PremiseCommenceDate');
                this.riMaintenance.CBORequestExecute(this, function (data) {
                    this.logger.log('riExchange_CBORequest 9');
                    this.logger.log('CBO Callback F', data);
                    if (data.hasError) {
                        this.parent.showAlert(data.errorMessage, 2);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                    }
                });
            }
            this.logger.log('riExchange_CBORequest 10');
        }
        this.parent.pgPM2.PostcodeDefaultingEnabled();
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ServiceBranchNumber')) {
            this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'ServiceBranchNumber');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseSalesEmployee', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesEmployeeSurname', '');
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'SalesAreaCode') &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesAreaCode') !== '' &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber') !== '') {
            this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'SalesAreaCode');
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=DefaultFromSalesArea';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('ServiceBranchNumber');
            this.riMaintenance.CBORequestAdd('SalesAreaCode');
            this.riMaintenance.CBORequestExecute(this, function (data) {
                this.logger.log('CBO Callback G', data);
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage, 2);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseSalesEmployee', data.PremiseSalesEmployee);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesAreaDesc', data.SalesAreaDesc);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SalesEmployeeSurname', data.SalesEmployeeSurname);
                }
            });
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'TelesalesEmployeeCode') &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'TelesalesEmployeeCode') !== '') {
            this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'TelesalesEmployeeCode');
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetTelesalesEmployee';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('TelesalesEmployeeCode');
            this.riMaintenance.CBORequestExecute(this, function (data) {
                this.logger.log('CBO Callback H', data);
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage, 2);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                }
            });
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseSRADate')) {
            this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'PremiseSRADate');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseSRADate') !== '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseSRAEmployee', true);
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnSRADate';
                this.riMaintenance.CBORequestAdd('PremiseSRADate');
                this.riMaintenance.CBORequestExecute(this, function (data) {
                    this.logger.log('CBO Callback I', data);
                    if (data.hasError) {
                        this.parent.showAlert(data.errorMessage, 2);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                    }
                    else {
                        this.riExchange.riInputElement.SetRequiredStatus('PremiseSRAEmployee', false);
                        this.riExchange.riInputElement.isError('PremiseSRAEmployee');
                    }
                });
            }
            if (this.riExchange.riInputElement.checked(this.uiForm, 'CustomerInfoAvailable')) {
                this.uiDisplay.tdCustomerInfo = true;
            }
            else {
                this.uiDisplay.tdCustomerInfo = false;
            }
            if (this.riExchange.riInputElement.checked(this.uiForm, 'NationalAccountChecked')
                && this.riExchange.riInputElement.checked(this.uiForm, 'NationalAccount')) {
                this.uiDisplay.tdNationalAccount = true;
            }
            else {
                this.uiDisplay.tdNationalAccount = false;
            }
            if ((this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate)
                && this.riExchange.riInputElement.HasChanged(this.uiForm, 'InvoiceGroupNumber') && !this.pageParams.vbGetContractDetails
                && this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber') && this.uiDisplay.trPaymentType) {
                this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'InvoiceGroupNumber');
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetPaymentTypeDetails';
                this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.CBORequestAdd('ContractNumber');
                this.riMaintenance.CBORequestAdd('InvoiceGroupNumber');
                this.riMaintenance.CBORequestExecute(this, function (data) {
                    this.logger.log('CBO Callback J', data);
                    if (data.hasError) {
                        this.parent.showAlert(data.errorMessage, 2);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                    }
                });
            }
        }
    };
    PremiseMaintenance2.prototype.riMaintenance_BeforeSave = function () {
        var verror = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'RoutingSource', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelRoutingsource'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PrintRequired', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelPrintRequired'));
        this.pageParams.GridUniqueID = this.pageParams.GridUniqueID;
        if (this.uiDisplay.grdTimeWindows) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerAvailTemplateID', '');
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallLogID', this.riExchange.riInputElement.GetValue(this.uiForm, 'CurrentCallLogID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedWithChanges', 'Y');
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckLength';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseSpecialInstructions') !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSpecialInstructions');
        }
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBO Callback K', data);
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseSpecialInstructions', true);
                verror = true;
            }
        });
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnSRAEmployee';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseSRAEmployee').trim() !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSRAEmployee');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseSRADate') !== '') {
            this.riMaintenance.CBORequestAdd('PremiseSRADate');
        }
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBO Callback L', data);
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseSRAEmployee', true);
                verror = true;
            }
        });
        if (this.pageParams.SCPostCodeMustExistInPAF && (this.pageParams.SCEnableHopewiserPAF || this.pageParams.SCEnableDatabasePAF)) {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckPostcode';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName') !== '')
                this.riMaintenance.CBORequestAdd('PremiseName');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine1') !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine1');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine2') !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine2');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine3') !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine3');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine4') !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine4');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine5') !== '')
                this.riMaintenance.CBORequestAdd('PremiseAddressLine5');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode') !== '')
                this.riMaintenance.CBORequestAdd('PremisePostcode');
            this.riMaintenance.CBORequestExecute(this, function (data) {
                this.logger.log('CBO Callback M', data);
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                    verror = true;
                }
            });
        }
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckPremiseAddressChange';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');
        this.riMaintenance.CBORequestAdd('PremiseNumber');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName') !== '')
            this.riMaintenance.CBORequestAdd('PremiseName');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine1') !== '')
            this.riMaintenance.CBORequestAdd('PremiseAddressLine1');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine2') !== '')
            this.riMaintenance.CBORequestAdd('PremiseAddressLine2');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine3') !== '')
            this.riMaintenance.CBORequestAdd('PremiseAddressLine3');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine4') !== '')
            this.riMaintenance.CBORequestAdd('PremiseAddressLine4');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine5') !== '')
            this.riMaintenance.CBORequestAdd('PremiseAddressLine5');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode') !== '')
            this.riMaintenance.CBORequestAdd('PremisePostcode');
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBO Callback N', data);
            if (data.hasError) {
                this.parent.showAlert(data.errorMessage);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', data.errorMessage);
                verror = true;
            }
        });
        if (verror) {
            this.riMaintenance.CancelEvent = true;
        }
        this.riExchange.updateCtrlValue(this.uiForm.getRawValue(), this.uiForm.controls);
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = '';
        this.logger.log('GEOCODE----', this.pageParams.vbEnableRouteOptimisation, '---', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelRoutingSource'), '---');
        if (this.pageParams.vbEnableRouteOptimisation && this.riExchange.riInputElement.GetValue(this.uiForm, 'SelRoutingSource') === '') {
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
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA Callback A', data);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AddressError', data['AddressError']);
                if (data['AddressError'] !== 'Error') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'RoutingGeonode', data['Node']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'RoutingScore', data['Score']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GPSCoordinateX', data['GPSX']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GPSCoordinateY', data['GPSY']);
                    if (data['Score'] > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelRoutingSource', 'T');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Routingsource', 'T');
                    }
                    else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'SelRoutingSource', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Routingsource', '');
                    }
                }
                else {
                    this.parent.showAlert(MessageConstant.PageSpecificMessage.unableToGeocode);
                    this.riMaintenance.CancelEvent = true;
                }
            }, 'POST');
        }
        if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')
            && this.parent.getControlValue('PNOLSiteRef') === '') {
            this.parent.showAlert(MessageConstant.PageSpecificMessage.pestNetOnlineBlank);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', '');
        }
        if (this.pageParams.SCEnableAccountAddressMessage) {
            if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeSaveUpdate) {
                this.parent.showAlert(MessageConstant.PageSpecificMessage.changesToPremiseAddress, 2);
            }
        }
    };
    PremiseMaintenance2.prototype.riMaintenance_BeforeSaveAdd = function () {
        if (this.pageParams.SCEnableRepeatSalesMatching) {
            if (!this.pageParams.lPremiseMatchedDone) {
                this.parent.pgPM3.MatchPremise();
            }
        }
    };
    PremiseMaintenance2.prototype.riMaintenance_AfterSaveAdd_clbk = function () {
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdBtnAmendContact = '';
        }
        if (this.pageParams.ParentMode === 'Contract-Add') {
            this.pageParams.PremiseAdded = true;
        }
        if (this.pageParams.vbEnableLocations && this.pageParams.vbEnablePremiseLocInsert && this.pageParams.CurrentContractType !== 'P') {
            this.parent.promptTitle = MessageConstant.PageSpecificMessage.addPremiseTitle;
            this.parent.promptContent = MessageConstant.PageSpecificMessage.addPremiseContent;
            this.parent.callbackPrompts.push(this.checkResponse);
            this.parent.promptModal.show();
        }
    };
    PremiseMaintenance2.prototype.checkResponse = function () {
        if (this.pageParams.promptAns) {
            this.parent.navigate('Premise-Add', 'grid/application/premiseLocationAllocation');
        }
        else {
            this.parent.pgPM2.OpenServiceCoverScreen();
        }
        this.pageParams.promptAns = null;
    };
    PremiseMaintenance2.prototype.OpenServiceCoverScreen = function () {
        if (this.pageParams.CurrentContractType === 'C' || this.pageParams.CurrentContractType === 'J') {
            this.parent.navigate('Premise-Add', ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
        }
        else {
            this.parent.navigate('Premise-Add', 'grid/application/productSalesSCEntryGrid');
        }
    };
    PremiseMaintenance2.prototype.DefaultFromPostcode = function () {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=DefaultFromPostcode' +
            '&ContractTypeCode=' + this.pageParams.CurrentContractType +
            '&NegBranchNumber=' + this.riExchange.riInputElement.GetValue(this.uiForm, 'NegBranchNumber') +
            '&PremiseAddressLine4=' + encodeURI(this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine4')) +
            '&PremiseAddressLine5=' + encodeURI(this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine5'));
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');
        this.riMaintenance.CBORequestAdd('PremisePostcode');
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBO Callback 0', data);
            if (data.hasError)
                this.parent.showAlert(data.errorMessage);
            else {
                this.riMaintenance.renderResponseForCtrl(this, data);
                this.parent.ellipsis.SalesAreaSearchComponent.childparams.ServiceBranchNumber = this.parent.getControlValue('ServiceBranchNumber');
            }
        });
    };
    PremiseMaintenance2.prototype.AddTabs = function () {
        this.logger.log('ADD TABS', this.pageParams);
        this.riTab.TabSet();
        this.riTab.TabClear();
        this.riTab.TabAdd('Address');
        this.riTab.TabAdd('General');
        if (this.pageParams.SCEnablePestNetOnlineProcessing) {
            this.riTab.TabAdd('PestNetOnline');
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
        }
        else {
            this.uiDisplay.grdGuarantee = false;
        }
        if (this.pageParams.boolCIEnabled) {
            this.riTab.TabAdd('Customer Integration');
        }
        else {
            this.uiDisplay.grCustomerInt = false;
        }
        this.riTab.TabDraw();
    };
    PremiseMaintenance2.prototype.ShowInvoiceNarrativeTab = function () {
        var blnShowTab = false;
        if (!this.pageParams.blnShowInvoiceNarrativeTab) {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
            this.riMaintenance.PostDataAdd('Function', 'ShowInvoiceTab', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('InvoiceGroupNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'), MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('ShowInvoiceNarrativeTab', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                if (!data.hasError) {
                    if (data['ShowInvoiceNarrativeTab'].trim() === 'true') {
                        blnShowTab = true;
                    }
                    if (this.pageParams.blnShowInvoiceNarrativeTab === '' && this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                        this.pageParams.blnShowInvoiceNarrativeTab = blnShowTab;
                    }
                    if (this.pageParams.blnShowInvoiceNarrativeTab)
                        blnShowTab = this.pageParams.blnShowInvoiceNarrativeTab;
                    if (blnShowTab) {
                        this.riTab.TabAdd('Invoice Narrative');
                        this.riTab.TabDraw();
                    }
                }
                this.riTab.TabDraw();
            }, 'POST');
        }
        else {
            blnShowTab = this.pageParams.blnShowInvoiceNarrativeTab;
            if (blnShowTab) {
                this.riTab.TabAdd('Invoice Narrative');
                this.riTab.TabDraw();
            }
        }
        this.riTab.TabAdd('Servicing');
        this.riTab.TabDraw();
    };
    PremiseMaintenance2.prototype.BuildMenuOptions = function () {
        var _this = this;
        this.logger.log('BuildMenuOptions PM', this.riExchange.riInputElement.GetValue(this.uiForm, 'RunningReadOnly'), this.uiDisplay.grdPremiseMaintenanceControl, this.pageParams);
        var cEmployeeLimitChildDrillOptions = this.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions');
        var objPortfolioGroup = [];
        var objHistoryGroup = [];
        var objInvoicingGroup = [];
        var objServiceGroup = [];
        var objCustomerGroup = [];
        if (this.riExchange.riInputElement.checked(this.uiForm, 'RunningReadOnly')) {
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
        objHistoryGroup.push({ value: 'History', label: 'Premises History' });
        objHistoryGroup.push({ value: 'EventHistory', label: 'Event History' });
        if (this.pageParams.SCEnablePestNetOnlineProcessing) {
            objHistoryGroup.push({ value: 'PNOLLevel', label: 'PestNetOnline Level History' });
        }
        objInvoicingGroup.push({ value: 'ProRataCharge', label: 'Pro Rata Charge' });
        objInvoicingGroup.push({ value: 'InvoiceNarrative', label: 'Invoice Narrative' });
        objInvoicingGroup.push({ value: 'InvoiceCharge', label: 'Invoice Charge' });
        objInvoicingGroup.push({ value: 'InvoiceHistory', label: 'Invoice History' });
        objServiceGroup.push({ value: 'StaticVisits', label: 'Static Visits (SOS)' });
        objServiceGroup.push({ value: 'VisitSummary', label: 'Visit Summary' });
        objServiceGroup.push({ value: 'Service Recommendations', label: 'Service Recommendations' });
        objServiceGroup.push({ value: 'StateOfService', label: 'State of Service' });
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
        if (this.riExchange.riInputElement.checked(this.uiForm, 'RunningReadOnly') && this.uiDisplay.grdPremiseMaintenanceControl) {
        }
        var menuOptions = [
            { OptionGrp: 'Portfolio', Options: objPortfolioGroup },
            { OptionGrp: 'History', Options: objHistoryGroup },
            { OptionGrp: 'Invoicing', Options: objInvoicingGroup },
            { OptionGrp: 'Servicing', Options: objServiceGroup },
            { OptionGrp: 'Customer Relations', Options: objCustomerGroup }
        ];
        this.parent.dropDown.menu = menuOptions;
        setTimeout(function () { _this.parent.setControlValue('menu', 'Options'); }, 500);
    };
    PremiseMaintenance2.prototype.BuildMenuAddOption = function (rstrValue, rstrText) {
    };
    PremiseMaintenance2.prototype.menu_onchange = function (menu) {
        this.logger.log('menu_onchange-9', menu);
        var ctrl = this.uiForm.controls;
        if (this.riMaintenance.RecordSelected()) {
            var blnAccess = void 0;
            if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full' ||
                this.riExchange.ClientSideValues.Fetch('BranchNumber') === ctrl.ServiceBranchNumber.value ||
                this.riExchange.ClientSideValues.Fetch('BranchNumber') === ctrl.NegBranchNumber.value) {
                blnAccess = true;
            }
            else {
                blnAccess = false;
            }
            switch (menu) {
                case 'ContactManagement':
                    this.cmdContactManagement_onclick();
                    break;
                case 'ContactManagementSearch':
                    this.parent.navigate('Premise', 'ccm/callcentersearch', {
                        'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                    });
                    break;
                case 'contacts':
                    if (this.riMaintenance.RecordSelected()) {
                        this.parent.pgPM3.cmdContactDetails();
                    }
                    break;
                case 'PNOLLevel':
                    this.cmdPNOLLevel_onclick();
                    break;
                case 'ServiceCover':
                    this.cmdServiceSummary_onclick();
                    break;
                case 'CopyToProductSales':
                    this.parent.pgPM3.cmdProductSales_onclick('save');
                    break;
                case 'ServiceCoverUpdateable':
                    this.cmdServiceCoverUpdateable_onclick();
                    break;
                case 'History':
                    if (blnAccess)
                        this.cmdHistory_onclick();
                    break;
                case 'Allocate':
                    if (blnAccess)
                        this.cmdAllocate_onclick();
                    break;
                case 'InvoiceNarrative':
                    if (blnAccess)
                        this.cmdInvoiceNarrative_onclick();
                    break;
                case 'ProRataCharge':
                    if (blnAccess)
                        this.cmdProRata_onclick();
                    break;
                case 'InvoiceCharge':
                    if (blnAccess)
                        this.cmdInvoiceCharge_onclick();
                    break;
                case 'InvoiceHistory':
                    if (blnAccess)
                        this.cmdInvoiceHistory_onclick();
                    break;
                case 'ServiceCoverAccessTimes':
                    this.cmdAccessTimes_onclick();
                    break;
                case 'ThirdPartyInstall':
                    if (blnAccess)
                        this.cmdThirdPartyInstall_onclick();
                    break;
                case 'StaticVisits':
                    if (blnAccess)
                        this.cmdStaticVisits_onclick();
                    break;
                case 'VisitSummary':
                    if (blnAccess)
                        this.cmdVisitSummary_onclick();
                    break;
                case 'Service Recommendations':
                    this.cmdServiceRecommendations_onclick();
                    break;
                case 'StateOfService':
                    if (blnAccess)
                        this.cmdStateOfService_onclick();
                    break;
                case 'EventHistory':
                    this.cmdEventHistory_onclick();
                    break;
                case 'Contract':
                    this.cmdContract_onclick();
                    break;
                case 'CustomerInformation':
                    this.cmdCustomerInformation_onclick();
                    break;
                case 'Barcode':
                    this.cmdBarcode_onclick();
                    break;
                case 'WasteConsignmentNoteHistory':
                    this.cmdWasteConsignmentNoteHistory_onclick();
                    break;
                case 'VisitTolerances':
                    this.cmdVisitTolerances_onclick();
                    break;
                case 'InfestationTolerances':
                    this.cmdInfestationTolerances_onclick();
                    break;
                case 'TeleSalesOrder':
                    this.cmdTeleSalesOrder_onclick();
                    break;
                case 'CustomerCCO':
                    this.cmdCustomerCCO_onclick();
                    break;
                default:
            }
        }
    };
    PremiseMaintenance2.prototype.PremiseName_onchange = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.pageParams.SCRunPAFSearchOnFirstAddressLine) {
                this.cmdGetAddress_onclick();
            }
        }
    };
    PremiseMaintenance2.prototype.GPSCoordinateX_onchange = function () {
        this.SetRoutingSource();
    };
    PremiseMaintenance2.prototype.GPSCoordinateY_onchange = function () {
        this.SetRoutingSource();
    };
    PremiseMaintenance2.prototype.RoutingScore_onchange = function () {
        this.SetRoutingSource();
    };
    PremiseMaintenance2.prototype.SetRoutingSource = function () {
        var decGPSX = 0;
        var decGPSY = 0;
        var intRoutingScore = 0;
        if (!isNaN(parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'GPSCoordinateX'), 2))) {
            decGPSX = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'GPSCoordinateX'), 2);
        }
        else {
            decGPSX = 0;
        }
        if (!isNaN(parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'GPSCoordinateY'), 2))) {
            decGPSY = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'GPSCoordinateY'), 2);
        }
        else {
            decGPSY = 0;
        }
        if (!isNaN(parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'RoutingScore'), 2))) {
            intRoutingScore = parseInt(this.riExchange.riInputElement.GetValue(this.uiForm, 'RoutingScore'), 2);
        }
        else {
            intRoutingScore = 0;
        }
        if (intRoutingScore === 0 || decGPSY === 0 || decGPSX === 0) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelRoutingSource', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Routingsource', '');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelRoutingSource', 'M');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Routingsource', 'M');
        }
    };
    PremiseMaintenance2.prototype.PremisePostcode_ondeactivate = function () {
        if (this.pageParams.SCPostCodeRequired && this.parent.getControlValue('PremisePostcode').trim() === '') {
            this.cmdGetAddress_onclick();
        }
        switch (this.riMaintenance.CurrentMode) {
            case MntConst.eModeAdd:
                this.DefaultFromPostcode();
                break;
        }
    };
    PremiseMaintenance2.prototype.PremiseCommenceDate_ondeactivate = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ErrorMessageDesc') === '') {
                this.riTab.TabFocus(1);
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ErrorMessageDesc', '');
            }
            this.parent.pgPM2.riExchange_CBORequest();
        }
    };
    PremiseMaintenance2.prototype.PremiseName_ondeactivate = function () {
        if (!this.pageParams.blnIgnore) {
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode') === '') {
                this.cmdGetAddress_onclick();
            }
        }
    };
    PremiseMaintenance2.prototype.ContractNumber_ondeactivate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdCopyPremise');
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdCopyPremise');
        }
    };
    PremiseMaintenance2.prototype.cmdCustomerInformation_onclick = function () {
        this.parent.navigate('ServiceCover', 'grid/maintenance/contract/customerinformation', {
            parentMode: 'ServiceCover',
            contractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            contractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
            accountNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')
        });
    };
    PremiseMaintenance2.prototype.tdCustomerInfo_onclick = function () {
        this.cmdCustomerInformation_onclick();
    };
    PremiseMaintenance2.prototype.cmdContactManagement_onclick = function () {
        if (this.pageParams.lREGContactCentreReview) {
            this.parent.navigate('Premise', 'ccm/centreReview');
        }
        else {
            this.parent.navigate('Premise', 'ccm/contact/search');
        }
    };
    PremiseMaintenance2.prototype.cmdPNOLLevel_onclick = function () {
        this.parent.navigate('Premise', 'grid/application/PNOLLevelHistory');
    };
    PremiseMaintenance2.prototype.cmdHistory_onclick = function () {
        this.parent.navigate('Premise', 'grid/application/contract/history', {
            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
            PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType,
            PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
            PremiseRowID: this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise'),
            parentMode: 'Premise'
        });
    };
    PremiseMaintenance2.prototype.cmdServiceSummary_onclick = function () {
        if (this.pageParams.CurrentContractType === 'P') {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'TelesalesInd')) {
                this.parent.navigate('Premise', 'grid/application/premiseServiceSummary');
            }
            else {
                this.parent.navigate('Premise', 'grid/contractmanagement/maintenance/productSalesSCEntryGrid');
            }
        }
        else {
            this.parent.navigate('Premise', 'grid/application/premiseServiceSummary');
        }
    };
    PremiseMaintenance2.prototype.cmdServiceCoverUpdateable_onclick = function () {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
    };
    PremiseMaintenance2.prototype.cmdAllocate_onclick = function () {
        this.parent.navigate('Premise-Allocate', '/grid/application/premiseLocationAllocation', {
            'ServiceCoverRowID': this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise'),
            'ContractTypeCode': this.pageParams.CurrentContractType,
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
        });
    };
    PremiseMaintenance2.prototype.cmdServiceCover_onclick = function () {
        if (this.pageParams.CurrentContractType === 'P') {
            this.parent.navigate('Premise', 'grid/application/productSalesSCEntryGrid');
        }
        else {
            this.parent.navigate('Premise', 'Application/iCABSAServiceCoverSearch');
        }
    };
    PremiseMaintenance2.prototype.cmdInvoiceNarrative_onclick = function () {
        this.parent.navigate('Premise', 'contractmanagement/maintenance/contract/invoicenarrative');
    };
    PremiseMaintenance2.prototype.cmdInvoiceCharge_onclick = function () {
        this.parent.navigate('Premise', 'contractmanagement/account/invoiceCharge');
    };
    PremiseMaintenance2.prototype.cmdThirdPartyInstall_onclick = function () {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
    };
    PremiseMaintenance2.prototype.cmdGetAddress_onclick = function () {
        var _this = this;
        this.logger.log('cmdGetAddress_onclick', this.pageParams.vSCEnableHopewiserPAF, this.pageParams.vSCEnableMarktSelect, this.pageParams.vSCEnableDatabasePAF, this.riMaintenance.CurrentMode);
        if (this.pageParams.vSCEnableHopewiserPAF) {
            this.parent.ellipsis.MPAFSearch.childparams.PostCode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.MPAFSearch.childparams.State = this.parent.getControlValue('PremiseAddressLine5');
            this.parent.ellipsis.MPAFSearch.childparams.Town = this.parent.getControlValue('PremiseAddressLine4');
            this.parent.ellipsis.MPAFSearch.childparams.BranchNumber = this.parent.utils.getBranchCode();
            setTimeout(function () { _this.parent.MPAFSearch.openModal(); }, 200);
        }
        else if (this.pageParams.vSCEnableMarktSelect) {
            this.parent.ellipsis.MarktSelectSearch.childparams.PremisePostcode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine1 = this.parent.getControlValue('PremiseAddressLine1');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine2 = this.parent.getControlValue('PremiseAddressLine2');
            this.parent.ellipsis.MarktSelectSearch.childparams.PremiseAddressLine4 = this.parent.getControlValue('PremiseAddressLine4');
            this.parent.ellipsis.MarktSelectSearch.childparams.BranchNumber = this.parent.utils.getBranchCode();
            setTimeout(function () { _this.parent.MarktSelectSearch.openModal(); }, 200);
        }
        else if (this.pageParams.vSCEnableDatabasePAF) {
            this.parent.ellipsis.PostCodeSearch.childparams.PremisePostCode = this.parent.getControlValue('PremisePostcode');
            this.parent.ellipsis.PostCodeSearch.childparams.PremiseAddressLine5 = this.parent.getControlValue('PremiseAddressLine5');
            this.parent.ellipsis.PostCodeSearch.childparams.PremiseAddressLine4 = this.parent.getControlValue('PremiseAddressLine4');
            this.parent.ellipsis.PostCodeSearch.childparams.BranchNumber = this.parent.utils.getBranchCode();
            setTimeout(function () { _this.parent.PostCodeSearch.openModal(); }, 200);
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd)
            this.DefaultFromPostcode();
    };
    PremiseMaintenance2.prototype.cmdVtxGeoCode_onclick = function () {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
    };
    PremiseMaintenance2.prototype.cmdValue_onclick = function () {
        this.parent.navigate('Premise', 'contractmanagement/account/serviceValue');
    };
    PremiseMaintenance2.prototype.cmdProRata_onclick = function () {
        this.parent.navigate('Premise', 'grid/application/proRatacharge/summary');
    };
    PremiseMaintenance2.prototype.cmdInvoiceHistory_onclick = function () {
        this.parent.navigate('Premise', '/billtocash/contract/invoice');
    };
    PremiseMaintenance2.prototype.cmdAccessTimes_onclick = function () {
        this.parent.navigate('Premise', 'grid/application/PremiseAccessTimesGrid');
    };
    PremiseMaintenance2.prototype.cmdStateOfService_onclick = function () {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
    };
    PremiseMaintenance2.prototype.cmdStaticVisits_onclick = function () {
        this.parent.navigate('Premise', 'grid/application/service/StaticVisitGridYear', {
            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
            PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
            Premise: this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise'),
            PremiseRowID: this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType
        });
    };
    PremiseMaintenance2.prototype.cmdVisitSummary_onclick = function () {
        this.parent.store.dispatch({
            type: ContractActionTypes.SAVE_DATA,
            payload: {
                'CurrentContractTypeURLParameter': this.pageParams.contractType,
                'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                'ContractName': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                'PremiseName': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                'ProductDesc': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDesc'),
                'PremiseRowID': this.riExchange.riInputElement.GetValue(this.uiForm, 'Premise'),
                'currentContractType': this.pageParams.CurrentContractType
            }
        });
        this.parent.navigate('Premise', 'grid/contractmanagement/maintenance/contract/visitsummary');
    };
    PremiseMaintenance2.prototype.cmdServiceRecommendations_onclick = function () {
        this.parent.navigate('Premise', 'grid/application/service/recommendation');
    };
    PremiseMaintenance2.prototype.cmdEventHistory_onclick = function () {
        this.parent.navigate('Premise', 'grid/contactmanagement/customercontactHistorygrid');
    };
    PremiseMaintenance2.prototype.cmdContract_onclick = function () {
        this.parent.navigate('Premise', ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
            currentContractTypeURLParameter: this.pageParams.CurrentContractType,
            parentMode: 'Premise'
        });
    };
    PremiseMaintenance2.prototype.DrivingChargeInd_onclick = function () {
        this.logger.log('DrivingChargeInd', this.riExchange.riInputElement.checked(this.uiForm, 'DrivingChargeInd'));
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'DrivingChargeInd')) {
                this.uiDisplay.tdDrivingChargeValueLab = true;
                this.uiDisplay.tdDrivingChargeValue = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DrivingChargeValue', true);
            }
            else {
                this.uiDisplay.tdDrivingChargeValueLab = false;
                this.uiDisplay.tdDrivingChargeValue = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DrivingChargeValue', false);
            }
        }
    };
    PremiseMaintenance2.prototype.cmdCopyPremise_onclick = function () {
        var _this = this;
        this.logger.log('COPY clicked');
        this.parent.flagCopyPremise = true;
        this.parent.ellipsis.premiseNumberEllipsis.disabled = false;
        this.parent.ellipsis.premiseNumberEllipsis.childparams.parentMode = 'PremiseCopy';
        this.parent.ellipsis.premiseNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
        this.parent.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = this.parent.getControlValue('ContractNumber');
        this.parent.ellipsis.premiseNumberEllipsis.childparams.ContractName = this.parent.getControlValue('ContractName');
        this.parent.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = this.parent.getControlValue('AccountNumber');
        setTimeout(function () { _this.parent.premiseNumberEllipsis.openModal(); }, 200);
        if (this.pageParams.vbShowPremiseWasteTab) {
            this.WasteConsignmentNoteExemptInd_onClick();
        }
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.parent.pgPM3.GetGblSRAValues();
        }
    };
    PremiseMaintenance2.prototype.cmdResendPremises_onclick = function () {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.PostDataAdd('Function', 'ResendPremises', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BusinessCode', this.parent.businessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'), MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('BatchProcessInformation', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA Callback C', data);
            if (data.hasError)
                this.parent.showAlert(data.errorMessage);
            this.uiDisplay.render.BatchProcessInformation = data['BatchProcessInformation'];
            this.uiDisplay.trBatchProcessInformation = true;
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdResendPremises');
        }, 'POST');
    };
    PremiseMaintenance2.prototype.cmdBarcode_onclick = function () {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
    };
    PremiseMaintenance2.prototype.cmdWasteConsignmentNoteHistory_onclick = function () {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
    };
    PremiseMaintenance2.prototype.cmdVisitTolerances_onclick = function () {
        this.parent.navigate('PremiseVisitTolerance', 'grid/application/visittolerancegrid', {
            'BusinessCode': this.utils.getBusinessCode(),
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
        });
    };
    PremiseMaintenance2.prototype.cmdInfestationTolerances_onclick = function () {
        this.parent.navigate('PremiseInfestationTolerance', 'grid/contractmanagement/account/infestationToleranceGrid', {
            'BusinessCode': this.utils.getBusinessCode(),
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
        });
    };
    PremiseMaintenance2.prototype.cmdTeleSalesOrder_onclick = function () {
        this.parent.navigate('PremiseTeleSalesOrder', 'application/telesalesEntry');
    };
    PremiseMaintenance2.prototype.cmdCustomerCCO_onclick = function () {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
    };
    PremiseMaintenance2.prototype.WasteConsignmentNoteExemptInd_onClick = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'WasteConsignmentNoteExemptInd')) {
                this.riExchange.riInputElement.Disable(this.uiForm, 'WasteConsignmentNoteExpiryDate');
                this.parent.dateDisable('WasteConsignmentNoteExpiryDate', true, true);
                this.riExchange.riInputElement.Disable(this.uiForm, 'WasteRegulatoryPremiseRef');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'WasteRegulatoryPremiseRef', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'WasteConsignmentNoteExpiryDate', false);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'NextWasteConsignmentNoteNumber', '');
            }
            else {
                this.riExchange.riInputElement.Enable(this.uiForm, 'WasteConsignmentNoteExpiryDate');
                this.parent.dateDisable('WasteConsignmentNoteExpiryDate', false, false);
                this.riExchange.riInputElement.Enable(this.uiForm, 'WasteRegulatoryPremiseRef');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'WasteRegulatoryPremiseRef', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'WasteConsignmentNoteExpiryDate', true);
                if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'NextWasteConsignmentNoteNumber', this.pageParams.vbNextWCNoteNumberDefault);
                }
            }
        }
    };
    PremiseMaintenance2.prototype.PNOLiCABSLevel_onkeydown = function () {
        this.PNOLiCABSLevel_onChange();
    };
    PremiseMaintenance2.prototype.PNOLiCABSLevel_onChange = function () {
        this.CheckCanUpdatePNOLDetails();
    };
    PremiseMaintenance2.prototype.PNOLEffectiveDate_onChange = function () {
        this.parent.pgPM2.CheckCanUpdatePNOLDetails();
    };
    PremiseMaintenance2.prototype.CheckCanUpdatePNOLDetails = function () {
        if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL') &&
            (this.parent.getControlValue('PNOLiCABSLevel') !== this.parent.getControlValue('origPNOLiCABSLevel')) ||
            (this.parent.getControlValue('PNOLEffectiveDate') !== this.parent.getControlValue('origPNOLEffectiveDate')) &&
                this.pageParams.CurrentContractType === 'C') {
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.uiDisplay.trAddToPNOLUpliftAmount = false;
                this.riMaintenance.DisableInput('PNOLUpliftAmount');
            }
            else {
                this.uiDisplay.trAddToPNOLUpliftAmount = true;
                this.riMaintenance.EnableInput('PNOLUpliftAmount');
            }
            this.uiDisplay.trAddToPNOLSetupChargeToApply = true;
            this.riMaintenance.EnableInput('PNOLSetupChargeToApply');
        }
        else {
            this.uiDisplay.trAddToPNOLUpliftAmount = false;
            this.uiDisplay.trAddToPNOLSetupChargeToApply = false;
        }
    };
    PremiseMaintenance2.prototype.ServiceBranchNumber_onkeydown = function () {
    };
    PremiseMaintenance2.prototype.CustomerTypeCode_onkeydown = function () {
    };
    PremiseMaintenance2.prototype.CustomerTypeCode_onchange = function () {
        if (this.parent.getControlValue('CustomerTypeCode') !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.riMaintenance.PostDataAdd('PostDesc', 'CustomerType2', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('CustomerTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerTypeCode'), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SICCodeEnable', this.pageParams.vSICCodeEnable, MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('CustomerTypeDesc', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('SICCode', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('SICDesc', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA Callback CustomerTypeCode_onchange', data);
                if (data['CustomerTypeDesc'] !== '') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerTypeDesc', data['CustomerTypeDesc']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICCode', data['SICCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICDesc', data['SICDesc']);
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerTypeCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerTypeDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICDesc', '');
                }
            }, 'POST', 0);
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerTypeDesc', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SICCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SICDesc', '');
        }
        this.parent.pgPM3.GetGblSRAValues();
        switch (this.riMaintenance.CurrentMode) {
            case MntConst.eModeAdd:
                this.parent.pgPM3.GetCustomerTypeDefault();
                break;
        }
    };
    PremiseMaintenance2.prototype.RegulatoryAuthorityNumber_onChange = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'RegulatoryAuthorityNumber') !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.riMaintenance.PostDataAdd('PostDesc', 'RegulatoryAuthority', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.parent.businessCode(), MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('RegulatoryAuthorityNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'RegulatoryAuthorityNumber'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('RegulatoryAuthorityName', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA Callback G', data);
                if (data.hasError) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'RegulatoryAuthorityNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'RegulatoryAuthorityName', '');
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'RegulatoryAuthorityName', data['RegulatoryAuthorityName']);
                }
            }, 'POST', 0);
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RegulatoryAuthorityName', '');
        }
    };
    PremiseMaintenance2.prototype.PremiseSRAEmployee_onkeydown = function () {
    };
    PremiseMaintenance2.prototype.DiscountCode_onkeydown = function () {
    };
    PremiseMaintenance2.prototype.InvoiceGroupNumber_onkeydown = function () {
    };
    PremiseMaintenance2.prototype.LinkedToContractNumber_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.parent.ellipsis.contractNumberEllipsis.childparams.parentMode = 'LookUp-LinkedToContract';
            this.parent.ellipsis.contractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
            this.parent.contractNumberEllipsis.openModal();
        }
    };
    PremiseMaintenance2.prototype.LinkedToPremiseNumber_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.parent.ellipsis.contractNumberEllipsis.childparams.parentMode = 'Search-LinkedToPremise';
            this.parent.ellipsis.contractNumberEllipsis.childparams.currentContractType = this.pageParams.CurrentContractType;
            this.parent.premiseNumberEllipsis.openModal();
        }
    };
    PremiseMaintenance2.prototype.CustomerAvailTemplateID_onkeydown = function () {
    };
    PremiseMaintenance2.prototype.CustomerAvailTemplateID_OnChange = function () {
        this.UpdateTemplate();
    };
    PremiseMaintenance2.prototype.PreferredDayOfWeekReasonCode_onkeydown = function () {
    };
    PremiseMaintenance2.prototype.PreferredDayOfWeekReasonCode_onchange = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PreferredDayOfWeekReasonCode') !== '0' &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'PreferredDayOfWeekReasonCode') !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.riMaintenance.PostDataAdd('PostDesc', 'PreferredDayOfWeekReason', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('PreferredDayOfWeekReasonCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'PreferredDayOfWeekReasonCode'), MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('LanguageCode', this.riExchange.LanguageCode(), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('PreferredDayOfWeekReasonDesc', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA Callback F', data);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PreferredDayOfWeekReasonLangDesc', data['PreferredDayOfWeekReasonDesc']);
            }, 'POST', 0);
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PreferredDayOfWeekReasonCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PreferredDayOfWeekReasonLangDesc', '');
        }
    };
    PremiseMaintenance2.prototype.SetQuickWindowSetValue = function (strValue) {
        for (var i = 1; i <= 7; i++) {
            this.parent.setControlValue('selQuickWindowSet' + i, strValue);
        }
    };
    PremiseMaintenance2.prototype.WindowPreferredIndChanged = function () {
        var blnAnyPreferred = false;
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            for (var iLoop = 1; iLoop <= 7; iLoop++) {
                if (this.riExchange.riInputElement.checked(this.uiForm, 'WindowPreferredInd0' + iLoop)) {
                    blnAnyPreferred = true;
                }
            }
            if (blnAnyPreferred) {
                this.riExchange.riInputElement.Enable(this.uiForm, 'PreferredDayOfWeekReasonCode');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PreferredDayOfWeekReasonCode', true);
                this.riExchange.riInputElement.Enable(this.uiForm, 'PreferredDayOfWeekNote');
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PreferredDayOfWeekReasonCode', '');
                this.riExchange.riInputElement.Disable(this.uiForm, 'PreferredDayOfWeekReasonCode');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PreferredDayOfWeekReasonCode', false);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PreferredDayOfWeekReasonLangDesc', '');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PreferredDayOfWeekNote', '');
                this.riExchange.riInputElement.Disable(this.uiForm, 'PreferredDayOfWeekNote');
            }
        }
    };
    PremiseMaintenance2.prototype.WasteRegulatoryPremiseRef_OnChange = function () {
        if (this.parent.getControlValue('WasteRegulatoryPremiseRef') !== '') {
            this.parent.setControlValue('NextWasteConsignmentNoteNumber', this.pageParams.vbNextWCNoteNumberDefault);
        }
        else {
            this.parent.setControlValue('NextWasteConsignmentNoteNumber', '');
        }
    };
    PremiseMaintenance2.prototype.riExchange_QueryUnloadHTMLDocument = function () {
    };
    PremiseMaintenance2.prototype.ContractNumberFormatChange = function (num) {
        var paddedNum = '';
        if (num) {
            paddedNum = this.utils.numberPadding(num, 8);
        }
        return paddedNum;
    };
    PremiseMaintenance2.prototype.LinkedToPremiseNumber_onchange = function () {
        this.LinkedStatusChanged();
    };
    PremiseMaintenance2.prototype.LinkedToContractNumber_onchange = function () {
        var _this = this;
        this.parent.setControlValue('LinkedToContractNumber', this.ContractNumberFormatChange(this.riExchange.riInputElement.GetValue(this.uiForm, 'LinkedToContractNumber')));
        this.LinkedStatusChanged();
        this.riExchange.riInputElement.Disable(this.uiForm, 'LinkedToPremiseNumber');
        this.LookUp.lookUpPromise([{
                'table': 'Contract',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.parent.getControlValue('LinkedToContractNumber') },
                'fields': ['ContractNumber', 'ContractName']
            }]).then(function (data) {
            if (data) {
                if (data[0].length > 0) {
                    var objData = data[0][0];
                    _this.parent.setControlValue('LinkedToContractName', data[0][0].ContractName);
                    _this.parent.ellipsis.linkedPremiseNumberEllipsis.disabled = false;
                    _this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.parentMode = 'Search';
                    _this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.currentContractType = _this.pageParams.CurrentContractType;
                    _this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.ContractNumber = _this.parent.getControlValue('LinkedToContractNumber');
                    _this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.ContractName = _this.parent.getControlValue('LinkedToContractName');
                    _this.parent.ellipsis.linkedPremiseNumberEllipsis.childparams.AccountNumber = data[0][0].AccountNumber;
                    _this.riExchange.riInputElement.Enable(_this.uiForm, 'LinkedToPremiseNumber');
                }
            }
        });
    };
    PremiseMaintenance2.prototype.LinkedStatusChanged = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'LinkedToContractNumber') !== '' ||
            this.riExchange.riInputElement.GetValue(this.uiForm, 'LinkedToPremiseNumber') !== '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LinkedToContractNumber', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LinkedToPremiseNumber', true);
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LinkedToContractNumber', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LinkedToPremiseNumber', false);
        }
    };
    PremiseMaintenance2.prototype.RegulatoryAuthorityNumber_onkeydown = function () {
    };
    PremiseMaintenance2.prototype.PNOLSiteRef_OnKeyDown = function (obj) {
        if (obj.keyCode === 34) {
            this.parent.navigate('LookUp', 'grid/application/PNOLPremiseSearch');
        }
    };
    PremiseMaintenance2.prototype.SalesAreaCodeSearch = function () {
    };
    PremiseMaintenance2.prototype.PremiseAddressLine4_onfocusout = function () {
        if (this.pageParams.SCAddressLine4Required && this.parent.getControlValue('PremiseAddressLine4').trim() === '' && this.pageParams.vbEnableValidatePostcodeSuburb) {
            this.cmdGetAddress_onclick();
        }
    };
    PremiseMaintenance2.prototype.PremiseAddressLine5_onfocusout = function () {
        if (this.pageParams.SCAddressLine5Required && this.parent.getControlValue('PremiseAddressLine5').trim() === '' && this.pageParams.vbEnableValidatePostcodeSuburb) {
            this.cmdGetAddress_onclick();
        }
    };
    PremiseMaintenance2.prototype.PremisePostcode_onfocusout = function () {
    };
    PremiseMaintenance2.prototype.TelesalesEmployeeCode_onkeydown = function (obj) {
    };
    PremiseMaintenance2.prototype.PremisePostcode_onkeydown = function () {
    };
    PremiseMaintenance2.prototype.HideQuickWindowSet = function (ipHide) {
        var iLoop = 0;
        var strDisp = false;
        if (ipHide) {
            strDisp = false;
        }
        else {
            strDisp = true;
            this.SetQuickWindowSetValue('C');
        }
        for (var i = 1; i <= 7; i++) {
            this.uiDisplay['selQuickWindowSet' + i] = strDisp;
        }
    };
    PremiseMaintenance2.prototype.CalDisplayValues = function () {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.PostDataAdd('Function', 'CalcDisplayValues', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BusinessCode', this.parent.businessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'), MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('DisplayQty', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('WEDValue', MntConst.eTypeDecimal1);
        this.riMaintenance.ReturnDataAdd('MaterialsValue', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('MaterialsCost', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('LabourValue', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('LabourCost', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('ReplacementValue', MntConst.eTypeCurrency);
        this.riMaintenance.ReturnDataAdd('ReplacementCost', MntConst.eTypeCurrency);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA Callback E', data);
            if (data.hasError)
                this.parent.showAlert(data.errorMessage);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DisplayQty', data['DisplayQty']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WEDValue', data['WEDValue']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'MaterialsValue', data['MaterialsValue']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'MaterialsCost', data['MaterialsCost']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'LabourValue', data['LabourValue']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'LabourCost', data['LabourCost']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementValue', data['ReplacementValue']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ReplacementCost', data['ReplacementCost']);
        }, 'POST');
    };
    PremiseMaintenance2.prototype.UpdateTemplate = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerAvailTemplateID') !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
            this.riMaintenance.PostDataAdd('Function', 'CustomerAvailTemplate', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.parent.businessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('CustomerAvailTemplateID', this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerAvailTemplateID'), MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('CustomerAvailTemplateDesc', MntConst.eTypeText);
            for (var i = 1; i <= 14; i++) {
                this.riMaintenance.ReturnDataAdd('WindowStart' + this.utils.numberPadding(i, 2), MntConst.eTypeTime);
                this.riMaintenance.ReturnDataAdd('WindowEnd' + this.utils.numberPadding(i, 2), MntConst.eTypeTime);
            }
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA Callback D', data);
                if (data.hasError)
                    this.parent.showAlert(data.errorMessage);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerAvailTemplateDesc', data['CustomerAvailTemplateDesc']);
                for (var i = 1; i <= 14; i++) {
                    this.parent.setControlValue('WindowStart' + this.utils.numberPadding(i, 2), data['WindowStart' + this.utils.numberPadding(i, 2)]);
                    this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(i, 2), data['WindowEnd' + this.utils.numberPadding(i, 2)]);
                }
            }, 'POST');
        }
    };
    return PremiseMaintenance2;
}());
