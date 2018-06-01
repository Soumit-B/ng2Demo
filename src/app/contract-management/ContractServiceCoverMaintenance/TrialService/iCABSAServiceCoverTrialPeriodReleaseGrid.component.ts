
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { RiExchange } from './../../../../shared/services/riExchange';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from './../../../base/BaseComponent';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../../shared/constants/message.constant';

import { GridAdvancedComponent } from './../../../../shared/components/grid-advanced/grid-advanced';
import { PaginationComponent } from './../../../../shared/components/pagination/pagination';
import { EllipsisComponent } from './../../../../shared/components/ellipsis/ellipsis';
import { PremiseSearchComponent } from './../../../internal/search/iCABSAPremiseSearch';
import { ServiceCoverSearchComponent } from './../../../internal/search/iCABSAServiceCoverSearch';
import { ContractSearchComponent } from './../../../internal/search/iCABSAContractSearch';
import { SalesAreaSearchComponent } from './../../../internal/search/iCABSBSalesAreaSearch.component';
import { BranchServiceAreaSearchComponent } from './../../../internal/search/iCABSBBranchServiceAreaSearch';
import { QueryParametersCallback, ErrorCallback, MessageCallback } from '../../../base/Callback';
import { InternalMaintenanceServiceModuleRoutes, InternalMaintenanceApplicationModuleRoutes, InternalMaintenanceSalesModuleRoutes } from './../../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAServiceCoverTrialPeriodReleaseGrid.html'
})

export class TrialPeriodReleaseGridComponent extends BaseComponent implements OnInit, OnDestroy, QueryParametersCallback, ErrorCallback, MessageCallback {
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('riGridPagination') riGridPagination: PaginationComponent;

