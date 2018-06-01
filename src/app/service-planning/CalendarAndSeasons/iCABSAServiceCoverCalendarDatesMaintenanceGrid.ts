import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { ContractSearchComponent } from './../../../app/internal/search/iCABSAContractSearch';
import { PremiseSearchComponent } from './../../../app/internal/search/iCABSAPremiseSearch';
import { BranchServiceAreaSearchComponent } from './../../../app/internal/search/iCABSBBranchServiceAreaSearch';
import { CalendarTemplateSearchComponent } from './../../../app/internal/search/iCABSBCalendarTemplateSearch.component';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { InternalGridSearchSalesModuleRoutes } from './../../base/PageRoutes';

@Component({
    templateUrl: 'iCABSAServiceCoverCalendarDatesMaintenanceGrid.html',
    styles: [`.error-disbaled { border: 1px solid red !important;}`]
})

export class ServiceCoverCalendarDatesMaintenanceGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('serviceCoverCalendarDatePagination') serviceCoverCalendarDatePagination: PaginationComponent;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('contractnumber') contractnumber;
    @ViewChild('annualcalendartemplatenumber') annualcalendartemplatenumber;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('datePicker1') datePicker1;

    public pageId: string = '';
    public curPage: number = 1;
    public totalRecords: number;
    public search = new URLSearchParams();
    public pageSize: number = 10;
    public lastchangeeffectdate: any;
    public btnUpdate: boolean = false;
    public userAccessType: any;
    public showMessageHeader: boolean = true;
    public promptConfirmContent: any;
    public promptTitle: any;
    public dateReadOnly: boolean;
    public isRequesting: boolean = false;
    public taggedListArray: any = [];
    public LastChangeEffectDateDisplay: any;
    public isPremiseFieldError: boolean = false;
    public showMandatoryMark: boolean = false;
    // inputParams for SearchComponent Ellipsis
    public ellipsis = {
        contractSearch: {
            disabled: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-All',
                currentContractType: this.pageParams.currentContractType,
                currentContractTypeURLParameter: this.pageParams.currentContractTypeLabel,
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
                currentContractType: this.pageParams.currentContractType,
                currentContractTypeURLParameter: this.pageParams.currentContractTypeLabel,
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
        branchServiceArea: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-AnnualCalendar',
                'showAddNew': false,
                'ContractNumber': '',
                'PremiseNumber': ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: BranchServiceAreaSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        calenderTemplateSelect: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-AnnualCalendar',
                'showAddNew': false,
                'ServiceVisitFrequency': ''
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            component: CalendarTemplateSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverCalendarDatesMaintenanceGrid',
        module: 'template',
        method: 'service-planning/maintenance'

    };
    public controls = [
        { name: 'ContractNumber', required: true },
        { name: 'ContractName' },
        { name: 'BranchServiceAreaCode' },
        { name: 'BranchServiceAreaDesc' },
        { name: 'PremiseNumber', type: MntConst.eTypeInteger },
        { name: 'PremiseName' },
        { name: 'LastChangeEffectDate', required: true, type: MntConst.eTypeDate },
        { name: 'AnnualCalendarTemplateNumber', type: MntConst.eTypeInteger },
        { name: 'TemplateName' },
        { name: 'ContractNumber' },
        { name: 'ServiceVisitFrequency', type: MntConst.eTypeInteger },
        { name: 'FollowTemplateInd' },
        { name: 'StaticVisitDate', type: MntConst.eTypeDate },
        { name: 'SelectedLineRowID' },
        { name: 'SelectedLineRow' },
        { name: 'ProductCode' },
        { name: 'ProductDesc' },
        { name: 'ProductCodeServiceCoverRowID' },
        { name: 'ProductCodePremiseNumber' },
        { name: 'ProductCodePremiseName' },
        { name: 'BranchServiceAreaCodeServiceCoverRowID' },
        { name: 'TaggedList' },
        { name: 'SelectedLine' },
        { name: 'SelectedPremiseNumber' },
        { name: 'SelectedPremiseName' },
        { name: 'BranchNumber' }
    ];

    constructor(public el: ElementRef, injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERCALENDARDATESMAINTENANCEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Annual Calendar Summary';
        this.window_onload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        this.contractnumber.nativeElement.focus();
    }

    private window_onload(): void {
        let strDocTitle = 'Annual Calendar Summary';
        this.getTranslatedValue(strDocTitle, null).subscribe((res: string) => {
            if (res) { strDocTitle = res; }
            this.utils.setTitle(strDocTitle);
        });
        if (this.isReturning()) {
            this.populateUIFromFormData();
            this.setControlValue('LastChangeEffectDate', '');
            this.setControlValue('TaggedList', '');
            this.btnUpdate = false;
            this.enableFilters();
            this.disableUpdateDetails();
            this.disableControl('StaticVisitDate', true);
            this.disableControl('PremiseName', true);
            this.disableControl('TemplateName', true);
            this.disableControl('ContractName', true);
            this.disableControl('BranchServiceAreaDesc', true);
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.premiseSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.branchServiceArea.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.branchServiceArea.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
        } else {
            this.setCurrentContractType();
            this.riGrid.PageSize = 10;
            // this.riGrid.Update = true;
            this.riGrid.UpdateHeader = true;
            this.riGrid.UpdateFooter = true;
            this.riGrid.UpdateBody = true;
            this.riGrid.FunctionPaging = true;
            this.disableControl('ContractName', true);
            this.disableControl('PremiseName', true);
            this.disableControl('BranchServiceAreaDesc', true);
            this.disableControl('LastChangeEffectDate', true);
            this.dateReadOnly = true;
            this.disableControl('FollowTemplateInd', true);
            this.disableControl('ServiceVisitFrequency', true);
            this.disableControl('AnnualCalendarTemplateNumber', true);
            this.ellipsis.calenderTemplateSelect.disabled = true;
            this.disableControl('TemplateName', true);
            this.disableControl('StaticVisitDate', true);
            this.setControlValue('FollowTemplateInd', false);
            // this.contractnumber.nativeElement.focus();
            this.pageParams.bAnnualCalendarTemplateNumber = false;
        }
        this.utils.getUserAccessType().subscribe((data) => {
            this.userAccessType = data;
        });
        this.buildGrid();
    }

    private setCurrentContractType(): void {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
    }

    private enableFilters(): void {
        this.disableControl('ContractNumber', false);
        this.disableControl('PremiseNumber', false);
        this.disableControl('BranchServiceAreaCode', false);
        this.ellipsis.contractSearch.disabled = false;
        this.ellipsis.premiseSearch.disabled = false;
        this.ellipsis.branchServiceArea.disabled = false;
    }

    private disableFilters(): void {
        this.disableControl('ContractNumber', true);
        this.ellipsis.contractSearch.disabled = true;
        this.disableControl('PremiseNumber', true);
        this.ellipsis.premiseSearch.disabled = true;
        this.disableControl('BranchServiceAreaCode', true);
        this.ellipsis.branchServiceArea.disabled = true;
    }

    private enableUpdateDetails(): void {
        this.disableControl('LastChangeEffectDate', false);
        setTimeout(() => {
            this.LastChangeEffectDateDisplay = null;
        }, 100);
        this.dateReadOnly = false;
        this.disableControl('FollowTemplateInd', false);
        this.disableControl('ServiceVisitFrequency', false);
    }

    private disableUpdateDetails(): void {
        this.disableControl('LastChangeEffectDate', true);
        setTimeout(() => {
            this.LastChangeEffectDateDisplay = void 0;
        }, 100);
        this.dateReadOnly = true;
        this.disableControl('FollowTemplateInd', true);
        this.setControlValue('FollowTemplateInd', false);
        this.disableControl('AnnualCalendarTemplateNumber', true);
        this.ellipsis.calenderTemplateSelect.disabled = true;
        this.disableControl('ServiceVisitFrequency', true);
        this.setControlValue('TemplateName', '');
        this.setControlValue('LastChangeEffectDate', '');
        this.setControlValue('StaticVisitDate', '');
        this.setControlValue('AnnualCalendarTemplateNumber', '');
        this.setControlValue('ServiceVisitFrequency', '');
        this.ellipsis.calenderTemplateSelect.childConfigParams.ServiceVisitFrequency = '';
        setTimeout(() => {
            this.showMandatoryMark = false;
        }, 100);
    }

    public btnUpdate_onclick(): void {
        this.promptTitle = 'Update Process';
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        this.promptConfirmModal.show();
    }

    public promptUpdateConfirm(): void {
        if (this.getControlValue('LastChangeEffectDate') === '') {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'LastChangeEffectDate', true);
            if (this.el.nativeElement.querySelector('.datepicker-input-cont input')) {
                this.el.nativeElement.querySelector('.datepicker-input-cont input').focus();
            }
        } else {
            if (this.getControlValue('FollowTemplateInd') && this.getControlValue('AnnualCalendarTemplateNumber') === '') {
                this.annualcalendartemplatenumber.nativeElement.focus();
            } else {
                let postSearchParams = this.getURLSearchParamObject();
                postSearchParams.set(this.serviceConstants.Action, '6');
                let postParams: any = {};
                postParams.Function = 'UpdateAnnualCalendar';
                postParams.TaggedList = this.retTaggedList(this.getControlValue('TaggedList'));
                postParams.FollowTemplateInd = this.getControlValue('FollowTemplateInd') ? 'yes' : 'no';
                postParams.AnnualCalendarTemplateNumber = this.getControlValue('AnnualCalendarTemplateNumber');
                postParams.LastChangeEffectDate = this.getControlValue('LastChangeEffectDate');
                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                    .subscribe(
                    (e) => {
                        if (e['status'] === 'failure') {
                            this.errorModal.show(e, true);
                            // this.displayError(e.errorMessage);
                            // this.errorService.emitError(e['oResponse']);
                        } else {
                            if ((typeof e !== 'undefined' && e['errorMessage'])) {
                                this.errorModal.show(e, true);
                                // this.displayError(e.errorMessage);
                                // this.errorService.emitError(new Error(e['errorMessage']));
                            } else {
                                this.resetTaggedList();
                                this.buildGrid();
                                this.riGrid.RefreshRequired();
                                this.riGrid_BeforeExecute();
                                this.enableFilters();
                                this.disableUpdateDetails();
                            }
                        }
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    },
                    (error) => {
                        this.errorService.emitError(error);
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    });
            }
        }
    }

    public premiseNumber_ondeactivate(): void {
        if (this.getControlValue('PremiseNumber') === '') {
            this.setControlValue('PremiseName', '');
            this.setControlValue('BranchServiceAreaCode', '');
            this.setControlValue('BranchServiceAreaDesc', '');
        }
    }

    private getNextVisitDate(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetNextVisitDate';
        postParams.AnnualCalendarTemplateNumber = this.getControlValue('AnnualCalendarTemplateNumber');
        postParams.LastChangeEffectDate = this.getControlValue('LastChangeEffectDate');
        postParams.ServiceVisitFrequency = this.getControlValue('ServiceVisitFrequency');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e !== 'undefined' && e['errorMessage'])) {
                        this.errorService.emitError(new Error(e['errorMessage']));
                    } else {
                        if (e.CalendarDate) {
                            this.setControlValue('StaticVisitDate', e.CalendarDate);
                        } else {
                            this.setControlValue('AnnualCalendarTemplateNumber', '');
                            this.setControlValue('TemplateName', '');
                            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AnnualCalendarTemplateNumber', true);
                        }
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public contractNumber_onkeydown(event: any): void {
        if (event.keyCode === 34) {
            this.ellipsis.contractSearch.autoOpenSearch = true;
            this.refreshRequired();
        }
    }

    public premiseNumber_onkeydown(event: any): void {
        if (event.keyCode === 34) {
            this.ellipsis.premiseSearch.autoOpenSearch = true;
            this.refreshRequired();
        }
    }

    public branchServiceAreaCode_onkeydown(event: any): void {
        if (event.keyCode === 34) {
            this.ellipsis.branchServiceArea.autoOpenSearch = true;
            this.refreshRequired();
        }
    }

    private premiseNumberFieldIsNotNumber(): boolean {
        let patt = new RegExp('^[0-9]*$');
        if (patt.test(this.getControlValue('PremiseNumber'))) {
            this.isPremiseFieldError = false;
            return false;
        } else {
            this.isPremiseFieldError = true;
            return true;
        }
    }

    private populateDescriptions(): void {
        if (this.premiseNumberFieldIsNotNumber()) {
            this.errorModal.show({ msg: 'Type mismatch', title: 'Error' }, false);
        } else {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.Function = 'GetDescriptions';
            postParams.LoggedInBranch = this.utils.getBranchCode();
            postParams.ContractNumber = this.getControlValue('ContractNumber');
            postParams.PremiseNumber = this.getControlValue('PremiseNumber');
            postParams.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
            postParams.AnnualCalendarTemplateNumber = this.getControlValue('AnnualCalendarTemplateNumber');
            postParams.ServiceVisitFrequency = this.getControlValue('ServiceVisitFrequency');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, postSearchParams, postParams)
                .subscribe(
                (e) => {
                    if (e['status'] === 'failure') {
                        this.errorService.emitError(e['oResponse']);
                    } else {
                        if ((typeof e !== 'undefined' && e['errorMessage'])) {
                            this.errorService.emitError(new Error(e['errorMessage']));
                        } else {
                            if (this.pageParams.bAnnualCalendarTemplateNumber) {
                                this.setControlValue('TemplateName', e.TemplateName);
                                this.pageParams.bAnnualCalendarTemplateNumber = false;
                            } else {
                                this.setControlValue('ContractName', e.ContractName);
                                this.setControlValue('PremiseName', e.PremiseName);
                                this.setControlValue('BranchServiceAreaDesc', e.BranchServiceAreaDesc);
                                this.refreshRequired();
                            }
                            this.ellipsis.premiseSearch.childConfigParams.ContractName = e.ContractName;
                        }
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    private refreshRequired(): void {
        this.btnUpdate = false;
        // this.buildGrid();
        // this.riGrid.RefreshRequired();
    }

    public annualCalendarTemplateNumber_onDeactivate(): void {
        if (this.getControlValue('AnnualCalendarTemplateNumber') === '') {
            this.setControlValue('StaticVisitDate', '');
        }
    }

    public annualCalendarTemplateNumber_onChange(obj: any): void {
        if (this.getControlValue('AnnualCalendarTemplateNumber') !== '') {
            this.pageParams.bAnnualCalendarTemplateNumber = true;
            this.populateDescriptions();
            this.getNextVisitDate();
        } else {
            this.setControlValue('AnnualCalendarTemplateNumber', '');
        }
    }

    public annualCalendarTemplateNumber_onkeydown(event: any): void {
        if (event.keyCode === 34) {
            this.ellipsis.calenderTemplateSelect.autoOpenSearch = true;
            this.refreshRequired();
        }
    }

    private resetTaggedList(): void {
        this.taggedListArray = [];
        this.setControlValue('TaggedList', '');
        this.btnUpdate = false;
    }

    public contractNumber_onChange(obj: any): void {
        if (this.getControlValue('ContractNumber') !== '') {
            this.setControlValue('ContractNumber', this.utils.numberPadding(obj.value, 8));
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.ellipsis.premiseSearch.childConfigParams.ContractName = this.getControlValue('ContractName');
            this.ellipsis.branchServiceArea.childConfigParams.ContractNumber = this.getControlValue('ContractNumber');
            this.populateDescriptions();
        } else {
            this.setControlValue('ContractName', '');
            this.ellipsis.premiseSearch.childConfigParams.ContractNumber = null;
            this.ellipsis.premiseSearch.childConfigParams.ContractName = null;
            this.ellipsis.branchServiceArea.childConfigParams.ContractNumber = null;
        }
    }

    public premiseNumber_onChange(obj: any): void {
        if (this.getControlValue('PremiseNumber') !== '') {
            this.populateDescriptions();
            this.ellipsis.branchServiceArea.childConfigParams.PremiseNumber = this.getControlValue('PremiseNumber');
        } else {
            this.setControlValue('PremiseName', '');
            this.isPremiseFieldError = false;
            this.ellipsis.branchServiceArea.childConfigParams.PremiseNumber = null;
        }
    }

    public branchServiceAreaCode_onChange(obj: any): void {
        if (this.getControlValue('BranchServiceAreaCode') !== '') {
            this.setControlValue('BranchServiceAreaCode', obj.value.toUpperCase());
            this.populateDescriptions();
        } else {
            this.setControlValue('BranchServiceAreaDesc', '');
        }
    }

    private buildGrid(): void {
        this.riGrid.Clear();
        this.riGrid.AddColumn('PremiseNumber', 'AnnualCalendarSummary', 'PremiseNumber', MntConst.eTypeInteger, 5, false);
        this.riGrid.AddColumnAlign('PremiseNumber', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('PremiseName', 'AnnualCalendarSummary', 'PremiseName', MntConst.eTypeText, 20, false);
        this.riGrid.AddColumnAlign('PremiseName', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ProductCode', 'AnnualCalendarSummary', 'ProductCode', MntConst.eTypeCode, 10, true);
        this.riGrid.AddColumnAlign('ProductCode', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ProductDesc', 'AnnualCalendarSummary', 'ProductDesc', MntConst.eTypeText, 40, false);
        this.riGrid.AddColumnAlign('ProductDesc', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('ServiceCommenceDate', 'AnnualCalendarSummary', 'ServiceCommenceDate', MntConst.eTypeDate, 10, false);
        this.riGrid.AddColumnAlign('ServiceCommenceDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceBranchNumber', 'AnnualCalendarSummary', 'ServiceBranchNumber', MntConst.eTypeInteger, 1, false);
        this.riGrid.AddColumnAlign('ServiceBranchNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceAreaCode', 'AnnualCalendarSummary', 'ServiceAreaCode', MntConst.eTypeCode, 1, false);
        this.riGrid.AddColumnAlign('ServiceAreaCode', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceQuantity', 'AnnualCalendarSummary', 'ServiceQuantity', MntConst.eTypeInteger, 10, false);
        this.riGrid.AddColumnAlign('ServiceQuantity', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ServiceVisitFrequency', 'AnnualCalendarSummary', 'ServiceVisitFrequency', MntConst.eTypeInteger, 3, true);
        this.riGrid.AddColumnAlign('ServiceVisitFrequency', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('ServiceAnnualValue', 'AnnualCalendarSummary', 'ServiceAnnualValue', MntConst.eTypeCurrency, 8, false);
        this.riGrid.AddColumnAlign('ServiceAnnualValue', MntConst.eAlignmentRight);
        this.riGrid.AddColumn('NextInvoiceStartDate', 'AnnualCalendarSummary', 'NextInvoiceStartDate', MntConst.eTypeDate, 10, false);
        this.riGrid.AddColumnAlign('NextInvoiceStartDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('NextInvoiceEndDate', 'AnnualCalendarSummary', 'NextInvoiceEndDate', MntConst.eTypeDate, 10, false);
        this.riGrid.AddColumnAlign('NextInvoiceEndDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('ServiceVisitAnnivDate', 'AnnualCalendarSummary', 'ServiceVisitAnnivDate', MntConst.eTypeDate, 10, false);
        this.riGrid.AddColumnAlign('ServiceVisitAnnivDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('AnnualCalendarInd', 'AnnualCalendarSummary', 'AnnualCalendarInd', MntConst.eTypeImage, 2, false);
        this.riGrid.AddColumnAlign('AnnualCalendarInd', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('AnnualCalendarTemplateNumber', 'AnnualCalendarSummary', 'AnnualCalendarTemplateNumber', MntConst.eTypeDate, 10, false);
        this.riGrid.AddColumnAlign('AnnualCalendarTemplateNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumn('Status', 'AnnualCalendarSummary', 'Status', MntConst.eTypeText, 20, false);
        this.riGrid.AddColumnAlign('Status', MntConst.eAlignmentLeft);
        this.riGrid.AddColumn('Tagged', 'Tagged', 'Tagged', MntConst.eTypeImage, 1, true);
        this.riGrid.Complete();
    }

    private riGrid_BeforeExecute(): void {
        this.riGrid.RefreshRequired();
        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('FullAccess', this.userAccessType);
        gridParams.set('LoggedInBranch', this.utils.getBranchCode());
        gridParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        gridParams.set('ContractNumber', this.getControlValue('ContractNumber'));
        gridParams.set('PremiseNumber', this.getControlValue('PremiseNumber'));
        gridParams.set('TaggedList', this.retTaggedList(this.getControlValue('TaggedList')));
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.randomSixDigitString());
        gridParams.set(this.serviceConstants.PageSize, this.pageSize.toString());
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set('HeaderClickedColumn', '');
        gridParams.set('riSortOrder', 'Descending');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    return;
                }
                if (this.riGrid.Update) {
                    this.riGrid.StartRow = this.getControlValue('SelectedLineRow');
                    this.riGrid.StartColumn = 0;
                    this.riGrid.RowID = this.getControlValue('SelectedLineRowID');
                    this.riGrid.UpdateBody = true;
                    this.riGrid.UpdateHeader = false;
                    this.riGrid.UpdateFooter = false;
                }
                this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                this.totalRecords = data.pageData ? data.pageData.pageNumber : 1;
                this.riGrid.Execute(data);
                if (data.fullError) {
                    this.totalRecords = 0;
                    this.errorModal.show({ msg: data.fullError, title: 'Error' }, false);
                }

            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private toggleTagList(ipRowid: any): void {
        if (this.taggedListArray.indexOf(ipRowid) < 0) {
            this.taggedListArray.push(ipRowid);
            this.setControlValue('TaggedList', this.taggedListArray.join(','));
        } else {
            let idx = this.taggedListArray.indexOf(ipRowid);
            this.taggedListArray.splice(idx, 1);
            this.setControlValue('TaggedList', this.taggedListArray.join(','));
        }
        if (this.getControlValue('TaggedList') === '') {
            this.btnUpdate = false;
            this.enableFilters();
            this.disableUpdateDetails();
        } else {
            this.btnUpdate = true;
            this.disableFilters();
            this.enableUpdateDetails();
        }
    }

    private retTaggedList(str: any): any {
        let list = '';
        if (str !== '') {
            list = str;
        }
        return list;
    }

    public followTemplateInd_onClick(value: any): void {
        this.setControlValue('FollowTemplateInd', value);
        if (!this.getControlValue('FollowTemplateInd')) {
            this.setControlValue('AnnualCalendarTemplateNumber', '');
            this.setControlValue('TemplateName', '');
            this.setControlValue('ServiceVisitFrequency', '');
            this.ellipsis.calenderTemplateSelect.childConfigParams.ServiceVisitFrequency = '';
            this.disableControl('AnnualCalendarTemplateNumber', true);
            this.ellipsis.calenderTemplateSelect.disabled = true;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AnnualCalendarTemplateNumber', false);
            this.showMandatoryMark = false;
        } else {
            this.disableControl('AnnualCalendarTemplateNumber', false);
            this.ellipsis.calenderTemplateSelect.disabled = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'AnnualCalendarTemplateNumber', true);
            this.uiForm.controls['AnnualCalendarTemplateNumber'].markAsPristine();
            this.uiForm.controls['AnnualCalendarTemplateNumber'].markAsUntouched();
            this.showMandatoryMark = true;
        }
    }

    private serviceCoverFocus(rsrcElement: any): void {
        let oTR = rsrcElement.parentElement.parentElement.parentElement;
        this.setControlValue('SelectedLineRowID', oTR.children[16].children[0].children[0].getAttribute('rowid'));
        this.setControlValue('SelectedLineRow', oTR.sectionRowIndex);
        this.setControlValue('ProductCode', oTR.children[2].children[0].children[0].value);
        this.setControlValue('ProductDesc', oTR.children[3].children[0].innerHTML);
        this.setControlValue('ProductCodeServiceCoverRowID', oTR.children[16].children[0].children[0].getAttribute('rowid'));
        this.setControlValue('ProductCodePremiseNumber', oTR.children[0].children[0].children[0].value);
        this.setControlValue('ProductCodePremiseName', oTR.children[1].children[0].innerHTML);
    }

    public riGrid_BodyOnDblClick(event: any): void {
        this.setControlValue('BranchServiceAreaCodeServiceCoverRowID', event.srcElement.getAttribute('rowid'));
        switch (this.riGrid.CurrentColumnName) {
            case 'ServiceVisitFrequency':
                this.serviceCoverFocus(event.srcElement);
                this.navigate('ServiceCoverAnnualCalendar', InternalGridSearchSalesModuleRoutes.ICABSAPLANVISITGRIDYEAR, {
                    parentMode: 'ServiceCoverAnnualCalendar',
                    CurrentContractTypeURLParameter: this.pageParams.currentContractTypeLabel,
                    ContractNumber: this.getControlValue('ContractNumber'),
                    ContractName: this.getControlValue('ContractName'),
                    ProductCode: this.getControlValue('ProductCode'),
                    ProductDesc: this.getControlValue('ProductDesc'),
                    PremiseNumber: this.getControlValue('ProductCodePremiseNumber'),
                    PremiseName: this.getControlValue('ProductCodePremiseName'),
                    ServiceCoverRowID: this.getControlValue('ProductCodeServiceCoverRowID')
                });//iCABSAPlanVisitGridYear.htm
                break;
            case 'ProductCode':
                let ServiceCoverRowID = event.srcElement.parentElement.parentElement.parentElement.children[16].children[0].children[0].getAttribute('rowid');
                this.navigate('AnnualCalendar', this.ContractManagementModuleRoutes.ICABSASERVICECOVERMAINTENANCE, {
                    currentContractType: this.pageParams.currentContractType,
                    ServiceCoverRowID: ServiceCoverRowID
                }); // iCABSAServiceCoverMaintenance.htm

                break;
            case 'Tagged':
                if (event.srcElement.getAttribute('rowid') !== '1') {
                    this.toggleTagList(event.srcElement.getAttribute('rowid'));
                    this.riGrid_BeforeExecute();
                    this.riGrid.RefreshRequired();
                }
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
                                this.serviceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
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
                                this.serviceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
        }
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    // On contract number ellipsis data return
    public onContractDataReceived(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', data.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', data.ContractName);
        //Setting other fields to null
        this.ellipsis.premiseSearch.childConfigParams.ContractNumber = data.ContractNumber;
        this.ellipsis.premiseSearch.childConfigParams.ContractName = data.ContractName;
        this.ellipsis.branchServiceArea.childConfigParams.ContractNumber = data.ContractNumber;
    }
    // On premise number ellipsis data return
    public onPremiseDataReceived(data: any): void {
        this.isPremiseFieldError = false;
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', data.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', data.PremiseName);
        this.ellipsis.branchServiceArea.childConfigParams.PremiseNumber = data.PremiseNumber;
    }

    // On BranchServiceAreaCode ellipsis data return
    public onBranchServiceAreaCodeRecieved(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', data.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaDesc', data.BranchServiceAreaDesc);
    }

    // On AnnualCalendarTemplateNumber ellipsis data return
    public annualCalendarTemplateNumberOnRecieved(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AnnualCalendarTemplateNumber', data.AnnualCalendarTemplateNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TemplateName', data.TemplateName);
    }

    public dateFromSelectedValue(value: any): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'LastChangeEffectDate', value.value);
        } else {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'LastChangeEffectDate', '');
        }
    }

    public modalHidden(event: any): void {
        //
    }

    public serviceVisitFreq_onChange(): void {
        this.ellipsis.calenderTemplateSelect.childConfigParams.ServiceVisitFrequency = this.getControlValue('ServiceVisitFrequency');
    }
}
