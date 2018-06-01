import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from './../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { MessageCallback, ErrorCallback } from './../../../base/Callback';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { DatepickerComponent } from './../../../../shared/components/datepicker/datepicker';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { ProductSearchGridComponent } from './../../../internal/search/iCABSBProductSearch';
import { AccountSearchComponent } from './../../../internal/search/iCABSASAccountSearch';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';

@Component({
    templateUrl: 'iCABSAMultiPremiseSpecial.html',
    styles: [`
    :host /deep/ .gridtable tbody tr td:nth-child(1) div input {
        cursor: pointer;
    }
    :host /deep/ .gridtable tbody tr td:nth-child(2) div span {
        background: #FFF;
        border-radius: 2px;
        border: 1px solid #999;
        box-shadow: inset 0 1px 1px rgba(0,0,0,0.05);
        font-family: "Open Sans",sans-serif;
        font-weight: normal;
        font-size: 1em;
        padding: 0 0.5em;
        color: #5a5d60;
        line-height: 25px;
        text-align: center;
        padding: 0 7px;
        display: block;
        cursor: pointer;
    }

    .message-box.warning {
        color: #000;
        background-color: #FF69B4;
    }
  `]
})

export class MultiPremiseSpecialComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy, MessageCallback, ErrorCallback {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModalApplyChanges') public promptModalApplyChanges;
    @ViewChild('multiPremisesGrid') multiPremisesGrid: GridComponent;
    @ViewChild('multiPremisesPagination') multiPremisesPagination: PaginationComponent;
    @ViewChild('effectiveDatePicker') effectiveDatePicker: DatepickerComponent;

