import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Injector, Input, EventEmitter, Renderer, HostListener, ElementRef } from '@angular/core';
import { BaseComponent } from './../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst, RiMaintenance, RiTab } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalConstants } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { Subscription } from 'rxjs/Rx';
import * as moment from 'moment';

import { InvoiceGroupSearchComponent } from './../../internal/search/iCABSAInvoiceGroupSearch.component';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { BCompanySearchComponent } from './../search/iCABSBCompanySearch';
import { BranchSearchComponent } from './../search/iCABSBBranchSearch';
import { ProRataChargeStatusLanguageSearchComponent } from './../search/iCABSSProRataChargeStatusLanguageSearch';
import { InvoiceSearchComponent } from './../search/iCABSInvoiceSearch.component';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { TaxCodeSearchComponent } from './../search/iCABSSTaxCodeSearch.component';
import { CommonDropdownComponent } from './../../../shared/components/common-dropdown/common-dropdown.component';

@Component({
    templateUrl: 'iCABSAProRataChargeMaintenance.html'
})

export class ProRataChargeMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    public riTab: RiTab;
    @ViewChild('companyDropdown') companyDropdown: BCompanySearchComponent;
    @ViewChild('languageDropdown') languageDropdown: ProRataChargeStatusLanguageSearchComponent;
    @ViewChild('branchDropdown') branchDropdown: BranchSearchComponent;
    @ViewChild('invoiceSearchEllipsis') invoiceSearchEllipsis: EllipsisComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('invoiceCreditReasonCode') invoiceCreditReasonCode: CommonDropdownComponent;
    public pageId: string = '';
    public InvoiceGroupNumberFocus = new EventEmitter<boolean>();
    public ProRataNarrativeFocus = new EventEmitter<boolean>();
    public isRequesting: boolean = false;
    // Prompt Modal popup
    public promptTitle: string;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public showPromptHeader: boolean = true;
    public context: ProRataChargeMaintenanceComponent;
    public controls = [
        { name: 'ContractNumber', readonly: false, required: false, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'InvoiceFrequencyCode', readonly: false, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'AccountNumber', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'AccountName', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'InvoiceAnnivDate', readonly: false, required: false, type: MntConst.eTypeDate },
        { name: 'PremiseNumber', readonly: false, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', readonly: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'InvoiceGroupNumber', readonly: false, required: false, type: MntConst.eTypeInteger },
        { name: 'InvoiceGroupDesc', readonly: false, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'InvoiceCreditCode', readonly: false, required: false, type: MntConst.eTypeCode },
        { name: 'InvoiceCreditDesc', readonly: false, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProRataChargeStatusCode', readonly: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProRataChargeStatusDesc', readonly: false, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ServiceQuantity', readonly: false, required: false, type: MntConst.eTypeInteger },
        { name: 'ProRataChargeValue', readonly: false, required: false, type: MntConst.eTypeCurrency },
        { name: 'ProducedCompanyCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ProducedCompanyDesc', readonly: false, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'CostValue', readonly: false, required: false, type: MntConst.eTypeCurrency },
        { name: 'ProducedCompanyInvoiceNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'ProducedInvoiceNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'ServiceSalesEmployee', readonly: false, required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: false, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ProducedInvoiceRun', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'OriginalCompanyInvoiceNumber', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'OriginalInvoiceNumber', readonly: false, required: false, type: MntConst.eTypeInteger },
        { name: 'OriginalCompanyCode', readonly: false, required: false, type: MntConst.eTypeCode },
        { name: 'OriginalCompanyDesc', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'TaxCode', readonly: false, required: false, type: MntConst.eTypeCode },
        { name: 'TaxCodeDesc', readonly: false, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'OriginalInvoiceItemNumber', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'InvoiceCreditReasonCode', readonly: false, required: false, type: MntConst.eTypeCode },
        { name: 'InvoiceCreditReasonDesc', readonly: false, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'PurchaseOrderNo', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'TaxInvoiceNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'DiscountCode', readonly: false, required: false, type: MntConst.eTypeCode },
        { name: 'DiscountDesc', readonly: false, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'CreditMissedServiceInd', readonly: false, required: false, type: MntConst.eTypeCheckBox },
        { name: 'OutsortInvoice', readonly: false, required: false, type: MntConst.eTypeCheckBox },
        { name: 'CreditNumberOfVisits', readonly: false, required: false, type: MntConst.eTypeInteger },
        { name: 'PrintCreditInd', readonly: false, required: false, type: MntConst.eTypeCheckBox },
        { name: 'ProRataNarrative', readonly: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'UseProRataNarrative', readonly: false, required: false, type: MntConst.eTypeCheckBox },
        { name: 'AdditionalCreditInfo', readonly: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'ServiceBranchNumber', readonly: false, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'TaxPointDate', type: MntConst.eTypeDate },
        { name: 'PaidDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'InvoiceAnnivDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'StartDate', required: true, type: MntConst.eTypeDate },
        { name: 'EndDate', required: false, type: MntConst.eTypeDate },
        { name: 'ToBeReleasedDate', required: true, type: MntConst.eTypeDate },
        // hidden fields
        { name: 'BusinessCode', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'LostBusinessRequestNumber', readonly: false, required: false, type: MntConst.eTypeInteger },
        { name: 'ShowPaidDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ErrorMessage', readonly: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'ApprovedUser', readonly: false, required: false, type: MntConst.eTypeCheckBox },
        { name: 'ServiceCoverRowID', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'ProRataChargeROWID', readonly: false, required: false, type: MntConst.eTypeText },
        { name: 'ContractTypeCode', readonly: false, required: false, type: MntConst.eTypeText }
    ];

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.window_onload();
        }
        //this.dropdown['invoiceCreditReasonCode']['params']['search'] = new URLSearchParams();
        //this.dropdown['invoiceCreditReasonCode']['params']['search'].set('UserSelectableInd', true);
        this.routeAwayUpdateSaveFlag();
        this.routeAwayGlobals.setEllipseOpenFlag(false);

    }

    ngAfterViewInit(): void {
        this.browserTitle = this.pageParams.pageTitle;
        this.InvoiceGroupNumberFocus.emit(true);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    constructor(injector: Injector, public renderer: Renderer, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPRORATACHARGEMAINTENANCE;
        this.setURLQueryParameters(this);
        this.setPageTitle();
    }

    public xhrParams = {
        module: 'charges',
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAProRataChargeMaintenance'
    };

    private tabLength: number = 2;
    private currentTab: number = 1;
    public uiDisplay: any = {
        tab: {
            tab1: { visible: true, active: true },
            tab2: { visible: true, active: false }
        }
    };

    public ellipsis = {
        InvoiceGroupNumber: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNew': false,
                'isEllipsis': true,
                'AccountNumber': ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: InvoiceGroupSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        ServiceSalesEmployee: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-ServiceCoverCommissionEmployee',
                'showAddNew': false,
                'serviceBranchNumber': ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        DiscountCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ScreenNotReadyComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        TaxCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: TaxCodeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        invoiceSearchComponent: {
            inputParams: {
                'parentMode': 'ProRataCharge',
                'businessCode': this.utils.getBusinessCode(),
                'countryCode': this.utils.getCountryCode(),
                'companyCode': '',
                'OriginalCompanyInvoiceNumber': ''
            },
            contentComponent: InvoiceSearchComponent,
            showCloseButton: true,
            config: {
                ignoreBackdropClick: true
            },
            showHeader: true,
            disabled: false
        }
    };

    public dropdown: any = {
        OriginalCompanyCode: {
            isRequired: true,
            disabled: false,
            inputParams: {
                'parentMode': 'LookUp-ProRata-Original',
                'businessCode': this.utils.getBusinessCode(),
                'countryCode': this.utils.getCountryCode()
            },
            active: {
                id: '',
                text: ''
            }
        },
        ProducedCompanyCode: {
            isRequired: true,
            disabled: true,
            inputParams: {
                'parentMode': 'LookUp-ProRata-Produced',
                'businessCode': this.utils.getBusinessCode(),
                'countryCode': this.utils.getCountryCode()
            },
            active: {
                id: '',
                text: ''
            }
        },
        ProRataChargeStatusCode: {
            isRequired: true,
            disabled: false,
            inputParams: {
                'parentMode': 'ProRataChargeMaintenance'
            },
            active: {
                id: '',
                text: ''
            }
        },
        ServiceBranchNumber: {
            isRequired: true,
            disabled: false,
            inputParams: {
                'parentMode': 'LookUp-ServBranch'
            },
            active: {
                id: this.utils.getBranchCode(),
                text: this.utils.getBranchText()
            }
        },
        invoiceCreditReasonCode: {
            isRequired: true,
            isDisabled: false,
            isTriggerValidate: false,
            params: {
                parentMode: 'LookUp-ProRata',
                method: 'bill-to-cash/search',
                module: 'invoicing',
                operation: 'System/iCABSSInvoiceCreditReasonLanguageSearch'
            },
            isActive: {
                id: '',
                text: ''
            },
            displayFields: ['InvoiceCreditReasonLang.InvoiceCreditReasonCode', 'InvoiceCreditReasonLang.InvoiceCreditReasonDesc']
        }
    };

    public datePicker = {
        TaxPointDate: {
            required: false,
            disabled: false,
            hideIcon: false
        },
        PaidDate: {
            required: false,
            disabled: true,
            hideIcon: false
        },
        InvoiceAnnivDate: {
            required: false,
            disabled: true,
            hideIcon: false
        }
    };

    public getURLQueryParameters(param: any): void {
        if (param['Mode']) {
            this.pageParams.ParentMode = param['Mode'];
        } else {
            this.pageParams.ParentMode = this.riExchange.getParentMode();
        }
        this.pageParams.mode = param['mode'];
        this.pageParams.CurrentContractTypeURLParameter = param['currentContractTypeURLParameter'];
        this.pageParams.currentContractType = param['currentContractTypeURLParameter'];
    }

    public setCurrentContractType(): void {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    }

    public setPageTitle(): void {
        this.pageParams.strDocTitle = 'Pro Rata Charge Maintenance';
        this.pageParams.pageTitle = this.browserTitle = this.pageParams.currentContractTypeLabel + ' ' + this.pageParams.strDocTitle;
    }

    /**
     * Renders Tab
     * @param tabindex
     */
    public renderTab(tabindex: number): void {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.ProRataNarrativeFocus.emit(true);
                break;
        }
        this.focusFirstField();
        this.utils.highlightTabs();
    };

    private getSysCharDtetails(): void {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableCompanyCode,
            this.sysCharConstants.SystemCharEnableProRataNarrativeOnInvoice,
            this.sysCharConstants.SystemCharDefaultProRataExtractDate,
            this.sysCharConstants.SystemCharCreditApprovals,
            this.sysCharConstants.SystemCharEnableDiscountCode,
            this.sysCharConstants.SystemCharEnableAutoCreditNoteNarrative,
            this.sysCharConstants.SystemCharAllowNoniCABSInvoiceNumberInProRataChargeMaint,
            this.sysCharConstants.SystemCharEnableAutoOriginalInvNumbersManCredits,
            this.sysCharConstants.SystemCharEnableProRataChargeToCreateServiceValue,
            this.sysCharConstants.SystemCharEnableTaxInvoiceRanges

        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCEnableCompanyCode = record[0]['Required'];
            this.pageParams.vSCEnableUseProRataNarrative = record[1]['Required'];
            this.pageParams.vSCDefaultExtractDate = record[2]['Required'];
            this.pageParams.vEnableCreditApprovals = record[3]['Required'];
            this.pageParams.vEnableDiscountCode = record[4]['Required'];
            this.pageParams.lEnableAutoCreditNoteNarrative = record[5]['Required'];

            this.pageParams.lRequiredNoniCABSInvoiceNumbers = record[6]['Required'];
            this.pageParams.lDisplayInvoiceTPDOfCredit = record[6]['Logical'];
            this.pageParams.lRequiredOriginalInvoiceNumber = record[7]['Required'];
            this.pageParams.lOriginalInvoiceNumberMandatory = record[7]['Logical'];
            this.pageParams.lEnableCreateServiceValue = record[8]['Logical'];
            this.pageParams.vEnableCreateServiceValue = record[8]['Required'];

            this.pageParams.vSCEnableTaxInvoiceRanges = record[9]['Required'];

            this.pageParams.strInvoiceDesc = 'Invoice';
            this.pageParams.strCreditDesc = 'Credit';
            this.pageParams.blnSCEnableCompanyCode = this.pageParams.vSCEnableCompanyCode;
            this.pageParams.blnSCEnableUseProRataNarrative = this.pageParams.vSCEnableUseProRataNarrative;
            this.pageParams.blnSCEnableCreateServiceValue = this.pageParams.vEnableCreateServiceValue;
            this.pageParams.blnSCDefaultExtractDate = this.pageParams.vSCDefaultExtractDate;
            this.pageParams.blnSCEnableDiscountCode = this.pageParams.vEnableDiscountCode;
            this.pageParams.logAllowNoniCABSInvoiceNumbers = this.pageParams.lRequiredNoniCABSInvoiceNumbers;
            this.pageParams.blnOriginalInvoiceNumberMandatory = this.pageParams.lOriginalInvoiceNumberMandatory;
            this.pageParams.blnOriginalInvoiceNumberRequired = this.pageParams.lRequiredOriginalInvoiceNumber;
            this.pageParams.blnEnableAutoCreditNoteNarrative = this.pageParams.lEnableAutoCreditNoteNarrative;
            this.pageParams.blnEnableCreateServiceValue = this.pageParams.lEnableCreateServiceValue;
            this.pageParams.blnSCTaxInvoiceNumber = this.pageParams.vSCEnableTaxInvoiceRanges;

            if (data) this.BuildTabs();
        });
    }

    public window_onload(): void {
        this.setCurrentContractType();
        this.doLookUpOnLoad();
        this.getSysCharDtetails();
    }

    public getRouterParamsData(): void {
        this.DisplayInvoiceCreditDesc();
        this.setControlValue('StartDate', this.riExchange.getParentAttributeValue('StartDate'));
        this.setControlValue('EndDate', this.riExchange.getParentAttributeValue('EndDate'));
        this.setControlValue('ProRataChargeStatusCode', this.riExchange.getParentAttributeValue('ProRataChargeStatusCode'));
        this.setControlValue('ToBeReleasedDate', this.riExchange.getParentAttributeValue('ToBeReleasedDate'));
        this.setControlValue('InvoiceCreditReasonDesc', this.riExchange.getParentAttributeValue('InvoiceCreditReasonDesc'));
        this.setControlValue('ProRataNarrative', this.riExchange.getParentAttributeValue('InvoiceCreditReasonDesc'));
        this.setControlValue('InvoiceGroupNumber', this.riExchange.getParentAttributeValue('InvoiceGroupNumber'));
        this.setControlValue('ServiceQuantity', this.riExchange.getParentAttributeValue('ServiceQuantity'));
        this.setControlValue('TaxCode', this.riExchange.getParentAttributeValue('TaxCode'));
        this.setControlValue('ProRataChargeValue', this.riExchange.getParentAttributeValue('ProRataChargeValue'));
        this.setControlValue('OriginalCompanyInvoiceNumber', 0);
        this.setControlValue('OriginalInvoiceNumber', 0);
        this.setControlValue('ProducedCompanyInvoiceNumber', 0);
        this.setControlValue('ProducedInvoiceNumber', 0);
        this.setControlValue('TaxInvoiceNumber', 0);
        this.setControlValue('DiscountCode', ''); // Fix for IUI-16805
    }


    public BuildTabs(): void {
        this.setControlValue('BusinessCode', this.businessCode());
        this.riMaintenance.CurrentMode = MntConst.eModeUpdate;

        switch (this.parentMode) {
            case 'UninvoicedInstallation':
                this.setControlValue('ContractNumber', this.riExchange.getParentAttributeValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentAttributeValue('ContractName'));
                this.setControlValue('PremiseNumber', this.riExchange.getParentAttributeValue('PremiseNumber'));
                this.setControlValue('PremiseName', this.riExchange.getParentAttributeValue('PremiseName'));
                break;
            default:
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
                this.setControlValue('AccountName', this.riExchange.getParentHTMLValue('AccountName'));
                this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                break;
        }

        if (this.pageParams.currentContractType !== 'C') {
            this.pageParams.labelInvoiceFrequencyCode = false;
            this.pageParams.InvoiceFrequencyCode = false;
            this.pageParams.labelInvoiceAnnivDate = false;
            this.pageParams.InvoiceAnnivDate = false;
            if (this.pageParams.currentContractType === 'J') {
                this.pageParams.trEndDate = false;
            } else {
                this.pageParams.trEndDate = true;
            }
        } else {
            this.pageParams.labelInvoiceFrequencyCode = true;
            this.pageParams.InvoiceFrequencyCode = true;
            this.pageParams.labelInvoiceAnnivDate = true;
            this.pageParams.InvoiceAnnivDate = true;
            this.pageParams.trEndDate = true;
        }

        if (this.pageParams.blnEnableCreateServiceValue) {
            this.pageParams.trServiceSalesEmployee = true;
        } else {
            this.pageParams.trServiceSalesEmployee = false;
        }

        switch (this.parentMode) {
            case 'ServiceCoverAdd':
                this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));

                this.pageParams.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID'); // ProductCode
                this.setAttribute('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);
                break;
            case 'ServiceCover':
                this.pageParams.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID'); // ProductCode
                this.setAttribute('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);
                break;
            case 'UninvoicedInstallation':
                this.pageParams.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID'); // grdUninvoicedInstallation
                this.setAttribute('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);
                break;
            case 'ProRataCharge':
                this.pageParams.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID'); // ContractNumber
                this.setAttribute('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);
                break;
            case 'ProRataChargeRO':
                this.pageParams.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID'); // ContractNumber
                this.setAttribute('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);
                break;
            default:
                this.pageParams.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID'); // ContractNumber
                this.setAttribute('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);
                break;
        }
        this.setControlValue('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);

        this.riMaintenance.BusinessObject = 'riControl.p';

        this.riMaintenance.CustomBusinessObject = 'iCABSProRataChargeEntry.p';
        this.riMaintenance.CustomBusinessObjectSelect = true;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = true;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;

        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionSelect = false;
        this.riMaintenance.FunctionDelete = false;
        this.riMaintenance.DisplayMessages = true;

        switch (this.parentMode) {
            case 'ContractHistory':
            case 'Contract':
            case 'Premise':
            case 'UninvoicedInstallation':
            case 'ProRataCharge':
            case 'ProRataChargeRO':
                this.riMaintenance.FunctionAdd = false;
                break;
            case 'ProRataChargeRO':
                this.riMaintenance.FunctionUpdate = false;
                break;
            default:
                break;
        }
        switch (this.parentMode) {
            case 'ContractHistory':
            case 'PremiseHistory':
            case 'ServiceCoverHistory':
            case 'Contract':
            case 'Premise':
            case 'ServiceCover':
            case 'Search':
            case 'ProRataCharge':
            case 'ProRataChargeRO':
                this.setAttribute('ProRataChargeROWID', this.riExchange.getParentAttributeValue('ProRataChargeROWID'));
                this.setControlValue('ProRataChargeROWID', this.riExchange.getParentAttributeValue('ProRataChargeROWID'));
                break;
            case 'UninvoicedInstallation':
                this.setAttribute('ProRataChargeROWID', this.riExchange.getParentAttributeValue('ProRataChargeROWID'));
                this.setControlValue('ProRataChargeROWID', this.riExchange.getParentAttributeValue('ProRataChargeROWID'));
                break;
            default:
                break;
        }
        if (this.riExchange.URLParameterContains('ProRataChargeROWID')) {
            this.setAttribute('ProRataChargeROWID', this.riExchange.getParentAttributeValue('ProRataChargeROWID'));
            this.setControlValue('ProRataChargeROWID', this.riExchange.getParentAttributeValue('ProRataChargeROWID'));
        }

        this.riMaintenance.AddTable('ProRataCharge');

        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
        this.riMaintenance.AddTableKeyAlignment('ContractNumber', MntConst.eAlignmentRight);

        if (this.parentMode === 'ServiceCoverAdd') {
            switch (this.riExchange.getParentAttributeValue('Level')) {
                case 'Contract':
                    this.pageParams.trProductstyledisplay = false;
                    this.pageParams.trPremisestyledisplay = false;
                    break;
                case 'Premise':
                    this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                    this.pageParams.trProductstyledisplay = false;
                    break;
                case 'ServiceCover':
                    this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                    this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                    this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
                    break;
                default:
                    this.pageParams.trProductstyledisplay = true;
                    this.pageParams.trPremisestyledisplay = true;
                    this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                    this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
                    this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
                    break;
            }
        } else {
            this.pageParams.trProductstyledisplay = true;
            this.pageParams.trPremisestyledisplay = true;
            this.riMaintenance.AddTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
            this.riMaintenance.AddTableKey('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
            this.riMaintenance.AddTableKey('ProRataChargeROWID', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'Key');
            this.riMaintenance.AddTableKeyAlignment('ProductCode', MntConst.eAlignmentRight);
        }

        this.riMaintenance.AddTableField('AccountNumber', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateFixed, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('AccountNumber', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('PremiseNumber', MntConst.eTypeInteger, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'ReadOnly');
        this.riMaintenance.AddTableField('ProductCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateFixed, 'ReadOnly');

        this.riMaintenance.AddTableField('InvoiceCreditCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('InvoiceCreditCode', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableField('InvoiceGroupNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('StartDate', MntConst.eTypeDate, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableFieldAlignment('StartDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableField('EndDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldAlignment('EndDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableField('ToBeReleasedDate', MntConst.eTypeDate, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableFieldAlignment('ToBeReleasedDate', MntConst.eAlignmentCenter);

        this.riMaintenance.AddTableField('ProRataChargeStatusCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        //this.riMaintenance.AddTableField('ServiceQuantity', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ProRataChargeValue', MntConst.eTypeCurrency, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('ServiceSalesEmployee', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableFieldAlignment('ServiceSalesEmployee', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('TaxPointDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldAlignment('TaxPointDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableField('PrintCreditInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');

        this.riMaintenance.AddTableField('ProducedInvoiceNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ProducedInvoiceRUN', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ShowPaidDate', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('PaidDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');

        let elementOriginalInvoiceNumber = this.el.nativeElement.querySelector('#OriginalInvoiceNumber');
        let elementOriginalInvoiceItemNumber = this.el.nativeElement.querySelector('#OriginalInvoiceItemNumber');
        if (this.pageParams.logAllowNoniCABSInvoiceNumbers) {
            if (this.pageParams.blnOriginalInvoiceNumberMandatory) {
                this.riMaintenance.AddTableField('OriginalInvoiceNumber', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Required');
            } else {
                this.riMaintenance.AddTableField('OriginalInvoiceNumber', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            }
            this.renderer.setElementAttribute(elementOriginalInvoiceNumber, MntConst.eTypeText, '');
            this.controls[27].type = MntConst.eTypeText;
            this.riMaintenance.AddTableField('OriginalInvoiceItemNumber', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.renderer.setElementAttribute(elementOriginalInvoiceItemNumber, MntConst.eTypeInteger, '');
            this.controls[32].type = MntConst.eTypeText;
        } else {
            if (this.pageParams.blnOriginalInvoiceNumberMandatory) {
                this.riMaintenance.AddTableField('OriginalInvoiceNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Required');
            } else {
                this.riMaintenance.AddTableField('OriginalInvoiceNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            }
            this.renderer.setElementAttribute(elementOriginalInvoiceNumber, MntConst.eTypeInteger, '');
            this.controls[27].type = MntConst.eTypeInteger;
            this.riMaintenance.AddTableField('OriginalInvoiceItemNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.renderer.setElementAttribute(elementOriginalInvoiceItemNumber, MntConst.eTypeInteger, '');
            this.controls[32].type = MntConst.eTypeInteger;
        }

        this.riMaintenance.AddTableField('TaxCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableFieldAlignment('TaxCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('InvoiceCreditReasonCode', MntConst.eTypeCode, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableFieldAlignment('InvoiceCreditReasonCode', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('ServiceBranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Lookup');

        if (this.pageParams.blnEnableAutoCreditNoteNarrative) {
            this.riMaintenance.AddTableField('ProRataNarrative', MntConst.eTypeTextFree, MntConst.eFieldOptionRequried, MntConst.eFieldStateNormal, 'Required');
        } else {
            this.riMaintenance.AddTableField('ProRataNarrative', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        }

        this.riMaintenance.AddTableField('UseProRataNarrative', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('AdditionalCreditInfo', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CreditMissedServiceInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CreditNumberOfVisits', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('LostBusinessRequestNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('DiscountCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Lookup');
        this.riMaintenance.AddTableField('OutsortInvoice', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ErrorMessage', MntConst.eTypeTextFree, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableFieldPostData('ErrorMessage', false);
        this.riMaintenance.AddTableField('ApprovedUser', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('CostValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('PurchaseOrderNo', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('TaxInvoiceNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');

        this.riMaintenance.AddTableCommit(this, function (data: any): void {
            if (data) {
                if ((this.riMaintenance.CurrentMode === MntConst.eModeUpdate)) {// (Object.keys(data).length > 1)
                    this.riMaintenance.renderResponseForCtrl(this, data);
                    this.GetCompany();
                    this.BuildVirtualTab();
                    this.riMaintenance_AfterFetch();
                    this.riExchange_CBORequest();
                    this.riMaintenance_BeforeUpdateMode();
                } else {
                    this.DisplayInvoiceCreditDesc();
                    // Fix for IUI-16805
                    // this.getRouterParamsData();
                }
            }
        });

        this.riMaintenance.AddTable('*');
        let element = this.el.nativeElement.querySelector('#OriginalCompanyInvoiceNumber');
        if (this.pageParams.logAllowNoniCABSInvoiceNumbers) {
            this.controls[26].type = MntConst.eTypeText;
            this.riMaintenance.AddTableField('OriginalCompanyInvoiceNumber', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.renderer.setElementAttribute(element, MntConst.eTypeText, '');
        } else {
            this.controls[26].type = MntConst.eTypeInteger;
            this.riMaintenance.AddTableField('OriginalCompanyInvoiceNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
            this.renderer.setElementAttribute(element, MntConst.eTypeInteger, '');
        }

        this.riMaintenance.AddTableField('OriginalCompanyCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('ProducedCompanyInvoiceNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ProducedCompanyCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ContractTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');

        this.riMaintenance.AddTableCommit(this);

        this.riMaintenance.Complete();

        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceCreditDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OriginalInvoiceNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProducedInvoiceNumber');

        this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceSalesEmployee');

        this.pageParams.trDiscountCode = this.pageParams.vEnableDiscountCode ? true : false;
        switch (this.parentMode) {
            case 'ServiceCoverAdd':
                if (!this.pageParams.AfterSave) {
                    this.riMaintenance.AddMode();
                    this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
                } else {
                    this.riMaintenance.UpdateMode();
                    this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
                }
                break;
            default:
                this.riMaintenance.FetchRecord();
                if (!this.getControlValue('ApprovedUser')) {
                    this.riMaintenance.FunctionUpdate = false;
                }
                this.riMaintenance.UpdateMode();
                this.riMaintenance.execMode(this.riMaintenance.CurrentMode, [this]);
                break;
        }

        if (this.pageParams.blnOriginalInvoiceNumberMandatory) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalCompanyInvoiceNumber', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalInvoiceNumber', true);
            // 'Since the OriginalCompanyCode is always required when we have the OriginalCompanyInvoiceNumber, mark as required from start
            this.dropdown.OriginalCompanyCode.isRequired = true;
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalCompanyInvoiceNumber', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalInvoiceNumber', false);
            this.dropdown.OriginalCompanyCode.isRequired = false;
        }
    }

    public BuildVirtualTab(): void {
        this.riMaintenance.AddVirtualTable('Contract');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableField('InvoiceFrequencyCode', MntConst.eTypeInteger, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableField('InvoiceAnnivDate', MntConst.eTypeDate, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Premise');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeCodeNumeric, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Account');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('AccountName', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Product');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateFixed, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('InvoiceGroup');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('AccountNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateFixed, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('InvoiceGroupNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('InvoiceGroupDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Employee');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceSalesEmployee', 'Virtual');
        this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('TaxCode');
        this.riMaintenance.AddVirtualTableKey('TaxCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('TaxCodeDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('InvoiceCreditReasonLang');
        this.riMaintenance.AddVirtualTableKey('InvoiceCreditReasonCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('InvoiceCreditReasonDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Branch');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('BranchNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'ServiceBranchNumber', 'Virtual');
        this.riMaintenance.AddVirtualTableField('BranchName', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('ProRataChargeStatusLang');
        this.riMaintenance.AddVirtualTableKey('ProRataChargeStatusCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode(), '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ProRataChargeStatusDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Company', 'ProducedCompany');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('CompanyCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'ProducedCompanyCode', 'Virtual');
        this.riMaintenance.AddVirtualTableField('CompanyDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual', 'ProducedCompanyDesc');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Company', 'OriginalCompany');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('CompanyCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', 'OriginalCompanyCode', 'Virtual');
        this.riMaintenance.AddVirtualTableField('CompanyDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual', 'OriginalCompanyDesc');
        this.riMaintenance.AddVirtualTableCommit(this, this.handleVirtualTableCallback);

        // TODO: to check with Debjyoti if can be integrate in riMaintenance itself
        // fix for IUI-18007 - DEFECT - Discount Description populated without code
        if (this.getControlValue('DiscountCode')) {
            this.riMaintenance.AddVirtualTable('Discount');
            this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.AddVirtualTableKey('DiscountCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
            this.riMaintenance.AddVirtualTableField('DiscountDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
            this.riMaintenance.AddVirtualTableCommit(this, this.handleVirtualTableCallback);
        }
    }

    public handleVirtualTableCallback(): void {
        if (moment(this.getControlValue('InvoiceAnnivDate')).isValid()) { // yyyy-mm-dd
            this.setControlValue('InvoiceAnnivDate', this.convertNewDate(this.getControlValue('InvoiceAnnivDate')));
        }

        this.ellipsis.ServiceSalesEmployee.childConfigParams.serviceBranchNumber = this.utils.getBranchCode();
        if (this.getControlValue('ServiceBranchNumber')) {
            this.branchDropdown.active = {
                id: this.getControlValue('ServiceBranchNumber'),
                text: this.getControlValue('ServiceBranchNumber') + ' - ' + this.getControlValue('BranchName')
            };
        }

        if (this.getControlValue('ProRataChargeStatusCode')) {
            this.languageDropdown.active = {
                id: this.getControlValue('ProRataChargeStatusCode'),
                text: this.getControlValue('ProRataChargeStatusCode') + ' - ' + this.getControlValue('ProRataChargeStatusDesc')
            };
        }

        if (this.getControlValue('ProducedCompanyCode')) {
            this.companyDropdown.active = {
                id: this.getControlValue('ProducedCompanyCode'),
                text: this.getControlValue('ProducedCompanyCode') + ' - ' + this.getControlValue('ProducedCompanyDesc')
            };
        }

        if (this.getControlValue('OriginalCompanyCode')) {
            this.companyDropdown.active = {
                id: this.getControlValue('OriginalCompanyCode'),
                text: this.getControlValue('OriginalCompanyCode') + ' - ' + this.getControlValue('OriginalCompanyDesc')
            };
        }

        if (this.getControlValue('InvoiceCreditReasonCode')) {
            this.dropdown.invoiceCreditReasonCode.isActive = {
                id: this.getControlValue('InvoiceCreditReasonCode'),
                text: this.getControlValue('InvoiceCreditReasonCode') + ' - ' + this.getControlValue('InvoiceCreditReasonDesc')
            };
        }
    }

    //look up
    private doLookUpOnLoad(): any {
        let lookupIPpublic = [
            {
                'table': 'Company',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'DefaultCompanyInd': 'TRUE'
                },
                'fields': ['CompanyCode', 'CompanyDesc']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupIPpublic).then((data) => {
            if (data && data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            } else {
                let resultCompany = data[0];
                if (resultCompany[0]) {
                    this.pageParams.vDefaultCompanyCode = resultCompany[0].CompanyCode;
                    this.pageParams.vDefaultCompanyDesc = resultCompany[0].CompanyDesc;

                    this.pageParams.strDefaultCompanyCode = this.pageParams.vDefaultCompanyCode;
                    this.pageParams.strDefaultCompanyDesc = this.pageParams.vDefaultCompanyDesc;
                    // Fix for IUI-15786
                    this.setControlValue('OriginalCompanyCode', this.pageParams.vDefaultCompanyCode);
                    this.setControlValue('OriginalCompanyDesc', this.pageParams.vDefaultCompanyDesc);
                }
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    public riMaintenance_BeforeAddMode(): void {
        this.pageParams.blnUpdatedRecord = true;

        this.pageParams.boolCreditApprovals = this.pageParams.vEnableCreditApprovals ? true : false;

        this.pageParams.trPrintCredit = false;
        this.setControlValue('InvoiceCreditDesc', '');

        if (this.pageParams.mode === 'AdditionalCharge') {
            this.setControlValue('InvoiceCreditCode', 'I');
            this.pageParams.trAdditionalCreditInfo = false;
        } else {
            this.setControlValue('InvoiceCreditCode', 'C');
            this.setControlValue('ToBeReleasedDate', this.convertNewDate(new Date()));
            this.pageParams.trCreditMissedServiceInd = true;
            this.pageParams.tdCreditNumberOfVisits = false;
            this.setControlValue('CreditMissedServiceInd', false);
            this.pageParams.trAdditionalCreditInfo = true;

            if (this.pageParams.boolCreditApprovals === true) {
                this.dropdown.ProRataChargeStatusCode.disabled = true;
            }
        }

        if (this.pageParams.blnSCDefaultExtractDate) {
            // 'Default the Extract date to be the next invoice start date if the Default SysChar is Enabled
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetExtractDate';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('ContractNumber');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.setControlValue('ToBeReleasedDate', data.ToBeReleasedDate);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        }

        // 'Do not allow status to be changed when adding a new record (default should be '(A)waiting approval //MDP 28/07/08')
        // 'this.riMaintenance.DisableInput('ProRataChargeStatusCode')

        // 'Do not allow entry of Tax Point Date on additional INVOICE charges
        if (this.getControlValue('InvoiceCreditCode') === 'I') {
            this.riMaintenance.DisableInput('TaxPointDate');
            this.pageParams.trTaxPointDate = false;
        } else {
            this.pageParams.trTaxPointDate = true;
        }

        this.DisplayInvoiceCreditDesc();

        this.setControlValue('LostBusinessRequestNumber', this.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));

        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetDefaults&ServiceCoverRowID=' + this.getControlValue('ServiceCoverRowID') + '&InvoiceCreditCode=' + this.getControlValue('InvoiceCreditCode');

        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ContractNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data && data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
            } else {
                this.setControlValue('InvoiceGroupNumber', data.InvoiceGroupNumber);
                this.riMaintenance.renderResponseForCtrl(this, data);
                this.ellipsis.InvoiceGroupNumber.childConfigParams.AccountNumber = this.getControlValue('AccountNumber');
                this.ellipsis.ServiceSalesEmployee.childConfigParams.serviceBranchNumber = this.utils.getBranchCode();
                if (data.ServiceBranchNumber) {
                    this.branchDropdown.active = {
                        id: data.ServiceBranchNumber,
                        text: data.ServiceBranchNumber + ' - ' + data.BranchName
                    };
                }
                if (data.ProducedCompanyCode) {
                    this.companyDropdown.active = {
                        id: data.ProducedCompanyCode,
                        text: data.ProducedCompanyCode + ' - ' + data.ProducedCompanyDesc
                    };
                }
                if (data.ProRataChargeStatusCode) {
                    this.languageDropdown.active = {
                        id: data.ProRataChargeStatusCode,
                        text: data.ProRataChargeStatusCode + ' - ' + data.ProRataChargeStatusDesc
                    };
                }
            }
        });

        if (this.getControlValue('InvoiceCreditCode') === 'C') {
            this.setControlValue('PrintCreditInd', true);
        } else {
            this.pageParams.blnOriginalInvoiceNumberMandatory = false;
        }

        if (this.pageParams.blnOriginalInvoiceNumberMandatory) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalCompanyInvoiceNumber', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalInvoiceNumber', true);
            this.dropdown.OriginalCompanyCode.isRequired = true;
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalCompanyInvoiceNumber', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalInvoiceNumber', false);
            this.dropdown.OriginalCompanyCode.isRequired = false;
        }

        if (this.pageParams.blnEnableCreateServiceValue) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceSalesEmployee');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceSalesEmployee', true);
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ServiceSalesEmployee', false);
        }

        this.getDefaultDiscountCode();
    }

    public getDefaultDiscountCode(): void {
        if (this.pageParams.blnSCEnableDiscountCode) {
            // 'Make request to get default discount code for Business
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetDefaultDiscountCode';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.riMaintenance.renderResponseForCtrl(this, data);
                }
            });
        }
    }

    public riExchange_CBORequest(): void {
        if (this.riExchange.riInputElement.HasChanged(this.uiForm, 'ProRataChargeValue')
            && (this.getControlValue('ProRataChargeValue'))) {

            this.riMaintenance.CBORequestClear();

            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=WarnValue';

            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('InvoiceCreditCode');
            this.riMaintenance.CBORequestAdd('ProRataChargeValue');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.riMaintenance.renderResponseForCtrl(this, data);
                }
            });
        }
    }

    public CheckCreditValue(): void {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckCreditValue&ServiceCoverRowID=' + this.getControlValue('ServiceCoverRowID') + '&ProRataChargeROWID=' + this.getControlValue('ProRataChargeROWID');

        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('ProRataChargeValue');
        this.riMaintenance.CBORequestAdd('InvoiceCreditCode');
        this.riMaintenance.CBORequestAdd('ToBeReleasedDate');
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            if (data.ErrorMessage) {
                // this.riExchange.Information.Description = data.ErrorMessage;
                // this.riExchange.Information.display();
                this.modalAdvService.emitMessage(new ICabsModalVO(data.ErrorMessage));
                data.ErrorMessage = '';
                this.setControlValue('ErrorMessage', data.ErrorMessage);
            } else {
                this.riMaintenance.renderResponseForCtrl(this, data);
            }
        });
    }

    public CheckInvoiceCredit(): void {
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=CheckInvoiceCredit';

        this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.CBORequestAdd('OriginalInvoiceNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.riMaintenance.CBORequestExecute(this, function (data: any): any {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.ErrorMessage) {
                this.modalAdvService.emitMessage(new ICabsModalVO(data.ErrorMessage));
                data.ErrorMessage = '';
                this.setControlValue('ErrorMessage', data.ErrorMessage);
            }
        });
    }

    public riMaintenance_BeforeUpdateMode(): void {
        this.pageParams.blnUpdatedRecord = false;
        this.pageParams.trAdditionalCreditInfo = true;
        this.riExchange.riInputElement.Disable(this.uiForm, 'CreditMissedServiceInd');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceSalesEmployee');
        this.dropdown.ProRataChargeStatusCode.disabled = false;

        // 'SH 14/02/2003 Do not allow entry of Tax Point Date on additional INVOICE charges
        if (this.getControlValue('InvoiceCreditCode') === 'I') {
            this.riMaintenance.DisableInput('TaxPointDate');
            this.pageParams.trTaxPointDate = false;
            this.pageParams.blnOriginalInvoiceNumberMandatory = false;
        } else {
            this.pageParams.trTaxPointDate = true;
            this.pageParams.blnOriginalInvoiceNumberMandatory = true;
        }

        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetDefaults&BusinessCode=' + this.businessCode()
            + '&ProRataChargeROWID=' + this.getControlValue('ProRataChargeROWID');

        if (this.pageParams.blnOriginalInvoiceNumberMandatory) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalCompanyInvoiceNumber', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalInvoiceNumber', true);
            // 'Since the OriginalCompanyCode is always required when we have the OriginalCompanyInvoiceNumber, mark as required from start
            this.dropdown.OriginalCompanyCode.isRequired = true;
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalCompanyInvoiceNumber', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OriginalInvoiceNumber', false);
            this.dropdown.OriginalCompanyCode.isRequired = false;
        }

        // this.getDefaultDiscountCode();
    }

    public riMaintenance_AfterFetch(): void {
        if (this.getControlValue('ShowPaidDate') === 'Y') {
            this.pageParams.tdPaidDateLabel = true;
            this.pageParams.tdPaidDate = true;
        }
        if (this.getControlValue('InvoiceCreditCode') === 'I') {
            this.pageParams.trTaxPointDate = false;
            this.pageParams.blnOriginalInvoiceNumberMandatory = false;
        } else {
            this.pageParams.trTaxPointDate = true;
            this.pageParams.blnOriginalInvoiceNumberMandatory = true;
        }

        this.DisplayInvoiceCreditDesc();

        this.pageParams.trCreditMissedServiceInd = false;
        if (this.getControlValue('InvoiceCreditReasonCode')) {
            this.pageParams.OrigReasonCode = this.getControlValue('InvoiceCreditReasonDesc');
        } else {
            this.pageParams.OrigReasonCode = '';
        }

        this.ellipsis.InvoiceGroupNumber.childConfigParams.AccountNumber = this.getControlValue('AccountNumber');
    }

    public riMaintenance_BeforeConfirm(): void {
        if (this.riExchange.riInputElement.isError(this.uiForm, 'ProRataNarrative'))
            this.setControlValue('ProRataNarrative', '');
        if (this.riExchange.riInputElement.isError(this.uiForm, 'ProRataNarrative'))
            this.setControlValue('AdditionalCreditInfo', '');

        this.pageParams.lError = false;

        if (!this.getControlValue('ProRataNarrative')) {
            this.pageParams.lError = true;
        }

        if (!this.pageParams.lError) {
            if (this.getControlValue('ProRataNarrative')) {
                if (this.getControlValue('ProRataNarrative').length > 500) {
                    this.pageParams.lError = true;
                }
            }
        }

        if (this.pageParams.blnEnableAutoCreditNoteNarrative && this.pageParams.lError) {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ProRataNarrative', true);
            this.riMaintenance.CancelEvent = true;
        }

        this.pageParams.lError = false;

        if (this.getControlValue('AdditionalCreditInfo')) {
            if (this.getControlValue('AdditionalCreditInfo').length > 100) {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'AdditionalCreditInfo', true);
                this.riMaintenance.CancelEvent = true;
            }
        }
    }

    public riMaintenance_BeforeSave(): void {
        if (!this.getControlValue('OriginalInvoiceNumber')) {
            this.setControlValue('OriginalInvoiceNumber', this.getControlValue('OriginalCompanyInvoiceNumber'));
        }

        if (this.getControlValue('OriginalInvoiceNumber')
            && (this.getControlValue('InvoiceCreditCode') === 'C')) {
            this.CheckInvoiceCredit();
        }

        if (this.getControlValue('ContractTypeCode') === 'J') {
            this.CheckCreditValue();
        }
        this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'ServiceCoverRowID=' + this.getControlValue('ServiceCoverRowID');

        // 'if (Changing status of a Pro Rata Charge(Invoice) to 'Waiting' and Credit Note Narrative is blank - populate with Reason Code.
        if (this.getControlValue('ProRataChargeStatusCode') === 'W' && this.getControlValue('InvoiceCreditCode') === 'I') {

            if (this.pageParams.blnEnableAutoCreditNoteNarrative && !this.getControlValue('ProRataNarrative')) {
                this.setControlValue('ProRataNarrative', this.getControlValue('InvoiceCreditReasonDesc'));
            }

        }
    }

    public riMaintenance_AfterSaveAdd(): void {
        // Functionality is moved under on success block of riMaintenance_AfterSave() function
    }

    public riMaintenance_AfterAbandon(): void {
        if (this.riExchange.riInputElement.isEmpty(this.uiForm, 'InvoiceCreditCode')) {
            this.setControlValue('InvoiceCreditDesc', '');
        } else {
            this.DisplayInvoiceCreditDesc();
        }
    }

    public riExchange_UnloadHTMLDocument(): void {
        if (this.pageParams.blnUpdatedRecord) {
            //TODO: this.riExchange.UpdateParentHTMLDocument();
        }
    }

    public riMaintenance_AfterSave(): void {
        let fields;
        if (this.riMaintenance.CurrentMode === MntConst.eModeSaveAdd)
            fields = `ContractNumber,PremiseNumber,ProductCode,AccountNumber,InvoiceCreditCode,InvoiceGroupNumber,StartDate,EndDate,ToBeReleasedDate,ProRataChargeStatusCode,ServiceQuantity,ProRataChargeValue,ServiceSalesEmployee,PrintCreditInd,TaxCode,InvoiceCreditReasonCode,ServiceBranchNumber,ProRataNarrative,UseProRataNarrative,CreditMissedServiceInd,CreditNumberOfVisits,OutsortInvoice,ApprovedUser,TaxPointDate, ProducedInvoiceNumber, ProducedInvoiceRUN, ShowPaidDate, PaidDate, OriginalInvoiceNumber, OriginalInvoiceItemNumber, AdditionalCreditInfo, LostBusinessRequestNumber, DiscountCode, CostValue, PurchaseOrderNo, TaxInvoiceNumber, OriginalCompanyInvoiceNumber, OriginalCompanyCode, ProducedCompanyInvoiceNumber, ProducedCompanyCode, ContractTypeCode,ServiceCoverRowID`;
        if (this.riMaintenance.CurrentMode === MntConst.eModeSaveUpdate)
            fields = `OriginalCompanyInvoiceNumber,OriginalCompanyCode,ProducedCompanyInvoiceNumber,ProducedCompanyCode,ContractTypeCode,ProRataChargeROWID,ContractNumber,PremiseNumber,AccountNumber,InvoiceCreditCode,InvoiceGroupNumber,StartDate,EndDate,ToBeReleasedDate,ProRataChargeStatusCode,ServiceQuantity,ProRataChargeValue,ServiceSalesEmployee,TaxPointDate,PrintCreditInd,ProducedInvoiceNumber,ProducedInvoiceRUN,ShowPaidDate,PaidDate,OriginalInvoiceNumber,OriginalInvoiceItemNumber,TaxCode,InvoiceCreditReasonCode,ServiceBranchNumber,ProRataNarrative,UseProRataNarrative,AdditionalCreditInfo,CreditMissedServiceInd,CreditNumberOfVisits,LostBusinessRequestNumber,DiscountCode,OutsortInvoice,ApprovedUser,CostValue,PurchaseOrderNo,TaxInvoiceNumber,ServiceCoverRowID`;
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        let fieldsArr = fields.split(',');

        this.riMaintenance.clear();
        this.ajaxSource.next(this.ajaxconstant.START);
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            let value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data && data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                this.markAsPrestine();
                this.pageParams.tdCreditNumberOfVisits = false;
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                this.setControlValue('ProRataChargeROWID', data.ProRataCharge);
                this.pageParams.AfterSave = true;

                // riMaintenance_AfterSaveAdd block - Start
                this.pageParams.blnUpdatedRecord = true;

                if (this.getControlValue('CreditMissedServiceInd')) {
                    this.setAttribute('ProRataChargeROWID', this.getControlValue('ProRataChargeROWID'));
                    this.setAttribute('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));

                    this.riExchange.Mode = 'CreditMissedService';
                    this.navigate('CreditMissedService', InternalMaintenanceServiceModuleRoutes.ICABSSECREDITSERVICEVISITGROUPMAINTENANCE,
                        { currentContractTypeURLParameter: this.pageParams.CurrentContractTypeURLParameter });
                }

                this.pageParams.trCreditMissedServiceInd = false;
                // riMaintenance_AfterSaveAdd block - End
            }
        }, 'POST', this.actionAfterSave);
    }

    public InvoiceCreditCode_ondeactivate(): void {
        this.DisplayInvoiceCreditDesc();
        if (this.getControlValue('InvoiceCreditCode') === 'I') {
            this.pageParams.trPrintCredit = false;
        } else {
            this.pageParams.trPrintCredit = true;
        }
    }

    public CreditMissedServiceInd_onclick(): void {
        if (this.getControlValue('CreditMissedServiceInd')) {
            this.pageParams.tdCreditNumberOfVisits = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CreditNumberOfVisits', true);
        } else {
            this.pageParams.tdCreditNumberOfVisits = false;
            this.setControlValue('CreditNumberOfVisits', parseInt('0', 10));
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CreditNumberOfVisits', false);
        }
    }

    @HostListener('change', ['$event']) onChange(event: any): void {
        switch (event.keyCode) {
            case 34:
                if (event.name === 'ContractNumber') {
                    // this.riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAContractSearch.htm<maxwidth>'
                }
                if (event.name === 'PremiseNumber') {
                    // this.riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAPremiseSearch.htm'
                }
                if (event.name === 'TaxCode') {
                    // this.riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSTaxCodeSearch.htm'
                }
                if (event.name === 'ProRataChargeStatusCode') {
                    // riExchange.Mode = 'ProRataChargeMaintenance': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSProRataChargeStatusLanguageSearch.htm'
                }
                break;
        }
    }

    public ProRataChargeStatusCode_onkeydown(data: any): void {
        if (data) {
            this.setControlValue('ProRataChargeStatusCode', data['ProRataChargeStatusLang.ProRataChargeStatusCode']);
            this.setControlValue('ProRataChargeStatusDesc', data['ProRataChargeStatusLang.ProRataChargeStatusDesc']);
        }
    }
    public invoiceCreditReasonCodeOnkeydown(data: any): void {
        if (data) {
            this.setControlValue('InvoiceCreditReasonCode', data['InvoiceCreditReasonLang.InvoiceCreditReasonCode'] || '');
            this.setControlValue('InvoiceCreditReasonDesc', data['InvoiceCreditReasonLang.InvoiceCreditReasonDesc'] || '');
            if (data['InvoiceCreditReasonLang.InvoiceCreditReasonCode'])
                this.InvoiceCreditReasonCode_ondeactivate();
        }
    }

    public ServiceBranchNumber_onkeydown(data: any): void {
        // riExchange.Mode = 'LookUp-ServBranch': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBBranchSearch.htm'
        this.setControlValue('ServiceBranchNumber', data.ServiceBranchNumber || '');
    }
    public InvoiceGroupNumber_onkeydown(data: any): void {
        // riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAInvoiceGroupSearch.htm'
        if (data) {
            this.setControlValue('InvoiceGroupNumber', data.InvoiceGroupNumber || '');
            this.setControlValue('InvoiceGroupDesc', data.InvoiceGroupDesc || '');
        }
    }

    public DiscountCode_onkeydown(data: any): void {
        // riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBDiscountSearch.htm'
        if (data) {
            this.setControlValue('DiscountCode', data.DiscountCode || '');
            this.setControlValue('DiscountDesc', data.DiscountDesc || '');
        }
    }

    public OriginalCompanyCode_onkeydown(): void {
        // riExchange.Mode = 'LookUp-ProRata-Original': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBCompanySearch.htm'
        this.OriginalCompanyFieldChange();
    }

    public ProducedCompanyCode_onkeydown(data: any): void {
        // this.riExchange.Mode = 'LookUp-ProRata-Produced': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBCompanySearch.htm'
        this.dropdown.ProducedCompanyCode.active = {
            id: data.ProducedCompanyCode,
            text: data.ProducedCompanyCode + ' - ' + data.ProducedCompanyDesc
        };
        this.setControlValue('ProducedCompanyCode', data.ProducedCompanyCode || '');
        this.setControlValue('ProducedCompanyDesc', data.ProducedCompanyDesc || '');
    }

    public ServiceSalesEmployee_onkeydown(data: any): void {
        // this.riExchange.Mode = 'LookUp-ServiceCoverCommissionEmployee': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBEmployeeSearch.htm'
        if (data) {
            this.setControlValue('ServiceSalesEmployee', data.ServiceSalesEmployee || '');
            this.setControlValue('EmployeeSurname', data.EmployeeSurname || '');
        }
    }

    public taxCodeOnKeyDown(data: any): void {
        if (data) {
            this.setControlValue('TaxCode', data.TaxCode || '');
            this.setControlValue('TaxCodeDesc', data.TaxCodeDesc || '');
        }
    }

    public toUpperCase(event: any): void {
        let target = event.target.getAttribute('formControlName');
        let elementValue = event.target.value;
        if (elementValue)
            this.setControlValue(target, elementValue.toUpperCase());
    }

    public isNumber(event: any): void {
        let target = event.target.getAttribute('formControlName');
        if (!this.riExchange.riInputElement.isNumber(this.uiForm, target))
            this.riExchange.riInputElement.markAsError(this.uiForm, target);
    }

    public StartDate_onChange(data: any): void {
        this.setControlValue('StartDate', data.value);
        if (moment(data.value, 'DD/MM/YYYY').isValid())
            this.CheckStartDate(data.value);

        if (this.getControlValue('InvoiceCreditCode') === 'I') {
            this.setControlValue('ToBeReleasedDate', data.value);
            this.riExchange.riInputElement.isError(this.uiForm, 'ToBeReleasedDate');
        } else if ((this.getControlValue('InvoiceCreditCode') === 'C')
            && this.pageParams.blnOriginalInvoiceNumberRequired) {
            this.GetPeriodsLastOriginalInvoiceValues(data.value);
        }
    }

    public CheckStartDate(data: any): void {
        let iDate = this.convertNewDate(data);
        let iDay = new Date().getDate();
        let iYear = new Date().getFullYear();
        let iMonth = new Date().getMonth();

        this.pageParams.StartDate = moment(iDate);
        if (iMonth === 12) {
            this.pageParams.sValidDate = moment().date(0).month(1).year(iYear + 1);
        } else {
            this.pageParams.sValidDate = moment().date(0).month(iMonth).year(iYear);
        }
        let a = this.pageParams.StartDate;
        let b = this.pageParams.sValidDate;

        if (a.diff(b) > 0) {
            this.modalAdvService.emitMessage(new ICabsModalVO('The Start Date is greater than the end of the current month'));
        }
    }

    public EndDate_onChange(data: any): void {
        this.setControlValue('EndDate', data.value);
        if ((this.getControlValue('InvoiceCreditCode') === 'C') && this.pageParams.blnOriginalInvoiceNumberRequired) {
            this.GetPeriodsLastOriginalInvoiceValues(data.value);
        }
    }

    public convertNewDate(getDate: any): any {
        getDate = this.globalize.parseDateToFixedFormat(getDate);
        return this.globalize.parseDateStringToDate(getDate);
    }

    public TaxPointDate_onChange(data: any): void {
        this.setControlValue('TaxPointDate', data.value);
    }

    public PaidDate_onChange(data: any): void {
        this.setControlValue('PaidDate', data.value);
    }

    public InvoiceAnnivDate_onChange(data: any): void {
        this.setControlValue('InvoiceAnnivDate', this.convertNewDate(data.target.value));
    }

    public ToBeReleasedDate_onChange(data: any): void {
        this.setControlValue('ToBeReleasedDate', data.value);
    }

    public OriginalCompanyInvoiceNumber_onchange(): void {
        if (!this.riExchange.riInputElement.isNumber(this.uiForm, 'OriginalCompanyInvoiceNumber')) {
            this.pageParams.showAsteriskOriginalCompanyInvoiceNumber = true;
        }
        this.setControlValue('OriginalInvoiceNumber', this.getControlValue('OriginalCompanyInvoiceNumber')); //IUI-15757
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'OriginalCompanyInvoiceNumber').length > 1) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OriginalCompanyInvoiceNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'OriginalCompanyInvoiceNumber').replace(/^[0]+/g, ''));
        }
        if (this.getControlValue('OriginalCompanyInvoiceNumber')
            && this.riExchange.riInputElement.isNumber(this.uiForm, 'OriginalCompanyInvoiceNumber')) {
            this.OriginalCompanyFieldChange();
            this.OriginalCompanyInvoiceNumber_ondeactivate();
        }
    }

    public OriginalCompanyCode_onchange(data: any): void {
        if (data) {
            this.dropdown.OriginalCompanyCode.active = {
                id: data.OriginalCompanyCode || '',
                text: data.OriginalCompanyCode + ' - ' + data.OriginalCompanyDesc
            };
            this.setControlValue('OriginalCompanyCode', data.OriginalCompanyCode || '');
            this.setControlValue('OriginalCompanyDesc', data.OriginalCompanyDesc || '');
            if (this.getControlValue('OriginalCompanyCode')) { // Fix for IUI-15786
                this.OriginalCompanyFieldChange();
            }
            this.GetOriginalCompanyDesc();
            // this.GetCompany();
            this.OriginalCompanyCode_ondeactivate();
        }
    }

    public OriginalInvoiceItemNumber_onchange(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'OriginalInvoiceItemNumber').length > 1) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'OriginalInvoiceItemNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'OriginalInvoiceItemNumber').replace(/^[0]+/g, ''));
        }
        this.pageParams.OriginalCompanyCode = {
            id: 'OriginalCompanyCode',
            value: this.getControlValue('OriginalCompanyCode')
        };
        this.pageParams.OriginalCompanyInvoiceNumber = {
            id: 'OriginalCompanyInvoiceNumber',
            value: this.getControlValue('OriginalCompanyInvoiceNumber')
        };
        this.pageParams.OriginalInvoiceNumber = {
            id: 'OriginalInvoiceNumber',
            value: this.getControlValue('OriginalInvoiceNumber')
        };
        if (this.getControlValue('OriginalInvoiceItemNumber')) {
            this.SetInvoiceFieldsRequired(this.pageParams.OriginalCompanyCode, this.pageParams.OriginalCompanyInvoiceNumber, this.pageParams.OriginalInvoiceNumber);
            if (!this.pageParams.blnOriginalInvoiceNumberRequired
                && (this.getControlValue('InvoiceCreditCode') === 'C')) {
                this.GetOriginalInvoiceNumber(this.getControlValue('OriginalCompanyCode'), this.getControlValue('OriginalCompanyInvoiceNumber'), this.getControlValue('OriginalInvoiceNumber'));
            }
        }
    }

    public OriginalCompanyInvoiceNumber_ondeactivate(): void {
        if (this.getControlValue('OriginalInvoiceNumber')
            && this.getControlValue('OriginalCompanyCode')
            && (this.getControlValue('InvoiceCreditCode') !== 'I')) {

            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetTaxPointDate';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('OriginalInvoiceNumber');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.riMaintenance.renderResponseForCtrl(this, data);
                }
            });
        }
    }

    public OriginalCompanyCode_ondeactivate(): void {
        if (this.getControlValue('OriginalInvoiceNumber')
            && this.getControlValue('OriginalCompanyCode')
            && this.getControlValue('InvoiceCreditCode') !== 'I') {

            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetTaxPointDate';
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.riMaintenance.CBORequestAdd('OriginalInvoiceNumber');
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.riMaintenance.renderResponseForCtrl(this, data);
                }
            });
        }
    }

    public InvoiceCreditReasonCode_ondeactivate(): void {

        if (this.getControlValue('InvoiceCreditReasonCode')) {
            // With riExchange.Request
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSProRataChargeEntry.p';
            this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('Function', 'GetInvoiceCreditReasonDetails', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.riExchange.ClientSideValues.Fetch('BusinessCode'), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('InvoiceCreditReasonCode', this.getControlValue('InvoiceCreditReasonCode'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('CreditMissedServiceInd', MntConst.eTypeCheckBox);
            this.riMaintenance.ReturnDataAdd('InvoiceCreditReasonDesc', MntConst.eTypeText);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (data && data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.setControlValue('CreditMissedServiceInd', data.CreditMissedServiceInd);
                    this.setControlValue('InvoiceCreditReasonDesc', data.InvoiceCreditReasonDesc);

                    this.dropdown.invoiceCreditReasonCode.isActive = {
                        id: this.getControlValue('InvoiceCreditReasonCode'),
                        text: this.getControlValue('InvoiceCreditReasonCode') + ' - ' + this.getControlValue('InvoiceCreditReasonDesc')
                    };

                    if (this.pageParams.blnEnableAutoCreditNoteNarrative)
                        this.setControlValue('ProRataNarrative', data.InvoiceCreditReasonDesc);
                    this.CreditMissedServiceInd_onclick();
                }
            }, 'POST', 6);
            // 'if (Credit Narrative is equal to the reason code and description, update with new reason code
            if (this.pageParams.blnEnableAutoCreditNoteNarrative
                && (this.pageParams.OrigReasonCode === this.getControlValue('ProRataNarrative'))) {
                this.setControlValue('ProRataNarrative', this.getControlValue('InvoiceCreditReasonDesc'));
                this.pageParams.OrigReasonCode = this.getControlValue('ProRataNarrative');
            } else {
                this.setControlValue('ProRataNarrative', '');
                this.pageParams.OrigReasonCode = '';
            }
        } else {
            this.setControlValue('InvoiceCreditReasonDesc', '');

            // 'if (Credit Narrative is equal to the reason code and description, update with new reason code
            if (this.pageParams.OrigReasonCode === this.getControlValue('ProRataNarrative')) {
                this.setControlValue('ProRataNarrative', '');
                this.pageParams.OrigReasonCode = this.getControlValue('ProRataNarrative');
            }
        }
        this.GetTaxInvoiceNumber();
    }

    public GetPeriodsLastOriginalInvoiceValues(date: any): void {

        //   'get OriginalInvoiceNumber OriginalCompanyInvoiceNumber OriginalCompanyCode TaxPointDate
        if (!moment(date, 'DD/MM/YYYY').isValid()) {
            this.setControlValue('EndDate', '');
        }

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'StartDate')
            && !this.riExchange.riInputElement.isError(this.uiForm, 'StartDate')) {
            this.riMaintenance.CustomBusinessObjectAdditionalPostData = 'Function=GetPeriodsLastOriginalInvoiceValues&ServiceCoverRowID=' + this.getControlValue('ServiceCoverRowID') + '&StartDate=' + this.riExchange.riInputElement.GetValue(this.uiForm, 'StartDate') + '&EndDate=' + this.riExchange.riInputElement.GetValue(this.uiForm, 'EndDate');
            this.riMaintenance.CBORequestAddCS('BusinessCode', MntConst.eTypeCode);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.riMaintenance.CBORequestExecute(this, function (data: any): any {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.riMaintenance.renderResponseForCtrl(this, data);
                    this.GetOriginalCompanyDesc();
                    // this.GetCompany();
                    this.OriginalCompanyFieldChange();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

        }
    }

    public SetInvoiceFieldsRequired(objCompanyCode: any, objCompanyInvoiceNumber: any, objInvoiceNumber: any): void {
        if (objCompanyCode || objCompanyInvoiceNumber) {
            this.dropdown.OriginalCompanyCode.isRequired = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyCodeDesc', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, objCompanyInvoiceNumber.id, true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, objInvoiceNumber.id, true);

            //  ' if (SysChar turned off, default the company code
            if (!this.pageParams.blnSCEnableCompanyCode) {
                objCompanyCode = this.pageParams.strDefaultCompanyCode;
            }
        } else {
            //  'Since the CompanyCode is required once we have a CompanyInvoiceNumber, all these field should have the same required state
            this.dropdown.OriginalCompanyCode.isRequired = this.pageParams.blnOriginalInvoiceNumberMandatory;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'CompanyCodeDesc', this.pageParams.blnOriginalInvoiceNumberMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, objCompanyInvoiceNumber.id, this.pageParams.blnOriginalInvoiceNumberMandatory);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, objInvoiceNumber.id, this.pageParams.blnOriginalInvoiceNumberMandatory);

            this.pageParams.OriginalCompanyCode.id = '';
            this.setControlValue(objCompanyInvoiceNumber.id, '');
            this.setControlValue(objInvoiceNumber.id, '');

        }

    }

    public DisplayInvoiceCreditDesc(): void {
        if (this.getControlValue('InvoiceCreditCode') === 'I') {
            this.setControlValue('InvoiceCreditDesc', this.pageParams.strInvoiceDesc);
            this.pageParams.trPrintCredit = false;
        } else if (this.getControlValue('InvoiceCreditCode') === 'C') {
            this.setControlValue('InvoiceCreditDesc', this.pageParams.strCreditDesc);
            this.pageParams.trPrintCredit = true;
        }

    }


    public GetAccount(): void {  //'Get the 'AccountNumber' & 'AccountName' fields for the contract, from the database
        let lookupIPpublic = [
            {
                'table': 'Contract,Account',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.getParentHTMLValue('ContractNumber')
                },
                'fields': ['AccountNumber', 'AccountName', 'OutFields']
            }
        ];
        this.LookUp.lookUpPromise(lookupIPpublic).then((data) => {
            if (data && data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                this.setControlValue('objInvoiceNumber', '');
            } else {
                let returnedFields;
                returnedFields = data.OutFields ? data.OutFields.split('|') : ''; // chr(<%= ASC({&RI_SEPARATOR_VALUE_SUB_LIST}) %>)

                // ' Check if the array is legal and has data inside
                // if (IsArray(returnedFields) AND UBound(returnedFields) >= 0 AND NOT IsNull(returnedFields) {
                if ((Array.isArray(returnedFields) && (returnedFields.length >= 1) && returnedFields)) {
                    this.pageParams.tempAccountNumber = returnedFields[0];
                    this.pageParams.tempAccountName = returnedFields[1];
                }
            }
        },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    public GetCompany(): void {  //'Get the 'AccountNumber' & 'AccountName' fields for the contract, from the database
        let lookupIPpublic = [
            {
                'table': 'Company',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'CompanyCode': this.getControlValue('OriginalCompanyCode')
                },
                'fields': ['CompanyCode', 'CompanyDesc']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupIPpublic).then((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data && data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                let result = data[0][0];
                if (result) {
                    // Fix for IUI-15786
                    this.setControlValue('OriginalCompanyCode', result.CompanyCode);
                    this.setControlValue('OriginalCompanyDesc', result.CompanyDesc);
                    // Fix for IUI-17997
                    this.dropdown.OriginalCompanyCode.active = {
                        id: result.CompanyCode,
                        text: result.CompanyCode + ' - ' + result.CompanyDesc
                    };
                }
            }
        }, (error) => {
            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        }
        );
    }

    public OriginalCompanyFieldChange(): void {
        this.pageParams.OriginalCompanyCode = {
            id: 'OriginalCompanyCode',
            value: this.getControlValue('OriginalCompanyCode')
        };
        this.pageParams.OriginalCompanyInvoiceNumber = {
            id: 'OriginalCompanyInvoiceNumber',
            value: this.getControlValue('OriginalCompanyInvoiceNumber')
        };
        this.pageParams.OriginalInvoiceNumber = {
            id: 'OriginalInvoiceNumber',
            value: this.getControlValue('OriginalInvoiceNumber')
        };

        this.SetInvoiceFieldsRequired(this.pageParams.OriginalCompanyCode, this.pageParams.OriginalCompanyInvoiceNumber, this.pageParams.OriginalInvoiceNumber);
        // ' Don't call if we've already called GetOriginalInvoiceValues (got the invoice details for the LAST invoice within the period)
        if (!(this.pageParams.blnOriginalInvoiceNumberRequired && this.getControlValue('InvoiceCreditCode') === 'C')) {
            this.GetOriginalInvoiceNumber(this.pageParams.OriginalCompanyCode, this.pageParams.OriginalCompanyInvoiceNumber, this.pageParams.OriginalInvoiceNumber);
        }

        this.RetrieveDiscountCode();

        if (this.pageParams.logAllowNoniCABSInvoiceNumbers &&
            this.getControlValue('OriginalCompanyInvoiceNumber') &&
            this.getControlValue('OriginalCompanyCode')) {
            this.CheckValidInvoiceNumber();
        }

        this.GetTaxInvoiceNumber();

    }

    public GetOriginalCompanyDesc(): void {
        if (this.getControlValue('OriginalCompanyCode')) {
            // With riExchange.Request
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSExchangeFunctions.p';
            this.riMaintenance.PostDataAdd('PostDesc', 'CompanyCode', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('CompanyCode', this.getControlValue('OriginalCompanyCode'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('CompanyCode', MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('CompanyDesc', MntConst.eTypeText);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.riMaintenance.Execute(this, function (data: any): any {
                if (data && data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    if (data.CompanyCode) {
                        // fix for IUI-15786
                        this.dropdown.OriginalCompanyCode.active = {
                            id: data.CompanyCode,
                            text: data.CompanyCode + ' - ' + data.CompanyDesc
                        };
                        this.setControlValue('OriginalCompanyCode', data.CompanyCode);
                        this.setControlValue('OriginalCompanyDesc', data.CompanyDesc);
                    } else {
                        this.setControlValue('OriginalCompanyCode', '');
                        this.setControlValue('OriginalCompanyDesc', '');
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }, 'GET', 0);
        } else {
            this.setControlValue('OriginalCompanyDesc', '');
        }
    }

    public CheckValidInvoiceNumber(): void {
        // With riExchange.Request
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSProRataChargeEntry.p';
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('Function', 'CheckValidInvoiceNumber', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.businessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('OriginalInvoiceNumber', this.getControlValue('OriginalInvoiceNumber'), MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('OriginalCompanyInvoiceNumber', this.getControlValue('OriginalCompanyInvoiceNumber'), MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('OriginalCompanyCode', this.getControlValue('OriginalCompanyCode'), MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('ErrorMessage', MntConst.eTypeTextFree);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.ErrorMessage) {
                this.modalAdvService.emitMessage(new ICabsModalVO(data.ErrorMessage));
                this.setControlValue('ErrorMessage', '');
            }
        }, 'POST', 0);
    }

    public GetTaxInvoiceNumber(): void {
        if (this.pageParams.blnSCTaxInvoiceNumber
            && this.getControlValue('OriginalInvoiceNumber')
            && this.getControlValue('OriginalCompanyInvoiceNumber')
            && this.getControlValue('OriginalCompanyCode')
            && this.getControlValue('InvoiceCreditReasonCode')) {
            // With riExchange.Request
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSProRataChargeEntry.p';
            this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('Function', 'GetTaxInvoiceNumber', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.businessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('OriginalInvoiceNumber', this.getControlValue('OriginalInvoiceNumber'), MntConst.eTypeTextFree);
            this.riMaintenance.PostDataAdd('OriginalCompanyInvoiceNumber', this.getControlValue('OriginalCompanyInvoiceNumber'), MntConst.eTypeTextFree);
            this.riMaintenance.PostDataAdd('OriginalCompanyCode', this.getControlValue('OriginalCompanyCode'), MntConst.eTypeTextFree);
            this.riMaintenance.PostDataAdd('InvoiceCreditReasonCode', this.getControlValue('InvoiceCreditReasonCode'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('TaxInvoiceNumber', MntConst.eTypeTextFree);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.riMaintenance.Execute(this, function (data: any): any {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data && data.hasError) {
                    this.setControlValue('TaxInvoiceNumber', '');
                } else {
                    this.setControlValue('TaxInvoiceNumber', data.TaxInvoiceNumber);
                }
            }, 'POST', 6);
        }
    }


    public GetOriginalInvoiceNumber(objCompanyCode: any, objCompanyInvoiceNumber: any, objInvoiceNumber: any): void {

        let prepareString;
        let returnedFields;

        if (objCompanyCode.value
            && objCompanyInvoiceNumber.value
            && !this.riExchange.riInputElement.isError(this.uiForm, objCompanyCode.id)
            && !this.riExchange.riInputElement.isError(this.uiForm, objCompanyInvoiceNumber.id)) {

            let lookupIPpublic = [
                {
                    'table': 'InvoiceHeader',
                    'query': {
                        'BusinessCode': this.businessCode(),
                        'CompanyCode': objCompanyCode.value.toString(),
                        'CompanyInvoiceNumber': objCompanyInvoiceNumber.value.toString()
                    },
                    'fields': ['InvoiceNumber']
                }
            ];
            this.LookUp.lookUpPromise(lookupIPpublic).then((data) => {
                if (data && data.length > 0) {
                    if (data && data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        let invoiceHeaderData = data[0];
                        let returnedFields = [];
                        if (invoiceHeaderData) {
                            invoiceHeaderData.forEach(item => {
                                returnedFields.push({
                                    InvoiceNumber: item.InvoiceNumber,
                                    ttInvoiceHeader: item.ttInvoiceHeader
                                });
                            });
                            // Check whether it is an array and has data inside (if it is a valid orig inv number)
                            if ((Array.isArray(returnedFields) && (returnedFields.length === 1) && returnedFields)) {
                                this.setControlValue('objInvoiceNumber', returnedFields[0]);
                            } else {
                                this.setControlValue('objInvoiceNumber', '');
                            }
                            // If multiple arrays exist then get user to select invoice
                            if (Array.isArray(returnedFields) && (returnedFields.length > 1)) {
                                this.riExchange.Mode = 'ProRataCharge';
                                this.setAttribute('CompanyInvoiceNumber', this.getControlValue('OriginalCompanyInvoiceNumber'));
                                this.setAttribute('CompanyCode', this.getControlValue('OriginalCompanyCode'));
                                this.ellipsis.invoiceSearchComponent.inputParams.OriginalCompanyInvoiceNumber = this.getControlValue('OriginalCompanyInvoiceNumber');
                                this.ellipsis.invoiceSearchComponent.inputParams.companyCode = this.getControlValue('OriginalCompanyCode');
                                this.invoiceSearchEllipsis.openModal();
                            }
                        }
                    }
                }
            }).catch((error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
        } else {
            this.setControlValue('objInvoiceNumber', '');
        }
    }

    public RetrieveDiscountCode(): void {
        this.setControlValue('DiscountCode', '');

        let prepareString;
        let returnedFields = [];
        if (this.getControlValue('OriginalCompanyCode')
            && this.getControlValue('OriginalCompanyInvoiceNumber')) {
            let lookupIPpublic = [
                {
                    'table': 'InvoiceHeader',
                    'query': {
                        'BusinessCode': this.businessCode(),
                        'CompanyCode': this.getControlValue('OriginalCompanyCode'),
                        'CompanyInvoiceNumber': this.getControlValue('OriginalCompanyInvoiceNumber')
                    },
                    'fields': ['DiscountCode', 'OutFields']
                }
            ];
            this.LookUp.lookUpPromise(lookupIPpublic).then((data) => {
                if (data && data.length > 0) {
                    if (data && data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        data[0].forEach(item => {
                            returnedFields.push({
                                DiscountCode: item.DiscountCode || '',
                                ttInvoiceHeader: item.ttInvoiceHeader || ''
                            });
                        });
                        if ((Array.isArray(returnedFields) && (returnedFields.length === 1) && returnedFields[0])) {
                            this.setControlValue('DiscountCode', returnedFields[0].DiscountCode);
                        } else {
                            this.setControlValue('DiscountCode', '');
                        }

                        // 'if (multiple arrays exist then get the first discount code
                        if (Array.isArray(returnedFields) && (returnedFields.length > 1)) {
                            this.setControlValue('DiscountCode', returnedFields[0].DiscountCode);
                        }
                    }
                }
            }).catch((error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
        } else {
            this.setControlValue('DiscountCode', '');
        }
    }

    public invoiceSearchComponentDataReceived(data: any): void {
        if (data) {
            this.setControlValue('OriginalInvoiceNumber', data);
        }
    }

    //On Focus on last element
    public focusSave(obj: any): void {
        // this.ri.focusNextTab(obj);
        if (obj.relatedTarget || obj.keyCode === 9) {
            let currtab = this.getCurrentActiveTab();
            let focustab = this.getNextActiveTab(currtab);
            if (currtab !== focustab) {
                this.TabFocus(focustab);
                this.focusFirstField();
            } else {
                document.querySelector('#submit')['focus']();
            }
        }
    }

    public getCurrentActiveTab(): any {
        let i = 0;
        for (let tab in this.uiDisplay.tab) {
            if (tab !== '') {
                i++;
                if (this.uiDisplay.tab[tab].active) {
                    this.currentTab = i;
                    return i;
                }
            }
        }
    }

    public getNextActiveTab(tabindex: number): any {
        let i = 0;
        for (let tab in this.uiDisplay.tab) {
            if (tab !== '') {
                i++;
                if (this.uiDisplay.tab[tab].visible && i > tabindex && i <= this.tabLength) return i;
            }
        }
        return tabindex;
    }

    public TabFocus(tabIndex: number): void {
        this.currentTab = tabIndex;
        //Bug - unable to explicitly remove 'active' class as those are binded. hence below lines added
        let elem = document.querySelector('.nav-tabs').children;
        for (let i = 0; i < elem.length; i++) {
            if (this.utils.hasClass(elem[i], 'error')) {
                this.utils.removeClass(elem[i], 'active');
                this.utils.removeClass(document.querySelector('.tab-content').children[i], 'active');
            }
        }

        let i = 0;
        for (let tab in this.uiDisplay.tab) {
            if (tab !== '') {
                i++;
                this.uiDisplay.tab[tab].active = (i === tabIndex) ? true : false;
            }
        }

        //Failsafe
        this.utils.addClass(elem[tabIndex - 1], 'active');
        this.utils.addClass(document.querySelector('.tab-content').children[tabIndex - 1], 'active');

        setTimeout(this.utils.makeTabsRed(), 200);
    }

    public focusFirstField(): any {
        let elem = document.querySelector('.tab-content').children[this.currentTab - 1];
        if (elem.querySelector('input'))
            elem.querySelector('input')['focus']();
        else if (elem.querySelector('textarea'))
            elem.querySelector('textarea')['focus']();
    }

    // -------------- riMaintenance Execution start ------ //
    public showAlert(msgTxt: string, type?: number): void {
        //let translation = this.getTranslatedValue(msgTxt, null); //TODO - Translation needs to be included in the base component
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = MessageConstant.Message.ErrorTitle; break;
            case 1: titleModal = MessageConstant.Message.MessageTitle; break;
            case 2: titleModal = MessageConstant.Message.MessageTitle; break;
        }
        this.isModalOpen(true);
        this.modalAdvService.emitMessage(new ICabsModalVO(msgTxt));
    }
    public showSpinner(): void { this.ajaxSource.next(this.ajaxconstant.START); }
    public hideSpinner(): void { this.ajaxSource.next(this.ajaxconstant.COMPLETE); }

    public actionAfterSave: number = 0;
    public currentActivity = '';
    public save(): void {
        if (this.checkErrorStatus()) {
            this.currentActivity = 'SAVE';
            this.riMaintenance.CancelEvent = false;
            this.riMaintenance.clearQ();
            switch (this.riMaintenance.CurrentMode) {
                case 'eModeAdd':
                case 'eModeSaveAdd':
                    this.actionAfterSave = 1;
                    this.riMaintenance.execMode(MntConst.eModeSaveAdd, [this]);
                    break;
                case 'eModeUpdate':
                case 'eModeSaveUpdate':
                    this.actionAfterSave = 2;
                    this.riMaintenance.execMode(MntConst.eModeSaveUpdate, [this]);
                    break;
            }
        }
    }
    public confirm(): any {
        this.promptModal.show();
        // this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.confirmed, this.promptCancel));
    }
    public confirmed(obj: any): any {
        this.riMaintenance.CancelEvent = false;
        this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this]);
    }
    public promptCancel(obj: any): any {
        this.riMaintenance.CancelEvent = true;
        this.isModalOpen(false);
        this.riMaintenance.handleConfirm(this);
    }
    public closeModal(): void {
        this.isModalOpen(false);
        this.riMaintenance.handleConfirm(this);
    }
    public isModalOpen(flag: boolean): void {
        this.riMaintenance.isModalOpen = flag;
    }
    public cancel(): void {
        this.riExchange.resetCtrl(this.controls);
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.BuildTabs();
        this.markAsPrestine();
        // this.riTab.TabsToNormal();
    }
    public checkErrorStatus(): boolean {
        this.riExchange.validateForm(this.uiForm);
        this.dropdown.invoiceCreditReasonCode.isTriggerValidate = true;
        if (this.uiForm.status === 'VALID') {
            this.utils.makeTabsNormal();
            return true;
        } else {
            this.utils.highlightTabs();
            return false;
        }
    }

    // End

    public clearRowId(): void {
        this.pageParams.resetRowId = true;
    }
    public markAsPrestine(): void {
        for (let i = 0; i < this.controls.length; i++) {
            this.uiForm.controls[this.controls[i].name].markAsPristine();
            this.uiForm.controls[this.controls[i].name].markAsUntouched();
        }
    }
    /*
    *  Alerts user when user is moving away without saving the changes. //CR implementation
    */
    public routeAwayUpdateSaveFlag(): void {
        this.uiForm.statusChanges.subscribe((value: any) => {
            if (this.uiForm.dirty === true) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }


    public fieldValidateTransform(event: any): void {
        let retObj = this.utils.fieldValidateTransform(event);
        this.setControlValue(retObj.id, retObj.value);
        if (!retObj.status) {
            this.riExchange.riInputElement.markAsError(this.uiForm, retObj.id);
        }
    }

}
