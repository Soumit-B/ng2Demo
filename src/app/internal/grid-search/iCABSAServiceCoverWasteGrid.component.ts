import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAServiceCoverWasteGrid.html'
})

export class ServiceCoverWasteGridComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: true },
        { name: 'ContractName', readonly: true, disabled: true, required: true },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: true },
        { name: 'PremiseName', readonly: true, disabled: true, required: true },
        { name: 'ProductCode', readonly: true, disabled: true, required: true },
        { name: 'ProductDesc', readonly: true, disabled: true, required: true }
    ];
    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeCode,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 3,
            'align': 'center'
        }
    ];

    private ServiceCoverNumber: string;
    private ServiceCoverRowID: string;
    public inputParams: any = {};
    private search: URLSearchParams;
    private method: string = 'service-delivery/maintenance';
    private module: string = 'waste';
    private operation: string = 'Application/iCABSAServiceCoverWasteGrid';
    public totalRecords: number;
    public maxColumn: number = 4;
    public pageCurrent: number = 1;
    public pageSize: number = 10;
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERWASTEGRID;
    }
    @ViewChild('serviceCoverWasteGrid') serviceCoverWasteGrid: GridComponent;
    @ViewChild('serviceCoverWastePagination') serviceCoverWastePagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    public ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        switch (this.parentMode) {
            case 'ProductUpgrade':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('NewProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('NewProductDesc'));
                this.ServiceCoverNumber = this.riExchange.getParentHTMLValue('NewServiceCoverNumber');
                this.ServiceCoverRowID = this.riExchange.getParentHTMLValue('NewServiceCoverRowID');
                break;

            default:
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                this.ServiceCoverNumber = this.riExchange.getParentHTMLValue('ServiceCoverNumber');
                this.ServiceCoverRowID = this.riExchange.getParentHTMLValue('CurrentServiceCoverRowID');
                break;
        }
        this.getServiceCoverNumber();

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private buildGrid(params: any): void {
        this.setFilterValues(params);
        this.inputParams.search = this.search;
        this.serviceCoverWasteGrid.itemsPerPage = this.pageSize;
        this.serviceCoverWasteGrid.loadGridData(this.inputParams);
    }

    public setFilterValues(params: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ServiceCoverNumber', this.ServiceCoverNumber);
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riGridMode', '0');
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.pageCurrent.toString());
    }

    public refresh(event: any): void {
        this.buildGrid(this.inputParams);
    }

    private getServiceCoverNumber(): void {
        if (this.ServiceCoverRowID) {
            this.getServiceCoverNumberFromRowID();
        }
    }

    private getServiceCoverNumberFromRowID(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['Function'] = 'GetServiceCoverFromRowID';
        formdata['SCRowID'] = this.ServiceCoverRowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                this.ServiceCoverNumber = data.ServiceCoverNumber;
                this.buildGrid(this.inputParams);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getGridInfo(info: any): void {
        this.serviceCoverWastePagination.totalItems = info.totalRows;
    }

    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        this.buildGrid(this.inputParams);
        // this.updateView();
    }

    public onGridRowDblClick(event: any): void {
        switch (event.cellIndex) {
            case 3:
                this.updatePrimaryServiceCoverWaste(event.cellData.additionalData);
                break;
            case 2:
                let ServiceCoverWasteRowID = event.cellData.additionalData;
                let EWCCode = event.trRowData[0].text;
                if (ServiceCoverWasteRowID !== '?') {
                    this.deleteServiceCoverWaste(ServiceCoverWasteRowID);
                } else {
                    this.addServiceCoverWaste(ServiceCoverWasteRowID, EWCCode);
                }

        }
    }


    private deleteServiceCoverWaste(ServiceCoverWasteRowID: string): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['Function'] = 'DeleteServiceCoverWaste';
        formdata['ServiceCoverWasteRowID'] = ServiceCoverWasteRowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                } else {
                    this.buildGrid(this.inputParams);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }


    private addServiceCoverWaste(ServiceCoverWasteRowID: string, EWCCode: string): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['Function'] = 'AddServiceCoverWaste';
        formdata['BusinessCode'] = this.utils.getBusinessCode();
        formdata['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        formdata['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        formdata['ProductCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        formdata['EWCCode'] = EWCCode;
        formdata['ServiceCoverNumber'] = this.ServiceCoverNumber;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                } else {
                    this.buildGrid(this.inputParams);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private updatePrimaryServiceCoverWaste(ServiceCoverWasteRowID: string): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['Function'] = 'UpdatePrimaryServiceCoverWaste';
        formdata['ServiceCoverWasteRowID'] = ServiceCoverWasteRowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                } else {
                    this.buildGrid(this.inputParams);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
}
