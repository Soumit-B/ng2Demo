import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var PremiseMaintenance3 = (function () {
    function PremiseMaintenance3(parent) {
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
    PremiseMaintenance3.prototype.killSubscription = function () { };
    PremiseMaintenance3.prototype.window_onload = function () {
        this.pgPM0 = this.parent.pgPM0;
        this.pgPM1 = this.parent.pgPM1;
        this.pgPM1a = this.parent.pgPM1a;
        this.pgPM2 = this.parent.pgPM2;
        this.pgPM3 = this.parent.pgPM3;
        this.pgPM4 = this.parent.pgPM4;
    };
    PremiseMaintenance3.prototype.init = function () {
        this.pageParams.vbAllowAutoOpenSCScreen = true;
    };
    PremiseMaintenance3.prototype.doLookup = function () {
    };
    PremiseMaintenance3.prototype.BuildSRAGrid = function () {
    };
    PremiseMaintenance3.prototype.BuildGblSRARCM = function () {
    };
    PremiseMaintenance3.prototype.BuildGblSRATriggers = function () {
    };
    PremiseMaintenance3.prototype.BuildSRAHazardEditGrid = function () {
    };
    PremiseMaintenance3.prototype.riGrid_BeforeExecute = function () {
    };
    PremiseMaintenance3.prototype.riGrid_BodyOnClick = function () {
    };
    PremiseMaintenance3.prototype.SelectedRowFocus = function (rsrcElement) {
    };
    PremiseMaintenance3.prototype.riGrid_BodyOnDblClick = function () {
    };
    PremiseMaintenance3.prototype.riGridRCM_BeforeExecute = function () {
    };
    PremiseMaintenance3.prototype.riGridRCM_BodyOnClick = function () {
    };
    PremiseMaintenance3.prototype.SelectedRCMRowFocus = function (rsrcElement) {
    };
    PremiseMaintenance3.prototype.riGridRCM_BodyOnDblClick = function () {
    };
    PremiseMaintenance3.prototype.riGridTrigger_BeforeExecute = function () {
    };
    PremiseMaintenance3.prototype.riGridTrigger_BodyOnClick = function () {
    };
    PremiseMaintenance3.prototype.SelectedTriggerRowFocus = function (rsrcElement) {
    };
    PremiseMaintenance3.prototype.riGridTrigger_BodyOnDblClick = function () {
    };
    PremiseMaintenance3.prototype.riGridSRAHazardEdit_BeforeExecute = function () {
    };
    PremiseMaintenance3.prototype.riGridSRAHazardEdit_BodyOnClick = function () {
    };
    PremiseMaintenance3.prototype.riGridSRAHazardEdit_BodyOnDblClick = function () {
    };
    PremiseMaintenance3.prototype.SelectedHazardRowFocus = function (rsrcElement) {
    };
    PremiseMaintenance3.prototype.riTab_TabFocusBefore = function () {
    };
    PremiseMaintenance3.prototype.riTab_TabFocusAfter = function () {
    };
    PremiseMaintenance3.prototype.HazardDesc_onkeydown = function (obj) {
        if (obj.KeyCode === 34 && this.pageParams.vbGblSRAMode === 'Add') {
            this.parent.navigate('PremHazard', 'Business/iCABSBGblSRAHazardSearch.htm');
            this.SetHazardResponse();
        }
    };
    PremiseMaintenance3.prototype.LocationDesc_onkeydown = function (obj) {
        if (obj.KeyCode === 34 && (this.pageParams.vbGblSRAMode === 'Add' || this.pageParams.vbGblSRAMode === 'Edit')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'GridUniqueID', this.pageParams.GridCacheTime);
            this.parent.navigate('PremSRA', 'Application/iCABSALocationGrid.htm');
        }
    };
    PremiseMaintenance3.prototype.BuildPremGblSRACache = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.PostDataAdd('Function', 'BuildPremGblSRACache', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA Callback 3A', data);
        });
    };
    PremiseMaintenance3.prototype.PremGblSRAFetch = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.PostDataAdd('Function', 'FetchGblSRAHazard', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('HazardFreeText', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('LocationDesc', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('AdditionalLocations', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('AdditionalActionComments', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('SafeToProceed', MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('AdditionalCustomerRequirements', MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'HazardFreeText', data['HazardFreeText']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'LocationDesc', data['LocationDesc']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AdditionalLocations', data['AdditionalLocations']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AdditionalActionComments', data['AdditionalActionComments']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SafeToProceed', data['SafeToProceed']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'AdditionalCustomerRequirements', data['AdditionalCustomerRequirements']);
            this.SetHazardResponse();
            this.CheckSafeToProceed();
        });
    };
    PremiseMaintenance3.prototype.SetHazardResponse = function () {
        var ctrl = this.uiForm.controls;
        if (ctrl.HazardSequence.value !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
            this.riMaintenance.PostDataAdd('Function', 'SetHazardResponse', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('HazardResponse', MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('HazardDesc', MntConst.eTypeTextFree);
            this.riMaintenance.Execute(this, function (data) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'HazardResponse', data['HazardResponse']);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'HazardDesc', data['HazardDesc']);
                this.PremGblSRAEnable();
            });
        }
    };
    PremiseMaintenance3.prototype.PremGblSRAEnable = function () {
        var ctrl = this.uiForm.controls;
        this.uiDisplay.tblTriggerGrid = true;
        this.uiDisplay.tblTriggerControl = true;
        if (ctrl.HazardResponse.value === '1') {
            this.uiDisplay.trRCMGrid = true;
            this.uiDisplay.tblRCMControl = true;
        }
        else {
            if (ctrl.HazardResponse.value === '2') {
                this.uiDisplay.trHazardFree = true;
            }
            this.riExchange.riInputElement.Enable(this.uiForm, 'LocationDesc');
            this.riExchange.riInputElement.Enable(this.uiForm, 'AdditionalLocations');
            this.riExchange.riInputElement.Enable(this.uiForm, 'SafeToProceed');
        }
    };
    PremiseMaintenance3.prototype.PremGblSRADisable = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'HazardDesc', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'HazardSequence', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'HazardResponse', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'HazardFreeText', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LocationCode', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LocationDesc', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AdditionalLocations', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AdditionalActionComments', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SafeToProceed', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AdditionalCustomerRequirements', '');
        this.uiDisplay.tblTriggerGrid = false;
        this.uiDisplay.tblTriggerControl = false;
        this.uiDisplay.trRCMGrid = false;
        this.uiDisplay.tblRCMControl = false;
        this.uiDisplay.trHazardFree = false;
        this.riExchange.riInputElement.Disable(this.uiForm, 'AdditionalLocations');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SafeToProceed');
        if (this.pageParams.vbGblSRAMode === '') {
            this.uiDisplay.thGblSRAControl = false;
            this.uiDisplay.cmdQuestionnaireComp = false;
        }
    };
    PremiseMaintenance3.prototype.cmdSRAGenerateText_OnClick = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintSRAGrid.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Function', 'GenerateSRAText', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseSpecialInstructions', ctrl.PremiseSpecialInstructions.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('PremiseSpecialInstructions', MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseSpecialInstructions', data['PremiseSpecialInstructions']);
        });
    };
    PremiseMaintenance3.prototype.PremGblSRASave = function (GblSRASaveMode) {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.PostDataAdd('Function', 'Save', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('AddMode', GblSRASaveMode, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('HazardResponse', ctrl.HazardResponse.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('HazardFreeText', ctrl.HazardFreeText.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('AdditionalLocations', ctrl.AdditionalLocations.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('AdditionalActionComments', ctrl.AdditionalActionComments.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('SafeToProceed', ctrl.SafeToProceed.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('AdditionalCustomerRequirements', ctrl.AdditionalCustomerRequirements.value, MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data) {
            this.pageParams.vbGblSRAMode = '';
            this.PremGblSRADisable();
        });
    };
    PremiseMaintenance3.prototype.DeletePremGblSRAHazardRCM = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Function', 'DeletePremSRAHazRCM', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', ctrl.GridUniqueID.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('RCMNumber', ctrl.RCMNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.Execute(this, function (data) {
            this.pageParams.vbGblSRAMode = '';
            this.PremGblSRADisable();
        });
    };
    PremiseMaintenance3.prototype.CheckSafeToProceed = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseMaintGblSRA.p';
        this.riMaintenance.PostDataAdd('Function', 'CheckSafeToProceed', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GridUniqueID', this.pageParams.GridCacheTime, MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('GblSRATypeCode', ctrl.GblSRATypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('HazardSequence', ctrl.HazardSequence.value, MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('NotSafeToProceed', MntConst.eTypeCheckBox);
        this.riMaintenance.Execute(this, function (data) {
            if (data['NotSafeToProceed']) {
                ctrl.SafeToProceed.value = '0';
                this.riExchange.riInputElement.Disable(this.uiForm, 'SafeToProceed');
            }
            else {
                this.riExchange.riInputElement.Enable(this.uiForm, 'SafeToProceed');
            }
        });
    };
    PremiseMaintenance3.prototype.cmdAddNextHazard_onClick = function () {
        if (this.pageParams.vbGblSRAMode === 'Add') {
            this.PremGblSRASave('Add');
        }
        if (this.pageParams.vbGblSRAMode === 'Edit') {
            this.PremGblSRASave('Edit');
        }
        if (this.pageParams.vbGblSRAMode === '') {
            this.uiDisplay.cmdQuestionnaireComp = true;
            this.pageParams.vbGblSRAMode = 'Add';
            this.viewChild.HazardDesc.focus();
        }
    };
    PremiseMaintenance3.prototype.cmdQuestionnaireComp_onClick = function () {
        if (this.pageParams.vbGblSRAMode === 'Add') {
            this.PremGblSRASave('Add');
        }
        if (this.pageParams.vbGblSRAMode === 'Edit') {
            this.PremGblSRASave('Edit');
        }
        if (this.pageParams.vbGblSRAMode === '') {
            this.uiDisplay.cmdQuestionnaireComp = true;
        }
    };
    PremiseMaintenance3.prototype.cmdGeocode_OnClick = function () {
        this.parent.navigate('Premise', 'Application/iCABSARoutingSearch.htm');
    };
    PremiseMaintenance3.prototype.cmdProductSales_onclick = function (event) {
        var dtProductSaleCommenceDate;
        var ctrl = this.uiForm.controls;
        this.parent.promptModal.show();
        this.parent.promptTitle = 'Are you sure you want to add Product Sales?';
        if (event.value === 'save') {
            this.parent.promptModal.show();
            this.parent.promptTitle = 'Confirm Processing';
            if (event.value === 'save') {
                if (this.pageParams.vbEnableProductSaleCommenceDate) {
                    this.parent.navigate('', 'Application/iCABSAProductSaleCommenceDate.htm');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'dtProductSaleCommenceDate', this.riExchange.getParentAttributeValue('ProductSaleCommenceDate'));
                }
                else {
                    dtProductSaleCommenceDate = Date();
                }
                if (dtProductSaleCommenceDate !== '') {
                    this.riMaintenance.clear();
                    this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
                    this.riMaintenance.PostDataAdd('Function', 'AddProductSales', MntConst.eTypeText);
                    this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
                    this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
                    this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
                    this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeCode);
                    this.riMaintenance.PostDataAdd('ProductSaleCommenceDate', dtProductSaleCommenceDate, MntConst.eTypeDate);
                    this.riMaintenance.ReturnDataAdd('NewPremiseRowID', MntConst.eTypeText);
                    this.riMaintenance.Execute(this, function (data) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'NewPremiseRowID', data['NewPremiseRowID']);
                        this.navigate('AddFromPremise', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                    });
                }
            }
        }
    };
    PremiseMaintenance3.prototype.TechRetentionReasonCode_onkeydown = function (obj) {
        if (obj.keyCode === 34) {
            this.parent.navigate('Premise', 'Business/iCABSBPremiseTechRetentionReasonsLangSearch.htm');
        }
    };
    PremiseMaintenance3.prototype.TechRetentionReasonCode_onchange = function () {
        var ctrl = this.uiForm.controls;
        if (ctrl.TechRetentionReasonCode.value !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.riMaintenance.PostDataAdd('PostDesc', 'SetTechRetentionReasonDesc', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('TechRetentionReasonCode', ctrl.TechRetentionReasonCode.value, MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('TechRetentionReasonDesc', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TechRetentionReasonDesc', data['TechRetentionReasonDesc']);
            });
        }
        else {
            this.parent.setControlValue('TechRetentionReasonCode', '');
        }
    };
    PremiseMaintenance3.prototype.TechRetentionInd_onClick = function () {
        if (this.riExchange.riInputElement.checked(this.uiForm, 'TechRetentionInd')) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TechRetentionReasonCode', true);
        }
        else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TechRetentionReasonCode', false);
            this.parent.setControlValue('TechRetentionReasonCode', '');
            this.parent.setControlValue('TechRetentionReasonDesc', '');
        }
    };
    PremiseMaintenance3.prototype.CustomerIndicationNumber_onChange = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'selCustomerIndicationNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerIndicationNumber'));
    };
    PremiseMaintenance3.prototype.SelCustomerIndicationNumber_onChange = function () {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerIndicationNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'selCustomerIndicationNumber'));
    };
    PremiseMaintenance3.prototype.setPurchaseOrderFields = function () {
        var ctrl = this.uiForm.controls;
        var vbContinuousInd;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.PostDataAdd('Function', 'getContinuousInd', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.parent.businessCode(), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('ContinuousInd', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            vbContinuousInd = data['ContinuousInd'].trim().toUpperCase();
            if (ctrl.PurchaseOrderNo.value === '' || vbContinuousInd === 'NO') {
                this.uiDisplay.tdPurchaseOrderLineNo = false;
                this.uiDisplay.tdPurchaseOrderExpiryDate = false;
            }
            else {
                this.uiDisplay.tdPurchaseOrderLineNo = true;
                this.uiDisplay.tdPurchaseOrderExpiryDate = true;
            }
        }, 'POST');
    };
    PremiseMaintenance3.prototype.PremisePostcode_onchange = function () {
        var ctrl = this.uiForm.controls;
        if (this.pageParams.SCEnablePostcodeDefaulting && this.pageParams.SCEnableDatabasePAF && ctrl.PremisePostcode.value.trim() !== '') {
            this.riMaintenance.BusinessObject = 'iCABSGetPostCodeTownAndState.p';
            this.riMaintenance.clear();
            this.riMaintenance.PostDataAdd('Function', 'GetPostCodeTownAndState', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('Postcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('State', ctrl.PremiseAddressLine5.value, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Town', ctrl.PremiseAddressLine4.value, MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('UniqueRecordFound', MntConst.eTypeCheckBox);
            this.riMaintenance.ReturnDataAdd('Postcode', MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('State', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('Town', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                var _this = this;
                if (!data['UniqueRecordFound']) {
                    setTimeout(function () { _this.parent.PostCodeSearch.openModal(); }, 200);
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremisePostcode', data['Postcode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine5', data['State']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine4', data['Town']);
                }
            });
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd && this.pageParams.SCEnableRepeatSalesMatching && ctrl.PremisePostcode.value.trim() !== '') {
            this.MatchPremise();
            this.GetMatchPremiseNames();
        }
    };
    PremiseMaintenance3.prototype.MatchPremise = function () {
        var lPremiseMatchedDone = false;
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Function', 'CheckMatchedPremise', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('AccountNumber', ctrl.AccountNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseAddressLine4', ctrl.PremiseAddressLine4.value, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremiseAddressLine5', ctrl.PremiseAddressLine5.value, MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('PremisePostcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('MatchedPremise', MntConst.eTypeCheckBox);
        this.riMaintenance.Execute(this, function (data) {
            if (data['MatchedPremise']) {
                this.navigate('', 'Application/iCABSAPremiseMatchingGrid');
            }
        });
        lPremiseMatchedDone = true;
    };
    PremiseMaintenance3.prototype.riMaintenance_AfterAbandon = function () {
        var ctrl = this.uiForm.controls;
        this.riExchange.riInputElement.Disable(this.uiForm, 'cmdSRAGenerateText');
        if (ctrl.ContractNumber.value !== '/wsscripts/riHTMLWrapper.p?rifileName=') {
            if (ctrl.InactiveEffectDate.value !== '') {
                this.uiDisplay.labelInactiveEffectDate = true;
                this.uiDisplay.InactiveEffectDate = true;
                if (ctrl.LostBusinessDesc.value !== '') {
                    this.uiDisplay.LostBusinessDesc = true;
                }
                else {
                    this.uiDisplay.LostBusinessDesc = false;
                }
            }
            else {
                this.uiDisplay.labelInactiveEffectDate = false;
                this.uiDisplay.InactiveEffectDate = false;
                this.uiDisplay.LostBusinessDesc = false;
            }
            if (ctrl.ShowValueButton.checked) {
                this.uiDisplay.cmdValue = true;
            }
            else {
                this.uiDisplay.cmdValue = false;
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'SCEnableDrivingCharges') && this.riExchange.riInputElement.GetValue(this.uiForm, 'DrivingChargeInd') && this.pageParams.CurrentContractType !== 'P') {
                this.uiDisplay.tdDrivingChargeValueLab = true;
                this.uiDisplay.tdDrivingChargeValue = true;
            }
            else {
                this.uiDisplay.tdDrivingChargeValueLab = false;
                this.uiDisplay.tdDrivingChargeValue = false;
            }
            this.riMaintenance_AfterSaveUpdate();
        }
        this.riExchange.riInputElement.Disable(this.uiForm, 'cmdResendPremises');
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.pageParams.vbGblSRAMode = '';
            this.PremGblSRADisable();
        }
    };
    PremiseMaintenance3.prototype.riExchange_UpdateHTMLDocument = function () {
        var ctrl = this.uiForm.controls;
        if (ctrl.WindowClosingName.value === 'InvoiceNarrativeAmendmentsMade') {
            this.riExchange.getParentAttributeValue('InvoiceNarrativeText');
        }
        if (ctrl.forceRefresh.checked !== true && ctrl.WindowClosingName.value === 'AmendmentsMade') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSContactPersonEntryGrids.p';
            this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('Function', 'GetContactPersonChanges', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('PremiseNumber', ctrl.PremiseNumber.value, MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('ContactPersonFound', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonName', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonPosition', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonDepartment', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonTelephone', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonMobile', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonFax', MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('ContactPersonEmail', MntConst.eTypeTextFree);
            this.riMaintenance.Execute(this, function (data) {
                if (data['ContactPersonFound'] === 'Y') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactName', data['ContactPersonName']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactPosition', data['ContactPersonPosition']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactDepartment', data['ContactPersonDepartment']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactTelephone', data['ContactPersonTelephone']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactMobile', data['ContactPersonMobile']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactEmail', data['ContactPersonEmail']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactFax', data['ContactPersonFax']);
                }
            });
        }
        if (ctrl.forceRefresh.checked) {
            this.riMaintenance.FetchRecord();
            ctrl.forceRefresh.checked = false;
        }
    };
    PremiseMaintenance3.prototype.riMaintenance_AfterSaveUpdate = function () {
        if (this.pageParams.vSCMultiContactInd) {
            this.uiDisplay.tdBtnAmendContact = true;
        }
        if (this.pageParams.ParentMode === 'AddFromPremise' && this.pageParams.vbAllowAutoOpenSCScreen) {
            this.parent.navigate('Premise-Add', 'grid/application/productSalesSCEntryGrid');
            this.pageParams.vbAllowAutoOpenSCScreen = false;
        }
    };
    PremiseMaintenance3.prototype.SensitiseContactDetails = function (lSensitise) {
        if (lSensitise) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactName');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactPosition');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactDepartment');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactMobile');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactTelephone');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactFax');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PremiseContactEmail');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactName', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactPosition', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactTelephone', true);
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactPosition');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactDepartment');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactMobile');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactTelephone');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactFax');
            this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseContactEmail');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactName', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactPosition', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactTelephone', false);
        }
    };
    PremiseMaintenance3.prototype.BtnAmendContact_OnClick = function () {
        this.parent.pgPM3.cmdContactDetails();
    };
    PremiseMaintenance3.prototype.cmdContactDetails = function () {
        this.parent.navigate('Premise', 'application/ContactPersonMaintenance', {
            parentMode: 'Premise',
            contractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            premiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
        });
    };
    PremiseMaintenance3.prototype.selQuickWindowSet_onchange = function (event) {
        var target = event.target || event.srcElement || event.currentTarget;
        var srcID = target.attributes.id.nodeValue;
        var srcValue = target.value;
        var srcRow = parseInt(srcID.split('').pop(), 10);
        if (srcValue === 'C') {
            this.riMaintenance.EnableInput('WindowStart' + this.utils.numberPadding(srcRow, 2));
            this.riMaintenance.EnableInput('WindowEnd' + this.utils.numberPadding(srcRow, 2));
            this.riMaintenance.EnableInput('WindowStart' + this.utils.numberPadding(srcRow + 7, 2));
            this.riMaintenance.EnableInput('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2));
        }
        else {
            this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(srcRow, 2));
            this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(srcRow, 2));
            this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(srcRow + 7, 2));
            this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2));
        }
        switch (srcValue) {
            case 'D':
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow, 2), this.parent.getControlValue('DefaultWindowStart' + this.utils.numberPadding(srcRow + srcRow - 1, 2)));
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow, 2), this.parent.getControlValue('DefaultWindowEnd' + this.utils.numberPadding(srcRow + srcRow - 1, 2)));
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow + 7, 2), this.parent.getControlValue('DefaultWindowStart' + this.utils.numberPadding(srcRow + srcRow, 2)));
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2), this.parent.getControlValue('DefaultWindowEnd' + this.utils.numberPadding(srcRow + srcRow, 2)));
                break;
            case 'U':
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow, 2), '00:00');
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow, 2), '00:00');
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow + 7, 2), '00:00');
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2), '00:00');
                break;
            case 'A':
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow, 2), '00:00');
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow, 2), '11:59');
                this.parent.setControlValue('WindowStart' + this.utils.numberPadding(srcRow + 7, 2), '12:00');
                this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(srcRow + 7, 2), '23:59');
                break;
        }
    };
    PremiseMaintenance3.prototype.UpdateBusinessDefaultTimes = function () {
        for (var i = 1; i <= 7; i++) {
            this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(i, 2));
            this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(i, 2));
            this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(i + 7, 2));
            this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(i + 7, 2));
            this.parent.setControlValue('WindowStart' + this.utils.numberPadding(i, 2), this.parent.getControlValue('DefaultWindowStart' + this.utils.numberPadding(i + i - 1, 2)));
            this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(i, 2), this.parent.getControlValue('DefaultWindowEnd' + this.utils.numberPadding(i + i - 1, 2)));
            this.parent.setControlValue('WindowStart' + this.utils.numberPadding(i + 7, 2), this.parent.getControlValue('DefaultWindowStart' + this.utils.numberPadding(i + i, 2)));
            this.parent.setControlValue('WindowEnd' + this.utils.numberPadding(i + 7, 2), this.parent.getControlValue('DefaultWindowEnd' + this.utils.numberPadding(i + i, 2)));
        }
    };
    PremiseMaintenance3.prototype.TermiteServiceCheck = function () {
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Function', 'TermiteServiceCheck', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('TermiteWarningDesc', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA callback TermiteServiceCheck', data);
            if (data['TermiteWarningDesc'] !== '') {
                this.parent.showAlert(data['TermiteWarningDesc'], 2);
            }
        }, 'POST');
    };
    PremiseMaintenance3.prototype.DefaultFromProspect = function () {
        if (this.riExchange.getParentHTMLValue('ProspectNumber') !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
            this.riMaintenance.PostDataAdd('Function', 'DefaultFromProspect', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'), MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('SICCodeEnable', this.pageParams.vSICCodeEnable, MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('CustomerTypeCode', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('CustomerTypeDesc', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('SICCode', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('SICDesc', MntConst.eTypeText);
            if (this.pageParams.SCCapitalFirstLtr) {
                this.riMaintenance.ReturnDataAdd('PremiseName', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine1', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine2', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine3', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine4', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine5', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseContactName', MntConst.eTypeTextFree);
                this.riMaintenance.ReturnDataAdd('PremiseContactPosition', MntConst.eTypeTextFree);
            }
            else {
                this.riMaintenance.ReturnDataAdd('PremiseName', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine1', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine2', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine3', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine4', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseAddressLine5', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseContactName', MntConst.eTypeText);
                this.riMaintenance.ReturnDataAdd('PremiseContactPosition', MntConst.eTypeText);
            }
            this.riMaintenance.ReturnDataAdd('PremisePostcode', MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('PremiseVtxGeoCode', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseOutsideCityLimits', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseContactTelephone', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseContactMobile', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseContactFax', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('PremiseContactEmail', MntConst.eTypeTextFree);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA callback DefaultFromProspect', data);
                if (!data.hasError) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerTypeDesc', data['CustomerTypeDesc']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICCode', data['SICCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICDesc', data['SICDesc']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data['PremiseName']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine1', data['PremiseAddressLine1']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine2', data['PremiseAddressLine2']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine3', data['PremiseAddressLine3']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine4', data['PremiseAddressLine4']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine5', data['PremiseAddressLine5']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremisePostcode', data['PremisePostcode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseVtxGeoCode', data['PremiseVtxGeoCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactName', data['PremiseContactName']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactPosition', data['PremiseContactPosition']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactTelephone', data['PremiseContactTelephone']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactMobile', data['PremiseContactMobile']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactFax', data['PremiseContactFax']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseContactEmail', data['PremiseContactEmail']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'OutsideCityLimits', data['PremiseOutsideCityLimits'] === 'Y');
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerTypeCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerTypeDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICDesc', '');
                }
            }, 'POST');
        }
    };
    PremiseMaintenance3.prototype.GetGblSRAValues = function () {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
        this.riMaintenance.PostDataAdd('PostDesc', 'SetGblSRAType', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('CustomerTypeCode', this.parent.getControlValue('CustomerTypeCode'), MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('GblSRATypeCode', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('GblSRADesc', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA Callback GetGblSRAValues', data);
            if (data['GblSRATypeCode'] !== '') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GblSRATypeCode', data['GblSRATypeCode']);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GblSRADesc', data['GblSRADesc']);
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GblSRATypeCode', '');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GblSRADesc', '');
            }
        }, 'GET', 0);
    };
    PremiseMaintenance3.prototype.riMaintenance_BeforeUpdateMode = function () {
        if (this.pageParams.vSCMultiContactInd) {
            this.parent.pgPM3.SensitiseContactDetails(false);
        }
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelServiceNotifyTemplateEmail');
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelServiceNotifyTemplateSMS');
        this.riMaintenance.DisableInput('ServiceBranchNumber');
        this.riMaintenance.DisableInput('PremiseCommenceDate');
        this.pageParams.dtPremiseCommenceDate.disabled = true;
        this.riTab.TabFocus(1);
        var el = document.querySelectorAll('#PremiseNumber');
        this.logger.log('PremiseNumber obj >>>>', el);
        if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
            this.riMaintenance.EnableInput('cmdResendPremises');
        }
        if (!this.riExchange.riInputElement.checked(this.uiForm, 'NationalAccountBranch')) {
            if (this.utils.getBranchCode() !== this.parent.getControlValue('ServiceBranchNumber')) {
                this.riMaintenance.DisableInput('SalesAreaCode');
            }
        }
        var PNOLMode = 'Update';
        this.parent.pgPM1.SetOkToUpgradeToPNOL();
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetBusinessDefaultWindows';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestExecute(this, function (data) {
            this.logger.log('CBO Callback 3A', data);
            if (!data.hasError) {
                this.parent.riMaintenance.renderResponseForCtrl(this, data);
            }
        });
        this.parent.pgPM2.HideQuickWindowSet(true);
        this.parent.pgPM2.WindowPreferredIndChanged();
        if (!this.pageParams.vSICCodeRequire) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'SICCode');
        }
        if (this.pageParams.vbShowPremiseWasteTab) {
            this.parent.pgPM2.WasteConsignmentNoteExemptInd_onClick();
        }
        this.riMaintenance.DisableInput('NextWasteConsignmentNoteNumber');
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.PostDataAdd('Function', 'GetWindowsType', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('ContractNumber', this.parent.getControlValue('ContractNumber'), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('PremiseNumber', this.parent.getControlValue('PremiseNumber'), MntConst.eTypeCode);
        for (var i = 1; i <= 7; i++) {
            this.riMaintenance.ReturnDataAdd('WindowType' + i, MntConst.eTypeText);
        }
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA Callback 3B', data);
            for (var i = 1; i <= 7; i++) {
                this.parent.setControlValue('selQuickWindowSet' + i, data['WindowType' + this.utils.numberPadding(i, 2)]);
            }
            for (var i = 1; i <= 7; i++) {
                if (this.parent.getControlValue('selQuickWindowSet' + i) === 'C') {
                    this.riMaintenance.EnableInput('WindowStart' + this.utils.numberPadding(i, 2));
                    this.riMaintenance.EnableInput('WindowEnd' + this.utils.numberPadding(i, 2));
                    this.riMaintenance.EnableInput('WindowStart' + this.utils.numberPadding(i + 7, 2));
                    this.riMaintenance.EnableInput('WindowEnd' + this.utils.numberPadding(i + 7, 2));
                }
                else {
                    this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(i, 2));
                    this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(i, 2));
                    this.riMaintenance.DisableInput('WindowStart' + this.utils.numberPadding(i + 7, 2));
                    this.riMaintenance.DisableInput('WindowEnd' + this.utils.numberPadding(i + 7, 2));
                }
            }
        }, 'POST');
    };
    PremiseMaintenance3.prototype.SICCode_onchange = function () {
        var ctrl = this.uiForm.controls;
        if (ctrl.SICCode.value !== '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
            this.riMaintenance.PostDataAdd('Function', 'GetSICDesc', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SICCode', ctrl.SICCode.value, MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('SICDesc', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA Callback GetSICDesc', data);
                if (data['SICDescription'] !== '') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICDescription', data['SICDescription']);
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SICDesc', '');
                }
            });
        }
        else {
            this.parent.setControlValue('SICDesc', '');
        }
    };
    PremiseMaintenance3.prototype.SICCode_onkeydown = function (obj) {
        if (obj.KeyCode === 34 && this.pageParams.vSICCodeRequire && this.pageParams.vSICCodeEnable) {
            this.parent.navigate('LookUp-Premise', 'System/iCABSSSICSearch.htm');
        }
    };
    PremiseMaintenance3.prototype.PurchaseOrderNo_onChange = function () {
    };
    PremiseMaintenance3.prototype.cmdMatchPremise_onClick = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.MatchPremise();
            this.GetMatchPremiseNames();
        }
    };
    PremiseMaintenance3.prototype.GetMatchPremiseNames = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Function', 'MatchPremiseNames', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('MatchedContractNumber', ctrl.MatchedContractNumber.value, MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('MatchedPremiseNumber', ctrl.MatchedPremiseNumber.value, MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('MatchedContractName', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('MatchedPremiseName', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'MatchedContractName', data['MatchedContractName']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'MatchedPremiseName', data['MatchedPremiseName']);
        });
    };
    PremiseMaintenance3.prototype.cmdViewLinkedPremises_onclick = function () {
        this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
    };
    PremiseMaintenance3.prototype.cmdViewAssociatedPremises_onclick = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd || this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.parent.showAlert(MessageConstant.Message.PageNotCovered, 2);
        }
    };
    PremiseMaintenance3.prototype.riMaintenance_BeforeAdd = function () {
        this.parent.pgPM3.setPurchaseOrderFields();
        this.riExchange.riInputElement.Enable(this.uiForm, 'SelPrintRequired');
        if (this.pageParams.SCEnablePestNetOnlineProcessing && this.pageParams.SCEnablePestNetOnlineDefaults && this.riExchange.routerParams['CurrentContractTypeURLParameter'] !== '<product>') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOL', true);
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetPNOLDefault';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestExecute(this, function (data) {
                this.logger.log('CBO Callback 3B', data);
            });
        }
        if (this.pageParams.vbEnableGlobalSiteRiskAssessment) {
            this.pageParams.vbGblSRAMode = '';
            this.PremGblSRADisable();
        }
    };
    PremiseMaintenance3.prototype.riMaintenance_AfterAbandonAdd = function () {
        this.parent.pgPM3.setPurchaseOrderFields();
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelPrintRequired');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateEmail');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateSMS');
    };
    PremiseMaintenance3.prototype.riMaintenance_AfterAbandonUpdate = function () {
        this.parent.pgPM3.setPurchaseOrderFields();
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelPrintRequired');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateEmail');
        this.riExchange.riInputElement.Disable(this.uiForm, 'SelServiceNotifyTemplateSMS');
    };
    PremiseMaintenance3.prototype.CheckPostcode = function () {
        var ctrl = this.uiForm.controls;
        if (this.pageParams.vbEnableValidatePostcodeSuburb) {
            this.riMaintenance.BusinessObject = 'iCABSCheckContractPostcode.p';
            this.riMaintenance.clear();
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('EnableValidatePostcodeSuburb', this.pageParams.vbEnableValidatePostcodeSuburb, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SearchPostcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SearchState', ctrl.PremiseAddressLine5.value, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('SearchTown', ctrl.PremiseAddressLine4.value, MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('strFoundPostcode', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('CheckPostcode if callback', data);
            });
        }
        else {
            this.riMaintenance.BusinessObject = 'iCABSCheckContractPostcode.p';
            this.riMaintenance.clear();
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('EnableValidatePostcodeSuburb', this.pageParams.vbEnableValidatePostcodeSuburb, MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('ContractNumber', ctrl.ContractNumber.value, MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('SearchPostcode', ctrl.PremisePostcode.value, MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('strFoundPostcode', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('CheckPostcode else callback', data);
            });
        }
        this.riMaintenance.Execute(this, function (data) {
            if (data['strFoundPostcode'] === 'Yes') {
                if (this.pageParams.vbEnableValidatePostcodeSuburb) {
                    this.parent.navigate('PremisePostcodeSearch', 'Application/iCABSAPremiseSearch.htm');
                }
                else {
                    this.parent.navigate('PremisePostcodeSearchNoSuburb', 'Application/iCABSAPremiseSearch.htm');
                }
            }
        });
    };
    PremiseMaintenance3.prototype.SelServiceNotifyTemplateEmail_OnChange = function () {
        this.logger.log('SelServiceNotifyTemplateEmail_OnChange');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceNotifyTemplateEmail', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelServiceNotifyTemplateEmail'));
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', false);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceNotifyTemplateEmail') !== null) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceNotifyTemplateEmail') !== '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', true);
            }
        }
    };
    PremiseMaintenance3.prototype.SelServiceNotifyTemplateSMS_OnChange = function () {
        this.logger.log('SelServiceNotifyTemplateSMS_OnChange');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceNotifyTemplateSMS', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelServiceNotifyTemplateSMS'));
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactMobile', false);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceNotifyTemplateSMS') !== null) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceNotifyTemplateSMS') !== '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactMobile', true);
            }
        }
    };
    PremiseMaintenance3.prototype.PremiseCommenceDate_onBlur = function () {
        if (this.pageParams.SCEnablePestNetOnlineProcessing && this.pageParams.SCEnablePestNetOnlineDefaults
            && this.riExchange.routerParams['currentContractTypeURLParameter'] !== 'product'
            && this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.pageParams.dtPNOLEffectiveDate.value = this.utils.convertDate(this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseCommenceDate'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLEffectiveDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseCommenceDate'));
        }
    };
    PremiseMaintenance3.prototype.GetCustomerTypeDefault = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.BusinessObject = 'iCABSPremiseEntry.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Function', 'GetCustomerTypeDefault', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('CustomerTypeCode', ctrl.CustomerTypeCode.value, MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('ServiceNotifyTemplateEmail', MntConst.eTypeCode);
        this.riMaintenance.ReturnDataAdd('ServiceNotifyTemplateSMS', MntConst.eTypeCode);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA callback GetCustomerTypeDefault', data);
            if (!data.hasError) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SelServiceNotifyTemplateEmail', data['ServiceNotifyTemplateEmail']);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SelServiceNotifyTemplateSMS', data['ServiceNotifyTemplateSMS']);
                this.parent.pgPM3.SelServiceNotifyTemplateEmail_OnChange();
                this.parent.pgPM3.SelServiceNotifyTemplateSMS_OnChange();
            }
        }, 'POST');
    };
    return PremiseMaintenance3;
}());
