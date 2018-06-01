
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Injector, transition } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Route, Params } from '@angular/router';
import { Http, URLSearchParams } from '@angular/http';

import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { BaseComponent } from './../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageCallback, ErrorCallback } from './../../base/Callback';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { BCompanySearchComponent } from './../../internal/search/iCABSBCompanySearch';
import { BranchSearchComponent } from './../../internal/search/iCABSBBranchSearch';
import { TaxCodeSearchComponent } from './../../internal/search/iCABSSTaxCodeSearch.component';
import { ContractTypeLanguageSearchComponent } from './../../internal/search/iCABSBContractTypeLanguageSearch.component';

@Component({
    templateUrl: 'iCABSBInvoiceRangeMaintenance.html'
})

export class InvoiceRangeMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, MessageCallback, ErrorCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModalForSave') public promptModalForSave;
    @ViewChild('promptModalDelete') public promptModalDelete;
    @ViewChild('InvoiceCreditSelectDropdown') InvoiceCreditSelectDropdown: DropdownStaticComponent;
    @ViewChild('contractTypeCodeDropDown') public contractTypeCodeDropDown: ContractTypeLanguageSearchComponent;
    @ViewChild('bCompanySearchComponent') bCompanySearchComponent: BCompanySearchComponent;
    @ViewChild('BranchNumberDropdown') BranchNumberDropdown: DropdownStaticComponent;
    @ViewChild('TaxCodeEllipsis') TaxCodeEllipsis: EllipsisComponent;
    @ViewChild('screenNotReadyEllipsis') screenNotReadyEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public pageId: string = '';
    public isHideDeleteButton: boolean = true;
    public isHiddenTaxRange: boolean = false;
    public pageTitle: string = '';
    public errorMessage: string = '';
    public BranchSearch: any;
    public brunchNumber: string = '';
    public branchname: string = '';
    public companyNumber: string = '';
    public taxCode: string = '';
    public contractCode: string = '';
    public inputParams: any = {};
    public contractTypeinputParams: any = {};
    public inputParamsBranch: any = {};
    public uiForm: FormGroup;
    public inputParamsCompanySearch: any = {};
    public search: URLSearchParams = new URLSearchParams();
    public promptTitleSave: string = '';
    public promptTitleDelete: string = '';
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public promptContentDelete: string = MessageConstant.Message.DeleteRecord;
    public taxCodeSearchComponent = TaxCodeSearchComponent;
    public screenNotReadyComponent = ScreenNotReadyComponent;
    public isVSCEnableTaxInvoiceRange: boolean = false;

    public isRequesting: boolean = false;
    public cancelholdingData: any = {};
    public promptModalConfigSave: Object = {
        ignoreBackdropClick: true
    };
    public promptModalConfigDelete: Object = {
        ignoreBackdropClick: true
    };
    public companyDefault: Object = {
        id: '',
        text: ''
    };

    public negBranchNumberSelected: Object = {
        id: '',
        text: ''
    };

    public InvoiceCreditSelectList: Object = [
        { text: '', value: '' },
        { text: 'Invoice', value: 'I' },
        { text: 'Credit', value: 'C' }
    ];

    public queryParams: any = {
        module: 'invoicing',
        operation: 'Business/iCABSBInvoiceRangeMaintenance',
        method: 'bill-to-cash/admin'
    };

    public dropdown: any = {
        contractTypeCode: {
            isDisabled: false,
            isRequired: false,
            triggerValidate: true,
            inputParams: {
                parentMode: 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        }
    };

    public controls = [
        { name: 'InvoiceRangeNumber', disabled: true, required: false },
        { name: 'ActiveRangeInd', disabled: false, required: false },
        { name: 'InvoiceRangeDesc', disabled: false, required: false },
        { name: 'CompanyCode', disabled: false, required: false },
        { name: 'CompanyDesc', disabled: false, required: false },
        { name: 'BranchNumber', disabled: false, required: false },
        { name: 'BranchName', disabled: false, required: false },
        { name: 'TaxCode', disabled: false, required: false },
        { name: 'TaxCodeDesc', disabled: true, required: false },
        { name: 'InvoiceCreditSelect', disabled: false, required: false },
        { name: 'InvoiceCreditCode', disabled: false, required: false },
        { name: 'ContractTypeCode', disabled: false, required: false },
        { name: 'TransContractTypeDesc', disabled: true, required: false },
        { name: 'InvoiceRangePrefix', disabled: false, required: false },
        { name: 'InvoiceRangeSuffix', disabled: false, required: false },
        { name: 'MinimumInvoiceNumber', disabled: false, required: true },
        { name: 'MaximumInvoiceNumber', disabled: false, required: false },
        { name: 'NextInvoiceNumber', disabled: false, required: false },
        { name: 'RowID', disabled: false, required: false },
        { name: 'TaxRange', disabled: false, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBINVOICERANGEMAINTENANCE;
        this.inputParamsCompanySearch[this.serviceConstants.CountryCode] = this.countryCode();
        this.inputParamsCompanySearch[this.serviceConstants.BusinessCode] = this.businessCode();
        this.inputParamsCompanySearch['parentMode'] = 'LookUp';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = this.browserTitle = 'Invoice Range Maintenance';
        switch (this.parentMode) {
            case 'InvoiceRangeAdd':
                this.disableControl('NextInvoiceNumber', true);
                this.setControlValue('ActiveRangeInd', true);
                this.isHideDeleteButton = false;
                break;
            case 'InvoiceRangeUpdate':
                this.setControlValue('ActiveRangeInd', true);
                this.setControlValue('RowID', this.riExchange.getParentHTMLValue('RowID'));
                this.setControlValue('InvoiceRangeNumber', this.riExchange.getParentHTMLValue('InvoiceRangeNumber'));
                break;
            default:
                break;
        }
        this.getSysCharDtetails();
    }

    ngAfterViewInit(): void {
        // Set message call back
        this.setMessageCallback(this);
        // Set error message call back
        this.setErrorCallback(this);
        this.uiForm.controls['MaximumInvoiceNumber'].setValidators([this.validateRange, Validators.pattern('^[0-9]*$')]);
        this.uiForm.controls['MinimumInvoiceNumber'].setValidators([this.validateRange, Validators.required, Validators.pattern('^[0-9]*$')]);
        this.uiForm.controls['NextInvoiceNumber'].setValidators([this.validateRange, Validators.pattern('^[0-9]*$')]);
    };

    public validateRange(control: any): any {
        if (control.value < 0 || control.value > 2147483647) {
            return { 'invalidValue': true };
        }
        return null;
    }

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableTaxInvoiceRanges];
        let sysCharIP: Object = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record: any = data.records;
            this.isVSCEnableTaxInvoiceRange = record[0]['Required'];
            if (this.isVSCEnableTaxInvoiceRange) {
                this.isHiddenTaxRange = true;
            }
            if (this.parentMode === 'InvoiceRangeUpdate') {
                this.windowOnload();
            }

        });
    }

    public windowOnload(): void {
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ROWID', this.getControlValue('RowID'));
        this.search.set('InvoiceRangeNumber', this.getControlValue('InvoiceRangeNumber'));
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.search)
            .subscribe(
            (data) => {
                this.cancelholdingData = data;
                if (data.hasError) {
                    if (this.parentMode === 'InvoiceRangeUpdate') {
                        this.messageModal.show(data, true);
                    }
                } else {
                    this.setFormData(data);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public setFormData(data: any): void {
        this.setControlValue('InvoiceRangeNumber', data.InvoiceRangeNumber);
        this.setControlValue('ActiveRangeInd', data.ActiveRangeInd ? true : false);
        this.setControlValue('InvoiceRangeDesc', data.InvoiceRangeDesc);
        this.companyNumber = data.CompanyCode ? data.CompanyCode : '';
        this.lookupCompanyName();
        this.brunchNumber = data.BranchNumber ? data.BranchNumber : '';
        this.lookupBranchName();
        this.InvoiceCreditSelectDropdown.selectedItem = data.InvoiceCreditCode;
        this.taxCode = data.TaxCode ? data.TaxCode : '';
        this.lookupvatCodeName();
        this.setControlValue('InvoiceRangePrefix', data.InvoiceRangePrefix);
        this.contractCode = data.ContractTypeCode ? data.ContractTypeCode : '';
        this.dropdown.contractTypeCode.active = {
            id: this.contractCode,
            text: ''
        };
        this.lookupcontractCodeName();
        this.setControlValue('InvoiceRangeSuffix', data.InvoiceRangeSuffix);
        this.setControlValue('MinimumInvoiceNumber', data.MinimumInvoiceNumber);
        this.setControlValue('MaximumInvoiceNumber', data.MaximumInvoiceNumber);
        this.setControlValue('NextInvoiceNumber', data.NextInvoiceNumber);
        this.setControlValue('TaxRange', data.TaxRange ? true : false);
        this.setControlValue('InvoiceCreditSelect', '');
        this.setControlValue('RowID', data.ttInvoiceRange);
    }

    public numberOf(data: any): void {
        if (!(isNaN(data.target.value)) && data.target.value) {
            this.setControlValue(data.target.id, Number(data.target.value));
        }
    }

    /*# Get and Set Branch Name #*/
    public lookupBranchName(): any {
        let lookupIP: any = [
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode,
                    'BranchNumber': this.brunchNumber
                },
                'fields': ['BranchName']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Branch = data[0][0];
            if (Branch) {
                this.negBranchNumberSelected = {
                    id: this.brunchNumber,
                    text: this.brunchNumber + ' - ' + Branch.BranchName
                };
                this.setControlValue('BranchNumber', this.brunchNumber);
                this.setControlValue('BranchName', Branch.BranchName);
            }
        });
    }

    /*# Get and Set Comany Name #*/
    public lookupCompanyName(): any {
        let lookupIP = [
            {
                'table': 'Company',
                'query': {
                    'BusinessCode': this.businessCode,
                    'CompanyCode': this.companyNumber
                },
                'fields': ['CompanyDesc']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let compData = data[0][0];
            if (compData) {
                this.companyDefault = {
                    id: this.companyNumber,
                    text: this.companyNumber + ' - ' + compData.CompanyDesc
                };
                this.setControlValue('CompanyCode', this.companyNumber);
                this.setControlValue('CompanyDesc', compData.CompanyDesc);

            }
        });
    }

    /*# Get and Set VAT Name #*/
    public lookupvatCodeName(): any {
        let lookupIP = [
            {
                'table': 'TaxCode',
                'query': {
                    'TaxCode': this.taxCode
                },
                'fields': ['TaxCodeDesc']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let taxData = data[0][0];
            if (taxData) {
                this.setControlValue('TaxCode', this.taxCode);
                this.setControlValue('TaxCodeDesc', taxData.TaxCodeDesc);
            }
        });
    }

    /*# Get and Set Contract Name #*/
    public lookupcontractCodeName(): any {
        let lookupIP: any = [
            {
                'table': 'ContractTypeLang',
                'query': {
                    'BusinessCode': this.businessCode,
                    'ContractTypeCode': this.contractCode,
                    'LanguageCode': this.riExchange.LanguageCode()

                },
                'fields': ['ContractTypeDesc']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let contractData = data[0];
            if (contractData && contractData.length > 0 && contractData[0]) {
                this.setControlValue('ContractTypeCode', this.contractCode);
                this.setControlValue('TransContractTypeDesc', contractData[0].ContractTypeDesc);
                this.dropdown.contractTypeCode.active = {
                    id: this.contractCode,
                    text: this.contractCode + ' - ' + contractData[0].ContractTypeDesc
                };
            }
        });
    }

    /*Tap out Taxcode*/
    public OntaxCodetapout(data: any): void {
        this.taxCode = data.target.value;
        this.lookupvatCodeName();
        this.uiForm.controls['TaxCode'].markAsDirty();
    }

    /*Tap out ContractType*/
    public OncontractTypetapout(data: any): void {
        this.contractCode = data.target.value;
        this.lookupcontractCodeName();
        this.uiForm.controls['ContractTypeCode'].markAsDirty();
    }

    public companySearchdataReceived(eventObj: any): void {
        this.setControlValue('CompanyCode', eventObj.CompanyCode);
        this.setControlValue('CompanyDesc', eventObj.CompanyDesc);
        this.uiForm.controls['CompanyCode'].markAsDirty();
    }

    public onBranchDataReceived(obj: any): void {
        if (obj && obj.BranchNumber !== null && obj.BranchNumber !== undefined) {
            let branchname = (obj.hasOwnProperty('BranchName') ? obj.BranchName : obj.Object.BranchName);
            if (obj.BranchNumber !== '')
                this.negBranchNumberSelected = { text: obj.BranchNumber + ' - ' + branchname };
            this.setControlValue('BranchNumber', obj.BranchNumber);
            this.setControlValue('BranchName', branchname);
            this.uiForm.controls['BranchNumber'].markAsDirty();
        }
    }

    public onTaxCodeDataReceived(data: any): void {
        this.setControlValue('TaxCode', data.TaxCode);
        this.setControlValue('TaxCodeDesc', data.TaxCodeDesc);
        this.disableControl('TaxCodeDesc', true);
        this.uiForm.controls['TaxCode'].markAsDirty();
    }

    public onContractTypeReceived(data: any): void {
        this.setControlValue('ContractTypeCode', data['ContractTypeLang.ContractTypeCode'] || '');
        this.setControlValue('TransContractTypeDesc', data['ContractTypeLang.ContractTypeDesc'] || '');
        this.uiForm.controls['ContractTypeCode'].markAsDirty();
    }

    public CreditSelectListchange(data: any): void {
        this.uiForm.controls['InvoiceCreditSelect'].markAsDirty();
    }

    //save prompt
    public saveInvoiceRangemaintenance(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            if ((!this.getControlValue('ContractTypeCode'))) {
                this.setControlValue('TransContractTypeDesc', '');
            }
            if ((!this.getControlValue('TaxCode'))) {
                this.setControlValue('TaxCodeDesc', '');
            }
            this.promptModalForSave.show();
        } else {
            if ((this.uiForm.controls['ContractTypeCode'].invalid)) {
                this.setControlValue('TransContractTypeDesc', '');
            }
            if ((this.uiForm.controls['TaxCode'].invalid)) {
                this.setControlValue('TaxCodeDesc', '');
            }
        }
    }

    //Cancel
    public resetForm(): void {
        this.uiForm.reset();
        this.companyDefault = {
            text: ''
        };
        this.negBranchNumberSelected = {
            text: ''
        };
        if (this.parentMode === 'InvoiceRangeUpdate') {
            this.setFormData(this.cancelholdingData);
        }
        if (this.parentMode === 'InvoiceRangeAdd') {
            this.InvoiceCreditSelectDropdown.selectedItem = '';
            this.navigate('InvoiceRangeAdd', InternalGridSearchSalesModuleRoutes.ICABSBINVOICERANGEUPDATEGRID);
        }
        this.uiForm.controls['ContractTypeCode'].markAsPristine();
        this.uiForm.controls['TaxCode'].markAsPristine();
        this.uiForm.controls['BranchNumber'].markAsPristine();
        this.uiForm.controls['CompanyCode'].markAsPristine();
        this.uiForm.controls['InvoiceCreditSelect'].markAsPristine();
    }
    //Delete
    public deleteInvoiceRangemaintenance(): void {
        this.promptModalDelete.show();
    }

    // Implementation of save logic
    public promptContentSaveData(eventObj: any): void {
        if (this.parentMode === 'InvoiceRangeUpdate') {
            this.updateModeSaveData(eventObj);
        } else if (this.parentMode === 'InvoiceRangeAdd') {
            this.addModeSaveData(eventObj);
        }
    }

    public updateModeSaveData(data: any): void {
        let queryPost: URLSearchParams = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '2');
        let formdata: Object = {};
        formdata['RowID'] = this.getControlValue('RowID');
        formdata['ActiveRangeInd'] = (this.getControlValue('ActiveRangeInd') ? true : false);
        formdata['InvoiceRangeDesc'] = (this.getControlValue('InvoiceRangeDesc')) ? this.getControlValue('InvoiceRangeDesc') : '';
        formdata['CompanyCode'] = (this.getControlValue('CompanyCode')) ? this.getControlValue('CompanyCode') : '~~IGNORE~~';
        formdata['BranchNumber'] = (this.getControlValue('BranchNumber')) ? this.getControlValue('BranchNumber') : '~~IGNORE~~';
        formdata['TaxCode'] = (this.getControlValue('TaxCode')) ? this.getControlValue('TaxCode') : '~~IGNORE~~';
        formdata['InvoiceCreditCode'] = (this.InvoiceCreditSelectDropdown.selectedItem) ? this.InvoiceCreditSelectDropdown.selectedItem : '';
        formdata['ContractTypeCode'] = (this.getControlValue('ContractTypeCode')) ? this.getControlValue('ContractTypeCode') : '~~IGNORE~~';
        formdata['InvoiceRangePrefix'] = (this.getControlValue('InvoiceRangePrefix')) ? this.getControlValue('InvoiceRangePrefix') : '';
        formdata['InvoiceRangeSuffix'] = (this.getControlValue('InvoiceRangeSuffix')) ? this.getControlValue('InvoiceRangeSuffix') : '';
        formdata['MinimumInvoiceNumber'] = (this.getControlValue('MinimumInvoiceNumber'));
        let maxInvoiceNumber = this.getControlValue('MaximumInvoiceNumber');
        formdata['MaximumInvoiceNumber'] = (maxInvoiceNumber) ? (maxInvoiceNumber) : (maxInvoiceNumber === 0) ? 0 : '';
        let nextInvoiceNumber = this.getControlValue('NextInvoiceNumber');
        formdata['NextInvoiceNumber'] = (nextInvoiceNumber) ? (nextInvoiceNumber) : (nextInvoiceNumber === 0) ? 0 : '';
        formdata['TaxRange'] = (this.getControlValue('TaxRange') ? true : false);
        this.queryParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.messageModal.show(data, true);
                } else {
                    this.navigate('InvoiceRangeUpdate', InternalGridSearchSalesModuleRoutes.ICABSBINVOICERANGEUPDATEGRID);
                    this.formPristine();
                    this.uiForm.controls['ContractTypeCode'].markAsPristine();
                    this.uiForm.controls['TaxCode'].markAsPristine();
                    this.uiForm.controls['BranchNumber'].markAsPristine();
                    this.uiForm.controls['CompanyCode'].markAsPristine();
                    this.uiForm.controls['InvoiceCreditSelect'].markAsPristine();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public addModeSaveData(data: any): void {
        let queryPost: URLSearchParams = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '1');
        let formdata: Object = {};
        formdata['InvoiceRangeNumber'] = this.getControlValue('InvoiceRangeNumber') ? this.getControlValue('InvoiceRangeNumber') : '';
        formdata['ActiveRangeInd'] = this.getControlValue('ActiveRangeInd') ? true : false;
        formdata['InvoiceRangeDesc'] = this.getControlValue('InvoiceRangeDesc') ? this.getControlValue('InvoiceRangeDesc') : '';
        formdata['CompanyCode'] = this.getControlValue('CompanyCode') ? this.getControlValue('CompanyCode') : '~~IGNORE~~';
        formdata['BranchNumber'] = this.getControlValue('BranchNumber') ? this.getControlValue('BranchNumber') : '~~IGNORE~~';
        formdata['TaxCode'] = this.getControlValue('TaxCode') ? this.getControlValue('TaxCode') : '~~IGNORE~~';
        formdata['InvoiceCreditCode'] = this.InvoiceCreditSelectDropdown.selectedItem ? this.InvoiceCreditSelectDropdown.selectedItem : '';
        formdata['ContractTypeCode'] = this.getControlValue('ContractTypeCode') ? this.getControlValue('ContractTypeCode') : '~~IGNORE~~';
        formdata['InvoiceRangePrefix'] = this.getControlValue('InvoiceRangePrefix') ? this.getControlValue('InvoiceRangePrefix') : '';
        formdata['InvoiceRangeSuffix'] = this.getControlValue('InvoiceRangeSuffix') ? this.getControlValue('InvoiceRangeSuffix') : '';
        formdata['MinimumInvoiceNumber'] = this.getControlValue('MinimumInvoiceNumber');
        formdata['MaximumInvoiceNumber'] = this.getControlValue('MaximumInvoiceNumber') || '';
        let nextInvoiceNumber = this.getControlValue('NextInvoiceNumber');
        formdata['NextInvoiceNumber'] = nextInvoiceNumber ? nextInvoiceNumber : nextInvoiceNumber === 0 ? 0 : '';
        formdata['TaxRange'] = this.getControlValue('TaxRange') ? true : false;
        this.queryParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.navigate('InvoiceRangeAdd', InternalGridSearchSalesModuleRoutes.ICABSBINVOICERANGEUPDATEGRID);
                    this.formPristine();
                    this.uiForm.controls['ContractTypeCode'].markAsPristine();
                    this.uiForm.controls['TaxCode'].markAsPristine();
                    this.uiForm.controls['BranchNumber'].markAsPristine();
                    this.uiForm.controls['CompanyCode'].markAsPristine();
                    this.uiForm.controls['InvoiceCreditSelect'].markAsPristine();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error));
            });
    }


    //implementing delete logic
    public promptContentDeleteData(eventObj: any): void {
        let formdata: Object = {};
        let queryPost: URLSearchParams = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '3');
        formdata['RowID'] = this.getControlValue('RowID');
        formdata['InvoiceRangeNumber'] = this.getControlValue('InvoiceRangeNumber');
        this.queryParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.fullError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.navigate('InvoiceRangeUpdate', InternalGridSearchSalesModuleRoutes.ICABSBINVOICERANGEUPDATEGRID);
                    this.uiForm.reset();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error));
            });
    }

}
