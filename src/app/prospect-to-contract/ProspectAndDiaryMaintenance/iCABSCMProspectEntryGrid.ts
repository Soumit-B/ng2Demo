import { URLSearchParams } from '@angular/http';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { EmployeeSearchComponent } from './../../internal/search/iCABSBEmployeeSearch';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSCMProspectEntryGrid.html'
})

export class ProspectEntryGridComponent extends BaseComponent implements OnInit {
    @ViewChild('riGrid') riGrid: GridComponent;
    @ViewChild('riPagination') riPagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('employeeCodeEllipsis') employeeCodeEllipsis: EllipsisComponent;
    public pageId: string = '';
    public pageTitle: string = '';

    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalRecords: number = 0;
    public maxColumn: number = 6;
    public search: URLSearchParams;
    public inputParams: any = {};
    public isRunning: boolean = true;
    public isRequesting: boolean = true;
    public gridSortHeaders: any[] = [];
    public headerClicked: string = '';
    public sortType: string = 'ASC';

    public ellipsisConfig = {
        EmployeeCode: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': false,
                'countryCode': '',
                'businessCode': '',
                'negativeBranchNumber': '',
                'negBranchNumber': '',
                'serviceBranchNumber': '',
                'branchNumber': '',
                'salesBranchNumber': '',
                'OccupationCode': '',
                'NewServiceBranchNumber': '',
                'NewNegBranchNumber': '',
                action: 0
            },
            modalConfig: '',
            contentComponent: EmployeeSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    public dropdownConfig = {
        branchSearch: {
            isDisabled: false,
            inputParams: {},
            selected: { id: '', text: '' }
        }
    };

    public datePickerConfig = {
        ProcessDate: {
            isDisabled: false,
            isRequired: false,
            value: null
        }
    };

    public showErrorHeader = true;
    public showMessageHeader = true;
    public fieldRequired: any = {
        'BranchNumber': false
    };

    public vOriginCode: string = '03';
    public vURLParam: string = '<Confirm>';
    public validateProperties: Array<any> = [];
    public muleConfig = {
        method: 'prospect-to-contract/maintenance',
        module: 'prospect',
        operation: 'ContactManagement/iCABSCMProspectEntryGrid',
        contentType: 'application/x-www-form-urlencoded'
    };

    public controls = [
        { name: 'ProspectNumber', readonly: false, disabled: false, required: false },
        { name: 'EmployeeCode', readonly: true, disabled: false, required: false },
        { name: 'EmployeeSurname', readonly: false, disabled: true, required: false },
        { name: 'BranchNumber', readonly: false, disabled: false, required: false },
        { name: 'BranchName', readonly: true, disabled: true, required: false },
        { name: 'ProcessDateSelect', value: 'DateFrom', readonly: true, disabled: false, required: false },
        { name: 'ProcessDate', readonly: false, disabled: false, required: false },
        { name: 'StatusSelect', value: 'all', readonly: true, disabled: false, required: false }
    ];



    constructor(injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageId = PageIdentifier.ICABSCMPROSPECTENTRYGRID;
        this.pageTitle = 'National Accout Job Search Filter';
        this.utils.setTitle(this.pageTitle);
        this.getValidateProperties();
        this.window_onload();
    };

    public window_onload(): any {

        this.riExchange.riInputElement.Disable(this.uiForm, 'EmployeeSurname');

        if (this.parentMode === 'SMSMessagesEmployee') {
            let empCode = this.riExchange.getParentHTMLValue('EmployeeCode');
            this.uiForm.controls['EmployeeCode'].setValue(empCode ? empCode : '');
            let empSurName = this.riExchange.getParentHTMLValue('EmployeeSurname');
            this.uiForm.controls['EmployeeSurname'].setValue(empSurName ? empSurName : '');
        }

        if (this.riExchange.URLParameterContains('Confirm')) {
            this.vOriginCode = '03';
            this.vURLParam = '<Confirm>';
        }

        if (this.riExchange.URLParameterContains('Prospect')) {
            this.vOriginCode = '02';
            this.vURLParam = '<Prospect>';
        }

        if (this.riExchange.URLParameterContains('NatAxJob')) {
            this.vOriginCode = '03';
            this.vURLParam = '<NatAxJob>';
        }

        this.loadProspectStatusTypes();

    }

