import { URLSearchParams } from '@angular/http';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';

import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { ContractManagementModuleRoutes, InternalMaintenanceServiceModuleRoutes, InternalSearchModuleRoutes } from './../../base/PageRoutes';
import { BranchServiceAreaSearchComponent } from './../search/iCABSBBranchServiceAreaSearch';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { ServiceCoverSearchComponent } from './../search/iCABSAServiceCoverSearch';
import { PremiseSearchComponent } from './../search/iCABSAPremiseSearch';
import { ContractSearchComponent } from './../search/iCABSAContractSearch';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSSePlanVisitGrid.html'
})

export class PlanVisitGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    private search: URLSearchParams = new URLSearchParams();
    private charContractTypeCode: string = '';
    private xhrParams: any = {
        operation: 'Service/iCABSSePlanVisitGrid',
        module: 'plan-visits',
        method: 'service-planning/maintenance'
    };
    private currentContractType: string = '';

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public pageId: string = '';
    public totalRecords: number = 1;
    public pageCurrent: number = 1;

    public controls: Array<any> = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'BranchServiceAreaCode', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'BranchServiceAreaDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'BranchServiceAreaSeqNo', readonly: true, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'ProductCode', readonly: true, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchNumber', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'BranchName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }
    ];

    public inputParamsContractSearch: any = {
        parentMode: 'LookUp-All',
        enableAccountSearch: false
    };

    public inputParamsAccountPremise: any = {
        parentMode: 'LookUp',
        ContractNumber: '',
        showAddNew: false
    };

    public serviceCoverSearchParams: any = {
        parentMode: 'LookUp',
        ContractNumber: '',
        PremiseNumber: '',
        CurrentContractTypeURLParameter: '<Contract>',
        showAddNew: false
    };

    public branchServiceAreaSearchParams: any = {
        disabled: false,
        showCloseButton: true,
        showHeader: true,
        showAddNew: false,
        autoOpenSearch: false,
        parentMode: 'LookUp',
        ServiceBranchNumber: '',
        BranchName: ''
    };

    public contractSearchComponent = ContractSearchComponent;
    public premiseSearchComponent: Component;
    public serviceCoverSearchComponent: Component;
    public branchServiceAreaComponent = BranchServiceAreaSearchComponent;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEPLANVISITGRID;
        this.browserTitle = this.pageTitle = 'Plan Visit Maintenance';
    }

    private toggleServiceAndProductSearch(): void {
        this.inputParamsAccountPremise.ContractNumber = this.getControlValue('ContractNumber');
        this.inputParamsAccountPremise.ContractName = this.getControlValue('ContractName');
        if (this.fieldHasValue('ContractNumber') && this.fieldHasValue('PremiseNumber')) {
            this.serviceCoverSearchParams.parentMode = 'LookUp-Freq';
            this.serviceCoverSearchParams.ContractNumber = this.getControlValue('ContractNumber');
            this.serviceCoverSearchParams.ContractName = this.getControlValue('ContractName');
            this.serviceCoverSearchParams.PremiseNumber = this.getControlValue('PremiseNumber');
            this.serviceCoverSearchParams.PremiseName = this.getControlValue('PremiseName');
            this.serviceCoverSearchParams.ProductCode = this.getControlValue('ProductCode');
            this.serviceCoverSearchParams.ProductDesc = this.getControlValue('ProductDesc');
            this.serviceCoverSearchParams.CurrentContractTypeURLParameter = this.utils.getCurrentContractLabel(this.currentContractType);
            this.serviceCoverSearchComponent = ServiceCoverSearchComponent;
        } else {
            this.serviceCoverSearchParams.parentMode = 'LookUp';
            this.serviceCoverSearchComponent = ProductSearchGridComponent;
        }
    }

    private windowOnload(): void {
        this.charContractTypeCode = this.riExchange.getCurrentContractType();
        this.riGrid.FunctionPaging = true;
        this.riGrid.PageSize = 10;
        this.buildGrid();
        this.setControlValue('BranchNumber', this.utils.getBranchCode());
        this.setControlValue('BranchName', this.utils.getBranchText());
        this.setControlValue('BranchServiceAreaSeqNo', '0');
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ContractNumber', 'ServiceVisit', 'ContractNumber', MntConst.eTypeCode, 11, true);
        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PremiseNumber', 'ServiceVisit', 'PremiseNumber', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ProductCode', 'ServiceVisit', 'ProductCode', MntConst.eTypeCode, 10, true);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceVisitFrequency', 'ServiceVisit', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceQuantity', 'ServiceVisit', 'ServiceQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceCommenceDate', 'ServiceVisit', 'ServiceCommenceDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceVisitAnnivDate', 'ServiceVisit', 'ServiceVisitAnnivDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServiceVisitAnnivDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('PortfolioStatusDesc', 'ServiceVisit', 'PortfolioStatusDesc', MntConst.eTypeText, 10);
        this.riGrid.AddColumnAlign('PortfolioStatusDesc', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('BranchServiceAreaCode', 'ServiceVisit', 'BranchServiceAreaCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('BranchServiceAreaCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('EmployeeCode', 'ServiceVisit', 'EmployeeCode', MntConst.eTypeCode, 6);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('BranchServiceAreaSeqNo', 'ServiceVisit', 'BranchServiceAreaSeqNo', MntConst.eTypeInteger, 6);
        this.riGrid.AddColumnAlign('BranchServiceAreaSeqNo', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ViewServiceVisit', 'ServiceVisit', 'ViewServiceVisit', MntConst.eTypeImage, 1, true);
        this.riGrid.AddColumnAlign('ViewServiceVisit', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('AddServiceVisit', 'ServiceVisit', 'AddServiceVisit', MntConst.eTypeImage, 1, true);
        this.riGrid.AddColumnAlign('AddServiceVisit', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('PremiseNumber', true);
        this.riGrid.AddColumnOrderable('ProductCode', true);
        this.riGrid.AddColumnOrderable('BranchServiceAreaCode', true);
        this.riGrid.AddColumnOrderable('BranchServiceAreaSeqNo', true);
        this.riGrid.Complete();
    }

    private serviceCoverFocus(rsrcElement: any): void {
        let oTR: any = rsrcElement.parentElement.parentElement.parentElement.children[0];
        rsrcElement.focus();
        this.setAttribute('ContractRowID', this.riGrid.Details.GetAttribute('ContractNumber', 'RowID'));
        this.setAttribute('PremiseRowID', this.riGrid.Details.GetAttribute('PremiseNumber', 'RowID'));
        this.setAttribute('ServiceCoverRowID', this.riGrid.Details.GetAttribute('ProductCode', 'RowID'));
        this.setAttribute('Row', this.riGrid.CurrentRow);
        let strContractNumber: string = this.riGrid.Details.GetValue('ContractNumber');
        strContractNumber = this.utils.mid(strContractNumber, 3);
        this.setAttribute('ContractNumber', strContractNumber);
        this.setAttribute('ContractName', this.riGrid.Details.GetAttribute('ContractNumber', 'AdditionalProperty'));
        this.setAttribute('PremiseNumber', this.riGrid.Details.GetValue('PremiseNumber'));
        this.setAttribute('PremiseName', this.riGrid.Details.GetAttribute('PremiseNumber', 'AdditionalProperty'));
        this.setAttribute('ProductCode', this.riGrid.Details.GetValue('ProductCode'));
        this.setAttribute('ProductDesc', this.riGrid.Details.GetAttribute('ProductCode', 'AdditionalProperty'));
        this.currentContractType = this.riGrid.Details.GetAttribute('ServiceVisitFrequency', 'AdditionalProperty');
    }

    private populateDescriptions(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '6');
        let formData = {
            Function: 'SetDisplayFields',
            ContractTypeCode: this.currentContractType
        };
        if (this.fieldHasValue('BranchNumber')) {
            formData['BranchNumber'] = this.getControlValue('BranchNumber');
        }
        if (this.fieldHasValue('BranchServiceAreaCode')) {
            formData['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
        }
        if (this.fieldHasValue('ContractNumber')) {
            formData['ContractNumber'] = this.getControlValue('ContractNumber');
        }
        if (this.fieldHasValue('PremiseNumber')) {
            formData['PremiseNumber'] = this.getControlValue('PremiseNumber');
        }
        if (this.fieldHasValue('ProductCode')) {
            formData['ProductCode'] = this.getControlValue('ProductCode');
        }
        if (this.getAttribute('ServiceCoverRowID')) {
            formData['ServiceCoverRowID'] = this.getAttribute('ServiceCoverRowID');
        }
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module,
            this.xhrParams.operation, this.search, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('BranchName', data['BranchName']);
                    this.setControlValue('BranchServiceAreaDesc', data['BranchServiceAreaDesc']);
                    this.setControlValue('ContractName', data['ContractName']);
                    this.setControlValue('PremiseName', data['PremiseName']);
                    this.setControlValue('ProductDesc', data['ProductDesc']);
                    this.setControlValue('ServiceVisitFrequency', data['ServiceVisitFrequency']);
                    this.riGrid.RefreshRequired();
                    if (this.getControlValue('ServiceVisitFrequency') === 0) {
                        this.setControlValue('ServiceVisitFrequency', '');
                    }
                    if (!this.fieldHasValue('BranchName')) { this.setControlValue('BranchNumber', ''); }
                    if (!this.fieldHasValue('BranchServiceAreaDesc')) { this.setControlValue('BranchServiceAreaCode', ''); }
                    if (!this.fieldHasValue('ContractName')) { this.setControlValue('ContractNumber', ''); }
                    if (!this.fieldHasValue('PremiseName')) { this.setControlValue('PremiseNumber', ''); }
                    if (!this.fieldHasValue('ProductDesc')) { this.setControlValue('ProductCode', ''); }
                    this.toggleServiceAndProductSearch();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            });
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.premiseSearchComponent = PremiseSearchComponent;
        this.serviceCoverSearchComponent = ProductSearchGridComponent;
        this.branchServiceAreaSearchParams.ServiceBranchNumber = this.utils.getBranchCode();
        this.branchServiceAreaSearchParams.BranchName = this.utils.getBranchText();
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.charContractTypeCode = this.riExchange.getCurrentContractType();
            this.riGrid.FunctionPaging = true;
            this.riGrid.PageSize = 10;
            this.buildGrid();
        } else {
            this.windowOnload();
        }
    }

    public riGridBeforeExecute(): void {
        /**
         *  The rowid attribute may have been by a public program, but not the servicecover
         * selection, in which case blank it out otherwise any grid redisplay will go wrong;
         */
        if (!this.fieldHasValue('ServiceVisitFrequency')) {
            this.setAttribute('ServiceCoverRowID', '');
        }
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('BranchNumber', this.utils.getBranchCode());
        this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        this.search.set('ProductCode', this.getControlValue('ProductCode'));
        this.search.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        this.search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        this.search.set('BranchServiceAreaSeqNo', this.getControlValue('BranchServiceAreaSeqNo'));
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.GridCacheRefresh, 'True');
        this.search.set(this.serviceConstants.PageSize, '10');
        this.search.set(this.serviceConstants.GridPageCurrent, this.pageCurrent.toString());
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        this.search.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search)
            .subscribe(
            (data) => {
                if (data) {
                    this.pageCurrent = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalRecords = data.pageData ? data.pageData.lastPageNumber * 10 : 1;
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateFooter = true;
                    this.riGrid.UpdateHeader = true;
                    if (data && data.errorMessage) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    } else {
                        this.riGrid.Execute(data);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            error => {
                this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.GeneralError));
                this.totalRecords = 1;
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGridBodyOnDblClick(event: any): void {
        let columnName: string = this.riGrid.CurrentColumnName;
        this.serviceCoverFocus(event.srcElement.parentElement);
        switch (columnName) {
            case 'ContractNumber':
                let url = ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE;
                switch (this.currentContractType) {
                    case 'P':
                        url = ContractManagementModuleRoutes.ICABSAPRODUCTSALEMAINTENANCE;
                        break;
                    case 'J':
                        url = ContractManagementModuleRoutes.ICABSAJOBMAINTENANCE;
                        break;
                    default:
                    case 'C':
                        url = ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE;
                        break;
                }
                this.navigate('ServiceVisitEntryGrid', url,
                    {
                        ContractNumber: this.getAttribute('ContractNumber')
                    });
                break;
            case 'PremiseNumber':
                this.navigate('ServiceVisitEntryGrid', ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE,
                    {
                        contracttypecode: this.currentContractType,
                        PremiseRowID: this.getAttribute('PremiseRowID')
                    });
                break;
            case 'ProductCode':
                this.navigate('ServiceVisitEntryGrid', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE,
                    {
                        currentContractType: this.currentContractType
                    });
                break;
            case 'ViewServiceVisit':
                this.navigate('ServiceCover', InternalSearchModuleRoutes.ICABSSEPLANVISITSEARCH,
                    {
                        currentContractType: this.currentContractType,
                        fromPageNav: 'true'
                    });
                break;
            case 'AddServiceVisit':
                this.navigate('SearchAdd2', InternalMaintenanceServiceModuleRoutes.ICABSSEPLANVISITMAINTENANCE2,
                    {
                        currentContractType: this.currentContractType,
                        ContractNumber: this.getControlValue('ContractNumber'),
                        ContractName: this.getControlValue('ContractName'),
                        PremiseNumber: this.getControlValue('PremiseNumber'),
                        PremiseName: this.getControlValue('PremiseName'),
                        ProductCode: this.getControlValue('ProductCode'),
                        ProductDesc: this.getControlValue('ProductDesc'),
                        ServiceCoverRowID: this.getAttribute('ServiceCoverRowID'),
                        BranchServiceAreaCode: this.getControlValue('BranchServiceAreaCode')
                    });
                break;
        }
    }

    public branchNumberOnchange(): void {
        this.populateDescriptions();
    }

    public branchServiceAreaCodeOnchange(): void {
        this.populateDescriptions();
    }

    public contractNumberOnchange(): void {
        //Clear down the ServiceCoverROWID attrib on change of contract number;
        this.setAttribute('ServiceCoverRowID', '');
        this.populateDescriptions();
    }

    public premiseNumberOnchange(): void {
        // Clear down the ServiceCoverROWID attrib on change of premise number;
        this.setAttribute('ServiceCoverRowID', '');
        this.populateDescriptions();
    }

    public productCodeOnchange(): void {
        this.setAttribute('ServiceCoverRowID', '');
        this.populateDescriptions();
    }

    public refresh(): void {
        this.riGridBeforeExecute();
    }

    public riGridSort(event: any): void {
        this.riGridBeforeExecute();
    }

    public getCurrentPage(event: any): void {
        if (this.pageCurrent !== event.value) {
            this.pageCurrent = event.value;
            this.riGridBeforeExecute();
        }
    }

    public setContractNumber(event: any): void {
        this.setControlValue('ContractNumber', event.ContractNumber);
        this.setControlValue('ContractName', event.ContractName);
        this.currentContractType = event.ContractTypePrefix;

        this.inputParamsAccountPremise.ContractNumber = event.ContractNumber;
        this.inputParamsAccountPremise.ContractName = event.ContractName;
        this.serviceCoverSearchParams.ContractNumber = event.ContractNumber;
        this.serviceCoverSearchParams.ContractName = event.ContractName;
        this.branchServiceAreaSearchParams.ServiceBranchNumber = this.utils.getBranchCode();
        this.branchServiceAreaSearchParams.BranchName = this.utils.getBranchText();
        this.toggleServiceAndProductSearch();
    }

    public onPremiseSearchDataReceived(data: any): void {
        this.setControlValue('PremiseNumber', data.PremiseNumber);
        this.setControlValue('PremiseName', data.PremiseName);
        this.serviceCoverSearchParams.PremiseNumber = data.PremiseNumber;
        this.serviceCoverSearchParams.PremiseName = data.PremiseName;
        this.toggleServiceAndProductSearch();
    }

    public setProductCode(data: any): void {
        this.setControlValue('ProductCode', data.ProductCode);
        this.setControlValue('ProductDesc', data.ProductDesc);
        this.toggleServiceAndProductSearch();
    }

    public setBranchServiceArea(event: any): void {
        this.setControlValue('BranchServiceAreaCode', event.BranchServiceAreaCode);
        this.setControlValue('BranchServiceAreaDesc', event.BranchServiceAreaDesc);
    }
}
