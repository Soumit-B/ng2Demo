import { Component, OnInit, AfterViewInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from '../../base/PageIdentifier';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { ContractSearchComponent } from './../../internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../internal/search/iCABSAServiceCoverSearch';
import { ProductSearchGridComponent } from './../../internal/search/iCABSBProductSearch';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';

@Component({

    templateUrl: 'iCABSAProductSalesDeliveriesDueGrid.html'
})

export class ProductSalesDeliveriesDueGridComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('productSalesDeliveriesDueGridPagination') productSalesDeliveriesDueGridPagination: PaginationComponent;
    @ViewChild('ContractSearchComponent') ContractSearchComponent;
    @ViewChild('premisesNumberEllipsis') premisesNumberEllipsis: EllipsisComponent;
    @ViewChild('productcodeEllipsis') productcodeEllipsis: EllipsisComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('errorModal') public errorModal;
    public pageId: string = '';
    public legend = [
        { label: 'Delivered', color: '#CCFFCC' },
        { label: 'Undelivered', color: '#FFCCCC' },
        { label: 'Part-Delivered', color: '#FFFFCC' }
    ];
    public isRequesting: boolean = false;
    public showMessageHeader: boolean = true;
    public pageTitle: string;
    public totalRecords: number;
    public pageSize: number = 10;
    public curPage: number = 1;
    public controls = [
        { name: 'StartDateVal', type: MntConst.eTypeDate },
        { name: 'EndDateVal', type: MntConst.eTypeDate },
        { name: 'ContractNumber', type: MntConst.eTypeCode },
        { name: 'ContractName', type: MntConst.eTypeText },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName', type: MntConst.eTypeText },
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'StatusFilter' },
        { name: 'DeliveryFilter' }
    ];
    public showHeader: boolean = true;
    public search = new URLSearchParams();
    public lookUpSubscription: Subscription;
    // public ContractObject = { type: '', label: '' };
    private queryParams: any = {
        operation: 'Application/iCABSAProductSalesDeliveriesDueGrid',
        module: 'product-sales',
        method: 'service-delivery/grid'
    };
    // public ReqPartInvoicing: any;
    // public GrdKey: boolean = true;
    //Start Date & End Date
    public EndDate: Date;
    public StartDate: Date;
    public showProductSearch: boolean;

    // inputParams for SearchComponent Ellipsis
    public ellipsis = {
        contractSearch: {
            disabled: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp',
                currentContractType: 'P',
                currentContractTypeURLParameter: 'product',
                showAddNew: false,
                contractNumber: ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            showHeader: true,
            showAddNew: false,
            autoOpenSearch: false,
            setFocus: false,
            component: ContractSearchComponent
        },
        premiseSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'currentContractType': 'P',
                'currentContractTypeURLParameter': 'product',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: PremiseSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        serviceCoverSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'ContractNumber': '',
                'ContractName': '',
                'PremiseNumber': '',
                'PremiseName': '',
                'currentContractType': 'P',
                'currentContractTypeURLParameter': 'product',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ServiceCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Lookup',
                'currentContractType': 'P',
                'currentContractTypeURLParameter': 'product',
                'showAddNew': false
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ProductSearchGridComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    constructor(injector: Injector, public titleService: Title) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAPRODUCTSALESDELIVERIESDUEGRID;
    }

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.changeProductModal();
            this.stateRetended();
        } else {
            this.getSysCharDtetails();
        }
        this.pageTitle = 'Due';
    }

    ngAfterViewInit(): void {
        let strDocTitle = '^1^ Deliveries Due';
        let primTitle;
        let secTitle;
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            try {
                Observable.forkJoin(
                    this.getTranslatedValue(strDocTitle, null),
                    this.getTranslatedValue(this.riExchange.getCurrentContractTypeLabel(), null)
                ).subscribe((data) => {
                    if (data) {
                        primTitle = data[0];
                        secTitle = data[1];
                    } else {
                        primTitle = strDocTitle;
                        secTitle = this.riExchange.getCurrentContractTypeLabel();
                    }
                    let titleLabel = primTitle.replace('^1^', secTitle);
                    this.titleService.setTitle(titleLabel);
                });
            } catch (e) {
                //
            }
        });
    }

    private stateRetended(): void {
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premiseSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = this.getControlValue('PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        //this.riGrid.Update = true;
        this.buildGrid();
        //this.riGrid.Update = true;
        this.riGrid_BeforeExecute();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    }

    /*Speed script*/
    private getSysCharDtetails(): void {
        //SysChar
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableInvoiceByDelivery
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
            this.pageParams.vSCEnableInvoiceByDelivery = record[0]['Required'];
            this.pageParams.ReqPartInvoicing = this.pageParams.vSCEnableInvoiceByDelivery;
            this.window_onload();
        });
    }

    private window_onload(): void {
        this.pageParams.GrdKey = true;
        this.showProductSearch = true;
        this.pageParams.ContractObjectType = this.riExchange.getCurrentContractType();
        this.pageParams.ContractObjectLabel = this.riExchange.getCurrentContractTypeLabel();
        this.setControlValue('StatusFilter', 'Undelivered');
        this.setControlValue('DeliveryFilter', 'All');
        this.riExchange.riInputElement.Disable(this.uiForm, 'PremiseName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ContractName');
        this.riExchange.riInputElement.Disable(this.uiForm, 'ProductDesc');

        let endDate = new Date();
        let day = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0, 23, 59, 59);
        let endValString = this.globalize.parseDateToFixedFormat(day).toString();
        let endVal = this.globalize.parseDateStringToDate(endValString);
        this.setControlValue('EndDateVal', endVal);
        this.riGrid.DefaultBorderColor = 'ADD8E6';
        this.riGrid.HighlightBar = true;
        this.riGrid.FunctionPaging = true;
        //this.riGrid.Update = true;
        this.buildGrid();
        this.riGrid.Update = false;
        this.riGrid_BeforeExecute();

    }

    public statusFilter_onchange(): void {
        if (this.getControlValue('StatusFilter') === 'Delivered') {
            this.pageParams.GrdKey = false;
        } else {
            this.pageParams.GrdKey = true;
        }
        this.totalRecords = 0;
        this.buildGrid();
    }

    public deliveryFilter_onchange(): void {
        this.totalRecords = 0;
        this.buildGrid();
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDateVal', value.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'StartDateVal', '');
        }
    }

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDateVal', value.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'EndDateVal', '');
        }
    }

    /**
     * Generate grid method
     */

    private buildGrid(): void {

        this.riGrid.Clear();
        this.riGrid.AddColumn('OrderDate', 'ColOrderDate', 'OrderDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ContractNumber', 'ColContractNumber', 'ContractNumber', MntConst.eTypeText, 8);
        this.riGrid.AddColumn('ContractName', 'ColContractName', 'ContractName', MntConst.eTypeText, 40);
        this.riGrid.AddColumn('PremiseNumber', 'ColPremiseNumber', 'PremiseNumber', MntConst.eTypeInteger, 5);

        this.riGrid.AddColumn('PremisePostcode', 'ColPremisePostcode', 'PremisePostcode', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('ProductCode', 'ColProductCode', 'ProductCode', MntConst.eTypeCode, 10);
        this.riGrid.AddColumn('ProductDesc', 'ColProductDesc', 'ProductDesc', MntConst.eTypeText, 40);
        this.riGrid.AddColumn('ServiceQuantity', 'ColServiceQuantity', 'ServiceQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumn('JobSaleDeliveredQuantity', 'ColJobSaleDeliveredQuantity', 'JobSaleDeliveredQuantity', MntConst.eTypeInteger, 5);
        if (this.pageParams.ReqPartInvoicing) {
            this.getTranslatedValue('Invoice per delivery', null).subscribe((res: string) => {
                if (res) {
                    this.riGrid.AddColumn('PartInvoice', 'ColPartInvoice', 'PartInvoice', MntConst.eTypeImage, 1, false, res);
                } else {
                    this.riGrid.AddColumn('PartInvoice', 'ColPartInvoice', 'PartInvoice', MntConst.eTypeImage, 1, false, 'Invoice per delivery');
                }
            });
        }
        this.getTranslatedValue('Delivered', null).subscribe((res: string) => {
            if (res) {
                this.riGrid.AddColumn('Delivered', 'ColDelivered', 'Delivered', MntConst.eTypeImage, 1, false, res);
            } else {
                this.riGrid.AddColumn('Delivered', 'ColDelivered', 'Delivered', MntConst.eTypeImage, 1, false, 'Delivered');
            }
        });
        this.getTranslatedValue('Deliver By', null).subscribe((res: string) => {
            if (res) {
                this.riGrid.AddColumn('DeliveryBy', 'ColDeliveryBy', 'DeliveryBy', MntConst.eTypeImage, 1, false, res);
            } else {
                this.riGrid.AddColumn('DeliveryBy', 'ColDeliveryBy', 'DeliveryBy', MntConst.eTypeImage, 1, false, 'Deliver By');
            }
        });

        this.riGrid.AddColumnAlign('OrderDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ContractName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremisePostcode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ProductDesc', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentRight);
        this.riGrid.AddColumnAlign('JobSaleDeliveredQuantity', MntConst.eAlignmentRight);

        this.riGrid.AddColumnOrderable('OrderDate', true);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('PremisePostcode', true);
        this.riGrid.AddColumnOrderable('ProductCode', true);

        this.riGrid.Complete();
    }

    public riGrid_BeforeExecute(): void {
        //this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;
        let gridQueryParams: URLSearchParams = new URLSearchParams();

        let headerParams: any = {
            operation: 'Application/iCABSAProductSalesDeliveriesDueGrid',
            module: 'product-sales',
            method: 'service-delivery/grid'
        };

        gridQueryParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridQueryParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        gridQueryParams.set(this.serviceConstants.GridPageSize, this.pageSize.toString());
        gridQueryParams.set(this.serviceConstants.GridPageCurrent, this.curPage.toString());
        gridQueryParams.set(this.serviceConstants.Action, '2');

        gridQueryParams.set('BranchNumber', this.utils.getBranchCode());
        gridQueryParams.set('ContractTypeCode', this.pageParams.ContractObjectType);
        gridQueryParams.set('StartDate', this.getControlValue('StartDateVal'));
        gridQueryParams.set('EndDate', this.getControlValue('EndDateVal'));
        gridQueryParams.set('StatusFilter', this.getControlValue('StatusFilter'));
        gridQueryParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        gridQueryParams.set('ContractName', this.getControlValue('ContractName'));
        gridQueryParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        gridQueryParams.set('PremiseName', this.getControlValue('PremiseName'));
        gridQueryParams.set('ProductCode', this.getControlValue('ProductCode'));
        gridQueryParams.set('ProductDesc', this.getControlValue('ProductDesc'));
        gridQueryParams.set('DeliveryFilter', this.getControlValue('DeliveryFilter'));
        gridQueryParams.set('ProductDesc', this.getControlValue('ProductDesc'));
        gridQueryParams.set('ProductDesc', this.getControlValue('ProductDesc'));

        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridQueryParams.set('riSortOrder', sortOrder);
        gridQueryParams.set('riCacheRefresh', 'true');
        gridQueryParams.set('riGridMode', '0');
        gridQueryParams.set('riGridHandle', '1114654');
        gridQueryParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(headerParams.method, headerParams.module, headerParams.operation, gridQueryParams).subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorModal.show(data, true);
                } else {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    if (this.riGrid.Update) {
                        this.riGrid.StartColumn = 0;
                        this.riGrid.StartRow = this.getAttribute('Row');
                        this.riGrid.RowID = this.getAttribute('ServiceCoverRowID');
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = false;
                    }
                    this.riGrid.Execute(data);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.logger.log('Error', error);
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }


    public onModalClose(): void {
        this.riGrid.ResetGrid();
        this.totalRecords = 0;
    }
    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.HeaderClickedColumn = '';
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public modalHidden(e: any): void {
        this.ellipsis.contractSearch.autoOpenSearch = false;
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    private DeliveriesDueFocus(rsrcElement: any): void {
        let otr: any;
        otr = rsrcElement.parentElement.parentElement.parentElement;
        this.setAttribute('ContractNumber', otr.children[1].children[0].innerText);
        this.setAttribute('PremiseNumber', otr.children[3].children[0].innerText);
        this.setAttribute('Row', otr.getAttribute('sectionRowIndex'));
        this.setAttribute('ServiceCoverRowID', otr.children[5].children[0].children[0].getAttribute('rowid'));
    }

    //Single click on grid
    public riGrid_BodyOnClick(event: any): void {
        this.DeliveriesDueFocus(event.srcElement);
    }

    //Double click on grid @TODO check the navigations
    public riGrid_BodyOnDblClick(event: any): void {
        switch (event.srcElement.parentElement.getAttribute('id')) {
            case 'ColPremisePostcode':
                this.navigate('ProductSalesDelivery', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    'ContractTypeCode': this.pageParams.ContractObjectType,
                    'PremiseRowID': event.srcElement.getAttribute('rowid')
                });//iCABSAPremiseMaintenance
                break;

            case 'ColProductCode':
                this.navigate('ProductSalesDelivery', InternalGridSearchSalesModuleRoutes.ICABSAPRODUCTSALESSCDETAILMAINTENANCE, {
                    'CurrentContractTypeURLParameter': this.pageParams.ContractObjectType,
                    'ServiceCoverRowID': event.srcElement.getAttribute('rowid')
                });//iCABSAProductSalesSCDetailMaintenance
                break;
            default:
            // this.navigate('ProductSalesDelivery', 'Service/iCABSSeServiceVisitMaintenance.htm', {
            //     'CurrentContractTypeURLParameter': this.pageParams.ContractObjectType
            // });

        }
    }

    //keydown event on grid
    public riGrid_BodyOnKeyDown(event: any): void {

        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.DeliveriesDueFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
            case 40:
            case 9:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.nextSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.DeliveriesDueFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }
                }
                break;
        }
    }

    public riExchange_UpdateHTMLDocument(): void {
        this.riGrid.Update = true;
        this.riGrid_BeforeExecute();
    }

    public contractNumber_onkeydown(event: any): void {
        if (event.keyCode === 34) {
            this.ellipsis.contractSearch.autoOpenSearch = true;
            this.changeProductModal();
        }
    }

    public contractNumber_ondeactivate(event: any): void {
        if (this.getControlValue('ContractNumber') !== '') {
            this.populateDescriptions();
        } else {
            this.setControlValue('ContractNumber', '');
            this.setControlValue('ContractName', '');
        }
        this.changeProductModal();
    }

    public contractNumber_onchange(obj: any): void {
        if (this.getControlValue('ContractNumber')) {
            this.uiForm.controls['ContractNumber'].setValue(this.utils.numberPadding(obj.value, 8));
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.premiseSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
        } else {
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = null;
            this.ellipsis.premiseSearch.childConfigParams.ContractName = null;
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = null;
            this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = null;
        }
        this.changeProductModal();
    }

    public premiseNumber_onkeydown(event: any): void {
        if (event.keyCode === 34) {
            this.ellipsis.premiseSearch.autoOpenSearch = true;
            this.changeProductModal();
        }
    }

    public premiseNumber_ondeactivate(event: any): void {
        if (this.getControlValue('PremiseNumber') !== '') {
            let patt = new RegExp('^[0-9]*$');
            if (!patt.test(this.getControlValue('PremiseNumber')) && this.getControlValue('ContractNumber')) {
                this.errorModal.show({ msg: 'Type mismatch', title: 'Error' }, false);
            } else {
                this.populateDescriptions();
            }
        } else {
            this.setControlValue('PremiseNumber', '');
            this.setControlValue('PremiseName', '');
        }
        this.changeProductModal();
    }

    public premiseNumber_onchange(): void {
        if (this.getControlValue('PremiseNumber')) {
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = this.getControlValue('PremiseName');
        } else {
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = null;
            this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = null;
        }
        this.changeProductModal();
    }


    public productCode_onkeydown(event: any): void {
        if (event.keyCode === 34) {
            if (this.getControlValue('ContractNumber') && this.getControlValue('PremiseNumber')) {
                this.showProductSearch = false;
                this.ellipsis.serviceCoverSearch.autoOpenSearch = true;
            } else {
                this.showProductSearch = true;
                this.ellipsis.productSearch.autoOpenSearch = true;
            }
            this.changeProductModal();
        }
    }

    public productCode_ondeactivate(event: any): void {
        if (this.getControlValue('ProductCode') !== '') {
            this.populateDescriptions();
        } else {
            this.setControlValue('ProductCode', '');
            this.setControlValue('ProductDesc', '');
        }
        this.changeProductModal();
        if (this.showProductSearch) {
            this.setControlValue('ContractNumber', '');
            this.setControlValue('ContractName', '');
            this.setControlValue('PremiseNumber', '');
            this.setControlValue('PremiseName', '');
        }
    }

    // On contract number ellipsis data return
    public onContractDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.premiseSearch.childConfigParams.ContractName = data.ContractName;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = data.ContractName;
        this.changeProductModal();
    }
    // On premise number ellipsis data return
    public onPremiseDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = data.PremiseNumber;
        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = data.PremiseName;
        this.changeProductModal();
    }

    // On product number ellipsis data return
    public onProductDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.row.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.row.ProductDesc);
        this.changeProductModal();
    }

    // On product search ellipsis data return
    public onProductSearchDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', data.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', data.ProductDesc);
        this.changeProductModal();
        if (this.showProductSearch) {
            this.setControlValue('ContractNumber', '');
            this.setControlValue('ContractName', '');
            this.setControlValue('PremiseNumber', '');
            this.setControlValue('PremiseName', '');
        }
    }

    //Fetch All Details
    public populateDescriptions(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetDescriptions';
        if (this.getControlValue('ContractNumber')) {
            postParams.ContractNumber = this.getControlValue('ContractNumber');
        }
        if (this.getControlValue('PremiseNumber')) {
            postParams.PremiseNumber = this.getControlValue('PremiseNumber');
        }
        if (this.getControlValue('ProductCode')) {
            postParams.ProductCode = this.getControlValue('ProductCode');
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        //
                    } else {
                        this.setControlValue('ContractName', e.ContractName);
                        this.setControlValue('PremiseName', e.PremiseName);
                        this.setControlValue('ProductDesc', e.ProductDesc);
                        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                        this.ellipsis.premiseSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
                        this.ellipsis.serviceCoverSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
                        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
                        this.ellipsis.serviceCoverSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
                        this.ellipsis.serviceCoverSearch.childConfigParams.PremiseName = this.getControlValue('PremiseName');
                        if (this.getControlValue('ContractName') === '') {
                            this.setControlValue('ContractNumber', '');
                        }
                        if (this.getControlValue('PremiseName') === '') {
                            this.setControlValue('PremiseNumber', '');
                        }
                        if (this.getControlValue('ProductDesc') === '') {
                            this.setControlValue('ProductCode', '');
                        }
                        this.changeProductModal();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private changeProductModal(): void {
        if (this.getControlValue('ContractName')) {
            this.showProductSearch = false;
        } else {
            this.showProductSearch = true;
        }
    }
}
