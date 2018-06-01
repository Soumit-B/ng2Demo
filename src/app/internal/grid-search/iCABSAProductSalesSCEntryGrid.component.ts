import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GenericActionTypes } from './../../actions/generic';
import { LookUp } from './../../../shared/services/lookup';
import { Utils } from './../../../shared/services/utility';

import { Component, OnInit, ViewChild, trigger, state, style, animate, transition, NgZone, Injector } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PostCodeSearchComponent } from '../search/iCABSBPostcodeSearch.component';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { QueryParametersCallback, ErrorCallback } from '../../../app/base/Callback';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';

@Component({
    selector: 'icabs-prodcusalesscentry-grid',
    templateUrl: 'iCABSAProductSalesSCEntryGrid.html',
    styles: [`
        :host /deep/ .gridtable thead tr:nth-child(2) th:first-child {
            width: 12%;
        }
    `]
})
export class ProductSalesSCEntryGridComponent extends BaseComponent implements OnInit, ErrorCallback, QueryParametersCallback {
    @ViewChild('productSalesSCEntryGrid') productSalesSCEntryGrid: GridComponent;
    @ViewChild('productSalesSCEntryPagination') productSalesSCEntryPagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;

    public status = false;
    public showHeader: boolean = true;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 8;

    public query: URLSearchParams;
    public search: URLSearchParams = new URLSearchParams();
    public parentMode: string;
    public tableTitle: string;
    public serviceCoverAdded: string = 'no';
    public trFromContract: boolean = false;;
    public trFromPremise: boolean = false;
    public trKey: boolean = true;
    public pageId: string = '';
    public headerClicked: string = '';
    public sortType: string = '';
    public inputParams: any = {};
    public validateProperties: Array<any> = [];

    public inputParamsContractSearch: any = {
        'parentMode': 'LookUp',
        'currentContractType': 'P'
    };
    public inputParamsAccountPremise: any = {
        'parentMode': 'LookUp',
        'currentContractType': 'P',
        'ContractName': '',
        'ContractNumber': ''
    };
    //Contract description paarmeters
    public telesalesInd: string = '';
    public contractTypeCode: string = '';

