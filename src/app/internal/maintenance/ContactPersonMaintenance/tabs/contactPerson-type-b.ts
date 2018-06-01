import { URLSearchParams } from '@angular/http';
import { ContactActionTypes } from './../../../../actions/contact';
import { RiExchange } from './../../../../../shared/services/riExchange';
import { Utils } from './../../../../../shared/services/utility';
import { HttpService } from './../../../../../shared/services/http-service';
import { AjaxObservableConstant } from './../../../../../shared/constants/ajax-observable.constant';
import { ServiceConstants } from './../../../../../shared/constants/service.constants';
import { SpeedScriptConstants } from './../../../../../shared/constants/speed-script.constant';
import { LocaleTranslationService } from './../../../../../shared/services/translation.service';
import { BehaviorSubject } from 'rxjs/Rx';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DropdownStaticComponent } from './../../../../../shared/components/dropdown-static/dropdownstatic';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import { MntConst } from '../../../../../shared/services/riMaintenancehelper';
@Component({
    selector: 'icabs-contact-person-type-b',
    templateUrl: 'contactPerson-type-b.html'
})

export class ContactPersonTypeBComponent implements OnInit, OnDestroy {

    @ViewChild('AddPortfolioRoleLevelSelect') addPortfolioLevelDropdown: DropdownStaticComponent;
    @ViewChild('ChangeTypeIDSelect') changeTypeIDDropdown: DropdownStaticComponent;
    @ViewChild('ContactPerson') contactPerson: Input;

    public storeSubscription: Subscription;
    public contactDetailsFormGroup: FormGroup = new FormGroup({});
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;

    public headerParams: any = {
        method: 'ccm/maintenance',
        module: 'customer',
        operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
    };

    //Main Page Params
    private prevMode: string;
    private hasError: boolean = false;
    public cUpdateMode: string;
    public btnMode: string;
    private lRefreshContactRole: Boolean;
    private glSCCapitalFirstLtr: any;
    private iContactPersonAddCount: any;
    private dropdownFlag: boolean = false;

    public effectiveFromDateRequired: boolean = false;
    public contactPersonNameRequired: boolean = false;
    public contactPersonPositionRequired: boolean = false;
    public contactPersonTelephoneRequired: boolean = false;

    //Model
    public changeTypeIDArray: Array<Object> = [];
    public portfolioRoles: Array<Object> = [];
    public saveContactPersonID: string;
    public saveLastUpdateDate: string;
    public saveLastUpdateTime: string;
    public saveLastUpdateUserName: string;
    public saveEffectiveFromDate: string;
    public saveContactPersonName: string;
    public saveContactPersonPosition: string;
    public saveContactPersonDepartment: string;
    public saveContactPersonNotes: string;
    public saveContactPersonTelephone: string;
    public saveContactPersonMobile: string;
    public saveContactPersonEmail: string;
    public saveContactPersonFax: string;
    public saveContactPersonHighPortfolioLevel: string;
    public contactPersonHighPortfolioLevel: string;

    public changeTypeIDSelectDisabled: Boolean = true;
    public showAddPortfolioLevel: Boolean = false;

    private pageParams: any = {};
    private storeFieldValues: any = {};

