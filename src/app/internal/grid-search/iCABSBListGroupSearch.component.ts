
import { Component, Injector, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';

import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from './../../../shared/services/utility';
import { RiExchange } from './../../../shared/services/riExchange';

@Component({
    templateUrl: 'iCABSBListGroupSearch.html'
})

export class ListGroupSearchComponent implements OnInit, OnDestroy {
    @ViewChild('listGroupSearchTable') listGroupSearchTable: TableComponent;
    private vbLGListGroupCodeFld: any;
    private vbLGListDetailsFld: any;
    private vbLGListGroupDescFld: any;
    public pageId: string = '';
    public uiForm: FormGroup;
    public pageTitle: string;
    public controls = [
        { name: 'APICode', readonly: false, disabled: true, required: false }, //Parent page
        { name: 'APICodeDesc', readonly: false, disabled: true, required: false } //Parent page
    ];
    public columns: Array<any> = [
        { title: 'List Group', name: 'ListGroupCode', type: MntConst.eTypeCode },
        { title: 'Description', name: 'ListGroupDesc', type: MntConst.eTypeText },
        { title: 'List Details', name: 'ListDetails', type: MntConst.eTypeTextFree },
        { title: 'Display Order', name: 'DisplayOrder', type: MntConst.eTypeInteger }
    ];
    public queryParams: any = {
        operation: 'Business/iCABSBListGroupSearch',
        module: 'advantage',
        method: 'prospect-to-contract/search'
    };
    constructor(injector: Injector, private ellipsis: EllipsisComponent, private utils: Utils,
        private serviceConstants: ServiceConstants, private formBuilder: FormBuilder, private riExchange: RiExchange) {
        this.pageId = PageIdentifier.ICABSBLISTGROUPSEARCH;
        this.pageTitle = 'List Group Search';
}

    ngOnInit(): void {
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    ngOnDestroy(): void {
        this.utils.noop();
    }

    private buildTable(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('ListTypeCode', this.ellipsis.childConfigParams['LGListTypeCodeVal']);
        this.queryParams.search = search;
        this.listGroupSearchTable.loadTableData(this.queryParams);
    }
    public onSelect(event: any): void {
        let vntReturnData: any;
        let returnObj: any = {};
        vntReturnData = event.row;
        switch (this.ellipsis.childConfigParams['parentMode']) {
            case 'LookUp':
            case 'LookUp-Maint':
                if (this.vbLGListGroupCodeFld) {
                    returnObj['vbLGListGroupCodeFld'] = vntReturnData.ListGroupCode;
                }
                if (this.vbLGListGroupCodeFld) {
                    returnObj['vbLGListGroupDescFld'] = vntReturnData.ListDetails;
                }
                if (this.vbLGListGroupDescFld) {
                    returnObj['vbLGListDetailsFld'] = vntReturnData.ListGroupDesc;
                }
                break;
            default:
                if (vntReturnData.ListGroupCode)
                    returnObj['vbLGListGroupCodeFld'] = vntReturnData.ListGroupCode;
                break;
        }
        this.ellipsis.sendDataToParent(returnObj);
    }

    public updateView(params: any): void {
        this.vbLGListGroupCodeFld = this.ellipsis.childConfigParams['LGListGroupCodeFld'];
        this.vbLGListDetailsFld = this.ellipsis.childConfigParams['LGListDetailsFld'];
        this.vbLGListGroupDescFld = this.ellipsis.childConfigParams['LGListGroupDescFld'];
        this.buildTable();
    }
}
