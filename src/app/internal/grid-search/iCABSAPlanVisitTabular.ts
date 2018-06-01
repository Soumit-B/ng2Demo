import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { PremiseLocationSearchComponent } from './../search/iCABSAPremiseLocationSearch.component';
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
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
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
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { Observable } from 'rxjs/Rx';
import { RiExchange } from './../../../shared/services/riExchange';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { GlobalizeService } from '../../../shared/services/globalize.service';

@Component({
    templateUrl: 'iCABSAPlanVisitTabular.html',
    providers: [ErrorService, MessageService]
})
export class PlanVisitTabularComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('BuildMenuOptions') BuildMenuOptions: DropdownStaticComponent;
    @ViewChild('planVisitGrid') planVisitGrid: GridComponent;
    @ViewChild('planVisitPagination') planVisitPagination: PaginationComponent;
    @ViewChild('LocationEllipsis') LocationEllipsis: EllipsisComponent;
    public pagecurrentgrid: any;
    private CurrentColumnName: string = '';
    public checkedarray: any = [];
    public WindowPath: string;
    public strGridData: any;
    public errorMessage: string;
    public strColumn: string;
    public vbUpdateRecord: string = '';
    public QtyMessage: string;
    public ContractNumberAttrSelectedDate: string;
    public vbUpdateVisitNarrative: string = '';
    public GenLabelsRowid: any = [];
    public vbPlanQuantity: string;
    public vbVisitNarrativeCode: string;
    public vbUpdateQty: string = '';
    public vbContinue: string;
    public pageSize: number;
    public vbEnableWED: string;
    public DisplayLabelsIcons: string;
    public PremiseLocationDesc: string;
    public PremiseLocationNumber: string;
    public currentPage: string;
    public totalRecords: number;
    public VisitNarrativeCodeSearchvalue: string;
    public vEnableWED: boolean;
    public grdPlanVisitAttrPlanVisitRowID: string;
    public grdPlanVisitAttrRow: string;
    public ContracNumberattrPlanVisitRowID: string;
    public selectParams: any = {};
    public planvisitFormGroup: FormGroup;
    public dtto: Date = new Date();
    public dtfrom: Date = new Date();
    public dispdtto: string;
    public dispdtfrom: string;
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public ContractNumber: string;
    public PremiseNumber: string;
    public maxColumn: number;
    public showHeader: boolean = true;
    public ProductCode: string;
    public ServiceCoverRowIDattrProdCode: string;
    public ServiceCoverRowIDattrProdCodeParent: string;
    public ServiceCoverRowIDattrbusinessCodeParent: string;
    public GetParentRowIDServiceCoverParent: string;
    public attrPremiseNumber: string;
    public attrPremiseName: string;
    public ServiceCoverRowIDattrbusinessCode: string;
    public ContractNumberServiceCoverRowID: string;
    public GetParentRowIDServiceCover: string;
    public gridCurPage: number;
    public CurrentContractType: string;
    public CurrentContractTypeLabel: string;
    private premiselocno = GroupAccountNumberComponent;
    public action: string;
    public inputParams: any;
    public trLocation: any = true;
    public inputParamspremiselocNumber: any = {
        'parentMode': 'LookUp',
        'businessCode': this.utils.getBusinessCode(),
        'countryCode': this.utils.getCountryCode(),
        'Action': '2'
    };
    public headerParams: any = {
        method: 'service-planning/maintenance',
        operation: 'Application/iCABSAPlanVisitTabular',
        module: 'plan-visits'
    };
    public errorSubscription;
    public griddata: any;
    public lookupParams: URLSearchParams = new URLSearchParams();
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public querySysChar: URLSearchParams = new URLSearchParams();
    public rowId = '';
    public validateProperties: Array<any> = [];
    public headerProperties: Array<any> = [];
    private routeParams: any;
    constructor(
        private route: ActivatedRoute,
        private utils: Utils,
        private fb: FormBuilder,
        private router: Router,
        private httpService: HttpService,
        private serviceConstants: ServiceConstants,
        private zone: NgZone,
        private global: GlobalConstant,
        private ajaxconstant: AjaxObservableConstant,
        private authService: AuthService,
        private logger: Logger,
        private errorService: ErrorService,
        private messageService: MessageService,
        private titleService: Title,
        private componentInteractionService: ComponentInteractionService,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private store: Store<any>,
        private sysCharConstants: SysCharConstants,
        private routeAwayGlobals: RouteAwayGlobals,
        private riExchange: RiExchange,
        private _router: Router,
        private globalize: GlobalizeService
    ) {

    }
    private sub: Subscription;
    public search: URLSearchParams = new URLSearchParams();
    public GetProductLabelFlagsearch: URLSearchParams = new URLSearchParams();
    public PremiseLocationNumber_onchangesearch: URLSearchParams = new URLSearchParams();
    public cmdPlanVisitGenLabels_onClicksearch: URLSearchParams = new URLSearchParams();

    public CurrentContractTypeURLParameter: string;
    public itemsPerPage: number;
    public messageSubscription;

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public defaultOpt: Object =
    {
        text: 'Options',
        value: ''
    };

    public MenuOptionList: Array<any> = [
        {
            text: 'Add Plan Visit',
            value: 'AddPlanVisit'
        }
    ];

    public ellipsisConfig = {
        premiseLocation: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            ContractNumber: '',
            ContractName: '',
            PremiseNumber: '',
            PremiseName: '',
            component: PremiseLocationSearchComponent
        }
    };

    public fetchSysChar(SYSTEMCHAR_EnableWED: any): void {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, SYSTEMCHAR_EnableWED);
        this.httpService.sysCharRequest(this.querySysChar).subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError({
                        errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                    });
                } else {
                    if (e) {
                        this.vEnableWED = e.records[0].Required;
                        if (this.vEnableWED)
                            this.vbEnableWED = 'TRUE';
                        else
                            this.vbEnableWED = 'FALSE';
                    }

                }
                this.calculateMaxColumn();
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.calculateMaxColumn();
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onbuildmenyOptionChange(event: any): void {
        if (this.BuildMenuOptions.selectedItem && this.BuildMenuOptions.selectedItem === 'AddPlanVisit') {
            let buildmenuoptionselected = this.BuildMenuOptions.selectedItem.toString();
        }
        this.ContractNumberAttrSelectedDate = '';
        this.ServiceCoverRowIDattrProdCode = this.ContractNumberServiceCoverRowID;

        if (this.BuildMenuOptions.selectedItem && this.BuildMenuOptions.selectedItem === 'AddPlanVisit') {
            alert('iCABSSePlanVisitMaintenance2.htm -- out of scope of this sprint');
            // this._router.navigate(['/maintenance/planvisit'], {
            //     queryParams: {
            //         'parentMode': 'SearchAdd',
            //         'currentContractTypeURLParameter': this.inputParams.CurrentContractTypeURLParameter,
            //         'ServiceCoverRowID': this.routeParams.ServiceCoverRowID,
            //         'PlanVisitRowID': this.routeParams.ServiceCoverRowID
            //     }
            // });
        }

    }

    ngAfterViewInit(): void {
        this.messageService.emitMessage(this.inputParams.parentMode);
    }

    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
        this.inputParams = {
            'businessCode': this.utils.getBusinessCode(),
            'countryCode': this.utils.getCountryCode(),
            'ContractNumber': this.routeParams.ContractNumber,
            'PremiseNumber': this.routeParams.PremiseNumber,
            'ProductCode': this.routeParams.ProductCode,
            'ServiceCoverNumber': '',
            'ServiceCoverContract': '',
            'parentMode': this.routeParams.parentMode,
            'sortOrder': 'Descending',
            'riCacheRefresh': 'True',
            'vbVisitNarrativeCode': '',
            'vbUpdateRecord': '',
            'vbUpdateVisitNarrative': '',
            'vbUpdateQty': '',
            'CurrentColumnName': '',
            'riGridMode': '0',
            'PremiseLocationNumber': '',
            'CurrentContractTypeURLParameter': this.routeParams.CurrentContractTypeURLParameter
        };
        this.GetParentRowIDServiceCoverParent = this.routeParams.ServiceCoverRowID;
        this.localeTranslateService.setUpTranslation();
        this.CurrentContractType = this.utils.getCurrentContractType(this.routeParams.CurrentContractTypeURLParameter);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType) + ' Number';
        this.dispdtfrom = this.formatDate(this.dtfrom);
        this.dispdtto = '';//this.formatDate(this.dtto);
        this.dtto = null;
        let SYSTEMCHAR_EnableWED = this.sysCharConstants.SystemCharEnableWED.toString();
        this.fetchSysChar(SYSTEMCHAR_EnableWED);
        this.maxColumn = 15;
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.action = '2';
        this.pageSize = 10;
        this.onbuildmenyOptionChange('');
        this.ContractNumber = this.inputParams.ContractNumber;
        this.PremiseNumber = this.inputParams.PremiseNumber;
        this.ProductCode = this.inputParams.ProductCode;
        this.PremiseLocationNumber = this.inputParams.PremiseLocationNumber;
        this.planvisitFormGroup = this.fb.group({
            ContractNumber: [this.ContractNumber],
            ContractName: [{ value: '', disabled: true }],
            PremiseNumber: [this.PremiseNumber],
            PremiseName: [{ value: '', disabled: true }],
            ProductCode: [this.ProductCode],
            ProductDesc: [{ value: '', disabled: true }],
            PremiseLocationNumber: [this.PremiseLocationNumber],
            PremiseLocationDesc: [{ value: '', disabled: true }]
        });
        this.routeAwayUpdateSaveFlag(); //CR Implementation
        if (this.routeParams.parentMode !== 'ServiceCover' &&
            this.routeParams.parentMode !== 'PlanVisitGridYear' &&
            this.routeParams.parentMode !== 'ServiceVisitMaintenance' &&
            this.routeParams.parentMode !== 'byServiceCoverRowID' &&
            this.routeParams.parentMode !== 'ServiceCoverAnnualCalendar') {
            this.messageService.emitMessage(0);
            this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
                if (data !== 0) {
                    this.zone.run(() => {
                        this.messageModal.show({ msg: 'Invalid Parent mode: ' + data, title: 'Error' }, false);
                    });
                }
            });
        }
        else {
            this.ServiceCoverLoad(this.inputParams.parentMode);
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
        this.ContractNumberServiceCoverRowID = '';
        let contractvalueData = [{
            'table': 'ServiceCover',
            'query': {
                'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value,
                'ProductCode': this.planvisitFormGroup.controls['ProductCode'].value,
                'PremiseNumber': this.globalize.parseIntegerToFixedFormat(this.planvisitFormGroup.controls['ProductCode'].value)


            },
            'fields': [
                'ContractNumber',
                'PremiseNumber',
                'ServiceCoverNumber',
                'ProductCode',
                'ServiceCoverRowID'
            ]
        },
        {
            'table': 'Contract',
            'query': {
                'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value

            },
            'fields': [
                'ContractNumber',
                'ContractName'
            ]
        },
        {
            'table': 'Premise',
            'query': {
                'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value,
                'PremiseNumber': this.globalize.parseIntegerToFixedFormat(this.planvisitFormGroup.controls['PremiseNumber'].value)

            },
            'fields': [
                'PremiseNumber',
                'PremiseName'

            ]
        },
        {
            'table': 'Product',
            'query': {
                'ProductCode': this.planvisitFormGroup.controls['ProductCode'].value

            },
            'fields': [
                'ProductCode',
                'ProductDesc'

            ]
        }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpRecord(contractvalueData, 1).subscribe(
            (e) => {
                let servicevalueDatafetched = e['results'];
                this.onDataReceived(servicevalueDatafetched);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
                this.errorService.emitError(error);
                this.planvisitFormGroup.controls['ContractNumber'].setValue('');

            });
        this.GetProductLabelFlag();
        this.validateProperties = [
            {
                'type': MntConst.eTypeText,
                'index': 0,
                'align': 'right',
                'readonly': true
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 3,
                'align': 'right',
                'maxlength': 4,
                'readonly': false
            },
            {
                'type': MntConst.eTypeText,
                'index': 12,
                'align': 'right',
                'maxlength': 10,
                'readonly': false
            }
        ];

        this.headerProperties = [
            {
                'width': '120px',
                'index': 3
            }
        ];
    }

    public ngOnDestroy(): void {
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    public GetProductLabelFlag(): void {
        this.GetProductLabelFlagsearch = new URLSearchParams();
        this.GetProductLabelFlagsearch.set(this.serviceConstants.Action, '0');
        this.GetProductLabelFlagsearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.GetProductLabelFlagsearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.GetProductLabelFlagsearch.set('Function', 'GetProductLabelFlag');
        this.GetProductLabelFlagsearch.set('ProductCode', this.planvisitFormGroup.controls['ProductCode'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.GetProductLabelFlagsearch)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    if (e.DisplayLabelsIcons) {
                        this.DisplayLabelsIcons = e.DisplayLabelsIcons;
                        this.calculateMaxColumn();
                        this.buildgrid();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.calculateMaxColumn();
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public cmdPlanVisitCancel_onClick(): void {
        if (((this.checkedarray.length) !== null) && ((this.checkedarray.length) > 0)) {
            alert('Goes to Application/iCABSAPlanVisitCancellationMaintenance.htm with ' + this.checkedarray.join(';'));
            //this._router.navigate(['Application/iCABSAPlanVisitCancellationMaintenance.htm'], { queryParams: { 'parentMode': 'Plan', 'checkedarray': this.checkedarray.join(';') } });
        }
        else {
            this.messageService.emitMessage(0);
            this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
                if (data === 0) {
                    this.zone.run(() => {
                        this.messageModal.show({ msg: 'No planned visits have been selected!', title: 'Error' }, false);
                    });
                }
            });


        }
    }

    private calculateMaxColumn(): void {
        this.maxColumn = 15;
        let addColumn: number = 4;
        let columnArray: Array<any> = [];
        columnArray = columnArray.concat([
            {
                'type': MntConst.eTypeDate,
                'index': 0,
                'align': 'right',
                'readonly': true
            },
            {
                'type': MntConst.eTypeText,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 2,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 3,
                'align': 'right',
                'maxlength': 4,
                'readonly': false
            }
        ]);
        if (this.vbEnableWED === 'TRUE') {
            this.planVisitGrid.clearGridData();
            this.maxColumn = this.maxColumn + 1;
            columnArray = columnArray.concat([{
                'type': MntConst.eTypeDecimal1,
                'index': addColumn,
                'align': 'center'
            }]);
            addColumn++;
        }
        columnArray = columnArray.concat([
            {
                'type': MntConst.eTypeText,
                'index': addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDate,
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
                'type': MntConst.eTypeText,
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
                'type': MntConst.eTypeText,
                'index': ++addColumn,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': ++addColumn,
                'align': 'right',
                'maxlength': 10,
                'readonly': false
            },
            {
                'type': MntConst.eTypeText,
                'index': ++addColumn,
                'align': 'right',
                'maxlength': 10,
                'readonly': false
            },
            {
                'type': MntConst.eTypeCheckBox,
                'index': ++addColumn,
                'align': 'center'
            }
        ]);
        if (this.DisplayLabelsIcons === 'Yes') {
            this.planVisitGrid.clearGridData();
            this.maxColumn = this.maxColumn + 2;
            columnArray = columnArray.concat([
                {
                    'type': MntConst.eTypeInteger,
                    'index': ++addColumn,
                    'align': 'center'
                },
                {
                    'type': MntConst.eTypeCheckBox,
                    'index': ++addColumn,
                    'align': 'center'
                }
            ]);

        }
        this.validateProperties = columnArray;
    }

    public cmdPlanVisitGenLabels_onClick(): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false); //CR implementation
        if (((this.GenLabelsRowid.length) !== null) && ((this.GenLabelsRowid.length) > 0)) {
            this.cmdPlanVisitGenLabels_onClicksearch = new URLSearchParams();
            this.cmdPlanVisitGenLabels_onClicksearch.set(this.serviceConstants.Action, '0');
            this.cmdPlanVisitGenLabels_onClicksearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.cmdPlanVisitGenLabels_onClicksearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.cmdPlanVisitGenLabels_onClicksearch.set('Function', 'PlanVisitGenerateLabels');
            this.cmdPlanVisitGenLabels_onClicksearch.set('ProductCode', this.planvisitFormGroup.controls['ProductCode'].value);
            this.cmdPlanVisitGenLabels_onClicksearch.set('GenLabelsRowid', this.GenLabelsRowid);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
                this.headerParams.operation, this.cmdPlanVisitGenLabels_onClicksearch)
                .subscribe(
                (e) => {
                    if (e.errorMessage) {
                        this.errorService.emitError(e);
                    } else {
                        this.QtyMessage = e.QtyMessage;
                        if (e.QtyMessage === 'Yes') {
                            this.messageService.emitMessage(0);
                            this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
                                if (data === 0) {
                                    this.zone.run(() => {
                                        this.messageModal.show({ msg: 'Labels have been created.  Please check those labels where the Planned Qty has been changed. ', title: 'Information' }, false);
                                    });
                                }
                            });

                        }
                        else {
                            this.messageService.emitMessage(0);
                            this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
                                if (data === 0) {
                                    this.zone.run(() => {
                                        this.messageModal.show({ msg: 'Labels have been created.', title: 'Information' }, false);
                                    });
                                }
                            });
                        }
                        this.GenLabelsRowid = '';
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorMessage = error as any;
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });

        }
        else {
            this.messageService.emitMessage(0);
            this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
                if (data === 0) {
                    this.zone.run(() => {
                        this.messageModal.show({ msg: 'No Planned Visits have been selected!', title: 'Information' }, false);
                    });
                }
            });
        }
    }

    public cmd_GridView_onclick(): void {
        if (this.inputParams.parentMode === 'PlanVisitGridYear') {
            this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR], {
                queryParams: {
                    'parentMode': 'PlanVisitTabular',
                    'CurrentContractTypeURLParameter': this.inputParams.CurrentContractTypeURLParameter,
                    'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value,
                    'PremiseNumber': this.globalize.parseIntegerToFixedFormat(this.planvisitFormGroup.controls['PremiseNumber'].value),
                    'ProductCode': this.planvisitFormGroup.controls['ProductCode'].value,
                    'ServiceCoverRowID': this.routeParams.ServiceCoverRowIDattrProdCodeParent,
                    'PlanVisitRowID': this.routeParams.ServiceCoverRowIDattrProdCodeParent
                }
            });
        }
        else {
            this.router.navigate([InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR], {
                queryParams: {
                    'parentMode': 'PlanVisitTabular',
                    'CurrentContractTypeURLParameter': this.inputParams.CurrentContractTypeURLParameter,
                    'ContractNumber': this.planvisitFormGroup.controls['ContractNumber'].value,
                    'PremiseNumber': this.globalize.parseIntegerToFixedFormat(this.planvisitFormGroup.controls['PremiseNumber'].value),
                    'ProductCode': this.planvisitFormGroup.controls['ProductCode'].value,
                    'ServiceCoverRowID': this.routeParams.ServiceCoverRowID,
                    'PlanVisitRowID': this.routeParams.ServiceCoverRowID
                }
            });

        }

    }

    public PremiseLocationNumber_onchange(): void {
        if (this.planvisitFormGroup.controls['ProductCode'].value !== null && this.planvisitFormGroup.controls['PremiseLocationNumber'].value !== '') {
            this.PremiseLocationNumber_onchangesearch = new URLSearchParams();
            this.PremiseLocationNumber_onchangesearch.set(this.serviceConstants.Action, '0');
            this.PremiseLocationNumber_onchangesearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.PremiseLocationNumber_onchangesearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.PremiseLocationNumber_onchangesearch.set('Function', 'GetLocationDesc');
            this.PremiseLocationNumber_onchangesearch.set('ProductCode', this.planvisitFormGroup.controls['ProductCode'].value);
            this.PremiseLocationNumber_onchangesearch.set('ContractNumber', this.planvisitFormGroup.controls['ContractNumber'].value);
            let formattedPremiseNo: any = this.globalize.parseIntegerToFixedFormat(this.planvisitFormGroup.controls['PremiseNumber'].value);
            this.PremiseLocationNumber_onchangesearch.set('PremiseNumber', formattedPremiseNo);
            this.PremiseLocationNumber_onchangesearch.set('PremiseLocationNumber', this.planvisitFormGroup.controls['PremiseLocationNumber'].value);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
                this.headerParams.operation, this.PremiseLocationNumber_onchangesearch)
                .subscribe(
                (e) => {
                    if (e.errorMessage) {
                        if (this.planvisitFormGroup.controls['PremiseLocationNumber'].value !== '') {
                            this.errorService.emitError(e);
                            if (!e.PremiseLocationDesc) {
                                this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationNumber', '');
                                this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationDesc', '');
                            }
                        }
                        else {
                            this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationNumber', '');
                            this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationDesc', '');
                        }
                    } else {
                        if (e.PremiseLocationDesc) {
                            this.PremiseLocationDesc = e.PremiseLocationDesc;
                            this.planvisitFormGroup.controls['PremiseLocationDesc'].setValue(this.PremiseLocationDesc);
                        }
                        else {
                            this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationNumber', '');
                            this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationDesc', '');
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorMessage = error as any;
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });

        }
        else {
            this.planvisitFormGroup.controls['PremiseLocationDesc'].setValue('');
        }
    }

    public ServiceCoverLoad(parentMode: string): void {
        if (parentMode === 'ServiceVisitMaintenance' || parentMode === 'ServiceCoverAnnualCalendar' || parentMode === 'PlanVisitGridYear') {
            this.ServiceCoverRowIDattrProdCodeParent = this.routeParams.ServiceCoverRowIDattrProdCodeParent;
            this.strGridData = { level: 'ServiceCoverYear', RowID: this.ServiceCoverRowIDattrProdCodeParent };
        }
        else if (parentMode === 'byServiceCoverRowID') {
            this.strGridData = { level: 'ServiceCoverYear', RowID: this.ServiceCoverRowIDattrbusinessCodeParent };
        }
        else {
            this.strGridData = { level: 'ServiceCoverYear', RowID: this.GetParentRowIDServiceCoverParent };

        }

        if (parentMode === 'ServiceVisitMaintenance' || parentMode === 'ServiceCoverAnnualCalendar') {
            this.ContractNumberServiceCoverRowID = this.ServiceCoverRowIDattrProdCodeParent;
        }
        else if (parentMode === 'byServiceCoverRowID') {
            this.ContractNumberServiceCoverRowID = this.ServiceCoverRowIDattrbusinessCodeParent;
        }
        else if (parentMode === 'ServiceCoverAnnualCalendar') {
            this.ContractNumberServiceCoverRowID = this.ServiceCoverRowIDattrProdCode;
            this.planvisitFormGroup.controls['PremiseNumber'].value = this.ServiceCoverRowIDattrProdCodeParent + this.attrPremiseNumber;
            this.planvisitFormGroup.controls['PremiseName'].value = this.ServiceCoverRowIDattrProdCodeParent + this.attrPremiseName;

        }
        else {
            this.ContractNumberServiceCoverRowID = this.GetParentRowIDServiceCoverParent;
        }

    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public getGridInfo(info: any): void {
        //this.planVisitPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
        if (info && info.totalPages) {
            this.totalRecords = parseInt(info.totalPages, 0) * this.itemsPerPage;
        } else {
            this.totalRecords = 0;
        }
        /*let objlist = document.querySelectorAll('.pagination ul.pagination > li.pagination-page');
        for (let n = 0; n < objlist.length; n++) {
            if (objlist[n]['innerText'] === this.gridCurPage.toString()) {
                this.utils.addClass(objlist[n], 'active');
                this.logger.warn(objlist[n]['innerText'], '````', objlist[n], this.gridCurPage, 'objgridCurPage');
            }
            else {
                this.utils.removeClass(objlist[n], 'active');
            }
        }*/
    }

    public getCurrentPage(data: any): void {
        if (this.pagecurrentgrid && this.pagecurrentgrid['flagcurrentpage'] === 'UpdateTrue') {
            this.pagecurrentgrid['flagcurrentpage'] = '';
            this.gridCurPage = Number(this.pagecurrentgrid['currentpageingrid']);
            this.search.set(this.serviceConstants.PageCurrent, String(this.gridCurPage));
            this.buildgrid();
        }
        else {
            this.gridCurPage = data.value;
            this.search.set(this.serviceConstants.PageCurrent, String(this.gridCurPage));
            this.buildgrid();
        }
        /*this.gridCurPage = data.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.gridCurPage));
        this.buildgrid();*/
    }

    public sortGrid(data: any): void {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.buildgrid();
    }

    public onCellClick(data: any): void {
        if (this.maxColumn === 15) {
            if (data.cellIndex === 3 || data.cellIndex === 12) {
                this.setupTableColumn(data.cellIndex, data.rowIndex);
                this.grdPlanVisitAttrPlanVisitRowID = data.cellData.additionalData;
                this.grdPlanVisitAttrRow = data.cellData.rowID;
            }
        }
        if (this.maxColumn === 17) {
            if (data.cellIndex === 3 || data.cellIndex === 12) {
                this.setupTableColumn(data.cellIndex, data.rowIndex);
                this.grdPlanVisitAttrPlanVisitRowID = data.cellData.additionalData;
                this.grdPlanVisitAttrRow = data.cellData.rowID;
            }
        }
        if (this.maxColumn === 16 || this.maxColumn === 18) {
            if (data.cellIndex === 3 || data.cellIndex === 13) {
                this.setupTableColumn(data.cellIndex, data.rowIndex);
                this.grdPlanVisitAttrPlanVisitRowID = data.cellData.additionalData;
                this.grdPlanVisitAttrRow = data.cellData.rowID;
            }
        }
    }

    public setupTableColumn(cellIndex: any, rowIndex: any): any {
        let colIndex = 1 + cellIndex;
        let obj = document.querySelectorAll('.gridtable tbody > tr > td:nth-child(' + colIndex + ') input[type=text]');
        if (obj.length > 0) {
            if (colIndex === 4) {
                if (obj[rowIndex])
                    obj[rowIndex].setAttribute('maxlength', '4');
            }
            else {
                if (obj[rowIndex])
                    obj[rowIndex].setAttribute('maxlength', '10');
            }
        }

    }

    public onCellClickBlur(data: any): void {
        let completRowData = data.trRowData;
        this.vbUpdateQty = 'Update';
        if (!completRowData) {
            return;
        }
        if (this.maxColumn === 15) {
            if (data.cellIndex === 12) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (completRowData) {
                    completRowData[12].text = data.keyCode.target.value.toUpperCase();
                }

                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }

            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }

            if (this.DisplayLabelsIcons === 'Yes') {
                let celldatacol3: string;
                let celldatacol15: string;
                if (data.cellIndex === 3) {
                    celldatacol3 = data.keyCode.target.value;
                }
                if (data.cellIndex === 15) {
                    celldatacol15 = data.keyCode.target.value;
                }
                if (celldatacol3 !== celldatacol15) {
                    this.messageService.emitMessage(0);
                    this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
                        if (data === 0) {
                            this.zone.run(() => {
                                this.messageModal.show({ msg: 'Planned Quantity has been modified. Please modify the labels accordingly', title: 'Information' }, false);
                            });
                        }
                    });
                }
            }
        }
        if (this.maxColumn === 17) {
            if (data.cellIndex === 12) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (completRowData) {
                    completRowData[12].text = data.keyCode.target.value.toUpperCase();
                }
                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }

            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }

            if (this.DisplayLabelsIcons === 'Yes') {
                let celldatacol3: string;
                let celldatacol15: string;
                if (data.cellIndex === 3) {
                    celldatacol3 = data.keyCode.target.value;
                }
                if (data.cellIndex === 15) {
                    celldatacol15 = data.keyCode.target.value;
                }
                if (celldatacol3 !== celldatacol15) {
                    this.messageService.emitMessage(0);
                    this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
                        if (data === 0) {
                            this.zone.run(() => {
                                this.messageModal.show({ msg: 'Planned Quantity has been modified. Please modify the labels accordingly', title: 'Information' }, false);
                            });
                        }
                    });
                }
            }
        }
        if (this.maxColumn === 17) {
            if (data.cellIndex === 12) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (completRowData) {
                    completRowData[12].text = data.keyCode.target.value.toUpperCase();
                }
                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }

            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }
        }
        if (this.maxColumn === 16) {
            if (data.cellIndex === 13) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                completRowData[13].text = data.keyCode.target.value.toUpperCase();
                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }

            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }
        }

        if (this.maxColumn === 18) {
            if (data.cellIndex === 13) {
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                completRowData[13].text = data.keyCode.target.value.toUpperCase();
                this.vbUpdateVisitNarrative = 'Update';
                this.updateGrid(data);
            }

            if (data.cellIndex === 3) {
                completRowData[3].text = data.keyCode.target.value;
                this.updateGrid(data);
            }


            if (this.DisplayLabelsIcons === 'Yes') {
                let celldatacol3: string;
                let celldatacol15: string;
                if (data.cellIndex === 3) {
                    celldatacol3 = data.keyCode.target.value;
                }

                if (celldatacol3 !== celldatacol15) {
                    this.messageService.emitMessage(0);
                    this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
                        if (data === 0) {
                            this.zone.run(() => {
                                this.messageModal.show({ msg: 'Planned Quantity has been modified. Please modify the labels accordingly', title: 'Information' }, false);
                            });
                        }
                    });
                }
            }
        }
    }

    public onCellKeyDown(data: any): void {
        if (this.maxColumn === 15) {
            this.vbUpdateRecord = 'Update';

            if (data.cellIndex === 3) {
                this.CurrentColumnName = 'PlanQuantity';
                this.vbUpdateQty = 'Update';
                if (data.keyCode.target.value)
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
            }

            if (data.cellIndex === 12) {
                this.CurrentColumnName = 'VisitNarrativeCd';
                this.vbUpdateVisitNarrative = 'Update';
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (data.keyCode.code === 'PageDown') {
                    data.keyCode.preventDefault();

                    // this._router.navigate(['Business/iCABSBVisitNarrativeSearch.htm'], {
                    //     queryParams: { 'parentMode': 'Search' }
                    // });
                    //VisitNarrativeCodeSearchvalue variable value comes from search screen
                    if ((data.keyCode.target.value !== this.VisitNarrativeCodeSearchvalue) || (data.cellData.text !== this.VisitNarrativeCodeSearchvalue)) {
                        data.keyCode.target.value = this.VisitNarrativeCodeSearchvalue;
                        data.cellData.text = data.keyCode.target.value;
                    }
                    if (data.cellData.text) {
                        this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                    }
                    else {
                        if (data.keyCode.target.value)
                            this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                        data.cellData.text = data.keyCode.target.value.toUpperCase();
                    }
                    this.vbUpdateVisitNarrative = 'Update';
                    this.buildgrid();
                    data.cellData.text = '';
                    this.vbVisitNarrativeCode = '';

                }
            }
        }
        if (this.maxColumn === 17) {
            this.vbUpdateRecord = 'Update';

            if (data.cellIndex === 3) {
                this.CurrentColumnName = 'PlanQuantity';
                this.vbUpdateQty = 'Update';
                if (data.keyCode.target.value)
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
            }

            if (data.cellIndex === 12) {
                this.CurrentColumnName = 'VisitNarrativeCd';
                this.vbUpdateVisitNarrative = 'Update';
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (data.keyCode.code === 'PageDown') {
                    data.keyCode.preventDefault();

                    // this._router.navigate(['Business/iCABSBVisitNarrativeSearch.htm'], {
                    //     queryParams: { 'parentMode': 'Search' }
                    // });
                    //VisitNarrativeCodeSearchvalue variable value comes from search screen
                    if ((data.keyCode.target.value !== this.VisitNarrativeCodeSearchvalue) || (data.cellData.text !== this.VisitNarrativeCodeSearchvalue)) {
                        data.keyCode.target.value = this.VisitNarrativeCodeSearchvalue;
                        data.cellData.text = data.keyCode.target.value;
                    }
                    if (data.cellData.text) {
                        this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                    }
                    else {
                        if (data.keyCode.target.value)
                            this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                        data.cellData.text = data.keyCode.target.value.toUpperCase();
                    }
                    this.vbUpdateVisitNarrative = 'Update';
                    this.buildgrid();
                    data.cellData.text = '';
                    this.vbVisitNarrativeCode = '';

                }
            }
        }
        if (this.maxColumn === 16 || this.maxColumn === 18) {
            this.vbUpdateRecord = 'Update';

            if (data.cellIndex === 3) {
                this.CurrentColumnName = 'PlanQuantity';
                this.vbUpdateQty = 'Update';
                if (data.keyCode.target.value)
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
            }



            if (data.cellIndex === 13) {
                this.CurrentColumnName = 'VisitNarrativeCd';
                this.vbUpdateVisitNarrative = 'Update';
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (data.keyCode.code === 'PageDown') {
                    data.keyCode.preventDefault();

                    // this._router.navigate(['Business/iCABSBVisitNarrativeSearch.htm'], {
                    //     queryParams: { 'parentMode': 'Search' }
                    // });
                    //VisitNarrativeCodeSearchvalue variable value comes from search screen
                    if ((data.keyCode.target.value !== this.VisitNarrativeCodeSearchvalue) || (data.cellData.text !== this.VisitNarrativeCodeSearchvalue)) {
                        data.keyCode.target.value = this.VisitNarrativeCodeSearchvalue;
                        data.cellData.text = data.keyCode.target.value;
                    }
                    if (data.cellData.text) {
                        this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                    }
                    else {
                        if (data.keyCode.target.value)
                            this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                        data.cellData.text = data.keyCode.target.value.toUpperCase();
                    }
                    this.vbUpdateVisitNarrative = 'Update';
                    this.buildgrid();
                    data.cellData.text = '';
                    this.vbVisitNarrativeCode = '';

                }
            }
        }
        if (this.maxColumn === 17) {
            this.vbUpdateRecord = 'Update';

            if (data.cellIndex === 3) {
                this.CurrentColumnName = 'PlanQuantity';
                this.vbUpdateQty = 'Update';
                if (data.keyCode.target.value)
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
            }



            if (data.cellIndex === 12) {
                this.CurrentColumnName = 'VisitNarrativeCd';
                this.vbUpdateVisitNarrative = 'Update';
                if (data.cellData.text) {
                    this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                }
                else {
                    if (data.keyCode.target.value)
                        this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                    data.cellData.text = data.keyCode.target.value.toUpperCase();
                }
                if (data.keyCode.code === 'PageDown') {
                    data.keyCode.preventDefault();

                    // this._router.navigate(['Business/iCABSBVisitNarrativeSearch.htm'], {
                    //     queryParams: { 'parentMode': 'Search' }
                    // });
                    //VisitNarrativeCodeSearchvalue variable value comes from search screen
                    if ((data.keyCode.target.value !== this.VisitNarrativeCodeSearchvalue) || (data.cellData.text !== this.VisitNarrativeCodeSearchvalue)) {
                        data.keyCode.target.value = this.VisitNarrativeCodeSearchvalue;
                        data.cellData.text = data.keyCode.target.value;
                    }
                    if (data.cellData.text) {
                        this.vbVisitNarrativeCode = data.cellData.text.toUpperCase();
                    }
                    else {
                        if (data.keyCode.target.value)
                            this.vbVisitNarrativeCode = data.keyCode.target.value.toUpperCase();
                        data.cellData.text = data.keyCode.target.value.toUpperCase();
                    }
                    this.vbUpdateVisitNarrative = 'Update';
                    this.buildgrid();
                    data.cellData.text = '';
                    this.vbVisitNarrativeCode = '';

                }
            }
        }
    }
    public onGridRowClick(data: any): void {
        let completRowData = data.trRowData;
        this.griddata = data;
        if (completRowData[0].text === data.cellData.text) {
            this.CurrentColumnName = 'PlanDate';
            this.ContracNumberattrPlanVisitRowID = data.cellData.additionalData;
            this._router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAPLANVISITMAINTENANCE], {
                queryParams: {
                    'parentMode': 'Year',
                    'currentContractTypeURLParameter': this.inputParams.CurrentContractTypeURLParameter,
                    'PlanVisitRowID': completRowData[0].additionalData
                }
            });
        }

        if (this.maxColumn === 17) {
            if (completRowData[15].text === data.cellData.text) {
                this.CurrentColumnName = 'NoOfLabels';
                this.ContracNumberattrPlanVisitRowID = data.cellData.additionalData;
                alert('Application/iCABSAPlanVisitLabels.htm not yet deployed');
                // this._router.navigate(['Application/iCABSAPlanVisitLabels.htm'], {
                //     queryParams: { 'parentMode': 'PlanVisitGrid', 'currentContractTypeURLParameter': this.inputParams.CurrentContractTypeURLParameter }
                // });
            }
        }
        if (this.maxColumn === 18) {
            if (completRowData[16].text === data.cellData.text) {
                this.CurrentColumnName = 'NoOfLabels';
                this.ContracNumberattrPlanVisitRowID = data.cellData.additionalData;
                alert('Application/iCABSAPlanVisitLabels.htm not yet deployed');
                // this._router.navigate(['Application/iCABSAPlanVisitLabels.htm'], {
                //     queryParams: { 'parentMode': 'PlanVisitGrid', 'currentContractTypeURLParameter': this.inputParams.CurrentContractTypeURLParameter }
                // });
            }
        }

    }

    public onChangeCheckBox(data: any): void {
        if (this.maxColumn === 15) {
            if (data.cellIndex === 14) {
                let cbIdx = this.checkedarray.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.checkedarray.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.checkedarray.splice(cbIdx, 1);
                }
                this.checkedarray.join(';');

            }
        }
        if (this.maxColumn === 16) {
            if (data.cellIndex === 15) {
                let cbIdx = this.checkedarray.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.checkedarray.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.checkedarray.splice(cbIdx, 1);
                }
                this.checkedarray.join(';');

            }
        }

        if (this.maxColumn === 18) {
            if (data.cellIndex === 15) {
                let cbIdx = this.checkedarray.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.checkedarray.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.checkedarray.splice(cbIdx, 1);
                }
                this.checkedarray.join(';');

            }
            if (data.cellIndex === 17) {
                let cbIdx = this.GenLabelsRowid.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.GenLabelsRowid.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.GenLabelsRowid.splice(cbIdx, 1);
                }
                if (this.GenLabelsRowid.length > 0) {
                    this.GenLabelsRowid.join(';');
                }


            }
        }

        if (this.maxColumn === 17) {
            if (data.cellIndex === 14) {
                let cbIdx = this.checkedarray.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.checkedarray.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.checkedarray.splice(cbIdx, 1);
                }
                this.checkedarray.join(';');

            }
            if (data.cellIndex === 16) {
                let cbIdx = this.GenLabelsRowid.indexOf(data.cellData.rowID);
                if (data.event.target.checked) {
                    if (cbIdx < 0)
                        this.GenLabelsRowid.push(data.cellData.rowID);
                }
                else {
                    if (cbIdx >= 0)
                        this.GenLabelsRowid.splice(cbIdx, 1);
                }
                if (this.GenLabelsRowid.length > 0) {
                    this.GenLabelsRowid.join(';');
                }

            }
        }
    }

    public fromDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.dispdtfrom = value.value;
        } else {
            this.dispdtfrom = '';
        }
    }
    public toDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.dispdtto = value.value;
        } else {
            this.dispdtto = '';
        }
    }

    public updateGrid(fulldata: any): void {
        let data = fulldata.rowData;
        let completRowData = fulldata.trRowData;
        let cellData = fulldata.cellData;
        this.inputParams.module = this.headerParams.module;
        this.inputParams.method = this.headerParams.method;
        this.inputParams.operation = this.headerParams.operation;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, this.action);
        let postParams: any = {};
        if (completRowData) {
            postParams.PlanDate = completRowData[0].text;
            postParams.PlanVisitType = completRowData[1].text;
            postParams.PlanStatus = completRowData[2].text;
            postParams.PlanQuantity = completRowData[3].text;
            postParams.PlanEmployee = completRowData[4].text;
            postParams.ActualVisitDate = completRowData[5].text;
            postParams.ActualQty = completRowData[6].text;
            postParams.ActualEmployee = completRowData[7].text;
            postParams.VisitNarrativeCd = completRowData[12].text;
            postParams.VisitNarrativeCode = completRowData[12].text;
            postParams.ServiceVisitText = completRowData[13].text;
            postParams.PlanVisitCancel = completRowData[14].text;
        }



        if (this.vbEnableWED === 'TRUE') {
            if (completRowData) {
                postParams.PlanEmployee = completRowData[5].text;
                postParams.ActualVisitDate = completRowData[6].text;
                postParams.ActualQty = completRowData[7].text;
                postParams.ActualEmployee = completRowData[8].text;
                postParams.VisitNarrativeCd = completRowData[13].text;
                postParams.VisitNarrativeCode = completRowData[13].text;
                postParams.ServiceVisitText = completRowData[14].text;
                postParams.PlanVisitCancel = completRowData[15].text;
            }
        }

        postParams.ServiceCoverItemNumberDesc = 0;
        postParams.PremiseLocNo = 0;
        postParams.ProductComponent = '';
        postParams.ProductComponentRem = '';
        postParams.level = this.strGridData.level;
        postParams.RowID = this.strGridData.RowID;
        postParams.PlanVisitFrom = this.globalize.parseDateToFixedFormat(this.dispdtfrom.toString());
        postParams.PlanVisitTo = this.globalize.parseDateToFixedFormat(this.dispdtto.toString());
        postParams.ProductCode = this.planvisitFormGroup.controls['ProductCode'].value;
        postParams.PremiseLocationNumber = this.planvisitFormGroup.controls['PremiseLocationNumber'].value;
        postParams.UpdateRecord = this.vbUpdateRecord;
        postParams.UpdateVisitNarrative = this.vbUpdateVisitNarrative;
        postParams.UpdateQty = this.vbUpdateQty;
        postParams.PlanVisitRowid = cellData.rowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.search, postParams)
            .subscribe(
            (e) => {

                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                    this.refresh();
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                        this.refresh();
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                        this.refresh();
                    } else {
                        this.planVisitGrid.clearGridData();
                        this.pagecurrentgrid = { currentpageingrid: this.gridCurPage.toString(), flagcurrentpage: 'UpdateTrue' };
                        this.buildgrid(postParams.VisitNarrativeCode, postParams.UpdateRecord, postParams.UpdateVisitNarrative, postParams.UpdateQty);
                        this.refresh();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                //this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public buildgrid(VisitNarrativeCode?: any, UpdateRecord?: any, UpdateVisitNarrative?: any, UpdateQty?: any): void {
        this.inputParams.module = this.headerParams.module;
        this.inputParams.method = this.headerParams.method;
        this.inputParams.operation = this.headerParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.Action, this.action);
        if (this.strGridData) {
            this.search.set('level', this.strGridData.level);
            this.search.set('RowID', this.strGridData.RowID);
        }
        let formatteddateFrom: any = this.globalize.parseDateToFixedFormat(this.dispdtfrom.toString());
        this.search.set('PlanVisitFrom', formatteddateFrom);
        let formatteddateTo: any = this.globalize.parseDateToFixedFormat(this.dispdtto.toString());
        this.search.set('PlanVisitTo', formatteddateTo);
        this.search.set('ProductCode', this.planvisitFormGroup.controls['ProductCode'].value);
        this.search.set('PremiseLocationNumber', this.planvisitFormGroup.controls['PremiseLocationNumber'].value);
        if (VisitNarrativeCode) {
            this.search.set('VisitNarrativeCode', VisitNarrativeCode);
        }
        else {
            this.search.set('VisitNarrativeCode', this.inputParams.vbVisitNarrativeCode);
        }
        if (UpdateRecord) {
            this.search.set('UpdateRecord', UpdateRecord);
        }
        else {
            this.search.set('UpdateRecord', this.inputParams.vbUpdateRecord);
        }
        if (UpdateVisitNarrative) {
            this.search.set('UpdateVisitNarrative', UpdateVisitNarrative);
        }
        else {
            this.search.set('UpdateVisitNarrative', this.inputParams.vbUpdateVisitNarrative);
        }
        if (UpdateQty) {
            this.search.set('UpdateQty', UpdateQty);
        }
        else {
            this.search.set('UpdateQty', this.inputParams.vbUpdateQty);
        }
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riCacheRefresh', this.inputParams.riCacheRefresh);
        this.search.set('riGridMode', this.inputParams.riGridMode);
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.inputParams.CurrentColumnName);
        this.inputParams.search = this.search;
        this.planVisitGrid.update = true;
        this.planVisitGrid.loadGridData(this.inputParams, this.rowId);
        this.rowId = '';

    }
    public flag: any = false;
    public refresh(): void {
        this.flag = true;
        this.planVisitGrid.clearGridData();
        this.buildgrid();
    }

    public lookUpRecord(data: any, maxresults: any): any {
        this.lookupParams.set(this.serviceConstants.Action, '0');
        this.lookupParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.lookupParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.lookupParams.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        if (data)
            return this.httpService.lookUpRequest(this.lookupParams, data);
    }

    public onDataReceived(data: any, route?: any): void {
        if (data) {
            if ((data[1])[0] !== undefined) {
                this.ContractNumberServiceCoverRowID = (data[1])[0].ttContract;
                this.planvisitFormGroup.controls['ContractName'].setValue((data[1])[0].ContractName);
            }
            if ((data[2])[0] !== undefined) {
                this.planvisitFormGroup.controls['PremiseName'].setValue((data[2])[0].PremiseName);
            }
            if ((data[3])[0] !== undefined) {
                this.planvisitFormGroup.controls['ProductDesc'].setValue((data[3])[0].ProductDesc);
            }
        }
    }

    public onPremiseLocation(data: any): void {

        this.PremiseLocationNumber = data.PremiseLocationNumber;
        this.PremiseLocationDesc = data.PremiseLocationDesc;
        this.PremiseLocationNumber_onchange();
        this.buildgrid();

    }

    public formatDate(date: Date): any {
        let d = new Date(date),
            day = '' + d.getDate(),
            month = '' + (d.getMonth() + 1),
            year = '' + d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    /*
    *   Alerts user when user is moving away without saving the changes.
    */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }

    public routeAwayUpdateSaveFlag(): void {
        this.planvisitFormGroup.statusChanges.subscribe((value: any) => {
            if (this.planvisitFormGroup.valid === true) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }

    public premiseLocationOnKeyDown(obj: any, call: boolean): void {
        if (call && obj) {
            if (obj.PremiseLocationNumber) {
                this.planvisitFormGroup.controls['PremiseLocationNumber'].setValue(obj.PremiseLocationNumber);
            }
            if (obj.PremiseLocationDesc) {
                this.planvisitFormGroup.controls['PremiseLocationDesc'].setValue(obj.PremiseLocationDesc);
            }
            if (!obj.PremiseLocationDesc) {
                this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationNumber', '');
                this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationDesc', '');
            }
        }
        else {
            this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationNumber', '');
            this.riExchange.riInputElement.SetValue(this.planvisitFormGroup, 'PremiseLocationDesc', '');
        }
    }
}

