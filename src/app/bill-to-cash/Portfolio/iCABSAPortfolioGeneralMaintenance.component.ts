import { Observable } from 'rxjs/Rx';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { Component, NgZone, ViewChild, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { URLSearchParams } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { HttpService } from '../../../shared/services/http-service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { GridComponent } from './../../../shared/components/grid/grid';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { ContractActionTypes } from '../../actions/contract';
import { Logger } from '@nsalaun/ng2-logger';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { Utils } from '../../../shared/services/utility';
import { PostCodeUtils } from '../../../shared/services/postCode-utility';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { Location } from '@angular/common';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
@Component({
    templateUrl: 'iCABSAPortfolioGeneralMaintenance.html',
    providers: [ErrorService, MessageService, PostCodeUtils]
})
export class PortfolioGeneralMaintenanceComponent implements OnInit {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('ContractNumber') formContractNumber;
    public inputParamsContract: any;
    public inputParamsPremise: any = {
        'parentMode': 'LookUp'
    };
    public inputParamsProduct: any = {
        'parentMode': 'PortfolioGeneralMaintenance'
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public flag: string;
    public eventvalue: string;
    public strParam: string;
    public promptTitle: string = 'Portfolio Selection';
    public promptContent: string;
    public showMessageHeader: boolean = true;
    public varCheckCorrectEntryType: string = '';
    public varCheckContractType: string = '';
    public strIncorrectType: string;
    public strSelectedContractTypeCode: string;
    public CurrentContractTypeURLParameter: string = ''; // this comes from parent screen
    public showHeader: boolean = true;
    public contractSearchComponent = ContractSearchComponent;
    public premiseComponent = ContractSearchComponent;
    public productComponent = ContractSearchComponent;
    public showErrorHeader: boolean = true;
    public CurrentContractType: string;
    public CurrentContractTypeLabel: string;
    public blnAllTypesValid: string = ''; // this comes from parent screen
    public showCloseButton: boolean = true;
    public title: string;
    public Numberlab: string = 'Number';
    public generalMaintenanceFormGroup: FormGroup;
    public AddContractButton: boolean = false;
    public AddJobButton: boolean = false;
    public AddProductSaleButton: boolean = false;
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public ErrorMessageDesc: string;
    public ContractTypeDesc: string;
    public headerParams: any = {
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAPortfolioGeneralMaintenance',
        module: 'contract-admin'
    };
    public backLinkText: string;
    public search: URLSearchParams = new URLSearchParams();
    public searchname: URLSearchParams = new URLSearchParams();
    public searchtype: URLSearchParams = new URLSearchParams();
    public TaskReference: string;
    public errorMessage: string;
    public errorSubscription: string;
    public strNameValue: string;
    public messageSubscription;
    public strParamList: string;
    public ContractNumberSetAttributeServiceCoverRowID: string;
    constructor(
        private PostCodeUtils: PostCodeUtils,
        private utils: Utils,
        private fb: FormBuilder,
        private router: Router,
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private zone: NgZone,
        private global: GlobalConstant,
        private ajaxconstant: AjaxObservableConstant,
        private authService: AuthService,
        private _fb: FormBuilder,
        private _logger: Logger,
        private errorService: ErrorService,
        private messageService: MessageService,
        private titleService: Title,
        private componentInteractionService: ComponentInteractionService,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private store: Store<any>,
        private sysCharConstants: SysCharConstants,
        private _router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private routeAwayGlobals: RouteAwayGlobals
    ) {
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
    }
    private sub: Subscription;
    private routeParams: any;
    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.AddContractButton = false;
        this.AddJobButton = false;
        this.AddProductSaleButton = false;
        this.blnAllTypesValid = '';
        this.CurrentContractTypeURLParameter = '';
        this.CurrentContractTypeURLParameter = this.routeParams.CurrentContractTypeURLParameter;
        this.blnAllTypesValid = this.routeParams.blnAllTypesValid;
        this.localeTranslateService.setUpTranslation();
        this.CurrentContractType = this.utils.getCurrentContractType(this.CurrentContractTypeURLParameter);
        this._logger.warn(this.CurrentContractTypeURLParameter + '``' + this.CurrentContractType);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType);
        this.generalMaintenanceFormGroup = this.fb.group({
            ContractNumber: ['', Validators.required],
            PremiseNumber: [''],
            ProductCode: [''],
            ContractName: [''],
            PremiseName: [''],
            ProductDesc: ['']

        });
        if (this.CurrentContractTypeURLParameter === undefined || this.CurrentContractTypeURLParameter === null || this.CurrentContractTypeURLParameter === '') {
            this.AddContractButton = false;
            this.blnAllTypesValid = 'TRUE';
        }
        if (this.blnAllTypesValid === 'TRUE') {
            this.title = 'Portfolio General';
            this.inputParamsContract = {
                'parentMode': 'LookUp-All'
            };

        }
        else {
            this.inputParamsContract = {
                'parentMode': 'LookUp',
                'currentContractType': this.CurrentContractTypeURLParameter
            };
            if (this.CurrentContractType === 'C') {
                this.AddContractButton = true;
            }
            if (this.CurrentContractType === 'J') {
                this.AddJobButton = true;
            }
            if (this.CurrentContractType === 'P') {
                this.AddProductSaleButton = true;
            }
            this.Numberlab = this.CurrentContractTypeLabel + ' ' + 'Number';
            this.title = this.CurrentContractTypeLabel;
        }

        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.zone.run(() => {
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.routeAwayUpdateSaveFlag(); //CR implementation
        //Below Code block is present in .htm file (may be used in future)

        // this.search = new URLSearchParams();
        // this.search.set(this.serviceConstants.Action, '0');
        // this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        // this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        // this.search.set('Function', 'GetTaskReference');
        // this.ajaxSource.next(this.ajaxconstant.START);
        // this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
        //     this.headerParams.operation, this.search)
        //     .subscribe(
        //     (e) => {
        //         if (e.errorMessage) {
        //             this.errorService.emitError(e);
        //         } else {
        //             this.TaskReference = e.TaskRef;
        //         }
        //         this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        //     },
        //     (error) => {
        //         this.errorMessage = error as any;
        //         this.errorService.emitError(error);
        //         this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        //     });
    }
    public onContractDataReceived(data: any): void {
        this.flag = '';
        this.generalMaintenanceFormGroup.controls['ContractNumber'].setValue(data.ContractNumber);
        this.generalMaintenanceFormGroup.controls['ContractName'].setValue(data.ContractName);
        this.formContractNumber.nativeElement.focus();
    }
    public onpremiseChanged(data: any): void {
        this.generalMaintenanceFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.generalMaintenanceFormGroup.controls['PremiseName'].setValue(data.PremiseName);
    }
    public onproductChanged(data: any): void {
        this.generalMaintenanceFormGroup.controls['ProductCode'].setValue(data.ProductCode);
        this.generalMaintenanceFormGroup.controls['ProductDesc'].setValue(data.ProductDesc);
    }
    public ContractNumberFormatOnChange(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }
    public onBlurContract(event: any): void {
        this.flag = '';
        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            let _paddedValue = this.ContractNumberFormatOnChange(elementValue, 8);
            if (event.target.id === 'ContractNumber') {
                this.generalMaintenanceFormGroup.controls['ContractNumber'].setValue(_paddedValue);
            }
        }
        this.GetName('getContractName');
        this.CheckContractType();
    }
    public onBlurPremise(event: any): void {
        this.GetName('getPremiseName');
    }
    public onBlurProduct(event: any): void {
        this.GetName('getProductDesc');
    }
    public AddMode(ModeType: string): void {
        this.Clear_OnClick();
        switch (ModeType) {
            case 'C':
                this.strParam = '<pgm>';
                this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: { strParam: this.strParam, parentMode: 'SearchAdd', ReDirectOnCancel: true } });
                break;
            case 'J':
                this.strParam = '<job-pgm>';
                this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: { strParam: this.strParam, parentMode: 'SearchAdd', ReDirectOnCancel: true } });
                break;
            case 'P':
                this.strParam = '<product-pgm>';
                this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: { strParam: this.strParam, parentMode: 'SearchAdd', ReDirectOnCancel: true } });
                break;
            default:

        }
    }
    public AddContract_OnClick(): void {
        this.AddMode('C');
    }
    public AddJob_OnClick(): void {
        this.AddMode('J');
    }
    public AddProductSale_OnClick(): void {
        this.AddMode('P');
    }
    public Clear_OnClick(): void {
        this.generalMaintenanceFormGroup.controls['ContractNumber'].setValue('');
        this.generalMaintenanceFormGroup.controls['ContractName'].setValue('');
        this.generalMaintenanceFormGroup.controls['PremiseNumber'].setValue('');
        this.generalMaintenanceFormGroup.controls['PremiseName'].setValue('');
        this.generalMaintenanceFormGroup.controls['ProductCode'].setValue('');
        this.generalMaintenanceFormGroup.controls['ProductDesc'].setValue('');
        this.ContractNumberSetAttributeServiceCoverRowID = '';
        this.formContractNumber.nativeElement.focus();
    }
    public CheckCorrectEntryType(event: any): string {
        if (this.blnAllTypesValid !== 'TRUE' && this.strSelectedContractTypeCode !== this.CurrentContractType) {
            switch (this.strSelectedContractTypeCode) {
                case 'C':
                    this.strIncorrectType = 'Contract';
                    break;
                case 'J':
                    this.strIncorrectType = 'Job';
                    break;
                case 'P':
                    this.strIncorrectType = 'Product Sale';
                    break;
                default:
            }
            this.promptContent = 'You are in' + ' ' + this.CurrentContractTypeLabel + ' ' + 'General Maintenance But Have Selected A' + ' ' + this.strIncorrectType + '- Do you wish to continue ?';
            if (this.flag === 'fetch')
                this.promptModal.show();
            if (event.value === 'save') {
                this.varCheckCorrectEntryType = '';
                this.eventvalue = 'save';
                this.Fetch_OnClick();
            }
            if (event.value === 'cancel') {
                this.varCheckCorrectEntryType = 'ERROR';
                this.eventvalue = 'cancel';
            }
            this._logger.warn('varCheckCorrectEntryType + this.eventvalue ', this.varCheckCorrectEntryType.toString() + this.eventvalue);
            return this.varCheckCorrectEntryType;
        }
    }


    public CheckContractType(): string {
        this.searchtype = new URLSearchParams();
        this.searchtype.set(this.serviceConstants.Action, '0');
        this.searchtype.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.searchtype.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.searchtype.set('ContractNumber', this.generalMaintenanceFormGroup.controls['ContractNumber'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.searchtype)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                    this.strParamList = 'ERROR';
                    this.varCheckContractType = this.strParamList;
                    return this.varCheckContractType;
                } else {
                    if (e) {
                        this.zone.run(() => {
                            this.strSelectedContractTypeCode = e.ContractTypeCode;
                            this.CheckCorrectEntryType(this.strSelectedContractTypeCode);
                            this._logger.warn('dfdfsdfdf', e);
                            this.ContractTypeDesc = e.ContractTypeDesc;
                            this.ErrorMessageDesc = e.ErrorMessageDesc;
                            switch (this.strSelectedContractTypeCode) {
                                case 'C':
                                    this.strParamList = '<pgm>';
                                    break;
                                case 'J':
                                    this.strParamList = '<job-pgm>';
                                    break;
                                case 'P':
                                    this.strParamList = '<product-pgm>';
                                    break;
                                default:
                            }
                            this.CheckCorrectEntryType(this.strSelectedContractTypeCode);
                            this.varCheckContractType = this.strParamList;
                            return this.varCheckContractType;
                        });
                    }
                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        return this.varCheckContractType;
    }
    public GetName(GeneralEntryMode: string): string {
        this.searchname = new URLSearchParams();
        this.searchname.set(this.serviceConstants.Action, '0');
        this.searchname.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.searchname.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.searchname.set('GeneralEntryMode', GeneralEntryMode);
        this.searchname.set('ContractNumber', this.generalMaintenanceFormGroup.controls['ContractNumber'].value);
        this.searchname.set('PremiseNumber', this.generalMaintenanceFormGroup.controls['PremiseNumber'].value);
        this.searchname.set('ProductCode', this.generalMaintenanceFormGroup.controls['ProductCode'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.searchname)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    this.strNameValue = e.NameValue;
                    if (GeneralEntryMode === 'getContractName' && this.generalMaintenanceFormGroup.controls['ContractNumber'].value != null) {
                        this.generalMaintenanceFormGroup.controls['ContractName'].setValue(this.strNameValue);
                    }
                    if (GeneralEntryMode === 'getPremiseName' && this.generalMaintenanceFormGroup.controls['PremiseNumber'].value != null) {
                        this.generalMaintenanceFormGroup.controls['PremiseName'].setValue(this.strNameValue);
                    }
                    if (GeneralEntryMode === 'getProductDesc' && this.generalMaintenanceFormGroup.controls['ProductCode'].value != null) {
                        this.generalMaintenanceFormGroup.controls['ProductDesc'].setValue(this.strNameValue);
                    }
                    return this.strNameValue;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        return this.strNameValue;
    }
    public Fetch_OnClick(): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        //let postcodedefault: any = this.PostCodeUtils.PostCodeList().subscribe(res => { postcodedefault = res; });
        this.flag = 'fetch';
        this.CheckContractType();
        let strParamfetch = this.varCheckContractType;
        this.CheckCorrectEntryType('');
        let strCheck = this.varCheckCorrectEntryType;
        this._logger.warn(strParamfetch + ' + ' + strCheck);
        if (strParamfetch !== 'ERROR' && strCheck !== 'ERROR') {
            if (this.eventvalue === 'save' && this.blnAllTypesValid !== 'TRUE') {
                if (this.generalMaintenanceFormGroup.controls['ProductCode'].value !== null && this.generalMaintenanceFormGroup.controls['ProductCode'].value !== undefined && this.generalMaintenanceFormGroup.controls['ProductCode'].value !== '') {
                    if (this.ContractNumberSetAttributeServiceCoverRowID === '' || this.ContractNumberSetAttributeServiceCoverRowID === undefined || this.ContractNumberSetAttributeServiceCoverRowID === null) {
                        this._router.navigate(['Application/iCABSAServiceCoverSearch.htm'], { queryParams: { strMode: 'PortfolioGeneralMaintenance' } });

                    }
                    else {
                        this._router.navigate(['Application/iCABSAServiceCoverMaintenance.htm'], { queryParams: { strMode: 'Search', strParam: strParamfetch } });

                    }
                }
                else if (this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== null && this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== undefined && this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== '') {
                    this._router.navigate(['Application/iCABSAPremiseMaintenance.htm'], { queryParams: { strMode: 'LoadByKeyFields', strParam: strParamfetch } });

                }
                else if ((!this.generalMaintenanceFormGroup.controls['PremiseNumber'].value) && (strParamfetch !== '' && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== null && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== undefined && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== '')) {
                    if (strParamfetch === '<pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                    if (strParamfetch === '<job-pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                    if (strParamfetch === '<product-pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                }
            }

            if (this.blnAllTypesValid === 'TRUE') {
                if (this.generalMaintenanceFormGroup.controls['ProductCode'].value !== null && this.generalMaintenanceFormGroup.controls['ProductCode'].value !== undefined && this.generalMaintenanceFormGroup.controls['ProductCode'].value !== '') {
                    if (this.ContractNumberSetAttributeServiceCoverRowID === '' || this.ContractNumberSetAttributeServiceCoverRowID === undefined || this.ContractNumberSetAttributeServiceCoverRowID === null) {
                        this._router.navigate(['Application/iCABSAServiceCoverSearch.htm'], { queryParams: { strMode: 'PortfolioGeneralMaintenance' } });

                    }
                    else {
                        this._router.navigate(['Application/iCABSAServiceCoverMaintenance.htm'], { queryParams: { strMode: 'Search', strParam: strParamfetch } });

                    }
                }
                else if (this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== null && this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== undefined && this.generalMaintenanceFormGroup.controls['PremiseNumber'].value !== '') {
                    this._router.navigate(['Application/iCABSAPremiseMaintenance.htm'], { queryParams: { strMode: 'LoadByKeyFields', strParam: strParamfetch } });

                }
                else if ((!this.generalMaintenanceFormGroup.controls['PremiseNumber'].value) && (strParamfetch !== '' && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== null && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== undefined && this.generalMaintenanceFormGroup.controls['ContractNumber'].value !== '')) {
                    if (strParamfetch === '<pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                    if (strParamfetch === '<job-pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                    if (strParamfetch === '<product-pgm>')
                        this._router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], { queryParams: { strMode: 'LoadByKeyFields', parentMode: 'LoadByKeyFields', strParam: strParamfetch, ContractNumber: this.generalMaintenanceFormGroup.controls['ContractNumber'].value } });
                }
            }
        }
    }
    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    /*
    *   Alerts user when user is moving away without saving the changes.
    */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }
    public routeAwayUpdateSaveFlag(): void {
        this.generalMaintenanceFormGroup.statusChanges.subscribe((value: any) => {
            if (this.generalMaintenanceFormGroup.valid === true) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }
}