    constructor(
        private fb: FormBuilder,
        private store: Store<any>,
        private riExchange: RiExchange,
        private utils: Utils,
        private httpService: HttpService,
        private ajaxconstant: AjaxObservableConstant,
        private serviceConstants: ServiceConstants,
        private speedScriptConstants: SpeedScriptConstants,
        private localeTranslateService: LocaleTranslationService
        ) { }

    ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.localeTranslateService.setUpTranslation();
        this.iContactPersonAddCount = 0;
        this.storeSubscription = this.store.select('contact').subscribe(data => {
            switch (data['action']) {
                case ContactActionTypes.SAVE_SYSCHAR:
                    if (data !== null && data['sysChar'] && !(Object.keys(data['sysChar']).length === 0 && data['sysChar'].constructor === Object)) {
                        this.glSCCapitalFirstLtr = data['sysChar'].glSCCapitalFirstLtr;
                    }
                    break;
                case ContactActionTypes.SAVE_FIELD:
                    if (data !== null && data['fieldValue'] && !(Object.keys(data['fieldValue']).length === 0 && data['fieldValue'].constructor === Object)) {
                        this.storeFieldValues = data['fieldValue'];
                        if (this.cUpdateMode !== 'ADD') {
                            this.updateFieldValues(data['fieldValue']);
                        } else {
                            this.addPortfolioLevelDropdown.selectedItem = this.storeFieldValues.AddPortfolioLevelSelect;
                        }
                    }
                    break;
                case ContactActionTypes.SAVE_PARAMS:
                    if (data !== null && data['params'] && !(Object.keys(data['params']).length === 0 && data['params'].constructor === Object)) {
                        this.pageParams = data['params'];
                        this.hasError = data['params'].formError;
                        this.prevMode = this.cUpdateMode;
                        this.cUpdateMode = data['params'].cUpdateMode;
                        this.btnMode = data['params'].btnMode;
                        this.setUpdateMode();
                    }
                    break;
            }
        });

