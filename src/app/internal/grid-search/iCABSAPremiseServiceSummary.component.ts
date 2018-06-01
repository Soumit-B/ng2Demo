import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalSearchModuleRoutes, InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { SpeedScript } from './../../../shared/services/speedscript';
import { SysCharConstants } from './../../../shared/constants/syscharservice.constant';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MessageService } from './../../../shared/services/message.service';
import { RiExchange } from './../../../shared/services/riExchange';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { GenericActionTypes } from './../../actions/generic';
import { LookUp } from './../../../shared/services/lookup';
import { Subscription } from 'rxjs';
import { HttpService } from './../../../shared/services/http-service';
import { Store } from '@ngrx/store';
import { Utils } from './../../../shared/services/utility';
import { ErrorService } from './../../../shared/services/error.service';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { AjaxObservableConstant } from './../../../shared/constants/ajax-observable.constant';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { OnInit, Component, NgZone, ViewChild, OnDestroy, Injector } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { LocaleTranslationService } from '../../../shared/services/translation.service';
import { BaseComponent } from '../../../app/base/BaseComponent';

@Component({
    templateUrl: 'iCABSAPremiseServiceSummary.html'
})

export class PremiseServiceSummaryComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('premiseServiceSummaryGrid') premiseServiceSummaryGrid: GridComponent;
    @ViewChild('premiseServiceSummaryPagination') premiseServiceSummaryPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;

    public inputParams: any = {};
    public inputParamsContractSearch: any = {
        'parentMode': 'LookUp',
        'currentContractType': 'P'
    };

    public telesalesInd: string = '';
    public isTeleSales: boolean = false;
    public contractTypeCode: string = '';
    public currentContractTypeLabel: string = '';
    public title: string = '';
    public labelContractNumber: string = '';

    private subLookup: Subscription;
    private subSysChar: Subscription;
    private subXhr: Subscription;
    private subLookupContract: Subscription;
    private subLookupDetails: Subscription;
    private lookupAuth: Subscription;
    private subXhrDesc: Subscription;
    public translateSub: Subscription;
    public CompositesInUse: boolean = false;
    public ReqDetail: boolean = false;
    public ServiceDetailHide: boolean = false;
    public lAllowUserAuthView: boolean = false;
    public lAllowUserAuthUpdate: boolean = false;
    public vBusinessCode: string;
    public fullAccess: string;
    public branchNumber: string;
    public uiDisplay: any = {
        ServiceCoverRowID: false,
        RunningReadOnly: false,
        vAllowUserAuthView: false,
        CallLogID: false,
        CurrentCallLogID: false
    };
    public tdAddRecord: boolean = true;
    public tdServiceDetail: boolean = false;
    public tdAnnualValue: boolean = false;
    public tdTelesalesOrder: boolean = false;
    public detailInd: boolean = false;
    public CallLogID: any;
    public CurrentCallLogID: any;
    public ClosedWithChanges: any;

    public showCloseButton: boolean = true;
    public backLabel: string;
    public backLinkText: string = 'Back';
    public backLinkUrl: string;
    public statusList: Array<any> = [];
    public serviceForm: FormGroup;
    public showHeader: boolean = true;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 0;
    public maxColumn: number = 14;
    public LOS: string = 'All';
    public addOptions: string = 'Options';
    public isRequesting: boolean = false;
    public LOSArray: Array<any> = [
        {
            'LOSCode': 'All',
            'LOSName': 'All',
            'ttLineOfService': ''
        }
    ];
    //Page Variables
    public xhrParams = {
        module: 'report',
        method: 'service-delivery/grid',
        operation: 'Application/iCABSAPremiseServiceSummary'
    };

    public attributes: any = {
        'ProductCode': '',
        'ProductDesc': '',
        'ServiceCoverRowID': '',
        'RowID': ''
    };
    public headerClicked: string = '';
    public sortType: string = '';
    public gridSortHeaders: Array<any> = [
        {
            'fieldName': 'ProductCode',
            'colName': 'Product\nCode',
            'sortType': 'ASC',
            'index': 0
        }
    ];
    public ServiceCommenceDate: any = {
        'fieldName': 'ServiceCommenceDate',
        'index': 2,
        'sortType': 'ASC'
    };
    public pageId: string;

    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: false },
        { name: 'ContractName', readonly: false, disabled: false, required: false },
        { name: 'InvoiceFrequencyCode', readonly: false, disabled: false, required: false },
        { name: 'NegBranchNumber', readonly: false, disabled: false, required: false },
        { name: 'NegBranchName', readonly: false, disabled: false, required: false },
        { name: 'AccountNumber', readonly: false, disabled: false, required: false },
        { name: 'AccountName', readonly: false, disabled: false, required: false },
        { name: 'InvoiceAnnivDate', readonly: false, disabled: false, required: false },
        { name: 'ServiceBranchNumber', readonly: false, disabled: false, required: false },
        { name: 'BranchName', readonly: false, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
        { name: 'PremiseName', readonly: false, disabled: false, required: false },
        { name: 'PremiseAnnualValue', readonly: false, disabled: false, required: false },
        { name: 'TelesalesOrderNumber', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false },
        { name: 'RunningReadOnly', readonly: false, disabled: false, required: false },
        { name: 'vAllowUserAuthView', readonly: false, disabled: false, required: false },
        { name: 'CallLogID', readonly: false, disabled: false, required: false },
        { name: 'CurrentCallLogID', readonly: false, disabled: false, required: false },
        { name: 'StatusSearchType', readonly: false, disabled: false, required: false }
    ];

    public validateProperties: Array<any> = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSARECOMMENDATIONGRID;
    }


    ngOnInit(): void {
        super.ngOnInit();
        this.vBusinessCode = this.utils.getBusinessCode();
        this.fullAccess = this.riExchange.ClientSideValues.Fetch('FullAccess');
        this.branchNumber = this.utils.getBranchCode();
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('PremiseAnnualValue');
        this.riExchange.getParentHTMLValue('ServiceBranchNumber');
        this.riExchange.getParentHTMLValue('BranchName');
        this.riExchange.getParentHTMLValue('RunningReadOnly');
        this.riExchange.getParentHTMLValue('EmployeeLimitChildDrillOptions');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'AccountName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseAnnualValue');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceFrequencyCode');
        this.riExchange.riInputElement.Disable(this.uiForm, 'InvoiceAnnivDate');
        this.riExchange.riInputElement.Disable(this.uiForm, 'NegBranchNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'NegBranchName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ServiceBranchNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'BranchName');
        if (!this.getControlValue('BranchName')) {
            this.doLookup();
        }
        this.getSysCharDetails();
        this.localeTranslateService.setUpTranslation();
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                this.statusList = [];
                this.buildStatusOptions();
            }
        });
        this.setCurrentContractType();
        this.getLOSCode();
        this.setUpInit();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
        if (this.translateSub) {
            this.translateSub.unsubscribe();
        }
    }

    private setUpInit(): void {
        this.title = '^1^ Premise Service Summary';
        this.pageTitle = 'Premise Service Summary';
        this.utils.setTitle(this.title, '^1^', this.currentContractTypeLabel);
        this.labelContractNumber = this.currentContractTypeLabel + ' Number';
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'RunningReadOnly') === 'yes' || this.CallLogID) {
            this.tdAddRecord = false;
        }
    }

    private doLookup(): any {
        let lookupIP = [
            {
                'table': 'Branch',
                'query': { 'BusinessCode': this.businessCode(), 'BranchNumber': this.getControlValue('ServiceBranchNumber') },
                'fields': ['BranchName']
            }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            let branchRecords = data[0];
            if (branchRecords.length > 0) {
                this.setControlValue('BranchName', branchRecords['0'].BranchName);
            }
        });
    }

    private getLOSCode(): void {
        let lookupIP = [{
            'table': 'LineOfService',
            'query': { 'ValidForBusiness': this.utils.getBusinessCode() },
            'fields': ['LOSCode', 'LOSName']
        }];
        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0]) {
                let temp = data[0];
                for (let i = 0; i < temp.length; i++) {
                    this.LOSArray.push(temp[i]);
                }
            }
        });
    }

    public sortGrid(data: any): void {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }

    public onStatusChange(): void {
        this.premiseServiceSummaryGrid.clearGridData();
    }

    public onDetailIndChange(): void {
        this.premiseServiceSummaryGrid.clearGridData();
        this.detailInd = !this.detailInd;
    }

    public getGridInfo(info: any): void {
        this.premiseServiceSummaryPagination.totalItems = info.totalRows;
    }

    public getRefreshData(): void {
        this.currentPage = 1;
        this.buildGrid();
    }

    public buildStatusOptions(): void {
        this.statusList = [
            { value: '', text: 'All' },
            { value: 'L', text: 'Current' },
            { value: 'FL', text: 'Forward Current' },
            { value: 'D', text: 'Deleted' },
            { value: 'FD', text: 'Forward Deleted' },
            { value: 'PT', text: 'Pending Deletion' },
            { value: 'T', text: 'Terminated' },
            { value: 'FT', text: 'Forward Terminated' },
            { value: 'PT', text: 'Pending Termination' },
            { value: 'C', text: 'Cancelled' }];
    }

    public setCurrentContractType(): void {
        this.inputParamsContractSearch.currentContractType = this.riExchange.getCurrentContractType();
        this.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }
    }

    private getContractDetails(): void {
        let AccountNumber = '';
        let BusinessCode = '';
        let ContractNumber = '';
        let InvoiceAnnivDate = '';
        let InvoiceFrequencyCode = '';
        let NegBranchNumber = '';
        let AccountName = '';
        let BranchName = '';

        let lookupIP_contract = [{
            'table': 'Contract',
            'query': { 'BusinessCode': this.vBusinessCode, 'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') },
            'fields': ['BusinessCode', 'ContractNumber', 'AccountNumber', 'NegBranchNumber', 'InvoiceAnnivDate', 'InvoiceFrequencyCode']
        }];
        this.subLookupContract = this.LookUp.lookUpRecord(lookupIP_contract).subscribe((data) => {
            if (data.length > 0) {
                let resp = data[0];
                if (resp.length > 0) {
                    let record = resp[0];

                    AccountNumber = record.AccountNumber;
                    BusinessCode = record.BusinessCode;
                    ContractNumber = record.ContractNumber;
                    InvoiceAnnivDate = record.InvoiceAnnivDate;
                    InvoiceFrequencyCode = record.InvoiceFrequencyCode;
                    NegBranchNumber = record.NegBranchNumber;

                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceFrequencyCode', InvoiceFrequencyCode);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceAnnivDate', InvoiceAnnivDate);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'NegBranchNumber', NegBranchNumber);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', AccountNumber);

                    let lookupIP_details = [{
                        'table': 'Account',
                        'query': { 'AccountNumber': AccountNumber },
                        'fields': ['AccountNumber', 'AccountName']
                    },
                    {
                        'table': 'Branch',
                        'query': { 'BranchNumber': NegBranchNumber },
                        'fields': ['BranchNumber', 'BusinessCode', 'BranchName']
                    }];

                    this.subLookupDetails = this.LookUp.lookUpRecord(lookupIP_details).subscribe((data) => {
                        if (data.length > 0) {
                            let AcctDtls = data[0];
                            if (AcctDtls.length > 0) {
                                let acctRecord = AcctDtls[0];
                                AccountName = acctRecord.AccountName;
                            }

                            let BranchDtls = data[1];
                            if (BranchDtls.length > 0) {
                                let brnRecord = BranchDtls[0];
                                BranchName = brnRecord.BranchName;
                            }

                            this.riExchange.riInputElement.SetValue(this.uiForm, 'NegBranchName', BranchName);
                            this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', AccountName);
                            if (this.fullAccess === 'Restricted' && this.branchNumber !== this.riExchange.riInputElement.GetValue(this.uiForm, 'NegBranchNumber')
                                && this.branchNumber !== this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceBranchNumber')) {
                                this.tdAnnualValue = false;
                            } else {
                                this.tdAnnualValue = true;
                            }
                        } else {
                            this.showAlert('not successful!!');
                        }
                        this.buildGrid();
                    });
                }
            } else {
                this.showAlert('not successful!!');
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    private userAuthorityLookUp(): void {

        let lookupIPUserAuth = [{
            'table': 'UserAuthority',
            'query': { 'BusinessCode': this.vBusinessCode, 'UserCode': this.utils.getUserCode() },
            'fields': ['AllowViewOfSensitiveInfoInd', 'AllowUpdateOfContractInfoInd']
        },
        {
            'table': 'ProductComponent',
            'query': { 'BusinessCode': this.vBusinessCode },
            'fields': ['BusinessCode']
        }];
        this.lookupAuth = this.LookUp.lookUpRecord(lookupIPUserAuth).subscribe((data) => {
            if (data.length > 0) {
                let userAuth = data[0];
                if (userAuth.length > 0) {
                    this.lAllowUserAuthView = userAuth[0].AllowViewOfSensitiveInfoInd;
                    this.lAllowUserAuthUpdate = userAuth[0].AllowUpdateOfContractInfoInd;
                }
                if (!this.lAllowUserAuthView) {
                    this.tdAnnualValue = false;
                } else {
                    this.tdAnnualValue = true;
                }
            }
            if (data.length > 1) {
                let productComponent = data[1];
                if (productComponent.length > 0) {
                    this.CompositesInUse = true;
                }
            }
            this.iCABSTelesalesEntry();
        });

    }

    private showAlert(msgTxt: string): void {
        this.translateSub = this.localeTranslateService.ajaxSource$.subscribe(event => {
            if (event !== 0) {
                let translation = this.localeTranslateService.getTranslatedValue(msgTxt, null);
                let translatedText = msgTxt;
                if (translation.value !== '') { translatedText = translation.value; }
                this.messageModal.show({ msg: translatedText, title: 'Error Message' }, false);
            }
        });
    }

    private getSysCharDetails(): any {
        //SysChar
        this.ajaxSource.next(this.ajaxconstant.START);
        let sysCharList: number[] = [this.sysCharConstants.SystemCharEnableServiceCoverDetail, this.sysCharConstants.SystemCharServiceDetailHide];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.vBusinessCode,
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            this.ReqDetail = data.records[0].Required;
            this.ServiceDetailHide = data.records[1].Required;
            if (this.ReqDetail) {
                this.tdServiceDetail = true;
                this.detailInd = true;
            } else {
                this.tdServiceDetail = false;
                this.detailInd = false;
            }
            this.userAuthorityLookUp();
        });
    }

    private iCABSTelesalesEntry(): any {
        let xhrParams = {};
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '6');
        search.set('Function', 'CheckIsTelesalesPSale');
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));

        this.subXhr = this.httpService.makeGetRequest(
            this.xhrParams.method,
            this.xhrParams.module,
            this.xhrParams.operation,
            search
        ).subscribe(
            (data) => {
                if (data.hasOwnProperty('TelesalesInd')) {
                    if (data.TelesalesInd === 'Y') {
                        this.tdTelesalesOrder = true;
                    }
                    else {
                        this.tdTelesalesOrder = false;
                    }
                }
                this.getContractDetails();
            });
    }

    private buildGrid(): void {
        this.setMaxColCount();
        let search = new URLSearchParams();
        search.set(this.serviceConstants.Action, '2');
        search.set(this.serviceConstants.BusinessCode, this.vBusinessCode);
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set('FullAccess', this.fullAccess);
        search.set('LoggedInBranch', this.riExchange.ClientSideValues.Fetch('BranchNumber'));
        search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        search.set('PortfolioStatusCode', this.getControlValue('StatusSearchType'));
        search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber', MntConst.eTypeInteger));
        search.set('DetailInd', (this.detailInd ? 'True' : 'False'));
        search.set('Level', 'Premise');
        search.set('AllowUserAuthView', (this.lAllowUserAuthView ? 'True' : 'False'));
        search.set('LOSCode', this.LOS === 'All' ? '' : this.LOS);
        search.set('TelesalesOrderNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'TelesalesOrderNumber', MntConst.eTypeInteger));
        search.set('LanguageCode', this.riExchange.LanguageCode());
        search.set('ServiceDetailHide', this.ServiceDetailHide ? 'True' : 'False');
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('PageSize', this.itemsPerPage.toString());
        search.set('PageCurrent', this.currentPage.toString());
        search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        search.set(this.serviceConstants.GridSortOrder, this.sortType);

        let gridIP = {
            method: this.xhrParams.method,
            operation: this.xhrParams.operation,
            module: this.xhrParams.module,
            search: search
        };
        this.premiseServiceSummaryGrid.loadGridData(gridIP);
    }

    public onChangeStatus(event: any): void {
        this.premiseServiceSummaryGrid.clearGridData();
    }

    public onChangeDetailInd(event: any): void {
        this.detailInd = !this.detailInd;
        this.premiseServiceSummaryGrid.clearGridData();
    }

    public menu_onchange(event: any): void {
        if (event.target['value'] === 'AddRecord') {
            this.navigate('SearchAdd', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE,
                {
                    currentContractType: this.riExchange.getCurrentContractType()
                });
        }
        this.addOptions = 'Options';
    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.buildGrid();
    }

    private setMaxColCount(): void {
        let count = 13;
        if (this.CompositesInUse) {
            count++;
            this.ServiceCommenceDate.index = 3;
            this.gridSortHeaders.push(this.ServiceCommenceDate);
        }
        if (this.detailInd && !this.ServiceDetailHide) { count++; }
        if (this.getControlValue('StatusSearchType') === '') { count++; }
        this.maxColumn = count;

        this.validateProperties = [
            {
                'type': MntConst.eTypeCode,
                'index': 0,
                'align': 'center'
            },
            {
                'type': MntConst.eTypeText,
                'index': 1,
                'align': 'center'
            }];
        let col = 2;
        if (this.CompositesInUse) {
            this.validateProperties.push({
                'type': MntConst.eTypeText,
                'index': col,
                'align': 'center'
            });
            col++;
        }
        this.validateProperties.push({
            'type': MntConst.eTypeDate,
            'index': col,
            'align': 'center'
        });
        col++;
        if (this.detailInd && !this.ServiceDetailHide) {
            this.validateProperties.push({
                'type': MntConst.eTypeText,
                'index': col,
                'align': 'center'
            });
            col++;
        }
        this.validateProperties.push({
            'type': MntConst.eTypeCode,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeInteger,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeCurrency,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeDate,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeDate,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeDate,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeCode,
            'index': col,
            'align': 'center'
        });
        col++;
        if (this.getControlValue('StatusSearchType') === '') {
            this.validateProperties.push({
                'type': MntConst.eTypeText,
                'index': col,
                'align': 'center'
            });
            col++;
        }
        this.validateProperties.push({
            'type': MntConst.eTypeImage,
            'index': col,
            'align': 'center'
        });
        col++;
        this.validateProperties.push({
            'type': MntConst.eTypeText,
            'index': col,
            'align': 'center'
        });
    }

    public onGridRowClick(event: any): void {
        let obj = this.premiseServiceSummaryGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
        this.attributes.ProductCode = obj['rowID'];
        this.attributes.ProductDesc = event.rowData['Product Description'];
        this.attributes.ServiceCoverRowID = obj['additionalData'];
        this.attributes.RowID = obj['rowID'];
    };

    public onGridRowDBClick(event: any): void {
        let completRowData = event.trRowData;
        let obj = this.premiseServiceSummaryGrid.getCellInfoForSelectedRow(event.rowIndex, 0);
        this.attributes.ProductCode = obj['rowID'];
        this.attributes.ProductDesc = event.rowData['Product Description'];
        this.attributes.ServiceCoverRowID = obj['additionalData'];
        this.attributes.RowID = obj['rowID'];

        let index = this.getAbsoluteGridIndex(event.cellIndex);
        if (index === 0) {
            this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE,
                {
                    currentContractType: this.riExchange.getCurrentContractType()
                });
        } else if (index === 8) {
            this.router.navigate([InternalGridSearchServiceModuleRoutes.ICABSASERVICEVALUEGRID], {
                queryParams: {
                    parentMode: 'Premise-ServiceSummary',
                    ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                    PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                    ServiceCoverRowID: this.attributes.RowID,
                    ProductCode: this.attributes.ProductCode,
                    ProductDesc: this.attributes.ProductDesc
                }
            });
        } else if (index === 14 && event.cellData.text) {
            this.router.navigate([InternalSearchModuleRoutes.ICABSASERVICESUMMARYDETAIL], {
                queryParams: {
                    parentMode: 'Premise',
                    ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                    PremiseNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                    PremiseName: this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                    ServiceCoverRowID: this.attributes.ServiceCoverRowID,
                    ProductCode: this.attributes.ProductCode,
                    ProductDesc: this.attributes.ProductDesc,
                    currentContractType: this.riExchange.getCurrentContractType()
                }
            });
        }
    }

    public getAbsoluteGridIndex(index: number): number {
        let ret: number = index;
        if (ret === 0) { return ret; }
        if (!this.CompositesInUse) { ret++; }
        if (!this.detailInd || this.ServiceDetailHide) { ret++; }
        if (ret > 10) {
            if (this.getControlValue('StatusSearchType') !== '') { ret++; }
        }
        return ret;
    }
}
