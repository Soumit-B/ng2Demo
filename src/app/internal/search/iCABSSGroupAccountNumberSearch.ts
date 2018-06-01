import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { FormGroup, FormBuilder, Validator } from '@angular/forms';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { TableComponent } from './../../../shared/components/table/table';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Input, EventEmitter, Injectable, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Utils } from '../../../shared/services/utility';
import { ContractManagementModuleRoutes } from '../../base/PageRoutes';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSSGroupAccountNumberSearch.html'
})

export class GroupAccountNumberComponent implements OnInit {
    @ViewChild('GroupAccountTable') GroupAccountTable: TableComponent;
    @Input() showAddNew: boolean = false;
    @Input() inputParams: any;
    public selectedrowdata: any;
    public method: string = 'contract-management/search';
    public module: string = 'group-account';
    public operation: string = 'System/iCABSSGroupAccountNumberSearch';
    public search: URLSearchParams = new URLSearchParams();

    public FilterSelect: string;
    FilterInputCheck: string;
    FilterInput: string;
    public showHeader: boolean = true;

    public inputParamsGrpAccNumber: any;
    public filterValue: string;
    public showOption: boolean = false;
    groupAcountForm: FormGroup;

    constructor(
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private _router: Router,
        private zone: NgZone,
        private utils: Utils,
        private _formBuilder: FormBuilder,
        private router: Router,
        private localeTranslateService: LocaleTranslationService) {
    }

    itemsPerPage: number = 10;
    page: number = 1;
    totalItem: number = 11;
    public tableheader = 'Group Account Search';

    columns: Array<any> = [
        { title: 'Group Account Number', name: 'GroupAccountNumber', type: MntConst.eTypeInteger },
        { title: 'Group Name', name: 'GroupName', type: MntConst.eTypeText },
        { title: 'Agreement Date', name: 'GroupAgreementDate', type: MntConst.eTypeDate }
    ];

    public selectedData(event: any): void {
        let returnGrpObj: any;
        let parentMode = this.inputParamsGrpAccNumber.parentMode;
        switch (parentMode) {
            case 'LookUp':
            case 'Lookup-UpdateParent':
            case 'LookUp-NoMenu':
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'GroupName': event.row.GroupName
                };
                break;
            case 'LookUp-Search':
                returnGrpObj = {
                    'SearchID': event.row.GroupAccountNumber,
                    'GroupName': event.row.GroupName
                };
                break;
            case 'LookUp1':
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'GroupAccountNumber1': event.row.GroupAccountNumber,
                    'GroupName1': event.row.GroupName
                };
                break;
            case 'LookUp2':
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'GroupAccountNumber2': event.row.GroupAccountNumber,
                    'GroupName2': event.row.GroupName
                };
                break;

            case 'GeneralSearch-Lookup':
                returnGrpObj = {
                    'SearchValue': event.row.GroupAccountNumber
                };
                break;

            case 'Search':
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'GroupName': event.row.GroupName
                };
                break;
            default:
                returnGrpObj = {
                    'GroupAccountNumber': event.row.GroupAccountNumber,
                    'Object': event.row
                };
        }
        this.ellipsis.sendDataToParent(returnGrpObj);
    }
    ngOnInit(): void {
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.localeTranslateService.setUpTranslation();
    }



    updateView(params: any): void {
        this.zone.run(() => {
            this.inputParams = params;
            if (this.inputParams && this.inputParams.showAddNew !== undefined) {
                this.showAddNew = true;
            }
            if (typeof params.showAddNew !== 'undefined') {
                this.showAddNew = params.showAddNew;
            }
        });
        this.inputParamsGrpAccNumber = params;
        this.inputParamsGrpAccNumber.module = this.module;
        this.inputParamsGrpAccNumber.method = this.method;
        this.inputParamsGrpAccNumber.operation = this.operation;
        if (params.businessCode) {
            this.search.set(this.serviceConstants.BusinessCode, params.businessCode);
        } else {
            this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        }
        if (params.countryCode) {
            this.search.set(this.serviceConstants.CountryCode, params.countryCode);
        } else {
            this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        }
        this.inputParamsGrpAccNumber.search = this.search;
        this.GroupAccountTable.loadTableData(this.inputParamsGrpAccNumber);

    }
    getFiterValue(e: any): void {
        this.filterValue = e;
    }
    onChange(event: any): void {
        this.router.navigate([ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMAINTENANCE], { queryParams: { Mode: 'Add' } });
    }
    refresh(): void {
        let isValid = true;
        if ((this.filterValue === 'GroupAccountNumber') && this.FilterInput !== '' && typeof (this.FilterInput) !== undefined) {
            let re = /^[0-9]+$/;
            let val = this.FilterInput;
            let reg = new RegExp(re);
            isValid = reg.test(val) ? true : false;
        }

        if (isValid === true) {
            this.loadTableData();
        }
    }

    loadTableData(): void {

        this.page = 1;
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        if (this.filterValue === 'GroupName') {
            this.search.set('GroupName', this.FilterInputCheck);
            this.search.set('search.op.GroupName', 'GE');
            this.search.set('search.sortby', 'GroupName');
        }
        if (this.filterValue === 'GroupAccountNumber') {
            this.search.set('GroupAccountNumber', this.FilterInput);
            this.search.set('search.op.GroupAccountNumber', 'GE');
            this.search.set('search.sortby', 'GroupAccountNumber');
        }
        this.inputParamsGrpAccNumber.search = this.search;
        this.GroupAccountTable.loadTableData(this.inputParamsGrpAccNumber);
    }

    public onAddNew(): void {
        this.ellipsis.onAddNew(true);
        this.router.navigate([ContractManagementModuleRoutes.ICABSSGROUPACCOUNTMAINTENANCE], { queryParams: { Mode: 'Add' } });
        this.ellipsis.closeModal();
    }
}
