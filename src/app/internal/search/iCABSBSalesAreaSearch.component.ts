
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { TableComponent } from './../../../shared/components/table/table';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Utils } from '../../../shared/services/utility';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { Logger } from '@nsalaun/ng2-logger';
@Component({
    templateUrl: 'iCABSBSalesAreaSearch.html'
})
export class SalesAreaSearchComponent implements OnInit {
    @ViewChild('salesAreaSearchTable') salesAreaSearchTable: TableComponent;
    @Input() public inputParams: any;

    public selectedrowdata: any;
    public method: string = 'contract-management/search';
    public module: string = 'contract-admin';
    public operation: string = 'Business/iCABSBSalesAreaSearch';
    public search: URLSearchParams = new URLSearchParams();
    public itemsPerPage: number = 10;
    public page: number = 1;
    public totalItem: number = 11;
    public columns: Array<any> = new Array();
    public rowmetadata: Array<any> = new Array();
    private routeParams: any;
    private sub: Subscription;
    constructor(
        private serviceConstants: ServiceConstants,
        private ellipsis: EllipsisComponent,
        private router: Router,
        private localeTranslateService: LocaleTranslationService,
        private route: ActivatedRoute,
        private utils: Utils,
        private translate: TranslateService,
        private logger: Logger
    ) { }

    ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(
            (params: any) => {
                this.routeParams = params;
            }
        );
        this.inputParams = {
            'parentMode': 'Search',
            'ServiceBranchNumber': this.utils.getBranchCode(),
            'SalesBranchNumber': this.utils.getBranchCode()

        };
        this.localeTranslateService.setUpTranslation();
    }
    public createPage(pageparentmode: any): void {
        this.buildTableColumns();
        switch (pageparentmode) {
            case 'LookUp-Premise':
            case 'LookUp-Postcode':
                this.search.set('BranchNumber', this.inputParams.ServiceBranchNumber);
                break;
            case 'ContractJobReport':
                this.search.set('BranchNumber', this.inputParams.SalesBranchNumber);
                break;
            default:
                this.search.set('BranchNumber', this.utils.getBranchCode());
                break;
        }
    }
    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }
    public buildTableColumns(): void {
        this.columns = [];
        this.getTranslatedValue('Code', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'SalesAreaCode' });
            } else {
                this.columns.push({ title: 'Code', name: 'SalesAreaCode', sort: 'ASC' });
            }
        });
        this.getTranslatedValue('Description', null).subscribe((res: string) => {
            if (res) {
                this.columns.push({ title: res, name: 'SalesAreaDesc' });
            } else {
                this.columns.push({ title: 'Description', name: 'SalesAreaDesc' });
            }
        });
        if (this.inputParams.parentMode !== 'LookUp-All' && this.inputParams.parentMode !== 'Search') {
            this.search.set('LiveSalesArea', 'True');
        }
        if (this.inputParams.parentMode === 'LookUp-All' || this.inputParams.parentMode === 'Search') {
            this.getTranslatedValue('Live Area', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'LiveSalesArea' });
                    this.rowmetadata.push({ title: res, name: 'LiveSalesArea', type: 'img' });
                } else {
                    this.columns.push({ title: 'Live Area', name: 'LiveSalesArea' });
                    this.rowmetadata.push({ title: 'Live Area', name: 'LiveSalesArea', type: 'img' });
                }
            });

        }
        if (this.inputParams.parentMode === 'LookUp-Premise') {
            this.getTranslatedValue('Employee', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'EmployeeCode' });
                } else {
                    this.columns.push({ title: 'Employee', name: 'EmployeeCode' });
                }
            });
            this.getTranslatedValue('Surname', null).subscribe((res: string) => {
                if (res) {
                    this.columns.push({ title: res, name: 'EmployeeSurname' });
                } else {
                    this.columns.push({ title: 'Surname', name: 'EmployeeSurname' });
                }
            });
        }
        this.inputParams.columns = [];
        this.inputParams.columns = this.columns;
        this.inputParams.rowmetadata = [];
        this.inputParams.rowmetadata = this.rowmetadata;

    }

    public selectedData(event: any): void {
        let returnObj: any;
        if (this.inputParams.parentMode === 'LookUp-Premise') {
            returnObj = {
                'EmployeeCode': event.row.EmployeeCode,
                'EmployeeSurname': event.row.EmployeeSurname
            };

        }
        if (this.inputParams.parentMode === 'LookUp' || this.inputParams.parentMode === 'LookUp-Postcode') {
            returnObj = {
                'SalesAreaCode': event.row.SalesAreaCode,
                'SalesAreaDesc': event.row.SalesAreaDesc
            };

        }
        if (this.inputParams.parentMode === 'LookUp-To') {
            returnObj = {
                'SalesAreaCodeTo': event.row.SalesAreaCode,
                'SalesAreaDescTo': event.row.SalesAreaDesc
            };

        }
        if (this.inputParams.parentMode === 'LookUp-Premise') {
            returnObj = {
                'SalesAreaCode': event.row.SalesAreaCode,
                'SalesAreaDesc': event.row.SalesAreaDesc,
                'PremiseSalesEmployee': event.row.EmployeeCode,
                'SalesEmployeeSurname': event.row.EmployeeSurname
            };

        }
        else {
            returnObj = {
                'SalesAreaCode': event.row.SalesAreaCode,
                'SalesAreaDesc': event.row.SalesAreaDesc
            };
        }
        this.ellipsis.sendDataToParent(returnObj);
    }
    public getCurrentPage(currentPage: number): void {
        this.page = currentPage;
    }
    public updateView(params: any): void {
        this.inputParams = params || this.inputParams;
        if (!params) {
            params = this.inputParams;
        }

        this.createPage(this.inputParams.parentMode);
        this.inputParams.module = this.module;
        this.inputParams.method = this.method;
        this.inputParams.operation = this.operation;
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.inputParams.search = this.search;
        this.salesAreaSearchTable.loadTableData(this.inputParams);

    }
}
