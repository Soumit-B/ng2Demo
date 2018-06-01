import { CCMModuleRoutes, AppModuleRoutes, InternalMaintenanceApplicationModuleRoutes, InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { Validator, Validators } from '@angular/forms';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Utils } from './../../../shared/services/utility';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, Injector, OnDestroy } from '@angular/core';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Location } from '@angular/common';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSCMCustomerContactHistoryGrid.html'
})

export class CustomerContactHistoryGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('grdCustomerContactGrid') grdCustomerContactGrid: GridComponent;
    @ViewChild('grdCustomerContactPagination') grdCustomerContactPagination: PaginationComponent;
    @ViewChild('historyFilterDropDown') historyFilterDropDown: DropdownComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;

    public search: URLSearchParams;
    public pageId: string = '';
    public pageTitle: string = '';
    public parentMode: string = '';
    public inputParams: any = {};
    public itemsPerPage: number = 10;
    public totalRecords: number = 10;
    public currentPage: number = 1;
    public branchName: string = '';
    public maxColumn: number = 4;
    public isShowDetailVisible: boolean = true;

    public customerModel: any = {
        'AccountName': '',
        'AccountNumber': '',
        'ContractName': '',
        'ContractNumber': '',
        'PremiseName': '',
        'PremiseNumber': '',
        'ProductCode': '',
        'ProductDesc': '',
        'ServiceCoverNumber': '',
        'ServiceCoverRowID': ''
    };
    public fromDate: Date = new Date();
    public toDate: Date = new Date();

    public dateObjectsDisabled: Object = {
        fromDate: false,
        toDate: false
    };
    public dateObjectsRequired: Object = {
        fromDate: true,
        toDate: true
    };
    public clearDate: Object = {
        fromDate: false,
        toDate: false
    };

    public attributeList: any = {};
    public validateProperties: Array<any> = [];
    public contractRenewalStatus: boolean = false;
    public languageCode: string = 'ENG';
    public showMessageHeader: boolean = false;
    public showErrorHeader: boolean = false;
    public promptTitle: string = '';
    public promptContent: string = '';

    public muleConfig = {
        method: 'ccm/maintenance',
        module: 'tickets',
        operation: 'ContactManagement/iCABSCMCustomerContactHistoryGrid',
        contentType: 'application/x-www-form-urlencoded',
        action: '2'
    };

    public controls = [
        { name: 'AccountNumber', readonly: false, disabled: true, required: false },
        { name: 'AccountName', readonly: false, disabled: true, required: false },
        { name: 'FromDate', readonly: false, disabled: false, required: true },
        { name: 'ToDate', readonly: false, disabled: false, required: true },
        { name: 'HistoryFilter', readonly: false, disabled: false, required: false, value: 'all' },
        { name: 'ContractName', readonly: false, disabled: true, required: false },
        { name: 'ContractNumber', readonly: false, disabled: true, required: false },
        { name: 'ShowDetail', readonly: false, disabled: false, required: false },
        { name: 'PremiseName', readonly: false, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: true, required: false },
        { name: 'ProductCode', readonly: false, disabled: true, required: false },
        { name: 'ProductDesc', readonly: false, disabled: true, required: false },
        { name: 'ServiceCoverNumber', readonly: false, disabled: true, required: false },
        { name: 'ServiceCoverRowID', readonly: false, disabled: true, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMCUSTOMERCONTACTHISTORYGRID;
        this.pageTitle = 'Customer Contact History';
        this.search = this.getURLSearchParamObject();

    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getParentFields();

        this.utils.setTitle(this.pageTitle);
        if (this.parentMode === 'ServiceCover') {
            //this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', '');
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', '');
        }

        this.fromDate.setMonth(this.fromDate.getMonth() + -12);
        let getFromDate = this.globalize.parseDateToFixedFormat(this.fromDate);
        let getToDate = this.globalize.parseDateToFixedFormat(this.toDate);

        this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', getFromDate);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', getToDate);

        let data = this.riExchange.riInputElement.GetValue(this.uiForm, 'HistoryFilter');
        this.onHistoryFilterValue(data);

        if ((this.parentMode !== 'Premise') && (this.parentMode !== 'ServiceCover')) {
            this.contractRenewalStatus = true;
        }
        this.getValidateProperties();
        this.buildGrid();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }


    public getParentFields(): void {
        this.customerModel.AccountName = this.getNodeValue(this.riExchange.getParentHTMLValue('AccountName'));
        this.customerModel.AccountNumber = this.getNodeValue(this.riExchange.getParentHTMLValue('AccountNumber'));
        this.customerModel.ContractName = this.getNodeValue(this.riExchange.getParentHTMLValue('ContractName'));
        this.customerModel.ContractNumber = this.getNodeValue(this.riExchange.getParentHTMLValue('ContractNumber'));
        this.customerModel.PremiseName = this.getNodeValue(this.riExchange.getParentHTMLValue('PremiseName'));
        this.customerModel.PremiseNumber = this.getNodeValue(this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.customerModel.ProductCode = this.getNodeValue(this.riExchange.getParentHTMLValue('ProductCode'));
        this.customerModel.ServiceCoverNumber = this.getNodeValue(this.riExchange.getParentHTMLValue('ServiceCoverNumber'));
        this.customerModel.ProductDesc = this.getNodeValue(this.riExchange.getParentHTMLValue('ProductDesc'));
        this.customerModel.ServiceCoverRowID = this.getNodeValue(this.riExchange.getParentHTMLValue('ServiceCoverRowID'));

        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.customerModel.AccountName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.customerModel.AccountNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.customerModel.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.customerModel.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.customerModel.PremiseName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.customerModel.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.customerModel.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.customerModel.ProductDesc);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', this.customerModel.ServiceCoverNumber);

        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', this.customerModel.ServiceCoverRowID);

    }

    private getNodeValue(value: any): void {
        return (value) ? value : '';
    }

    public buildGrid(): void {

        if (!this.uiForm.controls['FromDate'].value || !this.uiForm.controls['ToDate'].value)
            return;

        this.search = new URLSearchParams();
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;

        let blnShowDetail: string = '';
        if ((this.uiForm.controls['ShowDetail'].value === true) && (this.isShowDetailVisible === true)) {
            blnShowDetail = 'yes';
        }
        else {
            blnShowDetail = 'no';
        }


        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', '199032');
        this.search.set('riSortOrder', 'Descending');
        this.search.set('Function', 'CMHistory');

        this.search.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'));
        this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
        this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
        this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.search.set('ServiceCoverNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverNumber'));
        this.search.set('ServiceCoverRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceCoverRowID'));
        this.search.set('FromDate', this.globalize.parseDateToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'FromDate')) as string);
        this.search.set('ToDate', this.globalize.parseDateToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'ToDate')) as string);
        this.search.set('Filter', this.riExchange.riInputElement.GetValue(this.uiForm, 'HistoryFilter'));
        this.search.set('LanguageCode', this.languageCode);
        this.search.set('ShowDetail', blnShowDetail);

        this.search.set(this.serviceConstants.GridPageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.GridPageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.Action, this.muleConfig.action);
        this.inputParams.search = this.search;
        this.grdCustomerContactGrid.loadGridData(this.inputParams);
    }

    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
    }
    public getCurrentPage(data: any): void {
        this.currentPage = data.value;
        this.buildGrid();
    }

    public refresh(): void {
        this.currentPage = 1;
        this.buildGrid();
    }

    public getConvertedDate(dateValue: any): any {
        let returnDate = '';
        if (dateValue) {
            returnDate = this.utils.convertDate(dateValue);
            returnDate = dateValue;
        } else {
            returnDate = '';
        }

        return returnDate;
    }

    public onHistoryFilterValue(value: any): void {
        switch (value) {
            case 'all':
                this.isShowDetailVisible = true;
                break;
            case 'visits':
                this.isShowDetailVisible = false;
                break;
            case 'invoices':
                this.isShowDetailVisible = false;
                break;
            case 'contacts':
                this.isShowDetailVisible = true;
                break;
            case 'renewal':
                this.isShowDetailVisible = false;
                break;
            default:
                break;
        }
        //this.refresh();
    }

    public onShowDetail(): void {
        //this.refresh();
    }

    public selectedDataOnDoubleClick(event: any): void {
        this.selectedDataOnCellFocus(event);
        this.detail(event);
    }

    public selectedDataOnCellFocus(event: any): void {
        console.log('AccountNumberRowID', this.attributeList['AccountNumberRowID']);
        this.attributeList = {};
        if (event.cellIndex === 0) {
            this.attributeList['AccountNumberRow'] = event.rowIndex;
            this.attributeList['AccountNumberCell'] = event.cellIndex;
            this.attributeList['AccountNumberRowID'] = event.cellData.rowID;
            this.attributeList['AccountNumberTableName'] = event.cellData.additionalData;
        }
        else if (event.cellIndex === 3) {
            this.attributeList['AccountNumberRowID'] = event.cellData.rowID;
            this.attributeList['AccountNumberTableName'] = event.cellData.additionalData;
            this.attributeList['ContractNumberViewRowID'] = event.cellData.rowID;
        }

        if (event.trRowData && event.trRowData.length >= 2) {
            this.attributeList['HistoryTextAdditionalProperty'] = event.trRowData[2].additionalData;
        }
    }



    public getAttribute(attrName: any): any {
        let defaultValue = '';
        if (this.attributeList && this.attributeList.hasOwnProperty(attrName)) {
            defaultValue = this.attributeList[attrName];
        }

        return defaultValue;
    }

    private detail(event: any): void {
        switch (event.cellIndex) {
            case 3:
                if (event.cellData.text === 'SP') {
                    switch (event.cellData.additionalData.toUpperCase()) {
                        case 'SERVICEVISIT':
                            this.visitPrint();
                            break;
                        case 'INVOICEHEADER':
                            this.invoicePrint();
                            break;
                        case 'CONTRACTRENEWAL':
                            this.contractRenewalPrint();
                            break;
                        default:
                            this.messageService.emitMessage(event.cellData.additionalData.toUpperCase());
                    }
                }
                break;
            default:

                switch (event.cellData.additionalData.toUpperCase()) {
                    case 'INVOICEHEADER':
                        this.invoicePrint();
                        break;

                    case 'CONTACTACTION':
                        this.ContactAction();
                        break;
                    case 'CUSTOMERCONTACT':
                        this.CustomerContact();
                        break;
                    case 'PLANVISIT':
                        this.PlanVisit();
                        break;
                    case 'SERVICEVISIT':
                        this.ServiceVisit();
                        break;
                    case 'CONTRACTRENEWAL':
                        this.contractRenewalPrint();
                        break;
                    default:
                        this.messageService.emitMessage(event.cellData.additionalData.toUpperCase());

                }
        }
    }

    private CustomerContact(): void {
        alert('ContactManagement iCABSCMCustomerContactDetailGrid.htm');
        //this.router.navigate(['/'], { queryParams: { parentMode: 'ContactHistory' } });
    }

    private ContactAction(): void {
        this.router.navigate([AppModuleRoutes.CCM + CCMModuleRoutes.ICABSCMCONTACTACTIONMAINTENANCE], {
            queryParams: {
                parentMode: 'ContactHistory',
                ROWID: this.attributeList['AccountNumberRowID']
            }
        });
    }

    private PlanVisit(): void {
        //Application/iCABSAPlanVisitMaintenance.htm
        this.router.navigate([InternalMaintenanceApplicationModuleRoutes.ICABSAPLANVISITMAINTENANCE], { queryParams: { parentMode: 'ContactHistory' } });
    }

    private ServiceVisit(): void {
        this.navigate('ContactHistory', InternalMaintenanceServiceModuleRoutes.ICABSSESERVICEVISITMAINTENANCE, {
            ServiceVisitRowID: this.attributeList['AccountNumberRowID']
        });
    }

    private visitPrint(): void {
        let strURL = '';

        let paramObj = {
            'Function': 'Single',
            'PremiseVisitRowID': this.getAttribute('ContractNumberViewRowID')
        };

        this.fetchPrintData(paramObj).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e['errorMessage'] || e['fullError']) {
                        this.errorModal.show(e, true);
                    }
                    else {
                        if (e.url) {
                            strURL = e.url;
                            window.open(strURL, '_blank');
                        }
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    private invoicePrint(): void {
        let strURL = '';

        let paramObj = {
            'Function': 'Single',
            'InvoiceNumber': this.getAttribute('AccountNumberRowID')
        };

        this.fetchPrintData(paramObj).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e['errorMessage'] || e['fullError']) {
                        this.errorModal.show(e, true);
                    }
                    else {
                        if (e.url) {
                            strURL = e.url;
                            window.open(strURL, '_blank');
                        }
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }

    private contractRenewalPrint(): void {
        let strURL = '';

        let paramObj = {
            'ReportNumber': this.getAttribute('HistoryTextAdditionalProperty')
        };

        this.fetchPrintData(paramObj).subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e['errorMessage'] || e['fullError']) {
                        this.errorModal.show(e, true);
                    }
                    else {
                        if (e.url) {
                            strURL = e.url;
                            window.open(strURL, '_blank');
                        }
                    }
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );
    }


    public fetchPrintData(params: any): any {
        this.search = new URLSearchParams();
        // this.inputParams.module = this.muleConfig.module;
        // this.inputParams.method = this.muleConfig.method;
        // this.inputParams.operation = this.muleConfig.operation;
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());

        this.search.set(this.serviceConstants.Action, '0');

        for (let key in params) {
            if (key) {
                this.search.set(key, params[key]);
            }
        }
        return this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search);
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    public fromDateSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', value['value']);
            this.refresh();
        }
        else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'FromDate', '');
        }
    }
    public toDateSelectedValue(value: Object): void {
        if (value && value['value']) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', value['value']);
            this.refresh();
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ToDate', '');
        }
    }

    public promptSave(event: any): void {
        // statement
    }

    public getValidateProperties(): any {
        this.validateProperties = [
            {
                'type': MntConst.eTypeDate,
                'index': 0,
                'align': 'center'
            }];
    }
}
