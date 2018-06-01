import { PageIdentifier } from './../../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { HttpService } from '../../../../shared/services/http-service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/Rx';
import { GridAdvancedComponent } from '../../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination';
import { AjaxConstant } from '../../../../shared/constants/AjaxConstants';
import { ICabsModalVO } from '../../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { CustomDatepickerComponent } from '../../../../shared/components/custom-datepicker/custom-datepicker';
import { DropdownStaticComponent } from '../../../../shared/components/dropdown-static/dropdownstatic';
import { ScreenNotReadyComponent } from '../../../../shared/components/screenNotReady';
import { LocalStorageService, SessionStorageService } from 'ng2-webstorage';

@Component({
    templateUrl: 'iCABSServiceCallTypeGrid.html'
})

export class ServiceCallTypeGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('visitTypeSearch') public visitTypeSearch;

    public pageId: string = '';
    public storeInvoice: Object;
    public controls = [
        { name: 'RegionCode', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'RegionDesc', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'BranchNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: false, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'DateFrom', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'VisitTypeCodeString', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ViewOptions' },
        { name: 'drilldowndata' },
        { name: 'Mode' }
    ];
    public ViewLevel: string = 'Business';
    public visitTypeDisable: boolean = false;
    public viewOption;
    public regionCode;
    public tdBranch = false;
    public tdRegion = false;
    public tdServiceArea = false;
    public isRequesting = false;
    public visitTypeDataClone: Array<any> = [];
    public gridSearch: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public screenNotReadyComponent = ScreenNotReadyComponent;
    public gridConfig = {
        pageSize: 10,
        currentPage: 1,
        totalRecords: 1,
        action: '2'
    };
    public visitTypeInputParams: any = {
        parentMode: 'LookUp-String',
        byVisitAction: 'True',
        systemVisitActionCode: ''
    };
    public queryParams: any = {
        operation: 'Service/iCABSServiceCallTypeGrid',
        module: 'report',
        method: 'service-delivery/grid'
    };

    constructor(injector: Injector, private xhr: HttpService, private ref: ChangeDetectorRef, private _ls: LocalStorageService) {
        super(injector);
        //this.pageId = PageIdentifier.ICABSSERVICECALLTYPEGRID;
        this.browserTitle = 'Service Visits By Visit Type';
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['mode']) {
                switch (params['mode']) {
                    case 'Branch':
                        this.pageId = 'Branch';
                        break;
                    case 'Region':
                        this.pageId = 'Region';
                        break;
                    case 'ServiceArea':
                        this.pageId = 'ServiceArea';
                        break;
                    case 'Business':
                        this.pageId = 'Business';
                        break;
                }
            }
        });
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            if (this.pageId !== 'Business') {
                this.disableControl('VisitTypeCodeString', true);
                this.disableControl('ViewOptions', true);
            }
            if (this.pageId === 'Branch') {
                this.ViewLevel = 'Branch';
                this.disableControl('BranchNumber', true);
                this.tdBranch = true;
            } else
                if (this.pageId === 'Region') {
                    this.ViewLevel = 'Region';
                    this.disableControl('BranchNumber', true);
                    this.tdRegion = true;
                } else
                    if (this.pageId === 'ServiceArea') {
                        this.ViewLevel = 'ServiceArea';
                        this.tdBranch = true;
                        this.disableControl('BranchNumber', true);
                        this.tdServiceArea = true;
                        this.disableControl('BranchServiceAreaCode', true);
                    }
        } else {
            this.window_onload();
        }
        this.buildGrid();
        this.riGrid_onRefresh();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public window_onload(): void {
        this.riExchange.setCurrentContractType();
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.PageSize = 10;
        this.setControlValue('DateFrom', this.utils.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
        this.setControlValue('DateTo', this.utils.formatDate(new Date()));
        if (this.riExchange.routerParams['mode'] === 'Branch') {
            this.ViewLevel = 'Branch';
            this.setControlValue('BranchNumber', this.utils.getBranchCode());
            let branchText = this.utils.getBranchText().split('-');
            this.setControlValue('BranchName', branchText[1]);
            this.disableControl('BranchNumber', true);
            this.tdBranch = true;
        } else
            if (this.riExchange.routerParams['mode'] === 'Region') {
                if (this.riExchange.getParentMode() !== 'DrillDown') {
                    this.utils.getRegionCode().subscribe((data) => {
                        this.regionCode = data;
                        this.setControlValue('RegionCode', this.regionCode);
                        this.getRegionDesc(this.regionCode).subscribe((data) => {
                            this.setControlValue('RegionDesc', data);
                        });
                    });
                }
                this.ViewLevel = 'Region';
                this.disableControl('BranchNumber', true);
                this.tdRegion = true;
            } else
                if (this.riExchange.routerParams['mode'] === 'ServiceArea') {
                    this.ViewLevel = 'ServiceArea';
                    this.setControlValue('BranchNumber', (this.riExchange.getParentHTMLValue('BranchNumber') || this.utils.getBranchCode()));
                    this.setControlValue('BranchName', this.riExchange.getParentHTMLValue('BranchName'));
                    this.tdBranch = true;
                    this.disableControl('BranchNumber', true);
                    this.tdServiceArea = true;
                    this.disableControl('BranchServiceAreaCode', true);
                }
        if (this.riExchange.getParentMode() === 'DrillDown') {
            this.setControlValue('VisitTypeCodeString', this.riExchange.getParentHTMLValue('VisitTypeCodeString'));
            this.setControlValue('DateFrom', this.riExchange.getParentHTMLValue('DateFrom'));
            this.setControlValue('DateTo', this.riExchange.getParentHTMLValue('DateTo'));
            this.setControlValue('ViewOptions', this.riExchange.getParentHTMLValue('ViewOptions'));
            this.disableControl('VisitTypeCodeString', true);
            this.disableControl('ViewOptions', true);
            this.visitTypeDisable = true;
            let tmp = this.riExchange.routerParams['data'].split('|');
            switch (this.ViewLevel) {
                case 'Region':
                    this.setControlValue('RegionCode', tmp[0]);
                    this.setControlValue('RegionDesc', tmp[1]);
                    break;
                case 'Branch':
                    this.setControlValue('BranchNumber', tmp[0]);
                    this.setControlValue('BranchName', tmp[1]);
                    break;
                case 'ServiceArea':
                    this.setControlValue('BranchServiceAreaCode', tmp[0]);
                    this.setControlValue('EmployeeSurname', tmp[1]);
            }
        }

    }

    public buildGrid(): void {
        this.riGrid.Clear();
        switch (this.ViewLevel) {
            case 'Business':
                this.riGrid.AddColumn('Region', 'ServiceVisit', 'Region', MntConst.eTypeCode, 2, true);
                this.riGrid.AddColumn('RegionName', 'ServiceVisit', 'RegionName', MntConst.eTypeCode, 30);
                this.riGrid.AddColumn('Branch', 'ServiceVisit', 'Branch', MntConst.eTypeCode, 4, true);
                this.riGrid.AddColumn('BranchName', 'ServiceVisit', 'Branch', MntConst.eTypeCode, 30);
                this.riGrid.AddColumn('VisitType', 'ServiceVisit', 'VisitType', MntConst.eTypeCode, 4);
                this.riGrid.AddColumn('VisitTypeDesc', 'ServiceVisit', 'VisitType', MntConst.eTypeCode, 20);
                this.riGrid.AddColumn('NumberOfVisits', 'ServiceVisit', 'NumberOfVisits', MntConst.eTypeInteger, 4);
                break;
            case 'Region':
                this.riGrid.AddColumn('Branch', 'ServiceVisit', 'Branch', MntConst.eTypeCode, 4, true);
                this.riGrid.AddColumn('BranchName', 'ServiceVisit', 'Branch', MntConst.eTypeCode, 30);
                this.riGrid.AddColumn('VisitType', 'ServiceVisit', 'VisitType', MntConst.eTypeCode, 4);
                this.riGrid.AddColumn('VisitTypeDesc', 'ServiceVisit', 'VisitType', MntConst.eTypeCode, 20);
                this.riGrid.AddColumn('NumberOfVisits', 'ServiceVisit', 'NumberOfVisits', MntConst.eTypeInteger, 4);
                break;
            case 'Branch':
                this.riGrid.AddColumn('ServiceArea', 'ServiceVisit', 'ServiceArea', MntConst.eTypeCode, 4);
                this.riGrid.AddColumn('ServiceAreaName', 'ServiceVisit', 'ServiceArea', MntConst.eTypeCode, 4);
                this.riGrid.AddColumn('VisitType', 'ServiceVisit', 'VisitType', MntConst.eTypeCode, 4);
                this.riGrid.AddColumn('VisitTypeDesc', 'ServiceVisit', 'VisitType', MntConst.eTypeCode, 20);
                this.riGrid.AddColumn('NumberOfVisits', 'ServiceVisit', 'NumberOfVisits', MntConst.eTypeInteger, 4);
                break;
            case 'ServiceArea':
                this.riGrid.AddColumn('Contract', 'ServiceVisit', 'Contract', MntConst.eTypeCode, 10);
                this.riGrid.AddColumn('CustomerName', 'ServiceVisit', 'CustomerName', MntConst.eTypeCode, 30);
                this.riGrid.AddColumn('PremiseNumber', 'ServiceVisit', 'PremiseNumber', MntConst.eTypeInteger, 4);
                this.riGrid.AddColumn('ProductCode', 'ServiceVisit', 'ProductCode', MntConst.eTypeText, 10);
                this.riGrid.AddColumn('ProductDesc', 'ServiceVisit', 'ProductDesc', MntConst.eTypeText, 20);
                this.riGrid.AddColumn('ServicedQuantity', 'ServiceVisit', 'ServicedQuantity', MntConst.eTypeInteger, 4);
                this.riGrid.AddColumn('VisitType', 'ServiceVisit', 'VisitType', MntConst.eTypeCode, 4);
                this.riGrid.AddColumn('VisitTypeDesc', 'ServiceVisit', 'VisitType', MntConst.eTypeCode, 20);
                this.riGrid.AddColumn('VisitDate', 'ServiceVisit', 'VisitDate', MntConst.eTypeDate, 12);
                break;
            default:
                break;
        }
        this.riGrid.Complete();
    }

    public populateGrid(): void {
        this.gridSearch = this.getURLSearchParamObject();
        this.gridSearch.set('ViewLevel', this.ViewLevel);
        this.gridSearch.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        this.gridSearch.set('RegionCode', this.getControlValue('RegionCode'));
        this.gridSearch.set('BranchNumber', this.getControlValue('BranchNumber'));
        this.gridSearch.set('VisitTypeCodeString', this.getControlValue('VisitTypeCodeString'));
        this.gridSearch.set('DateFrom', (this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom')).toString()) || this.globalize.parseDateToFixedFormat(this.riExchange.getParentHTMLValue('DateFrom')).toString());
        this.gridSearch.set('DateTo', (this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo')).toString()) || this.globalize.parseDateToFixedFormat(this.riExchange.getParentHTMLValue('DateTo')).toString());
        this.gridSearch.set('ViewOption', this.getControlValue('ViewOptions') || this.viewOption);
        this.gridSearch.set(this.serviceConstants.GridMode, '0');
        this.gridSearch.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.gridSearch.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.gridSearch.set(this.serviceConstants.PageSize, this.gridConfig.pageSize.toString());
        this.gridSearch.set(this.serviceConstants.PageCurrent, this.gridConfig.currentPage.toString());
        this.gridSearch.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.gridSearch.set(this.serviceConstants.GridSortOrder, sortOrder);
        this.gridSearch.set(this.serviceConstants.Action, this.gridConfig.action.toString());
        this.ajaxSource.next(AjaxConstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.gridSearch)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage));
                    this.isRequesting = false;
                } else {
                    this.isRequesting = false;
                    this.riGrid.RefreshRequired();
                    this.riGridPagination.currentPage = this.gridConfig.currentPage = e.pageData ? e.pageData.pageNumber : 1;
                    this.riGridPagination.totalItems = this.gridConfig.totalRecords = e.pageData ? e.pageData.lastPageNumber * this.gridConfig.pageSize : 1;
                    this.riGrid.Execute(e);
                    this.ref.detectChanges();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }

    public Date_onchange(): void {
        this.riGrid.RefreshRequired();
        this.riGrid.ResetGrid();
        this.populateGrid();
    }

    public visitTypeSelectedValue(value: any): void {
        this.setControlValue('VisitTypeCodeString', value.VisitTypeCode || value.value);
        this.uiForm.markAsDirty();
    }

    public menuOptionsChange(event: any): void {
        this.viewOption = event;
    }

    public riGrid_onRefresh(): void {
        if ((this.getControlValue('DateFrom') !== '' && this.getControlValue('DateTo') !== '') || (this.riExchange.getParentHTMLValue('DateFrom') !== '' && this.riExchange.getParentHTMLValue('DateTo') !== '')) {
            if (this.riGrid.currentPage <= 0) {
                this.riGrid.currentPage = 1;
            }
            this.riGrid.RefreshRequired();
            this.populateGrid();
        }
    }

    public getCurrentPage(currentPage: any): void {
        this.gridConfig.currentPage = currentPage.value;
        this.riGrid_onRefresh();
    }

    public riGrid_BodyOnDblClick(event: any): void {
        let navData = event.srcElement.value + '|' + event.srcElement.parentElement.parentElement.nextSibling.children[0].children[0].innerText;
        switch (this.riGrid.CurrentColumnName) {
            case 'Region':
                this.navigate('DrillDown', '/servicedelivery/regionservicecalltype', {
                    'mode': 'Region',
                    'data': navData,
                    'DateFrom': this.getControlValue('DateFrom'),
                    'DateTo': this.getControlValue('DateTo'),
                    'VisitTypeCodeString': this.getControlValue('VisitTypeCodeString'),
                    'ViewOptions': this.getControlValue('ViewOptions')
                });
                break;
            case 'Branch':
                this.navigate('DrillDown', '/servicedelivery/branchservicecalltype', {
                    'mode': 'Branch',
                    'data': navData,
                    'DateFrom': this.getControlValue('DateFrom'),
                    'DateTo': this.getControlValue('DateTo'),
                    'VisitTypeCodeString': this.getControlValue('VisitTypeCodeString'),
                    'ViewOptions': this.getControlValue('ViewOptions')
                });
                break;
            case 'ServiceArea':
                this.navigate('DrillDown', '/servicedelivery/serviceareaservicecalltype', {
                    'mode': 'ServiceArea',
                    'data': navData,
                    'DateFrom': this.getControlValue('DateFrom'),
                    'DateTo': this.getControlValue('DateTo'),
                    'VisitTypeCodeString': this.getControlValue('VisitTypeCodeString'),
                    'BranchNumber': this.getControlValue('BranchNumber'),
                    'ViewOptions': this.getControlValue('ViewOptions')
                });
                break;
            default:
                break;
        }
    }

    public getRegionDesc(regionCode: any): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let lookupIP = [
            {
                'table': 'Region',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'RegionCode': regionCode
                },
                'fields': ['RegionDesc']
            }
        ];

        let queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '100');
        this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(res => retObj.next(res.results[0][0].RegionDesc));
        return retObj;
    }
}