    public pageId: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public queryPost: URLSearchParams = this.getURLSearchParamObject();
    public promptTitleSave: string = '';
    public promptContentForApplyChanges: string = '';
    public messageContentSave: string = MessageConstant.Message.SavedSuccessfully;
    public errorMessage: string;
    public messageContentError: string = '';
    public autoOpen: boolean = false;
    private headerClicked: string;
    private sortType: string;
    public sortIndex: Array<any>;
    public isRequesting: boolean = false;
    public mandatoryContactNumber: boolean = true;
    public rowData: any;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public controls: any[] = [
        { name: 'AccountNumber', disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'AccountName', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ContractNumber', disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'IncreaseValueFrom', disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'IncreaseValueBy', disabled: false, required: false, type: MntConst.eTypeDecimal2 },
        { name: 'EffectiveDate', disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'effectiveDate', disabled: false, required: false },
        { name: 'BusinessOrigin', disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'BusinessOriginDescription', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'UpdateType', disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'SpecialInstructions', disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: false, required: false, type: MntConst.eTypeText }
    ];
    public effectiveDate: Date = new Date();
    public muleConfig = {
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        operation: 'Application/iCABSAMultiPremiseSpecial'
    };
    public gridParams: any = {
        totalRecords: 0,
        maxColumn: 13,
        itemsPerPage: 10,
        currentPage: 1,
        riGridMode: 0,
        riGridHandle: 23332480
    };

    public validateProperties: Array<any> = [
        {
            'type': MntConst.eTypeCode,
            'index': 0,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 1,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 2,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 3,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCode,
            'index': 4,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCode,
            'index': 5,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeCode,
            'index': 6,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 7,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 8,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 9,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeInteger,
            'index': 10,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeText,
            'index': 11,
            'align': 'center'
        },
        {
            'type': MntConst.eTypeImage,
            'index': 12,
            'align': 'center'
        }
    ];

    // Account Search - Ellipsis
    public accountSearchComponent = AccountSearchComponent;
    public inputParamsAccountSearch: any = {
        'parentMode': 'LookUp-NatAx',
        'showAddNewDisplay': false,
        'showBusinessCode': false,
        'showCountryCode': false
    };

    // Contract Search
    public contractSearchComponent = ContractSearchComponent;
    public inputParamsContractSearch: any;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAMULTIPREMISESPECIAL;
        this.pageTitle = 'Multi Premises Amendment';
        this.browserTitle = 'Multi Premises Amend';
    };

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
    };

    ngAfterViewInit(): void {
        this.inputParamsContractSearch = {
            'parentMode': 'LookUp',
            'showBranch': false,
            'accountNumber': this.getControlValue('AccountNumber'),
            'accountName': this.getControlValue('AccountName')
        };
        this.autoOpen = true;
        if (this.isReturning()) {
            this.autoOpen = false;
            this.populateUIFromFormData();
            if (this.getControlValue('AccountNumber')) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', false);
                this.mandatoryContactNumber = false;
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
                this.mandatoryContactNumber = true;
            }
            this.buildGrid();
            return;
        }
    };

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.ajaxSubscription) {
            this.ajaxSubscription.unsubscribe();
        }
    };

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };

    private window_onload(): void {
        this.setControlValue('IncreaseValueFrom', 0.00);
        this.setControlValue('EffectiveDate', this.utils.formatDate(this.effectiveDate));
        this.setControlValue('UpdateType', 'UpdateSpecialInstructions');

        this.sortIndex = [{
            'fieldName': 'ContractNumber',
            'index': 0,
            'sortType': 'ASC'
        }, {
            'fieldName': 'PremiseNumber',
            'index': 1,
            'sortType': 'ASC'
        }, {
            'fieldName': 'PremisePostcode',
            'index': 4,
            'sortType': 'ASC'
        }, {
            'fieldName': 'ServiceBranch',
            'index': 9,
            'sortType': 'ASC'
        }, {
            'fieldName': 'AnnualValue',
            'index': 11,
            'sortType': 'ASC'
        }];
    };

    public sortGrid(data: any): void {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.sortIndex = data.sortIndex;
        this.buildGrid();
    };

    public effectiveDateSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('EffectiveDate', value.value);
            this.effectiveDatePicker.validateDateField();
        }
    };

    // Callback for Account Ellipsis
    public setAccount(data: any): void {
        if (data.AccountNumber) {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', false);
            this.mandatoryContactNumber = false;
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
            this.mandatoryContactNumber = true;
        }
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('AccountName', data.AccountName);
        this.inputParamsContractSearch = {
            'parentMode': 'LookUp',
            'showBranch': false,
            'accountNumber': this.getControlValue('AccountNumber'),
            'accountName': this.getControlValue('AccountName')
        };
    };

    // Callback for Contract Ellipsis
    public setContract(data: any): void {
        this.setControlValue('AccountNumber', data.AccountNumber);
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.setControlValue('ContractName', data.ContractName);
        this.taboutAccountContract(data);
    };

    // Account Search - Tabout
    public taboutAccountContract(data: any): void {
        if (data.target)
            if (this.getControlValue('AccountNumber')) {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', false);
                this.mandatoryContactNumber = false;
            } else {
                this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
                this.mandatoryContactNumber = true;
            }
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            AccountNumber: this.getControlValue('AccountNumber'),
            ContractNumber: this.getControlValue('ContractNumber'),
            BusinessCode: this.businessCode(),
            Function: 'GetDescriptions'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.showErrorModal(data);
                else {
                    this.setControlValue('AccountNumber', data.AccountNumber);
                    this.setControlValue('AccountName', data.AccountName);
                    this.setControlValue('ContractNumber', data.ContractNumber);
                    this.setControlValue('ContractName', data.ContractName);
                    this.inputParamsContractSearch = {
                        'parentMode': 'LookUp',
                        'showBranch': false,
                        'accountNumber': this.getControlValue('AccountNumber'),
                        'accountName': this.getControlValue('AccountName')
                    };
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    public productSearchComponent = ProductSearchGridComponent;
    public inputParamsProductSearch: any = {
        'parentMode': 'LookUp'
    };

    // Callback for Product Ellipsis
    public setProduct(data: any): void {
        this.setControlValue('ProductCode', data.ProductCode);
        this.setControlValue('ProductDesc', data.ProductDesc);
    };

    // Product Search - Tabout
    public productTabout(data: any): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            ProductCode: this.getControlValue('ProductCode'),
            BusinessCode: this.businessCode(),
            Function: 'GetProductDescription'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.showErrorModal(data);
                else
                    this.setControlValue('ProductDesc', data.ProductDesc);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    // Business Origin Lang Search - Not yet developed
    public inputParamsBusinessOriginLangSearch: any = {
        'parentMode': 'LookUpA'
    };

    // Callback for Business Origin Lang Ellipsis - Not yet developed
    public setBusinessOrigin(data: any): void {
        this.setControlValue('BusinessOrigin', data['BusinessOriginLang.BusinessOriginCode']);
        this.setControlValue('BusinessOriginDescription', data['BusinessOriginLang.BusinessOriginDesc']);
    };

    // Business Origin Lang Search - Tabout
    public businessOriginLangTabout(data: any): void {
        this.setControlValue('BusinessOrigin', this.getControlValue('BusinessOrigin').toUpperCase());
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessOrigin: this.getControlValue('BusinessOrigin'),
            BusinessCode: this.businessCode(),
            Function: 'GetOriginDescription'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.showErrorModal(data);
                else
                    this.setControlValue('BusinessOriginDescription', data.BusinessOriginDescription);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    public buildGrid(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            let gridURLParams: URLSearchParams,
                gridInputParams;
            gridURLParams = this.getURLSearchParamObject();
            gridURLParams.set('BranchNumber', this.utils.getBranchCode());
            gridURLParams.set(this.serviceConstants.AccountNumber, this.getControlValue(this.serviceConstants.AccountNumber));
            gridURLParams.set(this.serviceConstants.ContractNumber, this.getControlValue(this.serviceConstants.ContractNumber));
            gridURLParams.set('ProductCode', this.getControlValue('ProductCode'));
            gridURLParams.set('IncreaseValueFrom', this.getControlValue('IncreaseValueFrom'));
            gridURLParams.set('SpecialInstructions', this.getControlValue('SpecialInstructions'));
            gridURLParams.set('IncreaseValueBy', this.getControlValue('IncreaseValueBy'));
            gridURLParams.set('BusinessOriginCode', this.getControlValue('BusinessOrigin'));
            gridURLParams.set('UpdateType', this.getControlValue('UpdateType'));
            gridURLParams.set('EffectiveDate', this.getControlValue('EffectiveDate'));
            gridURLParams.set('riCacheRefresh', 'True');
            gridURLParams.set('HeaderClickedColumn', this.headerClicked);
            gridURLParams.set(this.serviceConstants.GridMode, this.gridParams.riGridMode);
            gridURLParams.set(this.serviceConstants.GridHandle, this.gridParams.riGridHandle);
            gridURLParams.set(this.serviceConstants.GridSortOrder, this.sortType);
            gridURLParams.set(this.serviceConstants.PageSize, this.gridParams.itemsPerPage);
            gridURLParams.set(this.serviceConstants.PageCurrent, this.gridParams.currentPage);
            gridURLParams.set(this.serviceConstants.Action, '2');

            gridInputParams = this.muleConfig;
            gridInputParams['search'] = gridURLParams;
            this.multiPremisesGrid.update = true;

            this.multiPremisesGrid.loadGridData(gridInputParams);
        }
    };

    public getCurrentPage(curPage: any): void {
        this.gridParams.currentPage = curPage ? curPage.value : this.gridParams.currentPage;
        this.buildGrid();
    };

    public getGridInfo(info: any): void {
        if (info)
            this.gridParams.totalRecords = info.totalRows;
    };

    public onRowSelect(data: any): void {
        let params = {
            ServiceCoverRowID: data.trRowData[12].rowID,
            ContractRowID: data.trRowData[0].rowID,
            ContractNumber: this.getControlValue('ContractNumber') || data.trRowData[0].text,
            ContractName: this.getControlValue('ContractName'),
            PremiseNumber: data.trRowData[1].text,
            PremiseName: data.trRowData[2].text,
            CurrentContractType: data.trRowData[0].additionalData,
            contractTypeCode: data.trRowData[0].additionalData
        };
        switch (data.cellIndex) {
            case 0:
                this.navigate('FlatRateIncrease', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, params);
                break;
            case 1:
                this.navigate('GridSearch', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, params);
                break;
            case 5:
                this.navigate('Search', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, params);
                break;
        };
    };

    public onCellClick(data: any): void {
        switch (data.cellIndex) {
            case 12:
                this.rowData = data;
                this.futureAmendmentCheck();
                break;
        };
    };

    private futureAmendmentCheck(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ServiceCoverRowID: this.rowData.cellData.rowID,
            EffectiveDate: this.getControlValue('EffectiveDate'),
            Function: 'FutureAmendmentCheck'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.showErrorModal(data);
                else {
                    if (data.ErrorMessage && data.FutureAmendment === 'yes') {
                        this.promptContentForApplyChanges = data.ErrorMessage;
                        this.promptModalApplyChanges.show();
                    } else
                        this.applySpecialInstructions();
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    public applySpecialInstructions(): void {
        this.queryPost.set(this.serviceConstants.Action, '6');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ServiceCoverRowID: this.rowData.cellData.rowID,
            IncreaseValueFrom: this.getControlValue('IncreaseValueFrom'),
            SpecialInstructions: this.getControlValue('SpecialInstructions'),
            EffectiveDate: this.getControlValue('EffectiveDate'),
            IncreaseValueBy: this.getControlValue('IncreaseValueBy'),
            UpdateType: this.getControlValue('UpdateType'),
            BusinessOrigin: this.getControlValue('BusinessOrigin'),
            Function: 'ApplySpecialInstructions'
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError)
                    this.showErrorModal(data);
                else
                    this.buildGrid();
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };
}
