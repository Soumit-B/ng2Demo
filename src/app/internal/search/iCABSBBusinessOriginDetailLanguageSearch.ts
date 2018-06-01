import { TableComponent } from './../../../shared/components/table/table';
import { PageIdentifier } from './../../base/PageIdentifier';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Input, ViewChild, Injector, forwardRef, Inject, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { HttpService } from './../../../shared/services/http-service';
import { Utils } from './../../../shared/services/utility';
import { BaseComponent } from '../../../app/base/BaseComponent';

@Component({
    selector: 'icabs-business-origin-detail-lang-search',
    templateUrl: 'iCABSBBusinessOriginDetailLanguageSearch.html'
})
export class BusinessOriginDetailLanguageSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('languageSearchTable') languageSearchTable: TableComponent;
    @Input() public inputParams: any;

    public search: URLSearchParams;
    public pageId: string = '';
    public pageTitle: string = '';
    public parentMode: string = '';
    public defaultLang: string = 'ENG';
    public itemsPerPage: number = 10;
    public page: number = 1;

    public grdLanguageDetail: boolean = true;

    public controls = [
        { name: 'LanguageCode', readonly: false, disabled: false, required: true },
        { name: 'LanguageDescription', readonly: false, disabled: false, required: false },
        { name: 'BusinessOriginCode', readonly: false, disabled: false, required: true },
        { name: 'BusinessOriginSystemDesc', readonly: false, disabled: false, required: false }
    ];

    public muleConfig = {
        method: 'contract-management/search',
        module: 'contract-admin',
        operation: 'Business/iCABSBBusinessOriginDetailLanguageSearch',
        contentType: 'application/x-www-form-urlencoded'
    };


    public model: Object = {};
    public columns: Array<any> = [
    ];

    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.defaultLang = this.riExchange.LanguageCode();
        this.pageId = PageIdentifier.ICABSBBUSINESSORIGINDETAILLANGUAGESEARCH;
        this.pageTitle = 'Business Origin Search';
        this.search = this.getURLSearchParamObject();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });

        this.riExchange.riInputElement.Disable(this.uiForm, 'LanguageDescription');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessOriginSystemDesc');

        this.populateUIFromFormData();
    }
    public ngOnDestroy(): void {
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        super.ngOnDestroy();
        //TODO
    }

    public fetchTranslationContent(): void {
        this.columns = [];
        this.getTranslatedValue('Type Code', null).subscribe((res: string) => {
            this.zone.run(() => {
                this.columns.push({ title: res, name: 'BusinessOriginDetailCode' });
            });

        });

        if (this.grdLanguageDetail === true) {
            this.getTranslatedValue('Description', null).subscribe((res: string) => {
                this.zone.run(() => {
                    this.columns.push({ title: res, name: 'BusinessOriginDetailSystemDesc' });
                });
            });
        }

        this.getTranslatedValue('Display Description', null).subscribe((res: string) => {
            this.zone.run(() => {
                this.columns.push({ title: res, name: 'BusinessOriginDetailDesc' });
            });
        });
    }


    public setDefaultValues(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageCode', this.inputParams.LanguageCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageDescription', this.inputParams.LanguageDescription);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginCode', this.inputParams.BusinessOriginCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessOriginSystemDesc', this.inputParams.BusinessOriginSystemDesc);

        if (!this.riExchange.riInputElement.GetValue(this.uiForm, 'LanguageCode')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageCode', this.riExchange.LanguageCode());
            this.grdLanguageDetail = false;
        }

        this.parentMode = this.inputParams['parentMode'];
    }

    public selectedData(event: any): void {
        let returnObj: any;

        returnObj = {
            BusinessOriginCode: '',
            BusinessOriginSystemDesc: '',
            BusinessOriginDetailCode: '',
            BusinessOriginDetailDesc: '',
            BusinessOriginDetailSystemDesc: '',
            row: event.row
        };

        returnObj.BusinessOriginCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode');
        returnObj.BusinessOriginSystemDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginSystemDesc');
        returnObj.BusinessOriginDetailCode = event.row.BusinessOriginDetailCode;

        switch (this.parentMode) {

            case 'LookUp':
            case 'LookUp-Active':
                returnObj.BusinessOriginDetailDesc = event.row.BusinessOriginDetailDesc;
                if (this.grdLanguageDetail) {
                    returnObj.BusinessOriginDetailSystemDesc = event.row.BusinessOriginDetailSystemDesc;
                }
                break;
            default:

        }

        this.ellipsis.sendDataToParent(returnObj);
    }

    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    public updateView(params: any): void {
        this.inputParams = params || this.inputParams;
        if (params) {
            this.setDefaultValues();
        }

        if (!params) {
            params = this.inputParams;
        }

        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        if (params.businessCode !== undefined && params.businessCode !== null) {
            this.search.set(this.serviceConstants.BusinessCode, params.businessCode);
        }
        else {
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }

        if (params.countryCode !== undefined && params.countryCode !== null) {
            this.search.set(this.serviceConstants.CountryCode, params.countryCode);
        }
        else {
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }

        this.search.set('BusinessOriginCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'));
        this.search.set('LanguageCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LanguageCode'));

        this.inputParams.search = this.search;
        this.languageSearchTable.loadTableData(this.inputParams);
    }

    public onChangeCode(): void {
        if (!this.uiForm.valid) {
            return;
        }
        this.loadTable();
    }

    public onRefresh(): void {
        this.loadTable();
    }

    public loadTable(): void {
        this.search.set('BusinessOriginCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessOriginCode'));
        this.search.set('LanguageCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'LanguageCode'));
        this.inputParams.search = this.search;
        this.languageSearchTable.loadTableData(this.inputParams);
    }

}
