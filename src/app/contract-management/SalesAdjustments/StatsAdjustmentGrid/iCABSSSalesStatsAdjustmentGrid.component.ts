import { Event } from '@angular/router';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { EllipsisComponent } from '../../../../shared/components/ellipsis/ellipsis';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { ProductSearchGridComponent } from './../../../internal/search/iCABSBProductSearch';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../base/BaseComponent';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../../shared/components/grid/grid';
import { DropdownStaticComponent } from './../../../../shared/components/dropdown-static/dropdownstatic';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../../internal/search/iCABSAServiceCoverSearch';
@Component({
    templateUrl: 'iCABSSSalesStatsAdjustmentGrid.html'
})
export class SalesStatsAdjustmentGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('adjustmentGrid') adjustmentGrid: GridComponent;
    @ViewChild('adjustmentGridPagination') adjustmentGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('ContractNumber') formContractNumber;
    @ViewChild('ValueChangeReasonFrom') ValueChangeReasonFrom: DropdownStaticComponent;
    @ViewChild('ValueChangeReasonTo') ValueChangeReasonTo: DropdownStaticComponent;
    @ViewChild('ProductEllipsis') ProductEllipsis: EllipsisComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public totalRecords: number = 1;
    public MenuOptionListValueChangeReasonFrom: any = [];
    public MenuOptionListValueChangeReasonTo: any = [];
    public queryParams: any = {
        operation: 'Sales/iCABSSSalesStatsAdjustmentGrid',
        module: 'contract-admin',
        method: 'contract-management/maintenance'
    };
    public contractSearchModal: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    public pageCurrent: number = 1;
    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'ValueChangeReasonFrom', readonly: false, disabled: false, required: false },
        { name: 'ValueChangeReasonTo', readonly: false, disabled: false, required: false }
    ];
    public rowId = '';
    public leftnewstr: string = '';
    public middleMidNewStr: string = '';
    public rightMidNewStr: string = '';
    public pageId: string = '';
    public sortType: string;
    public ValueChangeReasonsArray: any = [];
    public valueChangeReasons: any;
    public vSCEnableExtraOptions: any;
    public showCloseButton: boolean = true;
    public showHeader: boolean = true;
    public showErrorHeader: boolean = true;
    public ProductSearchComponentEllipsis: any;
    public ContractSearchComponent = ContractSearchComponent;
    public PremiseSearchComponent = PremiseSearchComponent; //TODO as search not working
    public ServiceCoverSearchComponent = ServiceCoverSearchComponent;
    public ProductSearchGridComponent = ProductSearchGridComponent; // TODO will be ProductSearchComponent component
    // Grid Component Variables
    public search: any = this.getURLSearchParamObject();
    public searchGet: any;
    public pageSize: number = 30;
    public itemsPerPage: number = 30;
    public currentPage: number = 1;
    public totalItems: number = 10;
    public maxColumn: number = 11;
    public gridSortHeaders: Array<any>;
    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSALESSTATSADJUSTMENTGRID;
    }
    public ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }
    public ngAfterViewInit(): void {
        this.contractSearchModal = true;
        if (this.formData['ContractNumber']) {
            this.contractSearchModal = false;
        }
        document.querySelector('.screen-body .col24 select')['focus']();
    }
    public windowOnload(): void {
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.PageSize = 10;
        if (this.formData['ContractNumber']) {
            if (this.formData['ContractNumber'] !== '') {
                this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractNumber'] = this.formData['ContractNumber'];
                this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractName'] = this.formData['ContractName'];
            }
            if (this.formData['ContractNumber'] !== '' && this.formData['PremiseNumber'] !== '') {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
                this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;

                this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractNumber'] = this.formData['ContractNumber'];
                this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractName'] = this.formData['ContractName'];
                this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseNumber'] = this.formData['PremiseNumber'];
                this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseName'] = this.formData['PremiseName'];

                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
                this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
            this.contractSearchModal = false;
            this.populateUIFromFormData();
            this.BuildGrid();
        }
        this.pageParams.CurrentContractType = this.riExchange.setCurrentContractType();
        this.attributes.CurrentContractType = this.riExchange.setCurrentContractType();
        this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
            this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
            this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
            this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent;
            this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
            this.ProductEllipsis.updateComponent();
        }
        this.buildFilterOptions();
        this.BuildGrid();
    }
    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableRenegSalesStatsAdjustmentExtraOptions];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCEnableExtraOptions = record[0]['Required'];
            this.populatedefaultOptions();
        });
    }
    public populatedefaultOptions(): any {
        if (this.pageParams.vSCEnableExtraOptions !== undefined) {
            this.ValueChangeReasonFrom.updateSelectedItem(0);
            if (this.pageParams.vSCEnableExtraOptions) {
                this.ValueChangeReasonTo.updateSelectedItem(4);
            }
            else {
                this.ValueChangeReasonTo.updateSelectedItem(1);
            }
        }
    }
    public showAlert(msgTxt: string, type?: number): void {
        let titleModal = '';
        if (typeof type === 'undefined') type = 0;
        switch (type) {
            default:
            case 0: titleModal = 'Error Message'; break;
            case 1: titleModal = 'Success Message'; break;
            case 2: titleModal = 'Warning Message'; break;
        }

        this.messageModal.show({ msg: msgTxt, title: titleModal }, false);
    }
    public buildFilterOptions(): void {
        let postParams: any = {};
        postParams.Function = 'GetValueChangeReasons';
        this.searchGet = this.getURLSearchParamObject();
        this.searchGet.set(this.serviceConstants.Action, '0');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, this.searchGet, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                    this.showAlert(MessageConstant.Message.noRecordFound);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.showAlert(MessageConstant.Message.noRecordFound);
                    } else if (e['errorMessage']) {
                        this.showAlert(MessageConstant.Message.noRecordFound);
                    } else {
                        this.pageParams.ValueChangeReasons = e.ValueChangeReasons;
                        if (((this.pageParams.ValueChangeReasons.length) !== null) && ((this.pageParams.ValueChangeReasons.length) > 0)) {
                            this.ValueChangeReasonsArray = this.pageParams.ValueChangeReasons.split(',');
                            let arrFrom = [];
                            let arrTo = [];
                            this.ValueChangeReasonsArray.forEach(cReason => {
                                this.leftnewstr = this.utils.Left(cReason, 3);
                                this.middleMidNewStr = this.utils.mid(cReason, 5, 1);
                                this.rightMidNewStr = this.utils.mid(cReason, 7);
                                arrFrom.push({ text: this.rightMidNewStr, value: this.leftnewstr });
                                arrTo.push({ text: this.rightMidNewStr, value: this.leftnewstr });
                            });
                            this.MenuOptionListValueChangeReasonFrom = arrFrom;
                            this.MenuOptionListValueChangeReasonTo = arrTo;
                            this.getSysCharDtetails();
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                this.showAlert(MessageConstant.Message.noRecordFound);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
    }
    public onValueChangeReasonFromChange(event: any): void {
        if (this.pageParams.vSCEnableExtraOptions !== undefined) {
            if (this.pageParams.vSCEnableExtraOptions) {
                if (this.ValueChangeReasonFrom.selectedItem === '101' || this.ValueChangeReasonFrom.selectedItem === '102'
                    || this.ValueChangeReasonFrom.selectedItem === '116' || this.ValueChangeReasonFrom.selectedItem === '126') {
                    this.ValueChangeReasonTo.updateSelectedItem(4);
                }
            }
            else {
                if (this.ValueChangeReasonFrom.selectedItem === '101') {
                    this.ValueChangeReasonTo.updateSelectedItem(1);
                }
                else {
                    this.ValueChangeReasonTo.updateSelectedItem(0);
                }
            }
        }
        //this.loadData();
    }
    public onValueChangeReasonToChange(event: any): void {
        if (this.pageParams.vSCEnableExtraOptions !== undefined) {
            if (this.pageParams.vSCEnableExtraOptions) {
                if (this.ValueChangeReasonTo.selectedItem === '101' || this.ValueChangeReasonTo.selectedItem === '102'
                    || this.ValueChangeReasonTo.selectedItem === '116' || this.ValueChangeReasonTo.selectedItem === '126') {
                    this.ValueChangeReasonFrom.updateSelectedItem(4);
                }
            }
            else {
                if (this.ValueChangeReasonTo.selectedItem === '101') {
                    this.ValueChangeReasonFrom.updateSelectedItem(1);
                }
                else {
                    this.ValueChangeReasonFrom.updateSelectedItem(0);
                }
            }
        }
        //this.loadData();
    }
    public ellipsis = {
        ContractSearchComponentEllipsis: {
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'currentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter
            },
            component: ContractSearchComponent
        },
        PremiseSearchComponentEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'currentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                'ContractNumber': '',
                'ContractName': '',
                'showAddNew': false
            },
            component: PremiseSearchComponent
        },
        ProductSearchComponentEllipsis: {
            disabled: false,
            showCloseButton: true,
            showHeader: true,
            childparams: {
                'parentMode': 'LookUp',
                'currentContractTypeURLParameter': this.pageParams.currentContractTypeURLParameter,
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': ''
            },
            component: null
        }
    };
    public getGridInfo(info: any): void {
        this.adjustmentGridPagination.totalItems = info.totalRows;
        this.totalRecords = info.totalRows;
    }
    public getCurrentPage(currentPage: any): void {
        this.currentPage = currentPage.value;
        this.search.set(this.serviceConstants.PageCurrent, String(this.currentPage));
        this.loadData();
    }
    public riGrid_Sort(event: any): void {
        this.loadData();
    }
    public BuildGrid(): void {
        this.riGrid.Clear();

        this.riGrid.AddColumn('ContractNum', 'ServiceValue', 'ContractNum', MntConst.eTypeCode, 11, true);
        this.riGrid.AddColumnAlign('ContractNum', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PremiseNum', 'ServiceValue', 'PremiseNum', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumnAlign('PremiseNum', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ProdCode', 'ServiceValue', 'ProdCode', MntConst.eTypeCode, 10, true);
        this.riGrid.AddColumnAlign('ProdCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('VisitFrequency', 'ServiceValue', 'VisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('VisitFrequency', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('PortfolioStatusDesc', 'ServiceValue', 'PortfolioStatusDesc', MntConst.eTypeText, 10);

        this.riGrid.AddColumn('ServiceValueEffectDate', 'ServiceValue', 'ServiceValueEffectDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceValueEffectDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('SalesStatsProcessedDate', 'ServiceValue', 'SalesStatsProcessedDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('SalesStatsProcessedDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceSalesEmployee', 'ServiceValue', 'ServiceSalesEmployee', MntConst.eTypeText, 20);

        this.riGrid.AddColumn('ValueChangeReasonDesc', 'ServiceValue', 'ValueChangeReasonDesc', MntConst.eTypeText, 20);

        this.riGrid.AddColumn('AnnualValueChange', 'ServiceValue', 'AnnualValueChange', MntConst.eTypeDecimal2, 10);

        this.riGrid.AddColumn('OldValue', 'ServiceValue', 'OldValue', MntConst.eTypeDecimal2, 10);
        this.riGrid.AddColumnUpdateSupport('OldValue', true);

        this.riGrid.AddColumnOrderable('ContractNum', true);
        this.riGrid.AddColumnOrderable('PremiseNum', true);
        this.riGrid.AddColumnOrderable('ProdCode', true);
        this.riGrid.AddColumnOrderable('ServiceSalesEmployee', true);

        this.riGrid.Complete();
        this.loadData();

    }
    private loadData(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === null || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === undefined) {
            if (this.contractSearchModal !== true)
                this.formContractNumber.nativeElement.focus();
            return;
        }
        else {
            let search: any = this.getURLSearchParamObject();
            this.search.set(this.serviceConstants.Action, '2');
            //set parameters
            this.search.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
            this.search.set('PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
            this.search.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
            this.search.set('ServiceCoverRowID', this.attributes.ProductCodeServiceCoverRowID);
            this.search.set('ValueChangeReasonFrom', this.ValueChangeReasonFrom.selectedItem);
            this.search.set('ValueChangeReasonTo', this.ValueChangeReasonTo.selectedItem);
            // set grid building parameters
            this.search.set(this.serviceConstants.PageSize, (this.itemsPerPage).toString());
            this.search.set(this.serviceConstants.PageCurrent, this.pageCurrent.toString());
            this.search.set(this.serviceConstants.GridMode, '0');
            this.search.set(this.serviceConstants.GridHandle, '3277310');
            let sortOrder = 'Descending';
            if (!this.riGrid.DescendingSort) {
                sortOrder = 'Ascending';
            }
            this.search.set('riSortOrder', sortOrder);
            this.search.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
            this.search.set('riCacheRefresh', 'True');
            this.queryParams.search = this.search;
            this.ajaxSource.next(this.ajaxconstant.START);
            this.isRequesting = true;
            this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, this.queryParams.search)
                .subscribe(
                (data) => {
                    if (data) {
                        try {
                            this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                            this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                            this.riGrid.UpdateBody = true;
                            this.riGrid.UpdateHeader = true;
                            this.riGrid.UpdateFooter = true;
                            if (data && data.errorMessage) {
                                this.messageModal.show(data, true);
                            } else {
                                this.riGrid.Execute(data);
                            }

                        } catch (e) {
                            this.logger.log('Problem in grid load', e);
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isRequesting = false;
                },
                error => {
                    this.totalRecords = 1;
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.isRequesting = false;
                });
        }
    }
    public onCellClickBlur(event: any): void {
        this.updateGrid(event);
    }
    public updateGrid(event: Event): void {
        let postSearch: any = this.getURLSearchParamObject();
        /*this.riGrid.UpdateHeader = false;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;*/
        postSearch.set(this.serviceConstants.Action, '2');
        postSearch.set(this.serviceConstants.GridMode, '3');
        postSearch.set(this.serviceConstants.GridHandle, '2033568');

        let postObject: any = {
            'ContractNumRowID': this.riGrid.Details.GetAttribute('ContractNum', 'rowid'),
            'ContractNum': this.riGrid.Details.GetValue('ContractNum'),
            'PremiseNumRowID': this.riGrid.Details.GetAttribute('PremiseNum', 'rowid'),
            'PremiseNum': this.riGrid.Details.GetValue('PremiseNum'),
            'ProdCodeRowID': this.riGrid.Details.GetAttribute('ProdCode', 'rowid'),
            'ProdCode': this.riGrid.Details.GetValue('ProdCode'),
            'VisitFrequency': this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitFrequency'),
            'PortfolioStatusDesc': this.riGrid.Details.GetValue('PortfolioStatusDesc'),
            'ServiceValueEffectDate': this.riGrid.Details.GetValue('ServiceValueEffectDate'),
            'SalesStatsProcessedDate': this.riGrid.Details.GetValue('SalesStatsProcessedDate'),
            'ServiceSalesEmployee': this.riGrid.Details.GetValue('ServiceSalesEmployee'),
            'ValueChangeReasonDesc': this.riGrid.Details.GetValue('ValueChangeReasonDesc'),
            'AnnualValueChange': this.riGrid.Details.GetValue('AnnualValueChange'),
            'OldValueRowID': this.riGrid.Details.GetAttribute('OldValue', 'rowid'),
            'OldValue': this.riGrid.Details.GetValue('OldValue'),
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
            'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
            'ServiceCoverRowID': this.attributes.ProductCodeServiceCoverRowID,
            'ValueChangeReasonFrom': this.ValueChangeReasonFrom.selectedItem,
            'ValueChangeReasonTo': this.ValueChangeReasonTo.selectedItem,
            'rowID': this.riGrid.Details.GetAttribute('ProdCode', 'rowid'),
            'riSortOrder': 'Ascending',
            'HeaderClickedColumn': ''
        };
        this.queryParams.method = this.queryParams.method;
        this.queryParams.operation = this.queryParams.operation;
        this.queryParams.module = this.queryParams.module;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, postSearch, postObject)
            .subscribe(
            (data) => {
                if (data) {
                    this.riGrid.Mode = MntConst.eModeNormal;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
                if (data['errorMessage']) {
                    this.messageModal.show({ msg: data['errorMessage'], title: this.pageTitle }, false);
                }
            },
            error => {
                this.totalRecords = 1;
                this.riGrid.Mode = MntConst.eModeNormal;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });

    }
    public onBlurPremise(event: any): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
            this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
            this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
            this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent; //ProductSearchGridComponent; //TODO
            this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
            this.ProductEllipsis.updateComponent();
        }
        this.populateDescriptions();
    }
    public onBlurProduct(event: any): void {
        this.attributes.ProductCodeServiceCoverRowID = '';
        this.populateDescriptions();
    }
    public onContractSearchDataReceived(data: any, ContractNumber: string, ContractName: string): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
            this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
                this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
                this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent; //ProductSearchGridComponent; //TODO
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
        }
        this.populateDescriptions();
    }
    public onPremiseSearchDataReceived(data: any, PremiseNumber: string, PremiseName: string): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
            this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
            this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName');
            this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
            this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseName'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName');
            if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
                this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
                this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
                this.ProductEllipsis.updateComponent();
            }
            else {
                this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
                this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent; //ProductSearchGridComponent; //TODO
                this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
                this.ProductEllipsis.updateComponent();
            }
        }
        this.populateDescriptions();
    }
    public onProductSearchDataReceived(data: any, ProductCode: string, ProductDesc: string): void {
        if (data) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
        }
        this.populateDescriptions();
    }
    public contractNumberFormatOnChange(num: any, size: any): string {
        let s = num + '';
        while (s.length < size) s = '0' + s;
        return s;
    }
    public onBlurContract(event: any): void {
        let elementValue = event.target.value;
        if (elementValue.length > 0 && elementValue.length < 8) {
            let paddedValue = this.contractNumberFormatOnChange(elementValue, 8);
            if (event.target.id === 'ContractNumber') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', paddedValue);
            }
        }
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '' && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '') {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp-Freq';
            this.ellipsis.ProductSearchComponentEllipsis.component = ServiceCoverSearchComponent;
            this.ProductEllipsis.contentComponent = ServiceCoverSearchComponent;
            this.ProductEllipsis.updateComponent();
        }
        else {
            this.ellipsis.ProductSearchComponentEllipsis.childparams['parentMode'] = 'LookUp';
            this.ellipsis.ProductSearchComponentEllipsis.component = this.ProductSearchGridComponent; //ProductSearchGridComponent; //TODO
            this.ProductEllipsis.contentComponent = this.ProductSearchGridComponent;
            this.ProductEllipsis.updateComponent();
        }
        this.populateDescriptions();
    }
    public onGridRowClick(event: Event): void {
        this.onClickCell(event);
        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNum':
                if (this.riGrid.Details.GetValue('ContractNum').charAt(0) === 'J') {
                    this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE, {
                        'parentMode': 'ServiceValueEntryGrid',
                        'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                        'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1]
                    });
                }
                if (this.riGrid.Details.GetValue('ContractNum').charAt(0) === 'C') {
                    this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                        'parentMode': 'ServiceValueEntryGrid',
                        'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                        'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1]
                    });
                }
                if (this.riGrid.Details.GetValue('ContractNum').charAt(0) === 'P') {
                    this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE, {
                        'parentMode': 'ServiceValueEntryGrid',
                        'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                        'ContractNumber': this.riGrid.Details.GetValue('ContractNum').split('/')[1]
                    });
                }
                break;
            case 'PremiseNum':
                this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    'parentMode': 'ServiceValueEntryGrid',
                    'CurrentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'PremiseNumber': this.riGrid.Details.GetValue('PremiseNum').text,
                    'PremiseRowID': this.riGrid.Details.GetAttribute('PremiseNum', 'rowid'),
                    'ContractTypeCode': this.riGrid.Details.GetValue('ContractNum').charAt(0)
                });
                break;
            case 'ProdCode':
                this.navigate('ServiceValueEntryGrid', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    'parentMode': 'ServiceValueEntryGrid',
                    'currentContractTypeURLParameter': this.pageParams.CurrentContractTypeURLParameter,
                    'ServiceCoverRowID': this.riGrid.Details.GetAttribute('ProdCode', 'rowid')
                });
                break;
        }
    }
    public onClickCell(event: Event): void {
        this.attributes.ContractRowID = this.riGrid.Details.GetAttribute('ContractNum', 'rowid');
        this.attributes.PremiseRowID = this.riGrid.Details.GetAttribute('PremiseNum', 'rowid');
        this.attributes.ContractServiceCoverRowID = this.riGrid.Details.GetAttribute('ProdCode', 'rowid');
        //this.attributes.Row = this.riGrid.RowID;
        this.attributes.ContractNumber = this.riGrid.Details.GetValue('ContractNum').split('/')[1];
        this.attributes.ContractName = this.riGrid.Details.GetAttribute('ContractNum', 'additionalproperty');
        this.attributes.PremiseNumber = this.riGrid.Details.GetValue('PremiseNum');
        this.attributes.PremiseName = this.riGrid.Details.GetAttribute('PremiseNum', 'additionalproperty');
        this.attributes.ProductCode = this.riGrid.Details.GetValue('ProdCode');
        this.attributes.ProductDesc = this.riGrid.Details.GetAttribute('ProdCode', 'additionalproperty');
        this.attributes.ServiceValueServiceCoverRowID = this.riGrid.Details.GetAttribute('ProdCode', 'rowid');
        //this.attributes.ServiceValueRow = this.riGrid.RowID;
        switch (this.riGrid.Details.GetAttribute('VisitFrequency', 'additionalproperty')) {
            case 'C':
                this.pageParams.CurrentContractTypeURLParameter = '';
                this.attributes.CurrentContractTypeURLParameter = '';
                break;
            case 'J':
                this.pageParams.CurrentContractTypeURLParameter = '<job>';
                this.attributes.CurrentContractTypeURLParameter = '<job>';
                break;
            case 'P':
                this.pageParams.CurrentContractTypeURLParameter = '<product>';
                this.attributes.CurrentContractTypeURLParameter = '<product>';
                break;
        }
        this.pageParams.CurrentContractType = this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.attributes.CurrentContractType = this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
    }
    public populateDescriptions(): void {
        let postParamsPopulate: any = {};
        let searchGetpopulate: any = this.getURLSearchParamObject();
        searchGetpopulate.set(this.serviceConstants.Action, '0');
        postParamsPopulate.Function = 'SetDisplayFields';
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== null && this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== undefined && this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') !== '')
            postParamsPopulate.ContractNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== null && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== undefined && this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber') !== '')
            postParamsPopulate.PremiseNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') !== null && this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') !== undefined && this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode') !== '')
            postParamsPopulate.ProductCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
        if (this.attributes.ProductCodeServiceCoverRowID !== null && this.attributes.ProductCodeServiceCoverRowID !== undefined && this.attributes.ProductCodeServiceCoverRowID !== '')
            postParamsPopulate.ServiceCoverRowID = this.attributes.ProductCodeServiceCoverRowID;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchGetpopulate, postParamsPopulate)
            .subscribe(
            (e) => {
                if (e['errorMessage']) {
                    this.showAlert(MessageConstant.Message.noRecordFound);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', e.ContractName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', e.PremiseName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', e.ProductDesc);
                    this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                    this.ellipsis.PremiseSearchComponentEllipsis.childparams['ContractName'] = e.ContractName;
                    this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber');
                    this.ellipsis.ProductSearchComponentEllipsis.childparams['ContractName'] = e.ContractName;
                    this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseNumber'] = this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber');
                    this.ellipsis.ProductSearchComponentEllipsis.childparams['PremiseName'] = e.PremiseName;
                    if (e.ServiceVisitFrequency === '0')
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
                    else
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', e.ServiceVisitFrequency);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            });
        this.loadData();
    }
    public refresh(): void {
        this.currentPage = 1;
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === '' || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === null || this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber') === undefined) {
            if (this.contractSearchModal !== true)
                this.formContractNumber.nativeElement.focus();
            return;
        }
        else {
            //this.riGrid.RefreshRequired();
            this.loadData();
        }
    }
    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
