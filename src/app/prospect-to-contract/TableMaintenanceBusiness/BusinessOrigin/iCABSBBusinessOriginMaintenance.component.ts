import { ContactMediumLanguageSearchComponent } from './../../../internal/search/iCABSSContactMediumLanguageSearch.component';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { BaseComponent } from '../../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { RiMaintenance, MntConst, RiTab } from '../../../../shared/services/riMaintenancehelper';
import { Subscription } from 'rxjs/Subscription';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { ErrorCallback, MessageCallback } from './../../../base/Callback';

@Component({
    templateUrl: 'iCABSBBusinessOriginMaintenance.html'
})

export class BusinessOriginMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, ErrorCallback, MessageCallback {
    public openModal(ellipsisName: string): void { this[ellipsisName].openModal(); }
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;

    @ViewChild('BusinessSourceCodeEllipsis') public BusinessSourceCodeEllipsis: EllipsisComponent;
    @ViewChild('ContactMediumCodeEllipsis') public ContactMediumCodeEllipsis: EllipsisComponent;

    public pageId: string = '';
    public controls = [
        { name: 'BusinessOriginCode', required: true },
        { name: 'BusinessOriginSystemDesc', required: true },
        { name: 'BusinessSourceCode' },
        { name: 'BusinessSourceDesc' },
        { name: 'ContactMediumCode' },
        { name: 'ContactMediumDesc' },
        { name: 'NewBusinessInd' },
        { name: 'ValidForReneg' },
        { name: 'ValidForContract' },
        { name: 'ValidForJob' },
        { name: 'ValidForProductSale' },
        { name: 'LeadInd' },
        { name: 'ActiveInd' },
        { name: 'DetailRequiredInd' },
        { name: 'TransferCodeInd' },
        // hidden
        { name: 'ROWID' },
        { name: 'BusinessCode' }
    ];

    public currentActivity: string;
    public xhr: any;
    public xhrParams = {
        module: 'segmentation',
        method: 'prospect-to-contract/admin',
        operation: 'Business/iCABSBBusinessOriginMaintenance'
    };


