var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ActivatedRoute } from '@angular/router';
import { MessageConstant } from '../../../shared/constants/message.constant';
export var ServiceCoverDisplayMassValuesComponent = (function (_super) {
    __extends(ServiceCoverDisplayMassValuesComponent, _super);
    function ServiceCoverDisplayMassValuesComponent(injector, route, elem) {
        _super.call(this, injector);
        this.route = route;
        this.elem = elem;
        this.pageSize = 12;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.totalItems = this.itemsPerPage;
        this.maxColumn = 13;
        this.queryParams = {
            operation: 'Application/iCABSAServiceCoverDisplayMassValues',
            module: 'contract-admin',
            method: 'contract-management/maintenance',
            ActionSearch: '0',
            Actionupdate: '6',
            ActionEdit: '2',
            ActionDelete: '3'
        };
        this.effectiveDate = new Date();
        this.nextInvoiceStartDate = new Date();
        this.directLinkURLMode = false;
        this.isUpdateButtonVisible = false;
        this.isDropDownsVisible = false;
        this.serviceCoverDisplayObject = {};
        this.reasonCodes = [{ LostBusinessCode: '', LostBusinessDesc: '' }];
        this.detailCodes = [{ LostBusinessDetailCode: '', LostBusinessDetailDesc: '' }];
        this.isReasonCodeFetched = false;
        this.isDetailCodeFetched = false;
        this.showErrorHeader = true;
        this.showMessageHeader = true;
        this.isNextInvoiceDateDisabled = true;
        this.isEffectiveDateDisabled = false;
        this.lastselectedInvalidField = '';
        this.isUpdate = false;
        this.isUpdateButtonDisabled = false;
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: true },
            { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'NextInvoiceStartDate', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: true, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'EffectiveDate', readonly: true, disabled: false, required: false },
            { name: 'MaterialsFilter', readonly: false, disabled: false, required: false },
            { name: 'LabourFilter', readonly: false, disabled: false, required: false },
            { name: 'ReplacementFilter', readonly: false, disabled: false, required: false },
            { name: 'TotalFilter', readonly: false, disabled: false, required: false },
            { name: 'NewMaterialsValue', readonly: false, disabled: false, required: false },
            { name: 'NewLabourValue', readonly: false, disabled: false, required: false },
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'NewReplacementValue', readonly: false, disabled: false, required: false },
            { name: 'NewTotalValue', readonly: false, disabled: false, required: false },
            { name: 'LabourPercentInc', readonly: false, disabled: false, required: false },
            { name: 'ReplacementPercentInc', readonly: false, disabled: false, required: false },
            { name: 'IncreasePercent', readonly: false, disabled: false, required: false },
            { name: 'MaterialsPercentInc', readonly: false, disabled: false, required: false },
            { name: 'MaterialsPercentDec', readonly: false, disabled: false, required: false },
            { name: 'LabourPercentDec', readonly: false, disabled: false, required: false },
            { name: 'ReplacementPercentDec', readonly: false, disabled: false, required: false },
            { name: 'DecreasePercent', readonly: false, disabled: false, required: false },
            { name: 'NewMaterialsTotalValue', readonly: false, disabled: false, required: false },
            { name: 'NewLabourTotalValue', readonly: false, disabled: false, required: false },
            { name: 'NewReplacementTotalValue', readonly: false, disabled: false, required: false },
            { name: 'NewServiceCoverTotalValue', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverDisplays', readonly: false, disabled: true, required: false },
            { name: 'DisplaysAffected', readonly: false, disabled: true, required: false },
            { name: 'ReasonCode', readonly: false, disabled: false, required: false },
            { name: 'DetailCode', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERDISPLAYMASSVALUES;
    }
    ServiceCoverDisplayMassValuesComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.routeAwayGlobals.setEllipseOpenFlag(false);
        this.sub = this.route.queryParams.subscribe(function (params) {
            _this.routeParams = params;
        });
        this.window_onload();
    };
    ServiceCoverDisplayMassValuesComponent.prototype.window_onload = function () {
        this.uiElements = this.riExchange.riInputElement;
        if (this.directLinkURLMode) {
            this.serviceCoverDisplayObject.ContractNumber = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ContractNumber');
            this.serviceCoverDisplayObject.PremiseNumber = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'PremiseNumber');
            this.serviceCoverDisplayObject.ProductCode = this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'ProductCode');
            this.serviceCoverDisplayObject.EffectiveDate = decodeURI(this.riExchange.GetParentHTMLInputElementAttribute(this.routeParams, 'EffectiveDate'));
            this.effectiveDate = this.utils.convertDate(this.serviceCoverDisplayObject.EffectiveDate);
            this.uiElements.SetValue(this.uiForm, 'ContractNumber', this.serviceCoverDisplayObject.ContractNumber);
            this.uiElements.SetValue(this.uiForm, 'PremiseNumber', this.serviceCoverDisplayObject.PremiseNumber);
            this.uiElements.SetValue(this.uiForm, 'ProductCode', this.serviceCoverDisplayObject.ProductCode);
            this.uiElements.SetValue(this.uiForm, 'EffectiveDate', this.serviceCoverDisplayObject.EffectiveDate);
            this.getLookupData(this.serviceCoverDisplayObject);
        }
        else {
            this.serviceCoverDisplayObject.ContractNumber = this.riExchange.getParentHTMLValue('ContractNumber');
            this.serviceCoverDisplayObject.ContractName = this.riExchange.getParentHTMLValue('ContractName');
            this.serviceCoverDisplayObject.PremiseNumber = this.riExchange.getParentHTMLValue('PremiseNumber');
            this.serviceCoverDisplayObject.PremiseName = this.riExchange.getParentHTMLValue('PremiseName');
            this.serviceCoverDisplayObject.ProductCode = this.riExchange.getParentHTMLValue('ProductCode');
            this.serviceCoverDisplayObject.ProductDesc = this.riExchange.getParentHTMLValue('ProductDesc');
            var d = new Date();
            var day = (d.getDate() < 10) ? ('0' + d.getDate()) : d.getDate();
            var month0 = d.getMonth() + 1;
            var month = (month0 < 10) ? ('0' + month0) : month0;
            var year = d.getFullYear();
            var effectiveDate = day + '/' + month + '/' + year;
            this.serviceCoverDisplayObject.EffectiveDate = decodeURI(effectiveDate);
            this.effectiveDate = this.utils.convertDate(this.serviceCoverDisplayObject.EffectiveDate);
            this.uiElements.SetValue(this.uiForm, 'ContractNumber', this.serviceCoverDisplayObject.ContractNumber);
            this.uiElements.SetValue(this.uiForm, 'ContractName', this.serviceCoverDisplayObject.ContractName);
            this.uiElements.SetValue(this.uiForm, 'PremiseNumber', this.serviceCoverDisplayObject.PremiseNumber);
            this.uiElements.SetValue(this.uiForm, 'PremiseName', this.serviceCoverDisplayObject.PremiseName);
            this.uiElements.SetValue(this.uiForm, 'ProductCode', this.serviceCoverDisplayObject.ProductCode);
            this.uiElements.SetValue(this.uiForm, 'ProductDesc', this.serviceCoverDisplayObject.ProductDesc);
            this.uiElements.SetValue(this.uiForm, 'EffectiveDate', this.serviceCoverDisplayObject.EffectiveDate);
            this.getLookupData(this.serviceCoverDisplayObject);
        }
        this.formElement = this.elem.nativeElement.querySelector('form');
        this.routeAwayGlobals.setDirtyFlag(this.formElement.classList.contains('ng-dirty'));
    };
    ServiceCoverDisplayMassValuesComponent.prototype.createSearchParams = function () {
        var search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        search.set('ContractNumber', this.uiElements.GetValue(this.uiForm, 'ContractNumber'));
        search.set('PremiseNumber', this.uiElements.GetValue(this.uiForm, 'PremiseNumber'));
        search.set('ProductCode', this.uiElements.GetValue(this.uiForm, 'ProductCode'));
        search.set('ServiceCoverNumber', this.serviceCoverNumber);
        search.set('EffectiveDate', this.uiElements.GetValue(this.uiForm, 'EffectiveDate'));
        search.set('MaterialsFilter', this.uiElements.GetValue(this.uiForm, 'MaterialsFilter'));
        search.set('ReplacementFilter', this.uiElements.GetValue(this.uiForm, 'ReplacementFilter'));
        search.set('LabourFilter', this.uiElements.GetValue(this.uiForm, 'LabourFilter'));
        search.set('TotalFilter', this.uiElements.GetValue(this.uiForm, 'TotalFilter'));
        search.set('IncreasePercent', this.uiElements.GetValue(this.uiForm, 'IncreasePercent'));
        search.set('MaterialsPercentInc', this.uiElements.GetValue(this.uiForm, 'MaterialsPercentInc'));
        search.set('LabourPercentInc', this.uiElements.GetValue(this.uiForm, 'LabourPercentInc'));
        search.set('ReplacementPercentInc', this.uiElements.GetValue(this.uiForm, 'ReplacementPercentInc'));
        search.set('DecreasePercent', this.uiElements.GetValue(this.uiForm, 'DecreasePercent'));
        search.set('MaterialsPercentDec', this.uiElements.GetValue(this.uiForm, 'MaterialsPercentDec'));
        search.set('LabourPercentDec', this.uiElements.GetValue(this.uiForm, 'LabourPercentDec'));
        search.set('ReplacementPercentDec', this.uiElements.GetValue(this.uiForm, 'ReplacementPercentDec'));
        search.set('NewMaterialsValue', this.uiElements.GetValue(this.uiForm, 'NewMaterialsValue'));
        search.set('NewReplacementValue', this.uiElements.GetValue(this.uiForm, 'NewReplacementValue'));
        search.set('NewLabourValue', this.uiElements.GetValue(this.uiForm, 'NewLabourValue'));
        search.set('NewTotalValue', this.uiElements.GetValue(this.uiForm, 'NewTotalValue'));
        search.set('NewMaterialsTotalValue', this.uiElements.GetValue(this.uiForm, 'NewMaterialsTotalValue'));
        search.set('NewLabourTotalValue', this.uiElements.GetValue(this.uiForm, 'NewLabourTotalValue'));
        search.set('NewReplacementTotalValue', this.uiElements.GetValue(this.uiForm, 'NewReplacementTotalValue'));
        search.set('NewServiceCoverTotalValue', this.uiElements.GetValue(this.uiForm, 'NewServiceCoverTotalValue'));
        search.set('UpdateServiceCoverValues', '');
        search.set('LostBusinessCode', this.lostBusinessCode);
        search.set('LostBusinessDetailCode', this.lostBusinessDetailCode);
        search.set('countryCode', this.countryCode());
        search.set('businessCode', this.businessCode());
        return search;
    };
    ServiceCoverDisplayMassValuesComponent.prototype.buildGrid = function (isUpdate) {
        this.isUpdate = isUpdate;
        this.riGridComponent.clearGridData();
        this.maxColumn = 15;
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '66066');
        this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, '');
        this.search.set(this.serviceConstants.GridSortOrder, 'Descending');
        this.queryParams.search = this.search;
        this.riGridComponent.loadGridData(this.queryParams);
    };
    ServiceCoverDisplayMassValuesComponent.prototype.getGridInfo = function (info) {
        try {
            if (info.curPage === 1) {
                var totalRecords = parseInt(info.gridData.body.cells.length, 10) / this.maxColumn;
                this.uiElements.SetValue(this.uiForm, 'ServiceCoverDisplays', totalRecords - 1);
                this.uiElements.SetValue(this.uiForm, 'DisplaysAffected', totalRecords - 1);
            }
            if (info && info.totalPages) {
                this.totalItems = parseInt(info.totalPages, 10) * this.itemsPerPage;
            }
            else {
                this.totalItems = 0;
            }
            if (this.isUpdate === true && this.totalItems > 0 && info.hasOwnProperty('gridData') === true) {
                this.messageModal.show({ msg: MessageConstant.PageSpecificMessage.UpdateComplete, title: 'Message' }, false);
            }
            if (this.checkIfAnyFilters() && this.totalItems > 0) {
                this.isUpdateButtonVisible = true;
                this.isDropDownsVisible = true;
            }
            else {
                this.isUpdateButtonVisible = false;
                if (this.checkIfAnyFilters()) {
                    this.isDropDownsVisible = true;
                }
                else {
                    this.isDropDownsVisible = false;
                    this.isReasonCodeFetched = false;
                    this.isDetailCodeFetched = false;
                    this.reasonCodes = [{ LostBusinessCode: '', LostBusinessDesc: '' }];
                    this.detailCodes = [{ LostBusinessDetailCode: '', LostBusinessDetailDesc: '' }];
                    this.lostBusinessCode = '';
                    this.lostBusinessDetailCode = '';
                }
            }
        }
        catch (e) {
        }
    };
    ServiceCoverDisplayMassValuesComponent.prototype.onUpdateClicked = function () {
        var isValid = true;
        if (this.lostBusinessCode === '') {
            this.elem.nativeElement.querySelector('[formcontrolname = ReasonCode]').classList.add('ng-invalid');
            isValid = false;
        }
        else {
            this.elem.nativeElement.querySelector('[formcontrolname = ReasonCode]').classList.remove('ng-invalid');
        }
        if (this.lostBusinessDetailCode === '') {
            this.elem.nativeElement.querySelector('[formcontrolname = DetailCode]').classList.add('ng-invalid');
            isValid = false;
        }
        else {
            this.elem.nativeElement.querySelector('[formcontrolname = DetailCode]').classList.remove('ng-invalid');
        }
        if (isValid) {
            this.search = this.createSearchParams();
            this.search.set('UpdateServiceCoverValues', 'UpdateServiceCoverValues');
            this.buildGrid(true);
            this.getLookupData(this.serviceCoverDisplayObject);
            this.isUpdateButtonDisabled = true;
        }
        else {
            window.scrollBy(0, this.elem.nativeElement.querySelector('form').scrollHeight);
        }
    };
    ServiceCoverDisplayMassValuesComponent.prototype.refresh = function () {
        if (this.lastselectedInvalidField === '') {
            this.search = this.createSearchParams();
            this.buildGrid(false);
            this.getLookupData(this.serviceCoverDisplayObject);
            this.isUpdateButtonDisabled = false;
        }
    };
    ServiceCoverDisplayMassValuesComponent.prototype.selectCurrentFilterOnly = function (event) {
        var target = event.target.getAttribute('formControlName');
        var elementValue = event.target.value;
        var isValid = true;
        var reg = /^[0-9]\d*(\.\d+)?$/;
        isValid = reg.test(elementValue);
        if (elementValue !== '') {
            if (this.currentFilterField !== elementValue) {
                this.isUpdateButtonVisible = false;
            }
            this.resetAllFilters();
            this.uiElements.SetValue(this.uiForm, target, elementValue);
            if (this.lastselectedInvalidField !== '') {
                this.elem.nativeElement.querySelector(this.lastselectedInvalidField).classList.add('ng-valid');
                this.elem.nativeElement.querySelector(this.lastselectedInvalidField).classList.remove('ng-invalid');
            }
            var elem = this.elem.nativeElement.querySelector('#' + target);
            if (parseInt(elementValue, 0) < 0 || isValid === false) {
                elem.classList.add('ng-invalid');
                elem.classList.remove('ng-valid');
                this.lastselectedInvalidField = '#' + target;
            }
            else {
                var formattedValueTodecimal = (Math.round(elementValue * 100) / 100).toFixed(2);
                elem.value = formattedValueTodecimal;
                elem.classList.add('ng-valid');
                elem.classList.remove('ng-invalid');
                this.lastselectedInvalidField = '';
            }
        }
    };
    ServiceCoverDisplayMassValuesComponent.prototype.onCurrentFilterFocus = function (event) {
        this.currentFilterField = (Math.round(event.target.value * 100) / 100).toFixed(2);
    };
    ServiceCoverDisplayMassValuesComponent.prototype.resetAllFilters = function () {
        this.uiElements.SetValue(this.uiForm, 'IncreasePercent', '');
        this.uiElements.SetValue(this.uiForm, 'MaterialsPercentInc', '');
        this.uiElements.SetValue(this.uiForm, 'LabourPercentInc', '');
        this.uiElements.SetValue(this.uiForm, 'ReplacementPercentInc', '');
        this.uiElements.SetValue(this.uiForm, 'DecreasePercent', '');
        this.uiElements.SetValue(this.uiForm, 'MaterialsPercentDec', '');
        this.uiElements.SetValue(this.uiForm, 'LabourPercentDec', '');
        this.uiElements.SetValue(this.uiForm, 'ReplacementPercentDec', '');
        this.uiElements.SetValue(this.uiForm, 'NewMaterialsValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewReplacementValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewLabourValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewTotalValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewMaterialsTotalValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewLabourTotalValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewReplacementTotalValue', '');
        this.uiElements.SetValue(this.uiForm, 'NewServiceCoverTotalValue', '');
    };
    ServiceCoverDisplayMassValuesComponent.prototype.checkIfAnyFilters = function () {
        var isFilter = false;
        if (this.uiElements.GetValue(this.uiForm, 'IncreasePercent') === '' &&
            this.uiElements.GetValue(this.uiForm, 'MaterialsPercentInc') === '' &&
            this.uiElements.GetValue(this.uiForm, 'LabourPercentInc') === '' &&
            this.uiElements.GetValue(this.uiForm, 'ReplacementPercentInc') === '' &&
            this.uiElements.GetValue(this.uiForm, 'DecreasePercent') === '' &&
            this.uiElements.GetValue(this.uiForm, 'MaterialsPercentDec') === '' &&
            this.uiElements.GetValue(this.uiForm, 'LabourPercentDec') === '' &&
            this.uiElements.GetValue(this.uiForm, 'ReplacementPercentDec') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewMaterialsValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewReplacementValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewLabourValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewTotalValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewMaterialsTotalValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewLabourTotalValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewReplacementTotalValue') === '' &&
            this.uiElements.GetValue(this.uiForm, 'NewServiceCoverTotalValue') === '') {
            isFilter = false;
        }
        else {
            isFilter = true;
        }
        return isFilter;
    };
    ServiceCoverDisplayMassValuesComponent.prototype.nextInvoiceDateSelectedValue = function (value) {
        if (value && value.value) {
            this.uiElements.SetValue(this.uiForm, 'NextInvoiceStartDate', value.value);
        }
    };
    ServiceCoverDisplayMassValuesComponent.prototype.effectiveDateSelectedValue = function (value) {
        if (value && value.value) {
            this.uiElements.SetValue(this.uiForm, 'EffectiveDate', value.value);
            this.isUpdateButtonVisible = false;
        }
    };
    ServiceCoverDisplayMassValuesComponent.prototype.getLookupData = function (serviceCoverDisplayObject) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP_details = [
            {
                'table': 'ServiceCover',
                'query': {
                    'ContractNumber': serviceCoverDisplayObject.ContractNumber, 'BusinessCode': this.businessCode(),
                    'PremiseNumber': serviceCoverDisplayObject.PremiseNumber, 'ProductCode': serviceCoverDisplayObject.ProductCode
                },
                'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCoverNumber', 'ServiceVisitFrequency', 'NextInvoiceStartDate']
            },
            {
                'table': 'LostBusinessLang',
                'query': { 'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode() },
                'fields': ['LostBusinessCode', 'LostBusinessDesc']
            }
        ];
        this.subLookupServiceCover = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (e) {
            if (e && e.length > 0 && e[0].length > 0) {
                _this.uiElements.SetValue(_this.uiForm, 'ServiceVisitFrequency', e[0][0].ServiceVisitFrequency);
                _this.uiElements.SetValue(_this.uiForm, 'NextInvoiceStartDate', decodeURI(e[0][0].NextInvoiceStartDate));
                _this.nextInvoiceStartDate = _this.utils.convertDate(decodeURI(e[0][0].NextInvoiceStartDate));
                _this.serviceCoverNumber = e[0][0].ServiceCoverNumber;
            }
            if (e && e.length > 0 && e[1].length > 0 && _this.isReasonCodeFetched === false) {
                var _loop_1 = function(i) {
                    if (e[1][i]['LostBusinessCode'] !== '0' && e[1][i]['LostBusinessDesc'] !== 'Created for Conversion') {
                        _this.getTranslatedValue(e[1][i]['LostBusinessDesc'], null).subscribe(function (res) {
                            if (res) {
                                e[1][i]['LostBusinessDesc'] = res;
                            }
                        });
                        e[1][i]['LostBusinessDesc'] = e[1][i]['LostBusinessCode'] + ' - ' + e[1][i]['LostBusinessDesc'];
                        _this.reasonCodes.push(e[1][i]);
                    }
                };
                for (var i = 0; i < e[1].length; i++) {
                    _loop_1(i);
                }
                _this.isReasonCodeFetched = true;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayMassValuesComponent.prototype.getLookupDataDetailCode = function (lostBusinessCode) {
        var _this = this;
        this.ajaxSource.next(this.ajaxconstant.START);
        var lookupIP_details = [
            {
                'table': 'LostBusinessDetail',
                'query': {
                    'BusinessCode': this.businessCode(), 'LanguageCode': this.riExchange.LanguageCode(),
                    'LostBusinessCode': lostBusinessCode, 'InvalidForNew': false
                },
                'fields': ['LostBusinessDetailCode', 'LostBusinessDetailDesc', 'LostBusinessCode', 'BusinessCode']
            }
        ];
        this.subLookupServiceCover = this.LookUp.lookUpRecord(lookupIP_details).subscribe(function (e) {
            _this.detailCodes = [{ LostBusinessDetailCode: '', LostBusinessDetailDesc: '' }];
            if (e && e.length > 0 && e[0].length > 0) {
                var _loop_2 = function(i) {
                    _this.getTranslatedValue(e[0][i]['LostBusinessDetailDesc'], null).subscribe(function (res) {
                        if (res) {
                            e[0][i]['LostBusinessDetailDesc'] = res;
                        }
                    });
                    e[0][i]['LostBusinessDetailDesc'] = e[0][i]['LostBusinessDetailCode'] + ' - ' + e[0][i]['LostBusinessDetailDesc'];
                    _this.detailCodes.push(e[0][i]);
                };
                for (var i = 0; i < e[0].length; i++) {
                    _loop_2(i);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.errorService.emitError(error);
        });
    };
    ServiceCoverDisplayMassValuesComponent.prototype.optionsChange = function (event) {
        var target = event.target.getAttribute('formControlName');
        this.lostBusinessCode = event.target.value;
        if (this.lostBusinessCode !== '') {
            this.elem.nativeElement.querySelector('[formcontrolname = ReasonCode]').classList.remove('ng-invalid');
            this.getLookupDataDetailCode(this.lostBusinessCode);
        }
        else {
            this.elem.nativeElement.querySelector('[formcontrolname = ReasonCode]').classList.add('ng-invalid');
        }
    };
    ServiceCoverDisplayMassValuesComponent.prototype.detailCodeChange = function (event) {
        var target = event.target.getAttribute('formControlName');
        this.lostBusinessDetailCode = event.target.value;
        if (this.lostBusinessDetailCode !== '') {
            this.elem.nativeElement.querySelector('[formcontrolname = DetailCode]').classList.remove('ng-invalid');
        }
        else {
            this.elem.nativeElement.querySelector('[formcontrolname = DetailCode]').classList.add('ng-invalid');
        }
    };
    ServiceCoverDisplayMassValuesComponent.prototype.getCurrentPage = function (currentPageNum) {
        this.currentPage = currentPageNum.value;
        this.search = this.createSearchParams();
        this.buildGrid(false);
    };
    ServiceCoverDisplayMassValuesComponent.prototype.isInvalidValue = function () {
        var invalid = true;
        return invalid;
    };
    ServiceCoverDisplayMassValuesComponent.prototype.canDeactivate = function () {
        this.routeAwayGlobals.setDirtyFlag(this.formElement.classList.contains('ng-dirty'));
        return this.routeAwayComponent.canDeactivate();
    };
    ServiceCoverDisplayMassValuesComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverDisplayMassValues.html',
                    styles: ["\n   .ng-invalid {\n        border: 1px solid #ff0000;\n    }\n    "]
                },] },
    ];
    ServiceCoverDisplayMassValuesComponent.ctorParameters = [
        { type: Injector, },
        { type: ActivatedRoute, },
        { type: ElementRef, },
    ];
    ServiceCoverDisplayMassValuesComponent.propDecorators = {
        'riGridComponent': [{ type: ViewChild, args: ['riGridComponent',] },],
        'riGridPagination': [{ type: ViewChild, args: ['riGridPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'routeAwayComponent': [{ type: ViewChild, args: ['routeAwayComponent',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
    };
    return ServiceCoverDisplayMassValuesComponent;
}(BaseComponent));
