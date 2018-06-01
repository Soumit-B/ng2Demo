import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';
import { ContactPersonTypeBComponent } from './../../maintenance/ContactPersonMaintenance/tabs/contactPerson-type-b';
import { ContactPersonTypeCComponent } from './../../maintenance/ContactPersonMaintenance/tabs/contactPerson-type-c';
import { ContactPersonTypeAComponent } from './../../maintenance/ContactPersonMaintenance/tabs/contactPerson-type-a';
import { ContactActionTypes } from './../../../actions/contact';
import { GlobalConstant } from './../../../../shared/constants/global.constant';
import { LocaleTranslationService } from './../../../../shared/services/translation.service';
import { RouteAwayGlobals } from './../../../../shared/services/route-away-global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RiExchange } from './../../../../shared/services/riExchange';
import { Store } from '@ngrx/store';
import { ErrorService } from './../../../../shared/services/error.service';
import { MessageService } from './../../../../shared/services/message.service';
import { SpeedScriptConstants } from './../../../../shared/constants/speed-script.constant';
import { SysCharConstants } from './../../../../shared/constants/syscharservice.constant';
import { ServiceConstants } from './../../../../shared/constants/service.constants';
import { AjaxObservableConstant } from './../../../../shared/constants/ajax-observable.constant';
import { HttpService } from './../../../../shared/services/http-service';
import { Utils } from './../../../../shared/services/utility';
import { Logger } from '@nsalaun/ng2-logger';
import { GroupAccountNumberComponent } from './../../search/iCABSSGroupAccountNumberSearch';
import { InvoiceGroupGridComponent } from './../../grid-search/iCABSAInvoiceGroupGrid';
import { AccountSearchComponent } from './../../search/iCABSASAccountSearch';
import { ContractSearchComponent } from './../../search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../search/iCABSAPremiseSearch';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TabsComponent } from './../../../../shared/components/tabs/tabs';
import { DropdownStaticComponent } from './../../../../shared/components/dropdown-static/dropdownstatic';
import { Component, OnInit, OnDestroy, ViewChild, NgZone } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSCMContactPersonMaintenance.html'
})

export class ContactPersonMaintenanceComponent implements OnInit, OnDestroy {
    @ViewChild('ViewLevelSelect') viewLevelDropdown: DropdownStaticComponent;
    @ViewChild('ContactPersonRoleSelect') contactPersonRoleDropdown: DropdownStaticComponent;
    @ViewChild('Menu') menu: DropdownStaticComponent;
    @ViewChild('ContactPersonTabs') riTab: TabsComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;

    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public dropdownFlag: boolean = true;
    public contactPersonFormGroup: FormGroup = new FormGroup({});
    public storeData: any;
    public parentMode: string;
    public tabs: Array<any> = [];
    public tabComponentList: Array<any> = [];

    public querySysChar: URLSearchParams = new URLSearchParams();
    public pageSearchParams: URLSearchParams = new URLSearchParams();

    public storeSubscription: Subscription;
    public messageSubscription: Subscription;
    public errorSubscription: Subscription;
    public storeParams: Object = {};
    public storeFormGroup: any = {};
    public ajaxSource = new BehaviorSubject<any>(0);
    public ajaxSource$;

    public iNumberOfRoles: any;
    public lAllowChooseContact: boolean;
    public cInitialLevel: any;
    public lInitiating: any;
    public iContactPersonAddCount: any;
    public cUpdateMode: any;
    public btnMode: any;
    public currentDate: any;
    public currentTime: any;

    public lUpdateMode: any;
    public lRefreshContact: any;
    public lRefreshContactRole: any;
    public riContact_Execute: boolean = false;
    public riContactRole_Execute: boolean = false;

    public iFieldError: any;
    public routeParams: any = {};
    public inputParams: any = {};
    public headerParams: any = {
        method: 'ccm/maintenance',
        module: 'customer',
        operation: 'ContactManagement/iCABSCMContactPersonMaintenance'
    };

    /** HTML boolean */
    public groupNumberRequired: boolean = false;
    public accountNumberRequired: boolean = false;
    public contractNumberRequired: boolean = false;
    public premiseNumberRequired: boolean = false;
    public invoiceGroupNumberRequired: boolean = false;
    public tabContactDetailSelected: boolean = false;

    /** Model */
    public cacheKey: any = '';
    public contactPersonID: any;
    public multipleContacts: string;
    public emergencyContactExists: string;
    public closedWithChanges: string;
    public windowClosingName: string;
    public invoiceGroupStatInv: string;
    public portfolioRoleLevelSelect: string;
    public positionMandatory: string;
    public telephoneMandatory: string;
    public positionDefault: string;
    public saveAbandonMessage: string;
    public saveBeforeSelectMessage: string;

    public viewLevels: Array<Object> = [];
    public menuItems: Array<Object> = [];
    public contactPersonRoles: Array<any> = [{}];
    public backLinkText: string = '';

    public parentDataPopulated: boolean = false;
    public businessCode: string;
    public countryCode: string;
    public pageParams: any = {};
    public fieldParams: any = {};
    public storeFieldValues: any = {};
    public lRefresh: boolean;
    public tabInit: boolean = false;

