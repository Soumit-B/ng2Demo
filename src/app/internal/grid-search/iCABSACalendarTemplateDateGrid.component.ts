import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { GridAdvancedComponent } from './../../../shared/components/grid-advanced/grid-advanced';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Http, URLSearchParams } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { VariableService } from './../../../shared/services/variable.service';
import { ICabsModalVO } from '../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSACalendarTemplateDateGrid.html',
    styles: [`.error-disbaled { border: 1px solid red !important;}`]
})

export class CalendarTemplateDateGridComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild('riGrid') riGrid: GridAdvancedComponent;
    @ViewChild('calendarTemplateDateGridPagination') calendarTemplateDateGridPagination: PaginationComponent;
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptConfirmModal') public promptConfirmModal;
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('promptModal') public promptModal;
    public pageId: string = '';
    public blnVisitFreq: any;
    public cVisitFreq: any;
    public blnChangesMade: any;
    public curPage: number = 1;
    public totalRecords: number;
    public pageSize: number = 10;
    public trTemplate: boolean = false;
    public selectedYearList: any = [];
    public selectedYearListTemp: any = [];
    public isRequesting: any = true;
    public msgText: string;
    public isVisitError: boolean = false;
    public promptConfirmContent: any;
    public search: URLSearchParams = new URLSearchParams();
    public canDeactivateObservable: Observable<boolean>;
    public promptTitle: string = '';
    public promptContent: string = MessageConstant.Message.RouteAway;

    public promptModalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };
    private xhrParams = {
        module: 'template',
        method: 'service-planning/maintenance',
        operation: 'Application/iCABSACalendarTemplateDateGrid'
    };

    public legend = [
        { label: 'Empty', color: '#BFBFBF' },
        { label: 'Weekend', color: '#666666' },
        { label: 'Due', color: '#d9f2d9' },
        { label: 'Weekend Due', color: '#008000' }
    ];

    public controls = [
        { name: 'AnnualCalendarTemplateNumber', type: MntConst.eTypeInteger },
        { name: 'TemplateName' },
        { name: 'SelectedYear', type: MntConst.eTypeInteger },
        { name: 'VisitFrequency', type: MntConst.eTypeInteger },
        { name: 'TotalVisits', type: MntConst.eTypeInteger },
        { name: 'AnnualTolerance', type: MntConst.eTypeInteger },
        { name: 'AnnualType' },
        { name: 'ACTRowID' },
        { name: 'SelectedDay' },
        { name: 'SelectedMonth' },
        { name: 'SelectedYear' },
        { name: 'UpdateCalendar' }
    ];

    constructor(injector: Injector, public titleService: Title, private variableService: VariableService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACALENDARTEMPLATEDATEGRID;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.window_onload();
        this.getSysCharDtetails();
    }

    ngAfterViewInit(): void {
        let strDocTitle = 'Template Calendar';
        let businessName = this.utils.getBusinessText(this.utils.getBusinessCode());
        this.translateSubscription = this.localeTranslateService.ajaxSource$.subscribe(event => {
            try {
                this.getTranslatedValue(strDocTitle, null).subscribe((res: string) => {
                    if (res) {
                        this.titleService.setTitle(res);
                    } else {
                        this.titleService.setTitle(strDocTitle);
                    }
                });
            } catch (e) {
                //
            }
        });
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private window_onload(): void {

        this.msgText = 'Calendar updates cannot be earlier than the current year';
        this.riGrid.HidePageNumber = true;
        this.blnChangesMade = false;
        this.riGrid.PageSize = 10;
        this.riGrid.DefaultBorderColor = 'DDDDDD';
        //this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.FunctionPaging = false;
        this.riGrid.FixedWidth = true;
        this.disableControl('AnnualCalendarTemplateNumber', true);
        this.disableControl('TemplateName', true);
        this.disableControl('VisitFrequency', true);
        this.disableControl('TotalVisits', true);
        this.buildYearOptions();
        this.templateLoad();
        this.loadTolerance();
        this.buildGrid();
    }

    /*Speed script*/
    private getSysCharDtetails(): void {
        //SysChar
        // &IF DEFINED(I_ICABSCALENDARROLLOVERTYPECODES) = 0 &THEN
        //     {iCABSCalendarRolloverTypeCodes.i}
        // &ENDIF
        let sysCharList: number[] = [this.sysCharConstants.SystemCharCalenderTemplateVisitFreqOverwrite];
        let sysCharIP = {
            module: this.xhrParams.module,
            operation: this.xhrParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.lSCVisitFreq = record[0]['Required'];
            this.pageParams.cSCVisitFreq = record[0]['Text'];
            this.blnVisitFreq = this.pageParams.lSCVisitFreq;
            this.cVisitFreq = this.pageParams.cSCVisitFreq;
        });
    }

    private buildYearOptions(): void {
        for (let i = 1; i <= 7; i++) {
            this.buildYearOption((new Date().getFullYear()) - 5 + i, (new Date().getFullYear()) - 5 + i);
        }
        this.selectedYearList = this.selectedYearListTemp;
    }

    private buildYearOption(strValue: any, strText: any): void {
        this.selectedYearListTemp.push({ value: strValue, text: strText });
        if (strValue === new Date().getFullYear()) {
            this.setControlValue('SelectedYear', strValue);
        }
    }

    private templateLoad(): void {
        this.trTemplate = true;
        this.setControlValue('AnnualCalendarTemplateNumber', this.riExchange.getParentHTMLValue('AnnualCalendarTemplateNumber'));
        this.setControlValue('TemplateName', this.riExchange.getParentHTMLValue('TemplateName'));
        this.setControlValue('VisitFrequency', this.riExchange.getParentHTMLValue('VisitFrequency'));
        this.setControlValue('CalendarRolloverTypeCode', this.riExchange.getParentHTMLValue('CalendarRolloverTypeCode'));
        this.setControlValue('ACTRowID', this.riExchange.getParentHTMLValue('AnnualCalendarTemplateROWID'));
        this.setAttribute('AnnualCalendarTemplateROWID', this.riExchange.getParentHTMLValue('AnnualCalendarTemplateROWID'));
    }

    private loadTolerance(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.Function = 'GetTolerance';
        postParams.ACTRowID = this.getControlValue('ACTRowID');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    // this.modalAdvService.emitError(new ICabsModalVO(e));
                    this.messageModal.show(e, true);
                } else {
                    if (e.Tolerance !== '0') {
                        this.setControlValue('AnnualTolerance', e.Tolerance);
                    }
                    if (e.ToleranceType === '') {
                        this.setControlValue('AnnualType', 'None');
                    } else {
                        this.setControlValue('AnnualType', e.ToleranceType);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    private buildGrid(): any {

        let iLoop = 1;
        this.riGrid.Clear();
        this.riGrid.AddColumn('Month', 'Visit', 'Month', MntConst.eTypeText, 20);
        for (iLoop = 1; iLoop <= 31; iLoop++) {
            this.riGrid.AddColumn(iLoop.toString(), 'Visit', iLoop.toString(), MntConst.eTypeText, 4);
            this.riGrid.AddColumnAlign(iLoop.toString(), MntConst.eAlignmentCenter);
        }
        this.riGrid.AddColumn('Total', 'Visit', 'Total', MntConst.eTypeText, 20);
        this.riGrid.AddColumnAlign('Total', MntConst.eAlignmentCenter);
        this.riGrid.Complete();
        this.riGrid_beforeExecute();
    }

    private riGrid_beforeExecute(): void {
        this.isVisitError = false;
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'TotalVisits', false);
        //this.riGrid.Update = true;
        this.riGrid.UpdateBody = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid.UpdateHeader = true;

        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '2');
        this.search.set('riCacheRefresh', 'True');
        this.search.set('riGridMode', '0');
        this.search.set('riGridHandle', this.utils.randomSixDigitString());
        this.search.set('ACTRowID', this.getControlValue('ACTRowID'));
        this.search.set('SelectedDay', this.getControlValue('SelectedDay'));
        this.search.set('SelectedMonth', this.getControlValue('SelectedMonth'));
        this.search.set('SelectedYear', this.getControlValue('SelectedYear'));
        this.search.set('UpdateCalendar', this.getControlValue('UpdateCalendar'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, this.search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data) {
                    if (data && data.errorMessage) {
                        this.messageModal.show(data, true);
                    } else {
                        this.curPage = data.pageData ? data.pageData.pageNumber : 1;
                        this.totalRecords = data.pageData ? data.pageData.lastPageNumber * this.pageSize : 1;
                        //this.riGrid.Update = true;
                        this.riGrid.UpdateBody = true;
                        this.riGrid.UpdateFooter = true;
                        this.riGrid.UpdateHeader = true;
                        this.riGrid.Execute(data);
                    }
                }
            },
            (error) => {
                this.logger.log('Error', error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public riGrid_AfterExecute(): any {
        let iLoop;
        let oTR, oTD;
        let iBeforeCurrentMonth;
        let iAfterCurrentMonth;
        let obj = this.riGrid.HTMLGridBody.children[0].children[0];
        let currentMonth = new Date().getMonth();
        iBeforeCurrentMonth = new Date().getMonth();
        iAfterCurrentMonth = new Date().getMonth() + 1;
        let objList = document.querySelectorAll('.gridtable tbody > tr');
        if (objList && objList.length >= currentMonth) {
            let tr = objList[currentMonth];
            if (tr) {
                tr.setAttribute('class', 'currentMonth');
            }
        }
        let TotalString;
        TotalString = this.riGrid.HTMLGridBody.children[1].children[0].getAttribute('additionalproperty').split('|');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'TotalVisits', TotalString[0]);
        // this.isVisitError = false;
        // // this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'TotalVisits', false);
    }

    public tbody_onDblClick(event: any): void {
        let ele;
        // if( event.srcElement.style.cursor !== '' ) { //Should be uncommented when cursor issue in grid component is fixed
        if (event.srcElement.tagName === 'TD') {
            ele = event.srcElement;
        } else {
            ele = event.srcElement.parentElement.parentElement;
        }
        let date = ele.getAttribute('name');
        let month = ele.getAttribute('additionalproperty');
        if (Number(date) > 0 && Number(date) < 32) {
            this.setControlValue('SelectedDay', date);
            this.setControlValue('SelectedMonth', month);
            if (this.getControlValue('SelectedMonth') === '0') {
                this.messageModal.show({ msg: this.msgText, title: 'Message' }, false);
            } else {
                this.setControlValue('UpdateCalendar', 'True');
                this.riGrid_beforeExecute();
                this.setControlValue('UpdateCalendar', '');
                this.blnChangesMade = true;
            }
        }
        // }
    }

    public getCurrentPage(currentPage: any): void {
        this.curPage = currentPage.value;
        //this.riGrid.Update = true;
        this.riGrid.UpdateHeader = true;
        this.riGrid.UpdateRow = true;
        this.riGrid.UpdateFooter = true;
        this.riGrid_beforeExecute();
    }

    public refresh(): void {
        this.riGrid.RefreshRequired();
        this.riGrid_beforeExecute();
    }

    private saveContinue(): void {
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.AnnualCalendarTemplateNumber = this.getControlValue('AnnualCalendarTemplateNumber');
        postParams.SelectedYear = this.getControlValue('SelectedYear');
        postParams.Function = 'Save';
        postParams.ACTRowID = this.getControlValue('ACTRowID');
        postParams.AnnualTolerance = this.getControlValue('AnnualTolerance');
        postParams.AnnualType = this.getControlValue('AnnualType');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    // this.modalAdvService.emitError(new ICabsModalVO(e));
                    this.messageModal.show(e, true);
                } else {
                    this.formPristine();
                    this.riExchange_UnloadHTMLDocument();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    /** Save button clicked */
    public btnSave_OnClick(): void {
        let patt = new RegExp('^[0-9]*$');
        if (!patt.test(this.getControlValue('AnnualTolerance'))) {
            this.messageModal.show({ msg: 'Type Mismatch', title: 'Error' }, false);
            return;
        }
        this.promptConfirmContent = MessageConstant.Message.ConfirmRecord;
        let iVisitText, vloop, blnVisitFreqExcl = false;
        this.isVisitError = false;
        this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'TotalVisits', false);
        if (this.blnVisitFreq) {
            iVisitText = this.cVisitFreq.split(',');
            for (let vloop = 0; vloop < iVisitText.length; vloop++) {
                if (this.getControlValue('VisitFrequency').toString() === iVisitText[vloop].toString()) {
                    blnVisitFreqExcl = true;
                    break;
                }
            }
        }
        if (blnVisitFreqExcl || this.getControlValue('VisitFrequency') === this.getControlValue('TotalVisits')) {
            this.promptConfirmModal.show();
        } else {
            this.isVisitError = true;
            this.riExchange.riInputElement.SetErrorStatus(this.uiForm, 'TotalVisits', true);
        }
    }

    /*Prompt save callback*/
    public promptConfirmSave(): void {
        this.saveContinue();
    }

    /** Cancel clicked */
    public btnAbandon_OnClick(): void {
        this.riExchange_UnloadHTMLDocument();
    }

    private riExchange_UnloadHTMLDocument(): void {
        if (this.blnChangesMade) {
            this.undoGridChange();
        } else {
            this.location.back();
        }
    }

    private undoGridChange(): void {
        /*' Always call the clear up routine on exiting - if no changes have been made then
        ' nothing will happen in the .p
        ' Call this even after a save, as there may be stuff to roll back on other years*/
        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.AnnualCalendarTemplateNumber = this.getControlValue('AnnualCalendarTemplateNumber');
        postParams.Function = 'Abandon';
        postParams.ACTRowID = this.getControlValue('ACTRowID');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                if (e.hasError) {
                    // this.modalAdvService.emitError(new ICabsModalVO(e));
                    this.messageModal.show(e, true);
                } else {
                    this.location.back();
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public canDeactivate(): Observable<boolean> {
        let isUpdated: boolean = this.getControlValue('VisitFrequency').toString() === this.getControlValue('TotalVisits');
        this.routeAwayGlobals.setSaveEnabledFlag(!isUpdated);
        this.canDeactivateObservable = new Observable((observer) => {
            this.promptModal.saveEmit.subscribe((event) => {
                this.onCancel(true, observer);
            });
            this.promptModal.cancelEmit.subscribe((event) => {
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                document.querySelector('icabs-app .ajax-overlay')['style'].display = 'none';
                if (event.value === 'cancel') {
                    if (this.variableService.getBackClick() === true) {
                        this.variableService.setBackClick(false);
                        this.location.go(this.utils.getCurrentUrl());
                    }
                    observer.next(false);
                    setTimeout(() => {
                        this.router.navigate([], { skipLocationChange: true, preserveQueryParams: true });
                    }, 0);
                }
            });
            if ((!isUpdated && this.blnChangesMade) || this.uiForm.dirty) {
                this.promptModal.show();
                return;
            }
            observer.next(true);
        });
        return this.canDeactivateObservable;
    }

    public onCancel(routeAway?: boolean, observer?: any): void {

        let postSearchParams = this.getURLSearchParamObject();
        postSearchParams.set(this.serviceConstants.Action, '6');
        let postParams: any = {};
        postParams.AnnualCalendarTemplateNumber = this.getControlValue('AnnualCalendarTemplateNumber');
        postParams.Function = 'Abandon';
        postParams.ACTRowID = this.getControlValue('ACTRowID');
        // this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, postSearchParams, postParams)
            .subscribe(
            (e) => {
                // this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                if (e.errorMessage) {
                    this.displayError(e.errorMessage);
                    return;
                }
                if (!routeAway) {
                    this.location.back();
                } else {
                    observer.next(true);
                }
            },
            (error) => {
                // this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                document.querySelector('icabs-app .lazy-spinner .spinner')['style'].display = 'none';
                observer.next(false);
                this.displayError(MessageConstant.Message.GeneralError, error);
            });
    }
}
