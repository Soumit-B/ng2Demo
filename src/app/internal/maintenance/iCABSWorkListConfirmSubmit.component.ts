import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSWorkListConfirmSubmit.html'
})

export class WorkListConfirmSubmitComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    private subscription: Subscription = new Subscription();
    // URL Query Parameters
    private queryParams: any = {
        operation: 'Service/iCABSWorkListConfirmSubmit',
        module: 'manual-service',
        method: 'service-delivery/batch'
    };
    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'BranchNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'EmployeeCode', disabled: true, type: MntConst.eTypeCode, required: true },
        { name: 'EmployeeSurname', disabled: true, type: MntConst.eTypeText, required: true },
        { name: 'IncludeRiskAssessment' },
        { name: 'IncludeSurveyDetails' },
        { name: 'IncludeAccessTimes' },
        { name: 'EmployeeComments', type: MntConst.eTypeText },
        { name: 'DateFrom', type: MntConst.eTypeDate, readOnly: true, disabled: true },
        { name: 'DateTo', type: MntConst.eTypeDate, readOnly: true, disabled: true },
        { name: 'BranchName', disabled: true, type: MntConst.eTypeText }

    ];
    public ellipsisConfig: any = {
        employee: {
            disabled: true
        }
    };
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSWORKLISTCONFIRMSUBMIT;
        this.browserTitle = 'Customer Contract Report';
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
        //All subscriptions which were added with "subscription.add" are canceled here
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    private windowOnload(): void {
        this.setControlValue('BranchNumber', this.riExchange.getParentHTMLValue('BranchNumber'));
        this.setControlValue('BranchName', this.utils.getBranchText(this.getControlValue('BranchNumber')));
        this.setControlValue('DateFrom', this.riExchange.getParentHTMLValue('DateFrom'));
        this.setControlValue('DateTo', this.riExchange.getParentHTMLValue('DateTo'));

        this.setControlValue('EmployeeCode', this.riExchange.getParentAttributeValue('EmployeeCode'));
        this.setControlValue('EmployeeSurname', this.riExchange.getParentAttributeValue('EmployeeSurname'));

        this.submitFindComments();
    }
    private submitFindComments(): void {
        let formData: Object = {}, search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'EmployeeComments';
        formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        formData['DateFrom'] = this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom'));
        formData['DateTo'] = this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.subscription.add(this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.setControlValue('EmployeeComments', data.EmployeeComments);
                    this.setControlValue('IncludeRiskAssessment', this.matchResult(data.IncludeRiskAssessment));
                    this.setControlValue('IncludeSurveyDetails', this.matchResult(data.IncludeSurveyDetails));
                    this.setControlValue('IncludeAccessTimes', this.matchResult(data.IncludeAccessTimes));
                    this.formPristine();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
            }));
    }
    //If user click confirm then this function will get executed.
    //If employee comment length > 2000 then alert mesaage will show else it will call submitReportRequest method
    private finalSubmitReport(): void {
        if (this.getControlValue('EmployeeComments').length > 2000) {
            setTimeout(() => {
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.employeeCommentLength));
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'EmployeeComments', true);
            }, 1000);
        } else {
            this.submitReportRequest();
        }
    }
    //If user click confirm then this function will get executed
    private submitReportRequest(): void {
        let formData: Object = {}, search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');

        formData['Function'] = 'InPlanningCheck';
        formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        formData['DateFrom'] = this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom'));
        formData['DateTo'] = this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.subscription.add(this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    if (data.InPlanning && data.InPlanning.toLowerCase() === 'yes') {
                        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.PageSpecificMessage.workListPlanning, null, null));
                    }
                    this.saveEmployeeComment();
                }

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
            }));
    }
    //This function used to save employee comment
    private saveEmployeeComment(): void {
        let formData: Object = {}, search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');

        formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        formData['DateFrom'] = this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom'));
        formData['DateTo'] = this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo'));
        formData['IncludeRiskAssessment'] = (this.getControlValue('IncludeRiskAssessment')) ? 'yes' : 'no';
        formData['IncludeSurveyDetails'] = (this.getControlValue('IncludeSurveyDetails')) ? 'yes' : 'no';
        formData['IncludeAccessTimes'] = (this.getControlValue('IncludeAccessTimes')) ? 'yes' : 'no';
        formData['EmployeeComments'] = this.getControlValue('EmployeeComments');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.subscription.add(this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.pageParams.isRequesting = false;
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                } else {
                    this.formPristine();
                    this.location.back();
                }

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage));
            }));
    }
    private matchResult(data: string): boolean {
        return (data.toUpperCase() === 'YES' || data.toUpperCase() === 'TRUE' || data.toUpperCase() === 'Y') ? true : false;
    }
    //When Submit Report Generation button clicked
    public submitReport(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.finalSubmitReport.bind(this)));
    }

}


