import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { Subscription } from 'rxjs/Rx';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PageIdentifier } from '../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from '../../../shared/components/grid/grid';
import { OnDestroy, Component, ViewChild, Injector, OnInit, ElementRef } from '@angular/core';
import { ComponentInteractionService } from './../../../shared/services/component-interaction.service';
import { MessageService } from './../../../shared/services/message.service';
import { ErrorService } from './../../../shared/services/error.service';
import { BaseComponent } from '../../base/BaseComponent';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { URLSearchParams } from '@angular/http';
import { ContractActionTypes } from '../../../app/actions/contract';

@Component({
    templateUrl: 'iCABSAProRataChargeSummary.html',
    providers: [ErrorService, MessageService, ComponentInteractionService]
})

export class ProRateChargeSearchComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('proRataGrid') proRataGrid: GridComponent;
    @ViewChild('proRataPagination') proRataPagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;

    public queryParams = {
        action: '2',
        operation: 'Application/iCABSAProRataChargeSummary',
        module: 'charges',
        method: 'bill-to-cash/grid',
        contentType: 'application/x-www-form-urlencoded',
        full: 'Full',
        sortOrder: 'Descending'
    };
    public xhrParams = {
        operation: 'Application/iCABSAProRataChargeSummary',
        module: 'charges',
        method: 'bill-to-cash/grid'
    };
    public menuList: Array<any> = [
        { title: 'Options', value: 'Options' },
        { title: 'Create Additional Charge', value: 'AddAdditional' },
        { title: 'Create Credit', value: 'AddCredit' }
    ];
    public parent: ProRateChargeSearchComponent;
    public pageId: string = '';
    public maxColumn: number;
    public itemsPerPage: number;
    public pageSize: number;
    public totalItems: string;
    public currentPage: number;
    public gridSortHeaders: Array<any>;
    private headerClicked: string = '';
    private sortType: string = 'ASC';
    public inputParamsPremise: any;
    public premiseSearchComponent = PremiseSearchComponent;
    public paginationStyle = { align: 'text-right' };
    public optionsList: Array<any> = [
        { title: 'All', value: 'All' }
    ];
    public langSelected: Object = {
        id: '',
        text: ''
    };
    public proSearch: URLSearchParams = new URLSearchParams();
    public inputParamsProRata: any = {
    };
    public lookUpSubscription: Subscription;
    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'AccountNumber', readonly: true, disabled: false, required: false },
        { name: 'AccountName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: true, disabled: false, required: false },
        { name: 'ProductDesc', readonly: true, disabled: false, required: false },
        { name: 'InvoiceFrequencyCode', readonly: true, disabled: false, required: false },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: false, required: false },
        { name: 'ProRataSummaryFilter', readonly: true, disabled: false, required: false, value: 'All' },
        { name: 'ProRataChargeStatus', readonly: true, disabled: false, required: false },
        { name: 'FilterPremise', readonly: true, disabled: false, required: false },
        { name: 'FilterPremiseName', readonly: true, disabled: false, required: false },
        { name: 'InvoiceAnnivDate', readonly: true, disabled: false, required: false, tyrp: MntConst.eTypeDate },
        { name: 'ServiceCommenceDate', readonly: true, disabled: false, required: false, type: MntConst.eTypeDate },
        { name: 'ProRataChargeStatusCode', readonly: true, disabled: false, required: false },
        { name: 'ProRataChargeStatusDesc', readonly: true, disabled: false, required: false },
        { name: 'menu', readonly: true, disabled: false, required: false, value: 'Options' }
    ];
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public columnIndex: any = {
        'PremiseNumber': 0,
        'PremiseName': 0,
        'ProductCode': 0,
        'ServiceBranchNumber': 0
    };
    public validateProperties: Array<any> = [];

    constructor(injector: Injector, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPRORATACHARGESUMMARY;
        this.browserTitle = 'Contract Pro Rata Charge Summary';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.parent = this;
        this.itemsPerPage = 10;
        this.currentPage = 1;
        this.pageSize = 10;
        this.queryParams.sortOrder = 'Descending';
        this.pageParams.trPremise = false;
        this.pageParams.tdCommenceDate1 = false;
        this.pageParams.tdCommenceDate2 = false;
        this.pageParams.trProduct = false;
        this.pageParams.tdVisitFrequency1 = false;
        this.pageParams.tdVisitFrequency2 = false;
        this.pageParams.tdFilterPremise = false;
        this.pageParams.tdFilterStatus = false;
        this.pageParams.labelInvoiceFreqeuencyCode = true;
        this.pageParams.labelInvoiceAnnivDate = true;
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }


    public window_onload(): void {
        let windowTitle, labelContractNumber;

        let translation = this.getTranslatedValue('^1^ Pro Rata Charge Summary', null).subscribe((resp) => {
            this.pageParams.windowTitle = resp.replace('^1^', this.pageParams.currentContractTypeLabel);
            this.utils.setTitle(this.pageParams.windowTitle);
        });

        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        //this.riExchange.riInputElement.Disable(this.uiForm, 'FilterPremise');
        this.riExchange.riInputElement.Disable(this.uiForm, 'FilterPremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceFrequencyCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceAnnivDate');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProRataChargeStatusCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProRataChargeStatusDesc');
        this.riExchange.riInputElement.Disable(this.uiForm, 'Status');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceAnnualValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceVisitFrequency');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceCommenceDate');

        // Parent Mode coming from History Grid could be ContractHistory, PremiseHistory || ServiceCoverHistory;
        if (this.utils.Right(this.parentMode, 7) === 'History') {
            this.pageParams.ContractHistoryRowID = this.riExchange.getParentAttributeValue('ContractHistoryRowID');
        }
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');

        this.pageParams.FilterType = this.getControlValue('ProRataSummaryFilter');
        this.AddOption('Status');

        this.getTranslatedValue(this.riExchange.getCurrentContractTypeLabel()).subscribe((res) => { this.pageParams.DocTitle = res; });
        switch (this.parentMode) {
            case 'Contract':
            case 'ContractHistory':
                let stringNameContract: string = 'Details';
                this.getTranslatedValue(stringNameContract).subscribe((res) => { this.pageParams.DocTitle = this.pageParams.DocTitle + ' ' + res; });
                if (this.parentMode === 'Contract') {
                    this.AddOption('Premises');
                }
                break;
            case 'Premise':
            case 'PremiseHistory':
                let stringNamePremise: string = 'Premises Details';
                this.getTranslatedValue(stringNamePremise).subscribe((res) => { this.pageParams.DocTitle = this.pageParams.DocTitle + ' ' + res; });
                this.pageParams.trPremise = true;
                this.riExchange.getParentHTMLValue('PremiseNumber');
                this.riExchange.getParentHTMLValue('PremiseName');
                break;
            case 'ServiceCover':
            case 'ServiceVisit':
            case 'ServiceCoverHistory':
            case 'ServiceVisitMaint':
                let stringNameServiceVisit: string = 'Service Cover Details';
                this.getTranslatedValue(stringNameServiceVisit).subscribe((res) => { this.pageParams.DocTitle = this.pageParams.DocTitle + ' ' + res; });
                this.pageParams.trPremise = true;
                this.pageParams.trProduct = true;
                if (this.parentMode === 'ServiceCover') {
                    this.pageParams.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverRowID');
                    this.pageParams.tdVisitFrequency1 = true;
                    this.pageParams.tdVisitFrequency2 = true;
                    this.pageParams.tdCommenceDate1 = true;
                    this.pageParams.tdCommenceDate2 = true;
                } else if (this.parentMode === 'ServiceVisit' || this.parentMode === 'ServiceVisitMaint') {
                    this.pageParams.ServiceCoverRowID = this.riExchange.getParentAttributeValue('ServiceCoverRowID');
                    this.pageParams.tdVisitFrequency1 = false;
                    this.pageParams.tdVisitFrequency2 = false;
                    this.pageParams.tdCommenceDate1 = false;
                    this.pageParams.tdCommenceDate2 = false;
                }
                this.attributes.ServiceCoverRowID = this.pageParams.ServiceCoverRowID;
                this.riExchange.getParentHTMLValue('PremiseNumber');
                this.riExchange.getParentHTMLValue('PremiseName');
                this.riExchange.getParentHTMLValue('ProductCode');
                this.riExchange.getParentHTMLValue('ProductDesc');
                this.riExchange.getParentHTMLValue('Status');
                this.riExchange.getParentHTMLValue('ServiceAnnualValue');
                this.riExchange.getParentHTMLValue('ServiceVisitFrequency');
                this.riExchange.getParentHTMLValue('ServiceCommenceDate');
                this.riExchange.getParentHTMLValue('InvoiceFrequencyCode');
                this.riExchange.getParentHTMLValue('InvoiceAnnivDate');
                break;
        }

        this.inputParamsPremise = {
            parentMode: 'LookUp-ProRataSearch',
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName')
        };

        this.proSearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.proSearch.set(this.serviceConstants.Action, '0');
        this.proSearch.set(this.serviceConstants.CountryCode, this.countryCode());
        this.proSearch.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.proSearch)
            .subscribe(
            (data) => {
                this.setControlValue('AccountNumber', data['AccountNumber']);
                this.setControlValue('AccountName', data['AccountName']);
                if (this.pageParams.currentContractType === 'C') {
                    this.setControlValue('InvoiceFrequencyCode', data['InvoiceFrequencyCode']);
                    this.setControlValue('InvoiceAnnivDate', data['InvoiceAnnivDate']);
                } else {
                    this.pageParams.labelInvoiceFreqeuencyCode = false;
                    this.pageParams.InvoiceFrequencyCode = false;
                    this.pageParams.labelInvoiceAnnivDate = false;
                    this.pageParams.InvoiceAnnivDate = false;
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });

        this.UpdateHTML();
        this.Execute();
    }

    public BuildGrid(): void {
        this.gridSortHeaders = [{
            'fieldName': 'PremiseNumber',
            'index': 0,
            'sortType': 'DESC'
        }, {
            'fieldName': 'ProductCode',
            'index': 2,
            'sortType': 'DESC'
        }];
        this.columnIndex.PremiseNumber = 0;
        this.columnIndex.PremiseName = 0;
        this.columnIndex.ProductCode = 0;
        this.columnIndex.ServiceBranchNumber = 0;
        for (let k = 0; k < this.gridSortHeaders.length; k++) {
            if (this.gridSortHeaders[k].fieldName === this.headerClicked) {
                this.gridSortHeaders[k].sortType = this.sortType === 'Descending' ? 'DESC' : 'ASC';
            }
        }
        this.maxColumn = 11;

        if (this.parentMode !== 'ServiceCover' && this.parentMode !== 'ServiceVisitMaint') {
            if (this.parentMode !== 'Premise' && this.getControlValue('FilterPremise') === '') {
                this.maxColumn = this.maxColumn + 2;
                this.columnIndex.PremiseNumber++;
                this.columnIndex.PremiseName += 2;
                this.columnIndex.ProductCode += 2;
                this.columnIndex.ServiceBranchNumber += 2;

            }
            this.maxColumn = this.maxColumn + 1;
            this.columnIndex.ServiceBranchNumber++;
            this.columnIndex.ProductCode++;
        }
        this.columnIndex.ServiceBranchNumber++;
        this.validateProperties = [{
            'type': MntConst.eTypeInteger,
            'index': this.columnIndex.PremiseNumber - 1
        },
        {
            'type': MntConst.eTypeText,
            'index': this.columnIndex.PremiseName - 1
        },
        {
            'type': MntConst.eTypeCode,
            'index': this.columnIndex.ProductCode - 1
        },
        {
            'type': MntConst.eTypeInteger,
            'index': this.columnIndex.ServiceBranchNumber - 1
        },
        {
            'type': MntConst.eTypeDate,
            'index': this.columnIndex.ServiceBranchNumber
        },
        {
            'type': MntConst.eTypeDate,
            'index': this.columnIndex.ServiceBranchNumber + 1
        },
        {
            'type': MntConst.eTypeDate,
            'index': this.columnIndex.ServiceBranchNumber + 2
        },
        {
            'type': MntConst.eTypeInteger,
            'index': this.columnIndex.ServiceBranchNumber + 3
        },
        {
            'type': MntConst.eTypeText,
            'index': this.columnIndex.ServiceBranchNumber + 4
        },
        {
            'type': MntConst.eTypeText,
            'index': this.columnIndex.ServiceBranchNumber + 5
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': this.columnIndex.ServiceBranchNumber + 6
        },
        {
            'type': MntConst.eTypeInteger,
            'index': this.columnIndex.ServiceBranchNumber + 7
        },
        {
            'type': MntConst.eTypeCode,
            'index': this.columnIndex.ServiceBranchNumber + 8
        }];

        if (this.getControlValue('ProRataChargeStatusCode') === '') {
            this.maxColumn = this.maxColumn + 1;
        }
    }
    public sortGrid(obj: any): void {
        this.headerClicked = obj.fieldname;
        this.sortType = obj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.Execute();
    }
    public Execute(): void {
        let FilterInvoiceCreditCode;
        FilterInvoiceCreditCode = '';
        this.inputParamsProRata.module = this.queryParams.module;
        this.inputParamsProRata.method = this.queryParams.method;
        this.inputParamsProRata.operation = this.queryParams.operation;
        if (this.riExchange.URLParameterContains('AdditionalCharge')) {
            FilterInvoiceCreditCode = 'I';
        } else if (this.riExchange.URLParameterContains('AdditionalCredit')) {
            FilterInvoiceCreditCode = 'C';
        }
        this.BuildGrid();
        this.proSearch = new URLSearchParams();
        this.proSearch.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.proSearch.set(this.serviceConstants.CountryCode, this.countryCode());
        this.proSearch.set(this.serviceConstants.Action, this.queryParams.action);
        if (this.parentMode !== 'Premise') {
            this.proSearch.set('ContractNumber', this.getControlValue('ContractNumber'));
            this.proSearch.set('FilterPremiseNumber', this.getControlValue('FilterPremise'));
            this.proSearch.set('FilterStatus', this.getControlValue('ProRataChargeStatusCode'));
            this.proSearch.set('ContractHistoryRowID', this.pageParams.ContractHistoryRowID);
            this.proSearch.set('ServiceCoverRowID', this.pageParams.ServiceCoverRowID);
            this.proSearch.set('FilterInvoiceCreditCode', FilterInvoiceCreditCode);
        } else {
            this.proSearch.set('ContractNumber', this.getControlValue('ContractNumber'));
            this.proSearch.set('FilterPremiseNumber', this.getControlValue('FilterPremise'));
            this.proSearch.set('FilterStatus', this.getControlValue('ProRataChargeStatusCode'));
            this.proSearch.set('FromPremise', 'true');
        }
        this.proSearch.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.proSearch.set('HeaderClickedColumn', this.headerClicked);
        this.proSearch.set('riSortOrder', this.sortType);
        this.proSearch.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.proSearch.set('PageCurrent', this.currentPage.toString());
        this.inputParamsProRata.search = this.proSearch;
        this.proRataGrid.loadGridData(this.inputParamsProRata);
    }


    public UpdateHTML(): void {
        this.pageParams.FilterType = this.getControlValue('ProRataSummaryFilter');
        this.riMaintenance.clear();
        switch (this.pageParams.FilterType) {
            case 'Premises':
                this.pageParams.tdFilterPremise = true;
                this.pageParams.tdFilterStatus = false;
                break;
            case 'Status':
                this.pageParams.tdFilterStatus = true;
                this.pageParams.tdFilterPremise = false;
                break;
            default:
                this.pageParams.tdFilterStatus = false;
                this.pageParams.tdFilterPremise = false;
                this.setControlValue('FilterPremise', '');
                this.setControlValue('FilterPremiseName', '');
                this.setControlValue('ProRataChargeStatusCode', '');
                this.setControlValue('ProRataChargeStatusDesc', '');
                this.langSelected = {
                    id: '',
                    text: ''
                };
                break;
        }
    }


    public ProRataSummaryFilter(): void {
        this.UpdateHTML();
    }

    public AddOption(rstrField: string): void {
        let obj = { title: rstrField, value: rstrField };
        this.optionsList.push(obj);
    }


    public onFilterInvoiceCreditCode(option: any): void {
        let returnGrpObj = {
            parentMode: 'ServiceCoverAdd',
            currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
            mode: 'AdditionalCharge',
            ContractNumber: this.getControlValue('ContractNumber'),
            ContractName: this.getControlValue('ContractName'),
            PremiseNumber: this.getControlValue('PremiseNumber'),
            PremiseName: this.getControlValue('PremiseName'),
            AccountNumber: this.getControlValue('AccountNumber'),
            AccountName: this.getControlValue('AccountName'),
            ProductCode: this.getControlValue('ProductCode'),
            ProductDesc: this.getControlValue('ProductDesc'),
            'BusinessCode': this.businessCode(),
            'CountryCode': this.countryCode()
        };
        this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: returnGrpObj });
        switch (option) {
            case 'AddAdditional':
                if ((this.parentMode === 'ServiceCover' && !this.riExchange.URLParameterContains('AdditionalCredit'))
                    || this.parentMode === 'ServiceVisit' || this.parentMode === 'ServiceVisitMaint') {
                    let returnGrpObj = {
                        ContractNumber: this.getControlValue('ContractNumber'),
                        ContractName: this.getControlValue('ContractName'),
                        PremiseNumber: this.getControlValue('PremiseNumber'),
                        PremiseName: this.getControlValue('PremiseName'),
                        AccountNumber: this.getControlValue('AccountNumber'),
                        AccountName: this.getControlValue('AccountName'),
                        ProductCode: this.getControlValue('ProductCode'),
                        ProductDesc: this.getControlValue('ProductDesc'),
                        InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode')
                        //ProRataChargeROWID: data['rowID']
                    };
                    this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: returnGrpObj });
                    this.router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSAPRORATACHARGEMAINTENANCE], {
                        queryParams: {
                            parentMode: 'ServiceCoverAdd',
                            currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                            CurrentContractType: this.pageParams.currentContractType,
                            mode: 'AdditionalCharge',
                            ContractNumber: this.getControlValue('ContractNumber'),
                            ContractName: this.getControlValue('ContractName'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName'),
                            ProductCode: this.getControlValue('ProductCode'),
                            ProductDesc: this.getControlValue('ProductDesc'),
                            InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode'),
                            InvoiceAnnivDate: this.getControlValue('InvoiceAnnivDate'),
                            ServiceCoverRowID: this.pageParams.ServiceCoverRowID
                        }
                    });
                } else {
                    this.ErrorFunctionNotAvailable();
                }
                break;
            case 'AddCredit':
                if ((this.parentMode === 'ServiceCover' && !this.riExchange.URLParameterContains('AdditionalCharge'))
                    || this.parentMode === 'ServiceVisit' || this.parentMode === 'ServiceVisitMaint') {
                    this.router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSAPRORATACHARGEMAINTENANCE], {
                        queryParams: {
                            parentMode: 'ServiceCoverAdd',
                            currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                            CurrentContractType: this.pageParams.currentContractType,
                            mode: 'AdditionalCredit',
                            ContractNumber: this.getControlValue('ContractNumber'),
                            ContractName: this.getControlValue('ContractName'),
                            PremiseNumber: this.getControlValue('PremiseNumber'),
                            PremiseName: this.getControlValue('PremiseName'),
                            AccountNumber: this.getControlValue('AccountNumber'),
                            AccountName: this.getControlValue('AccountName'),
                            ProductCode: this.getControlValue('ProductCode'),
                            ProductDesc: this.getControlValue('ProductDesc'),
                            InvoiceFrequencyCode: this.getControlValue('InvoiceFrequencyCode'),
                            InvoiceAnnivDate: this.getControlValue('InvoiceAnnivDate'),
                            ServiceCoverRowID: this.pageParams.ServiceCoverRowID
                        }
                    });
                } else {
                    this.ErrorFunctionNotAvailable();
                }
                break;
        }
    }

    public ErrorFunctionNotAvailable(): void {
        this.zone.run(() => {
            this.messageModal.show({ msg: 'Function Is Only Available For Selection From Service Cover Maintenance', title: 'Message' }, false);
            this.el.nativeElement.querySelector('#menu option').removeAttribute('selected');
            this.el.nativeElement.querySelector('#menu option[value="Options"').setAttribute('selected', 'selected');
        });
    }

    public onLangDataReceived(event: any): void {
        this.setControlValue('ProRataChargeStatusCode', event['ProRataChargeStatusLang.ProRataChargeStatusCode']);
        this.setControlValue('ProRataChargeStatusDesc', event['ProRataChargeStatusLang.ProRataChargeStatusDesc']);
        this.Execute();
    }

    public onPremiseDataReceived(data: any): void {
        this.setControlValue('FilterPremise', data[0][0].PremiseNumber);
        this.setControlValue('FilterPremiseName', data[0][0].PremiseName);
        this.Execute();
    }

    public onPremiseEllipsisDataReceived(data: any): void {
        this.setControlValue('FilterPremise', data.PremiseNumber);
        this.setControlValue('FilterPremiseName', data.PremiseName);
        this.setControlValue('ProRataChargeStatusCode', '');
        this.setControlValue('ProRataChargeStatusDesc', '');
        this.Execute();
    }

    public getGridInfo(info: any): void {
        this.proRataPagination.totalItems = info.totalRows;
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.Execute();
    }

    public onRefresh(): void {
        this.currentPage = 1;
        this.Execute();
    }

    public onPremiseChange(): any {
        if (this.getControlValue('ContractNumber').trim() && this.getControlValue('FilterPremise').trim()) {
            let lookupIP = [{
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('FilterPremise')
                },
                'fields': ['PremiseName']
            }];
            this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
                let PremiseName = data[0][0];
                if (PremiseName) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'FilterPremiseName', PremiseName.PremiseName);
                    this.setControlValue('ProRataChargeStatusCode', '');
                    this.setControlValue('ProRataChargeStatusDesc', '');
                    this.Execute();
                }
            });
        }
    }

    public selectedDataOnDoubleClick(event: any): void {
        //WRITE CODE FOR DOUBLE CLICK
        let data = this.proRataGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
        if (data['rowID'] && data['rowID'] !== '') {
            if ((event.cellIndex === 0 || event.cellIndex === (event.trRowData.length - 1)) && event.rowData.Status !== 'Awaiting Approval') {
                if (event && event.cellData && event.cellData.rowID !== null) {
                    if (this.inputParamsProRata.parentMode === 'ServiceVisitMaint') {
                        this.inputParamsProRata.mode = 'ServiceCover';
                    }
                    else {
                        this.inputParamsProRata.mode = this.inputParamsProRata.parentMode;
                    }
                    this.store.dispatch({
                        type: ContractActionTypes.SAVE_MODE, payload:
                        {
                            mode: this.inputParamsProRata.mode
                        }
                    });

                    //to do--need to navigate after the page is ready
                    if (event && event.cellData && event.cellData.additionalData !== null) {
                        let returnGrpObj = {
                            'PremiseNumber': this.getControlValue('PremiseNumber'),
                            'PremiseName': this.getControlValue('PremiseName'),
                            'End Date': event.rowData['End Date'],
                            'Extract Date': event.rowData['Extract Date'],
                            'Invoice Group': event.rowData['Invoice Group'],
                            'Invoice/ Credit': event.rowData['Invoice/ Credit'],
                            'Print Credit': event.rowData['Print Credit'],
                            'Product Code': event.rowData['Product Code'],
                            'Qty': event.rowData['Qty'],
                            'Reason': event.rowData['Reason'],
                            'Service Branch': event.rowData['Service Branch'],
                            'Start Date': event.rowData['Start Date'],
                            'Status': event.rowData['Reason'],
                            'VAT Code': event.rowData['VAT Code'],
                            'Value': event.rowData['Value'],
                            'BusinessCode': this.businessCode(),
                            'CountryCode': this.countryCode(),
                            Level: data['additionalData'],
                            Row: data['rowID'],
                            ProRataChargeROWID: data['rowID']
                        };

                        this.attributes.InvoiceCreditCode = event.rowData['I%voice/ Credit'];
                        this.attributes.EndDate = event.rowData['E%d Date'];
                        this.attributes.ToBeReleasedDate = event.rowData['E%tract Date'];
                        this.attributes.InvoiceGroupNumber = event.rowData['I%voice Group'];
                        this.attributes.PrintCreditInd = event.rowData['P%int Credit'];
                        this.attributes.ProducedInvoiceNumber = event.rowData['P%oduct Code'];
                        this.attributes.ServiceQuantity = event.rowData['Q%y'];
                        this.attributes.InvoiceCreditReasonDesc = event.rowData['R%ason'];
                        this.attributes.ServiceBranch = event.rowData['S%rvice Branch'];
                        this.attributes.StartDate = event.rowData['S%art Date'];
                        this.attributes.ProRataChargeStatusCode = event.rowData['R%ason'];
                        this.attributes.TaxCode = event.rowData['V%T Code'];
                        this.attributes.ProRataChargeValue = event.rowData['V%lue'];

                        this.store.dispatch({ type: ContractActionTypes.SAVE_SENT_FROM_PARENT, payload: returnGrpObj });
                    }
                    this.navigate(this.inputParamsProRata.mode, InternalMaintenanceSalesModuleRoutes.ICABSAPRORATACHARGEMAINTENANCE, {
                        currentContractTypeURLParameter: this.riExchange.getCurrentContractTypeLabel(),
                        CurrentContractType: this.pageParams.currentContractType,
                        ContractNumber: this.getControlValue('ContractNumber'),
                        ContractName: this.getControlValue('ContractName'),
                        PremiseNumber: this.getControlValue('PremiseNumber'),
                        PremiseName: this.getControlValue('PremiseName'),
                        AccountNumber: this.getControlValue('AccountNumber'),
                        AccountName: this.getControlValue('AccountName'),
                        ProductCode: this.getControlValue('ProductCode'),
                        ProductDesc: this.getControlValue('ProductDesc'),
                        InvoiceAnnivDate: this.getControlValue('InvoiceAnnivDate'),
                        ProRataChargeROWID: data['rowID'],
                        Level: data['additionalData'],
                        ServiceCoverRowID: this.pageParams.ServiceCoverRowID
                    });
                }
            }
        }
    }
}
