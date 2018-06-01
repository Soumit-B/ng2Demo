import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { BranchSearchComponent } from './iCABSBBranchSearch';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Input, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { LocalStorageService } from 'ng2-webstorage';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { Http } from '@angular/http';
import { HttpService } from './../../../shared/services/http-service';
import { Utils } from './../../../shared/services/utility';

@Component({
    selector: 'icabs-employee-search',
    templateUrl: 'iCABSBEmployeeSearch.html'
})
export class EmployeeSearchComponent implements OnInit, OnDestroy {
    @ViewChild('employeeListTable') employeeTable: TableComponent;
    @ViewChild('branchLevelDropdown') branchLevelDropdown: DropdownStaticComponent;
    @ViewChild('EmployeeStatusDropdown') employeeStatusList: DropdownStaticComponent;
    @ViewChild('SalesTypeDropdown') salesTypeList: DropdownStaticComponent;
    @ViewChild('branchDropdown') branchDropdown: BranchSearchComponent;

    @Input() public inputParams: any; // InputParamsEmployeeSearch will be passed from parent page
    @Input() showAddNew: boolean;
    @Output() openAddMode = new EventEmitter();

    public translateSubscription: Subscription;

    public selectedrowdata: any;
    public method: string = 'people/search';
    public module: string = 'employee';
    public operation: string = 'Business/iCABSBEmployeeSearch';
    public search: URLSearchParams = new URLSearchParams();

    constructor(
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private translate: TranslateService,
        private ls: LocalStorageService,
        private utils: Utils,
        private http: Http,
        private localeTranslateService: LocaleTranslationService,
        private httpService: HttpService
    ) { }

    public itemsPerPage: number = 10;
    public page: number = 1;
    public totalItem: number = 11;

    public pageTitle: string;
    public branchNumber: any;
    public employeeSurname: string;

    public showBranchLevel: boolean = true;
    public showBranchNumber: boolean = true;
    public showEmpStatus: boolean = true;
    public showSalesType: boolean = true;


    private parentMode: string;
    private negBranchNumber: string;
    private serviceBranchNumber: string;
    private occupationCode: string;
    public employeeStatus: string;
    public selectedSalesType: string;
    private loggedInBranch: string = '';

    public strEmployeeList: string;
    public strEmployeeSurnameList: string;
    public strEmployeeString: string;
    public branchLevelDropdownItem: string;
    public empTableColumns: Array<any>;
    public empTableColumnsAll: Array<any>;
    public tableheading: string;
    public rows: Array<any> = [];
    public resetRowId: boolean = false;
    public branchSubscription: Subscription;

    //Branch search
    public BranchSearch: string;
    public inputParamsBranchSearch: any = {
        'parentMode': '',
        'currentContractType': ''
    };
    public servicebranch = {
        active: {
            id: this.utils.getBranchCode(),
            text: this.utils.getBranchText()
        }
    };
    public dropDownFields: Array<string> = ['BranchNumber', 'BranchName'];

    public branchLevels: Array<any> = [
        { text: 'Current Branch', value: 'CurrentBranch' },
        { text: 'Specific Branch', value: 'SpecificBranch' },
        { text: 'All Branches', value: 'All Branches' }
    ];

    public employeeTypeStatus: Array<any> = [
        { text: 'All Employees', value: 'AllEmployees' },
        { text: 'Current Employees', value: 'CurrentEmployees' },
        { text: 'Left Employees', value: 'LeftEmployees' }
    ];

