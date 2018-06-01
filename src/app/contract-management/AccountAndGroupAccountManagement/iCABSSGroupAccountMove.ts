import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { URLSearchParams } from '@angular/http';
import { ActionTypes } from '../../actions/account';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({

    templateUrl: 'iCABSSGroupAccountMove.html'
})

export class GroupAccountMoveComponent extends BaseComponent implements OnInit {
    //@ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    public controls = [
        { name: 'GroupAccountNumber1', required: true, type: MntConst.eTypeInteger },
        { name: 'GroupName1', readonly: true, disabled: true, required: false },
        { name: 'GroupAgreementNumber1', readonly: true, disabled: true, required: false },
        { name: 'GroupAgreementDate1', disabled: true },
        { name: 'GroupContactName1', disabled: true },
        { name: 'GroupContactTelephone1', disabled: true },
        { name: 'GroupContactEMail1', disabled: true },
        { name: 'GroupAccountNumber2', required: true, type: MntConst.eTypeInteger },
        { name: 'GroupName2', readonly: true, disabled: true, required: false },
        { name: 'GroupAgreementNumber2', disabled: true },
        { name: 'GroupAgreementDate2', disabled: true },
        { name: 'GroupContactName2', disabled: true },
        { name: 'GroupContactTelephone2', disabled: true },
        { name: 'GroupContactEMail2', disabled: true }
    ];
    public isRequesting: boolean = false;
    public toGroupAccountAutoOpen: boolean = false;
    public fromGroupAccountAutoOpen: boolean = false;
    public toGroupAccountShowCloseButton: boolean = true;
    public fromGroupAccountShowCloseButton: boolean = true;
    public fromGroupAccountSearchComponent = GroupAccountNumberComponent;
    public toGroupAccountSearchComponent = GroupAccountNumberComponent;
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public showHeader: boolean = true;
    public promptTitle: string;
    public isFormEnabled: boolean = false;
    public statusMessage: string = 'This function moves all accounts attached to a given group account to another group account.';
    @ViewChild('toGroupAccountMoveEllipsis') toGroupAccountMoveEllipsis: EllipsisComponent;
    @ViewChild('fromGroupAccountMoveEllipsis') fromGroupAccountMoveEllipsis: EllipsisComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('groupAccountNumber1') groupAccountNumber1;
    public queryParams: any = {
        operation: 'System/iCABSSGroupAccountMove',
        module: 'group-account',
        method: 'contract-management/admin'
    };

    public inputParamsGrpAccNumber: any = {
        'parentMode': 'LookUp',
        showAddNew: false
    };
    public promptContent = '';

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSGROUPACCOUNTMOVE;
        // this.pageTitle = 'Batch Program Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.uiForm = this.formBuilder.group({});
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.utils.setTitle('Group Account Maintenance');
    }

    public onFromGroupAccountDataReceived(data: any, route: any): void {
        //console.log(data)
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAccountNumber1', data.GroupAccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupName1', data.GroupName);
        this.getDataForFromAccountNumber();
    }

    public onToGroupAccountDataReceived(data: any, route: any): void {

        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAccountNumber2', data.GroupAccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupName2', data.GroupName);
        this.getDataForToAccountNumber();
    }


    public getDataForFromAccountNumber(): any {
        //console.log('inside from')
        this.statusMessage = 'This function moves all accounts attached to a given group account to another group account.';
        let searchParams: URLSearchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('GroupAccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber1'));
        searchParams.set('Function', 'GetGroupAccountName');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchParams)
            .subscribe(
            (data) => {

                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupName1', data.GroupName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAgreementNumber1', data.GroupAgreementNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAgreementDate1', data.GroupAgreementDate);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactName1', data.GroupContactName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactTelephone1', data.GroupContactTelephone);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactEMail1', data.GroupContactEMail);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                //this.requestdata = data.records;
                // this.logoTypeSearchDropDown.updateComponent(this.requestdata);
            },
            error => {
                // this.errorMessage = error as any;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public getDataForToAccountNumber(): any {
        this.statusMessage = 'This function moves all accounts attached to a given group account to another group account.';
        let searchParams: URLSearchParams;
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('GroupAccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber2'));
        searchParams.set('Function', 'GetGroupAccountName');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchParams)
            .subscribe(
            (data) => {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupName2', data.GroupName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAgreementNumber2', data.GroupAgreementNumber);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupAgreementDate2', data.GroupAgreementDate);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactName2', data.GroupContactName);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactTelephone2', data.GroupContactTelephone);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'GroupContactEMail2', data.GroupContactEMail);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                // this.errorMessage = error as any;
            }
            );
    }

    public fromInputField_OnChange(e: any): void {
        this.getDataForFromAccountNumber();
    }

    public toInputField_OnChange(e: any): void {
        this.getDataForToAccountNumber();
    }

    public cmd_AccountMove_onclick(): void {
        let groupName1: any = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName1');
        let groupName2: any = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupName2');
        let promptMsg = 'Are you sure you wish to move all accounts currently attached to group account ^1^ to the group account ^2^.';
        this.getTranslatedValue(promptMsg, null).subscribe((res: string) => {
            if (res) {
                promptMsg = res;
            }
            let str1 = promptMsg.split('^1^');
            let str2 = str1[1].split('^2^');
            this.promptTitle = str1[0] + ' ' + this.getControlValue('GroupAccountNumber1') + ' ' + str2[0] + ' ' + this.getControlValue('GroupAccountNumber2');
        });
        if (groupName1 !== '' && groupName2 !== '') {
            /* *@TODO Message confirmation box */
            this.promptModal.show();
        } else {
            if (groupName1 === '') {

                this.uiForm.controls['GroupAccountNumber1'].setErrors({ required: true });
            }
            if (groupName2 === '') {
                this.uiForm.controls['GroupAccountNumber2'].setErrors({ required: true });

            }
        }



    }

    public promptSave(event: any): void {
        let postSearchParams: URLSearchParams;
        postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '0');
        postSearchParams.set('content-type', 'application/x-www-form-urlencoded');

        let postParams: any = {};
        postParams.Function = 'MoveGroupAccount';
        postParams.GroupAccountNumber1 = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber1');
        postParams.GroupAccountNumber2 = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber2');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorModal.show(e, true);
                } else {
                    let changeCount: any = e.ChangeCount;
                    let fromAccount: any = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber1');
                    let toAccount: any = this.riExchange.riInputElement.GetValue(this.uiForm, 'GroupAccountNumber2');
                    let messageBody = '^1^ accounts have been moved from group account ^2^ to group account ^3^.';
                    this.getTranslatedValue(messageBody, null).subscribe((res: string) => {
                        if (res) {
                            messageBody = res;
                        }
                        let str1 = messageBody.split('^1^');
                        let str2 = str1[1].split('^2^');
                        let str3 = str2[1].split('^3^');
                        messageBody = changeCount + ' ' + str2[0] + ' ' + fromAccount + ' ' + str3[0] + ' ' + toAccount + '.';
                        this.statusMessage = messageBody;
                    });
                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                // this.isFormEnabled = false;
                // this.uiForm.reset();
                // this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM }); //to clear PageData
                // this.groupAccountNumber1.nativeElement.focus();
                //this.formPristine();
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public disableForm(): void {
        this.isFormEnabled = false;
        this.statusMessage = 'This function moves all accounts attached to a given group account to another group account.';
        this.uiForm.reset();
        this.store.dispatch({ type: ActionTypes.CLEAR_DATA_FROM }); //to clear PageData
        this.groupAccountNumber1.nativeElement.focus();
        //this.formPristine();
    }
}
