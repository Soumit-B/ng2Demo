import { Component, OnInit, Injector, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { BranchServiceAreaSearchComponent } from './../search/iCABSBBranchServiceAreaSearch';
import { PaymentSearchComponent } from './../search/iCABSBPaymentTypeSearch';
import { CustomerTypeSearchComponent } from './../search/iCABSSCustomerTypeSearch';
import { AUPostcodeSearchComponent } from './../grid-search/iCABSAAUPostcodeSearch';
import { InvoiceGroupGridComponent } from './../grid-search/iCABSAInvoiceGroupGrid';
import { MessageConstant } from './../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSCMCallCentreCreateFixedPriceJob.html'
})
export class CallCentreCreateFixedPriceJobComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGridPricing') riGridPricing: GridAdvancedComponent;
    @ViewChild('riGridSRA') riGridSRA: GridAdvancedComponent;
    @ViewChild('jobPaymentAuthorityCode') jobPaymentAuthorityCode: any;
    @ViewChild('pricingPostCode') pricingPostCode: any;
    @ViewChild('auPostcodeSearch') auPostcodeSearch: EllipsisComponent;
    @ViewChild('navElement') navElement: any;
    @ViewChild('tabContainer') tabContainer: any;
    @ViewChild('btnCreateJob') btnCreateJob: any;

    private headerParams: any = {
        operation: 'ContactManagement/iCABSCMCallCentreCreateFixedPriceJob',
        module: 'call-centre',
        method: 'ccm/maintenance'
    };
    private boolPropertyCareInd: string;
    private boolUserWriteAccess: string;
    private isValidatePageOk: boolean;
    private strBusinessOriginCode: string;
    private strBusinessOriginDesc: string;
    private strPaymentTypeCode: string;
    private strPaymentTypeDesc: string;
    private strPaymentAuthCode: string;
    private strCustomerTypeCode: string;
    private strCustomerTypeDesc: string;
    private dtExpiryDate: Date;
    private isRefreshPricingGrid: boolean = true;
    private currentTab: number = 0;
    private tabLength: number = 4;
    private tabVisited: Array<boolean> = [true, false, false, false];

    public isSeperatorProp: boolean = true;
    public isPaymentTypeUpdatable: boolean = false;
    public isGuaranteeProp1: boolean = false;
    public isGuaranteeProp2: boolean = false;
    public isGuaranteeProp3: boolean = false;
    public isNoGuarantee: boolean = false;
    public isPricingPostCode: boolean = true;
    public isJobPremiseAddressLine3: boolean = true;
    public isJobInvoiceAddressLine3: boolean = false;
    public isJobProspectOriginalNotes: boolean = false;
    public isActionByDetails: boolean = false;
    public isInvoiceGroupNumber: boolean = false;
    public isNotifications: boolean = false;
    public isJobPaymentAuthorityCode: boolean = false;
    public isCompanyVATNumber2: boolean = true;
    public isGetInvoiceAddress: boolean = true;
    public isGetPremiseAddress: boolean = true;
    public isBtnCopyFromPremise: boolean = false;
    public isBtnContactEmployee: boolean = false;
    public isBtnCopyToPremise: boolean = false;
    public isDisableInvoice: boolean = false;
    public totalRecordsPricing: number;
    public currentPagePricing: number = 1;
    public totalRecordsSRA: number;
    public currentPageSRA: number = 1;
    public itemsPerPage: number = 10;
    public strCompanyVATNumberLabel: string;
    public pageId: string = '';
    public controls: Array<any> = [
        //Global
        { name: 'AccountNumber', disabled: true },
        { name: 'AccountProspectName', disabled: true },
        { name: 'CurrentCallLogID', disabled: true },
        //Tab 1 - Pricing Details tab content
        { name: 'PricingPostCode' },
        { name: 'PricingServiceBranchNumber' },
        { name: 'PricingServiceBranchName' },
        { name: 'cmdResetPricing' },
        { name: 'JobProspectOriginalNotes', disabled: true },
        //Tab 2 - Premise Address tab content
        { name: 'JobPremiseName', required: true },
        { name: 'CustomerTypeCode', required: true },
        { name: 'CustomerTypeDesc', disabled: true },
        { name: 'cmdGetPremiseAddress' },
        { name: 'JobPremiseAddressLine1', required: true },
        { name: 'JobPremiseAddressLine2' },
        { name: 'JobPremiseAddressLine3' },
        { name: 'JobPremiseAddressLine4', required: true },
        { name: 'JobPremiseAddressLine5' },
        { name: 'JobPremisePostCode', required: true },
        { name: 'JobPurchaseOrderNo' },
        { name: 'JobClientReference' },
        { name: 'InvoiceGroupNumber', type: MntConst.eTypeInteger },
        { name: 'InvoiceGroupDesc' },
        { name: 'JobPremiseContactName', required: true },
        { name: 'JobPremiseContactPosition', required: true },
        { name: 'JobPremiseContactTelephone', required: true },
        { name: 'JobPremiseContactMobile' },
        { name: 'JobPremiseContactEmail' },
        { name: 'JobPremiseContactFax' },
        { name: 'ContactNotifyWhenSelect' },
        { name: 'GuaranteeRequired' },
        { name: 'AgeOfProperty', type: MntConst.eTypeInteger },
        //Tab 3 -
        { name: 'cmdSRAGenerateText' },
        { name: 'JobSiteRiskAssessment' },
        { name: 'JobSpecialInstructions' },
        { name: 'ContractExpiryDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'BranchServiceAreaCode', required: true, type: MntConst.eTypeCode },
        { name: 'EmployeeCode', disabled: true },
        { name: 'EmployeeSurname', disabled: true },
        { name: 'ActionByDate', type: MntConst.eTypeDate },
        { name: 'ActionByTime', type: MntConst.eTypeTime },
        //Tab 4 -
        { name: 'JobInvoiceName', required: true },
        { name: 'cmdGetInvoiceAddress' },
        { name: 'JobInvoiceAddressLine1', required: true },
        { name: 'JobInvoiceAddressLine2', disabled: true },
        { name: 'JobInvoiceAddressLine3' },
        { name: 'JobInvoiceAddressLine4', required: true },
        { name: 'JobInvoiceAddressLine5' },
        { name: 'JobInvoicePostCode', disabled: true },
        { name: 'JobInvoiceContactName', required: true },
        { name: 'JobInvoiceContactPosition', required: true },
        { name: 'JobInvoiceContactTelephone', required: true },
        { name: 'JobInvoiceContactMobile', disabled: true },
        { name: 'JobInvoiceContactEmail', disabled: true },
        { name: 'JobInvoiceContactFax', disabled: true },
        { name: 'JobPaymentAuthorityCode' },
        { name: 'JobNotes' },
        { name: 'BusinessCompanyVATNumberOriginDesc' },
        { name: 'JobInvoicePostCode' },
        { name: 'ServiceTypeCode', disabled: true },
        { name: 'ServiceTypeDesc', disabled: true },
        { name: 'ContractSalesEmployeeCode', disabled: true },
        { name: 'ContractSalesEmployeeDesc', disabled: true },
        { name: 'PaymentTypeCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'PaymentDesc', disabled: true },
        { name: 'BusinessOriginCode', disabled: true },
        { name: 'BusinessOriginDesc', disabled: true },
        { name: 'NumberBedrooms', required: true, type: MntConst.eTypeInteger },
        { name: 'NoGuaranteeCode' },
        { name: 'ListedCode' },
        { name: 'CompanyVATNumber', type: MntConst.eTypeCode },
        { name: 'CompanyVATNumber2', type: MntConst.eTypeCode },
        { name: 'NoGuaranteeDescription' },
        { name: 'ListedDescription' },
        //buttons
        { name: 'cmdCopyToPremise' },
        { name: 'cmdCopyFromPremise' },
        { name: 'cmdCreateJob' },
        { name: 'cmdRejectJob' },
        { name: 'cmdContactEmployee' },
        { name: 'cmdGetInvoiceAddress' },
        //hidden
        { name: 'SelectedPrice' },
        { name: 'SelectedProduct' },
        { name: 'ContactTypeCode' },
        { name: 'ContactTypeDetailCode' },
        { name: 'SelectedSRA' },
        { name: 'ProspectNumber' },
        { name: 'ContractNumber' },
        { name: 'PremiseNumber' },
        { name: 'ServiceBranchNumber' },
        { name: 'BranchName' },
        { name: 'DefaultAssigneeEmployeeCode' },
        { name: 'CanUpdateCustomerType' },
        { name: 'CanUpdatePaymentType' },
        { name: 'AccountName' },
        { name: 'SelectedAccountName' },
        { name: 'SelectedTicketNumber' },
        { name: 'CallTicketReference' },
        { name: 'CanAmendGuaranteeInd' }
    ];
    public uiTabs: any = {
        tab: {
            tab1: { visible: true, active: true },
            tab2: { visible: true, active: false },
            tab3: { visible: true, active: false },
            tab4: { visible: true, active: false }
        }
    };
    public contactNotifyOptions: Array<any> = [];
    public ellipsisConfig: any = {
        postCodeSearch: {
            disabled: false,
            showCloseButton: true,
            hideIcon: true,
            showHeader: true,
            childConfigParams: {
                parentMode: '',
                postCode: '',
                town: '',
                state: ''
            },
            showAddNew: false,
            component: AUPostcodeSearchComponent
        },
        noGuarantee: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            component: ScreenNotReadyComponent
        },
        invoice: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childConfigParams: {
                parentMode: 'FixedPriceJob',
                AccountNumber: '',
                AccountName: ''
            },
            showAddNew: false,
            component: InvoiceGroupGridComponent
        },
        listedCode: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            component: ScreenNotReadyComponent
        },
        branchServiceAreaCode: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childConfigParams: {
                parentMode: 'LookUp-FixedPricedJob',
                ServiceBranchNumber: '',
                BranchName: ''
            },
            showAddNew: false,
            component: BranchServiceAreaSearchComponent
        },
        customerTypeCode: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            showAddNew: false,
            component: CustomerTypeSearchComponent
        },
        paymentTypeCode: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childConfigParams: {
                parentMode: 'LookUp',
                countryCode: this.utils.getCountryCode(),
                businessCode: this.utils.getBusinessCode()
            },
            showAddNew: false,
            component: PaymentSearchComponent
        }
    };

    constructor(injector: Injector, public el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLCENTRECREATEFIXEDPRICEJOB;
        this.browserTitle = 'Contact Centre - Create Fixed Price Job';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contact Centre - Create Fixed Price Job';

        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.configureHTMLPage();
            this.renderTab(this.pageParams.currentActiveTab);
        } else {
            this.pageParams.gridCacheTime = this.utils.Time();
            this.getSyscharVariable();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    /*****************SpeedScripts and Registry Settings Starts ***************************/
    private getSyscharVariable(): void {
        let sysCharNumbers: Array<any> = [
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableHopewiserPAF,
            this.sysCharConstants.SystemCharEnableDatabasePAF,
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharAddressLine5Required,
            this.sysCharConstants.SystemCharMandatoryTaxRegistrationNumber,
            this.sysCharConstants.SystemCharEnableContractTaxRegistrationNumber2
        ];
        let sysCharIP: any = {
            operation: 'iCABSCMCallCentreCreateFixedPriceJob',
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.pageParams.blnEnablePostCodeDefaulting = data['records'][0].Required;
                this.pageParams.blnSCEnableHopewiserPAF = data['records'][1].Required;
                this.pageParams.blnSCEnableDatabasePAF = data['records'][2].Required;

                this.pageParams.blnSCEnableAddressLine3 = data['records'][3].Required;
                this.pageParams.blnSCAddressLine3Logical = data['records'][3].Logical;

                this.pageParams.blnSCAddressLine5Required = data['records'][4].Required;
                this.pageParams.blnSCAddressLine5Logical = data['records'][4].Logical;

                this.pageParams.blnSCTaxRegNumber = data['records'][5].Required;
                this.pageParams.blnSCEnableTaxRegistrationNumber2 = data['records'][6].Required;

                this.pageParams.strCompanyVATNumberLabel = 'Tax Registration Number' + (this.pageParams.blnSCEnableTaxRegistrationNumber2 ? ' 1' : '');

                this.getRegistrySetting('Default BusinessOriginCode', 'strDefaultBusinessOriginCode');
                this.getRegistrySetting('Default ContractLength (Months)', 'iDefaultContractLength');
                this.getRegistrySetting('Default CustomerTypeCode', 'strDefaultCustomerTypeCode');
                this.getRegistrySetting('Default PaymentTypeCode', 'strDefaultPaymentTypeCode');
            }
        });
    }

    private getRegistrySetting(regKey: string, strAssign: string): void {
        let lookupIP: Array<any> = [{
            'table': 'riRegistry',
            'query': {
                'regSection': 'Contact Centre Jobs',
                'regKey': this.utils.getBusinessCode() + '_' + regKey
            },
            'fields': ['regValue']
        }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                let dataReturned = data[0];

                if (dataReturned.length > 0) {
                    this.pageParams[strAssign] = dataReturned[0].RegValue;
                    if (strAssign === 'strDefaultBusinessOriginCode') {
                        this.getBusinessOriginDesc();
                    }
                    else if (strAssign === 'iDefaultContractLength') {
                        if (dataReturned[0]) {
                            this.pageParams.iDefaultContractLength = dataReturned[0].RegValue;
                        } else {
                            this.pageParams.iDefaultContractLength = 3;
                        }
                    }
                }
            }
        }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
        });
    }

    private getBusinessOriginDesc(): void {
        let lookupIP: any[] = [{
            'table': 'BusinessOrigin',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'BusinessOriginCode': this.pageParams.strDefaultBusinessOriginCode
            },
            'fields': ['BusinessOriginSystemDesc']
        }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                if (data[0] && data[0].length > 0) {
                    let businessOrigin: any = data[0][0];
                    if (businessOrigin) {
                        this.getBusinessOriginLang(businessOrigin.BusinessOriginSystemDesc);
                    }
                }
            }
        }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
        });
    }

    private getBusinessOriginLang(businessOriginSystemDesc: string): void {
        let lookupIP: any[] = [{
            'table': 'BusinessOriginLang',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'BusinessOriginCode': this.pageParams.strDefaultBusinessOriginCode,
                'LanguageCode': this.riExchange.LanguageCode()
            },
            'fields': ['BusinessOriginDesc']
        }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                if (data[0] && data[0].length > 0) {
                    let businessOriginLang: any = data[0][0];
                    this.pageParams.strDefaultBusinessOriginDesc = businessOriginLang ? businessOriginLang.BusinessOriginDesc : businessOriginSystemDesc;
                    this.configureHTMLPage();
                }
            }
        }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
        });
    }
    /*****************SpeedScripts Ends ***************************************************/

    /**********************Page Code Starts *********************/
    private configureHTMLPage(): void {
        this.pageParams.blnDefPaymentAuthCode = true;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceAddressLine3', this.pageParams.blnSCAddressLine3Logical);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPremiseAddressLine3', this.pageParams.blnSCAddressLine3Logical);

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceAddressLine5', this.pageParams.blnSCAddressLine5Logical);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPremiseAddressLine5', this.pageParams.blnSCAddressLine5Logical);

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyVATNumber', this.pageParams.blnSCTaxRegNumber);
        this.isCompanyVATNumber2 = this.pageParams.blnSCEnableTaxRegistrationNumber2;

        this.findPropertyCareBranch();
    }

    private findPropertyCareBranch(): void {
        let postSearchParams: URLSearchParams = this.getURLSearchParamObject(), postParams: any = {};

        postSearchParams.set(this.serviceConstants.Action, '6');
        postParams.Function = 'Request';
        postParams.BranchNumber = this.utils.getBranchCode();

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.boolPropertyCareInd = data.PropertyCareInd;
                }
                this.customerInfoFunctions();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private getInitialDetails(): void {
        // Gets Notification Details And Where A Prospect Has Been Previously Selected Get The Details
        let postSearchParams: URLSearchParams = this.getURLSearchParamObject(), postParams: any = {};

        postSearchParams.set(this.serviceConstants.Action, '6');
        postParams.Function = 'GetInitialDetails';
        postParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
        postParams.ContactTypeDetailCode = this.getControlValue('ContactTypeDetailCode');
        postParams.LoggedBranchNumber = this.utils.getBranchCode();
        postParams.AccountNumber = this.getControlValue('AccountNumber');
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        postParams.ProspectNumber = this.getControlValue('ProspectNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    let cCodeList: any, cDescList: any;
                    this.setControlValue('CanAmendGuaranteeInd', data.CanAmendGuaranteeInd);

                    // Default Details from selected contract/premise
                    if (this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber') && (this.getControlValue('PremiseNumber') !== '0')) {
                        this.setControlValue('JobPremiseName', data.JobName);
                        this.setControlValue('JobPremiseAddressLine1', data.JobAddressLine1);
                        this.setControlValue('JobPremiseAddressLine2', data.JobAddressLine2);
                        this.setControlValue('JobPremiseAddressLine3', data.JobAddressLine3);
                        this.setControlValue('JobPremiseAddressLine4', data.JobAddressLine4);
                        this.setControlValue('JobPremiseAddressLine5', data.JobAddressLine5);
                        this.setControlValue('JobPremisePostCode', data.JobPostcode);
                        this.setControlValue('JobPremiseContactName', this.riExchange.getParentHTMLValue('CallContactName'));
                        this.setControlValue('JobPremiseContactPosition', this.riExchange.getParentHTMLValue('CallContactPosition'));
                        this.setControlValue('JobPremiseContactTelephone', this.riExchange.getParentHTMLValue('CallContactTelephone'));
                        this.setControlValue('JobPremiseContactFax', this.riExchange.getParentHTMLValue('CallContactFax'));
                        this.setControlValue('JobPremiseContactEmail', this.riExchange.getParentHTMLValue('CallContactEmail'));
                        this.setControlValue('JobPremiseContactMobile', this.riExchange.getParentHTMLValue('CallContactMobile'));
                        this.setControlValue('JobClientReference', data.JobClientReference);
                        this.setControlValue('JobNotes', this.riExchange.getParentAttributeValue('value'));
                        this.setControlValue('JobSpecialInstructions', this.getControlValue('JobNotes'));
                    }

                    // Default details from previously entered prospect
                    if (this.getControlValue('ProspectNumber') && (this.getControlValue('ProspectNumber') === '0')) {
                        if (this.getControlValue('JobInvoiceName')) {
                            this.setControlValue('JobInvoiceName', data.JobName);
                        }

                        if (this.getControlValue('JobInvoiceAddressLine1')) {
                            this.setControlValue('JobInvoiceAddressLine1', data.JobAddressLine1);
                        }

                        if (this.getControlValue('JobInvoiceAddressLine2')) {
                            this.setControlValue('JobInvoiceAddressLine2', data.JobAddressLine2);
                        }

                        if (this.getControlValue('JobInvoiceAddressLine3')) {
                            this.setControlValue('JobInvoiceAddressLine3', data.JobAddressLine3);
                        }

                        if (this.getControlValue('JobInvoiceAddressLine4')) {
                            this.setControlValue('JobInvoiceAddressLine4', data.JobAddressLine4);
                        }

                        if (this.getControlValue('JobInvoiceAddressLine5')) {
                            this.setControlValue('JobInvoiceAddressLine5', data.JobAddressLine5);
                        }

                        this.setControlValue('JobProspectOriginalNotes', data.JobOriginalNotes);
                        this.setControlValue('JobPurchaseOrderNo', data.JobPurchaseOrderNo);
                        this.setControlValue('JobClientReference', data.JobClientReference);
                        this.setControlValue('JobSpecialInstructions', this.getControlValue('JobNotes'));
                        this.isJobProspectOriginalNotes = true;
                    }

                    cCodeList = '0';
                    cDescList = 'No Notifications';

                    if (data.ShowActionByDetails === 'Y') {
                        this.isActionByDetails = true;
                        this.setControlValue('ActionByDate', data.ActionByDate);
                        this.setControlValue('ActionByTime', data.ActionByTime);

                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ActionByDate', true);
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ActionByTime', true);
                    } else {
                        this.isActionByDetails = false;
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ActionByDate', false);
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ActionByTime', false);
                    }

                    if (data.CanUpdateInvoiceGroup === 'Y') {
                        this.isInvoiceGroupNumber = true;
                        this.setControlValue('InvoiceGroupNumber', data.InvoiceGroupNumber);
                        this.setControlValue('InvoiceGroupDesc', data.InvoiceGroupDesc);
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', true);
                    } else {
                        this.isInvoiceGroupNumber = false;
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceGroupNumber', false);
                    }

                    this.setControlValue('PaymentTypeCode', data.PaymentTypeCode);
                    this.setControlValue('PaymentDesc', data.PaymentTypeDesc);
                    this.setControlValue('CustomerTypeCode', data.CustomerTypeCode);
                    this.setControlValue('CustomerTypeDesc', data.CustomerTypeDesc);
                    this.setControlValue('CanUpdateCustomerType', data.CanUpdateCustomerType);
                    this.setControlValue('CanUpdatePaymentType', data.CanUpdatePaymentType);

                    if (data.PaymentAuthReq === 'Y') {
                        this.pageParams.blnDefPaymentAuthCode = true;
                    } else {
                        this.pageParams.blnDefPaymentAuthCode = false;
                    }

                    if (data.EmailInd === 'Y' || data.SMSInd === 'Y') {
                        this.isNotifications = true;
                        if (data.EmailInd === 'Y') {
                            cCodeList = cCodeList + '^1';
                            this.utils.getTranslatedval('Using Email').then((res: string) => {
                                cDescList = cDescList + '^' + res;
                            });

                        }
                        if (data.SMSInd === 'Y') {
                            cCodeList = cCodeList + '^2';
                            this.utils.getTranslatedval('Using SMS').then((res: string) => {
                                cDescList = cDescList + '^' + res;
                            });
                        }
                    }

                    let valArray: Array<any> = cCodeList.split('^', -1, 1);
                    let descArray: Array<any> = cDescList.split('^', -1, 1);
                    for (let i = 0; i < valArray.length; i++) {
                        let option = {
                            value: valArray[i],
                            desc: descArray[i]
                        };
                        this.contactNotifyOptions.push(option);
                    }

                    // Default To An Appropriate Value
                    if (data.EmailInd === 'N' && data.SMSInd === 'N') {
                        this.setControlValue('ContactNotifyWhenSelect', '0');
                    } else {
                        if (data.EmailInd === 'Y') {
                            this.setControlValue('ContactNotifyWhenSelect', '1');
                        } else {
                            this.setControlValue('ContactNotifyWhenSelect', '2');
                        }
                    }
                    this.contactNotifyWhenSelectOnChange();

                    this.doOtherOperation();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private customerInfoFunctions(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('Mode', 'CheckBranchUserRights');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.boolUserWriteAccess = data.WriteAccess;
                }
                this.getParentHTMLValues();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private doOtherOperation(): void {
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountProspectName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'CurrentCallLogID');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceGroupDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ListedDescription');
        this.riExchange.riInputElement.Disable(this.uiForm, 'NoGuaranteeDescription');

        this.isGetInvoiceAddress = false;
        this.isGetPremiseAddress = false;

        if (this.pageParams.blnSCEnableHopewiserPAF || this.pageParams.blnSCEnableDatabasePAF) {
            if (!this.getControlValue('AccountNumber')) {
                this.isGetInvoiceAddress = true;
            }
            this.isGetPremiseAddress = true;
        }

        if (this.pageParams.blnSCEnableAddressLine3) {
            this.isJobPremiseAddressLine3 = true;
            this.isJobInvoiceAddressLine3 = true;
        }

        if (this.getControlValue('CanUpdateCustomerType') === 'N') {
            this.disableControl('CustomerTypeCode', true);
        }
        if (this.getControlValue('CanUpdatePaymentType') === 'N') {
            this.isPaymentTypeUpdatable = false;
            this.disableControl('PaymentTypeCode', true);
        } else {
            this.isPaymentTypeUpdatable = true;
            this.disableControl('PaymentTypeCode', false);
        }

        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPaymentAuthorityCode', this.pageParams.blnDefPaymentAuthCode);
        this.isJobPaymentAuthorityCode = this.pageParams.blnDefPaymentAuthCode;

        if (!this.getControlValue('AccountNumber')) {
            this.cmdCopyToPremiseOnClick();
            this.isBtnCopyFromPremise = true;
        }

        if (this.pageParams.blnEnablePostCodeDefaulting) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PricingPostCode', true);
            this.pricingPostCodeHasChanged(false);
            this.disableControl('PricingServiceBranchNumber', true);
            this.disableControl('JobPremisePostCode', true);
        } else {
            this.isPricingPostCode = false;
        }

        this.setControlValue('BusinessOriginCode', this.pageParams.strDefaultBusinessOriginCode);
        this.setControlValue('BusinessOriginDesc', this.pageParams.strDefaultBusinessOriginDesc);

        let curDate: Date = new Date(this.getControlValue('ActionByDate'));
        let curMonth: any = curDate.getMonth();
        let monthsToBeAdded: any = parseInt(this.pageParams.iDefaultContractLength, 10);
        let newDate: Date = new Date(curDate.setMonth(curMonth + monthsToBeAdded));
        this.setControlValue('ContractExpiryDate', newDate);

        if (this.getControlValue('AccountNumber')) {   // Create Ticket (New Customer))
            if (this.getControlValue('PremiseNumber') === '' || this.getControlValue('PremiseNumber') === '0' || !this.getControlValue('PremiseNumber')) {
                this.setControlValue('JobPremiseName', this.riExchange.getParentHTMLValue('CallContactName'));
                this.setControlValue('JobPremiseContactName', this.riExchange.getParentHTMLValue('CallContactName'));
                this.setControlValue('JobPremiseContactPosition', this.riExchange.getParentHTMLValue('CallContactPosition'));
                this.setControlValue('JobPremiseContactTelephone', this.riExchange.getParentHTMLValue('CallContactTelephone'));
                this.setControlValue('JobPremiseContactFax', this.riExchange.getParentHTMLValue('CallContactFax'));
                this.setControlValue('JobPremiseContactEmail', this.riExchange.getParentHTMLValue('CallContactEmail'));
                this.setControlValue('JobPremiseContactMobile', this.riExchange.getParentHTMLValue('CallContactMobile'));
                this.setControlValue('JobNotes', this.riExchange.getParentAttributeValue('CallNotepad'));
                this.setControlValue('JobSpecialInstructions', this.getControlValue('JobNotes'));
            }
        }

        this.setControlValue('GuaranteeRequired', true);
        this.setGuaranteeRequiredFields();

        if (this.getControlValue('CanAmendGuaranteeInd') === 'N') {
            this.disableControl('GuaranteeRequired', true);
        }
    }

    private getParentHTMLValues(): void {
        this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.setControlValue('AccountProspectName', this.riExchange.getParentHTMLValue('AccountProspectName'));
        this.setControlValue('AccountName', this.getControlValue('AccountProspectName'));
        this.setControlValue('CurrentCallLogID', this.riExchange.getParentHTMLValue('CurrentCallLogID'));
        this.setControlValue('ContactTypeCode', this.riExchange.getParentHTMLValue('ContactTypeCode'));
        this.setControlValue('ContactTypeDetailCode', this.riExchange.getParentHTMLValue('ContactTypeDetailCode'));
        this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
        this.setControlValue('SelectedTicketNumber', this.riExchange.getParentHTMLValue('SelectedTicketNumber'));
        if (this.getControlValue('AccountNumber')) {
            this.ellipsisConfig.invoice.childConfigParams.AccountNumber = this.getControlValue('AccountNumber');
            this.ellipsisConfig.invoice.childConfigParams.AccountName = this.getControlValue('AccountProspectName');
        }
        this.updateRequireDisableStatus();

        this.setControlValue('PricingPostCode', this.riExchange.getParentHTMLValue('CallContactPostcode'));
        if (!this.getControlValue('PricingPostCode')) {
            this.setControlValue('PricingPostCode', this.riExchange.getParentHTMLValue('AccountPostCode'));
        }
        this.pricingPostCodeOnChange();
        this.setControlValue('JobPremisePostCode', this.getControlValue('PricingPostCode'));

        // If a Contract/Premise has been entered then default the account and premise address info
        // N.B. The following 'account related' block will overwrite any account related address info
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));

        this.getAddressDetails();

        //riExchange.GetParentHTMLInputValue('CallTicketReference')
        this.getInitialDetails();
        this.buildPricingGrid();
        this.buildSRAGrid();
    }

    private updateRequireDisableStatus(): void {
        if (this.getControlValue('AccountNumber')) {
            this.isDisableInvoice = true;
            this.disableControl('JobInvoiceName', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceName', false);
            this.disableControl('JobInvoiceAddressLine1', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceAddressLine1', false);
            this.disableControl('JobInvoiceAddressLine2', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceAddressLine2', false);
            this.disableControl('JobInvoiceAddressLine3', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceAddressLine3', false);
            this.disableControl('JobInvoiceAddressLine4', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceAddressLine4', false);
            this.disableControl('JobInvoiceAddressLine5', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceAddressLine5', false);
            this.disableControl('JobInvoicePostCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoicePostCode', false);
            this.disableControl('JobInvoiceContactName', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceContactName', false);
            this.disableControl('JobInvoiceContactPosition', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceContactPosition', false);
            this.disableControl('JobInvoiceContactTelephone', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceContactTelephone', false);
            this.disableControl('JobInvoiceContactMobile', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceContactMobile', false);
            this.disableControl('JobInvoiceContactEmail', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceContactEmail', false);
            this.disableControl('JobInvoiceContactFax', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobInvoiceContactFax', false);
        }

        this.disableControl('CustomerTypeDesc', true);
        this.disableControl('ContractExpiryDate', true);
        this.disableControl('PricingServiceBranchName', true);
        this.disableControl('EmployeeCode', true);
        this.disableControl('EmployeeSurname', true);
        this.disableControl('ServiceTypeCode', true);
        this.disableControl('ServiceTypeDesc', true);
        this.disableControl('ContractSalesEmployeeCode', true);
        this.disableControl('ContractSalesEmployeeDesc', true);
        this.disableControl('PaymentDesc', true);
        this.disableControl('BusinessOriginCode', true);
        this.disableControl('BusinessOriginDesc', true);
        this.disableControl('JobProspectOriginalNotes', true);
    }

    private getAddressDetails(): void {
        if (this.getControlValue('AccountNumber')) {
            this.setControlValue('JobInvoiceName', this.riExchange.getParentHTMLValue('AccountName'));
            this.setControlValue('JobInvoiceAddressLine1', this.riExchange.getParentHTMLValue('AccountAddressLine1'));
            this.setControlValue('JobInvoiceAddressLine2', this.riExchange.getParentHTMLValue('AccountAddressLine2'));
            this.setControlValue('JobInvoiceAddressLine3', this.riExchange.getParentHTMLValue('AccountAddressLine3'));
            this.setControlValue('JobInvoiceAddressLine4', this.riExchange.getParentHTMLValue('AccountAddressLine4'));
            this.setControlValue('JobInvoiceAddressLine5', this.riExchange.getParentHTMLValue('AccountAddressLine5'));
            this.setControlValue('JobInvoicePostCode', this.riExchange.getParentHTMLValue('AccountPostCode'));
            this.setControlValue('JobInvoiceContactName', this.riExchange.getParentHTMLValue('AccountContactName'));
            this.setControlValue('JobInvoiceContactPosition', this.riExchange.getParentHTMLValue('AccountContactPosition'));
            this.setControlValue('JobInvoiceContactTelephone', this.riExchange.getParentHTMLValue('AccountContactTelephone'));
            this.setControlValue('JobInvoiceContactMobile', this.riExchange.getParentHTMLValue('AccountContactMobile'));
            this.setControlValue('JobInvoiceContactFax', this.riExchange.getParentHTMLValue('AccountContactFax'));
            this.setControlValue('JobInvoiceContactEmail', this.riExchange.getParentHTMLValue('AccountContactEmail'));
        }
        else {
            this.setControlValue('JobInvoiceName', this.riExchange.getParentHTMLValue('CallAddressName'));
            this.setControlValue('JobInvoiceAddressLine1', this.riExchange.getParentHTMLValue('CallAddressLine1'));
            this.setControlValue('JobInvoiceAddressLine2', this.riExchange.getParentHTMLValue('CallAddressLine2'));
            this.setControlValue('JobInvoiceAddressLine3', this.riExchange.getParentHTMLValue('CallAddressLine3'));
            this.setControlValue('JobInvoiceAddressLine4', this.riExchange.getParentHTMLValue('CallAddressLine4'));
            this.setControlValue('JobInvoiceAddressLine5', this.riExchange.getParentHTMLValue('CallAddressLine5'));
            this.setControlValue('JobInvoicePostCode', this.riExchange.getParentHTMLValue('CallContactPostcode'));
            this.setControlValue('JobInvoiceContactName', this.riExchange.getParentHTMLValue('CallContactName'));
            this.setControlValue('JobInvoiceContactPosition', this.riExchange.getParentHTMLValue('CallContactPosition'));
            this.setControlValue('JobInvoiceContactTelephone', this.riExchange.getParentHTMLValue('CallContactTelephone'));
            this.setControlValue('JobInvoiceContactMobile', this.riExchange.getParentHTMLValue('CallContactMobile'));
            this.setControlValue('JobInvoiceContactFax', this.riExchange.getParentHTMLValue('CallContactFax'));
            this.setControlValue('JobInvoiceContactEmail', this.riExchange.getParentHTMLValue('CallContactEmail'));
            this.setControlValue('JobNotes', this.riExchange.getParentAttributeValue('CallNotepad'));
            this.setControlValue('JobSpecialInstructions', this.getControlValue('JobNotes'));
        }
    }

    /*****************************
     * Pricing Grid  Code Starts *
     * ***************************/
    public buildPricingGrid(): void {
        this.riGridPricing.HighlightBar = true;
        this.riGridPricing.FunctionPaging = true;

        this.riGridPricing.Clear();
        this.riGridPricing.AddColumn('grJobSaleDesc', 'grJobSaleDesc', 'grJobSaleDesc', MntConst.eTypeTextFree, 50, false);
        this.riGridPricing.AddColumn('grProductCode', 'grProductCode', 'grProductCode', MntConst.eTypeTextFree, 10, false);
        this.riGridPricing.AddColumn('grProductCodeDetail', 'grProductCodeDetail', 'grProductCodeDetail', MntConst.eTypeTextFree, 50, false);
        this.riGridPricing.AddColumn('grVisitFrequency', 'grVisitFrequency', 'grVisitFrequency', MntConst.eTypeTextFree, 10, false);
        this.riGridPricing.AddColumn('grListPrice', 'grListPrice', 'grListPrice', MntConst.eTypeCurrency, 10, false);
        this.riGridPricing.AddColumn('grListPriceInclTax', 'grListPriceInclTax', 'grListPriceInclTax', MntConst.eTypeCurrency, 10, false);
        this.riGridPricing.AddColumn('grSelected', 'grSelected', 'grSelected', MntConst.eTypeImage, 0, true);
        this.riGridPricing.Complete();
    }

    public riGridPricingBeforeExecute(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '2');

        searchParams.set('GridName', 'Pricing');
        searchParams.set('GridCacheTime', this.pageParams.gridCacheTime);
        searchParams.set('AccountNumber', this.getControlValue('AccountNumber'));
        searchParams.set('PricingPostCode', this.getControlValue('PricingPostCode'));
        searchParams.set('ServiceBranchNumber', this.getControlValue('PricingServiceBranchNumber'));
        searchParams.set('riGridMode', '0');
        searchParams.set('riGridHandle', this.utils.gridHandle);
        searchParams.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        searchParams.set(this.serviceConstants.PageCurrent, this.currentPagePricing.toString());
        searchParams.set('GridSortOrder', 'Descending');
        searchParams.set('HeaderClickedColumn', '');
        if (this.riGridPricing.Update) {
            searchParams.set('ROWID', this.getAttribute('SelectedPriceRowID'));
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.riGridPricing.RefreshRequired();
                    this.currentPagePricing = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecordsPricing = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    if (this.riGridPricing.Update) {
                        this.riGridPricing.StartRow = this.getAttribute('SelectedPriceRow');
                        this.riGridPricing.StartColumn = 0;
                        this.riGridPricing.RowID = this.getAttribute('SelectedPriceRowID');
                        this.riGridPricing.UpdateHeader = false;
                        this.riGridPricing.UpdateBody = true;
                        this.riGridPricing.UpdateFooter = false;
                    }
                    this.riGridPricing.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public riGridPricingAfterExecute(): void {
        // If at least one record exists within the grid then default the SelectedProduct
        // used within the Contact Employee button to determine the service area
        if (this.riGridPricing.HTMLGridBody.children.length > 0) {
            this.setControlValue('SelectedProduct', this.riGridPricing.Details.GetAttribute('grProductCode', 'AdditionalProperty'));
            this.getDefaultServiceArea();
        } else {
            this.setControlValue('SelectedProduct', '');
        }

        this.showHideContactDetails();
        this.pricingPostCode.nativeElement.focus();
    }

    public riGridPricingBodyOnClick(event: any): void {
        this.selectedRowFocusPricing(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
    }

    public selectedRowFocusPricing(rsrcElement: any): void {
        rsrcElement.select();
        this.setAttribute('SelectedPriceRow', this.riGridPricing.CurrentRow);
        this.setAttribute('SelectedPriceCell', this.riGridPricing.CurrentCell);
        this.setAttribute('SelectedPriceRowID', rsrcElement.getAttribute('RowID'));
        this.setControlValue('SelectedProduct', this.riGridPricing.Details.GetAttribute('grProductCode', 'AdditionalProperty'));
        rsrcElement.focus();
    }

    public riGridPricingBodyOnDblClick(event: Event): void {
        this.riGridPricingBodyOnClick(event);
        if (event.srcElement.parentElement.getAttribute('Name') === 'grSelected') {
            this.riGridPricing.Update = true;
            this.riGridPricingBeforeExecute();
        }
    }
    /*******************************Pricing Grid Code Ends********************************************************* */


    /*****************************
     *    SRA Grid Code Starts   *
     * ***************************/
    public buildSRAGrid(): void {
        this.riGridSRA.PageSize = 10;
        this.riGridSRA.FunctionPaging = true;
        this.riGridSRA.HighlightBar = true;

        this.riGridSRA.Clear();
        this.riGridSRA.AddColumn('SRANumber', 'SRA', 'SRANumber', MntConst.eTypeInteger, 3, false);
        this.riGridSRA.AddColumn('SRAShortText', 'SRA', 'SRAShortText', MntConst.eTypeTextFree, 20, false);
        this.riGridSRA.AddColumn('SRASelected', 'SRA', 'SRASelected', MntConst.eTypeImage, 1, false);
        this.riGridSRA.Complete();
    }

    public riGridSRABeforeExecute(): void {
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '2');

        searchParams.set('GridName', 'SRA');
        searchParams.set('GridCacheTime', this.pageParams.gridCacheTime);
        searchParams.set('AccountNumber', this.getControlValue('AccountNumber'));
        searchParams.set('PremisePostCode', this.getControlValue('JobPremisePostCode'));
        searchParams.set('ServiceBranchNumber', this.getControlValue('PricingServiceBranchNumber'));
        searchParams.set('riGridMode', '0');
        searchParams.set('riGridHandle', this.utils.gridHandle);
        searchParams.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        searchParams.set(this.serviceConstants.PageCurrent, this.currentPageSRA.toString());
        searchParams.set('GridSortOrder', 'Descending');
        searchParams.set('HeaderClickedColumn', '');
        if (this.riGridSRA.Update) {
            searchParams.set('ROWID', this.getAttribute('SelectedSRARowID'));
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.currentPageSRA = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecordsSRA = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.riGridSRA.RefreshRequired();
                    if (this.riGridSRA.Update) {
                        this.riGridSRA.StartRow = this.getAttribute('SelectedSRARow');
                        this.riGridSRA.StartColumn = 0;
                        this.riGridSRA.RowID = this.getAttribute('SelectedSRARowID');
                        this.riGridSRA.UpdateHeader = false;
                        this.riGridSRA.UpdateBody = true;
                        this.riGridSRA.UpdateFooter = false;
                    }
                    this.riGridSRA.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public riGridSRABodyOnClick(event: Event): void {
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'cmdSRAGenerateText')) { // Only allow when adding/updating etc...
            this.SelectedRowFocusSRA(window.event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
        }
    }

    public SelectedRowFocusSRA(rsrcElement: any): void {
        rsrcElement.select();
        this.setAttribute('SelectedSRARow', this.riGridSRA.CurrentRow);
        this.setAttribute('SelectedSRACell', this.riGridSRA.CurrentCell);
        this.setAttribute('SelectedSRARowID', rsrcElement.getAttribute('RowID'));
        rsrcElement.focus();
    }

    public riGridSRABodyOnDblClick(event: Event): void {
        this.riGridSRABodyOnClick(event);
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'cmdSRAGenerateText')) {
            if (event.srcElement.parentElement.getAttribute('name') === 'SRASelected') {
                this.riGridSRA.Update = true;
                this.riGridSRABeforeExecute();
            }
        }
    }
    /************************* SRA Grid Code Ends**************************************** */

    public pricingServiceBranchNumberOnChange(): void {
        this.setControlValue('ServiceBranchNumber', this.getControlValue('PricingServiceBranchNumber'));
    }

    public setGuaranteeRequiredFields(): void {
        this.guaranteeRequiredonClick();

        if (this.boolPropertyCareInd === 'N') {
            this.isSeperatorProp = false;
            this.isGuaranteeProp1 = false;
            this.isGuaranteeProp2 = false;
            this.isGuaranteeProp3 = false;
        } else {
            this.isSeperatorProp = true;
            this.isGuaranteeProp1 = true;
            this.isGuaranteeProp2 = true;
            this.isGuaranteeProp3 = true;
        }
    }

    public guaranteeRequiredonClick(): void {
        if (this.boolPropertyCareInd === 'Y') {
            if (this.getControlValue('GuaranteeRequired')) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NoGuaranteeCode', false);
                this.isNoGuarantee = false;
            } else {
                this.isNoGuarantee = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NoGuaranteeCode', false);
            }
        }
    }

    public validatePage(attemptCreateInd: any): void {
        this.isValidatePageOk = true;

        if ((this.pageParams.blnEnablePostCodeDefaulting && this.riExchange.riInputElement.isError(this.uiForm, 'PricingPostCode')) ||
            (!this.pageParams.blnEnablePostCodeDefaulting && this.riExchange.riInputElement.isError(this.uiForm, 'PricingServiceBranchNumber')) ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceName') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceAddressLine1') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceAddressLine2') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceAddressLine3') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceAddressLine4') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceAddressLine5') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoicePostCode') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceContactName') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceContactPosition') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceContactTelephone') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceContactMobile') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceContactFax') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobInvoiceContactEmail') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseName') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseAddressLine1') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseAddressLine2') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseAddressLine3') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseAddressLine4') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseAddressLine5') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremisePostCode') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseContactName') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseContactPosition') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseContactTelephone') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseContactMobile') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseContactFax') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'JobPremiseContactEmail') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'NoGuaranteeCode') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'BranchServiceAreaCode') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'CompanyVATNumber') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'ActionByDate') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'ActionByTime')) {
            this.isValidatePageOk = false;
        }


        if (this.isValidatePageOk && attemptCreateInd && this.riExchange.riInputElement.isError(this.uiForm, 'JobPaymentAuthorityCode')) {
            this.isValidatePageOk = false;
        }
    }

    /***************/
    public cmdSRAGenerateTextOnClick(): void {
        let postSearchParams: URLSearchParams = this.getURLSearchParamObject(), postParams: any = {};

        postSearchParams.set(this.serviceConstants.Action, '6');
        postParams.Function = 'GenerateSRAText';
        postParams.GridName = 'SRA';
        postParams.GridCacheTime = this.pageParams.gridCacheTime;
        postParams.AccountNumber = this.getControlValue('AccountNumber');
        postParams.PricingPostCode = this.getControlValue('PricingPostCode');
        postParams.ServiceBranchNumber = this.getControlValue('PricingServiceBranchNumber');
        postParams.JobSiteRiskAssessment = this.getControlValue('JobSiteRiskAssessment');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('JobSiteRiskAssessment', data.JobSiteRiskAssessment);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public contactNotifyWhenSelectOnChange(): void {
        if (this.getControlValue('ContactNotifyWhenSelect') === '0') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPremiseContactEmail', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPremiseContactMobile', false);
        }
        else {
            if (this.getControlValue('ContactNotifyWhenSelect') === '1') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPremiseContactEmail', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPremiseContactMobile', false);
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPremiseContactEmail', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPremiseContactMobile', true);
            }
        }
    }

    public cmdResetPricingOnClick(): void {
        this.pageParams.gridCacheTime = this.utils.Time();
        this.riGridPricingBeforeExecute();
    }

    public cmdGetPremiseAddressOnClick(): void {
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'cmdGetInvoiceAddress')) {
            this.ellipsisConfig.postCodeSearch.childConfigParams.parentMode = 'FixedPricePremiseJob';
            this.ellipsisConfig.postCodeSearch.childConfigParams.postCode = this.getControlValue('JobPremisePostCode');
            this.ellipsisConfig.postCodeSearch.childConfigParams.town = this.getControlValue('JobPremiseAddressLine4');
            this.ellipsisConfig.postCodeSearch.childConfigParams.state = this.getControlValue('JobPremiseAddressLine5');
            this.auPostcodeSearch.updateComponent();

            if (this.pageParams.blnSCEnableHopewiserPAF) {
                //TODO: Child page need to integrate. this.navigate('FixedPricePremiseJob', 'Model/riMPAFSearch.htm');
                alert('Page not Ready - riMPAFSearch');
            } else if (this.pageParams.blnSCEnableDatabasePAF) {
                this.auPostcodeSearch.openModal();
            }
        }
    }

    public cmdGetInvoiceAddressOnClick(): void {
        if (!this.riExchange.riInputElement.isDisabled(this.uiForm, 'FixedPriceJob')) {
            this.ellipsisConfig.postCodeSearch.childConfigParams.parentMode = 'FixedPricePremiseJob';
            this.ellipsisConfig.postCodeSearch.childConfigParams.Postcode = this.getControlValue('JobInvoicePostCode');
            this.ellipsisConfig.postCodeSearch.childConfigParams.Town = this.getControlValue('JobInvoiceAddressLine4');
            this.ellipsisConfig.postCodeSearch.childConfigParams.State = this.getControlValue('JobInvoiceAddressLine5');
            this.auPostcodeSearch.updateComponent();

            if (this.pageParams.blnSCEnableHopewiserPAF) {
                //TODO: Child page need to integrate. this.navigate('FixedPriceJob', '/contractmanagement/iCABSCMNatAxJobServiceCoverMaintenance');
                alert('Page not Ready - riMPAFSearch');
            } else {
                if (this.pageParams.blnSCEnableDatabasePAF) {
                    //TODO: Child page need to integrate.
                    // this.navigate('FixedPriceJob', '/application/aupostcode/search');
                    //this.auPostcodeSearch.openModal();
                }
            }
        }
    }

    public cmdCopyToPremiseOnClick(): void {
        this.setControlValue('JobPremiseName', this.getControlValue('JobInvoiceName'));
        this.setControlValue('JobPremiseAddressLine1', this.getControlValue('JobInvoiceAddressLine1'));
        this.setControlValue('JobPremiseAddressLine2', this.getControlValue('JobInvoiceAddressLine2'));
        this.setControlValue('JobPremiseAddressLine3', this.getControlValue('JobInvoiceAddressLine3'));
        this.setControlValue('JobPremiseAddressLine4', this.getControlValue('JobInvoiceAddressLine4'));
        this.setControlValue('JobPremiseAddressLine5', this.getControlValue('JobInvoiceAddressLine5'));

        if (this.pageParams.blnEnablePostCodeDefaulting) {
            if (this.getControlValue('AccountNumber')) {
                this.setControlValue('JobInvoicePostCode', this.getControlValue('PricingPostCode'));
            }
            this.setControlValue('JobPremisePostCode', this.getControlValue('PricingPostCode'));
        } else {
            this.setControlValue('JobPremisePostCode', this.getControlValue('JobInvoicePostCode'));
        }

        this.setControlValue('JobPremiseContactName', this.getControlValue('JobInvoiceContactName'));
        this.setControlValue('JobPremiseContactPosition', this.getControlValue('JobInvoiceContactPosition'));
        this.setControlValue('JobPremiseContactTelephone', this.getControlValue('JobInvoiceContactTelephone'));
        this.setControlValue('JobPremiseContactFax', this.getControlValue('JobInvoiceContactFax'));
        this.setControlValue('JobPremiseContactMobile', this.getControlValue('JobInvoiceContactMobile'));
        this.setControlValue('JobPremiseContactEmail', this.getControlValue('JobPremiseContactEmail'));
    }

    public cmdCopyFromPremiseOnClick(): void {
        this.setControlValue('JobInvoiceName', this.getControlValue('JobPremiseName'));
        this.setControlValue('JobInvoiceAddressLine1', this.getControlValue('JobPremiseAddressLine1'));
        this.setControlValue('JobInvoiceAddressLine3', this.getControlValue('JobPremiseAddressLine2'));
        this.setControlValue('JobInvoiceAddressLine3', this.getControlValue('JobPremiseAddressLine3'));
        this.setControlValue('JobInvoiceAddressLine4', this.getControlValue('JobPremiseAddressLine4'));
        this.setControlValue('JobInvoiceAddressLine5', this.getControlValue('JobPremiseAddressLine5'));

        this.setControlValue('JobInvoiceContactName', this.getControlValue('JobPremiseContactName'));
        this.setControlValue('JobInvoiceContactPosition', this.getControlValue('JobPremiseContactPosition'));
        this.setControlValue('JobInvoiceContactTelephone', this.getControlValue('JobPremiseContactTelephone'));
        this.setControlValue('JobInvoiceContactFax', this.getControlValue('JobPremiseContactFax'));
        this.setControlValue('JobInvoiceContactMobile', this.getControlValue('JobPremiseContactMobile'));
        this.setControlValue('JobInvoiceContactEmail', this.getControlValue('JobPremiseContactEmail'));
    }

    public pricingPostCodeOnChange(): void {
        let postSearchParams: URLSearchParams = this.getURLSearchParamObject(), postParams: any = {};

        postSearchParams.set(this.serviceConstants.Action, '6');
        postParams.Function = 'CheckFixedPriceJobPostcode';
        postParams.CallContactPostcode = this.getControlValue('PricingPostCode');
        postParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
        postParams.ContactTypeDetailCode = this.getControlValue('ContactTypeDetailCode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.WarningMessage) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.WarningMessage));
                    this.disableControl('cmdCreateJob', false);
                    this.disableControl('cmdRejectJob', false);
                }
                if (data.ErrorMessage) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.ErrorMessage));
                    this.disableControl('cmdCreateJob', true);
                    this.disableControl('cmdRejectJob', true);
                }

                this.pricingPostCodeHasChanged(true);
                //TODO call riTab.TabRefreshStatus
                //TODO all riExchange.riInputElement.focus('PricingPostCode')
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public pricingPostCodeHasChanged(lRefreshGrid: boolean): void {
        if (this.getControlValue('PricingPostCode')) {
            let postSearchParams: URLSearchParams = this.getURLSearchParamObject(), postParams: any = {};

            postSearchParams.set(this.serviceConstants.Action, '6');
            postParams.Function = 'GetPostCodeDetails';
            postParams.LoggedBranchNumber = this.utils.getBranchCode();
            postParams.PricingPostCode = this.getControlValue('PricingPostCode');
            postParams.ProductCode = this.getControlValue('SelectedProduct');
            postParams.PremiseAddressLine4 = this.getControlValue('JobPremiseAddressLine4');
            postParams.PremiseAddressLine5 = this.getControlValue('JobPremiseAddressLine5');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
                .subscribe((data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setControlValue('JobPremisePostCode', this.getControlValue('PricingPostCode'));
                        this.setControlValue('PricingServiceBranchNumber', data.ServiceBranchNumber);
                        this.setControlValue('ServiceBranchNumber', data.ServiceBranchNumber);
                        this.setControlValue('PricingServiceBranchName', data.ServiceBranchName);
                        this.setControlValue('BranchName', data.ServiceBranchName);

                        this.ellipsisConfig.branchServiceAreaCode.childConfigParams.ServiceBranchNumber = data.ServiceBranchNumber;
                        this.ellipsisConfig.branchServiceAreaCode.childConfigParams.BranchName = data.ServiceBranchName;

                        if (lRefreshGrid) {
                            this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
                            this.setControlValue('EmployeeCode', data.EmployeeCode);
                            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                        }

                        this.isRefreshPricingGrid = true;
                        this.pageParams.gridCacheTime = this.utils.Time();
                        if (lRefreshGrid) {
                            this.riGridPricingBeforeExecute();
                            this.isRefreshPricingGrid = false;
                        }
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }

    }

    public showHideContactDetails(): void {
        // SelectedProduct.value is set from pricing grid and is needed to get the tech employee
        if ((this.getControlValue('SelectedProduct') && this.getControlValue('JobPremisePostCode'))) {
            this.isBtnContactEmployee = true;
        } else {
            this.isBtnContactEmployee = false;
        }
    }

    public cmdContactEmployeeOnClick(): void {
        if (!this.riExchange.riInputElement.isError(this.uiForm, 'JobPremisePostCode')) {
            this.setControlValue('DefaultAssigneeEmployeeCode', this.getControlValue('EmployeeCode'));
            this.navigate('FixedPriceJob', InternalMaintenanceServiceModuleRoutes.ICABSCMCUSTOMERCONTACTEMPLOYEEVIEW);
        }
    }

    public getDefaultServiceArea(): void {
        let postSearchParams: URLSearchParams = this.getURLSearchParamObject(), postParams: any = {};

        postSearchParams.set(this.serviceConstants.Action, '6');
        postParams.Function = 'GetDefaultBranchServiceArea';
        postParams.LoggedBranchNumber = this.utils.getBranchCode();
        postParams.ServiceBranchNumber = this.getControlValue('ServiceBranchNumber');
        postParams.PricingPostCode = this.getControlValue('PricingPostCode');
        postParams.ProductCode = this.getControlValue('SelectedProduct');
        postParams.PremiseAddressLine4 = this.getControlValue('JobPremiseAddressLine4');
        postParams.PremiseAddressLine5 = this.getControlValue('JobPremiseAddressLine5');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
                    this.setControlValue('EmployeeCode', data.EmployeeCode);
                    this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public cmdCreateJobOnClick(): void {
        this.highlightTabs();
        this.validatePage(true);

        if (this.isValidatePageOk) {
            this.isValidatePageOk = false;

            let promptObj: ICabsModalVO = new ICabsModalVO(MessageConstant.PageSpecificMessage.areYouSure, null, this.createJob.bind(this));
            promptObj.title = MessageConstant.PageSpecificMessage.createFixedJob;
            this.modalAdvService.emitPrompt(promptObj);
        } else {
            this.renderTab(4);
        }
    }

    public createJob(): void {
        let postSearchParams: URLSearchParams = this.getURLSearchParamObject(), postParams: any = {};

        this.isValidatePageOk = true;
        postSearchParams.set(this.serviceConstants.Action, '6');
        postParams.Function = 'CreateJob';
        postParams.LoggedBranchNumber = this.utils.getBranchCode();
        postParams.GridName = 'Pricing';
        postParams.GridCacheTime = this.pageParams.gridCacheTime;
        postParams.CallReference = this.getControlValue('CurrentCallLogID');
        postParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
        postParams.ContactTypeDetailCode = this.getControlValue('ContactTypeDetailCode');
        postParams.AccountNumber = this.getControlValue('AccountNumber');
        postParams.SelectedTicketNumber = this.getControlValue('SelectedTicketNumber');
        postParams.ServiceBranchNumber = this.getControlValue('PricingServiceBranchNumber');
        postParams.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
        postParams.CustomerTypeCode = this.getControlValue('CustomerTypeCode');
        postParams.ActionByDate = this.getControlValue('ActionByDate');
        postParams.ActionByTime = this.getControlValue('ActionByTime');
        postParams.JobInvoiceName = this.getControlValue('JobInvoiceName');
        postParams.JobInvoiceAddressLine1 = this.getControlValue('JobInvoiceAddressLine1');
        postParams.JobInvoiceAddressLine2 = this.getControlValue('JobInvoiceAddressLine2');
        postParams.JobInvoiceAddressLine3 = this.getControlValue('JobInvoiceAddressLine3');
        postParams.JobInvoiceAddressLine4 = this.getControlValue('JobInvoiceAddressLine4');
        postParams.JobInvoiceAddressLine5 = this.getControlValue('JobInvoiceAddressLine5');
        postParams.JobInvoicePostCode = this.getControlValue('JobInvoicePostCode');
        postParams.JobInvoiceContactName = this.getControlValue('JobInvoiceContactName');
        postParams.JobInvoiceContactPosition = this.getControlValue('JobInvoiceContactPosition');
        postParams.JobInvoiceContactTelephone = this.getControlValue('JobInvoiceContactTelephone');
        postParams.JobInvoiceContactMobile = this.getControlValue('JobInvoiceContactMobile');
        postParams.JobInvoiceContactFax = this.getControlValue('JobInvoiceContactFax');
        postParams.JobInvoiceContactEmail = this.getControlValue('JobInvoiceContactEmail');
        postParams.JobPremiseName = this.getControlValue('JobPremiseName');
        postParams.JobPremiseAddressLine1 = this.getControlValue('JobPremiseAddressLine1');
        postParams.JobPremiseAddressLine2 = this.getControlValue('JobPremiseAddressLine2');
        postParams.JobPremiseAddressLine3 = this.getControlValue('JobPremiseAddressLine3');
        postParams.JobPremiseAddressLine4 = this.getControlValue('JobPremiseAddressLine4');
        postParams.JobPremiseAddressLine5 = this.getControlValue('JobPremiseAddressLine5');
        postParams.JobPremisePostCode = this.getControlValue('JobPremisePostCode');
        postParams.JobPremiseContactName = this.getControlValue('JobPremiseContactName');
        postParams.JobPremiseContactPosition = this.getControlValue('JobPremiseContactPosition');
        postParams.JobPremiseContactTelephone = this.getControlValue('JobPremiseContactTelephone');
        postParams.JobPremiseContactMobile = this.getControlValue('JobPremiseContactMobile');
        postParams.JobPremiseContactFax = this.getControlValue('JobPremiseContactFax');
        postParams.JobPremiseContactEmail = this.getControlValue('JobPremiseContactEmail');
        postParams.JobPaymentAuthorityCode = this.getControlValue('JobPaymentAuthorityCode');
        postParams.JobClientReference = this.getControlValue('JobClientReference');
        postParams.JobSiteRiskAssessment = this.getControlValue('JobSiteRiskAssessment');
        postParams.JobPurchaseOrderNo = this.getControlValue('JobPurchaseOrderNo');
        postParams.InvoiceGroupNumber = this.getControlValue('InvoiceGroupNumber');
        postParams.CallTicketReference = this.getControlValue('CallTicketReference');
        postParams.JobNotes = this.getControlValue('JobNotes');
        postParams.NotifyWhen = this.getControlValue('ContactNotifyWhenSelect');
        postParams.JobSpecialInstructions = this.getControlValue('JobSpecialInstructions');
        postParams.CompanyVATNumber = this.getControlValue('CompanyVATNumber');
        postParams.NumberBedrooms = this.getControlValue('NumberBedrooms');
        postParams.GuaranteeRequired = this.getControlValue('GuaranteeRequired');
        postParams.NoGuaranteeCode = this.getControlValue('NoGuaranteeCode');
        postParams.ListedCode = this.getControlValue('ListedCode');
        postParams.AgeOfProperty = this.getControlValue('AgeOfProperty');

        //  Only post CompanyVATNumber2 if the input has actually been put up on the screen.
        if (this.pageParams.blnSCEnableTaxRegistrationNumber2) { // System Char 3200
            postParams.CompanyVATNumber2 = this.getControlValue('CompanyVATNumber2');
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data.JobInformation) {
                        this.modalAdvService.emitMessage(new ICabsModalVO(data.JobInformation));
                    }
                    this.pageParams.gridCacheTime = this.utils.Time();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public cmdRejectJobOnClick(): void {
        let postSearchParams: URLSearchParams = this.getURLSearchParamObject(), postParams: any = {};

        postSearchParams.set(this.serviceConstants.Action, '6');
        postParams.Function = 'RejectJob';
        postParams.LoggedBranchNumber = this.utils.getBranchCode();
        postParams.GridName = 'Pricing';
        postParams.GridCacheTime = this.pageParams.gridCacheTime;
        postParams.CallReference = this.getControlValue('CurrentCallLogID');
        postParams.ContactTypeCode = this.getControlValue('ContactTypeCode');
        postParams.ContactTypeDetailCode = this.getControlValue('ContactTypeDetailCode');
        postParams.CustomerTypeCode = this.getControlValue('CustomerTypeCode');
        postParams.PaymentTypeCode = this.getControlValue('PaymentTypeCode');
        postParams.AccountNumber = this.getControlValue('AccountNumber');
        postParams.ServiceBranchNumber = this.getControlValue('PricingServiceBranchNumber');
        postParams.JobPremiseName = this.getControlValue('JobPremiseName');
        postParams.JobPremiseAddressLine1 = this.getControlValue('JobPremiseAddressLine1');
        postParams.JobPremiseAddressLine2 = this.getControlValue('JobPremiseAddressLine2');
        postParams.JobPremiseAddressLine3 = this.getControlValue('JobPremiseAddressLine3');
        postParams.JobPremiseAddressLine4 = this.getControlValue('JobPremiseAddressLine3');
        postParams.JobPremiseAddressLine5 = this.getControlValue('JobPremiseAddressLine5');
        postParams.JobPremisePostCode = this.getControlValue('JobPremisePostCode');
        postParams.JobPremiseContactName = this.getControlValue('JobPremiseContactName');
        postParams.JobPremiseContactPosition = this.getControlValue('JobPremiseContactPosition');
        postParams.JobPremiseContactTelephone = this.getControlValue('JobPremiseContactTelephone');
        postParams.JobPremiseContactMobile = this.getControlValue('JobPremiseContactMobile');
        postParams.JobPremiseContactFax = this.getControlValue('JobPremiseContactFax');
        postParams.JobPremiseContactEmail = this.getControlValue('JobPremiseContactEmail');
        postParams.JobPaymentAuthorityCode = this.getControlValue('JobPaymentAuthorityCode');
        postParams.JobClientReference = this.getControlValue('JobClientReference');
        postParams.JobSiteRiskAssessment = this.getControlValue('JobSiteRiskAssessment');
        postParams.JobPurchaseOrderNo = this.getControlValue('JobPurchaseOrderNo');
        postParams.JobNotes = this.getControlValue('JobNotes');
        postParams.JobSpecialInstructions = this.getControlValue('JobSpecialInstructions');
        postParams.CallTicketReference = this.getControlValue('CallTicketReference');
        postParams.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
        postParams.ActionByDate = this.getControlValue('ActionByDate');
        postParams.ActionByTime = this.getControlValue('ActionByTime');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data.JobInformation) {
                        this.modalAdvService.emitMessage(new ICabsModalVO(data.JobInformation));
                    }
                    this.pageParams.gridCacheTime = this.utils.Time();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public paymentTypeCodeOnChange(): void {
        let postSearchParams: URLSearchParams = this.getURLSearchParamObject(), postParams: any = {};

        postSearchParams.set(this.serviceConstants.Action, '6');
        postParams.Function = 'GetPaymentCodeDetails';
        postParams.PaymentTypeCode = this.utils.getBranchCode();
        postParams.PaymentDesc = this.getControlValue('PricingPostCode');
        postParams.PaymentAuthReq = this.getControlValue('SelectedProduct');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('PaymentDesc', data.PaymentDesc);
                    if (data.PaymentDesc === 'Y') {
                        this.pageParams.blnDefPaymentAuthCode = true;
                    } else {
                        this.pageParams.blnDefPaymentAuthCode = false;
                    }

                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'JobPaymentAuthorityCode', this.pageParams.blnDefPaymentAuthCode);
                    this.isJobPaymentAuthorityCode = this.pageParams.blnDefPaymentAuthCode;
                    if (this.pageParams.blnDefPaymentAuthCode) {
                        this.jobPaymentAuthorityCode.focus();
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitMessage(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public getCurrentPage(data: any, gridName: string): void {
        if (gridName === 'Pricing') {
            this.currentPagePricing = data.value;
            this.riGridPricingBeforeExecute();
        } else {
            this.currentPageSRA = data.value;
            this.riGridSRABeforeExecute();
        }
    }

    public onSelect(data: any, type: string): void {
        switch (type) {
            case 'noGuarantee':
                this.setControlValue('NoGuaranteeCode', data.BranchServiceAreaCode);
                this.setControlValue('NoGuaranteeDescription', data.EmployeeCode);
                break;
            case 'invoice':
                this.setControlValue('InvoiceGroupNumber', data.Number);
                this.setControlValue('InvoiceGroupDesc', data.Description);
                break;
            case 'listedCode':
                this.setControlValue('ListedCode', data.BranchServiceAreaCode);
                this.setControlValue('ListedDescription', data.EmployeeCode);
                break;
            case 'branchServiceAreaCode':
                this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
                this.setControlValue('EmployeeCode', data.EmployeeCode);
                this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                break;
            case 'customerTypeCode':
                this.setControlValue('CustomerTypeCode', data.CustomerTypeCode);
                this.setControlValue('CustomerTypeDesc', data.CustomerTypeDesc);
                break;
            case 'paymentTypeCode':
                this.setControlValue('PaymentTypeCode', data.PaymentTypeCode);
                this.setControlValue('PaymentDesc', data.PaymentDesc);
                this.paymentTypeCodeOnChange();
                break;
        }
    }

    /**
     * Show/Hide Tab
     * @param tabindex
     */
    public renderTab(tabIndex: number): void {
        this.tabVisited[tabIndex - 1] = true;
        this.pageParams.currentActiveTab = tabIndex;
        this.currentTab = tabIndex;
        switch (tabIndex) {
            case 1:
                this.uiTabs.tab.tab1.active = true;
                this.uiTabs.tab.tab2.active = false;
                this.uiTabs.tab.tab3.active = false;
                this.uiTabs.tab.tab4.active = false;
                this.riGridPricingBeforeExecute();
                this.showHideContactDetails();
                this.isRefreshPricingGrid = false;
                break;
            case 2:
                this.uiTabs.tab.tab1.active = false;
                this.uiTabs.tab.tab2.active = true;
                this.uiTabs.tab.tab3.active = false;
                this.uiTabs.tab.tab4.active = false;
                this.isBtnContactEmployee = true;
                break;
            case 3:
                this.uiTabs.tab.tab1.active = false;
                this.uiTabs.tab.tab2.active = false;
                this.uiTabs.tab.tab3.active = true;
                this.uiTabs.tab.tab4.active = false;
                this.showHideContactDetails();
                this.riGridSRABeforeExecute();
                break;
            case 4:
                this.uiTabs.tab.tab1.active = false;
                this.uiTabs.tab.tab2.active = false;
                this.uiTabs.tab.tab3.active = false;
                this.uiTabs.tab.tab4.active = true;
                this.showHideContactDetails();
                break;
        }

        setTimeout(() => {
            this.getFirstFocusableFieldForTab(tabIndex);
        }, 0);

    }

    /********************** Custom Methods ********************* */

    public getFirstFocusableFieldForTab(currentTab: number): any {
        let tabs: any = this.tabContainer.nativeElement;
        if (tabs) {
            let tab: any = tabs.children[currentTab - 1];
            let elementArray: any = tab.querySelectorAll('input[id]:not(:disabled):not(.hidden), textarea[formcontrolname]:not(:disabled):not(.hidden), select[formcontrolname]:not(:disabled):not(.hidden)');
            for (let i: number = 0; i < elementArray.length; i++) {
                let focusElem: any = elementArray[i];
                if (focusElem.parentElement && this.utils.hasClass(focusElem.parentElement, 'hidden')) {
                    continue;
                }
                if (focusElem.parentElement && focusElem.parentElement.parentElement
                    && this.utils.hasClass(focusElem.parentElement.parentElement, 'hidden')) {
                    continue;
                }
                focusElem['focus']();
                break;
            }
        }
    }

    public highlightTabs(): void {
        this.makeTabsRed();
        let navContainer: any = this.navElement.nativeElement;
        if (navContainer) {
            let tabs: any = navContainer.children;
            //Focus 1st Error Tab
            let currentActiveTab: number = 0;
            let newActiveTab: number = 99;
            for (let j: number = 0; j < tabs.length; j++) {
                //For Reference with VB Code:  this.uiTabs.tab.tab[j].active = false;
                if (this.utils.hasClass(tabs[j], 'active')) { currentActiveTab = j; }
                if (this.utils.hasClass(tabs[j], 'error')) {
                    newActiveTab = (j < newActiveTab) ? j : newActiveTab;
                }
            }

            this.utils.removeClass(tabs[currentActiveTab], 'active');
            this.utils.removeClass(this.tabContainer.nativeElement.children[currentActiveTab], 'active');

            if (newActiveTab !== 99) {
                this.utils.addClass(tabs[newActiveTab], 'active');
                this.utils.addClass(this.tabContainer.nativeElement.children[newActiveTab], 'active');
            } else {
                this.utils.addClass(tabs[0], 'active');
                this.utils.addClass(this.tabContainer.nativeElement.children[0], 'active');
            }
        }
    }

    public makeTabsRed(tabNumber?: any): void {
        let navContainer: any = this.navElement.nativeElement;

        if (navContainer) {
            let tabs: any = navContainer.children;
            let tabLength: number = tabs.length;
            for (let i: any = 0; i < tabLength; i++) {
                if (tabNumber && (tabNumber.length > i)) {
                    if (!tabNumber[i]) {
                        continue;
                    }
                }
                this.utils.removeClass(tabs[i], 'error');
                if (!this.utils.hasClass(tabs[i], 'hidden')) {
                    let tabContent: any = this.tabContainer.nativeElement.children[i];

                    if (tabContent) {
                        let tabContentHTML: any = tabContent.innerHTML, isFlag: boolean = true;

                        while (isFlag) {
                            if (tabContentHTML.indexOf('<icabs-ellipsis') > -1) {
                                tabContentHTML = tabContentHTML.replace(tabContentHTML.substring(tabContentHTML.indexOf('<icabs-ellipsis'), tabContentHTML.indexOf('</icabs-ellipsis>') + 17), '');
                            }
                            if (tabContentHTML.indexOf('<icabs-ellipsis') === -1) { isFlag = false; }
                        }
                        isFlag = true;
                        while (isFlag) {
                            if (tabContentHTML.indexOf('<icabs-datepicker') > -1) {
                                tabContentHTML = tabContentHTML.replace(tabContentHTML.substring(tabContentHTML.indexOf('<icabs-datepicker'), tabContentHTML.indexOf('</icabs-datepicker>') + 19), '');
                            }
                            if (tabContentHTML.indexOf('<icabs-datepicker') === -1) { isFlag = false; }
                        }

                        let invalidElementArray: Array<any> = tabContent.querySelectorAll('.ng-invalid');
                        if (invalidElementArray && invalidElementArray.length > 0) {
                            for (let k: number = 0; k < invalidElementArray.length; k++) {
                                let invalidElement: Element = invalidElementArray[k];
                                if (invalidElement.parentElement && this.utils.hasClass(invalidElement.parentElement, 'hidden')) {
                                    continue;
                                }
                                if (invalidElement.parentElement && invalidElement.parentElement.parentElement
                                    && this.utils.hasClass(invalidElement.parentElement.parentElement, 'hidden')) {
                                    continue;
                                }
                                if (invalidElement.parentElement && invalidElement.parentElement.parentElement
                                    && invalidElement.parentElement.parentElement.parentElement
                                    && this.utils.hasClass(invalidElement.parentElement.parentElement.parentElement, 'hidden')) {
                                    continue;
                                }
                                this.utils.addClass(tabs[i], 'error');
                            }
                        }
                    }
                }
            }
        }
    }

    //On Focus on last element
    public focusSave(obj: any): void {
        if (obj.relatedTarget || obj.keyCode === 9) {
            let currtab: any = this.getCurrentActiveTab();
            let focustab: any = this.getNextActiveTab(currtab);
            if (currtab !== focustab) {
                this.tabFocus(focustab);
                this.focusFirstField();
            } else {
                this.btnCreateJob.nativeElement.focus();
            }
        }
    }

    public getCurrentActiveTab(): any {
        let i: number = 0;
        for (let tab in this.uiTabs.tab) {
            if (tab !== '') {
                i++;
                if (this.uiTabs.tab[tab].active) {
                    this.currentTab = i;
                    return i;
                }
            }
        }
        return i;
    }

    public getNextActiveTab(tabindex: number): any {
        let i: number = 0, tab: any;
        for (tab in this.uiTabs.tab) {
            if (tab !== '') {
                i++;
                if (this.uiTabs.tab[tab].visible && i > tabindex && i <= this.tabLength) return i;
            }
        }
        return tabindex;
    }

    public tabFocus(tabIndex: number): void {
        this.currentTab = tabIndex;
        //Bug - unable to explicitly remove 'active' class as those are binded. hence below lines added
        let elem: any = this.navElement.nativeElement.children;
        for (let i: number = 0; i < elem.length; i++) {
            if (this.utils.hasClass(elem[i], 'error')) {
                this.utils.removeClass(elem[i], 'active');
                this.utils.removeClass(this.tabContainer.nativeElement.children[i], 'active');
            }
        }

        let i: number = 0;
        for (let tab in this.uiTabs.tab) {
            if (tab !== '') {
                i++;
                this.uiTabs.tab[tab].active = (i === tabIndex) ? true : false;
            }
        }

        //Failsafe
        this.utils.addClass(elem[tabIndex - 1], 'active');
        this.utils.addClass(this.tabContainer.nativeElement.children[tabIndex - 1], 'active');

        setTimeout(this.makeTabsRed(), 200);
    }

    public focusFirstField(): any {
        let elem = this.tabContainer.nativeElement.children[this.currentTab - 1];
        if (elem.querySelector('input')) elem.querySelector('input').focus();
        else if (elem.querySelector('textarea')) elem.querySelector('textarea').focus();
    }
}
