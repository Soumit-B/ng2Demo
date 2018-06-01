var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { MessageConstant } from './../../../shared/constants/message.constant';
export var BranchServiceAreaSearchComponent = (function (_super) {
    __extends(BranchServiceAreaSearchComponent, _super);
    function BranchServiceAreaSearchComponent(injector, ellipsis) {
        _super.call(this, injector);
        this.ellipsis = ellipsis;
        this.pageId = '';
        this.tServiceBranch = true;
        this.branchdropDownDisabled = false;
        this.inputParamsBranch = {};
        this.negBranchNumberSelected = {
            id: '',
            text: ''
        };
        this.inputparams = {};
        this.method = 'service-delivery/search';
        this.module = 'service';
        this.operation = 'Business/iCABSBBranchServiceAreaSearch';
        this.controls = [
            { name: 'ServiceBranchNumber' },
            { name: 'BranchName' },
            { name: 'EmployeeCode' }
        ];
        this.columns = [
            { title: 'Code', name: 'BranchServiceAreaCode' },
            { title: 'Description', name: 'BranchServiceAreaDesc' },
            { title: 'Employee', name: 'EmployeeCode' },
            { title: 'Employee Name', name: 'EmployeeSurname' }
        ];
        this.pageId = PageIdentifier.ICABSBBRANCHSERVICEAREASEARCH;
    }
    BranchServiceAreaSearchComponent.prototype.ngOnInit = function () {
        _super.prototype.ngOnInit.call(this);
        this.pageTitle = 'Service Area Search';
        this.inputparams.method = this.method;
        this.inputparams.module = this.module;
        this.inputparams.operation = this.operation;
    };
    BranchServiceAreaSearchComponent.prototype.updateView = function () {
        this.window_onload();
        this.createColumnsLists();
        this.AreaSearch();
    };
    BranchServiceAreaSearchComponent.prototype.onBranchDataReceived = function (data) {
        this.setControlValue('ServiceBranchNumber', data.BranchNumber);
        this.setControlValue('BranchName', data.BranchName);
        this.AreaSearch();
    };
    BranchServiceAreaSearchComponent.prototype.window_onload = function () {
        this.parentMode = this.ellipsis.childConfigParams['parentMode'];
        switch (this.parentMode) {
            case 'LookUp-PlanVisit':
            case 'LookUp-List':
            case 'LookUp-ServiceEngineer':
                this.setControlValue('ServiceBranchNumber', this.ellipsis.childConfigParams['BranchNumberServiceBranchNumber']);
                this.setControlValue('BranchName', this.ellipsis.childConfigParams['BranchName']);
                this.negBranchNumberSelected = {
                    id: this.getControlValue('ServiceBranchNumber'),
                    text: this.getControlValue('ServiceBranchNumber') + ' - ' + this.getControlValue('BranchName')
                };
                this.tServiceBranch = true;
                break;
            case 'LookUp-SC':
            case 'LookUp-SOPSC':
            case 'ContractJobReport':
            case 'LookUp':
            case 'LookUp-Waste':
            case 'LookUp-FixedPricedJob':
            case 'LookUp-VisitPattern':
                this.setControlValue('ServiceBranchNumber', this.ellipsis.childConfigParams['ServiceBranchNumber']);
                this.setControlValue('BranchName', this.ellipsis.childConfigParams['BranchName']);
                this.negBranchNumberSelected = {
                    id: this.getControlValue('ServiceBranchNumber'),
                    text: this.getControlValue('ServiceBranchNumber') + ' - ' + this.getControlValue('BranchName')
                };
                this.tServiceBranch = true;
                break;
            case 'LookUp-Employee':
            case 'LookUp-SCDisplay':
                this.setControlValue('ServiceBranchNumber', this.ellipsis.childConfigParams['ServiceBranchNumber']);
                this.tServiceBranch = false;
                break;
            case 'LookUp-FB':
                this.setControlValue('ServiceBranchNumber', this.ellipsis.childConfigParams['FBEVBranchServiceAreaCode']);
                this.tServiceBranch = true;
                break;
            default:
                this.tServiceBranch = false;
                break;
        }
        if (this.parentMode === 'LookUp' || this.parentMode === 'LookUp-Waste') {
            this.branchdropDownDisabled = true;
        }
        else {
            this.branchdropDownDisabled = false;
        }
    };
    BranchServiceAreaSearchComponent.prototype.AreaSearch = function () {
        var _this = this;
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('BranchServiceAreaCode', '');
        switch (this.parentMode) {
            case 'LookUp-SC':
            case 'LookUp-VisitPattern':
            case 'LookUp-FixedPricedJob':
            case 'LookUp-SOPSC':
            case 'ContractJobReport':
            case 'LookUp-PlanVisit':
            case 'LookUp-Employee':
            case 'LookUp-List':
            case 'LookUp-Waste':
            case 'LookUp-SCDisplay':
                this.search.set('BranchNumber', this.getControlValue('ServiceBranchNumber'));
                break;
            default:
                this.search.set('BranchNumber', this.utils.getBranchCode());
                break;
        }
        if (this.parentMode === 'LookUp-Employee') {
            this.setControlValue('EmployeeCode', this.ellipsis.childConfigParams['EmployeeCode']);
            this.search.set('EmployeeCode', this.getControlValue('EmployeeCode'));
        }
        else {
            this.search.set('EmployeeCode', '');
        }
        if (this.parentMode === 'LookUp-DespatchGrid') {
            this.search.set('MultiBranchArea', 'True');
        }
        if (this.parentMode !== 'LookUp-All' && this.parentMode !== 'Search') {
            this.search.set('LiveServiceArea', 'Yes');
        }
        this.inputparams.columns = [];
        this.inputparams.columns = this.columns;
        this.inputparams.search = this.search;
        if (this.parentMode !== 'LookUp-AnnualCalendar') {
            this.BranchServiceAreaTable.loadTableData(this.inputparams);
        }
        else {
            this.postsearch = this.getURLSearchParamObject();
            this.postsearch.set(this.serviceConstants.Action, '6');
            this.inputparams.postsearch = this.postsearch;
            var formdata = {};
            formdata['Function'] = 'GetBranchServiceArea';
            formdata['LoggedInBranch'] = this.utils.getBranchCode();
            formdata['ContractNumber'] = this.ellipsis.childConfigParams['ContractNumber'];
            formdata['PremiseNumber'] = this.ellipsis.childConfigParams['PremiseNumber'];
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.method, this.module, this.operation, this.inputparams.postsearch, formdata)
                .subscribe(function (data) {
                if (data.hasOwnProperty('errorMessage')) {
                    _this.errorModal.show({ msg: data.errorMessage, title: MessageConstant.Message.ErrorTitle }, false);
                }
                else {
                    _this.search.set('BranchServiceAreaCode', data.BranchServiceAreaCode);
                    _this.inputparams.search = _this.search;
                    _this.BranchServiceAreaTable.loadTableData(_this.inputparams);
                }
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            }, function (error) {
                _this.search.set('BranchServiceAreaCode', '');
                _this.ajaxSource.next(_this.ajaxconstant.COMPLETE);
            });
        }
    };
    BranchServiceAreaSearchComponent.prototype.onSearchClick = function () {
        this.AreaSearch();
    };
    BranchServiceAreaSearchComponent.prototype.createColumnsLists = function () {
        this.columns = [{ title: 'Code', name: 'BranchServiceAreaCode' },
            { title: 'Description', name: 'BranchServiceAreaDesc' },
            { title: 'Employee', name: 'EmployeeCode' },
            { title: 'Employee Name', name: 'EmployeeSurname' }
        ];
        if (this.parentMode === 'LookUp-All' || this.parentMode === 'Search') {
            this.columns.push({ title: 'Live', name: 'LiveServiceArea', type: 'eTypeCheckBox' });
        }
    };
    BranchServiceAreaSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        switch (this.parentMode) {
            case 'ContractJobReport':
                returnObj = {
                    'ServiceAreaCode': event.row.BranchServiceAreaCode
                };
                break;
            case 'LookUp':
            case '"LookUp-All':
            case 'LookUp-SC':
            case 'LookUp-SOPSC':
            case 'LookUp-PlanVisit':
            case 'LookUp-UpdateParent':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
            case 'LookUp-VisitPattern':
                break;
            case 'LookUp-Waste':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'EmployeeCode': event.row.EmployeeCode
                };
                break;
            case 'LookUp-Employee':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode
                };
                break;
            case 'LookUp-To':
                returnObj = {
                    'BranchServiceAreaCodeTo': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDescTo': event.row.BranchServiceAreaDesc
                };
                break;
            case 'LookUp-ToEmp':
                returnObj = {
                    'BranchServiceAreaCodeTo': event.row.BranchServiceAreaCode,
                    'EmployeeSurnameTo': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-Emp':
            case 'LookUp-Emp-UpdateParent':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ServiceEmp':
            case 'LookUp-FixedPricedJob':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-GroupVisitEntry':
            case 'LookUp-UnreturnedConsignmentNotes':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-SVBCTEmp':
                returnObj = {
                    'SVBCTServiceAreaCode': event.row.BranchServiceAreaCode,
                    'SVBCTServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
            case 'LookUp-PlanEmp':
                returnObj = {
                    'BranchServiceAreaPlan': event.row.BranchServiceAreaCode,
                    'PlanEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'GeneralSearch-Lookup':
                returnObj = {
                    'SearchValue': event.row.BranchServiceAreaCode
                };
                break;
            case 'LookUp-List':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-EmpManpowerList':
            case 'LookUp-PlanningDiary':
            case 'LookUp-EmpList':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ServiceEngineer':
                returnObj = {
                    'EngineerServiceAreaCode': event.row.BranchServiceAreaCode,
                    'EngineerServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
            case 'LookUp-DespatchGrid':
                returnObj = {
                    'BranchServiceAreaCodeChange': event.row.BranchServiceAreaCode,
                    'EmployeeSurnameChange': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-AssignSADespatchGrid':
                returnObj = {
                    'AssignServiceArea': event.row.BranchServiceAreaCode,
                    'AssignServiceEmployee': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-SCDisplay':
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc,
                    'ScheduleEmployeeCode': event.row.EmployeeCode,
                    'ScheduleEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-FB':
                returnObj = {
                    'FBEVBranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'FBEVBranchServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
            default:
                returnObj = {
                    'BranchServiceAreaCode': event.row.BranchServiceAreaCode,
                    'BranchServiceAreaDesc': event.row.BranchServiceAreaDesc
                };
                break;
        }
        this.ellipsis.sendDataToParent(returnObj);
    };
    BranchServiceAreaSearchComponent.decorators = [
        { type: Component, args: [{
                    templateUrl: 'iCABSBBranchServiceAreaSearch.html'
                },] },
    ];
    BranchServiceAreaSearchComponent.ctorParameters = [
        { type: Injector, },
        { type: EllipsisComponent, },
    ];
    BranchServiceAreaSearchComponent.propDecorators = {
        'BranchServiceAreaTable': [{ type: ViewChild, args: ['BranchServiceAreaTable',] },],
        'errorModal': [{ type: ViewChild, args: ['errorModal',] },],
    };
    return BranchServiceAreaSearchComponent;
}(BaseComponent));
