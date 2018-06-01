import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { InternalMaintenanceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from '../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSALinkedProductsGrid.html'
})

export class LinkedProductsGridComponent extends BaseComponent implements OnInit {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riPagination') riPagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;

    public itemsPerPage: number;
    public pageSize: number = 10;
    public gridCurPage: number;
    public totalRecords: number = 0;
    public totalPageCount: number = 0;
    public displayProspectMessage = true;
    public translatedMessageList = {};

    public showMessageHeader: boolean = true;
    public promptTitle: string = '';
    public promptContent: string = '';
    public showErrorHeader: boolean = true;
    public CurrentContractType: string;
    public CurrentContractTypeLabel: string;
    public CurrentContractTypeURLParameter: string = '';


    public muleConfig: any = {
        operation: 'Application/iCABSALinkedProductsGrid',
        module: 'service-cover',
        method: 'contract-management/maintenance'
    };


    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber' },
        { name: 'ContractName' },
        { name: 'PremiseNumber' },
        { name: 'PremiseName' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'ServiceVisitFrequency' },
        { name: 'SCRowID' },
        { name: 'ServiceCoverNumber' },
        { name: 'RefreshGrid' },
        { name: 'DispenserInd' },
        { name: 'ConsumableInd' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSALINKEDPRODUCTSGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Linked Products';
        this.utils.setTitle(this.pageTitle);
        this.itemsPerPage = 10;
        this.gridCurPage = 1;
        this.pageSize = 10;
        this.totalPageCount = 0;
        this.window_onload();
    }


    public window_onload(): any {

        this.disableControl('ContractNumber', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductCode', true);
        this.disableControl('ProductDesc', true);
        this.disableControl('DispenserInd', true);
        this.disableControl('ConsumableInd', true);
        this.disableControl('ServiceVisitFrequency', true);

        let modal = {};

        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('ProductCode');
        this.riExchange.getParentHTMLValue('ProductDesc');
        this.riExchange.getParentHTMLValue('DispenserInd');
        this.setControlValue('DispenserInd', modal['DispenserInd'] ? (modal['DispenserInd'].toUpperCase() === 'YES' ? true : false) : false);
        modal['ConsumableInd'] = this.riExchange.getParentHTMLValue('ConsumableInd');
        this.setControlValue('ConsumableInd', modal['ConsumableInd'] ? (modal['ConsumableInd'].toUpperCase() === 'YES' ? true : false) : false);
        modal['ServiceCoverRowID'] = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
        this.setControlValue('SCRowID', modal['ServiceCoverRowID'] ? modal['ServiceCoverRowID'] : '');

        modal['currentContractType'] = this.riExchange.getParentHTMLValue('currentContractType');
        this.CurrentContractType = modal['currentContractType'] ? modal['currentContractType'] : '';
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType);

        this.getServiceCoverInfo();
        this.buildGrid();
    }


