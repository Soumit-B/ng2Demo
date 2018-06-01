import { InternalMaintenanceModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../base/PageRoutes';
import { Component, Injector, ViewChild, OnInit, OnDestroy, Renderer } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { URLSearchParams } from '@angular/http';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSSSOServiceCoverGrid.html'
})

export class ServiceCoverComponent extends BaseComponent implements OnInit, OnDestroy {

    @ViewChild('serviceCoverGrid') serviceCoverGrid: GridComponent;
    @ViewChild('serviceCoverGridPagination') serviceCoverGridPagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;

    public queryParams: any = {
        operation: 'Sales/iCABSSSOServiceCoverGrid',
        module: 'advantage',
        method: 'prospect-to-contract/maintenance'
    };

    public controls = [
        { name: 'dlContractRef', readonly: true, disabled: true, required: false },
        { name: 'dlPremiseRef', readonly: true, disabled: true, required: false },
        { name: 'menu' },
        { name: 'dlBatchRef' },
        { name: 'Misc' },
        { name: 'SubSystem' },
        { name: 'UpdateableInd' },
        { name: 'AutoCloseWindow' },
        { name: 'PNOLSetupChargeRequired' },
        { name: 'ContractTypeCode' },
        { name: 'dlPremiseROWID' }
    ];

    public pageId: string = '';
    public UpdateableIndValue: any;
    public PNOLSetupChargeRequiredValue: any;
    public tdOptions: boolean = false;

    public showMessageHeader: boolean = true;
    public promptTitle: string = '';
    public promptContent: string = '';
    public showErrorHeader: boolean = true;

    public pageSize: number = 10;
    public curPage: number = 1;
    public totalRecords: number;
    public search = new URLSearchParams();

