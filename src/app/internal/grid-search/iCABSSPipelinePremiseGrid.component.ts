import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { AppModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';

@Component({

    templateUrl: 'iCABSSPipelinePremiseGrid.html'
})

export class PipelinePremiseGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('PipelinePremiseGridPagination') PipelinePremiseGridPagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public controls = [
        { name: 'dlBatchRef', disabled: false },
        { name: 'dlContractRef', disabled: true },
        { name: 'DisContractTypeCode', disabled: true },
        { name: 'QuoteTypeCode', disabled: true },
        { name: 'SubSystem', disabled: false },
        { name: 'ContractTypeCode', disabled: false },
        { name: 'UpdateableInd', disabled: false },
        { name: 'RunFrom', disabled: false },
        { name: 'PassPremiseNumber', disabled: false },
        { name: 'PassPremiseROWID', disabled: false },
        { name: 'dlPremiseROWID', disabled: false },
        { name: 'dlPremiseRef', disabled: false }
    ];

    public queryParams: any = {
        operation: 'Sales/iCABSSPipelinePremiseGrid',
        module: 'prospect',
        method: 'prospect-to-contract/maintenance'
    };

    public pageId: string = '';
    public premiseRef: any;
    public premiseRowID: any;

    // New Grid Component Variables
    public search: URLSearchParams = new URLSearchParams();
    public pageSize: number = 11;
    public itemsPerPage: number = 10;
    public pageCurrent: number = 1;
    public totalRecords: number = 0;

    public ngOnInit(): void {
        super.ngOnInit();
        this.pageParams.currentContractTypeURLParameter = this.riExchange.getCurrentContractTypeLabel();
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

    constructor(injector: Injector) {
        super(injector);
        this.browserTitle = this.pageTitle = 'Advantage Premises';
        this.pageId = PageIdentifier.ICABSSPIPELINEPREMISEGRID;
    }

    public window_onload(): void {
        this.setControlValue('dlBatchRef', this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.setControlValue('dlContractRef', this.riExchange.getParentHTMLValue('dlContractRef'));
        this.setControlValue('ContractTypeCode', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.setControlValue('QuoteTypeCode', this.riExchange.getParentHTMLValue('QuoteTypeCode'));
        this.setControlValue('SubSystem', this.riExchange.getParentHTMLValue('SubSystem'));
        this.setControlValue('DisContractTypeCode', this.riExchange.getParentHTMLValue('DisContractTypeCode'));
        if (this.getControlValue('DisContractTypeCode') === '') {
            this.setControlValue('DisContractTypeCode', this.getControlValue('ContractTypeCode'));
        }
        this.setControlValue('RunFrom', this.riExchange.getParentMode());
        this.postRequest();
        this.buildGrid();
    }

    public buildGrid(): void {
        this.riGrid.PageSize = 10;
        this.riGrid.AddColumn('PremiseNumber', 'SOPremise', 'PremiseNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseName', 'SOPremise', 'PremiseName', MntConst.eTypeTextFree, 20);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('PremiseAddressLine1', 'SOPremise', 'PremiseAddressLine1', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('PremiseAddressLine1', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('PremisePostCode', 'SOPremise', 'PremisePostCode', MntConst.eTypeInteger, 10);
        this.riGrid.AddColumnAlign('PremisePostCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('NumServiceCovers', 'SOPremise', 'NumServiceCovers', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('NumServiceCovers', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('MasterPremiseValue', 'SOPremise', 'MasterPremiseValue', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumnAlign('MasterPremiseValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('PremiseValue', 'SOPremise', 'PremiseValue', MntConst.eTypeCurrency, 8);
        this.riGrid.AddColumnAlign('PremiseValue', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnOrderable('PremiseNumber', true);
        this.riGrid.AddColumnOrderable('PremisePostCode', true);
        this.riGrid.Complete();
        this.riGrid_BeforeExecute();
    }

    public riGrid_BeforeExecute(): void {

        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());

        this.search.set('dlBatchRef', this.getControlValue('dlBatchRef'));
        this.search.set('dlContractRef', this.getControlValue('dlContractRef'));
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        this.search.set('RunFrom', this.getControlValue('RunFrom'));
        this.search.set('QuoteTypeCode', this.getControlValue('QuoteTypeCode'));

        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set('riCacheRefresh', 'True');
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());

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

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_onGridRowClick(data: any): void {
        if (this.getControlValue('QuoteTypeCode') === 'DEL') {
            this.setControlValue('PassPremiseNumber', this.riGrid.Details.GetValue('PremiseNumber'));
            this.setControlValue('PassPremiseROWID', this.riGrid.Details.GetAttribute('PremiseNumber', 'Rowid'));
        }
        this.attributes.dlPremiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'Rowid');
        this.setControlValue('dlPremiseRowID', this.riGrid.Details.GetAttribute('PremiseNumber', 'Rowid'));
        this.attributes.dlPremiseRef = this.riGrid.Details.GetAttribute('PremiseNumber', 'AdditionalProperty');
    }

    public riGrid_onGridRowDBClick(data: any): void {
        this.premiseRef = this.riGrid.Details.GetAttribute('PremiseNumber', 'AdditionalProperty');
        this.premiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'Rowid');
        switch (this.riGrid.CurrentCell) {
            case 0:
                if (this.getControlValue('QuoteTypeCode') === 'AMD') {
                    this.navigate('SOPremise', InternalMaintenanceSalesModuleRoutes.ICABSSDLPREMISEMAINTENANCE, {
                        'dlExtRef': this.premiseRef,
                        'DisContractTypeCode': this.getControlValue('DisContractTypeCode'),
                        'dlPremiseROWID': this.premiseRowID
                    });
                }
                else if (this.getControlValue('QuoteTypeCode') === 'ADD') {
                    this.navigate('SOPremise', InternalMaintenanceSalesModuleRoutes.ICABSSDLPREMISEMAINTENANCE, {
                        'dlExtRef': this.premiseRef,
                        'DisContractTypeCode': this.getControlValue('DisContractTypeCode'),
                        'dlPremiseROWID': this.premiseRowID
                    });
                }
                else {
                    this.navigate('SOPremise', InternalMaintenanceSalesModuleRoutes.ICABSSDLPREMISEMAINTENANCE, {
                        'dlExtRef': this.premiseRef,
                        'DisContractTypeCode': this.getControlValue('DisContractTypeCode'),
                        'dlPremiseROWID': this.premiseRowID
                    });
                }
                break;
            case 3:
                this.navigate('ServiceAreaSequence', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter
                });
                break;
            case 4:
                this.navigate('SOPremise', InternalGridSearchSalesModuleRoutes.ICABSSPIPELINESERVICECOVERGRID, {
                    'PassQuoteTypeCode': this.getControlValue('QuoteTypeCode'),
                    'dlPremiseRef': this.premiseRef
                });
                break;

        }
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
