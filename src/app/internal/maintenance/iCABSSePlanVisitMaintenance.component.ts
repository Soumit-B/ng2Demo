import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs';

import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSSePlanVisitMaintenance.html'
})

export class SePlanVisitMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('routeAwayComponent') public routeAwayComponent;

    private search: URLSearchParams = new URLSearchParams();

    public pageId: string = '';
    public controls = [
        { name: 'OriginalVisitDueDate', disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'VisitTypeCode', disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'PlannedVisitDate', disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'TemporaryVisitDayInd', disabled: false, required: false, type: MntConst.eTypeCheckBox },
        { name: 'PlanQuantity', disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'RoutingVisitDuration', disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'ServiceVisitText', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'BranchServiceAreaCode', disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'StartDate', disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'EndDate', disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'HideFields', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'ProgramMode', disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'RowID', disabled: false, required: false, type: MntConst.eTypeTextFree },
        { name: 'ServiceCoverRowID', disabled: false, required: false, type: MntConst.eTypeTextFree }
    ];
    public xhrParams: any = {
        operation: 'Service/iCABSSePlanVisitMaintenance',
        module: 'plan-visits',
        method: 'service-planning/maintenance'
    };
    public subSysChar: Subscription;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPLANVISITMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Planned Visit Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
        this.loadSysChar();
    }

    ngOnDestroy(): void {
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        super.ngOnDestroy();
    }

    private loadSysChar(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableTimePlanning
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vbEnableTimePlanning = record[0].Required;
            this.getHideFields();
        });
    }

    private windowOnLoad(): void {
        this.riExchange.getParentHTMLValue('BranchServiceAreaCode');
        this.riExchange.getParentHTMLValue('VisitTypeCode');
        this.riExchange.getParentHTMLValue('StartDate');
        this.riExchange.getParentHTMLValue('EndDate');
        this.setControlValue('RowID', this.riExchange.getParentAttributeValue('PlanVisitRowID'));
        this.setControlValue('ServiceCoverRowID', this.riExchange.getParentAttributeValue('ServiceCoverRowID'));
        if (this.parentMode === 'ServiceVisitText') {
            this.pageTitle = 'Visit Cancellation';
            this.setControlValue('ProgramMode', this.parentMode);
            this.pageParams.trDueDate = false;
            this.pageParams.trVisitType = false;
            this.pageParams.trPlannedVisitDate = false;
            this.pageParams.trPlanQuantity = false;
            this.pageParams.trVisitDetailText = true;
        } else {
            this.pageParams.trDueDate = true;
            this.pageParams.trVisitType = true;
            this.pageParams.trPlannedVisitDate = true;
            this.pageParams.trPlanQuantity = true;
            this.pageParams.trVisitDetailText = false;
        }
    }

    private loadDataFromService(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ROWID', this.getControlValue('RowID'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search)
            .subscribe(
            (data) => {
                if (data) {
                    if (data && data['hasError']) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setControlValue('BranchServiceAreaCode', data['BranchServiceAreaCode']);
                        this.setControlValue('VisitTypeCode', data['VisitTypeCode']);
                        this.setControlValue('OriginalVisitDueDate', data['OriginalVisitDueDate']);
                        this.setControlValue('PlannedVisitDate', data['PlannedVisitDate']);
                        this.setControlValue('PlanQuantity', data['PlanQuantity']);
                        this.setControlValue('TemporaryVisitDayInd', data['TemporaryVisitDayInd']);
                        this.setControlValue('ServiceVisitText', data['ServiceVisitText']);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private getHideFields(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        let formData = {
            Function: 'GetHideFields'
        };
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, this.search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (this.InStr('HideFields', 'TemporaryVisitDayInd') !== -1) {
                        this.pageParams.tdTempVisitDay = false;
                        this.pageParams.tdTempVisitDayLabel = false;
                    } else {
                        this.pageParams.tdTempVisitDay = true;
                        this.pageParams.tdTempVisitDayLabel = true;
                    }
                    this.loadDataFromService();
                    this.getDefaultDuration();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            });
    }

    private getDefaultDuration(): void {
        if (!this.pageParams.vbEnableTimePlanning) {
            return;
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        let formData = {
            Function: 'GetDefaultDuration',
            PlanVisitRowID: this.getControlValue('RowID')
        };
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, this.search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.pageParams.vbVisitDurationExists = (this.UCase(data['VisitDurationExists']) === 'YES');
                    this.setControlValue('RoutingVisitDuration', data['RoutingVisitDuration']);
                    if (this.pageParams.vbVisitDurationExists) {
                        this.pageParams.trRoutingVisitDuration = true;
                    } else {
                        this.pageParams.trRoutingVisitDuration = false;
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            });
    }

    private handleSaveCall(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        let formData = {
            StartDate: this.getControlValue('StartDate'),
            EndDate: this.getControlValue('EndDate'),
            HideFields: this.getControlValue('HideFields'),
            ProgramMode: this.getControlValue('ProgramMode'),
            PlanVisitROWID: this.getControlValue('RowID'),
            BranchServiceAreaCode: this.getControlValue('BranchServiceAreaCode'),
            BranchNumber: this.utils.getBranchCode(),
            VisitTypeCode: this.getControlValue('VisitTypeCode'),
            OriginalVisitDueDate: this.getControlValue('OriginalVisitDueDate'),
            PlannedVisitDate: this.getControlValue('PlannedVisitDate'),
            PlanQuantity: this.getControlValue('PlanQuantity'),
            TemporaryVisitDayInd: this.utils.convertCheckboxValueToRequestValue(this.getControlValue('TemporaryVisitDayInd')),
            ServiceVisitText: this.getControlValue('ServiceVisitText'),
            RoutingVisitDuration: this.getControlValue('RoutingVisitDuration'),
            ServiceCoverRowID: this.getControlValue('ServiceCoverRowID')
        };
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, this.search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.uiForm.markAsPristine();
                    this.location.back();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error));
            });
    }

    public showSavePrompt(): void {
        let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.handleSaveCall.bind(this));
        this.modalAdvService.emitPrompt(modalVO);
    }

    public handleCancel(): void {
        this.location.back();
    }
}
