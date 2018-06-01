import { ComponentTypeLanguageSearchComponent } from './../../internal/search/iCABSBComponentTypeLanguageSearch.component';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';

import { Logger } from '@nsalaun/ng2-logger';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { HttpService } from '../../../shared/services/http-service';

import { Utils } from '../../../shared/services/utility';
import { RiExchange } from './../../../shared/services/riExchange';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { InternalGridSearchApplicationModuleRoutes } from './../../base/PageRoutes';
import { LocaleTranslationService } from '../../../shared/services/translation.service';

import { AccountHistoryDetailComponent } from '../../internal/search/iCABSAAccountHistoryDetail';
import { InvoiceChargeSearchComponent } from '../../internal/search/iCABSAInvoiceChargeSearch.component';
import { LostBusinessDetailSearchComponent } from '../../internal/search/iCABSBLostBusinessDetailSearch.component';
import { ProductCoverSearchComponent } from '../../internal/search/iCABSBProductCoverSearch.component';
import { LostBusinessLanguageSearchComponent } from '../../internal/search/iCABSBLostBusinessLanguageSearch.component';
import { PestNetOnLineLevelSearchComponent } from '../../internal/search/iCABSBPestNetOnLineLevelSearch.component';
import { ContactTypeDetailSearchComponent, ContactTypeDetailSearchDropDownComponent } from '../../internal/search/iCABSSContactTypeDetailSearch.component';
import { LostBusinessRequestOriginLanguageSearchComponent } from './../../internal/search/iCABSSLostBusinessRequestOriginLanguageSearch.component';
import { SystemInvoiceCreditReasonSearchComponent } from './../../internal/search/iCABSSSystemInvoiceCreditReasonSearch.component';
import { SystemInvoiceFormatLanguageSearchComponent } from './../../internal/search/iCABSSSystemInvoiceFormatLanguageSearch.component';
import { SICSearchComponent } from './../../internal/search/iCABSSSICSearch.component';
import { ContractTypeLanguageSearchComponent } from './../../internal/search/iCABSBContractTypeLanguageSearch.component';
import { ProductServiceGroupSearchComponent } from './../../internal/search/iCABSBProductServiceGroupSearch.component';
import { CommonDropdownComponent } from '../../../shared/components/common-dropdown/common-dropdown.component';
import { ExpenseCodeSearchDropDownComponent } from '../../internal/search/iCABSBExpenseCodeSearch.component';
import { ProductAttributeValuesSearchComponent } from '../../internal/search/iCABSBProductAttributeValuesSearch.component';
import { InvoiceChargeTypeLanguageSearchComponent } from './../../internal/search/iCABSBInvoiceChargeTypeLanguageSearch.component';
import { ProductSalesGroupSearchComponent } from './../../internal/search/iCABSBProductSalesGroupSearch.component';
import { ListGroupSearchComponent } from '../../internal/grid-search/iCABSBListGroupSearch.component';
import { ServiceTypeSearchComponent } from '../../internal/search/iCABSBServiceTypeSearch.component';
import { InfestationLevelSearchComponent } from '../../internal/search/iCABSBInfestationLevelSearch.component';

@Component({
    selector: 'icabs-test',
    templateUrl: 'test.html'
})

