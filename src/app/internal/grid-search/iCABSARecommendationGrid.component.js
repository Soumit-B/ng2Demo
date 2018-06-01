var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { PageIdentifier } from './../../base/PageIdentifier';
import { GenericActionTypes } from './../../actions/generic';
import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Injector } from '@angular/core';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { GlobalConstant } from '../../../shared/constants/global.constant';
export var RecommendationGridComponent = (function (_super) {
    __extends(RecommendationGridComponent, _super);
    function RecommendationGridComponent(injector, renderer, elRef) {
        _super.call(this, injector);
        this.renderer = renderer;
        this.elRef = elRef;
        this.pageTitle = 'Service Recommendations';
        this.backLinkText = '';
        this.showBackLabel = false;
        this.isRequesting = false;
        this.dt = new Date();
        this.ServiceDateTo = new Date();
        this.ServiceDateFrom = new Date();
        this.dateObjectsEnabled = {
            ServiceDateFrom: false,
            ServiceDateTo: false
        };
        this.filterList = [
            { name: 'All', value: 'All' },
            { name: 'Actioned', value: 'Actioned' },
            { name: 'Unactioned', value: 'Unactioned' }
        ];
        this.gridSortHeaders = [];
        this.labelContractNumber = 'Contract';
        this.trPremise = true;
        this.trProduct = true;
        this.trFilter = true;
        this.viewEmployeeCode = false;
        this.viewPDAVisitRef = false;
        this.showCloseButton = true;
        this.showHeader = true;
        this.inputParamsAccountPremise = {
            'parentMode': 'LookUp',
            'pageTitle': 'Premise Search',
            'currentContractType': 'C',
            'ContractNumber': ''
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.productComponent = '';
        this.premiseComponent = '';
        this.pageId = '';
        this.headerClicked = '';
        this.sortType = '';
        this.rowId = '';
        this.pattern = /^[a-zA-Z0-9]+(([\'\,\.\-_ \/)(:][a-zA-Z0-9_ ])?[a-zA-Z0-9_ .]*)*$/;
        this.search = new URLSearchParams();
        this.queryParams = {
            operation: 'Application/iCABSARecommendationGrid',
            module: 'pda',
            method: 'service-delivery/maintenance',
            contentType: 'application/x-www-form-urlencoded'
        };
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: false, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: false, disabled: false, required: false },
            { name: 'ProductCode', readonly: false, disabled: false, required: false },
            { name: 'ProductDesc', readonly: false, disabled: false, required: false },
            { name: 'EmployeeCode', readonly: false, disabled: false, required: false },
            { name: 'PDAVisitRef', readonly: false, disabled: false, required: false },
            { name: 'ShowType', readonly: false, disabled: false, required: false },
            { name: 'ServiceDateFrom', readonly: false, disabled: false, required: false },
            { name: 'ServiceDateTo', readonly: false, disabled: false, required: false, value: this.filterList[0].value }
        ];
        this.pageId = PageIdentifier.ICABSARECOMMENDATIONGRID;
        this.setErrorCallback(this);
        this.setURLQueryParameters(this);
    }
    ;
    RecommendationGridComponent.prototype.showErrorModal = function (data) {
        this.errorModal.show(data, true);
    };
    RecommendationGridComponent.prototype.getURLQueryParameters = function (param) {
        if (param['parentMode']) {
            this.pageParams.ParentMode = param['parentMode'];
            this.pageParams.ContractNumber = param['ContractNumber'];
            this.pageParams.ContractName = param['ContractName'];
            this.pageParams.PremiseNumber = param['PremiseNumber'];
            this.pageParams.PremiseName = param['PremiseName'];
            this.pageParams.ProductCode = param['ProductCode'];
            this.pageParams.ProductDesc = param['ProductDesc'];
            this.pageParams.PDAVisitRef = param['PDAVisitRef'];
            this.pageParams.EmployeeCode = param['EmployeeCode'];
            this.pageParams.ServiceDateFrom = param['ServiceDateFrom'];
            this.pageParams.ServiceDateTo = param['ServiceDateTo'];
            this.pageParams.currentContractType = param['currentContractType'];
            this.pageParams.BackLabel = param['backLabel'];
            this.store.dispatch({
                type: GenericActionTypes.SAVE_RECOMMENDATION_DATA, payload: this.pageParams
            });
        }
        else {
            this.pageParams = this.recommendationData;
        }
    };
    RecommendationGridComponent.prototype.setCurrentContractType = function () {
        this.currentContractType = this.riExchange.getCurrentContractType();
        this.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    };
    RecommendationGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.setCurrentContractType();
        this.inputParamsAccountPremise.currentContractType = this.currentContractType;
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
        this.premiseSearchComponent = PremiseSearchComponent;
        this.setControlValue('ShowType', 'All');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.storeSubscription = this.store.select('generic').subscribe(function (data) {
            _this.recommendationData = data['recommendation_data'];
        });
        this.componentInteractionService.emitMessage(false);
        this.errorService.emitError(0);
        this.itemsPerPage = this.global.AppConstants().tableConfig.itemsPerPage;
        this.currentPage = 1;
        this.maxColumn = 8;
        this.setPageTitle();
        this.setFormData();
        this.buildGrid();
        setTimeout(function () {
            _this.backLinkText = GlobalConstant.Configuration.BackText;
        }, 0);
    };
    ;
    RecommendationGridComponent.prototype.setPageTitle = function () {
        switch (this.parentMode) {
            case 'Contract':
                this.pageHeader = this.currentContractTypeLabel;
                break;
            case 'Premise':
                this.pageHeader = 'Premises';
                break;
            case 'ServiceCover':
            case 'CallCentreSearch':
                this.pageHeader = 'Service Cover';
                break;
            default:
                break;
        }
        this.labelContractNumber = this.currentContractTypeLabel;
    };
    RecommendationGridComponent.prototype.setFormData = function () {
        if (this.pageParams.PremiseNumber) {
            this.trPremise = true;
            this.uiForm.controls['PremiseNumber'].disable();
        }
        if (this.pageParams.ProductCode) {
            this.trProduct = true;
            this.uiForm.controls['ProductCode'].disable();
        }
        if (this.pageParams) {
            if (this.pageParams.ContractNumber) {
                if (this.pageParams.ParentMode === 'TechWorkSummary') {
                    var strContractType = void 0;
                    strContractType = this.pageParams.ContractNumber.split('/');
                    this.uiForm.controls['ContractNumber'].setValue(strContractType[1]);
                }
                else {
                    this.uiForm.controls['ContractNumber'].setValue(this.pageParams.ContractNumber);
                }
            }
            if (this.pageParams.ContractName) {
                this.uiForm.controls['ContractName'].setValue(this.pageParams.ContractName);
            }
            if (this.pageParams.PremiseNumber) {
                this.uiForm.controls['PremiseNumber'].setValue(this.pageParams.PremiseNumber);
            }
            if (this.pageParams.PremiseName) {
                this.uiForm.controls['PremiseName'].setValue(this.pageParams['PremiseName']);
            }
            if (this.pageParams['ProductCode']) {
                this.uiForm.controls['ProductCode'].setValue(this.pageParams['ProductCode']);
            }
            if (this.pageParams['ProductDesc']) {
                this.uiForm.controls['ProductDesc'].setValue(this.pageParams['ProductDesc']);
            }
            if (this.pageParams['PDAVisitRef']) {
                this.uiForm.controls['PDAVisitRef'].setValue(this.pageParams['PDAVisitRef']);
            }
            if (this.pageParams['EmployeeCode']) {
                this.uiForm.controls['EmployeeCode'].setValue(this.pageParams['EmployeeCode']);
            }
            if (this.pageParams['ServiceDateFrom']) {
                if (window['moment'](this.pageParams['ServiceDateFrom'], 'DD/MM/YYYY', true).isValid()) {
                    this.dtServiceDateFrom = this.utils.convertDate(this.pageParams['ServiceDateFrom']);
                }
                else {
                    this.dtServiceDateFrom = this.utils.formatDate(this.pageParams['ServiceDateFrom']);
                }
                this.ServiceDateFrom = new Date(this.dtServiceDateFrom);
            }
            else {
                this.ServiceDateFrom = new Date(new Date().setFullYear(this.dt.getFullYear() - 1));
                this.dtServiceDateFrom = this.utils.formatDate(this.ServiceDateFrom);
            }
            if (this.pageParams['ServiceDateTo']) {
                if (window['moment'](this.pageParams['ServiceDateTo'], 'DD/MM/YYYY', true).isValid()) {
                    this.dtServiceDateTo = this.utils.convertDate(this.pageParams['ServiceDateTo']);
                }
                else {
                    this.dtServiceDateTo = this.utils.formatDate(this.pageParams['ServiceDateTo']);
                }
                this.ServiceDateTo = new Date(this.dtServiceDateTo);
            }
            else {
                this.ServiceDateTo = new Date();
                this.dtServiceDateTo = this.utils.formatDate(this.ServiceDateTo);
            }
        }
        this.applyGridFilter();
    };
    RecommendationGridComponent.prototype.onPremiseSearchDataReceived = function (data) {
        if (data) {
            this.setControlValue('PremiseNumber', data.PremiseNumber);
            this.setControlValue('PremiseName', data.PremiseName);
            this.recommendationGrid.clearGridData();
            this.applyGridFilter();
        }
    };
    RecommendationGridComponent.prototype.serviceDateFromSelectedValue = function (value) {
        if (value && value.value) {
            this.dtServiceDateFrom = value.value;
        }
        else {
            this.dtServiceDateFrom = '';
        }
    };
    RecommendationGridComponent.prototype.serviceDateToSelectedValue = function (value) {
        if (value && value.value) {
            this.dtServiceDateTo = value.value;
        }
        else {
            this.dtServiceDateTo = '';
        }
    };
    RecommendationGridComponent.prototype.formatDate = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    };
    RecommendationGridComponent.prototype.setPostData = function () {
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('EmployeeCode', this.uiForm.controls['EmployeeCode'].value);
        this.search.set('ShowType', this.uiForm.controls['ShowType'].value ? this.uiForm.controls['ShowType'].value : 'All');
        this.search.set('serviceDateFrom', this.dtServiceDateFrom);
        this.search.set('serviceDateTo', this.dtServiceDateTo);
    };
    RecommendationGridComponent.prototype.applyGridFilter = function () {
        var pIndex, pdIndex, sIndex;
        this.gridSortHeaders = [];
        if (!this.uiForm.controls['PremiseNumber'].value) {
            pIndex = 0;
        }
        if (!this.uiForm.controls['ProductCode'].value) {
            pdIndex = (pIndex === 0) ? 1 : 0;
        }
        if (pIndex === 0 && pdIndex === 1)
            sIndex = 6;
        else if (pIndex === 0 || pdIndex === 0)
            sIndex = 5;
        else
            sIndex = 4;
        if (!this.uiForm.controls['PremiseNumber'].value) {
            var obj_1 = {
                'fieldName': 'GridPremiseNumber',
                'index': pIndex,
                'sortType': 'ASC'
            };
            this.gridSortHeaders.push(obj_1);
        }
        if (!this.uiForm.controls['ProductCode'].value) {
            var obj_2 = {
                'fieldName': 'GridProductCode',
                'index': pdIndex,
                'sortType': 'ASC'
            };
            this.gridSortHeaders.push(obj_2);
        }
        var obj = {
            'fieldName': 'Actioned',
            'index': sIndex,
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(obj);
    };
    RecommendationGridComponent.prototype.buildGrid = function () {
        if (this.uiForm.controls['PremiseNumber'].value &&
            !this.pattern.test(this.uiForm.controls['PremiseNumber'].value)) {
            var data1 = { errorMessage: MessageConstant.Message.NoSpecialCharecter };
            this.errorModal.show(data1, true);
        }
        else {
            this.search = new URLSearchParams();
            this.setPostData();
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
            this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '398282');
            this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
            this.search.set(this.serviceConstants.GridSortOrder, this.sortType);
            this.setMaxColumns();
            this.queryParams.search = this.search;
            this.recommendationGrid.loadGridData(this.queryParams, this.rowId);
            this.rowId = '';
        }
    };
    RecommendationGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.search.set('PageCurrent', String(this.currentPage));
        this.buildGrid();
    };
    RecommendationGridComponent.prototype.getGridInfo = function (info) {
        var _this = this;
        setTimeout(function () {
            if (!_this.uiForm.controls['PremiseNumber'].value && _this.uiForm.controls['ProductCode'].value) {
                var elHead = _this.elRef.nativeElement.querySelector('.max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(1)');
                var elBody = _this.elRef.nativeElement.querySelectorAll('.max-col-class-7 .gridtable tbody tr td:nth-child(1) input');
                if (elHead)
                    _this.renderer.setElementClass(elHead, 'premise', true);
                if (elBody) {
                    for (var i = 0; i < elBody.length; i++) {
                        _this.renderer.setElementClass(elBody[i], 'premise', true);
                    }
                }
            }
        }, 500);
        this.recommendationPagination.totalItems = info.totalRows;
    };
    RecommendationGridComponent.prototype.onGridRowClick = function (event) {
        this.attributes.Row = event.rowIndex;
        if (event.columnClicked.fieldName) {
            switch (event.columnClicked.fieldName) {
                case 'GridPremiseNumber':
                    if (!this.getControlValue('PremiseNumber')) {
                        this.attributes.PremiseRowID = event.cellData.rowID;
                    }
                    this.navigate('Summary', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE);
                    break;
                case 'GridProductCode':
                    this.attributes.ServiceCoverRowID = event.cellData.rowID;
                    this.navigate('Summary', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE);
                    break;
                case 'Actioned':
                    this.rowId = event.cellData.rowID;
                    this.cycleThroughStatuses(event.cellData.rowID);
                    break;
            }
        }
        else {
            if (event.cellIndex) {
                this.attributes.ServiceVisitRecommendationRowID = event.cellData.rowID;
            }
        }
    };
    RecommendationGridComponent.prototype.cycleThroughStatuses = function (rowID) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set('Function', 'Actioned');
        this.search.set('Rowid', rowID);
        this.search.set(this.serviceConstants.MethodType, 'maintenance');
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(function (e) {
            if (e.status === 'failure') {
                _this.errorService.emitError(e.oResponse);
            }
            else {
                if (e) {
                    _this.buildGrid();
                }
            }
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    RecommendationGridComponent.prototype.sortGrid = function (data) {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    };
    RecommendationGridComponent.prototype.onChangeShow = function (event) {
    };
    RecommendationGridComponent.prototype.refresh = function () {
        this.currentPage = 1;
        this.headerClicked = '';
        this.sortType = '';
        this.applyGridFilter();
        this.buildGrid();
    };
    RecommendationGridComponent.prototype.getProductDesc = function () {
        var _this = this;
        if (this.uiForm.controls['PremiseNumber'].value &&
            !this.pattern.test(this.uiForm.controls['PremiseNumber'].value)) {
            var data1 = { errorMessage: MessageConstant.Message.NoSpecialCharecter };
            this.errorModal.show(data1, true);
        }
        else {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set('Function', 'SetDisplayFields');
            this.search.set(this.serviceConstants.MethodType, 'maintenance');
            if (this.uiForm.controls['ContractNumber'].value) {
                this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
            }
            if (this.uiForm.controls['PremiseNumber'].value) {
                this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
            }
            if (this.uiForm.controls['ProductCode'].value) {
                this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
            }
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
                .subscribe(function (e) {
                if (e.status === 'failure') {
                    _this.errorService.emitError(e.oResponse);
                }
                else {
                    if (e) {
                        if (e.errorMessage) {
                            _this.errorService.emitError(e);
                            return;
                        }
                        if (e.ContractNumber) {
                            _this.uiForm.controls['ContractNumber'].setValue(e.ContractNumber);
                        }
                        if (e.ContractName) {
                            _this.uiForm.controls['ContractName'].setValue(e.ContractName);
                        }
                        if (e.PremiseNumber && e.PremiseNumber !== '0') {
                            _this.uiForm.controls['PremiseNumber'].setValue(e.PremiseNumber);
                        }
                        if (e.PremiseName) {
                            _this.uiForm.controls['PremiseName'].setValue(e.PremiseName);
                        }
                        if (e.ProductCode) {
                            _this.uiForm.controls['ProductCode'].setValue(e.ProductCode.toUpperCase());
                        }
                        if (e.ProductDesc) {
                            _this.uiForm.controls['ProductDesc'].setValue(e.ProductDesc);
                        }
                        _this.recommendationGrid.clearGridData();
                        _this.applyGridFilter();
                    }
                }
            }, function (error) {
                _this.errorService.emitError(error);
            });
        }
    };
    RecommendationGridComponent.prototype.setMaxColumns = function () {
        var count = 6;
        if (!this.uiForm.controls['ContractNumber'].value) {
            count++;
        }
        if (!this.uiForm.controls['PremiseNumber'].value || this.uiForm.controls['PremiseNumber'].value === '0') {
            count++;
        }
        if (!this.uiForm.controls['ProductCode'].value) {
            count++;
        }
        this.maxColumn = count;
    };
    RecommendationGridComponent.prototype.onPremiseBlur = function () {
        this.uiForm.controls['PremiseName'].setValue('');
        if (this.uiForm.controls['PremiseNumber'].value && this.uiForm.controls['PremiseNumber'].value !== '0') {
            this.getProductDesc();
        }
        this.recommendationGrid.clearGridData();
    };
    RecommendationGridComponent.prototype.onProductCodeBlur = function () {
        this.uiForm.controls['ProductDesc'].setValue('');
        if (this.uiForm.controls['ProductCode'].value && this.uiForm.controls['ProductCode'].value !== '0') {
            this.getProductDesc();
        }
        this.recommendationGrid.clearGridData();
    };
    RecommendationGridComponent.prototype.onBackLinkClick = function (event) {
        event.preventDefault();
        this.location.back();
    };
    RecommendationGridComponent.prototype.getMaxColClass = function () {
        return 'max-col-class-' + this.maxColumn;
    };
    RecommendationGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-recomendation-grid-search',
                    templateUrl: 'iCABSARecommendationGrid.html',
                    styles: ["\n        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(1) {\n            width: 7%;\n        }        \n        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(2) {\n            width: 9%;\n        }              \n        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(3) {\n            width: 14%;\n        }        \n        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(4) {\n            width: 14%;\n        }\n        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(5) {\n            width: 7%;\n        }        \n        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(7) {\n            width: 9%;\n        }        \n        :host /deep/ .max-col-class-8 .gridtable thead tr:nth-child(2) th:nth-child(8) {\n            width: 9%;\n        }        \n        \n        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(1) input{\n            text-align: center;\n        }  \n        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(2) input{\n            text-align: left;\n        }  \n        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(3) div{\n            text-align: left;\n        }\n        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(6) input{\n            text-align: left;\n        }\n        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(7) input{\n            text-align: left;\n        }\n        :host /deep/ .max-col-class-8 .gridtable tbody tr td:nth-child(8) input{\n            text-align: center;\n        }\n        \n\n        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(1) {\n            width: 10%;\n        }\n        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(1).premise {\n            width: 7%;\n        }        \n        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(2) {\n            width: 14%;\n        }\n        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(3) {\n            width: 14%;\n        }\n        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(4) {\n            width: 7%;\n        } \n        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(6) {\n            width: 10%;\n        }\n        :host /deep/ .max-col-class-7 .gridtable thead tr:nth-child(2) th:nth-child(7) {\n            width: 10%;\n        }\n\n        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(1) input{\n            text-align: left;\n        }  \n        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(1) input.premise{\n            text-align: center;\n        }  \n        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(2) div{\n            text-align: left;\n        }\n        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(5) input{\n            text-align: left;\n        }\n        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(6) input{\n            text-align: left;\n        }\n        :host /deep/ .max-col-class-7 .gridtable tbody tr td:nth-child(7) input{\n            text-align: center;\n        }\n\n        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(1) {\n            width: 12%;\n        }\n        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(2) {\n            width: 12%;\n        }\n        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(3) {\n            width: 7%;\n        } \n        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(5) {\n            width: 10%;\n        }\n        :host /deep/ .max-col-class-6 .gridtable thead tr:nth-child(2) th:nth-child(6) {\n            width: 10%;\n        }\n        \n        :host /deep/ .max-col-class-6 .gridtable tbody tr td:nth-child(1) div{\n            text-align: left;\n        }\n        :host /deep/ .max-col-class-6 .gridtable tbody tr td:nth-child(4) input{\n            text-align: left;\n        }\n        :host /deep/ .max-col-class-6 .gridtable tbody tr td:nth-child(5) input{\n            text-align: left;\n        }\n        :host /deep/ .max-col-class-6 .gridtable tbody tr td:nth-child(6) input{\n            text-align: center;\n        }\n    "]
                },] },
    ];
    RecommendationGridComponent.ctorParameters = [
        { type: Injector, },
        { type: Renderer, },
        { type: ElementRef, },
    ];
    RecommendationGridComponent.propDecorators = {
        'container': [{ type: ViewChild, args: ['topContainer',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'recommendationGrid': [{ type: ViewChild, args: ['recommendationGrid',] },],
        'recommendationPagination': [{ type: ViewChild, args: ['recommendationPagination',] },],
    };
    return RecommendationGridComponent;
}(BaseComponent));
