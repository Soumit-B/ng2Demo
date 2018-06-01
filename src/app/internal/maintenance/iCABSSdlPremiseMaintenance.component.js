var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, ViewChild, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../base/BaseComponent';
import { InternalMaintenanceModuleRoutes } from '../../base/PageRoutes';
import { MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
export var SdlPremiseMaintenanceComponent = (function (_super) {
    __extends(SdlPremiseMaintenanceComponent, _super);
    function SdlPremiseMaintenanceComponent(injector) {
        _super.call(this, injector);
        this.isRequesting = false;
        this.promptTitle = 'Confirm';
        this.promptContent = 'Confirm Record?';
        this.showCloseButton = true;
        this.modalConfig = { backdrop: 'static', keyboard: true };
        this.controls = [
            { name: 'AccountName', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'AccountNumber', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'AutoCloseWindow', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'BusinessCode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'ClientReference', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'CmdGenerateSRAText', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'cmdGeocode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'cmdGetAddress', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'CompanyCode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'ContractCommenceDate', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'ContractName', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'ContractTypeCode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'CustomerTypeCode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'CustomerTypeDesc', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'DisQuoteTypeCode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlBatchRef', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlContractRef', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlExtRef', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlMasterExtRef', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlPremiseRef', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlPremiseROWID', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlRecordType', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlRejectionCode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlRejectionDesc', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlStatusCode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'dlStatusDesc', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'GPSCoordinateX', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'GPSCoordinateY', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'InitialdlMasterExtRef', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'InvoiceGroupDesc', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'InvoiceGroupNumber', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'JobCommenceDate', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'JobExpiryDate', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'menu', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'Misc', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PNOL', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PNOLDescription', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PNOLiCABSLevel', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PNOLSetupChargeRequired', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PNOLSiteRef', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'POExpiryValue', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseAddressLine1', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseAddressLine2', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseAddressLine3', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseAddressLine4', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseAddressLine5', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseContactEmail', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseContactFax', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseContactMobile', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseContactName', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseContactPosition', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseContactTelephone', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseName', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremisePostcode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PremiseSpecialInstructions', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'PurchaseOrderNo', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'QuoteTypeCode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'RoutingGeonode', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'RoutingScore', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'RoutingSource', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'SelRoutingSource', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'SubSystem', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh01', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh02', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh03', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh04', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh05', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh06', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh07', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh08', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh09', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh10', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh11', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh12', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh13', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'tweh14', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem01', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem02', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem03', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem04', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem05', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem06', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem07', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem08', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem09', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem10', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem11', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem12', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem13', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twem14', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh01', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh02', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh03', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh04', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh05', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh06', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh07', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh08', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh09', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh10', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh11', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh12', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh13', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsh14', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm01', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm02', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm03', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm04', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm05', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm06', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm07', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm08', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm09', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm10', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm11', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm12', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm13', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'twsm14', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'UpdateableInd', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WasteFeeInd', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth01', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm01', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh01', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm01', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth02', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm02', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh02', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm02', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth03', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm03', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh03', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm03', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth04', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm04', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh04', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm04', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth05', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm05', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh05', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm05', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth06', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm06', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh06', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm06', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth07', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm07', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh07', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm07', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth08', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm08', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh08', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm08', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth09', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm09', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh09', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm09', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth10', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm10', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh10', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm10', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth11', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm11', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh11', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm11', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth12', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm12', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh12', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm12', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth13', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm13', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh13', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm13', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStarth14', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowStartm14', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndh14', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
            { name: 'WindowEndm14', readonly: false, disabled: false, type: '', required: false, value: '', primary: false }
        ];
        this.uiDisplay = {
            cmdGetAddress: true,
            trInvoiceGroupNumber: false,
            trPremiseAddressLine3: false,
            trPNOLFlags1: false,
            trPNOLFlags2: false,
            trHR1: false,
            trHR2: false,
            trGPSRouting1: false,
            trGPSRouting2: false,
            menu: true,
            tdViewOriginal: false,
            tdContractCommenceDateLabel: false,
            tdContractCommenceDate: false,
            tdJobCommenceDateLabel: false,
            tdJobCommenceDate: false,
            tdJobExpiryDateLabel: false,
            tdJobExpiryDate: false,
            CmdGenerateSRAText: false,
            trPNOLLevel: false,
            trPNOLDescription: false
        };
        this.dropDown = {
            menu: [],
            twsh: [],
            twsm: [],
            tweh: [],
            twem: []
        };
        this.tab = {
            tab1: { id: 'grdAddress', name: 'Address', visible: false, active: true },
            tab2: { id: 'grdSRA', name: 'Risk Assessment Grid', visible: false, active: false },
            tab3: { id: 'grdSRAText', name: 'Risk Assessment Text', visible: false, active: false },
            tab4: { id: 'grdTimeWindow', name: 'Time Windows', visible: false, active: false }
        };
        this.xhrParams = {
            module: 'advantage',
            method: 'prospect-to-contract/maintenance',
            operation: 'Sales/iCABSSdlPremiseMaintenance'
        };
        this.currentActivity = '';
        this.totalRecords = 0;
        this.itemsPerPage = 17;
        this.maxColumn = 3;
        this.currentPage = 1;
        this.gridSortHeaders = [];
        this.page = 1;
        this.headerClicked = '';
        this.sortType = 'DESC';
        this.pageId = PageIdentifier.ICABSSDLPREMISEMAINTENANCE;
    }
    SdlPremiseMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageParams.vBusinessCode = this.utils.getBusinessCode();
        this.pageParams.vCountryCode = this.utils.getCountryCode();
        this.pageParams.gUserCode = this.utils.getUserCode();
        this.pageParams.vDisableFieldList = '';
        this.getSysCharDtetails();
        this.doLookup();
        this.riTab = new RiTab(this.tab, this.utils);
        this.tab = this.riTab.tabObject;
        this.riTab.TabAdd('Address');
        this.riTab.TabAdd('Risk Assessment Grid');
        this.riTab.TabAdd('Risk Assessment Text');
        this.riTab.TabAdd('Time Windows');
        this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
    };
    SdlPremiseMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    SdlPremiseMaintenanceComponent.prototype.doLookup = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'CustomerTypeLanguage',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['CustomerTypeCode', 'CustomerTypeDesc']
            },
            {
                'table': 'PestNetOnLineLevel',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['PNOLiCabsLevel', 'PNOLDescription']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            _this.logger.log('Lookup data', data);
        });
    };
    SdlPremiseMaintenanceComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharEnablePNOLLevelProcessingInSOP,
            this.sysCharConstants.SystemCharEnableRouteOptimisationSoftwareIntegration,
            this.sysCharConstants.SystemCharMaximumAddressLength
        ];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysCharPromise(sysCharIP).then(function (data) {
            var records = data.records;
            _this.logger.log('SYSCHAR', records);
            _this.pageParams.vSCEnableAddressLine3 = records[0].Logical;
            _this.pageParams.vSCAddressLine3Logical = records[0].Logical;
            _this.pageParams.vSCAddressLine5Required = records[1].Required;
            _this.pageParams.vSCAddressLine5Logical = records[1].Required;
            _this.pageParams.vSCEnableHopewiserPAF = records[2].Required;
            _this.pageParams.vSCEnableDatabasePAF = records[3].Required;
            _this.pageParams.vSCAddressLine4Required = records[4].Required;
            _this.pageParams.vSCPostCodeRequired = records[5].Required;
            _this.pageParams.vSCPostCodeMustExistInPAF = records[6].Required;
            _this.pageParams.vSCRunPAFSearchOn1stAddressLine = records[7].Required;
            _this.pageParams.vSCEnablePNOLProcessingInSOP = records[8].Required;
            _this.pageParams.vSCEnableRouteOptimisation = records[9].Required;
            _this.pageParams.vSCEnableMaxAddress = records[10].Integer;
            _this.pageParams.vSCEnableMaxAddressValue = records[10].Integer;
            if (_this.pageParams.vSCEnableAddressLine3)
                _this.pageParams.vDisableFieldList += 'DisableAddressLine3';
            _this.pageParams.vDefaultCountryCode = _this.utils.getCountryCode();
            _this.pageParams.storeInitialRefs = false;
            _this.pageParams.PipelineAmendMode = '';
            _this.pageParams.PipelineAddMode = '';
            _this.pageParams.AlreadyPNOL = false;
            _this.pageParams.lUpdateContractCommenceDate = false;
            _this.pageParams.lUpdateJobCommenceDate = false;
            _this.pageParams.FieldDisableList = _this.pageParams.vDisableFieldList;
            _this.pageParams.MaximumAddressLength = _this.pageParams.vSCEnableMaxAddressValue;
            _this.pageParams.strDefaultCountryCode = _this.pageParams.vDefaultCountryCode;
            _this.pageParams.SCEnableHopewiserPAF = _this.pageParams.vSCEnableHopewiserPAF ? true : false;
            _this.pageParams.SCEnableDatabasePAF = _this.pageParams.vSCEnableDatabasePAF ? true : false;
            _this.pageParams.SCAddressLine3Logical = _this.pageParams.vSCAddressLine3Logical ? true : false;
            _this.pageParams.SCAddressLine4Required = _this.pageParams.vSCAddressLine4Required ? true : false;
            _this.pageParams.SCAddressLine5Required = _this.pageParams.vSCAddressLine5Required ? true : false;
            _this.pageParams.SCAddressLine5Logical = _this.pageParams.vSCAddressLine5Logical ? true : false;
            _this.pageParams.SCPostCodeRequired = _this.pageParams.vSCPostCodeRequired ? true : false;
            _this.pageParams.SCPostCodeMustExistInPAF = _this.pageParams.vSCPostCodeMustExistInPAF ? true : false;
            _this.pageParams.SCRunPAFSearchOnFirstAddressLine = _this.pageParams.vSCRunPAFSearchOn1stAddressLine ? true : false;
            _this.pageParams.SCEnablePNOLProcessingInSOP = _this.pageParams.vSCEnablePNOLProcessingInSOP ? true : false;
            _this.pageParams.SCEnableRouteOptimisation = _this.pageParams.vSCEnableRouteOptimisation ? true : false;
            _this.window_onload();
        });
    };
    SdlPremiseMaintenanceComponent.prototype.save = function () {
        this.logger.log('SAVE');
        this.currentActivity = 'SAVE';
        this.promptModal.show();
    };
    SdlPremiseMaintenanceComponent.prototype.cancel = function () {
        this.logger.log('CANCEL');
        this.currentActivity = 'CANCEL';
        this.riExchange.resetCtrl(this.controls);
        this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    SdlPremiseMaintenanceComponent.prototype.delete = function () {
        this.logger.log('DELETE');
        this.currentActivity = 'DELETE';
        this.promptModal.show();
    };
    SdlPremiseMaintenanceComponent.prototype.confirmed = function (obj) {
        this.riMaintenance.CancelEvent = false;
        switch (this.currentActivity) {
            case 'SAVE':
                this.currentActivity = '';
                this.riMaintenance.execMode(MntConst.eModeSaveUpdate, [this]);
                break;
            case 'DELETE':
                this.currentActivity = '';
                this.riMaintenance.execMode(MntConst.eModeDelete, [this]);
                break;
        }
    };
    SdlPremiseMaintenanceComponent.prototype.showAlert = function (msgTxt, type) {
        this.logger.log('showAlert', msgTxt);
        var titleModal = '';
        if (typeof type === 'undefined')
            type = 0;
        switch (type) {
            default:
            case 0:
                titleModal = 'Error Message';
                break;
            case 1:
                titleModal = 'Success Message';
                break;
            case 2:
                titleModal = 'Warning Message';
                break;
        }
        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    };
    SdlPremiseMaintenanceComponent.prototype.closeModal = function () { this.logger.log('Modal closed.'); };
    SdlPremiseMaintenanceComponent.prototype.showSpinner = function () { this.isRequesting = true; };
    SdlPremiseMaintenanceComponent.prototype.hideSpinner = function () { this.isRequesting = false; };
    SdlPremiseMaintenanceComponent.prototype.window_onload = function () {
        this.utils.setTitle('Advantage Premise Maintenance');
        var PipelineAmendMode = this.riExchange.URLParameterContains('PipelineAmend');
        var PipelineAddMode = this.riExchange.URLParameterContains('PipelineAdd');
        this.riExchange.updateCtrl(this.controls, 'dlRecordType', 'value', this.riExchange.getParentHTMLValue('dlRecordType'));
        this.riExchange.updateCtrl(this.controls, 'dlExtRef', 'value', this.riExchange.getParentHTMLValue('dlExtRef'));
        this.riExchange.updateCtrl(this.controls, 'dlBatchRef', 'value', this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.riExchange.updateCtrl(this.controls, 'dlPremiseROWID', 'value', this.riExchange.getParentHTMLValue('dlPremiseROWID'));
        this.riExchange.updateCtrl(this.controls, 'dlContractRef', 'value', this.riExchange.getParentHTMLValue('dlContractRef'));
        this.riExchange.updateCtrl(this.controls, 'ContractTypeCode', 'value', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.riExchange.updateCtrl(this.controls, 'SubSystem', 'value', this.riExchange.getParentHTMLValue('SubSystem'));
        this.riExchange.updateCtrl(this.controls, 'QuoteTypeCode', 'value', this.riExchange.getParentHTMLValue('QuoteTypeCode'));
        this.riExchange.updateCtrl(this.controls, 'DisQuoteTypeCode', 'value', this.riExchange.getParentHTMLValue('DisQuoteTypeCode'));
        if (this.riExchange.getParentHTMLValue('DisQuoteTypeCode') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DisQuoteTypeCode', this.riExchange.getParentHTMLValue('QuoteTypeCode'));
        }
        if (!(this.pageParams.SCEnableHopewiserPAF || this.pageParams.SCEnableDatabasePAF)) {
            this.uiDisplay.cmdGetAddress = false;
        }
        this.riExchange.updateCtrl(this.controls, 'cmdGetAddress', 'disabled', true);
        this.AddHOptions();
        this.AddMOptions();
        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.CustomBusinessObject = 'iCABSdlPremiseMaintenance.p';
        this.riMaintenance.CustomBusinessObjectSelect = true;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = true;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = true;
        this.riMaintenance.FunctionAdd = false;
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionDelete = true;
        this.riMaintenance.FunctionSelect = false;
        this.riMaintenance.AddTable('dlPremise');
        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableKey('dlBatchRef', MntConst.eTypeTextFree, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('dlRecordType', MntConst.eTypeTextFree, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('dlExtRef', MntConst.eTypeTextFree, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKey('dlPremiseROWID', MntConst.eTypeTextFree, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableField('dlMasterExtRef', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('dlStatusCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('dlStatusDesc', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('dlRejectionCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('dlRejectionDesc', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('UpdateableInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('PremiseAddressLine1', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseAddressLine2', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        if (this.pageParams.SCAddressLine3Logical) {
            this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        }
        else {
            this.riMaintenance.AddTableField('PremiseAddressLine3', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('PremiseAddressLine4', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        if (this.pageParams.SCAddressLine5Logical) {
            this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        }
        else {
            this.riMaintenance.AddTableField('PremiseAddressLine5', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableField('PremiseContactEmail', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactFax', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactMobile', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseContactName', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactPosition', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseContactTelephone', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremiseName', MntConst.eTypeText, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PremisePostcode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('ContractTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateFixed, 'ReadOnly');
        this.riMaintenance.AddTableField('CustomerTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('ClientReference', MntConst.eTypeTextFree, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PurchaseOrderNo', MntConst.eTypeTextFree, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('POExpiryDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('POExpiryValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PremiseSpecialInstructions', MntConst.eTypeTextFree, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PNOL', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOLiCABSLevel', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PNOLSiteRef', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('AccountNumber', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('InvoiceGroupNumber', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('GPSCoordinateX', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('GPSCoordinateY', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('RoutingGeoNode', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('RoutingScore', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('RoutingSource', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ContractCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('JobCommenceDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('JobExpiryDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('WasteFeeInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'Optional');
        this.riMaintenance.AddTableField('BusinessCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'ReadOnly');
        this.riMaintenance.AddTableField('ContractName', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        var tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (var i = 0; i < tempObj.length; i++) {
            this.riMaintenance.AddTableField('WindowStarth' + tempObj[i], MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('WindowStartm' + tempObj[i], MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('WindowEndh' + tempObj[i], MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.riMaintenance.AddTableField('WindowEndm' + tempObj[i], MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }
        this.riMaintenance.AddTableCommit(this);
        this.riMaintenance.AddVirtualTable('CustomerTypeLanguage');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('CustomerTypeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('CustomerTypeDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);
        this.riMaintenance.AddVirtualTable('PestNetOnLineLevel');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('PNOLiCabsLevel', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('PNOLDescription', MntConst.eTypeTextFree, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') !== 'NEW' &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') !== '') {
            this.riMaintenance.AddVirtualTable('Account');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('AccountName', MntConst.eTypeTextFree, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
            this.riMaintenance.AddVirtualTable('InvoiceGroup');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableKey('InvoiceGroupNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('InvoiceGroupDesc', MntConst.eTypeTextFree, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this);
        }
        this.riMaintenance.Complete();
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseSalesEmployee', false);
        this.uiDisplay.trInvoiceGroupNumber = false;
        this.riMaintenance.RowID(this, 'dlPremise', this.riExchange.getParentAttributeValue('dlPremiseRowID'));
        this.riExchange.updateCtrl(this.controls, 'dlPremiseROWID', 'value', this.riExchange.getParentAttributeValue('dlPremiseRowID'));
        this.riMaintenance.FetchRecord();
        if ((this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === 'NEW' ||
            this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === '') &&
            this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber') !== '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', false);
            this.uiDisplay.trInvoiceGroupNumber = true;
        }
        if (this.pageParams.FieldDisableList.indexOf('DisableAddressLine3') > -1) {
            this.uiDisplay.trPremiseAddressLine3 = false;
        }
        else {
            this.uiDisplay.trPremiseAddressLine3 = true;
        }
        this.riExchange.updateCtrl(this.controls, 'PNOLDescription', 'disabled', true);
        this.dropDown.menu.push({ value: 'ServiceCover', label: 'Service Covers' });
        if (this.pageParams.SCEnablePNOLProcessingInSOP && this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode') === 'C') {
            this.dropDown.menu.push({ value: 'PNOLSetupCharge', label: 'PestNetOnline Setup Charge' });
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === 'AMD') {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                this.pageParams.AlreadyPnol = true;
                this.uiDisplay.trPNOLFlags1 = true;
                this.uiDisplay.trPNOLFlags2 = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', true);
                this.PNOL_OnClick();
            }
            else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', false);
            }
        }
        if (this.pageParams.SCEnableRouteOptimisation) {
            this.uiDisplay.trHR1 = true;
            this.uiDisplay.trHR2 = true;
            this.uiDisplay.trGPSRouting1 = true;
            this.uiDisplay.trGPSRouting2 = true;
            this.riExchange.updateCtrl(this.controls, 'SelRoutingSource', 'disabled', true);
        }
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.riMaintenance.execMode(MntConst.eModeUpdate, [this]);
    };
    SdlPremiseMaintenanceComponent.prototype.ViewOriginal_OnClick = function () {
        if (this.riExchange.riInputElement.checked(this.uiForm, 'ViewOriginal')) {
            this.riMaintenance.RowID(this, 'dlPremise', this.riExchange.riInputElement.GetValue(this.uiForm, 'InitialdlMasterExtRef'));
            this.riMaintenance.FetchRecord();
        }
        else {
            this.riMaintenance.RowID(this, 'dlPremise', this.riExchange.getParentAttributeValue('dlPremiseRowID'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'dlPremiseROWID', this.riExchange.getParentAttributeValue('dlPremiseRowID'));
            this.riMaintenance.FetchRecord();
        }
    };
    SdlPremiseMaintenanceComponent.prototype.riMaintenance_AfterFetch = function () {
        this.logger.log('riMaintenance_AfterFetch -----');
        if (!this.pageParams.storeInitialRefs) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'InitialdlMasterExtRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlMasterExtRef'));
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'InitialdlMasterExtRef') === '') {
                this.uiDisplay.tdViewOriginal = false;
            }
            else {
                this.uiDisplay.tdViewOriginal = true;
            }
            this.pageParams.storeinitialRefs = true;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlPremiseRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlExtRef'));
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractCommenceDate') === '') {
            this.pageParams.lUpdateContractCommenceDate = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractCommenceDate', false);
            this.uiDisplay.tdContractCommenceDateLabel = false;
            this.uiDisplay.tdContractCommenceDate = false;
        }
        else {
            this.pageParams.lUpdateContractCommenceDate = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractCommenceDate', true);
            this.uiDisplay.tdContractCommenceDateLabel = true;
            this.uiDisplay.tdContractCommenceDate = true;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'JobCommenceDate') === '') {
            this.pageParams.lUpdateJobCommenceDate = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobCommenceDate', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobExpiryDate', false);
            this.uiDisplay.tdJobCommenceDateLabel = false;
            this.uiDisplay.tdJobCommenceDate = false;
            this.uiDisplay.tdJobExpiryDateLabel = false;
            this.uiDisplay.tdJobExpiryDate = false;
        }
        else {
            this.pageParams.lUpdateJobCommenceDate = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobCommenceDate', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobExpiryDate', true);
            this.uiDisplay.tdJobCommenceDateLabel = true;
            this.uiDisplay.tdJobCommenceDate = true;
            this.uiDisplay.tdJobExpiryDateLabel = true;
            this.uiDisplay.tdJobExpiryDate = true;
        }
        this.attributes.dlPremiseRef = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlExtRef');
        this.BuildGrid();
        this.DisableTimeWindows();
        this.SetTimeWindows();
        if (!this.riExchange.riInputElement.checked(this.uiForm, 'UpdateableInd')) {
            this.riMaintenance.FunctionUpdate = false;
            this.riMaintenance.FunctionDelete = false;
            this.uiDisplay.CmdGenerateSRAText = false;
            this.uiDisplay.menu = false;
        }
        else {
            this.riMaintenance.FunctionUpdate = true;
            this.riMaintenance.FunctionDelete = true;
            this.uiDisplay.CmdGenerateSRAText = true;
            this.uiDisplay.menu = true;
        }
        if (this.pageParams.SCEnablePNOLProcessingInSOP) {
            this.uiDisplay.trPNOLFlags1 = true;
            if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', true);
                this.uiDisplay.trPNOLFlags2 = true;
            }
            else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', false);
                this.uiDisplay.trPNOLFlags2 = false;
            }
            this.PNOL_OnClick();
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'Routingsource') === '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelRoutingSource', '');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SelRoutingSource', this.riExchange.riInputElement.GetValue(this.uiForm, 'Routingsource'));
        }
    };
    SdlPremiseMaintenanceComponent.prototype.AddHOptions = function () {
        var hhObj = '00,01,02,03,04,05,06,07,08,09,10,11,12,13,14,15,16,17,18,19,20,21,22,23'.split(',');
        this.dropDown.tweh = [];
        this.dropDown.twsh = [];
        for (var i = 0; i < hhObj.length; i++) {
            this.dropDown.tweh.push({ value: hhObj[i], label: hhObj[i] });
            this.dropDown.twsh.push({ value: hhObj[i], label: hhObj[i] });
        }
    };
    SdlPremiseMaintenanceComponent.prototype.AddMOptions = function () {
        var mmObj = '00,15,30,45'.split(',');
        this.dropDown.twem = [];
        this.dropDown.twsm = [];
        for (var i = 0; i < mmObj.length; i++) {
            this.dropDown.twem.push({ value: mmObj[i], label: mmObj[i] });
            this.dropDown.twsm.push({ value: mmObj[i], label: mmObj[i] });
        }
    };
    SdlPremiseMaintenanceComponent.prototype.DisableTimeWindows = function () {
        var tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (var i = 0; i < tempObj.length; i++) {
            this.riMaintenance.DisableInput('twsh' + tempObj[i]);
            this.riMaintenance.DisableInput('twsm' + tempObj[i]);
            this.riMaintenance.DisableInput('tweh' + tempObj[i]);
            this.riMaintenance.DisableInput('twem' + tempObj[i]);
        }
    };
    SdlPremiseMaintenanceComponent.prototype.EnableTimeWindows = function () {
        var tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (var i = 0; i < tempObj.length; i++) {
            this.riMaintenance.EnableInput('twsh' + tempObj[i]);
            this.riMaintenance.EnableInput('twsm' + tempObj[i]);
            this.riMaintenance.EnableInput('tweh' + tempObj[i]);
            this.riMaintenance.EnableInput('twem' + tempObj[i]);
        }
    };
    SdlPremiseMaintenanceComponent.prototype.SetTimeWindows = function () {
        var tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (var i = 0; i < tempObj.length; i++) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'twsh' + tempObj[i], this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowStarth' + tempObj[i]));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'twsm' + tempObj[i], this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowStartm' + tempObj[i]));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'tweh' + tempObj[i], this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowEndh' + tempObj[i]));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'twem' + tempObj[i], this.riExchange.riInputElement.GetValue(this.uiForm, 'WindowEndm' + tempObj[i]));
        }
    };
    SdlPremiseMaintenanceComponent.prototype.CheckWindow = function () {
        this.logger.log('CheckWindow---');
        for (var i = 1; i <= 7; i++) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'twsh' + this.utils.numberPadding(i, 2)) === '00' &&
                this.riExchange.riInputElement.GetValue(this.uiForm, 'twsm' + this.utils.numberPadding(i, 2)) === '00' &&
                this.riExchange.riInputElement.GetValue(this.uiForm, 'tweh' + this.utils.numberPadding(i, 2)) === '00' &&
                this.riExchange.riInputElement.GetValue(this.uiForm, 'twem' + this.utils.numberPadding(i, 2)) === '00') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'twsh' + this.utils.numberPadding(i + 7, 2), '00');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'twsm' + this.utils.numberPadding(i + 7, 2), '00');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'tweh' + this.utils.numberPadding(i + 7, 2), '00');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'twem' + this.utils.numberPadding(i + 7, 2), '00');
            }
        }
    };
    SdlPremiseMaintenanceComponent.prototype.riMaintenance_BeforeUpdate = function () {
        this.riMaintenance.DisableInput('ViewOriginal');
        this.riMaintenance.EnableInput('cmdGetAddress');
        this.SetTimeWindows();
        this.EnableTimeWindows();
        this.PNOL_OnClick();
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractCommenceDate', this.pageParams.lUpdateContractCommenceDate);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobCommenceDate', this.pageParams.lUpdateJobCommenceDate);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobExpiryDate', this.pageParams.lUpdateJobCommenceDate);
        if (!this.pageParams.lUpdateContractCommenceDate) {
            this.riMaintenance.DisableInput('ContractCommenceDate');
        }
        else {
            this.riMaintenance.EnableInput('ContractCommenceDate');
        }
        if (!this.pageParams.lUpdateJobCommenceDate) {
            this.riMaintenance.DisableInput('JobCommenceDate');
            this.riMaintenance.DisableInput('JobExpiryDate');
        }
        else {
            this.riMaintenance.EnableInput('JobCommenceDate');
            this.riMaintenance.EnableInput('JobExpiryDate');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === 'AMD' ||
            this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === 'RED') {
            if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                this.riMaintenance.DisableInput('PNOL');
            }
        }
    };
    SdlPremiseMaintenanceComponent.prototype.riMaintenance_BeforeMode = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            this.riMaintenance.EnableInput('cmdGeocode');
        }
        else if (this.riMaintenance.CurrentMode === MntConst.eNormalMode) {
            this.riMaintenance.DisableInput('cmdGeocode');
        }
    };
    SdlPremiseMaintenanceComponent.prototype.riMaintenance_BeforeSave = function () {
        var tempObj = '01,02,03,04,05,06,07,08,09,10,11,12,13,14'.split(',');
        for (var i = 0; i < tempObj.length; i++) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowStarth' + tempObj[i], this.riExchange.riInputElement.GetValue(this.uiForm, 'twsh' + tempObj[i]));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowStartm' + tempObj[i], this.riExchange.riInputElement.GetValue(this.uiForm, 'twsm' + tempObj[i]));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowEndh' + tempObj[i], this.riExchange.riInputElement.GetValue(this.uiForm, 'tweh' + tempObj[i]));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WindowEndm' + tempObj[i], this.riExchange.riInputElement.GetValue(this.uiForm, 'twem' + tempObj[i]));
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientReference') !== '' ||
            this.riExchange.riInputElement.GetValue(this.uiForm, 'PurchaseOrderNo') !== '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientReference', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PurchaseOrderNo', false);
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'RoutingSource', this.riExchange.riInputElement.GetValue(this.uiForm, 'SelRoutingsource'));
        if (this.pageParams.SCEnableRouteOptimisation && this.riExchange.riInputElement.GetValue(this.uiForm, 'RoutingSource') === '') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSRoutingSearch.p';
            this.riMaintenance.PostDataAdd('Function', 'GetGeocodeAddress', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine1', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine1'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine2', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine2'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine3', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine3'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine4', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine4'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('AddressLine5', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseAddressLine5'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('Postcode', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('GPSX', this.riExchange.riInputElement.GetValue(this.uiForm, 'GPSCoordinateX'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('GPSY', this.riExchange.riInputElement.GetValue(this.uiForm, 'GPSCoordinateY'), MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('AddressError', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('GPSX', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('GPSY', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('Score', MntConst.eTypeText);
            this.riMaintenance.ReturnDataAdd('Node', MntConst.eTypeText);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA Callback A', data);
                if (data.errorMessage !== '') {
                    this.logger.log('Unable to Geocode Address');
                    this.showAlert(data.errorMessage);
                    this.riMaintenance.CancelEvent = true;
                }
                else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'RoutingGeonode', data['Node']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'RoutingScore', data['Score']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GPSCoordinateX', data['GPSX']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'GPSCoordinateY', data['GPSY']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SelRoutingSource', 'T');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Routingsource', 'T');
                }
            }, 'POST', 2);
        }
    };
    SdlPremiseMaintenanceComponent.prototype.riMaintenance_AfterSave = function () {
        var fields = "dlPremiseROWID, dlBatchRef, dlRecordType, dlExtRef, dlMasterExtRef, dlStatusCode, dlStatusDesc, dlRejectionCode, dlRejectionDesc,\n            UpdateableInd, PremiseAddressLine1, PremiseAddressLine2, PremiseAddressLine3, PremiseAddressLine4, PremiseAddressLine5, PremiseContactEmail,\n            PremiseContactFax, PremiseContactMobile, PremiseContactName, PremiseContactPosition, PremiseContactTelephone, PremiseName, PremisePostcode,\n            ContractTypeCode, CustomerTypeCode, ClientReference, PurchaseOrderNo, POExpiryDate, POExpiryValue, PremiseSpecialInstructions, PNOL,\n            PNOLiCABSLevel, PNOLSiteRef, AccountNumber, InvoiceGroupNumber, GPSCoordinateX, GPSCoordinateY, RoutingGeoNode, RoutingScore, RoutingSource,\n            ContractCommenceDate, JobCommenceDate, JobExpiryDate, WasteFeeInd, ContractName, WindowStarth01, WindowStartm01, WindowEndh01, WindowEndm01,\n            WindowStarth02, WindowStartm02, WindowEndh02, WindowEndm02, WindowStarth03, WindowStartm03, WindowEndh03, WindowEndm03, WindowStarth04,\n            WindowStartm04, WindowEndh04, WindowEndm04, WindowStarth05, WindowStartm05, WindowEndh05, WindowEndm05, WindowStarth06, WindowStartm06,\n            WindowEndh06, WindowEndm06, WindowStarth07, WindowStartm07, WindowEndh07, WindowEndm07, WindowStarth08, WindowStartm08, WindowEndh08,\n            WindowEndm08, WindowStarth09, WindowStartm09, WindowEndh09, WindowEndm09, WindowStarth10, WindowStartm10, WindowEndh10, WindowEndm10,\n            WindowStarth11, WindowStartm11, WindowEndh11, WindowEndm11, WindowStarth12, WindowStartm12, WindowEndh12, WindowEndm12, WindowStarth13,\n            WindowStartm13, WindowEndh13, WindowEndm13, WindowStarth14, WindowStartm14, WindowEndh14, WindowEndm14, SubSystem";
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        var fieldsArr = fields.split(',');
        this.riMaintenance.clear();
        for (var i = 0; i < fieldsArr.length; i++) {
            var id = fieldsArr[i];
            var dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            var value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                if (data.errorMessage.trim() !== '') {
                    this.logger.log('Post data Error', data);
                    this.showAlert(data.errorMessage);
                }
            }
            else {
                this.logger.log('Post data Saved', data);
                this.showAlert('Data Saved', 1);
                this.DisableTimeWindows();
                this.riMaintenance.EnableInput('ViewOriginal');
                this.riMaintenance.DisableInput('cmdGetAddress');
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === 'ADD' ||
                    this.pageParams.ParentMode === 'AddQuote') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'dlPremiseRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlExtRef'));
                    this.attributes.dlPremiseRef = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlExtRef');
                    this.navigate('AddQuote', InternalMaintenanceModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE);
                }
            }
        }, 'POST', 2);
    };
    SdlPremiseMaintenanceComponent.prototype.riMaintenance_AfterAbandon = function () {
        this.DisableTimeWindows();
        this.riMaintenance.EnableInput('ViewOriginal');
        this.riMaintenance.DisableInput('cmdGetAddress');
        this.SetTimeWindows();
    };
    SdlPremiseMaintenanceComponent.prototype.riMaintenance_BeforeDelete = function () {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'SubSystem=' + this.riExchange.riInputElement.GetValue(this.uiForm, 'SubSystem');
    };
    SdlPremiseMaintenanceComponent.prototype.riMaintenance_AfterDelete = function () {
        var fields = "dlPremiseROWID, dlBatchRef, dlRecordType, dlExtRef, SubSystem";
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        var fieldsArr = fields.split(',');
        this.riMaintenance.clear();
        for (var i = 0; i < fieldsArr.length; i++) {
            var id = fieldsArr[i];
            var dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            var value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                if (data.errorMessage.trim() !== '') {
                    this.logger.log('Post data Error', data);
                    this.showAlert(data.errorMessage);
                }
            }
            else {
                this.logger.log('Post data Saved', data);
                this.showAlert('Record Deleted', 1);
                this.riMaintenance.RequestWindowClose = true;
            }
        }, 'POST', 3);
    };
    SdlPremiseMaintenanceComponent.prototype.menu_onchange = function (menu) {
        this.logger.log('menu_onchange -- ', menu);
        switch (menu) {
            case 'ServiceCover':
                if (this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === '') {
                    this.navigate('SOPremise', 'grid/Sales/SOServiceCoverGrid');
                }
                else {
                    this.navigate('SOPremise', 'Sales/iCABSSPipelineServiceCoverGrid.htm');
                }
                break;
            case 'PNOLSetupCharge':
                if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL') && this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode') === 'C') {
                    if (this.riExchange.riInputElement.GetValue(this.uiForm, 'dlStatusCode') === 'P') {
                        this.navigate('SOPremiseView', 'Sales/iCABSSPNOLSetupChargeEntry.htm');
                    }
                    else {
                        this.navigate('SOPremise', 'Sales/iCABSSPNOLSetupChargeEntry.htm');
                    }
                }
                break;
        }
    };
    SdlPremiseMaintenanceComponent.prototype.JobCommenceDate_OnChange = function () {
        var ctrl = this.uiForm.controls;
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSdlPremiseMaintenance.p';
        this.riMaintenance.PostDataAdd('Function', 'CalcJobExpiryDate', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessCode'), MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('JobCommenceDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'JobCommenceDate'), MntConst.eTypeDate);
        this.riMaintenance.ReturnDataAdd('JobExpiryDate', MntConst.eTypeDate);
        this.riMaintenance.Execute(this, function (data) {
            this.logger.log('PDA Callback C', data);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'JobExpiryDate', data['JobExpiryDate']);
            this.riExchange.Request.BusinessObject = 'iCABSPremiseSRAGrid.p';
        });
    };
    SdlPremiseMaintenanceComponent.prototype.PremisePostcode_onfocusout = function () {
        if (this.pageParams.SCPostCodeRequired && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremisePostcode').trim() === '') {
            this.cmdGetAddress_onclick();
        }
    };
    SdlPremiseMaintenanceComponent.prototype.CmdGenerateSRAText_onClick = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'dlStatusCode') !== 'P') {
            this.riMaintenance.clear();
            this.riMaintenance.PostDataAdd('Function', 'GenerateSRAText', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('dlPremiseRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlPremise'), MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('PremiseSpecialInstructions', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseSpecialInstructions'), MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('PremiseSpecialInstructions', MntConst.eTypeTextFree);
            this.riMaintenance.Execute(this, function (data) {
                this.logger.log('PDA Callback D', data);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseSpecialInstructions', data['PremiseSpecialInstructions']);
            });
        }
    };
    SdlPremiseMaintenanceComponent.prototype.PNOL_OnClick = function () {
        if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate || this.riMaintenance.CurrentMode === MntConst.eModeSelect) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === 'AMD' ||
                this.riExchange.riInputElement.GetValue(this.uiForm, 'QuoteTypeCode') === 'RED') {
                if (this.pageParams.AlreadyPNOL) {
                    this.uiDisplay.trPNOLLevel = true;
                    this.uiDisplay.trPNOLDescription = true;
                    this.uiDisplay.trPNOLFlags2 = true;
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', true);
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLiCABSLevel', true);
                    this.riMaintenance.EnableInput('PNOLSiteRef');
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLSiteRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode') === 'J');
                }
                else {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLiCABSLevel', false);
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLSiteRef', false);
                    if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                        this.uiDisplay.trPNOLLevel = true;
                        this.uiDisplay.trPNOLDescription = true;
                        this.uiDisplay.trPNOLFlags2 = true;
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', true);
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLiCABSLevel', true);
                        this.riMaintenance.EnableInput('PNOLSiteRef');
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLSiteRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode') === 'J');
                    }
                    else {
                        this.uiDisplay.trPNOLLevel = false;
                        this.uiDisplay.trPNOLDescription = false;
                        this.uiDisplay.trPNOLFlags2 = false;
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLiCABSLevel', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLDescription', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLSiteRef', '');
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', false);
                    }
                }
            }
            else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLiCABSLevel', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLSiteRef', false);
                if (this.riExchange.riInputElement.checked(this.uiForm, 'PNOL')) {
                    this.uiDisplay.trPNOLLevel = true;
                    this.uiDisplay.trPNOLDescription = true;
                    this.uiDisplay.trPNOLFlags2 = true;
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', true);
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLiCABSLevel', true);
                    this.riMaintenance.EnableInput('PNOLSiteRef');
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PNOLSiteRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeCode') === 'J');
                }
                else {
                    this.uiDisplay.trPNOLLevel = false;
                    this.uiDisplay.trPNOLDescription = false;
                    this.uiDisplay.trPNOLFlags2 = false;
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLiCABSLevel', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLDescription', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLSiteRef', '');
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseContactEmail', false);
                }
            }
        }
    };
    SdlPremiseMaintenanceComponent.prototype.ClientReference_onfocusout = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientReference', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PurchaseOrderNo', true);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientReference').trim() !== '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PurchaseOrderNo', false);
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PurchaseOrderNo').trim() !== '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientReference', false);
        }
    };
    SdlPremiseMaintenanceComponent.prototype.PurchaseOrderNo_onfocusout = function () {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientReference', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PurchaseOrderNo', true);
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ClientReference').trim() !== '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PurchaseOrderNo', false);
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PurchaseOrderNo').trim() !== '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ClientReference', false);
        }
    };
    SdlPremiseMaintenanceComponent.prototype.PNOLSiteRef_OnKeyDown = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.InvoiceGroupNumber_onkeydown = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.CustomerTypeCode_onkeydown = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.PremiseSalesEmployee_onkeydown = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.PNOLiCABSLevel_onkeydown = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.cmdGeocode_OnClick = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.cmdGetAddress_onclick = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.riExchange_UpDateHTMLDocument = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.riExchange_UnLoadHTMLDocument = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.BuildGrid = function () {
        this.logger.log('GRID.....');
        this.Grid.clearGridData();
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('riGridMode', '0');
        search.set('dlPremiseRowID', this.riExchange.getParentHTMLValue('dlPremiseROWID'));
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('PageSize', '17');
        search.set('PageCurrent', this.page.toString());
        var gridIP = {
            method: this.xhrParams.method,
            operation: this.xhrParams.operation,
            module: this.xhrParams.module,
            search: search
        };
        this.Grid.loadGridData(gridIP);
    };
    SdlPremiseMaintenanceComponent.prototype.GridFocus = function (rsrcElement) {
    };
    SdlPremiseMaintenanceComponent.prototype.tbodySRAGrid_onDblclick = function () {
    };
    SdlPremiseMaintenanceComponent.prototype.refreshGrid = function () {
        this.logger.log('refreshGrid -- ');
    };
    SdlPremiseMaintenanceComponent.prototype.getCurrentPage = function (event) {
        this.logger.log('getCurrentPage -- ');
    };
    SdlPremiseMaintenanceComponent.prototype.getGridInfo = function () {
        this.logger.log('getGridInfo -- ');
    };
    SdlPremiseMaintenanceComponent.prototype.sortGrid = function (event) {
        this.logger.log('sortGrid -- ', event);
    };
    SdlPremiseMaintenanceComponent.prototype.onGridRowClick = function (event) {
        this.logger.log('onGridRowClick -- ', event);
    };
    SdlPremiseMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSdlPremiseMaintenance.html'
                },] },
    ];
    SdlPremiseMaintenanceComponent.ctorParameters = [
        { type: Injector, },
    ];
    SdlPremiseMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'Grid': [{ type: ViewChild, args: ['Grid',] },],
        'GridPagination': [{ type: ViewChild, args: ['GridPagination',] },],
    };
    return SdlPremiseMaintenanceComponent;
}(BaseComponent));
