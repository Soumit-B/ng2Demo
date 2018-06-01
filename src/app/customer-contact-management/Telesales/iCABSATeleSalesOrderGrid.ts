import { InternalGridSearchApplicationModuleRoutes } from './../../base/PageRoutes';
import { Component, OnInit, AfterViewInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { Http, URLSearchParams } from '@angular/http';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { OrderBy } from './../../../shared/pipes/orderBy';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
    templateUrl: 'iCABSATeleSalesOrderGrid.html'
})

export class TeleSalesOrderGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('teleSalesOrderGridPagination') teleSalesOrderGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('contractSearchComponent') contractSearchComponent;
    @ViewChild('premisesNumberEllipsis') premisesNumberEllipsis;
    @ViewChild('accountSearchEllipsis') accountSearchEllipsis;
    @ViewChild('telesalesOrderDropDown') telesalesOrderDropDown: DropdownStaticComponent;
    public pageId: string = '';
    public controls = [
        { name: 'ProspectNumber' },
        { name: 'ProspectName' },
        { name: 'TelesalesOrderNumber', type: MntConst.eTypeInteger },
        { name: 'TelesalesOrderName' },
        { name: 'TelesalesOrderLineNumber' },
        { name: 'TelesalesOrderStatusDesc' },
        { name: 'AccountNumber', type: MntConst.eTypeCode },
        { name: 'AccountName' },
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName' },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName' },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc' },
        { name: 'OrderFromDate' },
        { name: 'OrderToDate' },
        { name: 'TelesalesOrderStatus' },
        { name: 'PassTelesalesOrderNumber' },
        { name: 'TelesalesLevel' }];
    public orderFromDateDisp: any = '';
    public orderToDateDisp: any = '';
    public search: URLSearchParams = new URLSearchParams();
    private xhrParams = {
        module: 'telesales',
        method: 'ccm/grid',
        operation: 'Application/iCABSATeleSalesOrderGrid'
    };
    private orderBy: OrderBy;
    public pageSize: number = 10;
    public curPage: number = 1;
    public totalRecords: number;
    public isRequesting: boolean = false;
    public autoOpenSearch: boolean = false;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public isContractEllipsisDisabled: boolean = false;
    public accountSearchComponent = AccountSearchComponent;
    public lookUpSubscription: Subscription;
    public initialVal = [
        {
            text: 'All',
            value: ''
        }
    ];
    public teleSalesOrderArray: Array<any> = [];
    public inputParams: any = {
        parentMode: 'LookUp',
        showAddNew: false,
        ContractTypeCode: '',
        businessCode: this.businessCode(),
        countryCode: this.countryCode(),
        showAddNewDisplay: false,
        showCountryCode: false,
        showBusinessCode: false,
        searchValue: ''
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public ellipsis = {
        contractSearch: {
            disabled: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-All',
                currentContractType: this.riExchange.getCurrentContractType(),
                currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                showAddNew: false,
                contractNumber: '',
                showCountry: false,
                showBusiness: false,
                businessCode: this.businessCode(),
                countryCode: this.countryCode(),
                accountNumber: '',
                accountName: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            showHeader: true,
            showAddNew: false,
            autoOpenSearch: false,
            setFocus: false,
            contentComponent: ContractSearchComponent
        },
        premiseSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp',
                ContractNumber: '',
                ContractName: '',
                currentContractType: this.riExchange.getCurrentContractType(),
                currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                showAddNew: false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    constructor(injector: Injector, public titleService: Title) {
        super(injector);
        this.pageId = PageIdentifier.ICABSATELESALESORDERGRID;
        this.orderBy = injector.get(OrderBy);
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            if (this.getControlValue('OrderFromDate')) {
                let oFrom = this.getControlValue('OrderFromDate');
                //this.orderFromDateDisp = new Date(this.utils.convertDateString(oFrom));
                let getFromDate: any = this.globalize.parseDateToFixedFormat(oFrom);
                this.orderFromDateDisp = this.globalize.parseDateStringToDate(getFromDate);
            }
            if (this.getControlValue('OrderToDate')) {
                let oTo = this.getControlValue('OrderToDate');
                //this.orderToDateDisp = new Date(this.utils.convertDateString(oTo));
                let getToDate: any = this.globalize.parseDateToFixedFormat(oTo);
                this.orderToDateDisp = this.globalize.parseDateStringToDate(getToDate);
            }
            this.restorePageState();

        } else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        let strDocTitle = 'Telesales Order Details';
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            try {
                this.getTranslatedValue(strDocTitle, null).subscribe((res: string) => {
                    if (res) {
                        this.titleService.setTitle(res);
                    } else {
                        this.titleService.setTitle(strDocTitle);
                    }
                });
            } catch (e) {
                //
            }
        });
        if (this.isReturning()) {
            this.teleSalesOrderArray = this.pageParams.teleSalesArray;
            if (this.teleSalesOrderArray.length > 0) {
                let filterData = this.teleSalesOrderArray.filter(
                    o => o.value === this.getControlValue('TelesalesOrderStatus'));
                if (filterData.length > 0) {
                    this.pageParams.index = this.teleSalesOrderArray.indexOf(filterData[0]);
                    setTimeout(() => {
                        this.telesalesOrderDropDown.updateSelectedItem(this.pageParams.index);
                    }, 200);
                }
            }
        }
    }

    private restorePageState(): void {
        this.disableControl('TelesalesOrderName', true);
        this.disableControl('AccountName', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductDesc', true);
        this.disableControl('ProspectName', true);

        if (this.pageParams.parentMode === 'TelesalesOrderLine' || this.pageParams.parentMode === 'PlanVisit') {
            this.getTelesalesOrderDetails();
        } else if (this.pageParams.parentMode === 'StockRequest') {
            this.getTelesalesOrderDetails();
        }
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.FunctionUpdateSupport = false;
        this.ellipsis.contractSearch.childConfigParams.accountNumber = this.getControlValue('AccountNumber');
        this.ellipsis.contractSearch.childConfigParams.accountName = this.getControlValue('AccountName');
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.buildGrid();
        //  if (this.pageParams.lGridExecute) {
        this.riGrid_BeforeExecute();
        // }
    }

    private window_onload(): void {
        // let title = 'Telesales Order Details';
        // this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
        //     this.getTranslatedValue(title, null).subscribe((res: string) => {
        //         if (res) { title = res; }
        //         this.utils.setTitle(title);
        //     });
        // });
        this.pageParams.parentMode = this.parentMode;
        this.disableControl('TelesalesOrderName', true);
        this.disableControl('AccountName', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductDesc', true);
        this.disableControl('ProspectName', true);
        //Settings
        // this.pageParams.tdTelesalesOrderLabel = true
        // this.pageParams.tdTelesalesOrder = true;
        // this.pageParams.tdProspectNumberLabel = false;
        // this.pageParams.tdProspectNumber = false;
        // this.pageParams.trAccountNumber = true;
        // this.pageParams.trPremiseNumber = true;
        //Date fields required
        this.pageParams.lGridExecute = true;
        let fromDate = new Date();
        this.setControlValue('OrderFromDate', this.utils.addDays(fromDate, -30));
        this.orderFromDateDisp = new Date(this.utils.convertDate(this.getControlValue('OrderFromDate')));
        this.setControlValue('OrderToDate', this.utils.formatDate(new Date()));
        this.orderToDateDisp = new Date();
        if (this.parentMode === 'ProspectTeleSalesOrder') {
            this.pageParams.tdTelesalesOrderLabel = false;
            this.pageParams.tdTelesalesOrder = false;
            this.pageParams.tdProspectNumberLabel = true;
            this.pageParams.tdProspectNumber = true;
            this.pageParams.trAccountNumber = false;
            this.pageParams.trPremiseNumber = false;
            this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
            this.setControlValue('ProspectName', this.riExchange.getParentHTMLValue('PremiseName')); //???
        } else if (this.parentMode === 'ProductMaintenance') {
            this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
            this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        } else if (this.parentMode === 'TelesalesOrderLine' || this.parentMode === 'PlanVisit') {
            this.setControlValue('TelesalesOrderNumber', this.riExchange.getParentHTMLValue('TelesalesOrderNumber'));
            this.getTelesalesOrderDetails();
        } else if (this.parentMode === 'AccountTeleSalesOrder') {
            this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
            this.setControlValue('AccountName', this.riExchange.getParentHTMLValue('AccountName'));
        } else if (this.parentMode === 'ContractTeleSalesOrder') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        } else if (this.parentMode === 'PremiseTeleSalesOrder') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        } else if (this.parentMode === 'StockRequest') {
            this.setControlValue('TelesalesOrderNumber', this.riExchange.getParentAttributeValue('TelesalesOrderNumber'));
            this.getTelesalesOrderDetails();
        } else {
            this.pageParams.lGridExecute = false;
            this.pageParams.tdTelesalesOrderLabel = true;
            this.pageParams.tdTelesalesOrder = true;
            this.pageParams.tdProspectNumberLabel = false;
            this.pageParams.tdProspectNumber = false;
            this.pageParams.trAccountNumber = true;
            this.pageParams.trPremiseNumber = true;
            this.setControlValue('AccountNumber', '');
            this.setControlValue('ContractNumber', '');
            this.setControlValue('PremiseNumber', '0');
        }
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.FunctionUpdateSupport = false;
        this.buildGrid();
        if (this.pageParams.lGridExecute) {
            this.riGrid_BeforeExecute();
        }
        this.buildTeleSalesOrderDropdown();
    }

    public buildTeleSalesOrderDropdown(): void {
        let marketSegmentList = [];
        let marketSegmentLangList = [];
        let lookupMarketSegment = [
            {
                'table': 'TelesalesOrderStatus',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'TelesalesOrderStatusCode']
            },
            {
                'table': 'TelesalesOrderStatusLang ',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['BusinessCode', 'TelesalesOrderStatusCode', 'TelesalesOrderStatusDesc']
            }

        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupMarketSegment).subscribe((data) => {
            marketSegmentList = data[0];
            marketSegmentLangList = data[1];
            if (marketSegmentList.length > 0) {
                marketSegmentList.forEach(i => {
                    let MarketSegment_BusinessCode = i.BusinessCode;
                    let MarketSegment_MarketSegmentCode = i.TelesalesOrderStatusCode;
                    let MarketSegment_MarketSegmentDesc = i.TelesalesOrderStatusCode;
                    if (MarketSegment_MarketSegmentCode === 'PRODUCTC' || MarketSegment_MarketSegmentCode === 'PRODUCTD') {
                        //do nothing
                    } else {
                        let filterData = marketSegmentLangList.find(detailObj => (detailObj.TelesalesOrderStatusCode === i.TelesalesOrderStatusCode));
                        if (filterData) {
                            this.teleSalesOrderArray.push({
                                text: filterData.TelesalesOrderStatusDesc ? filterData.TelesalesOrderStatusDesc : MarketSegment_MarketSegmentDesc,
                                value: MarketSegment_MarketSegmentCode
                            });
                        } else {
                            this.teleSalesOrderArray.push({
                                text: MarketSegment_MarketSegmentDesc,
                                value: MarketSegment_MarketSegmentCode
                            });
                        }
                    }
                });
            }
            this.teleSalesOrderArray = this.orderBy.transform(this.teleSalesOrderArray, 'text');
            this.teleSalesOrderArray = this.initialVal.concat(this.teleSalesOrderArray);
            this.pageParams.teleSalesArray = this.teleSalesOrderArray;
        });
    }

    private getTelesalesOrderDetails(): void {
        this.pageParams.trAccountNumber = true;
        this.pageParams.tdTelesalesOrder = true;
        this.pageParams.tdTelesalesOrderLabel = true;
        this.pageParams.trPremiseNumber = true;
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetTelesalesOrderDetails';
        postParams.TelesalesOrderNumber = this.getControlValue('TelesalesOrderNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.messageModal.show(e, true);
                        this.setControlValue('AccountNumber', '');
                        this.setControlValue('AccountName', '');
                    } else {
                        if (e['AccountNumber'] !== '') {
                            this.setControlValue('AccountNumber', e.AccountNumber);
                        }
                        if (e['ContractNumber'] !== '') {
                            this.setControlValue('ContractNumber', e.ContractNumber);
                            if (e['PremiseNumber'] !== '0') {
                                this.setControlValue('PremiseNumber', e.PremiseNumber);
                            }
                        }
                        if (this.getControlValue('AccountNumber') !== '') {
                            this.getAccountName();
                        }
                        if (this.getControlValue('ContractNumber') !== '') {
                            this.getContractName();
                        }
                        if (this.getControlValue('PremiseNumber') !== '') {
                            this.getPremiseName();
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('OrderNo', 'TeleSalesOrder', 'OrderNo', MntConst.eTypeInteger, 10, false, '');
        this.riGrid.AddColumnOrderable('OrderNo', true, true);
        this.riGrid.AddColumnAlign('OrderNo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('Level', 'TeleSalesOrder', 'Level', MntConst.eTypeText, 40, false, '');
        this.riGrid.AddColumn('Key', 'TeleSalesOrder', 'Key', MntConst.eTypeText, 10, false, '');
        this.riGrid.AddColumnOrderable('Key', true, true);
        this.riGrid.AddColumnAlign('Key', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('Status', 'TeleSalesOrder', 'Status', MntConst.eTypeText, 10, false, '');
        this.riGrid.AddColumnAlign('Status', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('CommissionEmployee', 'TeleSalesOrder', 'CommissionEmployee', MntConst.eTypeText, 10, false, '');
        //  this.riGrid.AddColumnAlign('CommissionEmployee',MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('CommissionEmployee', true, true);
        this.riGrid.AddColumn('CreatedDate', 'TeleSalesOrder', 'CreatedDate', MntConst.eTypeDate, 10, false, '');
        this.riGrid.AddColumnAlign('CreatedDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('DeliveryDate', 'TeleSalesOrder', 'DeliveryDate', MntConst.eTypeDate, 10, false, '');
        this.riGrid.AddColumnAlign('DeliveryDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PORef', 'TeleSalesOrder', 'PORef', MntConst.eTypeText, 10, false, '');
        this.riGrid.AddColumn('NoLines', 'TeleSalesOrder', 'NoLines', MntConst.eTypeInteger, 10, false, '');
        this.riGrid.AddColumnAlign('NoLines', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('Stock', 'TeleSalesOrder', 'Stock', MntConst.eTypeImage, 1, true, '');
        this.riGrid.AddColumn('TotalValue', 'TeleSalesOrder', 'TotalValue', MntConst.eTypeDecimal2, 10, false, '');
        this.riGrid.Complete();
    }

    private riGrid_BeforeExecute(): void {

        this.riGrid.RefreshRequired();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        this.search.set('AccountNumber', this.getControlValue('AccountNumber'));
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('ProspectNumber', this.getControlValue('ProspectNumber'));
        this.search.set('OrderFromDate', this.getControlValue('OrderFromDate'));
        this.search.set('OrderToDate', this.getControlValue('OrderToDate'));
        this.search.set('ProductCode', this.getControlValue('ProductCode'));
        this.search.set('TelesalesOrderStatus', this.getControlValue('TelesalesOrderStatus'));
        this.search.set('TelesalesOrderNumber', this.getControlValue('TelesalesOrderNumber'));
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set('riSortOrder', sortOrder);
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data && data.errorMessage) {
                        this.messageModal.show(data, true);
                        this.totalRecords = 0;
                        this.riGrid.ResetGrid();
                    } else {
                        this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.Execute(data);
                    }
                }
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_AfterExecute(): void {
        if (this.riGrid.HTMLGridBody && this.riGrid.HTMLGridBody.children.length > 1) {
            if (this.riGrid.HTMLGridBody.children[0]) {
                if (this.riGrid.HTMLGridBody.children[0].children[0]) {
                    if (this.riGrid.HTMLGridBody.children[0].children[0].children[0]) {
                        if (this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]) {
                            this.gridFocus(this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]);
                        }
                    }
                }
            }
        }
    }

    private gridFocus(rsrcElement: any): void {
        // rsrcElement.focus();
        rsrcElement.select();
        this.setControlValue('PassTelesalesOrderNumber', rsrcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0].value);
        this.setControlValue('TelesalesLevel', rsrcElement.parentElement.parentElement.parentElement.children[1].innerText);
        if (rsrcElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].value.trim() !== '') {
            this.setAttribute('SearchValueRowID', rsrcElement.parentElement.parentElement.parentElement.children[2].children[0].children[0].getAttribute('rowid'));
        }
    }

    public tbody_onDblclick(event: any): void {
        let code;
        if (event.srcElement.tagName === 'INPUT' || event.srcElement.tagName === 'IMG') {
            switch (this.riGrid.CurrentColumnName) {
                case 'OrderNo':
                    this.gridFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
                    this.navigate(this.getControlValue('TelesalesLevel') + 'TeleSalesOrder', InternalGridSearchApplicationModuleRoutes.ICABSATELESALESORDERLINEGRID);//Application/iCABSATeleSalesOrderLineGrid.htm
                    break;
                case 'Key':
                    this.gridFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
                    if (this.getControlValue('TelesalesLevel') === 'Contract' || this.getControlValue('TelesalesLevel') === 'Premise') {
                        switch (this.riGrid.Details.GetAttribute('Key', 'AdditionalProperty')) {
                            case 'C':
                                this.pageParams.CurrentContractTypeURLParameter = 'C';
                                code = 'C';
                                break;
                            case 'J':
                                this.pageParams.CurrentContractTypeURLParameter = '<job>';
                                code = 'J';
                                break;
                            case 'P':
                                this.pageParams.CurrentContractTypeURLParameter = '<product>';
                                code = 'P';
                                break;
                        }
                    }
                    if (this.getControlValue('TelesalesLevel') === 'Account') {
                        this.navigate('GeneralSearch', this.ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE, {
                            'CurrentContractTypeURLParameter': code,
                            'AccountRowID': this.getAttribute('SearchValueRowID')
                        });//Application/iCABSAAccountMaintenance.htm
                    } else if (this.getControlValue('TelesalesLevel') === 'Contract') {
                        this.navigate('GeneralSearch', '/contractmanagement/maintenance/contract', {
                            'CurrentContractTypeURLParameter': code,
                            'ContractNumber': this.riGrid.Details.GetValue('Key')
                        });//Application/iCABSAContractMaintenance.htm
                    } else if (this.getControlValue('TelesalesLevel') === 'Premise') {
                        this.navigate('GeneralSearch', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                            'ContractTypeCode': code,
                            'PremiseRowID': this.getAttribute('SearchValueRowID')
                        });//Application/iCABSAPremiseMaintenance.htm
                    } else {
                        this.navigate('TelesalesSearch', '/prospecttocontract/maintenance/prospect', {
                            'CurrentContractTypeURLParameter': '<Prospect>',
                            'RowID': this.getAttribute('SearchValueRowID')
                        });//Application/iCABSCMPipelineProspectMaintenance.htm
                    }
                    break;
                case 'Stock':
                    this.gridFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
                    if (this.riGrid.Details.GetAttribute('Stock', 'AdditionalProperty') === 'Yes') {
                        alert('TelesalesOrderGrid is not yet ready');
                        // this.navigate('TelesalesOrderGrid', 'Application/iCABSAStockRequestGrid.htm');
                    }
                    break;
            }
        }
    }

    public menu_onchange(obj: any): void {
        switch (obj) {
            case 'ViewTelesalesOrderLine':
                this.navigate(this.parentMode, InternalGridSearchApplicationModuleRoutes.ICABSATELESALESORDERLINEGRID);//Application/iCABSATeleSalesOrderLineGrid.htm
                break;
        }
    }

    public cmdGenerateReport_onclick(): void {
        this.submitReportRequest();
    }

    private submitReportRequest(): void {
        let strURL;
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'Single';
        postParams.TelesalesOrderNumber = this.riGrid.HTMLGridBody ? this.riGrid.Details.GetValue('OrderNo') : '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.messageModal.show(e, true);
                    } else {
                        strURL = e.url;
                        window.open(strURL, '_blank');
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public accountNumber_onchange(obj: any): void {
        if (this.getControlValue('AccountNumber') === '') {
            this.setControlValue('AccountName', '');
            this.ellipsis.contractSearch.childConfigParams.accountNumber = '';
            this.ellipsis.contractSearch.childConfigParams.accountName = '';
        } else {
            this.riGrid.RefreshRequired();
            this.setControlValue('AccountNumber', this.utils.numberPadding(obj.value, 9));
            this.getAccountName();
        }
    }

    private getAccountName(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetAccountName';
        postParams.AccountNumber = this.getControlValue('AccountNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.messageModal.show(e, true);
                        this.setControlValue('AccountNumber', '');
                        this.setControlValue('AccountName', '');
                        this.ellipsis.contractSearch.childConfigParams.accountNumber = '';
                        this.ellipsis.contractSearch.childConfigParams.accountName = '';
                    } else {
                        this.setControlValue('AccountName', e.AccountName);
                        this.ellipsis.contractSearch.childConfigParams.accountNumber = this.getControlValue('AccountNumber');
                        this.ellipsis.contractSearch.childConfigParams.accountName = e.AccountName;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public accountNumber_ondeactivate(obj: any): void {
        if (this.getControlValue('AccountNumber') !== '') {
            this.setControlValue('AccountNumber', this.utils.numberPadding(obj.value, 9));
            this.getAccountName();
        }
    }

    public contractNumber_onchange(obj: any): void {
        if (this.getControlValue('ContractNumber') === '') {
            this.setControlValue('ContractName', '');
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = '';
            this.ellipsis.premiseSearch.childConfigParams.ContractName = '';
        } else {
            this.setControlValue('ContractNumber', this.utils.numberPadding(obj.value, 8));
            this.getContractName();
        }
    }

    public contractNumber_ondeactivate(obj: any): void {
        if (this.getControlValue('ContractNumber') !== '') {
            this.setControlValue('ContractNumber', this.utils.numberPadding(obj.value, 8));
            this.getContractName();
        }
    }

    private getContractName(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetContractName';
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.messageModal.show(e, true);
                        this.setControlValue('ContractName', '');
                        this.setControlValue('ContractNumber', '');
                        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = '';
                        this.ellipsis.premiseSearch.childConfigParams.ContractName = '';
                    } else {
                        this.setControlValue('ContractName', e.ContractName);
                        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                        this.ellipsis.premiseSearch.childConfigParams.ContractName = e.ContractName;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public premiseNumber_onchange(obj: any): void {
        if (this.getControlValue('PremiseNumber')) {
            this.getPremiseName();
        } else {
            this.setControlValue('PremiseName', '');
        }
    }

    public premiseNumber_ondeactivate(obj: any): void {
        if (this.getControlValue('PremiseNumber') !== '' && this.getControlValue('PremiseNumber') !== '0') {
            this.getPremiseName();
        }
    }

    private getPremiseName(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetPremiseName';
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.messageModal.show(e, true);
                        this.setControlValue('PremiseNumber', '');
                        this.setControlValue('PremiseName', '');
                    } else {
                        this.setControlValue('PremiseName', e.PremiseName);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public modalHidden(): void {
        //TODO:
    }

    //On account number ellipsis data return
    public onAccountDataReceived(data: any): void {
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('AccountName', data.AccountName);
        this.ellipsis.contractSearch.childConfigParams.accountNumber = data.AccountNumber;
        this.ellipsis.contractSearch.childConfigParams.accountName = data.AccountName;
    }

    // On contract number ellipsis data return
    public onContractDataReceived(data: any): void {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        //Diable/Enable fields
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.premiseSearch.childConfigParams.ContractName = data.ContractName;
    }

    // On premise number ellipsis data return
    public onPremiseDataReceived(data: any): void {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
        //Diable/Enable fields
    }

    /*Date picker string value change*/
    public dateRecieved(value: any, str: string): void {
        if (str === 'FromDate') {
            if (value && value.value) {
                this.setControlValue('OrderFromDate', value.value);
            } else {
                this.setControlValue('OrderFromDate', '');
            }
        }
        if (str === 'ToDate') {
            if (value && value.value) {
                this.setControlValue('OrderToDate', value.value);
            } else {
                this.setControlValue('OrderToDate', '');
            }
        }
    }

    //On Change of tele sales Select Drop Down
    public teleSalesOrderOnChange(obj: any): void {
        this.uiForm.controls['TelesalesOrderStatus'].setValue(obj);
        this.menu_onchange(this.getControlValue('TelesalesOrderStatus'));
    }

    public productCode_onChange(): void {
        if (this.getControlValue('ProductCode')) {
            this.setControlValue('ProductCode', this.getControlValue('ProductCode').toUpperCase());
        }
    }

}
