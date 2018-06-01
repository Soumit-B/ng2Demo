import { Observable } from 'rxjs';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { GridComponent } from './../../../shared/components/grid/grid';
import { URLSearchParams } from '@angular/http';
import { BaseComponent } from '../../base/BaseComponent';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { PageIdentifier } from './../../base/PageIdentifier';
import { RiMaintenance, MntConst } from './../../../shared/services/riMaintenancehelper';
import { Utils } from './../../../shared/services/utility';

@Component({
    templateUrl: 'iCABSCMTelesalesEntryConfirmOrder.html'
})

export class CMTelesalesEntryConfirmOrderComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;
    @ViewChild('TelesalesContactEmail') public TelesalesContactEmail;
    @ViewChild('TelesalesPurchaseOrderNo') public TelesalesPurchaseOrderNo;
    @ViewChild('CallBackSelect') public CallBackSelect;
    @ViewChild('grid') grid: GridComponent;

    public promptTitle: string = 'Confirm';
    public promptContent: string = 'Confirm Record?';
    public showCloseButton = true;
    public modalConfig: any = { backdrop: 'static', keyboard: true };
    public isRequesting = false;
    public pageId: string = '';
    public dtCallBackDate = null;
    public validateProperties: Array<any> = [];
    public controls = [
        { name: 'TelesalesOrderNumber', readonly: true, disabled: true, type: MntConst.eTypeInteger, required: false, value: '', primary: false },
        { name: 'TelesalesName', readonly: true, disabled: true, type: MntConst.eTypeTextFree, required: false, value: '', primary: false },
        { name: 'TelesalesContactEmail', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: false, value: '', primary: false },
        { name: 'TelesalesPurchaseOrderNo', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: true, value: '', primary: false },
        { name: 'PaymentTypeCodeSelect', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
        { name: 'PaymentAuthorityCode', readonly: false, disabled: false, type: MntConst.eTypeTextFree, required: true, value: '', primary: false },
        { name: 'CallBackInd', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
        { name: 'CallBackSelect', readonly: false, disabled: false, type: '', required: false, value: '', primary: false },
        { name: 'CallBackTime' },
        { name: 'CallBackDate', readonly: false, disabled: false, type: MntConst.eTypeDate, required: false, value: '', primary: false },
        { name: 'CallBackNotes', readonly: false, disabled: false, type: '', required: false, value: '', primary: false }
    ];

    public uiDisplay = {
        trTelesalesContactEmail: false
    };

    public PaymentTypeCodeDropdown = [];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMTELESALESENTRYCONFIRMORDER;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Telesales Entry - Confirm Telesales Order';

        this.pageParams.gcBusinessCode = this.utils.getBusinessCode();
        this.pageParams.vCountryCode = this.utils.getCountryCode();
        this.pageParams.gUserCode = this.utils.getUserCode();

        this.pageParams.giCallBackDays = 0;
        this.pageParams.glShowTaxDetails = false;
        this.pageParams.gcDefaultPaymentTypeCode = '';
        this.pageParams.gcPaymentRefRequiredList = '';

        this.doLookup();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    public xhr: any;
    public xhrParams = {
        module: 'telesales',
        method: 'ccm/maintenance',
        operation: 'ContactManagement/iCABSCMTelesalesEntryConfirmOrder'
    };

    private doLookup(): any {
        this.LookUp.i_GetBusinessRegistryValue(this.utils.getBusinessCode(), 'Telesales', 'CallBack_Date_Default_Days', '').then((data) => {
            this.pageParams.giCallBackDays = data;
            this.pageParams.iCallBackDays = this.pageParams.giCallBackDays;
            let dateCallBack = this.utils.addDays(new Date(), parseInt(this.pageParams.iCallBackDays, 10));
            this.setControlValue('CallBackDate', dateCallBack);
            this.dtCallBackDate = this.utils.convertDate(this.getControlValue('CallBackDate'));
        });
        this.LookUp.i_GetBusinessRegistryValue(this.utils.getBusinessCode(), 'Telesales', 'Show_Tax_In_Telesales_Entry', '').then((data) => {
            this.pageParams.glShowTaxDetails = data;
            this.pageParams.lShowTaxDetails = (this.pageParams.glShowTaxDetails.toUpperCase() === 'Y') ? true : false;
        });
        this.LookUp.i_GetBusinessRegistryValue(this.utils.getBusinessCode(), 'Telesales', 'Default_Payment_Type_Code', '').then((data) => {
            this.pageParams.gcDefaultPaymentTypeCode = data;
        });

        let lookupIP = [{
            'table': 'PaymentType',
            'query': { 'BusinessCode': this.utils.getBusinessCode() },
            'fields': ['PaymentTypeCode', 'PaymentDesc', 'ReferenceRequired']
        }];
        this.LookUp.lookUpPromise(lookupIP).then((data) => {
            this.pageParams.gcPaymentRefRequiredList = data[0];

            this.window_onload();
        });
    }

    public showAlert(msgText: string, type?: number, msgObj?: any): void {
        this.logger.log('showAlert', msgText, msgObj);
        if (typeof type === 'undefined') type = 0;
        let fullError = (msgObj) ? msgObj.fullError : '';
        switch (type) {
            default:
            case 0:
                this.modalAdvService.emitError(new ICabsModalVO(msgText, fullError));
                break;
            case 1:
            case 2:
                this.modalAdvService.emitMessage(new ICabsModalVO(msgText, fullError));
                break;
        }
    }

    public closeModal(): void { this.logger.log('Modal closed.'); }
    public showSpinner(): void { this.isRequesting = true; }
    public hideSpinner(): void { this.isRequesting = false; }

    ///////////////////////////////////////////////

    public window_onload(): void {
        this.utils.setTitle(this.pageTitle);

        this.riExchange.renderForm(this.uiForm, this.controls);
        this.setControlValue('CallBackSelect', 1);

        this.pageParams.ValArray = [];
        this.pageParams.DescArray = [];
        this.pageParams.cDefaultPaymentTypeCode = '';
        this.pageParams.cPaymentRefRequiredList = '';
        this.pageParams.cConfirmationEmail = '';

        this.riExchange.getParentHTMLValue('TelesalesOrderNumber');
        this.riExchange.getParentHTMLValue('TelesalesName');
        this.riExchange.getParentHTMLValue('TelesalesPurchaseOrderNo');
        this.riExchange.getParentHTMLValue('TelesalesContactEmail');
        this.riExchange.getParentHTMLValue('CurrentCallLogID');
        this.riExchange.getParentHTMLValue('AccountNumber');

        this.riExchange.riInputElement.Disable(this.uiForm, 'TelesalesOrderNumber');
        this.riExchange.riInputElement.Disable(this.uiForm, 'TelesalesName');

        this.riMaintenance.clear();
        this.riMaintenance.BusinessObject = 'iCABSTelesalesEntry.p';
        this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
        this.riMaintenance.PostDataAdd('Function', 'GetInitialSettingsConfirmOrder', MntConst.eTypeText);
        this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
        this.riMaintenance.PostDataAdd('AccountNumber', this.riExchange.getParentHTMLValue('AccountNumber'), MntConst.eTypeTextFree);
        this.riMaintenance.PostDataAdd('TelesalesOrderNumber', this.riExchange.riInputElement.GetValue(this.uiForm, 'TelesalesOrderNumber'), MntConst.eTypeInteger);
        this.riMaintenance.ReturnDataAdd('ConfirmationEmail', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('DefaultPaymentTypeCode', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('PaymentTypeCodeList', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('PaymentTypeDescList', MntConst.eTypeTextFree);
        this.riMaintenance.ReturnDataAdd('PaymentRefRequiredList', MntConst.eTypeTextFree);
        this.riMaintenance.Execute(this, function (data: any): any {
            this.logger.log('PDA Callback A', data);
            if (data['errorMessage']) {
                this.showAlert(data['errorMessage'], 0, data);
            } else {
                this.pageParams.cConfirmationEmail = data['ConfirmationEmail'];
                this.pageParams.cDefaultPaymentTypeCode = data['DefaultPaymentTypeCode'];
                this.pageParams.cPaymentRefRequiredList = data['PaymentRefRequiredList'];

                //Set the dropdown
                this.pageParams.ValArray = (data['PaymentTypeCodeList']) ? data['PaymentTypeCodeList'].split(String.fromCharCode(10)) : '';
                this.pageParams.DescArray = (data['PaymentTypeDescList']) ? data['PaymentTypeDescList'].split(String.fromCharCode(10)) : '';

                for (let i = 0; i < this.pageParams.ValArray.length; i++) {
                    this.PaymentTypeCodeDropdown.push({ value: this.pageParams.ValArray[i], desc: this.pageParams.DescArray[i] });
                }

                //Set defaults
                this.setControlValue('PaymentTypeCodeSelect', this.pageParams.cDefaultPaymentTypeCode);
                this.PaymentTypeCodeSelect_OnChange();

                if (this.pageParams.cConfirmationEmail === 'Y') {
                    this.uiDisplay.trTelesalesContactEmail = true;
                    this.TelesalesContactEmail.nativeElement.focus();
                } else {
                    this.TelesalesPurchaseOrderNo.nativeElement.focus();
                }
            }
        }, 'POST');

        this.setControlValue('CallBackInd', true);
        let hms = this.utils.Time();
        this.setControlValue('CallBackTime', this.utils.hmsToSeconds(hms));

        this.validateProperties.push({ name: 'OrderValueText', type: MntConst.eTypeTextFree, index: 0 });
        this.validateProperties.push({ name: 'OrderValueAmount', type: MntConst.eTypeCurrency, index: 1 });

        this.buildGrid();
        this.CallBackSelect_OnChange();
    }

    public gridData: any;
    public gridTotalItems: number;
    public maxColumn: number = 2;
    public itemsPerPage: number = 10;
    public currentPage: number = 1;

    public buildGrid(): void {
        this.grid.clearGridData();
        let search: URLSearchParams = new URLSearchParams();
        search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        search.set(this.serviceConstants.Action, '2');
        search.set('Function', 'BuildPricingDetails');
        search.set('TelesalesOrderNumber', this.getControlValue('TelesalesOrderNumber'));
        search.set('riGridMode', '0');
        search.set('riGridHandle', (Math.floor(Math.random() * 900000) + 100000).toString());
        search.set('riCacheRefresh', 'True');
        this.xhrParams['search'] = search;
        this.grid.loadGridData(this.xhrParams);
    }

    public selectedCallBackDate(obj: any): any {
        this.setControlValue('CallBackDate', obj.value);
    }

    public PaymentTypeCodeSelect_OnChange(): void {
        if (this.pageParams.cPaymentRefRequiredList.indexOf('^' + this.getControlValue('PaymentTypeCodeSelect') + '^') >= 0) {
            this.riExchange.riInputElement.Enable(this.uiForm, 'PaymentAuthorityCode');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PaymentAuthorityCode', true);
        } else {
            this.riExchange.riInputElement.Disable(this.uiForm, 'PaymentAuthorityCode');
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PaymentAuthorityCode', false);
            this.riExchange.riInputElement.isError(this.uiForm, 'PaymentAuthorityCode');
        }
    }

    public cmdConfirm_OnClick(): void {
        if (this.riExchange.riInputElement.isError(this.uiForm, 'PaymentAuthorityCode')
            || this.riExchange.riInputElement.isError(this.uiForm, 'TelesalesPurchaseOrderNo')) {
            //Do nothing
        } else {
            this.ConfirmOrder();
        }
    }

    public cmdCancel_OnClick(): void {
        this.location.back();
    }

    public ConfirmOrder(ans?: string): void {
        this.logger.log('Debug: ConfirmOrder', this.uiForm.status, ans, this.getControlValue('CallBackSelect'));

        let cCallBackInd = '0';
        if (parseInt(this.getControlValue('CallBackSelect'), 10) === 0) {
            if (typeof ans === 'undefined') {
                this.logger.log('Debug: ConfirmOrder A');
                this.count = 1;
                this.promptTitle = MessageConstant.PageSpecificMessage.CallbackRequired;
                this.promptContent = MessageConstant.PageSpecificMessage.CallbackFuture;
                this.promptModal.show();
            } else {
                if (ans === 'YES') {
                    this.setControlValue('CallBackSelect', '1');
                    this.CallBackSelect_OnChange();
                    this.CallBackSelect.nativeElement.focus();
                }
                if (ans === 'NO') {
                    this.setControlValue('CallBackSelect', '2');
                    this.CallBackSelect_OnChange();
                }
            }
        }

        if (parseInt(this.getControlValue('CallBackSelect'), 10) === 1) {
            cCallBackInd = 'Y';
        }

        if (parseInt(this.getControlValue('CallBackSelect'), 10) === 2) {
            cCallBackInd = 'N';
        }

        this.save(cCallBackInd);
    }

    private count = 0;
    public confirmed(event: any, ans?: string): void {
        this.logger.log('CONFIRMED', ans, event);

        if (ans === 'YES') {
            this.ConfirmOrder('YES');
        } else {
            this.ConfirmOrder('NO');
        }
    }

    public save(cCallBackInd: string): void {
        this.count = 0;
        if (cCallBackInd !== '0') {
            this.riMaintenance.clear();
            this.riMaintenance.BusinessObject = 'iCABSTelesalesEntry.p';
            this.riMaintenance.PostDataAdd('Action', '6', MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('Function', 'ConfirmAsOrder', MntConst.eTypeText);
            this.riMaintenance.PostDataAdd('BusinessCode', this.utils.getBusinessCode(), MntConst.eTypeCode);
            this.riMaintenance.PostDataAdd('TelesalesOrderNumber', this.getControlValue('TelesalesOrderNumber'), MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('CurrentCallLogID', this.getControlValue('CurrentCallLogID'), MntConst.eTypeInteger);
            this.riMaintenance.PostDataAdd('PaymentTypeCode', this.getControlValue('PaymentTypeCodeSelect'), MntConst.eTypeTextFree);
            this.riMaintenance.PostDataAdd('PaymentAuthorityCode', this.getControlValue('PaymentAuthorityCode'), MntConst.eTypeTextFree);
            this.riMaintenance.PostDataAdd('CallBackInd', cCallBackInd, MntConst.eTypeTextFree);
            this.riMaintenance.PostDataAdd('CallBackDate', this.getControlValue('CallBackDate'), MntConst.eTypeDate);
            this.riMaintenance.PostDataAdd('CallBackTime', this.getControlValue('CallBackTime'), MntConst.eTypeTime);
            this.riMaintenance.PostDataAdd('CallBackNotes', this.getControlValue('CallBackNotes'), MntConst.eTypeTextFree);
            this.riMaintenance.PostDataAdd('TelesalesPurchaseOrderNo', this.getControlValue('TelesalesPurchaseOrderNo'), MntConst.eTypeTextFree);
            this.riMaintenance.PostDataAdd('TelesalesContactEmail', this.getControlValue('TelesalesContactEmail'), MntConst.eTypeTextFree);
            this.riMaintenance.ReturnDataAdd('errorMessage', MntConst.eTypeTextFree);
            this.riMaintenance.Execute(this, function (data: any): any {
                this.logger.log('PDA Callback B', data);
                if (data['errorMessage'] !== '') {
                    this.showAlert(data['errorMessage'], 0, data);
                } else {
                    this.cmdCancel_OnClick();
                }
            }, 'POST');
        }
    }

    public CallBackSelect_OnChange(): void {
        if (this.getControlValue('CallBackSelect') === '0' || this.getControlValue('CallBackSelect') === '2') {
            this.riExchange.riInputElement.Disable(this.uiForm, 'CallBackDate');
            this.riExchange.riInputElement.Disable(this.uiForm, 'CallBackNotes');
        } else {
            this.riExchange.riInputElement.Enable(this.uiForm, 'CallBackDate');
            this.riExchange.riInputElement.Enable(this.uiForm, 'CallBackNotes');
        }
    }

    @ViewChild('routeAwayComponent') public routeAwayComponent;
    public canDeactivate(): Observable<boolean> {
        return super.canDeactivate();
    }
}
