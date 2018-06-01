import { Component, ViewChild, OnInit, Injector, OnDestroy, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';

@Component({
    templateUrl: 'iCABSSeServicePlanDescMaintenance.html'
})

export class ServicePlanDescMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    private queryParams: any = {
        operation: 'Service/iCABSSeServicePlanDescMaintenance',
        module: 'planning',
        method: 'service-planning/maintenance'
    };

    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'BranchNumber', type: MntConst.eTypeCode },
        { name: 'BranchServiceAreaCode', disabled: true, type: MntConst.eTypeCode },
        { name: 'BranchServiceAreaDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ServicePlanNumber', disabled: true, type: MntConst.eTypeCode },
        { name: 'ServicePlanStartDate', readonly: true, disabled: true, type: MntConst.eTypeDate },
        { name: 'ServicePlanEndDate', readonly: true, disabled: true, type: MntConst.eTypeDate },
        { name: 'BranchName', disabled: true, type: MntConst.eTypeText },
        { name: 'ServicePlanDescription', type: MntConst.eTypeText },
        // Hidden field
        { name: 'ROWID' }
    ];
    public setFocusOnServicePlanDescription = new EventEmitter<boolean>();

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANDESCMAINTENANCE;

        this.browserTitle = this.pageTitle = 'Service Plan Description Maintenance';
        this.pageParams.isDisableSave = false;
        this.pageParams.isDisableCancel = false;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnload(): void {
        if (this.parentMode === 'ServicePlanDescription') {
            this.riMaintenance.RowID(this, 'ROWID', this.riExchange.getParentAttributeValue('ServicePlanRowID') ? this.riExchange.getParentAttributeValue('ServicePlanRowID') : '');
            this.populateInitialValue();
        } else {
            this.disableControls([]);
            this.pageParams.isDisableSave = true;
            this.pageParams.isDisableCancel = true;
        }
    }

    private populateInitialValue(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set('ROWID', this.getControlValue('ROWID'));
        search.set(this.serviceConstants.Action, '0');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('BranchNumber', data.BranchNumber);
                    this.setControlValue('BranchName', this.utils.getBranchText(data.BranchNumber));
                    this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
                    this.setControlValue('ServicePlanNumber', data.ServicePlanNumber);
                    this.setControlValue('ServicePlanStartDate', data.ServicePlanStartDate);
                    this.setControlValue('ServicePlanEndDate', data.ServicePlanEndDate);
                    this.setControlValue('ServicePlanDescription', data.ServicePlanDescription);
                    this.fetchLookUpdata();
                    this.setFocusOnServicePlanDescription.emit(true);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    //Method to Save changed values
    private actionSave(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.confirmSave.bind(this)));
    }

    private confirmSave(): void {
        let formData: any = {} ,search: URLSearchParams = this.getURLSearchParamObject() ;
        search.set(this.serviceConstants.Action, '2');
        formData['ServicePlanROWID'] = this.getControlValue('ROWID');
        formData['BranchNumber'] = this.getControlValue('BranchNumber');
        formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        formData['ServicePlanNumber'] = this.getControlValue('ServicePlanNumber');
        formData['ServicePlanStartDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('ServicePlanStartDate'));
        formData['ServicePlanEndDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('ServicePlanEndDate'));
        formData['ServicePlanDescription'] = this.getControlValue('ServicePlanDescription');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.formPristine();
                    this.location.back();
                }
            },
            (error) => {
                 this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    //Method to lookUp BranchServiceAreaDesc field value
    private fetchLookUpdata(): void {
        let lookupIP: any = [
            {
                'table': 'BranchServiceArea',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'BranchServiceAreaCode': this.getControlValue('BranchServiceAreaCode'),
                    'BranchNumber': this.getControlValue('BranchNumber')
                },
                'fields': ['BranchServiceAreaDesc']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
                if (data && data.length > 0 && data[0].length > 0) {
                     this.setControlValue('BranchServiceAreaDesc', data[0][0].BranchServiceAreaDesc);
                }
            }).catch((error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public actionButtonClicked(action: string): void {
        switch (action) {
            case 'save':
                this.actionSave();
                break;
            case 'cancel':
                this.windowOnload();
                break;
        }
    }
}