    constructor(public injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSSOSERVICECOVERGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public windowOnload(): void {

        this.riGrid.PageSize = 10;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;

        this.setControlValue('dlBatchRef', this.riExchange.getParentHTMLValue('dlBatchRef'));
        this.setControlValue('dlContractRef', this.riExchange.getParentHTMLValue('dlContractRef'));
        this.setControlValue('dlPremiseRef', this.riExchange.getParentAttributeValue('dlPremiseRef'));
        this.setControlValue('ContractTypeCode', this.riExchange.getParentHTMLValue('ContractTypeCode'));
        this.setControlValue('SubSystem', this.riExchange.getParentHTMLValue('SubSystem'));


        let searchParams: URLSearchParams = new URLSearchParams();
        let bodyParams = {};
        bodyParams['Function'] = 'Updateable';
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set('dlBatchRef', this.getControlValue('dlBatchRef'));
        searchParams.set('dlContractRef', this.getControlValue('dlContractRef'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorModal.show(data, true);
                }
                else {
                    this.UpdateableIndValue = data;
                    this.setControlValue('UpdateableInd', this.UpdateableIndValue);
                    if (this.getControlValue('dlBatchRef') !== 'All' && this.UpdateableIndValue) {
                        this.tdOptions = false;
                    }

                    if (this.getControlValue('dlPremiseROWID') !== '') {
                        this.attributes.dlPremiseROWID = this.riExchange.getParentHTMLValue('dlPremiseROWID');
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });


        this.buildGrid();
        this.riGrid_BeforeExecute();
    }

    public buildGrid(): void {

        this.riGrid.Clear();

        this.riGrid.AddColumn('PremiseNumber', 'SOServiceCover', 'PremiseNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('PremiseName', 'SOServiceCover', 'PremiseName', MntConst.eTypeTextFree, 20);
        this.riGrid.AddColumn('PremiseAddressLine1', 'SOServiceCover', 'PremiseAddressLine1', MntConst.eTypeText, 20);
        this.riGrid.AddColumn('PremisePostCode', 'SOServiceCover', 'PremisePostCode', MntConst.eTypeText, 10);
        this.riGrid.AddColumn('ServiceCoverNumber', 'SOServiceCover', 'ServiceCoverNumber', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumn('SCContractTypeCode', 'SOServiceCover', 'SCContractTypeCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumn('dlStatusCode', 'SOServiceCover', 'dlStatusCode', MntConst.eTypeCode, 1);
        this.riGrid.AddColumn('ServiceCommenceDate', 'SOServiceCover', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ProductCode', 'SOServiceCover', 'ProductCode', MntConst.eTypeText, 10);

        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceCoverNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('SCContractTypeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('dlStatusCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremiseAddressLine1', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremisePostCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('PremiseNumber', true);
        this.riGrid.AddColumnOrderable('ProductCode', true);
        this.riGrid.AddColumnOrderable('PremisePostCode', true);

        this.riGrid.Complete();
    }

    private riGrid_BeforeExecute(): void {

        let gridParams: URLSearchParams = new URLSearchParams();

        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());

        gridParams.set('dlBatchRef', this.getControlValue('dlBatchRef'));
        gridParams.set('dlContractRef', this.getControlValue('dlContractRef'));
        gridParams.set('dlPremiseRef', this.getControlValue('dlPremiseRef'));

        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());

        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        gridParams.set('riSortOrder', sortOrder);
        gridParams.set('HeaderClickedColumn', this.riGrid.HeaderClickedColumn);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.isRequesting = true;
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.errorModal.show(data, true);
                }
                else {
                    this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 1 : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.UpdateHeader = true;
                    this.riGrid.Execute(data);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isRequesting = false;
            },
            (error) => {
                this.errorModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }

    public riGrid_BodyOnClick(data: any): void {
        if (this.riGrid.CurrentColumnName === 'PremiseNumber' || this.riGrid.CurrentColumnName === 'ServiceCoverNumber') {
            this.SOServiceCoverFocus(data.srcElement);
        }

    }

    public SOServiceCoverFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement.children[4].children[0].children[0];
        this.attributes.dlPremiseROWID = this.riGrid.Details.GetAttribute('PremiseNumber', 'rowid');
        this.attributes.dlServiceCoverRowID = this.riGrid.Details.GetAttribute('ServiceCoverNumber', 'rowid');
        this.attributes.dlServiceCoverRef = this.riGrid.Details.GetAttribute('ServiceCoverNumber', 'additionalproperty');
        this.attributes.ProductCode = this.riGrid.Details.GetValue('ProductCode');
        this.attributes.ProductDesc = this.riGrid.Details.GetAttribute('ProductCode', 'additionalproperty');
        this.attributes.ServiceCommenceDate = this.riGrid.Details.GetValue('ServiceCommenceDate');
        this.setControlValue('ContractTypeCode', this.riGrid.Details.GetValue('SCContractTypeCode'));
        oTR.focus();
        oTR.select();

    }

    public riGrid_BodyOnDblClick(data: any): void {
        this.riGrid_BodyOnClick(data);
        switch (this.riGrid.CurrentColumnName) {
            case 'PremiseNumber':
                this.navigate('SOPremise', InternalMaintenanceSalesModuleRoutes.ICABSSDLPREMISEMAINTENANCE,
                    {
                        'dlPremiseROWID': this.attributes.dlPremiseROWID,
                        'dlBatchRef': this.getControlValue('dlBatchRef'),
                        'dlContractRef': this.getControlValue('dlContractRef'),
                        'dlPremiseRef': this.getControlValue('dlPremiseRef')
                    }
                );
                break;
            case 'ServiceCoverNumber':
                this.navigate('ServiceCoverUpdate', InternalMaintenanceSalesModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE,
                    {
                        dlServiceCoverRowID: this.attributes.dlServiceCoverRowID,
                        ContractTypeCode: this.getControlValue('ContractTypeCode'),
                        dlPremiseRef: this.getControlValue('dlPremiseRef'),
                        SubSystem: this.getControlValue('SubSystem')
                    }
                );
                break;
            default:
                break;
        }

    }

    public riGrid_BodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.SOServiceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
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
                                this.SOServiceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
        }
    }

    public riExchange_UpDateHTMLDocument(data: any): void {

        if (this.PNOLSetupChargeRequiredValue && this.getControlValue('ContractTypeCode') === 'C') {
            this.PNOLSetupChargeRequiredValue = false;

            let msgContent = { title: '', msg: 'This page iCABSSPNOLSetupChargeEntry.htm is not available' };
            this.messageModal.show(msgContent, false);
            // TO DO  - Page not ready yet
            //this.navigate('SOPremise', '/Sales/iCABSSPNOLSetupChargeEntry.htm');
        }
    }

    public menuOnchange(): void {
        let selectedValue = this.uiForm.controls['menu'].value;
        if (selectedValue === 'AddServiceCover') {
            this.navigate('ServiceCoverUpdate', InternalMaintenanceSalesModuleRoutes.ICABSSDLSERVICECOVERMAINTENANCE);
        }
    }

    public riExchange_UnLoadHTMLDocument(data: any): void {
        this.riExchange_UpDateHTMLDocument(data);
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public promptSave(event: any): void {
        //to do
    }

}
