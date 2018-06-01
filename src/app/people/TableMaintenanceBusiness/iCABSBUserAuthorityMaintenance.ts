import { Component, OnInit, Injector, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { RouteAwayComponent } from './../../../shared/components/route-away/route-away';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSBUserAuthorityMaintenance.html',
    styles: [
        `.red-bdr span {border-color: red}
    `]
})
export class UserAuthorityMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('promptModal') public promptConfirmModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public lookUpSubscription: Subscription;
    public businessOption: Array<any> = [];
    public search: URLSearchParams;
    public method: string = 'it-functions/admin';
    public module: string = 'user';
    public operation: string = 'Business/iCABSBUserAuthorityMaintenance';
    public inputParams: any = {};
    public isAddMode: boolean = false;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public promptContent: string;
    public deleteMode: boolean = false;
    public pageTitle: string;
    public isRequesting: boolean = false;
    public disabledButton: boolean = true;
    public screenNotReadyComponent: any = ScreenNotReadyComponent;
    public autoOpenUser: boolean = false;
    public validateUserValue: boolean = false;
    public defaultBusinessvalue: string;
    public controls = [
        { name: 'UserCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'UserName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'DefaultBusinessInd', readonly: false, disabled: false, required: false },
        { name: 'FullAccessInd', readonly: false, disabled: false, required: false },
        { name: 'AllowViewOfSensitiveInfoInd', readonly: false, disabled: false, required: false },
        { name: 'AllowUpdateOfContractInfoInd', readonly: false, disabled: false, required: false },
        { name: 'AllowExportOfInformationInd', readonly: false, disabled: false, required: false },
        { name: 'ContactCreateSecurityLevel', readonly: false, disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'ClosureProcessInd', readonly: false, disabled: false, required: false },
        { name: 'ContactTypeDetailAmendInd', readonly: false, disabled: false, required: false },
        { name: 'ContactTypeDetailAmendInd', readonly: false, disabled: false, required: false },
        { name: 'CreateCallLogInCCMInd', readonly: false, disabled: false, required: false },
        { name: 'BusinessCode', readonly: true, disabled: false, required: false },
        { name: 'ROWID' }
    ];
    public pageId: string;
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBUSERAUTHORITYMAINTENANCE;
        this.browserTitle = this.pageTitle = 'User Authority Maintenance';
    }
    ngOnInit(): void {
        super.ngOnInit();
        //     this.pageTitle = 'User Authority Maintenance';
        this.inputParams.method = this.method;
        this.inputParams.module = this.module;
        this.inputParams.operation = this.operation;
        this.window_onload();
        //this.errirvalidation();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private window_onload(): void {
        this.disableControls(['UserCode']);
        this.doLookUpForBusiness();
    }

    public ngAfterViewInit(): void {
        this.autoOpenUser = true;
    }

    public onUserCodeBlur(event: any): void {
        this.setControlValue('UserName', '');
        this.setControlValue('DefaultBusinessInd', false);
        this.setControlValue('FullAccessInd', false);
        this.setControlValue('AllowViewOfSensitiveInfoInd', false);
        this.setControlValue('AllowUpdateOfContractInfoInd', false);
        this.setControlValue('AllowExportOfInformationInd', false);
        this.setControlValue('ContactCreateSecurityLevel', '');
        this.setControlValue('ClosureProcessInd', false);
        this.setControlValue('ContactTypeDetailAmendInd', false);
        this.setControlValue('CreateCallLogInCCMInd', false);
        this.setControlValue('BusinessCode', '');
        if (event.target.value === '?' || event.target.value === '"') {
            this.validateUserValue = true;
            this.disabledButton = true;
            this.disableControls(['UserCode']);
            this.setControlValue('UserName', '');
        } else {
            this.validateUserValue = false;
            this.riExchange.riInputElement.SetValue(this.uiForm, 'UserCode', event.target.value.toUpperCase());
            this.dolookUCallForUserCode();
        }


    }

    public selectedBusimessDefault(value: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BusinessCode', value);
        this.setControlValue('DefaultBusinessInd', false);
        this.setControlValue('FullAccessInd', false);
        this.setControlValue('AllowViewOfSensitiveInfoInd', false);
        this.setControlValue('AllowUpdateOfContractInfoInd', false);
        this.setControlValue('AllowExportOfInformationInd', false);
        this.setControlValue('ContactCreateSecurityLevel', '');
        this.setControlValue('ClosureProcessInd', false);
        this.setControlValue('ContactTypeDetailAmendInd', false);
        this.setControlValue('CreateCallLogInCCMInd', false);
        if (!this.isAddMode)
            this.doLookUpForUserAuthority();
    }

    private dolookUCallForUserCode(): void {
        let lookupIP = [
            {
                'table': 'UserInformation',
                'query': {
                    'UserCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'UserCode')
                },
                'fields': ['UserName']
            }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let UserInformation = data[0][0];
            if (UserInformation) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'UserName', UserInformation.UserName);
                if (!this.isAddMode)
                    this.doLookUpForUserAuthority();
            } else {
                this.uiForm.reset();
                //    this.setControlValue('BusinessCode', this.defaultBusinessvalue);
                this.riExchange.riInputElement.Enable(this.uiForm, 'UserCode');
                this.disableControls(['UserCode']);
                this.isRequesting = false;
                this.disabledButton = true;
                this.errorModal.show({ msg: MessageConstant.Message.noRecordFound }, false);
            }
        }).catch(e => {
            this.errorModal.show({ msg: MessageConstant.Message.noRecordFound }, false);
        });
    }

    public onAddClick(event: any): void {
        this.isAddMode = true;
        this.setControlValue('DefaultBusinessInd', false);
        this.setControlValue('FullAccessInd', false);
        this.setControlValue('AllowViewOfSensitiveInfoInd', false);
        this.setControlValue('AllowUpdateOfContractInfoInd', false);
        this.setControlValue('AllowExportOfInformationInd', false);
        this.setControlValue('ContactCreateSecurityLevel', '');
        this.setControlValue('ClosureProcessInd', false);
        this.setControlValue('ContactTypeDetailAmendInd', false);
        this.setControlValue('CreateCallLogInCCMInd', false);
    }

    public onBranchDetailsClick(event: any): void {
        if (this.getControlValue('ROWID')) {
            //     this.navigate('', 'iCABSBUserAuthorityBranchGrid.htm');
            this.errorModal.show({ msg: MessageConstant.Message.PageNotDeveloped }, false);
        } else {
            this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected }, false);
        }
    }

    private doLookUpForBusiness(): void {
        let lookupIP = [
            {
                'table': 'Business',
                'query': {
                },
                'fields': ['BusinessCode', 'BusinessDesc']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Business = data[0];
            if (Business) {
                for (let i = 0; i < Business.length; i++) {
                    if (i === 0 && Business[i].BusinessCode) {
                        this.defaultBusinessvalue = Business[i].BusinessCode;
                    }
                    this.businessOption.push({
                        'text': Business[i].BusinessCode + ' - ' + Business[i].BusinessDesc, 'value': Business[i].BusinessCode
                    });
                }

            }
        });
    }

    public doLookUpForUserAuthority(): void {
        this.isRequesting = true;
        let lookupIP = [
            {
                'table': 'UserAuthority',
                'query': {
                    'UserCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'UserCode'),
                    'BusinessCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'BusinessCode')
                },
                'fields': ['DefaultBusinessInd', 'FullAccessInd', 'AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd', 'AllowExportOfInformationInd', 'ContactCreateSecurityLevel', 'ClosureProcessInd', 'ContactTypeDetailAmendInd', 'CreateCallLogInCCMInd']
            }];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let UserAuthority = data[0][0];
            if (UserAuthority) {
                this.isRequesting = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DefaultBusinessInd', UserAuthority.DefaultBusinessInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'FullAccessInd', UserAuthority.FullAccessInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowViewOfSensitiveInfoInd', UserAuthority.AllowViewOfSensitiveInfoInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowUpdateOfContractInfoInd', UserAuthority.AllowUpdateOfContractInfoInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AllowExportOfInformationInd', UserAuthority.AllowExportofInformationInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactCreateSecurityLevel', UserAuthority.ContactCreateSecurityLevel);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosureProcessInd', UserAuthority.ClosureProcessInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContactTypeDetailAmendInd', UserAuthority.ContactTypeDetailAmendInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CreateCallLogInCCMInd', UserAuthority.CreateCallLogInCCMInd);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ROWID', UserAuthority.ttUserAuthority);
                this.pageParams['DefaultBusinessInd'] = UserAuthority.DefaultBusinessInd;
                this.pageParams['FullAccessInd'] = UserAuthority.FullAccessInd;
                this.pageParams['AllowViewOfSensitiveInfoInd'] = UserAuthority.AllowViewOfSensitiveInfoInd;
                this.pageParams['AllowUpdateOfContractInfoInd'] = UserAuthority.AllowUpdateOfContractInfoInd;
                this.pageParams['AllowExportOfInformationInd'] = UserAuthority.AllowExportofInformationInd;
                this.pageParams['ContactCreateSecurityLevel'] = UserAuthority.ContactCreateSecurityLevel;
                this.pageParams['ClosureProcessInd'] = UserAuthority.ClosureProcessInd;
                this.pageParams['ContactTypeDetailAmendInd'] = UserAuthority.ContactTypeDetailAmendInd;
                this.pageParams['CreateCallLogInCCMInd'] = UserAuthority.CreateCallLogInCCMInd;
                this.pageParams['ROWID'] = UserAuthority.ttUserAuthority;
                this.disabledButton = false;
                this.enableControls(['UserName']);
            } else {
                this.riExchange.riInputElement.Enable(this.uiForm, 'BusinessCode');
                this.riExchange.riInputElement.Enable(this.uiForm, 'UserCode');
                this.disableControls(['UserCode', 'BusinessCode']);
                this.isRequesting = false;
                this.disabledButton = true;
                if (this.getControlValue('BusinessCode') !== '')
                    this.errorModal.show({ msg: MessageConstant.Message.recordNotFound }, false);
            }
            this.formPristine();
        });
    }

    private postDataResponse(): void {
        this.formPristine();
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.BusinessCode, this.getControlValue('BusinessCode'));
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (!this.deleteMode) {
            if (this.isAddMode) {
                this.search.set(this.serviceConstants.Action, '1');
            } else {
                this.search.set(this.serviceConstants.Action, '2');
            }
            let formdata: Object = {};
            formdata['Table'] = 'UserAuthority';
            formdata['UserCode'] = this.getControlValue('UserCode');
            formdata['DefaultBusinessInd'] = ((this.getControlValue('DefaultBusinessInd') === true) ? 'true' : 'false');
            formdata['FullAccessInd'] = ((this.getControlValue('FullAccessInd') === true) ? 'true' : 'false');
            formdata['AllowViewOfSensitiveInfoInd'] = ((this.getControlValue('AllowViewOfSensitiveInfoInd') === true) ? 'true' : 'false');
            formdata['AllowUpdateOfContractInfoInd'] = ((this.getControlValue('AllowUpdateOfContractInfoInd') === true) ? 'true' : 'false');
            formdata['AllowExportOfInformationInd'] = ((this.getControlValue('AllowExportOfInformationInd') === true) ? 'true' : 'false');
            formdata['ContactCreateSecurityLevel'] = this.getControlValue('ContactCreateSecurityLevel');
            formdata['ClosureProcessInd'] = ((this.getControlValue('ClosureProcessInd') === true) ? 'true' : 'false');
            formdata['ContactTypeDetailAmendInd'] = ((this.getControlValue('ContactTypeDetailAmendInd') === true) ? 'true' : 'false');
            formdata['CreateCallLogInCCMInd'] = ((this.getControlValue('CreateCallLogInCCMInd') === true) ? 'true' : 'false');
            formdata['ROWID'] = this.getControlValue('ROWID');
            this.inputParams.search = this.search;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.isRequesting = true;
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
                .subscribe(
                (data) => {
                    this.isAddMode = false;
                    if (data.hasOwnProperty('errorMessage')) {
                        this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                    } else {
                        this.setControlValue('ROWID', data.ttUserAuthority);
                        this.errorModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: MessageConstant.Message.MessageTitle }, false);
                        this.pageParams.DefaultBusinessInd = this.getControlValue('DefaultBusinessInd');
                        this.pageParams['FullAccessInd'] = this.getControlValue('FullAccessInd');
                        this.pageParams['AllowViewOfSensitiveInfoInd'] = this.getControlValue('AllowViewOfSensitiveInfoInd');
                        this.pageParams['AllowUpdateOfContractInfoInd'] = this.getControlValue('AllowUpdateOfContractInfoInd');
                        this.pageParams['AllowExportOfInformationInd'] = this.getControlValue('AllowExportOfInformationInd');
                        this.pageParams.ContactCreateSecurityLevel = this.getControlValue('ContactCreateSecurityLevel');
                        this.pageParams['ClosureProcessInd'] = this.getControlValue('ClosureProcessInd');
                        this.pageParams['ContactTypeDetailAmendInd'] = this.getControlValue('ContactTypeDetailAmendInd');
                        this.pageParams['CreateCallLogInCCMInd'] = this.getControlValue('CreateCallLogInCCMInd');
                    }
                    this.isRequesting = false;
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.isRequesting = false;
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.search.set(this.serviceConstants.Action, '3');
            let formdata: Object = {};
            formdata['Table'] = 'UserAuthority';
            formdata['ROWID'] = this.getControlValue('ROWID');
            this.inputParams.search = this.search;
            this.isRequesting = true;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
                .subscribe(
                (data) => {
                    this.deleteMode = false;
                    //  this.isAddMode = false;
                    if (data.hasOwnProperty('errorMessage')) {
                        this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
                    } else {
                        this.errorModal.show({ msg: MessageConstant.Message.RecordDeletedSuccessfully }, false);
                        this.uiForm.reset();
                    }
                    this.isRequesting = false;
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.isRequesting = false;
                    this.deleteMode = false;
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }


    public onSaveClick(event: any): void {
        if (this['uiForm'].valid) {
            event.preventDefault();
            this.promptContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        } else {
            this.riExchange.riInputElement.isError(this.uiForm, 'ContactCreateSecurityLevel');
        }

    }

    public onCancelClick(event: any): void {
        this.setControlValue('DefaultBusinessInd', this.pageParams.DefaultBusinessInd);
        this.setControlValue('FullAccessInd', this.pageParams['FullAccessInd']);
        this.setControlValue('AllowViewOfSensitiveInfoInd', this.pageParams['AllowViewOfSensitiveInfoInd']);
        this.setControlValue('AllowUpdateOfContractInfoInd', this.pageParams['AllowUpdateOfContractInfoInd']);
        this.setControlValue('AllowExportOfInformationInd', this.pageParams['AllowExportOfInformationInd']);
        this.setControlValue('ContactCreateSecurityLevel', this.pageParams.ContactCreateSecurityLevel);
        this.setControlValue('ClosureProcessInd', this.pageParams['ClosureProcessInd']);
        this.setControlValue('ContactTypeDetailAmendInd', this.pageParams['ContactTypeDetailAmendInd']);
        this.setControlValue('CreateCallLogInCCMInd', this.pageParams['CreateCallLogInCCMInd']);
        this.setControlValue('ROWID', this.pageParams['ROWID']);
        this.formPristine();
    }

    public promptSave(): void {
        this.postDataResponse();
    }

    public onDeleteClick(event: any): void {
        event.preventDefault();
        if (this.getControlValue('ROWID')) {
            this.deleteMode = true;
            this.promptContent = MessageConstant.Message.DeleteRecord;
            this.promptConfirmModal.show();
        } else {
            this.errorModal.show({ msg: MessageConstant.Message.noRecordSelected }, false);
        }
    }
}
