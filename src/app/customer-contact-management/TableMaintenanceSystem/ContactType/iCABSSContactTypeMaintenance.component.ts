import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from './../../../base/BaseComponent';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ContactTypeSearchComponent } from './../../../internal/search/iCABSSContactTypeSearch';

@Component({
    templateUrl: 'iCABSSContactTypeMaintenance.html'
})

export class ContactTypeMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('contactTypeDropDown') contactTypeDropDown: ContactTypeSearchComponent;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('formContactTypeCode') formContactTypeCode;
    private queryParams: any = {
        operation: 'System/iCABSSContactTypeMaintenance',
        module: 'tickets',
        method: 'ccm/admin'
    };
    public promptTitle: string;
    public isNewAddField: boolean = false;
    public isOldAddField: boolean = true;
    public pageId: string = '';
    public isBtnAdd: boolean = true;
    public isBtnSave: boolean = false;
    public isBtnDelete: boolean = false;
    public isBtnCancel: boolean = false;
    public isValidStatusEP: boolean = false;
    public isValidStatusWP: boolean = false;
    public isValidStatusSD: boolean = false;
    public isValidStatusCode: boolean = false;
    public showPromptHeader: boolean = true;
    public promptContent: string = MessageConstant.Message.ConfirmRecord;
    public controls = [
        { name: 'ContactTypeCode', type: MntConst.eTypeCode },
        { name: 'ContactTypeSystemDesc', type: MntConst.eTypeText, required: true },
        { name: 'Escalate', type: MntConst.eTypeCheckBox },
        { name: 'WorkingHoursInd', type: MntConst.eTypeInteger },
        { name: 'WorkingHoursIndSelect' },
        { name: 'EscalationHours', type: MntConst.eTypeInteger },
        { name: 'EscalationMinutes', type: MntConst.eTypeInteger },
        { name: 'EscalationPeriod', type: MntConst.eTypeInteger },
        { name: 'WarningHours', type: MntConst.eTypeInteger },
        { name: 'WarningMinutes', type: MntConst.eTypeInteger },
        { name: 'WarningPeriod', type: MntConst.eTypeInteger },
        { name: 'AlwaysClose', type: MntConst.eTypeCheckBox },
        { name: 'Prospect', type: MntConst.eTypeCheckBox },
        { name: 'Callout', type: MntConst.eTypeCheckBox },
        { name: 'Enquiry', type: MntConst.eTypeCheckBox },
        { name: 'ClientRetentionDefault', type: MntConst.eTypeCheckBox },
        { name: 'Diary', type: MntConst.eTypeCheckBox },
        { name: 'Entitlement', type: MntConst.eTypeCheckBox },
        { name: 'PDAServiceInd', type: MntConst.eTypeCheckBox },
        { name: 'PDALead', type: MntConst.eTypeCheckBox },
        { name: 'TermCompetitor', type: MntConst.eTypeCheckBox },
        { name: 'ComplaintInd', type: MntConst.eTypeCheckBox },
        { name: 'menu' }
    ];
    public dropdownConfig: any = {
        contactTypeSearch: {
            inputParams: {},
            selected: { id: '', text: '' }
        }
    };
    constructor(injector: Injector, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSCONTACTTYPEMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Contact Type Maintenance';
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.formMode = this.c_s_MODE_UPDATE;
        this.isBtnAdd = true;
        this.isBtnSave = this.isBtnDelete = this.isBtnCancel = false;
        this.setControlValue('WorkingHoursIndSelect', '0');
        this.setControlValue('menu', 'None');
        this.disableControl('EscalationPeriod', true);
        this.disableControl('WarningPeriod', true);
        if (!this.getControlValue('ContactTypeCode')) {
            this['uiForm'].disable();
        }
    }
    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
    }
    private calculateEscalationPeriods(): void {
        if (this.getControlValue('EscalationHours') === '' || this.getControlValue('EscalationHours') === null) {
            this.setControlValue('EscalationHours', '0');
        }
        if (this.getControlValue('EscalationMinutes') === '' || this.getControlValue('EscalationMinutes') === null) {
            this.setControlValue('EscalationMinutes', '0');
        }

        if (this.getControlValue('WarningHours') === '' || this.getControlValue('WarningHours') === null) {
            this.setControlValue('WarningHours', '0');
        }
        if (this.getControlValue('WarningMinutes') === '' || this.getControlValue('WarningMinutes') === null) {
            this.setControlValue('WarningMinutes', '0');
        }

        this.setControlValue('EscalationPeriod', (this.getControlValue('EscalationHours') * 60) + this.getControlValue('EscalationMinutes'));
        this.setControlValue('WarningPeriod', (this.getControlValue('WarningHours') * 60) + this.getControlValue('WarningMinutes'));
        this.isValidStatusEP = false;
        this.isValidStatusWP = false;
        if (!this.getControlValue('EscalationPeriod')) {
            this.isValidStatusEP = true;
            if (this.getControlValue('Escalate') && !this.getControlValue('WarningPeriod')) {
                this.isValidStatusWP = true;
                return;
            }

        }
    }
    private fetchData(): void {
        if (!this.riExchange.validateForm(this.uiForm) && !this.getControlValue('ContactTypeCode')) {
            return;
        }
        else {
            let postSearchParams: any = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '0');
            if (this.parentMode === 'BusinessTriggerDetail' && this.riExchange.getParentHTMLValue('ContactTypeCode')) {
                postSearchParams.set('ContactTypeCode', this.riExchange.getParentHTMLValue('ContactTypeCode'));
            }
            else {
                postSearchParams.set('ContactTypeCode', this.getControlValue('ContactTypeCode'));
            }
            this.ajaxSource.next(this.ajaxconstant.START);
            this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams)
                .subscribe((data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data['fullError']) {
                        if (this.getControlValue('ContactTypeCode') !== null) {
                            this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullError']));
                        }
                        return;
                    }
                    this.setControlValue('ContactTypeSystemDesc', data.ContactTypeSystemDesc);
                    this.setControlValue('EscalationHours', data.EscalationHours);
                    this.setControlValue('EscalationMinutes', data.EscalationMinutes);
                    this.setControlValue('EscalationPeriod', data.EscalationPeriod);
                    this.setControlValue('WarningHours', data.WarningHours);
                    this.setControlValue('WarningMinutes', data.WarningMinutes);
                    this.setControlValue('WarningPeriod', data.WarningPeriod);
                    this.setControlValue('WorkingHoursInd', data.WorkingHoursInd);
                    this.setControlValue('Escalate', this.utils.convertResponseValueToCheckboxInput(data.Escalate));
                    this.setControlValue('AlwaysClose', this.utils.convertResponseValueToCheckboxInput(data.AlwaysClose));
                    this.setControlValue('Prospect', this.utils.convertResponseValueToCheckboxInput(data.Prospect));
                    this.setControlValue('Callout', this.utils.convertResponseValueToCheckboxInput(data.Callout));
                    this.setControlValue('Enquiry', this.utils.convertResponseValueToCheckboxInput(data.Enquiry));
                    this.setControlValue('ClientRetentionDefault', this.utils.convertResponseValueToCheckboxInput(data.ClientRetentionDefault));
                    this.setControlValue('Diary', this.utils.convertResponseValueToCheckboxInput(data.Diary));
                    this.setControlValue('PDAServiceInd', this.utils.convertResponseValueToCheckboxInput(data.PDAServiceInd));
                    this.setControlValue('PDALead', this.utils.convertResponseValueToCheckboxInput(data.PDALead));
                    this.setControlValue('Entitlement', this.utils.convertResponseValueToCheckboxInput(data.Entitlement));
                    this.setControlValue('TermCompetitor', this.utils.convertResponseValueToCheckboxInput(data.TermCompetitor));
                    this.setControlValue('ComplaintInd', this.utils.convertResponseValueToCheckboxInput(data.ComplaintInd));
                    this.isBtnAdd = true;
                    this.isBtnSave = true;
                    this.isBtnDelete = true;
                    this.isBtnCancel = true;
                    this.formMode = this.c_s_MODE_UPDATE;
                    this.setControlValue('WorkingHoursIndSelect', this.getControlValue('WorkingHoursInd'));
                    this.disableControl('EscalationPeriod', true);
                    this.disableControl('WarningPeriod', true);
                    this.isValidStatusEP = false;
                    this.isValidStatusWP = false;
                }, (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error));
                });
        }
    }

    private saveData(): void {
        let postSearchParams: any = this.getURLSearchParamObject();
        let postParams: any = {};
        if (this.formMode === this.c_s_MODE_ADD) {
            postSearchParams.set(this.serviceConstants.Action, '1');
        }
        else {
            postSearchParams.set(this.serviceConstants.Action, '2');
        }
        postParams['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
        postParams['ContactTypeSystemDesc'] = this.getControlValue('ContactTypeSystemDesc');
        postParams['EscalationHours'] = this.getControlValue('EscalationHours');
        postParams['EscalationMinutes'] = this.getControlValue('EscalationMinutes');
        postParams['EscalationPeriod'] = this.getControlValue('EscalationPeriod');
        postParams['WarningHours'] = this.getControlValue('WarningHours');
        postParams['WarningMinutes'] = this.getControlValue('WarningMinutes');
        postParams['WarningPeriod'] = this.getControlValue('WarningPeriod');
        postParams['WorkingHoursInd'] = this.getControlValue('WorkingHoursInd');

        postParams['Escalate'] = this.getControlValue('Escalate') ? 'yes' : 'no';
        postParams['AlwaysClose'] = this.getControlValue('AlwaysClose') ? 'yes' : 'no';
        postParams['Prospect'] = this.getControlValue('Prospect') ? 'yes' : 'no';
        postParams['Callout'] = this.getControlValue('Callout') ? 'yes' : 'no';
        postParams['Enquiry'] = this.getControlValue('Enquiry') ? 'yes' : 'no';
        postParams['ClientRetentionDefault'] = this.getControlValue('ClientRetentionDefault') ? 'yes' : 'no';
        postParams['Diary'] = this.getControlValue('Diary') ? 'yes' : 'no';
        postParams['Entitlement'] = this.getControlValue('Entitlement') ? 'yes' : 'no';
        postParams['PDAServiceInd'] = this.getControlValue('PDAServiceInd') ? 'yes' : 'no';
        postParams['PDALead'] = this.getControlValue('PDALead') ? 'yes' : 'no';
        postParams['TermCompetitor'] = this.getControlValue('TermCompetitor') ? 'yes' : 'no';
        postParams['ComplaintInd'] = this.getControlValue('ComplaintInd') ? 'yes' : 'no';

        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.fullError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                    this.formMode = this.c_s_MODE_UPDATE;

                    this.isBtnAdd = true;
                    this.isBtnSave = true;
                    this.isBtnDelete = true;
                    this.isBtnCancel = true;

                    this.isNewAddField = false;
                    this.isOldAddField = true;

                    this.dropdownConfig.contactTypeSearch.selected = { id: this.getControlValue('ContactTypeCode'), text: this.getControlValue('ContactTypeCode') + ' - ' + this.getControlValue('ContactTypeSystemDesc') };

                    this.disableControl('EscalationPeriod', true);
                    this.disableControl('WarningPeriod', true);
                    this.setControlValue('WorkingHoursIndSelect', this.getControlValue('WorkingHoursInd'));
                    this.dropdownConfig.contactTypeSearch.inputParams = { refresh: true };
                    this.disableControl('menu', false);
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error));
            });
    }
    private canBeSaved(): void {
        if (this.formMode === this.c_s_MODE_ADD && !this.getControlValue('ContactTypeCode')) {
            this.isValidStatusCode = true;
            this.el.nativeElement.querySelector('#ContactTypeCode').classList.add('ng-invalid');
        }
        if (this.getControlValue('EscalationPeriod') === '' || this.getControlValue('EscalationPeriod') === 0) {
            this.isValidStatusEP = true;
            if (this.getControlValue('Escalate') && !this.getControlValue('WarningPeriod')) {
                this.isValidStatusWP = true;
                return;
            }
        }
        else if ((this.getControlValue('Escalate') === true || this.getControlValue('Escalate') === 'yes') && (this.getControlValue('WarningPeriod') === '' || this.getControlValue('WarningPeriod') === 0)) {
            this.isValidStatusWP = true;
            return;
        }
        else {
            this.proceedSave();
        }
    }
    private proceedSave(): void {
        this.isValidStatusEP = false;
        this.isValidStatusWP = false;

        if (this.formMode === this.c_s_MODE_ADD && this.getControlValue('ContactTypeCode') === null) {
            this.isValidStatusCode = true;
            return;
        }
        else {
            if (this.getControlValue('ContactTypeSystemDesc') === '' || this.getControlValue('ContactTypeSystemDesc') === null) {
                this.isValidStatusSD = true;
                return;
            }
            else {
                this.isValidStatusSD = false;
                this.isValidStatusCode = false;
                this.promptContent = MessageConstant.Message.ConfirmRecord;
                this.promptModal.show();
            }
        }

    }
    private riMaintenanceAfterDelete(): void {
        this.disableControl('EscalationPeriod', true);
        this.disableControl('WarningPeriod', true);
        let search: any = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '3');
        let postParams: any = {};
        postParams['ContactTypeCode'] = this.getControlValue('ContactTypeCode');
        postParams['TABLE'] = 'ContactType';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, postParams)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data['fullError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(data['errorMessage'], data['fullerror']));
                    this.formMode = this.c_s_MODE_UPDATE;
                    this.isBtnAdd = true;
                    this.isBtnSave = true;
                    this.isBtnDelete = true;
                    this.isBtnCancel = true;
                    return;
                }
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                this.formMode = this.c_s_MODE_UPDATE;
                this.isBtnAdd = true;
                this.isBtnSave = false;
                this.isBtnDelete = false;
                this.isBtnCancel = false;
                this.setControlValue('WorkingHoursIndSelect', '0');
                this.uiForm.reset();
                this.dropdownConfig.contactTypeSearch.selected = { id: '', text: '' };
                this.dropdownConfig.contactTypeSearch.inputParams = { refresh: true };
                this.setControlValue('menu', 'None');
                if (!this.getControlValue('ContactTypeCode')) {
                    this['uiForm'].disable();
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }
    public onChangeContactTypeCode(data: any): void {
        this.setControlValue('ContactTypeCode', data.ContactTypeCode);
        if (this.formMode === this.c_s_MODE_UPDATE && this.getControlValue('ContactTypeCode') !== '' && this.getControlValue('ContactTypeCode') !== null) {
            this['uiForm'].enable();
            this.fetchData();
            this.disableControl('EscalationPeriod', true);
            this.disableControl('WarningPeriod', true);
        }
    }
    public addMode(): void {
        this['uiForm'].enable();
        this.isNewAddField = true;
        this.isOldAddField = false;
        this.uiForm.reset();
        this.formMode = this.c_s_MODE_ADD;
        this.isBtnAdd = false;
        this.isBtnSave = true;
        this.isBtnDelete = false;
        this.isBtnCancel = true;
        this.setControlValue('WorkingHoursIndSelect', '0');
        this.setControlValue('menu', 'None');
        this.disableControl('EscalationPeriod', true);
        this.disableControl('WarningPeriod', true);
        this.disableControl('menu', true);
        this.isValidStatusEP = false;
        this.isValidStatusWP = false;
        this.dropdownConfig.contactTypeSearch.selected = { id: '', text: '' };
        setTimeout(() => {
            if (this.isNewAddField) {
                this.formContactTypeCode.nativeElement.focus();
            }
        }, 0);

    }
    public onSave(): void {
        this.disableControl('EscalationPeriod', true);
        this.disableControl('WarningPeriod', true);
        this.setControlValue('WorkingHoursInd', this.getControlValue('WorkingHoursIndSelect'));
        this.calculateEscalationPeriods();
        this.canBeSaved();
    }
    public onChangeOption(): void {
        if (this.getControlValue('menu') === 'contactstatus') {
            alert('iCABSSContactTypeContactStatusGrid.html : Page not developed yet');
            // this.navigate('ContactType', 'iCABSSContactTypeContactStatusGrid', {
            //     'parentMode': 'ContactType'
            // });
        }
    }
    public onCancel(): void {
        if (this.formMode === this.c_s_MODE_ADD) {
            this.uiForm.reset();
            this.isNewAddField = false;
            this.isOldAddField = true;
            this.isBtnAdd = true;
            this.isBtnSave = false;
            this.isBtnDelete = false;
            this.isBtnCancel = false;
            this.setControlValue('WorkingHoursIndSelect', '0');
            this.setControlValue('menu', 'None');
            this.setControlValue('WorkingHoursIndSelect', this.getControlValue('WorkingHoursInd'));
            this.dropdownConfig.contactTypeSearch.selected = { id: '', text: '' };
            this.formMode = this.c_s_MODE_UPDATE;
            this.isValidStatusSD = false;
            this.isValidStatusEP = false;
            this.isValidStatusWP = false;
            if (!this.getControlValue('ContactTypeCode')) {
                this['uiForm'].disable();
            }
            this.fetchData();

        }
        if (this.formMode === this.c_s_MODE_UPDATE) {
            this.isNewAddField = false;
            this.isOldAddField = true;
            this.fetchData();
        }
    }
    public confirmed(obj: any): void {
        if (this.formMode === 'DELETE') {
            this.riMaintenanceAfterDelete();
        }
        else {
            this.saveData();
        }
    }
    public onDelete(): void {
        this.promptContent = MessageConstant.Message.DeleteRecord;
        this.promptModal.show();
        this.formMode = 'DELETE';
    }
    public onBlurEscalationHours(): void {
        this.calculateEscalationPeriods();
    }
    public onBlurEscalationMinutes(): void {
        this.calculateEscalationPeriods();
    }
    public onBlurWarningHours(): void {
        this.calculateEscalationPeriods();
    }
    public onBlurWarningMinutes(): void {
        this.calculateEscalationPeriods();
    }
    public canDeactivate(): Observable<boolean> {
        this.routeAwayGlobals.setSaveEnabledFlag(this.uiForm.dirty);
        if (this.routeAwayComponent) {
            return this.routeAwayComponent.canDeactivate();
        }
    }
    public onBlurContactTypeCode(): void {
        this.isValidStatusCode = !this.getControlValue('ContactTypeCode') ? true : false;
    }
}

