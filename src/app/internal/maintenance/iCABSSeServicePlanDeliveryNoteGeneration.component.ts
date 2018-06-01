import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { RiMaintenance } from './../../../shared/services/riMaintenancehelper';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSSeServicePlanDeliveryNoteGeneration.html'
})

export class ServicePlanDeliveryNoteGenerationComponent extends BaseComponent implements OnInit, OnDestroy {
    public queryParams: any = {
        operation: 'Service/iCABSSeServicePlanDeliveryNoteGeneration',
        module: 'delivery-note',
        method: 'service-delivery/batch',
        action: '2'
    };
    public pageId: string = '';
    public riMaintenance: any;
    public SelectAction: string;
    public isServiceAreaLabel: boolean = true;
    public isServicePlanNumberLabel: boolean = true;
    public isStartDateLabel: boolean = true;
    public isEndDateLabel: boolean = true;

    public vSCDeliveryNoteTypeRequired: any;
    public vSCDeliveryNoteType: any;
    public SCDeliveryNoteTypeRequired: string;
    public SCDeliveryNoteType: number;

    private branchNumber: string;
    public locationsAndFormsDisplay: boolean = false;
    public thInformation: any;
    public thInformation2: any;

    public thInformationDisplayed: boolean = false;
    public thInformation2Displayed: boolean = false;

    public strTransListDesc: string;
    public strTransListRemDesc: string;
    public strTransReceiptDesc: string;

    //Date picker
    public SDstartdate: string;
    public EDenddate: string;
    public StartDate: Date = new Date();
    public StartDateDisplay: string;
    public StartTimeDisplay: Number;
    public EndDate: Date = new Date();
    public EndDateDisplay: string;
    public isDateReadOnly: boolean = true;
    public search: URLSearchParams = new URLSearchParams();
    public errorMessage: string;
    public autoOpen: boolean = false;
    public destinationType: any = {
        type: '',
        user: ''
    };

    private recordFound: boolean = false;

