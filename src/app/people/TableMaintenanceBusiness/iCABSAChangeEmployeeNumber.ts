import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { BranchSearchComponent } from './../../internal/search/iCABSBBranchSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';

import { Component, Injector, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';

@Component({
    templateUrl: 'iCABSAChangeEmployeeNumber.html'
})

export class ChangeEmployeeNumberComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('newBranchNumberSearch') newBranchNumberSearch: BranchSearchComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;
    public queryParams: any = {
        operation: 'Application/iCABSAChangeEmployeeNumber',
        module: 'employee',
        method: 'people/maintenance',
        ActionSearch: '0',
        Actionupdate: '6',
        ActionEdit: '2',
        ActionDelete: '3',
        ActionInsert: '1'
    };

    public controls = [
        { name: 'EmployeeCode', readonly: false, disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'NewEmployeeCode', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'BranchNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'MoveType', readonly: true, disabled: false, required: false, value: 'ChangeBranch' },
        { name: 'NewBranchNumber', type: MntConst.eTypeInteger },
        { name: 'NewBranchName' }
    ];

    public pageId: string = '';
    public cmdSubmit: boolean = false;
    public isShowNewEmpNum: boolean = false;
    public isShowNewBranch: boolean = true;
    public showHeader: boolean = true;
    public showCloseButton: boolean = true;
    public modalTitle: string = '';
    public autoOpenSearch: boolean;
    public showErrorHeader: boolean = true;

    public selectNewBranchDisable: boolean = true;
    public selectReportDestinationDisable: boolean = true;
    public btnSaveDisable: boolean = true;
    public btnCancelDisable: boolean = true;
    public newEmployeeNumberEllipsisDisable: boolean = true;

    public dataSaved: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public BranchSearch: string;
    public moveTypeVal: string = 'ChangeBranch';
    public reportDestinationVal: string = 'ReportViewer';
    public lookUpSubscription: Subscription;

    public empSearchComponent = EmployeeSearchComponent;
    public employeeCode: string;
    public newEmployeeCode: string;
    public serviceBranchRequired: boolean;
    public isShowBatchSubmitted: boolean = false;
    public batchSubmittedText: string;
    public RowID;

    public mode: string;
    // message Modal popup
    public messageTitle: string;
    public messageContent: string;
    // Prompt Modal popup
    public promptTitle: string;
    public promptContent: string;
    public showPromptHeader: boolean = true;
    public inputParams: any = { 'parentMode': 'NewBranch' };
    public inputParamsEmployeeSearch: any = {
        'parentMode': 'Search'
    };
    public inputParamsNewEmployeeSearch: any = {
        'parentMode': 'Lookup-NewEmployee'
    };
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACHANGEEMPLOYEENUMBER;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
    }

    ngAfterViewInit(): void {
        this.autoOpenSearch = true;
    }

    public windowOnLoad(): void {
        this.cmdSubmit = true;
        this.disableControl('NewEmployeeCode', true);
        this.setMandatoryFields();
    }
    public onEmployeeDataReturn(data: any): void {
        this.employeeCode = data.EmployeeCode;
        this.setControlValue('EmployeeCode', data.EmployeeCode ? data.EmployeeCode : '');
        this.setControlValue('EmployeeSurname', data.fullObject.EmployeeSurname ? data.fullObject.EmployeeSurname : '');
        this.setControlValue('BranchNumber', data.fullObject.BranchNumber ? data.fullObject.BranchNumber : '');
        this.RowID = data.fullObject.ttEmployee;
        this.selectNewBranchDisable = false;
        this.selectReportDestinationDisable = false;
        this.btnSaveDisable = false;
        this.btnCancelDisable = false;
        this.newEmployeeNumberEllipsisDisable = false;
        this.disableControl('NewEmployeeCode', false);
        this.setFormMode(this.c_s_MODE_UPDATE);
    }
    public onNewEmployeeDataReturn(data: any): void {
        this.setControlValue('NewEmployeeCode', data.NewEmployeeCode);
        this.newEmployeeCode = data.NewEmployeeCode;
        this.newEmployeeCodeOnChange();
    }
    public lookUpCall(): void {
        let lookupIP = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'EmployeeCode': this.getControlValue('EmployeeCode')
                },
                'fields': ['EmployeeSurname', 'BranchNumber', 'RowID']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0].length !== 0) {
                this.selectNewBranchDisable = false;
                this.selectReportDestinationDisable = false;
                this.btnSaveDisable = false;
                this.btnCancelDisable = false;
                this.newEmployeeNumberEllipsisDisable = false;
                this.disableControl('NewEmployeeCode', false);
                this.setControlValue('BranchNumber', data[0][0].BranchNumber ? data[0][0].BranchNumber : this.utils.getBranchCode());
                this.setControlValue('EmployeeSurname', data[0][0].EmployeeSurname ? data[0][0].EmployeeSurname : '');
                this.RowID = data[0][0].ttEmployee;
                this.setFormMode(this.c_s_MODE_UPDATE);
            }
            else {
                this.selectNewBranchDisable = true;
                this.selectReportDestinationDisable = true;
                this.btnSaveDisable = true;
                this.btnCancelDisable = true;
                this.newEmployeeNumberEllipsisDisable = true;
                this.disableControl('NewEmployeeCode', false);
                this.messageModal.show({ msg: MessageConstant.Message.RecordNotFound, title: this.pageTitle }, false);
            }
        });

    }
    public onBranchDataReceived(obj: any): void {
        this.BranchSearch = obj.BranchNumber;
        this.setControlValue('NewBranchNumber', this.BranchSearch);
        this.setControlValue('NewBranchName', obj.BranchName);
        this.newBranchNumberOnChange();
    }

    public employeeCodeOnChange(employee: string): void {
        this.employeeCode = employee;
        if (employee) {
            this.setControlValue('EmployeeSurname', '');
            this.setControlValue('BranchNumber', '');
            this.lookUpCall();
        }
    }

    public newEmployeeCodeOnChange(): void {
        let newEmployeeCode = this.getControlValue('NewEmployeeCode');
        if ((this.moveTypeVal === 'CorrectNumber') && (newEmployeeCode !== '')) {
            this.cmdSubmit = false;
        }
        else {
            this.cmdSubmit = true;
        }
        //this.employeeCode = this.riExchange.riInputElement.GetValue(this.uiForm,'EmployeeCode');
        this.lookUpCall();
    }
    public newBranchNumberOnChange(): void {
        let newbranchnumber = this.getControlValue('NewBranchNumber');
        if ((this.moveTypeVal === 'ChangeBranch') && (newbranchnumber !== '')) {
            this.cmdSubmit = false;
        }
        this.lookUpCall();
    }
    // public btnUpdateOnClick(): void {
    //     this.cmdSubmit = false;
    //     this.mode = 'NEUTRAL';
    //     this.formData.EmployeeCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode');
    //     this.formData.BranchNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchNumber');
    //     this.setMandatoryFields();
    // }
    public riMaintenanceAfterAbandon(): void {
        if (this.dataSaved) {
            if (this.moveTypeVal === 'ChangeBranch') {
                this.mode = 'UPDATE';
                this.newBranchNumberSearch.active = {
                    id: this.formData.NewBranchNumber,
                    text: this.formData.NewBranchNumber + ' - ' + this.formData.NewBranchName
                };
            }
            else {
                this.mode = 'UPDATE';
                this.setControlValue('NewEmployeeCode', this.formData.NewEmployeeCode);
            }
        }
        else {
            this.uiForm.controls['NewEmployeeCode'].markAsUntouched();
            this.setControlValue('NewEmployeeCode', '');
            this.setControlValue('NewBranchNumber', '');
            this.setControlValue('NewBranchName', '');
            this.cmdSubmit = true;
            this.newBranchNumberSearch.active = {
                id: '',
                text: ''
            };
        }
    }
    public setMandatoryFields(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'EmployeeCode', true);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchNumber', true);
    }
    public moveTypeOnChange(move_type_val: string): void {
        this.cmdSubmit = true;
        this.moveTypeVal = move_type_val;
        switch (move_type_val) {
            case 'ChangeBranch':
                this.isShowNewEmpNum = false;
                this.isShowNewBranch = true;
                this.serviceBranchRequired = true;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewEmployeeCode', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewBranchNumber', true);
                break;
            case 'CorrectNumber':
                this.isShowNewEmpNum = true;
                this.isShowNewBranch = false;
                this.serviceBranchRequired = false;
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewEmployeeCode', true);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'NewBranchNumber', false);
                break;
            default:
                this.isShowNewEmpNum = false;
                this.isShowNewBranch = false;
        }
    }
    public reportDestinationOnChange(report_dest_val: string): void {
        this.reportDestinationVal = report_dest_val;
        if (this.reportDestinationVal === 'ReportViewer')
            this.newBranchNumberOnChange();
        else
            this.newEmployeeCodeOnChange();
    }

    public saveData(): void {
        let EmployeeCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'EmployeeCode');
        let NewBranchNumber_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'NewBranchNumber');
        let NewEmployeeCode_hasError = this.riExchange.riInputElement.isError(this.uiForm, 'NewEmployeeCode');

        if (this.moveTypeVal === 'CorrectNumber') {
            if (this.riExchange.validateForm(this.uiForm)) {
                this.promptTitle = MessageConstant.Message.ConfirmRecord;
                this.promptModal.show();
            }
        }
        else if (this.moveTypeVal === 'ChangeBranch') {
            if (this.riExchange.validateForm(this.uiForm) && (this.getControlValue('NewBranchNumber') !== '')) {
                this.promptTitle = MessageConstant.Message.ConfirmRecord;
                this.promptModal.show();
            }
            else {
                this.newBranchNumberSearch.branchsearchDropDown.isError = true;
                this.uiForm.controls['NewEmployeeCode'].markAsUntouched();
            }
        }
        // if (!EmployeeCode_hasError && !NewBranchNumber_hasError) {
        //     this.promptTitle = MessageConstant.Message.ConfirmRecord;
        //     this.promptModal.show();
        // }
    }

    public promptSave(): void {
        let searchparams: URLSearchParams = this.getURLSearchParamObject();
        searchparams.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        let saveData: Object = {};
        saveData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        saveData['EmployeeSurname'] = this.getControlValue('EmployeeSurname');
        saveData['BranchNumber'] = this.getControlValue('BranchNumber');
        saveData['ROWID'] = this.RowID;
        this.httpService.makePostRequest(
            this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchparams, saveData)
            .subscribe(
            (data) => {
                if (data['status'] === 'failure') {
                    this.errorService.emitError(data['oResponse']);
                } else {
                    if (data.errorMessage) {
                        this.messageContent = data.errorMessage;
                        this.messageModal.show();
                    } else {
                        this.dataSaved = true;
                        this.messageContent = MessageConstant.Message.RecordSavedSuccessfully;
                        this.messageModal.show();
                        this.formData.EmployeeCode = data.EmployeeCode;
                        this.formData.BranchNumber = data.BranchNumber;
                        this.formData.EmployeeSurname = data.EmployeeSurname;
                        this.formData.NewBranchNumber = this.getControlValue('NewBranchNumber');
                        this.formData.NewBranchName = this.getControlValue('NewBranchName');
                        this.formData.NewEmployeeCode = this.getControlValue('NewEmployeeCode');
                    }
                }
            },
            (error) => {
                this.errorModal.show(error, true);
            });
    }

    public submitReportRequest(): void {
        if (this.moveTypeVal === 'ChangeBranch') {
            let paramaterValue: string = this.moveTypeVal + '' + this.businessCode() + '' + this.getControlValue('EmployeeCode') + '' + this.getControlValue('BranchNumber') + '' + this.getControlValue('NewBranchNumber') + '' + '' + 'batch|ReportID';
            let date: Date = new Date();
            let startDate = this.globalize.parseDateToFixedFormat(date);
            let starttime = Math.round(date.getTime() / (1000 * 60 * 60));
            this.ajaxSource.next(this.ajaxconstant.START);
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '5');
            let bodyParams: Object = {};
            bodyParams['Description'] = 'Employee Change';
            bodyParams['ProgramName'] = 'iCABSEmployeeChange.p';
            bodyParams['StartDate'] = startDate;
            bodyParams['StartTime'] = starttime;
            bodyParams['Report'] = 'Batch';
            bodyParams['ParameterName'] = 'ModeBusinessCodeEmployeeCodeBranchNumberNewBranchNumberNewEmployeeCodeRepManDest';
            bodyParams['ParameterValue'] = paramaterValue;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
                (data) => {
                    this.isShowBatchSubmitted = true;
                    this.batchSubmittedText = data.fullError;
                    //this.messageModal.show({ msg: data.fullError, title: this.pageTitle }, false);
                },
                (error) => {
                    this.errorModal.show(error, true);
                });
        }
        else {
            let paramaterValue: string = this.moveTypeVal + '' + this.businessCode() + '' + this.getControlValue('EmployeeCode') + '' + this.getControlValue('BranchNumber') + '' + '' + this.getControlValue('NewEmployeeCode') + '' + 'batch|ReportID';
            let date: Date = new Date();
            let startDate = this.globalize.parseDateToFixedFormat(date);
            let starttime = Math.round(date.getTime() / (1000 * 60 * 60));
            this.ajaxSource.next(this.ajaxconstant.START);
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '5');
            let bodyParams: Object = {};
            bodyParams['Description'] = 'Employee Change';
            bodyParams['ProgramName'] = 'iCABSEmployeeChange.p';
            bodyParams['StartDate'] = startDate;
            bodyParams['StartTime'] = starttime;
            bodyParams['Report'] = 'Batch';
            bodyParams['ParameterName'] = 'ModeBusinessCodeEmployeeCodeBranchNumberNewBranchNumberNewEmployeeCodeRepManDest';
            bodyParams['ParameterValue'] = paramaterValue;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
                (data) => {
                    this.isShowBatchSubmitted = true;
                    this.batchSubmittedText = data.fullError;
                    //this.messageModal.show({ msg: data.fullError, title: this.pageTitle }, false);
                },
                (error) => {
                    this.errorModal.show(error, true);
                });
        }
    }
}
