import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Injector, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BaseComponent } from './../../base/BaseComponent';
import { MessageConstant } from './../../../shared/constants/message.constant';
import { Http, URLSearchParams } from '@angular/http';
import { PageIdentifier } from './../../base/PageIdentifier';
import { MessageCallback, ErrorCallback } from './../../base/Callback';

@Component({
    templateUrl: 'iCABSSeDataChangeMaintenance.html'
})

export class DataChangeMaintenanceComponent extends BaseComponent implements OnInit, AfterViewInit {
    @ViewChild('messageModal') public messageModal;
    @ViewChild('errorModal') public errorModal;
    @ViewChild('promptModalForSave') public promptModalForSave;
    @ViewChild('routeAwayComponent') public routeAwayComponent;

    public pageId: string = '';
    public pageTitle: string = '';
    public search: URLSearchParams = new URLSearchParams();
    public errorMessage: string;
    public showCloseButton: boolean = true;
    public hiddenField: boolean = false;
    public messageContentError: string = MessageConstant.Message.SaveError;
    public messageContentSave: string = MessageConstant.Message.SavedSuccessfully;
    public showMessageHeaderSave: boolean = true;
    public showPromptCloseButtonSave: boolean = true;
    public AmendedValueMode: boolean = false;
    public originalValueMode: boolean = false;
    public promptTitleSave: string = '';
    public promptContentSave: string = MessageConstant.Message.ConfirmRecord;
    public currentContractType: string = '';
    public amendedValue: string = '';
    public showStar: boolean = true;
    public setFocusAmendedValue = new EventEmitter<boolean>();
    public promptModalConfigSave = {
        ignoreBackdropClick: true
    };

    public queryParams: any = {
        module: 'pda',
        operation: 'Service/iCABSSeDataChangeMaintenance',
        method: 'contract-management/maintenance'
    };

    public controls = [
        { name: 'ContractNumber', readonly: true, disabled: false, required: false },
        { name: 'ContractName', readonly: true, disabled: false, required: false },
        { name: 'PremiseNumber', readonly: true, disabled: false, required: false },
        { name: 'PremiseName', readonly: true, disabled: false, required: false },
        { name: 'ProductCode', readonly: true, disabled: false, required: false },
        { name: 'ProductDesc', readonly: true, disabled: false, required: false },
        { name: 'FieldName', readonly: true, disabled: false, required: false },
        { name: 'OriginalValue', readonly: true, disabled: false, required: false },
        { name: 'AmendedValue' }
    ];

    constructor(injector: Injector) {
        super(injector);
        this.pageId = PageIdentifier.ICABSSEDATACHANGEMAINTENANCE;
    };

    public ngOnInit(): void {
        super.ngOnInit();
        if (this.parentMode === 'UpdatedValue') {
            this.hiddenField = true;
            this.AmendedValueMode = true;
            this.originalValueMode = false;
            this.showStar = false;
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'ContractNumber', true);
            this.riExchange.riInputElement.SetRequiredStatus(this.uiForm, 'PremiseNumber', true);

        } else {
            this.AmendedValueMode = false;
            this.originalValueMode = true;
        }
        this.window_onload();
        this.pageTitle = 'Customer Data Change';
        this.utils.setTitle('Customer Data Maintenance');
    };

    public ngAfterViewInit(): void {
        this.setFormMode(this.c_s_MODE_UPDATE);
    };

    public showMessageModal(data: any): void {
        this.messageModal.show({ msg: data.msg, title: 'Message' }, false);
    }

    public window_onload(): void {
        let formdata: Object = {};
        this.currentContractType = this.riExchange.getParentAttributeValue('CurrentContractType');
        this.search.set(this.serviceConstants.BusinessCode, this.utils.getBusinessCode());
        this.search.set(this.serviceConstants.CountryCode, this.utils.getCountryCode());
        this.search.set(this.serviceConstants.Action, '0');
        this.search.set(this.serviceConstants.Function, 'Fetch');
        this.search.set('PDAICABSDataChangeRowID', this.currentContractType);
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makeGetRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, this.search)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.messageModal.show(data, true);
                } else {
                    this.setControlValue('ContractNumber', data.ContractNumber);
                    this.setControlValue('ContractName', data.ContractName);
                    this.setControlValue('PremiseNumber', data.PremiseNumber);
                    this.setControlValue('PremiseName', data.PremiseName);
                    this.setControlValue('ProductCode', data.ProductCode);
                    this.setControlValue('ProductDesc', data.ProductDesc);
                    this.setControlValue('FieldName', this.riExchange.getParentAttributeValue('FieldName'));
                    this.setControlValue('OriginalValue', data.OriginalValue);
                    this.setControlValue('AmendedValue', data.AmendedValue);
                    this.amendedValue = data.AmendedValue;
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            }
            );
    };

    //save prompt
    public dataChangeSave(): void {
        this.promptModalForSave.show();
    };

    // Implementation of save logic
    public promptContentSaveData(eventObj: any): void {
        let formdata: Object = {};
        let queryPost: URLSearchParams = this.getURLSearchParamObject();
        queryPost.set(this.serviceConstants.Action, '2');
        formdata['RowID'] = this.currentContractType;
        formdata['UpdatedValue'] = this.getControlValue('AmendedValue');
        this.amendedValue = this.getControlValue('AmendedValue');
        formdata[this.serviceConstants.ContractNumber] = this.getControlValue('ContractNumber');
        formdata[this.serviceConstants.PremiseNumber] = this.getControlValue('PremiseNumber');
        this.queryParams.search = queryPost;
        this.ajaxSource.next(this.ajaxconstant.START);
        this.httpService.makePostRequest(this.queryParams.method, this.queryParams.module, this.queryParams.operation, queryPost, formdata)
            .subscribe(
            (data) => {
                if (data.hasError) {
                    this.messageModal.show(data, true);
                } else {
                    this.showMessageModal({ msg: this.messageContentSave });
                }
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
                this.formPristine();
            },
            (error) => {
                this.messageModal.show(error, true);
                this.ajaxSource.next(this.ajaxconstant.COMPLETE);
            });
    };

    //Cancel
    public resetForm(): void {
        this.setControlValue('AmendedValue', this.amendedValue);


    };
}
