var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { MessageConstant } from './../../../shared/constants/message.constant';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, Injector, ViewChild, EventEmitter } from '@angular/core';
import { BaseComponent } from './../../base/BaseComponent';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
export var PremiseContactChangeGridComponent = (function (_super) {
    __extends(PremiseContactChangeGridComponent, _super);
    function PremiseContactChangeGridComponent(injector) {
        _super.call(this, injector);
        this.pageId = '';
        this.controls = [
            { name: 'BranchNumber', readonly: true, disabled: true, required: true },
            { name: 'BranchName', readonly: true, disabled: true, required: false },
            { name: 'EmployeeCode', required: false },
            { name: 'EmployeeSurname', readonly: true, disabled: true, required: false }
        ];
        this.childConfigParamsCommissionEmployee = {
            'parentMode': 'LookUp'
        };
        this.curPage = 1;
        this.pageSize = 10;
        this.isRequesting = false;
        this.employeeSearchComponent = EmployeeSearchComponent;
        this.showCloseButton = true;
        this.showMessageHeader = true;
        this.showHeader = true;
        this.inputParams = {};
        this.queryParams = {
            operation: 'Service/iCABSSePremiseContactChangeGrid',
            module: 'contract-admin',
            method: 'contract-management/maintenance'
        };
        this.search = new URLSearchParams();
        this.setFocusOnEmployeeCode = new EventEmitter();
        this.pageId = PageIdentifier.ICABSSEPREMISECONTACTCHANGEGRID;
    }
    PremiseContactChangeGridComponent.prototype.ngOnInit = function () {
        var _this = this;
        _super.prototype.ngOnInit.call(this);
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.PageSize = 10;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.utils.getLoggedInBranch(this.businessCode(), this.countryCode()).subscribe(function (data) {
            if (data.results) {
                data.results.forEach(function (node) {
                    if (node && node.length > 0 && node[0].BusinessCode === _this.businessCode()) {
                        _this.branchNumber = node[0].BranchNumber;
                        _this.fetchBranchData();
                    }
                });
            }
        });
        this.setErrorCallback(this);
        this.setMessageCallback(this);
    };
    PremiseContactChangeGridComponent.prototype.lookUpRecord = function (data, maxresults) {
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        if (maxresults) {
            this.search.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        return this.httpService.lookUpRequest(this.search, data);
    };
    PremiseContactChangeGridComponent.prototype.fetchBranchData = function () {
        var _this = this;
        var data = [{
                'table': 'Branch',
                'query': { 'BusinessCode': this.utils.getBusinessCode(), 'BranchNumber': this.utils.getBranchCode() },
                'fields': ['BranchNumber', 'BranchName']
            }];
        this.lookUpRecord(data, 5).subscribe(function (e) {
            if (e['results'] && e['results'].length > 0) {
                if (e['results'][0].length > 0) {
                    _this.uiForm.controls['BranchNumber'].setValue(e['results'][0][0].BranchNumber);
                    _this.uiForm.controls['BranchName'].setValue(e['results'][0][0].BranchName);
                    _this.setFocusOnEmployeeCode.emit(true);
                    _this.buildGrid();
                    _this.riGrid_BeforeExecute();
                }
            }
            _this.setFormMode(_this.c_s_MODE_UPDATE);
        }, function (error) {
            _this.errorService.emitError(error);
        });
    };
    PremiseContactChangeGridComponent.prototype.buildGrid = function () {
        this.riGrid.Clear();
        this.riGrid.AddColumn('EmployeeCode', 'Contact', 'EmployeeCode', MntConst.eTypeCode, 6, false);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('EmployeeCode', true);
        this.riGrid.AddColumn('EmployeeName', 'Contact', 'EmployeeName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContactDate', 'Contact', 'ContactDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ContactDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContactDate', true);
        this.riGrid.AddColumn('CustomerName', 'Contact', 'CustomerName', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('ContractNumber', 'Contact', 'ContractNumber', MntConst.eTypeCode, 8);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumn('PremiseNumber', 'Contact', 'PremiseNumber', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('OldName', 'Contact', 'OldName', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('NewName', 'Contact', 'NewName', MntConst.eTypeText, 30);
        this.riGrid.AddColumn('Accept', 'Contact', 'Accept', MntConst.eTypeButton, 10);
        this.riGrid.AddColumn('Reject', 'Contact', 'Reject', MntConst.eTypeButton, 10);
        this.riGrid.Complete();
    };
    PremiseContactChangeGridComponent.prototype.riGrid_BeforeExecute = function () {
        var _this = this;
        var gridParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('BranchNumber', this.getControlValue('BranchNumber'));
        gridParams.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        var sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(function (data) {
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                _this.messageModal.show(data, false);
            }
            else {
                _this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                _this.totalRecords = data.pageData ? data.pageData.lastPageNumber * _this.pageSize : 1;
                _this.riGrid.Update = true;
                _this.riGrid.UpdateBody = true;
                _this.riGrid.UpdateHeader = true;
                _this.riGrid.Execute(data);
            }
        }, function (error) {
            _this.messageModal.show(error, false);
            _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
        });
    };
    PremiseContactChangeGridComponent.prototype.riGrid_AfterExecute = function (event) {
        var rowIndex = 0;
        if (this.riGrid.HTMLGridBody.children[rowIndex]) {
            if (this.riGrid.HTMLGridBody.children[rowIndex].children[8]) {
                this.selectedRowFocus(this.riGrid.HTMLGridBody.children[rowIndex].children[8]);
            }
        }
    };
    PremiseContactChangeGridComponent.prototype.riGrid_BodyOnKeyDown = function (event) {
        switch (event.keyCode) {
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
        }
    };
    PremiseContactChangeGridComponent.prototype.selectedRowFocus = function (rsrcElement) {
        var oTR = rsrcElement.parentElement.parentElement.parentElement;
        this.attributes.PremiseContactChangeRowID = rsrcElement.getAttribute('rowid');
        this.attributes.Row = oTR.sectionRowIndex;
        rsrcElement.focus();
    };
    PremiseContactChangeGridComponent.prototype.riGrid_BodyOnClick = function (event) {
        var _this = this;
        this.selectedRowFocus(event.srcElement);
        if (this.riGrid.CurrentColumnName === 'Accept' || this.riGrid.CurrentColumnName === 'Reject') {
            this.ajaxSource.next(this.ajaxconstant.START);
            var formData = {};
            formData['Function'] = this.riGrid.CurrentColumnName;
            formData['PremiseContactChangeRowID'] = this.attributes.PremiseContactChangeRowID;
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search, formData).subscribe(function (e) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                if (e['status'] === 'failure') {
                    _this.errorService.emitError(e['oResponse']);
                }
                else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        _this.errorService.emitError(e.oResponse['errorMessage']);
                    }
                    else if (e['errorMessage']) {
                        _this.messageModal.show({ msg: (e.oResponse['errorMessage']), title: 'Message' }, false);
                    }
                    else {
                        _this.refresh();
                    }
                }
            }, function (error) {
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                _this.errorService.emitError(error);
            });
        }
    };
    PremiseContactChangeGridComponent.prototype.getCurrentPage = function (currentPage) {
        this.curPage = currentPage.value;
        this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    };
    PremiseContactChangeGridComponent.prototype.refresh = function () {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    PremiseContactChangeGridComponent.prototype.riGrid_Sort = function (event) {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    };
    PremiseContactChangeGridComponent.prototype.showErrorModal = function (msg) {
        this.errorModal.show({ msg: msg, title: 'Error' }, false);
    };
    PremiseContactChangeGridComponent.prototype.showMessageModal = function (msg) {
        this.messageModal.show({ msg: msg, title: 'Message' }, false);
    };
    PremiseContactChangeGridComponent.prototype.onEmployeeChange = function () {
        var _this = this;
        var empCode = this.getControlValue('EmployeeCode');
        if (empCode) {
            this.ajaxSource.next(this.ajaxconstant.START);
            var searchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            searchParams.set(this.serviceConstants.Action, '6');
            searchParams.set('Function', 'GetEmployeeSurName');
            searchParams.set('EmployeeCode', empCode);
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams).subscribe(function (data) {
                if (data.ErrorMessageDesc !== '') {
                    _this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }
                else {
                    _this.setControlValue('EmployeeCode', '');
                    _this.setControlValue('EmployeeSurname', '');
                    _this.messageService.emitMessage(MessageConstant.Message.RecordNotFound);
                    _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
                }
            }, function (error) {
                _this.setControlValue('EmployeeCode', '');
                _this.setControlValue('EmployeeSurname', '');
                _this.errorService.emitError(error);
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
        else {
            this.setControlValue('EmployeeCode', '');
            this.setControlValue('EmployeeSurname', '');
        }
    };
    PremiseContactChangeGridComponent.prototype.onReceivingEmployeeResult = function (event) {
        this.uiForm.controls['EmployeeCode'].setValue(event.EmployeeCode);
        this.uiForm.controls['EmployeeSurname'].setValue(event.EmployeeSurname);
    };
    PremiseContactChangeGridComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSSePremiseContactChangeGrid.html'
                },] },
    ];
    PremiseContactChangeGridComponent.ctorParameters = [
        { type: Injector, },
    ];
    PremiseContactChangeGridComponent.propDecorators = {
        'riGrid': [{ type: ViewChild, args: ['riGrid',] },],
        'messageModal': [{ type: ViewChild, args: ['messageModal',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
        'premiseContactChangePagination': [{ type: ViewChild, args: ['premiseContactChangePagination',] },],
    };
    return PremiseContactChangeGridComponent;
}(BaseComponent));
