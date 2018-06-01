import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { MessageConstant } from './../../../shared/constants/message.constant';
import { ProductSearchGridComponent } from './../search/iCABSBProductSearch';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';

@Component({
    templateUrl: 'iCABSBValidLinkedProductsMaintenance.html'
})

export class ValidLinkedProductsMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    private mode: string;
    private linkedValidProductRowID: any;
    private headerParams: any = {
        operation: 'Business/iCABSBValidLinkedProductsMaintenance',
        module: 'product',
        method: 'service-delivery/admin'
    };

    public pageId: string = '';
    public controls: Array<Object> = [
        { name: 'ParentProductCode', required: true },
        { name: 'ParentProductDesc', disabled: true },
        { name: 'ChildProductCode', required: true },
        { name: 'ChildProductDesc', disabled: true },
        { name: 'btnSave' },
        { name: 'btnCancel' },
        { name: 'btnDelete' }
    ];

    public ellipsisConfig: any = {
        parentProduct: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-Linked'
            },
            component: ProductSearchGridComponent
        },
        childProduct: {
            disabled: false,
            showHeader: true,
            showCloseButton: true,
            childConfigParams: {
                'parentMode': 'LookUp-Linked'
            },
            component: ProductSearchGridComponent
        }
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBVALIDLINKEDPRODUCTSMAINTENANCE;
        this.browserTitle = 'Linked Product Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageTitle = 'Valid Linked Product Maintenance';
        this.windowOnLoad();
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    private windowOnLoad(): void {
        if (this.parentMode === 'View') {
            this.ellipsisConfig.parentProduct.disabled = true;
            this.ellipsisConfig.childProduct.disabled = true;
            this.disableControl('ParentProductCode', true);
            this.disableControl('ChildProductCode', true);
            this.setControlValue('ParentProductCode', this.riExchange.getParentAttributeValue('BusinessCode_ParentProductCode'));
            this.setControlValue('ChildProductCode', this.riExchange.getParentAttributeValue('BusinessCode_ChildProductCode'));
            this.fetchProductDesc();
        }
    }

    private fetchProductDesc(): void {
        let lookUp: Array<any> = [{
            'table': 'Product',
            'query': {
                'BusinessCode': this.businessCode(),
                'ProductCode': this.getControlValue('ParentProductCode')
            },
            'fields': ['ProductDesc']
        }, {
            'table': 'Product',
            'query': {
                'BusinessCode': this.businessCode(),
                'ProductCode': this.getControlValue('ChildProductCode')
            },
            'fields': ['ProductDesc']
        }];

        this.ajaxSource.next(this.ajaxconstant.START);
        this.LookUp.lookUpRecord(lookUp).subscribe((data) => {
            let parentProductDetail: any = data[0][0];
            let childProductDetail: any = data[1][0];

            this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            if (parentProductDetail) {
                this.setControlValue('ParentProductDesc', parentProductDetail.ProductDesc);
            } else {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'ParentProductCode');
                this.setControlValue('ParentProductDesc', '');
            }

            if (childProductDetail) {
                this.setControlValue('ChildProductDesc', childProductDetail.ProductDesc);
            } else {
                this.riExchange.riInputElement.markAsError(this.uiForm, 'ChildProductCode');
                this.setControlValue('ChildProductDesc', '');
            }

            if (this.parentMode === 'Add') {
                if (parentProductDetail && childProductDetail) {
                    this.promptConfirm();
                }
            } else {
                this.fetchRecord();
            }
        });
    }

    private fetchRecord(): void {
        let fetchParams: URLSearchParams = new URLSearchParams();
        fetchParams.set(this.serviceConstants.Action, '2');
        fetchParams.set(this.serviceConstants.BusinessCode, this.businessCode());
        fetchParams.set(this.serviceConstants.CountryCode, this.countryCode());

        fetchParams.set('ParentProductCode', this.getControlValue('ParentProductCode'));
        fetchParams.set('ParentProductDesc', this.getControlValue('ParentProductDesc'));
        fetchParams.set('ChildProductCode', this.getControlValue('ChildProductCode'));
        fetchParams.set('ChildProductDesc', this.getControlValue('ChildProductDesc'));

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, fetchParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
                else {
                    this.linkedValidProductRowID = data.ttLinkedValidProduct;
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private addRecord(): void {
        let addQueryParams: URLSearchParams = new URLSearchParams();
        addQueryParams.set('businessCode', this.utils.getBusinessCode());
        addQueryParams.set('countryCode', this.utils.getCountryCode());
        addQueryParams.set('action', '1');

        let bodyParams: Object = {
            'ParentProductCode': this.getControlValue('ParentProductCode'),
            'ChildProductCode': this.getControlValue('ChildProductCode'),
            'ParentProductDesc': this.getControlValue('ParentProductDesc'),
            'ChildProductDesc': this.getControlValue('ChildProductDesc')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, addQueryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
                else {
                    this.formPristine();
                    this.location.back();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private deleteRecord(): void {
        let deleteQueryParams: URLSearchParams = new URLSearchParams();
        deleteQueryParams.set('businessCode', this.utils.getBusinessCode());
        deleteQueryParams.set('countryCode', this.utils.getCountryCode());
        deleteQueryParams.set('action', '3');

        let bodyParams: Object = {
            'LinkedValidProductROWID': this.linkedValidProductRowID,
            'ParentProductCode': this.getControlValue('ParentProductCode'),
            'ChildProductCode': this.getControlValue('ChildProductCode')
        };

        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.headerParams.method, this.headerParams.module, this.headerParams.operation, deleteQueryParams, bodyParams).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                }
                else {
                    this.location.back();
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    public productSearch(data: any, type: string): void {
        switch (type) {
            case 'parent':
                this.setControlValue('ParentProductCode', data.ProductCode);
                break;

            case 'child':
                this.setControlValue('ChildProductCode', data.ProductCode);
                break;
        }
    }

    public onProductCodeChange(value: any, type: string): void {
        this.setControlValue(type, value.toUpperCase());
    }

    public beforeSave(): void {
        if (this.riExchange.validateForm(this.uiForm)) {
            this.fetchProductDesc();
        }
    }

    public promptConfirm(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null, this.addRecord.bind(this)));
    }

    public promptDelete(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.DeleteRecord, null, this.deleteRecord.bind(this)));
    }

    public onCancel(): void {
        this.location.back();
    }

}
