import * as moment from 'moment';
import { InternalGridSearchServiceModuleRoutes } from './../../base/PageRoutes';
import { FormGroup } from '@angular/forms';
import { AccountSearchComponent } from './../search/iCABSASAccountSearch';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { MessageCallback } from '../../../app/base/Callback';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ProductCoverSearchComponent } from '../../../app/internal/search/iCABSBProductCoverSearch.component';

@Component({

    templateUrl: 'iCABSAServiceCoverDetailGroupMaintenance.html'
})

export class ServiceCoverDetailGroupMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy, MessageCallback {

    @ViewChild('messageModal') public messageModal;
    @ViewChild('promptModal') public promptModal;

    public inputParams: any = {
        'parentMode': 'LookUp-MergeFrom',
        'methodType': 'maintenance',
        'action': '1',
        'pageTitle': 'Account Assign'
    };

    public productCoverSearchParams: any = {
        'parentMode': 'LookUp',
        'productCode': '',
        'productDesc': ''
    };

    public queryParams: any = {
        operation: 'Application/iCABSAServiceCoverDetailGroupMaintenance',
        module: 'contract-admin',
        method: 'contract-management/maintenance'
    };
    private rowCount = 10;
    public pageId: string = '';
    public search = new URLSearchParams();
    private lookUpSubscription: Subscription;
    private subSysChar: Subscription;
    public lookupComponent: Component;
    public promptTitle: string = 'Confirm Record?';
    public pDate: Date;
    public showpromptHeader: boolean = true;
    public labelContractNumber: string;
    public productCoverSearch: Component;
    public rows: Array<any> = [
        {
            count: 1,
            ProductDetailCode: 'ProductDetailCode1',
            ProductDetailDesc: 'ProductDetailDesc1',
            DetailQty: 'DetailQty1',
            DetailCommenceDate: 'DetailCommenceDate1',
            pDate: ''
        },
        {
            count: 2,
            ProductDetailCode: 'ProductDetailCode2',
            ProductDetailDesc: 'ProductDetailDesc2',
            DetailQty: 'DetailQty2',
            DetailCommenceDate: 'DetailCommenceDate2',
            pDate: ''
        },
        {
            count: 3,
            ProductDetailCode: 'ProductDetailCode3',
            ProductDetailDesc: 'ProductDetailDesc3',
            DetailQty: 'DetailQty3',
            DetailCommenceDate: 'DetailCommenceDate3',
            pDate: ''
        },
        {
            count: 4,
            ProductDetailCode: 'ProductDetailCode4',
            ProductDetailDesc: 'ProductDetailDesc4',
            DetailQty: 'DetailQty4',
            DetailCommenceDate: 'DetailCommenceDate4',
            pDate: ''
        },
        {
            count: 5,
            ProductDetailCode: 'ProductDetailCode5',
            ProductDetailDesc: 'ProductDetailDesc5',
            DetailQty: 'DetailQty5',
            DetailCommenceDate: 'DetailCommenceDate5',
            pDate: ''
        },
        {
            count: 6,
            ProductDetailCode: 'ProductDetailCode6',
            ProductDetailDesc: 'ProductDetailDesc6',
            DetailQty: 'DetailQty6',
            DetailCommenceDate: 'DetailCommenceDate6',
            pDate: ''
        }, {
            count: 7,
            ProductDetailCode: 'ProductDetailCode7',
            ProductDetailDesc: 'ProductDetailDesc7',
            DetailQty: 'DetailQty7',
            DetailCommenceDate: 'DetailCommenceDate7',
            pDate: ''
        }, {
            count: 8,
            ProductDetailCode: 'ProductDetailCode8',
            ProductDetailDesc: 'ProductDetailDesc8',
            DetailQty: 'DetailQty8',
            DetailCommenceDate: 'DetailCommenceDate8',
            pDate: ''
        }, {
            count: 9,
            ProductDetailCode: 'ProductDetailCode9',
            ProductDetailDesc: 'ProductDetailDesc9',
            DetailQty: 'DetailQty9',
            DetailCommenceDate: 'DetailCommenceDate9',
            pDate: ''
        }, {
            count: 10,
            ProductDetailCode: 'ProductDetailCode10',
            ProductDetailDesc: 'ProductDetailDesc10',
            DetailQty: 'DetailQty10',
            DetailCommenceDate: 'DetailCommenceDate10',
            pDate: ''
        }
    ];

    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: true, disabled: false, required: false },
        { name: 'ProductDesc', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc', readonly: true, disabled: false, required: false },
        { name: 'ServiceCoverRowID', readonly: true, disabled: false, required: false },
        { name: 'MaxCount', readonly: true, disabled: false, required: false },
        { name: 'vLocationEnabled', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode1', readonly: true, disabled: false, required: true },
        { name: 'ProductDetailDesc1', readonly: true, disabled: true, required: false },
        { name: 'DetailQty1', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate1', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode2', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc2', readonly: true, disabled: true, required: false },
        { name: 'DetailQty2', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate2', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode3', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc3', readonly: true, disabled: true, required: false },
        { name: 'DetailQty3', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate3', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode4', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc4', readonly: true, disabled: true, required: false },
        { name: 'DetailQty4', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate4', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode5', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc5', readonly: true, disabled: true, required: false },
        { name: 'DetailQty5', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate5', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode6', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc6', readonly: true, disabled: true, required: false },
        { name: 'DetailQty6', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate6', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode7', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc7', readonly: true, disabled: true, required: false },
        { name: 'DetailQty7', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate7', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode8', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc8', readonly: true, disabled: true, required: false },
        { name: 'DetailQty8', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate8', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode9', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc9', readonly: true, disabled: true, required: false },
        { name: 'DetailQty9', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate9', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailCode10', readonly: true, disabled: false, required: false },
        { name: 'ProductDetailDesc10', readonly: true, disabled: true, required: false },
        { name: 'DetailQty10', readonly: true, disabled: false, required: false },
        { name: 'DetailCommenceDate10', readonly: true, disabled: false, required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSASERVICECOVERDETAILGROUPMAINTENANCE;
        this.lookupComponent = AccountSearchComponent;
        this.productCoverSearch = ProductCoverSearchComponent;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.setMessageCallback(this);
        this.getValuesFromLookUp();
        if (this.isReturning()) {
            for (let i = 0; i < this.rows.length; i++) {
                this.setControlValue(this.rows[i]['ProductDetailCode'], '');
                this.setControlValue(this.rows[i]['ProductDetailDesc'], '');
                this.setControlValue(this.rows[i]['DetailQty'], '');
                this.setControlValue(this.rows[i]['DetailCommenceDate'], '');
                this.rows[i]['pDate'] = null;
            }
        }
    }

    public handleBackNav(event: Event): void {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.getErrorDescription();
    }

    ngOnDestroy(): void {
        if (this.lookUpSubscription) {
            this.lookUpSubscription.unsubscribe();
        }
        if (this.subSysChar) {
            this.subSysChar.unsubscribe();
        }
        super.ngOnDestroy();
    }



    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: data.title }, false);
    }

    private getSysCharDtetails(): any {
        let sysCharList: number[] = [
            this.sysCharConstants.SystemCharEnableLocations,
            this.sysCharConstants.SystemCharEnableProductDetailQty
        ];
        let sysCharIP = {
            module: this.queryParams.module,
            operation: this.queryParams.operation,
            action: 0,
            businessCode: this.businessCode(),
            countryCode: this.countryCode(),
            SysCharList: sysCharList.toString()
        };
        this.subSysChar = this.speedScript.sysChar(sysCharIP).subscribe((data) => {
            let record = data.records;
            this.pageParams.vSCEnableLocations = record[0].Logical;
            this.pageParams.SCEnableDetailLocations = record[0].Logical;
            this.pageParams.SCEnableProductDetailQty = record[1].Required;
            this.window_onload();
        });
    }

    private getValuesFromLookUp(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ProductCode']
            },
            {
                'table': 'ProductCover',
                'query': {
                    'BusinessCode': this.businessCode()
                },
                'fields': ['ProductCode']
            }
        ];
        this.pageParams.vProductCoverCount = 0;
        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let ProductProductCode = data[0];
            let ProductCoverProductCode = data[1];
            this.getSysCharDtetails();
            if (ProductProductCode && ProductCoverProductCode) {
                for (let i = 0; i < ProductProductCode.length; i++) {
                    let code = ProductProductCode[i].ProductCode;
                    for (let j = 0; j < ProductCoverProductCode.length; j++) {
                        if (code === ProductCoverProductCode[j].ProductCode) {
                            this.pageParams.vProductCoverCount++;
                        }
                    }
                }
                this.pageParams.vMaxCount = this.pageParams.vProductCoverCount;
                if (this.pageParams.vMaxCount > 50) {
                    this.pageParams.vMaxCount = 50;
                }
            }
        });
    }

    private getFieldValuesFromLookUp(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let lookupIP = [
            {
                'table': 'Contract',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber')
                },
                'fields': ['ContractName']
            },
            {
                'table': 'Premise',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                    'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
                },
                'fields': ['PremiseName']
            },
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode')
                },
                'fields': ['ProductDesc']
            }
        ];

        this.lookUpSubscription = this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            let Contract = data[0][0];
            if (Contract) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', Contract.ContractName);
            }
            let Premise = data[1][0];
            if (Premise) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', Premise.PremiseName);
            }
            let Product = data[2][0];
            if (Product) {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', Product.ProductDesc);
                this.productCoverSearchParams.productCode = this.getControlValue('ProductCode');
                this.productCoverSearchParams.productDesc = this.getControlValue('ProductDesc');
            }
            this.productCoverSearchParams.productCode = this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode');
            this.productCoverSearchParams.productDesc = Product.ProductDesc;
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
        });
    }

    public window_onload(): void {
        this.pageParams.currentContractType = this.riExchange.getCurrentContractType();
        this.pageParams.currentContractTypeLabel = this.riExchange.getCurrentContractTypeLabel();
        this.pageTitle = 'Service Detail Group Maintenance';
        this.labelContractNumber = this.pageParams.currentContractTypeLabel + ' Number';
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', this.riExchange.getParentHTMLValue('ContractNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', this.riExchange.getParentHTMLValue('PremiseNumber'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.attributes.ServiceCoverRowID = this.riExchange.getParentHTMLValue('ServiceCoverROWID');
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ServiceCoverRowID', this.riExchange.getParentHTMLValue('ServiceCoverROWID'));
        this.riExchange.riInputElement.SetValue(this.uiForm, 'MaxCount', this.pageParams.vMaxCount);
        this.getFieldValuesFromLookUp();
    }

    public CheckLocationEnabled(): void {

        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '6');
        query.set('Function', 'CheckLocationEnabled');
        query.set('ProductCode', this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'));
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query)
            .subscribe(
            (data) => {
                if (data.status === 'failure') {
                    this.errorService.emitError(data.oResponse);
                } else {
                    this.riExchange.riInputElement.SetValue(this.uiForm, 'vLocationEnabled', data.LocationsEnabled);
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (this.LCase(data.LocationsEnabled) === 'yes' || this.LCase(data.LocationsEnabled) === 'true') {
                    this.navigate('ProductDetail', InternalGridSearchServiceModuleRoutes.ICABSASERVICECOVERDETAILLOCATIONENTRYGRID, {
                        'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
                        'ContractName': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractName'),
                        'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber'),
                        'PremiseName': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseName'),
                        'ProductCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductCode'),
                        'ProductDesc': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDesc'),
                        'ServiceCoverRowID': this.riExchange.getParentHTMLValue('ServiceCoverROWID')
                    });
                    //alert('Navigate to iCABSAServiceCoverDetailLocationEntryGrid.htm');
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError('Record not found');
            }
            );

    }

    public submitDetailLine(event: Event): void {
        event.preventDefault();
        if (this.fieldHasValue('ProductDetailCode1')) {
            this.promptModal.show();
        } else {
            //this.riExchange.riInputElement.markAsError(this.uiForm, 'ProductDetailCode1');
            this.uiForm.controls['ProductDetailCode1'].markAsTouched();
            document.querySelector('#ProductDetailCode')['focus']();
        }
    }

    public cancelDetailLine(event: Event): void {
        let current = this.uiForm.value;
        for (let i = 0; i < this.rowCount; i++) {
            this.rows[i].pDate = '';
        }
        this.uiForm.reset();
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractNumber', current.ContractNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseNumber', current.PremiseNumber);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductCode', current.ProductCode);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ContractName', current.ContractName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'PremiseName', current.PremiseName);
        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDesc', current.ProductDesc);
    }

    public getProductDescription(id: string): void {
        if (this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode' + id)) {
            this.ajaxSource.next(this.ajaxconstant.START);
            this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailCode' + id,
                this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode' + id).toUpperCase());
            let query = this.getURLSearchParamObject();
            query.set(this.serviceConstants.Action, '6');
            let formData = {
                'ProductDetailCode': this.riExchange.riInputElement.GetValue(this.uiForm, 'ProductDetailCode' + id)
            };
            this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
                this.queryParams.operation, query, formData)
                .subscribe(
                (data) => {
                    if (data.errorMessage) {
                        this.errorService.emitError(data.errorMessage);
                        this.messageService.emitMessage({ msg: data.errorMessage, title: 'Error' });
                    } else {
                        this.riExchange.riInputElement.SetValue(this.uiForm, 'ProductDetailDesc' + id, data.ProductDetailDesc);
                        this.populateCommenceDate(id);
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.errorService.emitError('Record not found');
                }
                );
        } else {
            if (id.toString() !== '1') {
                this.riExchange.riInputElement.SetValue(this.uiForm, 'DetailCommenceDate' + id, '');
                let pos = parseInt(id, 0) - 1;
                if (this.rows[pos].pDate !== null) {
                    this.rows[pos].pDate = null;
                } else {
                    this.rows[pos].pDate = void 0;
                }
            }
        }
    }

    public populateCommenceDate(id: string): void {
        this.riExchange.riInputElement.SetValue(this.uiForm, 'DetailCommenceDate' + id, this.riExchange.getParentHTMLValue('ServiceCommenceDate'));
        let date = this.riExchange.getParentHTMLValue('ServiceCommenceDate');
        if (window['moment'](date, 'DD/MM/YYYY', true).isValid()) {
            date = this.utils.convertDate(date);
        } else {
            date = this.utils.formatDate(date);
        }
        let pos = parseInt(id, 0) - 1;
        this.rows[pos].pDate = new Date(date);
    }

    public getErrorDescription(): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '0');
        let formData = {
            'ContractNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'ContractNumber'),
            'PremiseNumber': this.riExchange.riInputElement.GetValue(this.uiForm, 'PremiseNumber')
        };
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, formData)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.errorService.emitError(data.errorMessage);
                    this.messageService.emitMessage({ msg: data.errorMessage, title: 'Error' });
                } else {
                    if (data.StopExit === 'yes') {
                        this.messageService.emitMessage({ msg: data.ErrorMessage, title: 'Error' });
                    } else {
                        this.location.back();
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError('Record not found');
            }
            );
    }

    public addDetailLine(): void {
        let count = this.rowCount + 1;
        this.controls.push({ name: 'ProductDetailCode' + count, readonly: true, disabled: false, required: false });
        this.controls.push({ name: 'ProductDetailDesc' + count, readonly: true, disabled: false, required: false });
        this.controls.push({ name: 'DetailQty' + count, readonly: true, disabled: false, required: false });
        this.controls.push({ name: 'DetailCommenceDate' + count, readonly: true, disabled: false, required: false });
        this.riExchange.renderForm(this.uiForm, this.controls);

        let rowObj = {
            count: count,
            ProductDetailCode: 'ProductDetailCode' + count,
            ProductDetailDesc: 'ProductDetailDesc' + count,
            DetailQty: 'DetailQty' + count,
            DetailCommenceDate: 'DetailCommenceDate' + count,
            pDate: ''
        };
        this.rows.push(rowObj);
        this.rowCount++;

    }

    public promptSave(event: any): void {
        this.ajaxSource.next(this.ajaxconstant.START);
        let query = this.getURLSearchParamObject();
        query.set(this.serviceConstants.Action, '1');
        let formData = this.uiForm.value;
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module,
            this.queryParams.operation, query, formData)
            .subscribe(
            (data) => {
                if (data.errorMessage) {
                    this.errorService.emitError(data.errorMessage);
                    this.messageService.emitMessage({ msg: data.errorMessage, title: 'Error' });
                } else {
                    this.messageService.emitMessage({ msg: MessageConstant.Message.RecordSavedSuccessfully, title: 'Message' });
                    this.CheckLocationEnabled();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.errorService.emitError('Record not found');
            }
            );
    }

    public onDataReceived(event: any, id: string): void {
        this.setControlValue('ProductDetailCode' + id, event.ProductDetailCode);
        this.setControlValue('ProductDetailDesc' + id, event.ProductDetailDesc);
        this.populateCommenceDate(id);
    }

    public dateSelectedValue(value: any, id: string): void {
        if (value && value.value) {
            this.riExchange.riInputElement.SetValue(this.uiForm, 'DetailCommenceDate' + id, this.globalize.parseDateToFixedFormat(value.value));
        }
    }

    public hasValue(val: any): boolean {
        return ((val !== null) && (val !== undefined) && (val !== ''));
    }

    public fieldHasValue(field: string): boolean {
        return this.hasValue(this.getControlValue(field));
    }
}
