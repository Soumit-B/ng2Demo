var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { HttpService } from '../../../shared/services/http-service';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
export var ServiceCoverDisplayGridComponent = (function (_super) {
    __extends(ServiceCoverDisplayGridComponent, _super);
    function ServiceCoverDisplayGridComponent(injector, _httpService, _router) {
        _super.call(this, injector);
        this.injector = injector;
        this._httpService = _httpService;
        this._router = _router;
        this.pageId = '';
        this.showErrorHeader = true;
        this.queryLookUp = new URLSearchParams();
        this.inputParams = {};
        this.method = 'contract-management/maintenance';
        this.module = 'contract-admin';
        this.operation = 'Application/iCABSAServiceCoverDisplayGrid';
        this.showFutureChanges = true;
        this.pageCurrent = 1;
        this.pageSize = 10;
        this.maxColumn = 14;
        this.btnMassValue = true;
        this.trAddDisplay = true;
        this.trMatchDisplayValues = true;
        this.trExpectedTotals = false;
        this.Status = 'Current';
        this.updatemode = false;
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: false },
            { name: 'ContractName', readonly: true, disabled: true, required: false },
            { name: 'ExpectedTotalQty', readonly: false, disabled: false, required: false },
            { name: 'ExpectedTotalValue', readonly: false, disabled: false, required: false },
            { name: 'PremiseNumber', readonly: true, disabled: true, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'TotalQty', readonly: true, disabled: true, required: false },
            { name: 'TotalValue', readonly: true, disabled: true, required: false },
            { name: 'TotalWEDValue', readonly: true, disabled: true, required: false },
            { name: 'ProductCode', readonly: true, disabled: true, required: false },
            { name: 'ProductDesc', readonly: true, disabled: true, required: false },
            { name: 'ServiceCoverROWID', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverNumber', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverItemRowID', readonly: false, disabled: false, required: false },
            { name: 'EffectiveDate', readonly: false, disabled: false, required: false },
            { name: 'ServiceCoverMode', readonly: false, disabled: false, required: false },
            { name: 'EmployeeLimitChildDrillOptions', readonly: false, disabled: false, required: false }
        ];
        this.pageId = PageIdentifier.ICABSASERVICECOVERDISPLAYGRID;
    }
    ServiceCoverDisplayGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.inputParams.module = this.module;
        this.populateUIFromFormData();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.ServiceCommenceDate = this.riExchange.getParentHTMLValue('ServiceCommenceDate');
        this.AccountNumber = this.riExchange.getParentHTMLValue('AccountNumber');
        this.LastChangeEffectDate = this.riExchange.getParentHTMLValue('LastChangeEffectDate');
        this.ServiceBranchNumber = this.riExchange.getParentHTMLValue('ServiceBranchNumber');
        this.NegBranchNumber = this.riExchange.getParentHTMLValue('NegBranchNumber');
        this.RequiresManualVisitPlanningInd = this.riExchange.getParentHTMLValue('RequiresManualVisitPlanningInd');
        this.AnnualCalendarInd = this.riExchange.getParentHTMLValue('AnnualCalendarInd');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeLimitChildDrillOptions', this.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions'));
        this.pageSetup();
    };
    ServiceCoverDisplayGridComponent.prototype.pageSetup = function () {
        switch (this.parentMode) {
            case 'GroupServiceVisit':
                this.ServiceCoverMode = 'GroupServiceVisit';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', '');
                this.trAddDisplay = false;
                this.trMatchDisplayValues = false;
                this.btnMassValue = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('BranchServiceAreaCodeServiceCoverRowID'));
                break;
            case 'DespatchGrid':
                this.ServiceCoverMode = 'DespatchGrid';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', '');
                this.trAddDisplay = false;
                this.trMatchDisplayValues = false;
                this.btnMassValue = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('ServiceAreaListCodeServiceCoverRowID'));
                break;
            case 'ServiceCoverAdd':
                this.ServiceCoverMode = 'ServiceCoverAdd';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverMode', 'ServiceCoverAdd');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', this.ServiceCommenceDate);
                this.InstallByBranchInd = this.riExchange.getParentAttributeValue('InstallByBranchInd');
                this.showFutureChanges = false;
                this.btnMassValue = false;
                this.trExpectedTotals = true;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('ServiceCover'));
                this.maxColumn = 15;
                this.ServiceDisplayAdd();
                break;
            case 'ServiceCoverUpdate':
                this.ServiceCoverMode = 'ServiceCoverAdd';
                this.ServiceCommenceDate = this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate');
                this.showFutureChanges = false;
                this.btnMassValue = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('ServiceCover'));
                break;
            default:
                this.ServiceCoverMode = 'Normal';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'EffectiveDate', '');
                this.trAddDisplay = false;
                this.trMatchDisplayValues = false;
                this.maxColumn = 14;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverROWID', this.riExchange.getParentAttributeValue('ServiceCover'));
                this.ShowFutureChanges(this.inputParams);
                this.callShowDelete(this.inputParams);
                break;
        }
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverMode', this.ServiceCoverMode);
        this.doLookUpForServiceCoverData();
        this.doLookUpForOtherData();
        this.riGrid_BeforeExecute();
    };
    ServiceCoverDisplayGridComponent.prototype.doLookUpForOtherData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName', 'NegBranchNumber']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseName', 'AccountNumber']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
                },
                'fields': ['ProductDesc', 'RequiresManualVisitPlanningInd']
            }
        ];
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe(function (data) {
            var Contract = data[0][0];
            if (Contract) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ContractName', Contract.ContractName);
            }
            var Premise = data[1][0];
            if (Premise) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'PremiseName', Premise.PremiseName);
            }
            var Product = data[2][0];
            if (Product) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ProductDesc', Product.ProductDesc);
            }
        });
    };
    ServiceCoverDisplayGridComponent.prototype.doLookUpForServiceCoverData = function () {
        var _this = this;
        var lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCoverNumber', 'ServiceCommenceDate', 'ServiceBranchNumber', 'AnnualCalendarInd']
            }];
        this.lookUpRecord(JSON.parse(JSON.stringify(lookupIP))).subscribe(function (e) {
            _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ServiceCoverNumber', e.results[0][0].ServiceCoverNumber);
            _this.updateView();
        }, function (error) {
            if (error.errorMessage) {
                _this.errorModal.show(error, true);
            }
        });
    };
    ServiceCoverDisplayGridComponent.prototype.lookUpRecord = function (data) {
        this.queryLookUp.set(this.serviceConstants.Action, '5');
        this.queryLookUp.set('rowid', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID'));
        this.queryLookUp.set('maxresults', '1');
        this.queryLookUp.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.queryLookUp.set(this.serviceConstants.CountryCode, this.countryCode());
        return this.httpService.lookUpRequest(this.queryLookUp, data);
    };
    ServiceCoverDisplayGridComponent.prototype.ShowFutureChanges = function (params) {
        this.setFilterValueForFutureChanges(params);
    };
    ServiceCoverDisplayGridComponent.prototype.setFilterValueForFutureChanges = function (params) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['Function'] = 'ShowFutureChanges';
        formdata['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID');
        formdata['methodtype'] = 'maintenance';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            if (data['ShowFutureChanges'] === 'no') {
                _this.showFutureChanges = false;
            }
            else {
                _this.showFutureChanges = true;
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            if (error.errorMessage) {
                _this.errorModal.show(error, true);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDisplayGridComponent.prototype.callShowDelete = function (params) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        var formdata = {};
        formdata['Function'] = 'ShowDelete';
        formdata['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID');
        formdata['EffectiveDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate');
        formdata['methodtype'] = 'maintenance';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
            .subscribe(function (data) {
            if (data.ShowDeleteColumn === 'yes') {
                _this.maxColumn = 15;
                _this.updateView();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            if (error.errorMessage) {
                _this.errorModal.show(error, true);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDisplayGridComponent.prototype.updateView = function () {
        this.loadData(this.inputParams);
    };
    ServiceCoverDisplayGridComponent.prototype.loadData = function (params) {
        this.setFilterValues(params);
        this.inputParams.search = this.search;
        this.serviceCoverDisplayGrid.itemsPerPage = this.pageSize;
        this.serviceCoverDisplayGrid.loadGridData(this.inputParams);
    };
    ServiceCoverDisplayGridComponent.prototype.setFilterValues = function (params) {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.search.set('EffectiveDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate'));
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set('UpdateRecord', '');
        this.search.set('ServiceCoverMode', this.ServiceCoverMode);
        this.search.set('Status', this.Status);
        this.search.set('GridType', 'Main');
        this.search.set('riGridMode', '0');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('DeleteDisplay', 'True');
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
    };
    ServiceCoverDisplayGridComponent.prototype.getGridInfo = function (info) {
        if (this.updatemode === true)
            this.updatemode = false;
        this.serviceCoverDisplayPagination.totalItems = info.totalRows;
        this.serviceCoverDisplayGrid.update = true;
        if (info.gridData) {
            if (info.gridData.footer.rows[0].text !== '') {
                var footerArray = info.gridData.footer.rows[0].text.split('|');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalQty', footerArray[1]);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalValue', footerArray[2]);
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWEDValue', footerArray[3]);
            }
            else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalQty', '0');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalValue', '0');
                this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalWEDValue', '0');
            }
        }
        if (this.parentMode === 'ServiceCoverAdd') {
            var ExpectedTotalQty = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalQty');
            var TotalQty = this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalQty');
            var ExpectedTotalValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalValue');
            var TotalValue = this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalValue');
            if (((ExpectedTotalQty !== TotalQty) || (ExpectedTotalValue !== TotalValue)) && (TotalValue !== '0') && (TotalQty !== '0')) {
                this.trMatchDisplayValues = true;
            }
            else {
                this.trMatchDisplayValues = false;
            }
        }
    };
    ServiceCoverDisplayGridComponent.prototype.refresh = function (event) {
        this.updatemode = false;
        this.loadData(this.inputParams);
    };
    ServiceCoverDisplayGridComponent.prototype.getCurrentPage = function (event) {
        this.pageCurrent = event.value;
        this.updateView();
    };
    ServiceCoverDisplayGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        if (this.ServiceCoverMode === 'ServiceCoverAdd') {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '6');
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.inputParams.search = this.search;
            var formdata = {};
            formdata['Function'] = 'GetServiceCoverTotals';
            formdata['ServiceCoverRowID'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID');
            formdata['EffectiveDate'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate');
            formdata['methodtype'] = 'maintenance';
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.search, formdata)
                .subscribe(function (data) {
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ExpectedTotalQty', data['ExpectedTotalQty']);
                _this.riExchange.riInputElement.SetValue(_this.uiForm, 'ExpectedTotalValue', data['ExpectedTotalValue']);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                if (error.errorMessage) {
                    _this.errorModal.show(error, true);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    ServiceCoverDisplayGridComponent.prototype.selectedStatusDefault = function (CodeValue) {
        this.Status = CodeValue;
        this.updateView();
    };
    ServiceCoverDisplayGridComponent.prototype.onGridRowClick = function (data) {
        var cellIndex = data.cellIndex;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverItemRowID', data.cellData.additionalData);
        this.attributes['ServiceCoverItemRowID'] = data.cellData.additionalData;
        switch (cellIndex) {
            case 0:
                this.navigate('DisplayUpd', 'grid/application/servicedisplayentry', { currentContractType: 'C' });
                break;
            case 11:
            case 10:
                if (data.cellData.text !== '0') {
                    this.errorModal.show({ msg: 'Page Under Construction' }, false);
                }
                break;
        }
    };
    ServiceCoverDisplayGridComponent.prototype.onCellClick = function (data) {
        this.updatemode = true;
        if (data.cellIndex === 7) {
            this.selectedRowId = data.cellData.rowID;
        }
        if (data.cellIndex === 10) {
            var ServiceVisitRowID = data.cellData.additionalData;
        }
    };
    ServiceCoverDisplayGridComponent.prototype.onCellBlur = function (data) {
        this.selectedRowId = data.cellData.rowID;
        if (data.keyCode && data.cellData.text !== data.updateValue) {
            this.UpdatePremisesLocation(data.rowData, data.keyCode.target.value);
            this.selectedPremisesNumber = data.keyCode.target.value;
        }
    };
    ServiceCoverDisplayGridComponent.prototype.btnAddDisplay_onClick = function (event) {
        this.navigate('Add', 'grid/application/servicedisplayentry');
    };
    ServiceCoverDisplayGridComponent.prototype.ServiceDisplayAdd = function () {
        this.navigate('Add', 'grid/application/servicedisplayentry');
    };
    ServiceCoverDisplayGridComponent.prototype.btnMassValue_onClick = function (event) {
        this.navigate('', '/maintenance/serviceCoverDisplayMassValues');
    };
    ServiceCoverDisplayGridComponent.prototype.btnSTBInterfaceDtls_onClick = function (event) {
        this.errorModal.show({ msg: 'Page Under Construction' }, false);
    };
    ServiceCoverDisplayGridComponent.prototype.btnFutureChanges_onClick = function (event) {
        this.errorModal.show({ msg: 'Page Under Construction' }, false);
    };
    ServiceCoverDisplayGridComponent.prototype.btnPrintDisp_onClick = function (event) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            window.open(data.url, '_blank');
        }, function (error) {
            if (error.errorMessage) {
                _this.errorModal.show(error, true);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDisplayGridComponent.prototype.btnMatchDisplayValues_onClick = function (event) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '6');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set('Function', 'MatchDisplayValues');
        this.search.set('ServiceCoverRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverROWID'));
        this.search.set('ExpectedTotalValue', this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalValue'));
        this.search.set('ExpectedTotalQty', this.riExchange.riInputElement.GetValue(this.uiForm, 'ExpectedTotalQty'));
        this.search.set('TotalValue', this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalValue'));
        this.search.set('TotalQty', this.riExchange.riInputElement.GetValue(this.uiForm, 'TotalQty'));
        this.search.set('EffectiveDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate'));
        this.search.set('InstallByBranchInd', 'true');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search)
            .subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            if (error.errorMessage) {
                _this.errorModal.show(error, true);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDisplayGridComponent.prototype.UpdatePremisesLocation = function (data, value) {
        var _this = this;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('ItemDescription', data['Display Desc']);
        this.search.set('Component1', data['Component 1']);
        this.search.set('Component2', data['Component 2']);
        this.search.set('Component3', data['Component 3']);
        this.search.set('CommenceDate', data['Commence Date']);
        this.search.set('WEDValue', data['W.E.D']);
        this.search.set('AnnualValue', data['Value']);
        this.search.set('PremiseLocationNumberRowID', this.selectedRowId);
        this.search.set('PremiseLocationNumber', value);
        this.search.set('PremiseLocationDesc', data['Installation Date']);
        this.search.set('InstallationDate', data['Install Visit Number']);
        this.search.set('InstallVisitNumber', data['Removal Visit Number']);
        this.search.set('RemovalVisitNumber', data['Actual Removal Date']);
        this.search.set('ActualRemovalDate', data['Removal Date']);
        this.search.set('RemovalDate', data['Removal Date']);
        this.search.set('RemovalDate', data['Removal Date']);
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.search.set('EffectiveDate', this.riExchange.riInputElement.GetValue(this.uiForm, 'EffectiveDate'));
        this.search.set('PageCurrent', this.pageCurrent.toString());
        this.search.set('UpdateRecord', '');
        this.search.set('ServiceCoverMode', this.ServiceCoverMode);
        this.search.set('Status', this.Status);
        this.search.set('GridType', 'Main');
        this.search.set('riGridMode', '3');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('PageSize', this.pageSize.toString());
        this.search.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.method, this.module, this.operation, this.search).subscribe(function (data) {
            if (data.hasOwnProperty('errorMessage')) {
                _this.errorModal.show({ msg: data.errorMessage, title: 'Error' }, false);
            }
            else {
                _this.updateView();
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        }, function (error) {
            if (error.errorMessage) {
                _this.errorModal.show(error, true);
            }
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    ServiceCoverDisplayGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAServiceCoverDisplayGrid.html'
                },] },
    ];
    ServiceCoverDisplayGridComponent.ctorParameters = [
        { type: Injector, },
        { type: HttpService, },
        { type: Router, },
    ];
    ServiceCoverDisplayGridComponent.propDecorators = {
        'serviceCoverDisplayGrid': [{ type: ViewChild, args: ['serviceCoverDisplayGrid',] },],
        'serviceCoverDisplayPagination': [{ type: ViewChild, args: ['serviceCoverDisplayPagination',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return ServiceCoverDisplayGridComponent;
}(BaseComponent));
