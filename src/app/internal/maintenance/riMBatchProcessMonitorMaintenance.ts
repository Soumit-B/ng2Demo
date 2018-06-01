import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { LocalStorageService } from 'ng2-webstorage';
import { Subscription } from 'rxjs/Subscription';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { TableComponent } from './../../../shared/components/table/table';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MntConst } from './../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'riMBatchProcessMonitorMaintenance.html'

})
export class MBatchProcessMonitorMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('monitorTable') monitorTable: TableComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('BatchProcessTypeCode') BatchProcessTypeCode;
    public queryParams1: any = {
        operation: 'Model/riMBatchProcessMonitorMaintenance',
        module: 'batch-process',
        method: 'it-functions/ri-model'
    };

    public pageId: string = '';
    public UserCode: string = '';
    public isAccess: boolean = true;

    public itemsPerPage: number = 10;
    public page: number = 1;
    public totalItem: number = 11;

    public currentPage: number = 1;
    public BatchProcessTypeCodeSaved: string;
    public BatchProcessTypDescSaved: string;

    public maxColumn: number = 8;
    public search = new URLSearchParams();
    public DateTo: Date = new Date();
    public DateFrom: Date = new Date();
    private lookUpSubscription: Subscription;

    public warn: string;
    public riDeveloper: boolean = false;

    public modalsh: boolean = false;

    public showMessageHeader: boolean = true;
    public promptTitle: string = 'Confirm Record?';
    public promptContent: string = '';
    //public showSave: boolean = false;
    public tabEnable: boolean = false;

    public columns: Array<any> = [
        { title: 'Parameter Name', name: 'BatchProcessParameterName', sort: 'asc' },
        { title: 'Parameter Value', name: 'BatchProcessParameterValue' }
    ];

    public uiDisplay = {
        tab: {
            tab1: { visible: true, active: true },
            tab2: { visible: false, active: false },
            tab3: { visible: false, active: false }
        }
    };

    public controls = [
        { name: 'BatchProcessUniqueNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'BatchProcessUserCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'BatchProcessSubmittedDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'BatchProcessSubmittedTime', disabled: true, type: MntConst.eTypeTime },
        { name: 'BatchProcessDescription', disabled: true },
        { name: 'BatchProcessProgramName', disabled: true },
        { name: 'BatchProcessTypeCode', type: MntConst.eTypeInteger },
        { name: 'BatchProcessTypeDisplayDesc', disabled: true },
        { name: 'BatchProcessFailureReason', disabled: true },
        { name: 'BatchProcessScheduleStartDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'BatchProcessScheduleStartTime', disabled: true, type: MntConst.eTypeTime },
        { name: 'BatchProcessActualStartDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'BatchProcessActualStartTime', disabled: true, type: MntConst.eTypeTime },
        { name: 'BatchProcessActualEndDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'BatchProcessActualEndTime', disabled: true, type: MntConst.eTypeTime },
        { name: 'BatchProcessLog', disabled: true }
    ];

    constructor(injector: Injector, private _ls: LocalStorageService) {
        super(injector);
        this.pageId = PageIdentifier.RIMBATCHPROCESSMONITORMAINTENANCE;
        this.browserTitle = 'Batch Process Monitor Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.showBackLabel = true;
    }

    ngAfterViewInit(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessUniqueNumber', this.riExchange.getParentHTMLValue('BatchProcessUniqueNumber'));
        this.BatchProcessTypeCode.nativeElement.focus();
        this.UserCode = this._ls.retrieve('RIUserCode');
        this.getRiDeveloperAccess();
    }

    public mathodCall(): void {
        this.renderTab(1);
        this.fetchRecord();
        this.fetchGrid();
        this.fetchLog();
        if ((this.UserCode && this.UserCode.toUpperCase() === 'CIT')
            || this.riDeveloper) {
            this.isAccess = false;
        }

    }

    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public fetchTypeDecs(): void {
        let lookupIP = [
            {
                'table': 'BatchProcessTypeLanguage',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'BatchProcessTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessTypeCode', MntConst.eTypeInteger)
                },
                'fields': ['BatchProcessTypeDisplayDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Business = data[0][0];
            if (Business) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessTypeDisplayDesc', Business.BatchProcessTypeDisplayDesc);
                if (this.modalsh) {
                    this.warn = '';
                    this.promptModal.show();
                } else {
                    this.BatchProcessTypDescSaved = Business.BatchProcessTypeDisplayDesc;
                }
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessTypeDisplayDesc', '');
                this.warn = 'mandatoryBatch';
            }
        });
    }

    public promptSave(event: any): void {
        this.updateProcess();
    }

    private fetchRecord(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        query.set('BatchProcessUniqueNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUniqueNumber', MntConst.eTypeInteger));
        query.set('Mode', 'BatchProcess');
        this.httpService.makeGetRequest(this.queryParams1.method, this.queryParams1.module,
            this.queryParams1.operation, query)
            .subscribe(
            (data) => {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessUserCode', data.BatchProcessUserCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessSubmittedDate', this.utils.formatDate(data.BatchProcessSubmittedDate));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessSubmittedTime', this.utils.secondsToHms(data.BatchProcessSubmittedTime));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessDescription', data.BatchProcessDescription);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessProgramName', data.BatchProcessProgramName);
                this.BatchProcessTypeCodeSaved = data.BatchProcessTypeCode;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessTypeCode', data.BatchProcessTypeCode);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessFailureReason', data.BatchProcessFailureReason);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessScheduleStartDate', this.utils.formatDate(data.BatchProcessScheduleStartDate));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessScheduleStartTime', this.utils.secondsToHms(data.BatchProcessScheduleStartTime));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessActualStartDate', this.utils.formatDate(data.BatchProcessActualStartDate));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessActualStartTime', this.utils.secondsToHms(data.BatchProcessActualStartTime));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessActualEndDate', this.utils.formatDate(data.BatchProcessActualEndDate));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessActualEndTime', this.utils.secondsToHms(data.BatchProcessActualEndTime));
                this.fetchTypeDecs();
            }
            );
    }

    private fetchGrid(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        query.set('BUFFERLIST', 'BatchProcessParameter');
        query.set('BatchProcessUniqueNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUniqueNumber', MntConst.eTypeInteger));
        query.set('FIRSTROWID', '');
        query.set('LASTROWID', '');
        query.set('NUMROWS', '8');

        this.queryParams1.search = query;
        this.monitorTable.loadTableData(this.queryParams1);
    }

    public renderTab(tabindex: number): void {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = false;
                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;
                this.uiDisplay.tab.tab3.active = false;
                break;
            case 3:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = false;
                this.uiDisplay.tab.tab3.active = true;
                break;
        }
    }

    private fetchLog(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        query.set('Function', 'GetLogFile');
        query.set('BatchProcessUniqueNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUniqueNumber', MntConst.eTypeInteger));
        this.httpService.makeGetRequest(this.queryParams1.method, this.queryParams1.module,
            this.queryParams1.operation, query)
            .subscribe(
            (data) => {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessLog', data.LogText);
            });
    }

    public updateChanges(): void {
        this.modalsh = true;
        this.fetchTypeDecs();
    }

    public cancelChanges(): void {
        this.warn = '';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessTypeCode', this.BatchProcessTypeCodeSaved);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BatchProcessTypeDisplayDesc', this.BatchProcessTypDescSaved);
        //this.fetchTypeDecs();
    }

    private updateProcess(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '2');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());

        let _formData: Object = {};
        _formData['BatchProcessUserCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUserCode', MntConst.eTypeCode);
        _formData['BatchProcessTypeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessTypeCode', MntConst.eTypeInteger);
        _formData['BatchProcessDescription'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessDescription');
        _formData['BatchProcessProgramName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessProgramName');
        _formData['BatchProcessFailureReason'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessFailureReason');
        _formData['BatchProcessScheduleStartDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessScheduleStartDate', MntConst.eTypeDate);
        _formData['BatchProcessActualStartDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessActualStartDate', MntConst.eTypeDate);
        _formData['BatchProcessActualEndDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessActualEndDate', MntConst.eTypeDate);
        _formData['ROWID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ROWID');
        _formData['BatchProcessUniqueNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessUniqueNumber', MntConst.eTypeInteger);

        this.httpService.makePostRequest(this.queryParams1.method, this.queryParams1.module,
            this.queryParams1.operation, query, _formData).subscribe(
            (data) => {
                this.BatchProcessTypeCodeSaved = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessTypeCode', MntConst.eTypeInteger);
                this.BatchProcessTypDescSaved = this.riExchange.riInputElement.GetValue(this.uiForm, 'BatchProcessTypeDisplayDesc');
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
            });;
    }

    public getRiDeveloperAccess(): void {
        let lookupIP = [
            {
                'table': 'UserInformation',
                'query': {
                    'UserCode': this.UserCode
                },
                'fields': ['riDeveloper']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let userData = data[0][0];
            if (userData) {
                this.riDeveloper = userData.riDeveloper;
                this.mathodCall();
            }
        });
    }

    public selectedData(data: any): void {
        //TODO
        this.logger.log('Data', data);
    }
}
