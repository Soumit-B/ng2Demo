import { Utils } from './../../../../shared/services/utility';
import { DropdownComponent } from './../../../../shared/components/dropdown/dropdown';
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { HttpService } from './../../../../shared/services/http-service';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, OnDestroy, Input, EventEmitter, ViewChild, Output, Injector, AfterViewInit } from '@angular/core';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { BatchProgramSearchComponent } from './../../../../app/internal/search/iCABSMGBatchProgramSearch';
import { BaseComponent } from './../../../../app/base/BaseComponent';
import { PageIdentifier } from './../../../../app/base/PageIdentifier';
import { AjaxConstant } from './../../../../shared/constants/AjaxConstants';
import { AjaxObservableConstant } from './../../../../shared/constants/ajax-observable.constant';
import { MessageService } from './../../../../shared/services/message.service';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';


@Component({
    templateUrl: 'riMGBatchProgramMaintenance.html',
    providers: [MessageService]
})
export class BatchProgramMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('programMaintenanceEllipsis') programMaintenanceEllipsis: EllipsisComponent;
    public batchProgramSearchComponent: Component;
    private batchProgramSearchData: any = {};
    public pageId: string = '';
    public batchProgramMaintenanceFormGroup: FormGroup;
    public batchProgramAutoOpen: boolean = false;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public autoOpenSearch: boolean = false;
    public isAddOrUpdateMode: boolean = false;
    public showMessageHeader: boolean = true;

    public search: URLSearchParams = new URLSearchParams();
    private currentMode: string = 'FETCH';
    public postSearchParams: URLSearchParams = new URLSearchParams();


    // Prompt Modal Model Properties
    public showPromptMessageHeader: boolean = true;
    public promptConfirmTitle: string;
    public promptConfirmContent: string;
    public isDeleteButtonDisabled: boolean = true;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public inputParams: any = {
        'parentMode': 'LookUp-Search',
        'businessCode': 'D',
        'countryCode': 'UK',
        'BranchNumber': '8',
        'lstBranchSelection': 'Service',
        'AccountNumber': '',
        'isAddNewHidden': false
    };



    public headerParams: any = {
        method: 'it-functions/ri-model',
        operation: 'Model/riMGBatchProgramMaintenance',
        module: 'batch-process'
    };

    public controls = [
        { name: 'riBatchProgramName', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramDescription', readonly: true, disabled: true, required: true },
        { name: 'riBatchProgramParam1Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam2Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam3Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam4Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam5Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam6Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam7Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam8Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam9Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam10Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam11Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramParam12Label', readonly: true, disabled: true, required: false },
        { name: 'riBatchProgramReport', readonly: true, disabled: true, required: false }
    ];

    private emptyFieldData: any = {
        'riBatchProgramDescription': '',
        'riBatchProgramParam1Label': '',
        'riBatchProgramParam2label': '',
        'riBatchProgramParam3Label': '',
        'riBatchProgramParam4Label': '',
        'riBatchProgramParam5Label': '',
        'riBatchProgramParam6Label': '',
        'riBatchProgramParam7Label': '',
        'riBatchProgramParam8Label': '',
        'riBatchProgramParam9Label': '',
        'riBatchProgramParam10Label': '',
        'riBatchProgramParam11Label': '',
        'riBatchProgramParam12Label': '',
        'riBatchProgramReport': false,
        'riBatchProgramName': ''
    };

    private crudOperations: any = {
        'add': 'ADD',
        'delete': 'DELETE',
        'update': 'UPDATE',
        'fetch': 'FETCH'
    };

    public isProgramDisabled: boolean = false;


    constructor(private injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.RIMGBATCHPROGRAMMAINTENANCE;
        this.pageTitle = 'Batch Program Maintenance';
        this.browserTitle = 'Batch Program Maintenance';

    }

    ngOnInit(): void {
        super.ngOnInit();
        this.uiForm = this.formBuilder.group({});
        //   this.localeTranslateService.setUpTranslation();
        this.batchProgramSearchComponent = BatchProgramSearchComponent;
        this.riExchange.renderForm(this.uiForm, this.controls);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        this.batchProgramAutoOpen = true;
        this.postInitialize();
    }

    public modalHidden(): void {
        this.batchProgramAutoOpen = false;
    }

    public onBatchProgramSearchDataReceived(data: any, route: any): void {
        this.isDeleteButtonDisabled = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramName', data.riBatchProgramName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramDescription', data.riBatchProgramDescription);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam1Label', data.riBatchProgramParam1Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam2Label', data.riBatchProgramParam2label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam3Label', data.riBatchProgramParam3Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam4Label', data.riBatchProgramParam4Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam5Label', data.riBatchProgramParam5Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam6Label', data.riBatchProgramParam6Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam7Label', data.riBatchProgramParam7Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam8Label', data.riBatchProgramParam8Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam9Label', data.riBatchProgramParam9Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam10Label', data.riBatchProgramParam10Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam11Label', data.riBatchProgramParam11Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramParam12Label', data.riBatchProgramParam12Label);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'riBatchProgramReport', data.riBatchProgramReport);
        if (route) {
            this.onUpdateClicked();
        }

    }

    public onAddClicked(): void {
        this.isProgramDisabled = true;
        this.isAddOrUpdateMode = true;
        this.currentMode = this.crudOperations.add;
        this.setUIFieldsEditablity('Enable');
        this.onBatchProgramSearchDataReceived(this.emptyFieldData, null); // empty the UI fields
        this.setFormMode(this.c_s_MODE_ADD);
    }

    public onUpdateClicked(): void {
        this.isProgramDisabled = true;
        this.isAddOrUpdateMode = true;
        this.currentMode = this.crudOperations.update;
        this.setUIFieldsEditablity('Enable');
        // this.riExchange.renderForm(this.uiForm, this.controlsEnabled);
        this.setFormMode(this.c_s_MODE_UPDATE);
    }

    public onSaveClicked(): void {
        let programName: string = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName');
        let programDesc: string = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramDescription');
        if (programName === '' || programDesc === '') {
            this.messageModal.show({ msg: MessageConstant.Message.programNameAndDescRequired, title: 'Message' }, false);

            return;
        }

        this.isAddOrUpdateMode = false;
        if (this.currentMode === this.crudOperations.update) {
            this.fetchAndUpdateBatchProgramData(this.currentMode);
        } else if (this.currentMode === this.crudOperations.add) {
            this.saveAndDelete(this.currentMode);
        }
        this.setUIFieldsEditablity('Disable');
        this.isProgramDisabled = false;
    }

    public onCancelClicked(): void {
        this.isProgramDisabled = false;
        let programName: string = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName');
        this.isAddOrUpdateMode = false;
        this.setUIFieldsEditablity('Disable');
        if (this.currentMode === this.crudOperations.update) {
            this.currentMode = this.crudOperations.fetch;
            this.fetchAndUpdateBatchProgramData(this.crudOperations.fetch);
        } else if (this.currentMode === this.crudOperations.add) {
            this.onBatchProgramSearchDataReceived(this.emptyFieldData, null); // empty the UI fields
            console.log('ELLISPSIS OPEN');
            this.programMaintenanceEllipsis.openModal();
            console.log('ELLISPSIS OPEN AFTER');
        }
        this.setFormMode(this.c_s_MODE_SELECT);
        if (programName === '') {
            this.isDeleteButtonDisabled = true;
        } else {
            this.isDeleteButtonDisabled = false;
        }
    }

    public onDeleteClicked(): void {
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModal.show();
        this.setFormMode(this.c_s_MODE_UPDATE);

    }

    public fetchAndUpdateBatchProgramData(operation: string): void {
        this.search = this.getURLSearchParamObject();
        if (operation === this.crudOperations.fetch) {
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set('riBatchProgramName', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName'));
        } else if (operation === this.crudOperations.update) {
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set('riBatchProgramName', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName'));
            this.search.set('riBatchProgramDescription', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramDescription'));
            // this.search.set('ROWID', '0x0000000000cb6100.p');
            this.search.set('riBatchProgramParam1Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam1Label'));
            this.search.set('riBatchProgramParam2Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam2Label'));
            this.search.set('riBatchProgramParam3Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam3Label'));
            this.search.set('riBatchProgramParam4Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam4Label'));
            this.search.set('riBatchProgramParam5Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam5Label'));
            this.search.set('riBatchProgramParam6Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam6Label'));
            this.search.set('riBatchProgramParam7Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam7Label'));
            this.search.set('riBatchProgramParam8Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam8Label'));
            this.search.set('riBatchProgramParam9Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam9Label'));
            this.search.set('riBatchProgramParam10Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam10Label'));
            this.search.set('riBatchProgramParam11Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam11Label'));
            this.search.set('riBatchProgramParam12Label', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam12Label'));
            this.search.set('riBatchProgramReport', this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramReport'));
        }
        this.ajaxSource.next(AjaxConstant.START);

        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module,
            this.headerParams.operation, this.search)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.errorService.emitError(e);
                } else {
                    if (operation === this.crudOperations.update) {
                        this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                    }
                    this.onBatchProgramSearchDataReceived(e, null);

                }
                this.ajaxSource.next(AjaxConstant.COMPLETE);

            },
            (error) => {
                //  this.errorMessage = error as any;
                this.errorService.emitError(error);
                this.ajaxSource.next(AjaxConstant.COMPLETE);
            });
    }

    private setUIFieldsEditablity(editability: string): void {
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramName');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramDescription');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam1Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam2Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam3Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam4Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam5Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam6Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam7Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam8Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam9Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam10Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam11Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramParam12Label');
        this.riExchange.riInputElement[editability](this.uiForm, 'riBatchProgramReport');
    }


    ////
    public saveAndDelete(mode: string): void {

        let _formData: Object = {};
        let _confirmMessage = '';

        _formData['riBatchProgramName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramName');

        if (mode === this.crudOperations.add) {
            _formData['riBatchProgramDescription'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramDescription');
            _formData['riBatchProgramParam1Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam1Label');
            _formData['riBatchProgramParam2Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam2Label');
            _formData['riBatchProgramParam3Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam3Label');
            _formData['riBatchProgramParam4Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam4Label');
            _formData['riBatchProgramParam5Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam5Label');
            _formData['riBatchProgramParam6Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam6Label');
            _formData['riBatchProgramParam7Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam7Label');
            _formData['riBatchProgramParam8Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam8Label');
            _formData['riBatchProgramParam9Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam9Label');
            _formData['riBatchProgramParam10Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam10Label');
            _formData['riBatchProgramParam11Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam11Label');
            _formData['riBatchProgramParam12Label'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramParam12Label');
            _formData['riBatchProgramReport'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'riBatchProgramReport');

            this.postSearchParams.set(this.serviceConstants.Action, '1');
            _confirmMessage = MessageConstant.Message.SavedSuccessfully;
        } else {
            this.postSearchParams.set(this.serviceConstants.Action, '3'); // for Delete
            _confirmMessage = MessageConstant.Message.RecordDeleted;
        }
        this.postSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.postSearchParams.set(this.serviceConstants.CountryCode, this.countryCode());


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.postSearchParams, _formData)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e.oResponse['errorMessage']);
                        _confirmMessage = e.oResponse['errorMessage'];
                    } else if (e['errorMessage']) {
                        _confirmMessage = e['errorMessage'];
                        //  this.errorService.emitError(e);
                        this.messageModal.show({ msg: _confirmMessage, title: 'Error' }, false);
                    } else {
                        this.messageModal.show({ msg: _confirmMessage, title: 'Message' }, false);
                        e['msg'] = _confirmMessage;
                        this.messageService.emitMessage(e);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }


    public promptConfirm(event: any): void {
        if (event) {
            this.currentMode = this.crudOperations.delete;
            this.saveAndDelete(this.currentMode);
            this.onBatchProgramSearchDataReceived(this.emptyFieldData, null); // empty the UI fields
            this.isDeleteButtonDisabled = true;
        }
    }

    public promptCancel(event: any): void {
        this.setFormMode(this.c_s_MODE_SELECT);
    }

    public onMessageClose(): void {// console.log();
    }

    private postInitialize(): void {

        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                if (data && data.addMode) {
                    this.onAddClicked();
                }
            }
        });

    }

}

