import { Component, OnInit, Injector, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Params } from '@angular/router';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { EmployeeSearchComponent } from './../search/iCABSBEmployeeSearch';

@Component({
    templateUrl: 'iCABSCMProspectConversionMaintenance.html'
})

export class ProspectConversionMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public pageId: string;
    private curPageMode: string;
    private uiFormData: any;
    private gLanguageCode: string;

    //Form variables
    public controls: any[] = [
        { name: 'ProspectNumber', disabled: true, required: true },
        { name: 'ProspectName', disabled: true },
        { name: 'ConvertedToNumber', disabled: false, required: true },
        { name: 'ConvertedToName', disabled: true },
        { name: 'ContractTypeCode', required: true },
        { name: 'ConvertedDate', required: true },
        { name: 'ConvertedSalesEmployeeCode', required: true },
        { name: 'ConvertedSalesEmployeeCodeName', disabled: true },
        { name: 'ConvertedValue', required: true }
    ];

    //API variables
    public xhrConfig = {
        method: 'prospect-to-contract/maintenance',
        module: 'prospect',
        operation: 'ContactManagement/iCABSCMProspectConversionMaintenance'
    };

    //Datepicker variables
    public datePickerConfig = {
        isRequired: true
    };

    //Ellipsis variables
    public ellipsConf: any = {
        convertedToNumber: {
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-ProspectConversion'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ContractSearchComponent,
            showHeader: true
        },
        salesEmployee: {
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-ConvertedSales'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: EmployeeSearchComponent,
            showHeader: true
        }
    };

    //LookUp varuables
    public ttContractTypeLang = [];

    //Page Business logis
    private rowID: any;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMPROSPECTCONVERSIONMAINTENANCE;
        this.pageTitle = 'Prospect Conversion Maintenance';
        this.browserTitle = this.pageTitle;
        this.gLanguageCode = this.riExchange.LanguageCode();
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.pageParams.initFormData = {};
        }
    }

    ngAfterViewInit(): void {
        this.initPage();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private initPage(): void {
        this.rowID = '';
        this.curPageMode = (this.parentMode) ? this.parentMode.toLowerCase() : '';
        switch (this.curPageMode) {
            case this.c_s_MODE_ADD:
                let prospectNumber: any = this.riExchange.getParentHTMLValue('ProspectNumber');
                if (prospectNumber) {
                    this.setControlValue('ProspectNumber', prospectNumber);
                    this.getProspectName(prospectNumber);
                }
                break;
            case this.c_s_MODE_UPDATE:
                this.rowID = this.riExchange.getParentAttributeValue('ProspectConversionRowID');
                if (this.rowID) {
                    this.fetchRecord();
                }
                break;
        }
        this.doLookup();
    }

    private getProspectName(prospectNumber: any): void {
        let queryParams: any, formData: any = {};
        queryParams = this.getURLSearchParamObject();
        queryParams.set(this.serviceConstants.Action, '6');

        //body Params
        formData['PostDesc'] = 'SetProspectName';
        formData['ProspectNumber'] = prospectNumber;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrConfig.method, this.xhrConfig.module,
            this.xhrConfig.operation, queryParams, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.pageParams.initFormData.ProspectName = data.ProspectName;
                    this.setControlValue('ProspectName', data.ProspectName);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }

    private fetchRecord(): void {
        let queryParams: any;
        queryParams = this.getURLSearchParamObject();
        queryParams.set(this.serviceConstants.Action, '0');
        queryParams.set('ROWID', this.rowID);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrConfig.method, this.xhrConfig.module,
            this.xhrConfig.operation, queryParams)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.pageParams.initFormData = data;
                    this.populateDataToForm(data);
                    this.getProspectName(data.ProspectNumber);
                    this.fetchContactJobDetails(data.ConvertedToNumber);
                    this.fetchEmployeeDetails(data.ConvertedSalesEmployeeCode);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }
    private populateDataToForm(data: any): void {
        if (data) {
            this.setControlValue('ProspectNumber', data.ProspectNumber);
            this.setControlValue('ConvertedToNumber', data.ConvertedToNumber);
            this.setControlValue('ContractTypeCode', data.ContractTypeCode);
            if (data.ConvertedDate) {
                this.setControlValue('ConvertedDate', this.utils.formatDate(data.ConvertedDate));
            }
            this.setControlValue('ConvertedSalesEmployeeCode', data.ConvertedSalesEmployeeCode);
            this.setControlValue('ConvertedValue', data.ConvertedValue);
            this.setControlValue('ProspectNumber', data.ProspectNumber);
            this.setControlValue('ProspectNumber', data.ProspectNumber);
            this.setControlValue('ProspectNumber', data.ProspectNumber);
            this.disableControl('ConvertedToNumber', true);
        }
    }

    public convertedToNumberOnChange(e: any): void {
        let val: any = e.target.value;
        this.setControlValue('ContractTypeCode', '');
        this.setControlValue('ConvertedToName', '');
        this.validateContractNumber(val);
    }
    private validateContractNumber(convertedToNumber: any): void {
        let queryParams: any, formData: any = {};
        queryParams = this.getURLSearchParamObject();
        queryParams.set(this.serviceConstants.Action, '6');

        //body Params
        formData['Function'] = 'ValidateContractNumber';
        formData['ConvertedToNumber'] = convertedToNumber;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrConfig.method, this.xhrConfig.module,
            this.xhrConfig.operation, queryParams, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data.IsValidContract === 'yes') {
                        this.setControlValue('ContractTypeCode', data.ContractTypeCode);
                        this.fetchContactJobDetails(convertedToNumber);
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }
    public convertedSalesEmployeeCodeOnChange(e: any): void {
        let val: any = e.target.value;
        this.fetchEmployeeDetails(val);
    }

    //Start: Loockup functionality
    private prepareLookupReqData(type?: string, data?: any): any {
        let reqData: any;
        switch (type) {
            case 'ConvertedToName':
                reqData = [{
                    'table': 'Contract',
                    'query': { 'BusinessCode': this.businessCode(), 'ContractNumber': data },
                    'fields': ['ContractName']
                }];
                break;
            case 'ConvertedSalesEmployeeCodeName':
                reqData = [{
                    'table': 'Employee',
                    'query': { 'BusinessCode': this.businessCode(), 'EmployeeCode': data },
                    'fields': ['EmployeeSurname']
                }];
                break;
            default:
                reqData = [{
                    'table': 'ContractTypeLang',
                    'query': { 'LanguageCode': this.gLanguageCode, 'BusinessCode': this.businessCode() },
                    'fields': ['ContractTypeCode', 'ContractTypeDesc']
                }];
                break;
        }
        return reqData;
    }
    public doLookup(): void {
        let reqData = this.prepareLookupReqData();
        this.LookUp.lookUpPromise(reqData).then(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data && data[0].length > 0) {
                        let ContractTypeLang: any[] = data[0];
                        ContractTypeLang.forEach(o => {
                            this.ttContractTypeLang.push({
                                'contractTypeCode': o.ContractTypeCode,
                                'contractTypeDesc': o.ContractTypeDesc,
                                'ttContractTypeLang': o.ttContractTypeLang
                            });
                        });
                    }
                }
            }
        ).catch(
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }
    public fetchContactJobDetails(contractNumber: any): void {
        let reqData = this.prepareLookupReqData('ConvertedToName', contractNumber);
        this.LookUp.lookUpPromise(reqData).then(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    let value: any = '';
                    if (data && data[0].length > 0) {
                        value = data[0][0].ContractName;
                    }
                    this.setControlValue('ConvertedToName', value);
                }
            }
        ).catch(
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }
    public fetchEmployeeDetails(employeeCode: any): void {
        let reqData = this.prepareLookupReqData('ConvertedSalesEmployeeCodeName', employeeCode);
        this.LookUp.lookUpPromise(reqData).then(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    let value: any = '';
                    if (data && data[0].length > 0) {
                        value = data[0][0].EmployeeSurname;
                    }
                    this.setControlValue('ConvertedSalesEmployeeCodeName', value);
                }
            }
        ).catch(
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }
    private saveConfirmLookup(): void {
        let reqData = [{
            'table': 'Prospect',
            'query': { 'ProspectNumber': this.uiFormData.ProspectNumber, 'BusinessCode': this.businessCode() },
            'fields': ['Name']
        }, {
            'table': 'ContractTypeLang',
            'query': { 'LanguageCode': this.gLanguageCode, 'BusinessCode': this.businessCode(), 'ContractTypeCode': this.uiFormData.ContractTypeCode },
            'fields': ['ContractTypeDesc']
        }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(reqData).then(
            data => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.doSave.bind(this)));
                }
            }
        ).catch(
            error => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }
    //End: Loockup functionality

    //Start: Ellipsis functionality
    public onConvertedToNumberEllipsisDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ConvertedToNumber', data.ContractNumber);
            this.setControlValue('ConvertedToName', data.ContractName);
        }
    }

    public onSalesEmployeeEllipsisDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ConvertedSalesEmployeeCode', data.ConvertedSalesEmployeeCode);
            this.setControlValue('ConvertedSalesEmployeeCodeName', data.ConvertedSalesEmployeeSurname);
        }
    }
    //End: Ellipsis functionality

    //Start: Save functionality
    public onClickSaveBtn(): void {
        this.uiFormData = this.uiForm.getRawValue();
        if (this.validateForm()) {
            this.saveConfirmLookup();
        }
    }
    private validateForm(): boolean {
        let isValid: boolean = this.riExchange.validateForm(this.uiForm);
        if (isValid) {
            if (!this.uiFormData.ProspectNumber) {
                isValid = false;
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.ERRORS_ON_PAGE_PROSPECT_NUMBER));
            }
        }
        return isValid;
    }
    private doSave(): void {
        let queryParams: any, formData: any = {};
        queryParams = this.getURLSearchParamObject();

        //body Params
        formData['ProspectNumber'] = this.getControlValue('ProspectNumber');
        formData['ContractTypeCode'] = this.getControlValue('ContractTypeCode');
        formData['ConvertedDate'] = this.getControlValue('ConvertedDate');
        formData['ConvertedSalesEmployeeCode'] = this.getControlValue('ConvertedSalesEmployeeCode');
        formData['ConvertedValue'] = this.getControlValue('ConvertedValue');

        if (this.parentMode.toLowerCase() === this.c_s_MODE_ADD) {
            queryParams.set(this.serviceConstants.Action, '1');
            formData['ConvertedToNumber'] = this.getControlValue('ConvertedToNumber');
        } else {
            queryParams.set(this.serviceConstants.Action, '2');
            formData['ROWID'] = this.rowID;
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrConfig.method, this.xhrConfig.module,
            this.xhrConfig.operation, queryParams, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.uiForm.markAsPristine();
                    setTimeout(this.onClickCancelBtn, 1000);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
            );
    }
    //End: Save functionality

    //Start: Cancel functionality
    public onClickCancelBtn(): void {
        this.location.back();
    }
    //End: Cancel functionality
}
