import { InternalGridSearchApplicationModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { ErrorCallback, MessageCallback } from './../../base/Callback';
import { URLSearchParams } from '@angular/http';
import { disableDebugTools } from '@angular/platform-browser';
import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, OnDestroy, AfterViewInit, Injector } from '@angular/core';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { CalendarTemplateSearchComponent } from './../../internal/search/iCABSBCalendarTemplateSearch.component';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { BranchSearchComponent } from '../../internal/search/iCABSBBranchSearch';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { Subscription } from 'rxjs/Subscription';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSACalendarTemplateMaintenance.html'
})

export class CalendarTemplateMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit, MessageCallback, ErrorCallback {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModalForSave') public promptModalForSave;

    @ViewChild('CalendarTemplateEllipsis') CalendarTemplateEllipsis: EllipsisComponent;
    @ViewChild('branchSearchDropDown') branchSearchDropDown: BranchSearchComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    public CalendarTemplateSearchComponent = CalendarTemplateSearchComponent;
    public controls = [
        { name: 'AnnualCalendarTemplateNumber', disabled: false, type: MntConst.eTypeInteger },//Defect Fix -- IUI-16553
        { name: 'TemplateName', disabled: true, type: MntConst.eTypeText },
        { name: 'OwnerBranchNumber', required: true, type: MntConst.eTypeInteger },
        { name: 'BranchName', type: MntConst.eTypeText },
        { name: 'VisitFrequency', required: true, disabled: true, type: MntConst.eTypeInteger },
        { name: 'DisplayAsAppointment', disabled: true },
        { name: 'SelCalendarRolloverTypeCode', disabled: true },
        { name: 'AnnualCalendarTemplateROWID' }
        //{ name: 'menu' }
    ];
    public BranchSearch: string;
    public branchId: number;
    public branchName: string;
    public branchsearchDisabled: boolean = true;
    public menuDisabled: boolean = false;
    public SaveDisabled: boolean = true;
    public CancelDisabled: boolean = true;
    public DeleteDisabled: boolean = true;
    public autoOpenSearch: boolean = false;
    public calendarTemplateEllipsisdisabled: boolean = false;
    public search: URLSearchParams;
    public method: string = 'service-planning/maintenance';
    public module: string = 'template';
    public operation: string = 'Application/iCABSACalendarTemplateMaintenance';
    public modeCheck: any = 'onAddMode';
    public isRequesting: boolean = false;
    public isCalendarRolloverType: boolean = true;
    public promptContentSave: string = '';
    private lookUpSubscription: Subscription;
    private querySysChar: URLSearchParams = new URLSearchParams();
    public calendarRolloverlist: any[] = [];
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public inputParamsBranchSearch: any = { 'parentMode': 'Contract-Search', 'ContractTypeCode': 'J', 'businessCode': this.utils.getBusinessCode(), 'countryCode': this.utils.getCountryCode(), action: 0 };
    public branchNumberSelected: Object = {
        id: '',
        text: ''
    };
    public promptModalConfigSave = {
        ignoreBackdropClick: true
    };
    public inputParamsCalendarTemplate: any = {
        'parentMode': 'Search',
        'showAddNew': true
    };
    ngOnInit(): void {
        super.ngOnInit();
        this.loadSystemChars();
    };
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        this.autoOpenSearch = true;

        // Set message call back
        this.setMessageCallback(this);

        // Set error message call back
        this.setErrorCallback(this);

