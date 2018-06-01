import { ErrorCallback } from './../../base/Callback';
import { TableComponent } from './../../../shared/components/table/table';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MntConst } from './../../../shared/services/riMaintenancehelper';



@Component({
    templateUrl: 'iCABSSHistoryTypeLanguageSearch.html'
})

export class HistoryTypeLanguageSearchComponent extends BaseComponent implements ErrorCallback {
    @ViewChild('historyTypeLang') historyTypeLang: TableComponent;
    @ViewChild('errorModal') public errorModal;
    public queryParams: any = {
        operation: 'System/iCABSSHistoryTypeLanguageSearch',
        module: 'history',
        method: 'contract-management/search'
    };
    public itemsPerPage: string = '10';
    public page: string = '1';
    public pageId: string;
    private search: any;
    public hideInput: boolean = false;
    public controls = [
        { name: 'LanguageCode', readonly: false, disabled: true, required: false }, //Parent page
        { name: 'LanguageDescription', readonly: false, disabled: true, required: false },//Parent page
        { name: 'HistoryTypeDesc', readonly: false, disabled: false, required: true },
        { name: 'ContractHistoryFilterValue', readonly: false, disabled: false, required: true },
        { name: 'ContractHistoryFilterDesc', readonly: false, disabled: false, required: true },
        { name: 'AccountHistoryFilterValue', readonly: false, disabled: false, required: true },
        { name: 'AccountHistoryFilterDesc', readonly: false, disabled: false, required: true }
    ];
    public tableheading: string = 'History Type Search';
    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSHISTORYTYPELANGUAGESEARCH;
    }
    // tslint:disable-next-line:use-life-cycle-interface
    ngOnInit(): void {
        super.ngOnInit();
        this.setControlValue('LanguageCode', this.riExchange.LanguageCode());
        this.setControlValue('LanguageDescription', this.riExchange.getParentHTMLValue('LanguageDescription'));
        //this.buildTableColumns();
        this.fetchTranslationAndBuildTable();
        this.setErrorCallback(this);
        this.doLookup();
    }
    private buildTable(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        this.queryParams.search = this.search;
        this.historyTypeLang.loadTableData(this.queryParams);
    }
    private doLookup(): any {
        let lookupIPSub = [
            {
                'table': 'Language',
                'query': { 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['LanguageDescription']
            }];
        this.LookUp.lookUpPromise(lookupIPSub, 5).then(data => {
            if (data && data[0].length) {
                let resultLanguageDescription = data[0][0].LanguageDescription;
                if (resultLanguageDescription[0])
                    this.setControlValue('LanguageDescription', resultLanguageDescription);
            }
        }).catch(error => {
            this.errorService.emitError(error);
        });
    }
    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    }
    public refresh(): void {
        this.historyTypeLang.loadTableData(this.queryParams);
    }
    public tableDataLoaded(data: any): void {
        let tableRecords: Array<any> = data.tableData['records'];
        if (tableRecords.length === 0) {
            this.tableheading = 'No record found';
        }
    }
    public columns: Array<any> = [];
    public buildTableColumns(): void {
        this.columns = [];
        let res: string;
        res = this.uiForm.controls['LanguageCode'].value;
        if (res && res.length > 0) {
            this.columns.push({ title: 'Type Code', name: 'HistoryTypeCode', type: MntConst.eTypeInteger });
            this.columns.push({ title: 'Display Description', name: 'HistoryTypeDesc', type: MntConst.eTypeText });
            this.hideInput = true;

        }
        else {
            this.columns.push({ title: 'Type Code', name: 'HistoryTypeCode', type: MntConst.eTypeInteger });
            if (this.ellipsis.childConfigParams['parentMode'] !== 'Contract') {
                this.columns.push({ title: 'Description', name: 'HistoryTypeSystemDesc', type: MntConst.eTypeText });
            } else {
                this.columns.push({ title: 'Display Description', name: 'HistoryTypeDesc', type: MntConst.eTypeText });
            }
        }
        this.buildTable();
    }
    public selectedData(event: any): void {
        let returnObj: any;
        returnObj = event.row;
        this.ellipsis.sendDataToParent(returnObj);
    }

    public tableRowClick(event: any): void {
        let vntReturnData: any;
        vntReturnData = event.row;
        switch (this.parentMode) {
            case 'LookUp':
                if (vntReturnData.LanguageDescription) {
                    this.riExchange.SetParentHTMLInputValue('HistoryTypeDesc', vntReturnData.HistoryTypeSystemDesc);
                    this.setControlValue('HistoryTypeDesc', vntReturnData.HistoryTypeSystemDesc);
                }
                break;
            case 'LookUp-ContractHistory':
                if (vntReturnData.HistoryTypeDesc) {
                    this.riExchange.SetParentHTMLInputValue('ContractHistoryFilterValue', vntReturnData.HistoryTypeCode);
                    this.riExchange.SetParentHTMLInputValue('ContractHistoryFilterDesc', vntReturnData.HistoryTypeDesc);
                    this.setControlValue('ContractHistoryFilterValue', vntReturnData.HistoryTypeCode);
                    this.setControlValue('ContractHistoryFilterDesc', vntReturnData.HistoryTypeDesc);
                }
                break;
            case 'LookUp-AccountHistory':
                if (vntReturnData.ListDetails) {
                    this.riExchange.SetParentHTMLInputValue('AccountHistoryFilterValue', vntReturnData.HistoryTypeCode);
                    this.riExchange.SetParentHTMLInputValue('AccountHistoryFilterDesc', vntReturnData.HistoryTypeSystemDesc);
                    this.setControlValue('AccountHistoryFilterValue', vntReturnData.HistoryTypeCode);
                    this.setControlValue('AccountHistoryFilterDesc', vntReturnData.HistoryTypeSystemDesc);
                    this.navigate('LookUp-AccountHistory', 'application/accountHistory/detail');
                }
                break;
            default:
        }

    }

    public fetchTranslationAndBuildTable(): void {
        Observable.forkJoin(
          this.getTranslatedValue('Type Code', null),
          this.getTranslatedValue('Description', null),
          this.getTranslatedValue('Display Description', null)
        ).subscribe((data) => {
            this.columns = [];
            let res: string;
            res = this.uiForm.controls['LanguageCode'].value;

            if (res && res.length > 0) {
                this.columns.push({ title: data[0], name: 'HistoryTypeCode', type: MntConst.eTypeInteger });
                this.columns.push({ title: data[2], name: 'HistoryTypeDesc', type: MntConst.eTypeText });
                this.hideInput = true;

            }
            else {
                this.columns.push({ title: data[0], name: 'HistoryTypeCode', type: MntConst.eTypeInteger });
                if (this.ellipsis.childConfigParams['parentMode'] !== 'Contract') {
                    this.columns.push({ title: data[1], name: 'HistoryTypeSystemDesc', type: MntConst.eTypeText });
                } else {
                    this.columns.push({ title: data[2], name: 'HistoryTypeDesc' });
                }
            }
            this.buildTable();

        });
    }
}
