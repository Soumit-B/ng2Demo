import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from './../../base/BaseComponent';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { GridComponent } from './../../../shared/components/grid/grid';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, ViewChild, Injector, OnDestroy } from '@angular/core';
import { ContractActionTypes } from '../../actions/contract';

@Component({
    selector: 'icabs-apply-contract-grid',
    templateUrl: 'iCABSAApplyAPIContractGrid.html'
})
export class ApplyAPIContractGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('apiContractGrid') apiContractGrid: GridComponent;
    @ViewChild('apiContractPagination') apiContractPagination: PaginationComponent;

    public trBranch: boolean = true;
    public trRegion: boolean = true;
    public selectedrowdata: any;
    public search: URLSearchParams = new URLSearchParams();
    public pageId: string = '';
    public queryParams: any = {
        action: '2',
        operation: 'Application/iCABSAApplyAPIContractGrid',
        module: 'api',
        method: 'contract-management/maintenance'
    };

    public pageTitle: string = 'Preview API Contract';

    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 14;
    public validateProperties: Array<any> = [
        { 'type': MntConst.eTypeCode, 'index': 0, 'align': 'center' },
        { 'type': MntConst.eTypeCode, 'index': 1, 'align': 'center' },
        { 'type': MntConst.eTypeText, 'index': 2, 'align': 'center' },
        { 'type': MntConst.eTypeText, 'index': 3, 'align': 'center' },
        { 'type': MntConst.eTypeDate, 'index': 4, 'align': 'center' },
        { 'type': MntConst.eTypeDecimal2, 'index': 5, 'align': 'center' },
        { 'type': MntConst.eTypeDecimal2, 'index': 6, 'align': 'center' },
        { 'type': MntConst.eTypeDecimal2, 'index': 7, 'align': 'center' },
        { 'type': MntConst.eTypeDecimal2, 'index': 8, 'align': 'center' },
        { 'type': MntConst.eTypeDecimal2, 'index': 9, 'align': 'center' },
        { 'type': MntConst.eTypeDecimal2, 'index': 10, 'align': 'center' },
        { 'type': MntConst.eTypeDecimal2, 'index': 11, 'align': 'center' },
        { 'type': MntConst.eTypeDecimal2, 'index': 12, 'align': 'center' },
        { 'type': MntConst.eTypeDecimal2, 'index': 13, 'align': 'center' }
    ];

    public controls = [
        { name: 'BusinessCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'BusinessDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'MonthName', readonly: true, disabled: false, required: true, type: MntConst.eTypeText },
        { name: 'BranchNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'BranchName', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'LessThan', readonly: true, disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'RegionCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'RegionDescription', readonly: false, disabled: false, required: false, type: MntConst.eTypeText }
    ];


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAAPPLYAPICONTRACTGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setUpPageTitle();
        this.initPage();
        this.loadGridData();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public setUpPageTitle(): void {
        let t1 = 'Preview API';
        let t2 = 'Contract';
        let translation = this.getTranslatedValue('Preview API').toPromise();
        translation.then((resp) => {
            t1 = resp;
            let translation1 = this.getTranslatedValue('Contract').toPromise();
            translation1.then((resp) => {
                t2 = resp;
                this.utils.setTitle(t1 + '-' + t2);
            });
        });
    }

    getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.loadGridData();
    }

    getGridInfo(info: any): void {
        this.apiContractPagination.totalItems = info.totalRows;
    }

    getRefreshData(): void {
        this.currentPage = 1;
        this.loadGridData();
    }

    loadGridData(): void {
        let inputParams: any = {};
        inputParams.module = this.queryParams.module;
        inputParams.method = this.queryParams.method;
        inputParams.operation = this.queryParams.operation;
        this.search.set(this.serviceConstants.Action, this.queryParams.action);
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set('PageCurrent', this.currentPage.toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set('Level', this.formData.ViewBy);
        this.search.set('ViewBy', 'Contract');
        this.search.set('LessThan', this.globalize.parseDecimalToFixedFormat(this.formData.LessThan, 2).toString());
        this.search.set('MonthNo', this.formData.MonthNo);
        this.search.set('YearNo', this.formData.YearNo);
        if (this.trRegion) {
            this.search.set('RegionCode', this.formData.RegionCode);
        } else {
            this.search.set('BranchNumber', this.formData.BranchNumber);
        }
        this.search.set('riGridHandle', '1180828');
        this.search.set('riGridMode', '0');
        inputParams.search = this.search;
        this.apiContractGrid.loadGridData(inputParams);
    }

    public getSelectedRowInfo(event: any): void {
        if (event.cellIndex === 0 && event.cellData && event.cellData['rowID'] !== 'TOTAL') {
            this.router.navigate([this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                queryParams: {
                    parentMode: 'ContractExpiryGrid',
                    ContractNumber: event.cellData.text
                }
            });
        }
    }

    initPage(): void {
        //Retrieve data from parent screen
        this.formData.BusinessDesc = this.riExchange.getParentHTMLValue('BusinessDesc');
        this.formData.BranchNumber = this.riExchange.getParentAttributeValue('BranchNumber');
        this.formData.BranchName = this.riExchange.getParentAttributeValue('BranchName');
        this.formData.RegionCode = this.riExchange.getParentAttributeValue('RegionCode');
        this.formData.RegionDescription = this.riExchange.getParentAttributeValue('RegionDescription');
        this.formData.ViewBy = this.riExchange.getParentAttributeValue('ViewBy');
        this.formData.MonthName = this.riExchange.getParentAttributeValue('MonthName');
        this.formData.YearNo = this.riExchange.getParentAttributeValue('YearNo');
        this.formData.LessThan = this.riExchange.getParentHTMLValue('LessThan');
        this.formData.MonthNo = this.riExchange.getParentAttributeValue('MonthNo');
        this.populateUIFromFormData();
        this.riExchange.riInputElement.Disable(this.uiForm, 'MonthName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BusinessDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'RegionCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'RegionDescription');
        this.riExchange.riInputElement.Disable(this.uiForm, 'LessThan');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PreviewYear');
        if (this.formData.ViewBy === 'Region') {
            this.trBranch = false;
            this.trRegion = true;
        } else {
            this.trBranch = true;
            this.trRegion = false;
        }
    }
}
