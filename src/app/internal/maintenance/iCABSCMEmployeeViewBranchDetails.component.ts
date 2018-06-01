import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ErrorCallback } from './../../base/Callback';
import { MessageConstant } from './../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSCMEmployeeViewBranchDetails.html'
})

export class CMEmployeeViewBranchDetailsComponent extends BaseComponent implements OnInit, ErrorCallback {
    @ViewChild('errorModal') public errorModal;
    public pageId: string = '';
    public showMessageHeader: boolean = true;
    public controls = [
        { name: 'BranchNumber', readonly: false, disabled: true, required: false },
        { name: 'BranchName', readonly: false, disabled: true, required: false },
        { name: 'ContactName', readonly: false, disabled: true, required: false },
        { name: 'BranchTelephone', readonly: false, disabled: true, required: false },
        { name: 'BranchInternalTelephone', readonly: false, disabled: true, required: false },
        { name: 'BranchFax', readonly: false, disabled: true, required: false },
        { name: 'BranchInternalSalesTelephone', readonly: false, disabled: true, required: false },
        { name: 'BranchEmail', readonly: false, disabled: true, required: false },
        { name: 'BranchInternalServiceTelephone', readonly: false, disabled: true, required: false },
        { name: 'SalesEmail', readonly: false, disabled: true, required: false },
        { name: 'ServiceEmail', readonly: false, disabled: true, required: false }
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMEMPLOYEEVIEWBRANCHDETAILS;
        this.browserTitle = this.pageTitle = 'Branch Contact Details';
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.setErrorCallback(this);
        this.doLookup();
    }
    private doLookup(): any {
        let lookupIPSub: any = [
            {
                'table': 'branch',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'BranchNumber': this.riExchange.getParentHTMLValue('PassBranchNumber')
                },
                'fields': ['BranchNumber', 'BranchName', 'BranchInternalTelephone', 'BranchInternalSalesTelephone', 'BranchInternalServiceTelephone', 'ContactName', 'BranchTelephone', 'BranchFax', 'BranchEmail', 'ServiceEmail', 'SalesEmail']
            }];
        this.LookUp.lookUpPromise(lookupIPSub, 5).then(data => {
            for (let cntrl in data[0][0]) {
                if (data[0][0].hasOwnProperty(cntrl)) {
                    if (!data[0].length) {
                        this.errorService.emitError(MessageConstant.Message.noRecordFound);
                        return;
                    }
                    this.setControlValue(cntrl, data[0][0][cntrl]);
                }
            }
        }).catch(error => {
            this.errorService.emitError(MessageConstant.Message.GeneralError);
        });
    }
    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data, title: 'Error' }, false);
    }
}
