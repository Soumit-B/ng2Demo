import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Router, ActivatedRoute } from '@angular/router';
import { InternalGridSearchModuleRoutes, AppModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSSSOPremiseGrid.html'
})
export class SOPremiseGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('SOPremiseGrid') SOPremiseGrid: GridComponent;
    @ViewChild('SOPremisePagination') SOPremisePagination: PaginationComponent;

    public queryParams: any = {
        operation: 'Sales/iCABSSSOPremiseGrid',
        module: 'advantage',
        method: 'prospect-to-contract/maintenance',
        search: ''
    };
    public returnGrpObj: any;
    public premiseGridCellData: any;
    public UpdateableInd: any;
    public pageId: string = '';
    public gridSortHeaders: Array<any> = [];
    public maxColumn: number = 5;
    public itemsPerPage: number = 15;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public CurrentColumnName: any;
    public headerClickedColumn: string = '';
    public riSortOrder: string = '';
    public griddata: any;
    public headerProperties: Array<any> = [];
    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeInteger,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeTextFree,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 4,
            'align': 'center'
        }];


    public controls = [
        { name: 'dlContractRef', readonly: true, disabled: false, required: false },
        { name: 'ContractTypeCode', readonly: true, disabled: false, required: false },
        { name: 'dlBatchRef', readonly: true, disabled: false, required: false },
        { name: 'dlPremiseROWID', readonly: true, disabled: false, required: false }
    ];

    constructor(injector: Injector, public _router: Router) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSOPREMISEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Advantage Premises';
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getRequest(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');

        let postParams: any = {};
        postParams.Function = 'Updateable';
        postParams.dlBatchRef = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlBatchRef');
        postParams.dlContractRef = this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContractRef');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {

                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        this.UpdateableInd = e.UpdateableInd;
                        console.log(this.UpdateableInd);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public buildGrid(): void {
        this.SOPremiseGrid.clearGridData();
        let search: URLSearchParams;
        search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('dlBatchRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlBatchRef'));
        search.set('dlContractRef', this.riExchange.riInputElement.GetValue(this.uiForm, 'dlContractRef'));
        search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, '11798034');
        // search.set('riSortOrder', 'Descending');
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
        search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
        this.queryParams.search = search;

        this.SOPremiseGrid.loadGridData(this.queryParams);
    }

    public ngAfterViewInit(): void {
        let PremiseNumber: any = {
            'fieldName': 'PremiseNumber',
            'index': 0,
            'sortType': 'ASC'
        };
        let PremisePostCode: any = {
            'fieldName': 'PremisePostCode',
            'index': 3,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(PremiseNumber);
        this.gridSortHeaders.push(PremisePostCode);

        // let premiseAdjustObj = {}, productAdjustObj = {};

        let premiseAdjustObj = {
            'align': 'center',
            'width': '150px',
            'index': 0
        };
        let nameObj = {
            'align': 'center',
            'width': '400px',
            'index': 1
        };
        let serviceCovertObj = {
            'align': 'center',
            'width': '140px',
            'index': 4
        };
        let postCodetObj = {
            'align': 'center',
            'width': '100px',
            'index': 3
        };

        this.headerProperties.push(premiseAdjustObj);
        this.headerProperties.push(nameObj);
        this.headerProperties.push(serviceCovertObj);
        this.headerProperties.push(postCodetObj);
    }

    public getCurrentPage(currentPage: any): void {
        let search: URLSearchParams;
        this.currentPage = currentPage.value;
        search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    }
    public getGridInfo(info: any): void {
        this.SOPremisePagination.totalItems = info.totalRows;
    }

    public window_onload(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlBatchRef', this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'dlContractRef', this.riExchange.getParentHTMLValue('dlContractRef'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SubSystem', this.riExchange.getParentHTMLValue('SubSystem'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.pageParams.currentContractType = this.riExchange.getParentHTMLValue('ContractTypeCode');
        this.buildGrid();
        this.getRequest();
    }


    public refresh(): void {
        this.currentPage = 1;
        this.buildGrid();
    }

    public gridBodyOnSingleClick(event: any): void {
        if (event.cellData !== null) {
            this.SOPremiseGridSingleClick(event);
        }
    }
    public SOPremiseGridSingleClick(event: any): void {
        if (event && event.cellData && event.cellData.additionalData !== null) {
            this.premiseGridCellData = this.SOPremiseGrid.getCellInfoForSelectedRow(event.rowIndex, '0');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'dlPremiseROWID', this.premiseGridCellData.rowID);
            this.attributes.dlPremiseRowID = this.premiseGridCellData.rowID;
            this.attributes.dlPremiseRef = this.premiseGridCellData.additionalData;
        }
    }

    public sortGrid(data: any): void {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }

    public gridBodyOnDoubleClick(data: any): void {
        this.griddata = data;
        this.SOPremiseGridSingleClick(data);
        if (data.cellIndex === 0) {
            this.navigate('SOPremise', InternalMaintenanceSalesModuleRoutes.ICABSSDLPREMISEMAINTENANCE, {
                parentMode: 'SOPremise',
                dlExtRef: this.getControlValue('dlContractRef')
            });
        }
        // if (data.rowData['Postcode'] === data.cellData.text) {
        //     this.navigate('ServiceAreaSequence', 'Sales/iCABSSdlPremiseMaintenance');
        // }
        if (data.cellIndex === 4) {
            this.navigate('SOPremise', InternalGridSearchSalesModuleRoutes.ICABSSSOSERVICECOVERGRID);
        }
    }
}