    public salesTypes: Array<any> = [
        { text: 'All', value: 'All' },
        { text: 'Sales Employee', value: 'SalesEmp' },
        { text: 'Service/Sales Emp', value: 'ServiceSales' }
    ];

    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }

    public ngOnInit(): void {
        this.localeTranslateService.setUpTranslation();
        this.tableheading = 'Employee Search';
    }

    public ngOnDestroy(): void {
        if (this.branchSubscription) {
            this.branchSubscription.unsubscribe();
        }
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    }

    public updateView(params: any): void {
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
        this.branchSubscription = this.utils.getLoggedInBranch(this.inputParams.businessCode, this.inputParams.countryCode).subscribe((data) => {
            if (data.results && data.results[0] && data.results[0].length > 0) {
                this.loggedInBranch = data.results[0][0].BranchNumber;
            } else if (data.results && data.results[1] && data.results[1].length > 0) {
                this.loggedInBranch = data.results[1][0].BranchNumber;
            } else {
                this.loggedInBranch = '';
            }
        });
        this.buildTable();
    }

    public configurePage(params: any): void {
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
                this.salesTypeList.selectedItem = 'ServiceSales';
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
            case 'iCABSCMCustomerContactRootCauseEntry':
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
    }

    public onSearchClick(): void {
        if (!this.inputParams) {
            return;
        }
        this.branchLevelDropdownItem = this.branchLevelDropdown ? this.branchLevelDropdown.selectedItem : 'CurrentBranch';

        this.buildTable();
    }

    public clearRowId(): void {
        this.resetRowId = true;
        // setTimeout(() => {
        //     this.resetRowId = false;
        // }, 100);
    }

    public buildTable(): void {
        //this.updateView(this.inputParams);
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
                        this.search.set('BranchNumber', this.negBranchNumber ? this.negBranchNumber : this.branchDropdown.active.id);
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
                        this.search.set('BranchNumber', this.serviceBranchNumber ? this.serviceBranchNumber : this.branchDropdown.active.id);
                        break;
                    default:
                        this.search.set('BranchNumber', this.serviceBranchNumber ? this.serviceBranchNumber : this.branchDropdown.active.id);
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
                    this.search.set('BranchNumber', this.branchNumber ? this.branchNumber : this.branchDropdown.active.id);
                    break;
                case 'LookUp-CommissionBranch-Employee':
                case 'LookUp-ContractBranch-Employee':
                case 'LookUp-PremiseBranch-Employee':
                case 'LookUp-Branch':
                    this.showBranchNumber = false;
                    this.search.set('BranchNumber', this.branchNumber ? this.branchNumber : this.branchDropdown.active.id);
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
                    this.search.set('BranchNumber', this.BranchSearch ? this.BranchSearch : this.branchDropdown.active.id);
                    break;
                default:
                    this.search.set('BranchNumber', this.serviceBranchNumber ? this.serviceBranchNumber : this.utils.getBranchCode());
            }
        } else {
            if (this.branchLevelDropdownItem !== 'SpecificBranch') {
                this.showBranchNumber = false;
                this.branchNumber = this.loggedInBranch;
            }
            //Branch number from session
            if (this.branchLevelDropdownItem === 'All Branches') {
                this.addTableColumn('Branch', 'BranchNumber', MntConst.eTypeInteger);
            }
        }

        if (this.employeeSurname) {
            //EmployeeSurname matches *'this.employeeSurname'+'*'
            this.search.set('search.op.EmployeeSurname', 'CONTAINS');
            this.search.set('EmployeeSurname', this.employeeSurname);
        } else {
            this.search.set('EmployeeSurname', null);
        }

        if (this.parentMode === 'LookUp-Occupation') {
            this.search.set('OccupationCode', this.occupationCode);
        }
        if (this.parentMode === 'LookUp-Branch-Occupation') {
            this.search.set('OccupationCode', this.occupationCode);
        }
        if (this.parentMode !== 'Search') {
            //this.search.set('DateLeft', '?');
            this.search.set('EmployeeStatus', '');
            this.showEmpStatus = false;
        }
        else {
            this.showEmpStatus = true;
            switch (this.employeeStatus) {
                case 'AllEmployees':
                    //this.search.set('DateLeft', '?');
                    this.search.set('EmployeeStatus', 'AllEmployees');
                    break;
                case 'LeftEmployees':
                    let todayDate = new Date();
                    todayDate = this.formatDate(todayDate);
                    //this.search.set('DateLeft', todayDate.toString());
                    //this.search.set('search.op.DateLeft', 'LE');
                    this.search.set('EmployeeStatus', 'LeftEmployees');
                    break;
                case 'CurrentEmployees':
                    this.search.set('EmployeeStatus', '');
                    break;
                default:
                    //this.search.set('DateLeft', null);
                    this.search.set('EmployeeStatus', '');
            }
        }

        this.addTableColumn('Employee Code', 'EmployeeCode', MntConst.eTypeCode);
        this.addTableColumn('Employee Surname', 'EmployeeSurname', MntConst.eTypeText, 'asc');
        this.addTableColumn('Employee Forename', 'EmployeeForename1', MntConst.eTypeText);
        this.addTableColumn('Mobile Number', 'SMSMessageNumber', MntConst.eTypeText);

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
                this.addTableColumn('Occupation Description', 'OccupationDesc', MntConst.eTypeText);
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
                this.search.set('OccupationCode', this.occupationCode);
                this.search.set('ServiceOccupation', 'TRUE');
                this.addTableColumn('Occupation Description', 'OccupationDesc', MntConst.eTypeText);
                break;
            case 'LookUp-Supervisor':
                this.search.set('Supervisor', 'TRUE');
                break;
            case 'LookUp-AllEmployee':
            case 'LookUp-LeadEmployee':
                this.search.set('OccupationCode', this.occupationCode);
                this.addTableColumn('Occupation Description', 'OccupationDesc', MntConst.eTypeText);
                break;
            default:
                this.search.set('OccupationCode', this.occupationCode);
                this.addTableColumn('Occupation Description', 'OccupationDesc', MntConst.eTypeText);
                break;
        }
        //|| this.parentMode === 'LookUp-Supervisor-All'
        // if (this.parentMode === 'LookUp-Supervisor') {
        //     this.search.set('Supervisor', 'TRUE');
        // } else {
        //     this.search.set('Supervisor', '');
        // }
        if (this.parentMode === 'Search') {
            this.addTableColumn('Date Left', 'DateLeft', MntConst.eTypeDate);
            this.addTableColumn('Class Type', 'ClassType', MntConst.eTypeText);
        }

        this.search.set('search.sortby', 'EmployeeSurname');
        //Call riTable.AddTableReturn('EmployeeForename1')
        if (this.branchLevelDropdownItem !== 'All Branches' && this.empTableColumns[0].title === 'Branch') {
            this.empTableColumns.pop();
        }

        this.inputParams.search = this.search;
        this.inputParams.columns = this.empTableColumns;

        this.employeeTable.clearTable();
        this.employeeTable.loadTableData(this.inputParams);
    }

    public selectedData(event: any): void {
        let returnObj: any;
        let strAdditionalEmployeeNumber: string;
        switch (this.parentMode) {
            case 'LookUp-List':
                // TODO set strEmployeeList value from Exact Parent Page
                this.strEmployeeList = this.inputParams.EmployeeList.trim();
                if (!this.strEmployeeList) {
                    returnObj = {
                        'EmployeeCode': event.row.EmployeeCode
                    };
                } else {
                    returnObj = {
                        'EmployeeCode': this.strEmployeeList + ',' + event.row.EmployeeCode
                    };
                }
                break;
            case 'LookUp-String':
                // TODO set strEmployeeString value from Exact Parent Page
                this.strEmployeeString = this.inputParams.EmployeeString.trim();
                if (!this.strEmployeeString) {
                    returnObj = {
                        'EmployeeCode': event.row.EmployeeCode
                    };
                } else {
                    returnObj = {
                        'EmployeeCode': this.strEmployeeString + ',' + event.row.EmployeeCode
                    };
                }
                break;
            case 'Lookup-NotificationGroupEmployee':
                // TODO set strEmployeeList value from Exact Parent Page
                this.strEmployeeList = this.inputParams.NotifyContactList.trim();
                if (!this.strEmployeeList) {
                    returnObj = {
                        'EmployeeCode': event.row.EmployeeCode
                    };
                } else {
                    returnObj = {
                        'EmployeeCode': this.strEmployeeList + ',' + event.row.EmployeeCode
                    };
                }
                break;
            case 'LookUp-PlanningDiary':
                // TODO : strEmployeeList, strEmployeeSurnameList value set from Exact ParentPage
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
                } else {
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
                //TODO: strAdditionalEmployeeNumber = vntReturnData(0) & " " & vntReturnData(2) & " " & vntReturnData(1) & " " & chr(10) & riExchange.GetParentHTMLUnknownElementAttribute("ScrComments","value")
                // Call riExchange.SetParentHTMLUnknownElementAttribute("ScrComments","value",strAdditionalEmployeeNumber)
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
            //TODO:  strAdditionalEmployeeNumber = riExchange.GetParentHTMLInputElementAttribute('EmployeeCode', 'AdditionalEmployeeNumber')
            // Call riExchange.SetParentHTMLInputValue('AddEmployeeCode' & strAdditionalEmployeeNumber, '', vntReturnData(0))
            // Call riExchange.SetParentHTMLInputValue('AddEmployeeSurname' & strAdditionalEmployeeNumber, '', vntReturnData(1))
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
    }

    private addTableColumn(colTitle: string, colKey: string, type?: any, sortOrder?: string, maxlength?: number, required?: string, columnOrder?: number): void {
        let column: Object = {
            'title': colTitle,
            'name': colKey,
            'sort': sortOrder ? sortOrder : 'asc',
            'columnOrder': columnOrder ? columnOrder : '',
            'type': type
        };
        this.empTableColumns.push(column);

        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.fetchTranslationContent();
            }
        });
    }

    public formatDate(date: Date): any {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('/');
    }

    public branchLevel_onChange(data: any): void {
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
    }

    public empStatus_onChange(data: any): void {
        this.employeeStatus = data;
    }

    public salesType_onChange(data: any): void {
        this.selectedSalesType = data;
    }

    public fetchTranslationContent(): void {
        for (let i = 0; i < this.empTableColumns.length; i++) {
            this.localeTranslateService.getTranslatedValue(this.empTableColumns[i].title, null).subscribe((res: string) => {
                if (res) {
                    this.empTableColumns[i].title = res;
                }
            });
        }
        this.localeTranslateService.getTranslatedValue(this.tableheading, 'Employee Search');
    }

    public onBranchDataReceived(obj: any): void {
        this.BranchSearch = obj.BranchNumber;
        this.branchNumber = obj.BranchNumber;
    }

    public onAddNew(): void {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    }

}
