export var PremiseMaintenance0 = (function () {
    function PremiseMaintenance0(parent) {
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
        this.sysCharConstants = this.parent.sysCharConstants;
        this.riExchange = this.parent.riExchange;
        this.riMaintenance = this.parent.riMaintenance;
        this.riTab = this.parent.riTab;
    }
    PremiseMaintenance0.prototype.killSubscription = function () { };
    PremiseMaintenance0.prototype.window_onload = function () {
        this.pgPM0 = this.parent.pgPM0;
        this.pgPM1 = this.parent.pgPM1;
        this.pgPM1a = this.parent.pgPM1a;
        this.pgPM2 = this.parent.pgPM2;
        this.pgPM3 = this.parent.pgPM3;
        this.pgPM4 = this.parent.pgPM4;
        this.doLookup();
        this.pgPM4.doLookup();
        this.getSysCharDetails();
    };
    PremiseMaintenance0.prototype.getSysCharDetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharMaximumAddressLength,
            this.sysCharConstants.SystemCharEnableBarcodes,
            this.sysCharConstants.SystemCharEnableLocations,
            this.sysCharConstants.SystemCharEnablePestNetOnlineProcessing,
            this.sysCharConstants.SystemCharEnablePremisesAdditionalComment,
            this.sysCharConstants.SystemCharEnableSignatures,
            this.sysCharConstants.SystemCharShowSICCodeOnPremise,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharAddressLine4Required,
            this.sysCharConstants.SystemCharDisableDefaultPestNetOnlineEffectiveDate,
            this.sysCharConstants.SystemCharDisableDefaultPestNetOnlineEffectiveDate,
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact,
            this.sysCharConstants.SystemCharEnableAccountAddressMessage,
            this.sysCharConstants.SystemCharEnableAssociatedPremise,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharEnableDiscountCode,
            this.sysCharConstants.SystemCharEnableDrivingCharges,
            this.sysCharConstants.SystemCharEnableFixedServiceTime,
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableLocations2,
            this.sysCharConstants.SystemCharEnableMapGridReference,
            this.sysCharConstants.SystemCharEnableMarktSelect,
            this.sysCharConstants.SystemCharEnableNationalAccountWarning,
            this.sysCharConstants.SystemCharEnablePayTypeAtInvoiceGroupLevel,
            this.sysCharConstants.SystemCharEnablePORefsAtServiceCoverLevel,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnablePremiseLinking,
            this.sysCharConstants.SystemCharEnablePremiseLinking,
            this.sysCharConstants.SystemCharEnableProductSaleCommenceDate,
            this.sysCharConstants.SystemCharEnableProofOfServiceRequired,
            this.sysCharConstants.SystemCharEnableProofOfServiceRequired,
            this.sysCharConstants.SystemCharEnableReceiptRequired,
            this.sysCharConstants.SystemCharEnableRegulatoryAuthority,
            this.sysCharConstants.SystemCharEnableRetentionOfServiceWeekday,
            this.sysCharConstants.SystemCharEnableRouteOptimisationSoftwareIntegration,
            this.sysCharConstants.SystemCharEnableServiceBranchUpdate,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel,
            this.sysCharConstants.SystemCharEnableServiceCoverUpdateViaGrid,
            this.sysCharConstants.SystemCharEnableValidatePostcodeSuburb,
            this.sysCharConstants.SystemCharEnableWED,
            this.sysCharConstants.SystemCharHidePostcode,
            this.sysCharConstants.SystemCharPostCodeMustExistinPAF,
            this.sysCharConstants.SystemCharPostCodeRequired,
            this.sysCharConstants.SystemCharRunPAFSearchOnFirstAddressLine,
            this.sysCharConstants.SystemCharShowPremiseWasteTab,
            this.sysCharConstants.SystemCharShowWasteConsignmentNoteHistory,
            this.sysCharConstants.SystemCharEnableiCABSRepeatSalesMatching,
            this.sysCharConstants.SystemCharUseInfestationTolerances,
            this.sysCharConstants.SystemCharUseVisitTolerances,
            this.sysCharConstants.SystemCharVertexEnabled
        ];
        var sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.parent.utils.getBusinessCode(),
            countryCode: this.parent.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.parent.SpeedScript.sysCharPromise(sysCharIP).then(function (data) {
            var records = data.records;
            _this.logger.log('SYSCHAR', records);
            _this.pageParams.vEnableMaximumAddressLength = records[0].Integer;
            _this.pageParams.vMaximumAddressLength = records[0].Integer;
            _this.pageParams.vSCEnableBarcodes = records[1].Required;
            _this.pageParams.vSCRequireBarcodes = records[1].Logical;
            _this.pageParams.vEnableLocations = records[2].Required;
            _this.pageParams.vEnableDetailLocations = records[2].Logical;
            _this.pageParams.vSCEnablePestNetOnline = records[3].Required;
            _this.pageParams.vSCEnablePestNetOnlineDefaults = records[3].Logical;
            _this.pageParams.vShowPremisesAdditionalTabLog = records[4].Logical;
            _this.pageParams.vShowPremisesAdditionalTabReq = records[4].Required;
            _this.pageParams.vShowPremisesAdditionalTabText = records[4].Text;
            _this.pageParams.vSCEnableSignatures = records[5].Required;
            _this.pageParams.vSCRequireSignatures = records[5].Logical;
            _this.pageParams.vSICCodeEnable = records[6].Required;
            _this.pageParams.vSICCodeRequire = records[6].Logical;
            _this.pageParams.vSCAddressLine5Required = records[7].Required;
            _this.pageParams.vSCAddressLine5Logical = records[7].Logical;
            _this.pageParams.vEnableAddressLine3 = records[8].Required;
            _this.pageParams.vSCAddressLine3Logical = records[8].Logical;
            _this.pageParams.vSCAddressLine4Required = records[9].Required;
            _this.pageParams.vDisablePNOLEffectDateDefaulting = records[10].Required;
            _this.pageParams.vDisablePNOLEffectDateDefaulting = records[11].Required;
            _this.pageParams.vSCCapitalFirstLtr = records[12].Required;
            _this.pageParams.vSCEnableAccountAddressMessage = records[13].Required;
            _this.pageParams.vEnableAssociatedPremise = records[14].Required;
            _this.pageParams.vSCEnableDatabasePAF = records[15].Required;
            _this.pageParams.vEnableDiscountCode = records[16].Required;
            _this.pageParams.vSCEnableDrivingCharges = records[17].Required;
            _this.pageParams.vSCFixedServiceTimeRequired = records[18].Required;
            _this.pageParams.vSCEnableHopewiserPAF = records[19].Required;
            _this.pageParams.vEnableInstallsRemovals = records[20].Required;
            _this.pageParams.vEnablePremiseLocInsert = records[21].Required;
            _this.pageParams.vEnableMapGridReference = records[22].Required;
            _this.pageParams.vSCEnableMarktSelect = records[23].Required;
            _this.pageParams.vEnableNationalAccountWarning = records[24].Required;
            _this.pageParams.vSCEnablePayTypeInvGroupLevel = records[25].Required;
            _this.pageParams.glSCPORefsAtServiceCover = records[26].Required;
            _this.pageParams.vEnablePostcodeDefaulting = records[27].Required;
            _this.pageParams.vEnablePremiseLinking = records[28].Required;
            _this.pageParams.vEnablePremiseLinking = records[29].Required;
            _this.pageParams.vEnableProductSaleCommenceDate = records[30].Required;
            _this.pageParams.vSCProofOfServiceRequired = records[31].Required;
            _this.pageParams.vSCProofOfServiceRequired = records[32].Required;
            _this.pageParams.vSCServiceReceiptRequired = records[33].Required;
            _this.pageParams.vEnableRegulatoryAuthority = records[34].Required;
            _this.pageParams.vEnableRetentionOfServiceWeekDay = records[35].Required;
            _this.pageParams.vEnableRouteOptimisation = records[36].Required;
            _this.pageParams.vSCEnableServiceBranchUpdate = records[37].Required;
            _this.pageParams.vEnableServiceCoverDispLev = records[38].Required;
            _this.pageParams.vSCServiceCoverUpdateViaGrid = records[39].Required;
            _this.pageParams.vSCEnableValidatePostcodeSuburb = records[40].Required;
            _this.pageParams.vEnableWED = records[41].Required;
            _this.pageParams.vSCHidePostCode = records[42].Required;
            _this.pageParams.vSCPostCodeMustExistInPAF = records[43].Required;
            _this.pageParams.vSCPostCodeRequired = records[44].Required;
            _this.pageParams.vSCRunPAFSearchOn1stAddressLine = records[45].Required;
            _this.pageParams.vShowPremiseWasteTab = records[46].Required;
            _this.pageParams.vShowWasteConsignmentNoteHistory = records[47].Required;
            _this.pageParams.vSCEnableRepeatSalesMatching = records[48].Required;
            _this.pageParams.vSCInfestationTolerances = records[49].Required;
            _this.pageParams.vSCVisitTolerances = records[50].Required;
            _this.pageParams.vVtxGeoCode = records[51].Required;
            if ((_this.pageParams.vShowPremisesAdditionalTabText.split(',').length) > 1) {
                _this.pageParams.vComment1 = _this.pageParams.vShowPremisesAdditionalTabText.split(',')[0];
                _this.pageParams.vComment2 = _this.pageParams.vShowPremisesAdditionalTabText.split(',')[1];
            }
            else {
                _this.pageParams.vComment1 = 'Comment 1';
                _this.pageParams.vComment2 = 'Comment 2';
            }
            _this.pageParams.lREGContactCentreReview = (_this.pageParams.gcRegContactCentreReview === 'Y') ? true : false;
            _this.pageParams.vbEnableValidatePostcodeSuburb = (_this.pageParams.vSCEnableValidatePostcodeSuburb) ? true : false;
            _this.pageParams.vbNextWCNoteNumberDefault = _this.pageParams.vNextWCNoteNumberDefault;
            _this.pageParams.SCHidePostCode = (_this.pageParams.vSCHidePostCode) ? true : false;
            _this.pageParams.lAllowUserAuthUpdate = (_this.pageParams.glAllowUserAuthUpdate) ? true : false;
            _this.pageParams.vbVtxGeoCode = (_this.pageParams.vVtxGeoCode) ? true : false;
            _this.pageParams.SCVisitTolerances = (_this.pageParams.vSCVisitTolerances) ? true : false;
            _this.pageParams.SCInfestationTolerances = (_this.pageParams.vSCInfestationTolerances) ? true : false;
            _this.pageParams.SCEnableRepeatSalesMatching = (_this.pageParams.vSCEnableRepeatSalesMatching) ? true : false;
            _this.pageParams.lPremiseMatchedDone = false;
            _this.pgPM1.window_onload();
            _this.pgPM2.window_onload();
        });
    };
    PremiseMaintenance0.prototype.doLookup = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'CustomerIndication',
                'query': { 'BusinessCode': this.parent.utils.getBusinessCode() },
                'fields': ['CustomerIndicationNumber', 'CustomerIndicationDesc']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': 'Contact Centre Review', 'RegKey': this.parent.utils.getBusinessCode() + '_System Default Review From Drill Option' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': 'Waste Consignment Note', 'RegKey': this.parent.utils.getBusinessCode() + '_Next Waste Consignment Note Number Default' },
                'fields': ['RegValue']
            },
            {
                'table': 'riRegistry',
                'query': { 'RegSection': 'Contact Person' },
                'fields': ['']
            },
            {
                'table': 'CIParams',
                'query': { 'BusinessCode': this.parent.utils.getBusinessCode(), 'CIEnabled': 'TRUE' },
                'fields': ['CIEnabled']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then(function (data) {
            var records = data[0];
            _this.pageParams.vCustomerIndicationNumber = '';
            if (records.length > 0) {
                _this.parent.dropDown.CustomerIndicationNumber = [];
                for (var i = 0; i < records.length; i++) {
                    _this.pageParams.vCustomerIndicationNumber += '<option value="' + records[i].CustomerIndicationNumber + '">' + records[i].CustomerIndicationDesc + '</option>';
                    _this.parent.dropDown.CustomerIndicationNumber.push({ value: records[i].CustomerIndicationNumber, label: records[i].CustomerIndicationDesc });
                }
            }
            records = data[1];
            _this.pageParams.gcRegContactCentreReview = false;
            if (records.length > 0) {
                _this.pageParams.gcRegContactCentreReview = true;
            }
            records = data[2];
            _this.pageParams.vNextWCNoteNumberDefault = 1;
            if (records.length > 0) {
                _this.pageParams.vNextWCNoteNumberDefault = records[0]['RegValue'];
            }
            records = data[3];
            if (records.length > 0) {
                if (records[0].ttriRegistry)
                    _this.pageParams.vSCMultiContactInd = true;
                else
                    _this.pageParams.vSCMultiContactInd = false;
            }
            records = data[4];
            if (records.length > 0) {
                _this.pageParams.glCIEnabled = true;
            }
            else {
                _this.pageParams.glCIEnabled = false;
            }
            _this.pageParams.boolCIEnabled = _this.pageParams.glCIEnabled;
        });
        this.pageParams.glEnableGlobalSiteRiskAssessment = false;
        this.LookUp.i_GetBusinessRegistryValue(this.parent.utils.getBusinessCode(), 'European Biocide Regime', 'Enable_RMM', new Date())
            .then(function (data) {
            _this.pageParams.vRegEnableRMM = (data.toString().toLowerCase() === 'true') ? true : false;
            _this.pageParams.vEnableRMM = _this.pageParams.vRegEnableRMM;
        });
    };
    return PremiseMaintenance0;
}());
