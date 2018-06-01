import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, Injector, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { BaseComponent } from './../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { LookUp } from './../../../shared/services/lookup';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { PostCodeSearchComponent } from './../search/iCABSBPostcodeSearch.component';

@Component({
    templateUrl: 'iCABSSContactTypeDetailPCExcMaint.html'
})

export class ContactTypeDetailPCExcMaintComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('postCodeSearchEllipsis') postCodeSearchEllipsis: PostCodeSearchComponent;

    private lookUpUpSubscription: Subscription;
    private riMaintenanceCurrentMode: string = '';
    private riMaintenanceCustomBusinessObjectAdditionalPostData: string = '';
    private isCancelEvent: boolean = false;

    public pageId: string = '';
    public isRequesting: boolean;
    public isExcludePostcodeFocus = new EventEmitter<boolean>();
    public isExclusionTypeSelfocus = new EventEmitter<boolean>();
    public search: URLSearchParams = new URLSearchParams();


    public xhrParams: any = {
        module: 'tickets',
        method: 'ccm/maintenance',
        operation: 'System/iCABSSContactTypeDetailPCExcMaint'
    };
    public controls: Array<any> = [
        { name: 'ContactTypeCode', readonly: true, required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'ContactTypeSystemDesc', readonly: true, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ContactTypeDetailCode', readonly: true, required: false, disabled: true, type: MntConst.eTypeCode },
        { name: 'ContactTypeDetailSystemDesc', readonly: true, required: false, disabled: true, type: MntConst.eTypeText },
        { name: 'ExcludePostcode', required: true, type: MntConst.eTypeCode },
        { name: 'Postcode', required: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ExcludeState', required: false, type: MntConst.eTypeText, commonValidator: true },
        { name: 'ExcludeTown', required: false, type: MntConst.eTypeText, commonValidator: true },
        { name: 'ExclusionTypeSel', required: false, type: MntConst.eTypeInteger },
        { name: 'ExclusionType', required: false, type: MntConst.eTypeInteger },
        { name: 'ContactTypeDetailPostcodeExcludeROWID', required: false, type: MntConst.eTypeCode }
    ];
    public ellipsis: any = {
        postCodeSearch: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            autoOpenSearch: false,
            setFocus: false,
            childConfigParams: {
                parentMode: 'CTDExclusion'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: PostCodeSearchComponent
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCONTACTTYPEDETAILPCEXCMAINT;
        this.browserTitle = this.pageParams.strDocTitle = 'Fixed Price Job Postcode Exclusions Maintenance';
        this.search = this.getURLSearchParamObject();
        this.setURLQueryParameters(this);
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.windowOnload();
        }
        this.routeAwayUpdateSaveFlag();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
    }

    ngAfterViewInit(): void {
        this.isExcludePostcodeFocus.emit(true);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.lookUpUpSubscription) this.lookUpUpSubscription.unsubscribe();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    public windowOnload(): void {
        this.setControlValue('ContactTypeCode', this.riExchange.getParentHTMLValue('ContactTypeCode'));
        this.setControlValue('ContactTypeSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeSystemDesc'));
        this.setControlValue('ContactTypeDetailCode', this.riExchange.getParentHTMLValue('ContactTypeDetailCode'));
        this.setControlValue('ContactTypeDetailSystemDesc', this.riExchange.getParentHTMLValue('ContactTypeDetailSystemDesc'));

        this.disableControl('ContactTypeSystemDesc', true);
        this.disableControl('ContactTypeDetailSystemDesc', true);
        this.disableControl('ExclusionTypeSel', true);

        if (this.pageParams.ParentMode === 'Update') {
            this.setControlValue('ContactTypeDetailPostcodeExcludeROWID', this.riExchange.getParentAttributeValue('ContactTypeDetailPostcodeExcludeROWID'));
            this.setControlValue('ExcludePostcode', this.riExchange.getParentHTMLValue('passExcludePostcode'));
            this.setControlValue('Postcode', this.riExchange.getParentHTMLValue('passExcludePostcode'));
            this.setControlValue('ExcludeState', this.riExchange.getParentHTMLValue('passExcludeState'));
            this.setControlValue('ExcludeTown', this.riExchange.getParentHTMLValue('passExcludeTown'));
            this.setControlValue('ExclusionTypeSel', this.getControlValue('ExclusionType') || '');

            this.riMaintenanceUpdateMode();
            this.pageParams.showDelete = true;
            this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
        } else if (this.pageParams.ParentMode === 'Add') {
            this.riMaintenanceAddMode();
            this.pageParams.showDelete = false;
            this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
        }

    }

    /* =========================
        riMaintenance Events execution
     =========================== */
    public riMaintenanceAddTableCommit(): void {
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('ContactTypeDetailPostcodeExcludeROWID', this.getControlValue('ContactTypeDetailPostcodeExcludeROWID'));
        this.search.set('ContactTypeCode', this.getControlValue('ContactTypeCode') || '');
        this.search.set('ContactTypeDetailCode', this.getControlValue('ContactTypeDetailCode') || '');
        this.search.set('ExcludePostcode', this.getControlValue('Postcode') || '');
        this.search.set('ExcludeState', this.getControlValue('ExcludeState') || '');
        this.search.set('ExcludeTown', this.getControlValue('ExcludeTown') || '');
        this.search.set('Mode', 'PCExcMaint');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ExcludeState', data.ExcludeState || '');
                    this.setControlValue('ExcludeTown', data.ExcludeTown || '');
                    this.setControlValue('ExclusionType', data.ExclusionType || '');
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riMaintenanceAddVirtualTableCommit(): void {
        let lookupIP = [
            {
                'table': 'Postcode',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'Postcode': this.getControlValue('Postcode')
                },
                'fields': ['Postcode']
            }
        ];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    if (data[0] && data[0].length > 0 && data[0][0]) {
                        if (data[0][0].Postcode !== null && data[0][0].Postcode !== 'undefined') {
                            this.setControlValue('Postcode', data[0][0] ? data[0][0].Postcode : '');
                        }
                    } else {
                        this.setControlValue('Postcode', '');
                        this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public riMaintenanceComplete(): void {
        this.riMaintenanceAddVirtualTableCommit();
        this.riMaintenanceAddTableCommit();
    }

    public riMaintenanceUpdateMode(): void {
        this.riMaintenanceCurrentMode = MntConst.eModeUpdate;
    }

    public riMaintenanceAddMode(): void {
        this.riMaintenanceCurrentMode = MntConst.eModeAdd;
    }

    public riMaintenanceExecMode(mode: string): void {
        switch (mode) {
            case 'eModeUpdate':
                this.riMaintenanceBeforeUpdate();
                this.riMaintenanceComplete();
                break;
            case 'eModeAdd':
                this.riMaintenanceBeforeAdd();
                break;
            case 'eModeSaveUpdate':
                this.riMaintenanceBeforeSave();
                this.confirm();
                break;
            case 'eModeSaveAdd':
                this.riMaintenanceBeforeSave();
                this.confirm();
                break;
            case 'eModeDelete':
                this.confirmDelete();
                break;
        }
    }

    public riMaintenanceExecContinue(mode: string): void {
        switch (mode) {
            case 'eModeSaveUpdate':
                this.riMaintenanceAfterSave();
                break;
            case 'eModeSaveAdd':
                this.riMaintenanceAfterSave();
                break;
            case 'eModeDelete':
                this.riMaintenanceAfterDelete();
                break;
        }
    }

    public riMaintenanceBeforeAdd(): void {
        this.setControlValue('ExclusionTypeSel', '1');
        this.disableControl('ExclusionTypeSel', false);
        this.disableControl('ExcludeTown', false);
        this.disableControl('ExcludeState', false);
    }

    public riMaintenanceAfterAbandon(): void {
        this.setControlValue('ExclusionTypeSel', this.getControlValue('ExclusionType'));
        this.disableControl('ExclusionTypeSel', true);
        this.disableControl('ExcludeTown', true);
        this.disableControl('ExcludeState', true);
        this.location.back();
    }

    public riMaintenanceBeforeSave(): void {
        this.setControlValue('ExclusionType', this.getControlValue('ExclusionTypeSel'));
    }

    public riMaintenanceBeforeUpdate(): void {
        this.disableControl('ExclusionTypeSel', false);
        this.setControlValue('ExclusionTypeSel', this.getControlValue('ExclusionType') || '1');
        this.ellipsis.postCodeSearch.disabled = true;
        this.disableControl('Postcode', true);
        this.disableControl('ExcludeTown', true);
        this.disableControl('ExcludeState', true);
        this.isExclusionTypeSelfocus.emit(true);
    }

    public riMaintenanceAfterSave(): void {
        this.search.set(this.serviceConstants.Action, this.pageParams.actionAfterSave);

        let formdata: Object = {};
        formdata['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
        formdata['ContactTypeDetailCode'] = this.getControlValue('ContactTypeDetailCode');
        formdata['ExcludePostcode'] = this.getControlValue('ExcludePostcode');
        formdata['ExcludeState'] = this.getControlValue('ExcludeState');
        formdata['ExcludeTown'] = this.getControlValue('ExcludeTown');
        formdata['ExclusionType'] = this.getControlValue('ExclusionType');
        if (this.riMaintenanceCurrentMode === MntConst.eModeSaveUpdate)
            formdata['ContactTypeDetailPostcodeExcludeROWID'] = this.getControlValue('ContactTypeDetailPostcodeExcludeROWID');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search, formdata)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError || e.errorMessage) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.markAsPrestine();
                    this.pageParams.AfterSave = true;
                    this.location.back();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riMaintenanceAfterDelete(): void {
        this.search.set(this.serviceConstants.Action, this.pageParams.actionAfterDelete);

        let formdata: Object = {};
        formdata['ContactTypeDetailPostcodeExcludeROWID'] = this.getControlValue('ContactTypeDetailPostcodeExcludeROWID');
        formdata['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
        formdata['ContactTypeDetailCode'] = this.getControlValue('ContactTypeDetailCode');
        formdata['ExcludePostcode'] = this.getControlValue('ExcludePostcode');
        formdata['ExcludeState'] = this.getControlValue('ExcludeState');
        formdata['ExcludeTown'] = this.getControlValue('ExcludeTown');
        formdata['ExclusionType'] = this.getControlValue('ExclusionType');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search, formdata)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.markAsPrestine();
                    this.location.back();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    // --------------handle query string parameters if any-------------//
    public getURLQueryParameters(param: any): void {
        this.pageParams.ParentMode = this.riExchange.getParentMode();
    }

    // --------------set form fields as pristine-------------//
    public markAsPrestine(): void {
        for (let i = 0; i < this.controls.length; i++) {
            this.uiForm.controls[this.controls[i].name].markAsPristine();
            this.uiForm.controls[this.controls[i].name].markAsUntouched();
        }
    }

    // -------------- Value of PostCode ellipsis ------ //
    public setEllipsisReturnData(data: any): void {
        if (data) {
            this.setControlValue('Postcode', data.Postcode || '');
            this.setControlValue('ExcludePostcode', data.Postcode || '');
            this.setControlValue('ExcludeState', data.ExcludeState || '');
            this.setControlValue('ExcludeTown', data.ExcludeTown || '');
        }
    }

    // -------------- riMaintenance Execution start ------ //
    public save(): void {
        this.riExchange.validateForm(this.uiForm);
        if (this.uiForm.status === 'VALID') {
            this.isCancelEvent = false;
            switch (this.riMaintenanceCurrentMode) {
                case 'eModeAdd':
                case 'eModeSaveAdd':
                    this.pageParams.actionAfterSave = 1;
                    this.riMaintenanceCurrentMode = MntConst.eModeSaveAdd;
                    this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
                    break;
                case 'eModeUpdate':
                case 'eModeSaveUpdate':
                    this.pageParams.actionAfterSave = 2;
                    this.riMaintenanceCurrentMode = MntConst.eModeSaveUpdate;
                    this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
                    break;
            }
        }
    }
    public cancel(): void {
        this.riExchange.resetCtrl(this.controls);
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.isExcludePostcodeFocus.emit(true);
        this.markAsPrestine();
        this.riMaintenanceAfterAbandon();
    }
    public delete(): void {
        if (this.uiForm.status === 'VALID') {
            this.pageParams.actionAfterDelete = 3;
            this.riMaintenanceCurrentMode = MntConst.eModeDelete;
            this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
        }
    }
    public confirm(): any {
        let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.confirmed.bind(this), this.promptCancel.bind(this));
        this.modalAdvService.emitPrompt(modalVO);
    }

    public confirmDelete(): any {
        let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.confirmed.bind(this), this.promptCancel.bind(this));
        this.modalAdvService.emitPrompt(modalVO);
    }
    public confirmed(obj: any): any {
        this.isCancelEvent = false;
        this.riMaintenanceExecContinue(this.riMaintenanceCurrentMode);
    }
    public promptCancel(obj: any): any {
        this.isCancelEvent = true;
    }
    /*
    *  Alerts user when user is moving away without saving the changes. //CR implementation
    */
    public routeAwayUpdateSaveFlag(): void {
        this.uiForm.statusChanges.subscribe((value: any) => {
            if (this.uiForm.dirty === true) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }
}
