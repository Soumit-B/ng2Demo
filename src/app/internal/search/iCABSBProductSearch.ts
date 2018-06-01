import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { TableComponent } from './../../../shared/components/table/table';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { RiMaintenance, MntConst, RiTab } from './../../../shared/services/riMaintenancehelper';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'iCABSBProductSearch.html'
})
export class ProductSearchGridComponent extends BaseComponent implements OnInit {
    @ViewChild('riTable') riTable: TableComponent;
    @ViewChild('ProductSearchValue') ProductSearchValue;
    public pageId: string = '';
    private hasSysCharData: boolean = false;
    public controls = [
        { name: 'ProductSearchType' }, //Parent page
        { name: 'ProductSearchValue' }, //Parent page
        { name: 'ProductOtherRange1' }, //Parent page
        { name: 'ProductOtherRange2' }, //Parent page
        { name: 'ProductOtherRange3' }, //Parent page
        { name: 'ReplacementSearchType' }, //Parent page
        { name: 'RotationalProductSearchType' }, //Parent page
        { name: 'ComponentTypeCodeSearchType' }, //Parent page
        { name: 'LOSCode' },
        { name: 'LOSCodeSel' },
        { name: 'ProductRange' }
    ];
    public inputParams: any = {};
    public maxColumn: number;
    public itemsPerPage: number = 10;
    public page: number = 1;
    public pageSize: number;
    // public totalItems: string;
    public lookUpSubscription: Subscription;
    public currentPage: number;
    public queryParams: any = {
        operation: 'Business/iCABSBProductSearch',
        module: 'product',
        method: 'service-delivery/search'
    };
    public search: URLSearchParams;
    public tableheading: string = 'Product Search';
    public columns: Array<any> = [];
    public rowmetadata: Array<any> = new Array();
    public tdLineOfService: boolean = true;
    public isServiceSalesEmployee: boolean = true;
    public lineOfService: Array<any> = [];
    public componentType: Array<any> = [];
    public hideServiceCoverDispLevelBlock: boolean = false;

    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBPRODUCTSEARCH;
    }
    ngOnInit(): void {
        super.ngOnInit();
    }

    private windowOnLoad(): void {
        this.getSysCharDtetails();
        this.callLookupDataForLOS();
        this.callLookupDataForComponent();
    }

    /*Get formData from LookUp API Call*/
    private callLookupDataForLOS(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'LineOfService',
                'query': {
                    'ValidForBusiness': this.businessCode()
                },
                'fields': ['LOSCode', 'LOSName']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0][0]) {
                this.lineOfService.push({ 'LOSCode': data[0][0].LOSCode, 'LOSName': data[0][0].LOSName });
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    private callLookupDataForComponent(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'ComponentType',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ComponentTypeCode']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0]) {
                this.componentType = data[0];
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    /*Speed script*/
    private getSysCharDtetails(): void {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableWasteTransfer,
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableServiceCoverDetail,
            this.sysCharConstants.SystemCharEnableProductLinking,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel

        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            if (record && record.length > 0) {
                this.hasSysCharData = true;
                this.pageParams.vWasteTransferReq = record[0].Required;
                this.pageParams.vInstallationReq = record[1].Required;
                this.pageParams.vSCDetailReq = record[2].Required;
                this.pageParams.vProdLinkEnabled = record[3].Required;
                this.pageParams.vServiceCoverDispLevelEnabled = record[4].Required;
            }
            this.initView();
        });
    }

    private setFormValues(): void {
        let selComponentTypeCode: any, componentTypeCode: any;
        this.setControlValue('ProductSearchType', 'Code');
        this.setControlValue('ReplacementSearchType', 'All');
        this.setControlValue('RotationalProductSearchType', 'All');
        this.setControlValue('ComponentTypeCodeSearchType', 'All');
        switch (this.parentMode) {
            case 'DisplayEntry':
            case 'ComponentReplacement':
            case 'AlternateDisplayEntry':
            case 'AlternateComponentReplacement':
                this.tdLineOfService = false;
                break;
            case 'LookUp-MktSegProd':
                this.setControlValue('LOSCodeSel', this.inputParams['LOSCode']);
                this.tdLineOfService = false;
                break;
            case 'LookUp-ReqTypeProd':
                this.setControlValue('LOSCodeSel', this.inputParams['LOSCodeReq']);
                this.tdLineOfService = false;
                break;
        }
        if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled) {
            if (this.parentMode === 'DisplayEntry' || this.parentMode === 'ComponentReplacement' || this.parentMode === 'AlternateDisplayEntry' || this.parentMode === 'AlternateComponentReplacement') {
                selComponentTypeCode = this.inputParams['SelComponentTypeCode'];
                if (selComponentTypeCode && selComponentTypeCode.trim() !== '') {
                    this.setControlValue('ComponentTypeCodeSearchType', selComponentTypeCode);
                } else {
                    this.setControlValue('ComponentTypeCodeSearchType', 'All');
                }
            }
            if (this.parentMode === 'ComponentReplacement' || this.parentMode === 'AlternateComponentReplacement') {
                selComponentTypeCode = this.inputParams['SelComponentTypeCode'];
                if (selComponentTypeCode && selComponentTypeCode.trim() === '') {
                    this.setControlValue('ComponentTypeCodeSearchType', 'All');
                } else {
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
                } else {
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
    }

    public cmdSearch_onclick(): void {
        this.loadTableData();
    }

    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    public getTableInfo(info: any): void {
        //todo
    }

    private buildTableColumns(): void {
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

            //these columns are only shown depending on SYS chars
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
        //Only add Line Of Service if the filter field is displayed
        if (this.tdLineOfService) {
            this.columns.push({ title: 'Line of Service', name: 'LOSName' });
        }

        /*this.queryParams.columns = [];
        this.queryParams.columns = this.columns;
        this.queryParams.rowmetadata = [];
        this.queryParams.rowmetadata = this.rowmetadata;
        this.loadTableData();*/
    }

    public loadTableData(): void {
        let ReplacementIndvalue: any, RotationalProductIndvalue: any, ComponentTypecode: any, productSearchValue: any, search: any, orderBy: string = '', formData: any;
        formData = this.uiForm.getRawValue();
        search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '0');

        if (this.tdLineOfService) {
            search.set('LOSCode', this.getControlValue('LOSCode'));
            search.set('ShowLOSCode', true);
        } else if (this.parentMode === 'LookUp-MktSegProd' || this.parentMode === 'LookUp-ReqTypeProd') {
            search.set('LOSCode', this.getControlValue('LOSCodeSel'));
            search.set('ShowLOSCode', true);
        }

        productSearchValue = this.getControlValue('ProductSearchValue');
        if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled) {
            ReplacementIndvalue = this.getControlValue('ReplacementSearchType');
            RotationalProductIndvalue = this.getControlValue('RotationalProductSearchType');
            ComponentTypecode = this.getControlValue('ComponentTypeCodeSearchType');

            if (productSearchValue) {
                switch (formData.ProductSearchType) {
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

            //Other Range will be available in the RangeDetail for the given productrange
            if (formData.ProductOtherRange1) {
                search.set('ProdRangeother1', formData.ProductOtherRange1);
            }
            if (formData.ProductOtherRange2) {
                search.set('ProdRangeother2', formData.ProductOtherRange2);
            }
            if (formData.ProductOtherRange3) {
                search.set('ProdRangeother3', formData.ProductOtherRange3);
            }
            //Defualt Range will be picked from product
            search.set('ProductRange', formData.ProductRange);
            if (ReplacementIndvalue !== 'All') {
                search.set('ReplacementIndvalue', ReplacementIndvalue);
            }
            if (RotationalProductIndvalue !== 'All') {
                search.set('RotationalProductIndvalue', RotationalProductIndvalue);
            }
            if (ComponentTypecode === 'Blank') {
                search.set('ComponentTypeCode', '');
            } else if (ComponentTypecode !== 'All' && ComponentTypecode !== 'Blank') {
                search.set('ComponentTypeCode', ComponentTypecode);
            }

        } else {
            if (productSearchValue !== '') {
                switch (formData.ProductSearchType) {
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
                let ProductSaleGroupCode = this.inputParams['ProductSaleGroupCode'];
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
                    search.set('LinkedChildProduct', 'True');
                    search.set('ParentProductCode', this.inputParams['ProductCode']);
                }
                break;
        }

        if (this.utils.Left(this.parentMode, 12) === 'ServiceCover' || this.utils.Left(this.parentMode, 20) === 'LookUp-ProductSales-') {
            search.set('ProductExpense', 'True');
            search.set('ContractTypeCode', this.utils.Right(this.parentMode, 1));
        }

        if (this.getControlValue('ProductSearchValue') && formData.ProductSearchType === 'AlternateProduct') {
            search.set('ProductAlternateCodes', 'True');
            search.set('AlternateProductCode', productSearchValue);
            //search.set('search.op.AlternateProductCode', 'BEGINS');
        }

        if (this.parentMode !== 'ServiceCover-C' && this.parentMode !== 'ServiceCover-J' && this.parentMode !== 'LookUp' && this.parentMode !== 'LookUp-ProductComponent' && this.parentMode !== 'Search' && this.parentMode !== 'CompSearch' && this.parentMode !== 'UsesCompProd' && this.parentMode !== 'ReplaceProdCode' && this.parentMode !== 'ProductAttributesSearch' && this.parentMode !== 'Schedule' && this.parentMode !== 'LookUp-ProductComponentCode' && this.parentMode !== 'LookUpParent' && this.parentMode !== 'ProductCodesSearch' && this.parentMode !== 'InfestationLookUp') {
            //this.riTable.AddTableOrder('ConsumableInd', eOrderAscending)
            search.set('ConsumableInd', 'True');
        }

        /*switch (formData.ProductSearchType) {
            case 'Description':
                //this.riTable.AddTableOrder('ProductDesc', MntConst.eOrderAscending)
                orderBy += 'ProductDesc';
                break;
            case 'Code':
                //this.riTable.AddTableOrder('ProductCode', eOrderAscending)
                orderBy += 'ProductCode';
                break;
            case 'AlternateProduct':
                //this.riTable.AddTableOrder('PrimaryAlternateCode',eOrderAscending)
                orderBy += 'PrimaryAlternateCode';
                break;
        }*/
        orderBy = formData.ProductSearchType;
        search.set('ProductSearchType', orderBy);

        this.queryParams.search = search;
        this.riTable.loadTableData(this.queryParams);
    }
    public refresh(): void {
        this.loadTableData();
    }

    public productSearchType_onchange(data: any): void {
        this.updateHTML(data);
    }

    public productSearchValue_onchange(data: any): void {
        if (this.pageParams.vServiceCoverDispLevelEnabled && this.pageParams.vProdLinkEnabled) {
            if (this.parentMode === 'ComponentReplacement' || this.parentMode === 'AlternateComponentReplacement') {
                this.setControlValue('ComponentTypeCodeSearchType', 'All');
                this.disableControl('ComponentTypeCodeSearchType', true);
            }
        }
    }

    public productRange_onkeydown(event: any): void {
        event.preventDefault();
        if (event.keyCode === 34) {
            //this.navigate('ProductDefaultRange-Lookup', 'Business/iCABSBRangeHeaderSearch.htm'];
        }
    }

    public productOtherRange1_onkeydown(event: any): void {
        event.preventDefault();
        if (event.keyCode === 34) {
            //this.navigate('ProductOtherRange1-Lookup', 'Business/iCABSBRangeHeaderSearch.htm'];
        }
    }

    public productOtherRange2_onkeydown(event: any): void {
        event.preventDefault();
        if (event.keyCode === 34) {
            //this.navigate('ProductOtherRange2-Lookup', 'Business/iCABSBRangeHeaderSearch.htm'];
        }
    }

    public productOtherRange3_onkeydown(event: any): void {
        event.preventDefault();
        if (event.keyCode === 34) {
            //this.navigate('ProductOtherRange3-Lookup', 'Business/iCABSBRangeHeaderSearch.htm'];
        }
    }

    public updateHTML(productSearchType: any): void {
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
    }

    public selectedData(event: any): void {
        let vntReturnData: any, strProducts: any, strProductCodes: any;
        vntReturnData = event.row;
        switch (this.parentMode) {
            case 'ContractJobReport:Include':
                strProducts = this.inputParams['IncludeProducts'].trim();
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                } else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                vntReturnData['IncludeProducts'] = strProducts;
                break;
            case 'ContractJobReport:Exclude':
                strProducts = this.inputParams['ExcludeProducts'].trim();
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                } else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                vntReturnData['ExcludeProducts'] = strProducts;
                break;
            case 'CJIncludeProducts':
            case 'TCIncludeProducts':
            case 'PPUIncludeProducts':
                if (this.parentMode === 'CJIncludeProducts') {
                    strProducts = this.inputParams['CJIncludeProducts'].trim();
                } else if (this.parentMode === 'TCIncludeProducts') {
                    strProducts = this.inputParams['TCIncludeProducts'].trim();
                } else if (this.parentMode === 'PPUIncludeProducts') {
                    strProducts = this.inputParams['PPUIncludeProducts'].trim();
                }
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                } else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                if (this.parentMode === 'CJIncludeProducts') {
                    vntReturnData['CJIncludeProducts'] = strProducts;
                } else if (this.parentMode === 'TCIncludeProducts') {
                    vntReturnData['TCIncludeProducts'] = strProducts;
                } else if (this.parentMode === 'PPUIncludeProducts') {
                    vntReturnData['PPUIncludeProducts'] = strProducts;
                }
                break;
            case 'CJExcludeProducts':
            case 'TCExcludeProducts':
            case 'PPUExcludeProducts':
                if (this.parentMode === 'CJExcludeProducts') {
                    strProducts = this.inputParams['CJExcludeProducts'].trim();
                } else if (this.parentMode === 'TCExcludeProducts') {
                    strProducts = this.inputParams['TCExcludeProducts'].trim();
                } else if (this.parentMode === 'PPUExcludeProducts') {
                    strProducts = this.inputParams['PPUExcludeProducts'].trim();
                }
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                } else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                if (this.parentMode === 'CJExcludeProducts') {
                    vntReturnData['CJExcludeProducts'] = strProducts;
                } else if (this.parentMode === 'TCExcludeProducts') {
                    vntReturnData['TCExcludeProducts'] = strProducts;
                } else if (this.parentMode === 'PPUExcludeProducts') {
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
                    //vntReturnData['ProductCode'] = vntReturnData[0];
                    //vntReturnData['ProductDesc'] = vntReturnData[1];
                    //vntReturnData['ComponentTypeCode'] = vntReturnData[2];
                } else {
                    //vntReturnData['ProductCode'] = vntReturnData[0];
                    //vntReturnData['ProductDesc'] = vntReturnData[1];
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
                } else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                vntReturnData['ProductCodes'] = strProducts;
                break;
            case 'StockRequestExclude':
                strProducts = this.inputParams['ProductCodeExclude'].trim();
                if (!strProducts) {
                    strProducts = vntReturnData['ProductCode'];
                } else {
                    strProducts = strProducts + ',' + vntReturnData['ProductCode'];
                }
                vntReturnData['ProductCodeExclude'] = strProducts;
                break;
            default:
                vntReturnData['ProductCode'] = vntReturnData['ProductCode'];
                //     Call riExchange.FetchRecord()
                break;
        }
        this.ellipsis.sendDataToParent(vntReturnData);
    }

    public updateView(params: any): void {
        this.inputParams = params;
        this.componentType = [];
        this.lineOfService = [];
        this.riTable.clearTable();
        this.windowOnLoad();
    }
    private initView(): void {
        if (this.hasSysCharData && this.inputParams) {
            this.parentMode = this.inputParams.parentMode;
            this.setFormValues();
            this.buildTableColumns();
            this.updateHTML(this.getControlValue('ProductSearchType'));

            this.hideServiceCoverDispLevelBlock = false;
            if (!this.pageParams.vServiceCoverDispLevelEnabled || !this.pageParams.vProdLinkEnabled) {
                this.hideServiceCoverDispLevelBlock = true;
            }
        }
    }

    public onAddNew(): void {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    }
}
