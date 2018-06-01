import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { Utils } from '../../../shared/services/utility';
import { EmployeeSearchComponent } from '../../internal/search/iCABSBEmployeeSearch';
import { BranchServiceAreaSearchComponent } from '../../internal/search/iCABSBBranchServiceAreaSearch';
import { ServiceCoverDetailsComponent } from './../search/iCABSAServiceCoverDetailSearch.component';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalGridSearchApplicationModuleRoutes } from '../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSCMCallOutMaintenance.html'
})

export class SCMCallOutMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('promptModal') public promptModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('visitTypeSearch') public visitTypeSearch;
    @ViewChild('serviceCoverDetailsEllipsis') public serviceCoverDetailsEllipsis: any;
    public pageId: string = '';
    public promptTitle: string = '';
    public promptContent: string = '';
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public requestParams: any = {
        operation: 'ContactManagement/iCABSCMCallOutMaintenance',
        module: 'callouts',
        method: 'ccm/maintenance'
    };
    public queryParams: any;
    public search: URLSearchParams = new URLSearchParams();
    public queryLookUp: URLSearchParams = new URLSearchParams();
    public querySysChar: URLSearchParams = new URLSearchParams();
    public callOutData: any;
    public visitTypeInputParams: any = {
        parentMode: 'LookUp-ByVisitAction',
        byVisitAction: 'True',
        systemVisitActionCode: ''
    };
    public menu: any = '';
    public controls = [
        { name: 'CustomerContactNumber', readonly: false, disabled: true, required: false },
        { name: 'PremiseAddressLine1', readonly: false, disabled: true, required: false },
        { name: 'ContactActionNumber', readonly: false, disabled: true, required: false },
        { name: 'PremiseAddressLine2', readonly: false, disabled: true, required: false },
        { name: 'ContractNumber', readonly: false, disabled: true, required: false },
        { name: 'ContractName', readonly: false, disabled: true, required: false },
        { name: 'PremiseAddressLine3', readonly: false, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: true, required: false },
        { name: 'PremiseName', readonly: false, disabled: true, required: false },
        { name: 'PremiseAddressLine4', readonly: false, disabled: true, required: false },
        { name: 'ServiceBranchNumber', readonly: false, disabled: true, required: false },
        { name: 'ServiceBranchName', readonly: false, disabled: true, required: false },
        { name: 'PremiseAddressLine5', readonly: false, disabled: true, required: false },
        { name: 'PremisePostCode', readonly: false, disabled: true, required: false },
        { name: 'ProductCode', readonly: false, disabled: true, required: false },
        { name: 'ProductDesc', readonly: false, disabled: true, required: false },
        { name: 'ServiceTypeCode', readonly: false, disabled: true, required: false },
        { name: 'ServiceTypeDesc', readonly: false, disabled: true, required: false },
        { name: 'CallOutQuantity', readonly: false, disabled: false, required: true },
        { name: 'Immediate', readonly: false, disabled: false, required: false },
        { name: 'CallOutTime', readonly: false, disabled: false, required: true, type: MntConst.eTypeTime },
        { name: 'CallOutNotes', readonly: false, disabled: false, required: true },
        { name: 'CallOutDate', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'SMSSendOnTime', readonly: false, disabled: false, required: false, type: MntConst.eTypeTime },
        { name: 'BranchServiceAreaCode', readonly: false, disabled: false, required: false },
        { name: 'EmployeeCode', readonly: false, disabled: false, required: true },
        { name: 'EmployeeSurname', readonly: false, disabled: true, required: false },
        { name: 'ContactName', readonly: false, disabled: false, required: false },
        { name: 'Passed', readonly: false, disabled: false, required: false },
        { name: 'ContactPosition', readonly: false, disabled: false, required: false },
        { name: 'PassedTime', readonly: false, disabled: true, required: false, type: MntConst.eTypeTime },
        { name: 'PassedDate', readonly: false, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'ContactStatusCodeSelect', readonly: false, disabled: true, required: false },
        { name: 'ContactTelephone', readonly: false, disabled: false, required: false },
        { name: 'SendClosedSMS', readonly: false, disabled: false, required: false },
        { name: 'ContactFax', readonly: false, disabled: false, required: false },
        { name: 'PlanVisitNumber', readonly: false, disabled: true, required: false },
        { name: 'ServiceCoverNumber', readonly: false, disabled: true, required: false },
        { name: 'VisitTypeCode', readonly: false, disabled: false, required: true },
        { name: 'cmdIntNotifications', disabled: true }
    ];
    public fieldVisibility: any = {
        CustomerContactNumber: true,
        PremiseAddressLine1: true,
        ContactActionNumber: true,
        PremiseAddressLine2: true,
        ContractNumber: true,
        ContractName: true,
        PremiseAddressLine3: false,
        PremiseNumber: false,
        PremiseName: true,
        PremiseAddressLine4: true,
        ServiceBranchNumber: false,
        ServiceBranchName: true,
        PremiseAddressLine5: true,
        PremisePostCode: true,
        ProductCode: true,
        ProductDesc: true,
        ServiceTypeCode: true,
        ServiceTypeDesc: true,
        CallOutQuantity: true,
        Immediate: true,
        CallOutTime: true,
        CallOutNotes: true,
        SMSSendOnTime: true,
        BranchServiceAreaCode: true,
        EmployeeCode: true,
        EmployeeSurname: true,
        ContactName: true,
        Passed: true,
        ContactPosition: true,
        PassedTime: true,
        ContactStatusCodeSelect: true,
        ContactTelephone: true,
        SendClosedSMS: false,
        ContactFax: true,
        PlanVisitNumber: true,
        ServiceCoverNumber: false,
        VisitTypeCode: false,
        menu: true
    };
    public fieldRequired: any = {
        CustomerContactNumber: false,
        PremiseAddressLine1: false,
        ContactActionNumber: false,
        PremiseAddressLine2: false,
        ContractNumber: false,
        ContractName: false,
        PremiseAddressLine3: false,
        PremiseNumber: false,
        PremiseName: false,
        PremiseAddressLine4: false,
        ServiceBranchNumber: false,
        ServiceBranchName: false,
        PremiseAddressLine5: false,
        PremisePostCode: false,
        ProductCode: false,
        ProductDesc: false,
        ServiceTypeCode: false,
        ServiceTypeDesc: false,
        CallOutQuantity: true,
        Immediate: false,
        CallOutTime: true,
        CallOutDate: true,
        CallOutNotes: true,
        SMSSendOnTime: false,
        BranchServiceAreaCode: false,
        EmployeeCode: true,
        EmployeeSurname: false,
        ContactName: false,
        Passed: false,
        ContactPosition: false,
        PassedTime: false,
        ContactStatusCodeSelect: false,
        ContactTelephone: false,
        SendClosedSMS: false,
        ContactFax: false,
        PlanVisitNumber: false,
        ServiceCoverNumber: false,
        VisitTypeCode: true,
        menu: false
    };
    public syschars: any = {
        vShowAddressLine3: '',
        vEnableSMSCalloutPrefix: '',
        vSMSCalloutPrefix: '',
        vSMSMaxLength: ''
    };
    public otherVariables: any = {
        gcClosedStatusList: '',
        cClosedStatusList: '',
        strDefaultVisitTypeCode: '',
        strDefaultVisitTypeDesc: '',
        cSaveContactStatusCode: '',
        SCRowID: '',
        ServiceCoverRowID: '',
        RequireBranchServiceArea: '',
        EnableBranchServiceArea: '',
        NextActionEmployeecode: '',
        ContactPassedToActioner: '',
        chkClosed: '',
        IntNotifyType: '',
        IntNotifySubjectText: '',
        IntNotifyBodyText: '',
        CurrentCallLogID: '',
        SaveIntNotifySubjectText: '',
        SaveIntNotifyBodyText: '',
        ContactStatusCode: '',
        ContractTypeCode: '',
        VisitActionCode: '',
        SystemVisitActionCode: ''
    };
    public dateObjects: any = {
        PassedDate: void 0,
        SMSSendOnDate: void 0,
        CallOutDate: void 0
    };
    public dateObjectsEnabled: any = {
        PassedDate: false,
        SMSSendOnDate: true,
        CallOutDate: true
    };
    public dateObjectsDisplay: any = {
        passedDateDisplay: '',
        smsSendDateDisplay: '',
        callOutDateDisplay: ''
    };

    public mode: any = {
        addMode: false,
        updateMode: false,
        selectMode: false
    };

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public ellipsis: any = {
        employeeSearch: {
            inputParamsEmployeeSearch: {
                parentMode: 'ContactManagement-CallOut',
                countryCode: '',
                businessCode: '',
                negativeBranchNumber: ''
            },
            isEmployeeSearchEllipsisDisabled: false,
            contentComponent: null
        },
        serviceArea: {
            inputParamsServiceArea: {
                parentMode: 'LookUp-Employee',
                countryCode: '',
                businessCode: '',
                ServiceBranchNumber: '',
                EmployeeCode: ''
            },
            isServiceAreaEllipsisDisabled: false,
            contentComponent: null
        },
        serviceCoverDetails: {
            showCloseButton: true,
            showHeader: true,
            inputParamsServiceCover: {
                'parentMode': 'CallOut',
                'ContractNumber': '',
                'PremiseNumber': '',
                'ProductCode': '',
                'ServiceCoverRowID': ''
            },
            disabled: false,
            contentComponent: null
        }
    };
    public showCloseButton: boolean = true;
    public visitTypeData: Array<any> = [];
    public visitTypeDataClone: Array<any> = [];
    public visitTypeItems: Array<any> = [];
    public visitTypeActive: Object = {};
    public contactStatusCodeSelectList: Array<any> = [];
    public showHeader: boolean = true;

    constructor(injector: Injector, private titleService: Title) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLOUTMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Call Out Maintenance';
        this.queryParams = this.riExchange.getRouterParams();
        this.visitTypeItems = ['VisitTypeCode', 'VisitTypeDesc'];
        this.ellipsis['employeeSearch']['contentComponent'] = EmployeeSearchComponent;
        this.ellipsis['serviceArea']['contentComponent'] = BranchServiceAreaSearchComponent;
        this.ellipsis['serviceCoverDetails']['contentComponent'] = ServiceCoverDetailsComponent;
        this.promptTitle = MessageConstant.Message.ConfirmRecord;
        this.otherVariables['IntNotifyType'] = this.riExchange.getParentHTMLValue('IntNotifyType') || '';
        this.otherVariables['IntNotifyTypeSelect'] = this.riExchange.getParentHTMLValue('IntNotifyTypeSelect');
        this.otherVariables['IntNotifySubjectText'] = this.riExchange.getParentHTMLValue('IntNotifySubjectText');
        this.otherVariables['IntNotifyBodyText'] = this.riExchange.getParentHTMLValue('IntNotifyBodyText');
        this.otherVariables['SaveIntNotifySubjectText'] = this.riExchange.getParentHTMLValue('SaveIntNotifySubjectText');
        this.otherVariables['SaveIntNotifyBodyText'] = this.riExchange.getParentHTMLValue('SaveIntNotifyBodyText');
        this.otherVariables['ContactStatusCode'] = this.riExchange.getParentHTMLValue('ContactStatusCode');
        this.otherVariables['CurrentCallLogID'] = this.riExchange.getParentHTMLValue('CurrentCallLogID');
        this.otherVariables['ContractTypeCode'] = this.riExchange.getParentHTMLValue('ContractTypeCode');
        this.otherVariables['ServiceCoverRowID'] = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
        this.otherVariables['AccountNumber'] = this.riExchange.getParentHTMLValue('AccountNumber') || '';
        this.otherVariables['ContactTypeCode'] = this.riExchange.getParentHTMLValue('ContactTypeCode');
        this.otherVariables['ContactTypeDetailCode'] = this.riExchange.getParentHTMLValue('ContactTypeDetailCode');
        this.otherVariables['chkClosed'] = this.riExchange.getParentHTMLValue('chkClosed');
        this.otherVariables['RequireBranchServiceArea'] = this.riExchange.getParentHTMLValue('RequireBranchServiceArea');
        this.otherVariables['EnableBranchServiceArea'] = this.riExchange.getParentHTMLValue('EnableBranchServiceArea');
        this.otherVariables['NextActionEmployeeCode'] = this.riExchange.getParentHTMLValue('NextActionEmployeeCode');
        this.fetchTranslationContent();
        this.setMessageCallback(this);
        this.setErrorCallback(this);
        this.triggerFetchSysChar();
        let data = [{
            'table': 'ContactStatus',
            'query': { 'ScheduledCloseStatusInd': 'FALSE' },
            'fields': ['ActiveInd', 'ScheduledCloseStatusInd', 'ContactStatusCode']
        },
        {
            'table': 'VisitType',
            'query': { 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['VisitTypeCode', 'VisitTypeDesc']
        }];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        for (let i = 0; i < e['results'][0].length; i++) {
                            if (!e['results'][0][i].ActiveInd) {
                                this.otherVariables['gcClosedStatusList'] = this.otherVariables['gcClosedStatusList'] + ',' + e['results'][0][i].ContactStatusCode + ',';
                                this.otherVariables['cClosedStatusList'] = this.otherVariables['gcClosedStatusList'];
                            }
                        }
                    }
                    if (e['results'][1].length > 0) {
                        //this.visitTypeData = e['results'][1];
                        this.visitTypeDataClone = e['results'][1];
                    }
                }
                this.postInit();
            }, (error) => {
                this.postInit();
            });
    }

    ngAfterViewInit(): void {
        if (!this.isReturningFlag) {
            this.pageParams = this.otherVariables;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public setAllSCRowID(value: any): void {
        this.otherVariables['ServiceCoverRowID'] = value;
        this.otherVariables['SCRowID'] = value;
    }

    public onEmployeeCodeChange(event: any): void {
        if (this.uiForm.controls['EmployeeCode']) {
            this.uiForm.controls['EmployeeCode'].setValue(this.uiForm.controls['EmployeeCode'].value.toString().trim());
            if (this.uiForm.controls['EmployeeCode'].value !== '') {
                this.ellipsis['serviceArea']['inputParamsServiceArea']['EmployeeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode');
                this.getEmployeeSurname();
                this.getEmployeeServiceArea();
                this.otherVariables['NextActionEmployeecode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode');
                if (event.target) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Passed', false);
                    this.onPassedChange({});
                }
            } else {
                this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
            }
        }
    }

    public onCallOutNotesChange(event: any): void {
        if (this.uiForm.controls['CallOutNotes'] && this.uiForm.controls['CallOutNotes'].value.toString().trim() === '') {
            this.uiForm.controls['CallOutNotes'].setValue('');
            this.uiForm.controls['CallOutNotes'].setErrors({});
        }
    }

    public onImmediateChange(event: any): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'Immediate')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutDate', this.globalize.parseDateToFixedFormat(new Date()));
            this.dateObjects.CallOutDate = new Date();
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutTime', moment(new Date()).format('HH:mm'));
        }
    }

    public onPassedChange(event: any): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'Passed')) {
            this.dateObjects['PassedDate'] = new Date();
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PassedTime', moment(new Date()).format('HH:mm'));
        } else {
            this.dateObjects['PassedDate'] = null;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PassedTime', '');
        }
    }

    public onContactStatusCodeSelectChange(event: any): void {
        if (this.otherVariables['cClosedStatusList'].indexOf(this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactStatusCodeSelect')) !== -1) {
            this.otherVariables['chkClosed'] = true;
        } else {
            this.otherVariables['chkClosed'] = false;
        }
        this.onChkClosedClick({});
    }

    public onChkClosedClick(event: any): void {
        if (this.otherVariables['chkClosed']) {
            this.fieldVisibility.SendClosedSMS = true;
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SendClosedSMS', false);
            this.fieldVisibility.SendClosedSMS = false;
        }
    }

    public onMenuChange(event: any): void {
        let strURLParameter;
        if (this.otherVariables['ContractTypeCode'] === 'C') {
            strURLParameter = 'Contract';
        } else if (this.otherVariables['ContractTypeCode'] === 'J') {
            strURLParameter = 'Job';
        } else if (this.otherVariables['ContractTypeCode'] === 'P') {
            strURLParameter = 'Product Sale';
        }

        switch (this.menu) {
            case 'ServiceDetail':
                // iCABSAServiceCoverDetailSearch
                /*this.router.navigate(['grid/application/ServiceCoverDetails'], { queryParams: {
                  parentMode: 'CallOut',
                  ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                  ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                  PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                  PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                  ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                  ProductDesc: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDesc'),
                  ServiceCoverROWID: this.otherVariables['ServiceCoverRowID']
                }});*/
                this.ellipsis.serviceCoverDetails.inputParamsServiceCover = {
                    parentMode: 'CallOut',
                    ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                    PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                    ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                    ProductDesc: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDesc'),
                    currentContractTypeURLParameter: strURLParameter,
                    ContractTypeCode: this.otherVariables['ContractTypeCode'],
                    ServiceCoverRowID: this.otherVariables['ServiceCoverRowID']
                };
                this.serviceCoverDetailsEllipsis.childConfigParams = this.ellipsis.serviceCoverDetails.inputParamsServiceCover;
                this.serviceCoverDetailsEllipsis.openModal();
                break;
            case 'ServiceVisit':
                // iCABSSeServiceVisitMaintenance
                /*this.router.navigate(['/iCABSSeServiceVisitMaintenance'], { queryParams: {
                  parentMode: 'CallOut'
                }});*/
                alert('Screen not developed yet');
                break;
            default:
                // code...
                break;
        }
    }

    public passedDateSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.dateObjectsDisplay['passedDateDisplay'] = value['value'];
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PassedDate', this.dateObjectsDisplay['passedDateDisplay']);
        } else {
            this.dateObjectsDisplay['passedDateDisplay'] = '';
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PassedDate', '');
        }
        this.uiForm.markAsDirty();
    }

    public smsSendDateSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.dateObjectsDisplay['smsSendDateDisplay'] = value['value'];
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSSendOnDate', this.dateObjectsDisplay['smsSendDateDisplay']);
        } else {
            this.dateObjectsDisplay['smsSendDateDisplay'] = '';
            this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSSendOnDate', '');
        }
        this.uiForm.markAsDirty();
    }

    public callOutDateSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.dateObjectsDisplay['callOutDateDisplay'] = value['value'];
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutDate', this.dateObjectsDisplay['callOutDateDisplay']);
        } else {
            this.dateObjectsDisplay['callOutDateDisplay'] = '';
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutDate', '');
        }
        this.uiForm.markAsDirty();
    }

    public visitTypeSelectedValue(value: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitTypeCode', value.VisitTypeCode || value.value);
        this.uiForm.markAsDirty();
    }

    public visitTypeDataRecieved(value: any): void {
        this.visitTypeDataClone = value;
        this.formPristine();
    }

    public onCmdIntNotificationsChange(event: any): void {
        this.pageParams = JSON.parse(JSON.stringify(this.otherVariables));
        this.navigate('CallOutEntry', InternalGridSearchApplicationModuleRoutes.ICABSCMCUSTOMERCONTACTNOTIFICATIONSGRID);
    }

    public onEmployeeDataReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', data.ContractSalesEmployee || data.EmployeeCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
        }
        this.ellipsis['serviceArea']['inputParamsServiceArea']['EmployeeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode');
        this.getEmployeeServiceArea();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'Passed', false);
        this.onPassedChange({});
        this.uiForm.markAsDirty();
    }

    public onServiceAreaReceived(data: any): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', data.BranchServiceAreaCode);
        }
        this.uiForm.markAsDirty();
    }

    public onCancel(event: any): void {
        this.formPristine();
        this.location.back();
    }

    public onSave(event: any): void {
        let result = this.beforeSave();
        if (result) {
            this.promptModal.show();
        }
    }

    public onCapitalize(control: any): void {
        this.uiForm.controls[control].setValue(this.utils.toTitleCase(this.uiForm.controls[control].value.toString()));
    }

    public onUpperCase(control: any): void {
        this.uiForm.controls[control].setValue(this.uiForm.controls[control].value.toString().toUpperCase());
    }


    public promptSave(event: any): void {
        let postData, action;
        action = 2;
        postData = {
            ServiceCoverRowID: this.otherVariables['ServiceCoverRowID'] ? this.otherVariables['ServiceCoverRowID'] : '',
            RequireBranchServiceArea: this.otherVariables['RequireBranchServiceArea'] ? 'yes' : 'no',
            EnableBranchServiceArea: this.otherVariables['EnableBranchServiceArea'] ? 'yes' : 'no',
            ServiceTypeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode'),
            ContactName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactName'),
            ContactPosition: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactPosition'),
            ContactTelephone: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactTelephone'),
            ContactFax: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactFax'),
            CustomerContactNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerContactNumber'),
            ContactActionNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactActionNumber'),
            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            ServiceCoverNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'),
            VisitTypeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitTypeCode'),
            Immediate: this.riExchange.riInputElement.GetValue(this.uiForm, 'Immediate') ? 'yes' : 'no',
            CallOutDate: this.riExchange.riInputElement.GetValue(this.uiForm, 'CallOutDate') || this.dateObjectsDisplay['callOutDateDisplay'],
            CallOutTime: this.globalize.parseTimeToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'CallOutTime')),
            CallOutQuantity: this.riExchange.riInputElement.GetValue(this.uiForm, 'CallOutQuantity'),
            CallOutNotes: this.riExchange.riInputElement.GetValue(this.uiForm, 'CallOutNotes'),
            EmployeeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'),
            PassedDate: this.riExchange.riInputElement.GetValue(this.uiForm, 'PassedDate') || this.dateObjectsDisplay['passedDateDisplay'],
            PassedTime: this.globalize.parseTimeToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'PassedTime')),
            PlanVisitNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PlanVisitNumber'),
            Closed: this.otherVariables['chkClosed'] ? 'yes' : 'no',
            ContactPassedToActioner: this.riExchange.riInputElement.GetValue(this.uiForm, 'Passed') ? 'yes' : 'no',
            SendClosedSMS: this.riExchange.riInputElement.GetValue(this.uiForm, 'SendClosedSMS') ? 'yes' : 'no',
            BranchNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'),
            BranchServiceAreaCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode'),
            SMSSendOnDate: this.riExchange.riInputElement.GetValue(this.uiForm, 'SMSSendOnDate') || this.dateObjectsDisplay['smsSendDateDisplay'],
            SMSSendOnTime: this.globalize.parseTimeToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'SMSSendOnTime')),
            IntNotifyType: this.otherVariables['IntNotifyType'] ? this.otherVariables['IntNotifyType'] : '',
            IntNotifySubjectText: this.otherVariables['IntNotifySubjectText'] ? this.otherVariables['IntNotifySubjectText'] : '',
            IntNotifyBodyText: this.otherVariables['IntNotifyBodyText'] ? this.otherVariables['IntNotifyBodyText'] : '',
            ContactStatusCode: this.otherVariables['ContactStatusCode'] ? this.otherVariables['ContactStatusCode'] : '',
            CurrentCallLogID: this.otherVariables['CurrentCallLogID'] ? this.otherVariables['CurrentCallLogID'] : ''
        };
        if (this.parentMode !== 'CreateCallOut') {
            postData = Object.assign({}, postData, {
                CallOutROWID: this.riExchange.getParentHTMLValue('CallOutROWID') || this.riExchange.getParentHTMLValue('ROWID') || this.riExchange.getParentHTMLValue('RowId')
            });
            action = 2;
        } else {
            postData = Object.assign({}, postData, {
                Function: 'GetEmployeeServiceArea'
            });
        }
        this.fetchCallOutPost('', { action: action }, postData).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (data['errorMessage'] || data['fullError']) {
                    this.errorService.emitError(data);
                } else {
                    // statement
                    this.messageService.emitMessage({
                        title: MessageConstant.Message.MessageTitle,
                        msg: MessageConstant.Message.RecordSavedSuccessfully
                    });
                    this.afterSave(data);
                }
            }
        });
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public showMessageModal(data: any): void {
        this.errorModal.show(data, false);
    }

    public onSMSSendOnTimeChange(event: any): void {
        this.validateTime('SMSSendOnTime');
    }

    public onCallOutTimeChange(event: any): void {
        this.validateTime('CallOutTime');
    }

    public onPassedTimeChange(event: any): void {
        this.validateTime('PassedTime');
    }

    public validateTime(control: any): void {
        let val = this.riExchange.riInputElement.GetValue(this.uiForm, control);
        if ((/^\d+$/.test(val) && val.length === 4)) {
            this.riExchange.riInputElement.SetValue(this.uiForm, control, val.substr(0, 2) + ':' + val.substr(2));
            if (!moment(this.riExchange.riInputElement.GetValue(this.uiForm, control), 'hh:mm', false).isValid()) {
                this.uiForm.controls[control].setErrors({});
            }
        } else {
            if (!(/^\d+$/.test(val.replace(':', '')) && val.replace(':', '').length === 4 && val.indexOf(':') === 2)) {
                this.uiForm.controls[control].setErrors({});
            }
        }
    }

    public toUpperCase(control: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, control, this.riExchange.riInputElement.GetValue(this.uiForm, control).toUpperCase());
    }

    public onQuantityChange(event: any): void {
        if (this.uiForm.controls['CallOutQuantity'].value !== '') {
            let val: any = '';
            if (!(this.uiForm.controls['CallOutQuantity'].value.split(',').length > 2)) {
                val = this.uiForm.controls['CallOutQuantity'].value.replace(/,/g, '.');
            }
            if (!isNaN(val)) {
                let integerPart = parseInt(val, 10);
                let narray = val.split('.'),
                    result = '0.' + (narray.length > 1 ? narray[1] : '0');

                if (Number(result) > 0.5) {
                    integerPart += 1;
                }
                if (!isNaN(integerPart)) {
                    this.uiForm.controls['CallOutQuantity'].setValue(integerPart.toString());
                }
            } else {
                if (/^[0-9]*[.]*/.test(val)) {
                    this.uiForm.controls['CallOutQuantity'].setValue(val.replace(/\./g, ''));
                }
            }
        }
    }

    public onVisitTypeFocus(event: any): void {
        // statement
        /*let elem = event.target.getElementsByClassName('ui-select-toggle');
        if (elem.length > 0) {
            elem[0]['focus']();
        }*/
    }

    private postInit(): void {
        switch (this.parentMode) {
            case 'CreateCallOut':
            case 'UpdateCallOut':
            case 'UpdateCallOut-ContactSearch':
                // code...
                break;

            default:
                // code...
                break;
        }

        switch (this.parentMode) {
            case 'CreateCallOut':
                this.mode['addMode'] = true;
                this.mode['updateMode'] = false;
                this.mode['selectMode'] = false;
                //this.riExchange.riInputElement.Disable(this.uiForm, 'menu');
                this.setAllSCRowID(this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'BranchServiceAreaCode', false);
                setTimeout(() => {
                    document.getElementById('Immediate').focus();
                }, 0);
                this.beforeAddMode();
                break;

            case 'UpdateCallOut':
                this.mode['addMode'] = false;
                this.mode['updateMode'] = false;
                this.mode['selectMode'] = true;
                //this.riExchange.riInputElement.Enable(this.uiForm, 'menu');
                this.beforeUpdateMode();
                this.fetchCallOutData('UpdateCallOut');
                break;

            case 'UpdateCallOut-ContactSearch':
                this.mode['addMode'] = false;
                this.mode['updateMode'] = true;
                this.mode['selectMode'] = false;
                //this.riExchange.riInputElement.Enable(this.uiForm, 'menu');
                this.beforeUpdateMode();
                this.fetchCallOutData('UpdateCallOut-ContactSearch');
                break;

            default:
                this.mode['addMode'] = false;
                this.mode['updateMode'] = false;
                this.mode['selectMode'] = false;
                break;
        }
        this.otherVariables['CurrentCallLogID'] = this.riExchange.getParentHTMLValue('CurrentCallLogID');
    }

    private beforeAddMode(): void {
        switch (this.parentMode) {
            case 'CreateCallOut':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerContactNumber', this.riExchange.getParentHTMLValue('CustomerContactNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactActionNumber', this.riExchange.getParentHTMLValue('ActionCount') || this.riExchange.getParentHTMLValue('ContactActionNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
                this.otherVariables['ServiceCoverRowID'] = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactName', this.riExchange.getParentHTMLValue('ContactName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactPosition', this.riExchange.getParentHTMLValue('ContactPosition'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTelephone', this.riExchange.getParentHTMLValue('ContactTelephone'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'Passed', (this.riExchange.getParentHTMLValue('chkContactPassedToActioner') && this.riExchange.getParentHTMLValue('chkContactPassedToActioner').toUpperCase() === GlobalConstant.Configuration.Yes) ? true : false);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactFax', this.riExchange.getParentHTMLValue('ContactFax'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutTime', this.riExchange.getParentHTMLValue('NextActionByTime'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSSendOnTime', this.riExchange.getParentHTMLValue('ActionFromTime'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutNotes', this.riExchange.getParentHTMLValue('Comments'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', this.riExchange.getParentHTMLValue('NextActionEmployeeCode'));
                if (this.riExchange.getParentHTMLValue('NextActionByDate')) {
                    /*if (moment(this.riExchange.getParentHTMLValue('NextActionByDate'), 'DD/MM/YYYY', true).isValid()) {
                        this.dateObjectsDisplay['callOutDateDisplay'] = this.utils.convertDateString(this.riExchange.getParentHTMLValue('NextActionByDate'));
                    }
                    if (!this.dateObjectsDisplay['callOutDateDisplay']) {
                        this.dateObjects['CallOutDate'] = null;
                    } else {
                        this.dateObjects['CallOutDate'] = new Date(this.dateObjectsDisplay['callOutDateDisplay']);
                        if (!moment(this.dateObjectsDisplay['callOutDateDisplay'], 'DD/MM/YYYY', true).isValid()) {
                            this.dateObjectsDisplay['callOutDateDisplay'] = this.utils.formatDate(new Date(this.dateObjectsDisplay['callOutDateDisplay']));
                        }
                    }*/
                    this.dateObjectsDisplay['callOutDateDisplay'] = this.globalize.parseDateToFixedFormat(this.riExchange.getParentHTMLValue('NextActionByDate'));
                    this.dateObjects['CallOutDate'] = this.globalize.parseDateStringToDate(this.dateObjectsDisplay['callOutDateDisplay']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutDate', this.dateObjectsDisplay['callOutDateDisplay']);

                }

                if (this.riExchange.getParentHTMLValue('ActionFromDate')) {
                    /*if (moment(this.riExchange.getParentHTMLValue('ActionFromDate'), 'DD/MM/YYYY', true).isValid()) {
                        this.dateObjectsDisplay['smsSendDateDisplay'] = this.utils.convertDateString(this.riExchange.getParentHTMLValue('ActionFromDate'));
                    }
                    if (!this.dateObjectsDisplay['smsSendDateDisplay']) {
                        this.dateObjects['SMSSendOnDate'] = null;
                    } else {
                        this.dateObjects['SMSSendOnDate'] = new Date(this.dateObjectsDisplay['smsSendDateDisplay']);
                        if (!moment(this.dateObjectsDisplay['smsSendDateDisplay'], 'DD/MM/YYYY', true).isValid()) {
                            this.dateObjectsDisplay['smsSendDateDisplay'] = this.utils.formatDate(new Date(this.dateObjectsDisplay['smsSendDateDisplay']));
                        }
                    }*/
                    this.dateObjectsDisplay['smsSendDateDisplay'] = this.globalize.parseDateToFixedFormat(this.riExchange.getParentHTMLValue('ActionFromDate'));
                    this.dateObjects['SMSSendOnDate'] = this.globalize.parseDateStringToDate(this.dateObjectsDisplay['smsSendDateDisplay']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSSendOnDate', this.dateObjectsDisplay['smsSendDateDisplay']);
                }
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutTime', moment(new Date()).format('HH:mm'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSSendOnTime', moment(new Date()).format('HH:mm'));
                break;
            default:
                let today = new Date();
                let tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutDate', this.globalize.parseDateToFixedFormat(new Date()));
                this.dateObjects.CallOutDate = tomorrow;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutTime', moment(new Date()).format('HH:mm'));
                break;
        }
        this.selectVisitCodeFromData({
            VisitTypeCode: this.otherVariables['strDefaultVisitTypeCode']
        });
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SendClosedSMS', false);
        this.otherVariables['chkClosed'] = false;
        this.fieldVisibility.ContactStatusCodeSelect = false;
        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdIntNotifications');
        this.getServiceCoverDetails();
        this.getCalloutMaintenanceSettings();
        this.getPremiseAddress();
        this.onPassedChange({});
    }

    private afterFetch(): void {
        this.otherVariables['SaveIntNotifySubjectText'] = this.otherVariables['IntNotifySubjectText'];
        this.otherVariables['SaveIntNotifyBodyText'] = this.otherVariables['IntNotifyBodyText'];
        this.otherVariables['cSaveContactStatusCode'] = this.otherVariables['ContactStatusCode'];
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PassedDate') !== '') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'Passed', true);
        }
        if (this.otherVariables['chkClosed']) {
            this.fieldVisibility.SendClosedSMS = true;
        } else {
            this.fieldVisibility.SendClosedSMS = false;
        }
        if (this.parentMode === 'UpdateCallOut-ContactSearch') {
            this.getServiceCoverRowIDForRecord();
        }
    }

    private beforeUpdateMode(): void {
        this.fieldVisibility.ContactStatusCodeSelect = true;
        this.riExchange.riInputElement.Enable(this.uiForm, 'cmdIntNotifications');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ContactStatusCodeSelect');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SendClosedSMS', false);
        setTimeout(() => {
            document.getElementById('Immediate').focus();
        }, 0);
    }

    private beforeSave(): boolean {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutNotes', this.riExchange.riInputElement.GetValue(this.uiForm, 'CallOutNotes').replace(/"/g, "'"));
        this.otherVariables['ContactStatusCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactStatusCodeSelect');
        this.otherVariables['IntNotifySubjectText'] = this.otherVariables['SaveIntNotifySubjectText'];
        this.otherVariables['IntNotifyBodyText'] = this.otherVariables['SaveIntNotifyBodyText'];
        if (this.mode['addMode']) {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber') === '') {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'ProductCode', true);
                return false;
            }
        }
        if (this.uiForm.controls) {
            for (let i in this.uiForm.controls) {
                if (this.uiForm.controls.hasOwnProperty(i)) {
                    if (this.uiForm.controls[i].enabled) {
                        this.uiForm.controls[i].markAsTouched();
                    } else {
                        this.uiForm.controls[i].clearValidators();
                    }
                }
            }
        }
        this.uiForm.updateValueAndValidity();
        let formValid = null;
        if (!this.uiForm.enabled) {
            formValid = true;
        } else {
            formValid = this.uiForm.valid;
        }
        return formValid;
    }

    private afterSave(data?: any): void {
        this.fetchCallOutPost('GetPlanVisitNumber', {}, { RowID: data['CallOut'] || this.riExchange.getParentHTMLValue('CallOutROWID') || this.riExchange.getParentHTMLValue('ROWID') || this.riExchange.getParentHTMLValue('RowId') }).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PlanVisitNumber', data['PlanVisitNumber']);

                }
                this.riExchange.riInputElement.Disable(this.uiForm, 'cmdIntNotifications');
            }
        });
        this.formPristine();
    }

    private getServiceCoverDetails(): void {
        this.fetchCallOutPost('GetServiceCoverDetails', {}, { SCRowID: this.otherVariables['ServiceCoverRowID'] }).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutQuantity', data['CallOutQuantity']);
                    this.otherVariables['ContractTypeCode'] = data['ContractTypeCode'];
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceBranchNumber', data['ServiceBranchNumber']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceBranchName', data['ServiceBranchName']);
                    this.ellipsis['serviceArea']['inputParamsServiceArea']['EmployeeCode'] = data['EmployeeCode'];
                    this.ellipsis['serviceArea']['inputParamsServiceArea']['ServiceBranchNumber'] = data['ServiceBranchNumber'];
                    this.ellipsis['employeeSearch']['inputParamsEmployeeSearch']['negativeBranchNumber'] = data['ServiceBranchNumber'];
                    this.ellipsis['employeeSearch']['inputParamsEmployeeSearch']['ServiceBranchNumber'] = data['ServiceBranchNumber'];
                    for (let i in data) {
                        if (data.hasOwnProperty(i)) {
                            if (this.uiForm.controls[i] !== undefined && this.uiForm.controls[i] !== null) {
                                this.riExchange.riInputElement.SetValue(this.uiForm, i, data[i]);
                                if (data[i].toUpperCase() === GlobalConstant.Configuration.Yes) {
                                    this.riExchange.riInputElement.SetValue(this.uiForm, i, true);
                                } else if (data[i].toUpperCase() === GlobalConstant.Configuration.No) {
                                    this.riExchange.riInputElement.SetValue(this.uiForm, i, false);
                                }
                            }
                        }
                    }
                    if (data['Immediate'].toString().trim().toUpperCase() === GlobalConstant.Configuration.Yes) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Immediate', true);
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Immediate', false);
                    }
                    if (data['RequiresQty'].toString().trim().toUpperCase() === GlobalConstant.Configuration.Yes) {
                        this.fieldVisibility.CallOutQuantity = true;
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutQuantity', '0');
                        this.fieldVisibility.CallOutQuantity = false;
                    }
                    if (data['VisitTypeCode'] && data['VisitTypeCode'] !== '') {
                        this.selectVisitCodeFromData(data);
                    }
                    if (data['ServiceTypeCode'] && data['ServiceTypeCode'] !== '') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeCode', data['ServiceTypeCode']);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', data['ServiceTypeDesc']);
                    }
                    this.onEmployeeCodeChange({});
                    this.fetchLookUpData();
                    //this.fetchCallOutData('CreateCallOut');
                }
            }
        });
    }

    private getServiceCoverRowIDForRecord(): void {
        let strRowID: string = '';
        this.fetchCallOutPost('GetServiceCoverRowIDForRecord', { RowID: this.callOutData['CallOut'] }, {}).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    this.setAllSCRowID(data['SCRowID']);
                    if (data['RequiresQty'].toUpperCase() === GlobalConstant.Configuration.Yes) {
                        this.fieldVisibility.CallOutQuantity = true;
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutQuantity', '0');
                        this.fieldVisibility.CallOutQuantity = false;
                    }

                    if (data['VisitTypeCode'] && data['VisitTypeCode'] !== '') {
                        this.selectVisitCodeFromData(data);
                    }

                    if (data['ServiceTypeCode'] && data['ServiceTypeCode'] !== '') {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeCode', data['ServiceTypeCode']);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', data['ServiceTypeDesc']);
                    }
                }
            }
        });
    }

    private getPremiseAddress(): void {
        this.fetchCallOutPost('GetPremiseAddress', { ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') }, {}).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine1', data['PremiseAddressLine1']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine2', data['PremiseAddressLine2']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine3', data['PremiseAddressLine3']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine4', data['PremiseAddressLine4']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine5', data['PremiseAddressLine5']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremisePostCode', data['PremisePostCode']);
                }
            }
        });
    }

    private getEmployeeSurname(): void {
        this.fetchCallOutPost('GetEmployeeSurname', {}, { EmployeeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') }).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data['EmployeeSurname']);

                }
            }
        });
    }

    private getServiceAreaRequired(): void {
        this.fetchCallOutPost('GetServiceAreaRequired', { EmployeeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'), BranchNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber') }, {}).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    this.otherVariables['RequireBranchServiceArea'] = data['RequireBranchServiceArea'].toUpperCase() === GlobalConstant.Configuration.Yes ? true : false;
                    this.otherVariables['EnableBranchServiceArea'] = data['EnableBranchServiceArea'].toUpperCase() === GlobalConstant.Configuration.Yes ? true : false;
                    this.setServiceAreaProperties();
                }
            }
        });
    }

    private getEmployeeServiceArea(): void {
        this.fetchCallOutPost('GetEmployeeServiceArea', { EmployeeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'), BranchNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber') }, {}).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse'] || data);
            } else {
                if (!data['errorMessage']) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', data['BranchServiceAreaCode']);
                    this.otherVariables['RequireBranchServiceArea'] = data['RequireBranchServiceArea'].toUpperCase() === GlobalConstant.Configuration.Yes ? true : false;
                    this.otherVariables['EnableBranchServiceArea'] = data['EnableBranchServiceArea'].toUpperCase() === GlobalConstant.Configuration.Yes ? true : false;
                    this.uiForm.controls['BranchServiceAreaCode'].enable();
                    //this.ellipsis.serviceArea.isServiceAreaEllipsisDisabled = false;
                    this.setServiceAreaProperties();
                } else {
                    this.errorService.emitError(data);
                    this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
                    this.ellipsis.serviceArea.isServiceAreaEllipsisDisabled = true;
                }
            }
        });
    }

    private setServiceAreaProperties(): void {
        if (this.otherVariables['RequireBranchServiceArea']) {
            this.fieldRequired['BranchServiceAreaCode'] = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', true);
        } else {
            this.fieldRequired['BranchServiceAreaCode'] = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'BranchServiceAreaCode', false);
        }

        if (this.otherVariables['EnableBranchServiceArea']) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'BranchServiceAreaCode');
            this.ellipsis.serviceArea.isServiceAreaEllipsisDisabled = false;
            if (this.otherVariables['RequireBranchServiceArea'] && this.riExchange.riInputElement.GetValue(this.uiForm, 'BranchServiceAreaCode') === '') {
                setTimeout(() => {
                    document.getElementById('BranchServiceAreaCode').focus();
                }, 0);
            }
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
            this.ellipsis.serviceArea.isServiceAreaEllipsisDisabled = true;
        }
    }

    private fetchCallOutData(type: string): any {
        this.fetchCallOutGet('', {
            action: '0',
            CallOutROWID: this.riExchange.getParentHTMLValue('CallOutROWID') || this.riExchange.getParentHTMLValue('ROWID'),
            CustomerContactNumber: this.riExchange.getParentHTMLValue('CustomerContactNumber') || this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerContactNumber'),
            ContactActionNumber: this.riExchange.getParentHTMLValue('ContactActionNumber') || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContactActionNumber'),
            ContractNumber: this.riExchange.getParentHTMLValue('ContractNumber') || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            PremiseNumber: this.riExchange.getParentHTMLValue('PremiseNumber') || this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            ServiceCoverNumber: this.riExchange.getParentHTMLValue('ServiceCoverNumber') || this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber')
        }).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    this.callOutData = data;
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CustomerContactNumber', data['CustomerContactNumber']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactActionNumber', data['ContactActionNumber']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data['ContractNumber']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data['PremiseNumber']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data['ProductCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', data['ServiceCoverNumber']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitTypeCode', data['VisitTypeCode']);
                    this.selectVisitCodeFromData(data);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Immediate', data['Immediate'].toUpperCase() === GlobalConstant.Configuration.Yes ? true : false);
                    //this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutTime', moment(moment.duration(Math.floor(moment.duration(parseInt(data['CallOutTime'], 10), 'seconds').asHours()) + ':' + moment.duration(parseInt(data['CallOutTime'], 10), 'seconds').minutes())._data).format('HH:mm'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutTime', data['CallOutTime']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutQuantity', data['CallOutQuantity']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutNotes', data['CallOutNotes']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', data['EmployeeCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PassedTime', data['PassedTime']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PlanVisitNumber', data['PlanVisitNumber']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceBranchNumber', data['BranchNumber']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', data['BranchServiceAreaCode']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSSendOnTime', data['SMSSendOnTime']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeCode', data['ServiceTypeCode']);
                    //this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSSendOnTime', data['SMSSendOnTime'] !== '' ? this.utils.secondsToHms(data['PassedTime']) : '');
                    this.otherVariables['ContactStatusCode'] = data['ContactStatusCode'];
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactName', data['ContactName']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactPosition', data['ContactPosition']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTelephone', data['ContactTelephone']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactFax', data['ContactFax']);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SendClosedSMS', data['SendClosedSMS'].toUpperCase() === GlobalConstant.Configuration.Yes ? true : false);
                    this.otherVariables['ContactPassedToActioner'] = data['ContactPassedToActioner'].toUpperCase() === GlobalConstant.Configuration.Yes ? true : false;
                    this.otherVariables['chkClosed'] = data['Closed'].toUpperCase() === GlobalConstant.Configuration.Yes ? true : false;
                    this.otherVariables['IntNotifyType'] = data['IntNotifyType'];
                    this.otherVariables['IntNotifySubjectText'] = data['IntNotifySubjectText'];
                    this.otherVariables['IntNotifyBodyText'] = data['IntNotifyBodyText'];
                    if (data['CallOutDate']) {
                        this.dateObjectsDisplay['callOutDateDisplay'] = this.globalize.parseDateToFixedFormat(data['CallOutDate']);
                        this.dateObjects['CallOutDate'] = this.globalize.parseDateStringToDate(this.dateObjectsDisplay['callOutDateDisplay']);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallOutDate', this.dateObjectsDisplay['callOutDateDisplay']);
                    }

                    if (data['PassedDate']) {
                        this.dateObjectsDisplay['passedDateDisplay'] = this.globalize.parseDateToFixedFormat(data['PassedDate']);
                        this.dateObjects['PassedDate'] = this.globalize.parseDateStringToDate(this.dateObjectsDisplay['passedDateDisplay']);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PassedDate', this.dateObjectsDisplay['passedDateDisplay']);
                    }

                    if (data['SMSSendOnDate']) {
                        this.dateObjectsDisplay['smsSendDateDisplay'] = this.globalize.parseDateToFixedFormat(data['SMSSendOnDate']);
                        this.dateObjects['SMSSendOnDate'] = this.globalize.parseDateStringToDate(this.dateObjectsDisplay['smsSendDateDisplay']);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'SMSSendOnDate', this.dateObjectsDisplay['smsSendDateDisplay']);
                    }
                    if (type === 'UpdateCallOut') {
                        this.setAllSCRowID(this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
                        this.getPremiseAddress();
                        this.beforeUpdateMode();
                    } else if (type === 'UpdateCallOut-ContactSearch') {
                        this.fetchLookUpData();
                        this.beforeUpdateMode();
                    }

                    this.otherVariables['NextActionEmployeeCode'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode');
                    this.ellipsis['serviceArea']['inputParamsServiceArea']['EmployeeCode'] = data['EmployeeCode'];
                    this.ellipsis['serviceArea']['inputParamsServiceArea']['ServiceBranchNumber'] = data['BranchNumber'];
                    this.ellipsis['employeeSearch']['inputParamsEmployeeSearch']['negativeBranchNumber'] = data['BranchNumber'];
                    this.ellipsis['employeeSearch']['inputParamsEmployeeSearch']['ServiceBranchNumber'] = data['BranchNumber'];
                    if (this.isReturningFlag) {
                        for (let prop in this.pageParams) {
                            if (this.pageParams.hasOwnProperty(prop)) {
                                if (!(this.pageParams[prop] === undefined || this.pageParams[prop] === null || this.pageParams[prop] === '')) {
                                    this.otherVariables[prop] = this.pageParams[prop];
                                }
                            }
                        }
                    }
                    this.fetchOtherData();
                    this.getCalloutMaintenanceSettings();
                    this.afterFetch();
                    this.formPristine();
                }
            }
        });
    }

    private fetchOtherData(): void {
        this.fetchCallOutGet('', {
            action: 5,
            ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            BranchNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber'),
            CallOutROWID: this.riExchange.getParentHTMLValue('CallOutROWID') || this.riExchange.getParentHTMLValue('ROWID'),
            EmployeeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode'),
            PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            ProductCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            VisitTypeCode: this.riExchange.riInputElement.GetValue(this.uiForm, 'VisitTypeCode')
        }).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    // statement
                }
            }
        });
    }

    private fetchLookUpData(): void {
        let data = [{
            'table': 'Product',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') },
            'fields': ['ProductDesc']
        },
        {
            'table': 'ServiceType',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ServiceTypeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceTypeCode') },
            'fields': ['ServiceTypeDesc']
        },
        {
            'table': 'Employee',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'EmployeeCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'EmployeeCode') },
            'fields': ['EmployeeSurname']
        },
        {
            'table': 'Contract',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') },
            'fields': ['ContractName', 'ContractTypeCode']
        },
        {
            'table': 'Premise',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') },
            'fields': ['PremiseName', 'PremiseAddressLine1', 'PremiseAddressLine2', 'PremiseAddressLine3', 'PremiseAddressLine4', 'PremiseAddressLine5', 'PremisePostCode']
        },
        {
            'table': 'Branch',
            'query': { 'BusinessCode': this.utils.getBusinessCode(), 'BranchNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber') },
            'fields': ['BranchName']
        }];
        this.lookUpRecord(data, 100).subscribe(
            (e) => {
                if (e['results'] && e['results'].length > 0) {
                    if (e['results'][0].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', e['results'][0][0].ProductDesc);
                    }
                    if (e['results'][1].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceTypeDesc', e['results'][1][0].ServiceTypeDesc);
                    }
                    if (e['results'][2].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', e['results'][2][0].EmployeeSurname);
                    }
                    if (e['results'][3].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', e['results'][3][0].ContractName);
                        this.otherVariables['ContractTypeCode'] = e['results'][3][0].ContractTypeCode;
                    }
                    if (e['results'][4].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', e['results'][4][0].PremiseName);
                        if (this.parentMode !== 'CreateCallOut') {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine1', e['results'][4][0].PremiseAddressLine1);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine2', e['results'][4][0].PremiseAddressLine2);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine3', e['results'][4][0].PremiseAddressLine3);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine4', e['results'][4][0].PremiseAddressLine4);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine5', e['results'][4][0].PremiseAddressLine5);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremisePostCode', e['results'][4][0].PremisePostcode);
                        }
                    }
                    if (e['results'][5].length > 0) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceBranchName', e['results'][5][0].BranchName);
                    }
                }
            }, (error) => {
                //error statement
            });
    }

    private getCalloutMaintenanceSettings(): void {
        this.fetchCallOutPost('GetCalloutMaintenanceSettings', { CustomerContactNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'CustomerContactNumber') }, {}).subscribe((data) => {
            if (data['status'] === GlobalConstant.Configuration.Failure) {
                this.errorService.emitError(data['oResponse']);
            } else {
                if (!data['errorMessage']) {
                    if (this.mode['addMode'] === true) {
                        if (data['VisitTypeCode'] !== '') {
                            this.otherVariables['strDefaultVisitTypeCode'] = data['VisitTypeCode'];
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitTypeCode', data['VisitTypeCode']);
                            this.selectVisitCodeFromData(data);
                        }
                        if (this.otherVariables['strDefaultVisitTypeCode'] === '') {
                            this.errorService.emitError({
                                errorMessage: MessageConstant.Message.VisitTypeNotSet
                            });
                        }
                    } else {
                        let contactStatusCodeList = data['ContactStatusCodeList'].split('^');
                        let contactStatusDescList = data['ContactStatusDescList'].split('^');
                        let arr = [];
                        for (let i = 0; i < contactStatusCodeList.length; i++) {
                            arr.push({
                                value: contactStatusCodeList[i],
                                desc: contactStatusDescList[i]
                            });
                        }
                        this.contactStatusCodeSelectList = arr;
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactStatusCodeSelect', this.otherVariables['cSaveContactStatusCode']);
                    }
                    this.otherVariables['SystemVisitActionCode'] = data['VisitActionCode'];
                    this.visitTypeInputParams.systemVisitActionCode = this.otherVariables['SystemVisitActionCode'];
                    this.visitTypeSearch.triggerDataFetch(this.visitTypeInputParams);
                    /*let dataLookUp = [
                      {
                        'table': 'VisitAction',
                        'query': { 'BusinessCode': this.utils.getBusinessCode(), 'SystemVisitActionCode': data['VisitActionCode'] },
                        'fields': [ 'VisitTypeCode']
                      }];
                      this.lookUpRecord(dataLookUp, 100).subscribe(
                        (e) => {
                          if (e['results'] && e['results'].length > 0) {
                            if (e['results'][0].length > 0) {
                                let arr = [];
                                for (let i = 0; i < e['results'][0].length; i++) {
                                    for (let j = 0; j < this.visitTypeDataClone.length; j++) {
                                        if (e['results'][0][i].VisitTypeCode === this.visitTypeDataClone[j].VisitTypeCode) {
                                            arr.push(this.visitTypeDataClone[j]);
                                        }
                                    }
                                }
                                this.visitTypeData = arr;
                            }
                          }
                      }, (error) => {

                      });*/
                }
            }
        });
    }

    private selectVisitCodeFromData(data: any): void {
        for (let i = 0; i < this.visitTypeDataClone.length; i++) {
            if (this.visitTypeDataClone[i].VisitTypeCode === data['VisitTypeCode'] || (this.visitTypeDataClone[i]['VisitType.VisitTypeCode'] === data['VisitTypeCode'])) {
                this.visitTypeActive = {
                    id: i,
                    text: data['VisitTypeCode'] + ' - ' + (this.visitTypeDataClone[i].VisitTypeDesc || this.visitTypeDataClone[i]['VisitType.VisitTypeDesc'])
                };
                this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitTypeCode', data['VisitTypeCode']);
                break;
            }
        }
    }

    private fetchCallOutGet(functionName: string, params: Object): any {
        let queryCallOut = new URLSearchParams();
        queryCallOut.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryCallOut.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryCallOut.set(this.serviceConstants.Action, '6');
            queryCallOut.set('Function', functionName);
        }
        for (let key in params) {
            if (key) {
                queryCallOut.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryCallOut);
    }

    private fetchCallOutPost(functionName: string, params: Object, formData: Object): any {
        let queryCallOut = new URLSearchParams();
        queryCallOut.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryCallOut.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (functionName !== '') {
            queryCallOut.set(this.serviceConstants.Action, '6');
            formData['Function'] = functionName;
        }
        for (let key in params) {
            if (key) {
                queryCallOut.set(key, params[key]);
            }
        }
        return this.httpService.makePostRequest(this.requestParams.method, this.requestParams.module, this.requestParams.operation, queryCallOut, formData);
    }

    private sysCharParameters(): string {
        let sysCharList = [
            this.sysCharConstants.SystemCharEnableAddressLine3,
            this.sysCharConstants.SystemCharEnableSMSCalloutPrefix
        ];
        return sysCharList.join(',');
    }

    private triggerFetchSysChar(): void {
        this.fetchSysChar(this.sysCharParameters()).subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError({
                        errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                    });
                    return false;
                }
                if (e.records && e.records.length > 0) {
                    this.syschars['vShowAddressLine3'] = e.records[0].Required;
                    if (!this.syschars['vShowAddressLine3']) {
                        this.fieldVisibility.PremiseAddressLine3 = false;
                    } else {
                        this.fieldVisibility.PremiseAddressLine3 = true;
                    }
                    this.syschars['vEnableSMSCalloutPrefix'] = e.records[1].Required;
                    this.syschars['vSMSCalloutPrefix'] = e.records[1].Text;
                    if (this.syschars['vEnableSMSCalloutPrefix']) {
                        this.syschars['vSMSMaxLength'] = 140 - (this.syschars['vSMSCalloutPrefix'].length) - 1;
                    } else {
                        this.syschars['vSMSMaxLength'] = 140;
                    }
                }
            });
    }

    private fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }

    private lookUpRecord(data: Object, maxresults: number): any {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    }

    private fetchTranslationContent(): void {
        this.getTranslatedValue('Call Out Maintenance', null).subscribe((res: string) => {
            if (res) {
                this.titleService.setTitle(res);
            }
        });

        this.getTranslatedValue('Notifications', null).subscribe((res: string) => {
            if (res) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'cmdIntNotifications', res);
            } else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'cmdIntNotifications', 'Notifications');
            }
        });
    }

    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): any {
        this.routeAwayGlobals.setSaveEnabledFlag(this.uiForm.dirty);
        return this.routeAwayComponent.canDeactivate();
    }
}

