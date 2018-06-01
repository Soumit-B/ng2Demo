import { OnInit, Injector, Component, OnDestroy, AfterViewInit, ViewChild, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSAVisitAppointmentMaintenance.html'
})

export class VisitAppointmentMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    private queryParams: Object = {
        operation: 'Application/iCABSAVisitAppointmentMaintenance',
        module: 'planning',
        method: 'service-planning/maintenance'
    };

    public numberLabel: string;
    public pageId: string = '';
    public controls: Array<Object> = [
        { name: 'ContractNumber', disabled: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText },
        { name: 'BranchServiceAreaCode', disabled: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'BranchServiceAreaDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true, type: MntConst.eTypeText },
        { name: 'VisitTypeCode', disabled: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'VisitTypeDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductCode', disabled: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'RoutingVisitStartTime', required: true, type: MntConst.eTypeTime },
        { name: 'AppointmentConfirmed' },
        { name: 'AppointmentConfirmedReason', type: MntConst.eTypeText },
        { name: 'EstimatedDuration', type: MntConst.eTypeText },
        { name: 'PlanVisitSeqNo', type: MntConst.eTypeText },
        { name: 'SpecialInstructions', type: MntConst.eTypeText },
        { name: 'OriginalVisitDueDate', required: true, type: MntConst.eTypeDate },
        { name: 'BranchNumber' },
        { name: 'ServiceCoverNumber' },
        { name: 'PlanVisitRowID' },
        { name: 'IsFollowUp' }
    ];

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning())
            this.populateUIFromFormData();
        else
            this.fetchRecords();
    }

    ngAfterViewInit(): void {
        this.numberLabel = this.riExchange.getCurrentContractTypeLabel() + ' Number';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAVISITAPPOINTMENTMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Visit Appointment Maintenance';
    }

    private fetchRecords(): void {
        this.pageParams.parentMode = this.riExchange.getParentMode();
        if (this.pageParams.parentMode === 'ServicePlan') {
            this.disableControl('OriginalVisitDueDate', true);
            this.disableControl('AppointmentConfirmed', true);
            this.disableControl('AppointmentConfirmedReason', true);
            this.disableControl('PlanVisitSeqNo', true);
        }
        if (this.pageParams.parentMode === 'ServicePlanning' || this.pageParams.parentMode === 'ServicePlan') {
            this.setControlValue('PlanVisitRowID', this.riExchange.getParentHTMLValue('PlanVisitRowID'));
        }

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('PlanVisitRowID', this.getControlValue('PlanVisitRowID'));
        searchParams.set('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        searchParams.set('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        searchParams.set('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));

        this.httpService.makeGetRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.START);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ContractNumber', data['ContractNumber']);
                    this.setControlValue('PremiseNumber', data['PremiseNumber']);
                    this.setControlValue('ProductCode', data['ProductCode']);
                    this.setControlValue('BranchNumber', data['BranchNumber']);
                    this.setControlValue('BranchServiceAreaCode', data['BranchServiceAreaCode']);
                    this.setControlValue('VisitTypeCode', data['VisitTypeCode']);
                    this.setControlValue('RoutingVisitStartTime', data['RoutingVisitStartTime']);
                    this.setControlValue('EstimatedDuration', data['EstimatedDuration']);
                    this.setControlValue('OriginalVisitDueDate', data['OriginalVisitDueDate']);
                    this.setControlValue('ServiceCoverNumber', data['ServiceCoverNumber']);
                    this.setControlValue('PlanVisitSeqNo', data['PlanVisitSeqNo']);
                    this.setControlValue('SpecialInstructions', data['SpecialInstructions']);
                    this.setControlValue('AppointmentConfirmed', data['AppointmentConfirmed']);
                    this.setControlValue('AppointmentConfirmedReason', data['AppointmentConfirmedReason']);
                    this.setControlValue('IsFollowUp', data['IsFollowUp']);
                    this.doLookupformData();
                    this.planVisitSeqNumberFormat();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private doLookupformData(): void {
        let lookupIP: Array<any>;

        lookupIP = [{
            'table': 'Contract',
            'query': {
                'BusinessCode': this.businessCode(),
                'ContractNumber': this.getControlValue('ContractNumber')
            },
            'fields': ['ContractName']
        },
        {
            'table': 'Premise',
            'query': {
                'BusinessCode': this.businessCode(),
                'ContractNumber': this.getControlValue('ContractNumber'),
                'PremiseNumber': this.getControlValue('PremiseNumber')
            },
            'fields': ['PremiseName']
        },
        {
            'table': 'Product',
            'query': {
                'BusinessCode': this.businessCode(),
                'ProductCode': this.getControlValue('ProductCode')
            },
            'fields': ['ProductDesc']
        },
        {
            'table': 'Branch',
            'query': {
                'BusinessCode': this.businessCode(),
                'BranchNumber': this.utils.getBranchCode()
            },
            'fields': ['BranchName', 'BranchNumber']
        },
        {
            'table': 'BranchServiceArea',
            'query': {
                'BusinessCode': this.businessCode(),
                'BranchNumber': this.utils.getBranchCode(),
                'BranchServiceAreaCode': this.getControlValue('BranchServiceAreaCode')
            },
            'fields': ['BranchServiceAreaDesc']
        },
        {
            'table': 'VisitType',
            'query': {
                'BusinessCode': this.businessCode(),
                'VisitTypeCode': this.getControlValue('VisitTypeCode')
            },
            'fields': ['VisitTypeDesc']
        },
        {
            'table': 'riCountry',
            'query': {
                'BusinessCode': this.businessCode(),
                'riCountryCode': this.countryCode()
            },
            'fields': ['riTimeSeparator']
        }
        ];

        this.LookUp.lookUpPromise(lookupIP).then(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.START);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data && data.length > 0) {
                        if (data[0][0])
                            this.setControlValue('ContractName', data[0][0].ContractName || '');
                        if (data[1][0])
                            this.setControlValue('PremiseName', data[1][0].PremiseName || '');
                        if (data[2][0])
                            this.setControlValue('ProductDesc', data[2][0].ProductDesc || '');
                        if (data[3][0])
                            this.setControlValue('BranchNumber', data[3][0].BranchNumber || '');
                        if (data[4][0])
                            this.setControlValue('BranchServiceAreaDesc', data[4][0].BranchServiceAreaDesc || '');
                        if (data[5][0])
                            this.setControlValue('VisitTypeDesc', data[5][0].VisitTypeDesc || '');
                        if (data[6][0])
                            this.pageParams.vbTimeSeparator = data[6][0]['riTimeSeparator'] || ':';
                    } else {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private promptConfirmSave(): void {
        let searchParams: URLSearchParams = new URLSearchParams(), formdata: Object = {};
        searchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '2');

        formdata = {
            ContractNumber: this.getControlValue('ContractNumber'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            ProductCode: this.getControlValue('ProductCode'),
            BranchServiceAreaCode: this.getControlValue('BranchServiceAreaCode'),
            VisitTypeCode: this.getControlValue('VisitTypeCode'),
            RoutingVisitStartTime: this.getControlValue('RoutingVisitStartTime'),
            EstimatedDuration: this.getControlValue('EstimatedDuration'),
            OriginalVisitDueDate: this.getControlValue('OriginalVisitDueDate'),
            ServiceCoverNumber: this.getControlValue('ServiceCoverNumber'),
            PlanVisitSeqNo: this.getControlValue('PlanVisitSeqNo'),
            SpecialInstructions: this.getControlValue('SpecialInstructions'),
            PlanVisitRowID: this.getControlValue('PlanVisitRowID'),
            BranchNumber: this.getControlValue('BranchNumber'),
            AppointmentConfirmedReason: this.getControlValue('AppointmentConfirmedReason'),
            AppointmentConfirmed: this.utils.convertCheckboxValueToRequestValue(this.getControlValue('AppointmentConfirmed')),
            IsFollowUp: this.utils.convertCheckboxValueToRequestValue(this.getControlValue('IsFollowUp'))
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, formdata).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.formPristine();
                    this.navigate('', InternalGridSearchServiceModuleRoutes.ICABSSESERVICEPLANNINGGRID);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    public planVisitSeqNumberFormat(): void {
        let prefixSymbol: string, suffixSymbol: any, planVisitSeqNo: any, formattedValue: any;
        let pattern = new RegExp('^[+-.]?[0-9]{0,4}(?:\.[0-9]{0,4})?$');

        if (pattern.test(this.getControlValue('PlanVisitSeqNo'))) {
            planVisitSeqNo = this.getControlValue('PlanVisitSeqNo');
            prefixSymbol = this.getControlValue('PlanVisitSeqNo').substring(0, 1);
            suffixSymbol = this.getControlValue('PlanVisitSeqNo').substring(1);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PlanVisitSeqNo', false);
            switch (prefixSymbol) {
                case '+':
                    formattedValue = (Math.floor(suffixSymbol).toString());
                    if (formattedValue.length <= 3)
                        this.setControlValue('PlanVisitSeqNo', this.utils.fillLeadingZeros(formattedValue, 4));
                    else
                        this.setControlValue('PlanVisitSeqNo', formattedValue);
                    break;
                case '-':
                    formattedValue = (Math.round(suffixSymbol).toString());
                    if (formattedValue.length < 3)
                        this.setControlValue('PlanVisitSeqNo', prefixSymbol + this.utils.fillLeadingZeros(formattedValue, 4));
                    else if (formattedValue.length > 3)
                        this.setControlValue('PlanVisitSeqNo', prefixSymbol + this.utils.fillLeadingZeros(formattedValue, 5));
                    else
                        this.setControlValue('PlanVisitSeqNo', prefixSymbol + formattedValue);
                    break;
                default:
                    formattedValue = (Math.floor(planVisitSeqNo).toString());
                    if (formattedValue.length < 4)
                        this.setControlValue('PlanVisitSeqNo', this.utils.fillLeadingZeros(formattedValue, 4));
                    else
                        this.setControlValue('PlanVisitSeqNo', formattedValue);
                    break;
            }
        } else {
            this.setControlValue('PlanVisitSeqNo', '');
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'PlanVisitSeqNo', true);
        }
    }

    public estimatedDurationOnChange(): void {
        let vbTime: string, vbDurationHours: string, vbDurationMinutes: any, vbTimeFormat: string;
        let pattern = new RegExp('^[:]?[0-9]{0,4}(?:\:[0-9]{0,4})?$');
        vbTime = this.getControlValue('EstimatedDuration').replace(this.pageParams.vbTimeSeparator, '');

        if (pattern.test(this.getControlValue('EstimatedDuration')) && (vbTime.length > 3)) {
            if (vbTime.length === 5) {
                vbDurationHours = this.utils.Left(vbTime, 3);
                vbDurationMinutes = this.utils.Right(vbTime, 2);
            } else {
                vbDurationHours = this.utils.Left(vbTime, 2);
                vbDurationMinutes = this.utils.Right(vbTime, 2);
            }
            if (vbDurationMinutes > 59)
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.vbDurationMinutes));
            else
                vbTimeFormat = vbDurationHours + this.pageParams.vbTimeSeparator + vbDurationMinutes;
        } else {
            vbTimeFormat = '00' + this.pageParams.vbTimeSeparator + '00';
        }
        this.setControlValue('EstimatedDuration', vbTimeFormat || '');
    }

     public visitDueDateSelectedValue(value: any): void {
        if (value.value)
            this.setControlValue('OriginalVisitDueDate', value.value);
    }

    public appointmentConfirmed(): void {
        if (this.getControlValue('AppointmentConfirmed') === true) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingVisitStartTime', true);
            this.disableControl('AppointmentConfirmedReason', false);
            this.pageParams.isVisitStartTime = true;
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'RoutingVisitStartTime', false);
            this.setControlValue('AppointmentConfirmedReason', '');
            this.disableControl('AppointmentConfirmedReason', true);
            this.pageParams.isVisitStartTime = false;
        }
    }

    public visitStartTimeOnChange(): void {
        let vbTimeFormat = '00' + this.pageParams.vbTimeSeparator + '00';
        if (!this.getControlValue('RoutingVisitStartTime'))
            this.setControlValue('RoutingVisitStartTime', vbTimeFormat);
    }

    public saveOnClick(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, '', this.promptConfirmSave.bind(this)));
    }

    public cancelOnClick(): void {
        this.fetchRecords();
        this.navigate('', InternalGridSearchServiceModuleRoutes.ICABSSESERVICEPLANNINGGRID);
    }

}
