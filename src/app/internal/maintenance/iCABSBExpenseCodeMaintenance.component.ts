import { Component, OnInit, OnDestroy, AfterViewInit, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageCallback, ErrorCallback } from './../../base/Callback';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { ExpenseCodeSearchDropDownComponent } from './../search/iCABSBExpenseCodeSearch.component';

@Component({
    templateUrl: 'iCABSBExpenseCodeMaintenance.html'
})

export class ExpenseCodeMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy, MessageCallback, ErrorCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModalForSave') public promptModalForSave;
    @ViewChild('promptModalForDelete') public promptModalForDelete;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('expenseCodeDropdown') public expenseCodeDropdown: ExpenseCodeSearchDropDownComponent;

    private search: URLSearchParams = new URLSearchParams();
    private queryPost: URLSearchParams = this.getURLSearchParamObject();
    public pageId: string = '';
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public promptContentDelete: string = MessageConstant.Message.DeleteRecord;
    public messageContent: string = '';
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public controls: any[] = [
        { name: 'ExpenseCode', required: true, disabled: false },
        { name: 'ExpenseDesc', required: true, disabled: true }
    ];

    public muleConfig = {
        method: 'bill-to-cash/admin',
        module: 'charges',
        operation: 'Business/iCABSBExpenseCodeMaintenance'
    };
    public inputParamsExpenseCode = {
        'parentMode': 'LookUp'
    };
    public activeExpenseCode: Object = {
        id: '',
        text: ''
    };
    public rowId: string = '';
    public recordID: string = '';

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBEXPENSECODEMAINTENANCE;
        this.pageTitle = this.browserTitle = 'Expense Code Maintenance';
    };

    public ngOnInit(): void {
        super.ngOnInit();
    };

    public ngAfterViewInit(): void {
        this.setFormMode(this.c_s_MODE_SELECT);
        // Set message call back
        this.setMessageCallback(this);

        // Set error message call back
        this.setErrorCallback(this);

        this.pageParams = {
            'ExpenseCode': '',
            'ExpenseDesc': ''
        };
    };

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    };

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };

    // Initialization of Expense Code Search Dropdown
    public initExpenseCodeSearch(data: any): void {
        if (data.totalRecords === 0) this.addNewExpenseCode();
        else this.onExpenseCodeReceived(data.firstRow);
    }

    // Callback of Expence Code Search Dropdown selection
    public onExpenseCodeReceived(data: any): void {
        this.setControlValue('ExpenseCode', data.ExpenseCode);
        this.setControlValue('ExpenseDesc', data.ExpenseDesc);
        this.riExchange.riInputElement.Enable(this.uiForm, 'ExpenseDesc');
        this.pageParams.ExpenseCode = this.getControlValue('ExpenseCode');
        this.pageParams.ExpenseDesc = this.getControlValue('ExpenseDesc');
        this.rowId = data.ttExpenseCode;
        this.recordID = data.RecordID;
        this.setFormMode(this.c_s_MODE_UPDATE);
    };

    // Save Prompt
    public promptModalForSaveData(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.promptModalForSave.show();
    }

    // Save Expense Code
    public saveExpenseCode(): void {
        let formdata: any;
        if (this.formMode === this.c_s_MODE_ADD) {
            this.queryPost.set(this.serviceConstants.Action, '1');
            formdata = {
                BusinessCode: this.businessCode(),
                ExpenseCode: this.getControlValue('ExpenseCode'),
                ExpenseDesc: this.getControlValue('ExpenseDesc')
            };
        } else {
            this.queryPost.set(this.serviceConstants.Action, '2');
            formdata = {
                BusinessCode: this.businessCode(),
                ExpenseDesc: this.getControlValue('ExpenseDesc'),
                ROWID: this.rowId
            };
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.showErrorModal(data);
                else {
                    this.showMessageModal({ msg: MessageConstant.Message.RecordSavedSuccessfully });
                    if (this.formMode === this.c_s_MODE_UPDATE) {
                        this.rowId = data.ttExpenseCode;
                        this.recordID = data.RecordID;
                        this.pageParams.ExpenseCode = this.getControlValue('ExpenseCode');
                        this.pageParams.ExpenseDesc = this.getControlValue('ExpenseDesc');
                        this.expenseCodeDropdown.fetchExpenseCode();
                        this.activeExpenseCode = {
                            id: this.getControlValue('ExpenseCode'),
                            text: this.getControlValue('ExpenseCode') + ' - ' + this.getControlValue('ExpenseDesc')
                        };
                    } else {
                        this.addNewExpenseCode();
                    }
                    this.formPristine();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    // Add New Expense Code
    public addNewExpenseCode(): void {
        this.setFormMode(this.c_s_MODE_ADD);
        this.uiForm.reset();
        this.riExchange.riInputElement.Enable(this.uiForm, 'ExpenseDesc');
        this.pageParams = {
            'ExpenseCode': '',
            'ExpenseDesc': ''
        };
    };

    // Cancel Button operation
    public cancelExpenseCode(): void {
        if (this.formMode !== this.c_s_MODE_SELECT)
            if (this.formMode === this.c_s_MODE_ADD) {
                this.setFormMode(this.c_s_MODE_SELECT);
                this.uiForm.reset();
                this.activeExpenseCode = {
                    id: '',
                    text: ''
                };
            } else {
                this.setFormMode(this.c_s_MODE_UPDATE);
                this.setControlValue('ExpenseCode', this.pageParams.ExpenseCode);
                this.setControlValue('ExpenseDesc', this.pageParams.ExpenseDesc);
            }
        this.formPristine();
    };

    // Prompt for Delete
    public promptModalForDeleteData(): void {
        this.promptModalForDelete.show();
    }

    // Deleting Expense Code
    public deleteExpenseCode(): void {
        this.queryPost.set(this.serviceConstants.Action, '3');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ROWID: this.rowId
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.showErrorModal(data);
                else {
                    this.showMessageModal({ msg: MessageConstant.Message.RecordDeletedSuccessfully });
                    this.rowId = '';
                    this.recordID = '';
                    this.pageParams.ExpenseCode = '';
                    this.pageParams.ExpenseDesc = '';
                    this.uiForm.reset();
                    this.activeExpenseCode = {
                        id: '',
                        text: ''
                    };
                    this.riExchange.riInputElement.Enable(this.uiForm, 'ExpenseCode');
                    this.riExchange.riInputElement.Disable(this.uiForm, 'ExpenseDesc');
                    this.expenseCodeDropdown.fetchExpenseCode();
                    this.setFormMode(this.c_s_MODE_SELECT);
                    this.disableControl('ExpenseDesc', true);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };
}
