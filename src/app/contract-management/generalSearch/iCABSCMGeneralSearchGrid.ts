import { Component, OnDestroy, OnInit, Injector, ViewChild } from '@angular/core';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { AppModuleRoutes, BillToCashModuleRoutes, InternalGridSearchServiceModuleRoutes, InternalMaintenanceServiceModuleRoutes, ContractManagementModuleRoutes, ProspectToContractModuleRoutes } from './../../base/PageRoutes';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { ErrorConstant } from '../../../shared/constants/error.constant';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { GroupAccountNumberComponent } from '../../internal/search/iCABSSGroupAccountNumberSearch';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { ProductServiceGroupSearchComponent } from './../../internal/search/iCABSBProductServiceGroupSearch.component';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSCMGeneralSearchGrid.html'
})

export class GeneralSearchGridComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('ddProductServiceGroupSearch') ddProductServiceGroupSearch: ProductServiceGroupSearchComponent;

    private pageCurrent: number = 1;
    private iNumOfCols: number;
    private isReqProductServiceGroups: boolean;
    private lookupParams: any = this.getURLSearchParamObject();
    private search = this.getURLSearchParamObject();
    private queryParams: any = {
        operation: 'ContactManagement/iCABSCMGeneralSearchGrid',
        module: 'search',
        method: 'contract-management/maintenance'
    };
    private vBusinessContractTypeCodes: any;
    private pageMessageModal: ICabsModalVO;
    private vContractPortfolioStatusDescs: Array<any> = [];
    private vPremisePortfolioStatusDescs: Array<any> = [];
    private vProductPortfolioStatusDescs: Array<any> = [];
    private vProspectStatusDescs: Array<any> = [];
    private arrayvContractPortfolioStatusCodes: Array<any> = [];
    private arrayvPremisePortfolioStatusCodes: Array<any> = [];
    private arrayvProductSalePortfolioStatusCodes: Array<any> = [];
    private arrayvProspectStatusCodes: Array<any> = [];

    public showCloseButton: boolean = true;
    public searchValueProperty: any = { 'maxLength': 50, 'spanSearchValueText': '' };
    public searchWhatProperty: Array<any> = [];
    public showHideSelectCell: any = {
        'SearchWhat': false,
        'JobStatus': false,
        'ContractStatus': false,
        'PremiseStatus': false,
        'ProductSaleStatus': false,
        'ProspectStatus': false
    };
    public itemsPerPage: number = 10;
    public totalRecords: number = 1;
    public currentPage: number = 1;
    public pageId: string = '';
    public isSearchValue3: boolean = false;
    public isReqInvoiceGroups: boolean;
    public vbReqProspects: any;
    public spanSearchValue3Text: any;
    public isDateFrom: boolean;
    public isDateTo: boolean;
    public contractDropDown: Array<any> = [];
    public premiseDropDown: Array<any> = [];
    public productDropDown: Array<any> = [];
    public prospectDropDown: Array<any> = [];
    public searchValue2maxLength: number = 50;
    public isSearchInfo: boolean = false;
    public isSearchValue2: boolean;
    public spanSearchValue2Text: any;
    public isShowEllipsis: boolean = false;
    public dropdownConfig = {
        branchSearch: {
            isDisabled: false,
            inputParams: {},
            selected: { id: this.utils.getBranchCode(), text: this.utils.getBranchText(this.utils.getBranchCode()) }
        },
        ProductServiceGroupSearch: {
            params: {
                parentMode: 'LookUp',
                ProductServiceGroupString: '',
                SearchValue3: '',
                ProductServiceGroupCode: ''
            },
            active: { id: '', text: '' },
            isDisabled: false,
            isRequired: false
        }
    };
    public controls = [
        { name: 'SearchOn' },
        { name: 'SearchValue', type: MntConst.eTypeText },
        { name: 'SearchValue2', type: MntConst.eTypeInteger },
        { name: 'SearchValue3', type: MntConst.eTypeCode },
        { name: 'JobStatus', value: 'all' },
        { name: 'ContractStatus', value: 'all' },
        { name: 'PremiseStatus', value: 'all' },
        { name: 'ProductSaleStatus', value: 'all' },
        { name: 'menu' },
        { name: 'ProspectStatus', value: 'all' },
        { name: 'BranchNumber', type: MntConst.eTypeInteger },
        { name: 'DateFrom', type: MntConst.eTypeDate },
        { name: 'DateTo', type: MntConst.eTypeDate },
        { name: 'SearchWhat', value: 'all' }
    ];
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public ellipsis = {
        searchValueEllipsis: {
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'GeneralSearch-Lookup',
                'showAddNew': false,
                'showAddNewDisplay': false
            },
            component: null
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMGENERALSEARCHGRID;
        this.browserTitle = 'General Search';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        this.setControlValue('SearchWhat', 'ContractPremises');
        if (this.pageParams.vEnableProspects === true) {
            this.vbReqProspects = true;
        }
        else {
            this.vbReqProspects = false;
        }
        if (this.pageParams.vEnableInvoiceGroups === true) {
            this.isReqInvoiceGroups = true;
        }
        else {
            this.isReqInvoiceGroups = false;
        }
        if (this.pageParams.vEnableProductServiceGroups === true) {
            this.isReqProductServiceGroups = true;
        }
        else {
            this.isReqProductServiceGroups = false;
        }

        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        if (this.isReqProductServiceGroups) {
            this.isSearchValue3 = true;
        }
        this.onChangeSearch();
        this.fillSearchWhatMenu();
        if (this.isReturning()) {
            this.dropdownConfig.branchSearch.selected = { id: this.formData.BranchNumber, text: this.utils.getBranchText(this.formData.BranchNumber) };
            this.populateUIFromFormData();
        }
        this.setControlValue('menu', 'options');
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableGeneralSearchToUseMatches,
            this.sysCharConstants.SystemCharEnableProspectOnGeneralSearch,
            this.sysCharConstants.SystemCharEnableInvoiceGroupOnGeneralSearch,
            this.sysCharConstants.SystemCharEnableProductGroupOnGeneralSearch,
            this.sysCharConstants.SystemCharEnablePostcodeDefaulting,
            this.sysCharConstants.SystemCharShowPremiseWasteTab
        ];

        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };

        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vEnableGeneralSearchToUseMatches = record[0]['Required'];
            this.pageParams.vEnableProspects = record[1]['Required'];
            this.pageParams.vEnableInvoiceGroups = record[2]['Required'];
            this.pageParams.vEnableProductServiceGroups = record[3]['Required'];
            this.pageParams.vEnablePostcodeDefaulting = record[4]['Required'];
            this.pageParams.vShowPremiseWasteTab = record[5]['Required'];
            this.setControlValue('SearchOn', this.pageParams.vEnablePostcodeDefaulting ? 'PostCode' : 'Name');
            this.windowOnLoad();
        });
        this.configureDynamicDropdowns();
    }

    private configureDynamicDropdowns(): any {
        this.arrayvContractPortfolioStatusCodes = ['L', 'FL', 'FT', 'PT', 'T', 'C'];
        this.arrayvPremisePortfolioStatusCodes = ['L', 'FL', 'FT', 'FD', 'PT', 'PD', 'T', 'D', 'C'];
        this.arrayvProductSalePortfolioStatusCodes = ['L', 'SP', 'SD'];
        this.arrayvProspectStatusCodes = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

        let ContractTypeData: Array<any> = [{
            'table': 'ContractType',
            'query': {
                'BusinessCode': this.utils.getBusinessCode()
            },
            'fields': [
                'ContractTypeCode'
            ]
        }];

        let arrayOfArrays: any = [this.arrayvContractPortfolioStatusCodes, this.arrayvPremisePortfolioStatusCodes, this.arrayvProductSalePortfolioStatusCodes];
        for (let j = 0; j < arrayOfArrays.length; j++) {
            let individualArrays: any = arrayOfArrays[j];
            for (let i = 0; i < individualArrays.length; i++) {
                ContractTypeData.push({
                    'table': 'PortfolioStatusLang',
                    'query': {
                        'LanguageCode': this.riExchange.LanguageCode(),
                        'PortfolioStatusCode': individualArrays[i]
                    },
                    'fields': [
                        'PortfolioStatusDesc'
                    ]
                },
                    {
                        'table': 'PortfolioStatus',
                        'query': {
                            'LanguageCode': this.riExchange.LanguageCode(),
                            'PortfolioStatusCode': individualArrays[i]
                        },
                        'fields': [
                            'PortfolioStatusDesc'
                        ]
                    });
            }
        }
        for (let i = 0; i < this.arrayvProspectStatusCodes.length; i++) {
            ContractTypeData.push({
                'table': 'ProspectStatusLang',
                'query': {
                    'LanguageCode': this.riExchange.LanguageCode(),
                    'ProspectStatusCode': this.arrayvProspectStatusCodes[i]
                },
                'fields': [
                    'ProspectStatusDesc'
                ]
            },
                {
                    'table': 'ProspectStatus',
                    'query': {
                        'LanguageCode': this.riExchange.LanguageCode(),
                        'ProspectStatusCode': this.arrayvProspectStatusCodes[i]
                    },
                    'fields': [
                        'ProspectStatusDesc'
                    ]
                });
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpRecord(ContractTypeData, 100).subscribe(
            (e) => {
                let vContractPortfolioStatusDescsFirst: any = [];
                let vContractPortfolioStatusDescsSecond: any = [];
                let vPremisePortfolioStatusDescsFirst: any = [];
                let vPremisePortfolioStatusDescsSecond: any = [];
                let vProductPortfolioStatusDescsFirst: any = [];
                let vProductPortfolioStatusDescsSecond: any = [];
                let vProspectStatusDescFirst: any = [];
                let vProspectStatusDescSecond: any = [];
                let datafetched = e['results'];
                this.vBusinessContractTypeCodes = datafetched[0];

                this.vBusinessContractTypeCodes = new Array(this.vBusinessContractTypeCodes[0].ContractTypeCode, this.vBusinessContractTypeCodes[1].ContractTypeCode, this.vBusinessContractTypeCodes[2].ContractTypeCode);

                for (let j = 1; j <= 6; j++) {
                    vContractPortfolioStatusDescsFirst.push(datafetched[j][0].PortfolioStatusDesc);
                }
                for (let j = 7; j <= 12; j++) {
                    vContractPortfolioStatusDescsSecond.push(datafetched[j][0].PortfolioStatusDesc);
                }
                this.vContractPortfolioStatusDescs = vContractPortfolioStatusDescsFirst.concat(vContractPortfolioStatusDescsSecond);
                this.vContractPortfolioStatusDescs = this.vContractPortfolioStatusDescs.filter(function (element: any): any {
                    return element !== undefined;
                });

                for (let j = 13; j <= 21; j++) {
                    vPremisePortfolioStatusDescsFirst.push(datafetched[j][0].PortfolioStatusDesc);
                }
                for (let j = 22; j <= 30; j++) {
                    vPremisePortfolioStatusDescsSecond.push(datafetched[j][0].PortfolioStatusDesc);
                }
                this.vPremisePortfolioStatusDescs = vPremisePortfolioStatusDescsFirst.concat(vPremisePortfolioStatusDescsSecond);
                this.vPremisePortfolioStatusDescs = this.vPremisePortfolioStatusDescs.filter(function (element: any): any {
                    return element !== undefined;
                });
                for (let j = 31; j <= 33; j++) {
                    vProductPortfolioStatusDescsFirst.push(datafetched[j][0].PortfolioStatusDesc);
                }
                for (let j = 34; j <= 36; j++) {
                    vProductPortfolioStatusDescsSecond.push(datafetched[j][0].PortfolioStatusDesc);
                }
                this.vProductPortfolioStatusDescs = vProductPortfolioStatusDescsFirst.concat(vProductPortfolioStatusDescsSecond);
                this.vProductPortfolioStatusDescs = this.vProductPortfolioStatusDescs.filter(function (element: any): any {
                    return element !== undefined;
                });

                for (let j = 37; j <= 46; j++) {
                    vProspectStatusDescFirst.push(datafetched[j][0].ProspectStatusDesc);
                }
                for (let j = 47; j <= 56; j++) {
                    vProspectStatusDescSecond.push(datafetched[j][0].ProspectStatusDesc);
                }
                this.vProspectStatusDescs = vProspectStatusDescFirst.concat(vProspectStatusDescSecond);
                this.vProspectStatusDescs = this.vProspectStatusDescs.filter(function (element: any): any {
                    return element !== undefined;
                });
                for (let i = 0; i < this.arrayvContractPortfolioStatusCodes.length; i++) {
                    this.contractDropDown.push({ text: this.vContractPortfolioStatusDescs[i], value: this.arrayvContractPortfolioStatusCodes[i] });
                }
                for (let i = 0; i < this.arrayvPremisePortfolioStatusCodes.length; i++) {
                    this.premiseDropDown.push({ text: this.vPremisePortfolioStatusDescs[i], value: this.arrayvPremisePortfolioStatusCodes[i] });
                }
                for (let i = 0; i < this.arrayvProductSalePortfolioStatusCodes.length; i++) {
                    this.productDropDown.push({ text: this.vProductPortfolioStatusDescs[i], value: this.arrayvProductSalePortfolioStatusCodes[i] });
                }
                for (let i = 0; i < this.arrayvProspectStatusCodes.length; i++) {
                    this.prospectDropDown.push({ text: this.vProspectStatusDescs[i], value: this.arrayvProspectStatusCodes[i] });
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.windowOnLoad();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));

            });
    }

    private lookUpRecord(data: any, maxresults: any): any {
        this.lookupParams.set(this.serviceConstants.Action, '0');
        if (maxresults) {
            this.lookupParams.set(this.serviceConstants.MaxResults, maxresults.toString());
        }
        if (data)
            return this.httpService.lookUpRequest(this.lookupParams, data);
    }

    private fillSearchWhatMenu(): void {
        let varSearchOnVal: any = this.getControlValue('SearchOn');
        this.searchWhatProperty = [];
        this.searchWhatProperty.push({ 'text': 'All', 'value': 'All', 'index': 0, 'selected': false });


        if (varSearchOnVal !== 'Area' && varSearchOnVal !== 'AreaSeq' && varSearchOnVal !== 'ClientRef') {
            this.searchWhatProperty.push({
                'text': 'Accounts', 'value': 'Accounts', 'index': 1, 'selected': false
            });
        }
        if (this.vBusinessContractTypeCodes && this.vBusinessContractTypeCodes.length) {
            for (let i = 0; i < this.vBusinessContractTypeCodes.length; i++) {
                switch (this.vBusinessContractTypeCodes[i]) {
                    case 'C':
                        if (varSearchOnVal !== 'Area' && varSearchOnVal !== 'AreaSeq' && varSearchOnVal !== 'ClientRef') {
                            this.searchWhatProperty.push({ 'text': 'Contracts', 'value': 'Contracts', 'index': 2, 'selected': false });
                        }
                        this.searchWhatProperty.push({ 'text': 'Premises (Con)', 'value': 'ContractPremises', 'index': 5, 'selected': true });
                        break;

                    case 'J':
                        if (varSearchOnVal !== 'Area' && varSearchOnVal !== 'AreaSeq' && varSearchOnVal !== 'ClientRef') {
                            this.searchWhatProperty.push({ 'text': 'Jobs', 'value': 'Jobs', 'index': 3, 'selected': false });
                        }
                        this.searchWhatProperty.push({ 'text': 'Premises (Job)', 'value': 'JobPremises', 'index': 6, 'selected': false });
                        break;
                    case 'P':
                        if (varSearchOnVal !== 'Area' && varSearchOnVal !== 'AreaSeq' && varSearchOnVal !== 'ClientRef') {
                            this.searchWhatProperty.push({ 'text': 'Product Sales', 'value': 'ProductSales', 'index': 4, 'selected': false });
                        }
                        this.searchWhatProperty.push({ 'text': 'Premises (Sales)', 'value': 'ProductPremises', 'index': 7, 'selected': false });
                        break;
                }
            }

        }

        if (this.vbReqProspects && varSearchOnVal !== 'Account' && varSearchOnVal !== 'GroupAccountNumber' && varSearchOnVal !== 'Area' && varSearchOnVal !== 'AreaSeq' && varSearchOnVal !== 'TaxReg' && varSearchOnVal !== 'ClientRef') {
            this.searchWhatProperty.push({ 'text': 'Prospects', 'value': 'Prospects', 'index': 8, 'selected': false });
        }

        if (this.isReqInvoiceGroups && varSearchOnVal !== 'Area' && varSearchOnVal !== 'AreaSeq' && varSearchOnVal !== 'ClientRef') {
            this.searchWhatProperty.push({ 'text': 'Invoice Groups', 'value': 'InvoiceGroups', 'index': 9, 'selected': false });
        }

        this.onChangeSearchWhat();

    }

    private buildGrid(): void {
        let varSearchOnVal: any = this.getControlValue('SearchOn');
        this.iNumOfCols = 0;
        this.riGrid.Clear();
        if (this.getControlValue('SearchWhat') !== 'Prospects') {
            this.iNumOfCols = this.iNumOfCols + 1;
            this.riGrid.AddColumn('AccountNumber', 'AccountNumber', 'AccountNumber', MntConst.eTypeCode, 9);
            this.riGrid.AddColumnAlign('AccountNumber', MntConst.eAlignmentCenter);
        }
        if (this.getControlValue('SearchWhat') === 'All' || this.getControlValue('SearchWhat') === 'Contracts' || this.getControlValue('SearchWhat') === 'Jobs' || this.getControlValue('SearchWhat') === 'ProductSales' || this.getControlValue('SearchWhat') === 'ContractPremises' || this.getControlValue('SearchWhat') === 'JobPremises' || this.getControlValue('SearchWhat') === 'ProductPremises') {
            this.iNumOfCols = this.iNumOfCols + 1;
            this.riGrid.AddColumn('ContractNumber', 'ContractNumber', 'ContractNumber', MntConst.eTypeCode, 10);
            this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        }
        if (varSearchOnVal === 'ContractRef') {
            this.iNumOfCols = this.iNumOfCols + 1;
            this.riGrid.AddColumn('ContractRef', 'ContractRef', 'ContractRef', MntConst.eTypeTextFree, 20);
        }
        else {
            if (this.getControlValue('SearchWhat') === 'All' || this.getControlValue('SearchWhat') === 'ContractPremises' || this.getControlValue('SearchWhat') === 'JobPremises' || this.getControlValue('SearchWhat') === 'ProductPremises') {
                this.iNumOfCols = this.iNumOfCols + 1;
                this.riGrid.AddColumn('PremiseNumber', 'PremiseNumber', 'PremiseNumber', MntConst.eTypeInteger, 4);
                this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
            }

            if (varSearchOnVal === 'PremiseWasteRegNo') {
                this.iNumOfCols = this.iNumOfCols + 1;
                this.riGrid.AddColumn('PremiseWasteRegNo', 'PremiseWasteRegNo', 'PremiseWasteRegNo', MntConst.eTypeTextFree, 20);
            }

            if (varSearchOnVal === 'ClientRef') {
                this.iNumOfCols = this.iNumOfCols + 1;
                this.riGrid.AddColumn('ClientRef', 'ClientRef', 'ClientRef', MntConst.eTypeTextFree, 20);
            }
        }
        if (varSearchOnVal === 'Area' || varSearchOnVal === 'AreaSeq') {
            this.iNumOfCols = this.iNumOfCols + 1;
            this.riGrid.AddColumn('ProductCode', 'ProductCode', 'ProductCode', MntConst.eTypeCode, 6);
            this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        }
        if (this.isReqInvoiceGroups && this.getControlValue('SearchWhat') === 'All' || this.getControlValue('SearchWhat') === 'InvoiceGroups') {
            this.iNumOfCols = this.iNumOfCols + 1;
            this.riGrid.AddColumn('InvoiceGroupNumber', 'InvoiceGroupNumber', 'InvoiceGroupNumber', MntConst.eTypeInteger, 9);
            this.riGrid.AddColumnAlign('InvoiceGroupNumber', MntConst.eAlignmentCenter);
        }
        if (this.vbReqProspects && this.getControlValue('SearchWhat') === 'All' || this.getControlValue('SearchWhat') === 'Prospects') {
            this.iNumOfCols = this.iNumOfCols + 1;
            this.riGrid.AddColumn('ProspectNumber', 'ProspectNumber', 'ProspectNumber', MntConst.eTypeInteger, 9);
            this.riGrid.AddColumnAlign('ProspectNumber', MntConst.eAlignmentCenter);
        }
        if (this.getControlValue('SearchWhat') === 'All' || this.getControlValue('SearchWhat') === 'Prospects' || this.getControlValue('SearchWhat') === 'Contracts' || this.getControlValue('SearchWhat') === 'Jobs' || this.getControlValue('SearchWhat') === 'ProductSales' || this.getControlValue('SearchWhat') === 'ContractPremises' || this.getControlValue('SearchWhat') === 'JobPremises' || this.getControlValue('SearchWhat') === 'ProductPremises') {
            this.iNumOfCols = this.iNumOfCols + 1;
            this.riGrid.AddColumn('CommenceDate', 'CommenceDate', 'CommenceDate', MntConst.eTypeDate, 10);
            this.riGrid.AddColumnAlign('CommenceDate', MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('Name', 'Name', 'Name', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('AddressLine1', 'AddressLine1', 'AddressLine1', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('Town', 'Town', 'Town', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('PostCode', 'PostCode', 'PostCode', MntConst.eTypeText, 10);
        if (this.getControlValue('SearchWhat') !== 'Accounts' && this.getControlValue('SearchWhat') !== 'InvoiceGroups') {
            this.riGrid.AddColumn('Status', 'Status', 'Status', MntConst.eTypeText, 10);

            if ((this.getControlValue('BranchNumber')) === '') {
                this.riGrid.AddColumn('BranchNum', 'BranchNum', 'BranchNum', MntConst.eTypeInteger, 3);
                this.riGrid.AddColumnAlign('BranchNum', MntConst.eAlignmentCenter);
            }
            if (this.getControlValue('SearchWhat') !== 'Prospects') {
                this.riGrid.AddColumn('Info', 'Info', 'Info', MntConst.eTypeImage, 10);
            }
        }

        this.riGrid.Complete();
        this.riGridBeforeExecute();
    }

    private riGridBeforeExecute(): void {
        this.riGrid.RefreshRequired();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('Function', 'GeneralSearch');
        this.search.set('SearchOn', this.getControlValue('SearchOn'));
        this.search.set('SearchValue', this.getControlValue('SearchValue'));
        this.search.set('SearchValue2', this.getControlValue('SearchValue2'));
        this.search.set('LanguageCode', this.riExchange.LanguageCode());
        this.search.set('SearchWhat', this.getControlValue('SearchWhat'));
        this.search.set('BranchNumber', this.getControlValue('BranchNumber'));
        let formatteddateFrom: any = this.globalize.parseDateToFixedFormat(this.getControlValue('DateFrom'));
        this.search.set('DateFrom', formatteddateFrom);
        let formatteddateTo: any = this.globalize.parseDateToFixedFormat(this.getControlValue('DateTo'));
        this.search.set('DateTo', formatteddateTo);
        this.search.set('JobStatus', this.getControlValue('JobStatus'));
        this.search.set('ContractStatus', this.getControlValue('ContractStatus'));
        this.search.set('PremiseStatus', this.getControlValue('PremiseStatus'));
        this.search.set('ProductSaleStatus', this.getControlValue('ProductSaleStatus'));
        this.search.set('ProspectStatus', this.getControlValue('ProspectStatus'));
        this.search.set('SearchValue3', this.getControlValue('SearchValue3'));
        this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
        this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, '26609204');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('HeaderClickedColumn', '');
        this.search.set('riCacheRefresh', 'True');
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.queryParams.search)
            .subscribe(
            (data) => {
                if (data) {
                    try {
                        this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                        if (data && data['errorMessage']) {
                            this.pageMessageModal = new ICabsModalVO(data['errorMessage'], data['fullError']);
                            this.pageMessageModal.title = MessageConstant.Message.MessageTitle;
                            this.modalAdvService.emitError(this.pageMessageModal);
                        } else {
                            this.riGrid.Execute(data);
                        }

                    } catch (e) {
                        this.logger.log('Problem in grid load', e);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private selectedRowFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement;
        if (this.riGrid.CurrentColumnName !== 'Info') {
            this.setAttribute('searchValueRow', oTR.sectionRowIndex);
            this.setAttribute('searchValueCell', rsrcElement.parentElement.parentElement.cellIndex);
            this.setAttribute('searchValueRowID', rsrcElement.parentElement.parentElement.getAttribute('additionalproperty'));
            this.setAttribute('searchValueField', rsrcElement.parentElement.parentElement.getAttribute('name'));

            switch (this.riGrid.CurrentColumnName) {
                case 'ContractNumber':
                case 'PremiseNumber':
                case 'ProductCode':
                    this.setAttribute('contractTypeCode', rsrcElement.parentElement.parentElement.getAttribute('additionalproperty'));
                    break;
                case 'InvoiceGroupNumber':
                    let strInvoiceGroupNumberArr: any;
                    strInvoiceGroupNumberArr = rsrcElement.parentElement.parentElement.getAttribute('additionalproperty').split('/');
                    this.setAttribute('accountNumber', strInvoiceGroupNumberArr[0]);
                    this.setAttribute('invoiceGroupNumber', strInvoiceGroupNumberArr[1]);
                    break;
            }
            if (rsrcElement.parentElement.parentElement.getAttribute('id') !== 'AccountNumber' && rsrcElement.parentElement.parentElement.getAttribute('id') !== 'GroupAccountNumber') {
                this.setAttribute('contractTypeCode', rsrcElement.parentElement.parentElement.parentElement.children[this.iNumOfCols].getAttribute('additionalproperty'));
            }
            else {
                this.setAttribute('contractTypeCode', '');
            }
            rsrcElement.focus();
        }
        else {
            this.setAttribute('searchValueImageRowID', rsrcElement.parentElement.parentElement.getAttribute('rowid'));
            this.setAttribute('searchValueRowID', rsrcElement.parentElement.parentElement.getAttribute('rowid'));
        }
    }

    private detail(rsrcElement: any): void {
        let vParam: any;
        if (this.getAttribute('searchValueRowID') !== '') {
            switch (rsrcElement.parentElement.parentElement.getAttribute('name')) {
                case 'ContractNumber':
                case 'PremiseNumber':
                case 'ProductCode':
                    switch (this.getAttribute('contractTypeCode')) {
                        case 'C': vParam = ''; break;
                        case 'J': vParam = '<job>'; break;
                        case 'P': vParam = '<product>'; break;
                    }
                    switch (this.getAttribute('searchValueField')) {
                        case 'ContractNumber':
                            if (vParam === '') {
                                this.navigate('GeneralSearch-Con', ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                                    'parentMode': 'GeneralSearch-Con',
                                    'CurrentContractTypeURLParameter': vParam,
                                    'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1]
                                });
                            }
                            if (vParam === '<job>') {
                                this.navigate('GeneralSearch-Con', ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                                    'parentMode': 'GeneralSearch-Con',
                                    'CurrentContractTypeURLParameter': vParam,
                                    'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1]
                                });
                            }
                            if (vParam === '<product>') {
                                this.navigate('GeneralSearch-Con', ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                                    'parentMode': 'GeneralSearch-Con',
                                    'CurrentContractTypeURLParameter': vParam,
                                    'ContractNumber': this.riGrid.Details.GetValue('ContractNumber').split('/')[1]
                                });
                            }
                            break;

                        case 'PremiseNumber':
                            this.navigate('GeneralSearch', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                                'parentMode': 'GeneralSearch',
                                'CurrentContractTypeURLParameter': vParam,
                                'PremiseNumber': this.riGrid.Details.GetValue('PremiseNumber'),
                                'PremiseRowID': rsrcElement.parentElement.parentElement.getAttribute('additionalproperty'),
                                'ContractTypeCode': this.riGrid.Details.GetValue('ContractNumber').charAt(0)
                            });
                            break;
                        case 'ProductCode':
                            this.navigate('GeneralSearch', ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                                'parentMode': 'GeneralSearch',
                                'CurrentContractTypeURLParameter': vParam,
                                'currentContractType': this.riGrid.Details.GetValue('ContractNumber').charAt(0),
                                'ServiceCoverRowID': rsrcElement.parentElement.parentElement.getAttribute('additionalproperty')
                            });
                            break;
                    }
                    break;
                case 'AccountNumber':
                    this.navigate('GeneralSearch', ContractManagementModuleRoutes.ICABSAACCOUNTMAINTENANCE, {
                        'parentMode': 'GeneralSearch',
                        'AccountRowID': rsrcElement.parentElement.parentElement.getAttribute('additionalproperty')

                    });
                    break;
                case 'ProspectNumber':
                    alert('iCABSCMProspectMaintenance.htm page is not developed yet');
                    // TODO - below navigation path is commented out as page is not developed yet
                    // this.navigate('GeneralSearch', InternalMaintenanceServiceModuleRoutes.ICABSCMPROSPECTMAINTENANCE, {
                    //     'parentMode': 'GeneralSearch',
                    //     'ProspectNumber': this.riGrid.Details.GetValue('ProspectNumber')
                    // });
                    break;
                case 'InvoiceGroupNumber':
                    this.navigate('GeneralSearch', AppModuleRoutes.BILLTOCASH + BillToCashModuleRoutes.ICABSAINVOICEGROUPMAINTENANCE, {
                        'parentMode': 'GeneralSearch',
                        'AccountNumber': this.riGrid.Details.GetValue('AccountNumber'),
                        'InvoiceGroupNumber': this.riGrid.Details.GetValue('InvoiceGroupNumber'),
                        'AccountName': this.getControlValue('Name'),
                        'InvoiceGroupRowID': rsrcElement.parentElement.parentElement.getAttribute('additionalproperty')
                    });
                    break;
                case 'Info':
                    if (this.getAttribute('searchValueImageRowID') !== '') {
                        this.navigate('CMSearch', InternalGridSearchServiceModuleRoutes.ICABSCMGENERALSEARCHINFOGRID, {
                            'parentMode': 'CMSearch',
                            'searchValueImageRowID': this.getAttribute('searchValueImageRowID')
                        });
                    }
                    break;
            }
        }
    }

    private showHideSearchValue2(ipShow: any, ipLabel: any): void {
        if (ipShow) {
            this.isSearchValue2 = true;
            if (ipLabel !== null) {
                this.spanSearchValue2Text = ipLabel;
            }
        }
        else {
            this.isSearchValue2 = false;
        }
    }

    private showHideDateRange(ipShowDateRange: any): void {
        if (ipShowDateRange) {
            this.isDateFrom = true;
            this.isDateTo = true;
        }
        else {
            this.setControlValue('DateTo', '');
            this.setControlValue('DateFrom', '');
            this.isDateFrom = false;
            this.isDateTo = false;
        }

    }

    public onDataReceived(data: any): void {
        this.setControlValue('SearchValue', '');
        if (data) {
            switch (this.getControlValue('SearchOn')) {
                case 'Account':
                    this.setControlValue('SearchValue', data.AccountNumber);
                    break;
                case 'GroupAccountNumber':
                case 'Area':
                case 'AreaSeq':
                    this.setControlValue('SearchValue', data.SearchValue);
                    break;
            }
        }
    }

    public fromDateSelectedValue(value: any): void {
        if (value) {
            this.setControlValue('DateFrom', value.value);
        }
    }

    public toDateSelectedValue(value: any): void {
        if (value) {
            this.setControlValue('DateTo', value.value);
        }
    }

    public onChangeSearchWhat(): void {
        let varSearchWhat: any = this.getControlValue('SearchWhat');
        this.showHideSelectCell.JobStatus = ((varSearchWhat === 'Jobs' || varSearchWhat === 'JobPremises') && (this.showHideSelectCell.SearchWhat === true));
        this.showHideSelectCell.ContractStatus = ((varSearchWhat === 'Contracts') && (this.showHideSelectCell.SearchWhat === true));
        this.showHideSelectCell.PremiseStatus = ((varSearchWhat === 'ContractPremises') && (this.showHideSelectCell.SearchWhat === true));
        this.showHideSelectCell.ProductSaleStatus = ((varSearchWhat === 'ProductSales' ||
            varSearchWhat === 'ProductPremises') && (this.showHideSelectCell.SearchWhat = true));
        this.showHideSelectCell.ProspectStatus = ((varSearchWhat === 'Prospects') && (this.showHideSelectCell.SearchWhat === true));
    }

    public getCurrentPage(currentPage: any): void {
        this.pageCurrent = currentPage.value;
        this.riGridBeforeExecute();
    }

    public onGridCellDoubleClick(event: any): void {
        this.selectedRowFocus(event.srcElement);
        this.detail(event.srcElement);

    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.buildGrid();
    }

    public riGridBodyOnClick(ev: any): void {
        this.selectedRowFocus(ev.srcElement);
    }

    public riGridAfterExecute(): void {
        if (!this.riGrid.Update && this.riGrid.HTMLGridBody) {
            if (this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]) {
                this.selectedRowFocus(this.riGrid.HTMLGridBody.children[0].children[0].children[0].children[0]);
            }
        }
    }

    public riGridBodyOnKeyDown(event: any): void {
        let cellindex = event.srcElement.parentElement.parentElement.cellIndex;
        let rowIndex = event.srcElement.parentElement.parentElement.parentElement.sectionRowIndex;
        switch (event.keyCode) {
            case 13:
                this.detail(event);
                break;
            case 37:
                event.returnValue = 0;
                if ((rowIndex > 0) && (rowIndex < 10)) {
                    this.selectedRowFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[0].children[0].children[0]);
                }
                break;
            case 39:
                event.returnValue = 0;
                if ((rowIndex >= 0) && (rowIndex < 9)) {
                    this.selectedRowFocus(this.riGrid.CurrentHTMLRow.nextSibling.children[0].children[0].children[0]);
                }
                break;
            case 38:
                event.returnValue = 0;
                if ((rowIndex > 0) && (rowIndex < 10)) {
                    this.selectedRowFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[cellindex].children[0].children[0]);
                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if ((rowIndex >= 0) && (rowIndex < 9)) {
                    this.selectedRowFocus(this.riGrid.CurrentHTMLRow.nextSibling.children[cellindex].children[0].children[0]);
                }
                break;
            default:
                break;
        }
    }

    public menuOnChange(): void {
        if (this.getControlValue('menu') === 'newprospect') {
            this.navigate('GeneralSearch', AppModuleRoutes.PROSPECTTOCONTRACT + ProspectToContractModuleRoutes.ICABSCMPIPELINEPROSPECTMAINTENANCE, {
                'parentMode': 'GeneralSearch'
            });
        }
    }

    public showInfoModal(): void {
        if (this.pageParams.vEnableGeneralSearchToUseMatches) {
            this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.vEnableGeneralSearchToUseMatchesTrue);
            this.pageMessageModal.title = MessageConstant.PageSpecificMessage.WildcardSearch;
            this.modalAdvService.emitMessage(this.pageMessageModal);
        }
        else {
            this.pageMessageModal = new ICabsModalVO(MessageConstant.PageSpecificMessage.vEnableGeneralSearchToUseMatchesFalse);
            this.pageMessageModal.title = MessageConstant.PageSpecificMessage.WildcardSearch;
            this.modalAdvService.emitMessage(this.pageMessageModal);
        }

    }

    public onChangeSearch(): void {
        let a: boolean = true;
        this.setControlValue('SearchWhat', 'ContractPremises');
        this.isShowEllipsis = false;
        this.riGrid.RefreshRequired();
        this.setControlValue('SearchValue', '');
        this.setControlValue('SearchValue2', '');
        this.setControlValue('SearchValue3', '');
        if (this.isReqProductServiceGroups) {
            this.spanSearchValue3Text = 'Product Service Group';
        }
        this.isSearchInfo = false;
        switch (this.getControlValue('SearchOn')) {
            case 'PostCode':
                this.searchValueProperty.spanSearchValueText = 'Post Code';
                this.showHideDateRange(true);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 10;
                break;
            case 'Account':
                this.isShowEllipsis = true;
                this.ellipsis.searchValueEllipsis.component = AccountSearchComponent;
                this.searchValueProperty.spanSearchValueText = 'Account Number';
                this.showHideSearchValue2(false, null);
                if (this.getControlValue('SearchWhat') === 'Contracts' || this.getControlValue('SearchWhat') === 'Jobs' || this.getControlValue('SearchWhat') === 'ContractPremises' || this.getControlValue('SearchWhat') === 'JobPremises') {
                    this.showHideDateRange(true);
                }
                else {
                    this.showHideDateRange(false);
                }
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 9;
                break;
            case 'GroupAccountNumber':
                this.isShowEllipsis = true;
                this.ellipsis.searchValueEllipsis.component = GroupAccountNumberComponent;
                this.ellipsis.searchValueEllipsis.childparams.showAddNew = true;
                this.searchValueProperty.spanSearchValueText = 'Group Account';
                this.showHideSearchValue2(false, null);
                if (this.getControlValue('SearchWhat') === 'Contracts' || this.getControlValue('SearchWhat') === 'Jobs' || this.getControlValue('SearchWhat') === 'ContractPremises' || this.getControlValue('SearchWhat') === 'JobPremises') {
                    this.showHideDateRange(true);
                }
                else {
                    this.showHideDateRange(false);
                }
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 9;
                break;
            case 'Area':
                this.isShowEllipsis = true;
                this.ellipsis.searchValueEllipsis.component = BranchServiceAreaSearchComponent;
                this.searchValueProperty.spanSearchValueText = 'Area Code';
                this.showHideDateRange(false);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 4;
                break;
            case 'Number':
                this.searchValueProperty.spanSearchValueText = 'Contract/Job Number';
                a = false;
                this.showHideDateRange(false);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 8;
                break;
            case 'Telephone':
                this.searchValueProperty.spanSearchValueText = 'Telephone';
                this.showHideDateRange(true);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 45;
                if (this.pageParams.vEnableGeneralSearchToUseMatches)
                    this.isSearchInfo = true;
                else
                    this.isSearchInfo = false;
                break;
            case 'Name':
                this.searchValueProperty.spanSearchValueText = 'Name';
                this.showHideDateRange(true);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 45;
                this.isSearchInfo = true;
                break;
            case 'GroupAccountName':
                this.searchValueProperty.spanSearchValueText = 'Group Account Name';
                this.showHideDateRange(true);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 45;
                this.isSearchInfo = false;
                break;
            case 'Address':
                this.searchValueProperty.spanSearchValueText = 'Address';
                this.showHideDateRange(true);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 45;
                this.isSearchInfo = true;
                break;
            case 'AreaSeq':
                this.isShowEllipsis = true;
                this.ellipsis.searchValueEllipsis.component = BranchServiceAreaSearchComponent;
                this.searchValueProperty.spanSearchValueText = 'Area Code';
                this.setControlValue('DateTo', '');
                this.setControlValue('DateFrom', '');
                this.showHideDateRange(false);
                this.showHideSearchValue2(true, 'Sequence');
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 4;
                this.searchValue2maxLength = 5;
                break;
            case 'TaxReg':
                this.searchValueProperty.spanSearchValueText = 'Tax Registration';
                this.showHideSearchValue2(false, null);
                if (this.getControlValue('SearchWhat') === 'Contracts' || this.getControlValue('SearchWhat') === 'Jobs' || this.getControlValue('SearchWhat') === 'ContractPremises' || this.getControlValue('SearchWhat') === 'JobPremises') {
                    this.showHideDateRange(true);
                }
                else
                    this.showHideDateRange(false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 20;
                break;
            case 'ContractRef':
                this.searchValueProperty.spanSearchValueText = 'Contract Ref';
                a = false;
                this.showHideDateRange(false);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 20;
                break;
            case 'PremiseWasteRegNo':
                this.searchValueProperty.spanSearchValueText = 'Waste Regulatory Premises Ref';
                a = false;
                this.showHideDateRange(false);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 20;
                break;
            case 'ClientRef':
                this.searchValueProperty.spanSearchValueText = 'Client Ref';
                this.showHideDateRange(false);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 20;
                break;
            case 'InvCrdRef':
                this.searchValueProperty.spanSearchValueText = 'Invoice/Credit Number';
                this.showHideSelectCell.SearchWhat = true;
                this.showHideSelectCell.JobStatus = false;
                this.showHideSelectCell.ContractStatus = false;
                this.showHideSelectCell.PremiseStatus = false;
                this.showHideSelectCell.ProductSaleStatus = false;
                this.showHideSelectCell.ProspectStatus = false;
                this.showHideDateRange(false);
                this.showHideSearchValue2(false, null);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue', false);
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'SearchValue2', false);
                this.searchValueProperty.maxLength = 8;
                break;
        }
        this.showHideSelectCell.SearchWhat = a;
        this.showHideSelectCell.JobStatus = a;
        this.showHideSelectCell.ContractStatus = a;
        this.showHideSelectCell.PremiseStatus = a;
        this.showHideSelectCell.ProductSaleStatus = a;
        this.showHideSelectCell.ProspectStatus = a;
        this.fillSearchWhatMenu();
    }

    public onBranchDataReceived(data: any): void {
        this.setControlValue('BranchNumber', data.BranchNumber);
    }

    public onProductServiceGroupSearch(data: any): void {
        this.setControlValue('SearchValue3', data.ProductServiceGroupCode);
    }
}


