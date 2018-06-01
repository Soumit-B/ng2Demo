import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { ContractManagementModuleRoutes, InternalGridSearchSalesModuleRoutes, AppModuleRoutes } from '../../base/PageRoutes';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

@Component({
    templateUrl: 'iCABSSeServiceWorkListDateGrid.html'
})

export class ServiceWorkListDateGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('serviceWorkListPagination') serviceWorkListPagination: PaginationComponent;
    private queryParams: any = {
        operation: 'Service/iCABSSeServiceWorkListDateGrid',
        module: 'manual-service',
        method: 'service-delivery/grid'
    };

    public pageId: string = '';
    public isHidePagination: boolean = true;
    public controls = [
        { name: 'BranchServiceAreaCode', required: true, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', disabled: true },
        { name: 'PostcodeFilter' },
        { name: 'VisitTypeFilter', value: 'All' },
        { name: 'SummaryDetail', value: 'Summary' },
        { name: 'GridPageSize', required: true },
        { name: 'SubtotalNoOfCalls', disabled: true },
        { name: 'SubtotalNoOfExchanges', disabled: true },
        { name: 'SubtotalWED', disabled: true },
        { name: 'SubtotalTime', disabled: true },
        { name: 'SubtotalNettValue', disabled: true },
        { name: 'StartDate', type: MntConst.eTypeDate, required: true },
        { name: 'EndDate', type: MntConst.eTypeDate, required: true },
        { name: 'ServicePlanNumber' },
        { name: 'WeekNumber' }

    ];
    public buildVisitTypeList: Array<any> = [
        { value: 'All', text: 'All Visit Types' },
        { value: 'Routine', text: 'Routine' },
        { value: 'CancelRemove', text: 'Cancel And Remove' },
        { value: 'Urgent', text: 'Urgent' },
        { value: 'Upgrade', text: 'Upgrade' }
    ];
    public pageCurrent: number = 1;
    public pageSize: number;
    public vbEndofWeekDate: number = 1;
    public totalItems: number;
    public bracnhSearch: any = BranchServiceAreaSearchComponent;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public inputParamsBranchSearchSearch: any = {
        parentMode: 'LookUp-Emp'
    };
    public isOpenBranch: boolean = false;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEWORKLISTDATEGRID;
        this.browserTitle = this.pageTitle = 'Service Work List by Date';
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    public ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.beforeExecute();
            this.loadData();
        } else {
            const controlsSize: number = this.controls.length;
            for (let i = 0; i < controlsSize; i++) {
                this.riExchange.getParentHTMLValue(this.controls[i].name);
            }
            this.setControlValue('BranchServiceAreaCode', this.riExchange.getParentHTMLValue('BranchServiceAreaCode') ? this.riExchange.getParentHTMLValue('BranchServiceAreaCode') : '');
            this.pageSize = 20;
            this.setControlValue('GridPageSize', this.pageSize.toString());
            this.isOpenBranch = true;
            this.getSysCharDtetails();
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private getSysCharDtetails(): void {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharEnableMapGridReference,
            this.sysCharConstants.SystemCharEnableReceiptRequired,
            this.sysCharConstants.SystemCharEnableWED
        ];
        let sysCharIP: any = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            if (data.records[0]) {
                this.pageParams.vbEnableInstallsRemovals = data.records[0]['Required'];
            }
            if (data.records[1]) {
                this.pageParams.vbEnablePostcodeDefaulting = data.records[1]['Required'];
            }
            if (data.records[2]) {
                this.pageParams.vbEnableMapGridReference = data.records[2]['Required'];
            }
            if (data.records[3]) {
                this.pageParams.vbEnableReceiptRequired = data.records[3]['Required'];
            }
            if (data.records[4]) {
                this.pageParams.vbEnableWED = data.records[4]['Required'];
            }
            if (this.pageParams.vbEnableInstallsRemovals) {
                this.buildVisitTypeList.splice(2, 0, { value: 'Installation', text: 'Installation' });
                this.buildVisitTypeList.splice(3, 0, { value: 'Removal', text: 'Removal' });
                this.buildVisitTypeList.splice(5, 0, { value: 'Delivery', text: 'Delivery' });
                this.buildVisitTypeList.splice(6, 0, { value: 'Repair', text: 'Repair' });
            }
            this.doLookUpForSystemParameter();
        });
    }

    private doLookUpForSystemParameter(): void {
        let lookupIP: Array<any> = [
            {
                'table': 'SystemParameter',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['SystemParameterEndOfWeekDay']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            if (data.length) {
                if (data[0].length) {
                    let systemParamsRecord: any = data[0][0];
                    if (systemParamsRecord.SystemParameterEndOfWeekDay < 7)
                        this.vbEndofWeekDate = systemParamsRecord.SystemParameterEndOfWeekDay;
                }
            }
            this.setDate();
            this.beforeExecute();
        }
        ).catch(e => {
            this.setDate();
        });
    }

    private setDate(): void {
        let currentDate: Date = new Date();
        let dayofWeek: number = 7 - (currentDate.getDay() + 1);
        let totaldayofweek: number = dayofWeek + this.vbEndofWeekDate;
        this.setControlValue('StartDate', this.globalize.parseDateToFixedFormat(this.utils.addDays(currentDate, (totaldayofweek + 1))) as string);
        this.setControlValue('EndDate', this.globalize.parseDateToFixedFormat(this.utils.addDays(currentDate, (totaldayofweek + 7))) as string);
    }

    private getEmployeeSurname(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        let formData: any = {};
        formData[this.serviceConstants.Function] = 'GetEmployeeSurname';
        formData['BranchNumber'] = this.utils.getBranchCode();
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.setControlValue('EmployeeSurname', data.EmployeeSurname);
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.setControlValue('EmployeeSurname', '');
            });
    }

    private beforeExecute(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('PlanNo', 'ServiceCover', 'PlanNo', MntConst.eTypeCode, 4);
        this.riGrid.AddColumnAlign('PlanNo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceArea', 'ServiceCover', 'ServiceArea', MntConst.eTypeCode, 4);
        this.riGrid.AddColumnAlign('ServiceArea', MntConst.eAlignmentCenter);
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
                if (this.pageParams.vbEnablePostcodeDefaulting) {
                    this.riGrid.AddColumn('Postcode', 'ServiceCover', 'Postcode', MntConst.eTypeText, 9);
                    this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);
                }
                this.riGrid.AddColumn('ContactName', 'ServiceCover', 'ContactName', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ContactNumber', 'ServiceCover', 'ContactNumber', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ProductCode', 'ServiceCover', 'ProductCode', MntConst.eTypeCode, 6);
                this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('ProductDesc', 'ServiceCover', 'ProductDesc', MntConst.eTypeText, 20);
                this.riGrid.AddColumnScreen('ProductDesc', false);
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
                if (this.pageParams.vbEnableMapGridReference) {
                    this.riGrid.AddColumn('GridRef', 'ServiceCover', 'GridRef', MntConst.eTypeCode, 15);
                    this.riGrid.AddColumnAlign('GridRef', MntConst.eAlignmentLeft);
                }
                if (this.pageParams.vbEnableReceiptRequired) {
                    this.riGrid.AddColumn('ReceiptRequired', 'ServiceCover', 'ReceiptRequired', MntConst.eTypeImage, 1);
                    this.riGrid.AddColumnAlign('ReceiptRequired', MntConst.eAlignmentCenter);
                }
                this.riGrid.AddColumn('ReplacementMonth', 'ServiceCover', 'ReplacementMonth', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ServiceEmployeeCode', 'ServiceCover', 'ServiceEmployeeCode', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ServiceEmployeeName', 'ServiceCover', 'ServiceEmployeeName', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('SpecialInstructions', 'ServiceCover', 'SpecialInstructions', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ProductDetail', 'ServiceCover', 'ProductDetail', MntConst.eTypeText, 40);
                this.riGrid.AddColumn('ProductDetailDesc', 'ServiceCover', 'ProductDetailDesc', MntConst.eTypeText, 40);
                this.riGrid.AddColumn('CallOut', 'ServiceCover', 'CallOut', MntConst.eTypeText, 40);
                this.riGrid.AddColumnScreen('ProductDetail', false);
                this.riGrid.AddColumnScreen('ProductDetailDesc', false);
                this.riGrid.AddColumnScreen('CallOut', false);
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
                this.riGrid.AddColumnOrderable('ServiceArea', true);
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
                this.riGrid.AddColumnAlign('PremiseTown', MntConst.eAlignmentLeft);
                if (this.pageParams.vbEnablePostcodeDefaulting) {
                    this.riGrid.AddColumn('Postcode', 'ServiceCover', 'Postcode', MntConst.eTypeText, 9);
                    this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);
                }
                this.riGrid.AddColumn('ContactName', 'ServiceCover', 'ContactName', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ContactNumber', 'ServiceCover', 'ContactNumber', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('CustomerTypeCode', 'ServiceCover', 'CustomerTypeCode', MntConst.eTypeCode, 12);
                this.riGrid.AddColumnAlign('CustomerTypeCode', MntConst.eAlignmentCenter);
                this.riGrid.AddColumn('Concession', 'ServiceCover', 'Concession', MntConst.eTypeCode, 9);
                this.riGrid.AddColumnAlign('Concession', MntConst.eAlignmentLeft);
                if (this.pageParams.vbEnableMapGridReference) {
                    this.riGrid.AddColumn('GridRef', 'ServiceCover', 'GridRef', MntConst.eTypeCode, 15);
                    this.riGrid.AddColumnAlign('GridRef', MntConst.eAlignmentLeft);
                }
                if (this.pageParams.vbEnableReceiptRequired) {
                    this.riGrid.AddColumn('ReceiptRequired', 'ServiceCover', 'ReceiptRequired', MntConst.eTypeImage, 1);
                    this.riGrid.AddColumnAlign('ReceiptRequired', MntConst.eAlignmentCenter);
                }
                this.riGrid.AddColumnScreen('ContactName', false);
                this.riGrid.AddColumnScreen('ContactNumber', false);
                this.riGrid.AddColumnOrderable('PremiseTown', true);
                this.riGrid.AddColumnOrderable('ServiceArea', true);
                break;
        }
        this.riGrid.AddColumnOrderable('PlanNo', true);
        this.riGrid.AddColumnOrderable('NextServiceVisitDate', true);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('PremiseName', true);
        this.riGrid.AddColumnOrderable('PremiseAddressLine1', true);
        if (this.pageParams.vbEnablePostcodeDefaulting)
            this.riGrid.AddColumnOrderable('Postcode', true);
        this.riGrid.Complete();
    }

    private loadData(): void {
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
        search.set('GridType', 'DateGrid');
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        search.set('riSortOrder', this.riGrid.SortOrder);
        search.set('riCacheRefresh', 'True');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                this.totalItems = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                this.riGrid.UpdateHeader = true;
                this.riGrid.UpdateBody = true;
                this.riGrid.Execute(data);
                this.isHidePagination = false;
                this.serviceWorkListPagination.totalItems = this.totalItems;
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private serviceCoverFocus(event: any): any {
        let addElementNumber: number;
        let queryParams: any;
        let obj: any = event.srcElement.parentElement.parentElement.parentElement;
        addElementNumber = this.pageParams.vbEnablePostcodeDefaulting ? 1 : 0;
        switch (this.getControlValue('SummaryDetail')) {
            case 'Detail':
                queryParams = {
                    ContractRowID: obj.children[4].getAttribute('additionalProperty'),
                    PremiseRowID: obj.children[5].getAttribute('additionalProperty'),
                    ServiceCoverRowID: obj.children[8 + addElementNumber].getAttribute('additionalProperty'),
                    Row: event.srcElement.parentElement.parentElement.parentElement.sectionRowIndex,
                    currentContractType: obj.children[6].getAttribute('additionalProperty')
                };
                break;
            case 'Summary':
                queryParams = {
                    ContractRowID: obj.children[3].getAttribute('additionalProperty'),
                    PremiseRowID: obj.children[4].getAttribute('additionalProperty'),
                    Row: event.srcElement.parentElement.parentElement.parentElement.sectionRowIndex,
                    currentContractType: obj.children[5].getAttribute('additionalProperty')
                };
                break;
        }
        switch (queryParams.currentContractType) {
            case 'C':
                queryParams['currentContractTypeURLParameter'] = '';
                break;
            case 'J':
                queryParams['currentContractTypeURLParameter'] = '<job>';
                break;
            case 'P':
                queryParams['currentContractTypeURLParameter'] = '<product>';
                break;
        }
        return queryParams;
    }

    public onStartDateChange(event: any): void {
        if (event && event.value) {
            this.setControlValue('StartDate', event.value);
        }
    }

    public onEndDateChange(event: any): void {
        if (event && event.value) {
            this.setControlValue('EndDate', event.value);
        }
    }

    public onBranchSearchDataReturn(event: any): void {
        this.setControlValue('BranchServiceAreaCode', event.BranchServiceAreaCode);
        this.setControlValue('EmployeeSurname', event.EmployeeSurname);
    }


    public onEmployeeSurnameChange(): void {
        this.getEmployeeSurname();
    }

    public onSummaryDetailChange(): void {
        this.riGrid.Clear();
        this.isHidePagination = true;
        this.riGrid.HeaderClickedColumn = '';
        this.beforeExecute();
        this.riGrid.RefreshRequired();
    }

    public onSuccessGridLoad(): void {
        this.setControlValue('SubtotalNoOfCalls', '0');
        this.setControlValue('SubtotalNoOfExchanges', '0');
        this.setControlValue('SubtotalTime', '00:00');
        this.setControlValue('SubtotalNettValue', '0');
        this.setControlValue('SubtotalWED', '0');
        if (this.riGrid.bodyArray.length) {
            let arrayInfo: Array<any> = this.riGrid.bodyArray[0][2].additionalData.split('|');
            this.setControlValue('SubtotalNoOfCalls', arrayInfo[0]);
            this.setControlValue('SubtotalNoOfExchanges', arrayInfo[1]);
            this.setControlValue('SubtotalTime', arrayInfo[2]);
            this.setControlValue('SubtotalNettValue', arrayInfo[3]);
            this.setControlValue('SubtotalWED', arrayInfo[4]);
        }
        this.riExchange.riInputElement.isError(this.uiForm, 'SubtotalNoOfCalls');
        this.riExchange.riInputElement.isError(this.uiForm, 'SubtotalNoOfExchanges');
        this.riExchange.riInputElement.isError(this.uiForm, 'SubtotalNettValue');
        this.riExchange.riInputElement.isError(this.uiForm, 'SubtotalWED');
    }

    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        this.loadData();
    }

    public onRefresh(): void {
        if (this.getControlValue('GridPageSize')) {
            this.pageSize = this.getControlValue('GridPageSize');
        }
        this.loadData();
    }

    public onHeaderClick(): void {
        this.loadData();
    }

    public onGridRowClick(event: any): void {
        let destPath: string;
        let queryParams: any = this.serviceCoverFocus(event);
        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNumber':
                switch (queryParams.currentContractType) {
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
                    switch (queryParams.currentContractType) {
                        case 'C':
                            destPath = AppModuleRoutes.SERVICECOVERMAINTENANCE + ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCECONTRACT_SUB;
                            break;
                        case 'J':
                            destPath = AppModuleRoutes.SERVICECOVERMAINTENANCE + ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCEJOB_SUB;
                            break;
                    }
                    this.navigate('ServicePlanning', destPath, queryParams);
                }

                break;
        }
    }

}
