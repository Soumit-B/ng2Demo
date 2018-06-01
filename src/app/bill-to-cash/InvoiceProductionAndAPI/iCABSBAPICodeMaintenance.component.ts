import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ICABSBAPICodeSearchComponent } from '../../internal/search/iCABSBAPICodeSearchComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';

@Component({
    templateUrl: 'iCABSBAPICodeMaintenance.html'

})
export class APICodeMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    public showHeader: boolean = true;
    public queryParams: any = {
        operation: 'Business/iCABSBAPICodeMaintenance',
        module: 'api',
        method: 'contract-management/admin'
    };
    public promptConfirmContent: any;
    private searchParams: any;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public autoOpenSearch: boolean = false;
    public currentContractType: string = '';
    private recievedAPICodeDesc: string = '';
    public APICodeSearchParams: any = {
        'parentMode': 'Search',
        'showAddNew': true
    };
    public isDisabledEllipsis: boolean = false;
    public isDisabledDetailButton: boolean = true;
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    public showCloseButton: boolean = true;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('promptConfirmModalDelete') public promptConfirmModalDelete;
    public apiSearchComponent = ICABSBAPICodeSearchComponent;
    public controls = [
        { name: 'APICode', readonly: true, disabled: true, required: true },
        { name: 'APICodeDesc', readonly: true, disabled: true, required: true }
    ];
    constructor(injector: Injector,
        private _router: Router) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBAPICODEMAINTENANCE;
    }

    /**
     * Receive API data from API code search
     */
    public onAPICodeDataReceived(Obj: any): void {
        if (Obj.mode && Obj.mode === 'add') {
            this.pageParams.mode = 'add';
            this.resetForm();
            this.uiForm.controls['APICode'].enable();
            this.uiForm.controls['APICodeDesc'].enable();
            this.pageParams.isDeleteDisabled = true;
            this.setFormMode(this.c_s_MODE_ADD);
            this.isDisabledEllipsis = true;
            this.pageParams.isSaveDisabled = false;
            this.pageParams.isCancelDisabled = false;
            this.isDisabledDetailButton = true;
        } else {
            this.uiForm.controls['APICode'].setValue(Obj.APICode);
            this.uiForm.controls['APICodeDesc'].setValue(Obj.APICodeDesc);
            this.recievedAPICodeDesc = Obj.APICodeDesc;
            this.uiForm.controls['APICodeDesc'].enable();
            this.uiForm.controls['APICode'].disable();
            this.pageParams.mode = 'update';
            this.attributes.ROWID = Obj.ttAPICode;
            this.pageParams.isDeleteDisabled = false;
            this.isDisabledDetailButton = false;
            this.isDisabledEllipsis = false;
            this.pageParams.isSaveDisabled = false;
            this.pageParams.isCancelDisabled = false;
            this.setFormMode(this.c_s_MODE_UPDATE);
        }

    }

    /**
     * Update APICode data after validation
     */

    private updateAPICode(data: any): void {
        this.searchParams = new URLSearchParams();
        this.searchParams.set(this.serviceConstants.Action, '2');
        this.searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchParams, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(e['errorMessage']);
                    } else {
                        this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                        this.uiForm.controls['APICode'].disable();
                        this.pageParams.isDeleteDisabled = false;
                        this.pageParams.isSaveDisabled = false;
                        this.pageParams.isCancelDisabled = false;
                        this.isDisabledEllipsis = false;
                        this.isDisabledDetailButton = false;
                        this.formPristine();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

    /**
     * Fetch APICode description
     */

    /*private getAPICodeDescription(): void {
        this.searchParams = new URLSearchParams();
        this.searchParams.set(this.serviceConstants.Action, '0');
        this.searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.searchParams.set('APICode', this.uiForm.controls['APICode'].value);
        this.searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchParams).subscribe(
            (data) => {
                try {
                    console.log('datammmmm', data);
                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }*/

    /**
     * Delete APICode data after validation
     */

    private deleteAPICode(data: any): void {
        this.searchParams = new URLSearchParams();
        this.searchParams.set(this.serviceConstants.Action, '3');
        this.searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchParams, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(e['errorMessage']);
                    } else {
                        this.messageModal.show({ msg: MessageConstant.Message.RecordDeleted, title: 'Message' }, false);
                        this.uiForm.controls['APICode'].disable();
                        this.uiForm.controls['APICodeDesc'].disable();
                        this.pageParams.isDeleteDisabled = true;
                        this.pageParams.isSaveDisabled = true;
                        this.pageParams.isCancelDisabled = true;
                        this.isDisabledDetailButton = true;
                        this.resetForm();
                        this.formPristine();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

    /**
     * Add APICode data after validation
     */

    private addAPICode(data: any): void {
        this.searchParams = new URLSearchParams();
        this.searchParams.set(this.serviceConstants.Action, '1');
        this.searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchParams, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    let errMsg = '';
                    if (e['errorMessage']) {
                        errMsg = e['errorMessage'];
                    } else if (e['fullError']) {
                        errMsg = e['fullError'];
                    } else {
                        errMsg = '';
                    }
                    if (errMsg !== '') {
                        this.messageModal.show({ msg: errMsg, title: 'Message' }, false);
                    } else {
                        this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                        this.uiForm.controls['APICode'].disable();
                        this.pageParams.isDeleteDisabled = false;
                        this.pageParams.isSaveDisabled = false;
                        this.pageParams.isCancelDisabled = false;
                        this.isDisabledEllipsis = false;
                        this.isDisabledDetailButton = false;
                        this.autoOpenSearch = false;
                        this.pageParams.mode = 'update';
                        this.recievedAPICodeDesc = data['APICodeDesc'];
                        this.attributes.ROWID = e.ttAPICode;
                        this.setFormMode(this.c_s_MODE_UPDATE);
                        this.formPristine();
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }


    /**
     * Save APICode and validation
     */
    public saveData(): void {
        for (let c in this.uiForm.controls) {
            if (this.uiForm.controls.hasOwnProperty(c)) {
                if (typeof this.uiForm.controls[c].value === 'undefined') {
                    this.uiForm.controls[c].setValue('');
                }
                this.uiForm.controls[c].markAsTouched();
            }

        }
        if (this.uiForm.valid) {
            this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
            this.promptConfirmModal.show();
        }
    }

    /**
     * After confirmation service call to add/update/delete
     */

    public promptConfirm(type: any): void {
        let formdData: any = {};
        formdData['APICode'] = this.uiForm.controls['APICode'].value;
        switch (type) {
            case 'save':
                formdData['APICodeDesc'] = this.uiForm.controls['APICodeDesc'].value;
                if (this.pageParams.mode === 'update' && this.attributes.ROWID !== '') {
                    formdData['ROWID'] = this.attributes.ROWID;
                    this.updateAPICode(formdData);
                } else {
                    this.addAPICode(formdData);
                }
                break;
            case 'delete':
                formdData['ROWID'] = this.attributes.ROWID;
                this.deleteAPICode(formdData);
                break;
            default:
                break;
        }
    }
    /**
     * Delete button click
     */

    public deleteData(obj: any): void {
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptConfirmModalDelete.show();

    }

    /**
     * Detail page navigation
     */

    public goDetails(): void {
        this.router.navigate(['application/apiRateSearch'], { queryParams: { APICode: this.uiForm.controls['APICode'].value, APICodeDesc: this.uiForm.controls['APICodeDesc'].value } });
    }

    /**
     *   Cancel button click
     */

    public resetData(): void {
        if (this.pageParams.mode === 'add') {
            this.resetForm();
            this.isDisabledEllipsis = false;
            this.uiForm.controls['APICode'].disable();
            this.uiForm.controls['APICodeDesc'].disable();
        } else if (this.pageParams.mode === 'update') {
            this.uiForm.controls['APICodeDesc'].setValue(this.recievedAPICodeDesc);
        } else {
            return;
        }
    }

    /**
     * Initialize form
     */
    private resetForm(): void {
        this.uiForm.controls['APICode'].setValue('');
        this.uiForm.controls['APICodeDesc'].setValue('');
        this.pageParams.isSaveDisabled = true;
        this.pageParams.isCancelDisabled = true;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.pageParams.isDeleteDisabled = true;
        this.pageParams.isSaveDisabled = true;
        this.pageParams.isCancelDisabled = true;
    }

    ngAfterViewInit(): void {
        this.autoOpenSearch = true;
    }

}

