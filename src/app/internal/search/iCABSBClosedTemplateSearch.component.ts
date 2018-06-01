import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { TableComponent } from './../../../shared/components/table/table';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';

@Component({
    templateUrl: 'iCABSBClosedTemplateSearch.html'
})

export class ClosedTemplateSearchComponent extends BaseComponent implements OnInit {
    @ViewChild('closedTemplateSearchTable') closedTemplateSearchTable: TableComponent;
    public pageId: string = '';
    public controls = [
        { name: 'BusinessCode', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'BusinessDesc', readonly: false, disabled: true, required: false }
    ];
    constructor(injector: Injector, private ellipsis: EllipsisComponent) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBCLOSEDTEMPLATESEARCH;
    }
    public tableheading: string = 'Closed Template Search';
    public IsgrdBusinessDetail: boolean = false;
    public queryParams: any = {
        operation: 'Business/iCABSBClosedTemplateSearch',
        module: 'template',
        method: 'service-planning/search'
    };
    public search = new URLSearchParams();
    public showAddNew: boolean = false;
    public columns: Array<any> = [
        { title: 'Template Number', name: 'ClosedCalendarTemplateNumber', sortType: 'ASC', type: MntConst.eTypeInteger },
        { title: 'Template Name', name: 'TemplateName', type: MntConst.eTypeText },
        { title: 'Premises Specific', name: 'PremiseSpecificInd', type: MntConst.eTypeCheckBox },
        { title: 'Short Name', name: 'PremiseSpecificText', type: MntConst.eTypeText }
    ];
    public rowmetadata: Array<any> = new Array();

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Closed Template Search';
        this.fetchTranslationContent();
    }
    public updateView(params: any): void {
        this.showAddNew = params.showAddNew;
        switch (params.parentMode) {
            case 'LookUp-UserAuthorityBranch':
                this.IsgrdBusinessDetail = true;
                this.setControlValue('BusinessCode', this.utils.getBusinessCode());
                break;
        }
        this.pageParams.parentMode = params.parentMode;
        this.buildTable();
    }

    public onAddNew(): void {
        this.ellipsis.sendDataToParent({
            parentMode: 'SearchAdd'
        });
        this.ellipsis.closeModal();
    }

    private buildTable(): void {
        this.search = this.getURLSearchParamObject();
        this.rowmetadata.push({ title: 'Premises Specific', name: 'PremiseSpecificInd', type: 'img' });
        this.queryParams.rowmetadata = this.rowmetadata;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.queryParams.search = this.search;
        this.closedTemplateSearchTable.loadTableData(this.queryParams);
    }
    public onSelect(event: any): void {
        let vntReturnData: any = event.row;
        let returnObj: any;
        returnObj = {
            'ClosedCalendarTemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
            'TemplateName': vntReturnData.TemplateName
        };
        if (this.pageParams.parentMode === 'LookUp-AllAccess' || this.pageParams.parentMode === 'LookUp-AllAccessCalendar') {
            returnObj = {
                'ClosedCalendarTemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
                'TemplateName': vntReturnData.TemplateName
            };

        }
        else if (this.pageParams.parentMode === 'LookUp-LookUp-AllAccessCalendarServiceCover') {
            returnObj = {
                'ClosedCalendarTemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
                'ClosedTemplateName': vntReturnData.TemplateName
            };

        }
        else if (this.pageParams.parentMode === 'LookUp-Combined') {
            returnObj = {
                'TemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
                'TemplateName': vntReturnData.TemplateName
            };

        }
        else if (this.pageParams.parentMode === 'LookUp-UpliftCalendarServiceCover') {
            returnObj = {
                'UpliftTemplateNumber': vntReturnData.ClosedCalendarTemplateNumber,
                'UpliftTemplateName': vntReturnData.TemplateName
            };

        }
        this.ellipsis.sendDataToParent(returnObj);
    }
    public tableDataLoaded(data: any): void {
        let tableRecords: Array<any> = data.tableData['records'];
        if (tableRecords.length === 0) {
            this.tableheading = 'No record found';
        }
    }

    public fetchTranslationContent(): void {
        this.getTranslatedValue('Contract API Maintenance', null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.tableheading = res;
                }
            });
        });
    }
    public tableRowClick(event: any): void {
        this.ellipsis.sendDataToParent(event.row);
    };
}
