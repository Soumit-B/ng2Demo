import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MessageConstant } from './../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSBLostBusinessMaintenance.html'
})
export class LostBusinessMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public pageId: string = '';
    public search: URLSearchParams = this.getURLSearchParamObject();
    public promptContentSave: string;
    public promptContentDelete: string;
    public rowId: string = '';
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public formControlVariables: any = {
        'LostBusinessCode': '',
        'LostBusinessSystemDesc': '',
        'TermAnalysisInd': '',
        'InvalidForNew': '',
        'PassToTabletInd': ''
    };
    public controls: any[] = [
        { name: 'LostBusinessCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'LostBusinessSystemDesc', required: true, type: MntConst.eTypeText },
        { name: 'TermAnalysisInd', type: MntConst.eTypeCheckBox },
        { name: 'InvalidForNew', type: MntConst.eTypeCheckBox },
        { name: 'PassToTabletInd', type: MntConst.eTypeCheckBox }
    ];

    public queryParams: any = {
        operation: 'Business/iCABSBLostBusinessMaintenance',
        module: 'retention',
        method: 'ccm/admin'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBLOSTBUSINESSMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Lost Business Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnLoad(): void {
        switch (this.parentMode) {
            case 'LostBusinessAdd':
                this.populateFormData();
                break;
            case 'LostBusinessUpdate':
                this.fetchRecord();
        }
    }

    public populateFormData(): void {
        this.fetchRecord();
        this.setControlValue('LostBusinessCode', this.formControlVariables.LostBusinessCode);
        this.setControlValue('LostBusinessSystemDesc', this.formControlVariables.LostBusinessSystemDesc);
        this.setControlValue('TermAnalysisInd', this.formControlVariables.TermAnalysisInd);
        this.setControlValue('InvalidForNew', this.formControlVariables.InvalidForNew);
        this.setControlValue('PassToTabletInd', this.formControlVariables.PassToTabletInd);
    }

    // Fetching Records for the fileds from parent page
    public fetchRecord(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set('ROWID', this.riExchange.getParentHTMLValue('ROWID'));
        this.ajaxSource.next(AjaxConstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.rowId = data.ttLostBusiness;
                    this.setControlValue('LostBusinessCode', data.LostBusinessCode);
                    this.setControlValue('LostBusinessSystemDesc', data.LostBusinessSystemDesc);
                    this.setControlValue('PassToTabletInd', data.PassToTabletInd);
                    this.setControlValue('TermAnalysisInd', data.TermAnalysisInd);
                    this.setControlValue('InvalidForNew', data.InvalidForNew);
                    this.formControlVariables.LostBusinessCode = this.getControlValue('LostBusinessCode');
                    this.formControlVariables.LostBusinessSystemDesc = this.getControlValue('LostBusinessSystemDesc');
                    this.formControlVariables.PassToTabletInd = this.getControlValue('PassToTabletInd');
                    this.formControlVariables.TermAnalysisInd = this.getControlValue('TermAnalysisInd');
                    this.formControlVariables.InvalidForNew = this.getControlValue('InvalidForNew');
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    // Clicking on Save button
    public saveOnClick(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, '', this.promptConfirmSave.bind(this)));
    }

    // Clicking on Cancel button
    public cancelOnClick(): void {
        if (this.formMode === this.c_s_MODE_ADD) {
            this.setFormMode(this.c_s_MODE_SELECT);
            this.uiForm.reset();
            this.pageParams.rollover = [];
        } else {
            this.setFormMode(this.c_s_MODE_UPDATE);
            this.fetchRecord();
        }
        this.formPristine();
    }

    // Clicking on Delete button
    public deleteOnClick(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.DeleteRecord, '', this.promptConfirmDelete.bind(this)));
    }

    // Confirming the records to be saved
    public promptConfirmSave(): void {
        let formdata: any;
        if (this.formMode === this.c_s_MODE_ADD) {
            this.search.set(this.serviceConstants.Action, '1');
            formdata = {
                BusinessCode: this.businessCode(),
                LostBusinessCode: this.getControlValue('LostBusinessCode'),
                LostBusinessSystemDesc: this.getControlValue('LostBusinessSystemDesc'),
                TermAnalysisInd: this.utils.convertResponseValueToCheckboxInput(this.getControlValue('TermAnalysisInd')),
                InvalidForNew: this.utils.convertResponseValueToCheckboxInput(this.getControlValue('InvalidForNew')),
                PassToTabletInd: this.utils.convertResponseValueToCheckboxInput(this.getControlValue('PassToTabletInd'))
            };
        } else {
            this.search.set(this.serviceConstants.Action, '2');
            formdata = {
                BusinessCode: this.businessCode(),
                LostBusinessSystemDesc: this.getControlValue('LostBusinessSystemDesc'),
                TermAnalysisInd: this.utils.convertResponseValueToCheckboxInput(this.getControlValue('TermAnalysisInd')),
                InvalidForNew: this.utils.convertResponseValueToCheckboxInput(this.getControlValue('InvalidForNew')),
                PassToTabletInd: this.utils.convertResponseValueToCheckboxInput(this.getControlValue('PassToTabletInd')),
                ROWID: this.rowId
            };
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, formdata).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.formPristine();
                    this.location.back();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    // Confirming the records to be deleted
    public promptConfirmDelete(): void {
        let formdata: any;
        this.search.set(this.serviceConstants.Action, '3');
        formdata = {
            BusinessCode: this.businessCode(),
            ROWID: this.rowId
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, formdata).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                    this.rowId = '';
                    this.formControlVariables.LostBusinessCode = '';
                    this.formControlVariables.LostBusinessSystemDesc = '';
                    this.formControlVariables.TermAnalysisInd = '';
                    this.formControlVariables.InvalidForNew = '';
                    this.formControlVariables.PassToTabletInd = '';
                    this.uiForm.reset();
                    this.setFormMode(this.c_s_MODE_SELECT);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }
}
