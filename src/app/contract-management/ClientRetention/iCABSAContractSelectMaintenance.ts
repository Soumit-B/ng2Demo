import { InternalSearchModuleRoutes } from './../../base/PageRoutes';
import { DISABLED } from '@angular/forms/src/model';
import { ConfirmOkComponent } from './../../../shared/components/confirm-ok/confirm-ok';
import { URLSearchParams } from '@angular/http';
import { Data } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageIdentifier } from './../../base/PageIdentifier';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, Injector, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ContractSearchComponent } from '../../internal/search/iCABSAContractSearch';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAContractSelectMaintenance.html'
})

export class ContractSelectMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('messageModal') public messageModal;
    @ViewChild('confirmstatusOkModal') public confirmstatusOkModal;;

    public pageId: string = '';

    public controls = [
        { name: 'ContractNumber', disabled: false, type: MntConst.eTypeCode },
        { name: 'ContractName', disabled: true, type: MntConst.eTypeText },
        { name: 'AccountNumber', disabled: true, type: MntConst.eTypeText },
        { name: 'Status', disabled: true, type: MntConst.eTypeText },
        { name: 'ContractCommenceDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'NegBranchNumber', disabled: true, type: MntConst.eTypeInteger },
        { name: 'ContractAnnualValue', disabled: true, type: MntConst.eTypeCurrency },
        { name: 'CurrentPremises', disabled: true, type: MntConst.eTypeInteger },
        { name: 'InvoiceAnnivDate', disabled: true, type: MntConst.eTypeDate },
        { name: 'InvoiceFrequencyCode', disabled: true, type: MntConst.eTypeInteger },
        { name: 'LostBusinessNoticePeriod', disabled: true, type: MntConst.eTypeInteger }
    ];

    public queryParams: any = {
        operation: 'Application/iCABSAContractSelectMaintenance',
        module: 'contract',
        method: 'contract-management/maintenance'
    };

    public contractSearchParams: any = {
        'parentMode': 'LookUp',
        'showAddNew': false,
        'currentContractType': 'C',
        'currentContractTypeURLParameter': '<contract>'
    };

    public lookUpSubscription: Subscription;
    public showCloseButton: boolean = true;
    public contractSearchComponent = ContractSearchComponent;
    public isContractEllipsisDisabled: boolean = false;
    public viewTypesArray: Array<any>;
    public autoOpenSearch: boolean;
    public showMessageHeader: boolean = true;
    public showCancel: boolean = false;
    public showHeader: boolean = true;
    public pending: boolean;
    public ismenudisabled: boolean = true;

    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSACONTRACTSELECTMAINTENANCE;
        this.contractSearchComponent = ContractSearchComponent;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Contract Select';
        this.windowOnLoad();
    }

    ngAfterViewInit(): void {
        if (this.getControlValue('ContractNumber').trim() !== '') {
            this.autoOpenSearch = false;
            this.doLookupformData();
        } else {
            this.autoOpenSearch = true;
        }
    }

    public windowOnLoad(): void {
        if (this.parentMode === 'CallCentreSearchNew') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.doLookupformData();
        }
        else if (this.parentMode === 'ContactManagement') {
            this.setControlValue('ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
            this.setControlValue('ContractName', this.riExchange.getParentHTMLValue('ContractName'));
            this.doLookupformData();
        }
        if (this.riExchange.getRouterParams()['fromMenu']) {
            this.pending = true;
            this.viewTypesArray = [
                { text: 'Options', value: '' },
                { text: 'Contract', value: 'Contract' },
                { text: 'Request', value: 'Request' }];
        }
        else {
            this.viewTypesArray = [
                { text: 'Options', value: '' },
                { text: 'Request', value: 'Request' }];
        }
    }


    public doLookupformData(): void {
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.utils.getBusinessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName', 'ContractCommenceDate', 'ContractAnnualValue', 'CurrentPremises', 'AccountNumber', 'NegBranchNumber', 'InvoiceAnnivDate',
                    'InvoiceFrequencyCode', 'LostBusinessNoticePeriod']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (data[0].length > 0) {
                let contractdata = data[0][0];
                this.setControlValue('ContractName', contractdata.ContractName);
                this.setControlValue('AccountNumber', contractdata.AccountNumber);
                let ContractCommenceDate = this.globalize.parseDateToFixedFormat(contractdata.ContractCommenceDate).toString();
                this.setControlValue('ContractCommenceDate', this.globalize.parseDateStringToDate(ContractCommenceDate));
                this.setControlValue('NegBranchNumber', contractdata.NegBranchNumber);
                this.setControlValue('ContractAnnualValue', contractdata.ContractAnnualValue);
                this.setControlValue('CurrentPremises', contractdata.CurrentPremises);
                let InvoiceAnnivDate = this.globalize.parseDateToFixedFormat(contractdata.InvoiceAnnivDate).toString();
                this.setControlValue('InvoiceAnnivDate', this.globalize.parseDateStringToDate(InvoiceAnnivDate));
                this.setControlValue('InvoiceFrequencyCode', contractdata.InvoiceFrequencyCode);
                this.setControlValue('LostBusinessNoticePeriod', contractdata.LostBusinessNoticePeriod);
            } else {
                let cnumber = this.getControlValue('ContractNumber');
                this.uiForm.reset();
                this.setControlValue('ContractNumber', cnumber);
            }
        });


        this.ajaxSource.next(this.ajaxconstant.START);

        let searchParams: URLSearchParams = new URLSearchParams();
        searchParams.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        searchParams.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        searchParams.set(this.serviceConstants.Action, '6');
        searchParams.set('ContractNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'));

        let bodyParams: any = {};
        bodyParams['Function'] = 'GetStatus';

        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchParams, bodyParams).subscribe(
            (data) => {
                if (data.ErrorMessageDesc !== '') {
                    this.ismenudisabled = true;
                    this.confirmstatusOkModal.show({ msg: data.errorMessage, title: 'Message' }, false);
                    if (data.Status !== '') {
                        this.ismenudisabled = false;
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'Status', data.Status);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
                else {
                    this.ismenudisabled = false;
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'Status', data.Status);
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                }
            });
    }

    public onContractDataReceived(data: any): void {
        this.setControlValue('ContractNumber', data.ContractNumber);
        this.doLookupformData();
        this.setFormMode('update');
    }

    public onContractChange(): any {
        if (this.getControlValue('ContractNumber').trim() === '') {
            this.uiForm.reset();
        } else {
            this.doLookupformData();
        }
    }

    public onDataChanged(data: any): void {
        this.doLookupformData();
    }

    public onViewTypeCodeChange(viewType: any): void {
        if (viewType === 'Contract') {
            this.parentMode = 'Request';
            this.navigate('Request', this.ContractManagementModuleRoutes.ICABSACONTRACTMAINTENANCE, {
                parentMode: 'Request',
                ContractNumber: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                ContractName: this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName')
            });
        }
        else if (viewType === 'Request') {
            if (this.pending || this.parentMode === 'CallCentreSearchNew') {
                this.parentMode = 'Contract';
                if (this.riExchange.URLParameterContains('CurrentOnly')) {
                    this.navigate('Contract', InternalSearchModuleRoutes.ICABSALOSTBUSINESSREQUESTSEARCH, {
                        'CurrentOnly': true
                    });
                }
                else if (this.parentMode === 'ContactManagement') {
                    this.navigate('Contract', InternalSearchModuleRoutes.ICABSALOSTBUSINESSREQUESTSEARCH, {
                        'ContactManagement': true
                    });
                }
                else {
                    this.navigate('Contract', InternalSearchModuleRoutes.ICABSALOSTBUSINESSREQUESTSEARCH);
                }
            }
        }
    }

    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

}
