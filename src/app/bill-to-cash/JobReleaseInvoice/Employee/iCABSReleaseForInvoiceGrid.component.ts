import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { ErrorCallback } from '../../../base/Callback';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { ServiceCoverSearchComponent } from './../../../internal/search/iCABSAServiceCoverSearch';
import { PremiseSearchComponent } from './../../../internal/search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { InternalMaintenanceApplicationModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../../base/PageRoutes';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ServiceTypeSearchComponent } from './../../../internal/search/iCABSBServiceTypeSearch.component';

@Component({
    templateUrl: 'iCABSReleaseForInvoiceGrid.html',
    styles: [`
    :host /deep/ .gridtable tbody tr td input.form-control
    {
        cursor: pointer;
    }`]
})

export class ReleaseForInvoiceGridComponent extends BaseComponent implements OnInit, OnDestroy, ErrorCallback, AfterViewInit {
    @ViewChild('contractNumberEllipsis') contractNumberEllipsis: EllipsisComponent;
    @ViewChild('premisesNumberEllipsis') premisesNumberEllipsis: EllipsisComponent;
    @ViewChild('productcodeEllipsis') productcodeEllipsis: EllipsisComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('riGrid') riGrid: GridComponent;
    @ViewChild('riPagination') riPagination: PaginationComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('contractNumber') public formControlContractNumber;
    @ViewChild('promptOKCancelModal') public promptOKCancelModal;
    public pageId: string = '';
    public currentContractTypeURLParameter: string;
    public dtDateTo: Date = new Date();
    public ToDate: any;

    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalRecords: number = 0;
    public maxColumn: number = 13;
    public search: URLSearchParams;
    public inputParams: any = {};
    public srcElementName: string = '';
    public serviceCommenceDate: string = '';
    public serviceDateStart: string = '';
    public legend: Array<any> = [];
    public gridSortHeaders: any[] = [];
    public headerClicked: string = '';
    public sortType: string = 'ASC';
    public validateProperties: Array<any> = [];
    public ellipsisConfig = {
        contract: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': false
            },
            modalConfig: '',
            contentComponent: ContractSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        premises: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': false
            },
            modalConfig: '',
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        product: {
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-Freq',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'currentContractType': '',
                'currentContractTypeURLParameter': '',
                'showAddNew': false
            },
            modalConfig: '',
            contentComponent: ServiceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

     public dropdown: Object = {
         serviceTypeSearch: {
            isRequired: false,
            isDisabled: false,
            params: {
                parentMode: 'LookUp'
            }
        }
     };

    public showErrorHeader: any = true;
    public showMessageHeader = true;

    public muleConfig = {
        method: 'bill-to-cash/maintenance',
        module: 'invoicing',
        operation: 'Application/iCABSReleaseForInvoiceGrid',
        contentType: 'application/x-www-form-urlencoded'
    };

    public datePickerConfig = {
        DateTo: {
            isDisabled: false,
            isRequired: true
        }
    };

    public promptConfig = {
        OKCancel: {
            showPromptMessageHeader: true,
            promptConfirmTitle: '',
            promptConfirmContent: ''
        }
    };

    public promptMode: string = '';
    public msgDateText: string = '';
    public msgDateTitle: string = '';
    public isCmdReleaseAllDisabled: boolean = false;

    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: true, required: false },
        { name: 'ServiceType', readonly: false, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: true, required: false },
        { name: 'DateFilter', value: 'ServiceDate', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: false, disabled: false, required: false },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false },
        { name: 'ContractType', value: 'All', readonly: true, disabled: false, required: false },
        { name: 'ContractSuspendInd', value: true, readonly: false, disabled: false, required: false },
        { name: 'PremiseSuspendInd', value: true, readonly: false, disabled: false, required: false },
        { name: 'ServiceCover', readonly: false, disabled: false, required: false },
        { name: 'ServiceCoverRowID', readonly: false, disabled: false, required: false },
        { name: 'ContractRowID', readonly: false, disabled: false, required: false },
        { name: 'DateTo', readonly: false, disabled: false, required: false }
    ];


    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSRELEASEFORINVOICEGRID;
        this.browserTitle = 'Release For Invoicing';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Release For Invoicing';
        this.isCmdReleaseAllDisabled = true;
        this.formControlContractNumber.nativeElement.focus();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            setTimeout(() => {
                let getDateTo: any = this.globalize.parseDateToFixedFormat(this.formData.DateTo);
                this.dtDateTo = this.globalize.parseDateStringToDate(getDateTo) as Date;
            }, 0);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', this.formData.DateTo);
        }
        this.getDateMessageStrings();
        this.getValidateProperties();
        this.applyGridFilter();
        this.displayLegend();
    }

    public ngAfterViewInit(): void {
        this.setErrorCallback(this);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public onContractNumberSearchDataReceived(data: any, route: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        if (data.ContractName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        }

        this.updateEllipsisConfig();
    }

    public onPremiseNumberSearchDataReceived(data: any, route: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
        if (data.PremiseName) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
        }

        this.updateEllipsisConfig();
    }

    public onProductCodeSearchDataReceived(data: any, route: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.row.ProductCode);
        if (data.row.ProductDesc) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.row.ProductDesc);
        }
    }

    private updateEllipsisConfig(): void {
        this.ellipsisConfig.premises.childConfigParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') || '';
        this.ellipsisConfig.premises.childConfigParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName') || '';
        this.ellipsisConfig.product.childConfigParams.ContractName = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName') || '';
        this.ellipsisConfig.product.childConfigParams.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') || '';
        this.ellipsisConfig.product.childConfigParams.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') || '';
        this.ellipsisConfig.product.childConfigParams.PremiseName = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName') || '';
    }

    public getTranslatedValue(key: any, params: any): any {
        if (params) {
            return this.translate.get(key, { value: params });
        } else {
            return this.translate.get(key);
        }

    }

    public modalHidden(): void {
        this.promptMode = '';
    }

    public onSelectedDateValue(data: any): void {
        if (data && data['value']) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DateTo', data.value);
        }
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public getGridInfo(info: any): void {
        this.totalRecords = info.totalRows;
        if (info && info.totalPages) {
            this.totalRecords = parseInt(info.totalPages, 0) * this.itemsPerPage;
        } else {
            this.totalRecords = 0;
        }
    }

    public displayLegend(): any {
        this.legend = [];
        this.legend = [
            { color: '#FFFFCC', label: 'Contract Suspended' },
            { color: '#CCFFCC', label: 'Premises Suspended' },
            { color: '#FFCCCC', label: 'Not Authorised' }
        ];
    }

    public getCurrentPage(data: any): void {
        this.currentPage = data.value;
        this.buildGrid();
    }

    public buildGrid(): void {
        this.search = new URLSearchParams();
        this.inputParams.module = this.muleConfig.module;
        this.inputParams.method = this.muleConfig.method;
        this.inputParams.operation = this.muleConfig.operation;
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set('riGridMode', '0');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        this.search.set('PageSize', this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClicked);
        this.search.set(this.serviceConstants.GridSortOrder, ((this.sortType === 'DESC') || (this.sortType === 'Descending')) ? 'Descending' : 'Ascending');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('DateTo', this.globalize.parseDateToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'DateTo')) as string);
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('ContractType', this.uiForm.controls['ContractType'].value);
        this.search.set('ServiceType', this.uiForm.controls['ServiceType'].value);
        this.search.set('DateFilter', this.uiForm.controls['DateFilter'].value);
        this.search.set('IncludeContract', (this.uiForm.controls['ContractSuspendInd'].value === true) ? 'True' : 'False');
        this.search.set('IncludePremise', (this.uiForm.controls['PremiseSuspendInd'].value === true) ? 'True' : 'False');
        if (this.attributes && this.attributes.hasOwnProperty('ProductCodeServiceCoverRowID') && this.attributes['ProductCodeServiceCoverRowID']) {
            this.search.set('ServiceCoverRowID', this.attributes['ProductCodeServiceCoverRowID']);
        }
        else {
            this.search.set('ServiceCoverRowID', '');
        }
        this.inputParams.search = this.search;
        this.riGrid.loadGridData(this.inputParams);
        this.riGrid_AfterExecute();
    }

    public sortGrid(obj: any): void {
        this.headerClicked = obj.fieldname;
        this.sortType = obj.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }

    private applyGridFilter(): void {
        let objContractNumber = {
            'fieldName': 'ContractNumber',
            'index': 0,
            'colName': 'Contract Job Number',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objContractNumber);
        let objServiceDateStart = {
            'fieldName': 'ServiceDateStart',
            'index': 7,
            'colName': 'Service Date',
            'sortType': 'ASC'
        };
        this.gridSortHeaders.push(objServiceDateStart);

    }

    public promptCancel(event: any): void {
        //TODO:
    }

    public confirmOKCancel(event: any): void {

        switch (this.promptMode) {
            case 'riGrid_BodyOnClick':
                this.promptMode = '';
                this.riGrid_BodyOnClickConfirm();
                break;
            case 'cmdReleaseAll_onClick':
                this.promptMode = '';
                this.cmdReleaseAll_onClickConfirm();
                break;
            default:
                break;
        }

    }

    public riGrid_AfterExecute(): any {
        if (this.uiForm.controls['ContractNumber'].value) {
            this.isCmdReleaseAllDisabled = false;
        }
        else {
            this.isCmdReleaseAllDisabled = true;
        }
    }

    public refresh(): void {
        this.headerClicked = '';
        this.buildGrid();
    }


    public selectedDataOnDoubleClick(event: any): void {
        if (event) {
            this.serviceCoverFocus(event);

            let drillDownData = event.trRowData[4].drillDown;
            let tempData = event.trRowData[0].text;
            let tempDataList = tempData.split('/');
            let contractNumber = (tempDataList && (tempDataList.length > 1)) ? tempDataList[1] : '';
            let premiseNumber = event.trRowData[1].text;
            let productCode = event.trRowData[5].text;
            let contractCommenceDate = event.trRowData[4].text;
            let serviceCommenceDate = event.trRowData[8].text;

            switch (event.cellIndex) {
                case 0:
                    if (event.trRowData[0].additionalData === 'J') {
                        this.navigate('Release', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                            parentMode: 'Release',
                            currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                            ContractNumber: contractNumber,
                            currentContractType: event.trRowData[0].additionalData
                        });
                    }
                    if (event.trRowData[0].additionalData === 'C') {
                        this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                            parentMode: 'Release',
                            currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                            ContractNumber: contractNumber,
                            currentContractType: event.trRowData[0].additionalData
                        });
                    }
                    if (event.trRowData[0].additionalData === 'P') {
                        this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                            parentMode: 'Release',
                            currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                            ContractNumber: contractNumber,
                            currentContractType: event.trRowData[0].additionalData
                        });
                    }
                    break;
                case 1:

                    this.navigate('Release', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE,
                        {
                            parentMode: 'Release',
                            currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                            ContractNumber: contractNumber,
                            PremiseNumber: premiseNumber,
                            PremiseRowID: this.attributes['ContractNumberPremiseRowID'] || '',
                            ContractTypeCode: event.trRowData[0].additionalData
                        }
                    );

                    break;
                case 5:
                    this.navigate('Release', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                        currentContractTypeURLParameter: this.currentContractTypeURLParameter,
                        ContractNumber: contractNumber,
                        PremiseNumber: premiseNumber,
                        ProductCode: productCode,
                        ServiceCoverRowID: this.getAttribute('ContractNumberServiceCoverRowID') || '',
                        currentContractType: event.trRowData[0].additionalData
                    });
                    break;
                case 4:
                    if (drillDownData === true) {
                        this.navigate('Release', InternalMaintenanceSalesModuleRoutes.ICABSACONTRACTCOMMENCEDATEMAINTENANCE,
                            {
                                parentMode: 'Release',
                                CurrentContractTypeURLParameter: this.currentContractTypeURLParameter,
                                ContractNumber: contractNumber,
                                PremiseNumber: premiseNumber,
                                ProductCode: productCode,
                                ContractCommenceDate: contractCommenceDate,
                                CurrentContractType: event.trRowData[0].additionalData
                            }
                        );
                    }

                    break;
                case 8:
                    this.navigate('Release', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCE, {
                        ContractNumber: contractNumber,
                        PremiseNumber: premiseNumber,
                        ProductCode: productCode,
                        ServiceCommenceDate: serviceCommenceDate
                    });
                    break;
                default:
                    break;

            }

        }
    }


    public selectedDataOnCellFocus(event: any): void {
        this.serviceDateStart = '';
        this.serviceCommenceDate = '';
        if (event.columnClicked) {
            this.srcElementName = event.columnClicked.text;
        }
        if (event.trRowData) {
            this.serviceDateStart = event.trRowData[7].text ? event.trRowData[7].text : '';
            this.serviceCommenceDate = event.trRowData[8].text ? event.trRowData[8].text : '';
        }

        if ((event.cellIndex === 12) && (event.cellData.text)) {
            this.serviceCoverFocus(event);
            if (this.serviceCommenceDate.toString() !== this.serviceDateStart.toString()) {
                this.promptMode = 'riGrid_BodyOnClick';
                this.promptConfig.OKCancel.promptConfirmTitle = this.msgDateTitle;
                this.promptConfig.OKCancel.promptConfirmContent = this.msgDateText;
                this.promptOKCancelModal.show();
            }
        }
    }

    public riGrid_BodyOnClickConfirm(): any {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');

        let postObj: any = {};
        postObj.Function = 'Unsuspend';
        postObj.ServiceCoverRowID = this.getAttribute('ContractNumberServiceCoverRowID');



        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e.MessageText) {
                        this.msgDateText = e.MessageText;
                    }
                    if (e.MessageTitle) {
                        this.msgDateTitle = e.MessageTitle;
                    }
                    this.buildGrid();
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });

    }

    public serviceCoverFocus(event: any): void {
        if (event.cellData) {
            this.attributes.ContractNumberRow = event.cellData.rowIndex;
            this.attributes.ContractNumberContractRowID = event.trRowData[0].rowID;
            this.attributes.ContractNumberPremiseRowID = event.trRowData[1].rowID;
            this.attributes.ContractNumberServiceCoverRowID = event.trRowData[5].rowID;
            this.attributes.grdServiceCoverServiceCoverRowID = event.trRowData[5].rowID;
            this.attributes.grdServiceCoverRow = event.cellData.rowIndex;

            switch (event.cellData.additionalData) {
                case 'C':
                    this.currentContractTypeURLParameter = '';
                    break;
                case 'J':
                    this.currentContractTypeURLParameter = '<job>';
                    break;
                case 'P':
                    this.currentContractTypeURLParameter = '<product>';
                    break;
                default:
                    break;
            }
        }
    }

    public getDateMessageStrings(): any {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');

        let postObj: any = {};
        postObj.Function = 'GetDateString';

        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e.MessageText) {
                        this.msgDateText = e.MessageText;
                    }
                    if (e.MessageTitle) {
                        this.msgDateTitle = e.MessageTitle;
                    }

                }
            },
            (error) => {
                this.errorService.emitError(error);
            });

    }

    public cmdReleaseAll_onClick(event: any): any {
        let obj = document.querySelectorAll('.gridtable tbody > tr');
        if (obj.length > 0) {
            this.promptMode = 'cmdReleaseAll_onClick';
            this.promptConfig.OKCancel.promptConfirmTitle = this.msgDateTitle;
            this.promptConfig.OKCancel.promptConfirmContent = this.msgDateText;
            this.promptOKCancelModal.show();
        }
    }

    public cmdReleaseAll_onClickConfirm(): any {

        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');

        let postObj: any = {};
        postObj.Function = 'UnsuspendAll';
        postObj.BranchCode = this.utils.getBranchCode();
        if (this.uiForm.controls['ContractNumber'].value) {
            postObj.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        }
        if (this.uiForm.controls['PremiseNumber'].value) {
            postObj.ContractNumber = this.uiForm.controls['PremiseNumber'].value;
        }

        if (this.uiForm.controls['ProductCode'].value) {
            postObj.ContractNumber = this.uiForm.controls['ProductCode'].value;
        }

        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e['errorMessage']) {
                        this.messageModal.show({ msg: e['errorMessage'], title: this.pageTitle }, false);
                    }
                    this.buildGrid();
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

    public onChange(event: any): void {
        if (!event) return;
        if (event.target.value === '') {
            this.uiForm.controls['PremiseNumber'].setValue('');
            this.uiForm.controls['PremiseName'].setValue('');
            this.uiForm.controls['ProductCode'].setValue('');
            this.uiForm.controls['ProductDesc'].setValue('');
        }
        let elementValue = event.target.value;
        let _paddedValue = elementValue;
        if (event.target.id === 'ContractNumber') {
            if (elementValue.length > 0) {
                event.target.value = this.utils.numberPadding(elementValue, 8);
                this.uiForm.controls['ContractNumber'].setValue(event.target.value);
            }
            this.populateDescriptions(event);
        }
        else if (event.target.id === 'PremiseNumber') {
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '') {
                this.uiForm.controls['PremiseNumber'].setValue('');
                this.uiForm.controls['PremiseName'].setValue('');
                this.uiForm.controls['ProductCode'].setValue('');
                this.uiForm.controls['ProductDesc'].setValue('');
            }
            else {
                this.populateDescriptions(event);
            }
        }
        else if (event.target.id === 'ProductCode') {
            if (this.attributes && this.attributes.hasOwnProperty('ProductCodeServiceCoverRowID') && this.attributes['ProductCodeServiceCoverRowID']) {
                this.attributes['ProductCodeServiceCoverRowID'] = '';
            }
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') === '') {
                this.uiForm.controls['PremiseNumber'].setValue('');
                this.uiForm.controls['PremiseName'].setValue('');
                this.uiForm.controls['ProductCode'].setValue('');
                this.uiForm.controls['ProductDesc'].setValue('');
            }
            else {
                this.populateDescriptions(event);
            }

        }
    };

    public onKeyDown(event: any): void {

        if (event && event.target) {
            let elementValue = event.target.value;
            let _paddedValue = elementValue;

            if (event.target.id === 'ContractNumber') {
                if (this.contractNumberEllipsis)
                    this.contractNumberEllipsis.openModal();
            }
            else if (event.target.id === 'PremiseNumber') {
                if (this.premisesNumberEllipsis)
                    this.premisesNumberEllipsis.openModal();
            }
            else if (event.target.id === 'ProductCode') {
                if (this.productcodeEllipsis)
                    this.productcodeEllipsis.openModal();
            }
        }

    };

    private populateDescriptions(event: any): void {

        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '6');

        let postObj: any = {};
        postObj.Function = 'SetDisplayFields';
        if (this.uiForm.controls['ContractNumber'].value) {
            postObj.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        }
        if (this.uiForm.controls['PremiseNumber'].value) {
            postObj.PremiseNumber = this.uiForm.controls['PremiseNumber'].value;
        }

        if (this.uiForm.controls['ProductCode'].value) {
            postObj.ProductCode = this.uiForm.controls['ProductCode'].value;
        }

        if (this.attributes && this.attributes.hasOwnProperty('ProductCodeServiceCoverRowID') && this.attributes['ProductCodeServiceCoverRowID']) {
            postObj.ServiceCoverRowID = this.attributes['ProductCodeServiceCoverRowID'];
        }

        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.search, postObj)
            .subscribe(
            (e) => {
                if (e.status === 'failure') {
                    this.errorService.emitError(e.oResponse);
                } else {
                    if (e) {
                        let contractNumber = (e.ContractNumber) ? this.utils.numberPadding(e.ContractNumber, 8) : '';
                        this.uiForm.controls['ContractName'].setValue(e.ContractName);
                        this.uiForm.controls['PremiseName'].setValue(e.PremiseName);
                        this.uiForm.controls['ProductDesc'].setValue(e.ProductDesc);
                    }
                    else {
                        this.uiForm.controls['ContractNumber'].setValue('');
                        this.uiForm.controls['ContractName'].setValue('');
                        this.uiForm.controls['PremiseNumber'].setValue('');
                        this.uiForm.controls['PremiseName'].setValue('');
                        this.uiForm.controls['ProductCode'].setValue('');
                        this.uiForm.controls['ProductDesc'].setValue('');
                    }
                }

                this.buildGrid();
                this.updateEllipsisConfig();
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

    public getAttribute(attributeName: any): any {
        let attrValue = '';
        if (this.attributes && this.attributes.hasOwnProperty(attributeName) && this.attributes[attributeName]) {
            attrValue = this.attributes[attributeName];
        }
        return attrValue;
    }

    public getValidateProperties(): any {
        this.validateProperties = [
        {
            'type': MntConst.eTypeDate,
            'index': 4,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeDate,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeDate,
            'index': 8,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 9,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCurrency,
            'index': 10,
            'align': 'center'
        }];
    }

    public onServiceTypeDataReceived(data: any): void {
        if (data) {
          this.uiForm.controls['ServiceType'].setValue(data['ServiceTypeCode'] || '');
        }
        else {
            this.uiForm.controls['ServiceType'].setValue('');
        }
    }

}
