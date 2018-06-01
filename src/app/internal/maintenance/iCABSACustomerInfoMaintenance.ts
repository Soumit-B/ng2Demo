import { InternalMaintenanceModuleRoutes, InternalGridSearchModuleRoutes, AppModuleRoutes, InternalMaintenanceApplicationModuleRoutes } from './../../base/PageRoutes';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { Component, OnInit, Injector, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';


@Component({
    templateUrl: 'iCABSACustomerInfoMaintenance.html'
})

export class CustomerInfoMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {

    public pageId: string = '';
    public controls = [
        { name: 'CustomerInfoNumber', readonly: true, disabled: false, required: false },
        { name: 'CustomerInfoName', readonly: true, disabled: false, required: false },
        { name: 'BranchNumber', readonly: true, disabled: false, required: false , type: MntConst.eTypeInteger},
        { name: 'Mode', readonly: true, disabled: false, required: false },
        { name: 'CustomerPassNumber', readonly: true, disabled: false, required: false },
        { name: 'CustomerPassLevel', readonly: true, disabled: false, required: false },
        { name: 'CallingProg', readonly: true, disabled: false, required: false },
        { name: 'InfoLevel', readonly: true, disabled: false, required: false }
    ];
    public errorNumber: boolean = true;
    public curPage: number = 1;
    public totalRecords: number;
    public pageSize: number = 10;
    public search = new URLSearchParams();
    public queryParams: any = {
        operation: 'Application/iCABSACustomerInfoMaintenance',
        module: 'customer',
        method: 'contract-management/grid'
    };
    public loggedInBranch: any;
    @ViewChild('customerInfoMaintainencePagination') customerInfoMaintainencePagination: PaginationComponent;
    @ViewChild('customerInfoMaintainenceGrid') customerInfoMaintainenceGrid: GridComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    constructor(injector: Injector,
        private _router: Router, private el: ElementRef) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACUSTOMERINFOMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        // this.uiForm = this.formBuilder.group({});
        // this.riExchange.renderForm(this.uiForm, this.controls);
        this.pageTitle = 'Customer Information Summary';
        let strDocTitle = 'Customer Information Maintenance';
        this.getTranslatedValue(strDocTitle, null).subscribe((res: string) => {
            if (res) { strDocTitle = res; }
            this.utils.setTitle(strDocTitle);
        });
        if (this.isReturning()) {
            this.populateUIFromFormData();
        }
        this.window_onload();
    }

    private window_onload(): void {
        let businessCode = this.utils.getBusinessCode(),
            countryCode = this.utils.getCountryCode();
        this.riGrid.PageSize = 10;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;
        this.buildGrid();
        // this.riGrid_BeforeExecute();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public customerInfoChanged(obj: any): void {
        if (this.getControlValue('CustomerInfoNumber') || this.getControlValue('CustomerInfoNumber') !== '') {
            if (/^[0-9]+$/.test(obj.value)) {
                this.setControlValue('CustomerInfoNumber', this.utils.numberPadding(obj.value, 8));
            }
        }
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }

    /**
     * Generate grid method
     */
    public buildGrid(): void {

        this.riGrid.Clear();
        this.riGrid.AddColumn('ttCustomerInfoNumber', 'CustomerInformation', 'ttCustomerInfoNumber', MntConst.eTypeInteger, 9);
        this.riGrid.AddColumn('ttCustomerInfoName', 'CustomerInformation', 'ttCustomerInfoName', MntConst.eTypeText, 42);
        this.riGrid.AddColumn('ttOwningBranch', 'CustomerInformation', 'ttOwningBranch', MntConst.eTypeInteger, 3);
        this.riGrid.AddColumn('ttGroupCount', 'CustomerInformation', 'ttGroupCount', MntConst.eTypeInteger, 9);
        this.riGrid.AddColumn('ttAccountCount', 'CustomerInformation', 'ttAccountCount', MntConst.eTypeInteger, 9);
        this.riGrid.AddColumn('ttContractCount', 'CustomerInformation', 'ttContractCount', MntConst.eTypeInteger, 9);

        this.riGrid.AddColumnAlign('ttCustomerInfoNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ttCustomerInfoName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('ttOwningBranch', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ttGroupCount', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('ttAccountCount', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ttContractCount', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnTabSupport('ttCustomerInfoNumber', true);

        this.riGrid.Complete();
    }


    private riGrid_BeforeExecute(): void {

        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        //set parameters
        gridParams.set('CustomerInfoNumber', this.getControlValue('CustomerInfoNumber'));
        gridParams.set('CustomerInfoName', this.getControlValue('CustomerInfoName'));
        gridParams.set('BranchNumber', this.getControlValue('BranchNumber'));
        gridParams.set(this.serviceConstants.GridHandle, '986332');
        gridParams.set(this.serviceConstants.GridCacheRefresh, 'yes');
        gridParams.set(this.serviceConstants.GridHeaderClickedColumn, '');
        gridParams.set('riSortOrder', 'Descending');
        gridParams.set(this.serviceConstants.GridMode, '0');
        // set grid building parameters
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data['errorNumber'] === 0 || data.errorMessage) {
                    this.errorNumber = false;
                    return;
                }
                this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                this.riGrid.UpdateBody = true;
                this.riGrid.UpdateHeader = true;
                this.riGrid.Execute(data);

            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        // this.curPage = 1;
        // this.employeeGridPagination.setPage(1);
        if (this.getControlValue('CustomerInfoNumber') || this.getControlValue('CustomerInfoNumber') !== '') {
            if (/^[0-9]+$/.test(this.getControlValue('CustomerInfoNumber'))) {
                this.errorNumber = true;
                this.riGrid.RefreshRequired();
                this.riGrid_BeforeExecute();
            } else {
                this.errorNumber = false;
            }
        } else {
            this.errorNumber = true;
            this.riGrid.RefreshRequired();
            this.riGrid_BeforeExecute();
        }
    }

    public riGrid_BodyOnClick(event: any): void {
        this.CustomerInformationFocus(event.srcElement);
        this.setControlValue('CustomerInfoNumber', this.riGrid.Details.GetValue('ttCustomerInfoNumber'));
        this.setControlValue('CustomerInfoName', this.riGrid.Details.GetValue('ttCustomerInfoName'));
    }

    public riGrid_BodyOnDblClick(event: any): void {
        this.setControlValue('CustomerInfoNumber', this.riGrid.Details.GetValue('ttCustomerInfoNumber'));
        this.setControlValue('CustomerInfoName', this.riGrid.Details.GetValue('ttCustomerInfoName'));
        switch (this.riGrid.CurrentColumnName) {
            case 'ttCustomerInfoNumber':
                this.navigate('Update', InternalMaintenanceApplicationModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE, {
                    'Mode': 'Update',
                    'CustomerInfoNumber': this.getControlValue('CustomerInfoNumber'),
                    'CustomerInfoName': this.riGrid.Details.GetValue('ttCustomerInfoName')
                });
                break;
            default:
                this.setControlValue('CallingProg', 'CustomerInfoMaint');
                this.setControlValue('CustomerInfoNumber', this.riGrid.Details.GetValue('ttCustomerInfoNumber'));
                this.setControlValue('CustomerInfoName', this.riGrid.Details.GetValue('ttCustomerInfoName'));
                /*this.navigate('Update', InternalMaintenanceModuleRoutes.ICABSACUSTOMERINFORMATIONMAINTENANCE, {
                    'CustomerInfoNumber': this.getControlValue('CustomerInfoNumber'),
                    'CustomerInfoName': this.riGrid.Details.GetValue('ttCustomerInfoName')
                });*/
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
                                this.CustomerInformationFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
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
                                this.CustomerInformationFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
        }
    }

    public riExchange_UpdateHTMLDocument(): void {

        if (this.getControlValue('Mode') === 'Existing') {
            this.setControlValue('Mode', 'New');
            this.setControlValue('CustomerInfoNumber', this.getControlValue('CustomerPassNumber'));
            this.setControlValue('InfoLevel', this.getControlValue('CustomerPassLevel'));
            this.riGrid_BodyOnDblClick(new CustomEvent('Default'));
        }
    }

    private CustomerInformationFocus(rsrcElement: any): void {
        rsrcElement.select();
        rsrcElement.focus();
    }
}
