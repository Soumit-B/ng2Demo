import { PremiseMaintenanceComponent } from './iCABSAPremiseMaintenance';
import { PremiseMaintenance1 } from './iCABSAPremiseMaintenance1';
import { PremiseMaintenance1a } from './iCABSAPremiseMaintenance1a';
import { PremiseMaintenance2 } from './iCABSAPremiseMaintenance2';
import { PremiseMaintenance3 } from './iCABSAPremiseMaintenance3';
import { PremiseMaintenance4 } from './iCABSAPremiseMaintenance4';

import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { RiExchange } from './../../../shared/services/riExchange';
import { Utils } from './../../../shared/services/utility';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { LookUp } from './../../../shared/services/lookup';

export class PremiseMaintenance0 {
    public sysCharConstants: SysCharConstants;

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
    private LookUp: LookUp;
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
        this.sysCharConstants = this.parent.sysCharConstants;
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

        this.doLookup();
        this.pgPM4.doLookup();
        this.getSysCharDetails();
    }

    public getSysCharDetails(): any {
        let sysCharList: number[] = [
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
            this.sysCharConstants.SystemCharDisableDefaultPestNetOnlineEffectiveDate, //Duplicate - Do not remove else update index
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
            this.sysCharConstants.SystemCharEnablePremiseLinking, //Duplicate - Do not remove else update index
            this.sysCharConstants.SystemCharEnableProductSaleCommenceDate,
            this.sysCharConstants.SystemCharEnableProofOfServiceRequired,
            this.sysCharConstants.SystemCharEnableProofOfServiceRequired, //Duplicate - Do not remove else update index
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
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.parent.utils.getBusinessCode(),
            countryCode: this.parent.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.parent.SpeedScript.sysCharPromise(sysCharIP).then((data) => {
            let records = data.records;
            this.logger.log('SYSCHAR', records);
            this.pageParams.vEnableMaximumAddressLength = records[0].Integer;
            this.pageParams.vMaximumAddressLength = records[0].Integer;
            this.pageParams.vSCEnableBarcodes = records[1].Required;
            this.pageParams.vSCRequireBarcodes = records[1].Logical;
            this.pageParams.vEnableLocations = records[2].Required;
            this.pageParams.vEnableDetailLocations = records[2].Logical;
            this.pageParams.vSCEnablePestNetOnline = records[3].Required;
            this.pageParams.vSCEnablePestNetOnlineDefaults = records[3].Logical;
            this.pageParams.vShowPremisesAdditionalTabLog = records[4].Logical;
            this.pageParams.vShowPremisesAdditionalTabReq = records[4].Required;
            this.pageParams.vShowPremisesAdditionalTabText = records[4].Text;
            this.pageParams.vSCEnableSignatures = records[5].Required;
            this.pageParams.vSCRequireSignatures = records[5].Logical;
            this.pageParams.vSICCodeEnable = records[6].Required;
            this.pageParams.vSICCodeRequire = records[6].Logical;
            this.pageParams.vSCAddressLine5Required = records[7].Required;
            this.pageParams.vSCAddressLine5Logical = records[7].Logical;
            this.pageParams.vEnableAddressLine3 = records[8].Required;
            this.pageParams.vSCAddressLine3Logical = records[8].Logical;
            this.pageParams.vSCAddressLine4Required = records[9].Required;
            this.pageParams.vDisablePNOLEffectDateDefaulting = records[10].Required;
            this.pageParams.vDisablePNOLEffectDateDefaulting = records[11].Required; //Duplicate - Do not remove else update index
            this.pageParams.vSCCapitalFirstLtr = records[12].Required;
            this.pageParams.vSCEnableAccountAddressMessage = records[13].Required;
            this.pageParams.vEnableAssociatedPremise = records[14].Required;
            this.pageParams.vSCEnableDatabasePAF = records[15].Required;
            this.pageParams.vEnableDiscountCode = records[16].Required;
            this.pageParams.vSCEnableDrivingCharges = records[17].Required;
            this.pageParams.vSCFixedServiceTimeRequired = records[18].Required;
            this.pageParams.vSCEnableHopewiserPAF = records[19].Required;
            this.pageParams.vEnableInstallsRemovals = records[20].Required;
            this.pageParams.vEnablePremiseLocInsert = records[21].Required;
            this.pageParams.vEnableMapGridReference = records[22].Required;
            this.pageParams.vSCEnableMarktSelect = records[23].Required;
            this.pageParams.vEnableNationalAccountWarning = records[24].Required;
            this.pageParams.vSCEnablePayTypeInvGroupLevel = records[25].Required;
            this.pageParams.glSCPORefsAtServiceCover = records[26].Required;
            this.pageParams.vEnablePostcodeDefaulting = records[27].Required;
            this.pageParams.vEnablePremiseLinking = records[28].Required;
            this.pageParams.vEnablePremiseLinking = records[29].Required; //Duplicate - Do not remove else update index
            this.pageParams.vEnableProductSaleCommenceDate = records[30].Required;
            this.pageParams.vSCProofOfServiceRequired = records[31].Required;
            this.pageParams.vSCProofOfServiceRequired = records[32].Required; //Duplicate - Do not remove else update index
            this.pageParams.vSCServiceReceiptRequired = records[33].Required;
            this.pageParams.vEnableRegulatoryAuthority = records[34].Required;
            this.pageParams.vEnableRetentionOfServiceWeekDay = records[35].Required;
            this.pageParams.vEnableRouteOptimisation = records[36].Required;
            this.pageParams.vSCEnableServiceBranchUpdate = records[37].Required;
            this.pageParams.vEnableServiceCoverDispLev = records[38].Required;
            this.pageParams.vSCServiceCoverUpdateViaGrid = records[39].Required;
            this.pageParams.vSCEnableValidatePostcodeSuburb = records[40].Required;
            this.pageParams.vEnableWED = records[41].Required;
            this.pageParams.vSCHidePostCode = records[42].Required;
            this.pageParams.vSCPostCodeMustExistInPAF = records[43].Required;
            this.pageParams.vSCPostCodeRequired = records[44].Required;
            this.pageParams.vSCRunPAFSearchOn1stAddressLine = records[45].Required;
            this.pageParams.vShowPremiseWasteTab = records[46].Required;
            this.pageParams.vShowWasteConsignmentNoteHistory = records[47].Required;
            this.pageParams.vSCEnableRepeatSalesMatching = records[48].Required;
            this.pageParams.vSCInfestationTolerances = records[49].Required;
            this.pageParams.vSCVisitTolerances = records[50].Required;
            this.pageParams.vVtxGeoCode = records[51].Required;

            if ((this.pageParams.vShowPremisesAdditionalTabText.split(',').length) > 1) {
                this.pageParams.vComment1 = this.pageParams.vShowPremisesAdditionalTabText.split(',')[0];
                this.pageParams.vComment2 = this.pageParams.vShowPremisesAdditionalTabText.split(',')[1];
            }
            else {
                this.pageParams.vComment1 = 'Comment 1';
                this.pageParams.vComment2 = 'Comment 2';
            }

            this.pageParams.lREGContactCentreReview = (this.pageParams.gcRegContactCentreReview === 'Y') ? true : false;
            this.pageParams.vbEnableValidatePostcodeSuburb = (this.pageParams.vSCEnableValidatePostcodeSuburb) ? true : false;
            this.pageParams.vbNextWCNoteNumberDefault = this.pageParams.vNextWCNoteNumberDefault;
            this.pageParams.SCHidePostCode = (this.pageParams.vSCHidePostCode) ? true : false;
            this.pageParams.lAllowUserAuthUpdate = (this.pageParams.glAllowUserAuthUpdate) ? true : false;
            this.pageParams.vbVtxGeoCode = (this.pageParams.vVtxGeoCode) ? true : false;
            this.pageParams.SCVisitTolerances = (this.pageParams.vSCVisitTolerances) ? true : false;
            this.pageParams.SCInfestationTolerances = (this.pageParams.vSCInfestationTolerances) ? true : false;
            this.pageParams.SCEnableRepeatSalesMatching = (this.pageParams.vSCEnableRepeatSalesMatching) ? true : false;
            this.pageParams.lPremiseMatchedDone = false;

            this.pgPM1.window_onload();
            this.pgPM2.window_onload();
        });
    }

    private doLookup(): any {
        let lookupIP = [
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
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let records = data[0];
            this.pageParams.vCustomerIndicationNumber = '';
            if (records.length > 0) {
                this.parent.dropDown.CustomerIndicationNumber = [];
                for (let i = 0; i < records.length; i++) {
                    this.pageParams.vCustomerIndicationNumber += '<option value="' + records[i].CustomerIndicationNumber + '">' + records[i].CustomerIndicationDesc + '</option>';
                    this.parent.dropDown.CustomerIndicationNumber.push({ value: records[i].CustomerIndicationNumber, label: records[i].CustomerIndicationDesc });
                }
            }

            records = data[1];
            this.pageParams.gcRegContactCentreReview = false;
            if (records.length > 0) {
                this.pageParams.gcRegContactCentreReview = true;
            }

            records = data[2];
            this.pageParams.vNextWCNoteNumberDefault = 1;
            if (records.length > 0) {
                this.pageParams.vNextWCNoteNumberDefault = records[0]['RegValue'];
            }

            records = data[3];
            if (records.length > 0) {
                if (records[0].ttriRegistry) this.pageParams.vSCMultiContactInd = true;
                else this.pageParams.vSCMultiContactInd = false;
            }

            records = data[4];
            if (records.length > 0) {
                this.pageParams.glCIEnabled = true;
            } else {
                this.pageParams.glCIEnabled = false;
            }
            this.pageParams.boolCIEnabled = this.pageParams.glCIEnabled;
        });

        //Not Required
        this.pageParams.glEnableGlobalSiteRiskAssessment = false;

        this.LookUp.i_GetBusinessRegistryValue(this.parent.utils.getBusinessCode(), 'European Biocide Regime', 'Enable_RMM', new Date())
            .then((data: any): any => {
                this.pageParams.vRegEnableRMM = (data.toString().toLowerCase() === 'true') ? true : false;
                this.pageParams.vEnableRMM = this.pageParams.vRegEnableRMM;
            });
    }

}
