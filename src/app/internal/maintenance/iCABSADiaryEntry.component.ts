import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { EmployeeGridComponent } from './../search/iCABSAEmployeeGrid.component';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { URLSearchParams } from '@angular/http';
import { EmployeeSearchComponent } from './../search/iCABSBEmployeeSearch';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';


@Component({
    templateUrl: 'iCABSADiaryEntry.html'
})

export class DiaryEntryComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('SelEntryType') public selEntryType: DropdownStaticComponent;
    @ViewChild('employeeSelectEllipsis') public employeeSelectEllipsis: EllipsisComponent;
    @ViewChild('TimeFrom') public TimeFrom: any;
    @ViewChild('TimeTo') public TimeTo: any;

    public timeRequired: boolean = true;
    public employeeRequired: boolean = true;
    public fieldsDisabled: boolean = false;
    public DateFrom: Date = new Date();
    public DateTo: Date = new Date();
    public currentMode = 'U';
    public promptTitle: string = 'Confirm Record?';
    public triggerRefreshComponent: boolean = false;

    private headerParams: any = {
        method: 'service-planning/grid',
        module: 'diary',
        operation: 'Application/iCABSADiaryEntry'
    };
    public diaryEventTypes: Array<any> = [];
    public diaryEventDefaultOption: Object = {
        'value': 'None',
        'text': 'None'
    };

    public ellipsisConfig = {
        employeeTo: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUpTo',
            showAddNew: false,
            component: EmployeeSearchComponent
        },
        employeeSelect: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp',
            showAddNew: false,
            component: EmployeeGridComponent
        }
    };

    public pageId: string = '';
    public controls = [
        //Primary Section
        { name: 'EmployeeCode', required: true },
        { name: 'EmployeeSurname', required: true },
        { name: 'DiaryEventDateFrom' },
        { name: 'DiaryEventDateTo' },
        { name: 'DiaryEventAllDayInd' },
        { name: 'TimeFrom', required: true },
        { name: 'TimeTo', required: true },
        { name: 'DiaryOwner' },
        { name: 'DiaryEventText' },
        { name: 'LinkedEmployees' },
        { name: 'EmployeeCodeTo' },
        { name: 'EmployeeSurnameTo', disabled: true },
        { name: 'RedirectMessagingInd' },
        { name: 'RedirectEmployeeInd' },
        { name: 'btnSelect' },
        //hidden
        { name: 'DiaryEventNumber' },
        { name: 'DiaryEventRowid' },
        { name: 'DiaryEventTypeCodes' },
        { name: 'DiaryEventTypeDescs' },
        { name: 'ReasonCode' },
        { name: 'ReasonDesc' },
        { name: 'PasswordCheck' },
        { name: 'BusinessCode' },
        { name: 'PlanRemoved' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSADIARYENTRY;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Diary Entry';
        this.windowOnLoad();

    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    /**
     * Fires on Window Load
     */
    public windowOnLoad(): void {
        if (this.parentMode !== 'TechVisitDiary') {
            this.riExchange.getParentHTMLValue('EmployeeCode');
        }
        if (this.parentMode === 'YearGrid' || this.parentMode === 'DiaryGridAdd') {
            this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeName'));
        } else if (this.parentMode === 'TechVisitDiary') {
            this.setControlValue('EmployeeCode', this.riExchange.getParentHTMLValue('PassDiaryEmployeeCode'));
            this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('PassDiaryEmployeeName'));
        } else {
            this.riExchange.getParentHTMLValue('EmployeeSurname');
        }

        this.setControlValue('DiaryEventNumber', this.riExchange.getParentHTMLValue('PassDiaryEntryNumber'));
        this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
        this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));

        this.setControlValue('DiaryEventDateFrom', this.utils.formatDate(this.DateFrom.toString()));
        this.setControlValue('DiaryEventDateTo', this.utils.formatDate(this.DateTo.toString()));
        //Before
        this.getDiaryEventTypes();

        //After
        if (this.getControlValue('DiaryEventNumber')) {
            if (this.getControlValue('DiaryEventNumber') !== '' && parseInt(this.getControlValue('DiaryEventNumber'), 10) > 0) {
                this.getDiaryEventRowid();
            } else {
                this.currentMode = 'A';
                this.setControlValue('DiaryOwner', true);
                this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.setControlValue('DiaryEventDateFrom', this.utils.formatDate(this.DateFrom));
                this.setControlValue('DiaryEventDateTo', this.utils.formatDate(this.DateTo));

                this.setControlValue('TimeFrom', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                this.setControlValue('TimeTo', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));

                let vTimeSplit = this.riExchange.getParentHTMLValue('TimeTo').split(':');
                this.setControlValue('TimeTo', (vTimeSplit[0] + 1) + ':' + (vTimeSplit[1]));
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            }
        } else {
            this.currentMode = 'A';
            this.setControlValue('DiaryOwner', true);
            if (this.parentMode === 'YearGrid') {
                this.DateFrom = new Date();
                this.DateTo = new Date();
            } else if (this.parentMode === 'DiaryGridAdd') {
                this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DateFrom'));
                this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DateFrom'));
            } else if (this.parentMode === 'TechVisitDiary') {
                this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.setControlValue('TimeFrom', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                this.setControlValue('TimeTo', this.riExchange.getParentHTMLValue('PassDiaryEndTime'));

                let vTimeFromSplit = this.riExchange.getParentHTMLValue('PassDiaryStartTime').split(':');
                this.setControlValue('TimeFrom', vTimeFromSplit[0] + ':' + vTimeFromSplit[1]);
                let vTimeToSplit = this.riExchange.getParentHTMLValue('PassDiaryEndTime').split(':');
                this.setControlValue('TimeTo', vTimeToSplit[0] + ':' + vTimeToSplit[1]);
            } else {
                this.DateFrom = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.DateTo = this.convertLocalDate(this.riExchange.getParentHTMLValue('DiaryDate'));
                this.setControlValue('TimeFrom', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));
                this.setControlValue('TimeTo', this.riExchange.getParentHTMLValue('PassDiaryStartTime'));

                let vTimeSplit = this.riExchange.getParentHTMLValue('PassDiaryStartTime').split(':');
                this.setControlValue('TimeTo', (vTimeSplit[0] + 1) + ':' + vTimeSplit[1]);
            }

            this.setControlValue('DiaryEventDateFrom', this.utils.formatDate(this.DateFrom.toString()));
            this.setControlValue('DiaryEventDateTo', this.utils.formatDate(this.DateTo.toString()));
            this.routeAwayGlobals.setSaveEnabledFlag(true);
        }

        // Event Number is populated so this must be an update so there will be data to return
        this.setControlValue('DiaryEventNumber', this.riExchange.getParentHTMLValue('PassDiaryEntryNumber'));
    }

    /**
     * Fetches Diary Event Types
     */
    private getDiaryEventTypes(): void {
        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set(this.serviceConstants.Function, 'GetDiaryEventTypes');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                let vcDiaryEventTypeCodes = data.DiaryEventTypeCodes.split(';');
                let vcDiaryEventTypeDescs = data.DiaryEventTypeDescs.split(';');

                for (let i = 0; i < vcDiaryEventTypeCodes.length; i++) {
                    let obj = {
                        text: vcDiaryEventTypeDescs[i],
                        value: vcDiaryEventTypeCodes[i]
                    };
                    this.diaryEventTypes.push(obj);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error =>', error);
                return;
            });
    }

    /**
     * Fetches rowId for Diary
     */
    private getDiaryEventRowid(): void {
        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '6');
        queryParams.set('Function', 'GetDiaryEventRowid');
        queryParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        queryParams.set('DiaryEventDateFrom', this.getControlValue('DiaryEventDateFrom'));
        queryParams.set('DiaryEventNumber', this.getControlValue('DiaryEventNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage || data.fullError) {
                    this.errorModal.show(data, true);
                    return;
                }

                this.setControlValue('DiaryEventRowid', data.DiaryEventRowid);
                this.setControlValue('TimeFrom', data.DiaryTimeFrom);
                this.setControlValue('TimeTo', data.DiaryTimeTo);
                this.selEntryType.selectedItem = data.DiaryEventType;
                this.setControlValue('EmployeeTo', data.EmployeeTo);
                this.setControlValue('SurnameTo', data.SurnameTo);
                this.setControlValue('LinkedEmployees', data.LinkedEmployees);

                this.setControlValue('DiaryEventAllDayInd', this.utils.convertResponseValueToCheckboxInput(String(data.DiaryAllDay).toUpperCase()));
                this.setControlValue('DiaryOwner', this.utils.convertResponseValueToCheckboxInput(String(data.DiaryOwner).toUpperCase()));
                this.setControlValue('RedirectEmployeeInd', this.utils.convertResponseValueToCheckboxInput(String(data.RedirectEmployee).toUpperCase()));
                this.setControlValue('RedirectMessagingInd', this.utils.convertResponseValueToCheckboxInput(String(data.RedirectMessagingInd).toUpperCase()));

                //this.riMaintenance.RowID(this.uiForm, 'DiaryEvent', data.DiaryEventRowid);
                this.performDiaryEvent();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error =>', error);
                return;
            });
    }

    /**
     * Fetch Diary Event
     */
    private performDiaryEvent(): void {
        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '0');

        queryParams.set('ROWID', this.getControlValue('DiaryEventRowid'));
        queryParams.set('DiaryEventNumber', this.getControlValue('DiaryEventNumber'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage || data.fullError) {
                    this.errorModal.show(data, true);
                    return;
                }
                this.routeAwayGlobals.setSaveEnabledFlag(true);
                this.setControlValue('DiaryEventText', data.DiaryEventText);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error =>', error);
                return;
            });
    }

    /**
     * Calls before Save operation is performed
     */
    public riMaintenance_BeforeSave(): void {
        if (!this.getControlValue('DiaryEventAllDayInd')) {
            let isError = false;
            if (!this.getControlValue('TimeFrom')) {
                isError = this.riExchange.riInputElement.isError(this.uiForm, 'TimeFrom');
            }
            if (!this.getControlValue('TimeTo')) {
                isError = this.riExchange.riInputElement.isError(this.uiForm, 'TimeTo');
            }
            if (isError) return;
        }
        this.riMaintenance_SaveRecord();
    }

    /**
     * Update/Add Record
     */
    public riMaintenance_SaveRecord(): void {
        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (this.currentMode === 'U') {
            queryParams.set(this.serviceConstants.Action, '2');
        } else {
            queryParams.set(this.serviceConstants.Action, '1');
        }

        let bodyParams = {};
        if (this.currentMode === 'U') {
            bodyParams['DiaryEventROWID'] = this.getControlValue('DiaryEventRowid');
        }
        bodyParams['DiaryEventNumber'] = this.getControlValue('DiaryEventNumber') ? this.getControlValue('DiaryEventNumber') : '';
        bodyParams['DiaryEventDateTo'] = this.getControlValue('DiaryEventDateTo');
        bodyParams['DiaryEventDateFrom'] = this.getControlValue('DiaryEventDateFrom');
        bodyParams['DiaryEventText'] = this.getControlValue('DiaryEventText');
        bodyParams['LinkedEmployees'] = this.getControlValue('LinkedEmployees');
        bodyParams['EmployeeCode'] = this.getControlValue('EmployeeCode');
        bodyParams['TimeFrom'] = this.getControlValue('TimeFrom');
        bodyParams['TimeTo'] = this.getControlValue('TimeTo');
        bodyParams['AllDayInd'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('DiaryEventAllDayInd'));
        bodyParams['Owner'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('DiaryOwner'));
        bodyParams['DiaryEventType'] = this.selEntryType.selectedItem;
        bodyParams['EmployeeTo'] = this.getControlValue('EmployeeCodeTo');
        bodyParams['RedirectMessaging'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('RedirectMessagingInd'));
        bodyParams['RedirectEmployee'] = this.utils.convertCheckboxValueToRequestValue(this.getControlValue('RedirectEmployeeInd'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                this.routeAwayGlobals.setSaveEnabledFlag(false);
                this.location.back();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error =>', error);
                return;
            });
    }

    /**
     * Deletes Selected Record
     */
    public riMaintenance_DeleteRecord(): void {
        let queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryParams.set(this.serviceConstants.Action, '3');

        let bodyParams = {};
        bodyParams['DiaryEventROWID'] = this.getControlValue('DiaryEventRowid');
        bodyParams['DiaryEventNumber'] = this.getControlValue('DiaryEventNumber');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorModal.show(data, true);
                    return;
                }
                this.routeAwayGlobals.setSaveEnabledFlag(false);
                this.location.back();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.logger.log('Error =>', error);
                return;
            });
    }

    /**
     * Updates on checkbox change
     * @param e
     */
    public diaryEventAllDayInd_ondeactivate(target: any): void {
        this.timeRequired = !target.checked;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TimeFrom', this.timeRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TimeTo', this.timeRequired);
    }

    /**
     * Calls method to fetch Employee surname
     * @param empType
     */
    public employeeCode_OnChange(empType: string): void {
        if (this.getControlValue('EmployeeCodeTo') === '' && empType === 'EmployeeTo') {
            this.setControlValue('EmployeeSurnameTo', '');
        } else if (this.getControlValue('EmployeeCode') === '' && empType === 'EmployeeFrom') {
            this.setControlValue('EmployeeSurname', '');
        } else {
            let queryParams: URLSearchParams = new URLSearchParams();
            queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            queryParams.set(this.serviceConstants.Action, '6');
            queryParams.set(this.serviceConstants.Function, 'EmployeeDetails');
            if (empType === 'EmployeeTo') {
                queryParams.set('EmployeeCode', this.getControlValue('EmployeeCodeTo'));
            } else {
                queryParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
            }

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.errorMessage) {
                        this.errorModal.show(data, true);
                        return;
                    }
                    if (empType === 'EmployeeTo') {
                        this.setControlValue('EmployeeSurnameTo', data.EmployeeSurname);
                    } else {
                        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.logger.log('Error =>', error);
                    return;
                });
        }
    }

    public onEmployeeGridOpen(): void {
        this.employeeSelectEllipsis.openModal();
    }

    /**
     * Updates Date after blur
     */
    public updateDateValue(value: any, type: string): void {
        if (value && value.value) {
            if (type === 'From') {
                this.setControlValue('DiaryEventDateFrom', value.value);
            }
            else if (type === 'To') {
                this.setControlValue('DiaryEventDateTo', value.value);
            }
        }
    }

    /**
     * On Ellipsis Row Select
     */
    public ellipsisData_Select(data: any, type: string): void {
        if (type === 'employeeTo') {
            this.setControlValue('EmployeeCodeTo', data.EmployeeCodeTo);
            this.setControlValue('EmployeeSurnameTo', data.EmployeeSurnameTo);
        } else {
            this.setControlValue('LinkedEmployees', data);
        }

    }

    /**
     * Converts Date to DD/MM/YYYY format
     */
    private convertLocalDate(newDate: any): any {
        if (moment(newDate, 'DD/MM/YYYY', true).isValid()) {
            newDate = this.utils.convertDate(newDate);
        } else {
            newDate = this.utils.formatDate(newDate);
        }
        return new Date(newDate);
    }


    /*
    Method: btnDelete_onClick():
    Params:
    Details: Propmts for Comfirmation before Delete
    */
    public btnDelete_onClick(): void {
        this.promptModal.show();
    }


    /**
     * On Cancel button click
     */
    public onAbandonClick(): void {
        this.location.back();
    }

    /*
    *   Alerts user when user is moving away without saving the changes. //CR implementation
    */
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }

    public modalHidden(): void {
        this.triggerRefreshComponent = true;
        setTimeout(() => {
            this.triggerRefreshComponent = false;
        }, 100);
    }

    public timeValidation(event: any, field: any): any {
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, false);
        let formatedTime: any;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TimeFrom', this.timeRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TimeTo', this.timeRequired);

        if (event) formatedTime = this.formatTime(event, field);
    }

    public formatTime(time: any, field: any): void {
        if (time.indexOf(':') === -1) {
            let result: any = '';
            let re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            let firstDta = parseInt(time[0] + time[1], 10);
            let secondDta = parseInt(time[2] + time[3], 10);
            if (((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) && time.length === 4) {
                result = time[0] + time[1] + ':' + time[2] + time[3];
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, false);
                this.setControlValue(field, result);
            }
            else {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, true);
                this.setControlValue(field, time);
            }
        } else {
            let firstDta = time.split(':')[0];
            let secondDta = time.split(':')[1];
            if (!((firstDta < 24 && secondDta < 60) || (firstDta === 24 && secondDta === 0)) || time.length !== 5) {
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, field, true);
                this.setControlValue(field, time);
            }
        }
    }
}
