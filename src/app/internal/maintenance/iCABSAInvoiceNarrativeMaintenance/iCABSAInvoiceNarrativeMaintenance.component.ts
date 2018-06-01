import { Component, OnInit, ViewChild, NgZone, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';
import { Location } from '@angular/common';
import { Logger } from '@nsalaun/ng2-logger';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { LookUp } from './../../../../shared/services/lookup';
import { Utils } from '../../../../shared/services/utility';
import { LocaleTranslationService } from '../../../../shared/services/translation.service';
import { ComponentInteractionService } from '../../../../shared/services/component-interaction.service';
import { HttpService } from '../../../../shared/services/http-service';
import { RiExchange } from '../../../../shared/services/riExchange';
import { MessageService } from './../../../../shared/services/message.service';
import { GlobalConstant } from '../../../../shared/constants/global.constant';
import { RouteAwayComponent } from '../../../../shared/components/route-away/route-away';
import { RouteAwayGlobals } from '../../../../shared/services/route-away-global.service';

@Component({
    templateUrl: 'iCABSAInvoiceNarrativeMaintenance.html'
})

export class InvoiceNarrativeMaintenanceComponent implements OnInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModalSave') public promptModalSave;
    @ViewChild('promptModalDelete') public promptModalDelete;

    //Page Variables
    private sub: Subscription;
    private subLookUpAccount: Subscription;
    private subLookUpInvoice: Subscription;
    private subLookUpContract: Subscription;
    private subLookUpPremise: Subscription;
    private xhrFetch: Subscription;
    private xhrPost: Subscription;
    private xhrAdd: Subscription;
    private xhrUpdate: Subscription;
    private xhrDelete: Subscription;
    private routeParams: any;
    private vBusinessCode: string;
    private mode: string = 'ADD';
    public promptTitle: string = 'Confirm';
    public promptContentSave: string = 'Confirm Record?';
    public promptContentDelete: string = 'Delete Record?';
    private invoiceNarrativeText = '';
    public backLinkText: string = '';
    public backLinkUrl: string = '';

    private xhrParams = {
        module: 'contract-admin',
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAInvoiceNarrativeMaintenance'
    };

    //Ui Fields
    public uiDisplay = {
        pageHeader: 'Invoice Narrative Maintenance',
        AccountNumber: true,
        InvoiceGroupNumber: true,
        ContractNumber: true,
        PremiseNumber: true,
        oper: {
            add: false,
            update: false,
            delete: false,
            save: false,
            cancel: false
        },
        readOnly: {
            AccountNumber: true,
            AccountName: true,
            InvoiceGroupNumber: true,
            InvoiceGroupDesc: true,
            ContractNumber: true,
            ContractName: true,
            PremiseNumber: true,
            PremiseName: true
        }
    };
    public uiForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private serviceConstants: ServiceConstants,
        private translate: LocaleTranslationService,
        private componentInteractionService: ComponentInteractionService,
        private fb: FormBuilder,
        private router: Router,
        private utils: Utils,
        private LookUp: LookUp,
        private logger: Logger,
        private xhr: HttpService,
        private messageService: MessageService,
        private zone: NgZone,
        private riExchange: RiExchange,
        private location: Location,
        private routeAwayGlobals: RouteAwayGlobals
    ) {
        this.utils.setTitle(this.uiDisplay.pageHeader);
    }

    ngOnInit(): void {
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.componentInteractionService.emitMessage(false);
        this.promptContentSave = MessageConstant.Message.ConfirmRecord;
        this.promptContentDelete = MessageConstant.Message.DeleteRecord;
        this.vBusinessCode = this.utils.getBusinessCode();
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
        this.riExchange.getStore('contract'); //TODO - should be based on parent mode
        this.uiForm = this.fb.group({
            InvoiceNarrativeText: [{ value: '' }, Validators.required]
        });
        this.initForm();

        this.translate.setUpTranslation();

        this.window_onload();
    }

    ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
        if (this.subLookUpAccount) { this.subLookUpAccount.unsubscribe(); }
        if (this.subLookUpInvoice) { this.subLookUpInvoice.unsubscribe(); }
        if (this.subLookUpContract) { this.subLookUpContract.unsubscribe(); }
        if (this.subLookUpPremise) { this.subLookUpPremise.unsubscribe(); }
        if (this.xhrFetch) { this.xhrFetch.unsubscribe(); }
        if (this.xhrPost) { this.xhrPost.unsubscribe(); }
        if (this.xhrAdd) { this.xhrAdd.unsubscribe(); }
        if (this.xhrUpdate) { this.xhrUpdate.unsubscribe(); }
        if (this.xhrDelete) { this.xhrDelete.unsubscribe(); }
        this.riExchange.killStore();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    private initForm(): void {
        let controls = [
            'AccountNumber',
            'AccountName',
            'InvoiceGroupNumber',
            'InvoiceGroupDesc',
            'ContractNumber',
            'ContractName',
            'PremiseNumber',
            'PremiseName',
            'InvoiceNarrativeText',
            'InvoiceNarrative'
        ];

        for (let i = 0; i < controls.length; i++) {
            this.riExchange.riInputElement.Add(this.uiForm, controls[i]);
        }
    }

    private window_onload(): void {
        let ContractObject = { type: '', label: '' };
        ContractObject.type = this.utils.getCurrentContractType(this.routeParams.currentContractTypeURLParameter);
        ContractObject.label = this.utils.getCurrentContractLabel(ContractObject.type);

        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'AccountNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'AccountName'));
        this.doLookupAccount();

        let ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'InvoiceGroup':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceGroupNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupDesc', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceGroupDesc'));
                this.uiDisplay.ContractNumber = false;
                this.uiDisplay.PremiseNumber = false;
                this.doLookupInvoiceGroup();
                break;
            case 'Contract':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractName'));
                this.uiDisplay.InvoiceGroupNumber = false;
                this.uiDisplay.PremiseNumber = false;
                this.doLookupContract();
                break;
            case 'Premise':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceGroupNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupDesc', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceGroupDesc'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseName'));
                this.doLookupInvoiceGroup();
                this.doLookupContract();
                this.doLookupPremise();
                break;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNarrativeText', this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'InvoiceNarrativeText'));

        this.fetchRecord();
    }

    private doLookupAccount(): void {
        let lookupIP_details = [{
            'table': 'Account',
            'query': {
                'BusinessCode': this.vBusinessCode,
                'AccountNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')
            },
            'fields': ['AccountNumber', 'AccountName']
        }];

        this.subLookUpAccount = this.LookUp.lookUpRecord(lookupIP_details).subscribe((data) => {
            if (data.length > 0) {
                let record = data[0];
                if (record.length > 0) {
                    let resp = record[0];
                    if (resp.hasOwnProperty('AccountName')) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', resp['AccountName']);
                    }
                }
            }
        });
    }

    private doLookupInvoiceGroup(): void {
        let lookupIP_details = [{
            'table': 'InvoiceGroup',
            'query': {
                'BusinessCode': this.vBusinessCode,
                'AccountNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'),
                'InvoiceGroupNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber')
            },
            'fields': ['AccountNumber', 'InvoiceGroupNumber', 'InvoiceGroupDesc']
        }];

        this.subLookUpInvoice = this.LookUp.lookUpRecord(lookupIP_details).subscribe((data) => {
            if (data.length > 0) {
                let record = data[0];
                if (record.length > 0) {
                    let resp = record[0];
                    if (resp.hasOwnProperty('InvoiceGroupDesc')) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceGroupDesc', resp['InvoiceGroupDesc']);
                    }
                }
            }
        });
    }

    private doLookupContract(): void {
        let lookupIP_details = [{
            'table': 'Contract',
            'query': {
                'BusinessCode': this.vBusinessCode,
                'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
            },
            'fields': ['ContractNumber', 'ContractName']
        }];

        this.subLookUpContract = this.LookUp.lookUpRecord(lookupIP_details).subscribe((data) => {
            if (data.length > 0) {
                let record = data[0];
                if (record.length > 0) {
                    let resp = record[0];
                    if (resp.hasOwnProperty('ContractName')) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', resp['ContractName']);
                    }
                }
            }
        });
    }

    private doLookupPremise(): void {
        let lookupIP_details = [{
            'table': 'Premise',
            'query': {
                'BusinessCode': this.vBusinessCode,
                'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
            },
            'fields': ['PremiseNumber', 'PremiseName']
        }];

        this.subLookUpPremise = this.LookUp.lookUpRecord(lookupIP_details).subscribe((data) => {
            if (data.length > 0) {
                let record = data[0];
                if (record.length > 0) {
                    let resp = record[0];
                    if (resp.hasOwnProperty('PremiseName')) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', resp['PremiseName']);
                    }
                }
            }
        });
    }

    public fetchRecord(): void {
        let xhrParams = {};
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'));

        let ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'InvoiceGroup':
                search.set('invoiceGroupNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'));
                break;
            case 'Contract':
                search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                break;
            case 'Premise':
                search.set('invoiceGroupNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber'));
                search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                search.set('premiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
                break;
        }

        this.xhrFetch = this.xhr.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                if (data.RecordFound === 'yes') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', data.AccountName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNarrativeText', data.InvoiceNarrativeText);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNarrative', data.InvoiceNarrative);
                    if (data.InvoiceNarrativeText) {
                        this.invoiceNarrativeText = data.InvoiceNarrativeText;
                        this.mode = 'EDIT';
                        this.uiDisplay.oper.delete = true;
                    } else {
                        this.mode = 'ADD';
                        this.uiDisplay.oper.delete = false;
                    }
                }
                this.uiDisplay.oper.add = false;
                this.uiDisplay.oper.update = false;
                this.uiDisplay.oper.save = true;
                this.uiDisplay.oper.cancel = true;
            });
    }

    private getFormData(): any {
        let formData = {};
        formData['AccountNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber');
        formData['InvoiceNarrativeText'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNarrativeText');
        formData['ROWID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNarrative');

        let ParentMode = this.riExchange.ParentMode(this.routeParams);
        switch (ParentMode) {
            case 'InvoiceGroup':
                formData['invoiceGroupNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber');
                break;
            case 'Contract':
                formData['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                break;
            case 'Premise':
                formData['invoiceGroupNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceGroupNumber');
                formData['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                formData['premiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                break;
        }
        return formData;
    }

    public addRecord(): void {
        this.mode = 'ADD';
        this.uiDisplay.oper.add = false;
        this.uiDisplay.oper.update = false;
        this.uiDisplay.oper.delete = false;
        this.uiDisplay.oper.save = true;
        this.uiDisplay.oper.cancel = true;
    }

    public onCancel(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNarrativeText', this.invoiceNarrativeText);
        /*if (this.mode === 'EDIT') {
            this.uiDisplay.oper.update = true;
            this.uiDisplay.oper.delete = true;
            this.uiDisplay.oper.add = false;
        } else {
            this.uiDisplay.oper.update = false;
            this.uiDisplay.oper.delete = false;
            this.uiDisplay.oper.add = true;
        }
        this.uiDisplay.oper.save = false;
        this.uiDisplay.oper.cancel = false;*/
    }

    public onSubmit(): void {
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.promptModalSave.show();
    }

    public promptSave(event: any): void {
        let resp = this.doPost(this.mode);
        this.xhrUpdate = resp.subscribe(
            (data) => {
                if (data.hasOwnProperty('errorMessage')) {
                    this.showAlert('Error: ' + data.errorMessage);
                } else {
                    this.invoiceNarrativeText = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNarrativeText');
                    let ROWID = data.ttInvoiceNarrative;
                    if (data.InvoiceNarrative) ROWID = data.InvoiceNarrative;
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNarrative', ROWID);
                    /*this.uiDisplay.oper.add = false;
                    this.uiDisplay.oper.update = true;*/
                    this.uiDisplay.oper.delete = true;
                    this.uiDisplay.oper.save = true;
                    this.uiDisplay.oper.cancel = true;
                }
            }
        );
    }

    public promptDelete(event: any): void {
        let resp = this.doPost('DEL');
        this.xhrDelete = resp.subscribe(
            (data) => {
                if (data.hasOwnProperty('errorMessage')) {
                    this.showAlert('Error: ' + data.errorMessage);
                } else {
                    this.invoiceNarrativeText = '';
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNarrativeText', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNarrative', '');
                    this.uiDisplay.oper.add = false;
                    this.uiDisplay.oper.update = false;
                    this.uiDisplay.oper.delete = false;
                    this.uiDisplay.oper.save = true;
                    this.uiDisplay.oper.cancel = true;
                }
            }
        );
    }

    public deleteRecord(): void {
        this.promptModalDelete.show();
    }

    private doPost(mode: string): any {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let action = '0';
        switch (mode) {
            case 'ADD': action = '1'; this.mode = 'EDIT'; break;
            case 'EDIT': action = '2'; break;
            case 'DEL': action = '3'; this.mode = 'ADD'; break;
        }
        let xhrParams = {};
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.Action, action);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        let formData = this.getFormData();

        this.xhrPost = this.xhr.makePostRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search,
            formData
        ).subscribe(res => retObj.next(res));
        return retObj;
    }

    private showAlert(msgTxt: string): void {
        this.messageModal.show({ msg: msgTxt, title: 'Message' }, false);
    }

    public updateRecord(): void {
        this.mode = 'EDIT';
        this.uiDisplay.oper.add = false;
        this.uiDisplay.oper.update = false;
        this.uiDisplay.oper.delete = false;
        this.uiDisplay.oper.save = true;
        this.uiDisplay.oper.cancel = true;
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    /*
    *   Alerts user when user is moving away without saving the changes. //CR implementation
    */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }
    public routeAwayUpdateSaveFlag(): void {
        let flag = this.riExchange.riInputElement.HasChanged(this.uiForm, 'InvoiceNarrativeText');
        if (flag) {
            this.routeAwayGlobals.setSaveEnabledFlag(true);
        } else {
            this.routeAwayGlobals.setSaveEnabledFlag(false);
        }
    }
}
