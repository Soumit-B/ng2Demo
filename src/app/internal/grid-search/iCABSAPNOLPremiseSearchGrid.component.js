var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
import { Router } from '@angular/router';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var PNOLPremiseSearchGridComponent = (function (_super) {
    __extends(PNOLPremiseSearchGridComponent, _super);
    function PNOLPremiseSearchGridComponent(injector, _router) {
        _super.call(this, injector);
        this._router = _router;
        this.queryParams = {
            operation: 'Application/iCABSAPNOLPremiseSearchGrid',
            module: 'pnol',
            method: 'extranets-connect/search',
            search: ''
        };
        this.controls = [
            { name: 'ContractNumber', readonly: true, disabled: true, required: false },
            { name: 'PremiseName', readonly: true, disabled: true, required: false },
            { name: 'AccountNumber', readonly: true, disabled: false, required: false },
            { name: 'ContractName', readonly: true, disabled: false, required: false },
            { name: 'PremiseAddress', readonly: true, disabled: true, required: false },
            { name: 'SearchPostcode', readonly: true, disabled: false, required: false },
            { name: 'PremiseAddressLine1', readonly: true, disabled: true, required: false },
            { name: 'PremiseAddressLine2', readonly: true, disabled: true, required: false },
            { name: 'PremiseAddressLine3', readonly: true, disabled: true, required: false },
            { name: 'PremiseAddressLine4', readonly: true, disabled: true, required: false },
            { name: 'PremiseAddressLine5', readonly: true, disabled: true, required: false },
            { name: 'PremisePostcode', readonly: true, disabled: true, required: false }
        ];
        this.pageId = '';
        this.pageSize = 10;
        this.currentPage = 1;
        this.inputParams = {};
        this.isEllipsis = false;
        this.modalConfig = {
            backdrop: 'static',
            keyboard: true
        };
        this.accountSearchComponent = AccountSearchComponent;
        this.showHeader = true;
        this.isAccountEllipsisDisabled = false;
        this.inputParamsAccount = {
            'parentMode': 'LookUp',
            'showAddNew': false,
            'businessCode': this.businessCode(),
            'countryCode': this.countryCode(),
            'showAddNewDisplay': false,
            'showCountryCode': false,
            'showBusinessCode': false,
            'searchValue': ''
        };
        this.pageId = PageIdentifier.ICABSAPNOLPREMISESEARCHGRID;
        this.DI = injector;
    }
    PNOLPremiseSearchGridComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'myRentokil Premises Search';
        this.window_onload();
        this.accountSearchComponent = AccountSearchComponent;
    };
    PNOLPremiseSearchGridComponent.prototype.updateView = function (params) {
        if (!params) {
            params = this.inputParams;
        }
        this.ellipsis = this.DI.get(EllipsisComponent);
        this.ellipsis.childConfigParams = params;
        this.isEllipsis = this.ellipsis.childConfigParams['isEllipsis'];
        this.parentMode = '';
        this.parentMode = this.ellipsis.childConfigParams['parentMode'];
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.ellipsis.childConfigParams['AccountNumber']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.ellipsis.childConfigParams['ContractNumber']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.ellipsis.childConfigParams['ContractName']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SearchPostcode', this.ellipsis.childConfigParams['SearchPostcode']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.ellipsis.childConfigParams['PremiseName']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine1', this.ellipsis.childConfigParams['PremiseAddressLine1']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine2', this.ellipsis.childConfigParams['PremiseAddressLine2']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine3', this.ellipsis.childConfigParams['PremiseAddressLine3']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine4', this.ellipsis.childConfigParams['PremiseAddressLine4']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine5', this.ellipsis.childConfigParams['PremiseAddressLine5']);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremisePostcode', this.ellipsis.childConfigParams['PremisePostcode']);
        this.setPremiseAddress();
        this.buildGrid();
        this.riGrid_BeforeExecute();
    };
    PNOLPremiseSearchGridComponent.prototype.window_onload = function () {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = this.pageSize;
        this.riGrid.Update = true;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SearchPostcode', this.riExchange.getParentHTMLValue('SearchPostcode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine1', this.riExchange.getParentHTMLValue('PremiseAddressLine1'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine2', this.riExchange.getParentHTMLValue('PremiseAddressLine2'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine3', this.riExchange.getParentHTMLValue('PremiseAddressLine3'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine4', this.riExchange.getParentHTMLValue('PremiseAddressLine4'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseAddressLine5', this.riExchange.getParentHTMLValue('PremiseAddressLine5'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremisePostcode', this.riExchange.getParentHTMLValue('PremisePostcode'));
        this.setPremiseAddress();
    };
    PNOLPremiseSearchGridComponent.prototype.setPremiseAddress = function () {
        if (this.getControlValue('PremiseAddressLine1'))
            this.setControlValue('PremiseAddress', (this.getControlValue('PremiseAddressLine1') + '\n'));
        if (this.getControlValue('PremiseAddressLine2'))
            this.setControlValue('PremiseAddress', (this.getControlValue('PremiseAddress') + this.getControlValue('PremiseAddressLine2') + '\n'));
        if (this.getControlValue('PremiseAddressLine3'))
            this.setControlValue('PremiseAddress', (this.getControlValue('PremiseAddress') + this.getControlValue('PremiseAddressLine3') + '\n'));
        if (this.getControlValue('PremiseAddressLine4'))
            this.setControlValue('PremiseAddress', (this.getControlValue('PremiseAddress') + this.getControlValue('PremiseAddressLine4') + '\n'));
        if (this.getControlValue('PremiseAddressLine5'))
            this.setControlValue('PremiseAddress', (this.getControlValue('PremiseAddress') + this.getControlValue('PremiseAddressLine5') + '\n'));
        if (this.getControlValue('PremisePostcode'))
            this.setControlValue('PremiseAddress', (this.getControlValue('PremiseAddress') + this.getControlValue('PremisePostcode') + '\n'));
    };
    PNOLPremiseSearchGridComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('GridContractNumber', 'GridContractNumber', 'GridContractNumber', MntConst.eTypeCode, 12);
        this.riGrid.AddColumnAlign('GridContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNumber', 'PremiseNumber', 'PremiseNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseName', 'PremiseName', 'PremiseName', MntConst.eTypeText, 40);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('GridAddress', 'GridAddress', 'GridAddress', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('GridPostcode', 'GridPostcode', 'GridPostcode', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('PortfolioStatus', 'PortfolioStatus', 'PortfolioStatus', MntConst.eTypeText, 15);
        this.riGrid.AddColumn('PNOLSiteRef', 'PNOLSiteRef', 'PNOLSiteRef', MntConst.eTypeCode, 16);
        this.riGrid.AddColumn('PNOLiCABSLevel', 'PNOLiCABSLevel', 'PNOLiCABSLevel', MntConst.eTypeCode, 4);
        this.riGrid.AddColumn('MatchType', 'MatchType', 'MatchType', MntConst.eTypeText, 12);
        this.riGrid.AddColumnOrderable('GridContractNumber', true);
        this.riGrid.AddColumnOrderable('PremiseName', true);
        this.riGrid.AddColumnOrderable('GridAddress', true);
        this.riGrid.AddColumnOrderable('GridPostcode', true);
        this.riGrid.AddColumnOrderable('PNOLSiteRef', true);
        this.riGrid.Complete();
    };
    PNOLPremiseSearchGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('LanguageCode', this.riExchange.LanguageCode());
        gridParams.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'));
        gridParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        gridParams.set('ContractName', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'));
        gridParams.set('SearchPostcode', this.riExchange.riInputElement.GetValue(this.uiForm, 'SearchPostcode'));
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, '4130730');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.errorMessage) {
                return;
            }
            _this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
            _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
            if (_this.currentPage === data.pageData.lastPageNumber) {
                _this.tdMaxMessage = 'Max Records Read';
            }
            else {
                _this.tdMaxMessage = '';
            }
            _this.riGrid.Update = true;
            _this.riGrid.UpdateBody = true;
            _this.riGrid.UpdateHeader = true;
            _this.riGrid.Execute(data);
        }, function (error) {
            _this.logger.log('Error', error);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PNOLPremiseSearchGridComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    PNOLPremiseSearchGridComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    PNOLPremiseSearchGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.currentPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    PNOLPremiseSearchGridComponent.prototype.riGrid_AfterExecute = function () {
    };
    PNOLPremiseSearchGridComponent.prototype.onAccountDataReceived = function (data) {
        if (data) {
            this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
        }
    };
    PNOLPremiseSearchGridComponent.prototype.selectedRowFocus = function (rsrcElement) {
        rsrcElement.select();
        rsrcElement.focus();
    };
    PNOLPremiseSearchGridComponent.prototype.tbodyPNOLPremiseSearch_onClick = function (event) {
        var parentMode = '';
        var objToParent = {};
        var vAddress;
        switch (this.riGrid.CurrentColumnName) {
            case 'GridAddress':
                vAddress = this.riGrid.Details.GetAttribute('PNOLSiteRef', 'AdditionalProperty').split('|');
                this.riExchange.setParentAttributeValue('PremiseAddressLine1', vAddress[0]);
                this.riExchange.setParentAttributeValue('PremiseAddressLine2', vAddress[1]);
                this.riExchange.setParentAttributeValue('PremiseAddressLine3', vAddress[2]);
                this.riExchange.setParentAttributeValue('PremiseAddressLine4', vAddress[3]);
                this.riExchange.setParentAttributeValue('PremiseAddressLine5', vAddress[4]);
                this.riExchange.setParentAttributeValue('PremisePostcode', vAddress[5]);
                this.riExchange.setParentAttributeValue('PNOLSiteRef', this.riGrid.Details.GetValue('PNOLSiteRef'));
                this.riExchange.setParentAttributeValue('PNOLiCABSLevel', this.riGrid.Details.GetValue('PNOLiCABSLevel'));
                objToParent.PremiseAddressLine1 = vAddress[0];
                objToParent.PremiseAddressLine2 = vAddress[1];
                objToParent.PremiseAddressLine3 = vAddress[2];
                objToParent.PremiseAddressLine4 = vAddress[3];
                objToParent.PremiseAddressLine5 = vAddress[4];
                objToParent.PremisePostcode = vAddress[5];
                objToParent.PNOLSiteRef = this.riGrid.Details.GetValue('PNOLSiteRef');
                objToParent.PNOLiCABSLevel = this.riGrid.Details.GetValue('PNOLiCABSLevel');
                if (this.isEllipsis) {
                    this.ellipsis.sendDataToParent(objToParent);
                }
                break;
            case 'PNOLSiteRef':
                this.riExchange.setParentAttributeValue('PNOLSiteRef', this.riGrid.Details.GetValue('PNOLSiteRef'));
                this.riExchange.setParentAttributeValue('PNOLiCABSLevel', this.riGrid.Details.GetValue('PNOLiCABSLevel'));
                objToParent.PNOLSiteRef = this.riGrid.Details.GetValue('PNOLSiteRef');
                objToParent.PNOLiCABSLevel = this.riGrid.Details.GetValue('PNOLiCABSLevel');
                if (this.isEllipsis) {
                    this.ellipsis.sendDataToParent(objToParent);
                }
                break;
        }
    };
    PNOLPremiseSearchGridComponent.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
    };
    PNOLPremiseSearchGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSAPNOLPremiseSearchGrid.html'
                },] },
    ];
    PNOLPremiseSearchGridComponent.ctorParameters = [
        { type: Injector, },
        { type: Router, },
    ];
    PNOLPremiseSearchGridComponent.propDecorators = {
        'SOPremiseSearch': [{ type: ViewChild, args: ['SOPremiseSearch',] },],
        'SOPremiseSearchPagination': [{ type: ViewChild, args: ['SOPremiseSearchPagination',] },],
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
    };
    return PNOLPremiseSearchGridComponent;
}(BaseComponent));
