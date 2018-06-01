import { Component, AfterViewInit, Injector, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../app/base/BaseComponent';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageConstant } from '../../../shared/constants/message.constant';
import { MntConst } from '../../../shared/services/riMaintenancehelper';
import { RouteAwayComponent } from '../../../shared/components/route-away/route-away';
import { ScreenNotReadyComponent } from './../../../shared/components/screenNotReady';
import { ProductDetailSearchComponent } from '../search/iCABSBProductDetailSearch.component';
import { ICabsModalVO } from './../../../shared/components/modal-adv/modal-adv-vo';

@Component({
    templateUrl: 'iCABSBProductDetailMaintenance.html'
})

export class ProductDetailMaintenanceComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModalForSave') public promptModalForSave;
    @ViewChild('promptModalForDelete') public promptModalForDelete;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public pageId: string = '';
    public queryPost: URLSearchParams = this.getURLSearchParamObject();
    public rowID: string = '';
    public recordID: string = '';
    public isSaveDisabled: boolean = true;
    public isCancelDisabled: boolean = true;
    public isDeleteDisabled: boolean = true;
    public isInfestationDisabled: boolean = true;
    public isAutoOpen: boolean = false;
    public modalConfig: any = {
        backdrop: 'static',
        keyboard: true
    };

    public productDetailSearchComponent = ProductDetailSearchComponent;
    // TODO: InfestationGroupSearchComponent not yet developed
    // public infestationGroupSearchComponent = InfestationGroupSearchComponent;
    public infestationGroupSearchComponent = ScreenNotReadyComponent;
    public inputParams = {
        parentMode: 'Search',
        isShowAddNew: true
    };
    public controls = [
        { name: 'ProductDetailCode', disabled: false, required: true, type: MntConst.eTypeCode },
        { name: 'ProductDetailDesc', disabled: true, required: true, type: MntConst.eTypeText },
        { name: 'InfestationGroupCode', disabled: true, required: true, type: MntConst.eTypeCode },
        { name: 'InfestationGroupDesc', disabled: true, required: false, type: MntConst.eTypeText },
        { name: 'PassToPDAInd', disabled: true, required: false },
        { name: 'SortOrder', disabled: true, required: false, type: MntConst.eTypeInteger }
    ];

    public muleConfig = {
        method: 'contract-management/admin',
        module: 'contract-admin',
        operation: 'Business/iCABSBProductDetailMaintenance'
    };

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSBPRODUCTDETAILMAINTENANCE;
        this.browserTitle = this.pageTitle = 'Product Detail Maintenance';
    };

    ngOnInit(): void {
        super.ngOnInit();
    };

    ngOnDestroy(): void {
        super.ngOnDestroy();
    };

    public ngAfterViewInit(): void {
        this.setFormMode(this.c_s_MODE_SELECT);
        this.setControlValue('PassToPDAInd', false);
        this.isAutoOpen = true;
        this.disableFeilds({
            Save: true,
            Cancel: true,
            Delete: true
        });
        this.pageParams = {
            ProductDetailCode: '',
            ProductDetailDesc: '',
            InfestationGroupCode: '',
            InfestationGroupDesc: '',
            PassToPDAInd: '',
            SortOrder: ''
        };
    };

    public showErrorModal(data: any): void {
        this.errorModal.show({ msg: data.msg, title: 'Error' }, false);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    };

    // Product Detail Code/Description Search - Tabout
    public productDetailCodeTabout(): void {
        if (this.formMode === this.c_s_MODE_ADD) {
            return;
        }
        if (this.getControlValue('ProductDetailCode')) {
            this.setControlValue('ProductDetailCode', this.getControlValue('ProductDetailCode').toUpperCase());
            let queryPost: URLSearchParams = this.getURLSearchParamObject();
            queryPost.set(this.serviceConstants.Action, '0');
            queryPost.set(this.serviceConstants.BusinessCode, this.businessCode());
            queryPost.set('ProductDetailCode', this.getControlValue('ProductDetailCode'));
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makeGetRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, queryPost)
                .subscribe(
                (data) => {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.riExchange.riInputElement.markAsError(this.uiForm, 'ProductDetailCode');
                    } else {
                        this.isAutoOpen = false;
                        this.setFormMode(this.c_s_MODE_UPDATE);
                        this.setControlValue('ProductDetailDesc', data.ProductDetailDesc);
                        this.setControlValue('InfestationGroupCode', data.InfestationGroupCode);
                        this.setControlValue('PassToPDAInd', data.PassToPDAInd);
                        this.setControlValue('SortOrder', data.SortOrder);
                        this.infestationGroupCodeTabout(true);
                        this.rowID = data.ttProductDetail;
                        this.recordID = data.RecordID;
                        this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InfestationGroupCode', true);
                        this.riExchange.riInputElement.Enable(this.uiForm, 'InfestationGroupCode');
                        this.disableFeilds({
                            Save: false,
                            Cancel: false,
                            Delete: false,
                            ProductDetailCode: true,
                            ProductDetailDesc: false,
                            PassToPDAInd: false,
                            SortOrder: false,
                            InfestationEllipsis: false
                        });
                        this.setPageParams();
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        }
    };

    // Infestation Group Search - Tabout
    public infestationGroupCodeTabout(flag: boolean): void {
        if (this.getControlValue('InfestationGroupCode')) {
            this.queryPost.set(this.serviceConstants.Action, '0');
            let formdata: Object = {
                BusinessCode: this.businessCode(),
                InfestationGroupCode: this.getControlValue('InfestationGroupCode')
            };
            this.ajaxSource.next(this.ajaxconstant.START);
            this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
                .subscribe(
                (data) => {
                    if (data.hasError) {
                        this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                        this.riExchange.riInputElement.markAsError(this.uiForm, 'InfestationGroupCode');
                    } else {
                        this.setControlValue('InfestationGroupDesc', data.InfestationGroupDesc);
                        if (flag) this.pageParams.InfestationGroupDesc = data.InfestationGroupDesc;
                    }
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                },
                (error) => {
                    this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                    this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                });
        };
    };

    public setProductDetailCode(data: any): void {
        this.isAutoOpen = false;
        if (data.addMode) {
            this.setFormMode(this.c_s_MODE_ADD);
            this.disableFeilds({
                Save: false,
                Cancel: false,
                Delete: true,
                ProductDetailCode: false,
                ProductDetailDesc: false,
                InfestationGroupCode: false,
                InfestationGroupDesc: true,
                PassToPDAInd: false,
                SortOrder: false,
                InfestationEllipsis: false
            });
            this.clearControls([]);
        }
        else {
            this.setFormMode(this.c_s_MODE_UPDATE);
            this.disableFeilds({
                Save: false,
                Cancel: false,
                Delete: false,
                ProductDetailCode: true,
                ProductDetailDesc: false,
                InfestationGroupCode: false,
                InfestationGroupDesc: true,
                PassToPDAInd: false,
                SortOrder: false,
                InfestationEllipsis: false
            });
            this.setControlValue('ProductDetailCode', data.ProductDetailCode);
            this.setControlValue('ProductDetailDesc', data.ProductDetailDesc);
            this.setControlValue('InfestationGroupCode', data.InfestationGroupCode);
            this.setControlValue('PassToPDAInd', data.PassToPDAInd);
            this.setControlValue('SortOrder', data.SortOrder);
            this.infestationGroupCodeTabout(true);
            this.rowID = data.ttProductDetail;
            this.recordID = data.RecordID;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'InfestationGroupCode', true);
            this.riExchange.riInputElement.Enable(this.uiForm, 'InfestationGroupCode');
            this.setPageParams();
        }
    };

    public setPageParams(): void {
        this.pageParams.ProductDetailCode = this.getControlValue('ProductDetailCode');
        this.pageParams.ProductDetailDesc = this.getControlValue('ProductDetailDesc');
        this.pageParams.InfestationGroupCode = this.getControlValue('InfestationGroupCode');
        this.pageParams.PassToPDAInd = this.getControlValue('PassToPDAInd');
        this.pageParams.SortOrder = this.getControlValue('SortOrder');
    }
    public setInfestationGroupCode(data: any): void {
        // TODO: InfestationGroupSearchComponent not yet developed
    };

    // Add Product Detail
    public addProductDetail(mode: any): void {
        this.setFormMode(this.c_s_MODE_ADD);
        this.uiForm.reset();
    };

    // Promt for Saving Product Detail
    public promptForSaveProductDetail(): void {
        if (this.riExchange.validateForm(this.uiForm))
            this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.ConfirmRecord, null,
                this.saveProductDetail.bind(this)));
    }

    public saveProductDetail(): void {
        let formdata: any;
        if (this.formMode === this.c_s_MODE_ADD) {
            this.queryPost.set(this.serviceConstants.Action, '1');
            formdata = {
                BusinessCode: this.businessCode(),
                ProductDetailCode: this.getControlValue('ProductDetailCode'),
                ProductDetailDesc: this.getControlValue('ProductDetailDesc'),
                InfestationGroupCode: this.getControlValue('InfestationGroupCode'),
                PassToPDAInd: this.getControlValue('PassToPDAInd') ? 'true' : 'false',
                SortOrder: this.getControlValue('SortOrder')
            };
        } else {
            this.queryPost.set(this.serviceConstants.Action, '2');
            formdata = {
                BusinessCode: this.businessCode(),
                ProductDetailCode: this.getControlValue('ProductDetailCode'),
                ProductDetailDesc: this.getControlValue('ProductDetailDesc'),
                InfestationGroupCode: this.getControlValue('InfestationGroupCode'),
                PassToPDAInd: this.getControlValue('PassToPDAInd') ? 'true' : 'false',
                SortOrder: this.getControlValue('SortOrder'),
                ROWID: this.rowID
            };
        }
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordSavedSuccessfully));
                    this.rowID = data.ttProductDetail;
                    this.recordID = data.RecordID;
                    this.setFormMode(this.c_s_MODE_UPDATE);
                    this.setPageParams();
                    this.pageParams.InfestationGroupDesc = this.getControlValue('InfestationGroupDesc');
                    this.disableFeilds({
                        Save: false,
                        Cancel: false,
                        Delete: false,
                        ProductDetailCode: true,
                        ProductDetailDesc: false,
                        InfestationEllipsis: false
                    });
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    public cancelProductDetail(): void {
        if (this.formMode !== this.c_s_MODE_SELECT)
            if (this.formMode === this.c_s_MODE_ADD) {
                this.setFormMode(this.c_s_MODE_SELECT);
                this.isAutoOpen = true;
                 this.disableFeilds({
                            Save: true,
                            Cancel: true,
                            Delete: true,
                            ProductDetailCode: false,
                            ProductDetailDesc: true,
                            InfestationGroupCode: true,
                            InfestationGroupDesc: true,
                            PassToPDAInd: true,
                            SortOrder: true,
                            InfestationEllipsis: true
                        });
                this.uiForm.reset();
            } else {
                this.setFormMode(this.c_s_MODE_UPDATE);
                this.setControlValue('ProductDetailCode', this.pageParams.ProductDetailCode);
                this.setControlValue('ProductDetailDesc', this.pageParams.ProductDetailDesc);
                this.setControlValue('InfestationGroupCode', this.pageParams.InfestationGroupCode);
                this.setControlValue('InfestationGroupDesc', this.pageParams.InfestationGroupDesc);
                this.setControlValue('PassToPDAInd', this.pageParams.PassToPDAInd);
                this.setControlValue('SortOrder', this.pageParams.SortOrder);
            }
        this.formPristine();
    };

    // Promt for Deleting Product Detail
    public promptForDeleteProductDetail(): void {
        this.modalAdvService.emitPrompt(new ICabsModalVO(MessageConstant.Message.DeleteRecord, null,
            this.deleteProductDetail.bind(this)));
    }

    public deleteProductDetail(): void {
        this.queryPost.set(this.serviceConstants.Action, '3');
        let formdata: any = {
            BusinessCode: this.businessCode(),
            ROWID: this.rowID
        };
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.muleConfig.method, this.muleConfig.module, this.muleConfig.operation, this.queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.modalAdvService.emitError(new ICabsModalVO(data.errorMessage, data.fullError));
                } else {
                    this.modalAdvService.emitMessage(new ICabsModalVO(MessageConstant.Message.RecordDeletedSuccessfully));
                    this.uiForm.reset();
                    this.disableFeilds({
                        Save: true,
                        Cancel: true,
                        Delete: true,
                        ProductDetailCode: false,
                        ProductDetailDesc: true,
                        InfestationGroupCode: true,
                        InfestationEllipsis: true,
                        PassToPDAInd: true,
                        SortOrder: true
                    });
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.modalAdvService.emitError(new ICabsModalVO(error.errorMessage, error.fullError));
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };


    public disableFeilds(fields: any): void {
        for (let field in fields) {
            if (fields.hasOwnProperty(field)) {
                let fieldBoolean = fields[field];
                switch (field) {
                    case 'Save':
                        this.isSaveDisabled = fieldBoolean;
                        break;
                    case 'Cancel':
                        this.isCancelDisabled = fieldBoolean;
                        break;
                    case 'Delete':
                        this.isDeleteDisabled = fieldBoolean;
                        break;
                    case 'InfestationEllipsis':
                        this.isInfestationDisabled = fieldBoolean;
                        break;
                    default:
                        this.disableControl(field, fieldBoolean);
                        break;
                }
            }
        }
    }

}
