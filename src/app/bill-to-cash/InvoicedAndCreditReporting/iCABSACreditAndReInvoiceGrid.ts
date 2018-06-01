import { MessageConstant } from './../../../shared/constants/message.constant';
import { WSAETOOMANYREFS } from 'constants';
import { RiExchange } from './../../../shared/services/riExchange';
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
import { GlobalizeService } from '../../../shared/services/globalize.service';
import { MntConst } from '../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSACreditAndReInvoiceGrid.html',
    providers: [ErrorService, MessageService]
})
export class CreditAndReInvoiceGridComponent implements OnInit {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('creditReinvoiceGrid') creditReinvoiceGrid: GridComponent;
    @ViewChild('creditReinvoicePagination') creditReinvoicePagination: PaginationComponent;
    private CurrentColumnName: string = '';
    public InvoiceNumberAttributeProRataChargeRowID: string;
    // TODO : below variable name will change
    public CreditNarrativeValue: string = '';
    public InvoiceNumberAttributeRowID: string;
    public strFunction: string = '';
    public strGridData: any;
    public errorMessage: string;
    public strColumn: string;
    public vbUpdateRecord: string = '';
    public ContractNumberAttrSelectedDate: string;
    public vbUpdateVisitNarrative: string = '';
    public pageSize: number;
    public blnSCEnableCompanyCode: string;
    public currentPage: string;
    public totalRecords: number;
    public vSCEnableCompanyCode: boolean;
    public selectParams: any = {};
    public creditAndReInvoiceFormGroup: FormGroup;
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public ContractNumber: string;
    public PremiseNumber: string;
    public maxColumn: number;
    public showHeader: boolean = true;
    public ProductCode: string;
    public gridCurPage: number;
    public CurrentContractType: string;
    public CurrentContractTypeLabel: string;
    public action: string;
    public inputParams: any;
    public headerParams: any = {
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSACreditAndReInvoiceGrid',
        module: 'contract-admin'
    };
    public errorSubscription;
    public griddata: any;
    public lookupParams: URLSearchParams = new URLSearchParams();
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;
    public querySysChar: URLSearchParams = new URLSearchParams();
    public rowId = '';
    private routeParams: any;
    public validateProperties: Array<any> = [];
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
        private _logger: Logger,
        private errorService: ErrorService,
        private messageService: MessageService,
        private titleService: Title,
        private componentInteractionService: ComponentInteractionService,
        private translate: TranslateService,
        private localeTranslateService: LocaleTranslationService,
        private store: Store<any>,
        private sysCharConstants: SysCharConstants,
        private riExchange: RiExchange,
        private globalize: GlobalizeService
    ) {

    }
    private sub: Subscription;
    public search: URLSearchParams = new URLSearchParams();
    public getSearch: URLSearchParams = new URLSearchParams();
    public CurrentContractTypeURLParameter: string;
    public itemsPerPage: number;
    public messageSubscription;
    public fetchSysChar(vSCEnableCompanyCode: any): void {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, vSCEnableCompanyCode);
        this.httpService.sysCharRequest(this.querySysChar).subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError({
                        errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                    });
                } else {
                    if (e) {
                        this.vSCEnableCompanyCode = e.records[0].Required;
                        if (this.vSCEnableCompanyCode)
                            this.blnSCEnableCompanyCode = 'TRUE';
                        else
                            this.blnSCEnableCompanyCode = 'FALSE';
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
            'CompanyCode': this.routeParams.CompanyCode,
            'CompanyDesc': this.routeParams.CompanyDesc,
            'CompanyInvoiceNumber': this.routeParams.CompanyInvoiceNumber,
            'InvoiceNumber': this.routeParams.InvoiceNumber,
            'CreditReasonCode': this.routeParams.CreditReasonCode,
            'CreditReasonDesc': this.routeParams.CreditReasonDesc,
            'UseAddress': this.routeParams.UseAddress,
            'riGridMode': '0',
            'sortOrder': 'Descending'
        };

        this.localeTranslateService.setUpTranslation();
        this.CurrentContractType = this.utils.getCurrentContractType(this.CurrentContractTypeURLParameter);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType);
        let vSCEnableCompanyCode = this.sysCharConstants.SystemCharEnableCompanyCode.toString();
        this.fetchSysChar(vSCEnableCompanyCode);
        this.maxColumn = 9;
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.action = '2';
        this.pageSize = 15;
        this.creditAndReInvoiceFormGroup = this.fb.group({
            CompanyCode: [{ value: '', disabled: true }],
            CompanyDesc: [{ value: '', disabled: true }],
            CompanyInvoiceNumber: [{ value: '', disabled: true }],
            CreditReasonCode: [{ value: '', disabled: true }],
            CreditReasonDesc: [{ value: '', disabled: true }],
            InvoiceNumber: [{ value: '', disabled: true }],
            UseAddress: [{ value: '', disabled: true }]
        });
        this.creditAndReInvoiceFormGroup.controls['CompanyCode'].setValue(this.routeParams.CompanyCode);
        this.creditAndReInvoiceFormGroup.controls['CompanyDesc'].setValue(this.routeParams.CompanyDesc);
        this.creditAndReInvoiceFormGroup.controls['CompanyInvoiceNumber'].setValue(this.globalize.parseIntegerToFixedFormat(this.routeParams.CompanyInvoiceNumber));
        this.creditAndReInvoiceFormGroup.controls['InvoiceNumber'].setValue(this.globalize.parseIntegerToFixedFormat(this.routeParams.InvoiceNumber));
        this.creditAndReInvoiceFormGroup.controls['CreditReasonCode'].setValue(this.routeParams.CreditReasonCode);
        this.creditAndReInvoiceFormGroup.controls['CreditReasonDesc'].setValue(this.routeParams.CreditReasonDesc);
        this.creditAndReInvoiceFormGroup.controls['UseAddress'].setValue(this.routeParams.UseAddress);
        this.buildgrid();
        if (localStorage.getItem('navFromCreditReinvoiceToGrid')) {
            localStorage.setItem('navFromCreditReinvoiceToGrid', 'false');
        }
        this.validateProperties = [
            {
                'type': MntConst.eTypeInteger,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 3,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeTextFree,
                'index': 4,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDecimal2,
                'index': 5,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeDecimal2,
                'index': 6,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCode,
                'index': 7,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 8,
                'align': 'center'
            }
        ];
    }
    public getGridInfo(info: any): void {
        if (info && info.totalPages) {
            this.totalRecords = parseInt(info.totalPages, 0) * this.itemsPerPage;
        } else {
            this.totalRecords = 0;
        }
    }
    public getCurrentPage(data: any): void {
        this.gridCurPage = data.value;
        this.buildgrid();
    }
    public sortGrid(data: any): void {
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, data.fieldname);
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.buildgrid();
    }
    public buildgrid(): void {
        this.inputParams.module = this.headerParams.module;
        this.inputParams.method = this.headerParams.method;
        this.inputParams.operation = this.headerParams.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.gridCurPage.toString());
        this.search.set(this.serviceConstants.Action, this.action);
        this.search.set('InvoiceNumber', this.inputParams.InvoiceNumber);
        this.search.set('riSortOrder', this.inputParams.sortOrder);
        this.search.set('riCacheRefresh', this.inputParams.riCacheRefresh);
        this.search.set('riGridMode', this.inputParams.riGridMode);
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('HeaderClickedColumn', this.CurrentColumnName);
        this.inputParams.search = this.search;
        this.creditReinvoiceGrid.loadGridData(this.inputParams, this.rowId);
        this.rowId = '';
    }
    public refresh(): void {
        this.gridCurPage = 1;
        this.creditReinvoiceGrid.clearGridData();
        this.buildgrid();
    }
    public onGridRowClick(data: any): void {
        this.rowId = '';
        if (data.cellIndex === 0) {
            this.InvoiceNumberAttributeProRataChargeRowID = data.trRowData[8].rowID;
            this.InvoiceNumberAttributeRowID = data.cellData.rowID;
            this.rowId = data.cellData.rowID;
            this.CurrentColumnName = 'ItemNo';
            this.updateGrid(data);
        }
        if (data.cellIndex === 8) {
            this.InvoiceNumberAttributeProRataChargeRowID = data.cellData.rowID;
            let firstdata = this.creditReinvoiceGrid.getCellInfoForSelectedRow(data.rowIndex, 0);
            this.InvoiceNumberAttributeRowID = firstdata['rowID'];
            this.rowId = firstdata['rowID'];
            this.CurrentColumnName = 'Credit';
            this.updateGrid(data);
        }
    }
    public updateGrid(fulldata: any): void {
        if (this.InvoiceNumberAttributeProRataChargeRowID === '1') {
            this.strFunction = 'InvoiceDetailAddProRataCharge';
        }
        else {
            this.strFunction = 'InvoiceDetailDeleteProRataCharge';
        }
        let data = fulldata.rowData;
        let cellData = fulldata.cellData;
        this.inputParams.module = this.headerParams.module;
        this.inputParams.method = this.headerParams.method;
        this.inputParams.operation = this.headerParams.operation;
        this.getSearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.getSearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.getSearch.set(this.serviceConstants.Action, '6');
        this.getSearch.set('LanguageCode', this.riExchange.LanguageCode());
        this.getSearch.set('InvoiceNumber', this.inputParams.InvoiceNumber);
        this.getSearch.set('Function', this.strFunction);
        this.getSearch.set('InvoiceDetailRowID', this.InvoiceNumberAttributeRowID);
        this.getSearch.set('CreditNarrative', this.CreditNarrativeValue);
        this.getSearch.set('CreditReasonCode', this.creditAndReInvoiceFormGroup.controls['CreditReasonCode'].value);
        this.getSearch.set('UseAddress', this.creditAndReInvoiceFormGroup.controls['UseAddress'].value);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.getSearch)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    if (e) {
                        this.creditReinvoiceGrid.clearGridData();
                        this.creditReinvoiceGrid.loadGridData(this.inputParams);

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
}