    public buildGrid(): any {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ParentProductCode', 'LinkedProducts', 'ParentProductCode', MntConst.eTypeCode, 15);
        this.riGrid.AddColumn('ParentProductDesc', 'LinkedProducts', 'ParentProductDesc', MntConst.eTypeText, 40);
        this.riGrid.AddColumn('ParentServiceVisitFreq', 'LinkedProducts', 'ParentServiceVisitFreq', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('ChildProductCode', 'LinkedProducts', 'ChildProductCode', MntConst.eTypeCode, 15);
        this.riGrid.AddColumn('ChildProductDesc', 'LinkedProducts', 'ChildProductDesc', MntConst.eTypeText, 40);
        this.riGrid.AddColumn('ChildServiceVisitFreq', 'LinkedProducts', 'ChildServiceVisitFreq', MntConst.eTypeInteger, 4);

        this.riGrid.AddColumnAlign('ParentServiceVisitFreq', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('ChildServiceVisitFreq', MntConst.eAlignmentRight);
        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    }


    public riGrid_beforeExecute(): void {
        if (this.riGrid.Update) {

            this.riGrid.StartRow = this.getAttribute('Row') ? this.getAttribute('Row') : 0;
            this.riGrid.StartColumn = 0;
            this.riGrid.RowID = this.getAttribute('LinkedProductRowID') ? this.getAttribute('LinkedProductRowID') : '';

            this.riGrid.UpdateHeader = false;
            this.riGrid.UpdateBody = true;
            this.riGrid.UpdateFooter = false;
        }

        let gridHandle = (Math.floor(Math.random() * 900000) + 100000).toString();
        let gridQueryParams: URLSearchParams = new URLSearchParams();

        let strGridData = true;
        gridQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridQueryParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.Action, '2');

        gridQueryParams.set('SCRowID', this.getControlValue('SCRowID'));
        gridQueryParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        gridQueryParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        gridQueryParams.set('ProductCode', this.getControlValue('ProductCode'));

        gridQueryParams.set('riCacheRefresh', 'true');
        gridQueryParams.set('riGridMode', '0');
        gridQueryParams.set('riGridHandle', gridHandle);
        gridQueryParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        gridQueryParams.set(this.serviceConstants.PageCurrent, this.gridCurPage.toString());

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, gridQueryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data && data.errorMessage) {
                        this.messageModal.show(data, true);
                    } else {
                        this.gridCurPage = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
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


    public getCurrentPage(currentPage: any): void {
        this.gridCurPage = currentPage.value;
        this.riGrid_beforeExecute();
    }

    public refresh(): void {
        this.gridCurPage = 1;
        this.riGrid_beforeExecute();
    }


    public tbody_onDblClick(event: any): any {
        let vbMsgResult;
        switch (this.riGrid.CurrentColumnName) {

            case 'ParentProductCode':
                this.setAttribute('BusinessCodeParentProductCode', event.srcElement.value);
                this.setAttribute('BusinessCodeParentServiceCoverNumber', event.srcElement.getAttribute('AdditionalProperty'));
                this.setAttribute('BusinessCodeChildProductCode', event.srcElement.parentElement.parentElement.parentElement.children[3].innerText);
                this.setAttribute('BusinessCodeChildServiceCoverNumber', event.srcElement.parentElement.parentElement.parentElement.children[3].getAttribute('AdditionalProperty'));

                this.setAttribute('LinkedProductRowID', event.srcElement.getAttribute('RowID'));
                this.setAttribute('Row', event.srcElement.parentElement.parentElement.parentElement.sectionRowIndex);

                this.setControlValue('RefreshGrid', 'Update');
                //riExchange.Mode = 'View'
                //window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSALinkedProductsMaintenance.htm<maxwidth>' + CurrentContractTypeURLParameter
                this.navigate('View', InternalMaintenanceServiceModuleRoutes.ICABSALINKEDPRODUCTSMAINTENANCE, { 'CurrentContractType': this.CurrentContractType });
        }
    }

    public riGrid_BodyOnClick(ev: any): any {
        //TODO:
    }

    public btnAddLinked_onClick(): any {
        this.setControlValue('RefreshGrid', '');
        // riExchange.Mode = 'Add'
        // window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSALinkedProductsMaintenance.htm<maxwidth>' + CurrentContractTypeURLParameter
        this.navigate('Add', InternalMaintenanceServiceModuleRoutes.ICABSALINKEDPRODUCTSMAINTENANCE, { 'CurrentContractType': this.CurrentContractType });
    }


    public getServiceCoverInfo(): any {

        let postDataAdd = {
            'Function': 'ServiceCoverInfo',
            'SCRowID': this.riExchange.riInputElement.GetValue(this.uiForm, 'SCRowID')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('ServiceCoverInfo', {}, postDataAdd).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data.isError) {
                        this.errorService.emitError(data);
                    }
                    else {
                        this.setControlValue('ServiceCoverNumber', data['ServiceCoverNumber'] ? data['ServiceCoverNumber'] : '');
                        this.setControlValue('ServiceVisitFrequency', data['ServiceVisitFrequency'] ? data['ServiceVisitFrequency'] : '');
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }


    public fetchRecordData(functionName: any, params: any, postdata?: any): any {

        let queryParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '0');

        if (functionName !== '') {
            queryParams.set(this.serviceConstants.Action, '6');
        }
        for (let key in params) {
            if (key) {
                queryParams.set(key, params[key]);
            }
        }

        if (postdata) {
            return this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryParams, postdata);
        }
        else {
            return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryParams);
        }
    }

}
