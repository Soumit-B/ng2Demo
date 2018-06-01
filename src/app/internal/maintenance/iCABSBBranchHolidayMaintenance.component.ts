import { Component, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { OnInit, Injector } from '@angular/core';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { URLSearchParams } from '@angular/http';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { Observable } from 'rxjs/Observable';

@Component({
    templateUrl: 'iCABSBBranchHolidayMaintenance.html'
})

export class BranchHolidayMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('holidayDatePicker') holidayDatePicker: DatepickerComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    private search: any;
    public ROWID: any;
    public fromParent: boolean = false;
    public cancelFlag: boolean = false;
    public errorDateMsg: string = '';
    public holidayDate: any;
    public holidayDesc: any;
    public controls = [
        { name: 'BusinessCode' },
        { name: 'BusinessDesc' },
        { name: 'BranchNumber' },
        { name: 'BranchName' },
        { name: 'YearNumber' },
        { name: 'HolidayDate', required: 'true' },
        { name: 'HolidayDesc', required: 'true', type: MntConst.eTypeTextFree }
    ];

    public queryParams: any = {
        operation: 'Business/iCABSBBranchHolidayMaintenance',
        module: 'planning',
        method: 'service-planning/admin'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBRANCHHOLIDAYMAINTENANCE;
        this.browserTitle = 'Branch Holiday Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
    /*
    *Set Page Mode on Window Load
    */
    private window_onload(): void {
        switch (this.parentMode) {
            case 'Update':
                this.fromParent = true;
                this.updateBranchHolidayForm();
                break;
            case 'Add':
                this.populateFormData();
                break;
        }
    }

    /* Method to populate BusinessCode,Branch and Year */
    public populateFormData(): void {
        this.setControlValue('BusinessCode', this.businessCode());
        this.setControlValue('BusinessDesc', this.utils.getBusinessText());
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        let branchCodeWithDesc: string = this.utils.getBranchText(this.pageParams['vBranchCode']);
        let index: number = branchCodeWithDesc.indexOf('-');
        let branchDesc = branchCodeWithDesc.substring(index + 1);
        this.setControlValue('BranchName', branchDesc);
        this.setControlValue('YearNumber', this.riExchange.getParentHTMLValue('YearNumber'));
        this.pageParams.isDeleteDisabled = true;
        if (this.parentMode === 'Add')
            this.resetForm();
    }

    public updateBranchHolidayForm(): void {
        this.populateFormData();
        if (this.riExchange.getParentMode() !== 'Add') {
            this.setControlValue('HolidayDate', this.riExchange.getParentAttributeValue('HolidayDate'));
        }
        this.disableControl('HolidayDate', true);
        this.pageParams.isDeleteDisabled = false;
        if (this.fromParent) {
            this.search = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set('BranchNumber', this.getControlValue('BranchNumber'));
            this.search.set('HolidayDate', this.globalize.parseDateToFixedFormat(this.getControlValue('HolidayDate')).toString());
            this.ajaxSource.next(AjaxConstant.START);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
                .subscribe(
                (e) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (e.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                    } else {
                        this.setControlValue('HolidayDesc', e.HolidayDesc);
                        this.holidayDesc = e.HolidayDesc;
                        this.ROWID = e.ttBranchHoliday;
                    }

                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
                );

            this.fromParent = false;
        }
    }

    /* Initialize or Clear Form */
    private resetForm(): void {
        if (this.parentMode !== 'Update') {
            this.setControlValue('HolidayDate', '');
            this.setControlValue('HolidayDesc', '');
            this.disableControl('HolidayDate', false);
        } else {
            this.setControlValue('HolidayDate', this.riExchange.getParentAttributeValue('HolidayDate') || this.holidayDate);
            this.setControlValue('HolidayDesc', this.holidayDesc);
        }
        this.uiForm.controls['HolidayDate'].markAsUntouched();
        this.uiForm.controls['HolidayDesc'].markAsUntouched();
        this.formPristine();
    }

    /* Save button clicked method */
    public saveData(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            let promptObj: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.promptConfirm.bind(this));
            promptObj.data = 'save';
            this.modalAdvService.emitPrompt(promptObj);
        }
    }

    /* Delete Button clicked */
    public deleteData(obj: any): void {
        let promptObj: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.promptConfirm.bind(this));
        promptObj.data = 'delete';
        this.modalAdvService.emitPrompt(promptObj);

    }

    public promptConfirm(data: any): void {
        let formData: any = {};
        formData['BranchNumber'] = this.getControlValue('BranchNumber');
        formData['HolidayDesc'] = this.getControlValue('HolidayDesc');
        formData['HolidayDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('HolidayDate'));
        switch (data.data) {
            case 'save':
                if (this.parentMode === 'Update' && this.ROWID !== '') {
                    formData['ROWID'] = this.ROWID;
                    formData['Table'] = 'BranchHoliday';
                    this.updateBranchHoliday(formData);
                }
                else {
                    this.addBranchHoliday(formData);
                }
                break;
            case 'delete':
                formData['ROWID'] = this.ROWID;
                formData['BusinessCode'] = this.getControlValue('BusinessCode');
                this.deleteBranchHoliday(formData);
                break;
        }
    }

    public addBranchHoliday(data: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '1');
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                }
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.disableControl('HolidayDate', true);
                    this.parentMode = 'Update';
                    this.ROWID = e.ttBranchHoliday;
                    this.pageParams.isDeleteDisabled = false;
                    this.holidayDesc = e.HolidayDesc;
                    this.holidayDate = this.getControlValue('HolidayDate');
                    this.updateBranchHolidayForm();
                    this.formPristine();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }

    private updateBranchHoliday(data: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, data).subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.pageParams.mode = 'update';
                    this.disableControl('HolidayDate', true);
                    this.parentMode = 'Update';
                    this.pageParams.isDeleteDisabled = false;
                    this.formPristine();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }

    private deleteBranchHoliday(data: any): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '3');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                    this.parentMode = 'Add';
                    this.pageParams.isDeleteDisabled = false;
                    this.populateFormData();
                    this.formPristine();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }

    public holidayDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('HolidayDate', value.value);
        }
    }
}
