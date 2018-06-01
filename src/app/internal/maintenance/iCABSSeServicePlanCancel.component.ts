import { Component, Injector, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';

@Component({
    templateUrl: 'iCABSSeServicePlanCancel.html'
})

export class ServicePlanCancelComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public pageId: string = '';
    public search = new URLSearchParams();
    public controls = [
        { name: 'BranchServiceAreaCode', type: MntConst.eTypeCode },
        { name: 'BranchServiceAreaDesc', type: MntConst.eTypeText },
        { name: 'ServicePlanNumber', type: MntConst.eTypeInteger },
        { name: 'ServicePlanStartDate', type: MntConst.eTypeDate },
        { name: 'ServicePlanNoOfCalls', type: MntConst.eTypeInteger },
        { name: 'ServicePlanEndDate', type: MntConst.eTypeDate },
        { name: 'ServicePlanTime', type: MntConst.eTypeText },
        { name: 'ServicePlanTimeString', type: MntConst.eTypeTime },
        { name: 'ServiceWeekNumber', type: MntConst.eTypeInteger },
        { name: 'ServicePlanNoOfExchanges', type: MntConst.eTypeInteger },
        { name: 'ServicePlanStatusOriginal', type: MntConst.eTypeText },
        { name: 'ServicePlanNettValue', type: MntConst.eTypeCurrency },
        { name: 'ServicePlanStatusCode', type: MntConst.eTypeCode },
        { name: 'ServicePlanStatusDesc', type: MntConst.eTypeText },
        { name: 'ResetPlanVisitsToInPlanningInd' },
        { name: 'ReportNumber', type: MntConst.eTypeInteger },
        // Hidden
        { name: 'RowID' },
        { name: 'BusinessCode' },
        { name: 'BranchNumber' },
        { name: 'LanguageCode' }
    ];

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Service/iCABSSeServicePlanCancel',
        module: 'planning',
        method: 'service-planning/maintenance'
    };

    // Page level Variables
    public pageVariables = {
        servicePlanStatusCode: 'C',
        disableSave: false,
        disableCancel: false
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANCANCEL;

        this.browserTitle = this.pageTitle = 'Service Plan Cancellation Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    public window_onload(): void {
        this.riMaintenance.RowID(this, 'RowID', this.riExchange.getParentAttributeValue('ServicePlanRowID'));

        if (this.getControlValue('RowID')) {
            this.getSysCharDetails();
            this.fetchInitialRecord();
        } else {
            this.uiForm.disable();
            this.pageVariables.disableSave = true;
            this.pageVariables.disableCancel = true;
        }
    }

    public getSysCharDetails(): any {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharEnableResetCancelPlansToInPlanning
        ];
        let sysCharIP = {
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vEnableInstallsRemovals = record[0]['Required'];
            this.pageParams.vResetPlanVisitsToInPlanning = record[1]['Required'];
            this.setControlValue('ResetPlanVisitsToInPlanningInd', this.pageParams.vResetPlanVisitsToInPlanning);
        });
    }

    // Build and call loopup for multiple controls
    public buildAndCallLookup(): void {
        this.setControlValue('LanguageCode', this.riExchange.LanguageCode());
        this.riMaintenance.setIndependentVTableLookup(true);

        this.riMaintenance.AddTable('ServicePlan');
        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableKeyCS('BranchNumber', MntConst.eTypeInteger);

        this.riMaintenance.AddTableField('ServicePlanNumber', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');

        this.riMaintenance.AddTableField('BranchServiceAreaCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('BranchServiceAreaDesc', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServicePlanStartDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('ServicePlanStartDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableField('ServicePlanEndDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('ServicePlanEndDate', MntConst.eAlignmentCenter);
        this.riMaintenance.AddTableField('ServiceWeekNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServicePlanNoOfCalls', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServicePlanNoOfExchanges', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServicePlanTime', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('ServicePlanTime', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableField('ServicePlanNettValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServicePlanStatusCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServicePlanStatusDesc', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ReportNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ResetPlanVisitsToInPlanningInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Normal');

        this.riMaintenance.AddTableFieldPostData('ServicePlanNoOfCalls', false);
        this.riMaintenance.AddTableFieldPostData('ServicePlanNoOfExchanges', false);
        this.riMaintenance.AddTableFieldPostData('ServicePlanTime', false);
        this.riMaintenance.AddTableFieldPostData('ServicePlanNettValue', false);

        this.riMaintenance.AddTableCommit(this);

        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('ServicePlanStatusOriginal', MntConst.eTypeText, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ServicePlanTimeString', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableFieldAlignment('ServicePlanTimeString', MntConst.eAlignmentRight);
        this.riMaintenance.AddTableCommit(this);

        this.riMaintenance.AddVirtualTable('ServicePlanStatusLang');
        this.riMaintenance.AddVirtualTableKey('ServicePlanStatusCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Key');
        this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ServicePlanStatusDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this, this.servicePlanStatusLangCallback);

        this.riMaintenance.AddVirtualTable('BranchServiceArea');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKeyCS('BranchNumber', MntConst.eTypeInteger);
        this.riMaintenance.AddVirtualTableKey('BranchServiceAreaCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Key');
        this.riMaintenance.AddVirtualTableField('BranchServiceAreaDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.Complete();
        this.riMaintenance.FetchRecord();
        this.riMaintenance.UpdateMode();
    }

    public servicePlanStatusLangCallback(): void {
        this.setControlValue('ServicePlanStatusOriginal', this.getControlValue('ServicePlanStatusDesc'));
        this.populateServicePlanStatusDesc();
    }

    // Populate data into the grid
    public fetchInitialRecord(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set('ROWID', this.getControlValue('RowID'));
        this.search.set(this.serviceConstants.MethodType, 'maintenance');
        this.search.set(this.serviceConstants.Action, '0');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('BusinessCode', data.BusinessCode);
                    this.setControlValue('BranchNumber', data.BranchNumber);
                    this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
                    this.setControlValue('ServicePlanNumber', data.ServicePlanNumber);
                    this.setControlValue('ServicePlanStartDate', data.ServicePlanStartDate);
                    this.setControlValue('ServicePlanNoOfCalls', data.ServicePlanNoOfCalls);
                    this.setControlValue('ServicePlanEndDate', data.ServicePlanEndDate);
                    this.setControlValue('ServicePlanTime', data.ServicePlanTime);
                    this.setControlValue('ServicePlanTimeString', data.ServicePlanTime);
                    this.setControlValue('ServiceWeekNumber', data.ServiceWeekNumber);
                    this.setControlValue('ServicePlanNoOfExchanges', data.ServicePlanNoOfExchanges);
                    this.setControlValue('ServicePlanNettValue', data.ServicePlanNettValue);
                    this.setControlValue('ServicePlanStatusCode', data.ServicePlanStatusCode);
                    this.setControlValue('ReportNumber', data.ReportNumber);

                    this.buildAndCallLookup();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Populate ServicePlan Status Description
    public populateServicePlanStatusDesc(): void {
        let _formData: Object = {};

        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');

        _formData['Function'] = 'GetServicePlanStatusDesc';
        _formData['ServicePlanStatusCode'] = this.pageVariables.servicePlanStatusCode;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, _formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ServicePlanStatusDesc', data.ServicePlanStatusDesc);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Form submit event
    public onSubmit(event: any): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveRecord.bind(this)));
    }

    // Form submit event
    public onCancel(event: any): void {
        this.formPristine();
        this.location.back();
    }

    // Save record
    public saveRecord(): void {
        if (this.getControlValue('RowID').toString().length !== 0) {
            let _formData: Object = {};

            this.search = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, '2');

            _formData['methodtype'] = 'maintenance';
            _formData['Table'] = 'ServicePlan';
            _formData['ROWID'] = this.getControlValue('RowID');
            _formData['ResetPlanVisitsToInPlanningInd'] = this.getControlValue('ResetPlanVisitsToInPlanningInd') ? 'yes' : 'no';
            _formData['ReportNumber'] = this.getControlValue('ReportNumber');
            _formData['ServicePlanStatusCode'] = this.pageVariables.servicePlanStatusCode;
            _formData['ServiceWeekNumber'] = this.getControlValue('ServiceWeekNumber');
            _formData['ServicePlanStartDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('ServicePlanStartDate'));
            _formData['ServicePlanEndDate'] = this.globalize.parseDateToFixedFormat(this.getControlValue('ServicePlanEndDate'));
            _formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, _formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.formPristine();
                        this.location.back();
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }
}
