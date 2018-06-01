import { Component, Injector, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { Utils } from './../../../shared/services/utility';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { RiExchange } from '../../../shared/services/riExchange';
import { HttpService } from '../../../shared/services/http-service';
import { ModalAdvService } from '../../../shared/components/modal-adv/modal-adv.service';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { GlobalizeService } from '../../../shared/services/globalize.service';


@Component({
    templateUrl: 'iCABSSePlanVisitSearch.html'
})

export class PlanVisitSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('statusOptionSelectDropdown') statusOptionSelectDropdown: DropdownStaticComponent;
    @ViewChild('visitFromDatepicker') visitFromDatepicker: DatepickerComponent;

    public pageId: string = '';
    public controls: any = [
        { name: 'ContractNumber', readonly: false, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: false, disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', readonly: false, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PlanVisitNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'VisitDueFromDate', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'StatusFilter', readonly: false, disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'ServiceCoverRowID', type: MntConst.eTypeText },
        { name: 'menu', type: MntConst.eTypeText }
    ];

    public riExchange: RiExchange;
    public utils: Utils;
    public serviceConstants: ServiceConstants;
    public formBuilder: FormBuilder;
    public httpService: HttpService;
    public ajaxSubscription: Subscription;
    public activatedRouteSubscription: Subscription;
    public activatedRoute: ActivatedRoute;
    public globalize: GlobalizeService;
    public modalAdvService: ModalAdvService;
    public sysCharConstants: SysCharConstants;
    public ajaxSource = new BehaviorSubject<any>(0);

    public parentMode: string = '';
    public uiForm: FormGroup;
    public querySysChar: URLSearchParams = new URLSearchParams();
    public dispLevelSearch: URLSearchParams = new URLSearchParams();
    public gridSearch: URLSearchParams = new URLSearchParams();
    public queryParams: any = {
        operation: 'Service/iCABSSePlanVisitSearch',
        module: 'plan-visits',
        method: 'service-planning/search'
    };
    public gridConfig: any = {
        pageSize: 10,
        currentPage: 1,
        totalRecords: 1,
        action: '2'
    };
    public statusOptions: any = [
        { text: 'All', value: 'All' },
        { text: 'Planned', value: 'P' },
        { text: 'In Planning', value: 'I' },
        { text: 'Unplanned', value: 'U' },
        { text: 'Cancelled', value: 'C' },
        { text: 'Visited', value: 'V' }
    ];
    public isRequesting: boolean = false;
    public vEnableServiceCoverDispLev: boolean = false;
    public serviceCoverRowId: string = '';
    public vbLookUpPDAICABSActivity: boolean = false;
    public visitDueDateDisplay: string = '';
    public visitDueDate: Date;

    constructor(injector: Injector) {
        super();
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSSEPLANVISITSEARCH;
    }

    ngOnInit(): void {
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.onWindowLoad();
    }

    ngOnDestroy(): void {
        this.serviceConstants = null;
        this.utils = null;
        this.formBuilder = null;
        this.riExchange = null;
        this.httpService = null;
        this.sysCharConstants = null;
        this.ajaxSource = null;
        this.modalAdvService = null;
        this.activatedRoute = null;
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
        if (this.activatedRouteSubscription) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    public injectServices(injector: Injector): void {
        this.formBuilder = injector.get(FormBuilder);
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
        this.httpService = injector.get(HttpService);
        this.riExchange = injector.get(RiExchange);
        this.globalize = injector.get(GlobalizeService);
        this.sysCharConstants = injector.get(SysCharConstants);
        this.modalAdvService = injector.get(ModalAdvService);
        this.activatedRoute = injector.get(ActivatedRoute);
    }

    public triggerFetchSysChar(): void {
        let sysCharNumber = this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel;
        this.fetchSysChar(sysCharNumber).subscribe((data) => {
            if (data.records && data.records.length > 0) {
                this.vEnableServiceCoverDispLev = (data.records[0].Required).toString();
            }
            this.buildGrid();
        });
    }

    public fetchSysChar(sysCharNumber: any): any {
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumber);
        return this.httpService.sysCharRequest(this.querySysChar);
    }

    private onWindowLoad(): void {
        this.activatedRouteSubscription = this.activatedRoute.queryParams
            .subscribe((param: any) => {
                if (param && param.fromPageNav) {
                    let params: any = {
                        parentMode: this.riExchange.getParentMode(),
                        ContractNumber: this.riExchange.getParentAttributeValue('ContractNumber'),
                        ContractName: this.riExchange.getParentAttributeValue('ContractName'),
                        PremiseNumber: this.riExchange.getParentAttributeValue('PremiseNumber'),
                        PremiseName: this.riExchange.getParentAttributeValue('PremiseName'),
                        ProductCode: this.riExchange.getParentAttributeValue('ProductCode'),
                        ProductDesc: this.riExchange.getParentAttributeValue('ProductDesc'),
                        ServiceCoverRowID: this.riExchange.getParentAttributeValue('ServiceCoverRowID'),
                        LastServiceVisitAnnivDate: this.riExchange.getParentAttributeValue('LastServiceVisitAnnivDate'),
                        EarliestVisitDueDate: this.riExchange.getParentAttributeValue('EarliestVisitDueDate')
                    };
                    this.updateView(params);
                    this.utils.setTitle('Plan Visit Details');
                }
            });
    }

    public updateView(params?: any): void {
        this.parentMode = params.parentMode;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', params.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', params.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', params.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', params.PremiseName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', params.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', params.ProductDesc);
        this.serviceCoverRowId = params.ServiceCoverRowID;
        if (params.parentMode === 'LookUp-PDAICABSActivity') {
            this.vbLookUpPDAICABSActivity = true;
        }
        if (params.parentMode === 'LookUp-CreditMissedService') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'StatusFilter', 'All');
            this.visitDueDateDisplay = params.LastServiceVisitAnnivDate;
            this.visitDueDate = new Date(this.utils.formatDate(this.visitDueDateDisplay));
        } else {
            this.visitDueDate = new Date(new Date().getFullYear(), 0, 1);
            this.visitDueDateDisplay = this.utils.formatDate(this.visitDueDate);
            if (params.parentMode === 'LookUp-PDAICABSActivity') {
                let earliestVisitDueDate: any = null;
                earliestVisitDueDate = params.EarliestVisitDueDate;
                if (earliestVisitDueDate) {
                    if (this.utils.formatDate(earliestVisitDueDate) < this.visitDueDateDisplay) {
                        this.visitDueDateDisplay = earliestVisitDueDate;
                    }
                }
            }
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitDueFromDate', this.visitDueDateDisplay);
        this.triggerFetchSysChar();
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.FunctionPaging = true;

        this.riGrid.AddColumn('OriginalVisitDueDate', 'PlanVisit', 'OriginalVisitDueDate', MntConst.eTypeDate, 10, true);
        this.riGrid.AddColumnAlign('OriginalVisitDueDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PlannedVisitDate', 'PlanVisit', 'PlannedVisitDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('PlannedVisitDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PlanVisitNumber', 'PlanVisit', 'PlanVisitNumber', MntConst.eTypeInteger, 7, true);
        this.riGrid.AddColumnAlign('PlanVisitNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PlanVisitStatusDesc', 'PlanVisit', 'PlanVisitStatusDesc', MntConst.eTypeText, 30);
        this.riGrid.AddColumnAlign('PlanVisitStatusDesc', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('VisitTypeDesc', 'PlanVisit', 'VisitTypeDesc', MntConst.eTypeText, 30);
        this.riGrid.AddColumnAlign('VisitTypeDesc', MntConst.eAlignmentCenter);

        if (this.vbLookUpPDAICABSActivity) {
            this.riGrid.AddColumn('ServiceVisitText', 'PlanVisit', 'ServiceVisitText', MntConst.eTypeText, 30);
            this.riGrid.AddColumnAlign('ServiceVisitText', MntConst.eAlignmentCenter);
        }

        if (this.vEnableServiceCoverDispLev) {
            let formData: any = {};
            formData['Function'] = 'DisplayLevelProduct';
            formData['ProductCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
            this.dispLevelSearch.set(this.serviceConstants.Action, '6');
            this.dispLevelSearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.dispLevelSearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.ajaxSource.next(AjaxConstant.START);
            this.isRequesting = true;
            this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.dispLevelSearch, formData).subscribe(
                (e) => {
                    this.ajaxSource.next(AjaxConstant.COMPLETE);
                    this.isRequesting = false;
                    if (!e.hasError) {
                        if (e.DisplayLevelInd === 'yes') {
                            this.riGrid.AddColumn('ItemDescription', 'PlanVisit', 'ItemDescription', MntConst.eTypeText, 30);
                            this.riGrid.AddColumnAlign('ItemDescription', MntConst.eAlignmentCenter);

                            this.riGrid.AddColumn('ProductComponentCode', 'PlanVisit', 'ProductComponentCode', MntConst.eTypeText, 6);
                            this.riGrid.AddColumnAlign('ProductComponentCode', MntConst.eAlignmentCenter);

                            this.riGrid.AddColumn('ProductComponentDesc', 'PlanVisit', 'ProductComponentDesc', MntConst.eTypeText, 30);
                            this.riGrid.AddColumnAlign('ProductComponentDesc', MntConst.eAlignmentCenter);
                        }
                    }
                    this.riGrid.Complete();
                    this.populateGrid();
                },
                (error) => {
                    this.ajaxSource.next(AjaxConstant.COMPLETE);
                    this.isRequesting = false;
                });
        } else {
            this.riGrid.Complete();
            this.populateGrid();
        }
    }

    public visitDueDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitDueFromDate', value.value);
        }
    }

    public populateGrid(): void {
        this.gridSearch.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.gridSearch.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.gridSearch.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.gridSearch.set('ContractName', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'));
        this.gridSearch.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.gridSearch.set('PremiseName', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'));
        this.gridSearch.set('ServiceCoverRowID', this.serviceCoverRowId);
        this.gridSearch.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.gridSearch.set('ProductDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDesc'));
        this.gridSearch.set('VisitDueFromFilter', this.globalize.parseDateToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitDueFromDate')).toString());
        this.gridSearch.set('StatusFilter', this.statusOptionSelectDropdown.selectedItem);
        this.gridSearch.set('LookUpPDAICABSActivity', this.vbLookUpPDAICABSActivity ? 'yes' : 'no');

        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.gridSearch.set(this.serviceConstants.GridMode, '0');
        this.gridSearch.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.gridSearch.set(this.serviceConstants.PageSize, this.gridConfig.pageSize.toString());
        this.gridSearch.set(this.serviceConstants.PageCurrent, this.gridConfig.currentPage.toString());
        this.gridSearch.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        this.gridSearch.set(this.serviceConstants.GridSortOrder, sortOrder);
        this.gridSearch.set(this.serviceConstants.Action, this.gridConfig.action.toString());

        this.ajaxSource.next(AjaxConstant.START);
        this.isRequesting = true;
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.gridSearch)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                this.isRequesting = false;
                if (!e.hasError) {
                    this.riGrid.RefreshRequired();
                    this.riGridPagination.currentPage = this.gridConfig.currentPage = e.pageData ? e.pageData.pageNumber : 1;
                    this.riGridPagination.totalItems = this.gridConfig.totalRecords = e.pageData ? e.pageData.lastPageNumber * this.gridConfig.pageSize : 1;
                    this.riGrid.Execute(e);
                }
            },
            (error) => {
                this.isRequesting = false;
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }

    // Refresh the grid data on user click
    public riGrid_onRefresh(): void {
        if (this.riGrid.currentPage <= 0) {
            this.riGrid.currentPage = 1;
        }
        this.riGrid.RefreshRequired();
        this.buildGrid();
    }

    // Callback to retrieve the current page on user clicks
    public getCurrentPage(currentPage: any): void {
        this.gridConfig.currentPage = currentPage.value;
        this.riGrid_onRefresh();
    }

    public riGrid_BodyOnClick(event: Event): void {
        let returnObj: any;
        switch (this.parentMode) {
            case 'Credit-LookUp1':
                returnObj = {
                    'PlanVisitNumber1': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart1': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'Credit-LookUp2':
                returnObj = {
                    'PlanVisitNumber2': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart2': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'Credit-LookUp3':
                returnObj = {
                    'PlanVisitNumber3': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart3': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'Credit-LookUp4':
                returnObj = {
                    'PlanVisitNumber4': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart4': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'Credit-LookUp5':
                returnObj = {
                    'PlanVisitNumber5': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart5': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'Credit-LookUp6':
                returnObj = {
                    'PlanVisitNumber6': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart6': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'Credit-LookUp7':
                returnObj = {
                    'PlanVisitNumber7': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart7': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'Credit-LookUp8':
                returnObj = {
                    'PlanVisitNumber8': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart8': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'Credit-LookUp9':
                returnObj = {
                    'PlanVisitNumber9': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart9': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'Credit-LookUp10':
                returnObj = {
                    'PlanVisitNumber10': this.riGrid.Details.GetValue('PlanVisitNumber'),
                    'ServiceDateStart10': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            case 'ServiceCover':
                //  this.navigate('Search', 'planvisitmaintenance_path'); //Path for Service/iCABSSePlanVisitMaintenance2.htm
                this.modalAdvService.emitMessage(new ICabsModalVO('Service/iCABSSePlanVisitMaintenance2.htm - This screen is not yet developed!'));
                break;
            case 'LookUp-PDAICABSActivity':
            case 'LookUp-VisitRejections':
                returnObj = {
                    'PlanVisitNumber': this.riGrid.Details.GetValue('PlanVisitNumber')
                };
                break;
            case 'ComponentReplacement':
                returnObj = {
                    'VisitDate': this.riGrid.Details.GetValue('OriginalVisitDueDate')
                };
                break;
            default:
                returnObj = {
                    'PlanVisitRowID': this.riGrid.Details.GetAttribute('PlanVisitNumber', 'RowID'),
                    'PlanVisitNumber': this.riGrid.Details.GetValue('PlanVisitNumber')
                };
                break;
        }
        this.emitSelectedData(returnObj);
    }

    public menuOptionsChange(event: any): void {
        switch (event) {
            case 'AddPlanVisit':
                // this.navigate('SearchAdd', 'planvisitmaintenance_path'); //Path for Service/iCABSSePlanVisitMaintenance2.htm
                this.modalAdvService.emitMessage(new ICabsModalVO('Service/iCABSSePlanVisitMaintenance.htm - This screen is not yet developed!'));
                break;
            default:
                break;
        }
    }
}
