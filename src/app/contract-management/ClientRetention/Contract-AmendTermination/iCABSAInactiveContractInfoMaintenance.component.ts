import { Component, OnInit, OnDestroy, Injector, AfterViewInit, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { DatepickerComponent } from './../../../../shared/components/datepicker/datepicker';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { LostBusinessLanguageSearchComponent } from './../../../internal/search/iCABSBLostBusinessLanguageSearch.component';
import { LostBusinessDetailLanguageSearchComponent } from './../../../internal/search/iCABSBLostBusinessDetailLanguageSearch.component';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { InternalMaintenanceSalesModuleRoutes } from './../../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAInactiveContractInfoMaintenance.html'
})

export class InactiveContractInfoMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('icabsLostBusinessLang') icabsLostBusinessLang: LostBusinessDetailLanguageSearchComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('inactiveEffectiveDate') inactiveEffectiveDate: DatepickerComponent;
    private contractTypeCode: string;
    private inputParams: any = {
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        operation: 'Application/iCABSAInactiveContractInfoMaintenance'
    };

    public pageId: string = '';
    public pageTitle: string;
    public numberLabel: string;
    public isLostBusiness: boolean = true;
    public isText: boolean = true;
    public isContact: boolean = true;
    public isVisitNarrative: boolean = true;
    public isRemovalVisitNotes: boolean = true;
    public isEffectDate: boolean = true;
    public isAutoOpenContract: boolean = false;
    public isLostBusinessDetail: boolean = true;
    public isContractAnnualValue: boolean = true;
    public isCancelProRata: boolean = false;
    public islostBusinessDetailsDisabled: boolean = true;
    public islostBusinessDisabled: boolean = true;
    public isBtnSaveDisable: boolean = true;
    public isEmployeeValid: boolean = false;
    public inputParamsContractSearch: any = {
        parentMode: 'Search-Inactive'
    };
    public currentContractTypeLabel: string;
    public contrctSearch: any = ContractSearchComponent;
    public employeeSearch: any = EmployeeSearchComponent;
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText },
        { name: 'Status', disabled: true, type: MntConst.eTypeText },
        { name: 'AccountNumber', disabled: true, type: MntConst.eTypeText },
        { name: 'AccountName', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractAddressLine1', disabled: true, type: MntConst.eTypeText },
        { name: 'NegBranchNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'BranchName', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractAddressLine2', disabled: true, type: MntConst.eTypeText },
        { name: 'InvoiceAnnivDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'ContractAddressLine3', disabled: true, type: MntConst.eTypeText },
        { name: 'InvoiceFrequencyCode', disabled: true, type: MntConst.eTypeInteger },
        { name: 'ContractAddressLine4', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractAddressLine5', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractAnnualValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'ContractPostcode', disabled: true, type: MntConst.eTypeText },
        { name: 'LostBusinessCode', type: MntConst.eTypeCode, required: true, value: '' },
        { name: 'LostBusinessDesc', type: MntConst.eTypeText },
        { name: 'LostBusinessDetailCode', type: MntConst.eTypeCode, value: '', required: true },
        { name: 'LostBusinessDetailDesc', type: MntConst.eTypeText },
        { name: 'InactiveEffectDate', type: MntConst.eTypeDate, required: true },
        { name: 'EmployeeSurname', disabled: true, type: MntConst.eTypeText },
        { name: 'CommissionEmployeeCode', type: MntConst.eTypeCode },
        { name: 'SalesEmployeeText', type: MntConst.eTypeText },
        { name: 'InactiveContractText', type: MntConst.eTypeText },
        { name: 'VisitNarrativeCode', type: MntConst.eTypeCode },
        { name: 'VisitNarrativeDesc', type: MntConst.eTypeText },
        { name: 'RemovalVisitText', type: MntConst.eTypeText },
        { name: 'CreateContact' },
        { name: 'CancelProRataChargeInd' },
        { name: 'LostBusinessRequestNumber', type: MntConst.eTypeInteger },
        { name: 'ActionType' },
        { name: 'CurrentContractType' },
        { name: 'ContractCommenceDate', type: MntConst.eTypeDate, disabled: true },
        { name: 'DetailRequiredInd' },
        { name: 'UninvoicedProRataExist' },
        { name: 'InfoMessage' },
        { name: 'InactiveContractInfoStatus' },
        { name: 'ErrorMessageDesc' }

    ];
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public inputParamsLostBusinessSearch: any = {
        parentMode: 'LookUp-Active'
    };
    public inputParamsLostBusinessDetailSearch: any = {
        parentMode: 'LookUp'
    };
    public activeLostBusinessSearch: any = {
        id: '',
        text: ''
    };
    public activeLostBusinessDetailSearch: any = {
        id: '',
        text: ''
    };

    public dropdown: any = {
        lostBusiness: {
            isRequired: false,
            isDisabled: true,
            isTriggerValidate: false,
            inputParams: {
                parentMode: 'LookUp-Active',
                languageCode: this.riExchange.LanguageCode()
            }
        },
        lostBusinessDetails: {
            isRequired: false,
            isDisabled: false,
            isTriggerValidate: false,
            inputParams: {
                parentMode: 'LookUp'
            }
        }
    };

    public ellipsis: any = {
        employeeSearch: {
            contentComponent: this.employeeSearch,
            childConfigParams: {
                parentMode: 'LookUp-Commission'
            }
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINACTIVECONTRACTINFOMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Contract Terminate Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.disableControls(['ContractNumber', 'LostBusinessCode', 'LostBusinessDetailCode']);
    }

    public ngAfterViewInit(): void {
        this.isAutoOpenContract = true;
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        this.setCurrentContractType();
        if (this.parentMode === 'Contact' || this.parentMode === 'Contact-View') {
            this.riExchange.getParentHTMLValue('ContractNumber');
            this.riExchange.getParentHTMLValue('ContractName');
            this.riExchange.getParentHTMLValue('LostBusinessRequestNumber');
        }
        this.numberLabel = this.currentContractTypeLabel + ' ' + 'Number';
        if (this.URLParameterContains('reinstate')) {
            this.pageTitle = this.currentContractTypeLabel + ' Reinstate Maintenance';
            this.utils.setTitle(this.pageTitle);
            this.isText = false;
            this.isLostBusiness = false;
            this.setRequiredStatus('LostBusinessCode', false);
            this.isContact = false;
            this.setControlValue('ActionType', 'Reinstate');
            this.isVisitNarrative = false;
            this.isRemovalVisitNotes = false;
        } else if (this.URLParameterContains('cancel')) {
            this.pageTitle = this.currentContractTypeLabel + ' Cancel Maintenance';
            this.utils.setTitle(this.pageTitle);
            this.isLostBusiness = false;
            this.setRequiredStatus('LostBusinessCode', false);
            this.isEffectDate = false;
            this.isContact = false;
            this.setControlValue('ActionType', 'Cancel');
            this.inputParamsContractSearch.parentMode = 'Search';
        }
        this.inputParamsContractSearch['currentContractType'] = this.getControlValue('CurrentContractType');
    }

    private setCurrentContractType(): void {
        this.currentContractTypeLabel = this.utils.getCurrentContractLabel(this.riExchange.getParentHTMLValue('CurrentContractType'));
    }

    private URLParameterContains(parameter: string): boolean {
        let url = window.location.href;
        if (url.indexOf('/' + parameter + '?') !== -1)
            return true;
        return false;
    }

    private contractBeforeFetch(): void {
        if (this.getControlValue('ContractNumber')) {
            let search: URLSearchParams = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '6');
            let formData: any = {};
            formData[this.serviceConstants.ContractNumber] = this.getControlValue('ContractNumber');
            formData['ContractTypeCode'] = this.getControlValue('CurrentContractType');
            formData[this.serviceConstants.Function] = 'CheckContractType';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, search, formData).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.callContractDetails();
                    }

                }, (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        } else {
            this.uiForm.reset();
            this.setCurrentContractType();
            this.disableControls(['ContractNumber']);
            this.islostBusinessDetailsDisabled = true;
            this.islostBusinessDisabled = true;
            this.isBtnSaveDisable = true;
            this.activeLostBusinessSearch = {
                id: '',
                text: ''
            };
            this.activeLostBusinessDetailSearch = {
                id: '',
                text: ''
            };
            this.dropdown.lostBusiness.isDisabled = true;
            this.dropdown.lostBusinessDetails.isDisabled = true;
        }
    }

    private callContractDetails(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.ContractNumber, this.getControlValue('ContractNumber'));
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.Function, 'CheckContractType');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.formPristine();
                    this.riExchange.riInputElement.Enable(this.uiForm, 'InactiveEffectDate');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'CommissionEmployeeCode');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'SalesEmployeeText');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'InactiveContractText');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'VisitNarrativeCode');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'RemovalVisitText');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'CreateContact');
                    this.riExchange.riInputElement.Enable(this.uiForm, 'CancelProRataChargeInd');
                    this.setRequiredStatus('InactiveEffectDate', true);
                    this.islostBusinessDetailsDisabled = false;
                    this.islostBusinessDisabled = false;
                    this.setControlValue('AccountNumber', data.AccountNumber);
                    this.setControlValue('CancelProRataChargeInd', data.CancelProRataChargeInd === 'yes');
                    this.setControlValue('CommissionEmployeeCode', data.CommissionEmployeeCode);
                    this.setControlValue('ContractAddressLine1', data.ContractAddressLine1);
                    this.setControlValue('ContractAddressLine2', data.ContractAddressLine2);
                    this.setControlValue('ContractAddressLine3', data.ContractAddressLine3);
                    this.setControlValue('ContractAddressLine4', data.ContractAddressLine4);
                    this.setControlValue('ContractAddressLine5', data.ContractAddressLine5);
                    this.setControlValue('ContractAnnualValue', data.ContractAnnualValue);
                    this.setControlValue('ContractCommenceDate', data.ContractCommenceDate);
                    this.setControlValue('ContractName', data.ContractName);
                    this.setControlValue('ContractPostcode', data.ContractPostcode);
                    this.setControlValue('DetailRequiredInd', data.DetailRequiredInd === 'yes');
                    this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                    this.setControlValue('InactiveContractText', data.InactiveContractText);
                    this.setControlValue('InactiveEffectDate', data.InactiveEffectDate);
                    this.setControlValue('InvoiceAnnivDate', data.InvoiceAnnivDate);
                    this.setControlValue('InvoiceFrequencyCode', data.InvoiceFrequencyCode);
                    this.setControlValue('LostBusinessCode', data.LostBusinessCode);
                    this.setControlValue('LostBusinessDetailCode', data.LostBusinessDetailCode);
                    this.setControlValue('NegBranchNumber', data.NegBranchNumber);
                    this.setControlValue('RemovalVisitText', data.RemovalVisitText);
                    this.setControlValue('CreateContact', false);
                    this.setControlValue('Status', data.Status);
                    this.setControlValue('UninvoicedProRataExist', data.UninvoicedProRataExist === 'yes');
                    this.setControlValue('VisitNarrativeCode', data.VisitNarrativeCode);
                    this.activeLostBusinessSearch = {
                        id: this.getControlValue('LostBusinessCode'),
                        text: this.getControlValue('LostBusinessCode') ? this.getControlValue('LostBusinessCode') + ' - ' + data.LostBusinessDesc : ''
                    };
                    this.activeLostBusinessDetailSearch = {
                        id: this.getControlValue('LostBusinessDetailCode'),
                        text: this.getControlValue('LostBusinessDetailCode') + ' - ' + data.LostBusinessDetailDesc
                    };
                    this.dropdown.lostBusinessDetails.inputParams.LostBusinessCode = this.getControlValue('LostBusinessCode');
                    this.icabsLostBusinessLang.fetchDropDownData();
                    this.dropdown.lostBusiness.isDisabled = false;
                    this.dropdown.lostBusiness.isRequired = true;
                    this.dropdown.lostBusinessDetails.isDisabled = false;
                    this.dropdown.lostBusinessDetails.isRequired = true;
                    this.inputParams['LostBusinessCode'] = this.getControlValue('LostBusinessCode');
                    this.inputParams['LostBusinessDesc'] = data.LostBusinessDesc;
                    this.inputParams['LostBusinessDetailCode'] = this.getControlValue('LostBusinessDetailCode');
                    this.inputParams['LostBusinessDetailDesc'] = data.LostBusinessDetailDesc;
                    this.inputParams['InactiveEffectDate'] = this.getControlValue('InactiveEffectDate');
                    this.inputParams['CommissionEmployeeCode'] = this.getControlValue('CommissionEmployeeCode');
                    this.inputParams['EmployeeSurname'] = this.getControlValue('EmployeeSurname');
                    this.inputParams['InactiveContractText'] = this.getControlValue('InactiveContractText');
                    this.inputParams['VisitNarrativeCode'] = this.getControlValue('VisitNarrativeCode');
                    this.inputParams['RemovalVisitText'] = this.getControlValue('RemovalVisitText');
                    this.inputParams['CancelProRataChargeInd'] = this.getControlValue('CancelProRataChargeInd');
                    this.inputParams['SalesEmployeeText'] = this.getControlValue('SalesEmployeeText');
                    this.inputParams['CreateContact'] = this.getControlValue('CreateContact');
                    this.doLookUpCall();
                    this.afterSave();
                    this.beforeUpdate();
                    this.displayFields();
                    this.hideShowFields();
                    if (this.URLParameterContains('reinstate') && !this.getControlValue('InactiveEffectDate')) {
                        this.disableControls(['ContractNumber']);
                    }
                }

            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });

    }

    private displayFields(): void {
        this.isLostBusinessDetail = true;
        this.dropdown.lostBusinessDetails.isRequired = true;
        this.isContact = false;
        this.setRequiredStatus('LostBusinessDetailCode', false);
        if (this.getControlValue('DetailRequiredInd') && this.isLostBusiness) {
            this.isLostBusinessDetail = false;
            this.isContact = !(this.parentMode === 'Contact');
            this.setRequiredStatus('LostBusinessDetailCode', true);
        }
    }

    private doLookUpCall(): void {
        let lookupIP = [
            {
                'table': 'Employee',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'EmployeeCode': this.getControlValue('CommissionEmployeeCode')
                },
                'fields': ['EmployeeSurname']
            },
            {
                'table': 'Account',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'AccountNumber': this.getControlValue('AccountNumber')
                },
                'fields': ['AccountName']
            },
            {
                'table': 'Branch',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'BranchNumber': this.getControlValue('NegBranchNumber')
                },
                'fields': ['BranchName']
            }
        ];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            this.setControlValue('EmployeeSurname', '');
            this.setControlValue('AccountName', '');
            this.setControlValue('BranchName', '');
            let employeeRecord = data[0][0];
            let accountRecord = data[1][0];
            let branchRecord = data[2][0];
            if (employeeRecord) {
                this.setControlValue('EmployeeSurname', employeeRecord.EmployeeSurname);
                this.inputParams['EmployeeSurname'] = this.getControlValue('EmployeeSurname');
            }
            if (accountRecord) {
                this.setControlValue('AccountName', accountRecord.AccountName);
            }
            if (branchRecord) {
                this.setControlValue('BranchName', branchRecord.BranchName);
            }
        }).catch(e => {
            this.setControlValue('EmployeeSurname', '');
            this.setControlValue('AccountName', '');
            this.setControlValue('BranchName', '');
        });;
    }

    private hideShowFields(): void {
        this.isContractAnnualValue = false;
        this.isCancelProRata = false;
        if (this.riExchange.ClientSideValues.Fetch('FullAccess') === 'Full' || this.utils.getBranchCode() === this.getControlValue('NegBranchNumber')) {
            this.isContractAnnualValue = true;
        }
        if (this.getControlValue('UninvoicedProRataExist') && this.URLParameterContains('cancel')) {
            this.isCancelProRata = true;
        }

    }

    private afterSave(): void {
        if (this.getControlValue('InactiveEffectDate')) {
            this.setControlValue('InactiveContractInfoStatus', 'Update');
            if (this.URLParameterContains('reinstate'))
                this.setControlValue('InactiveContractInfoStatus', 'Reinst');
            this.isBtnSaveDisable = false;
        } else {
            this.setControlValue('InactiveContractInfoStatus', 'Term');
            this.isBtnSaveDisable = false;
            if (this.URLParameterContains('cancel')) {
                this.setControlValue('InactiveContractInfoStatus', 'Cancel');
                this.isBtnSaveDisable = false;
            }
            if (this.URLParameterContains('reinstate')) {
                this.isBtnSaveDisable = true;
            }
        }

    }


    private beforeUpdate(): void {
        this.riExchange.riInputElement.Enable(this.uiForm, 'CommissionEmployeeCode');
        if (!this.URLParameterContains('cancel') && this.getControlValue('InactiveEffectDate')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'InactiveEffectDate');
            this.setRequiredStatus('InactiveEffectDate', false);
        }
        if (this.getControlValue('InactiveContractInfoStatus') === 'Update' && !this.URLParameterContains('cancel')) {
            this.riExchange.riInputElement.Disable(this.uiForm, 'CommissionEmployeeCode');
        }
    }

    private callServiceForLostBusinessDetailRequired(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        let formData: any = {
            LostBusinessCode: this.getControlValue('LostBusinessCode'),
            Function: 'LostBusinessDetailRequired'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, search, formData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.setControlValue('DetailRequiredInd', data.DetailRequiredInd === 'yes' ? true : false);
                this.displayFields();

            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private shoWWarnMessage(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        let formData: any = {
            ContractNumber: this.getControlValue('ContractNumber'),
            InactiveEffectDate: this.getControlValue('InactiveEffectDate'),
            Function: 'WarnAnniversaryDate'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, search, formData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private warnCancel(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '6');
        let formData: any = {
            ContractNumber: this.getControlValue('ContractNumber'),
            Function: 'WarnCancel'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, search, formData).subscribe(
            (data) => {
                let promptVO: ICabsModalVO = new ICabsModalVO();
                if (data.hasOwnProperty('ErrorMessageDesc') && !this.doLookUpCallForEmployee())
                    promptVO.closeCallback = this.onCancelConfrim.bind(this);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    promptVO.msg = data.errorMessage;
                    promptVO.fullError = data.fullError;
                    this.modalAdvService.emitMessage(promptVO);
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private onReinstateConfirmCallback(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        let formData: any = {
            ContractNumber: this.getControlValue('ContractNumber'),
            InactiveEffectDate: this.getControlValue('InactiveEffectDate'),
            CommissionEmployeeCode: this.getControlValue('CommissionEmployeeCode'),
            ActionType: this.getControlValue('ActionType'),
            LostBusinessRequestNumber: this.getControlValue('LostBusinessRequestNumber'),
            ContractTypeCode: this.getControlValue('CurrentContractType'),
            SalesEmployeeText: this.getControlValue('SalesEmployeeText'),
            InvoiceAnnivDate: this.getControlValue('InvoiceAnnivDate'),
            InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode'),
            ContractName: this.getControlValue('ContractName'),
            ContractAnnualValue: this.getControlValue('ContractAnnualValue'),
            ContractCommenceDate: this.getControlValue('ContractCommenceDate'),
            AccountNumber: this.getControlValue('AccountNumber'),
            ErrorMessageDesc: this.getControlValue('ErrorMessageDesc'),
            NegBranchNumber: this.getControlValue('NegBranchNumber'),
            CreateContact: this.getControlValue('CreateContact') ? 'yes' : 'no',
            UninvoicedProRataExist: this.getControlValue('UninvoicedProRataExist') ? 'yes' : 'no',
            CancelProRataChargeInd: this.getControlValue('CancelProRataChargeInd') ? 'yes' : 'no',
            InfoMessage: this.getControlValue('InfoMessage'),
            Function: 'CheckContractType'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, search, formData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.afterValueSave();
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                this.formPristine();
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private onConfirmCallback(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        let formData: any = {
            ContractNumber: this.getControlValue('ContractNumber'),
            LostBusinessCode: this.getControlValue('LostBusinessCode'),
            LostBusinessDetailCode: this.getControlValue('LostBusinessDetailCode'),
            InactiveEffectDate: this.getControlValue('InactiveEffectDate'),
            CommissionEmployeeCode: this.getControlValue('CommissionEmployeeCode'),
            InactiveContractText: this.getControlValue('InactiveContractText'),
            VisitNarrativeCode: this.getControlValue('VisitNarrativeCode'),
            RemovalVisitText: this.getControlValue('RemovalVisitText'),
            ActionType: this.getControlValue('ActionType'),
            LostBusinessRequestNumber: this.getControlValue('LostBusinessRequestNumber'),
            ContractTypeCode: this.getControlValue('CurrentContractType'),
            SalesEmployeeText: this.getControlValue('SalesEmployeeText'),
            InvoiceAnnivDate: this.getControlValue('InvoiceAnnivDate'),
            InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode'),
            ContractName: this.getControlValue('ContractName'),
            ContractAnnualValue: this.getControlValue('ContractAnnualValue'),
            ContractCommenceDate: this.getControlValue('ContractCommenceDate'),
            AccountNumber: this.getControlValue('AccountNumber'),
            ErrorMessageDesc: this.getControlValue('ErrorMessageDesc'),
            NegBranchNumber: this.getControlValue('NegBranchNumber'),
            CreateContact: this.getControlValue('CreateContact') ? 'yes' : 'no',
            UninvoicedProRataExist: this.getControlValue('UninvoicedProRataExist') ? 'yes' : 'no',
            CancelProRataChargeInd: this.getControlValue('CancelProRataChargeInd') ? 'yes' : 'no',
            InfoMessage: this.getControlValue('InfoMessage'),
            Function: 'GetVisitNarrativeDesc'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, search, formData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.afterValueSave();
                this.setControlValue('InfoMessage', data.InfoMessage);
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                this.formPristine();
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private doLookUpCallForEmployee(): boolean {
        this.isEmployeeValid = false;
        if (this.getControlValue('CommissionEmployeeCode')) {
            let lookupIP = [
                {
                    'table': 'Employee',
                    'query': {
                        'BusinessCode': this.businessCode(),
                        'EmployeeCode': this.getControlValue('CommissionEmployeeCode')
                    },
                    'fields': ['EmployeeSurname']
                }
            ];
            this.LookUp.lookUpPromise(lookupIP).then((data) => {
                let Employee = data[0][0];
                if (Employee) {
                    this.setControlValue('EmployeeSurname', Employee.EmployeeSurname);
                    this.isEmployeeValid = false;
                } else {
                    this.isEmployeeValid = true;
                }
            }).catch(e => {
                this.isEmployeeValid = true;
            });
        }
        return this.isEmployeeValid;
    }

    public onCancelClick(): void {
        this.formPristine();
        if (!this.inputParams.LostBusinessCode) {
            this.isLostBusinessDetail = true;
        }
        this.setControlValue('LostBusinessCode', this.inputParams.LostBusinessCode);
        this.setControlValue('LostBusinessDesc', this.inputParams.LostBusinessDesc);
        this.setControlValue('LostBusinessDetailCode', this.inputParams.LostBusinessDetailCode);
        this.setControlValue('LostBusinessDetailDesc', this.inputParams.LostBusinessDetailDesc);
        this.setControlValue('InactiveEffectDate', this.inputParams.InactiveEffectDate);
        this.setControlValue('CommissionEmployeeCode', this.inputParams.CommissionEmployeeCode);
        this.setControlValue('EmployeeSurname', this.inputParams.EmployeeSurname);
        this.setControlValue('InactiveContractText', this.inputParams.InactiveContractText);
        this.setControlValue('VisitNarrativeCode', this.inputParams.VisitNarrativeCode);
        this.setControlValue('RemovalVisitText', this.inputParams.RemovalVisitText);
        this.setControlValue('CancelProRataChargeInd', this.inputParams.CancelProRataChargeInd);
        this.setControlValue('SalesEmployeeText', this.inputParams.SalesEmployeeText);
        this.setControlValue('CreateContact', this.inputParams.CreateContact);
        this.activeLostBusinessSearch = {
            id: this.getControlValue('LostBusinessCode'),
            text: this.getControlValue('LostBusinessCode') ? this.getControlValue('LostBusinessCode') + ' - ' + this.getControlValue('LostBusinessDesc') : ''
        };
        this.activeLostBusinessDetailSearch = {
            id: this.getControlValue('LostBusinessDetailCode'),
            text: this.getControlValue('LostBusinessDetailCode') + ' - ' + this.getControlValue('LostBusinessDetailDesc')
        };
    }

    public onContractSearchDataReturn(data: any): void {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.contractBeforeFetch();
    }

    public onVisitNarrativeCodeChange(event: any): void {
        if (this.getControlValue('VisitNarrativeCode')) {
            let search: URLSearchParams = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '6');
            let formData: any = {
                VisitNarrativeCode: this.getControlValue('VisitNarrativeCode'),
                Function: 'GetVisitNarrativeDesc'
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, search, formData).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        return;
                    }
                    this.setControlValue('VisitNarrativeDesc', data.VisitNarrativeDesc);

                }, (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        } else {
            this.setControlValue('VisitNarrativeCode', '');
        }

    }


    public onContractNumberChange(event: any): void {
        this.setControlValue('ContractNumber', event.target.value);
        this.contractBeforeFetch();
    }

    public onLostBusinessLanguageSearch(data: any): void {
        this.dropdown.lostBusinessDetails.inputParams.LostBusinessCode = data['LostBusinessLang.LostBusinessCode'];
        this.icabsLostBusinessLang.fetchDropDownData();
        this.setControlValue('LostBusinessCode', data['LostBusinessLang.LostBusinessCode']);
        this.setControlValue('LostBusinessDesc', data['LostBusinessLang.LostBusinessDesc']);
        this.setControlValue('LostBusinessDetailCode', '');
        this.setControlValue('LostBusinessDetailDesc', '');
        if (this.inputParams['LostBusinessCode'] !== this.getControlValue('LostBusinessCode'))
            this.uiForm.controls['LostBusinessCode'].markAsDirty();
        else
            this.uiForm.controls['LostBusinessCode'].markAsPristine();
        this.activeLostBusinessDetailSearch = {
            id: '',
            text: ''
        };
        this.callServiceForLostBusinessDetailRequired();
    }



    public onChangeInactiveEffectDateDate(value: any): void {
        if (value && value.value) {
            this.setControlValue('InactiveEffectDate', value.value);
            this.shoWWarnMessage();
        }
    }

    public onCancelConfrim(): void {
        setTimeout(() => {
            let promptVO: ICabsModalVO = new ICabsModalVO();
            promptVO.msg = MessageConstant.Message.ConfirmRecord;
            promptVO.confirmCallback = this.onCancelServiceCall.bind(this);
            this.modalAdvService.emitPrompt(promptVO);
        }, 0);
    }

    public onEmployeeCodeChange(event: any): void {
        if (this.inputParams.CommissionEmployeeCode !== event.target.value)
            this.uiForm.controls['CommissionEmployeeCode'].markAsDirty();
        else
            this.uiForm.controls['CommissionEmployeeCode'].markAsPristine();
    }

    public onCancelServiceCall(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        let formData: any = {
            ContractNumber: this.getControlValue('ContractNumber'),
            CommissionEmployeeCode: this.getControlValue('CommissionEmployeeCode'),
            InactiveContractText: this.getControlValue('InactiveContractText'),
            VisitNarrativeCode: this.getControlValue('VisitNarrativeCode'),
            RemovalVisitText: this.getControlValue('RemovalVisitText'),
            ActionType: this.getControlValue('ActionType'),
            LostBusinessRequestNumber: this.getControlValue('LostBusinessRequestNumber'),
            ContractTypeCode: this.getControlValue('CurrentContractType'),
            SalesEmployeeText: this.getControlValue('SalesEmployeeText'),
            InvoiceAnnivDate: this.getControlValue('InvoiceAnnivDate'),
            InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode'),
            ContractName: this.getControlValue('ContractName'),
            ContractAnnualValue: this.getControlValue('ContractAnnualValue'),
            ContractCommenceDate: this.getControlValue('ContractCommenceDate'),
            AccountNumber: this.getControlValue('AccountNumber'),
            ErrorMessageDesc: this.getControlValue('ErrorMessageDesc'),
            NegBranchNumber: this.getControlValue('NegBranchNumber'),
            CreateContact: this.getControlValue('CreateContact') ? 'yes' : 'no',
            UninvoicedProRataExist: this.getControlValue('UninvoicedProRataExist') ? 'yes' : 'no',
            CancelProRataChargeInd: this.getControlValue('CancelProRataChargeInd') ? 'yes' : 'no',
            InfoMessage: this.getControlValue('InfoMessage'),
            Function: 'WarnCancel'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.inputParams.method, this.inputParams.module, this.inputParams.operation, search, formData).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.afterValueSave();
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                this.formPristine();
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }


    public onLostBusinessDetailLangDataReceived(event: any): void {
        this.setControlValue('LostBusinessDetailCode', event['LostBusinessDetailLang.LostBusinessDetailCode']);
        this.setControlValue('LostBusinessDetailDesc', event['LostBusinessDetailLang.LostBusinessDetailDesc']);
        if (this.inputParams['LostBusinessDetailCode'] !== this.getControlValue('LostBusinessDetailCode'))
            this.uiForm.controls['LostBusinessDetailCode'].markAsDirty();
        else
            this.uiForm.controls['LostBusinessDetailCode'].markAsPristine();
    }

    public onCommissionEmployeeChange(event: any): void {
        this.setControlValue('CommissionEmployeeCode', event.CommissionEmployeeCode);
        this.setControlValue('EmployeeSurname', event.EmployeeSurname);
        if (this.inputParams['CommissionEmployeeCode'] !== this.getControlValue('CommissionEmployeeCode'))
            this.uiForm.controls['CommissionEmployeeCode'].markAsDirty();
        else
            this.uiForm.controls['CommissionEmployeeCode'].markAsPristine();
    }

    public onCreateContactClick(event: any): void {
        if (this.getControlValue('CreateContact')) {
            //  this.navigate('New',ContactManagement/iCABSCMCustomerContactMaintenance.htm);
            alert('ContactManagement/iCABSCMCustomerContactMaintenance.htm page not developed yet');
        }
    }

    public onSaveClick(): void {
        this.riExchange.riInputElement.isError(this.uiForm, 'InactiveEffectDate');
        this.dropdown.lostBusiness.isTriggerValidate = true;
        this.dropdown.lostBusinessDetails.isTriggerValidate = true;
        if (this.URLParameterContains('cancel')) {
            this.warnCancel();
        } else if (this.uiForm.valid && !this.doLookUpCallForEmployee()) {
            let promptVO: ICabsModalVO = new ICabsModalVO();
            if (this.URLParameterContains('reinstate')) {
                promptVO.confirmCallback = this.onReinstateConfirmCallback.bind(this);
            } else {
                promptVO.confirmCallback = this.onConfirmCallback.bind(this);
            }
            promptVO.msg = MessageConstant.Message.ConfirmRecord;
            this.modalAdvService.emitPrompt(promptVO);
        }
    }

    public afterValueSave(): void {
        this.inputParams.LostBusinessCode = this.getControlValue('LostBusinessCode');
        this.inputParams.LostBusinessDesc = this.getControlValue('LostBusinessDesc');
        this.inputParams.LostBusinessDetailCode = this.getControlValue('LostBusinessDetailCode');
        this.inputParams.LostBusinessDetailDesc = this.getControlValue('LostBusinessDetailDesc');
        this.inputParams.InactiveEffectDate = this.getControlValue('InactiveEffectDate');
        this.inputParams.CommissionEmployeeCode = this.getControlValue('CommissionEmployeeCode');
        this.inputParams.EmployeeSurname = this.getControlValue('EmployeeSurname');
        this.inputParams.InactiveContractText = this.getControlValue('InactiveContractText');
        this.inputParams.VisitNarrativeCode = this.getControlValue('VisitNarrativeCode');
        this.inputParams.RemovalVisitText = this.getControlValue('RemovalVisitText');
        this.inputParams.CancelProRataChargeInd = this.getControlValue('CancelProRataChargeInd');
        this.inputParams.SalesEmployeeText = this.getControlValue('SalesEmployeeText');
        this.inputParams.CreateContact = this.getControlValue('CreateContact');
    }
}