    public ellipsis = {
        businessSourceCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNew': true
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ScreenNotReadyComponent, // Component of iCABSBBusinessSourceLanguageSearch
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        contactMediumCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp'
            },
            contentComponent: ContactMediumLanguageSearchComponent,
            showHeader: true,
            disabled: false
        }
    };


    public lookUpSubscription: Subscription;
    /* ========================Message Modal Popup ===================================*/
    // message Modal popup
    public errorTitle: string;
    public errorContent: string;
    public showErrorHeader: boolean = true;
    // message Modal popup
    public messageTitle: string;
    public messageContent: string;
    public showMessageHeader: boolean = true;
    // Prompt Modal popup
    public promptTitle: string = 'Confirm';
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public showPromptHeader: boolean = true;

    public showAlert(msgTxt: string, type?: number): void {
        //let translation = this.getTranslatedValue(msgTxt, null); //TODO - Translation needs to be included in the base component
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = 'Error Message'; break;
            case 1: titleModal = 'Success Message'; break;
            case 2: titleModal = 'Warning Message'; break;
        }

        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    }

    public showErrorModal(data: any): void { this.errorModal.show(data, true); }

    public showMessageModal(data: any): void { this.messageModal.show(data, true); }

    public isRequesting = false;
    public showSpinner(): void { this.isRequesting = true; }
    public hideSpinner(): void { this.isRequesting = false; }

    /* ========== Set Focus On =============== */
    public setFocusOnBusinessOriginCode = new EventEmitter<boolean>();
    public setFocusOnBusinessOriginSystemDesc = new EventEmitter<boolean>();

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBBUSINESSORIGINMAINTENANCE;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.setErrorCallback(this);
        this.setMessageCallback(this);

        this.pageTitle = 'Business Origin Maintenance';

        this.setFormMode(this.c_s_MODE_SELECT);
        this.routeAwayGlobals.setEllipseOpenFlag(false);

        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.window_onload();
        }
        this.routeAwayUpdateSaveFlag();
    }

    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    public window_onload(): void {
        this.utils.setTitle(this.pageTitle);

        this.riMaintenance.BusinessObject = 'riControl.p';
        this.riMaintenance.FunctionSnapShot = false;
        this.riMaintenance.FunctionDelete = false;
        this.setControlValue('BusinessCode', this.businessCode());
        this.setFocusOnBusinessOriginCode.emit(true);

        if (!this.riMaintenance.CurrentMode) {
            this.riMaintenance.UpdateMode();
            // this.riMaintenance.FunctionUpdate = true;
        }

        switch (this.riExchange.getParentMode()) {
            case 'BusinessOriginAdd':
                this.riMaintenance.AddMode();
                this.riMaintenance.FunctionDelete = false;
                this.riMaintenance.FunctionUpdate = true;
                this.riMaintenance.EnableInput('BusinessOriginCode');
                break;
            case 'BusinessOriginUpdate':
                this.riMaintenance.UpdateMode();
                this.riMaintenance.FunctionAdd = false;
                this.riMaintenance.FunctionSelect = false;
                this.riMaintenance.FunctionDelete = true;
                this.riMaintenance.DisableInput('BusinessOriginCode');
                this.riMaintenance.RowID(this, 'ROWID', this.riExchange.getParentAttributeValue('RowID') ? this.riExchange.getParentAttributeValue('RowID') : '');
                this.riMaintenance.FetchRecord();
                break;
        }
        if (this.getControlValue('BusinessOriginCode')) {
            this.fetchRecord();
        }
    }

    public fetchRecord(): void {
        this.logger.log('CurrentMode --->', this.riMaintenance.CurrentMode);
        this.riMaintenance.setIndependentVTableLookup(true);
        this.riMaintenance.AddTable('BusinessOrigin');

        this.riMaintenance.AddTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddTableKey('BusinessOriginCode', MntConst.eTypeCode, MntConst.eKeyOptionNormal, MntConst.eKeyStateNormal, 'Key');
        // if (this.getControlValue('ROWID'))
        // this.riMaintenance.AddTableKey('ROWID', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eKeyStateNormal, 'Key');
        this.riMaintenance.AddTableField('BusinessOriginSystemDesc', MntConst.eTypeText, MntConst.eFieldOptionRequried, MntConst.eFieldOptionRequried, 'Required');
        this.riMaintenance.AddTableField('NewBusinessInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequried, MntConst.eFieldOptionRequried, 'Required');
        this.riMaintenance.AddTableField('ValidForReneg', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequried, MntConst.eFieldOptionRequried, 'Required');
        this.riMaintenance.AddTableField('ValidForContract', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequried, MntConst.eFieldOptionRequried, 'Required');
        this.riMaintenance.AddTableField('ValidForJob', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequried, MntConst.eFieldOptionRequried, 'Required');
        this.riMaintenance.AddTableField('ValidForProductSale', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequried, MntConst.eFieldOptionRequried, 'Required');
        this.riMaintenance.AddTableField('LeadInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionRequried, MntConst.eFieldOptionRequried, 'Required');
        this.riMaintenance.AddTableField('ActiveInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldOptionRequried, 'Optional');
        this.riMaintenance.AddTableField('DetailRequiredInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldOptionRequried, 'Optional');
        this.riMaintenance.AddTableField('BusinessSourceCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldOptionRequried, 'Optional');
        this.riMaintenance.AddTableField('ContactMediumCode', MntConst.eTypeCode, MntConst.eFieldOptionNormal, MntConst.eFieldOptionRequried, 'Optional');
        this.riMaintenance.AddTableField('TransferCodeInd', MntConst.eTypeCheckBox, MntConst.eFieldOptionNormal, MntConst.eFieldOptionRequried, 'Optional');

        this.riMaintenance.AddTableCommit(this, this.getTableCallBack);

        this.riMaintenance.AddVirtualTable('BusinessSourceLang');
        this.riMaintenance.AddVirtualTableKeyCS('BusinessCode', MntConst.eTypeCode);
        this.riMaintenance.AddVirtualTableKey('BusinessSourceCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode, '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('BusinessSourceDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this, this.GetVirtualsBusinessSourceDesc);

        this.riMaintenance.AddVirtualTable('ContactMediumLang');
        this.riMaintenance.AddVirtualTableKey('ContactMediumCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '', '', '', 'Virtual');
        this.riMaintenance.AddVirtualTableKey('LanguageCode', MntConst.eTypeCode, MntConst.eVirtualKeyStateNormal, '=', this.riExchange.LanguageCode, '', 'Virtual');
        this.riMaintenance.AddVirtualTableField('ContactMediumDesc', MntConst.eTypeText, MntConst.eVirtualKeyStateNormal, 'Virtual');
        this.riMaintenance.AddVirtualTableCommit(this, this.GetVirtualsContactMediumDesc);

        this.riMaintenance.Complete();

        this.riMaintenance.DisableInput('BusinessSourceDesc');
        this.riMaintenance.DisableInput('ContactMediumDesc');
    }

    private riMaintenance_AfterSave(): void {
        let fields = `ROWID, BusinessOriginCode, BusinessOriginSystemDesc, NewBusinessInd, ValidForReneg, ValidForContract, ValidForJob, ValidForProductSale, LeadInd, ActiveInd, DetailRequiredInd, BusinessSourceCode, ContactMediumCode, TransferCodeInd`;

        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        let fieldsArr = fields.split(',');

        this.riMaintenance.clear();
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            let value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data: any): any {
            this.logger.log('DATA POST', data);
            if (data.hasError) {
                this.errorService.emitError(data);
            } else {
                this.setControlValue('ROWID', data.ttBusinessOrigin);
                this.showAlert(MessageConstant.Message.SavedSuccessfully, 1);
                // this.riExchange.UpdateParentHTMLDocument(); // TODO
                this.riMaintenance.UpdateMode();
                this.riMaintenance.DisableInput('BusinessOriginCode');
                this.riMaintenance.FunctionDelete = true;
                this.riMaintenance.RequestWindowClose = true;
                // event.preventDefault();
                // this.location.back();
            }
        }, 'POST', this.actionAfterSave);
        // ' Record has been saved, therefore allow user to update
        this.window_onload();
    }

    private riMaintenance_AfterAbandonAdd(): void {
        if (this.parentMode === 'BusinessOriginAdd' || this.parentMode === 'BusinessOriginUpdate') {
            this.riMaintenance.RequestWindowClose = true;
        }
    }

    private riMaintenance_AfterDelete(): void {
        let fields = `ROWID`;
        fields = fields.replace(/\\t/g, '').replace(/\r?\n|\r/g, '').replace(/ /g, '');
        let fieldsArr = fields.split(',');

        this.riMaintenance.clear();
        for (let i = 0; i < fieldsArr.length; i++) {
            let id = fieldsArr[i];
            let dataType = this.riMaintenance.getControlType(this.controls, id, 'type');
            let value = this.riExchange.riInputElement.GetValue(this.uiForm, id);
            this.riMaintenance.PostDataAdd(id, value, dataType);
        }
        this.riMaintenance.Execute(this, function (data: any): any {
            this.logger.log('DATA POST', data);
            if (data.hasError) {
                this.errorService.emitError(data);
            } else {
                this.setControlValue('ROWID', '');
                this.showAlert(MessageConstant.Message.RecordDeleted, 1);
                this.pageParams.BusinessOriginCode = '';
                this.riMaintenance.EnableInput('BusinessOriginCode');
                // this.riExchange.UpdateParentHTMLDocument(); // TODO
                this.cancel();
                this.riMaintenance.RequestWindowClose = true;
                // event.preventDefault();
                // this.location.back();
            }
        }, 'POST', this.actionAfterDelete);
        this.riMaintenance.UpdateMode();
        this.window_onload();
    }

    private getTableCallBack(data: any): void {
        this.logger.log('Fetch Record Data -----> ', data);
        if (data) {
            this.setControlValue('ROWID', data.ttBusinessOrigin);
            this.setControlValue('BusinessOriginCode', data.BusinessOriginCode);
            this.pageParams.BusinessOriginCode = data.BusinessOriginCode;
            this.BusinessSourceCode_onkeydown();
            this.ContactMediumCode_onkeydown();
            if (data.BusinessOriginCode) {
                this.riMaintenance.FunctionDelete = true;
                this.riMaintenance.FunctionUpdate = true;
            }
            else {
                this.riMaintenance.FunctionDelete = false;
                this.riMaintenance.FunctionUpdate = false;
            }
        }
    };

    private GetVirtualsBusinessSourceDesc(data: any): void {
        this.logger.log('Get Virtual Table <BusinessSourceLang> CallBack Data', data);
        if (data.BusinessOriginCode) {
            this.setControlValue('ROWID', data.ttBusinessOrigin);
            this.setControlValue('BusinessOriginCode', data.BusinessOriginCode);
            this.pageParams.BusinessOriginCode = data.BusinessOriginCode;
            this.riMaintenance.FunctionDelete = true;
            this.riMaintenance.FunctionUpdate = true;
        }
        else {
            this.riMaintenance.FunctionDelete = false;
            this.riMaintenance.FunctionUpdate = false;
        }
    }

    private GetVirtualsContactMediumDesc(data: any): void {
        this.logger.log('Get Virtual Table <ContactMediumLang> CallBack Data', data);
        if (data.BusinessOriginCode) {
            this.setControlValue('ROWID', data.ttBusinessOrigin);
            this.setControlValue('BusinessOriginCode', data.BusinessOriginCode);
            this.pageParams.BusinessOriginCode = data.BusinessOriginCode;
            this.riMaintenance.FunctionDelete = true;
            this.riMaintenance.FunctionUpdate = true;
        }
        else {
            this.riMaintenance.FunctionDelete = false;
            this.riMaintenance.FunctionUpdate = false;
        }
    }

    public BusinessOriginCode_onkeydown(e: any): void {
        //    this.riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBBusinessOriginLanguageSearch.htm'
        // this.messageContent = 'The Business/iCABSBBusinessOriginLanguageSearch.htm page is not yet covered';
        // this.showAlert(this.messageContent, 2);
        if (e.target.value) {
            this.fetchRecord();
        } else {
            this.setControlValue('BusinessOriginSystemDesc', '');
        }
        // Focus on Actual Season Number
        this.setFocusOnBusinessOriginSystemDesc.emit(true);
    }

    public businessSourceCode_OnSelect(data: any): void {
        if (data.BusinessSourceCode) {
            this.setControlValue('BusinessSourceCode', data.BusinessSourceCode);
        }

        if (data.BusinessSourceDesc) {
            this.setControlValue('BusinessSourceDesc', data.BusinessSourceDesc);
        }
    }

    public contactMediumCode_OnSelect(data: any): void {
        if (data.ContactMediumCode) {
            this.setControlValue('ContactMediumCode', data.ContactMediumCode);
        }

        if (data.ContactMediumDesc) {
            this.setControlValue('ContactMediumDesc', data.ContactMediumDesc);
        }
    }

    private riMaintenance_Search(): void {
        //  this.riExchange.Mode = 'Search':	window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBBusinessOriginSearch.htm'
        this.messageContent = 'The Business/iCABSBBusinessOriginSearch.htm page is not yet covered';
        this.showAlert(this.messageContent, 2);
    }

    public BusinessSourceCode_onkeydown(): void {
        //    this.riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=Business/iCABSBBusinessSourceLanguageSearch.htm'
        let lookupIP = [
            {
                'table': 'BusinessSourceLang',
                'query': {
                    'BusinessCode': this.getControlValue('BusinessCode'),
                    'BusinessSourceCode': this.getControlValue('BusinessSourceCode') ? this.getControlValue('BusinessSourceCode') : ''
                },
                'fields': ['BusinessSourceDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let BusinessSourceLang = data[0][0];
            this.logger.log('Get BusinessSourceLang Table data on Lookup ---->', data);
            if (BusinessSourceLang) {
                this.setControlValue('BusinessSourceDesc', BusinessSourceLang.BusinessSourceDesc ? BusinessSourceLang.BusinessSourceDesc : '');
            } else {
                this.setControlValue('BusinessSourceCode', '');
                this.setControlValue('BusinessSourceDesc', '');
            }
        });
    }

    public ContactMediumCode_onkeydown(): void {
        //    this.riExchange.Mode = 'LookUp': window.location = '/wsscripts/riHTMLWrapper.p?riFileName=System/iCABSSContactMediumLanguageSearch.htm'
        let lookupIP = [
            {
                'table': 'ContactMediumLang',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContactMediumCode': this.getControlValue('ContactMediumCode') ? this.getControlValue('ContactMediumCode') : ''
                },
                'fields': ['ContactMediumDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let ContactMediumLang = data[0][0];
            this.logger.log('Get ContactMediumLang Table data on Lookup ---->', data);
            if (ContactMediumLang) {
                this.setControlValue('ContactMediumDesc', ContactMediumLang.ContactMediumDesc ? ContactMediumLang.ContactMediumDesc : '');
            } else {
                this.setControlValue('ContactMediumCode', '');
                this.setControlValue('ContactMediumDesc', '');
            }
        });
    }



    /* ===================== SAVE/Cancel/Delete ================== */
    public actionAfterSave: number = 0;
    public save(): void {
        this.currentActivity = 'SAVE';
        this.riMaintenance.CancelEvent = false;

        this.logger.log('SAVE clicked ', this.uiForm.status, this.checkErrorStatus(), this.currentActivity, this.riMaintenance.CurrentMode);
        if (this.checkErrorStatus()) {
            switch (this.currentActivity) {
                case 'SAVE':
                    this.currentActivity = '';
                    switch (this.riMaintenance.CurrentMode) {
                        case 'eModeAdd':
                        case 'eModeSaveAdd':
                            this.setFocusOnBusinessOriginCode.emit(true);
                            this.actionAfterSave = 1;
                            this.riMaintenance.execMode(MntConst.eModeSaveAdd, [this]);
                            break;
                        case 'eModeUpdate':
                        case 'eModeSaveUpdate':
                            this.actionAfterSave = 2;
                            this.riMaintenance.execMode(MntConst.eModeSaveUpdate, [this]);
                            break;
                    }
                    break;
            }
        }
    }

    public actionAfterDelete: number = 3;
    public delete(): void {
        this.currentActivity = 'DELETE';
        this.riMaintenance.CancelEvent = false;
        this.riMaintenance.DeleteMode();
        this.logger.log('DELETE clicked ', this.uiForm.status, this.checkErrorStatus(), this.currentActivity, this.riMaintenance.CurrentMode);
        if (this.checkErrorStatus()) {
            if (this.currentActivity === 'DELETE') {
                this.currentActivity = '';
                this.promptContent = MessageConstant.Message.DeleteRecord;
                this.riMaintenance.execMode(MntConst.eModeDelete, [this]);
            }
        }
    }

    public confirm(): any {
        this.promptModal.show();
    }
    public confirmed(obj: any): any {
        this.riMaintenance.CancelEvent = false;
        this.riMaintenance.execContinue(this.riMaintenance.CurrentMode, [this]);
    }
    public closeModal(): void {
        this.logger.log('Modal closed.');
        this.isModalOpen(false);
        this.riMaintenance.handleConfirm(this);
    }
    public isModalOpen(flag: boolean): void {
        this.logger.log('isModalOpen', flag);
        this.riMaintenance.isModalOpen = flag;
    }

    public cancel(): void {
        this.logger.log('CANCEL clicked');
        // this.pageParams.BusinessOriginCode = this.getControlValue('BusinessOriginCode');
        this.riExchange.resetCtrl(this.controls);
        // this.riMaintenance.CurrentMode = MntConst.eModeUpdate;
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.setControlValue('BusinessOriginCode', this.pageParams.BusinessOriginCode);
        this.window_onload();
    }

    public checkErrorStatus(): boolean {
        if (!this.hasNoError('BusinessOriginCode')) {
            this.riExchange.riInputElement.SetMarkedAsTouched(this.uiForm, 'BusinessOriginCode', true);
        } else {
            this.riExchange.riInputElement.SetMarkedAsTouched(this.uiForm, 'BusinessOriginCode', false);
        }

        if (!this.hasNoError('BusinessOriginSystemDesc')) {
            this.riExchange.riInputElement.SetMarkedAsTouched(this.uiForm, 'BusinessOriginSystemDesc', true);
        } else {
            this.riExchange.riInputElement.SetMarkedAsTouched(this.uiForm, 'BusinessOriginSystemDesc', false);
        }
        if (this.hasNoError('BusinessOriginCode')
            || this.hasNoError('BusinessOriginSystemDesc')) {
            return true;
        } else {
            return false;
        }
    }

    /*
   *   Alerts user when user is moving away without saving the changes. //CR implementation
   */
    public routeAwayUpdateSaveFlag(): void {
        this.uiForm.statusChanges.subscribe((value: any) => {
            if (value === 'INVALID') {
                this.setFormMode(this.c_s_MODE_UPDATE);
            }
        });

        if (this.riMaintenance.CurrentMode === 'MntConst.eModeAdd') {
            this.setFormMode(this.c_s_MODE_ADD);
        } else if (this.riMaintenance.CurrentMode === 'MntConst.eModeUpdate') {
            this.setFormMode(this.c_s_MODE_UPDATE);
        } else {
            this.setFormMode(this.c_s_MODE_SELECT);
        }
    }
}
