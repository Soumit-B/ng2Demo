import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, AfterViewInit, OnDestroy, Injector } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../base/BaseComponent';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';


@Component({
    templateUrl: 'iCABSAServiceCoverSeasonMaintenance.html'
})

export class ServiceCoverSeasonMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    private xhrParams: any = {
        module: 'template',
        method: 'service-planning/maintenance',
        operation: 'Application/iCABSAServiceCoverSeasonMaintenance'
    };

    public setFocusOnSeasonStartDate = new EventEmitter<boolean>();
    public setFocusOnSeasonEndDate = new EventEmitter<boolean>();
    public setFocusOnActualSeasonNumber = new EventEmitter<boolean>();

    public pageId: string = '';
    public controls: Array<any> = [
        { name: 'ContractNumber', disabled: true, required: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ContractName', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ProductCode', disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PremiseNumber', disabled: true, required: true, type: MntConst.eTypeInteger },
        { name: 'PremiseName', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'ServiceCoverSeasonNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'ActualSeasonNumber', required: true, type: MntConst.eTypeInteger, commonValidator: true },
        { name: 'VisitsPerSeason', type: MntConst.eTypeInteger, commonValidator: true },
        { name: 'SeasonStartDate', required: true, type: MntConst.eTypeDate },
        { name: 'SeasonStartWeek', required: true, type: MntConst.eTypeInteger, commonValidator: true },
        { name: 'SeasonStartYear', required: true, type: MntConst.eTypeInteger, commonValidator: true },
        { name: 'SeasonEndDate', required: true, type: MntConst.eTypeDate },
        { name: 'SeasonEndWeek', required: true, type: MntConst.eTypeInteger, commonValidator: true },
        { name: 'SeasonEndYear', required: true, type: MntConst.eTypeInteger, commonValidator: true },
        // hidden
        { name: 'ServiceCoverSeasonROWID', required: false },
        { name: 'ServiceCoverNumber', type: MntConst.eTypeInteger },
        { name: 'Function', required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERSEASONMAINTENANCE;
        this.setBrowserTitle();
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.windowOnload();
        }
        this.routeAwayUpdateSaveFlag();
    }

    ngAfterViewInit(): void {
        this.setBrowserTitle();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    private setBrowserTitle(): void {
        this.browserTitle = this.pageTitle = 'Service Cover Season Maintenance';
    }

    private windowOnload(): void {
        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('ContractName');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('PremiseName');
        this.riExchange.getParentHTMLValue('ProductCode');
        this.riExchange.getParentHTMLValue('ProductDesc');
        this.setControlValue('ServiceCoverNumber', this.riExchange.getParentHTMLValue('ServiceCoverNumber'));

        this.riMaintenanceNormalMode();
        switch (this.riExchange.getParentMode()) {
            case 'GridSeasonAdd':
                this.pageParams.riMaintenanceFunctionUpdate = false;
                this.pageParams.riMaintenanceFunctionAdd = true;
                this.riMaintenanceAddMode();
                break;
            case 'GridSeasonView':
                this.pageParams.riMaintenanceFunctionUpdate = false;
                this.pageParams.riMaintenanceFunctionAdd = true;
                this.loadParentRecord();
                break;
            case 'GridSeasonUpdate':
                this.pageParams.riMaintenanceFunctionUpdate = true;
                this.pageParams.riMaintenanceFunctionAdd = true;
                this.riMaintenanceUpdateMode();
                this.loadParentRecord();
                break;
            case 'GridSeasonViewFollowsTemplate':
                this.pageParams.riMaintenanceFunctionUpdate = false;
                this.pageParams.riMaintenanceFunctionAdd = false;
                this.loadParentRecord();
                break;
        }
        // Disable the key input fields - should never be able to change them.
        this.disableControl('ContractNumber', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('ServiceCoverNumber', true);
        this.disableControl('ProductCode', true);
        this.disableControl('ServiceCoverSeasonNumber', true);
        this.disableControl('VisitsPerSeason', true);
        // Ecexute current Mode
        this.riMaintenanceexecMode(this.pageParams.riMaintenanceCurrentMode);
    }

    private loadParentRecord(): void {
        this.setControlValue('ServiceCoverSeasonROWID', this.riExchange.getParentAttributeValue('ServiceCoverSeasonROWID'));
        this.riMaintenanceFetchRecord();
    }

    private updateDatePicker(date: any): any {
        if (date) {
            let getDate: any = this.globalize.parseDateToFixedFormat(date);
            return this.globalize.parseDateStringToDate(getDate);
        }
    };

    /*******************************************************************************
    * riMaintenance Events                                                        *
    *******************************************************************************/
    private riMaintenanceUpdateMode(): void {
        this.pageParams.riMaintenanceCurrentMode = MntConst.eModeUpdate;
    }

    private riMaintenanceAddMode(): void {
        this.pageParams.riMaintenanceCurrentMode = MntConst.eModeAdd;
    }

    private riMaintenanceNormalMode(): void {
        this.pageParams.riMaintenanceCurrentMode = MntConst.eModeNormal;
    }

    private riMaintenanceDeleteMode(): void {
        this.pageParams.riMaintenanceCurrentMode = MntConst.eModeDelete;
    }

    private riMaintenanceexecMode(mode: string): void {
        switch (mode) {
            case MntConst.eModeNormal:
                this.riMaintenanceEnableNormal();
                break;
            case MntConst.eModeUpdate:
                this.riMaintenanceBeforeUpdate();
                break;
            case MntConst.eModeAdd:
                this.riMaintenanceBeforeAdd();
                break;
            case MntConst.eModeSaveUpdate:
                this.riMaintenanceBeforeSave();
                this.confirm();
                break;
            case MntConst.eModeSaveAdd:
                this.riMaintenanceBeforeSave();
                this.confirm();
                break;
        }
    }

    private riMaintenanceExecContinue(mode: string): void {
        switch (mode) {
            case MntConst.eModeSaveUpdate:
                this.riMaintenanceAfterSave();
                break;
            case MntConst.eModeSaveAdd:
                this.riMaintenanceAfterSave();
                break;
        }
    }

    private riMaintenanceCancelEvent(mode: string): void {
        switch (mode) {
            case MntConst.eModeUpdate:
            case MntConst.eModeSaveUpdate:
                this.riMaintenanceFetchRecord();
                break;
            case MntConst.eModeAdd:
            case MntConst.eModeSaveAdd:
                if (this.pageParams.enableAddMode) {
                    this.riMaintenanceUpdateMode();
                    this.riMaintenanceFetchRecord();
                } else {
                    this.riMaintenanceNormalMode();
                }
                this.riMaintenanceexecMode(this.pageParams.riMaintenanceCurrentMode);
                break;
            default:
                this.riMaintenanceNormalMode();
                this.riMaintenanceexecMode(this.pageParams.riMaintenanceCurrentMode);
                break;
        }
    }

    private riMaintenanceAddTableCommit(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '0');

        search.set('ComponentReplacementROWID', this.pageParams.ComponentReplacementROWID);
        search.set('ContractNumber', this.getControlValue('ContractNumber') || '');
        search.set('PremiseNumber', this.getControlValue('PremiseNumber') || '');
        search.set('ProductCode', this.getControlValue('ProductCode') || '');
        search.set('ServiceCoverNumber', this.getControlValue('ServiceCoverNumber') || '');
        search.set('ServiceCoverSeasonNumber', this.getControlValue('ServiceCoverSeasonNumber') || '');
        search.set('ServiceCoverSeasonROWID', this.getControlValue('ServiceCoverSeasonROWID') || '');

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.setControlValue('ActualSeasonNumber', data.ActualSeasonNumber || '');
                    this.setControlValue('ServiceCoverSeasonNumber', data.ServiceCoverSeasonNumber || '');
                    this.setControlValue('SeasonStartDate', data.SeasonStartDate ? this.updateDatePicker(data.SeasonStartDate) : '');
                    this.setControlValue('SeasonEndDate', data.SeasonEndDate ? this.updateDatePicker(data.SeasonEndDate) : '');
                    this.setControlValue('SeasonStartWeek', data.SeasonStartWeek || '');
                    this.setControlValue('SeasonEndWeek', data.SeasonEndWeek || '');
                    this.setControlValue('SeasonStartYear', data.SeasonStartYear || '');
                    this.setControlValue('SeasonEndYear', data.SeasonEndYear || '');
                    this.setControlValue('VisitsPerSeason', data.VisitsPerSeason || '');
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private riMaintenanceAddVirtualTableCommit(): void {
        let lookupIP: Array<any> = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc']
            }
        ];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupIP).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            } else {
                if (data && data.length > 0) {
                    if (data[0] && data[0].length > 0) {
                        this.setControlValue('ContractName', data[0][0].ContractName || '');
                    }
                    if (data[1] && data[1].length > 0) {
                        this.setControlValue('PremiseName', data[1][0].PremiseName || '');
                    }
                    if (data[2] && data[2].length > 0) {
                        this.setControlValue('ProductDesc', data[2][0].ProductDesc || '');
                    }
                } else {
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                }
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        });

    }

    private riMaintenanceEnableNormal(): void {
        switch (this.riExchange.getParentMode()) {
            case 'GridSeasonAdd':
                this.pageParams.riMaintenanceFunctionUpdate = false;
                this.pageParams.riMaintenanceFunctionAdd = true;
                this.riMaintenanceAddMode();
                this.disableControls([]);
                break;
            case 'GridSeasonView':
                this.pageParams.riMaintenanceFunctionUpdate = false;
                this.pageParams.riMaintenanceFunctionAdd = true;
                this.loadParentRecord();
                this.disableControls([]);
                break;
            case 'GridSeasonUpdate':
                this.pageParams.riMaintenanceFunctionUpdate = true;
                this.pageParams.riMaintenanceFunctionAdd = true;
                this.riMaintenanceUpdateMode();
                this.loadParentRecord();
                this.riMaintenanceexecMode(this.pageParams.riMaintenanceCurrentMode);
                break;
            case 'GridSeasonViewFollowsTemplate':
                this.pageParams.riMaintenanceFunctionUpdate = false;
                this.pageParams.riMaintenanceFunctionAdd = false;
                this.loadParentRecord();
                this.disableControls([]);
                break;
        }
    }

    private riMaintenanceBeforeUpdate(): void {
        // enable Update Mode
        this.pageParams.riMaintenanceFunctionUpdate = true;
        this.pageParams.riMaintenanceFunctionAdd = true;

        this.pageParams.enableAddMode = true;

        this.disableControl('ActualSeasonNumber', true);
        this.setFocusOnSeasonStartDate.emit(true);
    }

    private riMaintenanceBeforeAdd(): void {
        this.enableControls(['ContractName', 'ProductDesc', 'PremiseName']);
        this.disableControl('ContractNumber', true);
        this.disableControl('PremiseNumber', true);
        this.disableControl('ServiceCoverNumber', true);
        this.disableControl('ProductCode', true);
        this.disableControl('ServiceCoverSeasonNumber', true);
        this.disableControl('VisitsPerSeason', true);
        this.disableControl('ActualSeasonNumber', false);

        this.riExchange.getParentHTMLValue('ContractNumber');
        this.riExchange.getParentHTMLValue('PremiseNumber');
        this.riExchange.getParentHTMLValue('ProductCode');
        this.riExchange.getParentHTMLValue('ServiceCoverNumber');

        // enable Add
        this.pageParams.riMaintenanceFunctionUpdate = true;
        this.pageParams.riMaintenanceFunctionAdd = false;

        // Focus on Actual Season Number
        this.setFocusOnActualSeasonNumber.emit(true);
        // clear Date
        this.setControlValue('SeasonStartDate', this.updateDatePicker(new Date()));
        this.setControlValue('SeasonEndDate', this.updateDatePicker(new Date()));
        this.setControlValue('SeasonStartDate', '');
        this.setControlValue('SeasonEndDate', '');

        // Look up virtual fields
        this.riMaintenanceAddVirtualTableCommit();
    }

    private riMaintenanceAfterSave(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, this.pageParams.actionAfterSave);

        let postDataAdd: Object = {};
        if (this.pageParams.riMaintenanceCurrentMode === MntConst.eModeSaveUpdate) {
            postDataAdd['ActualSeasonNumber'] = this.getControlValue('ActualSeasonNumber') || '';
            postDataAdd['SeasonStartDate'] = this.getControlValue('SeasonStartDate') || '';
            postDataAdd['SeasonEndDate'] = this.getControlValue('SeasonEndDate') || '';
            postDataAdd['ROWID'] = this.getControlValue('ServiceCoverSeasonROWID') || '';
        }
        if (this.pageParams.riMaintenanceCurrentMode === MntConst.eModeSaveAdd) {
            postDataAdd['ContractNumber'] = this.getControlValue('ContractNumber') || '';
            postDataAdd['PremiseNumber'] = this.getControlValue('PremiseNumber') || '';
            postDataAdd['ProductCode'] = this.getControlValue('ProductCode') || '';
            postDataAdd['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber') || '';
            postDataAdd['ServiceCoverItemNumber'] = this.getControlValue('ServiceCoverItemNumber') || '';
            postDataAdd['ServiceCoverSeasonNumber'] = this.getControlValue('ServiceCoverSeasonNumber') || '';
            postDataAdd['ActualSeasonNumber'] = this.getControlValue('ActualSeasonNumber') || '';
            postDataAdd['SeasonStartDate'] = this.getControlValue('SeasonStartDate') || '';
            postDataAdd['SeasonEndDate'] = this.getControlValue('SeasonEndDate') || '';
            postDataAdd['SeasonStartWeek'] = this.getControlValue('SeasonStartWeek') || '';
            postDataAdd['SeasonEndWeek'] = this.getControlValue('SeasonEndWeek') || '';
            postDataAdd['SeasonStartYear'] = this.getControlValue('SeasonStartYear') || '';
            postDataAdd['SeasonEndYear'] = this.getControlValue('SeasonEndYear') || '';
            postDataAdd['VisitsPerSeason'] = this.getControlValue('VisitsPerSeason') || '';
            postDataAdd['Function'] = 'GetVisitsAtStartDate';
        }

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, postDataAdd)
            .subscribe((data: any) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.markAsPrestine();
                    let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully);
                    this.modalAdvService.emitMessage(modalVO);
                    this.setControlValue('ServiceCoverSeasonNumber', data.ServiceCoverSeasonNumber);
                    if (this.pageParams.riMaintenanceCurrentMode === MntConst.eModeSaveUpdate)
                        this.setControlValue('ServiceCoverSeasonROWID', data.ttServiceCoverSeason);
                    else
                        this.setControlValue('ServiceCoverSeasonROWID', data.ServiceCoverSeason);
                    this.riMaintenanceUpdateMode();
                    this.riMaintenanceexecMode(this.pageParams.riMaintenanceCurrentMode);
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private riMaintenanceBeforeConfirm(): boolean {
        if (this.uiForm.valid) return true;
        else return false;
    }

    private riMaintenanceBeforeSave(): void {
        this.riMaintenanceAddVirtualTableCommit();
    }

    private riMaintenanceFetchRecord(): void {
        this.riMaintenanceAddTableCommit();
        this.riMaintenanceAddVirtualTableCommit();
    }


    /*******************************************************************************
    * riMaintenance LifeCycle hooks Events*
    *******************************************************************************/
    private confirm(): any {
        if (this.riMaintenanceBeforeConfirm()) {
            let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.confirmed.bind(this));
            this.modalAdvService.emitPrompt(modalVO);
        }
    }

    private confirmed(obj: any): any {
        this.riMaintenanceExecContinue(this.pageParams.riMaintenanceCurrentMode);
    }

    private resetControl(): void {
        this.clearControls(['ContractNumber', 'ContractName', 'ProductCode', 'ProductDesc', 'PremiseNumber', 'PremiseName', 'ServiceCoverNumber', 'ServiceCoverSeasonROWID']);
        this.markAsPrestine();
    }

    private markAsPrestine(): void {
        this.controls.forEach((i) => {
            this.uiForm.controls[i.name].markAsPristine();
            this.uiForm.controls[i.name].markAsUntouched();
        });
    }

    /*******************************************************************************
    * Misc. Routines *
    *******************************************************************************/
    private validateFromWeek(): void {
        this.seasonalWeekChange('GetWeekStartFromWeek', this.pageParams.opFromWeek, this.pageParams.opFromYear, this.pageParams.ipFromDate);
    }

    private validateToWeek(): void {
        this.seasonalWeekChange('GetWeekEndFromWeek', this.pageParams.opFromWeek, this.pageParams.opFromYear, this.pageParams.ipFromDate);
    }

    private seasonalDateChange(ipFromDate: any, opFromWeek: any, opFromYear: any): void {
        if (ipFromDate.value) {
            let search: URLSearchParams = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '6');

            let postDataAdd: Object = {};
            postDataAdd['Function'] = 'GetWeekFromDate';
            postDataAdd['WeekCalcDate'] = ipFromDate.value;

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, postDataAdd)
                .subscribe(
                (e) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (e.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                    } else {
                        if (e.WeekCalcNumber) {
                            this.setControlValue(opFromWeek.id, e.WeekCalcNumber);
                            this.setControlValue(opFromYear.id, e.WeekCalcYear);
                            this.uiForm.controls[opFromWeek.id].markAsDirty();
                            this.uiForm.controls[opFromYear.id].markAsDirty();
                        }
                    }
                }, (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        } else {
            this.setControlValue(opFromWeek.id, '');
            this.setControlValue(opFromYear.id, '');
        }
    }


    private seasonalWeekChange(ipRequestFunction: string, ipFromWeek: any, ipFromYear: any, opFromDate: any): void {
        if (ipFromWeek && ipFromYear) {

            // ' this'isError', in order to get the formatting correct, and to check that the user has not
            // ' entered an incorrect value
            if (!this.riExchange.riInputElement.isError(this.uiForm, ipFromWeek.id)
                && !this.riExchange.riInputElement.isError(this.uiForm, ipFromYear.id)) {

                let search: URLSearchParams = this.getURLSearchParamObject();
                search.set(this.serviceConstants.Action, '6');

                let postDataAdd: Object = {};
                postDataAdd['Function'] = ipRequestFunction;
                postDataAdd['WeekCalcNumber'] = ipFromWeek.value;
                postDataAdd['WeekCalcYear'] = ipFromYear.value;

                this.ajaxSource.next(this.ajaxconstant.START);
                this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, postDataAdd)
                    .subscribe(
                    (e) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        if (e.hasError) {
                            this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                        } else {
                            if (e.WeekCalcDate) {
                                if (opFromDate.id === 'SeasonEndDate')
                                    this.setControlValue('SeasonEndDate', this.updateDatePicker(e.WeekCalcDate));
                                if (opFromDate.id === 'SeasonStartDate')
                                    this.setControlValue('SeasonStartDate', this.updateDatePicker(e.WeekCalcDate));
                                this.setControlValue(ipFromWeek.id, e.WeekCalcNumber);
                                this.setControlValue(ipFromYear.id, e.WeekCalcYear);
                            }
                        }
                    }, (error) => {
                        this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                        this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    });
            } else {
                this.setControlValue(opFromDate.id, '');
            }
        }
    }

    /*******************************************************************************
    * OnClick Events *
    *******************************************************************************/
    public add(): void {
        this.resetControl();

        this.pageParams.riMaintenanceFunctionUpdate = true;
        this.pageParams.riMaintenanceFunctionAdd = false;

        this.riMaintenanceAddMode();
        this.riMaintenanceexecMode(this.pageParams.riMaintenanceCurrentMode);
    }

    public save(): void {
        this.pageParams.riMaintenanceCancelEvent = false;
        this.riExchange.validateForm(this.uiForm);
        if (this.uiForm.status.toUpperCase() === 'VALID') {
            switch (this.pageParams.riMaintenanceCurrentMode) {
                case MntConst.eModeAdd:
                case MntConst.eModeSaveAdd:
                    this.pageParams.actionAfterSave = 1;
                    this.pageParams.riMaintenanceCurrentMode = MntConst.eModeSaveAdd;
                    this.riMaintenanceexecMode(this.pageParams.riMaintenanceCurrentMode);
                    break;
                case MntConst.eModeUpdate:
                case MntConst.eModeSaveUpdate:
                    this.pageParams.actionAfterSave = 2;
                    this.pageParams.riMaintenanceCurrentMode = MntConst.eModeSaveUpdate;
                    this.riMaintenanceexecMode(this.pageParams.riMaintenanceCurrentMode);
                    break;
            }
        }
    }

    public cancel(): void {
        this.resetControl();
        this.riMaintenanceCancelEvent(this.pageParams.riMaintenanceCurrentMode);
    }

    /*******************************************************************************
    * OnChange Events *
    *******************************************************************************/

    public seasonStartWeekOnChange(e: any): void {
        this.pageParams.ipFromDate = {
            value: this.getControlValue('SeasonStartDate'),
            id: 'SeasonStartDate'
        };
        this.pageParams.opFromWeek = {
            value: this.getControlValue('SeasonStartWeek'),
            id: 'SeasonStartWeek'
        };
        this.pageParams.opFromYear = {
            value: this.getControlValue('SeasonStartYear'),
            id: 'SeasonStartYear'
        };
        this.validateFromWeek();
    }

    public seasonStartYearOnChange(e: any): void {
        this.pageParams.ipFromDate = {
            value: this.getControlValue('SeasonStartDate'),
            id: 'SeasonStartDate'
        };
        this.pageParams.opFromWeek = {
            value: this.getControlValue('SeasonStartWeek'),
            id: 'SeasonStartWeek'
        };
        this.pageParams.opFromYear = {
            value: this.getControlValue('SeasonStartYear'),
            id: 'SeasonStartYear'
        };
        this.validateFromWeek();
    }

    public seasonEndWeekOnChange(e: any): void {
        this.pageParams.ipFromDate = {
            value: this.getControlValue('SeasonEndDate'),
            id: 'SeasonEndDate'
        };
        this.pageParams.opFromWeek = {
            value: this.getControlValue('SeasonEndWeek'),
            id: 'SeasonEndWeek'
        };
        this.pageParams.opFromYear = {
            value: this.getControlValue('SeasonEndYear'),
            id: 'SeasonEndYear'
        };
        this.validateToWeek();
    }

    public seasonEndYearOnChange(e: any): void {
        this.pageParams.ipFromDate = {
            value: this.getControlValue('SeasonEndDate'),
            id: 'SeasonEndDate'
        };
        this.pageParams.opFromWeek = {
            value: this.getControlValue('SeasonEndWeek'),
            id: 'SeasonEndWeek'
        };
        this.pageParams.opFromYear = {
            value: this.getControlValue('SeasonEndYear'),
            id: 'SeasonEndYear'
        };
        this.validateToWeek();
    }

    public seasonStartDateOnChange(value: any): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'SeasonStartDate', value.value);

        this.pageParams.ipFromDate = {
            value: this.getControlValue('SeasonStartDate'),
            id: 'SeasonStartDate'
        };
        this.pageParams.opFromWeek = {
            value: this.getControlValue('SeasonStartWeek'),
            id: 'SeasonStartWeek'
        };
        this.pageParams.opFromYear = {
            value: this.getControlValue('SeasonStartYear'),
            id: 'SeasonStartYear'
        };

        this.seasonalDateChange(this.pageParams.ipFromDate, this.pageParams.opFromWeek, this.pageParams.opFromYear);

        if (value && value.value && (this.pageParams.riMaintenanceCurrentMode === MntConst.eModeUpdate)) {
            let search: URLSearchParams = this.getURLSearchParamObject();
            search.set(this.serviceConstants.Action, '6');

            let postDataAdd: Object = {};
            postDataAdd['Function'] = 'GetVisitsAtStartDate';
            postDataAdd['ContractNumber'] = this.getControlValue('ContractNumber');
            postDataAdd['PremiseNumber'] = this.getControlValue('PremiseNumber');
            postDataAdd['ProductCode'] = this.getControlValue('ProductCode');
            postDataAdd['ServiceCoverNumber'] = this.getControlValue('ServiceCoverNumber');
            postDataAdd['ServiceCoverSeasonNumber'] = this.getControlValue('ServiceCoverSeasonNumber');
            postDataAdd['ActualSeasonNumber'] = this.getControlValue('ActualSeasonNumber');
            postDataAdd['SeasonStartDate'] = this.getControlValue('SeasonStartDate');

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.xhrParams.method, this.xhrParams.module, this.xhrParams.operation, search, postDataAdd)
                .subscribe(
                (e) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (e.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(e.errorMessage, e.fullError));
                    } else {
                        this.setControlValue('VisitsPerSeason', e.VisitsPerSeason);
                    }
                }, (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        }
    }

    public seasonEndDateOnChange(value: any): void {
        this.pageParams.ipFromDate = {
            value: this.getControlValue('SeasonEndDate'),
            id: 'SeasonEndDate'
        };
        this.pageParams.opFromWeek = {
            value: this.getControlValue('SeasonEndWeek'),
            id: 'SeasonEndWeek'
        };
        this.pageParams.opFromYear = {
            value: this.getControlValue('SeasonEndYear'),
            id: 'SeasonEndYear'
        };
        this.seasonalDateChange(this.pageParams.ipFromDate, this.pageParams.opFromWeek, this.pageParams.opFromYear);
    }


    /*
    *  Alerts user when user is moving away without saving the changes. //CR implementation
    */
    public routeAwayUpdateSaveFlag(): void {
        this.uiForm.statusChanges.subscribe((value: any) => {
            if (this.uiForm.dirty === true) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }

}
