import { Component, Injector, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';
import { RiMaintenance, MntConst } from '../../../shared/services/riMaintenancehelper';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { CustomDatepickerComponent } from '../../../shared/components/custom-datepicker/custom-datepicker';

@Component({
    templateUrl: 'iCABSSeServicePlanningEmployeeTimeMaintenanceHg.html'
})

export class ServicePlanningEmployeeTimeMaintenanceHgComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('PlannedVisitDuration') plannedVisitDuration;
    @ViewChild('PlannedVisitDate') plannedVisitDate: CustomDatepickerComponent;

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'VisitTypeCode', type: MntConst.eTypeText },
        { name: 'EmployeeCode', type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', type: MntConst.eTypeText },
        { name: 'PlannedVisitDate', type: MntConst.eTypeDate },
        { name: 'OriginalVisitDuration', type: MntConst.eTypeTime },
        { name: 'PlannedVisitDuration', type: MntConst.eTypeTime },
        { name: 'PlannedVisitTimeStart', type: MntConst.eTypeTime },
        { name: 'PlannedVisitValue', type: MntConst.eTypeCurrency },
        // Hidden field
        { name: 'ROWID' },
        { name: 'BusinessCode' },
        { name: 'ServiceCoverNumber' },
        { name: 'PlanVisitNumber' },
        { name: 'PlanVisitDetailNumber' },
        { name: 'BranchNumber' },
        { name: 'PlanVisitRowID' },
        { name: 'ServicePlanNumber' },
        { name: 'PlanVisitDetailRowID' },
        { name: 'StartDate', type: MntConst.eTypeDate },
        { name: 'EndDate', type: MntConst.eTypeDate }
    ];

    // URL Query Parameters
    public queryParams: any = {
        operation: 'Service/iCABSSeServicePlanningEmployeeTimeMaintenanceHg',
        module: 'planning',
        method: 'service-planning/maintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANNINGEMPLOYEETIMEMAINTENANCEHG;

        // Page level Variables
        this.browserTitle = this.pageTitle = 'Employee Planned Time Maintenance';
        this.pageParams.mode = '';
        this.pageParams.FunctionUpdate = false;
        this.pageParams.FunctionAdd = false;
        this.pageParams.FunctionCancel = true;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();

        if (this.pageParams.mode === '' || this.getControlValue('PlanVisitRowID') === '') {
            this.uiForm.disable();
            this.pageParams.FunctionUpdate = false;
            this.pageParams.FunctionAdd = false;
            this.pageParams.FunctionCancel = false;
        }
    }

    ngAfterViewInit(): void {
        switch (this.pageParams.mode) {
            case 'Update':
                this.plannedVisitDate.onFocus();
                break;
            case 'New':
                this.plannedVisitDuration.nativeElement.focus();
                break;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // Initializes data into different controls on page load
    public window_onload(): void {
        this.pageParams.mode = this.riExchange.getParentAttributeValue('EmployeeMaintenanceMode');

        this.setControlValue('StartDate', this.globalize.parseDateToFixedFormat(this.riExchange.getParentHTMLValue('StartDate')));
        this.setControlValue('EndDate', this.globalize.parseDateToFixedFormat(this.riExchange.getParentHTMLValue('EndDate')));

        switch (this.pageParams.mode) {
            case 'Update':
                this.setControlValue('PlanVisitRowID', this.riExchange.getParentAttributeValue('PlanVisitRowID'));
                this.setControlValue('PlanVisitDetailRowID', this.riExchange.getParentAttributeValue('PlanVisitDetailRowID'));
                this.riMaintenance.RowID(this, 'ROWID', this.riExchange.getParentAttributeValue('PlanVisitDetailRowID'));
                this.fetchPlanVisitDetailRecord();

                // Do not allow Confirm Planned Visits to be updated in Service Planning
                if (this.parentMode !== 'ServicePlan' && this.getControlValue('ServicePlanNumber') === '') {
                    this.pageParams.FunctionDelete = true;
                    this.pageParams.FunctionUpdate = true;
                }
                break;
            case 'New':
                this.riMaintenance.AddMode();
                this.setControlValue('PlanVisitRowID', this.riExchange.getParentHTMLValue('PlanVisitRowID'));
                this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('EmployeeCode'));
                this.setControlValue('PlannedVisitDate', this.riExchange.getParentHTMLValue('PlannedVisitDate'));
                this.setControlValue('PlanVisitDetailNumber', '0');

                this.getDescriptions();
                this.plannedVisitDuration_onChange(null);
                this.pageParams.FunctionDelete = false;
                this.pageParams.FunctionUpdate = true;
                break;
        }
    }

    // Build and call loopup for multiple controls
    public buildAndCallLookup(): void {
        this.setControlValue('BusinessCode', this.businessCode());
        this.riMaintenance.setIndependentVTableLookup(true);
        this.setControlsStatus();

        this.riMaintenance.AddVirtualTable('PlanVisit');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableKey('ServiceCoverNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableKey('PlanVisitNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableField('BranchNumber', MntConst.eTypeInteger, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableField('VisitTypeCode', MntConst.eTypeText, MntConst.eVirtualFieldStateReadOnly, 'Virtual');
        this.riMaintenance.AddVirtualTableField('OriginalVisitDuration', MntConst.eTypeTime, MntConst.eVirtualFieldStateReadOnly, 'Virtual');
        this.riMaintenance.AddVirtualTableField('ServicePlanNumber', MntConst.eTypeInteger, MntConst.eVirtualFieldStateReadOnly, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this, this.planVisitCallBack);

        this.riMaintenance.AddVirtualTable('Employee');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('EmployeeCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableField('EmployeeSurname', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Contract');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableField('ContractName', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Premise');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ContractNumber', MntConst.eTypeCode, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableKey('PremiseNumber', MntConst.eTypeInteger, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableField('PremiseName', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.AddVirtualTable('Product');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('ProductCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateRequired, '', '', '', 'Required');
        this.riMaintenance.AddVirtualTableField('ProductDesc', MntConst.eTypeText, MntConst.eVirtualFieldStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this);

        this.riMaintenance.Complete();
    }

    // Set Controls Status through riMaintenance
    public setControlsStatus(): void {
        this.riMaintenance.AddTable('PlanVisitDetail');
        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableField('ContractNumber', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ContractName', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('PremiseNumber', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('PremiseName', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ProductCode', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('ProductDesc', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableKey('ServiceCoverNumber', MntConst.eTypeInteger, MntConst.eKeyOptionRequired, MntConst.eKeyStateReadOnly, 'Key');
        this.riMaintenance.AddTableKey('PlanVisitNumber', MntConst.eTypeInteger, MntConst.eKeyOptionRequired, MntConst.eKeyStateReadOnly, 'Key');
        this.riMaintenance.AddTableKey('PlanVisitDetailNumber', MntConst.eTypeInteger, MntConst.eKeyOptionRequired, MntConst.eKeyStateReadOnly, 'Key');
        this.riMaintenance.AddTableField('EmployeeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('EmployeeSurname', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('VisitTypeCode', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');
        if (this.pageParams.mode === 'New') {
            this.riMaintenance.AddTableField('PlannedVisitDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        } else {
            this.riMaintenance.AddTableField('PlannedVisitDate', MntConst.eTypeDate, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        }
        this.riMaintenance.AddTableField('OriginalVisitDuration', MntConst.eTypeCode, MntConst.eFieldOptionRequired, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('PlannedVisitDuration', MntConst.eTypeTime, MntConst.eFieldOptionRequired, MntConst.eFieldStateNormal, 'Required');
        this.riMaintenance.AddTableField('PlannedVisitTimeStart', MntConst.eTypeTime, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableField('BranchNumber', MntConst.eTypeInteger, MntConst.eFieldOptionNormal, MntConst.eFieldStateNormal, 'Optional');
        this.riMaintenance.AddTableCommit(this);

        this.riMaintenance.AddTable('*');
        this.riMaintenance.AddTableField('PlannedVisitValue', MntConst.eTypeCurrency, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('StartDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableField('EndDate', MntConst.eTypeDate, MntConst.eFieldOptionNormal, MntConst.eFieldStateReadOnly, 'ReadOnly');
        this.riMaintenance.AddTableCommit(this);
    }

    // Plan Visit CallBack method
    public planVisitCallBack(): void {
        let value = this.getControlValue('OriginalVisitDuration');
        if (!String(value).includes(':') && String(value).length > 0) {
            this.setControlValue('OriginalVisitDuration', this.utils.secondsToHms(value));
        } else if (String(value).length === 0) {
            this.setControlValue('OriginalVisitDuration', '00:00');
        }
    }

    // Set Planned Value EndTime through Post request
    public setPlannedValueEndTime(): void {
        if (this.getControlValue('PlannedVisitDuration')) {
            let _formData: Object = {};
            let vbFunctions = 'SetPlannedValue';

            if (this.getControlValue('PlannedVisitTimeStart')) {
                vbFunctions = vbFunctions + ',' + 'SetEndTime';
                _formData['PlannedVisitTimeStart'] = this.getControlValue('PlannedVisitTimeStart');
            }

            let _search = this.getURLSearchParamObject();
            _search.set(this.serviceConstants.Action, '6');

            _formData['Function'] = vbFunctions;
            _formData['PlanVisitRowID'] = this.getControlValue('PlanVisitRowID');
            _formData['PlanVisitDetailRowID'] = this.getControlValue('PlanVisitDetailRowID');
            _formData['PlannedVisitDuration'] = this.getControlValue('PlannedVisitDuration');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search, _formData)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.setControlValue('PlannedVisitValue', data.PlannedVisitValue);
                        this.setAttribute('PlannedVisitValue', data.PlannedVisitValue);
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        } else {
            this.setControlValue('PlannedVisitValue', '');
            this.setAttribute('PlannedVisitValue', '');
        }
    }

    // Get Descriptions through Post request
    public getDescriptions(): void {
        let _formData: Object = {};

        let _search = this.getURLSearchParamObject();
        _search.set(this.serviceConstants.Action, '6');

        _formData['Function'] = 'GetDescriptions';
        _formData['PlanVisitRowID'] = this.getControlValue('PlanVisitRowID');
        _formData['EmployeeCode'] = this.getControlValue('EmployeeCode');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search, _formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ContractNumber', data.ContractNumber);
                    this.setControlValue('ContractName', data.ContractName);
                    this.setControlValue('PremiseNumber', data.PremiseNumber);
                    this.setControlValue('PremiseName', data.PremiseName);
                    this.setControlValue('ProductCode', data.ProductCode);
                    this.setControlValue('ProductDesc', data.ProductDesc);
                    this.setControlValue('ServiceCoverNumber', data.ServiceCoverNumber);
                    this.setControlValue('VisitTypeCode', data.VisitTypeCode);
                    this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                    this.setControlValue('PlanVisitNumber', data.PlanVisitNumber);
                    this.setControlValue('BranchNumber', data.BranchNumber);
                    this.setControlValue('OriginalVisitDuration', data.OriginalVisitDuration);
                    this.setControlValue('PlannedVisitDuration', this.globalize.formatTimeToLocaleFormat(data.PlannedVisitDuration));
                    this.setControlValue('PlannedVisitValue', data.PlannedVisitValue);
                    this.setAttribute('PlannedVisitValue', data.PlannedVisitValue);
                    this.setControlValue('ServicePlanNumber', data.ServicePlanNumber);
                    this.setControlsStatus();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });

    }

    // Planned Visit Duration change event
    public plannedVisitDuration_onChange(event: Event): void {
        if (this.uiForm.controls['PlannedVisitDuration'].valid) {
            this.setPlannedValueEndTime();
        }
    }

    // Planned Visit Time Start change event
    public plannedVisitTimeStart_onChange(event: any): void {
        if (this.uiForm.controls['PlannedVisitTimeStart'].valid) {
            this.setPlannedValueEndTime();
        }
    }


    // Fetch PlanVisitDetail record
    public fetchPlanVisitDetailRecord(): void {
        let _search = this.getURLSearchParamObject();
        _search.set('ROWID', this.getControlValue('ROWID'));
        _search.set(this.serviceConstants.Action, '0');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('BusinessCode', data.BusinessCode);
                    this.setControlValue('ContractNumber', data.ContractNumber);
                    this.setControlValue('PremiseNumber', data.PremiseNumber);
                    this.setControlValue('ProductCode', data.ProductCode);
                    this.setControlValue('ProductDesc', data.ProductDesc);
                    this.setControlValue('ServiceCoverNumber', data.ServiceCoverNumber);
                    this.setControlValue('PlanVisitNumber', data.PlanVisitNumber);
                    this.setControlValue('PlanVisitDetailNumber', data.PlanVisitDetailNumber);
                    this.setControlValue('BranchNumber', data.BranchNumber);
                    this.setControlValue('EmployeeCode', data.EmployeeCode);
                    this.setControlValue('PlannedVisitDate', data.PlannedVisitDate);
                    this.setControlValue('PlannedVisitTimeStart', data.PlannedVisitTimeStart !== null ? data.PlannedVisitTimeStart : '');
                    this.setControlValue('PlannedVisitDuration', this.globalize.formatTimeToLocaleFormat(data.PlannedVisitDuration));
                    this.buildAndCallLookup();
                    this.riMaintenance.UpdateMode();
                    this.setPlannedValueEndTime();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    // Form submit event
    public onSubmit(event: any): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveRecord.bind(this)));
        }
    }

    // Save record
    public saveRecord(): void {
        let _formData: Object = {};

        let _search = this.getURLSearchParamObject();

        _formData['ContractNumber'] = this.getControlValue('ContractNumber');
        _formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        _formData['ProductCode'] = this.getControlValue('ProductCode');
        _formData['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
        _formData['PlanVisitNumber'] = this.getControlValue('PlanVisitNumber');
        _formData['PlanVisitDetailNumber'] = this.getControlValue('PlanVisitDetailNumber');
        _formData['EmployeeCode'] = this.getControlValue('EmployeeCode');
        _formData['PlannedVisitDate'] = this.getControlValue('PlannedVisitDate');
        _formData['PlannedVisitDuration'] = this.getControlValue('PlannedVisitDuration');
        _formData['PlannedVisitTimeStart'] = this.getControlValue('PlannedVisitTimeStart') ? this.getControlValue('PlannedVisitTimeStart') : '';
        _formData['BranchNumber'] = this.getControlValue('BranchNumber');
        _formData['PlannedVisitValue'] = this.getControlValue('PlannedVisitValue');
        _formData['StartDate'] = this.getControlValue('StartDate');
        _formData['EndDate'] = this.getControlValue('EndDate');

        if (this.riMaintenance.CurrentMode === MntConst.eModeAdd) {
            _search.set(this.serviceConstants.Action, '1');
        } else if (this.riMaintenance.CurrentMode === MntConst.eModeUpdate) {
            _search.set(this.serviceConstants.Action, '2');
            _formData['PlanVisitDetailROWID'] = this.getControlValue('PlanVisitDetailRowID');
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search, _formData)
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

    // Form cancel event
    public cancel_OnClick(event: any): void {
        this.formPristine();
        this.location.back();
    }

    // Form delete event
    public delete_OnClick(event: any): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteRecord.bind(this)));
    }

    // Delete record
    public deleteRecord(): void {
        let _formData: Object = {};

        let _search = this.getURLSearchParamObject();
        _search.set(this.serviceConstants.Action, '3');

        _formData['ContractNumber'] = this.getControlValue('ContractNumber');
        _formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        _formData['ProductCode'] = this.getControlValue('ProductCode');
        _formData['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
        _formData['PlanVisitNumber'] = this.getControlValue('PlanVisitNumber');
        _formData['PlanVisitDetailNumber'] = this.getControlValue('PlanVisitDetailNumber');
        _formData['PlanVisitDetailROWID'] = this.getControlValue('PlanVisitDetailRowID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, _search, _formData)
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
