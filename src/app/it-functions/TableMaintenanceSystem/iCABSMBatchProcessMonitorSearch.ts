import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Subscription } from 'rxjs/Rx';
import { LocalStorageService } from 'ng2-webstorage';
import { TableComponent } from './../../../shared/components/table/table';
import { Component, OnInit, Injector, ViewChild, Input, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSMBatchProcessMonitorSearch.html'
})

export class BatchProcessMonitorSearchComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('processMonitorTable') riTable: TableComponent;

    public inputParams: any = {
        module: 'batch-process',
        method: 'it-functions/ri-model',
        operation: 'Model/riMBatchProcessMonitorSearch'
    };
    public search: URLSearchParams;
    public pageId: string = '';
    public controls = [
        { name: 'FilterSelect', readonly: false, disabled: false, required: false },
        { name: 'StatusFilterSelect', readonly: false, disabled: false, required: false },
        { name: 'FilterInput', readonly: false, disabled: false, required: false },
        { name: 'FilterInputCheck', readonly: true, disabled: false, required: false },
        { name: 'BatchProcessUniqueNumber', readonly: true, disabled: false, required: false }
    ];

    public itemsPerPage: number = 8;
    public page: number = 1;
    private lookUpSubscription: Subscription;
    public pageParams: any = {};
    public filterLabel = 'UserCode';

    constructor(injector: Injector, private _ls: LocalStorageService) {
        super(injector);
        this.pageId = PageIdentifier.RIMBATCHPROCESSMONITORSEARCH;
        this.browserTitle = 'Batch Process Monitor Search';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.formData['BatchProcessUniqueNumber']) {
            this.populateUIFromFormData();
            this.addColumn();
            this.loadData();
        } else {
            this.pageParams.UserCode = this._ls.retrieve('RIUserCode');
            this.pageTitle = 'Batch Process Monitor';
            this.pageParams.statusList = [];
            this.pageParams.dtSubmittedDate = null;
            this.getRiDeveloperAccess();
        }
    }

    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public window_onload(): void {

        if ((this.pageParams.UserCode && this.pageParams.UserCode.toUpperCase() === 'CIT')
            || this.pageParams.riDeveloper) {
            this.pageParams.IdFilter = false;
        } else {
            this.pageParams.IdFilter = true;
        }
        this.addColumn();

        if ((this.pageParams.UserCode && this.pageParams.UserCode.toUpperCase() === 'CIT')
            || this.pageParams.riDeveloper) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterSelect', 'BatchProcessUserCode');
            this.FilterSelect_onchange();
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterInput', this.pageParams.UserCode);
        } else {
            this.FilterSelect_onchange();
        }
        this.loadData();
    }

    private addColumn(): void {
        this.riTable.AddTableField('BatchProcessUniqueNumber', MntConst.eTypeInteger, 'Key', 'Unique Number', 12);
        this.riTable.AddTableField('BatchProcessUserCode', MntConst.eTypeCode, 'Required', 'UserCode', 10);
        this.riTable.AddTableField('BatchProcessSubmittedDate', MntConst.eTypeDate, 'Required', 'Submitted Date', 10);
        this.riTable.AddTableField('BatchProcessSubmittedTime', MntConst.eTypeTime, 'Required', 'Submitted Time', 10);
        this.riTable.AddTableField('BatchProcessDescription', MntConst.eTypeText, 'Required', 'Description', 36);
        this.riTable.AddTableField('BatchProcessReport', MntConst.eTypeCheckBox, 'Required', 'Report', 5);
        this.riTable.AddTableField('BatchProcessTypeDisplayDesc', MntConst.eTypeText, 'Virtual', 'Status', 12);
    }

    public selectedData(event: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessUniqueNumber', event.row['BatchProcessUniqueNumber']);
        this.navigate('business', InternalMaintenanceApplicationModuleRoutes.RIMBATCHPROCESSMONITORMAINTENANCE);
    }

    public loadData(): void {
        //Check the filter values to be set
        this.setFilterValues();
        this.search.set(this.serviceConstants.Action, '2');
        this.inputParams.search = this.search;
        this.riTable.loadTableData(this.inputParams);
    }

    public setFilterValues(): void {
        this.search = this.getURLSearchParamObject();
        if (this.pageParams.UserCode && this.pageParams.UserCode.toUpperCase() !== 'CIT'
            && !this.pageParams.riDeveloper) {
            this.search.set('BatchProcessUserCode', this.pageParams.UserCode);
        }
        this.search.set(this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterSelect'),
            this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterInput'));
        this.search.set('search.op.' + this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterSelect'), 'GE');
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        this.search.set('search.sortby', 'BatchProcessUniqueNumber DESC');
    }

    public getRiDeveloperAccess(): void {
        let lookupIP = [
            {
                'table': 'UserInformation',
                'query': {
                    'UserCode': this.pageParams.UserCode
                },
                'fields': ['riDeveloper']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let userData = data[0][0];
            if (userData) {
                this.pageParams.riDeveloper = userData.riDeveloper;
            }
            this.window_onload();
        });
    }

    public FilterSelect_onchange(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterInput', '');
        let selectedValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterSelect');
        if (selectedValue === 'BatchProcessSubmittedDate') {
            this.pageParams.showDate = true;
        } else {
            this.pageParams.showDate = false;
        }
        if (selectedValue === 'BatchProcessTypeCode') {
            if (this.pageParams.statusList.length === 0) {
                this.getBatchProcessTypeLanguageList();
            }
            this.pageParams.StatusFilterSelect = false;
            this.pageParams['FilterInput'] = false;
            this.riExchange.riInputElement.Disable(this.uiForm, 'FilterInput');
        } else if (selectedValue === '') {
            this.pageParams.StatusFilterSelect = true;
            this.pageParams['FilterInput'] = true;
        } else {
            this.pageParams.StatusFilterSelect = true;
            this.pageParams['FilterInput'] = false;
            this.riExchange.riInputElement.Enable(this.uiForm, 'FilterInput');
        }

        switch (selectedValue) {
            case 'BatchProcessUniqueNumber':
                this.filterLabel = 'Unique Number';
                break;
            case 'BatchProcessUserCode':
                this.filterLabel = 'User Code';
                break;
            case 'BatchProcessTypeCode':
                this.filterLabel = 'Status Code';
                break;
            case 'BatchProcessProgramName':
                this.filterLabel = 'Program Name';
                break;
            case 'BatchProcessDescription':
                this.filterLabel = 'Description';
                break;
            case 'BatchProcessSubmittedDate':
                this.filterLabel = 'Date';
                break;
            default:
                break;
        }
    }

    public getBatchProcessTypeLanguageList(): void {
        let query = this.getURLSearchParamObject();
        this.pageParams.statusList = [];
        let formdata: Object = {};
        formdata['LanguageCode'] = this.riExchange.LanguageCode();
        query.set(this.serviceConstants.Action, '0');
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, query, formdata)
            .subscribe(
            (data) => {
                let arr = data.records;
                if (arr && arr.length > 0) {
                    for (let i = 0; i < arr.length; i++) {
                        let obj = {
                            BatchProcessTypeCode: arr[i].BatchProcessTypeCode,
                            BatchProcessTypeDisplayDesc: arr[i].BatchProcessTypeDisplayDesc
                        };
                        this.pageParams.statusList.push(obj);
                    }
                }
                this.riExchange.riInputElement.SetValue(this.uiForm, 'StatusFilterSelect', 0);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterInput', 0);
            },
            (error) => {
                this.errorService.emitError('Record not found');
            }
            );
    }

    public StatusFilterSelect_onclick(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterInput',
            this.riExchange.riInputElement.GetValue(this.uiForm, 'StatusFilterSelect'));
    }

    public dateToSelectedValue(value: any, id: string): void {
        if (value && value.trigger) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterInput', value.value);
        }
    }
}
