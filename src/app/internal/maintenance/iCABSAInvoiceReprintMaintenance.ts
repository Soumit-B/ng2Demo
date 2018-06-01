import { GlobalConstant } from './../../../shared/constants/global.constant';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Utils } from './../../../shared/services/utility';
import { DropdownComponent } from './../../../shared/components/dropdown/dropdown';
import { HttpService } from './../../../shared/services/http-service';
import { ServiceConstants } from './../../../shared/constants/service.constants';
import { Logger } from '@nsalaun/ng2-logger';
import { URLSearchParams } from '@angular/http';
import { Component, OnInit, OnChanges, Input, EventEmitter, ViewChild, Output, Injector, OnDestroy } from '@angular/core';
import { LocaleTranslationService } from './../../../shared/services/translation.service';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'iCABSAInvoiceReprintMaintenance.html'
})

export class InvoiceReprintMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('errorModal') public errorModal;
    @ViewChild('messageModal') public messageModal;

    public search: URLSearchParams;
    public pageId: string = '';
    public pageTitle: string = '';
    public parentMode: string = '';
    public branchName: string = '';
    public backLinkText: string = '';
    private lookUpSubscription: Subscription;
    private invoiceReprintModel: any = {
        'InvoiceNumber': '',
        'AccountNumber': '',
        'AccountName': '',
        'InvoiceContactEmail': '',
        'InvoiceContactName': '',
        'ttInvoiceHeader': ''
    };


    public muleConfig = {
        method: 'contract-management/maintenance',
        module: 'contract-admin',
        operation: 'Application/iCABSAInvoiceReprintMaintenance',
        contentType: 'application/x-www-form-urlencoded',
        action: '0'
    };

    public controls = [
        { name: 'AccountNumber', readonly: false, disabled: true, required: false },
        { name: 'AccountName', readonly: false, disabled: true, required: false },
        { name: 'InvoiceNumber', readonly: false, disabled: true, required: false },
        { name: 'dInvoiceContactName', readonly: false, disabled: false, required: false },
        { name: 'dInvoiceContactEmail', readonly: false, disabled: false, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICEREPRINTMAINTENANCE;
        this.pageTitle = 'Invoice Reprint Maintenance';
        this.search = this.getURLSearchParamObject();
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.backLinkText = GlobalConstant.Configuration.BackText;
        this.invoiceReprintModel.InvoiceNumber = this.getFieldValue(this.riExchange.getParentHTMLValue('InvoiceNumber'));
        this.invoiceReprintModel.InvoiceRowId = this.getFieldValue(this.riExchange.getParentHTMLValue('InvoiceRowId'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.invoiceReprintModel.InvoiceNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceRowId', this.invoiceReprintModel.InvoiceRowId);
        this.fetchAcountNumber();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }


    public fetchAcountNumber(): void {
        let lookupIP = [
            {
                'table': 'InvoiceHeader',
                'query': {
                    'InvoiceNumber': this.invoiceReprintModel.InvoiceNumber
                },
                'fields': ['AccountNumber']
            }
        ];
        if (this.ajaxSource)
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            if (this.ajaxSource)
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0][0] && data[0][0].AccountNumber) {
                this.invoiceReprintModel.AccountNumber = data[0][0].AccountNumber;
                this.invoiceReprintModel.ttInvoiceHeader = data[0][0].ttInvoiceHeader || '';
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.invoiceReprintModel.AccountNumber);
                this.fetchLookupParams(this.invoiceReprintModel.AccountNumber);
            }
        });
    }

    public fetchLookupParams(acountNumber: any): void {
        let lookupIP = [
            {
                'table': 'InvoiceGroup',
                'query': {
                    'AccountNumber': acountNumber, 'BusinessCode': this.businessCode()
                },
                'fields': ['InvoiceContactEmail', 'InvoiceContactName']
            },
            {
                'table': 'Account',
                'query':
                {
                    'AccountNumber': acountNumber, 'BusinessCode': this.businessCode()
                },
                'fields': ['AccountName']
            }
        ];
        if (this.ajaxSource)
        this.ajaxSource.next(this.ajaxconstant.START);

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data[0][0]) {
                if (data[0][0].InvoiceContactEMail) {
                    this.invoiceReprintModel.InvoiceContactEmail = data[0][0].InvoiceContactEMail;
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'dInvoiceContactEmail', this.invoiceReprintModel.InvoiceContactEmail);
                }
                if (data[0][0].InvoiceContactName) {
                    this.invoiceReprintModel.InvoiceContactName = data[0][0].InvoiceContactName;
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'dInvoiceContactName', this.invoiceReprintModel.InvoiceContactName);
                }
            }

            if (data[1][0] && data[1][0].AccountName) {
                this.invoiceReprintModel.AccountName = data[1][0].AccountName;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', this.invoiceReprintModel.AccountName);
            }

        });
    }

    public onCmdEmail(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());

        let postData = {
            'ModuleName': 'EMail',
            'InvoiceNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber'),
            'ContactName': this.riExchange.riInputElement.GetValue(this.uiForm, 'dInvoiceContactName'),
            'ContactEmail': this.riExchange.riInputElement.GetValue(this.uiForm, 'dInvoiceContactEmail')
        };
        if (this.ajaxSource)
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, query, postData)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data.ErrorMessage) {
                        this.messageModal.show({ msg: data.ErrorMessage }, false);
                    }
                }
            }
            );
    }

    public onCmdView(): void {
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        query.set('countryCode', this.countryCode());
        query.set('businessCode', this.businessCode());
        query.set('Function', 'Single');
        query.set('ViewPrintSelected', 'RePrint');
        query.set('InvoiceNumber', this.invoiceReprintModel.InvoiceRowId ? this.invoiceReprintModel.InvoiceRowId : this.invoiceReprintModel.ttInvoiceHeader);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, query)
            .subscribe((data) => {
                if (this.ajaxSource)
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    if (data.url) {
                        window.open(data.url, '_blank');
                    }
                    else if (data.errorMessage) {
                        this.messageModal.show({ msg: data.errorMessage }, false);
                    }
                }
            }
            );
    }

    private getFieldValue(value: any): any {
        return (value) ? value : '';
    }

    public onBackLinkClick(event: any): void {
        event.preventDefault();
        this.location.back();
    }
}
