import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
@Component({
    templateUrl: 'iCABSAServiceVisitDetailSummary.html'
})
export class ServiceVisitDetailSummaryComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('servicevisitdetailGrid') servicevisitdetailGrid: GridComponent;
    @ViewChild('servicevisitdetailPagination') servicevisitdetailPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    public queryParams: any = {
        operation: 'Application/iCABSAServiceVisitDetailSummary',
        module: 'service',
        method: 'service-delivery/maintenance'
    };

    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'ContractName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', readonly: true, disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', readonly: true, disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', readonly: true, disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ServiceVisitFrequency', readonly: true, disabled: true, required: false, type: MntConst.eTypeInteger },
        { name: 'ServiceVisitAnnivDate', readonly: true, disabled: true, required: false, type: MntConst.eTypeDate },
        { name: 'ServiceDateStart', readonly: true, disabled: true, required: true, type: MntConst.eTypeDate },
        { name: 'ServiceDateEnd', readonly: true, disabled: true, required: true, type: MntConst.eTypeDate },
        { name: 'SharedVisitInd', readonly: true, disabled: true, required: false, type: MntConst.eTypeCheckBox },
        { name: 'VisitTypeCode', readonly: true, disabled: true, required: false, type: MntConst.eTypeCode },
        { name: 'ServiceVisitRowID', readonly: true, disabled: true, required: false },
        { name: 'Menu', readonly: false, disabled: false, required: false, value: '' }
    ];
    public postObject: any;
    public ServiceDateStart: Date = new Date();
    public dtServiceVisitAnnivDate: Date = new Date();
    public dtServiceDateStart: Date = new Date();
    public dtServiceDateEnd: Date = new Date();
    public ServiceDateEnd: Date = new Date();
    public ServiceVisitAnnivDate: Date = new Date();
    public ServiceVisitAnnivDateString: any;
    public ServiceVisitAnnivDateStringupdate: any;
    public SCEnableVisitDurations: any;
    public SCEnableVisitCostings: any;
    public strPremiseTitle: any;
    public strServiceTitle: any;
    public SCEnableVisitRef: any;
    public blnUpdated: any;
    public vbEnableDetailLocations: any;
    public CurrentContractTypeLabel: any;
    public menudisplay: boolean = true;
    public mode: any;
    public showCloseButton: boolean = true;
    public showErrorHeader: boolean = true;
    public showHeader: boolean = true;
    public rowId = '';
    public pageId: string = '';
    public search: any = this.getURLSearchParamObject();
    public searchGet: any;

    public isRequesting: boolean = false;
    public curPage: number = 1;
    public totalRecords: number;
    public pageSize: number = 10;

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICEVISITDETAILSUMMARY;
        this.browserTitle = 'Service Visit Detail';
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.getSysCharDtetails();

    }

    public windowOnload(): void {
        this.riGrid.PageSize = this.pageSize;
        this.riGrid.FunctionUpdateSupport = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = true;

        this.ServiceVisitAnnivDateString = this.utils.formatDate(this.ServiceVisitAnnivDate);
        this.vbEnableDetailLocations = 'False';
        if (this.pageParams.vSCEnableDetailLocations) {
            this.vbEnableDetailLocations = 'True';
        }
        this.attributes.CurrentContractType = this.riExchange.setCurrentContractType();
        this.SetVBVariables();
        this.CurrentContractTypeLabel = this.utils.getCurrentContractLabel(this.attributes.CurrentContractType);
        if (this.parentMode === 'Summary') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', this.riExchange.getParentHTMLValue('ServiceVisitFrequency'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitAnnivDate', this.riExchange.getParentHTMLValue('ServiceVisitAnnivDate'));
            if (this.riExchange.getParentAttributeValue('ContractNumberServiceVisitRowID')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentAttributeValue('ContractNumberServiceVisitRowID'));
            } else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentHTMLValue('ContractNumberServiceVisitRowID'));
            }
        }
        if (this.parentMode === 'ServiceVisit') {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', this.riExchange.getParentHTMLValue('PremiseName'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', this.riExchange.getParentHTMLValue('ServiceVisitFrequency'));
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitAnnivDate', this.riExchange.getParentHTMLValue('ServiceVisitAnnivDate'));

            if (this.riExchange.GetParentRowID(this.uiForm, 'ServiceVisit')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.GetParentRowID(this.uiForm, 'ServiceVisit'));
            } else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentHTMLValue('ServiceVisit'));
            }
        }
        if (this.parentMode === 'GeneralSearchInfo') {
            this.menudisplay = false;
            if (this.riExchange.getParentAttributeValue('riGridSystemInvoiceNumber')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentAttributeValue('riGridSystemInvoiceNumber'));
            } else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentHTMLValue('riGridSystemInvoiceNumber'));
            }


        }
        if (this.parentMode === 'VisitDetail') {
            if (this.riExchange.getParentAttributeValue('grdGroupServiceVisitSystemInvoiceNumber')) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentAttributeValue('grdGroupServiceVisitSystemInvoiceNumber'));
            } else {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitRowID', this.riExchange.getParentHTMLValue('grdGroupServiceVisitSystemInvoiceNumber'));
            }
        }
        this.populateDescriptions();
        this.buildGrid();
        this.riGrid_BeforeExecute();
        this.blnUpdated = false;

    }

    public SetVBVariables(): void {
        this.SCEnableVisitDurations = 'True';
        this.SCEnableVisitCostings = 'True';
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableLocations];
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
            this.pageParams.vSCEnableDetailLocations = record[0]['Logical'];
            this.windowOnload();
        });
    }

    public getCurrentPage(currentPage: any): void {
        if (this.riGrid.Mode === MntConst.eModeUpdate) {
            return;
        } else {
            this.curPage = currentPage.value;
            this.riGrid.UpdateHeader = true;
            this.riGrid.UpdateRow = true;
            this.riGrid.UpdateFooter = true;
            this.riGrid_BeforeExecute();
        }

    }

    public refresh(): void {
        if (this.riGrid.Mode === MntConst.eModeUpdate) {
            return;
        } else {
            this.riGrid.RefreshRequired();
            this.riGrid_BeforeExecute();
        }
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('ServiceVisitDetailDate', 'ServiceVisitDetail', 'ServiceVisitDetailDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ServiceVisitDetailTimeStart', 'ServiceVisitDetail', 'ServiceVisitDetailTimeStart', MntConst.eTypeTime, 5);
        this.riGrid.AddColumn('ServiceVisitDetailTimeEnd', 'ServiceVisitDetail', 'ServiceVisitDetailTimeEnd', MntConst.eTypeTime, 5);
        this.riGrid.AddColumn('ChangeProcessDate', 'ServiceVisitDetail', 'ChangeProcessDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumn('ServicedQuantity', 'ServiceVisitDetail', 'ServicedQuantity', MntConst.eTypeInteger, 5);
        this.riGrid.AddColumn('EmployeeCode', 'ServiceVisitDetail', 'EmployeeCode', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('ServiceVisitDetailDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceVisitDetailTimeStart', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServiceVisitDetailTimeEnd', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ChangeProcessDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('ServicedQuantity', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnAlign('EmployeeCode', MntConst.eAlignmentLeft);

        if (this.SCEnableVisitDurations) {

            this.riGrid.AddColumn('StandardDuration', 'ServiceVisitDetail', 'StandardDuration', MntConst.eTypeTime, 5);
            this.riGrid.AddColumn('OvertimeDuration', 'ServiceVisitDetail', 'OvertimeDuration', MntConst.eTypeTime, 5);
            this.riGrid.AddColumnAlign('StandardDuration', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnAlign('OvertimeDuration', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnUpdateSupport('OvertimeDuration', true);
            this.riGrid.AddColumnUpdateSupport('ServiceVisitDetailTimeStart', true);
            this.riGrid.AddColumnUpdateSupport('ServiceVisitDetailTimeEnd', true);
        }

        if (this.SCEnableVisitCostings) {

            this.riGrid.AddColumn('ServiceVisitCost', 'ServiceVisitDetail', 'ServiceVisitCost', MntConst.eTypeCurrency, 10);
            this.riGrid.AddColumn('TotalCost', 'ServiceVisitDetail', 'TotalCost', MntConst.eTypeCurrency, 10);
            this.riGrid.AddColumnAlign('ServiceVisitCost', MntConst.eAlignmentRight);
            this.riGrid.AddColumnAlign('TotalCost', MntConst.eAlignmentRight);
        }

        this.riGrid.Complete();
    }
    private riGrid_BeforeExecute(): void {

        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('ServiceVisitRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID'));
        gridParams.set('ServiceVisitDetailRowID', this.attributes.ContractNumberServiceVisitDetailRowID);
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, '1246324');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('riSortOrder', 'Descending');
        gridParams.set('HeaderClickedColumn', '');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
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

    public riGrid_AfterExecute(): void {
        this.riGrid.RefreshRequired();
        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
    }

    public riGrid_BodyOnClick(event: any): void {
        this.serviceVisitDetailFocus(event.srcElement);
    }

    public riGrid_BodyOnDblClick(event: any): void {
        switch (this.riGrid.CurrentColumnName) {
            case 'ServiceVisitDetailDate':
                this.mode = 'ViewOnly';
                break;
            default:
                this.mode = 'Update';
        }
        this.messageModal.show({ msg: 'Service/iCABSSeServiceVisitDetailMaintenance - Page not developed', title: '' }, false);
        // this.navigate(this.mode, 'Service/iCABSSeServiceVisitDetailMaintenance');
    }

    private serviceVisitDetailFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement;
        this.attributes.ContractNumberServiceVisitDetailRowID = oTR.children[0].children[0].children[0].getAttribute('rowid');
    }

    public riGrid_BodyOnKeyDown(event: any): void {
        switch (event.keyCode) {
            case 38:
                event.returnValue = 0;
                if (event.srcElement.parentElement.parentElement.parentElement.previousSibling) {
                    if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children) {
                        if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex]) {
                            if (event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]) {
                                this.serviceVisitDetailFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
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
                                this.serviceVisitDetailFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
        }
    }

    public riGrid_OnBlur(event: any): void {
        this.attributes.ContractNumberServiceVisitDetailRowID = this.riGrid.Details.GetAttribute('ServiceVisitDetailDate', 'rowid');
        this.updateGrid(event);
    }

    public updateGrid(data: any): void {

        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('ServiceVisitDetailDateRowID', this.attributes.ContractNumberServiceVisitDetailRowID);
        gridParams.set('ServiceVisitDetailDate', this.riGrid.Details.GetValue('ServiceVisitDetailDate'));
        gridParams.set('ServiceVisitDetailTimeStartRowID', this.riGrid.Details.GetAttribute('ServiceVisitDetailTimeStart', 'rowid'));
        gridParams.set('ServiceVisitDetailTimeEndRowID', this.riGrid.Details.GetAttribute('ServiceVisitDetailTimeEnd', 'rowid'));
        gridParams.set('ChangeProcessDate', this.riGrid.Details.GetValue('ChangeProcessDate'));
        gridParams.set('ServicedQuantity', this.riGrid.Details.GetValue('ServicedQuantity'));
        gridParams.set('EmployeeCode', this.riGrid.Details.GetValue('EmployeeCode'));
        gridParams.set('StandardDuration', this.riGrid.Details.GetValue('StandardDuration'));
        gridParams.set('OvertimeDurationRowID', this.riGrid.Details.GetAttribute('OvertimeDurationRowID', 'rowid'));
        gridParams.set('ServiceVisitCost', this.riGrid.Details.GetValue('ServiceVisitCost'));
        gridParams.set('TotalCost', this.riGrid.Details.GetValue('TotalCost'));
        gridParams.set('ServiceVisitRowID', this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID'));
        gridParams.set('ServiceVisitDetailRowID', this.attributes.ContractNumberServiceVisitDetailRowID);

        gridParams.set('ServiceVisitDetailTimeStart', this.utils.TimeValue(this.riGrid.Details.GetValue('ServiceVisitDetailTimeStart')).toString());
        gridParams.set('ServiceVisitDetailTimeEnd', this.utils.TimeValue(this.riGrid.Details.GetValue('ServiceVisitDetailTimeEnd')).toString());
        gridParams.set('OvertimeDuration', this.utils.TimeValue(this.riGrid.Details.GetValue('OvertimeDuration')).toString());

        gridParams.set(this.serviceConstants.GridMode, '3');
        gridParams.set(this.serviceConstants.GridHandle, '1246324');
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('riSortOrder', 'Descending');
        gridParams.set('HeaderClickedColumn', '');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data['errorMessage']) {
                    this.messageModal.show({ msg: data['errorMessage'], title: '' }, false);
                }
                this.riGrid.Mode = MntConst.eModeNormal;
            },
            (error) => {
                this.messageModal.show({ msg: error, title: '' }, false);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });

    }



    public onChangeEvent(event: any): void {
        //this.navigate('Add', 'Service/iCABSSeServiceVisitDetailMaintenance');
        alert('iCABSSeServiceVisitDetailMaintenance.htm is not in scope of this sprint');
    }

    public populateDescriptions(): void {
        let postParamsPopulate: any = {};
        let searchGetpopulate: any = this.getURLSearchParamObject();
        searchGetpopulate.set(this.serviceConstants.Action, '6');
        postParamsPopulate.Function = 'SetDisplayFields';

        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID') !== null || this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID') !== undefined || this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID') === '') {
            postParamsPopulate.ServiceVisitRowID = this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitRowID');
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchGetpopulate, postParamsPopulate)
            .subscribe(
            (e) => {
                if (e.errorMessage) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitNumber', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitTypeCode', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceDateStart', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceDateEnd', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'SharedVisitInd', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', '');
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitAnnivDate', '');
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', e.ContractNumber);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', e.ContractName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', e.PremiseNumber);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', e.PremiseName);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', e.ProductCode);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', e.ProductDesc);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverNumber', e.ServiceCoverNumber);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitNumber', e.ServiceVisitNumber);
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'VisitTypeCode', e.VisitTypeCode);

                    if (e.ServiceDateStart) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceDateStart', e.ServiceDateStart);
                        this.selDateServiceDateStart();
                    }
                    if (e.ServiceDateEnd) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceDateEnd', e.ServiceDateEnd);
                        this.selDateServiceDateEnd();
                    }
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceDateEnd', e.ServiceDateEnd);
                    if (e.SharedVisitInd) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'SharedVisitInd', this.utils.convertResponseValueToCheckboxInput(e.SharedVisitInd));
                    }
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitFrequency', e.ServiceVisitFrequency);
                    if (e.ServiceVisitAnnivDate) {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceVisitAnnivDate', e.ServiceVisitAnnivDate);
                        this.selDateServiceVisitAnnivDate();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public selDateServiceVisitAnnivDate(): void {
        let formattedAnnivDate: any = this.globalize.parseDateToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceVisitAnnivDate'));
        this.dtServiceVisitAnnivDate = formattedAnnivDate;
    }
    public selDateServiceDateStart(): void {
        let formattedServiceDateStart: any = this.globalize.parseDateToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceDateStart'));
        this.dtServiceDateStart = formattedServiceDateStart;
    }
    public selDateServiceDateEnd(): void {
        let formattedServiceDateEnd: any = this.globalize.parseDateToFixedFormat(this.riExchange.riInputElement.GetValue(this.uiForm, 'ServiceDateEnd'));
        this.dtServiceDateEnd = formattedServiceDateEnd;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }
}
