var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { Component, Injector, ViewChild } from '@angular/core';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../../internal/search/iCABSAServiceCoverSearch';
export var SalesStatsAdjustmentGridComponent = (function (_super) {
    __extends(SalesStatsAdjustmentGridComponent, _super);
    function SalesStatsAdjustmentGridComponent(injector) {
        _super.call(this, injector);
        this.totalRecords = 1;
        this.MenuOptionListValueChangeReasonFrom = [];
        this.MenuOptionListValueChangeReasonTo = [];
        this.queryParams = {
            operation: 'Sales/iCABSSSalesStatsAdjustmentGrid',
            module: 'contract-admin',
            method: 'contract-management/maintenance'
        };
        this.contractSearchModal = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.pageCurrent = 1;
        this.controls = [
            { name: 'ContractNumber', readonly: false, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: false, disabled: false, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false },
            { name: 'ValueChangeReasonFrom', readonly: false, disabled: false, required: false },
            { name: 'ValueChangeReasonTo', readonly: false, disabled: false, required: false }
        ];
        this.rowId = '';
        this.leftnewstr = '';
        this.middleMidNewStr = '';
        this.rightMidNewStr = '';
        this.pageId = '';
        this.ValueChangeReasonsArray = [];
        this.showCloseButton = true;
        this.showHeader = true;
        this.showErrorHeader = true;
        this.ContractSearchComponent = ContractSearchComponent;
        this.PremiseSearchComponent = PremiseSearchComponent;
        this.ServiceCoverSearchComponent = ServiceCoverSearchComponent;
        this.ProductSearchGridComponent = ScreenNotReadyComponent;
        this.search = this.getURLSearchParamObject();
        this.pageSize = 30;
        this.itemsPerPage = 30;
        this.currentPage = 1;
        this.totalItems = 10;
        this.maxColumn = 11;
        this.ellipsis = {
            ContractSearchComponentEllipsis: {
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp',
                    'currentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter
                },
                component: ContractSearchComponent
            },
            PremiseSearchComponentEllipsis: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp',
                    'currentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                    'ContractNumber': '',
                    'ContractName': '',
                    'showAddNew': false
                },
                component: PremiseSearchComponent
            },
            ProductSearchComponentEllipsis: {
                disabled: false,
                showCloseButton: true,
                showHeader: true,
                childparams: {
                    'parentMode': 'LookUp-Freq',
                    'currentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                    'ContractNumber': '',
                    'ContractName': '',
                    'PremiseNumber': '',
                    'PremiseName': ''
                },
                component: null
            }
        };
        this.pageId = PageIdentifier.ICABSSSALESSTATSADJUSTMENTGRID;
    }
    SalesStatsAdjustmentGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.windowOnload();
    };
    SalesStatsAdjustmentGridComponent.prototype.ngAfterViewInit = function () {
        this.contractSearchModal = true;
        if (this.formData['ContractNumber']) {
            this.contractSearchModal = false;
        }
        document.querySelector('.screen-body .col24 select')['focus']();
    };
    SalesStatsAdjustmentGridComponent.prototype.windowOnload = function () {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = 10;
        if (this.formData['ContractNumber']) {
            if (this.formData['ContractNumber'] !== '') {
                this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractNumber'] = this.formData['ContractNumber'];
                this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractName'] = this.formData['ContractName'];
            }
            if (this.formData['ContractNumber'] !== '' && this.formData['PremiseNumber'] !== '') {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
                this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
                this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractNumber'] = this.formData['ContractNumber'];
                this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractName'] = this.formData['ContractName'];
                this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseNumber'] = this.formData['PremiseNumber'];
                this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseName'] = this.formData['PremiseName'];
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
                this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
            this.contractSearchModal = false;
            this.populateUIFromFormData();
            this.BuildGrid();
        }
        this.pageParams.CurrentContractType = this.riExchange.setCurrentContractType();
        this.attributes.CurrentContractType = this.riExchange.setCurrentContractType();
        this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
            this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
            this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
            this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
            this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
            this.ProductEllipsis.updateComponent();
        }
        this.buildFilterOptions();
        this.BuildGrid();
    };
    SalesStatsAdjustmentGridComponent.prototype.getSysCharDtetails = function () {
        var _this = this;
        var sysCharList = [
            this.sysCharConstants.SystemCharEnableRenegSalesStatsAdjustmentExtraOptions];
        var sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe(function (data) {
            var record = data.records;
            _this.pageParams.vSCEnableExtraOptions = record[0]['Required'];
            _this.populatedefaultOptions();
        });
    };
    SalesStatsAdjustmentGridComponent.prototype.populatedefaultOptions = function () {
        if (this.pageParams.vSCEnableExtraOptions !== undefined) {
            this.ValueChangeReasonFrom.updateSelectedItem(0);
            if (this.pageParams.vSCEnableExtraOptions) {
                this.ValueChangeReasonTo.updateSelectedItem(4);
            }
            else {
                this.ValueChangeReasonTo.updateSelectedItem(1);
            }
        }
    };
    SalesStatsAdjustmentGridComponent.prototype.showAlert = function (msgTxt, type) {
        var titleModal = '';
        if (typeof type === 'undefined')
            type = 0;
        switch (type) {
            default:
            case 0:
                titleModal = 'Error Message';
                break;
            case 1:
                titleModal = 'Success Message';
                break;
            case 2:
                titleModal = 'Warning Message';
                break;
        }
        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    };
    SalesStatsAdjustmentGridComponent.prototype.buildFilterOptions = function () {
        var _this = this;
        var postParams = {};
        postParams.Function = 'GetValueChangeReasons';
        this.searchGet = this.getURLSearchParamObject();
        this.searchGet.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.searchGet, postParams)
            .subscribe(function (e) {
            if (e['status'] === 'failure') {
                _this.errorService.emitError(e['oResponse']);
                _this.showAlert(MessageConstant.Message.noRecordFound);
            }
            else {
                if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                    _this.showAlert(MessageConstant.Message.noRecordFound);
                }
                else if (e['errorMessage']) {
                    _this.showAlert(MessageConstant.Message.noRecordFound);
                }
                else {
                    _this.pageParams.ValueChangeReasons = e.ValueChangeReasons;
                    if (((_this.pageParams.ValueChangeReasons.length) !== null) && ((_this.pageParams.ValueChangeReasons.length) > 0)) {
                        _this.ValueChangeReasonsArray = _this.pageParams.ValueChangeReasons.split(',');
                        var arrFrom_1 = [];
                        var arrTo_1 = [];
                        _this.ValueChangeReasonsArray.forEach(function (cReason) {
                            _this.leftnewstr = _this.utils.Left(cReason, 3);
                            _this.middleMidNewStr = _this.utils.mid(cReason, 5, 1);
                            _this.rightMidNewStr = _this.utils.mid(cReason, 7);
                            arrFrom_1.push({ text: _this.rightMidNewStr, value: _this.leftnewstr });
                            arrTo_1.push({ text: _this.rightMidNewStr, value: _this.leftnewstr });
                        });
                        _this.MenuOptionListValueChangeReasonFrom = arrFrom_1;
                        _this.MenuOptionListValueChangeReasonTo = arrTo_1;
                        _this.getSysCharDtetails();
                    }
                }
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.showAlert(MessageConstant.Message.noRecordFound);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        });
    };
    SalesStatsAdjustmentGridComponent.prototype.onValueChangeReasonFromChange = function (event) {
        if (this.pageParams.vSCEnableExtraOptions !== undefined) {
            if (this.pageParams.vSCEnableExtraOptions) {
                if (this.ValueChangeReasonFrom.selectedItem === '101' || this.ValueChangeReasonFrom.selectedItem === '102'
                    || this.ValueChangeReasonFrom.selectedItem === '116' || this.ValueChangeReasonFrom.selectedItem === '126') {
                    this.ValueChangeReasonTo.updateSelectedItem(4);
                }
            }
            else {
                if (this.ValueChangeReasonFrom.selectedItem === '101') {
                    this.ValueChangeReasonTo.updateSelectedItem(1);
                }
                else {
                    this.ValueChangeReasonTo.updateSelectedItem(0);
                }
            }
        }
    };
    SalesStatsAdjustmentGridComponent.prototype.onValueChangeReasonToChange = function (event) {
        if (this.pageParams.vSCEnableExtraOptions !== undefined) {
            if (this.pageParams.vSCEnableExtraOptions) {
                if (this.ValueChangeReasonTo.selectedItem === '101' || this.ValueChangeReasonTo.selectedItem === '102'
                    || this.ValueChangeReasonTo.selectedItem === '116' || this.ValueChangeReasonTo.selectedItem === '126') {
                    this.ValueChangeReasonFrom.updateSelectedItem(4);
                }
            }
            else {
                if (this.ValueChangeReasonTo.selectedItem === '101') {
                    this.ValueChangeReasonFrom.updateSelectedItem(1);
                }
                else {
                    this.ValueChangeReasonFrom.updateSelectedItem(0);
                }
            }
        }
    };
    SalesStatsAdjustmentGridComponent.prototype.getGridInfo = function (info) {
        this.adjustmentGridPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    };
    SalesStatsAdjustmentGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.loadData();
    };
    SalesStatsAdjustmentGridComponent.prototype.riGrid_Sort = function (event) {
        this.loadData();
    };
    SalesStatsAdjustmentGridComponent.prototype.BuildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ContractNum', 'ServiceValue', 'ContractNum', MntConst.eTypeCode, 11, true);
        this.riGrid.AddColumnAlign('ContractNum', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNum', 'ServiceValue', 'PremiseNum', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumnAlign('PremiseNum', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ProdCode', 'ServiceValue', 'ProdCode', MntConst.eTypeCode, 10, true);
        this.riGrid.AddColumnAlign('ProdCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('VisitFrequency', 'ServiceValue', 'VisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('VisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PortfolioStatusDesc', 'ServiceValue', 'PortfolioStatusDesc', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('ServiceValueEffectDate', 'ServiceValue', 'ServiceValueEffectDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceValueEffectDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('SalesStatsProcessedDate', 'ServiceValue', 'SalesStatsProcessedDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('SalesStatsProcessedDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceSalesEmployee', 'ServiceValue', 'ServiceSalesEmployee', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ValueChangeReasonDesc', 'ServiceValue', 'ValueChangeReasonDesc', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('AnnualValueChange', 'ServiceValue', 'AnnualValueChange', MntConst.eTypeDecimal2, 10);
        this.riGrid.AddColumn('OldValue', 'ServiceValue', 'OldValue', MntConst.eTypeDecimal2, 10);
        this.riGrid.AddColumnUpdateSupport('OldValue', true);
        this.riGrid.AddColumnOrderable('ContractNum', true);
        this.riGrid.AddColumnOrderable('PremiseNum', true);
        this.riGrid.AddColumnOrderable('ProdCode', true);
        this.riGrid.AddColumnOrderable('ServiceSalesEmployee', true);
        this.riGrid.Complete();
        this.loadData();
    };
    SalesStatsAdjustmentGridComponent.prototype.loadData = function () {
        var _this = this;
        this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === null || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === undefined) {
            if (this.contractSearchModal !== true)
                this.formContractNumber.nativeElement.focus();
            return;
        }
        else {
            var search = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, '2');
            this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
            this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
            this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
            this.search.set('ServiceCoverRowID', this.attributes.ProductCodeServiceCoverRowID);
            this.search.set('ValueChangeReasonFrom', this.ValueChangeReasonFrom.selectedItem);
            this.search.set('ValueChangeReasonTo', this.ValueChangeReasonTo.selectedItem);
            this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
            this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '3277310');
            var sortOrder = 'Descending';
            if (!this.riGrid.DescendingSort) {
                sortOrder = 'Ascending';
            }
            this.search.set('riSortOrder', sortOrder);
            this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
            this.search.set('riCacheRefresh', 'True');
            this.queryParams.search = this.search;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.isRequesting = true;
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search)
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
                            _this.messageModal.show(data, true);
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
                _this.totalRecords = 1;
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.isRequesting = false;
            });
        }
    };
    SalesStatsAdjustmentGridComponent.prototype.onCellClickBlur = function (event) {
        this.updateGrid(event);
    };
    SalesStatsAdjustmentGridComponent.prototype.updateGrid = function (event) {
        var _this = this;
        var postSearch = this.getURLSearchParamObject();
        postSearch.set(this.serviceConstants.Action, '2');
        postSearch.set(this.serviceConstants.GridMode, '3');
        postSearch.set(this.serviceConstants.GridHandle, '2033568');
        var postObject = {
            'ContractNumRowID': this.riGrid.Details.GetAttribute('ContractNum', 'rowid'),
            'ContractNum': this.riGrid.Details.GetValue('ContractNum'),
            'PremiseNumRowID': this.riGrid.Details.GetAttribute('PremiseNum', 'rowid'),
            'PremiseNum': this.riGrid.Details.GetValue('PremiseNum'),
            'ProdCodeRowID': this.riGrid.Details.GetAttribute('ProdCode', 'rowid'),
            'ProdCode': this.riGrid.Details.GetValue('ProdCode'),
            'VisitFrequency': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency'),
            'PortfolioStatusDesc': this.riGrid.Details.GetValue('PortfolioStatusDesc'),
            'ServiceValueEffectDate': this.riGrid.Details.GetValue('ServiceValueEffectDate'),
            'SalesStatsProcessedDate': this.riGrid.Details.GetValue('SalesStatsProcessedDate'),
            'ServiceSalesEmployee': this.riGrid.Details.GetValue('ServiceSalesEmployee'),
            'ValueChangeReasonDesc': this.riGrid.Details.GetValue('ValueChangeReasonDesc'),
            'AnnualValueChange': this.riGrid.Details.GetValue('AnnualValueChange'),
            'OldValueRowID': this.riGrid.Details.GetAttribute('OldValue', 'rowid'),
            'OldValue': this.riGrid.Details.GetValue('OldValue'),
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ServiceCoverRowID': this.attributes.ProductCodeServiceCoverRowID,
            'ValueChangeReasonFrom': this.ValueChangeReasonFrom.selectedItem,
            'ValueChangeReasonTo': this.ValueChangeReasonTo.selectedItem,
            'rowID': this.riGrid.Details.GetAttribute('ProdCode', 'rowid'),
            'riSortOrder': 'Ascending',
            'HeaderClickedColumn': ''
        };
        this.queryParams.method = this.queryParams.method;
        this.queryParams.operation = this.queryParams.operation;
        this.queryParams.module = this.queryParams.module;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearch, postObject)
            .subscribe(function (data) {
            if (data) {
                console.log(data, 'data');
                _this.riGrid.Mode = MntConst.eModeNormal;
                _this.riGrid.Update = true;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
            if (data['errorMessage']) {
                _this.messageModal.show({ msg: data['errorMessage'], title: _this.pageTitle }, false);
            }
        }, function (error) {
            _this.totalRecords = 1;
            _this.riGrid.Mode = MntConst.eModeNormal;
            _this.riGrid.Update = false;
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        });
    };
    SalesStatsAdjustmentGridComponent.prototype.onBlurPremise = function (event) {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
            this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
            this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
            this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
            this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
            this.ProductEllipsis.updateComponent();
        }
        this.populateDescriptions();
    };
    SalesStatsAdjustmentGridComponent.prototype.onBlurProduct = function (event) {
        this.attributes.ProductCodeServiceCoverRowID = '';
        this.populateDescriptions();
    };
    SalesStatsAdjustmentGridComponent.prototype.onContractSearchDataReceived = function (data, ContractNumber, ContractName) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
            this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
                this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
                this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
        }
        this.populateDescriptions();
    };
    SalesStatsAdjustmentGridComponent.prototype.onPremiseSearchDataReceived = function (data, PremiseNumber, PremiseName) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
            this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
            this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
                this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
                this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
        }
        this.populateDescriptions();
    };
    SalesStatsAdjustmentGridComponent.prototype.onProductSearchDataReceived = function (data, ProductCode, ProductDesc) {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
        }
        this.populateDescriptions();
    };
    SalesStatsAdjustmentGridComponent.prototype.contractNumberFormatOnChange = function (num, size) {
        var s = num + '';
        while (s.length < size)
            s = '0' + s;
        return s;
    };
    SalesStatsAdjustmentGridComponent.prototype.onBlurContract = function (event) {
        var elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            var paddedValue = this.contractNumberFormatOnChange(elementValue, 8);
            if (event.target.id === 'ContractNumber') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', paddedValue);
            }
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
            this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
            this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
            this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
            this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
            this.ProductEllipsis.updateComponent();
        }
        this.populateDescriptions();
    };
    SalesStatsAdjustmentGridComponent.prototype.onGridRowClick = function (event) {
        this.onClickCell(event);
        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNum':
                if (this.riGrid.Details.GetValue('ContractNum').charAt(0) === 'J') {
                    this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                        'parentMode': 'ServiceValueEntryGrid',
                        'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                        'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1]
                    });
                }
                if (this.riGrid.Details.GetValue('ContractNum').charAt(0) === 'C') {
                    this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                        'parentMode': 'ServiceValueEntryGrid',
                        'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                        'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1]
                    });
                }
                if (this.riGrid.Details.GetValue('ContractNum').charAt(0) === 'P') {
                    this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                        'parentMode': 'ServiceValueEntryGrid',
                        'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                        'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1]
                    });
                }
                break;
            case 'PremiseNum':
                this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    'parentMode': 'ServiceValueEntryGrid',
                    'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'PremiseNumber': this.riGrid.Details.GetValue('PremiseNum').text,
                    'PremiseRowID': this.riGrid.Details.GetAttribute('PremiseNum', 'rowid'),
                    'ContractTypeCode': this.riGrid.Details.GetValue('ContractNum').charAt(0)
                });
                break;
            case 'ProdCode':
                this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    'parentMode': 'ServiceValueEntryGrid',
                    'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'ServiceCoverRowID': this.riGrid.Details.GetAttribute('ProdCode', 'rowid')
                });
                break;
        }
    };
    SalesStatsAdjustmentGridComponent.prototype.onClickCell = function (event) {
        this.attributes.ContractRowID = this.riGrid.Details.GetAttribute('ContractNum', 'rowid');
        this.attributes.PremiseRowID = this.riGrid.Details.GetAttribute('PremiseNum', 'rowid');
        this.attributes.ContractServiceCoverRowID = this.riGrid.Details.GetAttribute('ProdCode', 'rowid');
        this.attributes.ContractNumber = this.riGrid.Details.GetValue('ContractNum').split('/')[1];
        this.attributes.ContractName = this.riGrid.Details.GetAttribute('ContractNum', 'additionalproperty');
        this.attributes.PremiseNumber = this.riGrid.Details.GetValue('PremiseNum');
        this.attributes.PremiseName = this.riGrid.Details.GetAttribute('PremiseNum', 'additionalproperty');
        this.attributes.ProductCode = this.riGrid.Details.GetValue('ProdCode');
        this.attributes.ProductDesc = this.riGrid.Details.GetAttribute('ProdCode', 'additionalproperty');
        this.attributes.ServiceValueServiceCoverRowID = this.riGrid.Details.GetAttribute('ProdCode', 'rowid');
        switch (this.riGrid.Details.GetAttribute('VisitFrequency', 'additionalproperty')) {
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
        this.pageParams.CurrentContractType = this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.attributes.CurrentContractType = this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
    };
    SalesStatsAdjustmentGridComponent.prototype.populateDescriptions = function () {
        var _this = this;
        var postParamsPopulate = {};
        var searchGetpopulate = this.getURLSearchParamObject();
        searchGetpopulate.set(this.serviceConstants.Action, '0');
        postParamsPopulate.Function = 'SetDisplayFields';
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== null && this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== undefined && this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '')
            postParamsPopulate.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== null && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== undefined && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '')
            postParamsPopulate.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') !== null && this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') !== undefined && this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') !== '')
            postParamsPopulate.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        if (this.attributes.ProductCodeServiceCoverRowID !== null && this.attributes.ProductCodeServiceCoverRowID !== undefined && this.attributes.ProductCodeServiceCoverRowID !== '')
            postParamsPopulate.ServiceCoverRowID = this.attributes.ProductCodeServiceCoverRowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchGetpopulate, postParamsPopulate)
            .subscribe(function (e) {
            if (e['errorMessage']) {
                _this.showAlert(MessageConstant.Message.noRecordFound);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', '');
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', '');
            }
            else {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractNumber', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ContractNumber'));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', e.ContractName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseNumber', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseNumber'));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', e.PremiseName);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductCode', _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ProductCode'));
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', e.ProductDesc);
                _this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractNumber'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ContractNumber');
                _this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractName'] = e.ContractName;
                _this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractNumber'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'ContractNumber');
                _this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractName'] = e.ContractName;
                _this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseNumber'] = _this.riExchange.riInputElement.GetValue(_this.uiForm, 'PremiseNumber');
                _this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseName'] = e.PremiseName;
                if (e.ServiceVisitFrequency === '0')
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', '');
                else
                    _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceVisitFrequency', e.ServiceVisitFrequency);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        }, function (error) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            _this.isRequesting = false;
        });
        this.loadData();
    };
    SalesStatsAdjustmentGridComponent.prototype.refresh = function () {
        this.currentPage = 1;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === null || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === undefined) {
            if (this.contractSearchModal !== true)
                this.formContractNumber.nativeElement.focus();
            return;
        }
        else {
            this.loadData();
        }
    };
    SalesStatsAdjustmentGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    SalesStatsAdjustmentGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSSalesStatsAdjustmentGrid.html'
                },] },
    ];
    SalesStatsAdjustmentGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    SalesStatsAdjustmentGridComponent.propDecorators = {
        'adjustmentGrid': [{ type: ViewChild, args: ['adjustmentGrid',] },],
        'adjustmentGridPagination': [{ type: ViewChild, args: ['adjustmentGridPagination',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'formContractNumber': [{ type: ViewChild, args: ['ContractNumber',] },],
        'ValueChangeReasonFrom': [{ type: ViewChild, args: ['ValueChangeReasonFrom',] },],
        'ValueChangeReasonTo': [{ type: ViewChild, args: ['ValueChangeReasonTo',] },],
        'ProductEllipsis': [{ type: ViewChild, args: ['ProductEllipsis',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return SalesStatsAdjustmentGridComponent;
}(BaseComponent));