export class TestComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('lostbusinesslanguagesearchDropDown') lostbusinesslanguagesearchDropDown: LostBusinessLanguageSearchComponent;
    @ViewChild('ddLostBusinessRequestOriginLanguageSearch') ddLostBusinessRequestOriginLanguageSearch: LostBusinessRequestOriginLanguageSearchComponent;
    @ViewChild('ddContactTypeDetailSearch') ddContactTypeDetailSearch: ContactTypeDetailSearchDropDownComponent;
    @ViewChild('ddSystemInvoiceCreditReasonSearch') ddSystemInvoiceCreditReasonSearch: SystemInvoiceCreditReasonSearchComponent;
    @ViewChild('systemInvoiceFormatLanguageSearch') systemInvoiceFormatLanguageSearch: SystemInvoiceFormatLanguageSearchComponent;
    @ViewChild('SICSearch') SICSearch: SICSearchComponent;
    @ViewChild('ddProductServiceGroupSearch') ddProductServiceGroupSearch: ProductServiceGroupSearchComponent;
    @ViewChild('commonDropDown') commonDropDown: CommonDropdownComponent;
    @ViewChild('ddSbInvoiceChargeTypeLanguageSearch') ddSbInvoiceChargeTypeLanguageSearch: InvoiceChargeTypeLanguageSearchComponent;
    @ViewChild('contractTypeLanguageSearchDropdown') contractTypeLanguageSearchDropdown: ContractTypeLanguageSearchComponent;
    @ViewChild('expenseCodeSearch') expenseCodeSearch: ExpenseCodeSearchDropDownComponent;
    @ViewChild('cddCompTypeLangSearch') cddCompTypeLangSearch: ComponentTypeLanguageSearchComponent;
    @ViewChild('serviceTypeSearchDropDown') serviceTypeSearchDropDown: ServiceTypeSearchComponent;
    @ViewChild('ddCreditReasonLangSearch') ddCreditReasonLangSearch: CommonDropdownComponent;
    @ViewChild('marketSegmentSearchDropDown') marketSegmentSearchDropDown: CommonDropdownComponent;
    @ViewChild('suspendReasonSearch') suspendReasonSearch: CommonDropdownComponent;
    @ViewChild('preferredDaySearchDropDown') preferredDaySearchDropDown: CommonDropdownComponent;

    //Account History AccountHistoryDetailComponent
    public accountObject: Object = {
        businessCode: 'D',
        countryCode: 'UK',
        AccountNumber: '000246160',
        AccountHistoryNumber: '79',
        InvoiceGroupNumber: '6',
        RowID: '0x0000000000405558',
        action: 0
    };

    public inputParamsContractInvoiceSearch: any = { 'parentMode': 'Contract-Search', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
    public inputParamsLostBusinessDetailSearch: any = { 'parentMode': 'LookUp-Active', 'lostBusinessCode': '' };
    public inputParamsExpenseCodeSearch: any = { 'parentMode': 'LookUp' };
    public ReadOnlyComponent = AccountHistoryDetailComponent;
    public InvChargeSearchComponent = InvoiceChargeSearchComponent;
    public LostBusinessDetailCodeSearchComponent = LostBusinessDetailSearchComponent;
    public listGroupSearchComponent: any = ListGroupSearchComponent;
    public autoOpen: boolean = false;
    public showHeader: boolean = true;
    public modalTitle: string = '';
    public uiForm: FormGroup;

    public ellipsis = {
        contactTypeDetailCode: {
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp',
                ContactTypeCode: ''
            },
            component: ContactTypeDetailSearchComponent
        },
        listGroupSearch: {
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp',
                LGListTypeCodeVal: 3,
                LGListGroupCodeFld: 1,
                LGListDetailsFld: 1,
                LGListGroupDescFld: 1
            },
            component: this.listGroupSearchComponent
        },
        pnollevelsearch: {
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'PNOLiCABSLevelLookUp'
            },
            component: PestNetOnLineLevelSearchComponent
        },
        productCoverSearch: {
            isDisabled: false,
            isRequired: false,
            isShowCloseButton: true,
            isShowHeader: true,
            childConfigParams: {
                parentMode: 'LookUp',
                productCode: '',
                productDesc: '',
                includeProductDetail: '',
                excludeProductDetail: '',
                productDetailCodeString: ''
            },
            contentComponent: ProductCoverSearchComponent
        },
        InvoiceCreditReasonCode: {
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            component: SystemInvoiceCreditReasonSearchComponent
        },
        InvoiceFormatLanguageSearch: {
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp'
                // languageCode: 'ZNG'
            },
            component: SystemInvoiceFormatLanguageSearchComponent
        },
        SICSearch: {
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-SICLang'
            },
            component: SICSearchComponent
        },
        productAttributeValueSearch: {
            isDisabled: false,
            isRequired: false,
            isShowCloseButton: true,
            isShowHeader: true,
            childConfigParams: {
                parentMode: 'Attribute1',
                AttributeCode: '',
                AttributeLabel: ''
            },
            contentComponent: ProductAttributeValuesSearchComponent
        },
        productSalesGroupSearch: {
            isDisabled: false,
            isRequired: false,
            isShowCloseButton: true,
            isShowHeader: true,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            contentComponent: ProductSalesGroupSearchComponent
        },
        infestationLevelSearch: {
            isDisabled: false,
            isRequired: false,
            isShowCloseButton: true,
            isShowHeader: true,
            childConfigParams: {
                parentMode: 'LookUp',
                InfestationGroupCode: '',
                InfestationGroupDesc: ''
            },
            contentComponent: InfestationLevelSearchComponent
        }
    };

    public dropdown = {
        lostBusinessRequestOriginLanguageSearch: {
            params: {
                LanguageCode: ''
            },
            active: { id: '', text: '' },
            isDisabled: false,
            isRequired: false
        },
        ddSbInvoiceChargeTypeSearch: {
            isRequired: false,
            isDisabled: false,
            active: { id: '', text: '' },
            params: {
                parentMode: 'LookUp',
                LanguageCode: this.riExchange.LanguageCode(),
                ContractLevelInd: ''
            }
        },
        contactTypeDetailSearch: {
            params: {
                ContactTypeCode: ''
            },
            active: { id: '', text: '' },
            isDisabled: false,
            isRequired: false
        },
        languageSearch: {
            isRequired: false,
            isDisabled: false,
            inputParams: {
                'parentMode': 'Search',
                'languageCode': this.riExchange.LanguageCode()
            },
            active: {
                id: '',
                text: ''
            }
        },
        compTypeLangSearch: {
            inputParams: {},
            itemsToDisplay: ['ComponentTypeDescLang.ComponentTypeCode', 'ComponentTypeDescLang.ComponentTypeDescLang'],
            isDisabled: false,
            isRequired: false,
            active: {
                id: '2',
                text: 'PesT Test Prod'
            }
        },
        contractTypeLanguageSearch: {
            isRequired: false,
            isDisabled: false,
            inputParams: {
                'parentMode': 'Search',
                'languageCode': ''
            },
            active: {
                id: '',
                text: ''
            }
        },
        ProductServiceGroupSearch: {
            params: {
                parentMode: 'LookUp',
                ProductServiceGroupString: '',
                SearchValue3: '',
                ProductServiceGroupCode: ''
            },
            active: { id: '', text: '' },
            isDisabled: false,
            isRequired: false
        },
        expenseCodeSearch: {
            isDisabled: false,
            isRequired: false,
            inputParams: {
                'parentMode': 'LookUp'
            }
        },
        noGuarenteeSearch: {
            isRequired: false,
            isDisabled: false,
            params: {
                method: 'contract-management/search',
                module: 'property',
                operation: 'Business/iCABSBPropertyNoGuaranteeSearch'
            },
            displayFields: ['NoGuaranteeCode', 'NoGuaranteeDescription']
        },
        contractTypeSearch: {
            isRequired: false,
            isDisabled: false,
            params: {
                method: 'contract-management/search',
                module: 'contract',
                operation: 'Business/iCABSBContractTypeSearch'
            },
            displayFields: ['ContractTypeCode', 'ContractTypeDesc']
        },
        manualVisitReasonSearch: {
            isRequired: false,
            isDisabled: false,
            params: {
                method: 'service-delivery/search',
                module: 'manual-service',
                operation: 'Business/iCABSBManualVisitReasonSearch'
            },
            displayFields: ['ManualVisitReasonCode', 'ManualVisitReasonDesc']
        },
        serviceTypeSearch: {
            isRequired: false,
            isDisabled: false,
            params: {
                parentMode: 'LookUp'
            }
        },
        creditInvoiceLanguageSearch: {
            isRequired: false,
            isDisabled: false,
            params: {
                method: 'bill-to-cash/search',
                module: 'invoicing',
                operation: 'System/iCABSSInvoiceCreditReasonLanguageSearch'
            },
            displayFields: ['InvoiceCreditReasonLang.InvoiceCreditReasonCode', 'InvoiceCreditReasonLang.InvoiceCreditReasonDesc']
        },
        InfestationGroupSearch: {
            isRequired: false,
            isDisabled: false,
            params: {
                operation: 'Business/iCABSBInfestationGroupSearch',
                module: 'service',
                method: 'service-delivery/search'
            },
            displayFields: ['InfestationGroupCode', 'InfestationGroupDesc']
        }
    };

    public displayiCABSSSystemBankAccountTypeSearchColumns: Array<string> = ['BankAccountTypeCode', 'BankAccountTypeDesc'];
    public inputParamsiCABSSSystemBankAccountTypeSearchDropdown: any = {
        method: 'bill-to-cash/search',
        module: 'payment',
        operation: 'System/iCABSSSystemBankAccountTypeSearch'
    };

    public oniCABSSSystemBankAccountTypeSearchDropdownDataRecieved(event: any): void {
        this.logger.log('oniCABSSSystemBankAccountTypeSearchDropdownDataRecieved==>', event);
    }

    public onFirstreceivedBankAccountType(event: any): void {
        this.logger.log('onFirstreceivedBankAccountType==>', event);
    }

    //iCABSSSystemInvoiceIssueTypeLanguageSearch.htm dropdown implementation details
    public displaySystemInvoiceIssueTypeLanguageSearchColumns: Array<string> = ['SystemInvoiceIssueTypeLang.InvoiceIssueTypeCode', 'SystemInvoiceIssueTypeLang.SystemInvoiceIssueTypeDesc'];

    public inputParamsSystemInvoiceIssueTypeLanguageSearchDropdown: any = {
        method: 'bill-to-cash/search',
        module: 'invoicing',
        operation: 'System/iCABSSSystemInvoiceIssueTypeLanguageSearch'
    };

    public onSystemInvoiceIssueTypeLanguageSearchRecieved(event: any): void {
        this.logger.log('onSystemInvoiceIssueTypeLanguageSearchRecieved==>', event);
    }

    //iCABSBRMMCategorySearch.htm dropdown implementation details
    public displayRMMCategorySearchColumns: Array<string> = ['RMMCategoryCode', 'RMMCategoryDesc'];

    public inputParamsRMMCategorySearchDropdown: any = {
        method: 'service-planning/search',
        module: 'service',
        operation: 'Business/iCABSBRMMCategorySearch'
    };

    public onRMMCategorySearchRecieved(event: any): void {
        this.logger.log('onRMMCategorySearchRecieved==>', event);
    }

    //iCABSSMarketSegmentSearch.htm dropdown implementation details
    public marketSegmentSearchColumns: Array<string> = ['MarketSegment.MarketSegmentCode', 'MarketSegment.MarketSegmentDesc'];
    public inputParamsMarketSegmentSearchDropdown: any = {
        operation: 'System/iCABSSMarketSegmentSearch',
        module: 'segmentation',
        method: 'ccm/search'
    };
    public oniICABSSMarketSegmentSearchDropdownDataRecieved(event: any): void {
        this.logger.log('oniICABSSMarketSegmentSearchDropdownDataRecieved==>', event);
    }

    //iCABSBPreferredDayOfWeekReasonSearch.htm dropdown implementation details
    public preferredDaySearchColumns: Array<string> = ['PreferredDayOfWeekReason.PreferredDayOfWeekReasonCode', 'PreferredDayOfWeekReason.PreferredDayOfWeekReasonDesc'];
    public inputParamsPreferredDaySearchDropDown: any = {
        operation: 'Business/iCABSBPreferredDayOfWeekReasonSearch',
        module: 'template',
        method: 'service-planning/search'
    };
    public oniICABSBPreferredDayOfWeekReasonSearchDropdownDataRecieved(event: any): void {
        this.logger.log('oniICABSBPreferredDayOfWeekReasonSearchDropdownDataRecieved==>', event);
    }

    /**
     * iCABSBSuspendReasonSearch dropdown implementation details
     */
    public suspendReasonSearchColumns: Array<string> = ['SuspendReasonCode', 'SuspendReasonDesc'];
    public inputParamsSuspendReasonSearchDropdown: any = {
        operation: 'Business/iCABSBSuspendReasonSearch',
        module: 'suspension',
        method: 'contract-management/search'
    };
    public oniCABSBSuspendReasonSearchDataRecieved(event: any): void {
        this.logger.log('oniCABSBSuspendReasonSearchDataRecieved==>', event);
    }

    constructor(
        private _router: Router,
        private _httpService: HttpService,
        private utils: Utils,
        private fb: FormBuilder,
        private riExchange: RiExchange,
        private logger: Logger,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService) {
    }

    ngOnInit(): void {
        this.uiForm = this.fb.group({});
        this.initForm();

        // iCABSBComponentTypeLanguageSearch - set search value
        this.dropdown.compTypeLangSearch.inputParams['ProductCode'] = '';
    }

    ngAfterViewInit(): void {
        //this._componentInteractionService.emitMessage(false);
    }

    ngOnDestroy(): void {
        // prevent memory leak when component is destroyed
        //this.subscription.dispose();
        //this._authService.unsubscribe();
    }

    private initForm(): void {
        let controls: any = [
            { name: 'ContactTypeCode' },
            { name: 'ContactTypeSystemDesc', disabled: true },
            { name: 'ContactTypeDetailCode' },
            { name: 'ContactTypeDetailSystemDesc', disabled: true },
            { name: 'PNOLLevelCode' },
            { name: 'PNOLLevelDesc', disabled: true },
            { name: 'ProductDetailCode' },
            { name: 'ProductDetailDesc', disabled: true },
            { name: 'InvoiceCreditReasonCode' },
            { name: 'InvoiceCreditReasonDesc' },
            { name: 'ExpenseCode' },
            { name: 'ExpenseDesc' },
            { name: 'ProductAttributeValue' },
            { name: 'ProductDetailDesc', disabled: true },
            { name: 'ListGroupSearchCode', disabled: true },
            { name: 'ListGroupSearchDesc', disabled: true },
            { name: 'LostBusinessDetailCode' },
            { name: 'LostBusinessDetailDesc' },
            { name: 'SystemInvoiceFormatCode' },
            { name: 'SystemInvoiceFormatDesc' },
            { name: 'SICCode' },
            { name: 'SICDescription' },
            { name: 'ProductSaleGroupCode' },
            { name: 'ProductSaleGroupDesc', disabled: true },
            { name: 'InfestationLevelCode'},
            { name: 'InfestationLevelDesc', disabled: true}
        ];

        this.riExchange.renderForm(this.uiForm, controls);
    }

    public onProductSalesGroupSearch(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductSaleGroupCode', data.ProductSaleGroupCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductSaleGroupDesc', data.ProductSaleGroupDesc);
        }
    }

    public onInvoiceChargeTypeCode(data: any): void {
        //this.invoiceType = data.CurrentContractTypeURLParameter;
        //this._router.navigate(['Application/iCABSAInvoiceChargeMaintenance'], { queryParams: { CurrentContractTypeURLParameter: this.invoiceType } });
    }
    public onLostBusinessDetail(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailCode', data.LostBusinessDetailCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessDetailDesc', data.LostBusinessDetailDesc);
    }
    /* ProductAttributeValuesSearchComponent - Start*/
    public onProductAttributeValueSearch(data: any): void {
        console.log('Data : ', data);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductAttributeValue', data.SelAttributeValue1);

    }
    /* ProductAttributeValuesSearchComponent - end*/

    public onProductCoverDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailCode', data.ProductDetailCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailDesc', data.ProductDetailDesc);
    }

    public onInvoiceCreditReasonCodeDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceCreditReasonCode', data.InvoiceCreditReasonCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceCreditReasonDesc', data.InvoiceCreditReasonDesc);
    }

    public onInvoiceFormatLanguageSearch(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SystemInvoiceFormatCode', data.SystemInvoiceFormatCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SystemInvoiceFormatDesc', data.SystemInvoiceFormatDesc);
    }

    public onSICSearchRecieved(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SICCode', data.SICCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SICDescription', data.SICDescription);
        if (this.ellipsis.SICSearch.childConfigParams.parentMode === 'LookUp-SICLang')
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SICDescription', data.OriSICDescription);
    }

    public onLostBusinessLanguageSearch(data: any): void {
        /*
        TO-DO : Will return data to iCABSBLostBusinessLanguageMaintenance.htm
        Will be implemented once the parentPage is developed
        */
    }

    public onContactTypeLanguageSearchReceived(data: any): void {
        /*
        TO-DO : Will return data to iCABSBLostBusinessLanguageMaintenance.htm
        Will be implemented once the parentPage is developed
        */
    }

    /* iCABSSContactTypeDetailSearch - Start */
    public onCallinglookUp(): void {
        this.ellipsis.contactTypeDetailCode.childConfigParams.ContactTypeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactTypeCode');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeSystemDesc', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeDetailCode', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeDetailSystemDesc', '');

        this.dropdown.contactTypeDetailSearch.params.ContactTypeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactTypeCode');
        this.ddContactTypeDetailSearch.fetchData();
    }
    public onContactTypeDetailCodeDataReceived(data: any): void {
        if (data) {
            this.ellipsis.contactTypeDetailCode.childConfigParams.ContactTypeCode = ''; //Delete this line later
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeCode', data.ContactTypeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeSystemDesc', data.ContactTypeSystemDesc);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeDetailCode', data.ContactTypeDetailCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeDetailSystemDesc', data.ContactTypeDetailSystemDesc);
        }
    }
    public onContactTypeDetailCodeDropdownDataReceived(data: any): void {
        if (data) {
            this.ellipsis.contactTypeDetailCode.childConfigParams.ContactTypeCode = data['ContactTypeDetail.ContactTypeCode'];
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeCode', data['ContactTypeDetail.ContactTypeCode']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeSystemDesc', data['ContactType.ContactTypeSystemDesc']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeDetailCode', data['ContactTypeDetail.ContactTypeDetailCode']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeDetailSystemDesc', data['ContactTypeDetail.ContactTypeDetailSystemDesc']);
        }
    }
    /* iCABSSContactTypeDetailSearch - End */

    /* iCABSSLostBusinessRequestOriginLanguageSearch - Start */
    public onLostBusinessRequestOriginLanguageSearchReceived(data: any): void {
        console.log('Data', data);
    }
    /* iCABSSLostBusinessRequestOriginLanguageSearch - End */

    /* iCABSBComponentTypeLanguageSearch - Start */
    public onSelectCompTypeLangSearchDD(data: any): void {
        console.log('onSelectCompTypeLangSearchDD=', data);
    }
    /* iCABSBComponentTypeLanguageSearch - Start */

    /* iCABSBProductServiceGroupSearch - Start */
    public onProductServiceGroupSearch(data: any): void {
        console.log('Data', data);
    }
    /* iCABSBProductServiceGroupSearch - End */

    /* iCABSBPestNetOnLineLevelSearch - Start */
    public onPNOLLevelDataReceived(data: any): void {
        console.log('Data', data);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLLevelCode', data.PNOLiCABSLevel);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PNOLLevelDesc', data.PNOLDescription);
    }
    /* iCABSBPestNetOnLineLevelSearch - End */

    public onExpenseCodeSearchReceived(data: any): void {
        console.log('Data', data);
    }

    public onListGroupSearchDataReceived(data: any): void {
        console.log('Data--->', data);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ListGroupSearchCode', data.vbLGListGroupCodeFld);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ListGroupSearchDesc', data.vbLGListGroupDescFld);
    }

    public onNoGuarenteeSearch(data: any): void {
        this.logger.log('data =>', data);
    }
    public onContractTypeSearch(data: any): void {
        this.logger.log('data =>', data);
    }
    /* iCABSBInvoiceChargeTypeLanguageSearch - Start */
    public invoiceChargeLanguageSearch(data: any): void {
        console.log('Data', data);
    }
    /* iCABSBInvoiceChargeTypeLanguageSearch - End */

    public onManualVisitReceived(data: any): void {
        this.logger.log('data =>', data);
    }

    public onServiceTypeDataReceived(data: any): void {
        console.log('Service Type Data:', data);
    }

    public onCreditReasonLangSearchDataRecieved(event: any): void {
        this.logger.log('iCABSSInvoiceCreditReasonLanguageSearch DataRecieved==>', event);
    }
    public onInfestationSearch(data: any): void {
        this.logger.log('data =>', data);
    }

    /* iCABSBInfestationLevelSearch ellipsis implementation details - Start */
    public onInfestationLevelDataReceived(data: any): void {
        this.logger.log('InfestationLevel =>', data);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InfestationLevelCode', data.InfestationLevelCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InfestationLevelDesc', data.InfestationLevelDesc);
    }
    /* iCABSBInfestationLevelSearch ellipsis implementation details - End */

    /**
     * iCABSBChargeRateSearch dropdown implementation details
     */
    public chargeRateSearchColumns: Array<string> = ['ChargeRateCode', 'ChargeRateDesc'];
    public inputParamsChargeRateSearchDropdown: any = {
        module: 'rates',
        method: 'bill-to-cash/search',
        operation: 'Business/iCABSBChargeRateSearch'
    };
    public onChargeRateSearchDataRecieved(event: any): void {
        this.logger.log('data =>', event);
    }

    //iCABSBDetectorSearch dropdown implementation details
    public detectorSearchColumns: Array<string> = ['Detector.DetectorID', 'Detector.Description'];
    public inputParamsDetectorSearchDropdown: any = {
        operation: 'Business/iCABSBDetectorSearch',
        module: 'pnol',
        method: 'extranets-connect/search'
    };
    public onDetectorSearchDataRecieved(event: any): void {
        this.logger.log('data =>', event);
    }
}
