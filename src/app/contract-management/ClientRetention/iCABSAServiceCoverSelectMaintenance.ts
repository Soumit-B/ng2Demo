import * as moment from 'moment';
import { InternalSearchModuleRoutes, InternalGridSearchSalesModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Injector } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Observable } from 'rxjs/Observable';
import { URLSearchParams } from '@angular/http';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAServiceCoverSelectMaintenance.html'
})

export class ServiceCoverSelectMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('messageModal') public messageModal;
    public pageId: string = '';
    public controls = [{ name: 'ContractNumber', readonly: false, disabled: false, required: false },
    { name: 'ContractName', readonly: false, disabled: true, required: false },
    { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
    { name: 'PremiseName', readonly: false, disabled: true, required: false },
    { name: 'ProductCode', readonly: false, disabled: false, required: false },
    { name: 'ProductDesc', readonly: false, disabled: true, required: false },
    { name: 'Status', readonly: false, disabled: true, required: false },
    { name: 'ServiceCommenceDate', readonly: false, disabled: true, required: false, type: MntConst.eTypeDate },
    { name: 'ServiceVisitFrequency', readonly: false, disabled: true, required: false },
    { name: 'ServiceQuantity', readonly: false, disabled: true, required: false },
    { name: 'ServiceAnnualValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency },
    { name: 'ActionType', readonly: false, disabled: false, required: false },
    { name: 'CompositeInd', readonly: false, disabled: false, required: false },
    { name: 'LostBusinessRequestNumber', readonly: false, disabled: false, required: false },
    { name: 'AccountNumber', readonly: false, disabled: false, required: false },
    { name: 'AccountName', readonly: false, disabled: false, required: false },
    { name: 'InvoiceFrequencyCode', readonly: false, disabled: false, required: false },
    { name: 'InvoiceAnnivDate', readonly: false, disabled: false, required: false },
    { name: 'GotStatus', readonly: false, disabled: false, required: false },
    { name: 'ServiceCoverROWID', readonly: false, disabled: false, required: false },
    { name: 'findResult', readonly: false, disabled: false, required: false }];

    public ellipseConfig = {
        contractSearchComponent: {
            inputParams: {
                parentMode: 'LookUp',
                businessCode: this.utils.getBusinessCode(),
                countryCode: this.utils.getCountryCode(),
                ContractNumber: '',
                currentContractType: ''
            },
            isDisabled: false,
            isRequired: false,
            showCloseButton: true,
            config: {
                ignoreBackdropClick: true
            },
            showHeader: true,
            autoOpen: false
        },
        premiseSearchComponent: {
            inputParams: {
                parentMode: 'LookUp',
                businessCode: this.utils.getBusinessCode(),
                countryCode: this.utils.getCountryCode(),
                ContractNumber: '',
                ContractName: ''
            },
            isDisabled: false,
            isRequired: false,
            showCloseButton: true,
            config: {
                ignoreBackdropClick: true
            },
            showHeader: true,
            autoOpen: false
        },
        serviceCoverSearchComponent: {
            inputParams: {
                parentMode: 'Search',
                businessCode: this.utils.getBusinessCode(),
                countryCode: this.utils.getCountryCode(),
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: '',
                ProductCode: '',
                ProductDesc: ''
            },
            isDisabled: false,
            isRequired: false,
            showCloseButton: true,
            config: {
                ignoreBackdropClick: true
            },
            showHeader: true,
            autoOpen: false
        }
    };

    public contractSearchComponent = ContractSearchComponent;
    public contractSearchDataReceived(eventObj: any): void {
        this.uiForm.reset();
        this.datePickerConfig.serviceCommencementDate.dt = null;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', eventObj.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', eventObj.ContractName);
        this.ellipseConfig.premiseSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.ellipseConfig.premiseSearchComponent.inputParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
        //this.ellipseConfig.premiseSearchComponent.autoOpen = true;
        this.setFormMode(this.c_s_MODE_UPDATE);
        /*setTimeout(() => {
            this.ellipseConfig.premiseSearchComponent.autoOpen = false;
        }, 100);*/
    }
    public premiseSearchComponent = PremiseSearchComponent;
    public premiseSearchDataReceived(eventObj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', eventObj.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', eventObj.PremiseName);
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseName = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductCode = '';
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductDesc = '';
        this.resetFields();
        //this.ellipseConfig.serviceCoverSearchComponent.autoOpen = true;
        /*setTimeout(() => {
            this.ellipseConfig.serviceCoverSearchComponent.autoOpen = false;
        }, 100);*/
    }
    public serviceCoverSearchComponent = ServiceCoverSearchComponent;
    public serviceCoverSearchDataReceived(eventObj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', eventObj.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', eventObj.ProductDesc);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', eventObj.row.ttServiceCover);
        this.lookupSearch('AfterFetch', true);
    }
    public pageVariables = {
        savecancelFlag: true,
        isRequesting: false
    };
    public uiFormValueChanges: any;
    public xhrParams = {
        method: 'contract-management/maintenance',
        module: 'service-cover',
        operation: 'Application/iCABSAServiceCoverSelectMaintenance'
    };
    public promptConfig = {
        forSave: {
            showPromptMessageHeader: true,
            promptConfirmTitle: '',
            promptConfirmContent: MessageConstant.Message.ConfirmRecord
        },
        promptFlag: 'save',
        config: {
            ignoreBackdropClick: true
        },
        isRequesting: false
    };
    public messageModalConfig = {
        showMessageHeader: true,
        config: {
            ignoreBackdropClick: true
        },
        title: '',
        content: '',
        showCloseButton: true
    };
    public datePickerConfig = {
        serviceCommencementDate: {
            dt: null
        }
    };
    public selectedCommenceDdate(eventObj: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCommenceDate', eventObj.value);
    }
    public dropdownConfig = {
        menu: {
            dropdownValues: []
        }
    };
    public menu = '';
    public formKeys = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERSELECTMAINTENANCE;
        this.pageTitle = '';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = this.riExchange.getCurrentContractTypeLabel() + ' Service Cover Select';
        this.ellipseConfig.contractSearchComponent.inputParams.currentContractType = this.riExchange.getCurrentContractType();
        this.initForm();
        this.uiFormValueChanges = this.uiForm.statusChanges.subscribe((value: any) => {
            this.formChanges(value);
        });
        this.checkUrlParams();
        this.logicOnParentMode();
        this.getFormKeys();
        this.utils.setTitle(this.pageTitle);
    }
    public ngAfterViewInit(): void {
        if (!this.isReturningFlag) {
            if (this.parentMode !== 'Contact') {
                this.ellipseConfig.contractSearchComponent.autoOpen = true;
            }
            setTimeout(() => {
                this.ellipseConfig.contractSearchComponent.autoOpen = false;
            }, 0);
        } else {
            this.ellipseConfig.premiseSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipseConfig.premiseSearchComponent.inputParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
            this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseName = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCommenceDate', this.formData['ServiceCommenceDate']);
        }
    }
    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.uiFormValueChanges.unsubscribe();
    }
    public resetFields(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'Status', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceQuantity', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceAnnualValue', '');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCommenceDate', '');
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductCode = '';
        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductDesc = '';
        this.datePickerConfig.serviceCommencementDate.dt = void 0;
    }
    public checkUrlParams(): void {
        if (!this.URLParameterContains('Pending')) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ActionType', 'Pending');
            this.dropdownConfig.menu.dropdownValues = [{ text: 'Service Cover', value: 'Service Cover' }, { text: 'Request', value: 'Request' }];
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ActionType', '');
            this.dropdownConfig.menu.dropdownValues = [{ text: 'Pro Rata Charge', value: 'Pro Rata Charge' }];
        }
    }
    public logicOnParentMode(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessRequestNumber', this.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentHTMLValue('ServiceCoverROWID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractTypeCode', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        let parentMode = this.riExchange.getParentMode();
        switch (parentMode) {
            case 'Contact':
            case 'ServiceCoverLocation':
            case 'ServiceCoverLocationMove':
            case 'ContactManagement':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'LostBusinessRequestNumber', this.riExchange.getParentHTMLValue('LostBusinessRequestNumber'));
                if (parentMode === 'Contact') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.riExchange.getParentHTMLValue('AccountName'));
                    this.ellipseConfig.premiseSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                    this.ellipseConfig.premiseSearchComponent.inputParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseName = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDesc');
                }
                //this.lookupSearch('AfterFetch'); //TO Do: fetch functionality
                break;
            default:
                break;
        }
    }
    public formChanges(obj: any): void {
        if (obj === 'VALID') {
            this.pageVariables.savecancelFlag = false;
        } else {
            this.pageVariables.savecancelFlag = true;
        }
    }
    public initForm(): void {
        this.riExchange.renderForm(this.uiForm, this.controls);
    }
    public promptConfirm(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                //console.log('Prompt Closing');
                break;
            default:
                break;
        }
    }

    public promptCancel(eventObj: any): void {
        switch (this.promptConfig.promptFlag) {
            case 'save':
                //console.log('Prompt Closing');
                break;
            default:
                break;
        }
    }

    public errorMessageModal(msg?: string): void {
        this.messageModalConfig.content = MessageConstant.Message.noRecordFound;
        msg = msg || MessageConstant.Message.noRecordFound;
        this.messageModal.show({ msg: msg }, false);
    }

    public lookupSearch(key: string, passRowId?: boolean): void {
        switch (key) {
            case 'ContractNumber':
                let contractNumber;
                contractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                if (contractNumber.toString() === '') {
                    this.setFormMode(this.c_s_MODE_SELECT);
                    this.uiForm.reset();
                    this.datePickerConfig.serviceCommencementDate.dt = null;
                    this.ellipseConfig.premiseSearchComponent.inputParams.ContractNumber = '';
                    this.ellipseConfig.premiseSearchComponent.inputParams.ContractName = '';
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractNumber = '';
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractName = '';
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductCode = '';
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductDesc = '';
                    break;
                }
                contractNumber = this.utils.fillLeadingZeros(contractNumber, 8);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', contractNumber);
                let queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                let lookupQuery: any;
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                    'table': 'Contract',
                    'query': { 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['ContractName']
                }];
                this.pageVariables.isRequesting = true;
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                    value => {
                        if (value.results) {
                            if (value.results[0].length === 0) {
                                this.errorMessageModal();
                                this.setFormMode(this.c_s_MODE_SELECT);
                                this.uiForm.reset();
                                this.datePickerConfig.serviceCommencementDate.dt = null;
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', contractNumber);
                            } else {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', value.results[0][0].ContractName);
                                this.ellipseConfig.premiseSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                                this.ellipseConfig.premiseSearchComponent.inputParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                                this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                                this.ellipseConfig.serviceCoverSearchComponent.inputParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                                this.setFormMode(this.c_s_MODE_UPDATE);
                            }
                        } else {
                            this.errorMessageModal();
                            this.setFormMode(this.c_s_MODE_SELECT);
                            this.uiForm.reset();
                            this.datePickerConfig.serviceCommencementDate.dt = null;
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', contractNumber);
                        }
                        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductCode = '';
                        this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductDesc = '';
                    },
                    error => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    },
                    () => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    }
                );
                break;
            case 'PremiseNumber':
                let premiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                if (premiseNumber.toString() === '') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.resetFields();
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseNumber = '';
                    this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseName = '';
                    break;
                }
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                    'table': 'Premise',
                    'query': { 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'), 'BusinessCode': this.utils.getBusinessCode(), 'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') },
                    'fields': ['PremiseName']
                }];
                this.pageVariables.isRequesting = true;
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                    value => {
                        if (value.results !== null) {
                            if (value.results[0].length === 0) {
                                this.errorMessageModal();
                            } else {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', value.results[0][0].PremiseName);
                                this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                                this.ellipseConfig.serviceCoverSearchComponent.inputParams.PremiseName = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
                            }
                            //this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                            this.resetFields();
                        }
                        else {
                            this.errorMessageModal();
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                            this.resetFields();
                        }
                    },
                    error => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    },
                    () => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    }
                );
                break;
            case 'ProductCode':
                let productCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
                if (productCode.toString() === '') {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.resetFields();
                    break;
                }
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                queryParams.set(this.serviceConstants.Action, '5');
                lookupQuery = [{
                    'table': 'Product',
                    'query': { 'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'), 'BusinessCode': this.utils.getBusinessCode() },
                    'fields': ['ProductDesc']
                }];
                this.pageVariables.isRequesting = true;
                this.ajaxSource.next(this.ajaxconstant.START);
                this.invokeLookupSearch(queryParams, lookupQuery).subscribe(
                    value => {
                        if (value.results[0] !== null) {
                            if (value.results[0].length === 0) {
                                this.errorMessageModal();
                            } else {
                                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', value.results[0][0].ProductDesc);
                                this.lookupSearch('AfterFetch');
                            }
                            //this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                            this.resetFields();
                        } else {
                            this.errorMessageModal();
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                            this.resetFields();
                        }
                    },
                    error => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    },
                    () => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.pageVariables.isRequesting = false;
                    }
                );
                break;
            case 'AfterFetch':
                queryParams = new URLSearchParams();
                queryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
                queryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
                if (passRowId === true) {
                    queryParams.set('ServiceCoverROWID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID'));
                }
                queryParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                queryParams.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
                queryParams.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
                queryParams.set('ContractTypeCode', this.riExchange.getCurrentContractType());
                queryParams.set(this.serviceConstants.Action, '0');
                this.ajaxSource.next(this.ajaxconstant.START);
                let dlContract = this.httpService.makeGetRequest(
                    this.xhrParams.method,
                    this.xhrParams.module,
                    this.xhrParams.operation,
                    queryParams
                ).subscribe(
                    (data) => {
                        if (data['status'] === GlobalConstant.Configuration.Failure) {
                            this.errorService.emitError(data['oResponse']);
                        } else if (data['errorMessage']) {
                            this.errorMessageModal(data['errorMessage'] + ' ' + data['fullError']);
                            this.resetFields();
                            return;
                        }
                        if (data['findResult'] && data['findResult'].toUpperCase().indexOf('MULTI') >= 0) {
                            this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
                            this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDesc');
                            this.ellipseConfig.serviceCoverSearchComponent.autoOpen = true;
                            setTimeout(() => {
                                this.ellipseConfig.serviceCoverSearchComponent.autoOpen = false;
                            }, 0);
                        } else {
                            this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductCode = '';
                            this.ellipseConfig.serviceCoverSearchComponent.inputParams.ProductDesc = '';
                        }
                        for (let key in data) {
                            if (key) {
                                if (this.formKeys.indexOf(key) > -1) {
                                    this.riExchange.riInputElement.SetValue(this.uiForm, key, data[key]);
                                    if (key === 'ServiceCommenceDate') {
                                        this.datePickerConfig.serviceCommencementDate.dt = data[key];
                                    }
                                }
                                if (key === 'ServiceCover') {
                                    this.setControlValue('ServiceCoverROWID', data['ServiceCover']);
                                }
                            }
                        }
                    });
                    if (this.riExchange.URLParameterContains('ProRataCharge')) {
                        if (this.parentMode === 'Contact')
                            this.navigate('ServiceCoverAdd', InternalMaintenanceSalesModuleRoutes.ICABSAPRORATACHARGEMAINTENANCE, {
                                ServiceCoverRowID: this.getControlValue('ServiceCoverROWID')
                            });
                        else
                            this.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY, {});
                    }
                break;
            default:
                break;
        }
    }
    /**
     * Making the lookup API call
     */
    public invokeLookupSearch(queryParams: any, data: any): Observable<any> {
        this.ajaxSource.next(this.ajaxconstant.START);
        return this.httpService.lookUpRequest(queryParams, data);
    }

    public getFormKeys(): void {
        for (let j = 0; j < this.controls.length; j++) {
            this.formKeys.push(this.controls[j].name);
        }
    }

    public messageModalClose(): void {
        //console.log('modal closed');
    }

    public URLParameterContains(param: string): boolean {
        let flag = false;
        let routerParams = this.riExchange.routerParams;
        for (let key in routerParams) {
            if (key.indexOf(param) > -1) flag = true;
        }
        return flag;
    };
    public menuOnchange(): void {
        let menu = this.menu;
        switch (menu) {
            case 'Request':
                this.navigate('ServiceCover', InternalSearchModuleRoutes.ICABSALOSTBUSINESSREQUESTSEARCH, {
                    parentMode: 'ContactManagement',
                    mode: 'ServiceCover',
                    ServiceCoverROWID: this.getControlValue('ServiceCoverROWID'),
                    CurrentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel()
                });
                break;
            case 'Service Cover':
                //TO DO: iCABSALostBusinessRequestSearch is not created
                this.navigate('Request', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    parentMode: 'Request',
                    mode: 'Request',
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    PremiseName: this.getControlValue('PremiseName'),
                    ProductCode: this.getControlValue('ProductCode'),
                    ProductDesc: this.getControlValue('ProductDesc')
                });
                //this.messageModal.show({ msg: 'iCABSAServiceCoverMaintenance is under construction', title: 'Message' }, false);
                break;
            case 'Pro Rata Charge':
                this.navigate('ServiceCover', InternalGridSearchSalesModuleRoutes.ICABSAPRORATACHARGESUMMARY, { parentMode: 'ServiceCover', mode: 'ServiceCover' });
                break;
            default:
                break;
        }
    }
    public searchFunctionality(): void {
        //TO Do: will be implemented when asked
        this.lookupSearch('AfterFetch');
    }

}
