var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PageIdentifier } from '../../base/PageIdentifier';
import { Component, ViewChild, Injector, ElementRef } from '@angular/core';
import { ComponentInteractionService } from './../../../shared/services/component-interaction.service';
import { MessageService } from './../../../shared/services/message.service';
import { ErrorService } from './../../../shared/services/error.service';
import { BaseComponent } from '../../base/BaseComponent';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { URLSearchParams } from '@angular/http';
import { ContractActionTypes } from '../../../app/actions/contract';
export var ProRateChargeSearchComponent = (function (_super) {
    __extends(ProRateChargeSearchComponent, _super);
    function ProRateChargeSearchComponent(injector, el) {
        _super.call(this, injector);
        this.el = el;
        this.queryParams = {
            action: '2',
            operation: 'Application/iCABSAProRataChargeSummary',
            module: 'charges',
            method: 'bill-to-cash/grid',
            contentType: 'application/x-www-form-urlencoded',
            full: 'Full',
            sortOrder: 'Descending'
        };
        this.xhrParams = {
            operation: 'Application/iCABSAProRataChargeSummary',
            module: 'charges',
            method: 'bill-to-cash/grid'
        };
        this.menuList = [
            { title: 'Options', value: 'Options' },
            { title: 'Create Additional Charge', value: 'AddAdditional' },
            { title: 'Create Credit', value: 'AddCredit' }
        ];
        this.pageId = '';
        this.premiseSearchComponent = PremiseSearchComponent;
        this.paginationStyle = { align: 'text-right' };
        this.optionsList = [
            { title: 'All', value: 'All' }
        ];
        this.langSelected = {
            id: '',
            text: ''
        };
        this.proSearch = new URLSearchParams();
        this.inputParamsProRata = {};
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'AccountNumber', readonly: true, disabled: false, required: false },
            { name: 'AccountName', readonly: true, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: false, required: false },
            { name: 'ProductCode', readonly: true, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: false, required: false },
            { name: 'InvoiceFrequencyCode', readonly: true, disabled: false, required: false },
            { name: 'ServiceVisitFrequency', readonly: true, disabled: false, required: false },
            { name: 'ProRataSummaryFilter', readonly: true, disabled: false, required: false, value: 'All' },
            { name: 'ProRataChargeStatus', readonly: true, disabled: false, required: false },
            { name: 'FilterPremise', readonly: true, disabled: false, required: false },
            { name: 'FilterPremiseName', readonly: true, disabled: false, required: false },
            { name: 'InvoiceAnnivDate', readonly: true, disabled: false, required: false },
            { name: 'ServiceCommenceDate', readonly: true, disabled: false, required: false },
            { name: 'ProRataChargeStatusCode', readonly: true, disabled: false, required: false },
            { name: 'ProRataChargeStatusDesc', readonly: true, disabled: false, required: false },
            { name: 'menu', readonly: true, disabled: false, required: false, value: 'Options' }
        ];
        this.pageId = PageIdentifier.ICABSAPRORATACHARGESUMMARY;
    }
    ProRateChargeSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.parent = this;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.pageSize = 10;
        this.queryParams.sortOrder = 'Descending';
        this.pageParams.trPremise = false;
        this.pageParams.tdCommenceDate1 = false;
        this.pageParams.tdCommenceDate2 = false;
        this.pageParams.trProduct = false;
        this.pageParams.tdVisitFrequency1 = false;
        this.pageParams.tdVisitFrequency2 = false;
        this.pageParams.tdFilterPremise = false;
        this.pageParams.tdFilterStatus = false;
        this.pageParams.labelInvoiceFreqeuencyCode = true;
        this.pageParams.labelInvoiceAnnivDate = true;
        this.window_onload();
    };
    ProRateChargeSearchComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    ProRateChargeSearchComponent.prototype.window_onload = function () {
        var _this = this;
        var translation = this.getTranslatedValue('Pro Rata Charge Summary').toPromise();
        translation.then(function (resp) {
            _this.pageParams.windowTitle = _this.pageParams.currentContractTypeLabel + resp;
        });
        this.utils.setTitle(this.pageParams.windowTitle);
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'FilterPremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceFrequencyCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceAnnivDate');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProRataChargeStatusCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProRataChargeStatusDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'Status');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceAnnualValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceVisitFrequency');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceCommenceDate');
        if (this.utils.Right(this.parentMode, 7) === 'History') {
            this.pageParams.ContractHistoryRowID = this.riExchange.getParentAttributeValue('ContractHistoryRowID');
        }
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');
        this.pageParams.FilterType = this.getControlValue('ProRataSummaryFilter');
        this.AddOption('Status');
        switch (this.parentMode) {
            case 'Contract':
            case 'ContractHistory':
                var stringNameContract = this.pageParams.currentContractTypeLabel + ' Details';
                this.utils.getTranslatedval(stringNameContract).then(function (res) { _this.pageParams.DocTitle = res; });
                if (this.parentMode === 'Contract') {
                    this.AddOption('Premises');
                }
                break;
            case 'Premise':
            case 'PremiseHistory':
                var stringNamePremise = this.pageParams.currentContractTypeLabel + ' Premise Details';
                this.utils.getTranslatedval(stringNamePremise).then(function (res) { _this.pageParams.DocTitle = res; });
                this.pageParams.trPremise = true;
                this.riExchange.getParentHTMLValue('PremiseNumber');
                this.riExchange.getParentHTMLValue('PremiseName');
                break;
            case 'ServiceCover':
            case 'ServiceVisit':
            case 'ServiceCoverHistory':
            case 'ServiceVisitMaint':
                var stringNameServiceVisit = this.pageParams.currentContractTypeLabel + ' Service Cover Details';
                this.utils.getTranslatedval(stringNameServiceVisit).then(function (res) { _this.pageParams.DocTitle = res; });
                this.pageParams.trPremise = true;
                this.pageParams.trProduct = true;
                if (this.parentMode === 'ServiceCover') {
                    this.pageParams.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
                    this.pageParams.tdVisitFrequency1 = true;
                    this.pageParams.tdVisitFrequency2 = true;
                    this.pageParams.tdCommenceDate1 = true;
                    this.pageParams.tdCommenceDate2 = true;
                }
                else if (this.parentMode === 'ServiceVisit' || this.parentMode === 'ServiceVisitMaint') {
                    this.pageParams.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
                    this.pageParams.tdVisitFrequency1 = false;
                    this.pageParams.tdVisitFrequency2 = false;
                    this.pageParams.tdCommenceDate1 = false;
                    this.pageParams.tdCommenceDate2 = false;
                }
                this.attributes.ServiceCoverRowID = this.pageParams.ServiceCoverRowID;
                this.riExchange.getParentHTMLValue('PremiseNumber');
                this.riExchange.getParentHTMLValue('PremiseName');
                this.riExchange.getParentHTMLValue('ProductCode');
                this.riExchange.getParentHTMLValue('ProductDesc');
                this.riExchange.getParentHTMLValue('Status');
                this.riExchange.getParentHTMLValue('ServiceAnnualValue');
                this.riExchange.getParentHTMLValue('ServiceVisitFrequency');
                this.riExchange.getParentHTMLValue('ServiceCommenceDate');
                this.riExchange.getParentHTMLValue('InvoiceFrequencyCode');
                this.riExchange.getParentHTMLValue('InvoiceAnnivDate');
                break;
        }
        this.inputParamsPremise = {
            parentMode: 'LookUp-ProRataSearch',
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName')
        };
        this.proSearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.proSearch.set(this.serviceConstants.Action, '0');
        this.proSearch.set(this.serviceConstants.CountryCode, this.countryCode());
        this.proSearch.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.proSearch)
            .subscribe(function (data) {
            _this.setControlValue('AccountNumber', data['AccountNumber']);
            _this.setControlValue('AccountName', data['AccountName']);
            if (_this.pageParams.currentContractType === 'C') {
                _this.setControlValue('InvoiceFrequencyCode', data['InvoiceFrequencyCode']);
                _this.setControlValue('InvoiceAnnivDate', data['InvoiceAnnivDate']);
            }
            else {
                _this.pageParams.labelInvoiceFreqeuencyCode = false;
                _this.pageParams.InvoiceFrequencyCode = false;
                _this.pageParams.labelInvoiceAnnivDate = false;
                _this.pageParams.InvoiceAnnivDate = false;
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
        this.UpdateHTML();
        this.Execute();
    };
    ProRateChargeSearchComponent.prototype.BuildGrid = function () {
        this.maxColumn = 11;
        if (this.parentMode !== 'ServiceCover' && this.parentMode !== 'ServiceVisitMaint') {
            if (this.parentMode !== 'Premise' && this.getControlValue('FilterPremise') === '') {
                this.maxColumn = this.maxColumn + 2;
            }
            this.maxColumn = this.maxColumn + 1;
        }
        if (this.getControlValue('ProRataChargeStatusCode') === '') {
            this.maxColumn = this.maxColumn + 1;
        }
    };
    ProRateChargeSearchComponent.prototype.Execute = function () {
        var FilterInvoiceCreditCode;
        FilterInvoiceCreditCode = '';
        this.inputParamsProRata.module = this.queryParams.module;
        this.inputParamsProRata.method = this.queryParams.method;
        this.inputParamsProRata.operation = this.queryParams.operation;
        if (this.riExchange.URLParameterContains('AdditionalCharge')) {
            FilterInvoiceCreditCode = 'I';
        }
        else if (this.riExchange.URLParameterContains('AdditionalCredit')) {
            FilterInvoiceCreditCode = 'C';
        }
        this.BuildGrid();
        this.proSearch = new URLSearchParams();
        this.proSearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.proSearch.set(this.serviceConstants.CountryCode, this.countryCode());
        this.proSearch.set(this.serviceConstants.Action, this.queryParams.action);
        if (this.parentMode !== 'Premise') {
            this.proSearch.set('ContractNumber', this.getControlValue('ContractNumber'));
            this.proSearch.set('FilterPremiseNumber', this.getControlValue('FilterPremise'));
            this.proSearch.set('FilterStatus', this.getControlValue('ProRataChargeStatusCode'));
            this.proSearch.set('ContractHistoryRowID', this.pageParams.ContractHistoryRowID);
            this.proSearch.set('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);
            this.proSearch.set('FilterInvoiceCreditCode', FilterInvoiceCreditCode);
        }
        else {
            this.proSearch.set('ContractNumber', this.getControlValue('ContractNumber'));
            this.proSearch.set('FilterPremiseNumber', this.getControlValue('FilterPremise'));
            this.proSearch.set('FilterStatus', this.getControlValue('ProRataChargeStatusCode'));
            this.proSearch.set('FromPremise', 'true');
        }
        this.proSearch.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.proSearch.set('HeaderClickedColumn', '');
        this.proSearch.set('riSortOrder', this.queryParams.sortOrder);
        this.proSearch.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.proSearch.set('PageCurrent', this.currentPage.toString());
        this.inputParamsProRata.search = this.proSearch;
        this.proRataGrid.loadGridData(this.inputParamsProRata);
    };
    ProRateChargeSearchComponent.prototype.UpdateHTML = function () {
        this.pageParams.FilterType = this.getControlValue('ProRataSummaryFilter');
        this.riMaintenance.clear();
        switch (this.pageParams.FilterType) {
            case 'Premises':
                this.pageParams.tdFilterPremise = true;
                this.pageParams.tdFilterStatus = false;
                break;
            case 'Status':
                this.pageParams.tdFilterStatus = true;
                this.pageParams.tdFilterPremise = false;
                break;
            default:
                this.pageParams.tdFilterStatus = false;
                this.pageParams.tdFilterPremise = false;
                this.setControlValue('FilterPremise', '');
                this.setControlValue('FilterPremiseName', '');
                this.setControlValue('ProRataChargeStatusCode', '');
                this.setControlValue('ProRataChargeStatusDesc', '');
                this.langSelected = {
                    id: '',
                    text: ''
                };
                break;
        }
    };
    ProRateChargeSearchComponent.prototype.ProRataSummaryFilter = function () {
        this.UpdateHTML();
    };
    ProRateChargeSearchComponent.prototype.AddOption = function (rstrField) {
        var obj = { title: rstrField, value: rstrField };
        this.optionsList.push(obj);
    };
    ProRateChargeSearchComponent.prototype.onFilterInvoiceCreditCode = function (option) {
        var returnGrpObj = {
            parentMode: 'ServiceCoverAdd',
            currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
            mode: 'AdditionalCharge',
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            PremiseName: this.getControlValue('PremiseName'),
            AccountNumber: this.getControlValue('AccountNumber'),
            AccountName: this.getControlValue('AccountName'),
            ProductCode: this.getControlValue('ProductCode'),
            ProductDesc: this.getControlValue('ProductDesc'),
            'BusinessCode': this.businessCode(),
            'CountryCode': this.countryCode()
        };
        this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: returnGrpObj });
        switch (option) {
            case 'AddAdditional':
                if ((this.parentMode === 'ServiceCover' && !this.riExchange.URLParameterContains('AdditionalCredit'))
                    || this.parentMode === 'ServiceVisit' || this.parentMode === 'ServiceVisitMaint') {
                    var returnGrpObj_1 = {
                        ContractNumber: this.getControlValue('ContractNumber'),
                        ContractName: this.getControlValue('ContractName'),
                        PremiseNumber: this.getControlValue('PremiseNumber'),
                        PremiseName: this.getControlValue('PremiseName'),
                        AccountNumber: this.getControlValue('AccountNumber'),
                        AccountName: this.getControlValue('AccountName'),
                        ProductCode: this.getControlValue('ProductCode'),
                        ProductDesc: this.getControlValue('ProductDesc'),
                        InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode')
                    };
                    this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: returnGrpObj_1 });
                    this.router.navigate(['/application/service/invoice/ProRataChargeMaintenance'], {
                        queryParams: {
                            parentMode: 'ServiceCoverAdd',
                            currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                            CurrentContractType: this.pageParams.currentContractType,
                            mode: 'AdditionalCharge',
                            ContractNumber: this.getControlValue('ContractNumber'),
                            ContractName: this.getControlValue('ContractName'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName'),
                            ProductCode: this.getControlValue('ProductCode'),
                            ProductDesc: this.getControlValue('ProductDesc'),
                            InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode'),
                            InvoiceAnnivDate: this.getControlValue('InvoiceAnnivDate'),
                            ServiceCoverRowID: this.pageParams.ServiceCoverRowID
                        }
                    });
                }
                else {
                    this.ErrorFunctionNotAvailable();
                }
                break;
            case 'AddCredit':
                if ((this.parentMode === 'ServiceCover' && !this.riExchange.URLParameterContains('AdditionalCharge'))
                    || this.parentMode === 'ServiceVisit' || this.parentMode === 'ServiceVisitMaint') {
                    this.router.navigate(['/application/service/invoice/ProRataChargeMaintenance'], {
                        queryParams: {
                            parentMode: 'ServiceCoverAdd',
                            currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                            CurrentContractType: this.pageParams.currentContractType,
                            mode: 'AdditionalCredit',
                            ContractNumber: this.getControlValue('ContractNumber'),
                            ContractName: this.getControlValue('ContractName'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName'),
                            ProductCode: this.getControlValue('ProductCode'),
                            ProductDesc: this.getControlValue('ProductDesc'),
                            InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode'),
                            InvoiceAnnivDate: this.getControlValue('InvoiceAnnivDate'),
                            ServiceCoverRowID: this.pageParams.ServiceCoverRowID
                        }
                    });
                }
                else {
                    this.ErrorFunctionNotAvailable();
                }
                break;
        }
    };
    ProRateChargeSearchComponent.prototype.ErrorFunctionNotAvailable = function () {
        var _this = this;
        this.zone.run(function () {
            _this.messageModal.show({ msg: 'Function is available for selection form service cover Maintainatance ', title: 'Message' }, false);
            _this.el.nativeElement.querySelector('#menu option').removeAttribute('selected');
            _this.el.nativeElement.querySelector('#menu option[value="Options"').setAttribute('selected', 'selected');
        });
    };
    ProRateChargeSearchComponent.prototype.onLangDataReceived = function (event) {
        this.setControlValue('ProRataChargeStatusCode', event['ProRataChargeStatusLang.ProRataChargeStatusCode']);
        this.setControlValue('ProRataChargeStatusDesc', event['ProRataChargeStatusLang.ProRataChargeStatusDesc']);
        this.Execute();
    };
    ProRateChargeSearchComponent.prototype.onPremiseDataReceived = function (data) {
        this.setControlValue('FilterPremise', data[0][0].PremiseNumber);
        this.setControlValue('FilterPremiseName', data[0][0].PremiseName);
        this.Execute();
    };
    ProRateChargeSearchComponent.prototype.onPremiseEllipsisDataReceived = function (data) {
        this.setControlValue('FilterPremise', data.PremiseNumber);
        this.setControlValue('FilterPremiseName', data.PremiseName);
        this.setControlValue('ProRataChargeStatusCode', '');
        this.setControlValue('ProRataChargeStatusDesc', '');
        this.Execute();
    };
    ProRateChargeSearchComponent.prototype.getGridInfo = function (info) {
        this.proRataPagination.totalItems = info.totalRows;
    };
    ProRateChargeSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.Execute();
    };
    ProRateChargeSearchComponent.prototype.onRefresh = function () {
        this.currentPage = 1;
        this.Execute();
    };
    ProRateChargeSearchComponent.prototype.onPremiseChange = function () {
        var _this = this;
        if (this.getControlValue('ContractNumber').trim() && this.getControlValue('FilterPremise').trim()) {
            var lookupIP = [{
                    'table': 'Premise',
                    'query': {
                        'BusinessCode': this.businessCode(),
                        'ContractNumber': this.getControlValue('ContractNumber'),
                        'PremiseNumber': this.getControlValue('FilterPremise')
                    },
                    'fields': ['PremiseName']
                }];
            this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
                var PremiseName = data[0][0];
                if (PremiseName) {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'FilterPremiseName', PremiseName.PremiseName);
                    _this.setControlValue('ProRataChargeStatusCode', '');
                    _this.setControlValue('ProRataChargeStatusDesc', '');
                    _this.Execute();
                }
            });
        }
    };
    ProRateChargeSearchComponent.prototype.selectedDataOnDoubleClick = function (event) {
        var data = this.proRataGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
        if (data['rowID'] && data['rowID'] !== '') {
            if ((event.cellIndex === 0 || event.cellIndex === (event.trRowData.length - 1)) && event.rowData.Status !== 'Awaiting Approval') {
                if (event && event.cellData && event.cellData.rowID !== null) {
                    if (this.inputParamsProRata.parentMode === 'ServiceVisitMaint') {
                        this.inputParamsProRata.mode = 'ServiceCover';
                    }
                    else {
                        this.inputParamsProRata.mode = this.inputParamsProRata.parentMode;
                    }
                    this.store.dispatch({
                        type: ContractActionTypes.SAVE_MODE, payload: {
                            mode: this.inputParamsProRata.mode
                        }
                    });
                    if (event && event.cellData && event.cellData.additionalData !== null) {
                        var returnGrpObj = {
                            'PremiseNumber': this.getControlValue('PremiseNumber'),
                            'PremiseName': this.getControlValue('PremiseName'),
                            'End Date': event.rowData['End Date'],
                            'Extract Date': event.rowData['Extract Date'],
                            'Invoice Group': event.rowData['Invoice Group'],
                            'Invoice/ Credit': event.rowData['Invoice/ Credit'],
                            'Print Credit': event.rowData['Print Credit'],
                            'Product Code': event.rowData['Product Code'],
                            'Qty': event.rowData['Qty'],
                            'Reason': event.rowData['Reason'],
                            'Service Branch': event.rowData['Service Branch'],
                            'Start Date': event.rowData['Start Date'],
                            'Status': event.rowData['Reason'],
                            'VAT Code': event.rowData['VAT Code'],
                            'Value': event.rowData['Value'],
                            'BusinessCode': this.businessCode(),
                            'CountryCode': this.countryCode(),
                            Level: data['additionalData'],
                            Row: data['rowID'],
                            ProRataChargeRowID: data['rowID']
                        };
                        this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: returnGrpObj });
                    }
                    this.router.navigate(['/application/service/invoice/ProRataChargeMaintenance'], {
                        queryParams: {
                            parentMode: this.inputParamsProRata.mode,
                            currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                            CurrentContractType: this.pageParams.currentContractType,
                            ContractNumber: this.getControlValue('ContractNumber'),
                            ContractName: this.getControlValue('ContractName'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName'),
                            ProductCode: this.getControlValue('ProductCode'),
                            ProductDesc: this.getControlValue('ProductDesc'),
                            ProRataChargeRowID: data['rowID'],
                            ServiceCoverRowID: this.pageParams.ServiceCoverRowID
                        }
                    });
                }
            }
        }
    };
    ProRateChargeSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAProRataChargeSummary.html',
                    providers: [ErrorService, MessageService, ComponentInteractionService]
                },] },
    ];
    ProRateChargeSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: ElementRef, },
    ];
    ProRateChargeSearchComponent.propDecorators = {
        'proRataGrid': [{ type: ViewChild, args: ['proRataGrid',] },],
        'proRataPagination': [{ type: ViewChild, args: ['proRataPagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
    };
    return ProRateChargeSearchComponent;
}(BaseComponent));
