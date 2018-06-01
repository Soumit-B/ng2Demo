import { Component, OnInit, OnChanges, OnDestroy, Input, EventEmitter, ViewChild, Output, Injector, AfterViewInit, ElementRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Logger } from '@nsalaun/ng2-logger';

import { Utils } from './../../../shared/services/utility';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { BatchProgramScheduleSearchComponent } from './../../../app/internal/search/riMBatchProgramScheduleSearch';
import { BaseComponent } from './../../../app/base/BaseComponent';
import { PageIdentifier } from './../../../app/base/PageIdentifier';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { MessageService } from './../../../shared/services/message.service';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Subscription } from 'rxjs/Subscription';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { RouteAwayComponent } from './../../../shared/components/route-away/route-away';
import { BatchProgramSearchComponent } from './../../../app/internal/search/iCABSMGBatchProgramSearch';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'riMBatchProgramScheduleMaintenance.html',
    providers: [MessageService],
    styles: [`
    .inValid {
        border: 1px solid #ff0000;
    }
    `]
})
export class BatchProgramScheduleMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public batchProgramScheduleSearchComponent: Component;
    public batchProgramSearchComponent: Component;
    public batchProgramScheduleSearchData: any = {};
    public pageId: string = '';
    public batchProgramMaintenanceFormGroup: FormGroup;
    public batchProgramScheduleAutoOpen: boolean = false;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;

    public isAddOrUpdateMode: boolean = false;
    public showMessageHeader: boolean = true;
    public isBatchProgramScheduleMaintenanceDisabled: boolean = false;
    public isBatchProgramScheduleMaintenanceDisabled1: boolean = true;

    public search: URLSearchParams = new URLSearchParams();
    public currentMode: string = 'FETCH';
    public postSearchParams: URLSearchParams = new URLSearchParams();
    public screenNotReadyComponent: Component;

    // Prompt Modal Model Properties
    public showPromptMessageHeader: boolean = true;
    public promptConfirmTitle: string;
    public promptConfirmContent: string;
    public uiElement = this.riExchange.riInputElement;
    public bpsUniqueNumber: number;
    public subLookupContract: Subscription;
    public addAndDeleteButtonVisibility: boolean = false;
    public saveAndCancelButtonVisibility: boolean = true;
    public saveAndCancelButtonDisabled: boolean = true;
    public deleteButtonDisabled: boolean = true;
    public currentData: any = {};

    public uiDisplay: any = {
        tab: {
            tab1: { visible: true, active: true },
            tab2: { visible: true, active: false }
        }
    };

    private isBatchNameAndUserCodeValid: Array<number> = [1, 1];
    private isDirtyCheckRequired: boolean = true;
    private formElement: any;

    public renderTab(tabindex: number): void {
        switch (tabindex) {
            case 1:
                this.uiDisplay.tab.tab1.active = true;
                this.uiDisplay.tab.tab2.active = false;

                break;
            case 2:
                this.uiDisplay.tab.tab1.active = false;
                this.uiDisplay.tab.tab2.active = true;

                break;

        }
    }

    public headerParams: any = {
        method: 'it-functions/ri-model',
        operation: 'Model/riMBatchProgramScheduleMaintenance',
        module: 'batch-process'
    };

    public programScheduleSearchParams: any = { // will be used later if same search screen will open in different mode else this will be deleted
        'parentMode': 'ProgramScheduleSearch',
        'screenMode': 'programname',
        'isAddNewHidden': false,
        'scheduleNumber': ''
    };

    public programSearchParams: any = {
        'parentMode': 'ProgramScheduleSearch',
        'isAddNewHidden': true,
        'scheduleNumber': ''
    };

    public controls = [
        { name: 'riBPSUniqueNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'riBPSNextDate', readonly: true, disabled: true, required: true, type: MntConst.eTypeDate },
        { name: 'riBPSNextTime', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riBatchProgramName', readonly: true, disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'riBatchProgramDescription', readonly: true, disabled: true, required: false, type: MntConst.eTypeTextFree },
        { name: 'riBPSUserCode', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'UserName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riBPSActive', readonly: true, disabled: true, required: false },
        { name: 'riBPSEmailOnlyIfFailed', readonly: true, disabled: true, required: false },
        { name: 'riLabel1', readonly: true, disabled: true, required: false },
        { name: 'riParam1', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel2', readonly: true, disabled: true, required: false },
        { name: 'riParam2', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel3', readonly: true, disabled: true, required: false },
        { name: 'riParam3', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel4', readonly: true, disabled: true, required: false },
        { name: 'riParam4', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel5', readonly: true, disabled: true, required: false },
        { name: 'riParam5', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel6', readonly: true, disabled: true, required: false },
        { name: 'riParam6', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel7', readonly: true, disabled: true, required: false },
        { name: 'riParam7', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel8', readonly: true, disabled: true, required: false },
        { name: 'riParam8', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel9', readonly: true, disabled: true, required: false },
        { name: 'riParam9', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel10', readonly: true, disabled: true, required: false },
        { name: 'riParam10', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel11', readonly: true, disabled: true, required: false },
        { name: 'riParam11', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riLabel12', readonly: true, disabled: true, required: false },
        { name: 'riParam12', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'riMinute00', readonly: true, disabled: true, required: true },
        { name: 'riMinute15', readonly: true, disabled: true, required: false },
        { name: 'riMinute30', readonly: true, disabled: true, required: false },
        { name: 'riMinute45', readonly: true, disabled: true, required: false },
        { name: 'riHour00', readonly: true, disabled: true, required: false },
        { name: 'riHour01', readonly: true, disabled: true, required: false },
        { name: 'riHour02', readonly: true, disabled: true, required: false },
        { name: 'riHour03', readonly: true, disabled: true, required: false },
        { name: 'riHour04', readonly: true, disabled: true, required: false },
        { name: 'riHour05', readonly: true, disabled: true, required: false },
        { name: 'riHour06', readonly: true, disabled: true, required: false },
        { name: 'riHour07', readonly: true, disabled: true, required: false },
        { name: 'riHour08', readonly: true, disabled: true, required: false },
        { name: 'riHour09', readonly: true, disabled: true, required: false },
        { name: 'riHour10', readonly: true, disabled: true, required: false },
        { name: 'riHour11', readonly: true, disabled: true, required: true },
        { name: 'riHour12', readonly: true, disabled: true, required: false },
        { name: 'riHour13', readonly: true, disabled: true, required: false },
        { name: 'riHour14', readonly: true, disabled: true, required: false },
        { name: 'riHour15', readonly: true, disabled: true, required: false },
        { name: 'riHour16', readonly: true, disabled: true, required: false },
        { name: 'riHour17', readonly: true, disabled: true, required: false },
        { name: 'riHour18', readonly: true, disabled: true, required: false },
        { name: 'riHour19', readonly: true, disabled: true, required: false },
        { name: 'riHour20', readonly: true, disabled: true, required: false },
        { name: 'riHour21', readonly: true, disabled: true, required: false },
        { name: 'riHour22', readonly: true, disabled: true, required: false },
        { name: 'riHour23', readonly: true, disabled: true, required: false },
        { name: 'riDay00', readonly: true, disabled: true, required: false },
        { name: 'riDay01', readonly: true, disabled: true, required: false },
        { name: 'riDay02', readonly: true, disabled: true, required: false },
        { name: 'riDay03', readonly: true, disabled: true, required: false },
        { name: 'riDay04', readonly: true, disabled: true, required: false },
        { name: 'riDay05', readonly: true, disabled: true, required: false },
        { name: 'riDay06', readonly: true, disabled: true, required: false },
        { name: 'riDay07', readonly: true, disabled: true, required: false },
        { name: 'riDay08', readonly: true, disabled: true, required: false },
        { name: 'riDay09', readonly: true, disabled: true, required: false },
        { name: 'riDay10', readonly: true, disabled: true, required: false },
        { name: 'riDay11', readonly: true, disabled: true, required: false },
        { name: 'riDay12', readonly: true, disabled: true, required: false },
        { name: 'riDay13', readonly: true, disabled: true, required: false },
        { name: 'riDay14', readonly: true, disabled: true, required: false },
        { name: 'riDay15', readonly: true, disabled: true, required: false },
        { name: 'riDay16', readonly: true, disabled: true, required: false },
        { name: 'riDay17', readonly: true, disabled: true, required: false },
        { name: 'riDay18', readonly: true, disabled: true, required: false },
        { name: 'riDay19', readonly: true, disabled: true, required: false },
        { name: 'riDay20', readonly: true, disabled: true, required: false },
        { name: 'riDay21', readonly: true, disabled: true, required: false },
        { name: 'riDay22', readonly: true, disabled: true, required: false },
        { name: 'riDay23', readonly: true, disabled: true, required: false },
        { name: 'riDay24', readonly: true, disabled: true, required: false },
        { name: 'riDay25', readonly: true, disabled: true, required: false },
        { name: 'riDay26', readonly: true, disabled: true, required: false },
        { name: 'riDay27', readonly: true, disabled: true, required: false },
        { name: 'riDay28', readonly: true, disabled: true, required: false },
        { name: 'riDay29', readonly: true, disabled: true, required: false },
        { name: 'riDay30', readonly: true, disabled: true, required: false },
        { name: 'riDay31', readonly: true, disabled: true, required: false },

        { name: 'riWeekDay01', readonly: true, disabled: true, required: false },
        { name: 'riWeekDay02', readonly: true, disabled: true, required: false },
        { name: 'riWeekDay03', readonly: true, disabled: true, required: false },
        { name: 'riWeekDay04', readonly: true, disabled: true, required: false },
        { name: 'riWeekDay05', readonly: true, disabled: true, required: false },
        { name: 'riWeekDay06', readonly: true, disabled: true, required: false },
        { name: 'riWeekDay07', readonly: true, disabled: true, required: false },

        { name: 'riMonth01', readonly: true, disabled: true, required: false },
        { name: 'riMonth02', readonly: true, disabled: true, required: false },
        { name: 'riMonth03', readonly: true, disabled: true, required: false },
        { name: 'riMonth04', readonly: true, disabled: true, required: false },
        { name: 'riMonth05', readonly: true, disabled: true, required: false },
        { name: 'riMonth06', readonly: true, disabled: true, required: false },
        { name: 'riMonth07', readonly: true, disabled: true, required: false },
        { name: 'riMonth08', readonly: true, disabled: true, required: false },
        { name: 'riMonth09', readonly: true, disabled: true, required: false },
        { name: 'riMonth10', readonly: true, disabled: true, required: false },
        { name: 'riMonth11', readonly: true, disabled: true, required: false },
        { name: 'riMonth12', readonly: true, disabled: true, required: false }
    ];

    public emptyFieldData: any = {
        'riBPSUniqueNumber': '',
        'riBPSNextDate': '',
        'riBPSNextTime': '',
        'riBatchProgramName': '',
        'riBPSUserCode': '',

        'riBPSActive': '',
        'riBPSEmailOnlyIfFailed': '',

        'riParam1': '',
        'riParam2': '',
        'riParam3': '',
        'riParam4': '',
        'riParam5': '',
        'riParam6': '',
        'riParam7': '',
        'riParam8': '',
        'riParam9': '',
        'riParam10': '',
        'riParam11': '',
        'riParam12': '',

        'riMinute00': '',
        'riMinute15': '',
        'riMinute30': '',
        'riMinute45': '',
        'riHour00': '',
        'riHour01': '',
        'riHour02': '',
        'riHour03': '',
        'riHour04': '',
        'riHour05': '',
        'riHour06': '',
        'riHour07': '',
        'riHour08': '',
        'riHour09': '',
        'riHour10': '',
        'riHour11': '',
        'riHour12': '',
        'riHour13': '',
        'riHour14': '',
        'riHour15': '',
        'riHour16': '',
        'riHour17': '',
        'riHour18': '',
        'riHour19': '',
        'riHour20': '',
        'riHour21': '',
        'riHour22': '',
        'riHour23': '',
        'riDay00': '',
        'riDay01': '',
        'riDay02': '',
        'riDay03': '',
        'riDay04': '',
        'riDay05': '',
        'riDay06': '',
        'riDay07': '',
        'riDay08': '',
        'riDay09': '',
        'riDay10': '',
        'riDay11': '',
        'riDay12': '',
        'riDay13': '',
        'riDay14': '',
        'riDay15': '',
        'riDay16': '',
        'riDay17': '',
        'riDay18': '',
        'riDay19': '',
        'riDay20': '',
        'riDay21': '',
        'riDay22': '',
        'riDay23': '',
        'riDay24': '',
        'riDay25': '',
        'riDay26': '',
        'riDay27': '',
        'riDay28': '',
        'riDay29': '',
        'riDay30': '',
        'riDay31': '',

        'riWeekDay01': '',
        'riWeekDay02': '',
        'riWeekDay03': '',
        'riWeekDay04': '',
        'riWeekDay05': '',
        'riWeekDay06': '',
        'riWeekDay07': '',

        'riMonth01': '',
        'riMonth02': '',
        'riMonth03': '',
        'riMonth04': '',
        'riMonth05': '',
        'riMonth06': '',
        'riMonth07': '',
        'riMonth08': '',
        'riMonth09': '',
        'riMonth10': '',
        'riMonth11': '',
        'riMonth12': ''

    };

    public crudOperations: any = {
        'add': 'ADD',
        'delete': 'DELETE',
        'update': 'UPDATE',
        'fetch': 'FETCH'
    };


    constructor(private injector: Injector, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.RIMBATCHPROGRAMSCHEDULEMAINTENANCE;
        this.pageTitle = 'Batch Program Schedule Selection';
        this.browserTitle = 'Batch Program Schedule Maintenance';

    }

    ngOnInit(): void {
        super.ngOnInit();
        this.uiForm = this.formBuilder.group({});
        //   this.localeTranslateService.setUpTranslation();
        this.batchProgramScheduleSearchComponent = BatchProgramScheduleSearchComponent;
        this.batchProgramSearchComponent = BatchProgramSearchComponent;
        this.screenNotReadyComponent = ScreenNotReadyComponent;
        this.riExchange.renderForm(this.uiForm, this.controls);
    }
    ngAfterViewInit(): void {
        this.batchProgramScheduleAutoOpen = true;
        this.formElement = this.el.nativeElement.querySelector('form');
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.uiElement = null;
    }
    public modalHidden(): void {
        this.batchProgramScheduleAutoOpen = false;
    }

    private onBatchProgramScheduleSearchDataReceived(data: any, route: any): void {
        try {

            this.currentData = data;
            // To rectify the issue of diffrent duplicate values riBPSEmailOnlyIfFailed coming from search screen
            if (data.riBPSEmailOnlyIfFailed === true) {
                data.riBPSEmailOnlyIfFailed = 'yes';
            } else if (data.riBPSEmailOnlyIfFailed === false) {
                data.riBPSEmailOnlyIfFailed = 'no';
            }
            this.batchProgramScheduleSearchData.riBPSUniqueNumber = data.riBPSUniqueNumber;
            this.uiElement.SetValue(this.uiForm, 'riBPSUniqueNumber', data.riBPSUniqueNumber);
            this.uiElement.SetValue(this.uiForm, 'riBPSNextDate', data.riBPSNextDate);
            this.uiElement.SetValue(this.uiForm, 'riBPSNextTime', this.formatNextRunTime(data.riBPSNextTime));
            this.uiElement.SetValue(this.uiForm, 'riBatchProgramName', data.riBatchProgramName);
            this.uiElement.SetValue(this.uiForm, 'riBatchProgramDescription', data.riBatchProgramDescription);
            this.uiElement.SetValue(this.uiForm, 'riBPSUserCode', data.riBPSUserCode);
            this.uiElement.SetValue(this.uiForm, 'UserName', data.UserName);
            this.uiElement.SetValue(this.uiForm, 'riBPSActive', data.riBPSActive === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riBPSEmailOnlyIfFailed', data.riBPSEmailOnlyIfFailed === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riLabel1', data.riLabel1);
            this.uiElement.SetValue(this.uiForm, 'riParam1', data.riParam1);
            this.uiElement.SetValue(this.uiForm, 'riLabel2', data.riLabel2);
            this.uiElement.SetValue(this.uiForm, 'riParam2', data.riParam2);
            this.uiElement.SetValue(this.uiForm, 'riLabel3', data.riLabel3);
            this.uiElement.SetValue(this.uiForm, 'riParam3', data.riParam3);
            this.uiElement.SetValue(this.uiForm, 'riLabel4', data.riLabel4);
            this.uiElement.SetValue(this.uiForm, 'riParam4', data.riParam4);
            this.uiElement.SetValue(this.uiForm, 'riLabel5', data.riLabel5);
            this.uiElement.SetValue(this.uiForm, 'riParam5', data.riParam5);
            this.uiElement.SetValue(this.uiForm, 'riLabel6', data.riLabel6);
            this.uiElement.SetValue(this.uiForm, 'riParam6', data.riParam6);
            this.uiElement.SetValue(this.uiForm, 'riLabel7', data.riLabel7);
            this.uiElement.SetValue(this.uiForm, 'riParam7', data.riParam7);
            this.uiElement.SetValue(this.uiForm, 'riLabel8', data.riLabel8);
            this.uiElement.SetValue(this.uiForm, 'riParam8', data.riParam8);
            this.uiElement.SetValue(this.uiForm, 'riLabel9', data.riLabel9);
            this.uiElement.SetValue(this.uiForm, 'riParam9', data.riParam9);
            this.uiElement.SetValue(this.uiForm, 'riLabel10', data.riLabel10);
            this.uiElement.SetValue(this.uiForm, 'riParam10', data.riParam10);
            this.uiElement.SetValue(this.uiForm, 'riLabel11', data.riLabel11);
            this.uiElement.SetValue(this.uiForm, 'riParam11', data.riParam11);
            this.uiElement.SetValue(this.uiForm, 'riLabel12', data.riLabel12);
            this.uiElement.SetValue(this.uiForm, 'riParam12', data.riParam12);

            this.uiElement.SetValue(this.uiForm, 'riMinute00', data.riMinute00 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMinute15', data.riMinute15 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMinute30', data.riMinute30 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMinute45', data.riMinute45 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour00', data.riHour00 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour01', data.riHour01 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour02', data.riHour02 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour03', data.riHour03 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour04', data.riHour04 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour05', data.riHour05 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour06', data.riHour06 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour07', data.riHour07 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour08', data.riHour08 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour09', data.riHour09 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour10', data.riHour10 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour11', data.riHour11 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour12', data.riHour12 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour13', data.riHour13 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour14', data.riHour14 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour15', data.riHour15 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour16', data.riHour16 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour17', data.riHour17 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour18', data.riHour18 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour19', data.riHour19 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour20', data.riHour20 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour21', data.riHour21 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour22', data.riHour22 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riHour23', data.riHour23 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay00', data.riDay00 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay01', data.riDay01 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay02', data.riDay02 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay03', data.riDay03 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay04', data.riDay04 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay05', data.riDay05 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay06', data.riDay06 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay07', data.riDay07 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay08', data.riDay08 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay09', data.riDay09 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay10', data.riDay10 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay11', data.riDay11 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay12', data.riDay12 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay13', data.riDay13 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay14', data.riDay14 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay15', data.riDay15 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay16', data.riDay16 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay17', data.riDay17 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay18', data.riDay18 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay19', data.riDay19 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay20', data.riDay20 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay21', data.riDay21 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay22', data.riDay22 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay23', data.riDay23 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay24', data.riDay24 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay25', data.riDay25 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay26', data.riDay26 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay27', data.riDay27 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay28', data.riDay28 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay29', data.riDay29 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay30', data.riDay30 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riDay31', data.riDay31 === 'yes');

            this.uiElement.SetValue(this.uiForm, 'riWeekDay01', data.riWeekDay01 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay02', data.riWeekDay02 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay03', data.riWeekDay03 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay04', data.riWeekDay04 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay05', data.riWeekDay05 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay06', data.riWeekDay06 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay07', data.riWeekDay07 === 'yes');

            this.uiElement.SetValue(this.uiForm, 'riMonth01', data.riMonth01 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth02', data.riMonth02 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth03', data.riMonth03 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth04', data.riMonth04 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth05', data.riMonth05 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth06', data.riMonth06 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth07', data.riMonth07 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth08', data.riMonth08 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth09', data.riMonth09 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth10', data.riMonth10 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth11', data.riMonth11 === 'yes');
            this.uiElement.SetValue(this.uiForm, 'riMonth12', data.riMonth12 === 'yes');
            this.fetchOtherDetails(data);
            if (data.setParentEditabelMode === 'UPDATE') {
                this.saveAndCancelButtonVisibility = true;
                this.addAndDeleteButtonVisibility = false;
                this.saveAndCancelButtonDisabled = false;
                this.deleteButtonDisabled = false;
                this.onUpdateClicked();
            }
            this.setFormMode(this.c_s_MODE_UPDATE);
        } catch (e) {
            console.log(e.message);
        }

    }

    public onAddClicked(): void {
        this.isAddOrUpdateMode = true;
        this.currentMode = this.crudOperations.add;
        this.isBatchProgramScheduleMaintenanceDisabled = true;
        this.uiElement.Disable(this.uiForm, 'riBPSUniqueNumber');
        this.isBatchProgramScheduleMaintenanceDisabled1 = false;
        this.setUIFieldsEditablity('Enable');
        this.onBatchProgramScheduleSearchDataReceived(this.emptyFieldData, null); // empty the UI fields
        this.saveAndCancelButtonVisibility = true;
        this.addAndDeleteButtonVisibility = false;
        this.setFormMode(this.c_s_MODE_ADD);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'riBatchProgramName', false);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'riBPSUserCode', false);
        this.saveAndCancelButtonDisabled = false;
        this.deleteButtonDisabled = true;
    }

    public onUpdateClicked(): void {
        this.isAddOrUpdateMode = true;
        this.currentMode = this.crudOperations.update;
        this.setUIFieldsEditablity('Enable');
        this.setFormMode(this.c_s_MODE_SELECT);
        this.saveAndCancelButtonDisabled = false;
        this.deleteButtonDisabled = false;

    }

    public onSaveClicked(): void {
        let programName = this.uiElement.GetValue(this.uiForm, 'riBatchProgramName');
        let userCode: string = this.uiElement.GetValue(this.uiForm, 'riBPSUserCode');
        let batchProgramNameUserCodeValidity: number = this.isBatchNameAndUserCodeValid[0] + this.isBatchNameAndUserCodeValid[1];

        if (programName === '' || userCode === '') {
            this.messageModal.show({ msg: MessageConstant.Message.programNameAndUserCodeRequired, title: 'Message' }, false);

            return;
        } else if (batchProgramNameUserCodeValidity < 2) {
            this.messageModal.show({ msg: MessageConstant.Message.validprogramNameAndUserCodeRequired, title: 'Message' }, false);
            return;
        }

        this.isAddOrUpdateMode = false;
        if (this.currentMode === this.crudOperations.update || this.currentMode === this.crudOperations.add) {

            this.saveAndDelete(this.currentMode);
        }
        this.isBatchProgramScheduleMaintenanceDisabled1 = true;
        this.saveAndCancelButtonDisabled = true;
        this.deleteButtonDisabled = true;
        this.addAndDeleteButtonVisibility = true;
        this.isBatchProgramScheduleMaintenanceDisabled = false;
        this.uiElement.Enable(this.uiForm, 'riBPSUniqueNumber');
        this.isBatchProgramScheduleMaintenanceDisabled1 = false;
        this.setFormMode(this.c_s_MODE_SELECT);
    }

    public onCancelClicked(): void {
        this.isAddOrUpdateMode = false;
        this.isBatchProgramScheduleMaintenanceDisabled = false;
        this.uiElement.Enable(this.uiForm, 'riBPSUniqueNumber');

        if (this.currentMode === this.crudOperations.update) {
            this.fetchAndUpdateBatchProgramData(this.crudOperations.fetch);
            this.getSelectedDataDetails(this.currentData);
        } else if (this.currentMode === this.crudOperations.add) {
            this.onBatchProgramScheduleSearchDataReceived(this.emptyFieldData, null); // empty the UI fields
            this.batchProgramScheduleAutoOpen = true;
        }
        this.addAndDeleteButtonVisibility = true;
        this.el.nativeElement.querySelector('#riBPSUserCode').classList.remove('ng-invalid');
        this.el.nativeElement.querySelector('#riBPSUserCode').classList.add('ng-valid');
        this.isBatchNameAndUserCodeValid = [1, 1];
        this.setFormMode(this.c_s_MODE_SELECT);
        this.isDirtyCheckRequired = false;
    }

    public onDeleteClicked(): void {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModal.show();
        this.isBatchProgramScheduleMaintenanceDisabled = false;
        this.uiElement.Enable(this.uiForm, 'riBPSUniqueNumber');
        this.isBatchProgramScheduleMaintenanceDisabled1 = true;
        this.setFormMode(this.c_s_MODE_SELECT);
    }
    // fetch and add uses get
    public fetchAndUpdateBatchProgramData(operation: string): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        if (operation === this.crudOperations.fetch) {
            this.search.set('riBPSUniqueNumber', this.batchProgramScheduleSearchData.riBPSUniqueNumber);

        } else if (operation === this.crudOperations.add) {
            this.search.set('Function', 'GetProgramParameterLabels');

            for (let i = 0; i < this.controls.length; i++) {
                this.search.set(this.controls[i].name, this.riExchange.riInputElement.GetValue(this.uiForm, this.controls[i].name));
            }
            this.search.set('riBatchProgramName', this.uiElement.GetValue(this.uiForm, 'riBatchProgramName'));

        }
        this.ajaxSource.next(AjaxConstant.START);

        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.search)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    if (operation === this.crudOperations.update) {
                        this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                    }
                    this.onBatchProgramScheduleSearchDataReceived(e, null);


                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);

            },
            (error) => {

                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }

    private setUIFieldsEditablity(editability: string): void {



        this.uiElement[editability](this.uiForm, 'riBatchProgramName');
        this.uiElement[editability](this.uiForm, 'riBPSUserCode');

        this.uiElement[editability](this.uiForm, 'riBPSActive');
        this.uiElement[editability](this.uiForm, 'riBPSEmailOnlyIfFailed');

        this.uiElement[editability](this.uiForm, 'riParam1');
        this.uiElement[editability](this.uiForm, 'riParam2');
        this.uiElement[editability](this.uiForm, 'riParam3');
        this.uiElement[editability](this.uiForm, 'riParam4');
        this.uiElement[editability](this.uiForm, 'riParam5');
        this.uiElement[editability](this.uiForm, 'riParam6');
        this.uiElement[editability](this.uiForm, 'riParam7');
        this.uiElement[editability](this.uiForm, 'riParam8');
        this.uiElement[editability](this.uiForm, 'riParam9');
        this.uiElement[editability](this.uiForm, 'riParam10');
        this.uiElement[editability](this.uiForm, 'riParam11');
        this.uiElement[editability](this.uiForm, 'riParam12');

        this.uiElement[editability](this.uiForm, 'riMinute00');
        this.uiElement[editability](this.uiForm, 'riMinute15');
        this.uiElement[editability](this.uiForm, 'riMinute30');
        this.uiElement[editability](this.uiForm, 'riMinute45');
        this.uiElement[editability](this.uiForm, 'riHour00');
        this.uiElement[editability](this.uiForm, 'riHour01');
        this.uiElement[editability](this.uiForm, 'riHour02');
        this.uiElement[editability](this.uiForm, 'riHour03');
        this.uiElement[editability](this.uiForm, 'riHour04');
        this.uiElement[editability](this.uiForm, 'riHour05');
        this.uiElement[editability](this.uiForm, 'riHour06');
        this.uiElement[editability](this.uiForm, 'riHour07');
        this.uiElement[editability](this.uiForm, 'riHour08');
        this.uiElement[editability](this.uiForm, 'riHour09');
        this.uiElement[editability](this.uiForm, 'riHour10');
        this.uiElement[editability](this.uiForm, 'riHour11');
        this.uiElement[editability](this.uiForm, 'riHour12');
        this.uiElement[editability](this.uiForm, 'riHour13');
        this.uiElement[editability](this.uiForm, 'riHour14');
        this.uiElement[editability](this.uiForm, 'riHour15');
        this.uiElement[editability](this.uiForm, 'riHour16');
        this.uiElement[editability](this.uiForm, 'riHour17');
        this.uiElement[editability](this.uiForm, 'riHour18');
        this.uiElement[editability](this.uiForm, 'riHour19');
        this.uiElement[editability](this.uiForm, 'riHour20');
        this.uiElement[editability](this.uiForm, 'riHour21');
        this.uiElement[editability](this.uiForm, 'riHour22');
        this.uiElement[editability](this.uiForm, 'riHour23');
        this.uiElement[editability](this.uiForm, 'riDay00');
        this.uiElement[editability](this.uiForm, 'riDay01');
        this.uiElement[editability](this.uiForm, 'riDay02');
        this.uiElement[editability](this.uiForm, 'riDay03');
        this.uiElement[editability](this.uiForm, 'riDay04');
        this.uiElement[editability](this.uiForm, 'riDay05');
        this.uiElement[editability](this.uiForm, 'riDay06');
        this.uiElement[editability](this.uiForm, 'riDay07');
        this.uiElement[editability](this.uiForm, 'riDay08');
        this.uiElement[editability](this.uiForm, 'riDay09');
        this.uiElement[editability](this.uiForm, 'riDay10');
        this.uiElement[editability](this.uiForm, 'riDay11');
        this.uiElement[editability](this.uiForm, 'riDay12');
        this.uiElement[editability](this.uiForm, 'riDay13');
        this.uiElement[editability](this.uiForm, 'riDay14');
        this.uiElement[editability](this.uiForm, 'riDay15');
        this.uiElement[editability](this.uiForm, 'riDay16');
        this.uiElement[editability](this.uiForm, 'riDay17');
        this.uiElement[editability](this.uiForm, 'riDay18');
        this.uiElement[editability](this.uiForm, 'riDay19');
        this.uiElement[editability](this.uiForm, 'riDay20');
        this.uiElement[editability](this.uiForm, 'riDay21');
        this.uiElement[editability](this.uiForm, 'riDay22');
        this.uiElement[editability](this.uiForm, 'riDay23');
        this.uiElement[editability](this.uiForm, 'riDay24');
        this.uiElement[editability](this.uiForm, 'riDay25');
        this.uiElement[editability](this.uiForm, 'riDay26');
        this.uiElement[editability](this.uiForm, 'riDay27');
        this.uiElement[editability](this.uiForm, 'riDay28');
        this.uiElement[editability](this.uiForm, 'riDay29');
        this.uiElement[editability](this.uiForm, 'riDay30');
        this.uiElement[editability](this.uiForm, 'riDay31');

        this.uiElement[editability](this.uiForm, 'riWeekDay01');
        this.uiElement[editability](this.uiForm, 'riWeekDay02');
        this.uiElement[editability](this.uiForm, 'riWeekDay03');
        this.uiElement[editability](this.uiForm, 'riWeekDay04');
        this.uiElement[editability](this.uiForm, 'riWeekDay05');
        this.uiElement[editability](this.uiForm, 'riWeekDay06');
        this.uiElement[editability](this.uiForm, 'riWeekDay07');

        this.uiElement[editability](this.uiForm, 'riMonth01');
        this.uiElement[editability](this.uiForm, 'riMonth02');
        this.uiElement[editability](this.uiForm, 'riMonth03');
        this.uiElement[editability](this.uiForm, 'riMonth04');
        this.uiElement[editability](this.uiForm, 'riMonth05');
        this.uiElement[editability](this.uiForm, 'riMonth06');
        this.uiElement[editability](this.uiForm, 'riMonth07');
        this.uiElement[editability](this.uiForm, 'riMonth08');
        this.uiElement[editability](this.uiForm, 'riMonth09');
        this.uiElement[editability](this.uiForm, 'riMonth10');
        this.uiElement[editability](this.uiForm, 'riMonth11');
        this.uiElement[editability](this.uiForm, 'riMonth12');
    }



    public saveAndDelete(mode: string): void {

        let _formData: Object = {};
        let _confirmMessage = '';



        if (mode === this.crudOperations.add) {
            this.postSearchParams.set(this.serviceConstants.Action, '1');
        } else if (mode === this.crudOperations.update) {
            this.postSearchParams.set(this.serviceConstants.Action, '2');
        }

        if (mode === this.crudOperations.add || mode === this.crudOperations.update) {
            let formControlData: string = '';
            for (let i = 0; i < this.controls.length; i++) {
                let controlName = this.controls[i].name;
                formControlData = this.uiElement.GetValue(this.uiForm, controlName);
                //
                if (controlName.search('Minute') > -1 || controlName.search('Hour') > -1 ||
                    controlName.search('Weekday') > -1 || controlName.search('Day') > -1 || controlName.search('Month') > -1) {
                    if (formControlData.toString().search('true') > -1) {
                        formControlData = 'yes';
                    } else {
                        formControlData = 'no';
                    }
                }
                //
                if (formControlData === undefined) {
                    formControlData = '';
                }
                _formData[this.controls[i].name] = formControlData;

            }
            _confirmMessage = MessageConstant.Message.SavedSuccessfully;
        }


        if (mode === this.crudOperations.delete) {
            this.postSearchParams.set(this.serviceConstants.Action, '3'); // for Delete
            _formData['riBPSUniqueNumber'] = this.uiElement.GetValue(this.uiForm, 'riBPSUniqueNumber');
            _confirmMessage = MessageConstant.Message.RecordDeleted;
            this.deleteButtonDisabled = true;
            this.setUIFieldsEditablity('Disable');
            this.isDirtyCheckRequired = false;
        }
        if (_formData['riBPSEmailOnlyIfFailed'] === true) {
            _formData['riBPSEmailOnlyIfFailed'] = 'yes';
        } else {
            _formData['riBPSEmailOnlyIfFailed'] = 'no';
        }

        if (_formData['riBPSActive'] === true) {
            _formData['riBPSActive'] = 'yes';
        } else {
            _formData['riBPSActive'] = 'no';
        }
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postSearchParams.set('content-type', 'application/x-www-form-urlencoded');


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, _formData)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        if (mode === this.crudOperations.add) {
                            this.uiElement.SetValue(this.uiForm, 'riBPSUniqueNumber', e.riBPSUniqueNumber);
                        }
                        this.messageModal.show({ msg: _confirmMessage, title: 'Message' }, false);
                        if (mode === this.crudOperations.add || mode === this.crudOperations.update) {
                            this.saveAndCancelButtonDisabled = false;
                            this.deleteButtonDisabled = false;
                        } else if (mode === this.crudOperations.delete) {
                            this.saveAndCancelButtonDisabled = true;
                            this.deleteButtonDisabled = true;
                        }
                        e['msg'] = _confirmMessage;
                        this.messageService.emitMessage(e);
                    }
                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onMessageClose(): void {
        return;
    }
    public promptConfirm(event: any): void {

        if (event) {
            if (this.promptConfirmContent === MessageConstant.Message.DeleteRecord) {
                this.currentMode = this.crudOperations.delete;
                this.saveAndDelete(this.currentMode);
                this.onBatchProgramScheduleSearchDataReceived(this.emptyFieldData, null); // empty the UI fields
            }
            else if (this.promptConfirmContent === MessageConstant.Message.ConfirmRecord) {
                this.onSaveClicked();
            }
        }
    }

    /// Lookup

    public fetchOtherDetails(batchProgramScheduleObject: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP_details = [{
            'table': 'riBatchProgram',
            'query': { 'riBatchProgramName': batchProgramScheduleObject.riBatchProgramName },
            'fields': ['riBatchProgramName', 'riBatchProgramDescription']
        },
        {
            'table': 'UserInformation',
            'query': { 'UserCode': batchProgramScheduleObject.riBPSUserCode },
            'fields': ['UserName']
        }
        ];

        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe((e) => {
            if (e && e.length > 0 && e[0].length > 0) {

                this.uiElement.SetValue(this.uiForm, 'riBatchProgramDescription', e[0][0].riBatchProgramDescription);
                this.uiElement.SetValue(this.uiForm, 'UserName', e[1][0].UserName);
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                this.errorService.emitError(error);

            });
    }

    public validateEnteredData(event: any): void {
        if (event.target.id === 'riBatchProgramName') {
            this.checkBatchProgramName(event.target.value);
        } else if (event.target.id === 'riBPSUserCode') {
            this.checkUserCode(event.target.value);
        }

    }

    private checkBatchProgramName(batchProgramName: string): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP_details = [{
            'table': 'riBatchProgram',
            'query': { 'riBatchProgramName': batchProgramName },
            'fields': ['riBatchProgramName', 'riBatchProgramDescription']
        }
        ];

        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe((e) => {
            if (e && e.length > 0 && e[0].length > 0) {

                // this.uiElement.SetValue(this.uiForm, 'riBatchProgramDescription', e[0][0].riBatchProgramDescription);
                this.getProgramNameDetails(batchProgramName);
                this.isBatchNameAndUserCodeValid[0] = 1;
            } else {
                this.isBatchNameAndUserCodeValid[0] = 0;
                this.messageModal.show({ msg: MessageConstant.Message.noRecordFound, title: 'Message' }, false);
                this.riExchange.riInputElement.markAsError(this.uiForm, 'riBatchProgramName');
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                this.errorService.emitError(error);
                //  this.el.nativeElement.querySelector('#riBatchProgramName').classList.add('inValid');


            });
    }

    private checkUserCode(userCode: string): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP_details = [
            {
                'table': 'UserInformation',
                'query': { 'UserCode': userCode },
                'fields': ['UserName']
            }
        ];

        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe((e) => {
            if (e && e.length > 0 && e[0].length > 0) {
                this.uiElement.SetValue(this.uiForm, 'UserName', e[0][0].UserName);
                this.el.nativeElement.querySelector('#riBPSUserCode').classList.remove('ng-invalid');
                this.el.nativeElement.querySelector('#riBPSUserCode').classList.add('ng-valid');
                this.isBatchNameAndUserCodeValid[1] = 1;
            } else {
                this.el.nativeElement.querySelector('#riBPSUserCode').classList.add('ng-invalid');
                this.el.nativeElement.querySelector('#riBPSUserCode').classList.remove('ng-valid');
                this.isBatchNameAndUserCodeValid[1] = 0;
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);

                this.errorService.emitError(error);

            });
    }

    public onSaveButtonClicked(): void {
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptConfirmModal.show();
    }

    public onScheduleNoSelectFromEllipsis(data: any, route: any): void {
        this.el.nativeElement.querySelector('#riBPSUniqueNumber').classList.remove('ng-invalid');
        if (data.addMode !== null && data.addMode === true) {
            this.onAddClicked();
            return;
        }
        this.getSelectedDataDetails(data, true);
    }

    public onProgramSelectFromEllipsis(data: any, route: any): void {
        this.uiElement.SetValue(this.uiForm, 'riBatchProgramName', data.riBatchProgramName);
        this.getProgramNameDetails(data.riBatchProgramName);
    }



    private getSelectedDataDetails(data: any, isUpdateMode?: boolean): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');

        this.search.set('riBPSUniqueNumber', data.riBPSUniqueNumber);
        this.isBatchProgramScheduleMaintenanceDisabled1 = false;

        this.ajaxSource.next(AjaxConstant.START);

        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.search)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    e.riBPSUniqueNumber = data.riBPSUniqueNumber;
                    if (isUpdateMode === true) {
                        e.setParentEditabelMode = this.crudOperations.update;
                    }
                    e.riBPSEmailOnlyIfFailed = data.riBPSEmailOnlyIfFailed;
                    e.riBPSActive = data.riBPSActive;
                    this.onBatchProgramScheduleSearchDataReceived(e, null);

                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);

            },
            (error) => {

                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }

    ////When tabbing out from program name
    private getProgramNameDetails(programName: string): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('Function', 'GetProgramParameterLabels');
        this.search.set('riBatchProgramName', programName);


        this.ajaxSource.next(AjaxConstant.START);

        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.search)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {

                    this.populateLabelsAndDescription(e);

                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);

            },
            (error) => {

                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });

    }

    private populateLabelsAndDescription(data: any): void {
        this.uiElement.SetValue(this.uiForm, 'riBatchProgramDescription', data.riBatchProgramDescription);
        this.uiElement.SetValue(this.uiForm, 'riLabel1', data.riLabel1);
        this.uiElement.SetValue(this.uiForm, 'riLabel2', data.riLabel2);
        this.uiElement.SetValue(this.uiForm, 'riLabel3', data.riLabel3);
        this.uiElement.SetValue(this.uiForm, 'riLabel4', data.riLabel4);
        this.uiElement.SetValue(this.uiForm, 'riLabel5', data.riLabel5);
        this.uiElement.SetValue(this.uiForm, 'riLabel6', data.riLabel6);
        this.uiElement.SetValue(this.uiForm, 'riLabel7', data.riLabel7);
        this.uiElement.SetValue(this.uiForm, 'riLabel8', data.riLabel8);
        this.uiElement.SetValue(this.uiForm, 'riLabel9', data.riLabel9);
        this.uiElement.SetValue(this.uiForm, 'riLabel10', data.riLabel10);
        this.uiElement.SetValue(this.uiForm, 'riLabel11', data.riLabel11);
        this.uiElement.SetValue(this.uiForm, 'riLabel12', data.riLabel12);
    }

    private formatNextRunTime(rawData: string): string {
        let formattedNextRunTime: string = '';
        if (rawData === '') {
            return formattedNextRunTime;
        }
        let sec = parseInt(rawData, 10);
        let hr = sec / 3600;
        hr = parseInt(hr.toString(), 10);
        let min = (sec / 60) % 60;
        formattedNextRunTime = hr + ':' + min;
        return formattedNextRunTime;
    }

    public tabOut(): void {
        this.renderTab(2);
        setTimeout(() => { this.el.nativeElement.querySelector('[formControlName=riMinute00]').focus(); }, 200);
    }

    public tabOutfromUniqueNumber(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        let riBPSUniqueNumber: string = this.uiElement.GetValue(this.uiForm, 'riBPSUniqueNumber');
        if (riBPSUniqueNumber === '') {
            this.onBatchProgramScheduleSearchDataReceived(this.emptyFieldData, null);
            this.setUIFieldsEditablity('Disable');
            this.isBatchProgramScheduleMaintenanceDisabled1 = true;
            this.saveAndCancelButtonDisabled = true;
            this.deleteButtonDisabled = true;
            return;
        }
        this.search.set('riBPSUniqueNumber', riBPSUniqueNumber);
        this.isBatchProgramScheduleMaintenanceDisabled1 = false;

        this.ajaxSource.next(AjaxConstant.START);

        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.search)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.el.nativeElement.querySelector('#riBPSUniqueNumber').classList.add('ng-invalid');
                    this.messageModal.show(e, true);
                    this.errorService.emitError(e);
                    this.onBatchProgramScheduleSearchDataReceived(this.emptyFieldData, null);
                    this.setUIFieldsEditablity('Disable');
                    this.isBatchProgramScheduleMaintenanceDisabled1 = true;
                    this.saveAndCancelButtonDisabled = true;
                    this.deleteButtonDisabled = true;
                } else if (e.fullError) {
                    this.el.nativeElement.querySelector('#riBPSUniqueNumber').classList.add('ng-invalid');
                    this.onBatchProgramScheduleSearchDataReceived(this.emptyFieldData, null);
                    this.setUIFieldsEditablity('Disable');
                    this.isBatchProgramScheduleMaintenanceDisabled1 = true;
                    this.saveAndCancelButtonDisabled = true;
                    this.deleteButtonDisabled = true;
                } else {
                    this.el.nativeElement.querySelector('#riBPSUniqueNumber').classList.remove('ng-invalid');
                    let data: any = {};
                    data.riBPSUniqueNumber = riBPSUniqueNumber;
                    data.riBPSEmailOnlyIfFailed = e.riBPSEMailOnlyIfFailed;
                    data.riBatchProgramName = e.riBatchProgramName;
                    data.riBPSActive = e.riBPSActive;
                    this.getSelectedDataDetails(data, true);

                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);

            },
            (error) => {

                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }
    public canDeactivate(): Observable<boolean> {
        if (this.isDirtyCheckRequired === true) {
            this.routeAwayGlobals.setDirtyFlag(this.formElement.classList.contains('ng-dirty')); //CR implementation
        } else {
            this.routeAwayGlobals.setDirtyFlag(false);
        }
        return this.routeAwayComponent.canDeactivate();
    }

}

