import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from 'ng2-webstorage';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Http } from '@angular/http';
import { HttpService } from './../../../shared/services/http-service';
import { Utils } from './../../../shared/services/utility';
export var EmployeeSearchComponent = (function () {
    function EmployeeSearchComponent(serviceConstants, ellipsis, translate, ls, utils, http, localeTranslateService, httpService) {
        this.serviceConstants = serviceConstants;
        this.ellipsis = ellipsis;
        this.translate = translate;
        this.ls = ls;
        this.utils = utils;
        this.http = http;
        this.localeTranslateService = localeTranslateService;
        this.httpService = httpService;
        this.openAddMode = new EventEmitter();
        this.method = 'people/search';
        this.module = 'employee';
        this.operation = 'Business/iCABSBEmployeeSearch';
        this.search = new URLSearchParams();
        this.itemsPerPage = 10;
        this.page = 1;
        this.totalItem = 11;
        this.showBranchLevel = true;
        this.showBranchNumber = true;
        this.showEmpStatus = true;
        this.showSalesType = true;
        this.loggedInBranch = '';
        this.rows = [];
        this.resetRowId = false;
        this.inputParamsBranchSearch = {
            'parentMode': '',
            'currentContractType': ''
        };
        this.servicebranch = {
            active: {
                id: this.utils.getBranchCode(),
                text: this.utils.getBranchText()
            }
        };
        this.dropDownFields = ['BranchNumber', 'BranchName'];
        this.branchLevels = [
            { text: 'Current Branch', value: 'CurrentBranch' },
            { text: 'Specific Branch', value: 'SpecificBranch' },
            { text: 'All Branches', value: 'All Branches' }
        ];
        this.employeeTypeStatus = [
            { text: 'All Employees', value: 'AllEmployees' },
            { text: 'Current Employees', value: 'CurrentEmployees' },
            { text: 'Left Employees', value: 'LeftEmployees' }
        ];
        this.salesTypes = [
            { text: 'All', value: 'All' },
            { text: 'Sales Employee', value: 'SalesEmp' },
            { text: 'Service/Sales Emp', value: 'ServiceSales' }
        ];
    }
    EmployeeSearchComponent.prototype.getCurrentPage = function (currentPage) {
        this.page = currentPage;
    };
    EmployeeSearchComponent.prototype.ngOnInit = function () {
        this.localeTranslateService.setUpTranslation();
        this.tableheading = 'Employee Search';
    };
    EmployeeSearchComponent.prototype.updateView = function (params) {
        var _this = this;
        this.showBranchLevel = false;
        this.showEmpStatus = false;
        this.showSalesType = false;
        this.showBranchNumber = false;
        this.inputParams = params || this.inputParams;
        if (!params) {
            params = this.inputParams;
        }
        if (this.inputParams && this.inputParams.showAddNew !== undefined) {
            this.showAddNew = this.inputParams.showAddNew;
        }
        this.inputParamsBranchSearch.parentMode = this.inputParams.parentMode;
        this.inputParamsBranchSearch.ContractTypeCode = this.inputParams.ContractTypeCode;
        this.inputParamsBranchSearch.businessCode = this.inputParams.businessCode || this.utils.getBusinessCode();
        this.inputParamsBranchSearch.countryCode = this.inputParams.countryCode || this.utils.getCountryCode();
        this.configurePage(this.inputParams);
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.utils.getLoggedInBranch(this.inputParams.businessCode, this.inputParams.countryCode).subscribe(function (data) {
            if (data.results && data.results[0] && data.results[0].length > 0) {
                _this.loggedInBranch = data.results[0][0].BranchNumber;
            }
            else if (data.results && data.results[1] && data.results[1].length > 0) {
                _this.loggedInBranch = data.results[1][0].BranchNumber;
            }
            else {
                _this.loggedInBranch = '';
            }
        });
        this.buildTable();
    };
    EmployeeSearchComponent.prototype.configurePage = function (params) {
        this.pageTitle = 'Employee Surname Search';
        this.parentMode = params.parentMode;
        if (this.parentMode === 'iCABSCMCustomerContactRootCauseEntry')
            this.itemsPerPage = 3;
        else
            this.itemsPerPage = 10;
        switch (this.parentMode) {
            case 'LookUp-ContractSalesEmployeeTo':
            case 'LookUp-NegSales':
            case 'LookUp-ContractSalesEmployeeReturn':
                this.negBranchNumber = params.negativeBranchNumber;
                break;
            case 'LookUp-PremiseSalesEmployee':
            case 'LookUp-PremiseSRAEmployee':
            case 'LookUp-ServiceSales':
            case 'LookUp-RemovalEmployee':
            case 'LookUp-ConvertedSales':
            case 'LookUp-LeadsService':
            case 'LookUp-LeadsSales':
            case 'LookUp-Waste':
            case 'LookUp-LeadEmployee':
                this.negBranchNumber = params.serviceBranchNumber;
                break;
            case 'LookUp-Supervisor':
            case 'LookUp-List':
            case 'LookUp-NotificationGroupEmployee':
                this.serviceBranchNumber = params.branchNumber;
                break;
            case 'LookUp-ProspectAssignTo':
                this.showBranchLevel = true;
                this.negBranchNumber = params.salesBranchNumber;
                this.serviceBranchNumber = params.branchNumber;
                this.branchNumber = params.salesBranchNumber;
                if (this.branchNumber === 0) {
                    this.branchLevelDropdown.selectedItem = 'SpecificBranch';
                }
                break;
            case 'ContactManagement':
            case 'ContactManagement-Originating':
            case 'LookUp-ServiceBranchEmployee':
                this.serviceBranchNumber = params.serviceBranchNumber;
                this.showBranchLevel = true;
                break;
            case 'ContactManagement-CallOut':
                this.serviceBranchNumber = params.ServiceBranchNumber;
                break;
            case 'CampaignEntry':
                this.showBranchLevel = true;
                this.salesTypeList.selectedItem = 'serviceSales';
                this.branchLevelDropdown.selectedItem = 'All Branches';
                break;
            case 'LookUp':
            case 'TelesalesEntry':
            case 'LookUpSendForename1':
            case 'LookUp-Service-All':
            case 'LookUp-Sales':
            case 'LookUp-ContractSalesEmployee':
            case 'LookUp-ContractSalesEmployeeReturn':
            case 'LookUp-ContractOwner':
            case 'LookUp-ServiceCoverCommissionEmployee':
            case 'AnyBranch':
            case 'LookUp-Service-Additional':
            case 'LookUpTo':
            case 'LookUp-AccountOwner':
            case 'LookUp-AllEmployee':
            case 'LookUp-iCABSCMCustomerContactRootCauseEntry':
            case 'LookUp-Telesales':
                this.showBranchLevel = true;
                this.serviceBranchNumber = params.serviceBranchNumber;
                break;
            case 'MyFilter':
                this.showBranchLevel = true;
                break;
            case 'TransferTo':
            case 'TransferTo1':
            case 'TransferTo2':
            case 'TransferTo3':
            case 'TransferTo4':
            case 'TransferTo5':
            case 'TransferTo6':
            case 'TransferTo7':
            case 'TransferTo8':
            case 'TransferTo9':
            case 'TransferTo10':
                this.showBranchLevel = true;
                break;
            case 'LookUp-Branch':
            case 'LookUp-Supervisor-All':
            case 'LookUp-Signature':
                this.branchNumber = params.BranchNumber;
                this.branchLevelDropdown.selectedItem = 'SpecificBranch';
                break;
            case 'LookUp-Occupation':
                this.occupationCode = params.OccupationCode;
                break;
            case 'LookUp-Branch-Occupation':
                this.branchNumber = params.BranchNumber;
                this.occupationCode = params.OccupationCode;
                this.branchLevelDropdown.selectedItem = 'SpecificBranch';
                break;
            case 'LookUp-PremiseBranch-Employee':
                this.branchNumber = params.NewServiceBranchNumber;
                this.branchLevelDropdown.selectedItem = 'SpecificBranch';
                break;
            case 'LookUp-ContractBranch-Employee':
                this.branchNumber = params.NewNegBranchNumber;
                this.branchLevelDropdown.selectedItem = 'SpecificBranch';
                break;
            case 'LookUp-CommissionBranch-Employee':
                this.branchNumber = params.NewNegBranchNumber;
                this.branchLevelDropdown.selectedItem = 'SpecificBranch';
                break;
            case 'LookUp-BarcodeEmployee':
                this.serviceBranchNumber = params.BranchNumber;
                break;
        }
        switch (this.parentMode) {
            case 'CampaignEntry':
            case 'LookUp-CommissionBranch-Employee':
            case 'LookUp-ContractBranch-Employee':
            case 'LookUp-PremiseBranch-Employee':
            case 'LookUp-ContractSalesEmployee':
            case 'LookUp-PremiseSalesEmployee':
            case 'LookUp-ServiceCoverCommissionEmployee':
            case 'ContractJobReport':
            case 'TransferTo':
            case 'TransferTo1':
            case 'TransferTo2':
            case 'TransferTo3':
            case 'TransferTo4':
            case 'TransferTo5':
            case 'TransferTo6':
            case 'TransferTo7':
            case 'TransferTo8':
            case 'TransferTo9':
            case 'TransferTo10':
            case 'LookUp-Sales':
            case 'LookUp-NegSales':
            case 'LookUp-ServiceSales':
            case 'LookUp-ConvertedSales':
            case 'LookUp-Commission':
            case 'LookUp-ContractSalesEmployeeTo':
            case 'LookUp-ProspectAssignTo':
            case 'LookUp-LeadsSales':
            case 'LookUp-ServiceBranchEmployee':
            case 'LookUp-ContractSalesEmployeeReturn':
                this.showSalesType = true;
                break;
            default:
                this.showSalesType = false;
        }
        this.branchLevelDropdownItem = this.branchLevelDropdown ? this.branchLevelDropdown.selectedItem : 'CurrentBranch';
    };
    EmployeeSearchComponent.prototype.onSearchClick = function () {
        this.branchLevelDropdownItem = this.branchLevelDropdown ? this.branchLevelDropdown.selectedItem : 'CurrentBranch';
        this.buildTable();
    };
    EmployeeSearchComponent.prototype.clearRowId = function () {
        this.resetRowId = true;
    };
    EmployeeSearchComponent.prototype.buildTable = function () {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.inputParams && this.inputParams.businessCode ? this.inputParams.businessCode : this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.inputParams && this.inputParams.countryCode ? this.inputParams.countryCode : this.utils.getCountryCode());
        this.empTableColumns = [];
        if (this.branchLevelDropdownItem === 'CurrentBranch') {
            this.showBranchNumber = false;
            if (this.serviceBranchNumber || this.negBranchNumber) {
                switch (this.parentMode) {
                    case 'LookUp-ContractSalesEmployeeTo':
                    case 'LookUp-NegSales':
                    case 'LookUp-ContractSalesEmployeeReturn':
                        this.search.set('BranchNumber', this.negBranchNumber ? this.negBranchNumber : '');
                        if (this.inputParams['negativeBranchNumber']) {
                            this.search.set('BranchNumber', this.inputParams['negativeBranchNumber']);
                        }
                        break;
                    case 'LookUp-PremiseSRAEmployee':
                    case 'LookUp-PremiseSalesEmployee':
                    case 'LookUp-ServiceSales':
                    case 'LookUp-ConvertedSales':
                    case 'LookUp-List':
                    case 'LookUp-NotificationGroupEmployee':
                        this.search.set('BranchNumber', this.serviceBranchNumber ? this.serviceBranchNumber : '');
                        break;
                    default:
                        this.search.set('BranchNumber', this.serviceBranchNumber ? this.serviceBranchNumber : '');
                }
            }
            else {
                this.search.set('BranchNumber', this.utils.getBranchCode());
            }
        }
        else if (this.branchLevelDropdownItem === 'SpecificBranch') {
            switch (this.parentMode) {
                case 'LookUp-Branch':
                case 'LookUp-Branch-Occupation':
                case 'LookUp-Signature':
                    this.showBranchNumber = false;
                    this.search.set('BranchNumber', this.branchNumber ? this.branchNumber : '');
                    break;
                case 'LookUp-CommissionBranch-Employee':
                case 'LookUp-ContractBranch-Employee':
                case 'LookUp-PremiseBranch-Employee':
                case 'LookUp-Branch':
                    this.showBranchNumber = false;
                    this.search.set('BranchNumber', this.branchNumber ? this.branchNumber : '');
                    break;
                case 'LookUp':
                case 'TelesalesEntry':
                case 'LookUpSendForename1':
                case 'ContactManagement':
                case 'ContactManagement-Originating':
                case 'LookUp-ServiceBranchEmployee':
                case 'LookUp-ProspectAssignTo':
                case 'AnyBranch':
                case 'LookUp-Service-All':
                case 'LookUp-Sales':
                case 'LookUp-ContractSalesEmployee':
                case 'LookupContractOwner':
                case 'LookUp-ServiceCoverCommissionEmployee':
                case 'LookUp-Supervisor-All':
                case 'LookUp-AccountOwner':
                case 'LookUp-LeadEmployee':
                case 'LookUp-AllEmployee':
                case 'TransferTo':
                case 'TransferTo1':
                case 'TransferTo2':
                case 'TransferTo3':
                case 'TransferTo4':
                case 'TransferTo5':
                case 'TransferTo6':
                case 'TransferTo7':
                case 'TransferTo8':
                case 'TransferTo9':
                case 'TransferTo10':
                case 'iCABSCMCustomerContactRootCauseEntry':
                    this.showBranchNumber = true;
                    this.search.set('BranchNumber', this.BranchSearch ? this.BranchSearch : '');
                    break;
                default:
                    this.search.set('BranchNumber', this.serviceBranchNumber ? this.serviceBranchNumber : this.utils.getBranchCode());
            }
        }
        else {
            if (this.branchLevelDropdownItem !== 'SpecificBranch') {
                this.showBranchNumber = false;
                this.branchNumber = this.loggedInBranch;
            }
            if (this.branchLevelDropdownItem === 'All Branches') {
                this.addTableColumn('Branch', 'BranchNumber');
            }
        }
        if (this.employeeSurname) {
            this.search.set('search.op.EmployeeSurname', 'CONTAINS');
            this.search.set('EmployeeSurname', this.employeeSurname);
        }
        else {
            this.search.set('EmployeeSurname', null);
        }
        if (this.parentMode === 'LookUp-Occupation') {
            this.search.set('OccupationCode', this.occupationCode);
        }
        if (this.parentMode === 'LookUp-Branch-Occupation') {
            this.search.set('OccupationCode', this.occupationCode);
        }
        if (this.parentMode !== 'Search') {
            this.search.set('EmployeeStatus', '');
            this.showEmpStatus = false;
        }
        else {
            this.showEmpStatus = true;
            switch (this.employeeStatus) {
                case 'AllEmployees':
                    this.search.set('EmployeeStatus', 'AllEmployees');
                    break;
                case 'LeftEmployees':
                    var todayDate = new Date();
                    todayDate = this.formatDate(todayDate);
                    this.search.set('EmployeeStatus', 'LeftEmployees');
                    break;
                case 'CurrentEmployees':
                    this.search.set('EmployeeStatus', '');
                    break;
                default:
                    this.search.set('EmployeeStatus', '');
            }
        }
        this.addTableColumn('Employee Code', 'EmployeeCode');
        this.addTableColumn('Employee Surname', 'EmployeeSurname', 'asc');
        this.addTableColumn('Employee Forename', 'EmployeeForename1');
        this.addTableColumn('Mobile Number', 'SMSMessageNumber');
        switch (this.parentMode) {
            case 'CampaignEntry':
            case 'LookUp-CommissionBranch-Employee':
            case 'LookUp-ContractBranch-Employee':
            case 'LookUp-PremiseBranch-Employee':
            case 'LookUp-ContractSalesEmployee':
            case 'LookUp-PremiseSalesEmployee':
            case 'LookUp-ServiceCoverCommissionEmployee':
            case 'ContractJobReport':
            case 'TransferTo':
            case 'TransferTo1':
            case 'TransferTo2':
            case 'TransferTo3':
            case 'TransferTo4':
            case 'TransferTo5':
            case 'TransferTo6':
            case 'TransferTo7':
            case 'TransferTo8':
            case 'TransferTo9':
            case 'TransferTo10':
            case 'LookUp-Sales':
            case 'LookUp-NegSales':
            case 'LookUp-ServiceSales':
            case 'LookUp-ConvertedSales':
            case 'LookUp-Commission':
            case 'LookUp-ContractSalesEmployeeTo':
            case 'LookUp-ProspectAssignTo':
            case 'LookUp-LeadsSales':
            case 'LookUp-ServiceBranchEmployee':
            case 'LookUp-ContractSalesEmployeeReturn':
                this.search.set('OccupationCode', this.occupationCode);
                this.search.set('SalesOccupation', 'TRUE');
                switch (this.selectedSalesType) {
                    case 'SalesEmp':
                        this.search.set('ServiceOccupation', 'FALSE');
                        break;
                    case 'ServiceSales':
                        this.search.set('ServiceOccupation', 'TRUE');
                        break;
                    default:
                        this.search.set('ServiceOccupation', '');
                }
                this.addTableColumn('Occupation Description', 'OccupationDesc');
                break;
            case 'LookUp-DeliveryEmployee':
            case 'LookUp-RemovalEmployee':
            case 'LookUp-ServiceVisitEmployee':
            case 'LookUp-Service':
            case 'LookUp-Service-All':
            case 'LookUp-LeadsService':
            case 'LookUp-PDALead':
            case 'LookUp-WorkListCopyFrom':
            case 'LookUp-WorkListCopyTo':
            case 'LookUp-Service-Additional':
            case 'LookUp-InstallationEmployee':
                this.search.set('ServiceOccupation', 'TRUE');
                this.addTableColumn('Occupation Description', 'OccupationDesc');
                break;
            case 'LookUp-AllEmployee':
            case 'LookUp-LeadEmployee':
                this.addTableColumn('Occupation Description', 'OccupationDesc');
                break;
            default:
                this.addTableColumn('Occupation Description', 'OccupationDesc');
                break;
        }
        if (this.parentMode === 'LookUp-Supervisor' || this.parentMode === 'LookUp-Supervisor-All') {
            this.search.set('Supervisor', 'TRUE');
        }
        else {
            this.search.set('Supervisor', '');
        }
        if (this.parentMode === 'Search') {
            this.addTableColumn('Date Left', 'DateLeft');
            this.addTableColumn('Class Type', 'ClassType');
        }
        this.search.set('search.sortby', 'EmployeeSurname');
        if (this.branchLevelDropdownItem !== 'All Branches' && this.empTableColumns[0].title === 'Branch') {
            this.empTableColumns.pop();
        }
        this.inputParams.search = this.search;
        this.inputParams.columns = this.empTableColumns;
        this.employeeTable.clearTable();
        this.employeeTable.loadTableData(this.inputParams);
    };
    EmployeeSearchComponent.prototype.selectedData = function (event) {
        var returnObj;
        var strAdditionalEmployeeNumber;
        switch (this.parentMode) {
            case 'LookUp-List':
                this.strEmployeeList = this.inputParams.EmployeeList.trim();
                if (!this.strEmployeeList) {
                    returnObj = {
                        'EmployeeCode': event.row.EmployeeCode
                    };
                }
                else {
                    returnObj = {
                        'EmployeeCode': this.strEmployeeList + ',' + event.row.EmployeeCode
                    };
                }
                break;
            case 'LookUp-String':
                this.strEmployeeString = this.inputParams.EmployeeString.trim();
                if (!this.strEmployeeString) {
                    returnObj = {
                        'EmployeeCode': event.row.EmployeeCode
                    };
                }
                else {
                    returnObj = {
                        'EmployeeCode': this.strEmployeeString + ',' + event.row.EmployeeCode
                    };
                }
                break;
            case 'Lookup-NotificationGroupEmployee':
                this.strEmployeeList = this.inputParams.NotifyContactList.trim();
                if (!this.strEmployeeList) {
                    returnObj = {
                        'EmployeeCode': event.row.EmployeeCode
                    };
                }
                else {
                    returnObj = {
                        'EmployeeCode': this.strEmployeeList + ',' + event.row.EmployeeCode
                    };
                }
                break;
            case 'LookUp-PlanningDiary':
                this.strEmployeeList = this.inputParams.EmployeeCodeList.trim();
                this.strEmployeeSurnameList = this.inputParams.EmployeeSurnameList.trim();
                if (this.strEmployeeList.slice(-1) === ',') {
                    this.strEmployeeList = this.strEmployeeList.slice(0, -1);
                }
                if (this.strEmployeeSurnameList.slice(-1) === ',') {
                    this.strEmployeeSurnameList = this.strEmployeeSurnameList.slice(0, -1);
                }
                if (!this.strEmployeeList) {
                    returnObj = {
                        'EmployeeCode': event.row.EmployeeCode,
                        'EmployeeSurName': event.row.EmployeeSurname
                    };
                }
                else {
                    returnObj = {
                        'EmployeeCode': this.strEmployeeList + ',' + event.row.EmployeeCode,
                        'EmployeeSurName': this.strEmployeeSurnameList + ',' + event.row.EmployeeSurname
                    };
                }
                break;
            case 'Search':
                returnObj = {
                    'EmployeeCode': event.row.EmployeeCode,
                    'ClassType': event.row.ClassType
                };
                break;
            case 'ContractJobReport':
                returnObj = {
                    'SalesEmployeeCode': event.row.EmployeeCode
                };
                break;
            case 'Diary':
                returnObj = {
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurName': event.row.EmployeeSurname
                };
                break;
            case 'TransferTo':
                returnObj = {
                    'TransferToEmployeeCode': event.row.EmployeeCode,
                    'TransferToEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'CampaignEntry':
                returnObj = {
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurName': event.row.EmployeeSurname
                };
                break;
            case 'ContactManagement':
                returnObj = {
                    'NextActionEmployeeCode': event.row.EmployeeCode,
                    'NextActionEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'ContactManagement-Originating':
                returnObj = {
                    'OriginatingEmployeeCode': event.row.EmployeeCode,
                    'OriginatingEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'ContactManagement-CallOut':
            case 'AnyBranch':
                returnObj = {
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp':
            case 'Search':
            case 'LookUp-Sales':
            case 'LookUp-Service':
            case 'LookUp-Service-All':
            case 'LookUp-Branch':
            case 'LookUp-Occupation':
            case 'LookUp-Branch-Occupation':
            case 'LookUp-LeadsService':
            case 'LookUp-LeadsSales':
            case 'LookUp-Waste':
            case 'LookUp-Signature':
                returnObj = {
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'TelesalesEntry':
                returnObj = {
                    'CommissionEmployeeCode': event.row.EmployeeCode,
                    'CommissionEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'LookUpSendForename1':
                returnObj = {
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname,
                    'EmployeeForename1': event.row.EmployeeForename1
                };
                break;
            case 'LookUp-Service-Additional':
                returnObj = {
                    'AddEmployeeCode': event.row.EmployeeCode,
                    'AddEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUpTo':
                returnObj = {
                    'EmployeeCodeTo': event.row.EmployeeCode,
                    'EmployeeSurnameTo': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ContractSalesEmployee':
            case 'LookUp-ContractSalesEmployeeReturn':
                returnObj = {
                    'ContractSalesEmployee': event.row.EmployeeCode,
                    'SalesEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ContractSalesEmployeeTo':
                returnObj = {
                    'ContractSalesEmployeeTo': event.row.EmployeeCode,
                    'SalesEmployeeSurnameTo': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ServiceCoverCommissionEmployee':
            case 'LookUp-ServiceBranchEmployee':
                returnObj = {
                    'ServiceSalesEmployee': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ContractOwner':
                returnObj = {
                    'ContractOwner': event.row.EmployeeCode,
                    'ContractOwnerSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-LeadEmployee':
            case 'LookUp-AllEmployee':
                returnObj = {
                    'LeadEmployee': event.row.EmployeeCode,
                    'LeadEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-PremiseSalesEmployee':
                returnObj = {
                    'PremiseSalesEmployee': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-PremiseSRAEmployee':
                returnObj = {
                    'PremiseSRAEmployee': event.row.EmployeeCode,
                    'SRAEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-AccountOwner':
                returnObj = {
                    'AccountOwner': event.row.EmployeeCode,
                    'AccountOwnerSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ServiceVisitEmployee':
                returnObj = {
                    'ServiceEmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-Supervisor-All':
                returnObj = {
                    'SupervisorEmployeeCode': event.row.EmployeeCode,
                    'SupervisorSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-Supervisor':
                returnObj = {
                    'SupervisorEmployeeCode': event.row.EmployeeCode,
                    'SupervisorSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-InstallationEmployee':
                returnObj = {
                    'InstallationEmployeeCode': event.row.EmployeeCode,
                    'InstallationEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-DeliveryEmployee':
                returnObj = {
                    'DeliveryEmployeeCode': event.row.EmployeeCode,
                    'DeliveryEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-RemovalEmployee':
                returnObj = {
                    'RemovalEmployeeCode': event.row.EmployeeCode,
                    'RemovalEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-Commission':
                returnObj = {
                    'CommissionEmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'MyFilter':
                returnObj = {
                    'MyFilterEmployeeCode': event.row.EmployeeCode
                };
                break;
            case 'LookUp-NegSales':
                returnObj = {
                    'NegotiatingSalesEmployeeCode': event.row.EmployeeCode,
                    'NegotiatingSalesEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ServiceSales':
                returnObj = {
                    'ContractOwner': event.row.EmployeeCode,
                    'ContractOwnerSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ConvertedSales':
                returnObj = {
                    'ConvertedSalesEmployeeCode': event.row.EmployeeCode,
                    'ConvertedSalesEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ProspectAssignTo':
                returnObj = {
                    'AssignToEmployeeCode': event.row.EmployeeCode,
                    'AssignToEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-StockTo':
                returnObj = {
                    'ToEmployeeCode': event.row.EmployeeCode,
                    'ToEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-StockFrom':
                returnObj = {
                    'FromEmployeeCode': event.row.EmployeeCode,
                    'FromEmployeeName': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-ToEmployee':
            case 'LookUp-WorkListCopyTo':
                returnObj = {
                    'ToEmployeeCode': event.row.EmployeeCode,
                    'ToEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-FromEmployee':
            case 'LookUp-WorkListCopyFrom':
                returnObj = {
                    'FromEmployeeCode': event.row.EmployeeCode,
                    'FromEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-Manager':
                returnObj = {
                    'BranchManagerEmployeeCode': event.row.EmployeeCode,
                    'BranchManagerEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-RegionalManager':
                returnObj = {
                    'RegionalManagerEmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-Secretary':
                returnObj = {
                    'BranchSecretaryEmployeeCode': event.row.EmployeeCode,
                    'BranchSecretaryEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-PDALead':
                returnObj = {
                    'PDALeadEmployeeCode': event.row.EmployeeCode,
                    'PDALeadEmployeeSurname': event.row.EmployeeSurname
                };
                break;
            case 'LookUp-CommissionBranch-Employee':
                returnObj = {
                    'NewCommissionEmployeeCode': event.row.EmployeeCode
                };
                break;
            case 'LookUp-ContractBranch-Employee':
                returnObj = {
                    'NewContractSalesEmployee': event.row.EmployeeCode
                };
                break;
            case 'LookUp-PremiseBranch-Employee':
                returnObj = {
                    'NewPremiseSalesEmployee': event.row.EmployeeCode
                };
                break;
            case 'Lookup-NewEmployee':
                returnObj = {
                    'NewEmployeeCode': event.row.EmployeeCode
                };
                break;
            default:
                returnObj = {
                    'EmployeeCode': event.row.EmployeeCode,
                    'EmployeeSurName': event.row.EmployeeSurname
                };
        }
        returnObj['fullObject'] = event.row;
        this.ellipsis.sendDataToParent(returnObj);
    };
    EmployeeSearchComponent.prototype.addTableColumn = function (colTitle, colKey, sortOrder, maxlength, required, columnOrder) {
        var _this = this;
        var column = {
            'title': colTitle,
            'name': colKey,
            'sort': sortOrder ? sortOrder : 'asc',
            'columnOrder': columnOrder ? columnOrder : ''
        };
        this.empTableColumns.push(column);
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(function (event) {
            if (event !== 0) {
                _this.fetchTranslationContent();
            }
        });
    };
    EmployeeSearchComponent.prototype.formatDate = function (date) {
        var d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [day, month, year].join('/');
    };
    EmployeeSearchComponent.prototype.branchLevel_onChange = function (data) {
        if (data === 'SpecificBranch') {
            this.showBranchNumber = true;
            this.BranchSearch = this.utils.getBranchCode();
            this.servicebranch.active = {
                id: this.utils.getBranchCode(),
                text: this.utils.getBranchText()
            };
            this.branchNumber = this.utils.getBranchCode();
        }
        if (data === 'CurrentBranch' || data === 'All Branches') {
            this.showBranchNumber = false;
        }
        this.branchLevelDropdownItem = data;
    };
    EmployeeSearchComponent.prototype.empStatus_onChange = function (data) {
        this.employeeStatus = data;
    };
    EmployeeSearchComponent.prototype.salesType_onChange = function (data) {
        this.selectedSalesType = data;
    };
    EmployeeSearchComponent.prototype.fetchTranslationContent = function () {
        var _this = this;
        var _loop_1 = function(i) {
            this_1.localeTranslateService.getTranslatedValue(this_1.empTableColumns[i].title, null).subscribe(function (res) {
                if (res) {
                    _this.empTableColumns[i].title = res;
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.empTableColumns.length; i++) {
            _loop_1(i);
        }
        this.localeTranslateService.getTranslatedValue(this.tableheading, 'Employee Search');
    };
    EmployeeSearchComponent.prototype.onBranchDataReceived = function (obj) {
        this.BranchSearch = obj.BranchNumber;
        this.branchNumber = obj.BranchNumber;
    };
    EmployeeSearchComponent.prototype.onAddNew = function () {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    };
    EmployeeSearchComponent.decorators = [
        { type: Component, args: [{
                    selector: 'icabs-employee-search',
                    templateUrl: 'iCABSBEmployeeSearch.html'
                },] },
    ];
    EmployeeSearchComponent.ctorParameters = [
        { type: ServiceConstants, },
        { type: EllipsisComponent, },
        { type: TranslateService, },
        { type: LocalStorageService, },
        { type: Utils, },
        { type: Http, },
        { type: LocaleTranslationService, },
        { type: HttpService, },
    ];
    EmployeeSearchComponent.propDecorators = {
        'employeeTable': [{ type: ViewChild, args: ['employeeListTable',] },],
        'branchLevelDropdown': [{ type: ViewChild, args: ['branchLevelDropdown',] },],
        'employeeStatusList': [{ type: ViewChild, args: ['EmployeeStatusDropdown',] },],
        'salesTypeList': [{ type: ViewChild, args: ['SalesTypeDropdown',] },],
        'inputParams': [{ type: Input },],
        'showAddNew': [{ type: Input },],
        'openAddMode': [{ type: Output },],
    };
    return EmployeeSearchComponent;
}());
