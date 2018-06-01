import { Component, OnInit, Injector, ViewChild, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { ProductServiceGroupSearchComponent } from '../../internal/search/iCABSBProductServiceGroupSearch.component';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';
import { MntConst } from './../../../shared/services/riMaintenancehelper';

@Component({
    templateUrl: 'iCABSBProductServiceGroupMaintenance.html',
    styles: [`
        .red-bdr span {border-color: transparent !important;}
        .colorBack16711680 {
            background-color: #FF0000;
            color: #000000;
        }
        .colorBack65280 {
            background-color: #00FF00;
            color: #000000;
        }
        .colorBack255 {
            background-color: #0000FF;
            color: #000000;
        }
        .colorBack16753920 {
            background-color: #FFA500;
            color: #000000;
        }
        .colorBack16776960 {
            background-color: #FFFF00;
            color: #000000;
        }
        .colorBack8388736 {
            background-color: #800080;
            color: #000000;
        }
        .colorBack15631086 {
            background-color: #FFC0CB;
            color: #000000;
        }
        .colorBack128 {
            background-color: #000080;
            color: #000000;
        }
        .colorBack16711935 {
            background-color: #FF00FF;
            color: #000000;
        }
        .colorBack8421504 {
            background-color: #808080;
            color: #000000;
        }
        .colorBack0 {
            background-color: #000000;
            color: #FFFFFF;
        }
        .colorBack16777215 {
            background-color: #FFFFFF;
            color: #000000;
        }
        .colorBack123 {
            background-color: #FFFFFF;
            color: #000000;
        }
        
        .colorFont16711680 {
            background-color: #FFFFFF;
            color: #FF0000;
        }
        .colorFont65280 {
            background-color: #FFFFFF;
            color: #00FF00;
        }
        .colorFont255 {
            background-color: #FFFFFF;
            color: #0000FF;
        }
        .colorFont16753920 {
            background-color: #FFFFFF;
            color: #FFA500;
        }
        .colorFont16776960 {
            background-color: #FFFFFF;
            color: #FFFF00;
        }
        .colorFont8388736 {
            background-color: #FFFFFF;
            color: #800080;
        }
        .colorFont15631086 {
            background-color: #FFFFFF;
            color: #FFC0CB;
        }
        .colorFont128 {
            background-color: #FFFFFF;
            color: #000080;
        }
        .colorFont16711935 {
            background-color: #FFFFFF;
            color: #FF00FF;
        }
        .colorFont8421504 {
            background-color: #FFFFFF;
            color: #808080;
        }
        .colorFont0 {
            background-color: #FFFFFF;
            color: #000000;
        }
        .colorFont16777215 {
            background-color: #000000;
            color: #FFFFFF;
        }
        .colorFont123 {
            background-color: #FFFFFF;
            color: #000000;
        }
    `]
})

export class ProductServiceGroupMaintenanceComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('routeAwayComponent') public routeAwayComponent;
    @ViewChild('productservice') productservice: ProductServiceGroupSearchComponent;
    @ViewChild('productServiceGroupCode') productServiceGroupCode;

    private queryParams: any = {
        operation: 'Business/iCABSBProductServiceGroupMaintenance',
        module: 'product',
        method: 'service-delivery/admin'
    };
    public selectedSelBackColor: any = 'colorBack123';
    public selectedFontColor: any = 'colorFont123';
    public pageId: string = '';
    public selColourOptions: Array<any> = [
       { value: 16711680, text: 'Red' },
       { value: 65280, text: 'Green' },
       { value: 255, text: 'Blue' },
       { value: 16753920, text: 'Orange' },
       { value: 16776960, text: 'Yellow' },
       { value: 8388736, text: 'Purple' },
       { value: 15631086, text: 'Violet' },
       { value: 128, text: 'Navy' },
       { value: 16711935, text: 'Pink' },
       { value: 8421504, text: 'Grey' },
       { value: 0, text: 'Black' },
       { value: 16777215, text: 'White' }
    ];
    public isAddMode: boolean = false;
    public isValidateProductCode: boolean = false;
    public isValidateProductDesc: boolean = false;
    public productGroupServiceSearchParams: any = {
        params: {
            parentMode: 'LookUp'
        }
    };
    public selectedActive: any = {
        id: '',
        text: ''
    };
    public ProductServiceGroupSearchComponent = ProductServiceGroupSearchComponent;
    public controls = [
        { name: 'ProductServiceGroupCode', value: '', required: true, type: MntConst.eTypeCode },
        { name: 'ProductServiceGroupDesc', value: '', required: true, type: MntConst.eTypeText },
        { name: 'ProductServiceTemplate', value: '', required: false, type: MntConst.eTypeText },
        { name: 'SelFontColour', value: '', required: false },
        { name: 'SelBackgroundColour', value: '', required: false },
        { name: 'BackgroundColour', value: '', required: false },
        { name: 'FontColour', value: '', required: false },
        { name: 'rowId', value: '', required: false }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBPRODUCTSERVICEGROUPMAINTENANCE;
        this.pageTitle = this.browserTitle = 'Product Service Group Maintenance';
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.pageParams.isAddhide = true;
        this.pageParams.isDeleteDisabled = true;
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    /**
     * Receive API data from API code search
     */

    private resetForm(): void {
        this.clearControls([]);
    }

    private fetchData(): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '0');
        search.set('ProductServiceGroupCode', this.getControlValue('ProductServiceGroupCode'));
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search).subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    for (let contrl in data) {
                        if (data.hasOwnProperty(contrl)) {
                            this.setControlValue(contrl, data[contrl]);
                            switch (contrl) {
                                case 'FontColour':
                                    this.setControlValue('SelFontColour',data[contrl]);
                                    this.selectedFontColor = 'colorFont' + data[contrl];
                                    break;
                                case 'BackgroundColour':
                                    this.setControlValue('SelBackgroundColour',data[contrl]);
                                    this.selectedSelBackColor = 'colorBack' + data[contrl];
                                    break;
                                case 'ttProductServiceGroup':
                                    this.setControlValue('rowId', data[contrl]);
                                    break;
                            }
                        }
                    }
                }
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            }
        );
    }

    private beforeAddMode(): void {
        this.resetForm();
    }

    private addProductGroup(data: any): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '1');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, data)
            .subscribe(
            (data) => {
                this.uiForm.controls['ProductServiceGroupCode'].markAsUntouched();
                this.uiForm.controls['ProductServiceGroupDesc'].markAsUntouched();
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                this.setControlValue('rowId', data.ttProductServiceGroup);
                this.setControlValue('ProductServiceGroupCode', data.ProductServiceGroupCode);
                this.selectedFontColor = 'colorFont123';
                this.selectedSelBackColor = 'colorBack123';
                this.resetForm();
                this.formPristine();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private updateProductGroup(data: any): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '2');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, data)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.SavedSuccessfully));
                this.pageParams.mode = 'update';
                this.formPristine();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private deleteProductGroup(data: any): void {
        let search: URLSearchParams = this.getURLSearchParamObject();
        search.set(this.serviceConstants.Action, '3');
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, search, data)
            .subscribe(
            (data) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                    return;
                }
                this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                this.afterDelete();
                this.formPristine();
            },
            (error) => {
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
            });
    }

    private promptConfirm(): void {
        let formdData: any = {};
        if (this.pageParams.mode !== 'delete') {
            formdData['ProductServiceGroupCode'] = this.getControlValue('ProductServiceGroupCode');
            formdData['ProductServiceGroupDesc'] = this.getControlValue('ProductServiceGroupDesc');
            formdData['ProductServiceTemplate'] = this.getControlValue('ProductServiceTemplate');
            formdData['FontColour'] = this.getControlValue('FontColour');
            formdData['BackgroundColour'] = this.getControlValue('BackgroundColour');
            if (this.pageParams.mode === 'update' && this.getControlValue('rowId')) {
                formdData['ROWID'] = this.getControlValue('rowId');
                this.updateProductGroup(formdData);
            } else {
                this.addProductGroup(formdData);
            }
        } else {
            formdData['ROWID'] = this.getControlValue('rowId');
            this.deleteProductGroup(formdData);
        }
    }

    private afterDelete(): void {
        this.pageParams.isDeleteDisabled = true;
        this.productservice.fetchData();
    }

    private onConfirmCallback(): void {
        this.promptConfirm();
    }

    public getBGClass(value: string): string {
        return 'colorBack' + value;
    }

    public getFontClass(value: string): string {
        return 'colorFont' + value;
    }

    public onProductGroupDataReceived(Obj: any): void {
        this.setControlValue('ProductServiceGroupCode', Obj.ProductServiceGroupCode);
        this.fetchData();
    }

    public getDefaultInfo(event: any): void {
        this.uiForm.controls['ProductServiceGroupCode'].markAsUntouched();
        this.uiForm.controls['ProductServiceGroupDesc'].markAsUntouched();
        if (event.totalRecords) {
            this.pageParams.mode = 'update';
            this.selectedActive = {
                id: event.firstRow.ProductServiceGroupCode,
                text: event.firstRow.ProductServiceGroupCode + ' - ' + event.firstRow.ProductServiceGroupDesc
            };
            this.setControlValue('ProductServiceGroupCode', event.firstRow.ProductServiceGroupCode);
            this.isAddMode = false;
            this.pageParams.isAddhide = true;
            this.pageParams.isDeleteDisabled = true;
            this.fetchData();
        } else {
            this.pageParams.mode = 'add';
            this.isAddMode = true;
            this.pageParams.isAddhide = false;
        }
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductServiceGroupDesc', this.pageParams.mode === 'add' ? true : false);
    }

    public deleteData(): void {
        this.pageParams.mode = 'delete';
        let promptVO: ICabsModalVO = new ICabsModalVO();
        promptVO.confirmCallback = this.onConfirmCallback.bind(this);
        promptVO.msg = MessageConstant.Message.DeleteRecord;
        this.modalAdvService.emitPrompt(promptVO);
    }

    public onCancelClick(): void {
        if (this.pageParams.mode === 'add') {
            this.productservice.fetchData();
        } else {
            this.fetchData();
        }
    }

    public onAddClick(): void {
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductServiceGroupDesc',true);
        this.pageParams.isAddhide = false;
        this.isAddMode = true;
        this.pageParams.mode = 'add';
        this.pageParams.isDeleteDisabled = false;
        this.selectedSelBackColor = 'colorBack123';
        this.selectedFontColor = 'colorFont123';
        this.beforeAddMode();
        setTimeout(() => {
            this.productServiceGroupCode.nativeElement.focus();
        }, 0);
    }

    public saveData(): void {
        if (this.pageParams.mode !== 'add') {
            this.pageParams.mode = 'update';
        }
        let promptVO: ICabsModalVO = new ICabsModalVO();
        promptVO.confirmCallback = this.onConfirmCallback.bind(this);
        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ProductServiceGroupDesc', this.pageParams.mode === 'add' ? true : false);
        if (this.pageParams.mode !== 'delete') {
            if (this.uiForm.valid && !this.isValidateProductCode && !this.isValidateProductDesc) {
                if (this.getControlValue('FontColour').toString() !== this.getControlValue('BackgroundColour').toString()) {
                    promptVO.msg = MessageConstant.Message.ConfirmRecord;
                    this.modalAdvService.emitPrompt(promptVO);
                } else
                    this.modalAdvService.emitError(new ICabsModalVO(MessageConstant.PageSpecificMessage.colorMisMatch));
            } else {
                this.riExchange.riInputElement.isError(this.uiForm,'ProductServiceGroupCode');
                this.riExchange.riInputElement.isError(this.uiForm,'ProductServiceGroupDesc');
            }
        }
    }

    public onSelFontColourOptionsChange(obj: any): void {
        this.setControlValue('FontColour', obj);
        this.selectedFontColor = 'colorFont' + obj;
    }

    public onSelBackgroundColourOptionsChange(obj: any): void {
        this.setControlValue('BackgroundColour', obj);
        this.selectedSelBackColor = 'colorBack' + obj;
    }

    public onProductCodeFieldChange(event: any): void {
        let value = event.target.value;
        if (value.includes('"') || value === '?') {
            this.isValidateProductCode = true;
        } else {
            this.isValidateProductCode = false;
        }
    }

    public onProductDescFieldChange(event: any): void {
        let value = event.target.value;
        if (value.includes('"') || value === '?') {
            this.isValidateProductDesc = true;
        } else {
            this.isValidateProductDesc = false;
        }
    }

}
