import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http';

import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { GroupAccountNumberComponent } from './../../internal/search/iCABSSGroupAccountNumberSearch';
import { AccountSearchComponent } from './../../internal/search/iCABSASAccountSearch';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { LostBusinessDetailLanguageSearchComponent } from './../../internal/search/iCABSBLostBusinessDetailLanguageSearch.component';

@Component({
    templateUrl: 'iCABSAMassPriceChangeGrid.html',
    styles: [`.error-disbaled { border: 1px solid red !important;}`]
})

export class MassPriceChangeGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('reasonCodeDropdown') public reasonCodeDropdown: DropdownComponent;
    @ViewChild('detailCodeDropdown') public detailCodeDropdown: LostBusinessDetailLanguageSearchComponent;
    @ViewChild('groupAccountNumber') public groupAccountNumber;
    @ViewChild('formUserPassword') public formUserPassword;
    @ViewChild('effDate') effDate;
    @ViewChild('contractSearchComponent') contractSearchComponent;
    private search: any = this.getURLSearchParamObject();
    private xhrParams = {
        module: 'api',
        method: 'contract-management/maintenance',
        operation: 'Application/iCABSAMassPriceChangeGrid'
    };
    private vbPercIncrease: any;
    private vbPercDecrease: any;
    private vbUnitPrice: any;
    private vbNewValue: any;
    private curPage: number = 1;
    private pageMessageModal: ICabsModalVO;
    private effectiveDateDisp: any;
    public isShowPasswordFields: boolean;
    public pageId: string = '';
    public isMandatoryReason: boolean = false;
    public isMandatoryDetail: boolean = false;
    public pageSize = 10;
    public totalRecords: number;
    public autoOpenSearch: boolean = false;
    public showCloseButton: boolean = true;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public inputParamsAccNumber: any = {
        'parentMode': 'LookUp',
        'showAddNew': false,
        'businessCode': this.businessCode(),
        'countryCode': this.countryCode(),
        'showAddNewDisplay': false,
        'showCountryCode': false,
        'showBusinessCode': false,
        'searchValue': '',
        'groupAccountNumber': '',
        'groupName': ''
    };
    //for Group account number
    public inputParamsGrpAccNumber: any = {
        parentMode: 'LookUp-NoMenu',
        showAddNew: false
    };
    public dropdown: any = {
        dropdownSearchReason: {
            isRequired: false,
            isDisabled: false,
            isTriggerValidate: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            },
            reasonCodeProperty: {
                selected: { id: '', text: '' }
            }
        },
        dropdownSearchDetail: {
            isRequired: false,
            isDisabled: false,
            isTriggerValidate: false,
            inputParams: {
                'parentMode': 'LookUp',
                'LanguageCode': this.riExchange.LanguageCode(),
                'LostBusinessCode': ''
            },
            active: {
                id: '',
                text: ''
            },
            detailCodeProperty: {
                selected: { id: '', text: '' }
            }
        }
    };
    public accountSearchComponent = AccountSearchComponent;
    public groupAccountSearchComponent = GroupAccountNumberComponent;
    public isGroupAccountShowCloseButton: boolean = true;
    //for employee search
    public inputParamsEmployeeSearch: any = {
        'parentMode': 'LookUp-Commission',
        'countryCode': '',
        'businessCode': '',
        'serviceBranchNumber': ''
    };
    public employeeSearchComponent = EmployeeSearchComponent;
    public showHeader: boolean = true;
    public isEmployeeSearchEllipsisDisabled: boolean = false;
    public isAccountNumberEllipsisDisabled: boolean = false;
    public ellipsis = {
        contractSearch: {
            disabled: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-ContOnly',
                currentContractType: this.pageParams.currentContractType,
                currentContractTypeURLParameter: this.pageParams.currentContractTypeLabel,
                showAddNew: false,
                contractNumber: '',
                showCountry: false,
                showBusiness: false,
                accountNumber: '',
                accountName: ''
            },
            showAddNew: false,
            autoOpenSearch: false,
            setFocus: false,
            component: ContractSearchComponent
        },
        premiseSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp',
                ContractNumber: '',
                ContractName: '',
                currentContractType: this.pageParams.currentContractType,
                currentContractTypeURLParameter: this.pageParams.currentContractTypeLabel,
                showAddNew: false
            },
            component: PremiseSearchComponent,
            searchModalRoute: '',
            disabled: true
        },
        serviceCoverSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUpBasic',
                ContractNumber: '',
                ContractName: '',
                PremiseNumber: '',
                PremiseName: '',
                currentContractType: this.pageParams.currentContractType,
                currentContractTypeURLParameter: this.pageParams.currentContractTypeLabel,
                showAddNew: false
            },
            component: ServiceCoverSearchComponent,
            searchModalRoute: '',
            disabled: false
        }
    };
    public controls = [
        { name: 'GroupAccountNumber', type: MntConst.eTypeInteger },
        { name: 'GroupName', type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', type: MntConst.eTypeInteger },
        { name: 'PercIncrease', type: MntConst.eTypeDecimal2 },
        { name: 'AccountNumber', type: MntConst.eTypeCode },
        { name: 'AccountName', type: MntConst.eTypeText },
        { name: 'ServiceQuantity', type: MntConst.eTypeInteger },
        { name: 'PercDecrease', type: MntConst.eTypeDecimal2 },
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'ServiceAnnualValue', type: MntConst.eTypeDecimal2 },
        { name: 'NewValue', type: MntConst.eTypeDecimal2 },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'NextInvoiceStartDate', type: MntConst.eTypeDate },
        { name: 'UnitPrice', type: MntConst.eTypeDecimal2 },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'CurrentValue', type: MntConst.eTypeDecimal2 },
        { name: 'EffectiveDate', required: true, type: MntConst.eTypeDate },
        { name: 'PriceChangeOnlyInd', type: MntConst.eTypeCheckBox },
        { name: 'AffectedLines', disabled: true, type: MntConst.eTypeInteger },
        { name: 'LostBusinessCode', type: MntConst.eTypeCode },
        { name: 'LostBusinessDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'LostBusinessDetailCode', type: MntConst.eTypeCode },
        { name: 'LostBusinessDetailDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'UserPassword', type: MntConst.eTypeTextFree },
        { name: 'CommissionEmployeeCode', type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', disabled: true, type: MntConst.eTypeText },
        { name: 'Reason' }
    ];
    public NextInvoiceStartDateDisp: any;
    constructor(injector: Injector, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAMASSPRICECHANGEGRID;
        this.browserTitle = this.pageTitle = 'Mass Price Change Grid';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnload(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.effectiveDateDisp = this.globalize.parseDateToFixedFormat(this.formData.EffectiveDate);
            if (this.formData.LostBusinessCode && this.formData.LostBusinessDesc) {
                this.dropdown.dropdownSearchReason.reasonCodeProperty.selected = { id: this.formData.LostBusinessCode, text: this.formData.LostBusinessCode + ' - ' + this.formData.LostBusinessDesc };
                this.dropdown.dropdownSearchDetail.inputParams.LostBusinessCode = this.formData.LostBusinessCode;
            }
            if (this.formData.LostBusinessDetailCode && this.formData.LostBusinessDetailDesc) {
                this.dropdown.dropdownSearchDetail.detailCodeProperty.selected = { id: this.formData.LostBusinessDetailCode, text: this.formData.LostBusinessDetailCode + ' - ' + this.formData.LostBusinessDetailDesc };
            }
            if (!this.riGrid.HTMLGridBody) {
                this.setControlValue('AffectedLines', '');
                this.setControlValue('CurrentValue', '');
            }

            if (this.formData.AccountNumber) {
                this.ellipsis.contractSearch.childConfigParams.accountNumber = this.formData.AccountNumber;
                this.ellipsis.contractSearch.childConfigParams.accountName = this.formData.AccountName;
            }
            if (this.formData.GroupAccountNumber) {
                this.inputParamsAccNumber.groupAccountNumber = this.formData.GroupAccountNumber;
                this.inputParamsAccNumber.groupName = this.formData.GroupName;
            }
            if (this.formData.ContractNumber) {
                this.ellipsis.premiseSearch.disabled = false;
                this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.formData.ContractNumber;
                this.ellipsis.premiseSearch.childConfigParams.ContractName = this.formData.ContractName;
                this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.formData.ContractNumber;
                this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.formData.ContractName;
                this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = this.formData.PremiseNumber;
                this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = this.formData.PremiseName;
            }
        } else {
            this.isShowPasswordFields = false;
            this.pageParams.vbUpdateServiceCoverValues = '';
            this.pageParams.vbUpdateProcess = false;
            this.pageParams.btnUpdate = false;
            this.groupAccountNumber.nativeElement.focus();
            this.setControlValue('AffectedLines', 0);
            this.setControlValue('PriceChangeOnlyInd', true);
        }
        this.setCurrentContractType();
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = this.pageSize;
        this.buildGrid();
        this.disableControl('GroupName', true);
        this.disableControl('AccountName', true);
        this.disableControl('ContractName', true);
        this.disableControl('PremiseName', true);
        this.disableControl('ProductDesc', true);
        this.disableControl('CurrentValue', true);
        this.disableControl('AffectedLines', true);
        this.disableControl('LostBusinessDesc', true);
        this.disableControl('LostBusinessDetailDesc', true);
        this.disableControl('EmployeeSurname', true);
    }

    private setCurrentContractType(): void {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    }

    private setErrorStatusOfFormElement(frmCtrlName: string, flag: boolean): void {
        this.riExchange.riInputElement.SetMarkedAsTouched(this.uiForm, frmCtrlName, flag);
        if (flag) {
            this.riExchange.riInputElement.markAsError(this.uiForm, frmCtrlName);
        }
    }

    private refreshRequired(): void {
        this.pageParams.btnUpdate = false;
        this.isShowPasswordFields = false;
        this.setErrorStatusOfFormElement('LostBusinessCode', false);
        this.setErrorStatusOfFormElement('LostBusinessDetailCode', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', false);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', false);
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('AccountNumber', 'MassPriceChange', 'AccountNumber', MntConst.eTypeText, 9);
        this.riGrid.AddColumn('ContractNumber', 'MassPriceChange', 'ContractNumber', MntConst.eTypeCode, 8);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNumber', 'MassPriceChange', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseName', 'MassPriceChange', 'PremiseName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('PremisePostcode', 'MassPriceChange', 'PremisePostcode', MntConst.eTypeCode, 8);
        this.riGrid.AddColumnAlign('PremisePostcode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ServiceBranchNumber', 'MassPriceChange', 'ServiceBranchNumber', MntConst.eTypeInteger, 10);
        this.riGrid.AddColumnAlign('ServiceBranchNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ProductCode', 'MassPriceChange', 'ProductCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ServiceQuantity', 'MassPriceChange', 'ServiceQuantity', MntConst.eTypeInteger, 10);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ServiceVisitFrequency', 'MassPriceChange', 'ServiceVisitFrequency', MntConst.eTypeInteger, 10);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ServiceCommenceDate', 'MassPriceChange', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceAnnualValue', 'MassPriceChange', 'ServiceAnnualValue', MntConst.eTypeCurrency, 12);
        this.riGrid.AddColumnAlign('ServiceAnnualValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('NextInvoiceStartDate', 'MassPriceChange', 'NextInvoiceStartDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('NextInvoiceStartDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('NewValue', 'MassPriceChange', 'NewValue', MntConst.eTypeCurrency, 12);
        this.riGrid.AddColumnAlign('NewValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ErrorInfo', 'MassPriceChange', 'ErrorInfo', MntConst.eTypeImage, 1);
        this.riGrid.AddColumn('ErrorText', 'MassPriceChange', 'ErrorText', MntConst.eTypeText, 10);
        this.riGrid.AddColumnScreen('ErrorText', false);
        this.riGrid.AddColumnOrderable('AccountNumber', true);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('PremiseNumber', true);
        this.riGrid.AddColumnOrderable('PremisePostcode', true);
        this.riGrid.AddColumnOrderable('ServiceBranchNumber', true);
        this.riGrid.Complete();
    }

    private riGridBeforeExecute(): void {
        this.pageParams.vbUpdateProcess = false;
        this.vbPercIncrease = this.getControlValue('PercIncrease') || 0;
        this.vbPercDecrease = this.getControlValue('PercDecrease') || 0;
        this.vbUnitPrice = this.getControlValue('UnitPrice') || 0;
        this.vbNewValue = this.getControlValue('NewValue') || 0;

        this.setErrorStatusOfFormElement('PercIncrease', (this.vbPercIncrease < 0) ? true : false);
        this.setErrorStatusOfFormElement('PercDecrease', (this.vbPercDecrease < 0) ? true : false);
        this.setErrorStatusOfFormElement('UnitPrice', (this.vbUnitPrice < 0) ? true : false);
        this.setErrorStatusOfFormElement('NewValue', (this.vbNewValue < 0) ? true : false);
        this.setErrorStatusOfFormElement('PercIncrease', (!this.vbPercIncrease && !this.vbPercDecrease && !this.vbUnitPrice && !this.vbNewValue) ? true : false);
        this.setErrorStatusOfFormElement('PercDecrease', (!this.vbPercIncrease && !this.vbPercDecrease && !this.vbUnitPrice && !this.vbNewValue) ? true : false);
        this.setErrorStatusOfFormElement('UnitPrice', (!this.vbPercIncrease && !this.vbPercDecrease && !this.vbUnitPrice && !this.vbNewValue) ? true : false);
        this.setErrorStatusOfFormElement('NewValue', (!this.vbPercIncrease && !this.vbPercDecrease && !this.vbUnitPrice && !this.vbNewValue) ? true : false);
        if (!this.getControlValue('GroupAccountNumber') && !this.getControlValue('AccountNumber') && !this.getControlValue('ContractNumber')) {
            this.setErrorStatusOfFormElement('GroupAccountNumber', true);
            this.setErrorStatusOfFormElement('AccountNumber', true);
            this.setErrorStatusOfFormElement('ContractNumber', true);
            this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.massPriceChangeGridAtleastOne);
            this.pageMessageModal.title = MessageConstant.Message.WarningTitle;
            this.modalAdvService.emitMessage(this.pageMessageModal);
        }
        if (this.vbUnitPrice && !this.getControlValue('ProductCode')) {
            this.setErrorStatusOfFormElement('ProductCode', true);
            this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.massPriceChangeGridProductMandatory);
            this.pageMessageModal.title = MessageConstant.Message.WarningTitle;
            this.modalAdvService.emitMessage(this.pageMessageModal);
        }
        this.effDate.validateDateField();
        if (!this.vbPercIncrease && !this.vbPercDecrease && !this.vbUnitPrice && !this.vbNewValue) {
            return;
        }
        if (!this.getControlValue('GroupAccountNumber') && !this.getControlValue('AccountNumber') && !this.getControlValue('ContractNumber')) {
            return;
        }
        if (this.vbUnitPrice && !this.getControlValue('ProductCode')) {
            return;
        }
        if (!this.riExchange.riInputElement.isError(this.uiForm, 'ServiceVisitFrequency') && !this.riExchange.riInputElement.isError(this.uiForm, 'ServiceQuantity') && !this.riExchange.riInputElement.isError(this.uiForm, 'ServiceAnnualValue') && !this.riExchange.riInputElement.isError(this.uiForm, 'NextInvoiceStartDate') && !this.riExchange.riInputElement.isError(this.uiForm, 'ProductCode') && !this.riExchange.riInputElement.isError(this.uiForm, 'EffectiveDate')) {
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set('BranchNumber', this.utils.getBranchCode());
            this.search.set('riCacheRefresh', 'True');
            this.search.set('riGridMode', '0');
            this.search.set('riGridHandle', this.utils.randomSixDigitString());
            this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.curPage.toString());
            let sortOrder = 'Descending';
            if (!this.riGrid.DescendingSort) {
                sortOrder = 'Ascending';
            }
            this.search.set('riSortOrder', sortOrder);
            this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
            this.search.set('GroupAccountNumber', this.getControlValue('GroupAccountNumber'));
            this.search.set('AccountNumber', this.getControlValue('AccountNumber'));
            this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
            this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
            this.search.set('ProductCode', this.getControlValue('ProductCode'));
            this.search.set('ServiceVisitFrequency', this.getControlValue('ServiceVisitFrequency'));
            this.search.set('ServiceQuantity', this.getControlValue('ServiceQuantity'));
            this.search.set('ServiceAnnualValue', this.globalize.parseDecimalToFixedFormat(this.getControlValue('ServiceAnnualValue'), 2));
            this.search.set('NextInvoiceStartDate', this.getControlValue('NextInvoiceStartDate'));
            this.search.set('PercIncrease', this.globalize.parseDecimalToFixedFormat(this.getControlValue('PercIncrease'), 2));
            this.search.set('PercDecrease', this.globalize.parseDecimalToFixedFormat(this.getControlValue('PercDecrease'), 2));
            this.search.set('UnitPrice', this.globalize.parseDecimalToFixedFormat(this.getControlValue('UnitPrice'), 2));
            this.search.set('NewValue', this.globalize.parseDecimalToFixedFormat(this.getControlValue('NewValue'), 2));
            this.search.set('EffectiveDate', this.globalize.parseDateToFixedFormat(this.getControlValue('EffectiveDate')));
            this.search.set('PriceChangeOnlyInd', this.getControlValue('PriceChangeOnlyInd') ? 'True' : 'False');
            this.search.set('LostBusinessCode', this.getControlValue('LostBusinessCode'));
            this.search.set('LostBusinessDetailCode', this.getControlValue('LostBusinessDetailCode'));
            this.search.set('AffectedLines', this.getControlValue('AffectedLines'));
            this.search.set('CommissionEmployee', this.getControlValue('CommissionEmployeeCode'));
            this.search.set('Reason', this.getControlValue('Reason'));
            this.search.set('Function', this.pageParams.vbUpdateServiceCoverValues);
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data) {
                        if (data && data.hasError) {
                            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        } else {
                            if (!data.hasError) {
                                if (this.pageParams.vbUpdateServiceCoverValues) {
                                    this.pageParams.vbUpdateProcess = true;
                                    this.pageParams.vbUpdateServiceCoverValues = '';
                                }
                                this.buildGrid();
                                this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                                this.riGrid.UpdateBody = true;
                                this.riGrid.UpdateFooter = true;
                                this.riGrid.UpdateHeader = true;
                                this.riGrid.Execute(data);
                                this.isShowPasswordFields = false;
                            }
                        }
                        if (data.errorNumber === 2) {
                            this.buildGrid();
                            this.totalRecords = 0;
                            this.riGrid.UpdateBody = true;
                            this.riGrid.UpdateFooter = true;
                            this.riGrid.UpdateHeader = true;
                            this.riGrid.Execute(data);
                            this.pageParams.btnUpdate = false;
                        }
                    }
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.pageParams.vbUpdateServiceCoverValues = '';
        }
    }

    private populateDescriptions(): void {
        this.setErrorStatusOfFormElement('GroupAccountNumber', false);
        this.setErrorStatusOfFormElement('AccountNumber', false);
        this.setErrorStatusOfFormElement('ContractNumber', false);
        let postSearchParams: any = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetDescriptions';
        postParams.BranchNumber = this.utils.getBranchCode();
        postParams.GroupAccountNumber = this.getControlValue('GroupAccountNumber');
        postParams.AccountNumber = this.getControlValue('AccountNumber');
        postParams.ContractNumber = this.getControlValue('ContractNumber');
        postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        postParams.CommissionEmployee = this.getControlValue('CommissionEmployeeCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['hasError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.setControlValue('GroupAccountNumber', e.GroupAccountNumber);
                    this.setControlValue('GroupName', e.GroupName);
                    this.setControlValue('AccountNumber', e.AccountNumber);
                    this.setControlValue('AccountName', e.AccountName);
                    this.setControlValue('ContractNumber', e.ContractNumber);
                    this.setControlValue('ContractName', e.ContractName);
                    this.setControlValue('PremiseNumber', e.PremiseNumber);
                    this.setControlValue('PremiseName', e.PremiseName);
                    this.setControlValue('CommissionEmployeeCode', e.CommissionEmployee);
                    this.setControlValue('EmployeeSurname', e.EmployeeSurname);
                    //ellipsis settings
                    this.ellipsis.premiseSearch.childConfigParams.ContractNumber = e.ContractNumber;
                    this.ellipsis.premiseSearch.childConfigParams.ContractName = e.ContractName;
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = e.ContractNumber;
                    this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = e.ContractName;
                    this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = e.PremiseNumber;
                    this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = e.PremiseName;
                    this.inputParamsAccNumber.groupAccountNumber = e.GroupAccountNumber;
                    this.inputParamsAccNumber.groupName = e.GroupName;
                    this.ellipsis.contractSearch.childConfigParams.accountNumber = e.AccountNumber;
                    this.ellipsis.contractSearch.childConfigParams.accountName = e.AccountName;
                    this.el.nativeElement.querySelector('#AccountNumber').classList.remove('ng-invalid');
                    this.ellipsis.premiseSearch.disabled = !this.getControlValue('ContractNumber');
                    this.riGrid.RefreshRequired();
                }

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private selectedRowFocus(rsrcElement: any): void {
        let oTR: any = rsrcElement.parentElement.parentElement.parentElement;
        switch (oTR.children[1].children[0].children[0].getAttribute('additionalproperty')) {
            case 'C':
                this.pageParams.currentContractType = '';
                break;
            case 'J':
                this.pageParams.currentContractType = '<job>';
                break;
            case 'P':
                this.pageParams.currentContractType = '<product>';
                break;
            default:
                break;
        }
        this.setAttribute('Row', oTR.sectionRowIndex);
        this.setAttribute('ContractRowID', oTR.children[1].children[0].children[0].getAttribute('rowid'));
        this.setAttribute('ContractNumber', oTR.children[1].children[0].children[0].value);
        this.setAttribute('PremiseRowID', oTR.children[2].children[0].children[0].getAttribute('rowid'));
        this.setAttribute('ServiceCoverRowID', oTR.children[6].children[0].children[0].getAttribute('rowid'));
        this.setAttribute('grdMassPriceChangeRow', oTR.sectionRowIndex);
        rsrcElement.focus();
    }

    public riGridAfterExecute(): void {
        setTimeout(() => {
            if (this.riGrid.HTMLGridBody && this.riGrid.HTMLGridBody.innerHTML) {
                this.setControlValue('AffectedLines', this.riGrid.HTMLGridBody.children[0].children[0].getAttribute('additionalproperty'));
                this.setControlValue('CurrentValue', this.riGrid.HTMLGridBody.children[0].children[5].getAttribute('additionalproperty'));

                //dropdown mandatory code

                this.isMandatoryReason = (!this.getControlValue('LostBusinessCode') && (!this.getControlValue('PercIncrease') && this.globalize.parseCurrencyToFixedFormat(this.riGrid.Details.GetValue('NewValue')) < this.globalize.parseIntegerToFixedFormat(this.getControlValue('CurrentValue')))) ? true : false;
                this.dropdown.dropdownSearchReason.isRequired = this.dropdown.dropdownSearchReason.isTriggerValidate = (!this.getControlValue('LostBusinessCode') && this.isMandatoryReason && (!this.getControlValue('PercIncrease') && this.globalize.parseCurrencyToFixedFormat(this.riGrid.Details.GetValue('NewValue')) < this.globalize.parseIntegerToFixedFormat(this.getControlValue('CurrentValue')))) ? true : false;

                this.isMandatoryDetail = (!this.getControlValue('LostBusinessDetailCode') && (!this.getControlValue('PercIncrease') && this.globalize.parseCurrencyToFixedFormat(this.riGrid.Details.GetValue('NewValue')) < this.globalize.parseIntegerToFixedFormat(this.getControlValue('CurrentValue')))) ? true : false;

                this.dropdown.dropdownSearchDetail.isRequired = this.dropdown.dropdownSearchDetail.isTriggerValidate = (!this.getControlValue('LostBusinessDetailCode') && this.isMandatoryDetail && (!this.getControlValue('PercIncrease') && (this.globalize.parseCurrencyToFixedFormat(this.riGrid.Details.GetValue('NewValue')) < this.globalize.parseIntegerToFixedFormat(this.getControlValue('CurrentValue'))))) ? true : false;


                if (this.riGrid.HTMLGridBody.children[0].children[3].getAttribute('additionalproperty') === '1') {
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', true);
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', true);
                    this.setErrorStatusOfFormElement('LostBusinessCode', (!this.getControlValue('LostBusinessCode')) ? true : false);
                    this.setErrorStatusOfFormElement('LostBusinessDetailCode', (!this.getControlValue('LostBusinessDetailCode')) ? true : false);
                } else {
                    this.setErrorStatusOfFormElement('LostBusinessCode', false);
                    this.setErrorStatusOfFormElement('LostBusinessDetailCode', false);
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', false);
                    this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', false);
                }

                if (!this.pageParams.vbUpdateProcess) {
                    this.pageParams.btnUpdate = true;
                    this.isShowPasswordFields = false;
                } else {
                    this.pageParams.btnUpdate = false;
                    this.pageParams.vbUpdateComplete = true;

                    if (this.riGrid.HTMLGridBody.children[0].children[4].getAttribute('additionalproperty') === '1') {
                        this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.massPriceChangeGridUpdateWithError);
                        this.pageMessageModal.title = MessageConstant.PageSpecificMessage.massPriceChangeGridUpdateProcess;
                        this.modalAdvService.emitMessage(this.pageMessageModal);
                    } else {
                        this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.massPriceChangeGridUpdateComplete);
                        this.pageMessageModal.title = MessageConstant.PageSpecificMessage.massPriceChangeGridUpdateProcess;
                        this.modalAdvService.emitMessage(this.pageMessageModal);
                    }
                }
            } else {
                this.pageParams.btnUpdate = false;
                this.setControlValue('AffectedLines', 0);
                if (!this.pageParams.vbUpdateProcess) {
                    this.isShowPasswordFields = false;
                } else {
                    this.pageParams.vbUpdateComplete = true;
                    if (this.riGrid.HTMLGridBody) {
                        if (this.riGrid.HTMLGridBody.children[0].children[4].getAttribute('additionalproperty') === 1) {
                            this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.massPriceChangeGridUpdateWithError);
                            this.pageMessageModal.title = MessageConstant.PageSpecificMessage.massPriceChangeGridUpdateProcess;
                            this.modalAdvService.emitMessage(this.pageMessageModal);
                        } else {
                            this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.massPriceChangeGridUpdateComplete);
                            this.pageMessageModal.title = MessageConstant.PageSpecificMessage.massPriceChangeGridUpdateProcess;
                            this.modalAdvService.emitMessage(this.pageMessageModal);
                        }
                    }
                }
                this.setErrorStatusOfFormElement('LostBusinessCode', false);
                this.setErrorStatusOfFormElement('LostBusinessDetailCode', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessCode', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LostBusinessDetailCode', false);
            }
        }, 0);

    }

    public riGridBodyOnClick(event: any): void {
        this.selectedRowFocus(event.srcElement);
    }

    public riGridBodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            case 13:
                this.detail(event);
                break;
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.selectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.selectedRowFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
            default:
                break;
        }
    }

    public riGridBodyOndblClick(event: any): void {
        if (this.riGrid.CurrentColumnName === 'ContractNumber' || this.riGrid.CurrentColumnName === 'PremiseNumber' || this.riGrid.CurrentColumnName === 'ProductCode') {
            event.keyCode = 13;
            this.riGridBodyOnKeyDown(event);
        }
    }
    private showPassword(): void {
        this.formUserPassword.nativeElement.focus();

    }
    private detail(event: any): void {
        this.setControlValue('UserPassword', '');
        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNumber':
                this.selectedRowFocus(event.srcElement);
                let objNavigation: any = {
                    'ContractNumber': this.riGrid.Details.GetValue('ContractNumber'),
                    'CurrentContractTypeURLParameter': this.pageParams.currentContractType,
                    'parentMode': 'Release'
                };
                switch (this.pageParams.currentContractType) {
                    case '':
                        this.navigate('Release', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, objNavigation);
                        break;
                    case '<job>':
                        this.navigate('Release', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, objNavigation);
                        break;
                    case '<product>':
                        this.navigate('Release', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, objNavigation);
                        break;
                    default:
                        break;
                }
                break;
            case 'PremiseNumber':
                this.selectedRowFocus(event.srcElement);
                this.navigate('Summary', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    'ContractNumber': this.riGrid.Details.GetValue('ContractNumber'),
                    'CurrentContractTypeURLParameter': this.pageParams.currentContractType,
                    'PremiseRowID': this.riGrid.Details.GetAttribute('PremiseNumber', 'rowID'),
                    'ContractTypeCode': this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty'),
                    'parentMode': 'Summary',
                    'PremiseNumber': this.riGrid.Details.GetValue('PremiseNumber')
                });
                break;
            case 'ProductCode':
                this.selectedRowFocus(event.srcElement);
                this.navigate('Summary', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    'CurrentContractTypeURLParameter': this.pageParams.currentContractType,
                    'parentMode': 'Summary',
                    'currentContractType': this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty'),
                    'ServiceCoverRowID': this.riGrid.Details.GetAttribute('ProductCode', 'rowID')
                });
                break;
            default:
                break;
        }

    }

    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    //Grid Pagination
    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.RefreshRequired();
        this.riGridBeforeExecute();
    }

    public refresh(): void {
        this.curPage = 1;
        if (this.riExchange.riInputElement.isError(this.uiForm, 'LostBusinessCode')) {
            this.isMandatoryReason = true;
            this.dropdown.dropdownSearchReason.isTriggerValidate = true;
            this.dropdown.dropdownSearchReason.isRequired = true;

        }
        if (this.riExchange.riInputElement.isError(this.uiForm, 'LostBusinessDetailCode')) {
            this.isMandatoryDetail = true;
            this.dropdown.dropdownSearchDetail.isTriggerValidate = true;
            this.dropdown.dropdownSearchDetail.isRequired = true;
        }
        if (!this.riExchange.riInputElement.isError(this.uiForm, 'LostBusinessCode') && !this.riExchange.riInputElement.isError(this.uiForm, 'LostBusinessDetailCode')) {
            this.riGrid.RefreshRequired();
            this.riGridBeforeExecute();
        }
    }

    //On Value Changed of Objects
    public onChangeGroupAccountNumber(obj: any): void {
        if (this.getControlValue('GroupAccountNumber')) {
            this.populateDescriptions();
        } else {
            this.setControlValue('GroupName', '');
            this.inputParamsAccNumber.groupAccountNumber = '';
            this.inputParamsAccNumber.groupName = '';
            this.refreshRequired();
        }
    }

    public onChangeAccountNumber(obj: any): void {
        this.refreshRequired();
        this.ellipsis.premiseSearch.disabled = !this.getControlValue('ContractNumber');
        this.populateDescriptions();
    }

    public onChangePremiseNumber(obj: any): void {
        if (this.getControlValue('PremiseNumber')) {
            this.populateDescriptions();
        } else {
            this.setControlValue('PremiseName', '');
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = '';
        }
    }

    public onChangeProductCode(obj: any): void {
        if (this.getControlValue('ProductCode')) {
            this.getProductDescription();
        } else {
            this.setControlValue('ProductDesc', '');
        }
    }

    public onChangeServiceVisitFrequency(obj: any): void {
        this.refreshRequired();
    }

    public onChangeServiceQuantity(obj: any): void {
        this.refreshRequired();
    }

    public onChangeServiceAnnualValue(obj: any): void {
        this.refreshRequired();
    }

    public onChangeNextinvoiceStartDate(): void {
        this.refreshRequired();
    }

    public onChangePercIncrease(): void {
        if (this.getControlValue('PercIncrease')) {
            this.setControlValue('PercDecrease', '');
            this.setControlValue('UnitPrice', '');
            this.setControlValue('NewValue', '');
            this.setErrorStatusOfFormElement('ProductCode', false);
            this.setControlValue('ProductCode', '');
        }
        this.setErrorStatusOfFormElement('PercIncrease', false);
        this.setErrorStatusOfFormElement('PercDecrease', false);
        this.setErrorStatusOfFormElement('UnitPrice', false);
        this.setErrorStatusOfFormElement('ProductCode', false);
        this.setErrorStatusOfFormElement('NewValue', false);
        this.refreshRequired();
    }

    public onChangePercDecrease(): void {
        if (this.getControlValue('PercDecrease')) {
            this.setControlValue('PercIncrease', '');
            this.setControlValue('UnitPrice', '');
            this.setControlValue('NewValue', '');
            this.setErrorStatusOfFormElement('ProductCode', false);
            this.setControlValue('ProductCode', '');
        }
        this.setErrorStatusOfFormElement('PercIncrease', false);
        this.setErrorStatusOfFormElement('PercDecrease', false);
        this.setErrorStatusOfFormElement('UnitPrice', false);
        this.setErrorStatusOfFormElement('ProductCode', false);
        this.setErrorStatusOfFormElement('NewValue', false);
        this.refreshRequired();
    }

    public onChangeUnitPrice(): void {
        if (this.getControlValue('UnitPrice')) {
            this.setControlValue('PercIncrease', '');
            this.setControlValue('PercDecrease', '');
            this.setControlValue('NewValue', '');
        }
        this.setErrorStatusOfFormElement('PercIncrease', false);
        this.setErrorStatusOfFormElement('PercDecrease', false);
        this.setErrorStatusOfFormElement('UnitPrice', false);
        this.setErrorStatusOfFormElement('ProductCode', false);
        this.setErrorStatusOfFormElement('NewValue', false);
        if (this.getControlValue('UnitPrice') && !this.getControlValue('ProductCode')) {
            this.setErrorStatusOfFormElement('ProductCode', true);
            this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.massPriceChangeGridProductMandatory);
            this.pageMessageModal.title = MessageConstant.Message.WarningTitle;
            this.modalAdvService.emitMessage(this.pageMessageModal);
        } else {
            this.refreshRequired();
        }
    }

    public onChangeNewValue(): void {
        if (this.getControlValue('NewValue')) {
            this.setControlValue('PercIncrease', '');
            this.setControlValue('PercDecrease', '');
            this.setControlValue('UnitPrice', '');
            this.setErrorStatusOfFormElement('ProductCode', false);
            this.setControlValue('ProductCode', '');
        }
        this.setErrorStatusOfFormElement('PercIncrease', false);
        this.setErrorStatusOfFormElement('PercDecrease', false);
        this.setErrorStatusOfFormElement('UnitPrice', false);
        this.setErrorStatusOfFormElement('NewValue', false);

        this.refreshRequired();
    }

    public onChangeEffectiveDate(): void {
        if (!this.riExchange.riInputElement.isError(this.uiForm, 'ProductCode')) {
            this.refreshRequired();
        }
    }

    public onChangeContractNumber(obj: any): void {
        if (this.getControlValue('ContractNumber')) {
            this.populateDescriptions();
        } else {
            this.setControlValue('ContractName', '');
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = '';
            this.ellipsis.premiseSearch.childConfigParams.ContractName = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = '';
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = '';
        }
        this.ellipsis.premiseSearch.disabled = !this.getControlValue('ContractNumber');
    }

    public onChangeLostBusinessCode(data: any): void {
        if (data) {
            this.setControlValue('LostBusinessCode', data['LostBusinessLang.LostBusinessCode']);
            this.setControlValue('LostBusinessDesc', data['LostBusinessLang.LostBusinessDesc']);
            this.dropdown.dropdownSearchDetail.inputParams.LostBusinessCode = this.getControlValue('LostBusinessCode');
            this.detailCodeDropdown.fetchDropDownData();
            if (this.getControlValue('LostBusinessCode')) {
                this.dropdown.dropdownSearchReason.isTriggerValidate = false;
            } else {
                this.dropdown.dropdownSearchReason.isTriggerValidate = true;
                this.dropdown.dropdownSearchReason.isRequired = true;
                this.isMandatoryReason = true;
            }
        }
    }

    public onChangeLostBusinessDetailCode(data: any): void {
        if (data) {
            this.setControlValue('LostBusinessDetailCode', data['LostBusinessDetailLang.LostBusinessDetailCode']);
            this.setControlValue('LostBusinessDetailDesc', data['LostBusinessDetailLang.LostBusinessDetailDesc']);
            if (this.getControlValue('LostBusinessDetailCode')) {
                this.dropdown.dropdownSearchDetail.isTriggerValidate = false;
            } else {
                this.dropdown.dropdownSearchDetail.isTriggerValidate = true;
                this.dropdown.dropdownSearchDetail.isRequired = true;
                this.isMandatoryDetail = true;
            }
        }
    }

    public onChangeCommissionEmployeeCode(): void {
        if (this.getControlValue('CommissionEmployeeCode')) {
            this.populateDescriptions();
        } else {
            this.setControlValue('EmployeeSurname', '');
        }
    }

    public onClickBtnUpdate(): void {
        this.isShowPasswordFields = true;
        this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.massPriceChangeGridPasswordProcess);
        this.pageMessageModal.title = MessageConstant.PageSpecificMessage.massPriceChangeGridUpdateProcess;
        this.pageMessageModal.closeCallback = this.showPassword();
        this.modalAdvService.emitMessage(this.pageMessageModal);

    }

    public onClickBtnUpdateConfirm(): void {
        let postSearchParams: any = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.UserPassword = this.getControlValue('UserPassword');
        postParams.Function = 'ValidateUserPassword';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['hasError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(e['errorMessage'], e['fullError']));
                } else {
                    if (!this.isMandatoryReason && !this.isMandatoryDetail) {
                        this.pageParams.vbUpdateServiceCoverValues = 'UpdateServiceCoverValues';
                        this.groupAccountNumber.nativeElement.focus();
                        this.setControlValue('UserPassword', '');
                        this.refresh();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public onFocusgroupAccountNumber(): void {
        if (this.pageParams.vbUpdateComplete) {
            this.pageParams.vbUpdateComplete = false;
            this.isShowPasswordFields = false;
        }
    }

    public onFocusUserPassword(): void {
        this.setControlValue('UserPassword', '');
    }

    public getProductDescription(): void {
        let postSearchParams: any = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetProductDescription';
        postParams.ProductCode = this.getControlValue('ProductCode');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['hasError']) {
                    this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                } else {
                    this.setControlValue('ProductDesc', e.ProductDesc);
                    this.riGrid.RefreshRequired();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //On account number search data return
    public onAccountNumberDataReceived(data: any): void {
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('AccountName', data.AccountName);
        this.ellipsis.contractSearch.childConfigParams.accountNumber = data.AccountNumber;
        this.ellipsis.contractSearch.childConfigParams.accountName = data.AccountName;
        this.setErrorStatusOfFormElement('AccountNumber', false);
        this.ellipsis.premiseSearch.disabled = !this.getControlValue('ContractNumber');
        if (this.getControlValue('AccountNumber')) {
            this.setErrorStatusOfFormElement('ContractNumber', false);
            this.setErrorStatusOfFormElement('GroupAccountNumber', false);
        }
    }

    //On employee search ellipsis data return
    public onEmployeeDataReceived(data: any): void {
        this.setControlValue('CommissionEmployeeCode', data.CommissionEmployeeCode);
        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        // this.setErrorStatusOfFormElement('CommissionEmployeeCode', false);
    }

    // On contract number ellipsis data return
    public onContractDataReceived(data: any): void {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        // //Diable/Enable fields
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.premiseSearch.childConfigParams.ContractName = data.ContractName;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = data.ContractName;
        this.setErrorStatusOfFormElement('ContractNumber', false);
        if (this.getControlValue('ContractNumber')) {
            this.setErrorStatusOfFormElement('AccountNumber', false);
            this.setErrorStatusOfFormElement('GroupAccountNumber', false);
        }
        this.ellipsis.premiseSearch.disabled = !this.getControlValue('ContractNumber');
    }

    // On premise number ellipsis data return
    public onPremiseDataReceived(data: any): void {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
        // //Diable/Enable fields
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = data.PremiseNumber;
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = data.PremiseName;
        this.setErrorStatusOfFormElement('PremiseNumber', false);
    }

    // On product number ellipsis data return
    public onProductDataReceived(data: any): void {
        this.setControlValue('ProductCode', data.row.ProductCode);
        this.setControlValue('ProductDesc', data.row.ProductDesc);
        this.setErrorStatusOfFormElement('ProductCode', false);
    }

    //on group account data return
    public onGroupAccountDataReceived(data: any): void {
        this.setControlValue('GroupAccountNumber', data.GroupAccountNumber);
        this.setControlValue('GroupName', data.GroupName);
        this.inputParamsAccNumber.groupAccountNumber = data.GroupAccountNumber;
        this.inputParamsAccNumber.groupName = data.GroupName;
        this.setErrorStatusOfFormElement('GroupAccountNumber', false);
        if (this.getControlValue('GroupAccountNumber')) {
            this.setErrorStatusOfFormElement('ContractNumber', false);
            this.setErrorStatusOfFormElement('AccountNumber', false);
        }
    }

    public dateSelectedValue(value: any): void {
        this.setControlValue('EffectiveDate', value.value || '');
    }

    public nextInvoiceDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('NextInvoiceStartDate', value.value);
            this.onChangeNextinvoiceStartDate();
        } else {
            this.setControlValue('NextInvoiceStartDate', '');
            this.onChangeNextinvoiceStartDate();
        }
    }
}

