import { Component, NgZone, ViewChild, Renderer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';
import { HttpService } from '../../../shared/services/http-service';
import { SysCharConstants } from '../../../shared/constants/syscharservice.constant';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { ErrorService } from '../../../shared/services/error.service';
import { MessageService } from '../../../shared/services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ComponentInteractionService } from '../../../shared/services/component-interaction.service';
import { GlobalConstant } from '../../../shared/constants/global.constant';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { AjaxObservableConstant } from '../../../shared/constants/ajax-observable.constant';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { Utils } from '../../../shared/services/utility';
import { RiExchange } from './../../../shared/services/riExchange';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
export var ContractInvoiceGridComponent = (function () {
    function ContractInvoiceGridComponent(fb, router, route, httpService, serviceConstants, zone, renderer, global, ajaxconstant, errorService, messageService, titleService, translate, localeTranslateService, componentInteractionService, location, store, utils, SysCharConstants, riExchange) {
        var _this = this;
        this.fb = fb;
        this.router = router;
        this.route = route;
        this.httpService = httpService;
        this.serviceConstants = serviceConstants;
        this.zone = zone;
        this.renderer = renderer;
        this.global = global;
        this.ajaxconstant = ajaxconstant;
        this.errorService = errorService;
        this.messageService = messageService;
        this.titleService = titleService;
        this.translate = translate;
        this.localeTranslateService = localeTranslateService;
        this.componentInteractionService = componentInteractionService;
        this.location = location;
        this.store = store;
        this.utils = utils;
        this.SysCharConstants = SysCharConstants;
        this.riExchange = riExchange;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.maxColumn = 10;
        this.currentPage = 1;
        this.inputParams = {
            'parentMode': 'Contract',
            'pageTitle': 'Invoice History',
            'pageHeader': 'Contract Details',
            'showBusinessCode': false,
            'showCountryCode': false
        };
        this.query = new URLSearchParams();
        this.queryLookUp = new URLSearchParams();
        this.querySysChar = new URLSearchParams();
        this.queryParams = {
            action: '2',
            operation: 'Application/iCABSAContractInvoiceGrid',
            module: 'invoicing',
            method: 'bill-to-cash/maintenance',
            contentType: 'application/x-www-form-urlencoded',
            riSortOrder: 'Ascending',
            mode: 'Contract'
        };
        this.showCloseButton = true;
        this.showHeader = true;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.ajaxSource = new BehaviorSubject(0);
        this.isRequesting = false;
        this.showContract = true;
        this.showPremise = false;
        this.showAccount = false;
        this.showProduct = false;
        this.showEmailInvoice = false;
        this.showSelectedInvoice = false;
        this.showButton = false;
        this.showDisputed = true;
        this.backLinkText = '';
        this.backLinkUrl = '';
        this.limitByCustomerContact = '';
        this.sysCharParams = {};
        this.glDisputedInvoicesInUse = false;
        this.lShowDisputedColumn = false;
        this.lBudgetBilling = false;
        this.dataSentFromParent = {};
        this.translatedHeader = {
            'Account': '',
            'Contract': '',
            'Premise': '',
            'Product': '',
            'TicketMaintenance': '',
            'ContactCentreSearch': '',
            'WorkOrderMaintenance': ''
        };
        this.currentContractTypeURLParameter = '';
        this.contractInvoiceFormGroup = this.fb.group({
            ContractNumber: [{ value: '', disabled: true }],
            ContractName: [{ value: '', disabled: true }],
            AccountNumber: [{ value: '', disabled: false }],
            AccountName: [{ value: '', disabled: true }],
            ProductCode: [{ value: '', disabled: false }],
            ProductDesc: [{ value: '', disabled: true }],
            PremiseNumber: [{ value: '', disabled: false }],
            PremiseName: [{ value: '', disabled: true }],
            ShowLastInvoices: [{ value: '25', disabled: false }],
            EmailInvoice: [{ value: '', disabled: false }],
            SelectedInvoice: [{ value: '', disabled: false }]
        });
        this.routeSubscription = this.route.queryParams.subscribe(function (params) {
            _this.dataSentFromParent = params;
            switch (params['parentMode']) {
                case 'Contract':
                    _this.inputParams.parentMode = params['parentMode'];
                    _this.showContract = true;
                    _this.showAccount = false;
                    _this.showPremise = false;
                    _this.showProduct = false;
                    _this.maxColumn = 11;
                    _this.queryParams.mode = 'Contract';
                    _this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(_this.dataSentFromParent.ContractNumber);
                    _this.contractInvoiceFormGroup.controls['ContractName'].setValue(_this.dataSentFromParent.ContractName);
                    _this.storeSubscription = _this.store.select('contract').subscribe(function (data) {
                        _this.contractData = data['data'];
                        _this.storeData = data;
                        if (_this.contractData && _this.contractData.ContractNumber) {
                            _this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(_this.contractData.ContractNumber);
                            _this.contractInvoiceFormGroup.controls['ContractName'].setValue(_this.contractData.ContractName);
                        }
                    });
                    break;
                case 'Account':
                    _this.inputParams.parentMode = params['parentMode'];
                    _this.storeSubscription = _this.store.select('accountMaintenance').subscribe(function (data) {
                        _this.storeData = data;
                    });
                    _this.showContract = false;
                    _this.showAccount = true;
                    _this.showPremise = false;
                    _this.showProduct = false;
                    _this.maxColumn = 12;
                    _this.queryParams.mode = 'Account';
                    _this.contractInvoiceFormGroup.controls['AccountNumber'].setValue(_this.dataSentFromParent.AccountNumber);
                    _this.contractInvoiceFormGroup.controls['AccountName'].setValue(_this.dataSentFromParent.AccountName);
                    break;
                case 'Premise':
                    _this.inputParams.parentMode = params['parentMode'];
                    _this.showContract = true;
                    _this.showAccount = false;
                    _this.showPremise = true;
                    _this.showProduct = false;
                    _this.queryParams.mode = 'Premise';
                    _this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(_this.dataSentFromParent.ContractNumber);
                    _this.contractInvoiceFormGroup.controls['ContractName'].setValue(_this.dataSentFromParent.ContractName);
                    _this.contractInvoiceFormGroup.controls['PremiseNumber'].setValue(_this.dataSentFromParent.PremiseNumber);
                    _this.contractInvoiceFormGroup.controls['PremiseName'].setValue(_this.dataSentFromParent.PremiseName);
                    break;
                case 'Product':
                    _this.inputParams.parentMode = params['parentMode'];
                    _this.showContract = true;
                    _this.showAccount = false;
                    _this.showPremise = true;
                    _this.showProduct = true;
                    _this.queryParams.mode = 'Product';
                    _this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(_this.dataSentFromParent.ContractNumber);
                    _this.contractInvoiceFormGroup.controls['ContractName'].setValue(_this.dataSentFromParent.ContractName);
                    _this.contractInvoiceFormGroup.controls['PremiseNumber'].setValue(_this.dataSentFromParent.PremiseNumber);
                    _this.contractInvoiceFormGroup.controls['PremiseName'].setValue(_this.dataSentFromParent.PremiseName);
                    _this.contractInvoiceFormGroup.controls['ProductCode'].setValue(_this.dataSentFromParent.ProductCode);
                    _this.contractInvoiceFormGroup.controls['ProductDesc'].setValue(_this.dataSentFromParent.ProductDesc);
                    break;
                case 'TicketMaintenance':
                case 'ContactCentreSearch':
                    _this.inputParams.parentMode = params['parentMode'];
                    _this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(_this.dataSentFromParent.ContractNumber);
                    _this.contractInvoiceFormGroup.controls['ContractName'].setValue(_this.dataSentFromParent.ContractName);
                    _this.contractInvoiceFormGroup.controls['PremiseNumber'].setValue(_this.dataSentFromParent.PremiseNumber);
                    _this.contractInvoiceFormGroup.controls['PremiseName'].setValue(_this.dataSentFromParent.PremiseName);
                    _this.contractInvoiceFormGroup.controls['AccountNumber'].setValue(_this.dataSentFromParent.AccountNumber);
                    _this.contractInvoiceFormGroup.controls['AccountName'].setValue(_this.dataSentFromParent.AccountContactName);
                    _this.customerContactNumber = _this.dataSentFromParent.customerContactNumber;
                    _this.disputedInvoiceCacheName = _this.dataSentFromParent.disputedInvoiceCacheName;
                    _this.queryParams.mode = 'Account';
                    break;
                case 'WorkOrderMaintenance':
                    _this.inputParams.parentMode = params['parentMode'];
                    _this.contractInvoiceFormGroup.controls['AccountNumber'].setValue(_this.dataSentFromParent.AccountNumber);
                    _this.customerContactNumber = _this.dataSentFromParent.customerContactNumber;
                    _this.queryParams.mode = 'Account';
                    _this.limitByCustomerContact = 'Y';
                    break;
                default:
                    break;
            }
            if (params['budgetbilling']) {
                _this.lBudgetBilling = true;
                _this.inputParams.parentMode = 'Contract';
            }
            else {
                _this.lBudgetBilling = false;
            }
        });
    }
    ContractInvoiceGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.ajaxSource$ = this.ajaxSource.asObservable();
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.premiseComponent = AccountSearchComponent;
        this.productComponent = AccountSearchComponent;
        this.accountComponent = AccountSearchComponent;
        this.errorService.emitError(0);
        this.errorSubscription = this.errorService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    if (data['errorMessage']) {
                        _this.errorModal.show(data, true);
                    }
                });
            }
        });
        this.messageService.emitMessage(0);
        this.messageSubscription = this.messageService.getObservableSource().subscribe(function (data) {
            if (data !== 0) {
                _this.zone.run(function () {
                    _this.messageModal.show({ msg: MessageConstant.Message.SavedSuccessfully, title: 'Message' }, false);
                });
            }
        });
        this.ajaxSubscription = this.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.zone.run(function () {
                    switch (event) {
                        case _this.ajaxconstant.START:
                            _this.isRequesting = true;
                            break;
                        case _this.ajaxconstant.COMPLETE:
                            _this.isRequesting = false;
                            break;
                    }
                });
            }
        });
        this.localeTranslateService.setUpTranslation();
        this.accountComponent = AccountSearchComponent;
        this.productComponent = AccountSearchComponent;
        this.premiseComponent = AccountSearchComponent;
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.fetchSysChar().subscribe(function (e) {
            if (e.errorMessage) {
                _this.errorService.emitError({
                    errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
                });
                return false;
            }
            if (e.records && e.records.length > 0) {
                _this.sysCharParams['vEnableRounding'] = e.records[0].Required;
                _this.sysCharParams['vSCEnableMultipleInvoiceLayouts'] = e.records[1].Required;
                _this.sysCharParams['vSCNumberOfInvoiceLayouts'] = e.records[1].Integer;
                _this.sysCharParams['vSCEnableSeparateTaxInvLayout'] = e.records[2].Required;
                _this.sysCharParams['vReproduceInvoiceForEmail'] = e.records[3].Required;
                if (_this.sysCharParams['vReproduceInvoiceForEmail']) {
                    _this.showEmailInvoice = true;
                    _this.contractInvoiceFormGroup.controls['EmailInvoice'].setValue(false);
                }
                else {
                    _this.showEmailInvoice = false;
                }
                _this.setVariables();
            }
            _this.lookUpRegistry();
        }, function (err) {
            _this.errorService.emitError({
                errorMessage: ErrorConstant.Message.SystemCharacteristicsFetchError
            });
        });
        this.contractInvoiceFormGroup.controls['AccountNumber'].disable();
        if (!this.lBudgetBilling) {
            this.contractInvoiceFormGroup.controls['ContractNumber'].disable();
            this.contractInvoiceFormGroup.controls['PremiseNumber'].disable();
        }
        else {
            this.contractInvoiceFormGroup.controls['ContractNumber'].enable();
            var focus_1 = new Event('focus', { bubbles: false });
            setTimeout(function () {
                _this.renderer.invokeElementMethod(document.getElementById('ContractNumber'), 'focus', [focus_1]);
            }, 0);
        }
        this.contractInvoiceFormGroup.controls['ProductCode'].disable();
        this.onAccountBlur({});
    };
    ContractInvoiceGridComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
    };
    ContractInvoiceGridComponent.prototype.ngOnDestroy = function () {
        if (this.routeSubscription)
            this.routeSubscription.unsubscribe();
        if (this.messageSubscription)
            this.messageSubscription.unsubscribe();
        if (this.errorSubscription)
            this.errorSubscription.unsubscribe();
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.translateSubscription)
            this.translateSubscription.unsubscribe();
        this.titleService.setTitle('');
    };
    ContractInvoiceGridComponent.prototype.setVariables = function () {
        if (this.sysCharParams['vSCEnableMultipleInvoiceLayouts'] && this.sysCharParams['vSCNumberOfInvoiceLayouts'] > 0 && !this.sysCharParams['vSCEnableSeparateTaxInvLayout']) {
            this.scNumberOfInvoiceLayouts = this.sysCharParams['vSCNumberOfInvoiceLayouts'];
        }
        else {
            this.scNumberOfInvoiceLayouts = 0;
        }
    };
    ContractInvoiceGridComponent.prototype.getCellData = function (data) {
        var _this = this;
        var selectedInvoice = {};
        var vMultiple = '';
        if ((this.dataSentFromParent['parentMode'] === 'Account' && (data.cellIndex === 1 || data.cellIndex === 3)) || (this.dataSentFromParent['parentMode'] !== 'Account' && (data.cellIndex === 0 || data.cellIndex === 2))) {
            selectedInvoice['CompanyCode'] = data.trRowData[data.cellIndex].text;
            selectedInvoice['CompanyDesc'] = data.trRowData[data.cellIndex].additionalData;
        }
        if (this.dataSentFromParent['parentMode'] === 'Account') {
            if (this.lBudgetBilling) {
                if (data.cellIndex === 10 || data.cellIndex === 2) {
                    selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
                    selectedInvoice['SystemInvoiceNumber'] = data.trRowData[10].additionalData;
                }
            }
            else {
                if (data.cellIndex === 9 || data.cellIndex === 2) {
                    selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
                    selectedInvoice['SystemInvoiceNumber'] = data.trRowData[9].additionalData;
                }
            }
            selectedInvoice['InvoiceNumber'] = data.trRowData[2].text.trim();
            selectedInvoice['InvoiceName'] = data.trRowData[4].text;
            vMultiple = data.trRowData[3].additionalData;
            if (vMultiple === 'no') {
                selectedInvoice['ContractNumber'] = data.trRowData[0].text;
                selectedInvoice['ContractName'] = data.trRowData[0].toolTip;
                selectedInvoice['ContractRowID'] = data.trRowData[0].rowID;
            }
            else {
                this.getTranslatedValue('Multiple', null).subscribe(function (res) {
                    _this.zone.run(function () {
                        if (res) {
                            selectedInvoice['ContractNumber'] = res;
                            selectedInvoice['ContractName'] = res;
                        }
                    });
                });
                selectedInvoice['ContractRowID'] = 'ABC123';
            }
            if (data.trRowData[0].additionalData === 'C') {
                this.currentContractTypeURLParameter = '';
            }
            else if (data.trRowData[0].additionalData === 'J') {
                this.currentContractTypeURLParameter = '<job>';
            }
            else if (data.trRowData[0].additionalData === 'P') {
                this.currentContractTypeURLParameter = '<product>';
            }
        }
        else {
            if (this.lBudgetBilling) {
                if (data.cellIndex === 9 || data.cellIndex === 1) {
                    selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
                    selectedInvoice['SystemInvoiceNumber'] = data.trRowData[9].additionalData;
                }
            }
            else {
                if (data.cellIndex === 8 || data.cellIndex === 1) {
                    selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
                    selectedInvoice['SystemInvoiceNumber'] = data.trRowData[8].additionalData;
                }
            }
            selectedInvoice['InvoiceNumber'] = data.trRowData[1].text.trim();
            selectedInvoice['InvoiceName'] = data.trRowData[3].text;
            vMultiple = data.trRowData[2].additionalData;
        }
        if (!selectedInvoice['RowID']) {
            selectedInvoice['RowID'] = data.trRowData[data.cellIndex].rowID;
            selectedInvoice['SystemInvoiceNumber'] = data.trRowData[data.cellIndex].additionalData;
        }
        selectedInvoice['Cell'] = data.cellIndex;
        selectedInvoice['Row'] = data.rowIndex;
        selectedInvoice['Level'] = 'Header';
        if (this.dataSentFromParent['parentMode'] !== 'TicketMaintenance' && this.dataSentFromParent['parentMode'] !== 'ContactCentreSearch') {
            if (this.sysCharParams['vSCEnableSeparateTaxInvLayout']) {
                this.layoutNumber = data.trRowData[this.maxColumn - 1].additionalData;
            }
        }
        if (!selectedInvoice['ContractNumber']) {
            selectedInvoice['ContractNumber'] = this.dataSentFromParent['ContractNumber'];
        }
        if (!selectedInvoice['ContractName']) {
            selectedInvoice['ContractName'] = this.dataSentFromParent['ContractName'];
        }
        selectedInvoice['AccountNumber'] = this.dataSentFromParent['AccountNumber'];
        selectedInvoice['AccountName'] = this.dataSentFromParent['AccountName'];
        this.selectedInvoice = selectedInvoice;
    };
    ContractInvoiceGridComponent.prototype.onGridRowDblClick = function (data) {
        this.getCellData(data);
        if (data.cellData.text === 'SP') {
            this.triggerPrint(data.cellData.rowID);
        }
        if (this.dataSentFromParent['parentMode'] === 'Account') {
            if (data.cellIndex === 0) {
                if (this.lBudgetBilling) {
                    this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
                        queryParams: {
                            parentMode: 'InvoiceHistory',
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName']
                        }
                    });
                }
                else {
                    if (data.cellData.additionalData === 'J') {
                        this.router.navigate([ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE], {
                            queryParams: {
                                parentMode: 'InvoiceHistory',
                                ContractNumber: this.selectedInvoice['ContractNumber'],
                                ContractName: this.selectedInvoice['ContractName']
                            }
                        });
                    }
                    else if (data.cellData.additionalData === 'P') {
                        this.router.navigate([ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE], {
                            queryParams: {
                                parentMode: 'InvoiceHistory',
                                ContractNumber: this.selectedInvoice['ContractNumber'],
                                ContractName: this.selectedInvoice['ContractName']
                            }
                        });
                    }
                    else {
                        this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                            queryParams: {
                                parentMode: 'InvoiceHistory',
                                ContractNumber: this.selectedInvoice['ContractNumber'],
                                ContractName: this.selectedInvoice['ContractName']
                            }
                        });
                    }
                }
            }
            else if (data.cellIndex === 2) {
                if (this.lBudgetBilling) {
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], {
                        queryParams: {
                            parentMode: 'BudgetBilling',
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName'],
                            ContractTypeCode: 'J',
                            InvoiceNumber: data.cellData.text.trim(),
                            CompanyCode: data.trRowData[1].text,
                            CompanyDesc: data.trRowData[1].additionalData,
                            InvoiceName: data.trRowData[4].text,
                            AccountNumber: this.selectedInvoice['AccountNumber'],
                            AccountName: this.selectedInvoice['AccountName'],
                            SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                        }
                    });
                }
                else {
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], {
                        queryParams: {
                            parentMode: this.dataSentFromParent['parentMode'],
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName'],
                            ContractTypeCode: this.currentContractTypeURLParameter,
                            InvoiceNumber: data.cellData.text.trim(),
                            CompanyCode: data.trRowData[1].text,
                            CompanyDesc: data.trRowData[1].additionalData,
                            InvoiceName: data.trRowData[4].text,
                            AccountNumber: this.selectedInvoice['AccountNumber'],
                            AccountName: this.selectedInvoice['AccountName'],
                            SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                        }
                    });
                }
            }
            if ((this.lBudgetBilling && data.cellIndex === 10) || (!this.lBudgetBilling && data.cellIndex === 9)) {
            }
        }
        else {
            if (data.cellIndex === 1) {
                if (this.lBudgetBilling) {
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], {
                        queryParams: {
                            parentMode: 'BudgetBilling',
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName'],
                            ContractTypeCode: 'J',
                            InvoiceNumber: data.cellData.text.trim(),
                            CompanyCode: data.trRowData[0].text,
                            CompanyDesc: data.trRowData[0].additionalData,
                            InvoiceName: data.trRowData[3].text,
                            AccountNumber: this.selectedInvoice['AccountNumber'],
                            AccountName: this.selectedInvoice['AccountName'],
                            SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                        }
                    });
                }
                else {
                    this.router.navigate([ContractManagementModuleRoutes.ICABSACONTRACTINVOICEDETAILGRID], {
                        queryParams: {
                            parentMode: this.dataSentFromParent['parentMode'],
                            ContractNumber: this.selectedInvoice['ContractNumber'],
                            ContractName: this.selectedInvoice['ContractName'],
                            ContractTypeCode: this.currentContractTypeURLParameter,
                            InvoiceNumber: data.cellData.text.trim(),
                            CompanyCode: data.trRowData[0].text,
                            CompanyDesc: data.trRowData[0].additionalData,
                            InvoiceName: data.trRowData[3].text,
                            AccountNumber: this.selectedInvoice['AccountNumber'],
                            AccountName: this.selectedInvoice['AccountName'],
                            SystemInvoiceNumber: this.selectedInvoice['SystemInvoiceNumber']
                        }
                    });
                }
            }
            if ((this.lBudgetBilling && data.cellIndex === 9) || (!this.lBudgetBilling && data.cellIndex === 8)) {
            }
        }
        if (data.cellData.text.toUpperCase() === 'SMILEUP' || data.cellData.text.toUpperCase() === 'SU' || data.cellData.text.toUpperCase() === 'SMILEDOWN' || data.cellData.text.toUpperCase() === 'SD') {
            this.router.navigate(['/ccm/centreReview'], {
                queryParams: {
                    parentMode: 'InvoiceHistory',
                    ContractNumber: this.selectedInvoice['ContractNumber'],
                    ContractName: this.selectedInvoice['ContractName'],
                    AccountNumber: this.contractInvoiceFormGroup.controls['AccountNumber'].value,
                    AccountName: this.contractInvoiceFormGroup.controls['AccountName'].value
                }
            });
        }
    };
    ContractInvoiceGridComponent.prototype.triggerPrint = function (rowId) {
        var _this = this;
        var search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '0');
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('Function', 'Single');
        search.set('InvoiceNumber', rowId);
        search.set('EmailInvoice', 'False');
        search.set('LayoutNumber', this.layoutNumber ? this.layoutNumber.toString() : '');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(function (data) {
            try {
                if (!data['fullError']) {
                    window.open(data.url, '_blank');
                }
                else {
                    if (data.fullError.indexOf('iCABSAInvoiceReprintMaintenance.htm') >= 0) {
                        var tempList = data.fullError.split('?');
                        if (tempList && tempList.length > 1) {
                            var params = new URLSearchParams(tempList[1]);
                            _this.router.navigate(['application/invoiceReprintMaintenance'], { queryParams: { InvoiceNumber: params.get('InvoiceNumber'), InvoiceRowId: rowId } });
                        }
                    }
                }
            }
            catch (error) {
                _this.errorService.emitError(error);
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    ContractInvoiceGridComponent.prototype.sysCharParameters = function () {
        var sysCharList = [
            this.SysCharConstants.SystemCharEnableRoundingValuesOnInvoiceHistory,
            this.SysCharConstants.SystemCharEnableMultipleInvoiceLayouts,
            this.SysCharConstants.SystemCharEnableSeparateTaxAndNonTaxInvoiceLayouts,
            this.SysCharConstants.SystemCharReproduceInvoicesForEmail
        ];
        return sysCharList.join(',');
    };
    ContractInvoiceGridComponent.prototype.fetchSysChar = function () {
        var sysCharNumbers = this.sysCharParameters();
        this.querySysChar.set(this.serviceConstants.Action, '0');
        if (this.storeData && this.storeData['code'] && this.storeData['code'].business) {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.storeData['code'].business);
            this.querySysChar.set(this.serviceConstants.CountryCode, this.storeData['code'].country);
        }
        else {
            this.querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        this.querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(this.querySysChar);
    };
    ContractInvoiceGridComponent.prototype.setMaxColumn = function () {
        switch (this.dataSentFromParent['parentMode']) {
            case 'Contract':
                this.calculateMaxColumn(10);
                this.inputParams.pageHeader = this.translatedHeader['Contract'];
                break;
            case 'Account':
                this.calculateMaxColumn(11);
                this.inputParams.pageHeader = this.translatedHeader['Account'];
                break;
            case 'Premise':
                this.calculateMaxColumn(10);
                this.inputParams.pageHeader = this.translatedHeader['Premise'];
                break;
            case 'Product':
                this.calculateMaxColumn(10);
                this.inputParams.pageHeader = this.translatedHeader['Product'];
                break;
            case 'TicketMaintenance':
            case 'ContactCentreSearch':
                this.maxColumn = 10;
                if (this.lBudgetBilling) {
                    this.maxColumn += 1;
                }
                if (this.sysCharParams['vEnableRounding']) {
                    this.maxColumn += 2;
                }
                this.maxColumn++;
                if (this.dataSentFromParent['parentMode'] === 'TicketMaintenance') {
                    this.inputParams.pageHeader = this.translatedHeader['TicketMaintenance'];
                }
                else {
                    this.inputParams.pageHeader = this.translatedHeader['ContactCentreSearch'];
                }
                break;
            case 'WorkOrderMaintenance':
                this.calculateMaxColumn(10);
                this.inputParams.pageHeader = this.translatedHeader['WorkOrderMaintenance'];
                break;
            default:
                this.calculateMaxColumn(10);
                break;
        }
    };
    ContractInvoiceGridComponent.prototype.calculateMaxColumn = function (maxColumn) {
        if (this.lBudgetBilling) {
            maxColumn += 2;
        }
        else {
            if (this.scNumberOfInvoiceLayouts > 1) {
                maxColumn += this.scNumberOfInvoiceLayouts;
                this.layoutNumber = this.scNumberOfInvoiceLayouts;
            }
            else {
                maxColumn++;
            }
        }
        if (this.sysCharParams['vEnableRounding']) {
            maxColumn += 2;
        }
        if (this.lShowDisputedColumn) {
            maxColumn++;
        }
        this.maxColumn = maxColumn;
    };
    ContractInvoiceGridComponent.prototype.fetchGridData = function () {
        this.query.set(this.serviceConstants.Action, this.queryParams.action);
        this.query.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.query.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.query.set('PageSize', this.itemsPerPage.toString());
        this.query.set('PageCurrent', this.currentPage.toString());
        this.query.set('ContractNumber', this.contractInvoiceFormGroup.controls['ContractNumber'].value);
        this.query.set('PremiseNumber', this.contractInvoiceFormGroup.controls['PremiseNumber'].value);
        this.query.set('PremiseName', this.contractInvoiceFormGroup.controls['PremiseName'].value);
        this.query.set('AccountNumber', this.contractInvoiceFormGroup.controls['AccountNumber'].value);
        this.query.set('AccountName', this.contractInvoiceFormGroup.controls['AccountName'].value);
        this.query.set('ProductCode', this.contractInvoiceFormGroup.controls['ProductCode'].value);
        this.query.set('EmailInvoice', this.contractInvoiceFormGroup.controls['EmailInvoice'].value);
        this.query.set('ShowLastInvoices', this.contractInvoiceFormGroup.controls['ShowLastInvoices'].value);
        this.query.set('SelectedInvoice', this.contractInvoiceFormGroup.controls['SelectedInvoice'].value);
        this.query.set('CustomerContactNumber', '');
        this.query.set('InitialExchangeParentMode', this.dataSentFromParent['parentMode']);
        this.query.set('SCNumberOfInvoiceLayouts', this.scNumberOfInvoiceLayouts.toString());
        this.query.set('SCEnableSeparateTaxInvoiceLayout', this.sysCharParams['vSCEnableSeparateTaxInvLayout'].toString());
        this.query.set('ShowLast', this.contractInvoiceFormGroup.controls['ShowLastInvoices'].value);
        this.query.set('ShowDisputedColumn', this.lShowDisputedColumn ? 'Y' : '');
        this.query.set('DisputedInvoiceCacheName', this.disputedInvoiceCacheName);
        this.query.set('LimitByCustomerContact', this.limitByCustomerContact);
        this.query.set('BudgetBilling', this.lBudgetBilling ? 'Y' : '');
        this.query.set('HeaderClickedColumn', this.inputParams.parentMode);
        this.query.set('Mode', this.queryParams.mode);
        this.query.set('riSortOrder', this.queryParams.sortOrder);
        this.query.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.queryParams.search = this.query;
        this.contractInvoiceGrid.loadGridData(this.queryParams);
    };
    ContractInvoiceGridComponent.prototype.gridInfo = function (value) {
        if (value && value.totalPages) {
            this.gridTotalItems = parseInt(value.totalPages, 10) * this.itemsPerPage;
        }
        else {
            this.gridTotalItems = 0;
        }
    };
    ContractInvoiceGridComponent.prototype.onAccountBlur = function (event) {
        var _this = this;
        if (this.contractInvoiceFormGroup.controls['AccountNumber'].value && this.contractInvoiceFormGroup.controls['AccountNumber'].value !== '') {
            var data = [{
                    'table': 'Account',
                    'query': { 'AccountNumber': this.contractInvoiceFormGroup.controls['AccountNumber'].value, 'BusinessCode': this.storeData['code'].business, 'CountryCode': this.storeData['code'].country },
                    'fields': ['AccountNumber', 'AccountName']
                }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.contractInvoiceFormGroup.controls['AccountName'].setValue(e['results'][0][0].AccountName);
                }
                else {
                    _this.contractInvoiceFormGroup.controls['AccountName'].setValue('');
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                }
            }, function (error) {
                _this.contractInvoiceFormGroup.controls['AccountName'].setValue('');
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            });
        }
        else {
            this.contractInvoiceFormGroup.controls['AccountName'].setValue('');
        }
    };
    ContractInvoiceGridComponent.prototype.onContractBlur = function (event) {
        var _this = this;
        if (this.contractInvoiceFormGroup.controls['ContractNumber'].value && this.contractInvoiceFormGroup.controls['ContractNumber'].value !== '') {
            var data = [{
                    'table': 'Contract',
                    'query': { 'ContractNumber': this.contractInvoiceFormGroup.controls['ContractNumber'].value, 'BusinessCode': this.storeData['code'].business },
                    'fields': ['ContractNumber', 'ContractName']
                }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.contractInvoiceFormGroup.controls['ContractName'].setValue(e['results'][0][0].ContractName);
                }
                else {
                    _this.contractInvoiceFormGroup.controls['ContractName'].setValue('');
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                }
            }, function (error) {
                _this.contractInvoiceFormGroup.controls['ContractName'].setValue('');
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            });
        }
        else {
            this.contractInvoiceFormGroup.controls['ContractName'].setValue('');
        }
    };
    ContractInvoiceGridComponent.prototype.onPremiseBlur = function (event) {
        var _this = this;
        if (this.contractInvoiceFormGroup.controls['PremiseNumber'].value && this.contractInvoiceFormGroup.controls['PremiseNumber'].value !== '') {
            var data = [{
                    'table': 'Premise',
                    'query': { 'ContractNumber': this.contractInvoiceFormGroup.controls['ContractNumber'].value, 'PremiseNumber': this.contractInvoiceFormGroup.controls['PremiseNumber'].value, 'BusinessCode': this.storeData['code'].business },
                    'fields': ['BusinessCode', 'PremiseNumber', 'PremiseName']
                }];
            this.lookUpRecord(JSON.parse(JSON.stringify(data)), 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.contractInvoiceFormGroup.controls['PremiseName'].setValue(e['results'][0][0].PremiseName);
                }
                else {
                    _this.contractInvoiceFormGroup.controls['PremiseName'].setValue('');
                    e['errorMessage'] = ErrorConstant.Message.RecordNotFound;
                }
            }, function (error) {
                _this.contractInvoiceFormGroup.controls['PremiseName'].setValue('');
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            });
        }
        else {
            this.contractInvoiceFormGroup.controls['PremiseName'].setValue('');
        }
    };
    ContractInvoiceGridComponent.prototype.onProductBlur = function (event) {
        var _this = this;
        if (this.contractInvoiceFormGroup.controls['ProductCode'].value && this.contractInvoiceFormGroup.controls['ProductCode'].value !== '') {
            var productData = [{
                    'table': 'Product',
                    'query': { 'ProductCode': this.contractInvoiceFormGroup.controls['ProductCode'].value, 'BusinessCode': this.storeData['code'].business },
                    'fields': ['BusinessCode', 'ProductDesc']
                }];
            this.lookUpRecord(productData, 100).subscribe(function (e) {
                if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0) {
                    _this.contractInvoiceFormGroup.controls['ProductDesc'].setValue(e['results'][0][0].ProductDesc);
                }
                else {
                    _this.contractInvoiceFormGroup.controls['ProductDesc'].setValue('');
                }
            }, function (error) {
                _this.contractInvoiceFormGroup.controls['ProductDesc'].setValue('');
                error['errorMessage'] = error['errorMessage'] || ErrorConstant.Message.ErrorFetchingRecord;
            });
        }
        else {
            this.contractInvoiceFormGroup.controls['ProductDesc'].setValue('');
        }
    };
    ContractInvoiceGridComponent.prototype.lookUpRegistry = function () {
        var _this = this;
        var businessCode = this.utils.getBusinessCode();
        var registryData = [{
                'table': 'riRegistry',
                'query': { 'RegSection': 'CCM Disputed Invoices', 'RegKey': businessCode + '_' + 'Enable CCM Dispute Processing' },
                'fields': ['RegValue']
            }];
        this.lookUpRecord(registryData, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0 && e['results'][0].length > 0 && e['results'][0][0].RegValue === 'Y') {
                _this.glDisputedInvoicesInUse = true;
                _this.lShowDisputedColumn = true;
            }
            else {
                _this.glDisputedInvoicesInUse = false;
                _this.lShowDisputedColumn = false;
            }
            _this.setMaxColumn();
            _this.fetchGridData();
        });
    };
    ContractInvoiceGridComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.queryLookUp.set(this.serviceConstants.Action, '0');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.queryLookUp.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    ContractInvoiceGridComponent.prototype.getTranslatedValue = function (key, params) {
        if (params) {
            return this.translate.get(key, { value: params });
        }
        else {
            return this.translate.get(key);
        }
    };
    ContractInvoiceGridComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        this.getTranslatedValue('Invoice History', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.titleService.setTitle(res);
                }
                else {
                    _this.titleService.setTitle(_this.inputParams.pageTitle);
                }
            });
        });
        if (!this.lBudgetBilling) {
            this.getTranslatedValue('Invoice History', null).subscribe(function (res) {
                _this.zone.run(function () {
                    if (res) {
                        _this.titleService.setTitle(res);
                    }
                    else {
                        _this.titleService.setTitle(_this.inputParams.pageTitle);
                    }
                });
            });
        }
        else {
            this.getTranslatedValue('Budget Billing - Payment Grid', null).subscribe(function (res) {
                _this.zone.run(function () {
                    if (res) {
                        _this.titleService.setTitle(res);
                    }
                    else {
                        _this.titleService.setTitle(_this.inputParams.pageTitle);
                    }
                });
            });
            this.getTranslatedValue('Job Number', null).subscribe(function (res) {
                _this.zone.run(function () {
                    if (res) {
                        var elem = document.querySelector('[for="ContractNumber"]');
                        if (elem)
                            document.querySelector('[for="ContractNumber"]').textContent = res;
                    }
                });
            });
        }
        this.getTranslatedValue('Account Details', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedHeader['Account'] = res;
                }
            });
        });
        this.getTranslatedValue('Contract Details', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedHeader['Contract'] = res;
                }
            });
        });
        this.getTranslatedValue('Premise Details', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedHeader['Premise'] = res;
                }
            });
        });
        this.getTranslatedValue('Product Details', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedHeader['Product'] = res;
                }
            });
        });
        this.getTranslatedValue('TicketMaintenance Details', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedHeader['TicketMaintenance'] = res;
                }
            });
        });
        this.getTranslatedValue('ContactCentreSearch Details', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedHeader['ContactCentreSearch'] = res;
                }
            });
        });
        this.getTranslatedValue('WorkOrderMaintenance Details', null).subscribe(function (res) {
            _this.zone.run(function () {
                if (res) {
                    _this.translatedHeader['WorkOrderMaintenance'] = res;
                }
            });
        });
    };
    ContractInvoiceGridComponent.prototype.getCurrentPage = function (event) {
        this.currentPage = event.value;
        this.fetchGridData();
    };
    ContractInvoiceGridComponent.prototype.onRefresh = function () {
        this.currentPage = 1;
        this.fetchGridData();
    };
    ContractInvoiceGridComponent.prototype.onPremiseDataReceived = function (data) {
        this.contractInvoiceFormGroup.controls['PremiseNumber'].setValue(data.PremiseNumber);
        this.contractInvoiceFormGroup.controls['PremiseName'].setValue(data.PremiseName);
    };
    ContractInvoiceGridComponent.prototype.onAccountDataReceived = function (data) {
        this.contractInvoiceFormGroup.controls['AccountNumber'].setValue(data.AccountNumber);
        this.contractInvoiceFormGroup.controls['AccountName'].setValue(data.AccountContactName);
    };
    ContractInvoiceGridComponent.prototype.onProductDataReceived = function (data) {
        this.contractInvoiceFormGroup.controls['ProductCode'].setValue(data.ProductCode);
    };
    ContractInvoiceGridComponent.prototype.onBlur = function (event) {
        var elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            var _paddedValue = this.numberPadding(elementValue, 8);
            this.contractInvoiceFormGroup.controls['ContractNumber'].setValue(_paddedValue);
        }
    };
    ContractInvoiceGridComponent.prototype.isNumber = function (evt) {
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    };
    ContractInvoiceGridComponent.prototype.toUpperCase = function (event) {
        var target = event.target.getAttribute('formControlName');
        var elementValue = event.target.value;
        this.contractInvoiceFormGroup.controls[target].setValue(elementValue.toUpperCase());
    };
    ContractInvoiceGridComponent.prototype.numberPadding = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    ContractInvoiceGridComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    ContractInvoiceGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAContractInvoiceGrid.html',
                    providers: [ErrorService, MessageService]
                },] },
    ];
    ContractInvoiceGridComponent.ctorParameters = [
        { type: FormBuilder, },
        { type: Router, },
        { type: ActivatedRoute, },
        { type: HttpService, },
        { type: ServiceConstants, },
        { type: NgZone, },
        { type: Renderer, },
        { type: GlobalConstant, },
        { type: AjaxObservableConstant, },
        { type: ErrorService, },
        { type: MessageService, },
        { type: Title, },
        { type: TranslateService, },
        { type: LocaleTranslationService, },
        { type: ComponentInteractionService, },
        { type: Location, },
        { type: Store, },
        { type: Utils, },
        { type: SysCharConstants, },
        { type: RiExchange, },
    ];
    ContractInvoiceGridComponent.propDecorators = {
        'container': [{ type: ViewChild, args: ['topContainer',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'contractInvoiceGrid': [{ type: ViewChild, args: ['contractInvoiceGrid',] },],
    };
    return ContractInvoiceGridComponent;
}());