    public queryParams: any = {
        action: '2',
        operation: 'Application/iCABSAProductSalesSCEntryGrid',
        module: 'contract-admin',
        method: 'contract-management/grid'
    };

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: false
    };

    public productComponent = ProductSearchGridComponent;
    public contractSearchComponent = ContractSearchComponent;
    public premiseSearchComponent: any;
    public isTeleSales = false;
    public showCloseButton: boolean = true;
    public showBackLabel: boolean = false;

    public tdGeneratedStockOrderText: boolean;
    public tdStockText: boolean;
    public labelFutureDated: boolean;
    public ContractCommenceDate: Data = new Date();
    public isCommenceDateDisabled: boolean = true;
    public dtCommenceDisplay: string;
    public inputParamsProductSalesSCEntry: any;
    public gridSortHeaders: Array<any> = [
        {
            'fieldName': 'ProductCode',
            'colName': 'Product Code',
            'sortType': 'ASC'
        },
        {
            'fieldName': 'ProductDesc',
            'colName': 'Description',
            'sortType': 'ASC'
        }
    ];

    public controls = [
        { name: 'ContractTypeCode', readonly: false, disabled: false, required: false },
        { name: 'TelesalesInd', readonly: false, disabled: false, required: false },
        { name: 'ContractNumber', readonly: false, disabled: false, required: true },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'ContractCommenceDate', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: true },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ProductFilter', readonly: true, disabled: false, required: false, value: 'All' },
        { name: 'FromContractNumber', readonly: false, disabled: false, required: false },
        { name: 'FromContractName', readonly: false, disabled: false, required: false },
        { name: 'FromPremiseNumber', readonly: false, disabled: false, required: false },
        { name: 'FromPremiseName', readonly: false, disabled: false, required: false },
        { name: 'ProductCode', readonly: false, disabled: false, required: false },
        { name: 'ProductDesc', readonly: false, disabled: false, required: false },
        { name: 'LOSCode', readonly: false, disabled: false, required: false, value: 'All' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPRODUCTSALESSCENTRYGRID;
        this.setURLQueryParameters(this);
        this.browserTitle = 'Service Cover Entry';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Cover Entry';
        this.premiseSearchComponent = PremiseSearchComponent;
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractCommenceDate');
        if (this.formData.ContractNumber) {
            this.populateUIFromFormData();
            this.getContractDetails();
            this.utils.setTitle(this.pageParams.browserTitle);
        } else {
            this.attributes.ServiceCoverAdded = 'no';
            this.pageParams.LOSArray = [{
                'LOSCode': 'All',
                'LOSName': 'All',
                'ttLineOfService': ''
            }];
            this.setCurrentContractType();
            this.getLOSCode();
            this.setUpPage(this.parentMode);
            this.getContractDetails();
        }

        //this.utils.setTitle(this.pageParams.browserTitle, '', '');
        // console.log('CurrentContractTypeURLParameter', this.pageParams.CurrentContractTypeURLParameter, this.pageParams.currentContractType);
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
        this.inputParamsProductSalesSCEntry = {
            'parentMode': 'LookUp-ProductSales-' + this.pageParams.currentContractType,
            'ContractNumber': '',
            'PremiseNumber': '',
            'showAddNew': false
        };
    }

    getURLQueryParameters(param: any): void {
        this.pageParams.parentMode = param['parentMode'];
        this.pageParams.CurrentContractTypeURLParameter = param['currentContractTypeURLParameter'] ? param['currentContractTypeURLParameter'] : '<Product>';
        this.inputParamsAccountPremise.currentContractType = this.pageParams.currentContractType;
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractName');
    }

    onSubmit(value: any): void {
        // console.log(value);
    }

    /**
     * Implement callback methods
     */
    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public setUpPage(parentMode: string): void {
        // Set Page Title
        let btitle_1, btitle_2;
        switch (parentMode) {
            case 'GeneratedStockOrder':
                this.tableTitle = 'Generated Stock Order';
                break;
            default:
                this.tableTitle = this.pageParams.currentContractTypeLabel;
                break;
        }

        this.utils.getTranslatedval(this.tableTitle).then((res: string) => {
            let title = res;
            this.utils.getTranslatedval('Service Cover Entry').then((res: string) => {
                this.pageParams.browserTitle = title + ' ' + res;
                this.utils.setTitle(this.pageParams.browserTitle);
            });
        });

        switch (parentMode) {
            case 'Premise':
            case 'Premise-Add':
            case 'GeneratedStockOrder':
            case 'CallCentreSearch':
                if (parentMode === 'GeneratedStockOrder') {
                    this.formData.ContractNumber = this.riExchange.getParentHTMLValue('ContractNumber');
                    this.formData.ContractName = this.riExchange.getParentHTMLValue('ContractName');
                    this.formData.PremiseNumber = this.riExchange.getParentHTMLValue('PremiseNumber');
                    this.formData.PremiseName = this.riExchange.getParentHTMLValue('PremiseName');
                    this.formData.FromContractNumber = this.riExchange.getParentHTMLValue('FromContractNumber');
                    this.formData.FromContractName = this.riExchange.getParentHTMLValue('FromContractName');
                    this.formData.FromPremiseNumber = this.riExchange.getParentHTMLValue('FromPremiseNumber');
                    this.formData.FromPremiseName = this.riExchange.getParentHTMLValue('FromPremiseName');
                    this.trFromContract = true;
                    this.trFromPremise = true;
                } else {
                    this.formData.ContractNumber = this.riExchange.getParentHTMLValue('ContractNumber');
                    this.formData.ContractName = this.riExchange.getParentHTMLValue('ContractName');
                    this.formData.PremiseNumber = this.riExchange.getParentHTMLValue('PremiseNumber');
                    this.formData.PremiseName = this.riExchange.getParentHTMLValue('PremiseName');
                }
                break;
            default:
            case 'Contract':
            case 'Inter-CompanyPortfolio':
                this.formData.ContractNumber = this.riExchange.getParentHTMLValue('ContractNumber');
                this.formData.ContractName = this.riExchange.getParentHTMLValue('ContractName');

        }
        this.populateUIFromFormData();
    }


    public onProductFilterChangeEvent(event: any): void {
        this.buildGrid();
    }

    public setContractNumber(event: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', event.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', event.ContractName);
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
    }

    public onContractNumberChange(event: any): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')) {
            let padded = this.utils.numberPadding(this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 8);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', padded);
        }
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
    }

    public onProductCodeChange(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')) {
            this.getProductDesc();
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        }
    }

    public onPremiseSearchDataReceived(data: any): void {
        if (data) {
            this.setControlValue('PremiseNumber', data.PremiseNumber);
            this.setControlValue('PremiseName', data.PremiseName);
            this.productSalesSCEntryGrid.clearGridData();
            this.buildGrid();
        }
    }

    public onPremiseNumberChange(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) {
            this.getPremiseName();
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
    }

    public formatDate(date: Date): any {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    public getCurrentPage(event: any): void {
        this.currentPage = event.value;
        this.buildGrid();
    }

    public buildGrid(): void {
        this.createValidateProperties();
        if (this.riExchange.riInputElement.isError(this.uiForm, 'PremiseNumber') ||
            this.riExchange.riInputElement.isError(this.uiForm, 'ContractNumber')) {
            return;
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) {
            this.inputParams.module = this.queryParams.module;
            this.inputParams.method = this.queryParams.method;
            this.inputParams.operation = this.queryParams.operation;
            this.search.set(this.serviceConstants.Action, this.queryParams.action);
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.search.set('Mode', this.parentMode ? this.parentMode : '');
            this.search.set('StockText', 'Stock');
            this.search.set('ProductFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductFilter'));
            this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
            this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
            this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
            this.search.set('LOSCode', (this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSCode') &&
                this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSCode') !== 'All' ?
                this.riExchange.riInputElement.GetValue(this.uiForm, 'LOSCode') : ''));
            this.search.set('riGridMode', '0');
            this.search.set('riGridHandle', '13305230');
            this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
            this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
            this.search.set('PageSize', this.itemsPerPage.toString());
            this.search.set('PageCurrent', this.currentPage.toString());
            this.inputParams.search = this.search;
            this.productSalesSCEntryGrid.loadGridData(this.inputParams);
        }
    }

    public sortGrid(data: any): void {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }

    private getContractDetails(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')) {
            this.query = new URLSearchParams();
            this.inputParams.module = this.queryParams.module;
            this.inputParams.method = this.queryParams.method;
            this.inputParams.operation = this.queryParams.operation;

            this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

            this.query.set(this.serviceConstants.Action, '6');
            this.query.set('Function', 'GetContractDetails');
            this.query.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
            this.query.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
            this.query.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));

            this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
                this.inputParams.operation, this.query)
                .subscribe(
                (e) => {
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                    } else {
                        if (e) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'TelesalesInd', e.TelesalesInd);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', e.ContractTypeCode);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', e.ContractName);
                            if (e.PremiseNumber !== '0') {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', e.PremiseNumber);
                            }
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', e.PremiseName);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', e.ProductDesc);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractCommenceDate', e.ContractCommenceDate);
                            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'TelesalesInd') === 'Y') {
                                this.maxColumn = 9;
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductFilter', 'Ordered');
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                                this.isTeleSales = true;
                            }
                        }
                        this.buildGrid();
                    }
                },
                (error) => {
                    this.errorService.emitError('Record not found');
                }
                );
        }
    }

    private createValidateProperties(): void {
        this.validateProperties = [
            {
                'type': MntConst.eTypeCode,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 1,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeInteger,
                'index': 2,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeCurrency,
                'index': 3,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 4,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 5,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeImage,
                'index': 6,
                'align': 'center'
            }];
        let col = 7;
        if (this.isTeleSales) {
            this.validateProperties.push({
                'type': MntConst.eTypeInteger,
                'index': col,
                'align': 'center'
            });
            col++;
        }
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': col,
            'align': 'center'
        });
    }

    private getProductDesc(): void {
        this.query = new URLSearchParams();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set(this.serviceConstants.Action, '6');
        this.query.set('Function', 'GetProductDescription');
        this.query.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));

        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.query)
            .subscribe(
            (e) => {
                this.setControlValue('ProductCode', this.getControlValue('ProductCode').toUpperCase());
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', e.ProductDesc);
                        this.productSalesSCEntryGrid.clearGridData();
                        this.buildGrid();
                    }
                }
            },
            (error) => {
                this.errorService.emitError('Record not found');
            }
            );
    }

    private getPremiseName(): void {
        this.query = new URLSearchParams();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set(this.serviceConstants.Action, '6');
        this.query.set('Function', 'GetPremiseName');
        this.query.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.query.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));

        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.query)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', e.PremiseName);
                        this.productSalesSCEntryGrid.clearGridData();
                        this.buildGrid();
                    }
                }
            },
            (error) => {
                this.errorService.emitError('Record not found');
            }
            );
    }

    private getLOSCode(): void {
        let lookupIP = [{
            'table': 'LineOfService',
            'query': { 'ValidForBusiness': this.utils.getBusinessCode() },
            'fields': ['LOSCode', 'LOSName']
        }];
        this.LookUp.lookUpRecord(lookupIP, 100).subscribe((data) => {
            if (data[0]) {
                let temp = data[0];
                for (let i = 0; i < temp.length; i++) {
                    this.pageParams.LOSArray.push(temp[i]);
                }
            }
        });
    }

    public getGridInfo(info: any): void {
        this.productSalesSCEntryPagination.totalItems = info.totalRows;
    }

    public onGridRowClick(obj: any): void {
        // console.log(this.pageParams.currentContractType, 'onGridRowClick', obj);
        this.attributes.ServiceCoverRowID = '';
        this.attributes.ProductCode = obj.trRowData[0].text; // obj.rowData['Product Code'];
        this.attributes.ProductDesc = obj.trRowData[1].text; //obj.rowData['Description'];
        this.attributes.Row = obj.rowIndex;
        let data = this.productSalesSCEntryGrid.getCellInfoForSelectedRow(obj.rowIndex, 0);
        if (data['additionalData'] !== 'TOTAL') {
            this.attributes.Status = this.Left(obj.cellData['additionalData'], 1);
        }
        if (this.attributes.Status === 'S') {
            this.attributes.ServiceCoverRowID = this.Mid(obj.cellData['additionalData'], 2);
            this.attributes.Ordered = 'yes';
        } else {
            this.attributes.Ordered = 'no';
        }

        if (data['additionalData'] !== 'TOTAL' && obj.cellIndex === 6) {
            this.navigate(this.parentMode, InternalGridSearchSalesModuleRoutes.ICABSAPRODUCTSALESSCDETAILMAINTENANCE, {
                currentContractTypeURLParameter: this.pageParams.CurrentContractTypeURLParameter
            });
        }
    }

    public getRefreshData(): void {
        this.buildGrid();
    }

    public setCurrentContractType(): void {
        this.pageParams.currentContractType =
            this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.pageParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.pageParams.currentContractType);
    }

    private Left(str: string, n: number): string {
        let s = str + '';
        let iLen = s.length;
        if (n <= 0) {
            return '';
        } else if (n >= iLen) {
            return str;
        } else {
            return s.substr(0, n);
        }
    }

    private Mid(strMid: string, intBeg: number): string {
        if (strMid === null || strMid === '' || intBeg < 0) {
            return '';
        }
        intBeg -= 1;
        return strMid.substr(intBeg);
    }

    public setProductCode(data: any): void {
        if (data.ProductCode) {
            this.setControlValue('ProductCode', data.ProductCode);
        }
        if (data.ProductDesc) {
            this.setControlValue('ProductDesc', data.ProductDesc);
        }
    }
}
