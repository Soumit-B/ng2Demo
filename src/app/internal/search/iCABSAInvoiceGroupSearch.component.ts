import { EllipsisComponent } from './../../../shared/components/ellipsis/ellipsis';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { GridComponent } from './../../../shared/components/grid/grid';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { PaginationComponent } from './../../../shared/components/pagination/pagination';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { HttpService } from '../../../shared/services/http-service';
import { TableComponent } from './../../../shared/components/table/table';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { Router } from '@angular/router';
@Component({
    templateUrl: 'iCABSAInvoiceGroupSearch.html'
})

export class InvoiceGroupSearchComponent extends BaseComponent implements OnInit, OnDestroy {
    public pageId: string = '';
    private lookUpSubscription: Subscription;
    public search: URLSearchParams;
    private inputParams: any = {};
    private method: string = 'contract-management/search';
    private module: string = 'invoice-group';
    private operation: string = 'Application/iCABSAInvoiceGroupSearch';
    public AddRecordDisabled: boolean = false;
    public tableheading: string = 'Invoice Group Search';
    public page: number = 1;
    public itemsPerPage: number = 10;
    private LiveInvoiceGroupIndText: string = 'true';
    private PremiseName: string;
    private PremiseAddressLine1: string;
    private PremiseAddressLine2: string;
    private PremiseAddressLine3: string;
    private PremiseAddressLine4: string;
    private PremiseAddressLine5: string;
    private PremisePostCode: string;
    public addButton: boolean = true;
    public pageTitle: string;
    public controls = [
        { name: 'AccountNumber', readonly: true, disabled: true, required: false },
        { name: 'AccountName', readonly: true, disabled: true, required: false },
        { name: 'LiveInvoiceGroupInd', readonly: false, disabled: false, required: false, value: true }
    ];
    public columns: Array<any> = [
        { title: 'Invoice Group Number', name: 'InvoiceGroupNumber', type: MntConst.eTypeCode },
        { title: 'Invoice Group Description', name: 'InvoiceGroupDesc', type: MntConst.eTypeInteger },
        { title: 'Invoice Name', name: 'InvoiceName', type: MntConst.eTypeText },
        { title: 'Invoice Address 1', name: 'InvoiceAddressLine1', type: MntConst.eTypeText },
        { title: 'Mandate reference', name: 'ExOAMandateReference', type: MntConst.eTypeText },
        { title: 'Live', name: 'LiveInvoiceGroup' }
    ];
    public rowmetadata: Array<any> = [
        { title: 'Live', name: 'LiveInvoiceGroup', type: 'img' }
    ];

    private DI: Injector;
    private ellipsis: EllipsisComponent;

