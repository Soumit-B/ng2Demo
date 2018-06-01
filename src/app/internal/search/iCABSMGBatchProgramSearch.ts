import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
import { MessageService } from '../../../shared/services/message.service';
@Component({
    templateUrl: 'iCABSMGBatchProgramSearch.html'
})
export class BatchProgramSearchComponent implements OnInit {
    @ViewChild('batchProgramSearchTable') batchProgramSearchTable: TableComponent;
    public selectedrowdata: any;
    public method: string = 'it-functions/ri-model';
    public module: string = 'batch-process';
    public operation: string = 'Model/riMGBatchProgramSearch';
    public search: URLSearchParams = new URLSearchParams();
    public itemsPerPage: number = 16;
    public page: number = 1;
    public totalItem: number = 11;
    public inputParams: any;
    public columns: Array<any> = [
        { title: 'Program Name', name: 'riBatchProgramName', sort: 'ASC' },
        { title: 'Description', name: 'riBatchProgramDescription' }
    ];
    public rowmetadata: Array<any> = new Array();
    private routeParams: any;
    private sub: Subscription;
    public translateSubscription: Subscription;
    public isAddNewHidden: boolean = true;
    public isAddNewDisabled: boolean = false;
    constructor(
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private router: Router,
        private localeTranslateService: LocaleTranslationService,
        private route: ActivatedRoute,
        private utils: Utils,
        private translate: TranslateService,
        private logger: Logger,
        private messageService: MessageService
    ) { }
    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.inputParams = {
            'parentMode': 'LookUp'
        };
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
    }
    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }
    public fetchTranslationContent(): void {
        for (let i = 0; i < this.columns.length; i++) {
            this.localeTranslateService.getTranslatedValue(this.columns[i].title, null).subscribe((res: string) => {
                if (res) {
                    this.columns[i].title = res;
                }
            });
        }
    }
    public selectedData(event: any): void {
        let returnObj: any;
        if (this.inputParams.parentMode === 'LookUp') {
            returnObj = {
                'riBatchProgramName': event.row.riBatchProgramName,
                'riBatchProgramDescription': event.row.riBatchProgramDescription,
                'riBatchProgramParam1Label': event.row.riBatchProgramParam1Label,
                'riBatchProgramParam2label': event.row.riBatchProgramParam2label,
                'riBatchProgramParam3Label': event.row.riBatchProgramParam3Label,
                'riBatchProgramParam4Label': event.row.riBatchProgramParam4Label,
                'riBatchProgramParam5Label': event.row.riBatchProgramParam5Label,
                'riBatchProgramParam6Label': event.row.riBatchProgramParam6Label,
                'riBatchProgramParam7Label': event.row.riBatchProgramParam7Label,
                'riBatchProgramParam8Label': event.row.riBatchProgramParam8Label,
                'riBatchProgramParam9Label': event.row.riBatchProgramParam9Label,
                'riBatchProgramParam10Label': event.row.riBatchProgramParam10Label,
                'riBatchProgramParam11Label': event.row.riBatchProgramParam11Label,
                'riBatchProgramParam12Label': event.row.riBatchProgramParam12Label,
                'riBatchProgramReport': event.row.riBatchProgramReport,
                'recordID': event.row.RecordID
            };

        }
        else {
            returnObj = {
                'riBatchProgramName': event.row.riBatchProgramName,
                'riBatchProgramDescription': event.row.riBatchProgramDescription
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    }

    public updateView(params: any): void {
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        if (params.isAddNewHidden !== null) {
            this.isAddNewHidden = params.isAddNewHidden;
        }
        this.batchProgramSearchTable.loadTableData(this.inputParams);
    }
    public refresh(): void {
        this.batchProgramSearchTable.loadTableData(this.inputParams);
    }

    public onAddNew(): void {
        this.messageService.emitMessage({
            updateMode: false,
            addMode: true,
            searchMode: false
        });
        this.ellipsis.closeModal();
    }
}
