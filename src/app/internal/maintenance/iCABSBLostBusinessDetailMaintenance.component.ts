import { Component, OnInit, OnDestroy, AfterViewInit, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { LostBusinessDetailSearchComponent } from '../search/iCABSBLostBusinessDetailSearch.component';

@Component({
    templateUrl: 'iCABSBLostBusinessDetailMaintenance.html'
})

export class LostBusinessDetailMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public pageId: string = '';
    public queryPost: URLSearchParams = this.getURLSearchParamObject();
    public promptContentDelete: string = MessageConstant.Message.DeleteRecord;
    public rowID: string = '';
    public recordID: string = '';
    public isAutoOpen: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public controls: Array<any> = [
        { name: 'LostBusinessCode', required: true, disabled: true, type: MntConst.eTypeCode },
        { name: 'LostBusinessDetailCode', required: true, disabled: true, type: MntConst.eTypeCode },
        { name: 'LostBusinessDetailDesc', required: true, disabled: false, type: MntConst.eTypeText },
        { name: 'InvalidForNew' },
        { name: 'PassToTabletInd' }
    ];

    public muleConfig = {
        method: 'ccm/admin',
        module: 'retention',
        operation: 'Business/iCABSBLostBusinessDetailMaintenance'
    };

    public lostBusinessDetailSearch = LostBusinessDetailSearchComponent;
    public inputParamsLostBusinessDetailSearch = {
        parentMode: 'Search',
        lostBusinessCode: ''
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBLOSTBUSINESSDETAILMAINTENANCE;
        this.pageTitle = this.browserTitle = 'Lost Business Detail Maintenance';
    };

    ngOnInit(): void {
        super.ngOnInit();
    };

    ngOnDestroy(): void {
        super.ngOnDestroy();
    };

    public ngAfterViewInit(): void {
        // Set message call back
        this.setMessageCallback(this);
        // Set error message call back
        this.setErrorCallback(this);

        this.setFormMode(this.c_s_MODE_SELECT);
        this.pageParams = {
            LostBusinessCode: '',
            LostBusinessDetailCode: '',
            LostBusinessDetailDesc: '',
            InvalidForNew: '',
            PassToTabletInd: ''
        };
        switch (this.parentMode) {
            case 'LostBusinessDetailAdd':
                this.setFormMode(this.c_s_MODE_ADD);
                this.riExchange.riInputElement.Enable(this.uiForm, 'LostBusinessCode');
                this.riExchange.riInputElement.Enable(this.uiForm, 'LostBusinessDetailCode');
                this.isAutoOpen = true;
                break;
            case 'LostBusinessDetailUpdate':
                this.setFormMode(this.c_s_MODE_UPDATE);
                this.fetchLostBusinessDetail();
                break;
        }
    };

    public setLostBusinessCode(): void {
        this.inputParamsLostBusinessDetailSearch = {
            parentMode: 'Search',
            lostBusinessCode: this.getControlValue('LostBusinessCode')
        };
    }

    public setLostBusinessDetailCode(data: any): void {
        this.setControlValue('LostBusinessCode', data.LostBusinessCode);
        this.setControlValue('LostBusinessDetailCode', data.LostBusinessDetailCode);
    }

    // Fetch Lost Business Detail for Update mode
    public fetchLostBusinessDetail(): void {
        let queryGet: URLSearchParams = this.getURLSearchParamObject();
        queryGet.set(this.serviceConstants.Action, '0');
        queryGet.set(this.serviceConstants.BusinessCode, this.businessCode());
        queryGet.set('ROWID', this.riExchange.getParentAttributeValue('ROWID'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryGet)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    this.setFormMode(this.c_s_MODE_SELECT);
                } else {
                    this.setControlValue('LostBusinessCode', data.LostBusinessCode);
                    this.setControlValue('LostBusinessDetailCode', data.LostBusinessDetailCode);
                    this.setControlValue('LostBusinessDetailDesc', data.LostBusinessDetailDesc);
                    this.setControlValue('InvalidForNew', data.InvalidForNew);
                    this.setControlValue('PassToTabletInd', data.PassToTabletInd);
                    this.pageParams = {
                        LostBusinessCode: data.LostBusinessCode,
                        LostBusinessDetailCode: data.LostBusinessDetailCode,
                        LostBusinessDetailDesc: data.LostBusinessDetailDesc,
                        InvalidForNew: data.InvalidForNew,
                        PassToTabletInd: data.PassToTabletInd
                    };
                    this.rowID = data.ttLostBusinessDetail;
                    this.recordID = data.RecordID;
                    this.setFormMode(this.c_s_MODE_UPDATE);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    // Add/Update Lost Business Detail
    public saveLostBusinessDetail(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            let formdata: any;
            if (this.formMode === this.c_s_MODE_ADD) {
                this.queryPost.set(this.serviceConstants.Action, '1');
                formdata = {
                    BusinessCode: this.businessCode(),
                    LostBusinessCode: this.getControlValue('LostBusinessCode'),
                    LostBusinessDetailCode: this.getControlValue('LostBusinessDetailCode'),
                    LostBusinessDetailDesc: this.getControlValue('LostBusinessDetailDesc'),
                    InvalidForNew: this.getControlValue('InvalidForNew'),
                    PassToTabletInd: this.getControlValue('PassToTabletInd')
                };
            } else {
                this.queryPost.set(this.serviceConstants.Action, '2');
                formdata = {
                    BusinessCode: this.businessCode(),
                    ROWID: this.rowID,
                    LostBusinessCode: this.getControlValue('LostBusinessCode'),
                    LostBusinessDetailCode: this.getControlValue('LostBusinessDetailCode'),
                    LostBusinessDetailDesc: this.getControlValue('LostBusinessDetailDesc'),
                    InvalidForNew: this.getControlValue('InvalidForNew'),
                    PassToTabletInd: this.getControlValue('PassToTabletInd')
                };
            }
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError)
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    else {
                        this.rowID = data.ttLostBusinessDetail;
                        this.recordID = data.RecordID;
                        this.pageParams.LostBusinessSystemDesc = this.getControlValue('LostBusinessSystemDesc');
                        this.pageParams.ExpenseDesc = this.getControlValue('ExpenseDesc');
                        this.setFormMode(this.c_s_MODE_SELECT);
                        this.formPristine();
                        this.location.back();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    };

    public promptModalForDeleteData(): void {
        let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteLostBusinessDetail.bind(this));
        this.modalAdvService.emitPrompt(modalVO);
    }

    // Deleting Lost Business Detail
    public deleteLostBusinessDetail(): void {
        this.queryPost.set(this.serviceConstants.Action, '3');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ROWID: this.rowID
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.rowID = '';
                    this.recordID = '';
                    this.pageParams = {
                        LostBusinessCode: '',
                        LostBusinessDetailCode: '',
                        LostBusinessDetailDesc: '',
                        InvalidForNew: '',
                        PassToTabletInd: ''
                    };
                    this.uiForm.reset();
                    this.setFormMode(this.c_s_MODE_SELECT);
                    this.location.back();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    };

    // Cancel Operation
    public cancelLostBusinessDetail(): void {
        if (this.formMode !== this.c_s_MODE_SELECT)
            if (this.formMode === this.c_s_MODE_ADD) {
                this.setFormMode(this.c_s_MODE_SELECT);
                this.uiForm.reset();
                this.location.back();
            } else {
                this.setFormMode(this.c_s_MODE_UPDATE);
                this.setControlValue('LostBusinessCode', this.pageParams.LostBusinessCode);
                this.setControlValue('LostBusinessDetailCode', this.pageParams.LostBusinessDetailCode);
                this.setControlValue('LostBusinessDetailDesc', this.pageParams.LostBusinessDetailDesc);
                this.setControlValue('InvalidForNew', this.pageParams.InvalidForNew);
                this.setControlValue('PassToTabletInd', this.pageParams.PassToTabletInd);
            }
        this.formPristine();
    };
}
