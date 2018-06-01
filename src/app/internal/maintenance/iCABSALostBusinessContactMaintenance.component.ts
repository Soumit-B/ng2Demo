import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Rx';
import { setTimeout } from 'timers';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { InternalMaintenanceApplicationModuleRoutes, InternalMaintenanceApplicationModuleRoutesConstant, ContractManagementModuleRoutes } from './../../base/PageRoutes';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { LostBusinessContactOutcomeLanguageSearchComponent } from './../../internal/search/iCABSSLostBusinessContactOutcomeLanguageSearch.component';
import { LostBusinessContactTypeLanguageSearchComponent } from './../../internal/search/iCABSSLostBusinessContactTypeLanguageSearch.component';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';

@Component({
    templateUrl: 'iCABSALostBusinessContactMaintenance.html'
})

export class LostBusinessContactMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('apiContactTypeLangSearch') apiContactTypeLangSearch: LostBusinessContactTypeLanguageSearchComponent;

    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public isShowHeader: boolean = true;
    public modalTitle: string = '';
    public strNoDetailErrorMessage: string = '';
    public autoGenProspectWarning: string = '';
    public languageCode: string;
    public vErrorMessageCode: number = 2378;
    public sCAutoGenProspect: boolean;
    public contactOutcomeLangSearchComponent = LostBusinessContactOutcomeLanguageSearchComponent;
    public employeeSearchComponent = EmployeeSearchComponent;
    public uiDisplay: any = {
        isTrPremise: true,
        isTrProduct: true,
        isTdPassword: false,
        isTdSavedValue: true,
        isTdLostValue: true
    };
    public queryParams: any = {
        module: 'retention',
        operation: 'Application/iCABSALostBusinessContactMaintenance',
        method: 'ccm/maintenance'
    };
    public inputParams: any = {
        contactOutcomeLangSearch: {
            'parentMode': 'CreditReInvoice',
            'companyCode': '01'
        },
        employeeSearch: {
            'parentMode': 'LookUp'
        },
        contactTypeLangSearch: {
            'parentMode': 'LookUp'
        }
    };
    public controls: Array<any> = [
        { name: 'ContractNumber', type: MntConst.eTypeCode, disabled: true, required: true },
        { name: 'ContractName', type: MntConst.eTypeText, disabled: true },
        { name: 'AccountNumber', type: MntConst.eTypeText, disabled: true },
        { name: 'AccountName', type: MntConst.eTypeText, disabled: true },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger, disabled: true },
        { name: 'PremiseName', type: MntConst.eTypeText, disabled: true },
        { name: 'ProductCode', type: MntConst.eTypeCode, disabled: true },
        { name: 'ProductDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'LostBusinessRequestNumber', type: MntConst.eTypeInteger, disabled: true, required: true },
        { name: 'CommenceDate', type: MntConst.eTypeDate, disabled: true },
        { name: 'LostBusinessContactNumber', type: MntConst.eTypeInteger, disabled: true, required: true },
        { name: 'RequestStatus', type: MntConst.eTypeText, disabled: true },
        { name: 'ClientContact', type: MntConst.eTypeText, disabled: true },
        { name: 'ClientContactTelephoneNumber', type: MntConst.eTypeText, disabled: true },
        { name: 'ContactDate', type: MntConst.eTypeDate, required: true },
        { name: 'SavedValue', type: MntConst.eTypeCurrency, disabled: true },
        { name: 'LostValue', type: MntConst.eTypeCurrency, disabled: true },
        { name: 'ContactOutcomeCode', type: MntConst.eTypeCode, required: true },
        { name: 'LBContactOutcomeDesc', type: MntConst.eTypeText, disabled: true },
        { name: 'Password', type: MntConst.eTypeText },
        { name: 'EmployeeCode', type: MntConst.eTypeCode, required: true },
        { name: 'EmployeeSurname', type: MntConst.eTypeText, disabled: true },
        { name: 'LostBusinessContactNarrative', type: MntConst.eTypeTextFree },
        { name: 'menu' },
        { name: 'ServiceCoverRowID', type: MntConst.eTypeText },
        { name: 'LostBusinessRequestRowID', type: MntConst.eTypeText },
        { name: 'InvTypeChangeExists' },
        { name: 'LBContactOutcomeMessage', type: MntConst.eTypeText },
        { name: 'MoreWAS', type: MntConst.eTypeText },
        { name: 'ContactTypeCode', type: MntConst.eTypeCode, required: true },
        { name: 'LBContactTypeDesc', type: MntConst.eTypeText }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSALOSTBUSINESSCONTACTMAINTENANCE;
        this.pageTitle = this.browserTitle = 'Client Retention Contact Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.languageCode = this.riExchange.LanguageCode();
        this.getSysCharDetails();
        this.errorMessageLookUp();
    }

    ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.uiDisplay.isTrPremise = this.pageParams.isTrPremise;
            this.uiDisplay.isTrProduct = this.pageParams.isTrProduct;
            this.uiDisplay.isTdPassword = this.pageParams.isTdPassword;
            this.uiDisplay.isTdSavedValue = this.pageParams.isTdSavedValue;
            this.uiDisplay.isTdLostValue = this.pageParams.isTdLostValue;
            if (this.formData['ContactTypeCode']) {
                this.apiContactTypeLangSearch.apiLanguageSearchDropDown.active = {
                    id: this.formData['ContactTypeCode'],
                    text: this.formData['ContactTypeCode'] + ' - ' + this.formData['LBContactTypeDesc']
                };
            }
        } else {
            this.windowOnload();
        }
        this.setControlValue('menu', 'Options');
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    // syschar function to get value of sCAutoGenProspect
    public getSysCharDetails(): any {
        let sysCharNumbers = [this.sysCharConstants.SystemCharAutoGenerateProspectFromClientRetention];
        let sysCharIp = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharNumbers.toString()
        };
        this.speedScript.sysChar(sysCharIp).subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data['records'] && data['records'][0] !== '')
                        this.sCAutoGenProspect = data['records'][0].Required;
                    else
                        this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
            });
    }

    // errormessage function to get value of strNoDetailErrorMessage
    public errorMessageLookUp(): void {
        let lookupIP = [
            {
                'table': 'ErrorMessageLanguage',
                'query': {
                    'LanguageCode': this.languageCode,
                    'ErrorMessageCode': this.vErrorMessageCode
                },
                'fields': ['ErrorMessageDisplayDescription']
            }
        ];

        this.LookUp.lookUpRecord(lookupIP).subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data[0] && data[0][0] !== '') {
                        this.strNoDetailErrorMessage = data[0][0].ErrorMessageDisplayDescription;
                    } else
                        this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
            });
    }

    public windowOnload(): void {
        this.setServiceCoverRowID(this.attributes['ContractNumberServiceCoverRowID']);
        if (this.parentMode === 'TrialPeriod') {
            this.setControlValue('LostBusinessRequestRowID', this.attributes['ContractNumberLostBusinessRequestRowID']);
        } else {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
            this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
            this.setControlValue('LostBusinessRequestNumber', this.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));
            this.setControlValue('LostBusinessContactNumber', this.riExchange.getParentHTMLValue('LostBusinessContactNumber'));
        }
        if (this.getControlValue('ProductCode')) {
            this.uiDisplay.isTrPremise = true;
            this.uiDisplay.isTrProduct = true;
        } else if (this.getControlValue('PremiseNumber')) {
            this.uiDisplay.isTrPremise = true;
            this.uiDisplay.isTrProduct = false;
        } else {
            this.uiDisplay.isTrPremise = false;
            this.uiDisplay.isTrProduct = false;
        }
        this.pageParams.isTrPremise = this.uiDisplay.isTrPremise;
        this.pageParams.isTrProduct = this.uiDisplay.isTrProduct;
        if (this.parentMode === 'SearchAdd' || this.parentMode === 'TrialPeriod') {
            this.setFormMode(this.c_s_MODE_ADD);
            this.disableControl('menu', true);
            this.getRequestStatus();
            this.getInitialSettings();
        } else {
            this.uiDisplay.isTdPassword = false;
            this.pageParams.isTdPassword = this.uiDisplay.isTdPassword;
            this.lookUpLostBusinessContactData();
            this.getInitialSettings();
        }

        if (this.sCAutoGenProspect) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.search = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
            this.search.set('LostBusinessRequestNumber', this.getControlValue('LostBusinessRequestNumber'));
            let postParams: Object = {};
            postParams['Function'] = 'GetAutoGenProspectDetails';

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postParams)
                .subscribe((data) => {
                    if (data.hasError)
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    else {
                        if (data.AutoGenProspectWarning !== '') {
                            this.autoGenProspectWarning = data.AutoGenProspectWarning;
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    // lookup to populate data
    public lookUpLostBusinessContactData(): void {
        let lookUp = [
            {
                'table': 'LostBusinessContact',
                'query':
                {
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'LostBusinessRequestNumber': this.getControlValue('LostBusinessRequestNumber'),
                    'LostBusinessContactNumber': this.getControlValue('LostBusinessContactNumber'),
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ContactDate', 'ContactTypeCode', 'ContactOutcomeCode', 'SavedValue', 'LostValue', 'EmployeeCode', 'LostBusinessContactNarrative']
            }
        ];
        this.LookUp.lookUpRecord(lookUp).subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data[0].length > 0 && data[0][0] !== '') {
                        let lookUpLostBusinessContactData = data[0][0];
                        this.setControlValue('ContactDate', lookUpLostBusinessContactData.ContactDate);
                        this.setControlValue('ContactTypeCode', lookUpLostBusinessContactData.ContactTypeCode);
                        this.setControlValue('ContactOutcomeCode', lookUpLostBusinessContactData.ContactOutcomeCode);
                        this.setControlValue('SavedValue', lookUpLostBusinessContactData.SavedValue);
                        this.setControlValue('LostValue', lookUpLostBusinessContactData.LostValue);
                        this.setControlValue('EmployeeCode', lookUpLostBusinessContactData.EmployeeCode);
                        this.setControlValue('LostBusinessContactNarrative', lookUpLostBusinessContactData.LostBusinessContactNarrative);
                        this.lookUpData(false);
                    } else
                        this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public lookUpData(onSave: boolean): void {
        let lookUp = [
            {
                'table': 'Contract',
                'query':
                {
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ContractName']
            },
            {
                'table': 'LBContactTypeLang',
                'query':
                {
                    'ContactTypeCode': this.getControlValue('ContactTypeCode'),
                    'LanguageCode': this.languageCode
                },
                'fields': ['LBContactTypeDesc']
            },
            {
                'table': 'LBContactOutcomeLang',
                'query':
                {
                    'ContactOutcomeCode': this.getControlValue('ContactOutcomeCode'),
                    'LanguageCode': this.languageCode
                },
                'fields': ['LBContactOutcomeDesc', 'LBContactOutcomeMessage']
            },
            {
                'table': 'Employee',
                'query':
                {
                    'EmployeeCode': this.getControlValue('EmployeeCode'),
                    'BusinessCode': this.businessCode
                },
                'fields': ['EmployeeSurname']
            }
        ];
        this.LookUp.lookUpRecord(lookUp).subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data[0].length > 0 && data[0][0] !== '') {
                        this.setControlValue('ContractName', data[0][0].ContractName);
                    }
                    if (data[1].length > 0 && data[1][0] !== '') {
                        this.setControlValue('LBContactTypeDesc', data[1][0].LBContactTypeDesc);
                        this.apiContactTypeLangSearch.apiLanguageSearchDropDown.active = {
                            id: this.getControlValue('ContactTypeCode'),
                            text: this.getControlValue('ContactTypeCode') + ' - ' + this.getControlValue('LBContactTypeDesc')
                        };
                    }
                    if (data[2].length > 0 && data[2][0] !== '') {
                        this.setControlValue('LBContactOutcomeDesc', data[2][0].LBContactOutcomeDesc);
                        this.setControlValue('LBContactOutcomeMessage', data[2][0].LBContactOutcomeMessage);
                    } else {
                        this.uiForm.controls['ContactOutcomeCode'].setErrors({
                            'invalid': true
                        });
                        this.setControlValue('LBContactOutcomeDesc', '');
                        this.setControlValue('LBContactOutcomeMessage', '');
                    }
                    if (data[3].length > 0 && data[3][0] !== '') {
                        this.setControlValue('EmployeeSurname', data[3][0].EmployeeSurname);
                    } else {
                        this.uiForm.controls['EmployeeCode'].setErrors({
                            'invalid': true
                        });
                        this.setControlValue('EmployeeSurname', '');
                    }
                    if (onSave)
                        this.warnEmployeeLeft();
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    // GetRequestStatus to populate data
    public getRequestStatus(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('LostBusinessRequestNumber', this.getControlValue('LostBusinessRequestNumber'));
        let postParams: Object = {};
        postParams['Function'] = 'GetRequestStatus';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postParams)
            .subscribe((data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data !== '') {
                        if (!this.getControlValue('SavedValue') && !this.getControlValue('LostValue')) {
                            this.uiDisplay.isTdSavedValue = false;
                            this.uiDisplay.isTdLostValue = false;
                        } else {
                            this.uiDisplay.isTdSavedValue = true;
                            this.uiDisplay.isTdLostValue = true;
                        }
                        this.pageParams.isTdSavedValue = this.uiDisplay.isTdSavedValue;
                        this.pageParams.isTdLostValue = this.uiDisplay.isTdLostValue;
                        this.setControlValue('ContractName', data.ContractName);
                        this.setControlValue('AccountNumber', data.AccountNumber);
                        this.setControlValue('AccountName', data.AccountName);
                        this.setControlValue('RequestStatus', data.RequestStatus);
                        this.setControlValue('CommenceDate', data.CommenceDate);
                        this.setControlValue('ClientContact', data.ClientContact);
                        this.setControlValue('ClientContactTelephoneNumber', data.ClientContactTelephoneNumber);
                        this.setControlValue('EmployeeCode', data.EmployeeCode);
                        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                        this.setControlValue('MoreWAS', data.MoreWAS);
                    } else
                        this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getInitialSettings(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('ProductCode', this.getControlValue('ProductCode'));
        this.search.set('ContactOutcomeCode', this.getControlValue('ContactOutcomeCode'));
        let postParams: Object = {};
        postParams['Function'] = 'GetInitialSettings';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postParams)
            .subscribe((data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('InvTypeChangeExists', data.InvTypeChangeExists);
                    if (data.ShowPswd === 'yes') {
                        this.uiDisplay.isTdPassword = true;
                        this.pageParams.isTdPassword = this.uiDisplay.isTdPassword;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public setServiceCoverRowID(RowID: any): void {
        this.attributes['ContractNumberServiceCoverRowID'] = RowID;
        this.attributes['PremiseNumberServiceCoverRowID'] = RowID;
        this.setControlValue('ServiceCoverRowID', RowID);
    }

    // employee ellipsis
    public onEmployeeSearchDataReturn(data: any): void {
        if (data) {
            this.setControlValue('EmployeeCode', data.EmployeeCode);
            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        }
    }

    // ContactTypeLanguageSearch dropdown
    public onContactTypeLangDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ContactTypeCode', data['LBContactTypeLang.ContactTypeCode']);
            this.setControlValue('LBContactTypeDesc', data['LBContactTypeLang.LBContactTypeDesc']);
        }
    }

    // LostBusinessContactOutcomeLanguageSearch ellipsis
    public onContactOutcomeLangDataReturn(data: any): void {
        if (data) {
            this.setControlValue('ContactOutcomeCode', data.ContactOutcomeCode);
            this.setControlValue('LBContactOutcomeDesc', data.ContactOutcomeSystemDesc);
            this.pswdStatus();
        }
    }

    // LostBusinessContactOutcomeLanguageSearch change event
    public onContactOutcomeLangChange(): void {
        this.pswdStatus();
    }

    public pswdStatus(): void {
        this.uiDisplay.isTdPassword = false;
        this.pageParams.isTdPassword = this.uiDisplay.isTdPassword;
        this.setControlValue('Password', '');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('ContactOutcomeCode', this.getControlValue('ContactOutcomeCode'));
        let postParams: Object = {};
        postParams['Function'] = 'PswdStatus';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postParams)
            .subscribe((data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.setControlValue('InvTypeChangeExists', data.InvTypeChangeExists);
                    if (data.ShowPswd === 'yes') {
                        this.uiDisplay.isTdPassword = true;
                        this.pageParams.isTdPassword = this.uiDisplay.isTdPassword;
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    // on save click
    public onSaveData(): void {
        this.lookUpData(true);
        if (this.getControlValue('ContactTypeCode') === '')
            this.apiContactTypeLangSearch.apiLanguageSearchDropDown.isError = true;
        else
            this.apiContactTypeLangSearch.apiLanguageSearchDropDown.isError = false;
    }

    public warnEmployeeLeft(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        let postParams: Object = {};
        postParams['Function'] = 'WarnEmployeeLeft';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postParams)
            .subscribe((data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data.ErrorMessageDesc)
                        this.modalAdvService.emitError(new ICabsModalVO(data.ErrorMessageDesc));
                    else {
                        let modalVO: ICabsModalVO = new ICabsModalVO();
                        modalVO.closeCallback = this.callConfirm.bind(this);
                        if (this.autoGenProspectWarning) {
                            modalVO.msg = this.autoGenProspectWarning;
                            this.modalAdvService.emitMessage(modalVO);
                        }
                        if (this.getControlValue('LBContactOutcomeMessage')) {
                            if ((this.getControlValue('ContactOutcomeCode') === '06') && ((this.getControlValue('MoreWAS') === 'FALSE'))) {
                                modalVO.msg = this.getControlValue('LBContactOutcomeMessage') + ' ' + 'This is the last Service Cover on this Premises with a Waste Fee - Remember to delete the Premises Invoice Charge';
                                this.modalAdvService.emitMessage(modalVO);
                            } else {
                                modalVO.msg = this.getControlValue('LBContactOutcomeMessage');
                                this.modalAdvService.emitMessage(modalVO);
                            }
                            if (this.getControlValue('InvTypeChangeExists') === 'True') {
                                modalVO.msg = 'WARNING: An Invoice Type Change has been previously applied.You MUST review the credits that may be generated if you proceed with this termination/ cancellation';
                                this.modalAdvService.emitMessage(modalVO);
                            }
                        }
                        if (!this.autoGenProspectWarning && !this.getControlValue('LBContactOutcomeMessage') && this.riExchange.validateForm(this.uiForm))
                            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.promptConfirm.bind(this)));
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    // confirm call back for modalVO emit prompt
    public callConfirm(data: any): void {
        setTimeout(function (): void {
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.promptConfirm.bind(this)));
        }.bind(this), 1000);
    }

    // on confirm
    public promptConfirm(data: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, (this.formMode === this.c_s_MODE_ADD) ? '1' : '2');
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('LostBusinessRequestNumber', this.getControlValue('LostBusinessRequestNumber'));
        this.search.set('LostBusinessContactNumber', this.getControlValue('LostBusinessContactNumber'));
        this.search.set('ContactDate', this.getControlValue('ContactDate'));
        this.search.set('ContactTypeCode', this.getControlValue('ContactTypeCode'));
        this.search.set('ContactOutcomeCode', this.getControlValue('ContactOutcomeCode'));
        this.search.set('SavedValue', this.getControlValue('SavedValue'));
        this.search.set('LostValue', this.getControlValue('LostValue'));
        this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        this.search.set('LostBusinessContactNarrative', this.getControlValue('LostBusinessContactNarrative'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('PremiseName', this.getControlValue('PremiseName'));
        this.search.set('AccountNumber', this.getControlValue('AccountNumber'));
        this.search.set('AccountName', this.getControlValue('AccountName'));
        this.search.set('ProductCode', this.getControlValue('ProductCode'));
        this.search.set('ProductDesc', this.getControlValue('ProductDesc'));
        this.search.set('RequestStatus', this.getControlValue('RequestStatus'));
        this.search.set('CommenceDate', this.getControlValue('CommenceDate'));
        this.search.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        this.search.set('LostBusinessRequestRowID', this.getControlValue('LostBusinessRequestRowID'));
        this.search.set('MoreWAS', this.getControlValue('MoreWAS'));
        this.search.set('ClientContact', this.getControlValue('ClientContact'));
        this.search.set('ClientContactTelephoneNumber', this.getControlValue('ClientContactTelephoneNumber'));
        this.search.set('Password', this.getControlValue('Password'));

        let postParams: Object = {};
        postParams['Function'] = 'WarnEmployeeLeft';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, postParams)
            .subscribe((data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    this.formPristine();
                    this.disableControl('menu', false);
                    this.setControlValue('RequestStatus', data.RequestStatus);
                    if (!this.getControlValue('LostBusinessContactNumber'))
                        this.setControlValue('LostBusinessContactNumber', data.LostBusinessContactNumber);
                    this.afterSave();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    // post successful save
    public afterSave(): void {
        switch (this.getControlValue('ContactOutcomeCode')) {
            case '02':
                this.navigate('Contact', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                break;
            case '03':
                this.navigate('ContactAdd', ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
                break;
            case '04':
                this.navigate('Contact', ContractManagementModuleRoutes.ICABSASERVICECOVERSELECTMAINTENANCE, {
                    'ProRataCharge': ''
                });
                break;
            case '05':
                this.modalAdvService.emitMessage(new ICabsModalVO('iCABSAInactivePremiseInfoMaintenance' + MessageConstant.Message.PageNotDeveloped));
                //riExchange.Mode = "Contact": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAInactivePremiseInfoMaintenance.htm"
                break;
            case '06':
                this.modalAdvService.emitMessage(new ICabsModalVO('iCABSAInactiveServiceCoverInfoMaintenance' + MessageConstant.Message.PageNotDeveloped));
                //riExchange.Mode = "Contact": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAInactiveServiceCoverInfoMaintenance.htm"
                break;
            case '08':
                this.navigate('Contact', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERPRICECHANGEMAINTENANCE, {
                    'Increase': ''
                });
                break;
            case '09':
                this.navigate('Contact', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERPRICECHANGEMAINTENANCE);
                break;
            case '10':
                this.modalAdvService.emitMessage(new ICabsModalVO('iCABSAInactiveContractInfoMaintenance' + MessageConstant.Message.PageNotDeveloped));
                //riExchange.Mode = "Contact": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAInactiveContractInfoMaintenance.htm"
                break;
            case '11':
                this.navigate('ContactUpdate', ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    'PendingDeletion': ''
                });
                break;
            case '12':
                this.navigate('Contact', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERDETAILMAINTENANCE, {
                    'Pending': ''
                });
                break;
        }
    }

    // options dropdown change event
    public menuOnChange(): void {
        this.formPristine();
        switch (this.getControlValue('menu')) {
            case 'detail':
                switch (this.getControlValue('ContactOutcomeCode')) {
                    case '05':
                        //riExchange.Mode = "Contact-View": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAInactivePremiseInfoMaintenance.htm"
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                        break;
                    case '06':
                        //riExchange.Mode = "Contact-View": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAInactiveServiceCoverInfoMaintenance.htm"
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                        break;
                    case '10':
                        //riExchange.Mode = "Contact-View": window.location = "/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAInactiveContractInfoMaintenance.htm"
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.PageNotDeveloped));
                        break;
                    default:
                        if (this.strNoDetailErrorMessage)
                            this.modalAdvService.emitMessage(new ICabsModalVO(this.strNoDetailErrorMessage));
                }
        }
        this.setControlValue('menu', 'Options');
    }

    // cancel functionality
    public onCancelData(): void {
        if ((this.parentMode === 'TrialPeriod') || (this.formMode === 'add')) {
            this.formPristine();
            this.location.back();
        } else {
            this.uiDisplay.isTdPassword = false;
            this.pageParams.isTdPassword = this.uiDisplay.isTdPassword;
            this.lookUpLostBusinessContactData();
            this.getInitialSettings();
        }
    }
}

