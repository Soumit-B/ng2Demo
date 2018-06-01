import { Component, OnInit, Injector, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { PageIdentifier } from './../../base/PageIdentifier';
import { TableComponent } from './../../../shared/components/table/table';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { RiExchange } from './../../../shared/services/riExchange';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from './../../../shared/services/utility';
import { SelectedDataEvent } from './../../../shared/events/ellipsis-event-emitter';

@Component({
    templateUrl: 'iCABSBSeasonalTemplateSearch.html'
})

export class SeasonalTemplateSearchComponent extends SelectedDataEvent implements OnInit, OnDestroy {
    @ViewChild('riTable') riTable: TableComponent;
    @Input() showAddNew: boolean;

    private inputParams: any = {};
    private parentMode: string = '';
    private columnHeaders: any = {
        templateNumber: 'Template Number',
        templateName: 'Template Name',
        noOfSeasons: 'Number Of Seasons'
    };
    public isShow: boolean = false;
    public search = new URLSearchParams();
    public pageId: string = '';
    public page: any;
    public itemsPerPage: number = 10;
    public uiForm: FormGroup;
    public serviceConstants: ServiceConstants;
    public utils: Utils;
    public riExchange: RiExchange;
    public browserTitle: string = '';
    public pageTitle: string = '';
    public queryParams: any = {
        operation: 'Business/iCABSBSeasonalTemplateSearch',
        module: 'template',
        method: 'service-planning/search'
    };

    constructor(injector: Injector, private ellipsis: EllipsisComponent, private fb: FormBuilder) {
        super();
        this.riExchange = injector.get(RiExchange);
        this.utils = injector.get(Utils);
        this.injectServices(injector);
        this.pageId = PageIdentifier.ICABSBSEASONALTEMPLATESEARCH;
        this.pageTitle = 'Seasonal Template Search';
        this.uiForm = this.fb.group({
            BusinessCode: [{ value: '', disabled: true }],
            BusinessDesc: [{ value: '', disabled: true }]
        });
    }
    ngOnInit(): void {
        this.buildTableColumns();
        this.isShow = this.parentMode === 'LookUp-UserAuthorityBranch' ? true : false;
    }
    ngOnDestroy(): void {
        this.serviceConstants = null;
    }
    private injectServices(injector: Injector): void {
        this.serviceConstants = injector.get(ServiceConstants);
    }

    private buildTable(): void {
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('BranchNumber', this.utils.getBranchCode());
        search.set('search.sortby', 'SeasonalTemplateNumber');
        this.inputParams.parentMode = this.parentMode;
        this.inputParams.search = search;
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.riTable.loadTableData(this.inputParams);
    }

    private buildTableColumns(): void {
        this.riTable.AddTableField('SeasonalTemplateNumber', MntConst.eTypeCode, 'Key', this.columnHeaders.templateNumber);
        this.riTable.AddTableField('TemplateName', MntConst.eTypeText, 'Virtual', this.columnHeaders.templateName);
        this.riTable.AddTableField('NoOfSeasons', MntConst.eTypeText, 'Virtual', this.columnHeaders.noOfSeasons);
    }
    private updateView(params: any): void {
        if (params) {
            this.showAddNew = params.showAddNew;
            let search: URLSearchParams = new URLSearchParams();
            search.set(this.serviceConstants.Action, '0');
            this.queryParams.search = this.search;
            this.parentMode = params.parentMode;
            this.buildTable();
        }
    }

    public selectedData(event: any): void {
        let vntReturnData: any = event.row;
        switch (this.parentMode) {
            case 'LookUp':
            case 'LookUp-AllAccessSeasonal':
                this.riExchange.setParentHTMLValue('SeasonalTemplateNumber', vntReturnData.SeasonalTemplateNumber);
                this.riExchange.setParentHTMLValue('TemplateName', vntReturnData.TemplateName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SeasonalTemplateNumber', vntReturnData.SeasonalTemplateNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TemplateName', vntReturnData.TemplateName);
                break;
            case 'LookUp-AllAccess':
                this.riExchange.setParentHTMLValue('TemplateNumber', vntReturnData.SeasonalTemplateNumber);
                this.riExchange.setParentHTMLValue('TemplateName', vntReturnData.TemplateName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TemplateNumber', vntReturnData.SeasonalTemplateNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TemplateName', vntReturnData.TemplateName);
                break;
            default:
                this.riExchange.setParentHTMLValue('SeasonalTemplateNumber', vntReturnData.SeasonalTemplateNumber);
        }
        let returnObj: Object = {
            'TemplateNumber': vntReturnData.SeasonalTemplateNumber,
            'TemplateName': vntReturnData.TemplateName,
            'rowid': vntReturnData.ttBranchSeasonalTemplate
        };

        this.emitSelectedData(returnObj);
    }
    public refresh(): void {
        this.riTable.loadTableData(this.inputParams);
    }
    public onAddNew(): void {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    }
}
