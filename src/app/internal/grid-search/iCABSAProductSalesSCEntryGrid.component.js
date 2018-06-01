var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, ViewChild, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
export var ProductSalesSCEntryGridComponent = (function (_super) {
    __extends(ProductSalesSCEntryGridComponent, _super);
    function ProductSalesSCEntryGridComponent(injector) {
        _super.call(this, injector);
        this.status = false;
        this.showHeader = true;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 8;
        this.search = new URLSearchParams();
        this.serviceCoverAdded = 'no';
        this.trFromContract = false;
        this.trFromPremise = false;
        this.trKey = true;
        this.pageId = '';
        this.headerClicked = '';
        this.sortType = '';
        this.inputParams = {};
        this.inputParamsContractSearch = {
            'parentMode': 'LookUp',
            'currentContractType': 'P'
        };
        this.inputParamsAccountPremise = {
            'parentMode': 'LookUp',
            'currentContractType': 'P',
            'ContractName': '',
            'ContractNumber': ''
        };
        this.telesalesInd = '';
        this.contractTypeCode = '';
        this.queryParams = {
            action: '2',
            operation: 'Application/iCABSAProductSalesSCEntryGrid',
            module: 'contract-admin',
            method: 'contract-management/grid'
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: false
        };
        this.productComponent = ProductSearchGridComponent;
        this.contractSearchComponent = ContractSearchComponent;
        this.isTeleSales = false;
        this.showCloseButton = true;
        this.showBackLabel = false;
        this.ContractCommenceDate = new Date();
        this.isCommenceDateDisabled = true;
        this.gridSortHeaders = [
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
        this.controls = [
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
        this.pageId = PageIdentifier.ICABSAPRODUCTSALESSCENTRYGRID;
        this.setURLQueryParameters(this);
    }
    ;
    ProductSalesSCEntryGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Service Cover Entry';
        this.premiseSearchComponent = PremiseSearchComponent;
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractCommenceDate');
        if (this.formData.ContractNumber) {
            this.populateUIFromFormData();
            this.getContractDetails();
        }
        else {
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
        console.log('CurrentContractTypeURLParameter', this.pageParams.CurrentContractTypeURLParameter, this.pageParams.currentContractType);
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
        this.inputParamsProductSalesSCEntry = {
            'parentMode': 'LookUp-ProductSales-' + this.pageParams.currentContractType,
            'ContractNumber': '',
            'PremiseNumber': '',
            'showAddNew': false
        };
    };
    ProductSalesSCEntryGridComponent.prototype.getURLQueryParameters = function (param) {
        this.pageParams.parentMode = param['parentMode'];
        this.pageParams.CurrentContractTypeURLParameter = param['currentContractTypeURLParameter'] ? param['currentContractTypeURLParameter'] : '<Product>';
        this.inputParamsAccountPremise.currentContractType = this.pageParams.currentContractType;
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractName');
    };
    ProductSalesSCEntryGridComponent.prototype.onSubmit = function (value) {
        console.log(value);
    };
    ProductSalesSCEntryGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    ProductSalesSCEntryGridComponent.prototype.setUpPage = function (parentMode) {
        switch (parentMode) {
            case 'GeneratedStockOrder':
                this.tableTitle = 'Generated Stock Order';
                break;
            default:
                this.tableTitle = this.pageParams.currentContractTypeLabel;
                break;
        }
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
                }
                else {
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
    };
    ProductSalesSCEntryGridComponent.prototype.onProductFilterChangeEvent = function (event) {
        this.buildGrid();
    };
    ProductSalesSCEntryGridComponent.prototype.setContractNumber = function (event) {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', event.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', event.ContractName);
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
    };
    ProductSalesSCEntryGridComponent.prototype.onContractNumberChange = function (event) {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')) {
            var padded = this.utils.numberPadding(this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 8);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', padded);
        }
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
    };
    ProductSalesSCEntryGridComponent.prototype.onProductCodeChange = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')) {
            this.getProductDesc();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        }
    };
    ProductSalesSCEntryGridComponent.prototype.onPremiseSearchDataReceived = function (data) {
        if (data) {
            this.setControlValue('PremiseNumber', data.PremiseNumber);
            this.setControlValue('PremiseName', data.PremiseName);
            this.productSalesSCEntryGrid.clearGridData();
            this.buildGrid();
        }
    };
    ProductSalesSCEntryGridComponent.prototype.onPremiseNumberChange = function () {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')) {
            this.getPremiseName();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
    };
    ProductSalesSCEntryGridComponent.prototype.formatDate = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    };
    ProductSalesSCEntryGridComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.buildGrid();
    };
    ProductSalesSCEntryGridComponent.prototype.buildGrid = function () {
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
    };
    ProductSalesSCEntryGridComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    };
    ProductSalesSCEntryGridComponent.prototype.getContractDetails = function () {
        var _this = this;
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
            this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
                .subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    if (e) {
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'TelesalesInd', e.TelesalesInd);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractTypeCode', e.ContractTypeCode);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', e.ContractName);
                        if (e.PremiseNumber !== '0') {
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', e.PremiseNumber);
                        }
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', e.PremiseName);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', e.ProductDesc);
                        _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractCommenceDate', e.ContractCommenceDate);
                        if (_this.riExchange.riInputElement.GetValue(_this.uiForm, 'TelesalesInd') === 'Y') {
                            _this.maxColumn = 9;
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductFilter', 'Ordered');
                            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                            _this.isTeleSales = true;
                        }
                    }
                    _this.buildGrid();
                }
            }, function (error) {
                _this.errorService.emitError('Record not found');
            });
        }
    };
    ProductSalesSCEntryGridComponent.prototype.getProductDesc = function () {
        var _this = this;
        this.query = new URLSearchParams();
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set(this.serviceConstants.Action, '6');
        this.query.set('Function', 'GetProductDescription');
        this.query.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            _this.setControlValue('ProductCode', _this.getControlValue('ProductCode').toUpperCase());
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', e.ProductDesc);
                    _this.productSalesSCEntryGrid.clearGridData();
                    _this.buildGrid();
                }
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    ProductSalesSCEntryGridComponent.prototype.getPremiseName = function () {
        var _this = this;
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
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.query)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', e.PremiseName);
                    _this.productSalesSCEntryGrid.clearGridData();
                    _this.buildGrid();
                }
            }
        }, function (error) {
            _this.errorService.emitError('Record not found');
        });
    };
    ProductSalesSCEntryGridComponent.prototype.getLOSCode = function () {
        var _this = this;
        var lookupIP = [{
                'table': 'LineOfService',
                'query': { 'ValidForBusiness': this.utils.getBusinessCode() },
                'fields': ['LOSCode', 'LOSName']
            }];
        this.LookUp.lookUpRecord(lookupIP, 100).subscribe(function (data) {
            if (data[0]) {
                var temp = data[0];
                for (var i = 0; i < temp.length; i++) {
                    _this.pageParams.LOSArray.push(temp[i]);
                }
            }
        });
    };
    ProductSalesSCEntryGridComponent.prototype.getGridInfo = function (info) {
        this.productSalesSCEntryPagination.totalItems = info.totalRows;
    };
    ProductSalesSCEntryGridComponent.prototype.onGridRowClick = function (obj) {
        this.logger.log(this.pageParams.currentContractType, 'onGridRowClick', obj);
        this.attributes.ServiceCoverRowID = '';
        this.attributes.ProductCode = obj.rowData['Product Code'];
        this.attributes.ProductDesc = obj.rowData['Description'];
        this.attributes.Row = obj.rowIndex;
        var data = this.productSalesSCEntryGrid.getCellInfoForSelectedRow(obj.rowIndex, 0);
        if (data['additionalData'] !== 'TOTAL') {
            this.attributes.Status = this.Left(obj.cellData['additionalData'], 1);
        }
        if (this.attributes.Status === 'S') {
            this.attributes.ServiceCoverRowID = this.Mid(obj.cellData['additionalData'], 2);
            this.attributes.Ordered = 'yes';
        }
        else {
            this.attributes.Ordered = 'no';
        }
        if (data['additionalData'] !== 'TOTAL' && obj.cellIndex === 6) {
            this.navigate(this.parentMode, 'grid/application/productSalesSCDetailsMaintenance', {
                currentContractTypeURLParameter: this.pageParams.CurrentContractTypeURLParameter
            });
        }
    };
    ProductSalesSCEntryGridComponent.prototype.getRefreshData = function () {
        this.buildGrid();
    };
    ProductSalesSCEntryGridComponent.prototype.setCurrentContractType = function () {
        this.pageParams.currentContractType =
            this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.pageParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.pageParams.currentContractType);
    };
    ProductSalesSCEntryGridComponent.prototype.Left = function (str, n) {
        var s = str + '';
        var iLen = s.length;
        if (n <= 0) {
            return '';
        }
        else if (n >= iLen) {
            return str;
        }
        else {
            return s.substr(0, n);
        }
    };
    ProductSalesSCEntryGridComponent.prototype.Mid = function (strMid, intBeg) {
        if (strMid === null || strMid === '' || intBeg < 0) {
            return '';
        }
        intBeg -= 1;
        return strMid.substr(intBeg);
    };
    ProductSalesSCEntryGridComponent.prototype.setProductCode = function (data) {
        if (data.ProductCode) {
            this.setControlValue('ProductCode', data.ProductCode);
        }
        if (data.ProductDesc) {
            this.setControlValue('ProductDesc', data.ProductDesc);
        }
    };
    ProductSalesSCEntryGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-prodcusalesscentry-grid',
                    templateUrl: 'iCABSAProductSalesSCEntryGrid.html',
                    styles: ["\n        :host /deep/ .gridtable thead tr:nth-child(2) th:first-child {\n            width: 12%;\n        }\n    "]
                },] },
    ];
    ProductSalesSCEntryGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ProductSalesSCEntryGridComponent.propDecorators = {
        'productSalesSCEntryGrid': [{ type: ViewChild, args: ['productSalesSCEntryGrid',] },],
        'productSalesSCEntryPagination': [{ type: ViewChild, args: ['productSalesSCEntryPagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return ProductSalesSCEntryGridComponent;
}(BaseComponent));
