import * as moment from 'moment';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, AfterViewInit, Injector, ViewChild, Input, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ErrorCallback } from './../../base/Callback';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { InternalGridSearchModuleRoutes, AppModuleRoutes, InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { OrderBy } from './../../../shared/pipes/orderBy';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSSSOProspectGrid.html'
})

export class SOProspectGridComponent extends BaseComponent implements OnInit, AfterViewInit, ErrorCallback, OnDestroy {

    @ViewChild('errorModal') public errorModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('prospectPagination') prospectPagination: PaginationComponent;
    @ViewChild('StatusSelectDropdown') StatusSelectDropdown: DropdownStaticComponent;
    @ViewChild('originSelectDropdown') originSelectDropdown: DropdownStaticComponent;


    public pageId: string = '';
    public controls = [
        { name: 'EmployeeCode', type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', disabled: true, type: MntConst.eTypeText },
        { name: 'SOPReportBranch' },
        { name: 'SOPReportRegion' },
        { name: 'SOPReportQuoteStatus' },
        { name: 'toDate', type: MntConst.eTypeDate },
        { name: 'fromDate', type: MntConst.eTypeDate },
        { name: 'GridUserCode' },
        { name: 'InclusionTypeSelect', value: 'OpenOnly', type: MntConst.eTypeTextFree },
        { name: 'OwnSubmissionsInd' },
        { name: 'PassProspectNumber' },
        { name: 'LocalSystemInd' },
        { name: 'SubSystem', value: 'SalesOrder' }
    ];

    public queryParams: any = {
        method: 'prospect-to-contract/maintenance',
        module: 'prospect',
        operation: 'Sales/iCABSSSOProspectGrid'
    };

    public employeeparams = {
        parentMode: 'LookUp'
    };

    private orderBy: OrderBy;
    public employeeSearchComponent: any;
    public disableEmployeeElipsis: boolean = false;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;

    public fromDate;
    public toDate;

    public search: URLSearchParams = new URLSearchParams();
    public itemsPerPage: number = 10;
    public PageCurrent: number = 1;
    public totalRecords: number = 10;

    public uiDisplay = {
        fromDate: false,
        toDate: false,
        cmdReviewGrid: false
    };

    public ProspectStatus = [
        {
            text: 'All',
            value: 'all'
        }
    ];

    private allOption: any = [{
        text: 'All',
        value: '$$all$$'
    }];

    public ProspectOrigin: Array<any> = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSOPROSPECTGRID;
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.orderBy = injector.get(OrderBy);
        this.browserTitle = 'Sales Order Processing';
        this.pageParams.ProspectStatus = [];
        this.pageParams.ProspectOrigin = [];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setErrorCallback(this);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.originSelectDropdown.selectedItem = this.pageParams.OriginSelect;
            this.StatusSelectDropdown.selectedItem = this.pageParams.StatusSelect;
            this.uiDisplay.cmdReviewGrid = this.pageParams.uiDisplaycmdReviewGrid;
            this.uiDisplay.fromDate = this.pageParams.uiDisplayfromDate;
            this.uiDisplay.toDate = this.pageParams.uiDisplaytoDate;
            this.fromDate = this.pageParams.fromDate;
            this.toDate = this.pageParams.toDate;
            this.buildGrid();
        }
        else this.windowOnLoad();
    }

    public windowOnLoad(): void {

        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;

        this.speedScriptCode();
        this.buildStatusList();
        this.buildOriginCodes();

        if (this.formData && Object.keys(this.formData).length !== 0) {
            if (this.formData.InclusionTypeSelect === 'OpenOnlyWithDateRange' || this.formData.InclusionTypeSelect === 'OpenAndClosed' || this.formData.InclusionTypeSelect === 'ClosedOnly') {
                this.uiDisplay.fromDate = true;
                this.uiDisplay.toDate = true;
            }
            let getFromDate = this.globalize.parseDateToFixedFormat(this.formData.fromDate).toString();
            this.fromDate = this.globalize.parseDateStringToDate(getFromDate);
            let getToDate = this.globalize.parseDateToFixedFormat(this.formData.toDate).toString();
            this.toDate = this.globalize.parseDateStringToDate(getToDate);

            this.populateUIFromFormData();
        }
        else {
            if (this.parentMode === 'SOPReportGrid' || this.parentMode === 'SOPReportGridProspect' || this.parentMode === 'SOPReportGridQuotesInput') {
                this.setControlValue('fromDate', this.riExchange.getParentHTMLValue('DateFrom'));
                this.setControlValue('toDate', this.riExchange.getParentHTMLValue('DateTo'));

                if (this.parentMode === 'SOPReportGrid') {
                    this.setControlValue('InclusionTypeSelect', 'OpenAndClosed');
                    this.setControlValue('SOPReportBranch', this.riExchange.getParentHTMLValue('SOPReportBranch'));
                    this.setControlValue('SOPReportRegion', this.riExchange.getParentHTMLValue('SOPReportRegion'));
                }
                if (this.parentMode === 'SOPReportGridProspect' || this.parentMode === 'SOPReportGridQuotesInput') {
                    if (this.parentMode === 'SOPReportGridQuotesInput') {
                        this.setControlValue('SOPReportQuoteStatus', 'Input');
                    }
                    this.setControlValue('InclusionTypeSelect', 'OpenAndClosed');
                    this.setControlValue('SOPReportBranch', this.riExchange.getParentHTMLValue('SOPReportBranch'));
                    this.setControlValue('SOPReportRegion', this.riExchange.getParentHTMLValue('SOPReportRegion'));
                }
                this.inclusionTypeSelect_OnChange();
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('GroupDesc'));
                this.setControlValue('EmployeeSurname', this.riExchange.getParentAttributeValue('GroupCode'));
            }
            else {
                let dateFromString = this.utils.removeDays(new Date(), 90);
                let dateFrom = this.globalize.parseDateToFixedFormat(dateFromString).toString();
                this.fromDate = this.globalize.parseDateStringToDate(dateFrom);
                let dateToString = new Date();
                let dateTo = this.globalize.parseDateToFixedFormat(dateToString).toString();
                this.toDate = this.globalize.parseDateStringToDate(dateTo);
                this.setControlValue('fromDate', this.fromDate);
                this.setControlValue('toDate', this.toDate);
                this.getEmployeeFromUserCode();
            }
        }

        if (this.parentMode === 'ContactCentreReview') {
            this.uiDisplay.cmdReviewGrid = false;
        }
        else {
            this.uiDisplay.cmdReviewGrid = true;
        }

        this.buildGrid();
    }

    public getEmployeeFromUserCode(): void {

        this.ajaxSource.next(this.ajaxconstant.START);

        let postSearchParams: URLSearchParams = new URLSearchParams();
        postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        postSearchParams.set(this.serviceConstants.Action, '6');
        postSearchParams.set('GridUserCode', this.utils.getUserCode());

        let postParams: Object = {};
        postParams['Function'] = 'GetEmployeeFromUserCode';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (res) => {
                if (res.hasError) {
                    this.displayError(res.errorMessage);
                } else {
                    this.setControlValue('EmployeeCode', res.EmployeeCode);
                    this.setControlValue('EmployeeSurname', res.EmployeeSurname);
                    this.setControlValue('OwnSubmissionsInd', res.OwnSubmissionsInd);
                    if (this.getControlValue('OwnSubmissionsInd') === 'yes') {
                        this.disableControl('EmployeeCode', true);
                        this.disableEmployeeElipsis = true;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.displayError(MessageConstant.Message.GeneralError, error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onEmployeeDataReceived(data: any): void {
        this.setControlValue('EmployeeCode', data.EmployeeCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
    }

    public onEmployeeCodeChanged(data: any): void {
        let EmployeeCode = this.getControlValue('EmployeeCode');
        if (EmployeeCode !== '') {
            this.getEmployeeSurname();
        }
        else {
            this.setControlValue('EmployeeSurname', '');
        }
    }

    public getEmployeeSurname(): void {

        this.ajaxSource.next(this.ajaxconstant.START);

        let postSearchParams: URLSearchParams = new URLSearchParams();
        postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        postSearchParams.set(this.serviceConstants.Action, '6');
        postSearchParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));

        let postParams: Object = {};
        postParams['Function'] = 'GetEmployeeName';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (res) => {
                if (res.hasError) {
                    this.displayError(res.errorMessage);
                } else {
                    this.setControlValue('EmployeeSurname', res.EmployeeSurname);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.displayError(MessageConstant.Message.GeneralError, error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
        this.riGrid.RefreshRequired();
    }

    public toDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('toDate', value.value);
        }
        this.riGrid.RefreshRequired();
    }
    public fromDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('fromDate', value.value);
        }
        this.riGrid.RefreshRequired();
    }

    public inclusionTypeSelect_OnChange(data?: any): void {
        if (data.target.value === 'OpenOnly') {
            this.uiDisplay.fromDate = false;
            this.uiDisplay.toDate = false;
        }
        else {
            this.uiDisplay.fromDate = true;
            this.uiDisplay.toDate = true;
        }
        this.riGrid.RefreshRequired();
    }

    public riGrid_Sort(event: any): void {
        this.loadGrid();
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ProspectNumber', 'Prospect', 'ProspectNumber', MntConst.eTypeCodeNumeric, 5);
        this.riGrid.AddColumn('ProspectName', 'Prospect', 'ProspectName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ProspectPostcode', 'Prospect', 'ProspectPostcode', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('ProspectNarrative', 'Prospect', 'ProspectNarrative', MntConst.eTypeTextFree, 40);
        this.riGrid.AddColumn('ProspectDate', 'Prospect', 'ProspectDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('Quotes', 'Prospect', 'Quotes', MntConst.eTypeInteger, 4);

        this.riGrid.AddColumn('C1', 'Prospect', 'C1', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C2', 'Prospect', 'C2', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C3', 'Prospect', 'C3', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C4', 'Prospect', 'C4', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C5', 'Prospect', 'C5', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C6', 'Prospect', 'C6', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('C7', 'Prospect', 'C7', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumn('Contacts', 'Prospect', 'Contacts', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('ProspectStatus', 'Prospect', 'ProspectStatus', MntConst.eTypeText, 15);

        this.riGrid.AddColumnAlign('ProspectNumber', 'Center');
        this.riGrid.AddColumnAlign('ProspectDate', 'Center');
        this.riGrid.AddColumnAlign('Quotes', 'Center');
        this.riGrid.AddColumnAlign('Contacts', 'Center');

        this.riGrid.AddColumnOrderable('ProspectNumber', true);
        this.riGrid.AddColumnOrderable('ProspectName', true);
        this.riGrid.AddColumnOrderable('ProspectPostcode', true);
        this.riGrid.AddColumnOrderable('ProspectNarrative', true);
        this.riGrid.AddColumnOrderable('ProspectDate', true);
        this.riGrid.AddColumnOrderable('ProspectStatus', true);

        this.riGrid.Complete();

        this.loadGrid();

    }

    public loadGrid(): void {

        //  this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;

        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        this.search.set('Status', this.StatusSelectDropdown.selectedItem);
        this.search.set('OriginCode', this.originSelectDropdown.selectedItem);
        this.search.set('InclusionType', this.getControlValue('InclusionTypeSelect'));
        this.search.set('fromDate', this.getControlValue('fromDate'));
        this.search.set('toDate', this.getControlValue('toDate'));
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.PageCurrent.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.queryParams.search = this.search;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.displayError(data.errorMessage);
                }
                else {
                    this.PageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    //this.riGrid.Update = true;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateFooter = true;
                    this.isRequesting = true;
                    this.riGrid.Execute(data);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onGridRowClick(event: Event): void {

        this.attributes.ProspectNumber = this.riGrid.Details.GetValue('ProspectNumber');
        this.attributes.ProspectName = this.riGrid.Details.GetValue('ProspectName');
        this.attributes.ProspectNumberRowID = this.riGrid.Details.GetAttribute('ProspectNumber', 'rowID');
        this.attributes.CustomerContactNumberRowID = this.riGrid.Details.GetAttribute('Contacts', 'rowID');

        this.pageParams.EmployeeCode = this.getControlValue('EmployeeCode');
        this.pageParams.EmployeeSurname = this.getControlValue('EmployeeSurname');
        this.pageParams.InclusionTypeSelect = this.getControlValue('InclusionTypeSelect');
        this.pageParams.fromDate = this.getControlValue('fromDate');
        this.pageParams.toDate = this.getControlValue('toDate');
        this.pageParams.OriginSelect = this.originSelectDropdown.selectedItem;
        this.pageParams.StatusSelect = this.StatusSelectDropdown.selectedItem;
        this.pageParams.uiDisplaycmdReviewGrid = this.uiDisplay.cmdReviewGrid;
        this.pageParams.uiDisplayfromDate = this.uiDisplay.fromDate;
        this.pageParams.uiDisplaytoDate = this.uiDisplay.toDate;

        switch (this.riGrid.CurrentColumnName) {
            case 'ProspectNumber':
                this.setControlValue('PassProspectNumber', this.riGrid.Details.GetValue('ProspectNumber'));
                this.navigate('SalesOrder', '/prospecttocontract/maintenance/prospect', { 'ProspectNumber': this.riGrid.Details.GetValue('ProspectNumber') });
                this.riGrid.RefreshRequired();
                break;
            case 'Quotes':
                this.navigate('', InternalGridSearchSalesModuleRoutes.ICABSSSOQUOTEGRID, {
                    'ProspectNumber': this.riGrid.Details.GetValue('ProspectNumber'),
                    'ProspectName': this.riGrid.Details.GetValue('ProspectName')
                });
                this.riGrid.RefreshRequired();
                break;
            case 'Contacts':
                if (!this.getControlValue('LocalSystemInd')) {
                    //this.navigate('CMSearch', 'iCABSCMCustomerContactMaintenance');
                    alert('iCABSCMCustomerContactMaintenance not developed');
                }
                break;
        }
    }

    public getCurrentPage(currentPage: any): void {
        this.PageCurrent = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.PageCurrent));
        this.buildGrid();
    }

    public refresh(): void {
        this.buildGrid();
    }

    public reviewGrid_OnClick(): void {
        this.pageParams.EmployeeCode = this.getControlValue('EmployeeCode');
        this.pageParams.EmployeeSurname = this.getControlValue('EmployeeSurname');
        this.pageParams.InclusionTypeSelect = this.getControlValue('InclusionTypeSelect');
        this.pageParams.fromDate = this.getControlValue('fromDate');
        this.pageParams.toDate = this.getControlValue('toDate');
        this.pageParams.OriginSelect = this.originSelectDropdown.selectedItem;
        this.pageParams.StatusSelect = this.StatusSelectDropdown.selectedItem;
        this.pageParams.uiDisplaycmdReviewGrid = this.uiDisplay.cmdReviewGrid;
        this.pageParams.uiDisplayfromDate = this.uiDisplay.fromDate;
        this.pageParams.uiDisplaytoDate = this.uiDisplay.toDate;
        this.navigate('ProspectGrid', '/ccm/centreReview');
    }

    public speedScriptCode(): void {
        let lookupIP = [
            {
                'table': 'riRegistry',
                'query': {
                    'regSection': 'Sales Order Processing',
                    'regKey': 'Central/Local',
                    'regValue': 'Local'
                },
                'fields': ['regValue']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let value: string;
            if (data.hasError) {
                this.displayError(data.errorMessage);
                return;
            }
            value = data[0].length !== 0 ? 'yes' : 'no';
            this.setControlValue('LocalSystemInd', this.utils.convertResponseValueToCheckboxInput(value));
        }, (error) => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    }

    public buildStatusList(): void {

        let lookupIP = [
            {
                'table': 'ProspectStatusLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['ProspectStatusCode', 'ProspectStatusDesc']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let prospectStatusCode: Array<string> = [
                '02',
                '03',
                '04'
            ];
            if (data.hasError) {
                this.displayError(data.errorMessage);
                return;
            }
            let obj: any = [];
            let lIncludedConverted: boolean = false;
            for (let i = 0; i < data[0].length; i++) {
                if (prospectStatusCode.indexOf(data[0][i].ProspectStatusCode) >= 0) {
                    if (lIncludedConverted) {
                        continue;
                    }
                    lIncludedConverted = true;
                    let obj = {
                        text: 'Converted',
                        value: '-99'
                    };
                    this.ProspectStatus.push(obj);
                    continue;
                }
                let obj = {
                    text: data[0][i].ProspectStatusDesc,
                    value: data[0][i].ProspectStatusCode
                };
                this.ProspectStatus.push(obj);
            }
        }, (error) => {
            this.displayError(MessageConstant.Message.GeneralError, error);
        });
        this.pageParams.ProspectStatus = this.ProspectStatus;
    }

    public buildOriginCodes(): void {

        let BusinessSource_BusinessCode;
        let BusinessSource_BusinessSourceCode;
        let BusinessSource_BusinessSourceSystemDesc;
        let BusinessOrigin_BusinessCode;
        let BusinessOrigin_BusinessOriginCode;
        let BusinessOrigin_BusinessOriginDetailRequiredInd;
        let BusinessOriginDetail_BusinessCode;
        let BusinessOriginDetail_BusinessOriginCode;
        let BusinessOriginDetail_BusinessOriginDetailCode;
        let languageCode = this.riExchange.LanguageCode();

        let lookupBusinessSourceLangArray: Array<any> = [];
        let lookupBusinessOriginArray: Array<any> = [];
        let lookupBusinessOriginLangArray: Array<any> = [];
        let lookupBusinessOriginDetailArray: Array<any> = [];
        let lookupBusinessOriginDetailLangArray: Array<any> = [];

        let BusinessSourceLookupArray: Array<any> = [];
        let BusinessOriginArray: Array<any> = [];
        let BusinessOriginDetailArray: Array<any> = [];
        let BusinessOriginDetailLangArray: Array<any> = [];

        let businessorigindetaildata;

        let buildOriginCodes: URLSearchParams = this.getURLSearchParamObject();
        buildOriginCodes.set(this.serviceConstants.Action, '0');
        buildOriginCodes.set(this.serviceConstants.MaxResults, '100');

        let lookupBusinessSource = [
            {
                'table': 'BusinessSource',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessSourceSystemDesc', 'SalesDefaultInd']
            }
        ];

        this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.lookUpRequest(buildOriginCodes, lookupBusinessSource).flatMap((data) => {

            BusinessSourceLookupArray = data.results[0];

            for (let i = 0; i < BusinessSourceLookupArray.length; i++) {

                BusinessSource_BusinessCode = BusinessSourceLookupArray[i].BusinessCode;
                BusinessSource_BusinessSourceCode = BusinessSourceLookupArray[i].BusinessSourceCode;
                BusinessSource_BusinessSourceSystemDesc = BusinessSourceLookupArray[i].BusinessSourceSystemDesc;
                let lookupBusinessSourceLang = [
                    {
                        'table': 'BusinessSourceLang',
                        'query': {
                            'BusinessCode': BusinessSource_BusinessCode,
                            'BusinessSourceCode': BusinessSource_BusinessSourceCode,
                            'LanguageCode': languageCode
                        },
                        'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessSourceDesc']
                    }
                ];

                let lookupBusinessOrigin = [
                    {
                        'table': 'BusinessOrigin',
                        'query': {
                            'BusinessCode': BusinessSource_BusinessCode,
                            'BusinessSourceCode': BusinessSource_BusinessSourceCode
                        },
                        'fields': ['BusinessCode', 'BusinessSourceCode', 'BusinessOriginCode', 'BusinessOriginSystemDesc', 'DetailRequiredInd']
                    }
                ];
                lookupBusinessSourceLangArray.push(this.httpService.lookUpRequest(buildOriginCodes, lookupBusinessSourceLang));
                lookupBusinessOriginArray.push(this.httpService.lookUpRequest(buildOriginCodes, lookupBusinessOrigin));
            }
            return Observable.forkJoin(lookupBusinessSourceLangArray).combineLatest(Observable.forkJoin(lookupBusinessOriginArray));
        }).flatMap(res => {
            for (let i = 0; i < res[0].length; i++) {
                if (res[0].length && res[0][i]['results'][0].length) {
                    let obj1 = {
                        text: res[0][i]['results'][0][0].BusinessSourceDesc,
                        value: res[0][i]['results'][0][0].BusinessSourceCode
                    };
                    this.ProspectOrigin.push(obj1);
                    continue;
                }
                let obj1 = {
                    text: BusinessSourceLookupArray[i].BusinessSourceSystemDesc,
                    value: res[0][i]['results'][0][0].BusinessSourceCode
                };
                this.ProspectOrigin.push(obj1);
            }
            for (let i = 0; i < res[1].length; i++) {
                let businessorigindata = res[1][i]['results'][0];
                for (let j = 0; j < businessorigindata.length; j++) {
                    BusinessOriginArray.push(res[1][i]['results'][0][j]);
                    BusinessOrigin_BusinessOriginDetailRequiredInd = businessorigindata[j].DetailRequiredInd;
                    BusinessOrigin_BusinessCode = businessorigindata[j].BusinessCode;
                    BusinessOrigin_BusinessOriginCode = businessorigindata[j].BusinessOriginCode;

                    let lookupBusinessOriginLang = [
                        {
                            'table': 'BusinessOriginLang',
                            'query': {
                                'BusinessCode': BusinessOrigin_BusinessCode,
                                'BusinessOriginCode': BusinessOrigin_BusinessOriginCode,
                                'LanguageCode': languageCode
                            },
                            'fields': ['BusinessCode', 'BusinessOriginCode', 'BusinessOriginDesc']
                        }
                    ];
                    if (BusinessOrigin_BusinessOriginDetailRequiredInd) {
                        BusinessOriginDetailArray.push(res[1][i]['results'][0][j]);
                        let lookupBusinessOriginDetail = [
                            {
                                'table': 'BusinessOriginDetail',
                                'query': {
                                    'BusinessCode': BusinessOrigin_BusinessCode,
                                    'BusinessOriginCode': BusinessOrigin_BusinessOriginCode
                                },
                                'fields': ['BusinessCode', 'BusinessOriginCode', 'BusinessOriginDetailCode', 'BusinessOriginDetailSystemDesc']
                            }
                        ];
                        lookupBusinessOriginDetailArray.push(this.httpService.lookUpRequest(buildOriginCodes, lookupBusinessOriginDetail));
                    }
                    lookupBusinessOriginLangArray.push(this.httpService.lookUpRequest(buildOriginCodes, lookupBusinessOriginLang));
                }
            }
            return Observable.forkJoin(lookupBusinessOriginLangArray.length ? Observable.forkJoin(lookupBusinessOriginLangArray) : Observable.of([])).combineLatest(Observable.forkJoin(lookupBusinessOriginDetailArray.length ? Observable.forkJoin(lookupBusinessOriginDetailArray) : Observable.of([])));
        }).flatMap(res => {
            for (let i = 0; i < res[0][0].length; i++) {
                let obj1;
                if (res[0].length && res[0][0][i]['results'][0].length) {
                    for (let j = 0; j < this.ProspectOrigin.length; j++) {
                        let bus = (this.ProspectOrigin[j].value).split('^');
                        let desc = (this.ProspectOrigin[j].text).split('/');
                        if ((BusinessOriginArray[i].BusinessSourceCode === bus[0])) {
                            obj1 = {
                                text: desc[0] + '/' + res[0][0][i]['results'][0][0].BusinessOriginDesc,
                                value: BusinessOriginArray[i].BusinessSourceCode + '^' + res[0][0][i]['results'][0][0].BusinessOriginCode
                            };
                            break;
                        }
                    }
                    this.ProspectOrigin.push(obj1);
                    continue;
                }
                for (let j = 0; j < this.ProspectOrigin.length; j++) {
                    let bus = (this.ProspectOrigin[j].value).split('^');
                    let desc = (this.ProspectOrigin[j].text).split('/');
                    if ((BusinessOriginArray[i].BusinessSourceCode === bus[0])) {
                        obj1 = {
                            text: desc[0] + '/' + BusinessOriginArray[i].BusinessOriginSystemDesc,
                            value: BusinessOriginArray[i].BusinessSourceCode + '^' + BusinessOriginArray[i].BusinessOriginCode
                        };
                        break;
                    }
                }
                this.ProspectOrigin.push(obj1);
            }

            for (let i = 0; i < res[1][0].length; i++) {
                businessorigindetaildata = res[1][0][i]['results'][0];
                for (let j = 0; j < businessorigindetaildata.length; j++) {
                    if (BusinessOriginDetailArray[i].BusinessOriginCode === businessorigindetaildata[j].BusinessOriginCode) {
                        BusinessOriginDetailLangArray.push(BusinessOriginDetailArray[i]);
                    }
                    BusinessOriginDetail_BusinessCode = businessorigindetaildata[j].BusinessCode;
                    BusinessOriginDetail_BusinessOriginCode = businessorigindetaildata[j].BusinessOriginCode;
                    BusinessOriginDetail_BusinessOriginDetailCode = businessorigindetaildata[j].BusinessOriginDetailCode;

                    let lookupBusinessOriginDetailLang = [
                        {
                            'table': 'BusinessOriginDetailLang',
                            'query': {
                                'BusinessCode': BusinessOriginDetail_BusinessCode,
                                'BusinessOriginCode': BusinessOriginDetail_BusinessOriginCode,
                                'BusinessOriginDetailCode': BusinessOriginDetail_BusinessOriginDetailCode,
                                'LanguageCode': this.riExchange.LanguageCode()
                            },
                            'fields': ['BusinessCode', 'BusinessOriginCode', 'BusinessOriginDetailCode', 'BusinessOriginDetailDesc']
                        }
                    ];
                    lookupBusinessOriginDetailLangArray.push(this.httpService.lookUpRequest(buildOriginCodes, lookupBusinessOriginDetailLang));
                }
            }
            return Observable.forkJoin(lookupBusinessOriginDetailLangArray.length ? Observable.forkJoin(lookupBusinessOriginDetailLangArray) : Observable.of([]));
        }).subscribe(res => {
            if (res[0].length && res[0][0]['results'][0].length) {
                let businessOriginDetailLangTempArray: Array<any> = [];
                for (let i = 0; i < res[0][0]['results'][0].length; i++) {
                    for (let j = 0; j < this.ProspectOrigin.length; j++) {
                        let ProspectOriginSplitArray = (this.ProspectOrigin[j].value).split('^');
                        if ((BusinessOriginDetailLangArray[i].BusinessSourceCode === ProspectOriginSplitArray[0]) && (res[0][0]['results'][0][i].BusinessOriginCode === ProspectOriginSplitArray[1])) {
                            let obj1 = {
                                text: this.ProspectOrigin[j].text + '/' + res[0][0]['results'][0][i].BusinessOriginDetailDesc,
                                value: this.ProspectOrigin[j].value + '^' + res[0][0]['results'][0][i].BusinessOriginCode
                            };
                            businessOriginDetailLangTempArray.push(obj1);
                        }
                    }
                }
                for (let j = 0; j < businessOriginDetailLangTempArray.length; j++) {
                    this.ProspectOrigin.push(businessOriginDetailLangTempArray[j]);
                }
            }
            this.ProspectOrigin = this.orderBy.transform(this.ProspectOrigin, 'text');
            this.ProspectOrigin = this.allOption.concat(this.ProspectOrigin);
            this.pageParams.ProspectOrigin = this.ProspectOrigin;
        });
    }
}
