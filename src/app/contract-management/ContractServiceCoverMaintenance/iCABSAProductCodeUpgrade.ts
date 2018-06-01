import { InternalGridSearchApplicationModuleRoutes } from './../../base/PageRoutes';
import { ProductSearchGridComponent } from './../../internal/search/iCABSBProductSearch';
import { Subscription } from 'rxjs/Rx';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { BusinessOriginDetailLanguageSearchComponent } from './../../internal/search/iCABSBBusinessOriginDetailLanguageSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Observable } from 'rxjs';
import { URLSearchParams } from '@angular/http';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { RiMaintenance, MntConst } from './../../../shared/services/riMaintenancehelper';
import { RouteAwayGlobals } from './../../../shared/services/route-away-global.service';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, OnDestroy, Injector, ViewChild, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { LostBusinessLanguageSearchComponent } from './../../internal/search/iCABSBLostBusinessLanguageSearch.component';
import { LostBusinessDetailSearchComponent } from './../../internal/search/iCABSBLostBusinessDetailSearch.component';

@Component({
    templateUrl: 'iCABSAProductCodeUpgrade.html'
})

export class ProductCodeUpgradeComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('serviceCoverSearch') public serviceCoverSearch: EllipsisComponent;
    @ViewChild('NewProductCode') public newProductCode;
    @ViewChild('lostbusinesslanguagesearchDropDown') public lostbusinesslanguagesearchDropDown: LostBusinessLanguageSearchComponent;
    @ViewChild('LostBusinessDetailCode') public lostBusinessDetailCode;

    /**
     * Page Variables
     */
    private effectiveDateWarningsShown: boolean = false;
    public showGridSeasonal: boolean;
    public showBusinessOriginDetailCode: boolean = false;
    public businessOriginDetailCodeRequired: boolean = false;
    public showLeadEmployee: boolean = false;
    public leadEmployeeRequired: boolean = false;
    public recordFound: boolean = false;
    private loadPreviousData: boolean = false;
    private formChangeSubscribe: Subscription;

    private title: any;

    private tabLength: number = 2;
    private currentTab: number = 0;

    public ellipsisConfig = {
        contract: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'currentContractType': 'C',
                'showAddNew': false
            },
            component: ContractSearchComponent
        },
        premise: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'ContractNumber': '',
                'ContractName': '',
                'showAddNew': false
            },
            component: PremiseSearchComponent
        },
        product: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'ContractNumber': '',
                'PremiseNumber': '',
                'ContractName': '',
                'PremiseName': '',
                'ProductCode': '',
                'ProductDesc': ''
            },
            component: ServiceCoverSearchComponent
        },
        newProduct: {
            disabled: true,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-SalesGroup',
                'ProductSaleGroupCode': ''
            },
            component: ProductSearchGridComponent
        },
        businessOriginDetail: {
            disabled: true,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'BusinessOriginCode': '',
                'BusinessOriginSystemDesc': '',
                'showAddNew': false
            },
            component: BusinessOriginDetailLanguageSearchComponent
        },
        leadEmployee: {
            disabled: true,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-LeadEmployee',
                'showAddNew': false
            },
            component: EmployeeSearchComponent
        },
        lostBusinessDetail: {
            disabled: true,
            showHeader: true,
            showCloseButton: true,
            parentMode: 'LookUp-LostBusinessDetail',
            lostBusinessCode: '',
            childConfigParams: {
                'showAddNew': false
            },
            component: LostBusinessDetailSearchComponent
        },
        serviceSalesEmployee: {
            disabled: true,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-ServiceCoverCommissionEmployee',
                'showAddNew': false
            },
            component: EmployeeSearchComponent
        }
    };

    public dropdownConfig = {
        businessOrigin: {
            isDisabled: true,
            isRequired: true,
            inputParams: {
            },
            triggerValidate: true,
            active: {
                id: '',
                text: ''
            }
        },
        lostBusiness: {
            isRequired: true,
            isDisabled: true,
            inputParams: {
                'parentMode': 'LookUp',
                'languageCode': this.riExchange.LanguageCode()
            },
            active: {
                id: '',
                text: ''
            }
        }
    };

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    private headerParams: any = {
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        operation: 'Application/iCABSAProductCodeUpgrade'
    };

    private queryParams: URLSearchParams = new URLSearchParams();
    public promptTitle: string;
    public promptContent: string;
    public pageMode: string = 'N';
    private fieldData: Object = {};
    public uiDisplay: any = {
        tab: {
            tab1: { visible: true, active: true },
            tab2: { visible: true, active: false }
        }
    };
    public serviceCoverSearchComponent = ServiceCoverSearchComponent;
    /**
     * Base Component Variables
     */
    public pageId: string = '';
    public controls = [
        //Primary Section
        { name: 'ContractNumber', required: true },
        { name: 'ContractName', disabled: true },
        { name: 'PremiseNumber', required: true },
        { name: 'PremiseName', disabled: true },
        { name: 'ProductCode', required: true },
        { name: 'ProductDesc', disabled: true },
        { name: 'PortfolioStatusDesc', disabled: true },

        //Tab 1
        /*Section A*/
        { name: 'InvoiceAnnivDate', disabled: true },
        { name: 'InvoiceFrequencyCode', disabled: true },
        { name: 'InvoiceFrequencyDesc', disabled: true },
        { name: 'ServiceVisitFrequency', disabled: true },
        { name: 'ServiceVisitAnnivDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'ServiceQuantity', disabled: true },
        { name: 'ServiceVisitFrequency', disabled: true },
        { name: 'ServiceCommenceDate', disabled: true, type: MntConst.eTypeDate },
        /*Section B*/
        { name: 'NewProductCode', disabled: true, required: true },
        { name: 'NewProductDesc', disabled: true },
        { name: 'EffectiveDate', disabled: true, required: true, type: MntConst.eTypeDate },
        { name: 'ServiceAnnualValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'PriceChangeValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'NewAnnualValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'BusinessOriginCode', disabled: true, required: true },
        { name: 'BusinessOriginDesc', disabled: true },
        { name: 'BusinessOriginDetailCode', disabled: true },
        { name: 'BusinessOriginDetailDesc', disabled: true },
        { name: 'LeadEmployee', disabled: true },
        { name: 'LeadEmployeeSurname', disabled: true },
        { name: 'LostBusinessDetailCode', disabled: true, required: true },
        { name: 'LostBusinessDetailDesc', disabled: true },
        { name: 'ServiceSalesEmployee', disabled: true, required: true },
        { name: 'ServiceSalesEmployeeName', disabled: true },

        //Tab 2
        { name: 'ServiceSpecialInstructions', disabled: true },

        //Hidden
        { name: 'ServiceCoverNumber' },
        { name: 'ProductSaleGroupCode' },
        { name: 'ErrorMessageDesc' },
        { name: 'LanguageCode', disabled: true },
        { name: 'Seasonal', disabled: true },
        { name: 'NewServiceCoverNumber' },
        { name: 'NewServiceCoverRowID' },
        { name: 'ServiceCoverWasteReq' },
        { name: 'ServiceCoverWasteCopied' },
        { name: 'DetailRequiredInd', disabled: true },
        { name: 'LeadInd', disabled: true }
    ];

    constructor(injector: Injector, public routeAwayGlobals: RouteAwayGlobals, public rendrer: Renderer) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPRODUCTCODEUPGRADE;
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.title) {
            this.title.unsubscribe();
        }
    }

    public ngAfterViewInit(): void {
        if (this.formData['ContractNumber'] && this.formData['PremiseNumber'] && this.formData['ProductCode']) {
            this.populateUIFromFormData();
            this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.formData['ContractNumber'];
            this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.formData['ContractName'];
            this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.formData['ContractNumber'];
            this.ellipsisConfig.product.childConfigParams['ContractName'] = this.formData['ContractName'];
            this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.formData['PremiseNumber'];
            this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.formData['PremiseName'];
            this.recordFound = true;

            this.pageMode = 'U';
            this.loadPreviousData = true;
            this.updateFieldStatus();
        } else {
            this.ellipsisConfig.contract.autoOpen = true;
        }

        this.title = this.getTranslatedValue('Product Upgrade Maintenance').subscribe(res => {
            this.utils.setTitle(res);
        });
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
        this.pageParams.contractType = this.utils.getCurrentContractType('<contract>');
    }

    /**
     * Fires when users blur from ContractNumber field
     */
    public onContractChange(): void {
        if ((this.pageParams.cNumber !== this.getControlValue('ContractNumber')) && this.getControlValue('ContractNumber') !== '') {
            this.pageParams.cName = '';
            this.pageParams.cNumber = '';
            if (this.getControlValue('ContractNumber') !== '') {
                this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'ContractNumber');
                let paddedValue = this.utils.numberPadding(this.getControlValue('ContractNumber'), 8);
                this.setControlValue('ContractNumber', paddedValue);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = paddedValue;
                this.ellipsisConfig.product.childConfigParams['ContractNumber'] = paddedValue;
                this.pageParams.cNumber = paddedValue;
            } else {
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = '';
                this.ellipsisConfig.product.childConfigParams['ContractNumber'] = '';
                this.setControlValue('ContractNumber', '');
            }
            this.ellipsisConfig.premise.childConfigParams['ContractName'] = '';
            this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = '';
            this.ellipsisConfig.product.childConfigParams['PremiseName'] = '';
            this.ellipsisConfig.product.childConfigParams['ContractName'] = '';

            this.setControlValue('ContractName', '');
            this.resetFields('contract');
        }
    }


    public onLostBusinessLanguageSearch(data: any): void {
        if (data) {
            this.dropdownConfig.lostBusiness.active = {
                id: data['LostBusinessLang.LostBusinessCode'] || '',
                text: data['LostBusinessLang.LostBusinessDesc'] || ''
            };

            this.ellipsisConfig.lostBusinessDetail.lostBusinessCode = data['LostBusinessLang.LostBusinessCode'];
        }
    }

    public premiseOnChange(): void {

        if ((this.pageParams.pNumber !== this.getControlValue('PremiseNumber')) && this.getControlValue('PremiseNumber') !== '') {
            this.pageParams.pName = '';
            this.pageParams.pNumber = '';
            if (this.getControlValue('PremiseNumber') !== '') {
                this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'PremiseNumber');
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.getControlValue('PremiseNumber');
                this.pageParams.pNumber = this.getControlValue('PremiseNumber');
            } else {
                this.setControlValue('PremiseNumber', '');
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = '';
            }
            this.ellipsisConfig.product.childConfigParams['PremiseName'] = '';
            this.resetFields('premise');
        }
    }

    /**
     * Fires when Product Code changes
     */
    public productCodeOnChange(): void {
        this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'ProductCode');
        this.recordFound = false;
        this.pageMode = 'N';
        let productCode = this.getControlValue('ProductCode');
        if (productCode) {
            this.queryParams.set('businessCode', this.utils.getBusinessCode());
            this.queryParams.set('countryCode', this.utils.getCountryCode());
            this.queryParams.set('action', '6');

            let bodyParams: Object = {
                'Function': 'GetServiceCoverRowID',
                'ContractNumber': this.getControlValue('ContractNumber'),
                'PremiseNumber': this.getControlValue('PremiseNumber'),
                'ProductCode': this.getControlValue('ProductCode')
            };

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                        return;
                    }
                    if (data.ServiceCoverNumber === '-1') {
                        this.ellipsisConfig.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                        this.ellipsisConfig.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
                        this.ellipsisConfig.product.childConfigParams['ProductCode'] = this.getControlValue('ProductCode');
                        this.productCodeSearch();
                    } else {
                        this.attributes.ServiceCoverRowID = data.ServiceCoverRowID;
                        this.setControlValue('ServiceCoverNumber', data.ServiceCoverNumber);
                        this.populateFields();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.logger.log('Error =>', error);
                    this.errorModal.show(error.info, true);
                    return;
                });
        }
    }

    /**
     * Populates the fields of the form
     */
    private populateFields(): void {
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.cbbService.disableComponent(true);
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '0');

        let bodyParams: Object = {
            'Function': 'CheckFields',
            'ContractNumber': this.getControlValue('ContractNumber'),
            'PremiseNumber': this.getControlValue('PremiseNumber'),
            'ProductCode': this.getControlValue('ProductCode'),
            'ServiceCoverRowID': this.attributes.ServiceCoverRowID
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                this.recordFound = true;
                this.setControlValue('BusinessOriginCode', data.BusinessOriginCode);
                this.setControlValue('BusinessOriginDesc', data.BusinessOriginDesc);
                this.setControlValue('NewAnnualValue', data.NewAnnualValue);
                this.setControlValue('PortfolioStatusDesc', data.PortfolioStatusDesc);
                this.setControlValue('PriceChangeValue', data.PriceChangeValue);
                this.setControlValue('Seasonal', data.Seasonal);
                this.setControlValue('ServiceAnnualValue', data.ServiceAnnualValue);
                this.setControlValue('ServiceCommenceDate', data.ServiceCommenceDate);
                this.setControlValue('ServiceQuantity', data.ServiceQuantity);
                this.setControlValue('ServiceSalesEmployee', data.ServiceSalesEmployee);
                this.setControlValue('ServiceSpecialInstructions', data.ServiceSpecialInstructions);
                this.setControlValue('ServiceVisitAnnivDate', data.ServiceVisitAnnivDate);
                this.setControlValue('ServiceVisitFrequency', data.ServiceVisitFrequency);

                this.dropdownConfig.businessOrigin.active = {
                    id: data.BusinessOriginCode,
                    text: data.BusinessOriginCode + ' - ' + data.BusinessOriginDesc
                };

                this.ellipsisConfig.businessOriginDetail.childConfigParams.BusinessOriginCode = data.BusinessOriginCode;
                this.ellipsisConfig.businessOriginDetail.childConfigParams.BusinessOriginSystemDesc = data.BusinessOriginDesc;
                this.ellipsisConfig.businessOriginDetail.childConfigParams['LanguageCode'] = this.riExchange.LanguageCode();
                this.fetchProductDetails();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error => ', error);
            });
    }

    /**
     * Executes lookup call for fields
     */
    private fetchProductDetails(): void {
        let lookUp = [{
            'table': 'Contract',
            'query': {
                'BusinessCode': this.businessCode(),
                'ContractNumber': this.getControlValue('ContractNumber')
            },
            'fields': ['ContractName', 'InvoiceAnnivDate', 'InvoiceFrequencyCode']
        }, {
            'table': 'Premise',
            'query': {
                'BusinessCode': this.businessCode(),
                'ContractNumber': this.getControlValue('ContractNumber'),
                'PremiseNumber': this.getControlValue('PremiseNumber')
            },
            'fields': ['PremiseName']
        }, {
            'table': 'Product',
            'query': {
                'BusinessCode': this.businessCode(),
                'ProductCode': this.getControlValue('ProductCode')
            },
            'fields': ['ProductDesc', 'ProductSaleGroupCode']
        }, {
            'table': 'Employee',
            'query': {
                'BusinessCode': this.businessCode(),
                'EmployeeCode': this.getControlValue('ServiceSalesEmployee')
            },
            'fields': ['EmployeeSurname']
        }, {
            'table': 'LostBusinessLang',
            'query': {
                'BusinessCode': this.businessCode(),
                'LanguageCode': this.riExchange.LanguageCode(),
                'LostBusinessCode': this.dropdownConfig.lostBusiness.active.id
            },
            'fields': ['LostBusinessDesc']
        }, {
            'table': 'LostBusinessDetailLang',
            'query': {
                'BusinessCode': this.businessCode(),
                'LanguageCode': this.riExchange.LanguageCode(),
                'LostBusinessCode': this.dropdownConfig.lostBusiness.active.id,
                'LostBusinessDetailCode': this.getControlValue('LostBusinessDetailCode')
            },
            'fields': ['LostBusinessDetailDesc']
        }];

        if (this.pageMode === 'U') {
            lookUp[2] = {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('NewProductCode')
                },
                'fields': ['ProductDesc']
            };
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(lookUp).subscribe((data) => {
            let contractDetails = data[0][0];
            let premiseDetails = data[1][0];
            let productDetails = data[2][0];
            let employeeDetails = data[3][0];
            let lostBusinessLangDetails = data[4][0];
            let lostBusinessDetailLangDetails = data[5][0];
            let canUpdate: boolean;

            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (contractDetails) {
                this.setControlValue('ContractName', contractDetails.ContractName);
                this.setControlValue('InvoiceAnnivDate', this.utils.formatDate(contractDetails.InvoiceAnnivDate));
                this.setControlValue('InvoiceFrequencyCode', contractDetails.InvoiceFrequencyCode);
                this.virtualJoin();
            }
            if (premiseDetails) {
                this.setControlValue('PremiseName', premiseDetails.PremiseName);
            }

            if (productDetails) {
                if (this.pageMode === 'U') {
                    this.setControlValue('NewProductDesc', productDetails.ProductDesc);
                } else {
                    this.setControlValue('ProductDesc', productDetails.ProductDesc);
                    this.setControlValue('ProductSaleGroupCode', productDetails.ProductSaleGroupCode);
                    this.ellipsisConfig.newProduct.childConfigParams.ProductSaleGroupCode = productDetails.ProductSaleGroupCode;
                }
            }
            if (employeeDetails) {
                this.setControlValue('ServiceSalesEmployeeName', employeeDetails.EmployeeSurname);
            }
            if (lostBusinessLangDetails && this.dropdownConfig.lostBusiness.active.id) {
                this.dropdownConfig.lostBusiness.active.text = lostBusinessLangDetails.LostBusinessDesc;
            }
            if (lostBusinessDetailLangDetails && this.getControlValue('LostBusinessDetailCode')) {
                this.setControlValue('LostBusinessDetailDesc', lostBusinessDetailLangDetails.LostBusinessDetailDesc);
            }
            if (this.pageMode !== 'U') {
                this.riMaintenance_AfterFetch();
            } else {
                this.rendrer.setElementClass(this.newProductCode.nativeElement, 'ng-invalid', false);
                /* TODO: Keep this for future reference, as the this.lostBusinessCode.nativeElement doesn't exists in HTML anymore, so unable to test the condition for now.
                 this.rendrer.setElementClass(this.lostBusinessCode.nativeElement, 'ng-invalid', false); */
                this.dropdownConfig.lostBusiness.isRequired = true;
                this.rendrer.setElementClass(this.lostBusinessDetailCode.nativeElement, 'ng-invalid', false);

                if (!productDetails) {
                    this.rendrer.setElementClass(this.newProductCode.nativeElement, 'ng-invalid', true);
                }
                if (!lostBusinessLangDetails) {
                    /* TODO: Keep this for future reference, as the this.lostBusinessCode.nativeElement doesn't exists in HTML anymore, so unable to test the condition for now.
                    this.rendrer.setElementClass(this.lostBusinessCode.nativeElement, 'ng-invalid', true); */
                    this.dropdownConfig.lostBusiness.isRequired = true;
                }
                if (!lostBusinessDetailLangDetails) {
                    this.rendrer.setElementClass(this.lostBusinessDetailCode.nativeElement, 'ng-invalid', true);
                }

                if (productDetails && lostBusinessLangDetails && lostBusinessDetailLangDetails) {
                    this.promptTitle = MessageConstant.Message.ConfirmRecord;
                    this.promptModal.show();
                    this.utils.makeTabsNormal();
                } else {
                    this.utils.highlightTabs();
                }
            }
        });
    }

    /**
     * Called when lookup call finishes in Normal mode
     */
    private riMaintenance_AfterFetch(): void {
        this.setControlValue('LanguageCode', this.utils.getDefaultLang());

        let seasonal = this.getControlValue('Seasonal');
        if (seasonal === 'SEASONAL') {
            this.showGridSeasonal = true;
        } else {
            this.showGridSeasonal = false;
        }
        this.businessOriginCode_ondeactivate();
    }

    /**
     * Calls after fetch
     */
    private businessOriginCode_ondeactivate(): void {
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');

        let bodyParams: Object = {
            'BusinessOriginCode': this.dropdownConfig.businessOrigin.active.id,
            'Function': 'CheckFields'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }

                this.setControlValue('DetailRequiredInd', data.DetailRequiredInd);
                this.setControlValue('LeadInd', data.LeadInd);

                if (data.DetailRequiredInd === 'yes') {
                    this.showBusinessOriginDetailCode = true;
                    this.businessOriginDetailCodeRequired = true;
                } else {
                    this.showBusinessOriginDetailCode = false;
                    this.businessOriginDetailCodeRequired = false;
                }
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BusinessOriginDetailCode', this.businessOriginDetailCodeRequired);


                if (data.LeadInd === 'yes') {
                    this.showLeadEmployee = true;
                    this.leadEmployeeRequired = true;
                } else {
                    this.showLeadEmployee = false;
                    this.leadEmployeeRequired = false;
                }
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LeadEmployee', this.leadEmployeeRequired);

                this.setControlValue('BusinessOriginDetailCode', '');
                this.setControlValue('BusinessOriginDetailDesc', '');
                this.setControlValue('LeadEmployee', '');
                this.setControlValue('LeadEmployeeSurname', '');
                this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'BusinessOriginDetailCode');
                this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'LeadEmployee');
                this.uiForm.controls['BusinessOriginDetailCode'].markAsUntouched();
                this.uiForm.controls['LeadEmployee'].markAsUntouched();

                this.riMaintenance_BeforeUpdate();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error => ', error);
            });
    }

    /**
     * Update Input Values after Ellipses search
     */
    public riMaintenance_Search(data: any, type: string): void {
        switch (type) {
            case 'contract':
                this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'ContractNumber');
                this.setControlValue('ContractNumber', data.ContractNumber);
                this.setControlValue('ContractName', data.ContractName);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = data.ContractNumber;
                this.ellipsisConfig.premise.childConfigParams['ContractName'] = '';
                this.ellipsisConfig.product.childConfigParams['ContractNumber'] = data.ContractNumber;
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = '';
                this.ellipsisConfig.product.childConfigParams['PremiseName'] = '';
                this.ellipsisConfig.product.childConfigParams['ContractName'] = '';
                this.pageParams.cNumber = data.ContractNumber;
                this.pageParams.cName = data.ContractName;
                this.resetFields(type);
                break;
            case 'premise':
                this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'PremiseNumber');
                this.setControlValue('PremiseNumber', data.PremiseNumber);
                this.setControlValue('PremiseName', data.PremiseName);
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = data.PremiseNumber;
                this.ellipsisConfig.product.childConfigParams['PremiseName'] = data.PremiseName;
                this.pageParams.pNumber = data.PremiseNumber;
                this.pageParams.pName = data.PremiseName;
                this.resetFields(type);
                break;
            case 'product':
                this.pageMode = 'N';
                this.riExchange.riInputElement.MarkAsPristine(this.uiForm, 'ProductCode');
                this.setControlValue('ProductCode', data.row.ProductCode);
                this.setControlValue('ProductDesc', data.row.ProductDesc);
                this.attributes.ServiceCoverRowID = data.row.ttServiceCover;
                this.setControlValue('ServiceCoverNumber', data.row.ServiceCoverNumber);
                this.pageParams.pCode = data.ProductCode;
                this.pageParams.pDesc = data.ProductDesc;
                this.pageParams.ServiceCoverNumber = data.row.ServiceCoverNumber;
                this.resetFields(type);
                this.populateFields();
                break;
            case 'newProduct':
                this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'NewProductCode');
                this.setControlValue('NewProductCode', data.ProductCode);
                this.setControlValue('NewProductDesc', data.ProductDesc);
                break;
            case 'businessOrigin':
                this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'BusinessOriginCode');
                this.setControlValue('BusinessOriginCode', data.BusinessCode);
                this.setControlValue('BusinessOriginDesc', data.BusinessDesc);
                break;
            case 'businessOriginDetail':
                this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'BusinessOriginDetailCode');
                this.setControlValue('BusinessOriginDetailCode', data.BusinessOriginDetailCode);
                this.setControlValue('BusinessOriginDetailDesc', data.BusinessOriginDetailDesc);
                break;
            case 'leadEmployee':
                this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'LeadEmployee');
                this.setControlValue('LeadEmployee', data.LeadEmployee);
                this.setControlValue('LeadEmployeeSurname', data.LeadEmployeeSurname);
                break;
            case 'lostBusinessDetail':
                this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'LostBusinessDetailCode');
                this.setControlValue('LostBusinessDetailCode', data.LostBusinessDetailCode);
                break;
            case 'serviceSalesEmployee':
                this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'ServiceSalesEmployee');
                this.setControlValue('ServiceSalesEmployee', data.ServiceSalesEmployee);
                this.setControlValue('ServiceSalesEmployeeName', data.EmployeeSurname);
                break;
        }
    }

    /**
     * Checks Field Error and if no error, prompts for Record save
     */
    public confirmSave(): void {
        for (let control in this.uiForm.controls) {
            if (control) {
                this.riExchange.riInputElement.isError(this.uiForm, control);
            }
        }
        this.utils.highlightTabs();
        if (this.uiForm.invalid) return;

        this.fetchProductDetails();
    }

    /**
     * Show Error Messages if they have not already been shown
     */
    private riMaintenance_BeforeSaveUpdate(): void {
        if (!this.effectiveDateWarningsShown) {
            this.showErrorMessages();
        }
    }

    /**
     * Fires when Update button is clicked and page moves to update Mode
     */
    public riMaintenance_BeforeUpdate(): void {
        if (!this.recordFound) {
            let recordFoundError: Object = {
                'errorMessage': 'No record Selected'
            };

            this.errorModal.show(recordFoundError, true);
            return;
        }

        this.pageMode = 'U';
        //Get default effective date and warnings that coincide with effective date.
        //N.B. Order of functions in list is important: "WarnEffectiveDate" must come after "DefaultEffectiveDate"
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');

        let bodyParams: Object = {
            'Function': 'DefaultEffectiveDate,WarnValueChange,ValueAtEffectiveDate',
            'ContractNumber': this.getControlValue('ContractNumber'),
            'PremiseNumber': this.getControlValue('PremiseNumber'),
            'ProductCode': this.getControlValue('ProductCode'),
            'ServiceCoverNumber': this.getControlValue('ServiceCoverNumber')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.ServiceAnnualValue) this.setControlValue('ServiceAnnualValue', data.ServiceAnnualValue);
                if (data.NewAnnualValue) this.setControlValue('NewAnnualValue', data.NewAnnualValue);
                this.setControlValue('ServiceQuantity', data.ServiceQuantity);
                this.setControlValue('ServiceVisitFrequency', data.ServiceVisitFrequency);
                this.setControlValue('ErrorMessageDesc', data.ErrorMessageDesc);
                this.setControlValue('EffectiveDate', data.EffectiveDate);
                this.updateFieldStatus();

                // Show any error messages
                this.showErrorMessages();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error => ', error);
            });
    }

    /**
     * Updates the content
     */
    private riMaintenance_Update(): void {
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '2');

        let bodyParams: Object = {
            'ServiceCoverWasteReq': this.getControlValue('ServiceCoverWasteReq') ? 'yes' : 'no',
            'ServiceCoverWasteCopied': this.getControlValue('ServiceCoverWasteCopied') ? 'yes' : 'no',
            'NewServiceCoverNumber': this.getControlValue('NewServiceCoverNumber'),
            'NewServiceCoverRowID': this.getControlValue('NewServiceCoverRowID'),
            'BusinessOriginDesc': this.getControlValue('BusinessOriginDesc'),
            'BusinessOriginDetailDesc': this.getControlValue('BusinessOriginDetailDesc'),
            'LeadEmployeeSurname': this.getControlValue('LeadEmployeeSurname'),
            'DetailRequiredInd': this.getControlValue('DetailRequiredInd'),
            'LeadInd': this.getControlValue('LeadInd'),
            'ServiceCoverROWID': this.attributes.ServiceCoverRowID,
            'ContractNumber': this.getControlValue('ContractNumber'),
            'PremiseNumber': this.getControlValue('PremiseNumber'),
            'ProductCode': this.getControlValue('ProductCode'),
            'ServiceCoverNumber': this.getControlValue('ServiceCoverNumber'),
            'ServiceVisitFrequency': this.getControlValue('ServiceVisitFrequency'),
            'ServiceQuantity': this.getControlValue('ServiceQuantity'),
            'ServiceCommenceDate': this.getControlValue('ServiceCommenceDate'),
            'ServiceVisitAnnivDate': this.getControlValue('ServiceVisitAnnivDate'),
            'PortfolioStatusDesc': this.getControlValue('PortfolioStatusDesc'),
            'NewProductCode': this.getControlValue('NewProductCode'),
            'EffectiveDate': this.getControlValue('EffectiveDate'),
            'ServiceAnnualValue': this.getControlValue('ServiceAnnualValue'),
            'PriceChangeValue': this.getControlValue('PriceChangeValue'),
            'NewAnnualValue': this.getControlValue('NewAnnualValue'),
            'LostBusinessCode': this.dropdownConfig.lostBusiness.active.id,
            'LostBusinessDetailCode': this.getControlValue('LostBusinessDetailCode'),
            'ServiceSpecialInstructions': this.getControlValue('ServiceSpecialInstructions'),
            'ServiceSalesEmployee': this.getControlValue('ServiceSalesEmployee'),
            'BusinessOriginCode': this.dropdownConfig.businessOrigin.active.id,
            'BusinessOriginDetailCode': this.getControlValue('BusinessOriginDetailCode'),
            'LeadEmployee': this.getControlValue('LeadEmployee')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage || data.fullError) {
                    this.errorModal.show(data, true);
                    return;
                }
                data.msg = MessageConstant.Message.SavedSuccessfully;
                data.title = MessageConstant.Message.MessageTitle;
                this.errorModal.showHeader = true;
                this.errorModal.show(data, false);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error => ', error);
            });
    }

    /**
     * After Update success
     */
    private riMaintenance_AfterSave(): void {
        let serviceCoverWasteReq = this.getControlValue('ServiceCoverWasteReq');
        let serviceCoverWasteCopied = this.getControlValue('ServiceCoverWasteCopied');

        if (serviceCoverWasteReq === 'yes' || serviceCoverWasteCopied === 'yes') {
            this.navigate('ProductUpgrade', InternalGridSearchApplicationModuleRoutes.ICABSASERVICECOVERWASTEGRID);
        }
    }

    /**
     * Abandon Update mode
     */
    public riMaintenance_CancelSave(): void {
        this.pageMode = 'N';
        this.updateFieldStatus();
        this.pageMode = 'U';
    }

    /**
     * Stores Data of Normal
     * Mode and Disables the field
     */
    private storeFields(): void {
        this.fieldData['EffectiveDate'] = this.getControlValue('EffectiveDate');
        this.fieldData['NewProductCode'] = this.getControlValue('NewProductCode');
        this.fieldData['NewProductDesc'] = this.getControlValue('NewProductDesc');
        this.fieldData['PriceChangeValue'] = this.getControlValue('PriceChangeValue');
        this.fieldData['NewAnnualValue'] = this.getControlValue('NewAnnualValue');
        this.fieldData['BusinessOriginCode'] = this.dropdownConfig.businessOrigin.active.id;
        this.fieldData['BusinessOriginDesc'] = this.getControlValue('BusinessOriginDesc');
        this.fieldData['LostBusinessCode'] = this.dropdownConfig.lostBusiness.active.id;
        this.fieldData['LostBusinessDesc'] = this.getControlValue('LostBusinessDesc');
        this.fieldData['LostBusinessDetailCode'] = this.getControlValue('LostBusinessDetailCode');
        this.fieldData['LostBusinessDetailDesc'] = this.getControlValue('LostBusinessDetailDesc');
        this.fieldData['BusinessOriginDetailCode'] = this.getControlValue('BusinessOriginDetailCode');
        this.fieldData['BusinessOriginDetailDesc'] = this.getControlValue('BusinessOriginDetailDesc');
        this.fieldData['LeadEmployee'] = this.getControlValue('LeadEmployee');
        this.fieldData['LeadEmployeeSurname'] = this.getControlValue('LeadEmployeeSurname');
        this.fieldData['ServiceSalesEmployee'] = this.getControlValue('ServiceSalesEmployee');
        this.fieldData['ServiceSalesEmployeeName'] = this.getControlValue('ServiceSalesEmployeeName');
        this.fieldData['ServiceSpecialInstructions'] = this.getControlValue('ServiceSpecialInstructions');
    }

    /**
     * Re-Stores Data of Normal
     * Mode and Disables the field
     */
    private restoreFields(): void {
        this.setControlValue('EffectiveDate', this.fieldData['EffectiveDate']);
        this.setControlValue('NewProductCode', this.fieldData['NewProductCode']);
        this.setControlValue('NewProductDesc', this.fieldData['NewProductDesc']);
        this.setControlValue('PriceChangeValue', this.fieldData['PriceChangeValue']);
        this.setControlValue('NewAnnualValue', this.fieldData['NewAnnualValue']);
        this.dropdownConfig.businessOrigin.active = {
            id: this.fieldData['BusinessOriginCode'],
            text: this.fieldData['BusinessOriginCode'] + ' - ' + this.fieldData['BusinessOriginDesc']
        };
        this.setControlValue('BusinessOriginCode', this.fieldData['BusinessOriginCode']);
        this.setControlValue('BusinessOriginDesc', this.fieldData['BusinessOriginDesc']);
        this.dropdownConfig.lostBusiness.active.id = this.fieldData['LostBusinessCode'];
        this.dropdownConfig.lostBusiness.active.text = this.fieldData['LostBusinessDesc'];
        this.setControlValue('LostBusinessDetailCode', this.fieldData['LostBusinessDetailCode']);
        this.setControlValue('LostBusinessDetailDesc', this.fieldData['LostBusinessDetailDesc']);
        this.setControlValue('BusinessOriginDetailCode', this.fieldData['BusinessOriginDetailCode']);
        this.setControlValue('BusinessOriginDetailDesc', this.fieldData['BusinessOriginDetailDesc']);
        this.setControlValue('LeadEmployee', this.fieldData['LeadEmployee']);
        this.setControlValue('LeadEmployeeSurname', this.fieldData['LeadEmployeeSurname']);
        this.setControlValue('ServiceSalesEmployee', this.fieldData['ServiceSalesEmployee']);
        this.setControlValue('ServiceSalesEmployeeName', this.fieldData['ServiceSalesEmployeeName']);
        this.setControlValue('ServiceSpecialInstructions', this.fieldData['ServiceSpecialInstructions']);
    }


    /**
     * On product Search
     */
    private productCodeSearch(): void {
        this.serviceCoverSearch.openModal();
    }

    /**
     * Virtual Join
     */
    private virtualJoin(): void {
        let lookUp = [{
            'table': 'SystemInvoiceFrequency',
            'query': {
                'BusinessCode': this.businessCode(),
                'InvoiceFrequencyCode': this.getControlValue('InvoiceFrequencyCode')
            },
            'fields': ['InvoiceFrequencyDesc']
        }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(lookUp).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            let invoiceFrequencyDetails = data[0][0];
            this.setControlValue('InvoiceFrequencyDesc', invoiceFrequencyDetails.InvoiceFrequencyDesc);
        });
    }

    /**
     * Enable/ Disable Fields
     */
    private updateFieldStatus(): void {
        if (this.recordFound) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'NewProductCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'PriceChangeValue');
            this.riExchange.riInputElement.Enable(this.uiForm, 'LostBusinessDetailCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'BusinessOriginDetailCode');
            this.riExchange.riInputElement.Enable(this.uiForm, 'LeadEmployee');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceSalesEmployee');
            this.riExchange.riInputElement.Enable(this.uiForm, 'ServiceSpecialInstructions');
            this.riExchange.riInputElement.Enable(this.uiForm, 'EffectiveDate');
            this.ellipsisConfig.leadEmployee.disabled = false;
            this.ellipsisConfig.newProduct.disabled = false;
            this.dropdownConfig.businessOrigin.isDisabled = false;
            this.ellipsisConfig.serviceSalesEmployee.disabled = false;
            this.ellipsisConfig.businessOriginDetail.disabled = false;
            this.dropdownConfig.lostBusiness.isDisabled = false;
            this.ellipsisConfig.lostBusinessDetail.disabled = false;
        }
        if (this.pageMode === 'U') {
            this.storeFields();
        } else {
            this.restoreFields();
        }
    }

    /**
     * Fires when date gets Changed
     */
    public effectiveDate_onChange(value: any): void {
        if (this.loadPreviousData) return;
        if (!this.getControlValue('ContractNumber') ||
            !this.getControlValue('PremiseNumber') ||
            !this.getControlValue('ProductCode'))
            return;

        if (value && value.value) {
            this.setControlValue('EffectiveDate', value.value);
        }
        let functionList = 'ValueAtEffectiveDate';

        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');

        let bodyParams: Object = {
            'Function': functionList,
            'ContractNumber': this.getControlValue('ContractNumber'),
            'PremiseNumber': this.getControlValue('PremiseNumber'),
            'ProductCode': this.getControlValue('ProductCode'),
            'ServiceCoverNumber': this.getControlValue('ServiceCoverNumber'),
            'PriceChangeValue': this.getControlValue('PriceChangeValue')
        };

        //If the Effective date is not blank, pass this through and get any warnings
        if (this.getControlValue('EffectiveDate')) {
            functionList += ',WarnEffectiveDate';
            bodyParams['EffectiveDate'] = this.getControlValue('EffectiveDate');
        }

        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    return;
                }
                this.showErrorMessages();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error => ', error);
            });
    }

    /**
     * Fires when price gets Changed
     */
    public priceChangeValue_onChange(): void {
        let newAnnualValue;
        let isNegative = false;
        let serviceAnnualValue = this.getControlValue('ServiceAnnualValue');
        let priceChangeValue = this.getControlValue('PriceChangeValue');
        if (!priceChangeValue) {
            this.setControlValue('PriceChangeValue', this.globalize.formatCurrencyToLocaleFormat(0));
            return;
        }
        newAnnualValue = serviceAnnualValue + priceChangeValue;
        this.setControlValue('NewAnnualValue', newAnnualValue);
    }

    /**
     * fires when Business Code Changes
     */
    public businessOriginCode_OnChange(): void {
        if (this.dropdownConfig.businessOrigin.active.id === '') {
            this.setControlValue('BusinessOriginDesc', '');
            this.ellipsisConfig.businessOriginDetail.childConfigParams.BusinessOriginCode = '';
            this.ellipsisConfig.businessOriginDetail.childConfigParams.BusinessOriginSystemDesc = '';
            return;
        }

        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');

        let bodyParams: Object = {
            'BusinessOriginCode': this.dropdownConfig.businessOrigin.active.id,
            'Function': 'GetBusinessOrigin'
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.setControlValue('BusinessOriginDesc', data.BusinessOriginDesc);
                this.ellipsisConfig.businessOriginDetail.childConfigParams.BusinessOriginCode = this.dropdownConfig.businessOrigin.active.id;
                this.ellipsisConfig.businessOriginDetail.childConfigParams.BusinessOriginSystemDesc = data.BusinessOriginDesc;
                this.businessOriginCode_ondeactivate();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error => ', error);
            });
        this.ellipsisConfig.businessOriginDetail.childConfigParams.BusinessOriginCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode');

    }

    /**
     * fires when Business Original Code Changes
     */
    public businessOriginDetailCode_OnChange(): void {
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');

        let bodyParams: Object = {
            'BusinessOriginCode': this.getControlValue('BusinessOriginCode'),
            'BusinessOriginDetailCode': this.getControlValue('BusinessOriginDetailCode'),
            'Function': 'GetBusinessOriginDetail'
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.riExchange.riInputElement.markAsError(this.uiForm, 'BusinessOriginDetailCode');
                    this.errorModal.show(data, true);
                    return;
                }
                this.setControlValue('BusinessOriginDesc', data.BusinessOriginDesc);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error => ', error);
            });
    }

    /**
     * fires when Lead Employee Code Changes
     */
    public leadEmployee_OnChange(): void {
        this.queryParams.set('businessCode', this.utils.getBusinessCode());
        this.queryParams.set('countryCode', this.utils.getCountryCode());
        this.queryParams.set('action', '6');

        let bodyParams: Object = {
            'LeadEmployee': this.getControlValue('LeadEmployee'),
            'Function': 'GetLeadEmployee'
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.queryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                this.setControlValue('LeadEmployeeSurname', data.LeadEmployeeSurname);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error => ', error);
            });
    }

    /**
     * Show Error Messages
     */
    private showErrorMessages(): void {
        let msgArray: Array<any> = [];

        //If the ErrorMessageDesc field is not blank then show the contents as error messages
        let errorMessageDesc = this.getControlValue('ErrorMessageDesc');
        if (errorMessageDesc) {
            // Split list by Pipe symbol
            msgArray = errorMessageDesc.split('|');
            for (let i = 0; i < msgArray.length; i++) {
                let error = {
                    'errorMessage': msgArray[i]
                };
                this.errorModal.show(error, true);
            }
        }
    }

    /**
     * Opens modal to confirm Delete operation
     */
    public promptSave(ev: any): void {
        this.riMaintenance_Update();
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
                break;
        }
        this.utils.highlightTabs();
    };

    /**
     * On Option changes
     */
    public onOptionChange(selected: any): void {
        if (selected !== '') {
            if (!this.recordFound) {
                let data = { 'errorMessage': 'No Records Selected' };
                this.errorModal.show(data, true);
                return;
            }

            if (selected === 'PlanVisit') {
                this.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR, {
                    'parentMode': 'ServiceCover',
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode'),
                    'CurrentContractTypeURLParameter': '<contract>',
                    'ServiceCoverRowID': this.attributes.ServiceCoverRowID
                });
            } else if (selected === 'StateOfService') {
                alert(' Open iCABSSeStateOfServiceNatAccountGrid wheh available');
                //this.navigate('SOS', '/service/stateOfServiceNatAccountGrid');
            }
        }
    }

    public resetFields(fieldName: any): void {
        this.pageMode = 'N';
        this.uiForm.reset();
        if (fieldName === 'contract') {
            this.setControlValue('ContractNumber', this.pageParams.cNumber);
            this.setControlValue('ContractName', this.pageParams.cName);
        } else if (fieldName === 'premise') {
            this.setControlValue('ContractNumber', this.pageParams.cNumber);
            this.setControlValue('ContractName', this.pageParams.cName);
            this.setControlValue('PremiseNumber', this.pageParams.pNumber);
            this.setControlValue('PremiseName', this.pageParams.pName);
            this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.pageParams.cNumber;
            this.ellipsisConfig.product.childConfigParams['ContractName'] = this.pageParams.cName;
            this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.pageParams.pNumber;
            this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.pageParams.pName;
        } else if (fieldName === 'product') {
            this.setControlValue('ContractNumber', this.pageParams.cNumber);
            this.setControlValue('ContractName', this.pageParams.cName);
            this.setControlValue('PremiseNumber', this.pageParams.pNumber);
            this.setControlValue('PremiseName', this.pageParams.pName);
            this.setControlValue('ProductCode', this.pageParams.pCode);
            this.setControlValue('ProductDesc', this.pageParams.pDesc);
            this.setControlValue('ServiceCoverNumber', this.pageParams.ServiceCoverNumber);
        }
        let elem = document.querySelector('.nav-tabs').children;
        for (let i = 0; i < elem.length; i++) {
            this.utils.removeClass(elem[i], 'error');
        }

        this.riExchange.riInputElement.Disable(this.uiForm, 'NewProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PriceChangeValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LostBusinessDetailCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessOriginDetailCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LeadEmployee');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceSalesEmployee');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceSpecialInstructions');
        this.riExchange.riInputElement.Disable(this.uiForm, 'EffectiveDate');

        this.effectiveDateWarningsShown = false;
        this.showBusinessOriginDetailCode = false;
        this.businessOriginDetailCodeRequired = false;
        this.showLeadEmployee = false;
        this.leadEmployeeRequired = false;

        this.dropdownConfig.lostBusiness.isDisabled = true;
        this.ellipsisConfig.lostBusinessDetail.disabled = true;
        this.ellipsisConfig.newProduct.disabled = true;
        this.dropdownConfig.businessOrigin.isDisabled = true;
        this.ellipsisConfig.leadEmployee.disabled = true;
        this.ellipsisConfig.serviceSalesEmployee.disabled = true;
        this.recordFound = false;
        this.fieldData = {};
    }

    //On Focus on last element
    public focusSave(obj: any): void {
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
        if (elem.querySelector('input')) elem.querySelector('input').focus();
        else if (elem.querySelector('textarea')) elem.querySelector('textarea').focus();
    }

    public onBusinessOriginReceived(data: any): void {
        this.dropdownConfig.businessOrigin.active.id = data['BusinessOriginLang.BusinessOriginCode'];
        this.setControlValue('BusinessOriginDesc', data['BusinessOriginLang.BusinessOriginDesc']);
        this.businessOriginCode_OnChange();
    }

}