        this.setFormMode(this.c_s_MODE_UPDATE);
        //added for defect fix --initially disable all fields--IUI-16552 --START ----
        this.disableFeilds({
            'AnnualCalendarTemplateNumber': false,
            'TemplateName': true,
            'branchsearchDisabled': true,
            'VisitFrequency': true,
            'DisplayAsAppointment': true,
            'SelCalendarRolloverTypeCode': true,
            'Save': true,
            'Cancel': true,
            'Delete': true,
            'menu': true
        });
        //added for defect fix --initially disable all fields--IUI-16552 --END----
        if (this.isReturningFlag) {
            this.modeCheck = 'onUpdateMode';
            this.autoOpenSearch = false;
            this.populateUIFromFormData();
            this.doLookup('AnnualCalendarTemplate', { 'AnnualCalendarTemplateNumber': this.getControlValue('AnnualCalendarTemplateNumber'), 'BusinessCode': this.utils.getBusinessCode() }, ['TemplateName', 'OwnerBranchNumber', 'VisitFrequency', 'DisplayAsAppointment', 'CalendarRollOverTypeCode']);
        } else {
            //console.log('NEW');
        }
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }
    constructor(injector: Injector, private systemCharacterConstant: SysCharConstants) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACALENDARTEMPLATEMAINTENANCE;
        this.pageTitle = 'Calendar Template Maintenance';
        this.browserTitle = this.pageTitle;
    }

    public loadSystemChars(): void {
        this.isRequesting = true;
        let sysNumbers = this.systemCharacterConstant.SystemCharEnableCalendarRolloverType;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.fetchSysChar(sysNumbers)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                    //this.errorModal.show({ msg: e.errorMessage, title: 'Error Message' }, false);
                } else {
                    if (e.records[0]) {
                        this.pageParams.vbEnableCalendarRolloverType = e.records[0].Required;
                        if (this.pageParams.vbEnableCalendarRolloverType) {
                            this.pageParams.vbDefaultRolloverType = this.pageParams.iDefaultRolloverType;
                            this.getCalendarRolloverValues();
                            this.isCalendarRolloverType = false;
                        } else {
                            this.pageParams.vbDefaultRolloverType = '0';
                            this.isCalendarRolloverType = true;
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                // this.errorModal.show({ msg: error.errorMessage, title: 'Error Message' }, false);
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }
    /*** Method to get system characters for ProspectMaintenance
    * @params field- systemchars variables looking for  and type- L,R,I
    */
    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');

        if (this.utils.getBusinessCode()) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode());
        }
        if (this.utils.getCountryCode()) {
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        } else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.countryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }

    public onCalendarTemplateDataReturn(data: any): void {
        if (data) {
            this.modeCheck = 'onUpdateMode';
            this.setControlValue('AnnualCalendarTemplateNumber', data['AnnualCalendarTemplateNumber']);
            this.setControlValue('AnnualCalendarTemplateROWID', data.row['ttAnnualCalendarTemplate']);
            this.doLookup('AnnualCalendarTemplate', { 'AnnualCalendarTemplateNumber': data['AnnualCalendarTemplateNumber'], 'BusinessCode': this.utils.getBusinessCode() }, ['TemplateName', 'OwnerBranchNumber', 'VisitFrequency', 'DisplayAsAppointment', 'CalendarRollOverTypeCode']);
            this.disableFeilds({
                'AnnualCalendarTemplateNumber': true,//Defect Fix -- IUI-16553
                'TemplateName': false,
                'branchsearchDisabled': false,
                'VisitFrequency': false,
                'DisplayAsAppointment': false,
                'SelCalendarRolloverTypeCode': false,
                'Save': false,
                'Cancel': false,
                'Delete': false,
                'menu': false
            });
        }
    }
    public onAddMode(): void {
        //this.branchsearchDisabled = false;
        this.modeCheck = 'onAddMode';
        this.clearControls([]);
        this.branchNumberSelected = {
            id: '',
            text: ''
        };
        this.disableFeilds({
            'AnnualCalendarTemplateNumber': true,
            'TemplateName': false,
            'branchsearchDisabled': false,
            'VisitFrequency': false,
            'DisplayAsAppointment': false,
            'SelCalendarRolloverTypeCode': false,
            'Save': false,
            'Cancel': false,
            'Delete': true,
            'menu': true
        });
        this.setControlValue('SelCalendarRolloverTypeCode', 0);
    }
    private doLookup(table: any, query: any, fields: any): any {
        this.isRequesting = true;
        let lookupIP = [{
            'table': table,
            'query': query,
            'fields': fields
        }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let record = data[0];
            switch (table) {
                case 'AnnualCalendarTemplate':
                    if (record.length > 0) {
                        this.setControlValue('TemplateName', record[0].hasOwnProperty('TemplateName') ? record[0]['TemplateName'] : false);
                        this.setControlValue('OwnerBranchNumber', record[0].hasOwnProperty('OwnerBranchNumber') ? record[0]['OwnerBranchNumber'] : false);
                        this.setControlValue('VisitFrequency', record[0].hasOwnProperty('VisitFrequency') ? record[0]['VisitFrequency'] : false);
                        this.setControlValue('DisplayAsAppointment', record[0].hasOwnProperty('DisplayAsAppointment') ? record[0]['DisplayAsAppointment'] : false);
                        this.setControlValue('SelCalendarRolloverTypeCode', record[0].CalendarRolloverTypeCode);
                        this.doLookup('Branch', { 'BranchNumber': record[0].hasOwnProperty('OwnerBranchNumber') ? record[0]['OwnerBranchNumber'] : false, 'BusinessCode': this.utils.getBusinessCode() }, ['BranchName']);
                        //Defect Fix  -- IUI-16553
                        this.disableFeilds({
                            'AnnualCalendarTemplateNumber': true,
                            'TemplateName': false,
                            'branchsearchDisabled': false,
                            'VisitFrequency': false,
                            'DisplayAsAppointment': false,
                            'SelCalendarRolloverTypeCode': false,
                            'Save': false,
                            'Cancel': false,
                            'Delete': false,
                            'menu': false
                        });
                        //Defect Fix  -- IUI-16553
                    }
                    break;
                case 'Branch':
                    if (record.length > 0) {
                        this.setControlValue('BranchName', record[0].hasOwnProperty('BranchName') ? record[0]['BranchName'] : false);
                        this.branchNumberSelected = {
                            id: this.getControlValue('OwnerBranchNumber'),
                            text: this.getControlValue('OwnerBranchNumber') + ' - ' + (record[0].hasOwnProperty('BranchName') ? record[0]['BranchName'] : false)
                        };
                        this.isRequesting = false;
                    }
                    break;
            }
        });
    };
    public onBranchDataReceived(obj: any): void {
        this.setControlValue('OwnerBranchNumber', obj.BranchNumber);
        this.setControlValue('BranchName', (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName));
        this.BranchSearch = obj.BranchNumber + ' : ' + (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
    }
    public templateNumberChange(value: any): void {
        this.doLookup('AnnualCalendarTemplate', { 'AnnualCalendarTemplateNumber': value, 'BusinessCode': this.utils.getBusinessCode() }, ['TemplateName', 'OwnerBranchNumber', 'VisitFrequency', 'DisplayAsAppointment', 'CalendarRollOverTypeCode']);
    }
    public onSubmit(Obj: any): void {
        if (this.uiForm.valid) {
            switch (Obj) {
                case 'delete':
                    this.modeCheck = 'onDeleteMode';
                    this.promptContentSave = MessageConstant.Message.DeleteRecord;
                    break;
                case 'save':
                    this.promptContentSave = MessageConstant.Message.ConfirmRecord;
                    break;
            }
            this.promptModalForSave.show();
        } else {
            if (this.riExchange.riInputElement.isError(this.uiForm, 'OwnerBranchNumber')) {
                this.branchSearchDropDown.branchsearchDropDown.isError = true;
            }
            this.riExchange.riInputElement.isError(this.uiForm, 'VisitFrequency');
        }
    }
    public onCancel(): void {
        let val = this.getControlValue('AnnualCalendarTemplateNumber');
        if (val !== null && val !== '') {
            this.templateNumberChange(val);
        } else {
            //this.onAddMode();
            this.clearControls([]);
            this.disableFeilds({
                'AnnualCalendarTemplateNumber': false,
                'TemplateName': true,
                'branchsearchDisabled': true,
                'VisitFrequency': true,
                'DisplayAsAppointment': true,
                'SelCalendarRolloverTypeCode': true,
                'Save': true,
                'Cancel': true,
                'Delete': true,
                'menu': true
            });
        }
    }
    public promptContentSaveData(event: any): void {
        switch (this.modeCheck) {
            case 'onUpdateMode':
                this.onSaveUpdateMode(event);
                break;
            case 'onAddMode':
                this.onSaveAddMode(event);
                break;
            case 'onDeleteMode':
                this.onDeleteMode(event);
                break;
        }
    }

    public getCalendarRolloverValues(): void {
        this.isRequesting = true;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');

        let postObj: any = {};
        postObj.Function = 'GetCalendarRolloverValues';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, postObj)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                    //this.errorModal.show({ msg: e.errorMessage, title: 'Error Message' }, false);
                } else {
                    let arrCode = e.CalendarRolloverTypeCodeList.split('|');
                    let arrDesc = e.CalendarRolloverTypeDescList.split('|');

                    arrCode.forEach((item, index) => {
                        this.calendarRolloverlist.push({
                            'calendarRolloverTypeCodeList': item,
                            'calendarRolloverTypeDescList': arrDesc[index]
                        });
                    });
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                //this.errorModal.show({ msg: error.errorMessage, title: 'Error Message' }, false);
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    };

    public onSaveUpdateMode(event: any): void {
        this.isRequesting = true;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');

        let postObj: any = {};
        postObj.AnnualCalendarTemplateNumber = this.getControlValue('AnnualCalendarTemplateNumber');
        postObj.AnnualCalendarTemplateROWID = this.getControlValue('AnnualCalendarTemplateROWID');
        postObj.TemplateName = this.getControlValue('TemplateName');
        postObj.OwnerBranchNumber = this.getControlValue('OwnerBranchNumber');
        postObj.VisitFrequency = this.getControlValue('VisitFrequency');
        postObj.DisplayAsAppointment = this.getControlValue('DisplayAsAppointment');
        if (this.pageParams.vbEnableCalendarRolloverType) {
            postObj.CalendarRolloverTypeCode = this.getControlValue('CalendarRolloverTypeCode');
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, postObj)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                    //this.errorModal.show({ msg: e.errorMessage, title: 'Error Message' }, false);
                } else {
                    //this.messageModal.show({ msg: 'iCABSACalendarTemplateDateGrid.htm Page not yet Developed', title: 'Message' }, false);
                    this.formPristine();
                    this.navigate('CalendarTemplate', InternalGridSearchServiceModuleRoutes.ICABSACALENDARTEMPLATEDATEGRID);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                //this.errorModal.show({ msg: error.errorMessage, title: 'Error Message' }, false);
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }

    public onSaveAddMode(event: any): void {
        this.isRequesting = true;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '1');

        let postObj: any = {};
        // postObj.AnnualCalendarTemplateROWID = this.getControlValue('AnnualCalendarTemplateROWID');
        postObj.TemplateName = this.getControlValue('TemplateName');
        postObj.OwnerBranchNumber = this.getControlValue('OwnerBranchNumber');
        postObj.VisitFrequency = this.getControlValue('VisitFrequency');
        postObj.DisplayAsAppointment = this.getControlValue('DisplayAsAppointment');
        if (this.pageParams.vbEnableCalendarRolloverType) {
            postObj.CalendarRolloverTypeCode = this.getControlValue('CalendarRolloverTypeCode');
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, postObj)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                    //this.errorModal.show({ msg: e.errorMessage, title: 'Error Message' }, false);
                } else {
                    this.setControlValue('AnnualCalendarTemplateNumber', e['AnnualCalendarTemplateNumber']);
                    this.setControlValue('AnnualCalendarTemplateROWID', e['AnnualCalendarTemplate']);
                    this.modeCheck = 'onUpdateMode';
                    this.formPristine();
                    this.navigate('CalendarTemplate', InternalGridSearchServiceModuleRoutes.ICABSACALENDARTEMPLATEDATEGRID);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                //this.errorModal.show({ msg: error.errorMessage, title: 'Error Message' }, false);
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }

    public onDeleteMode(event: any): void {
        this.isRequesting = true;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '3');

        let postObj: any = {};
        postObj.AnnualCalendarTemplateROWID = this.getControlValue('AnnualCalendarTemplateROWID');
        postObj.AnnualCalendarTemplateNumber = this.getControlValue('AnnualCalendarTemplateNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, postObj)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                    //this.errorModal.show({ msg: e.errorMessage, title: 'Error Message' }, false);
                } else {
                    //this.onAddMode();
                    this.clearControls([]);
                    this.disableFeilds({
                        'AnnualCalendarTemplateNumber': false,
                        'TemplateName': true,
                        'branchsearchDisabled': true,
                        'VisitFrequency': true,
                        'DisplayAsAppointment': true,
                        'SelCalendarRolloverTypeCode': true,
                        'Save': true,
                        'Cancel': true,
                        'Delete': true,
                        'menu': true
                    });
                    this.messageModal.show({ msg: MessageConstant.Message.RecordDeleted, title: 'Message' }, false);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                //this.errorModal.show({ msg: error.errorMessage, title: 'Error Message' }, false);
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }
    public messageModalClose(): void {
        // switch (this.modeCheck) {
        //     case 'onUpdateMode':
        //     case 'onAddMode':
        //         this.errorModal.show({ msg: 'iCABSACalendarTemplateDateGrid.htm Page not yet Developed', title: 'Error Message' }, false);
        //         break;
        //     default:
        //         console.log('ok');
        //         break;
        // }
    }
    public optionsChange(menu: any): void {
        switch (menu) {
            case 'access':
                this.navigate('CalendarTemplate', InternalGridSearchApplicationModuleRoutes.ICABSACALENDARTEMPLATEBRANCHACCESSGRID);
                break;
            case 'calendar':
                //this.messageModal.show({ msg: 'iCABSACalendarTemplateDateGrid.htm Page not yet Developed', title: 'Message' }, false);
                this.navigate('CalendarTemplate', InternalGridSearchServiceModuleRoutes.ICABSACALENDARTEMPLATEDATEGRID);
                break;
            case 'templateuse':
                this.navigate('CalendarTemplate', 'serviceplanning/Templates/CalendarTemplateUse');
                break;
            case 'history':
                this.navigate('CalendarTemplate', 'serviceplanning/application/calenderHistoryGrid');
                break;
        }
    }
    public disableFeilds(fields: any): void {
        for (let field in fields) {
            if (fields.hasOwnProperty(field)) {
                let feildBoolean = fields[field];
                switch (field) {
                    case 'branchsearchDisabled':
                        this.branchsearchDisabled = feildBoolean;
                        break;
                    case 'menu':
                        this.menuDisabled = feildBoolean;
                        break;
                    case 'Save':
                        this.SaveDisabled = feildBoolean;
                        break;
                    case 'Cancel':
                        this.CancelDisabled = feildBoolean;
                        break;
                    case 'Delete':
                        this.DeleteDisabled = feildBoolean;
                        break;
                    default:
                        this.disableControl(field, feildBoolean);
                        break;
                }
            }
        }
    }
}
