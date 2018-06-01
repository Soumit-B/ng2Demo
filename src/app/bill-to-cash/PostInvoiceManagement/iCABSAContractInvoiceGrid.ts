import { Component, NgZone, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Renderer } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { TranslateService } from 'ng2-translate';
import { HttpService } from '../../../shared/services/http-service';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { GridComponent } from './../../../shared/components/grid/grid';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { Utils } from '../../../shared/services/utility';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { InternalMaintenanceApplicationModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAContractInvoiceGrid.html',
    providers: [ErrorService, MessageService]
})

export class ContractInvoiceGridComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('topContainer') container: ElementRef;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('contractInvoiceGrid') contractInvoiceGrid: GridComponent;

    public showErrorHeader = true;
    public showMessageHeader = true;

    public maxColumn: number = 10;
    public currentPage: number = 1;
    public gridData: any;
    public gridTotalItems: number;
    public itemsPerPage: number;
    public errorSubscription;
    public storeSubscription: Subscription;
    public translateSubscription: Subscription;
    public messageSubscription: Subscription;
    public contractInvoiceFormGroup: FormGroup;
    public inputParams: any = {
        'parentMode': 'Contract',
        'pageTitle': 'Invoice History',
        'pageHeader': 'Contract Details',
        'showBusinessCode': false,
        'showCountryCode': false
    };
    public query: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public querySysChar: URLSearchParams = new URLSearchParams();
    public queryParams: any = {
        action: '2',
        operation: 'Application/iCABSAContractInvoiceGrid',
        module: 'invoicing',
        method: 'bill-to-cash/maintenance',
        contentType: 'application/x-www-form-urlencoded',
        riSortOrder: 'Ascending',
        mode: 'Contract'
    };
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ajaxSubscription: Subscription;
    public routeSubscription: Subscription;
    public errorMessage: string;
    public isRequesting: boolean = false;
    public branchList: Array<any>;
    public branchFields: Array<any>;
    public validateProperties: Array<any> = [];
    public accountComponent: any;
    public premiseComponent: any;
    public productComponent: any;
    public premiseData: any;
    public accountData: any;
    public productData: any;
    public showContract: boolean = true;
    public showPremise: boolean = false;
    public showAccount: boolean = false;
    public showProduct: boolean = false;
    public showEmailInvoice: boolean = false;
    public showSelectedInvoice: boolean = false;
    public showButton: boolean = false;
    public showDisputed: boolean = true;

    public backLinkText: string = '';
    public backLinkUrl: string = '';
    public limitByCustomerContact: string = '';
    private contractData: any;
    private contactCenterData: any;
    private storeData: any;
    private sysCharParams: any = {};
    private glDisputedInvoicesInUse: boolean = false;
    private lShowDisputedColumn: boolean = false;
    private lBudgetBilling: boolean = false;
    private dataSentFromParent: any = {};
    private customerContactNumber: any = '';
    private disputedInvoiceCacheName: any = '';
    private scNumberOfInvoiceLayouts: number;
    private translatedHeader: Object = {
        'Account': '',
        'Contract': '',
        'Premise': '',
        'Product': '',
        'TicketMaintenance': '',
        'ContactCentreSearch': '',
        'WorkOrderMaintenance': ''
    };
    private currentContractTypeURLParameter: string = '';
    private selectedInvoice: any;
    private layoutNumber: number;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private zone: NgZone,
        private renderer: Renderer,
        private global: GlobalConstant,
        private ajaxconstant: AjaxObservableConstant,
        private errorService: ErrorService,
        private messageService: MessageService,
        private titleService: Title,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private location: Location,
        private store: Store<any>,
        private utils: Utils,
        private SysCharConstants: SysCharConstants
    ) {
        this.contractInvoiceFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: true }],
            ContractName: [{ value: '', disabled: true }],
            AccountNumber: [{ value: '', disabled: false }],
            AccountName: [{ value: '', disabled: true }],
            ProductCode: [{ value: '', disabled: false }],
            ProductDesc: [{ value: '', disabled: true }],
            PremiseNumber: [{ value: '', disabled: false }],
            PremiseName: [{ value: '', disabled: true }],
            ShowLastInvoices: [{ value: '25', disabled: false }],
            EmailInvoice: [{ value: '', disabled: false }],
            SelectedInvoice: [{ value: '', disabled: false }]
        });
        this.routeSubscription = this.route.queryParams.subscribe(params => {
            this.dataSentFromParent = params;
            this.queryParams.mode = params['parentMode'];
            if (params['budgetbilling']) {
                this.lBudgetBilling = true;
                this.inputParams.parentMode = 'Contract';
            } else {
                this.lBudgetBilling = false;
            }
            switch (this.queryParams.mode) {
                case 'Contract':
                    this.inputParams.parentMode = params['parentMode'];
                    this.setFieldVisibility(true, false, false, false);
                    this.maxColumn = 11;
                    this.queryParams.mode = 'Contract';
                    this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(this.dataSentFromParent.ContractNumber);
                    this.contractInvoiceFormGroup.controls['ContractName'].setValue(this.dataSentFromParent.ContractName);
                    this.storeSubscription = this.store.select('contract').subscribe(data => {
                        this.contractData = data['data'];
                        this.storeData = data;
                        if (this.contractData && this.contractData.ContractNumber) {
                            this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(this.contractData.ContractNumber);
                            this.contractInvoiceFormGroup.controls['ContractName'].setValue(this.contractData.ContractName);
                        }
                    });
                    break;

                case 'Account':
                    this.inputParams.parentMode = params['parentMode'];
                    this.storeSubscription = this.store.select('accountMaintenance').subscribe(data => {
                        this.storeData = data;
                    });
                    this.setFieldVisibility(false, true, false, false);
                    this.maxColumn = 12;
                    this.queryParams.mode = 'Account';
                    this.contractInvoiceFormGroup.controls['AccountNumber'].setValue(this.dataSentFromParent.AccountNumber);
                    this.contractInvoiceFormGroup.controls['AccountName'].setValue(this.dataSentFromParent.AccountName);
                    break;

                case 'Premise':
                    this.inputParams.parentMode = params['parentMode'];
                    this.setFieldVisibility(true, false, true, false);
                    this.queryParams.mode = 'Premise';
                    this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(this.dataSentFromParent.ContractNumber);
                    this.contractInvoiceFormGroup.controls['ContractName'].setValue(this.dataSentFromParent.ContractName);
                    this.contractInvoiceFormGroup.controls['PremiseNumber'].setValue(this.dataSentFromParent.PremiseNumber);
                    this.contractInvoiceFormGroup.controls['PremiseName'].setValue(this.dataSentFromParent.PremiseName);
                    break;

                case 'Product':
                    this.inputParams.parentMode = params['parentMode'];
                    this.setFieldVisibility(true, false, true, true);
                    this.queryParams.mode = 'Product';
                    this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(this.dataSentFromParent.ContractNumber);
                    this.contractInvoiceFormGroup.controls['ContractName'].setValue(this.dataSentFromParent.ContractName);
                    this.contractInvoiceFormGroup.controls['PremiseNumber'].setValue(this.dataSentFromParent.PremiseNumber);
                    this.contractInvoiceFormGroup.controls['PremiseName'].setValue(this.dataSentFromParent.PremiseName);
                    this.contractInvoiceFormGroup.controls['ProductCode'].setValue(this.dataSentFromParent.ProductCode);
                    this.contractInvoiceFormGroup.controls['ProductDesc'].setValue(this.dataSentFromParent.ProductDesc);
                    break;


                case 'TicketMaintenance':
                case 'ContactCentreSearch':
                    this.inputParams.parentMode = params['parentMode'];
                    this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(this.dataSentFromParent.ContractNumber);
                    this.contractInvoiceFormGroup.controls['ContractName'].setValue(this.dataSentFromParent.ContractName);
                    this.contractInvoiceFormGroup.controls['PremiseNumber'].setValue(this.dataSentFromParent.PremiseNumber);
                    this.contractInvoiceFormGroup.controls['PremiseName'].setValue(this.dataSentFromParent.PremiseName);
                    this.contractInvoiceFormGroup.controls['AccountNumber'].setValue(this.dataSentFromParent.AccountNumber);
                    this.contractInvoiceFormGroup.controls['AccountName'].setValue(this.dataSentFromParent.AccountContactName);
                    this.customerContactNumber = this.dataSentFromParent.customerContactNumber || this.dataSentFromParent.CustomerContactNumber;
                    this.disputedInvoiceCacheName = this.dataSentFromParent.disputedInvoiceCacheName;
                    this.queryParams.mode = 'Account';
                    this.setFieldVisibility(false, true, false, false);
                    if (this.contractInvoiceFormGroup.controls['ContractNumber'].value) {
                        this.setFieldVisibility(true, false, false, false);
                    }
                    if (this.contractInvoiceFormGroup.controls['PremiseNumber'].value) {
                        this.setFieldVisibility(true, false, true, false);
                    }
                    break;

                case 'WorkOrderMaintenance':
                    this.inputParams.parentMode = params['parentMode'];
                    this.contractInvoiceFormGroup.controls['AccountNumber'].setValue(this.dataSentFromParent.AccountNumber);
                    this.customerContactNumber = this.dataSentFromParent.customerContactNumber || this.dataSentFromParent.CustomerContactNumber;
                    this.queryParams.mode = 'Account';
                    this.limitByCustomerContact = 'Y';
                    this.setFieldVisibility(false, true, false, false);
                    break;
                default:
                    // code...
                    break;
            }

        });
    }

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        //this.premiseComponent = AccountSearchComponent;
        //this.productComponent = AccountSearchComponent;
        this.accountComponent = AccountSearchComponent;
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data['errorMessage']) {
                        this.errorModal.show(data, true);
                    }
                });
            }

        });

        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {

                    this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                });
            }
        });

        this.ajaxSubscription = this.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.zone.run(() => {
                    switch (event) {
                        case this.ajaxconstant.START:
                            this.isRequesting = true;
                            break;
                        case this.ajaxconstant.COMPLETE:
                            this.isRequesting = false;
                            break;
                    }
                });
            }
        });

        this.localeTranslateService.setUpTranslation();

        this.accountComponent = AccountSearchComponent;
        this.productComponent = AccountSearchComponent;
        this.premiseComponent = AccountSearchComponent;
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.fetchSysChar().subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError({
                        errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                    });
                    return false;
                }
                if (e.records && e.records.length > 0) {
                    this.sysCharParams['vEnableRounding'] = e.records[0].Required;
                    this.sysCharParams['vSCEnableMultipleInvoiceLayouts'] = e.records[1].Required;
                    this.sysCharParams['vSCNumberOfInvoiceLayouts'] = e.records[1].Integer;
                    this.sysCharParams['vSCEnableSeparateTaxInvLayout'] = e.records[2].Required;
                    this.sysCharParams['vReproduceInvoiceForEmail'] = e.records[3].Required;
                    if (this.sysCharParams['vReproduceInvoiceForEmail']) {
                        //this.showSelectedInvoice = true;
                        this.showEmailInvoice = true;
                        this.contractInvoiceFormGroup.controls['EmailInvoice'].setValue(false);
                    } else {
                        //this.showSelectedInvoice = false;
                        this.showEmailInvoice = false;
                    }
                    this.setVariables();
                }
                this.lookUpRegistry();
            },
            (err) => {
                this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
            });
        this.contractInvoiceFormGroup.controls['AccountNumber'].disable();
        if (!this.lBudgetBilling) {
            this.contractInvoiceFormGroup.controls['ContractNumber'].disable();
            this.contractInvoiceFormGroup.controls['PremiseNumber'].disable();
        } else {
            this.contractInvoiceFormGroup.controls['ContractNumber'].enable();
            let focus = new CustomEvent('focus', { bubbles: true });
            setTimeout(() => {
                this.renderer.invokeElementMethod(document.getElementById('ContractNumber'), 'focus', [focus]);
            }, 0);
        }
        this.contractInvoiceFormGroup.controls['ProductCode'].disable();
        this.onAccountBlur({});
    }

    ngAfterViewInit(): void {
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
    }

    ngOnDestroy(): void {
        if (this.routeSubscription)
            this.routeSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        this.titleService.setTitle('');
    }

    private setFieldVisibility(showContract: boolean, showAccount: boolean, showPremise: boolean, showProduct: boolean): void {
        this.showContract = showContract;
        this.showAccount = showAccount;
        this.showPremise = showPremise;
        this.showProduct = showProduct;
    }

    public setVariables(): void {
        if (this.sysCharParams['vSCEnableMultipleInvoiceLayouts'] && this.sysCharParams['vSCNumberOfInvoiceLayouts'] > 0 && !this.sysCharParams['vSCEnableSeparateTaxInvLayout']) {
            this.scNumberOfInvoiceLayouts = this.sysCharParams['vSCNumberOfInvoiceLayouts'];
        } else {
            this.scNumberOfInvoiceLayouts = 0;
        }
    }

    public getCellData(data: any): void {
        let selectedInvoice = {};
        let vMultiple: string = '';
        if ((this.dataSentFromParent['parentMode'] === 'Account' && (data.cellIndex === 1 || data.cellIndex === 3)) || (this.dataSentFromParent['parentMode'] !== 'Account' && (data.cellIndex === 0 || data.cellIndex === 2))) {
            selectedInvoice['CompanyCode'] = data.trRowData[data.cellIndex].text;
            selectedInvoice['CompanyDesc'] = data.trRowData[data.cellIndex].additionalData;
        }
        if (this.dataSentFromParent['parentMode'] === 'Account') {
            if (this.lBudgetBilling) {
                if (data.cellIndex === 10 || data.cellIndex === 2) {
                    selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
                    selectedInvoice['SystemInvoiceNumber'] = data.trRowData[10].additionalData;
                }
            } else {
                if (data.cellIndex === 9 || data.cellIndex === 2) {
                    selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
                    selectedInvoice['SystemInvoiceNumber'] = data.trRowData[9].additionalData;
                }
            }
            selectedInvoice['InvoiceNumber'] = data.trRowData[2].text.trim();
            selectedInvoice['InvoiceName'] = data.trRowData[4].text;
            vMultiple = data.trRowData[3].additionalData;
            if (vMultiple === 'no') {
                selectedInvoice['ContractNumber'] = data.trRowData[0].text;
                selectedInvoice['ContractName'] = data.trRowData[0].toolTip;
                selectedInvoice['ContractRowID'] = data.trRowData[0].rowID;
            } else {
                this.getTranslatedValue('Multiple', null).subscribe((res: string) => {
                    this.zone.run(() => {
                        if (res) {
                            selectedInvoice['ContractNumber'] = res;
                            selectedInvoice['ContractName'] = res;
                        }
                    });
                });
                selectedInvoice['ContractRowID'] = 'ABC123';
            }
            if (data.trRowData[0].additionalData === 'C') {
                this.currentContractTypeURLParameter = '';
            } else if (data.trRowData[0].additionalData === 'J') {
                this.currentContractTypeURLParameter = '<job>';
            } else if (data.trRowData[0].additionalData === 'P') {
                this.currentContractTypeURLParameter = '<product>';
            }
        } else {
            if (this.lBudgetBilling) {
                if (data.cellIndex === 9 || data.cellIndex === 1) {
                    selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
                    selectedInvoice['SystemInvoiceNumber'] = data.trRowData[9].additionalData;
                }
            } else {
                if (data.cellIndex === 8 || data.cellIndex === 1) {
                    selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
                    selectedInvoice['SystemInvoiceNumber'] = data.trRowData[8].additionalData;
                }
            }
            selectedInvoice['InvoiceNumber'] = data.trRowData[1].text.trim();
            selectedInvoice['InvoiceName'] = data.trRowData[3].text;
            vMultiple = data.trRowData[2].additionalData;
        }
        if (!selectedInvoice['RowID']) {
            selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
            selectedInvoice['SystemInvoiceNumber'] = data.trRowData[data.cellIndex].additionalData;
        }
        selectedInvoice['Cell'] = data.cellIndex;
        selectedInvoice['Row'] = data.rowIndex;
        selectedInvoice['Level'] = 'Header';

        if (this.dataSentFromParent['parentMode'] !== 'TicketMaintenance' && this.dataSentFromParent['parentMode'] !== 'ContactCentreSearch') {
            if (this.sysCharParams['vSCEnableSeparateTaxInvLayout']) {
                this.layoutNumber = data.trRowData[this.maxColumn - 1].additionalData;
            }
        }
        if (!selectedInvoice['ContractNumber']) {
            selectedInvoice['ContractNumber'] = this.dataSentFromParent['ContractNumber'];
        }
        if (!selectedInvoice['ContractName']) {
            selectedInvoice['ContractName'] = this.dataSentFromParent['ContractName'];
        }
        selectedInvoice['AccountNumber'] = this.dataSentFromParent['AccountNumber'];
        selectedInvoice['AccountName'] = this.dataSentFromParent['AccountName'];
        this.selectedInvoice = selectedInvoice;
    }

    public onGridRowDblClick(data: any): void {
        this.getCellData(data);
        if (data.cellData.text === 'SP') {
            this.triggerPrint(data.cellData.rowID);
        }
        if (this.dataSentFromParent['parentMode'] === 'Account') {
            if (data.cellIndex === 0) {
                if (this.lBudgetBilling) {
                    this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
                        queryParams: {
                            parentMode: 'InvoiceHistory',
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName']
                        }
                    });
                } else {
                    if (data.cellData.additionalData === 'J') {
                        this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
                            queryParams: {
                                parentMode: 'InvoiceHistory',
                                ContractNumber: this.selectedInvoice['ContractNumber'],
                                ContractName: this.selectedInvoice['ContractName']
                            }
                        });
                    } else if (data.cellData.additionalData === 'P') {
                        this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], {
                            queryParams: {
                                parentMode: 'InvoiceHistory',
                                ContractNumber: this.selectedInvoice['ContractNumber'],
                                ContractName: this.selectedInvoice['ContractName']
                            }
                        });
                    } else {
                        this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                            queryParams: {
                                parentMode: 'InvoiceHistory',
                                ContractNumber: this.selectedInvoice['ContractNumber'],
                                ContractName: this.selectedInvoice['ContractName']
                            }
                        });
                    }

                }
            } else if (data.cellIndex === 2) {
                if (this.lBudgetBilling) {
                    // iCABSAContractInvoiceDetailGrid <job>
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], {
                        queryParams: {
                            parentMode: 'BudgetBilling',
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName'],
                            ContractTypeCode: 'J',
                            InvoiceNumber: data.cellData.text.trim(),
                            CompanyCode: data.trRowData[1].text,
                            CompanyDesc: data.trRowData[1].additionalData,
                            InvoiceName: data.trRowData[4].text,
                            AccountNumber: this.selectedInvoice['AccountNumber'],
                            AccountName: this.selectedInvoice['AccountName'],
                            SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                        }
                    });
                } else {
                    // iCABSAContractInvoiceDetailGrid
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], {
                        queryParams: {
                            parentMode: this.queryParams.mode,
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName'],
                            ContractTypeCode: this.currentContractTypeURLParameter,
                            InvoiceNumber: data.cellData.text.trim(),
                            CompanyCode: data.trRowData[1].text,
                            CompanyDesc: data.trRowData[1].additionalData,
                            InvoiceName: data.trRowData[4].text,
                            AccountNumber: this.selectedInvoice['AccountNumber'],
                            AccountName: this.selectedInvoice['AccountName'],
                            SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                        }
                    });
                }
            }

            if ((this.lBudgetBilling && data.cellIndex === 10) || (!this.lBudgetBilling && data.cellIndex === 9)) {
                this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSACONTRACTINVOICETURNOVERGRID], {
                    queryParams: {
                        parentMode: this.queryParams.mode,
                        ContractNumber: this.contractInvoiceFormGroup.controls['ContractNumber'].value,
                        ContractName: this.contractInvoiceFormGroup.controls['ContractName'].value,
                        PremiseNumber: this.contractInvoiceFormGroup.controls['PremiseNumber'].value,
                        PremiseName: this.contractInvoiceFormGroup.controls['PremiseName'].value,
                        AccountNumber: this.contractInvoiceFormGroup.controls['AccountNumber'].value,
                        AccountName: this.contractInvoiceFormGroup.controls['AccountName'].value,
                        ProductCode: this.contractInvoiceFormGroup.controls['ProductCode'].value,
                        ProductDesc: this.contractInvoiceFormGroup.controls['ProductDesc'].value,
                        ContractTypeCode: this.currentContractTypeURLParameter,
                        CompanyCode: data.trRowData[1].text,
                        CompanyDesc: data.trRowData[1].additionalData,
                        InvoiceNumber: data.trRowData[2].text,
                        InvoiceName: data.trRowData[2].additionalData,
                        SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                    }
                });
            }
        } else {
            if (data.cellIndex === 1) {
                if (this.lBudgetBilling) {
                    // iCABSAContractInvoiceDetailGrid <job>
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], {
                        queryParams: {
                            parentMode: 'BudgetBilling',
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName'],
                            ContractTypeCode: 'J',
                            InvoiceNumber: data.cellData.text.trim(),
                            CompanyCode: data.trRowData[0].text,
                            CompanyDesc: data.trRowData[0].additionalData,
                            InvoiceName: data.trRowData[3].text,
                            AccountNumber: this.selectedInvoice['AccountNumber'],
                            AccountName: this.selectedInvoice['AccountName'],
                            SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                        }
                    });
                } else {
                    // iCABSAContractInvoiceDetailGrid
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], {
                        queryParams: {
                            parentMode: this.queryParams.mode,
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName'],
                            ContractTypeCode: this.currentContractTypeURLParameter,
                            InvoiceNumber: data.cellData.text.trim(),
                            CompanyCode: data.trRowData[0].text,
                            CompanyDesc: data.trRowData[0].additionalData,
                            InvoiceName: data.trRowData[3].text,
                            AccountNumber: this.selectedInvoice['AccountNumber'],
                            AccountName: this.selectedInvoice['AccountName'],
                            SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                        }
                    });
                }
            }

            if ((this.lBudgetBilling && data.cellIndex === 9) || (!this.lBudgetBilling && data.cellIndex === 8)) {
                this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSACONTRACTINVOICETURNOVERGRID], {
                    queryParams: {
                        parentMode: this.queryParams.mode,
                        ContractNumber: this.contractInvoiceFormGroup.controls['ContractNumber'].value,
                        ContractName: this.contractInvoiceFormGroup.controls['ContractName'].value,
                        PremiseNumber: this.contractInvoiceFormGroup.controls['PremiseNumber'].value,
                        PremiseName: this.contractInvoiceFormGroup.controls['PremiseName'].value,
                        AccountNumber: this.contractInvoiceFormGroup.controls['AccountNumber'].value,
                        AccountName: this.contractInvoiceFormGroup.controls['AccountName'].value,
                        ProductCode: this.contractInvoiceFormGroup.controls['ProductCode'].value,
                        ProductDesc: this.contractInvoiceFormGroup.controls['ProductDesc'].value,
                        ContractTypeCode: this.currentContractTypeURLParameter,
                        CompanyCode: data.trRowData[0].text,
                        CompanyDesc: data.trRowData[0].additionalData,
                        InvoiceNumber: data.trRowData[1].text,
                        InvoiceName: data.trRowData[1].additionalData,
                        SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                    }
                });
            }
        }
        if (data.cellData.text.toUpperCase() === 'SMILEUP' || data.cellData.text.toUpperCase() === 'SU' || data.cellData.text.toUpperCase() === 'SMILEDOWN' || data.cellData.text.toUpperCase() === 'SD') {
            this.router.navigate(['/ccm/centreReview'], {
                queryParams: {
                    parentMode: 'InvoiceHistory',
                    ContractNumber: this.selectedInvoice['ContractNumber'],
                    ContractName: this.selectedInvoice['ContractName'],
                    AccountNumber: this.contractInvoiceFormGroup.controls['AccountNumber'].value,
                    AccountName: this.contractInvoiceFormGroup.controls['AccountName'].value
                }
            });
        }

    }

    private triggerPrint(rowId: string): void {
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('Function', 'Single');
        search.set('InvoiceNumber', rowId);
        search.set('EmailInvoice', 'False');
        search.set('LayoutNumber', this.layoutNumber ? this.layoutNumber.toString() : '');

        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                try {
                    if (!data['fullError']) {
                        window.open(data.url, '_blank');
                    }
                    else {
                        if (data.fullError.indexOf('iCABSAInvoiceReprintMaintenance.htm') >= 0) {
                            let tempList = data.fullError.split('?');
                            if (tempList && tempList.length > 1) {
                                let params = new URLSearchParams(tempList[1]);
                                this.router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAINVOICEREPRINTMAINTENANCE], { queryParams: { InvoiceNumber: params.get('InvoiceNumber'), InvoiceRowId: rowId } });
                            }
                        }
                    }
                } catch (error) {
                    this.errorService.emitError(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    private sysCharParameters(): string {
        let sysCharList = [
            this.SysCharConstants.SystemCharEnableRoundingValuesOnInvoiceHistory,
            this.SysCharConstants.SystemCharEnableMultipleInvoiceLayouts,
            this.SysCharConstants.SystemCharEnableSeparateTaxAndNonTaxInvoiceLayouts,
            this.SysCharConstants.SystemCharReproduceInvoicesForEmail
        ];
        return sysCharList.join(',');
    }

    private fetchSysChar(): any {
        let sysCharNumbers = this.sysCharParameters();
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.querySysChar.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }

    private setMaxColumn(): void {
        switch (this.queryParams.mode) {
            case 'Contract':
                this.calculateMaxColumn(10);
                this.inputParams.pageHeader = this.translatedHeader['Contract'];
                break;

            case 'Account':
                this.calculateMaxColumn(11);
                this.inputParams.pageHeader = this.translatedHeader['Account'];
                break;

            case 'Premise':
                this.calculateMaxColumn(10);
                this.inputParams.pageHeader = this.translatedHeader['Premise'];
                break;

            case 'Product':
                this.calculateMaxColumn(10);
                this.inputParams.pageHeader = this.translatedHeader['Product'];
                break;

            case 'TicketMaintenance':
            case 'ContactCentreSearch':
                this.maxColumn = 10;
                if (this.lBudgetBilling) {
                    this.maxColumn += 1;
                }
                if (this.sysCharParams['vEnableRounding']) {
                    this.maxColumn += 2;
                }
                this.maxColumn++;

                if (this.dataSentFromParent['parentMode'] === 'TicketMaintenance') {
                    this.inputParams.pageHeader = this.translatedHeader['TicketMaintenance'];
                } else {
                    this.inputParams.pageHeader = this.translatedHeader['ContactCentreSearch'];
                }
                break;

            case 'WorkOrderMaintenance':
                this.calculateMaxColumn(10);
                this.inputParams.pageHeader = this.translatedHeader['WorkOrderMaintenance'];
                break;
            default:
                this.calculateMaxColumn(10);
                break;
        }
        let addColumn: number = 0;
        let columnArray: Array<any> = [];
        if (this.queryParams.mode === 'Account') {
            columnArray = columnArray.concat([{
                'type': MntConst.eTypeInteger,
                'index': addColumn,
                'align': 'center'
            }]);
            addColumn++;
        }
        columnArray = columnArray.concat([
            {
                'type': MntConst.eTypeCode,
                'index': addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': ++addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': ++addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': ++addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDate,
                'index': ++addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDate,
                'index': ++addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDate,
                'index': ++addColumn,
                'align': 'center'
            }
        ]);
        if (this.lBudgetBilling) {
            columnArray = columnArray.concat([{
                'type': MntConst.eTypeDate,
                'index': ++addColumn,
                'align': 'center'
            }]);
        }

        columnArray = columnArray.concat([
            {
                'type': MntConst.eTypeImage,
                'index': ++addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': ++addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': ++addColumn,
                'align': 'center'
            }
        ]);

        if (this.sysCharParams['vEnableRounding']) {
            columnArray = columnArray.concat([
                {
                    'type': MntConst.eTypeText,
                    'index': ++addColumn,
                    'align': 'center'
                },
                {
                    'type': MntConst.eTypeText,
                    'index': ++addColumn,
                    'align': 'center'
                }
            ]);
        }

        if (this.dataSentFromParent['parentMode'] === 'TicketMaintenance' || this.dataSentFromParent['parentMode'] === 'ContactCentreSearch') {
            columnArray = columnArray.concat([{
                'type': MntConst.eTypeImage,
                'index': ++addColumn,
                'align': 'center'
            }]);
        } else {
            if (this.lShowDisputedColumn) {
                columnArray = columnArray.concat([{
                    'type': MntConst.eTypeImage,
                    'index': ++addColumn,
                    'align': 'center'
                }]);
            }

            if (this.lBudgetBilling) {
                columnArray = columnArray.concat([{
                    'type': MntConst.eTypeImage,
                    'index': ++addColumn,
                    'align': 'center'
                }]);
            } else {
                if (this.scNumberOfInvoiceLayouts > 1) {
                    let layoutNumber: number = 0;
                    while (layoutNumber < this.scNumberOfInvoiceLayouts) {
                        layoutNumber++;
                        columnArray = columnArray.concat([{
                            'type': MntConst.eTypeImage,
                            'index': ++addColumn,
                            'align': 'center'
                        }]);
                    }
                } else {
                    columnArray = columnArray.concat([{
                        'type': MntConst.eTypeImage,
                        'index': ++addColumn,
                        'align': 'center'
                    }]);
                }
            }
        }
        this.validateProperties = columnArray;
    }

    private calculateMaxColumn(maxColumn: number): void {
        if (this.lBudgetBilling) {
            maxColumn += 2;
        } else {
            if (this.scNumberOfInvoiceLayouts > 1) {
                maxColumn += this.scNumberOfInvoiceLayouts;
                this.layoutNumber = this.scNumberOfInvoiceLayouts;
            } else {
                maxColumn++;
            }
        }
        if (this.sysCharParams['vEnableRounding']) {
            maxColumn += 2;
        }
        if (this.lShowDisputedColumn) {
            maxColumn++;
        }
        this.maxColumn = maxColumn;
    }

    private fetchGridData(): void {
        this.query.set(this.serviceConstants.Action, this.queryParams.action);
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('ContractNumber', this.contractInvoiceFormGroup.controls['ContractNumber'].value);
        this.query.set('PremiseNumber', this.contractInvoiceFormGroup.controls['PremiseNumber'].value);
        this.query.set('PremiseName', this.contractInvoiceFormGroup.controls['PremiseName'].value);
        this.query.set('AccountNumber', this.contractInvoiceFormGroup.controls['AccountNumber'].value);
        this.query.set('AccountName', this.contractInvoiceFormGroup.controls['AccountName'].value);
        this.query.set('ProductCode', this.contractInvoiceFormGroup.controls['ProductCode'].value);
        this.query.set('EmailInvoice', this.contractInvoiceFormGroup.controls['EmailInvoice'].value);
        this.query.set('ShowLastInvoices', this.contractInvoiceFormGroup.controls['ShowLastInvoices'].value);
        this.query.set('SelectedInvoice', this.contractInvoiceFormGroup.controls['SelectedInvoice'].value);
        this.query.set('CustomerContactNumber', this.customerContactNumber);
        this.query.set('InitialExchangeParentMode', this.dataSentFromParent['parentMode']);
        this.query.set('SCNumberOfInvoiceLayouts', this.scNumberOfInvoiceLayouts.toString());
        this.query.set('SCEnableSeparateTaxInvoiceLayout', this.sysCharParams['vSCEnableSeparateTaxInvLayout'].toString());
        this.query.set('ShowLast', this.contractInvoiceFormGroup.controls['ShowLastInvoices'].value);
        this.query.set('ShowDisputedColumn', this.lShowDisputedColumn ? 'Y' : '');
        this.query.set('DisputedInvoiceCacheName', this.disputedInvoiceCacheName);
        this.query.set('LimitByCustomerContact', this.limitByCustomerContact);
        this.query.set('BudgetBilling', this.lBudgetBilling ? 'Y' : '');
        this.query.set('HeaderClickedColumn', this.inputParams.parentMode);
        this.query.set('Mode', this.queryParams.mode);
        this.query.set('riSortOrder', this.queryParams.sortOrder);
        this.query.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.queryParams.search = this.query;
        this.contractInvoiceGrid.loadGridData(this.queryParams);
    }

    public gridInfo(value: any): void {
        if (value && value.totalPages) {
            this.gridTotalItems = parseInt(value.totalPages, 10) * this.itemsPerPage;
        } else {
            this.gridTotalItems = 0;
        }
    }

    public onAccountBlur(event: any): void {
        if (this.contractInvoiceFormGroup.controls['AccountNumber'].value && this.contractInvoiceFormGroup.controls['AccountNumber'].value !== '') {
            let data = [{
                'table': 'Account',
                'query': { 'AccountNumber': this.contractInvoiceFormGroup.controls['AccountNumber'].value, 'BusinessCode': this.utils.getBusinessCode(), 'CountryCode': this.utils.getCountryCode() },
                'fields': ['AccountNumber', 'AccountName']
            }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.contractInvoiceFormGroup.controls['AccountName'].setValue(e['results'][0][0].AccountName);

                    } else {
                        this.contractInvoiceFormGroup.controls['AccountName'].setValue('');
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        ///this.errorService.emitError(e);
                    }

                },
                (error) => {
                    this.contractInvoiceFormGroup.controls['AccountName'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    //this.errorService.emitError(error);
                }
            );
        } else {
            this.contractInvoiceFormGroup.controls['AccountName'].setValue('');
        }
    }

    public onContractBlur(event: any): void {
        if (this.contractInvoiceFormGroup.controls['ContractNumber'].value && this.contractInvoiceFormGroup.controls['ContractNumber'].value !== '') {
            let data = [{
                'table': 'Contract',
                'query': { 'ContractNumber': this.contractInvoiceFormGroup.controls['ContractNumber'].value, 'BusinessCode': this.storeData['code'].business },
                'fields': ['ContractNumber', 'ContractName']
            }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.contractInvoiceFormGroup.controls['ContractName'].setValue(e['results'][0][0].ContractName);

                    } else {
                        this.contractInvoiceFormGroup.controls['ContractName'].setValue('');
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        //this.errorService.emitError(e);
                    }

                },
                (error) => {
                    this.contractInvoiceFormGroup.controls['ContractName'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    //this.errorService.emitError(error);
                }
            );
        } else {
            this.contractInvoiceFormGroup.controls['ContractName'].setValue('');
        }
    }

    public onPremiseBlur(event: any): void {
        if (this.contractInvoiceFormGroup.controls['PremiseNumber'].value && this.contractInvoiceFormGroup.controls['PremiseNumber'].value !== '') {
            let data = [{
                'table': 'Premise',
                'query': { 'ContractNumber': this.contractInvoiceFormGroup.controls['ContractNumber'].value, 'PremiseNumber': this.contractInvoiceFormGroup.controls['PremiseNumber'].value, 'BusinessCode': this.storeData['code'].business },
                'fields': ['BusinessCode', 'PremiseNumber', 'PremiseName']
            }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.contractInvoiceFormGroup.controls['PremiseName'].setValue(e['results'][0][0].PremiseName);

                    } else {
                        this.contractInvoiceFormGroup.controls['PremiseName'].setValue('');
                        e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                        //this.errorService.emitError(e);
                    }

                },
                (error) => {
                    this.contractInvoiceFormGroup.controls['PremiseName'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    //this.errorService.emitError(error);
                }
            );
        } else {
            this.contractInvoiceFormGroup.controls['PremiseName'].setValue('');
        }
    }

    public onProductBlur(event: any): void {
        if (this.contractInvoiceFormGroup.controls['ProductCode'].value && this.contractInvoiceFormGroup.controls['ProductCode'].value !== '') {
            let productData = [{
                'table': 'Product',
                'query': { 'ProductCode': this.contractInvoiceFormGroup.controls['ProductCode'].value, 'BusinessCode': this.storeData['code'].business },
                'fields': ['BusinessCode', 'ProductDesc']
            }];

            this.lookUpRecord(productData, 100).subscribe(
                (e) => {
                    if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                        this.contractInvoiceFormGroup.controls['ProductDesc'].setValue(e['results'][0][0].ProductDesc);

                    } else {
                        this.contractInvoiceFormGroup.controls['ProductDesc'].setValue('');
                        //e['errorMessage'] = ErrorConstant.Message.recordNotFound;
                        //this.errorService.emitError(e);

                    }

                },
                (error) => {
                    this.contractInvoiceFormGroup.controls['ProductDesc'].setValue('');
                    error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                    //this.errorService.emitError(error);

                }
            );
        } else {
            this.contractInvoiceFormGroup.controls['ProductDesc'].setValue('');
        }
    }

    private lookUpRegistry(): void {
        let businessCode = this.utils.getBusinessCode();
        let registryData = [{
            'table': 'riRegistry',
            'query': { 'RegSection': 'CCM Disputed Invoices', 'RegKey': businessCode + '_' + 'Enable CCM Dispute Processing' },
            'fields': ['RegValue']
        }];
        this.lookUpRecord(registryData, 5).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0 && e['results'][0][0].RegValue === 'Y') {
                    this.glDisputedInvoicesInUse = true;
                    this.lShowDisputedColumn = true;
                } else {
                    this.glDisputedInvoicesInUse = false;
                    this.lShowDisputedColumn = false;
                }
                this.setMaxColumn();
                this.fetchGridData();

            });
    }

    public lookUpRecord(data: any, maxresults: number): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('Invoice History', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.titleService.setTitle(res);
                } else {
                    this.titleService.setTitle(this.inputParams.pageTitle);
                }
            });
        });

        if (!this.lBudgetBilling) {
            this.getTranslatedValue('Invoice History', null).subscribe((res: string) => {
                this.zone.run(() => {
                    if (res) {
                        this.titleService.setTitle(res);
                    } else {
                        this.titleService.setTitle(this.inputParams.pageTitle);
                    }
                });
            });
        } else {
            this.getTranslatedValue('Budget Billing - Payment Grid', null).subscribe((res: string) => {
                this.zone.run(() => {
                    if (res) {
                        this.titleService.setTitle(res);
                    } else {
                        this.titleService.setTitle(this.inputParams.pageTitle);
                    }
                });
            });
            this.getTranslatedValue('Job Number', null).subscribe((res: string) => {
                this.zone.run(() => {
                    if (res) {
                        let elem = document.querySelector('[for="ContractNumber"]');
                        if (elem)
                            document.querySelector('[for="ContractNumber"]').textContent = res;
                    }
                });
            });
        }

        this.getTranslatedValue('Account Details', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedHeader['Account'] = res;
                }
            });
        });

        this.getTranslatedValue('Contract Details', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedHeader['Contract'] = res;
                }
            });
        });

        this.getTranslatedValue('Premise Details', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedHeader['Premise'] = res;
                }
            });
        });

        this.getTranslatedValue('Product Details', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedHeader['Product'] = res;
                }
            });
        });

        this.getTranslatedValue('TicketMaintenance Details', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedHeader['TicketMaintenance'] = res;
                }
            });
        });

        this.getTranslatedValue('ContactCentreSearch Details', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedHeader['ContactCentreSearch'] = res;
                }
            });
        });

        this.getTranslatedValue('WorkOrderMaintenance Details', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.translatedHeader['WorkOrderMaintenance'] = res;
                }
            });
        });
    }

    public getCurrentPage(event: any): void {
        this.currentPage = event.value;
        this.fetchGridData();
    }

    public onRefresh(): void {
        //this.currentPage = 1;
        this.fetchGridData();
    }

    public onPremiseDataReceived(data: any): void {
        this.contractInvoiceFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.contractInvoiceFormGroup.controls['PremiseName'].setValue(data.PremiseName);
    }

    public onAccountDataReceived(data: any): void {
        this.contractInvoiceFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.contractInvoiceFormGroup.controls['AccountName'].setValue(data.AccountContactName);
    }

    public onProductDataReceived(data: any): void {
        this.contractInvoiceFormGroup.controls['ProductCode'].setValue(data.ProductCode);
        //this.contractInvoiceFormGroup.controls['AccountName'].setValue(data.AccountContactName);
    }

    public onBlur(event: any): void {
        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            let _paddedValue = this.numberPadding(elementValue, 8);
            this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(_paddedValue);
        }
    }
    public isNumber(evt: any): boolean {
        evt = (evt) ? evt : window.event;
        let charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    public toUpperCase(event: any): void {
        let target = event.target.getAttribute('formControlName');
        let elementValue = event.target.value;
        this.contractInvoiceFormGroup.controls[target].setValue(elementValue.toUpperCase());
    }

    public numberPadding(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }
}
