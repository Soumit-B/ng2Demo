import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { BaseComponent } from '../../base/BaseComponent';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { EmployeeSearchComponent } from '../search/iCABSBEmployeeSearch';


@Component({
    templateUrl: 'iCABSCMSMSRedirect.html',
    styles: [`
    textarea.form-control {
        min-height: 125px;
    }

  `]
})

export class SMSRedirectComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('promptModal') public promptModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('ellipsis') public ellipsis: EllipsisComponent;
    public pageId: string = '';
    public lookUpSubscription: Subscription;
    public errorMessage: string;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public modalConfig: Object;
    public showHeader = true;
    public employeeSearchComponent = EmployeeSearchComponent;
    public ellipsisQueryParams: any = {
        inputParamsemployee: {
            parentMode: 'LookUp'
        }
    };
    public controls = [
        { name: 'EmployeeCode', readonly: true, disabled: false, required: true },
        { name: 'EmployeeSurname', readonly: true, disabled: true, required: false },
        { name: 'SMSMessageText', readonly: true, disabled: false, required: true },
        { name: 'rowId', readonly: true, disabled: false, required: false },
        { name: 'SMSMessageID', readonly: true, disabled: false, required: false }
    ];
    public headerParams: any = {
        method: 'ccm/maintenance',
        operation: 'ContactManagement/iCABSCMSMSRedirect',
        module: 'rules'
    };
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMSMSREDIRECT;
        this.browserTitle = 'Redirect SMS Message';
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
        this.setControlValue('rowId', this.riExchange.getParentHTMLValue('SMSMessageRowID'));
        this.getMessage();
    }
    public getMessage(): void {
        let getSearch: URLSearchParams;
        getSearch = this.getURLSearchParamObject();
        getSearch.set(this.serviceConstants.Action, '0');
        getSearch.set('rowId', this.getControlValue('rowId'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, getSearch)
            .subscribe(
            (e) => {

                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                        this.messageModal.show(e.errorMessage);
                        this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
                    } else {
                        this.setControlValue('SMSMessageText', e.SMSMessageText);
                        this.setControlValue('EmployeeCode', e.EmployeeCode);
                        this.setControlValue('SMSMessageID', e.SMSMessageID);
                        this.getEmployeeSurname();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
    public promptSave(event: any): void {
        this.setControlValue(('SMSMessageText'), this.getControlValue('SMSMessageText').trim());
        if (this.riExchange.validateForm(this.uiForm)) {
            this.promptModal.show();
        }
    }
    public Cancel(): void {
        this.location.back();
    }
    public saveData(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '2');

        let postParams: any = {};
        postParams.SMSMessageROWID = this.getControlValue('rowId');
        postParams.SMSMessageID = this.getControlValue('SMSMessageID');
        postParams.EmployeeCode = this.getControlValue('EmployeeCode');
        postParams.SMSMessageText = this.getControlValue('SMSMessageText').trim();
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                        this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
                    } else {
                        this.location.back();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
    public onEmployeeDataReceived(data: any): void {
        this.setControlValue('EmployeeCode', data['EmployeeCode']);
        this.setControlValue('EmployeeSurname', data['EmployeeSurname']);
        this.setFormMode(this.c_s_MODE_UPDATE);
    }
    public getEmployeeSurname(): void {
        if (!this.getControlValue('EmployeeCode')) {
            this.setControlValue('EmployeeSurname', '');
            this.setFormMode(this.c_s_MODE_SELECT);
        }
        else {
            let getSearch: URLSearchParams;
            getSearch = this.getURLSearchParamObject();
            getSearch.set(this.serviceConstants.Action, '6');

            let postParams: any = {};
            postParams.Function = 'GetEmployeeSurname';
            postParams.EmployeeCode = this.getControlValue('EmployeeCode');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module,
                this.headerParams.operation, getSearch, postParams)
                .subscribe(
                (e) => {

                    if (e['status'] === 'failure') {
                        this.errorService.emitError(e['oResponse']);
                    } else {
                        if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                            this.errorService.emitError(e['oResponse']);
                        } else if (e['errorMessage']) {
                            this.errorService.emitError(e);
                            this.messageModal.show(e.errorMessage);
                            this.messageModal.show({ msg: e.errorMessage, title: 'Message' }, false);
                        } else {
                            this.setControlValue('EmployeeSurname', e.EmployeeSurname);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorMessage = error as any;
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
                );
        }
    }
}
