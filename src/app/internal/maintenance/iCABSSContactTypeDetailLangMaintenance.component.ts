import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
import { DropdownComponent } from '../../../shared/components/dropdown/dropdown';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { ContactTypeDetailSearchDropDownComponent } from './../../internal/search/iCABSSContactTypeDetailSearch.component';
import { ContactTypeSearchComponent } from './../../internal/search/iCABSSContactTypeSearch';

@Component({
    templateUrl: 'iCABSSContactTypeDetailLangMaintenance.html'
})

export class ContactTypeDetailLanglMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('ellipsisContactTypeDetailCode') public ellipsisContactTypeDetailCode: EllipsisComponent;
    @ViewChild('formLanguageCode') formLanguageCode;
    @ViewChild('ContactTypeDetailDesc') contactTypeDetailDesc;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('promptConfirmModalDelete') public promptConfirmModalDelete;
    @ViewChild('contactTypeDropDown') contactTypeDropDown: ContactTypeSearchComponent;
    @ViewChild('customDropDown') public customDropDown: DropdownComponent;
    @ViewChild('ddContactTypeDetailSearch') ddContactTypeDetailSearch: ContactTypeDetailSearchDropDownComponent;

    private queryParams: any = {
        operation: 'System/iCABSSContactTypeDetailLangMaintenance',
        module: 'tickets',
        method: 'ccm/admin'
    };

    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'LanguageCode', required: false, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'LanguageDescription', type: MntConst.eTypeText, disabled: true },
        { name: 'ContactTypeCode', type: MntConst.eTypeCode },
        { name: 'ContactTypeSystemDesc', type: MntConst.eTypeText },
        { name: 'ContactTypeDetailCode', type: MntConst.eTypeCode },
        { name: 'ContactTypeDetailSystemDesc', type: MntConst.eTypeText },
        { name: 'ContactTypeDetailDesc', required: true, type: MntConst.eTypeText, commonValidator: true, value: '' },
        { name: 'ExternalSMSDescription', type: MntConst.eTypeText, commonValidator: true, value: '' },
        { name: 'ExternalEmailDescription', type: MntConst.eTypeText, commonValidator: true, value: '' },
        { name: 'ROWID' }
    ];

    public inputParams: any = {};
    public promptTitle: string;
    public promptContent: string;
    public isShowPromptHeader: boolean = true;
    public isbtnSave: boolean = true;
    public isbtnCancel: boolean = true;
    public isbtnDelete: boolean = true;
    public isbtnAdd: boolean = false;
    public fetchTrue: boolean = false;

    public ellipsisConfig = {
        languageCode: {
            autoOpen: false,
            showCloseButton: true,
            showHeader: true,
            childConfigParams: {
                'parentMode': 'LookUp'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: ScreenNotReadyComponent // TODO riMGLanguageSearch
        }
    };

    public dropdown: any = {
        contactTypeDetailSearch: {
            params: {
                ContactTypeCode: ''
            },
            active: { id: '', text: '' },
            isDisabled: false,
            isRequired: true,
            isTriggerValidate: false
        },
        contactTypeDropDown: {
            isTriggerValidate: false
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCONTACTTYPEDETAILLANGMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Contact Type Language Maintenance';
    }

    private fetchData(): void {
        if (this.fieldHasValue('LanguageCode') && this.fieldHasValue('ContactTypeCode')
            && this.fieldHasValue('ContactTypeDetailCode')) {
            this.dolookUCallForDesc(this.callFetchMethod);
        }
    }

    private callFetchMethod(): void {
        let postSearchParams = this.getURLSearchParamObject();
        let postParams: any = {};
        postSearchParams.set(this.serviceConstants.Action, '0');
        postParams['LanguageCode'] = this.getControlValue('LanguageCode');
        postParams['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
        postParams['ContactTypeDetailCode'] = this.getControlValue('ContactTypeDetailCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data['hasError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                    this.disableControl('ExternalSMSDescription', true);
                    this.disableControl('ExternalEmailDescription', true);
                    this.disableControl('ContactTypeDetailDesc', true);
                    this.formReset();
                    return;
                }
                this.setControlValue('ExternalEmailDescription', data.ExternalEmailDescription);
                this.setControlValue('ExternalSMSDescription', data.ExternalSMSDescription);
                this.setControlValue('ContactTypeDetailDesc', data.ContactTypeDetailDesc);
                this.disableControl('ContactTypeDetailDesc', false);
                this.disableControl('ExternalSMSDescription', false);
                this.disableControl('ExternalEmailDescription', false);
                this.setControlValue('ROWID', data.ttContactTypeDetailLang);
                this.formPristine();
                this.formModeButtonController(this.formMode = this.c_s_MODE_UPDATE);
                this.fetchTrue = true;
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error));
            });
    }

    private lookupDetails(query: any, callback?: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0] && data[0].length > 0) {
                this.setControlValue('LanguageDescription', data[0] && data[0].length ? data[0][0].LanguageDescription : '');
                callback.call(this);
            } else {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'LanguageCode');
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.recordNotFound));
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error));
        });
    }

    private formModeButtonController(modeForm: string): void {
        this.formMode = modeForm;
        if (this.formMode === this.c_s_MODE_UPDATE) {
            this.isbtnAdd = false;
            this.isbtnSave = false;
            this.isbtnCancel = false;
            this.fetchTrue = true ? this.isbtnDelete = false : this.isbtnDelete = true;
        } else if (this.formMode === this.c_s_MODE_ADD) {
            this.isbtnAdd = true;
            this.isbtnSave = false;
            this.isbtnCancel = false;
            this.isbtnDelete = true;
        } else if (this.formMode === this.c_s_MODE_SELECT) {
            this.isbtnAdd = false;
            this.isbtnSave = true;
            this.isbtnCancel = true;
            this.isbtnDelete = true;
        }
    }

    private checkFieldsAndFetchDataOrClear(): void {
        if (this.formMode !== this.c_s_MODE_ADD) {
            if (this.fieldHasValue('LanguageCode') && this.fieldHasValue('ContactTypeCode')
                && this.fieldHasValue('ContactTypeDetailCode')) {
                this.fetchData();
            } else {
                if (this.formMode === this.c_s_MODE_UPDATE) {
                    this.setControlValue('ContactTypeDetailDesc', '');
                    this.setControlValue('ExternalSMSDescription', '');
                    this.setControlValue('ExternalEmailDescription', '');
                }
            }
        }
    }

    private moveToNormalMode(): void {
        this.uiForm.reset();
        this.ddContactTypeDetailSearch.active = { id: '', text: '' };
        this.contactTypeDropDown.active = { id: '', text: '' };
        this.dropdown.contactTypeDetailSearch.params.ContactTypeCode = '';
        this.ddContactTypeDetailSearch.fetchData();
        this.disableControls(['LanguageCode']);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LanguageCode', true);
        this.formModeButtonController(this.formMode = this.c_s_MODE_SELECT);
        this.uiForm.markAsPristine();
        this.formLanguageCode.nativeElement.focus();
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.formLanguageCode.nativeElement.focus();
        this.disableControls(['LanguageCode']);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LanguageCode', true);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    /********public calls **********/
    public markFieldPristine(): void {
        this.uiForm.controls['LanguageCode'].markAsPristine();
    }

    public languageCodeOnChange(): void {
        this.uiForm.controls['LanguageCode'].markAsPristine();
        this.checkFieldsAndFetchDataOrClear();
    }

    public onReceivedContactType(data: any): void {
        if (data) {
            this.dropdown.contactTypeDetailSearch.params.ContactTypeCode = data.ContactTypeCode;
            this.setControlValue('ContactTypeCode', data.ContactTypeCode);
            this.setControlValue('ContactTypeSystemDesc', data.ContactTypeSystemDesc);
            this.uiForm.controls['ContactTypeCode'].markAsDirty();
        } else {
            this.dropdown.contactTypeDetailSearch.params.ContactTypeCode = '';
            this.setControlValue('ContactTypeCode', '');
            this.setControlValue('ContactTypeSystemDesc', '');
        }
        this.dropdown.contactTypeDetailSearch.active = { id: '', text: '' };
        this.setControlValue('ContactTypeDetailCode', '');
        this.setControlValue('ContactTypeDetailSystemDesc', '');
        this.ddContactTypeDetailSearch.fetchData();
        this.checkFieldsAndFetchDataOrClear();
    }

    public onContactTypeDetailCodeDropdownDataReceived(data: any): void {
        if (data && data['ContactTypeDetail.ContactTypeDetailCode']) {
            this.setControlValue('ContactTypeDetailCode', data['ContactTypeDetail.ContactTypeDetailCode']);
            this.setControlValue('ContactTypeDetailSystemDesc', data['ContactTypeDetail.ContactTypeDetailSystemDesc']);
            this.setControlValue('ContactTypeCode', data['ContactTypeDetail.ContactTypeCode']);
            this.setControlValue('ContactTypeSystemDesc', data['ContactType.ContactTypeSystemDesc']);
            this.contactTypeDropDown.active = { id: data['ContactTypeDetail.ContactTypeCode'], text: data['ContactTypeDetail.ContactTypeCode'] + ' - ' + data['ContactType.ContactTypeSystemDesc'] };
            this.uiForm.controls['ContactTypeDetailCode'].markAsDirty();
            if (this.formMode !== this.c_s_MODE_ADD) {
                this.contactTypeDetailDesc.nativeElement.focus();
            }
        }
        this.checkFieldsAndFetchDataOrClear();
    }

    public formReset(): void {
        this.setControlValue('ContactTypeDetailDesc', '');
        this.setControlValue('ExternalSMSDescription', '');
        this.setControlValue('ExternalEmailDescription', '');
        this.disableControl('ExternalSMSDescription', true);
        this.disableControl('ExternalEmailDescription', true);
        this.disableControl('ContactTypeDetailDesc', true);
        this.isbtnSave = false;
        this.isbtnCancel = false;
    }

    public dolookUCallForDesc(callback?: any): void {
        let lookupIP: any = [
            {
                'table': 'Language',
                'query': {
                    'LanguageCode': this.getControlValue('LanguageCode')
                },
                'fields': ['LanguageDescription']
            }
        ];
        this.lookupDetails(lookupIP, callback);
    }

    public showSaveConfirm(): void {
        if (!this.riExchange.validateForm(this.uiForm) || !this.fieldHasValue('ContactTypeCode')
            || !this.fieldHasValue('ContactTypeDetailCode')) {
            this.dropdown.contactTypeDetailSearch.isTriggerValidate = true;
            this.dropdown.contactTypeDropDown.isTriggerValidate = true;
            return;
        } else {
            this.dolookUCallForDesc(this.proceedWithSaveConfirmation);
        }
    }

    public proceedWithSaveConfirmation(): void {
        if (this['uiForm'].valid) {
            this.promptContent = MessageConstant.Message.ConfirmRecord;
            this.promptModal.show();
        } else {
            this.riExchange.riInputElement.isError(this.uiForm, 'LanguageCode');
            this.riExchange.riInputElement.isError(this.uiForm, 'ContactTypeDetailDesc');
            this.dropdown.contactTypeDetailSearch.isTriggerValidate = true;
            this.contactTypeDropDown.isTriggerValidate = true;
        }
    }

    public showDeleteConfirm(): void {
        this.promptContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModalDelete.show();
        this.isbtnCancel = false;
    }


    public onLanguageDataReceived(data: any): void {
        if (data) {
            // TODO
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageCode', data.LanguageCode);
            // this.riExchange.riInputElement.SetValue(this.uiForm, 'LanguageDescription', data.LanguageDescription);
        }
    }

    public addMode(): void {
        this.formMode = this.c_s_MODE_ADD;
        this.uiForm.reset();
        this.ddContactTypeDetailSearch.active = { id: '', text: '' };
        this.contactTypeDropDown.active = { id: '', text: '' };
        this.contactTypeDropDown.isRequired = true;
        this.enableControls(['LanguageDescription']);
        this.isbtnSave = false;
        this.isbtnDelete = true;
        this.isbtnCancel = false;
        this.isbtnAdd = true;
    }

    public saveUpdatedData(): void {
        if (!this.riExchange.validateForm(this.uiForm)) {
            return;
        } else {
            this.dolookUCallForDesc(this.proceedWithSaveUpdate);
        }
    }

    public proceedWithSaveUpdate(): void {
        let postSearchParams = this.getURLSearchParamObject();
        let postParams: any = {};
        if (this.formMode === this.c_s_MODE_ADD) {
            postSearchParams.set(this.serviceConstants.Action, '1');
            postParams['LanguageCode'] = this.getControlValue('LanguageCode');
            postParams['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
            postParams['ContactTypeDetailCode'] = this.getControlValue('ContactTypeDetailCode');
            postParams['ContactTypeDetailDesc'] = this.getControlValue('ContactTypeDetailDesc') ? this.getControlValue('ContactTypeDetailDesc') : '';
            postParams['ExternalEmailDescription'] = this.getControlValue('ExternalEmailDescription') ? this.getControlValue('ExternalEmailDescription') : '';
            postParams['ExternalSMSDescription'] = this.getControlValue('ExternalSMSDescription') ? this.getControlValue('ExternalSMSDescription') : '';
        } else {
            postSearchParams.set(this.serviceConstants.Action, '2');
            postParams['ROWID'] = this.getControlValue('ROWID');
            postParams['ContactTypeDetailDesc'] = this.getControlValue('ContactTypeDetailDesc');
            postParams['ExternalEmailDescription'] = this.getControlValue('ExternalEmailDescription');
            postParams['ExternalSMSDescription'] = this.getControlValue('ExternalSMSDescription');
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.formModeButtonController(this.formMode = this.c_s_MODE_UPDATE);
                    this.setControlValue('ROWID', data.ttContactTypeDetailLang);
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error));
            });
    }

    public deleteSavedData(): void {
        let getSearchParams = this.getURLSearchParamObject();
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.Action, '3');
        search.set('ROWID', this.getControlValue('ROWID'));
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data['hasError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullerror']));
                    return;
                }
                let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.RecordDeleted);
                modalVO.closeCallback = this.moveToNormalMode.bind(this);
                this.modalAdvService.emitMessage(modalVO);
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }

    public onCancel(): void {
        if (this.formMode === this.c_s_MODE_ADD) {
            this.moveToNormalMode();
        } else {
            this.fetchData();
            this.formModeButtonController(this.formMode = this.c_s_MODE_UPDATE);
        }
        this.formPristine();
    }
}
