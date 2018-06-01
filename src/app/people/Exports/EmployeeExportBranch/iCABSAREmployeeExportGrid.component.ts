import { Component, OnInit, OnDestroy, Injector, ViewChild, Input } from '@angular/core';
import { ReplaySubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import { HttpService } from '../../../../shared/services/http-service';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { BaseComponent } from '../../../../app/base/BaseComponent';
import { EmployeeSearchComponent } from './../../../internal/search/iCABSBEmployeeSearch';
import { OccupationSearchComponent } from './../../../internal/search/iCABSSOccupationSearch.component';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSAREmployeeExportGrid.html'
})

export class EmployeeExportGridComponent extends BaseComponent implements OnInit, OnDestroy {
    private viewLevel: any;
    private levelCode: any;
    private isShowCheckIncludeLeftInd: boolean = false;
    private isShowCheckIncludeHumansInd: any = false;
    private delimeter: string = '';
    private queryParams: any = {
        'method': 'people/batch',
        'module': 'employee',
        'operation': 'ApplicationReport/iCABSAREmployeeExportGrid'
    };
    public pageId: string = '';
    public isTRBranch: boolean;
    public isTRRegion: boolean;
    public isTRDate: boolean;
    public batchSubmittedText: string;
    public isShowBatchSubmitted: boolean = false;
    public controls = [
        { name: 'BusinessCode', type: MntConst.eTypeCode },
        { name: 'BusinessDesc', type: MntConst.eTypeText },
        { name: 'RegionCode', type: MntConst.eTypeCode },
        { name: 'RegionDesc', type: MntConst.eTypeText },
        { name: 'BranchNumber', type: MntConst.eTypeInteger },
        { name: 'BranchName', type: MntConst.eTypeText },
        { name: 'EmployeeCode', type: MntConst.eTypeCode },
        { name: 'EmployeeSurname', type: MntConst.eTypeText },
        { name: 'OccupationFilter', type: MntConst.eTypeText },
        { name: 'IncludeLeftInd', type: MntConst.eTypeCheckBox },
        { name: 'LeftDate', type: MntConst.eTypeDate },
        { name: 'IncludeHumansInd', type: MntConst.eTypeCheckBox }
    ];
    public ellipsisConfig: any = {
        employee: {
            showCloseButton: true,
            showHeader: true,
            childConfigParams: {
                'parentMode': 'LookUp'
            },
            component: EmployeeSearchComponent
        },
        occupation: {
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUpMultiple'
            },
            component: OccupationSearchComponent
        }
    };

    constructor(injector: Injector, private xhr: HttpService) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAREMPLOYEEEXPORTGRID;
        this.browserTitle = 'Employee Extract Report';
        this.pageTitle = 'Employee Extract Generation';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.windowOnload();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnload(): void {
        let qtrEnd: any;
        this.isTRBranch = false;
        this.isTRRegion = false;
        this.isTRDate = false;
        this.disableControl('BusinessDesc', true);
        this.disableControl('RegionDesc', true);
        this.disableControl('BranchName', true);
        this.setControlValue('BusinessCode', this.businessCode());
        this.utils.getBusinessDesc(this.businessCode(), this.countryCode()).subscribe((data) => {
            this.setControlValue('BusinessDesc', data.BusinessDesc);
        });
        this.setControlValue('LeftDate', this.globalize.parseDateToFixedFormat(new Date()));
        if (this.riExchange.URLParameterContains('Business')) {
            this.viewLevel = 'Business';
        }
        else if (this.riExchange.URLParameterContains('Branch')) {
            this.viewLevel = 'Branch';
            this.setControlValue('BranchNumber', this.utils.getBranchCode());
            this.setControlValue('BranchName', this.utils.getBranchText(this.utils.getBranchCode()));
            this.isTRBranch = true;
            this.levelCode = this.utils.getBranchCode();
            this.disableControl('BranchNumber', true);
        }
        else if (this.riExchange.URLParameterContains('Region')) {
            this.viewLevel = 'Region';
            this.utils.getRegionCode().subscribe((data) => {
                let regionCode: any = data;
                this.setControlValue('RegionCode', regionCode);
                this.levelCode = regionCode;
                this.getRegionDesc(regionCode).subscribe((data) => {
                    this.setControlValue('RegionDesc', data);
                });
            });
            this.isTRRegion = true;
            this.disableControl('RegionCode', true);
        }
    }

    private getRegionDesc(regionCode: any): Observable<any> {
        let retObj: ReplaySubject<any> = new ReplaySubject(1);
        let lookupIP = [
            {
                'table': 'Region',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'RegionCode': regionCode
                },
                'fields': ['RegionDesc']
            }
        ];

        let queryLookUp = this.getURLSearchParamObject();
        queryLookUp.set(this.serviceConstants.Action, '0');
        queryLookUp.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        queryLookUp.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        queryLookUp.set(this.serviceConstants.MaxResults, '100');
        this.xhr.lookUpRequest(queryLookUp, lookupIP).subscribe(res => retObj.next(res.results[0][0].RegionDesc));
        return retObj;
    }

    public onEmployeeDataReceived(data: any): void {
        if (data) {
            this.setControlValue('EmployeeCode', data.EmployeeCode);
            this.setControlValue('EmployeeSurname', data.EmployeeSurname);
        }
    }

    public onOccupationDataReceived(data: any): void {
        if (data) {
            this.setControlValue('OccupationFilter', data.OccupationCode);
        }
    }

    public onChangeIncludeLeftIndCheckbox(event: any): void {
        this.isTRDate = this.getControlValue('IncludeLeftInd');
        this.isShowCheckIncludeLeftInd = this.getControlValue('IncludeLeftInd');
    }

    public onChangeIncludeHumansIndCheckbox(event: any): void {
        this.isShowCheckIncludeHumansInd = this.getControlValue('IncludeHumansInd');
    }

    public submitReportRequest(): void {
        let strDescription: any = 'Employee Extract';
        let strProgramName: any = 'iCABSEmployeeExtractBatch.p';
        let strStartDate: any;
        let strStartTime: any;
        let strParamName: any;
        let strParamValue: any;
        strParamName = 'BusinessCode' + this.delimeter +
            'EmployeeCode' + this.delimeter +
            'OccupationFilter' + this.delimeter +
            'IncludeLeftInd' + this.delimeter +
            'LeftDate' + this.delimeter +
            'IncludeHumansInd' + this.delimeter +
            'Level' + this.delimeter +
            'levelCode';
        strParamValue = this.businessCode() + this.delimeter +
            this.getControlValue('EmployeeCode') + this.delimeter +
            this.getControlValue('OccupationFilter') + this.delimeter +
            this.isShowCheckIncludeLeftInd + this.delimeter +
            this.getControlValue('LeftDate') + this.delimeter +
            this.isShowCheckIncludeHumansInd + this.delimeter +
            this.viewLevel + this.delimeter +
            this.levelCode;
        let date: Date = new Date();
        strStartDate = this.globalize.parseDateToFixedFormat(date);
        let formattedTime: any = Math.round(date.getTime() / (1000 * 60 * 60));
        strStartTime = this.globalize.parseTimeToFixedFormat(formattedTime);
        let searchParams: any = this.getURLSearchParamObject();
        searchParams.set(this.serviceConstants.Action, '0');
        searchParams.set('Description', strDescription);
        searchParams.set('ProgramName', strProgramName);
        searchParams.set('StartDate', strStartDate);
        searchParams.set('StartTime', strStartTime);
        searchParams.set('Report', 'Batch');
        searchParams.set('ParameterName', strParamName);
        searchParams.set('ParameterValue', strParamValue);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.isShowBatchSubmitted = true;
                this.batchSubmittedText = data.fullError;
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

}
