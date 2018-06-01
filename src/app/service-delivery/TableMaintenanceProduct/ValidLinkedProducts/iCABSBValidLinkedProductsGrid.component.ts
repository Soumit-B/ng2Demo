import { Component, OnInit, OnDestroy, ViewChild, Injector } from '@angular/core';

import { InternalMaintenanceApplicationModuleRoutes } from './../../../base/PageRoutes';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ProductSearchGridComponent } from './../../../internal/search/iCABSBProductSearch';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSBValidLinkedProductsGrid.html'
})

export class ValidLinkedProductsGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    private isProdLinkEnabled: boolean;
    private curPage: number = 1;
    private isServiceCoverDispLevelEnabled: boolean = false;
    private sortType: string;
    private xhrParams: any = {
        operation: 'Business/iCABSBValidLinkedProductsGrid',
        module: 'product',
        method: 'service-delivery/maintenance'
    };

    public pageId: string = '';
    public isShowComponentTypeCode: boolean = false;
    public pageSize: number = 10;
    public totalRecords: number;
    public isShowCloseButton: boolean = true;
    public isShowHeader: boolean = true;
    public controls = [
        { name: 'ProductCode', type: MntConst.eTypeCode },
        { name: 'ProductDesc', type: MntConst.eTypeText },
        { name: 'ComponentTypeCode', type: MntConst.eTypeCode },
        { name: 'ComponentTypeDesc', type: MntConst.eTypeText }
    ];

    public ellipsisConfig: any = {
        product: {
            isShowHeader: true,
            isShowCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-Linked'
            },
            component: ProductSearchGridComponent
        },
        ComponentTypeCode: {
            isShowHeader: true,
            isShowCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp',
                'showAddNew': false,
                'currentContractType': this.riExchange.getCurrentContractType()
            },
            component: ScreenNotReadyComponent //TODO iCABSBComponentTypeSearch
        }
    };

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBVALIDLINKEDPRODUCTSGRID;
        this.browserTitle = this.pageTitle = 'Valid Linked Products';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableProductLinking,
            this.sysCharConstants.SystemCharEnableServiceCoverDisplayLevel
        ];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCEnableProductLinking = record[0]['Logical'];
            this.pageParams.vSCEnableServiceCoverDispLevel = record[1]['Required'];
            this.windowOnload();
        });
    }

    private windowOnload(): void {
        this.pageParams.RefreshGrid = '';
        this.isProdLinkEnabled = this.pageParams.vSCEnableProductLinking;
        this.isServiceCoverDispLevelEnabled = this.pageParams.vSCEnableServiceCoverDispLevel;
        this.pageParams.CurrentContractType = this.riExchange.getCurrentContractType();
        this.riGrid.DefaultBorderColor = 'DDDDDD';
        this.riGrid.FunctionPaging = true;
        if (this.isServiceCoverDispLevelEnabled) {
            this.isShowComponentTypeCode = true;
        }
        this.disableControl('ProductDesc', true);
        this.pageParams.BusinessCode = this.utils.getBusinessCode();
        this.buildGrid();
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ParentProductCode', 'ValidLinkedProducts', 'ParentProductCode', MntConst.eTypeCode, 15);
        this.riGrid.AddColumn('ParentProductDesc', 'ValidLinkedProducts', 'ParentProductDesc', MntConst.eTypeText, 12);
        this.riGrid.AddColumn('ChildProductCode', 'ValidLinkedProducts', 'ChildProductCode', MntConst.eTypeCode, 12);
        this.riGrid.AddColumn('ChildProductDesc', 'ValidLinkedProducts', 'ChildProductDesc', MntConst.eTypeText, 40);
        if (this.isServiceCoverDispLevelEnabled) {
            this.riGrid.AddColumn('ChildComponentTypeCode', 'ValidLinkedProducts', 'ChildComponentTypeCode', MntConst.eTypeText, 3);
        }
        this.riGrid.AddColumnOrderable('ParentProductCode', true);
        this.riGrid.AddColumnOrderable('ChildProductCode', true);
        this.riGrid.Complete();
    }

    private riExchangeUpdateHTMLDocument(): void {
        this.riGridBeforeExecute();
    }

    private riGridBeforeExecute(): void {
        let gridParams: any = this.getURLSearchParamObject();
        if (this.isServiceCoverDispLevelEnabled) {
            gridParams.set('ComponentTypeCode', this.getControlValue('ComponentTypeCode'));
            gridParams.set('DispCompType', 'Yes');
        }
        else {
            gridParams.set('DispCompType', 'No');
        }
        gridParams.set('ProductCode', this.getControlValue('ProductCode'));
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('riCacheRefresh', 'True');
        gridParams.set('riSortOrder', this.riGrid.SortOrder);
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    try {
                        if (data && data.errorMessage) {
                            this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        } else {
                            this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                            this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                            if (this.riGrid.Update) {
                                this.riGrid.StartRow = this.riGrid.CurrentRow;
                                this.riGrid.StartColumn = 0;
                                this.riGrid.RowID = this.riGrid.Details.GetAttribute('ValidLinkedProductRowID', this.attributes.grdValidLinkedProductsValidLinkedProductRowID);
                                this.riGrid.UpdateHeader = false;
                                this.riGrid.UpdateBody = true;
                                this.riGrid.UpdateFooter = false;
                            }
                            if (this.pageParams.RefreshGrid === 'Update') {
                                this.riGrid.Update = true;
                            }
                            else if (this.pageParams.RefreshGrid === '') {
                                this.riGrid.RefreshRequired();
                            }
                            this.pageParams.RefreshGrid = '';
                            this.riGrid.Execute(data);
                        }
                    } catch (e) {
                        this.logger.log('Problem in grid load', e);
                    }
                }
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public riGridSort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riExchangeUpdateHTMLDocument();
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = false;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = false;
        this.riExchangeUpdateHTMLDocument();
    }

    public riGridBodyOnDblClick(rsrcElement: any): void {
        let vbMsgResult: any;
        if (this.riGrid.CurrentColumnName === 'ParentProductCode') {
            this.attributes.BusinessCodeParentProductCode = this.riGrid.Details.GetValue('ParentProductCode');
            this.attributes.BusinessCodeChildProductCode = this.riGrid.Details.GetValue('ChildProductCode');
            this.attributes.grdValidLinkedProductsValidLinkedProductRowID = this.riGrid.Details.GetAttribute('ParentProductCode', 'rowid');
            this.attributes.grdValidLinkedProductsRow = rsrcElement.sectionRowIndex;
            this.pageParams.RefreshGrid = 'Update';
            this.navigate('View', InternalMaintenanceApplicationModuleRoutes.ICABSBVALIDLINKEDPRODUCTSMAINTENANCE, {
                parentMode: 'View',
                BusinessCode_ParentProductCode: this.riGrid.Details.GetValue('ParentProductCode'),
                BusinessCode_ChildProductCode: this.riGrid.Details.GetValue('ChildProductCode')
            });
        }
    }

    public onClickBtnAddLinked(): void {
        this.pageParams.RefreshGrid = '';
        this.navigate('Add', InternalMaintenanceApplicationModuleRoutes.ICABSBVALIDLINKEDPRODUCTSMAINTENANCE, {
            parentMode: 'Add'
        });
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riExchangeUpdateHTMLDocument();
    }

    public onProductDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ProductCode', data.ProductCode);
            this.setControlValue('ProductDesc', data.ProductDesc);
        }
    }

    public onComponentTypeCodeDataReceived(data: any): void {
        if (data) {
            this.setControlValue('ComponentTypeCode', data.ComponentTypeCode);
            this.setControlValue('ComponentTypeDesc', data.ComponentTypeDesc);
        }
    }

    public onBlurProduct(): void {
        if (this.getControlValue('ProductCode')) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.Function = 'ProductDesc';
            postParams.ProductCode = this.getControlValue('ProductCode');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if ((data['errorMessage'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        if (data['ProductDesc']) {
                            this.setControlValue('ProductDesc', data['ProductDesc']);
                        }
                        else {
                            this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                            this.setControlValue('ProductDesc', '');
                            this.setControlValue('ProductCode', '');
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        else {
              this.setControlValue('ProductDesc', '');
              this.setControlValue('ProductCode', '');
        }
    }

    public onBlurComponentTypeCode(): void {
        if (this.getControlValue('ComponentTypeCode')) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.Function = 'ComponentTypeDesc';
            postParams.ProductCode = this.getControlValue('ProductCode');
            postParams.ComponentTypeCode = this.getControlValue('ComponentTypeCode');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if ((data['errorMessage'])) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        if (data['ComponentTypeDesc']) {
                            this.setControlValue('ComponentTypeDesc', data['ComponentTypeDesc']);
                        }
                        else {
                            this.modalAdvService.emitMessage(new ICabsModalVO(data.errorMessage, data.fullError));
                            this.setControlValue('ComponentTypeDesc', '');
                            this.setControlValue('ComponentTypeCode', '');
                        }
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
        else {
            this.setControlValue('ComponentTypeDesc', '');
            this.setControlValue('ComponentTypeCode', '');
        }
    }

}
