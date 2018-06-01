import { Component, OnInit, Injector, ViewChild, Input, Renderer, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { PageIdentifier } from './../../base/PageIdentifier';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from './../../../shared/services/utility';
import { RiExchange } from '../../../shared/services/riExchange';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ModalAdvService } from './../../../shared/components/modal-adv/modal-adv.service';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSBProductCoverSearch.html'
})

export class ProductCoverSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;
    @ViewChild('ProductCoverSearchValue') productCoverSearchValue;

    public pageId: string = '';
    public controls = [
        { name: 'ProductCode', disabled: true },
        { name: 'ProductDesc', disabled: true },
        { name: 'ProductCoverSearchType' },
        { name: 'ProductCoverSearchValue' },
        { name: 'ValidForNewInd', value: true }
    ];
    public formBuilder: FormBuilder;
    public utils: Utils;
    public serviceConstants: ServiceConstants;
    public riExchange: RiExchange;
    public uiForm: FormGroup;
    public router: Router;
    public modalAdvService: ModalAdvService;
    public activatedRoute: ActivatedRoute;
    public activatedRouteSubscription: Subscription;
    public itemsPerPage: number = 10;
    public page: number = 1;
    public columns: Array<any>;
    public filterOption: string;
    public parentMode: string;
    public isTrProductCode: boolean = false;
    public isShowMenu: boolean = false;
    public includeProductDetail: string = '';
    public excludeProductDetail: string = '';
    public productDetailCodeString: string = '';
    public productCoverSearchValueLength: number = 9;
    public inputParams: any = {};

    constructor(injector: Injector, private renderer: Renderer) {
        super();
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSBPRODUCTCOVERSEARCH;
    }

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Business/iCABSBProductCoverSearch',
        module: 'contract-admin',
        method: 'contract-management/search'
    };

    ngOnInit(): void {
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.onWindowLoad();
    }

    ngOnDestroy(): void {
        this.formBuilder = null;
        this.utils = null;
        this.serviceConstants = null;
        this.riExchange = null;
        this.router = null;
        this.modalAdvService = null;
        this.activatedRoute = null;
        if (this.activatedRouteSubscription) {
            this.activatedRouteSubscription.unsubscribe();
        }
    }

    public injectServices(injector: Injector): void {
        this.formBuilder = injector.get(FormBuilder);
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
        this.riExchange = injector.get(RiExchange);
        this.router = injector.get(Router);
        this.modalAdvService = injector.get(ModalAdvService);
        this.activatedRoute = injector.get(ActivatedRoute);
    }

    private onWindowLoad(): void {
        this.activatedRouteSubscription = this.activatedRoute.queryParams
            .subscribe((param: any) => {
                if (param && param.fromPageNav) {
                    let params: any = {
                        parentMode: this.riExchange.getParentMode(),
                        productCode: this.riExchange.getParentHTMLValue('ProductCode'),
                        productDesc: this.riExchange.getParentHTMLValue('ProductDesc'),
                        includeProductDetail: this.riExchange.getParentHTMLValue('IncludeProductDetail'),
                        excludeProductDetail: this.riExchange.getParentHTMLValue('ExcludeProductDetail'),
                        productDetailCodeString: this.riExchange.getParentHTMLValue('ProductDetailCodeString')
                    };
                    this.utils.setTitle('Product Cover Search');
                    this.updateView(params);
                }
            });
    }

    //Called during ellipsis search
    // Available params
    // parentMode: '',
    // productCode: '',
    // productDesc: '',
    // includeProductDetail: '',
    // excludeProductDetail: '',
    // productDetailCodeString: ''
    public updateView(params?: any): void {
        this.parentMode = params.parentMode;
        this.inputParams = params;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', params.productCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', params.productDesc);
        this.includeProductDetail = params.includeProductDetail;
        this.excludeProductDetail = params.excludeProductDetail;
        this.productDetailCodeString = params.productDetailCodeString;

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')) {
            this.isTrProductCode = true;
        } else {
            this.isTrProductCode = false;
        }

        this.isShowMenu = this.parentMode === 'Product';
        this.riTable.tableheader = 'Product Cover Search';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ValidForNewInd', true);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCoverSearchType', 'Code');
        this.productCoverSearchTypeChange('Code');
        this.populateTable();
        setTimeout(() => {
            this.renderer.invokeElementMethod(this.productCoverSearchValue.nativeElement, 'focus');
        }, 0);
    }

    //Method to set filter values for table
    public populateTable(): void {
        let search: URLSearchParams = new URLSearchParams();

        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCoverSearchValue')) {
            search.set('ProductCoverSearchType', this.filterOption);
            switch (this.filterOption) {
                case 'Description':
                    search.set('search.op.ProductDetailDesc', 'GE');
                    search.set('ProductDetailDesc', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCoverSearchValue'));
                    break;
                case 'Code':
                    search.set('search.op.ProductDetailCode', 'GE');
                    search.set('ProductDetailCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCoverSearchValue'));
                    break;
            }
        }

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')) {
            search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ValidForNewInd')) {
                search.set('ValidForNewInd', this.riExchange.riInputElement.GetValue(this.uiForm, 'ValidForNewInd'));
            } else {
                search.set('ValidForNewInd', '');
            }
        } else {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ValidForNewInd')) {
                search.set('ValidForNewInd', this.riExchange.riInputElement.GetValue(this.uiForm, 'ValidForNewInd'));
            } else {
                search.set('ValidForNewInd', '');
            }
        }

        if (this.parentMode === 'LookUp' || this.parentMode === 'Search') {
            switch (this.filterOption) {
                case 'Description':
                    search.set('search.sortby', 'ProductDetailDesc');
                    break;
                case 'Code':
                    search.set('search.sortby', 'ProductDetailCode');
                    break;
            }
        }

        this.inputParams.parentMode = this.parentMode;
        this.inputParams.search = search;
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.buildTableColumns();
        this.riTable.loadTableData(this.inputParams);
    }

    //Method to build table columns
    public buildTableColumns(): void {
        this.columns = [];

        this.columns.push({ title: 'Code', name: 'ProductDetailCode', type: MntConst.eTypeCode, size: 8 });
        this.columns.push({ title: 'Description', name: 'ProductDetailDesc', type: MntConst.eTypeText, size: 40 });
        this.columns.push({ title: 'New Business', name: 'ValidForNewInd', type: MntConst.eTypeCheckBox, size: 1 });
    }

    //Method called on selecting a data from table
    public selectedData(event: any): void {
        let returnObj: any = {};

        if (this.parentMode === 'Product') {
            // TODO will navigate to Business/iCABSBProductCoverMaintenance.htm screen
            /*
            this.router.navigate(['Business/iCABSBProductCoverMaintenance.htm'],
                {
                    queryParams: {
                        parentMode: 'Search',
                        productDetailCode: event.row.ProductDetailCode,
                        productDetailDesc: event.row.ProductDetailDesc,
                        ValidForNewInd: event.row.ValidForNewInd
                    }
                });
            */
            this.modalAdvService.emitMessage(new ICabsModalVO('Business/iCABSBProductCoverMaintenance.htm - This screen is not yet developed!'));
        } else {
            switch (this.parentMode) {
                case 'ContractJobReport:Include':
                    if (this.includeProductDetail) {
                        this.includeProductDetail = this.includeProductDetail + ',' + event.row.ProductDetailCode;
                    } else {
                        this.includeProductDetail = event.row.ProductDetailCode;
                    }
                    returnObj = {
                        'IncludeProductDetail': this.includeProductDetail
                    };
                    break;
                case 'ContractJobReport:Exclude':
                    if (this.excludeProductDetail) {
                        this.excludeProductDetail = this.excludeProductDetail + ',' + event.row.ProductDetailCode;
                    } else {
                        this.excludeProductDetail = event.row.ProductDetailCode;
                    }
                    returnObj = {
                        'ExcludeProductDetail': this.excludeProductDetail
                    };
                    break;
                case 'LookUp':
                case 'LookUp-Infest':
                    returnObj = {
                        'ProductDetailCode': event.row.ProductDetailCode,
                        'ProductDetailDesc': event.row.ProductDetailDesc
                    };
                    break;
                case 'LookUp-String':
                    if (this.productDetailCodeString) {
                        this.productDetailCodeString = this.productDetailCodeString + ',' + event.row.ProductDetailCode;
                    } else {
                        this.productDetailCodeString = event.row.ProductDetailCode;
                    }
                    returnObj = {
                        'ProductDetailCodeString': this.productDetailCodeString
                    };
                    break;
                case 'LookUp1':
                case 'LookUp2':
                case 'LookUp3':
                case 'LookUp4':
                case 'LookUp5':
                case 'LookUp6':
                case 'LookUp7':
                case 'LookUp8':
                case 'LookUp9':
                case 'LookUp10':
                    returnObj = {
                        'ProductDetailCode': event.row.ProductDetailCode,
                        'ProductDetailDesc': event.row.ProductDetailDesc
                    };
                    break;
                default:
                    returnObj = {
                        'ProductDetailCode': event.row.ProductDetailCode
                    };
            }
            this.emitSelectedData(returnObj);
        }
    }

    public productCoverSearchTypeChange(event: string): void {
        this.filterOption = event;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCoverSearchValue', '');

        switch (event) {
            case 'Description':
                this.productCoverSearchValueLength = 30;
                break;
            case 'Code':
                this.productCoverSearchValueLength = 9;
                break;
        }

        setTimeout(() => {
            this.renderer.invokeElementMethod(this.productCoverSearchValue.nativeElement, 'focus');
        }, 0);
    }

    public menuChange(event: string): void {
        if (event === 'AddProductCover') {
            // TODO will navigate to Business/iCABSBProductCoverMaintenance.htm screen
            /*
            this.router.navigate(['Business/iCABSBProductCoverMaintenance.htm'],
                {
                    queryParams: {
                        parentMode: 'SearchAdd'
                    }
                });
            */
            this.modalAdvService.emitMessage(new ICabsModalVO('Business/iCABSBProductCoverMaintenance.htm - This screen is not yet developed!'));
        }
    }

    public onAddNew(): void {
        this.emitSelectedData('AddModeOn');
    }
}
