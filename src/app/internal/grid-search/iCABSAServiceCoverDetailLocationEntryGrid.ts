import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { Component, OnInit, OnDestroy, ViewChild, Injector, Output, EventEmitter } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { ServiceCoverDetailsComponent } from '../search/iCABSAServiceCoverDetailSearch.component';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalGridSearchModuleRoutes, AppModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';

@Component({

    templateUrl: 'iCABSAServiceCoverDetailLocationEntryGrid.html'
})

export class ServiceCoverDetailLocationEntryGridComponent extends BaseComponent implements OnInit, OnDestroy {


    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: false },
        { name: 'ContractName', readonly: true, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
        { name: 'PremiseName', readonly: true, disabled: true, required: false },
        { name: 'ProductCode', readonly: true, disabled: true, required: false },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false },
        { name: 'ProductDetailCode', readonly: true, disabled: false, required: false },
        { name: 'ServiceCoverRowID', readonly: true, disabled: true, required: false },
        { name: 'ServiceCoverNumber', readonly: true, disabled: true, required: false },
        { name: 'CurrentServiceCoverRowID', readonly: true, disabled: true, required: false },
        { name: 'PremiseLocationNumber', readonly: true, disabled: true, required: false },
        { name: 'PremiseLocationDesc', readonly: true, disabled: true, required: false },
        { name: 'ProductDetailDesc', readonly: true, disabled: true, required: false }

    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERDETAILLOCATIONENTRYGRID;
        this.pageTitle = '';

    }

    @ViewChild('ServiceCoverDetailLocationEntryGrid') ServiceCoverDetailLocationEntryGrid: GridComponent;
    @ViewChild('ServiceCoverDetailLocationEntryGridPagination') ServiceCoverDetailLocationEntryGridPagination: PaginationComponent;
    @ViewChild('ServiceCoverDetailEllipsis') ServiceCoverDetailEllipsis: EllipsisComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('errorModal') public errorModal;

    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverDetailLocationEntryGrid',
        module: 'locations',
        method: 'service-delivery/grid'
    };

    //Variables
    public parentServiceCoverNumber: any;
    public parentProductDetailDesc: any;
    public vSCEnableDetailLocations: boolean = false;



    public legend = [
        { label: 'Empty Locations', color: '#CCFFCE' },
        { label: 'UNALLOCATED', color: '#FFCFCE' },
        { label: 'In Hold', color: '#FFFFCE' },
        { label: 'Located', color: '#DDDDDD' }
    ];
    private gridOperation: any = {
        vbUpdateRecord: '',
        vbPremiseLocationNumber: '',
        vbPremiseLocationSequence: '',
        vbPremiseLocationDesc: '',
        vbQuantityAtLocation: '',
        vbGridMode: '',
        vbUnallocQty: '',
        vbPremiseLocationSequenceRowID: '',
        vbPremiseLocationRowID: '',
        ServiceCoverDetailLocationRowID: '',
        vbComments: '',
        Update: false
    };

    //ellipsis data
    public inputParamsSearchExt: any = { 'parentMode': 'SearchExt', ServiceCoverRowID: '' };
    public dynamicComponent1 = ServiceCoverDetailsComponent;
    public showHeader: boolean = true;

    // Grid Component Variables
    public search: URLSearchParams = new URLSearchParams();
    public pageSize: number = 11;
    public itemsPerPage: number = 10;

    //New grid
    public inputParams: any = {};
    public pageCurrent: number = 1;
    public totalRecords: number = 1;

    public ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();

    }
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public window_onload(): void {
        this.riGrid.FunctionUpdateSupport = true;
        this.pageParams.parentMode = this.riExchange.getParentMode();
        switch (this.pageParams.parentMode) {
            case 'ProductDetail':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
                this.inputParamsSearchExt.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailCode', this.riExchange.getParentHTMLValue('ProductDetailCode1'));
                break;

            case 'ProductDetailSC':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CurrentServiceCoverRowID', this.riExchange.getParentHTMLValue('CurrentServiceCoverRowID'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', this.riExchange.getParentHTMLValue('CurrentServiceCoverRowID'));

                break;

        }
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        //get request
        this.fetchAllDetails();
        //calling buildgrid function
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableLocations];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCEnableDetailLocations = record[0]['Logical'];
            this.vSCEnableDetailLocations = this.pageParams.vSCEnableDetailLocations;
            this.window_onload();
        });
    }

    public fetchAllDetails(): void {
        let searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set('ServiceCoverRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID'));
        searchParams.set('Function', 'GetScDetails');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchParams)
            .subscribe(
            (data) => {
                //Get request
                this.parentServiceCoverNumber = data.ServiceCoverNumber;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', this.parentServiceCoverNumber);
                //calling post request gunction

                this.fetchDetails();

            });
    }

    public fetchDetails(): void {
        let searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set('ProductDetailCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode'));
        searchParams.set('Function', 'GetProductDetailDesc');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchParams)
            .subscribe(
            (data) => {
                //Get request
                this.parentProductDetailDesc = data.ProductDetailDesc;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailDesc', this.parentProductDetailDesc);

            });
        this.buildGrid();
    }

    public buildGrid(): void {

        this.riGrid.PageSize = 10;
        // this.riGrid.Clear();
        this.riGrid.AddColumn('PremiseLocationNumber', 'ServiceCoverDetailLocEntry', 'PremiseLocationNumber', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('PremiseLocationNumber', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('PremiseLocationSequence', 'ServiceCoverDetailLocEntry', 'PremiseLocationSequence', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('PremiseLocationSequence', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('PremiseLocationDesc', 'ServiceCoverDetailLocEntry', 'PremiseLocationDesc', MntConst.eTypeText, 40);
        this.riGrid.AddColumnAlign('PremiseLocationDesc', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('QuantityAtLocation', 'ServiceCoverDetailLocEntry', 'QuantityAtLocation', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('QuantityAtLocation', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('UnallocQty', 'ServiceCoverDetailLocEntry', 'UnallocQty', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('UnallocQty', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Comments', 'ServiceCoverDetailLocEntry', 'Comments', MntConst.eTypeText, 50);
        this.riGrid.AddColumnAlign('Comments', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('Allocated', 'ServiceCoverDetailLocEntry', 'Allocated', MntConst.eTypeImage, 1, false);
        this.riGrid.AddColumnAlign('Allocated', MntConst.eAlignmentRight);
        this.riGrid.AddColumnUpdateSupport('PremiseLocationSequence', true);
        this.riGrid.AddColumnUpdateSupport('QuantityAtLocation', false);
        this.riGrid.AddColumnUpdateSupport('Comments', false);
        this.riGrid.Complete();

        this.loadData();
    }
    public loadData(): void {
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('ContractTypeCode', this.riExchange.getCurrentContractType());
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.search.set('ServiceCoverRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID'));
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set('riCacheRefresh', 'True');
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, '');
        this.inputParams.search = this.search;
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.showErrorModal(data);
                } else {
                    try {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        this.riGrid.Execute(data);
                    } catch (e) {
                        this.logger.log(' Problem in grid load', e);
                    }
                    this.setFormMode(this.c_s_MODE_UPDATE);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                this.showErrorModal(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );

    }

    public riGrid_BodyColumnFocus(event: any): void {
        //\ this.riGrid.Mode = MntConst.eModeUpdate;
    }


    public riGrid_onGridRowClick(data: any): void {
        this.riExchange.setParentAttributeValue('PremiseLocationNumber', this.riGrid.Details.GetAttribute('QuantityAtLocation', 'AdditionalProperty'));
        this.riExchange.setParentAttributeValue('PremiseLocationDesc', this.riGrid.Details.GetAttribute('PremiseLocationDesc', 'InnerText'));

    }

    public onCellClickBlur(event: any): void {
        let oTR = this.riGrid.CurrentHTMLRow;
        this.gridOperation.vbPremiseLocationNumber = this.riGrid.Details.GetValue('PremiseLocationNumber');
        this.gridOperation.vbPremiseLocationSequenceRowID = this.riGrid.Details.GetAttribute('PremiseLocationSequence', 'Rowid');
        this.gridOperation.vbPremiseLocationSequence = this.riGrid.Details.GetValue('PremiseLocationSequence');
        this.gridOperation.vbPremiseLocationDesc = this.riGrid.Details.GetValue('PremiseLocationDesc');
        this.gridOperation.vbQuantityAtLocation = this.riGrid.Details.GetValue('QuantityAtLocation');
        this.gridOperation.vbUnallocQty = this.riGrid.Details.GetValue('UnallocQty');
        this.gridOperation.vbComments = this.riGrid.Details.GetValue('Comments');
        this.gridOperation.vbPremiseLocationRowID = this.riGrid.Details.GetAttribute('UnallocQty', 'AdditionalProperty');
        this.gridOperation.ServiceCoverDetailLocationRowID = this.riGrid.Details.GetAttribute('PremiseLocationSequence', 'AdditionalProperty');
        this.postRequest();
    }

    public postRequest(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.Action, '2');
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        let postData: Object = {};

        postData['PremiseLocationNumber'] = this.gridOperation.vbPremiseLocationNumber;
        postData['PremiseLocationSequenceRowID'] = this.gridOperation.vbPremiseLocationSequenceRowID;
        postData['PremiseLocationSequence'] = this.gridOperation.vbPremiseLocationSequence;
        postData['PremiseLocationDesc'] = this.gridOperation.vbPremiseLocationDesc;
        postData['QuantityAtLocation'] = this.gridOperation.vbQuantityAtLocation;
        postData['UnallocQty'] = this.gridOperation.vbUnallocQty;
        postData['Comments'] = this.gridOperation.vbComments;
        postData['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') : '';
        postData['ContractTypeCode'] = this.riExchange.getCurrentContractType() ? this.riExchange.getCurrentContractType() : '';
        postData['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') : '';
        postData['ProductCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') : '';
        postData['ProductDetailCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode') : '';
        postData['ServiceCoverNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber') : '';
        postData['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID') : '';
        postData['ServiceCoverDetailLocationRowID'] = this.gridOperation.ServiceCoverDetailLocationRowID;
        postData['PremiseLocationRowID'] = this.gridOperation.vbPremiseLocationRowID;
        postData['riGridMode'] = '3';
        postData['riGridHandle'] = this.utils.randomSixDigitString();
        postData['HeaderClickedColumn'] = this.riGrid.HeaderClickedColumn;
        postData['riSortOrder'] = this.riGrid.SortOrder;

        //making post request
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation,
            searchParams, postData).subscribe(
            (e) => {
                this.riGrid.Mode = MntConst.eModeNormal;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                // this.refresh();
            },
            (error) => {

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public ellipsisData(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailCode', data.ProductDetailCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailDesc', data.ProductDetailDesc);

    }

    public cmdAddLocation_onclick(): any {
        //Navigate to iCABSAPremiseLocationMaintenance
        this.navigate(this.pageParams.parentMode, InternalMaintenanceApplicationModuleRoutes.ICABSAPREMISELOCATIONMAINTENANCE);
    }

    public cmdMoveLocation_onclick(): any {
        //Navigate to iCABSAServiceCoverLocationMoveMaintenance
        //this.navigate(this.pageParams.parentMode, 'path/to/child/page')
    }

    public cmdEmptyLocation_onclick(): any {
        //Navigate to iCABSAEmptyPremiseLocationSearchGrid
        this.navigate(this.pageParams.parentMode, InternalGridSearchSalesModuleRoutes.ICABSAEMPTYPREMISELOCATIONSEARCHGRID);
    }

    public optionsChange(event: any): void {

        switch (event) {
            case 'AddLocation':
                this.cmdAddLocation_onclick();
                break;
            case 'Empty':
                this.cmdEmptyLocation_onclick();
                break;
            default:
                break;
        }


    }

    public getCurrentPage(currentPage: any): void {
        this.pageCurrent = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.pageCurrent));
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.loadData();
    }
    public refresh(): void {
        //this.pageCurrent = 1;
        //this.riGrid.RefreshRequired();
        this.loadData();
    }

}
