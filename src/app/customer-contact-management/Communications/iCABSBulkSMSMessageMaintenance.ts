import { ErrorCallback } from './../../base/Callback';
import { CCMModuleRoutes } from './../../base/PageRoutes';
import { Component, OnInit, OnDestroy, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OccupationSearchComponent } from './../../internal/search/iCABSSOccupationSearch.component';
import { URLSearchParams } from '@angular/http';

@Component({
    templateUrl: 'iCABSBulkSMSMessageMaintenance.html'
})

export class BulkSMSMessageMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit, ErrorCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;

    public pageId: string = '';
    public occSearchComponent = OccupationSearchComponent;
    public pageTitle: string = '';
    public occupationCode: string;
    public messageContent: string;
    public showHeader: boolean = true;
    public autoOpen: boolean;
    public showErrorHeader: boolean = true;
    public modalTitle: string = '';
    public messageTitle: string;
    public showMessageHeader: boolean = true;
    public queryParams: any = {
        operation: 'ContactManagement/iCABSBulkSMSMessageMaintenance',
        module: 'notification',
        methodtype: 'ccm/maintenance',
        action: '1'
    };

    public inputParamsOccupationalSearch: any = {
        'parentMode': 'LookUp-String',
        'OccupationCodeString': null
    };

    public controls = [
        { name: 'OccupationCode', required: true },
        { name: 'Message', required: true }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBULKSMSMESSAGEMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    }
    ngAfterViewInit(): void {
        // Set message call back
        this.setMessageCallback(this);
        this.autoOpen = true;

        // Set error message call back
        //this.setErrorCallback(this);
    }
    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };
    public onOccupationDataReturn(data: any): void {
        let val: string = '';
        if (data) {
            val = this.getControlValue('OccupationCode');
            if (val) {
                val = val + ',' + data;
            } else {
                val = data;
            }
            this.setControlValue('OccupationCode', val);
            this.occupationSearchOnChange(val);

            //make CBB disable
            this.setFormMode(this.c_s_MODE_UPDATE);
        }
    }
    public window_onload(): void {
        this.setPageTitle(this.router.url);

    }
    private setPageTitle(url: string): void {
        let lvl: string = '';
        if (url) {
            if (url.search(CCMModuleRoutes.SENDBULKSMSBUSINESS) !== -1) {
                lvl = ' - Business';
            } else if (url.search(CCMModuleRoutes.SENDBULKSMSBRANCH) !== -1) {
                lvl = ' - Branch';
            } else if (url.search(CCMModuleRoutes.SENDBULKSMSACCOUNT) !== -1) {
                lvl = ' - Account';
            }
            this.pageTitle = this.pageTitle.concat(lvl);
        }
    }

    public occupationSearchOnChange(data: any): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OccupationCode', true);
        if (data) {
            this.setControlValue('OccupationCode', data);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', false);
        } else {
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', true);
        }
    }

    public smsMsgOnChange(data: any): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'Message', true);
        if (data.trim().length !== 0) {
            this.setControlValue('Message', data);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', false);
        } else {
            this.setControlValue('Message', '');
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', true);
        }
    }

    public save(): void {
        let occCode = this.getControlValue('OccupationCode');
        let msg = this.getControlValue('Message');
        if (msg.trim().length !== 0 && occCode.trim().length !== 0) {
            this.ajaxSource.next(this.ajaxconstant.START);
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            searchParams.set(this.serviceConstants.Action, this.queryParams.action);
            searchParams.set('OccupationCodeString', occCode);
            searchParams.set('SMSMessageText', msg);
            this.httpService.makeGetRequest(this.queryParams.methodtype, this.queryParams.module, this.queryParams.operation, searchParams).subscribe(
                (data) => {
                    if (data.hasError) {
                        this.errorService.emitError(data);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        else {
            this.setControlValue('Message', '');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OccupationCode', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'Message', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', true);
        }
    }
    public cancel(): void {
        this.setControlValue('OccupationCode', '');
        this.setControlValue('Message', '');
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', false);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', false);

        //make CBB enable
        this.setFormMode(this.c_s_MODE_SELECT);

    }

    public occupationCodekey_down(data: any): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'OccupationCode', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'OccupationCode', false);
    }

    public smsMsgkey_down(data: any): void {
        if (data.trim().length !== 0) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'Message', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'Message', false);
        }
    }
}

