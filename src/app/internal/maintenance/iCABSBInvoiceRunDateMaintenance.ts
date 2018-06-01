import * as moment from 'moment';
import { Component, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { Subscription } from 'rxjs/Subscription';
import { ActionTypes } from '../../actions/account';
import { ContractSearchComponent } from '../search/iCABSAContractSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSBInvoiceRunDateMaintenance.html'
})

export class InvoiceRunDateMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    public controls = [
        { name: 'IncludeContractsAdvance', readonly: true, disabled: true, required: false },
        { name: 'ExtractDate', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'ExtractRunNumber', readonly: true, disabled: true, required: false },
        { name: 'ProcessDate', readonly: false, disabled: true, required: false },
        { name: 'IncludeContractsArrears', readonly: true, disabled: true, required: false },
        { name: 'InvoiceTotalExclTAX', readonly: true, disabled: true, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'InvoiceTAXTotal', readonly: true, disabled: true, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'IncludeJobs', readonly: true, disabled: true, required: false },
        { name: 'CreditTotalExclTAX', readonly: true, disabled: true, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'CreditTAXTotal', readonly: true, disabled: true, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'IncludeCredits', readonly: true, disabled: true, required: false },
        { name: 'ContractNumberString', readonly: true, disabled: true, required: false },
        { name: 'WarningMessage', readonly: true, disabled: false, required: false },
        { name: 'ExtractDateVal', readonly: true, disabled: false, required: false }
    ];
    public operationMode: any;
    private storeDataTemp: any = {};
    public contractNumberStringDisplayed: Boolean = false;
    private invoiceRunDateRowID: any;
    private contractArray: any[] = [];
    public ExtractDate: Date = new Date();
    public extractDateDisplayed: string;
    public dateReadOnly: boolean = true;
    public isRequesting: boolean = false;
    public promptTitle: String = MessageConstant.Message.DeleteRecord;
    public showMessageHeader: boolean = true;
    public promptContent = '';
    public extractDateValidate: boolean = false;
    private queryParams: any = {
        operation: 'Business/iCABSBInvoiceRunDateMaintenance',
        module: 'invoicing',
        method: 'bill-to-cash/admin'
    };

    @ViewChild('ContractSearchComponent') ContractSearchComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('datepck') public datepck;

    public ellipsis = {
        contractSearch: {
            disabled: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-String',
                currentContractType: '',
                currentContractTypeURLParameter: '',
                showAddNew: true,
                contractNumber: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            showHeader: true,
            showAddNew: false,
            autoOpenSearch: false,
            setFocus: false,
            component: ContractSearchComponent
        },
        date: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'currentContractType': 'C',
                'currentContractTypeURLParameter': '<contract>',
                'showAddNew': true
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: '',//iCABSBInvoiceDateSearch
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBINVOICERUNDATEMAINTENANCE;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Invoice Run Date Maintenance';
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        // this.parentMode = this.parentMode;
        this.extractDateDisplayed = this.utils.formatDate(this.ExtractDate);
        if (this.parentMode) {
            switch (this.parentMode) {
                case 'InvoiceRunDates':
                    this.invoiceRunDateRowID = this.riExchange.getParentHTMLValue('RowID');
                    // this.invoiceRunDateRowID = '0x0000000009f07403';//@REMOVE LATER
                    this.fetchRecord();
                    this.operationMode = 'ADD';
                    // If ContractNumberString field has a value then display it
                    if (this.uiForm.controls['ContractNumberString'].value) {
                        this.contractNumberStringDisplayed = true;
                    }
                    //If come in via Single Invoice Run then display ContractNumberString field
                    if (this.riExchange.getParentHTMLValue('StrSingleDesc') === 'Single') {
                        // if (this.uiForm.controls['ContractNumberString'].value) {
                        this.contractNumberStringDisplayed = true;
                        // }
                        // this.contractNumberStringDisplayed = true;
                        // Single Invoice users must not be able to delete batches with no contract number
                        if (this.uiForm.controls['ContractNumberString'].value) {
                            this.operationMode = 'ADD/DELETE';
                        }
                    }
                    break;
                case 'InvoiceRunDatesAdd':
                    this.operationMode = 'SAVE/CANCEL';
                    this.modifyEditMode();
                    this.beforeAdd();
                    break;
                case 'InvoiceRunDatesAddSingle':
                    this.operationMode = 'SAVE/CANCEL';
                    this.contractNumberStringDisplayed = true;
                    this.modifyEditMode();
                    this.beforeAdd();
                    break;
                default:
                //Nothing
            }
        }
    }

    private modifyEditMode(): void {
        this.riExchange.riInputElement.Enable(this.uiForm, 'IncludeContractsAdvance');
        this.riExchange.riInputElement.Enable(this.uiForm, 'IncludeContractsArrears');
        this.riExchange.riInputElement.Enable(this.uiForm, 'IncludeJobs');
        this.riExchange.riInputElement.Enable(this.uiForm, 'IncludeCredits');
        this.riExchange.riInputElement.Enable(this.uiForm, 'ContractNumberString');
        this.dateReadOnly = false;
        this.uiForm.reset();
        this.ExtractDate = null;
        this.extractDateDisplayed = '';
    }

    private fetchRecord(): void {

        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '0');

        let postParams: any = {};
        postParams.ROWID = this.invoiceRunDateRowID;
        // postParams.ExtractRunNumber = '530';
        this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        // this.errorService.emitError(new Error(e['errorMessage']));
                        this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                    } else {
                        this.ExtractDate = new Date(e.ExtractDate);
                        this.extractDateDisplayed = this.utils.formatDate(this.ExtractDate);
                        if (e.ProcessDate) {
                            let processDateTemp = new Date(e.ProcessDate);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProcessDate', this.utils.formatDate(processDateTemp));
                        }
                        this.setControlValue('ExtractDateVal', e.ExtractDate);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceTotalExclTAX', e.InvoiceTotalExclTAX);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ExtractRunNumber', e.ExtractRunNumber);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceTAXTotal', e.InvoiceTAXTotal);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CreditTotalExclTAX', e.CreditTotalExclTAX);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'CreditTAXTotal', e.CreditTAXTotal);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeContractsAdvance', e.IncludeContractsAdvance);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeContractsArrears', e.IncludeContractsArrears);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeJobs', e.IncludeJobs);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeCredits', e.IncludeCredits);
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumberString', e.ContractNumberString);
                        // If ContractNumberString field has a value then display it
                        if (this.uiForm.controls['ContractNumberString'].value) {
                            this.contractNumberStringDisplayed = true;
                        }
                        //If come in via Single Invoice Run then display ContractNumberString field
                        if (this.riExchange.getParentHTMLValue('StrSingleDesc') === 'Single') {
                            // if (this.uiForm.controls['ContractNumberString'].value) {
                            this.contractNumberStringDisplayed = true;
                            // }
                            // this.contractNumberStringDisplayed = true;
                            // Single Invoice users must not be able to delete batches with no contract number
                            if (this.uiForm.controls['ContractNumberString'].value) {
                                this.operationMode = 'ADD/DELETE';
                            }
                        }
                        this.setValuesInstoreDataTemp();
                        this.afterFetch();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.extractDateDisplayed = value.value;
            this.setControlValue('ExtractDateVal', value.value);
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'ProcessDate', '');//@REMOVE LATER
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'ExtractRunNumber', '1494');//@REMOVE LATER
        } else {
            this.extractDateDisplayed = '';
            this.setControlValue('ExtractDate', '');
        }
    }

    //----------------------@TODO----------------
    //    Sub ExtractDate_onkeydown
    //   If window.event.keyCode = 34 Then
    //     riExchange.Mode = "LookUp": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBInvoiceDateSearch.htm"
    //   End If
    // End Sub


    // Sub riMaintenance_Search
    //   riExchange.Mode = "Search":	window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBInvoiceDateSearch.htm"
    // End Sub
    //http://localhost:3000/#/maintenance/invoiceRunDateMaintenance?RowID=0x0000000009f07403&ParentMode=InvoiceRunDatesAdd
    //----------------------@TODO----------------

    private afterFetch(): void {
        this.resetEditMode();
        if (!this.uiForm.controls['ProcessDate'].value) {
            this.operationMode = 'ADD/DELETE';
        } else {
            this.operationMode = 'ADD';
        }
    }

    private setValuesInstoreDataTemp(): void {
        this.storeDataTemp = this.uiForm.getRawValue();
    }

    private resetEditMode(): void {
        this.contractArray = [];
        this.extractDateDisplayed = '';
        this.riExchange.riInputElement.Disable(this.uiForm, 'IncludeContractsAdvance');
        this.riExchange.riInputElement.Disable(this.uiForm, 'IncludeContractsArrears');
        this.riExchange.riInputElement.Disable(this.uiForm, 'IncludeJobs');
        this.riExchange.riInputElement.Disable(this.uiForm, 'IncludeCredits');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumberString');
        this.dateReadOnly = true;
        // this.restoreFieldsOnCancel();
    }

    private restoreFieldsOnCancel(): void {
        for (let key in this.uiForm.controls) {
            if (key && this.uiForm.controls.hasOwnProperty(key)) {
                this.uiForm.controls[key].markAsPristine();
                this.setControlValue(key, this.storeDataTemp[key]);
            }
        }
        this.ExtractDate = new Date(this.utils.convertDate(this.getControlValue('ExtractDateVal')));
    }

    /**
     * Add button clicked
     */
    public addClicked(): void {
        this.operationMode = 'SAVE/CANCEL';
        this.modifyEditMode();
        this.beforeAdd();
    }

    private afterSave(): void {
        this.location.back();
        // this.navigate('', '/billtocash/rundatesgrid');
    }

    private afterDelete(): void {
        this.location.back();
        // this.navigate('', '/billtocash/rundatesgrid');
    }

    private beforeAdd(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeContractsAdvance', true);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeContractsArrears', true);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeJobs', true);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'IncludeCredits', true);

        //If come in via Single Invoice Run, display ContractNumberString and make it mandatory
        if (this.riExchange.getParentHTMLValue('StrSingleDesc') === 'Single') {
            this.contractNumberStringDisplayed = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumberString', true);
            // Call riExchange.Functions.ToolTips.TextSet("ContractNumberString", "<%=riT("Select individual contract numbers separated by a comma, and / or a range (only if numeric contract numbers). Example: 1, 5, 7 - 10")%>")---@TODO
        }
    }

    /**
     * Save button clicked
     */
    public saveClicked(): void {
        this.datepck.validateDateField();
        this.beforeSave();
    }

    private beforeSave(): void {
        if (this.operationMode === 'SAVE/CANCEL') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'WarningMessage', '');
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            // this.extractDateValidate = true;

            let postParams: any = {};
            postParams.Function = 'CheckEnoughInvoiceNumbersWarning';
            this.ajaxSource.next(this.ajaxconstant.START);

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (e) => {
                    if (e['status'] === 'failure') {
                        this.errorService.emitError(e['oResponse']);
                    } else {
                        if ((typeof e !== 'undefined' && e['errorMessage'])) {
                            this.errorModal.show({ msg: e, title: '' }, false);
                        } else {
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'WarningMessage', e.WarningMessage);
                            if (this.uiForm.controls['WarningMessage'].value !== '') {
                                this.errorModal.show({ msg: e['WarningMessage'], title: '' }, false);
                                // this.errorService.emitError(new Error(e.WarningMessage));
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'WarningMessage', '');
                            } else {
                                this.saveNewRecord();
                            }
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }


    // On contract number ellipsis data return
    public onContractDataReceived(data: any): void {
        this.contractArray.push(data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumberString', this.contractArray.join(','));
    }

    public contractNumberString_onkeydown(obj: any): void {
        // obj.preventDefault();
        if (obj.keyCode === 34) {
            this.ellipsis.contractSearch.autoOpenSearch = true;
        }
    }

    public modalHiddenForContract(e: any): void {
        this.ellipsis.contractSearch.autoOpenSearch = false;
    }

    private saveNewRecord(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '1');

        let postParams: any = {};
        postParams.Function = 'CheckEnoughInvoiceNumbersWarning';
        postParams.ExtractDate = this.extractDateDisplayed;
        postParams.IncludeContractsAdvance = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeContractsAdvance') ? 'yes' : 'no';
        postParams.IncludeContractsArrears = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeContractsArrears') ? 'yes' : 'no';
        postParams.IncludeJobs = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeJobs') ? 'yes' : 'no';
        postParams.IncludeCredits = this.riExchange.riInputElement.GetValue(this.uiForm, 'IncludeCredits') ? 'yes' : 'no';
        postParams.ExtractRunNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExtractRunNumber');
        postParams.ProcessDate = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProcessDate');
        postParams.InvoiceTotalExclTAX = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceTotalExclTAX');
        postParams.InvoiceTAXTotal = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceTAXTotal');
        postParams.CreditTotalExclTAX = this.riExchange.riInputElement.GetValue(this.uiForm, 'CreditTotalExclTAX');
        postParams.CreditTAXTotal = this.riExchange.riInputElement.GetValue(this.uiForm, 'CreditTAXTotal');
        postParams.ContractNumberString = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumberString') ? this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumberString') : '';

        this.ajaxSource.next(this.ajaxconstant.START);
        if (this.extractDateDisplayed === '' || !this.extractDateDisplayed || !(moment(this.extractDateDisplayed, 'DD/MM/YYYY', true).isValid())) {
            //@TODO--Set Error status for date field
        } else {
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (e) => {
                    if (e['status'] === 'failure') {
                        this.errorService.emitError(e['oResponse']);
                    } else {
                        if ((typeof e !== 'undefined' && e['errorMessage'])) {
                            this.errorModal.show({ msg: e['errorMessage'], title: '' }, false);
                        } else {
                            this.afterSave();
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    /**
     * Cancel button clicked
     */
    public cancleClicked(): void {
        this.datepck.resetDateField();
        if (this.parentMode === 'InvoiceRunDatesAdd' || this.parentMode === 'InvoiceRunDatesAddSingle') {
            this.location.back();
            // this.navigate('', '/billtocash/rundatesgrid');
        } else {
            this.restoreFieldsOnCancel();
            this.afterFetch();
        }
    }

    /**
     * Delete button clicked
     */
    public deleteClicked(): void {
        this.promptModal.show();
    }

    public promptDeleteConfirmed(event: any): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '3');

        let postParams: any = {};
        // postParams.methodType = 'maintenance';
        postParams.InvoiceRunDateROWID = this.invoiceRunDateRowID;
        postParams.ExtractDate = this.extractDateDisplayed;

        this.ajaxSource.next(this.ajaxconstant.START);

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorModal.show({ msg: e, title: '' }, false);
                    } else {
                        this.afterDelete();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

}
