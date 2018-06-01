import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var PremiseMaintenanceAddrRes1 = (function () {
    function PremiseMaintenanceAddrRes1(parent) {
        this.parent = parent;
        this.vbEnableInstallsRemovals = '';
        this.vbEnableLocations = '';
        this.WindowPath = '';
        this.PremiseAdded = '';
        this.blnIgnore = false;
        this.blnNoFire = '';
        this.blnShowInvoiceNarrativeTab = '';
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
        this.sysCharConstants = this.parent.sysCharConstants;
        this.riExchange = this.parent.riExchange;
        this.riMaintenance = this.parent.riMaintenance;
        this.riTab = this.parent.riTab;
    }
    PremiseMaintenanceAddrRes1.prototype.killSubscription = function () {
    };
    PremiseMaintenanceAddrRes1.prototype.window_onload = function () {
        this.pgPM_AR = this.parent.pgPM_AR;
        this.pgPM_AR1 = this.parent.pgPM_AR1;
        this.pgPM_AR2 = this.parent.pgPM_AR2;
        this.pgPM_AR3 = this.parent.pgPM_AR3;
        this.logger.log('PremiseMaintenanceAddrRes1 window_onload: ', this.pageParams, this.pageParams.CurrentContractType, this.pageParams.CurrentContractTypeLabel);
        this.getSysCharDtetails();
    };
    PremiseMaintenanceAddrRes1.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableDiscountCode,
            this.sysCharConstants.SystemCharEnableLocations,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharEnableMapGridReference,
            this.sysCharConstants.SystemCharEnableNationalAccountWarning,
            this.sysCharConstants.SystemCharEnableRetentionOfServiceWeekday,
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharEnableReceiptRequired,
            this.sysCharConstants.SystemCharEnableDrivingCharges,
            this.sysCharConstants.SystemCharMaximumAddressLength,
            this.sysCharConstants.SystemCharEnableValidatePostcodeSuburb
        ];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.pageParams.vCountryCode,
            SysCharList: sysCharList.toString()
        };
        this.parent.SpeedScript.sysCharPromise(sysCharIP).then(function (data) {
            var records = data.records;
            _this.pageParams.vEnablePostcodeDefaulting = records[0].Required;
            _this.pageParams.vEnableDiscountCode = records[1].Required;
            _this.pageParams.vEnableLocations = records[2].Required;
            _this.pageParams.vEnableInstallsRemovals = records[3].Required;
            _this.pageParams.vEnableAddressLine3 = records[4].Required;
            _this.pageParams.vSCAddressLine3Logical = records[4].Logical;
            _this.pageParams.vEnableMapGridReference = records[5].Required;
            _this.pageParams.vEnableNationalAccountWarning = records[6].Required;
            _this.riExchange.updateCtrl(_this.controls, 'NationalAccountChecked', 'value', _this.pageParams.vEnableNationalAccountWarning);
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NationalAccountChecked', _this.pageParams.vEnableNationalAccountWarning);
            _this.pageParams.vEnableRetentionOfServiceWeekDay = records[7].Required;
            _this.pageParams.vSCEnableHopewiserPAF = records[8].Required;
            _this.pageParams.vSCEnableDatabasePAF = records[9].Required;
            _this.pageParams.vSCAddressLine4Required = records[10].Required;
            _this.pageParams.vSCAddressLine5Required = records[11].Required;
            _this.pageParams.vSCPostCodeRequired = records[12].Required;
            _this.pageParams.vSCPostCodeMustExistInPAF = records[13].Required;
            _this.pageParams.vSCRunPAFSearchOn1stAddressLine = records[14].Required;
            _this.pageParams.vSCServiceReceiptRequired = records[15].Required;
            _this.pageParams.vSCEnableDrivingCharges = records[16].Required;
            _this.pageParams.vEnableMaximumAddressLength = records[17].Integer;
            _this.pageParams.vMaximumAddressLength = records[17].Integer;
            _this.pageParams.vSCEnableValidatePostcodeSuburb = records[18].Required;
            if (!(_this.pageParams.vSCEnableHopewiserPAF || _this.pageParams.vSCEnableDatabasePAF)) {
                _this.uiDisplay.cmdGetAddress = false;
            }
            _this.renderPrimaryFields();
        });
    };
    PremiseMaintenanceAddrRes1.prototype.renderPrimaryFields = function () {
        this.logger.log('PremiseMnt -renderPrimaryFields', this.pageParams, this.formData, this.pageParams.ParentMode, 'Mode:', this.riMaintenance.CurrentMode, this.parent.isReturning());
        if (!this.parent.isReturning()) {
            if (this.parent.CBBupdated) {
                this.parent.CBBupdated = false;
                this.parent.updateButton();
            }
            else {
                var vntReturnData = '';
                switch (this.pageParams.ParentMode) {
                    case 'CSearch':
                    case 'CSearchAdd':
                    case 'IGSearch':
                    case 'Contract':
                    case 'Contract-Add':
                    case 'Contact':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        break;
                    case 'ProductSalesDelivery':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        break;
                    case 'ServiceCover':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseName', 'value', this.riExchange.getParentHTMLValue('PremiseName'));
                        break;
                }
                switch (this.pageParams.CurrentContractType) {
                    case 'J':
                    case 'P':
                        this.uiDisplay.labelDiscountCode = false;
                        this.uiDisplay.DiscountCode = false;
                        this.uiDisplay.DiscountDesc = false;
                        this.uiDisplay.tdCustomerInfo = false;
                        break;
                }
                this.uiDisplay.labelInactiveEffectDate = false;
                this.uiDisplay.InactiveEffectDate = false;
                this.uiDisplay.AnyPendingBelow = false;
                this.riExchange.updateCtrl(this.controls, 'cmdGetAddress', 'disabled', true);
                switch (this.pageParams.ParentMode) {
                    case 'Request':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.uiDisplay.grdPremiseMaintenanceControl = false;
                        break;
                    case 'LoadByKeyFields':
                    case 'PortfolioGeneralMaintenance':
                        this.riExchange.updateCtrl(this.controls, 'ContractNumber', 'value', this.riExchange.getParentHTMLValue('ContractNumber'));
                        this.riExchange.updateCtrl(this.controls, 'ContractName', 'value', this.riExchange.getParentHTMLValue('ContractName'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseNumber', 'value', this.riExchange.getParentHTMLValue('PremiseNumber'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseName', 'value', this.riExchange.getParentHTMLValue('PremiseName'));
                        break;
                }
                switch (this.pageParams.ParentMode) {
                    case 'ServicePlanning':
                    case 'AreaReallocation':
                    case 'ServiceAreaSequence':
                    case 'GroupServiceVisit':
                    case 'VisitDateDiscrepancy':
                    case 'ServiceVisitHistory':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'PortfolioNoTurnover':
                    case 'ServiceStatsAdjust':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'ContractExpiryGrid':
                    case 'SuspendServiceandInvoice':
                    case 'ContractPOExpiryGrid':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('RowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'Release':
                    case 'Summary':
                    case 'ProRataCharge':
                    case 'ServiceVisitEntryGrid':
                    case 'ServiceValueEntryGrid':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'GridCopySearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'Bonus':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'LostBusinessAnalysis':
                    case 'InvoiceReleased':
                    case 'StaticVisit':
                    case 'PortfolioReports':
                    case 'SalesCommissionOnSale':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                    case 'Entitlement':
                    case 'Verification':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        break;
                }
                switch (this.pageParams.ParentMode) {
                    case 'CSearch':
                    case 'Contract':
                    case 'Contract-Add':
                    case 'Contact':
                        this.blnIgnore = true;
                        this.riMaintenance.AddMode();
                        this.blnIgnore = false;
                        break;
                    case 'CSearchAdd':
                        this.parent.focusField('PremiseCommenceDate');
                        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseCommenceDate', false);
                        break;
                    case 'GeneralSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('RowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'AccountPremiseSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('RowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'GridSearch':
                        this.riExchange.getParentHTMLValue('ContractNumber');
                        this.riExchange.getParentHTMLValue('ContractName');
                        this.riExchange.getParentHTMLValue('PremiseNumber');
                        this.riExchange.getParentHTMLValue('PremiseName');
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'GridCopySearch':
                        this.riExchange.getParentHTMLValue('ContractNumber');
                        this.riExchange.getParentHTMLValue('GridPremiseNumber');
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'StockEstimatesSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'TreatmentcardRecallSearch':
                        this.riMaintenance.RowID(this, 'Premise', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'Premise', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riExchange.updateCtrl(this.controls, 'PremiseRowID', 'value', this.riExchange.getParentAttributeValue('PremiseRowID'));
                        this.riMaintenance.FetchRecord();
                        break;
                    case 'GridSearchAdd':
                        this.riExchange.getParentHTMLValue('ContractNumber');
                        this.riExchange.getParentHTMLValue('ContractName');
                        this.riMaintenance.AddMode();
                        this.parent.focusField('PremiseCommenceDate');
                        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PremiseCommenceDate', false);
                        break;
                }
            }
        }
        else {
            for (var i in this.formData) {
                if (i) {
                    this.riExchange.updateCtrl(this.controls, i, 'value', this.formData[i]);
                }
            }
        }
        this.parent.updateButton();
        if (!this.pageParams.shouldOpen) {
            if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
                this.parent.disablePremiseNumber();
            }
            else {
                this.parent.enablePremiseNumber();
            }
        }
        this.uiDisplay.tdCustomerInfo = false;
        this.pgPM_AR2.SetSCVariables();
        this.pgPM_AR2.SetHTMLPageSettings(this);
        this.pgPM_AR3.AddTabs();
        this.pgPM_AR2.BuildMenuOptions();
        this.riExchange.renderForm(this.uiForm, this.controls);
        if (this.parent.pageParams.shouldOpen) {
            this.parent.contractNumberEllipsis.openModal();
            this.pageParams.shouldOpen = false;
        }
        this.init();
    };
    PremiseMaintenanceAddrRes1.prototype.init = function () {
        var _this = this;
        this.logger.log('INIT inside PM_AR1');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.CurrentContractType);
        this.logger.log(this.riMaintenance.CurrentMode, '|', 'ParentMode', this.pageParams.ParentMode, '|', 'ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), '|', 'PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'), '|', 'PremiseRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseRowID'), '|', 'ContractTypeCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode'), '|', 'CurrentContractType', this.pageParams.CurrentContractType);
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '') {
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseRowID') === '') {
                    this.parent.initialFormState(true, false);
                    return;
                }
            }
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') === '') {
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseRowID') === '') {
                    this.parent.initialFormState(true, false);
                    return;
                }
            }
        }
        this.logger.log('-------------------------------------');
        this.parent.overrideOpenFieldCR();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.CurrentContractType);
        this.parent.enableControls();
        this.parent.primaryFieldsEnableDisable();
        this.parent.setFormMode(this.parent.c_s_MODE_SELECT);
        this.parent.lErrorMessageDesc = [];
        var strDocTitle = this.pageParams.CurrentContractTypeLabel + ' Premises Entry';
        var strTabTitle = this.pageParams.CurrentContractTypeLabel + ' Premises Maintenance';
        var strInpTitle = this.pageParams.CurrentContractTypeLabel + ' Number';
        this.utils.setTitle(strDocTitle);
        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.CustomBusinessObject = 'iCABSPremiseEntryAddrRes.p';
        this.riMaintenance.CustomBusinessObjectSelect = true;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = true;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionDelete = false;
        this.riMaintenance.DisplayMessages = true;
        if (this.pageParams.ParentMode === 'ProductSalesDelivery') {
            this.uiDisplay.grdPremiseMaintenanceControl = false;
        }
        if (this.pageParams.ParentMode === 'CSearch' || this.pageParams.ParentMode === 'CSearchAdd' || this.pageParams.ParentMode === 'IGSearch') {
            this.riMaintenance.FunctionSearch = false;
        }
        if (this.pageParams.ParentMode === 'ServiceCover') {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSelect = false;
        }
        if (this.riExchange.URLParameterContains('pgm')) {
            this.riMaintenance.FunctionAdd = false;
            this.riMaintenance.FunctionSelect = false;
        }
        this.riMaintenance.AddTable('Premise');
        switch (this.pageParams.ParentMode) {
            case 'CSearch':
            case 'CSearchAdd':
            case 'IGSearch':
            case 'Contract':
            case 'Contract-Add':
            case 'Contact':
            case 'GridSearch':
            case 'GridSearchAdd':
            case 'ServiceCover':
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                break;
            default:
                this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        }
        this.riMaintenance.AddTableKeyAlignment('ContractNumber', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeAutoNumber, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableKey('PremiseRowID', MntConst.eTypeAutoNumber, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableField('NationalAccount', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AccountNumber', MntConst.eTypeCodeNumeric, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('AccountNumber', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PremiseCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableFieldAlignment('PremiseCommenceDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableField('PremiseName', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseAddressLine1', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseAddressLine2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.pageParams.vSCAddressLine3Logical) {
            this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        }
        else {
            this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('PremiseAddressLine4', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Requried');
        this.riMaintenance.AddTableField('PremisePostcode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('DrivingChargeValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactName', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactPosition', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactTelephone', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactMobile', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactFax', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactEmail', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('InvoiceGroupNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('DiscountCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableFieldAlignment('DiscountCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('ServiceBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('CustomerTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldAlignment('CustomerTypeCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('SalesAreaCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'LookUp');
        this.riMaintenance.AddTableFieldAlignment('SalesAreaCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PremiseSalesEmployee', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('PremiseSalesEmployee', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PurchaseOrderNo', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ClientReference', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseDirectoryName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseDirectoryPage', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseDirectoryGridRef', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseSpecialInstructions', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseSRADate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseSRAEmployee', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'LookUp');
        this.riMaintenance.AddTableFieldAlignment('PremiseSRAEmployee', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('LostBusinessRequestNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('InvoiceSuspendInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('InvoiceSuspendInd', false);
        this.riMaintenance.AddTableField('InvoiceSuspendText', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('InvoiceSuspendText', false);
        this.riMaintenance.AddTableField('RetainServiceWeekdayInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceReceiptRequired', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseRowID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableCommit(this, function (data) {
            if (data && data.hasError) {
                _this.parent.servicePrimaryError(data);
            }
            _this.initiateVirtualTable();
            _this.parent.ellipsis.premiseNumberEllipsis.childparams.ContractNumber = _this.parent.getControlValue('ContractNumber');
            _this.parent.ellipsis.premiseNumberEllipsis.childparams.ContractName = _this.parent.getControlValue('ContractName');
            _this.parent.ellipsis.premiseNumberEllipsis.childparams.AccountNumber = _this.parent.getControlValue('AccountNumber');
            _this.parent.ellipsis.invoiceGrpNumberEllipsis.childparams.AccountNumber = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'AccountNumber');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.AccountNumber = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'AccountNumber');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.ContractNumber = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ContractNumber');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.ContractName = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ContractName');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.SearchPostcode = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremisePostcode');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseName = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseName');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine1 = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine1');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine2 = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine2');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine3 = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine3');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine4 = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine4');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.PremiseAddressLine5 = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine5');
            _this.parent.ellipsis.siteReferenceEllipsis.childparams.PremisePostcode = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremisePostcode');
            _this.pageParams.PremiseAddressLine1Orignal = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine1');
            _this.pageParams.PremiseAddressLine2Orignal = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine2');
            _this.pageParams.PremiseAddressLine3Orignal = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine3');
            _this.pageParams.PremiseAddressLine4Orignal = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine4');
            _this.pageParams.PremiseAddressLine5Orignal = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseAddressLine5');
            _this.pageParams.PremisePostcodeOrignal = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremisePostcode');
            _this.pageParams.HaveResolved = true;
            _this.pageParams.PBusinessCode = _this.utils.getBusinessCode();
            var fields = 'AccessFrom1, AccessFrom2, AccessFrom3, AccessFrom4, AccessFrom5, AccessFrom6, AccessFrom7, AccessFrom8, AccessFrom9, AccessFrom10, AccessTo1, AccessTo2, AccessTo3, AccessTo4, AccessTo5, AccessTo6, AccessTo7, AccessTo8, AccessTo9, AccessTo10'.split(', ');
            fields.map(function (value, index, array) {
                if (_this.riExchange.riInputElement.GetValue(_this.uiForm, value) === '00:00') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, value, '');
                }
            });
        }, 'Mode=NewUI');
        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('PremiseRowID', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('Premise', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('CustomerInfoAvailable', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('CustomerInfoAvailable', false);
        this.riMaintenance.AddTableField('PremiseAnnualValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('PremiseAnnualValue', false);
        this.riMaintenance.AddTableField('NegBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('NegBranchNumber', false);
        this.riMaintenance.AddTableField('NegBranchName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('NegBranchName', false);
        this.riMaintenance.AddTableField('NationalAccountBranch', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('NationalAccountBranch', false);
        this.riMaintenance.AddTableField('Status', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('Status', false);
        this.riMaintenance.AddTableField('InactiveEffectDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('InactiveEffectDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableFieldPostData('InactiveEffectDate', false);
        this.riMaintenance.AddTableField('LostBusinessDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('LostBusinessDesc', false);
        this.riMaintenance.AddTableField('DisableList', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ContractTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AccountName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ShowValueButton', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldPostData('ShowValueButton', false);
        this.riMaintenance.AddTableField('NewContract', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AnyPendingBelow', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('AnyPendingBelow', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableFieldPostData('AnyPendingBelow', false);
        this.riMaintenance.AddTableField('ErrorMessageDesc', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldPostData('ErrorMessageDesc', false);
        this.riMaintenance.AddTableField('CreateNewInvoiceGroupInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('InvoiceNarrativeText', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('DrivingChargeInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('MapStreetNo', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapStreetName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapStreetType', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapSuburb', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapState', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapPostCode', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapLatitude', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('MapLongitude', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('ServiceTimeAdj', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceAdjHrs', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ServiceAdjMins', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseType', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('ProofOfServFax', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('PosFax', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('ProofOfServSMS', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('PosSMS', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('ProofOfServEmail', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('PosEmail', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyFax', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyFaxDetail', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifySMS', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifySMSDetail', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyPhone', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyPhoneDetail', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyEmail', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyEmailDetail', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyDaysBefore', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('NotifyLine', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('NotifyText', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('Monday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Tuesday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Wednesday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Thursday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Friday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Saturday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('Sunday', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeCode1', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname1', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc1', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority1', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks1', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('EmployeeCode2', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority2', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks2', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('EmployeeCode3', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority3', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks3', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('EmployeeCode4', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname4', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc4', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority4', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks4', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('EmployeeCode5', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname5', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc5', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority5', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks5', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('EmployeeCode6', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname6', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc6', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority6', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks6', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('EmployeeCode7', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname7', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc7', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority7', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks7', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('EmployeeCode8', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname8', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc8', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority8', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks8', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('EmployeeCode9', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname9', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc9', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority9', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks9', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('EmployeeCode10', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('EmployeeSurname10', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('OccupationDesc10', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('Priority10', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AllowAllTasks10', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom1', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo1', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId1', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom2', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo2', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId2', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom3', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo3', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId3', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom4', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo4', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId4', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom5', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo5', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId5', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom6', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo6', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId6', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom7', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo7', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId7', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom8', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo8', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId8', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom9', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo9', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId9', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateFrom10', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('DateTo10', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('RowId10', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom1', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo1', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom2', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo2', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom3', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo3', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom4', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo4', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom5', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo5', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom6', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo6', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom7', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo7', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom8', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo8', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom9', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo9', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessFrom10', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableField('AccessTo10', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');
        this.riMaintenance.AddTableCommit(this);
        this.riExchange.riInputElement.Disable(this.uiForm, 'Status');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InactiveEffectDate');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LostBusinessDesc');
        this.pgPM_AR3.AddTabs();
        this.pgPM_AR3.ShowInvoiceNarrativeTab();
        if (this.riMaintenance.RecordSelected(false)) {
            this.riMaintenance.FetchRecord();
        }
        this.pgPM_AR2.BuildMenuOptions();
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '') {
            this.uiDisplay.cmdGetLatAndLong = true;
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riExchange_CBORequest();
        }
        this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this.pgPM_AR1, this.pgPM_AR2, this.pgPM_AR3, this.parent]);
    };
    PremiseMaintenanceAddrRes1.prototype.initiateVirtualTable = function () {
        var _this = this;
        switch (this.pageParams.ParentMode) {
            case 'CSearch':
            case 'CSearchAdd':
            case 'IGSearch':
            case 'Contract':
            case 'Contract-Add':
            case 'Contact':
            case 'GridSearch':
            case 'GridSearchAdd':
                this.riMaintenance.AddVirtualTable('Contract');
                this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
                this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
                this.riMaintenance.AddVirtualTableCommit(this);
                break;
            default:
                this.riMaintenance.AddVirtualTable('Contract');
                this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
                this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
                this.riMaintenance.AddVirtualTableCommit(this);
                break;
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.riMaintenance.AddVirtualTable('InvoiceGroup');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('InvoiceGroupNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('InvoiceGroupDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('Account');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('NationalAccount', MntConst.eTypeCheckBox, MntConst.eVirtualFieldStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this, function (data) {
                setTimeout(function () {
                    _this.riExchange.updateCtrl(_this.controls, 'NationalAccountChecked', 'value', _this.pageParams.vEnableNationalAccountWarning);
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'NationalAccountChecked', _this.pageParams.vEnableNationalAccountWarning);
                    if (_this.riExchange.riInputElement.checked(_this.uiForm, 'NationalAccountChecked')
                        && _this.riExchange.riInputElement.checked(_this.uiForm, 'NationalAccount')) {
                        _this.uiDisplay.tdNationalAccount = true;
                    }
                    else {
                        _this.uiDisplay.tdNationalAccount = false;
                    }
                }, 500);
            });
            this.riMaintenance.AddVirtualTable('SalesArea');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('BranchNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceBranchNumber', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('SalesAreaCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('SalesAreaDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('Discount');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('DiscountCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('DiscountDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('Branch');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('BranchNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceBranchNumber', 'Virtual');
            this.riMaintenance.AddVirtualTableField('BranchName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('Employee');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'PremiseSalesEmployee', 'Virtual');
            this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'SalesEmployeeSurname');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('Employee', 'PremiseSRAEmployee');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'PremiseSRAEmployee', 'Virtual');
            this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual', 'SRAEmployeeSurname');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('CustomerTypeLanguage');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('CustomerTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('CustomerTypeDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.iefAddCustomVirtuals();
        }
    };
    PremiseMaintenanceAddrRes1.prototype.riMaintenance_Search = function () {
        var ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        var PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        if (ContractNumber === '') {
        }
        if (ContractNumber !== '' && PremiseNumber === '') {
        }
    };
    PremiseMaintenanceAddrRes1.prototype.riMaintenance_BeforeSelect = function () {
        this.uiDisplay.tdCustomerInfo = false;
        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.LostBusinessDesc = false;
        this.uiDisplay.cmdValue = false;
        this.uiDisplay.tdPremiseAnnualValueLab = false;
        this.uiDisplay.tdPremiseAnnualValue = false;
        this.pgPM_AR3.AddTabs();
    };
    PremiseMaintenanceAddrRes1.prototype.riMaintenance_BeforeFetch = function () {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ContractTypeCode=' + this.pageParams.CurrentContractType;
    };
    PremiseMaintenanceAddrRes1.prototype.riMaintenance_AfterFetch = function () {
        var _this = this;
        this.pageParams.PremiseAddressLine1Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine1');
        this.pageParams.PremiseAddressLine2Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine2');
        this.pageParams.PremiseAddressLine3Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine3');
        this.pageParams.PremiseAddressLine4Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine4');
        this.pageParams.PremiseAddressLine5Orignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine5');
        this.pageParams.PremisePostcodeOrignal = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode');
        this.pageParams.HaveResolved = true;
        this.pageParams.PBusinessCode = this.utils.getBusinessCode();
        this.uiDisplay.cmdGetLatAndLong = true;
        var fields = 'AccessFrom1, AccessFrom2, AccessFrom3, AccessFrom4, AccessFrom5, AccessFrom6, AccessFrom7, AccessFrom8, AccessFrom9, AccessFrom10, AccessTo1, AccessTo2, AccessTo3, AccessTo4, AccessTo5, AccessTo6, AccessTo7, AccessTo8, AccessTo9, AccessTo10'.split(', ');
        fields.map(function (value, index, array) {
            if (_this.riExchange.riInputElement.GetValue(_this.uiForm, value) === '00:00') {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, value, '');
            }
        });
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'InactiveEffectDate') !== '') {
            this.uiDisplay.labelInactiveEffectDate = true;
            this.uiDisplay.InactiveEffectDate = true;
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'LostBusinessDesc') !== '') {
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
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AnyPendingBelow') !== '') {
            this.uiDisplay.AnyPendingBelow = true;
        }
        else {
            this.uiDisplay.AnyPendingBelow = false;
        }
        if (this.riExchange.riInputElement.checked(this.uiForm, 'ShowValueButton')) {
            this.uiDisplay.cmdValue = true;
        }
        else {
            this.uiDisplay.cmdValue = false;
        }
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full'
            || this.riExchange.ClientSideValues.Fetch('BranchNumber') === this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber')
            || this.riExchange.ClientSideValues.Fetch('BranchNumber') === this.riExchange.riInputElement.GetValue(this.uiForm, 'NegBranchNumber')) {
            this.uiDisplay.tdPremiseAnnualValueLab = true;
            this.uiDisplay.tdPremiseAnnualValue = true;
        }
        else {
            this.uiDisplay.tdPremiseAnnualValueLab = false;
            this.uiDisplay.tdPremiseAnnualValue = false;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'NationalAccountChecked') === 'true' &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'NationalAccount') === 'true') {
            this.uiDisplay.tdNationalAccount = true;
        }
        else {
            this.uiDisplay.tdNationalAccount = false;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerInfoAvailable') === 'true') {
            this.uiDisplay.tdCustomerInfo = true;
        }
        else {
            this.uiDisplay.tdCustomerInfo = false;
        }
        if (this.pageParams.vSCEnableDrivingCharges && this.riExchange.riInputElement.GetValue(this.uiForm, 'DrivingChargeInd') === 'true' && this.pageParams.CurrentContractType !== 'P') {
            this.uiDisplay.tdDrivingChargeValueLab = true;
            this.uiDisplay.tdDrivingChargeValue = true;
        }
        else {
            this.uiDisplay.tdDrivingChargeValueLab = false;
            this.uiDisplay.tdDrivingChargeValue = false;
        }
        this.pgPM_AR3.AddTabs();
        this.pgPM_AR3.ShowInvoiceNarrativeTab();
    };
    PremiseMaintenanceAddrRes1.prototype.riMaintenance_BeforeMode = function () {
        this.logger.log('DEBUG --- riMaintenance_BeforeMode called');
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.pageParams.HaveResolved = true;
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetLatAndLong');
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetAddress');
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdValue');
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeNormal) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdGetAddress');
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdValue');
            this.pgPM_AR3.AddTabs();
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.uiDisplay.labelInactiveEffectDate = false;
            this.uiDisplay.InactiveEffectDate = false;
            this.uiDisplay.cmdValue = false;
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdValue');
            this.pgPM_AR3.AddTabs();
            this.pgPM_AR3.ShowInvoiceNarrativeTab();
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetLatAndLong');
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeNormal) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'cmdGetLatAndLong');
        }
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'cmdGetLatAndLong');
        }
    };
    PremiseMaintenanceAddrRes1.prototype.riMaintenance_BeforeAddMode = function () {
        this.logger.log('DEBUG --- riMaintenance_BeforeAddMode called');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'Saturday', true);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'Sunday', true);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseType', 'NS');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'NotifyLine', 'NOTIFICATION OF INITIAL HEALTHCARE SERVICE');
        this.pgPM_AR3.AddTabs();
        this.parent.focusField('PremiseCommenceDate');
        this.uiDisplay.cmdGetAddress = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.CurrentContractType);
        this.uiDisplay.labelInactiveEffectDate = false;
        this.uiDisplay.InactiveEffectDate = false;
        this.uiDisplay.LostBusinessDesc = false;
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetDefaultDiscountCode';
        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestExecute(this, function (data) { this.logger.log('CBORequestExecute:', data); });
        if (this.pageParams.ParentMode === 'Contact') {
            this.riExchange.getParentHTMLValue('LostBusinessRequestNumber');
        }
        if (this.pageParams.CurrentContractType === 'P') {
            this.riMaintenance.DisableInput('PremiseCommenceDate');
            this.parent.dateDisable('PremiseCommenceDate', true, true);
        }
        else {
            this.riMaintenance.EnableInput('PremiseCommenceDate');
            this.parent.dateDisable('PremiseCommenceDate', false, true);
        }
        if (this.pageParams.CurrentContractType === 'C' || this.pageParams.CurrentContractType === 'J') {
            this.parent.attributes.RenegContract = false;
            this.parent.attributes.ContractNumber = '';
            this.parent.attributes.PremiseNumber = '';
            this.uiDisplay.tdDrivingChargeValueLab = false;
            this.uiDisplay.tdDrivingChargeValue = false;
        }
        if (this.pageParams.ParentMode === 'CSearch'
            || this.pageParams.ParentMode === 'CSearchAdd'
            || this.pageParams.ParentMode === 'IGSearch'
            || this.pageParams.ParentMode === 'Contract-Add'
            || this.pageParams.ParentMode === 'Contact') {
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
    PremiseMaintenanceAddrRes1.prototype.riMaintenance_BeforeUpdateMode = function () {
        this.riMaintenance.DisableInput('PremiseCommenceDate');
        this.parent.dateDisable('PremiseCommenceDate', true, false);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'NationalAccountBranch') === 'false') {
            if (this.riExchange.ClientSideValues.Fetch('BranchNumber') !== this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber')) {
                this.riMaintenance.DisableInput('SalesAreaCode');
            }
            if (this.pageParams.CurrentContractType === 'P') {
                this.riMaintenance.DisableInput('ServiceBranchNumber');
            }
        }
        this.pageParams.HaveResolved = true;
    };
    PremiseMaintenanceAddrRes1.prototype.riExchange_CBORequest = function () {
        this.logger.log('DEBUG --- riExchange_CBORequest');
        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ContractNumber') || this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName') === '') {
                if (this.pageParams.ParentMode === 'Contract-Add' || this.pageParams.CurrentContractType === 'J') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'NewContract', true);
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'NewContract', false);
                }
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.pageParams.CurrentContractType);
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetContractDefaults';
                this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.CBORequestAdd('ContractNumber');
                this.riMaintenance.CBORequestAdd('ContractTypeCode');
                this.riMaintenance.CBORequestAdd('NewContract');
                this.riMaintenance.CBORequestExecute(this, function (data) {
                    this.riMaintenance.renderResponseForCtrl(this, data);
                    if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CreateNewInvoiceGroupInd')) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupNumber', '');
                        this.riMaintenance.DisableInput('InvoiceGroupNumber');
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', false);
                    }
                    else {
                        this.riMaintenance.EnableInput('InvoiceGroupNumber');
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', true);
                    }
                });
            }
            if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseCommenceDate')
                || this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseCommenceDate') !== ''
                    && this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '') {
                this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnAnniversaryDate';
                this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
                this.riMaintenance.CBORequestAdd('ContractNumber');
                this.riMaintenance.CBORequestAdd('PremiseCommenceDate');
                this.riMaintenance.CBORequestExecute(this, function (data) {
                    this.logger.log('CBORequestExecute:', data);
                    if (data.hasError) {
                        this.parent.showAlert(data.errorMessage);
                    }
                });
            }
        }
        this.pgPM_AR2.PostcodeDefaultingEnabled({});
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'SalesAreaCode')
            || this.riExchange.riInputElement.GetValue(this.uiForm, 'SalesAreaCode') !== ''
                && this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber') !== '') {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=DefaultFromSalesArea';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('ServiceBranchNumber');
            this.riMaintenance.CBORequestAdd('SalesAreaCode');
            this.riMaintenance.CBORequestExecute(this, function (data) { this.logger.log('CBORequestExecute:', data); });
        }
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'PremiseSRADate')
            && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseSRADate') !== '') {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnSRADate';
            this.riMaintenance.CBORequestAdd('PremiseSRADate');
            this.riMaintenance.CBORequestExecute(this, function (data) {
                this.logger.log('CBORequestExecute:', data);
                if (data.hasError) {
                    this.parent.showAlert(data.errorMessage);
                }
            });
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerInfoAvailable')) {
            this.uiDisplay.tdCustomerInfo = true;
        }
        else {
            this.uiDisplay.tdCustomerInfo = false;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'NationalAccountChecked') && this.riExchange.riInputElement.GetValue(this.uiForm, 'NationalAccount')) {
            this.uiDisplay.tdNationalAccount = true;
        }
        else {
            this.uiDisplay.tdNationalAccount = false;
        }
    };
    PremiseMaintenanceAddrRes1.prototype.iefAddCustomVirtuals = function () {
    };
    PremiseMaintenanceAddrRes1.prototype.iefAddCustomStarFields = function () {
    };
    return PremiseMaintenanceAddrRes1;
}());
