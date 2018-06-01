import { InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { ICABSBAPICodeSearchComponent } from '../../internal/search/iCABSBAPICodeSearchComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { AjaxConstant } from './../../../shared/constants/AjaxConstants';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { AccountSearchComponent } from '../../internal/search/iCABSASAccountSearch';
import { APICodeSearchComponent } from '../../internal/search/iCABSBAPICodeSearch';
import { PremiseSearchComponent } from '../../internal/search/iCABSAPremiseSearch';
import { Subscription } from 'rxjs/Subscription';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { EllipsisComponent } from '../../../shared/components/ellipsis/ellipsis';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAServiceCoverAPIGrid.html'
})

export class ServiceCoverAPIGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('serviceCoverAPIGrid') serviceCoverAPIGrid: GridComponent;
    @ViewChild('serviceCoverAPIPagination') serviceCoverAPIPagination: PaginationComponent;
    @ViewChild('apiCodeDropDown') apiCodeDropDown: APICodeSearchComponent;
    @ViewChild('promptConfirmModalAll') public promptConfirmModalAll;
    @ViewChild('promptConfirmModalClear') public promptConfirmModalClear;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('contractSearchEllipsis') public contractSearchEllipsis: EllipsisComponent;
    @ViewChild('premiseSearchEllipsis') public premiseSearchEllipsis: EllipsisComponent;
    @ViewChild('productCodeSearchEllipsis') public productCodeSearchEllipsis: EllipsisComponent;
    @ViewChild('errorModal') public errorModal;
    public pageId: string = '';
    public headerClickedColumn: string = '';
    public riSortOrder: string = '';
    public gridSortHeaders: Array<any> = [];
    public headerProperties: Array<any> = [];
    public validateProperties: Array<any> = [];
    public itemsPerPage: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 15;
    public showHeader: boolean = true;
    public promptConfirmTitle: string = '';
    public promptConfirmContent: any;
    public search = new URLSearchParams();
    public isDisabledAssignAll = false;
    public isDisabledClearAll = false;
    public serviceCoverSearchComponent = ServiceCoverSearchComponent;
    private currentContractTypeURLParameter: Object = { currentContractTypeURLParameter: 'contract', Mode: 'Release' };
    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverAPIGrid',
        module: 'api',
        method: 'contract-management/maintenance'
    };
    private searchParams: any;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public contractSearchParams: any = {
        'parentMode': 'LookUp',
        'currentContractType': 'C',
        'currentContractTypeURLParameter': '<contract>',
        'showAddNew': false,
        'AccountNumber': ''
    };
    public inputParamsServiceCover: any = {
        'parentMode': 'LookUp-Freq'
    };
    public searchModalRoute: string = '';
    public searchPageRoute: string = '';
    public showCloseButton: boolean = true;
    public contractSearchComponent = ContractSearchComponent;
    public isAccountEllipsisDisabled: boolean = false;
    public accountSearchComponent = AccountSearchComponent;
    public inputParamsAccount: any = {
        'parentMode': 'LookUp',
        'showAddNewDisplay': false,
        'countryCode': '',
        'businessCode': '',
        'showCountryCode': true,
        'showBusinessCode': true
    };
    public inputParams: any = {
        'parentMode': '',
        'businessCode': '',
        'countryCode': ''
    };
    public accountPremise = PremiseSearchComponent;
    public inputParamsAccountPremise: any = {
        'parentMode': 'LookUp',
        'pageTitle': 'Premise Search'
    };
    private userDataSubscription: Subscription;
    public apiSearchComponent = ICABSBAPICodeSearchComponent;
    public controls = [
        { name: 'AccountNumber', readonly: true, disabled: false, required: false },
        { name: 'AccountName', readonly: true, disabled: false, required: false },
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: true, disabled: false, required: false },
        { name: 'ProductDesc', readonly: true, disabled: false, required: false },
        { name: 'APICode', readonly: true, disabled: false, required: false },
        { name: 'ServiceCoverRowID', readonly: true, disabled: false, required: false }
    ];
    constructor(injector: Injector,
        private _router: Router, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERAPIGRID;
    }

    /**
     * Account data received from ellipsis
     */
    public onAccountDataReceived(data: any): void {
        this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
        this.uiForm.controls['AccountName'].setValue(data.AccountName);
        this.contractSearchParams.accountNumber = this.uiForm.controls['AccountNumber'].value;
        this.contractSearchParams.accountName = this.uiForm.controls['AccountName'].value;
        this.contractSearchEllipsis.updateComponent();
        this.cbbService.disableComponent(true);
    }
    /**
     * Contract data received from ellipsis
     */
    public onContractDataReceived(data: any): void {
        this.uiForm.controls['ContractNumber'].setValue(data.ContractNumber);
        this.uiForm.controls['ContractName'].setValue(data.ContractName);
        this.populateDescriptions('c');
        this.inputParamsAccountPremise.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        this.inputParamsAccountPremise.ContractName = this.uiForm.controls['ContractName'].value;
        this.premiseSearchEllipsis.updateComponent();
        this.inputParamsServiceCover.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        this.productCodeSearchEllipsis.updateComponent();
    }
    /**
     * Page load initialization data
     */
    private initData(): void {
        this.pageTitle = 'Service Cover API Code Update';
        this.pageParams.CurrentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.CurrentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        let branchCode = this.utils.getLoggedInBranch();
        this.uiForm.controls['AccountName'].disable();
        this.uiForm.controls['ContractName'].disable();
        this.uiForm.controls['PremiseName'].disable();
        this.uiForm.controls['ProductDesc'].disable();
        this.el.nativeElement.querySelector('#ContractNumber').focus();
        this.pageParams.blnGridHasData = false;
        this.pageParams.blnForceRefresh = false;
        this.activateButtons();
    }

    /**
     * Generate grid method
     */
    private buildGrid(): void {
        this.serviceCoverAPIGrid.clearGridData();
        this.beforeExecute();
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('ServiceCoverRowID', this.uiForm.controls['ServiceCoverRowID'].value);
        this.search.set('ForceRefresh', this.pageParams.strForceRefresh);
        this.search.set('riCacheRefresh', 'True');
        this.search.set(this.serviceConstants.GridMode, '0');
        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, this.itemsPerPage.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.headerClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riSortOrder);
        this.queryParams.search = this.search;
        this.serviceCoverAPIGrid.loadGridData(this.queryParams);
    }

    public sortGrid(data: any): void {
        this.headerClickedColumn = data.fieldname;
        this.riSortOrder = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.buildGrid();
    }

    private beforeExecute(): void {
        if (this.pageParams.blnForceRefresh) {
            this.pageParams.strForceRefresh = 'yes';
        } else {
            this.pageParams.strForceRefresh = 'no';
        }
    }

    private activateButtons(): void {
        if (this.uiForm.controls['APICode'].value !== '' && this.pageParams.blnGridHasData === true) {
            this.isDisabledAssignAll = false;
        } else {
            this.isDisabledAssignAll = true;
        }
        if (this.pageParams.blnGridHasData === true) {
            this.isDisabledClearAll = false;
        } else {
            this.isDisabledClearAll = true;
        }
    }

    private afterExecute(): void {
        this.pageParams.blnForceRefresh = false;
        this.activateButtons();
    }

    private clearTable(): void {
        this.pageParams.blnGridHasData = false;
    }

    private setRefreshRequired(): void {
        this.clearTable();
        this.uiForm.controls['APICode'].setValue('');
        this.uiForm.controls['APICodeDesc'].setValue('');
        this.activateButtons();
    }

    public onGridRowClick(event: any): void {
        if (event.trRowData) {
            this.attributes['ContractNumberContractRowID'] = event.trRowData[0].rowID;
            this.attributes['ContractNumberPremiseRowID'] = event.trRowData[1].rowID;
            this.attributes['ContractNumberServiceCoverRowID'] = event.trRowData[2].rowID;
            this.attributes['grdServiceCoverServiceCoverRowID'] = event.trRowData[2].rowID;
        }
        if (event.rowIndex) {
            this.attributes['grdServiceCoverRow'] = event.rowIndex;
            this.attributes['ContractNumberRow'] = event.rowIndex;
        }
    }


    public onGridRowDblClick(event: any): void {
        this.onGridRowClick(event);
        let cellInfo = 0;
        try {
            cellInfo = event.cellIndex;
        } catch (e) {
            this.logger.warn(e);
        }
        switch (cellInfo) {
            case 0:
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE], {
                    queryParams: {
                        parentMode: 'Release',
                        ContractNumber: this.uiForm.controls['ContractNumber'].value,
                        ContractName: this.uiForm.controls['ContractName'].value
                    }
                });
                break;
            case 2:
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE],
                    {
                        queryParams: {
                            'parentMode': 'Release',
                            'ServiceCoverRowID': this.attributes['ContractNumberServiceCoverRowID']
                        }
                    });
                break;
            case 1:
                this.router.navigate([this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE],
                    {
                        queryParams: {
                            'parentMode': 'Release',
                            'PremiseRowID': this.attributes['ContractNumberPremiseRowID'],
                            'ContractTypeCode': this.riExchange.getCurrentContractType()
                        }
                    });
                break;
            case 999:
                //need check
                //WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Service/iCABSSeServiceVisitMaintenance.htm" + CurrentContractTypeURLParameter
                // riExchange.Mode = "Release": window.location = WindowPath
                break;
            case 999:
                //Need to check
                //WindowPath="/wsscripts/riHTMLWrapper.p?riFileName=Application/iCABSAServiceCoverCommenceDateMaintenance.htm" + CurrentContractTypeURLParameter
                //riExchange.Mode = "Release": window.location = WindowPath
                break;
            case 999:
                //Need to check
                this.router.navigate([InternalMaintenanceSalesModuleRoutes.ICABSACONTRACTCOMMENCEDATEMAINTENANCE], { queryParams: this.currentContractTypeURLParameter });
                break;
            case 999:
                //Need to check
                this.router.navigate(['contractmanagement/branch/serviceCover/maintenance'], { queryParams: this.currentContractTypeURLParameter });
                break;
            case 13:
                if (this.uiForm.controls['APICode'].value === '') {
                    this.apiCodeDropDown.apicodesearchDropDown.isError = true;
                } else {
                    this.apiCodeDropDown.apicodesearchDropDown.isError = false;
                    this.search = new URLSearchParams();
                    this.search.set(this.serviceConstants.Action, '0');
                    this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
                    this.search.set('APICode', this.uiForm.controls['APICode'].value);
                    this.search.set('ServiceCoverRowID', this.attributes['ContractNumberServiceCoverRowID']);
                    this.search.set('Function', 'SetAPICode');
                    this.search.set(this.serviceConstants.CountryCode, this.countryCode());
                    this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
                        (data) => {
                            try {
                                if (data['errorMessage']) {
                                    this.errorModal.show(data, true);
                                } else {
                                    this.serviceCoverAPIGrid.update = true;
                                    this.currentPage = 1;
                                    this.buildGrid();
                                }

                            } catch (error) {
                                this.logger.warn(error);
                            }
                        },
                        (error) => {
                            this.errorService.emitError(error);
                        }
                    );
                }

                break;
            case 14:
                this.search = new URLSearchParams();
                this.search.set(this.serviceConstants.Action, '0');
                this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
                this.search.set('ServiceCoverRowID', this.attributes['ContractNumberServiceCoverRowID']);
                this.search.set('Function', 'ClearAPICode');
                this.search.set(this.serviceConstants.CountryCode, this.countryCode());
                this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
                    (data) => {
                        try {
                            if (data['errorMessage']) {
                                this.errorModal.show(data, true);
                            } else {
                                this.serviceCoverAPIGrid.update = true;
                                this.currentPage = 1;
                                this.buildGrid();
                            }

                        } catch (error) {
                            this.logger.warn(error);
                        }
                    },
                    (error) => {
                        this.errorService.emitError(error);
                    }
                );

                break;
            default:
                break;
        }
    }

    public getGridInfo(info: any): void {
        this.pageParams.blnGridHasData = false;
        this.serviceCoverAPIPagination.totalItems = info.totalRows;
        if (info.totalRows > 0) {
            this.pageParams.blnGridHasData = true;
            this.afterExecute();
        }
    }
    /**
     * Account Number change method
     */
    public accountNumberOnchange(obj: any): void {
        if (this.uiForm.controls['AccountNumber'].value) {
            this.uiForm.controls['AccountNumber'].setValue(this.utils.numberPadding(obj.value, 9));
            this.populateDescriptions('a');
        } else {
            this.uiForm.controls['AccountName'].setValue('');
        }
        this.contractSearchParams.accountNumber = this.uiForm.controls['AccountNumber'].value;
        this.contractSearchParams.accountName = this.uiForm.controls['AccountName'].value;
        this.contractSearchEllipsis.updateComponent();
    }

    /**
     * Contract number onchange method
     */
    public contractNumberOnchange(obj: any): void {
        if (this.uiForm.controls['ContractNumber'].value) {
            this.uiForm.controls['ContractNumber'].setValue(this.utils.numberPadding(obj.value, 8));
            this.populateDescriptions('c');
        } else {
            this.uiForm.controls['ContractName'].setValue('');
        }
        this.inputParamsAccountPremise.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        this.inputParamsAccountPremise.ContractName = this.uiForm.controls['ContractName'].value;
        this.premiseSearchEllipsis.updateComponent();
        this.inputParamsServiceCover.ContractNumber = this.uiForm.controls['ContractNumber'].value;
        this.productCodeSearchEllipsis.updateComponent();
    }

    public premiseNumberOnchange(obj: any): void {
        this.populateDescriptions('');
        this.inputParamsServiceCover.PremiseNumber = this.uiForm.controls['PremiseNumber'].value;
        this.productCodeSearchEllipsis.updateComponent();
    }

    public productCodeOnchange(obj: any): void {
        this.populateDescriptions('');
        this.inputParamsServiceCover.ProductCode = this.uiForm.controls['ProductCode'].value;
        this.productCodeSearchEllipsis.updateComponent();
    }


    /**
     * Populate description from code service call
     */
    public populateDescriptions(frmCode: string): void {
        let blnAccountNumber = false, blnContractNumber = false, blnPremiseNumber = false,
            blnProductCode = false, blnAPICode = false;
        if (this.uiForm.controls['AccountNumber'].value) {
            blnAccountNumber = true;
        } else {
            this.uiForm.controls['AccountNumber'].setValue('');
        }
        if (this.uiForm.controls['ContractNumber'].value) {
            blnContractNumber = true;
            blnAccountNumber = true;
        } else {
            this.uiForm.controls['ContractName'].setValue('');
            this.uiForm.controls['PremiseNumber'].setValue('');
        }
        if (this.uiForm.controls['PremiseNumber'].value) {
            blnContractNumber = true;
            blnPremiseNumber = true;
        } else {
            this.uiForm.controls['PremiseName'].setValue('');
        }
        if (this.uiForm.controls['ProductCode'].value) {
            blnProductCode = true;
        } else {
            this.uiForm.controls['ProductDesc'].setValue('');
        }
        if (blnAccountNumber || blnContractNumber || blnPremiseNumber || blnProductCode) {
            this.search = new URLSearchParams();
            this.search.set(this.serviceConstants.Action, '0');
            this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
            if (blnContractNumber)
                this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
            if (blnPremiseNumber)
                this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
            if (blnAccountNumber)
                this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
            if (blnProductCode)
                this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
            this.search.set('Function', 'GetDescriptions');
            this.search.set(this.serviceConstants.CountryCode, this.countryCode());
            this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
                (data) => {
                    try {
                        if (data['errorMessage']) {
                            this.errorModal.show(data, true);
                            if (frmCode === 'a' || frmCode === 'c')
                                this.cbbService.disableComponent(false);
                        } else {
                            if (data.ContractName)
                                this.uiForm.controls['ContractName'].setValue(data.ContractName);
                            if (data.AccountName)
                                this.uiForm.controls['AccountName'].setValue(data.AccountName);
                            if (data.PremiseName)
                                this.uiForm.controls['PremiseName'].setValue(data.PremiseName);
                            if (data.ProductDesc)
                                this.uiForm.controls['ProductDesc'].setValue(data.ProductDesc);
                            if (data.AccountNumber)
                                this.uiForm.controls['AccountNumber'].setValue(data.AccountNumber);
                            if (frmCode === 'a' || frmCode === 'c')
                                this.cbbService.disableComponent(true);
                        }
                    } catch (error) {
                        this.logger.warn(error);
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                }
            );
        } else {
            return;
        }
    }
    /**
     * Assign  all button click
     */
    public assignAllOnclick(): void {
        this.promptConfirmContent = MessageConstant.Message.assignAllApicodeConfirm;
        this.promptConfirmModalAll.show();
    }

    /**
     * Clear  all button click
     */
    public clearAllOnclick(): void {
        this.promptConfirmContent = MessageConstant.Message.assignClearAllApicodeConfirm;
        this.promptConfirmModalClear.show();
    }

    /**
     * Asign all service call
     *
     */
    public promptConfirmAll(): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('APICode', this.uiForm.controls['APICode'].value);
        this.search.set('Function', 'AssignAll');
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
            (data) => {
                try {
                    if (data['errorMessage']) {
                        this.errorModal.show(data, true);
                    } else {
                        this.pageParams.blnForceRefresh = true;
                        this.currentPage = 1;
                        this.buildGrid();
                    }
                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }

    /**
     * Clear all service call
     *
     */
    public promptConfirmClear(): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode());
        this.search.set('AccountNumber', this.uiForm.controls['AccountNumber'].value);
        this.search.set('ContractNumber', this.uiForm.controls['ContractNumber'].value);
        this.search.set('PremiseNumber', this.uiForm.controls['PremiseNumber'].value);
        this.search.set('ProductCode', this.uiForm.controls['ProductCode'].value);
        this.search.set('Function', 'ClearAll');
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());
        this.ajaxSubscription = this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search).subscribe(
            (data) => {
                try {
                    if (data['errorMessage']) {
                        this.messageModal.show({ msg: data['errorMessage'], title: this.pageTitle }, false);
                    } else {
                        this.pageParams.blnForceRefresh = true;
                        this.currentPage = 1;
                        this.buildGrid();
                    }
                } catch (error) {
                    this.logger.warn(error);
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
        );

    }

    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.buildGrid();
    }

    public refresh(): void {
        this.currentPage = 1;
        this.buildGrid();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
    public ngAfterViewInit(): void {
        this.initData();
        let sortArray: any = [{
            'fieldName': 'ContractNumber',
            'index': 0,
            'sortType': 'ASC'
        }, {
            'fieldName': 'PremiseNumber',
            'index': 1,
            'sortType': 'ASC'
        }, {
            'fieldName': 'ProductCode',
            'index': 2,
            'sortType': 'ASC'
        }, {
            'fieldName': 'APICode',
            'index': 3,
            'sortType': 'ASC'
        }, {
            'fieldName': 'NextAPIDate',
            'index': 4,
            'sortType': 'ASC'
        }, {
            'fieldName': 'ManuallyExempt',
            'index': 5,
            'sortType': 'ASC'
        }, {
            'fieldName': 'NationalAccount',
            'index': 6,
            'sortType': 'ASC'
        }, {
            'fieldName': 'PendingTerm',
            'index': 7,
            'sortType': 'ASC'
        }, {
            'fieldName': 'ValueChange',
            'index': 8,
            'sortType': 'ASC'
        }, {
            'fieldName': 'Overthreshold',
            'index': 9,
            'sortType': 'ASC'
        }, {
            'fieldName': 'FixedPeriod',
            'index': 10,
            'sortType': 'ASC'
        }, {
            'fieldName': 'Clear',
            'index': 14,
            'sortType': 'ASC'
        }];
        for (let orderObj of sortArray) {
            this.gridSortHeaders.push(orderObj);
        }
        this.validateProperties = [
            {
                'type': MntConst.eTypeCode,
                'index': 0,
                'align': 'center',
                'readonly': true
            }, {
                'type': MntConst.eTypeInteger,
                'index': 1,
                'align': 'center',
                'readonly': true
            }, {
                'type': MntConst.eTypeCode,
                'index': 2,
                'align': 'center',
                'readonly': true
            }, {
                'type': MntConst.eTypeCode,
                'index': 3,
                'align': 'center',
                'readonly': true
            }, {
                'type': MntConst.eTypeDate,
                'index': 4,
                'align': 'center',
                'readonly': true
            }, {
                'type': MntConst.eTypeImage,
                'index': 5,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeImage,
                'index': 6,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeImage,
                'index': 7,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeImage,
                'index': 8,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeImage,
                'index': 9,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeImage,
                'index': 10,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeCurrency,
                'index': 11,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeCurrency,
                'index': 12,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeImage,
                'index': 13,
                'align': 'center',
                'readonly': true
            },
            {
                'type': MntConst.eTypeImage,
                'index': 14,
                'align': 'center',
                'readonly': true
            }
        ];
        this.utils.setTitle(this.pageTitle);
        this.setErrorCallback(this);
    }
    /**
     * API Code data received from dropdown
     */
    public onAPICodeSearchReceived(data: any): void {
        if (data.APICode === 'All') {
            this.uiForm.controls['APICode'].setValue('');
        } else {
            this.uiForm.controls['APICode'].setValue(data.APICode);
        }
        this.isDisabledAssignAll = true;
        this.activateButtons();
    }
    ngOnDestroy(): void {
        if (this.ajaxSubscription)
            this.ajaxSubscription.unsubscribe();
        if (this.userDataSubscription)
            this.userDataSubscription.unsubscribe();
        super.ngOnDestroy();
    }

    public onPremiseSearchDataReceived(eventObj: any, flag: any): void {
        this.uiForm.controls['PremiseNumber'].setValue(eventObj.PremiseNumber);
        this.uiForm.controls['PremiseName'].setValue(eventObj.PremiseName);
        this.inputParamsServiceCover.PremiseNumber = this.uiForm.controls['PremiseNumber'].value;
        this.productCodeSearchEllipsis.updateComponent();
    }

    public serviceCoverSearchDataReceived(data: any): void {
        this.uiForm.controls['ProductCode'].setValue(data.row.ProductCode);
        this.uiForm.controls['ProductDesc'].setValue(data.row.ProductDesc);
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

}
