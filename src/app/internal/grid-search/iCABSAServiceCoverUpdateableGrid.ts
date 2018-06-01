import { OnInit, Injector, Component, OnDestroy, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { DropdownStaticComponent } from './../../../shared/components/dropdown-static/dropdownstatic';
import { AppModuleRoutes, ContractManagementModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../../app/base/PageRoutes';

@Component({
    templateUrl: 'iCABSAServiceCoverUpdateableGrid.html'
})

export class ServiceCoverUpdateableGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('menu') menu: DropdownStaticComponent;

    private queryParams: any = {
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        operation: 'Application/iCABSAServiceCoverUpdateableGrid'
    };
    private search: URLSearchParams = new URLSearchParams();
    private iSvSCEnableWorkLoadIndex: boolean = false;
    private iSvSCEnableMonthlyUnitPrice: boolean = false;
    private vbReqWIT: string = 'No';
    private vbReqMUP: string = 'No';
    private strInpTitle: string = '^1^ Number';
    private strDocTitle: string = '^1^ Service Cover Summary Grid';
    private strTabTitle: string = '^1^ Service Cover Summary Grid';
    private contractTableObj: any;
    private accountTableObj: any;
    private branchTableObj: any;
    private lookupQueryParams = new URLSearchParams();
    private userAccess: string;
    private loggedInBranch: string;

    public pageId: string = '';
    public controls = [
        { name: 'ContractNumber', type: MntConst.eTypeCode, disabled: true },
        { name: 'ContractName', type: MntConst.eTypeText, disabled: true },
        { name: 'InvoiceFrequencyCode', type: MntConst.eTypeInteger, disabled: true },
        { name: 'AccountNumber', type: MntConst.eTypeCode, disabled: true },
        { name: 'AccountName', type: MntConst.eTypeText, disabled: true },
        { name: 'NegBranchNumber', type: MntConst.eTypeInteger, disabled: true },
        { name: 'NegBranchName', type: MntConst.eTypeText, disabled: true },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger, disabled: true },
        { name: 'PremiseName', type: MntConst.eTypeText, disabled: true },
        { name: 'InvoiceAnnivDate', type: MntConst.eTypeDate, disabled: true },
        { name: 'ServiceBranchNumber', type: MntConst.eTypeInteger, disabled: true },
        { name: 'BranchName', type: MntConst.eTypeText, disabled: true },
        { name: 'PremiseAnnualValue', type: MntConst.eTypeCurrency, disabled: true },
        { name: 'StatusSearchType' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'ServiceVisitAnnivDate' },
        { name: 'ServiceVisitFrequency' }
    ];

    public tdAnnualValue: boolean = true;
    public isHidePagination: boolean = true;
    public gridParams: any = {
        totalRecords: 0,
        pageCurrent: 1,
        itemsPerPage: 13,
        riGridMode: 0
    };
    public statusSearchTypeoDropdownValues: Array<Object> = [];
    public menuSelectList: Array<any> = [{ text: 'Options', value: 'Options' }, { text: 'Add', value: 'AddRecord' }];
    public isRefreshDisabled: boolean = false;
    public isPaginationDisabled: boolean = false;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERUPDATEABLEGRID;
        this.pageTitle = 'Service Cover Summary Grid';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.browserTitle = this.pageTitle;
        this.setLocalQueryParams();
        this.triggerFetchSysChar();

        this.riGrid.FunctionUpdateSupport = true;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private setLocalQueryParams(): void {
        this.lookupQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.lookupQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.lookupQueryParams.set(this.serviceConstants.MethodType, 'maintenance');
        this.lookupQueryParams.set(this.serviceConstants.Action, '3');
    }

    //get all contract and dependent fields.
    private getContractFields(): void {
        let lookupQuery: any;
        lookupQuery = [{
            'table': 'Contract',
            'query': { 'ContractNumber': this.riExchange.getParentHTMLValue('ContractNumber'), 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['InvoiceFrequencyCode', 'InvoiceAnnivDate', 'NegBranchNumber', 'AccountNumber']
        }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.lookUpRequest(this.lookupQueryParams, lookupQuery).subscribe(
            contract => {
                if (contract.results && contract.results[0] && contract.results[0][0]) {
                    this.contractTableObj = contract.results[0][0];
                    this.getAccountFields();
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.notSuccessfull));
                }
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //this function is used to pupulate the account and related fields.
    private getAccountFields(): void {
        let lookupQuery: any;
        lookupQuery = [{
            'table': 'Account',
            'query': { 'AccountNumber': this.contractTableObj.AccountNumber, 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['AccountNumber', 'AccountName']
        }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.lookUpRequest(this.lookupQueryParams, lookupQuery).subscribe(
            account => {
                if (account.results && account.results[0] && account.results[0][0]) {
                    this.accountTableObj = account.results[0][0];
                    this.getBranchFields();
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.notSuccessfull));
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //this function is used to populate Branch dependent fields
    private getBranchFields(branchCode?: string): void {
        let lookupQuery: any;
        let branch: string = branchCode ? branchCode : this.contractTableObj.NegBranchNumber;
        lookupQuery = [{
            'table': 'Branch',
            'query': { 'BranchNumber': branch, 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['BranchName']
        }];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.lookUpRequest(this.lookupQueryParams, lookupQuery).subscribe(
            branch => {
                if (branch.results && branch.results[0] && branch.results[0][0]) {
                    let branchTable: any = branch.results[0][0];
                    if (branchCode) {
                        this.setControlValue('BranchName', branchTable.BranchName);
                    }
                    else {
                        this.branchTableObj = branchTable;
                        this.setControlValue('InvoiceFrequencyCode', this.contractTableObj.InvoiceFrequencyCode);
                        this.setControlValue('InvoiceAnnivDate', this.contractTableObj.InvoiceAnnivDate);
                        this.setControlValue('NegBranchNumber', this.contractTableObj.NegBranchNumber);
                        this.setControlValue('AccountNumber', this.accountTableObj.AccountNumber);
                        this.setControlValue('AccountName', this.accountTableObj.AccountName);
                        this.setControlValue('NegBranchName', this.branchTableObj.BranchName);
                    }
                } else {
                    if (branchCode)
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.recordNotFound));
                    else
                        this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.PageSpecificMessage.notSuccessfull));
                }
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //this is used to populate status dropdown
    private buildStatusOptions(): void {
        this.statusSearchTypeoDropdownValues.push({ text: 'All', value: '' });
        this.statusSearchTypeoDropdownValues.push({ text: 'Current', value: 'L' });
        this.statusSearchTypeoDropdownValues.push({ text: 'Forward Current', value: 'FL' });
        this.statusSearchTypeoDropdownValues.push({ text: 'Deleted', value: 'D' });
        this.statusSearchTypeoDropdownValues.push({ text: 'Forward Deleted', value: 'FD' });
        this.statusSearchTypeoDropdownValues.push({ text: 'Pending Deletion', value: 'PT' });
        this.statusSearchTypeoDropdownValues.push({ text: 'Terminated', value: 'T' });
        this.statusSearchTypeoDropdownValues.push({ text: 'Forward Terminated', value: 'FT' });
        this.statusSearchTypeoDropdownValues.push({ text: 'Pending Termination', value: 'PT' });
        this.statusSearchTypeoDropdownValues.push({ text: 'Cancelled', value: 'C' });
    }

    //this function is used to populate the Annual value control display properties
    private setAnnualValueField(): void {
        this.utils.getLoggedInBranch().subscribe((data) => {
            if (data && data.results && data.results[0] && data.results[0][0]) {
                this.loggedInBranch = data.results[0][0].BranchNumber;
                if ((this.contractTableObj.NegBranchNumber !== this.loggedInBranch) && (this.userAccess === 'Restricted')) {
                    this.tdAnnualValue = false;
                }
            }
            this.buildGrid();
            this.buildStatusOptions();
        });
    }

    //this is a function to load onload properties after system chars are loaded.
    private windowOnload(): void {
        this.utils.setTitle(this.browserTitle);
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
        this.setControlValue('PremiseAnnualValue', this.riExchange.getParentHTMLValue('PremiseAnnualValue'));
        this.setControlValue('ServiceBranchNumber', this.riExchange.getParentHTMLValue('ServiceBranchNumber'));
        this.getBranchFields(this.riExchange.getParentHTMLValue('ServiceBranchNumber'));
        this.getContractFields();
        this.utils.getUserAccessType().subscribe((data) => {
            if (data) {
                this.userAccess = data;
                this.setAnnualValueField();
            }
        });
    }

    private onSysCharDataReceive(e: any): void {
        if (e.records && e.records.length > 0) {
            this.iSvSCEnableWorkLoadIndex = e.records[0].Required;
            this.iSvSCEnableMonthlyUnitPrice = e.records[1].Required;
            if (this.iSvSCEnableWorkLoadIndex) {
                this.vbReqWIT = 'Yes';
            }
            if (this.iSvSCEnableMonthlyUnitPrice) {
                this.vbReqMUP = 'Yes';
            }
        }
        this.windowOnload();
    }

    private fetchSysChar(sysCharNumbers: any): any {
        let querySysChar: URLSearchParams = new URLSearchParams();
        querySysChar.set(this.serviceConstants.Action, '0');
        querySysChar.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        querySysChar.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        querySysChar.set(this.serviceConstants.SystemCharNumber, sysCharNumbers);
        return this.httpService.sysCharRequest(querySysChar);
    }

    private sysCharParameters(): string {
        let sysCharList: Array<any> = [
            this.sysCharConstants.SystemCharEnableWorkLoadIndex,
            this.sysCharConstants.SystemCharEnableMonthlyUnitPrice
        ];
        return sysCharList.join(',');
    }

    private triggerFetchSysChar(): any {
        let sysCharNumbers: string = this.sysCharParameters();
        this.fetchSysChar(sysCharNumbers).subscribe((data) => {
            this.onSysCharDataReceive(data);
        });
    }

    private setAttributes(trData: Array<Object>): void {
        let addElementNumber = 0;
        let addElementNumber2 = 0;
        if (this.vbReqWIT === 'Yes')
            addElementNumber = 1;
        if (this.vbReqMUP === 'Yes')
            addElementNumber2 = 1;
        this.setAttribute('ProductCode', trData[0]['text']);
        this.setAttribute('ProductDesc', trData[1]['text']);
        this.setAttribute('ServiceCoverRowID', trData[0]['additionalData']);
        this.setControlValue('ProductCode', trData[0]['text']);
        this.setControlValue('ProductDesc', trData[1]['text']);
        this.setControlValue('ServiceVisitAnnivDate', trData[3]['text']);
        this.setControlValue('ServiceVisitFrequency', trData[(8 + addElementNumber + addElementNumber2)]['text']);
    }

    //updating grid elements
    private updateGrid(event: Event): void {
        let getRequestParrams: any = this.getURLSearchParamObject();
        this.isRefreshDisabled = true;
        this.isPaginationDisabled = true;
        getRequestParrams.set(this.serviceConstants.Action, '0');
        getRequestParrams.set('ProdCode', this.riGrid.Details.GetValue('ProdCode'));
        getRequestParrams.set('ProdDesc', this.riGrid.Details.GetValue('ProdDesc'));
        getRequestParrams.set('ServiceCommenceDate', this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('ServiceCommenceDate')));
        getRequestParrams.set('VisitAnnivDate', this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('VisitAnnivDate')));
        getRequestParrams.set('ServiceAreaCode', this.riGrid.Details.GetValue('ServiceAreaCode'));
        getRequestParrams.set('WorkLoadIndexTotal', this.riGrid.Details.GetValue('WorkLoadIndexTotal'));
        getRequestParrams.set('LastChangeEffectDateRowID', '1');
        getRequestParrams.set('LastChangeEffectDate', this.globalize.parseDateToFixedFormat(this.riGrid.Details.GetValue('LastChangeEffectDate')));
        getRequestParrams.set('OldServiceQuantity', this.riGrid.Details.GetValue('OldServiceQuantity'));
        getRequestParrams.set('ServiceQuantityRowID', this.riGrid.bodyArray[this.riGrid.CurrentRow][0]['additionalData']);
        getRequestParrams.set('ServiceQuantity', this.riGrid.Details.GetValue('ServiceQuantity'));
        getRequestParrams.set('OldServiceVisitFrequency', this.riGrid.Details.GetValue('OldServiceVisitFrequency'));
        getRequestParrams.set('VisitFrequencyRowID', this.riGrid.bodyArray[this.riGrid.CurrentRow][0]['additionalData']);
        getRequestParrams.set('VisitFrequency', this.riGrid.Details.GetValue('VisitFrequency'));
        getRequestParrams.set('OldServiceAnnualValue', this.globalize.parseCurrencyToFixedFormat(this.riGrid.Details.GetValue('OldServiceAnnualValue')));
        getRequestParrams.set('ServiceAnnualValueRowID', this.riGrid.bodyArray[this.riGrid.CurrentRow][0]['additionalData']);
        getRequestParrams.set('ServiceAnnualValue', this.globalize.parseCurrencyToFixedFormat(this.riGrid.Details.GetValue('ServiceAnnualValue')));
        getRequestParrams.set('Status', this.riGrid.Details.GetValue('Status'));
        getRequestParrams.set('FullAccess', this.userAccess);
        getRequestParrams.set('LoggedInBranch', this.loggedInBranch);
        getRequestParrams.set('ContractNumber', this.getControlValue('ContractNumber'));
        getRequestParrams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        getRequestParrams.set('PortfolioStatusCode', this.getControlValue('StatusSearchType'));
        getRequestParrams.set('EnableWorkLoadIndex', this.vbReqWIT);
        getRequestParrams.set('EnableMonthlyUnitPrice', this.vbReqMUP);
        getRequestParrams.set('Mode', 'Update');
        getRequestParrams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        getRequestParrams.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        getRequestParrams.set(this.serviceConstants.GridMode, '3');
        getRequestParrams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, getRequestParrams)
            .subscribe(
            (data) => {
                this.isRefreshDisabled = false;
                this.isPaginationDisabled = false;
                if (data) {
                    this.riGrid.Mode = MntConst.eModeNormal;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
                if (data['errorMessage'])
                    this.modalAdvService.emitMessage(new ICabsModalVO(data['errorMessage'], data['fullError']));
                if (data['body'] && data['body']['cells'] && (data['body']['cells'].length < 1))
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
            },
            error => {
                this.riGrid.Mode = MntConst.eModeNormal;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
            });
    }

    private buildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('ProdCode', 'ServiceCoverUpdateable', 'ProdCode', MntConst.eTypeCode, 10, true);
        this.riGrid.AddColumnAlign('ProdCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnUpdateSupport('ProdCode', false);

        this.riGrid.AddColumn('ProdDesc', 'ServiceCoverUpdateable', 'ProdDesc', MntConst.eTypeText, 40);
        this.riGrid.AddColumnAlign('ProdDesc', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnUpdateSupport('ProdDesc', false);

        this.riGrid.AddColumn('ServiceCommenceDate', 'ServiceCoverUpdateable', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('ServiceCommenceDate', false);

        this.riGrid.AddColumn('VisitAnnivDate', 'ServiceCoverUpdateable', 'VisitAnnivDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('VisitAnnivDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('VisitAnnivDate', false);

        this.riGrid.AddColumn('ServiceAreaCode', 'ServiceCoverUpdateable', 'ServiceAreaCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumnAlign('ServiceAreacode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('ServiceAreaCode', false);

        if (this.vbReqWIT === 'Yes') {
            this.riGrid.AddColumn('WorkLoadIndexTotal', 'ServiceCoverUpdateable', 'WorkLoadIndexTotal', MntConst.eTypeDecimal2, 5);
            this.riGrid.AddColumnAlign('WorkLoadIndexTotal', MntConst.eAlignmentRight);
            this.riGrid.AddColumnUpdateSupport('WorkLoadIndexTotal', false);
        }

        if (this.vbReqMUP === 'Yes') {
            this.riGrid.AddColumn('MonthlyUnitPrice', 'ServiceCoverUpdateable', 'MonthlyUnitPrice', MntConst.eTypeCurrency, 5);
            this.riGrid.AddColumnAlign('MonthlyUnitPrice', MntConst.eAlignmentRight);
            this.riGrid.AddColumnUpdateSupport('MonthlyUnitPrice', false);
        }

        this.riGrid.AddColumn('LastChangeEffectDate', 'ServiceCoverUpdateable', 'LastChangeEffectDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('LastChangeEffectDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('LastChangeEffectDate', true);

        this.riGrid.AddColumn('OldServiceQuantity', 'ServiceCoverUpdateable', 'OldServiceQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('OldServiceQuantity', MntConst.eAlignmentRight);
        this.riGrid.AddColumnUpdateSupport('OldServiceQuantity', false);

        this.riGrid.AddColumn('ServiceQuantity', 'ServiceCoverUpdateable', 'ServiceQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentRight);
        this.riGrid.AddColumnUpdateSupport('ServiceQuantity', true);

        this.riGrid.AddColumn('OldServiceVisitFrequency', 'ServiceCoverUpdateable', 'OldServiceVisitFrequency', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('OldServiceVisitFrequency', MntConst.eAlignmentRight);
        this.riGrid.AddColumnUpdateSupport('OldServiceVisitFrequency', true);

        this.riGrid.AddColumn('VisitFrequency', 'ServiceCoverUpdateable', 'VisitFrequency', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumnAlign('VisitFrequency', MntConst.eAlignmentRight);
        this.riGrid.AddColumnUpdateSupport('VisitFrequency', true);

        this.riGrid.AddColumn('OldServiceAnnualValue', 'ServiceCoverUpdateable', 'OldServiceAnnualValue', MntConst.eTypeCurrency, 23, true);
        this.riGrid.AddColumnAlign('OldServiceAnnualValue', MntConst.eAlignmentRight);;
        this.riGrid.AddColumnUpdateSupport('OldServiceAnnualValue', true);

        this.riGrid.AddColumn('ServiceAnnualValue', 'ServiceCoverUpdateable', 'ServiceAnnualValue', MntConst.eTypeCurrency, 23);
        this.riGrid.AddColumnAlign('ServiceAnnualValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumnUpdateSupport('ServiceAnnualValue', true);

        this.riGrid.AddColumn('Status', 'ServiceCoverUpdateable', 'Status', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('Status', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnUpdateSupport('Status', false);

        this.riGrid.AddColumn('AddServiceVisit', 'ServiceVisit', 'AddServiceVisit', MntConst.eTypeImage, 1, true);
        this.riGrid.AddColumnAlign('AddServiceVisit', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnUpdateSupport('AddServiceVisit', false);

        //Add Column Sorting
        this.riGrid.AddColumnOrderable('ProdCode', true);
        this.riGrid.AddColumnOrderable('ServiceCommenceDate', true);
        this.riGrid.AddColumnOrderable('ServiceAreaCode', true);

        this.riGrid.Complete();
        this.loadGridData();
    }

    private loadGridData(): void {
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;

        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.search.set(this.serviceConstants.LanguageCode, this.riExchange.LanguageCode());
        this.search.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.gridParams.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.search.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set('FullAccess', this.userAccess);
        this.search.set('LoggedInBranch', this.loggedInBranch);
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('EnableWorkLoadIndex', this.vbReqWIT);
        this.search.set('EnableMonthlyUnitPrice', this.vbReqMUP);
        this.search.set('PortfolioStatusCode', this.getControlValue('StatusSearchType'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.search)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage));
                else {
                    this.gridParams.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.gridParams.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.UpdateFooter = true;
                    this.isRequesting = true;
                    this.riGrid.Execute(data);
                    if (data.pageData && (data.pageData.lastPageNumber * 10) > 0)
                        this.isHidePagination = false;
                    else
                        this.isHidePagination = true;
                }
                this.isRequesting = false;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.gridParams.totalRecords = 1;
                this.modalAdvService.emitError(new ICabsModalVO(error));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    //on add record the page is navigating to service cover maintenance.
    public cmdAddRecordOnclick(): void {
        this.navigate('SearchAdd', AppModuleRoutes.SERVICECOVERMAINTENANCE + ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE_SUB, {
            CurrentContractTypeURLParameter: this.utils.getCurrentContractType(this.riExchange.routerParams['CurrentContractTypeURLParameter']),
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            Status: this.riGrid.Details.GetValue('Status'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            PremiseName: this.getControlValue('PremiseName'),
            ProductCode: this.getControlValue('ProductCode'),
            ProductDesc: this.getControlValue('ProductDesc'),
            AccountNumber: this.getControlValue('AccountNumber'),
            AccountName: this.getControlValue('AccountName')
        });
    }

    //menu onchange functionalities
    public menuOnchange(menu: any): void {
        switch (menu) {
            case 'AddRecord':
                this.cmdAddRecordOnclick();
                break;
            default:
                break;
        }
    }

    //status dropdown onchange functionalities
    public statusSearchTypeOnchange(): void {
        this.riGrid.RefreshRequired();
    }

    public getCurrentPage(currentPage: any): void {
        this.gridParams.pageCurrent = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.gridParams.pageCurrent));
        this.buildGrid();
    }

    public riGridSort(event: any): void {
        this.loadGridData();
    }

    //euqivalent to VB tbodyServiceCoverUpdateable_onDblClick function
    public riGridBodyOnDblClick(event: any): void {
        let currentColumnName = this.riGrid.CurrentColumnName;
        let currentRowIndex = this.riGrid.CurrentRow;
        let rowData = this.riGrid.bodyArray[currentRowIndex];
        this.setAttributes(rowData);
        switch (currentColumnName) {
            case 'ProdCode':
                this.navigate('Search', ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCECONTRACT, {
                    CurrentContractTypeURLParameter: this.utils.getCurrentContractType(this.riExchange.routerParams['CurrentContractTypeURLParameter']),
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    Status: this.riGrid.Details.GetValue('Status'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    PremiseName: this.getControlValue('PremiseName'),
                    ProductCode: this.getControlValue('ProductCode'),
                    ProductDesc: this.getControlValue('ProductDesc'),
                    AccountNumber: this.getControlValue('AccountNumber'),
                    AccountName: this.getControlValue('AccountName'),
                    ServiceCoverRowID: this.getAttribute('ServiceCoverRowID')
                });
                break;
            case 'OldServiceAnnualValue':
                this.navigate('Premise-ServiceSummary', InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID, {
                    CurrentContractTypeURLParameter: this.utils.getCurrentContractType(this.riExchange.routerParams['CurrentContractTypeURLParameter']),
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    Status: this.riGrid.Details.GetValue('Status'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    PremiseName: this.getControlValue('PremiseName'),
                    ProductCode: this.getControlValue('ProductCode'),
                    ProductDesc: this.getControlValue('ProductDesc'),
                    AccountNumber: this.getControlValue('AccountNumber'),
                    AccountName: this.getControlValue('AccountName')
                });
                break;
            case 'AddServiceVisit':
                this.navigate('ServiceVisitEntryGrid', InternalMaintenanceServiceModuleRoutes.ICABSSESERVICEVISITMAINTENANCE, {
                    CurrentContractTypeURLParameter: this.utils.getCurrentContractType(this.riExchange.routerParams['CurrentContractTypeURLParameter']),
                    ServiceCoverRowID: this.getAttribute('ServiceCoverRowID'),
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    PremiseNumber: this.getControlValue('PremiseNumber'),
                    PremiseName: this.getControlValue('PremiseName'),
                    ProductCode: this.getControlValue('ProductCode'),
                    ProductDesc: this.getControlValue('ProductDesc')
                });
                break;
            default:
                break;
        }
    }

    //grid refresh functionality
    public refresh(): void {
        this.buildGrid();
    }

    public onCellBlur(data: any): void {
        let currentCellIndex = this.riGrid.CurrentCell;
        let currentRowIndex = this.riGrid.CurrentRow;
        let rowData = this.riGrid.bodyArray[currentRowIndex];
        let newValue: string = data.target.value;
        this.updateGrid(event);
    }
}
