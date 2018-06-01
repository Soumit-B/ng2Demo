import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MntConst } from '../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAServiceSummaryDetail.html'
})

export class ServiceSummaryDetailComponent extends BaseComponent implements OnInit, AfterViewInit , OnDestroy {
    public controls = [
        { name: 'ContractNumber', readonly: false, disabled: true, required: false },
        { name: 'ContractName', readonly: false, disabled: true, required: false },
        { name: 'PremiseNumber', readonly: false, disabled: true, required: false },
        { name: 'PremiseName', readonly: false, disabled: true, required: false },
        { name: 'ProductCode', readonly: false, disabled: true, required: false },
        { name: 'ProductDesc', readonly: false, disabled: true, required: false },
        { name: 'TrialPeriodInd', readonly: false, disabled: true, required: false },
        { name: 'ProposedAnnualValue', readonly: false, disabled: true, required: false, type: MntConst.eTypeCurrency },
        { name: 'FreeOfChargeInd', readonly: false, disabled: true, required: false },
        { name: 'SeasonalServiceInd', readonly: false, disabled: true, required: false },
        { name: 'SeasonalTemplateNumber', readonly: false, disabled: true, required: false },
        { name: 'SeasonalTemplateName', readonly: false, disabled: true, required: false },
        { name: 'AnnualCalendarInd', readonly: false, disabled: true, required: false },
        { name: 'AnnualCalendarTemplateNumber', readonly: false, disabled: true, required: false },
        { name: 'AnnualCalendarTemplateName', readonly: false, disabled: true, required: false },
        { name: 'ServiceCoverRowID', readonly: false, disabled: true, required: false },
        { name: 'ServiceCoverNumber', readonly: false, disabled: true, required: false },
        { name: 'TrialPeriodEndDate', readonly: false, disabled: true, required: false }

    ];
    public pageId: string = '';
    public lookUpSubscription: Subscription;
    public dtTrialPeriodEndDate: Date = null;

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Service Cover Detail';
        this.window_onload();
    }

    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }
    ngAfterViewInit(): void {
        this.utils.setTitle('Service Cover Detail');
    }

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICESUMMARYDETAIL;
    }

    public window_onload(): void {
        this.dtTrialPeriodEndDate = null;
        this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.setControlValue('PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        switch (this.parentMode) {
            case 'Contract':
            case 'Premise':
                this.setControlValue('ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverRowID'));
        }
        this.doLookupAllData();
    }

    public doLookupAllData(): void {
        let lookupIP = [
            {
                'table': 'ServiceCover',
                'query': {
                    'ContractNumber': this.getControlValue('ContractNumber'),
                    'PremiseNumber': this.getControlValue('PremiseNumber'),
                    'ProductCode': this.getControlValue('ProductCode'),
                    'ROWID': this.getControlValue('ServiceCoverRowID')
                },
                'fields': ['ContractNumber', 'PremiseNumber', 'ProductCode', 'ServiceCoverNumber', 'TrialPeriodInd', 'TrialPeriodEndDate', 'ProposedAnnualValue',
                    'FreeOfChargeInd', 'SeasonalServiceInd', 'SeasonalTemplateNumber', 'AnnualCalendarInd', 'AnnualCalendarTemplateNumber']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.hasError) {
                this.errorService.emitError(data);
            } else {
                if (data[0][0]) {
                    let AnnualCalendarInd = data[0][0].AnnualCalendarInd;
                    let AnnualCalendarTemplateNumber = data[0][0].AnnualCalendarTemplateNumber;
                    let ContractNumber = data[0][0].ContractNumber;
                    let FreeOfChargeInd = data[0][0].FreeOfChargeInd;
                    let PremiseNumber = data[0][0].PremiseNumber;
                    let ProductCode = data[0][0].ProductCode;
                    let ProposedAnnualValue = data[0][0].ProposedAnnualValue;
                    let SeasonalServiceInd = data[0][0].SeasonalServiceInd;
                    let SeasonalTemplateNumber = data[0][0].SeasonalTemplateNumber;
                    let ServiceCoverNumber = data[0][0].ServiceCoverNumber;
                    let TrialPeriodEndDate = data[0][0].TrialPeriodEndDate;
                    let TrialPeriodInd = data[0][0].TrialPeriodInd;
                    let ttServiceCover = data[0][0].ttServiceCover;

                    this.setControlValue('AnnualCalendarInd', AnnualCalendarInd);
                    this.setControlValue('AnnualCalendarTemplateNumber', AnnualCalendarTemplateNumber);
                    this.setControlValue('ContractNumber', ContractNumber);
                    this.setControlValue('FreeOfChargeInd', FreeOfChargeInd);
                    this.setControlValue('PremiseNumber', PremiseNumber);
                    this.setControlValue('ProductCode', ProductCode);
                    this.setControlValue('ProposedAnnualValue', ProposedAnnualValue);
                    this.setControlValue('SeasonalServiceInd', SeasonalServiceInd);
                    this.setControlValue('SeasonalTemplateNumber', SeasonalTemplateNumber);
                    this.setControlValue('ServiceCoverNumber', ServiceCoverNumber);
                    this.setControlValue('TrialPeriodEndDate', TrialPeriodEndDate);
                    this.setControlValue('TrialPeriodInd', TrialPeriodInd);
                    if (this.getControlValue('TrialPeriodEndDate'))
                        this.dtTrialPeriodEndDate = new Date(this.getControlValue('TrialPeriodEndDate'));
                    else
                        this.dtTrialPeriodEndDate = null;
                }
                this.doLookupOtherData();
            }
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    }

    public doLookupOtherData(): void {
        let lookupIP = [
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
            },
            {
                'table': 'SeasonalTemplate',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'SeasonalTemplateNumber': this.getControlValue('SeasonalTemplateNumber')
                },
                'fields': ['TemplateName']
            },
            {
                'table': 'AnnualCalendarTemplate',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'AnnualCalendarTemplateNumber': this.getControlValue('AnnualCalendarTemplateNumber')
                },
                'fields': ['TemplateName']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data.hasError) {
                this.errorService.emitError(data);
            }
            else {
                let Contract = data[0][0];
                if (Contract) {
                    this.setControlValue('ContractName', Contract.ContractName);
                }
                let Premise = data[1][0];
                if (Premise) {
                    this.setControlValue('PremiseName', Premise.PremiseName);
                }
                let Product = data[2][0];
                if (Product) {
                    this.setControlValue('ProductDesc', Product.ProductDesc);
                }
                let SeasonalTemplate = data[3][0];
                if (SeasonalTemplate) {
                    this.setControlValue('SeasonalTemplateName', SeasonalTemplate.TemplateName);
                }
                let AnnualCalendarTemplate = data[4][0];
                if (AnnualCalendarTemplate) {
                    this.setControlValue('AnnualCalendarTemplateName', AnnualCalendarTemplate.TemplateName);
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