    public controls = [
        { name: 'SelectAction', readonly: true, disabled: false, required: false },
        { name: 'BranchServiceAreaCode', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'ServicePlanNumber', readonly: true, disabled: false, required: true, type: MntConst.eTypeInteger },
        { name: 'ServicePlanStartDate', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'ServicePlanEndDate', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'GenerateOption', readonly: true, disabled: false, required: false },
        { name: 'RepDest', readonly: true, disabled: false, required: false },
        { name: 'IncludeLocations', readonly: true, disabled: false, required: false },
        { name: 'NumberOfForms', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger }
    ];
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANDELIVERYNOTEGENERATION;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Generate Service Listing/Receipts';
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }


    public window_onload(): void {
        this.getSysCharDtetails();
    }

    public onRepDestChange(event: any): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'RepDest') === 'Listing') {
            this.destinationType['type'] = 'batch';
            this.destinationType['user'] = 'ReportID';
        } else {
            this.destinationType['type'] = 'email';
            this.destinationType['user'] = 'User';
        }
    }

    private getBranchServiceAreaDesc(): void {
        let lookUpSys = [{
            'table': 'Employee',
            'query': { 'EmployeeCode': this.getControlValue('BranchServiceAreaCode'), 'BranchNumber': this.utils.getBranchCode(), 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['EmployeeSurname']
        }];

        this.LookUp.lookUpRecord(lookUpSys).subscribe((data) => {
            if (data[0].length > 0 && data[0][0].BranchServiceAreaDesc) {
                this.setControlValue('EmployeeSurname', data[0][0].BranchServiceAreaDesc);
            }
        });
    }

    private getSysCharDtetails(): void {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharServiceDeliveryNoteType
        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: this.queryParams.action,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.vSCDeliveryNoteTypeRequired = record[0]['Required'];
            if (this.vSCDeliveryNoteTypeRequired === true)
                this.SCDeliveryNoteTypeRequired = 'True';
            else
                this.SCDeliveryNoteTypeRequired = 'False';
            this.vSCDeliveryNoteType = record[0]['Integer'];
            this.SCDeliveryNoteType = this.vSCDeliveryNoteType;
            this.setInitialValues();
            this.onRepDestChange({});
        });
    }
    private setInitialValues(): void {

        this.setControlValue('SelectAction', this.riExchange.getParentHTMLValue('SelectAction'));
        //SelectAction value checking
        this.SelectAction = this.getControlValue('SelectAction');
        if (this.SelectAction === 'GenerateSel') {
            this.isServiceAreaLabel = false;
            this.isServicePlanNumberLabel = false;
            this.isStartDateLabel = false;
            this.isEndDateLabel = false;
        }
        //Parent values
        this.setControlValue('BranchServiceAreaCode', this.riExchange.getParentAttributeValue('BranchServiceAreaCode'));
        this.setControlValue('EmployeeSurname', this.riExchange.getParentHTMLValue('EmployeeSurname'));
        this.setControlValue('ServicePlanNumber', this.riExchange.getParentAttributeValue('ServicePlanNumber'));
        this.setControlValue('ServicePlanStartDate', this.riExchange.getParentAttributeValue('ServicePlanStartDate'));
        this.setControlValue('ServicePlanEndDate', this.riExchange.getParentAttributeValue('ServicePlanEndDate'));
        this.setControlValue('IncludeLocations', false);
        this.setControlValue('NumberOfForms', '4');
        this.setControlValue('RepDest', 'Listing');
        this.getBranchServiceAreaDesc();
        //Disable Fields
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchServiceAreaCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeSurname');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServicePlanNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServicePlanStartDate');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServicePlanEndDate');
        this.branchNumber = this.utils.getBranchCode();
        if (this.vSCDeliveryNoteTypeRequired) {
            //this.locationsAndFormsDisplay = false;
            switch (this.SCDeliveryNoteType) {
                case 1:
                    this.setControlValue('GenerateOption', 'Receipts');
                    break;
                case 2:
                    this.setControlValue('GenerateOption', 'Listing');
                    break;
                case 3:
                    this.setControlValue('GenerateOption', 'Both');
                    this.locationsAndFormsDisplay = true;
                    break;
                case 4:
                    this.setControlValue('GenerateOption', 'TimeSheet');
                    break;
                default:
                    this.setControlValue('GenerateOption', 'Listing');
            }
        } else {
            this.setControlValue('GenerateOption', 'Listing');
        }
    }
    public SubmitReportGeneration(eventObj: any): void {
        this.TranslateDescription();
        if (this.SelectAction === 'GenerateSel') {
            this.riExchange.setParentHTMLValue('GenerateOption', this.getControlValue('GenerateOption'));
            this.riExchange.setParentHTMLValue('RunBatchProcess', true);
            this.location.back();
        } else {
            let generateOption = this.uiForm.controls['GenerateOption'].value;
            if (this.vSCDeliveryNoteTypeRequired) {
                switch (generateOption) {
                    case 'Listing':
                        this.submitReportRequestList();
                        break;
                    case 'ListingRem':
                        this.SubmitReportRequestListRemovals();
                        break;
                    case 'Receipts':
                        this.SubmitReportRequest();
                        break;
                    case 'Both':
                        this.SubmitReportBRequestList();
                        this.SubmitReportRequest();
                        break;
                    case 'TimeSheet':
                        this.SubmitReportRequest();
                        break;
                    default:
                    //Nothing
                }
            }
        }
    }


    //TranslateDescription
    private TranslateDescription(): void {
        this.strTransListDesc = 'Service Listing' + ' - ' + 'Area' + ' ' + this.getControlValue('BranchServiceAreaCode') + ' ' + 'Plan' + ' ' + this.getControlValue('ServicePlanNumber');
        this.strTransListRemDesc = 'Service Listing ' + '(Removals Only)' + ' - ' + 'Area' + ' ' + this.getControlValue('BranchServiceAreaCode') + ' ' + 'Plan' + ' ' + this.getControlValue('ServicePlanNumber');
        this.strTransReceiptDesc = 'Service Receipts' + ' - ' + 'Area' + ' ' + this.getControlValue('BranchServiceAreaCode') + ' ' + 'Plan' + ' ' + this.getControlValue('ServicePlanNumber');
    }


    // SubmitReportRequest
    private SubmitReportRequest(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        let postParams: any = {};
        postParams.Description = this.strTransReceiptDesc;

        let generateOption = this.uiForm.controls['GenerateOption'].value;
        if (generateOption === 'TimeSheet') {
            postParams.ProgramName = 'iCABSServiceTimeSheetGeneration.p';
        }
        else {
            postParams.ProgramName = 'iCABSServiceDeliveryNoteReportGeneration.p';
        }
        let date = new Date();
        postParams.StartDate = this.utils.formatDate(new Date());;
        postParams.EndDate = this.EndDateDisplay;
        postParams.StartTime = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberBranchServiceAreaCodeServicePlanNumberIncludeLocationsNumberOfFormsRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + '' + this.getControlValue('BranchServiceAreaCode') + '' + this.getControlValue('ServicePlanNumber') + '' + this.getControlValue('IncludeLocations') + '' + this.getControlValue('NumberOfForms') + '' + this.destinationType['type'] + '' + this.destinationType['user'];
        if (this.ajaxSource)
            this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        this.thInformation2 = e.fullError;
                        this.thInformation2Displayed = true;
                    }
                }
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }


    //submitReportRequestList
    private submitReportRequestList(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        let postParams: any = {};
        let date = new Date();
        postParams.Description = this.strTransListDesc;
        postParams.ProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
        postParams.StartDate = this.utils.formatDate(new Date());
        postParams.EndDate = this.EndDateDisplay;
        postParams.StartTime = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberBranchServiceAreaCodeServicePlanNumberIncludeLocationsNumberOfFormsRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + '' + this.getControlValue('BranchServiceAreaCode') + '' + this.getControlValue('ServicePlanNumber') + '' + this.getControlValue('IncludeLocations') + '' + this.getControlValue('NumberOfForms') + '' + this.destinationType['type'] + '' + this.destinationType['user'];
        if (this.ajaxSource)
            this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        this.thInformation = e.fullError;
                        this.thInformationDisplayed = true;
                    }
                }
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public checkAndNavigateBack(): void {
        if (this.SelectAction === 'GenerateSel') {
            this.location.back();
        }
    }

    //SubmitReportBRequestList
    private SubmitReportBRequestList(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        let postParams: any = {};
        let date = new Date();
        postParams.Description = this.strTransListDesc;
        postParams.ProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
        postParams.StartDate = this.utils.formatDate(new Date());
        postParams.EndDate = this.EndDateDisplay;
        postParams.StartTime = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberBranchServiceAreaCodeServicePlanNumberIncludeLocationsNumberOfFormsRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + '' + this.getControlValue('BranchServiceAreaCode') + '' + this.getControlValue('ServicePlanNumber') + '' + this.getControlValue('IncludeLocations') + '' + this.getControlValue('NumberOfForms') + '' + this.destinationType['type'] + '' + this.destinationType['user'];
        if (this.ajaxSource)
            this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        this.thInformation = e.fullError;
                        this.thInformationDisplayed = true;
                    }
                }
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }


    //SubmitReportRequestListRemovals
    private SubmitReportRequestListRemovals(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        let postParams: any = {};
        let date = new Date();
        postParams.Description = this.strTransListRemDesc;
        postParams.ProgramName = 'iCABSServiceDeliveryNoteListRemGeneration.p';
        postParams.StartDate = this.utils.formatDate(new Date());
        postParams.EndDate = this.EndDateDisplay;
        postParams.StartTime = ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds();
        postParams.Report = 'report';
        postParams.ParameterName = 'BusinessCodeBranchNumberBranchServiceAreaCodeServicePlanNumberIncludeLocationsNumberOfFormsRepManDest';
        postParams.ParameterValue = this.businessCode() + '' + this.branchNumber + '' + this.getControlValue('BranchServiceAreaCode') + '' + this.getControlValue('ServicePlanNumber') + '' + this.getControlValue('IncludeLocations') + '' + this.getControlValue('NumberOfForms') + '' + this.destinationType['type'] + '' + this.destinationType['user'];
        if (this.ajaxSource)
            this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        this.thInformation = e.fullError;
                        this.thInformationDisplayed = true;
                    }
                }
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                if (this.ajaxSource)
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
}
