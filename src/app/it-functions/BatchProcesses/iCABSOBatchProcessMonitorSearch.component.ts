import { ErrorService } from './../../../shared/services/error.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TableComponent } from './../../../shared/components/table/table';
import { Utils } from './../../../shared/services/utility';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs/Subscription';
import { Logger } from '@nsalaun/ng2-logger';

@Component({
    templateUrl: 'iCABSOBatchProcessMonitorSearch.html'
})
export class BatchProcessMonitorComponent implements OnInit {
    @ViewChild('batchProcessMonitorTable') batchProcessMonitorTable: TableComponent;
    @ViewChild('messageModal') public messageModal;
    public showErrorHeader = true;
    public showMessageHeader = true;
    public promptTitle: string = '';
    public promptContent: string = '';
    public businessCode: string;
    public countryCode: string;
    public page: string = '1';
    public itemsPerPage: string = '10';
    public tableheading: string = 'Batch Process Monitor Search';
    public translateSubscription: Subscription;
    constructor(
        private serviceConstants: ServiceConstants,
        private httpService: HttpService,
        private utils: Utils,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private logger: Logger,
        private errorService: ErrorService,
        private localeTranslateService: LocaleTranslationService) {
    }
    //config form view data
    public uiForm: FormGroup;
    public columns: Array<any> = [
        { title: 'Unique Number', name: 'BatchProcessUniqueNumber' },
        { title: 'User Code', name: 'BatchProcessUserCode' },
        { title: 'Submitted Date', name: 'BatchProcessSubmittedDate' },
        { title: 'Submitted Time', name: 'BatchProcessSubmittedTime' },
        { title: 'Description', name: 'BatchProcessDescription' }
    ];
    public queryParams: any = {
        operation: 'Operations/iCABSOBatchProcessMonitorSearch',
        module: 'batch-process',
        method: 'it-functions/ri-model'
    };
    public search = new URLSearchParams();
    ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.businessCode = this.utils.getBusinessCode();
        this.countryCode = this.utils.getCountryCode();
        this.uiForm = this.formBuilder.group({
            BatchProcessUserCode: [{ value: '', disabled: false }],
            BatchProcessTypeCode: [{ value: '2', disabled: false }]
        });
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
                if (this.translateSubscription) {
                    this.translateSubscription.unsubscribe();
                }
            }
        });
        this.buildTable();
    }
    public fetchTranslationContent(): void {
        this.getTranslatedValue(this.tableheading, null).subscribe((res: string) => {
            if (res) {
                this.tableheading = res;
            }
        });
    }
    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }
    public buildTable(): void {
        this.localeTranslateService.setUpTranslation();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.search.set(this.serviceConstants.CountryCode, this.countryCode);

        //set parameters
        if (this.uiForm.controls['BatchProcessUserCode'].value)
            this.search.set('BatchProcessUserCode', this.uiForm.controls['BatchProcessUserCode'].value);
        else {
            this.search.set('BatchProcessUserCode', '');
        }
        this.search.set('BatchProcessTypeCode', this.uiForm.controls['BatchProcessTypeCode'].value);
        this.queryParams.search = this.search;
        this.batchProcessMonitorTable.loadTableData(this.queryParams);
    }
    public onSelect(event: any): void {
        //to do--need to navigate to 'iCABSOBatchProcessMonitorMaintenance.htm' page once it is available
        //window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Operations/iCABSOBatchProcessMonitorMaintenance.htm"
    }
    public tableDataLoaded(data: any): void {
        if (data.tableData['records']) {
            let tableRecords: Array<any> = data.tableData['records'];
            if (tableRecords.length === 0) {
                this.tableheading = MessageConstant.Message.noRecordFound;
            }
        }
        else if (data.tableData['error']) {
            this.messageModal.show({ msg: data.tableData['error'], title: 'Message' }, false);
        }
    }
    public getCurrentPage(currentPage: string): void {
        this.page = currentPage;
    }

    public refresh(): void {
        this.buildTable();
    }

    public promptSave(event: any ): any {
        this.logger.log(event);
    }
}
