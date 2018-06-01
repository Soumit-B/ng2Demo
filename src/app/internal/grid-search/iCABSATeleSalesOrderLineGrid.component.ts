import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';

import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalMaintenanceApplicationModuleRoutes, CCMModuleRoutes, AppModuleRoutes } from './../../base/PageRoutes';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSATeleSalesOrderLineGrid.html'
})

export class TeleSalesOrderLineGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    public inputParams: any = {};
    public search: URLSearchParams = new URLSearchParams();
    public itemsPerPage: number = 10;
    public pageId: string = '';
    public controls = [
        { name: 'TelesalesOrderNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'TelesalesName', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'TelesalesOrderLineNumber', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'TelesalesOrderStatusDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ProspectNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'ProspectName', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'AccountNumber', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'AccountName', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ContractNumber', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'PremiseNumber', disabled: false, type: MntConst.eTypeInteger, required: false, value: '' },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ProductCode', disabled: false, type: MntConst.eTypeCode, required: false, value: '' },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'SelectedLine', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'ServiceCoverRowID', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'TelesalesLevel', disabled: false, type: MntConst.eTypeText, required: false, value: '' },
        { name: 'TeleSalesOrderLineRowId', disabled: false, type: MntConst.eTypeText, required: false, value: '' }
    ];
    public xhrParams: any = {
        operation: 'Application/iCABSATeleSalesOrderLineGrid',
        module: 'telesales',
        method: 'ccm/maintenance',
        contentType: 'application/x-www-form-urlencoded'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSATELESALESORDERLINEGRID;
        this.browserTitle = this.pageTitle = 'Telesales Order Line Details';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        if (!this.isReturning()) {
            this.pageParams.currentPage = 1;
            this.windowOnload();
        } else {
            this.populateUIFromFormData();
            this.buildGrid();
            this.riGridBeforeExecute();
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.riGrid.FunctionUpdateSupport = false; // Updateable Grid;
        this.riGrid.AddColumn('OrderNo', 'TeleSalesOrderLine', 'OrderNo', MntConst.eTypeInteger, 10, false, '');
        this.riGrid.AddColumnOrderable('OrderNo', true);
        this.riGrid.AddColumnAlign('OrderNo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('OrderLineNo', 'TeleSalesOrderLine', 'OrderLineNo', MntConst.eTypeInteger, 10, false, '');
        this.riGrid.AddColumnAlign('OrderLineNo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('OrderLineNo', true);
        this.riGrid.AddColumn('ProductCode', 'TeleSalesOrderLine', 'ProductCode', MntConst.eTypeText, 5, false, '');
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ProductCode', true);
        this.riGrid.AddColumn('ProductDesc', 'TeleSalesOrderLine', 'ProductDesc', MntConst.eTypeTextFree, 40, false, '');
        this.riGrid.AddColumnOrderable('ProductDesc', true);
        this.riGrid.AddColumn('Quantity', 'TeleSalesOrderLine', 'Quantity', MntConst.eTypeInteger, 5, false, '');
        this.riGrid.AddColumnAlign('Quantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('UnitPrice', 'TeleSalesOrderLine', 'UnitPrice', MntConst.eTypeCurrency, 14, false, '');
        this.riGrid.AddColumnAlign('UnitPrice', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ListPrice', 'TeleSalesOrderLine', 'ListPrice', MntConst.eTypeCurrency, 14, false, '');
        this.riGrid.AddColumnAlign('ListPrice', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('AgreedPrice', 'TeleSalesOrderLine', 'AgreedPrice', MntConst.eTypeCurrency, 14, false, '');
        this.riGrid.AddColumnAlign('AgreedPrice', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('StockReqNumber', 'TeleSalesOrderLine', 'StockReqNumber', MntConst.eTypeInteger, 10, false, '');
        this.riGrid.AddColumnAlign('StockReqNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('StockReqStatus', 'TeleSalesOrderLine', 'StockReqStatus', MntConst.eTypeTextFree, 40, false, '');
        this.riGrid.Complete();
    }

    public windowOnload(): void {
        if (this.parentMode === 'ServiceCoverTeleSalesOrderLine') {
            this.riExchange.getParentHTMLValue('ProductCode');
            this.riExchange.getParentHTMLValue('ProductDesc');
            this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCover'));
        }
        if (this.parentMode === 'PlanVisit') {
            this.riExchange.getParentHTMLValue('TelesalesOrderNumber');
            this.riExchange.getParentHTMLValue('TelesalesOrderLineNumber');
        } else {
            this.setControlValue('TelesalesOrderNumber', this.riExchange.getParentHTMLValue('PassTelesalesOrderNumber'));
        }
        if (this.fieldHasValue('TelesalesOrderNumber') || this.parentMode === 'ServiceCoverTeleSalesOrderLine') {
            this.getTelesalesOrderDetails();
        } else {
            this.buildGrid();
            this.riGridBeforeExecute();
        }
    }

    public riGridBeforeExecute(): void {
        this.inputParams.module = this.xhrParams.module;
        this.inputParams.method = this.xhrParams.method;
        this.inputParams.operation = this.xhrParams.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        // parameters
        this.search.set('TeleSalesOrderNumber', this.getControlValue('TelesalesOrderNumber'));
        this.search.set('TeleSalesOrderLineNumber', this.getControlValue('TelesalesOrderLineNumber'));
        this.search.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        // set grid sorting parameters
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        let sortOrder: string = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set('riSortOrder', sortOrder);
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageParams.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '5376262');
        this.inputParams.search = this.search;
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                if (data) {
                    this.pageParams.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.pageParams.totalItems = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.riGrid.Execute(data);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.pageParams.totalItems = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getTelesalesOrderDetails(): void {
        let search: any = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        let formData = {
            'Function': 'GetTelesalesOrderDetails',
            'BusinessCode': this.utils.getBusinessCode(),
            'TelesalesOrderNumber': this.getControlValue('TelesalesOrderNumber')
        };
        if (this.parentMode === 'ServiceCoverTeleSalesOrderLine') {
            formData['ServiceCoverRowID'] = this.getControlValue('ServiceCoverRowID');
        }
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('TelesalesOrderNumber', data['TelesalesOrderNumber']);
                    this.setControlValue('TelesalesName', data['TelesalesName']);
                    this.setControlValue('TelesalesOrderStatusDesc', data['TelesalesOrderStatusDesc']);
                    if (data['ProspectNumber'] !== '0' && data['ProspectNumber'] !== '') {
                        this.setControlValue('ProspectNumber', data['ProspectNumber']);
                    }
                    if (data['AccountNumber'] !== '') {
                        this.setControlValue('AccountNumber', data['AccountNumber']);
                    }
                    if (data['ContractNumber'] !== '') {
                        this.setControlValue('ContractNumber', data['ContractNumber']);
                        if (data['PremiseNumber'] !== '') {
                            this.setControlValue('PremiseNumber', data['PremiseNumber']);
                        }
                    }
                    this.buildGrid();
                    this.riGridBeforeExecute();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
            }
            );
    }

    public tbodyOnDblclick(event: any): void {
        if (this.utils.hasClass(event.srcElement, 'pointer')) {
            let colName: string = this.riGrid.CurrentColumnName;
            this.gridFocus(event.srcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0]);
            switch (colName) {
                case 'OrderNo':
                    this.navigate('TelesalesOrderLine', AppModuleRoutes.CCM + CCMModuleRoutes.ICABSATELESALESORDERGRID);//Application/iCABSATeleSalesOrderGrid.htm
                    break;
                case 'ProductCode':
                    switch (this.riGrid.Details.GetAttribute('ProductCode', 'AdditionalProperty')) {
                        case 'C':
                            this.pageParams.currentContractType = 'C';
                            break;
                        case 'J':
                            this.pageParams.currentContractType = 'J';
                            break;
                        case 'P':
                            this.pageParams.currentContractType = 'P';
                            break;
                    }
                    this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE,
                        {
                            ServiceCoverRowID: this.getAttribute('ServiceCoverRowID'),
                            currentContractType: this.pageParams.currentContractType
                        });
                    break;
                case 'Quantity':
                    this.navigate('TeleSalesOrderLine', InternalMaintenanceApplicationModuleRoutes.ICABSAPLANVISITMAINTENANCE);
                    break;
                case 'StockReqNumber':
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotCovered));
                    //this.navigate('TelesalesLineGrid', 'Application/iCABSAStockRequestGrid');
                    break;
            }
        }
    }

    public gridFocus(rsrcElement: any): void {
        let element: any = rsrcElement.parentElement.parentElement.parentElement.children[0].children[0].children[0];
        rsrcElement.select();
        this.setControlValue('SelectedLine', element.value);
        this.setControlValue('TeleSalesOrderLineRowId', element.getAttribute('RowID'));
        if (element.getAttribute('AdditionalProperty') !== '-') {
            this.setAttribute('ServiceCoverRowID', this.riGrid.Details.GetAttribute('ProductCode', 'Rowid'));
            this.setAttribute('PlanVisitRowID', this.riGrid.Details.GetAttribute('Quantity', 'Rowid'));
        }
    }

    public getCurrentPage(currentPage: any): void {
        this.pageParams.currentPage = currentPage.value;
        this.riGridBeforeExecute();
    }

    public sortGrid(data: any): void {
        this.riGridBeforeExecute();
    }

    public refresh(): void {
        this.riGrid.ResetGrid();
        this.riGridBeforeExecute();
    }

    public hasValue(val: any): boolean {
        return ((val !== null) && (val !== undefined) && (val !== ''));
    }

    public fieldHasValue(field: string): boolean {
        return this.hasValue(this.getControlValue(field));
    }
}
