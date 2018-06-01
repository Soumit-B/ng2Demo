import { OnInit, OnDestroy, Component, Injector, ViewChild, AfterViewInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { PostCodeSearchComponent } from './../../internal/search/iCABSBPostcodeSearch.component';
import { AUPostcodeSearchComponent } from './../../internal/grid-search/iCABSAAUPostcodeSearch';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { InternalMaintenanceServiceModuleRoutes, AppModuleRoutes, ProspectToContractModuleRoutes, InternalSearchModuleRoutes } from './../../base/PageRoutes';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSCMCallCentreGridNewContact.html'
})

export class CallCentreGridNewContactComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    //Template Selection Attribute
    @ViewChild('ContactTypeDetailCodeSelect') private ContactTypeDetailCodeSelect: DropdownStaticComponent;
    @ViewChild('ContactTypeCodeSelect') private ContactTypeCodeSelect: DropdownStaticComponent;
    @ViewChild('CallContactName') private CallContactName;
    @ViewChild('CallContactTelephone') private CallContactTelephone;
    @ViewChild('CallContactMobile') private CallContactMobile;
    @ViewChild('CallContactFax') private CallContactFax;
    @ViewChild('CallContactEmail') private CallContactEmail;
    @ViewChild('ellipsisContractNumber') public ellipsisContractNumber: EllipsisComponent;
    @ViewChild('ellipsisPremiseNumber') public ellipsisPremiseNumber: EllipsisComponent;
    @ViewChild('ellipsisProductCode') public ellipsisProductCode: EllipsisComponent;
    @ViewChild('getAddressEllipsis') public getAddressEllipsis: EllipsisComponent;
    @ViewChild('aupPostcodeSearchEllipsis') public aupPostcodeSearchEllipsis: EllipsisComponent;
    /**
     * Private Variables
     */
    //Subscription Variables
    private latestProspectDetails: Subscription;
    private validateContactType: Subscription;
    private updateCallLog: Subscription;
    private checkFixedPriceJobPostcode: Subscription;
    private getPremiseContactDetails: Subscription;
    private getContactTypeDetailDescription: Subscription;
    private getContactTypeDetailCodes: Subscription;
    private sysCharSubscription: Subscription;
    //Page Level Variables
    private lClearAccount: string;
    private isCmdContacts: boolean = false;
    private isLValidatePageOk: boolean;
    private isLGoNewWindow: boolean;
    private isLShowingAddressInfo: any;
    //Speed Script Variables
    private gcBusinessCode: string;
    private cContactMediumCode: string;
    private cContactMediumDesc: string;
    private cContractTypeCode: string;
    private cAccountNumber: string;
    private cContractNumber: string;
    private cPremiseNumber: string;
    private cProductCode: string;
    private cProspectNumber: string;
    private cDefaultResiContactTypeDetailCode: any;
    private isLSelectContactTypeWhenNew: boolean;
    private isLTypeIsValid: boolean = true;
    private isLSCCapitalFirstLtr: boolean = false;
    private isLSCEnableAddressLine3: boolean;
    private isLSCAddressLine3Logical: boolean;
    private isLSCAddressLine4Required: boolean;
    private isLSCAddressLine5Required: boolean;
    private isLSCAddressLine5Logical: boolean;
    private isLSCEnableHopewiserPAF: boolean;
    private isLSCEnableDatabasePAF: boolean;
    private cDefaultContactPosition: string;
    private isLAccountIsPublic: boolean;
    private isGlMultiContactInd: boolean;
    private isLDisputedInvoicesInUse: boolean;
    private isGlDisputedInvoicesInUse: boolean;
    //Lookup Table Variables
    private userAuthorityTable: Array<any> = [];
    private contactTypeTable: Array<any> = [];
    private contactTypeDetailTable: Array<any> = [];
    private contactTypeLang: Array<any> = [];
    private riRegistry: any;
    //API Variables
    private queryParams = {
        method: 'ccm/grid',
        module: 'call-centre',
        operation: 'ContactManagement/iCABSCMCallCentreGridNewContact'
    };

    /**
     * Public Variables
     */
    //Page Level Variables
    public pageId: string;
    public pageTitle: string;
    public isShowMessageHeader: boolean = true;
    public isShowErrorHeader: boolean = true;
    public cmdClearAcct: string = MessageConstant.PageSpecificMessage.cmdClearAcct;
    public cmdCreate: string = MessageConstant.PageSpecificMessage.cmdCreateNew;
    public cmdContactAcct: string = MessageConstant.PageSpecificMessage.cmdContactAcct;
    public contactTypeDetailCodeSelectList: any = [];
    public ttContactType: Array<any> = [];
    public fieldHidden: any = {
        cmdGetAddress: true,
        cmdClearAcct: true,
        tdCurrentCallLogIDLabel: true,
        tdCurrentCallLogID: true,
        cmdContacts: false,
        tdDisputedInvoices: true,
        tdSelectedTicketNumberLabel: false,
        tdSelectedTicketNumber: false,
        tdCmdContactTicket: false,
        tdContactLabelStandard: true,
        tdContactLabelNew: false,
        tdContactLabelFromTicket: false,
        tdcmdSelectContract: false,
        tdcmdSelectPremise: false,
        tdcmdSelectProduct: false,
        tdcmdContactPrem: false,
        tdcmdContactAcct: false,
        isFirstLetterCapital: false,
        trTransactionDetails: false,
        trTransactionContractNumber: false,
        trTransactionPremiseNumber: false,
        trTransactionProductCode: false,
        trContractSeperatorBottom: false,
        trCallAddressName: false,
        trCallAddressLine1: false,
        trCallAddressLine2: false,
        trCallAddressLine3: false,
        tdcmdContactTicket: false,
        getAddressEllipsis: true,
        aupPostcodeSearchEllipsis: true,
        notificationCloseTypeSelect: false //As discussed with Samik This field will remain hidden
    };
    public fieldDisable: any = {
        cmdGetAddress: false
    };
    public mandatoryShow: any = {
        CallContactEmail: true,
        CallContactMobile: true,
        CallAddressName: false,
        CallAddressLine1: false,
        CallAddressLine2: false,
        CallAddressLine3: false,
        CallAddressLine4: false,
        CallAddressLine5: false,
        CallContactPostCode: false,
        ContractNumber: false,
        PremiseNumber: false,
        ProductCode: false
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    //Form Variables
    public controls: any[] = [
        { name: 'AccountNumber', disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'AccountProspectName', disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'SelectedTicketNumber', disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'CurrentCallLogID', disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'ContractNumber', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'ContractName', disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'PremiseNumber', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'PremiseName', disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'ProductCode', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'ProductDesc', disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'CallContactName', disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'CallContactPosition', disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'CallContactTelephone', disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'CallContactMobile', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'CallContactFax', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'CallContactEmail', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'CallAddressName', disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'CallTicketReference', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'CallAddressLine1', disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'CallAddressLine2', disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'CallAddressLine3', disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'CallAddressLine4', disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'CallAddressLine5', disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'CallContactPostcode', disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'NotificationCloseTypeSelect', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'ContactTypeCodeSelect', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'ContactTypeDetailCodeSelect', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'CallNotepadSummary', disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'CallNotepad', disabled: false, required: false, type: MntConst.eTypeTextFree },
        //Hidden Form Fields
        { name: 'VisibleCurrentCallLogID' },
        { name: 'OldPremiseNumber' },
        { name: 'WindowClosingName' },
        { name: 'ProspectNumber' },
        { name: 'TicketProspectNumber' },
        { name: 'ContractType' },
        { name: 'ClosedWithChanges' },
        { name: 'ContactTypeCode' },
        { name: 'ContactTypeDetailCode' },
        { name: 'SelectionCriteria' },
        { name: 'URL' },
        { name: 'URLMode' },
        { name: 'BusinessOriginCode' },
        { name: 'BusinessOriginDesc' },
        { name: 'ContactMediumCode' },
        { name: 'ContactMediumDesc' },
        { name: 'ProspectSourceCode' },
        { name: 'ProspectTypeCode' },
        { name: 'ServiceCoverNumber' },
        { name: 'ServiceCoverRowID' },
        { name: 'AccountName' },
        { name: 'AccountAddressLine1' },
        { name: 'AccountAddressLine2' },
        { name: 'AccountAddressLine3' },
        { name: 'AccountAddressLine4' },
        { name: 'AccountAddressLine5' },
        { name: 'AccountPostcode' },
        { name: 'AccountContactName' },
        { name: 'AccountContactPosition' },
        { name: 'AccountContactTelephone' },
        { name: 'AccountContactMobile' },
        { name: 'AccountContactFax' },
        { name: 'AccountContactEmail' },
        { name: 'SaveAccountNumber' },
        { name: 'SaveAccountName' },
        { name: 'SaveAccountProspectName' },
        { name: 'SaveAccountAddressLine1' },
        { name: 'SaveAccountAddressLine2' },
        { name: 'SaveAccountAddressLine3' },
        { name: 'SaveAccountAddressLine4' },
        { name: 'SaveAccountAddressLine5' },
        { name: 'SaveAccountPostcode' },
        { name: 'SaveAccountContactName' },
        { name: 'SaveAccountContactPosition' },
        { name: 'SaveAccountContactTelephone' },
        { name: 'SaveAccountContactMobile' },
        { name: 'SaveAccountContactFax' },
        { name: 'SaveAccountContactEmail' },
        { name: 'SaveContractNumber' },
        { name: 'SaveContractName' },
        { name: 'SavePremiseNumber' },
        { name: 'SavePremiseName' },
        { name: 'SaveProductCode' },
        { name: 'SaveProductDesc' },
        { name: 'SaveServiceCoverNumber' },
        { name: 'SaveServiceCoverRowID' },
        { name: 'SaveCallContactName' },
        { name: 'SaveCallContactPosition' },
        { name: 'SaveCallContactTelephone' },
        { name: 'SaveCallContactMobile' },
        { name: 'SaveCallContactEmail' },
        { name: 'SaveCallContactFax' },
        { name: 'AccountRequiredList' },
        { name: 'ContractRequiredList' },
        { name: 'PremiseRequiredList' },
        { name: 'ProductRequiredList' },
        { name: 'PostcodeRequiredList' },
        { name: 'PremiseContactName' },
        { name: 'PremiseContactPosition' },
        { name: 'PremiseContactTelephone' },
        { name: 'PremiseContactFax' },
        { name: 'PremiseContactMobile' },
        { name: 'PremiseContactEmail' },
        { name: 'PremisePostcode' },
        { name: 'CallNotepadText' },
        { name: 'NotificationCloseType' },
        { name: 'ResidentialTeamInd' },
        { name: 'ResiContactTypeCode' },
        { name: 'ResiContactTypeDetailCode' },
        { name: 'SelectedPostcode' },
        { name: 'SelectedAddressLine4' },
        { name: 'SelectedAddressLine5' },
        { name: 'SaveCallAddressName' },
        { name: 'SaveCallAddressLine1' },
        { name: 'SaveCallAddressLine2' },
        { name: 'SaveCallAddressLine3' },
        { name: 'SaveCallAddressLine4' },
        { name: 'SaveCallAddressLine5' },
        { name: 'SaveCallContactPostcode' },
        { name: 'SaveCallTicketReference' },
        { name: 'SaveSelectedTicketNumber' },
        { name: 'DisputedInvoiceCacheTime' },
        { name: 'DisputedInvoiceCacheName' },
        { name: 'CreateCallLogInCCMInd' }
    ];
    //Ellipsis Variables
    public ellipsisConfig: any = {
        contract: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'CallCentreSearch',
                'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'showAddNew': false,
                'currentContractType': this.riExchange.getCurrentContractType()
            },
            component: ContractSearchComponent
        },
        premise: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'CallCentreSearch',
                'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'ContractNumber': '',
                'ContractName': '',
                'showAddNew': false,
                'currentContractType': this.riExchange.getCurrentContractType()
            },
            component: PremiseSearchComponent
        },
        product: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'CallCentreSearch',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'currentContractType': this.riExchange.getCurrentContractType()
            },
            component: ServiceCoverSearchComponent
        },
        getAddressEllipsis: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'ContactCentreNewContact',
                'PremisePostCode': '',
                'PremiseAddressLine5': '',
                'PremiseAddressLine4': ''
            },
            component: PostCodeSearchComponent
        },
        aupPostcodeSearchEllipsis: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'ContactCentreNewContact',
                'postCode': '',
                'state': '',
                'town': ''
            },
            component: AUPostcodeSearchComponent
        }
    };
    /**
     * Class Constructor With Dependency Injections
     */
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLCENTREGRIDNEWCONTACT;
        this.pageTitle = this.browserTitle = 'Contact Centre - Create New/Amend Current Log';
    }
    /**
     * On Init Life Cycle Hook Inittate Funcationality
     */
    ngOnInit(): void {
        super.ngOnInit();
        this.triggerFetchSysChar();
        this.getRegistrySetting();
        this.pageLoadLookUp();
        this.windowOnLoad();
    }
    /**
     * On Destroy Life Cycle Hook To Unsubscribe Subscription
     */
    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.latestProspectDetails) {
            this.latestProspectDetails.unsubscribe();
        }
        if (this.validateContactType) {
            this.validateContactType.unsubscribe();
        }
        if (this.updateCallLog) {
            this.updateCallLog.unsubscribe();
        }
        if (this.checkFixedPriceJobPostcode) {
            this.checkFixedPriceJobPostcode.unsubscribe();
        }
        if (this.getPremiseContactDetails) {
            this.getPremiseContactDetails.unsubscribe();
        }
        if (this.getContactTypeDetailDescription) {
            this.getContactTypeDetailDescription.unsubscribe();
        }
        if (this.getContactTypeDetailCodes) {
            this.getContactTypeDetailCodes.unsubscribe();
        }
        if (this.sysCharSubscription) {
            this.sysCharSubscription.unsubscribe();
        }
    }
    /**
     * After View Initialize Life Cycle Hook To Do After Page Load Operations
     */
    ngAfterViewInit(): void {
        //Focus On Contact Field After Window Load
        this.CallContactName.nativeElement.focus();
    }
    /**
     * Method to do Operations After Window Load
     * @params: params: void
     * @return: : void
     */
    private windowOnLoad(): void {
        /**
         * @Note: Condition to Hide Get Address Button Has Been Added in 'onSysCharDataReceive' Function
         */
        //Set DisputedInvoiceCacheTime Field Value
        this.setControlValue('DisputedInvoiceCacheTime', this.utils.Time());
        //Condition to Hide Log Ref Field
        this.riExchange.getParentHTMLValue('CreateCallLogInCCMInd');
        if (this.getControlValue('CreateCallLogInCCMInd') === 'N') {
            this.fieldHidden.tdCurrentCallLogIDLabel = false;
            this.fieldHidden.tdCurrentCallLogID = false;
        }
        /**
         * @Note: Condition To Check First Letter Capital For Contact Details Fields
         * Has Been Added in 'onSysCharDataReceive' Function
         */
        this.lClearAccount = 'Y';
        this.riExchange.getParentHTMLValue('AccountNumber');
        //Check If The Provided Account Number Is Public
        if (this.getControlValue('AccountNumber') && this.getControlValue('AccountNumber').substr(1, 1) === '-') {
            this.isLAccountIsPublic = true;
            this.setControlValue('AccountNumber', '');
        } else {
            this.isLAccountIsPublic = false;
        }
        this.riExchange.getParentHTMLValue('SelectedTicketNumber');
        this.riExchange.getParentHTMLValue('ProspectNumber');
        this.riExchange.getParentHTMLValue('TicketProspectNumber');
        /**
         * @Note: TicketProspectNumber is primarily used when the user is attempting to add a new ticket against an existing prospect
         * e.g. a complaint etc... In this case we cannot allow entry of an address
         */
        if (this.getControlValue('TicketProspectNumber')) {
            this.setControlValue('ProspectNumber', this.getControlValue('TicketProspectNumber'));
        }
        //Set Form Control Values Received From Parent Page
        this.riExchange.getParentHTMLValue('AccountProspectName');
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractType');
        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('ProductCode');
        this.riExchange.getParentHTMLValue('ProductDesc');
        this.riExchange.getParentHTMLValue('ServiceCoverNumber');
        this.riExchange.getParentHTMLValue('ServiceCoverRowID');
        this.riExchange.getParentHTMLValue('CurrentCallLogID');
        this.riExchange.getParentHTMLValue('SelectedPostcode');
        this.riExchange.getParentHTMLValue('SelectedAddressLine4');
        this.riExchange.getParentHTMLValue('SelectedAddressLine5');
        this.riExchange.getParentHTMLValue('CallContactName');
        this.riExchange.getParentHTMLValue('CallContactPosition');
        this.riExchange.getParentHTMLValue('CallContactTelephone');
        this.riExchange.getParentHTMLValue('CallContactFax');
        this.riExchange.getParentHTMLValue('CallContactMobile');
        this.riExchange.getParentHTMLValue('CallContactEmail');
        this.riExchange.getParentHTMLValue('CallTicketReference');
        this.riExchange.getParentHTMLValue('NotificationCloseType');
        this.riExchange.getParentHTMLValue('CallNotepadSummary');
        this.riExchange.getParentHTMLValue('CallNotepad');
        this.riExchange.getParentHTMLValue('BusinessOriginCode');
        this.riExchange.getParentHTMLValue('BusinessOriginDesc');
        this.riExchange.getParentHTMLValue('ContactMediumCode');
        this.riExchange.getParentHTMLValue('ContactMediumDesc');
        this.riExchange.getParentHTMLValue('ProspectSourceCode');
        this.riExchange.getParentHTMLValue('ProspectTypeCode');
        this.riExchange.getParentHTMLValue('AccountName');
        this.riExchange.getParentHTMLValue('AccountAddressLine1');
        this.riExchange.getParentHTMLValue('AccountAddressLine2');
        this.riExchange.getParentHTMLValue('AccountAddressLine3');
        this.riExchange.getParentHTMLValue('AccountAddressLine4');
        this.riExchange.getParentHTMLValue('AccountAddressLine5');
        this.riExchange.getParentHTMLValue('AccountPostcode');
        this.riExchange.getParentHTMLValue('AccountContactName');
        this.riExchange.getParentHTMLValue('AccountContactPosition');
        this.riExchange.getParentHTMLValue('AccountContactTelephone');
        this.riExchange.getParentHTMLValue('AccountContactMobile');
        this.riExchange.getParentHTMLValue('AccountContactFax');
        this.riExchange.getParentHTMLValue('AccountContactEmail');
        this.riExchange.getParentHTMLValue('PremiseContactName');
        this.riExchange.getParentHTMLValue('PremiseContactPosition');
        this.riExchange.getParentHTMLValue('PremiseContactTelephone');
        this.riExchange.getParentHTMLValue('PremiseContactFax');
        this.riExchange.getParentHTMLValue('PremiseContactMobile');
        this.riExchange.getParentHTMLValue('PremiseContactEmail');
        this.riExchange.getParentHTMLValue('PremisePostcode');
        this.setControlValue('CallAddressLine4', this.getControlValue('SelectedAddressLine4'));
        this.setControlValue('CallAddressLine5', this.getControlValue('SelectedAddressLine5'));
        this.setControlValue('NotificationCloseTypeSelect', this.getControlValue('NotificationCloseType'));
        /**
         * @Note: Condition to Show 'Select Disputed Invoices' Button &&
         * Condition to Change Create Ticket Button Text And Show Hide Contact Details Button
         * Has Been Added In 'pageLoadLookUpDataOperation' Function
         */
        if (this.getControlValue('PremiseNumber') === '0') {
            this.setControlValue('PremiseNumber', '');
        }
        this.setControlValue('oldPremiseNumber', this.getControlValue('PremiseNumber'));
        //Condition to Show Label 'Contact Details ( Defaulted From Selected Ticket )'
        if (this.getControlValue('SelectedTicketNumber')) {
            this.fieldHidden.tdSelectedTicketNumberLabel = true;
            this.fieldHidden.tdSelectedTicketNumber = true;
            this.fieldHidden.tdCmdContactTicket = true;
            this.fieldHidden.tdContactLabelStandard = false;
            this.fieldHidden.tdContactLabelNew = false;
            this.fieldHidden.tdContactLabelFromTicket = true;
            this.onCmdContactTicketClick();
        }
        /**
         * @Note: Condition To Show 'Get Contract', 'Get Premise', 'Get Product' Buttons and to Disable
         * And To Disable Input Fields 'ContractNumber', 'PremiseNumber', 'ProductCode'
         */
        if (!this.getControlValue('ProspectNumber')) {
            if (this.getControlValue('AccountNumber')) {
                this.fieldHidden.tdcmdSelectContract = true;
                this.fieldHidden.tdcmdSelectPremise = true;
                this.fieldHidden.tdcmdSelectProduct = true;
            } else {
                this.disableControl('ContractNumber', true);
                this.disableControl('PremiseNumber', true);
                this.disableControl('ProductCode', true);
            }
        }
        //Get Premise Contact Details if Premise Number is Available
        if (this.getControlValue('PremiseNumber')) {
            this.fieldHidden.tdcmdContactPrem = true;
            if (!this.getControlValue('CallContactName')) {
                this.onCmdContactPremClick();
            }
            if (!this.getControlValue('CallContactPostcode')) {
                this.setControlValue('CallContactPostcode', this.getControlValue('AccountPostcode'));
            }
        }
        //If Account Number is Present Show 'From Account' Button
        if (this.getControlValue('AccountNumber')) {
            //Hiding 'From Account' Button as it is not required
            this.fieldHidden.tdcmdContactAcct = false;
            this.cmdContactAcct = MessageConstant.PageSpecificMessage.cmdContactAcct;
            if (!this.getControlValue('CallContactName')) {
                this.onCmdContactAcctClick();
            }
            if (!this.getControlValue('CallContactPostcode')) {
                this.setControlValue('CallContactPostcode', this.getControlValue('AccountPostcode'));
            }
        }
        //If Prospect Number is Present Show 'From Prospect' Button
        if (this.getControlValue('ProspectNumber')) {
            this.fieldHidden.tdcmdContactAcct = true;
            this.cmdContactAcct = MessageConstant.PageSpecificMessage.cmdContactProspect;
            if (!this.getControlValue('CallContactName')) {
                this.onCmdContactAcctClick();
            }
        }
        //If Selected Postcode is Truthy Then Set It to Call Contact Postcode
        /**
         * Following logic has been implemented exactly as per exisitng icab code, needed for some page flow
         */
        if (this.getControlValue('SelectedPostcode')) {
            this.setControlValue('CallContactPostcode', this.riExchange.getParentHTMLValue('SelectedPostcode'));
        }
        //Condition to Show Label 'Contact Details ( Defaulted From Selected Ticket )'
        if (this.getControlValue('SelectedTicketNumber')) {
            this.onCmdContactTicketClick();
        }
        /**
         * @Note: Call to 'onContactTypeCodeSelectChange' Function Has Been Added In
         * 'pageLoadLookUpDataOperation' Function
         */
        //Call 'Notify Call Closure' Drop Down On Change Method
        this.onNotificationCloseTypeSelectChange();
        this.setControlValue('ClosedWithChanges', 'N');
        /**
         * @Note showHideAddressDetails Method To Show Hide Address Details Has Been Added In
         * onSysCharDataReceive
         */

        this.setControlValue('CallAddressLine4', this.getControlValue('SelectedAddressLine4'));
        this.setControlValue('CallAddressLine5', this.getControlValue('SelectedAddressLine5'));

        //If Prospect Number Available Get Latest Prospect Details
        if (this.getControlValue('ProspectNumber')) {
            this.getLatestProspectDetails();
        }
        /**
         * @Note: Focus On Contact Field After Window Load Has Been Added In ngAfterViewInit
         */
    }
    /**
     * Method to Set Default Contact Position Value From Registry Setting
     * @params: params: void
     * @return: : void
     */
    private getRegistrySetting(): void {
        let businessCode: any = this.businessCode();
        let lookupIp: any = [{
            'table': 'riRegistry',
            'query': {
                'RegKey': businessCode + '_Default ContactPosition (New Customer)',
                'RegSection': 'Contact Centre Search'
            },
            'fields': ['RegValue']
        }];
        this.LookUp.lookUpRecord(lookupIp).subscribe((data) => {
            let lookUpRecord = data[0];
            if (lookUpRecord.length) {
                this.cDefaultContactPosition = data[0][0].RegValue;
            }
        });
    }
    /**
     * Method to Load Initial Lookup Tables and Get Data Through Speed Script
     * @params: params: void
     * @return: : void
     */
    private pageLoadLookUp(): void {
        let businessCode: any = this.businessCode();
        let lookupIP: any = [
            {
                'table': 'UserAuthority',
                'query': {
                    'BusinessCode': businessCode,
                    'UserCode': this.utils.getUserCode()
                },
                'fields': ['ContactCreateSecurityLevel']
            },
            {
                'table': 'ContactType',
                'query': {
                    'BusinessCode': businessCode
                },
                'fields': ['ContactTypeCode', 'ContactTypeSystemDesc']
            },
            {
                'table': 'ContactTypeDetail',
                'query': {
                },
                'fields': ['ContactTypeCode', 'ContactCreateSecurityLevel', 'ValidForNewInd', 'CallCentreInd']
            },
            {
                'table': 'ContactTypeLang',
                'query': {
                    'BusinessCode': businessCode,
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ContactTypeCode', 'LanguageCode', 'ContactTypeDesc']
            },
            {
                'table': 'riRegistry',
                'query': {
                    'RegSection': 'Contact Person'
                },
                'fields': ['RegSection', 'RegKey']
            },
            {
                'table': 'riRegistry',
                'query': {
                    'RegKey': businessCode + '_Enable CCM Dispute Processing',
                    'RegSection': 'CCM Disputed Invoices'
                },
                'fields': ['RegValue']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP, 500).subscribe((data) => {
            let lookUpRecord: any = data;
            if (lookUpRecord.length) {
                this.userAuthorityTable = lookUpRecord[0];
                this.contactTypeTable = lookUpRecord[1];
                this.contactTypeDetailTable = lookUpRecord[2];
                this.contactTypeLang = lookUpRecord[3];
                this.isGlMultiContactInd = lookUpRecord[4].length > 0;
                this.riRegistry = lookUpRecord[5];
                this.pageLoadLookUpDataOperation();
            }
        });
    }
    /**
     * Method to do Operation After Initial Lookup Data Received
     * @params: params: void
     * @return: : void
     */
    private pageLoadLookUpDataOperation(): void {
        let objCTDT: any, objCTL: any, contactCreateSecurityLevel: any, contactTypeDesc: any;
        /**
         * Condition to Show 'Select Disputed Invoices' Button
         */
        this.isGlDisputedInvoicesInUse = this.riRegistry[0].RegValue === 'Y';
        this.isLDisputedInvoicesInUse = this.isGlDisputedInvoicesInUse;
        this.fieldHidden.tdDisputedInvoices = (this.isLDisputedInvoicesInUse && this.getControlValue('AccountNumber') && this.getControlValue('AccountNumber').substr(1, 1) !== '-');
        /**
         * Create Contact Type Code(Ticket Type) Drop Down List
         */
        if (this.userAuthorityTable[0]) {
            contactCreateSecurityLevel = this.userAuthorityTable[0].ContactCreateSecurityLevel;
        }
        if (contactCreateSecurityLevel) {
            this.contactTypeTable.forEach(ctt => {
                objCTDT = this.contactTypeDetailTable.find(ctdt => ((ctdt.ContactTypeCode === ctt.ContactTypeCode) && (ctdt.ContactCreateSecurityLevel <= contactCreateSecurityLevel) && ctdt.ValidForNewInd && ctdt.CallCentreInd));
                if (objCTDT) {
                    objCTL = this.contactTypeLang.find(ctl => (ctl.ContactTypeCode === ctt.ContactTypeCode));
                    contactTypeDesc = (objCTL) ? objCTL.ContactTypeDesc : ctt.ContactTypeSystemDesc;
                    this.ttContactType.push({ text: contactTypeDesc, value: ctt.ContactTypeCode });
                }
            });
        }
        /**
         * Condition to Change Create Ticket Button Text And Show Hide Contact Details Button
         */
        if (this.getControlValue('AccountNumber')) {
            this.fieldHidden.cmdClearAcct = true;
            this.cmdCreate = MessageConstant.PageSpecificMessage.cmdCreateExist;
            if (this.isGlMultiContactInd) {
                this.fieldHidden.cmdContacts = true;
            } else {
                this.fieldHidden.cmdContacts = false;
            }
        } else {
            this.fieldHidden.cmdClearAcct = false;
            this.cmdCreate = MessageConstant.PageSpecificMessage.cmdCreateNew;
        }
        //Call to Create Contact Type Details Code (Details) Drop Down
        this.onContactTypeCodeSelectChange(this.ttContactType[0].value);
    }
    /**
     * Method to Get SysChar Parameters
     * @params: params: void
     * @return: String of SysChar
     */
    private sysCharParameters(): string {
        let sysCharList: any = [
            this.sysCharConstants.SystemCharEnableAddressLine3,//SysChar Number: 420
            this.sysCharConstants.SystemCharEnableHopewiserPAF,//SysChar Number: 740
            this.sysCharConstants.SystemCharEnableDatabasePAF,//SysChar Number: 750
            this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact,//SysChar Number: 1380
            this.sysCharConstants.SystemCharAddressLine4Required,//SysChar Number: 760
            this.sysCharConstants.SystemCharAddressLine5Required//SysChar Number: 770
        ];
        return sysCharList.join(',');
    }
    /**
     * Method to Get SysChar Number
     * @params: params: void
     * @return: SysChar Number
     */
    private fetchSysChar(sysCharNumbers: any): any {
        let querySysChar: any = this.getURLSearchParamObject();
        querySysChar.set(this.serviceConstants.Action, '0');
        querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(querySysChar);
    }
    /**
     * Method to Fetch SysChar Details
     * @params: params: void
     * @return: any
     */
    private triggerFetchSysChar(): any {
        let sysCharNumbers: any = this.sysCharParameters();
        this.sysCharSubscription = this.fetchSysChar(sysCharNumbers).subscribe((data) => {
            this.onSysCharDataReceive(data);
        });
    }
    /**
     * Method to Assign SysChar Details to SpeedScript Variables
     * And to Do Other Functionality Based On Syschar
     * @params: params: data: any
     * @return: void
     */
    private onSysCharDataReceive(data: any): void {
        if (data.records && data.records.length > 0) {
            this.isLSCEnableAddressLine3 = data.records[0].Required;
            this.isLSCAddressLine3Logical = data.records[0].Logical;
            this.isLSCEnableHopewiserPAF = data.records[1].Required;
            this.isLSCEnableDatabasePAF = data.records[2].Required;
            this.isLSCCapitalFirstLtr = data.records[3].Required;
            this.isLSCAddressLine4Required = data.records[4].Required;
            this.isLSCAddressLine5Required = data.records[5].Required;
            this.isLSCAddressLine5Logical = data.records[5].Logical;
            //Condition to Hide Get Address Button
            if (!(this.isLSCEnableHopewiserPAF || this.isLSCEnableDatabasePAF)) {
                this.fieldHidden.cmdGetAddress = false;
            }
            /**
             * If isLSCCapitalFirstLtr is FALSE then First Letter Will be Capital for Following Fields
             * CallContactName,CallContactPosition,CallAddressName,
             * CallAddressLine1,CallAddressLine2,CallAddressLine3,CallAddressLine4,CallAddressLine5
             */
            this.fieldHidden.isFirstLetterCapital = this.isLSCCapitalFirstLtr;
            //Call Method To Show Hide Address Details
            this.showHideAddressDetails();
        }
    }
    /**
     * Method to Get Latest Prospect Details
     * @params: params: void
     * @return: void
     */
    private getLatestProspectDetails(): void {
        let formData: Object = {};

        let search: any = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'GetLatestProspectDetails';
        formData['ProspectNumber'] = this.getControlValue('ProspectNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.latestProspectDetails = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('AccountProspectName', data['ProspectName']);
                    this.setControlValue('CallContactName', data['ProspectContactName']);
                    this.setControlValue('CallContactPosition', data['ProspectContactPosition']);
                    this.setControlValue('CallContactTelephone', data['ProspectContactTelephone']);
                    this.setControlValue('CallContactFax', data['ProspectContactFax']);
                    this.setControlValue('CallContactMobile', data['ProspectContactMobile']);
                    this.setControlValue('CallContactEmail', data['ProspectContactEmail']);
                    this.setControlValue('CallAddressName', data['ProspectName']);
                    this.setControlValue('CallAddressLine1', data['ProspectAddressLine1']);
                    this.setControlValue('CallAddressLine2', data['ProspectAddressLine2']);
                    this.setControlValue('CallAddressLine3', data['ProspectAddressLine3']);
                    this.setControlValue('CallAddressLine4', data['ProspectAddressLine4']);
                    this.setControlValue('CallAddressLine5', data['ProspectAddressLine5']);
                    this.setControlValue('CallContactPostcode', data['ProspectPostcode']);
                    this.setControlValue('CallNotepad', data['ProspectNotes']);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /**
     * Method to Update Call Log
     * @params: params: void
     * @return: void
     */
    private saveCallChanges(): void {
        let formData: Object = {};

        let search: any = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'UpdateCallLog';

        formData['CallLogID'] = this.getControlValue('CallLogID');
        formData['CallContactName'] = this.getControlValue('CallContactName');
        formData['CallContactPosition'] = this.getControlValue('CallContactPosition');
        formData['CallContactTelephone'] = this.getControlValue('CallContactTelephone');
        formData['CallContactFax'] = this.getControlValue('CallContactFax');
        formData['CallContactMobile'] = this.getControlValue('CallContactMobile');
        formData['CallContactEmail'] = this.getControlValue('CallContactEmail');
        formData['CallContactPostcode'] = this.getControlValue('CallContactPostcode');
        formData['CallAddressName'] = this.getControlValue('CallAddressName');
        formData['CallAddressLine1'] = this.getControlValue('CallAddressLine1');
        formData['CallAddressLine2'] = this.getControlValue('CallAddressLine2');
        formData['CallAddressLine3'] = this.getControlValue('CallAddressLine3');
        formData['CallAddressLine4'] = this.getControlValue('CallAddressLine4');
        formData['CallAddressLine5'] = this.getControlValue('CallAddressLine5');
        formData['CallSummary'] = this.getControlValue('CallNotepadSummary');
        formData['CallDetails'] = this.getControlValue('CallNotepad');
        formData['CallTicketReference'] = this.getControlValue('CallTicketReference');
        formData['NotificationCloseType'] = this.getControlValue('NotificationCloseType');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.updateCallLog = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('CurrentCallLogID', data.CallLogID);
                    if (this.getControlValue('CreateCallLogInCCMInd') === 'Y') {
                        this.setControlValue('CallContactTelephone', data.CallContactTelephone);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /**
     * Method to Get Premise Contact Details When
     * OldPremiseNumber is Not Equal to PremiseNumber
     * @params: params: void
     * @return: void
     */
    private onCmdContactPremClick(): void {
        if (this.getControlValue('OldPremiseNumber') !== this.getControlValue('PremiseNumber')) {
            let formData: Object = {};
            let search: any = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '6');

            formData['Function'] = 'GetPremiseContactDetails';
            formData['ContractNumber'] = this.getControlValue('ContractNumber');
            formData['PremiseNumber'] = this.getControlValue('PremiseNumber');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.getPremiseContactDetails = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setControlValue('OldPremiseNumber', this.getControlValue('PremiseNumber'));
                        this.setControlValue('PremiseContactName', data.PremiseContactName);
                        this.setControlValue('PremiseContactPosition', data.PremiseContactPosition);
                        this.setControlValue('PremiseContactTelephone', data.PremiseContactTelephone);
                        this.setControlValue('PremiseContactFax', data.PremiseContactFax);
                        this.setControlValue('PremiseContactMobile', data.PremiseContactMobile);
                        this.setControlValue('PremiseContactEmail', data.PremiseContactEmail);
                        this.setControlValue('PremisePostcode', data.PremisePostcode);
                        this.fieldHidden.tdContactLabelStandard = true;
                        this.fieldHidden.tdContactLabelNew = false;
                        this.fieldHidden.tdContactLabelFromTicket = false;
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
        this.setControlValue('CallContactName', this.getControlValue('PremiseContactName'));
        this.setControlValue('CallContactPosition', this.getControlValue('PremiseContactPosition'));
        this.setControlValue('CallContactTelephone', this.getControlValue('PremiseContactTelephone'));
        this.setControlValue('CallContactFax', this.getControlValue('PremiseContactFax'));
        this.setControlValue('CallContactMobile', this.getControlValue('PremiseContactMobile'));
        this.setControlValue('CallContactEmail', this.getControlValue('PremiseContactEmail'));
        this.setControlValue('CallContactPostcode', this.getControlValue('PremisePostcode'));
    }
    /**
     * Method To Populate Form Data From Parent Page if
     * 'Defaulted From Selected Ticket Option' Is True
     * @params: params: void
     * @return: void
     */
    private onCmdContactTicketClick(): void {
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('TicketContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('TicketContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('TicketPremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('TicketPremiseName'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('TicketProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('TicketProductDesc'));
        this.setControlValue('ServiceCoverNumber', this.riExchange.getParentHTMLValue('TicketServiceCoverNumber'));
        this.setControlValue('ServiceCoverRowid', this.riExchange.getParentHTMLValue('TicketServiceCoverRowID'));
        this.setControlValue('CallContactName', this.riExchange.getParentHTMLValue('TicketContactName'));
        this.setControlValue('CallContactPosition', this.riExchange.getParentHTMLValue('TicketContactPosition'));
        this.setControlValue('CallContactTelephone', this.riExchange.getParentHTMLValue('TicketContactTelephone'));
        this.setControlValue('CallContactFax', this.riExchange.getParentHTMLValue('TicketContactFax'));
        this.setControlValue('CallContactMobile', this.riExchange.getParentHTMLValue('TicketContactMobile'));
        this.setControlValue('CallContactEmail', this.riExchange.getParentHTMLValue('TicketContactEmail'));
        this.setControlValue('CallContactPostcode', this.riExchange.getParentHTMLValue('TicketPostCode'));
        this.setControlValue('CallAddressName', this.riExchange.getParentHTMLValue('TicketAddressName'));
        this.setControlValue('CallAddressLine1', this.riExchange.getParentHTMLValue('TicketAddressLine1'));
        this.setControlValue('CallAddressLine2', this.riExchange.getParentHTMLValue('TicketAddressLine2'));
        this.setControlValue('CallAddressLine3', this.riExchange.getParentHTMLValue('TicketAddressLine3'));
        this.setControlValue('CallAddressLine4', this.riExchange.getParentHTMLValue('TicketAddressLine4'));
        this.setControlValue('CallAddressLine5', this.riExchange.getParentHTMLValue('TicketAddressLine5'));
        this.setControlValue('CallNotepadSummary', this.riExchange.getParentHTMLValue('TicketShortDescription'));
        this.setControlValue('CallNotepad', this.riExchange.getParentHTMLValue('TicketComments'));
    }
    /**
     * Method To Populate Form Data From Parent Page if
     * 'From Account' Button is Clicked
     * @params: params: void
     * @return: void
     */
    private onCmdContactAcctClick(): void {
        this.setControlValue('CallContactName', this.riExchange.getParentHTMLValue('AccountContactName'));
        this.setControlValue('CallContactPosition', this.riExchange.getParentHTMLValue('AccountContactPosition'));
        this.setControlValue('CallContactTelephone', this.riExchange.getParentHTMLValue('AccountContactTelephone'));
        this.setControlValue('CallContactFax', this.riExchange.getParentHTMLValue('AccountContactFax'));
        this.setControlValue('CallContactMobile', this.riExchange.getParentHTMLValue('AccountContactMobile'));
        this.setControlValue('CallContactEmail', this.riExchange.getParentHTMLValue('AccountContactEmail'));
        this.setControlValue('CallContactPostcode', this.riExchange.getParentHTMLValue('AccountPostCode'));
        this.fieldHidden.tdContactLabelStandard = true;
        this.fieldHidden.tdContactLabelNew = false;
        this.fieldHidden.tdContactLabelFromTicket = false;
    }
    /**
     * Method To Show Hide Address/Transaction/Contact Details Sections
     * Based On AccountNumber and TicketProspectNumber
     * @params: params: void
     * @return: void
     */
    private showHideAddressDetails(): void {
        if (this.isLAccountIsPublic || (!this.isLAccountIsPublic && !this.getControlValue('AccountNumber') && !this.getControlValue('TicketProspectNumber'))) {
            this.isLShowingAddressInfo = true;

            this.fieldHidden.trTransactionDetails = false;
            this.fieldHidden.trTransactionContractNumber = false;
            this.fieldHidden.trTransactionPremiseNumber = false;
            this.fieldHidden.trTransactionProductCode = false;
            this.fieldHidden.trContractSeperatorBottom = false;

            this.fieldHidden.tdContactLabelStandard = false;
            this.fieldHidden.tdContactLabelFromTicket = false;
            this.fieldHidden.tdContactLabelNew = true;

            this.fieldHidden.trCallAddressName = true;
            this.fieldHidden.trCallAddressLine1 = true;
            this.fieldHidden.trCallAddressLine2 = true;
            if (this.isLSCEnableAddressLine3) {
                this.fieldHidden.trCallAddressLine3 = true;
            }

            this.fieldHidden.trCallAddressLine4 = true;
            this.fieldHidden.trCallAddressLine5 = true;


            if (!this.getControlValue('CallContactPosition')) {
                if (this.cDefaultContactPosition) {
                    this.setControlValue('CallContactPosition', this.cDefaultContactPosition);
                }
            }

            if (!this.getControlValue('CallAddressName')) {
                this.setControlValue('CallAddressName', this.getControlValue('CallContactName'));
            }

            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressName', true);
            this.mandatoryShow.CallAddressName = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressLine1', true);
            this.mandatoryShow.CallAddressLine1 = true;

            if (this.isLSCAddressLine3Logical) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressLine3', true);
                this.mandatoryShow.CallAddressLine3 = true;
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressLine3', false);
                this.mandatoryShow.CallAddressLine3 = false;
            }

            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressLine4', true);
            this.mandatoryShow.CallAddressLine4 = true;

            if (this.isLSCAddressLine5Logical) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressLine5', true);
                this.mandatoryShow.CallAddressLine5 = true;
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressLine5', true);
                this.mandatoryShow.CallAddressLine5 = true;
            }

            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactPostCode', true);
            this.mandatoryShow.CallContactPostCode = true;
        } else {
            this.isLShowingAddressInfo = false;

            this.fieldHidden.trTransactionDetails = true;
            this.fieldHidden.trTransactionContractNumber = true;
            this.fieldHidden.trTransactionPremiseNumber = true;
            this.fieldHidden.trTransactionProductCode = true;
            this.fieldHidden.trContractSeperatorBottom = true;

            this.fieldHidden.tdContactLabelStandard = false;
            this.fieldHidden.tdContactLabelFromTicket = false;
            this.fieldHidden.tdContactLabelNew = true;

            this.fieldHidden.trCallAddressName = false;
            this.fieldHidden.trCallAddressLine1 = false;
            this.fieldHidden.trCallAddressLine2 = false;

            if (this.isLSCEnableAddressLine3) {
                this.fieldHidden.trCallAddressLine3 = false;
            }

            this.fieldHidden.trCallAddressLine4 = false;
            this.fieldHidden.trCallAddressLine5 = false;

            this.setControlValue('CallAddressName', '');
            this.setControlValue('CallAddressLine1', '');
            this.setControlValue('CallAddressLine2', '');
            this.setControlValue('CallAddressLine3', '');
            /**
             * @Note: Default the following for either the selected account or premise details
             * - enables AUS postcode searching to work correctly
             */
            this.setControlValue('CallAddressLine4', this.getControlValue('SelectedAddressLine4'));
            this.setControlValue('CallAddressLine5', this.getControlValue('SelectedAddressLine5'));

            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressName', false);
            this.mandatoryShow.CallAddressName = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressLine1', false);
            this.mandatoryShow.CallAddressLine1 = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressLine3', false);
            this.mandatoryShow.CallAddressLine3 = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallAddressLine5', false);
            this.mandatoryShow.CallAddressLine5 = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactPostCode', false);
            this.mandatoryShow.CallContactPostCode = false;
            //Set CallContactPostCode As Required Field If ContactTypeDetailCode is Found In PostcodeRequiredList
            if (this.getControlValue('PostcodeRequiredList')) {
                let findInString: any = this.getControlValue('PostcodeRequiredList').indexOf(',' + this.getControlValue('ContactTypeDetailCode') + ',', 1);
                if (findInString > 0) {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactPostCode', true);
                    this.mandatoryShow.CallContactPostCode = true;
                }
            }
        }
    }
    /**
     * Method to Navigate To Next Page If Form Data is Valid
     * @params: params: void
     * @return: void
     */
    private onCmdCreateSuccess(): void {
        let formData: Object = {};
        if (this.isLValidatePageOk) {
            this.isLGoNewWindow = false;
            let search: any = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '6');
            formData['Function'] = 'ValidateContactType';

            formData['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
            formData['ContactTypeDetailCode'] = this.getControlValue('ContactTypeDetailCode');
            formData['AccountNumber'] = this.getControlValue('AccountNumber');
            formData['ContractNumber'] = this.getControlValue('ContractNumber');
            formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
            formData['PremiseName'] = this.getControlValue('PremiseName');
            formData['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
            formData['ProductCode'] = this.getControlValue('ProductCode');
            formData['ProductDesc'] = this.getControlValue('ProductDesc');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.validateContactType = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        if (data.ErrorMessage) {
                            this.modalAdvService.emitMessage(new ICabsModalVO(data.ErrorMessage));
                            this.isLGoNewWindow = false;
                        } else {
                            this.isLGoNewWindow = true;
                            this.setControlValue('URL', data.URL);
                            this.setControlValue('URLMode', data.URLMode);
                            this.setControlValue('PremiseNumber', data.PremiseNumber);
                            this.setControlValue('PremiseName', data.PremiseName);
                            this.setControlValue('ServiceCoverNumber', data.ServiceCoverNumber);
                            this.setControlValue('ProductCode', data.ProductCode);
                            this.setControlValue('ProductDesc', data.ProductDesc);
                        }
                        if (this.isLGoNewWindow) {
                            /**
                             * Update The Call Details Now - will either create a new call or updates to an existing
                             */
                            this.saveCallChanges();
                            this.setControlValue('ClosedWithChanges', 'Y');
                            //Check for URL and navigate to next page
                            this.checkURLToNavigatePage();
                        }
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });

        }
    }
    /**
     * Method to Navigate To Create Ticket Page Based On Returned URL
     * @params: params: void
     * @return: void
     */
    private checkURLToNavigatePage(): void {
        /**
         * @Note: URL Is Coming As Page Name 'ContactManagement/iCABSCMCustomerContactMaintenance.htm',
         * With That WE Can Not Navigate. Hence Replacing The Page Name With Corresponding Route Path.
         * Pages That Are Not Developed Will Be Show As Page Not Develop Message Box
         */
        let urlNewPath: any, urlOldPath: any = this.getControlValue('URL'), urlMode: any = this.getControlValue('URLMode');
        if (urlOldPath.indexOf('iCABSCMPipelineProspectMaintenance') > -1) {
            urlNewPath = AppModuleRoutes.PROSPECTTOCONTRACT + ProspectToContractModuleRoutes.ICABSCMPIPELINEPROSPECTMAINTENANCE;
        } else if (urlOldPath.indexOf('iCABSCMCallCentreCreateFixedPriceJob') > -1) {
            urlNewPath = '';
        } else if (urlOldPath.indexOf('iCABSALostBusinessRequestSearch') > -1) {
            urlNewPath = InternalSearchModuleRoutes.ICABSALOSTBUSINESSREQUESTSEARCH;
        } else if (urlOldPath.indexOf('iCABSCMTelesalesEntry') > -1) {
            urlNewPath = InternalMaintenanceServiceModuleRoutes.ICABSCMTELESALESENTRY;
        } else if (urlOldPath.indexOf('iCABSCMCustomerContactMaintenance') > -1) {
            urlNewPath = '';
        }
        if (urlNewPath) {
            this.navigate(urlMode, urlNewPath, { parentMode: urlMode });
        } else {
            this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
        }
    }
    /**
     * Method to Update Contact Fields on Ellipsis Data Received
     * and to Config Premise Number and Product Code Ellipsis
     * @params: params: data: any
     * @return: void
     */
    public onContractDataReceived(data: any): void {
        let productChildParams: any = this.ellipsisConfig.product.childConfigParams;
        let premiseChildParams: any = this.ellipsisConfig.premise.childConfigParams;
        if (data) {
            this.setControlValue('ContractNumber', data.ContractNumber);
            this.setControlValue('ContractName', data.ContractName);
            premiseChildParams['ContractNumber'] = data.ContractNumber;
            premiseChildParams['ContractName'] = data.ContractName;
            productChildParams['ContractNumber'] = data.ContractNumber;
            productChildParams['ContractName'] = data.ContractName;
        }
    }
    /**
     * Method to Update Premise Fields on Ellipsis Data Received
     * and to Config Product Code Ellipsis
     * @params: params: data: any
     * @return: void
     */
    public onPremiseDataReceived(data: any): void {
        let productChildParams: any = this.ellipsisConfig.product.childConfigParams;
        let premiseChildParams: any = this.ellipsisConfig.premise.childConfigParams;
        if (data) {
            this.setControlValue('PremiseNumber', data.PremiseNumber);
            this.setControlValue('PremiseName', data.PremiseName);
            productChildParams['ContractNumber'] = this.getControlValue('ContractNumber');
            productChildParams['ContractName'] = this.getControlValue('ContractName');
            productChildParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
            productChildParams['PremiseName'] = this.getControlValue('PremiseName');
        }
    }
    /**
     * Method to Update Premise Fields on Ellipsis Data Received
     * and to Config Product Code Ellipsis
     * @params: params: data: any
     * @return: void
     */
    public onProductDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ProductCode', data.ProductCode);
            this.setControlValue('ProductDesc', data.ProductDesc);
        }
    }
    /**
     * Method to Validate Contact Type
     * @params: params: void
     * @return: void
     */
    public onCmdCreateClick(): void {
        this.setControlValue('CallNotepadSummary', this.getControlValue('CallNotepadSummary').replace(/"/g, "'"));
        this.setControlValue('CallNotepad', this.getControlValue('CallNotepad').replace(/"/g, "'"));
        this.validatePage();
    }
    /**
     * Method to Check Fixed Price Job Postcode
     * @params: params: void
     * @return: void
     */
    private validatePage(): void {
        let formData: Object = {};
        let search: any = this.getURLSearchParamObject();
        this.isLValidatePageOk = true;
        this.isLValidatePageOk = this.riExchange.validateForm(this.uiForm);
        this.setControlValue('CallNotePadText', this.getControlValue('CallNotePad'));
        if (this.isLValidatePageOk) {
            search.set(this.serviceConstants.Action, '6');

            formData['Function'] = 'CheckFixedPriceJobPostcode';
            formData['Telephone'] = this.getControlValue('CallContactTelephone');
            formData['Mobile'] = this.getControlValue('CallContactMobile');
            formData['Email'] = this.getControlValue('CallContactEmail');
            formData['Fax'] = this.getControlValue('CallContactFax');
            formData['CallContactPostcode'] = this.getControlValue('CallContactPostcode');
            formData['CallAddressLine4'] = this.getControlValue('CallAddressLine4');
            formData['CallAddressLine5'] = this.getControlValue('CallAddressLine5');
            formData['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
            formData['ContactTypeDetailCode'] = this.getControlValue('ContactTypeDetailCode');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.checkFixedPriceJobPostcode = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.isLValidatePageOk = false;
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        if (data.WarningMessage) {
                            let promptVO: ICabsModalVO = new ICabsModalVO(data.WarningMessage, null, this.promptConfirmNo.bind(this), this.promtConfirmYes.bind(this));
                            promptVO.cancelLabel = 'Yes';
                            promptVO.confirmLabel = 'No';
                            this.modalAdvService.emitPrompt(promptVO);
                        }
                        if (data.ErrorMessage) {
                            this.modalAdvService.emitMessage(new ICabsModalVO(data.ErrorMessage));
                            switch (data.ErrorField) {
                                case 1:
                                    this.CallContactTelephone.nativeElement.focus();
                                    break;
                                case 2:
                                    this.CallContactMobile.nativeElement.focus();
                                    break;
                                case 3:
                                    this.CallContactFax.nativeElement.focus();
                                    break;
                                case 4:
                                    this.CallContactEmail.nativeElement.focus();
                                    break;
                            }
                            this.isLValidatePageOk = false;
                        }
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }
    /**
     * Method to Disable Navigation and Stay On Current Page Untill Error Is Resolved
     * @params: params: void
     * @return: void
     */
    public promptConfirmNo(): void {
        this.isLValidatePageOk = false;
    }
    /**
     * Method to Navigate To Next Page With The Error
     * @params: params: void
     * @return: void
     */
    public promtConfirmYes(): void {
        this.isLValidatePageOk = true;
        this.onCmdCreateSuccess();
    }
    /**
     * Method to Populate Default Details In 'Summary' And 'Details' Fields
     * On Default Details Button Click
     * @params: params: void
     * @return: void
     */
    public onCmdDefaultTicketTypeClick(): void {
        let formData: Object = {};

        let search: any = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'GetContactTypeDetailDescription';
        formData['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
        formData['ContactTypeDetailCode'] = this.getControlValue('ContactTypeDetailCode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.getContactTypeDetailDescription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (!this.getControlValue('CallNotepad')) {
                        this.setControlValue('CallNotepad', data.ContactTypeDetailDesc);
                    } else {
                        this.setControlValue('CallNotepad', this.getControlValue('CallNotepad') + data.ContactTypeDetailDesc);
                    }
                    this.setControlValue('CallNotepadSummary', this.getControlValue('CallNotepad'));
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /**
     * Method to Get Contact Type Detail Description
     * @params: event:any
     * @return: void
     */
    public onContactTypeCodeSelectChange(obj: any): void {
        let valArray: Array<any> = [];
        let descArray: Array<any> = [];
        let formData: Object = {};
        this.contactTypeDetailCodeSelectList = [];
        let search = this.getURLSearchParamObject();
        //Set Ticket Type Code fro Value Selected
        this.setControlValue('ContactTypeCode', obj);
        this.ContactTypeCodeSelect.selectedItem = obj;

        search.set(this.serviceConstants.Action, '6');
        formData['Function'] = 'GetContactTypeDetailCodes';
        formData['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
        formData['AccountNumber'] = this.getControlValue('AccountNumber');
        formData['ContractNumber'] = this.getControlValue('ContractNumber');
        formData['PremiseNumber'] = this.getControlValue('PremiseNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.getContactTypeDetailCodes = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.ContactTypeDetailCodeSelect.selectedItem = '';
                    this.setControlValue('ContactTypeDetailCodeSelect', '');
                    this.setControlValue('SelectionCriteria', data.SelectionCriteria);
                    this.setControlValue('AccountRequiredList', data.AccountRequiredList);
                    this.setControlValue('ContractRequiredList', data.ContractRequiredList);
                    this.setControlValue('PremiseRequiredList', data.PremiseRequiredList);
                    this.setControlValue('ProductRequiredList', data.ProductRequiredList);
                    this.setControlValue('PostcodeRequiredList', data.PostcodeRequiredList);
                    this.setControlValue('ResidentialTeamInd', data.ResidentialTeamInd);
                    this.setControlValue('ResiContactTypeCode', data.ResiContactTypeCode);
                    this.setControlValue('ResiContactTypeDetailCode', data.ResiContactTypeDetailCode);
                    valArray = data.ContactTypeDetailCodes.split(/\s+/);
                    descArray = data.ContactTypeDetailDescs.split(/\r?\n/);
                    for (let i: any = 0; i < valArray.length; i++) {
                        this.contactTypeDetailCodeSelectList.push({ text: descArray[i], value: valArray[i] });
                    }
                    this.setControlValue('ContactTypeDetailCodeSelect', this.contactTypeDetailCodeSelectList[0].value);
                    this.ContactTypeDetailCodeSelect.selectedItem = this.contactTypeDetailCodeSelectList[0].value;
                    /**
                     * Call Contact Type Detail Code Drop Down With Selected Value For Contact Type Code
                     */
                    this.onContactTypeDetailCodeSelectChange(this.contactTypeDetailCodeSelectList[0].value);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
        /**
         * If cDefaultResiContactTypeDetailCode(Not Found Any Where In Code Base) Has Value Then Set it to ContactTypeDetailCodeSelect
         */
        if (this.cDefaultResiContactTypeDetailCode) {
            this.setControlValue('ContactTypeDetailCodeSelect', this.cDefaultResiContactTypeDetailCode);
            this.ContactTypeDetailCodeSelect.selectedItem = this.cDefaultResiContactTypeDetailCode;
        }
    }
    /**
     * Method to Implement Required Fields Functionality On Selection of
     * 'Detail' Drop Down
     * @params: params: obj:any
     * @return: void
     */
    public onContactTypeDetailCodeSelectChange(obj: any): void {
        let findInString1: any, findInString2: any, findInString3: any, findInString4: any;
        //Set Selected Value In Form Control And Static Drop Down
        this.setControlValue('ContactTypeDetailCodeSelect', obj);
        this.ContactTypeDetailCodeSelect.selectedItem = obj;

        this.setControlValue('ContactTypeDetailCode', this.getControlValue('ContactTypeDetailCodeSelect'));

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', false);
        this.mandatoryShow.ContractNumber = false;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', false);
        this.mandatoryShow.PremiseNumber = false;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductCode', false);
        this.mandatoryShow.ProductCode = false;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactPostcode', false);
        this.mandatoryShow.CallContactPostcode = false;

        if (this.getControlValue('ContractRequiredList')) {
            let findInString1: any = this.getControlValue('ContractRequiredList').indexOf(',' + this.getControlValue('ContactTypeDetailCode') + ',', 1);
            if (findInString1 > 0) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
                this.mandatoryShow.ContractNumber = true;
            }
        }

        if (this.getControlValue('PremiseRequiredList')) {
            let findInString2: any = this.getControlValue('PremiseRequiredList').indexOf(',' + this.getControlValue('ContactTypeDetailCode') + ',', 1);
            if (findInString1 > 0) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', true);
                this.mandatoryShow.PremiseNumber = true;
            }
        }

        if (this.getControlValue('ProductRequiredList')) {
            let findInString2: any = this.getControlValue('ProductRequiredList').indexOf(',' + this.getControlValue('ContactTypeDetailCode') + ',', 1);
            if (findInString1 > 0) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductCode', true);
                this.mandatoryShow.ProductCode = true;
            }
        }

        if (this.getControlValue('PostcodeRequiredList')) {
            let findInString2: any = this.getControlValue('PostcodeRequiredList').indexOf(',' + this.getControlValue('ContactTypeDetailCode') + ',', 1);
            if (findInString1 > 0) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactPostCode', true);
                this.mandatoryShow.CallContactPostCode = true;
            }
        }
    }
    /**
     * Method to Implement 'Notify Call Closure' Drop Down Change Operation
     * 'Detail' Drop Down (Set Email Or Mobile Field Mandatory)
     * @params:  params: void
     * @return: void
     */
    public onNotificationCloseTypeSelectChange(): void {
        switch (this.getControlValue('NotificationCloseType')) {
            case '0':
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactEmail', false);
                this.mandatoryShow.CallContactEmail = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactMobile', false);
                this.mandatoryShow.CallContactMobile = false;
                break;
            case '1':
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactEmail', true);
                this.mandatoryShow.CallContactEmail = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactMobile', false);
                this.mandatoryShow.CallContactMobile = false;
                break;
            case '2':
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactEmail', false);
                this.mandatoryShow.CallContactEmail = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CallContactMobile', true);
                this.mandatoryShow.CallContactMobile = true;
                break;
        }
    }
    /**
     * Method to Update Transaction Fields On Change or Blur
     * @params: params: e: any($event), name: any(field name)
     * @return: void
     */
    public onTransactionDetailsChange(e: any, name: any): void {
        let productChildParams: any = this.ellipsisConfig.product.childConfigParams;
        let premiseChildParams: any = this.ellipsisConfig.premise.childConfigParams;
        if (name === 'contract' && e.target.value.length > 0) {
            this.setControlValue('ContractNumber', e.target.value);
            premiseChildParams['ContractNumber'] = this.getControlValue('ContractNumber');
            premiseChildParams['ContractName'] = this.getControlValue('ContractName');
            productChildParams['ContractNumber'] = this.getControlValue('ContractNumber');
            productChildParams['ContractName'] = this.getControlValue('ContractName');
        }
        if (name === 'contract' && e.target.value.length === 0) {
            this.setControlValue('ContractNumber', '');
            this.setControlValue('ContractName', '');
            this.setControlValue('PremiseNumber', '');
            this.setControlValue('PremiseName', '');
            premiseChildParams['ContractNumber'] = '';
            premiseChildParams['ContractName'] = '';
            productChildParams['PremiseNumber'] = '';
            productChildParams['PremiseName'] = '';
            productChildParams['ContractNumber'] = '';
            productChildParams['ContractName'] = '';
        }
        if (name === 'premise' && e.target.value.length > 0) {
            productChildParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
            productChildParams['PremiseName'] = this.getControlValue('PremiseName');
        }
        if (name === 'premise' && e.target.value.length === 0) {
            this.setControlValue('PremiseNumber', '');
            this.setControlValue('PremiseName', '');
            this.setControlValue('ProductCode', '');
            this.setControlValue('ProductDesc', '');
            productChildParams['PremiseNumber'] = '';
            productChildParams['PremiseName'] = '';
        }
        if (name === 'product' && e.target.value.length === 0) {
            this.setControlValue('ProductCode', '');
            this.setControlValue('ProductDesc', '');
        }
    }
    /**
     * Method To Implement 'Clear Account Details' Button Click Operations
     * And Clear Account Details If Available
     * @params: params: void
     * @return: void
     */
    public onCmdClearAcctClick(): void {
        if (this.lClearAccount === 'Y') {
            this.lClearAccount = 'N';
            this.fieldHidden.tdcmdContactAcct = false;
            this.fieldHidden.tdContactLabelStandard = true;
            this.fieldHidden.tdContactLabelNew = false;
            this.fieldHidden.tdcmdContactPrem = false;
            this.fieldHidden.tdcmdContactTicket = false;
            this.fieldHidden.tdContactLabelFromTicket = false;
            this.fieldHidden.cmdContacts = !this.isGlMultiContactInd || true;
            this.cmdClearAcct = MessageConstant.PageSpecificMessage.cmdRestoreAcct;
            this.cmdCreate = MessageConstant.PageSpecificMessage.cmdCreateNew;

            this.setControlValue('SaveAccountNumber', this.getControlValue('AccountNumber'));
            this.setControlValue('SaveAccountName', this.getControlValue('AccountName'));
            this.setControlValue('SaveAccountProspectName', this.getControlValue('AccountProspectName'));
            this.setControlValue('SaveAccountAddressLine1', this.getControlValue('AccountAddressLine1'));
            this.setControlValue('SaveAccountAddressLine2', this.getControlValue('AccountAddressLine2'));
            this.setControlValue('SaveAccountAddressLine3', this.getControlValue('AccountAddressLine3'));
            this.setControlValue('SaveAccountAddressLine4', this.getControlValue('AccountAddressLine4'));
            this.setControlValue('SaveAccountAddressLine5', this.getControlValue('AccountAddressLine5'));
            this.setControlValue('SaveAccountPostcode', this.getControlValue('AccountPostcode'));
            this.setControlValue('SaveAccountContactName', this.getControlValue('AccountContactName'));
            this.setControlValue('SaveAccountContactPosition', this.getControlValue('AccountContactPosition'));
            this.setControlValue('SaveAccountContactTelephone', this.getControlValue('AccountContactTelephone'));
            this.setControlValue('SaveAccountContactMobile', this.getControlValue('AccountContactMobile'));
            this.setControlValue('SaveAccountContactFax', this.getControlValue('AccountContactFax'));
            this.setControlValue('SaveAccountContactEmail', this.getControlValue('AccountContactEmail'));
            this.setControlValue('SaveASelectedTicketNumber', this.getControlValue('SelectedTicketNumber'));

            this.setControlValue('SaveContractNumber', this.getControlValue('ContractNumber'));
            this.setControlValue('SaveContractName', this.getControlValue('ContractName'));
            this.setControlValue('SavePremiseNumber', this.getControlValue('PremiseNumber'));
            this.setControlValue('SavePremiseName', this.getControlValue('PremiseName'));
            this.setControlValue('SaveProductCode', this.getControlValue('ProductCode'));
            this.setControlValue('SaveProductDesc', this.getControlValue('ProductDesc'));
            this.setControlValue('SaveServiceCoverNumber', this.getControlValue('ServiceCoverNumber'));
            this.setControlValue('SaveServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
            this.setControlValue('SaveCallContactName', this.getControlValue('CallContactName'));
            this.setControlValue('SaveCallContactPosition', this.getControlValue('CallContactPosition'));
            this.setControlValue('SaveCallContactTelephone', this.getControlValue('CallContactTelephone'));
            this.setControlValue('SaveCallContactMobile', this.getControlValue('CallContactMobile'));
            this.setControlValue('SaveCallContactEmail', this.getControlValue('CallContactEmail'));
            this.setControlValue('SaveCallContactFax', this.getControlValue('CallContactFax'));
            this.setControlValue('SaveCallContactPostcode', this.getControlValue('CallContactPostcode'));
            this.setControlValue('SaveCallTicketReference', this.getControlValue('CallTicketReference'));

            this.setControlValue('CallAddressName', this.getControlValue('SaveCallAddressName'));
            this.setControlValue('CallAddressLine1', this.getControlValue('SaveCallAddressLine1'));
            this.setControlValue('CallAddressLine2', this.getControlValue('SaveCallAddressLine2'));
            this.setControlValue('CallAddressLine3', this.getControlValue('SaveCallAddressLine3'));
            this.setControlValue('CallAddressLine4', this.getControlValue('SaveCallAddressLine4'));
            this.setControlValue('CallAddressLine5', this.getControlValue('SaveCallAddressLine5'));

            this.setControlValue('AccountNumber', '');
            this.setControlValue('AccountName', '');
            this.setControlValue('AccountProspectName', '');
            this.setControlValue('AccountAddressLine1', '');
            this.setControlValue('AccountAddressLine2', '');
            this.setControlValue('AccountAddressLine3', '');
            this.setControlValue('AccountAddressLine4', '');
            this.setControlValue('AccountAddressLine5', '');
            this.setControlValue('AccountPostcode', '');
            this.setControlValue('ContractNumber', '');
            this.setControlValue('ContractName', '');
            this.setControlValue('PremiseNumber', '');
            this.setControlValue('PremiseName', '');
            this.setControlValue('ProductCode', '');
            this.setControlValue('ProductDesc', '');
            this.setControlValue('ServiceCoverNumber', '');
            this.setControlValue('ServiceCoverRowID', '');
            this.setControlValue('SelectedTicketNumber', '');
            this.setControlValue('CallContactName', '');
            this.setControlValue('CallContactPosition', '');
            this.setControlValue('CallContactTelephone', '');
            this.setControlValue('CallContactMobile', '');
            this.setControlValue('CallContactEmail', '');
            this.setControlValue('CallContactFax', '');
            this.setControlValue('CallContactPostcode', '');
            this.setControlValue('CallTicketReference', '');
        } else {
            this.lClearAccount = 'Y';
            this.fieldHidden.tdcmdContactAcct = false;
            if (this.getControlValue('SavePremiseNumber')) {
                this.fieldHidden.tdcmdContactPrem = false;
            }
            if (this.getControlValue('SaveSelectedTicketNumber')) {
                this.fieldHidden.tdcmdContactTicket = false;
            }
            if (this.isGlMultiContactInd) {
                this.fieldHidden.cmdContacts = true;
            } else {
                this.fieldHidden.cmdContacts = false;
            }

            this.fieldHidden.tdContactLabelStandard = false;
            this.fieldHidden.tdContactLabelNew = true;
            this.cmdClearAcct = MessageConstant.PageSpecificMessage.cmdClearAcct;
            this.cmdCreate = MessageConstant.PageSpecificMessage.cmdCreateExist;

            this.setControlValue('AccountNumber', this.getControlValue('SaveAccountNumber'));
            this.setControlValue('AccountName', this.getControlValue('SaveAccountName'));
            this.setControlValue('AccountProspectName', this.getControlValue('SaveAccountProspectName'));
            this.setControlValue('AccountAddressLine1', this.getControlValue('SaveAccountAddressLine1'));
            this.setControlValue('AccountAddressLine2', this.getControlValue('SaveAccountAddressLine2'));
            this.setControlValue('AccountAddressLine3', this.getControlValue('SaveAccountAddressLine3'));
            this.setControlValue('AccountAddressLine4', this.getControlValue('SaveAccountAddressLine4'));
            this.setControlValue('AccountAddressLine5', this.getControlValue('SaveAccountAddressLine5'));
            this.setControlValue('AccountPostcode', this.getControlValue('SaveAccountPostcode'));
            this.setControlValue('AccountContactName', this.getControlValue('SaveAccountContactName'));
            this.setControlValue('AccountContactPosition', this.getControlValue('SaveAccountContactPosition'));
            this.setControlValue('AccountContactTelephone', this.getControlValue('SaveAccountContactTelephone'));
            this.setControlValue('AccountContactMobile', this.getControlValue('SaveAccountContactMobile'));
            this.setControlValue('AccountContactFax', this.getControlValue('SaveAccountContactFax'));
            this.setControlValue('AccountContactEmail', this.getControlValue('SaveAccountContactEmail'));

            this.setControlValue('ContractNumber', this.getControlValue('SaveContractNumber'));
            this.setControlValue('ContractName', this.getControlValue('SaveContractName'));
            this.setControlValue('PremiseNumber', this.getControlValue('SavePremiseNumber'));
            this.setControlValue('PremiseName', this.getControlValue('SavePremiseName'));
            this.setControlValue('ProductCode', this.getControlValue('SaveProductCode'));
            this.setControlValue('ProductDesc', this.getControlValue('SaveProductDesc'));
            this.setControlValue('ServiceCoverNumber', this.getControlValue('SaveServiceCoverNumber'));
            this.setControlValue('ServiceCoverRowID', this.getControlValue('SaveServiceCoverRowID'));
            this.setControlValue('SelectedTicketNumber', this.getControlValue('SaveSelectedTicketNumber'));

            this.setControlValue('CallContactName', this.getControlValue('SaveCallContactName'));
            this.setControlValue('CallContactPosition', this.getControlValue('SaveCallContactPosition'));
            this.setControlValue('CallContactTelephone', this.getControlValue('SaveCallContactTelephone'));
            this.setControlValue('CallContactMobile', this.getControlValue('SaveCallContactMobile'));
            this.setControlValue('CallContactEmail', this.getControlValue('SaveCallContactEmail'));
            this.setControlValue('CallContactFax', this.getControlValue('SaveCallContactFax'));
            this.setControlValue('CallContactPostcode', this.getControlValue('SaveCallContactPostcode'));
            this.setControlValue('CallTicketReference', this.getControlValue('SaveCallTicketReference'));

            this.setControlValue('SaveCallAddressName', this.getControlValue('CallAddressName'));
            this.setControlValue('SaveCallAddressLine1', this.getControlValue('CallAddressLine1'));
            this.setControlValue('SaveCallAddressLine2', this.getControlValue('CallAddressLine2'));
            this.setControlValue('SaveCallAddressLine3', this.getControlValue('CallAddressLine3'));
            this.setControlValue('SaveCallAddressLine4', this.getControlValue('CallAddressLine4'));
            this.setControlValue('SaveCallAddressLine5', this.getControlValue('CallAddressLine5'));

            this.riExchange.getParentHTMLValue('SelectedTicketNumber');
        }

        this.showHideAddressDetails();
        this.riExchange.setParentHTMLValue('AccountNumber', this.getControlValue('AccountNumber'));
        this.riExchange.setParentHTMLValue('AccountProspectNumber', this.getControlValue('AccountNumber'));
        this.riExchange.setParentHTMLValue('AccountProspectName', this.getControlValue('AccountProspectName'));

        this.CallContactName.nativeElement.focus();
    }
    /**
     * Method To Implement 'Contact' Field On Change Operations
     * @params: params: void
     * @return: void
     */
    public onCallContactNameChange(): void {
        if (this.isLShowingAddressInfo) {
            this.setControlValue('CallAddressName', this.getControlValue('CallContactName'));
        }
    }
    /**
     * Method To Set CallNotepadSummary Text To CallNotepad On CallNotepadSummary Change
     * @params: params: void
     * @return: void
     */
    public onCallNotepadSummaryChange(): void {
        if (!this.getControlValue('CallNotepad')) {
            this.setControlValue('CallNotepad', this.getControlValue('CallNotepadSummary'));
            this.setControlValue('CallNotepadText', this.getControlValue('Callnotepad'));
        }
    }
    /**
     * Method To Navigate To 'iCABSAContractInvoiceGrid' Page On 'Select Disputed Invoices' Click
     * @params: params: void
     * @return: void
     */
    public onCmdDisputedInvoicesClick(): void {
        /**
         * @Note: Route CONSTANT Wast Not Available For 'iCABSAContractInvoiceGrid', Hence Using Static Path
         */
        this.setControlValue('DisputedInvoiceCacheName', this.businessCode() + 'A' + this.utils.getBranchCode() + 'A' + this.getControlValue('DisputedInvoiceCacheTime') + 'A' + this.getControlValue('AccountNumber') + 'A' + this.getControlValue('ContractNumber') + 'A' + this.getControlValue('PremiseNumber'));
        this.navigate('ContactCentreSearch', '/billtocash/contract/invoice', {
            parentMode: 'ContactCentreSearch',
            DisputedInvoiceCacheName: this.getControlValue('DisputedInvoiceCacheName')
        });
    }
    /**
     * Method To Open Contract Search Ellipsis Modal On 'Get Contract' Button Click
     * @params: params: void
     * @return: void
     */
    public onCmdSelectContractClick(): void {
        this.ellipsisContractNumber.openModal();
    }
    /**
     * Method To Open Premises Search Ellipsis Modal On 'Get Premise' Button Click
     * @params: params: void
     * @return: void
     */
    public onCmdSelectPremiseClick(): void {
        this.ellipsisPremiseNumber.openModal();
    }
    /**
     * Method To Open Contract Service Cover Details Ellipsis Modal On 'Get Product' Button Click
     * @params: params: void
     * @return: void
     */
    public onCmdSelectProductClick(): void {
        this.ellipsisProductCode.openModal();
    }
    /**
     * Method To Navigate To 'Contact Person Maintenance' Page &
     * Execute Opereations On 'Contact Details' Button Click
     * @params: params: void
     * @return: void
     */
    public onCmdContactsClick(): void {
        let cExchangeMode: any;
        if (!this.getControlValue('AccountNumber')) {
            return;
        }
        //If Public Ticket - None Account
        if (this.getControlValue('AccountNumber').substr(1, 1) === '-') {
            return;
        }
        cExchangeMode = '';
        if (this.getControlValue('AccountNumber') && this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber')) {
            cExchangeMode = 'CCMSearchPremiseNew';
        } else if (this.getControlValue('AccountNumber') && this.getControlValue('ContractNumber')) {
            cExchangeMode = 'CCMSearchContractNew';
        } else if (this.getControlValue('AccountNumber')) {
            cExchangeMode = 'CCMSearchAccountNew';
        }
        if (cExchangeMode) {
            this.navigate(cExchangeMode, InternalMaintenanceServiceModuleRoutes.ICABSCMCONTACTPERSONMAINTENANCE, {
                parentMode: cExchangeMode
            });
        }
    }
    /**
     * Method To Open Get Address Search Ellipsis Modal
     * Or To Navigate To riMPAFSearch Page
     * @params: params: void
     * @return: void
     */
    public onCmdGetAddressClick(): void {
        if (!this.fieldDisable.cmdGetAddress) {
            if (this.isLSCEnableHopewiserPAF) {
                /**
                 * @Note: riMPAFSearch.htm is Not Developed Yet, Will Navigate With Parent Mode 'ContactCentreNewContact'
                 */
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
            }
            else if (this.isLSCEnableDatabasePAF) {
                this.ellipsisConfig.getAddressEllipsis.childConfigParams.ContractAddressLine5 = this.getControlValue('CallAddressLine5');
                this.ellipsisConfig.getAddressEllipsis.childConfigParams.ContractAddressLine4 = this.getControlValue('CallAddressLine4');
                this.ellipsisConfig.getAddressEllipsis.childConfigParams.ContractPostcode = this.getControlValue('CallContactPostcode');
                this.getAddressEllipsis.childConfigParams = this.ellipsisConfig.getAddressEllipsis.childConfigParams;
                this.getAddressEllipsis.updateComponent();
                setTimeout(() => {
                    this.getAddressEllipsis.openModal();
                }, 100);
            }
        }
    }
    /**
     * Method To Set Data Receive From Product Code Search Ellipsis Modal Selection
     * @params: params: void
     * @return: void
     */
    public onCmdGetAddressDataReturn(data: any): void {
        this.setControlValue('CallContactPostcode', data.CallContactPostcode);
        this.setControlValue('CallAddressLine4', data.CallAddressLine4);
        this.setControlValue('CallAddressLine5', data.CallAddressLine5);
    }
    /**
     * Method To Open Contact Postcode Ellipsis Modal
     * Or To Navigate To riMPAFSearch Page
     * @params: params: void
     * @return: void
     */
    public onCmdCallContactPostcodeClick(): void {
        if (!this.fieldDisable.cmdGetAddress) {
            if (this.isLSCEnableHopewiserPAF) {
                /**
                 * @Note: riMPAFSearch.htm is Not Developed Yet, Will Navigate With Parent Mode 'ContactCentreNewContact'
                 */
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
            }
            else if (this.isLSCEnableDatabasePAF) {
                this.ellipsisConfig.aupPostcodeSearchEllipsis.childConfigParams.state = this.getControlValue('CallAddressLine5');
                this.ellipsisConfig.aupPostcodeSearchEllipsis.childConfigParams.town = this.getControlValue('CallAddressLine4');
                this.ellipsisConfig.aupPostcodeSearchEllipsis.childConfigParams.postCode = this.getControlValue('CallContactPostcode');
                this.aupPostcodeSearchEllipsis.childConfigParams = this.ellipsisConfig.aupPostcodeSearchEllipsis.childConfigParams;
                this.aupPostcodeSearchEllipsis.updateComponent();
                setTimeout(() => {
                    this.aupPostcodeSearchEllipsis.openModal();
                }, 100);
            }
        }
    }
    /**
     * Method To Set Data Receive From Contact Postcode Search Ellipsis Modal Selection
     * @params: params: void
     * @return: void
     */
    public onCmdCallContactPostcodeDataReturn(data: any): void {
        this.setControlValue('CallAddressLine4', data.CallAddressLine4);
        this.setControlValue('CallAddressLine5', data.CallAddressLine5);
        this.setControlValue('CallContactPostcode', data.CallContactPostcode);
    }
    /**
     * Method To Clear Summary and Details Field Content
     * @params: params: void
     * @return: void
     */
    public onCmdClearTicketTypeClick(): void {
        this.setControlValue('CallNotepadSummary', '');
        this.setControlValue('CallNotepad', '');
    }
}
