import { Subscription } from 'rxjs/Subscription';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { Router, ActivatedRoute } from '@angular/router';
import { RiMaintenance } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSAInvoicePrintLineMaintenance.html'
})

export class InvoicePrintLineComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('promptModal') public childModal;
    @ViewChild('messageModal') public messageModal;

    public queryParams: any = {
        operation: 'Application/iCABSAInvoicePrintLineMaintenance',
        module: 'invoicing',
        method: 'bill-to-cash/maintenance',
        search: ''
    };
    public pageId: string = '';
    public lookUpSubscription: Subscription;
    public riMaintenance: any;
    public showHeader: boolean = true;
    public xhr: any;
    public promptTitle = MessageConstant.Message.ConfirmRecord;
    public showErrorHeader: boolean = true;
    public showMessageHeader: boolean = true;
    public actionParameter: string;

    public controls = [
        { name: 'CompanyCode', readonly: false, disabled: true, required: false },
        { name: 'CompanyInvoiceNumber', readonly: false, disabled: true, required: false },
        { name: 'InvoicePrintLineNumber', readonly: false, disabled: true, required: false },
        { name: 'InvoicePrintLineDesc', readonly: false, disabled: false, required: false },
        { name: 'InvoiceNumber', readonly: false, disabled: true, required: false },
        { name: 'CompanyDesc', readonly: false, disabled: true, required: false }
    ];

    public columns: Array<any> = [
        { title: 'InvoicePrintLineDesc', name: 'InvoicePrintLineDesc' }
    ];

    public tableheading: string = 'InvoicePrintLine';

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICEPRINTLINEMAINTENANCE;

        this.xhr = this.httpService;
        this.riMaintenance = new RiMaintenance(this.logger, this.xhr, this.LookUp, this.utils, this.serviceConstants, this.globalize);
    }

    public savePost(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, this.actionParameter);
        let postParams: any = {};
        postParams.table = 'InvoicePrintLine';
        postParams.InvoiceNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
        postParams.InvoicePrintLineNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoicePrintLineNumber');
        postParams.InvoicePrintLineDesc = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoicePrintLineDesc');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.messageModal.show({ msg: e['errorMessage'], title: this.pageTitle }, false);
                        this.errorService.emitError(e['errorMessage']);
                    } else {
                        this.location.back();
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public cancelPage(): void {
        this.location.back();
    }

    public GetNextInvoicePrintLineNumber(): void {
        let searchPost: URLSearchParams;
        searchPost = this.getURLSearchParamObject();
        searchPost.set(this.serviceConstants.Action, '6');

        let postParams: any = {};
        postParams.Function = 'GetNextInvoicePrintLineNumber';
        postParams.InvoiceNumber = this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, searchPost, postParams)
            .subscribe(
            (e) => {
                if (e['status'] === 'failure') {
                    this.errorService.emitError(e['oResponse']);
                } else {
                    if ((typeof e['oResponse'] !== 'undefined' && e.oResponse['errorMessage'])) {
                        this.errorService.emitError(e['oResponse']);
                    } else if (e['errorMessage']) {
                        this.errorService.emitError(e);
                    } else {
                        this.setControlValue('InvoicePrintLineNumber', e.InvoicePrintLineNumber);
                    }
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.errorService.emitError(error);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    }

    public doLookupformData(): void {
        let lookupIP = [
            {
                'table': 'InvoicePrintLine',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'InvoiceNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber'),
                    'InvoicePrintLineNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoicePrintLineNumber')
                },
                'fields': ['InvoicePrintLineDesc']
            },
            {
                'table': 'InvoiceHeader',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'InvoiceNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'InvoiceNumber')
                },
                'fields': ['CompanyCode', 'CompanyInvoiceNumber']
            },
            {
                'table': 'Company',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'CompanyCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'CompanyCode')
                },
                'fields': ['CompanyDesc']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let invoicePrintLine = data[0][0];
            if (invoicePrintLine) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoicePrintLineDesc', invoicePrintLine.InvoicePrintLineDesc);
            }
            let companyData = data[1][0];
            // if (companyData) {
            //     this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', companyData.CompanyCode);
            //     this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyInvoiceNumber', companyData.CompanyInvoiceNumber);
            // }
            let companyOther = data[2][0];
            if (companyOther) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyDesc', companyOther.CompanyDesc);
            }
        });

    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Invoice Print Line Maintenance';
        this.window_onload();
    }

    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

    public onClickPostCode(): void {
        this.childModal.show();

    }
    public postCodeMessageClose(): void {
        this.childModal.hide();
    }

    private window_onload(): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoiceNumber', this.riExchange.getParentHTMLValue('InvoiceNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyCode', this.riExchange.getParentHTMLValue('CompanyCode'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'CompanyInvoiceNumber', this.riExchange.getParentHTMLValue('CompanyInvoiceNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoicePrintLineNumber', this.riExchange.getParentHTMLValue('PrintLineNumber'));
        this.businessCode();
        switch (this.parentMode) {
            case 'InvoicePrintLineUpdate':
                this.doLookupformData();
                this.riMaintenance.FetchRecord();
                this.riMaintenance.UpdateMode();
                this.actionParameter = '2';
                break;
            case 'InvoicePrintLineAdd':
                this.riMaintenance.FunctionUpdate = false;
                this.riMaintenance.FunctionAdd = true;
                this.riMaintenance.AddMode();
                this.disableControl('InvoicePrintLineNumber', false);
                this.GetNextInvoicePrintLineNumber();
                this.actionParameter = '1';
                break;
            case 'InvoicePrintLineDel':
                this.doLookupformData();
                this.riMaintenance.FunctionDelete = true;
                this.riMaintenance.FunctionSelect = false;
                this.riMaintenance.FunctionUpdate = false;
                this.riExchange.riInputElement.SetValue(this.uiForm, 'InvoicePrintLineNumber', this.riExchange.getParentHTMLValue('PrintLineNumber'));
                this.riMaintenance.FetchRecord();
                this.riMaintenance.UpdateMode();
                break;
        }
    }

}
