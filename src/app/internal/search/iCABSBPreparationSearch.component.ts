import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/takeWhile';

import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { GridAdvancedComponent } from '../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from '../../../shared/constants/service.constants';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpService } from '../../../shared/services/http-service';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { Utils } from '../../../shared/services/utility';
import { LookUp } from '../../../shared/services/lookup';




@Component({
    templateUrl: 'iCABSBPreparationSearch.html'
})

export class PreparationSearchComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('preparationSearchPagination') preparationSearchPagination: PaginationComponent;

    private isRequesting: boolean = false;
    private vbExport: string = '';
    private isTdLOS: boolean = false;
    private fieldList: string = '';
    private lineOfServiceLookUp: Subscription;
    private action: string = '2';
    private parentMode: string = 'LookUpLOS';
    private isAlive: boolean = true;

    public pageId: string = '';
    public headerParams: any = {
        method: 'service-delivery/search',
        operation: 'Business/iCABSBPreparationSearch',
        module: 'preps'
    };
    public pageSize: number = 10;
    public curPage: number = 1;
    public isMessageHeaderVisible: boolean = true;
    public lineOfServiceList: any;
    public totalRecords: number = 1;
    public itemsPerPage: number = 10;
    public ajaxSource = new BehaviorSubject<any>(0);
    public losCode: string = '';

    constructor(private ellipsis: EllipsisComponent,
        private ajaxconstant: AjaxObservableConstant,
        private lookUp: LookUp,
        private errorService: ErrorService,
        private serviceConstants: ServiceConstants,
        private utils: Utils,
        private httpService: HttpService) {
        // super(injector);
        this.pageId = PageIdentifier.ICABSBPREPARATIONSEARCH;
        ;
    }

    public ngOnInit(): void {
        // super.ngOnInit();
        this.windowOnload();
    }

    public ngOnDestroy(): void {
        //Release memory
        this.serviceConstants = null;
        this.httpService = null;
        this.errorService = null;
        this.utils = null;
        this.ajaxSource = null;

        //Unsubscribe all subscription
        this.isAlive = false;
    }
    private buildGrid(): void {
        this.riGrid.AddColumn('PrepCode', 'Preparation', 'PrepCode', MntConst.eTypeCode, 10, false, '');
        this.riGrid.AddColumn('PrepDesc', 'Preparation', 'PrepDesc', MntConst.eTypeText, 20, false, '');
        this.riGrid.AddColumn('PassToPDAInd', 'Preparation', 'PassToPDAInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('RejectPrepInd', 'Preparation', 'RejectPrepInd', MntConst.eTypeImage, 1, false, '');
        this.riGrid.AddColumn('MeasureBy', 'Preparation', 'MeasureBy', MntConst.eTypeText, 20, false, '');
        this.riGrid.AddColumn('LOSName', 'Preparation', 'LOSName', MntConst.eTypeText, 40, false, '');
        // }

        this.riGrid.Complete();
    }

    private windowOnload(): void {
        this.fetchLineOfServiceDropDown();
        switch (this.parentMode) {
            case 'LookUpLOS':
                // let BuffLOSCode = this.riExchange.GetParentHTMLInputValue(this.uiForm, 'BuffLOSCode');
                // this.setControlValue('losCode', BuffLOSCode);
                break;
            default:
                this.isTdLOS = true;
        }
    }

    private riGridBeforeExecute(): void {
        let vbLOSCode: any;
        if (this.parentMode === 'LookUpLOS' && this.losCode === '') {
            //this.losCode = '?';
        } else {
            vbLOSCode = this.losCode;
        }

        let search: URLSearchParams = this.getURLSearchParamObject(), sortOrder: any = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set(this.serviceConstants.Action, this.action);
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        search.set(this.serviceConstants.GridPageCurrent, this.curPage.toString());
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        search.set('LanguageCode', this.utils.getDefaultLang());
        search.set('riCacheRefresh', 'True');
        search.set('PageCurrent', this.curPage.toString());
        search.set('FieldList', this.fieldList);
        search.set('losCode', this.losCode);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, search).takeWhile(() => this.isAlive).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.messageModal.show(data, true);
                } else {
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.ResetGrid();
                    this.riGrid.Execute(data);

                }
                this.isRequesting = false;
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //=Start: Grid functionality
    public initGrid(): void {
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.buildGrid();
        this.riGridBeforeExecute();
    }

    public refresh(): void {
        this.curPage = 1;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        if (this.curPage > 1) {
            this.action = '3';
        } else {
            this.action = '2';
        }
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public getGridInfo(): void {
        this.totalRecords = this.riGrid.totalPages * this.itemsPerPage;
    }
    /// Lookup
    public fetchLineOfServiceDropDown(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP_details = [{
            'table': 'LineOfService',
            'query': { 'ValidForBusiness ': this.utils.getBusinessCode() },
            'fields': ['LOSCode', 'LOSName']
        }
        ];

        this.lineOfServiceLookUp = this.lookUp.lookUpRecord(lookupIP_details).takeWhile(() => this.isAlive).subscribe((e) => {
            if (e && e.length > 0 && e[0].length > 0) {
                this.lineOfServiceList = e[0];
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                this.errorService.emitError(error);

            });
    }

    public updateView(params: any): void {
        // this.parentMode = params.parentMode;
        this.initGrid();
    }

    public riGridBodyOnDblClick(event: any): void {

        let returnObj: any;
        switch (this.parentMode) {
            case 'lookUp':
                returnObj = {
                    'PrepDesc': event.row.PrepDesc
                };
                break;
            case 'lookAll':
                returnObj = {
                    'PrepDesc': event.row.PrepDesc,
                    'MeasureBy': event.row.MeasureBy
                };
                break;
            case 'lookUpDesc':
            case 'lookUpLOS':
                returnObj = {
                    'PrepDesc': event.row.PrepDesc
                };
                break;
            default:
            // any default in future will go here
        }
        this.ellipsis.sendDataToParent(returnObj);
    }
    public getURLSearchParamObject(): URLSearchParams {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        return search;
    }

    public losCodeSelected(event: any): void {
        this.losCode = event.target.value;
    }

}
