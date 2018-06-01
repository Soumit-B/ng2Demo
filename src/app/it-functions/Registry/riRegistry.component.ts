import { Component, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { GridComponent } from './../../../shared/components/grid/grid';
import { GlobalConstant } from './../../../shared/constants/global.constant';

@Component({
    templateUrl: 'riRegistry.html'
})

export class RiRegistryComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riRegistryGrid') riRegistryGrid: GridComponent;
    public method: string = 'it-functions/ri-model';
    public module: string = 'configuration';
    public operation: string = 'Model/riRegistry';
    public search: URLSearchParams = new URLSearchParams();
    public queryPost: any = {
        operation: 'Model/riRegistry',
        module: 'configuration',
        method: 'it-functions/ri-model',
        contentType: 'application/x-www-form-urlencoded'
    };
    public itemsPerPage: number = 10;
    public pageSize: number = 10;
    public currentPage: number = 1;
    public paginationCurrentPage: number = 1;
    public maxColumns: number = 2;
    public totalRecords: number;
    public inputParams: any;
    public controls: Array<any> = [];
    public pageId: string = PageIdentifier.RIREGISTRY;
    public dataToGrid: Array<any> = [
        {
            colNumber: 0,
            type: 'text',
            editable: false
        },
        {
            colNumber: 1,
            type: 'text',
            editable: true
        }
    ];
    private routeParams: any;

    constructor(injector: Injector, private titleService: Title) {
        super(injector);
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.inputParams = {
            'parentMode': 'LookUp'
        };
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
        this.activatedRoute.params.subscribe(
            (param: any) => {
                if (param) {
                    this.currentPage = 1;
                    this.paginationCurrentPage = 1;
                    this.riExchange.setRouterUrlParams(param);
                    this.updateView();
                }
            });

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public getCurrentPage(event: any): void {
        this.currentPage = event.value;
        this.refresh();
    }
    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
        setTimeout(() => {
            this.paginationCurrentPage = this.currentPage;
        }, 0);
    }
    public onGridRowClick(data: any): void {
        // statement
    }
    public updateView(): void {
        let urlParams = this.riExchange.getRouterUrlParams();
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('RegSection', urlParams['section']);
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.inputParams.search = this.search;
        this.riRegistryGrid.loadGridData(this.inputParams);
    }
    public postData(data: any): void {
        let urlParams = this.riExchange.getRouterUrlParams();
        let queryPost = new URLSearchParams();
        queryPost.set(this.serviceConstants.BusinessCode, this.businessCode());
        queryPost.set(this.serviceConstants.CountryCode, this.countryCode());
        queryPost.set(this.serviceConstants.Action, '2');
        queryPost.set('riSortOrder', 'Descending');
        queryPost.set('riGridMode', '3');
        queryPost.set('RegSection', urlParams['section']);
        queryPost.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        queryPost.set('HeaderClickedColumn', 'Descending');
        this.httpService.makePostRequest(this.queryPost.method, this.queryPost.module, this.queryPost.operation, queryPost, data).subscribe(
            (e) => {
                if (e.status === GlobalConstant.Configuration.Failure) {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e['errorMessage']) {
                        this.errorService.emitError(e);
                        return;
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    public getCellDataonBlur(event: any): void {
        let defaultData = {
            RegKeyRowID: event.completeRowData[0].rowID,
            RegKey: event.completeRowData[0].text,
            RegValueRowID: event.completeRowData[1].rowID,
            RegValue: event.completeRowData[1].text
        };
        if (event.cellIndex === 0) {
            defaultData.RegKey = event.keyCode.target.value;
        } else {
            defaultData.RegValue = event.keyCode.target.value;
        }
        this.postData(defaultData);
    }
    public refresh(): void {
        this.updateView();
    }
    private fetchTranslationContent(): void {
        // translation content
        this.getTranslatedValue('Registry', null).subscribe((res: string) => {
            if (res) {
                this.titleService.setTitle(res);
            } else {
                this.titleService.setTitle('Registry');
            }
        });
    }
}
