import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../app/base/BaseComponent';
import { PageIdentifier } from '../../../base/PageIdentifier';
import { ICabsModalVO } from '../../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from '../../../../shared/services/riMaintenancehelper';
import { RouteAwayComponent } from '../../../../shared/components/route-away/route-away';
import { BranchSearchComponent } from '../../../../app/internal/search/iCABSBBranchSearch';
import { BranchServiceAreaSearchComponent } from './../../../internal/search/iCABSBBranchServiceAreaSearch';
import { RegulatoryAuthoritySearchComponent } from './../../../internal/search/iCABSBRegulatoryAuthoritySearch.component';
import { ScreenNotReadyComponent } from '../../../../shared/components/screenNotReady';


@Component({
    templateUrl: 'iCABSARDailyPrenotificationReport.html'
})

export class DailyPrenotificationReportComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('branchSearchDropDown') branchSearchDropDown: BranchSearchComponent;
    // URL Query Parameters
    private queryParams: Object = {
        operation: 'ApplicationReport/iCABSARDailyPrenotificationReport',
        module: 'waste',
        method: 'service-delivery/maintenance'
    };
    public pageId: string = '';
    public controls: Array<Object> = [
        { name: 'BranchNumber', type: MntConst.eTypeInteger },
        { name: 'BranchName', type: MntConst.eTypeText },
        { name: 'BranchServiceAreaCode', required: true, type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', disabled: true, type: MntConst.eTypeText },
        { name: 'RegulatoryAuthorityNumber', required: true, type: MntConst.eTypeInteger },
        { name: 'RegulatoryAuthorityName', disabled: true, type: MntConst.eTypeText },
        { name: 'RepDest' },
        { name: 'Printers' },
        { name: 'DateFrom', required: true, type: MntConst.eTypeDate },
        { name: 'DateTo', required: true, type: MntConst.eTypeDate }
    ];
    public isPrinters: boolean = false;
    public thInformation: any;
    public isThInformationDisplayed: boolean = false;
    public inputParams: any = {
        branchParams: {
            'parentMode': 'LookUp'
        }
    };
    public ellipsis: any = {
        service: {
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp-Emp'
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
        regAuthority: {
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp'
            },
            modalConfig: {
                backdrop: 'static',
                keyboard: true
            },
            contentComponent: ScreenNotReadyComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSARDAILYPRENOTIFICATIONREPORT;
        this.browserTitle = this.pageTitle = 'Daily Prenotification Report';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    ngAfterViewInit(): void {
        this.branchSearchDropDown.active = {
            id: this.utils.getBranchCode(),
            text: this.utils.getBranchText()
        };
        this.setControlValue('BranchNumber', this.branchSearchDropDown.active.id);
        this.setControlValue('BranchName', this.branchSearchDropDown.active.text);
    }

    private windowOnLoad(): void {
        this.setControlValue('RepDest', 'direct');
        let firstDay = this.globalize.parseDateToFixedFormat(new Date()).toString();
        let lastDay = this.globalize.parseDateToFixedFormat(this.utils.TodayAsDDMMYYYY()).toString();
        this.setControlValue('DateFrom', this.globalize.parseDateStringToDate(firstDay));
        this.setControlValue('DateTo', this.globalize.parseDateStringToDate(lastDay));
    }

    public onBranchDataReceived(data: any): void {
        if (data['BranchNumber']) {
            this.setControlValue('BranchNumber', data['BranchNumber']);
            this.setControlValue('BranchName', data['BranchName']);
        } else {
            this.setControlValue('BranchNumber', '');
            this.setControlValue('BranchName', '');
        }
    }

    public onserviceAreaDataReceived(data: any): void {
        if (data) {
            this.setControlValue('BranchServiceAreaCode', data.BranchServiceAreaCode);
            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        }
    }

    public onregAuthorityDataReceived(data: any): void {
        //TO DO: iCABSBRegulatoryAuthoritySearch is not yet developed
    }

    public selectedReport(event: string): void {
        this.setControlValue('RepDest', event);
    }

    public onServiceAreaChange(): void {
        if (this.getControlValue('BranchServiceAreaCode')) {
            let searchParams: URLSearchParams;
            searchParams = this.getURLSearchParamObject();
            searchParams.set(this.serviceConstants.Action, '6');
            searchParams.set('PostDesc', 'BranchServiceArea');
            let bodyParams: any = {};
            bodyParams['BranchNumber'] = this.getControlValue('BranchNumber');
            bodyParams['BranchServiceAreaCode'] = this.getControlValue('BranchServiceAreaCode');
            this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, bodyParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.setControlValue('EmployeeSurname', '');
                    }
                    else
                        this.setControlValue('EmployeeSurname', data.EmployeeSurname);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                }
            );
        }
        else
            this.setControlValue('EmployeeSurname', '');
    }

    public onRegAuthorityChange(): void {
        if (this.getControlValue('RegulatoryAuthorityNumber')) {
            let searchParams: URLSearchParams;
            searchParams = this.getURLSearchParamObject();
            searchParams.set(this.serviceConstants.Action, '6');
            searchParams.set('PostDesc', 'RegulatoryAuthority');
            let bodyParams: any = {};
            bodyParams['RegulatoryAuthorityNumber'] = this.getControlValue('RegulatoryAuthorityNumber');
            this.httpService.makePostRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams, bodyParams).subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.setControlValue('RegulatoryAuthorityName', '');
                        this.setControlValue('RegulatoryAuthorityNumber', '');
                    }
                    else
                        this.setControlValue('RegulatoryAuthorityName', data.RegulatoryAuthorityName);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                }
            );
        }
        else
            this.setControlValue('RegulatoryAuthorityNumber', '');
    }

    public onClickSubmit(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            let searchParams: URLSearchParams;
            let date = new Date();
            searchParams = this.getURLSearchParamObject();
            searchParams.set(this.serviceConstants.Action, '0');
            searchParams.set('Description', 'Daily Prenotification Report');
            searchParams.set('ProgramName', 'iCABSDailyPrenotificationGeneration.p');
            searchParams.set('StartDate', this.globalize.parseDateToFixedFormat(date).toString());
            searchParams.set('StartTime', ((date.getHours() * 60 + date.getMinutes()) * 60) + date.getSeconds().toString());
            searchParams.set('ParameterName', 'BusinessCodeBranchNumberBranchServiceAreaCodeRegulatoryAuthorityNumberDateFromDateToRepDest');
            searchParams.set('ParameterValue', this.businessCode() + '' + this.getControlValue('BranchNumber') + '' + this.getControlValue('BranchServiceAreaCode') + '' + this.getControlValue('RegulatoryAuthorityNumber') + '' + this.getControlValue('DateFrom') + '' +
                this.getControlValue('DateTo') + '' + this.getControlValue('RepDest') + '');
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.queryParams['method'], this.queryParams['module'], this.queryParams['operation'], searchParams)
                .subscribe(
                (data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError) {
                        this.thInformation = data.fullError;
                        this.isThInformationDisplayed = true;
                    }
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                }
                );
        }
    }
}
