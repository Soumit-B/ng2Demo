import { ControlContainer } from '@angular/forms';
import { Component, OnInit, Injector, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { RiMaintenance, MntConst } from '../../../../shared/services/riMaintenancehelper';
import { TableComponent } from '../../../../shared/components/table/table';
import { MessageConstant } from '../../../../shared/constants/message.constant';
import { ICabsModalVO } from '../../../../shared/components/modal-adv/modal-adv-vo';
import { RouteAwayComponent } from '../../../../shared/components/route-away/route-away';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { AjaxConstant } from '../../../../shared/constants/AjaxConstants';

import { ProductSearchGridComponent } from '../../../internal/search/iCABSBProductSearch';
import { ExpenseCodeSearchDropDownComponent } from '../../../internal/search/iCABSBExpenseCodeSearch.component';
import { ProductExpenseSearchComponent } from '../../../internal/search/iCABSBProductExpenseSearch';
import { TaxCodeSearchComponent } from '../../../internal/search/iCABSSTaxCodeSearch.component';

@Component({
    templateUrl: 'iCABSBProductExpenseMaintenance.html'
})

export class ProductExpenseMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('ProductExpenseMaintenanceEllipsis') public ProductExpenseMaintenanceEllipsis: EllipsisComponent;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('promptConfirmModalDelete') public promptConfirmModalDelete;

    private queryParams: any = {
        operation: 'Business/iCABSBProductExpenseMaintenance',
        module: 'contract-admin',
        method: 'contract-management/admin'
    };
    private searchParams: any;

    public pageId: string = '';
    public promptConfirmContent: any;
    public productSearchGridComponent: any = ProductSearchGridComponent;
    public isvSCEnableTaxCodeDefaulting: boolean = false;
    public isvbMultipleTaxRates: boolean = false;
    public isVisibilty: boolean = false;
    public inputParamsExpenseCodeSearch: any = { 'parentMode': 'LookUp' };

    public controls = [
        { name: 'ProductCode', required: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractTypeCode' },
        { name: 'ContractTypeDesc' },
        { name: 'ExpenseCode' },
        { name: 'ExpenseDesc' },
        { name: 'InitialChargeExpenseCode' },
        { name: 'InitialChargeExpenseDesc' },
        { name: 'InstallationChargeExpenseCode' },
        { name: 'InstallationChargeExpenseDesc' },
        { name: 'RemovalChargeExpenseCode' },
        { name: 'RemovalChargeExpenseDesc' },
        { name: 'MaterialsExpenseCode' },
        { name: 'MaterialsExpenseDesc' },
        { name: 'LabourExpenseCode' },
        { name: 'LabourExpenseDesc' },
        { name: 'ReplacementExpenseCode' },
        { name: 'ReplacementExpenseDesc' },
        { name: 'TaxCode', type: MntConst.eTypeCode },
        { name: 'TaxCodeDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ROWID' }
    ];

    public ellipsisQueryParams: any = {
        productSearch: {
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
            contentComponent: ProductSearchGridComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productExpense: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Search',
                'showAddNew': true
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ProductExpenseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        taxCode: {
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
            contentComponent: TaxCodeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: true
        }
    };

    public dropdown: any = {
        contractTypeSearch: {
            isRequired: true,
            isDisabled: true,
            isTriggerValidate: false,
            isActive: {
                id: '',
                text: ''
            },
            params: {
                method: 'contract-management/search',
                module: 'contract',
                operation: 'Business/iCABSBContractTypeSearch'
            },
            displayFields: ['ContractTypeCode', 'ContractTypeDesc']
        },
        expenseCodeSearch: {
            isDisabled: true,
            isRequired: true,
            isTriggerValidate: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            },
            isFirstItemSelected: true
        },
        initialExpenseCodeSearch: {
            isDisabled: true,
            isRequired: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        installationExpenseCodeSearch: {
            isDisabled: true,
            isRequired: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        removalExpenseCodeSearch: {
            isDisabled: true,
            isRequired: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        materialExpenseCodeSearch: {
            isDisabled: true,
            isRequired: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        labourExpenseCodeSearch: {
            isDisabled: true,
            isRequired: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        },
        replacementExpenseCodeSearch: {
            isDisabled: true,
            isRequired: false,
            inputParams: {
                'parentMode': 'LookUp'
            },
            active: {
                id: '',
                text: ''
            }
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBPRODUCTEXPENSEMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Product Expense Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();
        this.riMaintenance.FunctionDelete = false;
        this.riMaintenance.FunctionSelect = false;
        this.pageParams.isvSCEnableTaxCodeDefaulting = false;
        this.pageParams.isvbMultipleTaxRates = false;

    }
    ngAfterViewInit(): void {
        this.ellipsisQueryParams.productExpense.autoOpenSearch = true;
        this.ellipsisQueryParams.productSearch.disabled = false;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    //SysChar call
    private getSysCharDtetails(): void {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharMultipleTaxRates,
            this.sysCharConstants.SystemCharDefaultTaxCodeOnServiceCoverMaint

        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            this.pageParams.vMultipleTaxRates = data.records[0]['Required'];
            if (this.pageParams.vMultipleTaxRates) {
                this.pageParams.isvbMultipleTaxRates = true;
                this.isVisibilty = true;
            }
            this.pageParams.vDefaultTaxCode = data.records[1]['Text'];
            if (this.pageParams.vDefaultTaxCode.indexOf(6) > 0) {
                this.pageParams.isvSCEnableTaxCodeDefaulting = true;
            }
        });
    }

    //add mode
    private addProductExpense(): void {
        this.riMaintenance.FunctionDelete = true;
        this.pageParams.mode = 'add';
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '1');
        let data: any = {
            'ProductCode': this.getControlValue('ProductCode'),
            'ContractTypeCode': this.getControlValue('ContractTypeCode'),
            'ExpenseCode': this.getControlValue('ExpenseCode'),
            'InitialChargeExpenseCode': this.getControlValue('InitialChargeExpenseCode'),
            'InstallationChargeExpenseCode': this.getControlValue('InstallationChargeExpenseCode'),
            'RemovalChargeExpenseCode': this.getControlValue('RemovalChargeExpenseCode')
        };
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    let errMsg = '';
                    if (e['errorMessage']) {
                        errMsg = e['errorMessage'];
                    } else if (e['fullError']) {
                        errMsg = e['fullError'];
                    } else {
                        errMsg = '';
                    }
                    if (errMsg !== '') {
                        this.modalAdvService.emitError(new ICabsModalVO(e['errorMessage'], e['fullError']));
                    } else {
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                        this.pageParams.mode = 'update';
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }
    //delete mode
    private deleteProductExpense(data: any): void {
        this.pageParams.mode = 'delete';
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '3');
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.modalAdvService.emitError(new ICabsModalVO(e['oResponse']));
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(e['errorMessage'], e['fullError']));
                    }
                    else {
                        let promptVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.RecordDeleted);
                        promptVO.closeCallback = this.closeModal.bind(this);
                        this.modalAdvService.emitMessage(promptVO);
                        this.uiForm.reset();
                        this.disableControl('TaxCode', false);
                        this.riMaintenance.FunctionSelect = true;
                    }
                }
            },
            (error) => {
                this.modalAdvService.emitError(error);
            });
    }

    private lookupDetailsInitialExpense(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                let initialCode = this.getControlValue('InitialChargeExpenseCode');
                this.dropdown.initialExpenseCodeSearch.active = {
                    id: initialCode,
                    text: initialCode + ' - ' + data[0][0].ExpenseDesc
                };
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    private lookupDetailsInstallationExpense(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                this.dropdown.installationExpenseCodeSearch.active = {
                    id: this.getControlValue('InstallationChargeExpenseCode'),
                    text: this.getControlValue('InstallationChargeExpenseCode') + ' - ' + data[0][0].ExpenseDesc
                };
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    private lookupDetailsRemovalCharge(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                let removalCode = this.getControlValue('RemovalChargeExpenseCode');
                this.dropdown.removalExpenseCodeSearch.active = {
                    id: removalCode,
                    text: removalCode + ' - ' + data[0][0].ExpenseDesc
                };
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    private lookupDetailsMaterialExpense(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                let materialCode = this.getControlValue('MaterialsExpenseCode');
                this.dropdown.materialExpenseCodeSearch.active = {
                    id: materialCode,
                    text: materialCode + ' - ' + data[0][0].ExpenseDesc
                };
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    private lookupDetailsTaxCode(query: any, field: string, control: string): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                this.setControlValue('TaxCodeDesc', data[0][0].TaxCodeDesc);
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    private lookupDetail(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                this.setControlValue('ProductDesc', data[0][0].ProductDesc);
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    private lookupDetailsLabourExpense(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                let labourCode = this.getControlValue('LabourExpenseCode');
                this.dropdown.labourExpenseCodeSearch.active = {
                    id: labourCode,
                    text: labourCode + ' - ' + data[0][0].ExpenseDesc
                };
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    private lookupDetailsReplacementExpense(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                let replacementCode = this.getControlValue('ReplacementExpenseCode');
                this.dropdown.replacementExpenseCodeSearch.active = {
                    id: replacementCode,
                    text: replacementCode + ' - ' + data[0][0].ExpenseDesc
                };
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    //public calls
    public onChangelabourExpenseCode(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'ExpenseCode',
                        'query': {
                            'ExpenseCode': this.getControlValue('LabourExpenseCode')
                        },
                        'fields': ['ExpenseDesc']
                    }];
                this.lookupDetailsLabourExpense(lookupIP);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }
    public closeModal(): void {
        this.ellipsisQueryParams.productExpense.autoOpenSearch = true;
    }

    public productDetailsOnkeydown(data: any): void {
        this.setControlValue('ProductCode', data.ProductCode);
        this.setControlValue('ProductDesc', data.ProductDesc);
    }

    public onChangeproductExpense(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'ProductExpense',
                        'query': {
                            'ProductCode': this.getControlValue('ProductCode')
                        },
                        'fields': ['ProductDesc']
                    }];
                this.lookupDetailProductExpense(lookupIP);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
    public lookupDetailProductExpense(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                this.setControlValue('ProductDesc', data[0][0].ProductDesc);
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }

    public onChangeproductDetails(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'Product',
                        'query': {
                            'ProductCode': this.getControlValue('ProductCode')
                        },
                        'fields': ['ProductDesc']
                    }];
                this.lookupDetail(lookupIP);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
    public onChangeexpenseCode(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        gridParams.set('ProductCode', this.getControlValue('ProductCode'));
        gridParams.set('ContractTypeCode', this.getControlValue('ContractTypeCode'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                this.setControlValue('ExpenseDesc', data['ExpenseDesc']);
                this.setControlValue('InitialChargeExpenseCode', data['InitialChargeExpenseCode']);
                this.setControlValue('InstallationChargeExpenseCode', data['InstallationChargeExpenseCode']);
                this.setControlValue('RemovalChargeExpenseCode', data['RemovalChargeExpenseCode']);
                this.setControlValue('MaterialsExpenseCode', data['MaterialsExpenseCode']);
                this.setControlValue('LabourExpenseCode', data['LabourExpenseCode']);
                this.setControlValue('ReplacementExpenseCode', data['ReplacementExpenseCode']);
                this.setControlValue('TaxCode', data['TaxCode']);
                let lookupIP: any = [
                    {
                        'table': 'ExpenseCode',
                        'query': {
                            'ExpenseCode': this.getControlValue('ExpenseCode')
                        },
                        'fields': ['ExpenseDesc']
                    }];
                this.lookupDetailsExpense(lookupIP);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }
    public lookupDetailsExpense(query: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                let expenseCode = this.getControlValue('ExpenseCode');
                this.dropdown.expenseCodeSearch.active = {
                    id: expenseCode,
                    text: expenseCode + ' - ' + data[0][0].ExpenseDesc
                };
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    public onChangeinitialExpenseCode(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'ExpenseCode',
                        'query': {
                            'ExpenseCode': this.getControlValue('InitialChargeExpenseCode')
                        },
                        'fields': ['ExpenseDesc']
                    }];
                this.lookupDetailsInitialExpense(lookupIP);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public onChangeinstallationExpenseCode(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'ExpenseCode',
                        'query': {
                            'ExpenseCode': this.getControlValue('InstallationChargeExpenseCode')
                        },
                        'fields': ['ExpenseDesc']
                    }];
                this.lookupDetailsInstallationExpense(lookupIP);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public onChangeremovalExpenseCode(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'ExpenseCode',
                        'query': {
                            'ExpenseCode': this.getControlValue('RemovalChargeExpenseCode')
                        },
                        'fields': ['ExpenseDesc']
                    }];
                this.lookupDetailsRemovalCharge(lookupIP);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }
    public onChangematerialExpenseCode(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'ExpenseCode',
                        'query': {
                            'ExpenseCode': this.getControlValue('RemovalChargeExpenseCode')
                        },
                        'fields': ['ExpenseDesc']
                    }];
                this.lookupDetailsMaterialExpense(lookupIP);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public onChangereplacementExpenseCode(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'ExpenseCode',
                        'query': {
                            'ExpenseCode': this.getControlValue('ReplacementExpenseCode')
                        },
                        'fields': ['ExpenseDesc']
                    }];
                this.lookupDetailsReplacementExpense(lookupIP);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }
    public onChangetaxCode(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'TaxCode',
                        'query': {
                            'TaxCode': this.getControlValue('TaxCode')
                        },
                        'fields': ['TaxCodeDesc']
                    }];
                this.lookupDetailsTaxCode(lookupIP, 'TaxCodeDesc', 'TaxCodeDesc');
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public onChangecontractTypeCode(e: any): void {
        let gridParams: URLSearchParams = this.getURLSearchParamObject();
        gridParams.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                let lookupIP: any = [
                    {
                        'table': 'ContractType',
                        'query': {
                            'ContractTypeCode': this.getControlValue('ContractTypeCode')
                        },
                        'fields': ['ContractTypeDesc']
                    }];
                this.lookupQueryDetails(lookupIP, 'ContractTypeDesc', 'ContractTypeDesc');
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }
    public lookupQueryDetails(query: any, field: string, control: string): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(query).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0].length) {
                this.setControlValue('ContractTypeDesc', data[0][0].ContractTypeDesc);
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
        });
    }
    public saveData(): void {
        if (this.uiForm.valid) {
            if (this.pageParams.mode === 'add') {
                this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                this.promptConfirmModal.show();
            }
            else if (this.pageParams.mode === 'update') {
                this.riMaintenance.FunctionDelete = true;
                this.riMaintenance.FunctionSelect = true;
                this.ellipsisQueryParams.productSearch.disabled = true;
                this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
                this.promptConfirmModal.show();
            }
        }
        else {
            this.dropdown.contractTypeSearch.isTriggerValidate = true;
            this.dropdown.expenseCodeSearch.isTriggerValidate = true;
        }
    }

    //update mode
    public updateProductExpense(data: any): void {
        this.pageParams.mode = 'update';
        let searchParams: URLSearchParams = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '2');
        searchParams.set('ROWID', this.getControlValue('ROWID'));
        searchParams.set('ProductCode', this.getControlValue('ProductCode'));
        searchParams.set('ContractTypeCode', this.getControlValue('ContractTypeCode'));
        searchParams.set('ExpenseCode', this.getControlValue('ExpenseCode'));
        searchParams.set('InitialChargeExpenseCode', this.getControlValue('InitialChargeExpenseCode'));
        searchParams.set('InstallationChargeExpenseCode', this.getControlValue('InstallationChargeExpenseCode'));
        searchParams.set('RemovalChargeExpenseCode', this.getControlValue('RemovalChargeExpenseCode'));
        searchParams.set('MaterialsExpenseCode', this.getControlValue('MaterialsExpenseCode'));
        searchParams.set('LabourExpenseCode', this.getControlValue('LabourExpenseCode'));
        searchParams.set('ReplacementExpenseCode', this.getControlValue('ReplacementExpenseCode'));
        searchParams.set('TaxCode', this.getControlValue('TaxCode'));
        this.ajaxSource.next(AjaxConstant.START);
        this.ajaxSubscription = this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, data)
            .subscribe(
            (e) => {
                this.ajaxSource.next(AjaxConstant.COMPLETE);
                if (e['status'] === 'failure') {
                    this.modalAdvService.emitError(new ICabsModalVO(e['oResponse']));
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(e['errorMessage'], e['fullError']));
                    } else {
                        this.setControlValue('ROWID', this.getControlValue('ROWID'));
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                    }
                }
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error));
            });
    }
    public deleteData(obj: any): void {
        this.riMaintenance.FunctionDelete = false;
        this.riMaintenance.FunctionDelete = true;
        this.promptConfirmContent = MessageConstant.Message.DeleteRecord;
        this.promptConfirmModalDelete.show();
    }

    public promptConfirm(type: any): void {
        let formdData: any = {};
        formdData['ROWID'] = this.getControlValue('ROWID');
        switch (type) {
            case 'save':
                if (this.pageParams.mode === 'update' && this.getControlValue('ROWID') !== '') {
                    this.updateProductExpense(formdData);
                } else {
                    this.addProductExpense();
                }
                break;
            case 'delete':
                this.deleteProductExpense(formdData);
                break;
            default:
                break;
        }
    }
    public search(): void {
        this.riExchange.resetCtrl(this.controls);
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.dropdown.contractTypeSearch.isActive = { id: '', text: '' };
        this.dropdown.contractTypeSearch.isDisabled = true;
        this.ellipsisQueryParams.taxCode.disabled = true;
        this.riExchange.riInputElement.Disable(this.uiForm, 'TaxCode');
        this.disableControl('TaxCode', true);
        this.disableControl('ProductCode', false);
        this.riMaintenance.FunctionDelete = false;
        for (let key in this.dropdown) {
            if (this.dropdown.hasOwnProperty(key)) {
                this.dropdown[key].isDisabled = true;
                this.dropdown[key].active = { id: '', text: '' };
            }
        }
        this.ellipsisQueryParams.productExpense.autoOpenSearch = true;
    }

    public cancel(): void {
        this.riMaintenance.FunctionDelete = false;
        this.riExchange.resetCtrl(this.controls);
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.dropdown.contractTypeSearch.isActive = { id: '', text: '' };
        this.dropdown.contractTypeSearch.isDisabled = true;
        this.ellipsisQueryParams.taxCode.disabled = true;
        this.riExchange.riInputElement.Disable(this.uiForm, 'TaxCode');
        this.disableControl('TaxCode', true);
        this.disableControl('ProductCode', false);
        for (let key in this.dropdown) {
            if (this.dropdown.hasOwnProperty(key)) {
                this.dropdown[key].isDisabled = true;
                this.dropdown[key].active = { id: '', text: '' };
            }
        }
    }
    public productSearchOnchange(data: any): void {
        this.ellipsisQueryParams.productExpense.autoOpenSearch = false;
        for (let key in this.dropdown) {
            if (this.dropdown.hasOwnProperty(key)) {
                this.dropdown[key].isDisabled = false;
            }
        }
        if (data.mode === 'add') {
            this.pageParams.mode = 'add';
            this.riMaintenance.FunctionDelete = false;
            this.riMaintenance.FunctionSelect = false;
            this.disableControl('taxCode', false);
            this.ellipsisQueryParams.taxCode.disabled = false;
            this.dropdown.contractTypeSearch.isDisabled = false;
            this.dropdown.contractTypeSearch.isDisabled = false;
        }
        else {
            this.pageParams.mode = 'update';
            this.dropdown.contractTypeSearch.isDisabled = true;
            this.dropdown.contractTypeSearch.isActive = {
                id: data.ExpenseCode,
                text: data.ContractTypeCode + ' - ' + data.ContractTypeDesc
            };
            this.setControlValue('ExpenseCode', data.ExpenseCode);
            this.setControlValue('ProductCode', data.ProductCode);
            this.setControlValue('ContractTypeCode', data.ContractTypeCode);
            this.setControlValue('ROWID', data.ttProductExpense);
            this.onChangeproductDetails(event);
            this.onChangeexpenseCode(event);
            this.onChangetaxCode(event);
            this.onChangeinitialExpenseCode(event);
            this.onChangeinstallationExpenseCode(event);
            this.onChangeremovalExpenseCode(event);
            this.onChangematerialExpenseCode(event);
            this.onChangelabourExpenseCode(event);
            this.onChangereplacementExpenseCode(event);
            this.disableControl('ProductCode', true);
            this.ellipsisQueryParams.taxCode.disabled = false;
            this.riMaintenance.FunctionDelete = true;
            this.riMaintenance.FunctionSelect = false;
            this.ellipsisQueryParams.productSearch.disabled = true;
        }
    }
    public onExpenseCodeReceived(data: any): void {
        this.setControlValue('ExpenseCode', data.ExpenseCode);
    }
    public onDefaultTaxChange(data: any): void {
        this.setControlValue('TaxCode', data.TaxCode);
        this.setControlValue('TaxCodeDesc', data.TaxCodeDesc);
    }
    public onInitialExpenseCodeReceived(data: any): void {
        this.setControlValue('InitialChargeExpenseCode', data.ExpenseCode);
    }
    public onInstallationExpenseCodeReceived(data: any): void {
        this.setControlValue('InstallationChargeExpenseCode', data.ExpenseCode);
    }
    public onRemovalExpenseCodeReceived(data: any): void {
        this.setControlValue('RemovalChargeExpenseCode', data.ExpenseCode);
    }
    public onMaterialsExpenseCodeReceived(data: any): void {
        this.setControlValue('MaterialsExpenseCode', data.ExpenseCode);
    }
    public onLabourExpenseCodeReceived(data: any): void {
        this.setControlValue('LabourExpenseCode', data.ExpenseCode);
    }
    public onReplacementExpenseCodeReceived(data: any): void {
        this.setControlValue('ReplacementExpenseCode', data.ExpenseCode);
    }
    public onContractTypeDataReceive(data: any): void {
        this.setControlValue('ContractTypeCode', data.ContractTypeCode);
    }
}
