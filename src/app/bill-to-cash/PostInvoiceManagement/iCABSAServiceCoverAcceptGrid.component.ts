import { InternalMaintenanceApplicationModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ValueVisitor } from '@angular/compiler/src/util';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { CentreReviewGridComponent } from './../../customer-contact-management/CustomerContact/iCABSCMCallCentreReviewGrid';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { URLSearchParams } from '@angular/http';
import { GridComponent } from './../../../shared/components/grid/grid';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ProductSearchGridComponent } from './../../internal/search/iCABSBProductSearch';
import { ProductServiceGroupSearchComponent } from './../../internal/search/iCABSBProductServiceGroupSearch.component';
@Component({
    templateUrl: 'iCABSAServiceCoverAcceptGrid.html'
})
export class ServiceCoverAcceptGridComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('setfocusContractNumber') public setfocusContractNumber;
    @ViewChild('serviceCoverAcceptGrid') serviceCoverAcceptGrid: GridComponent;
    @ViewChild('serviceCoverAcceptPagination') serviceCoverAcceptPagination: PaginationComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('ProductEllipsis') ProductEllipsis: EllipsisComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('ddProductServiceGroupSearch') ddProductServiceGroupSearch: ProductServiceGroupSearchComponent;
    //Page Variables
    public search: any = this.getURLSearchParamObject();
    public mandatoryField: any;
    public legend: Array<any> = [];
    public vbContractType: any;
    public totalRecords: number = 1;
    public sortType: string;
    public gridSortHeaders: Array<any>;
    public vbFunction: any;
    public showMessageHeader: boolean = true;
    public pageCurrent: number = 1;
    public promptTitle: string = 'Confirm';
    public promptContent: string;
    private contractType: string;
    public showErrorHeader: boolean = true;
    public DateFrom: Date = null;
    public datepickerdisable: boolean = true;
    public datepickerReqd: boolean = false;
    public FromdtDisplayed: string;
    public totalItems: number = 10;
    public ServiceCoverSearchComponent = ServiceCoverSearchComponent;
    public ProductSearchGridComponent = ProductSearchGridComponent; // TODO will be ProductSearchComponent component
    public ellipsisConfig = {
        contract: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
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
                'parentMode': 'LookUp',
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
                'parentMode': '',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'currentContractType': this.riExchange.getCurrentContractType()
            },
            component: null
        }
    };
    public dropdownConfig = {
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
        }
    };
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    /**
     * Grid variables
     */
    public maxColumn: number = 14;
    public currentPage: number = 1;
    public pageSize: number = 15;
    public pageId: string = '';
    public itemsPerPage: number = 10;
    // Page Controls
    public controls = [
        //Primary Section
        { name: 'ContractNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'FilterOn', readonly: false, disabled: false, required: false, value: 'All', type: MntConst.eTypeText },
        { name: 'ContractTypeFilter', readonly: false, disabled: false, required: false, value: 'C', type: MntConst.eTypeCode },
        { name: 'ProductServiceGroupCode', readonly: false, disabled: false, required: false, value: '', type: MntConst.eTypeCode },
        { name: 'ProductServiceGroupDesc', readonly: false, disabled: false, required: false },
        { name: 'FilterDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'DateFrom', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate }
    ];
    private headerParams: any = {
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        operation: 'Application/iCABSAServiceCoverAcceptGrid'
    };
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERACCEPTGRID;
        this.browserTitle = 'Retained Service Cover Acceptance';
    }
    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.loadData();
    }
    public fromDateSelectedValue(value: any): void {
        console.log('value', value);
        if (value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', value.value);
            //this.FromdtDisplayed = value.value;
        } else {
            //this.FromdtDisplayed = '';
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', '');
        }
        this.refresh();
    }
    public ngOnInit(): void {
        super.ngOnInit();
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = 10;
        this.contractType = this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.setfocusContractNumber.nativeElement.focus();
        this.pageParams.CurrentContractType = this.riExchange.setCurrentContractType();
        this.attributes.CurrentContractType = this.riExchange.setCurrentContractType();
        this.pageTitle = 'Retained Service Cover Acceptance';
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            this.ellipsisConfig.product.childConfigParams['parentMode'] = 'LookUp-FreqInvAccept';
            this.ellipsisConfig.product.component = ServiceCoverSearchComponent;
            this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.ellipsisConfig.product.childConfigParams['parentMode'] = 'TurnoverGrid';
            this.ellipsisConfig.product.component = this.ProductSearchGridComponent;
            this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
            this.ProductEllipsis.updateComponent();
        }
        this.FilterOn_onchange('All');
        this.BuildGrid();
        this.loadData();
        this.displayLegend();
    }
    public displayLegend(): any {
        this.legend = [];
        this.legend = [
            { color: '#CCFFCC', label: 'Accepted' }
        ];
    }
    public ngAfterViewInit(): void {
        this.ellipsisConfig.contract['currentContractType'] = this.riExchange.getCurrentContractType();
        this.ellipsisConfig.premise['currentContractType'] = this.riExchange.getCurrentContractType();
        this.ellipsisConfig.product['currentContractType'] = this.riExchange.getCurrentContractType();
        //this.ellipsisConfig.contract.autoOpen = true; //TODO
    }
    /**
     * Update Input Values after Ellipses search
     */
    public riMaintenance_Search(data: any, type: string): void {
        switch (type) {
            case 'contract':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                break;
            case 'premise':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.product.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
                break;
            case 'product':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.product.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
                break;
        }
    }
    private populateDescriptions(type: string): void {
        let postParams: any = {};
        let searchPostpopulate: any = this.getURLSearchParamObject();
        searchPostpopulate.set(this.serviceConstants.Action, '6');
        postParams.Function = 'SetDisplayFields';
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '') {
            postParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            postParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') !== '') {
            postParams.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchPostpopulate, postParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    if (type === 'contract') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
                    }
                    if (type === 'premise') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                    }
                    if (type === 'product') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    }
                    return;
                }
                this.riMaintenance_Search(data, type);
                this.loadData();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }
    public inputField_OnChange(e: any, name: any): void {
        if (name === 'contract' && e.target.value.length > 0) {
            let updateValue = this.utils.numberPadding(e.target.value, 8);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', updateValue);
            this.populateDescriptions(name);
        }
        if (name === 'contract' && e.target.value.length === 0) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
        if (name === 'premise') {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'LookUp-FreqInvAccept';
                this.ellipsisConfig.product.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'TurnoverGrid';
                this.ellipsisConfig.product.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
            this.populateDescriptions(name);
        }
        if (name === 'premise' && e.target.value.length === 0) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
        if (name === 'product') {
            this.populateDescriptions(name);
        }
        if (name === 'product' && e.target.value.length === 0) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        }
    }
    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.loadData();
    }

    public BuildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('ContractNumber', 'RetainAccept', 'ContractNumber', MntConst.eTypeCode, 11, true);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseNumber', 'RetainAccept', 'PremiseNumber', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseName', 'RetainAccept', 'PremiseName', MntConst.eTypeText, 14);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('Postcode', 'RetainAccept', 'Postcode', MntConst.eTypeCode, 8);
        this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);

        this.riGrid.AddColumn('ProductCode', 'RetainAccept', 'ProductCode', MntConst.eTypeCode, 10, true);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceVisitFrequency', 'RetainAccept', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ContractCommenceDate', 'RetainAccept', 'ContractCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ContractCommenceDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ProductServiceGroupCode', 'RetainAccept', 'ProductServiceGroupCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('ProductServiceGroupCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceDateStart', 'RetainAccept', 'ServiceDateStart', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceDateStart', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceCommenceDate', 'RetainAccept', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('InitialValue', 'RetainAccept', 'InitialValue', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('InitialValue', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('ServiceAnnualValue', 'RetainAccept', 'ServiceAnnualValue', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('ServiceAnnualValue', MntConst.eAlignmentRight);

        this.riGrid.AddColumn('InterCompanyPortfolioInd', 'RetainAccept', 'InterCompanyPortfolioInd', MntConst.eTypeImage, 3, false);

        this.riGrid.AddColumn('Accepted', 'RetainAccept', 'Accepted', MntConst.eTypeImage, 3, true);

        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('ContractCommenceDate', true);
        this.riGrid.AddColumnOrderable('ServiceCommenceDate', true);
        this.riGrid.AddColumnOrderable('ServiceDateStart', true);

        this.riGrid.Complete();

    }
    private loadData(): void {
        let search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        //set parameters
        search.set('BranchNumber', this.utils.getBranchCode());
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        search.set('FilterOn', this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterOn'));
        let formatteddateFrom: any = this.globalize.parseDateToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateFrom'));
        search.set('FilterDate', formatteddateFrom);
        if (this.vbFunction === 'Update') {
            search.set('Function', 'Update');
            search.set('ROWID', this.attributes.ContractNumber_ServiceCoverRowID);
        }
        else {
            search.set('Function', '');
        }
        this.ellipsisConfig.contract['currentContractType'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeFilter');
        this.ellipsisConfig.premise['currentContractType'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeFilter');
        this.ellipsisConfig.product['currentContractType'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeFilter');

        search.set('ContractTypeFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeFilter'));
        search.set('ProductServiceGroupCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductServiceGroupCode'));
        search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set('riSortOrder', this.riGrid.SortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.headerParams.search = search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.headerParams.search)
            .subscribe(
            (data) => {
                if (data) {
                    try {
                        if (data && data.errorMessage) {
                            this.messageModal.show(data, true);
                        } else {
                            this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                            this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;

                            if (this.riGrid.Update) {
                                this.riGrid.StartRow = this.riGrid.CurrentRow;
                                this.riGrid.StartColumn = 0;
                                this.riGrid.RowID = this.riGrid.Details.GetAttribute('ServiceCoverRowID', this.attributes.ContractNumber_ServiceCoverRowID);

                                this.riGrid.UpdateHeader = false;
                                this.riGrid.UpdateBody = true;
                                this.riGrid.UpdateFooter = true;
                                this.vbFunction = '';

                            }
                            this.riGrid.Execute(data);
                        }
                    } catch (e) {
                        this.logger.log('Problem in grid load', e);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            error => {
                this.messageModal.show(error, true);
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }
    public getGridInfo(info: any): void {
        this.serviceCoverAcceptPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    }
    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.riGrid.RefreshRequired();
        this.loadData();
    }
    public onContractDataReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
            this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'LookUp-FreqInvAccept';
                this.ellipsisConfig.product.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'TurnoverGrid';
                this.ellipsisConfig.product.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
        }
    }
    public onPremiseDataReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
            this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsisConfig.product.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
            this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'LookUp-FreqInvAccept';
                this.ellipsisConfig.product.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'TurnoverGrid';
                this.ellipsisConfig.product.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
        }
    }
    public onProductDataReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
        }
    }
    public FilterOn_onchange(data: any): void {
        if (data === 'All') {
            this.disableControl('DateFrom', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DateFrom', false);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', '');
            this.mandatoryField = false;
        }
        else {
            this.disableControl('DateFrom', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'DateFrom', true);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', this.utils.formatDate(new Date()));
            this.mandatoryField = true;
        }
    }
    public promptSave(data: any): void {
        this.promptContent = 'Are you sure you want to accept this Service Cover?';
        this.promptModal.show();
        if (data.value === 'save') {
            this.vbFunction = 'Update';
            this.riGrid.Update = true;
            this.loadData();
            if (this.vbContractType === 'J') {
                this.loadData();
            }
        }
    }
    public onGridRowClick(data: any): void {
        this.ServiceCoverFocus(data);
        if (this.riGrid.CurrentColumnName === 'ContractNumber') {
            this.ServiceCoverFocus(data);
            if (this.riGrid.Details.GetValue('ContractNumber').charAt(0) === 'J') {
                this.navigate('Accept', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                    'parentMode': 'Accept',
                    'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1]
                });
            }
            if (this.riGrid.Details.GetValue('ContractNumber').charAt(0) === 'C') {

                this.navigate('Accept', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    'parentMode': 'Accept',
                    'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1]
                });
            }
            if (this.riGrid.Details.GetValue('ContractNumber').charAt(0) === 'P') {
                this.navigate('Accept', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                    'parentMode': 'Accept',
                    'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1]
                });
            }
        }
        if (this.riGrid.CurrentColumnName === 'PremiseNumber') {
            this.ServiceCoverFocus(data);
            this.navigate('Accept', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                'parentMode': 'Accept',
                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'PremiseNumber': this.riGrid.Details.GetValue('PremiseNumber'),
                'PremiseRowID': this.attributes.ContractNumber_PremiseRowID,
                'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
            });
        }
        if (this.riGrid.CurrentColumnName === 'ProductCode') {
            this.ServiceCoverFocus(data);
            this.navigate('Accept', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                'parentMode': 'Accept',
                'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'currentContractType': this.riGrid.Details.GetValue('ContractNumber').charAt(0),
                'ServiceCoverRowID': this.attributes.ContractNumber_ServiceCoverRowID
            });
        }
        if (this.riGrid.CurrentColumnName === 'ContractCommenceDate') {
            this.ServiceCoverFocus(data);
            this.navigate('Accept', InternalMaintenanceSalesModuleRoutes.ICABSACONTRACTCOMMENCEDATEMAINTENANCEEX, {
                'parentMode': 'Accept',
                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                'ServiceVisitRowID': this.attributes.ContractNumber_ContractRowID,
                'CurrentContractType': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
            });
        }
        if (this.riGrid.CurrentColumnName === 'ServiceCommenceDate') {
            this.ServiceCoverFocus(data);
            this.navigate('Accept', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCEEX, {
                'parentMode': 'Accept',
                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'ServiceCoverRowID': this.attributes.ContractNumber_ServiceCoverRowID,
                'PremiseNumber': this.riGrid.Details.GetValue('PremiseNumber'),
                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                'ProductCode': this.riGrid.Details.GetValue('ProductCode')
            });
        }
    }
    public ServiceCoverFocus(data: any): void {
        this.attributes.ContractNumber_Row = this.riGrid.CurrentRow;
        this.attributes.ContractNumber_ContractRowID = this.riGrid.Details.GetAttribute('ContractNumber', 'rowID');
        this.attributes.ContractNumber_PremiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'rowID');
        this.attributes.ContractNumber_ServiceCoverRowID = this.riGrid.Details.GetAttribute('ProductCode', 'rowID');
        this.attributes.grdServiceCover_Row = this.riGrid.CurrentRow;
        this.attributes.grdServiceCover_ServiceCoverRowID = this.riGrid.Details.GetAttribute('ProductCode', 'rowID');
        this.vbContractType = this.riGrid.Details.GetAttribute('ContractNumber', 'additionalData');
        switch (this.vbContractType) {
            case 'C':
                this.pageParams.CurrentContractTypeURLParameter = '';
                this.attributes.CurrentContractTypeURLParameter = '';
                break;
            case 'J':
                this.pageParams.CurrentContractTypeURLParameter = '<job>';
                this.attributes.CurrentContractTypeURLParameter = '<job>';
                break;
            case 'P':
                this.pageParams.CurrentContractTypeURLParameter = '<product>';
                this.attributes.CurrentContractTypeURLParameter = '<product>';
                break;
        }
        this.ellipsisConfig.product.childConfigParams['currentContractTypeURLParameter'] = this.pageParams.CurrentContractTypeURLParameter;
        if (this.riGrid.CurrentColumnName === 'Accepted') {
            this.promptSave('');
        }
    }

     public onProductServiceGroupSearch(data: any): void {
        this.setControlValue('ProductServiceGroupCode', data.ProductServiceGroupCode);
    }
}

