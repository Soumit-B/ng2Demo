import { TableComponent } from './../../../shared/components/table/table';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';

@Component({
    templateUrl: 'iCABSSCustomerTypeSearch.html'
})

export class CustomerTypeSearchComponent extends BaseComponent implements OnInit {
    @ViewChild('customerTypeSearch') customerTypeSearch: TableComponent;
    @ViewChild('inputField') inputField;
    public queryParams: any = {
        operation: 'System/iCABSSCustomerTypeSearch',
        module: 'segmentation',
        method: 'ccm/search'
    };
    public pageId: string = '';
    public drpCustomerTypeSearchType: string = '';
    public txtCustomerTypeSearchValue: string = '';
    public search = new URLSearchParams();
    public inputFieldSize = 30;

    public controls = [
        { name: 'CustomerTypeSearchValue', readonly: false, disabled: false, required: false },
        { name: 'CustomerTypeSearchType', readonly: false, disabled: false, required: false, value: 'Description' }

    ];
    public columns: Array<any> = [
        { title: 'Type', name: 'CustomerTypeCode' },
        { title: 'Description', name: 'CustomerTypeDesc' },
        { title: 'Market Segment Code', name: 'MarketSegmentCode' },
        { title: 'SIC Code', name: 'SICCode' },
        { title: 'Narrative', name: 'InvoiceNarrative' }
    ];
    public tableheading: string = 'Customer Type Search';
    constructor(injector: Injector, public ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCUSTOMERTYPESEARCH;
    }


    ngOnInit(): void {
        super.ngOnInit();
    }

    public updateView(params?: any): void {
        this.buildTable();
    }

    public buildTable(): void {
        let Parent = this.ellipsis.childConfigParams['parentMode'];
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.drpCustomerTypeSearchType = this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerTypeSearchType');
        this.txtCustomerTypeSearchValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerTypeSearchValue');
        if (this.txtCustomerTypeSearchValue !== '') {
            switch (this.drpCustomerTypeSearchType) {
                case 'Code':
                    this.search.set('CustomerTypeCode', this.txtCustomerTypeSearchValue);
                    break;
                case 'Description':
                    this.search.set('CustomerTypeDesc', this.txtCustomerTypeSearchValue);
                    this.search.set('search.op.CustomerTypeDesc', 'CONTAINS');
                    break;
            }
        }
        if (Parent === 'LookUp-ProductCustomerTypeGrid' || Parent === 'LookUp-ProductCustomerType') {
            this.search.set('ActiveInd', 'True');
            this.search.set('CustomerTypeLang', 'False');
        }
        else if (Parent === 'LookUp' || Parent === 'LookUp-Premise' || Parent === 'LookUp-PremiseIncSIC') {
            this.search.set('ActiveInd', 'True');
            this.search.set('CustomerTypeLang', 'True');
        }
        else if (Parent === 'LookUp-Maint' || Parent === 'Search-Maint') {
            this.search.set('CustomerTypeLang', 'False');
            this.search.set('ActiveInd', '');
        }
        this.queryParams.search = this.search;
        this.customerTypeSearch.loadTableData(this.queryParams);
    }
    public selectedData(event: any): void {
        let strCustomerTypes: any;
        let returnObj: any = {};
        let Parent = this.ellipsis.childConfigParams['parentMode'];
        switch (Parent) {
            case 'ContractJobReport':
                strCustomerTypes = this.riExchange.getParentHTMLValue('CustomerTypes');
                this.logger.log('strCustomerTypes', strCustomerTypes);
                if (strCustomerTypes === null) {
                    strCustomerTypes = event.row.CustomerTypeCode;
                }
                else {
                    strCustomerTypes = strCustomerTypes + ',' + event.row.CustomerTypeCode;
                }
                returnObj = {
                    'CustomerTypeCode': strCustomerTypes
                };
                break;
            case 'PCIncludeCustomerTypes':
            case 'PPUIncludeCustomerTypes':
            case 'CWIIncludeCustomerTypes':
                if (Parent === 'PCIncludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('PCIncludeCustomerTypes');
                if (Parent === 'PPUIncludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('PPUIncludeCustomerTypes');
                if (Parent === 'CWIIncludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('CWIIncludeCustomerTypes');
                if (strCustomerTypes === null) {
                    strCustomerTypes = event.row.CustomerTypeCode;
                }
                else {
                    strCustomerTypes = strCustomerTypes + ',' + event.row.CustomerTypeCode;
                }
                returnObj = {
                    'CustomerTypeCode': strCustomerTypes
                };
                break;
            case 'PCExcludeCustomerTypes':
            case 'PPUExcludeCustomerTypes':
            case 'CWIExcludeCustomerTypes':
                if (Parent === 'PCExcludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('PCExcludeCustomerTypes');
                if (Parent === 'PPUExcludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('PPUExcludeCustomerTypes');
                if (Parent === 'CWIExcludeCustomerTypes')
                    strCustomerTypes = this.riExchange.getParentHTMLValue('CWIExcludeCustomerTypes');
                if (strCustomerTypes === null || strCustomerTypes === undefined) {
                    strCustomerTypes = event.row.CustomerTypeCode;
                }
                else {
                    strCustomerTypes = strCustomerTypes + ',' + event.row.CustomerTypeCode;
                }
                returnObj = {
                    'CustomerTypeCode': strCustomerTypes
                };
                break;
            case 'LookUp-PremiseIncSIC':
                returnObj = {
                    'CustomerTypeCode': event.row.CustomerTypeCode,
                    'CustomerTypeDesc': event.row.CustomerTypeDesc,
                    'SICCode': event.row.SICCode
                };
                break;
            case 'LookUp-Premise':
                returnObj = {
                    'CustomerTypeCode': event.row.CustomerTypeCode,
                    'CustomerTypeDesc': event.row.CustomerTypeDesc
                };
                break;
            default:
                returnObj = {
                    'CustomerTypeCode': event.row.CustomerTypeCode,
                    'CustomerTypeDesc': event.row.CustomerTypeDesc
                };
                if (Parent === 'LookUp' || Parent === 'LookUp-Maint' || Parent === 'LookUp-ProductCustomerType') {
                    //returnObj.CustomerTypeCode = event.row.CustomerTypeDesc;
                    returnObj = {
                        // 'CustomerTypeCode': event.row.CustomerTypeDesc
                        'CustomerTypeCode': event.row.CustomerTypeCode,
                        'CustomerTypeDesc': event.row.CustomerTypeDesc
                    };
                }
                else if (Parent === 'LookUp-ProductCustomerTypeGrid')
                    returnObj = {
                        'CustomerTypeCode': event.row.CustomerTypeCode,
                        'CustomerTypeDesc': event.row.CustomerTypeDesc
                    };
        }
        this.ellipsis.sendDataToParent(returnObj);
    }
    public UpdateHTML(): void {
        this.setControlValue('CustomerTypeSearchValue', '');
        this.inputField.nativeElement.focus();

        let CustomerTypeSearchType = this.getControlValue('CustomerTypeSearchType');
        switch (CustomerTypeSearchType) {
            case 'Code':
                this.inputFieldSize = 10;
                break;
            case 'Description':
                this.inputFieldSize = 30;
                break;
        }
    }
}
