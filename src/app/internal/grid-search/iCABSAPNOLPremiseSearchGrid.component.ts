import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { AccountSearchComponent } from '../search/iCABSASAccountSearch';
import { Router } from '@angular/router';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAPNOLPremiseSearchGrid.html'
})

export class PNOLPremiseSearchGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('SOPremiseSearch') SOPremiseSearch: GridComponent;
    @ViewChild('SOPremiseSearchPagination') SOPremiseSearchPagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public queryParams: any = {
        operation: 'Application/iCABSAPNOLPremiseSearchGrid',
        module: 'pnol',
        method: 'extranets-connect/search',
        search: ''
    };

    public controls = [
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
    public tdMaxMessage: string;
    public pageId: string = '';
    public returnGrpObj: any;
    public UpdateableInd: any;
    public pageSize: number = 10;
    public currentPage: number = 1;
    public totalRecords: number;
    public CurrentColumnName: any;
    public griddata: any;
    public search: URLSearchParams;

    private DI: Injector;
    private ellipsis: EllipsisComponent;
    private inputParams: any = {};
    private isEllipsis = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public accountSearchComponent = AccountSearchComponent;
    public showHeader: boolean = true;
    public isAccountEllipsisDisabled: boolean = false;
    public inputParamsAccount: any = {
        'parentMode': 'LookUp',
        'showAddNew': false,
        'businessCode': this.businessCode(),
        'countryCode': this.countryCode(),
        'showAddNewDisplay': false,
        'showCountryCode': false,
        'showBusinessCode': false,
        'searchValue': ''
    };

    constructor(injector: Injector, private _router: Router) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPNOLPREMISESEARCHGRID;
        this.DI = injector;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'myRentokil Premises Search';
        this.window_onload();
        this.accountSearchComponent = AccountSearchComponent;
    }

    public updateView(params: any): void {
        if (!params) { params = this.inputParams; }
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
    }

    public window_onload(): void {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = this.pageSize;

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
    }

    private setPremiseAddress(): void {
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
    }

    public buildGrid(): void {
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
    }

    private riGrid_BeforeExecute(): void {
        let gridParams: URLSearchParams = new URLSearchParams();
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
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    return;
                }
                this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                if (this.currentPage === data.pageData.lastPageNumber) {
                    this.tdMaxMessage = 'Max Records Read';
                }
                else {
                    this.tdMaxMessage = '';
                }
                this.riGrid.UpdateBody = true;
                this.riGrid.UpdateHeader = true;
                this.riGrid.Execute(data);
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public riGrid_AfterExecute(): void {
        // this.tdMaxMessage = this.riGrid.Details.GetAttribute('GridContractNumber', 'AdditionalProperty');
    }

    public onAccountDataReceived(data: any): void {
        if (data) {
            this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
        }
    }

    public selectedRowFocus(rsrcElement: any): void {
        rsrcElement.select();
        rsrcElement.focus();
    }

    public tbodyPNOLPremiseSearch_onClick(event: any): void {
        let parentMode = '';
        let objToParent: any = {};
        let vAddress: any;
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
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
