import * as moment from 'moment';
import { Component, OnInit, Injector, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Observable } from 'rxjs/Rx';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../shared/services/route-away-global.service';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAInvoiceChargeMaintenance.html',
    styles: [`.error-disbaled { border: 1px solid red !important;}`]
})

export class InvoiceChargeMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('promptConfirmModalDelete') public promptConfirmModalDelete;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    // @ViewChild('datepck') public datepck;
    public showMessageHeader: any = true;
    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: false, disabled: true, required: false, type: MntConst.eTypeCodeNumeric },
        { name: 'PremiseName', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'ContractInvoiceChargeNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeAutoNumber },
        { name: 'InvoiceChargeValue', readonly: false, disabled: false, required: true, type: MntConst.eTypeCurrency },
        { name: 'InvoiceChargeDesc', readonly: false, disabled: false, required: true, type: MntConst.eTypeTextFree },
        { name: 'InvoiceChargeType' },
        // { name: 'InvoiceChargeTypeCode' },
        // { name: 'TaxCode' },
        { name: 'TaxCodeType' },
        { name: 'EffectiveDate', required: true }
    ];
    public storeDataTemp: any;
    public TaxCode: any;
    public InvoiceChargeTypeCode: any;
    public chargeTypeList: any;
    public taxCodeList: any;
    public CurrentContractType: string;
    public CurrentContractTypeLabel: string;
    public NumberLab: any;
    public lookUpSubscription: Subscription;
    public crudMode: any;
    public trPremiseNumber: boolean;
    public contractInvoiceChargeROWID: any;
    // public effectiveDate: any;
    public showHeader: boolean = true;
    public isRequesting: boolean = false;
    public noRecordSelected: any;
    public promptConfirmContent: any = MessageConstant.Message.ConfirmRecord;;
    public promptConfirmModalDeleteContent: any = MessageConstant.Message.DeleteRecord;
    public setInvoiceChargeInvalid: boolean;
    public setTaxCodeTypeInvalid: boolean;
    // public dateObjectsValidate: Object = {
    //     effectiveDate: false,
    //     inactiveEffectDate: false
    // };
    // public clearDate: Object = {
    //     effectiveDate: false,
    //     inactiveEffectDate: false
    // };

    public taxCodeInputParams: any = {
        'parentMode': 'LookUp',
        'businessCode': this.utils.getLogInBusinessCode(),
        'countryCode': this.utils.getCountryCode(),
        'action': 0
    };
    public invoiceChargeTypeInputParams: any = {
        'parentMode': 'LookUp',
        'businessCode': this.utils.getLogInBusinessCode(),
        'countryCode': this.utils.getCountryCode(),
        'action': 0
    };

    private queryParams: any = {
        operation: 'Application/iCABSAInvoiceChargeMaintenance',
        module: 'invoicing',
        method: 'bill-to-cash/maintenance'
    };

    constructor(injector: Injector,
        private _router: Router, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICECHARGEMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        let strDocTitle = 'Invoice Charge Maintenance';
        this.getTranslatedValue(strDocTitle, null).subscribe((res: string) => {
            if (res) { strDocTitle = res; }
            this.utils.setTitle(strDocTitle);
        });
        this.window_onload();
    }

    private window_onload(): void {
        if (this.formData['ContractNumber']) {
            this.populateUIFromFormData();
        }

        this.noRecordSelected = 'No record is selected.';
        this.getTranslatedValue(this.noRecordSelected, null).subscribe((res: string) => {
            if (res) { this.noRecordSelected = res; }
        });

        let businessCode = this.utils.getBusinessCode(),
            countryCode = this.utils.getCountryCode();
        this.parentMode = this.riExchange.routerParams['parentMode'];
        this.CurrentContractType = this.utils.getCurrentContractType(this.riExchange.routerParams['CurrentContractTypeURLParameter']);
        this.setControlValue('ContractInvoiceChargeNumber', this.riExchange.routerParams['ContractInvoiceChargeNumber']);
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.CurrentContractType);
        this.NumberLab = this.CurrentContractTypeLabel + 'Number';
        this.trPremiseNumber = false;

        switch (this.parentMode) {
            case 'Contract':
            case 'Contract-Add':
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                break;
            case 'Premise':
            case 'Premise-Add':
                this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.trPremiseNumber = true;
                break;
        }


        if (this.parentMode === 'Contract' || this.parentMode === 'Premise') {
            setTimeout(() => {
                this.setFormMode(this.c_s_MODE_UPDATE);
            }, 200);
            this.contractInvoiceChargeROWID = this.riExchange.routerParams['ContractInvoiceCharge'];
            this.callContractInvoiceChargeNumberLookupData();
        }

        switch (this.parentMode) {
            case 'Contract':
                this.callContractNumberLookupData();

                break;
            case 'Premise':
                this.callContractNumberLookupData();
                this.callPremiseNumberLookupData();
                break;
        }

        //  If riMaintenance.RecordSelected(false) Then
        //    Call riMaintenance.FetchRecord()
        //  End If

        if (this.parentMode === 'Contract-Add' || this.parentMode === 'Premise-Add') {
            // this.fetchDefaultInvoiceChargeValue();
            setTimeout(() => {
                this.setFormMode(this.c_s_MODE_ADD);
            }, 200);
            this.crudMode = 'ADD';
            this.callSystemInvoiceChargeTypeLangLookupData();
            this.callTaxCodeLookupData();
        } else {
            this.crudMode = 'UPDATE/DELETE';
        }
        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);

    }

    /*Get formData from LookUp API Call*/
    private callContractInvoiceChargeNumberLookupData(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'ContractInvoiceCharge',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractInvoiceChargeROWID': this.contractInvoiceChargeROWID,
                    'ContractInvoiceChargeNumber': this.getControlValue('ContractInvoiceChargeNumber')
                },
                'fields': ['InvoiceChargeTypeCode', 'InvoiceChargeValue', 'InvoiceChargeDesc', 'TaxCode', 'ChargeEffectDate']
            }
        ];

        switch (this.parentMode) {
            case 'Contract':
            case 'Contract-Add':
                lookupIP[0]['query']['ContractNumber'] = this.getControlValue('ContractNumber');
                break;
            case 'Premise':
            case 'Premise-Add':
                lookupIP[0]['query']['ContractNumber'] = this.getControlValue('ContractNumber');
                lookupIP[0]['query']['PremiseNumber'] = this.getControlValue('PremiseNumber');
                break;
        }

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0][0]) {
                this.InvoiceChargeTypeCode = data[0][0].InvoiceChargeTypeCode;
                this.TaxCode = data[0][0].TaxCode;
                this.setControlValue('InvoiceChargeValue', data[0][0].InvoiceChargeValue);
                this.setControlValue('InvoiceChargeDesc', data[0][0].InvoiceChargeDesc);
                if (moment(data[0][0].ChargeEffectDate, 'DD/MM/YYYY', true).isValid()) {
                    this.setControlValue('EffectiveDate', data[0][0].ChargeEffectDate);
                } else {
                    this.setControlValue('EffectiveDate', this.utils.formatDate(data[0][0].ChargeEffectDate));
                }
                this.callSystemInvoiceChargeTypeLangLookupData();
                this.callTaxCodeLookupData();
                this.setValuesInstoreDataTemp();
            } else {
                this.InvoiceChargeTypeCode = '';
                this.setControlValue('InvoiceChargeValue', '');
                this.setControlValue('InvoiceChargeDesc', '');
                this.TaxCode = '';
                this.setControlValue('ChargeEffectDate', '');
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    private callContractNumberLookupData(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractNumber', 'ContractName']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0][0] && data[0][0].ContractName) {
                this.setControlValue('ContractName', data[0][0].ContractName);
            } else {
                this.setControlValue('ContractName', '');
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    private callPremiseNumberLookupData(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseNumber', 'PremiseName']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0][0] && data[0][0].PremiseName) {
                this.setControlValue('PremiseName', data[0][0].PremiseName);
            } else {
                this.setControlValue('PremiseName', '');
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    private callSystemInvoiceChargeTypeLangLookupData(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'SystemInvoiceChargeTypeLang',
                'query': {
                    // 'InvoiceChargeTypeCode': this.InvoiceChargeTypeCode,
                    'LanguageCode': this.riExchange.LanguageCode()
                },
                'fields': ['InvoiceChargeTypeCode', 'LanguageCode', 'InvoiceChargeLocalDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data) {
                this.chargeTypeList = data[0].slice(0, 5);
                if (this.parentMode === 'Contract-Add' || this.parentMode === 'Premise-Add') {
                    // this.setControlValue('InvoiceChargeType', this.chargeTypeList[0]);
                    //this.selectedChargeType('val');
                }
                for (let i in this.chargeTypeList) {
                    if (this.chargeTypeList[i]['InvoiceChargeTypeCode'] === this.InvoiceChargeTypeCode) {
                        this.setControlValue('InvoiceChargeType', this.chargeTypeList[i]);
                    }
                }
                this.setValuesInstoreDataTemp();
                // this.setControlValue('InvoiceChargeLocalDesc', data[0][0].InvoiceChargeLocalDesc);
            } else {
                // this.setControlValue('InvoiceChargeLocalDesc', '');
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    private callTaxCodeLookupData(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'TaxCode',
                'query': {
                    // 'TaxCode': this.getControlValue('TaxCode')
                },
                'fields': ['TaxCode', 'TaxCodeDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data) {
                this.taxCodeList = data[0];
                if (this.parentMode === 'Contract-Add' || this.parentMode === 'Premise-Add') {
                    // this.setControlValue('TaxCodeType', this.taxCodeList[0]);
                    // this.TaxCode = this.getControlValue('TaxCodeType').TaxCode;
                }
                for (let i in this.taxCodeList) {
                    if (this.taxCodeList[i]['TaxCode'] === this.TaxCode) {
                        this.setControlValue('TaxCodeType', this.taxCodeList[i]);
                    }
                }
                this.setValuesInstoreDataTemp();
                //  this.setControlValue('TaxCodeDesc', data[0][0].TaxCodeDesc);
            } else {
                // this.setControlValue('TaxCodeDesc', '');
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    public riMaintenance_Search(): void {

        //   WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAInvoiceChargeSearch.htm<maxwidth>" + CurrentContractTypeURLParameter
        switch (this.parentMode) {
            case 'Contract':
            case 'Contract-Add':
                this.navigate('Contract-Search', 'Application/iCABSAInvoiceChargeSearch.htm', {
                    CurrentContractTypeURLParameter: this.CurrentContractType
                });
                break;
            default:
                this.navigate('Premise-Search', 'Application/iCABSAInvoiceChargeSearch.htm', {
                    CurrentContractTypeURLParameter: this.CurrentContractType
                });
                break;
        }
    }

    public selectedChargeType(val: any): void {
        this.InvoiceChargeTypeCode = this.getControlValue('InvoiceChargeType').InvoiceChargeTypeCode;
        this.setInvoiceChargeInvalid = false;
        // this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', false);
        // this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', false);
        // if (this.parentMode === 'Contract-Add' || this.parentMode === 'Premise-Add') {
        this.fetchDefaultInvoiceChargeValue();
        // }
    }

    public selectedTaxCode(val: any): void {
        this.TaxCode = this.getControlValue('TaxCodeType').TaxCode;
        this.setTaxCodeTypeInvalid = false;
    }

    public InvoiceChargeTypeCode_onkeydown(): void {

        //   If window.event.keyCode = 34 Then
        //     riExchange.Mode = "LookUp"
        //     window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBInvoiceChargeTypeLanguageSearch.htm"

        //   End If

    }


    public TaxCode_onkeydown(): void {

        //   If window.event.keyCode = 34 Then
        //     riExchange.Mode = "LookUp"
        //     window.location = "/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSTaxCodeSearch.htm"

        //   End If

    }


    public riExchange_CBORequest(): void {
        //   If riExchange.HasChanged("InvoiceChargeTypeCode") Then

        //     riMaintenance.CustomBusinessObjectAdditionalPostData = "Function=GetDefaultChargeValue"

        //     Call riMaintenance.CBORequestAddCS("BusinessCode",eTypeCode)
        //     Call riMaintenance.CBORequestAdd("InvoiceChargeTypeCode")

        //     Call riMaintenance.CBORequestExecute()

        //   End If

    }

    public effectiveDateSelectedValue(value: any): void {
        if (value && value['value']) {
            this.setControlValue('EffectiveDate', value.value);
        } else {
            this.setControlValue('EffectiveDate', '');
        }
    }


    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private isValidationCheck(): any {
        if (!this.getControlValue('InvoiceChargeType') || this.getControlValue('InvoiceChargeType') === '' || !this.getControlValue('InvoiceChargeValue') || this.getControlValue('InvoiceChargeValue') === '' || !this.getControlValue('InvoiceChargeDesc') || this.getControlValue('InvoiceChargeDesc') === '' || !this.getControlValue('TaxCodeType') || this.getControlValue('TaxCodeType') === '') {
            if (!this.getControlValue('InvoiceChargeType') || this.getControlValue('InvoiceChargeType') === '') {
                this.setInvoiceChargeInvalid = true;
                // this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeType', true);
                // this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeType', true);
            }
            if (!this.getControlValue('InvoiceChargeValue') || this.getControlValue('InvoiceChargeValue') === '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', true);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', true);
            }
            if (!this.getControlValue('InvoiceChargeDesc') || this.getControlValue('InvoiceChargeDesc') === '') {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeDesc', true);
                this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeDesc', true);
            }
            if (!this.getControlValue('TaxCodeType') || this.getControlValue('TaxCodeType') === '') {
                this.setTaxCodeTypeInvalid = true;
                // this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'TaxCodeType', true);
                // this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'TaxCodeType', true);
            }
            return false;
        } else {
            return true;
        }


    }

    public invoiceChargeDescChange(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeDesc', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeDesc', false);
    }

    public invoiceChargeValueChange(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', true);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', false);
    }

    public saveClicked(): void {
        this.isValidationCheck();
        // this.datepck.validateDateField();
        if (this.riExchange.validateForm(this.uiForm) && this.setInvoiceChargeInvalid !== true && this.setTaxCodeTypeInvalid !== true) {
            if (!this.contractInvoiceChargeROWID && this.crudMode === 'UPDATE/DELETE') {
                this.errorModal.show({ msg: this.noRecordSelected, title: '' }, false);
            } else {
                this.promptConfirmModal.show();
            }
        }
    }

    public deleteClicked(): void {
        if (!this.contractInvoiceChargeROWID && this.crudMode === 'UPDATE/DELETE') {
            this.errorModal.show({ msg: this.noRecordSelected, title: '' }, false);
        } else {
            this.promptConfirmModalDelete.show();
        }
    }

    public addClicked(): void {
        this.crudMode = 'ADD';
        this.clearFields();
        // this.setControlValue('ContractInvoiceChargeNumber', '');
    }

    public cancelClicked(): void {
        if (this.crudMode === 'ADD') {
            this.clearFields();
            // this.crudMode = 'UPDATE/DELETE';
            setTimeout(() => {
                this.setFormMode(this.c_s_MODE_UPDATE);
            }, 200);
            // this.restoreFieldsOnCancel();
            //clear fields or navigate
        } else {
            this.restoreFieldsOnCancel();
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', false);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeDesc', true);
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeDesc', false);
            //show old values
        }
    }

    private clearFields(): void {
        //clear fields
        // this.datepck.resetDateField();
        this.setControlValue('InvoiceChargeType', '');
        this.setControlValue('TaxCodeType', '');
        this.setControlValue('InvoiceChargeDesc', '');
        this.setControlValue('InvoiceChargeValue', '');
        this.setControlValue('EffectiveDate', '');
        // this.effectiveDate = null;
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', false);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeDesc', false);
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeDesc', false);
        // this.setControlValue('ContractInvoiceChargeNumber', '');
        // setTimeout(() => {


        //     this.effectiveDate = void 0;
        // }, 200);
        this.TaxCode = '';
        this.InvoiceChargeTypeCode = '';
        this.setControlValue('InvoiceChargeType', '');
        // this.selectedChargeType('val');
        this.setControlValue('TaxCodeType', '');
        // this.TaxCode = this.getControlValue('TaxCodeType').TaxCode;
        this.setInvoiceChargeInvalid = false;
        this.setTaxCodeTypeInvalid = false;
    }

    //@TODO - mandatory field checking, error modal popup

    /***After confirmation service call to addnew/update/delete  */
    public promptConfirm(type: any): void {
        switch (this.crudMode) {
            case 'UPDATE/DELETE':
                if (type === 'update') {
                    this.updateRecord();
                } else {
                    this.deleteRecord();
                }
                break;
            case 'ADD':
                this.saveNewRecord();
                break;
        }
    }

    private saveNewRecord(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '1');
        let postParams: any = {};
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        postParams.ContractInvoiceChargeNumber = '';
        postParams.InvoiceChargeTypeCode = this.InvoiceChargeTypeCode;
        postParams.InvoiceChargeValue = this.globalize.parseCurrencyToFixedFormat(this.getControlValue('InvoiceChargeValue')).toString();
        postParams.InvoiceChargeDesc = this.getControlValue('InvoiceChargeDesc');
        postParams.TaxCode = this.TaxCode;
        postParams.ChargeEffectDate = this.globalize.parseDateToFixedFormat(this.getControlValue('EffectiveDate')).toString();
        postParams.Function = 'GetDefaultChargeValue';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                    } else {
                        this.errorModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                        this.contractInvoiceChargeROWID = e.ContractInvoiceCharge;
                        this.setControlValue('ContractInvoiceChargeNumber', e.ContractInvoiceChargeNumber);
                        this.crudMode = 'UPDATE/DELETE';
                        setTimeout(() => {
                            this.setFormMode(this.c_s_MODE_UPDATE);
                        }, 200);
                        this.setValuesInstoreDataTemp();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    private updateRecord(): void {

        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        let postParams: any = {};
        postParams.ContractInvoiceChargeROWID = this.contractInvoiceChargeROWID;
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        postParams.ContractInvoiceChargeNumber = this.getControlValue('ContractInvoiceChargeNumber');
        postParams.InvoiceChargeTypeCode = this.InvoiceChargeTypeCode;
        postParams.InvoiceChargeValue = this.globalize.parseCurrencyToFixedFormat(this.getControlValue('InvoiceChargeValue')).toString();
        postParams.InvoiceChargeDesc = this.getControlValue('InvoiceChargeDesc');
        postParams.TaxCode = this.TaxCode;
        postParams.ChargeEffectDate = this.globalize.parseDateToFixedFormat(this.getControlValue('EffectiveDate')).toString();
        postParams.Function = 'GetDefaultChargeValue';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                    } else {
                        this.errorModal.show({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: '' }, false);
                        this.setValuesInstoreDataTemp();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private deleteRecord(): void {

        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '3');
        let postParams: any = {};
        postParams.ContractInvoiceChargeROWID = this.contractInvoiceChargeROWID;
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        postParams.ContractInvoiceChargeNumber = this.getControlValue('ContractInvoiceChargeNumber');
        postParams.Function = 'GetDefaultChargeValue';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                    } else {
                        this.errorModal.show({ msg: MessageConstant.Message.RecordDeletedSuccessfully, title: '' }, false);
                        this.crudMode = 'ADD';
                        this.clearFields();
                        this.contractInvoiceChargeROWID = null;
                        // this.storeDataTemp = {};

                        //navigate or clear fields
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private fetchDefaultInvoiceChargeValue(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.InvoiceChargeTypeCode = this.InvoiceChargeTypeCode;
        postParams.Function = 'GetDefaultChargeValue';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                    } else {
                        this.setControlValue('InvoiceChargeValue', e.InvoiceChargeValue);
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InvoiceChargeValue', false);
                        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'InvoiceChargeValue', false);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private setValuesInstoreDataTemp(): void {

        this.storeDataTemp = this.uiForm.getRawValue();
        this.storeDataTemp['TaxCode'] = this.TaxCode;
        this.storeDataTemp['InvoiceChargeTypeCode'] = this.InvoiceChargeTypeCode;
        this.storeDataTemp['ContractInvoiceChargeROWID'] = this.contractInvoiceChargeROWID;
    }

    private restoreFieldsOnCancel(): void {
        for (let key in this.uiForm.controls) {
            if (key && this.uiForm.controls.hasOwnProperty(key)) {
                this.uiForm.controls[key].markAsPristine();
                this.setControlValue(key, this.storeDataTemp[key]);
            }
        }
        this.TaxCode = this.storeDataTemp['TaxCode'];
        this.InvoiceChargeTypeCode = this.storeDataTemp['InvoiceChargeTypeCode'];
        this.contractInvoiceChargeROWID = this.storeDataTemp['ContractInvoiceChargeROWID'];
        // this.effectiveDate = new Date(this.utils.convertDate(this.getControlValue('EffectiveDate')));
    }

    /*Alerts user when user is moving away without saving the changes. //CR implementation*/
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }
    //@TODO - Validate fields and empty date funnction
}
