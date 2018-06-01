import { Component, OnInit, OnDestroy, Injector, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../base/BaseComponent';
import { PageIdentifier } from './../../../base/PageIdentifier';
import { MntConst } from './../../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../../shared/components/modal-adv/modal-adv-vo';
import { ScreenNotReadyComponent } from './../../../../shared/components/screenNotReady';
import { ProductSearchGridComponent } from './../../../internal/search/iCABSBProductSearch';

@Component({
    templateUrl: 'iCABSBProductLanguageMaintenance.html'
})

export class ProductLanguageMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    private pageMode: string = 'N';
    private rowID: string = '';
    private pageData: Object = {};

    private headerParams: any = {
        operation: 'Business/iCABSBProductLanguageMaintenance',
        module: 'product',
        method: 'service-delivery/admin'
    };

    public pageId: string = '';
    public isBtnAddDisbled: boolean = false;
    public isBtnSaveDisbled: boolean = true;
    public isBtnCancelDisbled: boolean = true;
    public isBtnDeleteDisbled: boolean = true;
    public isProductLanguageDescRequired: boolean = false;

    // inputParams for SearchComponent Ellipsis
    public ellipsis: Object = {
        productSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Lookup',
                'currentContractType': 'P',
                'currentContractTypeURLParameter': 'product'
            },
            contentComponent: ProductSearchGridComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        languageSearch: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'Lookup',
                'currentContractType': 'P',
                'showAddNew': false,
                'ProductCode': '',
                'ProductDesc': ''
            },
            contentComponent: ScreenNotReadyComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    public controls: Array<any> = [
        { name: 'ProductCode', required: true, type: MntConst.eTypeCode },
        { name: 'ProductDesc', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'LanguageCode', required: true, type: MntConst.eTypeCode },
        { name: 'LanguageDescription', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'ProductLanguageDesc', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'InvoiceTextMaterials', disabled: true, type: MntConst.eTypeText },
        { name: 'InvoiceTextLabour', disabled: true, type: MntConst.eTypeText },
        { name: 'InvoiceTextReplacement', disabled: true, type: MntConst.eTypeText }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.browserTitle = 'Product Language Maintenance';
        this.pageId = PageIdentifier.ICABSBPRODUCTLANGUAGEMAINTENANCE;
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Product Language Maintenance';
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private updateControls(): void {
        switch (this.pageMode) {
            case 'N':
                this.isBtnAddDisbled = false;
                this.isBtnSaveDisbled = true;
                this.isBtnCancelDisbled = true;
                this.isBtnDeleteDisbled = true;
                this.isProductLanguageDescRequired = false;

                this.setRequiredStatus('ProductLanguageDesc', false);
                this.disableControl('ProductCode', false);
                this.disableControl('LanguageCode', false);
                this.disableControl('ProductLanguageDesc', true);
                this.disableControl('InvoiceTextMaterials', true);
                this.disableControl('InvoiceTextLabour', true);
                this.disableControl('InvoiceTextReplacement', true);
                break;

            case 'U':
                this.isBtnAddDisbled = false;
                this.isBtnSaveDisbled = false;
                this.isBtnCancelDisbled = false;
                this.isBtnDeleteDisbled = false;
                this.isProductLanguageDescRequired = true;

                this.setRequiredStatus('ProductLanguageDesc', true);
                this.disableControl('ProductCode', true);
                this.disableControl('LanguageCode', true);
                this.disableControl('ProductLanguageDesc', false);
                this.disableControl('InvoiceTextMaterials', false);
                this.disableControl('InvoiceTextLabour', false);
                this.disableControl('InvoiceTextReplacement', false);
                break;

            case 'A':
                this.pageData = {};
                this.isBtnAddDisbled = true;
                this.isBtnSaveDisbled = false;
                this.isBtnCancelDisbled = false;
                this.isBtnDeleteDisbled = true;
                this.isProductLanguageDescRequired = true;

                this.setRequiredStatus('ProductLanguageDesc', true);
                this.disableControl('ProductCode', false);
                this.disableControl('LanguageCode', false);
                this.disableControl('ProductLanguageDesc', false);
                this.disableControl('InvoiceTextMaterials', false);
                this.disableControl('InvoiceTextLabour', false);
                this.disableControl('InvoiceTextReplacement', false);
                break;
        }
    }

    private storeData(): void {
        this.pageData = {
            ProductLanguageDesc: this.getControlValue('ProductLanguageDesc'),
            InvoiceTextMaterials: this.getControlValue('InvoiceTextMaterials'),
            InvoiceTextLabour: this.getControlValue('InvoiceTextLabour'),
            InvoiceTextReplacement: this.getControlValue('InvoiceTextReplacement')
        };
    }

    private restoreData(): void {
        this.setControlValue('ProductLanguageDesc', this.pageData['ProductLanguageDesc']);
        this.setControlValue('InvoiceTextMaterials', this.pageData['InvoiceTextMaterials']);
        this.setControlValue('InvoiceTextLabour', this.pageData['InvoiceTextLabour']);
        this.setControlValue('InvoiceTextReplacement', this.pageData['InvoiceTextReplacement']);
    }

    private getKeyFieldsDescription(): void {
        let lookupIP: Array<any> = [{
            'table': 'Product',
            'query': {
                'ProductCode': this.getControlValue('ProductCode'),
                'BusinessCode': this.utils.getBusinessCode()
            },
            'fields': ['ProductDesc']
        }, {
            'table': 'Language',
            'query': {
                'LanguageCode': this.getControlValue('LanguageCode')
            },
            'fields': ['LanguageDescription']
        }];

        this.ajaxSource.next(this.ajaxconstant.START);

        this.LookUp.lookUpRecord(lookupIP).subscribe((data) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError) {
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            }
            else {
                if (data.length > 0) {
                    let productData = data[0];
                    let langData = data[1];

                    if (productData.length > 0) {
                        this.setControlValue('ProductDesc', productData[0].ProductDesc);
                    }
                    if (langData.length > 0) {
                        this.setControlValue('LanguageDescription', langData[0].LanguageDescription);
                    }

                    if (productData.length > 0 && langData.length > 0 && this.pageMode !== 'A') {
                        this.fetchRecord();
                    }
                } else {
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
                }
            }
        }, (error) => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        });
    }

    private fetchRecord(): void {
        let queryParams: URLSearchParams = this.getURLSearchParamObject();
        queryParams.set('action', '0');

        queryParams.set('ProductCode', this.getControlValue('ProductCode'));
        queryParams.set('LanguageCode', this.getControlValue('LanguageCode'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, queryParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.errorMessage) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.setControlValue('ProductLanguageDesc', data.ProductLanguageDesc);
                this.setControlValue('InvoiceTextMaterials', data.InvoiceTextMaterials);
                this.setControlValue('InvoiceTextLabour', data.InvoiceTextLabour);
                this.setControlValue('InvoiceTextReplacement', data.InvoiceTextReplacement);
                this.rowID = data.ttProductLanguage;

                this.storeData();
                this.pageMode = 'U';
                this.updateControls();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private saveData(): void {
        let search: URLSearchParams = new URLSearchParams();
        search = this.getURLSearchParamObject();

        let formdData: any = {};
        if (this.pageMode === 'A') {
            search.set(this.serviceConstants.Action, '1');
        }
        else {
            search.set(this.serviceConstants.Action, '2');
            formdData['rowID'] = this.rowID;
        }

        formdData = {
            ProductCode: this.getControlValue('ProductCode'),
            ProductDesc: this.getControlValue('ProductDesc'),
            LanguageCode: this.getControlValue('LanguageCode'),
            LanguageDescription: this.getControlValue('LanguageDescription'),
            ProductLanguageDesc: this.getControlValue('ProductLanguageDesc'),
            InvoiceTextMaterials: this.getControlValue('InvoiceTextMaterials') ? this.getControlValue('InvoiceTextMaterials') : '',
            InvoiceTextLabour: this.getControlValue('InvoiceTextLabour') ? this.getControlValue('InvoiceTextLabour') : '',
            InvoiceTextReplacement: this.getControlValue('InvoiceTextReplacement') ? this.getControlValue('InvoiceTextReplacement') : ''
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, search, formdData)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.rowID = data.ttProductLanguage;
                    this.pageMode = 'U';
                    this.updateControls();
                    this.storeData();
                    this.uiForm.markAsUntouched();
                    this.uiForm.markAsPristine();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private deleteRecord(): void {
        let search: URLSearchParams = new URLSearchParams();
        search = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '3');
        let formdData: any = {};
        formdData['rowID'] = this.rowID;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, search, formdData)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                    this.pageMode = 'N';
                    this.uiForm.reset();
                    this.updateControls();
                    this.uiForm.markAsUntouched();
                    this.uiForm.markAsPristine();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    /*
    *Populate Porduct Description on Product Code Change
    */
    public onProductCodeChange(): void {
        if (this.pageMode === 'A')
            return;
        this.setControlValue('ProductDesc', '');
        this.setControlValue('LanguageCode', '');
        this.setControlValue('LanguageDescription', '');
        this.setControlValue('ProductLanguageDesc', '');
        this.setControlValue('InvoiceTextMaterials', '');
        this.setControlValue('InvoiceTextLabour', '');
        this.setControlValue('InvoiceTextReplacement', '');
    }

    /*
    *Populate Language Description and Translated Product Description On Language Code Change
    */
    public onLanguageCodeChange(): void {
        if (this.pageMode === 'A')
            return;
        this.setControlValue('LanguageDescription', '');
        this.setControlValue('ProductLanguageDesc', '');
        this.setControlValue('InvoiceTextMaterials', '');
        this.setControlValue('InvoiceTextLabour', '');
        this.setControlValue('InvoiceTextReplacement', '');
        this.getKeyFieldsDescription();
    }

    /**
     * Add Button Click
     */
    public selectAddMode(): void {
        this.pageMode = 'A';
        this.uiForm.reset();
        this.updateControls();
    }

    /**
     * Save Button Click
     */
    public confirmRecord(type: string): void {
        if (type === 'save') {
            for (let control in this.uiForm.controls) {
                if (this.uiForm.controls.hasOwnProperty(control)) {
                    this.riExchange.riInputElement.isError(this.uiForm, control);
                }
            }

            if (this.uiForm.valid) {
                if (this.pageMode === 'A') {
                    this.getKeyFieldsDescription();
                }
                this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.saveData.bind(this)));
            }
        } else {
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteRecord.bind(this)));
        }
    }

    public resetPage(): void {
        if (this.pageMode === 'A') {
            this.pageMode = 'N';
            this.updateControls();
            this.uiForm.reset();
        }
        else if (this.pageMode === 'U') {
            this.restoreData();
        }
        this.uiForm.markAsUntouched();
        this.uiForm.markAsPristine();
    }

    public onEllipsisDataReceived(data: any, type: string): void {
        if (type === 'Product') {
            if (this.pageMode === 'U') {
                this.pageMode = 'N';
                this.uiForm.reset();
                this.updateControls();
            }
            this.onProductCodeChange();
            this.setControlValue('ProductCode', data.ProductCode);
            this.setControlValue('ProductDesc', data.ProductDesc);

        } else {
            this.onLanguageCodeChange();
            this.setControlValue('LanguageCode', data.LanguageCode);
            this.setControlValue('LanguageDescription', data.LanguageDescription);
            this.fetchRecord();
        }
    }

}