    @ViewChild('InvoiceGroupTable') InvoiceGroupTable: TableComponent;
    constructor(injector: Injector, private _router: Router) {
        super(injector);
        this.pageId = PageIdentifier.ICABSAINVOICEGROUPSEARCH;
        this.browserTitle = this.pageTitle = 'Invoice Group Search';
        this.DI = injector;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.inputParams.method = this.method;
        this.inputParams.module = this.module;
        this.inputParams.operation = this.operation;
        this.inputParams.columns = [];
        this.inputParams.columns = this.columns;
        this.inputParams.rowmetadata = [];
        this.inputParams.rowmetadata = this.rowmetadata;

        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'));
        this.addButton = true;
        this.getSysCharDtetails();
        this.callSetUp();
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnablePayTypeAtInvoiceGroupLevel];
        let sysCharIP = {
            module: this.inputParams.module,
            operation: this.inputParams.operation,
            action: 0,
            businessCode: this.utils.getBusinessCode(),
            countryCode: this.utils.getCountryCode(),
            SysCharList: sysCharList.toString()
        };
        this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.SCEnablePayTypeAtInvGroupLev = record[0]['Required'];
            if (this.pageParams.SCEnablePayTypeAtInvGroupLev)
                this.columns.splice(4, 0, { title: 'Payment Method', name: 'PaymentDesc' });
        });
    }

    private isEllipsis = false;
    public updateView(params: any): void {
        if (!params) { params = this.inputParams; }
        this.ellipsis = this.DI.get(EllipsisComponent);

        this.ellipsis.childConfigParams = params;
        this.isEllipsis = this.ellipsis.childConfigParams['isEllipsis'];

        this.parentMode = '';

        this.parentMode = this.ellipsis.childConfigParams['parentMode'];
        this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountNumber', this.ellipsis.childConfigParams['AccountNumber']);
        this.addButton = false;

        this.callSetUp();
    }

    private callSetUp(): void {
        this.lookupCallforAccountname();

        switch (this.parentMode) {
            case 'Account':
            case 'LookUp-AccountHistory':
                this.AddRecordDisabled = false;
                this.addButton = true;
                break;
            case 'ContactManagement':
                this.AddRecordDisabled = false;
                this.PremiseName = this.riExchange.getParentHTMLValue('Name');
                this.PremiseAddressLine1 = this.riExchange.getParentHTMLValue('AddressLine1');
                this.PremiseAddressLine2 = this.riExchange.getParentHTMLValue('AddressLine2');
                this.PremiseAddressLine3 = this.riExchange.getParentHTMLValue('AddressLine3');
                this.PremiseAddressLine4 = this.riExchange.getParentHTMLValue('AddressLine4');
                this.PremiseAddressLine5 = this.riExchange.getParentHTMLValue('AddressLine5');
                this.PremisePostCode = this.riExchange.getParentHTMLValue('PostCode');
                this.addButton = true;
                break;
            case 'Premise':
                this.AddRecordDisabled = false;
                this.PremiseName = this.riExchange.getParentHTMLValue('Name');
                this.PremiseAddressLine1 = this.riExchange.getParentHTMLValue('AddressLine1');
                this.PremiseAddressLine2 = this.riExchange.getParentHTMLValue('AddressLine2');
                this.PremiseAddressLine3 = this.riExchange.getParentHTMLValue('AddressLine3');
                this.PremiseAddressLine4 = this.riExchange.getParentHTMLValue('AddressLine4');
                this.PremiseAddressLine5 = this.riExchange.getParentHTMLValue('AddressLine5');
                this.PremisePostCode = this.riExchange.getParentHTMLValue('PostCode');
                this.addButton = true;
                break;
            default:
                this.AddRecordDisabled = true;
                this.addButton = false;
                break;
        }


        this.dovalueInvoiceGroup();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }


    public onSearchClick(): void {
        this.dovalueInvoiceGroup();
    }

    private lookupCallforAccountname(): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')) {
            let lookupIP = [
                {
                    'table': 'Account',
                    'query': {
                        'BusinessCode': this.businessCode(),
                        'AccountNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber')
                    },
                    'fields': ['AccountName']
                }];

            this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
                let Account = data[0][0];
                if (Account) {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'AccountName', Account.AccountName);
                }

            });
        }
    }

    private dovalueInvoiceGroup(): void {
        this.search = this.getURLSearchParamObject();
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set('AccountNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'AccountNumber'));
        this.search.set('LiveInvoiceGroupInd', this.LiveInvoiceGroupIndText);
        this.inputParams.search = this.search;
        this.InvoiceGroupTable.loadTableData(this.inputParams);
    }

    public selectedData(event: any): void {
        let InvoiceGroupNumber = event.row.InvoiceGroupNumber;
        let InvoiceGroupDesc = event.row.InvoiceGroupDesc;
        let parentMode = '';
        if (this.isEllipsis === true) {
            parentMode = this.ellipsis.childConfigParams['parentMode'];
        } else {
            parentMode = this.parentMode;
        }
        switch (parentMode) {
            case 'Account':
                if (this.isEllipsis !== true) {
                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { parentMode: 'AccountSearch', InvoiceGroupNumber: InvoiceGroupNumber, InvoiceGroupDesc: InvoiceGroupDesc, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                } else {
                    this.ellipsis.sendDataToParent(event.row);
                }

                break;
            case 'LookUp':
            case 'Premise':
            case 'ContactManagement':
                if (this.isEllipsis !== true) {

                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { InvoiceGroupNumber: InvoiceGroupNumber, InvoiceGroupDesc: InvoiceGroupDesc, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                } else {
                    this.ellipsis.sendDataToParent(event.row);
                }

                break;
            case 'LookUp-AccountHistory':
                if (this.isEllipsis !== true) {
                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { AccountHistoryFilterValue: InvoiceGroupNumber, AccountHistoryFilterDesc: InvoiceGroupDesc, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                } else {
                    this.ellipsis.sendDataToParent(event.row);
                }

                break;

            case 'LookUp-AccountDiary':
                if (this.isEllipsis !== true) {
                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { AccountDiaryFilterValue: InvoiceGroupNumber, AccountDiaryFilterDesc: InvoiceGroupDesc, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                } else {
                    this.ellipsis.sendDataToParent(event.row);
                }

                break;
            default:
                if (this.isEllipsis !== true) {
                    this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { InvoiceGroupNumber: event.row.InvoiceGroupNumber, AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                } else {
                    this.ellipsis.sendDataToParent(event.row);
                }
                break;
        }
    }

    public LiveInvoiceGroupInd(event: any): void {
        if (event.target.checked) {
            this.LiveInvoiceGroupIndText = 'true';
        } else {
            this.LiveInvoiceGroupIndText = '';
        }
        this.dovalueInvoiceGroup();
    }

    public cmdAddRecord_onclick(event: any): void {
        switch (this.parentMode) {
            case 'Premise':
                this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { parentMode: 'PremiseSearchAdd', AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                break;
            case 'ContactManagement':
                this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { parentMode: 'ContactManagement', AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                break;
            default:
                this._router.navigate(['/billtocash/maintenance/invoicegroup/search'], { queryParams: { parentMode: 'AccountAdd', AccountNumber: this.getControlValue('AccountNumber'), AccountName: this.getControlValue('AccountName') } });
                break;
        }
    }
}
