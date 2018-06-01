import { MessageConstant } from './../../../shared/constants/message.constant';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, AfterViewInit } from '@angular/core';
import { BaseComponent } from './../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MessageCallback, ErrorCallback } from './../../base/Callback';
import { DatepickerComponent } from './../../../shared/components/datepicker/datepicker';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAServiceCoverCommenceDateMaintenanceEx.html'
})

export class ServiceCoverCommenceDateMaintenanceExComponent extends BaseComponent implements OnInit, AfterViewInit, MessageCallback, ErrorCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('confirmOkModal') public confirmOkModal;
    @ViewChild('promptModalForSave') public promptModalForSave;
    @ViewChild('CommencePicker') CommencePicker: DatepickerComponent;
    @ViewChild('annivDatePicker') annivDatePicker: DatepickerComponent;

    public dateDisable: boolean;
    public showMessageHeaderSave: boolean = true;
    public showHeader: boolean = true;
    public showPromptCloseButtonSave: boolean = true;
    public promptTitleSave: string = '';
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public promptModalConfigSave = {
        ignoreBackdropClick: true
    };
    public messageContentError: string;
    public messageContentSave: string;
    public showMessageHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public errorMessage: string;
    public isDisabled: boolean = true;
    public pageTitle: string;
    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public statusSearch: URLSearchParams = new URLSearchParams();
    public inputParams: any = {};
    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverCommenceDateMaintenanceEx',
        module: 'service-cover',
        method: 'contract-management/maintenance'
    };
    public commenceDate;
    public anniversaryDate;
    private serviceCoverRowID: any = '';
    public commencedateValidationFlag: number = 0;
    public controls: any[] = [
        { name: 'ContractNumber', required: true },
        { name: 'ContractName', required: false },
        { name: 'Status', required: true, type: MntConst.eTypeText },
        { name: 'PremiseNumber', required: true },
        { name: 'PremiseName', required: false },
        { name: 'ProductCode', required: true },
        { name: 'ProductDesc', required: false },
        { name: 'AccountNumber', required: false },
        { name: 'AccountName', required: false },
        { name: 'ContractAddressLine1', required: false },
        { name: 'ContractAddressLine2', required: false },
        { name: 'ContractAddressLine3', required: false },
        { name: 'ContractAddressLine4', required: false },
        { name: 'ContractAddressLine5', required: false },
        { name: 'ContractPostcode', required: false },
        { name: 'ServiceAnnualValue', required: false, type: MntConst.eTypeCurrency },
        { name: 'ServiceCommenceDate', required: true },
        { name: 'ServiceVisitAnnivDate', required: true }
    ];

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Cover Commence Date Maintenance';
        this.window_onload();
    }
    public window_onload(): void {
        this.riMaintenance.CustomBusinessObjectSelect = false;
        this.riMaintenance.CustomBusinessObjectConfirm = false;
        this.riMaintenance.CustomBusinessObjectInsert = false;
        this.riMaintenance.CustomBusinessObjectUpdate = true;
        this.riMaintenance.CustomBusinessObjectDelete = false;
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionAdd = false;
        this.riMaintenance.FunctionDelete = false;
        if (this.parentMode !== '') {
            this.riMaintenance.FunctionSelect = false;
        }
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.lookupFormData();
        if (this.parentMode !== '') {
            this.serviceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
        }
        this.otherLookupFn();
        this.riMaintenance.FetchRecord();
        this.riMaintenance.FetchRecord();
        if (this.riMaintenance.RecordSelected(false)) {
            this.riMaintenance.UpdateMode();
        }

    }

    public ngAfterViewInit(): void {
        // Set message call back
        this.setMessageCallback(this);

        // Set error message call back
        this.setErrorCallback(this);
    };

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCEEX;
    }

    public commenceDateSelectedValue(value: any): any {
        this.uiForm.controls['ServiceCommenceDate'].setValue('');
        this.commencedateValidationFlag = this.commencedateValidationFlag + 1;
        if (value && value.value) {
            this.uiForm.controls['ServiceCommenceDate'].setValue(value.value);
            if (this.commencedateValidationFlag > 2) {
                this.commencedateValidation(value.value);
            }
        }

    }

    public anniversaryDateSelectedValue(value: any): any {
        this.uiForm.controls['ServiceVisitAnnivDate'].setValue('');
        if (value && value.value) {
            this.uiForm.controls['ServiceVisitAnnivDate'].setValue(value.value);
        }
    }


    public lookupFormData(): any {
        let lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCommenceDate', 'ServiceVisitAnnivDate', 'ServiceAnnualValue']
            },
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName', 'AccountNumber']
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
            }

        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.length > 0) {
                let serviceCoverData = data[0];
                let contractData = data[1];
                let premiseData = data[2];
                let productData = data[3];
                if (serviceCoverData.length > 0) {
                    for (let i = 0; i < serviceCoverData.length; i++) {
                        if (serviceCoverData[i].ttServiceCover === this.serviceCoverRowID) {
                            this.setControlValue('ContractNumber', serviceCoverData[i].ContractNumber);
                            this.setControlValue('PremiseNumber', serviceCoverData[i].PremiseNumber);
                            this.setControlValue('ProductCode', serviceCoverData[i].ProductCode);
                            let getFromDate = this.globalize.parseDateToFixedFormat(serviceCoverData[i].ServiceCommenceDate).toString();
                            this.commenceDate = this.globalize.parseDateStringToDate(getFromDate);
                            let getToDate = this.globalize.parseDateToFixedFormat(serviceCoverData[i].ServiceVisitAnnivDate).toString();
                            this.anniversaryDate = this.globalize.parseDateStringToDate(getToDate);
                            this.setControlValue('ServiceCommenceDate', this.commenceDate);
                            this.setControlValue('ServiceVisitAnnivDate', this.anniversaryDate);
                            this.setControlValue('ServiceAnnualValue', serviceCoverData[i].ServiceAnnualValue);
                        }
                    }
                }
                if (contractData.length > 0) {
                    this.setControlValue('AccountNumber', contractData[0].AccountNumber);
                    this.setControlValue('ContractName', contractData[0].ContractName);
                }
                if (premiseData.length > 0) {
                    this.setControlValue('PremiseName', premiseData[0].PremiseName);
                } if (productData.length > 0) {
                    this.setControlValue('ProductDesc', productData[0].ProductDesc);
                }
            }
        });
    };

    public otherLookupFn(): void {
        let lookupIP = [
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'AccountNumber': this.getControlValue('AccountNumber')
                },
                'fields': ['AccountName', 'AccountAddressLine1', 'AccountAddressLine2', 'AccountAddressLine3', 'AccountAddressLine4', 'AccountAddressLine5', 'AccountPostcode']
            }
        ];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.length > 0) {
                let accountData = data[0];
                if (accountData.length > 0) {
                    this.setControlValue('AccountName', accountData[0].AccountName);
                    this.setControlValue('ContractAddressLine1', accountData[0].AccountAddressLine1);
                    this.setControlValue('ContractAddressLine2', accountData[0].AccountAddressLine2);
                    this.setControlValue('ContractAddressLine3', accountData[0].AccountAddressLine3);
                    this.setControlValue('ContractAddressLine4', accountData[0].AccountAddressLine4);
                    this.setControlValue('ContractAddressLine5', accountData[0].AccountAddressLine5);
                    this.setControlValue('ContractPostcode', accountData[0].AccountPostcode);
                }
                this.getStatus();
            }
        });
    };

    public getStatus(): void {
        this.statusSearch = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.statusSearch.set(this.serviceConstants.Action, '6');
        this.statusSearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.statusSearch.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['Function'] = 'GetStatus';
        formdata['SCRowID'] = this.serviceCoverRowID;
        this.inputParams.selectsearch = this.search;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.statusSearch, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorService.emitError(data);
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Status', data.Status);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
            });
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    }

    public commencedateValidation(event: any): void {
        this.search = this.getURLSearchParamObject();
        let formdata: Object = {};
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        formdata['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
        formdata['Function'] = 'GetAnniversaryDate,WarnCommenceDate';
        formdata['SCRowID'] = this.serviceCoverRowID;
        this.inputParams.selectsearch = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, this.search, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorService.emitError(data);
                } else {
                    //test
                    if (data.hasOwnProperty('ErrorMessage') && (data.ErrorMessage.trim() !== '')) {
                        this.errorModal.show({ msg: data.ErrorMessage.split('|'), title: 'Error' }, false);
                        let dtStr: string = this.getControlValue('ServiceCommenceDate');
                        this.anniversaryDate = new Date(this.utils.convertDate(dtStr));
                        this.setControlValue('ServiceVisitAnnivDate', dtStr);
                    } else {
                        let dtStr: string = this.getControlValue('ServiceCommenceDate');
                        this.anniversaryDate = new Date(this.utils.convertDate(dtStr));
                        this.setControlValue('ServiceVisitAnnivDate', dtStr);
                    }
                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    };
    onSave(): void {
        this.uiForm.controls['ServiceVisitAnnivDate'].markAsTouched();
        this.uiForm.controls['ServiceCommenceDate'].markAsTouched();
        this.CommencePicker.validateDateField();
        this.annivDatePicker.validateDateField();
        if (this.riExchange.validateForm(this.uiForm)) {
            this.otherLookupFn();
            this.promptModalForSave.show();
        }

    }


    public promptContentSaveData(eventObj: any): void {
        let formdata: Object = {};
        let queryPost: URLSearchParams = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '2');
        this.inputParams.module = this.queryParams.module;
        this.inputParams.method = this.queryParams.method;
        this.inputParams.operation = this.queryParams.operation;
        formdata['ServiceCoverROWID'] = this.serviceCoverRowID;
        formdata['ContractNumber'] = this.getControlValue('ContractNumber');
        formdata['PremiseNumber'] = this.getControlValue('PremiseNumber');
        formdata['ProductCode'] = this.getControlValue('ProductCode');
        formdata['ServiceCommenceDate'] = this.getControlValue('ServiceCommenceDate');
        formdata['ServiceVisitAnnivDate'] = this.getControlValue('ServiceVisitAnnivDate');
        formdata['ServiceAnnualValue'] = this.getControlValue('ServiceAnnualValue');
        formdata['Function'] = 'GetStatus';
        formdata['SCRowID'] = this.serviceCoverRowID;
        this.inputParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorService.emitError(data);
                } else {
                    this.confirmOkModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }
    onCancel(): void {
        this.navigate('', '/billtocash/servicecover/acceptGrid');
    }
    public confirmok(): void {
        this.navigate('', '/billtocash/servicecover/acceptGrid');
    }
}
