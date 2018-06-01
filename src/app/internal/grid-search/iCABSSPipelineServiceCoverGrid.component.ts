import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { InternalMaintenanceModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSSPipelineServiceCoverGrid.html'
})

export class PipelineServiceCoverGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('PipelineServiceCoverGridPagination') PipelineServiceCoverGridPagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public controls = [
        { name: 'dlBatchRef', disabled: false },
        { name: 'dlContractRef', disabled: true },
        { name: 'dlPremiseRef', disabled: true },
        { name: 'QuoteTypeCode', disabled: true },
        { name: 'SubSystem', disabled: false },
        { name: 'ContractTypeCode', disabled: false },
        { name: 'dlAction', disabled: false },
        { name: 'UpdateableInd', disabled: false },
        { name: 'dlPremiseROWID', disabled: false }
    ];

    public queryParams: any = {
        operation: 'Sales/iCABSSPipelineServiceCoverGrid',
        module: 'prospect',
        method: 'prospect-to-contract/maintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSPIPELINESERVICECOVERGRID;
        this.pageTitle = this.browserTitle = 'Advantage Service Covers';
    }

    public pageId: string = '';
    public premiseRef: any;
    public premiseRowID: any;
    public serviceCoverRowid: any;

    // New Grid Component Variables
    public inputParams: any = {};
    public pageCurrent: number = 1;
    public totalRecords: number = 0;
    public search: URLSearchParams = new URLSearchParams();
    public pageSize: number = 11;
    public itemsPerPage: number = 10;

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.buildGrid();
        } else {
            this.window_onload();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public window_onload(): void {
        this.setControlValue('dlBatchRef', this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.setControlValue('dlContractRef', this.riExchange.getParentHTMLValue('dlContractRef'));
        this.setControlValue('ContractTypeCode', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.setControlValue('QuoteTypeCode', this.riExchange.getParentHTMLValue('PassQuoteTypeCode'));
        this.setControlValue('SubSystem', this.riExchange.getParentHTMLValue('SubSystem'));
        this.setControlValue('dlPremiseRef', this.riExchange.getParentHTMLValue('dlPremiseRef'));
        this.setControlValue('dlPremiseROWID', this.riExchange.getParentHTMLValue('dlPremiseROWID'));
        if (this.getControlValue('dlPremiseROWID') !== '') {
            this.attributes.dlPremiseRowID = this.getControlValue('dlPremiseROWID');
        }
        this.postRequest();
        this.buildGrid();
    }

    public buildGrid(): void {

        this.riGrid.PageSize = 10;
        this.riGrid.AddColumn('PremiseNumber', 'SOServiceCover', 'PremiseNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseName', 'SOServiceCover', 'PremiseName', MntConst.eTypeTextFree, 20);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('PremiseAddressLine1', 'SOServiceCover', 'PremiseAddressLine1', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('PremiseAddressLine1', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('PremisePostCode', 'SOServiceCover', 'PremisePostCode', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('PremisePostCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ServiceCoverNumber', 'SOServiceCover', 'ServiceCoverNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServiceCoverNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('SCContractTypeCode', 'SOServiceCover', 'SCContractTypeCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumnAlign('SCContractTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('dlStatusCode', 'SOServiceCover', 'dlStatusCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumnAlign('dlStatusCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceCoverDetNumber', 'SOServiceCover', 'ServiceCoverDetNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServiceCoverDetNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceCommenceDate', 'SOServiceCover', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ProductCode', 'SOServiceCover', 'ProductCode', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ServiceCoverValue', 'SOServiceCover', 'ServiceCoverValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('ServiceCoverValue', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnOrderable('PremiseNumber', true);
        this.riGrid.AddColumnOrderable('PremisePostCode', true);
        this.riGrid.AddColumnOrderable('ProductCode', true);
        this.riGrid.Complete();
        this.riGrid_BeforeExecute();
    }

    public riGrid_BeforeExecute(): void {

        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('dlBatchRef', this.getControlValue('dlBatchRef'));
        this.search.set('dlContractRef', this.getControlValue('dlContractRef'));
        this.search.set('dlPremiseRef', this.getControlValue('dlPremiseRef'));
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set('riCacheRefresh', 'True');
        this.search.set(this.serviceConstants.GridMode, '0');
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set('riSortOrder', sortOrder);
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public postRequest(): void {

        this.ajaxSource.next(this.ajaxconstant.START);
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        let postData: Object = {};
        postData['Function'] = 'Updateable';
        postData['dlBatchRef'] = this.getControlValue('dlBatchRef');
        postData['dlContractRef'] = this.getControlValue('dlContractRef');
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation,
            searchParams, postData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('UpdateableInd', data.UpdateableInd);
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public postupdateSingle(event: any): void {

        this.ajaxSource.next(this.ajaxconstant.START);
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        let postData: Object = {};
        postData['Function'] = 'updateSingle';
        postData['dlBatchRef'] = this.getControlValue('dlBatchRef');
        postData['dlPremiseRef'] = this.getControlValue('dlPremiseRef');
        postData['ServiceCoverNumber'] = event;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation,
            searchParams, postData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        this.refresh();

    }

    public riGrid_onGridRowClick(data: any): void {
        this.attributes.dlPremiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'Rowid');
        this.attributes.dlServiceCoverRowID = this.riGrid.Details.GetAttribute('ServiceCoverNumber', 'Rowid');
        this.attributes.dlServiceCoverRef = this.riGrid.Details.GetAttribute('ServiceCoverNumber', 'AdditionalProperty');
        this.attributes.dlPremiseRef = this.riGrid.Details.GetAttribute('PremiseName', 'AdditionalProperty');
        this.attributes.ProductCode = this.riGrid.Details.GetValue('ProductCode');
        this.attributes.ProductDesc = this.riGrid.Details.GetAttribute('ProductCode', 'AdditionalProperty');
        this.attributes.ServiceCommenceDate = this.riGrid.Details.GetValue('ServiceCommenceDate');
        this.setControlValue('dlAction', this.riGrid.Details.GetAttribute('PremiseAddressLine1', 'AdditionalProperty'));
        this.setControlValue('ContractTypeCode', this.riGrid.Details.GetValue('SCContractTypeCode'));
    }

    public riGrid_onGridRowDBClick(data: any): void {
        this.serviceCoverRowid = this.riGrid.Details.GetAttribute('ServiceCoverNumber', 'Rowid');
        this.premiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'Rowid');
        switch (this.riGrid.CurrentCell) {
            case 0:
                this.navigate('SOPremise', InternalMaintenanceSalesModuleRoutes.ICABSSDLPREMISEMAINTENANCE, {
                    'dlExtRef': this.getControlValue('dlPremiseRef'),
                    'dlPremiseROWID': this.premiseRowID
                });
                break;
            case 4:
                this.postupdateSingle(this.riGrid.Details.GetValue('ServiceCoverNumber'));
                if (this.getControlValue('QuoteTypeCode') === 'NEW') {
                    this.navigate('ServiceCoverUpdate', InternalMaintenanceSalesModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE, {
                        'dlPremiseRef': this.getControlValue('dlPremiseRef'),
                        'dlServiceCoverRowID': this.serviceCoverRowid
                    });
                }
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO('Sales/iCABSSdlServiceCoverAmend ' + MessageConstant.Message.PageNotDeveloped));
                    //TODO: Screen not yet developed
                    //this.navigate('ServiceCoverUpdate', 'Sales/iCABSSdlServiceCoverAmend.htm');
                }
                break;
        }
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public getCurrentPage(currentPage: any): void {
        this.pageCurrent = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.pageCurrent));
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

}
