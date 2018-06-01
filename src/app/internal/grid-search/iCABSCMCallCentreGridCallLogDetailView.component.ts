import { Logger } from '@nsalaun/ng2-logger';
import * as console from 'console';
import { Subscription } from 'rxjs/Rx';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Data, Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { SpeedScript } from './../../../shared/services/speedscript';
@Component({
    templateUrl: 'iCABSCMCallCentreGridCallLogDetailView.html'
})
export class CallCentreGridCallLogDetailViewComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public pageTitle: string = '';
    public CreatedDate: Date;
    public dateReadOnly: boolean = true;
    public controls = [
        { name: 'CallContactTelephone', readonly: false, disabled: true, required: false },
        { name: 'CallContactMobile', readonly: false, disabled: true, required: false },
        { name: 'CallContactFax', readonly: false, disabled: true, required: false },
        { name: 'CallSummary', readonly: false, disabled: true, required: false },
        { name: 'CreatedTime', readonly: false, disabled: true, required: false },
        { name: 'Duration', readonly: false, disabled: true, required: false },
        { name: 'CallLogID', readonly: false, disabled: true, required: false },
        { name: 'UserName', readonly: false, disabled: true, required: false },
        { name: 'CallContactPosition', readonly: false, disabled: true, required: false },
        { name: 'CallContactName', readonly: false, disabled: true, required: false },
        { name: 'CallDetails', readonly: false, disabled: true, required: false },
        { name: 'ClosedTime' },
        { name: 'ClosedDate' }
    ];

    public inputParams: any = {};
    public uiForm: FormGroup;
    public pageParams: any = {};
    public headerParams: any = {
        method: 'ccm/maintenance',
        module: 'call-centre',
        operation: 'ContactManagement/iCABSCMCallCentreGrid'
    };
    constructor(injector: Injector, public SpeedScript: SpeedScript) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCALLCENTREGRIDCALLLOGDETAILVIEW;
        this.uiForm = this.uiForm;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contact Centre - Log Details';
        this.getSysCharDtetails();
        this.utils.setTitle(this.pageTitle);
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [this.sysCharConstants.SystemCharDisableFirstCapitalOnAddressContact];
        let sysCharIP = {
            module: this.headerParams.module,
            operation: this.headerParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.SpeedScript.sysCharPromise(sysCharIP).then((data) => {
            if (data) {
                if (data.records && data.records.length > 0) {
                    let record = data.records[0];
                    this.pageParams.vSCCapitalFirstLtr = record.Required ? record.Required : false;
                }

                this.window_onload();
            }
        });
    }

    public window_onload(): void {

        this.setUifields();
        if (this.pageParams.vSCCapitalFirstLtr) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'CallLogID');
            this.riExchange.riInputElement.Disable(this.uiForm, 'UserName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'CallContactName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'CallContactPosition');
        }
        else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'CallLogID');
            this.riExchange.riInputElement.Disable(this.uiForm, 'UserName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'CallContactName');
            this.riExchange.riInputElement.Disable(this.uiForm, 'CallContactPosition');
        }
    }

    private setUifields(): any {
        let params = this.getURLSearchParamObject();
        params.set('action', '6');
        params.set('businessCode', this.utils.getBusinessCode());
        params.set('countryCode', this.utils.getCountryCode());
        let formdata = {
            'Function': 'GetCallLogDetailView',
            'BusinessCode': this.utils.getBusinessCode(),
            'CallLogID': this.riExchange.getParentHTMLValue('SelectedCallLogID')
        };

        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, params, formdata).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallLogID', this.riExchange.getParentHTMLValue('SelectedCallLogID'));
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'UserName', e.UserName);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallContactName', e.CallContactName);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallContactPosition', e.CallContactPosition);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallContactTelephone', e.CallContactTelephone);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallContactFax', e.CallContactFax);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallContactMobile', e.CallContactMobile);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallSummary', e.CallSummary);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CallDetails', e.CallDetails);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CreatedTime', e.CreatedTime);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Duration', e.Duration);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedDate', e.ClosedDate);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ClosedTime', e.ClosedTime);
                        if (e['CreatedDate']) {
                            let dateArr: Array<any>;
                            dateArr = e['CreatedDate'].toString().split('/');
                            if (dateArr.length >= 2)
                                this.CreatedDate = new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
                        }

                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (SpeedScript) {
            this.SpeedScript = null;
        }
    }
    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'CreatedDate', value.value);
        }
    }
}
