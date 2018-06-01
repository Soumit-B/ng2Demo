import { OnInit, Injector, OnDestroy, ViewChild, Component, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { ContractManagementModuleRoutes, InternalGridSearchSalesModuleRoutes, AppModuleRoutes } from './../../base/PageRoutes';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';


@Component({
    templateUrl: 'iCABSSeServiceWorkListGrid.html'
})

export class ServiceWorkListGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    private lookUpSubscription: Subscription;
    private xhr: Object = {
        module: 'manual-service',
        method: 'service-delivery/maintenance',
        operation: 'Service/iCABSSeServiceWorkListGrid'
    };
    public pageId: string = '';
    public itemsPerPage: number = 10;
    public totalRecords: number = 1;
    public currentPage: number = 1;
    public controls: Array<any> = [
        { name: 'StartDate', disabled: true, required: true, type: MntConst.eTypeDate },
        { name: 'EndDate', disabled: true, required: true, type: MntConst.eTypeDate },
        { name: 'WeekNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'BranchServiceAreaCode', disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', disabled: true, type: MntConst.eTypeText },
        { name: 'ServicePlanNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'SubtotalNoOfCalls', disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'SubtotalNoOfExchanges', disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'SubtotalTime', disabled: true, type: MntConst.eTypeText },
        { name: 'SubtotalNettValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'TotalNoOfCalls', disabled: true, type: MntConst.eTypeInteger },
        { name: 'TotalNoOfExchanges', disabled: true, type: MntConst.eTypeInteger },
        { name: 'TotalTime', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'TotalNettValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'PostcodeFilter', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'SummaryDetail' },
        { name: 'VisitTypeFilter' },
        { name: 'GridPageSize', required: true, type: MntConst.eTypeInteger, value: this.itemsPerPage },
        { name: 'SubtotalWED', disabled: true, required: true, type: MntConst.eTypeDecimal1 },
        { name: 'TotalWED', disabled: true, required: true, type: MntConst.eTypeDecimal1 }
    ];
    public systemChars: Object = {
        vEnableInstallsRemovals: '', //190
        vEnablePostcodeDefaulting: '', //120
        vEnableMapGridReference: '',//450
        vEnableReceiptRequired: '',//940
        vEnableWED: ''//3370
    };
    public visitTypeFilter: Array<any> = [];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEWORKLISTGRID;
        this.pageTitle = this.browserTitle = 'Service Work List';
    }
    ngOnInit(): void {
        super.ngOnInit();
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        };
    }
    public ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.systemChars = this.pageParams;
            this.buildMenuOptions();
            this.populateUIFromFormData();
            this.itemsPerPage = this.getControlValue('GridPageSize');
            this.buildGrid();
        } else {
            this.riExchange.getParentHTMLValue('StartDate');
            this.riExchange.getParentHTMLValue('EndDate');
            this.riExchange.getParentHTMLValue('WeekNumber');
            this.riExchange.getParentHTMLValue('BranchServiceAreaCode');
            this.riExchange.getParentHTMLValue('EmployeeSurname');
            this.riExchange.getParentHTMLValue('ServicePlanNumber');
            this.riExchange.getParentHTMLValue('TotalNoOfCalls');
            this.riExchange.getParentHTMLValue('TotalNoOfExchanges');
            this.riExchange.getParentHTMLValue('TotalTime');
            this.riExchange.getParentHTMLValue('TotalNettValue');
            this.riExchange.getParentHTMLValue('SummaryDetail');
            this.loadSystemChars();
        }
    };

    public loadSystemChars(): void {
        let sysNumbers: Array<any> = [
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableMapGridReference,
            this.sysCharConstants.SystemCharEnableReceiptRequired,
            this.sysCharConstants.SystemCharEnableWED
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.fetchSysChar(sysNumbers)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    if (e.records.length > 0) {
                        this.systemChars['vEnableInstallsRemovals'] = e.records[0] ? e.records[0].Required : false;
                        this.systemChars['vEnablePostcodeDefaulting'] = e.records[1] ? e.records[1].Required : false;
                        this.systemChars['vEnableMapGridReference'] = e.records[2] ? e.records[2].Required : false;
                        this.systemChars['vEnableReceiptRequired'] = e.records[3] ? e.records[3].Required : false;
                        this.systemChars['vEnableWED'] = e.records[4] ? e.records[4].Required : false;
                        this.pageParams = this.systemChars;
                        if (this.systemChars['vEnableWED'])
                            this.riExchange.getParentHTMLValue('TotalWED');
                        this.buildGrid();
                        this.buildMenuOptions();
                    }
                };
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }
    /*** Method to get system characters
    * @params field- systemchars variables looking for  and type- L,R,I
    */
    public fetchSysChar(sysCharNumbers: any): any {
        let querySysChar: URLSearchParams = this.getURLSearchParamObject();
        querySysChar.set(this.serviceConstants.Action, '0');
        querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(querySysChar);
    }
    //Grid
    public buildGrid(): void {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.DefaultTextColor = '0000FF';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;

        this.riGrid.Clear();
        switch (this.getControlValue('SummaryDetail')) {
            case 'Detail':
                this.riGrid.AddColumn('BranchServiceAreaSeqNo', 'ServiceCover', 'BranchServiceAreaSeqNo', MntConst.eTypeText, 6);
                this.riGrid.AddColumnAlign('BranchServiceAreaSeqNo', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('NextServiceVisitDate', 'ServiceCover', 'NextServiceVisitDate', MntConst.eTypeDate, 10);
                this.riGrid.AddColumnAlign('NextServiceVisitDate', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ContractNumber', 'ServiceCover', 'ContractNumber', MntConst.eTypeCode, 10);
                this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('PremiseNumber', 'ServiceCover', 'PremiseNumber', MntConst.eTypeInteger, 5);
                this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('PremiseName', 'ServiceCover', 'PremiseName', MntConst.eTypeText, 14);
                this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
                this.riGrid.AddColumn('PremiseAddressLine1', 'ServiceCover', 'PremiseAddressLine1', MntConst.eTypeText, 14);
                this.riGrid.AddColumnAlign('PremiseAddressLine1', MntConst.eAlignmentLeft);
                if (this.systemChars['vEnablePostcodeDefaulting']) {
                    this.riGrid.AddColumn('Postcode', 'ServiceCover', 'Postcode', MntConst.eTypeText, 9);
                    this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);
                }
                this.riGrid.AddColumn('ContactName', 'ServiceCover', 'ContactName', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ContactNumber', 'ServiceCover', 'ContactNumber', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ProductCode', 'ServiceCover', 'ProductCode', MntConst.eTypeCode, 6);
                this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ServiceVisitFrequency', 'ServiceCover', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5);
                this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ServiceQuantity', 'ServiceCover', 'ServiceQuantity', MntConst.eTypeInteger, 5);
                this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ServiceTypeCode', 'ServiceCover', 'ServiceTypeCode', MntConst.eTypeCode, 2);
                this.riGrid.AddColumnAlign('ServiceTypeCode', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('VisitsDueAndCompleted', 'ServiceCover', 'VisitsDueAndCompleted', MntConst.eTypeText, 5);
                this.riGrid.AddColumnAlign('VisitsDueAndCompleted', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('VisitTypeCode', 'ServiceCover', 'VisitTypeCode', MntConst.eTypeCode, 2);
                this.riGrid.AddColumnAlign('VisitTypeCode', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('StandardTreatmentTime', 'ServiceCover', 'StandardTreatmentTime', MntConst.eTypeCode, 8);
                this.riGrid.AddColumnAlign('StandardTreatmentTime', MntConst.eAlignmentCenter);
                if (this.systemChars['vEnableMapGridReference']) {
                    this.riGrid.AddColumn('GridRef', 'ServiceCover', 'GridRef', MntConst.eTypeCode, 15);
                    this.riGrid.AddColumnAlign('GridRef', MntConst.eAlignmentLeft);
                }
                if (this.systemChars['vEnableReceiptRequired']) {
                    this.riGrid.AddColumn('ReceiptRequired', 'ServiceCover', 'ReceiptRequired', MntConst.eTypeImage, 1);
                    this.riGrid.AddColumnAlign('ReceiptRequired', MntConst.eAlignmentCenter);
                }
                //The following columns are only used within the export
                this.riGrid.AddColumn('ReplacementMonth', 'ServiceCover', 'ReplacementMonth', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ServiceEmployeeCode', 'ServiceCover', 'ServiceEmployeeCode', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ServiceEmployeeName', 'ServiceCover', 'ServiceEmployeeName', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('SpecialInstructions', 'ServiceCover', 'SpecialInstructions', MntConst.eTypeText, 10);

                this.riGrid.AddColumnScreen('ReplacementMonth', false);
                this.riGrid.AddColumnScreen('ServiceEmployeeCode', false);
                this.riGrid.AddColumnScreen('ServiceEmployeeName', false);
                this.riGrid.AddColumnScreen('SpecialInstructions', false);
                this.riGrid.AddColumnScreen('ContactName', false);
                this.riGrid.AddColumnScreen('ContactNumber', false);
                this.riGrid.AddColumnOrderable('BranchServiceAreaSeqNo', true);
                this.riGrid.AddColumnOrderable('ServiceVisitFrequency', true);
                this.riGrid.AddColumnOrderable('VisitsDueAndCompleted', true);
                this.riGrid.AddColumnOrderable('ServiceTypeCode', true);
                break;
            case 'Summary':
                this.riGrid.AddColumn('NextServiceVisitDate', 'ServiceCover', 'NextServiceVisitDate', MntConst.eTypeDate, 10);
                this.riGrid.AddColumnAlign('NextServiceVisitDate', MntConst.eAlignmentCenter);

                this.riGrid.AddColumn('ContractNumber', 'ServiceCover', 'ContractNumber', MntConst.eTypeCode, 10);
                this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);

                this.riGrid.AddColumn('PremiseNumber', 'ServiceCover', 'PremiseNumber', MntConst.eTypeInteger, 5);
                this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);

                this.riGrid.AddColumn('PremiseName', 'ServiceCover', 'PremiseName', MntConst.eTypeText, 14);
                this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);

                this.riGrid.AddColumn('PremiseAddressLine1', 'ServiceCover', 'PremiseAddressLine1', MntConst.eTypeText, 14);
                this.riGrid.AddColumnAlign('PremiseAddressLine1', MntConst.eAlignmentLeft);

                this.riGrid.AddColumn('PremiseTown', 'ServiceCover', 'PremiseTown', MntConst.eTypeText, 14);
                this.riGrid.AddColumnAlign('Premisetown', MntConst.eAlignmentLeft);
                if (this.systemChars['vEnablePostcodeDefaulting']) {
                    this.riGrid.AddColumn('Postcode', 'ServiceCover', 'Postcode', MntConst.eTypeCode, 9);
                    this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);
                }

                this.riGrid.AddColumn('ContactName', 'ServiceCover', 'ContactName', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ContactNumber', 'ServiceCover', 'ContactNumber', MntConst.eTypeText, 10);

                this.riGrid.AddColumn('CustomerTypeCode', 'ServiceCover', 'CustomerTypeCode', MntConst.eTypeCode, 12);
                this.riGrid.AddColumnAlign('CustomerTypeCode', MntConst.eAlignmentCenter);

                this.riGrid.AddColumn('ServiceNotifyInd', 'ServiceCover', 'ServiceNotifyInd', MntConst.eTypeImage, 1);
                this.riGrid.AddColumnAlign('ServiceNotifyInd', MntConst.eAlignmentCenter);

                this.riGrid.AddColumn('Concession', 'ServiceCover', 'Concession', MntConst.eTypeCode, 9);
                this.riGrid.AddColumnAlign('Concession', MntConst.eAlignmentLeft);

                if (this.systemChars['vEnableMapGridReference']) {
                    this.riGrid.AddColumn('GridRef', 'ServiceCover', 'GridRef', MntConst.eTypeCode, 15);
                    this.riGrid.AddColumnAlign('GridRef', MntConst.eAlignmentLeft);
                }
                if (this.systemChars['vEnableReceiptRequired']) {
                    this.riGrid.AddColumn('ReceiptRequired', 'ServiceCover', 'ReceiptRequired', MntConst.eTypeImage, 1);
                    this.riGrid.AddColumnAlign('ReceiptRequired', MntConst.eAlignmentCenter);
                }

                this.riGrid.AddColumnScreen('ContactName', false);
                this.riGrid.AddColumnScreen('ContactNumber', false);
                break;
        }
        this.riGrid.AddColumnOrderable('NextServiceVisitDate', true);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        if (this.systemChars['vEnablePostcodeDefaulting']) {
            this.riGrid.AddColumnOrderable('Postcode', true);
        }
        this.riGrid.Complete();
        this.riGridBeforeExecute();
    }

    public riGridBeforeExecute(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('BranchNumber', this.utils.getBranchCode());
        search.set('StartDate', this.getControlValue('StartDate'));
        search.set('EndDate', this.getControlValue('EndDate'));
        search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        search.set('ServicePlanNumber', this.getControlValue('ServicePlanNumber'));
        search.set('PostcodeFilter', this.getControlValue('PostcodeFilter'));
        search.set('SummaryDetail', this.getControlValue('SummaryDetail'));
        search.set('VisitTypeFilter', this.getControlValue('VisitTypeFilter'));
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        search.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        let sortOrder: any = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhr['method'], this.xhr['module'], this.xhr['operation'], search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.itemsPerPage : 1;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };
    //Grid Refresh
    public btnRefresh(): void {
        if (this.getControlValue('GridPageSize')) {
            this.itemsPerPage = this.getControlValue('GridPageSize');
        }
        this.currentPage = 1;
        this.riGrid.Mode = MntConst.eModeNormal;
        this.riGrid.RefreshRequired();
        this.buildGrid();
    }
    // pagination current page
    public getCurrentPage(currentPage: any): void {
        if (this.currentPage !== currentPage.value) {
            this.currentPage = currentPage.value;
            this.riGrid.RefreshRequired();
            this.riGridBeforeExecute();
        }
    }

    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    };

    public riGridAfterExecute(): void {
        let ArrInfo: Array<any>;
        if (this.riGrid.bodyArray.length > 0) {
            ArrInfo = this.riGrid.bodyArray[0][0].additionalData.split('|');
            this.setControlValue('SubtotalNoOfCalls', ArrInfo[0]);
            this.setControlValue('SubtotalNoOfExchanges', ArrInfo[1]);
            this.setControlValue('SubtotalTime', ArrInfo[2]);
            this.setControlValue('SubtotalNettValue', ArrInfo[3]);
            this.setControlValue('SubtotalWED', ArrInfo[4]);

        } else {
            this.setControlValue('SubtotalNoOfCalls', '0');
            this.setControlValue('SubtotalNoOfExchanges', '0');
            this.setControlValue('SubtotalTime', '00:00');
            this.setControlValue('SubtotalNettValue', '0');
            this.setControlValue('SubtotalWED', '0');
        }

    }
    public buildMenuOptions(): void {
        //Add options to the visit type filter
        this.buildVisitTypeOption('All', 'All Visit Types', true);
        this.buildVisitTypeOption('Routine', 'Routine', false);
        if (this.systemChars['vEnableInstallsRemovals']) {
            this.buildVisitTypeOption('Installation', 'Installation', false);
            this.buildVisitTypeOption('Removal', 'Removal', false);
        }
        this.buildVisitTypeOption('CancelRemove', 'Cancel And Remove', false);
        if (this.systemChars['vEnableInstallsRemovals']) {
            this.buildVisitTypeOption('Delivery', 'Delivery', false);
            this.buildVisitTypeOption('Repair', 'Repair', false);
        }
        this.buildVisitTypeOption('Urgent', 'Urgent', false);
        this.buildVisitTypeOption('Upgrade', 'Upgrade', false);
    }
    public buildVisitTypeOption(strValue: string, strText: string, isSelected: boolean): void {
        this.visitTypeFilter.push([strValue, strText]);
        if (isSelected) {
            this.setControlValue('VisitTypeFilter', strValue);
        }
    }

    public serviceCoverFocus(event: any): Object {
        let addElementNumber: number, obj: any, childParamsWorkList: Object;
        addElementNumber = (this.systemChars['vEnablePostcodeDefaulting']) ? 1 : 0;
        obj = event.srcElement.parentElement.parentElement.parentElement;
        switch (this.getControlValue('SummaryDetail')) {
            case 'Detail':
                childParamsWorkList = {
                    ContractRowID: obj.children[2].getAttribute('additionalproperty'),
                    PremiseRowID: obj.children[3].getAttribute('additionalproperty'),
                    ServiceCoverRowID: obj.children[6 + addElementNumber].getAttribute('additionalproperty'),
                    Row: obj.sectionRowIndex,
                    ContractType: obj.children[4].getAttribute('additionalproperty')
                };
                break;
            case 'Summary':
                childParamsWorkList = {
                    ContractRowID: obj.children[1].getAttribute('additionalproperty'),
                    PremiseRowID: obj.children[2].getAttribute('additionalproperty'),
                    Row: obj.sectionRowIndex,
                    ContractType: obj.children[3].getAttribute('additionalproperty')
                };
                break;
        }
        switch (childParamsWorkList['ContractType']) {
            case 'C':
                childParamsWorkList['currentContractType'] = '';
                break;
            case 'J':
                childParamsWorkList['currentContractType'] = '<job>';
                break;
            case 'P':
                childParamsWorkList['currentContractType'] = '<product>';
                break;
        }
        return childParamsWorkList;
    }

    public onDblClick(event: any): void {
        let destPath: string;
        let queryParams: any = this.serviceCoverFocus(event);
        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNumber':
                switch (queryParams.ContractType) {
                    case 'C':
                        destPath = ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE;
                        break;
                    case 'J':
                        destPath = ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE;
                        break;
                    case 'P':
                        destPath = ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE;
                        break;
                }
                this.navigate('ServicePlanning', destPath, queryParams);
                break;
            case 'PremiseNumber':
                this.navigate('ServicePlanning', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, queryParams);
                break;
            case 'ProductCode':
                if (queryParams.currentContractType === 'P')
                    this.navigate('ServicePlanning', InternalGridSearchSalesModuleRoutes.ICABSAPRODUCTSALESSCDETAILMAINTENANCE, queryParams);
                else {
                    switch (queryParams.ContractType) {
                        case 'C':
                            destPath = AppModuleRoutes.SERVICECOVERMAINTENANCE + ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCECONTRACT_SUB;
                            break;
                        case 'J':
                            destPath = AppModuleRoutes.SERVICECOVERMAINTENANCE + ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCEJOB_SUB;
                            break;
                        case 'P':
                            destPath = AppModuleRoutes.SERVICECOVERMAINTENANCE + ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCEREDUCE_SUB;
                            break;
                    }
                    this.navigate('ServicePlanning', destPath, queryParams);
                }
                break;
        }
    }
}
