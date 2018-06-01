import { InternalMaintenanceApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { NavData } from './../../../shared/services/navigationData';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { HttpService } from '../../../shared/services/http-service';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams, Http } from '@angular/http';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { RefreshComponent } from './../../../shared/components/refresh/refresh';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { PremiseLocationSearchComponent } from '../../internal/search/iCABSAPremiseLocationSearch.component';
import { VariableService } from '../../../shared/services/variable.service';

@Component({
    templateUrl: 'iCABSAServiceCoverDisplayGrid.html',
    styles: [`
     :host /deep/ .gridtable tbody tr td:nth-child(7){
        white-space: nowrap; 
    }
    :host /deep/ .gridtable tbody tr td:nth-child(8){
        width:8%;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(8)  input{
        width:60%;
        float:left;
    }
  `]
})

export class ServiceCoverDisplayGridComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    private lookUpSubscription: Subscription;
    private ServiceCommenceDate: string;
    private AccountNumber: string;
    private LastChangeEffectDate: string;
    private ServiceBranchNumber: string;
    private NegBranchNumber: string;
    private RequiresManualVisitPlanningInd: string;
    private AnnualCalendarInd: string;
    private EmployeeLimitChildDrillOptions: string;
    private InstallByBranchInd: string = 'false';
    public showErrorHeader: boolean = true;
    public queryLookUp: URLSearchParams = new URLSearchParams();
    private search: URLSearchParams;
    public inputParams: any = {};
    public method: string = 'contract-management/maintenance';
    public module: string = 'contract-admin';
    public operation: string = 'Application/iCABSAServiceCoverDisplayGrid';
    private showFutureChanges: boolean = true;
    public pageCurrent: number = 1;
    public pageSize: number = 10;
    public maxColumn: number = 14;
    public totalItems: number;
    private ServiceCoverMode: string;
    private btnMassValue: boolean = true;
    private trAddDisplay: boolean = true;
    private trMatchDisplayValues: boolean = true;
    private trExpectedTotals: boolean = false;
    private Status: string = 'Current';
    private updatemode: boolean = false;
    private isAddButtonClick: boolean = false;
    private deleteDisplay: boolean = false;
    private selectedRowId: string;
    private selectedPremisesNumber: string;
    public canDeactivateObservable: Observable<boolean>;
    public promptTitle: string = MessageConstant.Message.ErrorTitle;
    public promptContent: string = MessageConstant.PageSpecificMessage.ExpectedAndActualDoNotMatch;
    public isRequesting: boolean = false;
    public promptModalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public premiseLocationEllipsis = {
        disabled: false,
        showHeader: true,
        showCloseButton: true,
        childConfigParams: {
            'parentMode': 'DisplayGrid'
        },
        component: PremiseLocationSearchComponent
    };
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: false },
        { name: 'ContractName', readonly: true, disabled: true, required: false },
        { name: 'ExpectedTotalQty', readonly: false, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'ExpectedTotalValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
        { name: 'PremiseName', readonly: true, disabled: true, required: false },
        { name: 'TotalQty', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'TotalValue', readonly: true, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'TotalWEDValue', readonly: true, disabled: true, required: false, type: MntConst.eTypeDecimal1 },
        { name: 'ProductCode', readonly: true, disabled: true, required: false },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false },
        { name: 'ServiceCoverROWID', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverNumber', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverItemRowID', readonly: false, disabled: false, required: false },
        { name: 'EffectiveDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'ServiceCoverMode', readonly: false, disabled: false, required: false },
        { name: 'EmployeeLimitChildDrillOptions', readonly: false, disabled: false, required: false },
        { name: 'ServiceCommenceDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'ServiceCoverItemNumber', readonly: false, disabled: false, required: false },
        { name: 'RequiresManualVisitPlanningInd', readonly: false, disabled: false, required: false },
        { name: 'AccountNumber', readonly: false, disabled: false, required: false },
        { name: 'ServiceBranchNumber', readonly: false, disabled: false, required: false },
        { name: 'NegBranchNumber', readonly: false, disabled: false, required: false },
        { name: 'AnnualCalendarInd', readonly: false, disabled: false, required: false },
        { name: 'ServiceQuantity' },
        { name: 'ServiceAnnualValue' }

    ];

    constructor(private injector: Injector, private _httpService: HttpService, private _router: Router, private variableService: VariableService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERDISPLAYGRID;
    }
    @ViewChild('serviceCoverDisplayGrid') serviceCoverDisplayGrid: GridComponent;
    @ViewChild('serviceCoverDisplayPagination') serviceCoverDisplayPagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('refreshBtn') public refreshBtn: RefreshComponent;
    ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.riGrid.DefaultBorderColor = 'DDDDDD';
        this.riGrid.FunctionPaging = true;
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.populateUIFromFormData();
        // this.doLookUpForData(
        if (this.parentMode !== 'GroupServiceVisit' && this.parentMode !== 'DespatchGrid') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            //   this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentAttributeValue('ContractName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            //   this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentAttributeValue('PremiseName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
            //   this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentAttributeValue('ProductDesc'));
            this.ServiceCommenceDate = this.globalize.parseDateToFixedFormat(this.riExchange.getParentHTMLValue('ServiceCommenceDate')) as string;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCommenceDate', this.riExchange.getParentHTMLValue('ServiceCommenceDate'));
            this.setControlValue('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
            this.setControlValue('EffectiveDate', this.globalize.parseDateToFixedFormat(this.riExchange.getParentHTMLValue('LastChangeEffectDate')) as string);
            this.setControlValue('ServiceBranchNumber', this.riExchange.getParentHTMLValue('ServiceBranchNumber'));
            this.setControlValue('NegBranchNumber', this.riExchange.getParentHTMLValue('NegBranchNumber'));
            this.setControlValue('RequiresManualVisitPlanningInd', this.riExchange.getParentHTMLValue('RequiresManualVisitPlanningInd'));
            this.setControlValue('AnnualCalendarInd', this.riExchange.getParentHTMLValue('AnnualCalendarInd'));
            //this.EmployeeLimitChildDrillOptions = this.riExchange.getParentAttributeValue('EmployeeLimitChildDrillOptions');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeLimitChildDrillOptions', this.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions'));
        }
        this.riGrid.FunctionUpdateSupport = true;
        this.beforeExecute();
        this.pageSetup();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
    }

    private beforeExecute(showDeleteDisplay?: boolean): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ItemDescription', 'Display', 'ItemDescription', MntConst.eTypeCode, 20);
        this.riGrid.AddColumn('Component1', 'Display', 'Component1', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('Component2', 'Display', 'Component2', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('Component3', 'Display', 'Component3', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('CommenceDate', 'Display', 'CommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('WEDValue', 'Display', 'WEDValue', MntConst.eTypeDecimal1, 6);
        this.riGrid.AddColumn('AnnualValue', 'Display', 'AnnualValue', MntConst.eTypeCurrency, 6);
        this.riGrid.AddColumn('PremiseLocationNumber', 'Display', 'PremiseLocationNumber', MntConst.eTypeEllipsis, 4);
        this.riGrid.AddColumn('PremiseLocationDesc', 'Display', 'PremiseLocationDesc', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('InstallationDate', 'Display', 'InstallationDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('InstallVisitNumber', 'Display', 'InstallVisitNumber', MntConst.eTypeImage, 6);
        this.riGrid.AddColumn('RemovalVisitNumber', 'Display', 'RemovalVisitNumber', MntConst.eTypeImage, 6);
        this.riGrid.AddColumn('ActualRemovalDate', 'Display', 'ActualRemovalDate', MntConst.eTypeImage, 10);
        this.riGrid.AddColumn('RemovalDate', 'Display', 'RemovalDate', MntConst.eTypeImage, 10);
        if (this.parentMode === 'ServiceCoverAdd' || this.parentMode === 'ServiceCoverUpdate') {
            this.riGrid.AddColumn('DeleteDisplay', 'Display', 'DeleteDisplay', MntConst.eTypeImage, 1);
        }
        if (showDeleteDisplay) {
            this.riGrid.AddColumn('DeleteDisplay', 'Display', 'DeleteDisplay', MntConst.eTypeImage, 1);
        }
        this.riGrid.AddColumnAlign('AnnualValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('WEDValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('PremiseLocationNumber', MntConst.eAlignmentRight);
        this.riGrid.AddColumnUpdateSupport('PremiseLocationNumber', true);
        this.riGrid.AddEllipsisControl('PremiseLocationNumber', this.premiseLocationEllipsis, 'PremiseLocationNumber');
        this.riGrid.Complete();
    }

    private pageSetup(): void {
        switch (this.parentMode) {
            case 'GroupServiceVisit':
                this.ServiceCoverMode = 'GroupServiceVisit';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', '');
                this.trAddDisplay = false;
                this.trMatchDisplayValues = false;
                this.btnMassValue = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('BranchServiceAreaCodeServiceCoverRowID'));
                //   this.doLookUpForServiceCoverData();
                break;
            case 'DespatchGrid':
                this.ServiceCoverMode = 'DespatchGrid';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', '');
                this.trAddDisplay = false;
                this.trMatchDisplayValues = false;
                this.btnMassValue = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('ServiceAreaListCodeServiceCoverRowID'));

                // this.doLookUpForServiceCoverData();
                break;

            case 'ServiceCoverAdd':
                this.ServiceCoverMode = 'ServiceCoverAdd';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverMode', 'ServiceCoverAdd');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', this.ServiceCommenceDate);
                this.InstallByBranchInd = this.riExchange.getParentHTMLValue('InstallByBranchInd');
                this.showFutureChanges = false;
                this.btnMassValue = false;
                this.trExpectedTotals = true;
                this.deleteDisplay = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('ServiceCover'));
                this.maxColumn = 15;
                break;
            case 'ServiceCoverUpdate':
                this.ServiceCoverMode = 'ServiceCoverAdd';
                this.ServiceCommenceDate = this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCommenceDate', this.ServiceCommenceDate);
                this.showFutureChanges = false;
                this.trExpectedTotals = true;
                this.btnMassValue = false;
                this.deleteDisplay = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('ServiceCover'));
                this.maxColumn = 15;
                break;

            default:
                this.ServiceCoverMode = 'Normal';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', '');
                this.trAddDisplay = false;
                this.trMatchDisplayValues = false;
                this.maxColumn = 14;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('ServiceCover'));
                this.ShowFutureChanges(this.inputParams);
                break;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverMode', this.ServiceCoverMode);
        this.doLookUpForServiceCoverData();
        this.doLookUpForOtherData();
        this.riGrid_BeforeExecute();
    }

    public doLookUpForOtherData(): void {
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName', 'NegBranchNumber']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseName', 'AccountNumber']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
                },
                'fields': ['ProductDesc', 'RequiresManualVisitPlanningInd']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Contract = data[0][0];
            if (Contract) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', Contract.ContractName);
            }
            let Premise = data[1][0];
            if (Premise) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', Premise.PremiseName);
            }
            let Product = data[2][0];
            if (Product) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', Product.ProductDesc);
            }
        });
    }

    public doLookUpForServiceCoverData(): void {
        let lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    'ROWID': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID')

                },

                'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCoverNumber', 'ServiceCommenceDate', 'ServiceBranchNumber', 'AnnualCalendarInd']
            }];

        this.lookUpRecord(JSON.parse(JSON.stringify(lookupIP))).subscribe(
            (e) => {
                try {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', e.results[0][0].ServiceCoverNumber);
                    if (this.ServiceCoverMode === 'Normal') {
                        this.callShowDelete(this.inputParams);
                    }
                    this.updateView();
                } catch (e) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', '');
                }
            },
            (error) => {
                if (error.errorMessage) {
                    this.errorModal.show(error, true);
                }
            }
        );
    }

    public lookUpRecord(data: any): any {
        this.queryLookUp.set(this.serviceConstants.Action, '5');
        this.queryLookUp.set('rowid', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID'));
        this.queryLookUp.set('maxresults', '1');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.countryCode());
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    private ShowFutureChanges(params: any): void {
        this.setFilterValueForFutureChanges(params);
    }

    private setFilterValueForFutureChanges(params: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['Function'] = 'ShowFutureChanges';
        formdata['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID');
        formdata['methodtype'] = 'maintenance';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data['ShowFutureChanges'] === 'no') {
                    this.showFutureChanges = false;
                } else {
                    this.showFutureChanges = true;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                if (error.errorMessage) {
                    this.errorModal.show(error, true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    private callShowDelete(params: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        let formdata: Object = {};
        formdata['Function'] = 'ShowDelete';
        formdata['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID');
        formdata['EffectiveDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate');
        formdata['methodtype'] = 'maintenance';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.ShowDeleteColumn === 'yes') {
                    this.maxColumn = 15;
                    this.beforeExecute(true);
                    this.updateView();

                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                if (error.errorMessage) {
                    this.errorModal.show(error, true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public updateView(): void {

        this.loadData(this.inputParams);
    }

    public loadData(params: any): void {
        this.isRequesting = true;
        this.setFilterValues(params);
        this.inputParams.search = this.search;
        //  this.serviceCoverDisplayGrid.itemsPerPage = this.pageSize;
        // this.serviceCoverDisplayGrid.loadGridData(this.inputParams);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search)
            .subscribe(
            (data) => {
                this.isRequesting = false;
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                } else {
                    try {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalItems = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;

                        this.riGrid.UpdateHeader = true;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;

                        this.riGrid.Execute(data);
                        if (this.updatemode === true)
                            this.updatemode = false;
                        this.serviceCoverDisplayPagination.totalItems = this.totalItems;
                        //   this.serviceCoverDisplayGrid.update = true;
                        if (data) {
                            if (data.footer.rows[0].text !== '') {
                                let footerArray = data.footer.rows[0].text.split('|');
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalQty', footerArray[1]);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalValue', footerArray[2]);
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWEDValue', footerArray[3]);
                            } else {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalQty', '0');
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalValue', '0');
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWEDValue', '0');
                            }

                            if (this.parentMode === 'ServiceCoverAdd' || this.parentMode === 'ServiceCoverUpdate') {
                                let ExpectedTotalQty = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalQty');
                                let TotalQty = this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalQty');
                                let ExpectedTotalValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalValue');
                                let TotalValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalValue');
                                if (((ExpectedTotalQty !== TotalQty) || (ExpectedTotalValue !== TotalValue)) && (TotalValue !== '0') && (TotalQty !== '0')) {
                                    this.trMatchDisplayValues = true;
                                } else {
                                    this.trMatchDisplayValues = false;
                                }
                                if (this.isReturning() === false && this.parentMode === 'ServiceCoverAdd') {
                                    this.ServiceDisplayAdd();
                                }

                            }

                        }
                        //    this.afterExecute(data);
                    } catch (e) {
                        this.logger.warn(e);
                    }
                    this.setFormMode(this.c_s_MODE_UPDATE);
                }

            },
            (error) => {
                this.isRequesting = false;
                this.errorService.emitError(error);

            }
            );
    }

    public setFilterValues(params: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.search.set('EffectiveDate', (this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate')));
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set('UpdateRecord', '');
        this.search.set('ServiceCoverMode', this.ServiceCoverMode);
        this.search.set('Status', this.Status);
        this.search.set('GridType', 'Main');
        this.search.set('riGridMode', '0');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('DeleteDisplay', this.deleteDisplay ? 'True' : 'False');
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    }

    public getGridInfo(info: any): void {
        if (this.updatemode === true)
            this.updatemode = false;
        this.serviceCoverDisplayPagination.totalItems = info.totalRows;
        this.serviceCoverDisplayGrid.update = true;
        if (info.gridData) {
            if (info.gridData.footer.rows[0].text !== '') {
                let footerArray = info.gridData.footer.rows[0].text.split('|');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalQty', footerArray[1]);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalValue', footerArray[2]);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWEDValue', footerArray[3]);
            } else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalQty', '0');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalValue', '0');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWEDValue', '0');
            }

            if (this.parentMode === 'ServiceCoverAdd') {
                let ExpectedTotalQty = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalQty');
                let TotalQty = this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalQty');
                let ExpectedTotalValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalValue');
                let TotalValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalValue');
                if (((ExpectedTotalQty !== TotalQty) || (ExpectedTotalValue !== TotalValue)) && (TotalValue !== '0') && (TotalQty !== '0')) {
                    this.trMatchDisplayValues = true;
                } else {
                    this.trMatchDisplayValues = false;
                }
                if (this.isReturning() === false) {
                    this.ServiceDisplayAdd();
                }

            }

        }

    }

    public refresh(event: any): void {
        this.updatemode = false;
        this.loadData(this.inputParams);
    }

    public getCurrentPage(event: any): void {
        this.pageCurrent = event.value;
        this.updateView();
    }

    private riGrid_BeforeExecute(): void {
        if (this.ServiceCoverMode === 'ServiceCoverAdd') {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.inputParams.search = this.search;
            let formdata: Object = {};
            formdata['Function'] = 'GetServiceCoverTotals';
            formdata['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID');
            formdata['EffectiveDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate');
            formdata['methodtype'] = 'maintenance';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
                .subscribe(
                (data) => {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ExpectedTotalQty', data['ExpectedTotalQty']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ExpectedTotalValue', data['ExpectedTotalValue']);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                },
                (error) => {
                    if (error.errorMessage) {
                        this.errorModal.show(error, true);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public selectedStatusDefault(CodeValue: string): void {
        this.Status = CodeValue;
        this.updateView();
    }

    public onGridRowClick(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverItemRowID', this.riGrid.Details.GetAttribute('ItemDescription', 'additionalproperty'));
        this.attributes['ServiceCoverItemRowID'] = this.riGrid.Details.GetAttribute('ItemDescription', 'additionalproperty');
        switch (this.riGrid.CurrentColumnName) {
            case 'ItemDescription':
                this.navigate('DisplayUpd', InternalGridSearchServiceModuleRoutes.ICABSASERVICECOVERDISPLAYENTRY, { 'CurrentContractTypeURLParameter': this.riExchange.getCurrentContractTypeUrlParam() });
                break;
            case 'InstallVisitNumber':
            case 'RemovalVisitNumber':
                if (this.riGrid.Details.GetValue(this.riGrid.CurrentColumnName) !== '0') {
                    this.errorModal.show({ msg: 'Page Under Construction' }, false);
                    //this.navigate('ServiceCoverDisplay', 'application/serviceCoverDisplay/maintainance');
                }
                break;
            case 'DeleteDisplay':
                this.callServicedeleteDisplay();
                break;

        }
        this.isAddButtonClick = true;
    }
    public onCellClick(data: any): void {
        this.updatemode = true;
        if (this.riGrid.CurrentColumnName === 'PremiseLocationNumber') {
            this.selectedRowId = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');
        }
        if (this.riGrid.CurrentColumnName === 'InstallVisitNumber') {
            let ServiceVisitRowID = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'additionalData');

        }
    }

    public onCellBlur(data: any): void {
        if (this.riGrid.Mode === MntConst.eModeUpdate) {
            this.serviceCoverDisplayPagination.disabled = true;
            this.refreshBtn.disabled = true;
        }
        this.serviceCoverDisplayPagination.disabled = true;
        this.selectedRowId = this.riGrid.Details.GetAttribute(this.riGrid.CurrentColumnName, 'rowID');
        let oldValue: string = this.riGrid.previousValues[7].value;
        let newValue: string = data.target.value;
        if (oldValue !== newValue) {
            this.UpdatePremisesLocation(this.selectedRowId, newValue);
            this.selectedPremisesNumber = newValue;
            //    }

            //    this.loadData(this.inputParams);
        }
    }

    public btnAddDisplay_onClick(event: any): void {
        this.isAddButtonClick = true;
        this.navigate('Add', InternalGridSearchServiceModuleRoutes.ICABSASERVICECOVERDISPLAYENTRY, { 'CurrentContractTypeURLParameter': this.riExchange.getCurrentContractTypeUrlParam() });
    }

    private ServiceDisplayAdd(): void {
        this.navigate('Add', InternalGridSearchServiceModuleRoutes.ICABSASERVICECOVERDISPLAYENTRY, { 'CurrentContractTypeURLParameter': this.riExchange.getCurrentContractTypeUrlParam() });
    }

    public btnMassValue_onClick(event: any): void {
        this.navigate('', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERDISPLAYMASSVALUES);
        //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverDisplayMassValues.htm<maxwidth>" + CurrentContractTypeURLParameter
    }

    public btnSTBInterfaceDtls_onClick(event: any): void {
        this.errorModal.show({ msg: 'Page Under Construction' }, false);
        //       ContractNumber.setAttribute "ServiceCoverRowID", riMaintenance.GetRowID("ServiceCover")
        // window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSADtlsSTBInterface.htm<maxwidth>" + CurrentContractTypeURLParameter
    }

    public btnFutureChanges_onClick(event: any): void {
        this.errorModal.show({ msg: 'Page Under Construction' }, false);
        //  riExchange.mode = "ServiceCoverDisplay";
        //  window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceValueGrid.htm<maxwidth>" + CurrentContractTypeURLParameter
    }

    public btnPrintDisp_onClick(event: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search)
            .subscribe(
            (data) => {
                //  this.updateView();
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                window.open(data.url, '_blank');
            },
            (error) => {
                if (error.errorMessage) {
                    this.errorModal.show(error, true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public btnMatchDisplayValues_onClick(event: any): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        let formdata: Object = {};
        formdata['Function'] = 'MatchDisplayValues';
        formdata['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID');
        formdata['ExpectedTotalValue'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalValue');
        formdata['ExpectedTotalQty'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalQty');
        formdata['TotalValue'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalValue');
        formdata['TotalQty'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalQty');
        formdata['EffectiveDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate');
        formdata['InstallByBranchInd'] = this.InstallByBranchInd ? 'yes' : 'no';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                } else {
                    this.setControlValue('ExpectedTotalValue', this.getControlValue('TotalValue'));
                    this.setControlValue('ExpectedTotalQty', this.getControlValue('TotalQty'));
                    let data: NavData = this.riExchange.getNavigationStackInstance().getLast();
                    if (data) {
                        this.riExchange.getNavigationStackInstance().pop();
                        data.getPageData()['initialForm'][18]['value'] = this.getControlValue('TotalQty');
                        data.getPageData()['initialForm'][21]['value'] = this.getControlValue('TotalValue');
                        data.getPageData()['updateMatchedDisplayValues'] = true;
                        this.riExchange.getNavigationStackInstance().push(data);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                if (error.errorMessage) {
                    this.errorModal.show(error, true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }
    public UpdatePremisesLocation(data: any, value: string): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('ItemDescription', this.riGrid.Details.GetValue('ItemDescription'));
        this.search.set('Component1', this.riGrid.Details.GetValue('Component1'));
        this.search.set('Component2', this.riGrid.Details.GetValue('Component2'));
        this.search.set('Component3', this.riGrid.Details.GetValue('Component3'));
        this.search.set('CommenceDate', this.riGrid.Details.GetValue('CommenceDate'));
        this.search.set('WEDValue', this.riGrid.Details.GetValue('WEDValue'));
        this.search.set('AnnualValue', this.riGrid.Details.GetValue('AnnualValue'));
        this.search.set('PremiseLocationNumberRowID', this.selectedRowId);
        this.search.set('PremiseLocationNumber', value);
        this.search.set('PremiseLocationDesc', this.riGrid.Details.GetValue('PremiseLocationDesc'));
        this.search.set('InstallationDate', this.riGrid.Details.GetValue('InstallationDate'));
        this.search.set('InstallVisitNumber', this.riGrid.Details.GetValue('InstallVisitNumber'));
        this.search.set('RemovalVisitNumber', this.riGrid.Details.GetValue('RemovalVisitNumber'));
        this.search.set('ActualRemovalDate', this.riGrid.Details.GetValue('ActualRemovalDate'));
        this.search.set('RemovalDate', this.riGrid.Details.GetValue('RemovalDate'));
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.search.set('EffectiveDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate'));
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set('UpdateRecord', '');
        this.search.set('ServiceCoverMode', this.ServiceCoverMode);
        this.search.set('Status', this.Status);
        this.search.set('GridType', 'Main');
        this.search.set('riGridMode', '3');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(
            (data) => {
                if (data.hasOwnProperty('errorMessage')) {
                    this.errorModal.show({ msg: data.errorMessage, title: this.promptTitle }, false);
                } else {
                    this.riGrid.Mode = MntConst.eModeNormal;
                    this.serviceCoverDisplayPagination.disabled = false;
                    this.refreshBtn.disabled = false;
                    this.updateView();
                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                if (error.errorMessage) {
                    this.errorModal.show(error, true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public canDeactivate(): Observable<boolean> {
        let isUpdated: boolean = ((this.getControlValue('ExpectedTotalValue') !== this.getControlValue('TotalValue')) || (this.getControlValue('ExpectedTotalQty') !== this.getControlValue('TotalQty'))) && (this.getControlValue('TotalQty') !== 0) && (this.getControlValue('TotalValue') !== 0) && (this.parentMode === 'ServiceCoverUpdate' || (this.parentMode === 'ServiceCoverAdd' && this.isReturning() === true)) && this.isAddButtonClick === false && !this.variableService.getLogoutClick();
        this.routeAwayGlobals.setSaveEnabledFlag(isUpdated);
        this.canDeactivateObservable = new Observable((observer) => {
            this.errorModal.modalClose.subscribe((event) => {
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                observer.next(false);
                setTimeout(() => {
                    this.router.navigate([], { skipLocationChange: true, preserveQueryParams: true });
                }, 0);
            });
            if (isUpdated) {
                this.errorModal.show({ msg: this.promptContent, title: this.promptTitle }, false);
                return;
            }
            observer.next(true);
        });
        //   if (this.routeAwayComponent) {
        //     return this.routeAwayComponent.canDeactivate();
        // }
        return this.canDeactivateObservable;
    }

    private callServicedeleteDisplay(): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        let formdata: Object = {};
        formdata['Function'] = 'DeleteDisplay';
        formdata['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID');
        formdata['ServiceCoverItemRowID'] = this.riGrid.Details.GetAttribute('ItemDescription', 'additionalproperty');
        formdata['ServiceCoverMode'] = this.getControlValue('ServiceCoverMode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.hasOwnProperty('errorMessage')) {
                    this.errorModal.show({ msg: data.errorMessage, title: this.promptTitle }, false);
                } else {
                    this.updateView();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

            },
            (error) => {
                if (error.errorMessage) {
                    this.errorModal.show(error, true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

}
