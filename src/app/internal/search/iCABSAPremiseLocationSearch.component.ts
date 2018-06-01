import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';

import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { QueryParametersCallback } from './../../base/Callback';

@Component({
    templateUrl: 'iCABSAPremiseLocationSearch.html'
})

export class PremiseLocationSearchComponent extends BaseComponent implements OnInit, OnDestroy, QueryParametersCallback {

    @ViewChild('PremiseLocationSearchGrid') PremiseLocationSearchGrid: GridComponent;
    @ViewChild('PremiseLocationSearchPagination') PremiseLocationSearchPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;

    @Input() showAddNew: boolean;
    @Output() openAddMode = new EventEmitter();

    public queryParams: any = {
        operation: 'Application/iCABSAPremiseLocationSearch',
        module: 'locations',
        method: 'service-delivery/search'
    };

    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: true, required: false },
        { name: 'menu' },
        { name: 'PassUpPremiseLocation' },
        { name: 'PremiseLocationFilterValue' },
        { name: 'PremiseLocationFilterDesc' },
        { name: 'PremiseLocationNumber' },
        { name: 'PremiseLocationDesc' },
        { name: 'PremiseLocationNumberTo' },
        { name: 'PremiseLocationDescTo' },
        { name: 'LocationDesc' },
        { name: 'SelPremiseLocationNumber' },
        { name: 'SelPremiseLocationDesc' }
    ];

    //local variables
    public pageId: string = '';
    public parentMode: any;
    public tdMenuDisplay: boolean = true;

    //CurrentContractTypeURLParameter
    public routeParams: any = {};
    public inputParams: any = {};
    private currentContractType: string;
    private currentContractTypeLabel: string;
    private currentContractTypeURLParameter: string;

    // Grid Component Variables
    public search: URLSearchParams = new URLSearchParams();
    public pageSize: number = 10;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 2;
    private selectedRow: any = -1;
    public validateProperties: Array<any> = [];

    //errorModel
    public errorMessage: string;
    public showMessageHeader: boolean = true;

    constructor(
        injector: Injector,
        private ellipsis: EllipsisComponent
    ) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPREMISELOCATIONSEARCH;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Premises Location Details';
        this.setCurrentContractType();
        this.setURLQueryParameters(this);

        if (this.riExchange.getParentMode() === 'LookUp-Allocate') {
            this.tdMenuDisplay = true;
        }
        else {
            this.tdMenuDisplay = false;
        }
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public setCurrentContractType(): void {
        this.currentContractType =
            this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.currentContractType);
    }

    public getURLQueryParameters(param: any): void {
        this.routeParams.ParentMode = param['parentMode'];
        this.routeParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    }

    private setGridHeaders(): void {
        this.validateProperties = [
            {
                'type': MntConst.eTypeInteger,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 1
            }
        ];
    }

    updateView(params: any): void {
        this.inputParams = params;
        this.parentMode = params['parentMode'];
        this.showAddNew = this.inputParams.showAddNew;
        this.pageParams.CurrentContractTypeURLParameter = params['currentContractTypeURLParameter'];
        this.currentPage = 1;
        this.window_onload();
        this.refresh();
    }

    public onAddNew(): void {
        this.ellipsis.onAddNew(true);
        this.ellipsis.closeModal();
    }

    public window_onload(): void {
        this.currentContractType = this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.currentContractTypeLabel = this.utils.getCurrentContractLabel(this.currentContractType);
        //Parent values
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber') ? this.riExchange.getParentHTMLValue('ContractNumber') : this.inputParams.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName') ? this.riExchange.getParentHTMLValue('ContractName') : this.inputParams.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber') ? this.riExchange.getParentHTMLValue('PremiseNumber') : this.inputParams.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName') ? this.riExchange.getParentHTMLValue('PremiseName') : this.inputParams.PremiseName);

        //Disable Fields
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');

        this.buildGrid();

    }

    public buildGrid(): void {
        this.setGridHeaders();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        //set parameters
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));

        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '4785030');
        this.queryParams.search = this.search;
        this.PremiseLocationSearchGrid.loadGridData(this.queryParams);
    }

    public gridOnDblClick(data: any): void {
        let _PremiseLocationNumber = data.trRowData[0].text;
        let _PremiseLocationDesc = data.trRowData[1].text;
        let returnObj: any;
        returnObj = {
            'PremiseLocationNumber': _PremiseLocationNumber,
            'PremiseLocationDesc': _PremiseLocationDesc,
            'rowObj': data.rowData
        };

        // this.parentMode = this.riExchange.getParentMode();
        this.pageParams.CurrentContractTypeURLParameter = this.routeParams.CurrentContractTypeURLParameter;
        if (this.parentMode === 'Premise') {
            this.navigate('Search', InternalMaintenanceApplicationModuleRoutes.ICABSAPREMISELOCATIONMAINTENANCE);
        }
        else {
            switch (this.parentMode) {
                case 'LookUp-PremiseLocationSummary':
                    this.riExchange.setParentHTMLValue('PremiseLocationFilterValue', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('PremiseLocationFilterDesc', _PremiseLocationDesc);
                    break;
                case 'LookUp' && 'LookUp-Allocate':
                    this.riExchange.setParentHTMLValue('PremiseLocationNumber', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('PremiseLocationDesc', _PremiseLocationDesc);
                    break;
                case 'LookUp-To':
                    this.riExchange.setParentHTMLValue('PremiseLocationNumberTo', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('PremiseLocationDescTo', _PremiseLocationDesc);
                    break;
                case 'BarcodeLocation':
                    this.riExchange.setParentHTMLValue('LocationDesc', _PremiseLocationNumber);
                    break;
                case 'DisplayGrid':
                    this.riExchange.setParentHTMLValue('SelPremiseLocationNumber', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('SelPremiseLocationDesc', _PremiseLocationDesc);
                    break;
                default:
                    this.riExchange.setParentHTMLValue('PremiseLocationNumber', _PremiseLocationNumber);
                    this.riExchange.setParentHTMLValue('PremiseLocationDesc', _PremiseLocationDesc);
                    break;
            }
            let msgContent = { title: '', msg: 'This page iCABSBBarcodeMaintenance.htm is under construction' };
            //this.messageModal.show(msgContent, false);
        }
        this.ellipsis.sendDataToParent(returnObj);
    }

    public menuOnchange(): void {
        let selectedValue = this.uiForm.controls['menu'].value;
        this.pageParams.CurrentContractTypeURLParameter = this.routeParams.CurrentContractTypeURLParameter;
        let _PassUpPremiseLocationNumber = this.riExchange.riInputElement.SetValue(this.uiForm, 'PassUpPremiseLocation', this.riExchange.getParentAttributeValue('PassUpPremiseLocationNumber'));
        let _PassUpPremiseLocationDesc = this.riExchange.riInputElement.SetValue(this.uiForm, 'PassUpPremiseLocation', this.riExchange.getParentAttributeValue('PassUpPremiseLocationDesc'));

        if (selectedValue === 'Add') {
            let msgContent = { title: '', msg: 'This page iCABSAPremiseLocationMaintenance.htm is under construction' };
            this.messageModal.show(msgContent, false);
            //TO DO: this page is not created yet
            //this.router.navigate(['/Application/iCABSAPremiseLocationMaintenance.htm'], { queryParams: { Mode: 'SearchAdd','CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter } });

            this.riExchange.setParentHTMLValue('PremiseLocationNumber', _PassUpPremiseLocationNumber);
            this.riExchange.setParentHTMLValue('PremiseLocationDesc', _PassUpPremiseLocationDesc);

        }
        else if (selectedValue === 'Maintain') {
            let msgContent = { title: '', msg: 'This page iCABSAPremiseLocationSearchGrid.htm is under construction' };
            this.messageModal.show(msgContent, false);
            //TO DO: this page is not created yet
            //this.router.navigate(['/Application/iCABSAEmptyPremiseLocationSearchGrid.htm'], { queryParams: { Mode: 'Premise-Allocate','CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter } });
        }
    }

    public getGridInfo(info: any): void {
        this.PremiseLocationSearchPagination.totalItems = info.totalRows;
    }

    public getCurrentPage(currentPage: any): void {
        this.selectedRow = -1;
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    }

    public refresh(): void {
        this.currentPage = 1;
        this.buildGrid();
    }
}

