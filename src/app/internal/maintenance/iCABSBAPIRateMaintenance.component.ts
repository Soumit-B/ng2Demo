import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSBAPIRateMaintenance.html'
})

export class RateMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public dateDisable: boolean;
    public pageTitle: string;
    public controls = [
        { name: 'APICode', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'APICodeDesc', readonly: true, disabled: true, required: true },
        { name: 'APIRateEffectDate', readonly: false, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'APIRate', readonly: false, disabled: false, required: true, type: MntConst.eTypeDecimal2 }
    ];
    public showHeader: boolean = true;
    public queryParams: any = {
        operation: 'Business/iCABSBAPIRateMaintenance',
        module: 'api',
        method: 'contract-management/admin'
    };
    public promptConfirmContent: any;
    public effectDate: Date;
    private search: any;
    public ROWID: any;
    private messages: any = {
        apiRateUpdateSuccess: MessageConstant.Message.RecordSavedSuccessfully,
        apiRateDeleteSuccess: MessageConstant.Message.RecordDeletedSuccessfully
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBAPIRATEMAINTENANCE;
        this.pageTitle = 'API Rate Maintenance';
    }

    @ViewChild('APIRateEffectDatePicker') APIRateEffectDatePicker: DatepickerComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('promptConfirmModalDelete') public promptConfirmModalDelete;
    @ViewChild('messageModal') public messageModal;

    ngOnInit(): void {
        super.ngOnInit();
        this.fetchTranslatedContent();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private fetchTranslatedContent(): void {
        this.getTranslatedValue(this.messages.apiRateUpdateSuccess, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.messages.apiRateUpdateSuccess = res;
                }
            });
        });
        this.getTranslatedValue(this.messages.apiRateDeleteSuccess, null).subscribe((res: string) => {
            this.zone.run(() => {
                if (res) {
                    this.messages.apiRateDeleteSuccess = res;
                }
            });
        });
    }
    /*
    *Set Page Mode on Window Load
    */
    private window_onload(): void {
        this.parentMode = this.riExchange.getParentMode();
        switch (this.parentMode) {
            case 'RowSelected':
                this.pageParams.mode = 'update';
                this.updateAPIRateForm();
                break;
            case 'SearchAdd':
                this.pageParams.mode = 'add';
                this.addApiRateForm();
                break;
            default:
                break;
        }
    }
    /*
    *Update Date Picker Value on Hidden Date Field
    */
    public dateSelectedValue(value: any): any {
        if (value && value.value) {
            this.uiForm.controls['APIRateEffectDate'].setValue(value.value);
        }
    };
    /*
    *Load Page in Update Mode
    */
    public updateAPIRateForm(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICode', this.riExchange.getParentHTMLValue('APICode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICodeDesc', this.riExchange.getParentHTMLValue('APICodeDesc'));
        this.setControlValue('APIRateEffectDate', this.riExchange.getParentHTMLValue('APIRateEffectDate'));
        this.effectDate = new Date(this.utils.convertDate(this.getControlValue('APIRateEffectDate')));
        this.dateDisable = true;
        this.pageParams.mode = 'update';
        this.parentMode = 'RowSelected';
        this.pageParams.isDeleteDisabled = false;
        this.pageParams.isAddDisabled = false;
        let lookupIP = [
            {
                'table': 'APIRate',
                'query': {
                    'APICode': this.riExchange.getParentHTMLValue('APICode'),
                    'BusinessCode': this.riExchange.getParentHTMLValue('BusinessCode'),
                    'APIRateEffectDate': this.getControlValue('APIRateEffectDate')
                },
                'fields': ['APIRate']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let result = data[0][0];
            if (result) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'APIRate', result.APIRate);
                this.ROWID = result.ttAPIRate;
            }
        });
    }
    /*
    *Load Page in Add Mode
    */
    public addApiRateForm(): void {
        this.pageParams.mode = 'add';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICode', this.riExchange.getParentHTMLValue('APICode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APICodeDesc', this.riExchange.getParentHTMLValue('APICodeDesc'));
        this.pageParams.isDeleteDisabled = true;
        this.resetForm();
        this.dateDisable = false;
        this.pageParams.isAddDisabled = true;
    }

    /**
     *   Cancel button click and Reset Form Based on Page Mode
     */

    public resetData(): void {
        if (this.pageParams.mode === 'add') {
            if (this.parentMode === 'SearchAdd') {
                this.addApiRateForm();
                this.resetForm();
            }
            else {
                this.updateAPIRateForm();
            }
        } else if (this.pageParams.mode === 'update') {
            this.updateAPIRateForm();
        }
        else {
            return;
        }
    }

    /**
     * Initialize or Clear Form
     */
    private resetForm(): void {
        this.APIRateEffectDatePicker.dtDisplay = '';
        this.effectDate = null;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'APIRate', '');
        this.uiForm.controls['APIRate'].markAsUntouched();
        this.uiForm.controls['APIRateEffectDate'].markAsUntouched();
    }


    /**
     * Save Button Click
     */
    public saveData(): void {
        this.uiForm.controls['APIRate'].markAsTouched();
        this.uiForm.controls['APIRateEffectDate'].markAsTouched();
        this.APIRateEffectDatePicker.validateDateField();
        if (this.uiForm.valid) {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    }

    /**
     * Delete button click
     */
    public deleteData(obj: any): void {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModalDelete.show();

    }

    /**
     * After confirmation service call to save/update/delete
     */
    public promptConfirm(type: any): void {
        let formdData: any = {};
        formdData['APICode'] = this.uiForm.controls['APICode'].value;
        switch (type) {
            case 'save':
                formdData['APIRate'] = this.globalize.parseDecimalToFixedFormat(this.uiForm.controls['APIRate'].value,2);
                if (this.pageParams.mode === 'update' && this.ROWID !== '') {
                    formdData['ROWID'] = this.ROWID;
                    this.saveAPIRate(formdData);
                } else {
                    formdData['ROWID'] = '';
                    formdData['APICode'] = this.uiForm.controls['APICode'].value;
                    formdData['APIRateEffectDate'] = this.globalize.parseDateToFixedFormat(this.uiForm.controls['APIRateEffectDate'].value);
                    this.addAPIRate(formdData);
                }
                break;
            case 'delete':
                formdData['APIRate'] = this.globalize.parseDecimalToFixedFormat(this.uiForm.controls['APIRate'].value,2);
                formdData['APICode'] = this.uiForm.controls['APICode'].value;
                formdData['ROWID'] = this.ROWID;
                this.deleteAPIRate(formdData);
                break;
            default:
                break;
        }
    }

    /**
     * Save APIRate
     */

    private saveAPIRate(data: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.messageModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                    } else {
                        if (e['fullError']) {
                            this.messageModal.show({ msg: e['fullError'], title: 'Error' }, false);
                            return;
                        }
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'APIRate', e.APIRate);
                        this.riExchange.setParentHTMLValue('APIRateEffectDate', this.utils.formatDate(e.APIRateEffectDate));
                        this.riExchange.setParentHTMLValue('BusinessCode', e.BusinessCode);
                        this.messageModal.show({ msg: this.messages.apiRateUpdateSuccess, title: 'Message' }, false);
                        this.uiForm.controls['APICode'].disable();
                        this.pageParams.mode = 'update';
                        this.parentMode = 'RowSelected';
                        this.pageParams.isDeleteDisabled = false;
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

    /**
     * Delete APIRate
     */

    private deleteAPIRate(data: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '3');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.messageModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                    } else {
                        if (e['fullError']) {
                            this.messageModal.show({ msg: e['fullError'], title: 'Error' }, false);
                            return;
                        }
                        this.messageModal.show({ msg: this.messages.apiRateDeleteSuccess, title: 'Message' }, false);
                        this.uiForm.controls['APICode'].disable();
                        this.uiForm.controls['APICodeDesc'].disable();
                        this.pageParams.isDeleteDisabled = false;
                        this.pageParams.mode = 'add';
                        this.parentMode = 'SearchAdd';
                        this.addApiRateForm();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

    /**
     * Add New APIRate
     */

    private addAPIRate(data: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '1');
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.messageModal.show({ msg: e['errorMessage'], title: 'Error' }, false);
                    } else {
                        if (e['fullError']) {
                            this.messageModal.show({ msg: e['fullError'], title: 'Error' }, false);
                            return;
                        }
                        this.messageModal.show({ msg: this.messages.apiRateUpdateSuccess, title: 'Message' }, false);
                        this.uiForm.controls['APICode'].disable();
                        this.riExchange.setParentHTMLValue('APIRateEffectDate', this.utils.formatDate(e.APIRateEffectDate));
                        this.riExchange.setParentHTMLValue('BusinessCode', e.BusinessCode);
                        this.pageParams.isDeleteDisabled = false;
                        this.pageParams.mode = 'update';
                        this.ROWID = e.ttAPIRate;
                        this.updateAPIRateForm();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

}
