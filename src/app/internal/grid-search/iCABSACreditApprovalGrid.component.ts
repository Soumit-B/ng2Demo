import * as moment from 'moment';
import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ServiceCoverSearchComponent } from './../search/iCABSAServiceCoverSearch';
import { ModalComponent } from './../../../shared/components/modal/modal';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { QueryParametersCallback } from './../../base/Callback';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Subscription } from 'rxjs/Rx';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ContractSearchComponent } from '../../../app/internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { Http, URLSearchParams } from '@angular/http';


@Component({
    templateUrl: 'iCABSACreditApprovalGrid.html',
    styles: [`
    .contractLevelInd {
        display:none
    }
    `]
})

export class CreditApprovalGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit, QueryParametersCallback {
    @ViewChild('creditApprovalGrid') creditApprovalGrid: GridComponent;
    @ViewChild('creditApprovalPagination') creditApprovalPagination: PaginationComponent;
    @ViewChild('contractEllipsis') contractEllipsis: EllipsisComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('messageModal') public messageModal: ModalComponent;
    @ViewChild('messageModal1') public messageModal1: ModalComponent;

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'ValueFrom', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'ValueTo', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'StaDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'EndDateTo', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'DateFrom', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'BranchFilter', readonly: true, disabled: false, required: false },
        { name: 'ResultsFilter', readonly: true, disabled: false, required: false },
        { name: 'InvoiceCreditFilter', readonly: true, disabled: false, required: false },
        { name: 'ContractLevelInd', readonly: true, disabled: false, required: false }
    ];
    public contractSearchComponent = ContractSearchComponent;
    public serviceCoverSearchComponent = ServiceCoverSearchComponent;
    public premiseSearchComponent: Component;
    public screenNotReadyComponent: Component;
    public contractSearchParams: any = {
        'parentMode': 'ContractSearch',
        'currentContractType': 'C',
        'currentContractTypeURLParameter': '<contract>',
        'showAddNew': false,
        'ContractNumber': '',
        'ContractName': ''
    };
    public serviceCoverSearchParams: any = {
        'parentMode': 'Search',
        'ContractNumber': '',
        'PremiseNumber': '',
        'showAddNew': false
    };
    public isContractEllipsisDisabled: boolean = false;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public xhrParams: any = {
        operation: 'Application/iCABSACreditApprovalGrid',
        module: 'credit-approval',
        method: 'bill-to-cash/maintenance'
    };
    public inputParams: any = {};
    public search: URLSearchParams = new URLSearchParams();

    public inputParamsAccountPremise: any = {
        'parentMode': 'LookUp',
        'pageTitle': 'Premise Search',
        'ContractNumber': ''
    };
    private uiElements: any;
    public maxColumn: number = 16;
    public itemsPerPage: number = 10;
    public pageCurrent: number = 1;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public totalRecords: number = 1;
    public subSysChar: Subscription;
    public lookUpSubscription: Subscription;
    public dateObj: any = {
        StaDate: {
            disabled: true,
            dt: null
        },
        EndDateTo: {
            disabled: true,
            dt: null
        },
        DateFrom: {
            disabled: true,
            dt: null
        },
        DateTo: {
            disabled: true,
            dt: null
        }
    };


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACREDITAPPROVALGRID;
        this.setURLQueryParameters(this);
    }


    public ngOnInit(): void {
        super.ngOnInit();
        let translation = this.getTranslatedValue('Credit Approval').toPromise();
        translation.then((resp) => {
            this.utils.setTitle(resp);
        });
        this.pageTitle = 'Approve Invoice Charges/Credits';
        this.premiseSearchComponent = PremiseSearchComponent;
        this.screenNotReadyComponent = ScreenNotReadyComponent;
        this.uiElements = this.riExchange.riInputElement;
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = 10;
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.BuildGrid();
        } else {
            this.pageParams.tdDate = false;
            this.getSysCharAndValues();
        }
    }

    public getSysCharAndValues(loadgrid?: boolean): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableChargeCreditApprovalAtContractLevel
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.blnApprovalAtContractLevel = record[0].Required;
            this.getValues(loadgrid);
        });
    }

    public getValues(loadgrid?: boolean): void {
        let lookupIP = [
            {
                'table': 'SystemParameter',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['SystemParameterEndOfWeekDay']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let SystemParameter = data[0];
            let vEndofWeekDay;
            if (SystemParameter && SystemParameter.SystemParameterEndOfWeekDay < 7) {
                vEndofWeekDay = SystemParameter.SystemParameterEndOfWeekDay;
            } else {
                vEndofWeekDay = 1;
            }
            let today = new Date();
            this.pageParams.vbEndofWeekDate = this.utils.addDays(today, ((7 - today.getDay()) + vEndofWeekDay - 1));
            let tempDate: string = this.pageParams.vbEndofWeekDate.toString();
            let weekDate: string | boolean = this.globalize.parseDateToFixedFormat(tempDate);
            this.pageParams.vbEndofWeekDate = this.globalize.parseDateStringToDate(weekDate.toString());
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.window_onload(loadgrid);
        });
    }

    public ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
        if (this.contractEllipsis && !this.isReturning()) {
            //Commented as per IUI-12498
            //this.contractEllipsis.openModal();
        }
        if (this.isReturning()) {
            this.dateObj.DateFrom.dt = new Date(this.getControlValue('DateFrom'));
            this.dateObj.DateTo.dt = new Date(this.getControlValue('DateTo'));
            this.dateObj.StaDate.dt = new Date(this.getControlValue('StaDate'));
            this.dateObj.EndDateTo.dt = new Date(this.getControlValue('EndDateTo'));
            this.loadData();
        }
    }

    public getURLQueryParameters(param: any): void {
        if (param.readonly === 'true') {
            this.pageParams.verReadOnly = true;
        } else {
            this.pageParams.verReadOnly = false;
        }
    }

    public window_onload(loadgrid?: boolean): void {
        let today = new Date();
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.setControlValue('BranchFilter', 'Selected');
        this.setControlValue('ResultsFilter', 'Awaiting');
        this.setControlValue('InvoiceCreditFilter', 'C');
        this.dateObj.DateFrom.dt = new Date(today.setDate(1));
        this.dateObj.DateTo.dt = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.dateObj.StaDate.dt = this.utils.removeDays(this.pageParams.vbEndofWeekDate, 6);
        this.dateObj.EndDateTo.dt = this.pageParams.vbEndofWeekDate;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DateFrom', this.utils.formatDate(this.dateObj.DateFrom.dt).toString());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.utils.formatDate(this.dateObj.DateTo.dt).toString());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'StaDate', this.utils.formatDate(this.dateObj.StaDate.dt).toString());
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDateTo', this.utils.formatDate(this.dateObj.EndDateTo.dt).toString());

        //if( there is no contract type set, ) { SetCurrentContractType;
        // will default to Contract. However, this screen needs to know;
        // whether no value was set. So, we detectif( no parameter was;
        // passed, && blank out the codes as appropriate;
        if (!(this.riExchange.URLParameterContains('contract') || this.riExchange.URLParameterContains('job') || this.riExchange.URLParameterContains('product'))) {
            this.pageParams.currentContractType = '';
            this.pageParams.currentContractTypeURLParameter = '';
        }

        if (this.pageParams.blnApprovalAtContractLevel) {
            this.pageParams.tdContractLevelInd = true;
            this.setControlValue('ContractLevelInd', true);
        } else {
            this.pageParams.tdContractLevelInd = false;
            this.setControlValue('ContractLevelInd', false);
        }
        if (!this.pageParams.verReadOnly) {
            this.GetValues();
        }
        this.BuildGrid();
        if (loadgrid) {
            this.loadData();
        }
    }

    public GetValues(): void {
        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSCreditApprovalGrid.p';
        this.riMaintenance.PostDataAdd('Function', 'GetValues', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('ValueTo', MntConst.eTypeText);
        this.riMaintenance.ReturnDataAdd('ValueFrom', MntConst.eTypeText);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ValueFrom', data['ValueFrom']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ValueTo', data['ValueTo']);
        }, 'POST');
    }

    public loadData(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set('action', '2');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('ContractNumber', this.uiElements.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.uiElements.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ProductCode', this.uiElements.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('BranchFilter', this.getControlValue('BranchFilter'));
        this.search.set('ResultsFilter', this.getControlValue('ResultsFilter'));
        this.search.set('ReadOnly', this.pageParams.verReadOnly);
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('DateFrom', this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom')).toString());
        this.search.set('DateTo', this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo')).toString());
        this.search.set('StaDate', this.globalize.parseDateToFixedFormat(this.uiElements.GetValue(this.uiForm, 'StaDate')).toString());
        this.search.set('EndDateTo', this.globalize.parseDateToFixedFormat(this.uiElements.GetValue(this.uiForm, 'EndDateTo')).toString());
        this.search.set('ValueFrom', this.uiElements.GetValue(this.uiForm, 'ValueFrom'));
        this.search.set('ValueTo', this.uiElements.GetValue(this.uiForm, 'ValueTo'));
        this.search.set('ContractLevelInd', this.uiElements.GetValue(this.uiForm, 'ContractLevelInd'));
        this.search.set('InvoiceCredit', this.getControlValue('InvoiceCreditFilter'));
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '5112610');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set('riSortOrder', sortOrder);
        this.inputParams.method = this.xhrParams.method;
        this.inputParams.operation = this.xhrParams.operation;
        this.inputParams.module = this.xhrParams.module;
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                if (data) {
                    this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    //this.riGrid.Update = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.messageModal1.show(data, true);
                    } else {
                        this.riGrid.Execute(data);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.messageModal1.show({ msg: MessageConstant.Message.GeneralError, title: 'Error' }, false);
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public updateRowData(e: Event): void {
        this.search = this.getURLSearchParamObject();
        this.riGrid.UpdateHeader = false;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.search.set('action', '2');
        this.search.set('ContractNumRowID', this.riGrid.Details.GetAttribute('ContractNum', 'RowID'));
        this.search.set('ContractNum', this.riGrid.Details.GetValue('ContractNum'));
        this.search.set('PremNumRowID', this.riGrid.Details.GetAttribute('PremNum', 'RowID'));
        this.search.set('PremNum', this.riGrid.Details.GetValue('PremNum'));
        this.search.set('PremName', this.riGrid.Details.GetValue('PremName'));
        this.search.set('ProdCodeRowID', this.riGrid.Details.GetAttribute('ProdCode', 'RowID'));
        this.search.set('ProdCode', this.riGrid.Details.GetValue('ProdCode'));
        this.search.set('StartDateRowID', this.riGrid.Details.GetAttribute('StartDate', 'RowID'));
        this.search.set('StartDate', this.riGrid.Details.GetValue('StartDate'));
        this.search.set('EndDate', this.riGrid.Details.GetValue('EndDate'));
        this.search.set('ServiceBranchNum', this.riGrid.Details.GetValue('ServiceBranchNum'));
        this.search.set('StatusCode', this.riGrid.Details.GetValue('StatusCode'));
        this.search.set('ServiceSalesEmp', this.riGrid.Details.GetValue('ServiceSalesEmp'));
        this.search.set('ServiceQty', this.riGrid.Details.GetValue('ServiceQty'));
        this.search.set('SalesStatsProcessDate', this.riGrid.Details.GetValue('SalesStatsProcessDate'));
        this.search.set('ProRataChargeValue', this.riGrid.Details.GetValue('ProRataChargeValue'));
        this.search.set('InvoiceCredit', this.getControlValue('InvoiceCreditFilter'));
        this.search.set('AdditionalCreditInfoRowID', this.riGrid.Details.GetAttribute('AdditionalCreditInfo', 'RowID'));
        this.search.set('AdditionalCreditInfo', this.riGrid.Details.GetValue('AdditionalCreditInfo'));
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('ProductCode', this.getControlValue('ProductCode'));
        this.search.set('BranchFilter', this.getControlValue('BranchFilter'));
        this.search.set('ResultsFilter', this.getControlValue('ResultsFilter'));
        this.search.set('ReadOnly', this.pageParams.verReadOnly);
        this.search.set('DateFrom', this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom')).toString());
        this.search.set('DateTo', this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo')).toString());
        this.search.set('StaDate', this.globalize.parseDateToFixedFormat(this.getControlValue('StaDate')).toString());
        this.search.set('EndDateTo', this.globalize.parseDateToFixedFormat(this.getControlValue('EndDateTo')).toString());
        this.search.set('ValueFrom', this.getControlValue('ValueFrom'));
        this.search.set('ValueTo', this.getControlValue('ValueTo'));
        this.search.set('ContractLevelInd', this.getControlValue('ContractLevelInd'));
        this.search.set('riGridMode', '3');
        this.search.set('riGridHandle', '5112610');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set('riSortOrder', sortOrder);
        this.inputParams.method = this.xhrParams.method;
        this.inputParams.operation = this.xhrParams.operation;
        this.inputParams.module = this.xhrParams.module;
        this.inputParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search)
            .subscribe(
            (data) => {
                if (data) {
                    this.riGrid.Mode = MntConst.eModeNormal;
                    this.riGrid.Update = false;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.messageModal1.show({ msg: MessageConstant.Message.GeneralError, title: 'Error' }, false);
                this.totalRecords = 1;
                this.riGrid.Mode = MntConst.eModeNormal;
                this.riGrid.Update = false;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_Sort(event: any): void {
        this.loadData();
    }

    public ContractNumber_onchange(): void {
        if (this.getControlValue('ContractNumber')) {
            this.setControlValue('ContractNumber', this.utils.fillLeadingZeros(this.getControlValue('ContractNumber'), 8));
        }
        this.PopulateDescriptions();
    }

    public PremiseNumber_onchange(): void {
        this.PopulateDescriptions();
    }

    public ProductCode_onchange(): void {
        this.attributes.ProRataChargeRowID = '';
        this.PopulateDescriptions();
    }


    public ResultsFilter_onchange(): void {
        if (this.getControlValue('ResultsFilter') !== 'Awaiting') {
            this.pageParams.tdDate = true;
        } else {
            this.pageParams.tdDate = false;
        }
    }

    public PopulateDescriptions(): void {
        let blnContractNumber = false;
        let blnPremiseNumber = false;
        let blnProductCode = false;
        this.riMaintenance.BusinessObject = 'iCABSCreditApprovalGrid.p';
        this.riMaintenance.clear();
        this.riMaintenance.PostDataAdd('Function', 'GetDescriptions', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeText);
        if (this.getControlValue('ContractNumber')) {
            blnContractNumber = true;
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
        }
        if (this.getControlValue('PremiseNumber')) {
            blnContractNumber = true;
            blnPremiseNumber = true;
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
        }
        if (this.getControlValue('ProductCode')) {
            blnProductCode = true;
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        }
        if (blnContractNumber) {
            this.riMaintenance.PostDataAdd('ContractNumber', this.getControlValue('ContractNumber'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('ContractName', MntConst.eTypeText);
        }
        if (blnPremiseNumber) {
            this.riMaintenance.PostDataAdd('PremiseNumber', this.getControlValue('PremiseNumber'), MntConst.eTypeInteger);
            this.riMaintenance.ReturnDataAdd('PremiseName', MntConst.eTypeText);
        }
        if (blnProductCode) {
            this.riMaintenance.PostDataAdd('ProductCode', this.getControlValue('ProductCode'), MntConst.eTypeCode);
            this.riMaintenance.ReturnDataAdd('ProductDesc', MntConst.eTypeText);
        }

        // Only execute requestif( necessary;
        if (blnContractNumber || blnPremiseNumber || blnProductCode) {
            this.riMaintenance.Execute(this, function (data: any): any {
                if (blnContractNumber) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data['ContractName']);
                }
                if (blnPremiseNumber) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data['PremiseName']);
                }
                if (blnProductCode) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data['ProductDesc']);
                }
                this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
                this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
                this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
                this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName');
                this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
                this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
                this.loadData();
            }, 'POST');
        }
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
        this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName');
        this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
        this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
    }



    public startDateSelectedValue(data: any): void {
        if (data && data.value) {
            this.uiElements.SetValue(this.uiForm, 'StartDate', data.value);
        }
    }

    public endDateSelectedValue(data: any): void {
        if (data && data.value) {
            this.uiElements.SetValue(this.uiForm, 'EndDateTo', data.value);
        }
    }

    public onContractDataReceived(data: any): void {
        if (data) {
            this.uiElements.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
            this.uiElements.SetValue(this.uiForm, 'ContractName', data.ContractName);
            this.inputParamsAccountPremise.ContractNumber = data.ContractNumber;
            this.inputParamsAccountPremise.ContractName = data.ContractName;
            this.serviceCoverSearchParams.ContractNumber = data.ContractNumber;
            this.serviceCoverSearchParams.ContractName = data.ContractName;
            this.getSysCharAndValues();
        }
    }

    public onPremiseSearchDataReceived(data: any): void {
        if (data) {
            this.uiElements.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
            this.uiElements.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
            this.serviceCoverSearchParams.PremiseNumber = data.PremiseNumber;
            this.serviceCoverSearchParams.PremiseName = data.PremiseName;
        }
    }

    public setProductCode(data: any): void {
        if (data) {
            this.setControlValue('ProductCode', data.row.ProductCode);
            this.setControlValue('ProductDesc', data.row.ProductDesc);
        }
    }

    public getGridInfo(info: any): void {
        this.creditApprovalPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    }

    public getCurrentPage(event: any): void {
        if (this.pageCurrent !== event.value) {
            this.pageCurrent = event.value;
            this.loadData();
        }
    }

    public dateToSelectedValue(value: any, id: string): void {
        if (value && value.value) {
            this.setControlValue(id, value.value);
            if (this.uiForm.controls.hasOwnProperty(id)) {
                this.uiForm.controls[id].markAsDirty();
            }
        }
    }

    public refresh(): void {
        this.pageCurrent = 1;
        this.loadData();
    }

    public BuildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ContractNum', 'ProRataCharge', 'ContractNumber', MntConst.eTypeCode, 11);
        this.riGrid.AddColumnUpdateSupport('ContractNum', false);
        this.riGrid.AddColumn('PremNum', 'ProRataCharge', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnUpdateSupport('PremNum', false);
        this.riGrid.AddColumn('PremName', 'ProRataCharge', 'PremName', MntConst.eTypeText, 20);
        this.riGrid.AddColumnUpdateSupport('PremName', false);
        this.riGrid.AddColumn('ProdCode', 'ProRataCharge', 'ProductCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('ProdCode', false);
        this.riGrid.AddColumn('StartDate', 'ProRataCharge', 'StartDate', MntConst.eTypeDate, 15);
        this.riGrid.AddColumnUpdateSupport('StartDate', false);
        this.riGrid.AddColumn('EndDate', 'ProRataCharge', 'EndDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnUpdateSupport('EndDate', false);
        this.riGrid.AddColumn('ServiceBranchNum', 'ProRataCharge', 'ServiceBranchNum', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('ServiceBranchNum', false);
        this.riGrid.AddColumn('StatusCode', 'ProRataCharge', 'StatusCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('StatusCode', false);
        this.riGrid.AddColumn('ServiceSalesEmp', 'ProRataCharge', 'ServiceSalesEmp', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('ServiceSalesEmp', false);
        this.riGrid.AddColumn('ServiceQty', 'ProRataCharge', 'ServiceQty', MntConst.eTypeCode, 10);
        this.riGrid.AddColumnUpdateSupport('ServiceQty', false);
        this.riGrid.AddColumn('SalesStatsProcessDate', 'ProRataCharge', 'SalesStatsProcessDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnUpdateSupport('SalesStatsProcessDate', false);
        this.riGrid.AddColumn('ProRataChargeValue', 'ProRataCharge', 'ProRataChargeValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnUpdateSupport('ProRataChargeValue', false);
        this.riGrid.AddColumn('InvoiceCredit', 'ProRataCharge', 'InvoiceCredit', MntConst.eTypeText, 10);
        this.riGrid.AddColumnUpdateSupport('ProRataChargeValue', false);
        this.riGrid.AddColumn('AdditionalCreditInfo', 'ProRataCharge', 'AdditionalCreditInfo', MntConst.eTypeTextFree, 25);
        this.riGrid.AddColumnUpdateSupport('AdditionalCreditInfo', true);
        //MDP - Don//t let the user(s) approve || cancel creditsif( they only have access to the;
        //      read only version of this report (URL Param).;
        if (!this.pageParams.verReadOnly) {
            this.riGrid.AddColumn('ApproveCredit', 'ProRataCharge', 'ApproveCredit', MntConst.eTypeImage, 1);
            this.riGrid.AddColumnUpdateSupport('ApproveCredit', false);
            this.riGrid.AddColumnAlign('ApproveCredit', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('CancelCredit', 'ProRataCharge', 'CancelCredit', MntConst.eTypeImage, 1);
        this.riGrid.AddColumnUpdateSupport('CancelCredit', false);
        this.riGrid.AddColumnAlign('CancelCredit', MntConst.eAlignmentCenter);
        //this.riGrid.AddColumn('Narrative', 'Narrative', 'Narrative', MntConst.eTypeText, 20)    //25/08/2009 - Kelvin #39925;
        //this.riGrid.AddColumnUpdateSupport('Narrative', false);
        this.riGrid.AddColumnAlign('ContractNum', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremNum', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('ProdCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContractNum', true);
        this.riGrid.AddColumnOrderable('PremName', true);
        this.riGrid.AddColumnOrderable('ProdCode', true);
        //this.riGrid.AddColumn('InvoiceCreditReasonCode', 'ProRataCharge', 'InvoiceCreditReasonCode', MntConst.eTypeText, 6);
        //this.riGrid.AddColumn('InvoiceCreditReasonDesc', 'ProRataCharge', 'InvoiceCreditReasonDesc', MntConst.eTypeText, 20);
        //this.riGrid.AddColumnUpdateSupport('InvoiceCreditReasonCode', false);
        //this.riGrid.AddColumnUpdateSupport('InvoiceCreditReasonDesc', false);
        //this.riGrid.AddColumnScreen('InvoiceCreditReasonCode', false);
        //this.riGrid.AddColumnScreen('InvoiceCreditReasonDesc', false);
        //this.riGrid.AddColumnScreen('Narrative', false);

        if (this.getControlValue('ResultsFilter') !== 'Awaiting') {
            //this.riGrid.AddColumn('User', 'ProRataCharge', 'ApprovalUser', MntConst.eTypeText, 6);
            //this.riGrid.AddColumnUpdateSupport('User', false);
            //this.riGrid.AddColumnScreen('User', false);
        }
        this.riGrid.Complete();
    }

    public riGrid_BodyonDblClick(event: any): void {

        this.ProRataChargeFocus(event.srcElement.parentElement);
        switch (event.srcElement.parentElement.parentElement.getAttribute('name')) {
            case 'ContractNum':
                this.navigate('ServiceVisitEntryGrid', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    parentMode: 'ServiceVisitEntryGrid',
                    ContractNumber: this.riGrid.Details.GetValue('ContractNum'),
                    currentContractType: this.riExchange.getCurrentContractType(),
                    ContractRowID: this.attributes.ContractRowID
                });
                break;
            case 'PremNum':
                this.navigate('ServiceVisitEntryGrid', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, { PremiseRowID: this.attributes.PremiseRowID });
                break;
            case 'ProdCode':
                this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
                break;
            case 'StartDate':
                let mode = '';
                if (this.pageParams.verReadOnly === true) {
                    mode = 'ProRataChargeRO';
                } else {
                    mode = 'ProRataCharge';
                }
                this.navigate(mode, InternalMaintenanceSalesModuleRoutes.ICABSAPRORATACHARGEMAINTENANCE,
                    {
                        parentMode: mode,
                        currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                        CurrentContractType: this.riExchange.getCurrentContractType(),
                        ContractNumber: this.riGrid.Details.GetValue('ContractNum'),
                        ContractName: this.getControlValue('ContractName'),
                        PremiseNumber: this.riGrid.Details.GetValue('PremNum'),
                        PremiseName: this.getControlValue('PremiseName'),
                        ProductCode: this.riGrid.Details.GetValue('ProdCode'),
                        ProductDesc: this.getControlValue('ProductDesc'),
                        ProRataChargeROWID: this.attributes.ProRataChargeRowID
                    });
                break;
            case 'CancelCredit':
                this.ajaxSource.next(this.ajaxconstant.START);
                this.ProRataChargeFocus(event.srcElement.parentElement);
                this.riMaintenance.clear();
                this.riMaintenance.BusinessObject = 'iCABSCreditApprovalGrid.p';
                this.riMaintenance.PostDataAdd('Function', 'CancelCredit', MntConst.eTypeText);
                // this.riMaintenance.PostDataAdd('ProRataChargeRowID',ContractNumber.getAttribute('CancelCreditRowID'),eTypeText);
                this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
                if (!this.riExchange.riInputElement.checked(this.uiForm, 'ContractLevelInd')) {
                    this.riMaintenance.PostDataAdd('ProRataChargeRowID', this.attributes.ProRataChargeRowID, MntConst.eTypeText);
                    this.riMaintenance.Execute(this, function (data: any): void {
                        if (data && data.errorMessage) {
                            this.messageModal.show(data, true);
                        } else {
                            this.loadData();
                        }
                    }, 'POST');
                } else {
                    this.pageParams.vbProRataChargeRowID = this.riGrid.Details.GetAttribute('CancelCredit', 'ROWID');
                    this.pageParams.vbProRataChargeTotal = this.riGrid.Details.GetAttribute('ContractNum', 'AdditionalProperty');
                    this.riMaintenance.PostDataAdd('ProRataChargeRowID', this.pageParams.vbProRataChargeRowID, MntConst.eTypeTextFree);
                    this.riMaintenance.PostDataAdd('ProRataChargeTotal', this.pageParams.vbProRataChargeTotal, MntConst.eTypeCurrency);
                    this.riMaintenance.PostDataAdd('ContractLevelInd', this.riExchange.riInputElement.checked(this.uiForm, 'ContractLevelInd'), MntConst.eTypeCheckBox);
                    this.riMaintenance.Execute(this, function (data: any): void {
                        if (data && data.errorMessage) {
                            this.messageModal.show(data, true);
                        } else {
                            this.loadData();
                        }
                    }, 'POST');
                }
                break;

            case 'ApproveCredit':
                this.ajaxSource.next(this.ajaxconstant.START);
                this.ProRataChargeFocus(event.srcElement.parentElement);
                this.riMaintenance.clear();
                this.riMaintenance.BusinessObject = 'iCABSCreditApprovalGrid.p';
                this.riMaintenance.PostDataAdd('Function', 'ApproveCredit', MntConst.eTypeText);
                this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
                if (!this.riExchange.riInputElement.checked(this.uiForm, 'ContractLevelInd')) {
                    this.riMaintenance.PostDataAdd('ProRataChargeRowID', this.attributes.ProRataChargeRowID, MntConst.eTypeText);
                    this.riMaintenance.Execute(this, function (data: any): void {
                        if (data && data.errorMessage) {
                            this.messageModal.show(data, true);
                        } else {
                            this.loadData();
                        }
                    }, 'POST');
                } else {
                    this.pageParams.vbProRataChargeRowID = this.riGrid.Details.GetAttribute('ApproveCredit', 'ROWID');
                    this.pageParams.vbProRataChargeTotal = this.riGrid.Details.GetAttribute('ContractNum', 'AdditionalProperty');
                    this.riMaintenance.PostDataAdd('ProRataChargeRowID', this.pageParams.vbProRataChargeRowID, MntConst.eTypeTextFree);
                    this.riMaintenance.PostDataAdd('ProRataChargeTotal', this.pageParams.vbProRataChargeTotal, MntConst.eTypeCurrency);
                    this.riMaintenance.PostDataAdd('ContractLevelInd', this.riExchange.riInputElement.checked(this.uiForm, 'ContractLevelInd'), MntConst.eTypeCheckBox);
                    this.riMaintenance.Execute(this, function (data: any): void {
                        if (data && data.errorMessage) {
                            this.messageModal.show(data, true);
                        } else {
                            this.loadData();
                        }
                    }, 'POST');
                }
                break;
        }
    }

    public ProRataChargeFocus(rsrcElement: any): void {
        let TmpContractType;
        let vRowDetail;
        let oTR = rsrcElement.parentElement.parentElement;
        rsrcElement.focus();
        vRowDetail = this.riGrid.Details.GetAttribute('SalesStatsProcessDate', 'AdditionalProperty');
        if (!vRowDetail) {
            this.setAttribute('Row', oTR.sectionRowIndex);
            this.setAttribute('ContractRowID', oTR.children[0].getAttribute('rowid'));
            this.setAttribute('PremiseRowID', oTR.children[1].children[0].getAttribute('rowid'));
            this.setAttribute('ServiceCoverRowID', oTR.children[3].children[0].getAttribute('rowid'));
            this.setAttribute('ProRataChargeRowID', oTR.children[4].children[0].getAttribute('rowid'));
        } else {
            this.setAttribute('Row', oTR.sectionRowIndex);
            this.setAttribute('ProRataChargeRowID', oTR.children[14].children[0].getAttribute('rowid'));
        }
        TmpContractType = this.riGrid.Details.GetAttribute('ContractNum', 'AdditionalProperty');
        switch (TmpContractType) {
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
    }

    public proceedGridLoad(): void {
        this.loadData();
    }

    public proceedGridClear(): void {
        this.riGrid.ResetGrid();
    }
}
