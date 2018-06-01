import { OnInit, OnDestroy, Injector, Component, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { RouteAwayComponent } from './../../../shared/components/route-away/route-away';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSCMCustomerContactNotificationsGrid.html'
})

export class CustomerContactNotificationsGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('promptModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    private inputParams: any = {
        method: 'ccm/maintenance',
        module: 'notification',
        operation: 'ContactManagement/iCABSCMCustomerContactNotificationsGrid'
    };
    private cREGDefaultNotifyType: string = '1';
    private isLoadingWindow: boolean;
    public pageId: string = '';
    public pageTitle: string;
    public promptTitle: string;
    public promptContent: string;
    public isIntNotifySubjectText: boolean = false;
    public controls = [
        { name: 'CustomerContactNumber', type: MntConst.eTypeCode },
        { name: 'ActionCount', type: MntConst.eTypeInteger },
        { name: 'CurrentTeamID', type: MntConst.eTypeTextFree },
        { name: 'ClosedDateTime', type: MntConst.eTypeTextFree },
        { name: 'ContactTypeDesc', type: MntConst.eTypeTextFree },
        { name: 'ContactTypeDetailDesc', type: MntConst.eTypeTextFree },
        { name: 'AccountNumber', type: MntConst.eTypeTextFree },
        { name: 'AccountName', type: MntConst.eTypeTextFree },
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeCode },
        { name: 'MaxLength', type: MntConst.eTypeInteger },
        { name: 'PremiseNumber', type: MntConst.eTypeTextFree },
        { name: 'PremiseName', type: MntConst.eTypeCode },
        { name: 'CurrLength', type: MntConst.eTypeInteger },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeCode },
        { name: 'IntNotifySubjectText', type: MntConst.eTypeTextFree },
        { name: 'IntNotifyBodyText', value: '0', type: MntConst.eTypeTextFree },
        { name: 'BusinessCode', type: MntConst.eTypeCode },
        { name: 'ServiceCoverNumber', type: MntConst.eTypeTextFree },
        { name: 'ClosedDate', value: '', type: MntConst.eTypeTextFree },
        { name: 'ClosedTime', value: '', type: MntConst.eTypeTextFree },
        { name: 'NextActionEmployeeCode', type: MntConst.eTypeTextFree },
        { name: 'IntNotifyTypeSelect', type: MntConst.eTypeTextFree },
        { name: 'InitialNotifyType' },
        { name: 'RunningFrom', type: MntConst.eTypeTextFree },
        { name: 'ContactTypeCode', type: MntConst.eTypeTextFree },
        { name: 'ContactTypeDetailCode', type: MntConst.eTypeTextFree },
        { name: 'CustomerContactName', type: MntConst.eTypeTextFree },
        { name: 'CustomerContactPosition', type: MntConst.eTypeTextFree },
        { name: 'CustomerContactTelephone', type: MntConst.eTypeTextFree },
        { name: 'ShortNarrative', type: MntConst.eTypeTextFree },
        { name: 'ContactNarrative', type: MntConst.eTypeTextFree },
        { name: 'CreatedByEmployeeCode', type: MntConst.eTypeTextFree },
        { name: 'CreatedDate', type: MntConst.eTypeTextFree },
        { name: 'CreatedTime', type: MntConst.eTypeTextFree },
        { name: 'OriginatingEmployeeCode', type: MntConst.eTypeTextFree },
        { name: 'DefaultAssigneeEmployeeCode', type: MntConst.eTypeTextFree },
        { name: 'CurrentCallLogID', type: MntConst.eTypeTextFree },
        { name: 'ContactStatusCode', type: MntConst.eTypeTextFree },
        { name: 'ScheduledCloseDate', type: MntConst.eTypeTextFree },
        { name: 'ContactName', type: MntConst.eTypeTextFree },
        { name: 'ContactPosition', type: MntConst.eTypeTextFree },
        { name: 'ContactTelephone', type: MntConst.eTypeTextFree },
        { name: 'ShortDescription', type: MntConst.eTypeTextFree },
        { name: 'ContactEmailAddress', type: MntConst.eTypeTextFree },
        { name: 'ContactMobileNumber', type: MntConst.eTypeTextFree },
        { name: 'ContactPostcode' },
        { name: 'Comments', type: MntConst.eTypeTextFree },
        { name: 'NextActionByDate', type: MntConst.eTypeTextFree },
        { name: 'NextActionByTime', type: MntConst.eTypeTextFree },
        { name: 'CurrentActionEmployeeName', type: MntConst.eTypeTextFree },
        { name: 'CurrentOwnerEmployeeName', type: MntConst.eTypeTextFree },
        { name: 'MaxSMSLengthError', type: MntConst.eTypeTextFree },
        { name: 'CurrentOwnerEmployeeCode', type: MntConst.eTypeTextFree },
        { name: 'CurrentActionEmployeeCode', type: MntConst.eTypeTextFree }
    ];
    public intNotifyTypeSelectArray: Array<any> = [];
    public isTdMessageLength: boolean = false;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCUSTOMERCONTACTNOTIFICATIONSGRID;
        this.pageTitle = 'Customer Contact Maintenance - Notifications';
        this.browserTitle = 'Customer Contact Notifications';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowsOnLoad();
        Observable.forkJoin(
            [this.getRegistrySetting(), this.getInitialValues()]).subscribe((data) => {
                if (data[0]) {
                    this.getRegistrySettingDetails(data[0]);
                }
                if (data[1]) {
                    this.getInitialFinalValues(data[1]);
                    this.onIntNotifyTypeSelectChange();
                    this.isLoadingWindow = false;
                }
            });

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    //////////////private method//////////////
    private windowsOnLoad(): void {
        this.isLoadingWindow = true;
        this.disableControls(['IntNotifySubjectText', 'IntNotifyBodyText', 'IntNotifyTypeSelect']);
        const controlsSize: number = this.controls.length;
        for (let i = 0; i < controlsSize; i++) {
            this.riExchange.getParentHTMLValue(this.controls[i].name);
        }
        this.setControlValue('InitialNotifyType', this.riExchange.getParentHTMLValue('IntNotifyType'));
        this.setControlValue('RunningFrom', this.parentMode);

        if (this.parentMode === 'CallOutEntry') {
            this.riExchange.getParentHTMLValue('ContactTypeCode');
            this.riExchange.getParentHTMLValue('ContactTypeDetailCode');
        } else {
            this.setControlValue('ContactTypeCode', this.riExchange.getParentHTMLValue('ContactTypeCodeSelect'));
            this.setControlValue('ContactTypeDetailCode', this.riExchange.getParentHTMLValue('ContactTypeDetailCodeSelect'));
        }
        this.setControlValue('ClosedDateTime', (this.getControlValue('ClosedDate') || '') + ' ' + (this.getControlValue('ClosedTime') || ''));
        this.getInitialValues();
        this.setControlValue('IntNotifySubjectText', this.riExchange.getParentHTMLValue('SaveIntNotifySubjectText'));
        this.setControlValue('IntNotifyBodyText', this.riExchange.getParentHTMLValue('SaveIntNotifyBodyText'));
        if (!this.getControlValue('IntNotifyBodyText')) {
            this.onCmdNewMessageClick();
        }
    }

    private getInitialFinalValues(data: any): void {
        let valArray: Array<string>;
        let descArray: Array<string>;
        let islDefaulted: boolean = false;
        if (data.hasError) {
            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            return;
        }
        this.setControlValue('AccountName', data.AccountName);
        this.setControlValue('ContactTypeDesc', data.ContactTypeDesc);
        this.setControlValue('ContactTypeDetailDesc', data.ContactTypeDetailDesc);
        this.setControlValue('MaxLength', data.MaxSMSLength);
        this.setControlValue('MaxSMSLengthError', data.MaxSMSLengthError);
        this.calcSMSLength();
        if (data.CanEmail === 'Y' && data.CanSMS === 'Y') {
            valArray = ['1', '2'];
            descArray = ['Email', 'SMS Message'];
        }
        else if (data.CanEmail === 'Y' && data.CanSMS === 'N') {
            valArray = ['1'];
            descArray = ['Email'];
        }
        else if (data.CanEmail === 'N' && data.CanSMS === 'Y') {
            valArray = ['2'];
            descArray = ['SMS Message'];
        }
        if (valArray && valArray.length) {
            const totalSize = valArray.length;
            for (let i = 0; i < totalSize; i++) {
                this.intNotifyTypeSelectArray.push(
                    {
                        text: descArray[i],
                        value: valArray[i]
                    }
                );
            }
        }

        if (this.cREGDefaultNotifyType === '1' && data.CanEmail === 'Y') {
            this.setControlValue('IntNotifyTypeSelect', '1');
            islDefaulted = true;
        }
        else if (this.cREGDefaultNotifyType === '2' && data.CanSMS === 'Y') {
            this.setControlValue('IntNotifyTypeSelect', '2');
            islDefaulted = true;
        }
        if (!islDefaulted) {
            if (data.CanSMS === 'Y') {
                this.setControlValue('IntNotifyTypeSelect', '2');
            } else {
                if (data.CanEmail === 'Y') {
                    this.setControlValue('IntNotifyTypeSelect', '1');
                }
            }
        }
        if (this.getControlValue('InitialNotifyType') !== '0') {
         this.setControlValue('IntNotifyTypeSelect', this.getControlValue('InitialNotifyType') || '');
        }
    }

    private getInitialValues(): any {
        let formdata: Object = {
            Function: 'GetInitialValues',
            AccountNumber: this.getControlValue('AccountNumber'),
            ContactTypeCode: this.getControlValue('ContactTypeCode'),
            ContactTypeDetailCode: this.getControlValue('ContactTypeDetailCode'),
            EmployeeCode: this.getControlValue('NextActionEmployeeCode'),
            CurrentActionEmployeeCode: this.getControlValue('NextActionEmployeeCode'),
            CurrentOwnerEmployeeCode: this.getControlValue('NextActionEmployeeCode')
        };
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = search;
        return this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata);
    }

    private calcSMSLength(): void {
        this.setControlValue('CurrLength', this.getControlValue('IntNotifyBodyText').toString().length);
    }

    private beforeSave(): boolean {
        if (this.getControlValue('IntNotifyTypeSelect') === '2') {
            this.calcSMSLength();
            if (this.getControlValue('MaxLength') && (parseInt(this.getControlValue('CurrLength').toString(), 10) > parseInt(this.getControlValue('MaxLength').toString(), 10))) {
                this.modalAdvService.emitError(new ICabsModalVO(this.getControlValue('MaxSMSLengthError')));
                return false;
            }
            return true;
        }
        return true;
    }

    private callServiceForSave(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '1');
        let formdata: Object = {
            CustomerContactNumber: this.getControlValue('CustomerContactNumber'),
            BusinessCode: this.utils.getBusinessCode(),
            AccountNumber: this.getControlValue('AccountNumber'),
            AccountName: this.getControlValue('AccountName'),
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            PremiseName: this.getControlValue('PremiseName'),
            ServiceCoverNumber: this.getControlValue('ServiceCoverNumber'),
            ProductCode: this.getControlValue('ProductCode'),
            ProductDesc: this.getControlValue('ProductDesc'),
            ClosedDate: this.getControlValue('ClosedDate'),
            ClosedTime: this.getControlValue('ClosedTime'),
            ContactTypeCode: this.getControlValue('ContactTypeCode'),
            ContactTypeDesc: this.getControlValue('ContactTypeDesc'),
            ContactTypeDetailCode: this.getControlValue('ContactTypeDetailCode'),
            ContactTypeDetailDesc: this.getControlValue('ContactTypeDetailDesc'),
            ActionCount: this.getControlValue('ActionCount'),
            IntNotifySubjectText: this.getControlValue('IntNotifySubjectText'),
            IntNotifyBodyText: this.getControlValue('IntNotifyBodyText')
        };
        this.inputParams.search = search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.formPristine();
                this.riExchange.setParentHTMLValue('IntNotifyType', this.getControlValue('IntNotifyTypeSelect'));
                this.riExchange.setParentHTMLValue('IntNotifySubjectText', this.getControlValue('IntNotifySubjectText'));
                this.riExchange.setParentHTMLValue('IntNotifyBodyText', this.getControlValue('IntNotifyBodyText'));
                this.location.back();
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private getRegistrySetting(): any {
        let lookupIP = [
            {
                'table': 'riRegistry',
                'query': {
                    'RegSection': 'Contact Centre Search',
                    'RegKey': this.utils.getBusinessCode() + '_' + 'Default Notification Type'
                },
                'fields': ['RegValue']
            }
        ];
        return this.LookUp.lookUpPromise(lookupIP);
    }

    private getRegistrySettingDetails(data: any): void {
        let record = data[0];
        if (record.length > 0) {
            record = record[0];
            this.cREGDefaultNotifyType = !record.RegValue ? '1' : record.RegValue;
        }
    }

    //////////public method///////////////////
    public onCmdNewMessageClick(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        this.inputParams.search = search;
        let formdata: Object = {
            Function: 'PopulateText',
            RunningFrom: this.getControlValue('RunningFrom'),
            CustomerContactNumber: this.getControlValue('CustomerContactNumber'),
            ContactTypeCode: this.getControlValue('ContactTypeCode'),
            ContactTypeDetailCode: this.getControlValue('ContactTypeDetailCode'),
            AccountNumber: this.getControlValue('AccountNumber'),
            ContractNumber: this.getControlValue('ContractNumber'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            ServiceCoverNumber: this.getControlValue('ServiceCoverNumber'),
            ProductCode: this.getControlValue('ProductCode'),
            EmployeeCode: this.getControlValue('NextActionEmployeeCode'),
            TemplateType: this.getControlValue('IntNotifyTypeSelect'),
            CustomerContactName: this.getControlValue('CustomerContactName'),
            CustomerContactPosition: this.getControlValue('CustomerContactPosition'),
            CustomerContactTelephone: this.getControlValue('CustomerContactTelephone'),
            ShortNarrative: this.getControlValue('ShortNarrative'),
            ContactNarrative: this.getControlValue('ContactNarrative'),
            CreatedByEmployeeCode: this.getControlValue('CreatedByEmployeeCode'),
            CurrentOwnerEmployeeCode: this.getControlValue('CurrentOwnerEmployeeCode'),
            CurrentActionEmployeeCode: this.getControlValue('CurrentActionEmployeeCode'),
            CreatedDate: this.getControlValue('CreatedDate'),
            CreatedTime: this.getControlValue('CreatedTime'),
            ClosedDate: this.getControlValue('ClosedDate'),
            ClosedTime: this.getControlValue('ClosedTime'),
            OriginatingEmployeeCode: this.getControlValue('OriginatingEmployeeCode'),
            DefaultAssigneeEmployeeCode: this.getControlValue('DefaultAssigneeEmployeeCode'),
            CurrentTeamID: this.getControlValue('CurrentTeamID'),
            CallLogID: this.getControlValue('CurrentCallLogID'),
            ContactStatusCode: this.getControlValue('ContactStatusCode'),
            ScheduledCloseDate: this.getControlValue('ScheduledCloseDate'),
            ContactName: this.getControlValue('ContactName'),
            ContactPosition: this.getControlValue('ContactPosition'),
            ContactTelephone: this.getControlValue('ContactTelephone'),
            ContactEmailAddress: this.getControlValue('ContactEmailAddress'),
            ContactMobileNumber: this.getControlValue('ContactMobileNumber'),
            ShortDescription: this.getControlValue('ShortDescription'),
            Comments: this.getControlValue('Comments'),
            NextActionByDate: this.getControlValue('NextActionByDate'),
            NextActionByTime: this.getControlValue('NextActionByTime'),
            NextActionEmployeeCode: this.getControlValue('NextActionEmployeeCode')
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module,
            this.inputParams.operation, this.inputParams.search, formdata)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.setControlValue('MaxLength', data.IntNotifyMaxSMSLength);
                this.setControlValue('IntNotifySubjectText', data.IntNotifySubjectText);
                this.setControlValue('IntNotifyBodyText', data.IntNotifyBodyText);
                this.calcSMSLength();
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public onSaveClick(): void {
        if (this.beforeSave()) {
            this.promptContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    }

    public onCancelClick(): void {
        this.formPristine();
        this.location.back();
    }

    public promptSave(event: any): void {
        this.callServiceForSave();
    }

    public onIntNotifyTypeSelectChange(): void {
        this.isIntNotifySubjectText = true;
        this.isTdMessageLength = false;
        if (this.getControlValue('IntNotifyTypeSelect') === '2') {
            this.calcSMSLength();
            this.isIntNotifySubjectText = false;
            this.isTdMessageLength = true;
        }
        if (!this.isLoadingWindow) {
            this.onCmdNewMessageClick();
        }
    }

    public afterChangingCalSMSLength(event: any): void {
        this.setControlValue('CurrLength', event.target.value.toString().length);
    }

}