        this.initForm();
        this.loadDropDown();
    }
    //Page Destroy
    public ngOnDestroy(): void {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }

    private initForm(): void {
        this.contactDetailsFormGroup = this.fb.group({});
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonID');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'EffectiveFromDate');

        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'LastUpdateDate');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'LastUpdateTime');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'LastUpdateUserName');

        if (this.glSCCapitalFirstLtr) {
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonName');
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonPosition');
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonDepartment');
        } else {
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonName');
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonPosition');
            this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonDepartment');
        }
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonNotes');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonTelephone');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonMobile');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonEmail');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ContactPersonFax');

        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonID');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'EffectiveFromDate');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'LastUpdateDate');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'LastUpdateTime');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'LastUpdateUserName');

        //this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ChangeTypeID');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ChangeContactPersonID');
        this.riExchange.riInputElement.Add(this.contactDetailsFormGroup, 'ChangeTypeEffectiveDate');

        //this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ChangeTypeID');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ChangeContactPersonID');
        this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ChangeTypeEffectiveDate');

        this.store.dispatch({
            type: ContactActionTypes.SET_FORM_GROUPS, payload: {
                name: 'contactDetails',
                form: this.contactDetailsFormGroup
            }
        });
    }

    private loadDropDown(): void {
        this.portfolioRoles = [{
            value: this.speedScriptConstants.CNFPortfolioLevelGroupAccount,
            text: 'This Group Account'
        }, {
            value: this.speedScriptConstants.CNFPortfolioLevelAccount,
            text: 'This Account'
        }, {
            value: this.speedScriptConstants.CNFPortfolioLevelIGInvoice,
            text: 'This Invoice Group (Invoice)'
        }, {
            value: this.speedScriptConstants.CNFPortfolioLevelIGStatement,
            text: 'This Invoice Group (Statement)'
        }, {
            value: this.speedScriptConstants.CNFPortfolioLevelContract,
            text: 'This Contract'
        }, {
            value: this.speedScriptConstants.CNFPortfolioLevelPremise,
            text: 'This Premise'
        }];

        this.changeTypeIDArray = [{
            value: '0',
            text: 'Contact Details'
        }, {
            value: '1',
            text: 'Replaces This Contact'
        }];

    }

    private getFieldValues(): Object {
        return {
            'ContactPersonID': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonID', MntConst.eTypeInteger),
            'LastUpdateDate': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'LastUpdateDate', MntConst.eTypeDate),
            'LastUpdateTime': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'LastUpdateTime', MntConst.eTypeTime),
            'LastUpdateUserName': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'LastUpdateUserName', MntConst.eTypeTextFree),
            'EffectiveFromDate': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'EffectiveFromDate', MntConst.eTypeDate),
            'ContactPersonName': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonName'),
            'ContactPersonPosition': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonPosition'),
            'ContactPersonDepartment': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonDepartment'),
            'ContactPersonNotes': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonNotes'),
            'ContactPersonTelephone': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonTelephone'),
            'ContactPersonMobile': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonMobile'),
            'ContactPersonEmail': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonEmail'),
            'ContactPersonFax': this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, 'ContactPersonFax')
        };
    }

    private setUpdateMode(): void {
        let fieldParams: Object = {};

        switch (this.cUpdateMode) {
            case 'NEUTRAL':
                this.effectiveFromDateRequired = false;
                this.contactPersonNameRequired = false;
                this.contactPersonPositionRequired = false;
                this.contactPersonTelephoneRequired = false;

                this.contactDetailsFormGroup.markAsUntouched();
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonID');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'EffectiveFromDate');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonName');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonPosition');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonDepartment');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonNotes');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonTelephone');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonMobile');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonEmail');
                this.riExchange.riInputElement.Disable(this.contactDetailsFormGroup, 'ContactPersonFax');

                if (this.btnMode === 'Abandon') {
                    this.btnMode = 'None';
                    this.restoreCurrentContactFields();
                }

                break;

            case 'ADD':
                this.lRefreshContactRole = true;

                this.storeCurrentContactFields();
                if (this.cUpdateMode === 'ADD') {
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonID', 0);
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateDate', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateTime', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateUserName', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'EffectiveFromDate', '');

                    let d = new Date();
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'EffectiveFromDate', this.utils.formatDate(d));
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonName', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonPosition', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonNotes', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonNotes', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonTelephone', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonMobile', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonEmail', '');
                    this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonFax', '');
                }
                this.effectiveFromDateRequired = true;
                this.contactPersonNameRequired = true;

                if (this.storeFieldValues['PositionMandatory'] === 'Y') {
                    this.contactPersonPositionRequired = true;
                }
                else {
                    this.contactPersonPositionRequired = false;
                }
                if (this.storeFieldValues['TelephoneMandatory'] === 'Y') {
                    this.contactPersonTelephoneRequired = true;
                }
                else {
                    this.contactPersonTelephoneRequired = false;
                }

                //Call riExchange.riInputElement.Enable('EffectiveFromDate') - phase 1 don't allow update of effectivefromdate
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonName');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonPosition');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonDepartment');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonNotes');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonTelephone');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonMobile');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonEmail');
                this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonFax');

                //call EffectiveFromDate.Focus - phase 1 don't allow update of effectivefromdate
                //this.addPortfolioLevelSelect.Focus
                break;

            case 'UPDATE':
                if (!this.hasError) {
                    this.lRefreshContactRole = true;
                    this.storeCurrentContactFields();
                    this.effectiveFromDateRequired = true;
                    this.contactPersonNameRequired = true;

                    if (this.storeFieldValues.PositionMandatory === 'Y') {
                        this.contactPersonPositionRequired = true;
                    } else {
                        this.contactPersonPositionRequired = false;
                    }

                    if (this.storeFieldValues.TelephoneMandatory === 'Y') {
                        this.contactPersonTelephoneRequired = true;
                    } else {
                        this.contactPersonTelephoneRequired = false;
                    }

                    this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonName');
                    this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonPosition');
                    this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonDepartment');
                    this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonNotes');
                    this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonTelephone');
                    this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonMobile');
                    this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonEmail');
                    this.riExchange.riInputElement.Enable(this.contactDetailsFormGroup, 'ContactPersonFax');

                    this.selectContactPerson();
                } else {
                    this.hasError = false;
                    this.riExchange.riInputElement.markAsError(this.contactDetailsFormGroup, this.pageParams.errorField);
                }
                //this.contactPerson.focus();
                break;
        }

        this.riExchange.riInputElement.SetRequiredStatus(this.contactDetailsFormGroup, 'EffectiveFromDate', this.effectiveFromDateRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactDetailsFormGroup, 'ContactPersonName', this.contactPersonNameRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactDetailsFormGroup, 'ContactPersonPosition', this.contactPersonPositionRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactDetailsFormGroup, 'ContactPersonTelephone', this.contactPersonTelephoneRequired);

    }

    public updateFieldValues(storeData: any): void {
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonID', storeData.ContactPersonID);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateDate', storeData.LastUpdateDate);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateTime', storeData.LastUpdateTime);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateUserName', storeData.LastUpdateUserName);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'EffectiveFromDate', storeData.EffectiveFromDate);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonName', storeData.ContactPersonName);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonPosition', storeData.ContactPersonPosition);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonDepartment', storeData.ContactPersonDepartment);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonNotes', storeData.ContactPersonNotes);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonTelephone', storeData.ContactPersonTelephone);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonMobile', storeData.ContactPersonMobile);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonEmail', storeData.ContactPersonEmail);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonFax', storeData.ContactPersonFax);
    }

    public storeCurrentContactFields(): void {
        let _fieldValues: any = this.getFieldValues();
        this.saveContactPersonID = _fieldValues.ContactPersonID;
        this.saveLastUpdateDate = _fieldValues.LastUpdateDate;
        this.saveLastUpdateTime = _fieldValues.LastUpdateTime;
        this.saveLastUpdateUserName = _fieldValues.LastUpdateUserName;
        this.saveEffectiveFromDate = _fieldValues.EffectiveFromDate;
        this.saveContactPersonName = _fieldValues.ContactPersonName;
        this.saveContactPersonPosition = _fieldValues.ContactPersonPosition;
        this.saveContactPersonDepartment = _fieldValues.ContactPersonDepartment;
        this.saveContactPersonNotes = _fieldValues.ContactPersonNotes;
        this.saveContactPersonTelephone = _fieldValues.ContactPersonTelephone;
        this.saveContactPersonMobile = _fieldValues.ContactPersonMobile;
        this.saveContactPersonEmail = _fieldValues.ContactPersonEmail;
        this.saveContactPersonFax = _fieldValues.ContactPersonFax;
        this.saveContactPersonHighPortfolioLevel = this.contactPersonHighPortfolioLevel;

    }

    public restoreCurrentContactFields(): void {
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonID', this.saveContactPersonID);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateDate', this.saveLastUpdateDate);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateTime', this.saveLastUpdateTime);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'LastUpdateUserName', this.saveLastUpdateUserName);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'EffectiveFromDate', this.saveEffectiveFromDate);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonName', this.saveContactPersonName);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonPosition', this.saveContactPersonPosition);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonDepartment', this.saveContactPersonDepartment);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonNotes', this.saveContactPersonNotes);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonTelephone', this.saveContactPersonTelephone);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonMobile', this.saveContactPersonMobile);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonEmail', this.saveContactPersonEmail);
        this.riExchange.riInputElement.SetValue(this.contactDetailsFormGroup, 'ContactPersonFax', this.saveContactPersonFax);
        this.contactPersonHighPortfolioLevel = this.saveContactPersonHighPortfolioLevel;
    }
    public updateStoreValue(e: any): void {

        for (let key in this.contactDetailsFormGroup.controls) {
            if (key) {
                let targetValue = this.riExchange.riInputElement.GetValue(this.contactDetailsFormGroup, key);
                this.storeFieldValues[key] = targetValue;
            }
        }

        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
    }

    public selectContactPerson(): void {
        let _fieldValue: any = this.getFieldValues();
        let time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '6');

        let bodyParams = {};
        bodyParams['Function'] = 'ContactPersonSelect';
        bodyParams['ContactPersonID'] = _fieldValue.ContactPersonID;
        bodyParams['DTE'] = this.utils.formatDate(new Date());
        bodyParams['Time'] = this.utils.hmsToSeconds(time);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.ErrorMessage) {
                    this.pageParams.hasError = true;
                    this.pageParams.errorMessage = data.ErrorMessage;
                    this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
                    return;
                }
                this.updateFieldValues(data);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public addPortfolioLevelSelect_OnChange(selectedItem: any): void {
        if (this.dropdownFlag) {
            this.store.dispatch({
                type: ContactActionTypes.SAVE_FIELD_PARAMS, payload: {
                    'cSelectValue': selectedItem
                }
            });
        }
        this.dropdownFlag = true;
    }


}
