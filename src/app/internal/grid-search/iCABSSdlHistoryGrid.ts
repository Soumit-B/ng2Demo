import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';

@Component({
    templateUrl: 'iCABSSdlHistoryGrid.html'
})
export class DLHistoryGridComponent extends BaseComponent implements OnInit {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;

    public inputParams: any = {};
    public pageId: string = '';
    public pageTitle: string = '';
    public pageSize: number = 10;
    public totalRecords: number;
    public curPage: number = 1;
    public maxColumn: number = 10;
    public showMessageHeader: boolean = true;

    public controls: any[] = [
        { name: 'dlContractRef', disabled: true },
        { name: 'ContractName', disabled: true },
        { name: 'ContractTypeCode', disabled: true }
    ];

    public queryParams = {
        method: 'prospect-to-contract/maintenance',
        action: '2',
        module: 'advantage',
        operation: 'Sales/iCABSSdlHistoryGrid'
    };

    public historyModel: any = {
        'dlContractRef': '',
        'ContractName': '',
        'ContractTypeCode': ''
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSDLHISTORYGRID;
        this.pageTitle = 'Advantage Quote History';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    private showAlert(msgTxt: string): void {
        this.messageModal.show({ msg: msgTxt, title: 'Message' }, false);
    }

    private windowOnload(): void {
        this.getParentFields();
        this.riGrid.FunctionPaging = false;
        this.riGrid.HighlightBar = true;
        this.riGrid.PageSize = 10;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.buildGrid();
        this.riGrid_BeforeExecute();
    }

    public getParentFields(): void {
        this.historyModel.dlBatchRef = this.getNodeValue(this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.historyModel.dlContractRef = this.getNodeValue(this.riExchange.getParentHTMLValue('dlContractRef'));
        this.historyModel.ContractTypeCode = this.getNodeValue(this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.historyModel.SubSystem = this.getNodeValue(this.riExchange.getParentHTMLValue('SubSystem'));
        if (this.parentMode === 'SOQuote') {
            this.historyModel.ContractName = this.getNodeValue(this.riExchange.getParentHTMLValue('ProspectName'));
        }
        else if (this.parentMode === 'Approval') {
            this.historyModel.ContractName = this.getNodeValue(this.riExchange.getParentHTMLValue('ContractName'));
        }

        this.setControlValue('dlContractRef', this.historyModel.dlContractRef);
        this.setControlValue('ContractName', this.historyModel.ContractName);
        this.setControlValue('ContractTypeCode', this.historyModel.ContractTypeCode);
    }
    private getNodeValue(value: any): void {
        return (value) ? value : '';
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('HistoryNumber', 'dlHistory', 'HistoryNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('dlStatusDesc', 'dlHistory', 'dlStatusDesc', MntConst.eTypeTextFree, 20);
        this.riGrid.AddColumn('EffectiveDate', 'dlHistory', 'EffectiveDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ProcessedDate', 'dlHistory', 'ProcessedDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('UserCode', 'dlHistory', 'UserCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumn('AnnualValue', 'dlHistory', 'AnnualValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumn('dlRejectionDesc', 'dlHistory', 'dlRejectionDesc', MntConst.eTypeTextFree, 12);
        this.riGrid.AddColumn('LostBusinessDesc', 'dlHistory', 'LostBusinessDesc', MntConst.eTypeTextFree, 12);
        this.riGrid.AddColumn('LostBusinessDetailDesc', 'dlHistory', 'LostBusinessDetailDesc', MntConst.eTypeTextFree, 12);
        this.riGrid.AddColumn('Info', 'dlHistory', 'Info', MntConst.eTypeImage, 1);

        this.riGrid.AddColumnAlign('HistoryNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('EffectiveDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ProcessedDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('HistoryNumber', true);

        this.riGrid.Complete();
    }

    public riGrid_BeforeExecute(): void {
        let search: URLSearchParams = this.getURLSearchParamObject(), sortOrder: any = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set(this.serviceConstants.Action, this.queryParams.action);
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, '1246498');
        search.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        search.set(this.serviceConstants.GridPageCurrent, this.curPage.toString());
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('riCacheRefresh', 'True');

        search.set('dlBatchRef', this.historyModel.dlBatchRef);
        search.set('dlContractRef', this.getControlValue('dlContractRef'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.messageModal.show(data, true);
                } else {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.Execute(data);
                }

            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getCurrentPage(data: any): void {
        this.curPage = data.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }
    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_BodyOnDblClick(ev: Event): void {
        //todo
    }

    public riGrid_BodyOnClick(ev: Event): void {
        this.dlHistoryFocus(ev.srcElement);
    }

    public riGrid_BodyOnKeyDown(ev: Event): void {
        this.dlHistoryFocus(ev);
    }

    public dlHistoryFocus(data: any): void {
        let msg: string = this.riGrid.Details.GetAttribute('Info', 'AdditionalProperty');
        if (msg) {
            this.showAlert(msg);
        } else {
            this.showAlert(MessageConstant.Message.noSpecialInstructions);
        }
    }
}
