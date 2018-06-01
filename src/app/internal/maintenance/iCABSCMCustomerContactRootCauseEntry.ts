import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, KeyValueChangeRecord, OnDestroy, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { FormControl, FormGroup } from '@angular/forms';
import { SpeedScript } from '../../../shared/services/speedscript';
import { EmployeeSearchComponent } from '../search/iCABSBEmployeeSearch';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MessageConstant } from '../../../shared/constants/message.constant';
@Component({
    templateUrl: 'iCABSCMCustomerContactRootCauseEntry.html'
})

export class CustomerContactRootCauseEntryComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('employeeSearchEllipsis') employeeSearchEllipsis: EllipsisComponent;
    @ViewChild('RootCauseSelect') public rootCauseSelect;
    @ViewChild('OccupationSelect') public OccupationSelect;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    public pageId: string = '';
    public uiForm: FormGroup;
    public queryParams: URLSearchParams;
    public lookUpSubscription: Subscription;
    public search: URLSearchParams = new URLSearchParams();
    public vCustomerContactNumber: any;
    public vEmployeeCode: any;
    public vEmployeeName: any;
    public vInitialMaintenanceMode: any;
    public vClosedDate: any;
    public employeeSearchComponent = EmployeeSearchComponent;
    public selectMode: Boolean = false;
    public addMode: Boolean = false;
    public updateMode: Boolean = true;
    public deleteMode: Boolean = false;
    public showMessageHeader: boolean = true;
    public saveBtn: Boolean = true;
    public riMaintenanceCancelEvent = false;
    public storeData: any = {};
    public virtualData: any = {};
    public showControlBtn = true;
    public promptTitle: string = '';
    public promptContent: string = '';
    //Speedscript
    public ttRootCause = [];
    public ttOccupation = [];
    public gcEmployeeCode: string;
    public gcEmployeeName: string;
    public fieldRequired: any = { 'CreatedByEmployeeCode': true };
    public showAddBtn: Boolean = false;
    public showDeleteBtn: Boolean = false;
    public actionMode: string = '';
    public controls = [
        { name: 'CreatedByEmployeeCode', readonly: true, disabled: true, required: true },
        { name: 'CreatedByEmployeeSurname', readonly: true, disabled: true, required: false },
        { name: 'RootCauseEmployeeCode', readonly: false, disabled: false, required: false },
        { name: 'RootCauseEmployeeSurname', readonly: false, disabled: true, required: false },
        { name: 'RootCauseNotes', readonly: false, disabled: false, required: false },
        { name: 'CustomerContactNumber', readonly: false, disabled: false, required: false },
        { name: 'RootCauseCode', readonly: false, disabled: false, required: false },
        { name: 'OccupationCode', readonly: false, disabled: false, required: true },
        { name: 'OccupationSelect', readonly: false, disabled: false, required: false },
        { name: 'RootCauseSelect', readonly: false, disabled: false, required: false }
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCUSTOMERCONTACTROOTCAUSEENTRY;
    }
    public ellipsis = {
        employee: {
            autoOpen: false,
            showCloseButton: true,
            showAddNew: false,
            childConfigParams: {
                'parentMode': 'iCABSCMCustomerContactRootCauseEntry'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };
    ngOnInit(): void {
        super.ngOnInit();

        this.gcEmployeeCode = '';
        this.gcEmployeeName = '';
        let pageTitle = 'Contact Root Cause Maintenance';
        this.utils.setTitle(pageTitle);
        this.window_onload();
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    public muleConfig: any = {
        operation: 'ContactManagement/iCABSCMCustomerContactRootCauseEntry',
        module: 'rca',
        method: 'ccm/maintenance'
    };

    public window_onload(): void {
        this.createMandateTypeTempData(true);

        if (this.addMode === true) {
            this.riMaintenance_BeforeAdd();
        }
    }

    public createMandateTypeTempData(addMode: boolean): void {
        let gLanguageCode = this.riExchange.LanguageCode();
        let data = [
            {
                'table': 'RootCause',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BusinessCode', 'RootCauseCode', 'RootCauseSystemDescription']
            },
            {
                'table': 'RootCauseLang',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'LanguageCode': gLanguageCode },
                'fields': ['BusinessCode', 'RootCauseCode', 'RootCauseDescription', 'LanguageCode']
            },
            {
                'table': 'Occupation',
                'query': { 'BusinessCode': this.utils.getBusinessCode() },
                'fields': ['BusinessCode', 'OccupationCode', 'OccupationDesc']
            },

            {
                'table': 'Employee',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'UserCode': this.utils.getUserCode() },
                'fields': ['BusinessCode', 'EmployeeCode', 'EmployeeForeName1', 'EmployeeSurName']
            }

        ];

        this.lookUpRecord(data, 500).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {

                    if (e['results'] && e['results'][0].length > 0) {
                        let RootCause: any[] = e['results'][0];
                        let RootCauseLang: any[] = [];
                        let Occupation: any[] = [];
                        let Employee: any[] = [];

                        if (e['results'].length > 1 && e['results'][1].length > 0) {
                            RootCauseLang = e['results'][1];
                        }
                        if (e['results'].length > 2 && e['results'][2].length > 0) {
                            Occupation = e['results'][2];
                        }
                        if (e['results'].length > 3 && e['results'][3].length > 0) {
                            Employee = e['results'][3];
                            this.gcEmployeeCode = Employee[0].EmployeeCode;
                            this.gcEmployeeName = Employee[0].EmployeeForename1 + ' ' + Employee[0].EmployeeSurname;
                        }

                        RootCause.forEach(item => {
                            let filterData = RootCauseLang.find(langObj => ((langObj.BusinessCode === item.BusinessCode)
                                && (langObj.RootCauseCode === item.RootCauseCode)));
                            this.ttRootCause.push({
                                'ttRootCauseCode': item.RootCauseCode,
                                'ttRootCauseSystemDescription': (filterData) ? filterData.RootCauseDescription : item.RootCauseSystemDescription
                            });
                        });
                        Occupation.forEach(item => {
                            if (item) {
                                this.ttOccupation.push({ 'ttOccupationCode': item['OccupationCode'], 'ttOccupationDesc': item['OccupationDesc'] });
                            }
                        });
                    }
                }
                this.loadPage();
            },
            (error) => {
                //console.log(error);
            }
        );
    }

    public loadPage(): void {
        this.vCustomerContactNumber = this.riExchange.getParentHTMLValue('CustomerContactNumber');
        this.vClosedDate = this.riExchange.getParentHTMLValue('ClosedDate');

        if (this.parentMode === 'TicketMaintenanceUpdate' || this.parentMode === 'TicketMaintenanceAdd') {
            if (this.parentMode === 'TicketMaintenanceUpdate') {
                this.setControlValue('CustomerContactNumber', this.vCustomerContactNumber);
                let rootCauseCode = this.riExchange.getParentHTMLValue('RootCauseCode') || '';
                this.setControlValue('RootCauseCode', rootCauseCode);
                this.vInitialMaintenanceMode = 'Update';
                this.updateMode = true;
                this.riMaintenanceFetchRecord();
                this.setControlValue('RootCauseSelect', rootCauseCode);
                this.setControlValue('OccupationSelect', this.getControlValue('OccupationCode'));

                if (this.vClosedDate) {
                    this.updateMode = false;
                    this.deleteMode = false;
                    this.addMode = false;
                    this.riExchange.riInputElement.Disable(this.uiForm, 'OccupationSelect');
                }
                else {
                    this.updateMode = true;
                    if ((typeof this.rootCauseSelect !== 'undefined') && this.rootCauseSelect) {
                        this.rootCauseSelect.nativeElement.focus();
                    }
                }
                this.riExchange.riInputElement.Disable(this.uiForm, 'RootCauseSelect');

            }
            else {
                this.vInitialMaintenanceMode = 'Add';
                this.addMode = true;
                this.updateMode = false;
                this.setControlValue('CreatedByEmployeeCode', this.gcEmployeeCode);
                this.setControlValue('CreatedByEmployeeSurname', this.gcEmployeeName);
            }
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'RootCauseSelect');
            this.riExchange.riInputElement.Disable(this.uiForm, 'OccupationSelect');
        }
    }
    //LookUp
    private loadVirtualTableData(): any {
        let rootCauseCode = this.riExchange.getParentHTMLValue('RootCauseCode') || '';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'RootCauseSelect', rootCauseCode);
        let lookupIP = [{
            'table': 'ContactRootCause',
            'query': {
                'BusinessCode': this.utils.getBusinessCode(),
                'CustomerContactNumber': this.riExchange.getParentHTMLValue('CustomerContactNumber'),
                'RootCauseCode': rootCauseCode
            },
            'fields': ['OccupationCode', 'RootCauseEmployeeCode', 'RootCauseNotes', 'CreatedByEmployeeCode']
        }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let ContactRootCauseData = data[0][0];
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RootCauseEmployeeCode', ContactRootCauseData['RootCauseEmployeeCode']);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CreatedByEmployeeCode', ContactRootCauseData['CreatedByEmployeeCode']);
            this.loadEmployeeTableData();
        });
    }
    private loadEmployeeTableData(): any {
        //LookUp
        let lookupIP = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'RootCauseEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'CreatedByEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {

            if (data && data[0]) {
                let EmployeeData = data[0][0];
                if (EmployeeData) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'RootCauseEmployeeSurname', EmployeeData['EmployeeSurname']);
                    this.virtualData.RootCauseEmployeeSurname = EmployeeData['EmployeeSurname'];
                };
            }
            if (data && data[1]) {
                let Employee2Data = data[1][0];
                if (Employee2Data) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CreatedByEmployeeSurname', Employee2Data['EmployeeSurname']);
                    this.virtualData.CreatedByEmployeeSurname = Employee2Data['EmployeeSurname'];
                };
            }
        });
    }

    public validateEmployeeCode(): any {

        if ((this.riExchange.riInputElement.GetValue(this.uiForm, 'RootCauseEmployeeCode') === '') || (this.riExchange.riInputElement.GetValue(this.uiForm, 'RootCauseEmployeeCode') === undefined)) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RootCauseEmployeeSurname', '');
            return;
        }

        //LookUp
        let lookupIP = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'RootCauseEmployeeCode')
                },
                'fields': ['EmployeeCode', 'EmployeeSurname']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.status === 'failure') {
                this.errorService.emitError(data.oResponse);
            } else {
                if (data.hasError) {
                    this.messageModal.show(data, true);
                }
                else {
                    if (data && data[0]) {
                        let EmployeeData = data[0][0];
                        if (EmployeeData) {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'RootCauseEmployeeSurname', EmployeeData['EmployeeSurname']);
                            this.virtualData.RootCauseEmployeeSurname = EmployeeData['EmployeeSurname'];

                        }
                        else {
                            this.uiForm.controls['RootCauseEmployeeCode'].setErrors({ remote: true });
                        }
                    }
                }
            }
        });

    }
    public lookUpRecord(data: any, maxresults: any): any {
        let queryLookUp = new URLSearchParams();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(queryLookUp, data);
    }
    public employeeonchange(obj: any): void {
        if (obj.EmployeeSurName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RootCauseEmployeeCode', obj.EmployeeCode);
        }
        if (obj.EmployeeSurName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'RootCauseEmployeeSurname', obj.EmployeeSurName);
        }
    }
    public riMaintenance_BeforeAdd(): any {
        this.riExchange.riInputElement.Enable(this.uiForm, 'RootCauseSelect');
        this.riExchange.riInputElement.Enable(this.uiForm, 'OccupationSelect');
        this.setControlValue('RootCauseSelect', '');
        this.setControlValue('OccupationSelect', '');
        this.setControlValue('RootCauseEmployeeCode', '');
        this.setControlValue('RootCauseEmployeeSurname', '');
        this.setControlValue('RootCauseNotes', '');
        this.setControlValue('CreatedByEmployeeCode', this.gcEmployeeCode);
        this.setControlValue('CreatedByEmployeeSurname', this.gcEmployeeName);
        if ((typeof this.rootCauseSelect !== 'undefined') && this.rootCauseSelect) {
            this.rootCauseSelect.nativeElement.focus();
        }
    }
    public riMaintenance_BeforeSave(): any {
        this.setControlValue('CustomerContactNumber', this.vCustomerContactNumber);
        this.setControlValue('RootCauseCode', this.getControlValue('RootCauseSelect'));
        this.setControlValue('OccupationCode', this.getControlValue('OccupationSelect'));

        if ((this.getControlValue('RootCauseCode') === '') || (this.getControlValue('RootCauseCode') === undefined)) {
            let objRootCauseSelect = document.getElementById('RootCauseSelect');
            if (objRootCauseSelect) {
                objRootCauseSelect.focus();
            }

            this.riMaintenanceCancelEvent = true;
        } else if ((this.getControlValue('OccupationCode') === '') || (this.getControlValue('OccupationCode') === undefined)) {
            let objOccupationSelect = document.getElementById('OccupationSelect');
            if (objOccupationSelect) {
                objOccupationSelect.focus();
            }

            this.riMaintenanceCancelEvent = true;
        }
        //  else {
        //     this.riExchange.riInputElement.Disable(this.uiForm, 'RootCauseSelect');
        //     this.riExchange.riInputElement.Disable(this.uiForm, 'OccupationSelect');
        // }
    }
    public riMaintenance_AfterSave(): any {
        this.vInitialMaintenanceMode = 'Update';
    }
    public riMaintenance_AfterNormalAfterSave(): any {
        this.riMaintenanceFetchRecord();
    }
    public riMaintenance_AfterAbandonUpdate(): any {
        this.riExchange.riInputElement.Disable(this.uiForm, 'RootCauseSelect');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OccupationSelect');
        this.setControlValue('RootCauseSelect', this.getControlValue('RootCauseCode'));
        this.setControlValue('OccupationSelect', this.getControlValue('OccupationCode'));
    }
    public riMaintenance_AfterAbandonAdd(): any {
        this.riExchange.riInputElement.Disable(this.uiForm, 'RootCauseSelect');
        this.riExchange.riInputElement.Disable(this.uiForm, 'OccupationSelect');
        this.updateMode = false;
        this.deleteMode = false;
        if (this.vInitialMaintenanceMode === 'Update') {
            this.setControlValue('RootCauseSelect', this.getControlValue('RootCauseCode'));
            this.setControlValue('OccupationSelect', this.getControlValue('OccupationCode'));
        } else {
            this.setControlValue('RootCauseSelect', '');
            this.setControlValue('OccupationSelect', '');
            this.setControlValue('CreatedByEmployeeSurname', '');
        }
    }
    public riMaintenance_AfterDelete(): any {
        this.setControlValue('RootCauseSelect', '');
        this.setControlValue('OccupationSelect', '');
    }
    public RootCauseEmployeeCode_onkeydown(): any {
        if (this.employeeSearchEllipsis) {
            this.employeeSearchEllipsis.openModal();
        }
    }
    public riMaintenance_Search(): any {
        if (this.getControlValue('RooTCauseSelect') === '') {
            if ((typeof this.rootCauseSelect !== 'undefined') && this.rootCauseSelect) {
                this.rootCauseSelect.nativeElement.focus();
            }
        } else {
            this.setControlValue('CustomerContactNumber', this.vCustomerContactNumber);
            this.setControlValue('RootCauseCode', this.getControlValue('RootCauseSelect'));
            this.riMaintenanceFetchRecord();
        }
    }
    public riMaintenanceFetchRecord(): any {
        let formdata = {
            'CustomerContactNumber': this.uiForm.controls['CustomerContactNumber'].value,
            'RootCauseCode': this.uiForm.controls['RootCauseCode'].value
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.fetchRecordData('', { action: '0' }, formdata).subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.saveBtn = false;
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data.hasError) {
                        this.saveBtn = false;
                        this.messageModal.show(data, true);
                    }
                    else {
                        if (data) {
                            this.saveBtn = true;
                            this.storeData = data;
                            this.setFormData(data);
                            this.loadEmployeeTableData();
                            this.onUpdateMode(data);
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
    public fetchRecordData(functionName: any, params: any, postdata?: any): any {
        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.set(this.serviceConstants.Action, '0');
        if (functionName !== '') {
            this.queryParams.set(this.serviceConstants.Action, '6');
        }
        for (let key in params) {
            if (key) {
                this.queryParams.set(key, params[key]);
            }
        }
        if (postdata) {
            return this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams, postdata);
        }
        else {
            return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams);
        }
    }
    public postRecordData(functionName: any, params: any, postdata?: any): any {
        this.queryParams = new URLSearchParams();
        this.queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.queryParams.set(this.serviceConstants.Action, '0');
        if (functionName !== '') {
            this.queryParams.set(this.serviceConstants.Action, '6');
        }
        for (let key in params) {
            if (key) {
                this.queryParams.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryParams, postdata);
    }
    public onSubmit(): void {

        if (this.uiForm.controls['RootCauseEmployeeCode'].valid) {
            this.riMaintenanceCancelEvent = false;
            if (this.updateMode === true) {
                this.actionMode = '2';
                this.riMaintenance_BeforeSave();
                this.promptModal.content = MessageConstant.Message.ConfirmRecord;
                //this.promptModal.show();
            }
            if (this.addMode === true) {
                this.actionMode = '1';
                this.riMaintenance_BeforeSave();
                this.promptModal.content = MessageConstant.Message.ConfirmRecord;
                //this.promptModal.show();
            }
            let createdByEmployeeCode = this.riExchange.riInputElement.isError(this.uiForm, 'CreatedByEmployeeCode');
            let occupationCode = this.riExchange.riInputElement.isError(this.uiForm, 'OccupationCode');

            if (this.getControlValue('CreatedByEmployeeCode') && this.getControlValue('OccupationCode') && this.riMaintenanceCancelEvent === false) {
                this.promptModal.show();
            };
        }
    }

    public promptSave(event: any): void {
        //Delete Mode
        if (this.updateMode === true && this.actionMode === '3') {
            let postData = {
                'CustomerContactNumber': this.uiForm.controls['CustomerContactNumber'].value,
                'RootCauseCode': this.uiForm.controls['RootCauseCode'].value,
                'OccupationCode': this.uiForm.controls['OccupationCode'].value,
                'RootCauseEmployeeCode': this.uiForm.controls['RootCauseEmployeeCode'].value,
                'RootCauseNotes': this.uiForm.controls['RootCauseNotes'].value,
                'CreatedByEmployeeCode': this.uiForm.controls['CreatedByEmployeeCode'].value
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.postRecordData('', { 'action': '3' }, postData).subscribe(
                (data) => {
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.oResponse);
                    } else {
                        if (data.hasError) {
                            this.messageModal.show(data, true);
                        }
                        else {
                            this.messageModal.show({ msg: MessageConstant.Message.RecordDeletedSuccessfully, title: 'Success Message' }, false);
                            this.storeData = {};
                            this.riMaintenance_AfterDelete();
                            this.onAddeMode();
                            this.addMode = true;
                            this.updateMode = false;
                            this.deleteMode = false;
                            this.showAddBtn = false;
                            this.showDeleteBtn = false;
                            this.setControlValue('RootCauseNotes', '');
                            this.setControlValue('RootCauseEmployeeCode', '');
                            this.setControlValue('RootCauseEmployeeSurname', '');
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        //Update Mode
        if (this.updateMode === true && this.actionMode === '2') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'RootCauseSelect');
            this.riExchange.riInputElement.Disable(this.uiForm, 'OccupationSelect');

            let postData = {
                'CustomerContactNumber': this.uiForm.controls['CustomerContactNumber'].value,
                'RootCauseCode': this.uiForm.controls['RootCauseCode'].value,
                'OccupationCode': this.uiForm.controls['OccupationCode'].value,
                'RootCauseEmployeeCode': this.uiForm.controls['RootCauseEmployeeCode'].value,
                'RootCauseNotes': this.uiForm.controls['RootCauseNotes'].value,
                'CreatedByEmployeeCode': this.uiForm.controls['CreatedByEmployeeCode'].value
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.postRecordData('', { 'action': '2' }, postData).subscribe(
                (data) => {
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.oResponse);
                    } else {
                        if (data.hasError) {
                            this.messageModal.show(data, true);
                        }
                        else {
                            this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                            this.storeData = data;
                            this.addMode = false;
                            this.updateMode = true;
                            this.deleteMode = true;
                            this.showAddBtn = true;
                            this.showDeleteBtn = true;
                            this.setFormData(data);
                            this.loadEmployeeTableData();
                            this.onUpdateMode(data);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        //Add Mode
        if (this.addMode === true) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'RootCauseSelect');
            this.riExchange.riInputElement.Disable(this.uiForm, 'OccupationSelect');

            let postData = {
                'CustomerContactNumber': this.uiForm.controls['CustomerContactNumber'].value,
                'RootCauseCode': this.uiForm.controls['RootCauseCode'].value,
                'OccupationCode': this.uiForm.controls['OccupationCode'].value,
                'RootCauseEmployeeCode': this.uiForm.controls['RootCauseEmployeeCode'].value,
                'RootCauseNotes': this.uiForm.controls['RootCauseNotes'].value,
                'CreatedByEmployeeCode': this.uiForm.controls['CreatedByEmployeeCode'].value
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.postRecordData('', { 'action': '1' }, postData).subscribe(
                (data) => {
                    if (data.status === 'failure') {
                        this.errorService.emitError(data.oResponse);
                    } else {
                        if (data.hasError) {
                            this.messageModal.show(data, true);
                        }
                        else {
                            this.messageModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                            this.storeData = data;
                            this.updateMode = true;
                            this.addMode = false;
                            this.showAddBtn = true;
                            this.showDeleteBtn = true;
                            this.setFormData(data);
                            this.loadEmployeeTableData();
                            this.onUpdateMode(data);
                            this.riExchange.riInputElement.Disable(this.uiForm, 'RootCauseSelect');
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }
    public onCancel(): void {
        event.preventDefault();
        this.riMaintenanceCancelEvent = false;
        if (this.addMode) {
            let empCode = this.getControlValue('CreatedByEmployeeCode');
            let empSurName = this.getControlValue('CreatedByEmployeeSurname');
            for (let key in this.uiForm.controls) {
                if (this.uiForm.controls[key]) {
                    this.uiForm.controls[key].reset();
                }
            }

            this.setControlValue('RootCauseSelect', '');
            this.setControlValue('OccupationSelect', '');
            this.setControlValue('CreatedByEmployeeCode', empCode);
            this.setControlValue('CreatedByEmployeeSurname', empSurName);
            this.riMaintenance_BeforeAdd();
        }
        else if (this.updateMode) {
            this.setFormData(this.storeData);
            this.loadEmployeeTableData();
        }
    }
    public onUpdateMode(data: any): any {
        this.updateMode = true;
        this.addMode = false;
        this.showControlBtn = true;
        this.saveBtn = true;
    }
    public btnAdd_onClick(): void {
        this.updateMode = false;
        this.addMode = true;
        this.riMaintenance_BeforeAdd();
    }
    public onDelete(): void {
        this.actionMode = '3';
        this.promptModal.content = MessageConstant.Message.DeleteRecord;
        this.promptModal.show();
    }
    public setFormData(data: any): void {
        this.setControlValue('RootCauseSelect', data['RootCauseCode']);
        this.setControlValue('OccupationSelect', data['OccupationCode']);
        this.setControlValue('RootCauseNotes', data['RootCauseNotes']);
        this.setControlValue('CreatedByEmployeeCode', data['CreatedByEmployeeCode']);
        this.setControlValue('RootCauseEmployeeCode', data['RootCauseEmployeeCode']);
        this.setControlValue('CustomerContactNumber', data['CustomerContactNumber']);
    }
    public onAddeMode(): any {
        this.riMaintenance_BeforeAdd();
    }
}
