import * as moment from 'moment';
import { InternalMaintenanceServiceModuleRoutes } from './../../base/PageRoutes';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { RouteAwayGlobals } from './../../../shared/services/route-away-global.service';
import { BranchServiceAreaSearchComponent } from './../../internal/search/iCABSBBranchServiceAreaSearch';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnDestroy, OnInit, ViewChild, EventEmitter, Renderer, HostListener } from '@angular/core';

@Component({
    templateUrl: 'iCABSSeServicePlanDeliveryNoteGrid.html'
})

export class ServicePlanDeliveryNoteGridComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('riGrid') riGrid: GridAdvancedComponent;

    //Syschar Variables
    public setFocusOnBranchServiceAreaCode = new EventEmitter<boolean>();
    public promptSaveMode: any;
    public getweekNumber: boolean = false;

    // Page Variables
    private transReceiptDesc: string;
    public totalRecords: number = 1;
    public pageSize: number = 15;
    public itemsPerPage: number = 10;
    public curPage: number = 1;
    public promptContent: string;
    public promptTitle: string;
    public information2Display: any = false;
    public information2: any;

    public ellipsisConfig = {
        serviceArea: {
            disabled: false,
            showHeader: true,
            autoOpen: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-Emp',
                showAddNew: false
            },
            component: BranchServiceAreaSearchComponent
        }
    };

    private headerParams: any = {
        operation: 'Service/iCABSSeServicePlanDeliveryNoteGrid',
        module: 'delivery-note',
        method: 'service-delivery/maintenance'
    };

    /**
     * Base Component Variables
     */
    public pageId: string = '';
    public controls = [
        { name: 'BranchServiceAreaCode', type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', disabled: true },
        { name: 'ServicePStartDate', type: MntConst.eTypeDate },
        { name: 'ServicePEndDate', type: MntConst.eTypeDate },
        { name: 'ServiceWeekNumber', disabled: true },
        { name: 'GridPageSize', type: MntConst.eTypeInteger },
        { name: 'GeneratedTypeFilter' },
        { name: 'BranchServiceAreaCodeList' },
        { name: 'ServicePlanNumbersList' },
        { name: 'SelectAction' },
        { name: 'GridName' },
        { name: 'GridCacheTime' },
        { name: 'ReportJobNumber' },
        { name: 'GenerateOption' },
        { name: 'IncludeLocations' },
        { name: 'NumberOfForms' },
        { name: 'previousEndDate' },
        { name: 'RunBatchProcess' }
    ];

    constructor(injector: Injector, public routeAwayGlobals: RouteAwayGlobals, rendrer: Renderer) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSESERVICEPLANDELIVERYNOTEGRID;
    }

    public ngOnInit(): void {
        super.ngOnInit();

        if (this.isReturning()) {
            this.populateUIFromFormData();

            this.pageParams.startDate = new Date(this.utils.convertDate(this.getControlValue('ServicePStartDate')));
            this.pageParams.endDate = new Date(this.utils.convertDate(this.getControlValue('ServicePEndDate')));
            this.buildGrid();

            if (this.getControlValue('RunBatchProcess')) {
                this.setControlValue('RunBatchProcess', false);
                this.cmdReportGeneration_onclick();
            }

        } else {
            this.getSysCharDtetails();
        }
        this.getTranslatedValue('Generate Service Listing/Receipts').subscribe(res => {
            this.utils.setTitle(res);
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public setDatePickerFormat(getDate: string): Date {
        if (moment(getDate, 'DD/MM/YYYY', true).isValid()) {
            getDate = this.utils.convertDate(getDate);
        } else {
            getDate = this.utils.formatDate(getDate);
        }
        return new Date(getDate);
    }

    /**
     * Fetches Syschar values
     */
    private getSysCharDtetails(): void {
        //SysChar
        this.ajaxSource.next(this.ajaxconstant.START);
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableInstallsRemovals,
            this.sysCharConstants.SystemCharPrintServiceDocketsSeparately,
            this.sysCharConstants.SystemCharGenerateAllServicePlanRpts,
            this.sysCharConstants.SystemCharSingleServicePlanPerBranch
        ];
        let sysCharIP = {
            module: this.headerParams.module,
            operation: this.headerParams.operation,
            action: '0',
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            if (data.hasError) {
                this.errorModal.show(data, true);
            }
            else {
                let record = data.records;
                this.pageParams.enableInstallsRemovals = record[0]['Required'];
                this.pageParams.printServiceDocketsSeparately = record[1]['Required'];
                this.pageParams.generateAllServicePlanRpts = record[2]['Required'];
                this.pageParams.enableSinglePlanPerBranch = record[3]['Required'];
                this.pageParams.enableSinglePlanPerBranchLog = record[3]['Logical'];
                if (!this.pageParams.enableSinglePlanPerBranch || !this.pageParams.enableSinglePlanPerBranchLog) {
                    this.pageParams.confirmedNullServiceA = true;
                } else {
                    this.pageParams.confirmedNullServiceA = false;
                }
                this.getLookupCallSearchParameter();
            }
        });
    }

    private getLookupCallSearchParameter(): void {
        let lookUpSys = [{
            'table': 'SystemParameter',
            'query': {},
            'fields': ['SystemParameterEndOfWeekDay']
        }];

        this.LookUp.lookUpRecord(lookUpSys).subscribe((data) => {
            if (data.hasError) {
                this.errorModal.show(data, true);
            } else {
                if (data[0][0].SystemParameterEndOfWeekDay < 7) {
                    this.pageParams.endofWeekDay = data[0][0].SystemParameterEndOfWeekDay;
                } else {
                    this.pageParams.endofWeekDay = 1;
                }
                let today: Date = new Date();
                this.pageParams.endofWeekDate = ((6 - today.getDay()) + this.pageParams.endofWeekDay);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.window_onload();
            }
        });
    }

    /** */
    private window_onload(): void {
        this.setControlValue('GridName', 'GenServList');
        this.setControlValue('GeneratedTypeFilter', '0');
        this.setControlValue('GridCacheTime', this.utils.Time());
        this.setControlValue('GridPageSize', this.pageSize);

        this.buildGrid();
        this.setFocusOnBranchServiceAreaCode.emit(true);

        if (this.pageParams.generateAllServicePlanRpts) {
            this.pageParams.showDivGenerate = true;
        } else {
            this.pageParams.showDivGenerate = false;
        }
        this.pageParams.showRefreshGrid = true;
        if (this.pageParams.generateAllServicePlanRpts) {
            this.pageParams.showGenerateSel = false;
            this.pageParams.showPrintSelected = false;
            this.pageParams.showSelectAll = false;
            this.pageParams.showSelectNone = false;
        } else {
            this.pageParams.showGenerateSel = true;
            this.pageParams.showPrintSelected = true;
            this.pageParams.showSelectAll = true;
            this.pageParams.showSelectNone = true;
        }

        let sDate = this.utils.addDays(new Date(), this.pageParams.endofWeekDate + 1);
        let eDate = this.utils.addDays(new Date(), this.pageParams.endofWeekDate + 7);
        this.pageParams.startDate = new Date(this.utils.convertDate(sDate.toString()));
        this.pageParams.endDate = new Date(this.utils.convertDate(eDate.toString()));

        this.setControlValue('ServicePStartDate', sDate);
        this.setControlValue('ServicePEndDate', eDate);
    }

    private buildGrid(): void {
        this.pageParams.addColumns = 0;
        this.riGrid.Clear();

        if ((this.utils.trim(this.getControlValue('BranchServiceAreaCode')) === '' || !this.getControlValue('BranchServiceAreaCode')) && this.pageParams.confirmedNullServiceA) {
            this.riGrid.AddColumn('BranchServiceAreaCode', 'ServicePlan', 'BranchServiceAreaCode', MntConst.eTypeText, 5, true);
            this.riGrid.AddColumnAlign('BranchServiceAreaCode', MntConst.eAlignmentCenter);
            this.riGrid.AddColumnOrderable('BranchServiceAreaCode', true);
            this.pageParams.addColumns = this.pageParams.addColumns + 1;
        }

        this.riGrid.AddColumn('ServicePlanNumber', 'ServicePlan', 'ServicePlanNumber', MntConst.eTypeInteger, 5, true);
        this.riGrid.AddColumnAlign('ServicePlanNumber', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ServicePlanNumber', true);

        this.riGrid.AddColumn('ServicePlanStartDate', 'ServicePlan', 'ServicePlanStartDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServicePlanStartDate', MntConst.eAlignmentCenter);
        this.riGrid.AddColumnOrderable('ServicePlanStartDate', true);

        this.riGrid.AddColumn('ServicePlanEndDate', 'ServicePlan', 'ServicePlanEndDate', MntConst.eTypeDate, 10);
        this.riGrid.AddColumnAlign('ServicePlanEndDate', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServiceWeekNumber', 'ServicePlan', 'ServiceWeekNumber', MntConst.eTypeInteger, 2);
        this.riGrid.AddColumnAlign('ServiceWeekNumber', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServicePlanNoOfCalls', 'ServicePlan', 'ServicePlanNoOfCalls', MntConst.eTypeInteger, 4);
        this.riGrid.AddColumnAlign('ServicePlanNoOfCalls', MntConst.eAlignmentCenter);

        if (this.pageParams.enableInstallsRemovals) {
            this.riGrid.AddColumn('ServicePlanNoOfExchanges', 'ServicePlan', 'ServicePlanNoOfExchanges', MntConst.eTypeInteger, 4);
            this.riGrid.AddColumnAlign('ServicePlanNoOfExchanges', MntConst.eAlignmentCenter);
            this.pageParams.addColumns = this.pageParams.addColumns + 1;
        }

        this.riGrid.AddColumn('ServicePlanTime', 'ServicePlan', 'ServicePlanTime', MntConst.eTypeText, 5);
        this.riGrid.AddColumnAlign('ServicePlanTime', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServicePlanNettValue', 'ServicePlan', 'ServicePlanNettValue', MntConst.eTypeCurrency, 10);
        this.riGrid.AddColumnAlign('ServicePlanNettValue', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ServicePlanStatusDesc', 'ServicePlan', 'ServicePlanStatusDesc', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('ServicePlanStatusDesc', MntConst.eAlignmentCenter);

        this.riGrid.AddColumn('ReportNumber', 'ServicePlan', 'ReportNumber', MntConst.eTypeInteger, 9);
        if (this.pageParams.printServiceDocketsSeparately) {
            this.riGrid.AddColumn('GenerationDate', 'ServicePlan', 'GenerationDate', MntConst.eTypeDate, 10);
            this.riGrid.AddColumnOrderable('GenerationDate', true);
            this.riGrid.AddColumn('PrintSummaryOnly', 'ServicePlan', 'PrintSummaryOnly', MntConst.eTypeImage, 1, true);
            this.riGrid.AddColumn('PrintPickingListOnly', 'ServicePlan', 'PrintPickingListOnly', MntConst.eTypeImage, 1, true);
            this.riGrid.AddColumn('PrintServiceDocketOnly', 'ServicePlan', 'PrintServiceDocketOnly', MntConst.eTypeImage, 1, true);
            this.riGrid.AddColumn('ServiceDocketPrint', 'ServicePlan', 'ServiceDocketPrint', MntConst.eTypeImage, 1, true);
        } else {
            // Print All
            this.riGrid.AddColumn('ServiceDocketPrint', 'ServicePlan', 'ServiceDocketPrint', MntConst.eTypeImage, 1, true);
        }
        if (!this.pageParams.generateAllServicePlanRpts) {
            this.riGrid.AddColumn('SelectLine', 'ServicePlan', 'SelectLine', MntConst.eTypeImage, 1, true);
        }

        this.riGrid.Complete();
    }

    private riGrid_BeforeExecute(): void {
        this.riGrid.FunctionPaging = true;
        let gridParams: URLSearchParams = new URLSearchParams();
        gridParams.set(this.serviceConstants.Action, '2');
        gridParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        gridParams.set(this.serviceConstants.CountryCode, this.countryCode());
        gridParams.set('BranchNumber', this.utils.getBranchCode());
        gridParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
        gridParams.set('ServicePStartDate', this.getControlValue('ServicePStartDate'));
        gridParams.set('ServicePEndDate', this.getControlValue('ServicePEndDate'));
        gridParams.set('GeneratedTypeFilter', this.getControlValue('GeneratedTypeFilter'));
        gridParams.set('SelectAction', this.getControlValue('SelectAction'));
        gridParams.set('GridName', this.getControlValue('GridName'));
        gridParams.set('GridCacheTime', this.getControlValue('GridCacheTime'));
        gridParams.set('WeekNumber', this.getControlValue('ServiceWeekNumber'));
        gridParams.set('ServicePlanStatusCode', 'All');
        gridParams.set('GridMode', 'ServiceListing');
        if (this.getControlValue('SelectAction') === 'SelectLine') {
            gridParams.set('ROWID', this.getAttribute('ServicePlanRowID'));
        }
        gridParams.set(this.serviceConstants.GridMode, '0');
        gridParams.set(this.serviceConstants.GridHandle, this.utils.gridHandle);
        gridParams.set(this.serviceConstants.GridCacheRefresh, 'true');
        gridParams.set(this.serviceConstants.PageSize, this.getControlValue('GridPageSize'));
        gridParams.set(this.serviceConstants.PageCurrent, this.curPage.toString());
        gridParams.set(this.serviceConstants.GridHeaderClickedColumn, this.riGrid.HeaderClickedColumn);
        gridParams.set(this.serviceConstants.GridSortOrder, this.riGrid.SortOrder);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, gridParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.errorModal.modal(data.errorMessage, true);
                } else {
                    if (this.pageParams.isSelectAllProcessing) {
                        this.setControlValue('SelectAction', '');
                        this.pageParams.isSelectAllProcessing = false;
                        this.riGrid_BeforeExecute();
                    }

                    if (this.riGrid.Update && this.getControlValue('SelectAction') === 'SelectLine') {
                        this.riGrid.StartRow = this.getAttribute('Row');
                        this.riGrid.StartColumn = 0;
                        this.riGrid.RowID = this.getAttribute('ServicePlanRowID');
                        this.riGrid.UpdateHeader = false;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.setControlValue('SelectAction', '');

                        this.riGrid.Execute(data);
                        this.riGrid_BeforeExecute();
                        return;
                    } else {
                        this.riGrid.RefreshRequired();
                    }
                    this.totalRecords = this.pageSize * data.pageData.lastPageNumber;
                    this.riGrid.Execute(data);
                }
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private ServiceCoverFocus(srcElement: any): void {
        let oTR = srcElement.parentElement.parentElement.parentElement;
        srcElement.focus();
        // this.objBranchServiceAreaCode = new Object();

        if ((this.utils.trim(this.getControlValue('BranchServiceAreaCode')) === '' || this.getControlValue('BranchServiceAreaCode') === null) && this.pageParams.confirmedNullServiceA) {
            this.setAttribute('ServicePlanRowID', oTR.children[0 + 1].children[0].children[0].getAttribute('RowID'));
            this.setAttribute('BranchServiceAreaCode', oTR.children[0].children[0].innerText);
            this.setAttribute('ServicePlanStartDate', oTR.children[1 + 1].children[0].innerText);
            this.setAttribute('ServicePlanEndDate', oTR.children[2 + 1].children[0].innerText);
            this.setAttribute('Row', oTR.sectionRowIndex);
            this.setAttribute('ServicePlanNumber', oTR.children[0 + 1].children[0].children[0].value);
            this.setAttribute('ReportNumber', oTR.children[8 + this.pageParams.addColumns].children[0].innerText);
        } else {
            this.setAttribute('ServicePlanRowID', oTR.children[0].children[0].children[0].getAttribute('RowID'));
            this.setAttribute('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
            this.setAttribute('ServicePlanStartDate', oTR.children[1].children[0].innerText);
            this.setAttribute('ServicePlanEndDate', oTR.children[2].children[0].innerText);
            this.setAttribute('Row', oTR.sectionRowIndex);
            this.setAttribute('ServicePlanNumber', oTR.children[0].children[0].children[0].value);
            this.setAttribute('ReportNumber', oTR.children[8 + this.pageParams.addColumns].children[0].innerText);
        }
    }

    public riGrid_BodyOnDblClick(event: Event): void {
        this.ServiceCoverFocus(event.srcElement);
        switch (this.riGrid.CurrentColumnName) {
            case 'ServicePlanNumber':
                if (this.getAttribute('ServicePlanNumber')) {
                    this.navigate('', InternalMaintenanceServiceModuleRoutes.ICABSSESERVICEPLANDELIVERYNOTEGENERATION, {
                        'ServicePlanNumber': this.riGrid.Details.GetValue(this.riGrid.CurrentColumnName)
                    });
                }
                break;
            case 'ServiceDocketPrint':
            case 'PrintSummaryOnly':
            case 'PrintPickingListOnly':
            case 'PrintServiceDocketOnly':
                let strURL, vReportNumber;
                vReportNumber = this.getAttribute('ReportNumber');
                let searchParams: URLSearchParams = new URLSearchParams();
                searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
                searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
                searchParams.set(this.serviceConstants.Action, '0');
                searchParams.set('ReportNumber', vReportNumber.trim(''));
                searchParams.set('PremiseNumber', '0');
                searchParams.set('PrintType', this.riGrid.CurrentColumnName);
                this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
                    (data) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.logger.log(data.hasError);
                        if (data.hasError) {
                            data.msg = data.errorMessage || data.fullError;
                            this.errorModal.show(data, true);
                            return;
                        } else {
                            strURL = data.url;
                            window.open(strURL, '_blank');
                        }
                    },
                    (error) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    });
                break;
        }
    }

    public riGrid_BodyOnClick(event: Event): void {
        switch (this.riGrid.CurrentColumnName) {
            case 'SelectLine':
                this.setControlValue('SelectAction', 'SelectLine');
                this.ServiceCoverFocus(event.srcElement);
                this.riGrid.Update = true;
                this.riGrid_BeforeExecute();
                break;
        }
    }

    public riGrid_Sort(event: any): void {
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public cmdSelectAll_onclick(): void {
        this.riGrid.RefreshRequired();
        this.setControlValue('SelectAction', 'SelectAll');
        this.riGrid.Update = true;
        this.riGrid_BeforeExecute();
        this.pageParams.isSelectAllProcessing = true;
    }

    public cmdRefreshGrid_onclick(): void {
        this.riGrid.RefreshRequired();
        this.setControlValue('GridCacheTime', this.utils.Time());
        this.setControlValue('SelectAction', '');
        this.riGrid_BeforeExecute();
    }

    public cmdSelectNone_onclick(): void {
        this.riGrid.RefreshRequired();
        this.setControlValue('SelectAction', 'SelectNone');
        this.riGrid.Update = true;
        this.riGrid_BeforeExecute();
        this.pageParams.isSelectAllProcessing = true;
    }

    public cmdGenerateSel_onclick(): void {
        this.promptTitle = 'Confirm Generate';
        this.getTranslatedValue(this.promptTitle, null).subscribe((res: string) => {
            if (res) {
                this.promptTitle = res;
            }
        });
        this.promptContent = 'Are You Sure You Want To Generate the Selected Items?';
        this.getTranslatedValue(this.promptContent, null).subscribe((res: string) => {
            if (res) {
                this.promptContent = res;
            }
        });
        this.promptSaveMode = 'Generate';
        this.promptModal.show();
    }

    public cmdPrintSelected_onclick(): void {
        this.setControlValue('SelectAction', 'PrintSelected');
        this.promptTitle = 'Confirm Print';
        this.getTranslatedValue(this.promptTitle, null).subscribe((res: string) => {
            if (res) {
                this.promptTitle = res;
            }
        });
        this.promptContent = 'Are You Sure You Want To Print the Selected Items?';
        this.getTranslatedValue(this.promptContent, null).subscribe((res: string) => {
            if (res) {
                this.promptContent = res;
            }
        });
        this.promptSaveMode = 'Print';
        this.promptModal.show();
    }

    public promptSave(event: any): void {
        switch (this.promptSaveMode) {
            case 'Generate':
                this.setControlValue('SelectAction', 'GenerateSel');
                this.navigate('', InternalMaintenanceServiceModuleRoutes.ICABSSESERVICEPLANDELIVERYNOTEGENERATION);
                break;
            case 'Print':
                this.cmdReportGeneration_onclick();
                break;
        }
    }

    public printReport(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '0');
        let postParams: any = {};
        let strURL;
        postParams.ReportNumber = this.getControlValue('ReportJobNumber');
        postParams.PremiseNumber = '0';
        postParams.PrintType = '';
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((e) => {
                if (e.hasError) {
                    this.errorModal.show(e, true);
                } else {
                    strURL = e.url;
                    window.open(strURL, '_blank');
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    @HostListener('document:keydown', ['$event']) document_onkeydown(ev: any): void {
        let ServicePStartDate = this.utils.convertDate(this.getControlValue('ServicePStartDate').toString());
        let ServicePEndDate = this.utils.convertDate(this.getControlValue('ServicePEndDate').toString());

        if (this.getControlValue('ServicePStartDate') && this.getControlValue('ServicePEndDate')) {
            switch (ev.keyCode) {
                case 106:
                    ev.returnValue = 0;
                    this.pageParams.startDate = this.setDatePickerFormat(this.utils.addDays(new Date(this.pageParams.endofWeekDate), 1).toString());
                    this.pageParams.endDate = this.setDatePickerFormat(this.utils.addDays(new Date(this.pageParams.endofWeekDate), 7).toString());
                    this.getLatestWeekNumber();
                    this.riGrid.RefreshRequired();
                    this.ClearTable();
                    break;
                case 107:
                    ev.returnValue = 0;
                    this.pageParams.startDate = this.setDatePickerFormat(this.utils.addDays(ServicePStartDate, 7).toString());
                    this.pageParams.endDate = this.setDatePickerFormat(this.utils.addDays(ServicePEndDate, 7).toString());
                    this.getLatestWeekNumber();
                    this.riGrid.RefreshRequired();
                    this.ClearTable();
                    break;
                case 109:
                    ev.returnValue = 0;
                    this.pageParams.startDate = this.setDatePickerFormat(this.utils.addDays(ServicePStartDate, -7).toString());
                    this.pageParams.endDate = this.setDatePickerFormat(this.utils.addDays(ServicePEndDate, -7).toString());
                    if (this.pageParams.endDate < new Date()) {
                        let description = 'Plan Week Has Already Passed';
                        this.getTranslatedValue(description, null).subscribe((res: string) => {
                            if (res) {
                                description = res;
                            }
                            this.errorModal.show(description, false);
                        });
                    }

                    this.getLatestWeekNumber();
                    this.riGrid.RefreshRequired();
                    this.ClearTable();
                    break;
            }
        }
    }

    private getLatestWeekNumber(): void {
        if (this.getControlValue('ServicePStartDate') && this.getControlValue('ServicePEndDate')) {
            let postSearchParams = this.getURLSearchParamObject();
            postSearchParams.set(this.serviceConstants.Action, '6');
            let postParams: any = {};
            postParams.Function = 'GetLatestWeekNumber';
            postParams.ServicePStartDate = this.getControlValue('ServicePStartDate');
            postParams.ServicePEndDate = this.getControlValue('ServicePEndDate');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
                .subscribe((e) => {
                    if (e.hasError) {
                        this.errorModal.show(e, true);
                    } else {
                        this.setControlValue('ServiceWeekNumber', e.WeekNumber);
                    }
                    this.riGrid.ResetGrid();
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.errorService.emitError(error);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    }

    public riExchange_CBORequest(): void {
        if (this.getControlValue('previousEndDate') !== this.getControlValue('ServicePStartDate')) {
            if (this.getControlValue('ServicePStartDate') && this.getControlValue('ServicePEndDate')) {
                this.getLatestWeekNumber();
                this.riGrid.RefreshRequired();
                this.ClearTable();
            }
            else {
                this.setControlValue('ServiceWeekNumber', '');
            }
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
                                this.ServiceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.previousSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
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
                                this.ServiceCoverFocus(event.srcElement.parentElement.parentElement.parentElement.nextSibling.children[event.srcElement.parentElement.parentElement.cellIndex].children[0].children[0]);
                            }
                        }
                    }

                }
                break;
        }
    }

    public branchServiceAreaCode_ondeactivate(event: any): void {
        if (!this.getControlValue('BranchServiceAreaCode') || this.getControlValue('BranchServiceAreaCode') === '') {
            this.setControlValue('EmployeeSurname', '');
        }
    }

    public branchServiceAreaCode_onchange(event: any): void {
        if (this.getControlValue('BranchServiceAreaCode')) {
            let searchParams: URLSearchParams = new URLSearchParams();
            searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
            searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
            searchParams.set('BranchNumber', this.utils.getBranchCode());
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));
            this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.setControlValue('EmployeeSurname', '');
                        this.buildGrid();
                        this.riGrid.RefreshRequired();
                        this.errorModal.show(data, true);
                        return;
                    } else {
                        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                        this.buildGrid();
                        this.riGrid.RefreshRequired();
                    }
                },
                (error) => {
                    this.setControlValue('EmployeeSurname', '');
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        } else {
            this.setControlValue('EmployeeSurname', '');
            this.buildGrid();
            this.riGrid.RefreshRequired();
        }
    }

    private riExchange_UpDateHTMLDocument(): void {
        this.buildGrid();
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public cmdReportGeneration_onclick(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '2');
        postSearchParams.set('BranchNumber', this.utils.getBranchCode());
        let postParams: any = {};

        postParams.BranchServiceAreaCode = this.getControlValue('BranchServiceAreaCode');
        postParams.ServicePStartDate = this.getControlValue('ServicePStartDate');
        postParams.ServicePEndDate = this.getControlValue('ServicePEndDate');
        postParams.ServicePlanStatusCode = 'All';
        postParams.WeekNumber = this.getControlValue('ServiceWeekNumber');
        postParams.GeneratedTypeFilter = this.getControlValue('GeneratedTypeFilter');
        if (this.pageParams.generateAllServicePlanRpts) {
            postParams.Function = 'BuildReportGenerationListAmbius';
        } else {
            postParams.Function = '';
            postParams.GridName = 'GenServList';
            postParams.SelectAction = this.getControlValue('SelectAction');
            postParams.GridCacheTime = this.getControlValue('GridCacheTime');
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((e) => {
                if (e.hasError) {
                    this.errorModal.show(e, true);
                } else {
                    this.setControlValue('ServicePlanNumbersList', e.ServicePlanNumbersList);
                    this.setControlValue('BranchServiceAreaCodeList', e.BranchServiceAreaCodeList);
                    let strServiceAreasNumbers, strServiceNumbers, intCount;
                    if (this.getControlValue('ServicePlanNumbersList') && this.getControlValue('BranchServiceAreaCodeList')) {
                        if (this.pageParams.generateAllServicePlanRpts) {
                            strServiceAreasNumbers = this.getControlValue('BranchServiceAreaCodeList').split(',');
                            strServiceNumbers = this.getControlValue('ServicePlanNumbersList').split(',');
                            intCount = 0;
                            do {
                                this.generateServicePlanReportInfo(strServiceAreasNumbers[intCount], strServiceNumbers[intCount]);
                                intCount += 1;
                            }
                            while (intCount < strServiceAreasNumbers.length);
                        } else {
                            this.setControlValue('ReportJobNumber', e.ReportNumber);
                            if (this.getControlValue('SelectAction') === 'PrintSelected') {
                                this.printReport();
                            } else {
                                if (this.getControlValue('GenerateOption') === 'Both') {
                                    this.setControlValue('GenerateOption', 'Receipts');
                                }
                                this.generateServicePlanReportInfo(this.getControlValue('BranchServiceAreaCodeList'), this.getControlValue('ServicePlanNumbersList'));
                            }
                        }
                    }
                    this.setControlValue('SelectAction', '');
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private generateServicePlanReportInfo(BSACode: any, SPNumber: any): void {
        let strProgramName, strReportDesc = '';

        if (this.pageParams.generateAllServicePlanRpts) {
            strProgramName = 'iCABSServiceDeliveryNoteReportGeneration.p';
        } else {
            switch (this.getControlValue('GenerateOption')) {
                case 'Listing':
                    strProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
                    strReportDesc = 'Service Listing';
                    break;
                case 'ListingRem':
                    strProgramName = 'iCABSServiceDeliveryNoteListRemGeneration.p';
                    strReportDesc = 'Service Listing - Removals Only';
                    break;
                case 'Receipts':
                    strProgramName = 'iCABSServiceDeliveryNoteReportGeneration.p';
                    strReportDesc = 'Service Receipts';
                    break;
                case 'Both':
                    strProgramName = 'iCABSServiceDeliveryNoteListGeneration.p';
                    strReportDesc = 'Service Listing';
                    break;
                case 'TimeSheet':
                    strProgramName = 'iCABSServiceTimeSheetGeneration.p';
                    strReportDesc = 'Service Worklist and Timesheet';
                    break;
            }
            this.getTranslatedValue(strReportDesc, null).subscribe((res: string) => {
                if (res) {
                    strReportDesc = res;
                }
            });
        }
        let strTransReceiptDesc, areaText, planText;
        areaText = 'Area';
        this.getTranslatedValue('Area', null).subscribe((res: string) => {
            if (res) {
                areaText = res;
            }
        });
        planText = 'Plan';
        this.getTranslatedValue('Plan', null).subscribe((res: string) => {
            if (res) {
                planText = res;
            }
        });

        strTransReceiptDesc = strReportDesc + ' - ' + areaText + ' ' + BSACode + ' - ' + planText + ' ' + SPNumber;
        let strDescription = strTransReceiptDesc;
        let strStartDate = this.utils.formatDate(new Date());
        let date = new Date();
        let strStartTime = this.utils.hmsToSeconds(this.utils.Time());
        let strParamName = 'BusinessCodeBranchNumberBranchServiceAreaCodeServicePlanNumberIncludeLocationsNumberOfFormsRepManDest';
        let strParamValue = this.businessCode() + '' + this.utils.getBranchCode() + '' + BSACode + '' + SPNumber + '' + 'false' + '' + '4' + '' + 'batchReportID';

        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '0');
        let postParams: any = {};
        postParams.Description = strDescription;
        postParams.ProgramName = strProgramName;
        postParams.StartDate = strStartDate;
        postParams.StartTime = strStartTime;
        postParams.Report = 'report';
        postParams.ParameterName = strParamName;
        postParams.ParameterValue = strParamValue;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, postSearchParams, postParams)
            .subscribe((e) => {
                this.information2Display = true;
                this.information2 = e.fullError;

                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /**
     * On BranchServiceAreaCode tab-out
     * @param data
     */
    public onServiceAreaCodeChange(data: any): void {
        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.countryCode());
        searchParams.set(this.serviceConstants.Action, '0');

        searchParams.set('BranchNumber', this.utils.getBranchCode());
        searchParams.set('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, searchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.setControlValue('BranchServiceAreaCode', this.getControlValue('BranchServiceAreaCode').toUpperCase());

                if (data.hasError) {
                    this.errorModal.show(data.errorMessage, true);
                    return;
                }
                this.setControlValue('EmployeeSurname', data.EmployeeSurname);
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public serviceAreaSearch(data: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'BranchServiceAreaCode', data.BranchServiceAreaCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'EmployeeSurname', data.EmployeeSurname);
        this.riExchange_UpDateHTMLDocument();
    }

    public effectiveDate_onChange(value: any, fieldName: any): void {
        if (value && value.value) {
            if (fieldName === 'ServicePEndDate' && this.getweekNumber) {
                this.setControlValue('previousEndDate', this.getControlValue('ServicePEndDate'));
            }
            this.setControlValue(fieldName, value.value);
            if (fieldName === 'ServicePEndDate') {
                if (this.getweekNumber) {
                    this.riExchange_CBORequest();
                } else {
                    this.getweekNumber = true;
                }
            }
        } else {
            this.setControlValue(fieldName, '');
        }
    }

    public refresh(): void {
        this.setControlValue('GridCacheTime', this.utils.Time());
        this.setControlValue('SelectAction', '');
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        this.riGrid.RefreshRequired();
        this.riGrid_BeforeExecute();
    }

    public ClearTable(): void {
        this.riGrid.ResetGrid();
    }
}