    public ttStatusSelect: any[] = [];
    public loadProspectStatusTypes(): any {

        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');

        let postObj: any = {};
        postObj.Function = 'GetProspectStatusTypes';
        postObj.LanguageCode = this.riExchange.LanguageCode();

        this.ttStatusSelect = [];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
            .subscribe(
            (e) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    let statusTypes = e.StatusTypes || '';
                    let statusDescs = e.StatusDescs || '';
                    let charStr = String.fromCharCode(10);
                    let valArray = statusTypes.split(charStr);
                    let descArray = statusDescs.split(charStr);
                    if (valArray) {
                        let selectedValue = false;
                        for (let i = 0; i < valArray.length; i++) {
                            this.ttStatusSelect.push({ value: valArray[i], text: descArray[i] });
                            if (valArray[i] === '01') {
                                selectedValue = true;
                            }
                        }

                        if (selectedValue) {
                            this.uiForm.controls['StatusSelect'].setValue('01');
                        }
                    }

                    this.applyGridFilter();
                    this.buildGrid();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });
    }

    public modalHidden(): void {
        //TODO:
    }

    // public onSelectedDateValue(data: any): void {
    //     if (data && data['value']) {
    //         this.datePickerConfig.ProcessDate.value = data.value ? this.utils.convertDate(data.value) : '';
    //         this.uiForm.controls['ProcessDate'].setValue(this.datePickerConfig.ProcessDate.value);
    //     }
    // }

    public onEmployeeSearchDataReceived(data: any, route: any): void {
        this.uiForm.controls['EmployeeCode'].setValue(data.EmployeeCode);
        this.uiForm.controls['EmployeeSurname'].setValue(data.fullObject.EmployeeSurname || '');
    }

    public onBranchSearchReceived(data: any): void {
        if (data) {
            this.uiForm.controls['BranchNumber'].setValue(data.BranchNumber || '');
            this.uiForm.controls['BranchName'].setValue(data.BranchName || '');
            this.refresh();
        }

    }

    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }

    public getCurrentPage(data: any): void {
        this.currentPage = data.value;
        this.buildGrid();
    }

    public buildGrid(): void {
        this.search = new URLSearchParams();
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('riGridMode', '0');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        this.search.set(this.serviceConstants.GridSortOrder, ((this.sortType === 'DESC') || (this.sortType === 'Descending')) ? 'Descending' : 'Ascending');
        this.search.set('BranchNumber', this.uiForm.controls['BranchNumber'].value);
        this.search.set('ProcessDate', this.globalize.parseDateToFixedFormat(this.uiForm.controls['ProcessDate'].value) as string);
        this.search.set('ProspectNumber', this.uiForm.controls['ProspectNumber'].value);
        this.search.set('EmployeeCode', this.uiForm.controls['EmployeeCode'].value);
        this.search.set('ProcessDateSelect', this.uiForm.controls['ProcessDateSelect'].value);
        this.search.set('Status', this.uiForm.controls['StatusSelect'].value);
        this.search.set('OriginCode', this.vOriginCode);
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        this.inputParams.search = this.search;
        this.riGrid.loadGridData(this.inputParams);
    }


    public refresh(): void {
        this.currentPage = 1;
        this.riGrid.clearGridData();
        this.applyGridFilter();
        this.buildGrid();
    }


    public selectedDataOnDoubleClick(event: any): void {
        this.detail(event);
    }

    public selectedDataOnCellFocus(event: any): void {
        //TODO:
    }

    public onCellClickBlur(event: any): void {
        //console.log('-onCellClickBlur-', event);
    }

    public detail(event: any): any {
        this.setAttribute('ProspectNumberProspectNumber', event.trRowData[0].text);
        this.setAttribute('ProspectNumberRowID', event.trRowData[0].rowID);
        alert('TODO: ContactManagement/iCABSCMProspectEntryMaintenance.htm');

        // this.router.navigate(['ContactManagement/iCABSCMProspectEntryMaintenance.htm'], {
        //     queryParams: {
        //         parentMode: 'ConfirmNatAx',
        //         currentContractTypeURLParameter: this.vURLParam
        //     }
        // });
    }

    public sortGrid(obj: any): void {
        this.headerClicked = obj.fieldname;
        this.sortType = obj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }

    private applyGridFilter(): void {
        let objProspectNumber = {
            'fieldName': 'ProspectNumber',
            'index': 0,
            'colName': 'Number',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objProspectNumber);

        let objBranchNumber = {
            'fieldName': 'BranchNumber',
            'index': 1,
            'colName': 'Branch',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objBranchNumber);

        let objProspectName = {
            'fieldName': 'ProspectName',
            'index': 2,
            'colName': 'Name',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objProspectName);

        let objProspectDate = {
            'fieldName': 'ProspectDate',
            'index': 3,
            'colName': 'Date',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objProspectDate);

        let objProspectOrigin = {
            'fieldName': 'ProspectOrigin',
            'index': 4,
            'colName': 'Origin',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objProspectOrigin);

        let objProspectStatus = {
            'fieldName': 'ProspectStatus',
            'index': 5,
            'colName': 'Status',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objProspectStatus);

    }


    public selectStatus_onchange(event: any): any {
        this.refresh();
    }

    public employeeCode_onkeydown(event: any): any {
        if (this.employeeCodeEllipsis && (typeof this.employeeCodeEllipsis !== 'undefined')) {
            this.employeeCodeEllipsis.openModal();
        }
    }

    public employeeCode_onchange(event: any): any {

        if (event.target.value ) {
            event.target.value = event.target.value.toUpperCase();

            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
            this.search.set(this.serviceConstants.Action, '6');

            let postObj: any = {};
            postObj.Function = 'GetEmployeeName';
            postObj.EmployeeCode = event.target.value;

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
                .subscribe(
                (e) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (e.status === 'failure') {
                        this.errorService.emitError(e.oResponse);
                        //this.uiForm.controls['EmployeeSurname'].markAsDirty();
                        this.uiForm.controls['EmployeeCode'].setErrors({ remote: true });
                        this.uiForm.controls['EmployeeSurname'].setValue('');
                    } else {
                        if (e['errorMessage'] || e['fullError']) {
                            this.errorModal.show(e, true);
                            this.uiForm.controls['EmployeeCode'].setErrors({ remote: true });
                            this.uiForm.controls['EmployeeSurname'].setValue('');
                        }
                        else {
                            let desc = e['EmployeeSurname'] ? e['EmployeeSurname'] : '';
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', desc);
                            this.uiForm.controls['EmployeeCode'].setErrors(null);
                            this.refresh();
                        }
                    }

                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.errorService.emitError(error);
                });
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeCode', '');
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', '');
            this.refresh();
        }
    }


    // public getAttribute(attributeName: any): any {
    //     let attrValue = '';
    //     if (this.attributes && this.attributes.hasOwnProperty(attributeName) && this.attributes[attributeName]) {
    //         attrValue = this.attributes[attributeName];
    //     }
    //     return attrValue;
    // }


    // public setAttribute(attributeName: any, attrValue: any = ''): void {
    //     if (this.attributes && attributeName) {
    //         this.attributes[attributeName] = attrValue;
    //     }
    // }

    public getValidateProperties(): any {
        this.validateProperties = [
        {
            'type': MntConst.eTypeDate,
            'index': 3,
            'align': 'center'
        }];
    }
}
