var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ProductSearchGridComponent = (function (_super) {
    __extends(ProductSearchGridComponent, _super);
    function ProductSearchGridComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.hasSysCharData = false;
        this.controls = [
            { name: 'ProductSearchType' },
            { name: 'ProductSearchValue' },
            { name: 'ProductOtherRange1' },
            { name: 'ProductOtherRange2' },
            { name: 'ProductOtherRange3' },
            { name: 'ReplacementSearchType' },
            { name: 'RotationalProductSearchType' },
            { name: 'ComponentTypeCodeSearchType' },
            { name: 'LOSCode' },
            { name: 'LOSCodeSel' },
            { name: 'ProductRange' }
        ];
        this.inputParams = {};
        this.itemsPerPage = 10;
        this.page = 1;
        this.queryParams = {
            operation: 'Business/iCABSBProductSearch',
            module: 'product',
            method: 'service-delivery/search'
        };
        this.tableheading = 'Product Search';
        this.columns = [];
        this.rowmetadata = new Array();
        this.isLineOfService = true;
        this.isServiceSalesEmployee = true;
        this.lineOfService = [];
        this.componentType = [];
        this.hideServiceCoverDispLevelBlock = false;
        this.pageId = PageIdentifier.ICABSBPRODUCTSEARCH;
    }
    ProductSearchGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.windowOnLoad();
    };
    ProductSearchGridComponent.prototype.windowOnLoad = function () {
        this.getSysCharDtetails();
        this.callLookupDataForLOS();
        this.callLookupDataForComponent();
    };
    ProductSearchGridComponent.prototype.callLookupDataForLOS = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'LineOfService',
                'query': {
                    'ValidForBusiness': this.businessCode()
                },
                'fields': ['LOSCode', 'LOSName']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0]) {
                _this.lineOfService.push({ 'LOSCode': data[0][0].LOSCode, 'LOSName': data[0][0].LOSName });
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ProductSearchGridComponent.prototype.callLookupDataForComponent = function () {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP = [
            {
                'table': 'ComponentType',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ComponentTypeCode']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            if (data[0][0] && data[0][0].ComponentTypeCode) {
                _this.componentType.push({ 'ComponentTypeCode': data[0][0].ComponentTypeCode });
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ProductSearchGridComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableWasteTransfer,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableServiceCoverDetail,
            this.sysCharConstants.SystemCharEnableProductLinking,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel
        ];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            if (record && record.length > 0) {
                _this.hasSysCharData = true;
                _this.pageParams.vWasteTransferReq = record[0].Required;
                _this.pageParams.vInstallationReq = record[1].Required;
                _this.pageParams.vSCDetailReq = record[2].Required;
                _this.pageParams.vProdLinkEnabled = record[3].Required;
                _this.pageParams.vServiceCoverDispLevelEnabled = record[4].Required;
            }
            _this.updateView(_this.inputParams);
        });
    };
    ProductSearchGridComponent.prototype.setFormValues = function () {
        var selComponentTypeCode, componentTypeCode;
        this.setControlValue('ProductSearchType', 'Code');
        this.setControlValue('ReplacementSearchType', 'All');
        this.setControlValue('RotationalProductSearchType', 'All');
        this.setControlValue('ComponentTypeCodeSearchType', 'All');
        switch (this.parentMode) {
            case 'DisplayEntry':
            case 'ComponentReplacement':
            case 'AlternateDisplayEntry':
            case 'AlternateComponentReplacement':
                this.isLineOfService = false;
                break;
            case 'LookUp-MktSegProd':
                this.setControlValue('LOSCodeSel', this.inputParams['LOSCode']);
                this.isLineOfService = false;
                break;
            case 'LookUp-ReqTypeProd':
                this.setControlValue('LOSCodeSel', this.inputParams['LOSCodeReq']);
                this.isLineOfService = false;
                break;
        }
        if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled) {
            if (this.parentMode === 'DisplayEntry' || this.parentMode === 'ComponentReplacement' || this.parentMode === 'AlternateDisplayEntry' || this.parentMode === 'AlternateComponentReplacement') {
                selComponentTypeCode = this.inputParams['SelComponentTypeCode'];
                if (selComponentTypeCode && selComponentTypeCode.trim() !== '') {
                    this.setControlValue('ComponentTypeCodeSearchType', selComponentTypeCode);
                }
                else {
                    this.setControlValue('ComponentTypeCodeSearchType', 'All');
                }
            }
            if (this.parentMode === 'ComponentReplacement' || this.parentMode === 'AlternateComponentReplacement') {
                selComponentTypeCode = this.inputParams['SelComponentTypeCode'];
                if (selComponentTypeCode && selComponentTypeCode.trim() === '') {
                    this.setControlValue('ComponentTypeCodeSearchType', 'All');
                }
                else {
                    this.disableControl('ComponentTypeCodeSearchType', true);
                }
            }
            if (this.parentMode === 'LookUp-ProductComponentCode' || this.parentMode === 'LookUp-UpdateComponentCode') {
                this.setControlValue('ComponentTypeCodeSearchType', 'All');
            }
            if (this.parentMode === 'ProductAttributesSearch') {
                componentTypeCode = this.inputParams['ComponentTypeCode'];
                if (componentTypeCode && componentTypeCode.trim() !== '') {
                    this.setControlValue('ComponentTypeCodeSearchType', componentTypeCode);
                }
                else {
                    this.setControlValue('ComponentTypeCodeSearchType', 'Blank');
                }
            }
            if (this.parentMode === 'LookUpParent') {
                this.setControlValue('ComponentTypeCodeSearchType', 'Blank');
            }
            if (this.parentMode === 'AlternateDisplayEntry' || this.parentMode === 'AlternateComponentReplacement') {
                this.setControlValue('ProductSearchType', 'AlternateProduct');
            }
            if (this.parentMode === 'RangeDetail') {
                this.setControlValue('RotationalProductSearchType', 'Yes');
            }
        }
    };
    ProductSearchGridComponent.prototype.cmdSearch_onclick = function () {
        this.loadTableData();
    };
    ProductSearchGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    ProductSearchGridComponent.prototype.getTableInfo = function (info) {
    };
    ProductSearchGridComponent.prototype.buildTableColumns = function () {
        this.columns = [];
        this.rowmetadata = [];
        this.columns.push({ title: 'Code', name: 'ProductCode' });
        if (this.pageParams.vServiceCoverDispLevelEnabled) {
            this.columns.push({ title: 'Alternate Code', name: 'PrimaryAlternateCode' });
        }
        this.columns.push({ title: 'Description', name: 'ProductDesc' });
        if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled) {
            this.columns.push({ title: 'Comp', name: 'ComponentTypeCode' });
        }
        if (this.utils.Left(this.parentMode, 12) !== 'ServiceCover' && this.parentMode !== 'TurnoverGrid' && this.parentMode !== 'ProductCodesSearch' && this.parentMode !== 'InfestationLookUp') {
            this.columns.push({ title: 'Quantity', name: 'QuantityRequired' });
            this.rowmetadata.push({ title: 'Quantity', name: 'QuantityRequired', type: 'img' });
            if (this.pageParams.vInstallationReq) {
                this.columns.push({ title: 'Installation', name: 'InstallationRequired' });
                this.rowmetadata.push({ title: 'Installation', name: 'InstallationRequired', type: 'img' });
            }
            if (this.pageParams.vWasteTransferReq) {
                this.columns.push({ title: 'Waste Transfer', name: 'WasteTransferRequired' });
                this.rowmetadata.push({ title: 'Waste Transfer', name: 'WasteTransferRequired', type: 'img' });
            }
            this.columns.push({ title: 'Dispenser', name: 'DispenserInd' });
            this.rowmetadata.push({ title: 'Dispenser', name: 'DispenserInd', type: 'img' });
            this.columns.push({ title: 'Consumable', name: 'ConsumableInd' });
            this.rowmetadata.push({ title: 'Consumable', name: 'ConsumableInd', type: 'img' });
            this.columns.push({ title: 'Frequency', name: 'FrequencyRequiredInd' });
            this.rowmetadata.push({ title: 'Frequency', name: 'FrequencyRequiredInd', type: 'img' });
            this.columns.push({ title: 'Value', name: 'ValueRequiredInd' });
            this.rowmetadata.push({ title: 'Value', name: 'ValueRequiredInd', type: 'img' });
            this.columns.push({ title: 'Detail', name: 'DetailRequired' });
            this.rowmetadata.push({ title: 'Detail', name: 'DetailRequired', type: 'img' });
        }
        if (this.isLineOfService) {
            this.columns.push({ title: 'Line of Service', name: 'LOSName' });
        }
    };
    ProductSearchGridComponent.prototype.loadTableData = function () {
        var ReplacementIndvalue, RotationalProductIndvalue, ComponentTypecode, productSearchValue, search, orderBy = '';
        search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '0');
        if (this.isLineOfService && this.getControlValue('LOSCode')) {
            search.set('LOSCode', this.getControlValue('LOSCode'));
        }
        else if (this.parentMode === 'LookUp-MktSegProd' || this.parentMode === 'LookUp-ReqTypeProd') {
            search.set('LOSCode', this.getControlValue('LOSCodeSel'));
        }
        productSearchValue = this.getControlValue('ProductSearchValue');
        if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled) {
            ReplacementIndvalue = this.getControlValue('ReplacementSearchType');
            RotationalProductIndvalue = this.getControlValue('RotationalProductSearchType');
            ComponentTypecode = this.getControlValue('ComponentTypeCodeSearchType');
            if (productSearchValue) {
                switch (this.getControlValue('ProductSearchType')) {
                    case 'Description':
                        search.set('search.op.ProductDesc', 'GE');
                        search.set('ProductDesc', productSearchValue);
                        break;
                    case 'Code':
                        search.set('search.op.ProductCode', 'GE');
                        search.set('ProductCode', productSearchValue);
                        break;
                }
            }
            search.set('ProductRange', this.getControlValue('ProductRange'));
            if (ReplacementIndvalue !== 'All') {
                search.set('ReplacementInd', ReplacementIndvalue);
            }
            if (RotationalProductIndvalue !== 'All') {
                search.set('RotationalProductInd', RotationalProductIndvalue);
            }
            if (ComponentTypecode === 'Blank') {
                search.set('ComponentTypeCode', '');
            }
            else if (ComponentTypecode !== 'All' && ComponentTypecode !== 'Blank') {
                search.set('ComponentTypeCode', ComponentTypecode);
            }
        }
        else {
            if (productSearchValue !== '') {
                switch (this.getControlValue('ProductSearchType')) {
                    case 'Description':
                        search.set('search.op.ProductDesc', 'GE');
                        search.set('ProductDesc', productSearchValue);
                        break;
                    case 'Code':
                        search.set('search.op.ProductCode', 'GE');
                        search.set('ProductCode', productSearchValue);
                        break;
                }
            }
        }
        switch (this.parentMode) {
            case 'LookUp-Linked':
                search.set('ProductLinkingEnabled', 'True');
                break;
            case 'ServiceCover-C':
            case 'ServiceCover-J':
            case 'LookUp-ProductSales-P':
            case 'InfestationLookUp':
                search.set('ValidForNewInd', 'yes');
                break;
            case 'LookUp-Entitlement':
                search.set('ValidForEntitlementInd', 'True');
                break;
            case 'LookUp-NonEntitlement':
                search.set('search.op.ValidForEntitlementInd', 'NE');
                search.set('ValidForEntitlementInd', 'True');
                break;
            case 'LookUp-SalesGroup':
                var ProductSaleGroupCode = this.inputParams['ProductSaleGroupCode'];
                if (ProductSaleGroupCode) {
                    ProductSaleGroupCode = ProductSaleGroupCode.trim();
                }
                search.set('ProductSaleGroupCode', ProductSaleGroupCode);
                if (this.pageParams.vSCDetailReq) {
                    search.set('DetailRequired', 'False');
                }
                break;
            case 'DisplayEntry':
            case 'ComponentReplacement':
            case 'AlternateDisplayEntry':
            case 'AlternateComponentReplacement':
            case 'Schedule':
                if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled) {
                }
                break;
        }
        if (this.utils.Left(this.parentMode, 12) !== 'ServiceCover' || this.utils.Left(this.parentMode, 20) !== 'LookUp-ProductSales-') {
            search.set('ProductExpense', 'True');
            search.set('ContractTypeCode', this.utils.Right(this.parentMode, 1));
        }
        if (this.getControlValue('ProductSearchValue') !== '' && this.getControlValue('ProductSearchType') !== 'AlternateProduct') {
            search.set('ProductAlternateCodes', 'True');
        }
        if (this.parentMode === 'ServiceCover-C' || this.parentMode === 'ServiceCover-J' || this.parentMode === 'LookUp' || this.parentMode === 'LookUp-ProductComponent' || this.parentMode === 'Search' || this.parentMode === 'CompSearch' || this.parentMode === 'UsesCompProd' || this.parentMode === 'ReplaceProdCode' || this.parentMode === 'ProductAttributesSearch' || this.parentMode === 'Schedule' || this.parentMode === 'LookUp-ProductComponentCode' || this.parentMode === 'LookUpParent' || this.parentMode === 'ProductCodesSearch' || this.parentMode === 'InfestationLookUp') {
        }
        else {
            orderBy = 'ConsumableInd,';
        }
        switch (this.getControlValue('ProductSearchType')) {
            case 'Description':
                orderBy += 'ProductDesc';
                break;
            case 'Code':
                orderBy += 'ProductCode';
                break;
            case 'AlternateProduct':
                orderBy += 'PrimaryAlternateCode';
                break;
        }
        search.set('search.sortby', orderBy);
        this.queryParams.search = search;
        this.riTable.loadTableData(this.queryParams);
    };
    ProductSearchGridComponent.prototype.refresh = function () {
        this.loadTableData();
    };
    ProductSearchGridComponent.prototype.productSearchType_onchange = function (data) {
        this.updateHTML(data);
    };
    ProductSearchGridComponent.prototype.productSearchValue_onchange = function (data) {
        if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled) {
            if (this.parentMode === 'ComponentReplacement' || this.parentMode === 'AlternateComponentReplacement') {
                this.setControlValue('ComponentTypeCodeSearchType', 'All');
                this.disableControl('ComponentTypeCodeSearchType', true);
            }
        }
    };
    ProductSearchGridComponent.prototype.productRange_onkeydown = function (event) {
        event.preventDefault();
        if (event.keyCode === 34) {
        }
    };
    ProductSearchGridComponent.prototype.productOtherRange1_onkeydown = function (event) {
        event.preventDefault();
        if (event.keyCode === 34) {
        }
    };
    ProductSearchGridComponent.prototype.productOtherRange2_onkeydown = function (event) {
        event.preventDefault();
        if (event.keyCode === 34) {
        }
    };
    ProductSearchGridComponent.prototype.productOtherRange3_onkeydown = function (event) {
        event.preventDefault();
        if (event.keyCode === 34) {
        }
    };
    ProductSearchGridComponent.prototype.updateHTML = function (productSearchType) {
        this.setControlValue('ProductSearchValue', '');
        switch (productSearchType) {
            case 'Description':
                this.ProductSearchValue.nativeElement.size = 30;
                this.ProductSearchValue.nativeElement.maxLength = 30;
                break;
            case 'AlternateProduct':
                this.ProductSearchValue.nativeElement.size = 30;
                this.ProductSearchValue.nativeElement.maxLength = 20;
                break;
            case 'Code':
                this.ProductSearchValue.nativeElement.size = 10;
                this.ProductSearchValue.nativeElement.maxLength = 6;
                break;
        }
        this.ProductSearchValue.nativeElement.focus();
    };
    ProductSearchGridComponent.prototype.selectedData = function (event) {
        var vntReturnData, strProducts, strProductCodes;
        vntReturnData = event.row;
        switch (this.parentMode) {
            case 'ContractJobReport:Include':
                strProducts = this.inputParams['IncludeProducts'].trim();
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                }
                else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                vntReturnData['IncludeProducts'] = strProducts;
                break;
            case 'ContractJobReport:Exclude':
                strProducts = this.inputParams['ExcludeProducts'].trim();
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                }
                else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                vntReturnData['ExcludeProducts'] = strProducts;
                break;
            case 'CJIncludeProducts':
            case 'TCIncludeProducts':
            case 'PPUIncludeProducts':
                if (this.parentMode === 'CJIncludeProducts') {
                    strProducts = this.inputParams['CJIncludeProducts'].trim();
                }
                else if (this.parentMode === 'TCIncludeProducts') {
                    strProducts = this.inputParams['TCIncludeProducts'].trim();
                }
                else if (this.parentMode === 'PPUIncludeProducts') {
                    strProducts = this.inputParams['PPUIncludeProducts'].trim();
                }
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                }
                else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                if (this.parentMode === 'CJIncludeProducts') {
                    vntReturnData['CJIncludeProducts'] = strProducts;
                }
                else if (this.parentMode === 'TCIncludeProducts') {
                    vntReturnData['TCIncludeProducts'] = strProducts;
                }
                else if (this.parentMode === 'PPUIncludeProducts') {
                    vntReturnData['PPUIncludeProducts'] = strProducts;
                }
                break;
            case 'CJExcludeProducts':
            case 'TCExcludeProducts':
            case 'PPUExcludeProducts':
                if (this.parentMode === 'CJExcludeProducts') {
                    strProducts = this.inputParams['CJExcludeProducts'].trim();
                }
                else if (this.parentMode === 'TCExcludeProducts') {
                    strProducts = this.inputParams['TCExcludeProducts'].trim();
                }
                else if (this.parentMode === 'PPUExcludeProducts') {
                    strProducts = this.inputParams['PPUExcludeProducts'].trim();
                }
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                }
                else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                if (this.parentMode === 'CJExcludeProducts') {
                    vntReturnData['CJExcludeProducts'] = strProducts;
                }
                else if (this.parentMode === 'TCExcludeProducts') {
                    vntReturnData['TCExcludeProducts'] = strProducts;
                }
                else if (this.parentMode === 'PPUExcludeProducts') {
                    vntReturnData['PPUExcludeProducts'] = strProducts;
                }
                break;
            case 'ServiceCover-C':
            case 'ServiceCover-J':
            case 'ServiceCover-P':
            case 'TurnoverGrid':
            case 'LookUp':
            case 'Lookup-ProductComponent':
            case 'LookUp-Detail':
            case 'LookUp-Entitlement':
            case 'LookUp-ProductSales-P':
            case 'ProductAttributesSearch':
            case 'InfestationLookUp':
                if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled === 'TRUE') {
                }
                else {
                }
                break;
            case 'LookUp-Prod':
                vntReturnData['ReportProductCode'] = vntReturnData['ProductCode'];
                vntReturnData['ReportProductDesc'] = vntReturnData['ProductDesc'];
                break;
            case 'LookUp-FilterCode':
                vntReturnData['FilterCode'] = vntReturnData['ProductCode'];
                vntReturnData['FilterDesc'] = vntReturnData['ProductDesc'];
                break;
            case 'LookUp-Infest':
                vntReturnData['InfestationProduct'] = vntReturnData['ProductCode'];
                vntReturnData['InfestationProductDesc'] = vntReturnData['ProductDesc'];
                break;
            case 'LookUp-SalesGroup':
                vntReturnData['NewProductCode'] = vntReturnData['ProductCode'];
                vntReturnData['NewProductDesc'] = vntReturnData['ProductDesc'];
                break;
            case 'LookUp-ProductCustomerType':
                vntReturnData['origProductCode'] = vntReturnData['ProductCode'];
                vntReturnData['origProductDesc'] = vntReturnData['ProductDesc'];
                break;
            case 'LookUp-ProductComponent':
                vntReturnData['ComponentProductCode'] = vntReturnData['ProductCode'];
                vntReturnData['ComponentProductDesc'] = vntReturnData['ProductDesc'];
                break;
            case 'CompSearch':
            case 'LookUp-MktSegProd':
            case 'LookUp-ReqTypeProd':
                vntReturnData['ProductCode'] = vntReturnData['ProductCode'];
                vntReturnData['ProductDesc'] = vntReturnData['ProductDesc'];
                break;
            case 'DisplayEntry':
            case 'ComponentReplacement':
            case 'AlternateDisplayEntry':
            case 'AlternateComponentReplacement':
                if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled) {
                    vntReturnData['SelProductCode'] = vntReturnData['ProductCode'];
                    vntReturnData['SelProductDesc'] = vntReturnData['ProductDesc'];
                    vntReturnData['SelProductAlternateCode'] = vntReturnData['PrimaryAlternateCode'];
                }
                break;
            case 'RangeDetail':
                vntReturnData['ProductComponentCode'] = vntReturnData['ProductCode'];
                vntReturnData['ProductComponentDesc'] = vntReturnData['ProductDesc'];
                break;
            case 'UsesCompProd':
                vntReturnData['UsesComponentProduct'] = vntReturnData['ProductCode'];
                break;
            case 'ReplaceProdCode':
                vntReturnData['ReplaceWithProductCode'] = vntReturnData['ProductCode'];
                break;
            case 'LookUp-ProductComponentCode':
                vntReturnData['ProductComponentCode'] = vntReturnData['ProductCode'];
                break;
            case 'LookUp-UpdateComponentCode':
                vntReturnData['UpdateComponentCode'] = vntReturnData['ProductCode'];
                break;
            case 'Schedule':
                vntReturnData['ProductComponentCode'] = vntReturnData['ProductCode'];
                vntReturnData['ProductDesc'] = vntReturnData['ProductDesc'];
                vntReturnData['AlternateProductCode'] = vntReturnData['PrimaryAlternateCode'];
                break;
            case 'LookUpParent':
                vntReturnData['ProductCode'] = vntReturnData['ProductCode'];
                vntReturnData['ParentProductDesc'] = vntReturnData['ProductDesc'];
                break;
            case 'ProductCodesSearch':
                strProducts = this.inputParams['ProductCodes'];
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                }
                else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                vntReturnData['ProductCodes'] = strProducts;
                break;
            case 'StockRequestExclude':
                strProducts = this.inputParams['ProductCodeExclude'].trim();
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                }
                else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                vntReturnData['ProductCodeExclude'] = strProducts;
                break;
            default:
                vntReturnData['ProductCode'] = vntReturnData['ProductCode'];
                break;
        }
        this.ellipsis.sendDataToParent(vntReturnData);
    };
    ProductSearchGridComponent.prototype.updateView = function (params) {
        this.inputParams = params;
        if (this.hasSysCharData && this.inputParams) {
            this.parentMode = this.inputParams.parentMode;
            this.buildTableColumns();
            this.setFormValues();
            this.initView();
            this.updateHTML(this.getControlValue('ProductSearchType'));
        }
    };
    ProductSearchGridComponent.prototype.initView = function () {
        this.hideServiceCoverDispLevelBlock = false;
        if (!this.pageParams.vServiceCoverDispLevelEnabled || !this.pageParams.vProdLinkEnabled) {
            this.hideServiceCoverDispLevelBlock = true;
        }
    };
    ProductSearchGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBProductSearch.html'
                },] },
    ];
    ProductSearchGridComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    ProductSearchGridComponent.propDecorators = {
        'riTable': [{ type: ViewChild, args: ['riTable',] },],
        'ProductSearchValue': [{ type: ViewChild, args: ['ProductSearchValue',] },],
    };
    return ProductSearchGridComponent;
}(BaseComponent));
