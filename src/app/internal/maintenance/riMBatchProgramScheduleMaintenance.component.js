var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { URLSearchParams } from '@angular/http';
import { Component, ViewChild, Injector, ElementRef } from '@angular/core';
import { BatchProgramScheduleSearchComponent } from './../../../app/internal/search/riMBatchProgramScheduleSearch';
import { BaseComponent } from './../../../app/base/BaseComponent';
import { PageIdentifier } from './../../../app/base/PageIdentifier';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { MessageService } from './../../../shared/services/message.service';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
export var BatchProgramScheduleMaintenanceComponent = (function (_super) {
    __extends(BatchProgramScheduleMaintenanceComponent, _super);
    function BatchProgramScheduleMaintenanceComponent(injector, el) {
        _super.call(this, injector);
        this.injector = injector;
        this.el = el;
        this.batchProgramScheduleSearchData = {};
        this.pageId = '';
        this.batchProgramScheduleAutoOpen = false;
        this.showCloseButton = true;
        this.showHeader = true;
        this.isAddOrUpdateMode = false;
        this.showMessageHeader = true;
        this.isBatchProgramScheduleMaintenanceDisabled = false;
        this.isBatchProgramScheduleMaintenanceDisabled1 = true;
        this.search = new URLSearchParams();
        this.currentMode = 'FETCH';
        this.postSearchParams = new URLSearchParams();
        this.isBatchNameAndUserCodeValid = [1, 1];
        this.showPromptMessageHeader = true;
        this.uiElement = this.riExchange.riInputElement;
        this.addAndDeleteButtonVisibility = false;
        this.saveAndCancelButtonVisibility = false;
        this.uiDisplay = {
            tab: {
                tab1: { visible: true, active: true },
                tab2: { visible: true, active: false }
            }
        };
        this.headerParams = {
            method: 'it-functions/ri-model',
            operation: 'Model/riMBatchProgramScheduleMaintenance',
            module: 'batch-process'
        };
        this.programScheduleSearchParams = {
            'parentMode': 'ProgramScheduleSearch',
            'screenMode': 'programname',
            'showAddNew': false,
            'scheduleNumber': ''
        };
        this.controls = [
            { name: 'riBPSUniqueNumber', readonly: false, disabled: true, required: false },
            { name: 'riBPSNextDate', readonly: true, disabled: true, required: true },
            { name: 'riBPSNextTime', readonly: true, disabled: true, required: false },
            { name: 'riBatchProgramName', readonly: true, disabled: true, required: true },
            { name: 'riBatchProgramDescription', readonly: true, disabled: true, required: false },
            { name: 'riBPSUserCode', readonly: true, disabled: true, required: true },
            { name: 'UserName', readonly: true, disabled: true, required: false },
            { name: 'riBPSActive', readonly: true, disabled: true, required: false },
            { name: 'riBPSEmailOnlyIfFailed', readonly: true, disabled: true, required: false },
            { name: 'riLabel1', readonly: true, disabled: true, required: false },
            { name: 'riParam1', readonly: true, disabled: true, required: false },
            { name: 'riLabel2', readonly: true, disabled: true, required: false },
            { name: 'riParam2', readonly: true, disabled: true, required: false },
            { name: 'riLabel3', readonly: true, disabled: true, required: false },
            { name: 'riParam3', readonly: true, disabled: true, required: false },
            { name: 'riLabel4', readonly: true, disabled: true, required: false },
            { name: 'riParam4', readonly: true, disabled: true, required: false },
            { name: 'riLabel5', readonly: true, disabled: true, required: false },
            { name: 'riParam5', readonly: true, disabled: true, required: false },
            { name: 'riLabel6', readonly: true, disabled: true, required: false },
            { name: 'riParam6', readonly: true, disabled: true, required: false },
            { name: 'riLabel7', readonly: true, disabled: true, required: false },
            { name: 'riParam7', readonly: true, disabled: true, required: false },
            { name: 'riLabel8', readonly: true, disabled: true, required: false },
            { name: 'riParam8', readonly: true, disabled: true, required: false },
            { name: 'riLabel9', readonly: true, disabled: true, required: false },
            { name: 'riParam9', readonly: true, disabled: true, required: false },
            { name: 'riLabel10', readonly: true, disabled: true, required: false },
            { name: 'riParam10', readonly: true, disabled: true, required: false },
            { name: 'riLabel11', readonly: true, disabled: true, required: false },
            { name: 'riParam11', readonly: true, disabled: true, required: false },
            { name: 'riLabel12', readonly: true, disabled: true, required: false },
            { name: 'riParam12', readonly: true, disabled: true, required: false },
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
        this.emptyFieldData = {
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
        this.crudOperations = {
            'add': 'ADD',
            'delete': 'DELETE',
            'update': 'UPDATE',
            'fetch': 'FETCH'
        };
        this.pageId = PageIdentifier.RIMBATCHPROGRAMSCHEDULEMAINTENANCE;
        this.pageTitle = 'Batch Program Schedule Selection';
    }
    BatchProgramScheduleMaintenanceComponent.prototype.renderTab = function (tabindex) {
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
    };
    BatchProgramScheduleMaintenanceComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.uiForm = this.formBuilder.group({});
        this.batchProgramScheduleSearchComponent = BatchProgramScheduleSearchComponent;
        this.screenNotReadyComponent = ScreenNotReadyComponent;
        this.riExchange.renderForm(this.uiForm, this.controls);
    };
    BatchProgramScheduleMaintenanceComponent.prototype.ngAfterViewInit = function () {
        this.batchProgramScheduleAutoOpen = true;
    };
    BatchProgramScheduleMaintenanceComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this.uiElement = null;
    };
    BatchProgramScheduleMaintenanceComponent.prototype.modalHidden = function () {
        this.batchProgramScheduleAutoOpen = false;
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onBatchProgramScheduleSearchDataReceived = function (data, route) {
        try {
            this.uiElement.SetValue(this.uiForm, 'riBPSUniqueNumber', data.riBPSUniqueNumber);
            this.uiElement.SetValue(this.uiForm, 'riBPSNextDate', data.riBPSNextDate);
            this.uiElement.SetValue(this.uiForm, 'riBPSNextTime', data.riBPSNextTime);
            this.uiElement.SetValue(this.uiForm, 'riBatchProgramName', data.riBatchProgramName);
            this.uiElement.SetValue(this.uiForm, 'riBatchProgramDescription', data.riBatchProgramDescription);
            this.uiElement.SetValue(this.uiForm, 'riBPSUserCode', data.riBPSUserCode);
            this.uiElement.SetValue(this.uiForm, 'UserName', data.UserName);
            this.uiElement.SetValue(this.uiForm, 'riBPSActive', data.riBPSActive === true);
            this.uiElement.SetValue(this.uiForm, 'riBPSEmailOnlyIfFailed', data.riBPSEmailOnlyIfFailed === true);
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
            this.uiElement.SetValue(this.uiForm, 'riMinute00', data.riMinute00 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMinute15', data.riMinute15 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMinute30', data.riMinute30 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMinute45', data.riMinute45 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour00', data.riHour00 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour01', data.riHour01 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour02', data.riHour02 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour03', data.riHour03 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour04', data.riHour04 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour05', data.riHour05 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour06', data.riHour06 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour07', data.riHour07 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour08', data.riHour08 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour09', data.riHour09 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour10', data.riHour10 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour11', data.riHour11 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour12', data.riHour12 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour13', data.riHour13 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour14', data.riHour14 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour15', data.riHour15 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour16', data.riHour16 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour17', data.riHour17 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour18', data.riHour18 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour19', data.riHour19 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour20', data.riHour20 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour21', data.riHour21 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour22', data.riHour22 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riHour23', data.riHour23 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay00', data.riDay00 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay01', data.riDay01 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay02', data.riDay02 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay03', data.riDay03 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay04', data.riDay04 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay05', data.riDay05 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay06', data.riDay06 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay07', data.riDay07 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay08', data.riDay08 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay09', data.riDay09 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay10', data.riDay10 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay11', data.riDay11 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay12', data.riDay12 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay13', data.riDay13 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay14', data.riDay14 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay15', data.riDay15 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay16', data.riDay16 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay17', data.riDay17 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay18', data.riDay18 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay19', data.riDay19 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay20', data.riDay20 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay21', data.riDay21 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay22', data.riDay22 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay23', data.riDay23 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay24', data.riDay24 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay25', data.riDay25 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay26', data.riDay26 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay27', data.riDay27 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay28', data.riDay28 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay29', data.riDay29 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay30', data.riDay30 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riDay31', data.riDay31 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay01', data.riWeekDay01 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay02', data.riWeekDay02 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay03', data.riWeekDay03 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay04', data.riWeekDay04 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay05', data.riWeekDay05 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay06', data.riWeekDay06 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riWeekDay07', data.riWeekDay07 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth01', data.riMonth01 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth02', data.riMonth02 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth03', data.riMonth03 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth04', data.riMonth04 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth05', data.riMonth05 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth06', data.riMonth06 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth07', data.riMonth07 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth08', data.riMonth08 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth09', data.riMonth09 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth10', data.riMonth10 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth11', data.riMonth11 === 'true');
            this.uiElement.SetValue(this.uiForm, 'riMonth12', data.riMonth12 === 'true');
            this.fetchOtherDetails(data);
            if (data.setParentEditabelMode === 'UPDATE') {
                this.saveAndCancelButtonVisibility = true;
                this.addAndDeleteButtonVisibility = false;
                this.onUpdateClicked();
            }
            this.setFormMode(this.c_s_MODE_UPDATE);
        }
        catch (e) {
            console.log(e.message);
        }
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onAddClicked = function () {
        this.isAddOrUpdateMode = true;
        this.currentMode = this.crudOperations.add;
        this.isBatchProgramScheduleMaintenanceDisabled = true;
        this.isBatchProgramScheduleMaintenanceDisabled1 = false;
        this.setUIFieldsEditablity('Enable');
        this.onBatchProgramScheduleSearchDataReceived(this.emptyFieldData, null);
        this.saveAndCancelButtonVisibility = true;
        this.addAndDeleteButtonVisibility = false;
        this.setFormMode(this.c_s_MODE_ADD);
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onUpdateClicked = function () {
        this.isAddOrUpdateMode = true;
        this.currentMode = this.crudOperations.update;
        this.setUIFieldsEditablity('Enable');
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onSaveClicked = function () {
        var programName = this.uiElement.GetValue(this.uiForm, 'riBatchProgramName');
        var userCode = this.uiElement.GetValue(this.uiForm, 'riBPSUserCode');
        var batchProgramNameUserCodeValidity = this.isBatchNameAndUserCodeValid[0] + this.isBatchNameAndUserCodeValid[1];
        if (programName === '' || userCode === '') {
            this.messageModal.show({ msg: MessageConstant.Message.programNameAndUserCodeRequired, title: 'Message' }, false);
            return;
        }
        else if (batchProgramNameUserCodeValidity < 2) {
            this.messageModal.show({ msg: MessageConstant.Message.validprogramNameAndUserCodeRequired, title: 'Message' }, false);
            return;
        }
        this.isAddOrUpdateMode = false;
        if (this.currentMode === this.crudOperations.update) {
            this.saveAndDelete(this.currentMode);
        }
        else if (this.currentMode === this.crudOperations.add) {
            this.saveAndDelete(this.currentMode);
        }
        this.setUIFieldsEditablity('Disable');
        this.saveAndCancelButtonVisibility = false;
        this.addAndDeleteButtonVisibility = true;
        this.isBatchProgramScheduleMaintenanceDisabled = true;
        this.isBatchProgramScheduleMaintenanceDisabled1 = false;
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onCancelClicked = function () {
        this.isAddOrUpdateMode = false;
        this.isBatchProgramScheduleMaintenanceDisabled = false;
        this.isBatchProgramScheduleMaintenanceDisabled1 = true;
        if (this.currentMode === this.crudOperations.update) {
            this.currentMode = this.crudOperations.fetch;
            this.fetchAndUpdateBatchProgramData(this.crudOperations.fetch);
        }
        else if (this.currentMode === this.crudOperations.add) {
            this.onBatchProgramScheduleSearchDataReceived(this.emptyFieldData, null);
        }
        this.setUIFieldsEditablity('Disable');
        this.saveAndCancelButtonVisibility = false;
        this.addAndDeleteButtonVisibility = true;
        this.el.nativeElement.querySelector('#riBPSUserCode').classList.remove('ng-invalid');
        this.el.nativeElement.querySelector('#riBPSUserCode').classList.add('ng-valid');
        this.isBatchNameAndUserCodeValid = [1, 1];
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onDeleteClicked = function () {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModal.show();
        this.isBatchProgramScheduleMaintenanceDisabled = false;
        this.isBatchProgramScheduleMaintenanceDisabled1 = true;
        this.setFormMode(this.c_s_MODE_SELECT);
    };
    BatchProgramScheduleMaintenanceComponent.prototype.fetchAndUpdateBatchProgramData = function (operation) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        if (operation === this.crudOperations.fetch) {
            this.search.set('riBPSUniqueNumber', this.batchProgramScheduleSearchData.riBPSUniqueNumber);
        }
        else if (operation === this.crudOperations.add) {
            this.search.set('Function', 'GetProgramParameterLabels');
            for (var i = 0; i < this.controls.length; i++) {
                this.search.set(this.controls[i].name, this.riExchange.riInputElement.GetValue(this.uiForm, this.controls[i].name));
            }
            this.search.set('riBatchProgramName', this.uiElement.GetValue(this.uiForm, 'riBatchProgramName'));
        }
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.search)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                if (operation === _this.crudOperations.update) {
                    _this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                }
                _this.onBatchProgramScheduleSearchDataReceived(e, null);
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    BatchProgramScheduleMaintenanceComponent.prototype.setUIFieldsEditablity = function (editability) {
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
    };
    BatchProgramScheduleMaintenanceComponent.prototype.saveAndDelete = function (mode) {
        var _this = this;
        var _formData = {};
        var _confirmMessage = '';
        if (mode === this.crudOperations.add) {
            this.postSearchParams.set(this.serviceConstants.Action, '1');
        }
        else if (mode === this.crudOperations.update) {
            this.postSearchParams.set(this.serviceConstants.Action, '2');
        }
        if (mode === this.crudOperations.add || mode === this.crudOperations.update) {
            var formControlData = '';
            for (var i = 0; i < this.controls.length; i++) {
                formControlData = this.uiElement.GetValue(this.uiForm, this.controls[i].name);
                if (formControlData === undefined) {
                    formControlData = '';
                }
                _formData[this.controls[i].name] = formControlData;
            }
            _confirmMessage = MessageConstant.Message.SavedSuccessfully;
        }
        if (mode === this.crudOperations.delete) {
            this.postSearchParams.set(this.serviceConstants.Action, '3');
            _formData['riBPSUniqueNumber'] = this.uiElement.GetValue(this.uiForm, 'riBPSUniqueNumber');
            _confirmMessage = MessageConstant.Message.RecordDeleted;
        }
        if (_formData['riBPSEmailOnlyIfFailed'] === true) {
            _formData['riBPSEmailOnlyIfFailed'] = 'yes';
        }
        else {
            _formData['riBPSEmailOnlyIfFailed'] = 'no';
        }
        if (_formData['riBPSActive'] === true) {
            _formData['riBPSActive'] = 'yes';
        }
        else {
            _formData['riBPSActive'] = 'no';
        }
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.postSearchParams.set('content-type', 'application/x-www-form-urlencoded');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, _formData)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.errorService.emitError(e['oResponse']);
                }
                else if (e['errorMessage']) {
                    _this.errorService.emitError(e);
                }
                else {
                    if (mode === _this.crudOperations.add) {
                        _this.uiElement.SetValue(_this.uiForm, 'riBPSUniqueNumber', e.riBPSUniqueNumber);
                    }
                    _this.messageModal.show({ msg: _confirmMessage, title: 'Message' }, false);
                    e['msg'] = _confirmMessage;
                    _this.messageService.emitMessage(e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onMessageClose = function () {
        return;
    };
    BatchProgramScheduleMaintenanceComponent.prototype.promptConfirm = function (event) {
        if (event) {
            if (this.promptConfirmContent === MessageConstant.Message.DeleteRecord) {
                this.currentMode = this.crudOperations.delete;
                this.saveAndDelete(this.currentMode);
                this.onBatchProgramScheduleSearchDataReceived(this.emptyFieldData, null);
            }
            else if (this.promptConfirmContent === MessageConstant.Message.ConfirmRecord) {
                this.onSaveClicked();
            }
        }
    };
    BatchProgramScheduleMaintenanceComponent.prototype.fetchOtherDetails = function (batchProgramScheduleObject) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP_details = [{
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
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (e) {
            if (e && e.length > 0 && e[0].length > 0) {
                _this.uiElement.SetValue(_this.uiForm, 'riBatchProgramDescription', e[0][0].riBatchProgramDescription);
                _this.uiElement.SetValue(_this.uiForm, 'UserName', e[1][0].UserName);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    BatchProgramScheduleMaintenanceComponent.prototype.validateEnteredData = function (event) {
        if (event.target.id === 'riBatchProgramName') {
            this.checkBatchProgramName(event.target.value);
        }
        else if (event.target.id === 'riBPSUserCode') {
            this.checkUserCode(event.target.value);
        }
    };
    BatchProgramScheduleMaintenanceComponent.prototype.checkBatchProgramName = function (batchProgramName) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP_details = [{
                'table': 'riBatchProgram',
                'query': { 'riBatchProgramName': batchProgramName },
                'fields': ['riBatchProgramName', 'riBatchProgramDescription']
            }
        ];
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (e) {
            if (e && e.length > 0 && e[0].length > 0) {
                _this.getProgramNameDetails(batchProgramName);
                _this.isBatchNameAndUserCodeValid[0] = 1;
            }
            else {
                _this.isBatchNameAndUserCodeValid[0] = 0;
                _this.messageModal.show({ msg: MessageConstant.Message.noRecordFound, title: 'Message' }, false);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    BatchProgramScheduleMaintenanceComponent.prototype.checkUserCode = function (userCode) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP_details = [
            {
                'table': 'UserInformation',
                'query': { 'UserCode': userCode },
                'fields': ['UserName']
            }
        ];
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (e) {
            if (e && e.length > 0 && e[0].length > 0) {
                _this.uiElement.SetValue(_this.uiForm, 'UserName', e[0][0].UserName);
                _this.el.nativeElement.querySelector('#riBPSUserCode').classList.remove('ng-invalid');
                _this.el.nativeElement.querySelector('#riBPSUserCode').classList.add('ng-valid');
                _this.isBatchNameAndUserCodeValid[1] = 1;
            }
            else {
                _this.el.nativeElement.querySelector('#riBPSUserCode').classList.add('ng-invalid');
                _this.el.nativeElement.querySelector('#riBPSUserCode').classList.remove('ng-valid');
                _this.isBatchNameAndUserCodeValid[1] = 0;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onSaveButtonClicked = function () {
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptConfirmModal.show();
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onScheduleNoSelectFromEllipsis = function (data, route) {
        this.getSelectedDataDetails(data);
    };
    BatchProgramScheduleMaintenanceComponent.prototype.onProgramSelectFromEllipsis = function (data, route) {
        this.uiElement.SetValue(this.uiForm, 'riBatchProgramName', data.riBatchProgramName);
        this.getProgramNameDetails(data.riBatchProgramName);
    };
    BatchProgramScheduleMaintenanceComponent.prototype.getSelectedDataDetails = function (data) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('riBPSUniqueNumber', data.riBPSUniqueNumber);
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.search)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                e.riBPSUniqueNumber = data.riBPSUniqueNumber;
                e.setParentEditabelMode = _this.crudOperations.update;
                e.riBPSEmailOnlyIfFailed = data.riBPSEmailOnlyIfFailed;
                e.riBPSActive = data.riBPSActive;
                _this.onBatchProgramScheduleSearchDataReceived(e, null);
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    BatchProgramScheduleMaintenanceComponent.prototype.getProgramNameDetails = function (programName) {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('Function', 'GetProgramParameterLabels');
        this.search.set('riBatchProgramName', programName);
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.search)
            .subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError(e);
            }
            else {
                _this.populateLabelsAndDescription(e);
            }
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        }, function (error) {
            _this.errorService.emitError(error);
            _this.ajaxSource.next(AjaxConstant.COMPLETE);
        });
    };
    BatchProgramScheduleMaintenanceComponent.prototype.populateLabelsAndDescription = function (data) {
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
    };
    BatchProgramScheduleMaintenanceComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'riMBatchProgramScheduleMaintenance.html',
                    providers: [MessageService]
                },] },
    ];
    BatchProgramScheduleMaintenanceComponent.ctorParameters = [
        { type: Injector, },
        { type: ElementRef, },
    ];
    BatchProgramScheduleMaintenanceComponent.propDecorators = {
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'promptConfirmModal': [{ type: ViewChild, args: ['promptConfirmModal',] },],
    };
    return BatchProgramScheduleMaintenanceComponent;
}(BaseComponent));
