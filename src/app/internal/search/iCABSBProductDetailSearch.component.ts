import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Utils } from './../../../shared/services/utility';
import { RiExchange } from './../../../shared/services/riExchange';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { PageIdentifier } from './../../base/PageIdentifier';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';

@Component({
    templateUrl: 'iCABSBProductDetailSearch.html'
})

export class ProductDetailSearchComponent extends SelectedDataEvent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;
    private formBuilder: FormBuilder;
    private utils: Utils;
    private riExchange: RiExchange;
    private serviceConstants: ServiceConstants;
    private parentMode: string;
    private queryParams: any = {
        operation: 'Business/iCABSBProductDetailSearch',
        module: 'contract-admin',
        method: 'contract-management/search'
    };
    public pageTitle: string;
    public pageId: string = '';
    public isTrProductCode: boolean = true;
    public isShowAddNew: boolean = false;
    public isCode: string = 'Code';
    public itemsPerPage: number = 10;
    public uiForm: FormGroup;
    public controls: any[] = [
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'ProductDetailSearchType' },
        { name: 'ProductDetailSearchValue' },
        { name: 'PassToPDAInd' },
        { name: 'InfestationGroupCode' }
    ];

    constructor(injector: Injector) {
        super();
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSBPRODUCTDETAILSEARCH;
    }

    ngOnInit(): void {
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.pageTitle = 'Product Detail Code/Description Search';
        this.parentMode = this.riExchange.getParentMode();
    }

    ngAfterViewInit(): void {
         this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailSearchType', 'Code');
         this.riExchange.riInputElement.SetValue(this.uiForm, 'PassToPDAInd', true);
    }

    ngOnDestroy(): void {
        this.serviceConstants = null;
        this.utils = null;
        this.formBuilder = null;
        this.riExchange = null;
    }

    public injectServices(injector: Injector): void {
        this.formBuilder = injector.get(FormBuilder);
        this.utils = injector.get(Utils);
        this.serviceConstants = injector.get(ServiceConstants);
        this.riExchange = injector.get(RiExchange);
    }

    public buildTableColumns(): void {
        this.riTable.clearTable();
        this.riTable.AddTableField('ProductDetailCode', MntConst.eTypeCode, 'Key', 'Code', 8);
        this.riTable.AddTableField('ProductDetailDesc', MntConst.eTypeText, 'Required', 'Description', 40);
        this.riTable.AddTableField('PassToPDAInd', MntConst.eTypeCheckBox, 'Virtual', 'Infestation', 1);
        this.riTable.AddTableField('InfestationGroupCode', MntConst.eTypeInteger, 'Virtual', 'Infestation Group', 2);
        this.riTable.AddTableField('SortOrder', MntConst.eTypeInteger, 'Optional', 'Sort Order', 1);
        this.buildTable();
    }

    public buildTable(): void {
        let passToPDAInd;
        let productDetailSearchValue;
        let caseCodeOrDesc;
        let search: URLSearchParams = new URLSearchParams();
        productDetailSearchValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailSearchValue');
        passToPDAInd = this.riExchange.riInputElement.GetValue(this.uiForm, 'PassToPDAInd');
        search.set(this.serviceConstants.Action, '0');
        search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') || '');
        if (passToPDAInd)
            search.set('PassToPDAInd', passToPDAInd);
        if (this.parentMode === 'InfestationTolerance')
            search.set('InfestationGroupCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'InfestationGroupCode'));
        if (productDetailSearchValue) {
            caseCodeOrDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailSearchType') === 'Code' ? 'ProductDetailCode' : 'ProductDetailDesc';
            search.set('search.op.' + caseCodeOrDesc, 'GE');
            search.set(caseCodeOrDesc, productDetailSearchValue);
        }
        search.set('search.sortby', 'ProductDetailCode');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.search = search;
        this.riTable.loadTableData(this.queryParams);
    }

    // On changing of dropdown
    public selectedOptions(optionsValue: string): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailSearchValue', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailSearchType', optionsValue);
        this.isCode = optionsValue;
    }

    private strProductsFunction(Mode: any, vntReturnData: any): String {
        let strProducts = this.riExchange.getParentHTMLValue(Mode).trim();
        if (!strProducts)
            strProducts = vntReturnData['ProductDetailCode'];
        else
            strProducts += ',' + vntReturnData['ProductDetailCode'];
        return strProducts;
    }

    // On clicking of table row
    public tableRowClick(event: any): void {
        let vntReturnData: Object, strProducts: string = '', returnObj: Object = {};
        vntReturnData = event.row;
        switch (this.parentMode) {
            case 'ContractJobReport:Include':
                returnObj['IncludeProductDetail'] = this.strProductsFunction('IncludeProductDetail', vntReturnData);
                break;
            case 'ContractJobReport:Exclude':
                returnObj['ExcludeProductDetail'] = this.strProductsFunction('ExcludeProductDetail', vntReturnData);
                break;
            case 'CJIncludeProductDetail':
            case 'TCIncludeProductDetail':
            case 'PPUIncludeProductDetail':
            case 'CWIIncludeProductDetail':
                returnObj[this.parentMode] = this.strProductsFunction(this.parentMode, vntReturnData);
                break;
            case 'CJExcludeProductDetail':
            case 'TCExcludeProductDetail':
            case 'PPUExcludeProductDetail':
            case 'CWIExcludeProductDetail':
                returnObj[this.parentMode] = this.strProductsFunction(this.parentMode, vntReturnData);
                break;
            case 'LookUp':
            case 'LookUp-Infest':
            case 'InfestationTolerance':
                returnObj['ProductDetailCode'] = vntReturnData['ProductDetailCode'];
                returnObj['ProductDetailDesc'] = vntReturnData['ProductDetailDesc'];
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
                returnObj['ProductDetailCode' + this.parentMode.replace('LookUp', '')] = vntReturnData['ProductDetailCode'];
                returnObj['ProductDetailDesc' + this.parentMode.replace('LookUp', '')] = vntReturnData['ProductDetailDesc'];
                break;
            default:
                returnObj = vntReturnData;
                break;
        }
        this.emitSelectedData(returnObj);
    }

    public onSearchClick(): void {
        this.buildTableColumns();
    }

    public onAddNew(): void {
        let addData = { addMode: true };
        this.emitSelectedData(addData);
    }

    public updateView(params: any): void {
        if (params.parentMode)
            this.parentMode = params.parentMode;
        this.isShowAddNew = params.isShowAddNew;
        this.buildTableColumns();
    }
}