    @ViewChild('contractNumberEllipsis') contractNumberEllipsis: EllipsisComponent;
    @ViewChild('premisesNumberEllipsis') premisesNumberEllipsis: EllipsisComponent;
    @ViewChild('productcodeEllipsis') productcodeEllipsis: EllipsisComponent;
    @ViewChild('salesarecodeEllipsis') salesarecodeEllipsis: EllipsisComponent;
    @ViewChild('branchserviceareacodeEllipsis') branchserviceareacodeEllipsis: EllipsisComponent;

    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;

    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverTrialPeriodReleaseGrid',
        module: 'contract-admin',
        method: 'contract-management/maintenance',
        ActionSearch: '0',
        Actionupdate: '6',
        ActionEdit: '2',
        ActionDelete: '3'
    };

    // message Modal popup
    public messageTitle: string;
    public messageContent: string;
    public showMessageHeader: boolean = true;

    // message Modal popup
    public errorTitle: string;
    public errorContent: string;
    public showErrorHeader: boolean = true;

    // prompt Modal variables
    public promptTitle: string = '';
    public promptContent: string = '';
    public contractData: Object = {};

    // local variables
    public backLinkText: string = '';
    public showBackLabel: boolean = false;
    public currentContractType: string;
    public currentContractTypeLabel: string;
    public tdStartLabel: string;
    public tdEndLabel: string;
    public tdButtonsDisplay: boolean = false;
    public tdUnplannedWEDLab: boolean;
    public tdUnplannedNoOfExchangesLab: boolean;
    public blnRefreshRequired: boolean = true;
    public ishidden: boolean = false;
    public buttonTitle: string = 'Hide Filters';
    public todayDate = new Date();
    public routeParams: any = {};
    public postData: any = {};
    public Date: Date = new Date();
    public ToDate: Date = new Date();
    public FromDate: Date = new Date();
    public dtNewFromDate: any;
    public dtNewToDate: any;

    // Grid Component Variables
    public pageId: string;
    public pageSize: number = 10;
    public currentPage: number = 1;
    public totalItems: number = 0;
    public gridSortHeaders: Array<any>;
    public headerClicked: string = '';
    public sortType: string = 'ASC';
    public selectedRow: any = -1;
    public grdServiceCover: any = {};
    public dateReadOnly: boolean = false;

    public search = new URLSearchParams();

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    // inputParams for BranchServiceAreaCode_onkeydown
    public ellipsis: any = {};

    public ShowTypeList: Array<any> = [
        { title: 'All', value: 'All', selected: 'selected' },
        { title: 'Outstanding', value: 'Outstanding' },
        { title: 'Accepted', value: 'Accepted' },
        { title: 'Rejected', value: 'Rejected' },
        { title: 'Action Required', value: 'Pending' }
    ];

    // Legend
    public legend = [
        { label: 'Accepted', color: '#CCFFCC' },
        { label: 'Rejected', color: '#FFCCCC' },
        { label: 'Action Required', color: '#FDFDCD' }
    ];

    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }, //Returned form Lookup 2
        { name: 'ShowType', readonly: false, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: false, disabled: false, required: false, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }, //Returned form Lookup 2
        { name: 'SalesAreaCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'SalesAreaDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }, //Returned form Lookup 2
        { name: 'BranchServiceAreaCode', readonly: false, disabled: false, type: MntConst.eTypeCode, required: false },
        { name: 'BranchServiceAreaDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }, //Returned form Lookup 2
        { name: 'ProductCode', readonly: false, disabled: false, required: false, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText }, //Returned form Lookup 2
        { name: 'DateFrom', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        { name: 'DateTo', readonly: true, disabled: false, required: true, type: MntConst.eTypeDate },
        // hidden
        { name: 'ServiceCover', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'ServiceCoverRowID', readonly: true, disabled: false, required: false, type: MntConst.eTypeText },
        { name: 'TrialEnd', readonly: true, disabled: false, required: false, type: MntConst.eTypeText }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERTRIALPERIODRELEASEGRID;
        this.setCurrentContractType();
        this.setErrorCallback(this);
        this.setMessageCallback(this);
        this.setURLQueryParameters(this);
    }

    public setCurrentContractType(): void {
        this.pageParams.currentContractType =
            this.utils.getCurrentContractType(this.pageParams.CurrentContractTypeURLParameter);
        this.pageParams.currentContractTypeLabel =
            this.utils.getCurrentContractLabel(this.pageParams.currentContractType);
    }

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data, title: 'Message' }, false);
    }

    public showErrorModal(data: any): void {
        this.errorModal.show(data, true);
    }

    public getURLQueryParameters(param: any): void {
        this.routeParams.ParentMode = param['parentMode'];
        this.routeParams.CurrentContractTypeURLParameter = param['CurrentContractTypeURLParameter'];
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Trial Period Confirmation';
        this.utils.setTitle(this.pageTitle);

        this.ellipsis = {
            contract: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
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
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'ContractName': this.getControlValue('ContractName'),
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
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
            product: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp-Freq',
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'ContractName': this.getControlValue('ContractName'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'PremiseName': this.getControlValue('PremiseName'),
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
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
            branchServiceAreaCode: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: BranchServiceAreaSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            },
            salesAreaCode: {
                autoOpen: false,
                showCloseButton: true,
                childConfigParams: {
                    'parentMode': 'LookUp',
                    'currentContractType': this.riExchange.getCurrentContractType(),
                    'currentContractTypeURLParameter': this.riExchange.getCurrentContractTypeLabel()
                },
                modalConfig: {
                    backdrop: 'static',
                    keyboard: true
                },
                contentComponent: SalesAreaSearchComponent,
                showHeader: true,
                searchModalRoute: '',
                disabled: false
            }
        };

        this.ToDate = new Date();
        this.FromDate = new Date(new Date().getFullYear(), 0, 1);
        if (this.isReturning()) {
            let getFromDate: any = this.globalize.parseDateToFixedFormat(this.formData.DateFrom);
            this.dtNewFromDate = this.globalize.parseDateStringToDate(getFromDate);

            let getToDate: any = this.globalize.parseDateToFixedFormat(this.formData.DateTo);
            this.dtNewToDate = this.globalize.parseDateStringToDate(getToDate);

            this.populateUIFromFormData();
            this.buildGrid();
        } else {
            this.window_onload();
        }
    }
    public window_onload(): void {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();

        this.renderPage();

        this.GetDateMessageStrings();
        this.buildGrid();
    }

    public renderPage(): void {
        //this.riExchange.renderForm(this.uiForm, this.controls);

        //To Date
        this.Date = new Date();
        this.dtNewToDate = this.Date;
        this.setControlValue('DateTo', this.myDateFormat(this.Date));

        //From Date
        this.Date = this.FromDate;
        this.dtNewFromDate = this.Date;
        this.setControlValue('DateFrom', this.myDateFormat(this.Date));

        this.setControlValue('ShowType', 'All');

        this.formData.ServiceCover = '';
        this.formData.ServiceCoverRowID = '';
        this.formData.TrialEnd = '';

        this.setControlValue('ServiceCover', this.formData.ServiceCover);
        this.setControlValue('ServiceCoverRowID', this.attributes.ServiceCoverRowID);
        this.setControlValue('TrialEnd', this.formData.TrialEnd);
    }

    public myDateFormat(getDate: any): any {
        getDate = this.globalize.parseDateToFixedFormat(getDate);
        return this.globalize.parseDateStringToDate(getDate);
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ContractNumber', 'ServiceCover', 'ContractNumber', MntConst.eTypeCode, 11, true);
        this.riGrid.AddColumn('PremiseNumber', 'ServiceCover', 'PremiseNumber', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumn('PremiseName', 'ServiceCover', 'PremiseName', MntConst.eTypeText, 20, false);
        this.riGrid.AddColumn('SalesAreaCode', 'ServiceCover', 'SalesAreaCode', MntConst.eTypeText, 20, false);
        this.riGrid.AddColumn('BranchServiceAreaCode', 'ServiceCover', 'BranchServiceAreaCode', MntConst.eTypeText, 20, false);
        this.riGrid.AddColumn('Postcode', 'ServiceCover', 'Postcode', MntConst.eTypeCode, 8, false);
        this.riGrid.AddColumn('ProductCode', 'ServiceCover', 'ProductCode', MntConst.eTypeCode, 10, true);
        this.riGrid.AddColumn('ServiceVisitFrequency', 'ServiceCover', 'ServiceVisitFrequency', MntConst.eTypeInteger, 5, false);
        this.riGrid.AddColumn('TrialCommenceDate', 'ServiceCover', 'TrialCommenceDate', MntConst.eTypeDate, 10, false);
        this.riGrid.AddColumn('TrialChargeValue', 'ServiceCover', 'TrialChargeValue', MntConst.eTypeCurrency, 10, false);
        this.riGrid.AddColumn('ProposedAnnualValue', 'ServiceCover', 'ProposedAnnualValue', MntConst.eTypeCurrency, 10, false);
        this.riGrid.AddColumn('AnnualValue', 'ServiceCover', 'AnnualValue', MntConst.eTypeCurrency, 10, false);
        this.riGrid.AddColumn('TrialEndDate', 'ServiceCover', 'TrialEndDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('AcceptTrial', 'ServiceCover', 'AcceptTrial', MntConst.eTypeImage, 3);
        this.riGrid.AddColumn('RejectTrial', 'ServiceCover', 'RejectTrial', MntConst.eTypeImage, 3);

        this.riGrid.AddColumnAlign('ContractNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('SalesAreaCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('BranchServiceAreaCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('Postcode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('TrialCommenceDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('TrialChargeValue', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ProposedAnnualValue', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('AnnualValue', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('TrialEndDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('AcceptTrial', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('RejectTrial', MntConst.eAlignmentCenter);

        this.riGrid.AddColumnOrderable('ContractNumber', true);
        this.riGrid.AddColumnOrderable('PremiseName', true);
        this.riGrid.AddColumnOrderable('SalesAreaCode', true);
        this.riGrid.AddColumnOrderable('BranchServiceAreaCode', true);
        this.riGrid.AddColumnOrderable('ProductCode', true);
        this.riGrid.AddColumnOrderable('TrialCommenceDate', true);
        this.riGrid.AddColumnOrderable('TrialChargeValue', true);
        this.riGrid.AddColumnOrderable('TrialEndDate', true);

        this.riGrid.Complete();
    }

    public riGrid_BeforeExecute(): void {
        this.search = new URLSearchParams();
        this.search.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        this.search.set(this.serviceConstants.BusinessCode, this.businessCode()); //this.businessCode
        this.search.set(this.serviceConstants.CountryCode, this.countryCode());

        // set parameters
        if (this.getControlValue('DateFrom')) {
            this.search.set('DateFrom', this.getControlValue('DateFrom'));
        }
        if (this.getControlValue('DateTo')) {
            this.search.set('DateTo', this.getControlValue('DateTo'));
        }
        this.search.set('BranchNumber', this.utils.getBranchCode());
        if (this.getControlValue('ContractNumber')) {
            this.search.set('ContractNumber', this.getControlValue('ContractNumber'));
        } else {
            this.search.set('ContractNumber', '');
        }
        if (this.getControlValue('PremiseNumber')) {
            this.search.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        } else {
            this.search.set('PremiseNumber', '');
        }
        if (this.getControlValue('SalesAreaCode')) {
            this.search.set('SalesAreaCode', this.getControlValue('SalesAreaCode'));
        } else {
            this.search.set('SalesAreaCode', '');
        }
        if (this.getControlValue('BranchServiceAreaCode')) {
            this.search.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        } else {
            this.search.set('BranchServiceAreaCode', '');
        }
        if (this.getControlValue('ProductCode')) {
            this.search.set('ProductCode', this.getControlValue('ProductCode'));
        } else {
            this.search.set('ProductCode', '');
        }
        if (this.getControlValue('ShowType')) {
            this.search.set('ShowType', this.getControlValue('ShowType'));
        } else {
            this.search.set('ShowType', 'All');
        }
        if (this.attributes.ServiceCoverRowID) {
            this.search.set('ServiceCoverRowID', this.attributes.ServiceCoverRowID);
        } else {
            this.search.set('ServiceCoverRowID', this.getControlValue('ServiceCoverRowID'));
        }

        // set grid building parameters
        this.search.set(this.serviceConstants.PageSize, this.pageSize.toString());
        this.search.set(this.serviceConstants.PageCurrent, this.currentPage.toString());
        this.search.set(this.serviceConstants.GridMode, '0');
        this.search.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        this.search.set(this.serviceConstants.GridCacheRefresh, 'true');
        this.search.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        let sortOrder = 'Descending';
        if (!this.riGrid.DescendingSort) {
            sortOrder = 'Ascending';
        }
        this.search.set(this.serviceConstants.GridSortOrder, sortOrder);
        this.queryParams.search = this.search;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.queryParams.search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.showErrorModal(data);
                } else {
                    if (this.riGrid.Update) {
                        this.riGrid.StartRow = this.getAttribute('Row');
                        this.riGrid.StartColumn = 0;
                        this.riGrid.RowID = this.getAttribute('ServiceCoverRowID');

                        this.riGrid.UpdateHeader = false;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                    }
                    // this.totalRecords = data.pageData.pageNumber;
                    this.currentPage = data.pageData ? data.pageData.pageNumber : 1;
                    this.totalItems = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError(error);
            });

    }

    public sortGridInfo(data: any): void {
        this.headerClicked = data.fieldname;
        this.sortType = data.sort === 'DESC' ? 'Descending' : 'Ascending';
        this.riGrid_onRefresh();
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public riGrid_BodyOnKeyDown(event: any): void {
        let totalRowCount = this.riGrid.HTMLGridBody.children.length;
        switch (event.KeyCode) {
            case 38: //'Up Arror
                event.returnValue = 0;
                if ((this.riGrid.CurrentRow > 0)) {
                    this.ServiceCoverFocus(this.riGrid.CurrentHTMLRow.previousSibling.children[this.riGrid.CurrentCell].children[0]);
                }
                break;
            case 40:
            case 9: //'Down Arror Or Tab
                event.returnValue = 0;
                if ((this.riGrid.CurrentRow >= 0) && (this.riGrid.CurrentRow < totalRowCount - 3)) {
                    this.ServiceCoverFocus(this.riGrid.CurrentHTMLRow.NextSibling.children[this.riGrid.CurrentCell].children[0]);
                }
                break;
            default:
                break;
        }
    }

    public riGrid_BodyOnDblClick(event: any): void {
        this.ServiceCoverFocus(event.srcElement);
        this.pageParams.CurrentContractTypeURLParameter = this.routeParams.CurrentContractTypeURLParameter;
        switch (this.riGrid.CurrentColumnName) {
            case 'ContractNumber':
                this.navigate('Release', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                    'ContractRowID': this.attributes.ContractRowID,
                    'ContractTypeCode': this.pageParams.currentContractType,
                    'currentContractType': this.pageParams.currentContractType
                }); // navigate to Application/iCABSAContractMaintenance.htm;
                break;
            case 'PremiseNumber':
                this.navigate('Release', this.ContractManagementModuleRoutes.ICABSAPREMISEMAINTENANCE, {
                    'PremiseRowID': this.attributes.PremiseRowID,
                    'ContractTypeCode': this.pageParams.currentContractType
                }); // navigate to Application/iCABSAPremiseMaintenance.htm
                break;
            case 'ProductCode':
                this.navigate('Release', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    'ServiceCoverRowID': this.attributes.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType
                });  // navigate to Application/iCABSAServiceCoverMaintenance.htm<maxwidth>;
                break;
            case 'VisitTypeCode':
                this.navigate('Release', InternalMaintenanceServiceModuleRoutes.ICABSSESERVICEVISITMAINTENANCE, {
                    'ServiceVisitRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType
                }); // Navigate to Service/iCABSSeServiceVisitMaintenance.htm
                break;
            case 'TrialCommenceDate':
                this.navigate('Release', InternalMaintenanceApplicationModuleRoutes.ICABSASERVICECOVERCOMMENCEDATEMAINTENANCEEX, {
                    'ServiceVisitRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType,
                    'ContractNumber': this.attributes.ContractNumber,
                    'PremiseNumber': this.attributes.PremiseNumber,
                    'ProductCode': this.attributes.ProductCode
                }); // navigate Application/iCABSAServiceCoverCommenceDateMaintenance.htm
                break;
            case 'ContractCommenceDate':
                this.navigate('Release', InternalMaintenanceSalesModuleRoutes.ICABSACONTRACTCOMMENCEDATEMAINTENANCE, {
                    'ServiceVisitRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType,
                    'ContractNumber': this.attributes.ContractNumber
                }); // navigate Application/iCABSAContractCommenceDateMaintenance.htm
                break;
            case 'TrialEndDate':
                this.navigate('TrialPeriod', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    'ServiceCoverRowID': this.attributes.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType
                }); // Navigate to Application/iCABSAServiceCoverMaintenance.htm<maxwidth>
                break;
            case 'AcceptTrial':
                this.navigate('Release', InternalMaintenanceApplicationModuleRoutes.ICABSATRIALPERIODRELEASEMAINTENANCE, {
                    'ServiceVisitRowID': this.formData.ServiceCoverRowID,
                    'currentContractType': this.pageParams.currentContractType,
                    'ContractNumber': this.attributes.ContractNumber,
                    'PremiseNumber': this.attributes.PremiseNumber,
                    'ProductCode': this.attributes.ProductCode
                });
                break;
            case 'RejectTrial':
                // Create ClientRetention record to Delete/Terminate ServiceCover
                this.GetLostBusinessRequestRowID();
                break;
            default:
                break;
        }
    } // End of getGridOnDblClick

    public getCurrentPage(event: any): void {
        this.selectedRow = -1;
        this.currentPage = event.value;
        this.riGrid_onRefresh();
    }

    public riGrid_onRefresh(): void {
        if (this.currentPage <= 0) {
            this.currentPage = 1;
        }
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public ServiceCoverFocus(rsrcElement: any): void {
        let oTR;
        oTR = this.riGrid.CurrentHTMLRow;
        rsrcElement.focus();
        // '#39748 add in SalesArea and BranchServiceArea pcliu 21/08/2009
        // 'changed ContractNumber.setAttribute  "ServiceCoverRowID", oTR.children(4).children(0).RowID to ContractNumber.setAttribute  "ServiceCoverRowID", oTR.children(6).children(0).RowID
        // 'changed this.setAttribute( 'ServiceCoverRowID', oTR.children(4).children[0].RowID to this.setAttribute( 'ServiceCoverRowID', oTR.children[6].children[0].RowID

        this.setAttribute('Row', this.riGrid.CurrentRow);
        this.setAttribute('ContractRowID', oTR.children[0].children[0].children[0].getAttribute('rowid'));
        this.setAttribute('ContractNumber', oTR.children[0].children[0].children[0].value);
        this.setAttribute('PremiseRowID', oTR.children[1].children[0].children[0].getAttribute('rowid'));
        this.setAttribute('PremiseNumber', oTR.children[1].children[0].children[0].value);
        // ' this.setAttribute(  'ServiceCoverRowID', oTR.children(4).children[0].RowID
        this.setAttribute('ServiceCoverRowID', oTR.children[6].children[0].children[0].getAttribute('rowid'));
        this.setAttribute('ProductCode', oTR.children[6].children[0].children[0].value);
        this.setControlValue('ServiceCoverRowID', oTR.children[6].children[0].children[0].getAttribute('rowid'));
        this.setControlValue('Row', this.riGrid.CurrentRow);
        this.setControlValue('TrialEnd', oTR.children[0].children[0].AdditionalProperty);  //' #14199
    }

    public riGrid_BodyOnClick(): void {
        let MsgResult;
        // 'msgbox event.srcElement.Name
        if (this.riGrid.CurrentColumnName === 'Unsuspend') {
            this.ServiceCoverFocus(event.srcElement);
            // 'Prompt the user if they should change the service commence date
            if (this.riGrid.Details.GetValue('TrialCommenceDate') !== this.riGrid.Details.GetValue('ServiceDateStart')) {
                this.promptTitle = this.pageParams.MsgDateTitle;
                this.promptContent = this.pageParams.MsgDateText;
                this.promptModal.show();
            }
            // 'MSA QRS1413 14/12/2004 - Should not just update, need to refresh, otherwise user can change contract commence date
            // 'when 2 or more service covers for the same contract are on the grid at the same time.
            this.riGrid.Update = true;
            this.riGrid_BeforeExecute();
        }
    }

    public promptSave(event: any): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.postData.Function = 'Unsuspend';
        this.postData.ServiceVisitRowID = this.attributes.ServiceCoverRowID;

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, this.postData)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    this.errorService.emitError(e);
                } else {
                    this.riGrid_onRefresh();
                }
            },
            (error) => {
                this.errorService.emitError(error);
            });
    }

    public GetDateMessageStrings(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        query.set('Function', 'GetDateString');
        query.set('DTE', '');
        query.set('TME', '');

        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorService.emitError(data);
                } else {
                    this.pageParams.MsgDateText = data.MessageText;
                    this.pageParams.MsgDateTitle = data.MessageTitle;
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
    }

    public GetLostBusinessRequestRowID(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionSearch);
        //set parameters
        this.postData.Function = 'GetLostBusinessRequestRowID';
        this.postData.ServiceCoverRowID = this.attributes.ServiceCoverRowID;

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, this.postData)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.errorContent = data.errorMessage || data.fullError;
                    this.errorService.emitError(data);
                } else {
                    this.formData.LostBusinessRequestRowID = data.LostBusinessRequestRowID;
                    this.messageTitle = MessageConstant.Message.PageNotCovered;
                    this.messageContent = MessageConstant.Message.PageNotCovered;
                    this.showMessageModal(this.messageContent);
                    //this.navigate('TrialPeriod', ''); // TODO:  navigate Application/iCABSALostBusinessContactMaintenance.htm
                    // this.navigate('TrialPeriod', '', {
                    //     'parentMode': 'TrialPeriod',
                    //     'ContractNumber': this.getControlValue('ContractNumber'),
                    //     'ServiceCoverRowID': this.attributes.ServiceCoverRowID,
                    //     'currentContractType': this.pageParams.currentContractType
                    // });
                }
            },
            (error) => {
                this.errorService.emitError(error);
            }
            );
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('DateFrom', value.value);
        }
    }

    public dateToSelectedValue(value: any): void {
        if (value && value.value) {
            this.setControlValue('DateTo', value.value);
        }
    }

    public ContractNumber_onchange(obj: any, call: boolean): void {
        if (call) {
            if (obj.ContractNumber) {
                this.setControlValue('ContractNumber', obj.ContractNumber);
            }
            if (obj.ContractName) {
                this.setControlValue('ContractName', obj.ContractName);
            }
        }
        let paddedValue = this.utils.numberPadding(this.getControlValue('ContractNumber'), 8);
        this.setControlValue('ContractNumber', paddedValue);

        this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName');

        this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
        this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName');
    }

    public PremiseNumber_onchange(obj: any, call: boolean): void {
        if (call) {
            if (obj.PremiseNumber) {
                this.setControlValue('PremiseNumber', obj.PremiseNumber);
            }
            if (obj.PremiseName) {
                this.setControlValue('PremiseName', obj.PremiseName);
            }

            this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
            this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName');
        }
    }

    public SalesAreaCode_onchange(obj: any, call: boolean): void {
        if (call) {
            if (obj.SalesAreaCode) {
                this.setControlValue('SalesAreaCode', obj.SalesAreaCode);
            }
            if (obj.SalesAreaDesc) {
                this.setControlValue('SalesAreaDesc', obj.SalesAreaDesc);
            }
        }
    }

    public BranchServiceAreaCode_onchange(obj: any, call: boolean): void {
        if (call) {
            if (obj.BranchServiceAreaCode) {
                this.setControlValue('BranchServiceAreaCode', obj.BranchServiceAreaCode);
            }
            if (obj.BranchServiceAreaDesc) {
                this.setControlValue('BranchServiceAreaDesc', obj.BranchServiceAreaDesc);
            }
        }
    }

    public ProductCode_onchange(obj: any, call: boolean): void {
        if (call) {
            if (obj.ProductCode) {
                this.setControlValue('ProductCode', obj.ProductCode);
            }
            if (obj.ProductDesc) {
                this.setControlValue('ProductDesc', obj.ProductDesc);
            }
        }
    }

    public populateData_onkeydown(event: any, byval: number): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, this.queryParams.ActionEdit);
        query.set(this.serviceConstants.BusinessCode, this.businessCode());
        query.set(this.serviceConstants.CountryCode, this.countryCode());
        //set parameters
        this.postData.Function = 'GetDescriptions';
        this.postData.BranchNumber = this.utils.getBranchCode();
        if (event.target.value) {
            if (byval === 1) {
                let paddedValue = this.utils.numberPadding(this.getControlValue('ContractNumber'), 8);
                this.setControlValue('ContractNumber', paddedValue);
            }
            if (this.getControlValue('ContractNumber')) {
                this.postData.ContractNumber = this.getControlValue('ContractNumber');
            }

            if (this.getControlValue('PremiseNumber')) {
                this.postData.PremiseNumber = this.getControlValue('PremiseNumber');
            }

            if (this.getControlValue('SalesAreaCode')) {
                this.postData.SalesAreaCode = this.getControlValue('SalesAreaCode');
            }

            if (this.getControlValue('BranchServiceAreaCode')) {
                this.postData.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
            }

            if (this.getControlValue('ProductCode')) {
                this.postData.ProductCode = this.getControlValue('ProductCode');
            }

            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query, this.postData)
                .subscribe(
                (data) => {
                    if (data.hasError) {
                        this.errorContent = data.errorMessage || data.fullError;
                        this.errorService.emitError(this.errorContent);
                    } else {
                        if (byval === 1) {
                            if (data.ContractName) {
                                this.setControlValue('ContractName', data.ContractName);
                            } else {
                                this.setControlValue('ContractNumber', '');
                                this.setControlValue('ContractName', '');
                            }
                        }
                        if (byval === 2) {
                            if (data.PremiseName) {
                                this.setControlValue('PremiseName', data.PremiseName);
                            } else {
                                this.setControlValue('PremiseNumber', '');
                                this.setControlValue('PremiseName', '');
                            }
                        }
                        if (byval === 3) {
                            if (data.SalesAreaDesc) {
                                this.setControlValue('SalesAreaDesc', data.SalesAreaDesc);
                            } else {
                                this.setControlValue('SalesAreaCode', '');
                                this.setControlValue('SalesAreaDesc', '');
                            }
                        }
                        if (byval === 4) {
                            if (data.BranchServiceAreaDesc) {
                                this.setControlValue('BranchServiceAreaDesc', data.BranchServiceAreaDesc);
                            } else {
                                this.setControlValue('BranchServiceAreaCode', '');
                                this.setControlValue('BranchServiceAreaDesc', '');
                            }
                        }
                        if (byval === 5) {
                            if (data.ProductDesc) {
                                this.setControlValue('ProductDesc', data.ProductDesc);
                            } else {
                                this.setControlValue('ProductCode', '');
                                this.setControlValue('ProductDesc', '');
                            }
                        }

                        this.ellipsis.premises.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') || '';
                        this.ellipsis.premises.childConfigParams.ContractName = this.getControlValue('ContractName') || '';

                        this.ellipsis.product.childConfigParams.ContractNumber = this.getControlValue('ContractNumber') || '';
                        this.ellipsis.product.childConfigParams.ContractName = this.getControlValue('ContractName') || '';
                        this.ellipsis.product.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber') || '';
                        this.ellipsis.product.childConfigParams.PremiseName = this.getControlValue('PremiseName') || '';
                    }
                },
                (error) => {
                    this.errorService.emitError(error);
                });
        }
    }


}