    public ellipsis = {
        groupAccount: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            showAddNew: false,
            parentMode: 'Lookup',
            component: GroupAccountNumberComponent
        },
        account: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'Lookup',
            showAddNew: false,
            component: AccountSearchComponent
        },
        contract: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'LookUp-All',
            showAddNew: false,
            component: ContractSearchComponent
        },
        premise: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'ContactPerson',
            showAddNew: false,
            ContractNumber: '',
            ContractName: '',
            component: PremiseSearchComponent
        },
        invoice: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            parentMode: 'ContactPerson',
            AccountNumber: '',
            AccounttName: '',
            showAddNew: false,
            component: InvoiceGroupGridComponent
        }
    };


    constructor(
        public fb: FormBuilder,
        public logger: Logger,
        public utils: Utils,
        public httpService: HttpService,
        public ajaxconstant: AjaxObservableConstant,
        public serviceConstants: ServiceConstants,
        public SysCharConstants: SysCharConstants,
        public speedScriptConstants: SpeedScriptConstants,
        public _zone: NgZone,
        public messageService: MessageService,
        public errorService: ErrorService,
        public store: Store<any>,
        public riExchange: RiExchange,
        public route: ActivatedRoute,
        public router: Router,
        public routeAwayGlobals: RouteAwayGlobals,
        public localeTranslateService: LocaleTranslationService,
        public location: Location
    ) {
        this.countryCode = this.utils.getCountryCode();
        this.businessCode = this.utils.getBusinessCode();

        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(data => {
            if (data !== 0) {
                this.messageModal.show({ msg: data.message, title: data.title ? data.title : 'Message' }, false);
            };
        });

        this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            });
        this.utils.getTranslatedval('Contact Person Maintenance').then((res: string) => {
            this.pageParams.windowTitle = res;
            this.utils.setTitle(res);
        });
    }

    //Page Initialize
    public ngOnInit(): void {
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.localeTranslateService.setUpTranslation();

        this.executeSpeedScript();
        this.lInitiating = true;
        this.lUpdateMode = false;
        this.iContactPersonAddCount = 0;
        this.cUpdateMode = 'NEUTRAL';
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.cacheKey = '';
        this.lRefreshContact = true;
        this.lRefreshContactRole = true;
        this.lAllowChooseContact = false;
        this.currentDate = encodeURI(this.utils.formatDate(new Date()).toString());


        this.initForm();
        this.updatePageAsParentMode(this.routeParams);

        this.storeSubscription = this.store.select('contact').subscribe(data => {
            this.storeData = data;
            switch (data['action']) {
                case ContactActionTypes.SAVE_FIELD_PARAMS:
                    if (data !== null && data['fieldParams'] && !(Object.keys(data['fieldParams']).length === 0 && data['fieldParams'].constructor === Object)) {
                        this.setFilterFieldsMandatory(data['fieldParams'].cSelectValue);
                    }
                    break;
                case ContactActionTypes.SAVE_FIELD:
                    if (data !== null && data['fieldValue'] && !(Object.keys(data['fieldValue']).length === 0 && data['fieldValue'].constructor === Object)) {
                        this.storeFieldValues = data['fieldValue'];
                        //this.calculateCacheKey();
                    }
                    break;
                case ContactActionTypes.SET_FORM_GROUPS:
                    if (data !== null && data['formGroup'] && !(Object.keys(data['formGroup']).length === 0 && data['formGroup'].constructor === Object)) {
                        this.storeFormGroup = data['formGroup'];
                    }
                    break;

                case ContactActionTypes.SAVE_PARAMS:
                    if (data !== null && data['params'] && !(Object.keys(data['params']).length === 0 && data['params'].constructor === Object)) {
                        this.pageParams = data['params'];
                        this.lInitiating = data['params'].lInitiating;
                        this.lRefreshContactRole = data['params'].lRefreshContactRole;
                        this.riContact_Execute = data['params'].riContact_Execute;
                        this.riContactRole_Execute = data['params'].riContactRole_Execute;

                        if (this.pageParams.hasError) {
                            let data: Object = {
                                message: '',
                                title: ''
                            };

                            if (this.pageParams.errorMessage === 'SaveBeforeSelectMessage') {
                                data['message'] = this.saveBeforeSelectMessage;
                            } else if (this.pageParams.errorMessage === 'SaveAbandonMessage') {
                                data['message'] = this.saveAbandonMessage;
                            } else {
                                data['title'] = 'Error';
                                data['message'] = this.pageParams.errorMessage;
                            }
                            this.messageService.emitMessage(data);
                            this.pageParams.hasError = false;
                            this.updateStore();

                        }

                        if (this.lInitiating) {
                            this.riTab.tabFocusTo(0);
                        }
                    }
                    break;
            }
        });
    }


    public executeSpeedScript(): void {
        let sysCharNumbers = this.SysCharConstants.SystemCharDisableFirstCapitalOnAddressContact;
        this.fetchSysChar(sysCharNumbers).subscribe(
            (e) => {
                if (e.records && e.records.length > 0) {
                    let glSCCapitalFirstLtr = e.records[0].Logical;
                    this.store.dispatch({
                        type: ContactActionTypes.SAVE_SYSCHAR, payload: {
                            'glSCCapitalFirstLtr': glSCCapitalFirstLtr
                        }
                    });
                }
            },
            (error) => {
                // statement
            });
    }
    public fetchSysChar(sysCharNumbers: any): any {
        this.querySysChar.set(this.serviceConstants.Action, '0');
        this.querySysChar.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.querySysChar.set(this.serviceConstants.CountryCode, this.countryCode);
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    }

    public initForm(): void {
        this.contactPersonFormGroup = this.fb.group({});
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'GroupAccountNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'GroupName');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'AccountNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'AccountName');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'ContractNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'ContractName');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'PremiseNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'PremiseName');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'InvoiceGroupNumber');
        this.riExchange.riInputElement.Add(this.contactPersonFormGroup, 'InvoiceGroupDesc');

        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'GroupName');
        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'AccountName');
        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'ContractName');
        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.contactPersonFormGroup, 'InvoiceGroupDesc');

        this.loadDropDown();
        this.store.dispatch({
            type: ContactActionTypes.SET_FORM_GROUPS, payload: {
                name: 'contactPerson',
                form: this.contactPersonFormGroup
            }
        });
    }
    public loadDropDown(): void {
        this.viewLevels = [{
            value: '0',
            text: 'Contacts From Here And Above'
        }, {
            value: '2',
            text: 'All Contacts For The Entered Account'
        }, {
            value: '3',
            text: 'All Contacts For The Entered Contract/Job'
        }];

        this.menuItems = [{
            value: '',
            text: 'Options'
        }, {
            value: 'audit',
            text: 'Contact Change History'
        }];
    }

    public updatePageAsParentMode(parentData: any): void {
        this.parentMode = this.routeParams.parentMode;

        switch (this.parentMode) {
            case 'GroupAccount':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', parentData.groupAccountNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelGroupAccount;
                this.lRefresh = true;
                break;
            case 'Account':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelAccount;
                this.lRefresh = true;
                break;
            case 'AccountEmergency':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelAccount;
                this.lRefresh = true;
                break;
            case 'CCMSearchAccount':
            case 'CCMSearchAccountNew':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.lAllowChooseContact = (this.parentMode === 'CCMSearchAccountNew') ? true : false;
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelAccount;
                this.lRefresh = true;
                break;

            case 'Contract':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelContract;
                this.lRefresh = true;
                break;
            case 'CCMSearchContract':
            case 'CCMSearchContractNew':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.lAllowChooseContact = (this.parentMode === 'CCMSearchContractNew') ? true : false;
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelContract;
                this.lRefresh = true;
                break;
            case 'Premise':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', parentData.premiseNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelPremise;
                this.lRefresh = true;
                break;
            case 'CCMSearchPremise':
            case 'CCMSearchPremiseNew':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', parentData.premiseNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelPremise;
                this.lAllowChooseContact = (this.parentMode === 'CCMSearchPremiseNew') ? true : false;
                this.lRefresh = true;
                break;
            case 'CCMEntry':
            case 'CCMEntryMenu':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', parentData.contractNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', parentData.premiseNumber);
                this.lAllowChooseContact = (this.parentMode === 'CCMEntry') ? true : false;
                this.lRefresh = true;
                this.cInitialLevel = '';

                let _fieldValues: any = this.getFieldValues();
                if (_fieldValues.AccountNumber) {
                    this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelAccount;
                }
                if (_fieldValues.ContractNumber) {
                    this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelContract;
                }
                if (_fieldValues.PremiseNumber) {
                    this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelPremise;
                }

                break;
            case 'InvoiceGroupInv':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', parentData.invoiceGroupNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelIGInvoice;
                this.lRefresh = true;
                this.invoiceGroupStatInv = 'I';
                break;

            case 'InvoiceGroupStat':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', parentData.accountNumber);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', parentData.invoiceGroupNumber);
                this.cInitialLevel = this.speedScriptConstants.CNFPortfolioLevelIGStatement;
                this.lRefresh = true;
                this.invoiceGroupStatInv = 'S';
                break;
        }

        this.buildTabs();
        this.getInitialValues();
        this.lInitiating = false;
    }

    public setFilterFieldsMandatory(cSelectValue: any): any {
        // Make The Relevant Fields Mandatory And Refresh The Grid - Dependant On Selected Level
        switch (cSelectValue) {
            case 'ThisContact':
                this.groupNumberRequired = false;
                this.accountNumberRequired = false;
                this.contractNumberRequired = false;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = false;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelGroupAccount:
                this.groupNumberRequired = true;
                this.accountNumberRequired = false;
                this.contractNumberRequired = false;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = false;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelAccount:
                this.groupNumberRequired = false;
                this.accountNumberRequired = true;
                this.contractNumberRequired = false;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = false;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelIGAll:
            case this.speedScriptConstants.CNFPortfolioLevelIGInvoice:
            case this.speedScriptConstants.CNFPortfolioLevelIGStatement:
                this.groupNumberRequired = false;
                this.accountNumberRequired = true;
                this.contractNumberRequired = false;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = true;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelContract:
                this.groupNumberRequired = false;
                this.accountNumberRequired = false;
                this.contractNumberRequired = true;
                this.premiseNumberRequired = false;
                this.invoiceGroupNumberRequired = false;
                break;
            case this.speedScriptConstants.CNFPortfolioLevelPremise:
                this.groupNumberRequired = false;
                this.accountNumberRequired = false;
                this.contractNumberRequired = true;
                this.premiseNumberRequired = true;
                this.invoiceGroupNumberRequired = false;
                break;
        }
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'GroupAccountNumber', this.groupNumberRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'AccountNumber', this.accountNumberRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'ContractNumber', this.contractNumberRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'PremiseNumber', this.premiseNumberRequired);
        this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'InvoiceGroupNumber', this.invoiceGroupNumberRequired);
    }

    public inputField_OnChange(e: any, name: string): void {
        if (e.type === 'change') {
            let updateValue: string;
            if (name === 'Account' && e.target.value.length > 0) {
                updateValue = this.utils.numberPadding(e.target.value, 9);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', updateValue);
            } else if (name === 'Contract' && e.target.value.length > 0) {
                updateValue = this.utils.numberPadding(e.target.value, 8);
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', updateValue);
            }
        }
        else {
            if (name === 'GroupAccount') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', e.GroupAccountNumber);
            } else if (name === 'Account') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', e.AccountNumber);
            } else if (name === 'Contract') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', e.ContractNumber);
            } else if (name === 'Premise') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', e.PremiseNumber);
            } else if (name === 'InvoiceGroupInv') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', e.InvoiceGroupNumber);
            }
        }
        this.getPortfolioDescriptions(name);
        this.autoSetViewLevel();

    }

    public autoSetViewLevel(): void {
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber') !== '') {
            this.viewLevelDropdown.selectedItem = '2';
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber') !== '') {
            this.viewLevelDropdown.selectedItem = '3';
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber') === '' &&
            this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber') === '') {
            this.viewLevelDropdown.selectedItem = '0';
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'PremiseNumber') !== '') {
            this.viewLevelDropdown.selectedItem = '0';
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber') !== '') {
            this.viewLevelDropdown.selectedItem = '0';
        }
        this.viewLevelSelect_OnChange();
    }

    public viewLevelSelect_OnChange(): void {
        if (this.parentDataPopulated) {
            // When Viewing All Contacts On Selected Account - An Account Number Must Have Been Entered
            if (this.cInitialLevel === 'ACCOUNT') {
                if (this.viewLevelDropdown.selectedItem === '2') {
                    this.accountNumberRequired = true;
                    this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'AccountNumber', true);
                } else {
                    this.accountNumberRequired = false;
                    this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'AccountNumber', false);
                }
            }
            else if (this.cInitialLevel === 'CONTRACT') {
                // When Viewing All Contacts On Selected Contract - A Contract Number Must Have Been Entered
                if (this.viewLevelDropdown.selectedItem === '3') {
                    this.contractNumberRequired = true;
                    this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'ContractNumber', true);
                } else {
                    this.contractNumberRequired = false;
                    this.riExchange.riInputElement.SetRequiredStatus(this.contactPersonFormGroup, 'ContractNumber', true);
                }
            }

            this.storeFieldValues.ViewLevel = this.viewLevelDropdown.selectedItem;
            this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
        }
    }

    public buildTabs(): void {
        this.tabs = [
            { title: 'Contact Search', active: true },
            { title: 'Contact Details', active: false },
            { title: 'Contact Roles', active: false }
        ];

        this.tabComponentList = [ContactPersonTypeAComponent, ContactPersonTypeBComponent, ContactPersonTypeCComponent];
    }

    public getInitialValues(): void {
        let ValArray, DescArray;
        let time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        this.pageSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.pageSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        this.pageSearchParams.set(this.serviceConstants.Action, '6');
        this.pageSearchParams.set('Function', 'GetInitialValues');

        let _fieldValues: any = this.getFieldValues();

        this.pageSearchParams.set('GroupAccountNumber', _fieldValues.GroupAccountNumber);
        this.pageSearchParams.set('AccountNumber', _fieldValues.AccountNumber);
        this.pageSearchParams.set('ContractNumber', _fieldValues.ContractNumber);
        this.pageSearchParams.set('PremiseNumber', _fieldValues.PremiseNumber);
        this.pageSearchParams.set('InvoiceGroupNumber', _fieldValues.InvoiceGroupNumber);
        this.pageSearchParams.set('InvoiceGroupStatInv', _fieldValues.InvoiceGroupStatInv);
        this.pageSearchParams.set('TME', time);
        this.pageSearchParams.set('DTE', this.currentDate);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.pageSearchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.ErrorMessage) {
                    this.pageParams.hasError = true;
                    this.pageParams.errorMessage = data.ErrorMessage;
                    this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
                    return;
                }
                this.iNumberOfRoles = data.NumberOfRoles;
                this.saveAbandonMessage = data.SaveAbandonMessage;
                this.saveBeforeSelectMessage = data.SaveBeforeSelectMessage;

                this.multipleContacts = data.MultipleContacts;
                this.telephoneMandatory = data.TelephoneMandatory;
                this.positionMandatory = data.PositionMandatory;
                this.positionDefault = data.PositionDefault;
                this.emergencyContactExists = data.EmergencyContactExists;

                // To keep this function as simple as possible - when NOT multiple contacts then default to the Contact Tab
                if (this.multipleContacts === 'N') {
                    this.riTab.tabFocusTo(1);
                }

                this.updateInputFieldsValue(data);

                let _roleIDList = data.RoleIDList;
                ValArray = _roleIDList.split('^');

                let _roleDescList = data.RoleDescList;
                DescArray = _roleDescList.split('^');

                for (let i = 0; i < ValArray.length; i++) {
                    let obj = {
                        value: ValArray[i],
                        text: DescArray[i]
                    };
                    this.contactPersonRoles[i] = obj;
                }
                this.contactPersonRoleDropdown.selectedItem = '0';
                this.parentDataPopulated = true;
                if (this.lRefresh) {
                    this.autoSetViewLevel();
                    if (this.parentMode === 'AccountEmergency') {
                        //If an emergency contact does not exist then default to the primary contact
                        if (this.emergencyContactExists === 'Y') {
                            this.contactPersonRoleDropdown.selectedItem = '2';
                        } else {
                            this.contactPersonRoleDropdown.selectedItem = '1';
                        }
                    }
                    this.storeFieldValues.ViewLevel = this.viewLevelDropdown.selectedItem;
                    this.storeFieldValues.ContactPersonRoleID = this.contactPersonRoleDropdown.selectedItem;
                    this.setupGridContact();
                } else {
                    this.updateStore();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getFieldValues(): Object {
        return {
            'MultipleContacts': this.multipleContacts,
            'TelephoneMandatory': this.telephoneMandatory,
            'PositionMandatory': this.positionMandatory,
            'PositionDefault': this.positionDefault,
            'EmergencyContactExists': this.emergencyContactExists,
            'GroupAccountNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupAccountNumber', MntConst.eTypeInteger ),
            'GroupName': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupName', MntConst.eTypeText ),
            'AccountNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber', MntConst.eTypeCode ),
            'AccountName': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountName'),
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber', MntConst.eTypeCode  ),
            'ContractName': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractName'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'PremiseNumber', MntConst.eTypeInteger ),
            'PremiseName': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'PremiseName'),
            'InvoiceGroupNumber': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', MntConst.eTypeInteger ),
            'InvoiceGroupDesc': this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc'),
            'ContactPersonRoleID': this.contactPersonRoleDropdown.selectedItem,
            'ViewLevel': this.viewLevelDropdown.selectedItem
        };
    }

    //Manual Maintenance Controls - Coded It This Way Because The riMaintenance & riGrid Controls Cannot Co-Exist
    public btnAdd_OnClick(): void {
        this.btnMode = 'Add';
        this.riTab.tabFocusTo(1);
        this.cUpdateMode = 'ADD';
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.lRefreshContactRole = true;
        this.updateStore();

        this.storeFieldValues.AddPortfolioLevelSelect = this.cInitialLevel;
        this.storeFieldValues.PortfolioRoleLeveLSelect = this.cInitialLevel;
        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
    }

    public btnUpdate_OnClick(): void {
        this.riTab.tabFocusTo(1);
        this.routeAwayGlobals.setSaveEnabledFlag(true);
        this.btnMode = 'Update';
        this.cUpdateMode = 'UPDATE';
        this.updateStore();
    }

    public btnSave_OnClick(): void {
        this.iFieldError = 0;

        let lCanSave = true;
        let effectiveFromDate_isError = this.riExchange.riInputElement.isError(this.storeFormGroup.contactDetails, 'EffectiveFromDate');
        let contactPersonName_isError = this.riExchange.riInputElement.isError(this.storeFormGroup.contactDetails, 'ContactPersonName');
        let contactPersonPosition_isError = this.riExchange.riInputElement.isError(this.storeFormGroup.contactDetails, 'ContactPersonPosition');
        let contactPersonTelephone_isError = this.riExchange.riInputElement.isError(this.storeFormGroup.contactDetails, 'ContactPersonTelephone');

        let groupAccountNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'GroupAccountNumber');
        let accountNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'AccountNumber');
        let contractNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'ContractNumber');
        let premiseNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'PremiseNumber');
        let invoiceGroupNumber_isError = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'InvoiceGroupNumber');

        if (effectiveFromDate_isError) {
            if (this.iFieldError === 0) {
                this.iFieldError = 1;
            }
        }
        if (contactPersonName_isError) {
            if (this.iFieldError === 0) {
                this.iFieldError = 2;
            }
        }
        if (contactPersonPosition_isError) {
            if (this.iFieldError === 0) {
                this.iFieldError = 3;
            }
        }
        if (contactPersonTelephone_isError) {
            if (this.iFieldError === 0) {
                this.iFieldError = 4;
            }
        }

        if (this.cUpdateMode === 'ADD') {
            if (groupAccountNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 5;
                }
            }
            if (accountNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 6;
                }
            }
            if (contractNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 7;
                }
            }
            if (premiseNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 8;
                }
            }
            if (invoiceGroupNumber_isError) {
                if (this.iFieldError === 0) {
                    this.iFieldError = 9;
                }
            }
        }

        if (this.iFieldError !== 0) {
            this.riTab.tabFocusTo(1);
            this.utils.highlightTabs();
        }

        if (this.iFieldError === 0) {
            this.saveAdd_beforeExecute();
            this.utils.makeTabsNormal();
        }
    }

    public saveAdd_beforeExecute(): void {
        let _fieldValues: any = this.getFieldValues();
        let time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        let updateSearchParams: URLSearchParams = new URLSearchParams();
        updateSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        updateSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        updateSearchParams.set(this.serviceConstants.Action, '6');
        updateSearchParams.set('Function', 'ContactPersonUpdate');
        updateSearchParams.set('CacheKey', this.cacheKey);
        updateSearchParams.set('ContactPersonID', this.storeFieldValues.ContactPersonID);
        updateSearchParams.set('GroupAccountNumber', _fieldValues.GroupAccountNumber);
        updateSearchParams.set('AccountNumber', _fieldValues.AccountNumber);
        updateSearchParams.set('ContractNumber', _fieldValues.ContractNumber);
        updateSearchParams.set('PremiseNumber', _fieldValues.PremiseNumber);
        updateSearchParams.set('InvoiceGroupNumber', _fieldValues.InvoiceGroupNumber);
        updateSearchParams.set('PortfolioLevelKey', this.storeFieldValues.AddPortfolioLevelSelect);
        updateSearchParams.set('EffectiveFromDate', encodeURI(this.storeFieldValues.EffectiveFromDate));
        updateSearchParams.set('ContactPersonName', this.storeFieldValues.ContactPersonName);
        updateSearchParams.set('ContactPersonPosition', this.storeFieldValues.ContactPersonPosition);
        updateSearchParams.set('ContactPersonDepartment', this.storeFieldValues.ContactPersonDepartment);
        updateSearchParams.set('ContactPersonNotes', this.storeFieldValues.ContactPersonNotes);
        updateSearchParams.set('ContactPersonTelephone', this.storeFieldValues.ContactPersonTelephone);
        updateSearchParams.set('ContactPersonMobile', this.storeFieldValues.ContactPersonMobile);
        updateSearchParams.set('ContactPersonEmail', this.storeFieldValues.ContactPersonEmail);
        updateSearchParams.set('ContactPersonFax', this.storeFieldValues.ContactPersonFax);
        updateSearchParams.set('DTE', this.currentDate);
        updateSearchParams.set('TME', time);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, updateSearchParams).subscribe(
            (data) => {

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.pageParams.formError = false;
                if (data.ErrorMessage) {
                    this.riTab.tabFocusTo(1);
                    this.pageParams.hasError = true;
                    this.pageParams.formError = true;
                    this.pageParams.errorField = data.ErrorField;
                    this.pageParams.errorMessage = data.ErrorMessage;
                    this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
                    return;
                }
                this.lRefreshContact = true;
                this.lRefreshContactRole = true;
                this.messageService.emitMessage({
                    message: MessageConstant.Message.RecordSavedSuccessfully
                });

                this.storeFieldValues.ContactPersonID = data.ContactPersonID;
                this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });

                if (this.cUpdateMode === 'ADD') {
                    this.cUpdateMode = 'UPDATE';
                    this.routeAwayGlobals.setSaveEnabledFlag(true);
                    this.storeFieldValues.RolesContactPersonID = this.storeFieldValues.ContactPersonID;
                    this.storeFieldValues.RolesContactPersonName = this.storeFieldValues.ContactPersonName;
                    this.storeFieldValues.PortfolioRoleLevelSelect = this.storeFieldValues.AddPortfolioLevelSelect;
                    this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });

                    this.updateStore();
                    this.riTab.tabFocusTo(2);
                }
                else {
                    this.riTab.tabFocusTo(1);
                }

                //this.closedWithChanges = 'Y';
                this.cUpdateMode = 'NEUTRAL';
                this.routeAwayGlobals.setSaveEnabledFlag(false);
                this.pageParams.closedWithChanges = 'Y';
                this.updateStore();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public contactPersonRoles_OnChange(data: any): void {
        this.storeFieldValues.ContactPersonRoleID = this.contactPersonRoleDropdown.selectedItem;
        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
    }

    public getPortfolioDescriptions(cPortfolioLevel: string): any {
        switch (cPortfolioLevel) {
            case 'GroupAccount':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', '');
                break;
            case 'Account':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', '');
                break;
            case 'Contract':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseName', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', '');
                break;
            case 'Premise':
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', '');
                break;
        }

        let _fieldValues: any = this.getFieldValues();

        this.pageSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        this.pageSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        this.pageSearchParams.set(this.serviceConstants.Action, '6');
        this.pageSearchParams.set('Function', 'GetPortfolioDescriptions');
        this.pageSearchParams.set('GroupAccountNumber', _fieldValues.GroupAccountNumber);
        this.pageSearchParams.set('AccountNumber', _fieldValues.AccountNumber);
        this.pageSearchParams.set('ContractNumber', _fieldValues.ContractNumber);
        this.pageSearchParams.set('PremiseNumber', _fieldValues.PremiseNumber);
        this.pageSearchParams.set('InvoiceGroupNumber', _fieldValues.InvoiceGroupNumber);


        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.pageSearchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.ErrorMessage) {
                    this.pageParams.hasError = true;
                    this.pageParams.errorMessage = data.ErrorMessage;
                    this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
                    return;
                }
                for (let key in data) {
                    if (key) {
                        this.storeFieldValues[key] = data[key];
                    }
                }
                this.autoSetViewLevel();
                this.updateInputFieldsValue(data);
            },
            (error) => {
                this.logger.log('Error');
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public updateInputFieldsValue(data: any): void {
        if (data.GroupAccountNumber === '0') {
            if (data.GroupName === '') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', '');
            } else {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', 0);
            }

        } else {
            this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupAccountNumber', data.GroupAccountNumber);
        }
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'GroupName', data.GroupName);
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountNumber', data.AccountNumber);
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'AccountName', data.AccountName);
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'ContractName', data.ContractName);

        if (data.PremiseNumber === '0') {
            if (data.PremiseName === '') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', '');
            } else {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', 0);
            }
        } else {
            this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseNumber', data.PremiseNumber);
        }
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'PremiseName', data.PremiseName);

        if (data.InvoiceGroupNumber === '0') {
            if (data.InvoiceGroupDesc === '') {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', '');
            } else {
                this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', 0);
            }
        } else {
            this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupNumber', data.InvoiceGroupNumber);
        }
        this.riExchange.riInputElement.SetValue(this.contactPersonFormGroup, 'InvoiceGroupDesc', data.InvoiceGroupDesc);

        for (let key in data) {
            if (key) {
                this.storeFieldValues[key] = data[key];
            }
        }
        this.store.dispatch({ type: ContactActionTypes.SAVE_FIELD, payload: this.storeFieldValues });
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupAccountNumber')) {
            this.ellipsis.account['groupAccountNumber'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupAccountNumber', MntConst.eTypeInteger );
            this.ellipsis.account['groupName'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'GroupName');
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber')) {
            this.ellipsis.contract['accountNumber'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber',  MntConst.eTypeCode );
            this.ellipsis.contract['accountName'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountName');

            this.ellipsis.invoice['AccountNumber'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountNumber',  MntConst.eTypeCode );
            this.ellipsis.invoice['AccountName'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'AccountName');
        }
        if (this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber')) {
            this.ellipsis.premise['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractNumber',  MntConst.eTypeCode );
            this.ellipsis.premise['ContractName'] = this.riExchange.riInputElement.GetValue(this.contactPersonFormGroup, 'ContractName');
        }

    }

    public onSelectTab(data: any): void {
        this.tabContactDetailSelected = false;

        switch (data.tabIndex) {
            case 0:
                // When entering contact search tab - refresh as and when required
                if (this.lRefreshContact) {
                    this.setupGridContact();
                }
                this.viewLevelSelect_OnChange();
                break;
            case 1:
                // When entering the contact details tab - show the delete button
                this.tabContactDetailSelected = true;
                break;
            case 2:
                // When entering contact roles tab - refresh as and when required
                if (this.lRefreshContactRole) {
                    this.setupGridContactRole();
                }
                break;
        }

    }

    public backButton_OnClick(event: any): void {
        event.preventDefault();
        if (this.cUpdateMode === 'ADD' || this.cUpdateMode === 'UPDATE') {
            let data: Object = {};
            data['message'] = this.saveAbandonMessage;
            this.messageService.emitMessage(data);
        }
        if (this.closedWithChanges === 'Y') {
            this.windowClosingName = 'AmendmentsMade';
        }
        else {
            this.windowClosingName = '';
        }
        let saveData: any = {};
        saveData.windowClosingName = this.windowClosingName;
        saveData.closedWithChanges = this.closedWithChanges;
        this.store.dispatch({ type: ContactActionTypes.SAVE_DATA, payload: saveData });

        this.location.back();
    }

    public btnChoose_OnClick(): void {
        //Pass the current contact details back to the calling window
        let saveData: any = {};
        if (this.parentMode === 'CCMEntry') {
            saveData.ContactName = this.storeFieldValues.ContactPersonName;
            saveData.ContactPosition = this.storeFieldValues.ContactPersonPosition;
            saveData.ContactTelephone = this.storeFieldValues.ContactPersonTelephone;
            saveData.ContactMobileNumber = this.storeFieldValues.ContactPersonMobile;
            saveData.ContactEmailAddress = this.storeFieldValues.ContactPersonEmail;
        }
        else {
            saveData.CallContactName = this.storeFieldValues.ContactPersonName;
            saveData.CallContactPosition = this.storeFieldValues.ContactPersonPosition;
            saveData.CallContactTelephone = this.storeFieldValues.ContactPersonTelephone;
            saveData.CallContactMobile = this.storeFieldValues.ContactPersonMobile;
            saveData.CallContactEmail = this.storeFieldValues.ContactPersonEmail;
        }
        this.store.dispatch({ type: ContactActionTypes.SAVE_DATA, payload: saveData });
    }

    public btnAbandon_OnClick(): void {
        this.cUpdateMode = 'NEUTRAL';
        this.btnMode = 'Abandon';
        this.routeAwayGlobals.setSaveEnabledFlag(false);
        this.iFieldError = 0;
        this.lRefreshContactRole = true;
        this.utils.makeTabsNormal();
        this.updateStore();
    }

    public btnDelete_OnClick(): void {
        let time = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
        let deleteSearchParams: URLSearchParams = new URLSearchParams();
        deleteSearchParams.set(this.serviceConstants.BusinessCode, this.businessCode);
        deleteSearchParams.set(this.serviceConstants.CountryCode, this.countryCode);
        deleteSearchParams.set(this.serviceConstants.Action, '6');

        let bodyParams = {};
        bodyParams['Function'] = 'ContactPersonDelete';
        bodyParams['ContactPersonID'] = this.storeFieldValues.ContactPersonID;
        bodyParams['GroupAccountNumber'] = this.storeFieldValues.GroupAccountNumber;
        bodyParams['AccountNumber'] = this.storeFieldValues.AccountNumber;
        bodyParams['ContractNumber'] = this.storeFieldValues.ContractNumber;
        bodyParams['PremiseNumber'] = this.storeFieldValues.PremiseNumber;
        bodyParams['InvoiceGroupNumber'] = this.storeFieldValues.InvoiceGroupNumber;
        bodyParams['DTE'] = this.currentDate;
        bodyParams['TME'] = time;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, deleteSearchParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.ErrorMessage) {
                    this.pageParams.hasError = true;
                    this.pageParams.errorMessage = data.ErrorMessage;
                    this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
                    return;
                }

                this.messageService.emitMessage({
                    message: MessageConstant.Message.RecordDeleted
                });
                // We have just deleted the current contact - take the user to the first tab and refresh the available contacts
                this.riTab.tabFocusTo(0);
                this.pageParams.closedWithChanges = 'Y';
                this.lRefreshContact = true;
                this.riContact_Execute = true;
                this.updateStore();

            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public setupGridContact(): void {
        let lCanRefresh = true;
        let accountNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'AccountNumber');
        let contractNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'ContractNumber');
        if (accountNumberInvalid || contractNumberInvalid) {
            lCanRefresh = false;
        }
        this.lRefreshContact = false;
        this.riContact_Execute = lCanRefresh;
        this.updateStore();
    }

    public setupGridContactRole(): void {
        let lCanRefreshRole = true;

        let groupAccountNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'GroupAccountNumber');
        let accountNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'AccountNumber');
        let contractNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'ContractNumber');
        let premiseNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'PremiseNumber');
        let invoiceGroupNumberInvalid = this.riExchange.riInputElement.isError(this.contactPersonFormGroup, 'InvoiceGroupNumber');

        if (groupAccountNumberInvalid || accountNumberInvalid || contractNumberInvalid || premiseNumberInvalid || invoiceGroupNumberInvalid) {
            lCanRefreshRole = false;
        }
        if (this.contactPersonID === '0' && !this.contactPersonID) {
            lCanRefreshRole = false;
        }

        if (this.cUpdateMode === 'ADD') {
            lCanRefreshRole = false;
        }
        this.lRefreshContactRole = false;
        this.riContactRole_Execute = lCanRefreshRole;

        this.updateStore();
    }

    public calculateCacheKey(): string {
        // This procedure calculates a unique cache key that is used to group the update of the contact details AND the respective contact roles
        // at all portfolio levels
        // This will enable validation to be performed (on save) to ensure that at least one role has been entered
        let time = new Date();
        let iContactPersonID = this.storeFieldValues.ContactPersonID;
        if (iContactPersonID === '0' || iContactPersonID === '' || !iContactPersonID) {
            // When creating then use a negative number just to ensure that throughout a single maintenance session, the key will be unique
            // -ve means we are adding a new contact
            this.iContactPersonAddCount = this.iContactPersonAddCount - 1;
            iContactPersonID = this.iContactPersonAddCount;
        }
        else {
            iContactPersonID = parseFloat(iContactPersonID);
        }

        // The following variable will be sent to the server and used (including the userid code) to
        this.cacheKey = 'contactpersonupdate-' + time.toString() + '-' + parseFloat(iContactPersonID);
        this.storeFieldValues.CacheKey = this.cacheKey;
        return this.cacheKey;
    }

    public menu_OnChange(): void {
        if (this.menu.selectedItem === 'audit') {
            this.router.navigate(['/application/ContactPersonHistory'], { queryParams: { parentMode: 'contactperson' } });
        }
    }

    public updateStore(): void {
        this.pageParams.btnMode = this.btnMode;
        this.pageParams.cUpdateMode = this.cUpdateMode;
        this.pageParams.lInitiating = this.lInitiating;
        this.pageParams.iFieldError = this.iFieldError;
        this.pageParams.lRefreshContactRole = this.lRefreshContactRole;
        this.pageParams.riContact_Execute = this.riContact_Execute;
        this.pageParams.riContactRole_Execute = this.riContactRole_Execute;
        this.store.dispatch({ type: ContactActionTypes.SAVE_PARAMS, payload: this.pageParams });
    }

    //Page Destroy
    public ngOnDestroy(): void {
        if (this.messageSubscription) {
            this.messageSubscription.unsubscribe();
        }
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
    /*
    *   Alerts user when user is moving away without saving the changes. //CR implementation
    */
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return this.routeAwayComponent.canDeactivate();
    }
}
