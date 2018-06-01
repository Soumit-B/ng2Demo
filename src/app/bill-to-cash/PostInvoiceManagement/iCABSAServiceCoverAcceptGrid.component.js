var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ScreenNotReadyComponent } from '../../../shared/components/screenNotReady';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
export var ServiceCoverAcceptGridComponent = (function (_super) {
    __extends(ServiceCoverAcceptGridComponent, _super);
    function ServiceCoverAcceptGridComponent(injector) {
        _super.call(this, injector);
        this.totalRecords = 1;
        this.showMessageHeader = true;
        this.pageCurrent = 1;
        this.promptTitle = 'Confirm';
        this.showErrorHeader = true;
        this.datepickerdisable = true;
        this.datepickerReqd = false;
        this.totalItems = 10;
        this.ServiceCoverSearchComponent = ServiceCoverSearchComponent;
        this.ProductSearchGridComponent = ScreenNotReadyComponent;
        this.ProductServiceSearchGridComponent = ScreenNotReadyComponent;
        this.ellipsisConfig = {
            contract: {
                disabled: false,
                showHeader: true,
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'showAddNew': false
                },
                component: ContractSearchComponent
            },
            premise: {
                disabled: false,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'ContractNumber': '',
                    'ContractName': '',
                    'showAddNew': false
                },
                component: PremiseSearchComponent
            },
            product: {
                disabled: false,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': '',
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': '',
                    'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter
                },
                component: null
            },
            productService: {
                disabled: false,
                showHeader: true,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': '',
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': '',
                    'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter
                },
                component: null
            }
        };
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.maxColumn = 14;
        this.currentPage = 1;
        this.pageSize = 15;
        this.pageId = '';
        this.itemsPerPage = 10;
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: false, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'FilterOn', readonly: false, disabled: false, required: false, value: 'All' },
            { name: 'ContractTypeFilter', readonly: false, disabled: false, required: false, value: 'C' },
            { name: 'ProductServiceGroupCode', readonly: false, disabled: false, required: false, value: '' },
            { name: 'ProductServiceGroupDesc', readonly: false, disabled: false, required: false },
            { name: 'FilterDate', readonly: false, disabled: false, required: false }
        ];
        this.headerParams = {
            method: 'contract-management/maintenance',
            module: 'contract-admin',
            operation: 'Application/iCABSAServiceCoverAcceptGrid'
        };
        this.pageId = PageIdentifier.ICABSASERVICECOVERACCEPTGRID;
    }
    ServiceCoverAcceptGridComponent.prototype.refresh = function () {
        this.loadData();
    };
    ServiceCoverAcceptGridComponent.prototype.fromDateSelectedValue = function (value) {
        if (value && value.value) {
            this.FromdtDisplayed = value.value;
        }
        else {
            this.FromdtDisplayed = '';
        }
        this.refresh();
    };
    ServiceCoverAcceptGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = 10;
        this.ellipsisConfig.productService.component = this.ProductServiceSearchGridComponent;
        this.contractType = this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.setfocusContractNumber.nativeElement.focus();
        this.pageParams.CurrentContractType = this.riExchange.setCurrentContractType();
        this.attributes.CurrentContractType = this.riExchange.setCurrentContractType();
        this.pageTitle = 'Retained Service Cover Acceptance';
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            this.ellipsisConfig.product.childConfigParams['parentMode'] = 'LookUp-FreqInvAccept';
            this.ellipsisConfig.product.component = ServiceCoverSearchComponent;
            this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.ellipsisConfig.product.childConfigParams['parentMode'] = 'TurnoverGrid';
            this.ellipsisConfig.product.component = this.ProductSearchGridComponent;
            this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
            this.ProductEllipsis.updateComponent();
        }
        this.FilterOn_onchange('All');
        this.BuildGrid();
        this.loadData();
    };
    ServiceCoverAcceptGridComponent.prototype.ngAfterViewInit = function () {
    };
    ServiceCoverAcceptGridComponent.prototype.riMaintenance_Search = function (data, type) {
        switch (type) {
            case 'contract':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                break;
            case 'premise':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.product.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
                break;
            case 'product':
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
                this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                this.ellipsisConfig.product.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
                this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
                break;
        }
    };
    ServiceCoverAcceptGridComponent.prototype.populateDescriptions = function (type) {
        var _this = this;
        var postParams = {};
        var searchPostpopulate = this.getURLSearchParamObject();
        searchPostpopulate.set(this.serviceConstants.Action, '6');
        postParams.Function = 'SetDisplayFields';
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '') {
            postParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            postParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') !== '') {
            postParams.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchPostpopulate, postParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
            if (data.errorMessage) {
                _this.errorModal.show(data, true);
                if (type === 'contract') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', '');
                }
                if (type === 'premise') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                }
                if (type === 'product') {
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                }
                return;
            }
            _this.riMaintenance_Search(data, type);
            _this.loadData();
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        });
    };
    ServiceCoverAcceptGridComponent.prototype.inputField_OnChange = function (e, name) {
        if (name === 'contract' && e.target.value.length > 0) {
            var updateValue = this.utils.numberPadding(e.target.value, 8);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', updateValue);
            this.populateDescriptions(name);
        }
        if (name === 'contract' && e.target.value.length === 0) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
        if (name === 'premise') {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'LookUp-FreqInvAccept';
                this.ellipsisConfig.product.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'TurnoverGrid';
                this.ellipsisConfig.product.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
            this.populateDescriptions(name);
        }
        if (name === 'premise' && e.target.value.length === 0) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
        }
        if (name === 'product') {
            this.populateDescriptions(name);
        }
        if (name === 'product' && e.target.value.length === 0) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
        }
    };
    ServiceCoverAcceptGridComponent.prototype.riGrid_Sort = function (event) {
        this.loadData();
    };
    ServiceCoverAcceptGridComponent.prototype.BuildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ContractNumber', 'RetainAccept', 'ContractNumber', MntConst.eTypeCode, 11, true);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNumber', 'RetainAccept', 'PremiseNumber', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseName', 'RetainAccept', 'PremiseName', MntConst.eTypeText, 14);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('Postcode', 'RetainAccept', 'Postcode', MntConst.eTypeCode, 8);
        this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ProductCode', 'RetainAccept', 'ProductCode', MntConst.eTypeCode, 10, true);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceVisitFrequency', 'RetainAccept', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ContractCommenceDate', 'RetainAccept', 'ContractCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ContractCommenceDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ProductServiceGroupCode', 'RetainAccept', 'ProductServiceGroupCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('ProductServiceGroupCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceDateStart', 'RetainAccept', 'ServiceDateStart', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceDateStart', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceCommenceDate', 'RetainAccept', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('InitialValue', 'RetainAccept', 'InitialValue', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('InitialValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ServiceAnnualValue', 'RetainAccept', 'ServiceAnnualValue', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('ServiceAnnualValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('InterCompanyPortfolioInd', 'RetainAccept', 'InterCompanyPortfolioInd', MntConst.eTypeImage, 3, false);
        this.riGrid.AddColumn('Accepted', 'RetainAccept', 'Accepted', MntConst.eTypeImage, 3, true);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('ContractCommenceDate', true);
        this.riGrid.AddColumnOrderable('ServiceCommenceDate', true);
        this.riGrid.AddColumnOrderable('ServiceDateStart', true);
        this.riGrid.Complete();
    };
    ServiceCoverAcceptGridComponent.prototype.loadData = function () {
        var _this = this;
        this.riGrid.Update = false;
        this.riGrid.UpdateBody = false;
        this.riGrid.UpdateFooter = false;
        this.riGrid.UpdateHeader = false;
        var search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        search.set('BranchNumber', this.utils.getBranchCode());
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        search.set('FilterOn', this.riExchange.riInputElement.GetValue(this.uiForm, 'FilterOn'));
        search.set('FilterDate', this.FromdtDisplayed);
        search.set('Function', '');
        search.set('ContractTypeFilter', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractTypeFilter'));
        search.set('ProductServiceGroupCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductServiceGroupCode'));
        search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        search.set(this.serviceConstants.GridMode, '0');
        search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        search.set('riSortOrder', sortOrder);
        search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.headerParams.search = search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, this.headerParams.search)
            .subscribe(function (data) {
            if (data) {
                try {
                    _this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    _this.riGrid.Update = true;
                    _this.riGrid.UpdateBody = true;
                    _this.riGrid.UpdateHeader = true;
                    _this.riGrid.UpdateFooter = true;
                    if (data && data.errorMessage) {
                        _this.messageModal.show(data['errorMessage'], true);
                    }
                    else {
                        _this.riGrid.Execute(data);
                    }
                }
                catch (e) {
                    _this.logger.log('Problem in grid load', e);
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.messageModal.show(error, true);
            _this.totalRecords = 1;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        });
    };
    ServiceCoverAcceptGridComponent.prototype.getGridInfo = function (info) {
        this.serviceCoverAcceptPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    };
    ServiceCoverAcceptGridComponent.prototype.getCurrentPage = function (currentPage) {
        var search = this.getURLSearchParamObject();
        this.currentPage = currentPage.value;
        search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.loadData();
    };
    ServiceCoverAcceptGridComponent.prototype.onContractDataReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
            this.ellipsisConfig.premise.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsisConfig.premise.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'LookUp-FreqInvAccept';
                this.ellipsisConfig.product.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'TurnoverGrid';
                this.ellipsisConfig.product.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
        }
    };
    ServiceCoverAcceptGridComponent.prototype.onPremiseDataReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
            this.ellipsisConfig.product.childConfigParams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsisConfig.product.childConfigParams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            this.ellipsisConfig.product.childConfigParams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
            this.ellipsisConfig.product.childConfigParams['PremiseName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'LookUp-FreqInvAccept';
                this.ellipsisConfig.product.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsisConfig.product.childConfigParams['parentMode'] = 'TurnoverGrid';
                this.ellipsisConfig.product.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
        }
    };
    ServiceCoverAcceptGridComponent.prototype.onProductDataReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
        }
    };
    ServiceCoverAcceptGridComponent.prototype.onProductServiceDataReceived = function (data) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
        }
    };
    ServiceCoverAcceptGridComponent.prototype.FilterOn_onchange = function (data) {
        if (data === 'All') {
            this.datepickerdisable = true;
            this.datepickerReqd = false;
            this.DateFrom = null;
            this.FromdtDisplayed = this.utils.formatDate(this.DateFrom);
        }
        else {
            this.datepickerdisable = false;
            this.datepickerReqd = true;
            this.DateFrom = new Date();
            this.FromdtDisplayed = this.utils.formatDate(this.DateFrom);
        }
    };
    ServiceCoverAcceptGridComponent.prototype.promptSave = function (data) {
        this.promptContent = 'Are you sure you want to accept this Service Cover?';
        this.promptModal.show();
        if (data.value === 'save') {
            this.vbFunction = 'Update';
            this.riGrid.Update = true;
            this.loadData();
            if (this.vbContractType === 'J') {
                this.loadData();
            }
        }
    };
    ServiceCoverAcceptGridComponent.prototype.onGridRowClick = function (data) {
        this.ServiceCoverFocus(data);
        if (this.riGrid.CurrentColumnName === 'ContractNumber') {
            this.ServiceCoverFocus(data);
            this.navigate('Accept', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                'parentMode': 'Accept',
                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1]
            });
        }
        if (this.riGrid.CurrentColumnName === 'PremiseNumber') {
            this.ServiceCoverFocus(data);
            this.navigate('Accept', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                'parentMode': 'Accept',
                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'PremiseNumber': this.riGrid.Details.GetValue('ContractNumber'),
                'PremiseRowID': this.attributes.ContractNumber_PremiseRowID,
                'ContractTypeCode': this.riGrid.Details.GetValue('ProductCode').charAt(0)
            });
        }
        if (this.riGrid.CurrentColumnName === 'ProductCode') {
            this.ServiceCoverFocus(data);
            this.navigate('Accept', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                'parentMode': 'Accept',
                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'ServiceCoverRowID': this.attributes.ContractNumber_ServiceCoverRowID
            });
        }
        if (this.riGrid.CurrentColumnName === 'ContractCommenceDate') {
            this.ServiceCoverFocus(data);
            this.navigate('Accept', '/contractmanagement/maintenance/commencedateex', {
                'parentMode': 'Accept',
                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                'ContractRowID': this.attributes.ContractNumber_ContractRowID,
                'CurrentContractType': this.vbContractType
            });
        }
        if (this.riGrid.CurrentColumnName === 'ServiceCommenceDate') {
            this.ServiceCoverFocus(data);
            this.navigate('Accept', '/maintenance/servicecover/commencedate', {
                'parentMode': 'Accept',
                'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                'ServiceCoverRowID': this.attributes.ContractNumber_ServiceCoverRowID,
                'PremiseNumber': this.riGrid.Details.GetValue('PremiseNumber'),
                'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1],
                'ProductCode': this.riGrid.Details.GetValue('ProductCode')
            });
        }
    };
    ServiceCoverAcceptGridComponent.prototype.ServiceCoverFocus = function (data) {
        this.attributes.ContractNumber_Row = this.riGrid.CurrentRow;
        this.attributes.ContractNumber_ContractRowID = this.riGrid.Details.GetAttribute('ContractNumber', 'rowid');
        this.attributes.ContractNumber_PremiseRowID = this.riGrid.Details.GetAttribute('PremiseNumber', 'additionalproperty');
        this.attributes.ContractNumber_ServiceCoverRowID = this.riGrid.Details.GetAttribute('ProductCode', 'rowid');
        this.attributes.grdServiceCover_Row = this.riGrid.CurrentRow;
        this.attributes.grdServiceCover_ServiceCoverRowID = this.riGrid.Details.GetAttribute('ProductCode', 'rowid');
        this.vbContractType = this.riGrid.Details.GetAttribute('ContractNumber', 'additionalproperty');
        switch (this.vbContractType) {
            case 'C':
                this.pageParams.CurrentContractTypeURLParameter = '';
                this.attributes.CurrentContractTypeURLParameter = '';
                break;
            case 'J':
                this.pageParams.CurrentContractTypeURLParameter = '<job>';
                this.attributes.CurrentContractTypeURLParameter = '<job>';
                break;
            case 'P':
                this.pageParams.CurrentContractTypeURLParameter = '<product>';
                this.attributes.CurrentContractTypeURLParameter = '<product>';
                break;
        }
        this.ellipsisConfig.product.childConfigParams['currentContractTypeURLParameter'] = this.pageParams.CurrentContractTypeURLParameter;
        if (this.riGrid.CurrentColumnName === 'Accepted') {
            this.promptSave('');
        }
    };
    ServiceCoverAcceptGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverAcceptGrid.html'
                },] },
    ];
    ServiceCoverAcceptGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    ServiceCoverAcceptGridComponent.propDecorators = {
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'setfocusContractNumber': [{ type: ViewChild, args: ['setfocusContractNumber',] },],
        'serviceCoverAcceptGrid': [{ type: ViewChild, args: ['serviceCoverAcceptGrid',] },],
        'serviceCoverAcceptPagination': [{ type: ViewChild, args: ['serviceCoverAcceptPagination',] },],
        'promptModal': [{ type: ViewChild, args: ['promptModal',] },],
        'ProductEllipsis': [{ type: ViewChild, args: ['ProductEllipsis',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return ServiceCoverAcceptGridComponent;
}(BaseComponent));
