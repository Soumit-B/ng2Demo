import { Component, OnInit, OnDestroy, ViewChild, Injector, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { Subscription } from 'rxjs/Subscription';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MntConst } from './../../../shared/services/riMaintenancehelper';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { GlobalConstant } from './../../../shared/constants/global.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { ProductCoverSearchComponent } from './../search/iCABSBProductCoverSearch.component';

@Component({
    templateUrl: 'iCABSCMNatAxJobServiceDetailGroupMaintenance.html'
})

export class JobServiceDetailGroupMaintenanceMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('ProductCoverSearch1') ProductCoverSearch1;
    @ViewChild('ProductCoverSearch2') ProductCoverSearch2;
    @ViewChild('ProductCoverSearch3') ProductCoverSearch3;
    @ViewChild('ProductCoverSearch4') ProductCoverSearch4;
    @ViewChild('ProductCoverSearch5') ProductCoverSearch5;
    @ViewChild('ProductCoverSearch6') ProductCoverSearch6;
    @ViewChild('ProductCoverSearch7') ProductCoverSearch7;
    @ViewChild('ProductCoverSearch8') ProductCoverSearch8;
    @ViewChild('ProductCoverSearch9') ProductCoverSearch9;
    @ViewChild('ProductCoverSearch10') ProductCoverSearch10;

    private riMaintenanceCurrentMode: string;
    private queryParams: any = {
        operation: 'ContactManagement/iCABSCMNatAxJobServiceDetailGroupMaintenance',
        module: 'natax',
        method: 'prospect-to-contract/maintenance',
        actionSave: '6',
        actionSaveConfirm: '5',
        actionInsert: '1'
    };

    public controls: Array<any> = [
        { name: 'ProspectNumber', required: true, disabled: true, type: MntConst.eTypeInteger, commonValidator: true },
        { name: 'ProductCode', required: true, disabled: true, type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDesc', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode1', required: true, commonValidator: true, type: MntConst.eTypeCode },
        { name: 'ProductDetailDesc1', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode2', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDetailDesc2', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode3', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDetailDesc3', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode4', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDetailDesc4', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode5', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDetailDesc5', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode6', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDetailDesc6', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode7', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDetailDesc7', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode8', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDetailDesc8', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode9', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDetailDesc9', disabled: true, type: MntConst.eTypeText },
        { name: 'ProductDetailCode10', type: MntConst.eTypeCode, commonValidator: true },
        { name: 'ProductDetailDesc10', disabled: true, type: MntConst.eTypeText }
    ];

    public pageId: string = '';
    public httpSubscription: Subscription;
    // inputParams for PostCodeSearchComponent Ellipsis
    public ellipsis: any = {
        productCoverSearch1: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp1',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productCoverSearch2: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp2',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productCoverSearch3: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp3',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productCoverSearch4: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp4',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productCoverSearch5: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp5',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productCoverSearch6: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp6',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productCoverSearch7: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp7',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productCoverSearch8: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp8',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productCoverSearch9: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp9',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        },
        productCoverSearch10: {
            autoOpenSearch: false,
            showCloseButton: true,
            childConfigParams: {
                parentMode: 'LookUp10',
                productCode: '',
                productDesc: ''
            },
            contentComponent: ProductCoverSearchComponent,
            showHeader: true,
            searchModalRoute: '',
            disabled: false
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSCMNATAXJOBSERVICEDETAILGROUPMAINTENANCE;
        this.browserTitle = this.pageTitle = 'National Account Job Service Detail Group Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.isReturning()) {
            this.populateUIFromFormData();
        } else {
            this.windowOnLoad();
        }
        this.routeAwayUpdateSaveFlag();
        this.routeAwayGlobals.setEllipseOpenFlag(false);
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
            this.httpSubscription = null;
        }
        this.routeAwayGlobals.resetRouteAwayFlags();
    }

    public windowOnLoad(): void {
        this.setControlValue('ProspectNumber', this.riExchange.getParentHTMLValue('ProspectNumber'));
        this.setControlValue('ProductCode', this.riExchange.getParentHTMLValue('ProductCode'));
        this.setControlValue('ProductDesc', this.riExchange.getParentHTMLValue('ProductDesc'));
        this.pageParams.NatAxJobServiceCoverRowID = this.riExchange.getParentAttributeValue('NatAxJobServiceCoverRowID') || this.riExchange.getParentHTMLValue('NatAxJobServiceCoverRowID');
        this.lookUpCall();
        this.riMaintenanceAddMode();

        let productCode = this.getControlValue('ProductCode');
        let productDesc = this.getControlValue('ProductDesc');

        this.ellipsis.productCoverSearch1.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch1.childConfigParams.productDesc = productDesc;
        this.ellipsis.productCoverSearch2.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch2.childConfigParams.productDesc = productDesc;
        this.ellipsis.productCoverSearch3.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch3.childConfigParams.productDesc = productDesc;
        this.ellipsis.productCoverSearch4.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch4.childConfigParams.productDesc = productDesc;
        this.ellipsis.productCoverSearch5.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch5.childConfigParams.productDesc = productDesc;
        this.ellipsis.productCoverSearch6.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch6.childConfigParams.productDesc = productDesc;
        this.ellipsis.productCoverSearch7.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch7.childConfigParams.productDesc = productDesc;
        this.ellipsis.productCoverSearch8.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch8.childConfigParams.productDesc = productDesc;
        this.ellipsis.productCoverSearch9.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch9.childConfigParams.productDesc = productDesc;
        this.ellipsis.productCoverSearch10.childConfigParams.productCode = productCode;
        this.ellipsis.productCoverSearch10.childConfigParams.productDesc = productDesc;
    }

    // get ProductDesc from Lookup Table Product
    public lookUpCall(): void {
        let lookupIP = [
            {
                'table': 'Product',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductCode': this.getControlValue('ProductCode')
                },
                'fields': ['ProductDesc']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupIP).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError)
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            else {
                let dataProduct = data[0];
                if (dataProduct && dataProduct.length > 0 && dataProduct[0])
                    this.setControlValue('ProductDesc', dataProduct[0].ProductDesc || '');
                else
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        });
    }

    // get Product Detail Descriptions for Lookup Table ProductCover
    public lookUpCallProductDetailCode(e: string): void {
        let ProductDetailCode = 'ProductDetailCode' + e;
        let ProductDetailDesc = 'ProductDetailDesc' + e;
        let lookupIP = [
            {
                'table': 'ProductCover',
                'query': {
                    'BusinessCode': this.businessCode(),
                    'ProductDetailCode': this.getControlValue(ProductDetailCode)
                },
                'fields': ['ProductDetailDesc']
            }
        ];
        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpPromise(lookupIP).then(data => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (data.hasError)
                this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
            else {
                let dataProductCover = data[0];
                if (dataProductCover && dataProductCover.length > 0 && dataProductCover[0] && dataProductCover[0].length > 0)
                    this.setControlValue('ProductDetailDesc', dataProductCover[0].ProductDetailDesc);
                else
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.Message.RecordNotFound));
            }
        }).catch(error => {
            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
        });
    }

    // Product Code on change method
    public productCodeOnChange(data: any): void {
        this.setControlValue('ProductCode', data);
        this.lookUpCall();
    }

    // Product Details Code on change method
    public productDetailCodeChange(data: string): void {
        if (data && data.length > 0) {
            let len = data.length;
            let val = data.substring(len, len - 1);
            this.lookUpCallProductDetailCode(val);
        }
    }

    // Product Detail Code ellipsis return data emitter function
    public setEllipsisReturnData(data: any, id: string): void {
        this.setControlValue('ProductDetailCode' + id, data.ProductDetailCode || '');
        this.setControlValue('ProductDetailDesc' + id, data.ProductDetailDesc || '');
        this.riExchange.riInputElement.MarkAsDirty(this.uiForm, 'ProductDetailCode' + id);
    }

    /*  =========================
        riMaintenance Events execution
        =========================== */
    public riMaintenanceAddMode(): void {
        this.riMaintenanceCurrentMode = MntConst.eModeAdd;
    }

    public riMaintenanceBeforeSaveAdd(): void {
        this.riMaintenanceCurrentMode = MntConst.eModeSaveAdd;
        if (this.getControlValue('ProductDetailCode1') !== null || this.getControlValue('ProductDetailCode1') !== 'undefined') {
            let searchparams: URLSearchParams = this.getURLSearchParamObject();
            searchparams.set(this.serviceConstants.Action, this.queryParams.actionSave);
            let saveData: Object = {};
            saveData['ProductDetailCode1'] = this.getControlValue('ProductDetailCode1') || '';
            saveData['ProductDetailCode2'] = this.getControlValue('ProductDetailCode2') || '';
            saveData['ProductDetailCode3'] = this.getControlValue('ProductDetailCode3') || '';
            saveData['ProductDetailCode4'] = this.getControlValue('ProductDetailCode4') || '';
            saveData['ProductDetailCode5'] = this.getControlValue('ProductDetailCode5') || '';
            saveData['ProductDetailCode6'] = this.getControlValue('ProductDetailCode6') || '';
            saveData['ProductDetailCode7'] = this.getControlValue('ProductDetailCode7') || '';
            saveData['ProductDetailCode8'] = this.getControlValue('ProductDetailCode8') || '';
            saveData['ProductDetailCode9'] = this.getControlValue('ProductDetailCode9') || '';
            saveData['ProductDetailCode10'] = this.getControlValue('ProductDetailCode10') || '';

            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpSubscription = this.httpService.makePostRequest(
                this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchparams, saveData)
                .subscribe((data) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    if (data.hasError)
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    else {
                        this.setControlValue('ProductDetailDesc1', data.ProductDetailDesc1 || '');
                        this.setControlValue('ProductDetailDesc2', data.ProductDetailDesc2 || '');
                        this.setControlValue('ProductDetailDesc3', data.ProductDetailDesc3 || '');
                        this.setControlValue('ProductDetailDesc4', data.ProductDetailDesc4 || '');
                        this.setControlValue('ProductDetailDesc5', data.ProductDetailDesc5 || '');
                        this.setControlValue('ProductDetailDesc6', data.ProductDetailDesc6 || '');
                        this.setControlValue('ProductDetailDesc7', data.ProductDetailDesc7 || '');
                        this.setControlValue('ProductDetailDesc8', data.ProductDetailDesc8 || '');
                        this.setControlValue('ProductDetailDesc9', data.ProductDetailDesc9 || '');
                        this.setControlValue('ProductDetailDesc10', data.ProductDetailDesc10 || '');
                        this.riMaintenanceBeforeConfirm();
                    }
                }, (error) => {
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                });
        } else {
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductDetailCode1', true);
        }
    }

    public riMaintenanceBeforeConfirm(): void {
        let searchparamssaveconfirm: URLSearchParams = this.getURLSearchParamObject();
        searchparamssaveconfirm.set(this.serviceConstants.Action, this.queryParams.actionSaveConfirm);
        let saveConfirm: Object = {};
        saveConfirm['ProductCode'] = this.getControlValue('ProductCode');
        saveConfirm['ProductDetailCode'] = this.getControlValue('ProductDetailCode1');
        saveConfirm['NatAxJobServiceCoverRowID'] = this.pageParams.NatAxJobServiceCoverRowID;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpSubscription = this.httpService.makePostRequest(
            this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchparamssaveconfirm, saveConfirm)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else {
                    if (data.ProductDetailCode1) {
                        this.setControlValue('ProductDetailCode1', data.ProductDetailCode1);
                        this.setControlValue('ProductDetailCode2', data.ProductDetailCode2);
                        this.setControlValue('ProductDetailCode3', data.ProductDetailCode3);
                        this.setControlValue('ProductDetailCode4', data.ProductDetailCode4);
                        this.setControlValue('ProductDetailCode5', data.ProductDetailCode5);
                        this.setControlValue('ProductDetailCode6', data.ProductDetailCode6);
                        this.setControlValue('ProductDetailCode7', data.ProductDetailCode7);
                        this.setControlValue('ProductDetailCode8', data.ProductDetailCode8);
                        this.setControlValue('ProductDetailCode9', data.ProductDetailCode9);
                        this.setControlValue('ProductDetailCode10', data.ProductDetailCode10);
                    }
                    this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
                }
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public save(): void {
        this.riExchange.validateForm(this.uiForm);
        if (this.uiForm.status.toUpperCase() === GlobalConstant.Configuration.Valid) {
            switch (this.riMaintenanceCurrentMode) {
                case 'eModeAdd':
                case 'eModeSaveAdd':
                    this.riMaintenanceExecMode(this.riMaintenanceCurrentMode);
                    break;
            }
        }
    }

    public riMaintenanceExecMode(mode: string): void {
        switch (mode) {
            case 'eModeAdd':
                this.riMaintenanceBeforeSaveAdd();
                break;
            case 'eModeSaveAdd':
                this.confirm();
                break;
        }
    }

    public confirm(): any {
        let modalVO: ICabsModalVO = new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.promptSave.bind(this));
        this.modalAdvService.emitPrompt(modalVO);
    }

    public promptSave(): void {
        let searchparams: URLSearchParams = this.getURLSearchParamObject();
        searchparams.set(this.serviceConstants.Action, this.queryParams.actionInsert);
        let saveData: Object = {};
        saveData['ProspectNumber'] = this.getControlValue('ProspectNumber');
        saveData['ProductCode'] = this.getControlValue('ProductCode');
        saveData['ProductDetailCode1'] = this.getControlValue('ProductDetailCode1');
        saveData['ProductDetailCode2'] = this.getControlValue('ProductDetailCode2');
        saveData['ProductDetailCode3'] = this.getControlValue('ProductDetailCode3');
        saveData['ProductDetailCode4'] = this.getControlValue('ProductDetailCode4');
        saveData['ProductDetailCode5'] = this.getControlValue('ProductDetailCode5');
        saveData['ProductDetailCode6'] = this.getControlValue('ProductDetailCode6');
        saveData['ProductDetailCode7'] = this.getControlValue('ProductDetailCode7');
        saveData['ProductDetailCode8'] = this.getControlValue('ProductDetailCode8');
        saveData['ProductDetailCode9'] = this.getControlValue('ProductDetailCode9');
        saveData['ProductDetailCode10'] = this.getControlValue('ProductDetailCode10');
        saveData['NatAxJobServiceCoverRowID'] = this.pageParams.NatAxJobServiceCoverRowID;

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpSubscription = this.httpService.makePostRequest(
            this.queryParams.method, this.queryParams.module, this.queryParams.operation, searchparams, saveData)
            .subscribe((data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError)
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                else
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
            }, (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public cancel(): void {
        this.riExchange.resetCtrl(this.controls);
        this.riExchange.renderForm(this.uiForm, this.controls);
        this.markAsPrestine();
        this.windowOnLoad();
    }

    // --------------set form fields as pristine-------------//
    public markAsPrestine(): void {
        this.controls.forEach((i) => {
            this.uiForm.controls[i.name].markAsPristine();
            this.uiForm.controls[i.name].markAsUntouched();
        });
    }
    /*
    *  Alerts user when user is moving away without saving the changes. //CR implementation
    */
    public routeAwayUpdateSaveFlag(): void {
        this.uiForm.statusChanges.subscribe((value: any) => {
            if (this.uiForm.dirty) {
                this.routeAwayGlobals.setSaveEnabledFlag(true);
            } else {
                this.routeAwayGlobals.setSaveEnabledFlag(false);
            }
        });
    }
}
